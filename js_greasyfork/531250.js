// ==UserScript==
// @name         GOG-Games to Steam
// @author       vsea
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Adds a button on gog-games.to game pages/popups to search/link directly to Steam.
// @match        https://gog-games.to/*
// @icon         https://store.steampowered.com/favicon.ico
// @connect      store.steampowered.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle   // <<< THỬ THÊM HOẶC SỬA DÒNG NÀY
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531250/GOG-Games%20to%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/531250/GOG-Games%20to%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("GOG-Steam Script: DANG CHAY v1.5 (-> to Steam)");

    // --- Configuration ---
    // ===>>> SỬA TÊN NÚT <<<===
    const buttonTextLoading = "-> Searching..."; // Text khi đang tìm link trực tiếp
    const buttonTextDirect = "-> to Steam";      // Text khi tìm thấy link trực tiếp
    const buttonTextSearch = "-> Search Steam";  // Text khi không tìm thấy/lỗi
    const titleSelector = 'div.game-info-title.text-3xl';
    const buttonClassName = 'steam-link-button-gog-dynamic'; // Đổi tên class một chút cho rõ
    // ---------------------

    const addButtonStyle = () => {
        // Đảm bảo tên class trong CSS khớp với buttonClassName ở trên
        GM_addStyle(`
            .${buttonClassName} {
                display: inline-block;
                margin-left: 15px;
                padding: 5px 10px;
                background-color: #4b5563;
                color: #ffffff !important;
                border: 1px solid #374151;
                border-radius: 4px;
                text-decoration: none !important;
                font-size: 0.85em;
                font-weight: 600;
                vertical-align: middle;
                cursor: pointer;
                transition: background-color 0.2s ease, color 0.2s ease;
                white-space: nowrap;
            }
            .${buttonClassName}:hover {
                background-color: #6b7280;
                color: #ffffff !important;
                text-decoration: none !important;
            }
            .${buttonClassName}.loading {
                cursor: progress;
                opacity: 0.8;
            }
            .${buttonClassName}.direct-link {
                 background-color: #16a34a;
                 border-color: #15803d;
            }
             .${buttonClassName}.direct-link:hover {
                 background-color: #22c55e;
            }
            .${buttonClassName}.search-link { /* Thêm style riêng cho nút search nếu muốn */
                 background-color: #ca8a04; /* Màu vàng chẳng hạn */
                 border-color: #a16207;
            }
            .${buttonClassName}.search-link:hover {
                background-color: #eab308;
            }
        `);
        addButtonStyle.applied = true;
    };

    const getDirectSteamLink = (gameTitle, steamButton) => {
        const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameTitle)}&category1=998`;
        console.log(`GOG-Steam Script: Fetching Steam search for: ${gameTitle} from ${searchUrl}`);

        steamButton.textContent = buttonTextLoading;
        steamButton.classList.add('loading');
        steamButton.classList.remove('direct-link', 'search-link'); // Xóa style cũ
        steamButton.href = searchUrl; // Link dự phòng

        // ===>>> Lệnh này cần quyền GM_xmlhttpRequest <<<===
        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            timeout: 7000,
            onload: function(response) {
                steamButton.classList.remove('loading');
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = response.responseText;
                        const firstResultLink = tempDiv.querySelector('#search_resultsRows > a:first-of-type');

                        if (firstResultLink && firstResultLink.href && firstResultLink.href.includes('/app/')) {
                            const directLink = firstResultLink.href.split('?')[0];
                            const gameNameOnSteam = firstResultLink.querySelector('.title')?.textContent.trim();
                            console.log(`GOG-Steam Script: Found direct link: ${directLink}`);
                            steamButton.href = directLink;
                            steamButton.textContent = buttonTextDirect; // -> to Steam
                            steamButton.title = `View "${gameNameOnSteam || gameTitle}" on Steam Store`;
                            steamButton.classList.add('direct-link');
                        } else {
                            console.log("GOG-Steam Script: No direct link found. Using search link.");
                            steamButton.textContent = buttonTextSearch; // -> Search Steam
                            steamButton.title = `Search for "${gameTitle}" on the Steam Store`;
                            steamButton.classList.add('search-link');
                        }
                    } catch (e) {
                        console.error("GOG-Steam Script: Error parsing response:", e);
                        steamButton.textContent = buttonTextSearch;
                        steamButton.title = `Search for "${gameTitle}" on the Steam Store (parsing error)`;
                        steamButton.classList.add('search-link');
                    }
                } else {
                     console.error(`GOG-Steam Script: Request failed: ${response.status}`);
                     steamButton.textContent = buttonTextSearch;
                     steamButton.title = `Search for "${gameTitle}" on the Steam Store (request failed)`;
                     steamButton.classList.add('search-link');
                }
            },
            onerror: function(error) {
                steamButton.classList.remove('loading');
                console.error("GOG-Steam Script: Network error:", error);
                steamButton.textContent = buttonTextSearch;
                steamButton.title = `Search for "${gameTitle}" on the Steam Store (network error)`;
                steamButton.classList.add('search-link');
            },
            ontimeout: function() {
                steamButton.classList.remove('loading');
                console.error("GOG-Steam Script: Request timed out.");
                steamButton.textContent = buttonTextSearch;
                steamButton.title = `Search for "${gameTitle}" on the Steam Store (timeout)`;
                steamButton.classList.add('search-link');
            }
        });
    };

    const addSteamButton = (titleElement) => {
        if (titleElement.parentNode.querySelector(`.${buttonClassName}`)) {
            return;
        }
        if (!addButtonStyle.applied) {
            addButtonStyle();
        }
        const gameTitle = titleElement.textContent.trim();
        if (!gameTitle) {
            console.error("GOG-Steam Script: No game title text found.");
            return;
        }
        console.log(`GOG-Steam Script: Adding button for title: ${gameTitle}`);
        const steamButton = document.createElement('a');
        steamButton.classList.add(buttonClassName);
        steamButton.target = "_blank";
        titleElement.insertAdjacentElement('afterend', steamButton);
        console.log("GOG-Steam Script: Placeholder added. Fetching...");
        getDirectSteamLink(gameTitle, steamButton);
    };

    const mutationCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(titleSelector)) {
                            addSteamButton(node);
                        } else {
                            const titleElement = node.querySelector(titleSelector);
                            if (titleElement) {
                                addSteamButton(titleElement);
                            }
                        }
                    }
                });
            }
        }
    };

    const observer = new MutationObserver(mutationCallback);
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    console.log("GOG-Steam Script: Observer started.");

    const initialTitle = document.querySelector(titleSelector);
    if (initialTitle) {
        console.log("GOG-Steam Script: Found initial title.");
        addSteamButton(initialTitle);
    }

})();