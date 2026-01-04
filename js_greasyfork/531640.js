// ==UserScript==
// @name         nxbrew_noads_always_search
// @namespace    http://tampermonkey.net/
// @version      20250401
// @description  remove ad blocker warning page, ad jump, and make search expand visible
// @author       FlyingPoo
// @match        https://nxbrew.com/*
// @match        https://nxbrew.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nxbrew.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531640/nxbrew_noads_always_search.user.js
// @updateURL https://update.greasyfork.org/scripts/531640/nxbrew_noads_always_search.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('iframe').forEach(function(elem) {
        elem.parentNode.removeChild(elem);
    });

    var es = document.getElementsByTagName("div");
    for (var i = 0; i < es.length; i++) {
        if (es[i].id.match(/^[a-z]{52,}/g)) {
            es[i].remove();
            continue;
        }
        if (es[i].style.pointerEvents == "auto") {
            es[i].remove();
            continue;
        }
    }

    var adElements = ["adunblocker-js-extra", "adunblocker-js", "adunblocker-css"];
    adElements.forEach(function(id) {
        var elem = document.getElementById(id);
        if (elem) elem.remove();
    });

    var style = document.createElement('style');
    style.innerHTML = `
        .search-expand {
            display: block !important;
        }
    `;
    document.head.appendChild(style);
})();