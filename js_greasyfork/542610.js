// ==UserScript==
// @name         CHT IPShow & CPS2 & OTP 警示窗口關閉
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  IPShow & CPS2 提示窗口關閉 & OTP 警示窗口關閉
// @author       Shanlan
// @match        https://am.cht.com.tw/asdk/IPShow.jsp?IPShow=*
// @match        https://masis.cht.com.tw/IV_NET/rptPrint.aspx?rptId=*
// @match        https://cps2.cht.com.tw/CPS2WebProcess/LogOutHint.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542610/CHT%20IPShow%20%20CPS2%20%20OTP%20%E8%AD%A6%E7%A4%BA%E7%AA%97%E5%8F%A3%E9%97%9C%E9%96%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542610/CHT%20IPShow%20%20CPS2%20%20OTP%20%E8%AD%A6%E7%A4%BA%E7%AA%97%E5%8F%A3%E9%97%9C%E9%96%89.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const url = location.href;
  if(url.includes("am.cht.com.tw/asdk/IPShow.jsp?IPShow=")){
    window.addEventListener('load', () => {
      window.onbeforeunload = null;
      window.close();
    });
  }
  else if(url.includes("masis.cht.com.tw/IV_NET/rptPrint.aspx?rptId=") ||
          url.includes("cps2.cht.com.tw/CPS2WebProcess/LogOutHint.aspx")){
    window.close();
  }
  else if(url.includes("am.cht.com.tw/NIASLogin/faces/CHT")){
    if(window.jQuery){
      $(function(){
        window.onPageLoad = function(){};
      });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        window.onPageLoad = function(){};
      });
    }
  }
})();