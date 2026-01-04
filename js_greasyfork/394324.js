// ==UserScript==
// @name         Function Access Profile Button
// @description   This script adds a floating next item button to the function access profile screens.
// @namespace    http://tampermonkey.net/
// @include     http*://*fap*
// @version     2.2.5
// @grant          GM_addStyle
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/394324/Function%20Access%20Profile%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/394324/Function%20Access%20Profile%20Button.meta.js
// ==/UserScript==

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Next Item</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    document.getElementById("com.kronos.wfc.wtk.accessprofiles.functionaccessprofiles.action.find-next").click();
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        bottom:                    20;
        right:                   0;
        font-size:              20px;
        background:             #0A6FC1;
        border:                 1px outset black;
        margin:                 5px;
        opacity:                0.9;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );