// ==UserScript==
// @name         Fix Google Links
// @version      0.8
// @description  Prevent google page from replacing search results links with the redirection ones
// @author       Neokyuubi
// @include      /^https?://www\.google\.com/search/
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @namespace https://greasyfork.org/users/687731
// @downloadURL https://update.greasyfork.org/scripts/438099/Fix%20Google%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/438099/Fix%20Google%20Links.meta.js
// ==/UserScript==

(function(){

    $("#rso a[data-jsarwt]").each(function()
    {
      $(this).attr('data-jsarwt', "");
    });

})();
