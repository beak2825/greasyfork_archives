// ==UserScript==
// @name         Drawaria.online - Aircraft Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A highly ambitious, experimental Tampermonkey script to simulate a pilotable aircraft on Drawaria.online.
// @author       YouTubeDrawaria / Your AI Assistant
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541751/Drawariaonline%20-%20Aircraft%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/541751/Drawariaonline%20-%20Aircraft%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_ID = 'drawaria-aircraft-script';
    const Z_INDEX_OVERLAY = 9999; // Ensure our canvas is on top

    // --- Game State ---
    const aircraft = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        speed: 0, // Current forward speed
        maxSpeed: 8,
        acceleration: 0.1,
        deceleration: 0.05,
        turnSpeed: 0.05, // Radians per frame
        pitchAngle: 0,  // Rotation around X-axis (up/down)
        rollAngle: 0,   // Rotation around Z-axis (sideways tilt)
        yawAngle: 0,    // Rotation around Y-axis (heading)
        maxPitchRoll: Math.PI / 4, // Max +/- 45 degrees
        enginePower: 0, // 0-1, affects sound
        fuel: 1000,
        maxFuel: 1000,
        altitude: 0, // Basic altitude simulation
        verticalSpeed: 0 // How fast altitude changes
    };

    const controls = {
        forward: false,
        backward: false,
        turnLeft: false,
        turnRight: false,
        pitchUp: false,
        pitchDown: false,
        rollLeft: false,
        rollRight: false,
        engineUp: false,
        engineDown: false
    };

    const particles = [];
    const MAX_PARTICLES = 100;

    // --- Audio Context & Generators ---
    let audioContext;
    let engineOscillator;
    let engineGain;

    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Engine sound: Basic oscillator with gain controlled by enginePower
            engineOscillator = audioContext.createOscillator();
            engineOscillator.type = 'sawtooth'; // A bit harsher, more like an engine
            engineOscillator.frequency.value = 50; // Base frequency
            engineGain = audioContext.createGain();
            engineGain.gain.value = 0; // Start silent
            engineOscillator.connect(engineGain);
            engineGain.connect(audioContext.destination);
            engineOscillator.start();

            // Background ambient sound (very subtle, procedural "wind")
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < output.length; i++) {
                output[i] = Math.random() * 2 - 1; // White noise
            }
            const noiseSource = audioContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;
            const ambientGain = audioContext.createGain();
            ambientGain.gain.value = 0.01; // Very subtle
            noiseSource.connect(ambientGain);
            ambientGain.connect(audioContext.destination);
            noiseSource.start();


        } catch (e) {
            console.warn(`[${SCRIPT_ID}] Web Audio API not supported or failed to initialize:`, e);
        }
    }

    // --- Canvas Setup ---
    let canvas, ctx;

    function setupCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = SCRIPT_ID + '-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = Z_INDEX_OVERLAY;
        canvas.style.pointerEvents = 'none'; // Allow clicking through to Drawaria elements
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- Drawing Functions ---

    // A utility to draw a glowing effect
    function applyGlow(color, blur) {
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
    }

    function clearGlow() {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    // Draws the aircraft model (simplified 2D representation)
    function drawAircraft() {
        ctx.save();
        ctx.translate(aircraft.x, aircraft.y);

        // Apply yaw for overall heading
        ctx.rotate(aircraft.yawAngle);

        // Apply roll and pitch transformations
        // For a 2D projection, pitch affects Y-scale, roll affects X-scale/skew
        // This is a simplified projection for visual effect, not true 3D
        const scaleY = Math.cos(aircraft.pitchAngle); // Squish vertically for pitch
        const skewX = Math.sin(aircraft.rollAngle); // Skew horizontally for roll

        // Base aircraft body
        ctx.fillStyle = 'rgba(100, 100, 120, 0.9)'; // Dark grey
        ctx.strokeStyle = 'rgba(200, 200, 255, 0.8)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(-40 * scaleY + 20 * skewX, 0); // Nose (adjusted for roll/pitch)
        ctx.lineTo(-20 * scaleY + 50 * skewX, -20); // Wing left front
        ctx.lineTo(20 * scaleY + 50 * skewX, -20);  // Wing left back
        ctx.lineTo(40 * scaleY + 20 * skewX, 0);   // Tail (body end)
        ctx.lineTo(20 * scaleY + 50 * skewX, 20);  // Wing right back
        ctx.lineTo(-20 * scaleY + 50 * skewX, 20); // Wing right front
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit (simulated transparency/reflection)
        ctx.fillStyle = 'rgba(150, 200, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 10 * Math.abs(scaleY), 0, Math.PI * 2);
        ctx.fill();
        applyGlow('rgba(150, 200, 255, 0.6)', 15);
        ctx.arc(0, 0, 10 * Math.abs(scaleY), 0, Math.PI * 2); // Redraw for glow
        ctx.fill();
        clearGlow();


        // Engine exhaust glow/particles
        if (aircraft.enginePower > 0.1) {
            applyGlow(`rgba(255, 150, 0, ${aircraft.enginePower * 0.8})`, aircraft.enginePower * 20 + 5);
            ctx.fillStyle = `rgba(255, 100, 0, ${aircraft.enginePower})`;
            ctx.beginPath();
            ctx.arc(-30 * scaleY, 0, 5 + aircraft.enginePower * 5, 0, Math.PI * 2);
            ctx.fill();
            clearGlow();
        }


        // Propeller/Jet effect (simple spin)
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        const propLength = 15;
        const spinAngle = Date.now() * 0.05 * aircraft.enginePower * 10;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(-45 * scaleY, 0);
            ctx.lineTo(-45 * scaleY + propLength * Math.cos(spinAngle + i * Math.PI / 3),
                       propLength * Math.sin(spinAngle + i * Math.PI / 3));
            ctx.stroke();
        }

        ctx.restore();
    }

    // Draws the interactive UI elements
    function drawUI() {
        ctx.save();

        // --- Info Panel ---
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 150);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 200, 150);

        ctx.font = '16px "Press Start 2P", monospace'; // A retro font if available, else monospace
        ctx.fillStyle = '#00FF00';
        let textY = 30;
        const lineHeight = 20;

        ctx.fillText('FLIGHT DATA', 20, textY);
        textY += lineHeight;
        ctx.fillText(`Speed: ${aircraft.speed.toFixed(1)} km/h`, 20, textY);
        textY += lineHeight;
        ctx.fillText(`Altitude: ${aircraft.altitude.toFixed(0)} m`, 20, textY);
        textY += lineHeight;
        ctx.fillText(`Fuel: ${aircraft.fuel.toFixed(0)}/${aircraft.maxFuel}`, 20, textY);
        textY += lineHeight;
        ctx.fillText(`Engine: ${(aircraft.enginePower * 100).toFixed(0)}%`, 20, textY);
        textY += lineHeight;
        ctx.fillText(`Pitch: ${(aircraft.pitchAngle * 180 / Math.PI).toFixed(0)}°`, 20, textY);
        textY += lineHeight;
        ctx.fillText(`Roll: ${(aircraft.rollAngle * 180 / Math.PI).toFixed(0)}°`, 20, textY);

        // --- Controls Overlay (visual representation) ---
        const controlsPanelX = canvas.width - 210;
        const controlsPanelY = 10;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(controlsPanelX, controlsPanelY, 200, 250);
        ctx.strokeStyle = '#00FFFF';
        ctx.strokeRect(controlsPanelX, controlsPanelY, 200, 250);

        ctx.fillStyle = '#00FFFF';
        ctx.fillText('CONTROLS', controlsPanelX + 10, controlsPanelY + 20);

        const drawButton = (text, x, y, isPressed) => {
            const width = 80;
            const height = 25;
            ctx.fillStyle = isPressed ? '#00FF00' : 'rgba(50, 50, 50, 0.8)';
            applyGlow(isPressed ? '#00FF00' : 'transparent', isPressed ? 10 : 0);
            ctx.fillRect(x, y, width, height);
            clearGlow();
            ctx.strokeStyle = isPressed ? '#FFFFFF' : '#AAAAAA';
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = isPressed ? '#000000' : '#CCCCCC';
            ctx.font = '14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x + width / 2, y + height / 2);
            ctx.textAlign = 'left'; // Reset
        };

        let btnX = controlsPanelX + 10;
        let btnY = controlsPanelY + 40;

        drawButton('W (Fwd)', btnX, btnY, controls.forward);
        drawButton('S (Bwd)', btnX + 90, btnY, controls.backward);
        btnY += 30;
        drawButton('A (Yaw L)', btnX, btnY, controls.turnLeft);
        drawButton('D (Yaw R)', btnX + 90, btnY, controls.turnRight);
        btnY += 30;
        drawButton('Up (Pitch D)', btnX, btnY, controls.pitchDown); // Up arrow means pitch down (nose down)
        drawButton('Down (Pitch U)', btnX + 90, btnY, controls.pitchUp); // Down arrow means pitch up (nose up)
        btnY += 30;
        drawButton('Left (Roll L)', btnX, btnY, controls.rollLeft);
        drawButton('Right (Roll R)', btnX + 90, btnY, controls.rollRight);
        btnY += 30;
        drawButton('+ (Eng Up)', btnX, btnY, controls.engineUp);
        drawButton('- (Eng Down)', btnX + 90, btnY, controls.engineDown);
        btnY += 30;
        ctx.fillStyle = '#FFF';
        ctx.fillText('NUMPAD +/- for Engine', btnX, btnY);


        // --- Animated Compass/Horizon Line ---
        const compassX = canvas.width / 2;
        const compassY = canvas.height - 100;
        const compassRadius = 80;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Horizon line (relative to pitch and roll)
        ctx.save();
        ctx.translate(compassX, compassY);
        ctx.rotate(-aircraft.rollAngle); // Rotate horizon opposite to roll
        ctx.translate(0, aircraft.pitchAngle * compassRadius * 2); // Shift horizon based on pitch

        ctx.strokeStyle = '#ADD8E6'; // Sky blue
        ctx.fillStyle = '#8B4513'; // Earth brown

        ctx.beginPath();
        ctx.moveTo(-compassRadius * 2, 0); // Extend beyond compass for visual effect
        ctx.lineTo(compassRadius * 2, 0);
        ctx.stroke();

        ctx.fillRect(-compassRadius * 2, 0, compassRadius * 4, compassRadius * 2); // Earth
        ctx.restore();

        // Compass markings
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        const headingDeg = (aircraft.yawAngle * 180 / Math.PI + 360) % 360;
        for (let i = 0; i < 360; i += 45) {
            const angle = (i - headingDeg + 360) % 360; // Relative to current heading
            const rad = (angle - 90) * Math.PI / 180; // Adjust for canvas 0deg right

            const text = (i === 0 ? 'N' : i === 90 ? 'E' : i === 180 ? 'S' : i === 270 ? 'W' : i.toString());
            const textX = compassX + Math.cos(rad) * (compassRadius - 20);
            const textY = compassY + Math.sin(rad) * (compassRadius - 20);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, textX, textY);
        }

        // Aircraft indicator on compass
        ctx.beginPath();
        ctx.moveTo(compassX, compassY - compassRadius + 5);
        ctx.lineTo(compassX - 5, compassY - compassRadius + 15);
        ctx.lineTo(compassX + 5, compassY - compassRadius + 15);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    }


    // Draws particles (e.g., exhaust, engine trail)
    function drawParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.fadeRate;
            p.size += p.growRate;

            if (p.alpha <= 0 || p.size >= 20) {
                particles.splice(i, 1);
                continue;
            }

            ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Simple glow for particles
            applyGlow(`rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.5})`, p.size);
            ctx.fill(); // Redraw for glow
            clearGlow();
        }
    }

    function createParticle(x, y) {
        if (particles.length >= MAX_PARTICLES) return;

        const angle = aircraft.yawAngle + Math.PI; // Opposite direction of flight
        const speedFactor = aircraft.speed / aircraft.maxSpeed;
        particles.push({
            x: x + Math.cos(angle) * 10,
            y: y + Math.sin(angle) * 10,
            vx: (Math.random() - 0.5) * 2 - Math.cos(angle) * (speedFactor * 2),
            vy: (Math.random() - 0.5) * 2 - Math.sin(angle) * (speedFactor * 2),
            alpha: 1,
            size: 3 + Math.random() * 3,
            fadeRate: 0.01 + Math.random() * 0.01,
            growRate: 0.1 + Math.random() * 0.1,
            color: { r: 255, g: 150 + Math.random() * 50, b: 0 } // Orange-red for exhaust
        });
    }

    // --- Game Logic ---
    function updateGame() {
        // Engine power control
        if (controls.engineUp) {
            aircraft.enginePower = Math.min(1, aircraft.enginePower + 0.01);
        } else if (controls.engineDown) {
            aircraft.enginePower = Math.max(0, aircraft.enginePower - 0.01);
        }

        // Adjust engine sound
        if (audioContext && engineOscillator && engineGain) {
            engineOscillator.frequency.value = 50 + aircraft.enginePower * 200; // 50Hz to 250Hz
            engineGain.gain.value = aircraft.enginePower * 0.5; // 0 to 0.5 volume
        }

        // Speed calculation based on engine power, drag
        aircraft.speed += aircraft.acceleration * aircraft.enginePower;
        aircraft.speed -= aircraft.deceleration * (1 - aircraft.enginePower); // Natural deceleration
        aircraft.speed = Math.max(0, Math.min(aircraft.maxSpeed, aircraft.speed));


        // Fuel consumption
        if (aircraft.enginePower > 0.05 && aircraft.fuel > 0) {
            aircraft.fuel -= 0.1 * aircraft.enginePower;
            if (aircraft.fuel <= 0) {
                aircraft.fuel = 0;
                aircraft.enginePower = 0; // Engine stalls
                aircraft.speed *= 0.9; // Rapid deceleration
            }
        }

        // Yaw (turn left/right)
        if (controls.turnLeft) {
            aircraft.yawAngle -= aircraft.turnSpeed * (aircraft.speed / aircraft.maxSpeed);
        }
        if (controls.turnRight) {
            aircraft.yawAngle += aircraft.turnSpeed * (aircraft.speed / aircraft.maxSpeed);
        }

        // Pitch (nose up/down)
        if (controls.pitchUp) {
            aircraft.pitchAngle = Math.min(aircraft.maxPitchRoll, aircraft.pitchAngle + aircraft.turnSpeed * 0.5);
        } else if (controls.pitchDown) {
            aircraft.pitchAngle = Math.max(-aircraft.maxPitchRoll, aircraft.pitchAngle - aircraft.turnSpeed * 0.5);
        } else {
            // Self-leveling pitch
            aircraft.pitchAngle *= 0.95; // Gradually return to level
        }

        // Roll (sideways tilt)
        if (controls.rollLeft) {
            aircraft.rollAngle = Math.max(-aircraft.maxPitchRoll, aircraft.rollAngle - aircraft.turnSpeed * 0.7);
        } else if (controls.rollRight) {
            aircraft.rollAngle = Math.min(aircraft.maxPitchRoll, aircraft.rollAngle + aircraft.turnSpeed * 0.7);
        } else {
            // Self-leveling roll
            aircraft.rollAngle *= 0.9; // Gradually return to level
        }

        // Update position based on yaw and speed
        aircraft.x += Math.cos(aircraft.yawAngle) * aircraft.speed;
        aircraft.y += Math.sin(aircraft.yawAngle) * aircraft.speed;

        // Altitude simulation (simple lift/gravity)
        const lift = aircraft.speed * Math.sin(-aircraft.pitchAngle) * 0.5; // Lift based on speed and pitch
        aircraft.verticalSpeed += lift * 0.1 - 0.05; // Gravity effect
        aircraft.altitude += aircraft.verticalSpeed;
        aircraft.altitude = Math.max(0, aircraft.altitude); // Can't go below 0


        // Wrap around screen edges
        if (aircraft.x < 0) aircraft.x = canvas.width;
        if (aircraft.x > canvas.width) aircraft.x = 0;
        if (aircraft.y < 0) aircraft.y = canvas.height;
        if (aircraft.y > canvas.height) aircraft.y = 0;

        // Generate particles if engine is on
        if (aircraft.enginePower > 0.3 && Math.random() < aircraft.enginePower * 0.5) {
            // Particle origin: behind the aircraft, adjusted for yaw
            const particleOriginX = aircraft.x - Math.cos(aircraft.yawAngle) * 40;
            const particleOriginY = aircraft.y - Math.sin(aircraft.yawAngle) * 40;
            createParticle(particleOriginX, particleOriginY);
        }
    }

    // --- Input Handling ---
    function handleKeyDown(event) {
        switch (event.key) {
            case 'w': controls.forward = true; break;
            case 's': controls.backward = true; break;
            case 'a': controls.turnLeft = true; break;
            case 'd': controls.turnRight = true; break;
            case 'ArrowUp': controls.pitchDown = true; break;
            case 'ArrowDown': controls.pitchUp = true; break;
            case 'ArrowLeft': controls.rollLeft = true; break;
            case 'ArrowRight': controls.rollRight = true; break;
            case '+': case 'NumpadAdd': controls.engineUp = true; break;
            case '-': case 'NumpadSubtract': controls.engineDown = true; break;
        }
        // Prevent default browser actions for arrow keys etc.
        if (['w', 's', 'a', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', 'NumpadAdd', 'NumpadSubtract'].includes(event.key)) {
            event.preventDefault();
        }
    }

    function handleKeyUp(event) {
        switch (event.key) {
            case 'w': controls.forward = false; break;
            case 's': controls.backward = false; break;
            case 'a': controls.turnLeft = false; break;
            case 'd': controls.turnRight = false; break;
            case 'ArrowUp': controls.pitchDown = false; break;
            case 'ArrowDown': controls.pitchUp = false; break;
            case 'ArrowLeft': controls.rollLeft = false; break;
            case 'ArrowRight': controls.rollRight = false; break;
            case '+': case 'NumpadAdd': controls.engineUp = false; break;
            case '-': case 'NumpadSubtract': controls.engineDown = false; break;
        }
    }

    // --- Main Game Loop ---
    function gameLoop() {
        updateGame();

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas

        drawAircraft();
        drawParticles();
        drawUI();

        requestAnimationFrame(gameLoop);
    }

    // --- Initialization ---
    function init() {
        console.log(`[${SCRIPT_ID}] Initializing script...`);
        setupCanvas();
        initAudio(); // Initialize audio context
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        gameLoop(); // Start the game loop
        console.log(`[${SCRIPT_ID}] Script initialized. Use WASD, Arrow Keys, Numpad +/- to control the aircraft.`);
    }

    // Ensure the script runs after the page is loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();