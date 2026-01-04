// ==UserScript==
// @name         amq song history merchant edition
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Track AMQ song history only in selected mode
// @author       Minigamer42 + Racoonseki
// @match        https://*.animemusicquiz.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532978/amq%20song%20history%20merchant%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/532978/amq%20song%20history%20merchant%20edition.meta.js
// ==/UserScript==

if (document.getElementById('startPage')) return;

if (typeof Listener === 'undefined') {
    console.error('[SongHistory] Listener class not found. The script will not run.');
    return;
}

const DEBUG = false;
const defaultGroups = ["Solo", "Ranked", "Jam", "Multiplay", "Community"];

async function migrateToCompactFormat() {
    let history = await GM_getValue("songHistory", {});
    let needsUpdate = false;

    for (const key in history) {
        if (Object.prototype.hasOwnProperty.call(history, key)) {
            const entry = history[key];
            if (entry.hasOwnProperty('count')) {
                needsUpdate = true;
                history[key] = {
                    c: entry.count || 0,
                    cc: entry.correctCount || 0,
                    sc: entry.spectatorCount || 0,
                    t: entry.lastPlayed || 0,
                    p: entry.lastPlayers || []
                };
            }
        }
    }

    if (needsUpdate) {
        await GM_setValue("songHistory", history);
    } else {
        //console.log("[SongHistory] No data migration needed.");
    }
}



async function synchronizeAndBackupHistory() {
    try {
        await migrateToCompactFormat();

        const gmHistory = await GM_getValue("songHistory", null);
        const localHistoryText = localStorage.getItem("songHistory");
        let localHistory = null;

        if (localHistoryText) {
            try {
                localHistory = JSON.parse(localHistoryText);
            } catch (e) {
                console.error("[SongHistory] Could not parse localStorage history, ignoring it.", e);
                localHistory = null;
            }
        }

        if (gmHistory && Object.keys(gmHistory).length > 0) {
            if (DEBUG) console.log("[SongHistory] Backing up song history from GM to localStorage.");
            localStorage.setItem("songHistory", JSON.stringify(gmHistory));
        } else if (localHistory && Object.keys(localHistory).length > 0) {
            console.log("[SongHistory] GM storage is empty. Restoring from localStorage backup.");
            await GM_setValue("songHistory", localHistory);
            await migrateToCompactFormat();
        } else {
            if (DEBUG) console.log("[SongHistory] No history found to backup or restore.");
        }

        const groupsMigrationDone = await GM_getValue("groups_migration_complete", false);
        if (!groupsMigrationDone) {
            const oldGroupsData = localStorage.getItem("songHistoryEnabledGroups");
            if (oldGroupsData) {
                console.log("[SongHistory] Migrating 'songHistoryEnabledGroups' from localStorage.");
                await GM_setValue("songHistoryEnabledGroups", JSON.parse(oldGroupsData));
                await GM_setValue("groups_migration_complete", true);
            }
        }
    } catch (e) {
        console.error("[SongHistory] An error occurred during synchronization/backup:", e);
    }
}


function getModeGroup(mode) {
    if (["Solo", "Practice", "Training"].includes(mode)) return "Solo";
    if (["Ranked"].includes(mode)) return "Ranked";
    if (["Community"].includes(mode)) return "Community";
    if (["Jam"].includes(mode)) return "Jam";
    return "Multiplay";
}

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return;
    }
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            obs.disconnect();
            callback(element);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

async function injectGroupCheckboxUI() {
    waitForElement("#mcActiveContainer", async (container) => {
        if (document.getElementById("songHistoryModeGroupList")) return;

        const groups = defaultGroups;
        const saved = await GM_getValue("songHistoryEnabledGroups", groups);

        const wrapper = document.createElement("div");
        wrapper.style.marginTop = "8px";
        wrapper.innerHTML = `
            <h5 style="margin-bottom: 5px;">History Modes</h5>
            <div id="songHistoryModeGroupList" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
        `;
        container.appendChild(wrapper);
        const listDiv = document.getElementById("songHistoryModeGroupList");

        groups.forEach(group => {
            const btn = document.createElement("button");
            btn.textContent = group;
            btn.style.cssText = "cursor: pointer; font-size: 13px; user-select: none; transition: background-color 0.2s; border: none; border-radius: 4px; padding: 2px 6px; color: white;";
            btn.dataset.group = group;
            btn.style.backgroundColor = saved.includes(group) ? "green" : "red";

            btn.addEventListener("click", async () => {
                const current = await GM_getValue("songHistoryEnabledGroups", []);
                const updated = current.includes(group)
                    ? current.filter(g => g !== group)
                    : [...current, group];
                await GM_setValue("songHistoryEnabledGroups", updated);
                btn.style.backgroundColor = updated.includes(group) ? "green" : "red";
                if (DEBUG) console.log("[SongHistory] Updated Enabled Groups:", updated);
            });
            listDiv.appendChild(btn);
        });
    });
}

async function setupCore() {
    await synchronizeAndBackupHistory();

    if (await GM_getValue("songHistoryEnabledGroups", null) === null) {
        await GM_setValue("songHistoryEnabledGroups", defaultGroups);
    }
    if (await GM_getValue("songHistory", null) === null) {
        await GM_setValue("songHistory", {});
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "rowPlayCount";

    const timeAgo = (time) => {
        if (time === 0) return 'never';
        if (typeof time === 'string') time = +new Date(time);
        if (time instanceof Date) time = time.getTime();
        const formats = [
            [60, 'seconds', 1],
            [120, '1 minute ago', '1 minute from now'],
            [3600, 'minutes', 60],
            [7200, '1 hour ago', '1 hour from now'],
            [86400, 'hours', 3600],
            [172800, 'Yesterday', 'Tomorrow'],
            [604800, 'days', 86400],
            [1209600, 'Last week', 'Next week'],
            [2419200, 'weeks', 604800],
            [4838400, 'Last month', 'Next month'],
            [29030400, 'months', 2419200],
            [58060800, 'Last year', 'Next year'],
            [2903040000, 'years', 29030400]
        ];
        let seconds = (+new Date() - time) / 1000;
        let token = 'ago', list_choice = 1;
        if (seconds < 0) { seconds = Math.abs(seconds); token = 'from now'; list_choice = 2; }
        for (const f of formats) {
            if (seconds < f[0]) {
                return typeof f[2] === 'string'
                    ? f[list_choice]
                    : `${Math.floor(seconds / f[2])} ${f[1]} ${token}`;
            }
        }
        return time;
    };

    const boxDiv = document.querySelector("div.qpSideContainer > div.row")?.parentElement;
    if (boxDiv) {
        boxDiv.insertBefore(infoDiv, boxDiv.children[4]);
    }

    new Listener("answer results", async (data) => {
        try {
            const gameMode = quiz.gameMode;
            const modeGroup = getModeGroup(gameMode);
            const currentGroups = await GM_getValue("songHistoryEnabledGroups", []);
            const shouldRecord = currentGroups.includes(modeGroup);

            const webm = data.songInfo.videoTargetMap?.catbox?.[720]?.slice(0, 6)
                ?? data.songInfo.videoTargetMap?.catbox?.[480]?.slice(0, 6);
            if (!webm) {
                infoDiv.innerHTML = '';
                return;
            }

            const songHistory = await GM_getValue("songHistory", {});
            const current = songHistory[webm] || { c: 0, cc: 0, sc: 0, t: 0, p: [] };

            const displayCount = current.c + 1;
            const displaySpectatorCount = current.sc + (quiz.isSpectator ? 1 : 0);
            const isCorrect = quiz.isSpectator ? false : data.players.find(p => p.gamePlayerId === quiz.ownGamePlayerId)?.correct ?? false;
            const displayCorrectCount = current.cc + (isCorrect ? 1 : 0);
            const displayNonSpecNow = displayCount - displaySpectatorCount;
            const displayCorrectRatio = displayNonSpecNow > 0 ? displayCorrectCount / displayNonSpecNow : 0;

            infoDiv.innerHTML = `Played <b>${displayCount} time${displayCount > 1 ? 's' : ''} (${displaySpectatorCount} in spec)</b>`;
            if (displayNonSpecNow > 0) {
                infoDiv.innerHTML += `<br>Answer rate: <b>${displayCorrectCount}/${displayNonSpecNow}</b> (${(displayCorrectRatio * 100).toFixed(2)}%)`;
            }
            infoDiv.innerHTML += `<br>Last played <b>${timeAgo(current.t)}</b>`;
            infoDiv.innerHTML += `<br>From: <b>${current.p.join(', ') || 'N/A'}</b>`;

            const lastPlayerLabel = infoDiv.querySelector('b:last-of-type');
            if (current.p && current.p.length === 1) {
                const lastPlayerGroup = current.p[0];
                if (lastPlayerGroup === 'Ranked') {
                    lastPlayerLabel.style.color = '#ffc700';
                } else if (lastPlayerGroup === 'Community') {
                    lastPlayerLabel.style.color = '#87CEEB';
                }
            }


            if (!shouldRecord) {
                infoDiv.style.color = "#aaa";
            } else {
                infoDiv.style.color = "";
                current.c = displayCount;
                current.cc = displayCorrectCount;
                current.sc = displaySpectatorCount;
                current.t = Date.now();
                if (gameMode === "Ranked" || gameMode === "Community") {
                    current.p = [gameMode];
                } else {
                    current.p = await findPreviousPlayers();
                }
                songHistory[webm] = current;
                await GM_setValue("songHistory", songHistory);
            }
        } catch (err) {
            console.error("[SongHistory] Error in listener callback:", err);
        }
    }).bindListener();
}

async function findPreviousPlayers() {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const nodes = document.querySelectorAll('.qpAvatarContainer');
                const players = Array.from(nodes)
                    .filter(c => c.querySelector('.qpAvatarStatusInnerContainer:not(.hide)') && c.querySelector('.qpAvatarName'))
                    .map(c => c.querySelector('.qpAvatarName').textContent.trim());
                if (players.length > 4) {
                    const firstFour = players.slice(0, 4);
                    firstFour[3] += ` (+${players.length - 4} more)`;
                    resolve(firstFour);
                } else {
                    resolve(players);
                }
            } catch (e) {
                console.error("[SongHistory] Error in findPreviousPlayers:", e);
                resolve([]);
            }
        }, 500);
    });
}

// Initialize the script
setupCore();
injectGroupCheckboxUI();
