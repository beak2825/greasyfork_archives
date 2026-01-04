// ==UserScript==
// @name         site stayfriends - block gold teaser
// @namespace    http://greasyfork.org
// @version      2024.07.16.2315
// @license      MIT
// @description  remove gold teaser shit
// @author       hg42
// @match        https://www.stayfriends.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stayfriends.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500870/site%20stayfriends%20-%20block%20gold%20teaser.user.js
// @updateURL https://update.greasyfork.org/scripts/500870/site%20stayfriends%20-%20block%20gold%20teaser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(removeShit, 1000);
})();// ==UserScript==

function removeShit(){
  var elements, ele;
  try{
    elements = document.getElementsByTagName("sf-gold-teaser")
    if(elements.length>0){
      for(ele of elements){
          ele.parentNode.removeChild(ele);
      }
    }
  }
  catch(err){
    console.log(err);
  }
  try{
    elements = document.getElementsByTagName("sf-advertisement");
    if(elements.length>0){
      for(ele of elements){
          ele.parentNode.removeChild(ele);
      }
    }
  }
  catch(err){
    console.log(err);
  }
  try{
    elements = document.getElementsByClassName("blurred");
    if(elements.length>0){
      for(ele of elements){
          ele.classList.remove("blurred");
      }
    }
  }
  catch(err){
    console.log(err);
  }
}
