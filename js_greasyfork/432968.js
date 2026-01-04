// ==UserScript==
// @name        Remove Ads - mtgazone.com
// @namespace   Violentmonkey Scripts
// @match       https://mtgazone.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 2021/7/17下午6:54:07
// @downloadURL https://update.greasyfork.org/scripts/432968/Remove%20Ads%20-%20mtgazonecom.user.js
// @updateURL https://update.greasyfork.org/scripts/432968/Remove%20Ads%20-%20mtgazonecom.meta.js
// ==/UserScript==
// 


(function(){
  'use strict';
  console.log('hello world');
  
  setInterval(startWork,1000);
  
})();


  function startWork(){
    console.log('startWork');
    
    let footer = document.getElementById("footer");
    
    if(footer){
      footer.remove();
    }
    let ads = document.getElementsByClassName("adthrive-ad");
    
    for(let i=0;i<ads.length;i++){
      let ad = ads[i];
      ad.remove();
    }
  }
