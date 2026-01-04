// ==UserScript==
// @name         TTRS Auto Answer Bot 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto answers TTRS questions with speed control and toggle menu
// @match        https://play.ttrockstars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546698/TTRS%20Auto%20Answer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/546698/TTRS%20Auto%20Answer%20Bot.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- UI Setup ---
 
    // Create overlay panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.background = 'rgba(0,0,0,0.8)';
    panel.style.color = 'white';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.fontFamily = 'monospace';
    panel.style.zIndex = '999999';
    panel.style.width = '180px';
    panel.style.userSelect = 'none';
    panel.style.cursor = 'move';
 
    // Dragging support
    let isDragging = false, dragOffsetX, dragOffsetY;
    panel.addEventListener('mousedown', e => {
        isDragging = true;
        dragOffsetX = e.clientX - panel.getBoundingClientRect().left;
        dragOffsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = 'move';
    });
    window.addEventListener('mousemove', e => {
        if (isDragging) {
            panel.style.top = `${e.clientY - dragOffsetY}px`;
            panel.style.right = 'auto';
            panel.style.left = `${e.clientX - dragOffsetX}px`;
        }
    });
 
    // Title
    const title = document.createElement('div');
    title.textContent = 'TTRS Bot Menu';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    panel.appendChild(title);
 
    // Status display
    const status = document.createElement('div');
    status.textContent = 'Status: OFF';
    status.style.marginBottom = '8px';
    panel.appendChild(status);
 
    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Start Bot';
    toggleBtn.style.width = '100%';
    toggleBtn.style.marginBottom = '8px';
    panel.appendChild(toggleBtn);
 
    // Speed label and input
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Speed (ms): ';
    speedLabel.style.display = 'block';
    speedLabel.style.marginBottom = '4px';
    panel.appendChild(speedLabel);
 
    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.min = '50';
    speedInput.max = '2000';
    speedInput.value = '150';
    speedInput.style.width = '100%';
    panel.appendChild(speedInput);
 
    document.body.appendChild(panel);
 
    // --- Bot Logic ---
 
    let botRunning = false;
    let intervalId = null;
    let intervalMs = parseInt(speedInput.value);
 
    function getQuestion() {
        const leftElem = document.querySelector('span[data-qa-left]');
        const opElem = document.querySelector('span[data-qa-operator]');
        const rightElem = document.querySelector('span[data-qa-right]');
 
        if (!leftElem || !opElem || !rightElem) return null;
 
        let left = leftElem.textContent.trim();
        let op = opElem.textContent.trim();
        let right = rightElem.textContent.trim();
 
        if (op === '×') op = '*';
        else if (op === '÷') op = '/';
 
        return `${left} ${op} ${right}`;
    }
 
    function clickNumberKeys(numberStr) {
        for (const char of numberStr) {
            if (char === '-') {
                console.warn("Negative answer detected, no minus key.");
                continue;
            }
            const key = document.querySelector(`div[aria-label="${char}"]`);
            if (key) {
                key.click();
            } else {
                console.warn(`Key for character "${char}" not found.`);
            }
        }
    }
 
    function clickEnter() {
        const enterKey = document.querySelector('div.key-ent');
        if (enterKey) enterKey.click();
        else console.warn("Enter key not found.");
    }
 
    function clearInput() {
        const deleteKey = document.querySelector('div.keyboard-del');
        if (deleteKey) {
            for (let i = 0; i < 5; i++) deleteKey.click();
        }
    }
 
    function botTick() {
        const question = getQuestion();
        if (!question) return;
 
        try {
            const answer = eval(question);
            if (answer === null || answer === undefined) return;
 
            clearInput();
            clickNumberKeys(String(answer));
            clickEnter();
 
            status.textContent = `Status: Running | Last answer: ${answer}`;
        } catch (e) {
            console.error("Error evaluating question:", e);
            status.textContent = "Status: Error evaluating question";
        }
    }
 
    function startBot() {
        if (botRunning) return;
        botRunning = true;
        status.textContent = "Status: Running";
        toggleBtn.textContent = "Stop Bot";
        intervalMs = parseInt(speedInput.value) || 150;
        intervalId = setInterval(botTick, intervalMs);
    }
 
    function stopBot() {
        if (!botRunning) return;
        botRunning = false;
        status.textContent = "Status: OFF";
        toggleBtn.textContent = "Start Bot";
        clearInterval(intervalId);
        intervalId = null;
    }
 
    toggleBtn.addEventListener('click', () => {
        if (botRunning) stopBot();
        else startBot();
    });
 
    speedInput.addEventListener('change', () => {
        if (botRunning) {
            stopBot();
            startBot();
        }
    });
 
})();