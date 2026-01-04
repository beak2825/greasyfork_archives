// ==UserScript==
// @name         都是我的头像
// @namespace    https://linux.do
// @version      0.0.4
// @description  我只要我自己的头像！
// @license      MIT
// @author       DengDai
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506585/%E9%83%BD%E6%98%AF%E6%88%91%E7%9A%84%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/506585/%E9%83%BD%E6%98%AF%E6%88%91%E7%9A%84%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = document.querySelector('[data-link-name="my-posts"]').getAttribute('href').split("/")[2];
    const regex = new RegExp(username, 'i');
    const button = document.createElement('button');
    button.textContent = "自定义头像链接";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.zIndex = 1000;
    button.style.backgroundColor = "#f0f0f0";
    button.style.color = "#000";
    button.style.border = "1px solid #ddd";
    button.style.padding = "5px 10px";
    button.style.borderRadius = "5px";
    document.body.appendChild(button);
     // 检查是否为首次运行脚本
    function checkFirstRun() {
        if (!localStorage.getItem("avatarIsFirstRun")) {
            console.log("脚本第一次运行，执行初始化操作...");
            updateInitialData();
            localStorage.setItem("avatarIsFirstRun", "false");
        } else {
            console.log("脚本非第一次运行");
        }
    }
    // 更新初始数据
    function updateInitialData() {
        const imgSrc = document.querySelector("#current-user img").src;
        localStorage.setItem("avatarLink", imgSrc);
        console.log("执行了初始数据更新操作");
    }
    // 按钮点击事件处理
    button.addEventListener('click', () => {
        const userLink = prompt("请输入链接：", localStorage.getItem('avatarLink') || 'https://');
        if (userLink) {
            localStorage.setItem('avatarLink', userLink);
            alert("链接已保存：" + userLink);
            location.reload();
        }
    });
    // 替换头像
    function replaceAvatars() {
        const avatarLink = localStorage.getItem('avatarLink');
        document.querySelectorAll(".avatar").forEach(img => {
            if (!regex.test(img.src)) {
                img.src = avatarLink;
            }
        });
    }
    // 初始化操作
    checkFirstRun();
    replaceAvatars();

    // 观察DOM变化并替换新出现的头像
    const observer = new MutationObserver(replaceAvatars);
    observer.observe(document.body, { childList: true, subtree: true });
})();