// ==UserScript==
// @name         Age Verification bypass 🍑SPANKBANG🍑 + Control Center [UPDATE]
// @namespace    https://greasyfork.org/en/scripts/
// @version      3.3
// @description  Age restriction bypass + Control Center with panic shortcut
// @author       Jusy
// @match        *://*.spankbang.com/*
// @grant        none
// @license      Jusy
// @downloadURL https://update.greasyfork.org/scripts/528576/Age%20Verification%20bypass%20%F0%9F%8D%91SPANKBANG%F0%9F%8D%91%20%2B%20Control%20Center%20%5BUPDATE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/528576/Age%20Verification%20bypass%20%F0%9F%8D%91SPANKBANG%F0%9F%8D%91%20%2B%20Control%20Center%20%5BUPDATE%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeExistingPopup() {
        let existingPopup = document.getElementById('av-wrapper');
        if (existingPopup) existingPopup.remove();
    }
const observer = new MutationObserver(() => {

    document.querySelectorAll('img.strong-blur').forEach(img => {
        img.style.filter = 'none';
    });

    document.querySelectorAll('div.flex.items-center.justify-center.rounded-full.bg-surface-brand-primary.w-10.h-10')
        .forEach(div => div.remove());
});

observer.observe(document.body, { childList: true, subtree: true });


document.querySelectorAll('img.strong-blur').forEach(img => {
    img.style.filter = 'none';
});
document.querySelectorAll('div.flex.items-center.justify-center.rounded-full.bg-surface-brand-primary.w-10.h-10')
    .forEach(div => div.remove());


    function showBypassInfoPopup() {
        if(localStorage.getItem('hideBypassPopup') === 'true') return;
        if(document.getElementById('bypassInfoPopup')) return;

        let popup = document.createElement('div');
        popup.id = 'bypassInfoPopup';
        popup.className = 'bypassPopupContainer';
popup.innerHTML = `
    <div class="bypassPopup">
        <button class="closeButton" title="Close">&times;</button>
        <h2>Script Bypass Active</h2>
        <p>This script bypasses the age verification and keeps the preview images visible but if you can't play the videos, disable your AdBlock.</p>
        <p>To watch videos, it is recommended to use a VPN or the Tor Browser, which includes a free VPN.</p>
        <label style="display:block; margin-top:20px; font-size:14px; cursor:pointer;">
            <input type="checkbox" id="dontShowAgain" style="margin-right:8px;">
            Don't show again
        </label>
    </div>
`;


        document.body.appendChild(popup);

        popup.querySelector('.closeButton').onclick = () => {
            popup.remove();
        };

        const checkbox = popup.querySelector('#dontShowAgain');
        checkbox.onchange = () => {
            if(checkbox.checked) {
                localStorage.setItem('hideBypassPopup', 'true');
            } else {
                localStorage.removeItem('hideBypassPopup');
            }
        };
    }


    function addToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'gadgetToolbar';
        toolbar.innerHTML = `
            <button id="settingsBtn" title="Open Gadget Control Center ⚙️">⚙️</button>
        `;
        document.body.appendChild(toolbar);

        document.getElementById('settingsBtn').addEventListener('click', toggleControlCenter);
    }

    function createControlCenter() {
        if(document.getElementById('gadgetControlCenter')) return;

        const overlay = document.createElement('div');
        overlay.id = 'gadgetOverlay';

        const panel = document.createElement('div');
        panel.id = 'gadgetControlCenter';

        panel.innerHTML = `
            <button id="closeControlCenter" title="Close">&times;</button>
            <h2>Gadget Control Center</h2>
            <p>Open this panel anytime with <b>Ctrl + Alt + O</b></p>

            <label style="display:block; margin-top:15px;">
                <input type="checkbox" id="panicShortcutToggle" />
                Enable “panic shortcut”
            </label>

            <label for="shortcutInput" style="display:block; margin-top:12px;">
                Choose your panic shortcut (e.g. Ctrl+Shift+G):
                <input type="text" id="shortcutInput" placeholder="e.g. Ctrl+Shift+G" style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; margin-top:4px;" />
            </label>

            <label for="redirectURL" style="display:block; margin-top:12px;">
                URL to redirect instantly:
                <input type="url" id="redirectURL" placeholder="https://example.com" style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; margin-top:4px;" />
            </label>

            <hr style="margin:20px 0;" />

            <h3>Send Feedback</h3>
<label for="pseudoInput" style="display:block; margin-top:12px;">
  Enter your Username (
  <span style="color: orange;">
    if you want you can provide us your Discord Username for us to reply your feedback. Btw if you see a friend request from "Jusy" it's a dev
  </span>
  ):
  <input type="text" id="pseudoInput" placeholder="Your name or nickname" style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; margin-top:4px;" />
</label>



            <label for="feedbackInput" style="display:block; margin-top:12px;">
                Your message:
                <textarea id="feedbackInput" rows="4" placeholder="Write your feedback here..." style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; margin-top:4px; resize:none;"></textarea>
            </label>

            <button id="sendFeedbackBtn" style="margin-top:15px; padding:8px 15px; border:none; border-radius:6px; background:#3498db; color:white; cursor:pointer; font-weight:bold;">
                Send Feedback
            </button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        document.getElementById('closeControlCenter').onclick = toggleControlCenter;

        const panicToggle = document.getElementById('panicShortcutToggle');
        const shortcutInput = document.getElementById('shortcutInput');
        const redirectURL = document.getElementById('redirectURL');
        const pseudoInput = document.getElementById('pseudoInput');

        panicToggle.checked = localStorage.getItem('panicShortcutEnabled') === 'true';
        shortcutInput.value = localStorage.getItem('panicShortcutKeys') || '';
        redirectURL.value = localStorage.getItem('panicRedirectURL') || '';
        pseudoInput.value = localStorage.getItem('feedbackPseudo') || '';

        panicToggle.onchange = () => {
            localStorage.setItem('panicShortcutEnabled', panicToggle.checked ? 'true' : 'false');
        };
        shortcutInput.onchange = () => {
            localStorage.setItem('panicShortcutKeys', shortcutInput.value.trim());
        };
        redirectURL.onchange = () => {
            localStorage.setItem('panicRedirectURL', redirectURL.value.trim());
        };
        pseudoInput.onchange = () => {
            localStorage.setItem('feedbackPseudo', pseudoInput.value.trim());
        };

        document.getElementById('sendFeedbackBtn').onclick = () => {
            const pseudo = pseudoInput.value.trim() || 'Anonymous';
            const message = document.getElementById('feedbackInput').value.trim();
            sendFeedback(pseudo, message);
        };
    }

    function toggleControlCenter() {
        const panel = document.getElementById('gadgetControlCenter');
        const overlay = document.getElementById('gadgetOverlay');
        if(panel && overlay) {
            const isVisible = panel.style.display === 'block';
            if(isVisible) {
                panel.style.display = 'none';
                overlay.style.display = 'none';
            } else {
                panel.style.display = 'block';
                overlay.style.display = 'block';
            }
        } else {
            createControlCenter();
            toggleControlCenter();
        }
    }

    window.addEventListener('keydown', e => {
        if(e.ctrlKey && e.altKey && e.code === 'KeyO') {
            e.preventDefault();
            toggleControlCenter();
        }
    });

document.body.style.overflow = 'auto';

    window.addEventListener('keydown', e => {
        if(localStorage.getItem('panicShortcutEnabled') !== 'true') return;

        const keysString = localStorage.getItem('panicShortcutKeys');
        if(!keysString) return;

        const keys = keysString.toLowerCase().split('+').map(k => k.trim());
        const key = e.key.toLowerCase();

        const ctrlNeeded = keys.includes('ctrl') || keys.includes('control');
        const shiftNeeded = keys.includes('shift');
        const altNeeded = keys.includes('alt') || keys.includes('option');
        const metaNeeded = keys.includes('meta') || keys.includes('cmd') || keys.includes('command');

        const mainKey = keys.find(k => !['ctrl','control','shift','alt','option','meta','cmd','command'].includes(k));

        if(
            (ctrlNeeded === e.ctrlKey) &&
            (shiftNeeded === e.shiftKey) &&
            (altNeeded === e.altKey) &&
            (metaNeeded === e.metaKey) &&
            (mainKey === key)
        ) {
            e.preventDefault();
            const url = localStorage.getItem('panicRedirectURL');
            if(url) {
                window.location.href = url;
            }
        }
    });

    function sendFeedback(pseudo, message) {
        if (!message) {
            alert('Please enter a feedback message.');
            return;
        }

        const COOLDOWN_MS = 24 * 60 * 60 * 1000;
        const lastSent = localStorage.getItem('feedbackCooldown');
        if(lastSent && (Date.now() - lastSent) < COOLDOWN_MS) {
            alert('You can only send feedback once every 24 hours. Please try again later.');
            return;
        }

        const OI = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQwMzg0NzU1NTE2MjMwODY4OC9jU05UT245dXdzbm5maGV3Wi1tZmhGay1DSGpkZVVJOHhJenhIVjlGMmN1eWRodmlISE1JekdIOHhQVjd4a2o2TFl5TQ==';
        const wu = atob(OI);

        fetch(wu, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify()
        })

                                                                        // ty to the person that warned me abt the webhook 💗
        const payload = {
            content: null,
            embeds: [{
                title: '📝 New Feedback Received',
                color: 3447003,
                fields: [
                    { name: 'User', value: pseudo, inline: true },
                    { name: 'Message', value: message, inline: false }
                ],
                footer: { text: 'Feedback sent via Gadget Control Center' },
                timestamp: new Date().toISOString()
            }]
        };

        fetch(wu, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you for your feedback!');
                localStorage.setItem('feedbackCooldown', Date.now());
                document.getElementById('feedbackInput').value = '';
            } else {
                alert('Failed to send feedback. Please try again later.');
            }
        })
        .catch(() => {
            alert('Failed to send feedback. Please check your internet connection.');
        });
    }
            const backdrop = document.createElement('div');
        backdrop.id = 'settingsBackdrop';
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100vw';
        backdrop.style.height = '100vh';
        backdrop.style.background = 'rgba(0,0,0,0.4)';
        backdrop.style.backdropFilter = 'blur(6px)';
        backdrop.style.zIndex = '10000010';

    const style = document.createElement('style');
    style.textContent = `
        /* Toolbar bottom center */
        #gadgetToolbar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 99999;
            background: rgba(0,0,0,0.8);
            border-radius: 40px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            user-select: none;
        }
        #gadgetToolbar button {
            font-size: 22px;
            cursor: pointer;
            border: none;
            background: transparent;
            color: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            transition: background 0.3s;
        }
        #gadgetToolbar button:hover {
            background: rgba(255,255,255,0.2);
        }

        /* Control Center Overlay */
        #gadgetOverlay {
            position: fixed;
            top:0; left:0; right:0; bottom:0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
            z-index: 99998;
            display: none;
        }

        /* Control Center Panel */
        #gadgetControlCenter {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 360px;
            background: #222;
            color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 0 25px rgba(0,0,0,0.9);
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 99999;
            display: none;
            user-select: text;
        }
        #gadgetControlCenter h2, #gadgetControlCenter h3 {
            margin-top: 0;
            margin-bottom: 10px;
        }
        #gadgetControlCenter button#closeControlCenter {
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 22px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-weight: bold;
        }
        #gadgetControlCenter input[type="text"],
        #gadgetControlCenter input[type="url"],
        #gadgetControlCenter textarea {
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 6px;
            font-size: 14px;
            font-family: monospace, monospace;
        }
        #gadgetControlCenter input[type="text"]:focus,
        #gadgetControlCenter input[type="url"]:focus,
        #gadgetControlCenter textarea:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 6px #3498db;
        }

        /* Popup info bypass */
        .bypassPopupContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #111;
            color: #eee;
            border-radius: 12px;
            padding: 15px 20px;
            max-width: 320px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 99999;
            user-select: none;
        }
        .bypassPopupContainer .bypassPopup {
            position: relative;
        }
        .bypassPopupContainer button.closeButton {
            position: absolute;
            top: 4px;
            right: 8px;
            font-size: 20px;
            background: none;
            border: none;
            color: #ccc;
            cursor: pointer;
            font-weight: bold;
            user-select: none;
        }

        .bypassPopupContainer button.closeButton:hover {
            color: white;
        }
    `;
    document.head.appendChild(style);

    removeExistingPopup();
    showBypassInfoPopup();
    addToolbar();
})();
