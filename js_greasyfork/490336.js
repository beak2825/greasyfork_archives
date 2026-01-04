// ==UserScript==
// @name         WSIS Script
// @namespace    http://yu.net/
// @version      2024-03-19
// @description  Just Script WSIS
// @author       Yu
// @match        https://www.itu.int/net4/wsis/stocktaking/Prizes/2024/*
// @exclude      https://www.itu.int/net4/wsis/stocktaking/Prizes/2024/Vote*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itu.int
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490336/WSIS%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/490336/WSIS%20Script.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const autoVote = await GM_getValue("autoVote");
    if(autoVote) {
        await GM_setValue("autoVote", false);
    }
})();