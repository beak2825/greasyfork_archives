// ==UserScript==
// @name         B站稍后观看时长统计助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  支持倍速、区间统计、BV跳转、暗黑模式适配、美观 UI 及标题模糊搜索的稍后观看统计助手
// @author       特比欧炸
// @match        https://www.bilibili.com/watchlater/list*
// @match        https://www.bilibili.com/list/watchlater*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.bilibili.com
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541838/B%E7%AB%99%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541838/B%E7%AB%99%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){'use strict';
const style = document.createElement('style');
style.innerHTML = `
:root {
    --panel-bg: #fff;
    --text-color: #222;
    --input-bg: #fff;
    --input-text: #000;
    --border-color: #ccc;
    --placeholder-color: #999;
}

#watchlater-stats-panel{position:fixed;top:var(--panel-top,150px);right:0;z-index:10000;font-family:'HarmonyOS Sans SC','Microsoft YaHei',sans-serif;transition:transform .3s;pointer-events:none;}
#stats-toggle-btn{position:absolute;top:0;right:0;width:36px;height:36px;background:linear-gradient(135deg,#00A1D6,#23ADE5);color:#fff;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;font-size:17px;box-shadow:0 2px 8px rgba(0,0,0,.2);transition:all .2s}
#stats-toggle-btn:hover{transform:scale(1.1)}
#stats-toggle-btn, #stats-container.visible {pointer-events: auto;}
#stats-container{background:var(--panel-bg);color:var(--text-color);border-radius:12px 0 0 12px;padding:18px;width:320px;box-shadow:-4px 0 12px rgba(0,0,0,.15);backdrop-filter:blur(10px);transform:translateX(100%);transition:transform .3s;max-height:80vh;overflow-y:auto;border:1px solid var(--border-color)}
#stats-container.visible{transform:translateX(0)}
.stats-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid #eee;padding-bottom:8px}
.stats-title{font-size:17px;color:#00A1D6;font-weight:600}
.close-btn{background:none;color:#999;border:none;font-size:20px;cursor:pointer;transition:.2s}
.close-btn:hover{color:#333}
.stats-item{display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:14px}
.stats-label{color:#666}
.stats-value{font-weight:600;color:#111;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stats-value[title]{cursor:help}
.remaining-time{margin:10px 0;padding:10px;background:#F6F8FA;border-radius:6px;text-align:center;font-size:15px;color:#D43C33;font-weight:bold;border:1px solid #E3E3E3}
.button-group{display:flex;gap:8px;margin-top:14px}
.action-btn{flex:1;padding:8px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;transition:opacity .2s}
.action-btn:hover{opacity:.85}
.refresh-btn{background:#00A1D6;color:#fff}
.export-btn{background:#FF6699;color:#fff}
.manual-match{margin:10px 0 4px;font-size:13px;color:#666}
#manual-title{width:100%;padding:6px;border:1px solid var(--border-color);border-radius:4px;font-size:13px;margin-bottom:6px;background:var(--input-bg);color:var(--input-text)}
#manual-title::placeholder{color:var(--placeholder-color)}
@media (prefers-color-scheme: dark){
    :root {
        --panel-bg: #1e1e1e;
        --text-color: #ddd;
        --input-bg: #333;
        --input-text: #fff;
        --border-color: #444;
        --placeholder-color: #aaa;
    }
    .stats-label{color:#aaa;}
    .stats-value{color:#fff;}
    .remaining-time{background:#2e2e2e;border:1px solid #444;color:#ff9898;}
    #stats-container{border-color:#444;}
    .stats-header{border-bottom:1px solid #444;}
    .close-btn{color:#aaa;}
    .close-btn:hover{color:#fff;}
}`;
document.head.appendChild(style);

const panel = document.createElement('div');
panel.id = 'watchlater-stats-panel';
panel.innerHTML = `
  <button id='stats-toggle-btn'>📊</button>
  <div id='stats-container'>
    <div class='stats-header'>
      <span class='stats-title'>稍后观看统计</span>
      <button class='close-btn'>×</button>
    </div>
    <div id='stats-content'>
      <div class='stats-item'><span class='stats-label'>视频总数:</span><span class='stats-value' id='total-videos'>0</span></div>
      <div class='stats-item'><span class='stats-label'>总时长(1x):</span><span class='stats-value' id='orig-duration'>0h0m</span></div>
      <div class='stats-item'><span class='stats-label'>总时长(倍速):</span><span class='stats-value' id='adj-duration'>0h0m</span></div>
      <div class='stats-item'><span class='stats-label'>当前到选择视频剩余:</span><span class='stats-value' id='range-duration'>--:--:--</span></div>
      <div class='remaining-time' id='remaining-time'>--:--:--</div>
      <div class='stats-item'><span class='stats-label'>播放速度:</span><span class='stats-value' id='playback-speed'>1.0x</span></div>
      <div class='manual-match'>选择计算到视频（可输入/模糊搜索）</div>
      <input type='text' id='manual-title' list='titles-list' placeholder='可手动输入或选择标题'>
      <datalist id='titles-list'></datalist>
      <div class='button-group'>
        <button id='refresh-stats' class='action-btn refresh-btn'>刷新</button>
        <button id='export-csv' class='action-btn export-btn'>导出</button>
      </div>
      <div class='stats-footer' style='margin-top:10px;font-size:12px;color:#aaa;text-align:center;'>更新时间: <span id='update-time'>--:--:--</span></div>
    </div>
  </div>`;
document.body.appendChild(panel);

let listData = [], player = null, playRate = 1, origSec = 0, remSec = 0, intervalId = null;

function toHMS(s){ const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=Math.floor(s%60); return {h,m,sec}; }
function fmtHMS(o){ return `${o.h.toString().padStart(2,'0')}:${o.m.toString().padStart(2,'0')}:${o.sec.toString().padStart(2,'0')}`; }

function fetchData(){
  GM_xmlhttpRequest({ method: 'GET', url: 'https://api.bilibili.com/x/v2/history/toview', onload(res){
      try{ const d=JSON.parse(res.responseText);
        if(d.code===0 && d.data.list){ listData = d.data.list; calcStats(); populateDatalist(); }
      } catch(e){ showError('解析失败'); }
    }
  });
}

function calcStats(){
  origSec = listData.reduce((s,v)=>s + (v.duration||0), 0);
  document.getElementById('total-videos').textContent = listData.length;
  const orig = toHMS(origSec); document.getElementById('orig-duration').textContent = `${orig.h}h${orig.m}m`;
  remSec = origSec / playRate; const adj = toHMS(remSec);
  document.getElementById('adj-duration').textContent = `${adj.h}h${adj.m}m`;
  document.getElementById('update-time').textContent = new Date().toTimeString().slice(0,8);
  resetTimer(); updateRangeStat();
}

function populateDatalist(){
  const dl = document.getElementById('titles-list'); dl.innerHTML = '';
  listData.forEach(item=>{ const opt = document.createElement('option'); opt.value = item.title; dl.appendChild(opt); });
}

function resetTimer(){ clearInterval(intervalId);
  player = document.querySelector('video'); if(!player) return;
  intervalId = setInterval(()=>{ if(player.paused) return; remSec = Math.max(0, remSec - playRate * 0.5); document.getElementById('remaining-time').textContent = fmtHMS(toHMS(remSec)); }, 500);
}

function initPlayer(){
  player = document.querySelector('video'); if(!player) return;
  playRate = player.playbackRate; document.getElementById('playback-speed').textContent = playRate.toFixed(1)+'x';
  player.addEventListener('ratechange', ()=>{ playRate = player.playbackRate; document.getElementById('playback-speed').textContent = playRate.toFixed(1)+'x'; calcStats(); });
  player.addEventListener('ended', () => { setTimeout(fetchData, 1000); });
}

function showError(msg){ document.getElementById('stats-content').innerHTML = `<div style='padding:12px;color:#f66;text-align:center;'>${msg}</div>`; }

function updateRangeStat(){
  const title = document.getElementById('manual-title').value.trim();
  if(!title || !listData.length){ document.getElementById('range-duration').textContent = '--:--:--'; return; }
  const idx = listData.findIndex(v=>v.title.includes(title));
  if(idx === -1){ document.getElementById('range-duration').textContent = '未找到'; return; }
  const totalSec = listData.slice(0, idx+1).reduce((s,v)=>s + (v.duration||0), 0);
  document.getElementById('range-duration').textContent = fmtHMS(toHMS(totalSec / playRate));
}

document.getElementById('refresh-stats').addEventListener('click', ()=>fetchData());
document.getElementById('export-csv').addEventListener('click', ()=>{
  if(!listData.length) return alert('无数据');
  const total = listData.length;
  const rows = listData.map((v,i)=>{ const {h,m,sec} = toHMS(v.duration||0); const title = `"${v.title.replace(/"/g,'""')}"`; return `${total-i},${title},${h},${m},${sec},https://www.bilibili.com/video/${v.bvid},${v.owner?.name||''}`; }).reverse();
  const csv = '序号,标题,小时,分钟,秒,视频链接,UP主\n'+rows.join('\n');
  const blob = new Blob(["\uFEFF"+csv], {type:'text/csv'});
  const link= document.createElement('a'); link.href= URL.createObjectURL(blob);
  link.download='watchlater_'+new Date().toISOString().slice(0,10)+'.csv'; link.click();
});

document.getElementById('stats-toggle-btn').addEventListener('click', ()=>{ const c=document.getElementById('stats-container'),t=document.getElementById('stats-toggle-btn'); if(c.classList.toggle('visible')) t.style.display='none'; else t.style.display='flex'; });
document.querySelector('.close-btn').addEventListener('click', ()=>{ document.getElementById('stats-container').classList.remove('visible'); document.getElementById('stats-toggle-btn').style.display='flex'; });

const savedTop = GM_getValue('panel-top'); if( savedTop) panel.style.setProperty('--panel-top', savedTop+'px');
let drag=false, sy=0, top0=0;
document.getElementById('stats-toggle-btn').addEventListener('mousedown', e=>{ drag=true; sy=e.clientY; top0=parseInt(getComputedStyle(panel).top); });
document.addEventListener('mousemove', e=>{ if(drag){ let nt= top0 + (e.clientY - sy); nt = Math.min(Math.max(nt,10), window.innerHeight-40); panel.style.top = nt+'px'; GM_setValue('panel-top', nt); } });
document.addEventListener('mouseup', ()=>{ drag=false; });

document.getElementById('manual-title').addEventListener('input', updateRangeStat);
setTimeout(()=>{ fetchData(); initPlayer(); }, 800);
})();