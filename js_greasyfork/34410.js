// ==UserScript==
// @name         FBA批量拉取Title
// @version      0.2
// @description  增加FBA批量拉取Title的按钮，直接使用即可
// @author       QHS
// @include      *fba.valsun.cn/index.php?mod=preAlertManager*
// @supportURL	 https://greasyfork.org/zh-CN/scripts/34410
// @namespace    https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/34410/FBA%E6%89%B9%E9%87%8F%E6%8B%89%E5%8F%96Title.user.js
// @updateURL https://update.greasyfork.org/scripts/34410/FBA%E6%89%B9%E9%87%8F%E6%8B%89%E5%8F%96Title.meta.js
// ==/UserScript==

(function() {
    'use strict';


$("#caculatePreAlert").parent().after('<li><input type="button" value="\u6279\u91cf\u62c9\u53d6Title" class="Sea_Green bulkbtn" id="titleBulk" style="background:#c9aa54"></li>');
$("#search_form").on("click",".bulkbtn",function(){function e(a,b){var d;void 0===b&&(b=!0);d=b?"error":"success";$(document).plugPrompt({contents:a,type:d,delay:1E3})}function b(a){0<$(".w_page pre").length?$(".w_page pre").append("\t"+a):$(".w_page").append("<pre>\t"+a+"</pre>")}var c=$(".sku:checked");if(0==c.length)return e("\u8bf7\u5148\u9009\u62e9\u9700\u64cd\u4f5cSKU"),!1;if(1==c.length)return e("\u53ea\u9009\u4e00\u4e2a\u4e5f\u597d\u610f\u601d\u7528\u6211\uff1f"),!1;$(".w_page pre").html("");
$("#titleBulk").removeClass("bulkbtn");$("#titleBulk").css({background:"#aeaba5",cursor:"not-allowed"});$("#titleBulk").attr("value","\u6279\u91cf\u62c9\u53d6\u4e2d\u3002\u3002\u3002");var d=[],f=[],g=0;b("<font style=color:#30cc1d>\u83b7\u53d6\u4e2d...</font><br>");c.each(function(a){""!=$(this).attr("index")?(d[a]=$(this).attr("index"),f[a]=$(this).data("sku"),b(a+1+"\tid:"+d[a]+"\tsku:"+f[a]+"<br>")):b(c.data("sku")+"\u7684id\u4e3a\u7a7a\uff0c\u8df3\u8fc7")});b("<font style=color:#30cc1d>\u83b7\u53d6\u5b8c\u6210\uff0c\u5f00\u59cb\u6267\u884c\u62c9\u53d6</font><br>");
$.each(d,function(a){$.post("json.php?mod=fbxAsyn&act=getMatchingProductForId&jsonp=1",{id:d[a]},function(c){"200"==c.errCode?b(a+1+"\t"+c.errMsg,"success"):b(a+1+"\t"+c.errMsg,"error");++g===d.length&&(b("<font style=color:#30cc1d>\u6293\u53d6\u5b8c\u6210</font><br>"),$("#titleBulk").addClass("bulkbtn"),$("#titleBulk").css({background:"#c9aa54",cursor:"pointer"}),$("#titleBulk").attr("value","\u6279\u91cf\u62c9\u53d6Title"))},"json")})});

})();