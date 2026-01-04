// ==UserScript==
// @name         华南师范大学辅助工具
// @namespace    http://tampermonkey.net/
// @version      3.0
// @author       Yakraii&XiaoLuo
// @description  自动登录砺儒云课堂,左侧边栏可自定义跳转课堂,跳过教学管理信息平台登录界面5秒强制等待。
// @license      GPL-3.0
// @match        https://moodle.scnu.edu.cn/*
// @match        https://sso.scnu.edu.cn/AccountService/*
// @match        https://jwxt.scnu.edu.cn/*
// @match        https://lib.scnu.edu.cn/*
// @match        https://idp.scnu.edu.cn/*
// @match        https://ds.carsi.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource css https://cdn.jsdelivr.net/gh/Yakraii/cssRepo@v1.0.8/index2.css
// @downloadURL https://update.greasyfork.org/scripts/492821/%E5%8D%8E%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/492821/%E5%8D%8E%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //填入账密：
    var accountInput = "20222005231";
    var passwordInput = "88888888";

    //样式设置：
    const css = GM_getResourceText("css");
    GM_addStyle(css);

    // 按钮信息
        var buttonsInfo = [
            { text: "大型数据库", url: "https://moodle.scnu.edu.cn/course/view.php?id=16272" },
            { text: "游戏引擎", url: "https://moodle.scnu.edu.cn/course/view.php?id=11871" },
            { text: "软件设计", url: "https://moodle.scnu.edu.cn/course/view.php?id=16088" }
        ];

    if(window.location.href.startsWith("https://moodle.scnu.edu.cn/"))
    {
        var div = document.createElement("div"); //创建一个标签
        div.style.opacity = 0.95;
        div.style.backgroundColor = '#f0f0f0';
        div.style.borderRadius = '10px';
        div.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        div.style.position = 'absolute';
        div.style.top = '20%';
        div.style.paddingTop = '5px'; // 设置 div 顶部内边距
        div.className = "box"; //给创建的 div 设置 class；
        document.body.appendChild(div); //向刚获取的标签中添加创建的标签

      //添加课程名称、网址到buttonsInfo中
		var child = document.createElement("button");
        for (var i = 0; i < buttonsInfo.length; i++) {
            var buttonInfo = buttonsInfo[i];
            var button = document.createElement("button");
            button.innerHTML = buttonInfo.text;
            button.className = "klclass";
            (function(info) {
                button.onclick = function() {
                    window.location.href = info.url;
                };
            })(buttonInfo);
            div.appendChild(button);
        }

        // 设置 div 的大小
        div.style.width = '140px';
        div.style.height = (buttonsInfo.length*40)+5 + 'px';

    }

    if (window.location.href.startsWith("https://moodle.scnu.edu.cn/")) {
       if (document.querySelector(".forgotpass") !== null) {
        window.location.href = "https://sso.scnu.edu.cn/AccountService/openapi/auth.html?client_id=3f86b543c74eed80e7d72658699f6345&response_type=code&redirect_url=https://moodle.scnu.edu.cn/auth/sso/login.php";
       }
    }

    if (window.location.href === "https://sso.scnu.edu.cn/AccountService/user/login.html") {
       // 填写账号和密码
        document.getElementById("account").value = accountInput;
        document.getElementById("password").value = passwordInput;
        loginByPassword();
    }

    if (window.location.href.startsWith("https://sso.scnu.edu.cn/AccountService/openapi/auth.html")) {
       gotoApp(); // 调用页面函数
    }
    //教学管理信息平台跳转统一身份
    if(window.location.href == "https://jwxt.scnu.edu.cn/xtgl/login_slogin.html"){
        var RegistButton = document.querySelector("#tysfyzdl").click();
    }

    //教学管理信息平台
    if(window.location.href.includes("https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=")){
       //直接跳转教学管理信息平台
        window.location.href = "https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html"
    }
  
    //图书馆校外访问入口（论文网站登录）
    if(window.location.href === "https://lib.scnu.edu.cn/resource/entrance/"){
       //直接跳转资源访问入口
        window.location.href = "https://ds.carsi.edu.cn/Shibboleth.sso/Login?entityID=https://idp.scnu.edu.cn/idp/shibboleth&target=https%3A%2F%2Fds.carsi.edu.cn%2Fwxds"
        console.log(" 跳转成功!")
    }

    if(window.location.href.includes("https://idp.scnu.edu.cn/idp/profile/SAML2/")){
        const acceptCheckbox = document.getElementById('accept');
        if (acceptCheckbox) {
            acceptCheckbox.checked = true;
        }
        const submitButton = document.querySelector('button[name="_eventId_proceed"]');
        if (submitButton) {
             console.log("找到按钮!")
            submitButton.click();
        }else{
            console.log("没找到按钮!")
        }
        console.log(" 跳转成功!")
    }

    if (window.location.href.includes('https://ds.carsi.edu.cn/resource/resourceDetail.php?id=resource:')) {
        // 目标按钮的CSS选择
        const link = document.querySelector('div.moreBox  > a.earth_more');

        // 延迟执行以确保DOM加载
        setTimeout(() => {
            if (link) {
                link.click();
                console.log(' 检测到目标链接，已自动点击');
            } else {
                console.log(' 未找到目标链接，请检查：\n1. 选择器是否正确\n2. 页面是否动态加载');
            }
        }, 500);
    }
})();