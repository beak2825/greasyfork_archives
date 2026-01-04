// ==UserScript==
// @name         dontShowPixsoGuide
// @namespace    https://codernotes.club/
// @version      0.76
// @description  optimize pixso.cn UI!
// @author       mooring@codernotes.club
// @match        pixso.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixso.cn
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/447528/dontShowPixsoGuide.user.js
// @updateURL https://update.greasyfork.org/scripts/447528/dontShowPixsoGuide.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var css = [
         '/*.ed-file-container .ed-file-top-bar{position:fixed;top:5px;width:calc(100% - 400px)}*/',
         '.ed-file-container .ed-file-top-bar .ed-file-top-bar__wrap{grid-template-columns: repeat(auto-fill,minmax(180px,1fr));}',
         '.main--container .main-contain-top_draft{padding:29px 32px 18px 32px;}',
         '.ed-file-container .ed-file-top-bar .ed-file-top-bar__item-wrapper{width:215px}',

     ].join('');
     var style = document.createElement('style');
     style.innerText = css;
     document.body.previousElementSibling.appendChild(style);
})();