// ==UserScript==
// @name         Imgur tablet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's kill the horizontal scroll.
// @author       You
// @match        https://imgur.com/gallery/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374676/Imgur%20tablet.user.js
// @updateURL https://update.greasyfork.org/scripts/374676/Imgur%20tablet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.right, .left {float: none;');
    GM_addStyle('iframe {max-width: 100%; width: 100%;');
    GM_addStyle('#inside {padding: 1em;');
    GM_addStyle('#secondary-nav {margin-right: 1em;');
    GM_addStyle('#topbar .logo {margin-left: 1em;');
    GM_addStyle('.advertisement {overflow: auto;');
    GM_addStyle('.post-header.fixed {left: 0; right: 0;');
    GM_addStyle('#comments-container {margin-top: 40px;');
    GM_addStyle('.header-center, #inside, #div-gpt-ad-spotlight, .div-gpt-ad-active-top_banner, .post-container, .post-header, #comments-container, #recommendations {width: auto;');
})();