// ==UserScript==
// @name         tool.p2hp文本对比工具的折叠边栏并加宽对比窗
// @namespace    https://greasyfork.org/zh-CN/scripts/474575
// @version      0.2
// @description  给tool.p2hp的在线文本对比工具窗口放大
// @author       beibeibeibei
// @license      MIT
// @match        https://tool.p2hp.com/tool-online-difftext/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474575/toolp2hp%E6%96%87%E6%9C%AC%E5%AF%B9%E6%AF%94%E5%B7%A5%E5%85%B7%E7%9A%84%E6%8A%98%E5%8F%A0%E8%BE%B9%E6%A0%8F%E5%B9%B6%E5%8A%A0%E5%AE%BD%E5%AF%B9%E6%AF%94%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/474575/toolp2hp%E6%96%87%E6%9C%AC%E5%AF%B9%E6%AF%94%E5%B7%A5%E5%85%B7%E7%9A%84%E6%8A%98%E5%8F%A0%E8%BE%B9%E6%A0%8F%E5%B9%B6%E5%8A%A0%E5%AE%BD%E5%AF%B9%E6%AF%94%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let 工具尺寸 = "1880px";

    // 折叠/展开边栏按钮
    var btn = document.createElement("BUTTON");
    btn.id = "hide_sidebar_btn";
    btn.textContent = "折叠边栏并加宽对比窗";

    btn.style.position = "absolute";
    btn.style.top = "5px";
    btn.style.left = "5px";
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.borderRadius = "10px";
    btn.style.width = "200px";

    document.body.appendChild(btn);

    btn.addEventListener("click", function() {
        if (document.querySelector("div.sidebar").style.display == "none"){
            btn.textContent = "折叠边栏并加宽对比窗";
            document.querySelector("div.sidebar").style.display = "";
            //恢复尺寸
            document.querySelector("div.app").style.width = "";
            document.querySelector("div.app").style.position = "";
        }else{
            btn.textContent = "展开边栏";
            document.querySelector("div.sidebar").style.display = "none";
            //加宽对比工具尺寸
            document.querySelector("div.app").style.width = 工具尺寸;
            document.querySelector("div.app").style.position = "absolute";
        }
    });

    // Your code here...
})();