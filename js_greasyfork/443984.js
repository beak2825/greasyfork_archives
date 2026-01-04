// ==UserScript==
// @name        YouTube Shorts -> Watch
// @namespace   thechainsmoker82@gmail.com
// @description This will redirect pages for YouTube Shorts to the traditional video page.
// @match     https://www.youtube.com/*
// @match     http://www.youtube.com/*
// @version     1.02
// @grant       none
// @license     CC0
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/443984/YouTube%20Shorts%20-%3E%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/443984/YouTube%20Shorts%20-%3E%20Watch.meta.js
// ==/UserScript==

function shortsWatch(){
if (/shorts/.test(window.location.href)){
   var newurl = "https://www.youtube.com/watch?v="+document.URL.match(/(?<=\/shorts\/)[a-zA-Z0-9_-]+/);
   location.replace(newurl);}
}

setInterval(shortsWatch, 1000)