// ==UserScript==
// @name        快猫- kmkk95.com
// @namespace   Violentmonkey Scripts
// @match       http*://www.kmkk*.com/videoContent/*
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @license MIT
// @grant       none
// @version     1.0
// @author      -
// @description 2023/9/2 上午3:24:02
// @downloadURL https://update.greasyfork.org/scripts/474380/%E5%BF%AB%E7%8C%AB-%20kmkk95com.user.js
// @updateURL https://update.greasyfork.org/scripts/474380/%E5%BF%AB%E7%8C%AB-%20kmkk95com.meta.js
// ==/UserScript==
//
// &time=2&segments=12

const originalOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

    if(url.indexOf(".m3u8") > -1){
      url = url.replace("&time=2&segments=12","")
    }
    originalOpen.apply(this, arguments);
};


setInterval(() => {
  var a = $("#videoContent > div.video > div > div.userStatusBg.split > div.unLoginBox > div > a:nth-child(2)")
  if(a.length !== 0){
    a[0].click()
  }
},1000)