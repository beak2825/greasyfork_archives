// ==UserScript==
// @name         Disable sub / sup tags on F-List.net
// @namespace    http://f-list.net/c/Grimokk
// @version      1.0
// @description  For people that don't like the tags or can't read the small text. Applies to site and chat.
// @author       Grimokk
// @match        https://www.f-list.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f-list.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469904/Disable%20sub%20%20sup%20tags%20on%20F-Listnet.user.js
// @updateURL https://update.greasyfork.org/scripts/469904/Disable%20sub%20%20sup%20tags%20on%20F-Listnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }

        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;

        head.appendChild(style);
    }

    addGlobalStyle('sup, sub {font-size: 100% !important; vertical-align: baseline !important;}');
})();