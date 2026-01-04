// ==UserScript==
// @name         12306抢票票
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  进入 12306 首页后自动点击“单程”，然后自动填写出发站、目的地、日期并查询车票
// @author       Oyys
// @match        https://kyfw.12306.cn/*
// @match        https://www.12306.cn/index/index.html
// @icon         https://www.12306.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529366/12306%E6%8A%A2%E7%A5%A8%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529366/12306%E6%8A%A2%E7%A5%A8%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果在首页，则自动点击 "单程" 按钮
    if (window.location.href.includes("index.html")) {
        let oneWayButton = document.querySelector("a[name='g_href'][data-href='leftTicket/init?linktypeid=dc']");
        if (oneWayButton) {
            oneWayButton.click();
        }
    }

    // 如果在查询车票页面，则自动填充信息并查询
    if (window.location.href.includes("leftTicket/init")) {
        setTimeout(() => {
            // 填充出发站
            let fromStationText = document.querySelector("#fromStationText");
            let fromStation = document.querySelector("#fromStation");
            if (fromStationText && fromStation) {
//                fromStationText.value = "泰安";
//                fromStation.value = "TMK";
                fromStationText.value = "北京";
                fromStation.value = "BJP";
                fromStationText.dispatchEvent(new Event("input", { bubbles: true }));
            }

            // 填充目的地站
            let toStationText = document.querySelector("#toStationText");
            let toStation = document.querySelector("#toStation");
            if (toStationText && toStation) {
                //toStationText.value = "曹县";
                //toStation.value = "CXK";
                toStationText.value = "郑州";
                toStation.value = "ZZF";
                toStationText.dispatchEvent(new Event("input", { bubbles: true }));
            }

            // 填充出发日期
            let trainDate = document.querySelector("#train_date");
            if (trainDate) {
                trainDate.value = "2025-03-20";
                trainDate.dispatchEvent(new Event("input", { bubbles: true }));
            }

            // 点击查询按钮
            setTimeout(() => {
                let queryButton = document.querySelector("#query_ticket");
                if (queryButton) {
                    queryButton.click();
                }
            }, 1000); // 1秒后点击查询按钮，确保填充完成
        }, 2000); // 等待2秒，确保页面加载完成
    }
})();