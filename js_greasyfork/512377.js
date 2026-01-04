// ==UserScript==
// @name         Civitai Multiple Prompt Copy Buttons (with Prompt Management)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adds multiple prompt copy buttons in a compact, draggable floating menu with prompt management on Civitai's generate page
// @match        https://civitai.com/generate
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/512377/Civitai%20Multiple%20Prompt%20Copy%20Buttons%20%28with%20Prompt%20Management%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512377/Civitai%20Multiple%20Prompt%20Copy%20Buttons%20%28with%20Prompt%20Management%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let prompts = GM_getValue("savedPrompts", {
        'Ryuko': "matoi ryuuko, kill la kill, 1girl, black hair, blue eyes, medium hair, multicolored hair, red hair, streaked hair, two-tone hair",
        'Low angle': "from below, low angle, ground level",
        'High angle': "from above, high angle",
        'Kuroneko': "in the style of Kanzaki Hiro, 1girl, gokou ruri, black hair, blush, hairclip, hairband, hime cut, purple eyes, hair flower, hair ornament, hairclip, red eyes",
        'Toki': "toki (blue archive), blue archive, 1girl, blonde hair, blue eyes, blue hairband, blue halo, hairband, halo, solo",
        'Oily': "wet, wet skin, shiny, shiny skin, glossy, glossy skin, oil, oily, oily skin, sweat, sweaty, sweaty skin",
        'Dark': "dark-skinned female, dark skin, tan, tanline",
        'Blonde': "blonde hair, hime cut, long hair, straight hair, hairband"
    });

    const colors = ['#8B0000', '#00008B', '#8B008B', '#006400', '#008B8B', '#8B4500', '#8B8B00'];

    GM_addStyle(`
        #prompt-buttons-container {
            position: fixed;
            z-index: 9999;
            background-color: rgba(26,26,26,0.9);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            width: 240px;
            display: flex;
            flex-direction: column;
        }
        #drag-handle {
            height: 24px;
            background-color: #2a2a2a;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 8px;
        }
        #buttons-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            padding: 4px;
            max-height: 300px;
            overflow-y: auto;
        }
        .prompt-button, #show-hide-btn, #manage-btn {
            padding: 6px;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: all 0.2s;
            text-align: center;
            border-radius: 4px;
        }
        .prompt-button:hover, #show-hide-btn:hover, #manage-btn:hover {
            filter: brightness(1.2);
            transform: translateY(-1px);
        }
        #show-hide-btn, #manage-btn {
            background-color: #4a4a4a;
            width: 50px;
        }
        #pin-btn {
            cursor: pointer;
            color: #fff;
            font-size: 14px;
            background: none;
            border: none;
            padding: 0;
        }
        #manage-panel {
            display: none;
            padding: 8px;
            background-color: #2a2a2a;
        }
        #manage-panel input, #manage-panel textarea {
            width: 100%;
            margin-bottom: 4px;
            padding: 4px;
        }
        #manage-panel button {
            margin-right: 4px;
            margin-bottom: 4px;
        }
    `);

    function createButton(name, prompt, color) {
        const button = document.createElement('button');
        button.className = 'prompt-button';
        button.textContent = name;
        button.style.backgroundColor = color;
        button.onclick = (e) => {
            e.stopPropagation();
            GM_setClipboard(prompt);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = originalText, 1000);
        };
        return button;
    }

    function makeDraggable(container, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(container.style.left) || 0;
            startTop = parseInt(container.style.top) || 0;
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;
            if (container.dataset.pinned === 'true') return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            container.style.left = `${startLeft + deltaX}px`;
            container.style.top = `${startTop + deltaY}px`;
            savePosition(startLeft + deltaX, startTop + deltaY);
        }

        function stopDragging() {
            isDragging = false;
        }
    }

    function savePosition(x, y) {
        GM_setValue("containerX", x);
        GM_setValue("containerY", y);
    }

    function loadPosition(container) {
        const x = GM_getValue("containerX", window.innerWidth - 260);
        const y = GM_getValue("containerY", window.innerHeight - 300);
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
    }

    function updateButtonsGrid() {
        const buttonGrid = document.getElementById('buttons-grid');
        buttonGrid.innerHTML = '';
        Object.entries(prompts).forEach(([name, prompt], index) => {
            const button = createButton(name, prompt, colors[index % colors.length]);
            buttonGrid.appendChild(button);
        });
        GM_setValue("savedPrompts", prompts);
    }

    function addPromptButtons() {
        const container = document.createElement('div');
        container.id = 'prompt-buttons-container';

        const dragHandle = document.createElement('div');
        dragHandle.id = 'drag-handle';

        const showHideBtn = document.createElement('button');
        showHideBtn.id = 'show-hide-btn';
        showHideBtn.textContent = 'Hide';
        showHideBtn.onclick = toggleButtons;

        const manageBtn = document.createElement('button');
        manageBtn.id = 'manage-btn';
        manageBtn.textContent = 'Manage';
        manageBtn.onclick = toggleManagePanel;

        const pinBtn = document.createElement('button');
        pinBtn.id = 'pin-btn';
        pinBtn.innerHTML = '📌';
        pinBtn.onclick = togglePin;

        dragHandle.appendChild(showHideBtn);
        dragHandle.appendChild(manageBtn);
        dragHandle.appendChild(pinBtn);

        const buttonGrid = document.createElement('div');
        buttonGrid.id = 'buttons-grid';

        const managePanel = createManagePanel();

        container.appendChild(dragHandle);
        container.appendChild(buttonGrid);
        container.appendChild(managePanel);
        document.body.appendChild(container);

        updateButtonsGrid();
        makeDraggable(container, dragHandle);
        loadPosition(container);
    }

    function toggleButtons() {
        const buttonGrid = document.getElementById('buttons-grid');
        const showHideBtn = document.getElementById('show-hide-btn');
        if (buttonGrid.style.display === 'none') {
            buttonGrid.style.display = 'grid';
            showHideBtn.textContent = 'Hide';
        } else {
            buttonGrid.style.display = 'none';
            showHideBtn.textContent = 'Show';
        }
    }

    function togglePin() {
        const container = document.getElementById('prompt-buttons-container');
        const pinBtn = document.getElementById('pin-btn');
        if (container.dataset.pinned === 'true') {
            delete container.dataset.pinned;
            pinBtn.style.opacity = '1';
        } else {
            container.dataset.pinned = 'true';
            pinBtn.style.opacity = '0.5';
        }
    }

    function toggleManagePanel() {
        const managePanel = document.getElementById('manage-panel');
        managePanel.style.display = managePanel.style.display === 'none' ? 'block' : 'none';
    }

    function createManagePanel() {
        const panel = document.createElement('div');
        panel.id = 'manage-panel';
        panel.style.display = 'none';

        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Prompt Name';

        const promptInput = document.createElement('textarea');
        promptInput.placeholder = 'Prompt Text';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = () => {
            if (nameInput.value && promptInput.value) {
                prompts[nameInput.value] = promptInput.value;
                updateButtonsGrid();
                nameInput.value = '';
                promptInput.value = '';
            }
        };

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            if (nameInput.value && promptInput.value && prompts.hasOwnProperty(nameInput.value)) {
                prompts[nameInput.value] = promptInput.value;
                updateButtonsGrid();
            }
        };

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            if (prompts.hasOwnProperty(nameInput.value)) {
                delete prompts[nameInput.value];
                updateButtonsGrid();
                nameInput.value = '';
                promptInput.value = '';
            }
        };

        panel.appendChild(nameInput);
        panel.appendChild(promptInput);
        panel.appendChild(addButton);
        panel.appendChild(editButton);
        panel.appendChild(removeButton);

        return panel;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addPromptButtons);
    } else {
        addPromptButtons();
    }
})();