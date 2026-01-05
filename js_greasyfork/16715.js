// ==UserScript==
// @name        GW-Fuel Up
// @include     http://game.galaxywarfare.com*
// @description button
// @version     1
// @namespace https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/16715/GW-Fuel%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/16715/GW-Fuel%20Up.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton658" type="button">'
                + 'Refuel</button>'
                ;
zNode.setAttribute ('id', 'myContainer658');
document.body.appendChild (zNode);


document.getElementById ("myButton658").addEventListener (
    "click", ButtonClickAction, true
);

function ButtonClickAction (zEvent) {
   
    var zNode       = callWorkerForContentNoScroll('shop','');
        purchaseItem('31B32428-1998-61C8-F8CD-C5F4BC434A31');
        cpurchaseItem('31B32428-1998-61C8-F8CD-C5F4BC434A31');
        callWorkerForContentNoScroll('items','');
    callWorkerForContentNoScrollNoLoading('items','&useall={31B32428-1998-61C8-F8CD-C5F4BC434A31}');
    callWorkerForContentNoScrollNoLoading('items','&cuseall={31B32428-1998-61C8-F8CD-C5F4BC434A31}');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    callWorkerForContentNoScroll('universe','');
    ;    
    document.getElementById ("myContainer658").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer658 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              12px;
        background:             ;
        border:                 0px outset black;
        margin:                 800px 1160px;
        opacity:                10;
        z-index:                1000;
        padding:                0px 0px;
    }
    #myButton658 {
         color:                 #006400;
    background:                 #99ff66;
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