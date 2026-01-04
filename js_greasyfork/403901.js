// ==UserScript==
// @name         FSD Button
// @namespace    https://almedawaterwell.com/
// @version      1.3
// @description  Adds auto select button for FSD work order.
// @author       Luke Pyburn
// @match        https://reveal.us.fleetmatics.com/fsd/*
// @match        https://reveal.fleetmatics.com/fsd/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/403901/FSD%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/403901/FSD%20Button.meta.js
// ==/UserScript==

/*--- Create the FSD auto select button in a container div.  It will be styled and
    positioned with CSS.
*/
var multipleTransfersGlobal;
var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Select Job Details</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    window.getSelection().selectAllChildren(
    document.getElementById("side-panel")
);
    multipleTransfersGlobal = document.getElementById("description").value;
    console.log(multipleTransfersGlobal);
    GM_setClipboard(multipleTransfersGlobal);
};


//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    15px;
        right:                  200px;
        font-size:              20px;
        background:             #E30000;
        border:                 2px outset black;
        margin:                 0px;
        opacity:                0.85;
        z-index:                1100;
        padding:                5px 20px;
        border-radius:          10px;
    }
    #myButton {
        cursor:                 pointer;
        border-radius:          4px;
        align-content:             center;
    }
    #myContainer p {
        color:                  red;
        background:             white;
        align-content:             center;
    }
` );