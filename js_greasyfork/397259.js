// ==UserScript==
// @name         Reomve ZhiHu Link Redirect
// @namespace    https://greasyfork.org/users/20921
// @version      0.5
// @description  去除知乎链接的重定向
// @author       roshanca
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @icon         https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @grant        none
// jshint        esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/397259/Reomve%20ZhiHu%20Link%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/397259/Reomve%20ZhiHu%20Link%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'use esversion: 6';

    const clearDoc = (doc) => {
        doc.querySelectorAll('a.external, a.LinkCard').forEach((link) => {
            const regRet = link.href.match(/target=(.+?)(&|$)/);
            if (regRet && regRet.length == 3) {
                link.href = decodeURIComponent(regRet[1]);
            }
        });
    };

    clearDoc(document);

    document.addEventListener('DOMNodeInserted', (e) => {
        clearDoc(e.target);
    });
})();