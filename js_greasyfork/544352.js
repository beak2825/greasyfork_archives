// ==UserScript==
// @name         Fuck-OpenAI-Sharing-Tab
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Obliterates ChatGPT's sneaky share button, blocks all sharing, and flexes with a status badge saying it's working. Stay private, stay badass.
// @author       Echo V2 (echoZ)
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544352/Fuck-OpenAI-Sharing-Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/544352/Fuck-OpenAI-Sharing-Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ✅ Create a status badge to confirm script is alive
    function createStatusBadge() {
        if (document.getElementById('fuck-openai-status')) return;

        const badge = document.createElement('div');
        badge.id = 'fuck-openai-status';
        badge.innerText = '🚫 Fuck OpenAI Sharing Tab: ACTIVE';
        Object.assign(badge.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#ff0033',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
            zIndex: 99999,
            opacity: '0.95',
        });

        document.body.appendChild(badge);
        setTimeout(() => { badge.remove(); }, 4500);
    }

    // ✅ Remove share button and fix layout
    function nukeShareIcon() {
        const shareIcons = Array.from(document.querySelectorAll('button, svg, a'))
            .filter(el =>
                el.getAttribute('aria-label')?.toLowerCase() === 'share' ||
                el.closest('[aria-label="Share"]') ||
                (el.tagName === 'svg' && el.outerHTML.includes('share'))
            )
            .map(el => el.closest('button') || el);

        shareIcons.forEach(icon => {
            console.log('💀 Fuck-OpenAI-Sharing-Tab eliminated:', icon);
            icon.remove();
        });

        // Slide over the menu dots if the gap appears
        const menuDots = document.querySelector('[aria-label="More options"], button svg[aria-label="More"]');
        if (menuDots) menuDots.style.marginLeft = '4px';
    }

    // ✅ Verify if site is correct and then fire script
    function checkSiteAndInit() {
        const valid = /chatgpt\.com|chat\.openai\.com/.test(window.location.hostname);
        if (!valid) return;

        console.log('🚫 Fuck OpenAI Sharing Tab activated on', window.location.hostname);
        createStatusBadge();
        nukeShareIcon();

        // Keep killing any new share buttons that respawn
        const observer = new MutationObserver(() => nukeShareIcon());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 🔥 DOM Ready check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkSiteAndInit);
    } else {
        checkSiteAndInit();
    }
})();