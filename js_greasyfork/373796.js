// ==UserScript==
// @name         京东抢购
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wqdeal.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373796/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/373796/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD.meta.js
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

var jiage=$("#pageTotalPrice").html().replace(/[^\d.]/g,'');
var ss=Number(jiage);
//这里定义间隔时间（单位：秒），不要太快。

 
      if(tim >='072059' ){

 //     window.location.href = "https://wqs.jd.com/order/s_confirm_miao.shtml?sceneval=2&bid=&scene=jd&isCanEdit=1&EncryptInfo=&Token=&commlist=,,1,766339&weight=";

 if(ss < 4100.00){
 $("#btnWxH5Pay").click();
		  clearInterval(t1);
	}        
		}
  
},1000);
    // Your code here...
})();