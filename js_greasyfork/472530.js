// ==UserScript==
// @name         【zPortal】固话选号补丁
// @namespace    http://hndx.fcsys.eu.org/
// @version      2024.1127
// @description  为 ZTE zPortal 修复部分浏览器在进行固话选号时，无法弹出选号列表
// @author       xRetia
// @license      MIT
// @match        *://crm.zcm.cloudns.ch:*/portal-web/*
// @match        *://crm.hnx.ctc.com:*/portal-web/*
// @match        *://134.176.172.29:*/portal-web/*
// @icon         http://hn.189.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472530/%E3%80%90zPortal%E3%80%91%E5%9B%BA%E8%AF%9D%E9%80%89%E5%8F%B7%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/472530/%E3%80%90zPortal%E3%80%91%E5%9B%BA%E8%AF%9D%E9%80%89%E5%8F%B7%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(()=> {
        var elAddrFrm = document.querySelector('#addrFrame');
        if (elAddrFrm && elAddrFrm.zteForceReload !== true) {
            elAddrFrm.zteForceReload = true;
            elAddrFrm.src = elAddrFrm.src;
        }
    }, 1500);
})();