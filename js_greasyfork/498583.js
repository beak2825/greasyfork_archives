// ==UserScript==
// @name         cosmopixel picture overlay
// @namespace    http://tampermonkey.net/
// @version      V2.0
// @description   none 
// @author       kasp67
// @match        https://cosmopixel.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ngrok-free.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498583/cosmopixel%20picture%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/498583/cosmopixel%20picture%20overlay.meta.js
// ==/UserScript==

const cube = document.createElement('div');
cube.style.width = '300px';
cube.style.height = '300px';
cube.style.backgroundColor = 'white';
cube.style.position = 'absolute';
cube.style.left = '50%';
cube.style.top = '50%';
cube.style.transform = 'translate(-50%, -50%)';
cube.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

const line1 = document.createElement('div');
line1.textContent = 'Cacha, ostłand, dunia';
line1.style.position = 'absolute';
line1.style.top = '40%';
line1.style.left = '50%';
line1.style.transform = 'translate(-50%, -50%)';
line1.style.fontWeight = 'bold';
line1.style.fontSize = '18px';
line1.style.color = 'black';
const line2 = document.createElement('div');
line2.textContent = 'smokčyć wialikija penisy. pixelgalactic.fun';
line2.style.position = 'absolute';
line2.style.top = '60%';
line2.style.left = '50%';
line2.style.transform = 'translate(-50%, -50%)';
line2.style.fontWeight = 'bold';
line2.style.fontSize = '18px';
line2.style.color = 'black';

document.body.appendChild(cube);
cube.appendChild(line1);
cube.appendChild(line2);