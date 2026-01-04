// ==UserScript==
// @name         Hide Hidden Replies
// @name:fr      Cacher Reponses Masquées
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Protect yourself from hideous tweets.
// @description:fr  Protégez-vous de tweet hideux.
// @author       LOUDO
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472370/Hide%20Hidden%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/472370/Hide%20Hidden%20Replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const head = document.head;
    const style = document.createElement('style')

    style.innerHTML = `
        a[class="css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1777fci r-bt1l66 r-1ny4l3l r-bztko3 r-lrvibr"]{
            display: none;

        }

    `

    head.appendChild(style)
})();