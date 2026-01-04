// ==UserScript==
// @name         【zPortal】禁用CRM登录动画
// @namespace    http://hndx.fcsys.eu.org/
// @version      2025.0414
// @description  为 ZTE zPortal 禁用 CRM 登录动画，以便节省计算机性能
// @author       xRetia
// @license      MIT
// @match        *://crm.zcm.cloudns.ch:*/portal-web/*
// @match        *://crm.hnx.ctc.com:*/portal-web/*
// @match        *://web.portal.crm.bss.it.hnx.ctc.com:*/portal-web/*
// @icon         http://hn.189.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472524/%E3%80%90zPortal%E3%80%91%E7%A6%81%E7%94%A8CRM%E7%99%BB%E5%BD%95%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/472524/%E3%80%90zPortal%E3%80%91%E7%A6%81%E7%94%A8CRM%E7%99%BB%E5%BD%95%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(()=> {
        var aniParent = document.querySelector('.js-login-animation');
        var aniElemt;
        if (aniParent !== null && (aniElemt = aniParent.querySelector('svg')) !== null) {
            var svgElemt = aniParent.innerHTML;
            aniElemt.remove();
            aniParent.style.textAlign = "center";
            aniParent.innerHTML = svgElemt;
        }
    }, 1000);
})();