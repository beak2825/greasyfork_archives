// ==UserScript==
// @name         GeorgeBaileyButton
// @namespace    GeorgeBailey.GeorgeBailey
// @version      0.3
// @description  GeorgeBailey
// @author       GeorgeBailey
// @match        https://forum.mafiascum.net/viewtopic.php*
// @icon         https://www.google.com/s2/favicons?domain=mafiascum.net
// @downloadURL https://update.greasyfork.org/scripts/424718/GeorgeBaileyButton.user.js
// @updateURL https://update.greasyfork.org/scripts/424718/GeorgeBaileyButton.meta.js
// ==/UserScript==

//Constructing Static Objects
var zNode = document.createElement ('input');

// Set the Visualization capacitor
zNode.setAttribute ('id', 'myContainer');
zNode.setAttribute ('type', 'button');
zNode.setAttribute ('value', 'GeorgeBailey');
zNode.setAttribute ('tabindex', '6');
zNode.setAttribute ('style', 'color: rgb(0, 0, 0)');
zNode.setAttribute ('class', 'button2');

//Selecting Query using Queryselector and the appendchild followed by the zNode being in the append child function
document.querySelector("#qr_ns_editor_div > div > fieldset.submit-buttons").appendChild (zNode);

// Initialize Hyperfunctions and thread-safe variables.
document.getElementById ("myContainer").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {

    // I hate mafia
    document.querySelector("#message-box-ns > textarea").innerHTML += "GeorgeBailey" + " ";
}