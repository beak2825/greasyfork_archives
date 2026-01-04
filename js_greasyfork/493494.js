// ==UserScript==
// @name         KEYSTROKES AND CPS v2
// @namespace    ZXM
// @version      V2
// @description  These KEYSTROKES and CPS got banned in the past but now they have been addressed and are working
// @author       ZXM
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @downloadURL https://update.greasyfork.org/scripts/493494/KEYSTROKES%20AND%20CPS%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/493494/KEYSTROKES%20AND%20CPS%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

var container = document.createElement('div');
container.style.position = 'fixed';
container.style.bottom = '10px';
container.style.left = '10px';
container.style.backgroundColor = 'transparent';
container.style.color = 'black';
container.style.padding = '5px';
container.style.fontFamily = 'Arial';
container.style.fontSize = '14px';
container.style.zIndex = '9999';

var row1 = document.createElement('div');
row1.style.display = 'flex';
row1.style.justifyContent = 'center';

var upKey = createKeyElement('W');

var row2 = document.createElement('div');
row2.style.display = 'flex';
row2.style.justifyContent = 'center';

var leftKey = createKeyElement('A');
var sprintKey = createKeyElement('S');
var rightKey = createKeyElement('D');

var row3 = document.createElement('div');
row3.style.display = 'flex';
row3.style.justifyContent = 'center';

var shiftKey = createKeyElement('Shift');
var spaceKey = createKeyElement(' ');

var row4 = document.createElement('div');
row4.style.display = 'flex';
row4.style.justifyContent = 'center';

var lmbKey = createKeyElement('LMB');
var rmbKey = createKeyElement('RMB');

row1.appendChild(upKey);
row2.appendChild(leftKey);
row2.appendChild(sprintKey);
row2.appendChild(rightKey);
row3.appendChild(shiftKey);
row3.appendChild(spaceKey);
row4.appendChild(lmbKey);
row4.appendChild(rmbKey);
container.appendChild(row1);
container.appendChild(row2);
container.appendChild(row3);
container.appendChild(row4);

document.body.appendChild(container);

var cpsButton = document.createElement('div');
cpsButton.style.position = 'fixed';
cpsButton.style.top = '10px';
cpsButton.style.right = '10px';
cpsButton.style.backgroundColor = 'black';
cpsButton.style.color = 'red';
cpsButton.style.padding = '5px';
cpsButton.style.fontFamily = 'Arial';
cpsButton.style.fontSize = '14px';
cpsButton.style.zIndex = '9999';
cpsButton.textContent = '';

var cpsLabel = document.createElement('span');
cpsLabel.textContent = 'CPS: ';
var cpsValue = document.createElement('span');
cpsValue.textContent = '0';

cpsButton.appendChild(cpsLabel);
cpsButton.appendChild(cpsValue);
document.body.appendChild(cpsButton);

cpsButton.addEventListener('click', function () {
resetClickCount();
});

var clickTimes = [];

document.addEventListener('keydown', function (event) {
highlightKey(event.key, 'red');
});

document.addEventListener('keyup', function (event) {
highlightKey(event.key, 'black');
});

document.addEventListener('mousedown', function (event) {
if (event.button === 0) {
lmbKey.style.backgroundColor = 'red';
countClick();
} else if (event.button === 2) {
rmbKey.style.backgroundColor = 'red';
}
});

document.addEventListener('mouseup', function (event) {
if (event.button === 0) {
lmbKey.style.backgroundColor = 'black';
} else if (event.button === 2) {
rmbKey.style.backgroundColor = 'black';
}
});

function createKeyElement(keyText) {
var keyElement = document.createElement('div');
keyElement.style.backgroundColor = 'transparent';
keyElement.style.color = 'black';
keyElement.style.padding = '5px';
keyElement.style.margin = '2px';
keyElement.style.border = '1px solid red';
keyElement.style.borderRadius = '5px';
keyElement.style.fontFamily = 'Arial';
keyElement.style.fontSize = '14px';
keyElement.textContent = keyText;
return keyElement;
}

function highlightKey(key, color) {
switch (key) {
case 'w':
upKey.style.backgroundColor = color;
break;
case 'a':
leftKey.style.backgroundColor = color;
break;
case 's':
sprintKey.style.backgroundColor = color;
break;
case 'd':
rightKey.style.backgroundColor = color;
break;
case 'Shift':
shiftKey.style.backgroundColor = color;
break;
case ' ':
spaceKey.style.backgroundColor = color;
break;
default:
break;
}
}

function countClick() {
var currentTime = new Date().getTime();
clickTimes.push(currentTime);
updateCPS();
}

function updateCPS() {
var currentTime = new Date().getTime();
var oneSecondAgo = currentTime - 1000;
var count = 0;


for (var i = clickTimes.length - 1; i >= 0; i--) {
  if (clickTimes[i] >= oneSecondAgo) {
    count++;
  } else {
    break;
  }
}

cpsValue.textContent = count;
}

function resetClickCount() {
clickTimes = [];
updateCPS();

  }

})();