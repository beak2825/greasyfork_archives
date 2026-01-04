// ==UserScript==
// @name         Fuck 抢课
// @namespace    http://tampermonkey.net/
// @version      2024-07-29
// @description  把课程英文名替换成课程 id
// @author       okok
// @match        http://jw.hitsz.edu.cn/*
// @icon         https://dxcdp.hitsz.edu.cn/portal/bg_32X32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502084/Fuck%20%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502084/Fuck%20%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the original XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;

    // Override the XMLHttpRequest open method
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4 && this.responseURL === "http://jw.hitsz.edu.cn/Xsxk/queryKxrw") {
                // Parse the response text
                let responseData = JSON.parse(this.responseText);
                console.log(responseData);
                let kxrwList = responseData.kxrwList;
                for (let i = 0; i < kxrwList.list.length; i++) {
                    let kc = {
                        kcmc: kxrwList.list[i].kcmc,
                        id: kxrwList.list[i].id,
                        kcdm: kxrwList.list[i].kcdm
                    }
                    responseData.kxrwList.list[i].kcmc_en = kc["id"];
                }
                Object.defineProperty(this, "responseText", { value: JSON.stringify(responseData) });
                Object.defineProperty(this, "response", { value: JSON.stringify(responseData) });
            }
            // console.log("Hi, I'm a tamper script! XMLHttpRequest open method is called!");
        });
        return originalXHROpen.apply(this, arguments);
    };
})();