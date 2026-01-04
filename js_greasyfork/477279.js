// ==UserScript==
// @name         Accountloos NU+
// @namespace    https://greasyfork.org/en/scripts/477279-accountloos-nu
// @version      0.5
// @description  Toegang tot NU+ artikelen, zonder NU+.
// @author       Confusified
// @match        https://www.nu.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nu.nl
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477279/Accountloos%20NU%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/477279/Accountloos%20NU%2B.meta.js
// ==/UserScript==

(function() {
    console.log("Accountloos NU+ wordt nu geladen.");
    const nuplusholder = document.querySelector("#main > article > figure > figcaption > h1 > span")
    if (nuplusholder) {
        document.querySelector("#main > article > div.login-wall").style.display = "none";
        document.querySelector("#main > article > div.authorized-content").style.display = "block";
    }
    else {
     console.log("NU+ artikel niet gevonden.");
    }
    console.log("NU+ artikel is geladen.");
})();