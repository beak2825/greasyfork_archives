// ==UserScript==
// @name         nga 😆
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  替换点赞为😆
// @author       izumi
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://bbs.nga.cn/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ngabbs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459465/nga%20%F0%9F%98%86.user.js
// @updateURL https://update.greasyfork.org/scripts/459465/nga%20%F0%9F%98%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .goodbad a[title="支持"] svg {
        display: none;
    }
    .goodbad a[title="支持"]:before {
        content: '😆';
    }`;
    document.getElementsByTagName('head')[0].appendChild(style);
})();