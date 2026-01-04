// ==UserScript==
// @name         Manarion Guild Contributions Logger
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Fetch guild contributions via Manarion public API (no UI clicking) and export totals. Sortable table, totals row, CSV export, and number-abbreviation toggle.
// @match        https://manarion.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545344/Manarion%20Guild%20Contributions%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/545344/Manarion%20Guild%20Contributions%20Logger.meta.js
// ==/UserScript==

/*
======= Changelog =======
2.2.0 — Abbreviated numbers + simpler report
 - New **Numbers** toggle: Abbrev (K/M/B/T) ↔ Raw (defaults to Abbrev)
 - Removed per-column filters; kept sorting and totals
 - CSV always exports **raw numbers** regardless of the view
 - Minor UI copy updates

2.1.0 — Map numeric contribution codes → labels
 - Maps API numeric keys to columns: 1→Mana Dust, 2→Elemental Shards, 3→Codex, 7→Fish, 8→Wood, 9→Iron, 42→Battle XP
 - Fix: CSV newlines, regex escape in TitleCase converter

2.0.5 — Preserve Member IDs + Raw JSON viewer
 - Keeps member IDs when `Members` is an object-map; adds **ID column** to table/CSV
 - Adds **Raw JSON** button to inspect response after fetch
 - Clear hint when contributions are missing from the payload
*/

(function(){
  'use strict';

  // =============== Config ===============
  const API_BASE = 'https://api.manarion.com';
  const STORAGE_KEY = 'mgl_api_v2';
  const contributionFields = ['Mana Dust','Elemental Shards','Codex','Fish','Wood','Iron','Battle XP'];
  const baseHeaders = ['ID','Name',...contributionFields];
  const codeMap = { '1':'Mana Dust','2':'Elemental Shards','3':'Codex','7':'Fish','8':'Wood','9':'Iron','42':'Battle XP' };

  // =============== State ===============
  const state = { apiKey:'', guildId:'', guilds:[], data:[], lastRaw:null, isRunning:false, showAbbrev:true };

  // =============== Storage ===============
  function loadPrefs(){ try{ const o=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); if(o&&typeof o==='object'){ if(o.apiKey) state.apiKey=o.apiKey; if(o.guildId) state.guildId=o.guildId; } }catch(_){} }
  function savePrefs(){ localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiKey: state.apiKey, guildId: state.guildId })); }
  loadPrefs();

  // =============== Helpers ===============
  function toCSV(rows){ if(!rows.length) return ''; const headers=baseHeaders; const q=v=>JSON.stringify(v==null?'':v); const lines=[headers.map(q).join(',')]; for(const r of rows){ lines.push(headers.map(h=>q(r[h]||'')).join(',')); } return lines.join('\n'); }
  function download(name, text, type='text/plain'){ const blob=new Blob([text],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
  function num(v){ const n=Number(String(v||'').replace(/,/g,'')); return Number.isFinite(n)?n:0; }
  function abbrev(n){ n=Number(n)||0; const a=Math.abs(n); if(a>=1e12) return (n/1e12).toFixed(2).replace(/\.00$/,'')+'T'; if(a>=1e9) return (n/1e9).toFixed(2).replace(/\.00$/,'')+'B'; if(a>=1e6) return (n/1e6).toFixed(2).replace(/\.00$/,'')+'M'; if(a>=1e3) return (n/1e3).toFixed(2).replace(/\.00$/,'')+'K'; return String(Math.trunc(n)); }

  // =============== API ===============
  async function apiGet(path){ const url=`${API_BASE}${path}`; const res=await fetch(url,{credentials:'omit',cache:'no-store',mode:'cors',referrerPolicy:'no-referrer'}); if(!res.ok){ const body=await res.text().catch(()=>'(no body)'); console.error('API error',{url,status:res.status,body}); throw new Error(`HTTP ${res.status} for ${path}`); } return res.json(); }
  async function fetchGuildList(){ const guilds=await apiGet('/guilds'); if(!Array.isArray(guilds)){ console.warn('Unexpected /guilds format', guilds); return []; } state.guilds=guilds; return guilds; }
  async function fetchGuildDetails(gid,key){ const path=`/guilds/${encodeURIComponent(gid)}?apikey=${encodeURIComponent(key)}`; return apiGet(path); }

  // =============== Normalization ===============
  function valueByLabel(obj, label){ if(!obj) return ''; const variants=[label,label.replace(/ /g,'_'),label.replace(/ /g,'').toLowerCase(),label.toLowerCase(),label.replace(/\b([a-z])/g,(_,c)=>c.toUpperCase()),label.replace(/ /g,'')]; for(const v of variants){ if(Object.prototype.hasOwnProperty.call(obj,v)) return obj[v]; const snake=v.replace(/[A-Z]/g,m=>'_'+m.toLowerCase()); if(Object.prototype.hasOwnProperty.call(obj,snake)) return obj[snake]; const camel=v.replace(/[_ ]([a-z])/g,(_,c)=>c.toUpperCase()).replace(/[_ ]/g,''); if(Object.prototype.hasOwnProperty.call(obj,camel)) return obj[camel]; } return ''; }

  function pickContribs(member){ const out={}; let found=false; const buckets = member && (member.Contributions||member.contributions||member.Totals||member.totals||member.Stats||member.stats||member); if(buckets && typeof buckets==='object'){ const keys=Object.keys(buckets); if(keys.some(k=>/^\d+$/.test(k))){ for(const k of keys){ const label=codeMap[k]; if(label){ out[label]=String(buckets[k]); found=true; } } } }
    if(!found){ for(const k of contributionFields){ const val=valueByLabel(buckets,k); if(val!=='' && val!=null) found=true; out[k]=(val==null||val==='')?'':String(val); } } else { for(const k of contributionFields){ if(!(k in out)) out[k]=''; } }
    return out; }

  function normalizeGuildData(details){ const rows=[]; let members = details.members || details.Members || details.roster || details.players || details.Players || [];
    if(members && !Array.isArray(members) && typeof members==='object'){ const vals=[]; for(const [mk,mv] of Object.entries(members)){ if(mv && typeof mv==='object'){ if(mv.ID==null && mv.Id==null && mv.id==null) mv.ID = mk; vals.push(mv); } } if(vals.length){ members=vals; console.log('Members detected as object map; converted & preserved IDs'); } }
    if(!Array.isArray(members) || members.length===0){ let picked=null; try{ for(const [k,v] of Object.entries(details)){ if(Array.isArray(v) && v.length>0 && typeof v[0]==='object'){ picked={key:k,arr:v}; break; } if(!Array.isArray(v) && v && typeof v==='object'){ const vals=Object.values(v).filter(x=>x && typeof x==='object'); if(vals.length>5){ picked={key:k,arr:vals}; break; } } } }catch(e){} if(picked){ members=picked.arr; console.log('Picked members collection from key:',picked.key); } }
    if(!Array.isArray(members)) return rows;
    for(const m of members){ const id = m.ID||m.Id||m.id||''; const name = m.Name||m.name||m.player||m.username||m.display_name||id||'Unknown'; rows.push({ ID:String(id), Name:String(name), ...pickContribs(m) }); }
    return rows; }

  // =============== Raw JSON Viewer ===============
  function showRawJson(raw){ const existing=document.getElementById('mgl-raw'); if(existing) existing.remove(); const modal=document.createElement('div'); modal.id='mgl-raw'; Object.assign(modal.style,{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:100000,background:'#121212',color:'#fff',padding:'12px',width:'80vw',height:'70vh',borderRadius:'10px',boxShadow:'0 0 20px rgba(0,0,0,.6)',display:'flex',flexDirection:'column'}); const bar=document.createElement('div'); Object.assign(bar.style,{display:'flex',justifyContent:'space-between',marginBottom:'8px'}); const title=document.createElement('div'); title.textContent='Raw JSON (guild details)'; const close=document.createElement('button'); close.textContent='Close'; Object.assign(close.style,{padding:'6px 10px',background:'#6A0DAD',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}); close.onclick=()=>modal.remove(); bar.appendChild(title); bar.appendChild(close); const pre=document.createElement('pre'); Object.assign(pre.style,{flex:'1',overflow:'auto',whiteSpace:'pre-wrap',background:'#0f0f0f',padding:'10px',borderRadius:'6px'}); pre.textContent=typeof raw==='string'? raw : JSON.stringify(raw,null,2); modal.appendChild(bar); modal.appendChild(pre); document.body.appendChild(modal); }

  // =============== Results Modal (sortable + totals) ===============
  function showResultsModal(){ const existing=document.getElementById('mgl-results'); if(existing) existing.remove(); const modal=document.createElement('div'); modal.id='mgl-results'; Object.assign(modal.style,{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:99999,background:'#1e1e1e',color:'#fff',padding:'16px',maxHeight:'82vh',overflow:'auto',width:'980px',borderRadius:'12px',boxShadow:'0 0 20px rgba(0,0,0,.6)',fontFamily:'monospace'});
    const top=document.createElement('div'); Object.assign(top.style,{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}); const title=document.createElement('div'); title.textContent='Guild Contributions — Sort / Totals'; Object.assign(title.style,{fontSize:'16px',fontWeight:'bold'});
    const actions=document.createElement('div'); Object.assign(actions.style,{display:'flex',gap:'8px'});
    const dlBtn=document.createElement('button'); dlBtn.textContent='Download CSV'; Object.assign(dlBtn.style,{padding:'6px 10px',background:'#F1C40F',color:'#000',border:'none',borderRadius:'6px',cursor:'pointer'});
    const rawBtn=document.createElement('button'); rawBtn.textContent='Raw JSON'; Object.assign(rawBtn.style,{padding:'6px 10px',background:'#555',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'});
    const toggleBtn=document.createElement('button'); toggleBtn.textContent='Numbers: Abbrev'; Object.assign(toggleBtn.style,{padding:'6px 10px',background:'#2d2d2d',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'});
    const closeBtn=document.createElement('button'); closeBtn.textContent='Close'; Object.assign(closeBtn.style,{padding:'6px 10px',background:'#6A0DAD',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'});
    actions.appendChild(dlBtn); actions.appendChild(rawBtn); actions.appendChild(toggleBtn); actions.appendChild(closeBtn);
    top.appendChild(title); top.appendChild(actions);

    const tableWrap=document.createElement('div'); Object.assign(tableWrap.style,{border:'1px solid #333',borderRadius:'8px',overflow:'hidden'});
    const table=document.createElement('table'); Object.assign(table.style,{width:'100%',borderCollapse:'separate',borderSpacing:'0'});
    const thead=document.createElement('thead'); const headRow=document.createElement('tr');
    const tbody=document.createElement('tbody'); const tfoot=document.createElement('tfoot');

    const sort={key:'Name',dir:'asc'}; function headerCell(label){ const th=document.createElement('th'); th.textContent=label+(sort.key===label?(sort.dir==='asc'?' ▲':' ▼'):''); Object.assign(th.style,{position:'sticky',top:'0',background:'#2a2a2a',borderBottom:'1px solid #444',padding:'6px 8px',textAlign:'left',cursor:'pointer',userSelect:'none'}); th.addEventListener('click',()=>{ if(sort.key===label) sort.dir=sort.dir==='asc'?'desc':'asc'; else { sort.key=label; sort.dir='asc'; } render(); }); return th; }
    function sortRows(arr){ const key=sort.key; const dir=sort.dir==='asc'?1:-1; const isNum=(key!=='Name' && key!=='ID'); return arr.slice().sort((a,b)=> isNum ? (num(a[key])-num(b[key]))*dir : String(a[key]||'').localeCompare(String(b[key]||''))*dir ); }
    function renderBody(arr){ tbody.innerHTML=''; arr.forEach((r,i)=>{ const tr=document.createElement('tr'); tr.style.background=i%2?'#1a1a1a':'transparent'; const tdId=document.createElement('td'); tdId.textContent=r.ID||''; Object.assign(tdId.style,{padding:'6px 8px',borderBottom:'1px solid #333'}); tr.appendChild(tdId); const tdN=document.createElement('td'); tdN.textContent=r.Name||''; Object.assign(tdN.style,{padding:'6px 8px',borderBottom:'1px solid #333'}); tr.appendChild(tdN); for(const f of contributionFields){ const td=document.createElement('td'); const raw=r[f]||''; td.textContent = state.showAbbrev ? abbrev(raw) : String(raw); Object.assign(td.style,{padding:'6px 8px',borderBottom:'1px solid #333'}); tr.appendChild(td);} tbody.appendChild(tr); }); }
    function renderTotals(arr){ const tr=document.createElement('tr'); const label=document.createElement('td'); label.colSpan=2; label.textContent='Totals (visible)'; Object.assign(label.style,{padding:'8px',background:'#1f1f1f',borderTop:'1px solid #444',fontWeight:'bold'}); tr.appendChild(label); for(const f of contributionFields){ const td=document.createElement('td'); const sum=arr.reduce((a,r)=>a+num(r[f]),0); td.textContent = state.showAbbrev ? abbrev(sum) : String(sum); Object.assign(td.style,{padding:'8px',background:'#1f1f1f',borderTop:'1px solid #444'}); tr.appendChild(td);} tfoot.innerHTML=''; tfoot.appendChild(tr); }
    function render(){ headRow.innerHTML=''; headRow.appendChild(headerCell('ID')); headRow.appendChild(headerCell('Name')); for(const f of contributionFields) headRow.appendChild(headerCell(f)); const sorted=sortRows(state.data); renderBody(sorted); renderTotals(sorted); }

    dlBtn.addEventListener('click',()=> download('manarion_contributions.csv', toCSV(state.data), 'text/csv'));
    rawBtn.addEventListener('click',()=> state.lastRaw ? showRawJson(state.lastRaw) : alert('No raw data yet. Fetch via API first.'));
    toggleBtn.addEventListener('click',()=>{ state.showAbbrev=!state.showAbbrev; toggleBtn.textContent = state.showAbbrev ? 'Numbers: Abbrev' : 'Numbers: Raw'; render(); });
    closeBtn.addEventListener('click',()=> modal.remove());

    modal.appendChild(top); modal.appendChild(tableWrap); tableWrap.appendChild(table); table.appendChild(thead); thead.appendChild(headRow); table.appendChild(tbody); table.appendChild(tfoot); document.body.appendChild(modal);

    if(!Array.isArray(state.data) || state.data.length===0){ const hint=document.createElement('div'); hint.textContent='No rows. Check API key & Guild ID — also see console for fetch logs.'; Object.assign(hint.style,{marginTop:'8px',color:'#bbb'}); modal.appendChild(hint); }

    const anyContrib=(state.data||[]).some(r=> contributionFields.some(f=> (r[f]||'')!=='' && num(r[f])>0)); if(!anyContrib){ const note=document.createElement('div'); note.textContent='Heads-up: contribution totals were not found in this payload for some members. If the API exposes them under different keys or another endpoint, share a sample and I’ll map them.'; Object.assign(note.style,{marginTop:'8px',color:'#f1c40f'}); modal.appendChild(note); }

    render();
  }

  // =============== Toolbar (draggable + collapsible) ===============
  function buildControlBar(){ const existing=document.getElementById('mgl-bar'); if(existing) return existing; const bar=document.createElement('div'); bar.id='mgl-bar'; Object.assign(bar.style,{position:'fixed',bottom:'10px',right:'10px',zIndex:99999,display:'flex',gap:'6px',alignItems:'center',background:'#1e1e1e',padding:'8px',borderRadius:'10px',boxShadow:'0 0 10px rgba(0,0,0,.5)',fontFamily:'monospace'});
    const drag=document.createElement('div'); drag.textContent='≡'; Object.assign(drag.style,{cursor:'move',color:'#ccc',padding:'0 6px',userSelect:'none'}); let dragging=false,sx=0,sy=0,ox=0,oy=0; drag.addEventListener('mousedown',e=>{dragging=true; sx=e.clientX; sy=e.clientY; const r=bar.getBoundingClientRect(); ox=r.left; oy=r.top; e.preventDefault();}); document.addEventListener('mousemove',e=>{ if(!dragging) return; const dx=e.clientX-sx,dy=e.clientY-sy; bar.style.left=(ox+dx)+'px'; bar.style.top=(oy+dy)+'px'; bar.style.right='auto'; bar.style.bottom='auto';}); document.addEventListener('mouseup',()=> dragging=false);

    const guildSel=document.createElement('select'); Object.assign(guildSel.style,{padding:'6px',background:'#222',color:'#fff',border:'1px solid #333',borderRadius:'6px',maxWidth:'280px'});
    const idInput=document.createElement('input'); idInput.placeholder='Guild ID'; Object.assign(idInput.style,{padding:'6px',background:'#222',color:'#fff',border:'1px solid #333',borderRadius:'6px',width:'120px'});
    const keyInput=document.createElement('input'); keyInput.placeholder='API Key'; keyInput.type='password'; Object.assign(keyInput.style,{padding:'6px',background:'#222',color:'#fff',border:'1px solid #333',borderRadius:'6px',width:'200px'});
    const fetchBtn=document.createElement('button'); fetchBtn.textContent='Fetch via API'; Object.assign(fetchBtn.style,{padding:'6px 10px',background:'#6A0DAD',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'});
    const showBtn=document.createElement('button'); showBtn.textContent='Show Results'; Object.assign(showBtn.style,{padding:'6px 10px',background:'#3E3A5E',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'});

    const collapse=document.createElement('button'); collapse.textContent='«'; Object.assign(collapse.style,{padding:'4px 6px',background:'#444',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}); let collapsed=false; function setCollapsed(v){ collapsed=!!v; bar.innerHTML=''; if(collapsed){ bar.appendChild(drag); const tab=document.createElement('button'); tab.textContent='Guild Logger'; Object.assign(tab.style,{padding:'6px 8px',background:'#6A0DAD',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}); tab.addEventListener('click',()=> setCollapsed(false)); bar.appendChild(tab); } else { bar.appendChild(drag); bar.appendChild(collapse); bar.appendChild(guildSel); bar.appendChild(idInput); bar.appendChild(keyInput); bar.appendChild(fetchBtn); bar.appendChild(showBtn); } }

    idInput.value=state.guildId||''; keyInput.value=state.apiKey||'';

    async function populateGuilds(){ guildSel.innerHTML=''; const opt0=document.createElement('option'); opt0.value=''; opt0.textContent='— Select guild —'; guildSel.appendChild(opt0); try{ const list=await fetchGuildList(); if(!Array.isArray(list) || list.length===0){ const o=document.createElement('option'); o.value=''; o.textContent='(no guilds returned)'; guildSel.appendChild(o); } else { list.forEach(g=>{ const o=document.createElement('option'); o.value=String(g.id||g._id||g.slug||g.name||''); o.textContent=`${g.name||g.title||o.value}`; guildSel.appendChild(o); }); } }catch(e){ const o=document.createElement('option'); o.value=''; o.textContent='(failed to load guilds)'; guildSel.appendChild(o); console.warn(e); } }
    populateGuilds();

    guildSel.addEventListener('change',()=>{ state.guildId=guildSel.value; idInput.value=state.guildId; savePrefs(); });
    idInput.addEventListener('input',()=>{ state.guildId=idInput.value.trim(); savePrefs(); });
    keyInput.addEventListener('input',()=>{ state.apiKey=keyInput.value.trim(); savePrefs(); });

    fetchBtn.addEventListener('click', async()=>{
      if(state.isRunning) return;
      const gid=(idInput.value || guildSel.value || '').trim();
      const key=keyInput.value.trim();
      if(!gid) return alert('Please select a guild or enter a Guild ID.');
      if(!key) return alert('Please enter your guild API key.');
      state.guildId=gid; state.apiKey=key; savePrefs();
      try{
        state.isRunning=true; fetchBtn.disabled=true; fetchBtn.textContent='Fetching…';
        const details=await fetchGuildDetails(gid, key);
        state.lastRaw=details;
        const rows=normalizeGuildData(details);
        if(!rows.length){ console.warn('No members parsed from details:', details); alert('Fetched guild details, but found no members. Check console for the response shape and confirm your API key/guild ID.'); }
        state.data=rows; showResultsModal();
      }catch(err){ console.error('Fetch failed', err); alert('Failed to fetch guild details. See console for details.'); }
      finally{ state.isRunning=false; fetchBtn.disabled=false; fetchBtn.textContent='Fetch via API'; }
    });

    showBtn.addEventListener('click',()=>{ if(!state.data.length) return alert('No data yet. Click “Fetch via API” first.'); showResultsModal(); });

    bar.appendChild(drag); bar.appendChild(collapse); bar.appendChild(guildSel); bar.appendChild(idInput); bar.appendChild(keyInput); bar.appendChild(fetchBtn); bar.appendChild(showBtn);
    document.body.appendChild(bar);

    setTimeout(()=>{ const r=bar.getBoundingClientRect(); if(r.right>window.innerWidth-8) setCollapsed(true); },0);
    collapse.addEventListener('click',()=> setCollapsed(true));

    return bar;
  }

  // =============== Boot ===============
  (function boot(){ buildControlBar(); })();

})();
