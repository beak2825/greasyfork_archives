// ==UserScript==
// @name         Red Dead Resolver - Forum Report Resolver
// @namespace    waiter7
// @version      1.3
// @description  Ready, aim, fire! Quickly resolve and report editing threads.
// @author       waiter7
// @homepageURL  https://gitlab.com/waiter77/red-dead-resolver
// @license      MIT
// @match        https://redacted.sh/forums.php*
// @match        https://orpheus.network/forums.php*
// @match        https://redacted.sh/reports.php*
// @match        https://orpheus.network/reports.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544342/Red%20Dead%20Resolver%20-%20Forum%20Report%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/544342/Red%20Dead%20Resolver%20-%20Forum%20Report%20Resolver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const CONFIG = {
        DEFAULT_REPLY: safeGM_getValue('defaultReply', "Thanks for reporting! Fixed."),
        AUTO_REFRESH: safeGM_getValue('autoRefresh', true),
        AUTO_SIGNATURE: safeGM_getValue('autoSignature', true),
        FORUMS: { 'redacted.sh': 10, 'orpheus.network': 34 }
    };
    
    const SELECTORS = {
        linkbox: '.linkbox .center',
        reportLink: 'a[href*="reports.php?action=report&type=thread"]',
        replyBox: '#reply_box',
        textarea: '#quickpost',
        submitButton: '#submit_button',
        reportForm: '#report_form',
        reportThreadId: 'input[name="id"]'
    };
    
    // Cross-browser compatible style injection
    function injectStyles(css) {
        try {
            // Try GM_addStyle first (Tampermonkey/Violentmonkey)
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(css);
                return;
            }
        } catch (e) {
            console.warn('GM_addStyle failed, using fallback method');
        }
        
        // Fallback method for Greasemonkey and other cases
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    // Add styles with cross-browser compatibility
    injectStyles(`
        .resolver-error { 
            color: #ff0000; 
            border: 1px solid rgb(116, 10, 10); 
            padding: 10px; 
            margin-bottom: 10px; 
            border-radius: 4px; 
        }
        .resolver-success { 
            color: #4CAF50; 
            padding: 10px; 
            margin-bottom: 10px; 
            border-radius: 4px; 
            text-align: center; 
        }
        .resolver-checkmark { 
            color: #00ff00; 
            font-weight: bold; 
        }
        .resolver-resolve-button { 
            margin-right: 10px; 
        }
        .resolver-reply-resolve-button {}
        .resolver-settings { 
            margin-left: 10px; 
            font-size: 0.9em; 
        }
        .resolver-dropdown { 
            display: none; 
            margin-top: 10px; 
            padding: 10px !important;
            border: 1px solid #404040;
            border-radius: 4px;
        }
    `);
    
    // Utility functions with cross-browser compatibility
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    
    // Cross-browser compatible GM functions
    function safeGM_getValue(key, defaultValue) {
        try {
            return GM_getValue(key, defaultValue);
        } catch (e) {
            console.warn('GM_getValue failed, using localStorage fallback');
            try {
                const stored = localStorage.getItem(`red_dead_resolver_${key}`);
                return stored ? JSON.parse(stored) : defaultValue;
            } catch (e2) {
                console.error('LocalStorage fallback also failed:', e2);
                return defaultValue;
            }
        }
    }
    
    function safeGM_setValue(key, value) {
        try {
            GM_setValue(key, value);
        } catch (e) {
            console.warn('GM_setValue failed, using localStorage fallback');
            try {
                localStorage.setItem(`red_dead_resolver_${key}`, JSON.stringify(value));
            } catch (e2) {
                console.error('LocalStorage fallback also failed:', e2);
            }
        }
    }
    
    // DOM cache for frequently accessed elements
    const domCache = {
        elements: new Map(),
        get: function(selector) {
            if (!this.elements.has(selector)) {
                this.elements.set(selector, $(selector));
            }
            return this.elements.get(selector);
        },
        clear: function() {
            this.elements.clear();
        }
    };
    
    // Debounce utility for performance
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
    
    function isEditingForum() {
        const hostname = window.location.hostname;
        const forumId = CONFIG.FORUMS[hostname];
        if (!forumId) return false;
        const breadcrumbs = $('.breadcrumbs');
        return breadcrumbs && breadcrumbs.querySelector(`a[href*="forumid=${forumId}"]`);
    }
    
    function isReportPage() {
        return window.location.pathname.includes('reports.php') && 
               window.location.search.includes('action=report') &&
               window.location.search.includes('type=thread');
    }
    
    function getAuthKey() {
        // Try to get auth key from script tag first (RED style)
        const script = Array.from($$('script')).find(s => s.textContent.includes('var authkey'));
        const match = script?.textContent.match(/var authkey = "([^"]+)"/);
        if (match) return match[1];
        
        // Try to get auth key from form input (OPS style)
        const authInput = $('input[name="auth"]');
        if (authInput) return authInput.value;
        
        // Try to get auth key from body data attribute (OPS style)
        const body = document.body;
        if (body && body.dataset.auth) return body.dataset.auth;
        
        return null;
    }
    
    function getThreadId() {
        // Check for thread ID in forum pages - try multiple field names
        const threadIdInputs = [
            $('input[name="thread"]'),      // RED style
            $('input[name="threadid"]'),    // OPS style
            $('input[name="id"]')           // Report page style
        ];
        
        for (const input of threadIdInputs) {
            if (input && input.value) return input.value;
        }
        
        // Try to extract from URL
        const urlMatch = window.location.search.match(/[?&]threadid=(\d+)/);
        if (urlMatch) return urlMatch[1];
        
        return null;
    }
    
    function isResolved() {
        const threadId = getThreadId();
        return threadId && safeGM_getValue('resolvedThreads', []).includes(threadId);
    }
    
    function markAsResolved() {
        const threadId = getThreadId();
        if (!threadId) return;
        
        const resolvedThreads = safeGM_getValue('resolvedThreads', []);
        if (!resolvedThreads.includes(threadId)) {
            resolvedThreads.push(threadId);
            safeGM_setValue('resolvedThreads', resolvedThreads);
        }
        
        const reportLink = $(SELECTORS.reportLink);
        if (reportLink) {
            reportLink.style.opacity = '0.5';
            if (!reportLink.querySelector('.resolver-checkmark')) {
                const checkmark = document.createElement('span');
                checkmark.className = 'resolver-checkmark';
                checkmark.innerHTML = ' ✓';
                reportLink.appendChild(checkmark);
            }
        }
        
        $$('.resolver-resolve-button, .resolver-reply-resolve-button, .resolver-settings-icon').forEach(btn => btn.style.display = 'none');
    }
    
    async function submitForm(endpoint, data) {
        const authKey = getAuthKey();
        const threadId = getThreadId();
        
        if (!authKey || !threadId) {
            console.error('Auth key:', authKey, 'Thread ID:', threadId);
            throw new Error('Could not extract auth key or thread ID');
        }
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));
        
        const response = await fetch(endpoint, { method: 'POST', body: formData });
        if (!response.ok) throw new Error(`${endpoint} submission failed: ${response.status}`);
        return response;
    }
    
    async function resolveAndReport(customMessage = null) {
        try {
            let message = customMessage || CONFIG.DEFAULT_REPLY;
            
            // Append the resolver signature to the message if enabled
            if (CONFIG.AUTO_SIGNATURE) {
                const resolverSignature = "\n\n\n[size=1][align=right][img=https://ptpimg.me/fdw703.png] Reported as Resolved via [url=https://redacted.sh/forums.php?action=viewthread&threadid=73924]Red Dead Resolver[/url][/align][/size]";
                message += resolverSignature;
            }
            
            const hostname = window.location.hostname;
            const isOPS = hostname === 'orpheus.network';
            
            // Handle different field names for RED vs OPS
            const replyData = {
                action: 'reply',
                auth: getAuthKey()
            };
            
            if (isOPS) {
                // OPS uses threadid and quickpost
                replyData.threadid = getThreadId();
                replyData.quickpost = message;
            } else {
                // RED uses thread and body
                replyData.thread = getThreadId();
                replyData.body = message;
            }
            
            await submitForm('forums.php', replyData);
            
            await submitForm('reports.php', {
                action: 'takereport',
                auth: getAuthKey(),
                id: getThreadId(),
                type: 'thread',
                reason: "Resolved! (via Red Dead Resolver)"
            });
            
            markAsResolved();
            
            const replyBox = domCache.get(SELECTORS.replyBox);
            if (replyBox) {
                const successDiv = document.createElement('div');
                successDiv.className = 'resolver-success';
                successDiv.textContent = 'Successfully resolved and reported (pew pew)!';
                replyBox.insertBefore(successDiv, replyBox.firstChild);
            }
            
            const textarea = domCache.get(SELECTORS.textarea);
            if (textarea) textarea.value = '';
            
            if (CONFIG.AUTO_REFRESH) {
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            console.error('Red Dead Resolver error:', error);
            showError(error.message);
        }
    }
    
    function showError(message) {
        const replyBox = domCache.get(SELECTORS.replyBox);
        if (!replyBox) return;
        
        const existingError = replyBox.querySelector('.resolver-error');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'resolver-error';
        errorDiv.textContent = `Error: ${message}. Please reply and resolve manually.`;
        replyBox.insertBefore(errorDiv, replyBox.firstChild);
        errorDiv.scrollIntoView({ behavior: 'smooth' });
        
        const textarea = domCache.get(SELECTORS.textarea);
        if (textarea && !textarea.value.trim()) {
            textarea.value = CONFIG.DEFAULT_REPLY;
        }
    }
    
    // Event handlers
    function handleResolveClick(e) {
        e.preventDefault();
        const btn = e.target;
        
        if (btn.textContent === 'Confirm?') {
            btn.style.pointerEvents = 'none';
            btn.textContent = 'Processing...';
            resolveAndReport();
            return;
        }
        
        const originalText = btn.textContent;
        btn.textContent = 'Confirm?';
        btn.style.color = '#ff8c00';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
        }, 3000);
    }
    
    function handleReplyResolveClick(e) {
        const textarea = $(SELECTORS.textarea);
        let message = textarea?.value.trim() || '';
        
        if (!message) {
            message = CONFIG.DEFAULT_REPLY;
            if (textarea) textarea.value = message;
        }
        
        e.target.disabled = true;
        e.target.value = 'Processing...';
        resolveAndReport(message);
    }
    
    // Debounced toggle to prevent rapid clicking issues
    const debouncedToggle = debounce(function() {
        const dropdown = domCache.get('#resolver-settings-dropdown');
        if (!dropdown) return;
        
        const isVisible = dropdown.style.display !== 'none';
        
        if (isVisible) {
            // Hide dropdown
            dropdown.style.display = 'none';
        } else {
            // Show dropdown
            dropdown.style.display = 'block';
        }
    }, 100);
    
    function toggleSettingsDropdown() {
        debouncedToggle();
    }
    
    function saveSettings() {
        const defaultReply = $('#resolver-default-reply').value;
        const autoRefresh = $('#resolver-auto-refresh').checked;
        const autoSignature = $('#resolver-auto-signature').checked;
        
        safeGM_setValue('defaultReply', defaultReply);
        safeGM_setValue('autoRefresh', autoRefresh);
        safeGM_setValue('autoSignature', autoSignature);
        
        CONFIG.DEFAULT_REPLY = defaultReply;
        CONFIG.AUTO_REFRESH = autoRefresh;
        CONFIG.AUTO_SIGNATURE = autoSignature;
        
        toggleSettingsDropdown();
    }
    
    function handleManualReport() {
        const reportForm = $(SELECTORS.reportForm);
        if (!reportForm) return;
        
        // Add visual indicator that this will be tracked
        const submitButton = reportForm.querySelector('input[type="submit"]');
        if (submitButton) {
            const indicator = document.createElement('div');
            indicator.className = 'resolver-success';
            indicator.style.marginTop = '10px';
            indicator.textContent = '✓ Tracked by Red Dead Resolver';
            submitButton.parentNode.insertBefore(indicator, submitButton.nextSibling);
        }
        
        reportForm.addEventListener('submit', function(e) {
            const threadId = getThreadId();
            if (!threadId) return;
            
            // Mark as resolved when form is submitted
            const resolvedThreads = safeGM_getValue('resolvedThreads', []);
            if (!resolvedThreads.includes(threadId)) {
                resolvedThreads.push(threadId);
                safeGM_setValue('resolvedThreads', resolvedThreads);
            }
        });
    }
    
    // Add UI elements
    function addButtons() {
        const linkbox = domCache.get(SELECTORS.linkbox);
        if (!linkbox) return;
        
        const reportLink = linkbox.querySelector(SELECTORS.reportLink);
        if (!reportLink || isResolved()) return;
        
        // Resolve button (add after "Search this thread")
        const searchThreadLink = linkbox.querySelector('a[id="thread-search"], a[onclick*="searchthread"]');
        if (searchThreadLink) {
            const resolveBtn = document.createElement('a');
            resolveBtn.href = '#';
            resolveBtn.className = 'brackets resolver-resolve-button';
            resolveBtn.textContent = '✓ Quick Resolve';
            searchThreadLink.parentNode.insertBefore(resolveBtn, searchThreadLink.nextSibling);
            
            // Add settings link after the resolve button
            const settingsLink = document.createElement('a');
            settingsLink.href = '#';
            settingsLink.className = 'resolver-settings-icon';
            settingsLink.innerHTML = '<small>(Settings)</small>';
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSettingsDropdown();
            });
            searchThreadLink.parentNode.insertBefore(settingsLink, resolveBtn.nextSibling);
        }
        
        // Reply and resolve button
        const submitBtn = domCache.get(SELECTORS.submitButton);
        if (submitBtn) {
            const replyBtn = document.createElement('input');
            replyBtn.type = 'button';
            replyBtn.className = 'resolver-reply-resolve-button';
            replyBtn.value = 'Post Reply and Resolve';
            submitBtn.parentNode.appendChild(replyBtn);
        }
        
        // Settings dropdown
        const dropdown = document.createElement('div');
        dropdown.id = 'resolver-settings-dropdown';
        dropdown.className = 'box pad resolver-dropdown';
        dropdown.style.display = 'none';
        dropdown.style.maxWidth = '50%';
        dropdown.style.margin = '0 auto';
        dropdown.style.textAlign = 'center';
        dropdown.innerHTML = `
            <h4 style="text-align: center; margin-bottom: 15px;">Red Dead Resolver Settings</h4>
            <div class="field_div" style="text-align: left;">
                <label for="resolver-default-reply">Default Reply Message:</label>
                <textarea id="resolver-default-reply" rows="3" class="required" style="width: 100%;">${CONFIG.DEFAULT_REPLY}</textarea>
            </div>
            <div class="field_div" style="text-align: left;">
                <label><input type="checkbox" id="resolver-auto-refresh" ${CONFIG.AUTO_REFRESH ? 'checked' : ''}> Auto-refresh on success</label>
            </div>
            <div class="field_div" style="text-align: left;">
                <label><input type="checkbox" id="resolver-auto-signature" ${CONFIG.AUTO_SIGNATURE ? 'checked' : ''}> Auto-add resolver signature</label>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <input type="button" id="resolver-save-settings" value="Save" class="button-primary">
                <input type="button" id="resolver-cancel-settings" value="Cancel" class="button-secondary" style="margin-left: 10px;">
            </div>
        `;
        linkbox.appendChild(dropdown);
    }
    
    // Event delegation
    document.addEventListener('click', (e) => {
        if (e.target.matches('.resolver-resolve-button')) handleResolveClick(e);
        if (e.target.matches('.resolver-reply-resolve-button')) handleReplyResolveClick(e);
        if (e.target.matches('.resolver-settings') || e.target.matches('.resolver-settings-icon')) toggleSettingsDropdown();
        if (e.target.matches('#resolver-save-settings')) saveSettings();
        if (e.target.matches('#resolver-cancel-settings')) toggleSettingsDropdown();
    });
    
    // Initialize
    function init() {
        // Clear DOM cache on each initialization
        domCache.clear();
        
        // Ensure DOM is ready
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }
        
        if (isReportPage()) {
            handleManualReport();
            return;
        }
        
        if (!isEditingForum()) return;
        
        // Clear any existing draft content in the textarea
        const textarea = domCache.get(SELECTORS.textarea);
        if (textarea) {
            textarea.value = '';
        }
        
        addButtons();
        
        if (isResolved()) {
            markAsResolved();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 