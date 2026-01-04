// ==UserScript==
// @name         复制昵称和uid小助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  点击相应的按钮即可复制昵称或者uid
// @author       ddrrcc
// @icon         http://demo.sc.chinaz.com/Files/pic/icons/6273/k13.png
// @match        *://*.club.hihonor.com/cn/space*
// @match        *://*.club.huawei.com/space*
// @match        *://*.cn.club.vmall.com/space*
// @match        https://club.hihonor.com/cn/home*
// @match        https://club.huawei.com/home*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/js/toastr.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419520/%E5%A4%8D%E5%88%B6%E6%98%B5%E7%A7%B0%E5%92%8Cuid%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419520/%E5%A4%8D%E5%88%B6%E6%98%B5%E7%A7%B0%E5%92%8Cuid%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function(){$(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"><style> .toast-center-center {top: 50%;left: 50%;margin-top: -30px; margin-left: -150px;}</style>`),toastr.options={positionClass:"toast-center-center"};var a,b;a=$(".pcp-cont.pcpc-index > table > tbody > tr:first > td").html(),b=$(".pcb-name").html();var c=document.createElement("div");c.innerHTML="<div id='onediv'><p id='name'></p><p id='uid'></p></div>",document.body.appendChild(c),$("#name").html("\u6635\u79F0\uFF1A"+b),$("#uid").html("uid\uFF1A"+a),$(".pcb-name").append("<span><button style='background-color:#8EE5EE' data-clipboard-action='copy' data-clipboard-target='#name' class='btn'>\u590D\u5236\u6635\u79F0</button></span>"),$(".pcp-cont.pcpc-index > table > tbody > tr:first > td").append("<span><button style='background-color:#CAFF70' data-clipboard-action='copy' data-clipboard-target='#uid' class='btn'>\u590D\u5236uid</button></span>");var d=new ClipboardJS(".btn");d.on("success",function(a){toastr.success($(a.trigger).html()+"\u6210\u529F\uFF01<br>"+a.text),a.clearSelection()}),d.on("error",function(){toastr.error("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u754C\u9762\u518D\u8BD5\uFF01")})})();