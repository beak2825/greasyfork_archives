// ==UserScript==
// @name         Unlock Unlimited Medium
// @namespace    https://github.com/htrnguyen/User-Scripts/tree/main/Unlock-Unlimited-Medium
// @version      2.0
// @description  Unlock all Medium-based articles via freedium.cfd with enhanced detection and performance optimizations
// @author       Hà Trọng Nguyễn
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @supportURL   https://github.com/htrnguyen/User-Scripts/tree/main/Unlock-Unlimited-Medium/issues
// @homepage     https://freedium.cfd/
// @icon         https://github.com/htrnguyen/User-Scripts/raw/main/Unlock-Unlimited-Medium/Unlock%20Unlimited%20Medium%20Logo.png
// @downloadURL https://update.greasyfork.org/scripts/522818/Unlock%20Unlimited%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/522818/Unlock%20Unlimited%20Medium.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // Configuration
    const CONFIG = {
        FREEDIUM_BASE: 'https://freedium.cfd/',
        BUTTON_POSITION: GM_getValue('buttonPosition', 'bottom-right'),
        SHOW_NOTIFICATIONS: GM_getValue('showNotifications', true),
        DETECTION_INTERVAL: 1000, // ms
        CACHE_DURATION: 300000 // 5 minutes
    }

    // Cache để tránh kiểm tra lại nhiều lần
    const cache = new Map()
    let isProcessing = false
    let unlockButton = null

    // Utility functions
    const debounce = (func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func.apply(null, args), delay)
        }
    }

    const throttle = (func, limit) => {
        let inThrottle
        return (...args) => {
            if (!inThrottle) {
                func.apply(null, args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }

    // Enhanced URL generation with fallback options
    function generateFreediumURL(originalUrl) {
        try {
            const cleanUrl = originalUrl.split('?')[0].split('#')[0]
            return `${CONFIG.FREEDIUM_BASE}${cleanUrl}`
        } catch (error) {
            console.warn('Failed to generate Freedium URL:', error)
            return `${CONFIG.FREEDIUM_BASE}${originalUrl}`
        }
    }

    // Enhanced Medium detection with caching
    function isMediumSite() {
        const hostname = window.location.hostname.toLowerCase()
        const cacheKey = `medium-site-${hostname}`
        
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey)
        }

        const mediumDomains = [
            'medium.com',
            'osintteam.blog',
            'towardsdatascience.com',
            'hackernoon.com',
            'levelup.gitconnected.com',
            'javascript.plainenglish.io',
            'betterprogramming.pub',
            'infosecwriteups.com'
        ]

        const isMedium = mediumDomains.some(domain => hostname.includes(domain)) ||
                        detectMediumByContent()

        cache.set(cacheKey, isMedium)
        setTimeout(() => cache.delete(cacheKey), CONFIG.CACHE_DURATION)
        
        return isMedium
    }

    // Enhanced content-based Medium detection
    function detectMediumByContent() {
        const indicators = [
            // Logo selectors
            'a[data-testid="headerMediumLogo"]',
            'a[aria-label="Homepage"]',
            'svg[data-testid="mediumLogo"]',
            
            // Meta tags
            'meta[property="al:web:url"][content*="medium.com"]',
            'meta[name="twitter:app:name:iphone"][content="Medium"]',
            'meta[property="og:site_name"][content="Medium"]',
            
            // Class patterns
            '.meteredContent',
            '[data-module-result="stream"]',
            '.js-postListHandle'
        ]

        return indicators.some(selector => document.querySelector(selector))
    }

    // Enhanced link detection
    function isMediumArticleLink(link) {
        try {
            const url = new URL(link.href)
            const hostname = url.hostname.toLowerCase()
            
            // Direct domain check
            const mediumDomains = ['medium.com', 'osintteam.blog']
            if (mediumDomains.some(domain => hostname.includes(domain))) {
                return true
            }

            // Check for article patterns
            const articlePatterns = [
                /\/[a-f0-9-]{36}$/,  // Medium article ID pattern
                /\/@[\w-]+\/[\w-]+/,  // Author/article pattern
                /\/p\/[a-f0-9-]+$/    // Publication pattern
            ]

            if (articlePatterns.some(pattern => pattern.test(url.pathname))) {
                return true
            }

            // Check parent elements for Medium indicators
            const parent = link.closest('article, .postArticle, [data-testid="story-container"]')
            if (parent && parent.querySelector('svg[data-testid="mediumLogo"], .clap-count, [data-testid="applauseButton"]')) {
                return true
            }

        } catch (error) {
            console.debug('Error checking Medium link:', error)
        }
        
        return false
    }

    // Open article in Freedium
    function openFreediumArticle(mediumUrl) {
        const freediumUrl = generateFreediumURL(mediumUrl)
        
        if (CONFIG.SHOW_NOTIFICATIONS) {
            showNotification('Opening in Freedium...', 'info')
        }
        
        GM_openInTab(freediumUrl, { active: true })
    }

    // Create and manage unlock button
    function createUnlockButton() {
        if (unlockButton) return

        const btn = document.createElement('button')
        btn.innerHTML = '🔓 <span>Unlock</span>'
        btn.title = 'Unlock this Medium article'
        
        // Enhanced styling
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: CONFIG.BUTTON_POSITION.includes('bottom') ? '20px' : 'auto',
            top: CONFIG.BUTTON_POSITION.includes('top') ? '20px' : 'auto',
            right: CONFIG.BUTTON_POSITION.includes('right') ? '20px' : 'auto',
            left: CONFIG.BUTTON_POSITION.includes('left') ? '20px' : 'auto',
            zIndex: '10000',
            padding: '12px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#fff',
            backgroundColor: '#1a8917',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        })

        // Hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#156f12'
            btn.style.transform = 'translateY(-2px)'
            btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)'
        })

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#1a8917'
            btn.style.transform = 'translateY(0)'
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
        })

        btn.addEventListener('click', throttle(() => {
            openFreediumArticle(window.location.href)
        }, 1000))

        document.body.appendChild(btn)
        unlockButton = btn

        // Auto-hide button after inactivity
        let hideTimeout
        const resetHideTimeout = () => {
            clearTimeout(hideTimeout)
            btn.style.opacity = '1'
            hideTimeout = setTimeout(() => {
                btn.style.opacity = '0.7'
            }, 5000)
        }

        document.addEventListener('mousemove', resetHideTimeout)
        resetHideTimeout()
    }

    // Show notifications
    function showNotification(message, type = 'info') {
        if (!CONFIG.SHOW_NOTIFICATIONS) return

        const notification = document.createElement('div')
        notification.textContent = message
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '10001',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#fff',
            backgroundColor: type === 'error' ? '#dc3545' : '#28a745',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            transition: 'all 0.3s ease'
        })

        document.body.appendChild(notification)
        
        setTimeout(() => {
            notification.style.opacity = '0'
            notification.style.transform = 'translateY(-20px)'
            setTimeout(() => notification.remove(), 300)
        }, 3000)
    }

    // Process all links on the page - chỉ để nhận diện, không thêm visual indicator
    function processLinks() {
        if (isProcessing) return
        isProcessing = true

        try {
            const links = document.querySelectorAll('a[href]:not([data-medium-processed])')
            let processedCount = 0

            links.forEach(link => {
                if (isMediumArticleLink(link)) {
                    link.setAttribute('data-medium-processed', 'true')
                    processedCount++
                }
            })

            console.log(`Identified ${processedCount} Medium links`)
        } catch (error) {
            console.error('Error processing links:', error)
        } finally {
            isProcessing = false
        }
    }

    // Debounced link processing for dynamic content
    const debouncedProcessLinks = debounce(processLinks, 500)

    // Initialize script
    function initialize() {
        console.log('Unlock Unlimited Medium: Initializing...')

        // Register menu commands
        GM_registerMenuCommand('🔓 Unlock Current Page', () => {
            openFreediumArticle(location.href)
        })

        GM_registerMenuCommand('🔔 Toggle Notifications', () => {
            CONFIG.SHOW_NOTIFICATIONS = !CONFIG.SHOW_NOTIFICATIONS
            GM_setValue('showNotifications', CONFIG.SHOW_NOTIFICATIONS)
            showNotification(`Notifications ${CONFIG.SHOW_NOTIFICATIONS ? 'enabled' : 'disabled'}`)
        })

        // Check if we're on a Medium site
        if (isMediumSite()) {
            console.log('Medium site detected')
            
            // Tạo nút unlock (không auto-redirect)
            createUnlockButton()
        }

        // Process existing links (chỉ để nhận diện, không can thiệp)
        processLinks()

        // Set up observers for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const hasNewLinks = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === Node.ELEMENT_NODE && 
                        (node.tagName === 'A' || node.querySelector('a'))
                    )
                    if (hasNewLinks) shouldProcess = true
                }
            })

            if (shouldProcess) {
                debouncedProcessLinks()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        console.log('Unlock Unlimited Medium: Initialized successfully')
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize)
    } else {
        initialize()
    }

})();
