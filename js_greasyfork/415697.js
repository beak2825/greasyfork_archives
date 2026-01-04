// ==UserScript==
// @name         SubsPlease MyAnimeList
// @namespace    https://github.com/ipha/userscripts
// @version      1.4.1
// @description  Adds MyAnimeList links for each show in release list
// @author       ipha
// @license      MIT
// @match        https://subsplease.org/
// @connect      myanimelist.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/415697/SubsPlease%20MyAnimeList.user.js
// @updateURL https://update.greasyfork.org/scripts/415697/SubsPlease%20MyAnimeList.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Watch for changes on release list
    var mutationConfig = {
        attributes: false,
        childList: true,
        subtree: false
    };

    // Watch for changes in table
    function mutationCallback(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                addBadges();
            }
        }
    }

    var observer = new MutationObserver(mutationCallback);
    observer.observe(document.querySelector('#releases-table'), mutationConfig);

    // Time to keep cached URLs
    // Two weeks in ms
    const CACHE_VALID_TIME = 1000 * 60 * 60 * 24 * 14;

    // Save URL and timestamp in cache
    function setCache(name, url) {
        GM_setValue(name, [url, Date.now()]);
    }

    // Fetch URL from cache
    function getCache(name) {
        var cache = GM_getValue(name, undefined)
        if (cache && ((Date.now() - cache[1]) < CACHE_VALID_TIME)) {
            return cache[0];
        } else {
            return undefined;
        }
    }

    // Search MAL for 'name'. Returns first result of type 'TV'
    // TODO: This probably doesn't work for OVAs
    function fetchLink(name, callback) {
        var ret = GM_xmlhttpRequest({
            method: "GET",
            responseType: "json",
            url: "https://myanimelist.net/search/prefix.json?type=anime&keyword=" + encodeURIComponent(name),
            onload: function (res) {
                var items = res.response.categories[0].items;
                var item;
                // find first "Currently Airing" status
                for (item in items) {
                    if (items[item].payload.status == "Currently Airing") {
                        setCache(name, items[item].url);
                        callback(items[item].url);
                        return;
                    }
                }
                // nothing airing, return first TV listing
                for (item in items) {
                    if (items[item].payload.media_type == "TV") {
                        setCache(name, items[item].url);
                        callback(items[item].url);
                        return;
                    }
                }
                // No TV result found, return first result
                setCache(name, items[0].url);
                callback(items[0].url);
            }
        });
    }

    // Add MAL badge next to release resolutions
    function addBadges() {
        // var time = Date.now()
        document.querySelectorAll('#releases-table .badge-wrapper').forEach(function (item) {
            if (item.textContent.search("MAL") == -1) {
                var name = item.parentElement.querySelector('a').textContent.split(' - ')[0];
                var a = document.createElement("a");
                var s = document.createElement("span");
                a.appendChild(s);
                s.append("MAL");
                s.classList.add("badge");
                item.appendChild(a);

                var cachedURL = getCache(name);
                if (cachedURL) {
                    console.log("Cache hit for:", name);
                    a.href = cachedURL;
                    // console.log(Date.now() - time);
                } else {
                    console.log("Cache miss for:", name);
                    fetchLink(name, function (url) {
                        a.href = url;
                        // console.log(Date.now() - time);
                    });
                }
            }
        });
    }

    // cached page loads don't trigger the observer
    addBadges();
})();
