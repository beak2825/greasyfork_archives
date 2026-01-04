// ==UserScript==
// @name         悬浮按钮开启网页编辑模式
// @namespace    http://tampermonkey/
// @version      1.0
// @description  在网页上显示一个悬浮按钮，点击按钮开启或关闭网页编辑模式。
// @author       公众号酷玩安卓
// @match        *://*/*
// @grant        none
// @license      用户可以修改btn.textContent来修改按钮显示文字, 可自行添加作用域
// @downloadURL https://update.greasyfork.org/scripts/462518/%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%E5%BC%80%E5%90%AF%E7%BD%91%E9%A1%B5%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462518/%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%E5%BC%80%E5%90%AF%E7%BD%91%E9%A1%B5%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    var btn = document.createElement("button");
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.borderRadius = "50%";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.backgroundColor = "#1E90FF";
    btn.style.color = "#fff";
    btn.style.fontSize = "24px";
    btn.style.fontWeight = "bold";
    btn.style.boxShadow = "0px 2px 5px #888";
    btn.textContent = "修";

    // 添加按钮到页面中
    document.body.appendChild(btn);

    // 点击按钮触发事件
    var isEditable = false;
    btn.onclick = function(){
        if(!isEditable){
            // 开启网页编辑模式
            document.documentElement.contentEditable = "true";
            btn.textContent = "关";
            isEditable = true;
        }else{
            // 关闭网页编辑模式
            document.documentElement.contentEditable = "false";
            btn.textContent = "开";
            isEditable = false;
        }
    };
})();
