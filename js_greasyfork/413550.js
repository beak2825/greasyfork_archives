// ==UserScript==
// @name          Insel-Monarchie Dark Mode
// @namespace     http://stefanweidemann.de/im-darkmode.js
// @description	  Schont die Augen. Stay focused
// @author        Stefan Weidemann
// @homepage      http://stefanweidemann.de/
// @include       http://insel-monarchie.de/*
// @include       https://insel-monarchie.de/*
// @include       http://*.insel-monarchie.de/*
// @include       https://*.insel-monarchie.de/*
// @include       http://insel-monarchie.de*
// @run-at        document-start
// @version       1.3.18.10.2020.16.55
// @downloadURL https://update.greasyfork.org/scripts/413550/Insel-Monarchie%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/413550/Insel-Monarchie%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    var css = [
        "/*----- BACKGROUND COLORS -----*/",
        " body {",
        "    background: #161616 !important",
        "}",
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
})();