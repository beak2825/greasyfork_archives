// ==UserScript==
// @name         Klavia Points Tracker + Theme Customizer
// @version      2024-04.23
// @namespace    https://greasyfork.org/users/1331131-tensorflow-dvorak
// @description  Race stats + timeline UI, auto‑refresh & full Theme tab with color/image pickers, font family, import/export
// @author       TensorFlow - Dvorak
// @match        *://*.ntcomps.com/*
// @match        *://*.klavia.io/*
// @match        *://*.playklavia.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531085/Klavia%20Points%20Tracker%20%2B%20Theme%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/531085/Klavia%20Points%20Tracker%20%2B%20Theme%20Customizer.meta.js
// ==/UserScript==

(() => {
  'use strict';

  //
  // 1) Inject race‑logger
  //
  (function injectLogger() {
    const s = document.createElement('script');
    s.textContent = String.raw`
      (function() {
        const STORAGE_KEY = 'klaviaRaceHistory';
        const seen = new Set();
        const liveWpm = new Map();
        let localId = null;
        function onWpm(m){
          if(!localId && m.racerId) localId = m.racerId;
          const a = liveWpm.get(m.racerId)||[];
          a.push(m.wpm);
          if(a.length>200) a.shift();
          liveWpm.set(m.racerId,a);
        }
        const O = window.WebSocket;
        window.WebSocket = new Proxy(O,{construct(t,a){
          const w = new t(...a);
          w.addEventListener('message',e=>{
            let d; try{ d = JSON.parse(e.data); } catch{return;}
            const idObj = d.identifier?JSON.parse(d.identifier):{};
            const m = d.message;
            if(m?.message==='update_racer_position' && typeof m.wpm==='number')
              onWpm(m);
            if(
              idObj.channel==='RaceChannel' &&
              m?.message==='update_race_results' &&
              m.textCompleted &&
              m.raceId &&
              !seen.has(m.raceId)
            ){
              seen.add(m.raceId);
              const tl = {};
              for(const[id,arr] of liveWpm.entries()) tl[id]=arr.slice();
              const rec = {
                raceId: m.raceId,
                timestamp: new Date().toISOString(),
                points: Math.round(
                1 *
                (100 + (m.wpm * 2.0)) *
                (100 - ((100 - parseFloat(m.accuracy)) * 5)) /
                100
                ),
                wpm: m.wpm,
                accuracy: parseFloat(m.accuracy),
                raceSeconds: m.raceSeconds,
                textSeconds: m.textSeconds,
                boostBonus: m.boostBonus,
                timelineByRacer: tl
              };
              const H = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
              H.unshift(rec);
              localStorage.setItem(STORAGE_KEY,JSON.stringify(H));
              window.dispatchEvent(new CustomEvent('klavia:race-logged',{detail:rec}));
              liveWpm.clear();
            }
          });
          return w;
        }});
      })();
    `;
    document.documentElement.appendChild(s);
  })();

  //
  // 2) Theme Manager
  //
  const THEME_KEY = 'klaviaTheme';
  const defaults = {
    bodyBgColor:     '#000000',
    bodyBgImage:     '/assets/bg_season1-e6b567b6d451990d0a3376cd287cda90facb8980f979f027dc344c0aa2d743d9.png',
    dashBgColor:     '#060516',
    dashBgImage:     '',
    textSize:        90,
    gameWidth:       80,
    dashHeight:      500,
    typingTextColor: '#acaaff',
    caretColor:      '#00ffff',
    fontFamily:      'monospace'
  };
  let theme = Object.assign({}, defaults, JSON.parse(localStorage.getItem(THEME_KEY)||'{}'));

  function applyTheme(){
    let st = document.getElementById('klavia-theme-style');
    if(!st){
      st = document.createElement('style');
      st.id = 'klavia-theme-style';
      document.head.appendChild(st);
    }
    st.textContent = `
      /* BODY BACKGROUND */
      body[data-bs-theme=dark]::before{
        content:"";position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;
        background:${theme.bodyBgImage?`url(${theme.bodyBgImage})`:`${theme.bodyBgColor}`} no-repeat center center!important;
        background-size:cover!important;background-attachment:fixed!important;
        opacity:0.2!important;pointer-events:none;
      }
      body { background:${theme.bodyBgColor}!important; }

      /* TYPING CONTAINER */
      #typing-text-container {
        font-family:${theme.fontFamily}!important;
        background:${theme.dashBgImage?`url(${theme.dashBgImage})`:`${theme.dashBgColor}`} no-repeat center center!important;
        background-size:cover!important;background-attachment:fixed!important;
        width:100%!important;max-width:100%!important;height:fit-content!important;
      }
      #typing-text {
        font-size:${theme.textSize}px!important;
        caret-color:${theme.caretColor}!important;
        font-family:${theme.fontFamily}!important;
      }

      /* DASHBOARD */
      #dashboard {
        font-family:${theme.fontFamily}!important;
        background:${theme.dashBgColor}!important;
        width:100%!important;max-width:100%!important;
        height:${theme.dashHeight}px!important;max-height:${theme.dashHeight}px!important;
      }
      #dashboard[data-bs-theme=dark] #typing-text {
        color:${theme.typingTextColor}!important;
      }

      /* GAME CONTAINER & OTHERS */
      #game-container {
        width:100%!important;max-width:${theme.gameWidth}%!important;height:fit-content!important;
        font-family:${theme.fontFamily}!important;
      }
      #canvas-container,#track,#content {
        width:100%!important;max-width:100%!important;
        font-family:${theme.fontFamily}!important;
      }
    `;
  }
  function saveTheme(){
    localStorage.setItem(THEME_KEY,JSON.stringify(theme));
  }
  applyTheme();

  //
  // 3) UI Manager
  //
  const STORAGE_KEY = 'klaviaRaceHistory';
  let historyData=[], activeTab='stats', uiVisible=false;

  function createElem(tag,{attrs={},styles={},html=''}={}){
    const el = document.createElement(tag);
    Object.assign(el,attrs);
    Object.assign(el.style,styles);
    if(html) el.innerHTML = html;
    return el;
  }
  function getColor(val,all){
    const s=[...all].sort((a,b)=>a-b),
          L=s[Math.floor(s.length*.33)],
          H=s[Math.floor(s.length*.66)];
    return val>=H?'#4CAF50':val>=L?'#FFC107':'#F44336';
  }

  function renderStatsUI(){
    historyData = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    const ex = document.getElementById('klavia-stats');
    if(ex) ex.remove();

    const root = createElem('div',{attrs:{id:'klavia-stats'},styles:{
      position:'fixed',top:'10px',right:'10px',
      background:uiVisible?'#121212':'transparent',
      color:'#e0e0e0',padding:uiVisible?'20px':'0',
      borderRadius:'12px',zIndex:'9999',
      maxWidth:'600px',maxHeight:'80vh',
      overflowY:uiVisible?'auto':'visible',
      boxShadow:uiVisible?'0 4px 20px rgba(0,0,0,0.3)':'',
      fontFamily:'Segoe UI,sans-serif'
    }});
    document.body.append(root);

    // toggle
    root.append(createElem('button',{html:'DTR',attrs:{onclick:()=>{
      uiVisible = !uiVisible; renderStatsUI();
    }},styles:{
      position:'absolute',top:'10px',right:'10px',
      width:'40px',height:'40px',borderRadius:'50%',
      background:'#ff4500',color:'#fff',border:'none',
      cursor:'pointer',display:'flex',
      justifyContent:'center',alignItems:'center'
    }}));
    if(!uiVisible) return;

    // tabs
    const tabs = createElem('div',{styles:{
      display:'flex',gap:'10px',marginBottom:'16px', paddingRight:'2rem'
    }});
    [['stats','Stats'],['table','Table'],['analysis','Analysis'],['theme','Theme']].forEach(([k,l])=>{
      tabs.append(createElem('button',{html:l,attrs:{onclick:()=>{
        activeTab=k; renderStatsUI();
      }},styles:{
        padding:'6px 12px',
        background:activeTab===k?'#1976d2':'#333',
        color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer'
      }}));
    });
    root.append(tabs);

    // content
    const content = createElem('div',{attrs:{id:'klavia-stats-content'},styles:{
      fontSize:'15px',lineHeight:'1.6',color:'#ccc'
    }});
    root.append(content);

    // clear history
    root.append(createElem('button',{html:'Clear History',attrs:{onclick:()=>{
      localStorage.removeItem(STORAGE_KEY);
      renderStatsUI();
    }},styles:{
      marginTop:'16px',padding:'8px 16px',
      background:'#c62828',color:'#fff',
      border:'none',borderRadius:'4px',cursor:'pointer'
    }}));

    // data arrays
    const r = historyData.slice(),
          vals = k => r.map(e=>e[k]),
          avg = k => vals(k).reduce((a,b)=>a+b,0)/Math.max(r.length,1);

    // --- Stats tab ---
    if(activeTab==='stats'){
      if(!r.length) content.innerHTML='<div style="text-align:center;color:#aaa">No data</div>';
      else {
        const L=r[0],
              iv=r.slice(0,-1).map((e,i)=>(new Date(e.timestamp)-new Date(r[i+1].timestamp))/1000),
              ms=iv.reduce((a,b)=>a+b,0)/iv.length,
              rph=3600/ms, pph=rph*avg('points'),
              est=`<br><div><strong style="color:#90caf9">Estimate</strong>: Races/hr: ${rph.toFixed(1)} Points/hr: ${pph.toFixed(0)}<br>
                    <small>(Avg ${ms.toFixed(1)}s)</small></div>`;
        content.innerHTML=`
          <div><strong style="color:#90caf9">Last Race</strong>:
            <span style="color:${getColor(L.points,vals('points'))}">Points: ${L.points}</span> |
            <span style="color:${getColor(L.wpm,vals('wpm'))}">WPM: ${L.wpm.toFixed(1)}</span> |
            <span style="color:${getColor(L.accuracy,vals('accuracy'))}">Accuracy: ${L.accuracy.toFixed(2)}%</span>
          </div><br>
          <div><strong style="color:#90caf9">Average(${r.length})</strong>:
            <span style="color:${getColor(avg('points'),vals('points'))}">Points: ${avg('points').toFixed(2)}</span> |
            <span style="color:${getColor(avg('wpm'),vals('wpm'))}">WPM: ${avg('wpm').toFixed(1)}</span> |
            <span style="color:${getColor(avg('accuracy'),vals('accuracy'))}">Accuracy: ${avg('accuracy').toFixed(2)}%</span>
          </div>${r.length>1?est:''}`;
      }

    // --- Table tab ---
    } else if(activeTab==='table'){
      if(!r.length) content.innerHTML='<div style="text-align:center;color:#aaa">No data</div>';
      else {
        const rows=r.map((e,i)=>`
          <tr style="background:${i%2?'#2c2c2c':'#1f1f1f'}">
            <td style="padding:8px;color:#aaa">${i+1}</td>
            <td style="padding:8px;color:${getColor(e.points,vals('points'))}">${e.points}</td>
            <td style="padding:8px;color:${getColor(e.wpm,vals('wpm'))}">${e.wpm.toFixed(1)}</td>
            <td style="padding:8px;color:${getColor(e.accuracy,vals('accuracy'))}">${e.accuracy.toFixed(2)}%</td>
          </tr>`).join('');
        content.innerHTML=`
          <table style="width:100%;border-collapse:collapse">
            <thead style="background:#333;color:#fff"><tr><th>#</th><th>Pts</th><th>WPM</th><th>Acc</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <style>#klavia-stats-content tr:hover td{background:#444!important;transition:background .2s}</style>`;
      }
    // --- Analysis tab
  } else if (activeTab === "analysis") {
      content.innerHTML = `
        <h3 style="color:#90caf9;margin-bottom:8px;">Race Timeline</h3>
        <div id="klavia-analysis-legend" style="margin-bottom:8px;"></div>
        <select id="klavia-race-select" style="margin-bottom:8px;">
          ${r
            .map(
              (rec, i) => `
            <option value="${i}">
              ${new Date(rec.timestamp).toLocaleString()} — ${rec.points} pts
            </option>`
            )
            .join("")}
        </select>
        <canvas id="klavia-analysis-canvas" width="1000" height="300"
                style="background:#111;border:1px solid #444;display:block;"></canvas>
      `;
      const sel = content.querySelector("#klavia-race-select");
      const canvas = content.querySelector("#klavia-analysis-canvas");
      const ctx = canvas.getContext("2d");
      const legend = content.querySelector("#klavia-analysis-legend");

      function drawMultiTimeline(tlr) {
        const W = canvas.width,
          H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        // axes
        ctx.strokeStyle = "#666";
        ctx.beginPath();
        ctx.moveTo(50, 10);
        ctx.lineTo(50, H - 30);
        ctx.lineTo(W - 10, H - 30);
        ctx.stroke();
        // labels
        ctx.fillStyle = "#ccc";
        ctx.font = "12px sans-serif";
        ctx.fillText("WPM →", W - 60, H - 10);
        ctx.save();
        ctx.translate(10, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Time (s) →", 0, 0);
        ctx.restore();

        // scale
        let maxTime = 0,
          maxWpm = 0;
        Object.values(tlr).forEach((arr) => {
          maxTime = Math.max(maxTime, arr.length - 1);
          maxWpm = Math.max(maxWpm, ...arr);
        });

        // draw each racer
        legend.innerHTML = "";
        const colors = {};
        Object.entries(tlr).forEach(([id, arr]) => {
          const col =
            id === r[0].racerId
              ? "#00ffff"
              : colors[id] ||
                (colors[id] = `hsl(${Math.random() * 360},70%,60%)`);
          ctx.strokeStyle = col;
          ctx.beginPath();
          arr.forEach((w, i) => {
            const x = 50 + (i / maxTime) * (W - 60);
            const y = H - 30 - (w / maxWpm) * (H - 40);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          });
          ctx.stroke();
          // legend entry
          const name = id === r[0].racerId ? "You" : "Racer " + id;
          const span = document.createElement("span");
          span.textContent = name;
          span.style.color = col;
          span.style.marginRight = "12px";
          legend.append(span);
        });
      }

      sel.addEventListener("change", () => {
        const rec = historyData[parseInt(sel.value, 10)];
        drawMultiTimeline(rec.timelineByRacer || {});
      });
      sel.selectedIndex = 0;
      if (r[0]?.timelineByRacer) drawMultiTimeline(r[0].timelineByRacer);
    } else {
      content.innerHTML = `
        <h3 style="color:#90caf9;margin-bottom:8px">Theme</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-family:inherit;">
          <div><label>Body BG Color:<br><input type="color" id="th-bodyBgColor" value="${theme.bodyBgColor}"></label></div>
          <div><label>Body BG Image URL:<br><input type="text" id="th-bodyBgImage" value="${theme.bodyBgImage}" placeholder="http://…"></label></div>
          <div><label>Dash BG Color:<br><input type="color" id="th-dashBgColor" value="${theme.dashBgColor}"></label></div>
          <div><label>Dash BG Image URL:<br><input type="text" id="th-dashBgImage" value="${theme.dashBgImage}" placeholder="http://…"></label></div>
          <div><label>Typing Text Color:<br><input type="color" id="th-typingTextColor" value="${theme.typingTextColor}"></label></div>
          <div><label>Caret Color:<br><input type="color" id="th-caretColor" value="${theme.caretColor}"></label></div>
          <div><label>Font Family:<br>
            <select id="th-fontFamily">
              ${['monospace','Arial','"Times New Roman"','"Courier New"','Verdana','Georgia','Tahoma','"Trebuchet MS"','"Comic Sans MS"']
                .map(f=>`<option${f===theme.fontFamily?' selected':''}>${f}</option>`).join('')}
            </select>
          </label></div>
          <div><label>Text Size:<br>
            <input type="range" id="th-textSize" min="20" max="200" value="${theme.textSize}">
            <span id="th-textSize-val">${theme.textSize}px</span>
          </label></div>
          <div><label>Game Width:<br>
            <input type="range" id="th-gameWidth" min="20" max="100" value="${theme.gameWidth}">
            <span id="th-gameWidth-val">${theme.gameWidth}%</span>
          </label></div>
          <div><label>Dash Height:<br>
            <input type="range" id="th-dashHeight" min="200" max="2000" value="${theme.dashHeight}">
            <span id="th-dashHeight-val">${theme.dashHeight}px</span>
          </label></div>
        </div>
        <div style="margin-top:12px;text-align:center">
          <button id="th-export">Export JSON</button>
          <button id="th-import">Import JSON</button>
          <button id="th-reset">Reset Defaults</button><br><br>
          <textarea id="th-json" style="width:95%;height:5em;"></textarea>
        </div>
      `;
      [['bodyBgColor','color'],['dashBgColor','color'],['typingTextColor','color'],['caretColor','color']].forEach(([k])=>{
        content.querySelector(`#th-${k}`).oninput = e=>{
          theme[k]=e.target.value; applyTheme(); saveTheme();
        };
      });
      [['bodyBgImage','text'],['dashBgImage','text']].forEach(([k])=>{
        content.querySelector(`#th-${k}`).onchange = e=>{
          theme[k]=e.target.value; applyTheme(); saveTheme();
        };
      });
      const ff = content.querySelector('#th-fontFamily');
      ff.onchange = e=>{ theme.fontFamily=e.target.value; applyTheme(); saveTheme(); };

      [['textSize','px'],['gameWidth','%'],['dashHeight','px']].forEach(([k,unit])=>{
        const inp=content.querySelector(`#th-${k}`), lbl=content.querySelector(`#th-${k}-val`);
        inp.oninput = e=>{
          theme[k]=+e.target.value; applyTheme(); saveTheme();
          lbl.textContent = e.target.value + unit;
        };
      });
      // export/import/reset
      content.querySelector('#th-export').onclick = ()=>{
        content.querySelector('#th-json').value = JSON.stringify(theme,null,2);
      };
      content.querySelector('#th-import').onclick = ()=>{
        try{
          const obj = JSON.parse(content.querySelector('#th-json').value);
          Object.assign(theme,obj);
          saveTheme(); applyTheme(); renderStatsUI();
        }catch{}
      };
      content.querySelector('#th-reset').onclick = ()=>{
        theme = Object.assign({}, defaults);
        saveTheme(); applyTheme(); renderStatsUI();
      };
    }
  }

  // 4) Auto‑refresh & init
  window.addEventListener('klavia:race-logged', renderStatsUI);
  document.addEventListener('DOMContentLoaded', ()=>{
    renderStatsUI();
    setInterval(()=>{ if(!document.getElementById('klavia-stats')) renderStatsUI(); },1000);
  });

})();