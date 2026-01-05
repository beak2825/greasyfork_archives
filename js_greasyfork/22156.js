// ==UserScript==
// @name        Hide GamersGlobal Comments
// @description Blendet Kommentare aus
// @include     http*://*.gamersglobal.de/*
// @grant       GM_addStyle
// @version 0.0.1.20160810131109
// @namespace https://greasyfork.org/users/59373
// @downloadURL https://update.greasyfork.org/scripts/22156/Hide%20GamersGlobal%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/22156/Hide%20GamersGlobal%20Comments.meta.js
// ==/UserScript==

//hide Comments
{
  var div1 = document.getElementById('comments');
  if (div1) {
     div1.style.display = "none"
  }
}


/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/

var zNode       = document.createElement('div');
zNode.innerHTML = '<button id="hideCommentsButton" type="button">'
                + 'Toggle Comments</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("hideCommentsButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    var div = document.getElementById('comments');
    if (div.style.display == "block") {
       div.style.display = "none";
    } else {
       div.style.display = "block";
    }
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               fixed;
        top:                    0;
        left:                   8em;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                120;
        padding:                5px 20px;
    }
    #hideCommentsButton {
        cursor:                 pointer;
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