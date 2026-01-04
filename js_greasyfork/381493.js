// ==UserScript==
// @name         HVDB-DLSITE-LINK
// @author       Paw
// @icon         http://hvdb.me/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add a DLsite link to HVDB works.
// @author       You
// @match        http://hvdb.me/Dashboard/WorkDetails/*
// @match        http://hvdb.me/Dashboard/Details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381493/HVDB-DLSITE-LINK.user.js
// @updateURL https://update.greasyfork.org/scripts/381493/HVDB-DLSITE-LINK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var p = document.createElement("p");
    p.innerHTML="<br/>";
    var a = document.createElement("a");
    p.appendChild(a);
    var t = document.querySelector("div.body-content h2").innerHTML;
    var w = t.split("-").pop().trim();
    a.href = "https://dereferer.me/?https://www.dlsite.com/maniax/work/=/product_id/" + w;
    a.target = "_blank";
    var img = document.createElement("img");
    img.src = "https://i.imgur.com/LD1WguE.jpg"; // https://www.dlsite.com/img/dlsite1.gif
    a.appendChild(img);
    var x = document.querySelector(".container-fluid img.detailImage");
    x.parentNode.insertBefore(p, x.nextSibling);
})();