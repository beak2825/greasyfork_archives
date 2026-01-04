// ==UserScript==
// @name         抖音直播自动原画以及网页全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音直播间开启自动原画以及网页全屏
// @author       You
// @match        https://live.douyin.com/*
// @icon         https://live.douyin.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481248/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8E%9F%E7%94%BB%E4%BB%A5%E5%8F%8A%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/481248/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E5%8E%9F%E7%94%BB%E4%BB%A5%E5%8F%8A%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    // 定义第一个函数
function waitForElement(node, interval = 10, maxAttempts = 1000) {
  let attempts = 0;
  let timerId;

  function checkElement() {
    node=document.querySelector(
            '[data-e2e="quality-selector"]'
        );
    if (attempts >= maxAttempts) {
      console.error("Reached maximum number of attempts. Element not found.");
      clearTimeout(timerId); // 清除计时器
      return;
    }

    if (node === undefined || node === null) {
      console.error('Element not found');
      attempts++;
      timerId = setTimeout(checkElement, interval); // 设置下一次检查
    } else {
      console.log('Element found');
      clearTimeout(timerId); // 清除计时器
      // 在这里可以执行您想要的操作，因为节点已经找到
    }
  }

  checkElement();
}
    function function1() {
        // 切换原画
        // 找到具有 data-e2e=quality-selector 属性的 div 元素
        const qualitySelectorDiv = document.querySelector(
            '[data-e2e="quality-selector"]'
        );
        waitForElement(qualitySelectorDiv);
        if (qualitySelectorDiv) {
            // 找到第一个孩子元素并模拟点击
            const firstChildElement = qualitySelectorDiv.firstElementChild;

            if (firstChildElement) {
                // 创建一个点击事件
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });

                // 触发点击事件
                firstChildElement.dispatchEvent(clickEvent);
            }
        }
    }

    // 定义第二个函数
    function function2() {
        // 网页全屏
        // 找到所有包含"网页全屏"文本的 div 元素
        const divElements = document.querySelectorAll("div");

        // 遍历所有 div 元素，查找匹配的文本的兄弟节点并点击
        divElements.forEach((divElement) => {
            if (divElement.innerText === "网页全屏") {
                // 找到兄弟节点
                const siblingElement = divElement.nextElementSibling;

                if (siblingElement) {
                    // 创建一个点击事件
                    const clickEvent = new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                    });

                    // 触发点击事件
                    siblingElement.dispatchEvent(clickEvent);
                }
            }
        });
    }

        function1();
        function2();
})();
