// ==UserScript==
// @name         Gooboo煤渣升级项性价比
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  煤渣活动展示煤渣升级项性价比
// @author       Thamior
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        https://gooboo.g8hh.com.cn/1.4.2/
// @match        *://gooboo.tkfm.online/
// @icon         https://tendsty.github.io/gooboo/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523847/Gooboo%E7%85%A4%E6%B8%A3%E5%8D%87%E7%BA%A7%E9%A1%B9%E6%80%A7%E4%BB%B7%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/523847/Gooboo%E7%85%A4%E6%B8%A3%E5%8D%87%E7%BA%A7%E9%A1%B9%E6%80%A7%E4%BB%B7%E6%AF%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const store = document.getElementsByClassName("primary")[0].__vue__.$store;
    const arr = [
        {
            gainText: "cindersProductionFirefly",
            priceText: "firefly",
            rate: "",
            rateText: "",
        },
        {
            gainText: "cindersProductionGlowshroom",
            priceText: "glowshroom",
            rate: "",
            rateText: "",
        },
        {
            gainText: "cindersProductionGlowfish",
            priceText: "glowfish",
            rate: "",
            rateText: "",
        },
    ];
    let min;

    const intervalId = setInterval(() => {
        calculate();
        if (document.querySelectorAll(".thamior-light-rateText").length == 3) {
            changeElement();
        } else if (document.querySelectorAll(".pa-1.col.col-4 .v-badge").length){
            createElement()
        }
    }, 1000);

    function calculate(params) {
        arr.forEach((element, index) => {
            //获取购买价格
            const price = store.state.upgrade.item["event_" + element.priceText].price(
                store.state.upgrade.item["event_" + element.priceText].bought
            ).event_light;
            //获取单个速率
            const lightGain = store.getters["mult/get"](element.gainText);
            //计算单价
            const rate = price / lightGain;

            element.rate = rate;
            const rateText = "提升1增益所需的光量为：" + formatNumber(rate);
            element.rateText = rateText;

            if (!min) {
                min = element.rate;
            } else {
                min = min > element.rate ? element.rate : min;
            }
        });
    }

    function createElement(params) {
        arr.forEach((element, index) => {
            //dom操作
            const priceDom = document.querySelectorAll(".pa-1.col.col-4 .v-badge")[
                index
            ];
            const rateDom = document.createElement("span");
            rateDom.classList.add("thamior-light-rateText");
            rateDom.textContent = element.rateText;
            if (element.rate == min) {
                rateDom.style.color = "green";
            }
            priceDom.after(rateDom);
        });
    }

    function changeElement(params) {
        arr.forEach((element, index) => {
            //dom操作
            const rateDom = document.querySelectorAll(".thamior-light-rateText")[
                index
            ];
            rateDom.textContent = element.rateText;
            if (element.rate == min) {
                rateDom.style.color = "green";
            }
        });
    }
    //格式化数据
    function formatNumber(num) {
        if (num < 1000) return num; // 小于1000的数字直接返回
        const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "O", "N", "D"];
        let unitIndex = 0;
        while (num >= 1000 && unitIndex < units.length) {
            num /= 1000;
            unitIndex++;
        }
        return num.toFixed(2) + (unitIndex > 0 ? units[unitIndex - 1] : "");
    }


})();