// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com, navigate between messages, and open a settings menu by clicking the speed display to toggle additional UI tweaks. Features include color-coded icons under ChatGPT's responses, highlighted color for bold text, compact sidebar, square design, and more.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      5.15.7
// @namespace    TimMacy.ReadAloudSpeedster
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://*.chatgpt.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @homepageURL  https://github.com/TimMacy/ReadAloudSpeedster
// @supportURL   https://github.com/TimMacy/ReadAloudSpeedster/issues
// @downloadURL https://update.greasyfork.org/scripts/530118/Read%20Aloud%20Speedster.user.js
// @updateURL https://update.greasyfork.org/scripts/530118/Read%20Aloud%20Speedster.meta.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2026 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 5.15.7 - Read Aloud Speedster             *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(function () {
    'use strict';
    const className = "sm:mt-5";
    const escapedClassName = CSS.escape(className);
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /**************************************
                 default root settings
        **************************************/

        :root {
            --user-chat-width: 100%; /* original 70% */
            --sidebar-width: 260px;
            --sidebar-section-margin-top: 1.25rem;
            --sidebar-section-first-margin-top: .5rem;
            --sidebar-rail-width: calc(var(--spacing)*13);
            --header-height: calc(var(--spacing)*13);
            --white: #fff;
            --black: #000;
            --gray-50: #f9f9f9;
            --gray-100: #ececec;
            --gray-200: #e3e3e3;
            --gray-300: #cdcdcd;
            --gray-400: #b4b4b4;
            --gray-500: #9b9b9b;
            --gray-600: #676767;
            --gray-700: #424242;
            --gray-750: #2f2f2f;
            --gray-800: #212121;
            --gray-900: #171717;
            --gray-950: #0d0d0d;
            --red-500: #e02e2a;
            --red-700: #911e1b;
            --brand-purple: #ab68ff;
            --yellow-900: #4d3b00;
        }

        /**************************************
                    general settings
        **************************************/

        main .popover > div.relative.flex.min-h-0.w-full.flex-1.flex-col.self-end > div.absolute.bottom-0.z-20.h-24.w-full.transition-colors {
            display: none;
        }

        /* chatbox - reduced vertical margin */
        .${escapedClassName} {
            margin-top: .5rem !important;
            margin-bottom: var(--spacing) !important;
        }

        /* chatbox - fade effect for content */
        main form {
            border-top-left-radius: .25em !important;
            border-top-right-radius: .25em !important;
        }

        #thread-bottom-container,
        div.mx-auto.flex-1 > div.relative.w-full:not(.text-xs.text-pretty) {
            box-shadow: 0 -20px 20px 0 var(--bg-primary);
        }

        .content-fade::after {
            background: var(--bg-primary);
        }

        /* copy icon */
        button[aria-label="Copy"],
        div[role="menuitem"]:has(path[d^="M12 7.1a"]),
        header button:has(path[d^="M12.668 10.667C12"]),
        button.surface-nav-element:has(svg path[d^="M12 7.1a"]) {
            color: darkorange;
            opacity: .9;
        }

        /* copied */
        button:has(svg use[href*="#fa1dbd"]) {
            color: springgreen;
        }

        .light button:has(svg use[href*="#fa1dbd"]) {
            color: limegreen;
        }

        /* thumbs up icon */
        button .icon-md path[d^="M12.1318"],
        button svg path[d^="M10.9153"],
        button[aria-label="Good response"],
        div.mt-3 button:has(use[href*="#51753c"]),
        div[role="menuitem"]:has(path[d^="m4.5 4.944"]),
        button[data-testid="good-response-turn-action-button"] svg {
            color: #00ad00 !important;
            opacity: .9;
        }

        /* thumbs down icon */
        div.mt-3 button:has(use[href*="#2126ae"]),
        button[aria-label="Bad response"],
        button .icon-md path[d^="M11.8727"],
        button svg path[d^="M12.6687"],
        button.surface-nav-element:has(svg path[d^="M11.868 21"]),
        button[data-testid="bad-response-turn-action-button"] svg {
            color: crimson !important;
            opacity: .9;
        }

        /* edit in canvas icon */
        button[aria-label="Edit message"],
        button[aria-label="Edit in canvas"],
        button:has(svg path[d^="M12.0303 4.11328"]) {
            color: yellow !important;
            opacity: .8;
        }

        .light button[aria-label="Edit message"],
        .light button[aria-label="Edit in canvas"],
        .light button:has(svg path[d^="M12.0303 4.11328"]) {
            color: indigo !important;
            opacity: .8;
        }

        /* switch model icon */
        main .flex.justify-start button[aria-haspopup="menu"][data-state="closed"] > div {
            color: gray !important;
        }

        .light main .flex.justify-start button[aria-haspopup="menu"][data-state="closed"] > div {
            color: dimgray !important;
        }

        /* read aloud and stop icon */
        div[aria-label="Read aloud"],
        button[aria-label="Read aloud"],
        div[role="menuitem"]:has(path[d^="M9.75122"]),
        div[role="menuitem"]:has(use[href*="#54f145"]),
        div[role="menuitem"]:has(use[href*="#4944fe"]),
        div[role="menuitem"]:has(use[href*="#f64f60"]),
        div[role="menuitem"]:has(path[d^="M9 6.25v5.5"]),
        div[data-testid="voice-play-turn-action-button"] svg,
        button[data-testid="voice-play-turn-action-button"] svg {
            color: deepskyblue !important;
            opacity: .9;
        }

        div[aria-label="Stop"],
        button[aria-label="Stop"],
        div[role="menuitem"]:has(path[d^="M10 2.08496C14"]) {
            color: deepskyblue !important;
        }

        /* share icon */
        article button[aria-label="Share"] {
            opacity: .8;
        }

        /* hover opacity icons */
        :is(
            header button[aria-label="Turn on temporary chat"],
            button[aria-label="Copy"],
            div[role="menuitem"]:has(path[d^="M12 7.1a"]),
            header button:has(path[d^="M12.668 10.667C12"]),
            button[data-testid="copy-turn-action-button"] svg,
            button.surface-nav-element:has(svg path[d^="M12 7.1a"]),
            button .icon-md path[d^="M12.1318"],
            button svg path[d^="M10.9153"],
            button[aria-label="Good response"],
            div.mt-3 button:has(use[href*="#51753c"]),
            div[role="menuitem"]:has(path[d^="m4.5 4.944"]),
            button[data-testid="good-response-turn-action-button"] svg,
            button[aria-label="Bad response"],
            div.mt-3 button:has(use[href*="#2126ae"]),
            button .icon-md path[d^="M11.8727"],
            button svg path[d^="M12.6687"],
            button.surface-nav-element:has(svg path[d^="M11.868 21"]),
            button[data-testid="bad-response-turn-action-button"] svg,
            button[aria-label="Edit message"],
            button[aria-label="Edit in canvas"],
            button:has(svg path[d^="M12.0303 4.11328"]),
            .light button[aria-label="Edit message"],
            .light button[aria-label="Edit in canvas"],
            .light button:has(svg path[d^="M12.0303 4.11328"]),
            button[aria-label="Read aloud"],
            div[role="menuitem"]:has(path[d^="M9 6.25v5.5"]),
            button[data-testid="voice-play-turn-action-button"] svg,
            article button[aria-label="Share"]
            ):hover {opacity: 1;
        }

        header button[aria-label="Turn on temporary chat"] {
            opacity: .7;
        }

        /* sora star icon */
        a:has(svg path[d^="M9.822 2.077c"]),
        div.pointer-events-none path[d^="M10.258"],
        button.surface-nav-element path[d^="M10.258"],
        div[role="menuitem"]:has(path[d^="M9.822 2.077c"]),
        button.surface-nav-element path[d^="M9.822 2.077c"],
        div[role="menuitem"]:has(path[d^="M10.258 1.555c"]) {
            color: gold;
        }

        /* highlight color - dark mode */
        .markdown strong {
            color: springgreen !important;
        }

        /* highlight color - light mode */
        .light .markdown strong {
            color: darkviolet !important;
        }

        /* scheduled separator line */
        :root:has(#thread article div.border-token-border-default.overflow-hidden.max-w-\\[360px\\]) div[data-message-author-role="assistant"] {
            border-top: 1px solid springgreen;
            margin-top: 10px;
            padding-top: 10px;
        }

        :root[style*="color-scheme: light"]:has(#thread article div.border-token-border-default.overflow-hidden.max-w-\\[360px\\]) div[data-message-author-role="assistant"] {
            border-color: darkviolet;
        }

        /* group icons color */
        button[title="Add reaction"] {
            color: yellow !important;
        }

        button[title="Reply"] {
            color: deepskyblue !important;
        }

        /* red delete color */
        button[title="Delete"],
        .text-token-text-destructive,
        button:has(path[d^="m10 11.5 4"]),
        [data-testid="delete-chat-menu-item"],
        div[role="menuitem"]:has(path[d^="M10.556 4a1 1 0"]) {
            color: #e02e2a !important;
        }

        button[title="Delete"]:hover,
        .text-token-text-destructive:hover,
        button:has(path[d^="m10 11.5 4"]):hover,
        [data-testid="delete-chat-menu-item"]:hover,
        div[role="menuitem"]:has(path[d^="M10.556 4a1 1 0"]):hover {
            color: white !important;
            background: rgba(255, 0, 0, .5) !important;
        }

        /* sore green restore color */
        div[role="menuitem"]:has(path[d^="m4.5 4.944"]):hover {
            color: white !important;
            background: rgba(0, 255, 0, .5) !important;
        }

        /* stop icon size inner */
        #thread-bottom-container .icon-lg {
            height: calc(var(--spacing)*5);
            width: calc(var(--spacing)*5);
        }

        /* pin and unpin color */
        div[role="menuitem"]:has(use[href*="#23d2ff"]),
        div[role="menuitem"]:has(use[href*="#946e20"]),
        div[role="menuitem"]:has(use[href*="#13322a"]) {
            color: #e25507;
        }

        /* select color */
        ::selection {
            background-color: var(--text-primary);
            color: var(--main-surface-tertiary);
        }

        /* change width of chat containers */
        #thread-bottom-container #thread-bottom,
        div.text-base.my-auto:has(.bg-token-main-surface-tertiary),
        div.mx-auto.flex-1:has(div.shadow-short):not(:is(#thread-bottom *)) {
            margin: 0 6.263%;
            padding: 0;
        }

        :root:has(main button[aria-label^="Edit the title of"]) div.mx-auto.flex-1:has(div.shadow-short):not(:is(#thread-bottom *)) {
            margin: 0;
        }

        #thread-bottom-container,
        #thread-bottom-container div.mb-4.flex-1 {
            margin-bottom: 0;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) #thread-bottom-container #thread-bottom {
            margin: 0 1dvw;
        }

        :root:has(h1.text-page-header) #thread-bottom-container.mb-4.flex.flex-col > #thread-bottom {
            margin: 0 12.525%;
        }

        [class*="--thread-content-max-width"] {
            max-width: unset;
        }

        div.border-token-border-sharp div.p-4 {
            width: 100%;
        }

        div.border-token-border-sharp div.text-message {
            box-shadow: none;
            margin-top: 20px;
        }

        div.border-token-border-sharp :where([class*="_tableContainer_"]),
        div.border-token-border-sharp :where([class*="_tableContainer_"]) > :where([class*="_tableWrapper_"]),
        div.border-token-border-sharp :where([class*="_tableContainer_"]) > :where([class*="_tableWrapper_"]) > table {
            margin: 0;
        }

        #thread-bottom > div {
            padding-inline: 0 !important;
            --thread-content-margin: 0 !important;
        }

        [data-message-author-role="user"] > div > div {
            width: 100%;
        }

        .px-\\(--thread-content-margin\\):has([data-message-author-role="user"]) {
            margin: 20px 6.263% 20px 37.574%;
            padding: 0;
        }

        .px-\\(--thread-content-margin\\):has([data-message-author-role="assistant"]) {
            margin: 0 6.263%;
            padding: 0 0 20px 0;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) .px-\\(--thread-content-margin\\):has([data-message-author-role="assistant"]) {
            margin: 0 1dvw;
        }

        .grow.overflow-hidden > div > div {
            overflow-x: hidden;
        }

        .\\[--composer-overlap-px\\:24px\\] {
            --composer-overlap-px: 0;
        }

        .flex.max-w-full.flex-col.grow:empty + .flex.min-h-\\[46px\\].justify-start [class*="mask-image"] {
            margin-left: calc(6.263% - var(--spacing)*6) !important;
        }

        main div.text-base.my-auto:has(.loading-shimmer) {
            padding-left: 6.263%;
            padding-right: 4.263%;
        }

        main .mx-\\[calc\\(--spacing\\(-2\\)-1px\\)\\]:not(.loading-shimmer) {
            margin-left: -6px;
        }

        div.text-base,
        div[class*="turn-messages"] {
            --thread-content-max-width: unset !important;
            max-width: 1129px;
        }

        #prosemirror-editor-container,
        #prosemirror-editor-container > .markdown.prose {
            width: 100% !important;
        }

        main.min-h-0 .h-full.w-full > .justify-center:not(span[style*="background-image"]) {
            margin: 0 5dvw !important;
        }

        main div.flex.basis-auto.flex-col .pb-25,
        main > #thread div.flex.flex-col.text-sm.thread-xl\\:pt-header-height,
        main > #thread div.\\@thread-xl\\/thread\\:pt-header-height.flex.flex-col.text-sm {
            padding-bottom: 25dvh !important;
        }

        #thread article[data-turn-id*="request-WEB"] {
            min-height: 10dvh;
        }

        :root:has(#stage-slideover-sidebar) main div.flex.basis-auto.flex-col.grow.overflow-hidden > div {
            width: -webkit-fill-available;
            width: -moz-available;
            width: fill-available;
        }

        main #thread article div.mt-3.w-full.empty\\:hidden {
            margin-bottom: 20px;
        }

        :where([class*="tableContainer"]),
        :where([class*="_tableContainer_"]) > :where([class*="_tableWrapper_"]),
        :where([class*="_tableContainer_"]) > :where([class*="_tableWrapper_"]) > table {
            width: 100% !important;
        }

        div.relative.mx-5:has([class*="_prosemirror-parent_"]) {
            padding-block: calc(var(--spacing)*3);
            align-items: center;
        }

        #thread #prompt-textarea,
        textarea[class*="_fallbackTextarea_"],
        .bg-token-bg-elevated-primary.w-full > div {
            padding: 0;
            margin: 0;
        }

        #thread-bottom-container div.text-base.mx-auto {
            --thread-content-margin: 0;
            max-width: unset;
            padding: 0;
        }

        /* menu hover shadow fix */
        .shadow-long:is(.dark *) {
            --tw-shadow: 0px 8px 16px 0px var(--tw-shadow-color, #00000052), 0px 0px 1px 0px var(--tw-shadow-color, #0000009e) !important;
            box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) !important;
            border: 1px solid #272727 !important;
        }

        .shadow-long {
            --tw-shadow: 0px 8px 12px 0px var(--tw-shadow-color, var(--shadow-color-1, #00000014)), 0px 0px 1px 0px var(--tw-shadow-color, var(--shadow-color-2, #0000009e)) !important;
            box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) !important;
            border: 1px solid #e6e6e6 !important;
        }

        /* chatbox adjustments for GPT5 changes */
        #thread ol div.group.text-token-text-tertiary { text-wrap: nowrap; }

        div.grid.\\[grid-template-areas\\:\\'leading_primary_trailing\\'\\],
        #thread form.group\\/composer[data-type="unified-composer"] > div > div.grid {
            grid-template-areas: "header header header" "primary primary primary" "leading footer trailing" !important;
        }

        div.grid.gap-y-2,
        #thread-bottom-container form div.cursor-text,
        form div.cursor-text:not(#thread-bottom-container),
        div.grid.\\[grid-template-areas\\:\\'leading_primary_trailing\\'\\] {
            padding-top: unset;
        }

        div.content-fade:not(#thread-bottom-container),
        div.content-fade:not(#thread-bottom-container) form {
            padding: unset;
        }

        .bg-token-bg-elevated-primary.w-full,
        main > #thread form div.group-data-expanded\\/composer\\:mb-0 {
            padding: 10px;
            margin: unset;
        }

        .bg-token-bg-elevated-primary.w-full,
        :where(#thread-bottom form div[class*="_prosemirror-parent"]) {
            max-height: 300px;
        }

        .group\\/message.gap-1:has(.bg-token-bg-tertiary) {
            margin-bottom: 15px;
        }

        .-my-2\\.5 {
            margin-block: unset;
        }

        .min-h-14,
        .min-h-12 {
            min-height: unset;
        }

        :root:has(nav > aside > a.__menu-item:not(:disabled):not([data-disabled])[data-active] svg use[href*="#266724"]) .-my-2\\.5 {
            margin-block: calc(var(--spacing)*-2.5);
        }

        /**************************************
                    Read Aloud Speedster
        **************************************/

        .speed-control-container {
            display: flex;
            align-items: center;
            grid-area: leading;
            margin: 0 8px 0 44px;
        }

        :root:has(#thread-bottom-container div > div.relative.flex.w-full.flex-auto.flex-col > div:nth-child(4)[style="height: 48px;"]):has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) .speed-control-container {
            bottom: calc(var(--spacing)*2.5 + 44px);
            inset-inline-start: calc(2.5*var(--spacing) + -8px);
        }

        .speed-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-btn.minus {
            border-radius: 50%;
            border-right: none !important;
        }

        .speed-btn.plus {
            border-radius: 50%;
            border-left: none !important;
        }

        .speed-btn.plus::before,
        .speed-btn.minus::before,
        .speed-display::before,
        .speed-display::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 12px;
            background-color: var(--border-default);
            display: var(--show-dividers, block);
        }

        .speed-btn.plus::before {
            position: relative;
            left: 22px;
        }

        .speed-btn.minus::before {
            position: relative;
            right: 15px;
        }

        .speed-display::after {
            transform: translateX(26px);
        }

        .speed-display::before {
            transform: translateX(-26px);
        }

        .speed-btn:hover,
        .speed-control-config-popup button:hover {
            background-color: #ffffff1a;
        }

        .light .speed-btn:hover,
        .light .speed-control-config-popup button:hover {
            background-color: #0d0d0d05;
        }

        .speed-btn:active,
        .speed-control-config-popup button:active {
            background-color: #ffffff0d
        }

        .light .speed-btn:active,
        .light .speed-control-config-popup button:active {
            background-color: #0d0d0d0d
        }

        .speed-display {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 52px;
            padding: .5rem;
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            background: transparent;
            color: var(--text-secondary);
            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-control-config-popup {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--main-surface-primary);
            border: 1px solid var(--border-default);
            border-radius: 3px;
            padding: 15px 10px 15px 30px;
            margin-bottom: 4px;
            z-index: 2077;
            display: none;
            flex-direction: column;
            gap: 10px;
            max-height: 40dvh;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
        }

        .speed-control-config-popup .popup-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: baseline;
            justify-content: center;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            color: var(--text-secondary);
            font-weight: 600;
            width: 100%;
            padding-right: 20px;
            text-decoration: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-control-config-popup .popup-title {
            grid-column: 2;
            text-align: center;
            text-decoration: none;
            text-overflow: ellipsis;
            white-space: normal;
            cursor: pointer;
            display: block;
            opacity: .8;
            cursor: pointer;
            transition: opacity .5s;
        }

        .speed-control-config-popup .popup-content {
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-bottom: 30px;
            padding-right: 20px;
        }

        .speed-control-config-popup .popup-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            width: 100%;
            padding-right: 20px;
        }

        .speed-control-config-popup .popup-footer a {
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: .75rem;
            line-height: 1.5em;
            font-weight: 500;
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s ease-in-out;
        }

        .speed-control-config-popup .popup-footer a:hover {
            color: #369eff;
        }

        .CentAnni-version-label {
            grid-column: 3;
            padding: 0;
            margin: 0 0 0 5px;
            color: ghostwhite;
            cursor: default;
            opacity: .3;
            justify-self: start;
            max-width: 10ch;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 9px;
            line-height: 1.2;
            transition: opacity .5s;
        }

        .speed-control-config-popup .popup-title:hover,
        .popup-title:hover + .CentAnni-version-label {
            opacity: 1;
        }

        .speed-control-config-popup .popup-footer::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3.2rem;
            pointer-events: none;
            box-shadow: 0 -30px 20px 0 var(--main-surface-primary);
        }

        .speed-control-config-popup.show {
            display: flex;
        }

        .speed-control-config-popup input {
            transition: border-color 0.2s ease-in-out;
        }

        .speed-control-config-popup input[type="number"] {
            width: 6ch;
            border: 1px solid rgba(255, 255, 255, .27);
            border-radius: 3px;
            background: transparent;
            color: var(--text-primary);
            text-align: center;
            margin-right: 10px;
        }

        .speed-control-config-popup input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield !important;
            appearance: none;
        }

        .speed-control-config-popup input[type="number"]::-webkit-outer-spin-button,
        .speed-control-config-popup input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .speed-control-config-popup input[type="url"] {
            flex: 1;
            color: var(--text-primary);
            background: transparent;
            margin-left: 10px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, .27);
        }

        .light .speed-control-config-popup input[type="url"],
        .light .speed-control-config-popup input[type="number"] {
            border-color: rgba(0, 0, 0, 0.27);
        }

        .speed-control-config-popup input[type="url"]:hover,
        .speed-control-config-popup input[type="number"]:hover {
            border-color: color(display-p3 0.1216 0.3059 0.5804);
        }

        .speed-control-config-popup input[type="url"]:focus,
        .speed-control-config-popup input[type="number"]:focus {
            border-color: color(display-p3 0 0.402 1);
        }

        .speed-control-config-popup .toggle-label {
            width: 100%;
            padding-left: 10px;
        }

        .speed-control-config-popup input[type="checkbox"],
        .speed-control-config-popup .toggle-label:hover {
            text-decoration: underline;
            cursor: pointer;
        }

        .speed-control-config-popup .speed-label {
            user-select: none;
            pointer-events: none;
        }

        .speed-control-config-popup button {
            padding: 4px 8px;
            border: 1px solid rgba(255, 255, 255, 0.27);
            border-radius: 3px;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .light .speed-control-config-popup button {
            border-color: rgba(0, 0, 0, 0.27);
        }

        .speed-control-config-popup .toggle-container {
            display: flex;
            align-items: center;
            text-wrap: nowrap;
        }

        :root:has(.CentAnni-style-nav-btn):has(#stage-sidebar-tiny-bar.opacity-100) header button[data-testid="open-sidebar-button"] {
            display: none;
        }

        .CentAnni-style-nav-btn:active  { opacity: .8;  }
        .CentAnni-style-nav-btn.enabled  { opacity: 1;  }
        .CentAnni-style-nav-btn.disabled { opacity: .5; }

        /* avatar position */
        #stage-slideover-sidebar .opacity-100 {
            padding-bottom: 10px;
        }

        #page-header,
        main > div > header,
        #calpico-page-header {
            padding-right: 130.5px;
        }

        #page-header.sticky {
            position: sticky;
        }

        main #thread div.thread-xl\\:pt-\\(--header-height\\) {
            padding-top: 0;
        }

        .bg-token-sidebar-surface-primary button:has(svg path[d^="M14.2548"]) {
            margin-right: 125px;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) .bg-token-sidebar-surface-primary button:has(svg path[d^="M14.2548"]) {
            margin: unset !important;
        }

        div.sticky:has([data-testid="accounts-profile-button"]) {
            position: fixed;
            top: 8px;
            right: 3px;
            height: fit-content;
            padding: 0;
            margin: 0;
            width: 125px;
            opacity: 1;
            z-index: 30;
            box-shadow: none;
            background-color: transparent;
        }

        [data-testid="accounts-profile-button"]:not(#stage-sidebar-tiny-bar *) {
            min-height: 36px;
        }

        .bg-token-sidebar-surface-primary .p-1\\.5 {
            padding-right: 0;
        }

        :root:has(div.z-1.shrink-0.overflow-x-hidden) div.sticky:has([data-testid="accounts-profile-button"]),
        :root:has(section [data-testid="bar-search-sources-header"]) div.sticky:has([data-testid="accounts-profile-button"]),
        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) div.sticky:has([data-testid="accounts-profile-button"]) {
            opacity: 0;
            z-index: -1;
        }

        :root:has(section [data-testid="bar-search-sources-header"]) .bg-token-sidebar-surface-primary button:has(svg path[d^="M14.2548"]) {
            margin-inline-end: calc(var(--spacing)*3);
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) .speed-control-config-popup.show {
            transform: translateX(-17%) !important;
        }

        :root:has(section [data-testid="bar-search-sources-header"]) div.bg-token-sidebar-surface-primary.relative.z-1 {
            z-index: 30;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) #page-header,
        :root:has(section [data-testid="bar-search-sources-header"]) #page-header,
        :root:has(#stage-sidebar-tiny-bar.opacity-100) main > div > header,
        :root:has(#stage-sidebar-tiny-bar.opacity-100) #page-header,
        :root:has(div.z-1.shrink-0.overflow-x-hidden) #page-header {
            padding: calc(var(--spacing)*2);
        }

        section [data-testid="bar-search-sources-header"] {
            background: color(srgb 0.0941 0.0941 0.0941);
            border-bottom: 1px solid rgba(45, 45, 45, 1);
            transform: translateY(-1px);
        }

        :root:has(nav > aside > a.__menu-item:not(:disabled):not([data-disabled])[data-active] svg use[href*="#266724"]) div.sticky:has([data-testid="accounts-profile-button"]) > div > div {
            background-color: #ffffff0d;
        }

        :root:has(nav > aside > a.__menu-item:not(:disabled):not([data-disabled])[data-active] svg use[href*="#266724"]) div.sticky:has([data-testid="accounts-profile-button"]) > div > div:hover {
            background-color: var(--menu-item-highlighted);
        }

        #stage-slideover-sidebar nav > div.align-end {
            display: none;
        }

        /* scroll position fix */
        article:has([data-message-author-role]) {
            scroll-margin-top: 0 !important;
        }

        #sidebar-header button:has(svg path[d^="M7.94556"]) {
            display: none;
        }

        /* GPT model picker */
        #CentAnni-gpt-model-quickbar {
            position: relative;
            display: flex;
            gap: 8px;
            background: transparent;
            text-wrap: nowrap;
            overflow-y: hidden;
            overflow-x: auto;
            scrollbar-width: none;
        }

        :root:has(#CentAnni-gpt-model-quickbar) [class*="\\[grid-area\\:trailing\\]"],
        :root:has(#CentAnni-gpt-model-quickbar) [class*="\\[grid-area\\:trailing\\]"] > .ms-auto {
            min-width: 0;
        }

        div.\\[grid-area\\:footer\\] {
            width: max-content;
            margin-right: 5px;
        }

        #composer-submit-button {
            min-width: 36px;
            min-height: 36px;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) div.\\[grid-area\\:footer\\] {
            width: unset;
            margin-right: unset;
        }

        .CentAnni-gpt-model-btn {
            font: 600 12px system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif;
            padding: 6px 10px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, .1);
            background: rgba(255, 255, 255, .08);
            color: #fff;
            cursor: pointer;
            transition: background-color .4s ease, border-color .4s ease;
        }

        .CentAnni-gpt-model-btn:hover {
            background: rgba(255, 255, 255, .12) !important;
            border-color: rgba(255, 255, 255, .25);
        }

        .CentAnni-gpt-model-btn:active {
            background: rgba(255, 255, 255, .2) !important;
            border-color: rgba(255, 255, 255, .5);
            transition: background-color .25s ease-out, border-color .1s ease-out;
        }

        html.light .CentAnni-gpt-model-btn {
            border: 1px solid rgba(0, 0, 0, .1);
            color: black;
        }

        html.light .CentAnni-gpt-model-btn:hover {
            background: rgb(250, 250, 250) !important;
            border-color: rgba(0, 0, 0, .2);
        }

        html.light .CentAnni-gpt-model-btn:active {
            background: rgb(245, 245, 245) !important;
            border-color: rgba(0, 0, 0, .5);
        }

        :root:has(main header div.gap-4.ps-4) #CentAnni-gpt-model-quickbar,
        :root:has(#main > div > header > div:nth-child(1) > h1) #CentAnni-gpt-model-quickbar,
        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) #CentAnni-gpt-model-quickbar,
        :root:has(nav > aside > a.__menu-item:not(:disabled):not([data-disabled])[data-active] svg use[href*="#266724"]) #CentAnni-gpt-model-quickbar {
            display: none;
        }

        @media (max-width: 768px) {
            #CentAnni-gpt-model-quickbar {
                display: none;
            }
        }

        #CentAnni-speak-btn {
            position: absolute;
            display: flex;
            bottom: 135px;
            left: 20px;
            width: 32px;
            height: 32px;
            color: deepskyblue;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            background: transparent;
        }

        #CentAnni-speak-btn:hover {
            background: rgba(255, 255, 255, 0.07);
        }

        #CentAnni-speak-btn:active {
            color: rgb(0, 251, 255);
        }

        :root:has(main button[aria-label^="Edit the title of"]) #CentAnni-speak-btn,
        :root:has(header button[aria-label="Turn on temporary chat"]) #CentAnni-speak-btn,
        :root:has(header button[aria-label="Turn off temporary chat"]) #CentAnni-speak-btn {
            display: none;
        }

        :root:has(.bg-token-bg-primary.absolute.start-0.z-20.h-full.overflow-hidden) #CentAnni-speak-btn {
            bottom: 115px;
            left: 0;
        }

        div[data-radix-popper-content-wrapper][style*="--radix-popper-transform-origin: 0% 86px"] {
            margin: 85px 0 0 50px;
        }

        div[data-radix-popper-content-wrapper][style*="--radix-popper-transform-origin: 0% 86px"] > div {
            display: flex;
            flex-direction: column-reverse;
        }

        #thread-bottom form div.no-scrollbar.horizontal-scroll-fade-mask {
            margin: 10px 0 -10px 0;
            padding-bottom: unset;
        }

        #thread article.text-token-text-primary :where([class*="_tableWrapper_"]) div.absolute.end-0 {
            height: unset !important;
        }

        div[aria-label="Report message"],
        button[aria-label="Report message"] {
            display: none;
        }
    `;

    // append css
    (document.head
        ? Promise.resolve(document.head)
        : new Promise(resolve => {
            document.readyState === 'loading'
                ? document.addEventListener('DOMContentLoaded', () => resolve(document.head), { once: true })
                : resolve(document.head);
        })
    ).then(head => {
        if (head)
            head.appendChild(styleSheet);
        else {
            document.documentElement.appendChild(styleSheet);
            console.error("Read Aloud Speedster: Failed to find head element. Using backup to append stylesheet.");
        }
    });

    const features = {
        squareDesign: {
            label: 'Square Design',
            enabled: false,
            sheet: null,
            style: `
                /* button 'send prompt' radius */
                .composer-submit-btn,
                button[aria-label="Send prompt"],
                button[aria-label="Stop streaming"],
                button[aria-label="Start voice mode"] {
                    border-radius: 4px !important;
                }

                /* button radii */
                .btn,
                .rounded-full:not(.bg-token-bg-tertiary) {
                    border-radius: 2px !important;
                }

                /* button minus radius */
                .speed-btn.minus {
                    border-radius: 2px 0 0 2px;
                }

                /* button plus radius */
                .speed-btn.plus {
                    border-radius: 0 2px 2px 0;
                }

                /* general radii */
                .rounded-md,
                .rounded-xl,
                .rounded-3xl,
                .__menu-item,
                .rounded-b-3xl,
                .rounded-t-3xl,
                .__composer-pill,
                form > div > div,
                .rounded-\\[18px\\],
                .rounded-\\[20px\\],
                .rounded-\\[36px\\],
                .rounded-\\[28px\\],
                .rounded-\\[24px\\],
                .composer-btn:enabled,
                .composer-btn::before,
                .surface-popover:before,
                .__menu-item-trailing-btn,
                form > div:nth-child(2) > div,
                main form div.contain-inline-size,
                #wham-message-modal-footer div.cursor-text.shadow-short {
                    border-radius: 2px !important;
                }

                /* popup radii and overlay */
                .rounded-lg,
                .rounded-2xl,
                .rounded-t-2xl,
                .rounded-\\[10px\\] {
                    border-radius: 2px !important;
                }

                /* reply radii */
                .rounded-b-lg,
                .rounded-\\[14px\\],
                .rounded-t-\\[20px\\] {
                    border-radius: 0 !important;
                }

                /* canvas */
                section.popover .text-black\\!,
                #prosemirror-context-children > div,
                section.popover .shadow-xl:not([role="toolbar"]),
                section.popover .shadow-lg:not([role="toolbar"]),
                section.popover div.border-token-border-default.z-70 {
                    border-radius: 0 !important;
                    right: -1px !important;
                    bottom: -1px !important;

                }

                .speed-btn,
                .speed-display,
                .composer-btn:enabled,
                button.__composer-pill {
                    border: 1px solid var(--border-default);
                }

                :root {
                    --show-dividers: none !important;
                }

                .bg-token-border-default {
                    background-color: transparent;
                }

                button.composer-btn[data-pill="true"][aria-haspopup="menu"],
                button.composer-btn[data-pill="true"][aria-haspopup="dialog"] {
                    margin-left: 8px;
                }

                main div:has(.loading-shimmer) a>span.rounded-ee-full,
                main div:has(.loading-shimmer) a>span.rounded-se-full {
                    border-start-end-radius: 2px;
                    border-end-end-radius: 2px;
                }

                main form div.\\[grid-area\\:footer\\].\\[scrollbar-width\\:none\\] > div {
                    gap: 8px;
                }

                article ul {
                    list-style-type: square;
                }

                .speed-display::after,
                .speed-display::before,
                .speed-btn.plus::before,
                .speed-btn.minus::before {
                    display: none;
                }
            `
        },
        darkerMode: {
            label: "Darker Background for Header and Chatbox",
            enabled: false,
            sheet: null,
            style: `
                div.grid.gap-y-2,
                form > div:nth-child(2) > div,
                main form div.contain-inline-size,
                div form > div.bg-token-bg-primary,
                div.grid.\\[grid-template-areas\\:\\'leading_primary_trailing\\'\\] {
                    background-color: #141414 !important;
                    border: 1px solid #2d2d2d;
                }

                .bg-token-bg-elevated-primary {
                    background-color: unset;
                }

                .h-header-height,
                .bg-token-main-surface-primary,
                .bg-token-bg-elevated-secondary,
                .bg-token-bg-elevated-secondary\\/20,
                #stage-slideover-sidebar nav div.sticky.top-0,
                #stage-slideover-sidebar > div > div.opacity-100.h-full {
                    background: #181818 !important;
                }

                .border-token-border-light {
                    border-color: rgba(0, 0, 0, 0.27);
                }

                .shadow-short,
                .shadow-short:is(.dark *) {
                    box-shadow:unset;
                }

                .dark\\:hover\\:bg-token-main-surface-tertiary:is(.dark *):hover {
                    background-color: var(--main-surface-tertiary)!important;
                }

                .hover\\:bg-token-main-surface-secondary:hover {
                    background-color: var(--main-surface-secondary)!important;
                }

                body > picture { display: none; }
            `
        },
        jumpToChat: {
            label: "Navigate to User's Responses Instead of ChatGPT's",
            enabled: false,
            sheet: null,
            style: ``
        },
        heightUserMessage: {
            label: "User Message Height Limiter",
            enabled: true,
            sheet: null,
            style: `
                div[data-message-author-role="user"] div.whitespace-pre-wrap {
                    max-height: 25dvh;
                    overflow:auto;
                    padding-right:15px;
                    overscroll-behavior: contain;
                }

                div[data-message-author-role="user"] div.relative {
                    padding-right:5px;
                }

                main .bg-token-main-surface-tertiary {
                    padding-right:0;
                }

                main .bg-token-main-surface-tertiary .justify-end,
                main .bg-token-main-surface-tertiary>div.overflow-auto {
                    padding-right:12px;
                }
            `
        },
        hideShareIcon: {
            label: "Hide Share Icon",
            enabled: false,
            sheet: null,
            style: `
                article button[aria-label="Share"] {
                    display: none;
                }
            `
        },
        compactShareAddBtn: {
            label: "Compact 'Share' and 'Add People' Buttons",
            enabled: false,
            sheet: null,
            style: `
                button[data-testid="share-chat-button"] > div {
                    width: 16px;
                    overflow: hidden;
                    justify-content: flex-start;
                }

                button[data-testid="start-group-chat-from-conversation-button"] > div {
                    width: 17px;
                    overflow: hidden;
                    justify-content: flex-start;
                }
            `
        },
        shiftEnterSend: {
            label: "Send Message with Shift+Enter instead of Enter",
            enabled: false,
            sheet: null,
            style: ``
        },
        keepIconsVisible: {
            label: "Keep Icons Visible",
            enabled: true,
            sheet: null,
            style: `
                main [class*="mask-image"] {
                    mask-image: none !important;
                    -webkit-mask-image: none !important;
                }

                .group\\/turn-messages .pointer-events-none.opacity-0 {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
            `
        },
        reduceAnimation: {
            label: "No Icon Animation",
            enabled: false,
            sheet: null,
            style: `
                .motion-safe\\:transition-opacity {
                    transition-duration: unset;
                    transition-property: none;
                    transition-timing-function: unset;
                }
            `
        },
        hidePlusAvatar: {
            label: "Hide Plus/Pro Icon in Avatar",
            enabled: false,
            sheet: null,
            style: `
                header button[aria-label="Open profile menu"] span,
                nav div[aria-label="Open profile menu"] div.min-w-0,
                main button[aria-label="Open Profile Menu"] span span,
                #page-header #conversation-header-actions button[aria-label="Open profile menu"] span {
                    display: none;
                }

                div.sticky:has([data-testid="accounts-profile-button"]) {
                    width:52px;
                }

                #page-header,
                main > div > header,
                #calpico-page-header {
                    padding-right:60px;
                }

                .bg-token-sidebar-surface-primary button:has(svg path[d^="M14.2548"]) {
                    margin-right:55px;
                }
            `
        },
        hideViewPlans: {
            label: "Hide 'View plans' and 'Get Plus'",
            enabled: false,
            sheet: null,
            style: `
                div.__menu-item:has(svg path[d^="M8.44824"]),
                #page-header div:has(path[d^="M17.665 10C17"]) {
                    display: none !important;
                }
            `
        },
        hideGetProBtn: {
            label: "Hide 'Get Pro' Button",
            enabled: false,
            sheet: null,
            style: `
                div[role="menuitem"]:has(use[href*="#ac4202"]),
                main .flex > button.btn-primary:first-child:last-child {
                    display: none;
                }
            `
        },
        hideDictateBtn: {
            label: "Hide 'Dictate' Button",
            enabled: false,
            sheet: null,
            style: `
                button[aria-label="Dictate button"] {
                    display: none;
                }
            `
        },
        disableVoiceModeBtn: {
            label: "Disable Voice Mode Button",
            enabled: false,
            sheet: null,
            style: `
                button[aria-label="Start Voice"],
                button[aria-label="Start voice mode"] {
                    pointer-events: none;
                    opacity: 0.5;
                }
            `
        },
        hideMistakesTxt: {
            label: "Hide 'ChatGPT can make mistakes' Text",
            enabled: false,
            sheet: null,
            style: `
                div.text-token-text-secondary[class*="md\\:px-"],
                div.text-token-text-secondary.text-pretty.text-xs {
                    display: none;
                }

                .xl\\:px-5, main form,
                div.flex-1.mx-auto > div.relative.w-full {
                    padding-bottom: 1rem;
                }
            `
        },
        projectNxtMore: {
            label: "'New project' and 'See more' Buttons Next to Each Other",
            enabled: true,
            sheet: null,
            style: `
                nav div.group\\/sidebar-expando-section:has(use[href*="#608c49"]) {
                    display: flex;
                    flex-direction: column;
                }

                nav div.hoverable:has(use[href*="#f6d0e2"]),
                nav div.hoverable:has(use[href*="#608c49"]) {
                    width: calc(50% - 6px);
                }

                nav div.hoverable:has(use[href*="#608c49"]) div.truncate {
                    text-overflow: unset;
                }

                nav div.hoverable:has(use[href*="#f6d0e2"]) {
                    position: absolute;
                    transform: translate(100%, 36px);
                    flex-direction: row-reverse;
                    padding: 8px 10px 8px 20px;
                    order: -1;
                }
            `
        },
        navIconsUp: {
            label: "Compact Search and Library Buttons",
            enabled: true,
            sheet: null,
            style: `
                nav a.group.__menu-item[href="/codex"],
                nav a.group.__menu-item[href="/atlas"],
                div.pointer-events-none.h-px.w-px.-mb-px,
                nav > aside > a:has(use[href*="#3a5c87"]),
                nav > aside > a:has(svg path[d^="M2.6687"]),
                nav div.trailing:has(svg path[d^="M11.3349"]),
                nav > div:has(use[href*="#c8839f"]) > a div.grow,
                #stage-slideover-sidebar nav > aside div.absolute.inset-0,
                nav > aside > a:has(use[href*="#266724"]) span.__menu-item-badge,
                nav > aside > a:has(use[href*="#266724"]) div.text-token-text-tertiary,
                nav > aside > div:has(use[href*="#ac6d36"]) div.text-token-text-tertiary {
                    display: none;
                }

                .tall\\:top-header-height,
                nav > aside.last\\:mb-5.mt-\\(--sidebar-section-first-margin-top\\) {
                    height: 0;
                    padding:0;
                    margin-bottom: -41px;
                }

                nav > div:has(use[href*="#c8839f"]),
                nav > aside > a:has(use[href*="#266724"]),
                nav > aside > div:has(use[href*="#ac6d36"]) {
                    margin: 0;
                    z-index: 31;
                    color: var(--text-tertiary);
                }

                nav > aside > div:has(use[href*="#ac6d36"]) {
                    transform: translate(46px, -44px);
                    width: 40px;
                }

                nav > aside > a:has(use[href*="#266724"]) {
                    transform: translate(86px, -80px);
                    width: 92px;
                }

                nav > aside > a:has(use[href*="#266724"]) div.truncate {
                    text-overflow: clip;
                }

                nav > div:has(use[href*="#c8839f"]) {
                    transform: translate(178px, -3px);
                    width: 36px;
                    padding: 0;
                }

                nav > div:has(use[href*="#c8839f"]) > a {
                    padding: 0;
                    margin: 0;
                    min-width: 36px;
                }

                nav > div:has(use[href*="#c8839f"]):hover,
                nav button:has(svg path[d^="M6.83496"]):hover,
                nav > aside > a:has(use[href*="#266724"]):hover,
                nav > aside > div:has(use[href*="#ac6d36"]):hover {
                    color: var(--text-primary);
                }

                nav > div:has(use[href*="#c8839f"]),
                #stage-slideover-sidebar nav > div.sticky.top-0.z-30,
                #stage-slideover-sidebar div.bg-token-bg-elevated-secondary.top-0 {
                    z-index:17;
                }

                nav > div:has(use[href*="#c8839f"]) > a > div.items-center {
                    margin-left: 8px;
                }

                nav div.group\\/sidebar-expando-section:has(use[href*="#b6a09f"]) {
                    margin-top: 5px !important;
                }
            `
        },
        sidebarSections: {
            label: "Compact Sidebar with Separators",
            enabled: true,
            sheet: null,
            style: `
                nav .__menu-item-trailing-btn,
                nav .__menu-item:not(:has(use[href*="#ac6d36"])):not(:has(use[href*="#266724"])) {
                    min-height: calc(var(--spacing)*8);
                    max-height:32px;
                }

                nav .__menu-item-trailing-btn,
                .self-stretch {
                    align-self:center;
                }

                nav .__menu-item-trailing-btn:hover {
                    background: rgba(255, 255, 255, .1);
                }

                nav .light .__menu-item-trailing-btn:hover {
                    background: rgba(1, 1, 1, .1);
                }

                nav .mt-\\(--sidebar-section-margin-top\\),
                nav .pt-\\(--sidebar-section-margin-top\\),
                nav .mt-\\(--sidebar-section-first-margin-top\\),
                nav .pt-\\(--sidebar-section-first-margin-top\\) {
                    margin-top: 10px!important;
                    padding: 0!important;
                }

                nav div.group\\/sidebar-expando-section {
                    margin: 10px 0 0 0;
                }

                nav div.group\\/sidebar-expando-section::before,
                nav .mt-\\(--sidebar-section-margin-top\\)::before,
                nav .pt-\\(--sidebar-section-margin-top\\)::before,
                nav .mt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .pt-\\(--sidebar-section-first-margin-top\\)::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    background-color: color(srgb 1 1 1 / 0.17);
                    display: block;
                    transform: translateY(-5px);
                }

                nav .light .mt-\\(--sidebar-section-margin-top\\)::before,
                nav .light .pt-\\(--sidebar-section-margin-top\\)::before,
                nav .light .mt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .light .pt-\\(--sidebar-section-first-margin-top\\)::before {
                    background-color: color(srgb 0 0 0 / 0.17);
                }

                nav .tall\\:top-header-height {
                    margin-top: 0 !important;
                }

                nav .tall\\:top-header-height::before {
                    background-color: transparent;
                }

                nav > #history > aside > h2 {
                    padding:3px 10px 0 10px;
                }

                .__menu-item:not(:disabled):not([data-disabled]):not([data-no-hover-bg]).hoverable:hover {
                    background-color: var(--menu-item-highlighted);
                }

                nav div[aria-label="Expand section"],
                nav div[aria-label="Collapse section"] {
                    padding: 0px 10px;
                     min-height: unset !important;
                }

                nav > div:has(use[href*="#c8839f"]) > a {
                    max-height: unset!important;
                    height: 36px;
                }

                nav div.hoverable:has(use[href*="#f6d0e2"]) {
                    transform: translate(100%, 32px);
                }

                #stage-slideover-sidebar nav div.overflow-hidden > h2 {
                    display: none;
                }
            `
        },
        justifyText: {
            label: "Justify Text",
            enabled: true,
            sheet: null,
            style: `
                .markdown {
                    text-align: justify;
                }

                .markdown h1 {
                    text-align: left;
                }
            `
        },
        listDashes: {
            label: "Replace Bullets with Dashes in Lists",
            enabled: false,
            sheet: null,
            style: `
                article ul {
                    list-style-type: none;
                }

                article ul li::before {
                    position: absolute;
                    content: "– ";
                    margin-left: -25px;
                }
            `
        },
        removeFocusOutlines: {
            label: "Remove Focus Outlines",
            enabled: false,
            sheet: null,
            style: `
                :focus {
                    outline: none;
                    box-shadow: 0 0 0 0 transparent;
                }

                [data-testid="profile-button"] .group-focus-visible\\:ring-2 {
                    --tw-ring-shadow: 0 0 #0000;
                    --tw-ring-offset-shadow: 0 0 #0000;
                }
            `
        },
        jumpToChatActive: {
            label: "Add Message Navigation Arrows",
            enabled: true,
            sheet: null,
            style: ``
        },
        modelSelector: {
            label: "Add Quick Model Selector Buttons",
            enabled: true,
            sheet: null,
            style: ``
        },
        additionalModels: {
            label: "'Show additional models' Active",
            enabled: false,
            sheet: null,
            style: ``
        },
        thinkingExtended: {
            label: "Use 'Extended Thinking' by Default",
            enabled: false,
            sheet: null,
            style: ``
        },
        readAloudBtn: {
            label: "Add Button to Read Aloud Last Message",
            enabled: true,
            sheet: null,
            style: ``
        },
    };

    let swapEnterDetach = null;
    function applyFeature(key) {
        const feature = features[key];
        if (!feature) return;
        if (key === 'shiftEnterSend') {
            if (feature.enabled && !swapEnterDetach) swapEnterDetach = swapEnterBehavior();
            else if (!feature.enabled && swapEnterDetach) {
                swapEnterDetach();
                swapEnterDetach = null;
            }
            return;
        }
        if (feature.enabled) {
            if (feature.style && !feature.sheet) {
                feature.sheet = document.createElement('style');
                feature.sheet.textContent = feature.style;
                document.head.appendChild(feature.sheet);
            }
        } else if (feature.sheet) {
            feature.sheet.remove();
            feature.sheet = null;
        }
    }

    // load feature settings from config or use defaults
    const loadCSSsettings = async () => {
        // apply defaults immediately
        for (const key in features) applyFeature(key);

        // fetch stored values concurrently
        const entries = await Promise.all(Object.keys(features).map(async key => [key, await GM.getValue(key)]));

        for (const [key, value] of entries) {
            if (value !== undefined) {
                features[key].enabled = value;
                applyFeature(key);
            }
        }
    };

    let savedSpeed;
    let observer = null;
    let playbackSpeed = 1;
    let configPopup = null;
    let playListener = null;
    let rateListener = null;
    let playingAudio = new Set();
    let controlsContainer = null;
    let ignoreRateChange = false;
    let docListenerActive = false;
    let speedDisplayElement = null;
    let lastUserRate = playbackSpeed;

    const MIN_SPEED = 1;
    const MAX_SPEED = 17;
    const DELTA = 0.25;

    // load CSS settings
    const cssSettingsReady = loadCSSsettings();

    // load playback speed
    async function initializeSpeed() {
        savedSpeed = await GM.getValue('defaultSpeed', 1);
        playbackSpeed = savedSpeed;
        lastUserRate = playbackSpeed;

        updateSpeedDisplay();
        setPlaybackSpeed();
    }

    // set playback speed and manage listeners
    function setPlaybackSpeed() {
        playingAudio.forEach(audio => {
            audio.playbackRate = playbackSpeed;
            audio.preservesPitch = audio.mozPreservesPitch = audio.webkitPreservesPitch = true;
        });

        if (!playListener) {
            playListener = e => {
                const audio = e.target;
                if (!(audio instanceof HTMLAudioElement)) return;
                audio.playbackRate = playbackSpeed;
                playingAudio.add(audio);

                const remove = () => { playingAudio.delete(audio); };
                audio.addEventListener('pause', remove, { once: true });
                audio.addEventListener('ended', remove, { once: true });
            };
            document.addEventListener('play', playListener, true);
        }

        if (!rateListener) {
            rateListener = e => {
                const audio = e.target;
                if (!(audio instanceof HTMLAudioElement)) return;
                if (ignoreRateChange) { ignoreRateChange = false; return; }
                audio.playbackRate = lastUserRate;
            };
            document.addEventListener('ratechange', rateListener, true);
        }
    }

    // config popup
    function createConfigPopup() {
        if (configPopup) {
            document.removeEventListener('click', handleDocumentClick);
            docListenerActive = false;
            configPopup.remove();
        }

        configPopup = document.createElement('div');
        configPopup.classList.add('speed-control-config-popup');

        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('popup-header');

        const title = document.createElement('a');
        title.href = 'https://github.com/TimMacy/ReadAloudSpeedster';
        title.target = '_blank';
        title.rel = 'noopener';
        title.textContent = 'Read Aloud Speedster';
        title.title = 'GitHub Repository for Read Aloud Speedster';
        title.classList.add('popup-title');

        const versionSpan = document.createElement('span');
        const scriptVersion = GM.info.script.version;
        versionSpan.textContent = `v${scriptVersion}`;
        versionSpan.classList.add('CentAnni-version-label');

        headerWrapper.appendChild(title);
        headerWrapper.appendChild(versionSpan);

        const content = document.createElement('div');
        content.classList.add('popup-content');

        // input for speed
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('toggle-container');

        const speedLabel = document.createElement('span');
        speedLabel.classList.add('speed-label');
        speedLabel.textContent = 'Default Playback Speed';

        const input = document.createElement('input');
        input.id = 'defaultSpeedInput';
        input.type = 'number';
        input.min = MIN_SPEED;
        input.max = MAX_SPEED;
        input.step = DELTA;
        input.value = savedSpeed;

        speedContainer.appendChild(input);
        speedContainer.appendChild(speedLabel);
        content.appendChild(speedContainer);

        // build settings interface
        const toggleElements = [];
        const createElement = (tag, className, attributes = {}) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.assign(element, attributes);
            return element;
        };

        Object.entries(features).forEach(([key, feature]) => {
            const container = createElement('div', 'toggle-container');
            const checkbox = createElement('input', '', {
                type: 'checkbox',
                id: `${key}Toggle`,
                checked: feature.enabled
            });
            const label = createElement('label', 'toggle-label', {
                textContent: feature.label,
                htmlFor: checkbox.id
            });

            container.append(checkbox, label);
            toggleElements.push({ key, checkbox });
            content.appendChild(container);
        });

        // save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';

        async function handleSave() {
            const newSpeed = parseFloat(input.value);
            if (newSpeed >= MIN_SPEED && newSpeed <= MAX_SPEED) {
                await GM.setValue('defaultSpeed', newSpeed);
                playbackSpeed = newSpeed;
                updateSpeedDisplay();
                setPlaybackSpeed();
            }

            let navChanged = false;
            for (const { key, checkbox } of toggleElements) {
                if (features[key].enabled !== checkbox.checked) {
                    features[key].enabled = checkbox.checked;
                    await GM.setValue(key, features[key].enabled);
                    applyFeature(key);
                    if (key === 'jumpToChat') navChanged = true;
                }
            }

            if (navChanged) {
                navCleanup?.();
                navCleanup = navBtns();
            }

            configPopup.classList.remove('show');
            if (docListenerActive) {
                document.removeEventListener('click', handleDocumentClick);
                docListenerActive = false;
            }
        }

        saveButton.classList.add('save-button');
        saveButton.addEventListener('click', handleSave);

        configPopup.appendChild(headerWrapper);
        configPopup.appendChild(content);

        const footer = document.createElement('div');
        footer.classList.add('popup-footer');

        const copyrightLink = document.createElement('a');
        copyrightLink.href = 'https://github.com/TimMacy';
        copyrightLink.target = '_blank';
        copyrightLink.rel = 'noopener';
        copyrightLink.textContent = 'Copyright © 2025–2026 Tim Macy';
        copyrightLink.title = 'Copyright © 2025–2026 Tim Macy';

        footer.appendChild(copyrightLink);
        footer.appendChild(saveButton);

        configPopup.appendChild(footer);
        document.body.appendChild(configPopup);

        return configPopup;
    }

    function handleDocumentClick(e) {
        if (!configPopup.contains(e.target) && !e.target.classList.contains('speed-display')) {
            configPopup.classList.remove('show');
            document.removeEventListener('click', handleDocumentClick);
            docListenerActive = false;
        }
    }

    // speed display
    function updateSpeedDisplay() {
        if (speedDisplayElement) {
            speedDisplayElement.textContent = `${playbackSpeed}x`;
        }
    }

    // create controls
    function createControlButtons() {
        if (controlsContainer && document.body.contains(controlsContainer)) return;

        controlsContainer = document.createElement('div');
        controlsContainer.classList.add('speed-control-container');
        controlsContainer.setAttribute('data-reactroot', '');
        controlsContainer.setAttribute('suppressHydrationWarning', 'true');

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.classList.add('speed-btn', 'minus');

        const speedDisplay = document.createElement('span');
        speedDisplay.classList.add('speed-display');
        speedDisplay.textContent = `${playbackSpeed}x`;
        speedDisplayElement = speedDisplay;

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.classList.add('speed-btn', 'plus');

        function handleMinus() {
            ignoreRateChange = true;
            playbackSpeed = Math.max(MIN_SPEED, playbackSpeed - DELTA);
            lastUserRate = playbackSpeed;
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handlePlus() {
            ignoreRateChange = true;
            playbackSpeed = Math.min(MAX_SPEED, playbackSpeed + DELTA);
            lastUserRate = playbackSpeed;
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handleSpeedClick(e) {
            e.stopPropagation();
            if (!configPopup || !document.body.contains(configPopup)) {
                configPopup = createConfigPopup();
            }
            const show = configPopup.classList.toggle('show');

            if (show) {
                if (!docListenerActive) {
                    document.addEventListener('click', handleDocumentClick);
                    docListenerActive = true;
                }
                const rect = e.target.getBoundingClientRect();
                configPopup.style.position = 'absolute';
                configPopup.style.bottom = `${window.innerHeight - rect.top + 10}px`;
                configPopup.style.left = `${rect.left + (rect.width / 2)}px`;
                configPopup.style.transform = 'translateX(-50%)';
            } else if (docListenerActive) {
                document.removeEventListener('click', handleDocumentClick);
                docListenerActive = false;
            }
        }

        minusButton.addEventListener('click', handleMinus);
        plusButton.addEventListener('click', handlePlus);
        speedDisplay.addEventListener('click', handleSpeedClick);

        controlsContainer.appendChild(minusButton);
        controlsContainer.appendChild(speedDisplay);
        controlsContainer.appendChild(plusButton);
        document.querySelector('#thread-bottom-container div.\\[grid-area\\:leading\\]')?.insertAdjacentElement('afterend', controlsContainer);
    }

    // message navigation button section
    const HEADER_OFFSET = 52;
    const UP_ARROW_PATH = 'M10 3.293l-6.354 6.353a1 1 0 001.414 1.414L9 6.414V17a1 1 0 102 0V6.414l3.939 3.939a1 1 0 001.415-1.414L10 3.293z';
    const DOWN_ARROW_PATH = 'M10 16.707l6.354-6.353a1 1 0 00-1.414-1.414L11 13.586V3a1 1 0 10-2 0v10.586L5.061 8.94a1 1 0 10-1.415 1.415L10 16.707z';
    const createIcon = (pathData) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        const wrapper = document.createElement('div');
        wrapper.className = 'flex w-full items-center justify-center';
        wrapper.appendChild(svg);
        return wrapper;
    };

    const createNavButton = (pathData, label) => {
        const btn = document.createElement('button');
        btn.className = 'CentAnni-style-nav-btn btn relative btn-ghost text-token-text-primary';
        btn.setAttribute('aria-label', label);
        btn.appendChild(createIcon(pathData));
        return btn;
    };

    const upBtn = createNavButton(UP_ARROW_PATH, 'Jump to previous message');
    const downBtn = createNavButton(DOWN_ARROW_PATH, 'Jump to next message');

    let navCleanup = null;
    function navBtns() {
        const targetChat = document.querySelector('main > #thread div.flex.basis-auto.flex-col.grow');
        const actions = document.querySelector('#conversation-header-actions');
        const shareBtn = actions?.querySelector('button[aria-label="Share"]');
        if (!shareBtn || !actions || !targetChat) return () => {};

        let chatObserver = null;
        let messageCache = [];

        const role = features.jumpToChat?.enabled ? 'user' : 'assistant';
        const queryMessages = () => Array.from(targetChat.querySelectorAll(`article:has([data-message-author-role="${role}"]:not([data-message-id^="placeholder-request"]))`));
        const populateCache = () => { messageCache = queryMessages(); };

        const getNextMessage = () => {
            const current = window.scrollY + HEADER_OFFSET;
            for (const msg of messageCache) {
                const top = msg.getBoundingClientRect().top + window.scrollY;
                if (top > current + 1) return msg;
            }
            return null;
        };

        const getPrevMessage = () => {
            const current = window.scrollY + HEADER_OFFSET - 1;
            for (let i = messageCache.length - 1; i >= 0; i--) {
                const rect = messageCache[i].getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = rect.bottom + window.scrollY;
                if (top < current && bottom > current) return messageCache[i];
                if (bottom < current - 1) return messageCache[i];
            }
            return null;
        };

        const checkForNewBelow = () => {
            const msgs = queryMessages();
            if (msgs.length > messageCache.length) {
                const newMsgs = msgs.slice(messageCache.length);
                messageCache.push(...newMsgs);
                const current = window.scrollY + HEADER_OFFSET;
                for (const msg of newMsgs) {
                    const top = msg.getBoundingClientRect().top + window.scrollY;
                    if (top > current + 1) return msg;
                }
            }
            return null;
        };

        const setState = (btn, enabled) => {
            btn.classList.toggle("enabled", enabled);
            btn.classList.toggle("disabled", !enabled);
        };

        const update = () => {
            setState(upBtn, !!getPrevMessage());
            setState(downBtn, !!getNextMessage());
        };

        const jump = (prev) => {
            let target = prev ? getPrevMessage() : getNextMessage();
            if (!prev && !target) target = checkForNewBelow();
            if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
            update();
        };

        const createButtons = () => {
            if (document.body.contains(upBtn)) return;

            upBtn.onclick = () => jump(true);
            downBtn.onclick = () => jump(false);

            actions.insertBefore(downBtn, shareBtn);
            actions.insertBefore(upBtn, downBtn);

            populateCache();
            startObserver();
        };

        // observer for new messages
        let stopButtonPresent;
        const targetSelector = '#thread-bottom-container form div.flex.items-center.gap-2 > div.ms-auto';
        const stopBtnSelectors = 'button[data-testid="stop-button"],#composer-submit-button[aria-label="Stop streaming"]';
        document.querySelector(stopBtnSelectors) ? stopButtonPresent = true : stopButtonPresent = false;

        const buttonObserver = new MutationObserver((mutations) => {
            const stopButton = document.querySelector(stopBtnSelectors);

            if (stopButton && !stopButtonPresent) stopButtonPresent = true;
            else if (!stopButton && stopButtonPresent) {
                stopButtonPresent = false;
                requestAnimationFrame(() => {
                    checkForNewBelow();
                    requestAnimationFrame(() => update());
                });
            }
        });

        const targetNode = document.querySelector(targetSelector);
        if (targetNode) buttonObserver.observe(targetNode, { childList: true, subtree: true });

        const startObserver = () => {
            if (chatObserver || !targetChat) return;
            if (queryMessages().length) {
                populateCache();
                requestAnimationFrame(() => { requestAnimationFrame(() => update()); });
                return;
            }

            chatObserver = new MutationObserver(() => {
                if (queryMessages().length) {
                    populateCache();
                    stopObserver();
                    requestAnimationFrame(() => { requestAnimationFrame(() => update()); });
                }
            });
            chatObserver.observe(targetChat, { childList: true });
        };

        const stopObserver = () => {
            if (chatObserver) {
                chatObserver.disconnect();
                chatObserver = null;
            }
        };

        createButtons();

        return () => {
            stopObserver();
            messageCache = [];
            upBtn.remove();
            downBtn.remove();
            buttonObserver?.disconnect();
        };
    }

    // swap ENTER and SHIFT+ENTER
    function swapEnterBehavior() {
        function handleKeyDown(event) {
            if (event.key === 'Enter') {
                const isPromptTextarea = event.target.matches('#prompt-textarea') || event.target.closest('.ProseMirror') || event.target.matches('[name="prompt-textarea"]');
                if (!isPromptTextarea) return;
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                const newEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    shiftKey: !event.shiftKey,
                    ctrlKey: event.ctrlKey,
                    altKey: event.altKey,
                    metaKey: event.metaKey,
                    bubbles: true,
                    cancelable: true
                });

                document.removeEventListener('keydown', handleKeyDown, true);
                event.target.dispatchEvent(newEvent);
                setTimeout(() => { document.addEventListener('keydown', handleKeyDown, true); }, 0);
            }
        }
        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }

    // model configurations
    const legacySubmenu = '[data-testid="Legacy models-submenu"]';
    const modelConfigs = {
        // current
        'gpt-5': { needsSubmenu: false, buttonSelector: '[data-testid="model-switcher-gpt-5-2"]' },
        'instant': { needsSubmenu: false, buttonSelector: '[data-testid="model-switcher-gpt-5-2-instant"]' },
        'gpt-5-thinking': { needsSubmenu: false, buttonSelector: '[data-testid="model-switcher-gpt-5-2-thinking"]' },

        // legacy models (submenu)
        'gpt-4o': { needsSubmenu: true, buttonSelector: '[data-testid="model-switcher-gpt-4o"]' },
        'gpt-4.1': { needsSubmenu: true, buttonSelector: '[data-testid="model-switcher-gpt-4-1"]' },
        'gpt-o3': { needsSubmenu: true, buttonSelector: '[data-testid="model-switcher-o3"]' },
        'gpt-o4-mini': { needsSubmenu: true, buttonSelector: '[data-testid="model-switcher-o4-mini"]' },
        'thinking-mini': { needsSubmenu: true, buttonSelector: '[data-testid="model-switcher-gpt-5-t-mini"]' }
    };

    // select GPT model (default 4o)
    let modelObserver, timeout;
    let handlingThinkingBtn = false;
    const selectModel = (modelType) => {
        modelObserver?.disconnect();
        let subMenu = true;

        const config = modelConfigs[modelType];
        if (!config) return;

        const cleanup = () => {
            modelObserver?.disconnect();
            if (timeout) clearTimeout(timeout);
        };

        const simulateClick = (element) => {
            const rect = element.getBoundingClientRect();
            const centerX = Math.floor(rect.left + rect.width / 2);
            const centerY = Math.floor(rect.top + rect.height / 2);
            const eventOptions = {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                composed: true
            };

            if (config.needsSubmenu) {
                if (window.PointerEvent) {
                    element.dispatchEvent(new PointerEvent('pointerenter', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
                    element.dispatchEvent(new PointerEvent('pointermove', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
                }
                element.dispatchEvent(new MouseEvent('mouseenter', eventOptions));
                element.dispatchEvent(new MouseEvent('mouseover', eventOptions));
            }
            if (window.PointerEvent) element.dispatchEvent(new PointerEvent('pointerdown', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 }));
            element.dispatchEvent(new MouseEvent('mousedown', { ...eventOptions, button: 0, buttons: 1 }));
            if (window.PointerEvent) element.dispatchEvent(new PointerEvent('pointerup', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 0 }));
            element.dispatchEvent(new MouseEvent('mouseup', { ...eventOptions, button: 0, buttons: 0 }));

            element.click();
        };

        const check = () => {
            const submenuPanel = '[role="menu"][data-state="open"]:not([hidden])';

            if (config.needsSubmenu) { // legacy models
                if (subMenu) {
                    const submenuTrigger = document.querySelector(`${submenuPanel} ${legacySubmenu}`);
                    if (submenuTrigger) {
                        simulateClick(submenuTrigger);
                        subMenu = false;
                    }
                } else if (!subMenu) {
                    const modelButton = document.querySelector(`${submenuPanel} ${config.buttonSelector}`);
                    if (modelButton) {
                        simulateClick(modelButton);
                        cleanup();
                    }
                }
            } else { // current models
                const modelButton = document.querySelector(`${submenuPanel} ${config.buttonSelector}`);
                if (modelButton) {
                    simulateClick(modelButton);
                    cleanup();
                }
            }
            if (modelType === 'gpt-5-thinking' && !handlingThinkingBtn && features.thinkingExtended.enabled) {
                handlingThinkingBtn = true;
                setTimeout(() => extendedThinking(), 50);
            }
        };

        // pick extended thinking by default
        const extendedThinking = () => {
            const btn = document.querySelector('button[aria-label="Thinking, click to remove"] + button.__composer-pill');
            if (btn) {
                setTimeout(() => {
                    simulateClick(btn);
                    setTimeout(() => {
                        const extendedThinkingBtn = document.querySelector('div[role="menuitemradio"][aria-checked="false"]');
                        if (extendedThinkingBtn) extendedThinkingBtn.click();
                    }, 50);
                }, 50);
            }
            setTimeout(() => handlingThinkingBtn = false, 250);
        };

        // open menu selector panel
        const headerButton = document.querySelector('header#page-header button[data-testid="model-switcher-dropdown-button"], main header button[data-testid="model-switcher-dropdown-button"]');
        if (!headerButton) return;
        simulateClick(headerButton);

        // model observer
        modelObserver = new MutationObserver(check);
        modelObserver.observe(document.body, { childList: true, subtree: true });
        timeout = setTimeout(cleanup, 10000);
        check();
    };

    const addModelButtons = () => {
        if (document.getElementById("CentAnni-gpt-model-quickbar")) return;
        const bar = document.createElement("div");
        bar.id = "CentAnni-gpt-model-quickbar";
        const mkBtn = (label, clickHandler) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.className = 'CentAnni-gpt-model-btn';
            b.onclick = e => { e.preventDefault(); e.stopPropagation(); clickHandler(); return false; };
            b.onpointerdown = e => { e.preventDefault(); e.stopPropagation(); };
            b.setAttribute('form', 'nope');
            b.onmouseenter = () => b.style.background = "rgba(255,255,255,.16)";
            b.onmouseleave = () => b.style.background = "rgba(255,255,255,.08)";
            return b;
        };

        bar.appendChild(mkBtn("Auto", () => selectModel("gpt-5")));
        bar.appendChild(mkBtn("Thinking", () => selectModel("gpt-5-thinking")));
        bar.appendChild(mkBtn("Instant", () => selectModel("instant")));

        if (features.additionalModels.enabled) {
            bar.appendChild(mkBtn("GPT-4o", () => selectModel("gpt-4o")));

            bar.appendChild(mkBtn("Thinking mini", () => selectModel("thinking-mini")));

            bar.appendChild(mkBtn("GPT-4.1", () => selectModel("gpt-4.1")));
            bar.appendChild(mkBtn("o3", () => selectModel("gpt-o3")));
            bar.appendChild(mkBtn("o4-mini", () => selectModel("gpt-o4-mini")));
        }

        const targetContainer = document.querySelector("main form div.cursor-text:not(#thread-bottom-container) div.flex.items-center.gap-2.\\[grid-area\\:trailing\\]");
        targetContainer?.insertBefore(bar, targetContainer.firstChild);
    };

    const readAloud = () => {
        const buttons = document.querySelectorAll('button[aria-label="More actions"]');
        const button = buttons[buttons.length - 1];
        button.focus();
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        setTimeout(() => { document.querySelector('[aria-label="Read aloud"]').click(); }, 500);
    };

    const svgPath = (() => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M9.75122 4.09203C9.75122 3.61482 9.21964 3.35044 8.84399 3.60277L8.77173 3.66039L6.55396 5.69262C6.05931 6.14604 5.43173 6.42255 4.7688 6.48461L4.48267 6.49828C3.52474 6.49851 2.74829 7.27565 2.74829 8.23363V11.7668C2.74829 12.7248 3.52474 13.501 4.48267 13.5012C5.24935 13.5012 5.98874 13.7889 6.55396 14.3069L8.77173 16.3401L8.84399 16.3967C9.21966 16.6493 9.75122 16.3858 9.75122 15.9084V4.09203ZM17.2483 10.0002C17.2483 8.67623 16.9128 7.43233 16.3235 6.34691L17.4924 5.71215C18.1849 6.9875 18.5784 8.4491 18.5784 10.0002C18.5783 11.5143 18.2033 12.9429 17.5413 14.1965C17.3697 14.5212 16.9675 14.6453 16.6428 14.4739C16.3182 14.3023 16.194 13.9001 16.3655 13.5754C16.9288 12.5086 17.2483 11.2927 17.2483 10.0002ZM13.9182 10.0002C13.9182 9.1174 13.6268 8.30445 13.135 7.64965L14.1985 6.85082C14.8574 7.72804 15.2483 8.81952 15.2483 10.0002L15.2336 10.3938C15.166 11.3044 14.8657 12.1515 14.3918 12.8743L14.3069 12.9797C14.0889 13.199 13.7396 13.2418 13.4709 13.0657C13.164 12.8643 13.0784 12.4528 13.2795 12.1457L13.4231 11.9084C13.6935 11.4246 13.8643 10.8776 13.9075 10.2942L13.9182 10.0002ZM13.2678 6.71801C13.5615 6.49772 13.978 6.55727 14.1985 6.85082L13.135 7.64965C12.9144 7.35599 12.9742 6.93858 13.2678 6.71801ZM16.5911 5.44555C16.9138 5.27033 17.3171 5.38949 17.4924 5.71215L16.3235 6.34691C16.1483 6.02419 16.2684 5.62081 16.5911 5.44555ZM11.0813 15.9084C11.0813 17.5226 9.22237 18.3912 7.9895 17.4202L7.87231 17.3205L5.65552 15.2873C5.33557 14.9941 4.91667 14.8313 4.48267 14.8313C2.7902 14.8311 1.41821 13.4594 1.41821 11.7668V8.23363C1.41821 6.54111 2.7902 5.16843 4.48267 5.1682L4.64478 5.16039C5.02003 5.12526 5.37552 4.96881 5.65552 4.71215L7.87231 2.67992L7.9895 2.58031C9.22237 1.60902 11.0813 2.47773 11.0813 4.09203V15.9084Z');
        return path;
    })();

    const addReadAloudBtn = () => {
        const oldspeakBtn = document.getElementById("CentAnni-speak-btn");
        const speakBtnLoc = document.querySelector("#thread-bottom, #thread-bottom-container");
        const speakBtn = document.createElement('button');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'currentColor');
        svg.appendChild(svgPath.cloneNode(true));
        speakBtn.appendChild(svg);
        speakBtn.onclick = readAloud;
        speakBtn.id = 'CentAnni-speak-btn';
        speakBtn.title = 'Read Aloud Last Message';
        oldspeakBtn ? oldspeakBtn.replaceWith(speakBtn) : speakBtnLoc?.appendChild(speakBtn);
    };

    // initialization after DOM has loaded
    function init() {
        observer = new MutationObserver(mutations => {
            const hasMainMutations = mutations.some(mutation => mutation.target.closest("#main"));
            if (!hasMainMutations) return;

            // observer for new audio elements
            const audioFound = mutations.some(mutation => Array.from(mutation.addedNodes).some(node => node.nodeName === 'AUDIO' || (node.querySelector && node.querySelector('audio'))));

            // handle UI updates and audio playback speed
            if (audioFound) setPlaybackSpeed();
            if (!document.body.contains(controlsContainer)) createControlButtons();
            if (features.jumpToChatActive.enabled && !document.querySelector('#conversation-header-actions button[aria-label="Jump to next message"]')) {
                navCleanup?.();
                navCleanup = navBtns();
            }
            if (features.readAloudBtn.enabled && !document.querySelector('#CentAnni-speak-btn')) addReadAloudBtn();
            if (features.modelSelector.enabled && !document.querySelector('#CentAnni-gpt-model-quickbar')) addModelButtons();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            cssSettingsReady.then(() => {
                requestIdleCallback(initializeSpeed, { timeout: 2000 });
                setTimeout(() => requestIdleCallback(() => createControlButtons(), { timeout: 2000 }), 50);
                if (features.jumpToChatActive.enabled) requestIdleCallback(() => (navCleanup = navBtns()), { timeout: 2000 });
                if (features.readAloudBtn.enabled) setTimeout(() => requestIdleCallback(() => addReadAloudBtn(), { timeout: 2000 }), 50);
                if (features.modelSelector.enabled) requestIdleCallback(() => { addModelButtons(); }, { timeout: 2000 });
            });
        }
    }

    // wait for DOM to be ready
    const check = () => {
        if (window.threadObserverActive || window.location.pathname.startsWith('/codex') || window.location.hostname === 'sora.chatgpt.com') return;
        window.threadObserverActive = true;

        let timer;

        const done = () => {
            observer?.disconnect();
            clearTimeout(timer);
            clearTimeout(t);
            init();
        };

        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(done, 200);
        });

        const t = setTimeout(done, 2000);
        const target = document.getElementById('thread-bottom');
        if (target) observer.observe(target, { childList: true, subtree: true, attributes: true });
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", check, { once: true }) : check();
})();
