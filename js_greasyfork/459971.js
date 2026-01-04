// ==UserScript==
// @name         一键获取网页所有图片地址
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  获取网页全部图片地址，筛选尺寸不小于XXX像素的图片，将结果放到剪贴板上，然后自己就可以粘贴在下载工具（比如迅雷的新建任务上）来下载，或者用作其他用途。查询按钮在网页右下角。（筛选尺寸自己在代码里修改阙值，默认筛选至少大于200*300像素）
// @author       Techwb.cn
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @license none
// @downloadURL https://update.greasyfork.org/scripts/459971/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/459971/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%BD%91%E9%A1%B5%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 创建按钮
var btn = document.createElement("button");
btn.innerHTML = "查询";
btn.style.backgroundColor = "red";
btn.style.color = "white";
btn.style.borderRadius = "50%";
btn.style.position = "fixed";
btn.style.bottom = "17%";
btn.style.right = "0";
btn.style.opacity = "1";
btn.style.fontSize = "14px";
btn.style.padding = "10px";
btn.style.cursor = "pointer";
document.body.appendChild(btn);

// 显示/隐藏按钮
btn.onmouseover = function() {
    btn.style.opacity = "1";
}
btn.onmouseout = function() {
    btn.style.opacity = "0.3"; // 设计按钮透明度
}

// 获取图片地址并放到剪贴板上，筛选尺寸阙值在这里修改。
btn.onclick = function() {
    var imgs = document.getElementsByTagName("img");
    var urlList = [];
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].width >= 200 && imgs[i].height >= 300) {
            urlList.push(imgs[i].src);
        }
    }
    if (urlList.length > 0) {
        GM_setClipboard(urlList.join("\n"));
        GM_notification({
            title: "图片地址已生成！",
            text: "共有" + urlList.length + "张图片，地址列表已放到剪贴板上。",
            timeout: 5000
        });
    } else {
        GM_notification({
            title: "很抱歉！",
            text: "并没有找到你设定尺寸的图片。",
            timeout: 5000
        });
    }
};
})();
