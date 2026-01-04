// ==UserScript==
// @name        全局监测网页中的磁力链接并复制到剪贴板
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description 监测并格式化复制磁力链接，带序号和时间戳
// @match       *://*/*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/531689/%E5%85%A8%E5%B1%80%E7%9B%91%E6%B5%8B%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/531689/%E5%85%A8%E5%B1%80%E7%9B%91%E6%B5%8B%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
'use strict';

const MAGNET_REGEX = /magnet:\?xt=urn:btih:[a-fA-F0-9]{40}[^\s"'<>]*/gi;
let foundMagnets = new Set();
let observer;

// 创建通知面板
const panel = document.createElement('div');
panel.style.cssText = `
position: fixed;
top: 20px;
right: 20px;
background: rgba(0,0,0,0.9);
color: #fff;
padding: 15px;
border-radius: 8px;
z-index: 999999;
font-family: 'Segoe UI', sans-serif;
box-shadow: 0 4px 12px rgba(0,0,0,0.25);
display: none;
min-width: 220px;
backdrop-filter: blur(5px);
`;

// 计数器样式
const counter = document.createElement('div');
counter.style.cssText = `
margin-bottom: 12px;
font-size: 14px;
color: #eee;
`;

// 复制按钮样式
const copyBtn = document.createElement('button');
copyBtn.textContent = '📋 复制链接';
copyBtn.style.cssText = `
background: linear-gradient(135deg, #2196F3, #1976D2);
border: none;
color: white;
padding: 8px 20px;
border-radius: 5px;
cursor: pointer;
font-size: 13px;
width: 100%;
transition: transform 0.1s;

&:hover {
  transform: scale(1.03);
}
&:active {
  transform: scale(0.98);
}
`;

// 组装面板
panel.appendChild(counter);
panel.appendChild(copyBtn);
document.body.appendChild(panel);

// 更新界面
function updateUI() {
counter.textContent = `🔍 发现 ${foundMagnets.size} 个磁力链接`;
panel.style.display = foundMagnets.size ? 'block' : 'none';
}

// 增强扫描功能
function scanForMagnets() {
// 扫描文本内容
document.querySelectorAll('*').forEach(element => {
const text = element.textContent || element.value;
let match;
while ((match = MAGNET_REGEX.exec(text)) !== null) {
foundMagnets.add(match.trim());
}
});

// 扫描链接属性
document.querySelectorAll('[href]').forEach(element => {
const href = element.href;
if (MAGNET_REGEX.test(href)) {
foundMagnets.add(href.split('&')); // 去除额外参数
}
});

updateUI();
}

// 优化后的复制功能
copyBtn.addEventListener('click', () => {
if (foundMagnets.size) {
const links = Array.from(foundMagnets);
const total = links.length;
const timestamp = new Date().toLocaleString();

// 带格式的剪贴板内容
const formattedText = `====== 磁力链接 ======
时间: ${timestamp}
共发现 ${total} 个磁力链接：

${links.map((link, index) => `${(index + 1).toString().padStart(2, ' ')}. ${link}`).join('\n\n')}

====== 结束 ======`;

GM_setClipboard(formattedText);

// 视觉反馈
panel.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
setTimeout(() => {
panel.style.background = 'rgba(0,0,0,0.9)';
}, 500);
}
});

// 优化观察器配置
function initObserver() {
observer = new MutationObserver(() => {
foundMagnets.clear();
scanForMagnets();
});

observer.observe(document.body, {
subtree: true,
childList: true,
attributes: true,
characterData: true,
attributeFilter: ['href']
});
}

// 防抖处理窗口变化
let resizeTimer;
window.addEventListener('resize', () => {
clearTimeout(resizeTimer);
resizeTimer = setTimeout(scanForMagnets, 300);
});

// 初始执行
scanForMagnets();
initObserver();
})();
