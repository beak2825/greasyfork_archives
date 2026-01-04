// ==UserScript==
// @name         for you
// @namespace    twitter.com/takaiy0
// @version      0.3
// @description  undo twitter's terrible change
// @author       takaiyo
// @match        https://twitter.com/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458661/for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/458661/for%20you.meta.js
// ==/UserScript==


'use strict';

var isClicked;
const interval = setInterval(() => {
    var homes = document.querySelectorAll("[href='/home']")
    for (var e of homes) {
        if (e.textContent == "Following") {

            e.click();
            clearInterval(interval);
        }

    }
}, 50);
setTimeout(() => {clearInterval(interval)}, 15000);

//followDiv = document.querySelector('.css-901oao.r-1awozwy.r-1bwzh9t.r-6koalj.r-18u37iz.r-37j5jr.r-a023e6.r-majxgm.r-1pi2tsx.r-1777fci.r-rjixqe.r-bcqeeo.r-1l7z4oj.r-95jzfe.r-bnwqim.r-qvutc0');

