// ==UserScript==
// @name         教学评价随机
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select 10 for all evaluation scores in a specific iframe and add a button to trigger it
// @author       Your Name
// @match        http://class.seig.edu.cn:7001/sise/index.jsp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515801/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E9%9A%8F%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515801/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7%E9%9A%8F%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.innerText = '自动选择';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.top = '600px';
    button.style.zIndex = '1000000';
    button.style.padding = '10px 20px';
    //button.style.backgroundColor = '#007bff';
    //button.style.color = '#fff';
    button.style.display = 'none';
   // button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
   // button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';

    document.body.appendChild(button);

    // 定义函数：设置所有评分为 10
    function setAllScoresTo10(iframeDocument) {
        const selects = iframeDocument.querySelectorAll('select[name="evaluateScore"]');
        selects.forEach(select => {
            select.value = Math.ceil(Math.random() * 4) + 6;
            if (typeof select.onchange === 'function') {
                select.onchange();
            }
        });
        // 在按钮上显示消息
        const originalText = button.innerText;
        button.innerText = '已选择';
        // 1秒后恢复按钮内容
        setTimeout(() => {
            button.innerText = originalText;
        }, 1000);
    }

    // 按钮点击事件
    button.addEventListener('click', () => {
        const iframe = document.querySelectorAll('iframe')[0];
        if (iframe && iframe.contentDocument) {
            setAllScoresTo10(iframe.contentDocument);
        } else {
            button.innerText = 'Iframe not found or inaccessible.';
            setTimeout(() => {
                button.innerText = 'Select All 10';
            }, 1000);
        }
    });

    // 检测特定元素内容是否为 '评估内容'
    function checkForSpecificContent() {
        const iframe = document.querySelectorAll('iframe')[0];
        console.log('iframe',iframe)
        if (iframe && iframe.contentDocument) {
            const specificElement = iframe.contentDocument.querySelector("#form1 > table:nth-child(8) > tbody > tr:nth-child(2) > td > table > thead > tr > th:nth-child(2)");
            console.log('specificElement',specificElement)
            if (specificElement && specificElement.textContent === '评估内容') {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        } else {
            button.style.display = 'none';
        }
    }

    // 监听新的 iframe 加载完成
    function observeIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.addEventListener('load', () => checkForSpecificContent(iframe));
        });
    }

    // 初始检查
    observeIframes();

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
        observeIframes();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();