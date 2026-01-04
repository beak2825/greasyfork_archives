// ==UserScript==
// @name         Space Bar Scroll Half Page
// @namespace    https://github.com/chenshengzhi
// @version      0.0.2
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418894/Space%20Bar%20Scroll%20Half%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/418894/Space%20Bar%20Scroll%20Half%20Page.meta.js
// ==/UserScript==

function SBSHP_KeyCheck(key) {
    // Don't modify text editing
    if (key.target.nodeName == "INPUT" || key.target.nodeName == "TEXTAREA" || key.target.nodeName == "SELECT") return;
    if (key.target.hasAttribute("contenteditable") && key.target.getAttribute("contenteditable") == "true") return;
    // Don't modify certain combinations
    if (key.ctrlKey || key.altKey || key.metaKey) return;
    // If it's a space character, kill the event
    if (key.key == ' ') {
        key.stopPropagation();
        key.preventDefault();
        var offsetY = window.content.innerHeight / 2;
        if (key.shiftKey) {
            offsetY = -offsetY
        }
        window.content.scrollBy({
            top: offsetY,
            left: 0,
            behavior: "smooth"
        });
        return false;
    }
}
// Monitor the keydown event
document.addEventListener('keydown', SBSHP_KeyCheck);