// ==UserScript==
// @name         MTV Redirect to Shibboleth
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  autologin plz
// @author       tippfehlr
// @match        https://mtv.math.kit.edu/login
// @icon         https://kit.edu/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523644/MTV%20Redirect%20to%20Shibboleth.user.js
// @updateURL https://update.greasyfork.org/scripts/523644/MTV%20Redirect%20to%20Shibboleth.meta.js
// ==/UserScript==

window.location.replace("/shibboleth");