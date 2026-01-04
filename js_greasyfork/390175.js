// ==UserScript==
// @name        TW Apple Daily Reader
// @description TW Apple Daily reads without login
// @include     https://tw.appledaily.com/*
// @version     1.0.0
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/372034
// @downloadURL https://update.greasyfork.org/scripts/390175/TW%20Apple%20Daily%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/390175/TW%20Apple%20Daily%20Reader.meta.js
// ==/UserScript==

var node = document.createElement('script');
node.innerHTML = "const isAdBlocked = false; const options = {}; const paywall = function(){$('.ndAritcle_headPic,.ndArticle_margin,.mediabox,.articulum').css('visibility','visible').show();}; const effects=function(){}; ";
document.head.appendChild(node);