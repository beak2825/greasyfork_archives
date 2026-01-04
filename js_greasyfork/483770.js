// ==UserScript==
// @name         BOSS直聘HR快捷筛选
// @namespace    https://github.com/pakeh2866
// @version      1.2
// @description  上下左右快捷筛选简历
// @author       pakeh
// @include      *://www.zhipin.com/*
// @match        www.zhipin.com/web/chat/index
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483770/BOSS%E7%9B%B4%E8%81%98HR%E5%BF%AB%E6%8D%B7%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/483770/BOSS%E7%9B%B4%E8%81%98HR%E5%BF%AB%E6%8D%B7%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';


    //创建right的函数
    function rightrun() {
        const listConversationOperate = document.getElementsByClassName('conversation-operate')
        if (!listConversationOperate.length) {
            return;
        }
        const btnListChangYongYu = listConversationOperate[0].getElementsByClassName('changyongyu');
        if (!btnListChangYongYu.length) {
            return;
        }
        const otherButton = btnListChangYongYu[0]

        setTimeout(() => {
            console.log(otherButton.textContent);
            otherButton.click()
        }, 50)
        //第二步点击
        setTimeout(() => {
            const phraseContent_find = document.getElementsByClassName('phrase-content')
            console.log('phraseContent_find:', phraseContent_find)
            console.log('phraseContent_find:', phraseContent_find.length)
            if (!phraseContent_find.length) {
                return;
            }
            const btn_send = phraseContent_find[0].getElementsByClassName('phrase-send');
            console.log('btn_send:', btn_send)
            const secondButton = btn_send[0]
            setTimeout(() => {
                console.log(secondButton.textContent);
                secondButton.click()
            }, 100)
        }, 150)
    };

    // left的触发事件
    function leftrun() {
        const listConversationOperate = document.getElementsByClassName('not-fit-wrap')
        console.log('第一阶段的值', listConversationOperate)
        if (!listConversationOperate.length) {
            return;
        }
        const btnListntf = listConversationOperate[0].getElementsByClassName('operate-btn');
        console.log('第二阶段的值', btnListntf)
        if (!btnListntf.length) {
            return;
        }
        const leftButton = btnListntf[0]
        console.log('不合适按钮的值', leftButton)

        // 创建一个新的MouseEnter事件对象
        const mouseenterEvent = new Event('mouseenter');

        // 获取要触发事件的元素
        const operateIconItem = listConversationOperate[0].getElementsByClassName('operate-icon-item')[0];

        // 分配事件到指定的元素上并触发该事件
        operateIconItem.dispatchEvent(mouseenterEvent);


        setTimeout(() => {
            setTimeout(() => {
                console.log('开始点击')
                leftButton.click();
            }, 100)
        }, 120)
    };

    //检测方向键按键，触发不同的函数。
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { // 以回车键为例
            console.log('按下ArrowRight')
            rightrun();
        } else if (e.key === 'ArrowLeft') {
            console.log('按下ArrowLeft')
            leftrun();
        }
    });
})();
