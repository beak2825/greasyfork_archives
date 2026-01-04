// ==UserScript==
// @name LunarX Client
// @namespace your-namespace
// @version 1.3
// @description INSANE
// @author Ninji
// @match https://*.bloxd.io/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492075/LunarX%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/492075/LunarX%20Client.meta.js
// ==/UserScript==

(function () {
  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '10px';
  container.style.left = '10px';
  container.style.backgroundColor = 'transparent';
  container.style.color = 'white';
  container.style.padding = '5px';
  container.style.fontFamily = 'Montserrat';
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
  cpsButton.style.color = 'white';
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
    highlightKey(event.key, 'green');
  });

  document.addEventListener('keyup', function (event) {
    highlightKey(event.key, 'transparent');
  });

  document.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
      lmbKey.style.backgroundColor = 'green';
      countClick();
    } else if (event.button === 2) {
      rmbKey.style.backgroundColor = 'green';
    }
  });

  document.addEventListener('mouseup', function (event) {
    if (event.button === 0) {
      lmbKey.style.backgroundColor = 'transparent';
    } else if (event.button === 2) {
      rmbKey.style.backgroundColor = 'transparent';
    }
  });

  function createKeyElement(keyText) {
    var keyElement = document.createElement('div');
    keyElement.style.backgroundColor = 'transparent';
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

const myCPS = document.querySelector("body > div:nth-child(10)");
if (myCPS) {
   myCPS.style.fontSize = '40px';
   myCPS.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Set the background color to black with 50% transparency
}

// ==UserScript==
// @name         Glowing Crosshair
// @namespace    your-namespace
// @version      1.0
// @description  Adds a glowing crosshair with a circular shadow background to any website.
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let crosshairVisible = false;

    function toggleCrosshair() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            crosshair.remove();
            crosshairVisible = false;
        } else {
            addCrosshair();
            crosshairVisible = true;
        }
    }

    function addCrosshair() {
        GM_addStyle(`
            #crosshair {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8);
                animation: glow 1.5s ease-in-out infinite;
                z-index: 9999;
                pointer-events: none; /* Allow click events to pass through */
            }

            #noa-canvas {
                position: relative;
                z-index: 9998;
            }

            @keyframes glow {
                0% {
                    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8);
                }
                50% {
                    box-shadow: 0 0 20px 20px rgba(255, 255, 255, 0.4);
                }
                100% {
                    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8);
                }
            }
        `);

        const crosshair = document.createElement('div');
        crosshair.id = 'crosshair';

        document.body.appendChild(crosshair);

        window.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            crosshair.style.left = mouseX + 'px';
            crosshair.style.top = mouseY + 'px';
        });
    }

    function handleKeyPress(event) {
        if (event.key === 'g' || event.key === 'G') {
            toggleCrosshair();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCrosshair);
    } else {
        addCrosshair();
    }

    window.addEventListener('keydown', handleKeyPress);
})();

(function() {
    'use strict';

    // Disable unnecessary animations
    document.body.style.animation = 'none';

    // Disable image smoothing
    const canvasElements = document.getElementsByTagName('canvas');
    for (let i = 0; i < canvasElements.length; i++) {
        const canvas = canvasElements[i];
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
    }

    // Disable shadows
    const styleElements = document.getElementsByTagName('style');
    for (let i = 0; i < styleElements.length; i++) {
        const style = styleElements[i];
        if (style.innerText.includes('box-shadow')) {
            style.innerText = style.innerText.replace(/box-shadow[^}]+}/g, '');
        }
    }
})();


function myFunction() {
const myCrosshair = document.querySelector("#root > div.WholeAppWrapper > div > div.CrossHair")
if (myCrosshair) {
myCrosshair.textContent = '𐀏';
      }
const annoyingIcons = document.querySelector("#root > div.WholeAppWrapper > div > div.BottomLeftIcons");
if (annoyingIcons) {
annoyingIcons.style.display = "none";
annoyingIcons.style.visibility = 'hidden';
    }
const annoyingIcons2 = document.querySelector("#root > div.WholeAppWrapper > div > div.TopRightElements")
if (annoyingIcons2) {
annoyingIcons2.style.display = "none";
annoyingIcons2.style.visibility = 'hidden';
     }
}

setInterval(myFunction, 1000)

const cpsCounter = document.querySelector("body > div:nth-child(10)")
if (cpsCounter) {
cpsCounter.style.fontSize = '40px';
}

 
(function() {
    'use strict';
 
    const Title = document.querySelector('.Title.FullyFancyText');
    const LogoContainer = document.querySelector('.LogoContainer');
    const Background = document.querySelector('.HomeBackground');
 
    if (Title) {
        Title.style.whiteSpace = "nowrap";
        Title.innerText = "LunarX Client";
        Title.style.color = "#FFD700";
    }
 
    if (LogoContainer) {
        LogoContainer.style.display = "none";
    }
 
    if (Background) {
        Background.style = "background-image: url('https://i.ytimg.com/vi/7EV4cPuJvXE/mqdefault.jpg'); filter: blur(4px) brightness(0.5);";
    }
 
    const customMessage = document.createElement("div");
    customMessage.innerText = "Welcome to LunarX Client!";
    customMessage.style.position = "absolute";
    customMessage.style.top = "10px";
    customMessage.style.right = "10px";
    customMessage.style.padding = "10px 20px";
    customMessage.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    customMessage.style.color = "#FFD700";
    customMessage.style.fontSize = "20px";
    customMessage.style.borderRadius = "8px";
    document.body.appendChild(customMessage);
 
    const customButton = document.createElement("button");
    customButton.innerText = "Activate Boost";
    customButton.style.position = "fixed";
    customButton.style.bottom = "20px";
    customButton.style.right = "20px";
    customButton.style.padding = "10px 20px";
    customButton.style.backgroundColor = "#FFD700";
    customButton.style.color = "#282c34";
    customButton.style.border = "none";
    customButton.style.borderRadius = "8px";
    customButton.style.cursor = "pointer";
    document.body.appendChild(customButton);
 
    customButton.addEventListener("click", () => {
        alert("Boost activated!");
        console.log("Boost button clicked!");
    });
})();

(function() {
        'use strict';
        setInterval(function() {
            const hotBarItem = document.querySelectorAll(".HotBarItem");
            const selectedslot = document.querySelectorAll(".SelectedItem");
            if (hotBarItem) {
                hotBarItem.forEach(function(hotbar) {
                    hotbar.style.borderRadius = "8px";
                    hotbar.style.borderColor = "#000000";
                    hotbar.style.backgroundColor = "transparent";
                    hotbar.style.boxShadow = "none";
                    hotbar.style.outline = "transparent";
                });
            }
            if (selectedslot) {
                selectedslot.forEach(function(slot) {
                    slot.style.backgroundColor = "transparent";
                    slot.style.boxShadow = "none";
                    slot.style.borderRadius = "15px";
                    slot.style.borderColor = "#FFFFFF";
                    slot.style.outline = "transparent";
                });
            }
        }, 1);
    })();
