// ==UserScript==
// @name         big shop sploop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ok
// @author       You
// @match        *://*.sploop.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440849/big%20shop%20sploop.user.js
// @updateURL https://update.greasyfork.org/scripts/440849/big%20shop%20sploop.meta.js
// ==/UserScript==

document.getElementById("hat-menu").style.background = "rgba(0,0,0,0)";
(function() {var css = [
"#hat-menu {",
    "height: 700px;",
    "width: 500px;",
"}"
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
        document.documentElement.appendChild(node);
    }
}
})();