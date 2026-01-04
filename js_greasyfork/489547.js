// ==UserScript==
// @name         邀请链接拦截器
// @namespace    https://linux.do
// @version      1.0.8
// @description  拦截某些人的邀请链接并提供还原选项
// @author       Hua
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489547/%E9%82%80%E8%AF%B7%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489547/%E9%82%80%E8%AF%B7%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储原始链接
    const originalLinks = new Map();

    const redirectIfNeeded = () => {
        if(window.location.href.startsWith("https://linux.do/invites/")) {
            window.location.replace("https://linux.do");
        }

        document.querySelectorAll("a").forEach((a) => {
            if(a.href.startsWith("https://linux.do/invites/")) {
                a.href = window.location.href;
            }
            if(a.href !== undefined && a.href !== '' && !a.href.includes("linux.do/") && !a.href.includes(".linux.do/")) {
                const href = a.href;
                a.href = window.location.href; // 替换为当前地址
                if (!originalLinks.has(a)) {
                    originalLinks.set(a, href); // 保存原始链接
                }
            }
        });
        if (document.getElementById("linuxdoInvited") === null) {
            addButton();
        }
    };

    // 切换链接的函数
    const toggleLinks = () => {
        document.querySelectorAll("a").forEach((a) => {
            if(originalLinks.has(a)) {
                a.href = a.href === window.location.href ? originalLinks.get(a) : window.location.href;
            }
        });
    };

    // 添加按钮
    const addButton = () => {
        const button = document.createElement("button");
        button.id = "linuxdoInvited"
        button.textContent = "切换链接";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.left = "20px";
        button.classList.add('btn', 'btn-icon-text', 'btn-default')
        button.addEventListener("click", toggleLinks);
        console.log(document)
        document.body.appendChild(button);
    };

    const observer = new MutationObserver(redirectIfNeeded);
    observer.observe(document.body, {childList: true, subtree: true});
})();
