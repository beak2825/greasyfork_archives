// ==UserScript==
// @name        Fili.tv kopiowanie
// @description Kopiuje embed
// @include     https://fili.cc/serial/*
// @grant       GM_addStyle
// @grant    GM_setClipboard
// @version 1.0
// @namespace https://greasyfork.org/users/180386
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/40930/Filitv%20kopiowanie.user.js
// @updateURL https://update.greasyfork.org/scripts/40930/Filitv%20kopiowanie.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
    + 'Kliknij here gościu</button>'
;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    var link = document.getElementById('iframe').contentDocument.getElementById('iframe').src;
    GM_setClipboard(link);
}

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               fixed;
        top:                    0;
        right:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        border-radius: 10px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
        background: none;
        border: none;
padding: 20px 20px;
    }
    #myContainer:hover {
    cursor: pointer;
    background: red;
    }

    #myContainer p {
        color:                  red;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
        .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
        .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
    ;
    return str;
}