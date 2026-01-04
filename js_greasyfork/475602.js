// ==UserScript==
// @name         Google Drive View & Copy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add view button to Google Drive /copy links
// @author       reesericci
// @match https://docs.google.com/document/*/*/*/*/*
// @match https://docs.google.com/presentation/*/*/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drive.google.com
// @grant        none
// @license      GPL-v3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/475602/Google%20Drive%20View%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/475602/Google%20Drive%20View%20%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if(window.location.pathname.match(".*copy$")) {
      let view = new URL(window.location.href)
      view.pathname = view.pathname.replace("copy", "view")

        console.log(view)

        let button = document.createElement("button")
        button.setAttribute("class", "jfk-button jfk-button-action")
        button.innerHTML = "View"

        button.addEventListener("click", () => window.location = view)

      document.getElementById("buttons").appendChild(button)
    }
})();