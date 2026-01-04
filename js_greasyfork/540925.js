// ==UserScript==
// @name         WTT Fixtures
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Zobrazí zápasy z daného dne v tabulce.
// @author       MK
// @match        https://www.worldtabletennis.com/matches?selectedTab=SCHEDULED
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/540925/WTT%20Fixtures.user.js
// @updateURL https://update.greasyfork.org/scripts/540925/WTT%20Fixtures.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_PREFIX = "https://liveeventsapi.worldtabletennis.com/api/cms/GetEventSchedule/";
  let cachedData = null;
  let currentId = null;
  let currentDate = new Date().toISOString().slice(0, 10);
  let isLoading = false;

  console.log("[WTT DEBUG] Skript inicializován");

  const pad = n => String(n).padStart(2, "0");

  const formatDate = dateStr => {
    const d = new Date(dateStr);
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const clearTable = () => {
    const old = document.getElementById("wtt-table-wrapper");
    if (old) old.remove();
  };

  const renderTable = (competitionId, dateStr) => {
    clearTable();
    if (!cachedData) {
      console.warn("[WTT WARN] Nejsou k dispozici žádná data.");
      return;
    }

    const units = [];
    cachedData.forEach(entry => {
      const unitList = entry?.Competition?.Unit;
      if (Array.isArray(unitList)) units.push(...unitList);
    });

    console.log(`[WTT DEBUG] Načteno jednotek: ${units.length}`);

    const filtered = units
      .filter(i => {
        const localDate = new Date(i.StartDate);
        const trueLocalDate = new Date(localDate.getTime() + (new Date().getTimezoneOffset() * -60000));
        const trueLocalDateStr = trueLocalDate.toISOString().slice(0, 10);
        return trueLocalDateStr === dateStr;
      })
      .filter(i => (i?.StartList?.Start || []).every(s => s?.Competitor?.Description?.TeamName));

    console.log(`[WTT DEBUG] Zápasů v daný den: ${filtered.length}`);

    const seen = new Set();
    const rows = filtered.map(i => {
      const players = i.StartList.Start.map(s => s.Competitor.Description.TeamName).join(" vs ");
      const time = formatDate(i.StartDate);
      return {
        čas: time,
        odkaz: `https://www.worldtabletennis.com/MatchCenter?eventId=${competitionId}&docCode=${i.Code}--------&type=live`,
        popis: i?.ItemDescription?.[0]?.Value || '',
        kategorie: i.SubEvent,
        hřiště: i?.VenueDescription?.LocationName || '',
        hráči: players,
        _id: `${i.Code}|${i.StartDate}|${players}`
      };
    }).filter(i => {
      if (seen.has(i._id)) return false;
      seen.add(i._id);
      return true;
    });

    const wrapper = document.createElement("div");
    wrapper.id = "wtt-table-wrapper";
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "99999",
      background: "white",
      border: "2px solid black",
      fontSize: "12px",
      padding: "10px",
      maxHeight: "90vh",
      overflow: "auto"
    });

    const controls = document.createElement("div");
    controls.style.marginBottom = "10px";

    const dates = [-1, 0, 1].map(offset => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const iso = d.toISOString().slice(0, 10);
      return {
        label: offset === 0 ? "Dnes" : (offset === -1 ? "Včera" : "Zítra"),
        value: iso
      };
    });

    dates.forEach(({ label, value }) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.style.marginRight = "5px";
      btn.onclick = () => {
        currentDate = value;
        renderTable(currentId, currentDate);
      };
      controls.appendChild(btn);
    });

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.innerHTML = `
      <thead>
        <tr>
          <th style="border:1px solid black; padding:4px;">Čas</th>
          <th style="border:1px solid black; padding:4px;">Zápas</th>
          <th style="border:1px solid black; padding:4px;">Popis</th>
          <th style="border:1px solid black; padding:4px;">Kategorie</th>
          <th style="border:1px solid black; padding:4px;">Hřiště</th>
          <th style="border:1px solid black; padding:4px;">Hráči</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            <td style="border:1px solid black; padding:4px;">${row.čas}</td>
            <td style="border:1px solid black; padding:4px;"><a href="${row.odkaz}" target="_blank">Odkaz</a></td>
            <td style="border:1px solid black; padding:4px;">${row.popis}</td>
            <td style="border:1px solid black; padding:4px;">${row.kategorie}</td>
            <td style="border:1px solid black; padding:4px;">${row.hřiště}</td>
            <td style="border:1px solid black; padding:4px;">${row.hráči}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    wrapper.appendChild(controls);
    wrapper.appendChild(table);
    document.body.appendChild(wrapper);
  };

  const runScript = (competitionId) => {
    if (isLoading || (currentId === competitionId && cachedData)) {
      console.log("[WTT DEBUG] Ignoruji opakovaný fetch.");
      renderTable(competitionId, currentDate);
      return;
    }

    isLoading = true;
    currentId = competitionId;
    const fullUrl = `${API_PREFIX}${competitionId}`;
    console.log("[WTT DEBUG] Spouštím fetch pro očekávanou API:", fullUrl);

    fetch(fullUrl)
      .then(res => res.json())
      .then(json => {
        cachedData = json;
        renderTable(competitionId, currentDate);
      })
      .catch(err => console.error("[WTT ERROR] Chyba při fetchi:", err))
      .finally(() => isLoading = false);
  };

  // XHR interceptor
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {
    const url = args[1];
    console.log("[WTT DEBUG] XHR otevřen:", url);
    if (url && url.startsWith(API_PREFIX)) {
      const match = url.match(/GetEventSchedule\/(\d+)/);
      if (match) {
        console.log("[WTT DEBUG] XHR zachytil očekávanou API:", url);
        runScript(match[1]);
      }
    }
    return origOpen.apply(this, args);
  };

  // Fetch interceptor
  const origFetch = window.fetch;
  window.fetch = new Proxy(origFetch, {
    apply(target, thisArg, args) {
      const url = args[0];
      console.log("[WTT DEBUG] Fetch volán:", url);
      if (typeof url === "string" && url.startsWith(API_PREFIX)) {
        const match = url.match(/GetEventSchedule\/(\d+)/);
        if (match) {
          console.log("[WTT DEBUG] Fetch zachytil očekávanou API:", url);
          runScript(match[1]);
        }
      }
      return Reflect.apply(target, thisArg, args);
    }
  });

  console.log("[WTT DEBUG] Interceptory fetch a XHR nastaveny.");
})();
