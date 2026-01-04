// ==UserScript==
// @name         GetJavCover
// @namespace    https://www/github.com/coverli/
// @version      1.0.0
// @description  在javBus番片详情页面上生成下载按钮，点击按钮自动下载封面大图
// @author       CoverLi
// @match        目标网站
// @license      MIT
// @run-at       document-idle

// @include     *://*javbus.com/*
// @include     *://www.*bus*/*
// @include     *://www.*javsee*/*
// @include     *://www.*seejav*/*

// @grant       unsafeWindow
// @grant       GM_addStyle(css)
// @downloadURL https://update.greasyfork.org/scripts/453543/GetJavCover.user.js
// @updateURL https://update.greasyfork.org/scripts/453543/GetJavCover.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var br = document.createElement("br");
    var btn = document.createElement("button");
    btn.class = "downloadBtn";
    btn.innerHTML = "下載";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.background = "#6e8eb5";
    btn.style.borderRadius = "50%";
    btn.style.cursor = "pointer";
    btn.style.border = "none";
    btn.style.fontSize = "16px";
    btn.style.color = "ffffff";

    btn.onclick = function () {
        var url = document.getElementsByClassName('bigImage').item(0).href;
        var name = document.title.replace(' - JavBus', '');
        fetch(url).then(async res => await res.blob()).then((blob) => {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = URL.createObjectURL(blob);
            a.download = name + '.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
    }
    var code = document.getElementsByClassName('header_hobby')[0];
    var empty = document.getElementsByClassName('header_hobby')[0];
    code.parentElement.insertBefore(btn, code);
    empty.parentElement.insertBefore(br, empty);
})();