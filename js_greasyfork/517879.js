// ==UserScript==
// @name         去除logo水印优化版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  免费去除在线制作logo中的水印，适用于标智客、标小智、LOGO123
// @license      MIT
// @author       imoki,诸葛
// @match        *://www.logomaker.com.cn/*
// @match        *://www.logosc.cn/*
// @match        *://ai.logo123.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517879/%E5%8E%BB%E9%99%A4logo%E6%B0%B4%E5%8D%B0%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/517879/%E5%8E%BB%E9%99%A4logo%E6%B0%B4%E5%8D%B0%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    // 添加悬浮按钮 HTML 和样式
    const buttonHtml = `
    <div style='padding:10px; position: fixed; right: 10px; top: 50%; z-index: 99999;'>
        <button id='clearWatermark'
                style='padding: 10px; margin-bottom: 10px; box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2); border: 1px solid #007BFF;
                       border-radius: 30px; font-size: 14px; font-weight: bold; background: linear-gradient(white, #B2D3F5);
                       color: #000; cursor: pointer;'>
            去水印
        </button>
        <button id='clearBackground'
                style='padding: 10px; box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2); border: 1px solid #007BFF;
                       border-radius: 30px; font-size: 14px; font-weight: bold; background: linear-gradient(white, #B2D3F5);
                       color: #000; cursor: pointer;'>
            去背景
        </button>
    </div>`;
    $("body").prepend(buttonHtml);

    // 核心移除功能
    const clearElements = () => {
        $(".watermark, .watermarklayer, .css-1ii3ma3").remove();

        // 移除所有 el-tooltip + css-xxx 动态水印
        $("i.el-tooltip[class*='css-']").remove();
    };

    // 动态检测并移除目标元素
    const observeMutations = () => {
        const observer = new MutationObserver(() => {
            clearElements();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    // 点击按钮触发
    $("button#clearWatermark").on("click", () => {
        clearElements();
        observeMutations(); // 启动动态检测
    });

    $("button#clearBackground").on("click", () => {
        $(".background").remove();
    });

    // 页面加载后自动清除
    const autoClear = () => {
        setTimeout(() => {
            clearElements();
        }, 5000); // 页面加载后延迟处理
    };

    // 滚动防抖处理
    const debounce = (func, delay) => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(func, delay);
        };
    };

    // 监听滚动进行清理
    window.onscroll = debounce(clearElements, 200);

    // 初始化
    $(document).ready(() => {
        autoClear();
    });

})(jQuery);
