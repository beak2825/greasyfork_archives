// ==UserScript==
// @name         Useless Things Series: Circle 5 - Solar System Simulation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulates a basic solar system with circles representing planets, orbits, and direction indicators.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487740/Useless%20Things%20Series%3A%20Circle%205%20-%20Solar%20System%20Simulation.user.js
// @updateURL https://update.greasyfork.org/scripts/487740/Useless%20Things%20Series%3A%20Circle%205%20-%20Solar%20System%20Simulation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random color
    function randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    // Function to generate random velocity vector
    function randomVelocity(speed) {
        const angle = Math.random() * Math.PI * 2;
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    // Function to update planet positions and draw them on the canvas
    function updateAndDrawPlanets(ctx, planets) {
        planets.forEach(planet => {
            planet.angle += planet.angularSpeed;
            planet.x = planet.centerX + Math.cos(planet.angle) * planet.distance;
            planet.y = planet.centerY + Math.sin(planet.angle) * planet.distance;

            // Draw orbit
            ctx.beginPath();
            ctx.arc(planet.centerX, planet.centerY, planet.distance, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,69,0)';
            ctx.stroke();
            ctx.closePath();

            // Draw direction indicator
            const directionX = planet.centerX + Math.cos(planet.angle) * (planet.distance - planet.radius - 5);
            const directionY = planet.centerY + Math.sin(planet.angle) * (planet.distance - planet.radius - 5);
            ctx.beginPath();
            ctx.moveTo(planet.centerX, planet.centerY);
            ctx.lineTo(directionX, directionY);
            ctx.strokeStyle = 'rgba(255,191,0)';
            ctx.stroke();
            ctx.closePath();

            // Draw planet
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
            ctx.fillStyle = planet.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    // Main function to initialize and run the solar system simulation
    function runSolarSystem(numPlanets, sunRadius, planetDistances, planetSpeeds, planetRadii) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const planets = [];

        // Generate sun
        const sunX = canvas.width / 2;
        const sunY = canvas.height / 2;
        planets.push({ x: sunX, y: sunY, centerX: sunX, centerY: sunY, distance: 0, angle: 0, angularSpeed: 0, color: '#ffcc00', radius: sunRadius });

        // Generate planets
        for (let i = 0; i < numPlanets; i++) {
            const distance = planetDistances[i] * 50 + 100; // Scale distances for better visualization
            const angularSpeed = planetSpeeds[i] / distance; // Orbital speed decreases with distance
            const color = randomColor();
            const radius = planetRadii[i] / 10; // Scale radii for better visualization
            planets.push({ x: sunX + distance, y: sunY, centerX: sunX, centerY: sunY, distance: distance, angle: Math.random() * Math.PI * 2, angularSpeed: angularSpeed, color: color, radius: radius });
        }

        // Update and draw planets and grid
        setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            updateAndDrawPlanets(ctx, planets); // Update and draw planets
        }, 1000 / 60); // Update at 60 frames per second
    }

    // Define parameters for the solar system
    const numPlanets = 8; // Number of planets (including dwarf planets like Pluto)
    const sunRadius = 30; // Radius of the sun
    const planetDistances = [0.4, 0.7, 1.0, 1.5, 2.2, 3.0, 4.0, 5.0]; // Relative distances of planets from the sun
    const planetSpeeds = [0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1]; // Angular speeds of planets (radians per frame)
    const planetRadii = [20, 40, 60, 80, 100, 120, 140, 160]; // Relative radii of planets

    // Run the solar system simulation
    runSolarSystem(numPlanets, sunRadius, planetDistances, planetSpeeds, planetRadii);

})();
