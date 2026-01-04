// ==UserScript==
// @name         Island Vault Tracker - Torn Dark Mode - Public (Local Storage Only)
// @namespace    http://torn.com/
// @version      1.1
// @description  Manual Island Vault tracker styled for Torn's dark UI with draggable, resizable UI, comma input support, and individual resets.
// @author       lR3TR0l [3646989]
// @match        https://www.torn.com/properties.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540345/Island%20Vault%20Tracker%20-%20Torn%20Dark%20Mode%20-%20Public%20%28Local%20Storage%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540345/Island%20Vault%20Tracker%20-%20Torn%20Dark%20Mode%20-%20Public%20%28Local%20Storage%20Only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const personA = 'INSERT_NAME_A';
    const personB = 'INSERT_NAME_B';

    const defaultBalances = { [personA]: 0, [personB]: 0 };
    let storedBalances = JSON.parse(localStorage.getItem('islandVaultBalances')) || { ...defaultBalances };

    const saveBalances = () => {
        localStorage.setItem('islandVaultBalances', JSON.stringify(storedBalances));
        updateUI();
    };

    const formatMoney = (amount) =>
        (amount < 0 ? '-$' : '$') + Math.abs(amount).toLocaleString();

    const adjustBalance = (person, amount) => {
        storedBalances[person] = (storedBalances[person] || 0) + amount;
        saveBalances();
    };

    const resetPerson = (person) => {
        storedBalances[person] = 0;
        saveBalances();
    };

    const createAdjustButton = (person, amount) => {
        const btn = document.createElement('button');
        const sign = amount > 0 ? '+' : '';
        const millionAmount = amount / 1_000_000;
        btn.innerText = `${sign}${millionAmount}M`;
        Object.assign(btn.style, {
            margin: '2px',
            padding: '3px 7px',
            cursor: 'pointer',
            color: amount > 0 ? '#a4ffa4' : '#ff9999',
            backgroundColor: '#2b2d2f',
            border: '1px solid #444',
            borderRadius: '4px',
            fontSize: '12px'
        });
        btn.onclick = () => adjustBalance(person, amount);
        return btn;
    };

    // Main tracker box
    const box = document.createElement('div');
    box.id = 'island-vault-tracker';
    Object.assign(box.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        backgroundColor: '#1e1f21',
        color: '#f0f0f0',
        padding: '15px',
        border: '1px solid #444',
        borderRadius: '8px',
        zIndex: '9999',
        fontFamily: 'Verdana, sans-serif',
        fontSize: '13px',
        minWidth: '220px',
        minHeight: '150px',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflow: 'auto',
        userSelect: 'none',
        boxSizing: 'border-box',
        right: '20px'
    });

    // Restore position & size from localStorage
    const savedTop = localStorage.getItem('vaultBoxTop');
    const savedLeft = localStorage.getItem('vaultBoxLeft');
    const savedWidth = localStorage.getItem('vaultBoxWidth');
    const savedHeight = localStorage.getItem('vaultBoxHeight');
    if (savedTop && savedLeft) {
        box.style.top = savedTop;
        box.style.left = savedLeft;
        box.style.right = 'auto';
    }
    if (savedWidth) box.style.width = savedWidth;
    if (savedHeight) box.style.height = savedHeight;

    document.body.appendChild(box);

    // Create the resizer handle
    const resizer = document.createElement('div');
    Object.assign(resizer.style, {
        width: '15px',
        height: '15px',
        background: 'transparent',
        position: 'absolute',
        right: '5px',
        bottom: '5px',
        cursor: 'se-resize',
        zIndex: '10000',
    });
    box.appendChild(resizer);

    // Update UI content function
    function updateUI() {
        // Clear all except the resizer
        box.querySelectorAll(':not(div:last-child)').forEach(el => el !== resizer && el.remove());

        const title = document.createElement('div');
        title.style.cssText = 'font-weight:bold;font-size:15px;margin-bottom:10px;cursor:move;color:#f0f0f0;';
        title.textContent = '🏝️ Island Vault Tracker';
        box.insertBefore(title, resizer);

        [personA, personB].forEach(person => {
            const personDiv = document.createElement('div');
            personDiv.style.marginTop = '10px';
            personDiv.innerHTML = `<strong>${person}:</strong> <span style="color:${storedBalances[person] >= 0 ? '#a4ffa4' : '#ff9999'};">${formatMoney(storedBalances[person])}</span>`;
            box.insertBefore(personDiv, resizer);

            const buttonsDiv = document.createElement('div');
            [1, 5, 10].forEach(m => buttonsDiv.appendChild(createAdjustButton(person, m * 1_000_000)));
            [1, 5, 10].forEach(m => buttonsDiv.appendChild(createAdjustButton(person, -m * 1_000_000)));
            box.insertBefore(buttonsDiv, resizer);
        });

        const customDiv = document.createElement('div');
        customDiv.style.marginTop = '15px';
        customDiv.style.textAlign = 'center';

        const amountInput = document.createElement('input');
        Object.assign(amountInput, {
            type: 'text',
            placeholder: 'Amount (e.g. 1,000,000)',
        });
        Object.assign(amountInput.style, {
            width: '160px',
            marginBottom: '6px',
            backgroundColor: '#2b2d2f',
            color: '#f0f0f0',
            border: '1px solid #444',
            padding: '4px',
            borderRadius: '4px'
        });

        const personSelect = document.createElement('select');
        [personA, personB].forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            personSelect.appendChild(option);
        });
        Object.assign(personSelect.style, {
            marginBottom: '6px',
            backgroundColor: '#2b2d2f',
            color: '#f0f0f0',
            border: '1px solid #444',
            padding: '3px',
            borderRadius: '4px'
        });

        const makeButton = (label, color, callback) => {
            const btn = document.createElement('button');
            btn.innerHTML = label;
            Object.assign(btn.style, {
                margin: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                border: `1px solid ${color}`,
                color: '#f0f0f0',
                backgroundColor: '#2b2d2f',
                borderRadius: '4px',
                fontWeight: 'bold'
            });
            btn.onclick = callback;
            return btn;
        };

        const addBtn = makeButton('➕ Add', 'limegreen', () => {
            const val = parseFloat(amountInput.value.replace(/,/g, ''));
            if (isNaN(val) || val <= 0) return alert('Enter a valid positive number!');
            adjustBalance(personSelect.value, val);
            amountInput.value = '';
        });

        const subtractBtn = makeButton('➖ Subtract', 'tomato', () => {
            const val = parseFloat(amountInput.value.replace(/,/g, ''));
            if (isNaN(val) || val <= 0) return alert('Enter a valid positive number!');
            adjustBalance(personSelect.value, -val);
            amountInput.value = '';
        });

        customDiv.appendChild(amountInput);
        customDiv.appendChild(document.createElement('br'));
        customDiv.appendChild(personSelect);
        customDiv.appendChild(document.createElement('br'));
        customDiv.appendChild(addBtn);
        customDiv.appendChild(subtractBtn);
        box.insertBefore(customDiv, resizer);

        const resetDiv = document.createElement('div');
        resetDiv.style.marginTop = '12px';
        resetDiv.style.textAlign = 'center';

        [personA, personB].forEach(person => {
            const resetBtn = makeButton(`Reset ${person}`, '#999', () => {
                if (confirm(`Reset ${person}'s balance to $0?`)) resetPerson(person);
            });
            resetDiv.appendChild(resetBtn);
        });

        box.insertBefore(resetDiv, resizer);

        const fallbackBtn = makeButton('🔄 Reset UI', '#888', () => {
            localStorage.removeItem('vaultBoxTop');
            localStorage.removeItem('vaultBoxLeft');
            localStorage.removeItem('vaultBoxWidth');
            localStorage.removeItem('vaultBoxHeight');
            location.reload();
        });

        box.insertBefore(fallbackBtn, resizer);

        const creditLine = document.createElement('div');
        creditLine.textContent = 'Created by lR3TR0l';
        creditLine.style.cssText = 'margin-top:10px;font-size:11px;text-align:center;color:#777;';
        box.insertBefore(creditLine, resizer);
    }

    // Dragging & saving
    (() => {
        let isDragging = false, offsetX = 0, offsetY = 0;

        box.addEventListener('mousedown', function (e) {
            if (e.target === resizer) return; // don't drag when resizing
            if (['button', 'input', 'select'].includes(e.target.tagName.toLowerCase())) return;
            isDragging = true;
            offsetX = e.clientX - box.offsetLeft;
            offsetY = e.clientY - box.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            // Clamp within window bounds
            newLeft = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, newTop));
            box.style.left = `${newLeft}px`;
            box.style.top = `${newTop}px`;
            box.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                localStorage.setItem('vaultBoxTop', box.style.top);
                localStorage.setItem('vaultBoxLeft', box.style.left);
            }
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // Touch support for dragging
box.addEventListener('touchstart', function (e) {
    if (e.target === resizer || ['button', 'input', 'select'].includes(e.target.tagName.toLowerCase())) return;
    isDragging = true;
    offsetX = e.touches[0].clientX - box.offsetLeft;
    offsetY = e.touches[0].clientY - box.offsetTop;
    document.body.style.userSelect = 'none';
}, { passive: false });

document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    let newLeft = e.touches[0].clientX - offsetX;
    let newTop = e.touches[0].clientY - offsetY;
    newLeft = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, newTop));
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;
    box.style.right = 'auto';
}, { passive: false });

document.addEventListener('touchend', () => {
    if (isDragging) {
        localStorage.setItem('vaultBoxTop', box.style.top);
        localStorage.setItem('vaultBoxLeft', box.style.left);
    }
    isDragging = false;
    document.body.style.userSelect = '';
});

    })();

    // Resizing logic with mouse and touch
    (() => {
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        const onPointerDown = (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;
            startWidth = box.offsetWidth;
            startHeight = box.offsetHeight;
            document.body.style.userSelect = 'none';
        };

        const onPointerMove = (e) => {
            if (!isResizing) return;
            const currentX = e.clientX || (e.touches && e.touches[0].clientX);
            const currentY = e.clientY || (e.touches && e.touches[0].clientY);
            if (currentX === undefined || currentY === undefined) return;

            let newWidth = startWidth + (currentX - startX);
            let newHeight = startHeight + (currentY - startY);

            // Clamp size within min/max limits
            newWidth = Math.max(220, Math.min(400, newWidth));
            newHeight = Math.max(150, Math.min(window.innerHeight * 0.9, newHeight));

            box.style.width = `${newWidth}px`;
            box.style.height = `${newHeight}px`;
        };

        const onPointerUp = () => {
            if (isResizing) {
                localStorage.setItem('vaultBoxWidth', box.style.width);
                localStorage.setItem('vaultBoxHeight', box.style.height);
            }
            isResizing = false;
            document.body.style.userSelect = '';
        };

        resizer.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);

        // Touch support
        resizer.addEventListener('touchstart', onPointerDown);
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('touchend', onPointerUp);
        document.addEventListener('touchcancel', onPointerUp);
    })();

    updateUI();
    console.log('Island Vault Tracker loaded – script by lR3TR0l 💼');
})();
