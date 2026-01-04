// ==UserScript==
// @name         Google Gravity Effect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a gravity effect to elements on the Google homepage.
// @match        *://google.com/*
// @match        *://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515652/Google%20Gravity%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/515652/Google%20Gravity%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Matter.js library and wait for it to be ready
    const matterScript = document.createElement('script');
    matterScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js';
    matterScript.onload = () => waitForElements();
    document.head.appendChild(matterScript);

    function waitForElements() {
        // Wait for the Google logo and search bar to be available in the DOM
        const checkExist = setInterval(() => {
            const logo = document.getElementById('hplogo');
            const searchBar = document.querySelector('input[name="q"]');
            const buttons = document.querySelectorAll('input[type="submit"]');
            
            if (logo && searchBar && buttons.length > 0) {
                clearInterval(checkExist);
                startGravity(logo, searchBar, buttons);
            }
        }, 100);
    }

    function startGravity(logo, searchBar, buttons) {
        const { Engine, Render, World, Bodies, Events } = Matter;
        const engine = Engine.create();

        // Setup rendering
        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });
        
        Render.run(render);

        // Create physical bodies for elements
        const logoBody = createBodyFromElement(logo);
        const searchBarBody = createBodyFromElement(searchBar);
        const buttonBodies = Array.from(buttons).map(createBodyFromElement);

        // Add elements to the world
        World.add(engine.world, [logoBody, searchBarBody, ...buttonBodies]);

        // Add ground
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 20, { isStatic: true });
        World.add(engine.world, ground);

        // Run the engine
        Engine.run(engine);

        function createBodyFromElement(element) {
            const rect = element.getBoundingClientRect();
            const body = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, {
                restitution: 0.5,
                friction: 0.3
            });

            // Sync body position with element
            Events.on(engine, 'afterUpdate', () => {
                element.style.position = 'absolute';
                element.style.left = `${body.position.x - rect.width / 2}px`;
                element.style.top = `${body.position.y - rect.height / 2}px`;
                element.style.transform = `rotate(${body.angle}rad)`;
            });

            return body;
        }
    }
})();
