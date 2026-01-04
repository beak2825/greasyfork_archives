// ==UserScript==
// @name        thingiverse download button
// @description fix thingiverse download all function.
// @match       *://www.thingiverse.com/thing:*
// @grant       GM_addStyle
// @version     1.0
// @namespace   www.thingiverse.com_download

// @downloadURL https://update.greasyfork.org/scripts/439474/thingiverse%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/439474/thingiverse%20download%20button.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
    // @require http://code.jquery.com/jquery-latest.js
*/
var zNode = document.createElement ('div');
zNode.innerHTML = '<div id="myButton" class="button button-primary"><div style="background-image: url(&quot;data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTIgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU4ICg4NDY2MykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+ZG93bmxvYWQgYnV0dG9uIGNvcHk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICAgIDxnIGlkPSJ0aGluZy1wYWdlLXdpdGgtb3ZlcmxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNzAuMDAwMDAwLCAtODguMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9ImRvd25sb2FkLWJ1dHRvbi1jb3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTcwLjAwMDAwMCwgODkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlN0cm9rZS0xLUNvcHktOSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcG9pbnRzPSIxMiA1IDUuOTcxNzE4MDUgMTEgMCA1LjA1NzU5Mjc1Ij48L3BvbHlsaW5lPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwxMCIgaWQ9IkxpbmUtMi1Db3B5LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDAwMDAwLCA1LjAwMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTYuMDAwMDAwLCAtNS4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=&quot;); background-position: center center; background-repeat: no-repeat;" class="i-button left"><span id="myButton2">下载</span></div></div>';
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

document.getElementById ("myButton2").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    if (window.location.href.indexOf("/files")>=0) {
        window.location.href=window.location.href.replace("/files","/zip");
    }
    else {
        window.location.href=window.location.href+"/zip";
    }
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 40px;
        background: #bd1407;
    }
    #myButton {
        cursor:                 pointer;
        padding:                5px 40px;
    }
` );