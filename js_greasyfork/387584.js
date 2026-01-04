// ==UserScript==
// @name         baidu_pan_auto_down
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pan.baidu.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387584/baidu_pan_auto_down.user.js
// @updateURL https://update.greasyfork.org/scripts/387584/baidu_pan_auto_down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function(){
       if(document.querySelector('a[data-button-id^="b3"]')){
           document.querySelector('a[data-button-id^="b3"]').click();
           setTimeout(function(){//dialog1 input-code
               if(document.getElementById("dialog1")){
                   document.getElementsByClassName("input-code")[0].focus()
               }
           }, 1000);
       }

    }, 1000);
})();