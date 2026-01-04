// ==UserScript==
// @name         JavaScript Web Executor
// @name:fr      Exécuteur Web JavaScript
// @name:es      Ejecutor Web de JavaScript
// @name:de      JavaScript-Web-Executor
// @name:zh-CN   JavaScript网络执行器
// @name:ru      JavaScript Веб-Исполнитель
// @description  Execute JavaScript with ease!
// @description:fr Exécutez JavaScript facilement!
// @description:es Ejecuta JavaScript con facilidad!
// @description:de Führen Sie JavaScript mühelos aus!
// @description:zh-CN 轻松执行JavaScript！
// @description:ru Выполняйте JavaScript с легкостью!
// @author       Luox
// @version      1.6
// @match        *://*/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1365002
// @downloadURL https://update.greasyfork.org/scripts/507504/JavaScript%20Web%20Executor.user.js
// @updateURL https://update.greasyfork.org/scripts/507504/JavaScript%20Web%20Executor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        #customJsModal {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            font-family: Arial, sans-serif;
            z-index: 9999;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.4s ease;
            pointer-events: none;
        }
        #customJsModal.show {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        #customJsModal textarea {
            width: 100%;
            height: 150px;
            background-color: #333;
            color: #fff;
            border: none;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            resize: none;
            margin-bottom: 10px;
        }
        #customJsModal button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        #customJsModal button:hover {
            background-color: #45a049;
        }
        #customJsModal button.close-btn {
            background-color: #f44336;
            margin-left: 10px;
        }
        #customJsModal button.close-btn:hover {
            background-color: #d32f2f;
        }
        #customJsModal button.disable-btn {
            background-color: #ff9800;
            margin-left: 10px;
        }
        #customJsModal button.disable-btn:hover {
            background-color: #ff5722;
        }
        #jsExecutorToggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            background-color: #f7df1e;
            border-radius: 50%;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9998;
            transition: background-color 0.3s ease;
        }
        #jsExecutorToggle img {
            width: 40px;
            height: 40px;
            pointer-events: none;
        }
        #jsExecutorToggle:hover {
            background-color: #ffeb3b;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'customJsModal';
    modal.innerHTML = `
        <textarea id="jsCodeArea" placeholder="Enter your JavaScript code here..."></textarea>
        <button id="executeJsBtn">Run</button>
        <button class="close-btn">Close</button>
        <button class="disable-btn">Disable Script</button>
    `;
    document.body.appendChild(modal);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'jsExecutorToggle';
    toggleButton.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JS Logo">`;
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        modal.classList.toggle('show');
    });

    document.getElementById('executeJsBtn').addEventListener('click', () => {
        const code = document.getElementById('jsCodeArea').value;
        try {
            new Function(code)();
        } catch (e) {
            console.error('Error: ' + e.message);
        }
    });

    document.querySelector('#customJsModal .close-btn').addEventListener('click', () => {
        modal.classList.remove('show');
    });

    document.querySelector('.disable-btn').addEventListener('click', () => {
        disableScript();
    });

    let isDragging = false;
    let offsetX, offsetY;

    toggleButton.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - toggleButton.getBoundingClientRect().left;
        offsetY = e.clientY - toggleButton.getBoundingClientRect().top;
        toggleButton.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            toggleButton.style.left = `${e.clientX - offsetX}px`;
            toggleButton.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        toggleButton.style.transition = 'all 0.4s ease';
    });

    function disableScript() {
        toggleButton.remove();
        modal.remove();
    }
})();
