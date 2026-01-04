// ==UserScript==
(function () {
  var visible = true;
  var typing = false;
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '10px';
  container.style.left = '10px';
  container.style.backgroundColor = 'transparent';
  container.style.color = 'white';
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

  var spaceKey = createKeyElement('_______');

  var row4 = document.createElement('div');
  row4.style.display = 'flex';
  row4.style.justifyContent = 'center';

  var shiftKey = createKeyElement('Shift');
  var ctrlKey = createKeyElement('Ctrl');

  var row5 = document.createElement('div');
  row5.style.display = 'flex';
  row5.style.justifyContent = 'center';

  var lmbKey = createKeyElement('LMB');
  var rmbKey = createKeyElement('RMB');

  row1.appendChild(upKey);
  row2.appendChild(leftKey);
  row2.appendChild(sprintKey);
  row2.appendChild(rightKey);
  row3.appendChild(spaceKey);
  row4.appendChild(shiftKey);
  row4.appendChild(ctrlKey);
  row5.appendChild(lmbKey);
  row5.appendChild(rmbKey);
  container.appendChild(row1);
  container.appendChild(row2);
  container.appendChild(row3);
  container.appendChild(row4);
  container.appendChild(row5);

  document.body.appendChild(container);

  var cpsButton = document.createElement('div');
  cpsButton.style.position = 'fixed';
  cpsButton.style.top = '10px';
  cpsButton.style.left = '745px';
  cpsButton.style.backgroundColor = 'black';
  cpsButton.style.color = 'white';
  cpsButton.style.padding = '5px';
  cpsButton.style.fontFamily = 'Arial';
  cpsButton.style.fontSize = '20px';
  cpsButton.style.zIndex = '9999';
  cpsButton.textContent = '';

  var LMBValue = document.createElement('span');
  LMBValue.textContent = '0';
  var cpsLabel = document.createElement('span');
  cpsLabel.textContent = ' | ';
  var RMBValue = document.createElement('span');
  RMBValue.textContent = '0';

  cpsButton.appendChild(LMBValue);
  cpsButton.appendChild(cpsLabel);
  cpsButton.appendChild(RMBValue);
  document.body.appendChild(cpsButton);

  cpsButton.addEventListener('click', function () {
    if (event.button == 0) {
        LMBresetClickCount();
    }
    else if (event.button == 2){
        RMBresetClickCount();
    }
  });

  var LMBclickTimes = [];
  var RMBclickTimes = [];

  document.addEventListener('keydown', function (event) {
    highlightKey(event.key, 'green');
  });

  document.addEventListener('keyup', function (event) {
    highlightKey(event.key, 'black');
  });

  document.addEventListener('keydown', function (event) {
    toggleKeystrokes(event.key);
  });

  document.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
      lmbKey.style.backgroundColor = 'green';
      LMBcountClick();
    } else if (event.button === 2) {
      rmbKey.style.backgroundColor = 'green';
      RMBcountClick();
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
    keyElement.style.backgroundColor = 'black';
    keyElement.style.color = 'white';
    keyElement.style.padding = '5px';
    keyElement.style.margin = '2px';
    keyElement.style.border = '1px solid white';
    keyElement.style.borderRadius = '5px';
    keyElement.style.fontFamily = 'Arial';
    keyElement.style.fontSize = '20px';
    keyElement.textContent = keyText;
    return keyElement;
  }

  function highlightKey(key, color) {
    switch (key) {
      case 'W':
      case 'w':
        upKey.style.backgroundColor = color;
        break;
      case 'A':
      case 'a':
        leftKey.style.backgroundColor = color;
        break;
      case 'S':
      case 's':
        sprintKey.style.backgroundColor = color;
        break;
      case 'D':
      case 'd':
        rightKey.style.backgroundColor = color;
        break;
      case 'Shift':
        shiftKey.style.backgroundColor = color;
        break;
      case ' ':
        spaceKey.style.backgroundColor = color;
        break;
      case 'Control':
        ctrlKey.style.backgroundColor = color;
        break;
      default:
        break;
    }
  }

    function toggleKeystrokes(key){
        switch (key){
            case 't':
            case 'T':
                typing = true;
                break;
            case 'Enter':
                if (typing == true) typing = false;
                break;
            case 'Escape':
                if (typing == true) typing = false;
                break;
            case '`':
                if (visible == true && typing == false){
                    container.style.visibility = 'hidden';
                    cpsButton.style.visibility = 'hidden';
                    visible = false;
                } else if (typing == false){
                    container.style.visibility = '';
                    cpsButton.style.visibility = '';
                    visible = true;
                }
        }
    }

  function LMBcountClick() {
    var LMBcurrentTime = new Date().getTime();
    LMBclickTimes.push(LMBcurrentTime);
    LMBupdateCPS();
    if (new Date().getTime() - LMBcurrentTime >= 1000){
      LMBValue.textContent = '0';
    }
  }

  function RMBcountClick() {
    var RMBcurrentTime = new Date().getTime();
    RMBclickTimes.push(RMBcurrentTime);
    RMBupdateCPS();
    if (new Date().getTime() - RMBcurrentTime >= 1000){
      RMBValue.textContent = '0';
    }
  }

  function LMBupdateCPS() {
    var currentTime = new Date().getTime();
    var oneSecondAgo = currentTime - 1000;
    var LMBcount = 0;

    for (var i = LMBclickTimes.length - 1; i >= 0; i--) {
      if (LMBclickTimes[i] >= oneSecondAgo) {
        LMBcount++;
      } else {
        break;
      }
    }

    LMBValue.textContent = LMBcount;
  }

  function RMBupdateCPS() {
    var currentTime = new Date().getTime();
    var oneSecondAgo = currentTime - 1000;
    var RMBcount = 0;

    for (var i = RMBclickTimes.length - 1; i >= 0; i--) {
      if (RMBclickTimes[i] >= oneSecondAgo) {
        RMBcount++;
      } else {
        break;
      }
    }

    RMBValue.textContent = RMBcount;
  }

  function LMBresetClickCount() {
    LMBclickTimes = [];
    LMBupdateCPS();
  }

  function RMBresetClickCount(){
    RMBclickTimes = [];
    RMBupdateCPS();
  }
})();

const myCPS = document.querySelector("body > div:nth-child(10)");
if (myCPS) {
   myCPS.style.fontSize = '40px';
   myCPS.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Set the background color to black with 50% transparency
}


// ==UserScript==
// @name         bloxd.io keystrokes and cps counter
// @namespace    your-namespace
// @version      2.0
// @description  make by YT huge fish, plz subscribe!
// @author       YT huge fish
// @match        bloxd.io
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513261/bloxdio%20keystrokes%20and%20cps%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/513261/bloxdio%20keystrokes%20and%20cps%20counter.meta.js
// ==/UserScript==

const cpsCounter = document.querySelector("body > div:nth-child(10)")
if (cpsCounter) {
cpsCounter.style.fontSize = '40px';
}