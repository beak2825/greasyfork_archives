// ==UserScript==
// @name        selection-black
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     0.0.1
// @author      -
// @description 1/6/2024, 10:02:43 PM
// @license GPLv2
// @downloadURL https://update.greasyfork.org/scripts/484059/selection-black.user.js
// @updateURL https://update.greasyfork.org/scripts/484059/selection-black.meta.js
// ==/UserScript==

// 创建一个新的 style 元素
var style = document.createElement('style');

// 设置 CSS 规则
// 注意：这里使用了 ES6 模板字符串来保持 CSS 规则的格式，也可以使用普通的字符串连接
var css = `::selection {
            color: #fafafa;
            background: #0a0a0a;
          }`

// 为了兼容不同的浏览器，需要检查一下是否存在某些 DOM 方法
if (style.styleSheet) {
  // 这是给 IE 的老版本使用的
  style.styleSheet.cssText = css;
} else {
  // 其他大部分浏览器
  style.appendChild(document.createTextNode(css));
}

// 将 style 元素添加到 head 中
document.head.appendChild(style);

