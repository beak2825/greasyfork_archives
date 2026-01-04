// ==UserScript==
// @name         Sponsor block #359 fix
// @namespace    sbvscfix
// @description  Temporary fix for sponsor block compatibility with video speed controller. https://github.com/ajayyy/SponsorBlock/issues/359
// @version      0.1
// @author       terazoid
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452050/Sponsor%20block%20359%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/452050/Sponsor%20block%20359%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener(
        'ratechange',
        function(e) {
            e.target.dispatchEvent(
                new CustomEvent('videoSpeed_ratechange')
            );
        },
        true
    );
})();
