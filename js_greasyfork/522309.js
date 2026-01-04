// ==UserScript==
// @name         南师大NNU自动评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       YKONGCO
// @description  南师大NNU自动评教，进入页面就会自动填写，不会使用加我邮箱ykongco@qq.com，让我骂骂你
// @match        https://ehallapp.nnu.edu.cn/jwapp/sys/wspjyyapp/*default/index.do?*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522309/%E5%8D%97%E5%B8%88%E5%A4%A7NNU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/522309/%E5%8D%97%E5%B8%88%E5%A4%A7NNU%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始执行。');

    // 添加自定义 CSS 样式，隐藏特定元素
    GM_addStyle(`
     .sc-panel-fjxx {
            display: none!important;
        }
    `);

    function clickBetterButtons() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
            if (button.dataset.xDafxsm === '较好' || button.dataset.xDafxsm === '有必要') {
                button.click();
                console.log('找到并点击了“较好”按钮。');
            }
        });

        radioButtons.forEach(button => {
            const label = button.parentElement.textContent.trim();
            if (label === '满意 (80分 - 100)分' || label === '较喜欢教师 (80分 - 100)分') {
                button.click();
            }
        });


       const textareas = document.querySelectorAll('div[xtype="textarea"] textarea');
       textareas.forEach(textarea => {
            textarea.value = '无';
       });

    }

    setInterval(clickBetterButtons, 5000); // 每 5 秒检查并点击一次

    console.log('脚本执行完成。');
})();