// ==UserScript==
// @name         Tidy Qwant Results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make Qwant look tidier by removing favicon and replacing superfluous elements
// @author       xdpirate
// @license      GPLv3
// @match        https://www.qwant.com/?*q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwant.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505591/Tidy%20Qwant%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/505591/Tidy%20Qwant%20Results.meta.js
// ==/UserScript==

new MutationObserver(function(event) {
    document.querySelectorAll("div[data-testid='breadcrumbs'] > a.external").forEach(elem => {
        let parsed = elem.getAttribute("tidyparsed");
        if(parsed == null) {
            elem.innerHTML = elem.href;
            elem.setAttribute("tidyparsed", true);
        }
    });

     document.querySelectorAll("div[data-testid='domain'] > a").forEach(elem => {
        let parsed = elem.getAttribute("tidyparsed");
        if(parsed == null) {
            elem.style.display = "none";
            elem.setAttribute("tidyparsed", true);
        }
    });

    document.querySelectorAll("div[data-testid='domain'] > div > a[rel='noopener']").forEach(elem => {
        let parsed = elem.getAttribute("tidyparsed");
        if(parsed == null) {
            elem.style.display = "none";
            elem.setAttribute("tidyparsed", true);
        }
    });
}).observe(document, {subtree: true, childList: true});
