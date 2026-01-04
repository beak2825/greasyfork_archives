// ==UserScript==
// @name        京东提交订单
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match       https://wqs.jd.com/order/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373622/%E4%BA%AC%E4%B8%9C%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373622/%E4%BA%AC%E4%B8%9C%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
var t1 = setInterval(function()  {
var date = new Date();
var hour = date.getHours();
if(hour < 10) {
hour = '0' + hour;
}
var minutes = date.getMinutes();
if(minutes < 10) {
minutes = '0' + minutes;
}
var second = date.getSeconds();
if(second < 10) {
second = '0' + second;
}
var tim =  hour + "" + minutes + "" + second;
//document.write(tim);

//var jiage=$(".btn.pay-next.confirm-pay").html().replace(/[^\d.]/g,'');
//var ss=Number(jiage);
//这里定义间隔时间（单位：秒），不要太快。

   if(tim >='071858' ){

var zf=document.getElementsByClassName('oh_btn bg_red');

zf[0].click();
// if(ss < 2760.00){
// $('.confirm-pay').trigger('touchend');
		  clearInterval(t1);
//	}
		}
 
},1000);
    // Your code here...
})();