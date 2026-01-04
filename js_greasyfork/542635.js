// ==UserScript==
// @name        WME UR AutoReply with ChatGPT (SDK-compliant)
// @namespace   https://www.waze.com/editor/sdk
// @version     0.7 // Increased version for this change
// @description Auto-generate Waze UR replies using ChatGPT API and WME SDK
// @author      You
// @match       https://www.waze.com/*editor*
// @match       https://beta.waze.com/*editor*
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @connect     api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/542635/WME%20UR%20AutoReply%20with%20ChatGPT%20%28SDK-compliant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542635/WME%20UR%20AutoReply%20with%20ChatGPT%20%28SDK-compliant%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- DEBUGGING: Confirm script file is loaded by Tampermonkey ---
    console.log('AI AutoReply: Script file started loading.');

    // === CONFIGURATION ===
    const API_KEY = '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';
    const GPT_MODEL = 'gpt-4';

    // === Wait for WME SDK using SDK_INITIALIZED promise ===
    if (typeof unsafeWindow.SDK_INITIALIZED !== 'undefined') {
        console.log('AI AutoReply: Found SDK_INITIALIZED promise. Waiting for SDK to be ready...');
        unsafeWindow.SDK_INITIALIZED.then(initScript).catch(error => {
            console.error('AI AutoReply: WME SDK_INITIALIZED promise rejected:', error);
            console.warn('AI AutoReply: Falling back to legacy WME wait method due to SDK_INITIALIZED promise rejection.');
            setTimeout(legacyWaitForWME, 500);
        });
    } else {
        console.warn('AI AutoReply: unsafeWindow.SDK_INITIALIZED not found. Falling back to legacy WME wait method.');
        setTimeout(legacyWaitForWME, 500);
    }

    // Fallback/Legacy wait for WME in case SDK_INITIALIZED isn't ready
    function legacyWaitForWME() {
        if (typeof unsafeWindow.W === 'undefined' || typeof unsafeWindow.W.selectionManager === 'undefined') {
            console.log('AI AutoReply: Legacy wait - WME not ready yet. Retrying...');
            setTimeout(legacyWaitForWME, 500);
        } else {
            console.log('AI AutoReply: Legacy wait - WME SDK detected as ready.');
            initScript();
        }
    }

    // === Initialize Script ===
    function initScript() {
        console.log('AI AutoReply: initScript called. WME SDK should be ready.');
        // --- NEW: Attempt to insert the top panel button immediately ---
        insertTopPanelAIButton();

        // Continue with UR panel specific logic
        checkAndInsertButton(); // Initial check for UR panel button
        observePanelChanges(); // Start observing for UR panel
    }

    // --- NEW: Insert AI Button into the Top Panel (as a tab) ---
    function insertTopPanelAIButton() {
        // Target the <ul> element that contains the existing user script tabs
        const userTabsUl = document.querySelector("#user-tabs > ul");

        if (userTabsUl && !document.getElementById('ai-top-panel-btn')) {
            // Create a new <li> element for our tab
            const newLi = document.createElement('li');
            newLi.id = 'ai-top-panel-li'; // Give the li a unique ID

            // Create the <a> element that acts as the button/tab
            const newA = document.createElement('a');
            newA.id = 'ai-top-panel-btn'; // ID for the clickable part
            newA.textContent = 'AI Reply'; // Display text for the tab
            newA.setAttribute('data-toggle', 'tab'); // Mimic existing tab behavior
            newA.href = '#userscript-tab-ai-reply'; // A dummy href, actual functionality is via onclick
            newA.title = 'AI AutoReply (Top Panel)'; // Tooltip for the tab

            // Add an optional icon (example, you can change fa-magic to something else)
            const iconSpan = document.createElement('span');
            iconSpan.classList.add('fa', 'fa-magic'); // Using Font Awesome icon
            iconSpan.style.marginRight = '5px';
            newA.prepend(iconSpan); // Add icon before text

            newA.onclick = () => {
                alert('Top AI Button clicked! Script is running.');
                console.log('AI AutoReply: Top AI Button was clicked.');
                // You could add more functionality here, like opening a specific panel
            };

            newLi.appendChild(newA); // Put the <a> inside the <li>
            userTabsUl.appendChild(newLi); // Append the new <li> to the <ul>

            console.log('AI AutoReply: Successfully inserted "AI Reply" button as a top panel tab.');
        } else if (userTabsUl) {
            console.log('AI AutoReply: Top AI Button already exists or container not found for re-insertion.');
        } else {
            console.warn('AI AutoReply: Could not find the #user-tabs > ul container for the "Top AI Button". This element might not exist or the selector is incorrect.');
        }
    }


    // === Observe DOM for UR Panel Activation ===
    function observePanelChanges() {
        console.log('AI AutoReply: Starting DOM observation for UR panel changes.');
        const observer = new MutationObserver(mutations => {
            let found = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (document.querySelector('textarea[data-testid="comment-textarea"]') ||
                        document.querySelector('[data-testid="update-request-conversation"]')) {
                        found = true;
                        console.log('AI AutoReply: Detected potential UR panel activation via MutationObserver.');
                        break;
                    }
                }
            }
            if (found) {
                checkAndInsertButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Helper to check for existing button and insert if not present
    function checkAndInsertButton() {
        const commentBox = document.querySelector('textarea[data-testid="comment-textarea"]');
        const buttonsArea = document.querySelector('[data-testid="update-request-conversation"]');

        if (commentBox && buttonsArea && !document.getElementById('gpt-autoreply-btn')) {
            console.log('AI AutoReply: Found UR panel elements. Inserting AI AutoReply button.');
            insertButton(buttonsArea);
        } else if (document.getElementById('gpt-autoreply-btn')) {
            console.log('AI AutoReply: UR panel button already exists or elements not found yet.');
        } else {
             console.log('AI AutoReply: UR panel elements not (yet) found for UR panel button insertion.');
        }
    }

    // === Insert AI Button (for UR panel) ===
    function insertButton(container) {
        const saveButton = container.querySelector('button[data-testid="comment-button"]');

        const btn = document.createElement('button');
        btn.id = 'gpt-autoreply-btn';
        btn.textContent = 'AI AutoReply';
        btn.classList.add('btn', 'btn-default');
        btn.style.marginLeft = '5px';
        btn.style.height = '32px';
        btn.onclick = generateReply;

        if (saveButton && saveButton.parentNode) {
            saveButton.parentNode.insertBefore(btn, saveButton.nextSibling);
            console.log('AI AutoReply: UR panel button inserted next to Save button.');
        } else {
            container.appendChild(btn);
            console.log('AI AutoReply: UR panel button appended to container.');
        }
    }

    // === Extract UR Text ===
    function getURText() {
        const urCommentElement = document.querySelector('[data-testid="conversation-message-text"]');
        if (urCommentElement) {
            console.log('AI AutoReply: Found UR comment element using [data-testid="conversation-message-text"].');
            return urCommentElement.textContent.trim();
        }

        const textarea = document.querySelector('textarea[data-testid="comment-textarea"]');
        console.warn('AI AutoReply: Could not find specific UR comment element (data-testid="conversation-message-text"). Falling back to comment-textarea, which might not be the user\'s original UR. Please inspect WME beta\'s DOM for the correct UR text selector.');
        return textarea ? textarea.value.trim() : '';
    }

    // === Insert GPT Reply ===
    function insertReply(reply) {
        const textarea = document.querySelector('textarea[data-testid="comment-textarea"]');
        if (textarea) {
            textarea.value = reply;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('AI AutoReply: GPT reply inserted into textarea.');
        } else {
            console.error('AI AutoReply: Could not find reply textarea to insert GPT reply.');
        }
    }

    // === Generate GPT Reply ===
    function generateReply() {
        console.log('AI AutoReply: AI AutoReply button clicked. Attempting to generate reply.');
        const urText = getURText();
        if (!urText) {
            alert('Could not find the UR comment to generate a reply. Please ensure a UR is open and visible.');
            console.error('AI AutoReply: No UR text found to generate reply.');
            return;
        }
        console.log('AI AutoReply: UR Text extracted:', urText);

        const btn = document.getElementById('gpt-autoreply-btn');
        if (btn) {
            btn.textContent = 'Generating...';
            btn.disabled = true;
            console.log('AI AutoReply: UR panel button disabled, text changed to "Generating...".');
        }

        const prompt = `You are a helpful Waze map editor. A user submitted the following UR (Update Request): "${urText}". Generate a polite, professional reply. Please make sure the reply is concise and directly addresses the user's request, written from the perspective of a Waze map editor.`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            },
            data: JSON.stringify({
                model: GPT_MODEL,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant who writes concise, professional replies to Waze Update Requests from the perspective of a Waze map editor.' },
                    { role: 'user', content: prompt }
                ]
            }),
            onload: function(response) {
                console.log('AI AutoReply: OpenAI API request onload received.');
                if (btn) { btn.textContent = 'AI AutoReply'; btn.disabled = false; }
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.choices && json.choices.length > 0 && json.choices[0].message && json.choices[0].message.content) {
                        const reply = json.choices[0].message.content.trim();
                        insertReply(reply);
                        console.log('AI AutoReply: Successfully received and inserted GPT reply.');
                    } else {
                        console.error('AI AutoReply: GPT response format unexpected:', json);
                        alert('GPT reply failed: Unexpected response format. Check console.');
                    }
                } catch (e) {
                    console.error('AI AutoReply: Failed to parse GPT response or network error occurred', e);
                    alert('GPT reply failed. Check console for details. (Likely invalid API key or quota issue)');
                }
            },
            onerror: function(err) {
                console.error('AI AutoReply: OpenAI API request error:', err);
                if (btn) { btn.textContent = 'AI AutoReply'; btn.disabled = false; }
                alert('GPT API request failed. Check console for network errors.');
            }
        });
    }
})();