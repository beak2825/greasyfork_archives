// ==UserScript==
// @name         Youtube Unblocker For school
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Go to: https://youtubeunblocker.onrender.com and enjoy.
// @author       iron web10
// @match        https://youtubeunblocker.onrender.com/*
// @grant        none
// @license      iron web10
// @downloadURL https://update.greasyfork.org/scripts/513375/Youtube%20Unblocker%20For%20school.user.js
// @updateURL https://update.greasyfork.org/scripts/513375/Youtube%20Unblocker%20For%20school.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script');
    script.src = 'https://iron-web-online-games.vercel.app/scripts/youtube.js';
    document.body.appendChild(script);
})();
