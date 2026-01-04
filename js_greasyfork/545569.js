// ==UserScript==
// @name         Restore Middle-Click New Tab Links for manko.fun / solji.kim
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Restore middle-click new tab function on manko.fun / solji.kim.
//
// @author       VanillaMilk
// @license      MIT
// @match        https://manko.fun/*
// @match        https://solji.kim/*
// @run-at       document-start
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/548772/Restore%20Middle-Click%20New%20Tab%20Links%20for%20mankofun%20%20soljikim.user.js
// @updateURL https://update.greasyfork.org/scripts/548772/Restore%20Middle-Click%20New%20Tab%20Links%20for%20mankofun%20%20soljikim.meta.js
// ==/UserScript==

/*
   ⚠️ Tampermonkey Developer Mode is REQUIRED
   This script only works correctly when Developer Mode is enabled in Tampermonkey settings.
*/

(function () {
    'use strict';

    let lastNavigateUrl = null;
    let captureOnly = false;

    // === Config ===
    const enableSideButtons = GM_getValue('enableSideButtons', true);

    GM_registerMenuCommand(
        `${enableSideButtons ? '✅' : '❌'} Side-Button Pagination (X1/X2)`,
        () => {
            const newState = !enableSideButtons;
            GM_setValue('enableSideButtons', newState);
            alert(`Side-button pagination ${newState ? 'enabled' : 'disabled'}`);
        }
    );

    // === Intercept pushState to capture real URL ===
    const oldPushState = history.pushState;
    history.pushState = function (state, title, url) {
        try {
            lastNavigateUrl = new URL(url, location.origin).toString();
        } catch (e) {
            lastNavigateUrl = url || location.href;
        }
        if (captureOnly) return;
        return oldPushState.apply(this, arguments);
    };

    // === Middle-click → background tab (most reliable method in 2025) ===
    window.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('mousedown', function (e) {
            if (e.button !== 1) return; // middle click only

            const card = e.target.closest("div[aria-label^='View details']") ||
                         e.target.closest("a[href*='/movie/']") ||
                         e.target.closest("a[href*='/actor/']");
            if (!card) return;

            e.preventDefault();
            e.stopPropagation();

            lastNavigateUrl = null;
            captureOnly = true;

            card.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                button: 0
            }));

            captureOnly = false;

            if (lastNavigateUrl) {
                GM_openInTab(lastNavigateUrl, {
                    active: false,   // background tab (as much as browser allows)
                    insert: true,    // place next to current tab
                    setParent: true  // keep tab relationship
                });
            }
        }, true);
    });

    // === Auto-add ?page=1 on first page ===
    function normalizeFirstPage() {
        try {
            const u = new URL(location.href);
            if (/^\/(movie-list|cate-list|actor-list|home)/.test(u.pathname) &&
                !/^\/(genre|maker|usecase)/.test(u.pathname) &&
                !u.searchParams.has('page')) {
                u.searchParams.set('page', '1');
                history.replaceState(null, '', u.toString());
            }
        } catch {}
    }
    normalizeFirstPage();

    // === Side-button pagination (X1 = prev, X2 = next) ===
    function sidePage(e) {
        if (!enableSideButtons || (e.button !== 3 && e.button !== 4)) return;
        const u = new URL(location.href);
        if (!/^\/(movie-list|cate-list|actor-list)/.test(u.pathname) ||
            /^\/(genre|maker|usecase)/.test(u.pathname)) return;

        let page = parseInt(u.searchParams.get('page') || '1', 10) || 1;
        if (e.button === 3) page = Math.max(1, page - 1); // X1
        if (e.button === 4) page += 1;                    // X2
        u.searchParams.set('page', page);

        e.preventDefault();
        e.stopPropagation();
        location.assign(u.toString());
    }
    addEventListener('mouseup', sidePage, true);
    addEventListener('pointerup', sidePage, true);

})();