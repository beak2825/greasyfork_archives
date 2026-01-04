// ==UserScript==
// @name         YouTube Quick Watch Later (DEPRECATED)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Adds quick Watch Later button with customizable playlist
// @author       kavinned
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513517/YouTube%20Quick%20Watch%20Later%20%28DEPRECATED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513517/YouTube%20Quick%20Watch%20Later%20%28DEPRECATED%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration: Add "Save" translations here
    const SAVE_BUTTON_TEXTS = [
        "Save",      // English
        "儲存",      // Traditional Chinese
        "保存",      // Simplified Chinese
        "Guardar",   // Spanish
        "Sauvegarder", // French
        "Speichern", // German
        "Salvar",    // Portuguese
        "Сохранить", // Russian
        "保存",      // Japanese
        "저장",      // Korean
        "บันทึก",    // Thai
        "Simpan",    // Indonesian
        "Lưu"        // Vietnamese
    ];

    // Get stored playlist name, default to "Watch later"
    function getTargetPlaylist() {
        return GM_getValue("targetPlaylist", "Watch later");
    }

    // Set target playlist
    function setTargetPlaylist(playlistName) {
        GM_setValue("targetPlaylist", playlistName);
        console.log(`Target playlist set to: ${playlistName}`);
    }

    // Polling function to wait for playlists to load
    function waitForPlaylists(callback, maxAttempts = 20, interval = 1000) {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            const playlists = document.querySelectorAll("#playlists > ytd-playlist-add-to-option-renderer");

            if (playlists.length > 0) {
                clearInterval(checkInterval);
                callback(playlists);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                callback(null);
            }

            attempts++;
            attempts > 0 && console.log(`Fetching Playlists Attempt: ${attempts}`)
        }, interval);
    }

    // Create custom playlist selector modal
    function createPlaylistSelectorModal() {
        const modal = document.createElement("div");
        modal.id = "playlist-selector-modal";

        const overlay = document.createElement("div");
        overlay.className = "playlist-modal-overlay";

        const content = document.createElement("div");
        content.className = "playlist-modal-content";

        const header = document.createElement("div");
        header.className = "playlist-modal-header";

        const title = document.createElement("h3");
        title.textContent = "Select Target Playlist";

        const closeBtn = document.createElement("button");
        closeBtn.className = "playlist-modal-close";
        closeBtn.textContent = "×";

        header.appendChild(title);
        header.appendChild(closeBtn);

        const body = document.createElement("div");
        body.className = "playlist-modal-body";

        const loading = document.createElement("p");
        loading.className = "playlist-loading";
        loading.textContent = "Loading playlists...";
        body.appendChild(loading);

        content.appendChild(header);
        content.appendChild(body);
        overlay.appendChild(content);
        modal.appendChild(overlay);

        document.body.appendChild(modal);
        return modal;
    }

    // Show playlist selector
    function showPlaylistSelector() {
        const currentPlaylist = getTargetPlaylist();

        // Create modal
        const modal = createPlaylistSelectorModal();
        const modalBody = modal.querySelector(".playlist-modal-body");
        const closeBtn = modal.querySelector(".playlist-modal-close");
        const overlay = modal.querySelector(".playlist-modal-overlay");

        // Close modal function
        function closeModal() {
            modal.remove();
            closeDialog();
        }

        // Close on X button or overlay click
        closeBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Open YouTube's save dialog to get playlists
        const directSaveButton = Array.from(
            document.querySelectorAll("ytd-menu-renderer yt-button-view-model .yt-spec-button-shape-next__button-text-content")
        ).find(element => containsSaveText(element.textContent));

        if (directSaveButton) {
            directSaveButton.click();
        } else {
            const menuButton = document.querySelector("#button-shape > button > yt-touch-feedback-shape > div");
            if (menuButton) {
                menuButton.click();
                setTimeout(function() {
                    const saveButtons = document.querySelectorAll(
                        "#items > ytd-menu-service-item-renderer > tp-yt-paper-item > yt-formatted-string"
                    );
                    const saveButton = Array.from(saveButtons).find((button) =>
                        containsSaveText(button.textContent)
                    );
                    if (saveButton) {
                        saveButton.click();
                    }
                }, 100);
            }
        }

        // Use polling to wait for playlists to load
        waitForPlaylists(function(playlists) {
            if (!playlists || playlists.length === 0) {
                modalBody.textContent = "";
                const error = document.createElement("p");
                error.className = "playlist-error";
                error.textContent = "Could not load playlists. Please try again.";
                modalBody.appendChild(error);
                return;
            }

            modalBody.textContent = "";

            playlists.forEach((playlist) => {
                const playlistTitle = playlist.querySelector("#label");
                if (playlistTitle) {
                    const playlistName = playlistTitle.textContent.trim();
                    const playlistItem = document.createElement("div");
                    playlistItem.className = "playlist-item";

                    if (playlistName === currentPlaylist) {
                        playlistItem.classList.add("playlist-item-active");
                    }

                    const nameSpan = document.createElement("span");
                    nameSpan.className = "playlist-name";
                    nameSpan.textContent = playlistName;
                    playlistItem.appendChild(nameSpan);

                    if (playlistName === currentPlaylist) {
                        const badge = document.createElement("span");
                        badge.className = "playlist-badge";
                        badge.textContent = "Current";
                        playlistItem.appendChild(badge);
                    }

                    playlistItem.addEventListener("click", function() {
                        setTargetPlaylist(playlistName);
                        closeModal();

                        // Show confirmation
                        const notification = document.createElement("div");
                        notification.className = "playlist-notification";
                        notification.textContent = `Target playlist set to: ${playlistName}`;
                        document.body.appendChild(notification);

                        setTimeout(() => notification.classList.add("show"), 10);
                        setTimeout(() => {
                            notification.classList.remove("show");
                            setTimeout(() => notification.remove(), 300);
                        }, 2000);
                    });

                    modalBody.appendChild(playlistItem);
                }
            });
        });
    }

    // Register menu command to change playlist
    GM_registerMenuCommand("Change Target Playlist", showPlaylistSelector);

    function closeDialog() {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true
        }));
    }

    // Helper function to check if text contains any of the save button texts
    function containsSaveText(text) {
        return SAVE_BUTTON_TEXTS.some(saveText => text.includes(saveText));
    }

    // Find playlist by name with polling
    function findPlaylistByName(playlistName, callback, maxAttempts = 20, interval = 300) {
        let attempts = 0;

        const checkInterval = setInterval(() => {
            const playlists = document.querySelectorAll("#playlists > ytd-playlist-add-to-option-renderer");

            for (let i = 0; i < playlists.length; i++) {
                const playlistTitle = playlists[i].querySelector("#label");
                if (playlistTitle && playlistTitle.textContent.trim() === playlistName) {
                    clearInterval(checkInterval);
                    callback(playlists[i].querySelector("#checkbox"));
                    return;
                }
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                callback(null);
            }

            attempts++;
        }, interval);
    }

    // Handle playlist selection with fallback
    function handlePlaylistSelection() {
        const targetPlaylistName = getTargetPlaylist();

        findPlaylistByName(targetPlaylistName, function(targetCheckbox) {
            // If playlist not found, handle fallback
            if (!targetCheckbox) {
                const useWatchLater = confirm(
                    `Playlist "${targetPlaylistName}" not found.\n\nDo you want to save to "Watch later" instead?`
                );

                if (useWatchLater) {
                    // Update stored preference to Watch later
                    setTargetPlaylist("Watch later");

                    // Try to find Watch later playlist
                    findPlaylistByName("Watch later", function(watchLaterCheckbox) {
                        if (!watchLaterCheckbox) {
                            // If Watch later also not found, use first playlist
                            const firstPlaylist = document.querySelector("#playlists > ytd-playlist-add-to-option-renderer:first-child #checkbox");
                            if (firstPlaylist) {
                                handleCheckboxClick(firstPlaylist);
                            } else {
                                alert("Could not find any playlists.");
                                closeDialog();
                            }
                        } else {
                            handleCheckboxClick(watchLaterCheckbox);
                        }
                    });
                } else {
                    // Let user input new playlist name
                    const newPlaylistName = prompt(
                        "Enter the exact playlist name you want to save to:"
                    );

                    if (newPlaylistName && newPlaylistName.trim() !== "") {
                        const trimmedName = newPlaylistName.trim();
                        setTargetPlaylist(trimmedName);

                        findPlaylistByName(trimmedName, function(newCheckbox) {
                            if (!newCheckbox) {
                                alert(`Playlist "${trimmedName}" still not found. Please check the spelling and try again.`);
                                closeDialog();
                            } else {
                                handleCheckboxClick(newCheckbox);
                            }
                        });
                    } else {
                        closeDialog();
                    }
                }
            } else {
                handleCheckboxClick(targetCheckbox);
            }
        });
    }

    // Helper function to handle checkbox click
    function handleCheckboxClick(checkbox) {
        // Check if video is already in playlist
        if (checkbox && checkbox.getAttribute("aria-checked") === "true") {
            const confirmRemove = confirm(
                `This video is already in your "${getTargetPlaylist()}" playlist. Do you want to remove it?`
            );

            if (confirmRemove) {
                checkbox.click();
                closeDialog();
            } else {
                closeDialog();
            }
        } else if (checkbox) {
            // Add to playlist
            checkbox.click();
            closeDialog();
        }
    }

    function addWatchLaterButton() {
        const targetDiv = document.querySelector(
            "#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div"
        );
        if (!targetDiv || document.querySelector(".quick-watch-later")) return;

        const button = document.createElement("button");
        button.className = "quick-watch-later";
        button.textContent = "WL";

        // Left click handler
        button.addEventListener("click", function () {
            // First check if Save button is directly visible
            const directSaveButton = document.querySelector(
                "ytd-menu-renderer yt-button-view-model .yt-spec-button-shape-next__button-text-content"
            );
            const directSaveButtonWithText = Array.from(
                document.querySelectorAll("ytd-menu-renderer yt-button-view-model .yt-spec-button-shape-next__button-text-content")
            ).find(element => containsSaveText(element.textContent));

            if (directSaveButtonWithText) {
                // Save button is directly visible, click it
                console.log("Direct save button found, clicking it");
                directSaveButtonWithText.click();

                // Then proceed to handle playlist selection
                setTimeout(handlePlaylistSelection, 500);
            } else {
                // Save button is in submenu, use original logic
                console.log("Save button not directly visible, opening menu");

                // First click menu button
                const menuButton = document.querySelector(
                    "#button-shape > button > yt-touch-feedback-shape > div"
                );
                if (menuButton) {
                    menuButton.click();
                    console.log("menu clicked");
                }

                // Next click the Save button
                setTimeout(function () {
                    const saveButtons = document.querySelectorAll(
                        "#items > ytd-menu-service-item-renderer > tp-yt-paper-item > yt-formatted-string"
                    );
                    const saveButton = Array.from(saveButtons).find((button) =>
                        containsSaveText(button.textContent)
                    );

                    if (saveButton) {
                        saveButton.click();
                        // Then handle playlist selection
                        setTimeout(handlePlaylistSelection, 500);
                    }
                }, 100);
            }
        });

        // Right click handler for playlist change
        button.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPlaylistSelector();
        });

        targetDiv.appendChild(button);
    }

    setTimeout(addWatchLaterButton, 2000);

    const observer = new MutationObserver(() => {
        if (window.location.href.includes("/watch?")) {
            setTimeout(addWatchLaterButton, 1000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    GM_addStyle(
        `#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div {
            display: flex;
            flex-direction: row-reverse;
            gap: 5px;
        }
        #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > button {
            flex-direction: row;
            border-radius: 24px;
            border: none;
            padding-left: 20px;
            padding-right: 20px;
            color: white;
            font-weight: bold;
            background: #272727;
            cursor: pointer;

            &:hover {
                background: #414141;
            }
        }
        .ryd-tooltip.ryd-tooltip-new-design {
            height: 0px !important;
            width: 0px !important;
        }
        @media only screen and (max-width: 1200px) {
            #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div {
                flex-direction: column;
            }
            #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > button {
                padding: 10.5px 0px;
            }
        }

        /* Subtle Modal Styles */
        #playlist-selector-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .playlist-modal-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .playlist-modal-content {
            background: rgba(33, 33, 33, 0.98);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .playlist-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .playlist-modal-header h3 {
            margin: 0;
            color: #fff;
            font-size: 18px;
            font-weight: 500;
        }

        .playlist-modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #aaa;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.15s ease;
        }

        .playlist-modal-close:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
        }

        .playlist-modal-body {
            padding: 12px;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
        }

        .playlist-modal-body::-webkit-scrollbar {
            width: 8px;
        }

        .playlist-modal-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .playlist-modal-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }

        .playlist-modal-body::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .playlist-loading,
        .playlist-error {
            text-align: center;
            padding: 40px 20px;
            color: #aaa;
        }

        .playlist-error {
            color: #f44336;
        }

        .playlist-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            border: 1px solid transparent;
        }

        .playlist-item:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .playlist-item-active {
            background: rgba(62, 166, 255, 0.15);
            border-color: rgba(62, 166, 255, 0.4);
        }

        .playlist-item-active:hover {
            background: rgba(62, 166, 255, 0.2);
            border-color: rgba(62, 166, 255, 0.5);
        }

        .playlist-name {
            color: #fff;
            font-size: 14px;
            font-weight: 400;
        }

        .playlist-badge {
            background: #3ea6ff;
            color: #000;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        /* Notification Styles */
        .playlist-notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 33, 33, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            transition: bottom 0.2s ease;
            font-size: 14px;
        }

        .playlist-notification.show {
            bottom: 24px;
        }
        .playlist-loading,
        .playlist-error{
           display: grid;
           place-items: center;
           padding: 80px 20px;
           min-height: 175px;
           text-align: center;
           color: #aaa;
           font-size: 32px;
           font-weight: 700;
        }
    }`
    );
})();
