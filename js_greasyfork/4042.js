// ==UserScript==
// @name       Roblox Signature
// @version    1.0
// @description Auto-inserts signature in posts.
// @match http://www.roblox.com/Forum/AddPost.aspx*
// @namespace https://greasyfork.org/users/4386
// @downloadURL https://update.greasyfork.org/scripts/4042/Roblox%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/4042/Roblox%20Signature.meta.js
// ==/UserScript==

var sig = GM_getValue("sig", "Press 'Edit Signature' to change this!");

var textbox = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostBody");
var postButton = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PostButton")
var buttonParent = postButton.parentElement;

var button = document.createElement("Input");

function editSig() {
    var newsig = prompt("Input your new signature:");
    if (newsig == "") return;
    textbox.value = textbox.value + "\n\n" + newsig;
    GM_setValue("sig",newsig);
}

button.type = "button";
button.id = "rblxsig";
button.value = " Edit Signature ";
button.className = "translate btn-control btn-control-medium";
button.onclick = function() { editSig() };

buttonParent.innerHTML =  "&nbsp" + buttonParent.innerHTML;
buttonParent.insertBefore(button, buttonParent.firstChild);
if (textbox.value.search("\n\n" + sig) == -1) {
    textbox.value = textbox.value + "\n\n" + sig;
}