// ==UserScript==
// @name         FastAttentanceUploader
// @namespace    http://tampermonkey.net/
// @version      2024-02-28
// @description  FastAttentanceUploader 1.0
// @author       青年桥东
// @match        https://hospital.cmept.com/html/attend/add.html
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/488554/FastAttentanceUploader.user.js
// @updateURL https://update.greasyfork.org/scripts/488554/FastAttentanceUploader.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 新增人员按钮（原有）
    var buttonAdd = document.querySelector('#tb > h3:nth-child(4) > a');
    // 添加批量新增按钮
    var buttonFast = document.createElement('FastUploader');
    buttonFast.innerHTML = "批量新增";
    buttonFast.id = "FastUploader";
    buttonAdd.parentNode.appendChild(buttonFast);
    buttonFast.className = buttonAdd.className;
    buttonFast.style.marginLeft = "10px";
    // 设置批量新增按钮的点击事件
    buttonFast.onclick = async function() {
        // 从localStorage中获取namelist
        var namelist = JSON.parse(localStorage.getItem('namelist'));
        if (namelist == null) {
            namelist = [];
        }
        var namestr = namelist.join(','); // 将namelist转换为字符串
        // 弹出输入框，输入人员名单
        var namelist = prompt("请输入人员名单，以英文（半角）逗号分隔", namestr);
        if (namelist == null || namelist == "") {
            return;
        }
        namelist = namelist.split(',');
        // 将namelist存入localStorage
        localStorage.setItem('namelist', JSON.stringify(namelist));
        // 逐个添加人员
        for (let i = 0; i < namelist.length; i++) {
            let user = namelist[i];
            buttonAdd.click();
            await delay(500); // 再次等待0.5秒钟
            var input = document.querySelector('#username');
            input.value = user;
            input.dispatchEvent(new Event('input'));
            await delay(500); // 再次等待0.5秒钟
            document.querySelector('#userMsgDiv > div').click();
            document.querySelector('#full > div.weui-popup__modal > div.modal-content > div > div:nth-child(3) > div.weui-cell__bd > div:nth-child(1) > label').click();
            document.querySelector('#full > div.weui-popup__modal > div.modal-content > div > a').click();
        }
    };

    // 返回一个Promise，延时指定的毫秒数后解决
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();