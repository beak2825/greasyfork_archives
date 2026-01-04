// ==UserScript==
// @name         Let me Freeleech
// @namespace    https://orpheus.network/
// @version      0.2
// @description  Removes the message if you really want to use your FL Tokens and hides the DL button if FL is available.
// @author       b1100101
// @include      http*://orpheus.network/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404697/Let%20me%20Freeleech.user.js
// @updateURL https://update.greasyfork.org/scripts/404697/Let%20me%20Freeleech.meta.js
// ==/UserScript==

var td_info = document.getElementsByClassName('td_info');
var td_dl = null;

for (var i = 0; i < td_info.length; i++) {
    for (var j = 0; j < td_info[i].children.length; j++) {
        var child = td_info[i].children[j];
        for(var k = 0; k < child.children.length; k++) {
            if(child.children[k].innerHTML == "DL"){
                td_dl = child.children[k];
            }
            if(child.children[k].innerHTML == "FL"){
                child.children[k].removeAttribute("onclick");
                td_dl.style.display = "none";
            }
        }
    }
}

