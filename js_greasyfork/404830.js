// ==UserScript==
// @name        Itch.io Web Integration
// @namespace   Lex@GreasyFork
// @match       *://*.itch.io/*
// @match       *://*.steamgifts.com/discussion/*
// @match       *://*.keylol.com/*
// @match       *://*.reddit.com/r/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1.8.8
// @author      Lex
// @description Shows if an Itch.io link has been claimed or not
// @connect     itch.io
// @downloadURL https://update.greasyfork.org/scripts/404830/Itchio%20Web%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/404830/Itchio%20Web%20Integration.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const CACHE_VERSION_KEY = "CacheVersion";
    const INVALIDATION_TIME = 5*60*60*1000; // 5 hour cache time
    const ITCH_GAME_CACHE_KEY = 'ItchGameCache';
    var ItchGameCache;
    
    // Promise wrapper for GM_xmlhttpRequest
    const Request = details => new Promise((resolve, reject) => {
        details.onerror = details.ontimeout = reject;
        details.onload = resolve;
        GM_xmlhttpRequest(details);
    });
    
    function versionCacheInvalidator() {
        const sVersion = v => {
            if (typeof v !== 'string' || !v.match(/\d+\.\d+/)) return 0;
            return parseFloat(v.match(/\d+\.\d+/)[0]);
        }
        const prev = sVersion(GM_getValue(CACHE_VERSION_KEY, '0.0'));
        if (prev < 0.1) {
            console.log(`${GM_info.script.version} > ${prev}`);
            console.log(`New minor version of ${GM_info.script.name} detected. Invalidating cache.`)
            _clearItchCache();
        }
        GM_setValue(CACHE_VERSION_KEY, GM_info.script.version);
    }
    
    function _clearItchCache() {
        ItchGameCache = {};
        _saveItchCache();
    }
    
    function loadItchCache() {
        ItchGameCache = JSON.parse(GM_getValue(ITCH_GAME_CACHE_KEY, '{}'));
    }
    
    function _saveItchCache() {
        if (ItchGameCache === undefined) return;
        GM_setValue(ITCH_GAME_CACHE_KEY, JSON.stringify(ItchGameCache));
    }
    
    function setItchGameCache(key, game) {
        loadItchCache(); // refresh our cache in case another tab has edited it
        ItchGameCache[key] = game;
        _saveItchCache();
    }
    
    function deleteItchGameCache(key) {
        if (key === undefined) return;
        loadItchCache();
        delete ItchGameCache[key];
        _saveItchCache();
    }
    
    function getItchGameCache(link) {
        if (!ItchGameCache) loadItchCache();
        if (Object.prototype.hasOwnProperty.call(ItchGameCache, link)) {
            return ItchGameCache[link];
        }
        return null;
    }
    
    async function claimGame(url) {
        const parser = new DOMParser();
        
        const purchase_url = url + "/purchase";
        console.log("Getting purchase page: " + purchase_url);
        const purchase_resp = await Request({method: "GET", url: purchase_url});
        const purchase_dom = parser.parseFromString(purchase_resp.responseText, 'text/html');
        const download_csrf_token = purchase_dom.querySelector("form.form").csrf_token.value;
        
        const download_url_resp = await Request({
            method: "POST",
            url: url + "/download_url",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: 'csrf_token='+encodeURIComponent(download_csrf_token)
        });
        const downloadUrl = JSON.parse(download_url_resp.responseText).url;
        console.log("Received download url: " + downloadUrl);

        const download_resp = await Request({method: "GET", url: downloadUrl});
        const dom = parser.parseFromString(download_resp.responseText, 'text/html');
        const claimForm = dom.querySelector(".claim_to_download_box form");
        const claim_csrf_token = claimForm.csrf_token.value;
        const claim_key_url = claimForm.action;

        console.log("Claiming game using " + claim_key_url);
        const claim_key_resp = await Request({
            method: "POST",
            url: claim_key_url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: 'csrf_token='+encodeURIComponent(claim_csrf_token)
        });
        return /You claimed this/.test(claim_key_resp.responseText);
    }
    
    // Parses a DOM into a game object
    function parsePage(url, dom) {
        // Gets the inner text of an element if it can be found otherwise returns undefined
        const txt = query => { const e = dom.querySelector(query); return e && e.innerText.trim(); };
      
        // JSON.parse(document.querySelectorAll(`script[type="application/ld+json"]`)[1].innerText)
        
        const game = {};
        
        game.cachetime = (new Date()).getTime();
        game.url = url;
        game.title = txt('h1.game_title');
        
        game.isOwned = dom.querySelector(".purchase_banner_inner .key_row .ownership_reason") !== null;        
        game.isClaimable = [...dom.querySelectorAll(".buy_btn")].find(e => e.innerText == "Download or claim") !== undefined;
        game.isFree = [...dom.querySelectorAll("span[itemprop=price]")].find(e => e.innerText === "$0.00 USD") !== undefined;
        game.hasPurchase = [...dom.querySelectorAll("span[itemprop=price]")].find(e => e.innerText !== "$0.00 USD") !== undefined;
        game.hasFreeDownload = [...dom.querySelectorAll("a.download_btn,a.buy_btn")].find(e => e.innerText == "Download" || e.innerText == "Download Now") !== undefined;
        game.hasCommunityCopies = document.querySelector(".reward_footer") !== null;
        const copiesBlock = document.querySelector(".remaining_count");
        game.communityCopies = copiesBlock && copiesBlock.innerText.match(/\d+/) && copiesBlock.innerText.match(/\d+/)[0];
        game.communityCopies = game.communityCopies || 0;
        game.original_price = txt("span.original_price");
        game.price = txt("span[itemprop=price]");
        game.saleRate = txt(".sale_rate");
        game.breadcrumbs = txt(".breadcrumbs");
      
        const categoryHeader = [...document.querySelectorAll(".game_info_panel_widget td:first-child")].find(e=>e.innerText === "Category");
        if (categoryHeader)
            game.category = categoryHeader.nextSibling.innerText;
        return game;
    }
    
    // Sends an XHR request and parses the results into a game object
    async function fetchItchGame(url) {
        const response = await Request({method: "GET",
                                 url: url});
        if (response.status != 200) {
            console.log(`Error ${response.status} fetching page ${url}`);
            return null;
        }
        const parser = new DOMParser();
        const dom = parser.parseFromString(response.responseText, 'text/html');
        return parsePage(url, dom);
    }
    
    // Loads an itch game from cache or fetches the page if needed
    async function getItchGame(url) {
        let game = getItchGameCache(url);
        if (game !== null) {
            const isExpired = (new Date()).getTime() - game.cachetime > INVALIDATION_TIME;
            // Expiration checking currently disabled
            /*if (isExpired) {
                game = null;
            }*/
        }
        if (game === null) {
            game = await fetchItchGame(url);
            if (game !== null)
                setItchGameCache(url, game);
        }
        return game;
    }
    
    async function claimClicked(a, game) {
        const iwic = a.closest(".iwi-container");
        const claimBtn = iwic.querySelector(".ClaimButton");
        console.log("Attempting to claim " + game.url);
        claimBtn.innerText += ' ⌛';
        claimBtn.onclick = null;
        const success = await claimGame(game.url);
        if (success === true) {
            claimBtn.style.display = "none";
            const ownMark = iwic.querySelector(".iwi-ownmark");
            ownMark.innerHTML = `<span title="Successfully claimed">✔️</span>`;
            deleteItchGameCache(game.url);
        } else {
            claimBtn.innerHTML = `❗ Error`;
        }
    }
    
    // Appends the isOwned tag to an anchor link
    function appendTags(a, game) {
        const div = document.createElement("div");
        div.className = "iwi-container";
        div.style.display = "inline-block";
        const span = document.createElement("span");
        div.append(span);
        span.style = "margin-left: 5px; background:rgb(230,230,230); padding: 2px; border-radius: 2px";
        
        if (game === null) {
            span.innerHTML = `<span title="Status unknown. Try refreshing.">❓</span>`;
            a.after(div);
            return;
        }
        
        if (game.isOwned) {
            span.innerHTML = `<span class="iwi-ownmark" title="Game is already claimed on itch.io">✔️</span>`;
        } else {
            if (!game.isClaimable) {
                if (game.hasFreeDownload && !game.hasPurchase) {
                    span.innerHTML = `<span title="Game is a free download but not claimable">🆓</span>`;
                } else if (game.price) {
                    span.innerHTML = `<span title="🛒 Game costs ${game.price}">🛒</span>`;
                } else {
                    span.innerHTML = `<span title="Status unknown">👽</span>`;
                }
            } else {
                let tooltip = [`Game is claimable but you haven't claimed it.`];
                if (game.original_price) tooltip.push(`🛒 Original price: ${game.original_price}`);
                if (game.price) tooltip.push(`💸 Current Price: ${game.price}`);
                span.innerHTML = `<span class="iwi-ownmark" title="${tooltip.join(" ")}">❌</span>`;
                
                const claimBtn = document.createElement("span");
                claimBtn.style = `margin-left: 2px; padding: 2px; cursor:pointer; background:rgb(220,220,220); border-radius: 5px`;
                claimBtn.className = "ClaimButton";
                claimBtn.innerText = "🛄 Claim Game";
                claimBtn.onclick = function(event) { claimClicked(event.target, game); };
                span.after(claimBtn);
            }
        }
        
        if (game.hasCommunityCopies) {
            const communityTag = document.createElement("span");
            communityTag.title = `This game has ${game.communityCopies} Community Copies availible.`;
            communityTag.innerText = '👪';
            span.append(communityTag);
        }
        if (game.breadcrumbs) {
            span.firstChild.title += ' ℹ️ ' + game.breadcrumbs;
            if (!a.title)
                a.title = game.breadcrumbs;
            const tags = {
                //"Games": { icon: '🎮', title: "Video game" },
                "Tools": { icon: '🛠️', title: "Tool" },
                "Game assets": { icon: '🗃️', title: "Game asset" },
                "Comics": { icon: '🗨️', title: "Comic" },
                "Books": { icon: '📘', title: "Book" },
                "Physical games": { icon: '📖', title: "Physical game" },
                "Soundtracks": { icon: '🎵', title: "Soundtrack" },
                "Game mods": { icon: '⚙️', title: "Game mod" },
            }
            const category = game.breadcrumbs.split("›")[0].trim();
            if (Object.prototype.hasOwnProperty.call(tags, category)) {
                const tag = document.createElement("span");
                tag.title = tags[category].title;
                tag.innerText = tags[category].icon;
                span.append(tag);
            }
        }
        
        a.after(div);
    }
    
    function addClickHandler(a) {
        // If you open a link to an Itch page, it will delete that page from the cache
        // this forces an update the next time you load the page
        a.addEventListener('mouseup', event => {
            deleteItchGameCache(event.target.href);
        });
    }

    // Handles an itch.io link on a page
    async function handleLink(a) {
        // Checks if the link has already been tagged
        if (!a.nextSibling || a.nextSibling.className !== "iwi-container") {
            addClickHandler(a);
            const game = await getItchGame(a.href);
            appendTags(a, game);
        }
    }
    
    function isGameUrl(url) {
        return /^https:\/\/[^.]+\.itch\.io\/[^/]+$/.test(url);
    }
    
    // Finds all the itch.io links on the current page
    function getItchLinks() {
        let links = [...document.querySelectorAll("a[href*='itch.io/']")];
        links = links.filter(a => isGameUrl(a.href));
        links = links.filter(a => !a.classList.contains("return_link"));
        links = links.filter(a => { const t = a.textContent.trim(); return t !== "" && t !== "GIF"; });
        return links;
    }
    
    function handlePage() {
        if (isGameUrl(window.location.href)) {
            // If we're on an Itch game page, update the cached details
            const game = parsePage(window.location.href, document);
            setItchGameCache(window.location.href, game);
        }
        // Try to find any itch links on the page and tag them
        const as = getItchLinks();
        as.forEach(handleLink);
        // Monitor new links loaded on the page
        setInterval(function(){
            const as = getItchLinks();
            as.forEach(handleLink);
        }, 1000);
    }
    
    versionCacheInvalidator();
    handlePage();
})();