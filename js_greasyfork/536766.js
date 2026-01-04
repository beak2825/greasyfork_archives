// ==UserScript==
// @name                Modify YouTube Homepage Layout
// @description         Change the number of recommended videos per row on the YouTube homepage
// @version             1.6
// @author              NwO
// @match               https://www.youtube.com/*
// @icon                https://www.youtube.com/favicon.ico
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @license             MIT
// @namespace https://greasyfork.org/users/1473014
// @downloadURL https://update.greasyfork.org/scripts/536766/Modify%20YouTube%20Homepage%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/536766/Modify%20YouTube%20Homepage%20Layout.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const CONFIG = {
        columns: 'ytd-items-per-row',
        shorts: 'ytd-shorts-blocked',
        portraitColumns: 'ytd-portrait-columns'
    };
    const state = {
        columns: Math.min(10, Math.max(1,
            parseInt(localStorage.getItem(CONFIG.columns)) || 5)),
        shorts: localStorage.getItem(CONFIG.shorts) === 'true',
        portraitColumns: parseInt(localStorage.getItem(CONFIG.portraitColumns)) || null
    };
    const handleResize = () => {
        if (state.portraitColumns !== null) {
            const { innerWidth: width, innerHeight: height } = window;
            const original = Math.min(10, Math.max(1,
                parseInt(localStorage.getItem(CONFIG.columns)) || 5));
            state.columns = width > height ? original : state.portraitColumns;
        }
        updateStyle();
    };
    const updateStyle = () => {
        GM_addStyle(`
            .style-scope.ytd-two-column-browse-results-renderer {
                --ytd-rich-grid-items-per-row: ${state.columns} !important;
                --ytd-rich-grid-gutter-margin: 0px !important;
            }
        `);
        if (state.shorts) {
            GM_addStyle(`
                ytd-rich-section-renderer,
                ytd-reel-shelf-renderer {
                    display: none !important;
                }
            `);
        }
    };
    GM_registerMenuCommand('🖥️ Set the number of items to display per line', () => {
        const input = prompt('Please enter the number of videos to display per row (1-10) :', state.columns);
        if (input === null) return;
        const value = Math.min(10, Math.max(1, parseInt(input) || state.columns));
        localStorage.setItem(CONFIG.columns, value);
        state.columns = value;
        handleResize();
        alert(`Current setting: Display ${value} videos per line`);
    });
    GM_registerMenuCommand('📱 Number of vertical screen displays', () => {
        const input = prompt(`Set the number of vertical screen displays (1-10, current: ${state.portraitColumns || 'not set'}):`, state.portraitColumns || 3);
        if (input === null) return;
        const value = Math.min(10, Math.max(1, parseInt(input) || 3));
        localStorage.setItem(CONFIG.portraitColumns, value);
        state.portraitColumns = value;
        handleResize();
        alert(`Current vertical screen setting: Display ${value} videos per line`);
    });
    if (state.portraitColumns !== null) {
        GM_registerMenuCommand('Clear vertical screen settings', () => {
            if (!confirm('Are you sure you want to clear the portrait setting?')) return;
            localStorage.removeItem(CONFIG.portraitColumns);
            state.portraitColumns = null;
            state.columns = Math.min(10, Math.max(1,
                parseInt(localStorage.getItem(CONFIG.columns)) || 5));
            updateStyle();
            alert('Portrait settings cleared');
        });
    }
    GM_registerMenuCommand(state.shorts ? 'Show Shorts' : 'Hide Shorts', () => {
        state.shorts = !state.shorts;
        localStorage.setItem(CONFIG.shorts, state.shorts);
        window.location.reload();
    });
    window.addEventListener('resize', handleResize);
    handleResize();
})();