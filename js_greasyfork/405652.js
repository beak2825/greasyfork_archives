// ==UserScript==
// @name        Auto skip intro on amazon prime videos
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

// @version     2
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405652/Auto%20skip%20intro%20on%20amazon%20prime%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/405652/Auto%20skip%20intro%20on%20amazon%20prime%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (new MutationObserver(function (mutationlist) {
        if (document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(3)')) {
            this.disconnect();
            console.log('Got player');
            (new MutationObserver(function (mutationlist) {
                console.log('got observer');
                console.log(document.querySelectorAll('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(3) div'));
                Array.from(document.querySelectorAll('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(3) div')).filter(function(item) { return window.getComputedStyle(item).getPropertyValue('box-shadow').includes('rgba'); }).forEach(function(item) {
                    console.log('Auto skipped intro');
                    item.click();
                });

            })).observe(document.querySelector('.webPlayerUIContainer [tabindex="-1"] > div:nth-child(4) > div:nth-child(3)'),{ attributes: false, childList: true, subtree: true });
        }
    })).observe(document.getElementById('dv-web-player'),{ attributes: false, childList: true, subtree: true });
})();