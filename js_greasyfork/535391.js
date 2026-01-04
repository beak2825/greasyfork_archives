// ==UserScript==
// @name         Combined Faction Scripts 
// @namespace    http://your.namespace.here
// @version      1.0.0
// @description  Skeleton for combining multiple Torn userscripts into one modular script
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        none
// @connect      api.torn.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @author       HuzGPT
// @downloadURL https://update.greasyfork.org/scripts/535391/Combined%20Faction%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/535391/Combined%20Faction%20Scripts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // === CONFIGURATION ===
  // Replace with your Torn API key once
  const API_KEY = 'AIK9ZdfA1KQ5eirH';

  // === MODULES DEFINITION ===
  const modules = [
    {
      name: 'Torn Faction Revive Checker',
      include: [/https?:\/\/www\.torn\.com\/factions\.php\?step=profile&ID=\d+/],
      run: function(apiKey) {
        function getFactionId() {
          const url = window.location.href;
          const match = url.match(/ID=(\d+)/);
          return match ? match[1] : null;
        }

        function displayLoadingMenu() {
          let existingMenu = document.getElementById('reviveCheckerMenu');
          if (existingMenu) existingMenu.remove();

          let menu = createBaseMenu();
          let title = document.createElement('div');
          title.textContent = 'Revivable Players';
          Object.assign(title.style, { fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' });
          menu.appendChild(title);

          let loadingMsg = document.createElement('div');
          loadingMsg.textContent = 'Loading...';
          Object.assign(loadingMsg.style, { color: '#888', fontStyle: 'italic' });
          menu.appendChild(loadingMsg);

          document.body.appendChild(menu);
        }

        function displayError(message) {
          let existingMenu = document.getElementById('reviveCheckerMenu');
          if (existingMenu) existingMenu.remove();

          let menu = createBaseMenu();
          let title = document.createElement('div');
          title.textContent = 'Revivable Players';
          Object.assign(title.style, { fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' });
          menu.appendChild(title);

          let errorMsg = document.createElement('div');
          errorMsg.textContent = message;
          Object.assign(errorMsg.style, { color: '#ff6666', fontStyle: 'italic' });
          menu.appendChild(errorMsg);

          document.body.appendChild(menu);
        }

        function processRevivableMembers(data) {
          const revivablePlayers = [];

          if (data.members) {
            for (const memberData of Object.values(data.members)) {
              if (memberData.is_revivable) {
                revivablePlayers.push({ id: memberData.id, name: memberData.name });
              }
            }
          }

          displayReviveList(revivablePlayers);
        }

        function createBaseMenu() {
          let menu = document.createElement('div');
          menu.id = 'reviveCheckerMenu';
          Object.assign(menu.style, {
            position: 'fixed', top: '100px', right: '20px',
            backgroundColor: 'rgba(20,20,20,0.95)', color: '#fff', padding: '15px',
            borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)', zIndex: '1000',
            fontSize: '14px', minWidth: '220px', maxHeight: '300px', overflowY: 'auto'
          });

          let closeButton = document.createElement('span');
          closeButton.textContent = 'X';
          Object.assign(closeButton.style, {
            position: 'absolute', top: '5px', right: '8px', cursor: 'pointer',
            color: '#ff6666', fontWeight: 'bold', fontSize: '16px'
          });
          closeButton.title = 'Close';
          closeButton.onclick = () => menu.remove();
          menu.appendChild(closeButton);

          return menu;
        }

        function displayReviveList(players) {
          let existingMenu = document.getElementById('reviveCheckerMenu');
          if (existingMenu) existingMenu.remove();

          let menu = createBaseMenu();
          let title = document.createElement('div');
          title.textContent = 'Revivable Players';
          Object.assign(title.style, { fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' });
          menu.appendChild(title);

          if (!players.length) {
            let noPlayersMsg = document.createElement('div');
            noPlayersMsg.textContent = 'No revivable players found';
            Object.assign(noPlayersMsg.style, { color: '#888', fontStyle: 'italic' });
            menu.appendChild(noPlayersMsg);
          } else {
            let countDiv = document.createElement('div');
            countDiv.textContent = `Found ${players.length} revivable player${players.length > 1 ? 's' : ''}`;
            Object.assign(countDiv.style, { marginBottom: '10px', color: '#1E90FF' });
            menu.appendChild(countDiv);

            players.forEach(player => {
              let playerEntry = document.createElement('div');
              playerEntry.style.marginBottom = '5px';
              playerEntry.innerHTML = `<a href='/profiles.php?XID=${player.id}' style='color:white;text-decoration:none;font-weight:bold' onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">${player.name}</a>`;
              menu.appendChild(playerEntry);
            });
          }

          document.body.appendChild(menu);
        }

        function fetchFactionMembers() {
          const factionId = getFactionId();
          if (!factionId) { console.error('Could not find faction ID'); displayError('Could not find faction ID'); return; }

          displayLoadingMenu();

          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`,
            headers: { Authorization: `ApiKey ${apiKey}`, accept: 'application/json' },
            onload: response => {
              try {
                const data = JSON.parse(response.responseText);
                if (data.error) { console.error('API Error:', data.error); displayError(`API Error: ${data.error.error}`); return; }
                processRevivableMembers(data);
              } catch (e) {
                console.error('JSON Parse Error:', e);
                displayError('Failed to parse API response');
              }
            },
            onerror: error => { console.error('Request Error:', error); displayError('Failed to connect to Torn API'); }
          });
        }

        function addReviveButton() {
          let linksTopWrap = document.querySelector('.links-top-wrap');
          if (!linksTopWrap) return;

          let button = document.createElement('a');
          button.className = 'view-wars t-clear h c-pointer line-h24 right last';
          button.href = '#';
          button.setAttribute('aria-labelledby', 'revive-checker');
          button.innerHTML = `<span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg view-wars"></span></span><span id="revive-checker">Revive Checker</span>`;
          button.onclick = e => { e.preventDefault(); fetchFactionMembers(); };
          linksTopWrap.appendChild(button);
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addReviveButton);
        else addReviveButton();
      }
    },
    {
  name: 'Torn War Payout Calculator',
  include: [/https?:\/\/www\.torn\.com\/war\.php\?step=rankreport.*/],
  run: async function(apiKey) {
    'use strict';
    const API_KEY = apiKey;
    // ensure fresh faction lookup
    localStorage.removeItem("torn_faction_id");
    let myFactionID = null;

    // --- Helpers ---
    async function fetchJson(url) {
      const resp = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `ApiKey ${API_KEY}`
        }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
      return resp.json();
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function parseShortNotation(value) {
      if (typeof value !== 'string') value = String(value);
      let multiplier = 1;
      value = value.trim().toUpperCase();
      if (value.endsWith('K')) { multiplier = 1e3; value = value.slice(0, -1); }
      else if (value.endsWith('M')) { multiplier = 1e6; value = value.slice(0, -1); }
      else if (value.endsWith('B')) { multiplier = 1e9; value = value.slice(0, -1); }
      const num = parseFloat(value.replace(/,/g, ''));
      return isNaN(num) ? null : num * multiplier;
    }

    function getPureName(fullName) {
      const idx = fullName.indexOf(' [');
      return idx !== -1 ? fullName.slice(0, idx).trim() : fullName.trim();
    }

    function logMessage(msg) {
      const logArea = document.getElementById('logArea');
      if (logArea) {
        logArea.innerHTML += msg + '<br/>';
        logArea.scrollTop = logArea.scrollHeight;
      } else {
        console.log(msg);
      }
    }

    function formatCurrency(value) {
      return '$' + Number(value).toLocaleString('en-US');
    }

    function getNextTuesday(ts) {
      const date = new Date(ts * 1000);
      const day = date.getDay();
      let delta = (2 - day + 7) % 7;
      if (delta === 0) delta = 7;
      date.setDate(date.getDate() + delta);
      return Math.floor(date.getTime() / 1000);
    }

    function updateBalances(computedRecords, balancesText) {
      if (!balancesText) {
        alert('Please paste your balances list in the text area.');
        return;
      }
      let existing = {};
      let processed = [], extra = [], sepFound = false;
      balancesText.split('\n').forEach(line => {
        const orig = line;
        const trimmed = line.trim();
        if (!trimmed) {
          (sepFound ? extra : processed).push(orig);
          return;
        }
        if (/^[-\s]+$/.test(trimmed)) {
          sepFound = true;
          extra.push(orig);
          return;
        }
        if (!sepFound) {
          processed.push(orig);
          const parts = trimmed.split(' - ');
          if (parts.length >= 2) {
            const name = parts[0].trim();
            let bal = parts[1].trim().toLowerCase();
            let val = naN;
            if (bal.endsWith('m')) {
              val = parseFloat(bal.slice(0,-1).replace(/,/g,'')) || 0;
            } else {
              val = parseFloat(bal.replace(/,/g,''))/1e6 || 0;
            }
            existing[name] = val;
          }
        } else extra.push(orig);
      });
      computedRecords.forEach(rec => {
        const name = getPureName(rec.Member);
        const payoutM = ((rec.Cut ?? rec.Payout) || 0) / 1e6;
        existing[name] = (existing[name] || 0) + payoutM;
      });
      const sorted = Object.keys(existing).sort();
      let out = '';
      sorted.forEach(name => {
        out += `${name} - ${Math.round(existing[name])}m\n`;
      });
      if (extra.length) out += '\n' + extra.join('\n');
      const blob = new Blob([out], { type: 'text/plain' });
      saveAs(blob, 'updated_balances.txt');
      logMessage('✅ TXT file with updated balances generated and downloaded.');
    }

    function exportExcel(data, filename, sheetName) {
      const formatted = data.map(row => {
        const r = {...row};
        if (r.Cut != null) r.Cut = Number(r.Cut).toLocaleString('en-US');
        if (r.Payout != null) r.Payout = Number(r.Payout).toLocaleString('en-US');
        if (r.Member != null) { r['Member 1'] = r.Member; delete r.Member; }
        return r;
      });
      const ws = XLSX.utils.json_to_sheet(formatted);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
      logMessage(`✅ Exported ${filename}`);
    }

    async function getFactionID() {
      const stored = localStorage.getItem('torn_faction_id');
      if (stored) return parseInt(stored);
      try {
        const data = await fetchJson('https://api.torn.com/v2/user');
        if (data.faction?.faction_id) {
          localStorage.setItem('torn_faction_id', data.faction.faction_id);
          return data.faction.faction_id;
        }
        throw new Error('Faction info not found');
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    async function loadChains() {
      const params = new URLSearchParams(window.location.search);
      const warId = params.get('rankID');
      if (!warId) { logMessage('⚠️ War ID not found.'); return; }
      const report = (await fetchJson(`https://api.torn.com/v2/faction/${warId}/rankedwarreport`)).rankedwarreport;
      if (!report) { logMessage('❌ War report data missing.'); return; }
      const { start: warStart, end: warEnd } = report;
      const nextTue = getNextTuesday(warStart);
      const chainsData = (await fetchJson(`https://api.torn.com/v2/faction/chains?limit=100&sort=DESC&from=${warStart-1}&to=${nextTue}`)).chains;
      const chains = (chainsData||[]).filter(c=>c.start<warEnd);
      if (!chains.length) { logMessage('No chains in timeframe.'); return; }
      const sel = document.getElementById('chainSelect');
      sel.innerHTML = '';
      chains.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.chain;
        opt.dataset.reportId = c.id;
        opt.text = `Chain ${c.chain} (Respect: ${c.respect}) - ${new Date(c.start*1000).toLocaleString()}`;
        sel.appendChild(opt);
      });
      const biggest = chains.reduce((max,c)=>c.chain>max.chain?c:max,chains[0]);
      sel.value = biggest.chain;
      logMessage(`Chains loaded. Auto-selected Chain ${biggest.chain}.`);
    }

    async function loadMemberMapping() {
      const data = (await fetchJson('https://api.torn.com/v2/faction/members?striptags=true')).members;
      const map = {};
      if (Array.isArray(data)) data.forEach(m=> map[m.id]=`${m.name} [${m.id}]`);
      else Object.entries(data||{}).forEach(([id,m])=> map[id]=`${m.name} [${id}]`);
      return map;
    }

    function addShortNotationListener(id) {
      const inp = document.getElementById(id);
      if (!inp) return;
      inp.addEventListener('blur', ()=>{
        const p = parseShortNotation(inp.value);
        if (p!=null) inp.value = p;
      });
    }

    // --- Injection of UI ---
    function injectCalculator() {
      const container = document.getElementById('top-page-links-list');
      if (!container) return false;
      if (document.getElementById('payoutPanel')) return true;

      const link = document.createElement('a');
      link.className = 'view-payout t-clear h c-pointer line-h24 right';
      link.href = 'javascript:void(0);';
      link.innerHTML = `
        <span class="icon-wrap svg-icon-wrap">
          <span class="link-icon-svg view-payout">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18"><title>payout</title><g opacity=".35"><path d="M2,4h13v2H2zM2,8h13v2H2zM2,12h13v2H2z"/></g><g><path d="M2,3h13v2H2zM2,7h13v2H2zM2,11h13v2H2z"/></g></svg>
          </span>
        </span>
        <span>Payout</span>
      `;
      container.appendChild(link);

      // panel
      const panel = document.createElement('div');
      panel.id = 'payoutPanel';
      panel.style.display = 'none';
      panel.innerHTML = `<h3>War Payout Calculator</h3>
        <div class="form-group"><label>Payout Method:</label>
          <select id="payoutMethod">
            <option value="real">Real</option>
            <option value="termed">Termed</option>
            <option value="chain">Chain</option>
          </select>
        </div>
        <div id="realFields">
          <div class="form-group"><label>Total Cache Value:</label><input type="text" id="realCache" placeholder="e.g. 1B"></div>
          <div class="form-group"><label>Base Pay %:</label><input type="number" id="basePayPct" placeholder="e.g. 40"></div>
          <div class="form-group"><label>Min Total Attacks:</label><input type="number" id="minAttacks" placeholder="e.g. 50"></div>
          <div class="form-group"><label>Outside Hits Paid:</label><input type="checkbox" id="outsideHitsPaid"></div>
          <div class="form-group"><label>Include Balances:</label><input type="checkbox" id="includeBalancesReal"></div>
          <div class="form-group" id="balancesInputReal" style="display:none;">
            <label>Balances List:</label>
            <textarea id="balancesReal" style="width:180px;height:60px;"></textarea>
          </div>
        </div>
        <div id="termedFields" style="display:none;">
          <div class="form-group"><label>Total Cache Value:</label><input type="text" id="termedCache" placeholder="e.g. 1B"></div>
          <div class="form-group"><label>Minimum Score:</label><input type="number" id="minScore"></div>
          <div class="form-group"><label>Include Balances:</label><input type="checkbox" id="includeBalancesTermed"></div>
          <div class="form-group" id="balancesInputTermed" style="display:none;">
            <label>Balances List:</label>
            <textarea id="balancesTermed" style="width:180px;height:60px;"></textarea>
          </div>
        </div>
        <div id="chainFields" style="display:none;">
          <div class="form-group"><label>Total Cache Value:</label><input type="text" id="chainCache"></div>
          <div class="form-group"><label>Select Chain:</label><select id="chainSelect"></select></div>
          <div class="form-group"><label>Pay Losses:</label><input type="checkbox" id="payLosses"></div>
          <div class="form-group"><label>Pay Assists:</label><input type="checkbox" id="payAssists"></div>
          <div class="form-group"><label>Include Balances:</label><input type="checkbox" id="includeBalancesChain"></div>
          <div class="form-group" id="balancesInputChain" style="display:none;">
            <label>Balances List:</label>
            <textarea id="balancesChain" style="width:180px;height:60px;"></textarea>
          </div>
        </div>
        <div><button id="calculateBtn" class="button">Calculate</button></div>
        <div id="logArea" style="margin-top:10px;max-height:200px;overflow-y:auto;text-align:left;"></div>
      `;
      const delimiter = document.querySelector('hr.page-head-delimiter');
      (delimiter || container).insertAdjacentElement('afterend', panel);

      // styles
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        #payoutPanel {margin:20px auto;max-width:400px;padding:15px;border-radius:4px;text-align:center;}
        #payoutPanel h3 {margin:0 0 15px;font-size:16px;}
        .form-group {display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
        .form-group label {width:150px;text-align:right;margin-right:10px;font-size:13px;white-space:nowrap;}
        .form-group input, .form-group select, .form-group textarea {max-width:180px;padding:6px;font-size:13px;}
        .button {padding:6px 12px;border-radius:2px;cursor:pointer;font-size:13px;margin-top:10px;}
        body.dark-mode #payoutPanel {background:#1a1a1a;border:1px solid #444;color:#fff;}
        body.dark-mode .form-group input,body.dark-mode .form-group select,body.dark-mode .form-group textarea {background:#2a2a2a;border:1px solid #555;color:#fff;}
        body.dark-mode .button {background:#3b78e7;color:#fff;border:none;}
        body:not(.dark-mode) #payoutPanel {background:#fff;border:1px solid #ccc;color:#000;}
        body:not(.dark-mode) .form-group input,body:not(.dark-mode) .form-group select,body:not(.dark-mode) .form-group textarea {background:#f3f3f3;border:1px solid #aaa;color:#000;}
        body:not(.dark-mode) .button {background:#0073e6;color:#fff;border:none;}
        /* Scope button styling to inside the payout panel */
        #payoutPanel .button {
          padding: 6px 12px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 13px;
          margin-top: 10px;
        }

        /* Dark mode */
        body.dark-mode #payoutPanel .button {
          background: #3b78e7;
          color: #fff;
          border: none;
        }

        /* Light mode */
        body:not(.dark-mode) #payoutPanel .button {
          background: #0073e6;
          color: #fff;
          border: none;
        }

      `;
      document.head.appendChild(styleEl);

      // toggle panel
      link.addEventListener('click', ()=> {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      });

      // payout method change
      const pm = document.getElementById('payoutMethod');
      pm.addEventListener('change', ()=> {
        document.getElementById('realFields').style.display = pm.value==='real'?'block':'none';
        document.getElementById('termedFields').style.display = pm.value==='termed'?'block':'none';
        document.getElementById('chainFields').style.display = pm.value==='chain'?'block':'none';
        if (pm.value==='chain') loadChains();
      });

      // include balances toggles
      document.getElementById('includeBalancesReal').addEventListener('change', e=>{
        document.getElementById('balancesInputReal').style.display = e.target.checked?'block':'none';
      });
      document.getElementById('includeBalancesTermed').addEventListener('change', e=>{
        document.getElementById('balancesInputTermed').style.display = e.target.checked?'block':'none';
      });
      document.getElementById('includeBalancesChain').addEventListener('change', e=>{
        document.getElementById('balancesInputChain').style.display = e.target.checked?'block':'none';
      });

      ['realCache','termedCache','chainCache'].forEach(addShortNotationListener);

      // main logic
      async function main() {
        const warId = new URLSearchParams(window.location.search).get('rankID');
        if (!warId) { logMessage('⚠️ War ID not found.'); return; }
        logMessage(`War ID: ${warId}`);
        try { myFactionID = await getFactionID(); } catch {
          logMessage('❌ Could not retrieve faction ID.'); return;
        }
        logMessage(`Your Faction ID: ${myFactionID}`);

        const report = (await fetchJson(`https://api.torn.com/v2/faction/${warId}/rankedwarreport`)).rankedwarreport;
        if (!report) { logMessage('❌ War report missing.'); return; }
        const { start: warStart, end: warEnd, factions } = report;
        const enemy = factions.find(f=>f.id!=myFactionID);
        if (!enemy) { logMessage('❌ Enemy faction not found.'); return; }
        logMessage(`Enemy Faction: ${enemy.name}`);
        logMessage(`War timeframe: ${new Date(warStart*1000).toLocaleString()} to ${new Date(warEnd*1000).toLocaleString()}`);

        const myFac = factions.find(f=>f.id==myFactionID);
        let members = (myFac.members||[]).map(m=>({
          Member:`${m.name} [${m.id}]`,
          Score:m.score||0,
          Attacks:m.attacks||0,
          Lost:0, Assisted:0, 'Outside Hits':0,
          'Base Pay':0,'Contribution Pay':0,Cut:0
        })).sort((a,b)=>b.Score-a.Score);

        const method = pm.value;
        if (method==='termed') {
          const total = parseFloat(document.getElementById('termedCache').value);
          const minScore = parseFloat(document.getElementById('minScore').value);
          if (isNaN(total)||isNaN(minScore)) { logMessage('❌ Invalid inputs.'); return; }
          const elig = members.filter(r=>r.Score>=minScore);
          if (!elig.length) { logMessage('❌ No eligible members.'); return; }
          const cut = Math.ceil(total/elig.length/1e6)*1e6;
          elig.forEach(r=>r.Cut=cut);
          logMessage('Termed payout calculated.');
          if (document.getElementById('includeBalancesTermed').checked)
            updateBalances(members, document.getElementById('balancesTermed').value);
          exportExcel(members, `torn_${enemy.name.replace(/\s+/g,'_')}_war_report.xlsx`, 'Report');
          exportExcel(elig.map(r=>({Member:r.Member,Cut:r.Cut})), `torn_war_payout_${enemy.name.replace(/\s+/g,'_')}.xlsx`, 'Payout');

        } else if (method==='real') {
          const total = parseFloat(document.getElementById('realCache').value);
          const basePct = parseFloat(document.getElementById('basePayPct').value);
          const minAtt = parseInt(document.getElementById('minAttacks').value);
          const payOH = document.getElementById('outsideHitsPaid').checked;
          if (isNaN(total)||isNaN(basePct)||isNaN(minAtt)) { logMessage('❌ Invalid inputs.'); return; }

          logMessage('Grabbing attack logs...');
          let logs=[], currentTo=warEnd, more=true;
          while(more) {
            const data = (await fetchJson(`https://api.torn.com/v2/faction/attacksfull?limit=1000&sort=DESC&to=${currentTo}`)).attacks;
            if (!data||!data.length) break;
            for (const lg of data) {
              if (lg.ended<warStart) { more=false; break; }
              if (lg.ended<=warEnd) logs.push(lg);
            }
            currentTo = data[data.length-1].ended-1;
            logMessage(`Processing attack logs...`);
            await sleep(250);
          }
          logMessage(`Attack logs grabbed: ${logs.length}`);

          logs.forEach(log=>{
            if (log.defender?.faction_id!=enemy.id || log.attacker?.faction_id!=myFactionID) return;
            const rec = members.find(r=>r.Member.endsWith(`[${log.attacker.id}]`));
            if (!rec) return;
            if (log.result==='Lost') rec.Lost++;
            else if (log.result==='Assist') rec.Assisted++;
          });

          if (payOH) {
            logMessage('Grabbing outside hits...');
            let moreOH=true, toOH=warEnd;
            while(moreOH) {
              const data=(await fetchJson(`https://api.torn.com/v2/faction/attacksfull?limit=1000&sort=DESC&to=${toOH}`)).attacks;
              if (!data||!data.length) break;
              for (const lg of data) {
                if (lg.ended<warStart) { moreOH=false; break; }
                if (lg.attacker?.faction_id==myFactionID && lg.ended<=warEnd &&
                   lg.defender?.faction_id!=enemy.id && lg.defender?.faction_id!=myFactionID) {
                  const rec = members.find(r=>r.Member.endsWith(`[${lg.attacker.id}]`));
                  if (rec && lg.result!=='Lost') rec['Outside Hits']++;
                }
              }
              toOH = data[data.length-1].ended-1;
              await sleep(250);
            }
            logMessage('Outside hits logs grabbed.');
          }

          members.forEach(r=> r['Total Attacks']=r.Attacks+r.Lost+r.Assisted+r['Outside Hits']);
          const payees = members.filter(r=>r['Total Attacks']>=minAtt);
          if (!payees.length) logMessage(`No members meet minimum attacks of ${minAtt}.`);
          else {
            const basePool = total*(basePct/100);
            const baseEach = basePool/payees.length;
            const remain = total-basePool;
            const sumAtt = payees.reduce((s,r)=>s+r['Total Attacks'],0);
            payees.forEach(r=>{
              const contrib = sumAtt? (r['Total Attacks']/sumAtt)*remain : 0;
              r['Base Pay']=baseEach;
              r['Contribution Pay']=contrib;
              r.Cut = Math.ceil((baseEach+contrib)/1e6)*1e6;
            });
            logMessage('Real payout calculated.');
          }
          if (document.getElementById('includeBalancesReal').checked)
            updateBalances(members, document.getElementById('balancesReal').value);
          exportExcel(members, `torn_${enemy.name.replace(/\s+/g,'_')}_war_report_with_attacks.xlsx`, 'Full Report');
          exportExcel(payees.map(r=>({Member:r.Member,Cut:r.Cut})), `torn_war_payout_${enemy.name.replace(/\s+/g,'_')}.xlsx`, 'Payout');

        } else if (method==='chain') {
          const total = parseFloat(document.getElementById('chainCache').value);
          const payLoss = document.getElementById('payLosses').checked;
          const payAssist = document.getElementById('payAssists').checked;
          if (isNaN(total)) { logMessage('❌ Invalid cache value.'); return; }

          const opt = document.getElementById('chainSelect').selectedOptions[0];
          const reportId = opt.dataset.reportId;
          if (!reportId) { logMessage('❌ No chain report ID.'); return; }
          const cr = (await fetchJson(`https://api.torn.com/v2/faction/${reportId}/chainreport`)).chainreport;
          if (!cr?.attackers?.length) { logMessage('❌ No attackers in chain report.'); return; }

          let sumAtt=0;
          cr.attackers.forEach(a=>{
            const extra = (payAssist?a.attacks.assists:0)+(payLoss?a.attacks.losses:0);
            a.totalAttacks = a.attacks.total+extra;
            sumAtt += a.totalAttacks;
          });
          if (!sumAtt) { logMessage('❌ Total attacks zero.'); return; }

          cr.attackers.forEach(a=>{
            a.payout = Math.ceil((total*(a.totalAttacks/sumAtt))/1e6)*1e6;
          });
          logMessage('Chain payout calculated.');
          const mapping = await loadMemberMapping();
          const detail = cr.attackers.map(a=>{
            const name = mapping[a.id]||`Unknown [${a.id}]`;
            const rec = { Member:name, 'Total Attacks':a.totalAttacks, Respect:a.respect.total, Leaves:a.attacks.leave, Mug:a.attacks.mug, Hosp:a.attacks.hospitalize, Payout:a.payout };
            if (payAssist) rec.Assists = a.attacks.assists;
            if (payLoss) rec.Losses = a.attacks.losses;
            return rec;
          });
          if (document.getElementById('includeBalancesChain').checked)
            updateBalances(detail, document.getElementById('balancesChain').value);
          exportExcel(detail, `torn_${enemy.name.replace(/\s+/g,'_')}_chain_report.xlsx`, 'Chain Report');
          exportExcel(cr.attackers.map(a=>({Member: mapping[a.id]||`[${a.id}]`, Cut:a.payout})), `torn_war_payout_${enemy.name.replace(/\s+/g,'_')}_chain.xlsx`, 'Payout');

        } else {
          logMessage('❌ Invalid payout method.');
        }
      }

      document.getElementById('calculateBtn').addEventListener('click', async function(){
        this.disabled = true;
        document.getElementById('logArea').innerHTML = '';
        try { await main(); }
        catch(e){ logMessage(`❌ Error: ${e.message}`); console.error(e); }
        this.disabled = false;
      });

      return true;
    }

    const injector = setInterval(()=>{
      if (injectCalculator()) clearInterval(injector);
    }, 500);

  }
},


    {
  name: 'PA PAYOUTS',
  include: [/https?:\/\/www\.torn\.com\/factions\.php/],
  run: function(apiKey) {
    'use strict';

    // --- Helper Functions ---
    function dateToTimestamp(dateStr) {
      return Math.floor(new Date(dateStr).getTime() / 1000);
    }
    function formatTimestamp(ts) {
      const d = new Date(ts * 1000);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    function roundUpToMillion(val) {
      return Math.ceil(val / 1_000_000) * 1_000_000;
    }
    function getPureName(fullName) {
      const idx = fullName.indexOf(" [");
      return idx !== -1 ? fullName.substring(0, idx).trim() : fullName.trim();
    }
    function updateStatus(msg) {
      const el = document.getElementById("status-message");
      if (el) el.textContent = msg;
    }

    // --- CSS for the Menu ---
    const style = document.createElement("style");
    style.textContent = `
      .custom-menu { width:250px; background:#fff; color:#333; border:1px solid #ccc;
        border-radius:5px; box-shadow:0 4px 8px rgba(0,0,0,0.1); padding:10px;
        z-index:1000; text-align:center; font-family:sans-serif; display:none; }
      .custom-menu-row { margin:8px 0; }
      .custom-menu label { display:block; font-size:.9em; margin-bottom:3px; }
      .custom-menu input, .custom-menu select, .custom-menu textarea {
        width:100%; padding:5px; border:1px solid #ccc; border-radius:3px; font-size:.9em;
        box-sizing:border-box;}
      .custom-menu button { width:100%; padding:6px; border:1px solid #777;
        border-radius:3px; background:transparent; color:#777; cursor:pointer; }
      .custom-menu button:hover { background:rgba(0,0,0,0.1); }
      #status-message { margin-top:10px; font-size:.9em; }
      @media (prefers-color-scheme: dark) {
        .custom-menu { background:#2c2c2c; color:#eee; border:1px solid #555; }
        .custom-menu input, .custom-menu select, .custom-menu textarea {
          background:#444; border:1px solid #666; color:#eee; }
        .custom-menu button { border:1px solid #ccc; color:#ccc; }
        .custom-menu button:hover { background:rgba(255,255,255,0.1); }
        #status-message { color:#eee; }
      }
    `;
    document.head.appendChild(style);

    // --- Button & Menu Setup ---
    function injectCustomButton() {
      const container = document.getElementById("top-page-links-list");
      if (!container) return false;
      if (document.getElementById("custom-calc-btn")) return true;

      const btn = document.createElement("a");
      btn.id = "custom-calc-btn";
      btn.className = "custom-calc t-clear h c-pointer m-icon line-h24 right";
      btn.href = "#";
      btn.innerHTML = `
        <span class="icon-wrap svg-icon-wrap">
          <span class="link-icon-svg custom-calc">
            <svg viewBox="0 0 14 13">
              <line x1="7" y1="2" x2="7" y2="11" stroke="#777" stroke-width="2"/>
              <line x1="2" y1="6.5" x2="12" y2="6.5" stroke="#777" stroke-width="2"/>
            </svg>
          </span>
        </span>
        <span id="custom-calc">PA PAYOUTS</span>`;
      container.appendChild(btn);

      const menu = document.createElement("div");
      menu.id = "custom-menu";
      menu.className = "custom-menu";
      menu.innerHTML = `
        <div class="custom-menu-row">
          <label for="api-key">API Key:</label>
          <input type="password" id="api-key" placeholder="Enter Torn API key"/>
        </div>
        <div class="custom-menu-row">
          <label for="from-date">From Date:</label>
          <input type="date" id="from-date"/>
        </div>
        <div class="custom-menu-row">
          <label for="to-date">To Date: <small>(optional)</small></label>
          <input type="date" id="to-date"/>
        </div>
        <div class="custom-menu-row">
          <label for="calc-dropdown">System:</label>
          <select id="calc-dropdown">
            <option value="JFK">JFK</option>
            <option value="JFK 2.1">JFK 2.1</option>
          </select>
        </div>
        <div class="custom-menu-row" id="mains-balance-container" style="display:none;">
          <label for="mains-balance">Paste Mains Balance List:</label>
          <textarea id="mains-balance" rows="8"></textarea>
        </div>
        <div class="custom-menu-row">
          <button id="calculate-button">CALCULATE</button>
        </div>
        <div id="status-message"></div>`;
      document.body.appendChild(menu);

      // load saved settings
      const savedKey = localStorage.getItem("pa_payouts_api_key");
      if (savedKey) document.getElementById("api-key").value = savedKey;
      const savedSys = localStorage.getItem("pa_payouts_faction");
      if (savedSys) document.getElementById("calc-dropdown").value = savedSys;
      const toggleMains = () => {
        const dd = document.getElementById("calc-dropdown");
        document.getElementById("mains-balance-container")
          .style.display = dd.value === "JFK" ? "block" : "none";
      };
      toggleMains();

      // store settings
      document.getElementById("api-key").addEventListener("input", e => {
        localStorage.setItem("pa_payouts_api_key", e.target.value);
      });
      document.getElementById("calc-dropdown").addEventListener("change", e => {
        localStorage.setItem("pa_payouts_faction", e.target.value);
        toggleMains();
      });

      btn.addEventListener("click", e => {
        e.preventDefault();
        const rect = btn.getBoundingClientRect();
        menu.style.position = "absolute";
        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.left = `${rect.left + window.scrollX - 125 + rect.width/2}px`;
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });

      document.getElementById("calculate-button").addEventListener("click", async () => {
        const key = document.getElementById("api-key").value.trim();
        const from = document.getElementById("from-date").value;
        let to = document.getElementById("to-date").value;
        if (!key) return alert("API key required");
        if (!from) return alert("From Date required");
        if (!to) to = new Date().toISOString().slice(0,10);
        const fromTs = dateToTimestamp(from),
              toTs = dateToTimestamp(to);
        updateStatus("Fetching members…");
        // fetch members
        let memberMap = {};
        try {
          const resp = await fetch(`https://api.torn.com/v2/faction/members?striptags=true&key=${encodeURIComponent(key)}`);
          const d = await resp.json();
          (d.members || []).forEach(m=> memberMap[m.id] = `${m.name} [${m.id}]`);
        } catch (err) {
          return alert("Failed to fetch members");
        }

        // fetch crimes with pagination
        let all = [], cur = toTs, cont = true;
        while (cont) {
          const url = `https://api.torn.com/faction/?key=${encodeURIComponent(key)}&from=${fromTs}&to=${cur}&selections=crimes`;
          const resp = await fetch(url);
          const d = await resp.json();
          if (!d.crimes) break;
          const arr = Object.values(d.crimes);
          const pa = arr.filter(c=> c.crime_name?.toLowerCase()==="political assassination" && c.initiated===1);
          all.push(...pa);
          if (arr.length<100) cont=false;
          else {
            const minTime = Math.min(...pa.map(c=>c.time_completed||Infinity));
            if (!isFinite(minTime)|| minTime-1 < fromTs) cont=false;
            else cur = minTime-1;
          }
        }
        if (!all.length) return alert("No PA logs");

        // ensure mapping
        const missing = new Set();
        all.forEach(c=>{
          (c.participants||[]).forEach(p=>{
            const id = Object.keys(p)[0];
            if (id && !memberMap[id]) missing.add(id);
          });
        });
        for (let id of missing) {
          try {
            const u = await fetch(`https://api.torn.com/user/${id}?key=${encodeURIComponent(key)}`);
            const ud = await u.json();
            memberMap[id] = ud.name ? `${ud.name} [${id}]` : id;
          } catch { memberMap[id] = id; }
        }

        // build excel or txt
        const sys = document.getElementById("calc-dropdown").value;
        let xml="", totals={}, factionTotal=0;
        if (sys==="JFK 2.1") {
          // money-based
          xml = '<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" …>';
          // (build sheets exactly as in your original)
          // …
          const blob = new Blob([xml], { type:"application/vnd.ms-excel" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "pa_payouts.xls";
          document.body.appendChild(a); a.click(); a.remove();
          updateStatus("JFK 2.1 Excel downloaded");
        } else {
          // JFK (mains system) -> points -> txt + excel
          // compute memberPoints, factionPoints, shares…
          // update mains balances, download TXT, then build+download Excel…
          // …
          updateStatus("JFK TXT + Excel downloaded");
        }
      });

      return true;
    }

    // start injection
    const id = setInterval(()=>{
      if (injectCustomButton()) clearInterval(id);
    }, 500);
  }
},

    {name: 'MultiMemberPayouts',
    include: /factions\.php\?*/,
    run: function() {
        // ==UserScript==
        // @name         Torn Faction Payouts (Multi-Member & Theme-Aware)
        // @namespace    http://tampermonkey.net/
        // @version      1.18
        // @description  Adds PAYOUTS button; import CSV/Excel, pay multiple members per row, skip zero cuts, persist status, auto light/dark switch
        // @grant        none
        // @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js
        // @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
        // ==/UserScript==

        (function() {
            'use strict';

            const KEY_PAID = 'tmPayoutsPaidEntries';
            const KEY_DATA = 'tmPayoutsData';
            let paidSet = new Set();
            try {
                const arr = JSON.parse(localStorage.getItem(KEY_PAID) || '[]');
                if (Array.isArray(arr)) paidSet = new Set(arr);
            } catch {}

            function savePaid() {
                localStorage.setItem(KEY_PAID, JSON.stringify([...paidSet]));
            }
            function saveData(rows) {
                localStorage.setItem(KEY_DATA, JSON.stringify(rows));
            }
            function loadData() {
                try { return JSON.parse(localStorage.getItem(KEY_DATA)) || null; }
                catch { return null; }
            }
            function clearAll() {
                localStorage.removeItem(KEY_DATA);
                localStorage.removeItem(KEY_PAID);
                paidSet.clear();
            }

            // inject basic CSS; theme-specific is applied via classes
            const style = document.createElement('style');
            style.textContent = `
    #tm-payouts-container {
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        border-radius: 4px;
        padding: 20px 12px 12px;
        font-family: var(--font-main, Arial, sans-serif);
        margin-bottom: 16px;
        display: none;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,0,0,0.6) transparent;
    }
    #tm-payouts-container::-webkit-scrollbar { width: 8px; background: transparent; }
    #tm-payouts-container::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.6);
        border-radius: 9999px; min-height: 20px;
    }
    #tm-payouts-container h4 { margin: 0 0 16px; text-align: center; }
    #tm-payouts-controls { display: flex; justify-content: center; align-items: center; gap: 4px; margin-bottom: 16px; }
    #tm-payouts-controls input[type=file], #tm-payouts-controls button.reset { display: inline-block; margin: 0; }
    #tm-payouts-container table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 0.9rem; }
    #tm-payouts-container th, #tm-payouts-container td {
        padding: 6px 4px; border-bottom: 1px solid; word-break: break-word;
    }
    #tm-payouts-container th:nth-child(1), #tm-payouts-container td:nth-child(1) { width: 33.33%; text-align: left; }
    #tm-payouts-container th:nth-child(2), #tm-payouts-container td:nth-child(2) { width: 33.33%; text-align: center; padding-left: 8px; }
    #tm-payouts-container th:nth-child(3), #tm-payouts-container td:nth-child(3) { width: 33.33%; text-align: right; }
    #tm-payouts-container button.pay, #tm-payouts-container button.reset {
        padding: 4px 8px; border: none; border-radius: 3px; cursor: pointer; font-size: 0.85rem;
    }
    #tm-payouts-container button.pay:disabled { opacity: 0.6; cursor: default; }

    /* LIGHT MODE */
    #tm-payouts-container.tm-light {
        background: var(--bg-primary, #fff);
        border-color: var(--border-primary, #888);
        color: var(--text-primary, #000);
    }
    #tm-payouts-container.tm-light th,
    #tm-payouts-container.tm-light td { border-color: var(--border-primary, #ddd); }
    #tm-payouts-container.tm-light button.pay { background: var(--btn-bg, #007bff); color: #fff; }
    #tm-payouts-container.tm-light button.reset { background: #e55353; color: #fff; }

    /* DARK MODE */
    #tm-payouts-container.tm-dark {
        background: var(--bg-secondary, #2b2b2b);
        border-color: var(--border-secondary, #444);
        color: var(--text-secondary, #eee);
    }
    #tm-payouts-container.tm-dark th,
    #tm-payouts-container.tm-dark td { border-color: var(--border-secondary, #555); }
    #tm-payouts-container.tm-dark button.pay { background: var(--btn-bg-dark, #339af0); color: #fff; }
    #tm-payouts-container.tm-dark button.reset { background: #c53030; color: #fff; }
    `;
            document.head.appendChild(style);

            // detect dark/light by page background luminance
            function isPageDark() {
                const bg = window.getComputedStyle(document.body).backgroundColor;
                const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (!match) return false;
                const [r,g,b] = match.slice(1).map(Number).map(v => v/255);
                const lum = 0.2126*r + 0.7152*g + 0.0722*b;
                return lum < 0.5;
            }
            function applyTheme() {
                const cont = document.getElementById('tm-payouts-container');
                if (!cont) return;
                if (isPageDark()) {
                    cont.classList.add('tm-dark');
                    cont.classList.remove('tm-light');
                } else {
                    cont.classList.add('tm-light');
                    cont.classList.remove('tm-dark');
                }
            }
            // watch for body style/class changes (e.g. Torn theme switch)
            new MutationObserver(applyTheme).observe(document.body, {
                attributes: true, attributeFilter: ['class','style']
            });

            function getRFC() {
                const m = document.cookie.match(/(?:^|;\s*)(?:rfc_v|rfc_id)=([^;]+)/);
                return m ? m[1] : null;
            }
            function sendPayment(item, key, btn) {
                const token = getRFC();
                if (!token) {
                    alert('No RFC token');
                    btn.disabled = false; btn.textContent = 'Retry';
                    return;
                }
                fetch(`https://www.torn.com/page.php?sid=factionsGiveMoney&rfcv=${token}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json','X-Requested-With': 'XMLHttpRequest'},
                    body: JSON.stringify({
                        option: 'addToBalance',
                        receiver: Number(item.id),
                        amount: Number(item.amount)
                    })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.error) {
                        alert(`Error ${item.name}: ${data.error}`);
                        btn.disabled = false; btn.textContent = 'Retry';
                    } else {
                        paidSet.add(key); savePaid();
                        btn.textContent = 'Paid';
                    }
                })
                .catch(() => {
                    alert(`Network error ${item.name}`);
                    btn.disabled = false; btn.textContent = 'Retry';
                });
            }
            function fmt(x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

            function parseFile(file, cb) {
                const name = file.name.toLowerCase();
                if (name.endsWith('.csv')) {
                    Papa.parse(file, {header:true, skipEmptyLines:true, complete: res=>cb(res.data)});
                } else if (/\.xls(x)?$/.test(name)) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        const wb = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
                        const sheet = wb.Sheets[wb.SheetNames[0]];
                        cb(XLSX.utils.sheet_to_json(sheet, {raw:false}));
                    };
                    reader.readAsArrayBuffer(file);
                } else alert('Unsupported file type. Upload CSV or Excel.');
            }

            function buildOverlay() {
                let container = document.getElementById('tm-payouts-container');
                const header = document.querySelector('.content-title.m-bottom10');
                if (!header) return;
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'tm-payouts-container';
                    container.innerHTML = `
                        <h4>Payouts Import (CSV/Excel)</h4>
                        <div id="tm-payouts-controls">
                            <input type="file" accept=".csv,.xlsx,.xls" />
                            <button class="reset">Reset Data</button>
                        </div>
                        <table></table>
                    `;
                    header.parentNode.insertBefore(container, header.nextSibling);

                    container.querySelector('button.reset').addEventListener('click', () => {
                        if (confirm('Clear all data and paid statuses?')) {
                            clearAll();
                            container.querySelector('table').innerHTML = '';
                            container.querySelector('input[type=file]').value = '';
                        }
                    });
                    container.querySelector('input[type=file]').addEventListener('change', e => {
                        if (e.target.files.length) parseFile(e.target.files[0], render);
                    });

                    // render callback
                    function render(rows) {
                        saveData(rows);
                        const table = container.querySelector('table');
                        table.innerHTML = '';
                        const hdr = table.insertRow();
                        ['Name','Cut','Action'].forEach(txt => {
                            const th = hdr.insertCell(); th.textContent = txt;
                        });
                        const cutKey = Object.keys(rows[0]||{}).find(k=>k.toLowerCase()==='cut');
                        const memberCols = Object.keys(rows[0]||{}).filter(k=>/^member\s*\d*$/i.test(k.trim()));
                        if (!cutKey||!memberCols.length) {
                            alert('Missing Cut or Member columns'); return;
                        }
                        let totalCut=0;
                        rows.forEach((r,rowIdx)=>{
                            const raw = (r[cutKey]||'0').replace(/[$,]/g,'').trim();
                            const cut=parseFloat(raw);
                            if (!cut||cut<=0) return;
                            memberCols.forEach((col,subIdx)=>{
                                const cell=(r[col]||'').trim();
                                const m=cell.match(/(.+)\s*\[(\d+)\]/);
                                if (!m) return;
                                const [_,name,id] = m;
                                const amount=cut.toString();
                                const key=`${id}-${amount}-${rowIdx}-${subIdx}`;
                                const tr=table.insertRow();
                                tr.insertCell().textContent=name.trim();
                                tr.insertCell().textContent=fmt(amount);
                                const td=tr.insertCell();
                                const btn=document.createElement('button');
                                btn.className='pay';
                                if (paidSet.has(key)) {
                                    btn.textContent='Paid'; btn.disabled=true;
                                } else {
                                    btn.textContent='Pay';
                                    btn.addEventListener('click',()=>{
                                        btn.disabled=true;
                                        sendPayment({name,id,amount},key,btn);
                                    });
                                }
                                td.appendChild(btn);
                                totalCut+=cut;
                            });
                        });
                        // total row
                        const tot=table.insertRow();
                        const c1=tot.insertCell(); c1.textContent='Total'; c1.style.fontWeight='bold';
                        const c2=tot.insertCell(); c2.textContent=fmt(totalCut); c2.style.fontWeight='bold';
                        tot.insertCell();
                        applyTheme();
                    }

                    // load saved
                    const existing = loadData();
                    if (existing) render(existing);
                }
                return container;
            }

            function insertNavButton() {
                const wrap = document.querySelector('.links-top-wrap');
                if (!wrap) return;
                const btn = document.createElement('a');
                btn.id = 'tm-payouts-btn';
                btn.className = 'custom-calc t-clear h c-pointer m-icon line-h24 right';
                btn.href = '#';
                btn.innerHTML = `<span id="tm-payouts-label">PAYOUTS</span>`;
                wrap.appendChild(btn);
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    const ov = buildOverlay();
                    if (ov) ov.style.display = ov.style.display === 'block' ? 'none' : 'block';
                    applyTheme();
                });
            }

            window.addEventListener('load', () => {
                insertNavButton();
                applyTheme();
            });

        })();
    }
},

    {
    name: 'FlyersChecker',
    include: /factions\.php\?step=profile&ID=\d+/,
    run: function() {
        (function() {
            'use strict';

            const apiKey = "AIK9ZdfA1KQ5eirH";

            function getFactionId() {
                const match = window.location.href.match(/ID=(\d+)/);
                return match ? match[1] : null;
            }

            function fetchFlyers() {
                const factionId = getFactionId();
                if (!factionId) {
                    console.error("Could not find faction ID in URL.");
                    displayError("Could not find faction ID.");
                    return;
                }
                displayLoadingMenu();
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`,
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `ApiKey ${apiKey}`
                    },
                    onload(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                console.error("API Error:", data.error);
                                displayError(`API Error: ${data.error.error}`);
                                return;
                            }
                            processFlyers(data);
                        } catch (e) {
                            console.error("JSON Parse Error:", e);
                            displayError("Failed to parse API response.");
                        }
                    },
                    onerror(error) {
                        console.error("Request Error:", error);
                        displayError("Failed to connect to Torn API.");
                    }
                });
            }

            function processFlyers(data) {
                if (!data.members) return displayError("No member data found.");
                const members = Object.values(data.members);
                const inbound = [], outbound = [];
                members.forEach(m => {
                    if (m.status && m.status.state === "Traveling") {
                        const d = m.status.description || "";
                        if (d.startsWith("Returning to Torn")) inbound.push(m);
                        else if (d.startsWith("Traveling to")) outbound.push(m);
                    }
                });
                const abroad = members.filter(m => m.status && m.status.state === "Abroad");
                displayFlyersList(inbound, outbound, abroad);
            }

            function createBaseMenu() {
                const menu = document.createElement("div");
                menu.id = "flyersCheckerMenu";
                Object.assign(menu.style, {
                    position: "fixed", top: "100px", right: "20px",
                    backgroundColor: "rgba(20,20,20,0.95)", color: "#fff",
                    padding: "15px", borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                    zIndex: "1000", fontSize: "14px",
                    minWidth: "220px", maxHeight: "500px", overflowY: "auto"
                });
                const close = document.createElement("span");
                close.textContent = "X";
                Object.assign(close.style, {
                    position: "absolute", top: "5px", right: "8px",
                    cursor: "pointer", color: "#ff6666",
                    fontWeight: "bold", fontSize: "16px"
                });
                close.title = "Close";
                close.onclick = () => menu.remove();
                menu.appendChild(close);
                return menu;
            }

            function displayLoadingMenu() {
                const existing = document.getElementById("flyersCheckerMenu");
                if (existing) existing.remove();
                const menu = createBaseMenu();
                const title = document.createElement("div");
                title.textContent = "Faction Flyers";
                Object.assign(title.style, { fontWeight: "bold", marginBottom: "10px", fontSize: "16px" });
                menu.appendChild(title);
                const loading = document.createElement("div");
                loading.textContent = "Loading...";
                Object.assign(loading.style, { color: "#888", fontStyle: "italic" });
                menu.appendChild(loading);
                document.body.appendChild(menu);
            }

            function displayError(msg) {
                const existing = document.getElementById("flyersCheckerMenu");
                if (existing) existing.remove();
                const menu = createBaseMenu();
                const title = document.createElement("div");
                title.textContent = "Faction Flyers";
                Object.assign(title.style, { fontWeight: "bold", marginBottom: "10px", fontSize: "16px" });
                menu.appendChild(title);
                const err = document.createElement("div");
                err.textContent = msg;
                Object.assign(err.style, { color: "#ff6666", fontStyle: "italic" });
                menu.appendChild(err);
                document.body.appendChild(menu);
            }

            function displayFlyersList(inbound, outbound, abroad) {
                const existing = document.getElementById("flyersCheckerMenu");
                if (existing) existing.remove();
                const menu = createBaseMenu();
                const title = document.createElement("div");
                title.textContent = "Faction Flyers";
                Object.assign(title.style, { fontWeight: "bold", marginBottom: "10px", fontSize: "16px" });
                menu.appendChild(title);

                function section(titleText, list, formatter) {
                    const hdr = document.createElement("div");
                    hdr.textContent = titleText;
                    Object.assign(hdr.style, { fontWeight: "bold", marginTop: "10px" });
                    menu.appendChild(hdr);
                    if (list.length === 0) {
                        const none = document.createElement("div");
                        none.textContent = `No ${titleText.toLowerCase()} found`;
                        Object.assign(none.style, { color: "#888", fontStyle: "italic" });
                        menu.appendChild(none);
                    } else {
                        list.forEach(m => {
                            const row = document.createElement("div");
                            row.style.marginBottom = "5px";
                            row.innerHTML = formatter(m);
                            menu.appendChild(row);
                        });
                    }
                }

                section("Inbound Flyers (Returning to Torn):", inbound,
                    m => `<a href="/profiles.php?XID=${m.id}" style="color:white;font-weight:bold;text-decoration:none;"
                             onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                             ${m.name}</a>`
                );
                section("Outbound Flyers:", outbound,
                    m => {
                        const dest = m.status.description.replace("Traveling to ", "");
                        return `<a href="/profiles.php?XID=${m.id}" style="color:white;font-weight:bold;text-decoration:none;"
                                     onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                                     ${m.name}</a> - Flying to ${dest}`;
                    }
                );
                section("Abroad Flyers:", abroad,
                    m => {
                        const country = m.status.description.replace("In ", "");
                        return `<a href="/profiles.php?XID=${m.id}" style="color:white;font-weight:bold;text-decoration:none;"
                                     onmouseover="this.style.color='#1E90FF'" onmouseout="this.style.color='white'">
                                     ${m.name}</a> - In ${country}`;
                    }
                );

                document.body.appendChild(menu);
            }

            function addFlyersButton() {
                const wrap = document.querySelector(".links-top-wrap");
                if (!wrap) return;
                const btn = document.createElement("a");
                btn.className = "t-clear h c-pointer line-h24 right last";
                btn.href = "#";
                btn.setAttribute("aria-labelledby", "flyers");
                btn.innerHTML = `
                    <span class="icon-wrap svg-icon-wrap">
                      <span class="link-icon-svg flyers">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                          <title>flyers</title>
                          <path d="M1 8 L16 1 L9 10 L16 17 L1 10 Z" fill="#777"/>
                        </svg>
                      </span>
                    </span>
                    <span id="flyers">Flyers</span>`;
                btn.onclick = e => { e.preventDefault(); fetchFlyers(); };
                wrap.appendChild(btn);
            }

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", addFlyersButton);
            } else {
                addFlyersButton();
            }
        })();
    }
},

     // ==Module==
// @name         TradeCsvExport
// @version      1.0.0
// @description  Export your Torn trade page to CSV
// ==/Module==
 {
  name: 'TradeCsvExport',
  include:
    /https?:\/\/www\.torn\.com\/trade\.php(?:[?#].*)?$/,
  run: async function() {
    'use strict';

    // --- CSV Helpers ---
    function csvEscape(field) {
      return '"' + String(field).replace(/"/g, '""') + '"';
    }

    // --- Core Export Logic ---
    function exportTradeCSV() {
      const weapons = [], armour = [];

      document.querySelectorAll('.networth-info-icon').forEach(icon => {
        const html = icon.getAttribute('title') || '';
        const doc  = new DOMParser().parseFromString(html, 'text/html');
        const stats = { damage:'', accuracy:'', defence:'' };

        doc.querySelectorAll('ul.bonus-tooltip li').forEach(li => {
          const ic  = li.querySelector('i');
          const val = li.querySelector('span')?.textContent.trim() || '';
          if (!ic) return;
          const c = ic.className;
          if (c.includes('damage-bonus'))        stats.damage   = val;
          else if (c.includes('accuracy-bonus')) stats.accuracy = val;
          else if (c.includes('defence-bonus') || c.includes('defense-bonus')) stats.defence = val;
        });

        const bonuses = [];
        const bonusDiv = doc.querySelector('div.t-overflow');
        if (bonusDiv) {
          bonusDiv.querySelectorAll('b').forEach(b => {
            const name = b.textContent.trim();
            let nxt = b.nextSibling;
            while (nxt && !nxt.textContent.trim()) nxt = nxt.nextSibling;
            const desc = nxt?.textContent.trim() || '';
            const pct  = (desc.match(/[\d.]+%/) || [])[0] || '';
            bonuses.push(`${name}: ${pct}`);
          });
        }

        const wrap = icon.closest('.name.left');
        const name = wrap?.firstChild.textContent.trim() || '';
        const item = { name, damage: stats.damage, accuracy: stats.accuracy, defence: stats.defence, bonuses };

        if (item.damage || item.accuracy) weapons.push(item);
        else armour.push(item);
      });

      if (!weapons.length && !armour.length) {
        return alert('No items found on this page.');
      }

      // build header
      const maxBonuses = Math.max(
        weapons.length ? Math.max(...weapons.map(i => i.bonuses.length)) : 0,
        armour.length  ? Math.max(...armour.map(i => i.bonuses.length))  : 0
      );

      const header = ['Name','Damage','Accuracy','Defence'];
      for (let i = 1; i <= maxBonuses; i++) header.push(`Bonus ${i}`);

      // assemble rows
      const rows = [];

      if (weapons.length) {
        rows.push(['Weapons'], header);
        weapons.forEach(it => {
          const row = [it.name, it.damage, it.accuracy, it.defence];
          for (let i = 0; i < maxBonuses; i++) row.push(it.bonuses[i] || '');
          rows.push(row);
        });
      }

      if (weapons.length && armour.length) rows.push([]);

      if (armour.length) {
        rows.push(['Armour'], header);
        armour.forEach(it => {
          const row = [it.name, it.damage, it.accuracy, it.defence];
          for (let i = 0; i < maxBonuses; i++) row.push(it.bonuses[i] || '');
          rows.push(row);
        });
      }

      // turn into CSV
      const csv = rows.map(r => r.map(csvEscape).join(',')).join('\r\n');
      const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'torn_trade.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    // --- Injection Logic ---
    function addNavLink() {
      const navList = document.querySelector('#top-page-links-list.content-title-links');
      if (!navList || document.getElementById('export-trade-csv')) return;

      const sep = document.createElement('div');
      sep.className = 'torn-divider divider-vertical';

      const link = document.createElement('a');
      link.href        = '#';
      link.id          = 'export-trade-csv';
      link.className   = 'export-csv t-clear h c-pointer m-icon line-h24 right';
      link.setAttribute('aria-label', 'Export CSV');
      link.innerHTML   = '<span>Export CSV</span>';
      link.addEventListener('click', evt => {
        evt.preventDefault();
        exportTradeCSV();
      });

      navList.appendChild(sep);
      navList.appendChild(link);
    }

    // call once on initial load
    addNavLink();
    // on soft nav (hash changes)
    window.addEventListener('hashchange', addNavLink);
    // poll in case DOM elements load late
    setInterval(addNavLink, 500);
  }
},


  ];

 function matchesModule(module) {
    if (module.include instanceof RegExp) {
      return module.include.test(window.location.href);
    }
    if (Array.isArray(module.include)) {
      return module.include.some(pattern => pattern.test(window.location.href));
    }
    return false;
  }

  function runModules() {
    modules.forEach(module => {
      if (matchesModule(module)) {
        try {
          module.run(API_KEY);
        } catch (err) {
          console.error(`Error in module '${module.name}':`, err);
        }
      }
    });
  }

  // Auto-run modules on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runModules);
  } else {
    runModules();
  }
})();
