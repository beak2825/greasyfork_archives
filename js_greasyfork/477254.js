// ==UserScript==
// @name         华为商城抢购助手
// @namespace    https://github.com/gorkys/TampermonkeyHub
// @version      2.0.0
// @description  华为商城抢购大杀器
// @author       Gorkys
// @license      MIT
 
// @match        https://www.vmall.com/product/*.html
// @match        https://www.vmall.com/product/*.html?*
// @match        https://www.vmall.com/order/nowConfirmcart
// @match        https://sale.vmall.com/rush/*
// @supportURL   https://github.com/gorkys/TampermonkeyHub/issues
// @downloadURL https://update.greasyfork.org/scripts/477254/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477254/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8A%A2%E8%B4%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    var floatingDiv = document.createElement('div');
    var startStopButton = document.createElement('button');
    var timerLabel = document.createElement('h1');
    var intervalId = null;

    // 设置浮动块的样式
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.top = '20%';
    floatingDiv.style.left = '70%';
    floatingDiv.style.backgroundColor = '#f2f2f2';
    floatingDiv.style.padding = '10px';
    floatingDiv.style.border = '1px solid #ccc';
    floatingDiv.style.transform = 'translateY(-50%)'; // 使元素垂直居中

    // 设置按钮的初始文本
    startStopButton.innerHTML = '开始';

    // 函数a的实现
    function a() {
        console.log('hello');
    }

    async function clickElementWithInterval(xpathSelector, interval) {
        // var element = document.evaluate(xpathSelector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // var element = document.evaluate('//*[@id="pro-operation"]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // var elements = document.evaluate('//*[@id="pro-operation"]/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        // var element = elements.snapshotItem(elements.snapshotLength - 1);

        let element = null;

        while (!element) {
          element = document.evaluate(xpathSelector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      
          if (element) {
            console.log("抓取到了指定的元素 " + new Date().toISOString());
          } else {
            console.log("还未开始抢购");
            await new Promise(resolve => setTimeout(resolve, 1)); // 等待1秒
          }
        }
      
        // intervalId = setInterval(function() {
            element.click();
            // setTimeout(() => {element.click();},  100)
        // }, interval);

        ifInterval = setInterval(function() {
            let ifmx = document.evaluate('//*[@id="iframeBox"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (ifmx) {
              clearInterval(ifInterval);
              console.log("找到了iframe " + new Date().toISOString());
            } else {
              console.log("还未找到iframe" + new Date().toISOString());
            }
          }, 100);

      }

    // 更新时间的函数
    function updateTime() {
        var date = new Date();
        timerLabel.innerHTML = date.toLocaleTimeString();
    }

    // 每秒更新一次时间
    updateTime();
    setInterval(updateTime, 1);

    startStopButton.onclick = function () {
        if (intervalId === null) {
            // 开始调用函数a
            // intervalId = setInterval(a, 500);
            clickElementWithInterval('//*[@id="pro-operation"]/span', 100);
            startStopButton.innerHTML = '停止';
        } else {
            // 停止调用函数a
            clearInterval(intervalId);
            intervalId = null;
            startStopButton.innerHTML = '开始';
        }
    }

    floatingDiv.appendChild(timerLabel);
    floatingDiv.appendChild(startStopButton);
    document.body.appendChild(floatingDiv);
})()