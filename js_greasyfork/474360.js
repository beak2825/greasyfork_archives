// ==UserScript==
// @name         自动验证谷歌流量异常页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动验证
// @author       You
// @match        https://www.google.com/sorry/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_cookie
// @license           MIT

// @downloadURL https://update.greasyfork.org/scripts/474360/%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81%E8%B0%B7%E6%AD%8C%E6%B5%81%E9%87%8F%E5%BC%82%E5%B8%B8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/474360/%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81%E8%B0%B7%E6%AD%8C%E6%B5%81%E9%87%8F%E5%BC%82%E5%B8%B8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
 var intervalID;
 let i;
 var count=0;
  function emulateMouseClick (element) {
  // 创建事件
  var event = document.createEvent('MouseEvents')
  // 定义事件 参数： type, bubbles, cancelable
  event.initEvent('click', true, true)
  // 触发对象可以是任何元素或其他事件目标
  element.dispatchEvent(event)
}
   

$(document).keyup(function (event) {
     exec();
});
    function exec(){
     console.log("press")
      i=document.getElementsByTagName("iframe")[0];

      if(i!=null){
		let elem=i.contentWindow.document.getElementById("recaptcha-anchor");
        if(elem!=null){
        elem.addEventListener('click', function (e) {
        console.log('success')}, false)
        emulateMouseClick(elem);
       
	}
      }
        if(count>=15){
        count=0;
        clearInterval(intervalID);
        console.log("end")
        }else{ console.log("i= "+i);count++;}
    }
     intervalID=window.setInterval(exec,500);
})();


