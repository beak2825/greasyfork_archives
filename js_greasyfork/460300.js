// ==UserScript==
// @name         Planet Minecraft Enhancer
// @version      0.3
// @description  Controls what items you will see and helps bypassing a few ads.
// @author       _Rewe
// @match        https://*.planetminecraft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=planetminecraft.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1029765
// @downloadURL https://update.greasyfork.org/scripts/460300/Planet%20Minecraft%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/460300/Planet%20Minecraft%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // START OF USER SETTINGS
    // You can add additional blocked strings to the array. Make sure they're completly lowercased!
    const blockedPhrases = [];
    // Block additional cards in the datapack section like ads, trending packs and jams
    const blockExtraCards = true;
    // Show only high effort content (Has equal or more diamonds diamonds than the set number)
    const highEffortOnly = false;
    const highEffortDiamonds = 10;
    // Add id's of posts you want to block completly from the search results
    const blockedPosts = [];
    // Add lowercased names of users to hide content from them
    const hiddenUsers = [];
    // Shows or hides the popular submissions reel on some pages
    const showPopularReel = true;
    // END OF USER SETTINGS


    if (window.location.href.includes("/download/")) {
        let url = new URL(window.location.href);
        window.open(document.getElementById("prerollDownload").href, "_self");
        if (url.searchParams.get("confirmed")) {
            return;
        }
        setTimeout(closeTab, 1000);
        function closeTab() {
            window.close();
        }
        return;
    }
    const packs = Array.from(document.getElementsByClassName('resource r-data'));
    packs.forEach(removePacks);
    function removePacks(item) {
        let cardBody = item.lastElementChild;
        let titleElement = cardBody.firstElementChild;
        let cardFooter = cardBody.lastElementChild;
        let block = [" op", " op", "op ", "(op)" , " god ", "god "];
        block = block.concat(blockedPhrases)
        titleElement.innerHTML = '<span style="color:#777777">'+item.dataset.id+'</span> '+titleElement.innerHTML;
        if (block.some(v => titleElement.innerHTML.toLowerCase().includes(v))) {
            item.style.display = 'none'
            console.log('[PMC OP Pack remover] Blocked pack named "'+titleElement.innerHTML+'".');
        }
        if (blockedPosts.some(b => item.dataset.id.includes(b))) {
            item.style.display = 'none'
            console.log('[PMC OP Pack remover] Removed pack named "'+titleElement.innerHTML+'" because it\'s id is blocked.');
        }
        if (hiddenUsers.some(c => cardFooter.firstElementChild.href.includes(c))) {
            item.style.display = 'none'
            console.log('[PMC OP Pack remover] Removed pack named "'+titleElement.innerHTML+'" because submissions from this user are hidden.');
        }
        if (highEffortOnly && !window.location.href.includes("skins")) {
            let diamondBar = cardBody.childNodes.item(3);
            let diamond = diamondBar.firstElementChild;
            let diamonds = diamond.lastElementChild.innerHTML.replace(".", "");
            diamonds = diamonds.replace("k", "00");
            diamonds = +diamonds;
            if (diamonds < highEffortDiamonds) {
                item.style.display = 'none';
                console.log('[PMC OP Pack remover] Blocked pack named "'+titleElement.innerHTML+'" because it has not enough diamonds.');
            }
        }
        let url = new URL(window.location.href);
        if (url.searchParams.get("show-all") == 1 && item.style.display == "none") {
            titleElement.innerHTML = '<span style="color:green">'+titleElement.innerHTML+'</span>';
            item.style.display = "block";
        }
    }
    if ((window.location.href.match(/\//g) || []).length >= 5) {
        return;
    }
    const cards = Array.from(document.getElementsByClassName('r-card'));
    if (blockExtraCards) {
        cards.forEach(item => item.style.display = 'none');
    }
    if (!showPopularReel) {
        document.getElementById("popular-reel").style.display = "none";
    }
    document.getElementById("responsive728-wrap").style.display = "none";
})();