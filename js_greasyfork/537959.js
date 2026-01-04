// ==UserScript==
// @name         3 dots crosshair
// @namespace    http://tampermonkey.net/
// @version      1
// @description  3 dots crosshair :3
// @author       parrol
// @match        https://narrow.one/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537959/3%20dots%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/537959/3%20dots%20crosshair.meta.js
// ==/UserScript==
const up = document.createElement('div');
up.style.position = 'fixed';
up.style.top = '50%';
up.style.left = '50%';
up.style.transform = 'translate(-40%, -120%)';
up.style.width = '8px';
up.style.height = '8px';
up.style.borderRadius = '50%';
up.style.pointerEvents = 'none';
up.style.border = '1px solid black';
up.style.background = 'white';
document.body.appendChild(up);

const right = document.createElement('div');
right.style.position = 'fixed';
right.style.top = '50%';
right.style.left = '50%';
right.style.transform = 'translate(30%, 2%)';
right.style.width = '8px';
right.style.height = '8px';
right.style.borderRadius = '50%';
right.style.pointerEvents = 'none';
right.style.border = '1px solid black';
right.style.background = 'white';
document.body.appendChild(right);

const left = document.createElement('div');
left.style.position = 'fixed';
left.style.top = '50%';
left.style.left = '50%';
left.style.transform = 'translate(-125%, 2%)';
left.style.width = '8px';
left.style.height = '8px';
left.style.borderRadius = '50%';
left.style.pointerEvents = 'none';
left.style.border = '1px solid black';
left.style.background = 'white';
document.body.appendChild(left);