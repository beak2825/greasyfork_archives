// ==UserScript==
// @name         Hide Google Universal Analytics 2023 Message
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script hides the annoying Google Analytics 2023 deprecation message.
// @author       Liquidus
// @match        https://analytics.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450691/Hide%20Google%20Universal%20Analytics%202023%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/450691/Hide%20Google%20Universal%20Analytics%202023%20Message.meta.js
// ==/UserScript==


setTimeout(myFunction, 3000)

function myFunction() {
    var x = document.getElementsByClassName("ng-star-inserted")[0];
    if (x) {
                x.style.display = "none";
            }
}