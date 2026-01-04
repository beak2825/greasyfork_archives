// ==UserScript==
// @name         Pop Up Hotkeys
// @description  relays key presses from pop up to hit
// @author       DCI
// @namespace    https://www.redpandanetwork.org
// @version      1.1
// @include      *
// @icon         https://i.imgur.com/gTzrm0n.jpg
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393733/Pop%20Up%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/393733/Pop%20Up%20Hotkeys.meta.js
// ==/UserScript==

if (window.opener){
    window.opener.postMessage({popUp: "here"},"*");
}
window.onload = function(){
    if (window.name.match("popUp")){
        document.addEventListener("keydown", function(e){
            if (window.getSelection) {
                let text = window.getSelection().toString();
                window.opener.postMessage({text: text, key: e.keyCode, url: location.href},"*");

            }
            else {
                window.opener.postMessage({key: e.keyCode, url: location.href},"*");
            }
        });
    }
}