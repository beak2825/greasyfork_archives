// ==UserScript==
// @name           Remove Ads from Google search
// @namespace      XcomeX
// @description    Removes ads from Google search result pages
// @version        0.1
// @author         XcomeX
// @include      /^https?://www\.google\./
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2748/Remove%20Ads%20from%20Google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/2748/Remove%20Ads%20from%20Google%20search.meta.js
// ==/UserScript==

(function () {
    var tads = document.getElementById("tads");
    tads.remove();

    var rhscol = document.getElementById("rhscol");
    rhscol.remove();

    var pushdownyes = document.getElementById("pushdownyes");
    pushdownyes.parentElement.remove();

}());
