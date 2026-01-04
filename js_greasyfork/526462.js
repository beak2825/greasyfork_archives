// ==UserScript==
// @name         Open2ch アラビア文字規制避け
// @namespace    https://onjmin.glitch.me/
// @version      1.0.0
// @description  アラビア文字を入力したときピンクで警告
// @author       おんJ民
// @match        *://*.open2ch.net/*/*
// @icon         https://avatars.githubusercontent.com/u/88383494
// @grant        none
// @license      GNU Affero General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/526462/Open2ch%20%E3%82%A2%E3%83%A9%E3%83%93%E3%82%A2%E6%96%87%E5%AD%97%E8%A6%8F%E5%88%B6%E9%81%BF%E3%81%91.user.js
// @updateURL https://update.greasyfork.org/scripts/526462/Open2ch%20%E3%82%A2%E3%83%A9%E3%83%93%E3%82%A2%E6%96%87%E5%AD%97%E8%A6%8F%E5%88%B6%E9%81%BF%E3%81%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ngList = [
        8239,
        65279
    ];
    window.document.addEventListener('paste', (e) => {
        if (e.target.tagName !== 'TEXTAREA') return;
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');
        for (const ng of ngList) {
            if (pasteData.includes(String.fromCharCode(ng))) {
                e.target.style.backgroundColor = 'pink';
                [...document.querySelectorAll('[type="submit"]')].forEach(e => {
                    e.disabled = true;
                });
            }
        }
    });
})();