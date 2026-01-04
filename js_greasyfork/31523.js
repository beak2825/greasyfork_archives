// ==UserScript==
// @name        Remove right column facebook
// @namespace   https://gitlab.com/helq
// @description Let's remove the annoying right column in fb
// @include     /^https?://.*\.facebook\.com/.*$/
// @version     0.0.1
// @grant       none
// @author      helq
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/31523/Remove%20right%20column%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/31523/Remove%20right%20column%20facebook.meta.js
// ==/UserScript==

function initScript() {
  "use strict";

  console.log("Facebook right-column remover started");

  let to_del = document.querySelector("#rightCol > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)");
  //console.log( to_del.outerHTML );
  
  to_del.parentNode.removeChild( to_del );
}

//setTimeout(function() { initScript(); }, 100);
initScript();