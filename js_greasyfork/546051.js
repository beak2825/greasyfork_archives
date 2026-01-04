// ==UserScript==
// @name         VacationsToGo Better Table
// @namespace    https://hollen9.com
// @version      1.0.0
// @description  Enhance the search results table on vacationstogo.com
// @author       you
// @match        https://www.vacationstogo.com/ticker.cfm*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.1/js/tabulator.min.js
// @resource     TABULATOR_CSS https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.1/css/tabulator.min.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546051/VacationsToGo%20Better%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/546051/VacationsToGo%20Better%20Table.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- 注入 Tabulator CSS ---
  try {
    const css = GM_getResourceText("TABULATOR_CSS");
    if (css) GM_addStyle(css);
    GM_addStyle(`
  /* 讓整頁接管橫向捲動 */
  .tabulator,
  .tabulator .tabulator-table {
    width: max-content !important;
  }
  .tabulator .tabulator-tableholder {
    overflow-x: visible !important; /* 不要攔橫向捲動 */
  }
  /* 外容器別裁切 */
  #tabulator-deals-container { overflow: visible !important; }
  `);

  } catch (e) {
    console.warn("[Userscript] 無法載入 Tabulator CSS：", e);
  }

  const SELECTOR_TABLE = "table.ticker.deals";
  const TABLE_HEIGHT = "70vh";
  const BUILD_CHUNK = 500;

  let isBuilding = false;
  let isReady = false;
  let table = null; // Tabulator instance

  // --- utils ---
  const text = (el) => (el ? el.textContent.trim() : "");
  const htmlToText = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
  const moneyToNumber = (s) => {
    if (!s || s.trim() === "-") return null;
    const n = Number(s.replace(/\$/g, "").replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : null;
  };
  const pctToNumber = (s) => {
    if (!s) return null;
    const m = s.trim().match(/^(-?\d+(?:\.\d+)?)%$/);
    return m ? Number(m[1]) : null;
  };
  const firstLink = (cell) => {
    const a = cell?.querySelector?.("a");
    return a ? { href: a.href, text: a.textContent.trim() } : { href: "", text: text(cell) };
  };
  const linksIn = (cell) =>
    Array.from(cell?.querySelectorAll?.("a") || []).map((a) => ({ href: a.href, text: a.textContent.trim() }));

  async function parseDealsTable(tableEl) {
    const rows = [];
    const trs = tableEl.querySelectorAll("tbody > tr");

    for (let i = 0; i < trs.length; i++) {
      const tds = trs[i].querySelectorAll("td");
      if (tds.length < 11) continue;

      const [dealCell, nightsCell, dateCell, fromCell, toCell, lineShipCell, ratingCell, brochureCell, ourCell, pctCell, badgeCell] = tds;

      const dealLink = firstLink(dealCell);
      const fromLink = firstLink(fromCell);
      const toLink = firstLink(toCell);
      const ls = linksIn(lineShipCell);
      const lineInfo = ls[0] || { href: "", text: "" };
      const shipInfo = ls[1] || { href: "", text: "" };

      rows.push({
        dealId: dealLink.text.replace(/^#/, ""),
        dealHref: dealLink.href,
        nights: Number(text(nightsCell)) || null,
        sailDate: htmlToText(dateCell).replace(/\s*,\s*/g, ", "),
        from: fromLink.text, fromHref: fromLink.href,
        to: toLink.text, toHref: toLink.href,
        line: lineInfo.text, lineHref: lineInfo.href,
        ship: shipInfo.text, shipHref: shipInfo.href,
        rating: Number(text(ratingCell)) || null,
        brochureRaw: text(brochureCell), brochure: moneyToNumber(text(brochureCell)),
        ourRaw: text(ourCell), our: moneyToNumber(text(ourCell)),
        savingsRaw: text(pctCell), savings: pctToNumber(text(pctCell)),
        badge: htmlToText(badgeCell),
      });

      if (i % BUILD_CHUNK === 0) await new Promise((r) => setTimeout(r, 0));
    }
    return rows;
  }

  function buildToolbar(host, table) {
    const bar = document.createElement("div");
    bar.style.cssText = "margin:10px 0; display:flex; gap:8px; align-items:center; flex-wrap:wrap;";

    // 下載按鈕
    const mkBtn = (label, key) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.style.cssText = "padding:6px 10px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;";
      b.addEventListener("click", () => {
        if (key === "csv") table.download("csv", "deals.csv");
        if (key === "json") table.download("json", "deals.json");
        if (key === "html") table.download("html", "deals.html", { style: true });
      });
      return b;
    };

    // 下拉：全部/同點/異點
    const label = document.createElement("label");
    label.textContent = "Depart/Dest Filter: ";
    const sel = document.createElement("select");
    sel.innerHTML = `
      <option value="all">All</option>
      <option value="same">From=To</option>
      <option value="diff">From≠To</option>
    `;
    sel.style.cssText = "padding:6px 8px;border:1px solid #ccc;border-radius:6px;background:#fff;";

    sel.addEventListener("change", () => {
      const v = sel.value;
      if (v === "all") {
        table.clearFilter(true);
      } else if (v === "same") {
        table.setFilter((row) => (row.from || "").trim() === (row.to || "").trim());
      } else if (v === "diff") {
        table.setFilter((row) => (row.from || "").trim() !== (row.to || "").trim());
      }
    });

    bar.appendChild(label);
    bar.appendChild(sel);
    bar.appendChild(mkBtn("Save as CSV", "csv"));
    bar.appendChild(mkBtn("Save as JSON", "json"));
    bar.appendChild(mkBtn("Save as HTML", "html"));

    host.parentNode.insertBefore(bar, host);
  }

  function buildTabulator(host, data) {
    const columns = [
      { title: "Deal", field: "dealId", width: 90, headerFilter: "input",
        formatter: (cell) => `<a href="${cell.getRow().getData().dealHref}" target="_blank">#${cell.getValue()}</a>` },
      { title: "Nights", field: "nights", sorter: "number", hozAlign: "right", width: 80 },
      { title: "Sail Date", field: "sailDate", headerFilter: "input", width: 140 },
      { title: "From", field: "from", headerFilter: "input", widthGrow: 1,
        formatter: (c)=>{const r=c.getRow().getData(); return r.fromHref?`<a href="${r.fromHref}" target="_blank">${c.getValue()}</a>`:c.getValue();} },
      { title: "To", field: "to", headerFilter: "input", widthGrow: 1,
        formatter: (c)=>{const r=c.getRow().getData(); return r.toHref?`<a href="${r.toHref}" target="_blank">${c.getValue()}</a>`:c.getValue();} },
      { title: "Line", field: "line", headerFilter: "input", width: 140,
        formatter: (c)=>{const r=c.getRow().getData(); return r.lineHref?`<a href="${r.lineHref}" target="_blank">${c.getValue()}</a>`:c.getValue();} },
      { title: "Ship", field: "ship", headerFilter: "input", width: 160,
        formatter: (c)=>{const r=c.getRow().getData(); return r.shipHref?`<a href="${r.shipHref}" target="_blank">${c.getValue()}</a>`:c.getValue();} },
      { title: "Rating", field: "rating", sorter: "number", hozAlign: "right", width: 90 },
      { title: "Brochure", field: "brochure", sorter: "number", hozAlign: "right", width: 110,
        formatter:(c)=> c.getValue()==null? "-" : `$${c.getValue().toLocaleString()}`, tooltip:(c)=>c.getRow().getData().brochureRaw||"" },
      { title: "Our Price", field: "our", sorter: "number", hozAlign: "right", width: 120,
        formatter:(c)=> c.getValue()==null? "-" : `<b>$${c.getValue().toLocaleString()}</b>`, tooltip:(c)=>c.getRow().getData().ourRaw||"" },
      { title: "Savings %", field: "savings", sorter: "number", hozAlign: "right", width: 110,
        formatter:(c)=> c.getValue()==null? "-" : `${c.getValue()}%`, tooltip:(c)=>c.getRow().getData().savingsRaw||"" },
      { title: "Badge", field: "badge", headerFilter: "input", width: 160 },
    ];

    table = new Tabulator(host, {
      data, columns,
      height: TABLE_HEIGHT,
      layout: "fitDataStretch",
      virtualDom: true,
      progressiveRender: "scroll",
      progressiveRenderSize: 100,
      progressiveRenderMargin: 200,
      movableColumns: true,
      columnDefaults: { headerSort: true },
      persistence: false,
      placeholder: "No Data",
      initialSort: [{ column: "our", dir: "asc" }],
    });

    buildToolbar(host, table);
    return table;
  }

  async function upgrade() {
    if (isBuilding || isReady) return;
    const tableEl = document.querySelector(SELECTOR_TABLE);
    if (!tableEl) return;

    isBuilding = true;
    try {
      if (typeof Tabulator === "undefined") throw new Error("Tabulator 未就緒（@require 未載入？）");

      const data = await parseDealsTable(tableEl);
      if (!data.length) { isBuilding = false; return; }

      const container = document.createElement("div");
      container.id = "tabulator-deals-container";
      container.style.cssText = "margin: 16px 0;";
      const host = document.createElement("div");
      container.appendChild(host);
      tableEl.parentNode.insertBefore(container, tableEl);

      buildTabulator(host, data);
      // 成功後再隱藏原表，避免 reflow 風暴
      tableEl.style.display = "none";

      isReady = true;
    } catch (e) {
      console.error("[Userscript] 建立 Tabulator 失敗：", e);
    } finally {
      isBuilding = false;
    }
  }

  // 只要成功一次就斷開觀察器
  const mo = new MutationObserver(() => {
    if (!isReady) upgrade(); else mo.disconnect();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 頁面就緒也試一次
  upgrade();
})();
