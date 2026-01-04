// ==UserScript==
// @name         AnimeList TimerBypass
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Advanced downloader with improved UI and animations
// @author       Aria Sikmind
// @match        *://animelist.tv/*
// @grant        GM_notification
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525294/AnimeList%20TimerBypass.user.js
// @updateURL https://update.greasyfork.org/scripts/525294/AnimeList%20TimerBypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        debug: false,
        showNotifications: true,
        animationDuration: 1000
    };

    function parseTokens() {
        try {
            const metaToken = document.querySelector('meta[name="_token"]');
            const _token = metaToken?.getAttribute('content');
            const scripts = [...document.querySelectorAll('script')]
                .find(s => s.textContent.includes('$.ajax'));
            const scriptContent = scripts?.textContent || '';

            const id = scriptContent.match(/id:\s*(\d+)/)?.[1];
            const request_token = scriptContent.match(/request_token:\s*['"]([^'"]+)['"]/)?.[1];
            const type = scriptContent.match(/data:\s*\{[^}]*type:\s*['"]([^'"]+)['"]/)?.[1];

            if (config.debug) {
                console.log('Parsed values:', { _token, id, request_token, type });
            }

            return { _token, id, request_token, type };
        } catch (error) {
            if (config.showNotifications) {
                GM_notification({
                    title: 'Parser Error',
                    text: error.message,
                    timeout: 5000
                });
            }
            return null;
        }
    }

    async function fetchDownloadLink(tokens) {
        try {
            const response = await fetch('https://animelist.tv/front-ajax/freedownload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': location.href
                },
                body: new URLSearchParams({
                    ...tokens,
                    type: tokens.type || 'anime'
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!data?.data) throw new Error('Invalid response format');

            return data.data;
        } catch (error) {
            if (config.showNotifications) {
                GM_notification({
                    title: 'Download Failed',
                    text: error.message,
                    timeout: 5000
                });
            }
            throw error;
        }
    }

    function createSuccessUI(downloadUrl) {
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600&family=Poppins:wght@400;500;600&display=swap');

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes vivid-rainbow {
                0% { color: #FF0000; }
                16% { color: #FFA500; }
                32% { color: #FFFF00; }
                48% { color: #00FF00; }
                64% { color: #00FFFF; }
                80% { color: #0000FF; }
                100% { color: #FF00FF; }
            }

            @keyframes heartbeat {
                0% { transform: scale(1); }
                15% { transform: scale(1.2); }
                30% { transform: scale(1); }
                45% { transform: scale(1.1); }
                60% { transform: scale(1); }
                100% { transform: scale(1); }
            }

            .sikmind-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.97);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn ${config.animationDuration}ms ease-out;
                font-family: 'Poppins', 'Segoe UI', system-ui, sans-serif;
                text-align: center;
                padding: 20px;
            }

            .sikmind-link {
                font-size: 1.4em;
                margin: 25px;
                padding: 15px 40px;
                background: #7B1FA2;
                border-radius: 8px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                text-decoration: none;
                color: white !important;
                border: 2px solid rgba(255,255,255,0.2);
                box-shadow: 0 4px 15px rgba(123,31,162,0.3);
                font-family: 'Nunito', sans-serif;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .sikmind-link:hover {
                transform: scale(1.05);
                background: #8E24AA;
                box-shadow: 0 0 25px 8px rgba(173, 79, 217, 0.5);
            }

            .sikmind-link::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 8px;
                box-shadow: 0 0 30px 12px rgba(173, 79, 217, 0.4);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .sikmind-link:hover::after {
                opacity: 1;
            }

            .vivid-rainbow {
                animation: vivid-rainbow 1.5s infinite;
                font-family: 'Nunito', sans-serif;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-decoration: none !important;
            }

            h1 {
                font-size: 2.4em;
                margin-bottom: 15px;
                font-weight: 600;
                letter-spacing: -0.5px;
                color: #E1BEE7;
            }

            p {
                font-size: 1.2em;
                margin-bottom: 25px;
                opacity: 0.9;
                max-width: 600px;
                line-height: 1.5;
                font-weight: 400;
                white-space: nowrap;
            }

            .purple-heart {
                font-size: 1.8em;
                margin-bottom: 10px;
                filter: drop-shadow(0 0 8px rgba(225, 190, 231, 0.6));
                animation: heartbeat 1.5s infinite;
                transform-origin: center;
            }

            .bypass-text {
                font-family: 'Nunito', sans-serif;
                font-size: 1.1em;
                letter-spacing: 0.3px;
            }
        `;

        const container = document.createElement('div');
        container.className = 'sikmind-container';

        container.innerHTML = `
            <div class="purple-heart">💜</div>
            <h1>Download Initialized</h1>
            <p>Your download should start automatically within a few moments</p>
            <a href="${downloadUrl}" class="sikmind-link" download>
                Start Manual Download
            </a>
            <div style="margin-top: 30px;" class="bypass-text">
                <span>Bypassed by </span>
                <a href="https://t.me/sikmind666"
                   class="vivid-rainbow"
                   target="_blank">sikmind666</a>
            </div>
        `;

        document.head.appendChild(style);
        document.body.appendChild(container);
    }

    async function mainController() {
        const tokens = parseTokens();
        if (!tokens) return;

        try {
            const downloadUrl = await fetchDownloadLink(tokens);

            // Auto-start download
            const tempLink = document.createElement('a');
            tempLink.href = downloadUrl;
            tempLink.download = true;
            tempLink.click();

            // Create permanent UI overlay
            createSuccessUI(downloadUrl);

        } catch (error) {
            if (config.debug) console.error('Main flow error:', error);
        }
    }

    (function init() {
        if (document.readyState === 'complete') {
            mainController();
        } else {
            window.addEventListener('load', mainController);
        }
    })();
})();