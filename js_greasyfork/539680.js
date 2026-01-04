// ==UserScript==
// @name         TeachSafe/Kirkwood Instant Next + Popup Remover
// @namespace    https://greasyfork.org/users/your-username
// @version      2.1
// @description  Bypasses "Next" button restrictions AND removes exit popups on Kirkwood/TeachSafe lessons
// @author       Doomstrap
// @match        *://*.kirkwood.edu/*
// @match        *://*.teachsafe.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539680/TeachSafeKirkwood%20Instant%20Next%20%2B%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/539680/TeachSafeKirkwood%20Instant%20Next%20%2B%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main function to unlock everything
    function unlockCourse() {
        console.log('[TeachSafe Bypass] Running unlock...');

        // ===== 1. ENABLE NEXT BUTTON =====
        const nextBtn = document.getElementById('btnNext');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.removeAttribute('disabled');
            console.log('[TeachSafe Bypass] Next button enabled');
        }

        // ===== 2. BYPASS TIMERS =====
        const countdown = document.getElementById('CountdownForSection');
        if (countdown) {
            countdown.textContent = '00:00:00';
            countdown.style.color = 'green';
            console.log('[TeachSafe Bypass] Timer display updated');
        }

        // ===== 3. REMOVE PIE TIMER =====
        const pieTimer = document.getElementById('PieTimerNext');
        if (pieTimer) pieTimer.remove();

        // ===== 4. FAKE TIME TRACKING =====
        document.querySelectorAll('input[type="hidden"]').forEach(input => {
            if (input.id.includes('Time') || input.name.includes('Time')) {
                input.value = '999999';
            }
        });

        // ===== 5. BLOCK EXIT POPUPS =====
        // Method 1: Remove modal immediately if it exists
        const exitModal = document.querySelector('.bootbox.modal');
        if (exitModal) {
            exitModal.remove();
            console.log('[TeachSafe Bypass] Exit popup removed');
        }

        // Method 2: Prevent modal from ever appearing
        window.onbeforeunload = null;
        if (window.bootbox) {
            window.bootbox.alert = function() {
                console.log("[TeachSafe Bypass] Exit popup blocked");
                return false;
            };
        }

        // Method 3: Click any "OK" buttons in popups automatically
        document.querySelectorAll('.bootbox .btn-primary').forEach(btn => {
            btn.click();
        });

        // ===== 6. HANDLE VIDEO REQUIREMENTS =====
        const vimeoIframe = document.querySelector('iframe[src*="vimeo.com"]');
        if (vimeoIframe) {
            vimeoIframe.dispatchEvent(new Event('ended'));
            if (window.Plyr?.instances) {
                Plyr.instances.forEach(player => {
                    player.ended = true;
                    player.playing = true;
                });
            }
        }

        // ===== 7. OVERRIDE COURSE LOGIC =====
        if (window.Section?.init) {
            const originalInit = Section.init;
            Section.init = function(config) {
                config.bp = true; // Force bypass
                return originalInit.call(this, config);
            };
        }
    }

    // ===== RUN MULTIPLE TIMES =====
    unlockCourse(); // Immediate
    setTimeout(unlockCourse, 500); // Early dynamic content
    setTimeout(unlockCourse, 2000); // Late dynamic content

    // ===== MONITOR URL CHANGES =====
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(unlockCourse, 500);
        }
    }).observe(document, {subtree: true, childList: true});

    console.log('[TeachSafe Bypass] Script loaded successfully');
})();