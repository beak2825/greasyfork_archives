// ==UserScript==
// @name         山东大学威海自动评教
// @namespace    http://tampermonkey.net/
// @version      2026.01.20
// @description  sduwh自动化评教脚本
// @author       wzl19371
// @match        https://bkzhjx.wh.sdu.edu.cn/jsxsd/xspj/xspj_edit.do?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sdu.edu.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521829/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%A8%81%E6%B5%B7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/521829/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%A8%81%E6%B5%B7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 筛选并点击所有 ID 以 "pj" 开头并以 "_1" 结尾的 radio 按钮
    var radioButtons = document.querySelectorAll('input[type="radio"][id^="pj"][id$="_1"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.click();
    });

    const one2 = document.querySelector('input[type="radio"][id^="pj"][id$="_2"]');
    if (one2) one2.click();

    // 2. 选中并点击 name 为 "kctzdnd" 且 value 为 "3" 的单选按钮
    var kctzdndRadioButton = document.querySelector('input[type="radio"][name="kctzdnd"][value="3"]');
    if (kctzdndRadioButton) {
        kctzdndRadioButton.checked = true; // 设置为选中状态
    }

    // 3. 选中并点击 name 为 "yxjspx" 且 value 为 "1" 的单选按钮
    var yxjspxRadioButton = document.querySelector('input[type="radio"][name="yxjspx"][value="1"]');
    if (yxjspxRadioButton) {
        yxjspxRadioButton.checked = true; // 设置为选中状态
    }

    // 4. 向所有 ID 以 "jynr_" 开头的 textarea 填充文本
    var textareas = document.querySelectorAll('textarea[id^="jynr_"]');
    textareas.forEach(function(textarea) {
        textarea.value = "老师人很nice，课程讲授循序渐进，学到了很多东西！"; // 填充指定文本
    });

    // 5. 点击提交按钮 tj
    var submitButton = document.getElementById('tj');
    if (submitButton) {
        submitButton.click(); // 模拟点击提交按钮
    }
})();