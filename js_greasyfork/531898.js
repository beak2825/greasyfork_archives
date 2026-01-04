// ==UserScript==
// @name         Reve.art Deleter
// @namespace    https://greasyfork.org/en/users/781396-yad
// @version      1.0
// @description  Auto art deleter for reve.art
// @author       YAD
// @match        https://preview.reve.art/app
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531898/Reveart%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/531898/Reveart%20Deleter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        clickDelay: 1000,
        retryAttempts: 3,
        retryDelay: 500,
        uiWidth: '280px',
        collapsedWidth: '40px',
        toggleBtnSize: '20px'
    };

    GM_addStyle(`
        #reve-art-deleter-ui {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            background: #1e1e2d;
            border: 1px solid #2d2d3d;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            color: #e0e0e0;
            font-family: Arial, sans-serif;
            width: ${CONFIG.uiWidth};
            transition: all 0.3s ease;
            overflow: hidden;
        }
        #reve-art-deleter-ui.collapsed {
            width: ${CONFIG.collapsedWidth};
            height: ${CONFIG.collapsedWidth};
        }
        #reve-art-deleter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background: #2d2d3d;
            cursor: pointer;
        }
        #reve-art-deleter-title {
            font-size: 14px;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #reve-art-deleter-toggle {
            width: ${CONFIG.toggleBtnSize};
            height: ${CONFIG.toggleBtnSize};
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            flex-shrink: 0;
        }
        #reve-art-deleter-ui.collapsed #reve-art-deleter-title,
        #reve-art-deleter-ui.collapsed #reve-art-deleter-content {
            display: none;
        }
        #reve-art-deleter-content {
            padding: 10px;
        }
        .reve-art-control-row {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px;
            align-items: center;
            margin-bottom: 8px;
        }
        .reve-art-label {
            font-size: 12px;
            white-space: nowrap;
        }
        .reve-art-input {
            padding: 4px;
            background: #2d2d3d;
            border: 1px solid #3d3d4d;
            color: #fff;
            border-radius: 3px;
            width: 100%;
        }
        .reve-art-button-group {
            display: flex;
            gap: 8px;
            margin: 8px 0;
        }
        .reve-art-button {
            padding: 6px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
            color: #fff;
        }
        #reve-art-scan-btn { background: #3d3d4d; }
        #reve-art-delete-btn { background: #dc3545; font-weight: bold; }
        #reve-art-stop-btn {
            background: #ff9500;
            font-weight: bold;
            display: none;
        }
        #reve-art-stop-btn.active { display: block; }
        #reve-art-grid-info {
            font-size: 11px;
            color: #aaa;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        #reve-art-status {
            font-size: 11px;
            color: #aaa;
            max-height: 120px;
            overflow-y: auto;
            background: #2d2d3d;
            padding: 6px;
            border-radius: 3px;
            white-space: pre-wrap;
        }
        .grid-cell { position: relative !important; }
        .index-label {
            position: absolute;
            top: 2px;
            left: 2px;
            color: #fff;
            background: rgba(0,0,0,0.7);
            padding: 1px 4px;
            font-size: 10px;
            border-radius: 2px;
            z-index: 1000;
        }
    `);

    const ui = document.createElement('div');
    ui.id = 'reve-art-deleter-ui';
    ui.innerHTML = `
        <div id="reve-art-deleter-header">
            <div id="reve-art-deleter-title">REVE ART Deleter</div>
            <button id="reve-art-deleter-toggle">≡</button>
        </div>
        <div id="reve-art-deleter-content">
            <div class="reve-art-control-row">
                <label class="reve-art-label" for="reve-art-start-index">From:</label>
                <input class="reve-art-input" type="number" id="reve-art-start-index" min="0" value="0">
            </div>
            <div class="reve-art-control-row">
                <label class="reve-art-label" for="reve-art-end-index">To:</label>
                <input class="reve-art-input" type="number" id="reve-art-end-index" min="0" value="4">
            </div>
            <div class="reve-art-control-row">
                <label class="reve-art-label" for="reve-art-delay">Delay:</label>
                <input class="reve-art-input" type="number" id="reve-art-delay" min="500" value="${CONFIG.clickDelay}">
            </div>
            <div class="reve-art-control-row">
                <label class="reve-art-label" for="reve-art-skip-indexes">Skip:</label>
                <input class="reve-art-input" type="text" id="reve-art-skip-indexes" placeholder="e.g. 2,5,7">
            </div>
            <div class="reve-art-button-group">
                <button id="reve-art-scan-btn" class="reve-art-button">Scan</button>
                <button id="reve-art-delete-btn" class="reve-art-button">Delete</button>
                <button id="reve-art-stop-btn" class="reve-art-button">Stop</button>
            </div>
            <div id="reve-art-grid-info">No scan performed</div>
            <div id="reve-art-status">Ready</div>
        </div>
    `;
    document.body.appendChild(ui);

    const toggleBtn = document.getElementById('reve-art-deleter-toggle');
    toggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        ui.classList.toggle('collapsed');
        toggleBtn.textContent = ui.classList.contains('collapsed') ? '≡' : '×';
    });

    const header = document.getElementById('reve-art-deleter-header');
    header.addEventListener('mousedown', e => {
        e.preventDefault();
        if (e.target.id !== 'reve-art-deleter-header') return;

        const startX = e.clientX, startY = e.clientY;
        const startLeft = ui.offsetLeft, startTop = ui.offsetTop;

        const moveHandler = e => {
            ui.style.left = `${startLeft + e.clientX - startX}px`;
            ui.style.top = `${startTop + e.clientY - startY}px`;
            ui.style.right = ui.style.bottom = 'auto';
        };

        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function findElement(selector, root = document, attempts = CONFIG.retryAttempts) {
        for (let i = 0; i < attempts; i++) {
            const element = root.querySelector(selector);
            if (element) return element;

            for (const el of root.querySelectorAll('*')) {
                if (el.shadowRoot) {
                    const shadowElement = await findElement(selector, el.shadowRoot, 1);
                    if (shadowElement) return shadowElement;
                }
            }
            if (i < attempts - 1) await wait(CONFIG.retryDelay);
        }
        return null;
    }

    async function getGridCells() {
        const cells = [];
        const gridCells = await findElement('.grid');
        if (!gridCells) return cells;

        gridCells.querySelectorAll('.grid-cell').forEach((cell, index) => {
            const link = cell.querySelector('a.aspect-ratio-container');
            if (link) cells.push({ element: cell, link, index: cell.dataset.index || index });
        });
        return cells;
    }

    function addIndexLabels(cells) {
        cells.forEach(cell => {
            const existingLabel = cell.element.querySelector('.index-label');
            if (existingLabel) existingLabel.remove();

            const label = document.createElement('div');
            label.className = 'index-label';
            label.textContent = cell.index;
            label.style.cssText = 'position:absolute;top:2px;left:2px;color:#fff;background:rgba(0,0,0,0.7);padding:1px 4px;font-size:10px;border-radius:2px;z-index:1000';
            cell.element.style.position = 'relative';
            cell.element.appendChild(label);
        });
    }

    async function clickElement(element, description) {
        if (!element) {
            appendStatus(`❌ ${description} not found`);
            return false;
        }

        try {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await wait(300);
            element.click();
            await wait(300);

            if (description.includes('Grid cell') && !element.classList.contains('selected')) {
                throw new Error('Not selected after click');
            }
            appendStatus(`✓ ${description}`);
            return true;
        } catch (error) {
            try {
                const rect = element.getBoundingClientRect();
                element.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.left + rect.width/2,
                    clientY: rect.top + rect.height/2
                }));
                await wait(300);
                appendStatus(`✓ ${description} (simulated)`);
                return true;
            } catch (e) {
                appendStatus(`❌ Failed ${description}: ${e.message}`);
                return false;
            }
        }
    }

    const appendStatus = text => {
        const statusEl = document.getElementById('reve-art-status');
        statusEl.textContent += (statusEl.textContent ? '\n' : '') + text;
        statusEl.scrollTop = statusEl.scrollHeight;
    };

    const clearStatus = () => document.getElementById('reve-art-status').textContent = '';

    async function updateGridInfo() {
        const cells = await getGridCells();
        const infoEl = document.getElementById('reve-art-grid-info');

        if (!cells.length) {
            infoEl.textContent = 'No grid cells found';
            infoEl.style.color = '#ff6b6b';
            return;
        }

        addIndexLabels(cells);
        const indexes = cells.map(cell => cell.index);
        infoEl.innerHTML = `${cells.length} items (${Math.min(...indexes)}-${Math.max(...indexes)})<br>Next: ${indexes.slice(0, 3).join(', ')}${indexes.length > 3 ? '...' : ''}`;
        infoEl.style.color = '#aaa';
    }

    const parseSkipIndexes = input => input ? new Set(input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num))) : new Set();

    let shouldStop = false;
    async function deleteRange(start, end, delay, skipIndexes) {
        clearStatus();
        appendStatus(`Deleting ${start} to ${end}...`);
        
        const stopBtn = document.getElementById('reve-art-stop-btn');
        const deleteBtn = document.getElementById('reve-art-delete-btn');
        stopBtn.classList.add('active');
        deleteBtn.disabled = true;
        shouldStop = false;

        const cells = await getGridCells();
        const targetCells = cells.filter(cell => {
            const idx = parseInt(cell.index);
            return !isNaN(idx) && idx >= start && idx <= end && !skipIndexes.has(idx);
        });

        appendStatus(`Found ${cells.length} items`);
        appendStatus(`Processing ${targetCells.length} in range`);
        if (skipIndexes.size) appendStatus(`Skipping: ${Array.from(skipIndexes).join(', ')}`);

        let successCount = 0;
        for (const cell of targetCells) {
            if (shouldStop) {
                appendStatus('🛑 Stopped by user');
                break;
            }

            appendStatus(`--- ${cell.index} ---`);
            try {
                if (!(await clickElement(cell.link, `Select ${cell.index}`) &&
                      await clickElement(await findElement('rv-icon-button sl-icon[name="trash"]'), 'Trash') &&
                      await clickElement(await findElement('sl-button[variant="danger"]'), 'Confirm'))) {
                    throw new Error('Click sequence failed');
                }
                successCount++;
                appendStatus(`✅ Deleted ${cell.index}`);
                await wait(delay);
            } catch (error) {
                appendStatus(`❌ Error: ${error.message}`);
            }
        }

        appendStatus(`\nCompleted: ${successCount}/${targetCells.length}`);
        stopBtn.classList.remove('active');
        deleteBtn.disabled = false;
        updateGridInfo();
    }

    document.getElementById('reve-art-scan-btn').addEventListener('click', updateGridInfo);
    document.getElementById('reve-art-delete-btn').addEventListener('click', () => {
        const start = parseInt(document.getElementById('reve-art-start-index').value);
        const end = parseInt(document.getElementById('reve-art-end-index').value);
        const delay = parseInt(document.getElementById('reve-art-delay').value);
        const skipIndexes = parseSkipIndexes(document.getElementById('reve-art-skip-indexes').value);

        if (start > end) {
            appendStatus('Error: Start must be ≤ end');
            return;
        }
        deleteRange(start, end, delay, skipIndexes);
    });

    document.getElementById('reve-art-stop-btn').addEventListener('click', () => {
        shouldStop = true;
        appendStatus('Stopping after current operation...');
    });

    updateGridInfo();
})();