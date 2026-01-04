// ==UserScript==
// @name         抖音后台自动点击脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音后台自动点击脚本v1
// @author       hongqifan
// @match        https://fxg.jinritemai.com/ffa/mvip/entry/manage
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438715/%E6%8A%96%E9%9F%B3%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438715/%E6%8A%96%E9%9F%B3%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
     setInterval(function() {
         //if (document.getElementsByClassName("ant-modal-body").length > 0) {
          //   return;
         ///}
         var f = document.getElementsByClassName("index_button__3VThr")[0];
         f.click();
         setTimeout(function(){
             var w = document.getElementsByClassName("ant-btn ant-btn-primary")[0];
             console.log(w);
             w.click();
         }, 0);
     },10000);
})();

