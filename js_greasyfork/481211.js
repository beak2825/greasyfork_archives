// ==UserScript==
// @name         浩辰CAD共享图纸库下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  允许下载浩辰CAD共享图纸库里的cad图纸
// @author       kakasearch
// @match        https://web.gstarcad.com/sharedLibrary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gstarcad.com
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481211/%E6%B5%A9%E8%BE%B0CAD%E5%85%B1%E4%BA%AB%E5%9B%BE%E7%BA%B8%E5%BA%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/481211/%E6%B5%A9%E8%BE%B0CAD%E5%85%B1%E4%BA%AB%E5%9B%BE%E7%BA%B8%E5%BA%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
   let init = setInterval(function(){
         if(window.dwg){
             clearInterval(init)
             window.dwg.utoken = "dhdgffkkebhmkfjojejmpbldmp"
             window.dwg.from = "1"
             new ElegantAlertBox("可以开始下载")
         }
   },1000)
    // Your code here...
})();