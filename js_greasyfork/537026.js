// ==UserScript==
// @name         App Store Metadata Viewer
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Displays bundle ID & full metadata on App Store pages with advanced features, copy/export buttons, and improved UI
// @author       sharmanhall
// @match        https://apps.apple.com/*/app/*/id*
// @match        https://apps.apple.com/app/id*
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @downloadURL https://update.greasyfork.org/scripts/537026/App%20Store%20Metadata%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/537026/App%20Store%20Metadata%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settings = {
        displayMode: 'overlay',
        autoCopy: false
    };

    GM_registerMenuCommand('Toggle Display Mode', () => {
        settings.displayMode = settings.displayMode === 'overlay' ? 'inline' : 'overlay';
        alert(`Switched to: ${settings.displayMode}`);
        location.reload();
    });

    GM_registerMenuCommand('Toggle Auto-Copy', () => {
        settings.autoCopy = !settings.autoCopy;
        alert(`Auto-copy is now ${settings.autoCopy ? 'enabled' : 'disabled'}`);
    });

    function waitForAppId(attempt = 0) {
        const appIdMatch = window.location.href.match(/id(\d+)/);
        if (!appIdMatch && attempt < 10) {
            return setTimeout(() => waitForAppId(attempt + 1), 1000);
        } else if (!appIdMatch) {
            console.error('[Metadata Viewer] App ID not found.');
            return;
        }
        fetchAppData(appIdMatch[1]);
    }

    async function fetchAppData(appId) {
        const lookupUrl = `https://itunes.apple.com/lookup?id=${appId}`;
        try {
            const res = await fetch(lookupUrl);
            const data = await res.json();
            if (!data.results || !data.results.length) throw 'No results';
            showInfo(data.results[0]);
        } catch (err) {
            console.error('[Metadata Viewer] Failed to fetch metadata:', err);
        }
    }

    function formatBytes(bytes) {
        const kb = bytes / 1024;
        if (kb < 1024) return `${Math.round(kb)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    }

    function showInfo(app) {
        const {
            bundleId,
            version,
            minimumOsVersion,
            releaseDate,
            primaryGenreName,
            languageCodesISO2A,
            fileSizeBytes,
            sellerName,
            trackViewUrl
        } = app;

        const country = new URL(window.location.href).pathname.split('/')[1].toUpperCase();
        const lang = languageCodesISO2A?.join(', ') || 'N/A';

        const infoHTML = `
            <div id="bundle-id-widget" style="font-family: 'Segoe UI', Roboto, monospace; font-size: 13px; line-height: 1.8;">
                <div style="margin-bottom: 8px;"><strong>📦 Bundle ID:</strong> ${bundleId}</div>
                <div><strong>👨‍💻 Developer:</strong> ${sellerName}</div>
                <div><strong>📱 Version:</strong> ${version}</div>
                <div><strong>📅 Release Date:</strong> ${releaseDate?.split('T')[0]}</div>
                <div><strong>📂 Size:</strong> ${formatBytes(fileSizeBytes)}</div>
                <div><strong>🧭 Min OS:</strong> ${minimumOsVersion || 'N/A'}</div>
                <div><strong>🗂 Genre:</strong> ${primaryGenreName}</div>
                <div><strong>🌍 Country:</strong> ${country}</div>
                <div style="margin-bottom: 12px;"><strong>🗣️ Language(s):</strong> ${lang}</div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="copyBtn" style="background:#1E88E5;color:white;border:none;padding:6px 10px;border-radius:5px;cursor:pointer;">📋 Copy Bundle ID</button>
                    <button id="jsonBtn" style="background:#333;color:white;border:none;padding:6px 10px;border-radius:5px;cursor:pointer;">🗄 Export JSON</button>
                    <a href="${trackViewUrl}" target="_blank" style="color:#42A5F5;text-decoration:none;padding:6px 10px;border-radius:5px;background:#222;display:inline-block;">🔗 View on App Store</a>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = infoHTML;

        if (settings.displayMode === 'inline') {
            container.style.background = '#f9f9f9';
            container.style.padding = '14px';
            container.style.border = '1px solid #ccc';
            container.style.borderRadius = '8px';
            container.style.marginTop = '20px';
            const target = document.querySelector('h1') || document.body;
            target.parentElement.insertBefore(container, target.nextSibling);
        } else {
            Object.assign(container.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#111',
                color: '#fff',
                padding: '16px',
                borderRadius: '10px',
                boxShadow: '0 0 16px rgba(0,0,0,0.6)',
                zIndex: 99999,
                maxWidth: '300px',
                opacity: '85%'
            });
            document.body.appendChild(container);
        }

        const copyBtn = document.getElementById('copyBtn');
        copyBtn.onclick = () => {
            (typeof GM_setClipboard === 'function' ? GM_setClipboard : navigator.clipboard.writeText)(bundleId);
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => (copyBtn.textContent = '📋 Copy Bundle ID'), 1500);
        };

        const jsonBtn = document.getElementById('jsonBtn');
        jsonBtn.onclick = () => {
            const blob = new Blob([JSON.stringify(app, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            GM_download({ url, name: `bundleinfo-${bundleId}.json` });
        };

        if (settings.autoCopy) {
            (typeof GM_setClipboard === 'function' ? GM_setClipboard : navigator.clipboard.writeText)(bundleId);
        }
    }

    window.addEventListener('load', waitForAppId);
})();
