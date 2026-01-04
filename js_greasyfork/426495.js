
// ==UserScript==
// @name         BI自动点击刷新
// @namespace    http://hello.world.net/
// @version      0.1
// @description  自动点击点击刷新
// @author       sugz
// @match        *://bi/BIReports/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426495/BI%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/426495/BI%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
 
var interval=20000;//刷新时间间隔

var tab1Count=1;
var tab2Count=0;

var refresh;

(function() {
    'use strict';
  
    setTimeout(function() {
      refresh=document.getElementsByClassName("pbi-glyphicon glyphui pbi-glyph-refresh")[0].parentNode;
    }, 6000);
  
  function clickRefresh () {
    console.log("refreshed:"+new Date());
     refresh.addEventListener('click', function (event) {
     }, false);
     var ev = new MouseEvent('click', {
         cancelable: true,
         bubble: true,
         view: window
     });
     refresh.dispatchEvent(ev);
  }
  
    setInterval(function() {
        clickRefresh();
    },interval)

})();
