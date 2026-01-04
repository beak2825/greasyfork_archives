// ==UserScript==
// @name         Add Trakt.tv Button to DebridMediaManager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Trakt.tv button that redirects to the corresponding Trakt.tv page
// @author       You
// @match        https://debridmediamanager.com/show/*
// @match        https://debridmediamanager.com/movie/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547387/Add%20Trakttv%20Button%20to%20DebridMediaManager.user.js
// @updateURL https://update.greasyfork.org/scripts/547387/Add%20Trakttv%20Button%20to%20DebridMediaManager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createTraktButton() {
        const url = window.location.href;
        const match = url.match(/\/(show|movie)\/(tt\d+)/);
        if (!match) return null;

        const [, type, imdbId] = match;
        const traktUrl = `https://trakt.tv/${type}s/${imdbId}`;

        const button = document.createElement('button');
        button.className = 'mb-1 mr-2 mt-0 rounded border-2 border-red-500 bg-red-900/30 p-1 text-xs text-red-100 transition-colors hover:bg-red-800/50';
        button.innerHTML = `
            <b class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="mr-1 h-3 w-3" aria-hidden="true">
                    <defs>
                        <radialGradient id="trakt-grad" cx="48.46" cy="-.95" r="64.84" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#9f42c6"/><stop offset=".27" stop-color="#a041c3"/>
                            <stop offset=".42" stop-color="#a43ebb"/><stop offset=".53" stop-color="#aa39ad"/>
                            <stop offset=".64" stop-color="#b4339a"/><stop offset=".73" stop-color="#c02b81"/>
                            <stop offset=".82" stop-color="#cf2061"/><stop offset=".9" stop-color="#e1143c"/>
                            <stop offset=".97" stop-color="#f50613"/><stop offset="1" stop-color="red"/>
                        </radialGradient>
                    </defs>
                    <path fill="url(#trakt-grad)" d="M48,11.26v25.47c0,6.22-5.05,11.27-11.27,11.27H11.26c-6.22,0-11.26-5.05-11.26-11.27V11.26C0,5.04,5.04,0,11.26,0h25.47c3.32,0,6.3,1.43,8.37,3.72.47.52.89,1.08,1.25,1.68.18.29.34.59.5.89.33.68.6,1.39.79,2.14.1.37.18.76.23,1.15.09.54.13,1.11.13,1.68Z"/>
                    <path fill="#fff" d="M13.62,17.97l7.92,7.92,1.47-1.47-7.92-7.92-1.47,1.47ZM28.01,32.37l1.47-1.46-2.16-2.16,20.32-20.32c-.19-.75-.46-1.46-.79-2.14l-22.46,22.46,3.62,3.62ZM12.92,18.67l-1.46,1.46,14.4,14.4,1.46-1.47-4.32-4.31L46.35,5.4c-.36-.6-.78-1.16-1.25-1.68l-23.56,23.56-8.62-8.61ZM47.87,9.58l-19.17,19.17,1.47,1.46,17.83-17.83v-1.12c0-.57-.04-1.14-.13-1.68ZM25.16,22.27l-7.92-7.92-1.47,1.47,7.92,7.92,1.47-1.47ZM41.32,35.12c0,3.42-2.78,6.2-6.2,6.2H12.88c-3.42,0-6.2-2.78-6.2-6.2V12.88c0-3.42,2.78-6.21,6.2-6.21h20.78v-2.07H12.88c-4.56,0-8.28,3.71-8.28,8.28v22.24c0,4.56,3.71,8.28,8.28,8.28h22.24c4.56,0,8.28-3.71,8.28-8.28v-3.51h-2.07v3.51Z"/>
                </svg>
                Trakt
            </b>
        `;
        
        button.onclick = () => window.open(traktUrl, '_blank');
        return button;
    }

    function insertButton() {
        const baseSelector = '#__next > div.min-h-screen.max-w-full.bg-gray-900.text-gray-100 > div.grid.auto-cols-auto.grid-flow-col.auto-rows-auto.gap-2';
        const targetDiv = document.querySelector(`${baseSelector} > div:nth-child(6)`) || 
                          document.querySelector(`${baseSelector} > div:nth-child(5)`);
        
        if (!targetDiv || targetDiv.querySelector('svg[viewBox="0 0 48 48"]')) return false;
        
        const button = createTraktButton();
        if (button) {
            targetDiv.insertBefore(button, targetDiv.firstChild);
            return true;
        }
        return false;
    }

    function init() {
        let attempts = 0;
        const retry = setInterval(() => {
            if (insertButton() || ++attempts >= 25) clearInterval(retry);
        }, 200);
    }

    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', init) : init();

    new MutationObserver(mutations => {
        if (mutations.some(m => m.type === 'childList' && 
            [...m.addedNodes].some(n => n.nodeType === 1 && 
                (n.querySelector?.('#__next') || n.id === '__next')))) {
            setTimeout(init, 100);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();