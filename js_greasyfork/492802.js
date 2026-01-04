// ==UserScript==
// @name         Numerade Video Viewer
// @namespace    https://github.com/GooglyBlox/free-numerade-videos
// @version      1.9
// @description  [MOVED] The userscript has moved to Discord. Join us there for continued access!
// @author       GooglyBlox
// @match        https://www.numerade.com/questions/*
// @match        https://www.numerade.com/ask/question/*
// @icon         https://raw.githubusercontent.com/GooglyBlox/free-numerade-videos/main/no-more-numerade.ico
// @grant        GM_xmlhttpRequest
// @connect      cdn.numerade.com
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492802/Numerade%20Video%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/492802/Numerade%20Video%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .numerade-archive-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .numerade-archive-popup {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        .numerade-archive-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #5865F2;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .numerade-archive-content {
            color: #2c3e50;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .numerade-archive-info {
            background: #e3f2fd;
            border-left: 4px solid #5865F2;
            padding: 1rem;
            margin: 1rem 0;
            color: #1a237e;
        }

        .numerade-archive-button {
            background: #5865F2;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
            width: 100%;
        }

        .numerade-archive-button:hover {
            background: #4752C4;
        }

        .discord-link {
            color: #5865F2;
            text-decoration: none;
            font-weight: bold;
        }

        .discord-link:hover {
            text-decoration: underline;
        }
    `;

    function createPopup() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        const overlay = document.createElement('div');
        overlay.className = 'numerade-archive-overlay';

        const popup = document.createElement('div');
        popup.className = 'numerade-archive-popup';

        popup.innerHTML = `
            <div class="numerade-archive-title">
                <span>🎉 We've Moved to Discord!</span>
            </div>
            <div class="numerade-archive-content">
                <p>The Numerade Video Viewer project is still alive and active, but we've moved to a new home!</p>

                <div class="numerade-archive-info">
                    <strong>Good news:</strong> Join our Discord server to continue accessing Numerade videos for free!
                    <p style="margin-top: 0.5rem;">
                        <a href="https://discord.gg/D6D27pAs62" target="_blank" class="discord-link">➡️ Click here to join our Discord server</a>
                    </p>
                </div>

                <p><strong>What to do now:</strong></p>
                <ol>
                    <li>Uninstall this userscript as it's no longer needed</li>
                    <li>Join our Discord server using the link above</li>
                    <li>Use our Discord bot to access videos!</li>
                </ol>
            </div>
            <button class="numerade-archive-button">Got it, thanks!</button>
        `;

        const closeButton = popup.querySelector('.numerade-archive-button');
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    window.addEventListener('load', createPopup);
})();