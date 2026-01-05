// ==UserScript==
// @name         WaniKani Level Vocabulary Grid
// @description  Rearranges the WaniKani Level Vocabulary into a grid
// @author       Norman Sue
// @namespace    normful
// @version      0.3.2
// @license      MIT
// @match        http://www.wanikani.com/level*
// @match        http://www.wanikani.com/vocabulary*
// @match        http://www.wanikani.com/kanji*
// @match        https://www.wanikani.com/level*
// @match        https://www.wanikani.com/vocabulary*
// @match        https://www.wanikani.com/kanji*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21628/WaniKani%20Level%20Vocabulary%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/21628/WaniKani%20Level%20Vocabulary%20Grid.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cssUrl = 'https://normful.github.io/WaniKani-Vocab-Grid-Plain.css';
    var cssId  = 'normful-wanikani-level-vocabulary-grid';

    if (!document.getElementById(cssId)) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id    = cssId;
        link.rel   = 'stylesheet';
        link.type  = 'text/css';
        link.href  = cssUrl;
        link.media = 'all';
        head.appendChild(link);
    }
})();
