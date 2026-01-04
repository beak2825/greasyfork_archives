// ==UserScript==
// @name        Auto skip ads on amazon prime videos
// @namespace   momala
// @description No need to manually click

// @match https://primevideo.com/region/*/detail/*
// @match https://*.primevideo.com/region/*/detail/*

// @match https://primevideo.com/detail/*
// @match https://*.primevideo.com/detail/*

// @match https://amazon.com/Episode-*/dp/*
// @match https://*.amazon.com/Episode-*/dp/*
// @match https://amazon.co.jp/Episode-*/dp/*
// @match https://*.amazon.co.jp/Episode-*/dp/*
// @match https://amazon.de/Episode-*/dp/*
// @match https://*.amazon.de/Episode-*/dp/*
// @match https://amazon.de/dp/*
// @match https://*.amazon.de/dp/*

// @match https://amazon.com/gp/video/detail/*
// @match https://*.amazon.com/gp/video/detail/*
// @match https://amazon.co.jp/gp/video/detail/*
// @match https://*.amazon.co.jp/gp/video/detail/*
// @match https://amazon.de/gp/video/detail/*
// @match https://*.amazon.de/gp/video/detail/*

// @version     3
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405653/Auto%20skip%20ads%20on%20amazon%20prime%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/405653/Auto%20skip%20ads%20on%20amazon%20prime%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(function (mutationlist) {
        if (document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(2)')) {
            this.disconnect();
            console.log('Got player');
            console.log(document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(2)'));
            (new MutationObserver(function (mutationlist) {
                console.log('got observer');
                console.log(document.querySelectorAll('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(2) div img[src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4LjQ4NCIgaGVpZ2h0PSIxNC4xNDEiIHZpZXdCb3g9IjAgMCA4LjQ4NCAxNC4xNDEiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03LjA3IDUuNjU2TDEuNDE0IDAgMCAxLjQxNCA1LjY1NiA3LjA3IDAgMTIuNzI3bDEuNDE0IDEuNDE0TDcuMDcgOC40ODQgOC40ODQgNy4wN3oiLz48L3N2Zz4="]'));
                Array.from(document.querySelectorAll('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(2) div img[src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4LjQ4NCIgaGVpZ2h0PSIxNC4xNDEiIHZpZXdCb3g9IjAgMCA4LjQ4NCAxNC4xNDEiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03LjA3IDUuNjU2TDEuNDE0IDAgMCAxLjQxNCA1LjY1NiA3LjA3IDAgMTIuNzI3bDEuNDE0IDEuNDE0TDcuMDcgOC40ODQgOC40ODQgNy4wN3oiLz48L3N2Zz4="]')).
                filter(function(item) { return ['Ignorer', 'Skip', 'Überspringen'].includes(item.parentNode.parentNode.innerText)}).forEach(function(item) {
                    console.log('Auto skipped ads');
                    item.click();
                });

            //})).observe(document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(2)'),{ attributes: false, childList: true, subtree: true });
            })).observe(document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4)'),{ attributes: false, childList: true, subtree: true });
        }
    })).observe(document.getElementById('dv-web-player'),{ attributes: false, childList: true, subtree: true });
})();