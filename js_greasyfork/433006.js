// ==UserScript==
// @name         Paper.io Hacked Menu
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Here is a simple hack menu for Paper.io!
// @author       AA034
// @match        https://paper-io.com/*
// @icon         https://www.google.com/s2/favicons?domain=paper-io.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433006/Paperio%20Hacked%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/433006/Paperio%20Hacked%20Menu.meta.js
// ==/UserScript==

let overlayHTML = `
<div id="box">
    <div class="main" id="box2">
        <p style="color:white;"> PaperHack </p>

        <section><label>Zoom [Scroll]</label></section>
        <section><label>Speed Boost [Click]</label></section>
        <section><label>Pause [P]</label></section>
        <section><button class="button" id="unlockSkins">Skins</button></section>

        <section><label class="custom-checkbox"><input type="checkbox" class="checkbox-input" id="invinCheck"><span class="checkbox-icon"></span>Invincible</label></section>

        <section><label class="custom-checkbox"><input type="checkbox" class="checkbox-input" id="radiCheck"><span class="checkbox-icon"></span>Auto Kill</label></section>
        <br>
        <p>M to toggle menu</p>

</div>
</div>

<style>
#box {
    z-index: 10;
    position: absolute;
    top: 256px;
    left: 7px;
    transition: 0.5s;
    }

#box2 {
    padding: 15px;
    margin-bottom: 5px;
    display: grid;
    }

section {
    margin: auto;
   display: flex;
    justify-content: space-between;padding:5px;
    }

.main {
    background-color: #363c3d;
    letter-spacing: 2px;
    font-weight: bold;
    font-size: 15px;
    font-family: 'Open Sans', sans-serif;
    color:white;
    border-radius: 8px;
    }
p {
    text-align: center;
    border-bottom:1px solid white;
    border-top:1px solid white;
}

label {
    font-weight: bold}

.button {
  margin: auto;
  background-color: #242829;
  color: white;
  font-size: 16px;
  border: none;
  padding: 8px;
  border-radius: 6px;
  transition: 0.15s;
}

.button:hover {
 color: #a10000;
}

.custom-checkbox {
  display: inline-block;
  position: relative;
  padding-left: 25px; /* Adjust as needed */
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  background-color: #eee;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.checkbox-input:checked + .checkbox-icon {
  background-color: #a10000; /* Change to your desired color */
}

.checkbox-icon:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-input:checked + .checkbox-icon:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

</style>
`

//Misc stuff

function getID(x) {
    return document.getElementById(x)
};

let overlay = document.createElement("div");
    overlay.innerHTML = overlayHTML;
    document.body.appendChild(overlay);


let acc = getID("accordian"),
    unlockSkins = getID("unlockSkins"),
    box = getID("box"),
    radiBox = getID("radiCheck"),
    invinBox = getID('invinCheck'),
    paper2 = window.paper2;

//Skins

unlockSkins.onclick = function() {
    paper2.skins.forEach(obj => {
        unlockSkin(obj.name);
    });
    unlockSkin(name)
    shop_open()
}

//Functions

function radiHack() {

    let playerIndex;

    for (let i = 0; i < paper2.game.units.length; i++) {
        if (paper2.game.units[i].name === paper2.game.player.name) {
            playerIndex = i;
            break;
        }
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    function checkUnitProximity() {
        const playerX = paper2.game.player.position.x;
        const playerY = paper2.game.player.position.y;

        for (let i = 0; i < paper2.game.units.length; i++) {
            if (i !== playerIndex) {
                const unitX = paper2.game.units[i].position.x;
                const unitY = paper2.game.units[i].position.y;

                const distance = calculateDistance(playerX, playerY, unitX, unitY);
                if (distance <= 100) {
                    if (paper2.game.units[i] !== paper2.game.player) {
                        paper2.game.units = paper2.game.units.filter(array => array !== paper2.game.units[i]);
                    }
                }
            }
        }
    }

    checkUnitProximity();

    setInterval(checkUnitProximity, 100);
}

function pauseHack() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'p') {
            let paused = paper2.game.paused

            if(paused == false) {
                paper2.game.paused = true
            }
            else {
                paper2.game.paused = false
            }
        }
    })
}

function invinHack() {
    paper2.game.player.track.unit = paper2.game.units[4]
}

function speedHack() {


    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    let isMouseHeld = false;
    let interval;

    // Move the player towards the next location on left mouse button click and hold
    document.addEventListener("mousedown", function(event) {
        if (event.button === 0) { // Check if left mouse button is clicked
            isMouseHeld = true;

            interval = setInterval(movePlayer, 16); // Update every 16ms (approximately 60fps)
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 0) {
            isMouseHeld = false;

            clearInterval(interval);
        }
    });

    function movePlayer() {

        if(paper2.game.player.baseDistance > 15) {

        paper2.game.player.in = null
        const currentPlayerX = paper2.game.player.position.x;
        const currentPlayerY = paper2.game.player.position.y;
        const targetX = paper2.game.player.target.x;
        const targetY = paper2.game.player.target.y;

        const distanceToTarget = distance(currentPlayerX, currentPlayerY, targetX, targetY);

        const stepSize = 3.5;

        if (distanceToTarget > stepSize) {
            const angle = Math.atan2(targetY - currentPlayerY, targetX - currentPlayerX);
            const newX = currentPlayerX + stepSize * Math.cos(angle);
        const newY = currentPlayerY + stepSize * Math.sin(angle);

            paper2.game.player.position.x = newX;
            paper2.game.player.position.y = newY;
        } else {
            paper2.game.player.position.x = targetX;
            paper2.game.player.position.y = targetY;

            if (!isMouseHeld) {
                clearInterval(interval);
            }
        }
       }
       else if(paper2.game.player.baseDistance == 0) {

        paper2.game.player.in = null
        const currentPlayerX = paper2.game.player.position.x;
        const currentPlayerY = paper2.game.player.position.y;
        const targetX = paper2.game.player.target.x;
        const targetY = paper2.game.player.target.y;

        const distanceToTarget = distance(currentPlayerX, currentPlayerY, targetX, targetY);

        const stepSize = 3.5;

        if (distanceToTarget > stepSize) {
            const angle = Math.atan2(targetY - currentPlayerY, targetX - currentPlayerX);
            const newX = currentPlayerX + stepSize * Math.cos(angle);
        const newY = currentPlayerY + stepSize * Math.sin(angle);

            paper2.game.player.position.x = newX;
            paper2.game.player.position.y = newY;
        } else {
            paper2.game.player.position.x = targetX;
            paper2.game.player.position.y = targetY;

            if (!isMouseHeld) {
                clearInterval(interval);
            }
        }
       }

    }


}

function zoomHack() {
    window.addEventListener('wheel', function(event) {
        window.paper2.configs.paper2_classic.minScale = 0.5;
        if (event.deltaY > 0) {
            if (window.paper2.configs.paper2_classic.maxScale > 0.5) {
                window.paper2.configs.paper2_classic.maxScale -= 0.5;
            }
        }
        else if (event.deltaY < 0) {
            if (window.paper2.configs.paper2_classic.maxScale < 4.5) {
                window.paper2.configs.paper2_classic.maxScale += 0.5;
            }
        }
    })
}

//Load Game

document.querySelector("#pre_game > div.grow > div.button.play").setAttribute("id", "startButton");

    document.getElementById('startButton').addEventListener("click", function() {
    game_start();
    setTimeout(function() {

        if(radiBox.checked == true) {
            radiHack()
        }
        if(invinBox.checked == true) {
            invinHack()
        }
        pauseHack();
        speedHack();
        zoomHack();
    }, 600);
});