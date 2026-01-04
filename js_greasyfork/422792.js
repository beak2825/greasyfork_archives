// ==UserScript==
// @name         ET Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.EnkirosTranslations
// @version      0.2
// @description  Enable next / previous chapter on right / left arrow keys on Enkiros Translations' Arafoo Kenja chapters.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://enkirostranslations.home.blog/*/*/*/arafoo-kenja-chapter-*
// @icon         https://www.google.com/s2/favicons?domain=enkirostranslations.home.blog
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422792/ET%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/422792/ET%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //console.log(e.keyCode);
        if (e.keyCode == '37') {
            // left arrow
            e.preventDefault();
            document.querySelectorAll('div.wp-block-buttons div.wp-block-button:first-child a.wp-block-button__link')[0].click();
        }
        else if (e.keyCode == '39') {
            // right arrow
            e.preventDefault();
            document.querySelectorAll('div.wp-block-buttons div.wp-block-button:last-child a.wp-block-button__link')[0].click();
        }

    };
})();