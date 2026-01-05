// ==UserScript==
// @name        JewTube #Pride
// @namespace   /pol/and
// @include     http://*youtube.com/*
// @include     http://*youtube.pl/*
// @include     https://*youtube.com/*
// @include     https://*youtube.pl/*
// @version     14.88.8
// @author      autisticanon
// @grant       none
// @description Naprawia jutuba.
// @downloadURL https://update.greasyfork.org/scripts/20822/JewTube%20Pride.user.js
// @updateURL https://update.greasyfork.org/scripts/20822/JewTube%20Pride.meta.js
// ==/UserScript==

//var logo = document.getElementsById("logo");
//logo.src = "http://i.imgur.com/oAPBF04.png";

//var o = document.getElementById("yt-masthead-logo-fragment");
var logo = document.getElementsByClassName("logo masthead-logo-renderer-logo yt-sprite");
var l = logo[0];
l.style.background = "url('http://i.imgur.com/oAPBF04.png')";
l.style.backgroundPosition = "0 0";
l.style.width = "110px"

var spans = document.getElementsByClassName('display-name no-count');
//var spans = document.getElementsByTagName('span');

var patNaCz = new RegExp("Na czasie");
var patMoKa = new RegExp("Mój kanał");
var patSubs = new RegExp("Subskrypcje");
var patSpan = new RegExp("<span>");

for (var i = 0; i < spans.length; i++) {
  var j = spans[i].innerHTML;
  
  if(patNaCz.test(j) && patSpan.test(j)) {
    spans[i].innerHTML = 'Na gazie';
  }
  else if(patMoKa.test(j) && patSpan.test(j)) {
    spans[i].innerHTML = 'Mein Kampf';
  }
  else if(patMoKa.test(j) && patSpan.test(j)) {
    spans[i].innerHTML = 'Mein Kampf';
  }
  else if(patSubs.test(j) && patSpan.test(j)) {
    spans[i].innerHTML = 'Unterskypcje';
  }
}