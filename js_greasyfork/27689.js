// ==UserScript==
// @name        Facebook No Login
// @description Removes annoying popups and visual cruft when not logged-in
// @namespace   https://www.facebook.com
// @icon        https://www.facebook.com/favicon.ico
// @include     *.facebook.*/*
// @run-at      document-start
// @version     1.5.1
// @license     CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @homepageURL https://github.com/lidel/userscripts
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27689/Facebook%20No%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/27689/Facebook%20No%20Login.meta.js
// ==/UserScript==

var css = "#headerArea div#u_0_0, #headerArea div#u_0_1, #headerArea div#u_0_3, #dialog_0.pop_dialog, #pagelet_loggedout_sign_up, #pagelet_bluebar, #pagelet_growth_expanding_cta, UIPage_LoggedOut { display: none !important; }";

if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
    }
}
