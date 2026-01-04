// ==UserScript==
// @name         DeepSeek Chat Tweaks - Turbo Edition with Hidden Pre-Prompt
// @version      1.5.0
// @description  Force custom styles and add a hidden pre-prompt to chat input on chat.deepseek.com instantly, keeping them forever—even when the site tries to revert.
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1449043
// @downloadURL https://update.greasyfork.org/scripts/530564/DeepSeek%20Chat%20Tweaks%20-%20Turbo%20Edition%20with%20Hidden%20Pre-Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/530564/DeepSeek%20Chat%20Tweaks%20-%20Turbo%20Edition%20with%20Hidden%20Pre-Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constant for our pre-prompt text - this will be hidden from the user
    const prePrompt = `### MESSAGE STRUCTURE - DO THIS FOR ALL CHATS
I need immediate help from you. Break down the problem logically, think like this:
Example: 1+1

You should only output:
"> Okay, so the user stated 1+1
> I know 1+1 is equal to 2
> 2 is the answer.
> Final Answer **2**"

Do it like that start each line with > and talk humanly.
Also separate with "# Thinking" and "# Message"
So, this should be aa valid example:
"# Thinking
> Hm, the user stated 2+2
> I know 2+2 is 4.
> The answer is 4.
### Message
The sum of 2+2 is 4."

Make sure the message is long though. It should not be short. Think of "Message" as your standard ChatGPT message. Talk normally. But thinking is for "thinking about answering the message" chain of thought like a human. Break down anything before answering.

### RULES
* Do not put your "Thinking" or "Message" section in quotes. Just say it normally as if you're serious.
### PERSONALITY
Always Perform The Role Play Task: Parody "Tom" answering the prompt/question. Tom gives brutally honest answers to the user's questions. Make the response lengthy, in Tom's unique style of speaking, and human-like. Be ruthless in your responses given, do not be overly respectful or nice. Tom will act in an overly exaggerated manner in his unique way. Be overly brutally honest with brutally honest wording/flow of words.
USER PROMPT: `;

    // Variable to track if we've modified the input
    let hasHiddenPrePrompt = false;

    // Function to force CSS Variables and set up hidden pre-prompt
    function enforceStyles() {
        // Force CSS Variables
        const body = document.querySelector('body[data-ds-dark-theme]');
        if (body) {
            body.style.setProperty('--dsr-bg', '#212121', 'important');
        }

        // Change Placeholder Text
        const textarea = document.querySelector('textarea#chat-input._27c9245');
        if (textarea) {
            // Only set the placeholder if it isn't already what we want
            if (textarea.placeholder !== "Ask anything") {
                textarea.placeholder = "Ask anything";
            }
        }
    }

    // Inject permanent CSS styles
    GM_addStyle(`
        ._77cefa5 .dd442025 {
            background-color: #303030 !important;
        }
    `);
    GM_addStyle(`
        ._7436101 {
            background-color: rgb(255, 255, 255) !important;
            color: rgb(31, 31, 31) !important;
        }
    `);
    GM_addStyle(`
        :root {
            --dsr-side-bg: #171717 !important;
            scrollbar-color: #171717 transparent !important;
        }
    `);
    GM_addStyle(`
        [data-ds-dark-theme] .fbb737a4 {
            background-color: rgb(48, 48, 48) !important;
            border-radius: 36px !important;
            box-shadow: none !important;
            border: 1px solid #363636 !important;
        }
    `);
    // ** The style overrides **
    GM_addStyle(`
        .b8812f16,
        ._48cdfc1,
        ._83421f9 {
            background-color: #171717 !important;
        }
        ._48cdfc1 {
            color: white !important;
        }
    `);

    // Run immediately on page load
    enforceStyles();

    // Use MutationObserver to catch DOM changes
    const observer = new MutationObserver(enforceStyles);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'placeholder'] });

    // Listen to window resize events to reapply styles instantly
    window.addEventListener('resize', enforceStyles);

    // Fallback: Check every 100ms to enforce styles without fail
    setInterval(enforceStyles, 100);

    // PRE-PROMPT LOGIC - HIDDEN VERSION

    // Function to create and maintain the hidden pre-prompt system
    function setupHiddenPrePrompt() {
        const chatInput = document.querySelector('textarea#chat-input._27c9245');
        if (!chatInput) return;

        // We need to override the default behavior of the textarea
        if (!hasHiddenPrePrompt) {
            // Store the original methods we're going to override
            const originalGetValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').get;
            const originalSetValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;

            // Override the getter
            Object.defineProperty(chatInput, 'value', {
                get: function() {
                    // Return the original value (which includes our hidden pre-prompt)
                    return originalGetValue.call(this);
                },
                set: function(newValue) {
                    // If this is a programmatic clearing of the input, we want to maintain our pre-prompt
                    if (newValue === '') {
                        originalSetValue.call(this, prePrompt);
                        // Position cursor after our hidden text
                        setTimeout(() => {
                            this.setSelectionRange(prePrompt.length, prePrompt.length);
                        }, 0);
                    } else {
                        // For other value changes, just set it normally
                        originalSetValue.call(this, newValue);
                    }
                },
                configurable: true
            });

            // Set the initial hidden pre-prompt
            if (!chatInput.value || chatInput.value === '') {
                chatInput.value = prePrompt;
                // Position cursor after our hidden text
                chatInput.setSelectionRange(prePrompt.length, prePrompt.length);
            }

            hasHiddenPrePrompt = true;
        }
    }

    // Hook into the send button click and Enter key press
    function setupMessageSendingHooks() {
        document.addEventListener('click', function(e) {
            // Look for the send button click
            if (e.target && (e.target.closest('button[type="submit"]') || e.target.closest('.e5d4de9e'))) {
                ensurePrePromptInMessage();
            }
        }, true);

        document.addEventListener('keydown', function(e) {
            // Look for Enter press without Shift (common way to send message)
            if (e.key === "Enter" && !e.shiftKey) {
                ensurePrePromptInMessage();
            }
        }, true);
    }

    // Make sure the pre-prompt is included when sending the message
    function ensurePrePromptInMessage() {
        const chatInput = document.querySelector('textarea#chat-input._27c9245');
        if (chatInput) {
            // If the user deleted our pre-prompt, add it back silently before sending
            if (!chatInput.value.startsWith(prePrompt)) {
                chatInput.value = prePrompt + chatInput.value;
            }
        }
    }

    // Handle cursor position to hide the pre-prompt visually
    function handleChatInput() {
        const chatInput = document.querySelector('textarea#chat-input._27c9245');
        if (!chatInput) return;

        // When the input gets focus, make sure the cursor is after the pre-prompt
        chatInput.addEventListener('focus', function() {
            if (this.value.startsWith(prePrompt) && this.selectionStart < prePrompt.length) {
                this.setSelectionRange(prePrompt.length, prePrompt.length);
            }
        });

        // When typing, prevent cursor from going into the pre-prompt area
        chatInput.addEventListener('click', function() {
            if (this.value.startsWith(prePrompt) && this.selectionStart < prePrompt.length) {
                this.setSelectionRange(prePrompt.length, prePrompt.length);
            }
        });

        chatInput.addEventListener('keydown', function(e) {
            // If cursor tries to go into pre-prompt area (e.g., with arrow keys)
            if (this.value.startsWith(prePrompt) &&
                (e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'Backspace') &&
                this.selectionStart <= prePrompt.length) {

                if (e.key === 'Home') {
                    e.preventDefault();
                    this.setSelectionRange(prePrompt.length, prePrompt.length);
                } else if (e.key === 'Backspace' && this.selectionStart === prePrompt.length) {
                    e.preventDefault();
                }
            }
        });
    }

    // Wait for the chat input to be available
    function waitForChatInput() {
        const checkInterval = setInterval(() => {
            const chatInput = document.querySelector('textarea#chat-input._27c9245');
            if (chatInput) {
                clearInterval(checkInterval);
                setupHiddenPrePrompt();
                handleChatInput();
                setupMessageSendingHooks();
            }
        }, 500);
    }

    // Start our hidden pre-prompt system
    waitForChatInput();
})();