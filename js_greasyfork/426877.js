// ==UserScript==
// @name         Use ArticleID on Wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace the URL with ArticleID and make it linkable!
// @author       Jakarta Read-only Brothers
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426877/Use%20ArticleID%20on%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/426877/Use%20ArticleID%20on%20Wikipedia.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const url = location.origin + "/?curid=" + RLCONF.wgArticleId + location.hash;
    history.replaceState(null, "", url);
})();
