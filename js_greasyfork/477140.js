// ==UserScript==
// @name         Redirect Fandom to GG wiki
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto forward any attempts to visit a fandom wiki site to the gg variant, if it exists
// @author       /u/delfofthebla/
// @match        https://*.fandom.com/wiki*
// @icon         https://www.google.com/s2/favicons?domain=fandom.com
// @require      https://cdn.jsdelivr.net/npm/ping.js@0.3.0/dist/ping.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477140/Redirect%20Fandom%20to%20GG%20wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/477140/Redirect%20Fandom%20to%20GG%20wiki.meta.js
// ==/UserScript==

var currentURL = window.document.location.toString();
if (currentURL.includes("fandom.com")) {
    var p = new Ping();

	var newURL = currentURL.replace("fandom.com", "wiki.gg");

    var pathArray = newURL.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var baseUrlTarget = protocol + '//' + host;

    p.ping(baseUrlTarget)
        .then(data => {
            window.document.location.replace(newURL);
        })
        .catch(data => {
            console.error("No Fandom alternative found: " + data);
        })
}