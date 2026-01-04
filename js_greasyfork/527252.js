// ==UserScript==
// @name         SugarCube Game Cheat Panel
// @version      1.1
// @description  Edit variables in SugarCube games easily via a draggable, collapsible UI with dynamic suggestions and auto-populated values.
// @author       skydk
// @match        *://*/*
// @grant        none
// @license      Apache 2.0
// @namespace https://greasyfork.org/users/1436204
// @downloadURL https://update.greasyfork.org/scripts/527252/SugarCube%20Game%20Cheat%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/527252/SugarCube%20Game%20Cheat%20Panel.meta.js
// ==/UserScript==

/* global SugarCube */

(function() {
    'use strict';

    function checkSugarCube() {
        return typeof SugarCube !== 'undefined' &&
               SugarCube.version &&
               typeof SugarCube.version.build !== 'undefined' &&
               Number(SugarCube.version.build) > 500 &&
               typeof SugarCube.State !== 'undefined' &&
               typeof SugarCube.State.variables !== 'undefined';
    }

    function setVariable(varName, value) {
        if (checkSugarCube()) {
            SugarCube.State.variables[varName] = value;
        } else {
            alert("SugarCube not detected or incompatible version!");
        }
    }

    function updateSuggestions() {
        const dataList = document.getElementById('varSuggestions');
        if (!dataList) return;
        // Clear existing options
        dataList.innerHTML = '';
        if (checkSugarCube()) {
            Object.keys(SugarCube.State.variables).forEach(key => {
                const option = document.createElement('option');
                option.value = key;
                dataList.appendChild(option);
            });
        }
    }

    function createUI() {
        let panel = document.createElement('div');
        panel.id = 'sugarcube-cheat-panel';
        panel.innerHTML = `
            <div id="scp-header">
                <span>SugarCube Cheat Panel</span>
                <span id="scp-toggle">–</span>
            </div>
            <div id="scp-content">
                <div class="scp-field">
                    <label for="varName">Variable:</label>
                    <input type="text" id="varName" placeholder="Enter variable" list="varSuggestions">
                    <datalist id="varSuggestions"></datalist>
                </div>
                <div class="scp-field">
                    <label for="varValue">Value:</label>
                    <input type="text" id="varValue" placeholder="Enter value">
                </div>
                <button id="setVar">Set Variable</button>
            </div>
        `;
        document.body.appendChild(panel);

        makeDraggable(panel, document.getElementById('scp-header'));

        document.getElementById('scp-toggle').addEventListener('click', function(e) {
            e.stopPropagation();
            let content = document.getElementById('scp-content');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                this.textContent = '–';
            } else {
                content.style.display = 'none';
                this.textContent = '+';
            }
        });

        const varNameInput = document.getElementById('varName');
        varNameInput.addEventListener('focus', updateSuggestions);

        varNameInput.addEventListener('change', function() {
            let varName = this.value;
            const varValueInput = document.getElementById('varValue');
            if (checkSugarCube() && SugarCube.State.variables.hasOwnProperty(varName)) {
                varValueInput.value = SugarCube.State.variables[varName];
            } else {
                varValueInput.value = '';
            }
        });

        document.getElementById("setVar").addEventListener("click", function() {
            let varName = document.getElementById("varName").value;
            let varValue = document.getElementById("varValue").value;
            setVariable(varName, isNaN(varValue) ? varValue : Number(varValue));
        });
    }

    function makeDraggable(el, handle) {
        handle.style.cursor = 'move';
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        handle.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            el.style.top = (el.offsetTop - posY) + "px";
            el.style.left = (el.offsetLeft - posX) + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    }

    function addCustomCSS() {
        const css = `
            #sugarcube-cheat-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #2e2e2e;
                color: #e0e0e0;
                border: 1px solid #444;
                border-radius: 8px;
                z-index: 10000;
                width: 310px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                font-family: Arial, sans-serif;
            }
            #scp-header {
                padding: 10px;
                background: #3a3a3a;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }
            #scp-content {
                padding: 10px;
            }
            .scp-field {
                margin-bottom: 10px;
            }
            .scp-field label {
                display: block;
                margin-bottom: 4px;
                font-size: 0.9em;
            }
            .scp-field input {
                padding: 6px;
                border: 1px solid #555;
                border-radius: 4px;
                background: #444;
                color: #e0e0e0;
                box-sizing: border-box;
            }
            #setVar {
                width: 100%;
                padding: 8px;
                border: none;
                border-radius: 4px;
                background: #5a5a5a;
                color: #e0e0e0;
                cursor: pointer;
                font-size: 1em;
            }
            #setVar:hover {
                background: #6a6a6a;
            }
            #scp-toggle {
                cursor: pointer;
                padding: 5px 10px;
                display: inline-block;
                text-align: center;
                font-size: 1.2em;
                user-select: none;
            }
            #scp-toggle:hover {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
        `;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    setTimeout(function() {
        if (checkSugarCube()) {
            addCustomCSS();
            createUI();
        } else {
            console.log("SugarCube not detected or incompatible version. Cheat panel will not be loaded.");
        }
    }, 3000);

})();