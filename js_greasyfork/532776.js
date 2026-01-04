// ==UserScript==
// @name         Torn Company Employee Scanner
// @namespace    companyscanner.zero.nao
// @version      1.8
// @description  Scan Torn companies
// @match        https://www.torn.com/donator.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532776/Torn%20Company%20Employee%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/532776/Torn%20Company%20Employee%20Scanner.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("Torn Scanner loaded");
  let statusDiv;

  // wait for body
  function init() {
    if (!document.body) return window.requestAnimationFrame(init);
    buildUI();
    loadSavedData();
  }
  init();

  function buildUI() {
    let stopRequested = false;

    function load(key, def) {
      let v = GM_getValue(key);
      return v !== undefined ? v : def;
    }
    function bindSave(el, key) {
      el.addEventListener("change", () => GM_setValue(key, el.value));
    }

    // --- UI SETUP ---
    const panel = document.createElement("div");
    panel.id = "tornScannerPanel";
    panel.innerHTML = `
      <h2>Torn Scanner</h2>
      <label>API Key:<br><input type="text" id="tsApiKey" placeholder="Torn API Key"></label>
      <label>Max calls per minute:<br><input type="number" id="tsMaxCalls" ></label>
      <label>Exclude Status (CSV):<br><input type="text" id="tsExcludeStatuses"></label>
      <label>Company Types (CSV):<br><input type="text" id="tsTypes"></label>
      <label>Last action greater than > <input type="number" id="tsThreshold" > days 
      <label>Last action less than > <input type="number" id="tsThresholdMax" > days</label> <br>
      <label>Account age between
        <input type="number" id="tsAccAgeMin" > and
        <input type="number" id="tsAccAgeMax" > days
      </label>
      <label>Days in co. between
        <input type="number" id="tsAgeMin" > and
        <input type="number" id="tsAgeMax" >
      </label>
      <label>Include Positions (CSV):<br><input type="text" id="tsPositions"></label>
      <label>Exclude Positions (CSV):<br><input type="text" id="tsExcludePositions"></label>
      <label>Include Status (CSV):<br><input type="text" id="tsStatuses"></label>
      <div class="button-row">
        <button id="tsStart">Start Scan</button>
        <button id="tsStop" disabled>Stop Scan</button>
      </div>
      <div id="tsProgressContainer"><div id="tsProgressBar"></div></div>
      <div id="tsStatus">Idle</div>
      <table id="tsResults">
        <thead><tr>
          <th>Name</th><th>Last Action</th>
          <th>Days in Co.</th><th>Position</th><th>Status</th>
        </tr></thead>
        <tbody></tbody>
      </table>
    `;
    document.body.appendChild(panel);

    // grab inputs
    const inApi = panel.querySelector("#tsApiKey");
    const inMaxCalls = panel.querySelector("#tsMaxCalls");
    const inTypes = panel.querySelector("#tsTypes");
    const inThr = panel.querySelector("#tsThreshold");
    const inThrMax = panel.querySelector("#tsThresholdMax");
    const inAgeMin = panel.querySelector("#tsAgeMin");
    const inAgeMax = panel.querySelector("#tsAgeMax");
    const inAccAgeMin = panel.querySelector("#tsAccAgeMin");
    const inAccAgeMax = panel.querySelector("#tsAccAgeMax");
    const inPos = panel.querySelector("#tsPositions");
    const inExPos = panel.querySelector("#tsExcludePositions");
    const inStat = panel.querySelector("#tsStatuses");
    const inExStat = panel.querySelector("#tsExcludeStatuses");

    // load saved values
    inApi.value = load("tsApiKey", "");
    inMaxCalls.value = load("tsMaxCalls", "60");
    inTypes.value = load("tsTypes", "16,28");
    inThr.value = load("tsThreshold", "3");
    inThrMax.value = load("tsThresholdMax", "7");
    inAgeMin.value = load("tsAgeMin", "0");
    inAccAgeMin.value = load("tsAccAgeMin", "");
    inAccAgeMax.value = load("tsAccAgeMax", "");
    inAgeMax.value = load("tsAgeMax", "10000");
    inPos.value = load("tsPositions", "");
    inExPos.value = load("tsExcludePositions", "");
    inStat.value = load("tsStatuses", "");
    inExStat.value = load("tsExcludeStatuses", "");

    // bind save on change
    [
      inApi,
      inMaxCalls,
      inTypes,
      inThr,
      inThrMax,
      inAgeMin,
      inAgeMax,
      inAccAgeMin,
      inAccAgeMax,
      inPos,
      inExPos,
      inStat,
      inExStat,
    ].forEach((el) => bindSave(el, el.id));

    // --- DARK THEME CSS ---
    GM_addStyle(`
      #tornScannerPanel {
        position: fixed; top: 5%; right: 10px;
        background: #1e1e1e !important;
        color: #ddd !important;
        border: 1px solid #444 !important;
        padding: 12px; width: 340px; font-family: sans-serif; 
        z-index: 9999; font-size: 13px; line-height: 1.4;
      }
      #tornScannerPanel h2 {
        margin: 0 0 8px; font-size: 16px; text-align: center;
      }
      #tornScannerPanel label {
        display: block; margin-bottom: 6px;
      }
      #tornScannerPanel input {
        width: 100%; box-sizing: border-box;
        background: #2a2a2a !important;
        color: #eee !important;
        border: 1px solid #555 !important;
        padding: 4px; margin-top: 2px;
      }
      #tornScannerPanel input::placeholder { color: #777 !important; }
      .button-row { text-align: center; margin: 8px 0; }
      #tornScannerPanel button {
        background: #333 !important;
        color: #eee !important;
        border: 1px solid #555 !important;
        padding: 6px 12px; margin: 0 4px; cursor: pointer;
      }
      #tornScannerPanel button:disabled {
        background: #222 !important; opacity: 0.6 !important;
        cursor: not-allowed !important;
      }
      #tsProgressContainer {
        width: 100%; background: #2a2a2a !important;
        border: 1px solid #555 !important; height: 10px;
        margin: 8px 0;
      }
      #tsProgressBar {
        width: 0; height: 100%; background: #4caf50 !important;
        transition: width 0.2s;
      }
      #tsStatus {
        text-align: center; margin-bottom: 8px;
        font-style: italic; color: #bbb !important;
      }
      #tsResults {
        width: 100%; border-collapse: collapse;
        font-size: 12px; max-height: 200px;
        overflow-y: auto; display: block;
        background: #1e1e1e !important;
        color: #fff !important;
        border: 1px solid #444 !important;
      }
      #tsResults th, #tsResults td {
        color: #ddd !important;
        border: 1px solid #555 !important;
        padding: 4px; text-align: left;
      }
      #tsResults thead {
        background: #2a2a2a !important;
        position: sticky; top: 0;
      }
      #tsResults tbody tr:nth-child(odd) {
        background: #242424 !important;
      }
      #tsResults tbody tr:nth-child(even) {
        background: #1f1f1f !important;
      }
      #tornScannerPanel::-webkit-scrollbar,
      #tsResults::-webkit-scrollbar { width: 8px !important; }
      #tornScannerPanel::-webkit-scrollbar-thumb,
      #tsResults::-webkit-scrollbar-thumb {
        background: #555 !important; border-radius: 4px !important;
      }
      #tornScannerPanel::-webkit-scrollbar-track,
      #tsResults::-webkit-scrollbar-track {
        background: #222 !important;
      }
      scrollbar-color: #555 #222 !important;
      td { color: #ddd !important; }

    #tornScannerPanel input[type="number"] {
      width: 70px!important;
    }
    `);

    // --- Helper: promisified GM_xmlhttpRequest ---

    // --- Main Handlers ---
    const startBtn = document.getElementById("tsStart");
    const stopBtn = document.getElementById("tsStop");
    statusDiv = document.getElementById("tsStatus");

    startBtn.addEventListener("click", async () => {
      const apiKey = inApi.value.trim();
      const types = inTypes.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const threshold = parseInt(inThr.value, 10);
      const thresholdMax = parseInt(inThrMax.value, 10);
      const ageMin = parseInt(inAgeMin.value, 10);
      const ageMax = parseInt(inAgeMax.value, 10);
      const accAgeMin = parseInt(inAccAgeMin.value) || 0;
      const accAgeMax = parseInt(inAccAgeMax.value) || 10000;
      const positions = inPos.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const exPositions = inExPos.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const statuses = inStat.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      const exStatuses = inExStat.value
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (!apiKey || types.length === 0) {
        alert("API key and at least one company type ID required.");
        return;
      }

      stopRequested = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusDiv.textContent = "Counting companies…";
      updateProgress(0);
      document.querySelector("#tsResults tbody").innerHTML = "";

      let totalCompanies = 0,
        processed = 0;
      try {
        // count total
        for (let t of types) {
          if (stopRequested) break;
          const list = await gmFetch(
            `https://api.torn.com/company/${t}?selections=companies&key=${apiKey}`,
          );
          totalCompanies += Object.keys(list.company || {}).length;
        }
        if (totalCompanies === 0) throw new Error("No companies found.");

        // scan
        for (let t of types) {
          if (stopRequested) break;
          const list = await gmFetch(
            `https://api.torn.com/company/${t}?selections=companies&key=${apiKey}`,
          );
          for (let compId of Object.keys(list.company || {})) {
            if (stopRequested) break;
            statusDiv.textContent = `Scanning ${compId} (${processed + 1}/${totalCompanies})`;
            await scanCompany(compId, {
              apiKey,
              threshold,
              thresholdMax,
              ageMin,
              ageMax,
              positions,
              exPositions,
              statuses,
              exStatuses,
              accAgeMin,
              accAgeMax,
            });
            processed++;
            updateProgress(processed / totalCompanies);

            const delay =
              inMaxCalls && inMaxCalls > 0 ? 60000 / inMaxCalls : 1000;
            await new Promise((r) => setTimeout(r, delay)); // throttle
          }
        }
        statusDiv.textContent = stopRequested
          ? "Scan stopped."
          : "Scan complete.";
      } catch (err) {
        console.error(err);
        statusDiv.textContent = "Error: " + err.message;
      } finally {
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    });

    stopBtn.addEventListener("click", () => {
      stopRequested = true;
      statusDiv.textContent = "Stopping…";
    });

    // --- Scan One Company ---
    async function scanCompany(companyId, opts) {
      const url = `https://api.torn.com/company/${companyId}?selections=&key=${opts.apiKey}`;
      let data;
      try {
        data = await gmFetch(url);
      } catch {
        return;
      }
      const co = data.company;
      if (!co || !co.employees) return;

      const tbody = document.querySelector("#tsResults tbody");
      for (let empId of Object.keys(co.employees)) {
        if (stopRequested) break;
        const emp = co.employees[empId];
        let days = emp.last_action.relative.includes("day")
          ? parseInt(emp.last_action.relative.split(" ")[0], 10)
          : 0;
        if (days <= opts.threshold) continue;
        if (days > opts.thresholdMax) continue;
        if (
          emp.days_in_company - opts.ageMin < 0 ||
          emp.days_in_company - opts.ageMax > 0
        )
          continue;

        const employee_age = await getEmployeeAge(empId, opts);
        if (
          employee_age - opts.accAgeMin < 0 ||
          employee_age - opts.accAgeMax > 0
        )
          continue;

        const pos = emp.position.toLowerCase();
        if (opts.positions.length && !opts.positions.includes(pos)) continue;
        if (opts.exPositions.length && opts.exPositions.includes(pos)) continue;

        const st = emp.status.state.toLowerCase();
        if (opts.statuses.length && !opts.statuses.includes(st)) continue;
        if (opts.exStatuses.length && opts.exStatuses.includes(st)) continue;

        const row = document.createElement("tr");
        row.innerHTML = `
          <!--<td>${empId}</td>-->
          <td><a href="https://www.torn.com/profiles.php?XID=${empId}" target="_blank">${emp.name}</a></td>
          <td>${emp.last_action.relative}</td>
          <td>${emp.days_in_company}</td>
          <td>${emp.position}</td>
          <td>${emp.status.state}</td>
        `;
        tbody.appendChild(row);
        saveData();
      }
    }

    function updateProgress(fraction) {
      document.getElementById("tsProgressBar").style.width =
        `${Math.round(fraction * 100)}%`;
    }
  }

  function gmFetch(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(JSON.parse(res.responseText));
          } else reject(new Error(`HTTP ${res.status}`));
        },
        onerror: (err) => reject(err),
      });
    });
  }

  async function getEmployeeAge(empId, opts) {
    await new Promise((r) => setTimeout(r, 1000)); // throttle
    const url = `https://api.torn.com/user/${empId}?selections=&key=${opts.apiKey}`;
    let data;
    try {
      statusDiv.textContent = `Fetching ${empId} age…`;
      data = await gmFetch(url);
    } catch (err) {
      console.error(err);
      return 0;
    }
    statusDiv.textContent = `Fetched ${empId} age: ${data.age}`;
    return data.age - 0;
  }

  function saveData() {
    const tableBody = document.querySelector("#tsResults tbody");
    const data = Array.from(tableBody.querySelectorAll("tr")).map((row) => {
      const tds = Array.from(row.querySelectorAll("td"));
      return {
        name: tds[0].innerHTML,
        lastAction: tds[1].textContent,
        daysInCo: tds[2].textContent,
        position: tds[3].textContent,
        status: tds[4].textContent,
      };
    });
    GM_setValue("tsData", JSON.stringify(data));
  }

  function loadSavedData() {
    const tableBody = document.querySelector("#tsResults tbody");
    const data = JSON.parse(GM_getValue("tsData", "[]"));
    for (let row of data) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.lastAction}</td>
        <td>${row.daysInCo}</td>
        <td>${row.position}</td>
        <td>${row.status}</td>
      `;
      tableBody.appendChild(tr);
    }
  }
})();
