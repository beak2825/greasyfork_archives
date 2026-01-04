// ==UserScript==
// @name         BitSeven Hide Buy Buttons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevent hitting the buy buttons accidently on Bitseven. We'll hide/unhide them with a double click. 
// @author       LordSnooze
// @match        https://www.bitseven.com/Trading
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403946/BitSeven%20Hide%20Buy%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/403946/BitSeven%20Hide%20Buy%20Buttons.meta.js
// ==/UserScript==


window.ondblclick = myScript;

var booDisabled = false;

//Function to clear selection when someone double clicks on a page
function clearSelection(){
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
}

function myScript() {
    var x = document.getElementById("orderForm");
    var y = x.getElementsByTagName("div");
    var i;
    for (i = 0; i < y.length; i++) {
        if (y[i].getAttribute("class") == "order-action") {
            if(booDisabled === false){
                 y[i].hidden = true;
                booDisabled = true;
                clearSelection();
            } else {
                y[i].hidden = false;
                booDisabled = false;
                clearSelection();
            }
        }
    }
}