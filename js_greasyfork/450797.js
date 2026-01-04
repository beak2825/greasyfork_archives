// ==UserScript==
// @name         cleanCollinsDictionaryAds
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  clean collinsdictionary.com ads and make it more clear to use
// @author       mooring@codernotes.club
// @match        *.collinsdictionary.com/*
// @match        collinsdictionary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=collinsdictionary.com
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/450797/cleanCollinsDictionaryAds.user.js
// @updateURL https://update.greasyfork.org/scripts/450797/cleanCollinsDictionaryAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var css = [
        '.topslot_container,.seoBox_ad,.container_seoBox ~ *,.res_cell_left,iframe,.share-button',
         ',.am-dictionary,.res_cell_right,.mpuslot_b-container,.btmslot_a-container',
        '{display:none!important}',
        '.res_cell_center,#main_content{width:100%!important}',
        '.block_collolist{display:flex;justify-content:flex-start;flex-wrap:wrap;}',
        '.block_collolist .assetlink{padding-right:1em;}',
        'iframe[class*="youtube"]{display:inherit!important}'
    ].join('')
    var style = document.createElement('style'); style.innerText = css;
    document.body.previousElementSibling.appendChild(style)
})();