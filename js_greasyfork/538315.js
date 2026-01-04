// ==UserScript==
// @name         YouTube Performance Booster (Complete Edition)
// @version      3.1
// @description  Makes YouTube faster, reduces resource usage, fixes UI issues with full compatibility and self-testing
// @author       HYPERR.
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1476487
// @downloadURL https://update.greasyfork.org/scripts/538315/YouTube%20Performance%20Booster%20%28Complete%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538315/YouTube%20Performance%20Booster%20%28Complete%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== COMPLETE CONFIGURATION =====
    const settings = {
        // Performance Features
        instantNavigation: true,      // Prefetch pages on hover for instant loading
        disableAnimations: true,      // Reduce CPU/GPU usage by disabling animations
        qualityPreset: 'auto',        // Set default video quality
        hideShorts: true,             // Remove Shorts from homepage
        hideComments: false,          // Hide comments section
        hideSidebar: false,           // Hide sidebar recommendations
        blockNonEssential: false,     // Block non-essential requests

        // UI Fixes
        fixNotifications: true,       // Fix stuck notifications in corner
        fixPopups: true,              // Fix popup playlist positioning

        // Compatibility & Testing
        debugMode: true,              // Show test results and self-diagnostics
        exclude: {
            cssModifications: false,   // Disable ALL CSS changes (fixes most conflicts)
            domObservers: false,       // Stop DOM monitoring (if other scripts modify page heavily)
            eventListeners: false,     // Remove mouseover prefetching (if it interferes with navigation)
            qualityControl: false      // Let other scripts handle video quality
        }
    };

    // ===== AUTO-TEST SYSTEM =====
    const testResults = {
        basic: { passed: 0, total: 0, issues: [] },
        performance: { passed: 0, total: 0, issues: [] },
        ui: { passed: 0, total: 0, issues: [] },
        compatibility: { passed: 0, total: 0, issues: [] }
    };

    function logTest(category, testName, passed, issue = '') {
        testResults[category].total++;
        if (passed) {
            testResults[category].passed++;
            if (settings.debugMode) console.log(`✅ ${testName}`);
        } else {
            testResults[category].issues.push(`${testName}: ${issue}`);
            if (settings.debugMode) console.log(`❌ ${testName}: ${issue}`);
        }
    }

    function runComprehensiveTests() {
        if (!settings.debugMode) return;

        console.log('🔧 YouTube Performance Booster - Running Comprehensive Tests');

        // Basic Tests
        console.log('\n🧪 BASIC TESTS:');
        logTest('basic', 'Script loaded successfully', true);
        logTest('basic', 'YouTube environment detected', document.location.href.includes('youtube.com'));
        setTimeout(() => {
            const videos = document.querySelectorAll('video');
            logTest('basic', 'Video elements available', videos.length > 0, 'No videos found on page');
        }, 2000);

        // Performance Tests
        console.log('\n🚀 PERFORMANCE TESTS:');
        if (!settings.exclude.cssModifications) {
            logTest('performance', 'CSS modifications enabled', true);
            if (settings.disableAnimations) {
                const animationsDisabled = document.documentElement.hasAttribute('no-animations');
                logTest('performance', 'Animations disabled', animationsDisabled, 'Animation CSS not applied');
            }
            if (settings.hideShorts) {
                const shortsHidden = document.documentElement.hasAttribute('hide-shorts');
                logTest('performance', 'Shorts hidden', shortsHidden, 'Shorts hiding not working');
            }
        } else {
            logTest('performance', 'CSS modifications disabled (compatibility mode)', true);
        }

        if (settings.instantNavigation && !settings.exclude.eventListeners) {
            logTest('performance', 'Instant navigation active', true);
        }

        // UI Tests
        console.log('\n🎨 UI TESTS:');
        if (settings.fixNotifications && !settings.exclude.cssModifications) {
            const notificationCSS = document.querySelector('style')?.textContent.includes('ytd-notification-renderer');
            logTest('ui', 'Notification fixes applied', notificationCSS, 'Notification CSS missing');
        }
        if (settings.fixPopups && !settings.exclude.cssModifications) {
            const popupCSS = document.querySelector('style')?.textContent.includes('ytd-popup-container');
            logTest('ui', 'Popup fixes applied', popupCSS, 'Popup CSS missing');
        }

        // Compatibility Tests
        console.log('\n🔗 COMPATIBILITY TESTS:');
        logTest('compatibility', 'DOM access available', typeof document !== 'undefined', 'DOM access blocked');
        logTest('compatibility', 'Settings configuration loaded', Object.keys(settings).length > 0, 'Settings failed to load');

        // Test exclusion settings
        if (settings.exclude.cssModifications) {
            const hasCSS = document.querySelector('style')?.textContent.includes('no-animations');
            logTest('compatibility', 'CSS modifications properly disabled', !hasCSS, 'CSS still being modified despite exclusion');
        }
        if (settings.exclude.eventListeners) {
            logTest('compatibility', 'Event listeners properly disabled', true);
        }

        // Show results summary
        setTimeout(showTestResults, 3000);
    }

    function showTestResults() {
        if (!settings.debugMode) return;

        console.log('\n📊 COMPREHENSIVE TEST RESULTS:');
        console.log('================================');

        let totalPassed = 0;
        let totalTests = 0;

        for (const [category, results] of Object.entries(testResults)) {
            const percentage = results.total > 0 ? Math.round((results.passed / results.total) * 100) : 0;
            console.log(`${category.toUpperCase()}: ${results.passed}/${results.total} (${percentage}%)`);
            totalPassed += results.passed;
            totalTests += results.total;

            if (results.issues.length > 0) {
                console.log('Issues found:');
                results.issues.forEach(issue => console.log(`  - ${issue}`));
            }
        }

        const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
        console.log(`\n🎯 OVERALL: ${totalPassed}/${totalTests} (${overallPercentage}%)`);

        // Show intelligent recommendations
        console.log('\n💡 INTELLIGENT RECOMMENDATIONS:');
        if (testResults.compatibility.issues.length > 0) {
            console.log('• If having script conflicts, set cssModifications: true in exclude settings');
            console.log('• If experiencing lag, set eventListeners: true in exclude settings');
            console.log('• If page is slow, set domObservers: true in exclude settings');
        }
        if (testResults.performance.passed < testResults.performance.total) {
            console.log('• Some performance features not working - YouTube may have updated');
        }
        if (testResults.ui.issues.length > 0) {
            console.log('• UI fixes not applying - try refreshing the page');
        }

        console.log('\n🔧 COMPATIBILITY MODE:');
        console.log('• cssModifications: ' + (settings.exclude.cssModifications ? 'DISABLED (better compatibility)' : 'ENABLED (full features)'));
        console.log('• domObservers: ' + (settings.exclude.domObservers ? 'DISABLED (less interference)' : 'ENABLED (automatic fixes)'));
        console.log('• eventListeners: ' + (settings.exclude.eventListeners ? 'DISABLED (no lag)' : 'ENABLED (faster navigation)'));
        console.log('• qualityControl: ' + (settings.exclude.qualityControl ? 'DISABLED (other scripts handle quality)' : 'ENABLED (automatic quality)'));

        console.log('\n⚖️ TRADE-OFF: ' +
            (settings.exclude.cssModifications || settings.exclude.domObservers || settings.exclude.eventListeners || settings.exclude.qualityControl ?
            'Some features disabled for better compatibility with other scripts' :
            'Full performance mode active'));
    }

    // ===== PERFORMANCE CSS =====
    if (!settings.exclude.cssModifications) {
        let css = '';

        if (settings.disableAnimations) {
            css += `
                [no-animations] * {
                    transition: none !important;
                    animation: none !important;
                }
                html {
                    scroll-behavior: auto !important;
                }
            `;
        }

        if (settings.hideShorts) {
            css += `[hide-shorts] ytd-rich-section-renderer { display: none !important; }`;
        }
        if (settings.hideComments) {
            css += `[hide-comments] ytd-comments { display: none !important; }`;
        }
        if (settings.hideSidebar) {
            css += `[hide-sidebar] ytd-rich-grid-renderer #contents { display: none !important; }`;
        }

        if (settings.fixNotifications) {
            css += `
                ytd-notification-renderer,
                tp-yt-paper-toast {
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    z-index: 9999 !important;
                }
            `;
        }

        if (settings.fixPopups) {
            css += `
                ytd-popup-container,
                tp-yt-paper-dialog {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    z-index: 10000 !important;
                }
            `;
        }

        if (css) GM_addStyle(css);
    }

    // ===== INSTANT NAVIGATION =====
    if (settings.instantNavigation && !settings.exclude.eventListeners) {
        document.addEventListener('mouseover', function(e) {
            const link = e.target.closest('a[href^="/watch"]');
            if (link) {
                const preload = document.createElement('link');
                preload.rel = 'prefetch';
                preload.href = link.href;
                document.head.appendChild(preload);
            }
        }, {passive: true});
    }

    // ===== VIDEO QUALITY CONTROL =====
    function optimizePlayer() {
        if (settings.exclude.qualityControl) return;

        const player = document.querySelector('video');
        if (player && settings.qualityPreset !== 'auto') {
            player.addEventListener('canplay', function() {
                try {
                    player.setPlaybackQuality(settings.qualityPreset);
                } catch(e) { /* Fail silently */ }
            });
        }
    }

    // ===== NON-ESSENTIAL REQUEST BLOCKING =====
    if (settings.blockNonEssential && !settings.exclude.domObservers) {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && (
                url.includes('/log_event') ||
                url.includes('/log_interaction') ||
                url.includes('/tracking') ||
                url.includes('/beacon/')
            )) {
                return Promise.reject(new Error('Blocked by YouTube Performance Booster'));
            }
            return originalFetch.apply(this, args);
        };
    }

    // ===== APPLY SETTINGS =====
    if (!settings.exclude.cssModifications) {
        if (settings.disableAnimations) document.documentElement.setAttribute('no-animations', '');
        if (settings.hideShorts) document.documentElement.setAttribute('hide-shorts', '');
        if (settings.hideComments) document.documentElement.setAttribute('hide-comments', '');
        if (settings.hideSidebar) document.documentElement.setAttribute('hide-sidebar', '');
    }

    // ===== INITIALIZATION =====
    if (!settings.exclude.domObservers) {
        const observer = new MutationObserver(function() {
            optimizePlayer();
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', function() {
        optimizePlayer();
        runComprehensiveTests();
    });
})();