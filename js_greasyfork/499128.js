// ==UserScript==
// @name         YouTube Reimagined
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An aesthetic and beautiful theme for YouTube to improve the experience.
// @author       Antinity
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499128/YouTube%20Reimagined.user.js
// @updateURL https://update.greasyfork.org/scripts/499128/YouTube%20Reimagined.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration variables
    const config = {
        fontFamily: `'Poppins', sans-serif`,
        transitionDuration: '0.1s',
        transitionEase: 'ease-in-out',
        bgColor: '#1e1e1e8c',
        borderColor: '#434343',
        borderRadius: '6px',
        boxShadowColor: 'rgba(255, 255, 255, 0.2)',
        secondaryBorderColor: '#43434363',
        blurIntensity: '20px',
        commentPadding: '15px 15px 5px 15px'
    };

    const css = `

    /*
        Theme: YouTube Reimagined
        Description: An aesthetic and beautiful theme for YouTube to improve the experience.
        Author: Antinity
        Author's YouTube: https://www.youtube.com/channel/UCrIqGpKFZSpS_Lgu0BtXv3w
    */

    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    /* ========== VARIABLES ========== */

    :root {
        --font-family: ${config.fontFamily};
        --transition-duration: ${config.transitionDuration};
        --transition-ease: ${config.transitionEase};
        --bg-color: ${config.bgColor};
        --border-color: ${config.borderColor};
        --border-radius: ${config.borderRadius};
        --box-shadow-color: ${config.boxShadowColor};
        --secondary-border-color: ${config.secondaryBorderColor};
        --blur-intensity: ${config.blurIntensity};
        --comment-padding: ${config.commentPadding};
    }

    /* ========== GLOBAL ========== */

    * {
        transition: all var(--transition-duration) var(--transition-ease);
        font-family: 'Poppins', sans-serif !important;
        font-style: normal;
    }

    /* ========== SEPARATE STYLES ========== */

    #button.ytd-menu-renderer yt-icon.ytd-menu-renderer {
        color: #bbb;
    }

    ytd-menu-popup-renderer {
        background-color: var(--bg-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        box-shadow: inset 0 0 0 1px var(--box-shadow-color), 0 8px 40px var(--dialogShadowColor);
        padding: 2px 2px;
    }

    tp-yt-paper-item {
        border-radius: var(--border-radius);
    }

    .ytp-speedmaster-user-edu {
        font-weight: 700;
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        backdrop-filter: blur(5px);
    }

    /* Popups */
    .yt-contextual-sheet-layout-wiz {
        backdrop-filter: blur(var(--blur-intensity));
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1px 1px;
    }

    /* Settings menu */
    .ytp-popup {
        backdrop-filter: blur(var(--blur-intensity));
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
    }

    .ytp-panel-menu {
        padding: 2px 2px;
    }

    .ytp-menuitem {
        height: 40px;
    }

    /* Share popup customizations */
    tp-yt-paper-dialog {
        backdrop-filter: blur(var(--blur-intensity));
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
    }

    /* Navigation bar tweaks */
    #background.ytd-masthead {
        backdrop-filter: blur(var(--blur-intensity));
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
    }

    .ytd-masthead * {
        transition: all var(--transition-duration) var(--transition-ease);
    }

    /* Chips */
    #chips-wrapper.ytd-feed-filter-chip-bar-renderer {
        backdrop-filter: blur(var(--blur-intensity));
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
        border-radius: 0 0 0 15px;
    }

    /* Search bar */
    #container.ytd-searchbox {
        background-color: #0000002e;
        border: 1px solid var(--border-color);
        border-right: none;
    }

    ytd-searchbox[has-focus] #container.ytd-searchbox {
        border: 1px solid var(--border-color);
        border-right: none;
    }

    /* Search Icon */
    #search-icon-legacy.ytd-searchbox {
        background-color: #0000002e;
        border: 1px solid var(--border-color);
        border-left: none;
    }

    /* Search Results */
    html[dark] .sbsb_a {
        margin-top: 10px;
        background-color: var(--bg-color);
        backdrop-filter: blur(var(--blur-intensity));
        border: 1px solid var(--border-color);
        padding: 6px !important;
        border-radius: 15px;
    }

    .sbsb_c[dir=ltr] {
        padding: 2px 24px 2px 16px;
        border-radius: 10px;
    }

    .sbsb_c[dir=ltr] .sbfl_a {
        display: none;
    }

    /* Menu */
    tp-yt-iron-dropdown, tp-yt-iron-dropdown * {
        transition: none !important;
    }

    ytd-multi-page-menu-renderer {
        background-color: var(--bg-color);
        backdrop-filter: blur(var(--blur-intensity));
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
    }

    tp-yt-paper-listbox {
        padding: 0px;
    }

    tp-yt-paper-item {
        margin: 0;
        transition: all var(--transition-duration) var(--transition-ease);
    }

    ytd-menu-service-item-renderer[is-selected] {
        border-radius: var(--border-radius);
    }

    /* Remove unnecessary border from suggested videos */
    @media screen and (min-width: 720px) {
        ytd-reel-shelf-renderer.ytd-item-section-renderer {
            border-top: none;
            margin-top: none !important;
        }
    }

    /* Comment */
    ytd-comment-thread-renderer {
        background: var(--bg-color);
        padding: var(--comment-padding);
        border-radius: 15px;
        border: 1px solid var(--secondary-border-color);
    }

    .yt-spec-button-shape-next--size-m {
        border-radius: 5px;
    }

    /* Comment Replies */
    #contents.ytd-comment-replies-renderer {
        margin: 5px;
        padding: 10px;
    }

    /* Comment Buttons */
    .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--text * {
        transition: none;
    }

    /* Community Posts */
    ytd-backstage-post-thread-renderer[rounded-container] {
        background: var(--bg-color);
    }

    /* Polls */
    ytd-backstage-poll-renderer:not([is-image-poll]) .choice-info.ytd-backstage-poll-renderer {
        border: 1px solid #6b6b6b;
    }

    ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype=history]):not([page-subtype=memberships-and-purchases]):not([page-subtype=ypc-offers]):not([live-chat-engagement-panel]) #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:not(:last-child):not(ytd-page-introduction-renderer):not([item-dismissed]):not([has-destination-shelf-renderer]):not(ytd-minor-moment-header-renderer):not([has-section-group-view-model]) {
        border-bottom: none;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.body.after(style);
})();
