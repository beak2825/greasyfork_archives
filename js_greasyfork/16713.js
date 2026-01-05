// ==UserScript==
// @name        Admin Tool - Repair
// @include     http://game.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16713/Admin%20Tool%20-%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/16713/Admin%20Tool%20-%20Repair.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton2" type="button">'
                + '|~Repair~</button>'
                ;
zNode.setAttribute ('id', 'myContainer2');
document.body.appendChild (zNode);


document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = repairObject();
    zNode.innerHTML = '';
    document.getElementById ("myContainer2").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer2 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 3px outset #66ff66;
        margin:                 558px 1158px;
        opacity:                10;
        z-index:                9000;
        padding:                0px 0px;
    }
    #myButton2 {
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