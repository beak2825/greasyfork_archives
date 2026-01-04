// ==UserScript==
// @name        TORN: Wall BattleStats Extended
// @namespace   dekleinekobini.private.wall-battlestats-extended
// @version     2.1.0
// @description show tornstats spies on faction wall page
// @author      DeKleineKobini [2114440] (Original by finally [2060206] and seintz [2460991])
// @license     GNU GPLv3
// @run-at      document-end
// @match       https://www.torn.com/factions.php*
// @require     https://update.greasyfork.org/scripts/494342/apikey-config.user.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @connect     tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/534660/TORN%3A%20Wall%20BattleStats%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/534660/TORN%3A%20Wall%20BattleStats%20Extended.meta.js
// ==/UserScript==

GM_addStyle(`
    @media screen and (max-width: 1000px) {
        .members-cont .bs {
            display: none;
        }
    }

    .members-cont .level {
        width: 27px !important;
    }

    .members-cont .id {
        padding-left: 5px !important;
        width: 28px !important;
    }

    .members-cont .points {
        width: 42px !important;
    }

    .finally-bs-stat {
        font-family: monospace;
    }

    .finally-bs-stat > span {
        display: inline-block;
        width: 55px;
        text-align: right;
    }

    .faction-names {
        position: relative;
    }

    .finally-bs-filter {
        position: absolute !important;
        top: 25px !important;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 120px;
        cursor: pointer;
        display: flex !important;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        
        & > input {
            display: block !important;
            width: 100px;
            
            padding: 2px !important;
        }
    }

    .finally-bs-swap {
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        width: 100px;
        cursor: pointer;
    }

    .finally-bs-activeIcon {
        display: block !important;
    }

    .finally-bs-asc {
        border-bottom: 6px solid var(--sort-arrow-color);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0 solid transparent;
        height: 0;
        top: -8px;
        width: 0;
    }

    .finally-bs-desc {
        border-bottom: 0 solid transparent;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--sort-arrow-border-color);
        height: 0;
        top: -1px;
        width: 0;
    }

    .finally-bs-col {
        text-overflow: clip !important;
    }

    .raid-members-list .level:not(.bs) {
        width: 16px !important;
    }

    div.desc-wrap:not([class*='warDesc']) .finally-bs-swap {
        display: none;
    }

    div.desc-wrap:not([class*='warDesc']) .faction-names {
        padding-top: 100px !important;
    }

    .re_spy_title, .re_spy_col {
        display: none !important;
    }
    
    .wall-battlestats-extended-status-display {
        #margin-top: 10px;
        padding: 15px;
        #background: rgba(0, 0, 0, 0.7);
        color: var(--default-color);
        #border-radius: 5px 5px 0 0;
        text-align: center;
        font-size: 12px;
    }
`);

const apiKey = localStorage["finally.torn.api"] || null;
const bsCache = localStorage["finally.torn.bs"] !== undefined ? JSONparse(localStorage["finally.torn.bs"]) : {};
const hospTime = {};
const previousSort = parseInt(localStorage.getItem("finally.torn.factionSort")) || 1;
let filterFrom = parseInt(localStorage.getItem("finally.torn.factionFilterFrom")) || undefined;
let filterTo = parseInt(localStorage.getItem("finally.torn.factionFilterTo")) || undefined;

let loadTSFactionLock = false;
const loadTSFactionBacklog = [];
const loadTSFactionDone = [];
let hospLoopCounter = 0;
const hospNodes = [];

function JSONparse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

function loadTSFactionsDone() {
    loadTSFactionLock = false;
    loadTSFactions();
}

function loadTSFactions(id) {
    if (loadTSFactionLock) {
        if (id && !loadTSFactionDone.includes(id) && !loadTSFactionBacklog.includes(id)) loadTSFactionBacklog.push(id);
        return;
    }

    if (!id && !loadTSFactionBacklog.length) {
        showStatsAll();
        return;
    }

    loadTSFactionLock = true;
    id = id || loadTSFactionBacklog.shift();
    loadTSFactionDone.push(id);

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.tornstats.com/api/v2/${apiKey}/spy/faction/${id}`,
        onload: (r) => {
            const jsonBody = JSONparse(r.responseText);
            if (!jsonBody || !jsonBody.status || !jsonBody.faction) {
                loadTSFactionsDone();
                return;
            }

            Object.entries(jsonBody.faction.members).forEach(([userId, { spy }]) => addSpy(userId, spy));
            localStorage["finally.torn.bs"] = JSON.stringify(bsCache);

            loadTSFactionsDone();
        },
        onabort: () => loadTSFactionsDone(),
        onerror: () => loadTSFactionsDone(),
        ontimeout: () => loadTSFactionsDone(),
    });
}

function loadFactions() {
    const uniqueFactionIds = Array.from(document.querySelectorAll("[href^='/factions.php?step=profile&ID=']"))
        .map((link) => link.href.replace(/.*?ID=(\d+)$/, "$1"))
        .filter((link, index, self) => self.indexOf(link) === index);
    uniqueFactionIds.forEach((id) => loadTSFactions(id));
}

function sortStats(node, sort) {
    if (!node) node = document.querySelector(".f-war-list .members-list");
    if (!node) return;

    const sortIcon = node.parentNode.querySelector(".bs > [class*='sortIcon']");

    if (sort) node.finallySort = sort;
    else if (node.finallySort === undefined) node.finallySort = 2;
    else if (++node.finallySort > 2) node.finallySort = sortIcon ? 1 : 0;

    if (sortIcon) {
        if (node.finallySort > 0) {
            const active = node.parentNode.querySelector("[class*='activeIcon']:not([class*='finally-bs-activeIcon'])");
            if (active) {
                const activeClass = active.className.match(/(?:\s|^)(activeIcon([^\s|$]+))(?:\s|$)/)[1];
                active.classList.remove(activeClass);
            }

            sortIcon.classList.add("finally-bs-activeIcon");
            if (node.finallySort === 1) {
                sortIcon.classList.remove("finally-bs-desc");
                sortIcon.classList.add("finally-bs-asc");
            } else {
                sortIcon.classList.remove("finally-bs-asc");
                sortIcon.classList.add("finally-bs-desc");
            }
        } else {
            sortIcon.classList.remove("finally-bs-activeIcon");
        }
    }

    const nodes = Array.from(node.querySelectorAll(".table-body > .table-row, .your:not(.row-animation-new), .enemy:not(.row-animation-new)"));
    nodes.forEach((node, index) => {
        if (node.finallyPos === undefined) node.finallyPos = index;
    });

    nodes.sort((a, b) => {
        const posA = a.finallyPos;
        const idA = a.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
        const totalA = (bsCache[idA] && typeof bsCache[idA].total == "number" && bsCache[idA].total) || posA;
        const posB = b.finallyPos;
        const idB = b.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
        const totalB = (bsCache[idB] && typeof bsCache[idB].total == "number" && bsCache[idB].total) || posB;

        switch (node.finallySort) {
            case 1:
                if (totalA <= 100 && totalB <= 100) return totalB > totalA ? 1 : -1;
                return totalA > totalB ? 1 : -1;
            case 2:
                return totalB > totalA ? 1 : -1;
            default:
                return posA > posB ? 1 : -1;
        }
    });

    nodes.forEach((node) => node.parentNode.appendChild(node));

    if (!sort) {
        document.querySelectorAll(".members-list").forEach((e) => {
            if (node !== e) sortStats(e, node.finallySort);
        });
    }
}

function addSpy(id, spy) {
    if (!spy) return;
    bsCache[id] = spy;
}

function updateStats(id, node, parentNode) {
    if (!node) return;

    const stats = ["N/A", "N/A", "N/A", "N/A", "N/A"];
    let time = "";
    let difference;
    if (bsCache[id]) {
        if ((filterFrom && bsCache[id].total <= filterFrom) || (filterTo && bsCache[id].total >= filterTo)) {
            parentNode.style.display = "none";
        } else {
            parentNode.style.display = "";
        }

        stats[0] = bsCache[id].total;
        stats[1] = bsCache[id].strength;
        stats[2] = bsCache[id].defense;
        stats[3] = bsCache[id].speed;
        stats[4] = bsCache[id].dexterity;

        difference = new Date().getTime() / 1000 - bsCache[id].timestamp;
        if (difference < 0) {
            delete bsCache[id];
            localStorage["finally.torn.bs"] = JSON.stringify(bsCache);
            return;
        }
        if (difference > 365 * 24 * 60 * 60) time = Math.floor(difference / (365 * 24 * 60 * 60)) + " years ago";
        else if (difference > 30 * 24 * 60 * 60) time = Math.floor(difference / (30 * 24 * 60 * 60)) + " months ago";
        else if (difference > 24 * 60 * 60) time = Math.floor(difference / (24 * 60 * 60)) + " days ago";
        else if (difference > 60 * 60) time = Math.floor(difference / (60 * 60)) + " hours ago";
        else if (difference > 60) time = Math.floor(difference / 60) + " minutes ago";
        else time = Math.floor(difference) + " seconds ago";
    }

    const units = ["K", "M", "B", "T", "Q"];
    for (let i = 0; i < stats.length; i++) {
        let stat = Number.parseInt(stats[i]);
        if (Number.isNaN(stat) || stat === 0) continue;
        let originalStat = stat;

        for (let j = 0; j < units.length; j++) {
            stat = stat / 1000;
            if (stat > 1000) continue;

            stat = stat.toFixed(i === 0 ? (stat >= 100 ? 0 : 1) : 2);
            stats[i] = `${stat}${units[j]}`;
            break;
        }

        if (i === 0) {
            let color = getTotalStatColor(originalStat);

            if (color) {
                color = `color: ${color};`;
            }

            stats[0] = `<span style='${color}'>${stats[i]}</span>`;
        }
    }

    node.innerHTML = stats[0];
    node.title = `
        <div class="finally-bs-stat">
            <b>STR</b> <span class="finally-bs-stat">${stats[1]}</span><br/>
            <b>DEF</b> <span class="finally-bs-stat">${stats[2]}</span><br/>
            <b>SPD</b> <span class="finally-bs-stat">${stats[3]}</span><br/>
            <b>DEX</b> <span class="finally-bs-stat">${stats[4]}</span><br/>
            ${time}
        </div>
    `;
}

function getTotalStatColor(total) {
    if (total >= 50 * 10 ** 6) {
        return "#d946ef"; // pink
    }

    if (total >= 25 * 10 ** 6) {
        return "#dc2626"; // red
    }

    if (total >= 25 * 10 ** 6) {
        return "#ea580c"; // orange = within range, vico
    }

    if (total >= 10 * 10 ** 6) {
        return "#facc15"; // yellow = within range
    }

    if (total >= 15 * 10 ** 6) {
        return "#a78bfa"; // purple = easy, lower FF
    }

    if (total >= 4 * 10 ** 6) {
        return "#0ea5e9"; // blue = very easy, ff = 2.55
    }

    if (total >= 10 ** 6) {
        return "#22c55e"; // green = too easy
    }

    return "#B7CBBF"; // light green = too easy
}

function updateHospTimers() {
    for (let i = 0, n = hospNodes.length; i < n; i++) {
        const hospNode = hospNodes[i];
        const id = hospNode[0];
        const node = hospNode[1];
        if (!node) continue;
        if (!hospTime[id]) continue;

        let totalSeconds = hospTime[id] - new Date().getTime() / 1000;
        if (!totalSeconds || totalSeconds <= 0) continue;
        else if (totalSeconds >= 10 * 60 && hospLoopCounter % 10 !== 0) continue;
        else if (totalSeconds < 10 * 60 && totalSeconds >= 5 * 60 && hospLoopCounter % 5 !== 0) continue;

        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        node.textContent = `${hours.toString().padLeft(2, "0")}:${minutes.toString().padLeft(2, "0")}:${seconds.toString().padLeft(2, "0")}`;
    }
    if (hospNodes.length > 0) hospLoopCounter++;
    setTimeout(updateHospTimers, 1000);
}

function updateStatus(id, node) {
    if (!node) return;
    if (hospNodes.find((h) => h[0] === id)) return;
    hospNodes.push([id, node]);
}

function showStats(node) {
    if (!node) return;

    const id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
    const bsNode = node.querySelector(".bs") || document.createElement("div");
    const statusNode = node.querySelector(".status");

    updateStats(id, bsNode, node);
    updateStatus(id, statusNode);

    if (bsNode.classList.contains("bs")) {
        return;
    }

    bsNode.className = "table-cell bs level lvl left iconShow finally-bs-col";
    const iconsNode = node.querySelector(".user-icons, .member-icons, .points");
    iconsNode.parentNode.insertBefore(bsNode, iconsNode);
    let isMobile = false;
    bsNode.addEventListener("touchstart", () => (isMobile = true));
    bsNode.addEventListener("click", () => {
        if (isMobile) return;
        window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
    });
    bsNode.addEventListener("dblclick", () => {
        window.open(`loader.php?sid=attack&user2ID=${id}`, "_newtab");
    });
}

function showStatsAll(node) {
    if (!node) node = Array.from(document.querySelectorAll(".f-war-list .members-list, .members-list"));
    if (!node) return;

    if (!(node instanceof Array)) {
        node = [node];
    }

    node.forEach((n) =>
        n.querySelectorAll(".your:not(.row-animation-new), .enemy:not(.row-animation-new), .table-body > .table-row").forEach((e) => showStats(e)),
    );
}

function watchWall(observeNode) {
    if (!observeNode) return;

    loadFactions();

    const parentNode = observeNode.parentNode.parentNode.parentNode;
    const factionNames = parentNode.querySelector(".faction-names");
    if (factionNames && !factionNames.querySelector(".finally-bs-swap")) {
        const swapNode = document.createElement("div");
        swapNode.className = "finally-bs-swap";
        swapNode.innerHTML = "&lt;&gt;";
        factionNames.appendChild(swapNode);
        swapNode.addEventListener("click", () => {
            parentNode.querySelectorAll(".name.left, .name.right, .tab-menu-cont.right, .tab-menu-cont.left").forEach((e) => {
                if (e.classList.contains("left")) {
                    e.classList.remove("left");
                    e.classList.add("right");
                } else {
                    e.classList.remove("right");
                    e.classList.add("left");
                }
            });
        });

        const filterNode = document.createElement("div");
        filterNode.className = "finally-bs-filter input-money-group no-max-value";
        const filterFromInput = document.createElement("input");
        filterFromInput.className = "input-money";
        filterFromInput.placeholder = "Filter BS from";
        filterFromInput.value = localStorage.getItem("finally.torn.factionFilterFrom") || "";
        const filterToInput = document.createElement("input");
        filterToInput.className = "input-money";
        filterToInput.placeholder = "Filter BS to";
        filterToInput.value = localStorage.getItem("finally.torn.factionFilterTo") || "";
        filterNode.appendChild(filterFromInput);
        filterNode.appendChild(filterToInput);
        factionNames.appendChild(filterNode);

        function filterFromTo() {
            function formatInput(input) {
                const value = input.value.toLowerCase();
                let valueNum = value.replace(/\D/g, "");

                let multiplier = 1;
                if (value.indexOf("k") !== -1) multiplier = 1000;
                else if (value.indexOf("m") !== -1) multiplier = 1000000;
                else if (value.indexOf("b") !== -1) multiplier = 1000000000;
                else if (value.indexOf("t") !== -1) multiplier = 1000000000000;

                valueNum *= multiplier;
                input.value = valueNum > 0 ? valueNum.toLocaleString("en-US") : "";

                return valueNum;
            }

            filterFrom = formatInput(filterFromInput);
            filterTo = formatInput(filterToInput);
            localStorage.setItem("finally.torn.factionFilterFrom", filterFrom || "");
            localStorage.setItem("finally.torn.factionFilterTo", filterTo || "");

            showStatsAll();
        }
        filterFromTo();

        filterFromInput.addEventListener("keyup", filterFromTo);
        filterToInput.addEventListener("keyup", filterFromTo);
    }

    const titleNode = observeNode.parentNode.querySelector(".title, .c-pointer");
    const lvNode = titleNode.querySelector(".level");
    lvNode.childNodes[0].nodeValue = "Lv";

    if (!titleNode.querySelector(".bs")) {
        const bsNode = lvNode.cloneNode(true);
        bsNode.classList.add("bs");
        bsNode.childNodes[0].nodeValue = "BS";
        titleNode.insertBefore(bsNode, titleNode.querySelector(".user-icons, .points"));
        if (bsNode.childNodes.length > 1) {
            const orderClass = bsNode.childNodes[1].className.match(/(?:\s|^)((?:asc|desc)[^\s|$]+)(?:\s|$)/)[1];
            bsNode.childNodes[1].classList.remove(orderClass);
            for (let i = 0; i < titleNode.children.length; i++) {
                titleNode.children[i].addEventListener("click", (e) => {
                    setTimeout(() => {
                        let sort = i + 1;
                        const sortIcon = e.target.querySelector("[class*='sortIcon']");
                        const desc = sortIcon ? sortIcon.className.indexOf("desc") === -1 : false;
                        sort = desc ? sort : -sort;
                        localStorage.setItem("finally.torn.factionSort", sort);

                        if (!e.target.classList.contains("bs"))
                            document.querySelectorAll("[class*='finally-bs-activeIcon']").forEach((e) => e.classList.remove("finally-bs-activeIcon"));
                        //if (Math.abs(sort) != 3) document.querySelectorAll("[class*='finally-bs-activeIcon']").forEach((e) => e.classList.remove("finally-bs-activeIcon"));
                    }, 100);
                });
            }
            bsNode.addEventListener("click", () => {
                sortStats(observeNode);
            });

            const title = titleNode.children[Math.abs(previousSort) - 1];
            const sortIcon = title.querySelector("[class*='sortIcon']");
            const desc = sortIcon ? sortIcon.className.indexOf("desc") !== -1 : false;
            const active = sortIcon ? sortIcon.className.indexOf("activeIcon") !== -1 : false;

            let x = 0;
            if (title.classList.contains("bs") && observeNode.querySelector(".enemy"))
                x = 0; //funny edge case, don't ask :)
            //if (Math.abs(previousSort) == 3 && observeNode.querySelector(".enemy")) x = 0; //funny edge case, dont ask :)
            else if (!active && previousSort < 0) x = 1;
            else if (!active) x = 2;
            else if (previousSort < 0 && !desc) x = 1;
            else if (previousSort > 0 && desc) x = 1;

            for (; x > 0; x--) {
                title.click();
            }
        }
    }

    showStatsAll(observeNode);

    let prevSortCheck = "";
    const mo = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const node of mutation.addedNodes) {
                if (node.classList && (node.classList.contains("your") || node.classList.contains("enemy"))) {
                    showStats(node);
                }
            }
        });

        const sort = Array.from(observeNode.querySelectorAll('a[href*="XID"]'))
            .map((a) => a.href)
            .join(",");
        if (prevSortCheck !== sort && observeNode.parentNode.querySelector(".finally-bs-activeIcon")) {
            mo.disconnect();
            sortStats(observeNode, observeNode.finallySort);
            prevSortCheck = Array.from(observeNode.querySelectorAll('a[href*="XID"]'))
                .map((a) => a.href)
                .join(",");
            mo.takeRecords();
            mo.observe(observeNode, { childList: true, subtree: true });
        }
    });

    mo.observe(observeNode, { childList: true, subtree: true });
}

function watchWalls(observeNode) {
    if (!observeNode) return;

    observeNode.querySelectorAll(".members-list").forEach((e) => watchWall(e));

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const node of mutation.addedNodes) {
                node.querySelector && node.querySelectorAll(".members-list").forEach((w) => watchWall(w));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function memberList(observeNode) {
    if (!observeNode) return;

    const titleNode = observeNode.querySelector(".table-header");

    if (!titleNode || titleNode.querySelector(".bs")) return;

    const bsNode = document.createElement("li");
    bsNode.className = "table-cell bs torn-divider divider-vertical";
    bsNode.innerHTML = "BS";
    titleNode.insertBefore(bsNode, titleNode.querySelector(".member-icons"));
    for (let i = 0; i < titleNode.children.length; i++) {
        titleNode.children[i].addEventListener("click", (e) => {
            let sort = i + 1;
            sort = e.target.querySelector("[class*='asc']") ? -sort : sort;
            localStorage.setItem("finally.torn.factionSort", sort);
        });
    }
    bsNode.addEventListener("click", () => {
        sortStats(observeNode);
    });

    if (previousSort >= 0) {
        titleNode.children[previousSort - 1].click();
        titleNode.children[previousSort - 1].click();
    } else if (previousSort < 0) titleNode.children[-previousSort - 1].click();

    observeNode.querySelectorAll(".table-body > .table-row").forEach((e) => showStats(e));
}

function displayStatus() {
    const warWrapper = document.querySelector(".faction-war");
    if (!warWrapper) return;

    // let statusDisplay = warWrapper.parentElement.querySelector(".wall-battlestats-extended-status-display");
    // if (!statusDisplay) {
    //     statusDisplay = document.createElement("div");
    //     statusDisplay.classList.add("wall-battlestats-extended-status-display");
    //
    //     warWrapper.insertAdjacentElement("beforebegin", statusDisplay);
    // }
    //
    // const { enemies, friendly } = countAllStatuses(warWrapper);
    //
    // const _statusHash = statusHash(enemies, friendly);
    // if (statusDisplay.dataset.statusHash === _statusHash) return;
    // statusDisplay.dataset.statusHash = _statusHash;
    //
    // statusDisplay.innerHTML = `
    //     <div><strong>Enemy:</strong> 🟢 ${enemies.online} - 🟡 ${enemies.idle} - 🔴 ${enemies.offline}</div><br/>
    //     <div><strong>Friendly:</strong> 🟢 ${friendly.online} - 🟡 ${friendly.idle} - 🔴 ${friendly.offline}</div>
    // `;

    displaySide(warWrapper, ".name.your", ".your");
    displaySide(warWrapper, ".name.enemy", ".enemy");
}

function displaySide(warWrapper, titleSelector, memberSelector) {
    const titleElement = warWrapper.parentElement.querySelector(titleSelector);
    if (!titleElement) return;

    let statusDisplay = titleElement.querySelector(".wall-battlestats-extended-status-display");
    if (!statusDisplay) {
        const scoreElement = titleElement.querySelector(".score");
        if (!scoreElement) return;

        statusDisplay = document.createElement("div");
        statusDisplay.classList.add("wall-battlestats-extended-status-display");

        scoreElement.insertAdjacentElement("afterend", statusDisplay);
    }

    const statuses = countStatuses(warWrapper, memberSelector);

    const _statusHash = statusHash(statuses);
    if (statusDisplay.dataset.statusHash === _statusHash) return;
    statusDisplay.dataset.statusHash = _statusHash;

    statusDisplay.textContent = `🟢 ${statuses.online} - 🟡 ${statuses.idle} - 🔴 ${statuses.offline}`;
}

function countStatuses(warWrapper, selector) {
    return Array.from(warWrapper.querySelectorAll(selector))
        .map((row) => row.querySelector("svg[fill*='svg_status']")?.getAttribute("fill"))
        .filter((fill) => !!fill)
        .map((fill) => {
            if (fill.includes("idle")) return "idle";
            else if (fill.includes("online")) return "online";
            else if (fill.includes("offline")) return "offline";
        })
        .filter((status) => !!status)
        .reduce((all, status) => ({ ...all, [status]: status in all ? all[status] + 1 : 1 }), {});
}

function statusHash(statuses) {
    return JSON.stringify(statuses);
}

(() => {
    if (!apiKey) return;

    updateHospTimers();
    memberList(document.querySelector(".members-list"));
    watchWalls(document.querySelector(".f-war-list"));
    setInterval(displayStatus, 1000);

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const node of mutation.addedNodes) {
                memberList(node.querySelector && node.querySelector(".members-list"));
                watchWalls(node.querySelector && node.querySelector(".f-war-list"));
            }
        });
    }).observe(document.body, { childList: true, subtree: true });

    const oldFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, init) => {
        if (!url.includes("step=getwarusers") && !url.includes("step=getProcessBarRefreshData")) return oldFetch(url, init);

        const response = await oldFetch(url, init);
        const clone = response.clone();
        clone.json().then((json) => {
            let members = null;
            if (json.warDesc) members = json.warDesc.members;
            else if (json.userStatuses) members = json.userStatuses;
            else return;

            Object.keys(members).forEach((id) => {
                const status = members[id].status || members[id];
                id = members[id].userID || id;
                if (status.text === "Hospital") hospTime[id] = status.updateAt;
                else delete hospTime[id];
            });

            showStatsAll();
        });

        return response;
    };

    const oldWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function (...args) {
        const socket = new oldWebSocket(...args);
        socket.addEventListener("message", (event) => {
            const json = JSONparse(event.data);
            if (!json?.result?.data?.data?.message?.namespaces?.users?.actions?.updateStatus?.status) return;

            const id = json.result.data.data.message.namespaces.users.actions.updateStatus.userId;
            const status = json.result.data.data.message.namespaces.users.actions.updateStatus.status;
            if (status.text === "Hospital") hospTime[id] = status.updateAt;
            else delete hospTime[id];

            showStatsAll();
        });
        return socket;
    };
})();
