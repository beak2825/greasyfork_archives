// ==UserScript==
// @name         [KPX] Reddit RES random fix
// @namespace    https://www.reddit.com
// @version      0.2
// @description  Fix broken /r/random
// @author       KPCX
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498011/%5BKPX%5D%20Reddit%20RES%20random%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/498011/%5BKPX%5D%20Reddit%20RES%20random%20fix.meta.js
// ==/UserScript==

if (document.readyState !== 'loading') {
    fix();
} else {
    document.addEventListener('DOMContentLoaded', fix);
}

function fix() {
    let tmp_id = Math.floor(Math.random() * 1000000);
    let random = document.querySelector("a[href='/r/random/']");
    if (random) {
        random.href = '/r/random/?tmprnd=' + tmp_id;
    }

    let randnsfw = document.querySelector("a[href='/r/randnsfw/']");
    if (randnsfw) {
        randnsfw.href = '/r/randnsfw/?tmprnd=' + tmp_id;
    }
}