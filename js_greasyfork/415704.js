// ==UserScript==
// @name         SubsPlease AniList
// @namespace    https://github.com/ipha/userscripts
// @version      1.4.1
// @description  Adds AniList links for each show in release list
// @author       ipha
// @license      MIT
// @match        https://subsplease.org/
// @connect      graphql.anilist.co
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/415704/SubsPlease%20AniList.user.js
// @updateURL https://update.greasyfork.org/scripts/415704/SubsPlease%20AniList.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // anilist graphql stuff
    var query = `
    query ($search: String) {
        Media(search: $search, type: ANIME) {
        siteUrl
        }
    }`;

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
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            responseType: "json",
            url: "https://graphql.anilist.co",
            data: JSON.stringify({ query: query, variables: { search: name } }),
            onload: function (res) {
                // todo: error handling
                var url = res.response.data.Media.siteUrl
                setCache(name, url);
                callback(url);
            }
        });
    }

    // Add MAL badge next to release resolutions
    function addBadges() {
        // var time = Date.now()
        document.querySelectorAll('#releases-table .badge-wrapper').forEach(function (item) {
            if (item.textContent.search("AniList") == -1) {
                var name = item.parentElement.querySelector('a').textContent.split(' - ')[0];
                var a = document.createElement("a");
                var s = document.createElement("span");
                a.appendChild(s);
                s.append("AniList");
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
