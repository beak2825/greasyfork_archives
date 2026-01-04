// ==UserScript==
// @name         Expedia/Booking.com Partner Helper
// @namespace    https://github.com/obsxrver/expedia-review-helper
// @version      1.3
// @license      MIT
// @description  An AI Assistant for hospitality management. Automatically generate professional responses to hotel reviews and guest messages on booking.com and expedia.
// @author       Obsxrver (3than)
// @match        https://apps.expediapartnercentral.com/*
// @match        https://admin.booking.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      openrouter.ai
// @icon         data:image/png;base64,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
// @supportURL   https://github.com/obsxrver/expedia-review-helper/issues
// @downloadURL https://update.greasyfork.org/scripts/541177/ExpediaBookingcom%20Partner%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/541177/ExpediaBookingcom%20Partner%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Injected HTML template
    const MENU_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expedia Review Helper</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Toggle Button -->
    <button id="toggleMenuBtn" class="toggle-menu-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>
        Review Helper
    </button>

    <!-- Modal Overlay -->
    <div id="modalOverlay" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Expedia Review Helper Settings</h2>
                <button class="close-btn" id="closeModalBtn">&times;</button>
            </div>
            
            <div class="modal-body">
                <!-- OpenRouter API Settings -->
                <div class="settings-section">
                    <h3>OpenRouter Settings</h3>
                    <div class="form-group">
                        <label for="apiKey">API Key:</label>
                        <input type="password" id="apiKey" placeholder="Enter your OpenRouter API key">
                    </div>
                    
                    <div class="form-group">
                        <label for="modelSearch">Select Model:</label>
                        <input type="text" id="modelSearch" placeholder="Search models..." class="model-search">
                        <div id="providerFilters" class="provider-filters">
                            <button class="provider-btn active" data-provider="all">All</button>
                            <button class="provider-btn" data-provider="openai">OpenAI</button>
                            <button class="provider-btn" data-provider="anthropic">Anthropic</button>
                            <button class="provider-btn" data-provider="google">Google</button>
                            <button class="provider-btn" data-provider="deepseek">DeepSeek</button>
                        </div>
                        <select id="modelSelect" size="8">
                            <option value="loading">Loading models...</option>
                        </select>
                        <div id="modelInfo" class="model-info"></div>
                    </div>
                </div>

                <!-- System Instructions -->
                <div class="settings-section">
                    <h3>System Instructions</h3>
                    <div class="form-group">
                        <label for="systemInstructions">Instructions for generating responses:</label>
                        <textarea id="systemInstructions" rows="6" placeholder="Enter instructions for how the AI should respond to reviews...">You are a professional hotel manager responding to guest reviews. Be polite, appreciative, and address any concerns mentioned. Keep responses concise but warm. Always thank the guest for their feedback and invite them to return.</textarea>
                    </div>
                </div>

                <!-- User Information -->
                <div class="settings-section">
                    <h3>Your Information</h3>
                    <div class="form-group">
                        <label for="userName">Your Name:</label>
                        <input type="text" id="userName" placeholder="e.g., John Smith">
                    </div>
                    
                    <div class="form-group">
                        <label for="userPosition">Your Position:</label>
                        <input type="text" id="userPosition" placeholder="e.g., General Manager">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="button-group">
                    <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
                    <button id="generateReplyBtn" class="btn btn-success">Generate Reply</button>
                </div>

                <!-- Status Message -->
                <div id="statusMessage" class="status-message"></div>
            </div>
        </div>
    </div>
</body>
</html>
`;

    // Injected CSS
    const MENU_CSS = `/* Reset and Base Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Theme variables */
:root {
    color-scheme: light dark;
    /* Base */
    --eh-color-bg: #ffffff;
    --eh-color-surface: #ffffff;
    --eh-color-surface-muted: #f7f7f7;
    --eh-color-text: #333333;
    --eh-color-text-muted: #555555;
    --eh-color-heading: #1a1a1a;
    --eh-color-icon: #666666;
    --eh-color-border: #dddddd;
    --eh-color-border-strong: #e0e0e0;
    --eh-color-divider: #f0f0f0;
    --eh-hover-bg: #f5f5f5;

    /* Primary/Success */
    --eh-primary: #0066cc;
    --eh-primary-hover: #0052a3;
    --eh-primary-shadow: rgba(0, 102, 204, 0.3);
    --eh-primary-shadow-hover: rgba(0, 102, 204, 0.4);
    --eh-success: #00a651;
    --eh-success-hover: #008a43;

    /* Overlay and focus */
    --eh-overlay: rgba(0, 0, 0, 0.5);
    --eh-focus-ring: rgba(0, 102, 204, 0.1);

    /* Model info */
    --eh-model-info-bg: #f0f7ff;
    --eh-model-info-border: #cce5ff;
    --eh-model-info-text: #0066cc;

    /* Select */
    --eh-select-selected-bg: #e3f2fd;

    /* Status messages */
    --eh-status-success-bg: #e6f7ed;
    --eh-status-success-text: #00703c;
    --eh-status-success-border: #b3e0c9;
    --eh-status-error-bg: #fef2f2;
    --eh-status-error-text: #dc2626;
    --eh-status-error-border: #fecaca;
    --eh-status-info-bg: #eff6ff;
    --eh-status-info-text: #1e40af;
    --eh-status-info-border: #bfdbfe;
}

/* Auto dark theme via system preference */
@media (prefers-color-scheme: dark) {
    :root {
        --eh-color-bg: #111827;
        --eh-color-surface: #1f2937;
        --eh-color-surface-muted: #111827;
        --eh-color-text: #e5e7eb;
        --eh-color-text-muted: #9ca3af;
        --eh-color-heading: #f3f4f6;
        --eh-color-icon: #cbd5e1;
        --eh-color-border: #334155;
        --eh-color-border-strong: #374151;
        --eh-color-divider: #2a2f3a;
        --eh-hover-bg: #2a2f3a;

        --eh-primary: #4aa3ff;
        --eh-primary-hover: #3b82f6;
        --eh-primary-shadow: rgba(74, 163, 255, 0.25);
        --eh-primary-shadow-hover: rgba(74, 163, 255, 0.35);
        --eh-success: #28d17c;
        --eh-success-hover: #22c06b;

        --eh-overlay: rgba(0, 0, 0, 0.6);
        --eh-focus-ring: rgba(74, 163, 255, 0.25);

        --eh-model-info-bg: #0b2a4a;
        --eh-model-info-border: #1b4d75;
        --eh-model-info-text: #93c5fd;

        --eh-select-selected-bg: #0b2a4a;

        --eh-status-success-bg: #063d2a;
        --eh-status-success-text: #86efac;
        --eh-status-success-border: #14532d;
        --eh-status-error-bg: #3f1d1d;
        --eh-status-error-text: #fecaca;
        --eh-status-error-border: #7f1d1d;
        --eh-status-info-bg: #0a2548;
        --eh-status-info-text: #93c5fd;
        --eh-status-info-border: #1d4ed8;
    }
}

/* Optional: force dark theme by adding this class to <body> */
body.expedia-helper-theme-dark {
    --eh-color-bg: #111827;
    --eh-color-surface: #1f2937;
    --eh-color-surface-muted: #111827;
    --eh-color-text: #e5e7eb;
    --eh-color-text-muted: #9ca3af;
    --eh-color-heading: #f3f4f6;
    --eh-color-icon: #cbd5e1;
    --eh-color-border: #334155;
    --eh-color-border-strong: #374151;
    --eh-color-divider: #2a2f3a;
    --eh-hover-bg: #2a2f3a;

    --eh-primary: #4aa3ff;
    --eh-primary-hover: #3b82f6;
    --eh-primary-shadow: rgba(74, 163, 255, 0.25);
    --eh-primary-shadow-hover: rgba(74, 163, 255, 0.35);
    --eh-success: #28d17c;
    --eh-success-hover: #22c06b;

    --eh-overlay: rgba(0, 0, 0, 0.6);
    --eh-focus-ring: rgba(74, 163, 255, 0.25);

    --eh-model-info-bg: #0b2a4a;
    --eh-model-info-border: #1b4d75;
    --eh-model-info-text: #93c5fd;

    --eh-select-selected-bg: #0b2a4a;

    --eh-status-success-bg: #063d2a;
    --eh-status-success-text: #86efac;
    --eh-status-success-border: #14532d;
    --eh-status-error-bg: #3f1d1d;
    --eh-status-error-text: #fecaca;
    --eh-status-error-border: #7f1d1d;
    --eh-status-info-bg: #0a2548;
    --eh-status-info-text: #93c5fd;
    --eh-status-info-border: #1d4ed8;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--eh-color-text);
}

/* Toggle Button */
.toggle-menu-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--eh-primary);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px var(--eh-primary-shadow);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    z-index: 9999;
}

.toggle-menu-btn:hover {
    background: var(--eh-primary-hover);
    box-shadow: 0 6px 16px var(--eh-primary-shadow-hover);
    transform: translateY(-2px);
}

.toggle-menu-btn svg {
    width: 20px;
    height: 20px;
}

/* Modal Overlay */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--eh-overlay);
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.modal-overlay.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Modal Content */
.modal-content {
    background: var(--eh-color-surface);
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
}

/* Modal Header */
.modal-header {
    background: var(--eh-color-surface-muted);
    padding: 20px 24px;
    border-bottom: 1px solid var(--eh-color-border-strong);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--eh-color-heading);
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: var(--eh-color-icon);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: var(--eh-color-border-strong);
    color: var(--eh-color-text);
}

/* Modal Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
}

/* Settings Sections */
.settings-section {
    margin-bottom: 28px;
}

.settings-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--eh-color-heading);
    margin-bottom: 16px;
}

/* Form Groups */
.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--eh-color-text-muted);
    margin-bottom: 8px;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--eh-color-border);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    background: var(--eh-color-surface);
    color: var(--eh-color-text);
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--eh-primary);
    box-shadow: 0 0 0 3px var(--eh-focus-ring);
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

/* Model Search and Select */
.model-search {
    margin-bottom: 8px;
}

.provider-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.provider-btn {
    padding: 6px 12px;
    border: 1px solid var(--eh-color-border);
    background: var(--eh-color-surface-muted);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
}

.provider-btn:hover {
    background: var(--eh-color-border-strong);
}

.provider-btn.active {
    background: var(--eh-primary);
    color: white;
    border-color: var(--eh-primary);
}

#modelSelect {
    height: 200px;
    overflow-y: auto;
    cursor: pointer;
}

#modelSelect option {
    padding: 8px 12px;
    border-bottom: 1px solid var(--eh-color-divider);
    transition: background-color 0.2s ease;
}

#modelSelect option:hover {
    background-color: var(--eh-hover-bg);
}

#modelSelect option:selected {
    background-color: var(--eh-select-selected-bg);
    color: var(--eh-primary);
}

#modelSelect option[style*="display: none"] {
    display: none !important;
}

#modelSelect option:disabled {
    color: #999;
    font-style: italic;
    cursor: not-allowed;
}

/* Model Info */
.model-info {
    margin-top: 8px;
    padding: 8px 12px;
    background: var(--eh-model-info-bg);
    border: 1px solid var(--eh-model-info-border);
    border-radius: 4px;
    font-size: 12px;
    color: var(--eh-model-info-text);
    display: none;
}

/* Buttons */
.button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
}

.btn-primary {
    background: var(--eh-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--eh-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--eh-primary-shadow);
}

.btn-success {
    background: var(--eh-success);
    color: white;
}

.btn-success:hover {
    background: var(--eh-success-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

/* Status Message */
.status-message {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    display: none;
}

.status-message.success {
    background: var(--eh-status-success-bg);
    color: var(--eh-status-success-text);
    border: 1px solid var(--eh-status-success-border);
    display: block;
}

.status-message.error {
    background: var(--eh-status-error-bg);
    color: var(--eh-status-error-text);
    border: 1px solid var(--eh-status-error-border);
    display: block;
}

.status-message.info {
    background: var(--eh-status-info-bg);
    color: var(--eh-status-info-text);
    border: 1px solid var(--eh-status-info-border);
    display: block;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 600px) {
    .modal-content {
        width: 95%;
        margin: 10px;
    }
    
    .button-group {
        flex-direction: column;
    }
    
    .toggle-menu-btn {
        bottom: 10px;
        right: 10px;
    }
    
    #modelSelect {
        height: 150px;
    }
}

/* Booking.com specific styles */
.expedia-helper-controls-booking {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.expedia-helper-instructions {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--eh-color-border);
    border-radius: 4px;
    min-height: 60px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
}

.expedia-helper-generate-btn.bui-button {
    width: fit-content;
}

/* Expedia sheet generate button (override inline styles) */
.expedia-helper-generate-btn {
    background: var(--eh-primary) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px !important;
}

.expedia-helper-generate-btn:hover {
    background: var(--eh-primary-hover) !important;
}
`;

    // Main application code
    // Expedia/Booking.com Partner Helper - Main JavaScript

class ExpediaReviewHelper {
    constructor() {
        this.settings = this.loadSettings();
        this.modalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expedia Review Helper</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Toggle Button -->
    <button id="toggleMenuBtn" class="toggle-menu-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>
        Review Helper
    </button>

    <!-- Modal Overlay -->
    <div id="modalOverlay" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Expedia Review Helper Settings</h2>
                <button class="close-btn" id="closeModalBtn">&times;</button>
            </div>
            
            <div class="modal-body">
                <!-- OpenRouter API Settings -->
                <div class="settings-section">
                    <h3>OpenRouter Settings</h3>
                    <div class="form-group">
                        <label for="apiKey">API Key:</label>
                        <input type="password" id="apiKey" placeholder="Enter your OpenRouter API key">
                    </div>
                    
                    <div class="form-group">
                        <label for="modelSearch">Select Model:</label>
                        <input type="text" id="modelSearch" placeholder="Search models..." class="model-search">
                        <div id="providerFilters" class="provider-filters">
                            <button class="provider-btn active" data-provider="all">All</button>
                            <button class="provider-btn" data-provider="openai">OpenAI</button>
                            <button class="provider-btn" data-provider="anthropic">Anthropic</button>
                            <button class="provider-btn" data-provider="google">Google</button>
                            <button class="provider-btn" data-provider="deepseek">DeepSeek</button>
                        </div>
                        <select id="modelSelect" size="8">
                            <option value="loading">Loading models...</option>
                        </select>
                        <div id="modelInfo" class="model-info"></div>
                    </div>
                </div>

                <!-- System Instructions -->
                <div class="settings-section">
                    <h3>System Instructions</h3>
                    <div class="form-group">
                        <label for="systemInstructions">Instructions for generating responses:</label>
                        <textarea id="systemInstructions" rows="6" placeholder="Enter instructions for how the AI should respond to reviews...">You are a professional hotel manager responding to guest reviews. Be polite, appreciative, and address any concerns mentioned. Keep responses concise but warm. Always thank the guest for their feedback and invite them to return.</textarea>
                    </div>
                </div>

                <!-- User Information -->
                <div class="settings-section">
                    <h3>Your Information</h3>
                    <div class="form-group">
                        <label for="userName">Your Name:</label>
                        <input type="text" id="userName" placeholder="e.g., John Smith">
                    </div>
                    
                    <div class="form-group">
                        <label for="userPosition">Your Position:</label>
                        <input type="text" id="userPosition" placeholder="e.g., General Manager">
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="button-group">
                    <button id="saveSettingsBtn" class="btn btn-primary">Save Settings</button>
                    <button id="generateReplyBtn" class="btn btn-success">Generate Reply</button>
                </div>

                <!-- Status Message -->
                <div id="statusMessage" class="status-message"></div>
            </div>
        </div>
    </div>
</body>
</html>
`; // Will be injected by compile.py
        this.modalCSS = `/* Reset and Base Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Theme variables */
:root {
    color-scheme: light dark;
    /* Base */
    --eh-color-bg: #ffffff;
    --eh-color-surface: #ffffff;
    --eh-color-surface-muted: #f7f7f7;
    --eh-color-text: #333333;
    --eh-color-text-muted: #555555;
    --eh-color-heading: #1a1a1a;
    --eh-color-icon: #666666;
    --eh-color-border: #dddddd;
    --eh-color-border-strong: #e0e0e0;
    --eh-color-divider: #f0f0f0;
    --eh-hover-bg: #f5f5f5;

    /* Primary/Success */
    --eh-primary: #0066cc;
    --eh-primary-hover: #0052a3;
    --eh-primary-shadow: rgba(0, 102, 204, 0.3);
    --eh-primary-shadow-hover: rgba(0, 102, 204, 0.4);
    --eh-success: #00a651;
    --eh-success-hover: #008a43;

    /* Overlay and focus */
    --eh-overlay: rgba(0, 0, 0, 0.5);
    --eh-focus-ring: rgba(0, 102, 204, 0.1);

    /* Model info */
    --eh-model-info-bg: #f0f7ff;
    --eh-model-info-border: #cce5ff;
    --eh-model-info-text: #0066cc;

    /* Select */
    --eh-select-selected-bg: #e3f2fd;

    /* Status messages */
    --eh-status-success-bg: #e6f7ed;
    --eh-status-success-text: #00703c;
    --eh-status-success-border: #b3e0c9;
    --eh-status-error-bg: #fef2f2;
    --eh-status-error-text: #dc2626;
    --eh-status-error-border: #fecaca;
    --eh-status-info-bg: #eff6ff;
    --eh-status-info-text: #1e40af;
    --eh-status-info-border: #bfdbfe;
}

/* Auto dark theme via system preference */
@media (prefers-color-scheme: dark) {
    :root {
        --eh-color-bg: #111827;
        --eh-color-surface: #1f2937;
        --eh-color-surface-muted: #111827;
        --eh-color-text: #e5e7eb;
        --eh-color-text-muted: #9ca3af;
        --eh-color-heading: #f3f4f6;
        --eh-color-icon: #cbd5e1;
        --eh-color-border: #334155;
        --eh-color-border-strong: #374151;
        --eh-color-divider: #2a2f3a;
        --eh-hover-bg: #2a2f3a;

        --eh-primary: #4aa3ff;
        --eh-primary-hover: #3b82f6;
        --eh-primary-shadow: rgba(74, 163, 255, 0.25);
        --eh-primary-shadow-hover: rgba(74, 163, 255, 0.35);
        --eh-success: #28d17c;
        --eh-success-hover: #22c06b;

        --eh-overlay: rgba(0, 0, 0, 0.6);
        --eh-focus-ring: rgba(74, 163, 255, 0.25);

        --eh-model-info-bg: #0b2a4a;
        --eh-model-info-border: #1b4d75;
        --eh-model-info-text: #93c5fd;

        --eh-select-selected-bg: #0b2a4a;

        --eh-status-success-bg: #063d2a;
        --eh-status-success-text: #86efac;
        --eh-status-success-border: #14532d;
        --eh-status-error-bg: #3f1d1d;
        --eh-status-error-text: #fecaca;
        --eh-status-error-border: #7f1d1d;
        --eh-status-info-bg: #0a2548;
        --eh-status-info-text: #93c5fd;
        --eh-status-info-border: #1d4ed8;
    }
}

/* Optional: force dark theme by adding this class to <body> */
body.expedia-helper-theme-dark {
    --eh-color-bg: #111827;
    --eh-color-surface: #1f2937;
    --eh-color-surface-muted: #111827;
    --eh-color-text: #e5e7eb;
    --eh-color-text-muted: #9ca3af;
    --eh-color-heading: #f3f4f6;
    --eh-color-icon: #cbd5e1;
    --eh-color-border: #334155;
    --eh-color-border-strong: #374151;
    --eh-color-divider: #2a2f3a;
    --eh-hover-bg: #2a2f3a;

    --eh-primary: #4aa3ff;
    --eh-primary-hover: #3b82f6;
    --eh-primary-shadow: rgba(74, 163, 255, 0.25);
    --eh-primary-shadow-hover: rgba(74, 163, 255, 0.35);
    --eh-success: #28d17c;
    --eh-success-hover: #22c06b;

    --eh-overlay: rgba(0, 0, 0, 0.6);
    --eh-focus-ring: rgba(74, 163, 255, 0.25);

    --eh-model-info-bg: #0b2a4a;
    --eh-model-info-border: #1b4d75;
    --eh-model-info-text: #93c5fd;

    --eh-select-selected-bg: #0b2a4a;

    --eh-status-success-bg: #063d2a;
    --eh-status-success-text: #86efac;
    --eh-status-success-border: #14532d;
    --eh-status-error-bg: #3f1d1d;
    --eh-status-error-text: #fecaca;
    --eh-status-error-border: #7f1d1d;
    --eh-status-info-bg: #0a2548;
    --eh-status-info-text: #93c5fd;
    --eh-status-info-border: #1d4ed8;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--eh-color-text);
}

/* Toggle Button */
.toggle-menu-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--eh-primary);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px var(--eh-primary-shadow);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    z-index: 9999;
}

.toggle-menu-btn:hover {
    background: var(--eh-primary-hover);
    box-shadow: 0 6px 16px var(--eh-primary-shadow-hover);
    transform: translateY(-2px);
}

.toggle-menu-btn svg {
    width: 20px;
    height: 20px;
}

/* Modal Overlay */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--eh-overlay);
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.modal-overlay.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Modal Content */
.modal-content {
    background: var(--eh-color-surface);
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
}

/* Modal Header */
.modal-header {
    background: var(--eh-color-surface-muted);
    padding: 20px 24px;
    border-bottom: 1px solid var(--eh-color-border-strong);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--eh-color-heading);
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: var(--eh-color-icon);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: var(--eh-color-border-strong);
    color: var(--eh-color-text);
}

/* Modal Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
}

/* Settings Sections */
.settings-section {
    margin-bottom: 28px;
}

.settings-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--eh-color-heading);
    margin-bottom: 16px;
}

/* Form Groups */
.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--eh-color-text-muted);
    margin-bottom: 8px;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--eh-color-border);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    background: var(--eh-color-surface);
    color: var(--eh-color-text);
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--eh-primary);
    box-shadow: 0 0 0 3px var(--eh-focus-ring);
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

/* Model Search and Select */
.model-search {
    margin-bottom: 8px;
}

.provider-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.provider-btn {
    padding: 6px 12px;
    border: 1px solid var(--eh-color-border);
    background: var(--eh-color-surface-muted);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
}

.provider-btn:hover {
    background: var(--eh-color-border-strong);
}

.provider-btn.active {
    background: var(--eh-primary);
    color: white;
    border-color: var(--eh-primary);
}

#modelSelect {
    height: 200px;
    overflow-y: auto;
    cursor: pointer;
}

#modelSelect option {
    padding: 8px 12px;
    border-bottom: 1px solid var(--eh-color-divider);
    transition: background-color 0.2s ease;
}

#modelSelect option:hover {
    background-color: var(--eh-hover-bg);
}

#modelSelect option:selected {
    background-color: var(--eh-select-selected-bg);
    color: var(--eh-primary);
}

#modelSelect option[style*="display: none"] {
    display: none !important;
}

#modelSelect option:disabled {
    color: #999;
    font-style: italic;
    cursor: not-allowed;
}

/* Model Info */
.model-info {
    margin-top: 8px;
    padding: 8px 12px;
    background: var(--eh-model-info-bg);
    border: 1px solid var(--eh-model-info-border);
    border-radius: 4px;
    font-size: 12px;
    color: var(--eh-model-info-text);
    display: none;
}

/* Buttons */
.button-group {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
}

.btn-primary {
    background: var(--eh-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--eh-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--eh-primary-shadow);
}

.btn-success {
    background: var(--eh-success);
    color: white;
}

.btn-success:hover {
    background: var(--eh-success-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

/* Status Message */
.status-message {
    margin-top: 16px;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    display: none;
}

.status-message.success {
    background: var(--eh-status-success-bg);
    color: var(--eh-status-success-text);
    border: 1px solid var(--eh-status-success-border);
    display: block;
}

.status-message.error {
    background: var(--eh-status-error-bg);
    color: var(--eh-status-error-text);
    border: 1px solid var(--eh-status-error-border);
    display: block;
}

.status-message.info {
    background: var(--eh-status-info-bg);
    color: var(--eh-status-info-text);
    border: 1px solid var(--eh-status-info-border);
    display: block;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 600px) {
    .modal-content {
        width: 95%;
        margin: 10px;
    }
    
    .button-group {
        flex-direction: column;
    }
    
    .toggle-menu-btn {
        bottom: 10px;
        right: 10px;
    }
    
    #modelSelect {
        height: 150px;
    }
}

/* Booking.com specific styles */
.expedia-helper-controls-booking {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.expedia-helper-instructions {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--eh-color-border);
    border-radius: 4px;
    min-height: 60px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
}

.expedia-helper-generate-btn.bui-button {
    width: fit-content;
}

/* Expedia sheet generate button (override inline styles) */
.expedia-helper-generate-btn {
    background: var(--eh-primary) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px !important;
}

.expedia-helper-generate-btn:hover {
    background: var(--eh-primary-hover) !important;
}
`;   // Will be injected by compile.py
        this.availableModels = [];
        this.selectedProvider = 'all';

        this.currentSite = this.detectSite();
        if (!this.currentSite) {
            console.log('Expedia Review Helper: Not on a supported site.');
            return;
        }

        this.init();
    }

    detectSite() {
        const hostname = window.location.hostname;
        if (hostname.includes('expediapartnercentral.com')) {
            return 'expedia';
        } else if (hostname.includes('admin.booking.com') || hostname.includes('extranet.booking.com')) {
            return 'booking';
        }
        return null;
    }

    init() {
        // Inject CSS
        GM_addStyle(this.modalCSS);
        
        // Create and inject the modal HTML
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = this.modalHTML;
        document.body.appendChild(modalContainer);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Watch for review response dialog
        this.watchForReviewChanges();
        
        // Load saved settings into form
        this.loadSettingsIntoForm();
        
        // Fetch available models
        this.fetchAvailableModels();
    }

    async fetchAvailableModels() {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://openrouter.ai/api/v1/models',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        resolve(response);
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
            
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = JSON.parse(response.responseText);
            this.availableModels = data.data || [];
            
            // Update the dropdown with fetched models
            this.updateModelDropdown();
        } catch (error) {
            console.error('Error fetching models:', error);
            // Fallback to some default models if fetch fails
            this.availableModels = [
                {
                    id: 'openai/gpt-4o',
                    name: 'GPT-4o',
                    pricing: { prompt: '0.01', completion: '0.03' }
                },
                {
                    id: 'anthropic/claude-4-opus',
                    name: 'Claude 4 Opus',
                    pricing: { prompt: '0.015', completion: '0.075' }
                },
                {
                    id: 'anthropic/claude-4-sonnet',
                    name: 'Claude 4 Sonnet',
                    pricing: { prompt: '0.003', completion: '0.015' }
                },
                {
                    id: 'google/gemini-2.5-pro',
                    name: 'Gemini 2.5 Pro',
                    pricing: { prompt: '0.00025', completion: '0.0005' }
                }
            ];
            this.updateModelDropdown();
        }
    }

    updateModelDropdown() {
        const modelSelect = document.getElementById('modelSelect');
        
        // Clear existing options
        modelSelect.innerHTML = '';
        
        // Sort models by name
        const sortedModels = this.availableModels.sort((a, b) => a.name.localeCompare(b.name));
        
        // Add models to dropdown
        sortedModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = `${model.name} (${model.id})`;
            option.dataset.description = model.description || '';
            option.dataset.pricing = `$${model.pricing.prompt*1000000}/1M prompt, $${model.pricing.completion*1000000}/1M completion`;
            modelSelect.appendChild(option);
        });
        
        // Set the saved model if it exists
        if (this.settings.model && this.availableModels.some(m => m.id === this.settings.model)) {
            modelSelect.value = this.settings.model;
        } else if (sortedModels.length > 0) {
            // Default to first model if saved model not found
            modelSelect.value = sortedModels[0].id;
        }
        
        // Update model list display based on filters
        this.updateModelListDisplay();

        // Update model info display
        this.updateModelInfo();
    }

    updateModelListDisplay() {
        const modelSelect = document.getElementById('modelSelect');
        const searchInput = document.getElementById('modelSearch');
        const options = modelSelect.querySelectorAll('option');
        
        const searchTerm = searchInput.value.toLowerCase();
        let visibleOptionsCount = 0;
        
        const selectedModelValue = this.settings.model;
        let selectedModelOption = null;

        options.forEach(option => {
            const modelId = option.value;
            
            if (modelId === selectedModelValue) {
                selectedModelOption = option;
                option.style.display = '';
                visibleOptionsCount++;
                return;
            }

            const text = option.textContent.toLowerCase();
            const description = option.dataset.description.toLowerCase();
            const provider = modelId.split('/')[0];

            const matchesProvider = this.selectedProvider === 'all' || provider === this.selectedProvider;
            const matchesSearch = text.includes(searchTerm) || description.includes(searchTerm);

            if (matchesProvider && matchesSearch) {
                option.style.display = '';
                visibleOptionsCount++;
            } else {
                option.style.display = 'none';
            }
        });

        // Move selected model to the top
        if (selectedModelOption) {
            modelSelect.prepend(selectedModelOption);
        }
        
        const noResultsOption = document.getElementById('noModelsMessage');
        // If no options match, show a message
        if (visibleOptionsCount === 0) {
            if (!noResultsOption) {
                const newNoResultsOption = document.createElement('option');
                newNoResultsOption.id = 'noModelsMessage';
                newNoResultsOption.textContent = 'No models found matching your search';
                newNoResultsOption.disabled = true;
                modelSelect.appendChild(newNoResultsOption);
            }
        } else {
            if (noResultsOption) {
                noResultsOption.remove();
            }
        }
    }

    updateModelInfo() {
        const modelSelect = document.getElementById('modelSelect');
        const modelInfo = document.getElementById('modelInfo');
        const selectedOption = modelSelect.options[modelSelect.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.pricing) {
            modelInfo.textContent = selectedOption.dataset.pricing;
            modelInfo.style.display = 'block';
        } else {
            modelInfo.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Toggle button
        const toggleBtn = document.getElementById('toggleMenuBtn');
        toggleBtn.addEventListener('click', () => this.openModal());
        
        // Close button
        const closeBtn = document.getElementById('closeModalBtn');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });
        
        // Save settings button
        const saveBtn = document.getElementById('saveSettingsBtn');
        saveBtn.addEventListener('click', () => this.saveSettings());
        
        // Generate reply button
        const generateBtn = document.getElementById('generateReplyBtn');
        generateBtn.addEventListener('click', () => this.generateReply());
        
        // Model search input
        const modelSearch = document.getElementById('modelSearch');
        modelSearch.addEventListener('input', () => {
            this.updateModelListDisplay();
        });

        // Provider filter buttons
        const providerBtns = document.querySelectorAll('.provider-btn');
        providerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                providerBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.selectedProvider = e.target.dataset.provider;
                this.updateModelListDisplay();
            });
        });
        
        // Model select change
        const modelSelect = document.getElementById('modelSelect');
        modelSelect.addEventListener('change', () => {
            this.updateModelInfo();
        });
    }

    openModal() {
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    loadSettings() {
        const defaultSettings = {
            apiKey: '',
            model: 'google/gemini-2.5-pro',
            systemInstructions: `You are to write a response to this guest's review of the hotel.
            Please write a polite and personalized response to the guest review, and keep it concise. 
            *DO NOT* address the guest by their name. 
            Tailor the response to their review, and invite them back. 
            Be mindful not to make it sound overly templated. 
            Keep it professional, but with a friendly/casual sense of warmth. 
            Keep it within 2-4 sentences. 
            Be unique, add your own creative spin to it, so it doesn't look AI generated. 
            Using the long-dash/em-dash is forbidden. 
            Don't make unsubstantiated promises 
            (eg: 
                X "this issue has been resolved"
                X "that staff member has been terminated"
                X "please call us for a full refund"
            )
            Don't sign the messages, or end with a valediction/closing salutation. 
            If the review content is 'this guest didn't leave a comment', 
            do not mention the fact that the guest didn't leave any remarks. 
            Simply thank them for their review and invite them back.`,
            userName: 'Front Desk Team',
            userPosition: 'Hotel'
        };
        
        const saved = GM_getValue('expediaReviewSettings', null);
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    saveSettings() {
        this.settings = {
            apiKey: document.getElementById('apiKey').value,
            model: document.getElementById('modelSelect').value,
            systemInstructions: document.getElementById('systemInstructions').value,
            userName: document.getElementById('userName').value,
            userPosition: document.getElementById('userPosition').value
        };
        
        GM_setValue('expediaReviewSettings', JSON.stringify(this.settings));
        this.showStatus('Settings saved successfully!', 'success');
    }

    loadSettingsIntoForm() {
        document.getElementById('apiKey').value = this.settings.apiKey || '';
        document.getElementById('modelSelect').value = this.settings.model || 'google/gemini-2.5-pro';
        document.getElementById('systemInstructions').value = this.settings.systemInstructions || '';
        document.getElementById('userName').value = this.settings.userName || '';
        document.getElementById('userPosition').value = this.settings.userPosition || '';
    }

    watchForReviewChanges() {
        if (this.currentSite === 'expedia') {
            this.watchForExpediaReviewDialog();
        } else if (this.currentSite === 'booking') {
            this.watchForBookingReviewCards();
        }
    }

    watchForExpediaReviewDialog() {
        // Use MutationObserver to watch for the review dialog
        const observer = new MutationObserver((mutations) => {
            const reviewDialog = document.querySelector('#app-layer-respond-sheet');
            if (reviewDialog && reviewDialog.getAttribute('aria-hidden') === 'false') {
                this.injectExpediaGenerateButton();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-hidden']
        });
    }

    watchForBookingReviewCards() {
        const processCards = () => {
            const reviewCards = document.querySelectorAll('.gr-review-card.bui-panel');
            reviewCards.forEach(card => {
                // If controls already injected, skip
                if (card.querySelector('.expedia-helper-controls-booking')) return;

                // If reply textarea already present, inject controls directly
                const textarea = card.querySelector('textarea.bui-input-textarea');
                if (textarea) {
                    this.injectBookingControlsIntoCard(card);
                    return;
                }

                // Otherwise, find a Reply button and auto-open
                const replySpan = Array.from(card.querySelectorAll('button .bui-button__text span'))
                    .find(span => span.textContent && span.textContent.trim().toLowerCase() === 'reply');
                const replyButton = replySpan ? replySpan.closest('button') : null;
                if (!replyButton) return; // Cannot reply on this card

                if (!card.classList.contains('exp-helper-clicked-reply')) {
                    card.classList.add('exp-helper-clicked-reply');
                    replyButton.click();

                    // Wait for the reply textarea to appear, then inject
                    const obs = new MutationObserver((mutations, obsr) => {
                        const openedTextarea = card.querySelector('textarea.bui-input-textarea');
                        if (openedTextarea) {
                            this.injectBookingControlsIntoCard(card);
                            obsr.disconnect();
                        }
                    });
                    obs.observe(card, { childList: true, subtree: true });
                    setTimeout(() => obs.disconnect(), 7000);
                }
            });
        };

        const targetNode = document.getElementById('reviews-main-container') || document.body;
        const observer = new MutationObserver(processCards);
        observer.observe(targetNode, { childList: true, subtree: true });
        processCards();
    }

    // Insert Booking.com controls inside the reply context (near the textarea)
    injectBookingControlsIntoCard(reviewCard) {
        if (!reviewCard || reviewCard.querySelector('.expedia-helper-controls-booking')) return;

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'expedia-helper-controls-booking';
        controlsContainer.style.cssText = `
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        const instructionsTextarea = document.createElement('textarea');
        instructionsTextarea.className = 'expedia-helper-instructions';
        instructionsTextarea.placeholder = 'Optional: Add specific instructions for this reply...';
        instructionsTextarea.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #cdcfd2;
            border-radius: 4px;
            min-height: 60px;
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
        `;

        const generateBtn = document.createElement('button');
        generateBtn.className = 'expedia-helper-generate-btn bui-button bui-button--secondary';
        generateBtn.style.width = 'fit-content';
        generateBtn.innerHTML = '<span class="bui-button__text">✨ Generate Reply</span>';

        controlsContainer.appendChild(instructionsTextarea);
        controlsContainer.appendChild(generateBtn);

        // Prefer to insert right after the reply textarea's form group
        const formGroup = reviewCard.querySelector('.bui-form__group');
        if (formGroup) {
            formGroup.appendChild(controlsContainer);
        } else {
            // Fallback: insert before the action buttons group or at the end of card
            const actionsGroup = reviewCard.querySelector('.bui-group.bui-group--inline');
            if (actionsGroup && actionsGroup.parentNode) {
                actionsGroup.parentNode.insertBefore(controlsContainer, actionsGroup);
            } else {
                reviewCard.appendChild(controlsContainer);
            }
        }

        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Ensure reply textarea exists; if not, try to open again (edge cases)
            const textarea = reviewCard.querySelector('textarea.bui-input-textarea');
            if (!textarea) {
                const replySpan = Array.from(reviewCard.querySelectorAll('button .bui-button__text span'))
                    .find(span => span.textContent && span.textContent.trim().toLowerCase() === 'reply');
                const replyButton = replySpan ? replySpan.closest('button') : null;
                if (replyButton) replyButton.click();
                const waitObs = new MutationObserver((mutations, obsr) => {
                    if (reviewCard.querySelector('textarea.bui-input-textarea')) {
                        this.generateReplyFromDialog(generateBtn);
                        obsr.disconnect();
                    }
                });
                waitObs.observe(reviewCard, { childList: true, subtree: true });
                setTimeout(() => waitObs.disconnect(), 5000);
                return;
            }
            this.generateReplyFromDialog(generateBtn);
        });
    }

    injectBookingControls(replyButton) {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'expedia-helper-controls-booking';
        controlsContainer.style.cssText = `
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
    
        const instructionsTextarea = document.createElement('textarea');
        instructionsTextarea.className = 'expedia-helper-instructions';
        instructionsTextarea.placeholder = 'Optional: Add specific instructions for this reply...';
        instructionsTextarea.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #cdcfd2;
            border-radius: 4px;
            min-height: 60px;
            resize: vertical;
            font-family: inherit;
            font-size: 14px;
        `;
    
        const generateBtn = document.createElement('button');
        generateBtn.className = 'expedia-helper-generate-btn bui-button bui-button--secondary'; 
        generateBtn.style.width = 'fit-content';
        generateBtn.innerHTML = '<span class="bui-button__text">✨ Generate Reply</span>';
    
        controlsContainer.appendChild(instructionsTextarea);
        controlsContainer.appendChild(generateBtn);
    
        // Insert after the block containing the original button
        replyButton.parentNode.insertBefore(controlsContainer, replyButton.nextSibling);
    
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const reviewCard = generateBtn.closest('.gr-review-card.bui-panel');
            
            // If reply form is not open, click the original reply button to open it.
            if (!reviewCard.querySelector('textarea.bui-input-textarea')) {
                replyButton.click();
            }
    
            // Wait for textarea to appear, then generate
            const observer = new MutationObserver((mutations, obs) => {
                if (reviewCard.querySelector('textarea.bui-input-textarea')) {
                    this.generateReplyFromDialog(generateBtn);
                    obs.disconnect(); // Stop observing
                }
            });
            observer.observe(reviewCard, { childList: true, subtree: true });
    
            // Failsafe to stop observer
            setTimeout(() => observer.disconnect(), 5000);
        });
    }

    injectExpediaGenerateButton() {
        // Check if button already exists
        if (document.querySelector('.expedia-helper-generate-btn')) return;
        
        // Find the textarea container
        const textareaContainer = document.querySelector('.uitk-field.has-floatedLabel-label.has-textarea.is-required');
        if (!textareaContainer) return;
        
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'expedia-helper-controls';
        controlsContainer.style.marginTop = '10px';

        // Create instructions textarea
        const instructionsTextarea = document.createElement('textarea');
        instructionsTextarea.className = 'expedia-helper-instructions';
        instructionsTextarea.placeholder = 'Optional: Add specific instructions for this reply...';
        instructionsTextarea.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 8px;
            min-height: 60px;
            resize: vertical;
        `;

        // Create generate button
        const generateBtn = document.createElement('button');
        generateBtn.className = 'expedia-helper-generate-btn';
        generateBtn.textContent = '✨ Generate Reply';
        generateBtn.style.cssText = `
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        controlsContainer.appendChild(instructionsTextarea);
        controlsContainer.appendChild(generateBtn);

        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.generateReplyFromDialog(generateBtn);
        });
        
        generateBtn.addEventListener('mouseenter', () => {
            generateBtn.style.background = '#0052a3';
        });
        
        generateBtn.addEventListener('mouseleave', () => {
            generateBtn.style.background = '#0066cc';
        });
        
        // Insert controls after textarea container
        textareaContainer.parentNode.insertBefore(controlsContainer, textareaContainer.nextSibling);
    }

    extractReviewContent(element) {
        if (this.currentSite === 'expedia') {
            return this.extractExpediaReviewContent();
        } else if (this.currentSite === 'booking') {
            return this.extractBookingReviewContent(element);
        }
        return null;
    }

    extractExpediaReviewContent() {
        // Look for the review card within the response sheet
        const responseSheet = document.querySelector('#app-layer-respond-sheet');
        if (!responseSheet) return null;
        
        // Find the review card within the sheet content
        const reviewCard = responseSheet.querySelectorAll('.uitk-card.uitk-card-roundcorner-all.uitk-card-has-border.uitk-card-padded.uitk-spacing.uitk-spacing-margin-blockstart-four')[1];
        //First card is "do not include guest personal information" second is the review card
        if (!reviewCard) return null;
        
        const reviewData = {
            guestName: 'Withheld',
            dates: '',
            rating: '',
            postedDate: '',
            reviewText: ''
        };
        
        // Extract guest name - it's in an h6 heading
        const nameElement = reviewCard.querySelector('.uitk-heading.uitk-heading-6');
        //if (nameElement) reviewData.guestName = nameElement.textContent.trim();
        //No longer including guest name per expedia policy
        // Extract dates - look for the date text after the name
        const reviewElems = reviewCard.querySelectorAll('.uitk-text.uitk-type-300.uitk-text-default-theme');
        //0: stay date 1: posted date 3: day review content
        reviewData.dates = reviewElems[0].textContent.trim();
        reviewData.postedDate = reviewElems[1].textContent.trim();
        reviewData.reviewText = reviewElems[2].textContent.trim();

        // Extract rating - look for text like "10/10"
        const ratingElement = reviewCard.querySelector('.uitk-text.uitk-type-500.uitk-type-medium.uitk-text-default-theme');
        if (ratingElement) reviewData.rating = ratingElement.textContent.trim();
        return reviewData;
    }

    extractBookingReviewContent(reviewCard) {
        if (!reviewCard) return null;

        const reviewData = {
            guestName: 'Withheld',
            dates: '', // Not available on booking.com in the same way
            rating: '',
            postedDate: '',
            reviewText: '',
            categoryScores: ''
        };
    
        // Guest Name
        const nameElement = reviewCard.querySelector('[data-test-id="review-guest-name"]');
        if (nameElement) {
           // reviewData.guestName = nameElement.textContent.trim().split(',')[0];
           //No longer including guest name per booking.com policy
        }
    
        // Posted Date
        const dateElement = reviewCard.querySelector('.gr-review-score__date');
        if (dateElement) reviewData.postedDate = dateElement.textContent.trim();
    
        // Overall Rating
        const ratingElement = reviewCard.querySelector('.bui-review-score__badge[aria-label]');
        if (ratingElement) reviewData.rating = ratingElement.textContent.trim() + '/10';
    
        // Review Text (Positive and Negative)
        let positiveText = '';
        const positiveEl = reviewCard.querySelector('[data-test-id="positive-text"] .gr-review-card__comment-text');
        if (positiveEl) positiveText = 'Positive: ' + positiveEl.textContent.trim();
    
        let negativeText = '';
        const negativeEl = reviewCard.querySelector('[data-test-id="negative-text"] .gr-review-card__comment-text');
        if (negativeEl) negativeText = 'Negative: ' + negativeEl.textContent.trim();
        
        reviewData.reviewText = [positiveText, negativeText].filter(Boolean).join('\n');
        
        // Category Scores
        const scoreBars = reviewCard.querySelectorAll('.bui-score-bar');
        const scores = [];
        scoreBars.forEach(bar => {
            const titleEl = bar.querySelector('.bui-score-bar__title');
            const scoreEl = bar.querySelector('.bui-score-bar__score');
            if (titleEl && scoreEl) {
                scores.push(`${titleEl.textContent.trim()}: ${scoreEl.textContent.trim()}`);
            }
        });
        if (scores.length > 0) {
            reviewData.categoryScores = scores.join('; ');
        }
        
        // If no text, check for title
        if (!reviewData.reviewText) {
            const titleEl = reviewCard.querySelector('[data-test-id="review-title"]');
            if (titleEl && titleEl.textContent.trim()) {
                reviewData.reviewText = titleEl.textContent.trim();
            }
        }
    
        return reviewData;
    }

    // Simulate realistic input for form fields
    simulateInput(element, value) {
        // Focus the element first
        element.focus();
        
        // Clear existing value
        element.value = '';
        
        // Get the native setter to bypass any framework wrappers
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        
        // Use the appropriate native setter
        if (element.tagName.toLowerCase() === 'textarea') {
            nativeTextAreaValueSetter.call(element, value);
        } else {
            nativeInputValueSetter.call(element, value);
        }
        
        // Create and dispatch events to simulate real user input
        const events = [
            new Event('focus', { bubbles: true }),
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new Event('blur', { bubbles: true })
        ];
        
        events.forEach(event => {
            element.dispatchEvent(event);
        });
        
        // Also try React-specific events if they exist
        if (element._reactInternalFiber || element._reactInternalInstance) {
            // This is a React component, try to trigger React events
            const reactEvent = new Event('input', { bubbles: true });
            reactEvent.simulated = true;
            element.dispatchEvent(reactEvent);
        }
        
        // Try to trigger any onChange handlers manually
        if (element.onchange) {
            element.onchange({ target: element });
        }
        if (element.oninput) {
            element.oninput({ target: element });
        }
    }

    // Stream the response character by character for a typing effect
    async simulateTyping(element, text, delay = 20) {
        element.focus();
        element.value = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            element.value += char;
            
            // Dispatch input event for each character
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Small delay to simulate typing
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Final events
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async generateReply() {
        if (!this.settings.apiKey) {
            this.showStatus('Please enter your OpenRouter API key', 'error');
            return;
        }
        
        this.showStatus('This feature requires being on a review page', 'info');
        this.closeModal();
    }

    async generateReplyFromDialog(clickedButton) {
        if (!this.settings.apiKey) {
            alert('Please configure your API key in settings');
            this.showStatus('Please configure your API key in settings', 'error');
            this.openModal();
            return;
        }

        let reviewData;
        let generateBtn;
        let responseTextarea;
        let nameInput;
        let additionalInstructions = '';
        let container;

        if (this.currentSite === 'expedia') {
            container = document.querySelector('#app-layer-respond-sheet');
            reviewData = this.extractExpediaReviewContent();
            generateBtn = container.querySelector('.expedia-helper-generate-btn');
            responseTextarea = container.querySelector('.uitk-field-textarea.empty-placeholder');
            nameInput = container.querySelector('input[type="text"].uitk-field-input');
            const instructionsEl = container.querySelector('.expedia-helper-instructions');
            if (instructionsEl) additionalInstructions = instructionsEl.value;

        } else if (this.currentSite === 'booking') {
            // For booking, the button is relative to the review card
            container = clickedButton.closest('.gr-review-card.bui-panel');
            reviewData = this.extractBookingReviewContent(container);
            generateBtn = clickedButton;
            responseTextarea = container.querySelector('textarea.bui-input-textarea');
            // Booking.com does not have a separate name input in the reply form
            nameInput = null; 
            const instructionsEl = container.querySelector('.expedia-helper-instructions');
            if (instructionsEl) additionalInstructions = instructionsEl.value;
        }
        
        if (!reviewData) {
            alert('Could not extract review content');
            return;
        }
        
        // Show loading state
        const originalText = generateBtn.textContent;
        generateBtn.textContent = '⏳ Generating...';
        generateBtn.disabled = true;
        
        try {
            if (!responseTextarea) {
                throw new Error('Could not find response textarea');
            }
            
            // Clear the textarea and prepare for streaming
            responseTextarea.focus();
            responseTextarea.value = '';
            responseTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Start streaming the response
            await this.callOpenRouterStreaming(reviewData, responseTextarea, additionalInstructions);
            
            // Fill in the name field after response is complete
            if (nameInput && this.settings.userName && this.currentSite === 'expedia') {
                const fullName = this.settings.userPosition ? 
                    `${this.settings.userName} - ${this.settings.userPosition}` : 
                    this.settings.userName;
                
                // Use improved input simulation
                this.simulateInput(nameInput, fullName);
            }
            
        } catch (error) {
            console.error('Error generating reply:', error);
            alert('Error generating reply: ' + error.message);
        } finally {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
    }

    async callOpenRouterStreaming(reviewData, responseTextarea, additionalInstructions = '') {
        console.log("review data:");
        console.log(reviewData);
        
        let userPrompt = `Guest Name: ${reviewData.guestName}\n`;
        if(reviewData.dates) userPrompt += `Stay Dates: ${reviewData.dates}\n`;
        if(reviewData.rating) userPrompt += `Rating: ${reviewData.rating}\n`;
        if(reviewData.reviewText) userPrompt += `Review: ${reviewData.reviewText}\n`;
        if(reviewData.categoryScores) userPrompt += `Category Ratings:\n${reviewData.categoryScores}\n`;

        userPrompt += `\nPlease generate a professional response to this review following the system instructions.`;

        // Append additional context to the end of system instructions if provided
        const cleanedAdditional = (additionalInstructions || '').trim();
        const systemContent = cleanedAdditional
            ? `${this.settings.systemInstructions}\n\nThe user has added additional context that they would like you to incorporate into your response to the guest: ${cleanedAdditional}`
            : this.settings.systemInstructions;

        return new Promise((resolve, reject) => {
            let responseText = '';
            let streamComplete = false;
            
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://openrouter.ai/api/v1/chat/completions',
                headers: {
                    'Authorization': `Bearer ${this.settings.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Expedia Review Helper'
                },
                data: JSON.stringify({
                    model: this.settings.model,
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: systemContent
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ]
                }),
                timeout: 90000,
                responseType: 'stream',
                onloadstart: function(response) {
                    // Get the ReadableStream from the response
                    const reader = response.response.getReader();
                    
                    // Process the stream
                    const processStream = async () => {
                        try {
                            let isDone = false;
                            
                            while (!isDone && !streamComplete) {
                                const { done, value } = await reader.read();

                                if (done) {
                                    isDone = true;
                                    break;
                                }

                                // Convert the chunk to text
                                const chunk = new TextDecoder().decode(value);
                                
                                // Split by lines - server-sent events format
                                const lines = chunk.split('\n');
                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        const data = line.substring(6).trim();
                                        
                                        // Check for the end of the stream
                                        if (data === '[DONE]') {
                                            isDone = true;
                                            break;
                                        }
                                        
                                        try {
                                            const parsed = JSON.parse(data);
                                            // if the model is a reasoning model, choices[0].delta.reasoning will come first
                                            // discard and continue
                                            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.reasoning && parsed.choices[0].delta.reasoning.length > 0) {
                                                continue;
                                            }

                                            // otherwise, extract the content from delta
                                            else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                                                const content = parsed.choices[0].delta.content;
                                                if (content) {
                                                    responseText += content;
                                                    
                                                    // Update the textarea with the new content
                                                    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                                                    nativeTextAreaValueSetter.call(responseTextarea, responseText);
                                                    
                                                    // Dispatch input event to notify the form
                                                    responseTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                                                    
                                                    // Auto-resize the textarea if needed
                                                    responseTextarea.style.height = 'auto';
                                                    responseTextarea.style.height = responseTextarea.scrollHeight + 'px';
                                                }
                                            }
                                        } catch (e) {
                                            // Ignore parsing errors for malformed chunks
                                            console.debug('Failed to parse chunk:', data);
                                        }
                                    }
                                }
                            }
                            
                            // When done, resolve the promise
                            if (!streamComplete) {
                                streamComplete = true;
                                resolve(responseText);
                            }
                            
                        } catch (error) {
                            console.error('Stream processing error:', error);
                            if (!streamComplete) {
                                streamComplete = true;
                                reject(new Error(`Stream processing error: ${error.toString()}`));
                            }
                        }
                    };
                    
                    processStream().catch(error => {
                        console.error('Unhandled stream error:', error);
                        if (!streamComplete) {
                            streamComplete = true;
                            reject(new Error(`Unhandled stream error: ${error.toString()}`));
                        }
                    });
                },
                onerror: function(error) {
                    if (!streamComplete) {
                        streamComplete = true;
                        reject(new Error('Network request failed'));
                    }
                },
                ontimeout: function() {
                    if (!streamComplete) {
                        streamComplete = true;
                        reject(new Error('Request timed out'));
                    }
                }
            });
        });
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('statusMessage');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        
        setTimeout(() => {
            statusEl.className = 'status-message';
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ExpediaReviewHelper());
} else {
    new ExpediaReviewHelper();
}

})();