// ==UserScript==
// @name         lets go
// @namespace    http://tampermonkey.net/
// @version      1
// @description  pog
// @author       Special Kid
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409693/lets%20go.user.js
// @updateURL https://update.greasyfork.org/scripts/409693/lets%20go.meta.js
// ==/UserScript==
var Time = 0.05; // time in seconds, original is 0.05

var i;
var x = document.getElementsByTagName("*");
function secondsToMilli(s) {
  return s * 1000;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function blues() {
  for (i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = "hsl(" + ((x.length * getRandomInt(0, 320)) * i / x.length) + ",80%,50%)";
  }
}
setInterval(blues, secondsToMilli(Time));