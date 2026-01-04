// ==UserScript==
// @name         MEST Batch Delete
// @namespace    joyings.com.cn
// @version      0.1
// @description  美尔斯通批量删除
// @author       zmz125000
// @match        http://*/mest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=92.133
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/444808/MEST%20Batch%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/444808/MEST%20Batch%20Delete.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function deleteNext() {
        if (document.querySelectorAll('[class="el-button table-operation el-button--default el-button--mini"]').length == 0) {
            alert("finished");
            return 1;
        }
        document.querySelectorAll('[class="el-button table-operation el-button--default el-button--mini"]')[1].click();
        setTimeout(function () {
            document.querySelectorAll('[class="el-button el-button--default el-button--small el-button--primary "]')[0].click();
        }, 100);
        window.setTimeout(deleteNext, 500);
    };

    function deleteOnce() {
        document.querySelectorAll('[class="el-button table-operation el-button--default el-button--mini"]')[1].click();
        setTimeout(function () {
            document.querySelectorAll('[class="el-button el-button--default el-button--small el-button--primary "]')[0].click();
        }, 100);
    };

    window.addEventListener('load', function () {
        var btn = document.createElement('button');
        btn.setAttribute('title', '批量删除表体项目，使用前请先筛选');
        btn.setAttribute('type', 'button')
        btn.appendChild(document.createTextNode('BatchDelete'));
        btn.onclick = deleteNext;
        document.querySelector('[class="ml15"]').appendChild(btn);
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
})();