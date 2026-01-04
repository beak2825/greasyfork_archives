// ==UserScript==
// @name         隐藏图片并管理白名单（摸鱼）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅在白名单中的域名下隐藏图片，并管理白名单功能（通过菜单命令），支持背景图片和延迟加载图片
// @author       lengsukq
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/513771/%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87%E5%B9%B6%E7%AE%A1%E7%90%86%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%88%E6%91%B8%E9%B1%BC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513771/%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87%E5%B9%B6%E7%AE%A1%E7%90%86%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%88%E6%91%B8%E9%B1%BC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前域名
    var currentDomain = window.location.hostname;

    // 检查白名单域名
    var whitelistDomains = GM_getValue("whitelistDomains", []);

    // 隐藏图片的通用函数
    function hideImages() {
        console.log("执行图片隐藏操作");

        // 隐藏所有 <img> 标签的图片
        var images = document.querySelectorAll("img");
        images.forEach(function(img) {
            img.style.display = "none";
        });

        // 隐藏所有具有背景图片的元素
        var backgroundImages = document.querySelectorAll('*');
        backgroundImages.forEach(function(element) {
            var bgImage = window.getComputedStyle(element).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                element.style.backgroundImage = 'none';
            }
        });
    }

    // 检查当前域名是否在白名单中
    if (whitelistDomains.includes(currentDomain)) {
        console.log(currentDomain + " 在白名单中，开始隐藏图片");

        // 等待页面加载完成再执行
        window.onload = function() {
            hideImages();  // 初次执行隐藏操作
        };

        // 使用 MutationObserver 动态监视 DOM 的变化（如延迟加载的图片）
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    hideImages();  // 检测到变化时再次隐藏图片
                }
            }
        });

        // 配置 MutationObserver 监听所有 DOM 的子节点和属性变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

    } else {
        console.log(currentDomain + " 不在白名单中，不隐藏图片");
    }

    // 注册菜单命令用于管理白名单
    GM_registerMenuCommand('管理白名单', function() {
        // 创建弹出窗体
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        overlay.style.zIndex = "10001";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        document.body.appendChild(overlay);

        var form = document.createElement("div");
        form.style.backgroundColor = "white";
        form.style.padding = "30px";
        form.style.width = "400px";
        form.style.borderRadius = "10px";
        form.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        form.style.zIndex = "10002";
        overlay.appendChild(form);

        var title = document.createElement("h2");
        title.textContent = "管理白名单";
        title.style.marginTop = "0";
        title.style.fontSize = "20px";
        title.style.textAlign = "center";
        form.appendChild(title);

        var label = document.createElement("label");
        label.textContent = "白名单域名 (每行一个):";
        label.style.fontSize = "14px";
        label.style.display = "block";
        label.style.marginBottom = "10px";
        form.appendChild(label);

        var textarea = document.createElement("textarea");
        textarea.style.display = "block";
        textarea.style.margin = "10px 0";
        textarea.style.width = "100%";
        textarea.style.height = "200px";
        textarea.style.padding = "10px";
        textarea.style.borderRadius = "5px";
        textarea.style.border = "1px solid #ccc";
        textarea.style.fontSize = "14px";
        textarea.value = GM_getValue("whitelistDomains", []).join("\n");
        form.appendChild(textarea);

        // 创建保存按钮
        var saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.textContent = "保存";
        saveButton.style.backgroundColor = "#4CAF50";
        saveButton.style.color = "white";
        saveButton.style.border = "none";
        saveButton.style.padding = "10px 20px";
        saveButton.style.borderRadius = "5px";
        saveButton.style.cursor = "pointer";
        saveButton.style.marginRight = "10px";
        form.appendChild(saveButton);

        // 创建取消按钮
        var cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "取消";
        cancelButton.style.backgroundColor = "#f44336";
        cancelButton.style.color = "white";
        cancelButton.style.border = "none";
        cancelButton.style.padding = "10px 20px";
        cancelButton.style.borderRadius = "5px";
        cancelButton.style.cursor = "pointer";
        form.appendChild(cancelButton);

        // 保存按钮点击事件
        saveButton.addEventListener("click", function() {
            var whitelistDomains = textarea.value.trim().split("\n").filter(Boolean);
            GM_setValue("whitelistDomains", whitelistDomains);
            console.log("白名单已保存: " + whitelistDomains.join(", "));
            // 移除弹出窗体
            document.body.removeChild(overlay);
        });

        // 取消按钮点击事件，关闭窗体但不保存
        cancelButton.addEventListener("click", function() {
            document.body.removeChild(overlay);
        });

        // 点击空白处关闭窗体但不保存
        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // 防止点击窗体内容时关闭窗体
        form.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    });
})();
