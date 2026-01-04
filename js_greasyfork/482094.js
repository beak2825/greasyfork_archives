// ==UserScript==
// @name         抖音自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.25
// @description  douyin auto Login
// @match       *://*.douyin.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482094/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482094/%E6%8A%96%E9%9F%B3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
   //获取当前所有cookie
  var strCookies = document.cookie;
  var sessionid = "9dac6a8ef7aa5cd0b9615938a032fb9b";
  if (strCookies.indexOf(sessionid)==-1) {
    window.localStorage.setItem("douyin_web_hide_guide","1");
    window.localStorage.setItem("player_nextautoplay","\"1\"");
    window.localStorage.setItem("player_volume","1");
    window.localStorage.setItem("showPageFullScreenGuide","false");
    document.cookie="HideTitleNotice=true;domain=.douyin.com;path=/;";
    document.cookie="sessionid="+sessionid+";domain=.douyin.com;path=/;";
    document.cookie="sessionid_ss="+sessionid+";domain=.douyin.com;path=/;";
    document.cookie="sessionid="+sessionid+";domain=."+location.host+";path=/;";
    document.cookie="sessionid_ss="+sessionid+";domain=."+location.host+";path=/;";
    document.cookie="sessionid="+sessionid+";domain="+location.host+";path=/;";
    document.cookie="sessionid_ss="+sessionid+";domain="+location.host+";path=/;";
    document.cookie="ttwid=1%7CfDofJNWdEdwERieH9HrluaSjfqA2FVXLNXw7cZJJTGU%7C1702950421%7C74a61d649a35bc0667a9a5092a9de60058c1af68f9623fd4574cdbdb3b4dd7c1;domain="+location.host+";path=/;";
    document.cookie="ttwid=1%7CfDofJNWdEdwERieH9HrluaSjfqA2FVXLNXw7cZJJTGU%7C1702950421%7C74a61d649a35bc0667a9a5092a9de60058c1af68f9623fd4574cdbdb3b4dd7c1;domain=."+location.host+";path=/;";
    document.cookie="SEARCH_RESULT_LIST_TYPE=%22multi%22;domain="+location.host+";path=/;";
    document.cookie="SEARCH_RESULT_LIST_TYPE=%22multi%22;domain=."+location.host+";path=/;";
    location.reload();
  }
}) ();