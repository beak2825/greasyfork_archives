// ==UserScript==
// @name         微信读书加宽度
// @namespace    mailto:olv@foxmail.com
// @version      0.1
// @description  微信读书宽度调整，可加大，减少，方便的调整到想要的宽度
// @author       olv
// @match        https://weread.qq.com/web/reader/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418878/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/418878/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 基础方法
    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue;
    }
    function changeWidth(increse) {
        const step = 100;
        const item = document.querySelector(".readerContent .app_content");
        const currentValue = getCurrentMaxWidth(item);
        let changedValue;
        if (increse) {
            changedValue = currentValue + step;
        } else {
            changedValue = currentValue - step;
        }
        item.style['max-width'] = changedValue + 'px';
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent)
    }
    // 添加内容
    const menus = `
       <div style="position:fixed; top:0; right:0; z-index:100">
           <button id='lv-button1'>增加宽度</button>
           <button id='lv-button2'>减小宽度</button>
       </div>
    `
    const mybody = document.getElementsByTagName('body')
    mybody[0].insertAdjacentHTML('afterbegin', menus)
    // 添加样式
    GM_addStyle(`
        #lv-button1, #lv-button2 {
            border: 1px solid;
        }
    `)
    // 添加监听
    document.getElementById('lv-button1').addEventListener('click', () => changeWidth(true));
    document.getElementById('lv-button2').addEventListener('click', () => changeWidth(false));
})();