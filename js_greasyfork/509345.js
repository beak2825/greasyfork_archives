// ==UserScript==
// @name         Like Automator
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  This is a "like" automator (first N posts only).
// @author       biganthonymo
// @match        https://x.com/*/status/*
// @icon              data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTIyLjg4IDExNC40MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIyLjg4IDExNC40MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48IVtDREFUQVsKCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRUU0ODU2O30KCS5zdDF7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZGRkZGO30KXV0+PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNOS4zMiwwaDEwNC4yNGM1LjEzLDAsOS4zMiw0LjIsOS4zMiw5LjMydjczLjYyYzAsNS4xMS00LjIxLDkuMzItOS4zMiw5LjMySDgzLjg0bC0xNi4xNywxOS4wNiBjLTMuNTgsNC4yMy05LjQ1LDQuMDQtMTIuODEsMEwzOS4wNCw5Mi4yNkg5LjMyQzQuMjEsOTIuMjYsMCw4OC4wNywwLDgyLjk0VjkuMzJDMCw0LjE5LDQuMTksMCw5LjMyLDBMOS4zMiwweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MS4yLDMwLjQyYzMuNTMtMy42OCw2LTYuMTcsMTEuNDMtNi43OWMxMC4yLTEuMTcsMjAuMjcsOS4yNywxNS4xMiwxOS41NmMtMS45LDMuNzktOC40OSwxMC4xNi0xMy43NiwxNS4xNSBjLTIuMDEsMS45LTMuODMsMy42MS01LjEyLDQuODlsLTcuNjYsNy42bC02LjMzLTYuMDljLTEuOTEtMS44My00LjE2LTMuNzktNi40Ni01Ljg3QzQxLjUsNTIuNjQsMzQuMDUsNDUuMywzMy43NCwzNi43MyBjLTAuMjktOC4wMSw2LjcyLTEzLjE1LDE0LTEzLjA2QzU0LjIsMjMuNzYsNTYuOTIsMjYuMjUsNjEuMiwzMC40Mkw2MS4yLDMwLjQyeiIvPjwvZz48L3N2Zz4=
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/509345/Like%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/509345/Like%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the window to load completely
    window.onload = function() {
        // Function to get random delay
        function getRandomDelay() {
            return Math.floor(Math.random() * 400) + 100; // Random delay between 100 and 500 ms
        }

        function simulatePageDown() {
            window.scrollBy(0, window.innerHeight);
        }

        function scrollDownMultipleTimes(times, delay) {
            for (let i = 0; i < times; i++) {
                setTimeout(simulatePageDown, i * delay);
            }
        }

        function simulatePageUp() {
            window.scrollBy(0, -window.innerHeight);
        }

        function scrollUpMultipleTimes(times, delay) {
            for (let i = 0; i < times; i++) {
                setTimeout(simulatePageUp, i * delay);
            }
        }

        // Create and append the floating button
        const floatButton = document.createElement('button');
        floatButton.innerText = 'Like Automator';
        Object.assign(floatButton.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: '9999',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });

        // Append button to body only if body exists
        if (document.body) {
            document.body.appendChild(floatButton);
        } else {
            console.error('Document body is not available to append the button.');
            return;
        }

        // Button click event to process all likes
        floatButton.addEventListener('click', function() {
            const buttons = document.querySelectorAll('[data-testid="like"]');
            let clickedCount = 0;

            function processButton(i) {
                if (i >= buttons.length || i >= 50) return;

                buttons[i].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                setTimeout(function() {
                    buttons[i].click();
                    clickedCount++;
                    floatButton.innerText = `Like Automator (${clickedCount} / ${buttons.length - 1})`;
                    setTimeout(() => processButton(i + 1), getRandomDelay());
                }, 500);
            }

            processButton(1); // Start processing from the second button
        });
    };
})();