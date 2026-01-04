// ==UserScript==
// @name         New apifox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  定时刷新apifox 接口导入
// @author       You
// @match        https://app.apifox.com/project/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/472233/New%20apifox.user.js
// @updateURL https://update.greasyfork.org/scripts/472233/New%20apifox.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function startClick(list, index) {
        if (index == list.length) {
            startTimeOut();
            return;
        }
        list[index].click();

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const doneButton = document.querySelector("body > div:nth-child(24) > div > div.ui-modal-wrap > div > div.ui-modal-content > div > div > div.ui-modal-confirm-btns > button");
                    if (doneButton) {
                        doneButton.click();
                        observer.disconnect();
                        console.log('按钮已点击');
                        setTimeout(() => {
                            startClick(list, index + 1);
                        }, 2000); // 延迟两秒后处理下一个元素
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const time = 60 * 1000 * 1;
    function startTimeOut() {
        setTimeout(() => {
            const importButton = document.querySelectorAll("table button.mr-4");
            if (importButton.length > 0) {
                startClick(importButton, 0);
            } else {
                startTimeOut();
            }
        }, time);
    }

    startTimeOut();


})();


