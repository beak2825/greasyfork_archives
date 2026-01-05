// ==UserScript==
// @name         Large Theatre mode for YouTube
// @version      1.0
// @description  Shows a larger theatre mode (1280px x 720px) with window >= 1294px on YouTube
// @author       Henry
// @match        https://www.youtube.com/watch*
// @grant        none
// @namespace https://greasyfork.org/users/99845
// @downloadURL https://update.greasyfork.org/scripts/27053/Large%20Theatre%20mode%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/27053/Large%20Theatre%20mode%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = '@media(min-width:1294px){.watch-stage-mode .player-width{width:1280px!important;left:-640px!important}.watch-stage-mode .player-height{height:640px}}';
    function addcss(css){
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.appendChild(document.createTextNode(css));
        head.appendChild(s);
    }
    addcss(style);
})();