// ==UserScript==
// @name         Florbal Finsko přesměrování
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Změní část URL na "events"
// @author       Jarda Kořínek
// @match        https://tulospalvelu.fliiga.com/*
// @match        https://tulospalvelu.salibandy.fi/*
// @icon         https://storage.googleapis.com/client-salibandyliiga-prod/2020/03/6523a0d2-liiga-logo.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477697/Florbal%20Finsko%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/477697/Florbal%20Finsko%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.meta.js
// ==/UserScript==

(function() {
    document.addEventListener("click", (event)=> {
        const target = event.target.baseURI;
        if (target.match(/lineups/)) {
            const url = target.replace("lineups", "events");
            location.href = url;
        }
    })
})();