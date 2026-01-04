// ==UserScript==
// @name         Faction HUB
// @namespace    http://tampermonkey.net/
// @version      1.065
// @license      MIT
// @description  Track rations, influence and deposits of your Faction Members. LocalStorage-backed. To make it work: Scan logs while in Activities Screen
// @match        *://*.zed.city/*
// @downloadURL https://update.greasyfork.org/scripts/541860/Faction%20HUB.user.js
// @updateURL https://update.greasyfork.org/scripts/541860/Faction%20HUB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const today = new Date().toISOString().split("T")[0];
    let currentURL = location.href;

    setInterval(() => {
        if (location.href !== currentURL) {
            currentURL = location.href;
            onPageChange(currentURL);
        }
    }, 500);

    onPageChange(currentURL);

    function insertStatisticsTabInto(tabBar) {
        if (tabBar.querySelector("#open-stats-tab")) return;

        const statsTab = document.createElement("a");
        statsTab.id = "open-stats-tab";
        statsTab.className = "q-tab relative-position self-stretch flex flex-center text-center q-tab--inactive q-focusable q-hoverable cursor-pointer";
        statsTab.tabIndex = 0;
        statsTab.role = "tab";
        statsTab.innerHTML = `
            <div class="q-focus-helper" tabindex="-1"></div>
            <div class="q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable column">
                <div class="q-tab__label">Statistics</div>
            </div>
            <div class="q-tab__indicator absolute-bottom text-transparent"></div>
        `;
        statsTab.onclick = () => {
            const panel = document.getElementById("stats-panel");
            if (panel) {
                panel.remove();
            } else {
                renderStatisticsPanel(statsTab);
            }
        };
        tabBar.appendChild(statsTab);
    }

    function monitorTabBar() {
        const tabBars = document.querySelectorAll(".q-tabs__content");

        for (const tabBar of tabBars) {
            const tabEls = tabBar.querySelectorAll(".q-tab__label");
            const tabCount = tabEls.length;

            // Heuristic: Look for tab bars with both "Base" and a second tab (used to be "Activity" / "Logs")
            const tabTexts = Array.from(tabEls).map(el => el.textContent.trim().toLowerCase());

            const baseIndex = tabTexts.findIndex(text => text.includes("base"));
            const likelyActivityTab = tabTexts.findIndex((text, i) =>
                                                         i !== baseIndex && (text.includes("activity") || text.includes("logs") || text.length < 6) // fallback: short name
                                                        );

            const isValid = baseIndex >= 0 && likelyActivityTab >= 0;

            if (isValid) {
                insertStatisticsTabInto(tabBar);

                const tabObserver = new MutationObserver(() => {
                    insertStatisticsTabInto(tabBar);
                });
                tabObserver.observe(tabBar, { childList: true, subtree: true });
                break;
            }
        }
    }


    function onPageChange(url) {
        closeStatisticsPanel();
        if (/\/(faction(\/.*)?|raids)$/.test(url)) {
            monitorTabBar();
            const observer = new MutationObserver(() => {
                monitorTabBar();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        if (/\/faction\/\d+$/.test(url)) {
            const observer = new MutationObserver(() => {
                const rows = document.querySelectorAll("tr.q-tr");
                const members = [];

                rows.forEach(row => {
                    const nameEl = row.querySelector("div.username");
                    const roleTd = row.querySelectorAll("td.q-td.text-left")[3]; // role
                    const levelTd = row.querySelectorAll("td.q-td.text-left")[4]; // level

                    if (nameEl) {
                        const name = nameEl.textContent.trim();
                        const role = roleTd ? roleTd.textContent.trim() : "";
                        const level = levelTd ? parseInt(levelTd.textContent.trim()) : null;
                        members.push({ name, role, level });
                    }
                });

                if (members.length) {
                    localStorage.setItem("zedcity_faction_members", JSON.stringify(members));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    unsafeWindow.scanLogs = async function scanLogs() {
        console.log("🚀 scanLogs() started");

        // Wait for logs to be rendered
        const waitForLogs = () => new Promise(resolve => {
            const check = () => {
                const rows = document.querySelectorAll(".tbl-row.notify-seen");
                if (rows.length > 0) return resolve(rows);
                setTimeout(check, 100);
            };
            check();
        });

        const logRows = await waitForLogs();
        console.log(`✅ Found ${logRows.length} log entries`);

        const parsedLogs = Array.from(logRows).map(row => {
            const message = row.querySelector(".col")?.innerText.trim();
            const dateText = row.querySelector(".notify-date")?.innerText.trim();

            let timestamp = null;
            if (dateText) {
                const match = dateText.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2})(am|pm)$/i);
                if (match) {
                    let [_, day, month, year, hour, minute, ampm] = match;
                    hour = parseInt(hour);
                    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
                    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;
                    const iso = `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${minute}:00`;
                    timestamp = new Date(iso);
                } else {
                    console.warn("❌ Unrecognized date format:", dateText);
                }
            }

            return { text: message, timestamp };
        }).filter(e => e.text && e.timestamp);


        parsedLogs.forEach(log => {
            console.log(`🧾 ${log.timestamp.toISOString()} → ${log.text}`);
        });

        const sessions = [];
        let currentJoin = null;

        for (const entry of parsedLogs) {
            if (entry.text.includes("has joined the faction")) {
                currentJoin = entry;
            } else if (entry.text.includes("has left the faction") && currentJoin) {
                sessions.push({
                    name: currentJoin.text.split(" has joined")[0].trim(),
                    joined: currentJoin.timestamp,
                    left: entry.timestamp
                });
                currentJoin = null;
            }
        }

        console.log("📦 Sessions to be saved:", sessions);

        const toISO = d => typeof d === "string" ? d : d.toISOString();

        const existing = JSON.parse(localStorage.getItem("zedcity_member_history") || "[]");
        const combined = [...existing, ...sessions];

        const seen = new Set();
        const deduped = combined.filter(entry => {
            const key = `${entry.name}_${toISO(entry.joined)}_${toISO(entry.left)}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        console.log("🧹 Cleaned sessions:", deduped.map(s => ({
            name: s.name,
            joined: toISO(s.joined),
            left: toISO(s.left)
        })));
        // 🆕 Extra: Parse log types (rations, influence, deposits)
        const rationLogs = [];
        const influenceLogs = [];
        const depositLogs = [];

        parsedLogs.forEach(log => {
            const { text, timestamp } = log;
            const date = timestamp.toISOString().split("T")[0];

            // 📦 Rations
            let match = text.match(/(.+?) claimed (\d+)x (.+?) rations/i);
            if (match) {
                const [, name, amountStr, item] = match;
                rationLogs.push({
                    name: name.trim(),
                    amount: parseInt(amountStr),
                    item: item.trim(),
                    date
                });
                return;
            }

            // 💪 Influence
            match = text.match(/(.+?) completed .*? gaining (\d+) influence/i);
            if (match) {
                const [, name, amountStr] = match;
                influenceLogs.push({
                    name: name.trim(),
                    amount: parseInt(amountStr),
                    date
                });
                return;
            }

            // 🏗️ Deposits
            match = text.match(/(.+?) deposited (\d+)x (.+)/i);
            if (match) {
                const [, name, amountStr, item] = match;
                depositLogs.push({
                    name: name.trim(),
                    amount: parseInt(amountStr),
                    item: item.trim(),
                    date
                });
                return;
            }
        });

        console.log("📦 Ration logs:", rationLogs);
        console.log("💪 Influence logs:", influenceLogs);
        console.log("🏗️ Deposit logs:", depositLogs);

        // 🧠 Merge with existing stored logs
        function mergeLogs(newLogs, key) {
            const existing = JSON.parse(localStorage.getItem(key) || "[]");

            // Create unique string IDs for existing logs
            const existingIDs = new Set(existing.map(entry =>
                                                     `${entry.name}_${entry.date}_${entry.item || 'influence'}_${entry.amount}`
                                                    ));

            // Only keep logs not already saved
            const trulyNew = newLogs.filter(entry => {
                const id = `${entry.name}_${entry.date}_${entry.item || 'influence'}_${entry.amount}`;
                return !existingIDs.has(id);
            });

            if (trulyNew.length > 0) {
                const updated = existing.concat(trulyNew);
                localStorage.setItem(key, JSON.stringify(updated));
            }

            return trulyNew.length;
        }


        const addedRations = mergeLogs(rationLogs, "zedcity_ration_logs");
        const addedInfluence = mergeLogs(influenceLogs, "zedcity_influence_logs");
        const addedDeposits = mergeLogs(depositLogs, "zedcity_deposit_logs");


        localStorage.setItem("zedcity_member_history", JSON.stringify(deduped));
        return {
            rations: addedRations,
            influence: addedInfluence,
            deposits: addedDeposits
        };

    }


    // CONTINUATION: renderStatisticsPanel

    function renderStatisticsPanel(anchorTab) {
        const existing = document.getElementById("stats-panel");
        if (existing) return;

        const panel = document.createElement("div");
        panel.id = "stats-panel";
        Object.assign(panel.style, {
            position: "absolute",
            backgroundColor: "#1c1c1c",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            zIndex: 9999,
            fontFamily: "system-ui, sans-serif",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            maxHeight: "80vh",
            overflowY: "auto",
            minWidth: "400px"
        });

        document.body.appendChild(panel);

        const rect = anchorTab.getBoundingClientRect();
        const fallbackTop = window.scrollY + 100;
        const fallbackLeft = window.innerWidth / 2 - 200;
        const calculatedTop = rect.bottom + window.scrollY + 10;
        const calculatedLeft = rect.left + rect.width / 2 - 200;
        const validTop = isFinite(calculatedTop) && calculatedTop > 0 && calculatedTop < window.innerHeight + 500;
        const validLeft = isFinite(calculatedLeft) && calculatedLeft > 0 && calculatedLeft < window.innerWidth + 500;

        panel.style.top = `${validTop ? calculatedTop : fallbackTop}px`;
        panel.style.left = `${validLeft ? calculatedLeft : fallbackLeft}px`;

        const closeBtn = document.createElement("div");
        closeBtn.textContent = "✕";
        Object.assign(closeBtn.style, {
            position: "absolute",
            top: "5px",
            right: "8px",
            cursor: "pointer",
            color: "#ccc",
            fontSize: "16px",
            fontWeight: "bold"
        });
        closeBtn.onclick = () => panel.remove();
        panel.appendChild(closeBtn);

        const tabButtons = document.createElement("div");
        const yearButtons = document.createElement("div");
        const monthButtons = document.createElement("div");
        const results = document.createElement("div");
        const toggleFormer = document.createElement("button");
        toggleFormer.textContent = "👥 Show former members";
        Object.assign(toggleFormer.style, {
            backgroundColor: "#444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "12px",
            marginRight: "8px",
            marginTop: "10px",
            display: "none" // initially hidden
        });

        const scanBtn = document.createElement("button");
        scanBtn.textContent = "🔄 Scan logs";
        Object.assign(scanBtn.style, {
            backgroundColor: "#444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "12px",
            marginTop: "10px"
        });
        scanBtn.onclick = async () => {
            console.log("🟡 Scan button clicked");

            // Hide scan button
            scanBtn.style.display = "none";

            // Create feedback box below the scan button
            const msgBox = document.createElement("div");
            msgBox.style.marginTop = "10px";
            msgBox.style.fontSize = "13px";
            msgBox.style.color = "#ccc";
            msgBox.textContent = "⏳ Scanning logs...";
            scanBtn.parentNode.insertBefore(msgBox, scanBtn.nextSibling);

            // Run scan
            const added = await unsafeWindow.scanLogs();

            const total = added.rations + added.influence + added.deposits;
            msgBox.textContent = total === 0
                ? "📭 No new logs loaded."
            : `✅ Saved ${added.rations} Rations, ${added.influence} Raids, ${added.deposits} Deposits.`;

            // Wait before refreshing panel
            setTimeout(() => {
                panel.remove();
                renderStatisticsPanel(anchorTab);

                const newTab = [...document.querySelectorAll("#stats-panel .q-tab__label")]
                .find(el => el.textContent.trim() === "📦 Rations");
                if (newTab) newTab.click();
            }, 3000);
        };




        panel.appendChild(tabButtons);
        panel.appendChild(yearButtons);
        panel.appendChild(monthButtons);
        panel.appendChild(results);
        panel.appendChild(toggleFormer);
        panel.appendChild(scanBtn);

        renderStatisticsPanelContent(tabButtons, yearButtons, monthButtons, results, toggleFormer);
    }
    function enableMainControls(enable, excludePanel = null) {
        const statsPanel = document.getElementById("stats-panel");
        if (!statsPanel) return;

        const buttons = statsPanel.querySelectorAll("button");

        buttons.forEach(btn => {
            // Skip if inside subPanel (like member view)
            if (excludePanel && excludePanel.contains(btn)) return;

            btn.disabled = !enable;
            btn.style.opacity = enable ? "1" : "0.5";
            btn.style.pointerEvents = enable ? "auto" : "none";
        });
    }
    function closeStatisticsPanel() {
        const panel = document.getElementById("stats-panel");
        if (panel) panel.remove();
    }

    function renderStatisticsPanelContent(tabButtons, yearButtons, monthButtons, results, toggleFormer) {
        const members = JSON.parse(localStorage.getItem("zedcity_faction_members") || "[]");
        const rations = JSON.parse(localStorage.getItem("zedcity_ration_logs") || "[]");
        const influence = JSON.parse(localStorage.getItem("zedcity_influence_logs") || "[]");
        const deposits = JSON.parse(localStorage.getItem("zedcity_deposit_logs") || "[]");

        let activeTab = "rations";
        let selectedYear = null;
        let weekOffset = 0;
        let selectedMonth = null;
        let showFormer = false;
        let showAll = false;

        function styleButton(btn, active) {
            Object.assign(btn.style, {
                backgroundColor: active ? '#3a7' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '8px',
                marginBottom: '8px'
            });
        }
        function renderMissingActivitySection(
        membersList,
         statKey,
         threshold,
         selectedYear,
         selectedMonth,
         weekOffset,
         showFormer,
         rations,
         influence,
         deposits,
         results
        ) {
            const matching = [];
            // ✅ Normalize types but preserve WEEKLY key
            if (typeof selectedYear === "string" && selectedYear !== "WEEKLY" && selectedYear !== "DAILY") {
                selectedYear = parseInt(selectedYear, 10);
            }
            // ⚠️ Only parseInt months if we're not in WEEKLY mode
            if (typeof selectedMonth === "string" && !(selectedYear === "WEEKLY" && selectedMonth.includes("_"))) {
                selectedMonth = parseInt(selectedMonth, 10);
            }

            for (const member of membersList) {
                if (!showFormer && !membersList.find(m => m.name === member.name)) continue;

                let value = 0;

                const logs = (statKey === "rations" ? rations :
                              statKey === "influence" ? influence :
                              statKey === "deposits" ? deposits : [])
                .filter(log => {
                    if (!log.date || !log.name) return false;
                    if (log.name !== member.name) return false;

                    const d = new Date(log.date);

                    // 🟩 WEEKLY mode — check if log falls in selected range
                    if (selectedYear === "WEEKLY" && typeof selectedMonth === "string" && selectedMonth.includes("_")) {
                        const [startStr, endStr] = selectedMonth.split("_");
                        const start = new Date(startStr + "T00:00:00");
                        const end = new Date(endStr + "T23:59:59");

                        // Convert log.date string into a Date at midnight
                        const logDate = new Date(log.date + "T00:00:00");

                        const isMatch = logDate >= start && logDate <= end;
                        console.log("🧪 WEEKLY check", {
                            log: log.name,
                            logDate: logDate.toISOString(),
                            start: start.toISOString(),
                            end: end.toISOString(),
                            match: isMatch
                        });
                        return isMatch;
                    }



                    // 🟩 DAILY mode — match today's date
                    if (selectedYear === "DAILY") {
                        const todayStr = new Date().toISOString().split("T")[0];
                        return log.date === todayStr;
                    }

                    // ⛔ Prevent fallback if WEEKLY mode is active
                    if (selectedYear === "WEEKLY") {
                        console.log("⚠️ Fallback skipped — WEEKLY mode active, no match in range.");
                        return false;
                    }

                    // 🟩 Monthly/yearly fallback
                    if (typeof selectedYear === "number") {
                        const logYear = d.getFullYear();
                        const logMonth = d.getMonth() + 1;
                        return logYear === selectedYear &&
                            (!selectedMonth || logMonth === selectedMonth);
                    }


                    return false; // explicitly block fallback if WEEKLY/DAILY didn't match
                });


                // Value calculation
                if (statKey === "rations") {
                    value = logs.length;
                } else {
                    value = logs.reduce((sum, x) => sum + (x.amount || 0), 0);
                }

                if (value >= threshold) {
                    matching.push({ name: member.name, value });
                }
            }

            // Render the matching section
            const listContainer = document.createElement("div");
            listContainer.style.marginTop = "10px";
            listContainer.innerHTML = `<strong>⚠️ Players who did ${threshold} or more:</strong><br/>`;

            if (matching.length === 0) {
                listContainer.innerHTML += `<em>No players match filter.</em>`;
            } else {
                matching.sort((a, b) => b.value - a.value);
                for (const m of matching) {
                    if (statKey === "deposits") {
                        const logs = deposits.filter(l => l.name === m.name);
                        const total = logs.reduce((sum, l) => sum + (l.amount || 0), 0);

                        // Container for each player
                        const playerBlock = document.createElement("div");
                        playerBlock.style.marginBottom = "12px";

                        // Name row (with medals if present)
                        const nameRow = document.createElement("div");
                        nameRow.style.fontWeight = "bold";
                        nameRow.innerHTML = `${m.medal ? m.medal + " " : ""}${m.name}`;
                        playerBlock.appendChild(nameRow);

                        // Total deposits line with inline +
                        const summary = document.createElement("div");
                        summary.style.cursor = "pointer";
                        summary.style.marginLeft = "15px";
                        summary.style.fontSize = "13px";
                        summary.style.color = "#ccc";

                        const totalText = document.createElement("span");
                        totalText.textContent = `Total Deposits: ${total} Items `;

                        const toggleIcon = document.createElement("span");
                        toggleIcon.textContent = "+";
                        toggleIcon.style.fontWeight = "bold";
                        toggleIcon.style.fontSize = "12px";
                        toggleIcon.style.color = "#aaa";

                        summary.appendChild(totalText);
                        summary.appendChild(toggleIcon);


                        // Detailed list (hidden by default)
                        const details = document.createElement("div");
                        details.style.display = "none";
                        details.style.marginLeft = "30px";
                        details.style.marginTop = "4px";
                        details.innerHTML = logs
                            .map(l => `<div>${l.amount}x ${l.item}</div>`)
                            .join("");

                        // Toggle expand/collapse
                        summary.onclick = () => {
                            const isHidden = details.style.display === "none";
                            details.style.display = isHidden ? "block" : "none";
                            toggleIcon.textContent = isHidden ? "−" : "+";
                        };

                        playerBlock.appendChild(summary);
                        playerBlock.appendChild(details);
                        listContainer.appendChild(playerBlock);
                    } else {
                        listContainer.innerHTML += `${m.name} – ${m.value}<br/>`;
                    }

                }
            }

            results.appendChild(listContainer);

        }


        function rebuild() {
            function getPastWeeks(count, offset = 0) {
                const weeks = [];
                const today = new Date();
                const currentMonday = new Date(today);
                currentMonday.setDate(today.getDate() - today.getDay() + 1); // Monday

                for (let i = offset; i < offset + count; i++) {
                    const start = new Date(currentMonday);
                    start.setDate(currentMonday.getDate() - i * 7);
                    const end = new Date(start);
                    end.setDate(start.getDate() + 6);
                    weeks.push({
                        key: `${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`,
                        label: `${start.getDate()}–${end.getDate()} ${end.toLocaleString("default", { month: "short" })}`
                    });
                }
                return weeks.reverse();
            }

            tabButtons.innerHTML = '';
            yearButtons.innerHTML = '';
            monthButtons.innerHTML = '';
            results.innerHTML = '';

            // ✅ Show filter input ONLY when a week, month, or year is selected (not daily)
            if (
                (selectedYear && selectedYear !== "DAILY") ||
                (selectedYear === "WEEKLY" && selectedMonth)
            ) {
                const filterContainer = document.createElement("div");
                filterContainer.style.margin = "12px 0";

                const filterInput = document.createElement("input");
                filterInput.type = "number";
                filterInput.min = "0";
                filterInput.placeholder =
                    activeTab === "rations" ? "Minimum days claimed" :
                activeTab === "influence" ? "Minimum influence earned" :
                "Minimum deposited";

                Object.assign(filterInput.style, {
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    fontSize: "13px",
                    width: "240px",
                    marginBottom: "10px"
                });

                filterContainer.appendChild(filterInput);
                results.appendChild(filterContainer);

                // Filtering logic
                filterInput.oninput = () => {
                    const threshold = parseInt(filterInput.value);
                    if (isNaN(threshold)) return;

                    results.innerHTML = "";
                    results.appendChild(filterContainer);

                    let year, numericMonth;

                    if (selectedYear === "WEEKLY" && selectedMonth) {
                        year = "WEEKLY";
                        numericMonth = selectedMonth;
                    } else if (selectedYear === "DAILY") {
                        year = "DAILY";
                        numericMonth = new Date().toISOString().split("T")[0];
                    } else {
                        year = typeof selectedYear === "string" ? parseInt(selectedYear, 10) : selectedYear;
                        numericMonth = selectedMonth ? parseInt(selectedMonth, 10) : null;
                    }

                    renderMissingActivitySection(
                        members,
                        activeTab,
                        threshold,
                        year,
                        numericMonth,
                        weekOffset,
                        showFormer,
                        rations,
                        influence,
                        deposits,
                        results
                    );
                };
            }

            toggleFormer.style.display = "none"; // hide by default

            const tabTypes = [
                { key: 'members', label: '👥 Members' },
                { key: 'rations', label: '📦 Rations' },
                { key: 'influence', label: '💪 Influence' },
                { key: 'deposits', label: '🏗️ Deposits' }
            ];

            tabTypes.forEach(({ key, label }) => {
                const btn = document.createElement("button");
                btn.textContent = label;
                styleButton(btn, activeTab === key);
                btn.onclick = () => {
                    activeTab = key;
                    selectedYear = null;
                    selectedMonth = null;
                    showAll = false;
                    rebuild();
                };
                tabButtons.appendChild(btn);
            });

            // Daily & Weekly buttons only for rations and influence
            if (activeTab === "rations" || activeTab === "influence") {
                const dailyBtn = document.createElement("button");
                dailyBtn.textContent = "📅 Daily";
                styleButton(dailyBtn, selectedYear === "DAILY");
                dailyBtn.onclick = () => {
                    selectedYear = selectedYear === "DAILY" ? null : "DAILY";
                    selectedMonth = null;
                    showAll = false;
                    rebuild();
                };
                yearButtons.appendChild(dailyBtn);

                const weeklyBtn = document.createElement("button");
                weeklyBtn.textContent = "📆 Weekly";
                styleButton(weeklyBtn, selectedYear === "WEEKLY");
                weeklyBtn.onclick = () => {
                    selectedYear = selectedYear === "WEEKLY" ? null : "WEEKLY";
                    selectedMonth = null;
                    showAll = false;
                    weekOffset = 0;
                    rebuild();
                };
                yearButtons.appendChild(weeklyBtn);
            }

            const logs = activeTab === 'rations' ? rations :
            activeTab === 'influence' ? influence : deposits;

            if (selectedYear !== "DAILY" && activeTab !== "members") {
                const years = [...new Set(logs.map(x => x.date.split('-')[0]))].sort();
                years.forEach(year => {
                    const btn = document.createElement("button");
                    btn.textContent = year;
                    styleButton(btn, selectedYear === year);
                    btn.onclick = () => {
                        selectedYear = selectedYear === year ? null : year;
                        selectedMonth = null;
                        showAll = false;
                        rebuild();
                    };
                    yearButtons.appendChild(btn);
                });
            }

            if (activeTab === 'members') {
                const currentMembers = members.slice();
                currentMembers.sort((a, b) => a.name.localeCompare(b.name));

                currentMembers.forEach(member => {
                    const div = document.createElement("div");
                    div.style.display = "flex";
                    div.style.alignItems = "center";
                    div.style.marginBottom = "6px";
                    div.style.cursor = "pointer";
                    div.style.color = "#ccc";

                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = member.name;

                    const roleSpan = document.createElement("span");
                    roleSpan.textContent = member.role ? ` [${member.role}]` : "";
                    roleSpan.style.fontSize = "11px";
                    roleSpan.style.color = "#aaa";
                    roleSpan.style.marginLeft = "4px";
                    roleSpan.style.display = "none";

                    const levelSpan = document.createElement("span");
                    levelSpan.textContent = member.level ? `Level ${member.level}` : "";
                    levelSpan.style.fontSize = "11px";
                    levelSpan.style.color = "#999";
                    levelSpan.style.marginLeft = "auto";

                    div.appendChild(nameSpan);
                    div.appendChild(roleSpan);
                    div.appendChild(levelSpan);

                    div.onmouseenter = () => {
                        roleSpan.style.display = "inline";
                        div.style.color = "#6cf";
                    };
                    div.onmouseleave = () => {
                        roleSpan.style.display = "none";
                        div.style.color = "#ccc";
                    };

                    div.onclick = () => {
                        renderMemberSubPanel(member.name);
                    };
                    results.appendChild(div);
                });
                return;
            }

            if (!selectedYear) return;

            if (selectedYear !== "DAILY" && activeTab !== "members") {
                const months = [...new Set(logs.filter(x => x.date.startsWith(selectedYear)).map(x => x.date.split('-')[1]))].sort();
                months.forEach(month => {
                    const btn = document.createElement("button");
                    btn.textContent = new Date(`${selectedYear}-${month}-01`).toLocaleString("default", { month: "short" });
                    styleButton(btn, selectedMonth === month);
                    btn.onclick = () => {
                        selectedMonth = selectedMonth === month ? null : month;
                        showAll = false;
                        rebuild();
                    };
                    monthButtons.appendChild(btn);
                });
            }

            // 📆 Inline Weekly selector
            if (selectedYear === "WEEKLY" && (activeTab === "rations" || activeTab === "influence")) {
                const weekList = getPastWeeks(4, weekOffset);
                if (!selectedMonth) {
                    selectedMonth = weekList[weekList.length - 1].key;
                }

                const prevBtn = document.createElement("button");
                prevBtn.textContent = "⬅";
                styleButton(prevBtn, false);
                prevBtn.onclick = () => {
                    weekOffset += 4;
                    rebuild();
                };
                monthButtons.appendChild(prevBtn);

                weekList.forEach(({ key, label }) => {
                    const btn = document.createElement("button");
                    btn.textContent = label;
                    styleButton(btn, selectedMonth === key);
                    btn.onclick = () => {
                        selectedMonth = selectedMonth === key ? null : key;
                        rebuild();
                    };
                    monthButtons.appendChild(btn);
                });

                if (weekOffset > 0) {
                    const nextBtn = document.createElement("button");
                    nextBtn.textContent = "➡";
                    styleButton(nextBtn, false);
                    nextBtn.onclick = () => {
                        weekOffset = Math.max(0, weekOffset - 4);
                        rebuild();
                    };
                    monthButtons.appendChild(nextBtn);
                }
            }

            const filtered = logs.filter(x => {
                if (selectedYear === "DAILY") {
                    return x.date === today;
                }
                if (selectedYear === "WEEKLY" && selectedMonth) {
                    const [startStr, endStr] = selectedMonth.split("_");
                    const start = new Date(startStr);
                    const end = new Date(endStr);
                    const logDate = new Date(x.date);
                    return logDate >= start && logDate <= end;
                }
                return x.date.startsWith(selectedYear + (selectedMonth ? '-' + selectedMonth : ''));
            });

            const grouped = {};
            for (const log of filtered) {
                const name = log.name;
                if (!grouped[name]) grouped[name] = {};
                const key = activeTab === 'rations' ? log.item :
                activeTab === 'deposits' ? log.item : 'influence';
                grouped[name][key] = (grouped[name][key] || 0) + log.amount;
            }

            const shownNames = showAll && selectedYear === "DAILY"
            ? members.map(m => m.name)
            : Object.keys(grouped);

            const names = [...new Set(shownNames)].sort((a, b) => {
                const totalA = grouped[a] ? Object.values(grouped[a]).reduce((s, v) => s + v, 0) : 0;
                const totalB = grouped[b] ? Object.values(grouped[b]).reduce((s, v) => s + v, 0) : 0;
                return totalB - totalA;
            });

            const showToggle = selectedYear && selectedYear !== "DAILY";
            if (showToggle) {
                toggleFormer.style.display = "inline-block";
                toggleFormer.textContent = showFormer ? "👥 Hide former members" : "👥 Show former members";
            }

            names.forEach((name, index) => {
                const isCurrent = members.some(member => member.name === name);
                if (!isCurrent && !showFormer) return;

                const div = document.createElement("div");
                const medals = ['🥇', '🥈', '🥉'];
                const medal = selectedYear !== "DAILY" && index < 3 ? medals[index] + ' ' : '';
                div.innerHTML = `<strong>${medal}${name}${isCurrent ? '' : ' (not in faction)'}</strong>`;

                if (selectedYear === "DAILY") {
                    const done = grouped[name] && Object.values(grouped[name]).reduce((s, v) => s + v, 0) > 0;
                    const row = document.createElement("div");
                    row.textContent = activeTab === "rations" ? `Claimed: ${done ? "✅" : "❌"}` :
                    activeTab === "influence" ? `Raided: ${done ? "✅" : "❌"}` : "";
                    row.style.marginLeft = '12px';
                    div.appendChild(row);
                } else {
                    const items = grouped[name];

                    if (activeTab === "deposits") {
                        const total = Object.values(items).reduce((s, v) => s + v, 0);

                        const summary = document.createElement("div");
                        summary.style.cursor = "pointer";
                        summary.style.marginLeft = "15px";
                        summary.style.fontSize = "13px";
                        summary.style.color = "#ccc";

                        const totalText = document.createElement("span");
                        totalText.textContent = `Total Deposits: ${total} Items `;

                        const toggleIcon = document.createElement("span");
                        toggleIcon.textContent = "+";
                        toggleIcon.style.fontWeight = "bold";
                        toggleIcon.style.fontSize = "12px";
                        toggleIcon.style.color = "#aaa";

                        summary.appendChild(totalText);
                        summary.appendChild(toggleIcon);

                        const details = document.createElement("div");
                        details.style.display = "none";
                        details.style.marginLeft = "30px";
                        details.style.marginTop = "4px";

                        for (const [k, v] of Object.entries(items)) {
                            const row = document.createElement("div");
                            row.textContent = `${k}: ${v}`;
                            row.style.marginLeft = '12px';
                            details.appendChild(row);
                        }

                        summary.onclick = () => {
                            const isHidden = details.style.display === "none";
                            details.style.display = isHidden ? "block" : "none";
                            toggleIcon.textContent = isHidden ? "−" : "+";
                        };

                        div.appendChild(summary);
                        div.appendChild(details);
                    } else {
                        let influenceThresholds = { green: 10000, yellow: 5000 };

                        if (activeTab === "influence" && selectedYear && selectedMonth) {
                            const now = new Date();

                            if (selectedYear === "WEEKLY") {
                                const [startStr, endStr] = selectedMonth.split("_");
                                const start = new Date(startStr);
                                const end = new Date(endStr);

                                const isCurrentWeek = now >= start && now <= end;
                                if (isCurrentWeek) {
                                    const dayProgress = Math.min(7, Math.max(1, now.getDay() === 0 ? 7 : now.getDay()));
                                    const ratio = dayProgress / 7;

                                    influenceThresholds.green = Math.round(2500 * ratio);
                                    influenceThresholds.yellow = Math.round(1250 * ratio);
                                } else {
                                    influenceThresholds.green = 2500;
                                    influenceThresholds.yellow = 1250;
                                }
                            } else {
                                const isCurrentMonth = selectedYear == now.getFullYear().toString() &&
                                      selectedMonth == String(now.getMonth() + 1).padStart(2, '0');

                                if (isCurrentMonth) {
                                    const today = now.getDate();
                                    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                                    const ratio = today / daysInMonth;
                                    influenceThresholds.green = Math.round(10000 * ratio);
                                    influenceThresholds.yellow = Math.round(5000 * ratio);
                                }
                            }
                        }

                        for (const [k, v] of Object.entries(items)) {
                            const row = document.createElement("div");
                            row.textContent = `${k}: ${v}`;

                            if (activeTab === "influence" && k === "influence") {
                                if (v >= influenceThresholds.green) {
                                    row.style.color = "#3f3"; // green
                                } else if (v >= influenceThresholds.yellow) {
                                    row.style.color = "#ff3"; // yellow
                                } else {
                                    row.style.color = "#f66"; // red
                                }
                            }

                            row.style.marginLeft = '12px';
                            div.appendChild(row);
                        }
                    }
                }

                div.style.marginBottom = '10px';
                results.appendChild(div);
            });

            if (selectedYear === "DAILY" && (activeTab === "rations" || activeTab === "influence")) {
                const showAllBtn = document.createElement("button");
                showAllBtn.textContent = showAll ? "Hide all" : "Show all";
                Object.assign(showAllBtn.style, {
                    backgroundColor: "#444",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    marginTop: "10px"
                });
                showAllBtn.onclick = () => {
                    showAll = !showAll;
                    rebuild();
                };
                results.appendChild(showAllBtn);
            }
        }


        toggleFormer.onclick = () => {
            showFormer = !showFormer;
            rebuild();
        };

        rebuild();
    }
    function renderMemberSubPanel(name) {
        const subPanelId = "member-subpanel";
        const existing = document.getElementById(subPanelId);
        if (existing) existing.remove();

        const member = JSON.parse(localStorage.getItem("zedcity_faction_members") || "[]").find(m => m.name === name);
        const role = member?.role || "Unknown";
        let filterMode = "total";
        let selectedYear = null;
        let selectedMonth = null;
        const level = member?.level ? `Level ${member.level}` : "Unknown";

        const parentPanel = document.getElementById("stats-panel");
        if (!parentPanel) return;

        const subPanel = document.createElement("div");
        subPanel.id = subPanelId;
        Object.assign(subPanel.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "#1c1c1c",
            color: "white",
            zIndex: 10001,
            transform: "translateX(100%)",
            transition: "transform 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column"
        });

        // Header with back button and user info
        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex",
            alignItems: "center",
            padding: "10px 12px",
            backgroundColor: "#222",
            borderBottom: "1px solid #333",
            fontSize: "14px"
        });

        const backBtn = document.createElement("span");
        backBtn.textContent = "←";
        Object.assign(backBtn.style, {
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
            color: "#ccc"
        });
        backBtn.onclick = () => {
            subPanel.style.transform = "translateX(100%)";
            setTimeout(() => {
                subPanel.remove();
                enableMainControls(true);
            }, 300);
        };

        header.appendChild(backBtn);
        const title = document.createElement("span");
        title.innerHTML = `<strong>${name}</strong> [${role}] - ${level}`;
        title.style.marginRight = "10px"; // optional spacing
        header.appendChild(title);
        const spacer = document.createElement("div");
        spacer.style.flex = "1";
        header.appendChild(spacer);

        const filterWrapper = document.createElement("div");
        filterWrapper.style.display = "flex";
        filterWrapper.style.gap = "4px";

        const modes = ["Total", "Year", "Month"];
        const buttons = {};

        modes.forEach(mode => {
            const key = mode.toLowerCase();
            const btn = document.createElement("button");
            btn.textContent = mode;
            btn.style.fontSize = "11px";
            btn.style.padding = "2px 6px";
            btn.style.border = "none";
            btn.style.borderRadius = "4px";
            btn.style.backgroundColor = "#444";
            btn.style.color = "white";
            btn.style.cursor = "pointer";
            btn.style.position = "relative";
            btn.style.zIndex = "10003";

            const isMonth = key === "month";
            const isDisabled = isMonth && filterMode !== "year";

            btn.disabled = isDisabled;
            btn.style.opacity = isDisabled ? "0.3" : "1";
            btn.style.pointerEvents = isDisabled ? "none" : "auto";

            btn.onclick = () => {
                if (btn.disabled) return;

                filterMode = key;

                if (key === "total") {
                    selectedYear = null;
                    selectedMonth = null;
                    updateStatsSection();
                }

                if (key === "year") {
                    showYearPicker(year => {
                        selectedYear = year;
                        selectedMonth = null;
                        updateStatsSection();
                    }, btn);
                }


                if (key === "month") {
                    if (!selectedYear) {
                        alert("Please select a year first.");
                        return;
                    }
                    showMonthPicker(month => {
                        selectedMonth = month;
                        updateStatsSection();
                    }, selectedYear, btn);
                }

            };

            buttons[key] = btn;
            filterWrapper.appendChild(btn);
        });


        header.appendChild(filterWrapper);
        subPanel.appendChild(header);

        const rations = JSON.parse(localStorage.getItem("zedcity_ration_logs") || "[]").filter(x => x.name === name);
        const influence = JSON.parse(localStorage.getItem("zedcity_influence_logs") || "[]").filter(x => x.name === name);
        const deposits = JSON.parse(localStorage.getItem("zedcity_deposit_logs") || "[]").filter(x => x.name === name);

        const body = document.createElement("div");
        body.style.padding = "12px";
        body.style.overflowY = "auto";
        body.style.maxHeight = "calc(100vh - 60px)";
        // Helper to make section blocks
        function createSection(title, dataMap) {
            const section = document.createElement("div");
            section.style.marginBottom = "18px";

            const sectionTitle = document.createElement("div");
            sectionTitle.textContent = title;
            sectionTitle.style.fontWeight = "bold";
            sectionTitle.style.marginBottom = "6px";
            sectionTitle.style.color = "#6cf";
            section.appendChild(sectionTitle);

            if (!Object.keys(dataMap).length) {
                const empty = document.createElement("div");
                empty.textContent = "No data found.";
                empty.style.fontSize = "12px";
                empty.style.color = "#888";
                section.appendChild(empty);
            } else {
                Object.entries(dataMap).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
                    const row = document.createElement("div");
                    row.textContent = `${k}: ${v}`;
                    row.style.marginLeft = "10px";
                    row.style.fontSize = "13px";
                    section.appendChild(row);
                });
            }

            return section;
        }

        // Totals
        const rationTotals = {};
        rations.forEach(log => {
            rationTotals[log.item] = (rationTotals[log.item] || 0) + log.amount;
        });

        const influenceTotal = influence.reduce((sum, log) => sum + log.amount, 0);

        const depositTotals = {};
        deposits.forEach(log => {
            depositTotals[log.item] = (depositTotals[log.item] || 0) + log.amount;
        });

        function updateStatsSection() {
            body.innerHTML = "";

            function isMatch(dateStr) {
                if (filterMode === "total") return true;
                if (filterMode === "year") return dateStr.startsWith(selectedYear);
                if (filterMode === "month") return dateStr.startsWith(`${selectedYear}-${selectedMonth}`);
                return false;
            }

            const rFiltered = rations.filter(log => isMatch(log.date));
            const iFiltered = influence.filter(log => isMatch(log.date));
            const dFiltered = deposits.filter(log => isMatch(log.date));

            const rTotals = {};
            rFiltered.forEach(log => {
                rTotals[log.item] = (rTotals[log.item] || 0) + log.amount;
            });

            const iTotal = iFiltered.reduce((sum, log) => sum + log.amount, 0);

            const dTotals = {};
            dFiltered.forEach(log => {
                dTotals[log.item] = (dTotals[log.item] || 0) + log.amount;
            });

            body.appendChild(createSection("📦 Rations Claimed", rTotals));
            body.appendChild(createSection("💪 Influence Gained", { Total: iTotal }));
            body.appendChild(createSection("🏗️ Deposits Made", dTotals));

            Object.keys(buttons).forEach(k => {
                const btn = buttons[k];
                const isMonth = k === "month";
                const isDisabled = isMonth && filterMode !== "year";

                btn.disabled = isDisabled;
                btn.style.pointerEvents = isDisabled ? "none" : "auto";
                btn.style.opacity = isDisabled ? "0.3" : "1";
                btn.style.backgroundColor = (k === filterMode) ? "#3a7" : "#444";
            });

        }
        updateStatsSection();
        subPanel.appendChild(body);
        // 🦶 FOOTER: activity breakdown
        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "space-between";
        footer.style.alignItems = "center";
        footer.style.borderTop = "1px solid #333";
        footer.style.padding = "8px 12px";
        footer.style.fontSize = "13px";
        footer.style.marginTop = "auto";
        footer.style.color = "#ccc";

        // 🧮 Calculate this month's eligible days
        const memberHistory = JSON.parse(localStorage.getItem("zedcity_member_history") || "[]")
        .filter(h => h.name === name);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const daysInMonth = new Date(yyyy, today.getMonth() + 1, 0).getDate();

        let activeDays = new Set();
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${yyyy}-${mm}-${String(d).padStart(2, "0")}`;
            const date = new Date(dateStr);

            for (const period of memberHistory) {
                const start = new Date(period.start);
                const end = period.end ? new Date(period.end) : today;
                if (date >= start && date <= end) {
                    activeDays.add(dateStr);
                }
            }
        }

        const eligibleDays = Array.from(activeDays);

        // 📅 Filter rations/influence logs to current month
        const monthlyRations = rations.filter(x => x.date.startsWith(`${yyyy}-${mm}`));
        const monthlyInfluence = influence.filter(x => x.date.startsWith(`${yyyy}-${mm}`));

        // ✅ Count how many unique dates they acted
        const rationDays = new Set(monthlyRations.map(x => x.date));
        const raidDays = new Set(monthlyInfluence.map(x => x.date));

        // 💯 Activity Score (percent)
        const total = eligibleDays.length;
        const rScore = total > 0 ? (rationDays.size / total) * 20 : 0;
        const iScore = total > 0 ? (raidDays.size / total) * 80 : 0;
        const finalScore = Math.round(rScore + iScore);

        // ⬅️ Left side: claimed/possible
        const left = document.createElement("div");
        left.textContent = `📦 ${rationDays.size}/${total}   💪 ${raidDays.size}/${total}`;

        // ➡️ Right side: score
        const right = document.createElement("div");
        right.textContent = `Activity Score: ${finalScore}%`;
        right.style.fontWeight = "bold";
        right.style.color = finalScore >= 90 ? "#3f3" : finalScore >= 60 ? "#ff3" : "#f66";

        footer.appendChild(left);
        footer.appendChild(right);
        subPanel.appendChild(footer);


        parentPanel.appendChild(subPanel);

        // Slide-in animation
        requestAnimationFrame(() => {
            subPanel.style.transform = "translateX(0%)";
        });

        enableMainControls(false, subPanel);
    }
    function showYearPicker(onSelect, buttonEl) {
        // 🔁 Check if popup already exists → remove if so (toggle behavior)
        const existing = document.getElementById("zedcity-popup");
        if (existing) {
            existing.remove();
            return;
        }

        // 🧭 Get button position to align popup later
        const rect = buttonEl.getBoundingClientRect();
        const popup = document.createElement("div");
        popup.id = "zedcity-popup";

        const popupWidth = 160;
        let left = rect.left + window.scrollX;

        // Ensure popup doesn't go off right edge
        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10;
        }

        Object.assign(popup.style, {
            position: "absolute",
            top: `${rect.bottom + window.scrollY + 6}px`,
            left: `${left}px`,
            width: `${popupWidth}px`,
            backgroundColor: "#2a2a2a",
            padding: "12px",
            borderRadius: "8px",
            zIndex: 10002,
            color: "white",
            fontSize: "13px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.6)"
        });

        const logs = JSON.parse(localStorage.getItem("zedcity_ration_logs") || "[]")
        .concat(JSON.parse(localStorage.getItem("zedcity_influence_logs") || "[]"))
        .concat(JSON.parse(localStorage.getItem("zedcity_deposit_logs") || "[]"));

        const years = [...new Set(logs.map(log => log.date.split("-")[0]))].sort().reverse();

        years.forEach(y => {
            const row = document.createElement("div");
            row.textContent = y;
            row.style.padding = "4px 8px";
            row.style.cursor = "pointer";
            row.onmouseenter = () => { row.style.backgroundColor = "#444"; };
            row.onmouseleave = () => { row.style.backgroundColor = "transparent"; };
            row.onclick = () => {
                document.body.removeChild(popup);
                onSelect(y);
            };
            popup.appendChild(row);
        });

        document.body.appendChild(popup);
    }


    function showMonthPicker(onSelect, year, buttonEl) {
        const existing = document.getElementById("zedcity-popup");
        if (existing) {
            existing.remove();
            return;
        }

        const rect = buttonEl.getBoundingClientRect();
        const popup = document.createElement("div");
        popup.id = "zedcity-popup";

        const popupWidth = 180;
        let left = rect.left + window.scrollX;

        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10;
        }

        Object.assign(popup.style, {
            position: "absolute",
            top: `${rect.bottom + window.scrollY + 6}px`,
            left: `${left}px`,
            width: `${popupWidth}px`,
            backgroundColor: "#2a2a2a",
            padding: "12px",
            borderRadius: "8px",
            zIndex: 10002,
            color: "white",
            fontSize: "13px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "6px"
        });

        const months = Array.from({ length: 12 }, (_, i) => i + 1);

        months.forEach(m => {
            const label = new Date(`${year}-${String(m).padStart(2, '0')}-01`).toLocaleString("default", { month: "short" });
            const row = document.createElement("div");
            row.textContent = label;
            row.style.padding = "4px 6px";
            row.style.cursor = "pointer";
            row.style.textAlign = "center";
            row.onmouseenter = () => { row.style.backgroundColor = "#444"; };
            row.onmouseleave = () => { row.style.backgroundColor = "transparent"; };
            row.onclick = () => {
                document.body.removeChild(popup);
                onSelect(String(m).padStart(2, '0'));
            };
            popup.appendChild(row);
        });

        document.body.appendChild(popup);
    }
    function showWeekPicker(onSelect, buttonEl) {
        const existing = document.getElementById("zedcity-popup");
        if (existing) {
            existing.remove();
            return;
        }

        let offset = 0; // How many weeks to go back
        const popup = document.createElement("div");
        popup.id = "zedcity-popup";

        const popupWidth = 260;
        const rect = buttonEl.getBoundingClientRect();
        let left = rect.left + window.scrollX;

        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10;
        }

        Object.assign(popup.style, {
            position: "absolute",
            top: `${rect.bottom + window.scrollY + 6}px`,
            left: `${left}px`,
            width: `${popupWidth}px`,
            backgroundColor: "#2a2a2a",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 10002,
            color: "white",
            fontSize: "13px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
            display: "flex",
            gap: "6px",
            alignItems: "center",
            justifyContent: "center"
        });

        function buildWeekOptions() {
            popup.innerHTML = ""; // clear

            const weekList = [];

            const today = new Date();
            const currentMonday = new Date(today);
            currentMonday.setDate(currentMonday.getDate() - currentMonday.getDay() + 1); // to Monday

            for (let i = offset; i < offset + 4; i++) {
                const start = new Date(currentMonday);
                start.setDate(currentMonday.getDate() - i * 7);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);

                const label = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

                weekList.push({ start, end, label });
            }

            // ⬅ PREVIOUS button
            const prevBtn = document.createElement("div");
            prevBtn.textContent = "⬅";
            prevBtn.style.cursor = "pointer";
            prevBtn.onclick = () => {
                offset += 4;
                buildWeekOptions();
            };
            popup.appendChild(prevBtn);

            // Week buttons
            weekList.forEach(({ start, end, label }) => {
                const btn = document.createElement("div");
                btn.textContent = label;
                btn.style.padding = "4px 6px";
                btn.style.cursor = "pointer";
                btn.style.textAlign = "center";
                btn.style.borderRadius = "4px";
                btn.style.backgroundColor = "#444";
                btn.onmouseenter = () => { btn.style.backgroundColor = "#666"; };
                btn.onmouseleave = () => { btn.style.backgroundColor = "#444"; };
                btn.onclick = () => {
                    document.body.removeChild(popup);
                    const key = `${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;
                    onSelect(key); // Pass back week range string
                };
                popup.appendChild(btn);
            });

            // ➡ LATER button
            if (offset > 0) {
                const nextBtn = document.createElement("div");
                nextBtn.textContent = "➡";
                nextBtn.style.cursor = "pointer";
                nextBtn.onclick = () => {
                    offset -= 4;
                    buildWeekOptions();
                };
                popup.appendChild(nextBtn);
            }
        }

        buildWeekOptions();
        document.body.appendChild(popup);
    }



    function injectHubIcon() {
        const maxRetries = 20;
        let attempts = 0;

        const interval = setInterval(() => {
            const topBar = document.querySelector("header .q-toolbar .items-center");
            if (!topBar) {
                if (++attempts >= maxRetries) clearInterval(interval);
                return;
            }

            // Avoid duplicates
            if (document.getElementById("zedcity-hub-icon")) {
                clearInterval(interval);
                return;
            }

            const hubIcon = document.createElement("div");
            hubIcon.id = "zedcity-hub-icon";

            const hubIconImg = document.createElement("img");
            hubIconImg.src = "https://i.imgur.com/6CaVJMO.png";
            hubIconImg.alt = "Hub Icon";

            Object.assign(hubIcon.style, {
                width: "38px",
                height: "38px",
                marginLeft: "6px",
                marginTop: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                borderRadius: "6px",
                transition: "background-color 0.2s ease"
            });


            Object.assign(hubIconImg.style, {
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
            });

            // Fallback if image fails
            hubIconImg.onerror = () => {
                hubIcon.innerHTML = "HUB";
                Object.assign(hubIcon.style, {
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#fff",
                    marginTop: "4px"
                });
            };

            hubIcon.appendChild(hubIconImg);
            hubIcon.title = "Open HUB";

            // ⬇️ On click → open dropdown menu
            hubIcon.onclick = (e) => {
                e.stopPropagation();
                showHubMainMenu(hubIcon);
            };
            hubIcon.onmouseenter = () => {
                hubIcon.style.backgroundColor = "#203447";
            };

            hubIcon.onmouseleave = () => {
                hubIcon.style.backgroundColor = "transparent";
            };


            document.addEventListener("click", () => {
                const menu = document.getElementById("hub-main-menu");
                if (menu) menu.remove();
            });

            topBar.appendChild(hubIcon);
            clearInterval(interval);
        }, 300);
    }



    injectHubIcon();


    function showHubMainMenu(anchor) {
        const existing = document.getElementById("hub-main-menu");
        if (existing) return existing.remove();

        const menu = document.createElement("div");
        menu.id = "hub-main-menu";
        Object.assign(menu.style, {
            position: "absolute",
            top: `${anchor.getBoundingClientRect().bottom + window.scrollY + 6}px`,
            left: `${anchor.getBoundingClientRect().left + window.scrollX}px`,
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "8px",
            zIndex: 9999,
            color: "white",
            fontSize: "14px",
            minWidth: "160px"
        });

        const item = document.createElement("div");
        item.textContent = "🏛️ Faction HUB";
        item.style.padding = "6px 10px";
        item.style.cursor = "pointer";
        item.onmouseenter = () => { item.style.backgroundColor = "#333"; };
        item.onmouseleave = () => { item.style.backgroundColor = "transparent"; };
        item.onclick = (e) => {
            menu.remove();
            renderStatisticsPanel(e.currentTarget); // the menu item itself as anchor
        };


        menu.appendChild(item);
        document.body.appendChild(menu);
    }


    // Start on load
    injectHubIcon();



})();
