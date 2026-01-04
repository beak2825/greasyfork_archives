// ==UserScript==
// @name         Big_Page
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced content combiner with lazy loading, keyboard navigation, and improved error handling
// @author       SonofDisaster
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524973/Big_Page.user.js
// @updateURL https://update.greasyfork.org/scripts/524973/Big_Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enhanced configuration with new options
    const DEFAULT_CONFIG = {
        maxConcurrentFetches: 5,
        fetchTimeout: 10000,
        excludedDomains: ['facebook.com', 'twitter.com'],
        maxContentLength: 1000000,
        theme: 'light',
        contentFilters: {
            showText: true,
            showImages: true,
            showVideos: false,
            showIframes: false
        },
        fontSize: 'medium',
        highlightColor: '#ffeb3b',
        searchHighlightColor: '#ff4081',
        debug: false,
        proxyUrl: '', // Optional proxy for CORS issues
        sectionCollapsible: true,
        keyboardShortcuts: true,
        lazyLoadThreshold: '50px',
        maxRetries: 3,
        retryDelay: 1000
    };

    // Keyboard shortcuts configuration
    const KEYBOARD_SHORTCUTS = {
        toggleToc: 't',
        toggleSettings: 's',
        nextSection: 'j',
        previousSection: 'k',
        collapseAll: 'c',
        expandAll: 'e',
        toggleDarkMode: 'd',
        focusSearch: '/',
        nextSearchResult: 'n',
        previousSearchResult: 'p',
        exportContent: 'x'
    };

    // Theme configurations
    const THEMES = {
        light: {
            background: '#ffffff',
            text: '#2d3748',
            border: '#e2e8f0',
            shadow: 'rgba(0,0,0,0.1)',
            accent: '#4299e1'
        },
        dark: {
            background: '#1a202c',
            text: '#e2e8f0',
            border: '#4a5568',
            shadow: 'rgba(0,0,0,0.3)',
            accent: '#63b3ed'
        },
        sepia: {
            background: '#f8f4e9',
            text: '#433422',
            border: '#d3cbc1',
            shadow: 'rgba(67,52,34,0.1)',
            accent: '#8b6f4e'
        }
    };
    // CSS Variables and Base Styles
    const CSS_VARIABLES = `
        :root {
            --primary-color: #4a90e2;
            --secondary-color: #f5f5f5;
            --text-color: #333333;
            --border-color: #e0e0e0;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --success-color: #4caf50;
            --error-color: #f44336;
            --warning-color: #ff9800;
            --font-size-small: 14px;
            --font-size-medium: 16px;
            --font-size-large: 18px;
            --spacing-unit: 8px;
            --border-radius: 4px;
            --transition-speed: 0.3s;
        }
    `;

    const BASE_STYLES = `
        .cc-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--background);
            color: var(--text);
            z-index: 9999;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .cc-wrapper.hidden {
            display: none;
        }

        .cc-header {
            position: sticky;
            top: 0;
            background: var(--background);
            border-bottom: 1px solid var(--border);
            padding: var(--spacing-unit);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: var(--spacing-unit);
        }

        .cc-main {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .cc-sidebar {
            width: 300px;
            border-right: 1px solid var(--border);
            background: var(--background);
            overflow-y: auto;
            padding: var(--spacing-unit);
        }

        .cc-content {
            flex: 1;
            overflow-y: auto;
            padding: var(--spacing-unit);
        }

        .cc-toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 8px;
            border-radius: var(--border-radius);
            background: var(--background);
            border: 1px solid var(--border);
            cursor: pointer;
            box-shadow: 0 2px 4px var(--shadow);
        }

        .search-container {
            display: flex;
            align-items: center;
            gap: var(--spacing-unit);
            flex: 1;
            max-width: 600px;
        }

        .search-input {
            flex: 1;
            padding: 8px;
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            background: var(--background);
            color: var(--text);
        }

        .search-controls {
            display: flex;
            gap: 4px;
        }

        .search-nav-btn,
        .search-clear-btn {
            padding: 8px;
            border: none;
            background: var(--secondary-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            color: var(--text);
        }

        .search-highlight {
            background-color: var(--highlight-color);
            padding: 2px;
            border-radius: 2px;
        }

        .search-highlight.active {
            background-color: var(--search-highlight-color);
            color: white;
        }

        .content-section {
            margin-bottom: var(--spacing-unit);
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            overflow: hidden;
        }

        .section-header {
            padding: var(--spacing-unit);
            background: var(--secondary-color);
            display: flex;
            align-items: center;
            gap: var(--spacing-unit);
            cursor: pointer;
        }

        .section-content {
            padding: var(--spacing-unit);
            transition: max-height var(--transition-speed) ease;
        }

        .section-content.collapsed {
            max-height: 0;
            padding: 0;
            overflow: hidden;
        }
    `;

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function sanitizeHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function generateUniqueId(prefix = 'cc') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Core Event Management Class
    class EventManager {
        constructor() {
            this.subscribers = new Map();
        }

        subscribe(event, callback) {
            if (!this.subscribers.has(event)) {
                this.subscribers.set(event, new Set());
            }
            this.subscribers.get(event).add(callback);
            return () => this.unsubscribe(event, callback);
        }

        unsubscribe(event, callback) {
            if (this.subscribers.has(event)) {
                this.subscribers.get(event).delete(callback);
            }
        }

        emit(event, data) {
            if (this.subscribers.has(event)) {
                this.subscribers.get(event).forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`Error in event handler for ${event}:`, error);
                    }
                });
            }
        }
    }

    // Logger Class for Debug Information
    class Logger {
        constructor(config) {
            this.debug = config.debug;
            this.prefix = '[Content Combiner]';
        }

        log(...args) {
            if (this.debug) {
                console.log(this.prefix, ...args);
            }
        }

        error(...args) {
            console.error(this.prefix, ...args);
        }

        warn(...args) {
            console.warn(this.prefix, ...args);
        }

        info(...args) {
            console.info(this.prefix, ...args);
        }

        group(label) {
            if (this.debug) {
                console.group(`${this.prefix} ${label}`);
            }
        }

        groupEnd() {
            if (this.debug) {
                console.groupEnd();
            }
        }
    }

    // Storage Manager for Persistent Data
    class StorageManager {
        constructor(prefix = 'cc_') {
            this.prefix = prefix;
        }

        set(key, value) {
            GM_setValue(this.prefix + key, JSON.stringify(value));
        }

        get(key, defaultValue = null) {
            try {
                const value = GM_getValue(this.prefix + key);
                return value ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        }

        remove(key) {
            GM_deleteValue(this.prefix + key);
        }

        clear() {
            const allValues = GM_listValues();
            allValues.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    GM_deleteValue(key);
                }
            });
        }
    }

    // DOM Management Class
    class DOMManager {
        constructor(eventManager) {
            this.eventManager = eventManager;
            this.originalContent = null;
            this.container = null;
            this.wrapper = null;
        }

        init() {
            this.preserveOriginalContent();
            this.createWrapper();
            this.setupToggleButton();
            this.addKeyboardListener();
        }

        preserveOriginalContent() {
            this.originalContent = document.body.cloneNode(true);
        }

        createWrapper() {
            this.wrapper = document.createElement('div');
            this.wrapper.id = 'content-combiner-wrapper';
            this.wrapper.className = 'cc-wrapper';

            // Create basic structure
            this.wrapper.innerHTML = `
                <div class="cc-header"></div>
                <div class="cc-main">
                    <div class="cc-sidebar"></div>
                    <div class="cc-content"></div>
                </div>
            `;

            document.body.appendChild(this.wrapper);
        }

        setupToggleButton() {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'cc-toggle-btn';
            toggleBtn.innerHTML = `
                <span class="icon">↔️</span>
                <span class="tooltip">Toggle View</span>
            `;
            toggleBtn.onclick = () => this.toggleView();
            document.body.appendChild(toggleBtn);
        }

        toggleView() {
            this.wrapper.classList.toggle('hidden');
            document.body.classList.toggle('cc-original-visible');
            this.eventManager.emit('viewToggled');
        }

        addKeyboardListener() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.toggleView();
                }
            });
        }

        getContainer(name) {
            return this.wrapper.querySelector(`.cc-${name}`);
        }

        createElement(tag, options = {}) {
            const element = document.createElement(tag);

            if (options.className) {
                element.className = options.className;
            }

            if (options.innerHTML) {
                element.innerHTML = options.innerHTML;
            }

            if (options.attributes) {
                Object.entries(options.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }

            if (options.events) {
                Object.entries(options.events).forEach(([event, handler]) => {
                    element.addEventListener(event, handler);
                });
            }

            return element;
        }

        cleanup() {
            this.wrapper.remove();
            document.body.classList.remove('cc-original-visible');
        }
    }

    // UI Components Manager
    class UIManager {
        constructor(config, eventManager, domManager) {
            this.config = config;
            this.eventManager = eventManager;
            this.domManager = domManager;
            this.components = new Map();
        }

        init() {
            this.createHeader();
            this.createSidebar();
            this.createMainContent();
            this.setupEventListeners();
        }

        createHeader() {
            const header = this.domManager.getContainer('header');

            // Create title
            const title = this.domManager.createElement('h1', {
                className: 'cc-title',
                innerHTML: 'Content Combiner'
            });

            // Create toolbar
            const toolbar = this.domManager.createElement('div', {
                className: 'cc-toolbar'
            });

            header.append(title, toolbar);
        }

        createSidebar() {
            const sidebar = this.domManager.getContainer('sidebar');

            // Create TOC container
            const toc = this.domManager.createElement('div', {
                className: 'cc-toc',
                innerHTML: '<h2>Table of Contents</h2><div class="toc-content"></div>'
            });

            sidebar.appendChild(toc);
        }

        createMainContent() {
            const content = this.domManager.getContainer('content');

            // Create sections container
            const sections = this.domManager.createElement('div', {
                className: 'cc-sections'
            });

            content.appendChild(sections);
        }

        setupEventListeners() {
            this.eventManager.subscribe('themeChanged', theme => {
                document.documentElement.dataset.theme = theme;
            });

            this.eventManager.subscribe('contentLoaded', () => {
                this.updateTOC();
            });
        }

        updateTOC() {
            const tocContent = document.querySelector('.toc-content');
            const sections = document.querySelectorAll('.content-section');

            tocContent.innerHTML = Array.from(sections)
                .map((section, index) => `
                    <div class="toc-item" data-section="${index}">
                        ${section.querySelector('h2').textContent}
                    </div>
                `).join('');
        }
    }

    // Content Loading Manager
    class ContentLoader {
        constructor(config, eventManager, logger) {
            this.config = config;
            this.eventManager = eventManager;
            this.logger = logger;
            this.loadedUrls = new Set();
            this.fetchQueue = [];
            this.activeFetches = 0;
            this.retryMap = new Map();
        }

        async loadContent(url, retryCount = 0) {
            if (this.loadedUrls.has(url)) {
                this.logger.log(`Content already loaded for ${url}`);
                return null;
            }

            try {
                this.logger.group(`Loading content from ${url}`);
                const response = await this.fetchWithTimeout(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                if (text.length > this.config.maxContentLength) {
                    throw new Error('Content too large to process');
                }

                this.loadedUrls.add(url);
                this.logger.log('Content loaded successfully');
                this.eventManager.emit('contentLoaded', { url, success: true });

                return this.processContent(text, url);

            } catch (error) {
                this.logger.error(`Error loading content:`, error);

                if (error.name === 'AbortError') {
                    this.logger.warn('Request timed out');
                } else if (retryCount < this.config.maxRetries) {
                    this.logger.warn(`Retrying... (${retryCount + 1}/${this.config.maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                    return this.loadContent(url, retryCount + 1);
                }

                this.eventManager.emit('contentLoaded', { url, success: false, error });
                throw error;
            } finally {
                this.logger.groupEnd();
            }
        }

        async fetchWithTimeout(url) {
            return new Promise((resolve, reject) => {
                const useProxy = this.config.proxyUrl && !this.isSameOrigin(url);

                if (useProxy) {
                    this.fetchWithProxy(url).then(resolve).catch(reject);
                } else {
                    this.fetchDirect(url).then(resolve).catch(reject);
                }
            });
        }

        async fetchWithProxy(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${this.config.proxyUrl}${encodeURIComponent(url)}`,
                    timeout: this.config.fetchTimeout,
                    onload: (response) => resolve(new Response(response.responseText)),
                    onerror: reject,
                    ontimeout: () => reject(new Error('Request timed out'))
                });
            });
        }

        async fetchDirect(url) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.fetchTimeout);

            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }

        processContent(html, baseUrl) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            this.applyContentFilters(doc);
            this.sanitizeContent(doc);
            this.transformUrls(doc, baseUrl);

            return doc;
        }

        applyContentFilters(doc) {
            const { contentFilters } = this.config;

            if (!contentFilters.showImages) {
                doc.querySelectorAll('img').forEach(el => el.remove());
            }

            if (!contentFilters.showVideos) {
                doc.querySelectorAll('video, audio').forEach(el => el.remove());
            }

            if (!contentFilters.showIframes) {
                doc.querySelectorAll('iframe').forEach(el => el.remove());
            }
        }

        sanitizeContent(doc) {
            // Remove potentially harmful elements
            const dangerousElements = [
                'script', 'style', 'link', 'meta',
                'noscript', 'object', 'embed', 'form'
            ];

            dangerousElements.forEach(tag => {
                doc.querySelectorAll(tag).forEach(el => el.remove());
            });

            // Remove event handlers and javascript: URLs
            doc.querySelectorAll('*').forEach(el => {
                const attrs = Array.from(el.attributes);
                attrs.forEach(attr => {
                    if (attr.name.startsWith('on') ||
                        attr.value.includes('javascript:')) {
                        el.removeAttribute(attr.name);
                    }
                });
            });

            // Sanitize links
            doc.querySelectorAll('a').forEach(el => {
                el.setAttribute('rel', 'noopener noreferrer');
                if (el.target === '_blank') {
                    el.setAttribute('target', '_blank');
                }
            });
        }

        transformUrls(doc, baseUrl) {
            try {
                const base = new URL(baseUrl);

                ['href', 'src'].forEach(attr => {
                    doc.querySelectorAll(`[${attr}]`).forEach(el => {
                        try {
                            const url = new URL(el.getAttribute(attr), base);
                            el.setAttribute(attr, url.href);
                        } catch (e) {
                            this.logger.warn(`Failed to transform URL: ${el.getAttribute(attr)}`);
                        }
                    });
                });
            } catch (error) {
                this.logger.error('Error transforming URLs:', error);
            }
        }

        isSameOrigin(url) {
            try {
                return new URL(url).origin === window.location.origin;
            } catch {
                return false;
            }
        }
    }

    // Search Manager
    class SearchManager {
        constructor(config, eventManager) {
            this.config = config;
            this.eventManager = eventManager;
            this.searchResults = [];
            this.currentIndex = -1;
            this.searchInput = null;
            this.resultsDisplay = null;
            this.searchActive = false;
        }

        init() {
            this.createSearchInterface();
            this.setupEventListeners();
        }

        createSearchInterface() {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';

            this.searchInput = document.createElement('input');
            this.searchInput.type = 'text';
            this.searchInput.placeholder = 'Search content...';
            this.searchInput.className = 'search-input';

            const searchControls = document.createElement('div');
            searchControls.className = 'search-controls';
            searchControls.innerHTML = `
                <button class="search-nav-btn prev" title="Previous match (Shift+Enter)">↑</button>
                <button class="search-nav-btn next" title="Next match (Enter)">↓</button>
                <button class="search-clear-btn" title="Clear search (Esc)">×</button>
                <div class="search-results-count"></div>
            `;

            this.resultsDisplay = searchControls.querySelector('.search-results-count');
            searchContainer.append(this.searchInput, searchControls);

            document.querySelector('.cc-header').appendChild(searchContainer);
        }

        setupEventListeners() {
            // Search input handling
            this.searchInput.addEventListener('input', debounce(() => {
                this.performSearch();
            }, 300));

            this.searchInput.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        e.shiftKey ? this.previous() : this.next();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        this.clear();
                        break;
                }
            });

            // Button controls
            document.querySelector('.search-nav-btn.prev')
                .addEventListener('click', () => this.previous());
            document.querySelector('.search-nav-btn.next')
                .addEventListener('click', () => this.next());
            document.querySelector('.search-clear-btn')
                .addEventListener('click', () => this.clear());
        }

        performSearch() {
            const query = this.searchInput.value.trim();

            if (!query) {
                this.clearHighlights();
                return;
            }

            try {
                const searchRegex = new RegExp(query, 'gi');
                this.searchResults = this.findMatches(searchRegex);
                this.highlightMatches();
                this.updateResultsDisplay();

                if (this.searchResults.length > 0) {
                    this.currentIndex = 0;
                    this.scrollToCurrent();
                }
            } catch (error) {
                this.resultsDisplay.textContent = 'Invalid search pattern';
                this.logger.error('Search error:', error);
            }
        }

        findMatches(regex) {
            const matches = [];
            const walker = document.createTreeWalker(
                document.querySelector('.cc-content'),
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        return node.parentNode.tagName !== 'SCRIPT' &&
                        node.parentNode.tagName !== 'STYLE'
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                let match;
                while (match = regex.exec(node.textContent)) {
                    matches.push({
                        node,
                        index: match.index,
                        text: match[0]
                    });
                }
            }

            return matches;
        }

        highlightMatches() {
            this.clearHighlights();

            this.searchResults.forEach((match, index) => {
                const range = document.createRange();
                range.setStart(match.node, match.index);
                range.setEnd(match.node, match.index + match.text.length);

                const highlight = document.createElement('span');
                highlight.className = 'search-highlight';
                highlight.dataset.searchIndex = index;

                try {
                    range.surroundContents(highlight);
                } catch (error) {
                    this.logger.warn('Failed to highlight match:', error);
                }
            });
        }

        updateResultsDisplay() {
            const total = this.searchResults.length;
            const current = this.currentIndex + 1;

            if (total === 0) {
                this.resultsDisplay.textContent = 'No matches';
                this.resultsDisplay.className = 'search-results-count no-results';
            } else {
                this.resultsDisplay.textContent = `${current} of ${total}`;
                this.resultsDisplay.className = 'search-results-count has-results';
            }
        }

        next() {
            if (this.searchResults.length === 0) return;

            this.currentIndex = (this.currentIndex + 1) % this.searchResults.length;
            this.scrollToCurrent();
        }

        previous() {
            if (this.searchResults.length === 0) return;

            this.currentIndex = this.currentIndex <= 0
                ? this.searchResults.length - 1
                : this.currentIndex - 1;
            this.scrollToCurrent();
        }

        scrollToCurrent() {
            const current = document.querySelector(
                `[data-search-index="${this.currentIndex}"]`
            );

            if (current) {
                current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Update highlight states
                document.querySelectorAll('.search-highlight.active')
                    .forEach(el => el.classList.remove('active'));
                current.classList.add('active');

                this.updateResultsDisplay();
            }
        }

        clear() {
            this.searchInput.value = '';
            this.clearHighlights();
            this.searchInput.focus();
        }

        clearHighlights() {
            document.querySelectorAll('.search-highlight').forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(
                    document.createTextNode(highlight.textContent),
                    highlight
                );
            });

            this.searchResults = [];
            this.currentIndex = -1;
            this.updateResultsDisplay();
        }

        focus() {
            this.searchInput.focus();
        }
    }

    // Section Management
    class SectionManager {
        constructor(config, eventManager, logger) {
            this.config = config;
            this.eventManager = eventManager;
            this.logger = logger;
            this.sections = new Map();
            this.observer = null;
        }

        init() {
            this.setupIntersectionObserver();
            this.setupEventListeners();
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    rootMargin: this.config.lazyLoadThreshold,
                    threshold: [0, 0.5, 1]
                }
            );
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const section = this.sections.get(entry.target.id);
                    if (section && !section.isLoaded) {
                        section.load();
                    }
                    this.eventManager.emit('sectionVisible', entry.target.id);
                }
            });
        }

        createSection(url, index) {
            const section = new Section(url, index, this.config, this.eventManager);
            this.sections.set(section.id, section);
            this.observer.observe(section.element);
            return section;
        }

        setupEventListeners() {
            document.addEventListener('keydown', (e) => {
                if (this.config.keyboardShortcuts) {
                    switch(e.key) {
                        case KEYBOARD_SHORTCUTS.collapseAll:
                            this.collapseAll();
                            break;
                        case KEYBOARD_SHORTCUTS.expandAll:
                            this.expandAll();
                            break;
                    }
                }
            });
        }

        collapseAll() {
            this.sections.forEach(section => section.collapse());
        }

        expandAll() {
            this.sections.forEach(section => section.expand());
        }
    }

    // Individual Section Class
    class Section {
        constructor(url, index, config, eventManager) {
            this.url = url;
            this.index = index;
            this.config = config;
            this.eventManager = eventManager;
            this.id = `section-${index}`;
            this.isLoaded = false;
            this.element = this.createElement();
        }

        createElement() {
            const section = document.createElement('section');
            section.id = this.id;
            section.className = 'content-section';
            section.innerHTML = `
                <div class="section-header">
                    <button class="collapse-btn">▼</button>
                    <h2>${this.url}</h2>
                </div>
                <div class="section-content">
                    <div class="loading-placeholder">Loading...</div>
                </div>
            `;

            if (this.config.sectionCollapsible) {
                this.setupCollapsible(section);
            }

            return section;
        }

        setupCollapsible(section) {
            const header = section.querySelector('.section-header');
            const content = section.querySelector('.section-content');
            const collapseBtn = section.querySelector('.collapse-btn');

            header.addEventListener('click', () => {
                const isCollapsed = content.classList.toggle('collapsed');
                collapseBtn.textContent = isCollapsed ? '▶' : '▼';
                this.eventManager.emit('sectionToggled', {
                    id: this.id,
                    collapsed: isCollapsed
                });
            });
        }

        collapse() {
            const content = this.element.querySelector('.section-content');
            const collapseBtn = this.element.querySelector('.collapse-btn');
            content.classList.add('collapsed');
            collapseBtn.textContent = '▶';
        }

        expand() {
            const content = this.element.querySelector('.section-content');
            const collapseBtn = this.element.querySelector('.collapse-btn');
            content.classList.remove('collapsed');
            collapseBtn.textContent = '▼';
        }
    }

    // Main Application Class
    class ContentCombiner {
        constructor() {
            this.config = {
                ...DEFAULT_CONFIG,
                ...GM_getValue('userConfig', {})
            };
            this.eventManager = new EventManager();
            this.logger = new Logger(this.config);
            this.storage = new StorageManager();
            this.domManager = new DOMManager(this.eventManager);
            this.contentLoader = new ContentLoader(this.config, this.eventManager, this.logger);
            this.sectionManager = new SectionManager(this.config, this.eventManager, this.logger);
            this.searchManager = new SearchManager(this.config, this.eventManager);
            this.uiManager = new UIManager(this.config, this.eventManager, this.domManager);
        }

        async init() {
            try {
                this.logger.log('Initializing Content Combiner...');

                // Add styles
                GM_addStyle(CSS_VARIABLES);
                GM_addStyle(BASE_STYLES);

                // Initialize managers
                this.domManager.init();
                this.uiManager.init();
                this.sectionManager.init();
                this.searchManager.init();

                // Setup event listeners
                this.setupEventListeners();

                // Process page links
                await this.processLinks();

                this.logger.log('Content Combiner initialized successfully');
            } catch (error) {
                this.logger.error('Failed to initialize Content Combiner:', error);
                throw error;
            }
        }

        setupEventListeners() {
            this.eventManager.subscribe('configUpdated', (config) => {
                this.updateConfig(config);
            });

            this.eventManager.subscribe('exportContent', () => {
                this.exportContent();
            });
        }

        async processLinks() {
            const links = [...document.querySelectorAll('a[href]')]
                .filter(link => this.isValidUrl(link.href));

            this.logger.log(`Found ${links.length} valid links to process`);

            for (let i = 0; i < links.length; i++) {
                const section = this.sectionManager.createSection(links[i].href, i);
                document.querySelector('.cc-sections').appendChild(section.element);
            }
        }

        isValidUrl(url) {
            try {
                const urlObj = new URL(url);
                return !this.config.excludedDomains.some(domain =>
                        urlObj.hostname.includes(domain)) &&
                    urlObj.protocol.startsWith('http');
            } catch {
                return false;
            }
        }

        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.storage.set('userConfig', this.config);
            this.logger.log('Configuration updated:', newConfig);
            this.eventManager.emit('configChanged', this.config);
        }
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', () => {
        const combiner = new ContentCombiner();
        combiner.init().catch(error => {
            console.error('Failed to initialize Content Combiner:', error);
        });
    });

})();