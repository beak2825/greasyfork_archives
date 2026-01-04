// ==UserScript==
// @name         小林coding - 解锁阅读全文
// @namespace    http://tampermonkey.net/
// @description  解锁阅读全文
// @version      1.0.0
// @author       L
// @match        *://*.xiaolincoding.com/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530071/%E5%B0%8F%E6%9E%97coding%20-%20%E8%A7%A3%E9%94%81%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/530071/%E5%B0%8F%E6%9E%97coding%20-%20%E8%A7%A3%E9%94%81%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

'use strict';

function patch() {
    const readmoreContainer = document.querySelector('#readmore-container');
    if (readmoreContainer) {
        readmoreContainer.style.height = 'auto';
        Object.defineProperty(readmoreContainer.style, 'height', {
            set: () => {}
        });
    }

    const readmoreWrapper = document.querySelector('#readmore-wrapper');
    if (readmoreWrapper) {
        readmoreWrapper.remove();
    }
}

const observer = new ResizeObserver((entries) => patch());

function observe() {
    observer.disconnect();

    const target = document.querySelector('main.page div');
    if (!target) return;

    observer.observe(target);
}

window.navigation.addEventListener('navigate', observe);