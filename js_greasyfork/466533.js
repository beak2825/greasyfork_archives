// ==UserScript==
// @name         oxtorrent preview Image with Cache Management
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show image preview next to the titles by hovering the mouse, with caching and cleanup.
// @author       dr.bobo0
// @match        https://www.oxtorrent.co/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAAAAAAeW/F+AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAd0SU1FB+cFERYzNsSqEXsAAADBSURBVCjPY7RiwAeYGGgozQKhPHjiUcUXvjjCwMDAwGjFwMCgUi6BqfFC5xcGBmZZBgaefiEs5krwnIbY7cGD1V4PCYi0NQ532UCcpgLhHVl7ByocD3cKC1zti04Y68iXZkx/H0FyNJZg+Ypk6wvqBCqdpLkRgjwSmNI2CGkDLLolyqGBy+CBiHsWBgaGOxBxGyT9yLovMGAHRyDSO79gld3xApJavtzVwpIgLkz9BU1rDAwh4h6okshJkfaBihUAAMGoJCE4fyJaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA1LTE3VDIyOjUxOjUzKzAwOjAwF57XXQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNS0xN1QyMjo1MTo1MyswMDowMGbDb+EAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDUtMTdUMjI6NTE6NTQrMDA6MDD0cXCwAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466533/oxtorrent%20preview%20Image%20with%20Cache%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/466533/oxtorrent%20preview%20Image%20with%20Cache%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // Cache Time To Live: 7 days

    // Function to remove old cache entries that do not have expiration timestamps
    function cleanOldCache() {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith("oxtorrent_cache_")) {
                let cacheEntry = JSON.parse(localStorage.getItem(key));
                if (!cacheEntry.timestamp) {
                    localStorage.removeItem(key);
                }
            }
        }
    }

    // Function to fetch from cache with expiration check
    function getFromCache(url) {
        let cacheKey = "oxtorrent_cache_" + url;
        let cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            let cacheEntry = JSON.parse(cachedData);
            if (Date.now() - cacheEntry.timestamp < CACHE_TTL) {
                return cacheEntry.data;
            } else {
                localStorage.removeItem(cacheKey); // Remove expired cache
            }
        }
        return null;
    }

    // Function to save to cache with timestamp
    function saveToCache(url, data) {
        let cacheKey = "oxtorrent_cache_" + url;
        let cacheEntry = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
    }

    cleanOldCache();

    document.querySelectorAll("td > a[href^='/torrent/']").forEach(link => {
        link.addEventListener("mouseover", function(event) {
            let previewContainer = document.createElement("div");
            previewContainer.style.position = "fixed";
            previewContainer.style.display = "none";
            previewContainer.style.transition = "opacity 0.1s ease-in-out";
            previewContainer.style.opacity = 0;
            previewContainer.style.width = "216px";
            previewContainer.style.height = "307px";
            previewContainer.style.overflow = "hidden";
            document.body.appendChild(previewContainer);

            let url = this.href;
            let cachedImage = getFromCache(url);

            if (cachedImage) {
                previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${cachedImage}"/>`;
                showPreview(previewContainer);
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "document";

                xhr.onload = function() {
                    let preview = xhr.response.querySelector("#torrentsimage img");
                    if (preview) {
                        let imgSrc = preview.getAttribute("src");
                        previewContainer.innerHTML = `<img style="width: 100%; height: 100%;" src="${imgSrc}"/>`;
                        saveToCache(url, imgSrc);
                    }
                    showPreview(previewContainer);
                };

                xhr.send();
            }

            link.addEventListener("mouseout", function() {
                previewContainer.style.opacity = 0;
                setTimeout(function () {
                    previewContainer.style.display = "none";
                    previewContainer.remove();
                }, 300);
            });
        });
    });

    function showPreview(previewContainer) {
        document.addEventListener("mousemove", function (event) {
            previewContainer.style.top = event.clientY + 20 + "px";
            previewContainer.style.left = event.clientX + 20 + "px";

            if (previewContainer.getBoundingClientRect().right > window.innerWidth) {
                previewContainer.style.left = (window.innerWidth - previewContainer.offsetWidth - 20) + "px";
            }
            if (previewContainer.getBoundingClientRect().bottom > window.innerHeight) {
                previewContainer.style.top = (window.innerHeight - previewContainer.offsetHeight - 20) + "px";
            }
        });
        previewContainer.style.display = "block";
        setTimeout(function () {
            previewContainer.style.opacity = 1;
        }, 0);
    }
})();
