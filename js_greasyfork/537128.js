// ==UserScript==
// @name         Rule34 Enhanced Dark Gallery
// @namespace    ko-fi.com/awesome97076
// @version      4
// @description  Modern dark theme with masonry layout, advanced search overlay, smart image loading, and collapsible sidebar
// @author       Awesome
// @match        https://rule34.xxx/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/537128/Rule34%20Enhanced%20Dark%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/537128/Rule34%20Enhanced%20Dark%20Gallery.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const CONFIG = {
        debug: false,
        searchOverlay: { enabled: true, hotkey: "/" },
        imageReplacement: { enabled: true, batchDelay: 30 },
        sidebar: { collapsible: true, rememberState: true }
    };

    const Utils = {
        log: (...args) => CONFIG.debug && console.log("[Rule34 Enhanced]", ...args),
        createElement: (tag, props = {}, children = []) => {
            const element = document.createElement(tag);
            Object.assign(element, props);
            if (typeof children === "string") {
                element.innerHTML = children;
            } else {
                children.forEach(child => element.appendChild(child));
            }
            return element;
        },
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        },
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                     setTimeout(() => { inThrottle = false; }, limit);
                }
            };
        }
    };

    const StylesManager = {
        init() {
            const style = document.createElement("style");
            style.innerHTML = this.getCSS();
            document.head.appendChild(style);
        },
        getCSS() {
            return `
:root {
    --bg-color: #121212;
    --bg-secondary: #1e1e1e;
    --bg-tertiary: #2d2d2d;
    --accent-color: #9c64a6;
    --accent-secondary: #ae81ff;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --text-muted: #707070;
    --border-color: rgba(255, 255, 255, 0.1);
    --tag-artist: #ff79c6;
    --tag-character: #50fa7b;
    --tag-copyright: #bd93f9;
    --tag-metadata: #f1fa8c;
    --grid-columns: 3;
    --grid-gap: 8px;
    --border-radius: 6px;
    --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    --font-size-base: 14px;
}

html, body {
    margin: 0;
    padding: 0;
    font-size: var(--font-size-base);
    background: var(--bg-color);
    color: var(--text-primary);
    overflow-x: hidden;
}

*, *::before, *::after {
    box-sizing: border-box;
}

.tag-count { color: var(--text-primary); }
#post-list > div.content > span { display: none; }

div#content {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 8px;
}

div#header {
    background: var(--bg-secondary);
    padding: 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
    margin-bottom: 16px;
}

div#header #site-title {
    background-image: none;
    padding: 12px 16px;
}

div#header #site-title a {
    color: var(--accent-color);
    font-size: 22px;
    font-weight: bold;
}

div#header ul#navbar, div#header ul#subnavbar {
    background: var(--bg-secondary);
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    padding: 0 16px;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
}

#rmainmenu:checked ~ #navbar, #rsubmenu:checked ~ #subnavbar { display: flex; }

div#header ul#navbar li a, div#header ul#subnavbar li a {
    padding: 12px;
    color: var(--text-secondary);
    text-decoration: none;
    white-space: nowrap;
    font-size: 14px;
}

div#header ul#navbar li a:hover, div#header ul#subnavbar li a:hover {
    color: var(--accent-color);
}

a:link, a:visited {
    color: var(--accent-color);
    text-decoration: none;
}

a:hover, a:active {
    color: var(--accent-secondary);
    text-decoration: underline;
}

.tag-type-artist a, .tag-type-artist { color: var(--tag-artist) !important; }
.tag-type-character a, .tag-type-character { color: var(--tag-character) !important; }
.tag-type-copyright a, .tag-type-copyright { color: var(--tag-copyright) !important; }
.tag-type-metadata a, .tag-type-metadata { color: var(--tag-metadata) !important; }

/* OPTIMIZED MASONRY GRID LAYOUT - No gaps, no reflow issues */
div.image-list {
    display: grid !important;
    grid-template-columns: repeat(var(--grid-columns), 1fr) !important;
    grid-auto-rows: 10px !important;
    gap: var(--grid-gap) !important;
    width: 100%;
    margin: 0 auto;
    padding: 0;
}

.thumb {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
}

.thumb a {
    display: block !important;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    background: var(--bg-tertiary);
    box-shadow: var(--box-shadow);
    width: 100%;
    height: auto;
}

.thumb a:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 100;
}

.thumb img, .thumb video {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    object-fit: cover;
    border-radius: 6px;
}

.webm-thumb {
    border: 2px solid #8e44ad !important;
    border-radius: 6px !important;
}

.r34-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
}

.r34-search-overlay.show {
    opacity: 1;
    visibility: visible;
}

.r34-search-modal {
    background: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-color);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow: visible;
}

.r34-search-header {
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-secondary) 100%);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px 12px 0 0;
}

.r34-search-title {
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.r34-search-title::before {
    content: "⚡";
    font-size: 20px;
}

.r34-search-close {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: none;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

.r34-search-close:hover {
    background: rgba(255, 85, 85, 0.8);
}

.r34-search-body {
    padding: 20px;
}

.r34-search-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.r34-search-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-color) !important;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 14px;
    resize: vertical;
    min-height: 60px;
    line-height: 1.4;
}

.r34-search-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(156, 100, 166, 0.15);
}

.r34-search-input::placeholder {
    color: var(--text-muted);
    font-style: italic;
}

.r34-search-button {
    padding: 12px 20px;
    background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-secondary) 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
}

.r34-search-button:hover {
    box-shadow: 0 4px 12px rgba(156, 100, 166, 0.4);
}

.r34-search-hint {
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
    font-style: italic;
}

.r34-search-shortcut {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    margin: 0 4px;
}

.r34-autocomplete-dropdown {
    position: fixed;
    background: var(--bg-color);
    border: 2px solid var(--accent-color);
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 250px;
    overflow-y: auto;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    scrollbar-width: thin;
    scrollbar-color: var(--accent-color) var(--bg-tertiary);
}

.r34-autocomplete-item {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.r34-autocomplete-item:hover, .r34-autocomplete-item.selected {
    background: rgba(156, 100, 166, 0.15);
}

.r34-autocomplete-tag {
    font-size: 13px;
    font-weight: 500;
    flex: 1;
    margin-right: 8px;
}

.r34-autocomplete-count {
    font-size: 11px;
    color: var(--text-muted);
    margin-right: 8px;
}

.r34-autocomplete-type {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 8px;
    text-transform: uppercase;
    font-weight: bold;
    min-width: 40px;
    text-align: center;
}

.r34-tag-artist { border-left: 3px solid var(--tag-artist); }
.r34-tag-artist .r34-autocomplete-tag { color: var(--tag-artist); }
.r34-tag-artist .r34-autocomplete-type { background: rgba(255, 121, 198, 0.2); color: var(--tag-artist); }

.r34-tag-character { border-left: 3px solid var(--tag-character); }
.r34-tag-character .r34-autocomplete-tag { color: var(--tag-character); }
.r34-tag-character .r34-autocomplete-type { background: rgba(80, 250, 123, 0.2); color: var(--tag-character); }

.r34-tag-copyright { border-left: 3px solid var(--tag-copyright); }
.r34-tag-copyright .r34-autocomplete-tag { color: var(--tag-copyright); }
.r34-tag-copyright .r34-autocomplete-type { background: rgba(189, 147, 249, 0.2); color: var(--tag-copyright); }

.r34-tag-metadata { border-left: 3px solid var(--tag-metadata); }
.r34-tag-metadata .r34-autocomplete-tag { color: var(--tag-metadata); }
.r34-tag-metadata .r34-autocomplete-type { background: rgba(241, 250, 140, 0.2); color: var(--tag-metadata); }

.r34-tag-general { border-left: 3px solid #b0b0b0; }
.r34-tag-general .r34-autocomplete-tag { color: #b0b0b0; }
.r34-tag-general .r34-autocomplete-type { background: rgba(176, 176, 176, 0.2); color: #b0b0b0; }

.r34-column-control {
    margin-bottom: 16px;
    background: var(--bg-secondary);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--box-shadow);
}

.r34-column-control label {
    color: var(--text-primary);
    font-weight: 600;
    min-width: 60px;
    font-size: 14px;
}

.r34-column-control input[type="range"] {
    flex: 1;
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
}

.r34-column-count {
    color: var(--accent-color);
    font-weight: bold;
    font-size: 16px;
    min-width: 20px;
    text-align: center;
}

div.sidebar {
    background: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    padding: 0;
    margin-right: 16px;
    margin-bottom: 16px;
    max-width: 260px;
    min-width: 240px;
    border: 1px solid var(--border-color);
    overflow: hidden;
}

#tag-sidebar {
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: 60vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-color) var(--bg-tertiary);
}

#tag-sidebar h6 {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    margin: 0;
    padding: 10px 16px;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#tag-sidebar h6:hover {
    background: rgba(156, 100, 166, 0.2);
    color: var(--accent-color);
}

#tag-sidebar h6::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid currentColor;
    opacity: 0.7;
}

#tag-sidebar h6.collapsed::after {
    transform: rotate(-90deg);
}

.tag-section {
    overflow: hidden;
    max-height: 1000px;
    opacity: 1;
}

.tag-section.collapsed {
    max-height: 0;
    opacity: 0;
}

#tag-sidebar li {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

#tag-sidebar li:not(:has(h6)):hover {
    background: rgba(255, 255, 255, 0.03);
}

div#footer {
    margin-top: 30px;
    padding: 16px 0;
    text-align: center;
    color: var(--text-muted);
    border-top: 1px solid var(--border-color);
    font-size: 12px;
}

div.tag-search {
    background: var(--bg-tertiary);
    padding: 12px;
    border-radius: var(--border-radius);
    margin-bottom: 16px;
    width: 100%;
    position: relative;
}

div.tag-search input[type="text"] {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-primary);
    font-size: 14px;
    margin-bottom: 8px;
}

div.tag-search input[type="submit"] {
    padding: 8px 16px;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    width: 100%;
    max-width: 180px;
}

div.tag-search input[type="submit"]:hover {
    background: var(--accent-secondary);
}

.r34-search-overlay-trigger {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    z-index: 10;
}

.r34-search-overlay-trigger:hover {
    background: var(--accent-secondary);
}

.mobile-search-link {
    display: flex !important;
    align-items: center;
    gap: 6px;
    font-weight: 600 !important;
    color: var(--accent-color) !important;
}

span.data-nosnippet{display:none;}

/* RESPONSIVE GRID BREAKPOINTS - Optimized for performance */
@media (min-width: 2560px) { :root { --grid-columns: 6; } }
@media (max-width: 2559px) and (min-width: 1920px) { :root { --grid-columns: 5; } }
@media (max-width: 1919px) and (min-width: 1600px) { :root { --grid-columns: 4; } }
@media (max-width: 1599px) and (min-width: 1200px) { :root { --grid-columns: 4; } }
@media (max-width: 1199px) and (min-width: 992px) { :root { --grid-columns: 3; } }
@media (max-width: 991px) and (min-width: 768px) { :root { --grid-columns: 3; } }
@media (max-width: 767px) and (min-width: 576px) { :root { --grid-columns: 2; } }
@media (max-width: 575px) { :root { --grid-columns: 1; } }

@media (max-width: 768px) {
    .thumb a:hover { transform: scale(1.02); }
    div#header ul#navbar { flex-direction: column; align-items: stretch; padding: 0; }
    div#header ul#navbar li { display: block !important; border-top: 1px solid var(--border-color) !important; padding: 0 10px !important; margin: 0 !important; }
    div#header ul#navbar li a { font-size: 14px !important; width: 100% !important; display: block !important; padding: 12px 0 !important; }
    .mobile-search-link { background: var(--accent-color) !important; color: white !important; padding: 8px 12px !important; border-radius: 6px !important; margin: 2px 0 !important; }
    input[type="text"], input[type="password"], textarea { width: 100% !important; padding: 10px 12px !important; border: 1px solid var(--border-color) !important; border-radius: 6px !important; font-size: 16px !important; background: var(--bg-color) !important; color: var(--text-primary) !important; }
    input[type="submit"], input[type="button"] { padding: 10px 16px !important; background: var(--accent-color) !important; color: white !important; border: none !important; border-radius: 6px !important; width: 100% !important; margin-top: 8px !important; }
    .r34-column-control { padding: 10px !important; margin-bottom: 12px !important; }
}

@media (max-width: 575px) {
    div#content { padding: 8px !important; }
    .r34-search-modal { width: 95% !important; margin: 8px !important; }
    .r34-search-body { padding: 16px !important; }
    div.sidebar { margin-right: 0 !important; max-width: 100% !important; min-width: 100% !important; margin-bottom: 16px !important; }
    #tag-sidebar { max-height: 40vh !important; }
    div#header #site-title { padding: 10px 12px !important; text-align: center !important; }
    div#header #site-title a { font-size: 18px !important; }
}
`;
        }
    };

    const MasonryLayout = {
        init() {
            setTimeout(() => {
                this.setupMasonry();
                this.bindEvents();
            }, 200);
        },

        setupMasonry() {
            const imageList = document.querySelector('div.image-list');
            if (!imageList) return;

            // Set up ResizeObserver to handle image loads
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    this.updateImagePosition(entry.target);
                });
            });

            // Observe all thumbnails
            const thumbs = imageList.querySelectorAll('.thumb');
            thumbs.forEach(thumb => {
                resizeObserver.observe(thumb);
                const img = thumb.querySelector('img');
                if (img) {
                    if (img.complete) {
                        this.updateImagePosition(thumb);
                    } else {
                        img.addEventListener('load', () => this.updateImagePosition(thumb), { once: true });
                    }
                }
            });

            // Store observer for cleanup
            this.resizeObserver = resizeObserver;
        },

        updateImagePosition(thumb) {
            if (!thumb) return;

            const img = thumb.querySelector('img');
            if (!img || !img.complete) return;

            // Calculate how many grid rows this image should span
            const imageHeight = thumb.offsetHeight;
            const gridRowHeight = 10; // matches grid-auto-rows
            const gap = 8; // matches --grid-gap
            const spanCount = Math.ceil((imageHeight + gap) / (gridRowHeight + gap));

            thumb.style.gridRowEnd = `span ${spanCount}`;
        },

        bindEvents() {
            // Re-layout when new images are added
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('thumb')) {
                                this.setupImageObserver(node);
                            } else {
                                const thumbs = node.querySelectorAll?.('.thumb');
                                thumbs?.forEach(thumb => this.setupImageObserver(thumb));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        setupImageObserver(thumb) {
            if (!this.resizeObserver) return;

            this.resizeObserver.observe(thumb);
            const img = thumb.querySelector('img');
            if (img) {
                if (img.complete) {
                    this.updateImagePosition(thumb);
                } else {
                    img.addEventListener('load', () => this.updateImagePosition(thumb), { once: true });
                }
            }
        }
    };

    const SearchOverlay = {
        overlay: null,
        isOpen: false,
        autocompleteCache: new Map(),
        currentSuggestions: [],
        selectedSuggestionIndex: -1,
        pendingRequest: null,
        lastQuery: "",

        init() {
            if (!CONFIG.searchOverlay.enabled) return;
            setTimeout(() => {
                this.createOverlay();
                this.bindEvents();
                this.addTriggerButton();
            }, 100);
        },

        createOverlay() {
            this.overlay = Utils.createElement("div", {
                className: "r34-search-overlay",
                innerHTML: `
                    <div class="r34-search-modal">
                        <div class="r34-search-header">
                            <h3 class="r34-search-title">Enhanced Search</h3>
                            <div class="r34-search-controls">
                                <button class="r34-search-close" type="button" title="Close">&times;</button>
                            </div>
                        </div>
                        <div class="r34-search-body">
                            <form class="r34-search-form" action="index.php" method="get">
                                <input type="hidden" name="page" value="post">
                                <input type="hidden" name="s" value="list">
                                <div class="r34-search-input-container" style="position: relative;">
                                    <textarea name="tags" class="r34-search-input" placeholder="Enter search tags...&#10;Examples:&#10;• female solo animated&#10;• character_name -furry rating:safe&#10;• artist_name 1girl" rows="4"></textarea>
                                    <div class="r34-autocomplete-dropdown" style="display: none;"></div>
                                </div>
                                <button type="submit" class="r34-search-button">Search</button>
                                <div class="r34-search-hint">
                                    Press <span class="r34-search-shortcut">/</span> to open
                                    <span class="r34-search-shortcut">Esc</span> to close
                                    <span class="r34-search-shortcut">↑↓</span> navigate
                                    <span class="r34-search-shortcut">Enter</span> select
                                </div>
                            </form>
                        </div>
                    </div>
                `
            });
            document.body.appendChild(this.overlay);
        },

        bindEvents() {
            if (!this.overlay) return;

            const closeButton = this.overlay.querySelector(".r34-search-close");
            const textarea = this.overlay.querySelector(".r34-search-input");
            const dropdown = this.overlay.querySelector(".r34-autocomplete-dropdown");

            closeButton?.addEventListener("click", () => this.close());
            this.overlay.addEventListener("click", (e) => {
                if (e.target === this.overlay) this.close();
            });

            document.addEventListener("keydown", (e) => {
                const isInInput = document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA";
                if (e.key === CONFIG.searchOverlay.hotkey && !this.isOpen && !isInInput) {
                    e.preventDefault();
                    this.open();
                } else if (e.key === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                }
            }, true);

            if (textarea) {
                textarea.addEventListener("input", Utils.debounce((e) => this.handleInput(e), 300));
                textarea.addEventListener("keydown", (e) => this.handleKeyDown(e));
                textarea.addEventListener("blur", () => {
                    this.cancelPendingRequest();
                    setTimeout(() => this.hideAutocomplete(), 150);
                });
                this.populateCurrentSearch();
            }

            dropdown?.addEventListener("click", (e) => {
                const suggestion = e.target.closest(".r34-autocomplete-item");
                if (suggestion) this.selectSuggestion(suggestion.dataset.value);
            });
        },

        async handleInput(e) {
            const textarea = e.target;
            const currentTag = this.getCurrentTag(textarea.value, textarea.selectionStart);
            if (!currentTag || currentTag.length < 2 || currentTag === this.lastQuery) {
                this.hideAutocomplete();
                return;
            }
            this.lastQuery = currentTag;
            this.cancelPendingRequest();
            await this.showAutocomplete(currentTag);
        },

        cancelPendingRequest() {
            if (this.pendingRequest) {
                this.pendingRequest.cancelled = true;
                this.pendingRequest = null;
            }
        },

        async fetchSuggestions(query) {
            if (this.autocompleteCache.has(query)) {
                return this.autocompleteCache.get(query);
            }

            this.cancelPendingRequest();

            try {
                const requestPromise = fetch(`https://ac.rule34.xxx/autocomplete.php?q=${encodeURIComponent(query)}`);
                this.pendingRequest = { promise: requestPromise, cancelled: false };

                const response = await requestPromise;
                if (this.pendingRequest?.cancelled || !response.ok) return [];

                const jsonData = await response.json();
                if (this.pendingRequest?.cancelled) return [];

                const suggestions = jsonData.slice(0, 6).map(item => ({
                    label: item.label,
                    value: item.value,
                    type: item.type,
                    count: this.extractCount(item.label)
                }));

                this.autocompleteCache.set(query, suggestions);
                if (this.autocompleteCache.size > 30) this.cleanupCache();

                this.pendingRequest = null;
                return suggestions;
            } catch (error) {
                this.pendingRequest = null;
                return [];
            }
        },

        cleanupCache() {
            const cacheEntries = Array.from(this.autocompleteCache.entries()).slice(0, 20);
            this.autocompleteCache.clear();
            cacheEntries.forEach(([key, value]) => this.autocompleteCache.set(key, value));
        },

        async showAutocomplete(query) {
            const suggestions = await this.fetchSuggestions(query);
            const dropdown = this.overlay.querySelector(".r34-autocomplete-dropdown");
            const textarea = this.overlay.querySelector(".r34-search-input");

            if (!dropdown || !textarea || suggestions.length === 0) {
                this.hideAutocomplete();
                return;
            }

            // Position dropdown relative to textarea
            const textareaRect = textarea.getBoundingClientRect();
            dropdown.style.left = textareaRect.left + "px";
            dropdown.style.top = textareaRect.bottom + "px";
            dropdown.style.width = textareaRect.width + "px";

            this.currentSuggestions = suggestions;
            this.selectedSuggestionIndex = -1;

            dropdown.innerHTML = suggestions
                .map((item, index) => {
                    const typeClass = `r34-tag-${item.type}`;
                    const countDisplay = item.count > 0 ? `(${item.count})` : "";
                    return `<div class="r34-autocomplete-item ${typeClass}" data-value="${item.value}" data-index="${index}">
                        <span class="r34-autocomplete-tag">${item.value}</span>
                        <span class="r34-autocomplete-count">${countDisplay}</span>
                        <span class="r34-autocomplete-type">${item.type}</span>
                    </div>`;
                })
                .join("");

            dropdown.style.display = "block";
        },

        hideAutocomplete() {
            const dropdown = this.overlay.querySelector(".r34-autocomplete-dropdown");
            if (dropdown) dropdown.style.display = "none";
            this.currentSuggestions = [];
            this.selectedSuggestionIndex = -1;
        },

        handleKeyDown(e) {
            const dropdown = this.overlay.querySelector(".r34-autocomplete-dropdown");
            const isDropdownVisible = dropdown && dropdown.style.display !== "none";

            if (!isDropdownVisible) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    this.selectedSuggestionIndex = Math.min(
                        this.selectedSuggestionIndex + 1,
                        this.currentSuggestions.length - 1
                    );
                    this.updateSelectedSuggestion();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
                    this.updateSelectedSuggestion();
                    break;
                case "Enter":
                case "Tab":
                    if (this.selectedSuggestionIndex >= 0) {
                        e.preventDefault();
                        const selectedTag = this.currentSuggestions[this.selectedSuggestionIndex].value;
                        this.selectSuggestion(selectedTag);
                    }
                    break;
                case "Escape":
                    this.hideAutocomplete();
                    break;
            }
        },

        updateSelectedSuggestion() {
            const items = this.overlay.querySelectorAll(".r34-autocomplete-item");
            items.forEach((item, index) => {
                item.classList.toggle("selected", index === this.selectedSuggestionIndex);
            });
        },

        selectSuggestion(selectedTag) {
            const textarea = this.overlay.querySelector(".r34-search-input");
            if (!textarea) return;

            const cursorPosition = textarea.selectionStart;
            const text = textarea.value;
            const beforeCursor = text.substring(0, cursorPosition);
            const afterCursor = text.substring(cursorPosition);

            const beforeTags = beforeCursor.split(/[\s\n]+/);
            const currentTagStart = beforeCursor.lastIndexOf(beforeTags[beforeTags.length - 1]);

            const afterTags = afterCursor.split(/[\s\n]+/);
            const currentTagEnd = cursorPosition + (afterTags[0] ? afterTags[0].length : 0);

            const newText = text.substring(0, currentTagStart) + selectedTag + " " + text.substring(currentTagEnd);
            const newCursorPosition = currentTagStart + selectedTag.length + 1;

            textarea.value = newText;
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
            this.hideAutocomplete();
            textarea.focus();
        },

        getCurrentTag(text, cursorPosition) {
            const beforeCursor = text.substring(0, cursorPosition);
            const afterCursor = text.substring(cursorPosition);
            const beforeTags = beforeCursor.split(/[\s\n]+/);
            const afterTags = afterCursor.split(/[\s\n]+/);

            let currentTag = beforeTags[beforeTags.length - 1] || "";
            if (afterTags[0] && !text[cursorPosition]?.match(/[\s\n]/)) {
                currentTag += afterTags[0];
            }
            return currentTag.trim();
        },

        extractCount(label) {
            const match = label.match(/\((\d+)\)$/);
            return match ? parseInt(match[1]) : 0;
        },

        addTriggerButton() {
            const searchForm = document.querySelector("div.tag-search");
            if (!searchForm || searchForm.querySelector(".r34-search-overlay-trigger")) return;

            const triggerButton = Utils.createElement("button", {
                className: "r34-search-overlay-trigger",
                type: "button",
                innerHTML: "⚡",
                title: "Open Advanced Search (Press /)"
            });

            triggerButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.open();
            });

            searchForm.appendChild(triggerButton);
        },

        populateCurrentSearch() {
            const urlParams = new URLSearchParams(window.location.search);
            const tags = urlParams.get("tags");
            if (tags) {
                const textarea = this.overlay?.querySelector(".r34-search-input");
                if (textarea) textarea.value = decodeURIComponent(tags);
            }
        },

        open() {
            if (!this.overlay || this.isOpen) return;
            this.isOpen = true;
            this.overlay.classList.add("show");
            document.body.style.overflow = "hidden";

            setTimeout(() => {
                const textarea = this.overlay.querySelector(".r34-search-input");
                if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                }
            }, 100);
        },

        close() {
            if (!this.overlay || !this.isOpen) return;
            this.isOpen = false;
            this.overlay.classList.remove("show");
            document.body.style.overflow = "";
            this.hideAutocomplete();
        }
    };

    const ColumnControl = {
        init() {
            this.addControlPanel();
            this.loadSavedColumns();
        },

        addControlPanel() {
            if (document.getElementById("columnSlider")) return;

            const controlPanel = Utils.createElement("div", {
                className: "r34-column-control",
                innerHTML: `
                    <label for="columnSlider">Columns:</label>
                    <input type="range" id="columnSlider" min="1" max="8" value="3">
                    <span class="r34-column-count" id="columnCount">3</span>
                `
            });

            const imageList = document.querySelector(".image-list");
            if (imageList?.parentNode) {
                imageList.parentNode.insertBefore(controlPanel, imageList);
            }
            this.bindEvents();
        },

        bindEvents() {
            const slider = document.getElementById("columnSlider");
            const countDisplay = document.getElementById("columnCount");

            if (!slider || !countDisplay) return;

            slider.addEventListener("input", (e) => {
                const count = e.target.value;
                countDisplay.textContent = count;
                this.setColumnCount(count);
                localStorage.setItem("galleryColumns", count);
            });
        },

        setColumnCount(count) {
            document.documentElement.style.setProperty("--grid-columns", count);
        },

        loadSavedColumns() {
            const savedColumns = localStorage.getItem("galleryColumns");
            if (savedColumns) {
                const slider = document.getElementById("columnSlider");
                const countDisplay = document.getElementById("columnCount");
                if (slider && countDisplay) {
                    slider.value = savedColumns;
                    countDisplay.textContent = savedColumns;
                    this.setColumnCount(savedColumns);
                }
            }
        }
    };

    const ImageReplacement = {
        processedImages: new Set(),

        init() {
            if (!CONFIG.imageReplacement.enabled) return;
            this.bindEvents();
            setTimeout(() => this.processAllThumbnails(), 300);
        },

        bindEvents() {
            const scrollHandler = Utils.throttle(() => this.processVisibleThumbnails(), 200);
            window.addEventListener("scroll", scrollHandler);

            const observer = new MutationObserver((mutations) => {
                let hasNewThumbnails = false;
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === "IMG" && node.src.includes("/thumbnails/")) {
                                hasNewThumbnails = true;
                            } else if (node.querySelector?.('img[src*="/thumbnails/"]')) {
                                hasNewThumbnails = true;
                            }
                        }
                    });
                });
                if (hasNewThumbnails) {
                    setTimeout(() => this.processVisibleThumbnails(), 100);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        },

        extractHashFromThumbnail(thumbnailUrl) {
            const match = thumbnailUrl.match(/thumbnail_([a-f0-9]+)/);
            return match ? match[1] : null;
        },

        extractDirectoryFromThumbnail(thumbnailUrl) {
            const match = thumbnailUrl.match(/thumbnails\/(\d+)\//);
            return match ? match[1] : null;
        },

        createImageUrl(thumbnailUrl, extension) {
            const hash = this.extractHashFromThumbnail(thumbnailUrl);
            const directory = this.extractDirectoryFromThumbnail(thumbnailUrl);
            if (!hash || !directory) return null;
            return `https://rule34.xxx/images/${directory}/${hash}.${extension}`;
        },

        async testImageUrl(url) {
            return new Promise(resolve => {
                const testImg = new Image();
                testImg.onload = () => resolve(true);
                testImg.onerror = () => resolve(false);
                testImg.src = url;
            });
        },

        async replaceThumbnailWithSample(img) {
            const originalSrc = img.src;
            if (this.processedImages.has(originalSrc) || img.dataset.replaced || !originalSrc.includes("/thumbnails/")) {
                return;
            }

            this.processedImages.add(originalSrc);
            img.dataset.processing = "true";

            const extensions = ["jpg", "jpeg", "png", "gif"];
            for (const ext of extensions) {
                const sampleUrl = this.createImageUrl(originalSrc, ext);
                if (!sampleUrl) continue;

                const success = await this.testImageUrl(sampleUrl);
                if (success) {
                    img.src = sampleUrl;
                    img.dataset.replaced = "sample";
                    img.dataset.processing = "false";
                    break;
                }
            }

            if (!img.dataset.replaced) {
                img.dataset.processing = "false";
            }
        },

        processAllThumbnails() {
            const thumbnails = Array.from(document.querySelectorAll('img[src*="/thumbnails/"]'));
            thumbnails.forEach((img, index) => {
                setTimeout(() => {
                    this.replaceThumbnailWithSample(img);
                }, index * CONFIG.imageReplacement.batchDelay);
            });
        },

        processVisibleThumbnails() {
            const thumbnails = Array.from(document.querySelectorAll('img[src*="/thumbnails/"]')).filter(img => {
                if (img.dataset.replaced || img.dataset.processing) return false;
                const rect = img.getBoundingClientRect();
                return rect.top < window.innerHeight + 200 && rect.bottom > -200;
            });

            thumbnails.forEach(img => this.replaceThumbnailWithSample(img));
        }
    };

    const CollapsibleSidebar = {
        init() {
            if (!CONFIG.sidebar.collapsible) return;
            setTimeout(() => this.initializeCollapsibleSidebar(), 100);
        },

        initializeCollapsibleSidebar() {
            const tagSidebar = document.getElementById("tag-sidebar");
            if (!tagSidebar) return;

            const savedStates = CONFIG.sidebar.rememberState ?
                JSON.parse(localStorage.getItem("sidebarCollapsedStates") || "{}") : {};

            const headers = tagSidebar.querySelectorAll("h6");
            headers.forEach(header => {
                const categoryName = header.textContent.toLowerCase().trim();
                const tagSection = document.createElement("div");
                tagSection.className = "tag-section";

                let currentElement = header.parentElement.nextElementSibling;
                const tagItems = [];
                while (currentElement && !currentElement.querySelector("h6")) {
                    tagItems.push(currentElement);
                    currentElement = currentElement.nextElementSibling;
                }

                tagItems.forEach(item => tagSection.appendChild(item));
                header.parentElement.parentNode.insertBefore(tagSection, header.parentElement.nextElementSibling);

                if (savedStates[categoryName]) {
                    header.classList.add("collapsed");
                    tagSection.classList.add("collapsed");
                }

                this.bindHeaderEvents(header, tagSection, categoryName);
            });
        },

        bindHeaderEvents(header, tagSection, categoryName) {
            const toggleSection = () => {
                const isCollapsed = header.classList.contains("collapsed");
                header.classList.toggle("collapsed");

                if (isCollapsed) {
                    tagSection.classList.remove("collapsed");
                } else {
                    tagSection.classList.add("collapsed");
                }

                this.saveCollapsedStates();
            };

            header.addEventListener("click", (e) => {
                e.preventDefault();
                toggleSection();
            });
        },

        saveCollapsedStates() {
            if (!CONFIG.sidebar.rememberState) return;

            const states = {};
            const headers = document.querySelectorAll("#tag-sidebar h6");
            headers.forEach(header => {
                const categoryName = header.textContent.toLowerCase().trim();
                states[categoryName] = header.classList.contains("collapsed");
            });

            localStorage.setItem("sidebarCollapsedStates", JSON.stringify(states));
        }
    };

    const MobileNavigation = {
        init() {
            setTimeout(() => this.addMobileSearchLink(), 200);
        },

        addMobileSearchLink() {
            const navbar = document.querySelector('#navbar');
            if (!navbar || navbar.querySelector('.mobile-search-link')) return;

            const searchLi = Utils.createElement("li", { className: "mobile-search-item" });
            const searchLink = Utils.createElement("a", {
                className: "mobile-search-link",
                href: "#",
                innerHTML: "⚡ Search",
                title: "Open Enhanced Search"
            });

            searchLink.addEventListener("click", (e) => {
                e.preventDefault();
                SearchOverlay.open();
            });

            searchLi.appendChild(searchLink);
            navbar.insertBefore(searchLi, navbar.firstChild);
        }
    };

    const MainApp = {
        init() {
            setTimeout(() => {
                StylesManager.init();
                MasonryLayout.init();
                SearchOverlay.init();
                ColumnControl.init();
                ImageReplacement.init();
                CollapsibleSidebar.init();
                MobileNavigation.init();
                this.exposeGlobalFunctions();
            }, 100);
        },

        exposeGlobalFunctions() {
            window.processAllThumbnails = () => ImageReplacement.processAllThumbnails();
            window.openSearchOverlay = () => SearchOverlay.open();
            window.closeSearchOverlay = () => SearchOverlay.close();
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => MainApp.init());
    } else {
        MainApp.init();
    }
})();