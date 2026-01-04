// ==UserScript==
// @name         Paper++
// @namespace    https://greasyfork.org/en/users/1407549-qloha
// @version      2.0
// @description  Paper.io on steroids! Paper++!
// @author       qloha
// @match        *://paper-io.com/*
// @license      MIT
// @match        *://*.paper-io.com/*
// @icon         https://www.google.com/s2/favicons?domain=paper-io.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520850/Paper%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/520850/Paper%2B%2B.meta.js
// ==/UserScript==

let overlayHTML = `
<div id="box">
    <div class="main" id="box2">
        <div id="menu-header" class="header">Paper++</div>

        <section><label>Zoom [Scroll]</label></section>
        <section><label>Speed Boost [Click]</label></section>

        <section><label>Pause [P]</label></section>

        <section><button class="button" id="unlockSkins">Skins</button></section>

        <section>
            <label class="custom-checkbox">
                <input type="checkbox" class="checkbox-input" id="invinCheck">
                <span class="checkbox-icon"></span>Invincible
            </label>
        </section>

        <section>
            <label class="custom-checkbox">
                <input type="checkbox" class="checkbox-input" id="radiCheck">
                <span class="checkbox-icon"></span>Auto Kill
            </label>
        </section>

        <p class="shortcut-info">RShift to toggle menu</p>
    </div>
</div>

<style>
/* Overlay */
#box {
    z-index: 10;
    position: absolute;
    top: 256px;
    left: 7px;
    transition: 0.5s;
}

/* Main Menu */
#box2 {
    padding: 20px;
    background: #2e3b4e;
    color: #fff;
    border-radius: 12px;
    font-family: Arial, sans-serif;
    display: grid;
    gap: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
    transition: transform 0.2s ease;
    position: relative;
}

/* Header */
#menu-header {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    cursor: grab;
    padding: 10px;
    background: #1e90ff;
    border-radius: 8px;
    color: white;
    margin-bottom: 15px;
}

/* Smooth Transform Updates */
body {
    user-select: none; /* Prevent text selection while dragging */
}

/* Shortcut Info */
.shortcut-info {
    text-align: center;
    font-weight: bold;
    color: #ffeb3d;
    font-size: 14px;
}

/* Button */
.button {
    background-color: #444;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.button:hover {
    background-color: #555;
}
</style>
`;

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
    const stepSize = 3.5; // Adjust step size for smoother movement

    // Move the player towards the next location on left mouse button click and hold
    document.addEventListener("mousedown", function(event) {
        if (event.button === 0 && !isMouseHeld) { // Check if left mouse button is clicked and not already held
            isMouseHeld = true;
            interval = setInterval(movePlayer, 16); // Update every 16ms (approximately 60fps)
        }
    });

    document.addEventListener("mouseup", function(event) {
        if (event.button === 0) {
            isMouseHeld = false;
            clearInterval(interval); // Stop moving when the mouse is released
        }
    });

    function movePlayer() {
        const player = paper2.game.player;
        const currentPlayerX = player.position.x;
        const currentPlayerY = player.position.y;
        const targetX = player.target.x;
        const targetY = player.target.y;

        // Only move if the baseDistance is greater than 15 or the player is at baseDistance 0
        if (player.baseDistance > 15 || player.baseDistance === 0) {
            const distanceToTarget = distance(currentPlayerX, currentPlayerY, targetX, targetY);

            // Reduce the step size dynamically based on the distance to target
            const dynamicStepSize = Math.min(stepSize, distanceToTarget);

            if (distanceToTarget > dynamicStepSize) {
                const angle = Math.atan2(targetY - currentPlayerY, targetX - currentPlayerX);
                const newX = currentPlayerX + dynamicStepSize * Math.cos(angle);
                const newY = currentPlayerY + dynamicStepSize * Math.sin(angle);

                player.position.x = newX;
                player.position.y = newY;
            } else {
                // Set the position directly to the target if close enough
                player.position.x = targetX;
                player.position.y = targetY;

                // If the player is within a very small distance of the target, stop the movement
                clearInterval(interval); // Clear interval only after smooth completion
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

document.addEventListener('keydown', function(event) {
    if (event.code === 'ShiftRight') {
        const box = document.getElementById('box');
        if (box.style.display === 'none') {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    }
});

document.querySelector("#pre_game > div.grow > div.button.play").setAttribute("id", "startButton");

    console.log("[Paper++] Loaded.");
    if (typeof paper2 !== 'undefined' && paper2.game) {

        let startButton = document.getElementById('startButton');

        if (startButton) {
            startButton.addEventListener("click", function() {
                console.log("[Paper++] Game started");
                let player = paper2.game.player;

                if (player) {
                    console.log("[Paper++] Player is ready", player);
                } else {
                    console.log("[Paper++] Player data not available");
                }
            });

        } else {
            console.log("[Paper++] Start button not found");
        }
    }
    document.getElementById('box').style.display = 'none';
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

let isDragging = false;
let offsetX, offsetY;

const menuHeader = getID("menu-header");

menuHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - box.getBoundingClientRect().left;
    offsetY = e.clientY - box.getBoundingClientRect().top;
    menuHeader.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        box.style.top = `${e.clientY - offsetY}px`;
        box.style.left = `${e.clientX - offsetX}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    menuHeader.style.cursor = 'grab';
});

window.onload = function() {
    const logoDiv = document.querySelector('.logo');

    if (logoDiv) {
        const textDiv = document.createElement('div');
        textDiv.textContent = 'Paper++';

        Object.assign(textDiv.style, {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#007BFF',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            lineHeight: '1.5',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            display: 'inline-block',
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
        });

        logoDiv.parentNode.replaceChild(textDiv, logoDiv);
    }
};