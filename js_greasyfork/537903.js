// ==UserScript==
// @name         Udemy Windowed Fullscreen
// @name:zh-CN   Udemy 窗口化全屏
// @namespace    https://greasyfork.org/zh-CN/users/529682-%E5%85%BB%E7%8C%AB%E7%9A%84%E9%B1%BC
// @version      1.0
// @description  Press ` (backtick) key to toggle windowed fullscreen mode (maximize video window, and hide title bar & sidebar) on Udemy course page.
// @description:zh-CN  在 Udemy 课程页面按 `（反引号）键切换窗口化全屏模式（视频窗口最大化，隐藏标题栏和侧边栏）。
// @author       养猫的鱼
// @match        https://www.udemy.com/course/*
// @icon         https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537903/Udemy%20Windowed%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/537903/Udemy%20Windowed%20Fullscreen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isWindowedFullscreen = false;
    let refocusHandler = null; // will hold our click listener

    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const getHeader = () => $('.app--row--E-WFM.app--header--QuLOL');
    const getCloseSidebarBtn = () => $('[data-purpose="sidebar-button-close"]');
    const getOpenSidebarBtn = () => $('[data-purpose="open-course-content"]');
    const getTitleGradient = () => $('.video-viewer--header-gradient--x4Zw0');
    const getTitleShadow = () => $('.video-viewer--title-overlay--YZQuH');
    const getCurriculumEls = () => $$('.curriculum-item-view--scaled-height-limiter--lEOjL.curriculum-item-view--no-sidebar--LGmz-');

    /* ────────── MutationObserver to catch new <video> tags and focus them ────────── */
    const observer = new MutationObserver(mutations => {
        if (!isWindowedFullscreen) return;

        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.tagName === 'VIDEO') {
                    node.setAttribute('tabindex', '-1');
                    node.focus();
                    return;
                }
                const childVideo = node.querySelector && node.querySelector('video');
                if (childVideo) {
                    childVideo.setAttribute('tabindex', '-1');
                    childVideo.focus();
                    return;
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    /* ─────────────────────── Windowed Fullscreen ON ─────────────────────── */
    function enterWindowedFullscreen() {
        // 1. Hide header
        const header = getHeader();
        if (header) {
            if (!header.dataset.originalDisplay) {
                header.dataset.originalDisplay = header.style.display || '';
            }
            header.style.display = 'none';
        }

        // 2. Scroll to top
        window.scrollTo(0, 0);

        // 3. Close sidebar
        const closeBtn = getCloseSidebarBtn();
        if (closeBtn) {
            closeBtn.click();
        }

        // 4. Hide video title bar and shadow
        const grad = getTitleGradient();
        if (grad) grad.style.visibility = 'hidden';
        const sh = getTitleShadow();
        if (sh) sh.style.visibility = 'hidden';

        // 5. Maximize video window
        getCurriculumEls().forEach(el => {
            el.dataset.originalMaxHeight = el.style.maxHeight || '';
            el.style.maxHeight = '100vh';
        });

        // 6. Focus the existing <video> so keyboard shortcuts work
        const currentVideo = document.querySelector('video');
        if (currentVideo) {
            currentVideo.setAttribute('tabindex', '-1');
            currentVideo.focus();
        }

        // 7. Install a capture-phase click listener to re-focus <video> whenever any control is clicked
        refocusHandler = e => {
            if (!isWindowedFullscreen) return;
            const v = document.querySelector('video');
            if (v) v.focus();
        };
        document.addEventListener('click', refocusHandler, true);
    }

    /* ─────────────────────── Windowed Fullscreen OFF ─────────────────────── */
    function exitWindowedFullscreen() {
        // 1. Restore header
        const header = getHeader();
        if (header) {
            header.style.display = header.dataset.originalDisplay || '';
            delete header.dataset.originalDisplay;
        }

        // 2. Scroll to top
        window.scrollTo(0, 0);

        // 3. Restore video title bar and shadow
        const grad = getTitleGradient();
        if (grad) grad.style.visibility = 'visible';
        const sh = getTitleShadow();
        if (sh) sh.style.visibility = 'visible';

        // 4. Restore video window size
        getCurriculumEls().forEach(el => {
            el.style.maxHeight = el.dataset.originalMaxHeight ?? '';
            delete el.dataset.originalMaxHeight;
        });

        // 5. Open sidebar
        const openBtn = getOpenSidebarBtn();
        if (openBtn) {
            openBtn.click();
        }

        // 6. Remove the click listener that re-focused <video>
        if (refocusHandler) {
            document.removeEventListener('click', refocusHandler, true);
            refocusHandler = null;
        }
    }

    /* ─────────────────────────────── Hotkey ────────────────────────────────── */
    function toggleWindowedFullscreen() {
        if (isWindowedFullscreen) {
            exitWindowedFullscreen();
        } else {
            enterWindowedFullscreen();
        }
        isWindowedFullscreen = !isWindowedFullscreen;
    }

    window.addEventListener('keydown', e => {
        if (e.key === '`') {
            e.preventDefault();
            toggleWindowedFullscreen();
        }
    });
})();
