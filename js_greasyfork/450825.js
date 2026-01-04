// ==UserScript==
// @name         Remove the "Create Clip" button from YouTube
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Удаляет кнопку "Создать клип"
// @author       PoolSmoke
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450825/Remove%20the%20%22Create%20Clip%22%20button%20from%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/450825/Remove%20the%20%22Create%20Clip%22%20button%20from%20YouTube.meta.js
// ==/UserScript==

'use strict';

let currentLocation = window.location.href;

function TestBlock() {
    if (document.querySelector('#top-level-buttons-computed > ytd-button-renderer:nth-child(5)')){
        document.querySelector('#top-level-buttons-computed > ytd-button-renderer:nth-child(5)').remove();
        clearInterval(timerId1);
    }
}

function CheckURL() {
    if (window.location.href != currentLocation){
        currentLocation = window.location.href;
        timerId1 = setInterval(TestBlock, 1000);
    }
}

let timerId1 = setInterval(TestBlock, 1000);
let timerId2 = setInterval(CheckURL, 5000);
