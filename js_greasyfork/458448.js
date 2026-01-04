// ==UserScript==
// @name         CyCognito CVEs
// @namespace    http://example.com/
// @version      0.1
// @description  A userscript that adds a floating list of unique CVEs found on the page
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458448/CyCognito%20CVEs.user.js
// @updateURL https://update.greasyfork.org/scripts/458448/CyCognito%20CVEs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The text you want to look for
    var searchText = /\bCVE-\d{4}-\d{4,7}\b/g;

    // The list element
    var list = document.createElement("ul");
    list.style.cssText = "position:fixed; bottom: 10px; right: 10px; background-color: #06236f; padding: 10px; border-top-right-radius: 15px; border-bottom-left-radius: 15px; list-style: none; text-align: center";

    // The header element
    var header = document.createElement("div");
    header.style.cssText = "text-align: center; padding: 10px;";

    // The logo element
    var logo = document.createElement("img");
    logo.src = "https://www.cycognito.com/hs-fs/hubfs/popup-logo.png?width=226&name=popup-logo.png";
    logo.style.cssText = "width:150px;";

    // Add the logo to the header
    header.appendChild(logo);

    // Find all elements containing the search text
    var elements = document.querySelectorAll(":not(script):not(style)");
    var cves = new Set();

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var matches = element.textContent.match(searchText);
        if (matches) {
            matches.forEach(match => cves.add(match));
        }
    }

    if (cves.size > 0) {
        cves.forEach(cve => {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "https://platform.cycognito.com/issues/open-issues?filters=((%3Acves%20%22in%22%20(%22" + cve + "%22)))";
            a.innerHTML = cve;
            a.target = "_blank";
            a.style.cssText = "color: white !important; text-decoration: none !important;";
            li.appendChild(a);
            list.appendChild(li);
        });

    // Add the header to the top of the list
        list.insertBefore(header, list.firstChild);

        document.body.appendChild(list);
    }
})();
