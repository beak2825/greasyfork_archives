// ==UserScript==
// @name         Drawaria Personal Assistant
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Assistant with photo upload and autonomous notes
// @author       лазер дмитрий прайм, YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://www.drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544863/Drawaria%20Personal%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/544863/Drawaria%20Personal%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles
    GM_addStyle(`
        #drawaria-assistant {
            position: fixed;
            width: 120px;
            height: 120px;
            background-size: contain;
            background-repeat: no-repeat;
            cursor: grab;
            z-index: 9999;
            user-select: none;
            pointer-events: auto;
            transition: transform 0.2s;
        }

        #drawaria-assistant.dragging {
            cursor: grabbing;
            transform: scale(1.1);
        }

        .assistant-message {
            position: absolute;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff9c4;
            padding: 8px 12px;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            font-family: 'Comic Sans MS', cursive;
            font-size: 14px;
            max-width: 200px;
            text-align: center;
            border: 2px solid #ffd700;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        #drawaria-assistant:hover .assistant-message {
            opacity: 1;
        }

        #assistant-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        #upload-assistant-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        #assistant-image-input {
            display: none;
        }

        .note-from-assistant {
            position: fixed;
            background: #fff9c4;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            border: 2px solid #ffd700;
            max-width: 250px;
            z-index: 10001;
            display: none;
            animation: noteAppear 0.5s;
            text-align: center;
        }

        @keyframes noteAppear {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .note-close {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
        }
    `);

    // Create the assistant
    const assistant = document.createElement('div');
    assistant.id = 'drawaria-assistant';

    // Message on hover
    const message = document.createElement('div');
    message.className = 'assistant-message';
    message.textContent = 'I am your assistant!';
    assistant.appendChild(message);

    document.body.appendChild(assistant);

    // Control panel (photo upload only)
    const controlsPanel = document.createElement('div');
    controlsPanel.id = 'assistant-controls';

    const uploadButton = document.createElement('button');
    uploadButton.id = 'upload-assistant-btn';
    uploadButton.textContent = 'Upload Photo';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'assistant-image-input';
    fileInput.accept = 'image/*';

    controlsPanel.appendChild(uploadButton);
    controlsPanel.appendChild(fileInput);
    document.body.appendChild(controlsPanel);

    // Note from assistant
    const note = document.createElement('div');
    note.className = 'note-from-assistant';
    note.innerHTML = `
        <span class="note-close">&times;</span>
        <div class="note-content"></div>
    `;
    document.body.appendChild(note);

    // Assistant settings
    let assistantPosX = Math.random() * (window.innerWidth - 120);
    let assistantPosY = Math.random() * (window.innerHeight - 120);
    let targetAssistantX = assistantPosX;
    let targetAssistantY = assistantPosY;
    let assistantSpeed = 0.5 + Math.random() * 2;
    let isAssistantDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastNoteDeliveryTime = 0;

    const notes = [
        "Don't forget to save your work!",
        "Try a new tool today!",
        "You are a great artist!",
        "Take a break if you're tired!",
        "How about trying a new color?",
        "Your progress is impressive!",
        "Draw with pleasure!",
        "Today is a great day for creativity!",
        "Don't be afraid to experiment!",
        "You're doing great!"
    ];

    // Load saved image
    const savedImage = GM_getValue('assistantImage', '');
    if (savedImage) {
        assistant.style.backgroundImage = `url('${savedImage}')`;
    } else {
        assistant.style.backgroundImage = 'url("https://i.imgur.com/469d84f081bf628c4573a40792f8a519.png")';
    }

    // Position the assistant
    assistant.style.left = assistantPosX + 'px';
    assistant.style.top = assistantPosY + 'px';

    // Assistant movement
    function moveAssistant() {
        if (isAssistantDragging) {
            requestAnimationFrame(moveAssistant);
            return;
        }

        const now = Date.now();

        // Randomly change direction
        if (Math.random() < 0.005 || now - lastMoveTime > 10000) {
            targetAssistantX = Math.random() * (window.innerWidth - 120);
            targetAssistantY = Math.random() * (window.innerHeight - 120);
            assistantSpeed = 0.5 + Math.random() * 2;
            lastMoveTime = now;
        }

        // Move towards target
        const dx = targetAssistantX - assistantPosX;
        const dy = targetAssistantY - assistantPosY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            assistantPosX += (dx / distance) * assistantSpeed;
            assistantPosY += (dy / distance) * assistantSpeed;
        }

        // Screen boundaries
        assistantPosX = Math.max(0, Math.min(window.innerWidth - 120, assistantPosX));
        assistantPosY = Math.max(0, Math.min(window.innerHeight - 120, assistantPosY));

        // Apply movement
        assistant.style.left = assistantPosX + 'px';
        assistant.style.top = assistantPosY + 'px';

        // Reflect image
        assistant.style.transform = dx < 0 ? 'scaleX(-1)' : 'scaleX(1)';

        // Check if it's time to deliver a note
        if (now - lastNoteDeliveryTime > 120000 + Math.random() * 180000) {
            deliverNote();
            lastNoteDeliveryTime = now;
        }

        requestAnimationFrame(moveAssistant);
    }

    function deliverNote() {
        // Fly towards the user
        targetAssistantX = window.innerWidth / 2 - 60;
        targetAssistantY = window.innerHeight / 2 - 60;
        assistantSpeed = 3;

        // Show note after 2 seconds
        setTimeout(() => {
            const noteContent = note.querySelector('.note-content');
            noteContent.textContent = notes[Math.floor(Math.random() * notes.length)];

            note.style.left = (assistantPosX + 140) + 'px';
            note.style.top = (assistantPosY - 50) + 'px';
            note.style.display = 'block';

            // Close note
            note.querySelector('.note-close').onclick = () => {
                note.style.display = 'none';
            };

            // Auto-close after 10 seconds
            setTimeout(() => {
                if (note.style.display !== 'none') {
                    note.style.display = 'none';
                }
            }, 10000);
        }, 2000);
    }

    // Image upload
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                assistant.style.backgroundImage = `url('${imageUrl}')`;
                GM_setValue('assistantImage', imageUrl); // Key remains 'assistantImage' for persistence
                message.textContent = "I look better now!";
                message.style.opacity = '1';
                setTimeout(() => message.style.opacity = '0', 3000);
            };
            reader.readAsDataURL(file);
        }
    });

    // Dragging the assistant
    assistant.addEventListener('mousedown', function(e) {
        isAssistantDragging = true;
        dragOffsetX = e.clientX - assistantPosX;
        dragOffsetY = e.clientY - assistantPosY;
        assistant.classList.add('dragging');
        message.textContent = "Release me anywhere!";
        message.style.opacity = '1';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (isAssistantDragging) {
            assistantPosX = e.clientX - dragOffsetX;
            assistantPosY = e.clientY - dragOffsetY;
            assistantPosX = Math.max(0, Math.min(window.innerWidth - 120, assistantPosX));
            assistantPosY = Math.max(0, Math.min(window.innerHeight - 120, assistantPosY));
            assistant.style.left = assistantPosX + 'px';
            assistant.style.top = assistantPosY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isAssistantDragging) {
            isAssistantDragging = false;
            assistant.classList.remove('dragging');
            setTimeout(() => message.style.opacity = '0', 2000);
        }
    });

    // Simple message on click
    assistant.addEventListener('click', function(e) {
        e.stopPropagation();
        message.textContent = "How can I help?";
        message.style.opacity = '1';
        setTimeout(() => message.style.opacity = '0', 3000);
    });

    // Reaction to window resize
    window.addEventListener('resize', function() {
        assistantPosX = Math.max(0, Math.min(window.innerWidth - 120, assistantPosX));
        assistantPosY = Math.max(0, Math.min(window.innerHeight - 120, assistantPosY));
        assistant.style.left = assistantPosX + 'px';
        assistant.style.top = assistantPosY + 'px';
    });

    // Start the assistant
    let lastMoveTime = Date.now();
    moveAssistant();
})();