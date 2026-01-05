// ==UserScript==
// @name 淘宝自动下单
// @namespace http://login.taobao.com
// @version 0.15
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author Richard He
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://item.taobao.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_registerMenuCommand

// @grant window.close

// @downloadURL https://update.greasyfork.org/scripts/29767/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/29767/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
'use strict';

var url = "https://haidaoteam.com/taobao/";
//    var url = "http://127.0.0.1:8000/";
var taobao_username = '九如山的山';
var taobao_passwd = 'yunji789';
var itemParam = {};
$.ajax({
type : "get",
async:false,
url : url+"get_starting_taobao_order?taobao_username="+taobao_username,
success : function(json){
    var data = JSON.parse(json);

    
    itemParam.id = data.order.id;
    itemParam.color = data.order.a_color;
    itemParam.height = data.order.a_height;
    itemParam.amount = data.order.a_amount;
    setTimeout(main,8000);
} });

//setTimeout(main,1000);
function login() {
var Iframe = $($(document.getElementsByClassName("mnl-ifr"))[0].contentDocument);
Iframe.find("#J_Quick2Static").click();

Iframe.find('#TPL_username_1').val(taobao_username);
Iframe.find('#TPL_password_1').val(taobao_passwd);
Iframe.find('#J_SubmitStatic').click(); }

function main(){
console.log(itemParam);

//var colorList = $(".J_TSaleProp.tb-img.tb-clearfix li a span");
   //document.getElementsByClassName("J_TSaleProp tb-img tb-clearfix")[0].children[0].click()
var  colorList = document.getElementsByClassName("J_TSaleProp tb-img tb-clearfix")[0].children;
for(var i = 0 ; i <  colorList.length;i++)
{
    if(colorList[i].getElementsByTagName("span")[0].innerText == itemParam.color)
    {
        colorList[i].click();
        console.log(colorList[i]);
    }
}
    /*
colorList.each(function(){
    if(itemParam.color === $(this).text())
    {
        this.parentNode.parentNode.click();
       //$(this.parentNode.parentNode).trigger("click");
    }   });*/

    var heightList = $(".J_TSaleProp.tb-clearfix li a span");
heightList.each(function(){
    if(itemParam.height === $(this).text())
    {
        $(this.parentNode.parentNode).trigger("click");
        console.log($(this));
    }
});

    $("#J_IptAmount").val(itemParam.amount);
    $("#J_juValid .tb-btn-buy a")[0].click();

    setTimeout(login,8000);

}
//console.log($(“.J_TSaleProp.tb-img.tb-clearfix li”));
})();