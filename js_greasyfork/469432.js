// ==UserScript==
// @name         Luogu Markdown Copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  以markdown复制洛谷blog
// @author       hyj0824
// @match        https://www.luogu.com.cn/blog/*
// @icon         https://www.google.com/s2/favicons?domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469432/Luogu%20Markdown%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/469432/Luogu%20Markdown%20Copier.meta.js
// ==/UserScript==

(function () {

    "use strict";

    // let $ = typeof window.$ == "function" ? window.$ : unsafeWindow.jQuery; // byd没有jquery!!!
    // 添加按钮

    const $CSS = '.floating-button { position: fixed;bottom: 20px;left: 20px;z-index: 1000;border-radius: 50%;background: #f4524d;color: #fff;font-size: 15px;width: 50px;height: 50px;text-align: center;line-height: 0px;transition: all 0.2s ease;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);cursor: pointer;}.floating-button:hover {  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  transform: translateY(-5px);}.floating-button:active {  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);  transform: translateY(2px);}';
    const sheet = new CSSStyleSheet();
    sheet.replaceSync($CSS);
    document.adoptedStyleSheets = [sheet];

    var son = document.createElement('button');
    son.setAttribute("class","floating-button");
    son.innerHTML = "复制";


    document.querySelector("body").appendChild(son);

    // 绑定事件

    document.querySelector("body > button").onclick = function () {

        //var content = document.getElementById('textArea').innerHTML;

        fetch('/api/blog/detail/' + BlogGlobals.blogID).then(res => res.json()).then(res => navigator.clipboard.writeText(res.data.Content));
        alert("markdown已复制！请确认是否开启剪切板权限！");

    };

})();