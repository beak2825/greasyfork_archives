// ==UserScript==
// @name        scroll helper
// @description &nbsp;
// @namespace   picksomethingrandom
// @include     file:///*/*.html
// @include     http://boards.4chan.org/*
// @include     https://boards.4chan.org/*
// @include     http://sys.4chan.org/*
// @include     https://sys.4chan.org/*
// @include     http://www.4chan.org/*
// @include     https://www.4chan.org/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28725/scroll%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/28725/scroll%20helper.meta.js
// ==/UserScript==




//get page info
console.log("Scroll helper loading.");
var index = 0;
var title = document.title;
var positions = document.getElementsByName("top");
positions = positions.concat(document.getElementsByClass("postContainer"));

//handle keypress
function doc_keyUp(e) {


  if (e.key == "ArrowLeft" || e.key.toLowerCase() == "z"){
    if (index <= 0){ return false;}
    positions[--index].scrollIntoView();
    console.log("scrolled to element " + index);
    
  }

  if (e.key == "ArrowRight" || e.key.toLowerCase() == "x"){
    if (index >= positions.length-1) { return false;}
    positions[++index].scrollIntoView();
    console.log("scrolled to element " + index);

  }

  document.title = title + " page: " + index;
  
  return false;
}


document.addEventListener("keyup", doc_keyUp, true);
console.log("Scroll helper loaded.");

