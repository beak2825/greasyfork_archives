// ==UserScript==
// @name         Torn – Training Tracker + Debug Mode
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Tracking training + quota input + timestamp + debug logs
// @match        https://www.torn.com/joblist.php*
// @grant        noneGM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543554/Torn%20%E2%80%93%20Training%20Tracker%20%2B%20Debug%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/543554/Torn%20%E2%80%93%20Training%20Tracker%20%2B%20Debug%20Mode.meta.js
// ==/UserScript==

(function() {
  'use strict';

    const employeeSelector = 'ul.employees-list.cont-gray.bottom-round > li';
    const statusSelector = 'ul.employees-list.cont-gray.bottom-round > li > ul.item.icons > li.status';
    const rankSelector = 'ul.employees-list.cont-gray.bottom-round > li > ul.item.icons > li.rank';

    const statusElements = document.querySelectorAll(statusSelector);
    const fallbackRankElements = document.querySelectorAll(rankSelector);
    const statuses = statusElements.length > 0 ? statusElements : fallbackRankElements;


    const apiKey = "sa2eqz3b4a2MpY6Y";
    const companyID = "113357";
    const globalTrainKey = "globalTrainStart";

    // 🕒 Dacă nu avem timestamp salvat, pornim cu NOW - 7 zile (în SECUNDE!)
    let lastUsed = localStorage.getItem(globalTrainKey);
    if (!lastUsed) {
        lastUsed = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // ✅ timestamp în SECUNDE
        localStorage.setItem(globalTrainKey, String(lastUsed));
    } else {
        lastUsed = parseInt(lastUsed);

        // ⚠️ Dacă e din greșeală în milisecunde — îl convertim
        if (lastUsed > 9999999999) {
            lastUsed = Math.floor(lastUsed / 1000);
            console.warn("⚠️ Timestampul era în milisecunde, convertit automat la secunde");
        }
    }

    const now = Math.floor(Date.now() / 1000); // timestamp actual în secunde

    // 🔗 Construim URL-ul cu timestampul vechi (corect, din localStorage)
    const url = `https://api.torn.com/company/${companyID}?selections=news&key=${apiKey}&from=${lastUsed}`;
    console.log(`📡 Apel API: from ${new Date(lastUsed * 1000).toLocaleString()} to ${new Date(now * 1000).toLocaleString()}`);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const newsItems = Object.values(response.news || {});
            const trainings = newsItems.filter(item => item.news.includes("has been trained"));

            console.log(`🧠 XMLHTTP: Found ${trainings.length} training messages — from ${new Date(lastUsed * 1000).toLocaleString()} to ${new Date(now * 1000).toLocaleString()}`);

            trainings.forEach(item => {
                const ts = item.timestamp;
                const match = item.news.match(/>(.*?)<\/a>/);
                const name = match ? match[1] : "UNKNOWN";

                const key = `trainData_${name}`;
                const prev = JSON.parse(localStorage.getItem(key)) || { trained: [], count: 0 };
                prev.trained.push({ timestamp: ts, raw: item.news, by: "Director" });
                prev.count = prev.trained.length;

                localStorage.setItem(key, JSON.stringify(prev));
                console.log(`✅ Salvat: ${name} — ${prev.count} training-uri`);
            });

            // ⏱️ După succes → actualizăm timestampul pentru apelul viitor
            localStorage.setItem(globalTrainKey, String(now));
            console.log("⏱️ actualizat globalTrainStart:", new Date(now * 1000).toLocaleString());
        } else {
            console.error("❌ XMLHTTP error:", xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error("🚨 XMLHTTP request failed.");
    };

    xhr.send();


  // 🧮 Inject inputs: quota + timestamp
    setInterval(() => {
        const employeeSelector = 'ul.employees-list.cont-gray.bottom-round > li';
        const statusSelector = 'ul.employees-list.cont-gray.bottom-round > li > ul.item.icons > li.status';

        const employees = document.querySelectorAll(employeeSelector);
        const statuses = document.querySelectorAll(statusSelector).length > 0
        ? document.querySelectorAll(statusSelector)
        : document.querySelectorAll(rankSelector);

        if (employees.length !== statuses.length) return;

        employees.forEach((li, index) => {
            const statusLi = statuses[index];
            if (!statusLi || statusLi.dataset.inputInjected) return;
            statusLi.dataset.inputInjected = 'true';

            const lines = li.innerText.trim().split('\n');
            const name = lines[0]?.trim();
            if (!name) return;

            const quotaKey = `statusNote_${name}`;
            const timestampKey = `trainStart_${name}`;
            const trainKey = `trainData_${name}`;

            const savedQuota = localStorage.getItem(quotaKey) || '';
            const savedTs = localStorage.getItem(timestampKey);
            const trainData = JSON.parse(localStorage.getItem(trainKey) || '{}');
            const quota = parseInt(savedQuota);
            const trainStart = parseInt(savedTs);

            let usedTrainings = 0;
            if (Array.isArray(trainData?.trained) && !isNaN(trainStart)) {
                usedTrainings = trainData.trained.filter(t => t.timestamp >= Math.floor(trainStart / 1000)).length;
            }

            const remaining = !isNaN(quota) ? quota - usedTrainings : '—';

            // 🎯 QUOTA input
            const quotaInput = document.createElement('input');
            quotaInput.type = 'text';
            quotaInput.placeholder = 'Quota';
            quotaInput.maxLength = 2;
            quotaInput.value = savedQuota;
            quotaInput.style.width = '40px';
            quotaInput.style.marginRight = '6px';
            quotaInput.style.fontSize = '0.8em';
            quotaInput.style.boxSizing = 'border-box';

            quotaInput.addEventListener('input', () => {
                quotaInput.value = quotaInput.value.replace(/\D/g, '');
            });

            quotaInput.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    const val = quotaInput.value.trim();
                    localStorage.setItem(quotaKey, val);
                    console.log(`✅ Quota set for ${name}: ${val}`);
                    quotaInput.style.border = '2px solid green';
                    setTimeout(() => quotaInput.style.border = '', 500);
                    badge.textContent = `trained ${usedTrainings} / ${val}`;
                }
            });

            // 🕓 TIMESTAMP input
            const tsInput = document.createElement('input');
            tsInput.type = 'datetime-local';
            tsInput.style.width = '140px';
            tsInput.style.fontSize = '0.8em';

            if (savedTs) {
                const iso = new Date(parseInt(savedTs)).toISOString().slice(0, 16);
                tsInput.value = iso;
            }

            tsInput.addEventListener('change', () => {
                const parsed = Date.parse(tsInput.value);
                if (!isNaN(parsed)) {
                    localStorage.setItem(timestampKey, parsed);
                    console.log(`🕓 Timestamp set for ${name}: ${new Date(parsed).toLocaleString()}`);
                    tsInput.style.border = '2px solid #2196f3';
                    setTimeout(() => tsInput.style.border = '', 500);
                }
            });

            // 📊 BADGE: used & remaining
            const badge = document.createElement('span');
            //badge.textContent = `🔥 ${usedTrainings} used / 🎯 left: ${remaining}`;
            badge.textContent = `trained ${usedTrainings} / ${isNaN(quota) ? '—' : quota}`;
            badge.style.fontSize = '0.75em';
            badge.style.marginLeft = '8px';
            badge.style.color = remaining <= 0 ? 'red' : 'green';

            // 📦 WRAPPER
            const wrapper = document.createElement('div');
            wrapper.style.marginTop = '4px';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '8px';

            wrapper.appendChild(quotaInput);
            wrapper.appendChild(tsInput);
            wrapper.appendChild(badge);
            statusLi.appendChild(wrapper);

            console.log(`🧩 Inputuri injectate pentru: ${name}`);
        });
    }, 800);
})();