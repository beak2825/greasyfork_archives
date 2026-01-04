// ==UserScript==
// @name         添加B站频道标签
// @match        https://www.bilibili.com/*
// @grant        none
// @description  为b站添加消失的频道入口
// @version 0.0.1.20230904105255
// @namespace https://greasyfork.org/users/1165469
// @downloadURL https://update.greasyfork.org/scripts/474461/%E6%B7%BB%E5%8A%A0B%E7%AB%99%E9%A2%91%E9%81%93%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474461/%E6%B7%BB%E5%8A%A0B%E7%AB%99%E9%A2%91%E9%81%93%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

// 创建一个新的a标签
let a = document.createElement('a');
a.setAttribute('href', 'https://www.bilibili.com/v/channel/');
a.setAttribute('target', '_blank');
a.setAttribute('rel', 'noopener noreferrer');
a.setAttribute('class', 'channel-icons__item');

// 创建一个新的div元素
let div = document.createElement('div');
div.setAttribute('class', 'icon-bg icon-bg__popular');

// 创建一个新的svg标签
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', '22');
svg.setAttribute('height', '23');
svg.setAttribute('viewBox', '0 0 22 23');
svg.setAttribute('fill', 'none');
svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
svg.setAttribute('class', 'icon-bg--icon');

// 添加路径到SVG标签
let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('d', "M6.41659 15.625C3.88528 15.625 1.83325 13.7782 1.83325 11.5H10.9999C10.9999 13.7782 8.94789 15.625 6.41659 15.625Z");
path.setAttribute('stroke', 'white');
path.setAttribute('stroke-width', '2');
path.setAttribute('stroke-linecap', 'round');
path.setAttribute('stroke-linejoin', 'round');

// 将路径添加为SVG标签的子元素
svg.appendChild(path);

// 将SVG标签添加为div元素的子元素
div.appendChild(svg);

// 创建一个新的span标签
let span = document.createElement('span');
span.setAttribute('class', 'icon-title');
span.textContent = '频道';

// 将div元素和span标签添加为a标签的子元素
a.appendChild(div);
a.appendChild(span);

// 找到第一个channel-icons__item元素
let item = document.querySelector('.channel-icons__item');

// 将新创建的a标签插入到第一个channel-icons__item元素后面
item.parentNode.insertBefore(a, item.nextSibling);