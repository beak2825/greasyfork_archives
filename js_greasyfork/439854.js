// ==UserScript==
// @name         Full Screen
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  For all website. ctrl + alt + F
// @author       Rafif Adli Mulya
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439854/Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/439854/Full%20Screen.meta.js
// ==/UserScript==

(function() {
   'use strict';
   var x=document;
   function fs(m){
      var m = x.documentElement;
      if (!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement){
         if(m.requestFullscreen){m.requestFullscreen()}
         else if(m.webkitRequestFullscreen){m.webkitRequestFullscreen()}
         else if(m.msRequestFullscreen){m.msRequestFullscreen()}
         else if(m.mozRequestFullscreen){m.mozRequestFullscreen()}
         else{alert('Full Screen not supported on this Browser')}
      }else{
         if(x.exitFullscreen){x.exitFullscreen()}
         else if(x.webkitExitFullscreen){x.webkitExitFullscreen()}
         else if(x.msExitFullscreen){x.msExitFullscreen()}
         else if(x.mozExitFullscreen){x.mozExitFullscreen()}
         else{alert('not supported! try press "ESC" key')}
      }
   }
   x.onkeyup=(e)=>{if(e.ctrlKey&&e.altKey&&e.which==70){fs()}};
   x.ondblclick=()=>{fs()}
})();