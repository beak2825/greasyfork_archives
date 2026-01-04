// ==UserScript==
// @name         Simply the cutest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Poprawa wyglądu NI
// @author       Pepesz
// @match        https://*.margonem.pl/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474086/Simply%20the%20cutest.user.js
// @updateURL https://update.greasyfork.org/scripts/474086/Simply%20the%20cutest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    Lepsze alerty autorstwa "Beh"
    */
    $(`<style>
    .message{
        pointer-events: none !important;
    }
    .message .inner{
        color:white;
        font-size:15px;
    }

    .cooldown{
        text-shadow: -1px -1px 1px #000, -1px 1px 1px #000, 1px -1px 1px #000, 1px 1px 1px #000 !important;
    }

    .layer.interface-layer .main-column.right-column{
        background: #202020 !important;
        border: 1px solid #7e7474 !important;
        box-shadow: inset 0 0 3px 3px #000 !important;
    }

    .layer.interface-layer .main-column.right-column{
        width: 254px !important;
    }

    .layer.interface-layer .main-column.right-column .border{
        background: none !important;
    }

    .game-window-positioner .character_wrapper .stats-wrapper{
        right: 8px !important;
    }

    .right-column .inner-wrapper .battle-set-wrapper{
        left: 8px !important;
    }

    .game-window-positioner .character_wrapper .pvp-btn{
        left: 82px !important;
    }

    .game-window-positioner .inventory_wrapper .inventory-grid-bg{
        right: 8px !important;
    }

    .game-window-positioner .inventory_wrapper .bags-navigation{
        right: 8px !important;
    }

    .game-window-positioner .character_wrapper .equipment-wrapper{
        left: 8px !important;
    }

    .layer.interface-layer .main-column .extended-stats{
        top: -1px !important;
        background: #202020 !important;
        border: 1px solid #7e7474 !important;
        box-shadow: inset 0 0 3px 0px #000 !important;
    }

    .bottomItem .amount, .item .amount{
        border: none !important;
        bottom: 1px !important;
        right: 1px !important;
    }

    .layer.interface-layer .main-column.left-column .border{
        background: none !important;
    }

    .b_wrapper{
        width: 234px !important;
    }

    .addonDisplay-hide-bag{
        left: 69px !important;
    }

    .addonDisplay-single-wrapper{
        padding: 5px 0px 0px 0px !important;
    }

</style>`).appendTo('head');

})();