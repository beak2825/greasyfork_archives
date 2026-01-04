// ==UserScript==
// @name         MGTV自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.3
// @description  MGTV auto Login
// @match   	https://www.mgtv.com/*
// @author       wujixian
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405962/MGTV%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405962/MGTV%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  delete window.RTCPeerConnection
	delete window.mozRTCPeerConnection
	delete window.webkitRTCPeerConnection
	delete window.RTCDataChannel
	delete window.DataChannel
 //获取当前所有cookie
 var strCookies = document.cookie;
 if (strCookies.indexOf("uuid") == -1) {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
   for (var i = keys.length; i--;)
    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
    document.cookie="HDCN=0ACDAD9D512C3633B1E1247E26142D16-737783364;domain=.mgtv.com;path=/;"
  document.cookie="MQGUID=1519525225300148224;domain=.mgtv.com;path=/;"
  document.cookie="PHPSESSID=dp10h8fopurivpi2bc7r4hfoi4;domain=i.mgtv.com;path=/;"
  document.cookie="PLANB_FREQUENCY=YmoQW46f-znMpp4f_22042811;domain=.mgtv.com;path=/;"
  document.cookie="PM_CHKID=73fa244fe48eb0b4;domain=.mgtv.com;path=/;"
  document.cookie="__MQGUID=1519525225300148224;domain=.mgtv.com;path=/;"
  document.cookie="__STKUUID=1b68b020-103e-4b2b-9abe-806619ebe771;domain=.mgtv.com;path=/;"
  document.cookie="_source_=B;domain=.mgtv.com;path=/;"
  document.cookie="adPrivacy=0;domain=.mgtv.com;path=/;"
  document.cookie="beta_timer=1651118730583;domain=.mgtv.com;path=/;"
  document.cookie="finger=9d99bb1fbf494d9fa69598a3448d95a2;domain=.mgtv.com;path=/;"
  document.cookie="id=32800212;domain=.mgtv.com;path=/;"
  document.cookie="isShowUserPop=1;domain=.mgtv.com;path=/;"
  document.cookie="lastActionTime=1651119052228;domain=.mgtv.com;path=/;"
  document.cookie="loginAccount=QQ_aha8TnPBkSXA;domain=.mgtv.com;path=/;"
  document.cookie="mba_deviceid=4ce2187b-e229-63e2-3707-6c6a48ad6a73;domain=.mgtv.com;path=/;"
  document.cookie="mba_last_action_time=1651119031668;domain=.mgtv.com;path=/;"
  document.cookie="mba_sessionid=4420e320-ea7f-0bc6-4c3f-0253fef05562;domain=.mgtv.com;path=/;"
  document.cookie="rnd=rnd;domain=.mgtv.com;path=/;"
  document.cookie="sessionid=1651118169685;domain=.mgtv.com;path=/;"
  document.cookie="uuid=18812c1002d54b0288cdd98ca3e01b60;domain=.mgtv.com;path=/;"
  document.cookie="vipStatus=1;domain=.mgtv.com;path=/;"
  document.cookie="wei=d3d35ac7f955b6f9cb4996c387c43c36;domain=.mgtv.com;path=/;"
  document.cookie="wei2=1b07lZwqOhaZxtAZtThHbxCRCt%2BQWOQjwUkDC1NtD1W2OgwLv5JSsHDKk6x04qY2XCTpGWTWzXsVTDxRciU8OaeGKl5NIXhQjrajsIKu2T4P8yS7Kl7h%2BobVdvg0MdcTwkFeh7RN5n3RrQ1tgvoCD96fICBq73JhFDIZVTqU%2Fp4RK%2BJW4UpFLmdJ0GS6SMo1HQNiWiG1fhx%2BsxE;domain=.mgtv.com;path=/;"

  document.cookie="NUC_STATE=1630319105.GVMFdSyHXYJS39OSsB0POh621ro;domain=.mgtv.com;path=/;"
  document.cookie="anuncioOpenID=9B0ACE6A-9CED-4038-B436-44427E39918F;domain=.mgtv.com;path=/;"
  document.cookie="yy_tips_19696=1;domain=.mgtv.com;path=/;"
  document.cookie="iwt_uuid=bebcd531-1468-4fe7-8ca4-628fe431c516;domain=.mgtv.com;path=/;"
  document.cookie = "WWW_LOCALE=CN;domain=.mgtv.com;path=/;"


 }
})();
