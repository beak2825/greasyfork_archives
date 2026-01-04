// ==UserScript==
// @name         IdlePixel market tax calculator
// @namespace    com.idlepixel
// @version      1.0.0
// @description  Market detax feature. Should work with or without the market overhaul script.
// @author       Apkhoil
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20230311
// @downloadURL https://update.greasyfork.org/scripts/461647/IdlePixel%20market%20tax%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/461647/IdlePixel%20market%20tax%20calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MyDetaxPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("marketDetax", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
        }

        onLogin() {
            this.addDetaxButtons();
        }

        addDetaxButtons() {
            const sellModal = $("#modal-market-configure-item-to-sell");
            const sellPriceInput = sellModal.find("#modal-market-configure-item-to-sell-price-each").after(`
              <button type="button" onclick="IdlePixelPlus.plugins.marketDetax.detax()">detax</button>
            `);

            const addToMarketButton = sellModal.find('input.background-primary.hover').after(`
              <button type="button" class="background-primary hover" onclick="IdlePixelPlus.plugins.marketDetax.detax();Market.post_item()">Add to Market after detax</button>
            `);
        }

        detax() {
            const value = document.querySelector('#modal-market-configure-item-to-sell-price-each').value;
            const newValue = Math.floor(value / 1.01);
            $("#modal-market-configure-item-to-sell-price-each").val(newValue);

            try {
                //Integration with the market overhaul extension: it updates the total price.
                if(IdlePixelPlus.plugins.market != undefined) {
                    IdlePixelPlus.plugins.market.applyTotalSell();
                }
            } catch(err) {
                console.warning("There is some problem with the integration with the market overhaul extension. Can't update the total price.")
            }
        }

    }

    const plugin = new MyDetaxPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();