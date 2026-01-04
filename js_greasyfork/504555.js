// ==UserScript==
// @name         Pink Claude
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT 
// @description  For when u need bimbofied AI. We've all been there, right?
// @author       Kayleigh
// @icon         https://claude.ai/favicon.ico
// @match        https://claude.ai/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504555/Pink%20Claude.user.js
// @updateURL https://update.greasyfork.org/scripts/504555/Pink%20Claude.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //document.body.setAttribute('style', 'background: #FFDEF4;');
    document.documentElement.style.setProperty('--bg-200', '320 100% 94%');
    document.documentElement.style.setProperty('--bg-300', '319 100% 91%');
    document.documentElement.style.setProperty('--bg-400', '261 42% 86%');
    //document.documentElement.setAttribute('[data-theme="claude"]', '--bg-200: 320 100% 94%');
    //document.html.setAttribute('--bg-200', '320 100% 94%');
    // works
    //document.documentElement.style.cssText = "--bg-200: 320 100% 94%";
})();