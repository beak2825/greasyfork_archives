// ==UserScript==
// @name        线报酷自动开启推送
// @namespace   线报酷扩展空间
// @match       https://www.xianbaoku.net/*
// @match       https://*.xianbao.fun/*
// @match       http://*.xianbao.fun/*
// @match       http://*.ixbk.fun/*
// @match       https://*.ixbk.fun/*
// @match       http://*.ixbk.net/*
// @match       https://*.ixbk.net/*
// @match       http://*.aixbk.fun/*
// @match       https://*.aixbk.fun/*
// @match       http://*.aixbk.net/*
// @match       https://*.aixbk.net/*
// @match       https://www.52pojie.cn/*
// @version     0.0
// @author      线报酷
// @description 用来开启用户中心高级函数，解决部分浏览器禁用通知权限问题，解决微信推送跨域问题
// @connect      weixin.qq.com
// @connect      dingtalk.com
// @connect      day.app
// @connect      127.0.0.1
// @homepageURL  http://new.xianbao.fun/jiaocheng/505211.html
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/500402/%E7%BA%BF%E6%8A%A5%E9%85%B7%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E6%8E%A8%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/500402/%E7%BA%BF%E6%8A%A5%E9%85%B7%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E6%8E%A8%E9%80%81.meta.js
// ==/UserScript==
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_info = GM_info;



(function () {
  //#mainbox > div.mianbaoxie > a > button
  console.log("13");
  x = document.querySelector("#mainbox > div.mianbaoxie > a  > button").innerText;
  console.log(x);
  if (x == "开启推送") {
      document.querySelector("#mainbox > div.mianbaoxie > a  > button").click();
      console.log("推送已开启：" + x);
   }





})();