// ==UserScript==
// @name         Blooket Hacks
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Blooket hacks 5 hacks made by Jesse Nicolaï
// @author       Jesse Nicolaï
// @match        https://*.blooket.com/*
// @icon         https://ac.blooket.com/play-l/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491117/Blooket%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/491117/Blooket%20Hacks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to toggle the menu
    function toggleMenu() {
        menuContent.style.display = menuContent.style.display === 'none' ? 'block' : 'none';
    }

    // Toggle the menu when the Q key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'q' || event.key === 'Q') {
            toggleMenu();
        }
    });

    // Function to toggle feature and change button style
    function toggleFeature(button, isActive) {
        if (isActive) {
            button.classList.add('active');
            button.textContent = button.textContent.replace(': Off', ': On');
        } else {
            button.classList.remove('active');
            button.textContent = button.textContent.replace(': On', ': Off');
        }
    }

    // Spoof Blooks function
    const spoofBlooks = () => {
        if (!window.location.pathname.split("/").includes("lobby"))
            return alert(
                "You must be in a game lobby! (e.g. https://www.blooket.com/play/lobby)"
            );

        reactHandler().stateNode.setState({
            lockedBlooks: [],
            takenBlooks: [],
        });
        console.log("Blooks spoofed");
    };

    // Create the menu
    const menuContent = document.createElement('div');
    menuContent.id = 'menuContent';
    menuContent.style.cssText = `
        position: fixed;
        top: 1%;
        left: 1%;
        color: #fff;
        background: #1c1c1c;
        padding-top: 1vh;
        padding-bottom: 1vh;
        padding-left: 3vh;
        padding-right: 3vh;
        border-radius: 12px;
        z-index: 9999;
        cursor: move;
        font-size: 14px; /* Adjust font size */
    `;

    menuContent.innerHTML = `
        <h1 style="margin-bottom: 5px; text-align: center;">Blooket Hacks</h1>
        <br>
        <div id="menuList" style="text-align: center;">
            <button id="highlightAnswers" class="menu-button">Highlight Answers: Off</button><br>
            <button id="removeWrongAnswers" class="menu-button">Remove Wrong Answers: Off</button><br>
            <button id="autoAnswer" class="menu-button">Auto Answer: Off</button><br>
            <button id="skipFeedbackScreen" class="menu-button">Skip Feedback Screen: Off</button><br>
            <button id="spoofBlooks" class="menu-button">Spoof Blooks</button><br>
        </div>
        <div style="text-align: center; margin-top: 5px;">
        <br>
            <h4 style="margin: 0; padding: 0;">Press q to hide</h4><br><h5 style="margin-top: -2vh; padding: 0;">Made By Jesse Nicolai v1.3</h5>
        </div>
    `;
    document.body.appendChild(menuContent);

    // Toggle feature when clicking on buttons
    const highlightButton = document.getElementById('highlightAnswers');
    let highlightActive = false;
    let highlightInterval = null; // Variable to hold the interval ID
    highlightButton.addEventListener('click', function() {
        highlightActive = !highlightActive;
        toggleFeature(highlightButton, highlightActive);
        if (highlightActive) {
            // Add your code for toggling highlight answers feature here
            highlightInterval = setInterval(() => {
                const { stateNode: { state, props } } = reactHandler().children[0]._owner;
                [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
                    if ((state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i])) answer.style.backgroundColor = "rgb(0, 207, 119)";
                    else answer.style.backgroundColor = "rgb(189, 15, 38)";
                });
            });
        } else {
            clearInterval(highlightInterval); // Stop the interval when toggled off
            // Reset background color of answer containers when turning off highlight
            [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer) => {
                answer.style.backgroundColor = "";
            });
        }
    });

    const removeButton = document.getElementById('removeWrongAnswers');
    let removeActive = false;
    let removeInterval = null; // Variable to hold the interval ID
    removeButton.addEventListener('click', function() {
        removeActive = !removeActive;
        toggleFeature(removeButton, removeActive);
        if (removeActive) {
            // Add your code for toggling remove wrong answers feature here
            removeInterval = setInterval(() => {
                const { stateNode: { state, props } } = reactHandler().children[0]._owner;
                [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
                    if (!(state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i])) answer.style.display = "none";
                    else answer.style.display = "";
                });
            });
        } else {
            clearInterval(removeInterval); // Stop the interval when toggled off
            // Reset display of answer containers when turning off remove wrong answers
            [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer) => {
                answer.style.display = "";
            });
        }
    });

    const autoButton = document.getElementById('autoAnswer');
    let autoActive = false;
    let autoInterval = null; // Variable to hold the interval ID
    autoButton.addEventListener('click', function() {
        autoActive = !autoActive;
        toggleFeature(autoButton, autoActive);
        if (autoActive) {
            // Add your code for auto-answering here
            autoInterval = setInterval(() => {
                try {
                    const { stateNode: { state, props } } = reactHandler().children[0]._owner;
                    Array.from(document.querySelectorAll('div[class*="answerText"]')).filter(t => t.firstChild.innerHTML === (state.question || props.client.question).correctAnswers[0])[0].click();
                } catch {}
            });
        } else {
            clearInterval(autoInterval); // Stop the interval when toggled off
        }
    });

    const skipFeedbackButton = document.getElementById('skipFeedbackScreen');
    let skipFeedbackActive = false;
    let skipFeedbackInterval = null; // Variable to hold the interval ID
    skipFeedbackButton.addEventListener('click', function() {
        skipFeedbackActive = !skipFeedbackActive;
        toggleFeature(skipFeedbackButton, skipFeedbackActive);
        if (skipFeedbackActive) {
            // Add your code for skipping feedback screen here
            skipFeedbackInterval = setInterval(() => {
                const feedbackButton = document.getElementById('feedbackButton');
                if (feedbackButton) {
                    feedbackButton.click();
                }
            });
        } else {
            clearInterval(skipFeedbackInterval); // Stop the interval when toggled off
        }
    });

    const spoofBlooksButton = document.getElementById('spoofBlooks');
    spoofBlooksButton.addEventListener('click', spoofBlooks);

    // Function to get the react handler
    function reactHandler() {
        return Object.values(document.querySelector("#app > div > div"))[1]
            .children[1]._owner;
    }

    // Make the menu draggable
    let isDragging = false;
    let offsetX, offsetY;

    menuContent.addEventListener('mousedown', function(event) {
        isDragging = true;
        offsetX = event.clientX - parseFloat(window.getComputedStyle(menuContent).left);
        offsetY = event.clientY - parseFloat(window.getComputedStyle(menuContent).top);
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            menuContent.style.left = (event.clientX - offsetX) + 'px';
            menuContent.style.top = (event.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Style the menu
    GM_addStyle(`
        .menu-button {
            margin-bottom: 5px;
            cursor: pointer;
            background-color: darkred;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            width: 200px;
        }
        .menu-button.active {
            background-color: green;
        }
    `);
})();
