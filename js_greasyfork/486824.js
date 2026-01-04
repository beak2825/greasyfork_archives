// ==UserScript==
// @name         数量录入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  啊啊啊啊
// @author       You
// @match        http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/busi154/busi154_main.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cs.cmos
// @license MIT
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/486824/%E6%95%B0%E9%87%8F%E5%BD%95%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/486824/%E6%95%B0%E9%87%8F%E5%BD%95%E5%85%A5.meta.js
// ==/UserScript==
//http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/busi298/busi298_main.html
(function() {
    'use strict';

    function go(){

         // 获取当前页面的 URL
        const currentUrl = window.location.href;
        console.log(currentUrl);
       
        if (currentUrl.includes('http://ngbusi-ah.cs.cmos/ngbusi_ah/src/modules/busi/')) {
    // 目标元素的选择器，根据实际情况修改
    const targetSelector = "body > div.ued-main > div:nth-child(6) > div.mgt-5.tc";
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
   // 创建数字输入框
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.value = 1; // 默认值为1
                numberInput.id = 'multiSubmitNumber';
                numberInput.style.marginRight = '10px';
                numberInput.style.backgroundColor = 'red'; // 设置背景色为红色
                numberInput.style.color = 'white'; // 设置文字颜色为白色
                numberInput.style.textAlign = 'center'; // 文字居中
                numberInput.max = 3; // 设置最大值为3
		numberInput.min = 1; // 设置最大值为3
        // 修改原始提交按钮的点击事件
        const submitButton = document.getElementById('subBotton');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止原始的点击事件
                const count = parseInt(document.getElementById('multiSubmitNumber').value, 10) || 1;
                for (let i = 1; i < count; i++) {
                    submitMarketOrder(); // 根据输入次数多次执行
                }
                // 执行完毕后重置输入框的值为1
                document.getElementById('multiSubmitNumber').value = 1;
            });

            // 将数字输入框添加到提交按钮前
            targetElement.insertBefore(numberInput, submitButton);
        }
    }

 

        }
    }
    setTimeout(go, 5000);

})();