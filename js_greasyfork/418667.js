// ==UserScript==
// @name        bdsmlr_page_changer
// @namespace   Violentmonkey Scripts
// @match       https://*.bdsmlr.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/15/2020, 12:03:19 PM
// @downloadURL https://update.greasyfork.org/scripts/418667/bdsmlr_page_changer.user.js
// @updateURL https://update.greasyfork.org/scripts/418667/bdsmlr_page_changer.meta.js
// ==/UserScript==

var left = null;
var right = null;
var lkc = 37;
var rkc = 39;

function init(){
  var rTmp = document.getElementsByClassName("rightli");
  if(rTmp.length > 0){
    right = rTmp[0];
    console.log("Right!");
  }
  
  var lTmp = document.getElementsByClassName("leftli");
  if(lTmp.length > 0){
    left = lTmp[0];
    console.log("Left!");
  }
}

function HandleKeyDown(keycode){
  if(keycode === lkc){
    OnLeft();
  }
  
  if(keycode === rkc){
    OnRight();
  }
}

function OnLeft(){
  console.log("LeftClick!");
  if(left){
    left.childNodes[0].click();
  }
}

function OnRight(){
  console.log("RightClick!");
  if(right){
    right.childNodes[0].click();
  }
}

window.addEventListener("load", function(){init();});
document.addEventListener("keydown", function(event){
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  HandleKeyDown(event.keyCode);
});