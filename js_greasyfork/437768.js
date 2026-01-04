// ==UserScript==
// @name        RED: request defaults
// @namespace   userscript1
// @match       https://redacted.sh/requests.php?action=new*
// @grant       none
// @version     0.1.2
// @description defaults for new requests
// @downloadURL https://update.greasyfork.org/scripts/437768/RED%3A%20request%20defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/437768/RED%3A%20request%20defaults.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //// FLAC, LOSSLESS, CD
  var a = ['format_1', 'bitrate_8', 'media_0', 'needlog', 'needcue', 'needchecksum'];
  
  //// FLAC, LOSSLESS, WEB
  // var a = ['format_1', 'bitrate_8', 'media_7',];
  
  for (let b of a) {
      document.getElementById(b).click();
  }

  document.getElementById('minlogscore').value = "100";
})();