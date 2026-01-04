// ==UserScript==
// @name         LOLZTEAM.net helper
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Helper for Lolzteam (forum)
// @author       Cornelious
// @match      *://lolzteam.net/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382494/LOLZTEAMnet%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/382494/LOLZTEAMnet%20helper.meta.js
// ==/UserScript==
//var $ = window.$;
$(".threadView--PaidService").remove();
  $("#uaThreadViewContainer").appendTo(".titleBar");