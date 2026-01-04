// ==UserScript==
// @name         Zen Mode for Codeforces
// @namespace    https://subc.rip
// @version      2024-02-19
// @description  Add a button to your Codeforces tool bar.
// @author       subcrip
// @match        https://codeforces.com/contest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487733/Zen%20Mode%20for%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/487733/Zen%20Mode%20for%20Codeforces.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const contest = window.location.pathname.split('/')[2];
    let button = document.createElement('li');
    let inner = document.createElement('a');
    inner.target = '_blank';
    inner.href = `https://codeforces.com/contest/${contest}/problems`;
    inner.innerText = 'ZEN MODE';
    button.appendChild(inner);
    let menu = document.getElementsByClassName('second-level-menu-list')[0];
    menu.insertBefore(button, menu.children[2])
})();