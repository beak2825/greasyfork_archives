// ==UserScript==
// @name         Torn - Fight Sniper + Countdown (v0.6.1 BETA)
// @namespace    https://torn.com/
// @version      0.6.1-beta
// @description  Unhides the fight button for spam clicking and shows live hospital timer. Flashes screen on blocked attempt. Manual-only. Built by 13lackfir3.
// @author       13lackfir3
// @license      For personal testing use only. No distribution. No automation. No API key usage.
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540049/Torn%20-%20Fight%20Sniper%20%2B%20Countdown%20%28v061%20BETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540049/Torn%20-%20Fight%20Sniper%20%2B%20Countdown%20%28v061%20BETA%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const user2ID = new URLSearchParams(location.search).get('user2ID');
    if (!user2ID) return;

    let timeLeft = null;
    let countdownInterval = null;
    let countdown;
    const dialog = document.querySelector('.dialog___Q0GdI');

    // Show one-time beta disclaimer
    function showBetaDisclaimerOnce() {
        const alreadyAccepted = localStorage.getItem('sniperBetaAccepted');
        if (alreadyAccepted === '1') return;

        const banner = document.createElement('div');
        banner.innerHTML = `
            <strong>⚠️ Torn Sniper v0.6 BETA by 13lackfir3</strong><br>
            This is a beta testing script. Data may be collected to improve it.<br>
            <em>No API keys or personal credentials are used or stored.</em><br><br>
            <button id="sniper-ok-btn" style="margin-top:6px; padding:6px 12px;">OK, don’t show again</button>
        `;
        banner.style.position = 'fixed';
        banner.style.bottom = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = '#222';
        banner.style.color = '#fff';
        banner.style.padding = '12px 20px';
        banner.style.fontSize = '14px';
        banner.style.border = '2px solid red';
        banner.style.borderRadius = '6px';
        banner.style.zIndex = '9999';
        banner.style.textAlign = 'center';
        document.body.appendChild(banner);

        document.getElementById('sniper-ok-btn').onclick = () => {
            localStorage.setItem('sniperBetaAccepted', '1');
            banner.remove();
        };
    }

    // Red screen flash if attack is blocked
    function flashRed() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255,0,0,0.8)';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 200);
    }

    // Start hospital countdown loop
    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdown.textContent = '🟢 Ready to attack!';
                return;
            }
            const m = Math.floor(timeLeft / 60);
            const s = String(timeLeft % 60).padStart(2, '0');
            countdown.textContent = `⏳ Hospital: ${m}:${s}`;
            timeLeft--;
        }, 1000);
    }

    // Fetch hospital time from the target's profile page
    async function fetchHospitalTime() {
        try {
            const res = await fetch(`/profiles.php?XID=${user2ID}`);
            const html = await res.text();
            const match = html.match(/Hospital for (\d{1,2}):(\d{2})/);
            if (match) {
                const min = parseInt(match[1], 10);
                const sec = parseInt(match[2], 10);
                timeLeft = min * 60 + sec;
                startCountdown();
            } else {
                timeLeft = 0;
                countdown.textContent = '🟢 Ready to attack!';
            }
        } catch (err) {
            console.error('[Sniper] Profile fetch failed:', err);
        }
    }

    // Try to grab hospital timer from the current modal (DOM)
    function grabInlineTimer() {
        const el = document.querySelector('.title___fOh2J');
        const match = el?.textContent?.match(/in hospital.*?(\d{1,2}):(\d{2})/i);
        if (match) {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            timeLeft = min * 60 + sec;
            startCountdown();
        }
    }

    // Build sniper UI, wipe default
    function setupUI() {
        if (dialog) dialog.innerHTML = '';

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.padding = '40px';
        dialog?.appendChild(container);

        // Manual fight button
        const fightBtn = document.createElement('button');
        fightBtn.id = 'sniper-fight-btn';
        fightBtn.className = 'torn-btn btn___RxE8_ silver';
        fightBtn.textContent = 'Start fight';
        fightBtn.style.fontSize = '18px';
        fightBtn.style.padding = '10px 24px';
        fightBtn.onclick = async () => {
            const form = new FormData();
            form.append('step', 'poll');
            form.append('user2ID', user2ID);

            try {
                const res = await fetch('/loader.php?sid=attackData&mode=json', {
                    method: 'POST',
                    body: form,
                    headers: { 'x-requested-with': 'XMLHttpRequest' }
                });

                const result = await res.json();
                if (result?.success || result?.template) {
                    window.location.href = `/loader.php?sid=attack&user2ID=${user2ID}`;
                } else {
                    flashRed();
                }
            } catch (err) {
                flashRed();
            }
        };
        container.appendChild(fightBtn);

        // Countdown display
        countdown = document.createElement('div');
        countdown.id = 'hospital-timer';
        countdown.style.marginTop = '10px';
        countdown.style.fontSize = '16px';
        countdown.style.color = '#bbb';
        container.appendChild(countdown);
    }

    // Initialize everything
    showBetaDisclaimerOnce();
    setupUI();
    grabInlineTimer();
    fetchHospitalTime();
    setInterval(fetchHospitalTime, 15000);
})();