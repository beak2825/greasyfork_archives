// ==UserScript==
// @description Redirects directly to akoam
// @name 				skip akoam short url
// @icon        https://apkbaba.com/wp-content/uploads/%D8%A7%D9%83%D9%88%D8%A7%D9%85-Akoam-icon-apkbaba.webp
// @namespace 	Backend
// @include 		http://noon.khsm.io/*
// @include 		https://noon.khsm.io/*
// @include 		http://re.akwam.news/*
// @include 		https://re.akwam.news/*
// @version 		1.2
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/445598/skip%20akoam%20short%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/445598/skip%20akoam%20short%20url.meta.js
// ==/UserScript==


setInterval(function () {
  if (window.location.href.indexOf('watch'))
  {window.location.replace(document.getElementsByClassName("download-link")[0].getAttribute("href"));}
}, 1500)