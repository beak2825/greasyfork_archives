// ==UserScript==
// @name         V2Ex自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.23
// @description  V2 auto Login
// @include      https://*.v2ex.com/*
// @include      https://v2ex.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405965/V2Ex%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405965/V2Ex%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  window.localStorage.clear();
  window.localStorage.setItem("v2ex-config","{\"bingduwang\":{\"showToolbar\":true,\"showPreviewBtn\":true,\"autoOpenDetail\":true,\"openTag\":false,\"clickPostItemOpenDetail\":false,\"closePostDetailBySpace\":true,\"contentAutoCollapse\":true,\"viewType\":\"table\",\"commentDisplayType\":0,\"newTabOpen\":true,\"base64\":true,\"sov2ex\":false,\"postWidth\":\"76vw\",\"showTopReply\":false,\"topReplyLoveMinCount\":3,\"topReplyCount\":3,\"autoJumpLastReadFloor\":false,\"rememberLastReadFloor\":false,\"autoSignin\":true}}");
  var strCookies = document.cookie;
  if (strCookies.indexOf("A2")==-1) {
    window.localStorage.clear();
    window.localStorage.setItem("v2ex-config","{\"bingduwang\":{\"showToolbar\":true,\"showPreviewBtn\":true,\"autoOpenDetail\":true,\"openTag\":false,\"clickPostItemOpenDetail\":false,\"closePostDetailBySpace\":true,\"contentAutoCollapse\":true,\"viewType\":\"table\",\"commentDisplayType\":0,\"newTabOpen\":true,\"base64\":true,\"sov2ex\":false,\"postWidth\":\"76vw\",\"showTopReply\":false,\"topReplyLoveMinCount\":3,\"topReplyCount\":3,\"autoJumpLastReadFloor\":false,\"rememberLastReadFloor\":false,\"autoSignin\":true}}");
    //document.cookie="__cfduid=NTE5Njk4MjktOGFmYS00YzFlLWEyOTktYTMwOTY3Mzk1NThj;domain=.v2ex.com;path=/;";
    document.cookie="A2=\"2|1:0|10:1757428146|2:A2|48:NTE5Njk4MjktOGFmYS00YzFlLWEyOTktYTMwOTY3Mzk1NThj|ca42560e08afc453d0936e65aa7316f0e05ea9c3b5b34c928c4f23c2dabdbf6f\";domain=.v2ex.com;path=/;";
    //document.cookie="PB3_SESSION=\"2|1:0|10:1592700226|11:PB3_SESSION|40:djJleDoxMTkuMjguMTM0LjIwNjo1NDE1MDg5NQ==|88001c01fb6408df6a8d3dbdbf4ac9bc3dc6326452d72aa102972516a8073c94\";domain=.v2ex.com;path=/;";
    //document.cookie="V2EX_LANG=zhcn;domain=.v2ex.com;path=/;";
    document.cookie="V2EX_TAB=\"2|1:0|10:1757428147|8:V2EX_TAB|8:dGVjaA==|7ad3d0780cb0893372ed01586ef33c0b138389db0aac7e373b50a758c084ff89\";domain=.v2ex.com;path=/;";
    location.reload();
  }
}) ();
