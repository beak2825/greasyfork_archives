// ==UserScript==
// @name         DartConnect Live Matches
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Vytvoří tabulku z matches_live
// @author       JV
// @license      MIT
// @match        https://tv.dartconnect.com/event/*/state/all?fetch_type=initial
// @grant        GM_xmlhttpRequest
// @connect      tv.dartconnect.com
// @downloadURL https://update.greasyfork.org/scripts/547255/DartConnect%20Live%20Matches.user.js
// @updateURL https://update.greasyfork.org/scripts/547255/DartConnect%20Live%20Matches.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // najdeme eventId v URL
  const match = window.location.href.match(/event\/([^/]+)/);
  const eventId = match ? match[1] : null;
  if (!eventId) {
    console.error("Nepodařilo se zjistit eventId z URL!");
    return;
  }

  const ENDPOINT = `https://tv.dartconnect.com/event/${eventId}/state/all?fetch_type=initial`;

  // jednoduché CSS
  const css = `
    .dc-wrap { font-family: system-ui, Arial, sans-serif; padding: 16px; }
    .dc-title { font-weight: 700; font-size: 18px; margin-bottom: 10px; }
    .dc-table { border-collapse: collapse; width: 100%; max-width: 980px; }
    .dc-table th, .dc-table td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
    .dc-table th { background: #f2f2f2; }
    .dc-note { color: #666; margin: 8px 0 16px; font-size: 12px; }
  `;

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function fmt(val) {
    if (val === null || val === undefined) return "";
    const num = Number(val);
    if (!Number.isNaN(num)) return num % 1 === 0 ? String(num) : num.toFixed(2);
    return String(val);
  }

  function renderTable(matches) {
    const wrap = document.createElement("div");
    wrap.className = "dc-wrap";

    const title = document.createElement("div");
    title.className = "dc-title";
    title.textContent = "DartConnect – Live matches";
    wrap.appendChild(title);

    const note = document.createElement("div");
    note.className = "dc-note";
    note.textContent =
      "Sloupce: HC (domácí), AC (hostující), hs (Home Score), as (Away Score), hx (home průměr), ax (away průměr).";
    wrap.appendChild(note);

    const table = document.createElement("table");
    table.className = "dc-table";

    const thead = document.createElement("thead");
    thead.innerHTML =
      "<tr><th>HC</th><th>AC</th><th>hs</th><th>as</th><th>hx</th><th>ax</th></tr>";
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    matches.forEach((m) => {
      const tr = document.createElement("tr");
      const cells = [m.hc, m.ac, m.hs, m.as, m.hx, m.ax];
      cells.forEach((v) => {
        const td = document.createElement("td");
        td.textContent = fmt(v);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    document.body.innerHTML = "";
    document.body.appendChild(wrap);
    wrap.appendChild(table);
  }

  function fetchAndRender() {
    GM_xmlhttpRequest({
      method: "GET",
      url: ENDPOINT,
      onload: function (res) {
        try {
          const json = JSON.parse(res.responseText);
          const matches = json?.states?.matches_live?.data || [];
          renderTable(matches);
        } catch (e) {
          console.error("Chyba při parsování JSON:", e);
          document.body.textContent =
            "Nepodařilo se načíst data (viz konzoli).";
        }
      },
      onerror: function (e) {
        console.error("Chyba požadavku:", e);
      },
    });
  }

  injectStyles();
  fetchAndRender();
})();