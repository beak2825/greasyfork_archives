// ==UserScript==
// @name         PrintMoqups
// @version      0.5
// @author       FireAwayH
// @namespace FireAwayH
// @match        https://app.moqups.com/*
// @grant        none
// @description Make Moqups project printable. Free!
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/14093/PrintMoqups.user.js
// @updateURL https://update.greasyfork.org/scripts/14093/PrintMoqups.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var init = function(){
    var menu = document.getElementById("account-menu");
    var printIt = document.createElement("a");
    menu.appendChild(printIt);
    printIt.outerHTML = '<a href="#" class="upgrade-btn mq-btn" onclick="printIt();">print it</a>';
    var insertScript = document.createElement("script");
    insertScript.id = "printIt";
    insertScript.innerHTML = 
"var needPrint = $('.canvas-svg:eq(0)').find('svg:eq(0)')[0];\
 var insertStyle = $('link[rel=stylesheet]')[0];\
 var title = document.createElement('title');\
 var printIt = function(){\
   if(!needPrint){\
       needPrint = $('.canvas-svg:eq(0)').find('svg:eq(0)')[0];\
   }\
   var newWindow = window.open();\
   var titleText = $('title').html();\
   title.innerHTML = titleText;\
   newWindow.document.head.appendChild(insertStyle);\
   newWindow.document.head.appendChild(title);\
   newWindow.document.body.innerHTML = needPrint.outerHTML;\
   newWindow.document.body.setAttribute('style','overflow:scroll');\
 }\
";


    document.body.appendChild(insertScript);
}
init();