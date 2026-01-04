// ==UserScript==
// @name        IMDb Id button copy
// @license MIT
// @description Adds live button for imdb id
// @match       https://www.imdb.com/title/*
// @grant       GM_addStyle
// @version 0.0.1.20230806124840
// @namespace https://greasyfork.org/users/1145411
// @downloadURL https://update.greasyfork.org/scripts/472558/IMDb%20Id%20button%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/472558/IMDb%20Id%20button%20copy.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'CopyID'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    constante=window.location.href
    truc=constante.substring(constante.indexOf('/tt') + 1, constante.lastIndexOf('/'))
    navigator.clipboard.writeText(truc)
    var zNode       = document.createElement ('p');
    zNode.innerHTML = 'The button was clicked.';
    document.getElementById ("myContainer").appendChild (zNode);
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
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