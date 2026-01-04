// ==UserScript==
// @name         YouTube - Add Download Button with yt-dlp Command 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Injects a "Download" button that opens a modal to generate yt-dlp commands on YouTube video pages.
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      Unlicense     
// @downloadURL https://update.greasyfork.org/scripts/541945/YouTube%20-%20Add%20Download%20Button%20with%20yt-dlp%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/541945/YouTube%20-%20Add%20Download%20Button%20with%20yt-dlp%20Command.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const NEW_BUTTON_ID = 'my-custom-yt-dlp-button';
    const NEW_BUTTON_TEXT = 'Download';

    // --- Modal and Styling ---
    GM_addStyle(`
        .yt-dlp-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
        .yt-dlp-modal-backdrop.yt-dlp-visible {
            opacity: 1;
        }
        .yt-dlp-modal-content {
            background-color: #282828;
            color: #fff;
            padding: 24px;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            font-family: "Roboto", "Arial", sans-serif;
            border: 1px solid #3f3f3f;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: scale(0.95);
            transition: transform 0.2s ease-in-out;
        }
        .yt-dlp-modal-backdrop.yt-dlp-visible .yt-dlp-modal-content {
            transform: scale(1);
        }
        .yt-dlp-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .yt-dlp-modal-header h2 {
            margin: 0;
            font-size: 20px;
        }
        .yt-dlp-modal-close-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
        }
        p.video-title {
            font-size: 14px;
            color: #aaa;
            margin: 4px 0 20px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .yt-dlp-section {
            margin-bottom: 20px;
        }
        .yt-dlp-section h3 {
            font-size: 16px;
            margin: 0 0 12px 0;
            color: #eee;
            border-bottom: 1px solid #3f3f3f;
            padding-bottom: 8px;
        }
        .yt-dlp-options-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .option-btn {
            background-color: #3f3f3f;
            color: white;
            border: 1px solid transparent;
            border-radius: 18px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s, border-color 0.2s;
        }
        .option-btn:hover {
            background-color: #535353;
        }
        .option-btn.selected {
            background-color: #3ea6ff;
            color: #0d0d0d;
            border-color: #3ea6ff;
            font-weight: 500;
        }
        .yt-dlp-command-area input {
            width: 100%;
            box-sizing: border-box;
            background-color: #121212;
            border: 1px solid #3f3f3f;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            font-family: "Courier New", Courier, monospace;
            margin-bottom: 12px;
        }
        .yt-dlp-copy-btn {
            width: 100%;
            background-color: #3ea6ff;
            color: #0d0d0d;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 500;
            font-size: 15px;
            transition: background-color 0.2s;
        }
        .yt-dlp-copy-btn:hover {
            background-color: #6fc1ff;
        }
    `);

    /**
     * Creates and displays the modal for quality selection.
     */
    function showDownloadModal() {
        const existingModal = document.getElementById('yt-dlp-modal');
        if (existingModal) existingModal.remove();

        const videoUrl = window.location.href;
        const videoTitle = document.querySelector('h1.ytd-watch-metadata')?.textContent.trim() || 'Current Video';

        const backdrop = document.createElement('div');
        backdrop.id = 'yt-dlp-modal';
        backdrop.className = 'yt-dlp-modal-backdrop';
        backdrop.innerHTML = `
            <div class="yt-dlp-modal-content">
                <div class="yt-dlp-modal-header">
                    <h2>Download Command</h2>
                    <button class="yt-dlp-modal-close-btn">&times;</button>
                </div>
                <p class="video-title">${videoTitle}</p>

                <div class="yt-dlp-section">
                    <h3>Video (with Audio)</h3>
                    <div class="yt-dlp-options-grid">
                        <button class="option-btn" data-type="video" data-quality="1080">1080p</button>
                        <button class="option-btn" data-type="video" data-quality="720">720p</button>
                        <button class="option-btn" data-type="video" data-quality="480">480p</button>
                        <button class="option-btn" data-type="video" data-quality="best">Best</button>
                    </div>
                </div>

                <div class="yt-dlp-section">
                    <h3>Audio Only</h3>
                     <div class="yt-dlp-options-grid">
                        <button class="option-btn" data-type="audio" data-format="mp3">MP3</button>
                        <button class="option-btn" data-type="audio" data-format="m4a">M4A</button>
                        <button class="option-btn" data-type="audio" data-format="wav">WAV</button>
                    </div>
                </div>

                <div class="yt-dlp-command-area">
                    <input type="text" readonly placeholder="Select an option...">
                    <button class="yt-dlp-copy-btn">Copy Command</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);

        // Animate modal in
        requestAnimationFrame(() => backdrop.classList.add('yt-dlp-visible'));

        const closeButton = backdrop.querySelector('.yt-dlp-modal-close-btn');
        const optionButtons = backdrop.querySelectorAll('.option-btn');
        const commandInput = backdrop.querySelector('.yt-dlp-command-area input');
        const copyButton = backdrop.querySelector('.yt-dlp-copy-btn');

        const closeModal = () => {
            backdrop.classList.remove('yt-dlp-visible');
            backdrop.addEventListener('transitionend', () => backdrop.remove(), { once: true });
        };

        closeButton.onclick = closeModal;
        backdrop.onclick = (e) => {
            if (e.target === backdrop) closeModal();
        };

        optionButtons.forEach(button => {
            button.onclick = () => {
                optionButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');

                const type = button.dataset.type;
                let command = '';

                if (type === 'video') {
                    const quality = button.dataset.quality;
                    // The format selector for yt-dlp to get video + audio
                    const formatSelector = quality === 'best'
                        ? '-f "bv*+ba/b"'
                        : `-f "bv*[height<=${quality}]+ba/b[height<=${quality}]"`;
                    command = `yt-dlp ${formatSelector} "${videoUrl}"`.trim();
                } else if (type === 'audio') {
                    const format = button.dataset.format;
                    command = `yt-dlp -x --audio-format ${format} "${videoUrl}"`;
                }
                commandInput.value = command;
            };
        });

        copyButton.onclick = () => {
            if (!commandInput.value) return;
            commandInput.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy Command'; }, 2000);
        };
    }

    /**
     * Injects the custom button into the YouTube UI.
     */
    function injectCustomButton() {
        const actionsMenu = document.querySelector('ytd-watch-metadata #actions-inner #menu');
        if (!actionsMenu || document.getElementById(NEW_BUTTON_ID)) return;
        const shareButtonViewModel = actionsMenu.querySelector('button[aria-label="Share"]');
        if (!shareButtonViewModel) return;
        const shareButtonContainer = shareButtonViewModel.closest('yt-button-view-model');
        if (!shareButtonContainer) return;
        console.log('Download Button: Injecting button...');

        // Clone the share button to inherit its structure and styles
        const newButtonContainer = shareButtonContainer.cloneNode(true);
        const newButton = newButtonContainer.querySelector('button');
        newButton.id = NEW_BUTTON_ID;
        newButton.setAttribute('aria-label', NEW_BUTTON_TEXT);
        newButton.querySelector('.yt-spec-button-shape-next__button-text-content').textContent = NEW_BUTTON_TEXT;

        // --- MODIFICATION START ---
        // Find the icon container element within the new button
        const iconContainer = newButton.querySelector('.yt-spec-button-shape-next__icon');
        if (iconContainer) {
            // Remove the icon container entirely so no space is left for it
            iconContainer.remove();
        }

        // Remove the class that adds padding/styles for a leading icon
        newButton.classList.remove('yt-spec-button-shape-next--icon-leading');
        // --- MODIFICATION END ---

        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showDownloadModal();
        });

        shareButtonContainer.parentNode.insertBefore(newButtonContainer, shareButtonContainer.nextSibling);
    }

    /**
     * Use a MutationObserver to wait for the YouTube UI to be ready.
     */
    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-watch-metadata #actions-inner #menu') && !document.getElementById(NEW_BUTTON_ID)) {
            injectCustomButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
