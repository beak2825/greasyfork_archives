// ==UserScript==
// @name         FoE Helper GBG negotiation-helper enabler
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Enables the negotiation helper when negotiating for provinces on GBG.
// @author       You
// @license      MIT
// @match        *://*.forgeofempires.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forgeofempires.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464005/FoE%20Helper%20GBG%20negotiation-helper%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/464005/FoE%20Helper%20GBG%20negotiation-helper%20enabler.meta.js
// ==/UserScript==

addEventListener("foe-helper#loaded", function() {
    'use strict';

    Negotiation.StartNegotiation = eval(Negotiation.StartNegotiation.toString().replace("responseData.context === Negotiation.CONST_Context_GBG", "false"));
});