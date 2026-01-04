// ==UserScript==
// @name         Rust Doc to Chinese ver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Jump to chinese version of this doc page
// @author       安逐悲
// @match        *://doc.rust-lang.org/*
// @icon         https://www.rust-lang.org/static/images/rust-logo-blk.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473924/Rust%20Doc%20to%20Chinese%20ver.user.js
// @updateURL https://update.greasyfork.org/scripts/473924/Rust%20Doc%20to%20Chinese%20ver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const AllUrl="https://rustwiki.org";
    const TargetUrl="https://rustwiki.org/zh-CN";
    let head=document.querySelector('.search-form');
    let btn = document.createElement('button');
    btn.type='button';
    let currentUrl= document.URL;
    const hostname = window.location.hostname;
    const path = currentUrl.split(hostname)[1];

    btn.textContent = '转到中文站';

    btn.addEventListener('click',() => {
        window.location.href = TargetUrl+path;
    });
    head.appendChild(btn);
})();