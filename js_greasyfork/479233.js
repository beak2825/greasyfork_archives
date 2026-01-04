// ==UserScript==
// @name         小思专属偷懒神器
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  工作再累也要开心啊
// @author       Mr.Zhang
// @match        https://www.autoengine.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479233/%E5%B0%8F%E6%80%9D%E4%B8%93%E5%B1%9E%E5%81%B7%E6%87%92%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479233/%E5%B0%8F%E6%80%9D%E4%B8%93%E5%B1%9E%E5%81%B7%E6%87%92%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==
let timeOut = null;
let timeOut1 = null;
let timeOut2 = null;
let timeOut3 = null;
function clearAuto(){
    clearTimeout(timeOut);
    clearTimeout(timeOut1);
    clearTimeout(timeOut2);
    clearInterval(timeOut3);
    alert('已停止自动程序')
}
function selectOption(){
    const select = $('.arco-modal .arco-select')
    select.click();
    timeOut2 = setTimeout(() => {
        const optionsItem = $('.arco-select-popup-inner .arco-select-option').eq(0);
        optionsItem.click();
        submitForm();
    }, 500);
}

function submitForm() {
    const btn = $('.arco-modal-footer .arco-btn-primary');
    btn.click();
    timeOut3 = setInterval(() => {
        const btn = $('.arco-modal-footer .arco-btn-primary');
        if(btn.length) {
            console.log('请求还未结束');
            return
        } else {
            clearInterval(timeOut3);
            console.log('提交表单成功');
           timeOut = setTimeout(() => {
              openDraw()
           }, 5000);
        }
    }, 1000);
}

function openDraw() {
    const btns = $('.arco-table-content-inner tbody .arco-table-tr').eq(0).children().last().find('.arco-space-wrap').children().find('.arco-link');
    var regex = /释放到公海/;
    let btn = null;
    for (var i = 0; i < btns.length; i++) {
        var element = btns[i];
        if (regex.test(element.innerHTML)) {
            btn = element;
        }
    }
    if (!btn) {
        clearAuto()
        return
    }
    btn.click();
    timeOut1 = setTimeout(() => {
      selectOption();
    }, 1000);
}

function addBtn() {
    window.addEventListener('load', function() {
        // 添加按钮
        var btn = document.createElement('button');
        btn.innerHTML = '自动开启';
        btn.style = 'position: absolute;top: 80px;left: 40%;cursor: pointer;';
        document.body.appendChild(btn);
        btn.addEventListener('click', () => {
            console.log('自动开启')
            openDraw()
        });
        var btn1 = document.createElement('button');
        btn1.innerHTML = '自动关闭';
        btn1.style = 'position: absolute;top: 80px;left: 60%;cursor: pointer;';
        document.body.appendChild(btn1);
        btn1.addEventListener('click', () => {
            console.log('自动关闭')
            clearAuto()
        });
    }, false);
}
(function() {
    'use strict';
    addBtn();
})();