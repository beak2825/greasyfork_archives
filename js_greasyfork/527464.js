// ==UserScript==
// @name         4虎·四虎·4hu TV去广告
// @version      1.2
// @namespace    BlingCc
// @description  Removes the midBox div tag and any element with id starting with 'content_' on 4hu TV after page load
// @match        https://4hu.tv/*
// @author       BlingCc
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527464/4%E8%99%8E%C2%B7%E5%9B%9B%E8%99%8E%C2%B74hu%20TV%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527464/4%E8%99%8E%C2%B7%E5%9B%9B%E8%99%8E%C2%B74hu%20TV%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // Remove midBox
        var midBox = document.getElementById('midBox');
        if (midBox) {
            midBox.remove();
        }

        // Remove elements with id starting with 'content_'
        var contentElements = document.querySelectorAll('[id^="content_"]');
        contentElements.forEach(function(element) {
            element.remove();
        });
    });
})();
