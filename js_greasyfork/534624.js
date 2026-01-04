// ==UserScript==
// @name         AllenAI Playground Auto-Focus
// @description  Automatically focuses the input on AllenAI Playground when typing
// @match        https://playground.allenai.org/*
// @version 0.0.1.20250501101156
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534624/AllenAI%20Playground%20Auto-Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/534624/AllenAI%20Playground%20Auto-Focus.meta.js
// ==/UserScript==

document.addEventListener('keydown', e => {
    const textarea = document.querySelector('textarea.auto-sized-input');
    const active = document.activeElement;
    
    if (textarea && !/^textarea|input$/i.test(active.tagName) && 
        e.key.length === 1 && /^[\w\s\W]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        
        e.preventDefault();
        textarea.focus();
        
        // Insert text at cursor position
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText(e.key, start, end, "end");
        
        // Trigger input events for React state updates
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
});