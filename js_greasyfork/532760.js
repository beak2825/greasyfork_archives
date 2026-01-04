// ==UserScript==
// @name         Klavia Points Tracker Lib
// @version      2024-04-13.l1
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @description  Tracks Nitro Type race points with performance stats UI Lib
// @author       TensorFlow - Dvorak
// @match        *://*.ntcomps.com/*
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function injectRaceLogger() {
  const loggerCode = `
    (function () {
      const STORAGE_KEY = "klaviaRaceHistory";
      const seenRaceIDs = new Set();
      const estimatePoints = (wpm, accuracy) => Math.round(Math.pow(wpm, 1) * Math.pow(accuracy, 2.5) * 0.000027);

      function loadRaceHistory() {
        try {
          return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
          return [];
        }
      }

      function saveRaceHistory(history) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }

      function attachRaceLogger(ws) {
        ws.addEventListener("message", (event) => {
          let parsed;
          try {
            parsed = JSON.parse(event.data);
          } catch {
            return;
          }

          const identifier = parsed.identifier ? JSON.parse(parsed.identifier) : {};
          const msg = parsed.message;

          if (
            identifier.channel === "RaceChannel" &&
            msg?.message === "update_race_results" &&
            msg?.textCompleted === true &&
            msg?.raceId &&
            !seenRaceIDs.has(msg.raceId)
          ) {
            seenRaceIDs.add(msg.raceId);

            const raceData = {
              raceId: msg.raceId,
              points: estimatePoints(msg.wpm, parseFloat(msg.accuracy)),
              wpm: msg.wpm,
              accuracy: parseFloat(msg.accuracy),
              raceSeconds: msg.raceSeconds,
              textSeconds: msg.textSeconds,
              boostBonus: msg.boostBonus,
              timestamp: new Date().toISOString(),
            };

            const history = loadRaceHistory();
            history.unshift(raceData);
            saveRaceHistory(history);
            window.dispatchEvent(new CustomEvent("klavia:race-logged", { detail: raceData }));
          }
        });
      }

      const originalWS = window.WebSocket;
      window.WebSocket = new Proxy(originalWS, {
        construct(target, args) {
          const ws = new target(...args);
          attachRaceLogger(ws);
          return ws;
        }
      });
    })();
  `;
  const script = document.createElement("script");
  script.textContent = loggerCode;
  document.documentElement.appendChild(script);
})();

window.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "klaviaRaceHistory";
  let raceHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  let activeTab = "stats";
  let isUIVisible = false;
  let lastHistoryJSON = JSON.stringify(raceHistory);

  const createElement = (tag, attrs = {}, styles = {}, html = "") => {
    const el = document.createElement(tag);
    Object.assign(el, attrs);
    Object.assign(el.style, styles);
    el.innerHTML = html;
    return el;
  };

  function getColor(value, values) {
    const sorted = [...values].sort((a, b) => a - b);
    const low = sorted[Math.floor(sorted.length * 0.33)];
    const high = sorted[Math.floor(sorted.length * 0.66)];
    if (value >= high) return "#4CAF50";
    if (value >= low) return "#FFC107";
    return "#F44336";
  }

  function createStatsUI() {
    const oldUI = document.getElementById("klavia-stats");
    if (oldUI) oldUI.remove();

    const container = createElement(
      "div",
      { id: "klavia-stats" },
      {
        position: "fixed",
        top: "10px",
        right: "10px",
        background: isUIVisible ? "#121212" : "none",
        color: "#e0e0e0",
        padding: isUIVisible ? "20px" : "0",
        borderRadius: "12px",
        zIndex: 9999,
        maxWidth: "600px",
        maxHeight: "80vh",
        overflowY: isUIVisible ? "auto" : "visible",
        boxShadow: isUIVisible ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        fontFamily: "Segoe UI, sans-serif",
      }
    );

    const infoBtn = createElement(
      "button",
      {
        onclick: () => {
          isUIVisible = !isUIVisible;
          renderStatsUI();
        },
      },
      {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#ff4500",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        fontFamily: "Segoe UI, sans-serif",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      },
      "DTR"
    );

    const tabs = createElement(
      "div",
      {},
      {
        display: isUIVisible ? "flex" : "none",
        gap: "10px",
        paddingRight: '2rem',
        marginBottom: "16px",
      }
    );

    const createTabBtn = (name, label) =>
      createElement(
        "button",
        {
          onclick: () => {
            activeTab = name;
            renderStatsUI();
          },
        },
        {
          padding: "6px 12px",
          background: activeTab === name ? "#1976d2" : "#333",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        },
        label
      );

    tabs.append(
      createTabBtn("stats", "Stats"),
      createTabBtn("table", "Race Table"),
      createTabBtn("analysis", "Analysis"),
      createTabBtn("teamChat", "Team Chat")
    );

    const content = createElement(
      "div",
      { id: "klavia-stats-content" },
      {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#ccc",
        display: isUIVisible ? "block" : "none",
      }
    );

    const clearBtn = createElement(
      "button",
      {
        onclick: () => {
          raceHistory = [];
          localStorage.removeItem(STORAGE_KEY);
          lastHistoryJSON = "[]";
          renderStatsUI();
        },
      },
      {
        display: isUIVisible ? "block" : "none",
        marginTop: "16px",
        padding: "8px 16px",
        background: "#c62828",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
      "Clear History"
    );

    container.append(infoBtn);
    if (isUIVisible) container.append(tabs, content, clearBtn);
    document.body.appendChild(container);
    updateContent();
  }

  function updateContent() {
    const content = document.getElementById("klavia-stats-content");
    if (!content) return;

    raceHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const r = raceHistory;
    const last = r.at(-1);
    const avg = (key) => r.reduce((s, e) => s + e[key], 0) / r.length;
    const values = (key) => r.map((e) => e[key]);

    if (activeTab === "teamChat") {
      content.innerHTML = `<div style="padding: 16px;">Team Chat for DTR coming soon...</div>`;
      return;
    }

    if (activeTab === "analysis") {
      content.innerHTML = `<div style="padding: 16px;">Analysis page coming soon...</div>`;
      return;
    }

    if (activeTab === "table") {
      if (r.length === 0) {
        content.innerHTML = `<div style="padding:16px; text-align:center; color:#aaa;">No race data available yet</div>`;
        return;
      }

      const rows = [...r]
        .reverse()
        .map(
          (row, i) => `
      <tr data-timestamp="${new Date(
        row.timestamp
      ).toISOString()}" style="background:${i % 2 ? "#2c2c2c" : "#1f1f1f"};">
        <td style="padding: 8px; color:#aaa;">${r.length - i}</td>
        <td style="padding: 8px; color:${getColor(
          row.points,
          values("points")
        )};">${row.points}</td>
        <td style="padding: 8px; color:${getColor(
          row.wpm,
          values("wpm")
        )};">${row.wpm.toFixed(1)}</td>
        <td style="padding: 8px; color:${getColor(
          row.accuracy,
          values("accuracy")
        )};">${row.accuracy.toFixed(2)}%</td>
      </tr>
    `
        )
        .join("");

      content.innerHTML = `
  <table style="width:100%; border-collapse:collapse;">
    <thead style="background:#333;"><tr>
      <th style="padding:8px;">#</th>
      <th style="padding:8px;">Points</th>
      <th style="padding:8px;">WPM</th>
      <th style="padding:8px;">Accuracy</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <style>
    #klavia-stats-content tr:hover td {
      background-color: #444 !important;
      transition: background 0.2s ease;
    }
  </style>
`;
      return;
    }

    if (r.length === 0) {
      content.innerHTML = `<div style="padding:16px; text-align:center; color:#aaa;">No race data available yet</div>`;
      return;
    }

    let estimate = "";
    if (r.length > 1) {
      const intervals = [];
      for (let i = 1; i < r.length; i++) {
        const diff =
          (new Date(r[i].timestamp) - new Date(r[i - 1].timestamp)) / 1000;
        if (diff > 0) intervals.push(diff);
      }

      if (intervals.length > 0) {
        const avgSecs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const racesPerHr = 3600 / avgSecs;
        const ptsPerHr = racesPerHr * avg("points");
        estimate = `
        <div><strong style="color:#90caf9;">Estimates:</strong><br>
          Races/hr: ${racesPerHr.toFixed(1)}<br>
          Points/hr: ${ptsPerHr.toFixed(0)}<br>
          <span style="font-size:0.9em;">(Avg interval: ${avgSecs.toFixed(
            1
          )}s)</span>
        </div>`;
      }
    }

    content.innerHTML = `
    <div><strong style="color:#90caf9;">Last Race:</strong><br>
      <span style="color:${getColor(last.points, values("points"))};">Points: ${
      last.points
    }</span> |
      <span style="color:${getColor(
        last.wpm,
        values("wpm")
      )};">WPM: ${last.wpm.toFixed(1)}</span> |
      <span style="color:${getColor(
        last.accuracy,
        values("accuracy")
      )};">Accuracy: ${last.accuracy.toFixed(2)}%</span>
    </div><br>
    <div><strong style="color:#90caf9;">Averages (${
      r.length
    } races):</strong><br>
      <span style="color:${getColor(
        avg("points"),
        values("points")
      )};">Points: ${avg("points").toFixed(2)}</span> |
      <span style="color:${getColor(avg("wpm"), values("wpm"))};">WPM: ${avg(
      "wpm"
    ).toFixed(1)}</span> |
      <span style="color:${getColor(
        avg("accuracy"),
        values("accuracy")
      )};">Accuracy: ${avg("accuracy").toFixed(2)}%</span>
    </div><br>
    ${estimate}`;
  }

  function renderStatsUI() {
    raceHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    lastHistoryJSON = JSON.stringify(raceHistory);
    createStatsUI();
  }

window.addEventListener("klavia:race-logged", (e) => {
  renderStatsUI();
});

  setInterval(() => {
    if (!document.getElementById("klavia-stats")) renderStatsUI();
  }, 1000);

})();