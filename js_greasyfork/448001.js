// ==UserScript==
// 
// @name         Better Golem
// @version      1.0
// @license      LGPLv3  
// @description  Hides Ads and Golem Plus posts
// @match        https://www.golem.de/*
// @icon         https://www.golem.de/apple-touch-icon.png
// @author       FaySmash 
// @namespace    https://greasyfork.org/de/users/165409
// @downloadURL https://update.greasyfork.org/scripts/448001/Better%20Golem.user.js
// @updateURL https://update.greasyfork.org/scripts/448001/Better%20Golem.meta.js
// ==/UserScript==

window.onload = function(){
  var items = document.getElementsByClassName("cluster-header");
  
  for(let i = 0; i < items.length; i++){
    
    if(((window.getComputedStyle((items[i].getElementsByClassName("head1")[0]), ':before')).getPropertyValue("content")) !== "none"){
        items[i].closest("li").style.display = "none";
    }
  }
}