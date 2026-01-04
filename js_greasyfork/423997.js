// ==UserScript==
// @name         ingress-maxfield
// @namespace    https://intel.ingress.com/
// @version      0.1
// @description  try to take over the world!
// @author       3verness
// @match        https://intel.ingress.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423997/ingress-maxfield.user.js
// @updateURL https://update.greasyfork.org/scripts/423997/ingress-maxfield.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var copyButton = document.createElement("div");
    copyButton.className = 'nav_link';
    copyButton.innerHTML = 'COPY';
    copyButton.addEventListener("click", copyFunc)
    function copyFunc(){
        //debugger
        Tj(document.querySelector("#header_maplink"), "show_box");
        displaymaplink();
        var title = document.querySelector("#portal_primary_title").textContent;
        var link = document.querySelector("#maplink").value;
        var s = title+';'+link;
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', s);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        document.body.removeChild(input);
    }
    document.querySelector("#nav").appendChild(copyButton);
})();