// ==UserScript==
// @name         KiwiExploits KEY BYPASSER
// @namespace    https://greasyfork.org/en/scripts/471764-kiwiexploits-key-bypasser
// @version      0.1
// @description  Generate Keys with No Extra Clicks Just wait 12 Seconds
// @author       Foch2803
// @match        https://kiwiexploits.com/*
// @match        https://linkvertise.com/*
// @icon         https://avatars.githubusercontent.com/u/139727811?s=400&u=a73138b011a6f48b9eaad88da89aa9fedd35d6cf&v=4
// @icon64       https://avatars.githubusercontent.com/u/139727811?s=400&u=a73138b011a6f48b9eaad88da89aa9fedd35d6cf&v=4
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/471764/KiwiExploits%20KEY%20BYPASSER.user.js
// @updateURL https://update.greasyfork.org/scripts/471764/KiwiExploits%20KEY%20BYPASSER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating menu element
    const floatingMenu = document.createElement('div');
    floatingMenu.id = 'floating-menu';
    document.body.appendChild(floatingMenu);

    // Apply the Tektur Google Font
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Tektur&display=swap');
        #floating-menu {
            font-family: 'Tektur', sans-serif;
            position: fixed;
            top: 50%;
            left: 20px;
            background-color: #333;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            cursor: move;
            width: 240px; /* Increased width */
        }
        #floating-menu h2 {
            text-align: center;
            margin: 0 0 10px;
        }
        #floating-menu img {
            display: block;
            width: 100px;
            height: 100px;
            margin: 0 auto;
            margin-bottom: -19px;
            margin-top: -19px;
        }
        #floating-menu p {
            font-size: 12px;
            text-align: left;
            margin: 0;
            margin-top: 5px;
        }
        #toggle-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
        }
        .toggle-label {
            margin-right: 10px;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            border-radius: 24px;
            background-color: #ccc;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
            transition: background-color 0.4s;
        }
        .toggle-slider:before {
            border-radius: 50%;
            content: '';
            position: absolute;
            width: 18px;
            height: 18px;
            top: 3px;
            left: 3px;
            background-color: white;
            transition: transform 0.4s;
        }
        input:checked + .toggle-slider {
            background-color: #2196F3;
        }
        input:checked + .toggle-slider:before {
            transform: translateX(16px);
        }
        #footer-text {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-top: 5px;
        }
        #footer-text-left {
            text-align: left;
        }
        #footer-text-right {
            text-align: right;
        }
        /* Additional Footer Texts */
        #footer-text2 {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-top: 5px;
            color: cyan;
            animation: glowing 2s ease infinite;
            display: none;
        }
        #footer-text-left2 {
            text-align: left;
        }
        #footer-text-right2 {
            text-align: right;
        }
        #footer-text3 {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-top: 5px;
            color: green;
            display: none;
        }
        #footer-text-left3 {
            text-align: left;
        }
        #footer-text-right3 {
            text-align: right;
            animation: animate__flash 2s infinite;
        }
        /* Glowing Effect */
        @keyframes glowing {
            0% {
                text-shadow: 0 0 5px cyan;
            }
            50% {
                text-shadow: 0 0 20px cyan;
            }
            100% {
                text-shadow: 0 0 5px cyan;
            }
        }
        /* Flash Animation */
        @keyframes animate__flash {
            0%, 50% {
                opacity: 1;
            }
            25%, 75% {
                opacity: 0;
            }
        }
        /* Custom styles for textbox and button */
        #key-container {
            display: none;
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
        }
        #key-textbox {
            width: 80%;
            padding: 5px;
            font-size: 10px;
            background-color: #202125;
            color: white;
            border: 1px solid white;
        }
        #key-copy-button {
            width: 20%;
            padding: 5px;
            font-size: 10px;
            background-color: #2196F3;
            border: none;
            color: white;
            cursor: pointer;
        }
        /* Styling for gitfetch div */
        #gitfetch {
            margin-top: 10px;
            border: 1px solid #333;
            background-color: #202125;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            max-width: 400px;
        }
        #install-button {
            margin-top: 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
            width: 100%;
        }
    `);

    // Make the menu draggable
    let isDragging = false;
    let mouseOffsetX, mouseOffsetY;

    // Get the last saved position from localStorage
    const savedPosition = JSON.parse(localStorage.getItem('floatingMenuPosition'));
    if (savedPosition && !isNaN(savedPosition.x) && !isNaN(savedPosition.y)) {
        floatingMenu.style.left = savedPosition.x + 'px';
        floatingMenu.style.top = savedPosition.y + 'px';
    }

    floatingMenu.addEventListener('mousedown', function(e) {
        isDragging = true;
        mouseOffsetX = e.clientX - floatingMenu.offsetLeft;
        mouseOffsetY = e.clientY - floatingMenu.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            floatingMenu.style.left = `${e.clientX - mouseOffsetX}px`;
            floatingMenu.style.top = `${e.clientY - mouseOffsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        // Save the position to localStorage when dragging stops
        const currentPosition = { x: parseFloat(floatingMenu.style.left), y: parseFloat(floatingMenu.style.top) };
        localStorage.setItem('floatingMenuPosition', JSON.stringify(currentPosition));
    });

    // Add content to the floating menu
    floatingMenu.innerHTML = `
        <img src="https://raw.githubusercontent.com/musaalif6969/kiwiexploits.com-Bypass/main/img/image.png" alt="Logo">
        <h2>KIWI Key Bypass</h2>
        <p>Auto Bypass By Foch</p>
        <div id="toggle-container">
            <label class="toggle-label" for="autoBypass">Toggle</label>
            <label class="toggle-switch">
                <input type="checkbox" id="autoBypass">
                <span class="toggle-slider"></span>
            </label>
        </div>
        <div id="footer-text">
            <span id="footer-text-left">Status:</span>
            <span id="footer-text-right">Nothing</span>
        </div>
        <div id="footer-text2">
            <span id="footer-text-left2">Status:</span>
            <span id="footer-text-right2">Bypassing</span>
        </div>
        <div id="footer-text3">
            <span id="footer-text-left3">Status:</span>
            <span id="footer-text-right3">Key Generated</span>
        </div>
        <div id="key-container">
            <input type="text" id="key-textbox" readonly>
            <button id="key-copy-button">Copy</button>
        </div>
        <div id="install-button" style="text-align: center;">
              <a href="https://greasyfork.org/en/scripts/471759-remove-alerts-on-kiwiexploits-com-extension" target="_blank" style="text-decoration: underline; color: white;">Install Alert Remover!</a>
        </div>

    `;

    // Function to fetch and insert HTML content from GitHub
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/musaalif6969/kiwiexploits.com-Bypass/main/fetch/stats.html',
        onload: function(response) {
            const gitfetch = document.createElement('div');
            gitfetch.id = 'gitfetch';
            gitfetch.innerHTML = response.responseText;
            floatingMenu.appendChild(gitfetch);
        },
        onerror: function(error) {
            console.error('Error fetching content from GitHub:', error);
        },
    });

    // Restore the toggle state from localStorage on page load
    const toggleSwitch = document.getElementById('autoBypass');
    const storedValue = localStorage.getItem('autoBypass');
    if (storedValue) {
        toggleSwitch.checked = JSON.parse(storedValue);
    }

    // Function to wait for a certain time in milliseconds
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to remove spaces from a string
    function removeSpaces(str) {
        return str.replace(/\s+/g, '');
    }

    // Function to copy the text to the input element after waiting
    async function copyTextToInput() {
        const mainCaptcha = document.querySelector('h2#mainCaptcha');
        const txtInput = document.getElementById('txtInput');
        if (mainCaptcha && txtInput) {
            await wait(350); // Wait for 350 milliseconds
            const captchaText = mainCaptcha.textContent.trim();
            const textWithoutSpaces = removeSpaces(captchaText);
            txtInput.value = textWithoutSpaces;

            // Wait for an additional 2.2 seconds before clicking the button
            await wait(2800);
            const button = document.getElementById('Button1');
            if (button) {
                button.click();
            }
        }
    }

    // Function to handle the toggle change event
    function handleToggleChange() {
        localStorage.setItem('autoBypass', JSON.stringify(toggleSwitch.checked));
        if (toggleSwitch.checked) {
            copyTextToInput();
        }
        checkFooterTexts();
    }

    // Check if the toggle is on and execute the copyTextToInput function
    if (toggleSwitch.checked) {
        copyTextToInput();
    }

    // Function to check and display footer texts based on conditions
    function checkFooterTexts() {
        const keyFound = document.getElementById('key');
        const buttonFound = document.getElementById('Button1');
        const keyContainer = document.getElementById('key-container');

        if (toggleSwitch.checked) {
            if (keyFound) {
                // Case: 1 (Show footer-text3)
                floatingMenu.querySelector('#footer-text2').style.display = 'none';
                floatingMenu.querySelector('#footer-text').style.display = 'none';
                floatingMenu.querySelector('#footer-text3').style.display = 'flex';
                floatingMenu.querySelector('#footer-text-right3').textContent = 'Key Generated';
                keyContainer.style.display = 'flex';
                const keyElement = document.getElementById('key');
                const keyTextbox = document.getElementById('key-textbox');
                if (keyElement && keyTextbox) {
                    keyTextbox.value = keyElement.textContent.trim();
                }
            } else if (buttonFound) {
                // Case: 2 (Show footer-text2)
                floatingMenu.querySelector('#footer-text3').style.display = 'none';
                floatingMenu.querySelector('#footer-text').style.display = 'none';
                floatingMenu.querySelector('#footer-text2').style.display = 'flex';
                keyContainer.style.display = 'none';
            } else {
                // Default (Show footer-text)
                floatingMenu.querySelector('#footer-text2').style.display = 'none';
                floatingMenu.querySelector('#footer-text3').style.display = 'none';
                floatingMenu.querySelector('#footer-text').style.display = 'flex';
                floatingMenu.querySelector('#footer-text-right').textContent = 'Nothing';
                keyContainer.style.display = 'none';
            }
        } else {
            // Case: 3 (Toggle off, show only footer-text)
            floatingMenu.querySelector('#footer-text2').style.display = 'none';
            floatingMenu.querySelector('#footer-text3').style.display = 'none';
            floatingMenu.querySelector('#footer-text').style.display = 'flex';
            floatingMenu.querySelector('#footer-text-right').textContent = 'Nothing';
            keyContainer.style.display = 'none';
        }
    }

    // Execute checkFooterTexts on initial load
    checkFooterTexts();

    // Check for specific elements and update the footer texts accordingly
    const observer = new MutationObserver(checkFooterTexts);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Function to copy the text from key-textbox when the button is clicked
    document.getElementById('key-copy-button').addEventListener('click', function() {
        const keyTextbox = document.getElementById('key-textbox');
        if (keyTextbox) {
            keyTextbox.select();
            document.execCommand('copy');
        }
    });

    // Add event listener for the toggle change event
    toggleSwitch.addEventListener('change', handleToggleChange);

// ... (previous code)

// Function to open the "Remove Alerts on KiwiExploits.com" extension page
function openExtensionPage() {
    window.open('https://greasyfork.org/en/scripts/471759-remove-alerts-on-kiwiexploits-com-extention', '_blank');
}

// Add event listener for the "Install alert remover" button
const installAlertRemoverButton = document.getElementById('install-alert-remover');
if (installAlertRemoverButton) {
    installAlertRemoverButton.addEventListener('click', openExtensionPage);
}

// ... (remaining code)


    // Redirect logic for linkvertise URLs
    const currentURL = window.location.href;
    if (currentURL === 'https://linkvertise.com/17242/Key1/1') {
        setTimeout(function() {
            window.location.href = 'https://kiwiexploits.com/Key2';
        }, 4000);
    } else if (currentURL === 'https://linkvertise.com/17242/Key2/1') {
        setTimeout(function() {
            window.location.href = 'https://kiwiexploits.com/KeySystems/index.php';
        }, 4000);
    }
})();
