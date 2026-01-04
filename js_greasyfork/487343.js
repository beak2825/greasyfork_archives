// ==UserScript==
// @name         Hax自动抢鸡
// @namespace    NoNameGMM
// @version      1.2
// @description  Hax自动抢鸡脚本
// @license      GPL-3.0
// @author       NoNameGMM
// @match        https://hax.co.id/create-vps/
// @icon         https://www.nonamegmm.eu.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/487343/Hax%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B8%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/487343/Hax%E8%87%AA%E5%8A%A8%E6%8A%A2%E9%B8%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var selectElement = document.getElementById("os");
    var optionElement = selectElement.options[1];
    optionElement.selected = true;

    var purposeElement = document.getElementById("purpose");
    var purposeoptionElement = purposeElement.options[4];
    purposeoptionElement.selected = true;

    var checkbox = document.querySelectorAll('input[name="agreement[]"]');
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].checked = true;
    }

    var DataCenterElement = document.getElementById('datacenter');
    var DataCenterLength = DataCenterElement.options.length;
    if (DataCenterLength === 1) 
    {
        DataCenterElement.options[0].text = "暂时还没有机器呢";
    } 
    else if (DataCenterLength > 1) 
    {
        var DataCenterElementChosen = DataCenterElement.options[1];
        DataCenterElementChosen.selected = true;
    }
    var passwordInput = document.querySelector('#password');
    passwordInput.value = 'your_password'; //输入你的密码 记得保存!!!
})();