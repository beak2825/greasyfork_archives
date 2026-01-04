// ==UserScript==
// @name         Blog Widescreen Responsive
// @namespace    https://greasyfork.org/users/umsibaba
// @version      2.5.0
// @description  Expands blog articles to use full widescreen space by removing restrictive max-width constraints on Substack, Medium, Ghost, WordPress and other platforms
// @author       umsibaba
// @match        https://*.substack.com/*
// @match        https://substack.com/*
// @match        https://*.zerodha.com/*   
// @match        https://*.medium.com/*
// @match        https://medium.com/*
// @match        https://*.ghost.io/*
// @match        https://*.ghost.org/*
// @match        https://*.wordpress.com/*
// @match        https://*.wordpress.org/*
// @match        https://*.blogspot.com/*
// @match        https://*.blogger.com/*
// @match        https://*.dev.to/*
// @match        https://dev.to/*
// @match        https://*.hashnode.dev/*
// @match        https://*.notion.site/*
// @match        https://*.beehiiv.com/*
// @match        https://*.convertkit.com/*
// @match        https://*.mailchimp.com/*
// @match        https://*.github.io/*
// @match        https://*.netlify.app/*
// @match        https://*.vercel.app/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @supportURL   https://greasyfork.org/scripts/yourscriptid/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542170/Blog%20Widescreen%20Responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/542170/Blog%20Widescreen%20Responsive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        maxWidth: GM_getValue('maxWidth', '95%'),
        padding: GM_getValue('padding', '2rem'),
        enabled: GM_getValue('enabled', true),
        preserveReadability: GM_getValue('preserveReadability', false),
        animationDuration: '0.3s'
    };
    
    // Platform-specific selectors using modern CSS techniques
    const PLATFORM_SELECTORS = {
        // Substack selectors
        substack: [
            '.single-post',
            '.post-content',
            '.reader2-post-content',
            '.post-header',
            '.frontend-pencraft-Box-module__Box--4o0Ow',
            'article[data-testid="post-content"]',
            '.post',
            'main article'
        ],
        
        // Medium selectors
        medium: [
            'article',
            '.postArticle-content',
            '.meteredContent',
            'main article',
            '[data-testid="storyBody"]',
            '.ab.cd.ce.cf.cg'
        ],
        
        // Ghost selectors
        ghost: [
            '.post-content',
            '.post-full-content',
            'article.post',
            '.gh-content',
            '.gh-article',
            'main article'
        ],
        
        // WordPress selectors
        wordpress: [
            '.post-content',
            '.entry-content',
            'article.post',
            '.single-post-container',
            'main article',
            '.wp-block-post-content'
        ],
        
        // Dev.to selectors
        devto: [
            '#article-wrapper',
            '.crayons-article',
            'article[data-article-path]',
            'main .crayons-article__main'
        ],
        
        // Hashnode selectors
        hashnode: [
            '.prose',
            'article',
            '.post-content-wrapper'
        ],
        
        // Generic blog selectors
        generic: [
            'article',
            '.post',
            '.post-content',
            '.entry-content',
            '.content',
            'main article',
            '[role="main"] article'
        ]
    };
    
    // Detect platform
    function detectPlatform() {
        const hostname = window.location.hostname.toLowerCase();
        
        if (hostname.includes('substack')) return 'substack';
        if (hostname.includes('medium')) return 'medium';
        if (hostname.includes('ghost')) return 'ghost';
        if (hostname.includes('wordpress') || hostname.includes('wp.')) return 'wordpress';
        if (hostname.includes('dev.to')) return 'devto';
        if (hostname.includes('hashnode')) return 'hashnode';
        
        return 'generic';
    }
    
    // Modern CSS styles using 2024/2025 features
    function createStyles() {
        return `
            /* Blog Widescreen Responsive - Fixed to expand content, not constrain it */
            
            /* CSS Custom Properties for dynamic theming */
            :root {
                --bwr-max-width: ${CONFIG.maxWidth};
                --bwr-padding: ${CONFIG.padding};
                --bwr-transition: all ${CONFIG.animationDuration} ease-in-out;
                --bwr-reading-measure: ${CONFIG.preserveReadability ? '75ch' : 'none'};
            }
            
            /* Remove restrictive max-width constraints from blog platforms */
            ${PLATFORM_SELECTORS[detectPlatform()].concat(PLATFORM_SELECTORS.generic)
                .map(selector => selector)
                .join(',\n            ')} {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
                margin-left: auto !important;
                margin-right: auto !important;
                padding-left: var(--bwr-padding) !important;
                padding-right: var(--bwr-padding) !important;
                transition: var(--bwr-transition) !important;
                box-sizing: border-box !important;
            }
            
            /* Override platform-specific narrow constraints */
            .bwr-enhanced,
            .bwr-enhanced * {
                max-width: none !important;
            }
            
            /* Re-apply our desired max-width only to the main container */
            .bwr-enhanced {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
                margin: 0 auto !important;
                padding-left: var(--bwr-padding) !important;
                padding-right: var(--bwr-padding) !important;
            }
            
            /* Typography enhancement - only if preserveReadability is enabled */
            ${CONFIG.preserveReadability ? `
            .bwr-enhanced :where(p, li, blockquote) {
                max-width: var(--bwr-reading-measure) !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }` : ''}
            
            /* Responsive images and media - make them use full available width */
            .bwr-enhanced :where(img, video, iframe, embed, object, figure) {
                max-width: 100% !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
            
            /* Code blocks responsive handling */
            .bwr-enhanced :where(pre, code) {
                max-width: 100% !important;
                overflow-x: auto !important;
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
            }
            
            /* Platform-specific fixes to remove narrow constraints */
            
            /* Substack specific overrides */
            .substack-post-content,
            .single-post,
            .post-content,
            .reader2-post-content,
            .frontend-pencraft-Box-module__Box--4o0Ow {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
            }
            
            /* Medium specific overrides */
            .postArticle-content,
            .meteredContent,
            [data-testid="storyBody"] {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
            }
            
            /* Ghost specific overrides */
            .post-content,
            .post-full-content,
            .gh-content,
            .gh-article {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
            }
            
            /* WordPress specific overrides */
            .entry-content,
            .post-content,
            .wp-block-post-content {
                max-width: var(--bwr-max-width) !important;
                width: 100% !important;
            }
            
            /* Responsive breakpoints */
            @media (max-width: 768px) {
                .bwr-enhanced {
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                }
            }
            
            @media (min-width: 1600px) {
                .bwr-enhanced {
                    max-width: 95% !important;
                }
            }
            
            @media (min-width: 1920px) {
                .bwr-enhanced {
                    max-width: 90% !important;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .bwr-enhanced {
                    color-scheme: dark;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .bwr-enhanced {
                    transition: none !important;
                }
            }
            
            /* Status indicator */
            .bwr-status {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #4CAF50;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-family: system-ui, -apple-system, sans-serif;
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                cursor: pointer;
                user-select: none;
            }
            
            .bwr-status.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .bwr-status.disabled {
                background: #f44336;
            }
        `;
    }
    
    // Enhanced element detection using modern selectors
    function findContentElements() {
        const platform = detectPlatform();
        const selectors = PLATFORM_SELECTORS[platform].concat(PLATFORM_SELECTORS.generic);
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                return Array.from(elements).filter(el => {
                    // Use getBoundingClientRect for better detection
                    const rect = el.getBoundingClientRect();
                    return rect.width > 100 && rect.height > 100;
                });
            }
        }
        
        return [];
    }
    
    // Apply enhancements to elements
    function applyEnhancements() {
        if (!CONFIG.enabled) return;
        
        const elements = findContentElements();
        
        elements.forEach(element => {
            if (!element.classList.contains('bwr-enhanced')) {
                element.classList.add('bwr-enhanced');
                
                // Add container query support for modern browsers
                if (CSS.supports('container-type: inline-size')) {
                    element.style.containerType = 'inline-size';
                }
            }
        });
        
        showStatus(`Enhanced ${elements.length} elements`);
    }
    
    // Status notification
    function showStatus(message) {
        let status = document.querySelector('.bwr-status');
        if (!status) {
            status = document.createElement('div');
            status.className = 'bwr-status';
            status.addEventListener('click', toggleScript);
            document.body.appendChild(status);
        }
        
        status.textContent = CONFIG.enabled ? `✓ BWR: ${message}` : '✗ BWR: Disabled';
        status.classList.toggle('disabled', !CONFIG.enabled);
        status.classList.add('show');
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }
    
    // Toggle script functionality
    function toggleScript() {
        CONFIG.enabled = !CONFIG.enabled;
        GM_setValue('enabled', CONFIG.enabled);
        
        if (CONFIG.enabled) {
            applyEnhancements();
        } else {
            document.querySelectorAll('.bwr-enhanced').forEach(el => {
                el.classList.remove('bwr-enhanced');
            });
        }
        
        showStatus(CONFIG.enabled ? 'Enabled' : 'Disabled');
    }
    
    // Settings management
    function openSettings() {
        const newMaxWidth = prompt('Enter max width (e.g., 95%, 1400px, or 100%):', CONFIG.maxWidth);
        if (newMaxWidth) {
            CONFIG.maxWidth = newMaxWidth;
            GM_setValue('maxWidth', newMaxWidth);
        }
        
        const newPadding = prompt('Enter side padding (e.g., 2rem, 20px):', CONFIG.padding);
        if (newPadding) {
            CONFIG.padding = newPadding;
            GM_setValue('padding', newPadding);
        }
        
        const preserveReadability = confirm('Limit paragraph width for better readability? (Unchecked = full width)');
        CONFIG.preserveReadability = preserveReadability;
        GM_setValue('preserveReadability', preserveReadability);
        
        // Reapply styles with new settings
        initializeScript();
        showStatus('Settings updated');
    }
    
    // Main initialization
    function initializeScript() {
        // Inject CSS
        GM_addStyle(createStyles());
        
        // Apply enhancements immediately
        applyEnhancements();
        
        // Use modern ResizeObserver for better performance
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                applyEnhancements();
            });
            resizeObserver.observe(document.body);
        }
        
        // Fallback to MutationObserver for content changes
        const mutationObserver = new MutationObserver((mutations) => {
            let shouldReapply = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    shouldReapply = true;
                }
            });
            
            if (shouldReapply) {
                setTimeout(applyEnhancements, 100);
            }
        });
        
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Register menu commands
    GM_registerMenuCommand('Toggle Blog Widescreen', toggleScript);
    GM_registerMenuCommand('BWR Settings', openSettings);
    
    // Wait for DOM and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
    
    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(applyEnhancements, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();