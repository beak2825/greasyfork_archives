// ==UserScript==
// @name         FBA发货员筛选
// @version      0.2
// @description  增加Select，用来筛选对应的发货员
// @author       QHS
// @include      *fba.valsun.cn/index.php?mod=preAlertManager*
// @supportURL	 https://greasyfork.org/zh-CN/scripts/34457
// @namespace    https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/34457/FBA%E5%8F%91%E8%B4%A7%E5%91%98%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/34457/FBA%E5%8F%91%E8%B4%A7%E5%91%98%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
var fpo={};$("#slowMoving").parent().after('<li style="color:#c9aa54" class="text">\u53d1\u8d27\u4eba</li><li><select name="fulfillp" id="fulfillp" value="" style="border:1px solid #c9aa54;color:#c9aa54"><option value="">\u8bf7\u9009\u62e9...</option></select></li>');$(".w_ListTable tbody tr").each(function(){var a=$(this).children("td:last").html().match(/.*?<br>.*?<br>(.*)/i)[1];""==a&&(a="\u65e0\u53d1\u8d27\u4eba");fpo[a]=0<=fpo[a]?fpo[a]+1:1});
$.each(fpo,function(a,b){$("#fulfillp").append('<option value="'+a+'">'+a+"("+b+")</option>")});$(".w_TY_Sea").on("change","#fulfillp",function(){var a=$("#fulfillp").val();$(".w_ListTable tbody tr").each(function(){-1==$(this).children("td:last").text().indexOf(a)?$(this).hide():$(this).show()})});

})();