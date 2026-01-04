// ==UserScript==
// @name         Apple Connect 通知服务器
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       HolmesZhao
// @match        *://appstoreconnect.apple.com/apps/1179683066/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411204/Apple%20Connect%20%E9%80%9A%E7%9F%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/411204/Apple%20Connect%20%E9%80%9A%E7%9F%A5%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addButton(name, marginLeft, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; padding: 10px; background-color: white; position: fixed; top: 0pt; left: " + (marginLeft) + "px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth + btn.offsetLeft;
    };
    
    function notiServer() {
        alert('通知成功!');
    }
    
    addButton("通知服务器提交审核了", screen.width / 3, notiServer);
})();