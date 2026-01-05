// ==UserScript==
// @name        Admin Tool - Close
// @include     http://game.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16709/Admin%20Tool%20-%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/16709/Admin%20Tool%20-%20Close.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton6" type="button">'
                + '|||~Close~</button>'
                ;
zNode.setAttribute ('id', 'myContainer6');
document.body.appendChild (zNode);


document.getElementById ("myButton6").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    closeModal();
    zNode.innerHTML = '';
    document.getElementById ("myContainer6").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer6 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 3px outset #66ff66;
        margin:                 710px 1158px;
        opacity:                10;
        z-index:                9000;
        padding:                0px 0px;
    }
    #myButton6 {
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