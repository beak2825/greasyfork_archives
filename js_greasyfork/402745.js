// ==UserScript==
// @name         UC自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  UC auto Login
// @include      https://*.yun.cn/*
// @include      https://yun.cn/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402745/UC%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/402745/UC%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;
  if (strCookies.indexOf("pus")==-1) {           
	  document.cookie="__kp=ea9db080-25c5-11eb-990f-c34509d7f892;domain=.yun.cn;path=/;"; 
	  document.cookie="__pus=caa484998f37a4e6e03bb2245e1da1deAARq4nvT1KTOD3xSth85SjdsLXs/wIihRvYYoib0T5XvMJJryPZQSffSSB0PIgNGJWuL89NCOdrD82xSUkJYZJ8F;domain=.yun.cn;path=/;";     
    location.reload();
  }
}) ();