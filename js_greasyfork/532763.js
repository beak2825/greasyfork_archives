// ==UserScript==
// @name 馒头站预览图鼠标悬停放大功能
// @namespace http://tampermonkey.net/
// @version 0.6
// @description 馒头站预览图每次都需要点击放大，该脚本实现鼠标移动到预览图后，图片悬停放大功能。如果预览图感觉太小，自己倍数自己设置。
// @author julialove
// @match *://kp.m-team.cc/*
// @grant GM_addStyle
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532763/%E9%A6%92%E5%A4%B4%E7%AB%99%E9%A2%84%E8%A7%88%E5%9B%BE%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532763/%E9%A6%92%E5%A4%B4%E7%AB%99%E9%A2%84%E8%A7%88%E5%9B%BE%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
'use strict';

// 核心样式注入
GM_addStyle(`
/* 隐藏遮罩层 */
.ant-image-mask {
display: none !important;
visibility: hidden !important;
opacity: 0 !important;
}

/* 图片放大样式 */
.ant-image-img.torrent-list__thumbnail.css-1g2tpzp {
transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
transform-origin: left center; /* 修改放大原点为中心 */
}

.ant-image-img.torrent-list__thumbnail.css-1g2tpzp:hover {
transform: scale(10);/* 放大倍数10倍 */
width: auto !important;/* 解除固定尺寸限制*/
padding-left:10px;
z-index: 9999;
position: relative;
border-radius: 1px; /* 如果不需要圆角，也可以移除这行 */
}

/* 父容器修正 */
.ant-image-img.torrent-list__thumbnail.css-1g2tpzp-parent {
overflow: visible !important;
position: relative !important;
transform-style: preserve-3d;
}
`);

// 智能处理函数
const processElements = () => {
// 处理图片父容器
document.querySelectorAll('.ant-image-img.torrent-list__thumbnail.css-1g2tpzp').forEach(img => {
const parent = img.closest('div.ant-image');
if (parent && !parent.dataset.processed) {
parent.style.overflow = 'visible';
parent.style.position = 'relative';
parent.dataset.processed = true;
}
});

// 强制隐藏所有遮罩层（双重保障）
document.querySelectorAll('.ant-image-mask').forEach(mask => {
mask.style.cssText = 'display:none !important; opacity:0 !important;';
});
};

// 初始化执行
processElements();

// 动态内容监听
const observer = new MutationObserver(mutations => {
mutations.forEach(mut => {
if (mut.addedNodes.length) {
processElements();
// 额外处理新增图片的mouseenter事件
mut.addedNodes.forEach(node => {
if (node.nodeType === 1 && node.matches('.ant-image-img')) {
node.addEventListener('mouseenter', () => {
const mask = node.closest('.ant-image')?.querySelector('.ant-image-mask');
if (mask) mask.style.display = 'none';
});
}
});
}
});
});

observer.observe(document.body, {
childList: true,
subtree: true,
attributes: false,
characterData: false
});

// 事件监听保险
document.addEventListener('mouseover', (e) => {
if (e.target.matches('.ant-image-img.torrent-list__thumbnail.css-1g2tpzp')) {
const mask = e.target.closest('.ant-image')?.querySelector('.ant-image-mask');
if (mask) mask.style.display = 'none';
}
}, true);
})();