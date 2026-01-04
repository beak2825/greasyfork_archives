// ==UserScript==
// @name        LechessAnalysis
// @namespace   pwa
// @match       https://*chess.com/*
// @icon https://chess.com/favicon.ico
// @license MIT
// @grant       none
// @version     1.0
// @author      pwa
// @description 14/6/2023, 4:54:57 PM
// @downloadURL https://update.greasyfork.org/scripts/468984/LechessAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/468984/LechessAnalysis.meta.js
// ==/UserScript==


function openLechess() {
    url = "https://lichess.org/analysis/fromPosition/" + window.game.fen.replaceAll(/ /g, "_");
    window.open(url)
    // win.location.reload();
}

function createInput(type) {
    let elt = document.getElementById("fenview");
    if (elt !== null)
        return elt;

    cnt = document.getElementsByClassName("messages-container-messages-container");
    if (cnt.length < 1) {
        //console.log("error, no messages-container-messages-container")
        return false;
    }

    if (document.forms.length < 1) {
        //console.log("error, messages-container-messages-container.forms is empty")
        return false;
    }

    if (document.forms.elements < 1) {
        //console.log("error, messages-container-messages-container.forms.elements is empty")
        return false;
    }

    console.log("creating fenview")

    elt = document.createElement("input");
    if (!elt) {
        console.log("error, unable to create fenview");
        return null;
    }

    cnt[0].appendChild(elt);

    elt.setAttribute("type", type);
    elt.setAttribute("name", type);
    elt.setAttribute('id', 'fenview');
    elt.setAttribute('class', 'chat-bubble-component');
    elt.setAttribute('font-size', '1em');
    elt.value = window.game.fen;

    elt.onclick = () => {
        elt.value = "PGN copied to clipboard";
        navigator.clipboard.writeText(window.game.pgn);
        openLechess()
    }

}

setInterval(function() {
    let elt = createInput(document.forms[0].elements[0].value)
    if (elt) {
        elt.value = "Leechess: " + window.game.fen;
    }
}, 1000);

