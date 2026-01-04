// ==UserScript==
// @name         Contextmenu Listener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google Search Set
// @author       You
// @include        *
// @grant           GM_openInTab
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/432648/Contextmenu%20Listener.user.js
// @updateURL https://update.greasyfork.org/scripts/432648/Contextmenu%20Listener.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let clipboard
    document.addEventListener('cliplink',(e)=>{
    GM_openInTab(e.data.link+clipboard);});
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
document.addEventListener('contextmenu', e => {
    let selectText=getSelectionText();
if(selectText.length>0){clipboard=selectText; }
    else if(e.target.textContent.length>0){clipboard=e.target.textContent;}

});
})();