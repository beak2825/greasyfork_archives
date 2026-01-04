// ==UserScript==
// @name         京东提交支付
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://pay.m.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373621/%E4%BA%AC%E4%B8%9C%E6%8F%90%E4%BA%A4%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/373621/%E4%BA%AC%E4%B8%9C%E6%8F%90%E4%BA%A4%E6%94%AF%E4%BB%98.meta.js
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

var jiage=$(".btn.pay-next.confirm-pay").html().replace(/[^\d.]/g,'');
var ss=Number(jiage);
//这里定义间隔时间（单位：秒），不要太快。

 
      if(tim >='072059' ){
//var zf=document.getElementsByClassName('oh_btn bg_red');
      
//zf[0].click();
 if(ss < 2765.00){
 $('.confirm-pay').trigger('touchend');
		  clearInterval(t1);
	}        
		}
  
},1000);
    // Your code here...
})();