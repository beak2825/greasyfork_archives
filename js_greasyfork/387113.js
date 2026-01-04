  // ==UserScript==
// @name Fix Aliyun Code Display
// @namespace Violentmonkey Scripts
// @match https://yq.aliyun.com/*
// @grant none
// @description Fix highlight.js code display problem on yq.aliyun.com; this problem pertains to browsers on Linux
// @version 0.1.1

// @downloadURL https://update.greasyfork.org/scripts/387113/Fix%20Aliyun%20Code%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/387113/Fix%20Aliyun%20Code%20Display.meta.js
// ==/UserScript==

$(window).load(function(){
  $(".hljs").removeAttr('style');
});

