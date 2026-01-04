// ==UserScript==
// @name         vivo自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  vivo auto Login
// @include      https://*.yun.vivo.com.cn/*
// @include      https://yun.vivo.com.cn/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402413/vivo%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/402413/vivo%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function () {
//获取当前所有cookie
var strCookies = document.cookie;
  if (strCookies.indexOf("vivo_yun_csrftoken")==-1) {
    document.cookie="vivo_account_cookie_cloud_checksum=2d1bd7befce73bdec85be911b6598477.1592821551539;domain=.vivo.com.cn;path=/;"; 
    document.cookie="vivo_yun_csrftoken=e6df3875-b49b-41d9-958c-6462ddda35f2.1592823565486;domain=.vivo.com.cn;path=/;"; 
    document.cookie="vivo_account_cookie_iqoo_deviceid=wb_3009f0b3-8e0d-455c-8aae-1170140e35c9;domain=.vivo.com.cn;path=/;"; 
    document.cookie="vivo_account_cookie_cloud_openid=3e6284d9edc85690;domain=.vivo.com.cn;path=/;"; 
    document.cookie="vivo_account_cookie_iqoo_regioncode=CN;domain=.vivo.com.cn;path=/;";     
    location.reload();
  }
}) ();