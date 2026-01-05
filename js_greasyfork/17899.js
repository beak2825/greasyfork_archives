// ==UserScript==
// @name        GW-Access Base bri
// @include     http://game.galaxywarfare.com*
// @include     http://dev.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/17899/GW-Access%20Base%20bri.user.js
// @updateURL https://update.greasyfork.org/scripts/17899/GW-Access%20Base%20bri.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Base</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);


document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = storeItems(703697);
    zNode.innerHTML = '';
    document.getElementById ("myContainer").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 0px outset black;
        margin:                 480px 1082px;
        opacity:                10;
        z-index:                9000;
        padding:                0px 0px;
    }
    #myButton {
         color:                 #00ff00;
    background:                 #313131;
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