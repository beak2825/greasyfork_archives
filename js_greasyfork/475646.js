// ==UserScript==
// @name         csdn auto jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto jump link for csdn
// @author       You
// @match        https://link.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475646/csdn%20auto%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/475646/csdn%20auto%20jump.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ref = setInterval(function(){
     let link = '';
     try{
      link = document.querySelector('.loading-topic').getElementsByTagName('a')[0].innerText;
     }catch{}
        if(link){
            ref && clearInterval(ref)
      window.location.href = link;
    }
    }, 100)
  
    // Your code here...
})();