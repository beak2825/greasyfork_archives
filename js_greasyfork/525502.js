// ==UserScript==
// @name         Anti WANDHI DetectAdBlock
// @namespace    http://tampermonkey.net/
// @version      2025-02-01
// @description  禁用玩的嗨网页上的反广告拦截器
// @author       Sheep-realms
// @match        https://music.wandhi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wandhi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525502/Anti%20WANDHI%20DetectAdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/525502/Anti%20WANDHI%20DetectAdBlock.meta.js
// ==/UserScript==

setInterval(() => {
    window.detectAdBlock = undefined;
    window.elc = undefined;
}, 100);