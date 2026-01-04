// ==UserScript==
// @license MIT
// @name         BUAA DS水印去除
// @namespace    http://chat.buaa.edu.cn/
// @version      2025-03-05
// @description  HAHA
// @author       HCPTHY
// @match        https://chat.buaa.edu.cn/*
// @icon         https://chat.buaa.edu.cn/common/get_file?file_rcn=afb69b04deb605d870afa819c2c337e1857550ccAgAMAFNTA1MMA1QGAAUFV1NTDFRLQVEBFFgFVFFJUQEECwAEB1FRAVYFAANSUwVSV1Y
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528845/BUAA%20DS%E6%B0%B4%E5%8D%B0%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/528845/BUAA%20DS%E6%B0%B4%E5%8D%B0%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    waitForElm('.n-watermark').then((elm) => {
        elm.style.display = 'none';
    });
})();