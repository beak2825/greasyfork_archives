// ==UserScript==
// @name        Replace doi.org links with Sci-Hub 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      SoopaKhell
// @license     GPLv3
// @require     https://code.jquery.com/jquery-3.6.0.slim.min.js
// @description 4/2/2022, 11:55:44 AM
// @downloadURL https://update.greasyfork.org/scripts/442558/Replace%20doiorg%20links%20with%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/442558/Replace%20doiorg%20links%20with%20Sci-Hub.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('a').each(function() {
    var oldlink = $(this).attr("href")
    $(this).attr('href', decodeURIComponent(oldlink.replace(/(\w+.)?doi\.org/, "sci-hub.se")));

  });
})