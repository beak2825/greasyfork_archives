// ==UserScript==
// @name        Admin Tool - Collect
// @include     http://game.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16710/Admin%20Tool%20-%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/16710/Admin%20Tool%20-%20Collect.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton3" type="button">'
                + '|~Collect~</button>'
                ;
zNode.setAttribute ('id', 'myContainer3');
document.body.appendChild (zNode);


document.getElementById ("myButton3").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = acquireObject();
    zNode.innerHTML = '';
    document.getElementById ("myContainer3").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer3 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 3px outset #66ff66;
        margin:                 596px 1158px;
        opacity:                10;
        z-index:                9000;
        padding:                0px 0px;
    }
    #myButton3 {
         color:                 #000000;
    background:                 #ff5353;
        cursor:                 pointer;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') 
            .replace (/\s*\*\/\s*\}\s*$/, '')   
            .replace (/\/\/.+$/gm, '')
            ;
    return str;
}