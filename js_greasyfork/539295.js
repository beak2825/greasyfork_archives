// ==UserScript==
// @name         GC Spacebar Autoclicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates spacebar presses for GC slots that accept simulated input. Works especially well with BGaming titles.
// @author       Ian S. Oden
// @license      CC BY-NC 4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539295/GC%20Spacebar%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/539295/GC%20Spacebar%20Autoclicker.meta.js
// ==/UserScript==

// You are free to use, share, and modify this script,
// as long as you credit the original author and do not use it for commercial purposes.
// Author: Ian S. Oden
// Full license: https://creativecommons.org/licenses/by-nc/4.0/

(function() {
    'use strict';

    let toggle = false;
    let intervalId;

    // Create button
    const btn = document.createElement('button');
    btn.textContent = 'Start Auto Space';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.left = '10px';
    btn.style.zIndex = 9999;
    btn.style.padding = '10px 20px';
    btn.style.backgroundColor = '#28a745';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '16px';

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        toggle = !toggle;
        if (toggle) {
            btn.textContent = 'Stop Auto Space';
            btn.style.backgroundColor = '#dc3545';
            intervalId = setInterval(() => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: ' ',
                    code: 'Space',
                    keyCode: 32,
                    which: 32,
                    bubbles: true,
                    cancelable: true
                }));
                document.dispatchEvent(new KeyboardEvent('keyup', {
                    key: ' ',
                    code: 'Space',
                    keyCode: 32,
                    which: 32,
                    bubbles: true,
                    cancelable: true
                }));
            }, 1000);
            console.log('Auto spacebar started');
        } else {
            btn.textContent = 'Start Auto Space';
            btn.style.backgroundColor = '#28a745';
            clearInterval(intervalId);
            console.log('Auto spacebar stopped');
        }
    });
})();
