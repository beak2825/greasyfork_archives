// ==UserScript==
// @name PT站自动感谢
// @description 浏览PT站资源详情页面时使用 AJAX 方式在后台自动感谢发布者。
// @namespace https://greasyfork.org/zh-CN/scripts/4736-pt%E7%AB%99%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2
// @author ※云※
// @version 2025.2.23 v2
// @match *://*/details.php*
// @match *://*/plugin_details.php*
// @match *://totheglory.im/t/*
// @icon http://thumbnails109.imagebam.com/35138/602509351372863.jpg
// @downloadURL https://update.greasyfork.org/scripts/4736/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/4736/PT%E7%AB%99%E8%87%AA%E5%8A%A8%E6%84%9F%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
function $(css, contextNode) {
return (contextNode || document).querySelector(css);
}

function Thanks(retries) {
retries = retries || 0; // 初始化重试次数
var url = location.href;
var btn = null;

if (url.indexOf('totheglory') > 0) {
btn = $('#ajaxthanks');
} else if (url.indexOf('hdwing') > 0) {
btn = $('#thanksbutton');
} else if (url.indexOf('details') > 0) {
btn = $('#saythanks');
}

if (btn != null && btn.disabled != true) {
btn.click();
} else if (retries < 30) { // 最多重试30次，防止无限循环
setTimeout(function() {
Thanks(retries + 1);
}, 200); // 每次重试间隔200毫秒
}
}

// 立即开始执行，不依赖任何加载事件
Thanks();
})();