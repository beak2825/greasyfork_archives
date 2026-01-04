// ==UserScript==
// @name        Oculus WebExcutor (prototype)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create an accurate GUI replica with draggable features and dynamic buttons
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506512/Oculus%20WebExcutor%20%28prototype%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506512/Oculus%20WebExcutor%20%28prototype%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the GUI
    GM_addStyle(`
        #custom-gui {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 400px;
            background-color: #f0f0f0;
            border: 1px solid #dcdcdc;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border-radius: 15px;
            z-index: 9999;
            display: none;
            transform: translateX(-100%);
            transition: transform 0.5s ease, box-shadow 0.3s ease;
        }
        #custom-gui.show {
            transform: translateX(0);
        }
        #header {
            background-color: #333333;
            color: #ffffff;
            padding: 10px;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #header .btn {
            background-color: #ff0000;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
        #header .btn.open {
            background-color: #00ff00;
        }
        #content {
            padding: 10px;
        }
        #text-box {
            width: calc(100% - 22px);
            height: 30px;
            border: 1px solid #BFBFBF;
            border-radius: 5px;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
        }
        #inject-btn {
            background-color: #00ff00;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            margin-right: 10px;
        }
        #inject-btn.red {
            background-color: #ff0000;
        }
        #clear-btn {
            background-color: #0000ff;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
        #execute-btn {
            background-color: #00ffff;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
        #loading-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 5px;
            background-color: #cccccc;
            z-index: 9998;
            transition: width 4s ease;
        }
    `);

    // Create GUI elements
    const gui = document.createElement('div');
    gui.id = 'custom-gui';
    gui.innerHTML = `
        <div id="header">
            <span>Custom GUI</span>
            <button class="btn open" id="toggle-btn">Open</button>
        </div>
        <div id="content">
            <input type="text" id="text-box" placeholder="Injection text here">
            <button id="inject-btn" class="btn">Inject</button>
            <button id="clear-btn" class="btn">Clear</button>
            <button id="execute-btn" class="btn">Execute</button>
        </div>
    `;
    document.body.appendChild(gui);

    // Create loading bar
    const loadingBar = document.createElement('div');
    loadingBar.id = 'loading-bar';
    document.body.appendChild(loadingBar);

    // Initialize draggable functionality
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const header = document.getElementById('header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            gui.style.left = `${e.clientX - offsetX}px`;
            gui.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Loading bar animation
    setTimeout(() => {
        loadingBar.style.width = '100%';
        setTimeout(() => {
            loadingBar.style.display = 'none';
            gui.classList.add('show');
        }, 4000);
    }, 0);

    // Button functionalities
    const injectBtn = document.getElementById('inject-btn');
    const clearBtn = document.getElementById('clear-btn');
    const executeBtn = document.getElementById('execute-btn');
    const toggleBtn = document.getElementById('toggle-btn');
    const textBox = document.getElementById('text-box');

    injectBtn.addEventListener('click', () => {
        injectBtn.classList.toggle('red');
    });

    clearBtn.addEventListener('click', () => {
        textBox.value = '';
    });

    executeBtn.addEventListener('click', () => {
        alert('Execute button clicked');
    });

    toggleBtn.addEventListener('click', () => {
        gui.classList.toggle('show');
        toggleBtn.classList.toggle('open');
        toggleBtn.textContent = gui.classList.contains('show') ? 'Close' : 'Open';
    });
})();