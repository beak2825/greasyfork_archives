// ==UserScript==
// @name        Youtube rzulta morda
// @description Rzulta morda zamiast teczy
// @namespace   https://www.facebook.com/toja.tomasz
// @include     https://*youtube.com/*
// @include     http://*youtube.com/*
// @include     http://*youtube.pl/*
// @include     https://*youtube.pl/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20815/Youtube%20rzulta%20morda.user.js
// @updateURL https://update.greasyfork.org/scripts/20815/Youtube%20rzulta%20morda.meta.js
// ==/UserScript==

 document.getElementsByClassName('logo')[0].setAttribute("src", "http://i.imgur.com/YNeBcVH.png"); 
 document.getElementsByClassName('logo')[0].style.background = "url('http://i.imgur.com/YNeBcVH.png')";
 document.getElementsByClassName('logo')[0].style.width = "111px";