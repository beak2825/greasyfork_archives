// ==UserScript==
// @name        Better Youtube
// @version     10.5
// @author      tiramifue
// @description Prettier youtube with red sub button and less rounded edges
// @match       https://*.youtube.com/*
// @exclude     *://music.youtube.com/*
// @exclude     *://*.music.youtube.com/*
// @exclude     *://studio.youtube.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace   https://greasyfork.org/users/570213
// @license     Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/454097/Better%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/454097/Better%20Youtube.meta.js
// ==/UserScript==

// updated      2025-12-27

(function(){
    "use strict";

    const isBlackModeScript = false;

    // ---------- Persistent Settings ----------
    const features = [
        {
            key: "cleanButtonMode",
            name: "Clean Button Mode",
            defaultValue: false,
            onToggle: updateCustomStyleContent
        },
        {
            key: "animatedPopups",
            name: "Animated Popups",
            defaultValue: true,
            onToggle: updateCustomStyleContent
        },
        {
            key: "blackMode",
            name: "Black Mode",
            defaultValue: isBlackModeScript,
            onToggle: () => {
                updateCinematicsBackground();
                updateCustomStyleContent();
            }
        },
        {
            key: "hideShorts",
            name: "Hide Shorts",
            defaultValue: false,
            onToggle: updateCustomStyleContent
        }
    ]

    class ToggleSystem {
        static getState(key) {
            const feature = features.find(f => f.key === key);
            const defaultValue = feature.defaultValue;
            return GM_getValue(key, defaultValue);
        }

        static setState(key, state) {
            GM_setValue(key, state);
        }

        static registerFeature(feature) {
            const currentState = this.getState(feature.key);
            const stateText = currentState ? "☑️" : "⬜";
            const menuText = `${stateText} ${feature.name}`;

            const menuCommandId = GM_registerMenuCommand(menuText, () => {
                this.toggleFeature(feature);
            });

            feature.menuCommandId = menuCommandId;
        }

        static unregisterFeature(feature) {
            GM_unregisterMenuCommand(feature.menuCommandId);
        }

        static toggleFeature(feature) {
            const currentState = this.getState(feature.key);
            const newState = !currentState;
            this.setState(feature.key, newState);

            this.unregisterAll(features);
            this.registerAll(features);

            feature.onToggle();
        }

        static registerAll(features) {
            features.forEach(feature => {
                this.registerFeature(feature);
            })
        }

        static unregisterAll(features) {
            features.forEach(feature => {
                this.unregisterFeature(feature);
            })
        }
    }

    // ---------- Iframe Handling ----------
    if (window.top !== window.self) {
        switch (location.pathname) {
            case "/live_chat":
            case "/live_chat_replay":
                GM_addStyle(getCustomStyleContent("live_chat"));
                break;
        }
        return;
    }

    ToggleSystem.registerAll(features);


    // ---------- Infocards popup ----------

    function addInfocardsPopupFeature() {
        let dropdown;
        let originalParent;
        let movedSection;

        new MutationObserver((_, obs) => {
            const btn = document.querySelector('button.ytp-cards-button');
            if (!btn) return;
            btn.addEventListener('click', (e) => onInfoClick(e, btn), true);
            obs.disconnect();
        }).observe(document.body, { childList: true, subtree: true });

        function onInfoClick(e, btn) {
            e.preventDefault();
            e.stopImmediatePropagation();
            openInfoDropdown(btn);
        }

        function openInfoDropdown(anchorBtn) {
            const wrapper = document.querySelector('ytd-app > ytd-popup-container');
            if (!wrapper) {
                console.warn('Could not find <ytd-popup-container>');
                return;
            }

            const cards = document.querySelector('ytd-video-description-infocards-section-renderer > #infocards-section');
            if (cards) {
                originalParent = cards.parentElement;
                movedSection = cards;

                dropdown = document.createElement('tp-yt-iron-dropdown');
                dropdown.id = 'gm-info-dropdown';
                dropdown.className = 'style-scope ytd-popup-container';

                movedSection.removeAttribute('id');
                movedSection.setAttribute('slot', 'dropdown-content');

                Object.assign(movedSection.style, {
                    display: 'block',
                    visibility: 'visible',
                    opacity: '1',
                    width: 'auto',
                    maxWidth: '600px',
                    overflow: 'visible',
                    maxHeight: 'none',
                    height: 'auto',
                    padding: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                    borderRadius: '8px',
                    zIndex: '10000',
                    boxSizing: 'border-box'
                });

                wrapper.appendChild(dropdown);
                dropdown.querySelector("#contentWrapper").appendChild(movedSection);
            }

            dropdown.opened = true;

            setTimeout(() => {
                const buttonRect = anchorBtn.getBoundingClientRect();
                const popup = dropdown;

                const popupWidth = movedSection.offsetWidth;
                popup.style.position = 'fixed';
                popup.style.left = `${buttonRect.right - popupWidth}px`;
                popup.style.top = `${buttonRect.bottom + 6}px`;
                popup.style.transform = 'none';

                popup.style.maxHeight = 'none';
                popup.style.height = 'auto';
            }, 0);
        }
    }

    addInfocardsPopupFeature();


    // ---------- Black Mode cinematics ----------
    const fillRectOriginal = CanvasRenderingContext2D.prototype.fillRect;

    function updateCinematicsBackground() {
        const defaultCinematicsBackground = "#0f0f0f";
        const blackModeCinematicsBackground = "#000";

        if (ToggleSystem.getState("blackMode")) {
            CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
                if (typeof this.fillStyle === "string" && this.fillStyle === defaultCinematicsBackground) {
                    this.fillStyle = blackModeCinematicsBackground;
                }
                return fillRectOriginal.call(this, x, y, w, h);
            }
        } else {
            CanvasRenderingContext2D.prototype.fillRect = fillRectOriginal;
        }
    }

    updateCinematicsBackground();


    // ---------- Theater cinematics ----------
    let isSetup = false;
    let isFullscreen = false;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        waitForElements();
        document.addEventListener("fullscreenchange", onFullscreenChange);
    }

    function waitForElements() {
        if (isSetup) return;

        const observer = new MutationObserver(function() {
            if (isSetup) return;

            const cinematics = document.querySelector("#cinematics-container");
            const defaultPlayer = document.querySelector("#primary-inner > #player");
            const theaterPlayer = document.querySelector("#full-bleed-container");

            if (cinematics && defaultPlayer && theaterPlayer) {
                isSetup = true;
                observer.disconnect();
                //setupTheaterModeWatcher(cinematics, defaultPlayer, theaterPlayer);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Check if elements already exist
        const cinematics = document.querySelector("#cinematics-container");
        const defaultPlayer = document.querySelector("#primary-inner > #player");
        const theaterPlayer = document.querySelector("#full-bleed-container");

        if (cinematics && defaultPlayer && theaterPlayer && !isSetup) {
            isSetup = true;
            observer.disconnect();
            //setupTheaterModeWatcher(cinematics, defaultPlayer, theaterPlayer);
        }
    }

    function setupTheaterModeWatcher(cinematics, defaultPlayer, theaterPlayer) {
        fixMastheadOpacity();

        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (!watchFlexy) return;

        const theaterObserver = new MutationObserver(function() {
            const isTheaterMode = watchFlexy.hasAttribute('theater');

            if (isTheaterMode) {
                theaterPlayer.prepend(cinematics);
            } else {
                defaultPlayer.prepend(cinematics);
            }
        });

        theaterObserver.observe(watchFlexy, {
            attributes: true,
            attributeFilter: ['theater']
        });

        if (watchFlexy.hasAttribute('theater')) {
            theaterPlayer.prepend(cinematics);
        }
    }

    function fixMastheadOpacity() {
        const mastheadBg = document.querySelector('#background.style-scope.ytd-masthead');
        if (!mastheadBg) return;

        const observer = new MutationObserver(function(mutations) {
            const isTheaterMode = Boolean(document.querySelector("ytd-watch-flexy[theater]"));
            if (isTheaterMode && !isFullscreen) {
                let opacity = window.scrollY * 0.01;
                if (opacity > 1) opacity = 1;
                mastheadBg.style.setProperty('opacity', opacity);
            }
        });

        observer.observe(mastheadBg, {
            attributes: true,
            attributeFilter: ['style']
        });

        // Set initial state
        const isTheaterMode = document.querySelector("ytd-watch-flexy[theater]");
        if (isTheaterMode) {
            mastheadBg.style.setProperty('opacity', '0');
        }
    }

    function onFullscreenChange() {
        isFullscreen = Boolean(document.fullscreenElement);
        if (!isFullscreen) {
            const mastheadBg = document.querySelector('#background.style-scope.ytd-masthead');
            if (!mastheadBg) return;
            mastheadBg.style.setProperty('opacity', '0');
        }
    }


    // ---------- Styles ----------
    const customStyle = GM_addStyle(getCustomStyleContent());

    function updateCustomStyleContent() {
        customStyle.textContent = getCustomStyleContent();
    }

    function getCustomStyleContent(target = "main") {
        const bm = ToggleSystem.getState("blackMode");
        const rgbBg = bm ? "0 0 0" : "15 15 15";
        const scrollbarRgbColor = bm ? "60 60 60" : "78 78 78";
        const bgVariables = bm ? `
--yt-spec-brand-background-solid: #000;
--yt-spec-brand-background-primary: #000;
--yt-spec-brand-background-secondary: #000;
--yt-spec-general-background-a: #000;
--yt-spec-base-background: #000;
--yt-spec-raised-background: #111;
` : "";

        switch (target) {

            case "live_chat":
                return `
html:not(.style-scope)[dark],:not(.style-scope)[dark]{
    --custom-bg-98: rgb(${rgbBg} / 98%);
    --custom-bg-80: rgb(${rgbBg} / 80%);

    ${bgVariables}

    --yt-spec-10-percent-layer: rgb(255 255 255 / 10%);
    --yt-spec-badge-chip-background: rgb(255 255 255 / 7%);
    --yt-spec-additive-background: rgb(255 255 255 / 7%);
    --yt-spec-menu-background: var(--custom-bg-98);
    --yt-live-chat-banner-gradient-scrim: linear-gradient(rgb(${rgbBg} / 95%), transparent);
    --yt-live-chat-toast-background-color: rgb(${rgbBg});
    scrollbar-color: rgb(${scrollbarRgbColor}) transparent;
}
yt-live-chat-toast-renderer[is-showing-message] {
    border-top: 1px solid rgb(255 255 255 / 10%);
}
yt-live-chat-banner-renderer {
    backdrop-filter: blur(48px);
    border: 1px solid rgb(255 255 255 / 10%);
    box-shadow: 0px 0px 30px 6px rgba(0, 0, 0, 0.7);
    background: var(--custom-bg-98);
    --yt-live-chat-primary-text-color: var(--yt-spec-text-primary);
}
tp-yt-iron-dropdown.style-scope.yt-live-chat-app {
    backdrop-filter: blur(48px);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 12px !important;
    box-shadow: 0px 0px 30px 6px rgba(0, 0, 0, 0.7);
    background: var(--custom-bg-80) !important;
}
ytd-menu-popup-renderer {
    background: transparent;
    backdrop-filter: none;
}
#card.yt-live-chat-viewer-engagement-message-renderer {
    background: transparent;
    border: 1px solid rgb(255 255 255 / 10%);
}
.yt-spec-button-shape-next--mono-inverse.yt-spec-button-shape-next--text {
    color: #f1f1f1;
}
`;

            case "main":
                return `
html:not(.style-scope)[dark],:not(.style-scope)[dark]{
    --custom-bg-98: rgb(${rgbBg} / 98%);
    --custom-bg-80: rgb(${rgbBg} / 80%);
    --custom-bg-50: rgb(${rgbBg} / 50%);
    --custom-base-bg: rgb(${rgbBg});

    ${bgVariables}

    --yt-spec-10-percent-layer: rgb(255 255 255 / 10%);
    --yt-spec-badge-chip-background: rgb(255 255 255 / 7%);
    --yt-spec-additive-background: rgb(255 255 255 / 7%);
    --yt-spec-menu-background: var(--custom-bg-98);
    scrollbar-color: rgb(${scrollbarRgbColor}) transparent;
    --yt-spec-frosted-glass-desktop: var(--custom-bg-80);
}

${bm ? `
html[dark] {
    background: #000 !important;
}
` : ""}

.YtSearchboxComponentSuggestionsContainer, .ytSearchboxComponentSuggestionsContainer, #ytp-id-18, .ytp-popup, tp-yt-iron-dropdown.style-scope.ytd-popup-container, tp-yt-paper-dialog[modern], ytd-voice-search-dialog-renderer[dialog] {
    backdrop-filter: blur(48px) !important;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 12px !important;
    box-shadow: 0px 0px 30px 6px rgba(0, 0, 0, 0.7);
    background: var(--custom-bg-80) !important;
}
.ytp-right-controls, .ytp-left-controls > button, .ytp-left-controls > span, .ytp-left-controls > a, .ytp-left-controls .ytp-time-wrapper, .ytp-left-controls .ytp-chapter-title {
    backdrop-filter: blur(48px) !important;
    border: 1px solid rgb(255 255 255 / 10%);
    background: var(--custom-bg-80) !important;
}
.ytp-prev-button {
   border-right: none !important;
}
.ytp-next-button {
   border-left: none !important;
}
#background.ytd-masthead {
    backdrop-filter: blur(48px);
    background: var(--custom-bg-80);
}
ytd-menu-popup-renderer, ytd-multi-page-menu-renderer, ytd-simple-menu-header-renderer, .yt-contextual-sheet-layout-wiz, .yt-sheet-view-model-wiz--contextual, tp-yt-paper-dialog {
    background: transparent;
    backdrop-filter: none;
}
.ytdMiniplayerInfoBarHost {
    background: var(--custom-base-bg);
}
ytd-thumbnail a.ytd-thumbnail, ytd-thumbnail:before, .yt-thumbnail-view-model--medium, .ytThumbnailViewModelLarge, #thumbnail, .shortsLockupViewModelHostThumbnailParentContainerRounded, .ytThumbnailViewModelMedium {
    border-radius: 1px;
}
.ytCollectionsStackHost > div > div {
    border-radius: 1px;
}
#subscribe-button-shape button, yt-subscribe-button-view-model button:not(.yt-spec-button-shape-next--tonal), #page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-flexible-actions-view-model > div > button-view-model > button {
    color: var(--yt-spec-text-primary) !important;
    background: #cc0000 !important;
    border-radius: 2px;
    text-transform: uppercase !important;
}
#subscribe-button-shape button:hover, yt-subscribe-button-view-model button:not(.yt-spec-button-shape-next--tonal):hover, #page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-flexible-actions-view-model > div > button-view-model > button:hover {
    background: #880000 !important;
}
#sponsor-button button, yt-subscribe-plus-button-view-model button, #page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-flexible-actions-view-model > div:nth-child(2) > button-view-model > button {
    background: var(--yt-spec-badge-chip-background) !important;
    color: var(--yt-spec-text-primary) !important;
    border: none;
    text-transform: inherit !important;
}
#sponsor-button button:hover, yt-subscribe-plus-button-view-model button:hover, #page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > div > yt-flexible-actions-view-model > div:nth-child(2) > button-view-model > button:hover {
    background: ${bm ? "#333333" : "#414141"} !important;
}
.yt-spec-button-shape-next--size-m {
    border-radius: 2px;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start {
    border-radius: 2px 0 0 2px;
}
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end {
    border-radius: 0 2px 2px 0;
}
yt-chip-cloud-chip-renderer[modern-chips][chip-style] {
    border-radius: 2px;
}
#container.ytd-searchbox {
    border-radius: 2px 0 0 2px;
}
#search-icon-legacy.ytd-searchbox {
    border-radius: 0 2px 2px 0;
}
tp-yt-iron-dropdown #items {
    max-height: 80vh;
    overflow-y: auto;
}
ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata {
    border-radius: 2px;
}
ytd-guide-entry-renderer[guide-refresh] {
    border-radius: 2px;
}
.yt-spec-touch-feedback-shape, .yt-spec-touch-feedback-shape > div {
    border-radius: 2px !important;
}
ytd-rich-metadata-renderer[rounded] {
    border-radius: 2px;
}
.shortsLockupViewModelHostThumbnailContainerRounded {
    border-radius: 2px;
}
#tooltip, yt-popover, .ytp-tooltip:not(.ytp-tooltip-progress-bar-style), .ytp-fullscreen-quick-actions {
    display: none;
}
ytd-guide-entry-renderer[guide-refresh] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover, ytd-guide-entry-renderer[guide-refresh] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus {
    border-radius: 2px;
}
ytd-guide-entry-renderer[guide-refresh] #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active {
    border-radius: 2px;
}
ytd-guide-entry-renderer[guide-refresh] yt-interaction.ytd-guide-entry-renderer {
    border-radius: 2px;
}
.yt-spec-button-shape-next--size-s {
    border-radius: 2px;
}
button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--align-by-text:hover {
    background-color: rgb(38 56 80 / 55%);
}
.yt-spec-button-shape-next--size-l {
    border-radius: 2px;
}
.yt-spec-button-shape-next--size-l.yt-spec-button-shape-next--icon-button {
    width: 44px;
    height: 44px;
}
#content.ytd-engagement-panel-section-list-renderer, ytd-item-section-renderer[static-comments-header] #header.ytd-item-section-renderer, .watch-while-engagement-panel.ytd-reel-video-renderer {
    background: var(--custom-base-bg);
}
ytd-reel-video-renderer[is-watch-while-mode] .watch-while-engagement-panel.ytd-reel-video-renderer {
    border-radius: 12px;
}
ytd-item-section-renderer[static-comments-header] #header.ytd-item-section-renderer {
    border-top: 1px solid rgb(255 255 255 / 10%);
}
yt-chip-cloud-chip-renderer, ytd-guide-entry-renderer, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:focus, yt-interaction.ytd-guide-entry-renderer, #description.ytd-watch-metadata, .ytChipShapeChip {
    border-radius: 2px;
}
tp-yt-paper-item.ytd-guide-entry-renderer {
    --paper-item-focused-before-border-radius: 2px;
}
#sponsor-button > ytd-button-renderer {
    background: rgb(${bm ? "18 18 18" : "35 35 35"});
    border-radius: 2px;
}
#sponsor-button > ytd-button-renderer > yt-button-shape > button {
    border: none;
}
#navigation-button-down > ytd-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div {
    border-radius: 28px;
}
#voice-search-button.ytd-masthead, #microphone.ytd-voice-search-dialog-renderer[state=try-again] #microphone-circle.ytd-voice-search-dialog-renderer, #microphone-levels.ytd-voice-search-dialog-renderer {
    background-color: transparent;
}
yt-interaction.rounded-large .fill.yt-interaction, yt-interaction.rounded-large .stroke.yt-interaction {
    border-radius: 2px;
}
#target[title="Email"] > yt-icon > span > div {
    filter: invert(1);
}
ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) {
    border-radius: 2px;
}
ytd-reel-video-renderer:not([enable-player-metadata-container]) .watch-while-engagement-panel.ytd-reel-video-renderer {
    background: rgb(15 15 15);
}
yt-interaction.circular .fill.yt-interaction, yt-interaction.circular .stroke.yt-interaction {
    border-radius: 2px;
}
yt-icon-button.ytd-masthead:hover, ytd-topbar-menu-button-renderer.ytd-masthead:hover, ytd-notification-topbar-button-renderer.ytd-masthead:hover, .ytSearchboxComponentClearButton:hover {
    border-radius: 2px;
}
#overlays > yt-thumbnail-overlay-badge-view-model {
    display: none;
}
ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy {
    border-radius: 2px;
}
.YtSearchboxComponentInputBox, .ytSearchboxComponentInputBox {
    border-radius: 2px 0 0 2px;
}
.YtSearchboxComponentSearchButton, .ytSearchboxComponentSearchButton {
    border-radius: 0 2px 2px 0;
}
.ytSearchboxComponentClearButton {
    margin-right: 6px;
}
#chip-container.yt-chip-cloud-chip-renderer {
    border-radius: 2px;
}
.ytVideoMetadataCarouselViewModelHost {
    background: var(--yt-spec-badge-chip-background);
    border-radius: 2px;
}
#cinematics-full-bleed-container > #cinematics > div > div {
    transform: scale(1.5, 2) !important;
}
ytd-live-chat-frame[round-background] #show-hide-button.ytd-live-chat-frame>ytd-toggle-button-renderer.ytd-live-chat-frame, ytd-live-chat-frame[round-background] #show-hide-button.ytd-live-chat-frame>ytd-button-renderer.ytd-live-chat-frame {
    border-radius: 2px;
}
#movie_player .annotation.iv-branding {
    display: none;
}
ytd-mini-guide-entry-renderer {
    border-radius: 2px;
}
tp-yt-paper-dialog > ytd-voice-search-dialog-renderer.ytd-popup-container {
    margin-bottom: 0 !important;
}
tp-yt-paper-dialog {
    border-radius: 12px;
}
ytd-channel-renderer.ytd-item-section-renderer {
    display: none;
}
.ytContextualSheetLayoutHost {
    background: none;
}
#content .yt-spec-touch-feedback-shape__hover-effect {
    display: none;
}
.yt-badge-shape--default {
    background: none;
}


${ToggleSystem.getState("animatedPopups") ? `
/* 1) iPhone-style popup animation */
@keyframes popupAnimation {
  0%   { opacity: 0; transform: scale(0.9); }
  70%  { opacity: 1; transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes popupAnimationUp {
  0% { opacity: 0; transform: scale(0.9) translateY(25px); }
  60% { opacity: 1; transform: scale(1.02) translateY(-5px); }
  100% { transform: scale(1) translateY(0); }
}

tp-yt-iron-dropdown.ytd-popup-container {
  transform-origin: top center !important;
  animation: popupAnimation 300ms cubic-bezier(0.25,0.1,0.25,1) both !important;
  overflow: visible !important; /* never scroll the wrapper */
}

/* 2) Remove YouTube’s inline size caps so menus fit exactly */
tp-yt-iron-dropdown.ytd-popup-container
  yt-sheet-view-model,
tp-yt-iron-dropdown.ytd-popup-container
  ytd-menu-popup-renderer,
tp-yt-iron-dropdown.ytd-popup-container
  ytd-multi-page-menu-renderer {
  max-width: none !important;
  max-height: none !important;
  overflow: visible !important;
}

/* 3) If content actually overflows, allow only vertical scrolling */
tp-yt-iron-dropdown.ytd-popup-container
  ytd-menu-popup-renderer,
tp-yt-iron-dropdown.ytd-popup-container
  ytd-multi-page-menu-renderer {
  overflow-x: hidden !important;
  overflow-y: auto   !important;
  /* optional: cap height so huge menus don’t fill the whole screen */
  /* max-height: 80vh !important; */
}

/* popup animation for search suggestions */
div.ytSearchboxComponentSuggestionsContainer[role="listbox"] {
  transform-origin: top center !important;
  animation: popupAnimation 300ms cubic-bezier(0.25, 0.1, 0.25, 1) both !important;
}

/* — apply animation to the gear/settings menu */
div.ytp-popup.ytp-settings-menu {
  transform-origin: bottom center !important;
  animation: popupAnimation 300ms cubic-bezier(0.25,0.1,0.25,1) both !important;
  overflow-x: hidden !important;
  overflow-y: auto   !important;
}
` : ""}


${ToggleSystem.getState("cleanButtonMode") ? `
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal, .ytChipShapeInactive, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal {
    background: none;
}
` : ""}


${ToggleSystem.getState("hideShorts") ? `
ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer {
    display: none;
}
` : ""}


`;
        }
    }
})();
