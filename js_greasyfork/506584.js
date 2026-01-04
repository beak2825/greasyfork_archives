// ==UserScript==
// @name         Bundle Inject By Links (Open Source)
// @version      1
// @description  easy inject your bundle to the game no limited bundle no change the script one fast and sec
// @author       Ha Thu
// @namespace    https://cheatx.myz.info/
// @match        *://sandbox.moomoo.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506584/Bundle%20Inject%20By%20Links%20%28Open%20Source%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506584/Bundle%20Inject%20By%20Links%20%28Open%20Source%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bundles = {
  //example  "name your bundle": "your link to the bundle like: https://stingy-incandescent-explanation.glitch.me/script.js",
  //i recommend using glitch to put bundle in it for easy inject or github , etc...
        "": "",
        "": "",
        "": "",
        "": "", //add more if need
    };
    // menu
    function createMenu() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.backdropFilter = 'blur(5px)';

        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.padding = '20px';
        menu.style.backgroundColor = '#fff';
        menu.style.borderRadius = '8px';
        menu.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        menu.style.zIndex = '10000';
        menu.style.animation = 'fadeIn 0.3s';
        menu.style.width = '300px';
        menu.style.boxSizing = 'border-box';
        // font
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Passion+One&display=swap');
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .custom-menu-title {
                font-family: 'Passion One', cursive;
                margin: 0 0 10px 0;
                font-size: 18px;
                text-align: center;
            }
            .custom-menu-button {
                display: block;
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                font-family: 'Passion One', cursive;
                font-size: 18px;
                color: white;
                background-color: #007bff;
                border: none;
                border-radius: 5px;
                transition: background-color 0.3s, transform 0.2s;
            }
            .custom-menu-button:hover {
                background-color: #0056b3;
                transform: scale(1.05);
            }
            .close-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #ff4d4d;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-weight: bold;
                font-size: 18px;
                line-height: 30px;
                text-align: center;
                transition: background-color 0.3s, transform 0.2s;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            }
            .close-button:hover {
                background-color: #ff1a1a;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
        // text of the menu
        const title = document.createElement('h3');
        title.className = 'custom-menu-title';
        title.textContent = 'Select Injects';
        menu.appendChild(title);

        Object.keys(bundles).forEach(bundleName => {
            const button = document.createElement('button');
            button.className = 'custom-menu-button';
            button.textContent = bundleName;

            button.onclick = function() {
                replaceScript(bundles[bundleName]);
                const feedback = document.createElement('div');
                feedback.textContent = `${bundleName} selected!`;
                feedback.style.marginTop = '10px';
                feedback.style.textAlign = 'center';
                feedback.style.color = '#007bff';
                menu.appendChild(feedback);
            };

            menu.appendChild(button);
        });
        // close the menu
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'close-button';
        closeButton.onclick = function() {
            menu.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.removeChild(menu);
            }, 300);
        };
        menu.appendChild(closeButton);

        document.body.appendChild(overlay);
        document.body.appendChild(menu);
    }
    // do inject the orig bundle
    function replaceScript(newScriptUrl) {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.includes('index-6b10514b.js')) {
                const newScript = document.createElement('script');
                newScript.src = newScriptUrl;
                scripts[i].parentNode.replaceChild(newScript, scripts[i]);
                return;
            }
        }
    }
    // load the menu
    window.addEventListener('load', createMenu);
})();
