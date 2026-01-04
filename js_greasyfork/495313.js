// ==UserScript==
// @name         pixelgalactic picture overlay
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description   none 
// @author       kasp67
// @match        https://pixelgalactic.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ngrok-free.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495313/pixelgalactic%20picture%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/495313/pixelgalactic%20picture%20overlay.meta.js
// ==/UserScript==

var square = document.createElement('div');
square.style.width = '200px';
square.style.height = '200px';
square.style.backgroundColor = 'white';
square.style.position = 'absolute';
square.style.top = '50%';
square.style.left = '50%';
square.style.transform = 'translate(-50%, -50%)';
square.style.textAlign = 'center';

var text = document.createElement('p');
text.innerText = 'Marko and Yaros are cocksuckers';
text.style.color = 'black';
text.style.fontSize = '24px';
text.style.fontWeight = 'bold';

square.appendChild(text);

document.body.appendChild(square);