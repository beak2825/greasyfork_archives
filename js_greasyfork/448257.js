// ==UserScript==
// @name         Launch Job
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  autoscript for launching jobs on zhiyan
// @author       artanis
// @match        https://zhiyan.woa.com/operate/101/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woa.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448257/Launch%20Job.user.js
// @updateURL https://update.greasyfork.org/scripts/448257/Launch%20Job.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    function waitForElmWithFunc(select) {
        return new Promise(resolve => {
            if (select()) {
                return resolve(select());
            }

            const observer = new MutationObserver(mutations => {
                if (select()) {
                    resolve(select());
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    function waitForElm(selector) {
        return waitForElmWithFunc(() => {
            return document.querySelector(selector);
        });
    };

    function findSpan(text) {
        let spans = document.querySelectorAll("span.title-txt");
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].textContent.includes(text)) {
                return spans[i];
            }
        }
    }

    function resourceResolved() {
        let approveBnt = document.querySelector("div.approve-row button:not(.not-approve)");
        if (approveBnt) {
            return approveBnt;
        }

        return findSpan("资源不足");
    }

    async function execute() {
        let execBtn = await waitForElm("div.btn-area button.t-button--theme-primary");
        execBtn.click();

        await waitForElmWithFunc(() => {
            return findSpan("上线参数填写");
        });

        let approveBtn = await waitForElm("div.approve-row button:not(.not-approve)");
        approveBtn.click();

        await waitForElmWithFunc(() => {
            return findSpan("TAB-ModelTraining 版本获取成功");
        });

        let resolved = await waitForElmWithFunc(resourceResolved);
        if (resolved.nodeName.toLowerCase() === "button") {
            resolved.click();
            return true;
        }
        return false;
    }

    let start = document.createElement("button");
    start.id = "start";
    start.textContent = "循环";
    start.classList.add("t-button", "t-size-m", "t-button--variant-base", "t-button--theme-default");

    start.onclick = async function() {
        while (true) {
            try {
                let timeoutId;

                const delay = new Promise(function(resolve, reject){
                    timeoutId = setTimeout(function(){
                        reject(new Error('timeout'));
                    }, 1000 * 120);
                });

                // overall timeout
                let finished = await Promise.race([delay, execute()]).then((res) => {
                    clearTimeout(timeoutId);
                    return res;
                });

                if (finished) break;
            }
            catch (e) {
                console.log(e);
            }
        }
    };

    let btnArea = await waitForElm("div.btn-area");
    let h2 = await waitForElmWithFunc(() => {
        let title = document.querySelector("h2.title");
        if (title.childNodes.length > 0 && title.childNodes[0].nodeValue.trim().length > 0) {
            return title;
        }
    });
    if (h2.textContent.includes("任务执行工具_模型训练")) {
        btnArea.appendChild(start);
    }
})();