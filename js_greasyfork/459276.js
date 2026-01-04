// ==UserScript==
// @name         SPH Nachrichten+
// @namespace    http://none.not/
// @version      0.2
// @description  Message in new tab
// @author       CodeSpoof
// @match        https://start.schulportal.hessen.de/nachrichten.php*
// @icon         https://start.schulportal.hessen.de/img/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459276/SPH%20Nachrichten%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/459276/SPH%20Nachrichten%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode("a.select[target=\"_blank\"]:before { content: \"\"}"));
    document.head.appendChild(style);
    function add() {
        document.querySelectorAll("#msgTableBody > tr:not(.codespoofhasextern)").forEach(e => {
            var url = document.createElement("a");
            url.setAttribute("target", "_blank");
            url.setAttribute("href", "https://start.schulportal.hessen.de/nachrichten.php?a=read&msg=" + e.getAttribute("data-id"));
            url.classList.add("select");
            url.appendChild(document.createTextNode("🔗neuer tab"));
            e.querySelector("td:nth-of-type(3)").appendChild(document.createTextNode(" "));
            e.querySelector("td:nth-of-type(3)").appendChild(url);
            e.classList.add("codespoofhasextern");
        });
        document.querySelectorAll("#msgs > div > div[data-id]:not(.codespoofhasextern)").forEach(e => {
            var url = document.createElement("a");
            url.setAttribute("target", "_blank");
            url.setAttribute("style", "margin-left: 7px;");
            url.setAttribute("href", "https://start.schulportal.hessen.de/nachrichten.php?a=read&msg=" + e.getAttribute("data-id"));
            url.classList.add("deleteIcon");
            url.appendChild(document.createTextNode("🔗neuer tab"));
            var spacer = document.createElement("span");
            spacer.appendChild(document.createTextNode("  "));
            e.querySelectorAll("span#BoxDeleteBtn")[0].appendChild(document.createElement("span"));
            e.querySelectorAll("span#BoxDeleteBtn")[0].appendChild(url);
            e.classList.add("codespoofhasextern");
        });
    }
    setInterval(add, 1000);
})();