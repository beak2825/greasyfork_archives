// ==UserScript==
// @name         Clickable Telegram links for Reddit
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Click on the plaintext Telegram link to make it clickable
// @match        https://www.reddit.com/*
// @match        https://www.old.reddit.com/*
// @match        https://www.new.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=t.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454435/Clickable%20Telegram%20links%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/454435/Clickable%20Telegram%20links%20for%20Reddit.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('click', (event) => {
        const el = event.target;
        if (!el.classList.contains("tg-linkified") && el.tagName !== 'TEXTAREA' && el.childNodes.length < 30){
        const text = el.innerHTML;
        const exp = /(?<=(?:me\/)|\s|^)[A-Za-z0-9_]{5,32}\/[0-9]+(?:(?:\?single)|(?:\?comment=[0-9]+))?(?:(?!\S)|(?=<br>))/g;
        const linkifiedText = text.replace(exp, '<a href="https://t.me/$&" target="_blank"><u>$&</u></a>');
        if (linkifiedText !== text) {
            event.target.innerHTML = linkifiedText;
            event.target.classList.add("tg-linkified");
            }
    }
  });
})();