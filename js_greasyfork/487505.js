// ==UserScript==
// @name         Luogu Solutions for Codeforces
// @namespace    https://subc.rip
// @version      2024-02-17
// @description  Add a button to your Codeforces tool bar.
// @author       subcrip
// @match        https://codeforces.com/problemset/problem/*
// @match        https://codeforces.com/contest/*/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487505/Luogu%20Solutions%20for%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/487505/Luogu%20Solutions%20for%20Codeforces.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.pathname.split('/');
    let contest, problem;
    if (url.includes('contest')) {
        contest = url[2];
        problem = url[4];
    } else {
        contest = url[3];
        problem = url[4];
    }
    let button = document.createElement('li');
    let inner = document.createElement('a');
    inner.target = '_blank';
    inner.href = `https://www.luogu.com.cn/problem/solution/CF${contest}${problem}`;
    inner.innerText = 'SOLUTIONS';
    button.appendChild(inner);
    let menu = document.getElementsByClassName('second-level-menu-list')[0];
    menu.insertBefore(button, menu.children[2])
})();