// ==UserScript==
// @name         Spotless for eBay
// @namespace    https://github.com/OsborneLabs
// @version      2.5.2
// @description  Hides sponsored listings, removes sponsored items, cleans links, & prevents tracking
// @author       Osborne Labs
// @license      GPL-3.0-only
// @homepageURL  https://github.com/OsborneLabs/Spotless
// @icon         data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjI1MDAiIHdpZHRoPSIyMDcyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAuMzU5IDIxLjY4ODgwMTQ3Nzg4Njg0IDI1MS4yODE5OTk5OTk5OTk5OCAyODIuMzExMTk4NTIyMTEzMTYiPjxwYXRoIGQ9Ik0xNTIuMzM4IDE1Ny4xM2E3MC4zMjcgNzAuMzI3IDAgMSAwLTUzLjggMS42NjJsNi43ODgtMTcuOTM3YTUxLjE0OSA1MS4xNDkgMCAxIDEgMzkuMTI4LTEuMjA5eiIgZmlsbD0iIzQxNDE0MSIvPjxwYXRoIGQ9Ik0uMzU5IDk4LjQwNWg1Ny4xMVYzMDRoLTM5LjExYy05Ljk0MSAwLTE4LTguMDU5LTE4LTE4eiIgZmlsbD0iI2VhMzIzYyIvPjxwYXRoIGQ9Ik0yNTEuNjQxIDk4LjQwNWgtNTcuMTA5VjMwNGgzOS4xMDljOS45NDEgMCAxOC04LjA1OSAxOC0xOHoiIGZpbGw9IiM4OGI2MjEiLz48cGF0aCBkPSJNMTk0LjUzMSA5OC40MDVIMTI2VjMwNGg2OC41MzF6IiBmaWxsPSIjZjVhZTAzIi8+PHBhdGggZD0iTTEyNiA5OC40MDVINTcuNDY4VjMwNEgxMjZ6IiBmaWxsPSIjMDA2NGQxIi8+PC9zdmc+
// @match        https://*.ebay.com/*
// @match        https://*.ebay.at/*
// @match        https://*.ebay.be/*
// @match        https://*.ebay.ca/*
// @match        https://*.ebay.ch/*
// @match        https://*.ebay.com.au/*
// @match        https://*.ebay.com.hk/*
// @match        https://*.ebay.com.my/*
// @match        https://*.ebay.com.sg/*
// @match        https://*.ebay.co.uk/*
// @match        https://*.ebay.de/*
// @match        https://*.ebay.es/*
// @match        https://*.ebay.fr/*
// @match        https://*.ebay.ie/*
// @match        https://*.ebay.it/*
// @match        https://*.ebay.nl/*
// @match        https://*.ebay.pl/*
// @run-at       document-start
// @supportURL   https://github.com/OsborneLabs/Spotless/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541981/Spotless%20for%20eBay.user.js
// @updateURL https://update.greasyfork.org/scripts/541981/Spotless%20for%20eBay.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    "use strict";

    const APP_NAME = "Spotless";
    const APP_NAME_DEBUG_MODE = "SPOTLESS FOR EBAY";
    const APP_KEY_HIDE_SPONSORED_CONTENT = "hideSponsoredContent";
    const APP_KEY_MINIMIZE_PANEL = "panelMinimized";
    const APP_SPONSORED_KEYWORDS = ['sponsored', 'anzeige', 'gesponsord', 'patrocinado', 'sponsorisé', 'sponsorizzato', 'sponsorowane', '助贊'];
    const APP_ICONS = {
        locked: `<svg class="lock-icon lock-icon-animation" id="lockedIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C9.79 2 8 3.79 8 6v4H7c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V6c0-2.21-1.79-4-4-4zm-2 8V6c0-1.1.9-2 2-2s2 .9 2 2v4h-4z"/></svg>`,
        unlocked: `<svg class="lock-icon lock-icon-animation" id="unlockedIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 8V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1z"/></svg>`,
        arrow: `<svg id="arrowIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>`,
        heart: `<svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
    };

    const state = {
        ui: {
            bannerUpdateScheduled: false,
            hidingEnabled: localStorage.getItem(APP_KEY_HIDE_SPONSORED_CONTENT) !== "false",
            highlightedSponsoredContent: [],
            isContentProcessing: false,
            updateScheduled: false
        },
        observer: {
            generalCleanupObserver: null,
            generalCleanupObserverInitialized: false,
            mainObserverInitialized: false,
            sponsoredCarouselObserver: null,
            sponsoredCarouselObserverInitialized: false
        }
    };

    function createStyles() {
        const style = document.createElement("style");
        style.textContent = `
            :root {
                --color-app-bubble: #E74C3C;
                --color-app-icon-heart-hover: red;
                --color-app-icon: white;
                --color-app-switch-off: #CCC;
                --color-app-switch-on: #2AA866;
                --color-app-switch-thumb: white;
                --color-highlight-background: rgba(255, 230, 230, 0.30);
                --color-highlight-border: #D95C5C;
                --color-panel-divider: rgba(255, 255, 255, 0.1);
                --color-panel-row: rgba(20, 30, 45, 0.5);
                --color-panel-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                --color-panel: rgba(34, 50, 70, 0.85);
                --color-text-link-ebay-hover: #2854D9;
                --color-text-link-panel-default: var(--color-text-link-panel-hover);
                --color-text-link-panel-hover: lightblue;
                --color-text-default: white;
                --size-text-body-default: 14px;
                --size-text-body-error: 19px;
                --size-text-footer: 12px;
                --size-text-header-title: 23px;
                --size-thickness-highlight-border: 2px;
            }
            @media (max-width: 768px) {
                #panelWrapper {
                    position: fixed;
                    bottom: 5px;
                    left: 50%;
                    right: unset;
                    transform: translateX(-50%);
                    width: 90% !important;
                    padding: 0 16px;
                }
                #panelHeader h2.panel-title {
                    position: static;
                    bottom: auto;
                }
            }
            #panelWrapper, #panelBox, .lock-icon-animation, .lock-icon-animation.active {
                box-sizing: border-box;
            }
            #panelWrapper {
                position: fixed;
                bottom: 10px;
                right: 5px;
                z-index: 99999;
                width: 100%;
                max-width: 320px;
                padding: 0 16px;
                font-family: "Segoe UI", sans-serif;
            }
            #panelBox {
                display: none;
            }
            #panelBox.show {
                display: flex;
                flex-direction: column;
                gap: 0px;
                background: var(--color-panel);
                backdrop-filter: blur(10px);
                color: var(--color-text-default);
                padding: 16px;
                border-radius: 14px;
                width: 100%;
                box-shadow: var(--color-panel-shadow);
                transition: transform 0.2s ease;
            }
            #panelBox:hover {
                transform: translateY(-2px);
            }
            #panelBox.minimized #arrowIcon {
                transform: rotate(180deg);
            }
            #panelBox.minimized {
                padding: 12px;
                overflow: hidden;
            }
            #panelHeader {
                display: flex;
                align-items: center;
                height: 30px;
                gap: 8px;
            }
            #panelHeader h2.panel-title {
                position: relative;
                bottom: 1px;
                font-size: var(--size-text-header-title);
                font-weight: 600;
                margin: 0;
                color: var(--color-text-default);
            }
            h2.panel-title, .panel-body-row, .panel-footer, .error-page {
                user-select: none;
            }
            .panel-body-row {
                margin: 0;
                font-size: var(--size-text-body-default);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--color-panel-row);
                backdrop-filter: blur(12px);
                padding: 12px 16px;
                border-radius: 14px;
            }
            .panel-body-row + .panel-body-row {
                margin-top: 5px;
            }
            .panel-footer {
                height: 10px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;
                font-size: var(--size-text-footer);
                color: var(--color-text-default);
            }
            .panel-page-container {
                position: relative;
                width: 100%;
            }
            hr.section-divider {
                flex-grow: 1;
                border: none;
                border-top: 1px solid var(--color-panel-divider);
                margin: 12px 0;
            }
            #minimizePanelButton {
                width: 28px;
                height: 28px;
                margin-left: auto;
                padding: 2px;
                border: none;
                background: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-sizing: content-box;
            }
            .lock-icon {
                width: 28px;
                height: 28px;
                padding: 4px;
                border-radius: 50%;
                fill: var(--color-app-icon);
            }
            .lock-icon-animation {
                position: absolute;
                top: 0;
                left: 0;
                width: 28px;
                height: 28px;
                opacity: 0;
                transition: opacity 0.4s ease, transform 0.4s ease;
                transform: rotate(0deg);
            }
            .lock-icon-animation.active {
                opacity: 1;
                transform: rotate(360deg);
            }
            #lockIconContainer {
                position: relative;
                width: 28px;
                height: 28px;
            }
            #arrowIcon {
                width: 28px;
                height: 28px;
                fill: var(--color-app-icon);
                transition: transform 0.3s ease;
            }
            .heart-icon {
                width: 10px;
                height: 10px;
                vertical-align: middle;
                fill: var(--color-app-icon);
            }
            .heart-icon:hover {
                fill: var(--color-app-icon-heart-hover);
            }
            #countBubble {
                background-color: var(--color-app-bubble);
                color: var(--color-text-default);
                font-size: 12px;
                font-weight: bold;
                padding: 3px 8px;
                border-radius: 999px;
                min-width: 20px;
                text-align: center;
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 42px;
                height: 22px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .switch-label {
                margin-right: 10px;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--color-app-switch-off);
                transition: 0.3s;
                border-radius: 34px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                top: 2px;
                left: 2px;
                background-color: var(--color-app-switch-thumb);
                transition: 0.3s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: var(--color-app-switch-on);
            }
            input:checked + .slider:before {
                transform: translateX(20px);
            }
            #creatorPage {
                color: var(--color-text-default);
                transition: color 0.3s ease;
            }
            #creatorPage:hover, .outbound-status-page:hover, .outbound-update-page:hover {
                color: var(--color-text-link-panel-hover);
            }
            .error-page {
                text-align: center;
                font-size: var(--size-text-body-error);
                padding: 6px 0;
            }
            .error-page p:first-child {
                margin-bottom: 1px;
            }
            .error-page p:last-child {
                margin-top: 0;
            }
            .outbound-status-page, .outbound-update-page {
                text-decoration: underline;
                color: var(--color-text-link-panel-default);
            }
            .outbound-status-page:visited, .outbound-update-page:visited {
                color: var(--color-text-link-panel-default);
            }
            .sponsored-highlight {
                border: var(--size-thickness-highlight-border) dashed var(--color-highlight-border) !important;
                background-color: var(--color-highlight-background);
            }
            .sponsored-hidden {
                display: none !important;
            }
            .sponsored-hidden-banner {
                display: none !important;
            }
            .sponsored-hidden-carousel {
                display: none !important;
            }
            .enhanced-seller-info {
                text-decoration: none !important;
            }
            .enhanced-seller-info:hover {
                color: var(--color-text-link-ebay-hover) !important;
            }
        `;
        document.head.appendChild(style);
    }

    async function init() {
        observeURLMutation();
        createStyles();
        buildPanel();
        updatePanelVisibility();
        initGeneralCleanupObserver();
        if (isSearchResultsPage()) {
            initSponsoredBannerObserver();
        }
        if (determineCarouselDetection()) {
            initSponsoredCarouselObserver();
            removeSponsoredCarousels();
        }
        await processSponsoredContent();
        disableSiteTelemetry();
        requestIdleCallback(cleanGeneralURLs, {
            timeout: 1500
        });
    }

    function isValidSearchResultsPage() {
        const url = new URL(location.href);
        const params = url.searchParams;
        const isAdvancedSearchPage = url.href.includes("ebayadvsearch");
        const isSellerPage = params.has("_ssn");
        const isVisuallySimilarPage = params.get("_vss") === "1";
        const isCompletedPage = params.get("LH_Complete") === "1";
        const isSoldPage = params.get("LH_Sold") === "1";
        return (
            isSearchResultsPage() && !isAdvancedSearchPage && !isVisuallySimilarPage && !isSellerPage && !isCompletedPage && !isSoldPage
        );
    }

    function isListingPage() {
        return /^https:\/\/([a-z0-9-]+\.)*ebay\.[a-z.]+\/itm\/\d+/.test(location.href);
    }

    function isLiveStreamPage() {
        return /^https:\/\/([a-z0-9-]+\.)*ebay\.[a-z.]+\/ebaylive\/events\/[A-Za-z0-9]+\/stream\/?$/i.test(location.href);
    }

    function isSearchResultsPage() {
        return /^https:\/\/([a-z0-9-]+\.)*ebay\.[a-z.]+\/(sch|shop)\//i.test(location.href) ||
            /^https:\/\/([a-z0-9-]+\.)*ebay\.[a-z.]+\/b\/[^/]+\/\d+\/bn_\d+/i.test(location.href);
    }

    function determineCarouselDetection() {
        return isListingPage();
    }

    function observeURLMutation() {
        let previousURL = location.href;
        const handleURLChange = () => {
            const currentURL = location.href;
            if (currentURL !== previousURL) {
                previousURL = currentURL;
                updatePanelVisibility();
                scheduleHighlightUpdate();
            }
        };
        ["pushState", "replaceState"].forEach(method => {
            const original = history[method];
            history[method] = function(...args) {
                const result = original.apply(this, args);
                handleURLChange();
                return result;
            };
        });
        window.addEventListener("popstate", handleURLChange);
        window.addEventListener("hashchange", handleURLChange);
        const observer = new MutationObserver(handleURLChange);
        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }

    function initMainObserver() {
        if (state.observer.mainObserverInitialized) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        state.observer.mainObserverInitialized = true;
    }

    function initSponsoredBannerObserver() {
        const observer = new MutationObserver(() => {
            if (state.ui.bannerUpdateScheduled) return;
            state.ui.bannerUpdateScheduled = true;
            requestAnimationFrame(() => {
                state.ui.bannerUpdateScheduled = false;
                removeSponsoredBanners(document);
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initSponsoredCarouselObserver() {
        const carouselState = state.observer;
        if (carouselState.sponsoredCarouselObserverInitialized) return;
        carouselState.sponsoredCarouselObserverInitialized = true;
        const targetContainer =
            document.querySelector('[data-results-container], main, .srp-results') ||
            document.body;
        if (!targetContainer) return;
        const observer = new MutationObserver(() => {
            removeSponsoredCarousels();
        });
        observer.observe(targetContainer, {
            childList: true,
            subtree: true
        });
        carouselState.sponsoredCarouselObserver = observer;
    }

    function initCleanListingObserver() {
        const observer = new MutationObserver(() => {
            cleanListingURLs();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href'],
        });
    }

    function initGeneralCleanupObserver() {
        if (state.observer.generalCleanupObserverInitialized) return;
        state.observer.generalCleanupObserverInitialized = true;
        const observer = new MutationObserver(() => {
            document
                .querySelectorAll('#ebay-autocomplete li[data-type="r"]')
                .forEach(li => {
                    const value = li.getAttribute("data-value");
                    if (!value || value === "nullfalse") {
                        li.remove();
                    }
                });
            if (state.ui.isContentProcessing || state.ui.updateScheduled) return;
            state.ui.updateScheduled = true;
            requestIdleCallback(() => {
                state.ui.updateScheduled = false;
                state.ui.isContentProcessing = true;
                try {
                    cleanGeneralURLs();
                } finally {
                    state.ui.isContentProcessing = false;
                }
            }, {
                timeout: 1000
            });
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true
        });
        state.observer.generalCleanupObserver = observer;
    }

    async function buildPanel() {
        const wrapper = document.createElement("div");
        wrapper.id = "panelWrapper";
        const panelBox = document.createElement("div");
        panelBox.id = "panelBox";
        const header = buildPanelHeader();
        const sponsoredCount = await processSponsoredContent();
        const body = determinePanelState(sponsoredCount, state.ui.hidingEnabled);
        const footer = buildPanelFooter();
        const createDivider = () => {
            const hr = document.createElement("hr");
            hr.className = "section-divider";
            return hr;
        };
        panelBox.append(
            header,
            createDivider(),
            body,
            createDivider(),
            footer
        );
        wrapper.appendChild(panelBox);
        document.body.appendChild(wrapper);
        const isPanelMinimized =
            localStorage.getItem(APP_KEY_MINIMIZE_PANEL) === "true";
        setPanelMinimized(isPanelMinimized);
        const minimizeButton = document.getElementById("minimizePanelButton");
        if (minimizeButton) {
            minimizeButton.addEventListener("click", () => {
                const newState = !panelBox.classList.contains("minimized");
                localStorage.setItem(APP_KEY_MINIMIZE_PANEL, String(newState));
                setPanelMinimized(newState);
            });
        }
        const toggleInput = document.getElementById("toggleSponsoredContentSwitch");
        if (!toggleInput) {
            updatePanelLockIcon();
            return;
        }
        toggleInput.addEventListener("change", ({
            target
        }) => {
            const enabled = target.checked;
            state.ui.hidingEnabled = enabled;
            localStorage.setItem(APP_KEY_HIDE_SPONSORED_CONTENT, String(enabled));
            updatePanelLockIcon();
            scheduleHighlightUpdate();
        });
        updatePanelLockIcon();
    }

    function buildPanelHeader() {
        const header = document.createElement("div");
        header.id = "panelHeader";
        header.innerHTML = `
            <div id="lockIconContainer">
                ${APP_ICONS.locked}
                ${APP_ICONS.unlocked}
            </div>
            <h2 class="panel-title" aria-level="1">${APP_NAME}</h2>
            <button id="minimizePanelButton" aria-label="Expands or minimizes the panel">
                ${APP_ICONS.arrow}
            </button>
        `;
        return header;
    }

    function buildPanelFooter() {
        const footer = Object.assign(document.createElement("div"), {
            className: "panel-footer",
        });
        const creatorLink = Object.assign(document.createElement("a"), {
            id: "creatorPage",
            href: "https://github.com/OsborneLabs/Spotless",
            target: "_blank",
            rel: "noopener noreferrer",
            textContent: "Osborne",
        });
        creatorLink.style.textDecoration = "none";
        const separator = Object.assign(document.createElement("span"), {
            textContent: " · ",
        });
        const donateLink = Object.assign(document.createElement("a"), {
            href: "https://ko-fi.com/osbornelabs",
            target: "_blank",
            rel: "noopener noreferrer",
            innerHTML: APP_ICONS.heart,
        });
        Object.assign(donateLink.style, {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
        });
        footer.append(creatorLink, separator, donateLink);
        return footer;
    }

    function createPanelRow(innerHTML = "") {
        const row = document.createElement("div");
        row.className = "panel-body-row";
        row.innerHTML = innerHTML;
        return row;
    }

    function createSponsoredCountRow() {
        const row = createPanelRow(`
            <span>Sponsored listings</span>
            <span id="countBubble">0</span>
        `);
        row.id = "countSponsoredContentRow";
        return row;
    }

    function createSponsoredToggleRow() {
        const row = createPanelRow(`
            <span class="switch-label">Hide all sponsored</span>
            <label class="switch" aria-label="Toggles the visibility of sponsored listings">
                <input type="checkbox" id="toggleSponsoredContentSwitch" ${state.ui.hidingEnabled ? "checked" : ""}>
                <span class="slider"></span>
            </label>
        `);
        row.id = "toggleSponsoredContentRow";
        return row;
    }

    function buildPanelHomePage() {
        const pageContainer = Object.assign(document.createElement("div"), {
            id: "panelPagecontainer",
            className: "panel-page-container",
        });
        const homePage = Object.assign(document.createElement("div"), {
            id: "homePage",
            className: "panel-page",
        });
        homePage.style.display = "block";
        const countRow = createSponsoredCountRow();
        const toggleRow = createSponsoredToggleRow();
        homePage.append(countRow, toggleRow);
        pageContainer.append(homePage);
        return pageContainer;
    }

    function buildPanelErrorPage() {
        const errorPage = Object.assign(document.createElement("div"), {
            className: "error-page panel-page",
        });
        const message = document.createElement("p");
        message.textContent = "Nothing sponsored found";
        const links = document.createElement("p");
        const updateLink = Object.assign(document.createElement("a"), {
            textContent: "Update",
            href: "https://greasyfork.org/en/scripts/541981-spotless-for-ebay",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "outbound-update-page",
        });
        const statusLink = Object.assign(document.createElement("a"), {
            textContent: "check status",
            href: "https://github.com/OsborneLabs/Spotless#ebay",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "outbound-status-page",
        });
        links.append(updateLink, " or ", statusLink);
        errorPage.append(message, links);
        return errorPage;
    }

    function updatePanelVisibility() {
        const panelBox = document.getElementById("panelBox");
        if (!panelBox) return;
        const isSearchResultsPage = isValidSearchResultsPage();
        if (isSearchResultsPage) {
            panelBox.classList.add("show");
        } else {
            panelBox.classList.remove("show");
        }
    }

    function setPanelMinimized(minimized) {
        const panelBox = document.getElementById("panelBox");
        if (!panelBox) return;
        const panelPage = panelBox.querySelector(".panel-page");
        const sectionDivider = panelBox.querySelectorAll(".section-divider");
        const panelFooter = panelBox.querySelector(".panel-footer");
        panelBox.classList.toggle("minimized", minimized);
        if (panelPage) panelPage.style.display = minimized ? "none" : "block";
        sectionDivider.forEach(el => {
            el.style.display = minimized ? "none" : "";
        });
        if (panelFooter) panelFooter.style.display = minimized ? "none" : "";
    }

    function updatePanelLockIcon() {
        const locked = document.getElementById("lockedIcon");
        const unlocked = document.getElementById("unlockedIcon");
        locked.classList.toggle("active", state.ui.hidingEnabled);
        unlocked.classList.toggle("active", !state.ui.hidingEnabled);
    }

    function determinePanelState(sponsoredCount) {
        if (!validateSponsoredCount(sponsoredCount)) {
            return buildPanelErrorPage();
        }
        return buildPanelHomePage();
    }

    async function processSponsoredContent() {
        if (state.ui.isContentProcessing) return 0;
        state.ui.isContentProcessing = true;

        try {
            observer.disconnect();
            resetSponsoredContent();
            const detectedSponsoredElements = new Set();
            const separatorSizeMethod = detectSponsoredListingBySeparatorSize();
            separatorSizeMethod.forEach(li => detectedSponsoredElements.add(li));
            if (detectedSponsoredElements.size === 0) {
                const ariaGroupMethod = detectSponsoredListingByAriaGroup();
                ariaGroupMethod.forEach(li => detectedSponsoredElements.add(li));
            }
            if (detectedSponsoredElements.size === 0) {
                const homoglyphLabelMethod = detectSponsoredListingByHomoglyphLabel();
                homoglyphLabelMethod.forEach(li => detectedSponsoredElements.add(li));
            }
            if (detectedSponsoredElements.size === 0) {
                const fontFamilyMethod = detectSponsoredListingByFontGroup();
                fontFamilyMethod.forEach(li => detectedSponsoredElements.add(li));
            }
            if (detectedSponsoredElements.size === 0) {
                const translateYMethod = detectSponsoredListingByTranslateY();
                translateYMethod.forEach(li => detectedSponsoredElements.add(li));
            }
            if (detectedSponsoredElements.size === 0) {
                const invertMethod = detectSponsoredListingByInvertStyle();
                if (invertMethod?.elements) {
                    invertMethod.elements.forEach(li => detectedSponsoredElements.add(li));
                }
            }
            if (detectedSponsoredElements.size === 0) {
                const svgMethod = await detectSponsoredListingBySVG();
                svgMethod.forEach(el => {
                    const li = el.closest("li");
                    if (li) detectedSponsoredElements.add(li);
                });
            }
            requestAnimationFrame(() => {
                const count = detectedSponsoredElements.size;
                const sponsoredDetectionValid = validateSponsoredCount(count);
                if (sponsoredDetectionValid) {
                    for (const el of detectedSponsoredElements) {
                        if (!el.hasAttribute("data-sponsored-processed")) {
                            designateSponsoredContent(el);
                            highlightSponsoredContent(el);
                            hideShowSponsoredContent(el, state.ui.hidingEnabled);
                        }
                    }
                }
                enhancedSellerInfo();
                removeSponsoredRibbons();
                cleanListingURLs();
                cleanGeneralURLs();
                cleanGeneralClutter();
                updateSponsoredCount(count);
                updatePanelVisibility();
                initMainObserver();
                state.ui.isContentProcessing = false;
            });
            return detectedSponsoredElements.size;
        } catch (err) {
            console.error(`${APP_NAME_DEBUG_MODE}: UNABLE TO PROCESS SPONSORED CONTENT, SEE CONSOLE ERROR\n`, err);
            state.ui.isContentProcessing = false;
            initMainObserver();
            return 0;
        }
    }

    function validateSponsoredCount(sponsoredCount) {
        const listings = getListingElements();
        const totalCount = listings.length;
        if (totalCount === 0) return false;
        const MIN_SPONSORED_COUNT = 2;
        const MAX_PERCENT_COUNT = 0.5;
        const sponsoredPercent = sponsoredCount / totalCount;
        return sponsoredCount >= MIN_SPONSORED_COUNT && sponsoredPercent <= MAX_PERCENT_COUNT;
    }

    function updateSponsoredCount(count) {
        const countBubble = document.getElementById("countBubble");
        if (countBubble) countBubble.textContent = count;
    }

    function scheduleHighlightUpdate() {
        if (state.ui.updateScheduled || state.ui.isContentProcessing) return;
        state.ui.updateScheduled = true;
        requestAnimationFrame(() => {
            processSponsoredContent().finally(() => {
                state.ui.updateScheduled = false;
            });
        });
    }

    function getListingElements() {
        return Array.from(document.querySelectorAll("li")).filter((el) => {
            const classes = el.className.split(/\s+/);
            const isClassicListing = classes.some(
                (cls) => /^s-[\w-]+$/.test(cls)
            );
            const isItemCardListing = classes.some(
                (cls) => cls.includes("item-card")
            );
            return isClassicListing || isItemCardListing;
        });
    }

    function detectSponsoredListingBySeparatorSize() {
        const listings = getListingElements();
        const sponsoredListings = [];
        listings.forEach(listing => {
            const separatorSpan = listing.querySelector('span.s-item__sep');
            if (!separatorSpan) return;
            const innerSpan = separatorSpan.querySelector('span');
            const width = innerSpan?.offsetWidth || 0;
            const height = innerSpan?.offsetHeight || 0;
            const isSponsored = width > 0 && height > 0;
            if (isSponsored) {
                sponsoredListings.push(listing);
            }
        });
        return sponsoredListings;
    }

    function detectSponsoredListingByAriaGroup() {
        function generateAriaGroupLabel(num) {
            let letters = '';
            do {
                letters = String.fromCharCode(65 + (num % 26)) + letters;
                num = Math.floor(num / 26) - 1;
            } while (num >= 0);
            return letters;
        }
        const listings = getListingElements();
        const groupMap = {};
        const ariaLabelToGroup = {};
        let groupCounter = 0;
        listings.forEach(listing => {
            const labelSpan = listing.querySelector('span[aria-labelledby]');
            if (!labelSpan) return;
            const ariaLabel = labelSpan.getAttribute('aria-labelledby');
            if (!ariaLabel || !ariaLabel.includes("s-")) return;
            if (!ariaLabelToGroup[ariaLabel]) {
                ariaLabelToGroup[ariaLabel] = `Group ${generateAriaGroupLabel(groupCounter)}`;
                groupCounter++;
            }
            const group = ariaLabelToGroup[ariaLabel];
            if (!groupMap[group]) {
                groupMap[group] = [];
            }
            groupMap[group].push(listing);
        });
        let sponsoredGroup = null;
        let minCount = Infinity;
        for (const [group, listings] of Object.entries(groupMap)) {
            if (listings.length < minCount) {
                sponsoredGroup = group;
                minCount = listings.length;
            }
        }
        return sponsoredGroup ? groupMap[sponsoredGroup] : [];
    }

    function detectSponsoredListingByHomoglyphLabel() {
        const HOMOGLYPH_LABEL = {
            'Ѕ': 's',
            'А': 'a',
            'Е': 'e',
            'О': 'o',
            'Р': 'p',
            'С': 'c',
            'а': 'a',
            'е': 'e',
            'о': 'o',
            'р': 'p',
            'с': 'c',
            'ѕ': 's'
        };

        function normalizeText(c) {
            if (HOMOGLYPH_LABEL[c]) return HOMOGLYPH_LABEL[c];
            return c
                .normalize('NFKC')
                .replace(/[\u200B-\u200D\u061C\uFEFF\u2063]/g, '')
                .toLowerCase();
        }

        function extractText(el) {
            if (!el || !el.innerText) return [];
            return el.innerText
                .split('')
                .map(normalizeText)
                .filter(c => /^[a-z]$/.test(c));
        }

        function isSubsequence(letters, word) {
            let i = 0;
            for (const c of letters) {
                if (c === word[i]) {
                    i++;
                    if (i === word.length) return true;
                }
            }
            return false;
        }
        const sponsoredListings = [];
        document
            .querySelectorAll('li[data-viewport]')
            .forEach(li => {
                const label = li.querySelector('.su-sponsored-label');
                if (!label) return;

                const letters = extractText(label);
                if (!letters.length) return;

                if (
                    APP_SPONSORED_KEYWORDS.some(keyword =>
                        isSubsequence(letters, keyword)
                    )
                ) {
                    sponsoredListings.push(li);
                }
            });
        return sponsoredListings;
    }

    function detectSponsoredListingByFontGroup() {
        const listings = getListingElements();
        if (!listings.length) return new Set();
        const groups = new Map();
        const fontCache = new WeakMap();
        for (const li of listings) {
            const badgeSpan = li.querySelector('div[role="heading"] > span[aria-hidden="true"]');
            if (!badgeSpan) continue;
            const wrapper = badgeSpan.parentElement;
            if (!wrapper) continue;
            let fontFamily = fontCache.get(wrapper);
            if (!fontFamily) {
                fontFamily = getComputedStyle(wrapper).fontFamily;
                if (!fontFamily) continue;
                fontFamily = fontFamily
                    .replace(/["']/g, "")
                    .trim()
                    .toLowerCase();
                fontCache.set(wrapper, fontFamily);
            }
            if (!groups.has(fontFamily)) groups.set(fontFamily, []);
            groups.get(fontFamily).push(li);
        }
        let sponsoredGroup = null;
        let minSize = Infinity;
        for (const arr of groups.values()) {
            if (arr.length < minSize) {
                minSize = arr.length;
                sponsoredGroup = arr;
            }
        }
        return new Set(sponsoredGroup || []);
    }

    function detectSponsoredListingByTranslateY() {
        const listings = getListingElements();
        if (!listings.length) return [];
        const listingCache = new WeakMap();
        const groups = new Map();
        const translateYMap = new Map();
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue;
            }
            if (!rules) continue;
            for (const rule of rules) {
                const sel = rule.selectorText;
                if (!sel) continue;
                const m = rule.cssText.match(/translateY\((-?\d+)\s*px\)/i);
                if (m) translateYMap.set(sel, Number(m[1]));
            }
        }
        for (const listing of listings) {
            if (listingCache.has(listing)) {
                const v = listingCache.get(listing);
                (groups.get(v) || groups.set(v, []).get(v)).push(listing);
                continue;
            }
            const span = listing.querySelector("span[role='heading']");
            if (!span) continue;
            const cls = Array.from(span.classList).find(c => c.startsWith("s-"));
            if (!cls) continue;
            const selector = `span.${cls} > div`;
            const val = translateYMap.get(selector);
            if (val == null) continue;
            listingCache.set(listing, val);
            (groups.get(val) || groups.set(val, []).get(val)).push(listing);
        }
        let sponsoredGroup = null;
        let minCount = Infinity;
        for (const [val, arr] of groups.entries()) {
            if (arr.length < minCount) {
                minCount = arr.length;
                sponsoredGroup = val;
            }
        }
        return sponsoredGroup != null ? groups.get(sponsoredGroup) : [];
    }

    function detectSponsoredListingByInvertStyle() {
        const invertStyleMatch = /div\.([a-zA-Z0-9_-]+)(?:\s+div)?\s*\{[^}]*color:\s*(black|white);[^}]*filter:\s*invert\(([-\d.]+)\)/g;
        const sponsoredGroups = {};
        const classToInvertMap = {};
        const styleTags = Array.from(document.querySelectorAll("style"));
        styleTags.forEach(styleTag => {
            const css = styleTag.textContent;
            let match;
            while ((match = invertStyleMatch.exec(css)) !== null) {
                const [_, className, color, invertValue] = match;
                if (!classToInvertMap[className]) {
                    classToInvertMap[className] = [];
                }
                classToInvertMap[className].push({
                    color,
                    invert: parseFloat(invertValue)
                });
            }
        });
        const containers = Array.from(document.querySelectorAll('div[role="text"]')).filter(container => {
            return container.querySelector('div[aria-hidden="true"]');
        });
        containers.forEach(container => {
            const targetDiv = container.querySelector('div[aria-hidden="true"]');
            if (!targetDiv) return;
            const ancestorDiv = container.closest("div[class*='_']");
            if (!ancestorDiv) return;
            const classList = Array.from(ancestorDiv.classList);
            const dynamicClass = classList.find(cls => classToInvertMap[cls]);
            if (!dynamicClass) return;
            const candidates = classToInvertMap[dynamicClass];
            const invertEntry = candidates?.[0];
            if (!invertEntry) return;
            const key = invertEntry.invert;
            if (!sponsoredGroups[key]) {
                sponsoredGroups[key] = [];
            }
            sponsoredGroups[key].push(container);
        });
        const groupEntries = Object.entries(sponsoredGroups);
        if (groupEntries.length === 0) {
            return {
                invert: null,
                elements: [],
                allGroups: []
            };
        }
        const sortedGroups = groupEntries.sort((a, b) => a[1].length - b[1].length);
        const [sponsoredInvert, sponsoredList] = sortedGroups[0];
        const sponsoredElements = sponsoredList
            .map(container => container.closest("li"))
            .filter(Boolean);
        return {
            invert: parseFloat(sponsoredInvert),
            elements: sponsoredElements,
            allGroups: groupEntries
        };
    }

    function detectSponsoredListingBySVG(batchSize = 10) {
        return new Promise((resolve) => {
            const listings = getListingElements();
            const sponsoredElements = [];
            let index = 0;

            function processBatch() {
                const end = Math.min(index + batchSize, listings.length);
                const batch = listings.slice(index, end);
                let processedInBatch = 0;
                if (batch.length === 0) {
                    resolve(sponsoredElements);
                    return;
                }
                batch.forEach((listing) => {
                    let svgDivSpan = listing.querySelector(".s-item__sep span[aria-hidden='true']");
                    let backgroundImage;
                    if (svgDivSpan) {
                        backgroundImage = getComputedStyle(svgDivSpan.parentElement).backgroundImage;
                    } else {
                        const svgDivB = listing.querySelector(".s-card__sep b[style*='data:image/svg+xml']");
                        if (!svgDivB) return done();
                        backgroundImage = getComputedStyle(svgDivB).backgroundImage;
                    }
                    const match = backgroundImage.match(/url\("data:image\/svg\+xml;base64,([^"]+)"\)/);
                    if (!match || !match[1]) return done();
                    const base64 = match[1];
                    const svgString = atob(base64);
                    const img = new Image();
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    img.src = "data:image/svg+xml;base64," + btoa(svgString);
                    img.onload = () => {
                        canvas.width = img.naturalWidth || 20;
                        canvas.height = img.naturalHeight || 20;
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        const colors = new Set();
                        const sampleWidth = 15;
                        const sampleHeight = 15;
                        for (let y = 0; y < sampleHeight && y < canvas.height; y++) {
                            for (let x = 0; x < sampleWidth && x < canvas.width; x++) {
                                const i = (y * canvas.width + x) * 4;
                                const r = imageData[i];
                                const g = imageData[i + 1];
                                const b = imageData[i + 2];
                                const a = imageData[i + 3];
                                if (a > 0) {
                                    colors.add(`${r},${g},${b}`);
                                    if (colors.size > 1) break;
                                }
                            }
                            if (colors.size > 1) break;
                        }
                        if (colors.size > 1) {
                            sponsoredElements.push(listing);
                        }
                        done();
                    };
                    img.onerror = done;

                    function done() {
                        processedInBatch++;
                        if (processedInBatch === batch.length) {
                            index += batchSize;
                            setTimeout(processBatch, 0);
                        }
                    }
                });
            }
            if (listings.length === 0) {
                resolve([]);
            } else {
                processBatch();
            }
        });
    }

    function designateSponsoredContent(el) {
        el.setAttribute("data-sponsored", "true");
        el.setAttribute("data-sponsored-processed", "true");
        state.ui.highlightedSponsoredContent.push(el);
    }

    function resetSponsoredContent() {
        const elements = state.ui.highlightedSponsoredContent;
        elements.forEach(el => {
            el.classList.remove("sponsored-hidden");
            el.removeAttribute("data-sponsored");
            el.removeAttribute("data-sponsored-processed");
            el.style.border = "";
            el.style.backgroundColor = "";
        });
        elements.length = 0;
    }

    function highlightSponsoredContent(element) {
        element.setAttribute("data-sponsored", "true");
        element.classList.add("sponsored-highlight");
    }

    function hideShowSponsoredContent(element, hide) {
        element.classList.toggle("sponsored-hidden", hide);
    }

    function removeSponsoredBanners(root = document) {
        if (!(root instanceof Element || root instanceof Document)) {
            return;
        }
        const banners = Array.from(
            root.querySelectorAll(
                ".s-answer-region-center-top.s-answer-region > :not(.sponsored-hidden-banner)"
            )
        ).filter(el => el.offsetHeight >= 140);
        banners.forEach(banner => {
            banner.classList.add("sponsored-hidden-banner");
        });
    }

    function removeSponsoredRibbons() {
        document.querySelectorAll('.x-breadcrumb, .x-pda-placements')
            .forEach(el => el.remove());
        const whitelisted = ['statusmessage', 'x-alert', 'x-sme-atf', 'x-vi-evo-cvip-container'];
        const ribbons = document.querySelectorAll('.x-evo-atf-top-river.vi-grid.vim > .d-vi-evo-region.vim > div');
        ribbons.forEach(ribbon => {
            const isWhitelisted = whitelisted.some(pattern =>
                ribbon.classList.value.includes(pattern)
            );
            if (!isWhitelisted) ribbon.remove();
        });
    }

    function removeSponsoredCarousels() {
        if (!determineCarouselDetection()) return;
        const SPONSORED_CAROUSEL_MEDIA_BLOCKLIST = /^https:\/\/video\.ebaycdn\.net\//i;
        const normalizeText = text =>
            text
            .trim()
            .normalize("NFKC")
            .replace(/[\u200B-\u200D\u061C\uFEFF]/g, '')
            .toLowerCase();
        const labelSponsored = carousel => {
            if (carousel.classList.contains('sponsored-hidden-carousel')) return;
            carousel.classList.add('sponsored-hidden-carousel');
            disableSiteTelemetryAttributes(carousel);
            carousel.style.display = 'none';
            carousel.querySelectorAll('video, audio, source').forEach(el => el.remove());
            carousel.querySelectorAll('[data-src], [data-video-src]').forEach(el => {
                el.removeAttribute('data-src');
                el.removeAttribute('data-video-src');
            });
            const observer = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        if (node.matches?.('video, audio, source')) {
                            node.remove();
                            continue;
                        }
                        node.querySelectorAll?.('video, audio, source')
                            .forEach(n => n.remove());
                    }
                }
            });
            observer.observe(carousel, {
                childList: true,
                subtree: true
            });
        };
        document
            .querySelectorAll('[class*="x-atc-layer"][class*="--ads"]')
            .forEach(el => el.remove());

        const carousels = document.querySelectorAll('[data-viewport]');
        carousels.forEach(carousel => {
            if (carousel.classList.contains('sponsored-hidden-carousel')) return;
            if (carousel.closest('.lightbox-dialog, .ux-overlay, [role="dialog"]')) return;
            const title = carousel.querySelector('h2, h3, h4');
            if (
                title &&
                APP_SPONSORED_KEYWORDS.some(kw =>
                    normalizeText(title.textContent).includes(kw)
                )
            ) {
                labelSponsored(carousel);
                return;
            }
            const textElements = Array.from(carousel.querySelectorAll('div, span'));
            if (
                textElements.some(el =>
                    APP_SPONSORED_KEYWORDS.some(kw =>
                        normalizeText(el.textContent).includes(kw)
                    )
                )
            ) {
                labelSponsored(carousel);
                return;
            }
            const characters = textElements
                .map(el => normalizeText(el.textContent))
                .filter(t => t.length === 1 && /^\p{L}$/u.test(t));

            if (
                APP_SPONSORED_KEYWORDS.some(kw => {
                    let i = 0;
                    for (const char of characters) {
                        if (char === kw[i]) {
                            if (++i === kw.length) return true;
                        }
                    }
                    return false;
                })
            ) {
                labelSponsored(carousel);
            }
        });
        if (!window.__ebaySponsoredMediaBlocked) {
            window.__ebaySponsoredMediaBlocked = true;
            const origFetch = window.fetch;
            window.fetch = function(input, init) {
                const url = typeof input === 'string' ? input : input?.url;
                if (
                    url &&
                    SPONSORED_CAROUSEL_MEDIA_BLOCKLIST.test(url) &&
                    document.querySelector('.sponsored-hidden-carousel')
                ) {
                    return Promise.reject();
                }
                return origFetch.call(this, input, init);
            };
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                if (
                    url &&
                    SPONSORED_CAROUSEL_MEDIA_BLOCKLIST.test(url) &&
                    document.querySelector('.sponsored-hidden-carousel')
                ) {
                    this.abort();
                    return;
                }
                return origOpen.call(this, method, url, ...rest);
            };
        }
    }

    function disableSiteTelemetryAttributes(context = document) {
        const TELEMETRY_ATTRIBUTES_SELECTOR = '[trackableid], [trackablemoduleid]';
        const TELEMETRY_ATTRIBUTES_REGEXES = [/^data-atf/i, /^data-gr\d$/i, /^data-s-[a-z0-9]+$/i];
        const TELEMETRY_ATTRIBUTE_BLOCKLIST = new Set([
            'data-hscroll', 'data-uvcc', 'data-click', 'data-clientpresentationmetadata', 'data-config', 'data-defertimer',
            'data-ebayui', 'data-interactions', 'data-listingid', 'data-operationid', 'data-pulsardata', 'data-testid',
            'data-track', 'data-tracking', 'data-uvccoptoutkey', 'data-vi-scrolltracking', 'data-vi-tracking', 'data-view',
            'modulemeta', 'onload', '_sp'
        ]);
        for (const el of context.querySelectorAll('*')) {
            if (el.hasAttribute('data-viewport')) {
                el.setAttribute('data-viewport', '{}');
                if (el.matches('li')) {
                    el.removeAttribute('data-listingid');
                    el.removeAttribute('data-view');
                    el.removeAttribute('id');
                }
                if (el.matches(TELEMETRY_ATTRIBUTES_SELECTOR)) {
                    el.removeAttribute('trackableid');
                    el.removeAttribute('trackablemoduleid');
                }
                for (const t of el.querySelectorAll(TELEMETRY_ATTRIBUTES_SELECTOR)) {
                    t.removeAttribute('trackableid');
                    t.removeAttribute('trackablemoduleid');
                }
            }
            for (const attr of el.attributes) {
                const name = attr.name;
                if (TELEMETRY_ATTRIBUTE_BLOCKLIST.has(name) || TELEMETRY_ATTRIBUTES_REGEXES.some(rx => rx.test(name))) {
                    el.removeAttribute(name);
                }
            }
            if (el.tagName === 'INPUT' && el.type === 'hidden' && el.id && el.id.toLowerCase().startsWith('clientsideexperiments')) {
                el.remove();
                continue;
            }
            if (el.tagName === 'IMG' && el.hasAttribute('onerror')) {
                el.removeAttribute('onerror');
            }
        }
    }

    function disableSiteTelemetryNetworkRequests() {
        const TELEMETRY_NETWORK_BLOCKLIST = [
            /:\/\/backstory\.ebay\./i,
            /:\/\/edgetrksvc\.ebay\./i,
            /:\/\/ebay\.com\/scl\/js\/scandalloader\.js/i,
            /:\/\/ebaystatic\.com\/cr\/v\/.*\/logs.*\.bundle\.js/i,
            /:\/\/event\..*\.shoplive\.cloud/i,
            /:\/\/ir\.ebaystatic\.com\/cr\/ebay-rum\//i,
            /:\/\/ir\.ebaystatic\.com\/rs\/c\/scandal\//i,
            /:\/\/ir\.ebaystatic\.com\/rs\/c\/.*tracking\//i,
            /:\/\/secureir\.ebaystatic\.com\b/i,
            /:\/\/(?:www\.)?ebayrtm\.com\b/i,
            /:\/\/pulsar\.ebay\.com/i
        ];

        function shouldBlock(url) {
            return typeof url === 'string' &&
                TELEMETRY_NETWORK_BLOCKLIST.some(function(rx) {
                    return rx.test(url);
                });
        }
        const origFetch = window.fetch;
        if (origFetch) {
            window.fetch = function(resource) {
                const url = typeof resource === 'string' ? resource : resource && resource.url;
                if (shouldBlock(url)) {
                    return Promise.resolve(new Response(null, {
                        status: 204
                    }));
                }
                return origFetch.apply(this, arguments);
            };
        }
        const origOpen = XMLHttpRequest.prototype.open;
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (shouldBlock(url)) {
                this.__telemetryBlocked = true;
            }
            return origOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function() {
            if (this.__telemetryBlocked) {
                this.readyState = 4;
                this.status = 204;
                if (typeof this.onreadystatechange === 'function') {
                    this.onreadystatechange();
                }
                if (typeof this.onload === 'function') {
                    this.onload();
                }
                return;
            }
            return origSend.apply(this, arguments);
        };
        if (navigator.sendBeacon) {
            const origBeacon = navigator.sendBeacon;
            navigator.sendBeacon = function(url, data) {
                if (shouldBlock(url)) {
                    return true;
                }
                return origBeacon.apply(this, arguments);
            };
        }
    }

    function disableSiteTelemetrySRP() {
        let inert = Object.create(null);
        Object.defineProperty(window, 'SRP', {
            configurable: false,
            enumerable: true,
            get() {
                return inert;
            },
            set(_) {}
        });
    }

    function disableSiteTelemetry() {
        disableSiteTelemetryNetworkRequests(true);
        disableSiteTelemetrySRP();
    }

    function enhancedSellerInfo() {
        const listings = getListingElements();
        const hostname = window.location.hostname.replace(/^www\./, "");
        for (const listing of listings) {
            const sellerElements = listing.querySelectorAll(
                ".su-card-container__attributes__secondary .s-card__attribute-row," +
                ".s-card__program-badge-container--sellerOrStoreInfo"
            );
            for (const container of sellerElements) {
                let username, feedback, targetEl = container;
                const spans = container.querySelectorAll("span.su-styled-text");
                if (spans.length >= 2) {
                    username = spans[0].textContent.trim();
                    feedback = spans[1].textContent.trim();
                    targetEl = spans[0].parentElement;
                } else {
                    const combined = container.querySelector("span.su-styled-text.default");
                    if (!combined) continue;
                    const parts = combined.textContent.trim().split(/\s{2,}/);
                    if (parts.length < 2) continue;
                    [username, feedback] = parts;
                    const wrapper = document.createElement("span");
                    const userSpan = document.createElement("span");
                    const feedbackSpan = document.createElement("span");
                    userSpan.textContent = username;
                    feedbackSpan.textContent = feedback;
                    wrapper.append(userSpan, " ", feedbackSpan);
                    combined.replaceWith(wrapper);
                    targetEl = wrapper;
                }
                if (!username) continue;
                if (!targetEl.querySelector("a.enhanced-seller-info")) {
                    const sellerLink = document.createElement("a");
                    sellerLink.className = "enhanced-seller-info";
                    sellerLink.href = `https://${hostname}/usr/${encodeURIComponent(username)}`;
                    sellerLink.target = "_blank";
                    sellerLink.rel = "noopener noreferrer";
                    sellerLink.textContent = username;

                    targetEl.firstChild?.replaceWith(sellerLink);
                }
                const feedbackNode = targetEl.children[1];
                if (
                    feedbackNode &&
                    feedbackNode.textContent.trim() === feedback &&
                    !feedbackNode.querySelector("a.enhanced-seller-info")
                ) {
                    const feedbackLink = document.createElement("a");
                    feedbackLink.className = "enhanced-seller-info";
                    feedbackLink.href = `https://${hostname}/fdbk/feedback_profile/${encodeURIComponent(username)}`;
                    feedbackLink.target = "_blank";
                    feedbackLink.rel = "noopener noreferrer";
                    feedbackLink.textContent = feedback;
                    feedbackNode.replaceWith(feedbackLink);
                    const bullet = document.createElement("span");
                    bullet.textContent = " · ";
                    bullet.style.padding = "0 0.15em";
                    targetEl.insertBefore(bullet, feedbackLink);
                }
            }
        }
    }

    function cleanListingURLs() {
        const url = /^https:\/\/((?:[a-z0-9-]+\.)*)ebay\.([a-z.]+)\/itm\/(\d+)(?:[/?#].*)?/i;
        const links = document.querySelectorAll("a[href*='/itm/']");
        links.forEach((link) => {
            const match = link.href.match(url);
            if (match) {
                let subdomains = match[1] || "";
                const tld = match[2];
                const itemId = match[3];
                const parts = subdomains.split(".").filter(Boolean).filter(p => p !== "www");
                const subdomain = parts.length ? parts.join(".") + "." : "";
                const cleanURL = `https://${subdomain}ebay.${tld}/itm/${itemId}`;
                if (link.href !== cleanURL) {
                    link.href = cleanURL;
                }
            }
        });
        disableSiteTelemetryAttributes();
    }

    function cleanGeneralURLs() {
        const observer = state.observer.generalCleanupObserver;
        if (observer) observer.disconnect();
        const TRACKING_PARAM_BLOCKLIST = [
            '_blrs', '_from', '_odkw', '_osacat', '_sacat', '_trksid', 'campaign', 'campid', 'cspheader', 'descgauge',
            'domain', 'excSoj', 'excTrk', 'iid', 'item', 'lsite', 'mkcid', 'mkevt', 'mkrid', 'oneClk', 'promoted_items',
            'rt', 'sacat', 'secureDesc', 'siteid', 'source', 'sr', 'templateId', 'toolid'
        ];
        const cleanParam = key =>
            TRACKING_PARAM_BLOCKLIST.includes(key) ||
            key.startsWith("utm_") ||
            key.startsWith("_trk");
        const skipFrames = isLiveStreamPage();
        try {
            const url = new URL(location.href);
            const params = url.searchParams;
            for (const key of Array.from(params.keys())) {
                if (cleanParam(key)) params.delete(key);
            }
            const clean = `${url.origin}${url.pathname}${url.search}${url.hash}`;
            if (clean !== location.href) {
                history.replaceState(null, "", clean);
            }
        } catch {}
        document.querySelectorAll("a[href]").forEach(link => {
            try {
                const url = new URL(link.href);
                const params = url.searchParams;
                for (const key of Array.from(params.keys())) {
                    if (cleanParam(key)) params.delete(key);
                }
                const cleanURL = `${url.origin}${url.pathname}${url.search}${url.hash}`;
                if (link.href !== cleanURL) link.href = cleanURL;
            } catch {}
        });
        if (!skipFrames) {
            document.querySelectorAll("iframe[src]").forEach(iframe => {
                try {
                    const url = new URL(iframe.src);
                    const params = url.searchParams;
                    for (const key of Array.from(params.keys())) {
                        if (cleanParam(key)) params.delete(key);
                    }
                    const cleanSrc = `${url.origin}${url.pathname}${url.search}${url.hash}`;
                    if (iframe.src !== cleanSrc) {
                        iframe.src = cleanSrc;
                    }
                } catch {}
            });
        }
        document.querySelectorAll("form").forEach(form => {
            const cleanForm = () => {
                try {
                    if (form.action) {
                        const url = new URL(form.action, location.href);
                        const params = url.searchParams;
                        for (const key of Array.from(params.keys())) {
                            if (cleanParam(key)) params.delete(key);
                        }
                        form.action = `${url.origin}${url.pathname}${url.search}${url.hash}`;
                    }
                } catch {}
                form.querySelectorAll("input[name], select[name], textarea[name]")
                    .forEach(el => {
                        if (cleanParam(el.name)) el.remove();
                    });
            };
            cleanForm();
            form.addEventListener("submit", cleanForm, true);
        });
        if (observer) {
            observer.observe(document.body, {
                subtree: true,
                childList: true
            });
        }
    }

    function cleanGeneralClutter() {
        const GENERAL_CLUTTER_SELECTORS = [
            '.d-sell-now--filmstrip-margin', '.dynamic-banner', '.madrona-banner', '.s-faq-list', '.s-feedback',
            '.srp-river-answer--CAQ_PLACEHOLDER', '.su-faqs', '.x-goldin-module', '[class*="EBAY_LIVE_ENTRY"]',
            '[class*="FAQ_KW_SRP_MODULE"]', '[class*="LIVE_EVENTS_CAROUSEL"]', '[class*="START_LISTING_BANNER"]',
            '[class*="BOS_PLACEHOLDER"]'
        ];
        const elements = document.querySelectorAll(GENERAL_CLUTTER_SELECTORS.join(','));
        elements.forEach(el => el.remove());
    }

    const observer = new MutationObserver(() => {
        updatePanelVisibility();
        scheduleHighlightUpdate();
    });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCleanListingObserver);
    } else {
        initCleanListingObserver();
    }

    window.addEventListener("storage", ({
        key,
        newValue
    }) => {
        if (!key) return;
        if (key === APP_KEY_HIDE_SPONSORED_CONTENT) {
            const isEnabled = newValue === "true";
            if (isEnabled === state.ui.hidingEnabled) return;
            state.ui.hidingEnabled = isEnabled;
            const toggleInput = document.getElementById(
                "toggleSponsoredContentSwitch"
            );
            if (toggleInput) toggleInput.checked = isEnabled;
            updatePanelLockIcon();
            scheduleHighlightUpdate();
            return;
        }
        if (key === APP_KEY_MINIMIZE_PANEL) {
            setPanelMinimized(newValue === "true");
        }
    });

    const initAfterDOM = async () => {
        init();
    };

    if (["complete", "interactive"].includes(document.readyState)) {
        initAfterDOM();
    } else {
        window.addEventListener("DOMContentLoaded", initAfterDOM);
    }

})();