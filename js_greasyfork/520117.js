// ==UserScript==
// @name         点击跳转到Keylol论坛tag页面 (SteamDB悬浮按钮)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加一个悬浮按钮，点击后跳转到Keylol论坛的tag页面 (SteamDB)
// @author       You
// @match        https://steamdb.info/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520117/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%88%B0Keylol%E8%AE%BA%E5%9D%9Btag%E9%A1%B5%E9%9D%A2%20%28SteamDB%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520117/%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC%E5%88%B0Keylol%E8%AE%BA%E5%9D%9Btag%E9%A1%B5%E9%9D%A2%20%28SteamDB%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取当前页面的 appid
        const appid = window.location.pathname.split('/')[2];  // 提取 appid 部分
        console.log("当前appid:", appid);

        // 创建一个悬浮按钮
        let btn = document.createElement('button');
        btn.innerText = '跳转到Keylol论坛tag';
        btn.style.position = 'fixed'; // 固定位置
        btn.style.bottom = '30px'; // 距离页面底部20px
        btn.style.right = '20px'; // 距离页面右侧20px
        btn.style.padding = '15px 30px';
        btn.style.backgroundColor = '#1f1f1f';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.zIndex = '1000'; // 确保按钮显示在其他元素之上

        // 将按钮添加到页面中
        document.body.appendChild(btn);

        // 按钮点击事件
        btn.addEventListener('click', function(e) {
            e.preventDefault();  // 阻止默认行为

            // 构造跳转链接
            const redirectUrl = `https://keylol.com/plugin.php?id=keylol_tags:redirect&appid=${appid}`;
            console.log("跳转链接：", redirectUrl);

            // 跳转到 Keylol 论坛页面
            window.open(redirectUrl, '_blank');
        });
    });
})();