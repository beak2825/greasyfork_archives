// ==UserScript==
// @name         delete ad
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       LeeYuan
// @match        https://www.amazon.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/411169/delete%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/411169/delete%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url=window.location.href;
    if(url.indexOf('https://www.amazon.com/s?')==-1){
    return;
    }



    deleteAd();


   



 // Your code here...
})();



function  deleteAd()
{
var items=document.querySelectorAll(".AdHolder");

    for(var i=0;i<items.length;i++){
   items[i].parentNode.removeChild( items[i])
    }
    
}