// ==UserScript==
// @name         Kagi Assistant Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds prompt library and code copy features to Kagi Assistant
// @author       You
// @match        https://kagi.com/assistant/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/523026/Kagi%20Assistant%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/523026/Kagi%20Assistant%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== Prompt Library Functions =====

    // Load prompts from localStorage
    function loadPrompts() {
        const savedPrompts = localStorage.getItem('kagiPrompts');
        return savedPrompts ? JSON.parse(savedPrompts) : [
            { name: "Example Prompt 1", text: "This is example prompt 1" },
            { name: "Example Prompt 2", text: "This is example prompt 2" }
        ];
    }

    // Save prompts to localStorage
    function savePrompts(prompts) {
        localStorage.setItem('kagiPrompts', JSON.stringify(prompts));
    }

    // ===== Code Copy Button Functions =====

    // Add copy button to code blocks
    function addCopyButton() {
        const codeBlocks = document.querySelectorAll('.codehilite');

        codeBlocks.forEach(block => {
            if (block.querySelector('.bottom-copy-btn')) return;

            const copyButton = document.createElement('button');
            copyButton.className = 'bottom-copy-btn relative';
            copyButton.title = 'Copy';
            copyButton.setAttribute('data-partial-update-ignore', 'true');
            copyButton.innerHTML = `
                <span class="_0_copied_tooltip">Copied to clipboard</span>
                <i class="icon-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 7.5V5.25A2.25 2.25 0 019.75 3H18.75A2.25 2.25 0 0121 5.25V14.25A2.25 2.25 0 0118.75 16.5H16.5M16.5 9.75A2.25 2.25 0 0014.25 7.5H5.25A2.25 2.25 0 003 9.75V18.75A2.25 2.25 0 005.25 21H14.25A2.25 2.25 0 0016.5 18.75V9.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </i>
            `;

            copyButton.addEventListener('click', async () => {
                const code = block.querySelector('code').textContent;
                await navigator.clipboard.writeText(code);

                const tooltip = copyButton.querySelector('._0_copied_tooltip');
                tooltip.style.display = 'block';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 2000);
            });

            block.appendChild(copyButton);
        });
    }

    // ===== Create Prompt Library UI =====
    function createPromptLibrary() {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'prompt-library-button';
        button.className = 'prompt-library';
        button.innerHTML = `
            <i class="icon-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M7 7H17M7 12H17M7 17H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </i>
            <span>Prompts</span>
        `;

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.appendChild(button);

        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'prompt-dropdown';
        dropdown.style.display = 'none';

        // Update dropdown content function
        function updateDropdown() {
            const prompts = loadPrompts();
            dropdown.innerHTML = `
                <div class="prompt-header">
                    <span>My Prompts</span>
                    <div class="prompt-header-actions">
                        <button class="export-btn" title="Export">📤</button>
                        <button class="import-btn" title="Import">📥</button>
                        <button class="add-prompt-btn">+</button>
                    </div>
                </div>
                <div class="prompt-list">
                    ${prompts.map((prompt, index) => `
                        <div class="prompt-item">
                            <span class="prompt-name">${prompt.name}</span>
                            <div class="prompt-actions">
                                <button class="edit-btn" data-index="${index}">✏️</button>
                                <button class="delete-btn" data-index="${index}">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add event listeners for dropdown buttons
            attachDropdownListeners(dropdown);
        }

        // Handle dropdown visibility
        button.onclick = (e) => {
            e.stopPropagation();
            if (dropdown.style.display === 'none') {
                updateDropdown();
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        };

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        wrapper.appendChild(dropdown);
        return wrapper;
    }

    // Attach event listeners to dropdown elements
    function attachDropdownListeners(dropdown) {
        // Export functionality
        dropdown.querySelector('.export-btn').onclick = (e) => {
            e.stopPropagation();
            const prompts = loadPrompts();
            const blob = new Blob([JSON.stringify(prompts, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'kagi-prompts.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // Import functionality
        dropdown.querySelector('.import-btn').onclick = (e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                try {
                    const file = e.target.files[0];
                    const text = await file.text();
                    const prompts = JSON.parse(text);
                    if (Array.isArray(prompts) && prompts.every(p => p.name && p.text)) {
                        if (confirm('Replace all current prompts?')) {
                            savePrompts(prompts);
                            dropdown.querySelector('.prompt-list').innerHTML = '';
                            updateDropdown();
                        }
                    } else {
                        alert('Invalid file format');
                    }
                } catch (error) {
                    alert('Import error');
                    console.error(error);
                }
            };
            input.click();
        };

        // Add new prompt
        dropdown.querySelector('.add-prompt-btn').onclick = (e) => {
            e.stopPropagation();
            const name = prompt("Prompt name:");
            const text = prompt("Prompt text:");
            if (name && text) {
                const prompts = loadPrompts();
                prompts.push({ name, text });
                savePrompts(prompts);
                updateDropdown();
            }
        };

        // Handle prompt items
        dropdown.querySelectorAll('.prompt-item').forEach(item => {
            const promptBox = document.getElementById('promptBox');

            // Click on prompt name to use it
            item.querySelector('.prompt-name').onclick = () => {
                const index = item.querySelector('.edit-btn').dataset.index;
                const prompts = loadPrompts();
                if (promptBox) {
                    promptBox.value = prompts[index].text;
                    promptBox.focus();
                }
                dropdown.style.display = 'none';
            };

            // Edit prompt
            item.querySelector('.edit-btn').onclick = (e) => {
                e.stopPropagation();
                const index = e.target.dataset.index;
                const prompts = loadPrompts();
                const name = prompt("New name:", prompts[index].name);
                const text = prompt("New text:", prompts[index].text);
                if (name && text) {
                    prompts[index] = { name, text };
                    savePrompts(prompts);
                    updateDropdown();
                }
            };

            // Delete prompt
            item.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                const index = e.target.dataset.index;
                if (confirm("Delete this prompt?")) {
                    const prompts = loadPrompts();
                    prompts.splice(index, 1);
                    savePrompts(prompts);
                    updateDropdown();
                }
            };
        });
    }

    // ===== Add Styles =====
    function addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .codehilite {
                position: relative;
            }
            .bottom-copy-btn {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 5px;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            .bottom-copy-btn:hover {
                opacity: 1;
            }
            .bottom-copy-btn ._0_copied_tooltip {
                display: none;
                position: absolute;
                bottom: 100%;
                right: 0;
                background: black;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
            }
            .prompt-library {
                display: flex;
                align-items: center;
                gap: 8px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px 10px;
                color: var(--color-text-primary);
            }
            .prompt-dropdown {
                position: absolute;
                background-color: rgb(255, 255, 255);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                min-width: 250px;
                max-height: 400px;
                overflow-y: auto;
                margin-bottom: 10px;
            }
            .prompt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                background-color: rgb(250, 250, 250);
            }
            .prompt-header-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .add-prompt-btn, .export-btn, .import-btn {
                padding: 2px 8px;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.1);
                background: white;
                cursor: pointer;
            }
            .prompt-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                cursor: pointer;
                background-color: rgb(255, 255, 255);
            }
            .prompt-item:hover {
                background-color: rgb(245, 245, 245);
            }
            .prompt-actions {
                display: flex;
                gap: 4px;
            }
            .prompt-actions button {
                padding: 2px 4px;
                border: none;
                background: none;
                cursor: pointer;
                opacity: 0.6;
            }
            .prompt-actions button:hover {
                opacity: 1;
            }
            .prompt-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 8px;
            }
        `;
        document.head.appendChild(styles);
    }

    // ===== Initialize =====
    function init() {
        // Add styles
        addStyles();

        // Add prompt library
        const promptOptions = document.querySelector('.prompt-options');
        if (promptOptions && !document.getElementById('prompt-library-button')) {
            const promptLibrary = createPromptLibrary();
            const toggleSwitch = promptOptions.querySelector('.k_ui_toggle_switch');
            promptOptions.insertBefore(promptLibrary, toggleSwitch);
        }

        // Add copy buttons to code blocks
        addCopyButton();
    }

    // Observe DOM changes
    const observer = new MutationObserver((mutations) => {
        init();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial execution
    init();
})();
