// ==UserScript==
// @name         牛客自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  nowcoder auto Login
// @include      https://*.nowcoder.com/*
// @include      https://nowcoder.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399070/%E7%89%9B%E5%AE%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/399070/%E7%89%9B%E5%AE%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;
  if (strCookies.indexOf("t")==-1) {    
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	  if (keys) {
		  for (var i = keys.length; i--;)
			  document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
	  }
    document.cookie="gr_user_id=bef26a24-1a9c-49c6-88fd-d03f57b607ee;domain=.nowcoder.com;path=/;";
    document.cookie="t=F5107E4A06F60292026A4F636C6DD15E;domain=.nowcoder.com;path=/;";
    location.reload();
  }        
}) ();