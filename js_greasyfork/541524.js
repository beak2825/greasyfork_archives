// ==UserScript==
// @name         Forum HTML Combiner - Heart
// @namespace    HeartScripts
// @version      1.1
// @description  Combines intro, table, outro for Torn forum threads
// @author       Heart [3034011]
// @match        https://www.torn.com/forums.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541524/Forum%20HTML%20Combiner%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/541524/Forum%20HTML%20Combiner%20-%20Heart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '+';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '70px'; // moved up from 10px to 70px
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.width = '40px';
    toggleBtn.style.height = '40px';
    toggleBtn.style.background = '#4CAF50';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.fontSize = '20px';
    toggleBtn.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    document.body.appendChild(toggleBtn);

    // Create main interface
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '120px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.background = '#1e1e1e';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '10px';
    container.style.width = '90vw';
    container.style.maxWidth = '500px';
    container.style.display = 'none';
    container.style.flexDirection = 'column';
    container.style.gap = '5px';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.8)';
    container.style.fontSize = '14px';

    // Textareas
    const introBox = document.createElement('textarea');
    introBox.placeholder = 'Intro HTML (top)';
    const outroBox = document.createElement('textarea');
    outroBox.placeholder = 'Outro HTML (bottom)';
    const tableBox = document.createElement('textarea');
    tableBox.placeholder = 'Table HTML (middle)';
    const resultBox = document.createElement('textarea');
    resultBox.placeholder = 'Mixed Result';
    resultBox.readOnly = true;

    [introBox, outroBox, tableBox, resultBox].forEach(box => {
        box.style.width = '100%';
        box.style.height = '60px';
        box.style.background = '#2c2c2c';
        box.style.color = 'white';
        box.style.border = '1px solid #555';
        box.style.padding = '5px';
        box.style.borderRadius = '5px';
        box.style.fontFamily = 'monospace';
        box.style.resize = 'vertical';
    });

    // Buttons
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Save';
    const mixBtn = document.createElement('button');
    mixBtn.textContent = '🔀 Mix';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';

    [saveBtn, mixBtn, copyBtn].forEach(btn => {
        btn.style.padding = '5px 10px';
        btn.style.margin = '2px';
        btn.style.background = '#333';
        btn.style.color = 'white';
        btn.style.border = '1px solid #777';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
    });

    // Load from localStorage
    const loadSaved = () => {
        introBox.value = localStorage.getItem('forumIntro') || '';
        outroBox.value = localStorage.getItem('forumOutro') || '';
    };

    // Save button
    saveBtn.onclick = () => {
        localStorage.setItem('forumIntro', introBox.value);
        localStorage.setItem('forumOutro', outroBox.value);
        alert('Intro & Outro saved!');
    };

    // Mix button
    mixBtn.onclick = () => {
        resultBox.value = `${introBox.value.trim()}\n${tableBox.value.trim()}\n${outroBox.value.trim()}`;
    };

    // Copy button
    copyBtn.onclick = () => {
        GM_setClipboard(resultBox.value);
        alert('Copied to clipboard!');
    };

    // Add elements
    container.appendChild(introBox);
    container.appendChild(outroBox);
    container.appendChild(tableBox);
    container.appendChild(saveBtn);
    container.appendChild(mixBtn);
    container.appendChild(copyBtn);
    container.appendChild(resultBox);
    document.body.appendChild(container);

    // Toggle interface
    toggleBtn.onclick = () => {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
        loadSaved();
    };
})();