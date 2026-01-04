// ==UserScript==
// @name         freevps-autofill
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动选择和填充表单字段
// @author       Your Name
// @license      MIT
// @match        https://free.vps.vc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478367/freevps-autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/478367/freevps-autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '35%';
    div.style.left = '10%';  // 设置为屏幕左侧的中间位置
    document.body.appendChild(div);

    function updateTime() {
        var now = new Date();
        div.textContent = now.toLocaleTimeString();
    }

    setInterval(updateTime, 1000);

    // 自动选择数据中心
    //document.getElementById("datacenter").selectedIndex = 1;
    var selectElement = document.getElementById('datacenter');
    var options = selectElement.options;
    var usOption = null;

    // 遍历选项，查找US选项
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.text.toLowerCase().includes('us3')) {
            usOption = option;
            break;
        }
    }

    if (!usOption) {
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.text.toLowerCase().includes('us1')) {
                usOption = option;
                break;
            }
        }
    }

    // 如果找到US选项，则选择它，否则选择第一个选项
    if (usOption) {
        usOption.selected = true;
    } else  {
        document.getElementById("datacenter").selectedIndex = 1; // 选择索引为1的选项
    }

    // 自动选择第一个选项
    document.getElementById("os").selectedIndex = 2; // 选择索引为1的选项
    document.getElementById("purpose").selectedIndex = 1; // 选择索引为1的选项

    // 自动填充密码字段
    document.getElementById("password").value = "123456";

    // 自动勾选checkbox
    var checkboxes = document.getElementsByName("agreement[]");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }




})();