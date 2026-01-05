// ==UserScript==
// @name         auto mvu by Ramdhan Nama Quh
// @namespace    http://freedhan.co.cc/
// @version      0.04
// @description  new mvu pereview by Ramadhan Nama Quh
// @author       Ramadhan view
// @match        http://*www.imvu.com/peer_review/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14028/auto%20mvu%20by%20Ramdhan%20Nama%20Quh.user.js
// @updateURL https://update.greasyfork.org/scripts/14028/auto%20mvu%20by%20Ramdhan%20Nama%20Quh.meta.js
// ==/UserScript==

var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + '<a href="http://freedhan.co.cc" target="_blank">Powered by adan!</a></button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    document.getElementById ("myContainer").appendChild (zNode);
}

GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        background:             blue;
        border:                 2px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                222;
        padding:                5px 20px;
        font-family:         tahoma;
    }
    #myButton {
        cursor:                 pointer;
        background:            transparent;
    }
    
    #myButton a {
        cursor:                 pointer;
        font-weight:         bold;
        color:               red;
        font-family:         tahoma;
    }
    
    #myContainer p {
        color:                  blue;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '')
            ;
    return str;
}

var evt = document.createEvent ("HTMLEvents");
evt.initEvent ("click", true, true);
document.getElementById('view_in_3d').dispatchEvent (evt);
$('cb_no_issues').prop('checked', true);
window.setTimeout("document.getElementById('yui-main').getElementsByTagName('form')[0].submit();", 25000);