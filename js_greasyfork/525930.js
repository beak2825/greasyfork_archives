// ==UserScript==
// @name         Nexus Mods Fast Download
// @namespace    https://greasyfork.org/en/users/814191-ctosango
// @version      1.1
// @description  Overrides the "Manual" button on NexusMods mod pages to download the file without extra steps.
// @author       Your Name
// @match        https://www.nexusmods.com/*/mods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525930/Nexus%20Mods%20Fast%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/525930/Nexus%20Mods%20Fast%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const spinnerCSS = `
        @keyframes spinner {
            to { transform: rotate(360deg); }
        }
        .nm-download-spinner {
            border: 2px solid rgba(0,0,0,0.2);
            border-left-color: #000;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            margin: 0 5px 0 0;
            animation: spinner 0.6s linear infinite;
            display: inline-block;
            vertical-align: middle;
        }
        .nm-download-error {
            color: red;
            font-size: 0.9em;
            position: absolute;
            top: -20px;
            text-wrap: nowrap;
            right: 0;
        }
        @media (max-width: 1280px) {
            .nm-download-error {
              left: 0;
              right: unset;
            }
        }
        .modactions.clearfix {
            position: relative;
            margin-top: 15px;
        }
    `;
    const style = document.createElement('style');
    style.textContent = spinnerCSS;
    document.head.appendChild(style);

    function showError(message, manualBtn) {
        console.error(message);
        let errorEl = manualBtn.parentNode.querySelector('.nm-download-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'nm-download-error';
            manualBtn.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function clearError(manualBtn) {
        const errorEl = manualBtn.parentNode.querySelector('.nm-download-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    function setupManualButton() {
        const manualLi = document.getElementById('action-manual');
        if (!manualLi) return;
        const manualBtn = manualLi.querySelector('a.btn.inline-flex');
        if (!manualBtn) return;

        if (manualBtn.dataset.downloadOverrideSet === "true") return;

        observer.disconnect();

        if (!manualBtn.dataset.originalHref) {
            manualBtn.dataset.originalHref = manualBtn.href;
        }

        manualBtn.removeAttribute('href');

        manualBtn.dataset.downloadOverrideSet = "true";

        const svgIcon = manualBtn.querySelector('svg.icon');
        if (svgIcon && !manualBtn._originalSvg) {
            manualBtn._originalSvg = svgIcon.cloneNode(true);
        }

        manualBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            clearError(manualBtn);

            let spinner;
            const currentSvg = manualBtn.querySelector('svg.icon');
            if (currentSvg) {
                spinner = document.createElement('span');
                spinner.className = 'nm-download-spinner';
                currentSvg.parentNode.replaceChild(spinner, currentSvg);
            } else {
                spinner = document.createElement('span');
                spinner.className = 'nm-download-spinner';
                manualBtn.appendChild(spinner);
            }

            const originalUrl = manualBtn.dataset.originalHref;
            if (!originalUrl) {
                showError("Error: Original URL not available.", manualBtn);
                spinner.remove();
                return;
            }

            let urlObj;
            try {
                urlObj = new URL(originalUrl, location.href);
            } catch (err) {
                showError("Error parsing the original URL.", manualBtn);
                spinner.remove();
                return;
            }
            const fileId = urlObj.searchParams.get('file_id');
            if (!fileId) {
                showError("Error: No file_id found in the URL.", manualBtn);
                spinner.remove();
                window.location.href = originalUrl;
                return;
            }

            const gameId = window.current_game_id;
            if (!gameId) {
                showError("Error: Variable current_game_id is unavailable.", manualBtn);
                spinner.remove();
                if (manualBtn._originalSvg) {
                    spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                }
                return;
            }

            const params = new URLSearchParams();
            params.append('fid', fileId);
            params.append('game_id', gameId);

            const postUrl = 'https://www.nexusmods.com/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl=';

            try {
                const response = await fetch(postUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: params.toString()
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        showError("Error: Not logged in or access denied.", manualBtn);
                    } else {
                        showError("Error: Failed to get download URL (" + response.statusText + ").", manualBtn);
                    }
                    if (spinner && spinner.parentNode && manualBtn._originalSvg) {
                        spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                    }
                    return;
                }

                const data = await response.json();
                if (data && data.url) {
                    if (spinner && spinner.parentNode && manualBtn._originalSvg) {
                        spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                    }
                    setTimeout(() => {
                        window.location.href = data.url;
                    }, 100);
                } else if (data && data.length === 0) {
                    showError("Error: Please login to download mods.", manualBtn);
                    if (spinner && spinner.parentNode && manualBtn._originalSvg) {
                        spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                    }
                } else {
                    console.log(data);
                    showError("Error: Unexpected response format.", manualBtn);
                    if (spinner && spinner.parentNode && manualBtn._originalSvg) {
                        spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                    }
                }
            } catch (err) {
                showError("Error during POST request: " + err.message, manualBtn);
                if (spinner && spinner.parentNode && manualBtn._originalSvg) {
                    spinner.parentNode.replaceChild(manualBtn._originalSvg, spinner);
                }
            }
        }, true);

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const observer = new MutationObserver(() => {
        setupManualButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupManualButton);
    } else {
        setupManualButton();
    }
})();
