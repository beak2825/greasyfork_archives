// ==UserScript==
// @name         IdlePixel Market Overhaul Addon
// @namespace    com.zlef.idlepixel
// @version      0.1
// @description  Small addon for GodofNades Market Overhaul Fork
// @author       Zlef
// @license MIT 
// @match        https://idle-pixel.com/login/play/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476549/IdlePixel%20Market%20Overhaul%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/476549/IdlePixel%20Market%20Overhaul%20Addon.meta.js
// ==/UserScript==
// Todo: Add require for market overhaul plugin

class ZlefsMarketAddon {
    constructor() {
        $(document).on('click', '#modal-market-select-item-section .market-tradable-item', this.handleItemClick.bind(this));
    }

    fetchItemNameAndQuery() {
        const itemName = $("#modal-market-configure-item-to-sell-label").text();

        if (!itemName) {
            return;
        }

        const itemNameForQuery = itemName.toLowerCase().replace(/\s/g, '_');
        const queryUrl = `https://idle-pixel.com/market/browse/${itemNameForQuery}/`;

        console.log(queryUrl);
    }

    handleItemClick() {
        setTimeout(this.fetchItemNameAndQuery.bind(this), 100);
    }
}

(function() {
    'use strict';

    const addon = new ZlefsMarketAddon();

})();
