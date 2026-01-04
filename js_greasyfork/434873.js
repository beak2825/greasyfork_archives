// ==UserScript==
// @name         Norroth Helpers
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  Norroth General Purpose
// @author       Xortrox | Minor Changes Dragon
// @contributor  Lats
// @match        https://www.norroth.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434873/Norroth%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/434873/Norroth%20Helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const moduleName = 'Norroth General Purpose';
    const version = 0.7;

    function appendCSS(css) {
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    function loadCSS() {
        appendCSS('td>a>img {border: 1px solid #333333 !important; }');
        appendCSS('td>a>img {background: #ffffff !important; opacity:0.15 }');
        appendCSS('.tab_content .scroll { height: 250px !important; }');
        appendCSS('.equipment_item, .inv_slot, .stash_slot { position: relative; }');
        appendCSS('[data-addons-quality]::after {content: attr(data-addons-quality); position: absolute; left: 0; top: 0; padding: 3px;}');
    }

    $(document).ready(() => {
        loadCSS();

        setInterval(() => {
            $('.equipment_item, .inv_slot, .stash_slot').each(function(itemIndex, item) {
                if (!this.children[0]) { return; }
                if (!this.children[0].getAttribute('content')) { return; }

                let content = this.children[0].getAttribute('content').toLowerCase();
                if (content.includes('ring') || content.includes('necklace') || content.includes('amulet')){ return; }

                if (this.getAttribute('data-addons-quality')) { return; }

                applyQualityTag(content, this);

                applyDurabilityTag(content, item);
            });
        }, 500);
    });

    function applyQualityTag(content, slot) {
        let searchTerm = 'quality:';
        let indexStart = content.indexOf(searchTerm);
        if (indexStart === -1) { return; }

        let quality = content.substr(indexStart)
        quality = quality.substr(0, quality.indexOf('<br>'));
        quality = quality.substr(searchTerm.length);
        slot.setAttribute('data-addons-quality', `Q${quality}`);
    }

    function applyDurabilityTag(content, item) {
        let searchTerm = 'durability:';

        let durStart = content.indexOf(searchTerm);
        if (durStart === -1) { return; }

        item = $(item);
        let customOverlay = item.find('.custom-overlay');
        if (customOverlay.length === 0) {
            customOverlay = document.createElement('div');
            customOverlay.setAttribute('style', 'background: transparent; position: absolute; right:0; bottom:0; padding-right: 3px; pointer-events: none;');

            let durability = content.substr(durStart)
            durability = durability.substr(0, durability.indexOf('/'));
            durability = durability.substr(searchTerm.length);

            customOverlay.innerHTML = `${durability}`;
            item.append(customOverlay);
            customOverlay = $(customOverlay);
        }
    }
})();
