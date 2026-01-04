// ==UserScript==
// @name         JanitorAI Gemini Bypass with Prefill Support
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bypasses Gemini's filter and adds support for prefills, including a permanent option.
// @author       Gemini, mostly
// @license      MIT
// @match        https://janitorai.com/*
// @icon         https://janitorai.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546449/JanitorAI%20Gemini%20Bypass%20with%20Prefill%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/546449/JanitorAI%20Gemini%20Bypass%20with%20Prefill%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Key for communication between the userscript and the injected script ---
    const STORAGE_KEY = 'jai_permanent_prefill';

    // --- Injected Code ---
    // This function contains the core logic. It will be converted to a string and injected into the page.
    function injectedScript() {
        // The target URL suffix for any OpenAI-compatible API request
        const targetSuffix = '/chat/completions';

        // Store the original fetch function
        const originalFetch = window.fetch;

        // Function to extract prefill text from the last user message
        function extractPrefillFromLastUserMessage(messages) {
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === 'user') {
                    const content = messages[i].content;
                    // Changed regex to use [ and ] as delimiters.
                    const prefillMatch = content.match(/PREFILL=\[(.*?)\]/);
                    if (prefillMatch) {
                        return prefillMatch[1]; // Return the text inside the brackets
                    }
                    break; // Stop at the first (last) user message found
                }
            }
            return null; // No prefill found
        }

        // Function to remove all PREFILL directives from all user messages
        function removePrefillDirectives(messages) {
            messages.forEach(message => {
                if (message.role === 'user' && typeof message.content === 'string') {
                    // Changed regex to match the new [ and ] format.
                    message.content = message.content.replace(/PREFILL=\[.*?\]/g, '').trim();
                }
            });
        }

        // Override the window.fetch function
        window.fetch = function(url, options) {
            if (typeof url === 'string' && url.endsWith(targetSuffix)) {
                if (options && options.body && typeof options.body === 'string') {
                    try {
                        const body = JSON.parse(options.body);

                        // --- GEMINI BYPASS LOGIC ---
                        if (body.model && body.model.toLowerCase().includes('gemini') &&
                            body.messages && body.messages.length > 0 && body.messages[0].role === 'system') {
                            console.log(`[JAI Script] Intercepted Gemini request to: ${url}`);
                            console.log('[JAI Script] Modifying system prompt to "user" role.');
                            body.messages[0].role = 'user';
                        }

                        // --- PREFILL LOGIC ---
                        let finalPrefill = null;
                        let prefillSource = '';

                        // 1. Check for prefill in the message (highest priority)
                        const messagePrefill = extractPrefillFromLastUserMessage(body.messages);

                        // 2. Read the permanent prefill from localStorage (the bridge from our main script)
                        const permanentPrefill = localStorage.getItem('jai_permanent_prefill') || '';

                        if (messagePrefill !== null) {
                            finalPrefill = messagePrefill;
                            prefillSource = 'message';
                        }
                        // 3. If no message prefill, use the permanent prefill (if it exists)
                        else if (permanentPrefill && permanentPrefill.trim() !== '') {
                            finalPrefill = permanentPrefill;
                            prefillSource = 'permanent setting';
                        }

                        // Always remove the PREFILL directive from the user message
                        removePrefillDirectives(body.messages);

                        // Add a new message with role "assistant" if any prefill was determined
                        if (finalPrefill !== null) {
                            const customAssistantMessage = {
                                content: finalPrefill,
                                role: "assistant"
                            };
                            body.messages.push(customAssistantMessage);
                            console.log(`[JAI Script] Added assistant message using ${prefillSource} prefill:`, customAssistantMessage);
                        }

                        // Stringify the modified body and update the options
                        options.body = JSON.stringify(body);

                    } catch (e) {
                        console.error('[JAI Script] Error parsing request body:', e);
                    }
                }
            }
            // Call the original fetch with the original or modified arguments
            return originalFetch.apply(this, arguments);
        };
        console.log('[JAI Script] Gemini bypass with permanent prefill support started (injected).');
    }

    // --- Main Userscript Logic (Sandboxed) ---

    // Function to inject the script into the page's context
    function inject() {
        // Prevent double-injection
        if (document.getElementById('jai-bypass-script')) {
            return;
        }
        const script = document.createElement('script');
        script.id = 'jai-bypass-script'; // Add an ID to check against
        script.textContent = `(${injectedScript.toString()})();`; // Wrap and call the function
        (document.head || document.documentElement).appendChild(script);
        script.remove(); // Clean up the DOM after injection
    }

    // This function sets up the Violentmonkey menu and communication bridge.
    async function setupMenuAndBridge() {
        // Load the saved permanent prefill from GM storage and sync it to localStorage for the injected script.
        const savedPrefill = await GM_getValue(STORAGE_KEY, '');
        if (savedPrefill) {
             localStorage.setItem(STORAGE_KEY, savedPrefill);
        }

        // Register a menu command to set or update the permanent prefill.
        GM_registerMenuCommand('Set Permanent Prefill', async () => {
            const currentPrefill = await GM_getValue(STORAGE_KEY, '');
            const newPrefill = prompt('Enter the permanent prefill text:', currentPrefill);

            if (newPrefill !== null) {
                await GM_setValue(STORAGE_KEY, newPrefill); // Save to persistent GM storage
                localStorage.setItem(STORAGE_KEY, newPrefill); // Update localStorage for the injected script
                alert(`Permanent prefill has been set to:\n"${newPrefill}"`);
            }
        });

        // Register a menu command to clear the permanent prefill.
        GM_registerMenuCommand('Clear Permanent Prefill', async () => {
            await GM_setValue(STORAGE_KEY, ''); // Clear persistent GM storage
            localStorage.removeItem(STORAGE_KEY); // Clear localStorage for the injected script
            alert('Permanent prefill has been cleared.');
        });
    }

    // Run the setup and inject the script.
    setupMenuAndBridge();
    inject();

})();