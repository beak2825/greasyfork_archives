// ==UserScript==
// @name         Auto login
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      gpl-3.0
// @description  绕过中科大统一身份认证的验证码并自动聚焦至登录按钮
// @author       PRO
// @match        https://passport.ustc.edu.cn/*
// @icon         https://passport.ustc.edu.cn/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438462/Auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/438462/Auto%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let form = document.getElementsByClassName('loginForm')[0]; // 登录表格
    let options = { // observer 观察选项
        childList: true, // 观察目标子节点的变化，添加或删除
        attributes: false, // 观察属性变动
        subtree: true // 默认是false，设置为true后可观察后代节点
    }
    function bypass() { // 绕过验证码
        // 将 showCode 设置为空以绕过服务器的验证码校验
        let showCode = document.getElementsByName('showCode')[0];
        showCode.value = "";
        // 移除验证码元素
        let code = document.querySelector('#valiCode');
        code.remove();
    }
    function focus() { // 将焦点移至登录按钮，以便直接按下回车登录
        var button = document.getElementById('login');
        button.focus();
    }
    function main() { // 主函数
        bypass();
        focus();
        observer.disconnect(); // observer 停止观测
    }
    let observer = new MutationObserver(main); // 实例化 observer
    observer.observe(form, options); // 开始观测
})();