// ==UserScript==
// @name         YT2INV | Youtube To Invidious
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This userscript redirects you to a private invidious instance.
// @author       LgamerLIVE
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ce.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455498/YT2INV%20%7C%20Youtube%20To%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/455498/YT2INV%20%7C%20Youtube%20To%20Invidious.meta.js
// ==/UserScript==

var url = window.location.toString();
var str = window.location.toString();

if (str.includes('youtube')) {
 window.location = url.replace("https://youtube.com/", "http://vid.puffyan.us/");}
if (str.includes('www')) {
  window.location = url.replace("https://www.youtube.com/", "http://vid.puffyan.us/");}
if (str.includes('m')) {
  window.location = url.replace("https://m.youtube.com/", "http://vid.puffyan.us/");}