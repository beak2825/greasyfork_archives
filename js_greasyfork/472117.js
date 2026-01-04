// ==UserScript==
// @name         Unlistedvideos redirect
// @namespace    https://greasyfork.org/scripts/472117-unlistedvideos-redirect
// @version      1.0
// @description  Redirect to new URL of unlistedvideos.com from old one.
// @author       Scri P
// @match        *://unlistedvideos.com/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unlistedvideos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472117/Unlistedvideos%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472117/Unlistedvideos%20redirect.meta.js
// ==/UserScript==

(function() {
  const l = location.href;
  const NewURL = l.replace("http:", "https:")
    .replace("/v/", "/v.php?")
    .replace(".html", "");
  location.href = NewURL;
})();