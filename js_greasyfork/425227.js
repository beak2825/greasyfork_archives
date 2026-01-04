// ==UserScript==
// @name         copy url
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425227/copy%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/425227/copy%20url.meta.js
// ==/UserScript==


    function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}
function wait_for_bar(){

if (document.querySelector("#date > yt-formatted-string > button") == undefined) {
var copyBut = document.querySelector("#date > yt-formatted-string").appendChild(document.createElement("button"))
copyBut.innerHTML = 'copy URL'
    copyBut.onclick = function() {
       copyStringToClipboard(window.location.href.substring(0,43))
    }
}
    var but = document.querySelector("#date > yt-formatted-string > button")
but.parentNode.appendChild(but)

}
var interval1 = setInterval(wait_for_bar, 1000)