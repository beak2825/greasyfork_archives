// ==UserScript==
// @name         Export Stream Link to .m3u for Stremio Web
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-clicks "Copy stream link", grabs clipboard, saves .m3u — with toggle, shortcut, persistence, and proper title detection!
// @author       heapsofjoy
// @match        https://web.stremio.com/*
// @grant        clipboardRead
// @downloadURL https://update.greasyfork.org/scripts/541729/Export%20Stream%20Link%20to%20m3u%20for%20Stremio%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/541729/Export%20Stream%20Link%20to%20m3u%20for%20Stremio%20Web.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = localStorage.getItem('m3uExportEnabled') !== 'false';

    const toggle = document.createElement('div');
    toggle.textContent = `📄 .m3u: ${enabled ? 'ON' : 'OFF'}`;
    Object.assign(toggle.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 9999,
        padding: '4px 10px',
        backgroundColor: '#1f1f1fbb',
        color: '#ffffffcc',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        borderRadius: '6px',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: enabled ? '1' : '0.6',
        transition: 'all 0.3s ease',
    });

    toggle.addEventListener('mouseenter', () => {
        toggle.style.backgroundColor = '#2ecc71';
        toggle.style.color = '#fff';
    });

    toggle.addEventListener('mouseleave', () => {
        toggle.style.backgroundColor = '#1f1f1fbb';
        toggle.style.color = '#ffffffcc';
    });

    toggle.addEventListener('click', () => {
        enabled = !enabled;
        toggle.textContent = `📄 .m3u: ${enabled ? 'ON' : 'OFF'}`;
        toggle.style.opacity = enabled ? '1' : '0.6';
        localStorage.setItem('m3uExportEnabled', enabled);
        console.log(`📄 .m3u export is now ${enabled ? 'enabled ✅' : 'disabled ❌'}`);
    });

    document.body.appendChild(toggle);

    // Hide toggle on player page
    function updateToggleVisibility() {
        toggle.style.display = location.hash.startsWith('#/player') ? 'none' : 'block';
    }
    updateToggleVisibility();
    const observer = new MutationObserver(updateToggleVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', updateToggleVisibility);

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'M') {
            toggle.click();
        }
    });


    document.addEventListener('contextmenu', () => {
        if (!enabled) return;

        setTimeout(() => {
            const copyButton = [...document.querySelectorAll('div[title="Copy stream link"]')]
                .find(el => el?.innerText?.toLowerCase().includes('copy stream link'));

            if (!copyButton) {
                console.warn('No "Copy stream link" button found');
                return;
            }

            copyButton.click();

            setTimeout(async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (!text.startsWith('http')) {
                        alert('❌ Invalid stream URL in clipboard');
                        return;
                    }

                    // 1. Try logo image title
                    let titleImg = document.querySelector('img.logo-X3hTV[title]');
                    let title = titleImg?.getAttribute('title')?.trim();

                    // 2. Fallback: logo placeholder div inside meta-info container
                    if (!title) {
                        const placeholder = document.querySelector('.meta-info-container-ub8AH > div[class^="logo-placeholder-"]');
                        title = placeholder?.textContent?.trim();
                    }

                    // 3. Fallback: document title
                    if (!title) {
                        title = document.title;
                    }

                    // Sanitize
                    title = title.replace(/[^\w\d]+/g, '_').slice(0, 40) || 'stream';


                    const m3u = `#EXTM3U\n${text}`;
                    const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `${title}.m3u`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                    console.log(`✅ Saved .m3u as "${title}.m3u" with link:`, text);
                } catch (err) {
                    alert('❌ Failed to access clipboard. Permissions may be blocked.\n' + err);
                }
            }, 500);
        }, 150);
    });
})();
