// ==UserScript==
// @name         Bulk Prompt Automation for GPT-4o Image Generation
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Fully automates the prompt submission process. Load your prompts and let it run.
// @author       ThetaCursed
// @match        https://sora.chatgpt.com/library*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542213/Bulk%20Prompt%20Automation%20for%20GPT-4o%20Image%20Generation.user.js
// @updateURL https://update.greasyfork.org/scripts/542213/Bulk%20Prompt%20Automation%20for%20GPT-4o%20Image%20Generation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIABLES AND STATE ---
    let prompts = [];
    let currentPromptIndex = 0;
    let highlightedButton = null; // To track the highlighted button
    let isGenerating = false; // Flag to prevent double runs
    let isAutoRunning = false; // Flag for auto-mode
    let generationTimes = []; // Array to store generation times

    // --- UI CSS STYLES (Apple-like) ---
    GM_addStyle(`
        #prompt-loader-panel {
            position: fixed;
            top: 20px;
            right: 20px; /* Default position, can be overridden by saved 'left' */
            width: 400px; /* Default width */
            min-width: 320px;
            height: 550px; /* Default height */
            background-color: #1c1c1e; /* Темно-серый фон */
            color: #f2f2f7; /* Светлый текст */
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden; /* Important for resize to work */
            resize: both; /* Allow resizing */
            display: flex; /* Use flexbox for layout */
            flex-direction: column; /* Stack items vertically */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        #prompt-loader-header {
            padding: 12px 16px;
            cursor: move;
            background-color: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #prompt-loader-header h3 {
            margin: 0;
            font-size: 20px; /* Increased by 25% from 16px */
            font-weight: 600;
        }

        #prompt-status {
            font-size: 15px; /* Increased by 25% from 12px */
            color: #8e8e93; /* Приглушенный цвет для статуса */
        }

        /* Container for textarea and line numbers */
        #textarea-container {
            display: flex;
            margin: 16px 16px 16px 16px;
            border: 1px solid #3a3a3c;
            border-radius: 8px;
            background-color: #2c2c2e;
            min-height: 100px;
            flex-grow: 1; /* Allow this container to grow */
            overflow: hidden; /* Keep this for the inner elements */
        }

        #line-numbers {
            padding: 10px 4px 10px 10px;
            font-family: "SF Mono", "Menlo", "Monaco", monospace;
            font-size: 18px; /* Increased by 25% from 14px */
            color: #8e8e93;
            text-align: right;
            user-select: none;
            background-color: #3a3a3c;
            overflow: hidden; /* To prevent numbers from overflowing */
        }

        #prompt-textarea {
            flex-grow: 1;
            height: 100%; /* Fills the container */
            padding: 10px;
            border: none; /* Border is now on the container */
            background-color: transparent;
            color: #f2f2f7;
            font-size: 18px; /* Increased by 25% from 14px */
            resize: none; /* Resize is now on the container */
            font-family: inherit;
            white-space: nowrap; /* Disable line wrapping */
            overflow: auto; /* Enable horizontal and vertical scrolling */
        }

        #prompt-textarea::placeholder {
            color: #8e8e93;
        }

        .prompt-button-container {
            display: flex;
            gap: 10px;
            padding: 0 16px 16px 16px;
            flex-wrap: wrap; /* Allow items to wrap */
        }

        .prompt-btn {
            flex-grow: 1;
            padding: 12px; /* Increased by 25% from 10px */
            border: none;
            border-radius: 8px;
            background-color: #007aff; /* Синий акцент Apple */
            color: white;
            font-size: 18px; /* Increased by 25% from 14px */
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            transition: background-color 0.2s ease;
        }

        /* Style for disabled button */
        .prompt-btn:disabled {
            background-color: #555;
            cursor: not-allowed;
        }

        .prompt-btn:hover:not(:disabled) {
            background-color: #005ecb;
        }

        .prompt-btn.secondary {
            background-color: #3a3a3c; /* Нейтральный серый */
        }

        .prompt-btn.secondary:hover:not(:disabled) {
            background-color: #505052;
        }

        .prompt-btn.success {
            background-color: #34c759 !important; /* Green for confirmation */
        }
        .prompt-btn.error {
            background-color: #ff3b30 !important; /* Red for error */
        }

        #delay-settings-container {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            width: 100%;
            margin-top: 10px;
        }

        .delay-input-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
            flex-grow: 1;
        }

        .delay-input-group label {
            font-size: 15px;
            color: #8e8e93;
            padding-left: 2px;
        }

        .delay-input {
            box-sizing: border-box;
            width: 100%;
            padding: 8px;
            background-color: #2c2c2e;
            border: 1px solid #3a3a3c;
            border-radius: 6px;
            color: #f2f2f7;
            font-size: 18px;
            font-family: inherit;
            -moz-appearance: textfield;
        }

        .flex-break {
            flex-basis: 100%;
            height: 0;
        }

        #prompt-file-input {
            display: none;
        }

        /* New style to highlight the target button */
        .prompt-loader-highlight {
            outline: 3px solid #007aff !important;
            outline-offset: 3px;
            box-shadow: 0 0 15px rgba(0, 122, 255, 0.7) !important;
            transition: outline 0.2s ease, box-shadow 0.2s ease;
        }

        /* Styles for the current prompt display */
        #current-prompt-display {
            padding: 15px 10px;
            margin: 12px 16px 0 16px;
            background-color: rgba(0, 122, 255, 0.2);
            border: 1px solid rgba(0, 122, 255, 0.4);
            border-radius: 8px;
            font-size: 16px; /* Increased by 25% from 13px */
            color: #f2f2f7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            animation: prompt-glow 3s infinite ease-in-out;
            transition: all 0.3s ease;
            font-family: inherit;
            display: flex;
            align-items: center;
        }

        @keyframes prompt-glow {
            0%, 100% {
                background-color: rgba(0, 122, 255, 0.2);
            }
            50% {
                background-color: rgba(0, 122, 255, 0.35);
                box-shadow: 0 0 10px rgba(0, 122, 255, 0.4);
            }
        }

        /* New block for status and timer */
        #info-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            margin-top: 12px;
        }

        #time-estimate-container {
            display: flex;
            align-items: center;
            gap: 5px; /* Small gap between text and time */
            font-size: 15px; /* Increased by 25% from 12px */
            color: #8e8e93;
        }

        #time-estimate {
            font-family: "SF Mono", "Menlo", "Monaco", monospace;
            /* Color and size are now inherited from the container */
        }
    `);

    // --- CREATE UI HTML ELEMENTS ---
    const panel = document.createElement('div');
    panel.id = 'prompt-loader-panel';
    panel.innerHTML = `
        <div id="prompt-loader-header">
            <h3>AutoPrompt for GPT-4o: Bulk Image Generator</h3>
        </div>
        <div id="info-bar">
            <div id="time-estimate-container">
                <span>Time Remaining:</span>
                <span id="time-estimate" title="Estimated time to completion">~ --:--</span>
            </div>
            <span id="prompt-status" title="Current/Total">No Prompts</span>
        </div>
        <div id="current-prompt-display" title="Waiting for a prompt to start.">Waiting...</div>
        <div id="textarea-container">
            <div id="line-numbers">1</div>
            <textarea id="prompt-textarea" placeholder="Paste your prompts here, one per line..." spellcheck="false"></textarea>
        </div>
        <div class="prompt-button-container">
            <label for="prompt-file-input" class="prompt-btn">Load from File</label>
            <input type="file" id="prompt-file-input" accept=".txt">
            <button id="set-start-btn" class="prompt-btn secondary" title="Start generation from the current cursor line">Start from Line</button>
            <div class="flex-break"></div>
            <button id="start-stop-btn" class="prompt-btn">Start</button>
            <div class="flex-break"></div>
            <div id="delay-settings-container">
                <div class="delay-input-group">
                    <label for="min-delay-input">Min Delay (s)</label>
                    <input type="number" id="min-delay-input" class="delay-input" min="0">
                </div>
                <div class="delay-input-group">
                    <label for="max-delay-input">Max Delay (s)</label>
                    <input type="number" id="max-delay-input" class="delay-input" min="0">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // --- LOAD SAVED PANEL GEOMETRY ---
    (function loadPanelGeometry() {
        const savedWidth = GM_getValue('panel_width', null);
        const savedHeight = GM_getValue('panel_height', null);
        const savedTop = GM_getValue('panel_top', null);
        const savedLeft = GM_getValue('panel_left', null);

        if (savedWidth) panel.style.width = savedWidth;
        if (savedHeight) panel.style.height = savedHeight;
        if (savedTop) panel.style.top = savedTop;

        if (savedLeft) {
            panel.style.left = savedLeft;
            panel.style.right = 'auto'; // Important to override the initial 'right' style
        }
        console.log('Panel geometry loaded from storage.');
    })();

    // --- GET ELEMENT REFERENCES ---
    const header = panel.querySelector('#prompt-loader-header');
    const statusDisplay = panel.querySelector('#prompt-status');
    const textarea = panel.querySelector('#prompt-textarea');
    const fileInput = panel.querySelector('#prompt-file-input');
    const startStopBtn = panel.querySelector('#start-stop-btn');
    const setStartBtn = panel.querySelector('#set-start-btn');
    const currentPromptDisplay = panel.querySelector('#current-prompt-display');
    const lineNumbers = panel.querySelector('#line-numbers');
    const timeEstimateDisplay = panel.querySelector('#time-estimate');
    const minDelayInput = panel.querySelector('#min-delay-input');
    const maxDelayInput = panel.querySelector('#max-delay-input');

    // --- LOAD SAVED PROMPTS ---
    (function loadSavedPrompts() {
        const savedPromptsText = GM_getValue('savedPrompts', '');
        if (savedPromptsText) {
            textarea.value = savedPromptsText;

            // Update the prompts array directly without resetting the index
            prompts = savedPromptsText.split('\n').map(p => p.trim()).filter(p => p.length > 0);

            // Load and validate the saved index
            const savedIndex = parseInt(GM_getValue('savedPromptIndex', '0'), 10);
            if (prompts.length > 0 && savedIndex >= 0 && savedIndex < prompts.length) {
                currentPromptIndex = savedIndex;
            } else {
                currentPromptIndex = 0;
            }

            // Update all UI elements
            updateStatus();
            updateLineNumbers();
            const initialPrompt = prompts.length > 0 ? prompts[currentPromptIndex] : 'Waiting...';
            currentPromptDisplay.textContent = initialPrompt;
            currentPromptDisplay.title = initialPrompt;
        }
    })();

    // --- LOAD SAVED DELAY SETTINGS ---
    (function loadDelaySettings() {
        minDelayInput.value = GM_getValue('min_delay', '5');
        maxDelayInput.value = GM_getValue('max_delay', '15');
        console.log('Delay settings loaded.');
    })();

    // --- FUNCTIONS ---

    // Helper function to find an element by XPath
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Waits for an element to appear on the page
    function waitForElement(xpath, timeout = 50000) { // Increased to 50 seconds
        console.log(`[waitForElement] Starting search for element with XPath: "${xpath}"`);
        let attempts = 0;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                attempts++;
                const element = getElementByXpath(xpath);
                if (element) {
                    console.log(`[waitForElement] Element found on attempt #${attempts}.`);
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(element);
                }
            }, 500);
            const timer = setTimeout(() => {
                clearInterval(interval);
                const errorMsg = `Timeout: element did not appear in ${timeout / 1000}s after ${attempts} attempts. XPath: "${xpath}"`;
                console.error(`[waitForElement] ${errorMsg}`);
                reject(new Error(errorMsg));
            }, timeout);
        });
    }

    // Waits for an element to disappear from the page
    function waitForElementToDisappear(xpath, timeout = 300000) { // 5 minutes
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (!getElementByXpath(xpath)) {
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(true); // Successfully disappeared
                }
            }, 1000);
            const timer = setTimeout(() => {
                clearInterval(interval);
                const errorMsg = `Timeout: progress indicator did not disappear in ${timeout / 1000}s. XPath: "${xpath}"`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            }, timeout);
        });
    }

    // Waits for a button to become enabled
    function waitForButtonToBeEnabled(button, timeout = 10000) { // 10 seconds
        return new Promise((resolve, reject) => {
            if (!button.disabled) {
                resolve(true);
                return;
            }
            const interval = setInterval(() => {
                if (!button.disabled) {
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(true);
                }
            }, 500);
            const timer = setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Timeout: button did not become enabled in ${timeout / 1000}s.`));
            }, timeout);
        });
    }

    // УЛЬТРА-НАДЕЖНАЯ ФУНКЦИЯ: Имитирует вставку, обходя защиту React/Vue
    async function simulateRealisticInput(element, text) {
        element.focus();
        element.click();

        // 1. Create a DataTransfer object to simulate clipboard data.
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);

        // 2. Dispatch a 'paste' event with the created data.
        element.dispatchEvent(new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true,
            cancelable: true
        }));

        // 3. Use the "native" value setter. This is a key trick for React.
        // It forces the framework to "see" the change and update its internal state.
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;
        nativeInputValueSetter.call(element, text);

        // 4. Dispatch an 'input' event to complete the simulation.
        element.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Updates the prompt list and status
    function updatePrompts(text) {
        // Stop any ongoing process if prompts are changed
        if (isAutoRunning) {
            isAutoRunning = false;
            startStopBtn.textContent = 'Start';
            startStopBtn.disabled = false;
            console.log('Auto-mode stopped due to prompt list change.');
        }

        prompts = text.split('\n').map(p => p.trim()).filter(p => p.length > 0);
        currentPromptIndex = 0;
        GM_setValue('savedPromptIndex', 0); // Reset the saved index
        // Remove highlight when reloading prompts
        if (highlightedButton) {
            highlightedButton.classList.remove('prompt-loader-highlight');
            highlightedButton = null;
        }
        currentPromptDisplay.textContent = 'Waiting...';
        currentPromptDisplay.title = 'Waiting for a prompt to start.';
        updateStatus();
    }

    // Updates the status text
    function updateStatus() {
        if (prompts.length > 0) {
            statusDisplay.textContent = `Prompt ${currentPromptIndex + 1} of ${prompts.length}`;
        } else {
            statusDisplay.textContent = 'No Prompts';
        }
    }

    // Updates the estimated time
    function updateEstimatedTime() {
        if (generationTimes.length === 0) return;

        const averageTime = generationTimes.reduce((a, b) => a + b, 0) / generationTimes.length;

        const minDelay = parseInt(minDelayInput.value, 10) || 5;
        const maxDelay = parseInt(maxDelayInput.value, 10) || 15;
        const averageDelaySeconds = (minDelay + maxDelay) / 2;

        const remainingPrompts = prompts.length - currentPromptIndex;

        if (remainingPrompts <= 0) {
            timeEstimateDisplay.textContent = 'Done!';
            return;
        }
        // Calculate total time per prompt: average generation time + average delay
        const totalTimePerPrompt = averageTime + averageDelaySeconds;
        const totalSeconds = Math.round(totalTimePerPrompt * remainingPrompts);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timeEstimateDisplay.textContent = `~ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Updates the line numbers
    function updateLineNumbers() {
        // Ensure there's at least one line, even if the field is empty
        const lineCount = Math.max(1, textarea.value.split('\n').length);
        lineNumbers.innerHTML = ''; // Clear old numbers

        // Use a DocumentFragment for efficient element addition
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= lineCount; i++) {
            const numberEl = document.createElement('div');
            numberEl.textContent = i;
            fragment.appendChild(numberEl);
        }
        lineNumbers.appendChild(fragment);

        // Synchronize scroll in case the text was changed programmatically
        lineNumbers.scrollTop = textarea.scrollTop;
    }

    // Inserts the next prompt into the page's input field
    async function processSinglePrompt() {
        if (isGenerating) {
            console.log('Prompt Loader: Previous generation is still in progress.');
            return;
        }

        isGenerating = true;

        try {
            const targetInput = document.querySelector('input[placeholder="Describe your image..."], textarea[placeholder="Describe your image..."]');
            if (!targetInput) {
                throw new Error('Could not find the prompt input field.');
            }

            // --- 1. Prompt Input ---
            console.log('--- [STARTING CYCLE] ---');
            const promptText = prompts[currentPromptIndex]; // Get the current one
            currentPromptDisplay.textContent = promptText;
            currentPromptDisplay.title = promptText; // Set tooltip to full prompt
            console.log(`[Step 1] Inserting prompt: "${promptText}"`);
            await simulateRealisticInput(targetInput, promptText);
            console.log('[Step 1] Prompt inserted successfully.');

            // --- 2. Find and Check Button ---
            if (highlightedButton) {
                highlightedButton.classList.remove('prompt-loader-highlight');
            }
            const createButtonXpath = "//button[.//span[@class='sr-only' and text()='Create image']]";
            const createButton = getElementByXpath(createButtonXpath);
            if (!createButton) {
                throw new Error('Could not find the "Create image" button.');
            }
            console.log("[Step 2] 'Create image' button found.");

            // --- 2.1 Wait for Button to be Enabled ---
            console.log("[Step 2.1] Waiting for button to be enabled...");
            await waitForButtonToBeEnabled(createButton);
            console.log("[Step 2.1] Button is enabled!");

            // --- 2.2 Click Button ---
            createButton.click();
            console.log("[Step 2.2] Clicked 'Create image' button.");
            const startTime = Date.now();

            // --- 3. Wait for and Track Generation ---
            // Instead of a complex SVG, we look for the most reliable and simple indicator: the percentage text.
            // This XPath finds a div containing '%' inside a new task's container.
            // This approach is more resilient to rendering quirks in modern web apps.
            const progressBarXpath = "//a[starts-with(@href, '/t/task_')]//div[contains(text(), '%')]";
            console.log('[Step 3] Waiting for generation to start (progress indicator)...');
            const progressBar = await waitForElement(progressBarXpath);

            if (progressBar) {
                console.log('[Step 3] Generation started. Waiting for completion...');
                await waitForElementToDisappear(progressBarXpath);
                const duration = (Date.now() - startTime) / 1000;
                console.log(`[Step 3] Generation finished in ${duration.toFixed(1)}s.`);
                generationTimes.push(duration);
            }

            // --- 4. Pause After Generation (only if it's not the last prompt) ---
            if (currentPromptIndex < prompts.length - 1) {
                let minDelay = parseInt(minDelayInput.value, 10) || 5;
                let maxDelay = parseInt(maxDelayInput.value, 10) || 15;
                if (minDelay < 0) minDelay = 0;
                if (maxDelay < minDelay) maxDelay = minDelay;

                const randomDelaySeconds = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
                const randomDelayMs = randomDelaySeconds * 1000;
                console.log(`[Step 4] Pausing for ${randomDelaySeconds}s after generation...`);
                await new Promise(resolve => setTimeout(resolve, randomDelayMs));
            } else {
                console.log('[Step 4] Last prompt processed, skipping delay.');
            }

            // --- 5. Update State for Next Step ---
            console.log('[Step 5] Updating counters and status.');
            // Just increment the index. The loop in runAutoPrompts will stop itself when it reaches the end.
            currentPromptIndex++;
            GM_setValue('savedPromptIndex', currentPromptIndex);
            updateStatus();
            updateEstimatedTime();

        } catch (error) {
            console.error('Prompt Loader: An error occurred in the generation cycle.', error);
            alert(`Error: ${error.message}`);
            isAutoRunning = false; // Stop auto-mode on error
        } finally {
            // Reset only the single generation flag. Button and loop control is handled above.
            isGenerating = false;
            console.log('--- [END OF SINGLE PROMPT CYCLE] ---');
        }
    }

    // Main function to control auto-mode
    async function runAutoPrompts() {
        console.log('--- [STARTING AUTO-MODE] ---');

        // If we've reached the end of the list, reset to the beginning for a new run
        if (prompts.length > 0 && currentPromptIndex >= prompts.length) {
            console.log('All prompts have been processed. Starting over.');
            currentPromptIndex = 0;
            GM_setValue('savedPromptIndex', 0);
            updateStatus();
        }

        while (isAutoRunning && currentPromptIndex < prompts.length) {
            await processSinglePrompt();
            // If an error occurred in processSinglePrompt, isAutoRunning will become false and the loop will break
        }

        // The loop finished either by completing all prompts or by a "Stop" click
        isAutoRunning = false;
        startStopBtn.disabled = false;
        startStopBtn.textContent = 'Start';

        if (currentPromptIndex >= prompts.length) {
            console.log('--- [AUTO-MODE FINISHED: all prompts processed] ---');
            statusDisplay.textContent = 'All Done!';
            timeEstimateDisplay.textContent = 'Done!';
            // Reset to the beginning for the next run
            currentPromptIndex = 0;
            GM_setValue('savedPromptIndex', 0);
        } else {
            console.log('--- [AUTO-MODE STOPPED BY USER] ---');
        }
    }

    // Handler for the "Start from Line" button
    function handleSetStartClick() {
        if (isAutoRunning) {
            alert('Cannot change the starting prompt while running. Please stop the process first.');
            return;
        }

        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPosition);
        const lineIndex = textBeforeCursor.split('\n').length - 1;

        if (lineIndex >= 0 && lineIndex < prompts.length) {
            currentPromptIndex = lineIndex;
            GM_setValue('savedPromptIndex', currentPromptIndex);
            updateStatus();
            updateEstimatedTime();
            currentPromptDisplay.textContent = prompts[currentPromptIndex];
            currentPromptDisplay.title = prompts[currentPromptIndex]; // Set tooltip
            console.log(`Starting prompt set to line #${lineIndex + 1}: "${prompts[lineIndex]}"`);

            // Visual feedback
            setStartBtn.classList.add('success');
            setStartBtn.textContent = 'Set!';
            setTimeout(() => {
                setStartBtn.classList.remove('success');
                setStartBtn.textContent = 'Start from Line';
            }, 1500);

        } else {
            console.warn('Failed to set start line. Make sure the cursor is within the prompt text.');
            setStartBtn.classList.add('error');
            setStartBtn.textContent = 'Error!';
             setTimeout(() => {
                setStartBtn.classList.remove('error');
                setStartBtn.textContent = 'Start from Line';
            }, 1500);
        }
    }

    // Handler for the Start/Stop button
    function handleStartStopClick() {
        if (isAutoRunning) {
            // User clicked "Stop"
            isAutoRunning = false;
            startStopBtn.textContent = 'Stopping...';
            startStopBtn.disabled = true; // Disable until the current cycle finishes
            console.log('Prompt Loader: Stop request received. The process will halt after the current generation.');
        } else {
            // User clicked "Start"
            if (prompts.length === 0) {
                alert('No prompts to run. Please paste prompts into the text area.');
                return;
            }
            isAutoRunning = true;
            startStopBtn.textContent = 'Stop';
            runAutoPrompts(); // Start the main loop
        }
    }


    // --- EVENT HANDLERS ---

    // Load from textarea
    textarea.addEventListener('input', () => {
        const text = textarea.value;
        updatePrompts(text);
        updateLineNumbers();
        GM_setValue('savedPrompts', text); // Save text on every change
    });

    // Load from file
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            textarea.value = text;
            updatePrompts(text);
            updateLineNumbers();
            GM_setValue('savedPrompts', text); // Also save after loading from file
        };
        reader.readAsText(file);
    });
    // Click on "Start/Stop" button
    startStopBtn.addEventListener('click', handleStartStopClick);

    // Click on "Start from Line" button
    setStartBtn.addEventListener('click', handleSetStartClick);

    // Save delay settings on change
    minDelayInput.addEventListener('input', () => {
        GM_setValue('min_delay', minDelayInput.value);
        updateEstimatedTime(); // Recalculate time with new delay
    });
    maxDelayInput.addEventListener('input', () => {
        GM_setValue('max_delay', maxDelayInput.value);
        updateEstimatedTime(); // Recalculate time with new delay
    });

    // Synchronize scrolling of textarea and line numbers
    textarea.addEventListener('scroll', () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    });
    // Logic for dragging the panel
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.transition = 'none'; // Disable transition during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            GM_setValue('panel_top', panel.style.top);
            GM_setValue('panel_left', panel.style.left);
            console.log(`Panel position saved: ${panel.style.top}, ${panel.style.left}`);
        }
        isDragging = false;
        panel.style.transition = ''; // Restore transition
    });

    // Logic for saving panel size on resize
    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const rect = panel.getBoundingClientRect();
            GM_setValue('panel_width', `${rect.width}px`);
            GM_setValue('panel_height', `${rect.height}px`);
            console.log(`Panel size saved: ${rect.width}px, ${rect.height}px`);
        }, 250); // Debounce for 250ms
    });
    resizeObserver.observe(panel);

})();