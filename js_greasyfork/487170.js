// ==UserScript==
// @name         fccid.io Direct PDF Links
// @version      2024-02-12
// @license      MIT
// @author       gergo=
// @description  --
// @match        https://fccid.io/*
// @icon         https://fccid.io/favicon.ico
// @namespace https://greasyfork.org/users/1260417
// @downloadURL https://update.greasyfork.org/scripts/487170/fccidio%20Direct%20PDF%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/487170/fccidio%20Direct%20PDF%20Links.meta.js
// ==/UserScript==

for (var link of document.querySelectorAll("a")) {
    if (link.href.match(/https:\/\/fccid\.io\/\w+\/[\w-]+\/[\w-]+$/)) {
        var pdf = document.createElement("a");
        pdf.href = link.href + ".pdf";
        pdf.innerHTML = ' <img width=20 src="https://cdn-0.fccid.io/pdf.png">';
        link.parentElement.appendChild(pdf);
    }
}
