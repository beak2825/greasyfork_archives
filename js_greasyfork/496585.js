// ==UserScript==
// @name         AnimeFLV Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Select video provider option automatically and add a Page Up button
// @author       JJJ
// @match        *://*.animeflv.net/anime/*
// @match        *://*.animeflv.net/ver/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animeflv.net
// @grant        GM.addStyle
// @grant        GM.registerMenuCommand
// @grant        window.onurlchange
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496585/AnimeFLV%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/496585/AnimeFLV%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const CLASS_SELECTOR = '.CapiTnv.nav.nav-pills > li';
    const STORAGE_KEY = 'selectedOption';
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 10;

    // CSS styles for the custom menu and Page Up button
    const menuStyles = `
        #customMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 5px;
            display: none;
        }

        #optionDropdown {
            margin-bottom: 10px;
            padding: 5px;
            width: 200px;
        }

        #confirmButton {
            padding: 5px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
        }

        .button-85 {
            padding: 0.6em 2em;
            border: none;
            outline: none;
            color: rgb(255, 255, 255);
            background: #111;
            cursor: pointer;
            position: fixed;
            bottom: 20px;
            right: 100px;
            z-index: 9999;
            border-radius: 10px;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            display: none;
        }

        .button-85:before {
            content: "";
            background: linear-gradient(
                45deg,
                #ff0000,
                #ff7300,
                #fffb00,
                #48ff00,
                #00ffd5,
                #002bff,
                #7a00ff,
                #ff00c8,
                #ff0000
            );
            position: absolute;
            top: -2px;
            left: -2px;
            background-size: 400%;
            z-index: -1;
            filter: blur(5px);
            -webkit-filter: blur(5px);
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            animation: glowing-button-85 20s linear infinite;
            transition: opacity 0.3s ease-in-out;
            border-radius: 10px;
        }

        @keyframes glowing-button-85 {
            0% {
                background-position: 0 0;
            }
            50% {
                background-position: 400% 0;
            }
            100% {
                background-position: 0 0;
            }
        }

        .button-85:after {
            z-index: -1;
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: #222;
            left: 0;
            top: 0;
            border-radius: 10px;
        }
    `;

    // Function to safely add styles
    async function addStyles(css) {
        try {
            if (typeof GM.addStyle === 'function') {
                await GM.addStyle(css);
            } else {
                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        } catch (error) {
            console.error('Error adding styles:', error);
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    // Function to wait for element
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found`));
            }, timeout);
        });
    }

    // Function to create the dropdown menu
    function createDropdownMenu(options) {
        const dropdownMenu = document.createElement('select');
        dropdownMenu.id = 'optionDropdown';

        Array.from(options).forEach((option) => {
            const dropdownOption = document.createElement('option');
            const optionText = option.getAttribute('title') || option.textContent.trim();
            dropdownOption.value = optionText;
            dropdownOption.textContent = optionText;
            dropdownMenu.appendChild(dropdownOption);
        });

        return dropdownMenu;
    }

    // Function to toggle the menu visibility
    function toggleMenu() {
        const menu = document.getElementById('customMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Function to handle option selection
    async function handleOptionSelection() {
        const dropdown = document.getElementById('optionDropdown');
        if (!dropdown) return;

        const selectedOptionValue = dropdown.value;
        localStorage.setItem(STORAGE_KEY, selectedOptionValue);

        const options = document.querySelectorAll(CLASS_SELECTOR);
        for (const option of options) {
            if ((option.getAttribute('title') || option.textContent.trim()) === selectedOptionValue) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    option.click();
                    toggleMenu();
                    break;
                } catch (error) {
                    console.error('Error clicking option:', error);
                }
            }
        }
    }

    // Function to create the custom menu
    function createCustomMenu() {
        if (document.getElementById('customMenu')) return;

        const options = document.querySelectorAll(CLASS_SELECTOR);
        if (options.length === 0) return;

        const customMenu = document.createElement('div');
        customMenu.id = 'customMenu';

        const dropdownMenu = createDropdownMenu(options);
        const selectedOptionValue = localStorage.getItem(STORAGE_KEY);
        if (selectedOptionValue) {
            dropdownMenu.value = selectedOptionValue;
        }

        const confirmButton = document.createElement('button');
        confirmButton.id = 'confirmButton';
        confirmButton.textContent = 'Confirmar';
        confirmButton.addEventListener('click', handleOptionSelection);

        customMenu.appendChild(dropdownMenu);
        customMenu.appendChild(confirmButton);
        document.body.appendChild(customMenu);
    }

    // Function to automatically select the saved option
    async function autoSelectOption() {
        const selectedOptionValue = localStorage.getItem(STORAGE_KEY);
        if (!selectedOptionValue) return;

        try {
            await waitForElement(CLASS_SELECTOR);
            const options = document.querySelectorAll(CLASS_SELECTOR);

            for (const option of options) {
                if ((option.getAttribute('title') || option.textContent.trim()) === selectedOptionValue) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    option.click();
                    break;
                }
            }
        } catch (error) {
            console.error('Error in autoSelectOption:', error);
        }
    }

    // Function to create the Page Up button
    function createPageUpButton() {
        if (document.querySelector('.button-85')) return;

        const button = document.createElement('button');
        button.innerHTML = 'Page Up';
        button.className = 'button-85';
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        document.body.appendChild(button);
    }

    // Function to toggle the Page Up button visibility
    function togglePageUpButton() {
        const button = document.querySelector('.button-85');
        if (button) {
            button.style.display = window.scrollY > 100 ? 'block' : 'none';
        }
    }

    // Function to initialize the script
    async function init() {
        try {
            await addStyles(menuStyles);
            createPageUpButton();

            await waitForElement(CLASS_SELECTOR);
            createCustomMenu();
            await autoSelectOption();

            window.addEventListener('scroll', togglePageUpButton);
            document.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    toggleMenu();
                }
            });

        } catch (error) {
            console.error('Init error:', error);
            initAttempts++;
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                setTimeout(init, 1000);
            }
        }
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    } else {
        setTimeout(init, 1000);
    }
})();