// ==UserScript==
// @name        No New! Alliance
// @description Remove alliance new message alert
// @version     0.1
// @author      Talus
// @namespace   http://www.knightsradiant.pw/
// @license     GPL-3.0-or-later
// @match       https://politicsandwar.com/*
// @grant       none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/451665/No%20New%21%20Alliance.user.js
// @updateURL https://update.greasyfork.org/scripts/451665/No%20New%21%20Alliance.meta.js
// ==/UserScript==

(function(){
  var $ = window.jQuery;
  $("span:contains('New!')")[0].remove();
})();