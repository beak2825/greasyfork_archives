// ==UserScript==
//
// @name         Jenkins krak150 clear downstream view
// @description  Jenkins krak150 clear downstream view from unneeded jobs
// @version      0.1.0
//
// @namespace    http://tampermonkey.net/
// @author       ARH
//
// @match        http://krak150.emea.nsn-net.net:8080/*/downstreambuildview/
//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
//
// @run-at       document-end
//
// @downloadURL https://update.greasyfork.org/scripts/397049/Jenkins%20krak150%20clear%20downstream%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/397049/Jenkins%20krak150%20clear%20downstream%20view.meta.js
// ==/UserScript==

var $ = window.jQuery;

function main() {
    var all_build_links=$("td.pane a.model-link")

    for(var i = 0; i < all_build_links.size(); i++) {
        var a = all_build_links[i]
        var link_text = a.textContent;
        if (link_text == "Autorevert_trunk" ||
            link_text == "ConsoleErrorArchiver" ||
            link_text == "Email_message" ||
            link_text == "Email_message_OK"
           ) {
            a.parentNode.style.display = "none"
        }
    }
}

(function() {main();})();
