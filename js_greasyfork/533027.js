// ==UserScript==
// @name         MWI Nex Leaderboard
// @namespace    https://milkywayidle.com/
// @version      2.0
// @description  Overhauls the leaderboard UI using data from li-mwi-leaderboard.ngrok.io
// @match        https://*.milkywayidle.com/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533027/MWI%20Nex%20Leaderboard.user.js
// @updateURL https://update.greasyfork.org/scripts/533027/MWI%20Nex%20Leaderboard.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuration ---
  const SORT_LIST_WIDTH = "140px";
  const COLLAPSED_STATE_KEY = "mwi_leaderboard_sort_collapsed";

  // --- Global State ---
  let leaderboardData = null;
  let globalPlayerRanks = {};
  let currentSortBy = "Total Level";
  let isSortListCollapsed = GM_getValue(COLLAPSED_STATE_KEY, false);
  let isProcessing = false;

  const style = document.createElement("style");
style.textContent = `
       /* Main Wrapper */
       .mwi-wrapper { display: flex; height: 1000px; border: 1px solid #333; background: rgba(5, 5, 10, 0.85); color: #f0f0f0; font-family: 'Segoe UI', sans-serif; overflow: hidden; width: 98%; max-width: 1600px; margin: 5px auto; }
       /* Left Panel */
       .mwi-left { width: 45%; min-width: 30px; border-right: 1px solid #222; display: flex; flex-direction: row; overflow: hidden; transition: width 0.3s ease; }
       /* Sort Options List */
       .mwi-sort-options-list { width: ${SORT_LIST_WIDTH}; height: 100%; display: flex; flex-direction: column; background: rgba(10, 10, 20, 0.4); flex-shrink: 0; transition: width 0.3s ease, padding 0.3s ease, border 0.3s ease; overflow: hidden; }
       .mwi-sort-options-scroll { flex-grow: 1; overflow-y: auto; overflow-x: hidden; padding-bottom: 5px; }
       .mwi-sort-option { padding: 7px 10px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; color: #bbb; border-bottom: 1px solid #222; transition: background-color 0.2s, color 0.2s; }
       .mwi-sort-option:hover { background-color: rgba(255, 255, 255, 0.08); color: #fff; }
       .mwi-sort-option.active { background-color: rgba(60, 120, 180, 0.3); color: #7dd3fc; font-weight: bold; }
       /* Toggle Button */
       .mwi-sort-toggle-btn { display: flex; align-items: center; justify-content: center; width: 20px; height: 100%; background-color: #18181f; border-right: 1px solid #2b2b33; color: #aaa; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s, color 0.2s; font-size: 16px; font-weight: bold; line-height: 1; }
       .mwi-sort-toggle-btn:hover { background-color: #2a2a33; color: #eee; }
       /* Player List Area */
       .mwi-player-area { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 150px; }
       .mwi-player-list-container { flex-grow: 1; overflow-y: auto; padding-right: 5px; }
       /* Player List Header */
       .mwi-list-header { display: flex; justify-content: space-between; padding: 5px 4px; border-bottom: 1px solid #555; margin: 0 4px 4px 4px; font-weight: bold; color: #ddd; font-size: 11px; text-transform: uppercase; flex-shrink: 0; }
       .mwi-list-header > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
       /* Player List Columns */
       .mwi-header-rank, .mwi-player-rank { flex-basis: 15%; color: #facc15; font-weight: bold; text-align: left; }
       .mwi-header-name, .mwi-player-name { flex-basis: 55%; padding: 0 5px; color: #f0f0f0; text-align: center; }
       .mwi-header-value, .mwi-player-value { flex-basis: 30%; text-align: center; color: #aaa; }
       .mwi-header-value { color: #ddd; } .mwi-header-rank { color: #ddd; } .mwi-header-name { color: #ddd; }
       /* Player Row */
       .mwi-player-row { cursor: pointer; padding: 7px 4px; margin: 0 4px; border-bottom: 1px solid #222; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
       .mwi-player-row:hover { background: rgba(255, 255, 255, 0.05); }
       .mwi-player-row.selected { background: rgba(80, 100, 120, 0.2); }
       .mwi-player-row > span { flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
       .mwi-player-name { line-height: normal; }

       /* --- Right Panel --- */
       .mwi-right { width: 55%; padding: 0; background: rgba(10, 10, 20, 0.6); display: flex; flex-direction: column; overflow-y: hidden; }
       .mwi-right-content {
           flex-grow: 1;
           overflow-y: auto;
           padding: 5px;
           display: flex;
           flex-direction: column;
        }
       .mwi-right-content > em { margin: auto; font-size: 14px; color: #aaa; }
       .mwi-header { /* Player name header */
           font-size: 20px;
           font-weight: bold;
           color: #ffe27a;
           margin-bottom: 7px;
           flex-shrink: 0;
           display: inline-block;
           line-height: normal;
        }
       .mwi-meta { /* Stats container */
           font-size: 13px;
           line-height: 1.4; /* <<< Increased line height */
           color: #bbb;
           margin-bottom: 8px; /* <<< Increased margin */
           flex-shrink: 0;
        }
       .mwi-meta b { color: #ddd; }
       .mwi-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 20px; font-size: 13px; margin-top: 6px; align-items: start; }
       .mwi-meta-grid > div { white-space: nowrap; }
       .mwi-ranks-container {
           flex-shrink: 0;
           margin-top: 15px; /* <<< Increased margin */
        }

       /* Right Panel Ranks Table Styling */
       .mwi-rank-header-row {
           display: flex; width: 100%; align-items: center;
           padding: 6px 4px; /* <<< Increased padding */
           border-bottom: 1px solid #666; font-weight: bold; color: #ddd;
           font-size: 11px; text-transform: uppercase;
           margin-bottom: 4px; /* <<< Increased margin */
       }
       .mwi-rank-row {
           display: flex; width: 100%; align-items: center;
           padding: 5px 4px; /* <<< Increased padding */
           border-bottom: 1px solid #2a2a33; font-size: 13px;
           line-height: 1.4; /* <<< Increased line height */
       }
       .mwi-rank-row:last-child { border-bottom: none; }
       /* Ranks Table Columns */
       .mwi-rh-skill, .mwi-rd-skill { flex-basis: 38%; text-align: left; padding-right: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
       .mwi-rh-level, .mwi-rd-level { flex-basis: 15%; text-align: center; }
       .mwi-rh-xphr, .mwi-rd-xphr { flex-basis: 22%; text-align: center; }
       .mwi-rh-rank, .mwi-rd-rank { flex-basis: 25%; text-align: right; padding-left: 10px; }
       /* Ranks Table Text Styles */
       .mwi-rh-skill, .mwi-rh-level, .mwi-rh-xphr, .mwi-rh-rank { color: #ddd; }
       .mwi-rd-skill { color: #ccc; } .mwi-rd-level { color: #bbb; } .mwi-rd-xphr { color: #38bdf8; font-size: 11px; } .mwi-rd-rank { color: #facc15; font-weight: bold; }

       /* Collapsed State */
       .mwi-left.collapsed .mwi-sort-options-list { width: 0; border-right: none; padding: 0; }
       .mwi-left.collapsed .mwi-sort-toggle-btn { border-right: 1px solid #333; }

       /* Media Query */
       @media (min-width: 1900px) {
           .mwi-left { width: 40%; } .mwi-right { width: 60%; }
           .mwi-header-rank, .mwi-player-rank { flex-basis: 12%; }
           .mwi-header-name, .mwi-player-name { flex-basis: 63%; text-align: center; }
           .mwi-header-value, .mwi-player-value { flex-basis: 25%; }
       }
     `;
  document.head.appendChild(style);

  // --- Helper Functions ---
  function getSkillData(player, skillKey) { if (!player || !Array.isArray(player.skills)) { return { level: (skillKey === 'total_level' && player?.totalLevel) ? player.totalLevel : 0, exp: 0 }; } const skill = player.skills.find( (s) => s.skill.toLowerCase() === skillKey.toLowerCase() ); const level = skill?.level ?? ((skillKey === 'total_level' && player?.totalLevel) ? player.totalLevel : 0); const exp = skill?.exp ?? 0; return { level: (typeof level === 'number' && !isNaN(level)) ? level : 0, exp: (typeof exp === 'number' && !isNaN(exp)) ? exp : 0 }; }
  function formatNumber(n) { if (n === null || n === undefined || isNaN(n)) { return "0"; } const num = parseFloat(n); if (num === 0) return "0"; if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"; if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"; if (num >= 10000) return (num / 1e3).toFixed(1) + "K"; if (num >= 1000) return (num / 1e3).toFixed(0) + "K"; return String(Math.floor(num)); }

  // --- Rank Calculation Function ---
  function calculateAllPlayerRanks(players) { const calculatedRanks = {}; if (!players || players.length === 0) return calculatedRanks; players.forEach(p => { if(p?.name) calculatedRanks[p.name] = {}; }); const categories = [ "Total Level", "XP", "Combat Level", "House Level", "Enhancing", "Magic", "Crafting", "Milking", "Stamina", "Cooking", "Tailoring", "Brewing", "Cheesesmithing", "Intelligence", "Power", "Ranged", "Attack", "Defense", "Foraging", "Alchemy", "Woodcutting" ]; for (const category of categories) { let key = category.toLowerCase().replace(/ /g, "_"); const sortable = players.map(p => { if (!p || !p.name) return null; let sortValue = 0; if (category === "XP") { sortValue = p.totalXP || 0; } else if (category === "Combat Level") { sortValue = p.combatLevel || 0; } else if (category === "House Level") { sortValue = p.totalHouseLevel || 0; } else { sortValue = getSkillData(p, key).exp; } sortValue = (typeof sortValue === 'number' && !isNaN(sortValue)) ? sortValue : 0; return { name: p.name, value: sortValue }; }).filter(p => p !== null); sortable.sort((a, b) => b.value - a.value); let denseRank = 0; let lastValue = -Infinity; for (let i = 0; i < sortable.length; i++) { if (sortable[i].value !== lastValue) { denseRank++; lastValue = sortable[i].value; } if (calculatedRanks[sortable[i].name]) { calculatedRanks[sortable[i].name][key] = denseRank; } } } return calculatedRanks; }

  // --- Data Fetching ---
  async function fetchLeaderboardDataAndCalculateRanks() { if (isProcessing) { return; } isProcessing = true; try { const res = await fetch("https://li-mwi-leaderboard.ngrok.io/api/leaderboard"); if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); } leaderboardData = await res.json(); if (!Array.isArray(leaderboardData)) { leaderboardData = []; } globalPlayerRanks = calculateAllPlayerRanks(leaderboardData); } catch (err) { console.error("[MWI] Failed to fetch or process leaderboard data:", err); leaderboardData = null; globalPlayerRanks = {}; } finally { isProcessing = false; } }

  // --- UI Injection and Rendering ---
  function injectCustomLeaderboard(container) { if (!leaderboardData) { container.innerHTML = "Error: Leaderboard data not available."; return; } container.innerHTML = ""; const wrapper = document.createElement("div"); wrapper.className = "mwi-wrapper"; const left = document.createElement("div"); left.className = "mwi-left"; if (isSortListCollapsed) { left.classList.add("collapsed"); } const sortOptionsList = document.createElement("div"); sortOptionsList.className = "mwi-sort-options-list"; const sortOptionsScroll = document.createElement("div"); sortOptionsScroll.className = "mwi-sort-options-scroll"; const sortOptions = [ "Total Level", "XP", "Combat Level", "House Level", "Enhancing", "Magic", "Crafting", "Milking", "Stamina", "Cooking", "Tailoring", "Brewing", "Cheesesmithing", "Intelligence", "Power", "Ranged", "Attack", "Defense", "Foraging", "Alchemy", "Woodcutting" ]; sortOptions.forEach((opt) => { const optionDiv = document.createElement("div"); optionDiv.className = "mwi-sort-option"; optionDiv.textContent = opt; optionDiv.dataset.sortBy = opt; if (opt === currentSortBy) { optionDiv.classList.add("active"); } sortOptionsScroll.appendChild(optionDiv); }); sortOptionsList.appendChild(sortOptionsScroll); const toggleBtn = document.createElement("div"); toggleBtn.className = "mwi-sort-toggle-btn"; toggleBtn.textContent = isSortListCollapsed ? "»" : "«"; toggleBtn.title = isSortListCollapsed ? "Expand Sort List" : "Collapse Sort List"; const playerArea = document.createElement("div"); playerArea.className = "mwi-player-area"; const listHeader = document.createElement("div"); listHeader.className = "mwi-list-header"; listHeader.innerHTML = `<span class="mwi-header-rank">RANK</span><span class="mwi-header-name">NAME</span><span class="mwi-header-value">TYPE</span>`; const headerValueSpan = listHeader.querySelector(".mwi-header-value"); const playerListContainer = document.createElement("div"); playerListContainer.className = "mwi-player-list-container"; playerArea.appendChild(listHeader); playerArea.appendChild(playerListContainer); left.appendChild(sortOptionsList); left.appendChild(toggleBtn); left.appendChild(playerArea); const right = document.createElement("div"); right.className = "mwi-right"; const rightContent = document.createElement("div"); rightContent.className = "mwi-right-content"; rightContent.innerHTML = "<em>Select a player to view details</em>"; right.appendChild(rightContent);
    function updateListHeader(sortByValue) { if (headerValueSpan) { headerValueSpan.textContent = sortByValue; headerValueSpan.title = `Sorted by: ${sortByValue}`; } }
    function renderPlayers(sortBy) { updateListHeader(sortBy); if (!leaderboardData) { playerListContainer.innerHTML = "<div style='padding:10px; color:#aaa;'>No leaderboard data available.</div>"; return; } if (leaderboardData.length === 0) { playerListContainer.innerHTML = "<div style='padding:10px; color:#aaa;'>Leaderboard data is empty.</div>"; return; } playerListContainer.innerHTML = ""; const sorted = [...leaderboardData].sort((a, b) => { try { if (!a || !b) return 0; let valA = 0; let valB = 0; let xpA = a.totalXP || 0; let xpB = b.totalXP || 0; let key = sortBy.toLowerCase().replace(/ /g, "_"); if (sortBy === "XP") { valA = xpA; valB = xpB; } else if (sortBy === "Combat Level") { valA = a.combatLevel || 0; valB = b.combatLevel || 0; } else if (sortBy === "House Level") { valA = a.totalHouseLevel || 0; valB = b.totalHouseLevel || 0; } else { const dataA = getSkillData(a, key); const dataB = getSkillData(b, key); valA = dataA.exp; valB = dataB.exp; } if (valB !== valA) { return valB - valA; } else { return xpB - xpA; } } catch (e) { console.error("Error during sort comparison:", e, a, b); return 0; } });
      sorted.forEach((player, idx) => { if (!player || !player.name) return; const p = document.createElement("div"); p.className = "mwi-player-row"; const playerName = player.name; p.innerHTML = ""; const rankSpan = document.createElement("span"); rankSpan.className = "mwi-player-rank"; rankSpan.textContent = `#${idx + 1}`; const nameSpan = document.createElement("span"); nameSpan.className = "mwi-player-name"; nameSpan.textContent = playerName; nameSpan.title = playerName; const valueSpan = document.createElement("span"); valueSpan.className = "mwi-player-value"; let displayValue = ""; let valueKey = sortBy.toLowerCase().replace(/ /g, "_"); if (sortBy === "XP") { displayValue = formatNumber(player.totalXP || 0); } else if (sortBy === "Combat Level") { displayValue = player.combatLevel || 0; } else if (sortBy === "House Level") { displayValue = player.totalHouseLevel || 0; } else { displayValue = getSkillData(player, valueKey).level; } valueSpan.textContent = String(displayValue);
        if (player.customStyle?.inlineStyles) { const styles = player.customStyle.inlineStyles; nameSpan.style.background = styles.background || ''; nameSpan.style.color = styles.color || ''; nameSpan.style.webkitTextFillColor = styles.WebkitTextFillColor || ''; nameSpan.style.webkitBackgroundClip = styles.WebkitBackgroundClip || ''; nameSpan.style.backgroundClip = styles.backgroundClip || ''; nameSpan.style.display = 'inline-block'; nameSpan.style.lineHeight = 'normal'; } else { nameSpan.style.background = ''; nameSpan.style.color = ''; nameSpan.style.webkitTextFillColor = ''; nameSpan.style.webkitBackgroundClip = ''; nameSpan.style.backgroundClip = ''; nameSpan.style.display = ''; nameSpan.style.lineHeight = ''; }
        p.appendChild(rankSpan); p.appendChild(nameSpan); p.appendChild(valueSpan);
        p.addEventListener("click", () => { const playerTotalLevel = getSkillData(player, "total_level").level; const totalXP = player.totalXP || 0; const createdAtTimestamp = player.createdAt ? new Date(player.createdAt).getTime() : Date.now(); const daysPlayed = Math.max( 0, Math.floor((Date.now() - createdAtTimestamp) / 86400000) ); rightContent.innerHTML = `<div class="mwi-header">${playerName}</div><div class="mwi-meta"><div class="mwi-meta-grid"><div><b>Guild:</b> ${player.guildName || "N/A"}</div><div><b>Level:</b> ${playerTotalLevel}</div><div><b>Recent XP/hr:</b> ${formatNumber( player.rollingXPPerHour )}</div><div><b>Lifetime XP/hr:</b> ${formatNumber( player.lifetimeXPPerHour )}</div><div><b>Total XP:</b> ${formatNumber(totalXP)}</div><div><b>Days Played:</b> ${daysPlayed}</div></div></div><div class="mwi-ranks-container">${buildRankList( player )}</div>`; const headerElement = rightContent.querySelector('.mwi-header'); if (headerElement) { if (player.customStyle?.inlineStyles) { const styles = player.customStyle.inlineStyles; headerElement.style.background = styles.background || ''; headerElement.style.color = styles.color || ''; headerElement.style.webkitTextFillColor = styles.WebkitTextFillColor || ''; headerElement.style.webkitBackgroundClip = styles.WebkitBackgroundClip || ''; headerElement.style.backgroundClip = styles.backgroundClip || ''; headerElement.style.display = 'inline-block'; headerElement.style.lineHeight = 'normal';} else { headerElement.style.background = ''; headerElement.style.color = ''; headerElement.style.webkitTextFillColor = ''; headerElement.style.webkitBackgroundClip = ''; headerElement.style.backgroundClip = ''; headerElement.style.display = ''; headerElement.style.lineHeight = ''; } } playerListContainer.querySelectorAll(".mwi-player-row.selected").forEach((row) => row.classList.remove("selected")); p.classList.add("selected"); }); playerListContainer.appendChild(p);
      });
    }
    sortOptionsList.addEventListener("click", (event) => { const targetOption = event.target.closest(".mwi-sort-option"); if (!targetOption || !targetOption.dataset.sortBy) return; const newSortBy = targetOption.dataset.sortBy; if (newSortBy === currentSortBy) return; currentSortBy = newSortBy; sortOptionsList.querySelector(".mwi-sort-option.active")?.classList.remove("active"); targetOption.classList.add("active"); renderPlayers(currentSortBy); });
    toggleBtn.addEventListener("click", () => { isSortListCollapsed = !isSortListCollapsed; left.classList.toggle("collapsed", isSortListCollapsed); toggleBtn.textContent = isSortListCollapsed ? "»" : "«"; toggleBtn.title = isSortListCollapsed ? "Expand Sort List" : "Collapse Sort List"; try { GM_setValue(COLLAPSED_STATE_KEY, isSortListCollapsed); } catch (e) { console.warn( "[MWI] Failed to save collapse state. Error:", e ); } });
    renderPlayers(currentSortBy);
    wrapper.appendChild(left); wrapper.appendChild(right); container.appendChild(wrapper);
  }

  // --- buildRankList Function (4-Column Table Format, uses calculated ranks) ---
  function buildRankList(player) { if (!player || !player.name) return ""; const categories = [ "Total Level", "XP", "Combat Level", "House Level", "Enhancing", "Magic", "Crafting", "Milking", "Stamina", "Cooking", "Tailoring", "Brewing", "Cheesesmithing", "Intelligence", "Power", "Ranged", "Attack", "Defense", "Foraging", "Alchemy", "Woodcutting" ]; const rolling = player.rollingXPPerHourBreakdown || {}; let tableHtml = ''; tableHtml += `<div class="mwi-rank-header-row"><span class="mwi-rh-skill">Skill</span><span class="mwi-rh-level">Level/Value</span><span class="mwi-rh-xphr">XP/hr</span><span class="mwi-rh-rank">Rank</span></div>`;
    for (const stat of categories) { let key = stat.toLowerCase().replace(/ /g, "_"); let displayValue = "—"; let xpHrText = '&nbsp;'; let rankValue = globalPlayerRanks[player.name]?.[key]; let rankDisplay = (rankValue !== null && rankValue !== undefined) ? `#${rankValue}` : "—"; if (stat === "XP") { displayValue = formatNumber(player.totalXP || 0); const overallXpHr = player.rollingXPPerHour; xpHrText = (overallXpHr !== null && overallXpHr !== undefined && overallXpHr > 0) ? `(${formatNumber(overallXpHr)} XP/hr)` : '&nbsp;'; } else if (stat === "Total Level") { displayValue = getSkillData(player, key).level; xpHrText = '&nbsp;'; } else if (stat === "Combat Level") { displayValue = player.combatLevel ?? "—"; xpHrText = '&nbsp;'; } else if (stat === "House Level") { displayValue = player.totalHouseLevel ?? "—"; xpHrText = '&nbsp;'; } else { displayValue = getSkillData(player, key).level; const skillXpHr = rolling[key]; xpHrText = (skillXpHr !== null && skillXpHr !== undefined && skillXpHr > 0) ? `(${formatNumber(skillXpHr)} XP/hr)` : '&nbsp;'; } displayValue = displayValue === "—" || displayValue === null || displayValue === undefined ? "—" : displayValue; tableHtml += `<div class="mwi-rank-row"><span class="mwi-rd-skill" title="${stat}">${stat}</span><span class="mwi-rd-level">${displayValue}</span><span class="mwi-rd-xphr">${xpHrText}</span><span class="mwi-rd-rank">${rankDisplay}</span></div>`; } return tableHtml;
  }

  // --- MutationObserver Logic ---
  function applyLeaderboardEnhancements(targetNode) { let leaderboardDiv = null; if (targetNode.nodeType === Node.ELEMENT_NODE) { if (targetNode.matches('[class^="LeaderboardPanel_leaderboardPanel"]')) { leaderboardDiv = targetNode; } else if (targetNode.querySelector) { leaderboardDiv = targetNode.querySelector('[class^="LeaderboardPanel_leaderboardPanel"]:not([data-custom-injected="true"])'); } } if (leaderboardDiv && !leaderboardDiv.dataset.customInjected) { leaderboardDiv.dataset.customInjected = "true"; if ((!leaderboardData || Object.keys(globalPlayerRanks).length === 0) && !isProcessing) { fetchLeaderboardDataAndCalculateRanks().then(() => { if (leaderboardData) { injectCustomLeaderboard(leaderboardDiv); } else { leaderboardDiv.innerHTML = "Failed to load or process leaderboard data."; } }); } else if (leaderboardData && Object.keys(globalPlayerRanks).length > 0) { injectCustomLeaderboard(leaderboardDiv); } else if (isProcessing) { leaderboardDiv.innerHTML = "<em>Loading leaderboard... (Try switching tabs if not loading)</em>"; } else { leaderboardDiv.innerHTML = "Error: Cannot display leaderboard."; } } }
  const observerCallback = (mutationsList, observer) => { for (const mutation of mutationsList) { if (mutation.type === 'childList' && mutation.addedNodes.length > 0) { mutation.addedNodes.forEach(node => { applyLeaderboardEnhancements(node); }); } } }; const observer = new MutationObserver(observerCallback); observer.observe(document.body, { childList: true, subtree: true });

  // --- Initial Setup ---
  document.querySelectorAll('[class^="LeaderboardPanel_leaderboardPanel"]:not([data-custom-injected="true"])').forEach(panel => { applyLeaderboardEnhancements(panel); }); if (!document.querySelector('[class^="LeaderboardPanel_leaderboardPanel"]') && !isProcessing) { fetchLeaderboardDataAndCalculateRanks(); } console.log('[MWI] Leaderboard Enhancer initialized and observing.');

})();