// ==UserScript==
// @name         自动抢单
// @namespace    https://kuajing.pinduoduo.com/main/order-manage
// @version      0.1
// @description  hello
// @license MIT
// @author       You
// @match        https://kuajing.pinduoduo.com/main/order-manage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485708/%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/485708/%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //window.onload = async () => {
        var inputbtn = document.createElement('input');
        inputbtn.id="btn";
        inputbtn.type="button";
        inputbtn.value="开启抢单";
        inputbtn.style.position="absolute";
        inputbtn.style.top="0";
        inputbtn.style.zIndex=1000000;
        inputbtn.style.padding="10px";
        inputbtn.style.border="1px solid black";
        document.body.appendChild(inputbtn);

        var timeId = null;
        inputbtn.onclick = () => {
            if (timeId) {
                clearInterval(timeId);
                timeId = null;
                inputbtn.value="开启抢单";
            } else {
                start11();
                timeId = setInterval(() => start11(), 10000);
                inputbtn.value="停止抢单";
            }
        }
    //}

})();

async function start11() {
    clickElement('.CBX_square_5-72-0.CBX_groupDisabled_5-72-0.CBX_hasCheckSquare_5-72-0');
    await delay(2000);
    clickElement('button[data-tracking-id="8o3X0Dsmc2YlETJE"]');
    await delay(2000);
    clickElement('button[data-tracking-id="MQTlOBUftb9W4uux"]');
    await delay(3000);
    clickElement('button[data-tracking-id="8uQ-E7D74DAeEsa2');
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