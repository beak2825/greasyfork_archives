// ==UserScript==
// @name         DeepSeek - User Prompts in New Chat
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Manages and inserts user-defined prompts on New Chat page.
// @author       DeepSeek + WM
// @license      MIT
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526135/DeepSeek%20-%20User%20Prompts%20in%20New%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/526135/DeepSeek%20-%20User%20Prompts%20in%20New%20Chat.meta.js
// ==/UserScript==

const iconPlus = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.8"></circle>
<line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" stroke-width="1.8"></line>
<line x1="10" y1="5" x2="10" y2="15" stroke="currentColor" stroke-width="1.8"></line>
</svg>
`;

const iconRefresh = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.5V7.5H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.5 17.5V12.5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 7.5C15.8487 4.36675 12.384 2.5 8.75 2.5C4.46929 2.5 1.25 5.71929 1.25 10C1.25 14.2807 4.46929 17.5 8.75 17.5C13.0307 17.5 16.25 14.2807 16.25 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const STORAGE_KEY = 'tamper-deepseek-user-prompts';

const autoCommit = false;

let prompts = [];
let settingsMenu = null; // Track menu instance

// Load prompts from GM storage
const loadPrompts = () => {
    prompts = GM_getValue(STORAGE_KEY, []);
};

// Save prompts to GM storage
const savePrompts = () => {
    GM_setValue(STORAGE_KEY, prompts);
};

// Add new prompt
const addPrompt = (id, text) => {
    prompts.push({ id, text, active: false });
    savePrompts();
};

// Remove prompt by ID
const removePrompt = (id) => {
    prompts = prompts.filter(p => p.id !== id);
    savePrompts();
};

// Set active prompt (toggle active state)
const setActivePrompt = (id) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
        prompt.active = !prompt.active; // Toggle active state
        savePrompts();
    }
};

// Get active prompts text (concatenated)
const getActivePromptsText = () => {
    return prompts.filter(p => p.active).map(p => p.text).join('\n') || '';
};

const clearChatInput = () => {
    const inputField = document.querySelector('#chat-input');
    if (inputField) {
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
            .set.call(inputField, ''); 
        inputField.dispatchEvent(new Event('input', { bubbles: true })); 
    }
};

// System prompts into chat-input, ENTER keystroke if autoCommit = true
const injectPromptsIntoChatInput = () => {
    const inputField = document.querySelector('#chat-input');
    if (!inputField?.value) {
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
            .set.call(inputField, getActivePromptsText());
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.scrollTop = inputField.scrollHeight;
        autoCommit && setTimeout(() => inputField.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })
        ), 150);
    }
};

function createDSStyledButton(text, icon, onClick) {
    const button = document.createElement('div');
    button.className = 'ds-button ds-button--primary ds-button--filled ds-button--rect ds-button--m d9f56c96';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.style = '--ds-button-color: #fff; --button-text-color: #4c4c4c; --button-border-color: rgba(0, 0, 0, 0.12); --ds-button-hover-color: #E0E4ED;';
    button.innerHTML = `
        <div class="ds-button__icon">
            <span style="transition: none; transform: rotate(0deg);">
                <div class="ds-icon" style="font-size: 16px; width: 16px; height: 16px; color: rgb(76, 76, 76);">
                    ${icon}
                </div>
            </span>
        </div>
        <span class="ad0c98fd">${text}</span>
    `;

    button.addEventListener('click', onClick);
    return button;
}

const createConfirmationDialog = (message, onConfirm, onCancel) => {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = 'white';
    dialog.style.border = '1px solid black';
    dialog.style.padding = '20px';
    dialog.style.zIndex = '10000';
    dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    dialog.appendChild(messageElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.textAlign = 'right';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Delete';
    confirmButton.style.marginRight = '10px';
    confirmButton.style.backgroundColor = '#ff4444';
    confirmButton.style.color = 'white';
    confirmButton.style.border = 'none';
    confirmButton.style.padding = '5px 10px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.onclick = () => {
        document.body.removeChild(dialog);
        onConfirm();
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = '#f0f0f0';
    cancelButton.style.border = 'none';
    cancelButton.style.padding = '5px 10px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => {
        document.body.removeChild(dialog);
        onCancel?.();
    };

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
};

const createAddPromptDialog = (onAdd) => {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = 'white';
    dialog.style.border = '1px solid black';
    dialog.style.padding = '20px';
    dialog.style.zIndex = '10000';
    dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    dialog.style.width = '300px';

    // Name Input
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Prompt Name:';
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';
    dialog.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.style.width = '100%';
    nameInput.style.marginBottom = '10px';
    dialog.appendChild(nameInput);

    // Content Input
    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Prompt Content:';
    contentLabel.style.display = 'block';
    contentLabel.style.marginBottom = '5px';
    dialog.appendChild(contentLabel);

    const contentInput = document.createElement('textarea');
    contentInput.style.width = '100%';
    contentInput.style.height = '100px';
    contentInput.style.resize = 'vertical';
    contentInput.style.marginBottom = '10px';
    dialog.appendChild(contentInput);

    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.style.marginRight = '10px';
    addButton.style.backgroundColor = '#4CAF50';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.padding = '5px 10px';
    addButton.style.cursor = 'pointer';
    addButton.onclick = () => {
        if (nameInput.value.trim()) {
            onAdd(nameInput.value.trim(), contentInput.value.trim());
            document.body.removeChild(dialog);
        } else {
            alert('Prompt name cannot be empty!');
        }
    };

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = '#f0f0f0';
    cancelButton.style.border = 'none';
    cancelButton.style.padding = '5px 10px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => {
        document.body.removeChild(dialog);
    };

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(cancelButton);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
};

const createPromptsConfigMenu = () => {
    const targetDiv = document.querySelector('.ec4f5d61');
    if (!targetDiv || document.querySelectorAll('.ec4f5d61').length !== 1) return;

    // Create menu container
    settingsMenu = document.createElement('div');
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.zIndex = 1000;
    settingsMenu.style.backgroundColor = 'white';
    settingsMenu.style.border = '1px solid black';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.display = 'none';

    // Prompt List Container
    const promptListContainer = document.createElement('div');
    promptListContainer.style.maxHeight = '200px';
    promptListContainer.style.overflowY = 'auto';
    promptListContainer.style.marginBottom = '10px';

    // Prompt List
    const promptList = document.createElement('div');
    promptList.style.marginBottom = '10px';

    const renderPrompts = () => {
        promptList.innerHTML = '';
        prompts.forEach(prompt => {
            const promptItem = document.createElement('div');
            promptItem.style.marginBottom = '5px';
            promptItem.style.width = '97%';
            promptItem.style.display = 'flex';
            promptItem.style.alignItems = 'center';

            // Active Checkbox
            const activeCheckbox = document.createElement('input');
            activeCheckbox.type = 'checkbox';
            activeCheckbox.checked = prompt.active;
            activeCheckbox.style.marginRight = '5px';
            activeCheckbox.onchange = () => {
                setActivePrompt(prompt.id);
                renderPrompts();
            };
            promptItem.appendChild(activeCheckbox);

            // ID Button
            const idButton = document.createElement('button');
            idButton.textContent = prompt.id;
            idButton.style.flexGrow = '1';
            idButton.style.textAlign = 'left';
            idButton.style.marginRight = '5px';
            idButton.onclick = () => {
                const textarea = promptItem.querySelector('textarea');
                textarea.style.display = textarea.style.display === 'none' ? 'block' : 'none';
            };
            promptItem.appendChild(idButton);

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.style.backgroundColor = 'transparent';
            deleteButton.style.border = 'none';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.color = 'red';
            deleteButton.onclick = (event) => {
                const isShiftHeld = event.shiftKey;
                const promptText = prompt.text;
                const promptId = prompt.id;
            
                if (isShiftHeld) {
                    removePrompt(prompt.id);
                    renderPrompts();
                } else {
                    createConfirmationDialog(
                        `Delete prompt "${promptId}"?\n\n${promptText}`,
                        () => {
                            removePrompt(prompt.id);
                            renderPrompts();
                        }
                    );
                }
            };
            promptItem.appendChild(deleteButton);

            // Textarea
            const textarea = document.createElement('textarea');
            textarea.value = prompt.text;
            textarea.style.display = 'none';
            textarea.style.width = '90%';
            textarea.style.resize = 'vertical';
            textarea.oninput = () => {
                prompt.text = textarea.value;
                savePrompts();
            };
            promptItem.appendChild(textarea);

            promptList.appendChild(promptItem);
        });
    };

    // Add Prompt Button
    const addPromptButton = createDSStyledButton('Add Prompt', iconPlus, () => {
        createAddPromptDialog((name, content) => {
            addPrompt(name, content);
            renderPrompts();
        });
    });

    // Refresh Button
    const refreshButton = createDSStyledButton('Refresh input', iconRefresh, () => {
        clearChatInput();
        injectPromptsIntoChatInput();
    });

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.gap = '10px';
    buttonRow.appendChild(addPromptButton);
    buttonRow.appendChild(refreshButton);
    
    // Append Elements
    promptListContainer.appendChild(promptList);
    settingsMenu.appendChild(promptListContainer);
    settingsMenu.appendChild(buttonRow);

    // Update menu position
    const updatePosition = () => {
        const rect = targetDiv.getBoundingClientRect();
        const marginRight = 10;
        const availableWidth = window.innerWidth - rect.right - marginRight;

        if (availableWidth < 160) {
            listContainer.style.display = 'none';
            return;
        }

        settingsMenu.style.display = 'block';
        settingsMenu.style.bottom = `${window.innerHeight - rect.bottom}px`;
        settingsMenu.style.left = `${rect.right + 20}px`;
        settingsMenu.style.right = `${marginRight}px`;
        settingsMenu.style.width = 'auto';
        settingsMenu.style.minWidth = '165px';
    };

    // Handle window resize
    ['resize', 'scroll', 'orientationchange', 'fullscreenchange'].forEach(event => {
        window.addEventListener(event, () => {
            if (settingsMenu && settingsMenu.style.display === 'block') {
                updatePosition();
            }
        });
    });

    // Create settings button
    const settingsButton = createDSStyledButton('Prompts', iconPlus, () => {
        if (!document.body.contains(settingsMenu)) {
            document.body.appendChild(settingsMenu);
        }
        settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
        if (settingsMenu.style.display === 'block') {
            updatePosition();
        }
    });

    targetDiv.insertBefore(settingsButton, targetDiv.children[2]);
    renderPrompts();
};


const drawContent = () => {
    createPromptsConfigMenu();
    injectPromptsIntoChatInput();
};

// Observer for switch to new chat without reload
const observeUrlChange = () => {
    let oldHref = window.location.href;
    const body = document.querySelector('body');
    const observer = new MutationObserver(() => {
        if (oldHref !== window.location.href) {
            oldHref = window.location.href;
            if (window.location.href === 'https://chat.deepseek.com/') {
                setTimeout(drawContent, 200);
            } else {
                settingsMenu?.remove();
            }
        }
    });
    observer.observe(body, { childList: true, subtree: true });
};

loadPrompts();

if (window.location.href === 'https://chat.deepseek.com/') {
    setTimeout(drawContent, 1000);
}

observeUrlChange();