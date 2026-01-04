"use strict";
// ==UserScript==
// @name         ClicknUpload-captcha
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Solve ClicknUpload/ClickNDownload Captchas
// @author       You
// @match        https://clickndownload.space/*
// @match        https://clickndownload.site/*
// @match        https://clickndownload.link/*
// @match        https://clickndownload.name/*
// @match        https://clickndownload*/*
// @match        https://clickndownload.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clickndownload.space
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486996/ClicknUpload-captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/486996/ClicknUpload-captcha.meta.js
// ==/UserScript==

const captcha = document.querySelector("#commonId > div > table > tbody > tr > td > center > table > tbody > tr:nth-child(2) > td:nth-child(1) > div");
if (captcha !== null) {
    const children = Array.from(captcha.children);
    // sort chilren based on their left padding
    const childrenSorted = children.sort((a, b) => {
        const aPadding = parseInt(a.style.paddingLeft);
        const bPadding = parseInt(b.style.paddingLeft);
        return aPadding - bPadding;
    });
    // get the text of the children
    const result = childrenSorted.map(c => c.textContent).join("");
    const input = document.querySelector("#commonId > div > table > tbody > tr > td > center > table > tbody > tr:nth-child(2) > td:nth-child(2) > input");
    if (input !== null) {
        input.value = result;
    }
}
