// ==UserScript==
// @name     Remove "Before you continue" to YouTube
// @author   Animatorium
// @description Auto-clicks "Reject all" when browsing without cookies.
// @version  1.0
// @grant    none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include      /https:\/\/(www|consent)\.(youtube)\.*\w+\/.*$/
// @namespace https://greasyfork.org/users/11231
// @downloadURL https://update.greasyfork.org/scripts/486342/Remove%20%22Before%20you%20continue%22%20to%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/486342/Remove%20%22Before%20you%20continue%22%20to%20YouTube.meta.js
// ==/UserScript==

  function checkAndClick() {
    if ($('#dialog:visible').length > 0) {
      $('button:contains("Reject all")').click();
      clearInterval(checkInterval);
    }
  }
  var checkInterval = setInterval(checkAndClick, 1000);

$(window).on("load", function() {
    var currentURL = window.location.href;
    if (currentURL.includes("consent.youtube.com")) {
      $('span:contains("Reject all")').click();
    }
});
