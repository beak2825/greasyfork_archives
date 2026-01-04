// ==UserScript==
// @name        解除电信劫持
// @namespace   https://greasyfork.org/zh-CN/users/821
// @description 解决电信劫持空白页面问题
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/37327/%E8%A7%A3%E9%99%A4%E7%94%B5%E4%BF%A1%E5%8A%AB%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/37327/%E8%A7%A3%E9%99%A4%E7%94%B5%E4%BF%A1%E5%8A%AB%E6%8C%81.meta.js
// ==/UserScript==

        var a=document.getElementsByTagName('script')[0].innerHTML;
        if(a.indexOf("=iunm?=ifbe?=nfub!obnf")>0){
           window.location.reload();
           console.log("reload done!");
        }
