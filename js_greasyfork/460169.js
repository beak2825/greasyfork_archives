// ==UserScript==
// @name Add Floating Compose Button on Elk
// @namespace https://elk.zone
// @version 0.1
// @description A personal use case.
// @match https://elk.zone/*
// @license MIT
// @require http://code.jquery.com/jquery-latest.js
// @require https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @grant GM_addStyle
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/460169/Add%20Floating%20Compose%20Button%20on%20Elk.user.js
// @updateURL https://update.greasyfork.org/scripts/460169/Add%20Floating%20Compose%20Button%20on%20Elk.meta.js
// ==/UserScript==

//reference: https://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey
//reference: https://codepen.io/androidcss/pen/yOopGp

var zNode = document.createElement ('div');

zNode.innerHTML = '<button id="float" type="button"><i class="fa fa-plus" /></button>';
zNode.setAttribute ('id', 'float');
document.body.appendChild (zNode);

document.getElementById ("float").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    location.href = "https://elk.zone/compose";
}

GM_addStyle (
    `
    #float{
        position:fixed;
        width:60px;
        height:60px;
        bottom:70px;
        right:40px;
        background-color:#CE8430;
        color:#FFF;
        border-radius:50px;
        text-align:center;
        box-shadow: 2px 2px 3px #999;
    }

    #my-float{
        margin-top:22px;
    }
`
);