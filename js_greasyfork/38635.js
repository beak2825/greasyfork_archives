// ==UserScript==
// @name         DiscordRTL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Right-to-left text support in discord web app.
// @author       Bary Levi
// @match        https://discordapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38635/DiscordRTL.user.js
// @updateURL https://update.greasyfork.org/scripts/38635/DiscordRTL.meta.js
// ==/UserScript==

const heb = /\p{Script=Hebrew}/u;
setInterval(() => {
    document.querySelectorAll('.markup').forEach(node => {
        if (heb.test(node.innerHTML)) {
            node.setAttribute('dir', 'rtl');
        }
    });

    document.querySelector('textarea').oninput = function textAreaChange() {
        console.log('called');
        const ta = document.querySelector('textarea');
        if(heb.test(ta.innerHTML)) {
            ta.setAttribute('dir', 'rtl');
        } else {
            ta.setAttribute('dir', 'ltr');
        }
    };
}, 300);
