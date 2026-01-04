// ==UserScript==
// @name         ClickScript
// @namespace    http://tampermonkey.net/
// @version      2024-9-20
// @description  用于巨量百应直播中控台自动点击讲解脚本
// @author       Hershey
// @match        https://buyin.jinritemai.com/dashboard/live/control?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/516796/ClickScript.user.js
// @updateURL https://update.greasyfork.org/scripts/516796/ClickScript.meta.js
// ==/UserScript==

"use strict";

let link1XPath='//div[@class="goodsItem-KBGOY5 rpa_lc__live-goods__goods-item"][1]'
let link2XPath='//div[@class="goodsItem-KBGOY5 rpa_lc__live-goods__goods-item"][2]'
let link3XPath='//div[@class="goodsItem-KBGOY5 rpa_lc__live-goods__goods-item"][3]'
let link4XPath='//div[@class="goodsItem-KBGOY5 rpa_lc__live-goods__goods-item"][4]'

class ClickScript {
    constructor() {
        this.init()
    }

    init() {
        this.start()
    }

    start() {
        this.click()
    }

    //自动每隔15s点击两次
    click() {
        let result = document.evaluate(link1XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const btn = result.singleNodeValue;
        if (btn) {
            // 第一次点击
            btn.click();
            console.log("Clicked button.");

            // 在1秒后进行第二次点击
            setTimeout(() => {
                if (btn) {
                    btn.click();
                    console.log("Clicked button again.");
                }
            }, 1000); // 1秒后点击第二次
        }

        // 15秒后再次调用 click()，即每隔15秒点击两次
        setTimeout(() => {
            this.click();
            console.log("Waiting for 15 seconds.");
        }, 15000);
    }
}

(function() {
    window.addEventListener("load", () => {
        // 每隔1秒检查元素是否加载
        const interval = setInterval(() => {
            const targetButton = document.querySelector("button.auxo-btn.auxo-btn-primary");
            if (targetButton) {
                console.log("找到按钮元素！");
                clearInterval(interval); // 找到后停止检查
                //加载自动点击函数
                new ClickScript();
            }
            else {
                console.log("未找到按钮元素！");
            }
        }, 5000);
    });
})();