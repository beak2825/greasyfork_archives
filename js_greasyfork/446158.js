// ==UserScript==
// @name         More Ore - Weak Spot & Quest Sword Freezer
// @namespace    https://syns.studio/more-ore/
// @version      0.4
// @description  Freezes the weak spot & quest sword - Never miss again!
// @author       NoExtraSauce
// @match        https://syns.studio/more-ore/
// @icon         https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @require      https://greasyfork.org/scripts/444840-more-ore-notification/code/More%20Ore%20-%20Notification+.user.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446158/More%20Ore%20-%20Weak%20Spot%20%20Quest%20Sword%20Freezer.user.js
// @updateURL https://update.greasyfork.org/scripts/446158/More%20Ore%20-%20Weak%20Spot%20%20Quest%20Sword%20Freezer.meta.js
// ==/UserScript==

NotificationPlus?.load("Weak Spot & Quest Sword Freezer");

(function() {
    const styles = document.createElement("style");
    styles.innerHTML = `
    .game-container .game-container-left .game-container-left-top .game-container-left-top-middle .ore-wrapper .ore-sprite-wrapper .ore-sprite-container .weak-spot {
    position: static;
    margin: auto;
    }
    .ore-hp {
    margin-left: 5px;
    }

    .game-container .game-container-left .game-container-left-top .game-container-left-top-middle .ore-wrapper .ore-sprite-wrapper .ore-sprite-container .weak-spot:hover:after, .game-container .game-container-left .game-container-left-top .game-container-left-top-middle .ore-wrapper .ore-sprite-wrapper .ore-sprite-container .weak-spot:hover:before {
    border-top-color: #62ff62;
    border-bottom-color: #62ff62;
    }

    .boss-fight-container .manual-attacks-container {
    left: 80%;
    top: 45px;
    }

    .boss-fight-container .manual-attacks-container .manual-attack {
    position: static;
    border-style: solid;
    border-color: #00c2ff;
    }
    `;
    document.head.appendChild(styles);

})();
