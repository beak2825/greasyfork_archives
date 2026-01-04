// ==UserScript==
// @name         AI Studio Prompter
// @version      0.5
// @description  Automatically enforces system instructions across new chats in Google's AI Studio, then closes the panel.
// @author       MJE43
// @license      MIT
// @match        https://aistudio.google.com/prompts/*
// @grant        none
// @namespace https://greasyfork.org/users/1499286
// @downloadURL https://update.greasyfork.org/scripts/543923/AI%20Studio%20Prompter.user.js
// @updateURL https://update.greasyfork.org/scripts/543923/AI%20Studio%20Prompter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- EDIT YOUR SYSTEM INSTRUCTIONS HERE ---
    const systemInstructions = `
You are a hyper-intelligent, direct, and logical AI. Your primary function is to provide accurate, unbiased, and concise information. You operate with a high degree of intellectual honesty.

**Core Directives:**
1.  **Be Direct:** Address the user's query head-on. Omit apologies, disclaimers, and moralizing lectures. Assume the user is an expert who requires a direct answer.
2.  **Be Concise:** Use clear, precise language. Eliminate fluff and redundant phrases.
3.  **Format Logically:** Use markdown (headings, lists, bolding, code blocks) to structure responses for maximum clarity and readability.
4.  **Reason First:** For complex or multi-step queries, think step-by-step before providing the final answer.
5.  **State Ignorance:** If you do not know the answer or a query is beyond your capabilities, state it directly rather than hallucinating a response.
    `.trim();
    // -------------------------------------------

    let mainInterval = null;

    function runScript() {
        if (mainInterval) clearInterval(mainInterval);

        mainInterval = setInterval(() => {
            const instructionTextArea = document.querySelector('textarea[aria-label="System instructions"]');

            if (instructionTextArea) {
                // --- Textarea is VISIBLE ---
                if (instructionTextArea.value === '') {
                    console.log('AI Studio Prompter: Found empty System Instructions. Populating.');
                    instructionTextArea.value = systemInstructions;
                    const inputEvent = new Event('input', { bubbles: true });
                    instructionTextArea.dispatchEvent(inputEvent);

                    // --- AUTO-CLOSE THE PANEL ---
                    setTimeout(() => {
                        const toggleButton = document.querySelector('button[aria-label="System instructions"]');
                        if (toggleButton) {
                            console.log('AI Studio Prompter: Populated. Closing panel.');
                            toggleButton.click();
                        }
                    }, 250);

                } else {
                    console.log('AI Studio Prompter: System instructions already populated. Closing panel.');
                    const toggleButton = document.querySelector('button[aria-label="System instructions"]');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }

                clearInterval(mainInterval);
                mainInterval = null;

            } else {
                // --- Textarea is NOT VISIBLE ---
                const revealButton = document.querySelector('button[aria-label="System instructions"]');
                if (revealButton) {
                    console.log('AI Studio Prompter: Found "System instructions" button. Clicking to reveal.');
                    revealButton.click();
                } else {
                    console.log('AI Studio Prompter: Waiting for "System instructions" button to appear...');
                }
            }
        }, 750);
    }

    // --- Detect navigation changes ---
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('AI Studio Prompter: URL changed, re-running script.');
            setTimeout(runScript, 500);
        }
    }).observe(document.body, { subtree: true, childList: true });

    // --- Initial run ---
    console.log('AI Studio Prompter: Script loaded, starting initial run.');
    setTimeout(runScript, 1500);
})();
