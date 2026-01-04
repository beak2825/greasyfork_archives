// ==UserScript==
// @name Louris Clinet
// @namespace your-namespace
// @version 1.0
// @description keystrokes
// @author Your Name
// @match https://bloxd.io/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475601/Louris%20Clinet.user.js
// @updateURL https://update.greasyfork.org/scripts/475601/Louris%20Clinet.meta.js
// ==/UserScript==
(function() {
  //
var container = document.createElement('div');
container.style.position = 'fixed';
container.style.bottom = '10px';
container.style.left = '10px';
container.style.backgroundColor = 'black';
container.style.color = 'white';
container.style.padding = '5px';
container.style.fontFamily = 'Arial';
container.style.fontSize = '14px';
container.style.zIndex = '9999';

var row1 = document.createElement('div');
row1.style.display = 'flex';
row1.style.justifyContent = 'center';

var upKey = document.createElement('div');
upKey.textContent = 'W';

var row2 = document.createElement('div');
row2.style.display = 'flex';
row2.style.justifyContent = 'center';

var leftKey = document.createElement('div');
leftKey.textContent = 'A';
leftKey.style.marginRight = '10px';

var sprintKey = document.createElement('div');
sprintKey.textContent = 'S';

var rightKey = document.createElement('div');
rightKey.textContent = 'D';
rightKey.style.marginLeft = '10px';

var row3 = document.createElement('div');
row3.style.display = 'flex';
row3.style.justifyContent = 'center';

var shiftKey = document.createElement('div');
shiftKey.textContent = 'Shift';
shiftKey.style.marginRight = '10px';

var spaceKey = document.createElement('div');
spaceKey.textContent = '________';
spaceKey.style.marginLeft = '10px';

//
row1.appendChild(upKey);
row2.appendChild(leftKey);
row2.appendChild(sprintKey);
row2.appendChild(rightKey);
row3.appendChild(shiftKey);
row3.appendChild(spaceKey);
container.appendChild(row1);
container.appendChild(row2);
container.appendChild(row3);

//
document.body.appendChild(container);

//
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'w':
            upKey.style.backgroundColor = 'green';
            break;
        case 'a':
            leftKey.style.backgroundColor = 'green';
            break;
        case 's':
            sprintKey.style.backgroundColor = 'green';
            break;
        case 'd':
            rightKey.style.backgroundColor = 'green';
            break;
        case 'Shift':
            shiftKey.style.backgroundColor = 'green';
            break;
        case ' ':
            spaceKey.style.backgroundColor = 'green';
            break;
    }
});

//
document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'w':
            upKey.style.backgroundColor = 'black';
            break;
        case 'a':
            leftKey.style.backgroundColor = 'black';
            break;
        case 's':
            sprintKey.style.backgroundColor = 'black';
            break;
        case 'd':
            rightKey.style.backgroundColor = 'black';
            break;
        case 'Shift':
            shiftKey.style.backgroundColor = 'black';
            break;
        case ' ':
            spaceKey.style.backgroundColor = 'black';
            break;
    }
});
})();