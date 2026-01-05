// ==UserScript==
// @name 阿里妈妈自动获取
// @namespace http://login.taobao.com
// @version 0.14
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author Richard He
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://pub.alimama.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
// @grant window.close

// @downloadURL https://update.greasyfork.org/scripts/29769/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/29769/%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
'use strict';

var rate_list = [];
var price = 0;
Array.max = function( array ){ return Math.max.apply( Math, array ); };
Array.min = function( array ){ return Math.min.apply( Math, array ); };
function login()
{
$(window.frames[1].document)[0].getElementById('J_Quick2Static').click();
$(window.frames[1].document)[0].getElementById('TPL_username_1').value = "scudongchao14771446";
$(window.frames[1].document)[0].getElementById('TPL_password_1').value = "dc19891219";
$(window.frames[1].document)[0].getElementById('J_SubmitStatic').click();
}

function getSku()
{
var href = decodeURIComponent(window.location.href);
var parm = href.split("id=")[1];
var sku = parm.split("&")[0];
return sku;
// https://detail.tmall.com/item.htm?id=546386617639&spm=a219t.7900221/19.1998910419.d9a1dac8eqqhd.OvesIX
}

function addClose()
{
    var d = document;
    var div = d.createElement('div');
    div.id = 'dashboard';
    div.innerHTML = " <input id='clos' type='button' value='关闭设置' onclick=\"window.close();\"></input> ";
    d.body.appendChild(div);
} function getDingxiangRate(){

$("#J_global_dialog table tbody tr").each(function(){
var rate=$(this).find("td:eq(1)").text();
var type = $(this).find("td:eq(2)").text();
if(type !== "人工")
{
    rate_list.push(parseFloat(rate.replace("%","")));
}
});
    console.log(rate_list);
    console.log(Array.max(rate_list));
    console.log(price);
    console.log(getSku());
    window.close();
}

function main(){ if($("#J_menu_login").is(":hidden")) {
//已经登录
//首先获取sku
//价格
   
price = $(".fl.color-d.number.number-16").find(".integer").text() + "." + $(".fl.color-d.number.number-16").find(".decimal").text();
var rate = $(".fl.color-brand span.number.number-16").find(".integer").text() + "." + $(".fl.color-brand span.number.number-16").find(".decimal").text();
rate_list.push(parseFloat(rate));
//佣金比例
$(".pubfont.icon-gengduoyongjin").click();
setTimeout(getDingxiangRate,2000);
}else
{
$("#J_menu_login").click();
setTimeout(login,2000);

}
}
setTimeout(main,5000);
})();