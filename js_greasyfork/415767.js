// ==UserScript==
// @name        Twitchls Button
// @description Adds a button to twitch pages to change to twitchls
// @author      chibby
// @match       *://*.twitch.tv/*
// @grant       GM_addStyle
// @version     1.1
// @namespace https://greasyfork.org/users/702968
// @downloadURL https://update.greasyfork.org/scripts/415767/Twitchls%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/415767/Twitchls%20Button.meta.js
// ==/UserScript==

/*--- Button
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Go to Twitchls</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {

    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'Button clicked.';
    document.getElementById ("myContainer").appendChild (zNode);

    var url = window.location.href;
    window.location = url.replace('www.twitch.tv', 'twitchls.com');
}

GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   700px;
        font-size:              15px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
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