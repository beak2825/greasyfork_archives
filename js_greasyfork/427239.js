// ==UserScript==
// @name         百家号去空行脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the rows which have no content in Baijiahao editor.
// @author       dogcraft
// @match        https://baijiahao.baidu.com/builder/rc/*
// @icon         https://dogcraft.top/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427239/%E7%99%BE%E5%AE%B6%E5%8F%B7%E5%8E%BB%E7%A9%BA%E8%A1%8C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427239/%E7%99%BE%E5%AE%B6%E5%8F%B7%E5%8E%BB%E7%A9%BA%E8%A1%8C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
(function() {
    //'use strict';
 
    function rmkh() {
        let ifdog = document.getElementsByTagName("iframe")[0];
        let dogoc = ifdog.contentDocument;
        let doglist = dogoc.body;
        for (const sko of doglist.children) {
            console.log(sko.children.length);
            if (sko.children.length > 0 ) {
                if (sko.children[0].tagName=="BR") {
                    doglist.removeChild(sko);
                }
            }
 
        }
 
    }
    const Opdog = document.getElementsByClassName("op-list")[0];
    const Btdog = document.createElement("button");
    Btdog.className="ant-btn bjh-btn-normal op-preview";
    Btdog.innerText="去除空行";
    Btdog.addEventListener("click", function(){ alert("空行已移除！"); });
    Btdog.addEventListener("click", rmkh);
    Opdog.appendChild(Btdog);
})();