// ==UserScript==
// @name         Put website and official links back to the top
// @version      1.0
// @namespace    me.kalus.alternativeto
// @description  Alternative.to's new design uses black patterns to keep the user on their plattform. This script puts external links for software back in the above-the-fold area, for immediate access to download the desired application.
// @author       Michael Kalus
// @match        https://alternativeto.net/software/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alternativeto.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496937/Put%20website%20and%20official%20links%20back%20to%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/496937/Put%20website%20and%20official%20links%20back%20to%20the%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let commonBoxLists = document.querySelectorAll('div.commonBoxList');

        let officialLinksDiv;
        commonBoxLists.forEach(function(div) {
            let h3 = div.querySelector('h3');
            if (h3 && h3.textContent.trim() === 'Official Links') {
                officialLinksDiv = div;
            }
        });

        if (officialLinksDiv) {
            let aboutDiv = document.querySelector('div[class^="about_"]');
            if (aboutDiv) {
                aboutDiv.parentNode.insertBefore(officialLinksDiv, aboutDiv);

                let spacer1 = document.createElement('div');
                spacer1.className = 'spacer-4';
                officialLinksDiv.parentNode.insertBefore(spacer1, officialLinksDiv.nextSibling);
            }
        }
    }, false);
})();