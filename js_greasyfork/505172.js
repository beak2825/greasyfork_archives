// ==UserScript==
// @name         Site Locker (SL)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Lock sites with a code input on any site using "Ctrl + :" with a dark theme, persistent lock, and animations.
// @author       Emree.el on ig
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505172/Site%20Locker%20%28SL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505172/Site%20Locker%20%28SL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOCK_CODE = '1337';
    const LOCKED_STORAGE_KEY = 'siteLocked';
    let locked = localStorage.getItem(LOCKED_STORAGE_KEY) === 'true';

    document.addEventListener('keydown', function(e) {
        // Check if Ctrl + : (Shift + ;) is pressed and nothing else is focused
        if (e.ctrlKey && e.key === ':' && document.activeElement.tagName !== "INPUT" && !locked) {
            lockScreen();
        }
    });

    function lockScreen() {
        locked = true;
        localStorage.setItem(LOCKED_STORAGE_KEY, 'true');

        // Create black overlay
        let overlay = document.createElement('div');
        overlay.id = 'lockOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
        overlay.style.zIndex = 9999;
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.opacity = 0;
        overlay.style.transition = 'opacity 0.5s ease-in-out';

        // Create the lock box
        let lockBox = document.createElement('div');
        lockBox.style.backgroundColor = '#222';
        lockBox.style.border = '2px solid #444';
        lockBox.style.padding = '20px';
        lockBox.style.borderRadius = '10px';
        lockBox.style.color = '#ccc';
        lockBox.style.textAlign = 'center';
        lockBox.style.width = '300px';
        lockBox.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.8)';

        // Add title
        let title = document.createElement('h2');
        title.textContent = 'Locked';
        title.style.marginBottom = '20px';
        title.style.color = '#ccc';
        lockBox.appendChild(title);

        // Add input for code
        let input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'code';
        input.style.marginTop = '10px';
        input.style.padding = '10px';
        input.style.borderRadius = '5px';
        input.style.border = 'none';
        input.style.width = '100%';
        input.style.backgroundColor = '#333';
        input.style.color = '#ccc';
        input.style.outline = 'none';
        lockBox.appendChild(input);

        // Add the lockbox to the overlay
        overlay.appendChild(lockBox);
        document.body.appendChild(overlay);

        // Trigger fade-in animation
        requestAnimationFrame(() => {
            overlay.style.opacity = 1;
        });

        // Focus on the input box
        input.focus();

        // Handle code entry
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (input.value === LOCK_CODE) {
                    unlockScreen(overlay);
                } else {
                    input.value = ''; // Clear input on wrong code
                    alert('Wrong code!');
                }
            }
        });
    }

    function unlockScreen(overlay) {
        overlay.style.opacity = 0;
        overlay.style.transition = 'opacity 0.5s ease-in-out';

        setTimeout(() => {
            document.body.removeChild(overlay);
            locked = false;
            localStorage.setItem(LOCKED_STORAGE_KEY, 'false');
        }, 500);
    }

    // If the page is locked, re-lock it immediately on load
    if (locked) {
        lockScreen();
    }
})();
