// ==UserScript==
// @name        修改"提交代码"为"查看题解"
// @namespace   http://tampermonkey.net/
// @match       *://www.luogu.com.cn/problem/*
// @grant       none
// @version     1.0
// @author      gybtx
// @description 将洛谷左上角的"提交代码"文本改成"查看题解"（只改文本）
// @downloadURL https://update.greasyfork.org/scripts/433937/%E4%BF%AE%E6%94%B9%22%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%22%E4%B8%BA%22%E6%9F%A5%E7%9C%8B%E9%A2%98%E8%A7%A3%22.user.js
// @updateURL https://update.greasyfork.org/scripts/433937/%E4%BF%AE%E6%94%B9%22%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%22%E4%B8%BA%22%E6%9F%A5%E7%9C%8B%E9%A2%98%E8%A7%A3%22.meta.js
// ==/UserScript==
(function(){
    setTimeout(function(){
      var x=document.getElementsByClassName("lfe-form-sz-middle");
      x[0].innerHTML="查看题解";
    },1000);
  }
)();

