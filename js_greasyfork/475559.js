// ==UserScript==
// @name         直达登录链接
// @namespace    https://nsfocus.com
// @version      1.0
// @description  Redirect to the URL specified by redirect_uri parameter
// @match       *://auth.nsfocus.com/*
// @grant        none
// @license 123
// @downloadURL https://update.greasyfork.org/scripts/475559/%E7%9B%B4%E8%BE%BE%E7%99%BB%E5%BD%95%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/475559/%E7%9B%B4%E8%BE%BE%E7%99%BB%E5%BD%95%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取当前 URL
     function executeScript() {
    var currentUrl = window.location.href;

    // 查找是否存在 redirect_uri 参数
    var redirectUriIndex = currentUrl.indexOf('redirect_uri=');

    if (redirectUriIndex !== -1) {
        // 截取 redirect_uri 参数之后的部分
        var redirectUri = currentUrl.substring(redirectUriIndex + 13); // 13 是 "redirect_uri=" 的长度

        // 解码 redirectUri（因为它是 URL 编码的）
        redirectUri = decodeURIComponent(redirectUri);

        // 重定向到解码后的 URL
        window.location.href = redirectUri;
    } else {
        // 如果没有找到 redirect_uri 参数，不进行任何操作
        console.log("URL 中没有 redirect_uri 参数");
    }
     }
    function addButton() {
        var button = document.createElement("button");
        button.innerHTML = "已经登录，点我直接跳转";
        button.style.position = "fixed";
        button.style.left = "15%";
        button.style.top = "50%";
        button.style.backgroundColor = "white"; // 设置按钮背景色为绿色
        button.style.color = "black"; // 设置按钮字体颜色为黑色
        button.style.fontSize = "72px"; // 设置按钮字体大小为24像素
        button.style.padding = "10px 20px"; // 设置按钮内边距
        button.style.border = "none"; // 去掉按钮边框
        button.addEventListener("click", executeScript);
        document.body.appendChild(button);
    }

    // 初始化时立即执行添加按钮的函数
    addButton();

})();
