// ==UserScript==
// @name         YouTube Gui 4 Fun
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a small GUI with checkboxes and other elements matching YouTube's style with a dark mode background, drag functionality, 
// @author       LianoVz
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501963/YouTube%20Gui%204%20Fun.user.js
// @updateURL https://update.greasyfork.org/scripts/501963/YouTube%20Gui%204%20Fun.meta.js
// ==/UserScript==

/* global confetti */

(function() {
    'use strict';

    // Declare the confetti variable to prevent ESLint errors
    let confetti;

    // Function to create the GUI
    function createGUI() {
        // Inject CSS for special effects
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes glow {
                0% {
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                }
                50% {
                    box-shadow: 0 0 20px rgba(255, 0, 0, 1);
                }
                100% {
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                }
            }

            .glow {
                animation: glow 1s infinite;
            }

            .container-dragging {
                transition: border-color 0.2s ease;
            }

            .container-dragging:hover {
                border-color: rgba(255, 0, 0, 0.8);
            }

            .high-priority {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2147483647; /* Max possible z-index value */
                pointer-events: none; /* Allow pointer events to pass through */
            }

            .high-priority > div {
                pointer-events: auto; /* Enable pointer events for the container */
            }

            .joke-container {
                margin-top: 10px;
                padding: 10px;
                background-color: #333;
                border-radius: 5px;
                color: #fff;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);

        // Create the high-priority container
        const highPriorityContainer = document.createElement('div');
        highPriorityContainer.classList.add('high-priority');

        // Create the GUI container div
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '100px';
        container.style.right = '20px';
        container.style.width = '200px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#868686';
        container.style.border = '2px solid #333';
        container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        container.style.borderRadius = '10px';
        container.style.cursor = 'move'; // Change cursor to indicate draggable area
        container.style.zIndex = '2147483647'; // Ensure the container is on top

        // Add a title
        const title = document.createElement('h3');
        title.innerText = 'YouTube GUI';
        title.style.fontSize = '16px';
        title.style.marginBottom = '10px';
        title.style.color = '#000';
        container.appendChild(title);

        // Add checkboxes
        const checkboxes = [
            { id: 'checkbox1', label: 'ExploreWithUs', action: () => { window.location.href = 'https://www.youtube.com/@ExploreWithUs'; } },
            { id: 'checkbox2', label: 'Display a joke', action: toggleJoke },
            { id: 'checkbox3', label: 'Confetti Effect', action: toggleConfetti },
            { id: 'checkbox4', label: 'Dark Mode', action: toggleDarkMode },
            { id: 'checkbox5', label: 'Dark 4 YT', action: toggleYouTubeDarkMode }
        ];

        checkboxes.forEach(checkboxInfo => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.marginBottom = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxInfo.id;
            checkbox.style.marginRight = '5px';

            const label = document.createElement('label');
            label.htmlFor = checkboxInfo.id;
            label.innerText = checkboxInfo.label;
            label.style.fontSize = '14px';
            label.style.color = '#000';

            checkbox.addEventListener('click', checkboxInfo.action);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            container.appendChild(checkboxContainer);
        });

        // Add a button
        const button = document.createElement('button');
        button.innerText = 'Click Me';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 15px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Button click event
        button.addEventListener('click', () => {
            alert('Ty you for using my GUI');
        });

        container.appendChild(button);

        // Append the container to the high-priority container
        highPriorityContainer.appendChild(container);
        // Append the high-priority container to the body
        document.body.appendChild(highPriorityContainer);

        // Make the container draggable with special effects
        let isDragging = false;
        let offsetX, offsetY;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            container.classList.add('glow');
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
                container.style.right = 'auto'; // Reset right to auto when dragging
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.classList.remove('glow');
            container.style.cursor = 'move';
        });

        // Check the state of the dark mode checkbox and set the theme accordingly
        const darkModeCheckbox = document.getElementById('checkbox5');
        if (localStorage.getItem('yt-dark-mode') === 'true') {
            darkModeCheckbox.checked = true;
            document.documentElement.setAttribute('dark', 'true');
        }
    }

    // Function to fetch a joke from the API and display it
    function fetchJoke() {
        fetch('https://official-joke-api.appspot.com/jokes/random')
            .then(response => response.json())
            .then(data => {
                displayJoke(data.setup, data.punchline);
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
                displayJoke('Oops!', 'Failed to fetch a joke.');
            });
    }

    // Function to display the fetched joke
    function displayJoke(setup, punchline) {
        // Create the joke container if it doesn't exist
        let jokeContainer = document.getElementById('jokeContainer');
        if (!jokeContainer) {
            jokeContainer = document.createElement('div');
            jokeContainer.id = 'jokeContainer';
            jokeContainer.className = 'joke-container';
            document.querySelector('.high-priority > div').appendChild(jokeContainer);
        }
        // Update the joke container with the new joke
        jokeContainer.innerHTML = `<strong>${setup}</strong><br>${punchline}`;
    }

    // Function to toggle the joke display on checkbox change
    function toggleJoke() {
        const checkbox = document.getElementById('checkbox2');
        if (checkbox.checked) {
            fetchJoke();
        } else {
            removeJoke();
        }
    }

    // Function to remove the displayed joke
    function removeJoke() {
        const jokeContainer = document.getElementById('jokeContainer');
        if (jokeContainer) {
            jokeContainer.remove();
        }
    }

    // Load the canvas-confetti library and call a callback function once loaded
    function loadConfettiLibrary(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
        script.onload = () => {
            confetti = window.confetti;
            callback();
        };
        document.head.appendChild(script);
    }

    // Function to toggle the confetti effect
    function toggleConfetti() {
        const checkbox = document.getElementById('checkbox3');
        if (checkbox.checked) {
            startConfetti();
        } else {
            stopConfetti();
        }
    }

    // Function to start the confetti effect
    function startConfetti() {
        loadConfettiLibrary(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    }

    // Function to stop the confetti effect
    function stopConfetti() {
        if (confetti) {
            confetti.reset();
        }
    }

    // Function to toggle the background color to dark mode
    function toggleDarkMode() {
        const checkbox = document.getElementById('checkbox4');
        const container = document.querySelector('.high-priority > div');
        const labels = container.querySelectorAll('h3, label');

        if (checkbox.checked) {
            container.style.backgroundColor = '#171717';
            container.style.color = '#fff';
            labels.forEach(label => {
                label.style.color = '#fff';
            });
        } else {
            container.style.backgroundColor = '#868686';
            container.style.color = '#000';
            labels.forEach(label => {
                label.style.color = '#000';
            });
        }
    }

    // Function to toggle YouTube's appearance theme to dark mode
    function toggleYouTubeDarkMode() {
        const checkbox = document.getElementById('checkbox5');
        const isDarkMode = checkbox.checked;
        localStorage.setItem('yt-dark-mode', isDarkMode ? 'true' : 'false');
        document.documentElement.setAttribute('dark', isDarkMode ? 'true' : 'false');
        if (isDarkMode) {
            document.querySelector('html').setAttribute('dark', 'true');
        } else {
            document.querySelector('html').removeAttribute('dark');
        }
    }

    // Wait for the page to load before creating the GUI
    window.addEventListener('load', createGUI);

})();
