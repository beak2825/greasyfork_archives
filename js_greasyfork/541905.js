// ==UserScript==
// @name         Forum HTML Combiner - Heart
// @namespace    HeartScripts
// @version      1.5
// @description  Combines intro, table, outro for Torn forum threads
// @author       Heart [3034011]
// @match        https://www.torn.com/forums.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541905/Forum%20HTML%20Combiner%20-%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/541905/Forum%20HTML%20Combiner%20-%20Heart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create main interface
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '9999';
    container.style.background = '#1e1e1e';
    container.style.color = 'white';
    container.style.padding = '15px';
    container.style.borderRadius = '10px';
    container.style.width = '90vw';
    container.style.maxWidth = '500px';
    container.style.display = 'none';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.boxShadow = '0 0 20px rgba(0,0,0,0.8)';
    container.style.fontSize = '14px';
    container.style.maxHeight = '90vh';
    container.style.overflowY = 'auto';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '0 8px';

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
        box.style.minHeight = '60px';
        box.style.background = '#2c2c2c';
        box.style.color = 'white';
        box.style.border = '1px solid #555';
        box.style.padding = '8px';
        box.style.borderRadius = '5px';
        box.style.fontFamily = 'monospace';
        box.style.resize = 'vertical';
        box.style.boxSizing = 'border-box';
    });

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.gap = '5px';
    buttonsContainer.style.marginTop = '5px';

    // Buttons
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Save';
    const mixBtn = document.createElement('button');
    mixBtn.textContent = '🔀 Mix';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';

    [saveBtn, mixBtn, copyBtn].forEach(btn => {
        btn.style.padding = '8px 12px';
        btn.style.flex = '1';
        btn.style.background = '#333';
        btn.style.color = 'white';
        btn.style.border = '1px solid #777';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
    });

    // Create trigger button
    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = '📝 HTML COMBINER';
    triggerBtn.style.position = 'fixed';
    triggerBtn.style.bottom = '40px';
    triggerBtn.style.right = '20px';
    triggerBtn.style.zIndex = '9998';
    triggerBtn.style.background = '#4CAF50';
    triggerBtn.style.color = 'white';
    triggerBtn.style.border = 'none';
    triggerBtn.style.padding = '10px 15px';
    triggerBtn.style.borderRadius = '5px';
    triggerBtn.style.fontSize = '14px';
    triggerBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    triggerBtn.style.cursor = 'pointer';

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

    // Close button
    closeBtn.onclick = () => {
        container.style.display = 'none';
    };

    // Trigger button
    triggerBtn.onclick = () => {
        container.style.display = 'flex';
        loadSaved();
    };

    // Add elements
    container.appendChild(closeBtn);
    container.appendChild(introBox);
    container.appendChild(outroBox);
    container.appendChild(tableBox);
    buttonsContainer.appendChild(saveBtn);
    buttonsContainer.appendChild(mixBtn);
    buttonsContainer.appendChild(copyBtn);
    container.appendChild(buttonsContainer);
    container.appendChild(resultBox);
    document.body.appendChild(container);
    document.body.appendChild(triggerBtn);

    // Handle mobile keyboard
    const handleFocus = (e) => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                container.scrollTop = e.target.offsetTop - 100;
            }, 300);
        }
    };

    // Add focus event listeners
    [introBox, outroBox, tableBox, resultBox].forEach(box => {
        box.addEventListener('focus', handleFocus);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (container.style.display !== 'none' && 
            !container.contains(e.target) && 
            e.target !== triggerBtn) {
            container.style.display = 'none';
        }
    });
})();