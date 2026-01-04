// ==UserScript==
// @name         OrgsynLinkFix
// @namespace    http://davidr.me/
// @version      0.2
// @description  Fixes Orgsyn's ridiculous javascript links that you can't open in new tab
// @author       David Robertson
// @match        http://www.orgsyn.org/*
// @match        http://orgsyn.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405884/OrgsynLinkFix.user.js
// @updateURL https://update.greasyfork.org/scripts/405884/OrgsynLinkFix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixOrgsynLinks() {
        var onclicklinks = document.querySelectorAll("a[onclick]");
        for (var i = 0; i < onclicklinks.length; i++) {
            var link = onclicklinks[i];
            var href = link.getAttribute("href");
            if (href == null) {
                var script = link.getAttribute("onclick");
                var matchresult = script.match(/javascript:getDirections\('(pdf|html)','(\w+)'\)/);
                if (matchresult) {
                    var type = matchresult[1];
                    var id = matchresult[2];
                    if (type == "html") {
                        link.href = "/demo.aspx?prep=" + id;
                        link.setAttribute("onclick", "");
                        link.style.textDecoration = "underline";
                    } else if (type == "pdf") {
                        link.href = "/Content/pdfs/procedures/" + id + ".pdf";
                        link.setAttribute("onclick", "");
                        link.style.textDecoration = "underline";
                    }
                }
            }
        }
    }

    fixOrgsynLinks();
    window.setInterval(fixOrgsynLinks, 1000);
})();