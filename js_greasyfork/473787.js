// ==UserScript==
// @name         中国制造营销邮箱下载复合版
// @namespace    http://your.namespace.com
// @license MIT
// @version      0.2
// @author       不到华水永寒窗
// @description  在特定网页上自动点击指定的 div 元素
// @match        https://customsdata.made-in-china.com/globalcustomsdata.do?xcase=buyerDetail&buyerId=*
// @match        https://customsdata.made-in-china.com/globalcustomsdata.do?xcase=buyerList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=made-in-china.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473787/%E4%B8%AD%E5%9B%BD%E5%88%B6%E9%80%A0%E8%90%A5%E9%94%80%E9%82%AE%E7%AE%B1%E4%B8%8B%E8%BD%BD%E5%A4%8D%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473787/%E4%B8%AD%E5%9B%BD%E5%88%B6%E9%80%A0%E8%90%A5%E9%94%80%E9%82%AE%E7%AE%B1%E4%B8%8B%E8%BD%BD%E5%A4%8D%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    var currentURL = window.location.href;

    if (currentURL.includes("globalcustomsdata.do?xcase=buyerDetail&buyerId=")) {

        // 在页面加载完成后执行
        window.addEventListener('load', function() {
            // 获取所有匹配的 div 元素
            var divElements = document.querySelectorAll('.collect-item.J-lock-item');
            // 检查是否存在匹配的 div 元素
            if (divElements.length > 0) {
                // 自动点击第一个匹配的 div 元素
                divElements[0].click();
            }
            // 获取所有具有指定类名的元素
            var targetDiv = document.querySelector(".J-search-mail");

            // 触发点击事件
            if (targetDiv) {
                targetDiv.click();
            }
        });
        setTimeout(find_email, 5000);




        // 生成一个随机的文件名
        function generateRandomFileName() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let fileName = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                fileName += characters.charAt(randomIndex);
            }
            return fileName + '.txt';
        }


        function find_email() {
            // 收集邮箱地址的 Set
            const collectedEmails = new Set();

            // 查找页面上的所有可能包含邮箱地址的元素
            const emailElements = document.querySelectorAll('a, p, span, div'); // 选择适当的元素

            // 正则表达式以匹配简单的邮箱地址，您可能需要改进它以适应更多情况
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

            // 遍历元素，从文本中提取邮箱地址并添加到 Set 中
            emailElements.forEach(element => {
                const text = element.innerText;
                const matches = text.match(emailRegex);
                if (matches) {
                    matches.forEach(email => {
                        collectedEmails.add(email);
                    });
                }
            });

            // 将 Set 转换为文本
            const emailsText = Array.from(collectedEmails).join('\n');

            // 创建数据 URL
            const blob = new Blob([emailsText], { type: 'text/plain' });
            const dataUrl = URL.createObjectURL(blob);

            // 生成随机文件名
            const randomFileName = generateRandomFileName();

            // 创建下载链接并自动点击
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = randomFileName;
            downloadLink.textContent = 'Download Unique Emails';
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 清理
            URL.revokeObjectURL(dataUrl);
            document.body.removeChild(downloadLink);
        }


    } else if (currentURL.includes("globalcustomsdata.do?xcase=buyerList")) {
        // 创建一个按钮元素
        var button = document.createElement("button");
        button.textContent = "一键打开"; // 按钮文本
        button.style.marginLeft = "10px"; // 可以添加样式

        // 添加按钮点击事件
        button.addEventListener("click", function() {
            // 获取所有匹配的 <a> 元素
            var linkElements = document.querySelectorAll('a.prod-name.J-unvisited-title');

            // 定义点击链接的函数
            function clickLinks(index) {
                if (index >= linkElements.length) {
                    return; // 已经点击完所有链接，停止执行
                }

                // 点击当前链接
                linkElements[index].click();

                // 等待1秒后点击下一个链接
                setTimeout(function() {
                    clickLinks(index + 1);
                }, 1000); // 1000毫秒 = 1秒
            }

            // 从第一个链接开始点击
            clickLinks(0);
        });

        // 查找具有特定class的div元素
        var navDiv = document.querySelector(".nav");

        // 将按钮添加到div中
        if (navDiv) {
            navDiv.appendChild(button);
        }

    }

})();