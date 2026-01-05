// ==UserScript==
// @name         YouTube SubStart
// @version      1.1
// @namespace    ILoveCats
// @description  Makes subscriptions the default YouTube start page.
// @author       Mikael Porttila
// @match        https://www.youtube.com/
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/11188/YouTube%20SubStart.user.js
// @updateURL https://update.greasyfork.org/scripts/11188/YouTube%20SubStart.meta.js
// ==/UserScript==

window.location = "https://www.youtube.com/feed/subscriptions";