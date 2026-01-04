// ==UserScript==
// @name         BUFF自动计算当前商品倒余额的利率
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  自动在商品界面的价格旁添加一个利率标签
// @author       You
// @match        https://buff.163.com/goods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494059/BUFF%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%BD%93%E5%89%8D%E5%95%86%E5%93%81%E5%80%92%E4%BD%99%E9%A2%9D%E7%9A%84%E5%88%A9%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/494059/BUFF%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%BD%93%E5%89%8D%E5%95%86%E5%93%81%E5%80%92%E4%BD%99%E9%A2%9D%E7%9A%84%E5%88%A9%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        let regexPrice = /\d+(\.\d+)?/;
        let PriceDOM;

        function main() {
            PriceDOM = document.getElementsByClassName("f_Strong");
            if (PriceDOM && PriceDOM.length == 12) {
                let steamPriceText = PriceDOM[1].innerText;
                let steamPrice = (regexPrice.exec(steamPriceText)[0]);
                let buffslowestPriceText = PriceDOM[2].innerText;
                let buffslowestPrice = (regexPrice.exec(buffslowestPriceText))[0];
                let RateLabel = document.createElement("label");
                let Rate = calculateInterestRates(steamPrice, buffslowestPrice);
                RateLabel.innerHTML = "利率" + Rate + "%";
                PriceDOM[1].appendChild(RateLabel);
                observer.disconnect(); // 停止观察
            }else if (PriceDOM && PriceDOM.length == 11) {
                let steamPriceText = PriceDOM[0].innerText;
                let steamPrice = (regexPrice.exec(steamPriceText)[0]);
                let buffslowestPriceText = PriceDOM[1].innerText;
                let buffslowestPrice = (regexPrice.exec(buffslowestPriceText))[0];
                let RateLabel = document.createElement("label");
                let Rate = calculateInterestRates(steamPrice, buffslowestPrice);
                RateLabel.innerHTML = "利率" + Rate + "%";
                PriceDOM[0].appendChild(RateLabel);
                observer.disconnect(); // 停止观察
            }
        }

        function calculateInterestRates(steamPrice, buffslowestPrice) {
            let InterestRates = (steamPrice * 0.85 - buffslowestPrice) / buffslowestPrice;
            InterestRates = Math.round(InterestRates * 10000) / 100;
            return InterestRates;
        };
        // 创建一个观察器实例并传入回调函数
        var observer = new MutationObserver(main);

        // 观察器的配置（需要观察什么变动）
        var config = { childList: true, subtree: true };

        // 定期检查元素是否存在
        var checkExist = setInterval(function () {
            var targetNode = document.querySelector('.list_tb_csgo');
            if (targetNode) {
                // 传入目标节点和观察配置
                observer.observe(targetNode, config);
                clearInterval(checkExist);
                main(); // 手动调用一次 main 函数
            } else {
                console.log("目标节点未找到");
            }
        }, 500); // 每500毫秒检查一次
    }
})();