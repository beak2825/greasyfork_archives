// ==UserScript==
// @name         Arch-A Auto Answer
// @namespace    https://github.com/DevilGlitch/ArchA
// @version      A.4.0.0
// @description  Auto-answer and search assistant with a customizable UI for Brainly and Apex Learning websites.
// @author       TheLostMoon
// @license      MIT
// @match        https://course.apexlearning.com/*
// @match        https://brainly.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514686/Arch-A%20Auto%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/514686/Arch-A%20Auto%20Answer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // UI Initialization
    const initUI = () => {
        const container = document.createElement('div');
        container.id = 'archAUI';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#ffffff';
        container.style.border = '2px solid #333';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
        container.style.zIndex = '1000';
        container.style.fontFamily = 'Arial, sans-serif';

        // UI Title
        const title = document.createElement('h3');
        title.textContent = 'Arch-A Auto Answer';
        title.style.marginBottom = '10px';
        container.appendChild(title);

        // Toggle Auto Answer Feature
        const toggleLabel = document.createElement('label');
        toggleLabel.textContent = 'Enable Auto Answer';
        toggleLabel.style.marginRight = '8px';

        const toggleAutoAnswer = document.createElement('input');
        toggleAutoAnswer.type = 'checkbox';
        toggleAutoAnswer.id = 'autoAnswerToggle';

        toggleLabel.appendChild(toggleAutoAnswer);
        container.appendChild(toggleLabel);

        document.body.appendChild(container);
    };

    // Auto-answer function for Brainly.com
    const autoAnswer = () => {
        if (window.location.host === 'brainly.com') {
            document.addEventListener('DOMContentLoaded', function () {
                const question = document.querySelector('.brn-qpage-next-question-box-content .sg-text');
                if (question) {
                    const query = question.textContent.trim().replace(/\s+/g, '+');
                    const searchUrl = `https://www.google.com/search?q=${query}`;
                    window.open(searchUrl, '_blank');
                }
            });
        }
    };

    // Event listener for auto answer toggle
    const setupAutoAnswer = () => {
        const toggle = document.getElementById('autoAnswerToggle');
        toggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                autoAnswer();
            }
        });
    };

    // Google Search for Apex Learning
    if (window.location.host === 'course.apexlearning.com') {
        let highlightedText = '';
        window.addEventListener('mouseup', () => {
            highlightedText = window.getSelection().toString();
            if (!highlightedText) return;

            const query = highlightedText.replace(/\s+/g, '+');
            const searchUrl = `https://www.google.com/search?q=${query}`;
            window.open(searchUrl, '_blank');
            window.getSelection().removeAllRanges();
        });
    }

    // Brainly.com Cleanup
    if (window.location.host === 'brainly.com') {
        document.addEventListener('DOMContentLoaded', () => {
            const unwantedElements = [
                '.brn-expanded-bottom-banner',
                '.brn-brainly-plus-box',
                '.brn-fullscreen-toplayer',
                '.sg-overlay.sg-overlay--dark',
            ];

            unwantedElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.remove();
                }
            });
        });
    }

    // Initialize UI and auto-answer setup
    initUI();
    setupAutoAnswer();
})();