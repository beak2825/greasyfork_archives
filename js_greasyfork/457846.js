// ==UserScript==
// @name         Adfly Skipper
// @namespace    https://github.com/charlie-moomoo
// @version      0.1
// @description  This script does almost all the work for you, letting you skip Adfly. (except Click here to continue)
// @author       CharlieMoomoo
// @match        *://*/*
// @icon         https://play-lh.googleusercontent.com/Tie7kj_sUJacI3b6d618rKbJJx-FjEduZyuWK5hBLDeHI-Qme1hBYNOE0gTM3CATD6Am
// @grant        window.onurlchange
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457846/Adfly%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/457846/Adfly%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tryClick = ()=>{
        if (!document.querySelector(".mwButton")) return
        document.querySelector(".mwButton").click()
    }
    const run = ()=>{
        if (!location.pathname.startsWith("/pushredirect")) return
        return window.location.replace(decodeURIComponent(location.search.split("&dest=")[1]))
    }
    run()
    setInterval(tryClick,1000)
    window.addEventListener("urlchange",run)
})();