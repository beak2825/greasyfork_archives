// ==UserScript==
// @name         GLIF Tools V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A set of tools i use in glif.app
// @author       i12bp8
// @match        https://glif.app/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/519494/GLIF%20Tools%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/519494/GLIF%20Tools%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Modern SVG Icons
    const icons = {
        history: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 8v4l3 3"></path>
            <path d="M3.05 11a9 9 0 1 1 .5 4"></path>
        </svg>`,
        tools: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 1 .708 0"></path>
</svg>`,
        trash: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 5h15M6.67 5V3.33a1.67 1.67 0 011.66-1.66h3.34a1.67 1.67 0 011.66 1.66V5m2.5 0v11.67a1.67 1.67 0 01-1.66 1.66H5.83a1.67 1.67 0 01-1.66-1.66V5h11.66z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.33 9.17v5M11.67 9.17v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        private: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        public: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
        </svg>`,
        time: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>`,
        search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>`,
        prompt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        batch: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="16" x2="16" y2="16" />
        </svg>`,
        add: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>`,
        remove: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>`,
        play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="10 8 16 12 10 16" fill="currentColor"/>
        </svg>`,
        lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>`,
        close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,
        error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>`,
        loading: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            <path d="M12 12l-.01 0"></path>
        </svg>`,
        check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`,
        globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>`,
        lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" fill="none"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>`,
        image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="none"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 21.35l-9-9"></path>
        </svg>`,
        copy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>`,
        generate: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>`,
        bug: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor" class="bi bi-bug" style="min-width: 20px;">
  <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 0 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 0 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
</svg>`,
        feature: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg>`,
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
</svg>`,
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707"/>
</svg>`
    };

    // Initialize dark mode from localStorage
    let isDarkMode = localStorage.getItem('glifToolsDarkMode') === 'true';

    // Toggle dark mode
    const toggleDarkMode = () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('glifToolsDarkMode', isDarkMode);
        document.documentElement.setAttribute('data-glif-dark-mode', isDarkMode);

        // Force update all dropdowns to ensure correct state
        const dropdowns = document.querySelectorAll('.glif-tools-dropdown');
        dropdowns.forEach(dropdown => {
            const oldMenu = dropdown.querySelector('.glif-tools-menu');
            if (oldMenu) {
                const newDropdown = createToolsDropdown();
                dropdown.parentNode.replaceChild(newDropdown, dropdown);
            }
        });

        // Update all panels and their contents
        const updatePanelStyles = (panel) => {
            if (isDarkMode) {
                panel.style.backgroundColor = '#1E1E1E';
                panel.style.color = '#FFFFFF';
                panel.style.borderColor = '#2E2E2E';
                panel.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';

                // Update header
                const header = panel.querySelector('.panel-header, .history-header, .batch-header, .metadata-header, .bug-report-header');
                if (header) {
                    header.style.backgroundColor = '#1E1E1E';
                    header.style.borderBottomColor = '#2E2E2E';
                    const title = header.querySelector('h2');
                    if (title) title.style.color = '#FFFFFF';
                }

                // Update content
                const content = panel.querySelector('.panel-content, .history-content, .batch-content, .metadata-content, .bug-report-content');
                if (content) {
                    content.style.backgroundColor = '#1E1E1E';
                }

                // Update form elements
                panel.querySelectorAll('input, textarea, select').forEach(el => {
                    el.style.backgroundColor = '#2A2A2A';
                    el.style.color = '#FFFFFF';
                    el.style.borderColor = '#3E3E3E';
                });

                // Update buttons
                panel.querySelectorAll('button').forEach(btn => {
                    btn.style.backgroundColor = '#2A2A2A';
                    btn.style.color = '#FFFFFF';
                    btn.style.borderColor = '#3E3E3E';
                });

                // Update history/batch items
                panel.querySelectorAll('.history-item, .batch-result-item').forEach(item => {
                    item.style.backgroundColor = '#2A2A2A';
                    item.style.borderColor = '#3E3E3E';
                });

                // Update metadata
                panel.querySelectorAll('.history-metadata, .batch-metadata').forEach(meta => {
                    meta.style.color = '#FFFFFF';
                });

                // Update timestamps and status
                panel.querySelectorAll('.history-timestamp, .history-status').forEach(el => {
                    el.style.color = '#6B7280';
                });

                // Update progress bars
                panel.querySelectorAll('.batch-progress-container').forEach(container => {
                    container.style.backgroundColor = '#2A2A2A';
                    container.style.borderColor = '#3E3E3E';
                    const bar = container.querySelector('.progress-bar');
                    if (bar) bar.style.backgroundColor = '#33363C';
                    const fill = container.querySelector('.progress-fill');
                    if (fill) fill.style.backgroundColor = '#4F46E5';
                });

                // Update error containers
                panel.querySelectorAll('.error-container').forEach(container => {
                    container.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    container.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    const message = container.querySelector('.error-message');
                    if (message) message.style.color = '#EF4444';
                });
            } else {
                // Reset all styles to default
                panel.style = '';
                panel.querySelectorAll('*').forEach(el => {
                    el.style = '';
                });
            }
        };

        // Update all panels
        document.querySelectorAll('.glif-panel, .history-panel, .batch-panel, .bug-report-panel, .metadata-panel').forEach(updatePanelStyles);

        // Update overlays
        document.querySelectorAll('.history-overlay, .batch-overlay, .metadata-overlay').forEach(overlay => {
            overlay.style.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.75)' : '';
        });

        // Update toasts
        document.querySelectorAll('.glif-toast').forEach(toast => {
            if (isDarkMode) {
                toast.style.backgroundColor = '#1E1E1E';
                toast.style.color = '#FFFFFF';
                toast.style.borderColor = '#2E2E2E';
                if (toast.classList.contains('success')) {
                    toast.style.borderLeftColor = '#10B981';
                } else if (toast.classList.contains('error')) {
                    toast.style.borderLeftColor = '#EF4444';
                }
            } else {
                toast.style = '';
            }
        });
    };

    // Inject modern styles
    const injectStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'glif-tools-v3-styles';
        styleSheet.textContent = `
            /* Dark mode transitions */
            .glif-panel, .glif-panel *, .glif-tools-menu, .glif-tools-menu *,
            .glif-toast, input, textarea, button, select {
                transition: all 0.3s ease;
            }

            /* Dark mode styles - Tools Dropdown */
            [data-glif-dark-mode="true"] .glif-tools-menu {
                background-color: #1E1E1E !important;
                border: 1px solid #2E2E2E !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-menu-item {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-menu-item:hover {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-menu-item svg {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-menu-item:hover svg {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-credits {
                border-top: 1px solid #2E2E2E !important;
                color: #FFFFFF !important;
                margin-top: 8px !important;
                padding-top: 8px !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-credits a {
                color: #4F46E5 !important;
            }

            [data-glif-dark-mode="true"] .glif-tools-credits a:hover {
                color: #6366F1 !important;
            }

            /* Dark mode styles - Panels */
            [data-glif-dark-mode="true"] .glif-panel,
            [data-glif-dark-mode="true"] .history-panel,
            [data-glif-dark-mode="true"] .batch-panel,
            [data-glif-dark-mode="true"] .bug-report-panel,
            [data-glif-dark-mode="true"] .metadata-panel {
                background-color: #1E1E1E !important;
                color: #FFFFFF !important;
                border: 1px solid #2E2E2E !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
            }

            /* Panel Headers */
            [data-glif-dark-mode="true"] .panel-header,
            [data-glif-dark-mode="true"] .history-header,
            [data-glif-dark-mode="true"] .batch-header,
            [data-glif-dark-mode="true"] .metadata-header,
            [data-glif-dark-mode="true"] .bug-report-header {
                background-color: #1E1E1E !important;
                border-bottom: 1px solid #2E2E2E !important;
            }

            [data-glif-dark-mode="true"] .panel-header h2,
            [data-glif-dark-mode="true"] .history-header h2,
            [data-glif-dark-mode="true"] .batch-header h2,
            [data-glif-dark-mode="true"] .metadata-header h2,
            [data-glif-dark-mode="true"] .bug-report-header h2 {
                color: #FFFFFF !important;
            }

            /* Panel Content */
            [data-glif-dark-mode="true"] .panel-content,
            [data-glif-dark-mode="true"] .history-content,
            [data-glif-dark-mode="true"] .batch-content,
            [data-glif-dark-mode="true"] .metadata-content,
            [data-glif-dark-mode="true"] .bug-report-content {
                background-color: #1E1E1E !important;
            }

            /* Form Elements */
            [data-glif-dark-mode="true"] .glif-panel input,
            [data-glif-dark-mode="true"] .glif-panel textarea,
            [data-glif-dark-mode="true"] .glif-panel select,
            [data-glif-dark-mode="true"] .search-input,
            [data-glif-dark-mode="true"] .batch-input {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] .glif-panel input:focus,
            [data-glif-dark-mode="true"] .glif-panel textarea:focus,
            [data-glif-dark-mode="true"] .glif-panel select:focus,
            [data-glif-dark-mode="true"] .search-input:focus,
            [data-glif-dark-mode="true"] .batch-input:focus {
                border-color: #4F46E5 !important;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
            }

            [data-glif-dark-mode="true"] .glif-panel input:hover,
            [data-glif-dark-mode="true"] .glif-panel textarea:hover,
            [data-glif-dark-mode="true"] .glif-panel select:hover,
            [data-glif-dark-mode="true"] .search-input:hover,
            [data-glif-dark-mode="true"] .batch-input:hover {
                background-color: #33363C !important;
            }

            /* Buttons */
            [data-glif-dark-mode="true"] .glif-panel button,
            [data-glif-dark-mode="true"] .batch-generate-button,
            [data-glif-dark-mode="true"] .clear-history-button,
            [data-glif-dark-mode="true"] .filter-button,
            [data-glif-dark-mode="true"] .batch-row-action-button,
            [data-glif-dark-mode="true"] .glif-type-button {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] .glif-panel button:hover,
            [data-glif-dark-mode="true"] .batch-generate-button:hover,
            [data-glif-dark-mode="true"] .clear-history-button:hover,
            [data-glif-dark-mode="true"] .filter-button:hover,
            [data-glif-dark-mode="true"] .batch-row-action-button:hover,
            [data-glif-dark-mode="true"] .glif-type-button:hover {
                background-color: #33363C !important;
                border-color: #4F46E5 !important;
            }

            /* History Items */
            [data-glif-dark-mode="true"] .history-item,
            [data-glif-dark-mode="true"] .batch-result-item {
                background-color: #2A2A2A !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] .history-item:hover,
            [data-glif-dark-mode="true"] .batch-result-item:hover {
                background-color: #33363C !important;
                border-color: #4F46E5 !important;
            }

            [data-glif-dark-mode="true"] .history-metadata,
            [data-glif-dark-mode="true"] .batch-metadata {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .history-timestamp,
            [data-glif-dark-mode="true"] .history-status {
                color: #6B7280 !important;
            }

            [data-glif-dark-mode="true"] .history-status.private {
                color: #EF4444 !important;
            }

            [data-glif-dark-mode="true"] .history-status.public {
                color: #38A169 !important;
            }

            /* Progress Bars */
            [data-glif-dark-mode="true"] .batch-progress-container {
                background-color: #2A2A2A !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] .progress-bar {
                background-color: #33363C !important;
            }

            [data-glif-dark-mode="true"] .progress-fill {
                background-color: #4F46E5 !important;
            }

            /* Error States */
            [data-glif-dark-mode="true"] .error-container {
                background-color: rgba(239, 68, 68, 0.1) !important;
                border: 1px solid rgba(239, 68, 68, 0.2) !important;
            }

            [data-glif-dark-mode="true"] .error-message {
                color: #EF4444 !important;
            }

            /* Overlays */
            [data-glif-dark-mode="true"] .history-overlay,
            [data-glif-dark-mode="true"] .batch-overlay,
            [data-glif-dark-mode="true"] .metadata-overlay {
                background-color: rgba(0, 0, 0, 0.75) !important;
            }

            /* Toast Notifications */
            [data-glif-dark-mode="true"] .glif-toast {
                background-color: #1E1E1E !important;
                color: #FFFFFF !important;
                border: 1px solid #2E2E2E !important;
            }

            [data-glif-dark-mode="true"] .glif-toast.success {
                border-left: 4px solid #10B981 !important;
            }

            [data-glif-dark-mode="true"] .glif-toast.error {
                border-left: 4px solid #EF4444 !important;
            }

            /* Regular styles */
            .glif-tools-dropdown {
                position: relative;
                display: inline-block;
            }

            .glif-tools-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 8px;
                display: none;
                z-index: 1000;
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s ease;
            }

            .glif-tools-menu.active {
                display: block;
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .glif-tools-menu-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                color: #374151;
                text-decoration: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
                white-space: nowrap;
            }

            .glif-tools-menu-item svg {
                width: 18px;
                height: 18px;
                flex-shrink: 0;
            }

            .glif-tools-menu-item:hover {
                background: #f3f4f6;
            }

            .glif-tools-credits {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
            }

            .glif-tools-credits a {
                color: #3b82f6;
                text-decoration: none;
            }

            .glif-tools-credits a:hover {
                text-decoration: underline;
            }

            .history-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(17, 17, 17, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }

            .history-panel {
                background: #ffffff;
                border-radius: 24px;
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }

            .history-header {
                padding: 24px 32px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                gap: 24px;
                border-bottom: 1px solid #edf2f7;
            }

            .history-panel-title-section {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .history-panel-title {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                font-size: 1.5rem;
                font-weight: 700;
                color: #2d3748;
            }

            .history-controls {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }

            .history-filters {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #f7fafc;
                padding: 4px;
                border-radius: 12px;
            }

            .filter-button {
                padding: 8px 16px;
                border-radius: 8px;
                border: none;
                background: transparent;
                color: #718096;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                font-weight: 500;
            }

            .filter-button:hover {
                color: #4a5568;
            }

            .filter-button.active {
                background: #ffffff;
                color: #2d3748;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .search-container {
                position: relative;
                flex: 1;
                max-width: 300px;
            }

            .search-input {
                width: 100%;
                padding: 10px 16px 10px 40px;
                border: 2px solid #edf2f7;
                border-radius: 12px;
                font-size: 0.95rem;
                outline: none;
                transition: border-color 0.2s ease;
                background: #f8fafc;
                color: #2d3748;
            }

            .search-input:focus {
                border-color: #cbd5e0;
                background: #ffffff;
            }

            .search-input::placeholder {
                color: #a0aec0;
            }

            .search-icon {
                position: absolute;
                left: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: #a0aec0;
            }

            .clear-history-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                background: #fff5f5;
                border: none;
                border-radius: 12px;
                color: #e53e3e;
                cursor: pointer;
                transition: background 0.2s;
                font-size: 0.9rem;
                font-weight: 500;
            }

            .clear-history-button:hover {
                background: #fed7d7;
            }

            .history-content {
                padding: 32px;
                overflow-y: auto;
                flex: 1;
                background: #f8fafc;
            }

            .history-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
                margin: 0;
            }

            .history-item {
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                transition: transform 0.2s ease;
                cursor: pointer;
                border: 1px solid #edf2f7;
                display: flex;
                flex-direction: column;
            }

            .history-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
            }

            .history-item-image {
                width: 100%;
                height: 220px;
                flex-shrink: 0;
                position: relative;
                border-radius: 8px 8px 0 0;
                overflow: hidden;
                background: #f7fafc;
            }

            .history-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .history-item-info {
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: #ffffff;
                flex: 1;
                min-height: 0;
            }

            .history-metadata {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .history-timestamp {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #718096;
                font-size: 0.85rem;
            }

            .history-status {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .history-status.private {
                color: #e53e3e;
            }

            .history-status.public {
                color: #38a169;
            }

            .history-item-prompt-container {
                background: #ebf8ff;
                padding: 12px;
                border-radius: 8px;
                margin-top: 4px;
                max-height: calc(1.5em * 2 + 24px);
                overflow: hidden;
            }

            .history-item-prompt {
                color: #2b6cb0;
                font-size: 0.95rem;
                line-height: 1.5;
                margin: 0;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                max-height: calc(1.5em * 2);
            }

            .empty-state {
                text-align: center;
                padding: 48px;
                color: #718096;
            }

            .empty-state svg {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
                color: #a0aec0;
            }

            .empty-state p {
                margin: 8px 0;
                font-size: 0.95rem;
            }

            .empty-state p:first-of-type {
                font-weight: 600;
                color: #4a5568;
                font-size: 1.1rem;
            }

            .privacy-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 12px;
                padding: 0 4px;
                width: 100%;
            }

            .privacy-toggle button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 6px;
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #4a5568;
            }

            .privacy-toggle:hover {
                background: rgba(0, 0, 0, 0.05);
            }

            .privacy-toggle.public button {
                background: #2563eb;
                color: white;
            }

            .privacy-toggle.public button:hover {
                background: #1d4ed8;
            }

            .privacy-toggle.private button {
                background: #dc2626;
                color: white;
            }

            .privacy-toggle.private button:hover {
                background: #b91c1c;
            }

            .metadata-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .metadata-content {
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                padding: 32px;
            }

            .metadata-close {
                position: absolute;
                top: 24px;
                right: 24px;
                background: none;
                border: none;
                color: var(--foreground);
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }

            .metadata-close:hover {
                background: rgba(var(--background-rgb), 0.1);
            }

            .metadata-grid {
                display: grid;
                grid-template-columns: 400px 1fr;
                gap: 32px;
                margin-bottom: 32px;
            }

            .metadata-image {
                background: var(--background-secondary, #f3f4f6);
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .metadata-image img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                cursor: pointer;
            }

            .metadata-image img:hover {
                transform: scale(1.02);
            }

            .metadata-details {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .metadata-details h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                color: var(--foreground);
            }

            .metadata-info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }

            .metadata-info-item {
                background: var(--background-secondary, #f3f4f6);
                padding: 12px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .metadata-info-label {
                color: var(--foreground-secondary);
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .metadata-info-value {
                color: var(--foreground);
                font-size: 16px;
                font-weight: 500;
            }

            .metadata-run-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                background: var(--accent);
                color: white;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 500;
                transition: background 0.2s;
                width: fit-content;
            }

            .metadata-run-link:hover {
                background: var(--accent-hover);
            }

            .metadata-section {
                margin-top: 32px;
                background: #ffffff;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .metadata-section h3 {
                margin: 0 0 20px 0;
                font-size: 20px;
                font-weight: 600;
                color: var(--foreground);
            }

            .metadata-node-outputs {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .metadata-node {
                background: var(--background-secondary, #f3f4f6);
                border-radius: 8px;
                padding: 16px;
            }

            .metadata-node-title {
                font-weight: 500;
                color: var(--foreground);
                margin-bottom: 8px;
            }

            .metadata-node-content {
                font-family: monospace;
                white-space: pre-wrap;
                background: var(--background-tertiary, #e5e7eb);
                padding: 12px;
                border-radius: 6px;
                font-size: 14px;
                color: var(--foreground-secondary);
            }

            .metadata-images-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
            }

            .metadata-image-item {
                background: var(--background-secondary, #f3f4f6);
                padding: 12px;
                border-radius: 8px;
                transition: transform 0.2s;
                cursor: pointer;
            }

            .metadata-image-item:hover {
                transform: scale(1.02);
            }

            .metadata-image-item img {
                width: 100%;
                height: auto;
                border-radius: 4px;
            }

            .metadata-collapsible {
                margin-bottom: 16px;
            }

            .metadata-collapsible-header {
                width: 100%;
                padding: 12px;
                background: var(--background-secondary, #f3f4f6);
                border: none;
                border-radius: 8px;
                color: var(--foreground);
                font-weight: 500;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .metadata-collapsible-icon {
                transition: transform 0.2s;
            }

            .metadata-collapsible-content {
                display: none;
                padding: 16px;
                background: var(--background-tertiary, #e5e7eb);
                border-radius: 8px;
                margin-top: 8px;
            }

            .metadata-collapsible-content pre {
                margin: 0;
                white-space: pre-wrap;
                font-family: monospace;
                font-size: 14px;
                color: var(--foreground-secondary);
            }

            .batch-results-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .batch-results-panel {
                background: var(--background);
                border-radius: 20px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .batch-results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 32px;
                border-bottom: 1px solid var(--border-color);
                background: var(--background);
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .batch-results-content {
                padding: 32px;
                overflow-y: auto;
                flex: 1;
            }

            .batch-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
                margin: 0;
            }

            .batch-result-item {
                background: var(--background);
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
            }

            .batch-result-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                border-color: var(--accent-color);
            }

            .batch-result-item.success {
                border-color: var(--success-color);
            }

            .batch-result-item.error {
                border-color: var(--error-color);
            }

            .batch-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 32px;
            }

            .batch-panel {
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                width: 90%;
                max-width: 1000px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .batch-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 32px;
                border-bottom: 1px solid #e5e7eb;
                background: #ffffff;
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .batch-title-section {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .batch-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .batch-title svg {
                width: 24px;
                height: 24px;
                color: #6366f1;
            }

            .batch-close-button {
                position: absolute;
                top: 20px;
                right: 20px;
                background: transparent;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .batch-close-button svg {
                width: 20px;
                height: 20px;
            }

            .batch-close-button:hover {
                background: #f3f4f6;
                color: #4b5563;
            }

            .batch-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .batch-control-button {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 6px;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .batch-control-button svg {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }

            .batch-control-button span {
                line-height: 1;
            }

            .batch-control-button:hover {
                background: #f5f5ff;
                border-color: #6366f1;
                color: #6366f1;
            }

            .batch-input-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #ffffff;
                border-radius: 12px;
                padding: 24px;
                border: 1px solid #e5e7eb;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .batch-input-row {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 16px;
                padding: 16px;
                border-radius: 12px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                transition: all 0.2s ease;
            }

            .batch-input-row:hover {
                border-color: #6366f1;
                background: #ffffff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .batch-input-fields {
                display: flex;
                flex-direction: row;
                gap: 12px;
                flex: 1;
            }

            .batch-input {
                flex: 1;
                min-width: 0;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                background: #ffffff;
                color: #1f2937;
                font-size: 0.95rem;
                line-height: 1.4;
                transition: all 0.2s ease;
            }

            .batch-input:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            }

            .batch-input::placeholder {
                color: #9ca3af;
            }

            .batch-row-actions {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-right: 4px;
            }

            .batch-row-action-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                padding: 0;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background: #ffffff;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .batch-row-action-button svg {
                width: 16px;
                height: 16px;
            }

            .batch-row-action-button:hover {
                background: #f3f4f6;
                border-color: #6366f1;
                color: #6366f1;
            }

            .batch-row-action-button.delete:hover {
                background: #fee2e2;
                border-color: #ef4444;
                color: #dc2626;
            }

            .batch-generate-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 24px;
                padding: 14px 28px;
                background: linear-gradient(180deg, #ff5733 0%, #c70039 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 0.5px;
            }

            .batch-generate-button:hover {
                background: linear-gradient(180deg, #c70039 0%, #900c3f 100%);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                transform: translateY(-2px);
            }

            .batch-generate-button:active {
                transform: translateY(0px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            }

            .batch-generate-button:disabled {
                background: #e5e7eb;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .batch-generate-button:disabled {
                background: #e5e7eb;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .batch-generate-button.processing {
                background: #818cf8;
            }

            .batch-generate-button.success {
                background: #10b981;
            }

            .batch-generate-button.error {
                background: #ef4444;
            }

            /* Action Buttons */
            .action-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--foreground);
            }

            .action-button svg {
                width: 20px;
                height: 20px;
            }

            .action-button:hover {
                background: var(--background-secondary);
                border-color: var(--accent-color);
            }

            .action-button.primary {
                background: var(--accent-color);
                color: white;
                border: none;
            }

            .action-button.primary:hover {
                background: var(--accent-color-hover);
                transform: translateY(-1px);
            }

            /* Header Actions */
            .header-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .private-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 8px 16px;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--foreground);
            }

            .private-toggle svg {
                width: 20px;
                height: 20px;
            }

            .private-toggle:hover {
                background: var(--background-secondary);
                border-color: var(--accent-color);
            }

            .private-toggle.active {
                background: var(--accent-color);
                color: white;
                border: none;
            }

            /* Add Row Button */
            .add-row-button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 16px;
                border-radius: 16px;
                font-size: 1.1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                justify-content: center;
                margin-top: 16px;
            }

            .add-row-button svg {
                width: 24px;
                height: 24px;
            }

            .add-row-button:hover {
                border-color: var(--accent-color);
                color: var(--accent-color);
                background: var(--background-secondary);
            }

            .input-section {
                margin-bottom: 24px;
            }

            .input-label {
                display: block;
                font-size: 1rem;
                font-weight: 600;
                color: var(--foreground);
                margin-bottom: 12px;
            }

            .input-field {
                display: flex;
                align-items: center;
                gap: 16px;
                background: var(--background);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 12px 16px;
                transition: all 0.2s ease;
            }

            .input-field:hover {
                border-color: var(--accent-color);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .input-fields-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            .history-input {
                width: 100%;
                background: transparent;
                border: none;
                color: var(--foreground);
                font-size: 1rem;
                padding: 8px;
                border-radius: 8px;
            }

            .history-input:focus {
                outline: none;
                background: var(--background-secondary);
            }

            .history-input::placeholder {
                color: var(--foreground-secondary);
                opacity: 0.7;
            }

            .batch-row-actions button {
                padding: 8px;
                border-radius: 8px;
                color: var(--foreground-secondary);
                transition: all 0.2s ease;
            }

            .batch-row-actions button:hover {
                background: var(--background-secondary);
                color: var(--foreground);
            }

            .add-row-button {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 16px;
                background: transparent;
                border: 2px dashed var(--border-color);
                border-radius: 16px;
                color: var(--foreground-secondary);
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-top: 24px;
            }

            .add-row-button:hover {
                border-color: var(--accent-color);
                color: var(--accent-color);
                background: var(--background-secondary);
            }

            .batch-controls {
                margin-top: 32px;
                padding: 24px;
                background: var(--background-secondary);
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 24px;
            }

            .batch-generate-button {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                margin-top: 16px;
                width: 100%;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 0.5px;
            }

            .batch-generate-button:hover {
                background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
                transform: translateY(-2px);
            }

            .batch-generate-button:active {
                transform: translateY(0px);
                box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
            }

            .batch-generate-button:disabled {
                background: #e5e7eb;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .batch-results-container {
                padding: 2rem;
                background: white;
                border-radius: 12px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .batch-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            .batch-result-item {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                border: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
            }
            .result-image-wrapper {
                position: relative;
                padding-top: 100%;
                background: #f3f4f6;
                overflow: hidden;
            }
            .result-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            .result-image:hover {
                transform: scale(1.05);
            }
            .result-details {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .result-prompt {
                font-size: 0.875rem;
                color: #1f2937;
                font-weight: 500;
                line-height: 1.25rem;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }
            .result-prompt:hover {
                -webkit-line-clamp: unset;
            }
            .result-metadata {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.75rem;
                color: #6b7280;
            }
            .final-image-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                padding: 10px;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            }

            .final-image-popup .popup-content {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .final-image-popup img {
                width: 100%;
                height: auto;
                border-radius: 4px;
            }

            .final-image-popup .open-new-tab {
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }

            .final-image-popup .open-new-tab:hover {
                background: #0056b3;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            /* Bug Report Form Styles */
            .glif-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
            }

            .glif-modal-content {
                background: #ffffff;
                padding: 24px;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            }

            .glif-close-button {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                cursor: pointer;
                color: #6b7280;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.2s;
                line-height: 0;
            }

            .glif-close-button:hover {
                background: #f3f4f6;
                color: #1f2937;
            }

            .glif-modal-title {
                margin: 0 0 20px 0;
                font-size: 20px;
                font-weight: 600;
                color: #1f2937;
            }

            .glif-type-container {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }

            .glif-type-button {
                flex: 1;
                padding: 10px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                background: #ffffff;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #6b7280;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            .glif-type-button:hover {
                border-color: #3b82f6;
                color: #3b82f6;
                background: #f3f4f6;
            }

            .glif-type-button.active {
                border-color: #3b82f6;
                color: #3b82f6;
                background: #eff6ff;
            }

            .glif-input-container {
                margin-bottom: 16px;
            }

            .glif-input-label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #374151;
                font-size: 14px;
            }

            .glif-input {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s;
                background: #f9fafb;
                color: #1f2937;
            }

            .glif-textarea {
                height: 120px;
                resize: vertical;
                line-height: 1.5;
            }

            .glif-input:focus {
                outline: none;
                border-color: #3b82f6;
                background: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .glif-submit-button {
                width: 100%;
                padding: 10px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                margin-top: 8px;
            }

            .glif-submit-button:hover {
                background: #2563eb;
            }

            .glif-submit-button:disabled {
                background: #93c5fd;
                cursor: not-allowed;
            }

            /* Toast Notification Styles */
            .glif-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                color: white;
                z-index: 10001;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease-out;
            }

            .glif-toast.success {
                background: #059669;
            }

            .glif-toast.error {
                background: #dc2626;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            .glif-tools-menu-item svg,
            .bug-report-type-button svg {
                width: 20px;
                height: 20px;
                min-width: 20px;
                flex-shrink: 0;
            }

            /* Bug Report Panel Specific Styles */
            [data-glif-dark-mode="true"] .glif-modal-content {
                background-color: #1E1E1E !important;
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-modal-title {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-type-button {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
                border: 1px solid #3E3E3E !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .glif-type-button:hover {
                background-color: #33363C !important;
                border-color: #4F46E5 !important;
            }

            [data-glif-dark-mode="true"] .glif-type-button.active {
                background-color: #4F46E5 !important;
                border-color: #4F46E5 !important;
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-input-label {
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] .glif-input,
            [data-glif-dark-mode="true"] .glif-textarea {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] .glif-input:focus,
            [data-glif-dark-mode="true"] .glif-textarea:focus {
                border-color: #4F46E5 !important;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
            }

            [data-glif-dark-mode="true"] .glif-input::placeholder,
            [data-glif-dark-mode="true"] .glif-textarea::placeholder {
                color: #6B7280 !important;
            }

            [data-glif-dark-mode="true"] .glif-submit-button {
                background-color: #4F46E5 !important;
                color: #FFFFFF !important;
                border: none !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .glif-submit-button:hover {
                background-color: #4338CA !important;
            }

            [data-glif-dark-mode="true"] .glif-close-button {
                color: #6B7280 !important;
            }

            [data-glif-dark-mode="true"] .glif-close-button:hover {
                color: #FFFFFF !important;
            }

            /* Batch Generator Specific Styles */
            [data-glif-dark-mode="true"] #batchInputContainer .batch-input-row {
                background-color: #2A2A2A !important;
                border: 1px solid #3E3E3E !important;
                color: #FFFFFF !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-input-row:hover {
                background-color: #33363C !important;
                border-color: #4F46E5 !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-input {
                background-color: #2A2A2A !important;
                color: #FFFFFF !important;
                border: 1px solid #3E3E3E !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-input:focus {
                border-color: #4F46E5 !important;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2) !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-input::placeholder {
                color: #6B7280 !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-row-action-button {
                color: #6B7280 !important;
            }

            [data-glif-dark-mode="true"] #batchInputContainer .batch-row-action-button:hover {
                color: #FFFFFF !important;
            }

            /* History Panel Dark Mode Styles */
            [data-glif-dark-mode="true"] .history-filters {
                background-color: #1A1B1E !important;
                border-bottom: 1px solid #2D2E32 !important;
                padding: 16px !important;
            }

            [data-glif-dark-mode="true"] .history-filters input {
                background-color: #25262B !important;
                color: #E6E8EC !important;
                border: 1px solid #383A3F !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .history-filters input:focus {
                border-color: #4F46E5 !important;
                background-color: #2C2D32 !important;
                box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25) !important;
            }

            [data-glif-dark-mode="true"] .history-filters input::placeholder {
                color: #9095A0 !important;
            }

            [data-glif-dark-mode="true"] .history-item > div {
                background-color: #25262B !important;
                color: #E6E8EC !important;
                border: 1px solid #383A3F !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .history-item > div:hover {
                background-color: #2C2D32 !important;
                border-color: #4F46E5 !important;
                transform: translateY(-1px) !important;
            }

            [data-glif-dark-mode="true"] .history-item-content {
                color: #E6E8EC !important;
            }

            [data-glif-dark-mode="true"] .history-item-metadata {
                color: #9095A0 !important;
            }

            [data-glif-dark-mode="true"] .history-item-prompt {
                color: #E6E8EC !important;
                font-weight: 500 !important;
            }

            [data-glif-dark-mode="true"] .history-item-timestamp {
                color: #9095A0 !important;
                font-size: 0.9em !important;
            }

            [data-glif-dark-mode="true"] .history-item-actions {
                background-color: #2C2D32 !important;
                border-top: 1px solid #383A3F !important;
                padding: 8px !important;
            }

            [data-glif-dark-mode="true"] .history-item-actions button {
                color: #9095A0 !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .history-item-actions button:hover {
                color: #E6E8EC !important;
                background-color: #383A3F !important;
            }

            /* Metadata Panel Dark Mode */
            [data-glif-dark-mode="true"] .metadata-grid {
                background-color: #25262B !important;
                border: 1px solid #383A3F !important;
                border-radius: 8px !important;
            }

            [data-glif-dark-mode="true"] .metadata-details {
                background-color: #2C2D32 !important;
                border-left: 1px solid #383A3F !important;
            }

            [data-glif-dark-mode="true"] .metadata-details h2 {
                color: #E6E8EC !important;
                font-weight: 600 !important;
            }

            [data-glif-dark-mode="true"] .metadata-info-grid {
                gap: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-info-item {
                background-color: #1A1B1E !important;
                border: 1px solid #2D2E32 !important;
                border-radius: 6px !important;
                padding: 12px !important;
            }

            [data-glif-dark-mode="true"] .metadata-info-label {
                color: #9095A0 !important;
                font-weight: 500 !important;
            }

            [data-glif-dark-mode="true"] .metadata-info-value {
                color: #E6E8EC !important;
                font-family: 'Roboto Mono', monospace !important;
            }

            [data-glif-dark-mode="true"] .metadata-section {
                border-top: 1px solid #383A3F !important;
                padding-top: 24px !important;
                margin-top: 24px !important;
            }

            [data-glif-dark-mode="true"] .metadata-section h3 {
                color: #E6E8EC !important;
                font-weight: 600 !important;
                margin-bottom: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible {
                background-color: #25262B !important;
                border: 1px solid #383A3F !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-header {
                background-color: #2C2D32 !important;
                color: #E6E8EC !important;
                padding: 12px 16px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-header:hover {
                background-color: #383A3F !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-content {
                background-color: #1A1B1E !important;
                border-top: 1px solid #2D2E32 !important;
                padding: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-content pre {
                color: #E6E8EC !important;
                font-family: 'Roboto Mono', monospace !important;
                font-size: 0.9em !important;
            }

            /* Batch Input Container Dark Mode */
            [data-glif-dark-mode="true"] .batch-input-container {
                background-color: #1A1B1E !important;
            }

            [data-glif-dark-mode="true"] .batch-content {
                background-color: #1A1B1E !important;
            }

            /* History Item Specific Dark Mode */
            [data-glif-dark-mode="true"] .history-item > div:nth-child(2) > div:nth-child(2) {
                background-color: #25262B !important;
                color: #E6E8EC !important;
            }

            /* Node Outputs Dark Mode */
            [data-glif-dark-mode="true"] .metadata-node-outputs {
                background-color: #1A1B1E !important;
                border-radius: 8px !important;
                padding: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-node {
                background-color: #25262B !important;
                border: 1px solid #383A3F !important;
                border-radius: 6px !important;
                margin-bottom: 12px !important;
            }

            [data-glif-dark-mode="true"] .metadata-node:last-child {
                margin-bottom: 0 !important;
            }

            [data-glif-dark-mode="true"] .metadata-node-title {
                background-color: #2C2D32 !important;
                color: #E6E8EC !important;
                font-weight: 500 !important;
                padding: 8px 12px !important;
                border-bottom: 1px solid #383A3F !important;
                border-radius: 6px 6px 0 0 !important;
            }

            [data-glif-dark-mode="true"] .metadata-node-content {
                color: #E6E8EC !important;
                font-family: 'Roboto Mono', monospace !important;
                font-size: 0.9em !important;
                padding: 12px !important;
                background-color: #1A1B1E !important;
                border-radius: 0 0 6px 6px !important;
                white-space: pre-wrap !important;
            }

            /* Metadata Sections Dark Mode */
            [data-glif-dark-mode="true"] .metadata-section {
                border: 1px solid #2E2E2E !important;
                background-color: #1E1E1E !important;
                padding: 20px !important;
                border-radius: 8px !important;
                margin-top: 24px !important;
            }

            [data-glif-dark-mode="true"] .metadata-section h3 {
                color: #FFFFFF !important;
                margin-bottom: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-node {
                background-color: #25262B !important;
                border: 1px solid #2E2E2E !important;
            }

            [data-glif-dark-mode="true"] .metadata-node-content {
                background-color: #2C2D32 !important;
                color: #E6E8EC !important;
                border: 1px solid #383A3F !important;
            }

            [data-glif-dark-mode="true"] .metadata-image-item {
                background-color: #25262B !important;
                border: 1px solid #2E2E2E !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-header {
                background-color: #25262B !important;
                color: #E6E8EC !important;
                border: 1px solid #2E2E2E !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-content {
                background-color: #2C2D32 !important;
                border: 1px solid #383A3F !important;
            }

            [data-glif-dark-mode="true"] .metadata-collapsible-content pre {
                color: #E6E8EC !important;
            }

            /* Batch Input Container Dark Mode */
            [data-glif-dark-mode="true"] .batch-input-container {
                background-color: #1A1B1E !important;
            }

            [data-glif-dark-mode="true"] .batch-content {
                background-color: #1A1B1E !important;
            }

            /* History Item Specific Dark Mode */
            [data-glif-dark-mode="true"] .history-item > div:nth-child(2) > div:nth-child(2) {
                background-color: #25262B !important;
                color: #E6E8EC !important;
            }

            /* Node Outputs Dark Mode */
            [data-glif-dark-mode="true"] .metadata-node-outputs {
                background-color: #1A1B1E !important;
                border-radius: 8px !important;
                padding: 16px !important;
            }

            [data-glif-dark-mode="true"] .metadata-node {
                background-color: #25262B !important;
                border: 1px solid #383A3F !important;
                border-radius: 6px !important;
                margin-bottom: 12px !important;
            }

            [data-glif-dark-mode="true"] .metadata-node:last-child {
                margin-bottom: 0 !important;
            }

            [data-glif-dark-mode="true"] .metadata-node-title {
                background-color: #2C2D32 !important;
                color: #E6E8EC !important;
                font-weight: 500 !important;
                padding: 8px 12px !important;
                border-bottom: 1px solid #383A3F !important;
                border-radius: 6px 6px 0 0 !important;
            }

            [data-glif-dark-mode="true"] .metadata-node-content {
                color: #E6E8EC !important;
                font-family: 'Roboto Mono', monospace !important;
                font-size: 0.9em !important;
                padding: 12px !important;
                background-color: #1A1B1E !important;
                border-radius: 0 0 6px 6px !important;
                white-space: pre-wrap !important;
            }
        `;
        document.head.appendChild(styleSheet);
    };

    // Create tools dropdown
    const createToolsDropdown = () => {
        const toolsDropdown = document.createElement('div');
        toolsDropdown.className = 'glif-tools-dropdown';

        const toolsButton = document.createElement('button');
        toolsButton.className = 'flex items-center gap-1 text-lg font-bold hover:text-brand-600 active:text-brand-600';
        toolsButton.innerHTML = `<span class="block h-2 w-2"></span>${icons.tools}<span>Tools</span>`;
        toolsDropdown.appendChild(toolsButton);

        const menu = document.createElement('div');
        menu.className = 'glif-tools-menu';

        const createMenuItem = (icon, text, onClick) => {
            const item = document.createElement('div');
            item.className = 'glif-tools-menu-item';
            item.innerHTML = `${icon}<span>${text}</span>`;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                onClick();
                menu.classList.remove('active');
            });
            return item;
        };

        // Add menu items
        menu.appendChild(createMenuItem(icons.history, 'View History', displayHistoryPanel));
        menu.appendChild(createMenuItem(icons.batch, 'Batch Generator', displayBatchPanel));
        menu.appendChild(createMenuItem(icons.bug, 'Report Bug', displayBugReportForm));

        // Create dark mode toggle item with an ID for easy updating
        const darkModeItem = createMenuItem(
            isDarkMode ? icons.sun : icons.moon,
            isDarkMode ? 'Light Mode' : 'Dark Mode',
            toggleDarkMode
        );
        darkModeItem.id = 'dark-mode-toggle';
        menu.appendChild(darkModeItem);

        // Add credits
        const credits = document.createElement('div');
        credits.className = 'glif-tools-credits';
        credits.innerHTML = 'Made by <a href="https://glif.app/@appelsiensam" target="_blank">I12bp8</a> <3';
        menu.appendChild(credits);

        toolsDropdown.appendChild(menu);

        toolsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            menu.classList.remove('active');
        });

        return toolsDropdown;
    };

    // Display bug report form
    function displayBugReportForm() {
        const modal = document.createElement('div');
        modal.className = 'glif-modal';

        const form = document.createElement('div');
        form.className = 'glif-modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'glif-close-button';
        closeButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>`;
        closeButton.addEventListener('click', () => modal.remove());

        const title = document.createElement('h2');
        title.textContent = 'Report Bug / Request Feature';
        title.className = 'glif-modal-title';

        const typeContainer = document.createElement('div');
        typeContainer.className = 'glif-type-container';

        const createTypeButton = (text, type) => {
            const button = document.createElement('button');
            button.innerHTML = `${icons[type]} ${text}`;
            button.dataset.type = type;
            button.className = 'glif-type-button';
            button.addEventListener('click', () => {
                typeContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedType = type;
            });
            return button;
        };

        let selectedType = 'bug';
        const bugButton = createTypeButton('Report Bug', 'bug');
        const featureButton = createTypeButton('Request Feature', 'feature');
        bugButton.classList.add('active');
        typeContainer.appendChild(bugButton);
        typeContainer.appendChild(featureButton);

        const createInput = (label, placeholder, isTextarea = false) => {
            const container = document.createElement('div');
            container.className = 'glif-input-container';

            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            labelEl.className = 'glif-input-label';

            const input = document.createElement(isTextarea ? 'textarea' : 'input');
            input.placeholder = placeholder;
            input.className = `glif-input ${isTextarea ? 'glif-textarea' : ''}`;

            container.appendChild(labelEl);
            container.appendChild(input);
            return { container, input };
        };

        const titleInput = createInput('Title', 'Brief description of the bug/feature');
        const descriptionInput = createInput('Description', 'Detailed explanation...', true);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.className = 'glif-submit-button';

        submitButton.addEventListener('click', async () => {
            const title = titleInput.input.value.trim();
            const description = descriptionInput.input.value.trim();

            if (!title || !description) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = `${icons.loading} Submitting...`;

            try {
                const response = await fetch('https://discord.com/api/webhooks/1313174668378771568/MESzfXqFIZVhUQKK70EavPTDTV6iW8ZuW6yPlAUi1ugPYU7tZm9-pThCZy9rF-VPwQeY', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        embeds: [{
                            title: `${selectedType === 'bug' ? '🐛 Bug Report' : '✨ Feature Request'}: ${title}`,
                            description: description,
                            color: selectedType === 'bug' ? 15548997 : 5793266,
                            footer: {
                                text: `Submitted via GLIF Tools v${GM_info.script.version}`
                            },
                            timestamp: new Date().toISOString()
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                showToast('Submitted successfully!', 'success');
                setTimeout(() => modal.remove(), 1500);
            } catch (error) {
                console.error('Error submitting form:', error);
                showToast('Failed to submit. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit';
            }
        });

        form.append(closeButton, title, typeContainer, titleInput.container, descriptionInput.container, submitButton);
        modal.appendChild(form);
        document.body.appendChild(modal);
    }

    // Filter images function
    const filterImages = (filter) => {
        const grid = document.querySelector('.history-grid');
        if (!grid) return;

        Array.from(grid.children).forEach(item => {
            if (item.classList.contains('empty-state')) return;

            const isPrivate = item.dataset.private === 'true';
            item.style.display =
                filter === 'all' ||
                (filter === 'private' && isPrivate) ||
                (filter === 'public' && !isPrivate)
                    ? 'block'
                    : 'none';
        });
    };

    // Process stream response to save images
    async function processStreamResponse(response, isPrivate, inputs) {
        const reader = response.body.getReader();
        let finalImageUrl = null;
        let nodeOutputs = {};
        let graphExecutionState = null;
        let spellRun = null;
        let rawResponse = [];
        let allImageUrls = new Set();
        let lastNodeWithImage = null;
        let spellDetails = null;
        let nodeHistory = [];

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6);
                        if (jsonStr.trim()) {
                            try {
                                const data = JSON.parse(jsonStr);
                                rawResponse.push(data);

                                if (data.type === 'image' && data.url) {
                                    finalImageUrl = data.url;
                                }

                                // Extract spell details
                                if (data.spellRun && !spellDetails) {
                                    spellDetails = {
                                        spellId: data.spellRun.spellId,
                                        spellName: data.spellRun.spell?.name,
                                        startedAt: data.spellRun.startedAt,
                                        completedAt: data.spellRun.completedAt,
                                        totalDuration: data.spellRun.totalDuration,
                                        outputImageWidth: data.spellRun.outputImageWidth,
                                        outputImageHeight: data.spellRun.outputImageHeight,
                                        inputs: data.spellRun.inputs
                                    };
                                }

                                if (data.graphExecutionState) {
                                    graphExecutionState = data.graphExecutionState;

                                    Object.entries(data.graphExecutionState.nodes).forEach(([nodeName, nodeData]) => {
                                        if (nodeData.output) {
                                            nodeOutputs[nodeName] = nodeData.output;

                                            if (nodeData.output.type === 'IMAGE') {
                                                allImageUrls.add(nodeData.output.value);
                                                lastNodeWithImage = nodeData.output.value;

                                                const isOutputNode = !Object.values(data.graphExecutionState.nodes).some(node =>
                                                    node.inputs && Object.values(node.inputs).some(input =>
                                                        input.connectionId && input.connectionId.startsWith(nodeName)
                                                    )
                                                );

                                                if (isOutputNode) {
                                                    finalImageUrl = nodeData.output.value;
                                                }
                                            }
                                        }
                                    });
                                }
                            } catch (e) {
                                console.error('Error parsing JSON:', e);
                            }
                        }
                    }
                }
            }

            const displayImageUrl = finalImageUrl || lastNodeWithImage || Array.from(allImageUrls).pop();

            if (!displayImageUrl) {
                throw new Error('No image generated');
            }

            // Only show popup for private runs from the original form
            if (isPrivate && inputs.isFromForm) {
                showImagePopup(displayImageUrl);
            }

            // Get prompt from inputs object - now using the 'value' property
            let prompt = 'No prompt available';
            if (inputs && inputs.value) {
                prompt = inputs.value;
            }

            const historyEntry = {
                url: displayImageUrl,
                timestamp: new Date().toISOString(),
                isPrivate: isPrivate,
                prompt: prompt,
                nodeOutputs,
                graphExecutionState,
                spellDetails,
                nodeHistory,
                rawResponse: rawResponse.length > 0 ? rawResponse : undefined,
                allImageUrls: Array.from(allImageUrls)
            };

            console.log('Saving history entry:', historyEntry);
            saveToHistory(historyEntry);
        } catch (error) {
            console.error('Error processing stream:', error);
        }
    }

    // Create history item
    const createHistoryItem = (entry) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.dataset.private = entry.isPrivate;

        const imageContainer = document.createElement('div');
        imageContainer.className = 'history-item-image';
        imageContainer.innerHTML = `<img src="${entry.url}" alt="Generated Image" loading="lazy">`;

        const info = document.createElement('div');
        info.className = 'history-item-info';

        const metadata = document.createElement('div');
        metadata.className = 'history-metadata';

        const timestamp = document.createElement('div');
        timestamp.className = 'history-timestamp';
        timestamp.innerHTML = `${icons.time} ${new Date(entry.timestamp).toLocaleString()}`;

        const status = document.createElement('div');
        status.className = `history-status ${entry.isPrivate ? 'private' : 'public'}`;
        status.innerHTML = entry.isPrivate ? `${icons.private} Private` : `${icons.globe} Public`;

        metadata.appendChild(timestamp);
        metadata.appendChild(status);

        const promptContainer = document.createElement('div');
        promptContainer.className = 'history-item-prompt-container';

        const prompt = document.createElement('div');
        prompt.className = 'history-item-prompt';
        prompt.textContent = entry.prompt || 'No prompt available';

        promptContainer.appendChild(prompt);

        info.appendChild(metadata);
        info.appendChild(promptContainer);

        item.appendChild(imageContainer);
        item.appendChild(info);

        item.addEventListener('click', () => displayMetadata(entry));

        return item;
    };

    // Display metadata overlay
    const displayMetadata = (entry) => {
        const overlay = document.createElement('div');
        overlay.className = 'metadata-overlay';
        overlay.innerHTML = `
            <div class="metadata-content">
                <button class="metadata-close">${icons.trash}</button>
                <div class="metadata-grid">
                    <div class="metadata-image">
                        <img src="${entry.url}" alt="Generated Image">
                    </div>
                    <div class="metadata-details">
                        <h2>${entry.spellName || 'Image Details'}</h2>
                        <div class="metadata-info-grid">
                            ${[
                                { icon: '🪄', label: 'Spell ID', value: entry.spellId || 'N/A' },
                                { icon: '🔄', label: 'Run ID', value: entry.runId || 'N/A' },
                                { icon: '🕒', label: 'Created', value: new Date(entry.timestamp).toLocaleString() },
                                { icon: entry.isPrivate ? '🔒' : '🌐', label: 'Privacy', value: entry.isPrivate ? 'Private' : 'Public' },
                                { icon: '💻', label: 'Client', value: entry.clientType || 'N/A' },
                                { icon: '👤', label: 'User', value: entry.user?.name || 'N/A' }
                            ].map(info => `
                                <div class="metadata-info-item">
                                    <div class="metadata-info-label">
                                        <span class="metadata-info-icon">${info.icon}</span>
                                        ${info.label}
                                    </div>
                                    <div class="metadata-info-value">${info.value}</div>
                                </div>
                            `).join('')}
                        </div>
                        ${entry.runId && entry.user?.name ? `
                            <a href="https://glif.app/@${entry.user.name}/runs/${entry.runId}"
                               target="_blank"
                               class="metadata-run-link">
                                View Run Details ${icons.search}
                            </a>
                        ` : ''}
                    </div>
                </div>
                ${entry.nodeOutputs && Object.keys(entry.nodeOutputs).length > 0 ? `
                    <div class="metadata-section">
                        <h3>🔧 Node Outputs</h3>
                        <div class="metadata-node-outputs">
                            ${Object.entries(entry.nodeOutputs).map(([key, value]) => `
                                <div class="metadata-node">
                                    <div class="metadata-node-title">${key}</div>
                                    <div class="metadata-node-content">${JSON.stringify(value, null, 2)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${entry.allImageUrls && entry.allImageUrls.length > 0 ? `
                    <div class="metadata-section">
                        <h3>🖼️ All Generated Images</h3>
                        <div class="metadata-images-grid">
                            ${entry.allImageUrls.map(url => `
                                <div class="metadata-image-item">
                                    <img src="${url}" alt="Generated Image" onclick="window.open('${url}', '_blank')">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${(entry.graphExecutionState || entry.rawResponse) ? `
                    <div class="metadata-section">
                        <h3>⚙️ Technical Details</h3>
                        ${entry.graphExecutionState ? `
                            <div class="metadata-collapsible">
                                <button class="metadata-collapsible-header">
                                    Graph Execution State
                                    <span class="metadata-collapsible-icon">▼</span>
                                </button>
                                <div class="metadata-collapsible-content">
                                    <pre>${JSON.stringify(entry.graphExecutionState, null, 2)}</pre>
                                </div>
                            </div>
                        ` : ''}
                        ${entry.rawResponse ? `
                            <div class="metadata-collapsible">
                                <button class="metadata-collapsible-header">
                                    Raw Response Data
                                    <span class="metadata-collapsible-icon">▼</span>
                                </button>
                                <div class="metadata-collapsible-content">
                                    <pre>${JSON.stringify(entry.rawResponse, null, 2)}</pre>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Add click handlers for collapsible sections
        overlay.querySelectorAll('.metadata-collapsible-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.metadata-collapsible-icon');
                const isOpen = content.style.display === 'block';
                content.style.display = isOpen ? 'none' : 'block';
                icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close button handler
        overlay.querySelector('.metadata-close').addEventListener('click', () => {
            overlay.remove();
        });

        document.body.appendChild(overlay);
    };

    // Display history panel
    const displayHistoryPanel = () => {
        const existingPanel = document.getElementById('glifHistoryPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'history-overlay';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        const panel = document.createElement('div');
        panel.className = 'history-panel';
        panel.id = 'glifHistoryPanel';

        const header = document.createElement('div');
        header.className = 'history-header';

        const titleSection = document.createElement('div');
        titleSection.className = 'history-panel-title-section';

        const title = document.createElement('h2');
        title.className = 'history-panel-title';
        title.innerHTML = `${icons.history}<span>Image History</span>`;

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-history-button';
        clearButton.innerHTML = `${icons.trash}<span>Clear All</span>`;
        clearButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete all saved images? This action cannot be undone.')) {
                GM_setValue('imageHistory', []);
                overlay.remove();
                displayHistoryPanel();
            }
        });

        titleSection.appendChild(title);
        titleSection.appendChild(clearButton);

        const controls = document.createElement('div');
        controls.className = 'history-controls';

        const filters = document.createElement('div');
        filters.className = 'history-filters';

        ['All', 'Private', 'Public'].forEach(filterText => {
            const button = document.createElement('button');
            button.className = `filter-button${filterText === 'All' ? ' active' : ''}`;
            button.textContent = filterText;
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                filters.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterImages(filterText.toLowerCase());
            });
            filters.appendChild(button);
        });

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';

        const searchIcon = document.createElement('div');
        searchIcon.className = 'search-icon';
        searchIcon.innerHTML = icons.search;

        const searchInput = document.createElement('input');
        searchInput.className = 'search-input';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search prompts...';
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.history-item');
            items.forEach(item => {
                const prompt = item.querySelector('.history-item-prompt')?.textContent.toLowerCase() || '';
                item.style.display = prompt.includes(searchTerm) ? 'block' : 'none';
            });
        });

        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchInput);

        controls.appendChild(filters);
        controls.appendChild(searchContainer);

        header.appendChild(titleSection);
        header.appendChild(controls);

        const content = document.createElement('div');
        content.className = 'history-content';

        const history = GM_getValue('imageHistory', []);

        if (history.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                ${icons.image}
                <p>No images yet</p>
                <p>Images will appear here as you generate them</p>
            `;
            content.appendChild(emptyState);
        } else {
            const grid = document.createElement('div');
            grid.className = 'history-grid';
            history.forEach(entry => {
                grid.appendChild(createHistoryItem(entry));
            });
            content.appendChild(grid);
        }

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    };

    // Save to history
    const saveToHistory = (entry) => {
        const history = GM_getValue('imageHistory', []);
        const isDuplicate = history.some(item =>
            item.url === entry.url &&
            item.timestamp === entry.timestamp
        );

        if (!isDuplicate) {
            history.unshift(entry);
            if (history.length > 100) history.pop();
            GM_setValue('imageHistory', history);
        }
    };

    // Replace fetch
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (...args) => {
        const [url, options] = args;

        if (url.includes('/api/run-glif')) {
            const modifiedOptions = {...options};
            const body = JSON.parse(modifiedOptions.body);
            const isPrivate = GM_getValue('isPrivate', false);

            // Set private/public mode
            body.glifRunIsPublic = !isPrivate;
            modifiedOptions.body = JSON.stringify(body);

            const response = await originalFetch(url, modifiedOptions);
            const clonedResponse = response.clone();

            // Always use the first value from inputs object
            const firstValue = Object.values(body.inputs)[0];

            // Create a simple object with the first value
            const inputsObj = {
                value: firstValue,
                isFromForm: true  // Flag to indicate this is from the original form
            };

            // Process the response stream
            processStreamResponse(clonedResponse, isPrivate, inputsObj).catch(err => {
                console.error('Error processing response:', err);
            });

            return response;
        }

        return originalFetch(...args);
    };

    // Get workflow inputs
    function getWorkflowInputs() {
        const form = document.querySelector('form');
        if (!form) return [];

        const inputs = [];
        form.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
            if (input.name && !input.name.startsWith('__') && input.name !== 'spellId' && input.name !== 'version') {
                // Find the label for this input
                let label = '';
                const labelElement = form.querySelector(`label[for="${input.id}"]`);
                if (labelElement) {
                    label = labelElement.textContent.trim();
                } else {
                    // Try to find a label that contains this input
                    const parentLabel = input.closest('label');
                    if (parentLabel) {
                        label = parentLabel.textContent.trim();
                    }
                }

                inputs.push({
                    name: input.name,
                    type: input.type,
                    label: label || input.name, // Use label if found, otherwise use name
                    placeholder: label || input.name
                });
            }
        });
        return inputs;
    }

    async function generateImage(input) {
        const isPrivate = GM_getValue('isPrivate', true);

        // Get spell ID from URL or input
        const spellId = input.id || window.location.pathname.split('/').pop();

        const requestBody = {
            id: spellId,
            version: "live",
            inputs: input,
            glifRunIsPublic: !isPrivate
        };

        const response = await fetch('https://glif.app/api/run-glif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${await response.text()}`);
        }

        const reader = response.body.getReader();
        let finalImageUrl = null;
        let nodeOutputs = {};
        let graphExecutionState = null;
        let spellRun = null;
        let rawResponse = [];
        let allImageUrls = new Set();
        let lastNodeWithImage = null;

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6);
                    if (jsonStr.trim()) {
                        try {
                            const data = JSON.parse(jsonStr);
                            rawResponse.push(data);

                            if (data.type === 'image' && data.url) {
                                finalImageUrl = data.url;
                            }

                            if (data.spellRun) {
                                spellRun = data.spellRun;
                            }

                            if (data.graphExecutionState) {
                                graphExecutionState = data.graphExecutionState;

                                Object.entries(data.graphExecutionState.nodes).forEach(([nodeName, nodeData]) => {
                                    if (nodeData.output) {
                                        nodeOutputs[nodeName] = nodeData.output;

                                        if (nodeData.output.type === 'IMAGE') {
                                            allImageUrls.add(nodeData.output.value);
                                            lastNodeWithImage = nodeData.output.value;

                                            const isOutputNode = !Object.values(data.graphExecutionState.nodes).some(node =>
                                                node.inputs && Object.values(node.inputs).some(input =>
                                                    input.connectionId && input.connectionId.startsWith(nodeName)
                                                )
                                            );

                                            if (isOutputNode) {
                                                finalImageUrl = nodeData.output.value;
                                            }
                                        }
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing stream data:', e);
                        }
                    }
                }
            }
        }

        const displayImageUrl = finalImageUrl || lastNodeWithImage || Array.from(allImageUrls).pop();

        if (!displayImageUrl) {
            throw new Error('No image generated');
        }

        // Only show popup for private runs from the original form
        if (isPrivate && input.isFromForm) {
            showImagePopup(displayImageUrl);
        }

        // Get prompt from inputs
        const prompt = Object.values(input)[0] || 'No prompt available';

        const historyEntry = {
            url: displayImageUrl,
            timestamp: new Date().toISOString(),
            isPrivate: isPrivate,
            prompt: prompt,
            spellId: spellRun?.spellId,
            spellName: spellRun?.spell?.name,
            runId: spellRun?.id,
            inputs: input,
            user: spellRun?.user,
            clientType: spellRun?.clientType,
            nodeOutputs,
            graphExecutionState,
            rawResponse: rawResponse.length > 0 ? rawResponse : undefined,
            allImageUrls: Array.from(allImageUrls)
        };

        saveToHistory(historyEntry);
        return { imageUrl: displayImageUrl, isPrivate };
    }

    // Display batch results
    function displayBatchResults(results) {
        const batchPanel = document.querySelector('.batch-overlay');
        if (!batchPanel) return;

        const content = batchPanel.querySelector('.batch-content');
        if (!content) return;

        content.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'batch-results-container';

        const header = document.createElement('div');
        header.className = 'batch-results-header';
        header.innerHTML = `
            <div class="batch-results-title">
                ${icons.batch}<span>Batch Results</span>
            </div>
            <div class="batch-results-stats">
                <span class="success-count">${results.filter(r => r.status === 'success').length} Successful</span>
                <span class="separator">•</span>
                <span class="failed-count">${results.filter(r => r.status === 'error').length} Failed</span>
            </div>
        `;
        container.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'batch-results-grid';

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = `batch-result-item ${result.status}`;

            // Extract prompt from inputs object
            let prompt = 'No prompt available';
            if (result.inputs && typeof result.inputs === 'object') {
                const firstValue = Object.values(result.inputs)[0];
                if (firstValue) {
                    prompt = firstValue;
                }
            }

            if (result.status === 'success') {
                item.innerHTML = `
                    <div class="result-image-wrapper">
                        <img src="${result.finalOutput}" class="result-image" onclick="window.open('${result.finalOutput}', '_blank')">
                    </div>
                    <div class="result-details">
                        <div class="result-prompt">${prompt}</div>
                        <div class="result-metadata">
                            <span class="result-timestamp">${new Date().toLocaleString()}</span>
                            <span class="result-privacy">${result.isPrivate ? 'Private' : 'Public'}</span>
                        </div>
                    </div>
                `;
            } else {
                item.innerHTML = `
                    <div class="error-container">
                        ${icons.error}
                        <div class="error-message">${result.error}</div>
                    </div>
                    <div class="result-details">
                        <div class="result-prompt">${prompt}</div>
                    </div>
                `;
            }

            grid.appendChild(item);
        });

        container.appendChild(grid);

        const actions = document.createElement('div');
        actions.className = 'batch-actions';
        actions.innerHTML = `
            <button class="batch-action-button new-batch">Start New Batch</button>
        `;

        const newBatchBtn = actions.querySelector('.new-batch');
        newBatchBtn.addEventListener('click', () => displayBatchPanel());

        container.appendChild(actions);
        content.appendChild(container);

        // Update styles
        const style = document.createElement('style');
        style.textContent = `
            .batch-results-container {
                padding: 2rem;
                background: white;
                border-radius: 12px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .batch-results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e5e7eb;
            }
            .batch-results-title {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 1.25rem;
                font-weight: 600;
                color: #1f2937;
            }
            .batch-results-stats {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.875rem;
            }
            .success-count { color: #059669; }
            .failed-count { color: #dc2626; }
            .separator { color: #d1d5db; }
            .batch-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                margin: 0;
            }
            .batch-result-item {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s ease;
                cursor: pointer;
                border: 1px solid #e5e7eb;
                display: flex;
                flex-direction: column;
            }
            .batch-result-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                border-color: var(--accent-color);
            }
            .batch-result-item.success {
                border-color: var(--success-color);
            }
            .batch-result-item.error {
                border-color: var(--error-color);
            }
            .result-image-wrapper {
                position: relative;
                padding-top: 100%;
                background: #f3f4f6;
                overflow: hidden;
            }
            .result-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }
            .result-image:hover {
                transform: scale(1.05);
            }
            .result-details {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .result-prompt {
                font-size: 0.875rem;
                color: #1f2937;
                font-weight: 500;
                line-height: 1.25rem;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }
            .result-prompt:hover {
                -webkit-line-clamp: unset;
            }
            .result-metadata {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.75rem;
                color: #6b7280;
            }
            .error-container {
                padding: 2rem;
                text-align: center;
                background: #fef2f2;
                color: #dc2626;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }
            .error-message {
                font-size: 0.875rem;
                line-height: 1.4;
            }
            .batch-actions {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 2rem;
            }
            .batch-action-button {
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid var(--border-color);
                background: var(--background);
                color: var(--foreground);
            }
            .batch-action-button.new-batch {
                background: #6366f1;
                color: white;
            }
            .batch-action-button.new-batch:hover {
                background: #4f46e5;
            }
        `;
        document.head.appendChild(style);
    }

    // Display batch panel
    function displayBatchPanel() {
        const existingPanel = document.querySelector('.batch-overlay');
        if (existingPanel) {
            existingPanel.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'batch-overlay';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        const panel = document.createElement('div');
        panel.className = 'batch-panel';

        const header = document.createElement('div');
        header.className = 'batch-header';

        const titleSection = document.createElement('div');
        titleSection.className = 'batch-title-section';

        const title = document.createElement('h2');
        title.className = 'batch-title';
        title.innerHTML = `${icons.batch}<span>Batch Generator</span>`;

        const closeButton = document.createElement('button');
        closeButton.className = 'batch-close-button';
        closeButton.innerHTML = icons.close;
        closeButton.addEventListener('click', () => overlay.remove());

        titleSection.appendChild(title);
        titleSection.appendChild(closeButton);

        const controls = document.createElement('div');
        controls.className = 'batch-controls';

        const addButton = document.createElement('button');
        addButton.className = 'batch-control-button';
        addButton.innerHTML = `${icons.add}<span>Add Row</span>`;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'batchPrivateToggle';
        toggleButton.className = 'batch-control-button';

        const updateToggleState = (isPrivate) => {
            toggleButton.innerHTML = isPrivate ?
                `${icons.lock}<span>Private</span>` :
                `${icons.globe}<span>Public</span>`;
            toggleButton.classList.toggle('private', isPrivate);
        };

        const initialState = GM_getValue('isPrivate', true);
        updateToggleState(initialState);

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !GM_getValue('isPrivate', false);
            GM_setValue('isPrivate', newState);
            updateToggleState(newState);
        });

        controls.appendChild(addButton);
        controls.appendChild(toggleButton);

        header.appendChild(titleSection);
        header.appendChild(controls);

        const content = document.createElement('div');
        content.className = 'batch-content';

        const inputContainer = document.createElement('div');
        inputContainer.id = 'batchInputContainer';
        inputContainer.className = 'batch-input-container';

        // Create input fields
        function createInputRow(values = null) {
            const row = document.createElement('div');
            row.className = 'batch-input-row';

            const inputsContainer = document.createElement('div');
            inputsContainer.className = 'batch-input-fields';

            const workflowInputs = getWorkflowInputs();
            workflowInputs.forEach(input => {
                const inputField = document.createElement('input');
                inputField.type = input.type;
                inputField.name = input.name;
                inputField.placeholder = input.label || input.name;
                inputField.className = 'batch-input';
                if (values && values[input.name]) {
                    inputField.value = values[input.name];
                }
                inputsContainer.appendChild(inputField);
            });

            const actionButtons = document.createElement('div');
            actionButtons.className = 'batch-row-actions';

            const duplicateButton = document.createElement('button');
            duplicateButton.className = 'batch-row-action-button';
            duplicateButton.innerHTML = `${icons.copy}<span class="sr-only">Duplicate Row</span>`;
            duplicateButton.title = 'Duplicate Row';
            duplicateButton.addEventListener('click', () => {
                const values = {};
                row.querySelectorAll('input').forEach(input => {
                    if (input.name) {
                        values[input.name] = input.value;
                    }
                });
                const newRow = createInputRow(values);
                row.parentNode.insertBefore(newRow, row.nextSibling);
            });

            const removeButton = document.createElement('button');
            removeButton.className = 'batch-row-action-button delete';
            removeButton.innerHTML = `${icons.trash}<span class="sr-only">Remove Row</span>`;
            removeButton.title = 'Remove Row';
            removeButton.addEventListener('click', () => row.remove());

            actionButtons.appendChild(duplicateButton);
            actionButtons.appendChild(removeButton);

            row.appendChild(inputsContainer);
            row.appendChild(actionButtons);
            return row;
        }

        addButton.addEventListener('click', () => {
            inputContainer.appendChild(createInputRow());
        });

        const generateButton = document.createElement('button');
        generateButton.className = 'batch-generate-button';
        generateButton.innerHTML = `${icons.generate}<span>Generate</span>`;
        generateButton.addEventListener('click', async () => {
            const inputs = [];
            inputContainer.querySelectorAll('.batch-input-row').forEach(row => {
                const rowInputs = {};
                row.querySelectorAll('input').forEach(input => {
                    if (input.name && input.value) {
                        rowInputs[input.name] = input.value;
                    }
                });
                if (Object.keys(rowInputs).length > 0) {
                    inputs.push(rowInputs);
                }
            });

            if (inputs.length === 0) {
                alert('Please add at least one input');
                return;
            }

            // Only remove the add row and public/private buttons from controls
            addButton.remove();
            toggleButton.remove();
            inputContainer.remove();
            buttonContainer.remove();

            // Clear existing content
            content.innerHTML = '';

            // Create progress container with modern styling
            const progressContainer = document.createElement('div');
            progressContainer.className = 'batch-progress-container';
            progressContainer.innerHTML = `
                <div class="progress-header">
                    <h3>Generating Images</h3>
                    <span class="progress-count">0/${inputs.length}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-details">
                    <span class="progress-percentage">0%</span>
                    <span class="progress-message">Starting batch generation...</span>
                </div>
            `;
            content.appendChild(progressContainer);

            try {
                const results = await processBatchGeneration(inputs, GM_getValue('isPrivate', true));
                displayBatchResults(results);
            } catch (error) {
                console.error('Error processing batch:', error);
                content.innerHTML = `
                    <div class="batch-error">
                        ${icons.error}<span>Error processing batch: ${error.message}</span>
                    </div>
                `;
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'batch-button-container';
        buttonContainer.appendChild(generateButton);

        content.appendChild(inputContainer);
        content.appendChild(buttonContainer);

        // Add initial input row
        inputContainer.appendChild(createInputRow());

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    // Process batch generation
    async function processBatchGeneration(inputs, isPrivate = true) {
        const results = [];
        let completed = 0;

        // Create array of promises for parallel execution
        const promises = inputs.map(async (input, index) => {
            try {
                const result = await generateImage(input);
                completed++;

                // Update progress UI
                const progress = (completed / inputs.length) * 100;
                const progressFill = document.querySelector('.progress-fill');
                const progressCount = document.querySelector('.progress-count');
                const progressPercentage = document.querySelector('.progress-percentage');
                const progressMessage = document.querySelector('.progress-message');

                progressFill.style.width = `${progress}%`;
                progressCount.textContent = `${completed}/${inputs.length}`;
                progressPercentage.textContent = `${Math.round(progress)}%`;
                progressMessage.textContent = `Generated ${completed} of ${inputs.length} images...`;

                return {
                    status: 'success',
                    finalOutput: result.imageUrl,
                    inputs: input,
                    isPrivate: result.isPrivate
                };
            } catch (error) {
                completed++;

                // Update progress UI
                const progress = (completed / inputs.length) * 100;
                const progressFill = document.querySelector('.progress-fill');
                const progressCount = document.querySelector('.progress-count');
                const progressPercentage = document.querySelector('.progress-percentage');
                const progressMessage = document.querySelector('.progress-message');

                progressFill.style.width = `${progress}%`;
                progressCount.textContent = `${completed}/${inputs.length}`;
                progressPercentage.textContent = `${Math.round(progress)}%`;
                progressMessage.textContent = `Generated ${completed} of ${inputs.length} images...`;

                return {
                    status: 'error',
                    error: error.message,
                    inputs: input
                };
            }
        });

        // Wait for all promises to resolve
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);

        // Update final progress
        const progressMessage = document.querySelector('.progress-message');
        progressMessage.textContent = 'Generation complete!';

        // Short delay before showing results
        await new Promise(resolve => setTimeout(resolve, 500));

        return results;
    }

    // Create and show final image popup
    function showImagePopup(imageUrl) {
        // Remove existing popup if any
        const existingPopup = document.querySelector('.final-image-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'final-image-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <img src="${imageUrl}" alt="Generated Image" />
                <button class="open-new-tab" onclick="window.open('${imageUrl}', '_blank')">
                    Open in New Tab
                </button>
            </div>
        `;

        document.body.appendChild(popup);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            popup.remove();
        }, 10000);
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.glif-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `glif-toast ${type}`;

        const icon = type === 'success' ?
            `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>` :
            `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

        toast.innerHTML = `${icon}<span>${message}</span>`;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add private toggle
    function addPrivateToggle() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const runButton = Array.from(document.querySelectorAll('button')).find(
                        button => button.textContent.includes('Run This Glif')
                    );

                    if (runButton && !document.getElementById('privateToggle')) {
                        const toggle = document.createElement('button');
                        toggle.id = 'privateToggle';
                        toggle.className = runButton.className;
                        toggle.style.cssText = `
                            margin-top: 8px;
                            transition: all 0.2s ease;
                            font-weight: 500;
                            width: 100%;
                        `;

                        const updateButtonState = (isPrivate) => {
                            toggle.innerHTML = isPrivate ?
                                `${icons.lock}<span>Private</span>` :
                                `${icons.globe}<span>Public</span>`;
                            toggle.style.backgroundColor = isPrivate ? '#dc2626' : '#000000';
                            toggle.style.color = '#ffffff';
                        };

                        const initialState = GM_getValue('isPrivate', true);
                        updateButtonState(initialState);

                        toggle.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newState = !GM_getValue('isPrivate', false);
                            GM_setValue('isPrivate', newState);
                            updateButtonState(newState);
                        });

                        runButton.parentNode.appendChild(toggle);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function initialize() {
        // Inject styles first
        injectStyles();

        // Set initial dark mode state
        document.documentElement.setAttribute('data-glif-dark-mode', isDarkMode);

        // Function to initialize tools
        const initializeTools = () => {
            const navbar = document.querySelector('.flex.gap-3.md\\:gap-\\[44px\\]');
            if (navbar && !document.querySelector('.glif-tools-dropdown')) {
                const toolsDropdown = createToolsDropdown();
                navbar.appendChild(toolsDropdown);
                addPrivateToggle();
                return true;
            }
            return false;
        };

        // Initial attempt
        if (!initializeTools()) {
            // Set up mutation observer for dynamic content
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.flex.gap-3.md\\:gap-\\[44px\\]') && !document.querySelector('.glif-tools-dropdown')) {
                    if (initializeTools()) {
                        obs.disconnect();
                    }
                }
            });

            // Start observing with more comprehensive options
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });

            // Backup timeout attempts
            const attempts = [500, 1000, 2000, 3000];
            attempts.forEach(timeout => {
                setTimeout(() => {
                    if (!document.querySelector('.glif-tools-dropdown')) {
                        initializeTools();
                    }
                }, timeout);
            });
        }
    }

    // Initial setup
    initialize();
})();

const batchStyles = `
    .batch-progress-container {
        padding: 2rem;
        background: var(--background, white);
        border-radius: 12px;
        max-width: 1200px;
        margin: 0 auto;
        border: 1px solid var(--border-color, #e5e7eb);
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color, #e5e7eb);
    }

    .progress-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--foreground, #1f2937);
        margin: 0;
    }

    .progress-count {
        font-size: 0.875rem;
        color: var(--foreground-secondary, #6b7280);
        font-weight: 500;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--background-secondary, #f3f4f6);
        border-radius: 999px;
        overflow: hidden;
        margin: 1rem 0;
    }

    .progress-fill {
        height: 100%;
        background: var(--accent-color, #6366f1);
        border-radius: 999px;
        transition: width 0.3s ease;
        width: 0%;
    }

    .progress-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.75rem;
    }

    .progress-percentage {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--accent-color, #6366f1);
    }

    .progress-message {
        font-size: 0.875rem;
        color: var(--foreground-secondary, #6b7280);
    }

    /* Dark mode styles for progress and results */
    [data-glif-dark-mode="true"] .batch-progress-container {
        background-color: #1E1E1E !important;
        border-color: #2E2E2E !important;
    }

    [data-glif-dark-mode="true"] .progress-header {
        border-bottom-color: #2E2E2E !important;
    }

    [data-glif-dark-mode="true"] .progress-header h3 {
        color: #FFFFFF !important;
    }

    [data-glif-dark-mode="true"] .progress-count {
        color: #9CA3AF !important;
    }

    [data-glif-dark-mode="true"] .progress-bar {
        background-color: #2A2A2A !important;
    }

    [data-glif-dark-mode="true"] .progress-fill {
        background-color: #6366F1 !important;
    }

    [data-glif-dark-mode="true"] .progress-percentage {
        color: #818CF8 !important;
    }

    [data-glif-dark-mode="true"] .progress-message {
        color: #9CA3AF !important;
    }

    [data-glif-dark-mode="true"] .batch-results-container {
        background-color: #1E1E1E !important;
        border-color: #2E2E2E !important;
    }

    [data-glif-dark-mode="true"] .batch-results-header {
        border-bottom-color: #2E2E2E !important;
    }

    [data-glif-dark-mode="true"] .batch-results-title {
        color: #FFFFFF !important;
    }

    [data-glif-dark-mode="true"] .batch-result-item {
        background-color: #25262B !important;
        border-color: #2E2E2E !important;
    }

    [data-glif-dark-mode="true"] .batch-result-item:hover {
        background-color: #2C2D32 !important;
        border-color: #6366F1 !important;
    }

    [data-glif-dark-mode="true"] .result-prompt {
        color: #E6E8EC !important;
    }

    [data-glif-dark-mode="true"] .result-metadata {
        color: #9CA3AF !important;
    }

    [data-glif-dark-mode="true"] .error-container {
        background-color: rgba(239, 68, 68, 0.1) !important;
        border-color: rgba(239, 68, 68, 0.2) !important;
    }

    [data-glif-dark-mode="true"] .error-message {
        color: #EF4444 !important;
    }

    [data-glif-dark-mode="true"] .batch-action-button {
        background-color: #2A2A2A !important;
        color: #FFFFFF !important;
        border-color: #3E3E3E !important;
    }

    [data-glif-dark-mode="true"] .batch-action-button:hover {
        background-color: #33363C !important;
        border-color: #6366F1 !important;
    }

    .batch-error {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 8px;
        color: #EF4444;
        margin: 1rem 0;
    }
`;

// Add styles to document head
const styleElement = document.createElement('style');
styleElement.textContent = batchStyles;
document.head.appendChild(styleElement);

generateButton.addEventListener('click', async () => {
    const inputs = [];
    inputContainer.querySelectorAll('.batch-input-row').forEach(row => {
        const rowInputs = {};
        row.querySelectorAll('input').forEach(input => {
            if (input.name && input.value) {
                rowInputs[input.name] = input.value;
            }
        });
        if (Object.keys(rowInputs).length > 0) {
            inputs.push(rowInputs);
        }
    });

    if (inputs.length === 0) {
        alert('Please add at least one input row with values');
        return;
    }

    // Only remove the add row and public/private buttons from controls
    addButton.remove();
    toggleButton.remove();
    inputContainer.remove();
    buttonContainer.remove();

    // Clear existing content
    content.innerHTML = '';

    // Create progress container with modern styling
    const progressContainer = document.createElement('div');
    progressContainer.className = 'batch-progress-container';
    progressContainer.innerHTML = `
        <div class="progress-header">
            <h3>Generating Images</h3>
            <span class="progress-count">0/${inputs.length}</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-details">
            <span class="progress-percentage">0%</span>
            <span class="progress-message">Starting batch generation...</span>
        </div>
    `;
    content.appendChild(progressContainer);

    try {
        const results = await processBatchGeneration(inputs, GM_getValue('isPrivate', true));
        displayBatchResults(results);
    } catch (error) {
        console.error('Error processing batch:', error);
        content.innerHTML = `
            <div class="batch-error">
                ${icons.error}<span>Error processing batch: ${error.message}</span>
            </div>
        `;
    }
});
