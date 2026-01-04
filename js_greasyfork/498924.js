// ==UserScript==
// @name         claimlite.club
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  claimlite
// @author       LTW
// @license      none
// @match        https://claimlite.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimlite.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498924/claimliteclub.user.js
// @updateURL https://update.greasyfork.org/scripts/498924/claimliteclub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let redirecionamento = '';

function c() {
    const p = document.querySelector('[data-target="#myModal"]');
    if (p && i(p)) {
        p.click();
        setTimeout(() => {
            const s = document.querySelector('[data-target="#mo35dal3my"]');
            if (s && i(s)) {
                s.click();
                setTimeout(function() {
                window.location.href = redirecionamento;
            }, 4000);
            }
        }, getRandomTime());
        clearInterval(intervalId);
    }
}

function i(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getRandomTime() {
    return Math.floor(Math.random() * 2000) + 1000;
}

setTimeout(function () {location.reload();}, 180000);
const intervalId = setInterval(c, 7000);

})();