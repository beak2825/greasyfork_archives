// ==UserScript==
// @name         吾爱破解自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.4
// @description  52pojie auto Login
// @match       https://www.52pojie.cn/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405964/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405964/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;
  if (strCookies.indexOf("isLogin")==-1) {
    document.cookie="isLogin=true;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_connect_is_bind=0;domain=www.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lastact=1711297748%09home.php%09spacecp;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_ulastactivity=1711296760%7C0;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_lastcheckfeed=574335%7C1711296760;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_auth=92f5F5aQKOMLPJ3ELGxp8fe3kynx1AJtBYPqj1bmG7JP7bQqA9CfgDOFQ2Z2%2BvWM%2FFHnBpbjtzuvvEeAUMX1gWlHHRY;domain=www.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lastvisit=1711293150;domain=www.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lip=183.195.31.176%2C1711296760;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_nofavfid=1;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_noticonf=574335D1D3_3_1;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_saltkey=wUVMx9mc;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_seccodecS=1073718.63127594f8849ff923;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_seccodecSUaM=1073719.4e92764072f76a83b6;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_sid=0;domain=www.52pojie.cn;path=/;";
    document.cookie="htVC_2132_ttask=574335%7C20240325;domain=www.52pojie.cn;path=/;";
    document.cookie="wzws_sessionid=gmRiMWNhYYEyYzdjZmSgZgBQ9IAxODMuMTk1LjMxLjE3Ng==;domain=www.52pojie.cn;path=/;";

    //document.cookie="__gads=ID=df5a2f6a435ccf1f-22626705ead1004f:T=1649599234:RT=1649599234:S=ALNI_MaPB6gYv9SxW67fETFJzOydT6a-Tw;domain=.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lastvisit=1649593369;domain=www.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lastact=1649599908%09home.php%09spacecp;domain=www.52pojie.cn;path=/;";
    //document.cookie="htVC_2132_lip=114.67.65.24%2C1649599288;domain=www.52pojie.cn;path=/;";
    location.reload();
  }
}) ();