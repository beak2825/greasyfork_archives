// ==UserScript==
// @name        Instant Chimichanga FTW
// @description Make Deadpool's dreams come true.
// @namespace   http://hairballtech.wix.com/hb-chat
// @version     1.Chimichanga
// @match       http://*/*
// @match       https://*/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16342/Instant%20Chimichanga%20FTW.user.js
// @updateURL https://update.greasyfork.org/scripts/16342/Instant%20Chimichanga%20FTW.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton069" type="button">'
                + 'Insta-Chimey!</button>'
                ;
zNode.setAttribute ('id', 'myContainer069');
document.body.appendChild (zNode);

document.getElementById ("myButton069").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    
    var zNode       = window.open("https://www.google.com/search?q=chimichanga&espv=2&biw=1366&bih=643&source=lnms&tbm=isch&sa=X&ved=0ahUKEwie7NPOr7LKAhWJ8CYKHWTODzkQ_AUIBigB")
    zNode.innerHTML = 
    document.getElementById ("myContainer069").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer069 {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              16px;
        background:             ;
        border:                 5px outset black;
        margin:                 50px 18px;
        opacity:                10;
        z-index:                9999;
        padding:                0px 00px;
    }
    #myButton069 {
        color:                  #ff0000;
    background:                 #ffff99;
        cursor:                 pointer;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') 
            .replace (/\/\/.+$/gm, '') 
            ;
    return str;
}