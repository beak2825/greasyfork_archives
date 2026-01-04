// ==UserScript==
// @name         cleanDictsAds
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  clean ads of some dicts ads
// @author       mooring@codernotes.club
// @match        *.oxfordlearnersdictionaries.com/*
// @match        *.iciba.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oxfordlearnersdictionaries.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/448039/cleanDictsAds.user.js
// @updateURL https://update.greasyfork.org/scripts/448039/cleanDictsAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        '[data-iaw="container"],#ring-links-box,.peu-sales-box',
        ',main [class^="Search_search"]+div[class]',
        ',main [class^="Content_content"] [class^="Content_center"] [class^="Mean_part"] + *',
        ',main [class^="Content_content"] [class^="Content_center"] [class^="Mean_part"] ~ img',
        ',main [class^="Content_content"] [class^="Content_center"] [class^="Mean_desc"]',
        ',main [class^="Content_content"] [class^="Content_right"]',
        '{display:none!important;}',
        'main [class^="Content_content"] [class^="Content_center"]{width:965px}'
       ].join('')
    var style = document.createElement('style');
    style.innerText = css;
    document.body.previousElementSibling.appendChild(style);
})();