// ==UserScript==
// @name         IndiHome Landing Page Skipper
// @namespace    Hans5958
// @version      1
// @description  Bypasses the IndiHome landing page that appeares on HTTP destinations.
// @copyright    Hans5958
// @license      MIT
// @match        http://welcome.indihome.co.id
// @grant        none
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444660/IndiHome%20Landing%20Page%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/444660/IndiHome%20Landing%20Page%20Skipper.meta.js
// ==/UserScript==

function a() {
    var href = document.querySelector(".footer a").href
    console.log(href)
    if (!href) {a(); return}
    document.body.innerHTML="<h1>Skipping landing page...</h1>"
    window.title = "Skipping landing page..."
    document.location.replace(href)
}

a()
