// ==UserScript==
// @name        DMM_areapass
// @name:en     DMM_areapass
// @name:zh-TW  DMM_areapass
// @name:zh-CN  DMM_areapass 
// @namespace   9nice
// @match       *://*.dmm.com/*
// @match       *://*.dmm.co.j*/*
// @grant       none
// @version     3.3
// @author      9nice
// @description Unblock DMM area check
// @description:en Unblock DMM area check
// @description:zh-TW Unblock DMM area check
// @description:zh-CN Unblock DMM area check
// @supportURL   none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496181/DMM_areapass.user.js
// @updateURL https://update.greasyfork.org/scripts/496181/DMM_areapass.meta.js
// ==/UserScript==

(function (){
  var Days = 365; //此 cookie 将被保存 365 天
  var exp  = new Date();//new Date("December 11, 1111");
  exp.setTime(exp.getTime() + Days*24*60*60*1000);

  document.cookie="ckcy_remedied_check=ec_mrnhbtk;path=/;domain=.dmm.com;expires="+ exp.toGMTString();
  document.cookie="ckcy=1;path=/;domain=.dmm.com;expires="+ exp.toGMTString();

  document.cookie="ckcy_remedied_check=ec_mrnhbtk;path=/;domain=.dmm.co.jp;expires="+ exp.toGMTString();
  document.cookie="ckcy=1;path=/;domain=.dmm.co.jp;expires="+ exp.toGMTString();

})();
