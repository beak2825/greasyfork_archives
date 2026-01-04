// ==UserScript==
// @name         Myn-Worx 2Embed
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  this is for my semi-private work
// @author       Devin
// @match        https://www.2embed.to/embed/tmdb/tv?*
// @match        https://www.2embed.to/embed/tmdb/movie?*
// @icon         https://www.google.com/s2/favicons?domain=000webhostapp.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445417/Myn-Worx%202Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/445417/Myn-Worx%202Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dc = document;

    (function(){
        let style = dc.createElement('style');
        style.innerText = ".media-servers.dropdown, .media-title{ opacity:0 } .media-servers.dropdown:hover, .media-servers.dropdown:hover + .media-title{ opacity:1 }";
        dc.body.appendChild(style);
    })();
})();