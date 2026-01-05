// ==UserScript==
// @name        F-Chat Blank Channel Handler
// @namespace   https://greasyfork.org/en/users/60633-xbl
// @version     0.1
// @description Handle empty-string channel names.
// @author      XBL
// @match       https://www.f-list.net/chat/
// @match       https://www.f-list.net/chat/?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22491/F-Chat%20Blank%20Channel%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/22491/F-Chat%20Blank%20Channel%20Handler.meta.js
// ==/UserScript==

(function patch3016() {
'use strict';
/* See bugreport 3016 */

var newcss = '<style type="text/css" id="patch3016"> .channel-item { min-height: 1.1em; } </style>';
if (document.getElementById("patch3016") !== null)
  jQuery("#patch3016").remove();
jQuery("head").append(newcss);

})();

