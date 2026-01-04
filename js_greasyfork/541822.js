// ==UserScript==
// @name         SteamGifts Group Giveaway Tracker (Entries + Created Count)
// @namespace    https://steamgifts.com/
// @version      1.4
// @description  Check if a specific user has entered group giveaways and highlight them Yellow
// @author       CapnJ
// @license      MIT
// @match        https://www.steamgifts.com/group/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      steamgifts.com
// @downloadURL https://update.greasyfork.org/scripts/541822/SteamGifts%20Group%20Giveaway%20Tracker%20%28Entries%20%2B%20Created%20Count%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541822/SteamGifts%20Group%20Giveaway%20Tracker%20%28Entries%20%2B%20Created%20Count%29.meta.js
// ==/UserScript==

(function () {
    const STORAGE_KEY_USER = "sg_target_user";
    const STORAGE_KEY_HIDE = "sg_hide_unrelated";
    const SCANNED_ATTR = "data-sg-scanned";
    const REQUEST_DELAY_MS = 500;

    let username = GM_getValue(STORAGE_KEY_USER, "").trim();
    let hideUnrelated = GM_getValue(STORAGE_KEY_HIDE, true);
    let created = { running: 0, awaiting: 0, ended: 0 };
    let entered = { running: 0, awaiting: 0, ended: 0 };
    const entryQueue = [];

    async function processQueue() {
        while (true) {
            const item = entryQueue.shift();
            if (!item) {
                await new Promise(res => setTimeout(res, 200));
                continue;
            }

            await new Promise(res => setTimeout(res, REQUEST_DELAY_MS));

            GM_xmlhttpRequest({
                method: "GET",
                url: `${item.url}/entries/search?q=${encodeURIComponent(username)}`,
                onload: response => {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const entries = doc.querySelectorAll(".table__row-inner-wrap");
                    const found = Array.from(entries).some(e => e.textContent.includes(username));
                    const status = item.status;

                    if (found) {
                        entered[status]++;
                        item.giveaway.style.backgroundColor = "#fff59d";
                        item.giveaway.style.fontWeight = "bold";
                        item.giveaway.title = `${username} has entered this giveaway`;
                        item.row.style.display = "";
                        item.row.style.visibility = "visible";
                        item.row.style.opacity = "1";
                    } else if (hideUnrelated) {
                        item.row.style.display = "none";
                    }

                    updateStatus();
                }
            });
        }
    }

    function updateStatus() {
        const el = document.getElementById("sg-user-status");
        if (!el || !username) return;

        el.innerHTML = `
            📦 <strong>${username}</strong> has created:<br>
            &nbsp;&nbsp;🟢 ${created.running} running<br>
            &nbsp;&nbsp;🕓 ${created.awaiting} awaiting<br>
            &nbsp;&nbsp;🔴 ${created.ended} ended<br><br>
            📥 They have entered:<br>
            &nbsp;&nbsp;🟢 ${entered.running} running<br>
            &nbsp;&nbsp;🕓 ${entered.awaiting} awaiting<br>
            &nbsp;&nbsp;🔴 ${entered.ended} ended
        `;
    }

    function getGiveawayStatus(row) {
        const winners = row.querySelector("div[data-draggable-id='winners']");
        if (winners) {
            const txt = winners.textContent.toLowerCase();
            if (txt.includes("awaiting feedback")) return "awaiting";
            const hasWinner = winners.querySelector("a[href^='/user/']");
            if (hasWinner && winners.classList.contains("giveaway__column--positive")) return "ended";
        }

        const ended = row.querySelector("div[data-draggable-id='endTime']");
        if (ended && ended.textContent.toLowerCase().includes("ended")) return "ended";

        return "running";
    }

    function queueOrTrackRow(row) {
        if (row.hasAttribute(SCANNED_ATTR)) return;
        row.setAttribute(SCANNED_ATTR, "true");

        const giveaway = row.querySelector(".giveaway__heading__name");
        const creator = row.querySelector(".giveaway__username")?.textContent.trim();
        const link = giveaway?.closest("a")?.href;
        const entriesLink = row.querySelector("a[data-draggable-id='entries']");
        const entryMatch = entriesLink?.textContent?.match(/(\d+)\s+entries/);
        const entryCount = entryMatch ? parseInt(entryMatch[1], 10) : 0;
        const status = getGiveawayStatus(row);

        if (!giveaway || !link) return;

        if (creator?.toLowerCase() === username.toLowerCase()) {
            created[status]++;
            updateStatus();
            row.style.display = "";
            row.style.visibility = "visible";
            row.style.opacity = "1";
        } else if (entryCount === 0) {
            if (hideUnrelated) row.style.display = "none";
        } else {
            entryQueue.push({ url: link, row, giveaway, status });
        }
    }

    function scanExistingGiveaways(container) {
        const rows = container.querySelectorAll(".giveaway__row-outer-wrap");
        rows.forEach(row => queueOrTrackRow(row));
    }

    function monitorNewGiveaways(container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(n => {
                    if (n.nodeType === 1 && n.matches(".giveaway__row-outer-wrap")) {
                        setTimeout(() => queueOrTrackRow(n), 100);
                    }
                });
            });
        });

        observer.observe(container, { childList: true, subtree: true });
        scanExistingGiveaways(container);
    }

    function initScan() {
        const timer = setInterval(() => {
            const container = document.querySelector(".giveaway__row-outer-wrap")?.parentElement;
            if (container) {
                clearInterval(timer);
                monitorNewGiveaways(container);
                updateStatus();
            }
        }, 500);
    }

    function createSidebarUI() {
        const sidebar = document.querySelector(".sidebar__navigation");
        if (!sidebar) return;

        const box = document.createElement("div");
        box.style.marginTop = "20px";
        box.style.padding = "10px";
        box.style.border = "1px solid #ccc";
        box.style.borderRadius = "4px";
        box.style.backgroundColor = "#f9f9f9";

        const label = document.createElement("div");
        label.textContent = "🎯 Track User Entries";
        label.style.fontWeight = "bold";
        label.style.marginBottom = "5px";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter SteamGifts username";
        input.value = username;
        input.style.width = "100%";
        input.style.marginBottom = "8px";
        input.style.padding = "5px";
        input.style.border = "1px solid #ccc";
        input.style.borderRadius = "4px";

        input.addEventListener("change", () => {
            GM_setValue(STORAGE_KEY_USER, input.value.trim());
            location.reload();
        });

        const toggle = document.createElement("label");
        toggle.style.display = "block";
        toggle.style.marginBottom = "8px";
        toggle.style.fontSize = "13px";
        toggle.style.color = "#333";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = hideUnrelated;
        checkbox.style.marginRight = "6px";

        checkbox.addEventListener("change", () => {
            hideUnrelated = checkbox.checked;
            GM_setValue(STORAGE_KEY_HIDE, hideUnrelated);
        });

        toggle.appendChild(checkbox);
        toggle.appendChild(document.createTextNode("Hide unrelated giveaways"));

        const status = document.createElement("div");
        status.id = "sg-user-status";
        status.style.marginTop = "10px";
        status.style.fontSize = "13px";
        status.style.color = "#333";
        status.textContent = "⏳ Waiting to scan giveaways...";

        box.appendChild(label);
        box.appendChild(input);
        box.appendChild(toggle);
        box.appendChild(status);
        sidebar.parentNode.insertBefore(box, sidebar.nextSibling);
    }

    window.addEventListener("load", () => {
        createSidebarUI();
        processQueue();
        if (username) {
            setTimeout(initScan, 1000);
        } else {
            const s = document.getElementById("sg-user-status");
            if (s) s.textContent = "⚠️ Please enter a username to begin tracking.";
        }
    });
})();
