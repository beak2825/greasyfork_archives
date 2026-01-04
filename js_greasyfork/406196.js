// ==UserScript==
// @name           Clock luglio figuccio
// @description    clock ore minuti secondi millesimi
// @version        0.7
// @match          *://*/*
// @noframes
// @author         figuccio
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license                  MIT
// @namespace https://greasyfork.org/users/237458
// @downloadURL https://update.greasyfork.org/scripts/406196/Clock%20luglio%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/406196/Clock%20luglio%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery.noConflict();
const body = document.body;
var hour12 = true;

function test() {
    const now = new Date(); // Usa l'oggetto Date per ottenere l'ora attuale
    let hours = now.getHours(); // Ottieni l'ora attuale
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Ottieni i minuti
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Ottieni i secondi
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Ottieni i millisecondi

    if (hour12) {
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Formato a 12 ore
        node.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}:${milliseconds} ${amPm}`;
    } else {
        node.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}:${milliseconds}`; // Formato a 24 ore
    }
}

var node = document.createElement('div');
node.id = "luglio";
node.title = 'trascina time';
node.setAttribute("style", "cursor:;padding:4px;background:black;color:lime;top:40px;font-family:sans-serif;font-size:14px;position:fixed;text-align:center;z-index:999999;border-radius:13px;border:2px solid red;");

// Toggle hour12 format on mouse move
node.addEventListener('mouseenter', function() {
    hour12 = !hour12; // Toggle hour12 between true and false
});

// Append the clock node
document.body.appendChild(node);
setInterval(test, 70);

// Make the node draggable within the browser window
$(node).draggable({
    containment: "window" // Restrict dragging within the window
});
body.append(node);
})();
