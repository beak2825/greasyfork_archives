// ==UserScript==
// @name         Sketchup.cgtips.org link extractor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://sketchup.cgtips.org/*
// @match        https://link.cgtips.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cgtips.org
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535735/Sketchupcgtipsorg%20link%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/535735/Sketchupcgtipsorg%20link%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function verifySite(site) {
        return window.location.hostname.includes(site);
    }

    function cgtipsSiteBypass() {
        let varText = document.querySelectorAll('code')[0].childNodes;
        let mthString = "link.cgtips";
        let data="";

        for (let idx = 0; idx < varText.length; idx++) {
            let el = varText[idx];
            if (el.nodeType == Node.TEXT_NODE) {
                var opUrl = el.textContent.trimStart();
                if (opUrl.includes(mthString)) {
                    data = opUrl;
                    break;
                }
            }
        }
        console.log("DOWNLOAD URL : "+ data);
        window.location = data;
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    //-------------EXECUTE----------------\\

        document.addEventListener("beforeload", (event) => {
        const blockedScripts = ["sodar2.js", "analytics.js","adsbygoogle.js"];
        blockedScripts.forEach((blockedSrc) => {
            if (event.target.src.includes(blockedSrc)) {
                event.preventDefault(); // Block the script
                console.log(`Blocked: ${event.target.src}`);
            }
        });
    }, true);

     if (verifySite("sketchup.cgtips.org")) {
        cgtipsSiteBypass();
    }

    if (verifySite("link.cgtips.org")) {
        waitForElement('a.btn.btn-success', (el) => {
            console.log("Element found:", el.href);
            window.location = el.href;
        });
    }

   // Your code here...
})();