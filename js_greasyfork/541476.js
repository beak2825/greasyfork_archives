// ==UserScript==
// @name         Comick List Date Viewer
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Click relative dates to show actual dates for Last Read, Updated, and Added columns.
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541476/Comick%20List%20Date%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/541476/Comick%20List%20Date%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rowSelector = '.flex.w-full.items-center.min-w-0';
    const dateKeys = ['readAt', 'uploadedAt', 'createdAt'];
    let comicDateMap = new Map();

    function extractUserIdFromUrl() {
        const parts = window.location.pathname.split('/');
        const idx = parts.indexOf('user');
        return idx !== -1 && parts[idx+1] ? parts[idx+1] : null;
    }

    async function fetchUserFollows(userId) {
        try {
            const res = await fetch(`https://api.comick.dev/user/${userId}/follows`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            console.error('Failed to fetch user follows:', e);
            return [];
        }
    }

    function buildComicDateMap(data) {
        comicDateMap.clear();
        data.forEach(item => {
            const comic = item.md_comics;
            if (!comic) return;
            const slug = comic.slug || comic.title;
            if (!slug) return;
            comicDateMap.set(slug, {
                readAt: item.read_at,
                uploadedAt: comic.uploaded_at,
                createdAt: item.created_at
            });
        });
    }

    function formatDate(dateString) {
        if (!dateString) return 'Never';
        const d = new Date(dateString);
        return d.toLocaleDateString();
    }

    function getComicSlugFromRow(row) {
        const link = row.querySelector('a[href*="/comic/"]');
        return link ? link.getAttribute('href').split('/comic/')[1] : null;
    }

    function onDateCellClick(e) {
        const cell = e.target.closest(`${rowSelector} > div`);
        if (!cell) return;
        const row = cell.parentElement;
        if (!row.matches(rowSelector)) return;

        const idx = Array.from(row.children).indexOf(cell);
        const total = row.children.length;
        const firstDateIndex = total - 3;
        if (idx < firstDateIndex) return;

        if (!cell.dataset.original) {
            cell.dataset.original = cell.textContent.trim();
        }

        const key = dateKeys[idx - firstDateIndex];
        const slug = getComicSlugFromRow(row);
        const data = slug ? comicDateMap.get(slug) : null;
        if (!data || !data[key]) return;

        if (cell.dataset.mode === 'absolute') {
            cell.textContent = cell.dataset.original;
            delete cell.dataset.mode;
        } else {
            cell.textContent = formatDate(data[key]);
            cell.dataset.mode = 'absolute';
        }
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
        ${rowSelector} > div:nth-last-child(-n+3) {
            cursor: pointer;
        }
        `;
        document.head.appendChild(style);
    }

    function initializeScript() {
        const uid = extractUserIdFromUrl();
        if (!uid || !window.location.pathname.includes('/user/') || !window.location.pathname.includes('/list')) return;
        fetchUserFollows(uid).then(follows => {
            buildComicDateMap(follows);
        });
    }

    (function() {
        const push = history.pushState;
        history.pushState = function() { push.apply(this, arguments); initializeScript(); };
        const replace = history.replaceState;
        history.replaceState = function() { replace.apply(this, arguments); initializeScript(); };
        window.addEventListener('popstate', initializeScript);
    })();

    injectStyles();
    document.addEventListener('click', onDateCellClick);
    initializeScript();
})();