// ==UserScript==
// @name         flashy colors oh yeah
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  oof ouch owie my eyes
// @author       Special Kid
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395530/flashy%20colors%20oh%20yeah.user.js
// @updateURL https://update.greasyfork.org/scripts/395530/flashy%20colors%20oh%20yeah.meta.js
// ==/UserScript==
var Time = 0.05; // time in seconds, original is 0.05

var i;
var x = document.getElementsByTagName("*");
var l = [
    'Arial, Helvetica, sans-serif',
    '"Arial Black", Gadget, sans-serif',
    '"Comic Sans MS", cursive, sans-serif',
    'Impact, Charcoal, sans-serif',
    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma, Geneva, sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
    '"Lucida Console", Monaco, monospace',
    '"Courier New", Courier, monospace',
    'Georgia, serif',
    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    '"Times New Roman", Times, serif'
];
function secondsToMilli(s) {
  return s * 1000;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rand(x){
    return Math.floor(Math.random() * x)
}
function blues() {
  for (i = 0; i < x.length; i++) {
    for (i = 0; i < x.length; i++) {
        var fonts = l[rand(l.length)];
        x[i].style.fontSize = getRandomInt(20, 40) + 'px';
        x[i].style.backgroundColor = "hsl(" + ((x.length * getRandomInt(0, 320)) * i / x.length) + ",80%,50%)";
        document.title = getRandomInt(1000, 99999);
        x[i].width = getRandomInt(100,500);
        x[i].height = getRandomInt(100,500);
        x[i].style.fontFamily = fonts;
      }

  }
}
setInterval(blues, secondsToMilli(Time));