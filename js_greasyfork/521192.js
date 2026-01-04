// ==UserScript==
// @name               Bing净化增强
// @name:zh-TW         Bing凈化增強
// @name:en            BingEnhance
// @namespace          https://github.com/GangPeter/pgscript
// @version            1.0.5
// @author             GangPeter
// @description        去除Bing广告、拦截弹窗、修复布局、支持PC端|移动端
// @description:zh-TW  去除Bing廣告、攔截彈窗、修復布局、支持PC端|移動端
// @description:en     Remove Bing ads
// @license            None
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAAEEfUpiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEYklEQVR4nLyX62+TVRzH+RsUlY3LGNTBLmVdt67rU2Cwiw4l27ICIrgAUZAXBEeWGAKJEllCvGAMGt0bIuqLxRETFRMTFTauTnCDjfXC7rMdtbfnWee6sov7es7Dzvp0fZ5n3UJ98Vmy0/P8zvf8zvldzhIAS6SIf0yN44gayDsTFgdSOlyPRzU7nHj5UhDrD7ijv1e3kXZrVByctbHxw0BkgGL+OQyKrE2K8fwkRC4D2VcnotegZB8VQGH/J73eGb2ExQZYWiex/acRFH48HGtBCVWBURuXbj5mAtuB6JQr01h/MxTrKebxDdfGkdTmh9HWF9nF3C1q3uxBRdeDyITSi2FQ91ZcC6Pkgh+5b/uwv2eOH3Z1TqOSTHjhaz5KbJTijZdDoJgJ8/lH1gD3wyNIWbCBgm/GIUV0ITn8fOK6uAzkn5uAFDaub5pC5vUwVv8xjKfb/1b2gf7EKKSw8YwbY0i5LWBpuxta6yBKHd3ylynzgBdS2PiW814UnPFAWzOElN192NNtU76NJZ/6kG7pwUsNQfHY6PUt/YrH5rMCjCcEZB1SOUZGecc0qlqnZg2UEANxOXExPNmLxAKPwikEYGJvIotstQhXNaB0leM2MJv8JCnEQOIgt+lfZF2X39K8sZBHPqaZdB1JzsmtfqzsGFK+SCw3SXOUvnkKGTdIIN0exlMkFjI7B5UNKAXT87//g2VtPqTed8Fk70P5TD6LMcCS39wkSMmoHcDyV+0oauvGbqVgkovGkgY/Np3zIPekG2lv/IWkSgf29VjlDWTtcYnZlbH911GUNQaw9XOSp0/5oT3igWavU9kHOxzAhup+5Nc4UdUygfLfRrHtIo+iL3iYTwvQ18RGZcy57rJNY2f71IyBEDEgoLheAHc6OP89YFgkBsqIgbhvopTNzSSsmx7DEeKJi8Wg+IP5lzHIwRH+FwHcJZKTFDAREi7A9B1JSSokXkADWUiFhAsouDABNdg8sXUg0LRJM18OSV5PRICxnuRkFdg82rewnJ3TPAkt6fDSSSehIQlw1R0Bz931qQpS/MFw9hHUkM6li+uuTopFI/3mGNa2jGDlHR7P3vViWcdDaO47obMOyApRFJB7KgQ15s6ni9Pmd01LECv+DOCZex4kk+KT1umE3jaAQnvvwgTk1I5ADaXvlrcGsJQsvuKWC2u+70WerR9bHKTVetAFSxdJ1vEK0B4OQA25b7hP3Mire4js4y6kHxlE6r5eJFscSH3Lip1ddrzWbY1fgK7Gi3V73YqweWU/BvHit34Uf+lH4Wc+cO/7YHjHC12tBxmHyflXO7HK0odqmcVVBVC21vmwtqIfqeURNJX94I4NiY0nLXf08bitkScdLK2bAWz6iIfpPR6G4zx0R/3IOuiF4d3oGhq3gAo78AqBlkj6yqFlkr74aKVjAmj3S2subaGL63nxJWiuG4bxZBD6Y5FX4aIEMKqsZHFZAaEZAQJ5fgkoInXb+MH8iy5YQCL5DwAA//82AwLsAAAABklEQVQDAFg3n0+JRXXiAAAAAElFTkSuQmCC
// @homepageURL        https://github.com/GangPeter/pgscript
// @supportURL         https://github.com/GangPeter/pgscript
// @match              *://*.bing.com/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/521192/Bing%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521192/Bing%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const o=document.createElement("style");o.textContent=n,document.head.append(o)})(" #id_l,#id_d,#id_rh_w,#id_rfob,#id_rfoc,#id_qrcode,#id_mobile,#id_qrcode_popup_positioner,#sb_feedback,#footer,#sa_pn_block{display:none!important}#sb_form_c>div>span{display:none!important}#HBContent>div>div.hb_sect_container:has(div.hb_section_nohover){display:none!important}#vs_cont>div.mc_caro>div.hp_trivia_outer{display:none!important}#vs_cont>div.mc_caro>div>div.musCardCont{display:none!important}#vs_cont>div.mc_caro_newmuse.five_col{display:none!important}#vs_cont>div.mc_caro>div>div>div.icon_text{display:none!important}#vs_cont>div.mc_caro>div>div>div.nav{display:none!important}#vert_iotd,#vert_images,#vert_otd,#vsrewds,#vs_default{display:none!important}#vs_cont>div.mc_caro.five_col_new{display:none!important}#vs_cont>div.vs{display:none!important}#headCont>nav{display:none!important}#b_context>li.b_ad{display:none!important}#b_results>li.b_ad{display:none!important}#adstop_gradiant_separator{display:none!important}div.b_hPanel:has(#bingApp_area){display:none!important}#id_mobpoppos,#b_footer{display:none!important}#main>ul:has(#data-from){display:none!important}#main>footer{display:none!important}#b_content>div.aca_contact{display:none!important}.vs_cont .moduleCont .module{padding:0!important}#b_results>li.b_algo{margin-top:0!important} ");

(function () {
  'use strict';

  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2["Debug"] = "DEBUG";
    LogLevel2["Info"] = "INFO";
    LogLevel2["Warn"] = "WARN";
    LogLevel2["Error"] = "ERROR";
    return LogLevel2;
  })(LogLevel || {});
  function PGLOG(level, funName, message) {
    const now = /* @__PURE__ */ new Date();
    const time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const logMessage = `${time} [${funName}|${level}]: ${message}`;
    console.log(logMessage);
  }
  const FUNNAME = "Bing增强";
  PGLOG(LogLevel.Info, FUNNAME, "启动!");

})();