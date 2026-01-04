// ==UserScript==
// @name         Fantasy League Mobile css tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Attempt to make the new Fantasy League site more usable on mobile
// @author       Rich Stone
// @match        https://fantasyleague.com/leagues/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fantasyleague.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474590/Fantasy%20League%20Mobile%20css%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/474590/Fantasy%20League%20Mobile%20css%20tweaks.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    function addStyle(styleText){
        let s = document.createElement('style')
        s.appendChild(document.createTextNode(styleText))
        document.getElementsByTagName('head')[0].appendChild(s)
    };
    addStyle('#root section section div:first-child div:first-child{padding: 1px !important;} div.rankings__info-block{margin: 1px !important; padding:1px !important;} .ant-table-cell {padding:3px !important} ul.ant-pagination {display:none;}');
    addStyle('#root div.points__team{min-height:400px !important} div.teamPlayer {width: 22% !important} .points__substitutions{background:#ddd !important;}');

})();