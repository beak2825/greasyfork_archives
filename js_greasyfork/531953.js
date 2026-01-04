// ==UserScript==
// @name         YouTube Subtitle Panel
// @namespace    https://github.com/YoungerMouse
// @version      0.6.8
// @description  Displays and tracks YouTube subtitles in a floating panel
// @author       YoungerMouse
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531953/YouTube%20Subtitle%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/531953/YouTube%20Subtitle%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Make original captions selectable
    const style = document.createElement('style');
    style.textContent = `
        .caption-visual-line, .captions-text {
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    // Subtitle panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '12%',
        right: '2%',
        width: '360px',
        maxHeight: '40%',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontSize: '14px',
        padding: '10px',
        zIndex: '9999',
        borderRadius: '8px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'sans-serif'
    });
    document.body.appendChild(panel);

    // Button container
    const buttonContainer = document.createElement('div');
    Object.assign(buttonContainer.style, {
        position: 'fixed',
        bottom: '6%',
        right: '2%',
        display: 'flex',
        gap: '8px',
        zIndex: '9999'
    });
    document.body.appendChild(buttonContainer);

    // Create buttons
    function createButton(label) {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            padding: '6px 10px',
            background: '#00B75A',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        buttonContainer.appendChild(btn);
        return btn;
    }

    // Button order: [Mode, Copy, Clear, Hide]
    const btnMode = createButton('Manual');
    const btnCopy = createButton('Copy');
    const btnClear = createButton('Clear');
    const btnToggle = createButton('Hide');

    let subtitleLines = [];
    let lastText = '';
    let panelVisible = true;
    let autoMode = false; // Default: Manual

    btnCopy.onclick = () => {
        const text = subtitleLines.join('\n');
        navigator.clipboard.writeText(text);
        btnCopy.textContent = 'Copied!';
        setTimeout(() => (btnCopy.textContent = 'Copy'), 1500);
    };

    btnClear.onclick = () => {
        subtitleLines = [];
        panel.textContent = '';
    };

    btnToggle.onclick = () => {
        panelVisible = !panelVisible;
        panel.style.display = panelVisible ? 'block' : 'none';
        btnMode.style.display = panelVisible ? 'inline-block' : 'none';
        btnCopy.style.display = panelVisible ? 'inline-block' : 'none';
        btnClear.style.display = panelVisible ? 'inline-block' : 'none';
        btnToggle.textContent = panelVisible ? 'Hide' : 'Show';
    };

    btnMode.onclick = () => {
        autoMode = !autoMode;
        btnMode.textContent = autoMode ? 'Auto' : 'Manual';
    };

    function getCurrentSubtitleBlock() {
        const lines = document.querySelectorAll('.caption-visual-line');
        if (autoMode && lines.length >= 1) {
            return lines[0].textContent.trim(); // Auto: only first line
        }
        return Array.from(lines)
            .map(el => el.textContent.trim())
            .filter(Boolean)
            .join('\n');
    }

    setInterval(() => {
        const text = getCurrentSubtitleBlock();
        if (text && text !== lastText) {
            lastText = text;
            subtitleLines.push(text);
            panel.textContent += text + '\n';
            panel.scrollTop = panel.scrollHeight;
        }
    }, 300);
})();
