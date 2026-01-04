// ==UserScript==
// @name         YouTube logo replacement with PornHub
// @namespace    http://tampermonkey.net/
// @version      6.9.6.9
// @description  A script to replace the YouTube logo with PornHub logo!
// @author       saiko
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
 // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446271/YouTube%20logo%20replacement%20with%20PornHub.user.js
// @updateURL https://update.greasyfork.org/scripts/446271/YouTube%20logo%20replacement%20with%20PornHub.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.getElementById('logo').innerHTML = '<img src="https://di.phncdn.com/www-static/images/pornhub_logo_straight.png" height="25px" />';
})();