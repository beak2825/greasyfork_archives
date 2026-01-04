// ==UserScript==
// @name         【蛮吉】驿站助手
// @namespace    manji
// @version      0.1.1
// @license      manji
// @description  店铺宝辅助时间修改
// @author       You
// @match        https://yzzsweb.kdy100.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/439051/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E9%A9%BF%E7%AB%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439051/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E9%A9%BF%E7%AB%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    // 定义登录参数
    var phoneNumber = '1XXX';
    var childName = 'huo';
    var password = 'huochen1688';

    // 修改网页标题
    document.title = '韵达快递';

    //-------------------------------------------------------------
    // 账号登录
    function inputRequest(inputValue){
        // 声明变量
        var focus = new Event('focus');
        var input= new Event('input');
        var change = new Event('change');
        var blur= new Event('blur');

        // 如果能找到元素，则给元素赋值
        if(this){
            this.value = inputValue;
            console.log(inputValue,' 对应的输入完成');
            // 执行函数
            this.dispatchEvent(focus);
            this.dispatchEvent(input);
            this.dispatchEvent(change);
            this.dispatchEvent(blur);
        }else{
            console.log(inputValue,' 对应的输入标签未找到');
        };
    };


    // 请输入注册手机号
    inputRequest.call(document.querySelector('[maxlength="11"]'),phoneNumber);
    // 子账号（选填）
    inputRequest.call(document.querySelector('[maxlength="4"]'),childName);
    // 请输入密码
    inputRequest.call(document.querySelector('[maxlength="16"]'),password);
    // 点击登录
    var buttonLogin = document.querySelector("div:nth-child(4) > div > button");
    if(buttonLogin){buttonLogin.click();console.log('点击登录');}else{console.log('登录按钮未找到');};
    //---------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------
    // 修改logo名称   用setInterval 监测元素出现后修改，修改完成后取消监测
    var num = 0;
    function loopIput(){
        var logoElement = document.querySelector("div.navbar-wrapper > div > a > span");
        num++;
        if(logoElement){
            logoElement.innerText = '韵达快递';
            console.log('logo名称修改完成');
            clearInterval(t);
        }else{console.log('未找到logo名称');};
        console.log('第 ',num,' 次运行logo名称修改');
        if(num>30){clearInterval(t);};
    };
    var t = setInterval(loopIput,1000); // 每隔1秒检查一次 运行一次函数，直到运行成功,若果运行30次还没成功，则终止
    // -----------------------------------------------------------------------------------

    // Your code here...
})();