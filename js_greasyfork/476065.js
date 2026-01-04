// ==UserScript==
// @name         Redirect to New Minecraft Wiki
// @namespace    https://gist.github.com/andre-paulo98/6d2cd3875d88c9435e2ab594a3f4d0dc
// @version      1.0
// @description  Redirect automatically from the old Minecraft Wiki (Fandom) to the new Wiki
// @author       andre-paulo98
// @match        https://minecraft.fandom.com/wiki/*
// @icon         https://minecraft.wiki/favicon.ico
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476065/Redirect%20to%20New%20Minecraft%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/476065/Redirect%20to%20New%20Minecraft%20Wiki.meta.js
// ==/UserScript==

(function() {
    // only move the english wiki
    if((location.host + location.pathname).indexOf("minecraft.fandom.com/wiki") == 0) {
        location.replace(location.protocol + "//minecraft.wiki" + location.pathname + location.search + location.hash);
    }
})();