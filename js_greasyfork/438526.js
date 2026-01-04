// ==UserScript==
// @name        Justwatch ad-remover
// @description remove ads in Justwatch
// @author      SH3LL
// @version     1.2
// @match       https://www.justwatch.com/*
// @grant       none
// @run-at      document-idle
// @license	GPL3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/438526/Justwatch%20ad-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/438526/Justwatch%20ad-remover.meta.js
// ==/UserScript==


function remove_ad_blocks(){
  setInterval(function() {

        if(document.getElementsByClassName("hidden-horizontal-scrollbar__items").length !== 0 ){
          for(el of document.getElementsByClassName("ad-unit")){
            el.remove();
          }
          for(el of document.getElementsByClassName("sponsored-recommendation")){
            el.remove();
          }
          return;
        }
    }, 2000);
}
function remove_announces(){
  setInterval(function() {

        if(document.getElementsByClassName("large-native-ad-poster-wrapper").length !== 0 ){
          for(el of document.getElementsByClassName("large-native-ad-poster-wrapper")){
            el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
          }
          return;
        }
    }, 2000);
}


remove_ad_blocks();
remove_announces();