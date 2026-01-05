// ==UserScript==
// @name         Solidfiles
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      /^https?://www\.solidfiles\.com/[dv]/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22681/Solidfiles.user.js
// @updateURL https://update.greasyfork.org/scripts/22681/Solidfiles.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
 
var loc = $("#download-btn");
if(loc && loc[0] && loc[0].href) {
    document.location = loc[0].href;
} else {
   var btn = $("form button[type=submit]");
   if(btn && btn[0]) {
       btn[0].click();
   }
}
