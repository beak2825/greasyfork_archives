// ==UserScript==
// @name         自动抢单
// @namespace    https://kuajing.pinduoduo.com/main/order-manage
// @version      0.3
// @description  抢单
// @license MIT
// @author       You
// @match        https://kuajing.pinduoduo.com/main/order-manage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485945/%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/485945/%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleElement = document.createElement('style');

    // 设置 style 元素的内容
    styleElement.textContent = `
  #myDiv {
    background-color: pink;
    padding: 10px;
    z-index: 5;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
  }
`;

    // 将 style 元素添加到文档的 head 中
    document.head.appendChild(styleElement);


    const myDiv = document.createElement('div');
    myDiv.id = 'myDiv';

    const inputTime = document.createElement('input');
    inputTime.placeholder='秒';
    inputTime.value='0.5';
    myDiv.appendChild(inputTime);

    var inputbtn = document.createElement('input');
    inputbtn.id="btn";
    inputbtn.type="button";
    inputbtn.value="开启抢单";
    myDiv.appendChild(inputbtn);
    document.body.appendChild(myDiv);

    var timeId = null;
    inputbtn.onclick = () => {
        if (timeId) {
            clearInterval(timeId);
            timeId = null;
            inputbtn.value="开启抢单";
        } else {
            start11();
            timeId = setInterval(() => {
                console.log('haha');
                if (clickElement('button[data-tracking-id="P9U-HBAwQwA8DSPl')) return;
                if (clickElement('button[data-tracking-id="MQTlOBUftb9W4uux"]')) return;
                if (clickElement('button[data-tracking-id="8o3X0Dsmc2YlETJE"]')) return;
                if (clickElement('.CBX_squareInputWrapper_5-80-0')) return;
            }, parseFloat(inputTime.value) * 1000);
            inputbtn.value="停止抢单";
        }
    }

})();

async function start11() {
    // CBX_square_5-80-0 CBX_groupDisabled_5-80-0 CBX_hasCheckSquare_5-80-0 CBX_mount_5-80-0
    // clickElement('.CBX_square_5-72-0.CBX_groupDisabled_5-72-0.CBX_hasCheckSquare_5-72-0');
    clickElement('.CBX_squareInputWrapper_5-80-0');
    await delay(2000);
    clickElement('button[data-tracking-id="8o3X0Dsmc2YlETJE"]');
    await delay(2000);
    clickElement('button[data-tracking-id="MQTlOBUftb9W4uux"]');
    await delay(3000);
    clickElement('button[data-tracking-id="P9U-HBAwQwA8DSPl');
    await delay(2000);
}

function clickElement(selector) {
    const ele = document.querySelector(selector);
    if (ele) {
        ele.click();
        return true;
    } else {
        return false;
    }
}

async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), ms);
    })
}