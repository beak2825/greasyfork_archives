// ==UserScript==
// @name         Motherless.com - Advanced Gallery Sorter
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Sorts videos on motherless.com with an advanced, panel-based UI. Supports Title, Views, Duration, Uploader, Random, and "Deep Sort" options (Upload Date, Favorites, Comments, Resolution, Engagement). Fetches all gallery pages for comprehensive sorting and provides pagination. Features a sleek dark mode UI.
// @author       baratheonblight75
// @match        *://*.motherless.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537637/Motherlesscom%20-%20Advanced%20Gallery%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/537637/Motherlesscom%20-%20Advanced%20Gallery%20Sorter.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const VIDEO_ITEM_SELECTOR = 'div.thumb-container.video';
    const VIDEOS_PER_PAGE_DISPLAY = 2500;
    const MAX_CONCURRENT_DEEP_FETCHES = 5;
    const DEFAULT_SORT_ID = 'views';
    const DEFAULT_SORT_DIR = 'desc';

    // --- SVG Icons ---
    const SVG_ICONS = {
        filter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>',
        close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',
        title: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 8h4l-4 8h4" /><path d="M4 16v-6a2 2 0 1 1 4 0v6" /><path d="M4 13h4" /><path d="M11 12h2" /></svg>',
        views: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
        duration: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l3 2" /><path d="M12 7v5" /></svg>',
        uploader: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>',
        uploadDate: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" /></svg>',
        favorites: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>',
        comments: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /></svg>',
        resolution: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /><path d="M7 15v-6" /><path d="M10 15v-6" /><path d="M7 12h3" /></svg>',
        random: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" /></svg>',
        arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" /></svg>',
        arrowDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" /></svg>'
    };

    // --- Sort Definitions ---
    const SORT_DEFINITIONS = [
        { group: "Basic Sorts", id: 'title', label: 'Title', svgIcon: SVG_ICONS.title, defaultDir: 'asc', deepScan: false, keys: { asc: 'titleAZ', desc: 'titleZA' } },
        { group: "Basic Sorts", id: 'views', label: 'Views', svgIcon: SVG_ICONS.views, defaultDir: 'desc', deepScan: false, keys: { asc: 'viewsLeast', desc: 'viewsMost' } },
        { group: "Basic Sorts", id: 'duration', label: 'Duration', svgIcon: SVG_ICONS.duration, defaultDir: 'desc', deepScan: false, keys: { asc: 'durationShortest', desc: 'durationLongest' } },
        { group: "Basic Sorts", id: 'uploader', label: 'Uploader', svgIcon: SVG_ICONS.uploader, defaultDir: 'asc', deepScan: false, keys: { asc: 'uploaderAZ', desc: 'uploaderZA' } },
        { group: "Advanced Sorts (Deep Scan)", id: 'uploadDate', label: 'Upload Date', svgIcon: SVG_ICONS.uploadDate, defaultDir: 'desc', deepScan: true, keys: { asc: 'deep:uploadDateOldest', desc: 'deep:uploadDateNewest' } },
        { group: "Advanced Sorts (Deep Scan)", id: 'favorites', label: 'Favorites', svgIcon: SVG_ICONS.favorites, defaultDir: 'desc', deepScan: true, keys: { asc: 'deep:favoritesLeast', desc: 'deep:favoritesMost' } },
        { group: "Advanced Sorts (Deep Scan)", id: 'comments', label: 'Comments', svgIcon: SVG_ICONS.comments, defaultDir: 'desc', deepScan: true, keys: { asc: 'deep:commentsLeast', desc: 'deep:commentsMost' } },
        { group: "Advanced Sorts (Deep Scan)", id: 'resolution', label: 'Resolution', svgIcon: SVG_ICONS.resolution, defaultDir: 'desc', deepScan: true, keys: { asc: 'deep:resolutionLowest', desc: 'deep:resolutionHighest' } },
        {
            group: "Engagement Sorts (Deep Scan)", id: 'engagementComments', label: 'Comments/View',
            svgMain: SVG_ICONS.comments, svgBadge: SVG_ICONS.views,
            defaultDir: 'desc', deepScan: true,
            keys: { asc: 'deep:engagementCommentsLeast', desc: 'deep:engagementCommentsMost' }
        },
        {
            group: "Engagement Sorts (Deep Scan)", id: 'engagementFavorites', label: 'Favorites/View',
            svgMain: SVG_ICONS.favorites, svgBadge: SVG_ICONS.views,
            defaultDir: 'desc', deepScan: true,
            keys: { asc: 'deep:engagementFavoritesLeast', desc: 'deep:engagementFavoritesMost' }
        },
        { group: "Other", id: 'random', label: 'Random', svgIcon: SVG_ICONS.random, noDirection: true, deepScan: false, key: 'random' }
    ];

    // --- Helper Functions ---
    function parseViews(text) {
        if (typeof text !== 'string') return 0;
        text = text.trim().toLowerCase();
        let multiplier = 1;
        if (text.includes('k')) multiplier = 1000;
        if (text.includes('m')) multiplier = 1000000;
        let number = parseFloat(text.replace(/[^0-9.]/g, ''));
        return isNaN(number) ? 0 : Math.round(number * multiplier);
    }

    function parseDurationToSeconds(durationStr) {
        if (!durationStr || typeof durationStr !== 'string') return 0;
        const parts = durationStr.trim().split(':').map(part => parseInt(part, 10));
        let seconds = 0;
        const validParts = parts.filter(p => !isNaN(p));
        if (validParts.length === 2) seconds = validParts[0] * 60 + validParts[1];
        else if (validParts.length === 3) seconds = validParts[0] * 3600 + validParts[1] * 60 + validParts[2];
        else if (validParts.length === 1) seconds = validParts[0];
        return isNaN(seconds) ? 0 : seconds;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Deep Data Parsing Functions ---
    function parseUploadDate(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') return null;
        try { const date = new Date(dateStr.trim()); return isNaN(date.getTime()) ? null : date; }
        catch (e) { console.warn("Could not parse date:", dateStr, e); return null; }
    }
    function parseFavorites(favStr) {
        if (!favStr || typeof favStr !== 'string') return null;
        const num = parseInt(favStr.replace(/[^0-9]/g, ''), 10); return isNaN(num) ? null : num;
    }
    function parseComments(commentStr) {
        if (!commentStr || typeof commentStr !== 'string') return null;
        const num = parseInt(commentStr.replace(/[^0-9]/g, ''), 10); return isNaN(num) ? null : num;
    }
    function parseResolution(resStr) {
        if (!resStr || typeof resStr !== 'string') return null;
        const num = parseInt(resStr.replace(/[^0-9]/g, ''), 10); return isNaN(num) ? null : num;
    }

    // --- UI Styling ---
    const newStyles = `
    :root {
        --mvs-bg-deep: #1A1A1A;
        --mvs-bg-panel: #282828;
        --mvs-bg-header-footer: #333333;
        --mvs-bg-element: #3C3C3C;
        --mvs-bg-hover: #454545;
        --mvs-bg-active: #505050;
        --mvs-border-strong: #555555;
        --mvs-border-medium: #4A4A4A;
        --mvs-border-light: #404040;
        --mvs-text-primary: #E0E0E0;
        --mvs-text-secondary: #AAAAAA;
        --mvs-text-disabled: #777777;
        --mvs-accent-primary: #606060;
        --mvs-accent-hover: #707070;
    }

    #mvs-sort-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 100000;
        background-color: var(--mvs-accent-primary);
        color: var(--mvs-text-primary);
        border: none;
        padding: 0;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    #mvs-sort-toggle-btn:hover {
        background-color: var(--mvs-accent-hover);
        transform: translateY(-2px);
        box-shadow: 0 5px 12px rgba(0,0,0,0.6);
    }
    #mvs-sort-toggle-btn svg {
        width: 28px;
        height: 28px;
        stroke: currentColor;
    }

    #mvs-sort-panel-container {
        position: fixed;
        bottom: 85px;
        right: 20px;
        width: 280px; /* Further reduced width for "squished" look */
        max-height: auto; /* Height will be determined by content */
        background-color: var(--mvs-bg-panel);
        color: var(--mvs-text-primary);
        border: 1px solid var(--mvs-border-medium);
        border-radius: 8px; /* Slightly less rounded for compact look */
        box-shadow: 0 4px 15px rgba(0,0,0,0.35);
        z-index: 99999;
        font-family: 'Segoe UI', Arial, sans-serif;
        display: none;
        flex-direction: column;
        overflow: hidden;
    }
    .mvs-panel-header {
        padding: 10px 15px; /* Reduced padding */
        background-color: var(--mvs-bg-header-footer);
        /* No border-bottom needed if panel body is gone and footer is next */
        display: flex;
        flex-direction: column;
        gap: 8px; /* Reduced gap */
        align-items: flex-start;
    }
    .mvs-panel-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .mvs-panel-header h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--mvs-text-primary);
    }
    .mvs-panel-close-btn {
        background: none;
        border: none;
        color: var(--mvs-text-secondary);
        cursor: pointer;
        padding: 5px;
        line-height: 1;
        border-radius: 50%;
        transition: background-color 0.15s, color 0.15s;
    }
    .mvs-panel-close-btn:hover {
        color: var(--mvs-text-primary);
        background-color: var(--mvs-bg-hover);
    }
    .mvs-panel-close-btn svg {
        width: 18px; /* Smaller close icon */
        height: 18px;
        stroke: currentColor;
    }
    #mvs-primary-sort-select {
        width: 100%;
        padding: 8px 10px; /* Reduced padding */
        background-color: var(--mvs-bg-element);
        color: var(--mvs-text-primary);
        border: 1px solid var(--mvs-border-medium);
        border-radius: 5px; /* Reduced radius */
        font-size: 13px; /* Reduced font size */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23E0E0E0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.4-5.4-13z%22%2F%3E%3C%2Fsvg%3E');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 10px 10px;
        padding-right: 30px;
        transition: border-color 0.15s, background-color 0.15s;
    }
    #mvs-primary-sort-select:hover {
        border-color: var(--mvs-border-strong);
    }
    #mvs-primary-sort-select option {
        background-color: var(--mvs-bg-element);
        color: var(--mvs-text-primary);
        font-size: 13px; /* Ensure option font size matches select */
    }
    #mvs-primary-sort-select optgroup {
        background-color: var(--mvs-bg-header-footer);
        color: var(--mvs-text-secondary);
        font-style: italic;
        font-weight: normal;
    }
    #mvs-primary-sort-select optgroup option {
        background-color: var(--mvs-bg-element);
        color: var(--mvs-text-primary);
        font-style: normal;
    }

    .mvs-panel-body {
        display: none; /* Hide panel body as it's no longer used */
        padding: 0;
    }

    .mvs-sort-direction-controls { /* This is inside .mvs-panel-header in HTML */
        display: flex;
        align-items: center;
        margin-left: 0;
        margin-top: 4px; /* Reduced top margin */
        background-color: var(--mvs-bg-element);
        border-radius: 5px; /* Reduced radius */
        padding: 3px; /* Reduced padding */
        border: 1px solid var(--mvs-border-medium);
    }
    .mvs-dir-btn {
        flex-grow: 1;
        background: transparent;
        border: none;
        color: var(--mvs-text-secondary);
        padding: 5px; /* Reduced padding */
        margin: 0 1px; /* Reduced margin */
        border-radius: 3px; /* Reduced radius */
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.15s, color 0.15s;
    }
    .mvs-dir-btn:hover {
        color: var(--mvs-text-primary);
        background-color: var(--mvs-bg-hover);
    }
    .mvs-dir-btn.mvs-active-dir {
        background-color: var(--mvs-accent-primary);
        color: var(--mvs-text-primary);
    }
    .mvs-dir-btn svg {
        width: 16px; /* Reduced icon size */
        height: 16px;
        stroke: currentColor;
    }
    .mvs-panel-footer {
        padding: 10px 15px; /* Reduced padding */
        background-color: var(--mvs-bg-header-footer);
        border-top: 1px solid var(--mvs-border-medium); /* Keep top border for separation */
        display: flex;
        justify-content: space-between; /* Space out buttons for compact footer */
        gap: 8px;
    }
    .mvs-panel-action-btn {
        padding: 8px 12px; /* Reduced padding */
        flex-grow: 1; /* Make buttons take equal space in footer */
        text-align: center; /* Center text in button */
        border-radius: 5px; /* Reduced radius */
        font-size: 12px; /* Reduced font size */
        font-weight: 600;
        cursor: pointer;
        border: none;
        color: var(--mvs-text-primary);
        transition: background-color 0.2s, transform 0.1s;
    }
    .mvs-panel-action-btn:active {
        transform: scale(0.98);
    }
    .mvs-panel-action-btn.mvs-apply-btn {
        background-color: var(--mvs-accent-primary);
    }
    .mvs-panel-action-btn.mvs-apply-btn:hover {
        background-color: var(--mvs-accent-hover);
    }
    .mvs-panel-action-btn.mvs-clear-btn {
        background-color: var(--mvs-bg-element);
    }
    .mvs-panel-action-btn.mvs-clear-btn:hover {
        background-color: var(--mvs-bg-hover);
    }

    #loading-indicator {
        background-color: rgba(30, 30, 30, 0.9) !important;
        color: var(--mvs-text-primary) !important;
        padding: 25px 30px !important;
        border-radius: 8px !important;
        border: 1px solid var(--mvs-border-medium) !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
        font-family: 'Segoe UI', Arial, sans-serif !important;
        font-size: 18px !important;
        font-weight: 500 !important;
    }
    #pagination-controls {
        background-color: var(--mvs-bg-header-footer) !important;
        color: var(--mvs-text-primary) !important;
        padding: 10px 15px !important;
        border: 1px solid var(--mvs-border-medium) !important;
        border-radius: 6px !important;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.3) !important;
        font-family: 'Segoe UI', Arial, sans-serif !important;
        font-size: 14px !important;
        bottom: 20px !important;
    }
    #pagination-controls button {
        background-color: var(--mvs-bg-element);
        color: var(--mvs-text-primary);
        border: 1px solid var(--mvs-border-medium);
        padding: 7px 14px;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 5px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
        font-weight: 500;
        transition: background-color 0.15s, border-color 0.15s;
    }
    #pagination-controls button:hover:not(:disabled) {
        background-color: var(--mvs-bg-hover);
        border-color: var(--mvs-border-strong);
    }
    #pagination-controls button:disabled {
        background-color: var(--mvs-bg-header-footer);
        color: var(--mvs-text-disabled);
        cursor: default;
        border-color: var(--mvs-border-light);
    }
    #pagination-controls span {
        color: var(--mvs-text-primary);
        margin: 0 10px;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
    }
    `;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    // --- Sorting Logic (largely unchanged) ---
    function nullSafeSort(valA, valB, ascending = true, aIsBetter = false) {
        const factor = ascending ? 1 : -1;
        const aIsNull = valA === null || valA === undefined;
        const bIsNull = valB === null || valB === undefined;
        if (aIsNull && bIsNull) return 0;
        if (aIsNull) return aIsBetter ? -1 * factor : 1 * factor;
        if (bIsNull) return aIsBetter ? 1 * factor : -1 * factor;
        if (valA < valB) return -1 * factor;
        if (valA > valB) return 1 * factor;
        return 0;
    }

    const Sorters = {
        'titleAZ': (a, b) => (a.title || '').localeCompare(b.title || ''),
        'titleZA': (a, b) => (b.title || '').localeCompare(a.title || ''),
        'viewsMost': (a, b) => nullSafeSort(a.views, b.views, false),
        'viewsLeast': (a, b) => nullSafeSort(a.views, b.views, true),
        'durationLongest': (a, b) => nullSafeSort(a.duration, b.duration, false),
        'durationShortest': (a, b) => nullSafeSort(a.duration, b.duration, true),
        'uploaderAZ': (a, b) => (a.uploader || '').localeCompare(b.uploader || ''),
        'uploaderZA': (a, b) => (b.uploader || '').localeCompare(a.uploader || ''),
        'deep:uploadDateNewest': (a, b) => nullSafeSort(a.uploadDate ? a.uploadDate.getTime() : null, b.uploadDate ? b.uploadDate.getTime() : null, false),
        'deep:uploadDateOldest': (a, b) => nullSafeSort(a.uploadDate ? a.uploadDate.getTime() : null, b.uploadDate ? b.uploadDate.getTime() : null, true),
        'deep:favoritesMost': (a, b) => nullSafeSort(a.favorites, b.favorites, false),
        'deep:favoritesLeast': (a, b) => nullSafeSort(a.favorites, b.favorites, true),
        'deep:commentsMost': (a, b) => nullSafeSort(a.commentsCount, b.commentsCount, false),
        'deep:commentsLeast': (a, b) => nullSafeSort(a.commentsCount, b.commentsCount, true),
        'deep:resolutionHighest': (a, b) => nullSafeSort(a.resolution, b.resolution, false),
        'deep:resolutionLowest': (a, b) => nullSafeSort(a.resolution, b.resolution, true),
        'deep:engagementCommentsMost': (a,b) => {
            const valA = (a.views > 0 && a.commentsCount !== null) ? a.commentsCount / a.views : null;
            const valB = (b.views > 0 && b.commentsCount !== null) ? b.commentsCount / b.views : null;
            return nullSafeSort(valA, valB, false);
        },
        'deep:engagementCommentsLeast': (a,b) => {
            const valA = (a.views > 0 && a.commentsCount !== null) ? a.commentsCount / a.views : null;
            const valB = (b.views > 0 && b.commentsCount !== null) ? b.commentsCount / b.views : null;
            return nullSafeSort(valA, valB, true);
        },
        'deep:engagementFavoritesMost': (a,b) => {
            const valA = (a.views > 0 && a.favorites !== null) ? a.favorites / a.views : null;
            const valB = (b.views > 0 && b.favorites !== null) ? b.favorites / b.views : null;
            return nullSafeSort(valA, valB, false);
        },
        'deep:engagementFavoritesLeast': (a,b) => {
            const valA = (a.views > 0 && a.favorites !== null) ? a.favorites / a.views : null;
            const valB = (b.views > 0 && b.favorites !== null) ? b.favorites / b.views : null;
            return nullSafeSort(valA, valB, true);
        },
    };

    function applySorting(dataArray, sortKey) {
        if (sortKey === 'random') {
            shuffleArray(dataArray);
        } else if (Sorters[sortKey]) {
            dataArray.sort(Sorters[sortKey]);
        } else if (sortKey === 'NO_SORT') {
            // Do nothing, keep original order (assuming dataArray is already in original order)
        } else {
            console.warn(`Unknown sort key: ${sortKey}. Defaulting to viewsMost.`);
            dataArray.sort(Sorters['viewsMost']);
        }
    }

    // --- UI & Pagination (largely unchanged logic, but invocation changes) ---
    function displayPage($container, videoData, page, videosPerPage) {
        $container.empty();
        const start = (page - 1) * videosPerPage;
        const end = Math.min(start + videosPerPage, videoData.length);
        for (let i = start; i < end; i++) {
            if (videoData[i] && videoData[i].element) {
                $container.append(videoData[i].element);
            }
        }
        updatePaginationControls($container, videoData, page, videosPerPage);
    }

    function updatePaginationControls($container, videoData, currentPage, videosPerPage) {
        const totalVideos = videoData.length;
        const totalPages = Math.ceil(totalVideos / videosPerPage);
        let $pagination = $('#pagination-controls');
        if ($pagination.length) $pagination.remove();
        $pagination = $('<div id="pagination-controls"></div>').css({
            position: 'fixed', left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, textAlign: 'center'
        });
        if (totalPages <= 1) {
            if (totalVideos > 0) $pagination.text(`Total videos: ${totalVideos}`);
            else $pagination.text('');
            $('body').append($pagination); return;
        }
        const $prev = $('<button>Previous</button>');
        const $next = $('<button>Next</button>');
        const $pageInfo = $('<span></span>').text(` Page ${currentPage} of ${totalPages} (${totalVideos} videos) `);
        if (currentPage === 1) $prev.prop('disabled', true);
        if (currentPage === totalPages) $next.prop('disabled', true);
        $prev.click(() => displayPage($container, videoData, currentPage - 1, videosPerPage));
        $next.click(() => displayPage($container, videoData, currentPage + 1, videosPerPage));
        $pagination.append($prev, $pageInfo, $next);
        $('body').append($pagination);
    }

    // --- Data Extraction (unchanged) ---
    function extractVideoData($videoElement) {
        const title = ($videoElement.find('a.caption.title').text() || '').trim();
        const uploader = ($videoElement.find('a.uploader').text() || '').trim();
        const viewsText = ($videoElement.find('span.hits span.value').text() || '0').trim();
        const durationText = ($videoElement.find('a.img-container span.size').text() || '00:00').trim();
        const pageUrlAnchor = $videoElement.find('a.img-container[href], a.caption.title[href]').first();
        let pageUrl = pageUrlAnchor.attr('href');
        if (pageUrl && !pageUrl.startsWith('http')) {
            try { pageUrl = new URL(pageUrl, window.location.origin).href; }
            catch (e) { console.error("Error constructing absolute URL:", pageUrl, e); pageUrl = null; }
        }
        return {
            element: $videoElement.clone(), title: title, uploader: uploader,
            views: parseViews(viewsText), duration: parseDurationToSeconds(durationText),
            pageUrl: pageUrl, uploadDate: null, favorites: null, commentsCount: null,
            resolution: null, deepDataFetched: false, deepDataError: false, originalIndex: -1 // For potential revert
        };
    }
    
    let initialVideoDataCache = []; // Cache for "Clear Sort" to revert to original page 1

    // Promisified GM_xmlhttpRequest (unchanged)
    function GM_fetch(details) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...details,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) resolve(response);
                    else reject(new Error(`Request failed: ${response.status} ${response.statusText} for ${details.url}`));
                },
                onerror: function(response) { reject(new Error(`Request error: ${response.statusText} for ${details.url}`)); },
                ontimeout: function() { reject(new Error(`Request timed out for ${details.url}`)); }
            });
        });
    }

    // fetchDeepVideoDetails and related orchestration (unchanged logic)
    async function fetchDeepVideoDetails(videoObject) {
        if (!videoObject.pageUrl) {
            videoObject.deepDataError = true;
            return Promise.reject("No pageUrl");
        }
        try {
            const response = await GM_fetch({ method: "GET", url: videoObject.pageUrl, timeout: 15000 });
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const dateStr = $(doc).find('#media-info .media-meta-stats span.count:nth-of-type(3)').text();
            const favStr = $(doc).find('#media-info .media-meta-stats span.count:nth-of-type(2)').text();
            const commentStr = $(doc).find('#media-comments .comments-count span.count').text();
            const videoElem = $(doc).find('video[id^="ml-video-"]').first();
            const qualityStr = videoElem.length ? videoElem.attr('data-quality') : null;
            videoObject.uploadDate = parseUploadDate(dateStr);
            videoObject.favorites = parseFavorites(favStr);
            videoObject.commentsCount = parseComments(commentStr);
            videoObject.resolution = parseResolution(qualityStr);
            videoObject.deepDataFetched = true;
            videoObject.deepDataError = false;
        } catch (error) {
            console.error(`Failed to fetch or parse deep data for ${videoObject.pageUrl}:`, error);
            videoObject.deepDataError = true;
            throw error;
        }
    }

    let activeDeepFetches = 0;
    let deepFetchQueue = [];
    let allVideoDataForSort = []; // Renamed for clarity, holds all videos after gallery fetch
    let currentSortKeyBeingApplied = '';
    let currentContainerForDisplay = null;
    let currentLoadingIndicator = null;

    function updateDeepFetchProgress(processedCount, totalToFetch) {
        if (currentLoadingIndicator && currentLoadingIndicator.length) {
            currentLoadingIndicator.text(`Fetching video details: ${processedCount}/${totalToFetch}...`);
        }
    }

    function processNextInDeepFetchQueue() {
        if (deepFetchQueue.length === 0 && activeDeepFetches === 0) {
            if (currentLoadingIndicator) currentLoadingIndicator.text('Sorting...');
            applySorting(allVideoDataForSort, currentSortKeyBeingApplied);
            if (currentLoadingIndicator) currentLoadingIndicator.remove(); currentLoadingIndicator = null;
            if (currentContainerForDisplay) {
                displayPage(currentContainerForDisplay, allVideoDataForSort, 1, VIDEOS_PER_PAGE_DISPLAY);
            }
            return;
        }
        while (activeDeepFetches < MAX_CONCURRENT_DEEP_FETCHES && deepFetchQueue.length > 0) {
            activeDeepFetches++;
            const { video, totalToFetch } = deepFetchQueue.shift();
            fetchDeepVideoDetails(video)
                .catch(err => { /* Error handled */ })
                .finally(() => {
                    activeDeepFetches--;
                    const processedCount = totalToFetch - deepFetchQueue.length - activeDeepFetches;
                    updateDeepFetchProgress(processedCount, totalToFetch);
                    processNextInDeepFetchQueue();
                });
        }
    }

    function initiateDeepSortProcess(sortKeyToApply) {
        const itemsToFetch = allVideoDataForSort.filter(v => !v.deepDataFetched && !v.deepDataError && v.pageUrl);
        if (itemsToFetch.length === 0) {
            if (currentLoadingIndicator) currentLoadingIndicator.text('Sorting...');
            applySorting(allVideoDataForSort, sortKeyToApply);
            if (currentLoadingIndicator) currentLoadingIndicator.remove(); currentLoadingIndicator = null;
            displayPage(currentContainerForDisplay, allVideoDataForSort, 1, VIDEOS_PER_PAGE_DISPLAY);
            return;
        }
        deepFetchQueue = itemsToFetch.map(video => ({ video: video, totalToFetch: itemsToFetch.length }));
        updateDeepFetchProgress(0, itemsToFetch.length);
        processNextInDeepFetchQueue();
    }

    // --- Main Sorting and Pagination Process ---
    function prepareAndSortGallery($container, $initialVideosOnPage, sortOptionKey) {
        currentSortKeyBeingApplied = sortOptionKey;
        currentContainerForDisplay = $container;

        if (currentLoadingIndicator && currentLoadingIndicator.length) currentLoadingIndicator.remove();
        currentLoadingIndicator = $('<div id="loading-indicator">Loading page 1...</div>').css({
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10000
        });
        $('body').append(currentLoadingIndicator);

        if (allVideoDataForSort.length > 0 && !sortOptionKey.startsWith('deep:')) {
            console.log('Using cached gallery data. Total videos:', allVideoDataForSort.length);
            currentLoadingIndicator.text('Sorting...');
            applySorting(allVideoDataForSort, currentSortKeyBeingApplied);
            currentLoadingIndicator.remove(); currentLoadingIndicator = null;
            displayPage(currentContainerForDisplay, allVideoDataForSort, 1, VIDEOS_PER_PAGE_DISPLAY);
            return;
        }
         if (allVideoDataForSort.length > 0 && sortOptionKey.startsWith('deep:')) {
            console.log('Using cached gallery data, initiating deep sort. Total videos:', allVideoDataForSort.length);
            initiateDeepSortProcess(currentSortKeyBeingApplied);
            return;
        }

        allVideoDataForSort = [];
        $initialVideosOnPage.each(function(index) {
            const videoEntry = extractVideoData($(this));
            videoEntry.originalIndex = index;
            allVideoDataForSort.push(videoEntry);
        });
        initialVideoDataCache = [...allVideoDataForSort];
        console.log(`Initial videos processed: ${allVideoDataForSort.length}`);

        let $pageLinks = $('a[href*="page="], .page, .page-item').filter(function() {
            return $(this).text().match(/^\d+$/) || $(this).attr('href')?.match(/page=(\d+)/);
        });
        let totalSitePages = 1;
        if ($pageLinks.length) {
            let maxPage = 0;
            $pageLinks.each(function() {
                let pageNumText = $(this).text().trim();
                let pageNumHref = $(this).attr('href');
                let pageNum = parseInt(pageNumText, 10);
                if (isNaN(pageNum) && pageNumHref) {
                    const match = pageNumHref.match(/page=(\d+)/);
                    if (match && match[1]) pageNum = parseInt(match[1], 10);
                }
                if (!isNaN(pageNum) && pageNum > maxPage) maxPage = pageNum;
            });
            totalSitePages = Math.max(1, maxPage);
        }
        console.log('Total site pages detected:', totalSitePages);

        function completeGalleryFetchAndProceed() {
            console.log('All gallery pages fetched. Total videos:', allVideoDataForSort.length);
            if (currentSortKeyBeingApplied.startsWith('deep:')) {
                initiateDeepSortProcess(currentSortKeyBeingApplied);
            } else {
                currentLoadingIndicator.text('Sorting...');
                applySorting(allVideoDataForSort, currentSortKeyBeingApplied);
                currentLoadingIndicator.remove(); currentLoadingIndicator = null;
                displayPage(currentContainerForDisplay, allVideoDataForSort, 1, VIDEOS_PER_PAGE_DISPLAY);
            }
        }

        if (totalSitePages <= 1) {
            completeGalleryFetchAndProceed();
            return;
        }

        let baseUrl = window.location.href.split('?')[0].split('#')[0];
        let pagesFetchedSuccessfully = 1;

        function fetchPage(page) {
            if (page > totalSitePages) {
                completeGalleryFetchAndProceed();
                return;
            }
            currentLoadingIndicator.text(`Loading gallery page ${page} of ${totalSitePages}...`);
            $.get(`${baseUrl}?page=${page}`, function(data) {
                let $pageContent = $(data);
                let $videosOnFetchedPage = $pageContent.find(VIDEO_ITEM_SELECTOR);
                $videosOnFetchedPage.each(function() {
                     const videoEntry = extractVideoData($(this));
                     allVideoDataForSort.push(videoEntry);
                });
                pagesFetchedSuccessfully++;
                fetchPage(page + 1);
            }).fail(function() {
                console.log('Failed to fetch gallery page:', page, ". Skipping.");
                fetchPage(page + 1);
            });
        }
        fetchPage(2);
    }


    function waitForVideos(callback) {
        let attempts = 0;
        const maxAttempts = 20;
        const interval = setInterval(function() {
            let $videos = $(VIDEO_ITEM_SELECTOR);
            if ($videos.length > 0) {
                clearInterval(interval);
                callback($videos);
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.log('Max attempts reached. No videos found.');
                    callback($([]));
                }
            }
        }, 500);
    }

    // --- New UI Panel Logic ---
    let panelSelectedSortId = DEFAULT_SORT_ID;
    let panelSelectedSortDirection = DEFAULT_SORT_DIR; // 'asc', 'desc', or null for 'random'

    function updateSortPanelUI() {
        // Update dropdown selection
        $('#mvs-primary-sort-select').val(panelSelectedSortId);

        // Update direction buttons
        const $dirControls = $('#mvs-sort-direction-controls-global');
        $dirControls.find('.mvs-dir-btn').removeClass('mvs-active-dir');

        const selectedSortDef = SORT_DEFINITIONS.find(s => s.id === panelSelectedSortId);
        if (selectedSortDef && !selectedSortDef.noDirection) {
            $dirControls.show();
            if (panelSelectedSortDirection === 'asc') {
                $dirControls.find('.mvs-dir-asc').addClass('mvs-active-dir');
            } else if (panelSelectedSortDirection === 'desc') {
                $dirControls.find('.mvs-dir-desc').addClass('mvs-active-dir');
            }
        } else {
            $dirControls.hide(); // Hide direction buttons for random sort
        }

        // Update active state of sort items (if they were still individual items)
        // In this new design, individual sort items are not clickable for selection,
        // so this part is no longer directly relevant for selection highlighting.
        // However, if we want to visually indicate the selected item in the list,
        // we would need to iterate through them and apply a class.
        // For now, the dropdown is the primary selection indicator.
    }


    $(document).ready(function() {
        addGlobalStyle(newStyles);

        waitForVideos(function($initialVideos) {
            let $videoGalleryContainer = $initialVideos.first().parent();
             if ($initialVideos.parent('.thumbs, .media-list, .video-list, #discover-grid-wrapper div.row, .thumbs.uploads').length > 0) {
                 $videoGalleryContainer = $initialVideos.parent('.thumbs, .media-list, .video-list, #discover-grid-wrapper div.row, .thumbs.uploads').first();
            } else if ($initialVideos.closest('.thumbs, .media-list, .video-list, #discover-grid-wrapper div.row, .thumbs.uploads').length > 0) {
                 $videoGalleryContainer = $initialVideos.closest('.thumbs, .media-list, .video-list, #discover-grid-wrapper div.row, .thumbs.uploads').first();
            }

            if ($initialVideos.length === 0 || $videoGalleryContainer.length === 0) {
                console.log('No video gallery detected. Sorter UI not added.');
                return;
            }

            // --- Create Main Toggle Button ---
            const $sortToggleButton = $(`
                <button id="mvs-sort-toggle-btn" title="Sort Options">
                    ${SVG_ICONS.filter}
                </button>
            `);
            $('body').append($sortToggleButton);

            // --- Create Sort Panel (initially hidden) ---
            const $sortPanelContainer = $(`
                <div id="mvs-sort-panel-container">
                    <div class="mvs-panel-header">
                        <div class="mvs-panel-header-top">
                            <h3>Sort Videos</h3>
                            <button class="mvs-panel-close-btn" title="Close">${SVG_ICONS.close}</button>
                        </div>
                        <select id="mvs-primary-sort-select"></select>
                        <div id="mvs-sort-direction-controls-global" class="mvs-sort-direction-controls">
                            <button class="mvs-dir-btn mvs-dir-asc" title="Sort Ascending" data-dir="asc">${SVG_ICONS.arrowUp}</button>
                            <button class="mvs-dir-btn mvs-dir-desc" title="Sort Descending" data-dir="desc">${SVG_ICONS.arrowDown}</button>
                        </div>
                    </div>
                    <div class="mvs-panel-body"></div>
                    <div class="mvs-panel-footer">
                        <button class="mvs-panel-action-btn mvs-clear-btn">Clear Sort</button>
                        <button class="mvs-panel-action-btn mvs-apply-btn">Apply Sort</button>
                    </div>
                </div>
            `);
            const $panelBody = $sortPanelContainer.find('.mvs-panel-body');
            const $primarySortSelect = $sortPanelContainer.find('#mvs-primary-sort-select');

            // Populate primary sort dropdown
            const iconMap = {
                title: '📝', views: '👁️', duration: '⏱️', uploader: '👤',
                uploadDate: '📅', favorites: '⭐', comments: '💬', resolution: '📺',
                engagementComments: '📈', engagementFavorites: '💖', random: '🎲'
            };

            const groupedSortsForDropdown = SORT_DEFINITIONS.reduce((acc, sortDef) => {
                if (!sortDef.noDirection) { // Only add sortable items to dropdown
                    acc[sortDef.group] = acc[sortDef.group] || [];
                    acc[sortDef.group].push(sortDef);
                } else if (sortDef.id === 'random') { // Add random as a special case
                    acc[sortDef.group] = acc[sortDef.group] || [];
                    acc[sortDef.group].push(sortDef);
                }
                return acc;
            }, {});

            for (const groupName in groupedSortsForDropdown) {
                const $optgroup = $(`<optgroup label="${groupName}"></optgroup>`);
                groupedSortsForDropdown[groupName].forEach(sortDef => {
                    const icon = iconMap[sortDef.id] || '▫️'; // Default icon if not found
                    $optgroup.append(`<option value="${sortDef.id}">${icon} ${sortDef.label}</option>`);
                });
                $primarySortSelect.append($optgroup);
            }
            
            // Set initial selection for dropdown
            $primarySortSelect.val(DEFAULT_SORT_ID);

            // The detailed list of sort types in the panel body is removed as per user feedback.
            // $panelBody will remain empty or can be hidden via CSS.

            $('body').append($sortPanelContainer);

            // --- Event Handlers ---
            $sortToggleButton.on('click', () => {
                $sortPanelContainer.fadeToggle(200);
                $sortToggleButton.toggle(); // Hide toggle button when panel opens
                updateSortPanelUI(); // Update UI when panel opens
            });
            
            const hidePanel = () => {
                $sortPanelContainer.fadeOut(200, () => {
                    $sortToggleButton.show(); // Show toggle button when panel closes
                });
            };

            $sortPanelContainer.find('.mvs-panel-close-btn').on('click', hidePanel);

            $primarySortSelect.on('change', function() {
                panelSelectedSortId = $(this).val();
                const selectedSortDef = SORT_DEFINITIONS.find(s => s.id === panelSelectedSortId);
                if (selectedSortDef && !selectedSortDef.noDirection) {
                    panelSelectedSortDirection = selectedSortDef.defaultDir;
                } else {
                    panelSelectedSortDirection = null; // For random or non-directional sorts
                }
                updateSortPanelUI();
            });

            $('#mvs-sort-direction-controls-global .mvs-dir-btn').on('click', function() {
                panelSelectedSortDirection = $(this).data('dir');
                updateSortPanelUI();
            });

            $sortPanelContainer.find('.mvs-apply-btn').on('click', function() {
                const activeSortDef = SORT_DEFINITIONS.find(s => s.id === panelSelectedSortId);
                if (!activeSortDef) return;

                let sortKeyToApply;
                if (activeSortDef.noDirection) {
                    sortKeyToApply = activeSortDef.key;
                } else {
                    sortKeyToApply = activeSortDef.keys[panelSelectedSortDirection];
                }

                if (sortKeyToApply) {
                    prepareAndSortGallery($videoGalleryContainer, $(VIDEO_ITEM_SELECTOR), sortKeyToApply);
                }
                hidePanel(); // Hide panel after applying sort
            });

            $sortPanelContainer.find('.mvs-clear-btn').on('click', function() {
                panelSelectedSortId = DEFAULT_SORT_ID; // Revert to default
                panelSelectedSortDirection = DEFAULT_SORT_DIR;
                updateSortPanelUI();
                // For now, just resets panel. User must click "Apply Sort".
            });

            // Initialize panel UI
            updateSortPanelUI();
            console.log("Advanced Sorter Panel UI added.");
        });
    });
})(jQuery);
