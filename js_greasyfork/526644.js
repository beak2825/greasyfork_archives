// ==UserScript==
// @name         grafana-html-decode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  grafana html decode
// @author       chong
// @include      *://*.otr-devops.cn.svc.corpintra.net/*
// @include      *://*.mercedes-benz.*/grafana/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526644/grafana-html-decode.user.js
// @updateURL https://update.greasyfork.org/scripts/526644/grafana-html-decode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // HTML解码函数
    function decodeHTML(html) {
        var txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    // 解码指定元素的内容
    function decodeHTMLForElements(elements) {
        elements.forEach(element => {
            element.innerHTML = decodeHTML(element.innerHTML);
        });
    }

    // 主解码逻辑
    function decodeAll() {

        // 解码所有具有特定类名的元素
        const messageElements = document.querySelectorAll('.css-uev0p3-logs-row__message');
        decodeHTMLForElements(messageElements);

        // 解码所有表格单元格内容
        const tableCells = document.querySelectorAll('.css-1lm1wit-wordBreakAll-wrapLine');
        decodeHTMLForElements(tableCells);

        console.log('解码完成！');
    }

    // 动态添加解码按钮
    function addDecodeButton() {
    // 选择所有符合条件的 <button> 元素
        const targetButton = document.querySelector('.button-group.css-8qah51.refresh-picker');

        // 检查是否已经添加过按钮
        if (!targetButton.nextElementSibling || !targetButton.nextElementSibling.classList.contains('custom-decode-button')) {
            // 创建新的按钮
            const decodeButton = document.createElement('button');

            decodeButton.className = 'custom-decode-button css-rf9bj2-toolbar-button ';
            decodeButton.innerText = 'Decode';
            decodeButton.title = 'Decode HTML entities';
            decodeButton.onclick = decodeAll;

            // 设置按钮的其他样式
            decodeButton.style.marginLeft = '3px';
            decodeButton.style.textAlign = 'center';
            decodeButton.style.width = '96px';



            // 将按钮插入到目标按钮的右边
            targetButton.parentElement.appendChild(decodeButton);

        }

    }

    // 延迟1000毫秒后执行addDecodeButton函数
    setTimeout(addDecodeButton, 1000);

   const handler = setInterval(()=>{
      addDecodeButton();
    }, 5000);

})();