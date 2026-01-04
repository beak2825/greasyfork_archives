// ==UserScript==
// @name         兰大校园网自动登录elearning
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  一款真正人性化的智能登录脚本（不是）
// @author       JasonLee
// @match        http://10.10.0.166/*
// @match
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478595/%E5%85%B0%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95elearning.user.js
// @updateURL https://update.greasyfork.org/scripts/478595/%E5%85%B0%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95elearning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(document.querySelector("#logout")!=null){
        return ;
    }
    var user="【填写用户名】";
//请在此处引号内填写用户名
    var pwd="【填写密码】";
//请在此处引号内填写密码
    document.querySelector("div[data='account']").click();

    document.querySelector("#username").value=user;
    document.querySelector("#password").value=pwd;

//    document.querySelector("#domain").value="@study";
//    document.querySelector(".select-selected").value="@study";
    //以下这一大段是ai写的。快说谢谢ChatGPT！

    // 1. 选择所有 options
    const options = document.querySelectorAll(".select-items div");

    // 2. 选择目标值
    const targetValue = "@study";
    let targetOption = null;

    options.forEach(option => {
        // 移除所有选项的 selected-option class
        option.classList.remove("selected-option");

        // 如果是目标值，赋值 targetOption
        if (option.getAttribute("data-value") === targetValue) {
            targetOption = option;
        }
    });

    // 3. 给目标选项添加 selected-option class
    if (targetOption) {
        targetOption.classList.add("selected-option");

        // 4. 更新显示
        const selectedDiv = document.querySelector(".select-selected");
        if (selectedDiv) {
            selectedDiv.innerText = targetOption.innerText;
        }
    }

    // 5. 同步修改隐藏 select 的 value（若需要）
    const realSelect = document.getElementById("domain realSelect");
    if (realSelect) {
        realSelect.value = targetValue;
        realSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }



    document.querySelector("#login-account").click();



})();