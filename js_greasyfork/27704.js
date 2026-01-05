// ==UserScript==
// @name           DBD_Robot
// @description  夺宝岛自动加价拍
// @include        http*://dbditem.jd.com/*
// @author         Feng
// @copyright      Feng
// @namespace   DBD_Robot
// @version        2016.09.12
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/27704/DBD_Robot.user.js
// @updateURL https://update.greasyfork.org/scripts/27704/DBD_Robot.meta.js
// ==/UserScript==


$(function(){
  
  var html="<br/><br/><br/><br/>现价:<input id='price_now' type='text' value='' /><br/>起价:<input id='price_from' type='text' value='1' /><br/>最高:<input id='price_to' type='text' value='1' />"
  $("#auction3dangqianjia").hide();
  var curprice=$("#auction3dangqianjia").html();
  $("div.auction_btn").append(html);
  $("#price_now").val(curprice);
  

});


    