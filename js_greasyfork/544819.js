// ==UserScript==
// @name         AI Studio quick prompt via site search shortcut
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Create new AI Studio prompts quickly using site search shortcut
// @author       bestjeans
// @match        https://aistudio.google.com/prompts/new_chat*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_2_256x256.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544819/AI%20Studio%20quick%20prompt%20via%20site%20search%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/544819/AI%20Studio%20quick%20prompt%20via%20site%20search%20shortcut.meta.js
// ==/UserScript==

/* Description
Userscript that lets you quickly create a new prompt from the address bar using a site search shortcut.

Prerequisite - requires creating a site search shortcut:
1. Add site-search shortcut to your browser (for Chrome: https://support.google.com/chrome/answer/95426)
   - with "URL with %s in place of query" as "https://aistudio.google.com/prompts/new_chat#%s"
   - and shortcut as whatever you like (I use "ais")

Usage:
1. Type in your site search shortcut in the browser's address bar
2. Press TAB and then
3. Type in what you want to prompt
4. Press ENTER
5. The prompt should have the text you typed in filled, and then you can press RUN to
run the prompt, or configure some settings first before you do that.

Motivation:
I've been mainly using Gemini 2.5 Pro after I found out that you could use it for free
via aistudio.google.com and that it was better than the free version of ChatGPT but I
missed the ChatGPT app where, on macOS, you could enter a shortcut and quickly enter a
new prompt which really speeded up prompting.

There is no AI Studio app so I figured the next best thing was to make a userscript[0]
to use site search shortcut. I use site search shortcuts a lot especially for YouTube
where I have set `y` to be the shortcut, which helps make it really quick to search.

Made using Gemini 2.5 Pro in aistudio.google.com :)

Notes:
- tried to get it to submit button straightaway as well but didn't get it working but
  decided to keep it like that because sometimes you might want to enable URL context
  or change some other setting etc
  - one way to do this could be to create another site search shortcut with an extra
    URLSearchParam with the options you want so you have a different shortcut like
    "aiss" that has specific settings you want

[0]: at first I thought about making a chrome extension but too much work, you could ask
     the LLM to make it
*/

(function () {
    'use strict';

    // This function finds and acts upon the prompt elements.
    const findAndProcessPrompt = () => {
        // changed to using # instead of ?q= incase their backend changes and starts trying to look it up
        // const urlParams = new URLSearchParams(window.location.search);
        // const userPrompt = urlParams.get('q');
        let userPrompt = decodeURI(window.location.hash.substring(1));  // decodeURI to remove %20 etc

        // if there is no prompt then stop
        if (!userPrompt) {
            return false;
        }
        console.log(`Found user prompt:\n${userPrompt}`);

        // list of possible selectors
        const SELECTORS = [
            'textarea[formcontrolname="promptText"]',
            'textarea[aria-label="Enter a prompt"]',
            'textarea[aria-label="Type something or tab to choose an example prompt"]',
            'textarea[placeholder="Start typing a prompt"]',
            'textarea[placeholder="Start typing a prompt, use option + enter to append"]'
        ];

        let promptTextArea = null;

        // Loop through the placeholders to find a valid textarea.
        for (const selector of SELECTORS) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`AI Studio Inserter: Found textarea with selector:\n${selector}`);
                promptTextArea = element;
                break; // Stop looking once we find one.
            }
        }

        // --- NEW LOGIC ---
        // Proceed as long as we've found the textarea. The button is now optional.
        if (promptTextArea) {
            console.log('AI Studio Inserter: Preparing to process prompt.');

            setTimeout(() => {
                // Step 1: Always fill the textarea.
                promptTextArea.value = userPrompt;
                promptTextArea.dispatchEvent(new Event('input', { bubbles: true }));
                promptTextArea.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('AI Studio Inserter: Prompt text inserted.');

                // Step 2: Look for the submit button and click it only if it exists.
                // const submitButton = document.querySelector('button[aria-label="Run"]');
                // if (submitButton) {
                //     console.log('AI Studio Inserter: Run button found. Clicking.');
                //     submitButton.click();
                // } else {
                //     console.log('AI Studio Inserter: Run button not found, skipping click.');
                // }

                // Step 3: Clean the URL regardless of whether the button was clicked.
                // below commented out because you'll get a "An internal error occured" message with error code 500 https://aistudio.google.com/500
                // error came up starting on 2025-09-04
                // window.history.replaceState({}, document.title, window.location.pathname);

            }, 100);

            // Return true to indicate the primary task is complete and stop the observer.
            return true;
        }

        // Return false if the textarea wasn't found, so the observer keeps trying.
        return false;
    };

    // The MutationObserver logic remains the same.
    const observer = new MutationObserver((mutations, obs) => {
        if (findAndProcessPrompt()) {
            console.log('AI Studio Inserter: Task complete, disconnecting observer.');
            obs.disconnect();
        }
    });

    console.log('AI Studio Inserter: Observer started, waiting for prompt elements...');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case elements are already present.
    if (findAndProcessPrompt()) {
        observer.disconnect();
    }
})();