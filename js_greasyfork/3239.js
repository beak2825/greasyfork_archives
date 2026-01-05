// ==UserScript==
// @name           Zing on Mturk
// @version        1.0
// @description  Hot keys and hidden Instructions for are these receipts the same
// @author         Cristo
// @include        https://backend.ibotta.com/duplicate_receipt_moderation*
// @copyright      2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3239/Zing%20on%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/3239/Zing%20on%20Mturk.meta.js
// ==/UserScript==

//Key A and 1 on the number pad for No, Key S and 2 on the number pad for Yes, auto submits after answer
var contain = document.getElementsByClassName("container")[0];
contain.tabIndex = "0";
contain.focus();
var inDiv = document.createElement("div");
var h1 = document.getElementsByTagName("h1")[0];
var p1 = document.getElementsByTagName("p")[0];
var p2 = document.getElementsByTagName("p")[1];
var ul = document.getElementsByTagName("ul")[0];
var hr = document.getElementsByTagName("hr")[0];
var no = document.getElementById("duplicatefalse");
var yes = document.getElementById("duplicatetrue");
var sub = document.getElementsByClassName("btn")[0];
contain.insertBefore(inDiv, contain.firstChild);
inDiv.appendChild(h1);
inDiv.appendChild(p1);
inDiv.appendChild(p2);
inDiv.appendChild(ul);
inDiv.appendChild(hr);
var but = document.createElement("button");
but.innerHTML = "Instructions"
contain.parentNode.insertBefore(but,contain);
inDiv.style.display = "none";
but.addEventListener("mousedown",function() {
    if (inDiv.style.display == "none") {
    	inDiv.style.display = "block";
    } else if (inDiv.style.display == "block") {
    	inDiv.style.display = "none";
    }}, false);
document.addEventListener("keydown",function(i) {
    if (i.keyCode == 65 || i.keyCode == 97) {
        no.click();
        sub.click();
    }
    if (i.keyCode == 83 || i.keyCode == 98) {
        yes.click();
        sub.click();
    }}, false);