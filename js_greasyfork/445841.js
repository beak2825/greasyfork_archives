// ==UserScript==
// @run-at      document-start
// @name        chrome webstore open images with better quality 
// @description google chrome webstore open images with better quality 
// @match       https://lh3.googleusercontent.com/*
// @version     0.1
// @namespace   https://greasyfork.org/es/users/758165-ayd-prueba
// @grant       none
// @author      Alexito
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/445841/chrome%20webstore%20open%20images%20with%20better%20quality.user.js
// @updateURL https://update.greasyfork.org/scripts/445841/chrome%20webstore%20open%20images%20with%20better%20quality.meta.js
// ==/UserScript==
 
  if (window.location.href.indexOf("w640-h400") > 1){    
     var url2 = window.location.href.replace('w640-h400','w1280-h1080');     
     window.location.href=url2;         
        } 
 


