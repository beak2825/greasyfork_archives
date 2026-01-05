// ==UserScript==
// @name        GW-Editer OFF
// @match       https://*/*
// @namespace   http://hairballtech.wix.com/hb-chat
// @version     1.HAX m8
// @Author      HairBall
// @description gives you 'leet hax0r powers :D
// @downloadURL https://update.greasyfork.org/scripts/16393/GW-Editer%20OFF.user.js
// @updateURL https://update.greasyfork.org/scripts/16393/GW-Editer%20OFF.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton79" type="button">'
                + 'Editor Off</button>'
                ;
zNode.setAttribute ('id', 'myContainer79');
document.body.appendChild (zNode);


document.getElementById ("myButton79").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = alert("You have initated SAVE EDIT mode... are you SURE you wish to continue?");
    alert("lol no sorry scrub :D");
    close()
    window.open("http://www.staggeringbeauty.com")
    
    ;
    zNode.innerHTML = '';
    document.getElementById ("myContainer79").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer79 {
        position:               absolute;
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
    #myButton79 {
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