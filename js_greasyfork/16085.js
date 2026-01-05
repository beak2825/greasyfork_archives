// ==UserScript==
// @name        GW-Mission Log Button
// @description Adds the mission log button next to your mission list.
// @include     http://game.galaxywarfare.com*
// @version 1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16085/GW-Mission%20Log%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/16085/GW-Mission%20Log%20Button.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton5" type="button">'
                + 'Log</button>'
                ;
zNode.setAttribute ('id', 'myContainer5');
document.body.appendChild (zNode);


document.getElementById ("myButton5").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = callWorkerForContentNoScroll('missionlog','');
    zNode.innerHTML = '';
    document.getElementById ("myContainer5").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer5 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 0px outset black;
        margin:                 423px 1092px;
        opacity:                10;
        z-index:                222;
        padding:                0px 0px;
    }
    #myButton5 {
         color:                 #000000;
    background:                 #8f8a2c;
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