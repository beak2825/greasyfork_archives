// ==UserScript==
// @name        Cyanide and happiness page turner
// @namespace   Violentmonkey Scripts
// @match       https://explosm.net/comics/*
// @grant       none
// @version     1.0
// @author      WolfyD
// @license     MIT
// @description 1/14/2022, 11:47:58 PM
// @downloadURL https://update.greasyfork.org/scripts/438562/Cyanide%20and%20happiness%20page%20turner.user.js
// @updateURL https://update.greasyfork.org/scripts/438562/Cyanide%20and%20happiness%20page%20turner.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

let previous = null;
let next = null;

function start(){
  setup();
  document.addEventListener("keydown", onKeyDown);
}

function onKeyDown(e){
  let key = e.keyCode;
  switch(key){
    case 37:
      if(previous){ previous.click(); }
      break;
    case 32:
    case 39:
      if(next){ next.click(); }
      break;
  }
}

function setup(){
  let boxes = [].slice.call(document.getElementsByTagName("div")).filter(x=>x.className.indexOf("ComicSelector__Container") === 0)[0].children;
  if(boxes.length === 3){
    previous = boxes[0];
    next = boxes[2];
  }
  
}

document.addEventListener("load", start()); 
