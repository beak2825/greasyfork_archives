// ==UserScript==
// @name         通用复制内容净化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  智能去除复制内容中的小尾巴、协议声明及编辑标记，支持多网站
// @author       sjx01
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529214/%E9%80%9A%E7%94%A8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529214/%E9%80%9A%E7%94%A8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区：自定义需要移除的正则表达式（用户可自行添加）
    const removePatterns = [
        // 匹配萌娘百科小尾巴
        /\s*阅读更多：[\s\S]*?协议。\s*$/,
        // 通用协议声明（匹配知识共享等关键词）
        /\n*本文.*?(知识共享|CC协议|署名)[\s\S]*?\d+\.?\d*[\s\S]*?$/,
        // 匹配 [编辑] 及其变体（如[ 编辑 ]）
        /\[\s*编辑\s*\]/g,
        // 匹配常见 "查看原文" 类链接
        /\s*更多内容请访问.*$/
    ];

    // 核心逻辑：拦截复制事件并净化文本
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        let text = window.getSelection().toString();

        // 多轮正则过滤
        removePatterns.forEach(regex => {
            text = text.replace(regex, '');
        });

        // 移除首尾空白
        e.clipboardData.setData('text/plain', text.trim());
    });

    // 高级防护：通过CSS阻止选择编辑按钮
    const css = `
        a[href*="edit"],         /* 维基类编辑链接 */
        .edit-button,            /* 通用编辑按钮类 */
        span[title="编辑"]       /* 带标题属性的编辑元素 */
        {
            user-select: none !important;
            -moz-user-select: none !important;
            -webkit-user-select: none !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();

// 精准去除 "[编辑]" 标记
// 正则升级：使用 /\[\s*编辑\s*\]/g 匹配含空格的变体（如[ 编辑 ]）
// CSS 防护：通过 user-select: none 阻止选中编辑按钮，从源头解决问题

// 多网站扩展支持
// 通用匹配规则：@match *://*/* 适用于所有网站
// 模块化正则库：
// [
//   /\s*阅读更多：[\s\S]*?协议。\s*$/,     // 萌娘百科
//   /\n*本文.*?知识共享[\s\S]*?$/,        // 通用协议
//   /\[\s*编辑\s*\]/g,                   // 维基类编辑标记
//   /\s*Source:\s*http\S+/               // 英文网站常见小尾巴
// ]
// 用户只需修改此数组即可适配新网站

// 智能过滤算法
// 多轮替换：依次应用所有正则表达式
// 空白清理：trim() 保证首尾无多余换行/空格

// 性能优化
// 事件委托：仅监听一次 copy 事件
// 样式注入：CSS 规则在页面加载时即生效，无需持续监控
