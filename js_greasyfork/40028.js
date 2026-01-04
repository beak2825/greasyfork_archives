// ==UserScript==
// @name         Barter.vg, Thumbnail
// @namespace    http://tampermonkey.net/
// @version      0.5.11
// @description  always display thumbnail of game
// @icon         https://www.google.com/s2/favicons?sz=64&domain=barter.vg
// @author       You
// @match        https://barter.vg/*
// @match        https://bartervg.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40028/Bartervg%2C%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/40028/Bartervg%2C%20Thumbnail.meta.js
// ==/UserScript==
(function() {
    const STORAGE_KEY = "BarterToSteamThumbnailMaps";
    const pages = {
        bundles : location.pathname.indexOf("/bundles/") == 0,
        bundle: location.pathname.indexOf("/bundle/") == 0,
        giveways: location.pathname.indexOf("/giveways/") == 0,
        browse: location.pathname.indexOf("/browse/") == 0,
        wishlist: location.pathname.indexOf("/w/") > 0,
        tradable: location.pathname.indexOf("/t/") > 0,
        blacklist: location.pathname.indexOf("/b/") > 0,
        scrachpad: location.pathname.indexOf("/c/") > 0,
        library: location.pathname.indexOf("/l/") > 0,
        offer: location.pathname.indexOf("/o/") > 0,
        info: location.pathname.indexOf("/i/") == 0,
        traded: location.pathname.indexOf("/d/") > 0,
        fulfilled: location.pathname.indexOf("/f/") > 0,
        matching: location.pathname.indexOf("/m/") > 0,
        editing: location.pathname.indexOf("/e/") > 0,
        revoked: location.pathname.indexOf("/v/") > 0,
    };

    console.log("[bt] page info", pages);

    const lazyLoading = [];
    const thumbnailsMap = restoreThumbnailMap();
    const sidRegex = /(app|sub)\/\d+/g;

    function restoreThumbnailMap() {
        try {
            var map = JSON.parse(localStorage[STORAGE_KEY]);
        } finally {
            return typeof map == "object" ? map : {};
        }
    }

    function saveThumbnailMap() {
        localStorage[STORAGE_KEY] = JSON.stringify(thumbnailsMap);
    }

    function makeThumbUrl(id) {
        return `https://steamcdn-a.akamaihd.net/steam/${id.replace("/", "s/")}/capsule_184x69.jpg`;
    }

    function makeHeaderUrl(id) {
        return `https://steamcdn-a.akamaihd.net/steam/${id.replace("/", "s/")}/header.jpg`;
    }

    // bid : Barter ID
    // sid : Steam Store ID (sub/app)
    function bidToSid(bid) {
        var sid = thumbnailsMap[bid];
        if (!sid) return;

        if (sid.indexOf("/i/") == 0) {
            sid = thumbnailsMap[sid.replace("/i/", "")];
        }
        return sid;
    }

    function applyToMatching(barter) {
        var bid = barter.href.match(/\d+/g)[0];
        var sid = bidToSid(bid);
        if (!sid) return;

        var li = barter.closest("li");
        li.setAttribute("thumbnail", "");
        lazyLoading.push({
            element: li,
            backgroundImage: `url('${makeThumbUrl(sid)}'), url('${makeHeaderUrl(sid)}'), var(--unknown-thumbnail)`,
            rect: li.getBoundingClientRect()
        });
    }

    function applyToCollection(barter) {
        if (barter.href.indexOf("#") >= 0) return;
        var bid = barter.href.match(/\d+/g)[0];

        var tr = barter.closest("tr");
        if (!tr) return;
        var td = barter.closest("td");
        if (!td) return;

        var sid = bidToSid(bid),
            steam = tr.querySelector("a[href*='/app/'], a[href*='/sub/']"),
            isSub = steam && steam.href.indexOf("/sub/") >= 0;
        if (steam) {
            if (!isSub || !sid) {
                sid = steam.href.match(sidRegex)[0];
                thumbnailsMap[bid] = sid;

                /// console.log(`[bt] saved /i/${bid} to ${sid} (${barter.innerText})`);
            }
        }

        var background = sid ? `url('${makeThumbUrl(sid)}'), url('${makeHeaderUrl(sid)}'), var(--unknown-thumbnail)` : `var(--unknown-thumbnail)`;
        var nid;
        if (isSub && tr.classList.contains("included")) {
            var next = tr.nextSibling;
            if (next) {
                var baseSteam = next.querySelector("[href*='/sub/'], [href*='/app/']"), baseBarter = next.querySelector("[href*='/i/']");
                if (baseSteam) {
                    nid = baseSteam.href.match(sidRegex)[0];
                    thumbnailsMap[bid] = nid;

                    // console.log(`[bt] base game is ${nid}`);
                } else if (baseBarter) {
                    nid = bidToSid(baseBarter.href.match(/\d+/g)[0]);
                }

                if (nid) {
                    background = `url('${makeThumbUrl(nid)}'), url('${makeHeaderUrl(nid)}'), ${background}`;
                }
            }
        }

        if (isSub || sid || nid) {
            td.setAttribute("thumbnail", "");
            lazyLoading.push({
                element: td,
                backgroundImage: background,
                rect: td.getBoundingClientRect()
            });
        }
    }

    function applyToOffer(barter) {
        if (barter.href.indexOf("#") >= 0) return;
        var bid = barter.href.match(/\d+/g)[0];

        var tr = barter.closest("tr");
        if (!tr) return;
        var td = barter.closest("td");
        if (!td) return;

        var sid = bidToSid(bid),
            steam = tr.querySelector("a[href*='/app/'], a[href*='/sub/']"),
            isSub = steam && steam.href.indexOf("/sub/") >= 0;
        if (steam) {
            if (!isSub || !sid) {
                sid = steam.href.match(sidRegex)[0];
                thumbnailsMap[bid] = sid;

                /// console.log(`[bt] saved /i/${bid} to ${sid} (${barter.innerText})`);
            }
        }

        var background = sid ? `url('${makeThumbUrl(sid)}'), url('${makeHeaderUrl(sid)}'), var(--unknown-thumbnail)` : `var(--unknown-thumbnail)`;
        var nid;
        if (isSub && tr.classList.contains("included")) {
            var next = tr.nextSibling;
            if (next) {
                var baseSteam = next.querySelector("[href*='/sub/'], [href*='/app/']"), baseBarter = next.querySelector("[href*='/i/']");
                if (baseSteam) {
                    nid = baseSteam.href.match(sidRegex)[0];
                    thumbnailsMap[bid] = nid;

                    // console.log(`[bt] base game is ${nid}`);
                } else if (baseBarter) {
                    nid = bidToSid(baseBarter.href.match(/\d+/g)[0]);
                }

                if (nid) {
                    background = `url('${makeThumbUrl(nid)}'), url('${makeHeaderUrl(nid)}'), ${background}`;
                }
            }
        }

        if (sid || nid) {
            td.setAttribute("thumbnail", "");
            lazyLoading.push({
                element: td,
                backgroundImage: background,
                parent: barter.closest("div"),
            });
        }
    }

    var scrollTimer = 0;
    function onScroll(ev) {
        if (scrollTimer > 0) return;

        scrollTimer = setTimeout(function () {
            var item, scrollTop, clientHeight, itemTop, preloadingMargin;

            for (var i = 0; i < lazyLoading.length; i++) {
                item = lazyLoading[i];

                if (pages.offer) {
                    if (ev.target != item.parent) continue;
                    scrollTop = ev.target.getBoundingClientRect().top;
                    clientHeight = ev.target.clientHeight;
                    itemTop = item.element.getBoundingClientRect().top;
                    preloadingMargin = 100;
                } else {
                    scrollTop = 0;
                    clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    itemTop = item.element.getBoundingClientRect().top;
                    preloadingMargin = 500;
                }

                if (scrollTop - preloadingMargin < itemTop && itemTop < scrollTop + clientHeight + preloadingMargin) {
                //if (itemTop < scrollTop + preloadingMargin) {
                    item.element.style.setProperty("--thumbnail", item.backgroundImage);
                    // console.log(item.element.parentNode.innerText, scrollTop, clientHeight, itemTop);
                    lazyLoading.splice(i, 1);
                    i--;
                }
            }
            scrollTimer = 0;
        }, 50);
    }

    function onMatchingPage() {
        var items = document.querySelectorAll(`.matchcol a[href*='/i/']`);
        for (var i = 0; i < items.length; i++) {
            applyToMatching(items[i]);
        }
    }

    function onCollectionPage() {
        var items = document.querySelectorAll(`.collection tr a[href*='/i/']`);
        for (var i = 0; i < items.length; i++) {
            applyToCollection(items[i])
        }
    }

    function onOfferPage() {
        var items = document.querySelectorAll(`.collection tr a[href*='/i/']`);
        for (var i = 0; i < items.length; i++) {
            applyToOffer(items[i]);
        }
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    function fetchBaseGame() {
        var tags = document.querySelectorAll(".tag");
        if (tags.length == 0) return;

        tags = Array.prototype.filter.call(tags, t => t.innerText.trim() == "included");
        tags = Array.prototype.map.call(tags, t => {
            var b = t.closest("li").querySelector("a[href*='/i/']");
            return parseInt(b.href.match(/\d+/g)[0]);
        });
        Array.prototype.sort.call(tags, compareNumbers);
        return tags[0];
    }

    function onInfoPage() {
        // save thumbnail map
        var sid, bid = location.pathname.match(/\d+/)[0];
        var steamHeader = document.querySelector(`#main > a[href*='/sub/'] img, #main > a[href*='/app/'] img`);
        var isSub = steamHeader && steamHeader.src.indexOf("/subs/") >= 0;

        if (steamHeader) {
            if (isSub) {
                var baseBid = fetchBaseGame();
                if (baseBid) {
                    thumbnailsMap[bid] = `/i/${baseBid}`;

                    console.log(`[bt] saved ${bid} to ${thumbnailsMap[bid]}`);
                }

                sid = bidToSid(bid);
                if (sid) {
                    steamHeader.src = makeHeaderUrl(sid);

                    console.log("[bt] header image was replaced");
                }
            } else {
                var steam = steamHeader.closest("a");
                sid = steam.href.match(sidRegex)[0];
                thumbnailsMap[bid] = sid;

                console.log(`[bt] saved /i/${bid} to ${sid}`);
            }

        } else {
            var steamVersion = document.querySelector("#bc a[href*='/i/']:has(img[src*='steam.png'])");
            if (!steamVersion) return;
            thumbnailsMap[bid] = `/i/${steamVersion.href.match(/\d+/g)[0]}`;

            console.log(`[bt] saved /i/${bid} to ${thumbnailsMap[bid]}`);
        }
    }

    function delay(ts) {
        return new Promise((callback) => {
            setTimeout(callback, ts);
        });
    }

    function onLoaded () {
        // console.log("items", items);

        if (pages.info) {
            onInfoPage();
        } else if (pages.offer) {
            onOfferPage();
        } else if (pages.matching) {
            onMatchingPage();
        } else if (pages.bundle) {
            // do noting
        } else {
            onCollectionPage();
        }

        // console.log("lazyLoading", lazyLoading);

        saveThumbnailMap();

        if (pages.offer) {
            document.querySelectorAll(".collectionSelect").forEach(async function (el) {
                await delay(100);
                el.addEventListener("scroll", onScroll);
                onScroll.call(el, { target: el });
            });
        } else {
            window.addEventListener("scroll", onScroll);
            window.dispatchEvent(new Event("scroll"));
        }

        var style = document.createElement("style");
        style.innerHTML = `
body {
    --unknown-thumbnail: url('https://bartervg.com/imgs/ico/steam184_69.png');
}
.matchcol [thumbnail] {
    position: relative;
}
.matchcol [thumbnail]:before {
    display: inline-block;
    position: absolute;
    content: "";
    width: 184px;
    min-height: 30px;
    right: 0;
    pointer-events: none;
    opacity: 0.5;
    z-index: -1;
    background-image: var(--thumbnail);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.collection td { vertical-align: middle; padding-top: 0; padding-bottom: 0; }
.collection td abbr + div { display: inline-block; }
.collection [thumbnail]:before {
    display: inline-block;
    position: relative;
    content: "";
    margin-right: 8px;
    width: 184px;
    min-height: 30px;
    vertical-align: middle;
    background-image: var(--thumbnail);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.showMoreTable tr.included td[thumbnail] { padding-left: 8px; }

#listEdit { z-index: 100; }
`;
        document.querySelector("head").appendChild(style);
    }
    onLoaded();
})();