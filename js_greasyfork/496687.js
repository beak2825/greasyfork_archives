// ==UserScript==
// @name         AWBW Power Charge Restyling
// @namespace    https://greasyfork.org/users/1062240
// @license      MIT
// @version      1.2
// @description  Removes power bar animation, adds dynamic colours, and fixes spacing
// @author       Ｖｉｎｃｅｎｔ ～ VIH & Tomás Alexander
// @match        https://awbw.amarriner.com/game.php*
// @icon         https://www.warsworldnews.com/aw/images/icons/power.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496687/AWBW%20Power%20Charge%20Restyling.user.js
// @updateURL https://update.greasyfork.org/scripts/496687/AWBW%20Power%20Charge%20Restyling.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .anim-power-bar {
            animation-iteration-count: 0 !important;
        }

        .cop-star.anim-power-bar .power-star-percent {
            background: rgba(255, 79, 78, 0.6);
            border-top: 3px solid rgba(146, 50, 67, 0.9);
            border-bottom: 3px solid rgba(146, 50, 67, 0.9);
        }

        .scop-star.anim-power-bar .power-star-percent {
            background: rgba(157, 175, 218, 0.6);
            border-top: 3px solid rgba(55, 104, 167, 0.9);
            border-bottom: 3px solid rgba(55, 104, 167, 0.9);
        }

        .player-overview-bar {
            margin-top: 5px;
        }

        .tag-co-bar {
            margin-top: 7px;
        }

        .cop-on-text {
            margin-top: -2px;
        }

        .power-buttons {
            margin-top: -3px;
        }

        .power-percent-display {
            margin-top: 7px;
        }

        .player-info-team {
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
})();