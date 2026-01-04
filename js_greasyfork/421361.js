// ==UserScript==
// @name         美团|饿了么外卖红包每日领
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421361/%E7%BE%8E%E5%9B%A2%7C%E9%A5%BF%E4%BA%86%E4%B9%88%E5%A4%96%E5%8D%96%E7%BA%A2%E5%8C%85%E6%AF%8F%E6%97%A5%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/421361/%E7%BE%8E%E5%9B%A2%7C%E9%A5%BF%E4%BA%86%E4%B9%88%E5%A4%96%E5%8D%96%E7%BA%A2%E5%8C%85%E6%AF%8F%E6%97%A5%E9%A2%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    

    var bo=document.getElementsByTagName("body");
    var di=document.createElement("div");

    di.innerHTML="<div id='waimaidiv' style='width:300px;height:300px;background:#cccccc;postion:flxed;position: fixed;z-index: 999999999999;top: 10px;right: 0'><div style='text-align: center;'><span style='color:red;font-size:20px'>微信扫码领取<br/>天天免费领</span><span></span><div><img style='width:100%' src='https://qiaojia.yunbao51.com/qiaojia/tujie/waimai.jpg'></div></div><div  style='text-align: center;'><span onclick=\"document.getElementById('waimaidiv').style.display='none'\">关闭</span></div></div>";
    document.body.appendChild(di);



})();
