// ==UserScript==
// @name        Admin Tool - Claim
// @include     http://game.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16708/Admin%20Tool%20-%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/16708/Admin%20Tool%20-%20Claim.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton1" type="button">'
                + '|||~Claim~</button>'
                ;
zNode.setAttribute ('id', 'myContainer1');
document.body.appendChild (zNode);


document.getElementById ("myButton1").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = claimObject();
    zNode.innerHTML = '';
    document.getElementById ("myContainer1").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer1 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 3px outset #66ff66;
        margin:                 520px 1158px;
        opacity:                10;
        z-index:                9000;
        padding:                00px 0px;
    }
    #myButton1 {
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