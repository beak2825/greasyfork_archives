// ==UserScript==
// @name         17LIVE Layout Setting
// @namespace    https://github.com/RutsuLun
// @version      0.2
// @description  交換聊天室位置
// @author       Rutsu Lun
// @match        https://17.live/zh-Hant/live/*
// @icon         https://www.google.com/s2/favicons?domain=17.live
// @license      Only Share
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/484836/17LIVE%20Layout%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/484836/17LIVE%20Layout%20Setting.meta.js
// ==/UserScript==

(function () {
    GM.registerMenuCommand('呼叫', createBtnList);
    GM.registerMenuCommand('介面切換', loayoutSwitch);
    GM.registerMenuCommand('隱藏左側面板', hideHeader);
})();

const btnListSetting = [
    { id: 'loayoutSwitch', name: '介面切換', method: loayoutSwitch, },
    { id: 'hideHeader', name: '隱藏左側面板', method: hideHeader, },
]
const btnListCss = 'position: absolute;top: 0;left: 0;'

function loayoutSwitch() {
    const target = document.querySelector('.VideoPageLayout__Wrapper-sc-ctht72-0');
    const cssList = 'flex-direction: row-reverse;';
    target.style.cssText += target.style.cssText == '' ? cssList : ''
}

function hideHeader() {
    const header = document.querySelector('.Header__HeaderWrapper-sc-1xcem6e-1');
    header.style.cssText += 'display: none !important;'
}

function createBtnList() {
    const chat = document.querySelector('.Main__Body-sc-1xljje-1');
    const btnList = document.createElement('span');
    btnList.id = 'btnList';
    btnList.style = btnListCss;
    chat.append(btnList);
    btnListSetting.forEach(b => {
        let btn = document.createElement('button');
        btn.id = b.id;
        btn.innerText = b.name;
        btnList.append(btn);
        btn.addEventListener('click', b.method);
    });
}

const main = function () {
    console.log('載入完畢，開始建立按鈕');
    createBtnList();
}

window.onload = () => {
    main()
}