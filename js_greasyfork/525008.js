// ==UserScript==
// @name         Drawaria Mario Mod
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds Mario-like movement to Drawaria with fly mode, metal mode, star mode, big mode, fire mode, and ice mode, and a draggable menu
// @author       You
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525008/Drawaria%20Mario%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/525008/Drawaria%20Mario%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Game Constants
    const GRAVITY = 0.5; // Simulates gravity (adjust as needed)
    const MAX_SPEED = 10; // Units/second
    const MIN_SPEED = 2; // Units/second
    const JUMP_HEIGHT = 15; // Units
    const FLY_DURATION = 420 * 60; // Frames (7 minutes at 60 FPS)
    const WING_IMAGE_URL = 'https://img1.picmix.com/output/stamp/thumb/0/4/3/0/2470340_d6215.gif';
    const FLY_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-64-wing-cap.mp3';
    const METAL_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-64-metal-cap.mp3';
    const STAR_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-64-star-power.mp3';
    const BIG_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-mega-mushroom.mp3';
    const FIRE_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-fire-power.mp3';
    const ICE_SOUND_URL = 'https://www.myinstants.com/media/sounds/mario-ice-power.mp3';

    // Avatar Properties
    let avatarX = 50;
    let avatarY = 50;
    let avatarVX = 0; // Horizontal velocity
    let avatarVY = 0; // Vertical velocity
    let isJumping = false;
    let isFlying = false;
    let isMetal = false;
    let isStar = false;
    let isBig = false;
    let isFire = false;
    let isIce = false;
    let flyFrames = 0;
    let flyModeActivated = false;
    let metalModeActivated = false;
    let starModeActivated = false;
    let bigModeActivated = false;
    let fireModeActivated = false;
    let iceModeActivated = false;
    let lastFireTime = 0;
    let starHue = 0;

    // Keyboard State
    const keys = {};

    // Audio Elements
    const flySound = new Audio(FLY_SOUND_URL);
    flySound.loop = true;

    const metalSound = new Audio(METAL_SOUND_URL);
    metalSound.loop = true;

    const starSound = new Audio(STAR_SOUND_URL);
    starSound.loop = true;

    const bigSound = new Audio(BIG_SOUND_URL);
    bigSound.loop = true;

    const fireSound = new Audio(FIRE_SOUND_URL);
    fireSound.loop = true;

    const iceSound = new Audio(ICE_SOUND_URL);
    iceSound.loop = true;

    // Wing Element
    const wingElement = document.createElement('img');
    wingElement.src = WING_IMAGE_URL;
    wingElement.style.position = 'absolute';
    wingElement.style.display = 'none';
    wingElement.style.width = '100px'; // Increase the size of the wings
    wingElement.style.height = '100px';
    wingElement.style.transform = 'translate(-50%, -50%)'; // Center the wings
    document.body.appendChild(wingElement);

    // Create Menu
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.top = '50px';
    menu.style.left = '50px';
    menu.style.width = '300px';
    menu.style.background = 'radial-gradient(circle, #fff, #ccc, #999)';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    menu.style.zIndex = 1000;
    menu.style.overflow = 'hidden';
    document.body.appendChild(menu);

    // Menu Toggle Symbol
    const menuToggleSymbol = document.createElement('div');
    menuToggleSymbol.style.textAlign = 'center';
    menuToggleSymbol.style.cursor = 'pointer';
    menuToggleSymbol.style.fontSize = '20px';
    menuToggleSymbol.style.marginBottom = '10px';
    menuToggleSymbol.textContent = '▼';
    menu.appendChild(menuToggleSymbol);

    // Menu Header
    const menuHeader = document.createElement('div');
    menuHeader.style.background = 'linear-gradient(to right, white, grey)';
    menuHeader.style.padding = '10px';
    menuHeader.style.textAlign = 'center';
    menuHeader.style.cursor = 'move';
    menuHeader.textContent = 'Drawaria Mario Mod';
    menu.appendChild(menuHeader);

    // Menu Options Container
    const menuOptions = document.createElement('div');
    menuOptions.style.display = 'none'; // Initially hidden
    menu.appendChild(menuOptions);

    // Fly Mode Button
    const flyButton = document.createElement('button');
    flyButton.textContent = 'Activate Fly Mode';
    flyButton.style.display = 'block';
    flyButton.style.margin = '10px';
    flyButton.style.padding = '10px';
    flyButton.style.background = 'linear-gradient(to bottom, #4CAF50, white)';
    flyButton.style.color = 'black';
    flyButton.style.border = 'none';
    flyButton.style.borderRadius = '5px';
    flyButton.style.cursor = 'pointer';
    flyButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    flyButton.style.transition = 'background 0.3s, transform 0.3s';
    flyButton.style.fontFamily = 'Arial, sans-serif';
    flyButton.style.fontSize = '16px';
    flyButton.style.fontWeight = 'bold';
    menuOptions.appendChild(flyButton);

    // Metal Mode Button
    const metalButton = document.createElement('button');
    metalButton.textContent = 'Activate Metal Mode';
    metalButton.style.display = 'block';
    metalButton.style.margin = '10px';
    metalButton.style.padding = '10px';
    metalButton.style.background = 'linear-gradient(to bottom, #FF9800, white)';
    metalButton.style.color = 'black';
    metalButton.style.border = 'none';
    metalButton.style.borderRadius = '5px';
    metalButton.style.cursor = 'pointer';
    metalButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    metalButton.style.transition = 'background 0.3s, transform 0.3s';
    metalButton.style.fontFamily = 'Arial, sans-serif';
    metalButton.style.fontSize = '16px';
    metalButton.style.fontWeight = 'bold';
    menuOptions.appendChild(metalButton);

    // Star Mode Button
    const starButton = document.createElement('button');
    starButton.textContent = 'Activate Star Mode';
    starButton.style.display = 'block';
    starButton.style.margin = '10px';
    starButton.style.padding = '10px';
    starButton.style.background = 'linear-gradient(to bottom, #FFD700, white)';
    starButton.style.color = 'black';
    starButton.style.border = 'none';
    starButton.style.borderRadius = '5px';
    starButton.style.cursor = 'pointer';
    starButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    starButton.style.transition = 'background 0.3s, transform 0.3s';
    starButton.style.fontFamily = 'Arial, sans-serif';
    starButton.style.fontSize = '16px';
    starButton.style.fontWeight = 'bold';
    menuOptions.appendChild(starButton);

    // Big Mode Button
    const bigButton = document.createElement('button');
    bigButton.textContent = 'Activate Big Mode';
    bigButton.style.display = 'block';
    bigButton.style.margin = '10px';
    bigButton.style.padding = '10px';
    bigButton.style.background = 'linear-gradient(to bottom, #FF69B4, white)';
    bigButton.style.color = 'black';
    bigButton.style.border = 'none';
    bigButton.style.borderRadius = '5px';
    bigButton.style.cursor = 'pointer';
    bigButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    bigButton.style.transition = 'background 0.3s, transform 0.3s';
    bigButton.style.fontFamily = 'Arial, sans-serif';
    bigButton.style.fontSize = '16px';
    bigButton.style.fontWeight = 'bold';
    menuOptions.appendChild(bigButton);

    // Fire Mode Button
    const fireButton = document.createElement('button');
    fireButton.textContent = 'Activate Fire Mode';
    fireButton.style.display = 'block';
    fireButton.style.margin = '10px';
    fireButton.style.padding = '10px';
    fireButton.style.background = 'linear-gradient(to bottom, #FF4500, white)';
    fireButton.style.color = 'black';
    fireButton.style.border = 'none';
    fireButton.style.borderRadius = '5px';
    fireButton.style.cursor = 'pointer';
    fireButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    fireButton.style.transition = 'background 0.3s, transform 0.3s';
    fireButton.style.fontFamily = 'Arial, sans-serif';
    fireButton.style.fontSize = '16px';
    fireButton.style.fontWeight = 'bold';
    menuOptions.appendChild(fireButton);

    // Ice Mode Button
    const iceButton = document.createElement('button');
    iceButton.textContent = 'Activate Ice Mode';
    iceButton.style.display = 'block';
    iceButton.style.margin = '10px';
    iceButton.style.padding = '10px';
    iceButton.style.background = 'linear-gradient(to bottom, #ADD8E6, white)';
    iceButton.style.color = 'black';
    iceButton.style.border = 'none';
    iceButton.style.borderRadius = '5px';
    iceButton.style.cursor = 'pointer';
    iceButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    iceButton.style.transition = 'background 0.3s, transform 0.3s';
    iceButton.style.fontFamily = 'Arial, sans-serif';
    iceButton.style.fontSize = '16px';
    iceButton.style.fontWeight = 'bold';
    menuOptions.appendChild(iceButton);

    // Stop Modes Button
    const stopModesButton = document.createElement('button');
    stopModesButton.textContent = 'Stop Modes';
    stopModesButton.style.display = 'block';
    stopModesButton.style.margin = '10px';
    stopModesButton.style.padding = '10px';
    stopModesButton.style.background = 'linear-gradient(to bottom, #f44336, white)';
    stopModesButton.style.color = 'black';
    stopModesButton.style.border = 'none';
    stopModesButton.style.borderRadius = '5px';
    stopModesButton.style.cursor = 'pointer';
    stopModesButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    stopModesButton.style.transition = 'background 0.3s, transform 0.3s';
    stopModesButton.style.fontFamily = 'Arial, sans-serif';
    stopModesButton.style.fontSize = '16px';
    stopModesButton.style.fontWeight = 'bold';
    menuOptions.appendChild(stopModesButton);

    // Function to handle movement
    function updateAvatar() {
        // 1. Apply Gravity
        avatarVY += GRAVITY;

        // 2. Handle horizontal movement (keyboard input)
        if (keys['ArrowRight']) {
            avatarVX = Math.min(avatarVX + 0.5, isStar ? MAX_SPEED * 2 : isMetal ? MAX_SPEED * 1.5 : MAX_SPEED);
        } else if (keys['ArrowLeft']) {
            avatarVX = Math.max(avatarVX - 0.5, -(isStar ? MAX_SPEED * 2 : isMetal ? MAX_SPEED * 1.5 : MAX_SPEED));
        } else {
            avatarVX *= 0.9; // Friction
        }

        // 3. Handle jumping
        if (keys['ArrowUp'] && !isJumping) {
            avatarVY = -(isMetal ? JUMP_HEIGHT * 0.7 : isBig ? JUMP_HEIGHT * 0.5 : JUMP_HEIGHT);
            isJumping = true;
        }

        // 4. Handle Flight
        if (isFlying) {
            if (flyFrames > 0) {
                flyFrames--;
                if (keys['ArrowUp']) {
                    avatarVY = -JUMP_HEIGHT; // Hold jump in fly mode
                }
            } else {
                stopFlyMode();
            }
        }

        // 5. Handle Fire and Ice Modes
        if (keys[' '] && (isFire || isIce)) {
            const currentTime = Date.now();
            if (currentTime - lastFireTime >= 2000) {
                lastFireTime = currentTime;
                launchFireball(isIce);
            }
        }

        // 6. Update Avatar Position
        avatarX += avatarVX;
        avatarY += avatarVY;

        // 7. Collision Detection (simplified)
        if (avatarY > 768 - (isBig ? 100 : 50)) { // Assuming ground level is at 768 - 50
            avatarY = 768 - (isBig ? 100 : 50);
            avatarVY = 0;
            isJumping = false;
        }

        // 8. Boundary Check
        avatarX = Math.max(-900, Math.min(avatarX, 1024 + 100)); // Keep within bounds
        avatarY = Math.max(-350, Math.min(avatarY, 768 + 50));

        // 9. Update visual representation (Draw the avatar)
        drawAvatar(avatarX, avatarY);

        // Request next frame
        requestAnimationFrame(updateAvatar);
    }

    // Function to handle keyboard input
    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    // Function to draw the avatar
    function drawAvatar(x, y) {
        const avatar = document.querySelector('#selfavatarimage');
        if (avatar) {
            avatar.style.transform = `translate(${x}px, ${y}px)`;
            avatar.style.border = 'none'; // Make border transparent
            avatar.style.boxShadow = 'none'; // Make box-shadow transparent
            if (isFlying) {
                wingElement.style.display = 'block';
                // Position wings behind the avatar
                const avatarRect = avatar.getBoundingClientRect();
                wingElement.style.left = `${avatarRect.left + window.scrollX + (avatarRect.width - wingElement.offsetWidth) / 2}px`;
                wingElement.style.top = `${avatarRect.top + window.scrollY + (avatarRect.height - wingElement.offsetHeight) / 2}px`;
            } else {
                wingElement.style.display = 'none';
            }
            if (isMetal) {
                avatar.style.filter = 'grayscale(100%) brightness(150%)';
            } else if (isStar) {
                starHue = (starHue + 1) % 360;
                avatar.style.filter = `hue-rotate(${starHue}deg) brightness(150%)`;
            } else if (isBig) {
                avatar.style.transform = `translate(${x}px, ${y}px) scale(2)`;
            } else if (isFire) {
                avatar.style.filter = 'brightness(150%) sepia(100%) saturate(500%) hue-rotate(-10deg)';
            } else if (isIce) {
                avatar.style.filter = 'brightness(150%) sepia(100%) saturate(500%) hue-rotate(180deg)';
            } else {
                avatar.style.filter = 'none';
                avatar.style.transform = `translate(${x}px, ${y}px)`;
            }
        }
    }

    // Function to launch a fireball
    function launchFireball(isIce) {
        const avatar = document.querySelector('#selfavatarimage');
        if (avatar) {
            const fireball = document.createElement('img');
            fireball.src = isIce ? 'https://i.gifer.com/origin/d6/d6abed6047c79b8073fda9af7ba85358_w200.gif' : 'https://media.tenor.com/_dUxi3qy-KIAAAAj/fire-fireball.gif';
            fireball.style.position = 'absolute';
            fireball.style.width = '50px';
            fireball.style.height = '50px';
            fireball.style.left = `${avatar.offsetLeft + avatar.offsetWidth / 2}px`;
            fireball.style.top = `${avatar.offsetTop + avatar.offsetHeight / 2}px`;
            document.body.appendChild(fireball);

            let fireballX = avatar.offsetLeft + avatar.offsetWidth / 2;
            let fireballY = avatar.offsetTop + avatar.offsetHeight / 2;
            let fireballVX = 5; // Fireball speed to the right
            let fireballVY = 0;
            const gravity = 0.5;

            function moveFireball() {
                fireballX += fireballVX;
                fireballY += fireballVY;
                fireballVY += gravity;

                // Bounce off the ground
                if (fireballY > 768 - 25) {
                    fireballY = 768 - 25;
                    fireballVY = -fireballVY * 0.8; // Reduce velocity on bounce
                }

                // Remove fireball if it goes off screen
                if (fireballX < -50 || fireballX > 1024 + 50 || fireballY > 768 + 50) {
                    document.body.removeChild(fireball);
                } else {
                    fireball.style.left = `${fireballX}px`;
                    fireball.style.top = `${fireballY}px`;
                    requestAnimationFrame(moveFireball);
                }
            }

            moveFireball();
        }
    }

    // Function to activate fly mode
    function activateFlyMode() {
        stopOtherModes();
        isFlying = true;
        flyFrames = FLY_DURATION;
        flyModeActivated = true;
        flySound.play();
    }

    // Function to stop fly mode
    function stopFlyMode() {
        isFlying = false;
        wingElement.style.display = 'none';
        flySound.pause();
        flySound.currentTime = 0;
        flyModeActivated = false;
    }

    // Function to activate metal mode
    function activateMetalMode() {
        stopOtherModes();
        isMetal = true;
        metalModeActivated = true;
        metalSound.play();
    }

    // Function to stop metal mode
    function stopMetalMode() {
        isMetal = false;
        metalSound.pause();
        metalSound.currentTime = 0;
        metalModeActivated = false;
    }

    // Function to activate star mode
    function activateStarMode() {
        stopOtherModes();
        isStar = true;
        starModeActivated = true;
        starSound.play();
    }

    // Function to stop star mode
    function stopStarMode() {
        isStar = false;
        starSound.pause();
        starSound.currentTime = 0;
        starModeActivated = false;
    }

    // Function to activate big mode
    function activateBigMode() {
        stopOtherModes();
        isBig = true;
        bigModeActivated = true;
        bigSound.play();
    }

    // Function to stop big mode
    function stopBigMode() {
        isBig = false;
        bigSound.pause();
        bigSound.currentTime = 0;
        bigModeActivated = false;
    }

    // Function to activate fire mode
    function activateFireMode() {
        stopOtherModes();
        isFire = true;
        fireModeActivated = true;
        fireSound.play();
    }

    // Function to stop fire mode
    function stopFireMode() {
        isFire = false;
        fireSound.pause();
        fireSound.currentTime = 0;
        fireModeActivated = false;
    }

    // Function to activate ice mode
    function activateIceMode() {
        stopOtherModes();
        isIce = true;
        iceModeActivated = true;
        iceSound.play();
    }

    // Function to stop ice mode
    function stopIceMode() {
        isIce = false;
        iceSound.pause();
        iceSound.currentTime = 0;
        iceModeActivated = false;
    }

    // Function to stop all modes
    function stopAllModes() {
        stopFlyMode();
        stopMetalMode();
        stopStarMode();
        stopBigMode();
        stopFireMode();
        stopIceMode();
    }

    // Function to stop other modes
    function stopOtherModes() {
        stopFlyMode();
        stopMetalMode();
        stopStarMode();
        stopBigMode();
        stopFireMode();
        stopIceMode();
    }

    // Function to toggle menu options visibility
    function toggleMenuOptions() {
        if (menuOptions.style.display === 'none') {
            menuOptions.style.display = 'block';
            menuToggleSymbol.textContent = '▲';
            menu.style.height = '500px'; // Expand menu height
        } else {
            menuOptions.style.display = 'none';
            menuToggleSymbol.textContent = '▼';
            menu.style.height = 'auto'; // Collapse menu height
        }
    }

    // Make the menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    menuHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Event listeners for keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Event listener for fly mode button
    flyButton.addEventListener('click', activateFlyMode);

    // Event listener for metal mode button
    metalButton.addEventListener('click', activateMetalMode);

    // Event listener for star mode button
    starButton.addEventListener('click', activateStarMode);

    // Event listener for big mode button
    bigButton.addEventListener('click', activateBigMode);

    // Event listener for fire mode button
    fireButton.addEventListener('click', activateFireMode);

    // Event listener for ice mode button
    iceButton.addEventListener('click', activateIceMode);

    // Event listener for stop modes button
    stopModesButton.addEventListener('click', stopAllModes);

    // Event listener for menu toggle symbol
    menuToggleSymbol.addEventListener('click', toggleMenuOptions);

    // Start the game loop
    updateAvatar();

})();
