// ==UserScript==
// @name         close-modal
// @namespace    https://www.haijiao.com
// @version      0.0.2
// @description  close modal
// @author       You
// @match        https://haijiao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459854/close-modal.user.js
// @updateURL https://update.greasyfork.org/scripts/459854/close-modal.meta.js
// ==/UserScript==

function closeModal(){
    const btn = document.querySelector("#app > div:nth-child(5) > div:nth-child(1) > div > div.el-dialog__footer > span > button");
    if (btn){
        btn.click();
    }
    const span = document.querySelector("#app > div:nth-child(5) > div:nth-child(2) > div > div.el-dialog__footer > span > span");
    if(span){
        span.click();
    }
}

function closeLoginModal(){
    const btn = document.querySelector("#body > div.el-message-box__wrapper > div > div.el-message-box__header > button");
    if (btn){
        btn.click();
    }
}

(function() {
    'use strict';
    setTimeout(() => closeModal(), 1000);
    setTimeout(() => closeLoginModal(), 1500);
})();