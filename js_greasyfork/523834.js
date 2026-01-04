// ==UserScript==
// @name         印迹自动勾选“我参与的需求”
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动勾选指定复选框（更精确的定位）
// @author       Gemini
// @match        https://ingee.meituan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523834/%E5%8D%B0%E8%BF%B9%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E2%80%9C%E6%88%91%E5%8F%82%E4%B8%8E%E7%9A%84%E9%9C%80%E6%B1%82%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/523834/%E5%8D%B0%E8%BF%B9%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E2%80%9C%E6%88%91%E5%8F%82%E4%B8%8E%E7%9A%84%E9%9C%80%E6%B1%82%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let checkElementInterval = setInterval(function() {
            let checkboxLabels = document.querySelectorAll("label.mtd-ingee-checkbox");
            let targetCheckboxLabel = null;

            for (let i = 0; i < checkboxLabels.length; i++) {
                let label = checkboxLabels[i];
                if (label.querySelector(".mtd-ingee-checkbox-text").textContent.trim() === "我参与的") {
                    targetCheckboxLabel = label;
                    break;
                }
            }

            if (targetCheckboxLabel) {
                clearInterval(checkElementInterval);
                let checkboxInput = targetCheckboxLabel.querySelector("input[type='checkbox']");
                let checkboxInner = targetCheckboxLabel.querySelector(".mtd-ingee-checkbox-inner");

                if (checkboxInput && checkboxInner) {
                    if (!checkboxInput.checked) {
                        checkboxInner.click();
                        console.log("复选框已自动勾选。");
                    } else {
                        console.log("复选框已勾选，无需操作。");
                    }
                } else {
                    console.error("未能找到 input 或 span 元素。");
                }
            } else {
                console.log("正在等待 label 元素加载...");
            }
        }, 100);

        setTimeout(function() {
            clearInterval(checkElementInterval);
            console.log("超时：未能找到 label 元素。");
        }, 5000);
    });

})();