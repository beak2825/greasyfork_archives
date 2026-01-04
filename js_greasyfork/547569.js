// ==UserScript==
// @name         LuaFork Injector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Best Web Editing Injector for tampermonkey Join dc For Updates
// @author       absayno
// @license MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/547569/LuaFork%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/547569/LuaFork%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // stored scripts do not touch buddy
    let scripts = GM_getValue('scripts', {});
    if (Object.keys(scripts).length === 0) {
        scripts = {
            'Default Script': {
                name: 'Default Script',
                code: '// Sample JavaScript\nconsole.log("Hello from Lua Studios!");\n',
                type: 'javascript'
            }
        };
        GM_setValue('scripts', scripts);
    }

    // draggable
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.backgroundColor = '#1a1a1a';
    menu.style.color = '#fff';
    menu.style.padding = '10px';
    menu.style.border = '2px solid #ff4500';
    menu.style.borderRadius = '5px';
    menu.style.zIndex = '9999';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    menu.style.maxWidth = '300px';
    menu.style.cursor = 'move'; // Indicate dragability
    menu.style.userSelect = 'none'; // Prevent text selection during drag

    // Menu HTML structure Dont fiddle with this
    menu.innerHTML = `
        <h3 style="margin: 0 0 10px; font-size: 16px;">Luafork Injector</h3>
        <h3 style="margin: 0 0 5px; font-size: 11px;">Made By absayno</h3>
        <select id="scriptSelect" style="width: 100%; margin-bottom: 10px; padding: 5px;">
            ${Object.keys(scripts).map(name => `<option value="${name}">${name}</option>`).join('')}
        </select>
        <textarea id="codeInput" rows="5" style="width: 100%; background: #333; color: #fff; border: 1px solid #ff4500; margin-bottom: 10px;"></textarea>
        <div style="margin-bottom: 10px;">
            <label>Type: </label>
            <select id="scriptType" style="padding: 5px;">
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
            </select>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
            <button id="runBtn" style="padding: 5px; background: #ff4500; border: none; color: #fff; cursor: pointer;">Run</button>
            <button id="saveBtn" style="padding: 5px; background: #1e90ff; border: none; color: #fff; cursor: pointer;">Save</button>
            <button id="newBtn" style="padding: 5px; background: #32cd32; border: none; color: #fff; cursor: pointer;">New</button>
            <button id="renameBtn" style="padding: 5px; background: #ffa500; border: none; color: #fff; cursor: pointer;">Rename</button>
            <button id="deleteBtn" style="padding: 5px; background: #dc143c; border: none; color: #fff; cursor: pointer;">Delete</button>
            <button id="deleteBtn" style="padding: 5px; background: #dc247c; border: none; color: #fff; cursor: pointer;">.gg/cYy7KaRxwF</button>
        </div>
    `;

    document.body.appendChild(menu);

    // DOM elements do not touch this eather
    const scriptSelect = document.getElementById('scriptSelect');
    const codeInput = document.getElementById('codeInput');
    const scriptType = document.getElementById('scriptType');
    const runBtn = document.getElementById('runBtn');
    const saveBtn = document.getElementById('saveBtn');
    const newBtn = document.getElementById('newBtn');
    const renameBtn = document.getElementById('renameBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    // drag function new
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX, initialY;

    menu.addEventListener('mousedown', (e) => {
        // Only start dragging if the target is not an input or button
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            isDragging = true;
            menu.style.cursor = 'grabbing'; // Change cursor during drag
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            //
            const menuRect = menu.getBoundingClientRect();
            const maxX = window.innerWidth - menuRect.width;
            const maxY = window.innerHeight - menuRect.height;

            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            menu.style.left = currentX + 'px';
            menu.style.top = currentY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        menu.style.cursor = 'move'; // Reset cursor
    });

    //
    function loadScript() {
        const selectedName = scriptSelect.value;
        codeInput.value = scripts[selectedName].code;
        scriptType.value = scripts[selectedName].type;
    }
    loadScript();
    scriptSelect.addEventListener('change', loadScript);

    // BtnRun
    runBtn.addEventListener('click', () => {
        const code = codeInput.value;
        const type = scriptType.value;

        if (type === 'javascript') {
            try {
                eval(code); // JavaXecute
                console.log('Script executed successfully');
            } catch (e) {
                alert('Error executing JavaScript: ' + e.message);
            }
        } else if (type === 'html') {
            const container = document.createElement('div');
            container.innerHTML = code;
            document.body.appendChild(container);
            console.log('HTML injected successfully');
        }
    });

    // SaveIt
    saveBtn.addEventListener('click', () => {
        const selectedName = scriptSelect.value;
        scripts[selectedName] = {
            name: selectedName,
            code: codeInput.value,
            type: scriptType.value
        };
        GM_setValue('scripts', scripts);
        alert('Script saved!');
    });

    // Create
    newBtn.addEventListener('click', () => {
        const newName = prompt('Enter new script name:');
        if (newName && !scripts[newName]) {
            scripts[newName] = {
                name: newName,
                code: '// New script\nconsole.log("New script ready!");',
                type: 'javascript'
            };
            GM_setValue('scripts', scripts);
            const option = document.createElement('option');
            option.value = newName;
            option.textContent = newName;
            scriptSelect.appendChild(option);
            scriptSelect.value = newName;
            loadScript();
            alert('New script created!');
        } else if (scripts[newName]) {
            alert('Script name already exists!');
        }
    });

    // RenameIt
    renameBtn.addEventListener('click', () => {
        const oldName = scriptSelect.value;
        const newName = prompt('Enter new name for script:', oldName);
        if (newName && newName !== oldName && !scripts[newName]) {
            scripts[newName] = scripts[oldName];
            scripts[newName].name = newName;
            delete scripts[oldName];
            GM_setValue('scripts', scripts);
            scriptSelect.innerHTML = Object.keys(scripts).map(name => `<option value="${name}">${name}</option>`).join('');
            scriptSelect.value = newName;
            loadScript();
            alert('Script renamed!');
        } else if (scripts[newName]) {
            alert('Name already exists!');
        }
    });

    // DeleteIt
    deleteBtn.addEventListener('click', () => {
        const selectedName = scriptSelect.value;
        if (confirm(`Delete script "${selectedName}"?`)) {
            delete scripts[selectedName];
            GM_setValue('scripts', scripts);
            scriptSelect.innerHTML = Object.keys(scripts).map(name => `<option value="${name}">${name}</option>`).join('');
            if (Object.keys(scripts).length > 0) {
                scriptSelect.value = Object.keys(scripts)[0];
                loadScript();
            } else {
                scripts['Default Script'] = {
                    name: 'Default Script',
                    code: '// Sample JavaScript\nconsole.log("Hello from Rebel Injector!");\n',
                    type: 'javascript'
                };
                GM_setValue('scripts', scripts);
                scriptSelect.innerHTML = '<option value="Default Script">Default Script</option>';
                loadScript();
            }
            alert('Script deleted!');
        }
    });
})();