// ==UserScript==
// @name         Voxiom Player Stats Full UI
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Display full Voxiom player stats in a modern floating UI
// @author       You
// @match        https://voxiom.io/*
// @grant        GM_xmlhttpRequest
// @connect      voxiom.io
// @run-at       document-idle
// @license.     MIT
// @downloadURL https://update.greasyfork.org/scripts/542815/Voxiom%20Player%20Stats%20Full%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/542815/Voxiom%20Player%20Stats%20Full%20UI.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject UI panel
  const panel = document.createElement("div");
  panel.innerHTML = `
    <style>
      #voxiomStatsPanel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 90vh;
        overflow-y: auto;
        background: #1f1f2f;
        color: #f0f0f0;
        font-family: 'Segoe UI', sans-serif;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 0 12px rgba(0,0,0,0.6);
        z-index: 9999;
        font-size: 14px;
      }
      #voxiomStatsPanel input,
      #voxiomStatsPanel button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 6px;
        border: none;
        font-size: 14px;
      }
      #voxiomStatsPanel input {
        background: #2c2c3e;
        color: #fff;
      }
      #voxiomStatsPanel button {
        background: #4caf50;
        color: white;
        font-weight: bold;
        cursor: pointer;
      }
      #voxiomStatsPanel button:hover {
        background: #45a049;
      }
      #voxiomStatsOutput {
        white-space: pre-wrap;
        line-height: 1.5;
      }
      .section-title {
        margin-top: 10px;
        font-weight: bold;
        font-size: 15px;
        color: #9ce1ff;
      }
    </style>
    <div id="voxiomStatsPanel">
      <input type="text" id="playerNameInput" placeholder="Enter Voxiom player name..." />
      <button id="fetchStatsBtn">Fetch Full Stats</button>
      <div id="voxiomStatsOutput">...</div>
    </div>
  `;
  document.body.appendChild(panel);

  const fetchBtn = document.getElementById("fetchStatsBtn");
  const input = document.getElementById("playerNameInput");
  const output = document.getElementById("voxiomStatsOutput");

  fetchBtn.addEventListener("click", () => {
    const playerName = input.value.trim();
    if (!playerName) {
      output.textContent = "Please enter a player name.";
      return;
    }
    output.textContent = "Fetching data...";
    fetchAllStats(playerName);
  });

  function corsPost(url, body, callback) {
    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      data: JSON.stringify(body),
      onload: res => {
        try {
          callback(JSON.parse(res.responseText));
        } catch (err) {
          output.textContent = "Failed to parse response.";
          console.error(err);
        }
      },
      onerror: err => {
        output.textContent = "Error fetching data.";
        console.error(err);
      }
    });
  }

  function formatSecondsToDHMS(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  function fetchAllStats(playerName) {
    corsPost("https://voxiom.io/profile/player/" + encodeURIComponent(playerName), {}, pRes => {
      if (!pRes.success || !pRes.data) {
        output.textContent = "Player not found.";
        return;
      }
      const p = pRes.data;
      let result = `👤 ${p.nickname} (Level ${p.level})\nGems: ${p.gems} | Score: ${p.score} | XP: ${p.xp}\nCreated: ${new Date(p.creation_time).toLocaleDateString()}`;

      const creationDate = new Date(p.creation_time);
      const daysSinceCreation = Math.max(1, Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24)));

      if (p.clan) {
        result += `\n\n🏰 Clan: ${p.clan.name} [${p.clan.tag}]`;
      }

      function formatModeStats(mode, name) {
        if (!mode) return '';
        const kdr = mode.total_deaths ? (mode.total_kills / mode.total_deaths).toFixed(2) : (mode.total_kills > 0 ? "∞" : "0");
        const winRate = mode.total_games_played ? ((mode.total_games_won / mode.total_games_played) * 100).toFixed(1) + "%" : "N/A";
        const avgKills = (mode.total_kills / mode.total_games_played).toFixed(2);
        const avgKillsPerDay = (mode.total_kills / daysSinceCreation).toFixed(2);
        const survival = formatSecondsToDHMS(mode.total_survival_time);
        return `\n\n🔹 ${name} Stats:\nGames: ${mode.total_games_played}, Wins: ${mode.total_games_won}\nKills: ${mode.total_kills}, Deaths: ${mode.total_deaths}, KDR: ${kdr}\nWin Rate: ${winRate}\nAvg Kills/Game: ${avgKills}\nAvg Kills/Day: ${avgKillsPerDay}\nSurvival Time: ${survival}`;
      }

      result += formatModeStats(p.br, "Battle Royale");
      result += formatModeStats(p.ctg, "Capture The Gem");

      // Player Rating
      if (p.br) {
        const levelScore = Math.min(p.level / 100, 1);
        const kdrScore = p.br.total_deaths ? Math.min(p.br.total_kills / p.br.total_deaths, 3) / 3 : (p.br.total_kills > 0 ? 1 : 0);
        const winRateScore = p.br.total_games_played ? Math.min(p.br.total_games_won / p.br.total_games_played, 0.5) * 2 : 0;
        const scoreScore = Math.min(p.score / 500000, 1);
        const rating = ((levelScore * 3 + kdrScore * 3 + winRateScore * 2 + scoreScore * 2) / 10 * 10).toFixed(2);
        result += `

⭐ Player Rating: ${rating}/10`;
      result += `

📊 My Information on Market & Friends:`;
      }

      corsPost("https://voxiom.io/market/my_listed_items", { player_name: playerName }, listed => {
        const items = listed.data?.player_market_items || [];
        const totalRev = items.reduce((sum, item) => sum + item.price, 0);
        result += `\n\n📦 Listed Items: ${items.length}\nPotential Revenue: ${totalRev} gems`;

        corsPost("https://voxiom.io/market/player_market_history", { player_name: playerName }, history => {
          const hist = history.data?.market_history || [];
          const totalSell = hist.filter(e => e.seller_name === playerName).reduce((s, e) => s + e.price, 0);
          const totalBuy = hist.filter(e => e.buyer_name === playerName).reduce((s, e) => s + e.price, 0);

          const soldCounts = {};
          const boughtCounts = {};

          for (const entry of hist) {
            if (entry.seller_name === playerName)
              soldCounts[entry.item_type] = (soldCounts[entry.item_type] || 0) + 1;
            if (entry.buyer_name === playerName)
              boughtCounts[entry.item_type] = (boughtCounts[entry.item_type] || 0) + 1;
          }

          function topItem(counts) {
            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]}x)` : "N/A";
          }

          result += `\n\n💸 Market History:\nSold: ${totalSell} gems\nBought: ${totalBuy} gems\nTop Sold: ${topItem(soldCounts)}\nTop Bought: ${topItem(boughtCounts)}`;

          corsPost("https://voxiom.io/friend/list_friends", { player_name: playerName }, friends => {
            const list = friends.data?.friends || [];
            result += `\n\n👥 Friends (${list.length}):\n` + list.slice(0, 10).map(f => `- ${f.nickname} (Lvl ${f.level})`).join("\n");
            output.textContent = result;
          });
        });
      });
    });
  }
})();

