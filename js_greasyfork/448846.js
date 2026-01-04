// ==UserScript==
// @name         Launch Taiji Job
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autoscript for launching jobs on taiji
// @author       artanis
// @match        http://a.taiji.oa.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woa.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448846/Launch%20Taiji%20Job.user.js
// @updateURL https://update.greasyfork.org/scripts/448846/Launch%20Taiji%20Job.meta.js
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

    async function execute() {
        let msg = document.querySelector("div.ant-message span");
        while (msg && msg.children.length > 1) msg.removeChild(msg.children[0]);

        let btn = await waitForElm("div.btns-item button.first-child");
        btn.click();

        await waitForElm("div.btns-item i.canvas-toolbar-bottom__loading");

        await waitForElmWithFunc(() => {
            let loading = document.querySelector("div.btns-item i.canvas-toolbar-bottom__loading");
            if (loading) {
                return false;
            } else {
                return true;
            }
        });

        btn = await waitForElm("div.btns-item button.first-child");
        return btn.textContent.includes("停止运行");
    }

    let span = document.createElement("span");
    span.textContent = "循环";

    let start = document.createElement("button");
    start.id = "start";
    start.title = "循环";
    start.type = "button";
    start.classList.add("btn");
    start.appendChild(span);

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

    await waitForElmWithFunc(() => {
        let span = document.querySelector("span.toolbar-top__flow-name span");
        if (span && span.textContent.includes("_burn")) {
            return span;
        }
    });

    // wait for 2 seconds
    await new Promise(res => setTimeout(res, 2000));

    await waitForElmWithFunc(() => {
        let btn = document.querySelector("div.btns-item button.first-child");
        if (btn && btn.textContent.includes("运行")) {
            return btn;
        }
    });
    let btnArea = await waitForElm("div.btns-item");
    btnArea.appendChild(start);
})();