// ==UserScript==
// @name        SST Console Customizations
// @namespace   Violentmonkey Scripts
// @match       https://console.sst.dev/*
// @grant   GM_addStyle
// @version     1.0
// @author      redaphid <iam@aaronherres.com>
// @description Sets textareas in sst.dev to 500px high & disables caching.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467120/SST%20Console%20Customizations.user.js
// @updateURL https://update.greasyfork.org/scripts/467120/SST%20Console%20Customizations.meta.js
// ==/UserScript==

GM_addStyle(
  `
  textarea {
    height: 500px;
  }
  `
);

(function() {
  // Disable caching on all resources on sst.dev.
  var cache = document.cookie.match(/\bcache=[^;]+/);
  if (cache) {
    document.cookie = "cache=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  // Set the height of all textareas to 500px.
  const t = ()=>{
    var textareas = document.querySelectorAll("textarea");
    for (var i = 0; i < textareas.length; i++) {
      textareas[i].removeAttribute("style");
    }
  }
  setInterval(t,500)
})();

