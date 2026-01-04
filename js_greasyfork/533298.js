// ==UserScript==
// @name         AI Chat Scroller
// @namespace    Violentmonkey Scripts
// @version      2.1.0
// @description  Enhanced navigation for AI chat platforms (ChatGPT, Claude, Grok) with modern UI and message navigation
// @author       maanimis
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://grok.com/chat/*
// @grant        none
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iOCAxNyAxMiAyMSAxNiAxNyIvPjxwb2x5bGluZSBwb2ludHM9IjE2IDcgMTIgMyA4IDciLz48bGluZSB4MT0iMTIiIHkxPSIzIiB4Mj0iMTIiIHkyPSIyMSIvPjwvc3ZnPg==
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/533298/AI%20Chat%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/533298/AI%20Chat%20Scroller.meta.js
// ==/UserScript==

/**
 * AI Chat Scroller Pro
 * 
 * A professional userscript that enhances navigation in AI chat platforms:
 * - ChatGPT
 * - Claude
 * - Grok
 * 
 * Features:
 * - Message numbering
 * - Easy navigation between messages
 * - Modern, unobtrusive UI
 * - Toggleable visibility
 * - Cross-platform compatibility
 */

(function() {
    'use strict';
    
    /**
     * AI Scroller Module - Core functionality for enhanced AI chat navigation
     */
    const AIScroller = {
        /**
         * Configuration and state variables
         */
        config: {
            initDelay: 2000,
            updateInterval: 4000,
            urlCheckInterval: 2000
        },
        
        state: {
            currentUrl: '',
            previousUrl: '',
            targetDivs: [],
            currentIndex: 0,
            selector: '',
            isInitialized: false
        },
        
        validDomains: {
            'chatgpt.com': {
                selector: "article.text-token-text-primary.w-full",
                labelPosition: { top: "70px", marginRight: "70px" }
            },
            'chat.openai.com': {
                selector: "article.text-token-text-primary.w-full",
                labelPosition: { top: "70px", marginRight: "70px" }
            },
            'claude.ai': {
                selector: "div[data-test-render-count]",
                labelPosition: { top: "10px", marginRight: "10px" }
            },
            'grok.com': {
                selector: ".relative.group.flex.flex-col.justify-center.w-full.max-w-3xl",
                labelPosition: { top: "0", marginRight: "10px" }
            }
        },
        
        theme: {
            primary: "#3b82f6",
            accent: "#0284c7",
            dark: "#111827",
            text: "#ffffff",
            shadow: "rgba(0, 0, 0, 0.15)",
            hover: "#2563eb",
            success: "#10b981",
            disabled: "#6b7280"
        },
        
        elements: {},
        
        /**
         * Initialize the scroller
         */
        init() {
            if (this.state.isInitialized) return;
            
            this.state.currentUrl = window.location.href;
            this.state.previousUrl = this.state.currentUrl;
            
            if (!this.isValidUrl()) {
                console.debug('AI Scroller: Not a supported URL');
                return;
            }
            
            this.injectStyles();
            this.createUI();
            this.setupEventListeners();
            this.updateDivs();
            this.startObservers();
            
            this.state.isInitialized = true;
            console.info('AI Scroller Pro: Initialized successfully');
        },
        
        /**
         * Check if current URL is supported
         */
        isValidUrl() {
            const currentDomain = this.extractDomain(this.state.currentUrl);
            return Object.keys(this.validDomains).some(domain => currentDomain.includes(domain));
        },
        
        /**
         * Extract domain from URL
         */
        extractDomain(url) {
            try {
                return new URL(url).hostname;
            } catch (e) {
                return '';
            }
        },
        
        /**
         * Determine selector based on current domain
         */
        determineSelector() {
            const currentDomain = this.extractDomain(this.state.currentUrl);
            
            for (const [domain, config] of Object.entries(this.validDomains)) {
                if (currentDomain.includes(domain)) {
                    this.state.currentDomainConfig = config;
                    return config.selector;
                }
            }
            
            return '';
        },
        
        /**
         * Inject CSS styles
         */
        injectStyles() {
            const styleId = 'ai-scroller-styles';
            
            // Avoid duplicate style injection
            if (document.getElementById(styleId)) return;
            
            const styleEl = document.createElement('style');
            styleEl.id = styleId;
            styleEl.innerHTML = `
                .ai-scroller-container {
                    position: fixed;
                    right: 20px;
                    top: 200px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }
                
                .ai-scroller-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    background: ${this.theme.dark};
                    border-radius: 12px;
                    padding: 6px;
                    box-shadow: 0 8px 16px ${this.theme.shadow};
                    transition: all 0.3s ease;
                }
                
                .ai-scroller-button {
                    background: ${this.theme.primary};
                    color: ${this.theme.text};
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    user-select: none;
                }
                
                .ai-scroller-button:hover {
                    background: ${this.theme.hover};
                    transform: translateY(-1px);
                }
                
                .ai-scroller-button:active {
                    transform: translateY(1px);
                }
                
                .ai-scroller-button.disabled {
                    background: ${this.theme.disabled};
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                
                .ai-scroller-counter {
                    background: ${this.theme.dark};
                    color: ${this.theme.text};
                    padding: 8px 12px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 500;
                }
                
                .ai-scroller-toggle {
                    background: ${this.theme.accent};
                    padding: 8px 12px;
                    border-radius: 8px;
                    color: ${this.theme.text};
                    font-weight: 600;
                    font-size: 14px;
                    text-align: center;
                    box-shadow: 0 4px 8px ${this.theme.shadow};
                }
                
                .ai-scroller-toggle:hover {
                    background: ${this.theme.hover};
                }
                
                .scroller-number-label {
                    position: sticky;
                    background: ${this.theme.primary};
                    color: ${this.theme.text};
                    font-size: 13px;
                    padding: 3px 8px;
                    border-radius: 6px;
                    z-index: 10;
                    float: right;
                    box-shadow: 0 2px 4px ${this.theme.shadow};
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-weight: 500;
                }
                
                .ai-scroller-nav-button {
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                .ai-scroller-container {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .ai-scroller-tooltip {
                    position: absolute;
                    background: ${this.theme.dark};
                    color: ${this.theme.text};
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    box-shadow: 0 4px 8px ${this.theme.shadow};
                    z-index: 10000;
                }
            `;
            document.head.appendChild(styleEl);
        },
        
        /**
         * Update target divs for navigation
         */
        updateDivs() {
            this.state.selector = this.determineSelector();
            
            if (!this.state.selector) {
                console.warn('AI Scroller: No selector for current domain');
                return;
            }
            
            const messageElements = document.querySelectorAll(this.state.selector);
            this.state.targetDivs = [...messageElements].reverse();
            
            this.removeExistingLabels();
            this.addNumberLabels();
            this.updateVisibility();
            this.updateCounter();
            this.updateButtonStates();
        },
        
        /**
         * Remove existing number labels
         */
        removeExistingLabels() {
            document.querySelectorAll('.scroller-number-label').forEach(el => el.remove());
        },
        
        /**
         * Add number labels to messages
         */
        addNumberLabels() {
            this.state.targetDivs.forEach((div, idx) => {
                const numberSpan = document.createElement('span');
                numberSpan.className = 'scroller-number-label';
                numberSpan.innerText = `${this.state.targetDivs.length - idx}`;
                numberSpan.style.display = this.getVisibilityState();
                
                // Apply domain-specific positioning
                const currentDomain = this.extractDomain(this.state.currentUrl);
                for (const [domain, config] of Object.entries(this.validDomains)) {
                    if (currentDomain.includes(domain) && config.labelPosition) {
                        Object.entries(config.labelPosition).forEach(([prop, value]) => {
                            numberSpan.style[prop] = value;
                        });
                        break;
                    }
                }
                
                div.prepend(numberSpan);
            });
        },
        
        /**
         * Create UI components
         */
        createUI() {
            // Main container
            this.elements.mainContainer = document.createElement('div');
            this.elements.mainContainer.className = 'ai-scroller-container';
            
            // Toggle button
            this.elements.toggleButton = document.createElement('button');
            this.elements.toggleButton.className = 'ai-scroller-button ai-scroller-toggle';
            this.elements.toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                     style="margin-right: 6px; vertical-align: -3px;">
                    <polyline points="8 17 12 21 16 17"></polyline>
                    <polyline points="16 7 12 3 8 7"></polyline>
                    <line x1="12" y1="3" x2="12" y2="21"></line>
                </svg>
                AI Scroller Pro
            `;
            this.elements.toggleButton.title = "Show/Hide Controls";
            
            // Controls container
            this.elements.controlsContainer = document.createElement('div');
            this.elements.controlsContainer.className = 'ai-scroller-controls';
            
            // Up button
            this.elements.upButton = document.createElement('button');
            this.elements.upButton.className = 'ai-scroller-button ai-scroller-nav-button';
            this.elements.upButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            `;
            this.elements.upButton.title = "Previous Message";
            this.addTooltip(this.elements.upButton, "Previous Message");
            
            // Counter
            this.elements.counter = document.createElement('div');
            this.elements.counter.className = 'ai-scroller-counter';
            
            // Down button
            this.elements.downButton = document.createElement('button');
            this.elements.downButton.className = 'ai-scroller-button ai-scroller-nav-button';
            this.elements.downButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
            this.elements.downButton.title = "Next Message";
            this.addTooltip(this.elements.downButton, "Next Message");
            
            // Assemble UI
            this.elements.controlsContainer.appendChild(this.elements.upButton);
            this.elements.controlsContainer.appendChild(this.elements.counter);
            this.elements.controlsContainer.appendChild(this.elements.downButton);
            
            this.elements.mainContainer.appendChild(this.elements.toggleButton);
            this.elements.mainContainer.appendChild(this.elements.controlsContainer);
            
            document.body.appendChild(this.elements.mainContainer);
        },
        
        /**
         * Add tooltip to element
         */
        addTooltip(element, text) {
            const tooltip = document.createElement('div');
            tooltip.className = 'ai-scroller-tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
                tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        },
        
        /**
         * Setup event listeners
         */
        setupEventListeners() {
            this.elements.upButton.addEventListener("click", () => this.scrollUp());
            this.elements.downButton.addEventListener("click", () => this.scrollDown());
            this.elements.toggleButton.addEventListener("click", () => this.toggleVisibility());
            
            // Add hover effects
            const addHoverEffect = (element) => {
                element.addEventListener("mouseenter", () => {
                    if (!element.classList.contains('disabled')) {
                        element.style.transform = "translateY(-1px)";
                    }
                });
                element.addEventListener("mouseleave", () => {
                    element.style.transform = "translateY(0)";
                });
            };
            
            addHoverEffect(this.elements.toggleButton);
            addHoverEffect(this.elements.upButton);
            addHoverEffect(this.elements.downButton);
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Only if controls are visible
                if (this.getVisibilityState() === "none") return;
                
                // Alt+Up for previous message
                if (e.altKey && e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.scrollUp();
                }
                // Alt+Down for next message
                else if (e.altKey && e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.scrollDown();
                }
            });
        },
        
        /**
         * Scroll to previous message
         */
        scrollUp() {
            if (this.state.currentIndex < this.state.targetDivs.length - 1) {
                this.scrollTo(this.state.currentIndex + 1);
            }
        },
        
        /**
         * Scroll to next message
         */
        scrollDown() {
            if (this.state.currentIndex > 0) {
                this.scrollTo(this.state.currentIndex - 1);
            }
        },
        
        /**
         * Scroll to specific message index
         */
        scrollTo(index) {
            const targetElement = this.state.targetDivs[index];
            if (!targetElement) return;
            
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            this.state.currentIndex = index;
            this.updateCounter();
            this.updateButtonStates();
        },
        
        /**
         * Update button states based on current position
         */
        updateButtonStates() {
            const totalMessages = this.state.targetDivs.length;
            
            // Update up button state
            if (this.state.currentIndex >= totalMessages - 1) {
                this.elements.upButton.classList.add('disabled');
            } else {
                this.elements.upButton.classList.remove('disabled');
            }
            
            // Update down button state
            if (this.state.currentIndex <= 0) {
                this.elements.downButton.classList.add('disabled');
            } else {
                this.elements.downButton.classList.remove('disabled');
            }
        },
        
        /**
         * Update message counter
         */
        updateCounter() {
            if (this.state.targetDivs.length === 0) {
                this.elements.counter.innerText = "0 / 0";
                return;
            }
            
            const current = this.state.targetDivs.length - this.state.currentIndex;
            const total = this.state.targetDivs.length;
            this.elements.counter.innerHTML = `
                <span style="font-size: 18px; font-weight: 600;">${current}</span>
                <span style="opacity: 0.7; margin: 0 2px;">/</span>
                <span style="opacity: 0.7;">${total}</span>
            `;
        },
        
        /**
         * Toggle UI visibility
         */
        toggleVisibility() {
            const isVisible = this.getVisibilityState() !== "none";
            const newDisplay = isVisible ? "none" : "block";
            localStorage.setItem('scrollerVisibility', newDisplay);
            this.updateVisibility();
            this.updateDivs(); // Refresh labels with new visibility
        },
        
        /**
         * Get current visibility state
         */
        getVisibilityState() {
            return localStorage.getItem('scrollerVisibility') || "block";
        },
        
        /**
         * Update UI based on visibility state
         */
        updateVisibility() {
            const displayState = this.getVisibilityState();
            this.elements.controlsContainer.style.display = displayState;
            
            // Update toggle button appearance based on state
            if (displayState === "none") {
                this.elements.toggleButton.style.opacity = "0.7";
            } else {
                this.elements.toggleButton.style.opacity = "1";
            }
        },
        
        /**
         * Start observers for DOM and URL changes
         */
        startObservers() {
            // Update divs periodically
            setInterval(() => this.updateDivs(), this.config.updateInterval);
            
            // Watch for URL changes
            setInterval(() => {
                const newUrl = window.location.href;
                if (newUrl !== this.state.previousUrl) {
                    this.state.previousUrl = newUrl;
                    this.state.currentUrl = newUrl;
                    this.state.currentIndex = 0;
                    this.updateDivs();
                    this.updateCounter();
                }
            }, this.config.urlCheckInterval);
            
            // Create MutationObserver to detect new messages
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE && 
                                node.matches && 
                                (node.matches(this.state.selector) || node.querySelector(this.state.selector))) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                    
                    if (shouldUpdate) break;
                }
                
                if (shouldUpdate) {
                    this.updateDivs();
                }
            });
            
            // Start observing document body for changes
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        }
    };
    
    // Initialize after a short delay to ensure DOM is ready
    setTimeout(() => AIScroller.init(), AIScroller.config.initDelay);
    // AIScroller.init()
})();

