// ==UserScript==
// @name         网页元素截图
// @namespace    https://github.com/sylcool
// @version      0.1
// @description  根据输入的CSS Selector，对指定元素进行截图。
// @author       Super10
// @match        *://*/*
// @icon         https://pic.ziyuan.wang/2023/12/09/guest_a1ff1e86c0392.png
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481756/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481756/%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function getTimeString(){
        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        const mSecond = now.getMilliseconds().toString().padStart(2, '0')

        const dateTimeString = `${year}${month}${day}_${hour}${minute}${second}${mSecond}`;

        return dateTimeString

    }


    // 创建悬浮按钮元素
    const floatBtn = document.createElement('button');
    floatBtn.innerHTML = '元素截图';
    floatBtn.style.position = 'fixed';
    floatBtn.style.top = '360px';
    floatBtn.style.left = '0px';
    floatBtn.style.backgroundColor = '#4CAF50';
    floatBtn.style.color = 'white';
    floatBtn.style.fontSize = '16px';
    floatBtn.style.padding = '10px 20px';
    floatBtn.style.border = 'none';
    floatBtn.style.cursor = 'pointer';



    // 将按钮添加到页面中
    document.body.appendChild(floatBtn);

    floatBtn.addEventListener('click', async () => {
        // const selector_text = await navigator.clipboard.readText()
        const selector_text = prompt("请输入需要截图元素的CSS Selector","html");
        if (selector_text != null) {
            const elements = document.querySelectorAll(selector_text.trim())

            for (const el of elements){
                const el_canvas = await html2canvas(el)

                // 创建一个a标签
                const a = document.createElement('a');
                // 将canvas转换为图片
                a.href = el_canvas.toDataURL();
                // 设置下载的文件名
                a.download = '元素截图-' + getTimeString() + '.png';
                // 触发点击事件
                a.click();
            }
        }

    })

})();