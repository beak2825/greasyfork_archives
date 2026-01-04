// ==UserScript==
// @name         GGn Merge checkbox off in Internal Releases Forum
// @namespace    https://gazellegames.net/
// @version      0.1
// @description  Turns off Merge checkbox in Internal Releases Forum
// @author       ZeDoCaixao
// @match        https://gazellegames.net/forums.php?action=viewthread&*
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/34909/GGn%20Merge%20checkbox%20off%20in%20Internal%20Releases%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/34909/GGn%20Merge%20checkbox%20off%20in%20Internal%20Releases%20Forum.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if ( $("#content .thin h2 :nth-child(2)").text().indexOf("GGn Internal Releases") == 0 ) {
    $("#mergebox").attr('checked', false);
  }
})();