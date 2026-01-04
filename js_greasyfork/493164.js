// ==UserScript==
// @name         Darkside.se ❤️
// @namespace    darkside.se
// @version      0.2
// @description  Replace friend's plain heart symbols with a shiny red one.
// @author       Stout
// @license      MIT
// @match        https://www.darkside.se/?event=*
// @match        https://www.darkside.se/?event=*?*
// @match        https://diversia.social/?event=*
// @match        https://diversia.social/?event=*?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=darkside.se
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493164/Darksidese%20%E2%9D%A4%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493164/Darksidese%20%E2%9D%A4%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var heartElements = document.evaluate("//div[starts-with(@id, 'folklista_')]//div[starts-with(@id, 'invitedentry_')]//td/span[text()='♥']",
                                          document,
                                          null,
                                          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);

    for (let i = 0; i < heartElements.snapshotLength; ++i)
    {
        heartElements.snapshotItem(i).innerText = '❤️';
    }
})();
