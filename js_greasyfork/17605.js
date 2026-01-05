// ==UserScript==
// @name        gpu acceleration of the flash player
// @namespace   spieler17
// @description This script is based on the method of incorporating a certain value of the "gpu" attribute "wmode" flash object. Includes gpu acceleration of the flash player. Solves problems with lags of the flash player when watching videos and streams. Works on all websites that use flash technology.
// @include     http://*
// @include     https://*
// @version     3.7
// @grant       function
// @downloadURL https://update.greasyfork.org/scripts/17605/gpu%20acceleration%20of%20the%20flash%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/17605/gpu%20acceleration%20of%20the%20flash%20player.meta.js
// ==/UserScript==

var run_time_max = 2;
var wmode_value = 'gpu';
var toggle = function (o) {
if (o) {
   o.setAttribute('fa-sign', 1);
   var display = o.style.display;
   o.style.display = 'none';
   setTimeout(function () {
   o.style.display = display;
    }, 0);
  }
};
var replace_node = function (o) {
if (o) {
   if (o.type !== 'application/x-shockwave-flash') {
   } 
   else {
   clone = o.cloneNode(true);
   clone.setAttribute('fa-sign', 1);
   o.parentElement.replaceChild(clone, o);
    }
  }
};
var run_time = 1;
var find_wmode = function (t) {
   for (var i = 0; i < t.length; i++) {
   if (t[i].name === 'wmode' || t[i].name === 'wMode') {
   return t[i];
    }
  }
   return null;
};
var interval = setInterval(function () {
var objects = document.getElementsByTagName('object');
var embeds = document.getElementsByTagName('embed');
console.log('run_time', run_time, location);
if (run_time === run_time_max) {
   clearInterval(interval);
  }
   run_time = run_time + 1;
   if (embeds.length > 0) {
   for (var i = 0; i < embeds.length; i++) {
   if (embeds[i].clientWidth < 1366 || embeds[i].clientHeight < 768 || embeds[i].type !== 'application/x-shockwave-flash') {
  } 
  else if (embeds[i].getAttribute('fa-sign')) {
  continue;
  } 
  else {
  embeds[i].setAttribute('wmode', wmode_value);
  replace_node(embeds[i], objects);
  }
  }
  }
  if (objects.length > 0) {
  for (var j = 0; j < objects.length; j++) {
  if (objects[j].clientWidth < 1366 || objects[j].clientHeight < 768 || objects[j].type !== 'application/x-shockwave-flash') {
  } 
  else if (objects[j].getAttribute('fa-sign')) {
  continue;
  } 
  else {
  var d = find_wmode(objects[j].childNodes);
  if (d) {
  d.value = wmode_value;
  } 
  else {
  var e = document.createElement('param');
  e.name = 'wmode';
  e.value = wmode_value;
  objects[j].appendChild(e);
  }
  replace_node(objects[j]);
  }
  }
  }
}, 1366);