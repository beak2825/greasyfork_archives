// ==UserScript==
// @name         RangerDescZhCn
// @namespace    http://huaqin.com/
// @version      0.1
// @description  让Ranger支持中文描述显示和保存，match 为相关Ranger地址
// @author       Austin.Young
// @match        http://10.1.4.57:6080/*
// @match        http://10.1.4.55:6080/*
// @match        http://10.1.4.52:6080/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445407/RangerDescZhCn.user.js
// @updateURL https://update.greasyfork.org/scripts/445407/RangerDescZhCn.meta.js
// ==/UserScript==
let detectCount = 0;
let detectHandle = null;
let objDesc = null;
(function () {
    'use strict';
    // 将 Ranger的描述字段允许输入中文，并显示中文
    console.log('my script!!')
    // 页面动态生成，检测 description 输入框
    detectDesc();
    // hash 改变需要重新探测
    window.onhashchange = function () { detectDesc(); }
})();
function clearDetect() {
    detectCount = 0;
    clearInterval(detectHandle);
    detectHandle = null;
}
function detectDesc() {
    clearDetect();
    detectHandle = setInterval(function () {
        detectCount++;
        // 取第一个
        let obj = document.querySelector('textarea[name=description]')
        //找 desc 对象
        if (detectCount > 100 || obj != null) {
            clearDetect();
            console.warn('description is found!!')
            objDesc = obj;
            showDesc(true);
            injectSave();
        } else {
            return;
        }
    }, 100)
}
function showDesc(flag) {
    if (flag) {// 显示
        objDesc.value = unescape(objDesc.value);
    } else {// 编码
        objDesc.value = escape(objDesc.value);
    }
}
function injectSave() {
    let obj = document.querySelector('button[data-id=save]');
    if (obj == null) {
        alert('无法找到保存按钮,保存时无法使用中文描述');
        return;
    }
    obj.addEventListener("click", function () { showDesc(false) }, true); // 第三个参数设置为true先运行
}