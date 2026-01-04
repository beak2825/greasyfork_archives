// ==UserScript==
// @name         萌娘百科重定向旧版主页
// @namespace    https://greasyfork.org/zh-CN/scripts/505374
// @supportURL   https://greasyfork.org/zh-CN/scripts/505374
// @version      3.1
// @description  自动重定向到旧版主页
// @author       OctoberSama&ChatGPT
// @license      CC BY-NC-SA 4.0
// @match        zh.moegirl.org.cn/*
// @match        mzh.moegirl.org.cn/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505374/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%87%8D%E5%AE%9A%E5%90%91%E6%97%A7%E7%89%88%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/505374/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%87%8D%E5%AE%9A%E5%90%91%E6%97%A7%E7%89%88%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- 功能 1: 重定向逻辑 ---
    function checkAndRedirect() {
        // 安全获取页面名称：先尝试从 mw 对象获取，如果失败（加载过早）则简单判断 URL
        let pageName = "";
        if (typeof window.mw !== "undefined" && window.mw.config) {
            pageName = window.mw.config.get("wgPageName");
        } else if (location.pathname.includes("Mainpage")) {
            pageName = "Mainpage";
        }

        // 只有在主页 且 当前没有 legacy 哈希时才重定向
        if (pageName === "Mainpage" && location.hash !== "#/legacy") {
            // 使用 replace 而不是直接赋值，避免留下多余的历史记录
            history.replaceState(null, null, "#/legacy");
            // 触发 hashchange 事件以确保页面响应（某些框架需要）
            window.dispatchEvent(new Event('hashchange'));
        }
    }

    // --- 功能 2: 删除切换按钮 ---
    function removeDelTab() {
        const targetSelector = "#home-layout-toggler";
        const element = document.querySelector(targetSelector);

        // 如果元素已存在，直接删除
        if (element) {
            element.remove();
            return;
        }

        // 如果元素还没加载，使用 Observer 监听
        const observer = new MutationObserver(function(mutations, obs) {
            const el = document.querySelector(targetSelector);
            if (el) {
                el.remove();
                obs.disconnect(); // 删除成功后停止监听，节省资源
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行逻辑
    checkAndRedirect();
    removeDelTab();

    // 额外保险：因为萌娘百科可能是单页应用(SPA)加载模式，监听 URL 变化
    window.addEventListener('popstate', checkAndRedirect);
})();