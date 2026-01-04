// ==UserScript==
// @name         Magnific.ai Batch Image Generator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automates batch image generation on Magnific.ai with a sleek, toggleable popup.
// @author       virtualdmns
// @match        https://magnific.ai/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533893/Magnificai%20Batch%20Image%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/533893/Magnificai%20Batch%20Image%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Create the toggle button
    const toggleButton = document.createElement('div');
    toggleButton.id = 'tm-batch-toggle';
    toggleButton.style = `
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: #444;
        color: #fff;
        padding: 10px;
        cursor: pointer;
        z-index: 10000;
        border-radius: 5px 0 0 5px;
    `;
    toggleButton.textContent = 'Batch';
    document.body.appendChild(toggleButton);

    // Create the popup (hidden by default)
    const popup = document.createElement('div');
    popup.id = 'tm-batch-popup';
    popup.style = `
        position: fixed;
        right: 0;
        top: 0;
        width: 250px;
        height: 100%;
        background: #222;
        color: #fff;
        padding: 20px;
        box-shadow: -2px 0 5px rgba(0,0,0,0.5);
        z-index: 9999;
        display: none;
    `;
    popup.innerHTML = `
        <div style="text-align: right; margin-bottom: 10px;">
            <button id="tm-batch-close" style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <h3 style="margin: 0;">Batch Image Generator</h3>
        <textarea id="tm-batch-prompts" rows="10" style="width: 100%; background: #333; color: #fff; border: 1px solid #444; margin-top: 10px;"></textarea>
        <button id="tm-batch-start" style="background: #444; color: #fff; border: none; padding: 10px 20px; cursor: pointer; margin-top: 10px;">Start Generation</button>
        <div id="tm-batch-status" style="margin-top: 10px;">Status: Idle</div>
    `;
    document.body.appendChild(popup);

    // Toggle the popup with the button
    toggleButton.addEventListener('click', () => {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });

    // Close the popup with the × button
    document.getElementById('tm-batch-close').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Get popup elements
    const promptsTextarea = document.getElementById('tm-batch-prompts');
    const startButton = document.getElementById('tm-batch-start');
    const statusDiv = document.getElementById('tm-batch-status');

    // Start button logic (unchanged, still spot on!)
    startButton.addEventListener('click', async () => {
        const siteTextarea = document.getElementById('text_paragraphMystic');
        const generateButton = document.getElementById('mystic-btn');

        if (!siteTextarea || !generateButton) {
            statusDiv.textContent = 'Error: Site elements not found.';
            return;
        }

        const prompts = promptsTextarea.value.split('\n').map(p => p.trim()).filter(p => p);
        if (prompts.length === 0) {
            statusDiv.textContent = 'Please enter some prompts.';
            return;
        }

        startButton.disabled = true;
        statusDiv.textContent = 'Processing...';

        for (let i = 0; i < prompts.length; i++) {
            const prompt = prompts[i];
            statusDiv.textContent = `Processing prompt ${i + 1} of ${prompts.length}`;
            siteTextarea.value = prompt;
            generateButton.click();
            await delay(1000);
        }

        statusDiv.textContent = 'Done';
        startButton.disabled = false;
    });
})();