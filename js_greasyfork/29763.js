// ==UserScript==
// @name buy.taobao.com 处理
// @namespace http://login.taobao.com
// @version 0.16
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author Richard He
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://buy.taobao.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js

// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_registerMenuCommand

// @grant window.close
// @grant window
// @downloadURL https://update.greasyfork.org/scripts/29763/buytaobaocom%20%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/29763/buytaobaocom%20%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
'use strict';


var url = "https://haidaoteam.com/taobao/";
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
    itemParam.province = data.order.a_province;
    itemParam.city = data.order.a_city;
    itemParam.district = data.order.a_district;
    itemParam.street = data.order.a_street;
    itemParam.addr = data.order.a_addr;
    itemParam.name = data.order.a_name;
    itemParam.mobile = data.order.a_mobile;
    setTimeout(main,2000);
} });
function main(){

   console.log($(".modify"));
    $(".modify")[0].click();
   setTimeout(setAddr,2000);
}

function setAddr(){
    //console.log($(".bf-select.bf-cn-select.lSelect.select-node.J_Modify.J_CnCity"));
    //$(".bf-select.bf-cn-select.lSelect.select-node.J_Modify.J_CnCity")[0].click();
    var addAddrIframe = $($(document.getElementsByClassName("add-addr-iframe"))[0].contentDocument);
    addAddrIframe.find("#city-title").click();
   setTimeout(setAddrHelper,2000);

}

function setAddrHelper(){
    var addAddrIframe = $($(document.getElementsByClassName("add-addr-iframe"))[0].contentDocument);
     var provinceList = addAddrIframe.find(".city-select.city-province dl dd a");
   provinceList.each(function(){
       if(itemParam.province === $(this).text())
    {
        console.log($(this));
        $(this)[0].click();
        console.log($(this).text());
    }
   });
   var cityList = addAddrIframe.find(".city-select.city-city dl dd a");
    cityList.each(function(){
       if(itemParam.city === $(this).text())
    {
        console.log($(this));
        $(this)[0].click();
        console.log($(this).text());
    }
   });

   var districtList =  addAddrIframe.find(".city-select.city-district dl dd a");
    districtList.each(function(){
    if(itemParam.district === $(this).text())
    {
        console.log($(this));
        $(this)[0].click();
        console.log($(this).text());
    }
    });
    setTimeout(setAddrHelper1,2000);


}

function setAddrHelper1(){
    var addAddrIframe = $($(document.getElementsByClassName("add-addr-iframe"))[0].contentDocument);
    var streetList =  addAddrIframe.find(".city-select.city-street dl dd a");
    console.log(streetList);
    streetList.each(function(){
        console.log( $(this).text() );
    if(itemParam.street === $(this).text())
    {
        console.log($(this));
        $(this)[0].click();
        console.log($(this).text());
    }
    });

    var addr = addAddrIframe.find("#J_Street");
    addr.val(itemParam.addr);

    var name = addAddrIframe.find("#J_Name");
    name.val(itemParam.name);

    var mobile = addAddrIframe.find("#J_Mobile");
    mobile.val(itemParam.mobile);

    addAddrIframe.find("#J_FormDeliver div button").click();
    var el = document.getElementsByClassName('text-area-input memo-input');
    el[0].value ="ddd";
    el[0].innerText = "dd";
    el[0].innerHTML = "dd";
    el[0].placeholder = "ddddcc";
    console.log("end");
    setTimeout(submit,8000);
}

    function submit()
    {
       // $("#submitOrder_1 div a")[0].click();
       //document.getElementsByClassName("
        var xPos;

var yPos;

window.document.onmousemove=function(evt){

 evt=evt || window.event;

 if(evt.pageX){

  xPos=evt.pageX;

  yPos=evt.pageY;

 } else {

  xPos=evt.clientX+document.body.scrollLeft-document.body.clientLeft;

  yPos=evt.clientY+document.body.scrollTop-document.body.clientTop;

 }

};

function initMouseEventDM()

{

  var eo=document.getElementsByClassName('go-btn')[0];

  if( window.outerWidth == undefined )

  {

    eo.fireEvent("onclick");

  }

  else

  {

    var vo = document.createEvent("MouseEvent");
console.log(unsafeWindow);
    vo.initMouseEvent("click", true, true, unsafeWindow, 0, 0, 0, 11, 22, true, false, false, false, 0, null);

    eo.dispatchEvent( vo );

  }

}
initMouseEventDM();
    }
    //console.log($(".J_TSaleProp.tb-img.tb-clearfix li"));
})();