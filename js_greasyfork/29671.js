// ==UserScript==
// @name         Dark mode fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixed youtube's dark mode
// @author       Not BeeQueue
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29671/Dark%20mode%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/29671/Dark%20mode%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = '--yt-swatch-primary:rgb(35,35,35); --yt-swatch-primary-darker:rgb(32,32,32); --yt-swatch-text:rgb(255,255,255); --yt-swatch-important-text:rgb(255,255,255); --yt-swatch-input-text:rgba(255,255,255,1); --yt-swatch-textbox-bg:rgba(19,19,19,1); --yt-swatch-logo-override:rgb(255,255,255); --yt-swatch-icon-color:rgba(136,136,136,1);';

    document.body.setAttribute('dark', 'true');
    document.getElementById('masthead').setAttribute('style', style);
})();