// ==UserScript==
// @name         电子科技大学深圳高等研究院校园网自动重置
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写、勾选单选框、定时刷新，并提交表单
// @author       zjl
// @match        http://2.2.2.3/*
// @match        https://www.msn.cn/zh-cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502650/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%B7%B1%E5%9C%B3%E9%AB%98%E7%AD%89%E7%A0%94%E7%A9%B6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E9%87%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/502650/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%B7%B1%E5%9C%B3%E9%AB%98%E7%AD%89%E7%A0%94%E7%A9%B6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E9%87%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    // input1.value = "*****";
    // input2.value = "****";

    'use strict';
    if(window.location.href.match(/www.msn.cn\/zh-cn/) != null) window.location.href = 'http://2.2.2.3'

    // 定时刷新时间间隔，单位为毫秒（例如，60000表示每60秒 * 30 刷新一次）
    var refreshInterval = 60000 * 30;

    // 填写输入框并勾选单选框的函数
    function fillForm() {
        // 请根据实际情况调整选择器
        var input1 = document.querySelector('input[id="password_name"]');
        var input2 = document.querySelector('input[id="password_pwd"]');
        var radioButton = document.querySelector('input[type="checkbox"][id="password_disclaimer"]');

        if (input1) {
            input1.value = "your_acount";
        }

        if (input2) {
            input2.value = "your_pwd";
        }

        if (radioButton) {
            radioButton.checked = true;
        }
    }

    // 提交表单的函数
    function submitForm() {
        // 请根据实际情况调整选择器
        var button = document.getElementById('password_submitBtn');
        button.click();
    }
2
     // 使用Axios发送数据的函数
    async function getIfDisconnected() {
        console.log("心跳检测");
        return axios.post('http://2.2.2.3/homepage/info.php?opr=list')
        .then((res)=>{
            return res.data.success
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    // 每次页面加载时执行一次填写输入框、勾选单选框和提交表单的操作s
    function repeat() {
         getIfDisconnected().then((res)=>{
             if(!res){
                 if(window.location.href.match(/ac_portal/) == null) {
                     window.open('http://2.2.2.3')
                     window.close()
                 }
                 fillForm();
                 submitForm();
             }
         })
        return repeat
    }

    // 设置定时刷新
    setInterval(repeat(), refreshInterval);
})();

