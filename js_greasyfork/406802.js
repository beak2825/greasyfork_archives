// ==UserScript==
// @name         Canvas print fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.instructure.com/moderation/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/406802/Canvas%20print%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/406802/Canvas%20print%20fix.meta.js
// ==/UserScript==

var $ = window.jQuery;

var waitForEl = function(selector, callback) {
  if ($(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

waitForEl(".eqaNh_ckTw", function() {
    $( "#root" ).css( "height", "auto" );
});