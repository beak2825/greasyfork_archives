// ==UserScript==
// @name         Floating Poe AI Bubble
// @namespace    https://openuserjs.org/users/OlaCodez
// @version      3.1
// @description  Small draggable AI iframe with quick Poe bot switching, drag-and-drop, and hotkeys
// @author       OlaCodez
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542364/Floating%20Poe%20AI%20Bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/542364/Floating%20Poe%20AI%20Bubble.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 🚫 Prevent running inside iframes
    if (window.top !== window.self) return;

    const POE_BOTS = {
        "ChatGPT": "https://poe.com/ChatGPT",
        "GPT-4": "https://poe.com/gpt-4",
        "Claude-3": "https://poe.com/claude-3-opus",
        "Gemini": "https://poe.com/google-gemini-pro"
    };

    const EXCLUDED_DOMAINS = ["poe.com"];
    if (EXCLUDED_DOMAINS.some(domain => location.hostname.includes(domain))) return;

    let currentBot = localStorage.getItem("poe_bot") || "ChatGPT";
    let minimized = true;
    const BUBBLE_SIZE = 400;
    const BTN_OFFSET = 20;

    // === IFRAME ===
    const iframeContainer = document.createElement('div');
    Object.assign(iframeContainer.style, {
        position: 'fixed',
        bottom: `${BTN_OFFSET + 50}px`,
        right: `${BTN_OFFSET}px`,
        width: `${BUBBLE_SIZE}px`,
        height: `${BUBBLE_SIZE}px`,
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #333',
        boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
        zIndex: '99999',
        display: 'none',
        background: '#000'
    });

    const iframe = document.createElement('iframe');
    iframe.src = POE_BOTS[currentBot];
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none'
    });

    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    // === TOGGLE BUTTON ===
    const toggleBtn = document.createElement('div');
    toggleBtn.textContent = '💬';
    Object.assign(toggleBtn.style, {
        position: 'fixed',
        bottom: `${BTN_OFFSET}px`,
        right: `${BTN_OFFSET}px`,
        width: '45px',
        height: '45px',
        background: '#222',
        color: '#fff',
        borderRadius: '50%',
        textAlign: 'center',
        lineHeight: '45px',
        fontSize: '22px',
        cursor: 'pointer',
        zIndex: '100000',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        userSelect: 'none'
    });
    document.body.appendChild(toggleBtn);

    toggleBtn.onclick = () => {
        minimized = !minimized;
        iframeContainer.style.display = minimized ? 'none' : 'block';
    };

    // === AI SWITCH BUTTONS (ROW) ===
    const switcherBar = document.createElement('div');
    Object.assign(switcherBar.style, {
        position: 'fixed',
        bottom: `${BTN_OFFSET + 5}px`,
        right: `${BTN_OFFSET + 60}px`,
        display: 'flex',
        gap: '6px',
        zIndex: '100000',
        background: 'transparent',
        padding: '4px'
    });

    for (const [name, url] of Object.entries(POE_BOTS)) {
        const btn = document.createElement('div');
        btn.textContent = name;
        Object.assign(btn.style, {
            padding: '6px 10px',
            borderRadius: '20px',
            background: name === currentBot ? '#444' : '#222',
            color: '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            userSelect: 'none',
            border: '1px solid #555'
        });

        btn.onclick = () => {
            currentBot = name;
            iframe.src = url;
            localStorage.setItem("poe_bot", name);
            Array.from(switcherBar.children).forEach(child => {
                child.style.background = (child.textContent === name) ? '#444' : '#222';
            });
        };

        switcherBar.appendChild(btn);
    }

    document.body.appendChild(switcherBar);

    // === DRAG TOGGLE & BAR ===
    [toggleBtn, switcherBar].forEach(el => {
        let offsetX = 0, offsetY = 0, dragging = false;

        el.addEventListener('mousedown', (e) => {
            dragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            Object.assign(el.style, {
                left: x + 'px',
                top: y + 'px',
                right: 'auto',
                bottom: 'auto',
                position: 'fixed'
            });
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
        });
    });

    // === HOTKEYS ===
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + H → Hide all buttons
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
            toggleBtn.style.display = 'none';
            switcherBar.style.display = 'none';
        }

        // Ctrl + K then Ctrl + Z → Show all buttons
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            const onZ = (ev) => {
                if (ev.ctrlKey && ev.key.toLowerCase() === 'z') {
                    toggleBtn.style.display = 'block';
                    switcherBar.style.display = 'flex';
                    document.removeEventListener('keydown', onZ);
                }
            };
            document.addEventListener('keydown', onZ);
        }
    });
})();
