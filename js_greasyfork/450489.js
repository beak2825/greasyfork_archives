// ==UserScript==
// @name        Google Image Section Remover
// @description Removes the image section from the google search results, if it is displayed.
// @author      Daniel Niccoli
// @version     1.0
// @namespace   https://github.com/danielniccoli/userscripts
// @homepageURL https://github.com/danielniccoli/userscripts
// @supportURL  https://github.com/danielniccoli/userscripts/issues
// @license     https://github.com/danielniccoli/userscripts/blob/main/LICENSE
// @match       https://www.google.com/search
// @downloadURL https://update.greasyfork.org/scripts/450489/Google%20Image%20Section%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/450489/Google%20Image%20Section%20Remover.meta.js
// ==/UserScript==

const targetElement = document.getElementById("iur").closest("#rso > div").remove()
