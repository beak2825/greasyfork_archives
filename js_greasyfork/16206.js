// ==UserScript==
// @name        GW-Editer ON
// @include     https://www.htacademy.org/
// @include     http://game.galaxywarfare.com*
// @version     1
// @namespace   http://hairballtech.wix.com/hb-chat
// @description EDIT THINGS LIKE A BOSS
// @downloadURL https://update.greasyfork.org/scripts/16206/GW-Editer%20ON.user.js
// @updateURL https://update.greasyfork.org/scripts/16206/GW-Editer%20ON.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton2" type="button">'
                + 'Editer On</button>'
                ;
zNode.setAttribute ('id', 'myContainer2');
document.body.appendChild (zNode);


document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = document.body.contentEditable='true'; document.designMode='on'; void 0;
    zNode.innerHTML = '';
    document.getElementById ("myContainer2").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer2 {
        position:               fixed;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 0px outset black;
        margin:                 52px 12px;
        opacity:                10;
        z-index:                1000;
        padding:                0px 0px;
    }
    #myButton2 {
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