// ==UserScript==
// @name         Drawaria Cars Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds car selection and movement in Drawaria
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525197/Drawaria%20Cars%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/525197/Drawaria%20Cars%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Game Constants
    const GRAVITY = 0.5; // Simulates gravity (adjust as needed)
    const MAX_SPEED = 10; // Units/second
    const MIN_SPEED = 2; // Units/second
    const JUMP_HEIGHT = 15; // Units
    const CAR_SPEED = 20; // Increased speed of the car
    const CAR_ACCELERATION = 1; // Acceleration for smoother movement
    const TERRAIN_GENERATION_THRESHOLD = 30; // Threshold to start generating terrain
    const TURBO_SPEED = 40; // Speed with turbo

    // Avatar Properties
    let avatarX = 50;
    let avatarY = 50;
    let avatarVX = 0; // Horizontal velocity
    let avatarVY = 0; // Vertical velocity
    let isJumping = false;
    let isDriving = false;
    let isTurbo = false;
    let isMuted = false;
    let isChronoMode = false;
    let chronoStartTime = null;

    // Car Properties
    let selectedCar = null;
    let carX = 0;
    let carY = 0;
    let carVX = 0; // Horizontal velocity of the car
    const carImages = [
        'https://opengameart.org/sites/default/files/carro.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW40NjhybHltcTg3cHNrd29tcHVlN3VmN3c5ZnhidzVqZHRiZzhoYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Fekes32DM6Jpb5XYHR/giphy.gif'
    ];

    // Sound URLs
    const startSoundURL = 'https://www.myinstants.com/media/sounds/.mp3';
    const drivingSoundURL = 'https://www.myinstants.com//media/sounds/gas-gas-gaslqshort.mp3';

    // Audio Elements
    const startSound = new Audio(startSoundURL);
    const drivingSound = new Audio(drivingSoundURL);
    drivingSound.loop = true;

    // Keyboard State
    const keys = {};

    // Function to handle movement
    function updateAvatar() {
        if (isDriving) {
            handleCarMovement();
        } else {
            // 1. Apply Gravity
            avatarVY += GRAVITY;

            // 2. Handle horizontal movement (keyboard input)
            if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
            } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
            } else {
                avatarVX *= 0.9; // Friction
            }

            // 3. Handle jumping
            if (keys['ArrowUp'] && !isJumping) {
                avatarVY = -JUMP_HEIGHT;
                isJumping = true;
            }

            // 4. Update Avatar Position
            avatarX += avatarVX;
            avatarY += avatarVY;

            // 5. Collision Detection (simplified)
            if (avatarY > 768 - 50) { // Assuming ground level is at 768 - 50
                avatarY = 768 - 50;
                avatarVY = 0;
                isJumping = false;
            }

            // 6. Boundary Check
            avatarX = Math.max(-900, Math.min(avatarX, 1024 + 100)); // Keep within bounds
            avatarY = Math.max(-350, Math.min(avatarY, 768 + 50));

            // 7. Update visual representation (Draw the avatar)
            drawAvatar(avatarX, avatarY);
        }

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
        }
    }

    // Function to create the car selection menu
    function createCarMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = '50px';
        menu.style.left = '50px';
        menu.style.width = '300px';
        menu.style.background = 'linear-gradient(to bottom, red, darkred)';
        menu.style.padding = '20px';
        menu.style.borderRadius = '10px';
        menu.style.zIndex = '1000';
        menu.style.cursor = 'move';

        const title = document.createElement('div');
        title.textContent = 'Cars Mod';
        title.style.color = 'white';
        title.style.fontSize = '24px';
        title.style.textAlign = 'center';
        menu.appendChild(title);

        const toggleButton = document.createElement('div');
        toggleButton.textContent = '▼';
        toggleButton.style.color = 'white';
        toggleButton.style.fontSize = '24px';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.cursor = 'pointer';
        toggleButton.addEventListener('click', () => {
            const carButtons = menu.querySelector('.car-buttons');
            if (carButtons.style.display === 'none') {
                carButtons.style.display = 'block';
                toggleButton.textContent = '▲';
            } else {
                carButtons.style.display = 'none';
                toggleButton.textContent = '▼';
            }
        });
        menu.appendChild(toggleButton);

        const carButtons = document.createElement('div');
        carButtons.className = 'car-buttons';
        carButtons.style.display = 'none';
        carButtons.style.marginTop = '20px';
        carButtons.style.display = 'flex';
        carButtons.style.flexDirection = 'column';
        carButtons.style.alignItems = 'center';

        carImages.forEach((carImage, index) => {
            const button = document.createElement('button');
            button.textContent = `Car ${index + 1}`;
            button.style.background = 'linear-gradient(to bottom, yellow, gold)';
            button.style.border = 'none';
            button.style.borderRadius = '10px';
            button.style.padding = '20px';
            button.style.margin = '10px 0';
            button.style.cursor = 'pointer';
            button.style.fontSize = '18px';
            button.style.width = '200px';
            button.addEventListener('click', () => {
                selectCar(index);
            });
            carButtons.appendChild(button);
        });

        const muteButton = document.createElement('button');
        muteButton.textContent = 'Mute Sounds';
        muteButton.style.background = 'linear-gradient(to bottom, yellow, gold)';
        muteButton.style.border = 'none';
        muteButton.style.borderRadius = '10px';
        muteButton.style.padding = '20px';
        muteButton.style.margin = '10px 0';
        muteButton.style.cursor = 'pointer';
        muteButton.style.fontSize = '18px';
        muteButton.style.width = '200px';
        muteButton.addEventListener('click', () => {
            isMuted = !isMuted;
            if (isMuted) {
                startSound.muted = true;
                drivingSound.muted = true;
            } else {
                startSound.muted = false;
                drivingSound.muted = false;
            }
        });
        carButtons.appendChild(muteButton);

        const chronoButton = document.createElement('button');
        chronoButton.textContent = 'Chrono Mode';
        chronoButton.style.background = 'linear-gradient(to bottom, yellow, gold)';
        chronoButton.style.border = 'none';
        chronoButton.style.borderRadius = '10px';
        chronoButton.style.padding = '20px';
        chronoButton.style.margin = '10px 0';
        chronoButton.style.cursor = 'pointer';
        chronoButton.style.fontSize = '18px';
        chronoButton.style.width = '200px';
        chronoButton.addEventListener('click', () => {
            isChronoMode = !isChronoMode;
            if (isChronoMode) {
                chronoStartTime = Date.now();
                createChronoDisplay();
            } else {
                removeChronoDisplay();
            }
        });
        carButtons.appendChild(chronoButton);

        const turboButton = document.createElement('button');
        turboButton.textContent = 'Turbo';
        turboButton.style.background = 'linear-gradient(to bottom, yellow, gold)';
        turboButton.style.border = 'none';
        turboButton.style.borderRadius = '10px';
        turboButton.style.padding = '20px';
        turboButton.style.margin = '10px 0';
        turboButton.style.cursor = 'pointer';
        turboButton.style.fontSize = '18px';
        turboButton.style.width = '200px';
        turboButton.addEventListener('click', () => {
            isTurbo = !isTurbo;
        });
        carButtons.appendChild(turboButton);

        const colorContainer = document.createElement('div');
        colorContainer.style.background = 'linear-gradient(to bottom, yellow, gold)';
        colorContainer.style.borderRadius = '10px';
        colorContainer.style.padding = '20px';
        colorContainer.style.margin = '10px 0';
        colorContainer.style.width = '200px';
        colorContainer.style.textAlign = 'center';

        const colorTitle = document.createElement('div');
        colorTitle.textContent = 'Change Car Colors';
        colorTitle.style.color = 'white';
        colorTitle.style.fontSize = '18px';
        colorContainer.appendChild(colorTitle);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.marginTop = '10px';
        colorInput.addEventListener('input', (event) => {
            changeCarColor(event.target.value);
        });
        colorContainer.appendChild(colorInput);

        carButtons.appendChild(colorContainer);

        menu.appendChild(carButtons);
        document.body.appendChild(menu);

        // Make the menu draggable
        let isDragging = false;
        let offsetX, offsetY;

        menu.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
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
    }

    // Function to select a car
    function selectCar(index) {
        if (selectedCar !== null) {
            document.body.removeChild(selectedCar);
        }

        const car = document.createElement('img');
        car.src = carImages[index];
        car.style.position = 'absolute';
        car.style.left = '20%'; // Position the car horizontally
        car.style.top = '72%'; // Position the car vertically
        car.style.width = '330px';
        car.style.height = '200px';
        car.style.zIndex = '999';
        car.style.cursor = 'pointer';

        car.addEventListener('click', () => {
            if (isDriving) {
                exitCar();
            } else {
                enterCar(car);
            }
        });

        document.body.appendChild(car);
        selectedCar = car;
        carX = car.getBoundingClientRect().left;
        carY = car.getBoundingClientRect().top;
    }

    // Function to handle car movement
    function handleCarMovement() {
        if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            carVX = Math.min(carVX + CAR_ACCELERATION, isTurbo ? TURBO_SPEED : CAR_SPEED);
        } else if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
            carVX = Math.max(carVX - CAR_ACCELERATION, -(isTurbo ? TURBO_SPEED : CAR_SPEED));
        } else {
            carVX *= 0.9; // Friction
        }

        // Update car position
        carX += carVX;
        selectedCar.style.left = `${carX}px`;

        // Follow the car with the camera
        followCar();

        // Generate terrain if the car is near the edge
        if (carX > window.innerWidth - TERRAIN_GENERATION_THRESHOLD) {
            generateTerrain();
        }
    }

    // Function to enter the car
    function enterCar(car) {
        isDriving = true;
        const avatar = document.querySelector('#selfavatarimage');
        if (avatar) {
            avatar.style.transform = `translate(${carX + 150}px, ${carY + 100}px) scale(0.1)`;
        }
        startSound.play();
        drivingSound.play();
    }

    // Function to exit the car
    function exitCar() {
        isDriving = false;
        const avatar = document.querySelector('#selfavatarimage');
        if (avatar) {
            avatar.style.transform = `translate(${avatarX}px, ${avatarY}px) scale(1)`;
        }
        drivingSound.pause();
        drivingSound.currentTime = 0;
    }

    // Function to follow the car with the camera
    function followCar() {
        const camera = document.querySelector('#camera'); // Assuming there is a camera element
        if (camera) {
            camera.style.transform = `translate(${-carX}px, 0)`;
        }
    }

    // Function to generate terrain
    function generateTerrain() {
        const terrain = document.createElement('div');
        terrain.style.position = 'absolute';
        terrain.style.left = `${window.innerWidth}px`;
        terrain.style.top = '0';
        terrain.style.width = `${window.innerWidth}px`;
        terrain.style.height = '100%';
        terrain.style.background = 'url(https://drawaria.online/img/pattern.png) repeat-x'; // Replace with your terrain image
        terrain.style.zIndex = '0';

        document.body.appendChild(terrain);
    }

    // Function to create chrono display
    function createChronoDisplay() {
        const chronoDisplay = document.createElement('div');
        chronoDisplay.style.position = 'fixed';
        chronoDisplay.style.top = '10px';
        chronoDisplay.style.left = '10px';
        chronoDisplay.style.background = 'rgba(0, 0, 0, 0.5)';
        chronoDisplay.style.padding = '20px';
        chronoDisplay.style.borderRadius = '10px';
        chronoDisplay.style.color = 'white';
        chronoDisplay.style.zIndex = '1000';
        chronoDisplay.style.fontSize = '24px';
        chronoDisplay.id = 'chronoDisplay';

        const speedDisplay = document.createElement('div');
        speedDisplay.style.marginTop = '20px';
        speedDisplay.id = 'speedDisplay';

        chronoDisplay.appendChild(speedDisplay);
        document.body.appendChild(chronoDisplay);

        function updateChronoDisplay() {
            const elapsedTime = Math.floor((Date.now() - chronoStartTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            chronoDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            const speed = Math.abs(carVX).toFixed(2);
            speedDisplay.textContent = `Speed: ${speed} px/s`;

            requestAnimationFrame(updateChronoDisplay);
        }

        updateChronoDisplay();
    }

    // Function to remove chrono display
    function removeChronoDisplay() {
        const chronoDisplay = document.getElementById('chronoDisplay');
        if (chronoDisplay) {
            document.body.removeChild(chronoDisplay);
        }
    }

    // Function to change car color
    function changeCarColor(color) {
        selectedCar.style.filter = `drop-shadow(0 0 10px ${color})`;
    }

    // Event listeners for keyboard input
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Create the car selection menu
    createCarMenu();

    // Start the game loop
    updateAvatar();

})();
