// ==UserScript==
// @name         获取POE POESSID
// @namespace    http://tampermonkey.net/
// @version      2024-04-05
// @description  一键获取poe的cookie，使用查价计价更方便
// @author       红魔
// @match        https://poe.game.qq.com/*
// @icon         https://poecdn.game.qq.com/protected/image/trade/layout/logo.png?key=aifr8Q9qj0FYhhu8_rrfhw
// @grant        GM_cookie
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492170/%E8%8E%B7%E5%8F%96POE%20POESSID.user.js
// @updateURL https://update.greasyfork.org/scripts/492170/%E8%8E%B7%E5%8F%96POE%20POESSID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let str = "";
    //获取POE网站上的COOKIE
    GM_cookie.list({}, function(cookies, error) {
        if (!error) {
            console.log(cookies);
            cookies.forEach((e)=>{
                str+=e.name + "=" + e.value + ";";
            });
            console.log(str);

        } else {
            console.error(error);
        }
    });

    // 创建按钮元素
    const button = document.createElement("button");
    button.textContent = "一键复制COOKIE"; // 按钮文本内容
    button.style.borderRadius = "5px"; // 圆角
    button.style.backgroundColor = "blue"; // 蓝色背景
    button.style.color = "white"; // 文本颜色
    button.style.padding = "5px 10px"; // 内边距
    button.style.width = "100px";
    button.style.height = "100px";
    button.style.position = "fixed"; // 设置为固定定位
    button.style.top = "100px"; // 距离顶部的距离
    button.style.right = "100px"; // 距离右侧的距离
    button.style.zIndex = "9999"; // 保证按钮在最顶层

    // 将点击按钮时执行的函数绑定到按钮的点击事件
    button.addEventListener("click", function() {
        // 复制字符串到剪贴板
        navigator.clipboard.writeText(str)
            .then(() => {
            alert('COOKIE已复制到剪贴板');
            console.log('字符串已复制到剪贴板');
        })
            .catch(err => {
            console.error('复制失败:', err);
        });
    });

    // 将按钮添加到页面的 body 元素中
    document.body.appendChild(button);
})();