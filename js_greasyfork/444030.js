// ==UserScript==
// @name         评教评学Hacker
// @namespace    PingJiaoPingXueHacker
// @version      0.1
// @description  自动单选是
// @author       Tony Bao
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @match        https://service.sdsz.com.cn/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sdsz.com.cn
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444030/%E8%AF%84%E6%95%99%E8%AF%84%E5%AD%A6Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/444030/%E8%AF%84%E6%95%99%E8%AF%84%E5%AD%A6Hacker.meta.js
// ==/UserScript==

(async function () {
    function delay(timout) {
        return new Promise(resolve => {
            setTimeout(function () {
                resolve();
            }, timout);
        })
    }

    async function logic() {
        let yesEs;
        while (true) {
            let elements = document.querySelectorAll('.ant-form-item-children input[value]');
            yesEs = Array.from(elements).filter(e => e.value == '1');
            if (yesEs.length > 0) {
                break;
            } else {
                await delay(100);
            }
        }
        console.log(yesEs);
        for (let i = 0; i < yesEs.length; i++) {
            let yesE = yesEs[i];
            yesE.click();
        }
    }

    function hotkeys() {
        GM_registerMenuCommand("自动填是", logic, "l");
        $(document).keydown(async function (e) {
            if (e.ctrlKey && e.shiftKey) {
                if (e.which == 76) {//L
                    await logic();
                }
            }
        });
    }

    hotkeys();
}())