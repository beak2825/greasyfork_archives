// ==UserScript==
// @name         Clear sessionStorage, localStorage, and cookies for the current site
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在当前网站上清除 sessionStorage, localStorage 和 cookies。
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517748/Clear%20sessionStorage%2C%20localStorage%2C%20and%20cookies%20for%20the%20current%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/517748/Clear%20sessionStorage%2C%20localStorage%2C%20and%20cookies%20for%20the%20current%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement("button");
    button.textContent = "Clear Storage Data";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.backgroundColor = "#FF4C4C";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    // 添加按钮到页面
    document.body.appendChild(button);

    // 按钮点击事件：清除数据
    button.addEventListener("click", function() {
        // 清除 sessionStorage
        sessionStorage.clear();
        
        // 清除 localStorage
        localStorage.clear();

        // 清除当前网站的 cookies
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
        }

        // 显示清除成功的提示
        alert("All sessionStorage, localStorage, and cookies for this site have been cleared.");
    });
})();
