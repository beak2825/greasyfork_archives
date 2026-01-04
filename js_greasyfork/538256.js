// ==UserScript==
// @name         BDJobs Advance (with License)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  BDJobs Advance with license check
// @author       Saniul Alom Sun
// @match        https://jobs.bdjobs.com/jobsearch.asp*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/538256/BDJobs%20Advance%20%28with%20License%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538256/BDJobs%20Advance%20%28with%20License%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_URL = 'https://script.google.com/macros/s/AKfycby1T7fku2vbbQM0i1upBoBTXbNj9Ea3OR6kYDgRNfqooiInhQJX4Z6Jk20VwBrysv0J/exec';
    let MIN_MATCH = parseInt(localStorage.getItem('minMatchPercent')) || 60;
    let keywordFilter = localStorage.getItem('keywordFilter') || '';
    const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
    const sentJobs = new Set();

    function isLicenseValid() {
        const licenseInfo = JSON.parse(localStorage.getItem('bdjobs_license'));
        if (!licenseInfo || !licenseInfo.key || !licenseInfo.expiryDate) return false;

        const now = new Date();
        const expiry = new Date(licenseInfo.expiryDate);
        return now <= expiry;
    }

    function saveLicenseToLocal(key, expiryDate) {
        localStorage.setItem('bdjobs_license', JSON.stringify({ key, expiryDate }));
    }

    function showLicensePrompt(callback) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999999, display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#fff', padding: '30px', borderRadius: '10px',
            width: '400px', textAlign: 'center', boxShadow: '0 0 15px #000'
        });

        box.innerHTML = `
            <h2>🔒 License Required</h2>
            <p>Enter your license key below to unlock the tool:</p>
            <input type="text" id="licenseKeyInput" placeholder="e.g. SUN-XXXX-YYYY" style="width:90%; padding:8px;">
            <div style="margin-top:15px;">
                <button id="submitLicenseBtn">✅ Submit</button>
                <p id="licenseStatus" style="color:red; margin-top:10px;"></p>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('submitLicenseBtn').onclick = () => {
            const key = document.getElementById('licenseKeyInput').value.trim();
            if (!key) return;

            document.getElementById('licenseStatus').textContent = '⏳ Verifying...';

            GM_xmlhttpRequest({
                method: "GET",
                url: `${API_URL}?key=${encodeURIComponent(key)}`,
                onload: function (res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.status === 'success') {
                            saveLicenseToLocal(key, data.expiryDate);
                            document.body.removeChild(overlay);
                            callback();
                        } else {
                            document.getElementById('licenseStatus').textContent = data.message || "Invalid key.";
                        }
                    } catch {
                        document.getElementById('licenseStatus').textContent = "Invalid server response.";
                    }
                },
                onerror: function () {
                    document.getElementById('licenseStatus').textContent = "❌ Network error. Try again.";
                }
            });
        };
    }

    function createPopup() {
        const existing = document.getElementById('jobMatchPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'jobMatchPopup';
        Object.assign(popup.style, {
            position: 'fixed', top: '60px', right: '10px', backgroundColor: '#fff',
            border: '2px solid #4CAF50', padding: '20px', zIndex: 99999,
            maxHeight: '75vh', width: '420px', overflowY: 'auto',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '14px', fontFamily: 'Arial'
        });

        const licenseInfo = JSON.parse(localStorage.getItem('bdjobs_license')) || {};
        const expiryText = licenseInfo.expiryDate ? `<div style="color:#888; font-size:13px; margin-top:4px;">🔐 Expiry: ${licenseInfo.expiryDate.split('T')[0]}</div>` : '';

        popup.innerHTML = `
            <h3 style="margin-top: 0; color: #2e7d32">BDJobs Advance ⚙️</h3>
            <label><b>Match %:</b> <input type="number" id="minMatchInput" value="${MIN_MATCH}" style="width:60px;"></label>
            &nbsp;
            <label><b>Keyword:</b> <input type="text" id="keywordInput" placeholder="e.g. Technician" value="${keywordFilter}" style="width:140px;"></label>
            <button id="saveConfig" style="margin-left:5px;">💾 Save</button>
            ${expiryText}
            <hr>
            <div id="jobResultList">🔄 Waiting for jobs...</div>
            <hr>
            <button id="refreshJobs" style="margin-top:10px; margin-right:5px;">🔄 Refresh</button>
            <button id="closePopup" style="margin-top:10px;">❌ Close</button>
        `;

        document.body.appendChild(popup);

        document.getElementById('closePopup').onclick = () => popup.remove();
        document.getElementById('refreshJobs').onclick = () => {
            sentJobs.clear();
            updatePopupStatus("🔄 Refreshing...");
            processJobs();
        };
        document.getElementById('saveConfig').onclick = () => {
            MIN_MATCH = parseInt(document.getElementById('minMatchInput').value);
            keywordFilter = document.getElementById('keywordInput').value.trim().toLowerCase();
            localStorage.setItem('minMatchPercent', MIN_MATCH);
            localStorage.setItem('keywordFilter', keywordFilter);
            updatePopupStatus("✅ Config saved. Refreshing...");
            sentJobs.clear();
            processJobs();
        };
    }

    function appendToPopup(html) {
        const list = document.getElementById('jobResultList');
        if (list) {
            if (list.innerHTML.includes("🔄")) list.innerHTML = '';
            list.insertAdjacentHTML('beforeend', html);
        }
    }

    function updatePopupStatus(text) {
        appendToPopup(`<p style="color: green; font-weight: bold;">${text}</p>`);
    }

    function sendTelegramMessage(text) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: "HTML",
                disable_web_page_preview: true
            })
        });
    }

    function fetchMatch(url) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res => {
                    const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                    const percentEl = doc.querySelector("#dynamicPercentage");
                    if (!percentEl) return resolve(null);

                    const match = percentEl.textContent.match(/(\d+)%/);
                    const percent = match ? parseInt(match[1]) : 0;

                    if (percent >= MIN_MATCH) {
                        const jobTitle = doc.querySelector('h2.jtitle')?.innerText.trim() || 'No Title';
                        const company = doc.querySelector('h2.cname')?.innerText.trim() || 'No Company';
                        const bodyText = doc.body.innerText.toLowerCase();

                        if (keywordFilter && !bodyText.includes(keywordFilter)) return resolve(null);

                        resolve({
                            url, percent, jobTitle, company,
                            salary: doc.querySelector('.expect_text .expSalary')?.textContent.trim() || 'N/A',
                            applicants: doc.querySelector('.appWrap .appliedNumber')?.textContent.trim() || 'N/A',
                            education: Array.from(doc.querySelectorAll('#req + ul li')).map(li => li.textContent.trim()).join(', ') || 'N/A'
                        });
                    } else resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function getJobLinks() {
        return Array.from(document.querySelectorAll('a[href*="jobdetails.asp?id="]'))
            .map(a => new URL(a.href, location.origin).href);
    }

    async function processJobs() {
        createPopup();
        const jobLinks = getJobLinks();
        if (jobLinks.length === 0) return updatePopupStatus("❌ No jobs found on this page.");

        updatePopupStatus(`🔎 Found ${jobLinks.length} jobs. Checking...`);

        for (const link of jobLinks) {
            if (sentJobs.has(link)) continue;
            const res = await fetchMatch(link);
            if (res) {
                const html = `
                  <div style="border:1px solid #4CAF50; padding:10px; margin-bottom:8px; border-radius:6px; background:#f9fff9;">
                    <p style="margin:0; font-weight:bold; font-size:15px; color:#2e7d32;">
                      ✅ ${res.percent}% — <a href="${res.url}" target="_blank">${res.jobTitle}</a> at <i>${res.company}</i>
                    </p>
                    <p style="font-size:13px; margin-top:5px;">
                      💰 <b>Salary:</b> ${res.salary}<br>
                      👥 <b>Applicants:</b> ${res.applicants}<br>
                      🎓 <b>Education:</b> ${res.education}
                    </p>
                  </div>`;
                appendToPopup(html);
                sendTelegramMessage(`✅ <b>${res.percent}%</b> match\n<b>${res.jobTitle}</b>\nat <i>${res.company}</i>\n💰 Salary: ${res.salary}\n👥 Applicants: ${res.applicants}\n🎓 Education: ${res.education}\n<a href="${res.url}">View Job</a>`);
                sentJobs.add(link);
            }
        }

        updatePopupStatus("✅ Finished checking current page.");
        setTimeout(goToNextPageIfExists, 1500);
    }

    function goToNextPageIfExists() {
        const nextBtn = document.querySelector('a.prevnext:not(.disablelink)');
        if (nextBtn && nextBtn.textContent.includes('Next')) {
            updatePopupStatus('➡️ Moving to next page...');
            sentJobs.clear();
            nextBtn.click();
        } else {
            updatePopupStatus('🚫 No more pages to check.');
        }
    }

    function waitForJobsAndRun() {
        let waited = 0;
        const maxWait = 10000;
        const interval = setInterval(() => {
            if (getJobLinks().length > 0 || waited > maxWait) {
                clearInterval(interval);
                processJobs();
            }
            waited += 500;
        }, 500);
    }

    if (isLicenseValid()) {
        waitForJobsAndRun();
    } else {
        showLicensePrompt(waitForJobsAndRun);
    }
})();
