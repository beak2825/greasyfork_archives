// ==UserScript==
// @name 当页开链
// @version  4.3
// @description  全站通用型页内增强脚本,Bing兼容,bili兼容.添加kook按钮排除
// @author   none
// @match *://*/*
// @grantunsafeWindow
// @run-at   document-body
// @exclude-match *://www.gamer520.com/*
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/497533/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497533/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE.meta.js
// ==/UserScript==

(function() {
'use strict';

const shouldExcludeElement = (target) => {
const EXCLUDE_SELECTORS = [
'.nav-content',
'.views',
'.presentation',
'.pay-box',  // 支付相关容器
'[target="_self"]',
'[role="group"]',
'#ks',
'.bpx-player-ending-related-item-cover',
'#qs_searchBox',
'.actions'
];
return EXCLUDE_SELECTORS.some(selector => target.closest(selector));
};

document.addEventListener('click', function(event) {
     var target = event.target;

     if (shouldExcludeElement(target)) {
        return true; // 保留所有原生交互逻辑
     }

    // 检查点击元素及其父元素链
 while (target && target.tagName !== 'A') {
        target = target.parentElement;
    }

    if (target && target.tagName === 'A') {
        event.preventDefault();
        // 内联改写（2025-04-01最新推荐写法）
        window.location.href = target.href;  // 直接替换函数调用
    }
});

// 协议安全名单


// 动态白名单（2025-03-01更新）


// 智能链接处理


// 增强事件监听（修复Bing搜索提交问题）
const initEventHandlers = () => {
// 拦截点击事件时排除表单元素
document.addEventListener('click', function(event) {
const target = event.composedPath()[0];


if (shouldExcludeElement(target)) {
return true; // 保留所有原生交互逻辑
}

// 白名单处理逻辑


// 常规链接处理
let node = target;
while (node && node.tagName !== 'A') {
node = node.parentElement;
}

if (node && node.tagName === 'A') {
event.preventDefault();
window.location.href = node.href;
}
}, true);  // 使用捕获阶段

// 兼容Bing的AJAX搜索（2025-03-01新增）

};

// 核心初始化
const main = () => {
if (window.self !== window.top) return;

// 设置基础标签


// 初始化事件处理器
initEventHandlers();

// 处理window.open
unsafeWindow.open = function(url) {
window.location.href = url;
};
};

// 启动逻辑
document.readyState === 'complete' ? main() :
document.addEventListener('DOMContentLoaded', main);
})();
