// ==UserScript==
// @name        booth image redirector
// @namespace   TypeNANA
// @version     4
// @description Redirect booth image to orig
// @author      HY
// @include     *://*.pximg.net/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383081/booth%20image%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/383081/booth%20image%20redirector.meta.js
// ==/UserScript==

(function () {
    var url = window.document.location + "";
    if (document.body.innerText.includes("404") && url.includes(".jpg")) {
        url = url.replace(".jpg", ".png");
        window.location.replace(url);
    } else if (document.body.innerText.includes("404") && url.includes(".png")) {
        url = url.replace(".png", "_base_resized.jpg");
        window.location.replace(url);
    } else if (url.includes("pximg.net/c/")) {
        url = url.replace(/\/c\/\d+x\d+[^\/]+/, "").replace("_base_resized", "");
        window.location.replace(url);
    }
})();