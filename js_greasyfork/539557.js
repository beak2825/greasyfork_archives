// ==UserScript==
// @name               ChatGPT Message Navigator
// @name:de            ChatGPT Nachrichten-Navigator
// @namespace          https://greasyfork.org/users/928242
// @version            1.0.3
// @description        Seamlessly browse ChatGPT conversation messages with handy up/down buttons and highlighting
// @description:de     Bequem durch ChatGPT-Nachrichten navigieren mit Auf-/Ab-Tasten und Hervorhebung
// @author             Kamikaze (https://github.com/Kamiikaze)
// @supportURL         https://github.com/Kamiikaze/Tampermonkey/issues
// @icon               https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match              https://chatgpt.com/c/*
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/539557/ChatGPT%20Message%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/539557/ChatGPT%20Message%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = 0;
    let previousElement = null;
    let highlightTimeout = null;
    const HIGHLIGHT_DURATION = 1;

    console.log('[Navigator] Initializing script');

    // Inject shared styles
    const style = document.createElement('style');
    style.textContent = `
        .navigator-ui { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; position: relative; z-index: 1000; }
        .navigator-ui button, .navigator-ui span { font-family: sans-serif; }
        .navigator-ui button { padding: 4px 11px; border-radius: 4px; cursor: pointer; transition: background-color .3s, color .3s, border-color .3s; }
        .navigator-ui span { font-size: 12px; }
        .navigator-ui.dark button { background-color: #333; color: #eee; border: 1px solid #555; }
        .navigator-ui.dark button:hover { background-color: rgba(255,255,255,0.16); }
        .navigator-ui.dark span { color: #ccc; }
        .navigator-ui.light button { background-color: #fff; color: #333; border: 1px solid #888; }
        .navigator-ui.light button:hover { background-color: rgba(0,0,0,0.16); }
        .navigator-ui.light span { color: #444; }
        .navigator-highlight { box-shadow: 0 0 0 2px var(--highlight-color) inset; transition: box-shadow 0.5s ease-in-out; }
    `;
    document.head.appendChild(style);

    function getTurns() {
        const turns = Array.from(document.querySelectorAll('article[data-testid^="conversation-turn"]'));
        console.log(`[Navigator] Found ${turns.length} turns`);
        return turns;
    }

    function getTheme() {
        const theme = window.localStorage.theme === 'dark' || document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        console.log(`[Navigator] Current theme: ${theme}`);
        return theme;
    }

    function getHighlightColor() {
        const color = getTheme() === 'dark'
            ? 'rgba(38,198,218,0.6)'
            : 'rgba(255,235,59,0.6)';
        console.log(`[Navigator] Highlight color: ${color}`);
        return color;
    }

    function highlight(node) {
        clearTimeout(highlightTimeout);
        console.log('[Navigator] Highlighting element', node);
        if (previousElement) {
            previousElement.classList.remove('navigator-highlight');
            previousElement.style.boxShadow = '';
        }
        node.classList.add('navigator-highlight');
        node.style.boxShadow = `0 0 0 2px ${getHighlightColor()} inset`;
        previousElement = node;
        highlightTimeout = setTimeout(() => {
            console.log('[Navigator] Clearing highlight');
            node.style.boxShadow = '';
            previousElement = null;
        }, HIGHLIGHT_DURATION*2000);
    }

    let counterSpan;
    function updateCounter() {
        const turns = getTurns();
        counterSpan.textContent = `${turns.length ? currentIndex + 1 : 0} / ${turns.length}`;
        console.log(`[Navigator] Updated counter to ${counterSpan.textContent}`);
    }

    function navigateTo(index) {
        console.log(`[Navigator] navigateTo index ${index}`);
        const turns = getTurns(); if (!turns.length) return;
        currentIndex = Math.max(0, Math.min(index, turns.length - 1));
        console.log(`[Navigator] Setting currentIndex to ${currentIndex}`);
        const target = turns[currentIndex];
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        highlight(target);
        updateCounter();
    }

    function createNavigationUI() {
        console.log('[Navigator] Creating navigation UI');
        const parentContainer = document.querySelector('#thread-bottom-container div[class*="--thread-content-max-width"]');
        if (!parentContainer) {
            console.log('[Navigator] parentContainer not found');
            return;
        }
        const container = document.createElement('div');
        container.className = `navigator-ui ${getTheme()}`;

        const up = document.createElement('button'); up.textContent = '↑';
        const down = document.createElement('button'); down.textContent = '↓';
        up.addEventListener('click', () => navigateTo(currentIndex - 1));
        down.addEventListener('click', () => navigateTo(currentIndex + 1));
        counterSpan = document.createElement('span');

        container.append(up, counterSpan, down);
        parentContainer.appendChild(container);

        currentIndex = getTurns().length - 1;
        console.log(`[Navigator] Initial currentIndex set to ${currentIndex}`);
        updateCounter();
    }

    function resetNavigation() {
        console.log('[Navigator] Reset navigation state');
        currentIndex = getTurns().length - 1;
        if (previousElement) {
            previousElement.classList.remove('navigator-highlight');
            previousElement.style.boxShadow = '';
        }
        previousElement = null;
        clearTimeout(highlightTimeout);
        updateCounter();
    }

    ['pushState','replaceState'].forEach(m => {
        const orig = history[m]; history[m] = function() { orig.apply(this, arguments); console.log(`[Navigator] history.${m} called`); window.dispatchEvent(new Event('navigation-changed')); };
    });
    window.addEventListener('popstate', () => { console.log('[Navigator] popstate'); window.dispatchEvent(new Event('navigation-changed')); });
    window.addEventListener('navigation-changed', resetNavigation);

    const observer = new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.matches('article[data-testid^="conversation-turn"]')) {
                console.log('[Navigator] New conversation-turn detected');
                resetNavigation();
            }
        }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    (function initOnMessages() {
        console.log('[Navigator] Waiting for initial messages');
        if (getTurns().length) {
            createNavigationUI();
            return;
        }
        const initObserver = new MutationObserver((_, obs) => {
            if (getTurns().length) {
                console.log('[Navigator] Initial messages loaded');
                createNavigationUI();
                obs.disconnect();
            }
        });
        initObserver.observe(document.body, { childList: true, subtree: true });
    })();
})();
