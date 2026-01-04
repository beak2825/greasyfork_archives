// ==UserScript==
// @name         Hypixel Skyblock Fandom Wiki Redirect
// @version      1
// @description  Automatically redirects Hypixel Skyblock Fandom Wiki links to the official wiki.
// @author       Arden
// @match        https://hypixel-skyblock.fandom.com/wiki/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1345056
// @downloadURL https://update.greasyfork.org/scripts/502563/Hypixel%20Skyblock%20Fandom%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/502563/Hypixel%20Skyblock%20Fandom%20Wiki%20Redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var path = window.location.pathname.replace("/wiki", "");
  var newUrl = "https://wiki.hypixel.net" + path;
  GM_xmlhttpRequest({
    method: "HEAD",
    url: newUrl,
    onload: function (response) {
      if (response.status !== 404) {
        window.location.replace(newUrl);
      }
    },
  });
})();
