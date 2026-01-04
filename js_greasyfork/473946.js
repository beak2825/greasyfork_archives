/*
 * @Author: xx
 * @Date: 2023-08-25 14:41:40
 * @LastEditTime: 2023-08-30 14:48:18
 * @Description:
 */

// ==UserScript==
// @name       TemuTools
// @namespace  npm/vite-plugin-monkey
// @version    0.0.12
// @author     monkey
// @description Temu auto rob tools
// @license    MIT
// @icon       https://cdn3.iconfinder.com/data/icons/picons-social/57/46-facebook-512.png
// @match      https://kuajing.pinduoduo.com/main/order-manage
// @grant      GM.addElement
// @grant      GM.addStyle
// @grant      GM.deleteValue
// @grant      GM.getResourceUrl
// @grant      GM.getValue
// @grant      GM.info
// @grant      GM.listValues
// @grant      GM.notification
// @grant      GM.openInTab
// @grant      GM.registerMenuCommand
// @grant      GM.setClipboard
// @grant      GM.setValue
// @grant      GM.xmlHttpRequest
// @grant      GM_addElement
// @grant      GM_addStyle
// @grant      GM_addValueChangeListener
// @grant      GM_cookie
// @grant      GM_deleteValue
// @grant      GM_download
// @grant      GM_getResourceText
// @grant      GM_getResourceURL
// @grant      GM_getTab
// @grant      GM_getTabs
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_listValues
// @grant      GM_log
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_removeValueChangeListener
// @grant      GM_saveTab
// @grant      GM_setClipboard
// @grant      GM_setValue
// @grant      GM_unregisterMenuCommand
// @grant      GM_webRequest
// @grant      GM_xmlhttpRequest
// @run-at     document-start
// @grant      unsafeWindow
// @grant      window.close
// @grant      window.focus
// @grant      window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/473946/TemuTools.user.js
// @updateURL https://update.greasyfork.org/scripts/473946/TemuTools.meta.js
// ==/UserScript==

console.log("油猴脚本----");

let time_waitfor_ok = 1000;
let time_waitfor_next = 1000;

let clickIntervals = {}; // 使用对象来存储不同按钮的间隔器
let totalClickTimes = 0;
let adClickIndex = 0;
let adsElements = [];
let links = {};

window.onload = function () {
    console.log("页面加载完------- DOMContentLoaded");

    setTimeout(function () {
        console.log("增加按钮 ---- ");
        addButton();
    }, 8000);
};

function addButton() {
    const addToShippingLinks = document.querySelectorAll('a[data-testid="beast-core-button-link"] span');
    addToShippingLinks.forEach(link => {
        if (link.textContent === '加入发货台') {
            const parentDiv = link.closest('.order-manage_actions___xYyp');
          
            const autoAddButton = document.createElement('a');
            autoAddButton.className = 'BTN_outerWrapper_5-72-0 BTN_textPrimary_5-72-0 BTN_small_5-72-0 BTN_outerWrapperLink_5-72-0';
            autoAddButton.setAttribute('data-tracking-id', 'custom-autoAddToShipping');
            autoAddButton.innerHTML = '<span>自动加入发货台</span>';

            autoAddButton.addEventListener('click', () => {
                let intervalID = Math.random() * 1200;
                console.log("点击开始 -- " + intervalID);
                links[intervalID] = link;
                start(intervalID);
            });

            parentDiv.appendChild(autoAddButton);
        }
    });
}

// 点击确定
function clickOK(intervalID) {
    // 实现点击确定的逻辑
    console.log("点击确定-----  = " + intervalID);
    // 查找所有的按钮
    const buttons = document.querySelectorAll('button[data-testid="beast-core-button"]');

    // 遍历按钮，找到包含 "确认" 文本的按钮
    buttons.forEach(button => {
        const buttonText = button.querySelector('span').textContent;
        if (buttonText === '确认') {
            console.log('找到确认按钮:', button);
            button.click();
            //下一次点击
            let id = intervalID;
            start(id);
        }
    });
}

// 点击加入发货台
function clickRob(intervalID) {

    // 判断是否已经不可点击 disable了
     // 判断是否已经不可点击，如果有 disabled 属性，则直接返回
     if (links[intervalID].closest('a').hasAttribute('disabled')) {
        console.log('按钮已被禁用，无法继续点击。');
        start(intervalID);
        return;
    }
    console.log("clickRob intervalID == " + intervalID);
    links[intervalID].closest('a').click();

    setTimeout(() => {
        let id = intervalID;
        clickOK(id);
    }, time_waitfor_ok);
}

function start(intervalID) {
    clearInterval(clickIntervals[intervalID]); // 清除之前的间隔器，以防止多次点击叠加

    // clickRob(link);

    time_waitfor_ok = Math.random() * 700 + 500;
    time_waitfor_next = Math.random() * 700 + 1000;

    console.log("intervalID " + intervalID + "随机的okTime = " + time_waitfor_ok + " nextTime = " + time_waitfor_next);
    let time = time_waitfor_ok + time_waitfor_next;

    clickIntervals[intervalID] = setTimeout(() => {
        let id = intervalID;
        clickRob(id);
    }, time);
}
