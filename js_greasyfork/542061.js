// ==UserScript==
// @name         War TRAVEL & HOSP Time v2
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Calculate War TRAVEL & HOSP Time via API CALL
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/factions.php?*
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542061/War%20TRAVEL%20%20HOSP%20Time%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/542061/War%20TRAVEL%20%20HOSP%20Time%20v2.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // ══ CONFIG ═══════════════════════════════════════════
  const API_KEY         = "emsXLP3l5aKtIxRZ";
  const webhookURL      = 'https://script.google.com/macros/s/AKfycbxNdlMmHDsYKIy1rGVcKJ4whyxnaDBfRyUQ788vYgS1oVvdzPA6LpFjkQD7up5k9DIL/exec';
  const travelFormUrl   = 'https://docs.google.com/forms/d/e/1FAIpQLSem3aeYieuPIkrsNXi8Xn7d3x2xpVbzu2VfJ90NZmkNHTSTWA/formResponse';
  const travelEntryUser = 'entry.746984526';
  const travelEntryTime = 'entry.2072245335';
  const bloodFormUrl    = 'https://docs.google.com/forms/d/e/1FAIpQLScnhO-hTC448l9yUohqL0ImOYwxz-QCNB7C3Ooyr4nK6JHmwg/formResponse';
  const bloodEntryDesc  = 'entry.868245197';
  const bloodEntryCount = 'entry.1727094762';

  // map id → bloodtype
  const playerBloodtypes = {
    "3582720":"O+",
    "3582789":"A+",
    "3580072":"O+",
    "3582798":"B+",
    "3595496":"A+",
    "3582748":"A+",
    "3578197":"A+",
    "3591483":"AB+",
    "2549400":"O-",
    "2357237":"A+", //batesy
    "2697819":"B+", //cropper
    "2342729":"A+", //corvo420
    "3284051":"B+" //duke
  };
  // incompatibilități
  const incompatible = {
    "A+": ["B+","AB+","B-","AB-"],
    "O+": ["A+","B+","AB+","A-","B-","AB-"],
    "B+": ["A+","AB+","A-","AB-"],
    "AB+": [],
    "A-": ["B+","AB+","B-","AB-","A+","AB+"],
    "O-": ["A+","B+","AB+","A-","B-","AB-","O+"],
    "B-": ["A+","AB+","A-","AB-","B+","AB+"],
    "AB-":["A+","B+","AB+","O+","AB+"]
  };

  let members = {};

  // ══ HELPERS ════════════════════════════════════════
  function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function formatTime(sec){
    const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
  function clearSheets(){
    return new Promise((res,rej)=>{
      GM_xmlhttpRequest({
        method:'GET',
        url: webhookURL,
        onload:  ()=>res(),
        onerror: ()=>rej()
      });
    });
  }
  function sendRecords(records, formUrl, entryName, entryTime){
    records.forEach(({name,time})=>{
      GM_xmlhttpRequest({
        method:'POST',
        url: formUrl,
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data:`${entryName}=${encodeURIComponent(name)}&${entryTime}=${encodeURIComponent(time)}`,
        onload:  ()=>console.log(`✅ Sent ${name} — ${time}`),
        onerror: ()=>console.error(`❌ Failed ${name}`)
      });
    });
  }

  // ══ API CALLS ══════════════════════════════════════
  async function loadFactionMembers(){
    const url = `https://api.torn.com/v2/faction/members?striptags=true&key=${API_KEY}`;
    const j = await fetch(url).then(r=>r.json());
    if(Array.isArray(j.members)){
      members = {};
      j.members.forEach(m=>members[m.id]=m.name);
      console.log('Members loaded', members);
    } else throw 'No members';
  }

  async function getTravelRecords(startTs, endTs){
    const recs=[];
    for(const [id,name] of Object.entries(members)){
      const before = await fetch(`https://api.torn.com/v2/user/${id}/personalstats?stat=timespenttraveling&timestamp=${startTs}&key=${API_KEY}`)
                       .then(r=>r.json()).then(j=>j.personalstats?.[0]?.value||0);
      await delay(1000);
      const after  = await fetch(`https://api.torn.com/v2/user/${id}/personalstats?stat=timespenttraveling&timestamp=${endTs}&key=${API_KEY}`)
                       .then(r=>r.json()).then(j=>j.personalstats?.[0]?.value||0);
      const diff   = after - before;
      recs.push({name, time: formatTime(diff)});
    }
    return recs;
  }

    // -------------- Bloodbag + Syrup Collector --------------
    async function collectBloodEvents(start, end) {
        // inversăm members: name → id
        const nameToId = Object.fromEntries(
            Object.entries(members).map(([id,name]) => [name, id])
        );

        let from = start;
        const events = [];

        while (from < end) {
            const url = `https://api.torn.com/v2/faction/news?striptags=true&limit=100&sort=asc`
            + `&from=${from}&to=${end}&cat=armoryAction&key=${API_KEY}`;
            const resp = await fetch(url);
            const json = await resp.json();
            const news = json.news || [];
            if (!news.length) break;

            news.forEach(entry => {
                const t = entry.text || "";

                // 1) Blood Bag incompatibile
                let m = t.match(/^(.*?) used one of the faction's Blood Bag\s*:\s*(.*?) items$/);
                if (m) {
                    const [ , uname, usedType ] = m;
                    const id    = nameToId[uname];
                    const btype = playerBloodtypes[id];
                    if (id && incompatible[btype]?.includes(usedType.trim())) {
                        // descriere stil: SuperGogu[3580072] -O+ used B+
                        events.push(`${uname}[${id}] -${btype} used ${usedType.trim()}`);
                    }
                    return;  // trecem la următorul entry
                }

                // 2) Ipecac Syrup (toți le raportăm, nu filtrezi incompatibilități aici)
                m = t.match(/^(.*?) used one of the faction's Ipecac Syrup items$/);
                if (m) {
                    const uname = m[1];
                    const id    = nameToId[uname] || 'unknown';
                    events.push(`${uname}[${id}] used Ipecac Syrup`);
                }
            });

            // avansăm la următorul batch
            from = news[news.length - 1].timestamp + 1;
            await new Promise(r => setTimeout(r, 1000));
        }

        return events;
    }

  function aggregate(list){
    const cnt={};
    list.forEach(d=>cnt[d]=(cnt[d]||0)+1);
    return Object.entries(cnt).map(([n,c])=>({name:n,time:c}));
  }

    // ══ COORDONARE & UI ═══════════════════════════════
    async function getResults() {
        const btn    = document.getElementById('confirmBtn');
        const input  = document.getElementById('warIdInput');
        const status = document.getElementById('statusMessage');
        const warId  = input.value.trim();

        // Validare ID, dezactivare UI
        if (!/^\d+$/.test(warId)) {
            alert('Bad War ID');
            return;
        }
        btn.disabled    = true;
        input.disabled  = true;
        btn.textContent = 'Running…';
        status.textContent = '';

        try {
            // 1. Încarcă membrii
            status.textContent = 'Loading members…';
            await loadFactionMembers();

            // 2. Preia timestamp-urile războiului
            status.textContent = 'Fetching war timestamps…';
            const rep = await fetch(
                `https://api.torn.com/torn/${warId}` +
                `?selections=rankedwarreport&key=${API_KEY}`
            ).then(r => r.json());
            const startTs = rep.rankedwarreport.war.start;
            const endTs   = rep.rankedwarreport.war.end;
            status.textContent = `War ${warId}: ${startTs} → ${endTs}`;

            // 3. Colectează Travel Times
            status.textContent = 'Collecting Travel…';
            const travelRecs = await getTravelRecords(startTs, endTs);

            // 4. Colectează evenimente Bloodbag
            status.textContent = 'Collecting Bloodbags…';
            const bloodList = await collectBloodEvents(startTs, endTs);
            const bloodRecs = aggregate(bloodList);

            // 5. Șterge ambele foi
            status.textContent = 'Clearing sheets…';
            await clearSheets();

            // 6. Trimite Travel Times
            status.textContent = 'Sending Travel…';
            sendRecords(travelRecs, travelFormUrl, travelEntryUser, travelEntryTime);

            // 7. Trimite Bloodbag events
            status.textContent = 'Sending Bloodbags…';
            sendRecords(bloodRecs, bloodFormUrl, bloodEntryDesc, bloodEntryCount);

            // 8. Final
            status.textContent = '✅ All done!';
        }
        catch (e) {
            console.error(e);
            status.textContent = '❌ Error. Vezi consolă.';
        }
        finally {
            // Reactivare UI
            btn.disabled    = false;
            input.disabled  = false;
            btn.textContent = 'Confirm';
        }
    }

  // UI injection cu debug și fallback
  const waitForElement = (selector, callback, interval = 500, maxTries = 20) => {
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        console.log(`✅ Found element ${selector}`);
        callback(el);
      } else if (++tries >= maxTries) {
        clearInterval(timer);
        console.warn(`⚠️ Could not find ${selector} after ${tries} tries, falling back to body prepend`);
        callback(document.body);
      }
    }, interval);
  };

  waitForElement('#faction_war_list_id', (target) => {
    // Creează panoul
    const panel = document.createElement('div');
    panel.id = 'warPanel';
    panel.style.cssText = 'padding:8px;border:1px solid #888;margin:10px;background:#f5f5f5;';
    panel.innerHTML = `
      <input  id="warIdInput" placeholder="War ID" style="width:80px;margin-right:6px;padding:2px">
      <button id="confirmBtn" style="padding:2px 6px">Confirm</button>
      <span  id="statusMessage" style="margin-left:8px;color:#06c;font-style:italic"></span>
    `;

    // Dacă target este BODY (fallback), prepend normal
    if (target === document.body) {
      document.body.prepend(panel);
    } else {
      // Altfel inserăm după target
      target.parentNode.insertBefore(panel, target.nextSibling);
    }
    console.log('✅ War panel injected into:', target);

    // Atașăm handler-ul
    document.getElementById('confirmBtn').addEventListener('click', getResults);
  });

  // ————— restul funcțiilor: getResults(), loadFactionMembers(), etc. —————

})();