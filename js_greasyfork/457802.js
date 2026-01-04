// ==UserScript==
// @name         Redirect
// @namespace    http://tampermonkey.net/
// @version      1
// @license MIT
// @description  xxx
// @author       You
// @match        https://steamcommunity.com/
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457802/Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/457802/Redirect.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, g_sessionID */


setTimeout(
  function() 
  {
    var url = "https://steamcommunity.com/login/home/";
    $(location).attr('href', url);    
  }, 0);
  