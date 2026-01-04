// ==UserScript==
// @name         AES加解密自动填充密钥
// @namespace    https://yungehuo.com
// @version      1.0.16
// @description  iview 文档辅助工具，用于方便查看文档
// @author       aaaa
// @match        *://the-x.cn/*
// @match        *://tool.lmeee.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447795/AES%E5%8A%A0%E8%A7%A3%E5%AF%86%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E9%92%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/447795/AES%E5%8A%A0%E8%A7%A3%E5%AF%86%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E9%92%A5.meta.js
// ==/UserScript==
window.onload = function(){
    if (/the-x.cn/.test(location.host)) {
        document.getElementById("key").value="7QV#Ng9FQqn3SKC9";
    }
    if (/tool.lmeee.com/.test(location.host)) {
        document.querySelector("#cryptMode").selectedIndex=0;
        $("#cryptIv").remove();
        $("#label-cryptIv").remove();
        $("#SycSelect-cryptMode_text").val("ECB")
        $("#cryptPassword").val("7QV#Ng9FQqn3SKC9")
    }
    if (/tool.chacuo.net/.test(location.host)) {
        document.querySelector("input[prop='p']").value="7QV#Ng9FQqn3SKC9";
        document.querySelector("select[prop='s']").selectedIndex=3;
    }
 }