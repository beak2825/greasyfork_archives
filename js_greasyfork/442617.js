// ==UserScript==
// @name         河南经贸校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用前需要添加自己的账号密码
// @author       FISH_BMYY
// @author       B站_https://space.bilibili.com/173247063
// @license      FISH_BMYY
// @include      *://10.255.0.2:9090/*
// @match        https://blog.csdn.net/qq_35246620/article/details/77647234
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @downloadURL https://update.greasyfork.org/scripts/442617/%E6%B2%B3%E5%8D%97%E7%BB%8F%E8%B4%B8%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442617/%E6%B2%B3%E5%8D%97%E7%BB%8F%E8%B4%B8%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
    var user=""; //输入你的账号
    var pwd="";//输入你的密码

if(!document.querySelector("#login_submit")){
    //没有找到表示登录了,不再执行后续代码
return;
}
//未登录,执行登录代码
    
//账号
    document.querySelector("#user_name").value=user;

//密码
    document.querySelector("#tx").value=pwd;
    document.querySelector("#password").value=pwd;
    //我也不知道为什么要输入两次密码 反正这样可以登录
//登录
    document.querySelector("#login_submit").checked=true;
    document.querySelector("#login_submit").click();
//终止函数
    return;