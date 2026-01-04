// ==UserScript==
// @name         Angi Lead Alert + Smart Ticker (v3.65.0 - Anti-Lag Fix)
// @namespace    http://your.namespace/
// @version      3.65.0
// @description  Alerts for uncontacted top lead; verifies empty status to prevent false alarms from slow loading.
// @match        https://office.angi.com/app/h/*/leads/lead-board*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542576/Angi%20Lead%20Alert%20%2B%20Smart%20Ticker%20%28v3650%20-%20Anti-Lag%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542576/Angi%20Lead%20Alert%20%2B%20Smart%20Ticker%20%28v3650%20-%20Anti-Lag%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('✅ Angi Lead Alert v3.65.0 loaded');

    // Configuration
    const AUDIO_URL         = 'https://raw.githubusercontent.com/JamiewSente/files-for-scripts/8e12652ba40c2081401ca35bff4f13d59f78bf28/Screen_Recording_20250714_135612_Perfect%20Piano%20(2).mp3';
    const RELOAD_INTERVAL   = 45_000;            // reload every 45s
    const SCAN_DELAY        = 3_000;             // wait 3s before first scan
    const REPEAT_INTERVAL   = 3 * 60_000;        // repeat alert every 3m
    const LAG_CHECK_DELAY   = 1_000;             // wait 1s if status is empty to verify
    const INTERACTION_STATUSES = [
        'Contact & qualify',
        'Selling',
        'In progress - won job',
        'Closed - Did not win Job',
        'Closed - won Job',
        'Connected',
        'Initial'
    ];

    // build lowercase lookup for case-insensitive matching
    const INTERACTION_STATUSES_LOWER = INTERACTION_STATUSES.map(s => s.toLowerCase());

    // Persistent state
    let muted       = localStorage.getItem('angiLeadAlertMute') === 'true';
    let staleLeadKey    = null;
    let staleLeadStart = 0;

    // Check if current time is within 7am–8pm EST
    function isWithinESTWindow() {
        const nowNY = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
        );
        const h = nowNY.getHours();
        return h >= 7 && h < 20;
    }

    // Has the user clicked once to unlock audio?
    function audioUnlocked() {
        return localStorage.getItem('angiAudioUnlocked') === 'true';
    }

    // Play the alert sound if not muted, within EST window, and unlocked
    function playAlert() {
        if (muted || !isWithinESTWindow() || !audioUnlocked()) {
            console.log('🔕 Alert suppressed');
            return;
        }
        const audio = new Audio(AUDIO_URL);
        audio.volume = 0.6;
        document.body.appendChild(audio);
        audio.play()
            .then(() => {
                audio.pause();
                setTimeout(() => audio.play().catch(() => {}), 500);
            })
            .catch(() => {});
    }

    // Helpers for status checks
    function getStatusText(btn) {
        return btn.querySelector('.lead-status-label')?.textContent?.trim().toLowerCase() || '';
    }

    function hasInteractionStatus(text) {
        return INTERACTION_STATUSES_LOWER.includes(text);
    }

    function isUncontactedBanner(btn) {
        const banner = btn
            .querySelector('.grey-banner')
            ?.textContent
            ?.trim()
            .toLowerCase() || '';
        return banner === 'uncontacted';
    }

    // === Patched scanLeads ===
    async function scanLeads() {
        const container = document.querySelector('#leads-board-details');
        if (!container) return;

        let topBtn = container.querySelector('div.border-leads-first');
        if (!topBtn) return;

        // Gather status info
        let rawStatus = getStatusText(topBtn);

        // --- ANTI-LAG FIX ---
        // If status is empty, wait 1 second and check the DOM again to ensure it isn't just loading slowly.
        if (rawStatus === '') {
            console.log('⚠️ Status empty, double-checking in 1s to prevent false alarm...');
            await new Promise(r => setTimeout(r, LAG_CHECK_DELAY));
            
            // Re-select the button in case the DOM refreshed
            topBtn = container.querySelector('div.border-leads-first');
            if (!topBtn) return;
            
            rawStatus = getStatusText(topBtn);
            console.log(`✅ Re-check status result: "${rawStatus}"`);
        }
        // --------------------

        const statusExcluded = rawStatus === 'initial';
        const contacted    = hasInteractionStatus(rawStatus);
        const hasBanner    = isUncontactedBanner(topBtn);
        
        // If the lead has NO status label text at all (even after the wait), assume it is NEW
        const hasNoStatusLabel = rawStatus === '';

        // A lead is "New" if it has the banner OR if it has no status text
        const isUncontactedLead = hasBanner || hasNoStatusLabel;

        const key = topBtn.innerText.trim() || topBtn.dataset.id || topBtn.outerHTML;
        let shouldPlay = false;

        // Logic: It must appear uncontacted (or empty status), NOT be excluded, and NOT be contacted
        if (isUncontactedLead && !statusExcluded && !contacted) {
            // new lead
            if (staleLeadKey !== key) {
                console.log('🔔 New uncontacted lead — scheduling alert');
                shouldPlay = true;
                staleLeadStart = Date.now();
            }
            // repeat same lead
            else {
                const elapsed = Date.now() - staleLeadStart;
                if (isWithinESTWindow() && elapsed >= REPEAT_INTERVAL) {
                    console.log('🔁 Repeating alert for same lead');
                    shouldPlay = true;
                    staleLeadStart = Date.now();
                }
            }
            staleLeadKey = key;
        } else {
            // all leads contacted/excluded
            if (staleLeadKey !== null) {
                console.log('✅ All leads contacted or excluded — clearing stale state');
            }
            staleLeadKey    = null;
            staleLeadStart = 0;
        }

        if (shouldPlay) {
            playAlert();
        }

        updateTicker(topBtn, isUncontactedLead, statusExcluded, contacted);
    }

    // Inject the ticker UI
    function injectTicker() {
        const header    = document.querySelector('header.site-header');
        const leadBoard = document.querySelector('#leads-center-with-data') ||
                          document.querySelector('#leads-board-details') ||
                          header;
        if (!leadBoard || !leadBoard.parentNode) {
            console.warn('⚠️ No valid injection target found');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'lead-ticker-wrapper';
        wrapper.style.marginBottom = '10px';

        const ticker = document.createElement('div');
        ticker.id = 'lead-ticker-status';
        ticker.textContent = 'Checking lead status...';
        Object.assign(ticker.style, {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#0078D4',
            padding: '8px',
            textAlign: 'center',
            borderBottom: '2px solid #004eaa',
            position: 'relative'
        });

        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Debug';
        Object.assign(debugBtn.style, {
            position: 'absolute',
            right: '10px',
            top: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });
        debugBtn.onclick = () => {
            const btn = document.querySelector('div.border-leads-first');
            if (!btn) return console.log('No lead found.');
            console.log('Label Text:', btn.querySelector('.lead-status-label')?.textContent);
            console.log('Banner Text:', btn.querySelector('.grey-banner')?.textContent);
            playAlert();
        };

        const controls = document.createElement('div');
        Object.assign(controls.style, {
            display: 'flex',
            gap: '10px',
            marginTop: '4px',
            justifyContent: 'center'
        });

        const testBox = document.createElement('div');
        testBox.textContent = 'Test sound';
        Object.assign(testBox.style, {
            padding: '8px',
            background: '#f3f3f3',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
        });
        testBox.onclick = playAlert;

        const muteBox = document.createElement('div');
        muteBox.textContent = muted ? 'Mute: ON' : 'Mute: OFF';
        Object.assign(muteBox.style, {
            padding: '8px',
            background: '#eee',
            border: '1px solid #bbb',
            borderRadius: '4px',
            cursor: 'pointer'
        });
        muteBox.onclick = () => {
            muted = !muted;
            localStorage.setItem('angiLeadAlertMute', muted);
            muteBox.textContent = muted ? 'Mute: ON' : 'Mute: OFF';
        };

        const unlockBox = document.createElement('div');
        unlockBox.textContent = 'Click to enable sound';
        Object.assign(unlockBox.style, {
            padding: '8px',
            background: '#ddeeff',
            border: '1px solid #99c',
            borderRadius: '4px',
            cursor: 'pointer',
            display: audioUnlocked() ? 'none' : 'block'
        });
        unlockBox.onclick = () => {
            localStorage.setItem('angiAudioUnlocked', 'true');
            new Audio().play().catch(() => {});
            unlockBox.style.display = 'none';
        };

        ticker.appendChild(debugBtn);
        controls.appendChild(testBox);
        controls.appendChild(muteBox);
        controls.appendChild(unlockBox);
        wrapper.appendChild(ticker);
        wrapper.appendChild(controls);
        leadBoard.parentNode.insertBefore(wrapper, leadBoard);

        const styleTag = document.createElement('style');
        styleTag.textContent = `
            @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(styleTag);
    }

    // Update the ticker based on lead status
    function updateTicker(btn, isUncontactedLead, statusExcluded, contacted) {
        const t = document.getElementById('lead-ticker-status');
        if (!t || !btn) return;

        // If it IS contacted, OR (It is NOT "Uncontacted/New" AND NOT Excluded)
        // Basically: Safe if contacted, or if it has a status that isn't "New"
        if (contacted || (!isUncontactedLead && !statusExcluded)) {
            t.style.animation        = 'none';
            t.style.backgroundColor = '#28a745';
            t.textContent            = 'Latest lead contacted';
        } else {
            t.style.animation        = 'blink 1s infinite';
            t.style.backgroundColor = '#d4003b';
            t.textContent            = 'New lead pending...';
        }
    }

    // One-click to unlock audio on page load
    document.addEventListener('click', () => {
        localStorage.setItem('angiAudioUnlocked', 'true');
        new Audio().play().catch(() => {});
    }, { once: true });

    // Wait for board to be ready, then start scanning
    function waitFor(selector, cb) {
        const el = document.querySelector(selector);
        if (el) return cb(el);
        setTimeout(() => waitFor(selector, cb), 300);
    }

    waitFor('#leads-board-details', () => {
        console.log('✅ DOM ready — injecting ticker and starting scan');
        injectTicker();
        setTimeout(scanLeads, SCAN_DELAY);
        setInterval(() => location.reload(), RELOAD_INTERVAL);
    });

})();