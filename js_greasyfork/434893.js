// ==UserScript==
// @name         BGA Agricola UI Improver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes to the Agricola user interface on Boardgame Arena
// @author       torvaldur_makan
// @match        https://boardgamearena.com/*/agricola*
// @icon         https://www.google.com/s2/favicons?domain=boardgamearena.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434893/BGA%20Agricola%20UI%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/434893/BGA%20Agricola%20UI%20Improver.meta.js
// ==/UserScript==


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


window.onload = async function() {
    await sleep(1000); // Wait for BGA to load dojo

    // Find player-ids
    var boards = document.querySelectorAll("#player_boards [id^='overall_player_board_']");

    for (let i=0; i < boards.length; i++) {
        var pid = boards[i].id.substring(21);

        // Move info
        var resource = document.getElementById("overall_player_board_"+pid);//.cloneNode(true)
        document.getElementById("board-"+pid).before(resource);

        // Hide remaining persons as it is inaccurate
        addGlobalStyle('#board_resource_'+pid+'_farmer { visibility: hidden !important;}');
    }

    document.querySelectorAll(".player-board-name").remove();

    addGlobalStyle('.agricola-player-board { height: 250px !important;}');
    addGlobalStyle('.player-board-grid { grid-template-columns: repeat(5,18px 60px) 18px !important;; grid-template-rows: repeat(3,18px 60px) 18px !important; }');
    addGlobalStyle('.player_board_inner { font-size: 16px !important;}');

    addGlobalStyle('.farm-resource-panel-class { width: 370px !important;}');
    addGlobalStyle('.player-board-wrapper { max-width: 400px !important;}');

    addGlobalStyle('.agricola-meeple { transform: scale(1.0) !important;}');
    addGlobalStyle('.fence-ver { height: 54px !important;}');
};