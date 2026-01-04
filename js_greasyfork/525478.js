// ==UserScript==
// @name         Drawaria Cosmic Galaxy Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Infinite zero-gravity space exploration with dynamic celestial generation
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @downloadURL https://update.greasyfork.org/scripts/525478/Drawaria%20Cosmic%20Galaxy%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/525478/Drawaria%20Cosmic%20Galaxy%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cosmic Canvas Setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    // Set high z-index for the canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999'; // High z-index to ensure it's above other elements

    // Fullscreen setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Advanced Space Objects
    const celestialBodies = {
        stars: [],
        planets: [],
        nebulae: [],
        blackHoles: []
    };

    // Space Generation Parameters
    const generationSettings = {
        starDensity: 0.0005,
        planetFrequency: 0.0001,
        nebulaFrequency: 0.00005,
        blackHoleFrequency: 0.00001,
        generationRadius: 10000
    };

    // Avatar Properties
    const avatar = {
        position: { x: canvas.width / 2, y: canvas.height / 2 },
        velocity: { x: 0, y: 0 },
        maxSpeed: 15,
        acceleration: 0.25,
        friction: 0.985,
        angle: 0,
        element: createAvatarElement()
    };

    function createAvatarElement() {
        const img = new Image();
        img.style.position = 'absolute';
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.transformOrigin = 'center';
        img.style.zIndex = '10000'; // High z-index to ensure it's above other elements
        document.body.appendChild(img);
        return img;
    }

    // Fetch the real avatar URL
    function fetchAvatarURL() {
        const avatarImageElement = document.querySelector('#selfavatarimage');
        if (avatarImageElement) {
            avatar.element.src = avatarImageElement.src;
        } else {
            console.error('Avatar image element not found.');
        }
    }

    // Call the function to fetch the avatar URL
    fetchAvatarURL();

    // Multi-layer Starfield
    class StarField {
        constructor(layerCount = 3) {
            this.layers = Array.from({length: layerCount}, (_, i) => ({
                stars: [],
                speed: 0.2 * (i + 1),
                opacity: 0.3 + (0.7/layerCount) * i
            }));

            this.layers.forEach(layer => {
                layer.stars = Array.from({length: 500}, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3,
                    hue: Math.random() * 360
                }));
            });
        }

        draw() {
            this.layers.forEach(layer => {
                layer.stars.forEach(star => {
                    ctx.fillStyle = `hsla(${star.hue}, 100%, 80%, ${layer.opacity})`;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
        }

        update(velocity) {
            this.layers.forEach(layer => {
                layer.stars.forEach(star => {
                    star.x -= velocity.x * layer.speed;
                    star.y -= velocity.y * layer.speed;
                    if (star.x < 0) star.x += canvas.width;
                    if (star.x > canvas.width) star.x -= canvas.width;
                    if (star.y < 0) star.y += canvas.height;
                    if (star.y > canvas.height) star.y -= canvas.height;
                });
            });
        }
    }

    // Procedural Planet Generator
    function generatePlanet(x, y) {
        const planet = {
            x, y,
            size: 30 + Math.random() * 120,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            features: {
                rings: Math.random() > 0.7,
                atmosphere: Math.random() > 0.5,
                moons: Math.floor(Math.random() * 5)
            }
        };

        // Add moons
        if (planet.features.moons > 0) {
            planet.moons = Array.from({length: planet.features.moons}, () => ({
                distance: planet.size + 20 + Math.random() * 50,
                size: 5 + Math.random() * 15,
                speed: Math.random() * 0.02,
                angle: Math.random() * Math.PI * 2
            }));
        }

        return planet;
    }

    // Generate Initial Space
    const starField = new StarField();
    generateSpaceEnvironment(avatar.position.x, avatar.position.y);

    // Movement System
    function handleMovement() {
        // Acceleration
        if (keys.ArrowRight) avatar.velocity.x += avatar.acceleration;
        if (keys.ArrowLeft) avatar.velocity.x -= avatar.acceleration;
        if (keys.ArrowDown) avatar.velocity.y += avatar.acceleration;
        if (keys.ArrowUp) avatar.velocity.y -= avatar.acceleration;

        // Velocity limits
        avatar.velocity.x = Math.max(-avatar.maxSpeed,
            Math.min(avatar.velocity.x, avatar.maxSpeed));
        avatar.velocity.y = Math.max(-avatar.maxSpeed,
            Math.min(avatar.velocity.y, avatar.maxSpeed));

        // Apply friction
        avatar.velocity.x *= avatar.friction;
        avatar.velocity.y *= avatar.friction;

        // Update position
        avatar.position.x += avatar.velocity.x;
        avatar.position.y += avatar.velocity.y;

        // Update avatar display
        avatar.element.style.left = `${avatar.position.x}px`;
        avatar.element.style.top = `${avatar.position.y}px`;

        // Calculate rotation angle
        avatar.angle = Math.atan2(avatar.velocity.y, avatar.velocity.x);
        avatar.element.style.transform = `rotate(${avatar.angle}rad)`;

        // Generate new space as needed
        generateSpaceEnvironment(avatar.position.x, avatar.position.y);
    }

    // Space Generation System
    function generateSpaceEnvironment(centerX, centerY) {
        // Generate stars in view area
        const viewArea = {
            x: centerX - canvas.width/2,
            y: centerY - canvas.height/2,
            width: canvas.width * 2,
            height: canvas.height * 2
        };

        // Generate celestial bodies
        if (celestialBodies.planets.length < 100 && Math.random() < generationSettings.planetFrequency) {
            const newPlanet = generatePlanet(
                centerX + (Math.random() - 0.5) * generationSettings.generationRadius,
                centerY + (Math.random() - 0.5) * generationSettings.generationRadius
            );
            celestialBodies.planets.push(newPlanet);
        }
    }

    // Rendering System
    function drawScene() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw starfield
        starField.draw();

        // Draw celestial bodies
        celestialBodies.planets.forEach(planet => {
            // Calculate screen position
            const screenX = planet.x - avatar.position.x + canvas.width/2;
            const screenY = planet.y - avatar.position.y + canvas.height/2;

            // Draw planet
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, planet.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw moons
            if (planet.moons) {
                planet.moons.forEach(moon => {
                    moon.angle += moon.speed;
                    ctx.fillStyle = '#999';
                    ctx.beginPath();
                    ctx.arc(
                        screenX + Math.cos(moon.angle) * moon.distance,
                        screenY + Math.sin(moon.angle) * moon.distance,
                        moon.size, 0, Math.PI * 2
                    );
                    ctx.fill();
                });
            }
        });
    }

    // Input System
    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    // Game Loop
    function gameLoop() {
        handleMovement();
        starField.update(avatar.velocity);
        drawScene();
        requestAnimationFrame(gameLoop);
    }

    // Style Initialization
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.background = '#000';

    // Start the experience
    gameLoop();
})();
