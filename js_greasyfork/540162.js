// ==UserScript==
// @name        Power UserScript
// @namespace   https://github.com/yourusername
// @version     1.0.0
// @description Customize webpage appearance with dark mode, custom colors, font sizing and much more in the future.
// @match       *://*/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540162/Power%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/540162/Power%20UserScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #userscript-popup {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border: 2px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        
        #userscript-command {
            width: 200px;
            padding: 8px;
            margin-right: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
            color: black;
        }
        
        #userscript-submit {
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        
        #userscript-submit:hover {
            background: #45a049;
        }
        
        .userscript-dark {
            filter: invert(1) hue-rotate(180deg);
            background-color: #111 !important;
            color: white;
        }

        .userscript-custom-bg {
            background-color: var(--custom-bg) !important;
        }
        .userscript-custom-text {
            color: var(--custom-text) !important;
        }
        
        .userscript-dark img, 
        .userscript-dark video {
            filter: invert(1) hue-rotate(180deg);
        }
    `);

    const darkMode = GM_getValue('dark_mode', false);
    if (darkMode) {
        document.body.classList.add('userscript-dark');
    }

    const customBg = GM_getValue('custom_bg', false);
    if (customBg) {
        document.body.style.setProperty('--custom-bg', customBg);
        document.body.classList.add('userscript-custom-bg');
    }

    const customText = GM_getValue('custom_text', false);
    if (customText) {
         document.body.style.setProperty('--custom-text', customText);
        document.body.classList.add('userscript-custom-text');
    }

    const savedFontSize = GM_getValue('font_size', false);
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize;
    }

    const popup = document.createElement('div');
    popup.id = 'userscript-popup';
    popup.innerHTML = `
        <input type="text" id="userscript-command" placeholder="Try 'help' for command list">
        <button id="userscript-submit">Run</button>
    `;
    document.body.appendChild(popup);

    document.getElementById('userscript-submit').addEventListener('click', handleCommand);
    document.getElementById('userscript-command').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCommand();
    });

    function handleCommand() {
        const cmdInput = document.getElementById('userscript-command');
        const cmd = cmdInput.value.toLowerCase().trim();
        
        if (cmd === 'help') {
            alert(`Available commands:
            • dark - Toggle night-friendly dark theme
            • background:color - Change page background (e.g. background:#FF0000 or background:blue)
            • color:color - Change text color (e.g. color:white)
            • bigger - Increase page font size
            • smaller - Decrease page font size
            • reset - Reset all custom styling
            • help - Show this command list`);
        }
        else if (cmd === 'dark') {
            const isDark = document.body.classList.toggle('userscript-dark');
            GM_setValue('dark_mode', isDark);
        } 
        else if (cmd.startsWith('background:')) {
            const color = cmd.split(':')[1].trim();
            document.body.style.setProperty('--custom-bg', color);
            document.body.classList.add('userscript-custom-bg');
            GM_setValue('custom_bg', color);
      }
        else if (cmd.startsWith('color:')) {
            const color = cmd.split(':')[1].trim();

            document.body.style.setProperty('--custom-text', color);
            document.body.classList.add('userscript-custom-text');
            GM_setValue('custom_text', color);
      }
        else if (cmd === 'bigger') {
            const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
            document.body.style.fontSize = (currentSize * 1.2) + 'px';
            GM_setValue('font_size', document.body.style.fontSize);
        } 
        else if (cmd === 'smaller') {
            const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
            document.body.style.fontSize = (currentSize / 1.2) + 'px';
            GM_setValue('font_size', document.body.style.fontSize);
        } 
        else if (cmd === 'reset') {
            document.body.classList.remove('userscript-dark');
            document.body.classList.remove('userscript-custom-bg');
            document.body.classList.remove('userscript-custom-text');

            document.body.style.removeProperty('--custom-bg');
            document.body.style.removeProperty('--custom-text');
            document.body.style.fontSize = '';
            
            GM_setValue('dark_mode', false);
            GM_setValue('custom_bg', false);
            GM_setValue('custom_text', false);
            GM_setValue('font_size', false);
        }
        else {
            alert(`Unknown command. Available commands:
            • dark - Toggle night-friendly dark theme
            • background:color - Change page background (e.g. background:#FF0000 or background:blue)
            • color:color - Change text color (e.g. color:white)
            • bigger - Increase page font size
            • smaller - Decrease page font size
            • reset - Reset all custom styling
            • help - Show this command list`);
        }
        
        cmdInput.value = '';
        cmdInput.focus();
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            document.getElementById('userscript-command').focus();
        }
    });
})();
