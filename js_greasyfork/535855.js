// ==UserScript==
// @name         Unlock the permission to copy in lark or Feishu documents
// @namespace    https://gotocompany.sg.larksuite.com
// @version      1.3
// @description  Unlock replication restrictions in Lark documents
// @author       kai.zhan(jaris)
// @match        https://gotocompany.sg.larksuite.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535855/Unlock%20the%20permission%20to%20copy%20in%20lark%20or%20Feishu%20documents.user.js
// @updateURL https://update.greasyfork.org/scripts/535855/Unlock%20the%20permission%20to%20copy%20in%20lark%20or%20Feishu%20documents.meta.js
// ==/UserScript==



(function () {
    'use strict';

    const enableCopy = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        const unblockEvents = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu'];
        unblockEvents.forEach(event => {
            window.addEventListener(event, function (e) {
                e.stopPropagation();
            }, true);
        });

        // Regularly clear interceptors that Feishu may re-inject
        const observer = new MutationObserver(() => {
            document.querySelectorAll('[style*="user-select: none"]').forEach(el => {
                el.style.userSelect = 'text';
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener('load', () => {
        setTimeout(enableCopy, 1000);  // Wait 1 second for the page to load before lifting the throttling
    });
})();

