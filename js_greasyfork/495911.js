// ==UserScript==
// @name         Discord Crimson Moon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Discord theme: Crimson Moon without nitro.. its a work in progress and is still buggy
// @author       MrBlank
// @license MIT
// @match        https://discord.com/*
// @match        https://discordapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495911/Discord%20Crimson%20Moon.user.js
// @updateURL https://update.greasyfork.org/scripts/495911/Discord%20Crimson%20Moon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyHTMLTag() {
        var htmlTag = document.documentElement;

        htmlTag.setAttribute('lang', 'en-GB');
        htmlTag.setAttribute('style', 'font-size: 100%; --saturation-factor: 1; --devtools-sidebar-width: 0px;');
        htmlTag.setAttribute('data-rh', 'lang,style,class');

        htmlTag.classList.add('custom-theme-background', 'full-motion', 'show-redesigned-icons', 'has-webkit-scrollbar', 'theme-dark', 'platform-web', 'font-size-16');
    }
    function e() {
        var style = document.createElement('style');
        style.setAttribute('data-client-themes', 'true');
        style.setAttribute('data-rh', 'true');
        style.textContent = `
    .custom-theme-background {
        --custom-theme-background: linear-gradient(64.92deg, var(--bg-gradient-crimson-moon-1) 16.17%, var(--bg-gradient-crimson-moon-2) 72%);
    }`;
        document.head.appendChild(style);
    }
    e()
    modifyHTMLTag();

    setInterval(modifyHTMLTag, 1);
    setInterval(e, 1);
})();
