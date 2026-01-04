// ==UserScript==
// @name         Shibaura-skips
// @namespace    twitter.com/to_ku_me
// @version      0.1
// @description  面倒な二段階認証をスキップします
// @author       to_ku_me
// @match        https://adfs.sic.shibaura-it.ac.jp/adfs/ls/*
// @icon         http://www.sic.shibaura-it.ac.jp/MoSICA/shikaz.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426217/Shibaura-skips.user.js
// @updateURL https://update.greasyfork.org/scripts/426217/Shibaura-skips.meta.js
// ==/UserScript==

let button_check = document.getElementById("continueButton");

if (button_check) {
    button_check.click();
}