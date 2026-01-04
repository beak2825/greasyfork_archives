// ==UserScript==
// @name         回复盖章小助手
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  回复即盖章
// @author       ddrrcc
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *://*.club.hihonor.com/cn/thread*
// @match        *://*.club.hihonor.com/forum.php*
// @match        *://*.club.huawei.com/thread*
// @match        *://*.club.huawei.com/forum.php*
// @match        *://*.cn.club.vmall.com/forum.php*
// @match        *://*.cn.club.vmall.com/thread*
// @icon         http://demo.sc.chinaz.com/Files/pic/icons/5951/c7.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419445/%E5%9B%9E%E5%A4%8D%E7%9B%96%E7%AB%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419445/%E5%9B%9E%E5%A4%8D%E7%9B%96%E7%AB%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){$(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"><style> #onediv{z-index: 9999;background-color:#FFFFFF;width:20px;font-size:14px;position:fixed;top:35%;right:35%;padding:10px;border-radius:90px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center} .toast-center-center{top: 50%;left: 50%;margin-top: -30px; margin-left: -150px;}</style>`);var a,b,c,d,e;toastr.options={positionClass:"toast-center-center"},a=$("#scbar_form > input[name='formhash']").val(),c=window.location.href.split("-")[1],b=$("#scbar_type_menu > li:first-child > a").attr("fid"),host=document.domain,d="club.hihonor.com"==host?"https://"+host+"/cn/forum.php?mod=topicadmin&action=stamp&modsubmit=yes&infloat=yes&modclick=yes&inajax=1":"https://"+host+"/forum.php?mod=topicadmin&action=stamp&modsubmit=yes&infloat=yes&modclick=yes&inajax=1",$("#fastpostsubmit").after("<div style='float:right; margin-right:0;color:red'><input id='check2' type='checkbox'/>\u56DE\u590D\u76D6\u7AE0</div>"),$("#check2").attr("checked",GM_getValue("check")),$("#check2").click(()=>{GM_setValue("check",$("#check2").is(":checked"))});var f=document.createElement("div");f.innerHTML="<div id='onediv'><img height=\"20px\" width=\"20px\" src=\"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1807949605,2093571411&fm=26&gp=0.jpg\" class=\"bottom\" style='color:#9B30FF'/></div>",document.body.appendChild(f),$(".bottom").click(function(){var a=$("html,body").prop("scrollHeight");$("html,body").animate({scrollTop:a},400)}),$("#fastpostsubmit").click(()=>{if(e=html2bbcode(getEditorContents()),GM_getValue("check")){if(""!=e&&"\n"!=e)return void $.post(d,{formhash:a,fid:b,tid:c,page:1,handlekey:"mods",stamp:44,reason:""},a=>{""==$(a).find("root")[0].textContent.split("<")[0]?toastr.success("\u64CD\u4F5C\u6210\u529F\uFF01\u5DF2\u76D6\u7AE0\uFF01"):toastr.error("\u76D6\u7AE0\u5931\u8D25\uFF0C\u60A8\u6CA1\u6709\u8BE5\u677F\u5757\u6743\u9650\uFF01")},"xml");toastr.warning("\u62B1\u6B49\uFF0C\u60A8\u5C1A\u672A\u8F93\u5165\u6807\u9898\u6216\u5185\u5BB9!")}})})();
