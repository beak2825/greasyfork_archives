// ==UserScript==
// @name         Torn War Payout Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  RW Payouts
// @author       HuzGPT
// @match        https://www.torn.com/war.php?step=rankreport*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      api.torn.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/528083/Torn%20War%20Payout%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/528083/Torn%20War%20Payout%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // CONFIGURATION & API SETUP
    // ---------------------------
    // Set your API key here.
    const API_KEY = "API_KEY";
    // myFactionID will be retrieved automatically.
    localStorage.removeItem("torn_faction_id");
    let myFactionID = null;
    const globalHeaders = {
        "accept": "application/json",
        "Authorization": `ApiKey ${API_KEY}`
    };

    // Promisified GM_xmlhttpRequest
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url: url,
                headers: options.headers || {},
                data: options.body,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ---------------------------
    // HELPER FUNCTIONS
    // ---------------------------
    // Convert shorthand notation (e.g. "1B") into a number.
    function parseShortNotation(value) {
        if (typeof value !== 'string') value = value.toString();
        let multiplier = 1;
        value = value.trim().toUpperCase();
        if (value.endsWith('K')) {
            multiplier = 1000;
            value = value.slice(0, -1);
        } else if (value.endsWith('M')) {
            multiplier = 1000000;
            value = value.slice(0, -1);
        } else if (value.endsWith('B')) {
            multiplier = 1000000000;
            value = value.slice(0, -1);
        }
        const num = parseFloat(value);
        return isNaN(num) ? null : num * multiplier;
    }

    // Extracts the pure name from a string like "Huzaifah [1407331]" → "Huzaifah"
    function getPureName(fullName) {
        const idx = fullName.indexOf(" [");
        return idx !== -1 ? fullName.substring(0, idx).trim() : fullName.trim();
    }

    // Log message helper
    function logMessage(msg) {
        const logArea = document.getElementById("logArea");
        if (logArea) {
            logArea.innerHTML += msg + "<br/>";
            logArea.scrollTop = logArea.scrollHeight;
        } else {
            console.log(msg);
        }
    }

    // ---------------------------
    // BALANCES UPDATE FUNCTIONALITY
    // ---------------------------
    function updateBalances(computedRecords, balancesText) {
        if (!balancesText) {
            alert("Please paste your balances list in the text area.");
            return;
        }
        let existingBalances = {}; // key: pure name, value: number (in millions)
        let processedLines = []; // lines above the dashed separator
        let extraLines = [];     // lines from the dashed separator onward (unchanged)
        let separatorFound = false;
        const lines = balancesText.split("\n");
        lines.forEach(line => {
            const originalLine = line;
            const trimmed = line.trim();
            if (!trimmed) {
                if (separatorFound) {
                    extraLines.push(originalLine);
                } else {
                    processedLines.push(originalLine);
                }
                return;
            }
            if (/^[-\s]+$/.test(trimmed)) {
                separatorFound = true;
                extraLines.push(originalLine);
                return;
            }
            if (!separatorFound) {
                processedLines.push(originalLine);
                const parts = trimmed.split(" - ");
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    let balanceStr = parts[1].trim();
                    let balance;
                    if (balanceStr.toLowerCase().endsWith("m")) {
                        balanceStr = balanceStr.slice(0, -1);
                        balance = parseFloat(balanceStr.replace(/,/g, ""));
                    } else {
                        balance = parseFloat(balanceStr.replace(/,/g, "")) / 1000000;
                    }
                    existingBalances[name] = isNaN(balance) ? 0 : balance;
                }
            } else {
                extraLines.push(originalLine);
            }
        });

        computedRecords.forEach(rec => {
            const pureName = getPureName(rec.Member);
            const payoutInM = ((rec.Cut !== undefined ? rec.Cut : (rec.Payout !== undefined ? rec.Payout : 0))) / 1000000;
            if (existingBalances.hasOwnProperty(pureName)) {
                existingBalances[pureName] += payoutInM;
            } else {
                existingBalances[pureName] = payoutInM;
            }
        });

        const sortedNames = Object.keys(existingBalances).sort((a, b) => a.localeCompare(b));
        let updatedProcessed = "";
        sortedNames.forEach(name => {
            const balanceDisplay = Math.round(existingBalances[name]);
            updatedProcessed += `${name} - ${balanceDisplay}m\n`;
        });
        let newList = updatedProcessed;
        if (extraLines.length > 0) {
            newList += "\n" + extraLines.join("\n");
        }
        const blobTxt = new Blob([newList], { type: "text/plain" });
        const urlBlobTxt = URL.createObjectURL(blobTxt);
        const aTxt = document.createElement("a");
        aTxt.href = urlBlobTxt;
        aTxt.download = "updated_balances.txt";
        document.body.appendChild(aTxt);
        aTxt.click();
        document.body.removeChild(aTxt);
        logMessage("✅ TXT file with updated balances generated and downloaded.");
    }

    // On blur, auto-convert shorthand notation in cache value inputs.
    function addShortNotationListener(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener("blur", () => {
            const parsed = parseShortNotation(input.value);
            if (parsed !== null) {
                input.value = parsed;
            }
        });
    }

    // ---------------------------
    // AUTOMATIC FACTION ID RETRIEVAL
    // ---------------------------
    async function getFactionID() {
        let storedID = localStorage.getItem("torn_faction_id");
        if (storedID) return parseInt(storedID);
        try {
            const userResp = await gmFetch("https://api.torn.com/v2/user", { headers: globalHeaders });
            const userData = JSON.parse(userResp.responseText);
            if (userData.faction && userData.faction.faction_id) {
                localStorage.setItem("torn_faction_id", userData.faction.faction_id);
                return userData.faction.faction_id;
            } else {
                throw new Error("Faction info not found in user data.");
            }
        } catch (e) {
            console.error("Error fetching faction ID:", e);
            throw e;
        }
    }

    // ---------------------------
    // EXPORT FUNCTION WITH CURRENCY FORMATTING
    // ---------------------------
    function formatCurrency(value) {
        return "$" + Number(value).toLocaleString('en-US');
    }
    function exportExcel(data, filename, sheetName) {
        const formattedData = data.map(row => {
            let newRow = Object.assign({}, row);
            // Format Cut and Payout as comma-separated numbers without any currency symbol.
            if (newRow.Cut !== undefined) {
                newRow.Cut = Number(newRow.Cut).toLocaleString('en-US');
            }
            if (newRow.Payout !== undefined) {
                newRow.Payout = Number(newRow.Payout).toLocaleString('en-US');
            }
            // Rename the "Member" key to "Member 1"
            if (newRow.Member !== undefined) {
                newRow["Member 1"] = newRow.Member;
                delete newRow.Member;
            }
            return newRow;
        });
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, filename);
        logMessage(`✅ Exported ${filename}`);
    }

    // ---------------------------
    // Helper: Calculate next Tuesday after a given timestamp
    // ---------------------------
    function getNextTuesday(timestamp) {
        let date = new Date(timestamp * 1000);
        let day = date.getDay();
        let daysUntilTuesday = (2 - day + 7) % 7;
        if (daysUntilTuesday === 0) daysUntilTuesday = 7;
        date.setDate(date.getDate() + daysUntilTuesday);
        return Math.floor(date.getTime() / 1000);
    }

    // ---------------------------
    // INJECT CUSTOM STYLES (Light & Dark Modes)
    // ---------------------------
    const style = document.createElement('style');
    style.innerHTML = `
      /* Overall payout panel layout */
      #payoutPanel {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
      }
      #payoutPanel h3 {
          margin-top: 0;
          font-size: 16px;
          margin-bottom: 15px;
      }
      .form-group {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
      }
      .form-group label {
          width: 150px;
          text-align: right;
          margin-right: 10px;
          font-size: 13px;
          white-space: nowrap;
      }
      .form-group input,
      .form-group select,
      .form-group textarea {
          max-width: 180px;
          padding: 6px;
          font-size: 13px;
      }
      #payoutPanel .button {
          padding: 6px 12px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 13px;
          margin-top: 10px;
      }
      /* Dark mode */
      body.dark-mode #payoutPanel {
          background: #1a1a1a;
          border: 1px solid #444;
          color: #fff;
      }
      body.dark-mode #payoutPanel input,
      body.dark-mode #payoutPanel select,
      body.dark-mode #payoutPanel textarea {
          background: #2a2a2a;
          border: 1px solid #555;
          color: #fff;
      }
      body.dark-mode #payoutPanel .button {
          background: #3b78e7;
          color: #fff;
          border: none;
      }
      /* Light mode */
      body:not(.dark-mode) #payoutPanel {
          background: #fff;
          border: 1px solid #ccc;
          color: #000;
      }
      body:not(.dark-mode) #payoutPanel input,
      body:not(.dark-mode) #payoutPanel select,
      body:not(.dark-mode) #payoutPanel textarea {
          background: #f3f3f3;
          border: 1px solid #aaa;
          color: #000;
      }
      body:not(.dark-mode) #payoutPanel .button {
          background: #0073e6;
          color: #fff;
          border: none;
      }
      /* New link styling */
      a.view-payout {
          text-decoration: none;
      }
      a.view-payout .icon-wrap {
          margin-right: 4px;
      }
      /* Checkbox styling */
      .form-group input[type="checkbox"] {
          width: auto;
          margin-left: 0;
          margin-right: 5px;
      }
    `;
    document.head.appendChild(style);

    // ---------------------------
    // LOAD CHAINS FUNCTIONALITY
    // ---------------------------
    async function loadChains() {
        const urlParams = new URLSearchParams(window.location.search);
        const warId = urlParams.get("rankID");
        if (!warId) {
            logMessage("⚠️ War ID not found.");
            return;
        }
        let warResp;
        try {
            warResp = await gmFetch(`https://api.torn.com/v2/faction/${warId}/rankedwarreport`, { headers: globalHeaders });
        } catch (err) {
            logMessage("❌ Error fetching war report.");
            return;
        }
        const report = JSON.parse(warResp.responseText).rankedwarreport;
        if (!report) {
            logMessage("❌ War report data missing.");
            return;
        }
        const warStart = report.start, warEnd = report.end;
        logMessage(`Ranked War Start: ${new Date(warStart * 1000).toLocaleString()}`);
        logMessage(`Ranked War End: ${new Date(warEnd * 1000).toLocaleString()}`);
        const nextTuesday = getNextTuesday(warStart);
        logMessage(`Next Tuesday: ${new Date(nextTuesday * 1000).toLocaleString()}`);
        const queryFrom = warStart - 1;
        const chainUrl = `https://api.torn.com/v2/faction/chains?limit=100&sort=DESC&from=${queryFrom}&to=${nextTuesday}`;
        let chainResp;
        try {
            chainResp = await gmFetch(chainUrl, { headers: globalHeaders });
        } catch (err) {
            logMessage("❌ Error fetching chain data.");
            return;
        }
        const chainData = JSON.parse(chainResp.responseText);
        if (!chainData.chains || chainData.chains.length === 0) {
            logMessage("No chains found in the queried timeframe.");
            return;
        }
        // Filter chains: only those that started before warEnd.
        let chains = chainData.chains.filter(chain => chain.start < warEnd);
        if (chains.length === 0) {
            logMessage("No chains with a start time before war end found.");
            return;
        }
        const chainSelect = document.getElementById("chainSelect");
        chainSelect.innerHTML = "";
        chains.forEach(chain => {
            let opt = document.createElement("option");
            opt.value = chain.chain;
            opt.dataset.reportId = chain.id;
            opt.text = `Chain ${chain.chain} (Respect: ${chain.respect}) - ${new Date(chain.start * 1000).toLocaleString()}`;
            chainSelect.appendChild(opt);
        });
        let biggestChain = chains.reduce((max, c) => c.chain > max.chain ? c : max, chains[0]);
        chainSelect.value = biggestChain.chain;
        logMessage(`Chains loaded. Biggest chain auto-selected: Chain ${biggestChain.chain} (Respect: ${biggestChain.respect})`);
    }

    // ---------------------------
    // LOAD MEMBER MAPPING
    // ---------------------------
    async function loadMemberMapping() {
        let membersResp;
        try {
            membersResp = await gmFetch("https://api.torn.com/v2/faction/members?striptags=true", { headers: globalHeaders });
        } catch (err) {
            logMessage("❌ Error fetching member data.");
            return {};
        }
        const membersData = JSON.parse(membersResp.responseText);
        let mapping = {};
        if (membersData.members) {
            if (Array.isArray(membersData.members)) {
                membersData.members.forEach(member => {
                    mapping[member.id] = `${member.name} [${member.id}]`;
                });
            } else {
                for (const id in membersData.members) {
                    mapping[id] = `${membersData.members[id].name} [${id}]`;
                }
            }
        }
        return mapping;
    }
  // ---------------------------
    // INSERT THE PAYOUT LINK INTO TOP-PAGE-LINKS-LIST
    // ---------------------------
    const topPageLinksList = document.getElementById("top-page-links-list");
    if (topPageLinksList) {
        const payoutLink = document.createElement("a");
        payoutLink.setAttribute("aria-labelledby", "view-payout");
        payoutLink.className = "view-payout t-clear h c-pointer line-h24 right";
        payoutLink.href = "javascript:void(0);";
        payoutLink.setAttribute("i-data", "i_payout");
        payoutLink.innerHTML = `
          <span class="icon-wrap svg-icon-wrap">
              <span class="link-icon-svg view-payout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                      <title>payout</title>
                      <g id="Layer_2" data-name="Layer 2">
                          <g id="icons">
                              <g opacity="0.35">
                                  <path d="M2,4h13v2H2zM2,8h13v2H2zM2,12h13v2H2z" fill="#fff"></path>
                              </g>
                              <path d="M2,3h13v2H2zM2,7h13v2H2zM2,11h13v2H2z" fill="#777"></path>
                          </g>
                      </g>
                  </svg>
              </span>
          </span>
          <span id="view-payout">Payout</span>
        `;
        topPageLinksList.appendChild(payoutLink);

        // ---------------------------
        // CREATE THE PAYOUT PANEL
        // ---------------------------
        const payoutPanel = document.createElement("div");
        payoutPanel.id = "payoutPanel";
        payoutPanel.style.display = "none";
        payoutPanel.innerHTML = `
          <h3>War Payout Calculator</h3>
          <div class="form-group">
            <label>Payout Method:</label>
            <select id="payoutMethod">
              <option value="real">Real</option>
              <option value="termed">Termed</option>
              <option value="chain">Chain</option>
            </select>
          </div>
          <!-- Real payout fields -->
          <div id="realFields">
            <div class="form-group">
              <label>Total Cache Value:</label>
              <input type="text" id="realCache" placeholder="e.g. 1B">
            </div>
            <div class="form-group">
              <label>Base Pay %:</label>
              <input type="number" id="basePayPct" placeholder="e.g. 40">
            </div>
            <div class="form-group">
              <label>Min Total Attacks:</label>
              <input type="number" id="minAttacks" placeholder="e.g. 50">
            </div>
            <div class="form-group">
              <label>Outside Hits Paid:</label>
              <input type="checkbox" id="outsideHitsPaid">
            </div>
            <div class="form-group">
              <label>Include Balances:</label>
              <input type="checkbox" id="includeBalancesReal">
            </div>
            <div class="form-group" id="balancesInputReal" style="display:none;">
              <label>Balances List:</label>
              <textarea id="balancesReal" placeholder="Paste balances list (Name - 42m)" style="width:180px; height:60px;"></textarea>
            </div>
          </div>
          <!-- Termed payout fields -->
          <div id="termedFields" style="display:none;">
            <div class="form-group">
              <label>Total Cache Value:</label>
              <input type="text" id="termedCache" placeholder="e.g. 1B">
            </div>
            <div class="form-group">
              <label>Minimum Score:</label>
              <input type="number" id="minScore" placeholder="e.g. 1000">
            </div>
            <div class="form-group">
              <label>Include Balances:</label>
              <input type="checkbox" id="includeBalancesTermed">
            </div>
            <div class="form-group" id="balancesInputTermed" style="display:none;">
              <label>Balances List:</label>
              <textarea id="balancesTermed" placeholder="Paste balances list (Name - 42m)" style="width:180px; height:60px;"></textarea>
            </div>
          </div>
          <!-- Chain payout fields -->
          <div id="chainFields" style="display:none;">
            <div class="form-group">
              <label>Total Cache Value:</label>
              <input type="text" id="chainCache" placeholder="e.g. 1B">
            </div>
            <div class="form-group">
              <label>Select Chain:</label>
              <select id="chainSelect"></select>
            </div>
            <div class="form-group">
              <label>Pay Losses:</label>
              <input type="checkbox" id="payLosses">
            </div>
            <div class="form-group">
              <label>Pay Assists:</label>
              <input type="checkbox" id="payAssists">
            </div>
            <div class="form-group">
              <label>Include Balances:</label>
              <input type="checkbox" id="includeBalancesChain">
            </div>
            <div class="form-group" id="balancesInputChain" style="display:none;">
              <label>Balances List:</label>
              <textarea id="balancesChain" placeholder="Paste balances list (Name - 42m)" style="width:180px; height:60px;"></textarea>
            </div>
          </div>
          <div>
            <button id="calculateBtn" class="button">Calculate</button>
          </div>
          <div id="logArea" style="margin-top: 10px; max-height: 200px; overflow-y: auto; text-align: left;"></div>
        `;
        const delimiter = document.querySelector("hr.page-head-delimiter");
        if (delimiter) {
            delimiter.insertAdjacentElement("afterend", payoutPanel);
        } else {
            topPageLinksList.insertAdjacentElement('afterend', payoutPanel);
        }

        // Toggle panel visibility when the payout link is clicked
        payoutLink.addEventListener("click", () => {
            payoutPanel.style.display = (payoutPanel.style.display === "none") ? "block" : "none";
        });

        // Toggle fields based on payout method selection
        const payoutMethodSelect = document.getElementById("payoutMethod");
        payoutMethodSelect.addEventListener("change", function () {
            if (this.value === "real") {
                document.getElementById("realFields").style.display = "block";
                document.getElementById("termedFields").style.display = "none";
                document.getElementById("chainFields").style.display = "none";
            } else if (this.value === "termed") {
                document.getElementById("realFields").style.display = "none";
                document.getElementById("termedFields").style.display = "block";
                document.getElementById("chainFields").style.display = "none";
            } else if (this.value === "chain") {
                document.getElementById("realFields").style.display = "none";
                document.getElementById("termedFields").style.display = "none";
                document.getElementById("chainFields").style.display = "block";
                // Asynchronously load chain data and populate the dropdown.
                loadChains();
            }
        });

        // Toggle display for Balances textareas when checkboxes are changed.
        document.getElementById("includeBalancesReal").addEventListener("change", function() {
            document.getElementById("balancesInputReal").style.display = this.checked ? "block" : "none";
        });
        document.getElementById("includeBalancesTermed").addEventListener("change", function() {
            document.getElementById("balancesInputTermed").style.display = this.checked ? "block" : "none";
        });
        document.getElementById("includeBalancesChain").addEventListener("change", function() {
            document.getElementById("balancesInputChain").style.display = this.checked ? "block" : "none";
        });

        addShortNotationListener("realCache");
        addShortNotationListener("termedCache");
        addShortNotationListener("chainCache");

        // ---------------------------
        // MAIN FUNCTIONALITY (CALCULATE BUTTON)
        // ---------------------------
        async function main() {
            const urlParams = new URLSearchParams(window.location.search);
            const warId = urlParams.get("rankID");
            if (!warId) {
                logMessage("⚠️ War ID not found.");
                return;
            }
            logMessage(`War ID: ${warId}`);

            try {
                myFactionID = await getFactionID();
            } catch (e) {
                logMessage("❌ Could not retrieve faction ID.");
                return;
            }
            logMessage(`Your Faction ID: ${myFactionID}`);

            const headers = {
                "accept": "application/json",
                "Authorization": `ApiKey ${API_KEY}`
            };

            let warResp;
            try {
                warResp = await gmFetch(`https://api.torn.com/v2/faction/${warId}/rankedwarreport`, { headers });
            } catch (err) {
                logMessage("❌ Error fetching war report.");
                return;
            }
            const report = JSON.parse(warResp.responseText).rankedwarreport;
            if (!report) {
                logMessage("❌ War report data missing.");
                return;
            }
            const warStart = report.start, warEnd = report.end;

            let enemyFaction = null;
            for (const fac of report.factions) {
                if (parseInt(fac.id) !== myFactionID) {
                    enemyFaction = fac;
                    break;
                }
            }
            if (!enemyFaction) {
                logMessage("❌ Could not determine enemy faction.");
                return;
            }
            logMessage(`Enemy Faction: ${enemyFaction.name}`);
            logMessage(`War timeframe: ${new Date(warStart * 1000).toLocaleString()} to ${new Date(warEnd * 1000).toLocaleString()}`);

            const myFactionData = report.factions.find(fac => parseInt(fac.id) === myFactionID);
            if (!myFactionData) {
                logMessage(`❌ Your faction ID ${myFactionID} not found.`);
                return;
            }
            let memberRecords = myFactionData.members.map(m => ({
                Member: `${m.name} [${m.id}]`,
                Score: m.score || 0,
                Attacks: m.attacks || 0,
                Lost: 0,
                Assisted: 0,
                "Outside Hits": 0,
                "Base Pay": 0,
                "Contribution Pay": 0,
                Cut: 0
            }));
            memberRecords.sort((a, b) => b.Score - a.Score);

            const payoutMethod = payoutMethodSelect.value;
            if (payoutMethod === "termed") {
                const totalCache = parseFloat(document.getElementById("termedCache").value);
                const minScore = parseFloat(document.getElementById("minScore").value);
                if (isNaN(totalCache) || isNaN(minScore)) {
                    logMessage("❌ Invalid values for cache or minimum score.");
                    return;
                }
                const eligibleMembers = memberRecords.filter(rec => rec.Score >= minScore);
                if (eligibleMembers.length === 0) {
                    logMessage("❌ No members meet the minimum score requirement.");
                    return;
                }
                const cutEach = totalCache / eligibleMembers.length;
                eligibleMembers.forEach(rec => {
                    rec.Cut = cutEach === 0 ? 0 : Math.ceil(cutEach / 1_000_000) * 1_000_000;
                });
                logMessage("Termed payout calculated.");
                if (document.getElementById("includeBalancesTermed").checked) {
                    updateBalances(memberRecords, document.getElementById("balancesTermed").value);
                }
                exportExcel(memberRecords, `torn_${enemyFaction.name.replace(/\s+/g, '_')}_war_report.xlsx`, "Report");
                const payoutRecords = memberRecords.filter(rec => rec.Cut > 0)
                    .map(rec => ({ "Member": rec.Member, "Cut": rec.Cut }));
                exportExcel(payoutRecords, `torn_war_payout_${enemyFaction.name.replace(/\s+/g, '_')}.xlsx`, "Payout");
            } else if (payoutMethod === "real") {
                const totalCache = parseFloat(document.getElementById("realCache").value);
                const basePayPct = parseFloat(document.getElementById("basePayPct").value);
                const minAttacks = parseInt(document.getElementById("minAttacks").value);
                const outsideHitsPaid = document.getElementById("outsideHitsPaid").checked;
                if (isNaN(totalCache) || isNaN(basePayPct) || isNaN(minAttacks)) {
                    logMessage("❌ Invalid values for total cache, base pay %, or min attacks.");
                    return;
                }
                logMessage("Grabbing attack logs...");
                let allAttackLogs = [];
                let currentTo = warEnd;
                let moreLogs = true;
                while (moreLogs) {
                    const attacksUrl = `https://api.torn.com/v2/faction/attacksfull?limit=1000&sort=DESC&to=${currentTo}`;
                    try {
                        let attackResp = await gmFetch(attacksUrl, { headers });
                        const attacks = JSON.parse(attackResp.responseText).attacks;
                        if (!attacks || attacks.length === 0) break;
                        for (const log of attacks) {
                            if (log.ended >= warStart && log.ended <= warEnd) {
                                allAttackLogs.push(log);
                            } else if (log.ended < warStart) {
                                moreLogs = false;
                                break;
                            }
                        }
                        currentTo = attacks[attacks.length - 1].ended - 1;
                    } catch (err) {
                        await sleep(1000);
                        continue;
                    }
                    let progress = ((warEnd - currentTo) / (warEnd - warStart)) * 100;
                    progress = Math.min(100, progress);
                    logMessage(`Processing attack logs... (${progress.toFixed(1)}% complete)`);
                    await sleep(250);
                }
                logMessage(`Attack logs grabbed: ${allAttackLogs.length}`);
                for (const log of allAttackLogs) {
                    if (log.ended < warStart || log.ended > warEnd) continue;
                    if (!log.defender || log.defender.faction_id !== parseInt(enemyFaction.id)) continue;
                    if (!log.attacker || log.attacker.faction_id !== myFactionID) continue;
                    if (log.result !== "Lost" && log.result !== "Assist") continue;
                    const attackerId = log.attacker.id;
                    const memberRecord = memberRecords.find(rec => {
                        const idMatch = rec.Member.match(/\[(\d+)\]$/);
                        return idMatch && parseInt(idMatch[1]) === attackerId;
                    });
                    if (memberRecord) {
                        if (log.result === "Lost") {
                            memberRecord.Lost++;
                        } else if (log.result === "Assist") {
                            memberRecord.Assisted++;
                        }
                    }
                }
                if (outsideHitsPaid) {
                    logMessage("Grabbing outside hits logs...");
                    let currentToOH = warEnd;
                    let moreLogsOH = true;
                    while (moreLogsOH) {
                        const attacksUrl = `https://api.torn.com/v2/faction/attacksfull?limit=1000&sort=DESC&to=${currentToOH}`;
                        try {
                            let attackResp = await gmFetch(attacksUrl, { headers });
                            const attacks = JSON.parse(attackResp.responseText).attacks;
                            if (!attacks || attacks.length === 0) break;
                            for (const log of attacks) {
                                if (log.ended >= warStart && log.ended <= warEnd) {
                                    if (log.attacker &&
                                        log.attacker.faction_id === myFactionID &&
                                        log.defender &&
                                        (log.defender.faction_id === null ||
                                         (log.defender.faction_id !== myFactionID &&
                                          log.defender.faction_id !== parseInt(enemyFaction.id)))) {
                                        if (log.result !== "Lost") {
                                            const attId = log.attacker.id;
                                            const memberRecord = memberRecords.find(rec => {
                                                const idMatch = rec.Member.match(/\[(\d+)\]$/);
                                                return idMatch && parseInt(idMatch[1]) === attId;
                                            });
                                            if (memberRecord) {
                                                memberRecord["Outside Hits"] = (memberRecord["Outside Hits"] || 0) + 1;
                                            }
                                        }
                                    }
                                } else if (log.ended < warStart) {
                                    moreLogsOH = false;
                                    break;
                                }
                            }
                            currentToOH = attacks[attacks.length - 1].ended - 1;
                        } catch (err) {
                            await sleep(1000);
                            continue;
                        }
                        await sleep(250);
                    }
                    logMessage("Outside hits logs grabbed.");
                }
                for (let rec of memberRecords) {
                    rec["Total Attacks"] = rec.Attacks + rec.Lost + rec.Assisted + rec["Outside Hits"];
                }
                const payees = memberRecords.filter(rec => rec["Total Attacks"] >= minAttacks);
                if (payees.length === 0) {
                    logMessage(`No members meet the minimum total attacks threshold of ${minAttacks}.`);
                } else {
                    const basePool = totalCache * (basePayPct / 100);
                    const basePayEach = basePool / payees.length;
                    const remainderPool = totalCache - basePool;
                    const sumAttacks = payees.reduce((sum, rec) => sum + rec["Total Attacks"], 0);
                    for (let rec of payees) {
                        let contributionPay = sumAttacks === 0 ? 0 : (rec["Total Attacks"] / sumAttacks) * remainderPool;
                        rec["Base Pay"] = basePayEach;
                        rec["Contribution Pay"] = contributionPay;
                        const totalPay = basePayEach + contributionPay;
                        rec.Cut = totalPay === 0 ? 0 : Math.ceil(totalPay / 1_000_000) * 1_000_000;
                    }
                    logMessage("Real payout calculated.");
                }
                if (document.getElementById("includeBalancesReal").checked) {
                    updateBalances(memberRecords, document.getElementById("balancesReal").value);
                }
                exportExcel(memberRecords, `torn_${enemyFaction.name.replace(/\s+/g, '_')}_war_report_with_attacks.xlsx`, "Full Report");
                const payoutRecords = memberRecords.filter(rec => rec.Cut > 0)
                    .map(rec => ({ "Member": rec.Member, "Cut": rec.Cut }));
                exportExcel(payoutRecords, `torn_war_payout_${enemyFaction.name.replace(/\s+/g, '_')}.xlsx`, "Payout");
            } else if (payoutMethod === "chain") {
                const totalCache = parseFloat(document.getElementById("chainCache").value);
                const payLosses = document.getElementById("payLosses").checked;
                const payAssists = document.getElementById("payAssists").checked;
                if (isNaN(totalCache)) {
                    logMessage("❌ Invalid total cache value for chain payout.");
                    return;
                }
                const chainSelect = document.getElementById("chainSelect");
                const selectedOption = chainSelect.options[chainSelect.selectedIndex];
                const reportId = selectedOption.dataset.reportId;
                if (!reportId) {
                    logMessage("❌ No chain report id found.");
                    return;
                }
                const chainReportUrl = `https://api.torn.com/v2/faction/${reportId}/chainreport`;
                let chainReportResp;
                try {
                    chainReportResp = await gmFetch(chainReportUrl, { headers });
                } catch (err) {
                    logMessage("❌ Error fetching chain report data.");
                    return;
                }
                const chainReportData = JSON.parse(chainReportResp.responseText).chainreport;
                if (!chainReportData) {
                    logMessage("❌ Chain report data missing.");
                    return;
                }
                const attackers = chainReportData.attackers;
                if (!attackers || attackers.length === 0) {
                    logMessage("❌ No attackers in chain report.");
                    return;
                }
                let totalAttacksSum = 0;
                attackers.forEach(attacker => {
                    let extraAttacks = 0;
                    if (payAssists) {
                        extraAttacks += attacker.attacks.assists;
                    }
                    if (payLosses) {
                        extraAttacks += attacker.attacks.losses;
                    }
                    const totalAttacks = attacker.attacks.total + extraAttacks;
                    attacker.totalAttacks = totalAttacks;
                    totalAttacksSum += totalAttacks;
                });
                if (totalAttacksSum === 0) {
                    logMessage("❌ Total attacks is zero.");
                    return;
                }
                attackers.forEach(attacker => {
                    const share = attacker.totalAttacks / totalAttacksSum;
                    const payout = totalCache * share;
                    attacker.payout = payout === 0 ? 0 : Math.ceil(payout / 1_000_000) * 1_000_000;
                });
                logMessage("Chain payout calculated.");
                let memberMapping = await loadMemberMapping();
                attackers.forEach(attacker => {
                    const id = attacker.id;
                    attacker.Name = memberMapping[id] || `Unknown [${id}]`;
                });
                const detailedChainReport = attackers.map(attacker => {
                    let record = {
                        "Member": attacker.Name,
                        "Total Attacks": attacker.totalAttacks,
                        "Respect": attacker.respect.total,
                        "Leaves": attacker.attacks.leave,
                        "Mug": attacker.attacks.mug,
                        "Hosp": attacker.attacks.hospitalize,
                        "Payout": attacker.payout
                    };
                    if (payAssists) {
                        record["Assists"] = attacker.attacks.assists;
                    }
                    if (payLosses) {
                        record["Losses"] = attacker.attacks.losses;
                    }
                    return record;
                });
                if (document.getElementById("includeBalancesChain").checked) {
                    updateBalances(detailedChainReport, document.getElementById("balancesChain").value);
                }
                let payoutSummary = attackers.map(a => ({
                    "Member": a.Name,
                    "Cut": a.payout
                }));
                exportExcel(detailedChainReport, `torn_${enemyFaction.name.replace(/\s+/g, '_')}_chain_report.xlsx`, "Chain Report");
                exportExcel(payoutSummary, `torn_war_payout_${enemyFaction.name.replace(/\s+/g, '_')}_chain.xlsx`, "Payout");
            } else {
                logMessage("❌ Invalid payout method.");
            }
        }

        // ---------------------------
        // BIND CALCULATE BUTTON
        // ---------------------------
        document.getElementById("calculateBtn").addEventListener("click", async function () {
            document.getElementById("logArea").innerHTML = "";
            this.disabled = true;
            try {
                await main();
            } catch (e) {
                logMessage(`❌ An error occurred: ${e.message || 'Unknown error'}`);
                console.error(e);
            }
            this.disabled = false;
        });
    }
})();
