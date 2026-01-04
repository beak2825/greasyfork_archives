// ==UserScript==
// @name         Drawaria Hacker Accounts
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Access to Drawaria accounts! Use this script to access accounts and add hacked ones too.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/539539/Drawaria%20Hacker%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/539539/Drawaria%20Hacker%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Predefined accounts
    const DEFAULT_ACCOUNTS = [
        {
            email: "carabettasofia21@gmail.com",
            password: "12200ahh"
        },
        {
            email: "keylavpn@gmail.com",
            password: "keykey07"
        },
        {
            email: "M4Tllltrollacc@gmail.com",
            password: "tr0llingwiththis"
        }
    ];

    const STORAGE_KEY = 'drawaria_manager_accounts';
    let currentAccounts = [];

    const LOADING_MESSAGES = [
        "Injecting source code...",
        "Hacking Drawaria mainframe...",
        "Searching for fun bits...",
        "Jumping firewalls with style...",
        "Unlocking the password vault...",
        "Loading login matrix...",
        "Almost ready for action...",
        "Bingo! Connection established..."
    ];
    let loadingInterval;
    let loadingMessageIndex = 0;

    // Data Management Functions
    function loadAccounts() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (e) {
                console.error("Error parsing accounts from localStorage:", e);
                return JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
            }
        }
        return JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
    }

    function saveAccounts(accountsToSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accountsToSave));
    }

    function addAccount(email, password) {
        currentAccounts.push({ email, password });
        saveAccounts(currentAccounts);
        renderAccounts();
    }

    // CSS Style Injection
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Roboto+Mono:wght@400;700&display=swap');

        :root {
            --tdg-bg-color: #0b0c10;
            --tdg-primary-color: #1c2331;
            --tdg-secondary-color: #3b4252;
            --tdg-accent-color: #88c0d0;
            --tdg-highlight-color: #ebcb8b;
            --tdg-text-color: #eceff4;
            --tdg-success-color: #a3be8c;
            --tdg-error-color: #bf616a;
        }

        #tdg-manager-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 85%;
            max-width: 300px;
            max-height: 80vh;
            background-color: var(--tdg-primary-color);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.7);
            border: 2px solid var(--tdg-secondary-color);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            font-family: 'Roboto Mono', monospace;
            color: var(--tdg-text-color);
            cursor: grab;
            transition: box-shadow 0.2s ease, border-color 0.2s ease;
            overflow-y: auto;
        }
        #tdg-manager-panel:active {
            cursor: grabbing;
            box-shadow: 0 3px 18px rgba(0, 0, 0, 0.9);
            border-color: var(--tdg-accent-color);
        }

        #tdg-manager-panel h2 {
            font-family: 'Press Start 2P', cursive;
            color: var(--tdg-highlight-color);
            text-align: center;
            margin: 0 0 5px 0;
            font-size: 1em;
            text-shadow: 1px 1px var(--tdg-accent-color);
            user-select: none;
        }

        #tdg-manager-panel p.intro-text {
            font-size: 0.7em;
            color: var(--tdg-text-color);
            opacity: 0.9;
            margin-bottom: 10px;
            text-align: center;
            user-select: none;
        }

        #tdg-start-button {
            background-color: var(--tdg-accent-color);
            color: var(--tdg-bg-color);
            border: none;
            padding: 8px 15px;
            font-size: 0.9em;
            font-family: 'Press Start 2P', cursive;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 10px;
            box-shadow: 2px 2px 0px var(--tdg-secondary-color);
            text-shadow: 1px 1px var(--tdg-primary-color);
        }
        #tdg-start-button:hover {
            transform: translateY(-1px) translateX(-1px);
            box-shadow: 3px 3px 0px var(--tdg-secondary-color);
            background-color: #a3be8c;
        }
        #tdg-start-button:active {
            transform: translateY(0) translateX(0);
            box-shadow: 1px 1px 0px var(--tdg-secondary-color);
        }

        #tdg-loading-screen {
            text-align: center;
            padding: 15px 5px;
            background-color: var(--tdg-primary-color);
            border-radius: 6px;
            margin-top: 5px;
            opacity: 1;
            transition: opacity 0.5s ease;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--tdg-text-color);
        }

        #tdg-loading-text {
            font-family: 'Press Start 2P', cursive;
            color: var(--tdg-highlight-color);
            font-size: 0.8em;
            margin-bottom: 10px;
            text-shadow: 1px 1px var(--tdg-secondary-color);
        }

        .tdg-progress-bar-container {
            width: 70%;
            height: 10px;
            background-color: var(--tdg-secondary-color);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 10px;
            border: 1px solid var(--tdg-accent-color);
        }

        .tdg-progress-bar {
            height: 100%;
            width: 0%;
            background-color: var(--tdg-accent-color);
            border-radius: 3px;
            transition: width 0.5s ease-out;
        }

        #tdg-final-message {
            font-family: 'Press Start 2P', cursive;
            color: var(--tdg-success-color);
            font-size: 0.9em;
            margin-top: 10px;
            text-shadow: 1px 1px var(--tdg-primary-color);
            animation: tdgPulse 1.5s infinite;
        }

        @keyframes tdgPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }

        #tdg-account-list-container, #tdg-add-form-container {
            margin-top: 8px;
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
        }
        #tdg-account-list-container.visible, #tdg-add-form-container.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .tdg-section-title {
            color: var(--tdg-text-color);
            font-size: 0.8em;
            margin-bottom: 6px;
            border-bottom: 1px solid var(--tdg-secondary-color);
            padding-bottom: 3px;
            user-select: none;
            font-family: 'Press Start 2P', cursive;
            color: var(--tdg-highlight-color);
            text-shadow: 1px 1px var(--tdg-secondary-color);
        }

        .tdg-account-card, .tdg-add-form-content {
            background-color: var(--tdg-card-bg);
            border: 1px solid var(--tdg-secondary-color);
            border-radius: 6px;
            padding: 6px;
            margin-bottom: 6px;
            animation: tdgFadeIn 0.3s ease-out forwards;
        }
        .tdg-account-card:last-child {
            margin-bottom: 0;
        }

        .tdg-account-field {
            margin-bottom: 5px;
        }

        .tdg-account-field label {
            font-size: 0.6em;
            margin-bottom: 2px;
            color: var(--tdg-accent-color);
            display: block;
        }

        .tdg-input-group {
            display: flex;
            align-items: center;
        }

        .tdg-account-field input {
            flex-grow: 1;
            padding: 4px 6px;
            background-color: var(--tdg-secondary-color);
            border: 1px solid var(--tdg-secondary-color);
            border-radius: 3px;
            color: var(--tdg-text-color);
            font-family: 'Roboto Mono', monospace;
            font-size: 0.7em;
            outline: none;
            transition: border-color 0.2s ease;
        }
        .tdg-account-field input:focus {
            border-color: var(--tdg-accent-color);
        }

        .tdg-copy-btn, .tdg-toggle-password-btn, .tdg-add-btn {
            background: var(--tdg-accent-color);
            border: none;
            color: var(--tdg-bg-color);
            padding: 4px 6px;
            margin-left: 3px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            white-space: nowrap;
            font-size: 0.65em;
            box-shadow: 1px 1px 0px var(--tdg-secondary-color);
        }
        .tdg-copy-btn:hover, .tdg-toggle-password-btn:hover, .tdg-add-btn:hover {
            background: var(--tdg-highlight-color);
            transform: translateY(-1px) translateX(-1px);
        }
        .tdg-copy-btn:active, .tdg-toggle-password-btn:active, .tdg-add-btn:active {
            transform: translateY(0) translateX(0);
            box-shadow: 1px 1px 0px var(--tdg-secondary-color);
        }

        .tdg-add-btn {
            width: calc(100% - 12px);
            margin: 6px 6px 0 6px;
            padding: 6px;
            font-family: 'Press Start 2P', cursive;
        }

        .tdg-copy-feedback {
            color: var(--tdg-success-color);
            font-size: 0.6em;
            margin-left: 3px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s ease;
            white-space: nowrap;
        }
    `);

    // Create the main panel
    const managerPanel = document.createElement('div');
    managerPanel.id = 'tdg-manager-panel';
    document.body.appendChild(managerPanel);

    // Initial HTML content of the panel
    managerPanel.innerHTML = `
        <h2>Drawaria Hacker Accounts</h2>
        <p class="intro-text">Ready to start hacking!</p>
        <button id="tdg-start-button">Start Hacker!</button>

        <div id="tdg-loading-screen">
            <div id="tdg-loading-text">Starting protocol...</div>
            <div class="tdg-progress-bar-container">
                <div class="tdg-progress-bar" id="tdg-progress-bar"></div>
            </div>
            <div id="tdg-final-message" style="display: none;">YOUR ACCOUNT IS HERE</div>
        </div>

        <div id="tdg-account-list-container">
            <div class="tdg-section-title">Free Accounts</div>
            <div id="tdg-account-list-content"></div>
        </div>

        <div id="tdg-add-form-container">
            <div class="tdg-section-title" style="margin-top: 15px;">Add Hacked Accounts</div>
            <div class="tdg-add-form-content">
                <div class="tdg-account-field">
                    <label for="tdg-new-email">Email:</label>
                    <input type="email" id="tdg-new-email" placeholder="agent@secret.com">
                </div>
                <div class="tdg-account-field">
                    <label for="tdg-new-password">Password:</label>
                    <input type="password" id="tdg-new-password" placeholder="your ultra-secret password">
                </div>
                <button class="tdg-add-btn" id="tdg-add-account-btn">Enter!</button>
            </div>
        </div>
    `;

    const startButton = document.getElementById('tdg-start-button');
    const loadingScreen = document.getElementById('tdg-loading-screen');
    const loadingText = document.getElementById('tdg-loading-text');
    const progressBar = document.getElementById('tdg-progress-bar');
    const finalMessage = document.getElementById('tdg-final-message');
    const accountListContainer = document.getElementById('tdg-account-list-container');
    const accountListContent = document.getElementById('tdg-account-list-content');
    const addFormContainer = document.getElementById('tdg-add-form-container');
    const newEmailInput = document.getElementById('tdg-new-email');
    const newPasswordInput = document.getElementById('tdg-new-password');
    const addAccountBtn = document.getElementById('tdg-add-account-btn');

    // Initially hide the account sections and add form
    loadingScreen.style.opacity = 0;
    loadingScreen.style.pointerEvents = 'none';
    accountListContainer.classList.remove('visible');
    addFormContainer.classList.remove('visible');

    // Rendering Functions
    function renderAccounts() {
        accountListContent.innerHTML = '';
        currentAccounts.forEach((account, index) => {
            const card = document.createElement('div');
            card.className = 'tdg-account-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="tdg-account-field">
                    <label>Email:</label>
                    <div class="tdg-input-group">
                        <input type="text" value="${account.email}" readonly>
                        <button class="tdg-copy-btn">Copy</button>
                        <span class="tdg-copy-feedback">Copied!</span>
                    </div>
                </div>
                <div class="tdg-account-field">
                    <label>Password:</label>
                    <div class="tdg-input-group">
                        <input type="password" value="${account.password}" readonly>
                        <button class="tdg-copy-btn">Copy</button>
                        <button class="tdg-toggle-password-btn">Show</button>
                        <span class="tdg-copy-feedback">Copied!</span>
                    </div>
                </div>
            `;
            accountListContent.appendChild(card);
        });
    }

    // Initialization Logic
    currentAccounts = loadAccounts();

    // Loading Simulation Logic
    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        document.querySelector('.intro-text').style.display = 'none';
        loadingScreen.style.opacity = 1;
        loadingScreen.style.pointerEvents = 'auto';

        let progress = 0;
        progressBar.style.width = '0%';
        loadingMessageIndex = 0;
        finalMessage.style.display = 'none';

        loadingInterval = setInterval(() => {
            loadingText.textContent = LOADING_MESSAGES[loadingMessageIndex];
            loadingMessageIndex = (loadingMessageIndex + 1) % LOADING_MESSAGES.length;

            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(loadingInterval);
                loadingText.textContent = LOADING_MESSAGES[LOADING_MESSAGES.length - 1];
                progressBar.style.width = '100%';

                setTimeout(() => {
                    loadingScreen.style.opacity = 0;
                    loadingScreen.style.pointerEvents = 'none';
                    finalMessage.style.display = 'block';

                    setTimeout(() => {
                        finalMessage.style.display = 'none';
                        accountListContainer.classList.add('visible');
                        addFormContainer.classList.add('visible');
                        renderAccounts();
                    }, 1000);
                }, 800);
            }
        }, 300);
    });

    // Logic to Add Account
    addAccountBtn.addEventListener('click', function() {
        const email = newEmailInput.value.trim();
        const password = newPasswordInput.value.trim();

        if (email && password) {
            addAccount(email, password);
            newEmailInput.value = '';
            newPasswordInput.value = '';
        } else {
            alert('ERROR! Mission incomplete: You need email and password!');
        }
    });

    // Logic to Copy and Show/Hide Password
    managerPanel.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('tdg-copy-btn')) {
            const button = e.target;
            const inputGroup = button.parentElement;
            const input = inputGroup.querySelector('input');
            const feedback = inputGroup.querySelector('.tdg-copy-feedback');

            navigator.clipboard.writeText(input.value).then(() => {
                feedback.style.opacity = '1';
                setTimeout(() => {
                    feedback.style.opacity = '0';
                }, 2000);
            }).catch(err => {
                console.error('Error copying: ', err);
                alert('SYSTEM ERROR! Could not copy. Permissions denied.');
            });
        }

        if (e.target && e.target.classList.contains('tdg-toggle-password-btn')) {
            const button = e.target;
            const inputGroup = button.parentElement;
            const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                button.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                button.textContent = 'Show';
            }
        }
    });

    // Panel Drag Logic
    let isDragging = false;
    let offsetX, offsetY;

    managerPanel.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('tdg-section-title') || e.target.classList.contains('tdg-account-field') || e.target.classList.contains('tdg-input-group') || e.target.classList.contains('tdg-account-card') || e.target.classList.contains('tdg-add-form-content')) {
            return;
        }

        isDragging = true;
        managerPanel.style.cursor = 'grabbing';
        offsetX = e.clientX - managerPanel.getBoundingClientRect().left;
        offsetY = e.clientY - managerPanel.getBoundingClientRect().top;

        managerPanel.style.position = 'fixed';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - managerPanel.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - managerPanel.offsetHeight));

        managerPanel.style.left = newLeft + 'px';
        managerPanel.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            managerPanel.style.cursor = 'grab';
        }
    });

    // Position the panel when the page loads
    function setInitialPanelPosition() {
        const lastPosition = JSON.parse(localStorage.getItem('tdg_panel_position') || '{}');
        if (lastPosition.left !== undefined && lastPosition.top !== undefined) {
            managerPanel.style.left = lastPosition.left + 'px';
            managerPanel.style.top = lastPosition.top + 'px';
        } else {
            const initialRight = 20;
            const initialBottom = 20;
            managerPanel.style.left = (window.innerWidth - managerPanel.offsetWidth - initialRight) + 'px';
            managerPanel.style.top = (window.innerHeight - managerPanel.offsetHeight - initialBottom) + 'px';
        }
    }

    managerPanel.addEventListener('mouseup', function() {
        if (!isDragging) {
            const rect = managerPanel.getBoundingClientRect();
            localStorage.setItem('tdg_panel_position', JSON.stringify({ left: rect.left, top: rect.top }));
        }
    });
    window.addEventListener('beforeunload', function() {
        const rect = managerPanel.getBoundingClientRect();
        localStorage.setItem('tdg_panel_position', JSON.stringify({ left: rect.left, top: rect.top }));
    });

    document.fonts.ready.then(() => {
        setInitialPanelPosition();
    });
    window.addEventListener('resize', setInitialPanelPosition);
})();
