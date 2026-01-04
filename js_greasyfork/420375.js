// ==UserScript==
// @name Idlescape CCS
// @namespace idlescape.com
// @version 1.0.0
// @description Various CSS fixes for Idlescape
// @author Sponsorn
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match https://idlescape.com/game
// @downloadURL https://update.greasyfork.org/scripts/420375/Idlescape%20CCS.user.js
// @updateURL https://update.greasyfork.org/scripts/420375/Idlescape%20CCS.meta.js
// ==/UserScript==

(function() {
let css = `
/* Theme default changes */
.theme-default {
    /* This darkens the black and white background */
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.9)), url(/images/background_basic.svg)
}

/* combat-area changes */
.combat-fight {
    height: 520px;
    width: 860px;
    grid-template-columns: 250px 200px 630px;
}

.core-container-combat {
    height: auto;
    /*increases usable space inside the combat zone area */
}

.combat-gear-inventory {
    justify-content: center;
}

/* changes monsters name/health text */
.combat-monster-area p {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

/* changes monsters health bar */
.combat-monster-area progress {
    z-index: 10 !important;
    opacity: 0.9 !important;
    /* makes health bar get rounded corners */
    border-radius: 3px !important;
    /* needed to make health bar overflow get hidden behind rounded corners */
    overflow: hidden;
    margin: 0 0 15px 0;
}

/* changes players health number*/
.combat-player-area .combat-health {
    z-index: 10 !important;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

/* changes players health bar */
.combat-player-area progress {
    z-index: 10 !important;
    opacity: 0.95 !important;
    /* makes health bar get rounded corners */
    border-radius: 3px !important;
    /* needed to make health bar overflow get hidden behind rounded corners */    
    overflow: hidden;
}

/* moves run away button to front for smaller screens */
.combat-run-away {
    z-index: 1 !important;
    border-radius: 3px;
}

/* moves run away button to other side to compensate for z-index not working properly with tooltips */
.button-group {
    left: 250px;
    right: 0;
    text-align: left;
}

/* Chat formatting */
.message-time-stamp {
    letter-spacing: -0.5px;
}

.christmas-tier3 {
    /* decreases the intensity of tier 3 items in chat */
    box-shadow: 0 0 5px 0 red;
}


/* Marketplace formatting */
.marketplace-item-name {
    /* Increases font-size by 1px */
    font-size: 15px;
}
.enchanted-text {
    /* Changes color on enchanted item text */
    color: #f5593d;
}

#lowest-price {
    /* increases font size of "current lowest price" in sell pop up */
    font-size: 12px;
}

/* these don't work atm
.status-bar {
    z-index: 25 !important;
}

.__react_component_tooltip.type-dark{
    z-index: 300 !important;
}
*/
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
