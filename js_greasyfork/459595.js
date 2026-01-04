// ==UserScript==
// @name        标点云后台title显示nav
// @namespace   Violentmonkey Scripts
// @match       https://*.admin.biaodianyun.cn/admin/*
// @grant       none
// @version     1.2
// @author      -
// @license MIT
// @description 2022/6/16 上午9:47:38
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/459595/%E6%A0%87%E7%82%B9%E4%BA%91%E5%90%8E%E5%8F%B0title%E6%98%BE%E7%A4%BAnav.user.js
// @updateURL https://update.greasyfork.org/scripts/459595/%E6%A0%87%E7%82%B9%E4%BA%91%E5%90%8E%E5%8F%B0title%E6%98%BE%E7%A4%BAnav.meta.js
// ==/UserScript==


   //每隔5秒执行一次
setInterval(function(){
  
var nTitle = $(".navMenu").text();
var nTitle = nTitle.replace(/\s*/g,"");  
var nTitle = nTitle.split("/");  

var split = ">"
  var exp2 = nTitle[2];
if (!exp2)
{
var split = "";
}
  
document.title = nTitle[0]+">"+nTitle[1]+split+nTitle[2] ;  


  
var exp = nTitle[1];
if (typeof(exp) == "undefined")
{
document.title = "北海好货";  
}
  
},3000);

