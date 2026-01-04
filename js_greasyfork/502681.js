// ==UserScript==
// @name         Nicovideo Round Remover
// @namespace    https://yakisova.com
// @version      1.0.0
// @description  ニコニコ動画の動画の角丸をなくします。
// @author       yakisova41
// @match        https://www.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502681/Nicovideo%20Round%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/502681/Nicovideo%20Round%20Remover.meta.js
// ==/UserScript==

GM_addStyle('div[aria-label="nicovideo-content"] > section > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) {border-radius:0;}');
