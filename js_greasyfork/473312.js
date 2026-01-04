// ==UserScript==
// @name        E4ward copy to clipboard
// @description Creates a button you can click which copies the newly created alias to clipboard.
// @namespace   E4ward_copy
// @include     https://www.e4ward.com/forwards?*
// @version     0.2
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=e4ward.com

// @downloadURL https://update.greasyfork.org/scripts/473312/E4ward%20copy%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/473312/E4ward%20copy%20to%20clipboard.meta.js
// ==/UserScript==

let msg = document.getElementById("errorMessage")

if (msg) {
	let parts = msg.innerHTML.split(" ")
    let email = parts[1]

	let btn = document.createElement("button");
	btn.innerHTML = "Copy to clipboard (Shift-Alt-C)";
	btn.accessKey = "c"
	btn.onclick = function() {navigator.clipboard.writeText(email); msg.innerHTML += " Copied!"}
  msg.appendChild(btn)

//  msg.parentNode.insertBefore(btn, msg.nextSibling);

}

addAccessKey('addButton', 'a')
addAccessKey('updateButton', 'u')
addAccessKey('deleteButton', 'r')

function addAccessKey(id, letter) {
  let text = '<span style="color:#888">(Shift-Alt-' + letter.toUpperCase() + ')</span>'

  document.getElementById(id).accessKey = letter
  document.getElementById(id).insertAdjacentHTML('afterend', text);
}

document.getElementById("idMailTo").remove()