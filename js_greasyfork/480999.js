// ==UserScript==
// @name         将sku显示在左侧位置 lazada
// @version      2.0
// @namespace    your-namespace-lazada
// @description  将获取到的元素显示在网页左侧位置
// @match        https://www.bigseller.pro/web/listing/lazada/edit/*
// @match        https://www.bigseller.com/web/listing/lazada/edit/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480999/%E5%B0%86sku%E6%98%BE%E7%A4%BA%E5%9C%A8%E5%B7%A6%E4%BE%A7%E4%BD%8D%E7%BD%AE%20lazada.user.js
// @updateURL https://update.greasyfork.org/scripts/480999/%E5%B0%86sku%E6%98%BE%E7%A4%BA%E5%9C%A8%E5%B7%A6%E4%BE%A7%E4%BD%8D%E7%BD%AE%20lazada.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkElement() {
        var element = document.evaluate(
            '//*[@id="app"]/div[1]/div[1]/div[2]/div[7]/div[2]/form/div[3]/div[2]/div[2]/table/tbody/tr[1]/td[2]/input',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        var element2 = document.evaluate(
            '//*[@id="app"]/div[1]/div[1]/div[2]/div[7]/div[2]/form/div[3]/div[2]/div[2]/table/tbody/tr[1]/td[3]/input',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            clearInterval(intervalId);
            var customElement = document.createElement('p');
            customElement.id = 'customElement';
            customElement.textContent = element.value;
            customElement.style.position = "fixed";
            customElement.style.left = "13%";
            customElement.style.top = "50%";
            customElement.style.transform = "translateY(-50%)";
            customElement.style.color = "red";
            customElement.style.width = "5%";
            customElement.style.background = 'white';

            var content = element.value;
            console.log(content);
            console.log(1);

            document.body.appendChild(customElement);
        } else {
            console.log("Element not found.");
        }
        if (element2 && !element) {
            clearInterval(intervalId);
            var customElement2 = document.createElement('p');
            customElement2.id = 'customElement2';
            customElement2.textContent = element2.value;
            customElement2.style.position = "fixed";
            customElement2.style.left = "13%";
            customElement2.style.top = "55%";
            customElement2.style.transform = "translateY(-50%)";
            customElement2.style.color = "red";
            customElement2.style.width = "5%";
            customElement2.style.background = 'white';

            document.body.appendChild(customElement2);
            console.log(2);
        }
    }

    // 设置一个循环，每隔一段时间执行一次检查
    var intervalId = setInterval(checkElement, 500); // 间隔为1秒（1000毫秒）
})();