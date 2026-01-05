// ==UserScript==
// @name        maliki.rebuild
// @namespace   DEV
// @include     http://maliki.com/strips/*
// @description follow the scroll little button !
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/29687/malikirebuild.user.js
// @updateURL https://update.greasyfork.org/scripts/29687/malikirebuild.meta.js
// ==/UserScript==


var elements = document.getElementsByTagName("a");
var next_button_array = [];
var prev_button_array = [];

for (var i = 0; i < elements.length; ++i) {
  var item = elements[i];  
  
  if(item.className == "linkToContent linkNextContent")
   next_button_array.push(item);
  
  if(item.className == "linkToContent linkPrevContent")
   prev_button_array.push(item);
}

next_button_array[0].style.position = "fixed";
next_button_array[0].style.top = "400px";
next_button_array[1].style.visibility  = "hidden";

prev_button_array[0].style.position = "fixed";
prev_button_array[0].style.top = "400px";
prev_button_array[1].style.visibility  = "hidden";