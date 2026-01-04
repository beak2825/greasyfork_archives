// ==UserScript==
// @name         ChatGPT Template Text Buttons
// @namespace    https://chatgpt.com/
// @version      1.0.1
// @description  Adds buttons to ChatGPT text inputs to paste predefined templates.
// @author       63OR63
// @license      MIT
// @match        https://chatgpt.com/*
// @icon         https://chat.openai.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519682/ChatGPT%20Template%20Text%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/519682/ChatGPT%20Template%20Text%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Button definitions: { button_name: { text: "pasted_text", color: "color_code" } }
    const buttonDefinitions = {
        Refactor: {
            text: `Refactor the following code to improve efficiency or readability without altering its functionality:
\`\`\`
{clipboard}
\`\`\`
Do not explain the code in your response.
`,
            color: "#FFC1CC", // Pastel pink
        },
        Fix: {
            text: `Fix any errors in the following code without changing its core functionality:
\`\`\`
{clipboard}
\`\`\`
Explain the fixes you made by comments in the code's body and give a laconic explanation after.
`,
            color: "#FFDDC1", // Pastel peach
        },
        Explain: {
            text: `Explain the following code concisely:
\`\`\`
{clipboard}
\`\`\`
Focus on key functionality and purpose.
`,
            color: "#FFEBCC", // Pastel yellow
        },
        Review: {
            text: `You are a highly skilled software engineer specializing in code reviews.
Review the following code:
\`\`\`
{clipboard}
\`\`\`
Ensure your feedback is constructive and professional.
Propose improvements with concise explanation.
Reference to guidelines and known best practices where applicable.
`,
            color: "#E6E0FF", // Pastel lavender
        },
        Docs: {
            text: `Generate comprehensive documentation for the following code:
\`\`\`
{clipboard}
\`\`\`
Use the standard documentation format for the provided language. If unsure, use a widely accepted format.
Do not explain the changes in your response.
Do not refactor the code.
`,
            color: "#D8F3DC", // Pastel mint green
        },
        Template: {
            text: `
\`\`\`
{clipboard}
\`\`\`
    `,
            color: "#D1E7FF", // Pastel blue
        },
    };

    // Create buttons for a textarea's parent container
    const createButtonsForTextarea = (textarea) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'row';
        buttonContainer.style.gap = '10px'; // gap between buttons
        buttonContainer.style.marginTop = '12px'; // margin below the textarea
        buttonContainer.style.alignItems = 'center';

        Object.entries(buttonDefinitions).forEach(([name, config]) => {
            const button = document.createElement('button');
            button.innerText = name;
            button.type = 'button';
            button.style.backgroundColor = config.color;
            button.style.color = '#333';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.padding = '3px 8px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.transition = 'none';

            // Add effect when button is pressed
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });

            // Add click event to paste text
            button.addEventListener('mousedown', async (e) => {
                e.preventDefault(); // Prevent losing focus on the currently focused element
                e.stopPropagation(); // Stop the event from propagating further

                const focusedElement = document.activeElement; // Save the currently focused element
                const promptTextarea = document.getElementById('prompt-textarea');

                // Read clipboard content
                let clipboardText = '';
                try {
                    clipboardText = await navigator.clipboard.readText();
                } catch (err) {
                    console.error("Clipboard access failed:", err);
                    return;
                }

                // Replace the placeholder with clipboard content
                const finalText = config.text.replace("{clipboard}", clipboardText);

                if (promptTextarea === focusedElement) {
                    // Paste into the focused "prompt-textarea"
                    const lines = finalText.split(/\r?\n/); // Split finalText into lines by newlines
                    lines.forEach(line => {
                        const paragraph = document.createElement('p'); // Create a new <p> element
                        paragraph.textContent = line; // Set the text content of the <p> element to the line
                        promptTextarea.appendChild(paragraph); // Append the <p> element to promptTextarea
                    });

                } else if (focusedElement && focusedElement.tagName === 'TEXTAREA') {
                    // Use setRangeText to ensure persistence and proper event firing
                    const cursorPosition = focusedElement.selectionStart || focusedElement.value.length;
                    focusedElement.setRangeText(finalText, cursorPosition, cursorPosition, "end");

                    // Trigger events to simulate manual entry
                    focusedElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });

            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    };

    // Attach buttons to all relevant textareas
    const attachButtons = () => {
        const main = document.querySelector('main');
        if (!main) return;

        const textareas = main.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            const parent = textarea.parentElement;
            if (!parent.querySelector('.button-container')) {
                const buttonContainer = createButtonsForTextarea(textarea);
                buttonContainer.classList.add('button-container');
                parent.appendChild(buttonContainer);
            }
        });
    };

    // Observe the DOM for dynamically added textareas
    const observer = new MutationObserver(() => {
        attachButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial attachment
    attachButtons();
})();
