// ==UserScript==
// @name         Galaxy Client
// @namespace    ZXM
// @version      1.2
// @description  Replacement for infinite client
// @author        JustGyrops
// @match        https://bloxd.io/
// @icon         https://staging.bloxd.io
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/504696/Galaxy%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/504696/Galaxy%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';
alert ( "Download Complete!!")
alert ("made by JustGyrops")
alert ("Thank you for using galaxy client. Enjoy!!")
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
var spaceKey = createKeyElement(' Space ');

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
cpsButton.style.backgroundColor = 'white';
cpsButton.style.color = 'black';
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
highlightKey(event.key, 'white');
});

document.addEventListener('keyup', function (event) {
highlightKey(event.key, 'white');
});

document.addEventListener('mousedown', function (event) {
if (event.button === 0) {
lmbKey.style.backgroundColor = 'white';
countClick();
} else if (event.button === 2) {
rmbKey.style.backgroundColor = 'white';
}
});

document.addEventListener('mouseup', function (event) {
if (event.button === 0) {
lmbKey.style.backgroundColor = 'white';
} else if (event.button === 2) {
rmbKey.style.backgroundColor = 'white';
}
});

function createKeyElement(keyText) {
var keyElement = document.createElement('div');
keyElement.style.backgroundColor = 'transparent';
keyElement.style.color = 'black';
keyElement.style.padding = '9px';
keyElement.style.margin = '5px';
keyElement.style.border = '3px solid green';
keyElement.style.borderRadius = '9px';
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
setInterval(function() {
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/1af89691-ac17-11ef-9afd-95c736b782b2.gif)";
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "20px";
            crosshair.style.height = "20px";
        }
    }, 1000);
