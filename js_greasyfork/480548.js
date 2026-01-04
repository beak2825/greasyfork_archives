// ==UserScript==
// @name         4animes Full Screen
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      0.2
// @description  Fullscreen Anime
// @author       JRemi
// @match        https://ww1.4animes.org/watch/*/*
// @match        https://4anime.cc/anime-online/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4animes.org
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480548/4animes%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/480548/4animes%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css1 = '.firstDiv, .videojs-desktop, iframe, #playerframe, #justtothetop, element.style { width: calc(100vw) !important; height: calc(100vh) !important; }';
    css1 += '.container { max-width: 99vw; margin-left: 1px; width: calc(100vw) !important; height: calc(100vh) !important;}';
    GM_addStyle(css1);
})();