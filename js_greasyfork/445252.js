// ==UserScript==
// @name         WaniKani reading font size
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Bump the font size of kana in WaniKani reading pages to something more legible.
// @author       damyst
// @match        https://www.wanikani.com/subject-lessons/**
// @match        https://www.wanikani.com/kanji*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445252/WaniKani%20reading%20font%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/445252/WaniKani%20reading%20font%20size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.wk-text :lang(ja) { font-size: 1.4rem; }');
})();
