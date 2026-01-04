// ==UserScript==
// @name         WAN AI — Batch Text→Video (Multi-Source + Settings + Realtime Logs)
// @namespace    https://wan.video/
// @version      1.6.2
// @description  Multi-source Google Sheets with saved UI settings, selectable sources, logs cleared per click, table hidden until Capture, cropped & scrollable table. Auto-run, Capture, Push-to-Sheets, From Sheet, pagingList monitor.
// @match        https://wan.video/*
// @match        https://*.wan.video/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/547457/WAN%20AI%20%E2%80%94%20Batch%20Text%E2%86%92Video%20%28Multi-Source%20%2B%20Settings%20%2B%20Realtime%20Logs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547457/WAN%20AI%20%E2%80%94%20Batch%20Text%E2%86%92Video%20%28Multi-Source%20%2B%20Settings%20%2B%20Realtime%20Logs%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** ================= KEYS / GLOBALS ================= **/
  const APP_ID = "wanai-batch-box";
  const TOGGLE_ID = "wanai-batch-toggle";
  const LAST_HEADER_KEY = "wan_ai_last_headers_v3";
  const SAVED_IDS_KEY   = "wan_ai_saved_task_ids_v3"; // [{taskId, prompt}]
  const SOURCES_KEY     = "wan_ai_sources_v3";        // saved Sources
  const ACTIVE_SRC_KEY  = "wan_ai_active_src_v3";     // active Source id
  const SHEET_RUN_LIMIT_KEY = "wan_ai_sheet_run_limit"; // per-cycle limit

  // WAN endpoints
  const CREATE_API_URL = "https://create.wan.video/wanx/api/common/imageGen";
  const PAGING_POST_URL = "https://create.wan.video/wanx/api/common/v2/task/pagingList";
  const PAGING_GET_URL  = (pageNo = 1, pageSize = 100) =>
    `https://create.wan.video/wanx/common/v2/task/pagingList?pageNo=${pageNo}&pageSize=${pageSize}`;

  // Model/deduct user prefs
  const DEDUCT_MODE_KEY   = "wan_ai_deduct_mode"; // 'credit_mode' | 'relax_mode'
  const MODEL_VERSION_KEY = "wan_ai_model_version";
  const MODEL_OPTIONS = ["2_2_max","2_1_max","2_1_turbo"];

  // Run guards
  let injected = false;
  let lastUrl = location.href;
  let __RUN_FROM_SHEET__ = false;
  let __RUN_AUTO__ = false;
  let __SHOW_TABLE__ = false; // show only after CAPTURE / monitor tick

  // UI refs
  let listEl, bar, cntEl, totEl, tableWrapEl, tableEl, batchProgEl;
  let manualRow, manualInput;
  let fromSheetBtn, startBtn, stopBtn, captureBtn, pushBtn;
  let sourceSelEl, openSettingsBtn, settingsModalEl;
  let lastCapturedRows = [];

  /** ================= UTIL & PREFS ================= **/
  function uuid() { return "s_" + Math.random().toString(36).slice(2, 10); }
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  function chunk(arr, n){ const out=[]; for(let i=0;i<arr.length;i+=n) out.push(arr.slice(i,i+n)); return out; }
  function truncate(s, n){ if(!s) return ""; return s.length>n ? s.slice(0,n-1)+"…" : s; }
  function escapeHtml(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function setProgress(done,total){ const pct = total ? Math.round((done/total)*100) : 0; if(bar) bar.style.width = pct+"%"; }
  function isStopping(){ return sessionStorage.getItem("__WAN_STOPPING__")==="1"; }

  function getDeductMode(){ return localStorage.getItem(DEDUCT_MODE_KEY) || "credit_mode"; }
  function setDeductMode(v){ localStorage.setItem(DEDUCT_MODE_KEY, v==="relax_mode"?"relax_mode":"credit_mode"); }
  function getModelVersion(){ const v = localStorage.getItem(MODEL_VERSION_KEY); return MODEL_OPTIONS.includes(v)?v:"2_1_turbo"; }
  function setModelVersion(v){ localStorage.setItem(MODEL_VERSION_KEY, MODEL_OPTIONS.includes(v)?v:"2_1_turbo"); }
  function getSheetRunLimit(){ return Math.max(1, Math.min(10, Number(localStorage.getItem(SHEET_RUN_LIMIT_KEY)||3))); }
  function setSheetRunLimit(n){ localStorage.setItem(SHEET_RUN_LIMIT_KEY, String(Math.max(1, Math.min(10, Number(n)||3)))); }

  function loadSources(){ try{const arr=JSON.parse(localStorage.getItem(SOURCES_KEY)||"[]");return Array.isArray(arr)?arr:[];}catch{return[];} }
  function saveSources(arr){ localStorage.setItem(SOURCES_KEY, JSON.stringify(arr||[])); }
  function getActiveSourceId(){ return localStorage.getItem(ACTIVE_SRC_KEY) || (loadSources()[0]?.id || ""); }
  function setActiveSourceId(id){ localStorage.setItem(ACTIVE_SRC_KEY, id||""); }
  function getActiveSource(){ const id=getActiveSourceId(); const arr=loadSources(); return arr.find(s=>s.id===id)||arr[0]||null; }

  // Dynamic getters bound to active source
  function GS_WEBAPP_URL(){ return getActiveSource()?.gsUrl || ""; }
  function GS_SHEET_TAB(){  return getActiveSource()?.outputTab || ""; }
  function SOURCE_SHEET_TAB(){  return getActiveSource()?.sourceTab || ""; }
  function SOURCE_PROMPT_COL(){ return getActiveSource()?.promptCol || ""; }
  function SOURCE_STATUS_COL(){ return getActiveSource()?.statusCol || ""; }
  function SOURCE_START_ROW(){  return Number(getActiveSource()?.startRow || 2); }
  function SOURCE_END_ROW(){    return Number(getActiveSource()?.endRow   || SOURCE_START_ROW()); }

  // Saved IDs
  function loadSavedIds(){ try{const arr=JSON.parse(localStorage.getItem(SAVED_IDS_KEY)||"[]"); return Array.isArray(arr)?arr:[];}catch{return[];} }
  function saveTaskIdRecord(taskId,prompt){ if(!taskId) return; const arr=loadSavedIds(); if(!arr.find(r=>r.taskId===taskId)){ arr.push({taskId,prompt}); localStorage.setItem(SAVED_IDS_KEY, JSON.stringify(arr)); } }
  function clearSavedIds(){ localStorage.removeItem(SAVED_IDS_KEY); }

  // Auth reuse
  function getReusedHeaders(){
    try{
      const saved = JSON.parse(localStorage.getItem(LAST_HEADER_KEY) || "{}");
      const out = {"content-type":"application/json"};
      ["authorization","x-csrf-token","x-xsrf-token","x-auth-token"].forEach(k=>{ if(saved[k]) out[k]=saved[k]; });
      return out;
    }catch{ return {"content-type":"application/json"}; }
  }

  // Capture WAN auth headers
  (function interceptFetchOnce(){
    if (window.__wanFetchHookedV3) return;
    window.__wanFetchHookedV3 = true;

    const origFetch = window.fetch;
    window.fetch = async function(input, init){
      try{
        const url = typeof input==="string" ? input : input?.url || "";
        if (url.includes("/wanx/api/")){
          const hdrs = new Headers((init && init.headers) || (typeof input!=="string" ? input.headers : undefined) || {});
          const capture = {};
          hdrs.forEach((v,k)=>capture[k.toLowerCase()]=v);
          const allow = ["authorization","x-csrf-token","x-xsrf-token","x-auth-token","content-type"];
          const filtered = {};
          allow.forEach(k=>{ if(capture[k]) filtered[k]=capture[k]; });
          if(Object.keys(filtered).length) localStorage.setItem(LAST_HEADER_KEY, JSON.stringify(filtered));
        }
      }catch{}
      return await origFetch.apply(this, arguments);
    };

    const OrigXHR = window.XMLHttpRequest;
    function WrappedXHR(){
      const xhr = new OrigXHR();
      const open = xhr.open;
      xhr.open = function(method,url){ this.__wan_url = url; return open.apply(this, arguments); };
      const setRequestHeader = xhr.setRequestHeader;
      xhr.setRequestHeader = function(k,v){
        try{
          if(this.__wan_url && this.__wan_url.includes("/wanx/api/")){
            const raw = JSON.parse(localStorage.getItem(LAST_HEADER_KEY)||"{}");
            raw[(k||"").toLowerCase()] = v;
            localStorage.setItem(LAST_HEADER_KEY, JSON.stringify(raw));
          }
        }catch{}
        return setRequestHeader.apply(this, arguments);
      };
      return xhr;
    }
    window.XMLHttpRequest = WrappedXHR;
  })();

  /** ================= STYLES ================= **/
  GM_addStyle(`
    #${TOGGLE_ID}{
      position:fixed; right:14px; bottom:14px; z-index:2147483647;
      padding:8px 10px; border-radius:10px; border:1px solid #3a3a3a;
      background:#0f172a; color:#e2e8f0; font-weight:700; font-size:12px;
      box-shadow:0 6px 18px rgba(0,0,0,.45); cursor:pointer;
    }
    #${APP_ID}{
      position:fixed; right:16px; bottom:56px; z-index:2147483646;
      width:560px; max-width:96vw; background:#111; color:#eee; border:1px solid #333; border-radius:12px;
      box-shadow:0 16px 40px rgba(0,0,0,.55); font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;
      max-height:80vh; display:flex; flex-direction:column;
    }
    .wanai-head{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid #2a2a2a; gap:8px; }
    .wanai-title{ font-weight:600; font-size:14px; }
    .wanai-body{ padding:10px 12px; flex:1; overflow:auto; }
    .wanai-ta{ width:100%; min-height:120px; resize:vertical; background:#0d0d0d; color:#ddd; border:1px solid #2a2a2a; border-radius:8px; padding:8px; font-size:12px; line-height:1.4; }
    .wanai-row{ display:flex; gap:8px; align-items:center; margin-top:8px; flex-wrap:wrap; }
    .wanai-btn{ background:#4f46e5; color:#fff; border:none; border-radius:8px; padding:8px 12px; cursor:pointer; font-weight:600; transition:filter .2s ease, opacity .2s ease, background .2s ease; }
    .wanai-mini{ background:#1f2937; color:#cbd5e1; border:none; border-radius:6px; padding:6px 8px; font-size:12px; transition:filter .2s ease, opacity .2s ease, background .2s ease; }
    .wanai-btn[disabled], .wanai-mini[disabled]{ opacity:.5; cursor:not-allowed; filter:grayscale(0.6); }
    .is-busy{ background:#0ea5e9 !important; color:#0b1020 !important; }
    .is-busy::after{ content:" …"; }
    .is-ok{ background:#22c55e !important; color:#05240e !important; }
    .is-err{ background:#ef4444 !important; color:#2b0a0a !important; }
    .wanai-input{ width:100%; background:#0d0d0d; color:#ddd; border:1px solid #2a2a2a; border-radius:6px; padding:6px 8px; font-size:12px; }
    .wanai-sm{ font-size:11px; opacity:.85; }
    .wanai-status{ font-size:12px; opacity:.9; }
    .wanai-list{ max-height:260px; overflow:auto; margin-top:8px; border-top:1px dashed #333; padding-top:6px; }
    .wanai-item{ font-size:11px; color:#cbd5e1; padding:6px 0; border-bottom:1px dotted #2a2a2a; }
    .wanai-controls{ position:sticky; top:0; background:#111; padding:8px 0; z-index:3; border-bottom:1px solid #2a2a2a; }
    .wanai-foot{ padding:8px 12px; border-top:1px solid #2a2a2a; display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .wanai-prog{ flex:1; height:8px; background:#1f2937; border-radius:999px; overflow:hidden; }
    .wanai-prog > span{ display:block; height:100%; width:0%; background:#22c55e; transition:width .2s ease; }
    .wanai-hide{ display:none !important; }

    .wanai-table-wrap{ max-height:260px; overflow:auto; border:1px solid #2a2a2a; border-radius:8px; margin-top:10px; }
    table{ width:100%; border-collapse:collapse; font-size:12px; table-layout:fixed; }
    th,td{ padding:6px; border-bottom:1px dotted #333; text-align:left; }
    th{ border-bottom:1px solid #2a2a2a; position:sticky; top:0; background:#111; }
    .crop{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .col-id{ width:160px; } .col-prompt{ width:300px; } .col-status{ width:120px; } .col-url{ width:320px; }
    .wanai-link{ color:#93c5fd; text-decoration:underline; }

    /* Settings modal */
    .wanai-modal-mask{ position:fixed; inset:0; z-index:2147483647; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; }
    .wanai-modal{ background:#0b0b0b; border:1px solid #2a2a2a; border-radius:12px; padding:14px; min-width:380px; max-width:92vw; }
    .wanai-grid{ display:grid; gap:8px; }
    .wanai-row-inline{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .wanai-list-sources{ border:1px dashed #333; border-radius:8px; padding:8px; max-height:160px; overflow:auto; }
    .wanai-src-item{ display:grid; grid-template-columns: 1fr auto auto auto; gap:6px; padding:6px 0; border-bottom:1px dotted #333; align-items:center; }
    .wanai-src-item:last-child{ border-bottom:none; }
    .wanai-src-label{ font-weight:600; color:#cfe3ff; }
  `);

  /** ================= UI: Toggle & Mount ================= **/
  function ensureToggle(){
    if (document.getElementById(TOGGLE_ID)) return;
    const t = document.createElement("button");
    t.id = TOGGLE_ID;
    t.textContent = "WAN•AI";
    t.title = "Show/Hide WAN AI Batch Runner";
    t.addEventListener("click", () => {
      const box = document.getElementById(APP_ID);
      if (box) box.style.display = (box.style.display === "none" ? "block" : "none");
      else ensureInjected(true);
    });
    document.body.appendChild(t);
  }

  const routerObserver = new MutationObserver(() => {
    if (lastUrl !== location.href) { lastUrl = location.href; ensureInjected(true); }
    if (injected && !document.getElementById(APP_ID)) ensureInjected(true);
  });

  async function domReady(){
    return new Promise(res=>{
      if (document.readyState==="complete" || document.readyState==="interactive") return res();
      document.addEventListener("DOMContentLoaded", res, { once:true });
    });
  }

  async function ensureInjected(recreate=false){
    await domReady(); if (!document.body) return; ensureToggle();
    if (!recreate && injected && document.getElementById(APP_ID)) return;
    const old = document.getElementById(APP_ID); if (old) old.remove();
    buildUI(); injected = true;
    try { routerObserver.observe(document.documentElement, { childList:true, subtree:true }); } catch {}
  }

  function clearLogs(){ if (listEl) listEl.innerHTML = ""; if (tableWrapEl) tableWrapEl.classList.add("wanai-hide"); }
  function setBtnBusy(btn,on,ok=false,err=false){
    if(!btn) return;
    if(on){ btn.classList.add("is-busy"); btn.classList.remove("is-ok","is-err"); btn.disabled=true; }
    else { btn.classList.remove("is-busy"); if(ok){btn.classList.add("is-ok"); setTimeout(()=>btn.classList.remove("is-ok"),900);} if(err){btn.classList.add("is-err"); setTimeout(()=>btn.classList.remove("is-err"),1200);} btn.disabled=false; }
  }

  function addItem(html, cls=""){
    const el = document.createElement("div");
    el.className = "wanai-item "+cls;
    el.innerHTML = html;
    listEl?.prepend(el);
    el.querySelectorAll(".wanai-id").forEach(sp=>{
      sp.addEventListener("click",()=>{ const t=sp.getAttribute("data-id")||sp.textContent; navigator.clipboard.writeText(t||""); });
    });
    return el;
  }

  function renderSourceDropdown(){
    if (!sourceSelEl) return;
    const list = loadSources();
    sourceSelEl.innerHTML = "";
    if (!list.length){
      const opt=document.createElement("option"); opt.value=""; opt.textContent="(No sources — open Settings)"; sourceSelEl.appendChild(opt);
    } else {
      const active = getActiveSourceId();
      list.forEach(s=>{
        const opt=document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.label || s.sourceTab || s.outputTab || s.gsUrl || s.id;
        if (s.id===active) opt.selected = true;
        sourceSelEl.appendChild(opt);
      });
    }
    sourceSelEl.onchange = ()=>{
      clearLogs();
      setActiveSourceId(sourceSelEl.value);
      const src = getActiveSource();
      if (src) addItem(`🔁 Active source → <b>${escapeHtml(src.label || src.sourceTab || src.outputTab || src.gsUrl)}</b>`,"wanai-ok");
      else addItem("ℹ️ No active source selected.","wanai-warn");
    };
  }

  function renderSettingsModal(){
    const mask = document.createElement("div"); mask.className = "wanai-modal-mask";
    const wrap = document.createElement("div"); wrap.className = "wanai-modal";
    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;">
        <div style="font-weight:700;">Google Sheets Sources</div>
        <div class="wanai-row-inline">
          <button id="wanai_add_source" class="wanai-mini">Add Source</button>
          <button id="wanai_close_settings" class="wanai-mini">Close</button>
        </div>
      </div>
      <div class="wanai-grid">
        <div class="wanai-list-sources" id="wanai_sources_list"></div>
      </div>
    `;
    mask.appendChild(wrap);
    settingsModalEl.innerHTML = ""; settingsModalEl.appendChild(mask);
    settingsModalEl.classList.remove("wanai-hide");

    const listEl = wrap.querySelector("#wanai_sources_list");
    const btnAdd = wrap.querySelector("#wanai_add_source");
    const btnClose = wrap.querySelector("#wanai_close_settings");

    function renderList(){
      const data = loadSources(); listEl.innerHTML = "";
      if (!data.length){ listEl.innerHTML = `<div class="wanai-sm" style="opacity:.8;">No sources yet. Click “Add Source”.</div>`; return; }
      const active = getActiveSourceId();
      data.forEach((s,idx)=>{
        const row = document.createElement("div"); row.className="wanai-src-item";
        row.innerHTML = `
          <div>
            <div class="wanai-src-label">${escapeHtml(s.label || `(Source ${idx+1})`)}</div>
            <div class="wanai-sm" style="opacity:.8;">${escapeHtml(s.gsUrl || "")}</div>
            <div class="wanai-sm" style="opacity:.8;">Src Tab: <b>${escapeHtml(s.sourceTab||"")}</b> • Prompt: <b>${escapeHtml(s.promptCol||"")}</b> • Status: <b>${escapeHtml(s.statusCol||"")}</b> • Rows: <b>${escapeHtml(String(s.startRow||""))}-${escapeHtml(String(s.endRow||""))}</b> • Out Tab: <b>${escapeHtml(s.outputTab||"")}</b></div>
          </div>
          <button data-id="${s.id}" class="wanai-mini btn-edit">Edit</button>
          <button data-id="${s.id}" class="wanai-mini btn-make-active" ${s.id===active?"disabled":""}>Make Active</button>
          <button data-id="${s.id}" class="wanai-mini btn-delete">Delete</button>
        `;
        listEl.appendChild(row);
      });
      listEl.querySelectorAll(".btn-edit").forEach(b=>b.addEventListener("click", ()=>openEditForm(b.getAttribute("data-id"))));
      listEl.querySelectorAll(".btn-delete").forEach(b=>b.addEventListener("click", ()=>{
        const id=b.getAttribute("data-id"); const cur=loadSources(); const next=cur.filter(s=>s.id!==id);
        saveSources(next); if(getActiveSourceId()===id) setActiveSourceId(next[0]?.id||""); renderList(); renderSourceDropdown();
      }));
      listEl.querySelectorAll(".btn-make-active").forEach(b=>b.addEventListener("click", ()=>{
        setActiveSourceId(b.getAttribute("data-id")); renderList(); renderSourceDropdown();
      }));
    }

    function openEditForm(id){
      const data = loadSources();
      const src = data.find(s=>s.id===id) || { id: uuid(), label:"", gsUrl:"", sourceTab:"", promptCol:"", statusCol:"", startRow:2, endRow:9999, outputTab:"" };
      const dlg = document.createElement("div");
      dlg.style.marginTop="10px";
      dlg.innerHTML = `
        <div class="wanai-grid" style="border:1px solid #2a2a2a;border-radius:8px;padding:10px;margin-top:6px;">
          <label class="wanai-sm">Label <input id="f_label" class="wanai-input" value="${escapeHtml(src.label)}" placeholder="Friendly name"></label>
          <label class="wanai-sm">GAS Web App URL <input id="f_url" class="wanai-input" value="${escapeHtml(src.gsUrl)}" placeholder="https://script.google.com/macros/s/.../exec"></label>
          <div class="wanai-row-inline">
            <label class="wanai-sm" style="flex:1;">Source Tab <input id="f_src_tab" class="wanai-input" value="${escapeHtml(src.sourceTab)}" placeholder="VIDEO DETAILS"></label>
            <label class="wanai-sm" style="width:140px;">Prompt Col <input id="f_pcol" class="wanai-input" value="${escapeHtml(src.promptCol)}" placeholder="P"></label>
            <label class="wanai-sm" style="width:140px;">Status Col <input id="f_qcol" class="wanai-input" value="${escapeHtml(src.statusCol)}" placeholder="Q"></label>
          </div>
          <div class="wanai-row-inline">
            <label class="wanai-sm" style="width:140px;">Start Row <input id="f_start" type="number" class="wanai-input" value="${escapeHtml(String(src.startRow))}" placeholder="2"></label>
            <label class="wanai-sm" style="width:140px;">End Row <input id="f_end" type="number" class="wanai-input" value="${escapeHtml(String(src.endRow))}" placeholder="9999"></label>
            <label class="wanai-sm" style="flex:1;">Output Tab <input id="f_out_tab" class="wanai-input" value="${escapeHtml(src.outputTab)}" placeholder="WAN.ai VIDs"></label>
          </div>
          <div class="wanai-row-inline" style="justify-content:flex-end;">
            <button class="wanai-mini" id="f_save">Save</button>
          </div>
        </div>
      `;
      wrap.querySelector(".wanai-grid").prepend(dlg);

      dlg.querySelector("#f_save").addEventListener("click", ()=>{
        const obj = {
          id: src.id || uuid(),
          label: dlg.querySelector("#f_label").value.trim(),
          gsUrl: dlg.querySelector("#f_url").value.trim(),
          sourceTab: dlg.querySelector("#f_src_tab").value.trim(),
          promptCol: dlg.querySelector("#f_pcol").value.trim(),
          statusCol: dlg.querySelector("#f_qcol").value.trim(),
          startRow: Number(dlg.querySelector("#f_start").value || 2),
          endRow: Number(dlg.querySelector("#f_end").value || 9999),
          outputTab: dlg.querySelector("#f_out_tab").value.trim(),
        };
        if (!obj.gsUrl || !obj.sourceTab || !obj.promptCol || !obj.statusCol || !obj.outputTab){
          alert("Please fill URL, Source Tab, Prompt Col, Status Col, and Output Tab.");
          return;
        }
        const arr = loadSources();
        const idx = arr.findIndex(x=>x.id===obj.id);
        if (idx>=0) arr[idx]=obj; else arr.push(obj);
        saveSources(arr);
        if (!getActiveSourceId()) setActiveSourceId(obj.id);
        renderList(); renderSourceDropdown();
      });
    }

    btnAdd.addEventListener("click", ()=>openEditForm("__new__"));
    btnClose.addEventListener("click", ()=>{ settingsModalEl.classList.add("wanai-hide"); settingsModalEl.innerHTML=""; });
    renderList();
  }

  function buildUI(){
    const box = document.createElement("div");
    box.id = APP_ID;
    box.style.display = "none"; // hidden by default
    box.innerHTML = `
      <div class="wanai-head">
        <div class="wanai-title">WAN AI — Batch Text→Video</div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <label class="wanai-sm">Source</label>
          <select id="wanai_source" class="wanai-mini" style="min-width:200px"></select>
          <button id="wanai_open_settings" class="wanai-mini">Settings</button>

          <label class="wanai-sm">Batch</label>
          <select id="wanai_batch" class="wanai-mini">
            <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option>
          </select>
          <label class="wanai-sm">Poll (sec)</label>
          <input id="wanai_poll_sec" type="number" class="wanai-mini" style="width:70px" value="12" min="5">
          <label class="wanai-sm">Timeout (min)</label>
          <input id="wanai_timeout_min" type="number" class="wanai-mini" style="width:70px" value="20" min="1">
          <label class="wanai-sm">/cycle</label>
          <input id="wanai_limit" type="number" class="wanai-mini" style="width:60px" value="${getSheetRunLimit()}" min="1" max="10" title="Max rows per cycle from sheet">

          <label class="wanai-sm" style="display:flex;align-items:center;gap:6px;">
            <input type="checkbox" id="wanai_use_credits"> Use credits
          </label>
          <label class="wanai-sm">Model</label>
          <select id="wanai_model" class="wanai-mini">
            <option value="2_2_max">2_2_max</option>
            <option value="2_1_max">2_1_max</option>
            <option value="2_1_turbo">2_1_turbo (default)</option>
          </select>
        </div>
      </div>

      <div class="wanai-body">
        <textarea id="wanai_ta" class="wanai-ta" placeholder="Enter prompts (one per line)…"></textarea>

        <div class="wanai-row wanai-controls">
          <button id="wanai_start" class="wanai-btn">Start Auto</button>
          <button id="wanai_stop" class="wanai-mini">Stop</button>

          <button id="wanai_capture" class="wanai-mini">Capture</button>
          <button id="wanai_push" class="wanai-mini">Push to Sheets</button>
          <button id="wanai_from_sheet" class="wanai-mini">From Sheet (Auto)</button>

          <label class="wanai-sm" style="display:flex;align-items:center;gap:6px;">
            <input type="checkbox" id="wanai_toggle_manual"> Show “Add ID”
          </label>

          <button id="wanai_clear_saved" class="wanai-mini">Clear Saved</button>

          <div class="wanai-status" style="margin-left:auto;">
            <span id="wanai_cnt">0</span> / <span id="wanai_tot">0</span> submitted • <span id="wanai_batch_prog">—</span>
          </div>
        </div>

        <div class="wanai-row wanai-hide" id="wanai_manual_row">
          <input id="wanai_manual_id" class="wanai-input" placeholder="Paste taskId to track…" style="flex:1;min-width:160px;" />
          <button id="wanai_add_manual" class="wanai-mini">Add ID</button>
        </div>

        <div class="wanai-list" id="wanai_list"></div>
        <div class="wanai-table-wrap wanai-hide" id="wanai_table_wrap"><div id="wanai_table"></div></div>
      </div>

      <div class="wanai-foot">
        <div class="wanai-prog"><span id="wanai_bar"></span></div>
        <div class="wanai-sm">ID click = copy • Table appears after CAPTURE</div>
      </div>

      <div id="wanai_settings_modal" class="wanai-hide"></div>
    `;
    document.body.appendChild(box);

    // refs
    const ta = box.querySelector("#wanai_ta");
    startBtn = box.querySelector("#wanai_start");
    stopBtn  = box.querySelector("#wanai_stop");
    captureBtn = box.querySelector("#wanai_capture");
    pushBtn    = box.querySelector("#wanai_push");
    fromSheetBtn = box.querySelector("#wanai_from_sheet");

    const clearBtn = box.querySelector("#wanai_clear_saved");
    const batchSel   = box.querySelector("#wanai_batch");
    const pollSecEl  = box.querySelector("#wanai_poll_sec");
    const timeoutEl  = box.querySelector("#wanai_timeout_min");
    const limitEl    = box.querySelector("#wanai_limit");

    const toggleManual = box.querySelector("#wanai_toggle_manual");
    manualRow   = box.querySelector("#wanai_manual_row");
    manualInput = box.querySelector("#wanai_manual_id");
    const addManualBtn = box.querySelector("#wanai_add_manual");

    cntEl = box.querySelector("#wanai_cnt");
    totEl = box.querySelector("#wanai_tot");
    listEl = box.querySelector("#wanai_list");
    tableEl = box.querySelector("#wanai_table");
    tableWrapEl = box.querySelector("#wanai_table_wrap");
    bar = box.querySelector("#wanai_bar");
    batchProgEl = box.querySelector("#wanai_batch_prog");

    // Source dropdown + settings
    sourceSelEl = box.querySelector("#wanai_source");
    openSettingsBtn = box.querySelector("#wanai_open_settings");
    settingsModalEl = box.querySelector("#wanai_settings_modal");
    renderSourceDropdown();

    // Settings modal open
    openSettingsBtn.addEventListener("click", ()=>{ clearLogs(); renderSettingsModal(); });

    // prefs
    const useCreditsEl = box.querySelector("#wanai_use_credits");
    useCreditsEl.checked = getDeductMode() === "credit_mode";
    useCreditsEl.addEventListener("change", ()=>{
      clearLogs(); setDeductMode(useCreditsEl.checked?"credit_mode":"relax_mode");
      addItem(`⚙️ deductMode set to ${getDeductMode()}`,"wanai-ok");
    });

    const modelSel = box.querySelector("#wanai_model");
    modelSel.value = getModelVersion();
    modelSel.addEventListener("change", ()=>{
      clearLogs(); setModelVersion(modelSel.value);
      addItem(`⚙️ modelVersion set to ${getModelVersion()}`,"wanai-ok");
    });

    limitEl.addEventListener("change", ()=>{
      clearLogs(); setSheetRunLimit(limitEl.value);
      addItem(`📦 Per-cycle limit set to ${getSheetRunLimit()}`,"wanai-ok");
    });

    // Manual row toggle
    toggleManual.addEventListener("change", ()=>{ clearLogs(); manualRow.classList.toggle("wanai-hide", !toggleManual.checked); });

    // Manual add
    addManualBtn.addEventListener("click", ()=>{
      clearLogs();
      const tid = (manualInput.value||"").trim();
      if(!tid) return addItem("ℹ️ Enter a taskId first.","wanai-warn");
      const existing = loadSavedIds();
      if(existing.find(r=>r.taskId===tid)){ addItem("ℹ️ Already tracking that taskId.","wanai-warn"); manualInput.value=""; return; }
      saveTaskIdRecord(tid,"(manual)"); addItem(`➕ Tracking manual taskId: <span class="wanai-id" data-id="${escapeHtml(tid)}">${escapeHtml(tid)}</span>`,"wanai-ok");
      manualInput.value="";
    });

    // Clear saved
    clearBtn.addEventListener("click", ()=>{
      clearLogs(); clearSavedIds(); lastCapturedRows = []; if(tableEl) tableEl.innerHTML=""; tableWrapEl.classList.add("wanai-hide");
      addItem("🧹 Cleared saved IDs and reset panel.","wanai-warn"); setBtnBusy(clearBtn,false,true,false);
    });

    // START AUTO
    startBtn.addEventListener("click", async ()=>{
      clearLogs(); __SHOW_TABLE__ = false;
      if (__RUN_AUTO__) { addItem("ℹ️ Auto already running.","wanai-warn"); return; }
      const lines = (ta.value||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      if (!lines.length) return addItem("ℹ️ Please enter at least one prompt.","wanai-err");
      if (!validateActiveSource(true)) return;

      const hdr = getReusedHeaders();
      if (!hdr["authorization"] && !hdr["x-csrf-token"] && !hdr["x-xsrf-token"]) addItem("💡 If 401/403 occurs, do one normal generation to capture auth/CSRF headers.","wanai-warn");

      __RUN_AUTO__ = true; setBtnBusy(startBtn,true);
      tableWrapEl.classList.add("wanai-hide"); cntEl.textContent="0"; totEl.textContent=String(lines.length);

      const perBatch = Math.max(1, parseInt(batchSel?.value||"3", 10));
      const pollSec  = Math.max(5, parseInt(pollSecEl?.value||"12", 10));
      const timeoutM = Math.max(1, parseInt(timeoutEl?.value||"20", 10));

      setProgress(0, lines.length);
      const batches = chunk(lines, perBatch);

      try{
        for(let b=0;b<batches.length;b++){
          batchProgEl.textContent = `Batch ${b+1}/${batches.length}`;
          const idsInBatch = [];
          for(let i=0;i<batches[b].length;i++){
            const prompt = batches[b][i];
            const rowEl = addItem(`▶️ <b>#${(batches.slice(0,b).flat().length)+i+1}</b> ${escapeHtml(truncate(prompt,120))}<br>taskId: <span class="wanai-id wanai-task" data-id="">(pending)</span><div class="wanai-statusline wanai-sm">Status: creating…</div>`);
            try{
              const {ok,status,body,taskId} = await createTask(prompt);
              if (ok && taskId){
                const idSpan=rowEl.querySelector(".wanai-task"); idSpan.textContent=taskId; idSpan.setAttribute("data-id",taskId);
                rowEl.classList.add("wanai-ok"); rowEl.querySelector(".wanai-statusline").textContent="Status: queued";
                idsInBatch.push({ taskId, prompt, el: rowEl }); saveTaskIdRecord(taskId, prompt);
                cntEl.textContent = String(parseInt(cntEl.textContent,10)+1);
              } else {
                rowEl.classList.add("wanai-err");
                rowEl.querySelector(".wanai-statusline").innerHTML = `Status: create failed (${status}) ${escapeHtml(formatErr(body))}`;
              }
            }catch(e){
              rowEl.classList.add("wanai-err"); rowEl.querySelector(".wanai-statusline").textContent = `Status: error (${e?.message||e})`;
            }
            await sleep(700); setProgress(parseInt(cntEl.textContent,10), lines.length);
          }

          if (idsInBatch.length){
            addItem(`🔎 Monitoring ${idsInBatch.length} task(s) via pagingList…`);
            await monitorBatchByPagingList(idsInBatch, { pollSec, timeoutMin: timeoutM }, ()=>{ if(__SHOW_TABLE__) renderResultsTable(idsInBatch); });
            addItem(`✅ Batch ${b+1} finished (or timed out).`);
            // don't force-show table during auto unless later captured
          }
          if (isStopping()) break;
        }
        addItem("🏁 All batches processed."); setBtnBusy(startBtn,false,true,false);
      }catch(e){
        addItem(`⚠️ Auto run aborted: ${e?.message||e}`,"wanai-err"); setBtnBusy(startBtn,false,false,true);
      }finally{
        __RUN_AUTO__ = false; batchProgEl.textContent = "—";
      }
    });

    // STOP
    stopBtn.addEventListener("click", ()=>{
      clearLogs(); sessionStorage.setItem("__WAN_STOPPING__","1"); setTimeout(()=>sessionStorage.removeItem("__WAN_STOPPING__"),250);
      addItem("⏹ Stopping after current step…"); setBtnBusy(stopBtn,false,true,false);
    });

    // CAPTURE
    captureBtn.addEventListener("click", async ()=>{
      clearLogs(); __SHOW_TABLE__ = true;
      setBtnBusy(captureBtn,true);
      tableWrapEl.classList.add("wanai-hide");
      await captureFromPagingList().catch(()=>{});
      setBtnBusy(captureBtn,false,true,false);
    });

    // PUSH
    pushBtn.addEventListener("click", async ()=>{
      clearLogs(); setBtnBusy(pushBtn,true);
      try{ await pushRowsToSheets(lastCapturedRows); setBtnBusy(pushBtn,false,true,false); }
      catch{ setBtnBusy(pushBtn,false,false,true); }
    });

    // FROM SHEET (auto)
    fromSheetBtn.addEventListener("click", async ()=>{
      clearLogs(); __SHOW_TABLE__ = false;
      if (__RUN_FROM_SHEET__){ addItem("ℹ️ From Sheet is already running.","wanai-warn"); return; }
      if (!validateActiveSource(true)) return;

      const hdr = getReusedHeaders();
      if (!hdr["authorization"] && !hdr["x-csrf-token"] && !hdr["x-xsrf-token"]) addItem("💡 If 401/403 occurs, do one normal generation to capture auth/CSRF headers.","wanai-warn");

      __RUN_FROM_SHEET__ = true; setBtnBusy(fromSheetBtn,true);
      tableWrapEl.classList.add("wanai-hide"); cntEl.textContent="0"; totEl.textContent="0"; setProgress(0,0);

      const pollSec  = Math.max(5, parseInt((document.querySelector("#wanai_poll_sec")?.value)||"12",10));
      const timeoutM = Math.max(1, parseInt((document.querySelector("#wanai_timeout_min")?.value)||"20",10));
      const perCycle = getSheetRunLimit();

      let cycle=0; let totalSubmitted=0; let hadError=false;
      try{
        while(true){
          if (isStopping()){ addItem("⏹ Stopped by user before fetching next batch."); break; }
          addItem("📖 Loading prompts from sheet…");
          const candidates = await gsGetPrompts(); // [{row, prompt}]
          const bounded = candidates.filter(r=>r.row>=SOURCE_START_ROW() && r.row<=SOURCE_END_ROW());
          if (!bounded.length){ addItem("🏁 No more eligible prompts.","wanai-ok"); break; }
          const picked = bounded.slice(0, perCycle);
          cycle+=1; addItem(`📦 Cycle ${cycle}: submitting ${picked.length} prompt(s)…`);
          await submitAndMonitorSheetBatch(picked, pollSec, timeoutM);
          totalSubmitted += picked.length;
          await sleep(1000);
        }
      }catch(e){
        hadError = true; addItem(`⚠️ From Sheet aborted: ${e?.message||e}`,"wanai-err");
      }finally{
        __RUN_FROM_SHEET__ = false; setBtnBusy(fromSheetBtn,false,!hadError,hadError);
        addItem(`🎉 Done. Total submitted this run: ${totalSubmitted}.`, hadError?"wanai-warn":"wanai-ok");
      }
    });
  }


  /** ================= Helpers & Validators ================= **/
  function formatErr(body){
    if(!body) return "";
    if(typeof body==="string") return body.slice(0,200);
    try{
      if(body.message) return `message="${String(body.message).slice(0,200)}"`;
      if(body.error)   return `error="${String(body.error).slice(0,200)}"`;
      return JSON.stringify(body).slice(0,240);
    }catch{ return ""; }
  }

  function validateActiveSource(hint){
    const s = getActiveSource();
    if(!s){ if(hint) addItem("❗ No source configured. Click Settings → Add Source.","wanai-err"); return false; }
    if(!GS_WEBAPP_URL() || !SOURCE_SHEET_TAB() || !SOURCE_PROMPT_COL() || !SOURCE_STATUS_COL() || !GS_SHEET_TAB()){
      if(hint) addItem("❗ Active source incomplete. Fill URL, Source Tab, Prompt Col, Status Col, Output Tab.","wanai-err");
      return false;
    }
    return true;
  }

  function renderResultsTable(items){
    if (!__SHOW_TABLE__) return;
    if (!items || !items.length){ if(tableWrapEl) tableWrapEl.classList.add("wanai-hide"); return; }
    const rows = items.map(it=>({ taskId: it.taskId||"", prompt: it.prompt||"", status: it.statusNorm||"—", downloadUrl: it.downloadUrl||"" }));
    const html = `
      <table>
        <thead><tr><th class="col-id">TASKID</th><th class="col-prompt">PROMPT</th><th class="col-status">STATUS</th><th class="col-url">downloadUrl</th></tr></thead>
        <tbody>
          ${rows.map(r=>`
            <tr>
              <td class="crop">${escapeHtml(r.taskId)}</td>
              <td class="crop">${escapeHtml(r.prompt)}</td>
              <td class="crop">${escapeHtml(r.status)}</td>
              <td class="crop">${r.downloadUrl ? `<a class="wanai-link" href="${r.downloadUrl}" target="_blank">${escapeHtml(r.downloadUrl)}</a>` : "—"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
    if (tableEl) tableEl.innerHTML = html;
    if (tableWrapEl) tableWrapEl.classList.remove("wanai-hide");
  }

  /** ================= GAS: get_prompts / mark_submitted ================= **/
  function gsGetPrompts(){
    const url = `${GS_WEBAPP_URL()}?action=get_prompts` +
      `&sheet=${encodeURIComponent(SOURCE_SHEET_TAB())}` +
      `&pcol=${encodeURIComponent(SOURCE_PROMPT_COL())}` +
      `&qcol=${encodeURIComponent(SOURCE_STATUS_COL())}` +
      `&start=${SOURCE_START_ROW()}` +
      `&end=${SOURCE_END_ROW()}` +
      `&_t=${Date.now()}`;
    return new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:"GET", url,
        onload:(res)=>{
          try{
            const body = JSON.parse(res.responseText || "null");
            if (res.status>=200 && res.status<300 && body && body.ok && Array.isArray(body.rows)){
              const cleaned = body.rows
                .filter(r => (r.prompt||"").trim() && String(r.status||"").trim().toUpperCase()!=="SUBMITTED")
                .map(r => ({ row:Number(r.row), prompt:String(r.prompt||"") }));
              resolve(cleaned);
            } else {
              addItem(`⚠️ GAS get_prompts failed: HTTP ${res.status}`,"wanai-err"); resolve([]);
            }
          }catch{ addItem("⚠️ GAS get_prompts: bad JSON","wanai-err"); resolve([]); }
        },
        onerror:()=>{ addItem("⚠️ GAS get_prompts: network error","wanai-err"); resolve([]); },
        timeout:30000
      });
    });
  }

  function gsMarkSubmitted(rows){
    if(!rows || !rows.length) return Promise.resolve(true);
    return new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:"POST", url: GS_WEBAPP_URL(),
        headers:{ "Content-Type":"application/json" },
        data: JSON.stringify({ action:"mark_submitted", sheet: SOURCE_SHEET_TAB(), statusCol: SOURCE_STATUS_COL(), rows, value: "SUBMITTED" }),
        onload:(res)=>{
          try{
            const body = JSON.parse(res.responseText||"null");
            if (res.status>=200 && res.status<300 && body && body.ok) resolve(true);
            else { addItem(`⚠️ GAS mark_submitted failed: HTTP ${res.status}`,"wanai-err"); resolve(false); }
          }catch{ addItem("⚠️ GAS mark_submitted: bad JSON","wanai-err"); resolve(false); }
        },
        onerror:()=>{ addItem("⚠️ GAS mark_submitted: network error","wanai-err"); resolve(false); },
        timeout:30000
      });
    });
  }

  /** ================= WAN: createTask / pagingList ================= **/
  const BUILD_CREATE_PAYLOAD = (prompt)=>({
    deductMode: (getDeductMode()==="credit_mode"?"credit_mode":"relax_mode"),
    taskType: "text_to_video",
    taskInput: {
      subType: "basic",
      modelVersion: getModelVersion(),
      modelIds: [],
      generationMode: "imaginative",
      prompt,
      resolution: "720*1280",
      videoSoundSwitch: "on",
    }
  });

  async function createTask(prompt){
    const headers = getReusedHeaders(); headers["content-type"]="application/json";
    const res = await fetch(CREATE_API_URL, { method:"POST", credentials:"include", headers, body: JSON.stringify(BUILD_CREATE_PAYLOAD(prompt)) });
    const ctype = res.headers.get("content-type")||""; let body=null; try{ body = ctype.includes("json")?await res.json():await res.text(); }catch{}
    let ok = res.ok; if (!ok && body && typeof body==="object"){ if (body.success===true || body.code===0) ok=true; }
    const taskId = typeof body==="object" ? extractTaskIdLoose(body) : null;
    return { ok, status: res.status, body, taskId };
  }

  function extractTaskIdLoose(body){
    if(!body || typeof body!=="object") return null;
    if(body.taskId) return String(body.taskId);
    if(body.data?.taskId) return String(body.data.taskId);
    if(body.result?.taskId) return String(body.result.taskId);
    if(body.data?.id) return String(body.data.id);
    if(body.id) return String(body.id);
    if(Array.isArray(body.data) && body.data[0]?.taskId) return String(body.data[0].taskId);
    if(typeof body.data === "string" && body.data.trim()) return body.data.trim();
    return null;
  }

  async function pagingListMultiPage(maxPages=5, pageSize=100){
    const headers = getReusedHeaders();
    try{
      let all=[]; for(let p=1;p<=maxPages;p++){
        const res = await fetch(PAGING_GET_URL(p,pageSize), { method:"GET", credentials:"include", headers });
        const ctype = res.headers.get("content-type")||""; if(!res.ok || !ctype.includes("json")) break;
        const body = await res.json(); const arr = extractArrayFromPaging(body);
        if(!arr.length) break; all=all.concat(arr); if(arr.length<pageSize) break;
      }
      if(all.length) return all;
    }catch{}
    try{
      const res2 = await fetch(PAGING_POST_URL, { method:"POST", credentials:"include", headers:{...headers,"content-type":"application/json"}, body: JSON.stringify({pageNo:1,pageSize}) });
      const ctype2 = res2.headers.get("content-type")||""; if(res2.ok && ctype2.includes("json")){ const body2=await res2.json(); return extractArrayFromPaging(body2); }
    }catch{}
    return [];
  }
  function extractArrayFromPaging(body){ if(!body) return []; const d=body.data; if(Array.isArray(d)) return d; if(Array.isArray(d?.list)) return d.list; if(Array.isArray(d?.records)) return d.records; return []; }

  function statusFromItem(it){
  const raw = it?.taskStatus ?? it?.status ?? it?.taskState ?? it?.state ?? it?.phase ?? "";
  // Handle numeric codes directly (WAN "Service Status")
  if (typeof raw === "number") {
    if (raw === 2) return "success";
    // (Optional) Map other numeric codes if WAN documents them; otherwise treat non-2 as processing
    if (raw === 3 || raw === 4 || raw === -1) return "failed";
    return "processing";
  }
  const s = String(raw||"").toLowerCase();
  if (["2","success","succeed","succeeded","finished","done","completed","complete"].includes(s)) return "success";
  if (["fail","failed","error","canceled","cancelled"].includes(s)) return "failed";
  if (!s || ["init","created","queued","queue","queuing","waiting","pending","running","processing","executing"].includes(s)) return "processing";
  return s;
}

    function isReadyRecord(rec, priorDownloadUrl){
  // 1) status==2 via statusFromItem → "success"
  const st = statusFromItem(rec);
  if (st === "success") return true;

  // 2) downloadUrl present in this poll
  const dl = pickDownloadUrlFromResult(rec?.taskResult);
  if (dl && dl.trim()) return true;

  // 3) already had a downloadUrl from prior polling
  if (priorDownloadUrl && priorDownloadUrl.trim()) return true;

  return false;
}


  function pickDownloadUrlFromResult(taskResult){ if(!Array.isArray(taskResult)) return ""; for(const r of taskResult){ if(r && typeof r==="object" && r.downloadUrl) return String(r.downloadUrl); } return ""; }

  async function monitorBatchByPagingList(items, {pollSec, timeoutMin}, onTick){
  const since   = Date.now();
  const pollMs  = Math.max(5000, (pollSec||12) * 1000);
  const maxMs   = Math.max(60000, (timeoutMin||20) * 60 * 1000);

  function applyUI(it, status, downloadUrl){
    it.statusNorm = status;
    if (downloadUrl) it.downloadUrl = downloadUrl;
    if (it.el){
      const ln = it.el.querySelector(".wanai-statusline");
      const linkHtml = (it.downloadUrl && it.downloadUrl.trim())
        ? ` • <a href="${it.downloadUrl}" target="_blank" class="wanai-link">video</a>` : "";
      if (ln) ln.innerHTML = `Status: <b>${status}</b>${linkHtml}`;
      it.el.classList.remove("wanai-warn","wanai-err","wanai-ok");
      if (status === "success" || status === "ready") it.el.classList.add("wanai-ok");
      else if (status === "failed" || status === "timeout" || status === "blocked") it.el.classList.add("wanai-err");
      else it.el.classList.add("wanai-warn");
    }
  }

  // Initialize UI as "processing"
  items.forEach(it => applyUI(it, it.downloadUrl ? "ready" : "processing", it.downloadUrl || ""));

  while (true){
    if (isStopping()) break;

    // TIMEOUT → block the batch (do NOT advance)
    if (Date.now() - since > maxMs){
      items.forEach(it => {
        if (!["ready","success","failed"].includes(it.statusNorm)) applyUI(it, "timeout", it.downloadUrl || "");
      });
      onTick?.();
      // Throw to stop the caller's flow (prevents advancing to next batch)
      throw new Error("BATCH_BLOCKED_TIMEOUT");
    }

    // Pull multiple pages to avoid older tasks falling off page 1
    const list = await pagingListMultiPage(8, 100);
    const map  = new Map();
    for (const entry of list){
      const tid = String(entry?.taskId || "");
      if (tid) map.set(tid, entry);
    }

    let allReady = true;
    let anyFailed = false;

    for (const it of items){
      const rec = map.get(it.taskId);

      if (!rec){
        // Unknown in this poll; keep waiting unless we already have a downloadUrl
        if (it.downloadUrl && it.downloadUrl.trim()){
          applyUI(it, "ready", it.downloadUrl);
        } else {
          // still waiting
          allReady = false;
          applyUI(it, it.statusNorm || "processing", it.downloadUrl || "");
        }
        continue;
      }

      // Evaluate readiness
      const st = statusFromItem(rec);
      const dl = pickDownloadUrlFromResult(rec?.taskResult) || it.downloadUrl || "";

      if (st === "failed"){
        anyFailed = true;
        applyUI(it, "failed", dl);
        continue;
      }

      if (isReadyRecord(rec, it.downloadUrl)){
        applyUI(it, "ready", dl);
      } else {
        allReady = false;
        applyUI(it, "processing", dl);
      }
    }

    onTick?.();

    // If any failed → block this batch and stop
    if (anyFailed){
      throw new Error("BATCH_BLOCKED_FAILED");
    }

    // Only proceed when ALL tasks in this batch are ready
    if (allReady){
      // Normalize all to "success" for downstream UI consistency
      items.forEach(it => applyUI(it, "success", it.downloadUrl || ""));
      return; // allow caller to advance to NEXT BATCH
    }

    await sleep(pollMs);
  }
}


  /** ================= Capture & Push ================= **/
  async function fetchPagingListOnce(pageNo=1,pageSize=100){
    const headers = getReusedHeaders();
    try{
      const res = await fetch(PAGING_GET_URL(pageNo,pageSize), { method:"GET", credentials:"include", headers });
      const ctype=res.headers.get("content-type")||""; if(res.ok && ctype.includes("json")) return await res.json();
    }catch{}
    try{
      const res2 = await fetch(PAGING_POST_URL, { method:"POST", credentials:"include", headers:{...headers,"content-type":"application/json"}, body: JSON.stringify({pageNo,pageSize}) });
      const ctype2=res2.headers.get("content-type")||""; if(res2.ok && ctype2.includes("json")) return await res2.json();
    }catch(e){ addItem(`⚠️ pagingList error: ${e?.message||e}`,"wanai-err"); }
    return null;
  }
  function extractArrayFromCapture(body){ if(!body) return []; const d=body.data; if(Array.isArray(d)) return d; if(Array.isArray(d?.list)) return d.list; if(Array.isArray(d?.records)) return d.records; return []; }

  function cleanPrompt(p) {
  if (!p) return "";
  return String(p).replace(/\\\\'/g, "'").replace(/\\'/g, "'");
}


  async function captureFromPagingList(){
    const saved = loadSavedIds();
    if(!saved.length){ addItem("ℹ️ No saved taskIds. Submit prompts first or add IDs manually.","wanai-warn"); renderResultsTable([]); lastCapturedRows=[]; return; }
    const want = new Set(saved.map(s=>s.taskId));
    const preferPromptMap = new Map(saved.map(s=>[s.taskId, s.prompt||""]));

    const body = await fetchPagingListOnce(1,100);
    if(!body || body.success===false){ addItem("⚠️ Could not fetch pagingList (check auth/headers).","wanai-err"); renderResultsTable([]); lastCapturedRows=[]; return; }
    const arr = extractArrayFromCapture(body);
    const rows=[];
    for(const item of arr){
      const tid = item?.taskId || ""; if(!tid || !want.has(tid)) continue;
      const ti = item?.taskInput || {};
      const prompt = cleanPrompt(ti.prompt || ti.generationModePrompt || preferPromptMap.get(tid) || "");
      const dl = pickDownloadUrlFromResult(item?.taskResult);
      const st = statusFromItem(item);
      rows.push({ taskId:String(tid), prompt, downloadUrl: dl||"", status: st });
    }
    lastCapturedRows = rows.map(r=>({ taskId:r.taskId, prompt:r.prompt, downloadUrl:r.downloadUrl }));
    renderResultsTable(rows);
    addItem(`📥 Captured ${rows.length} item(s) from pagingList.`);
  }

  function pushRowsToSheets(rows){
    if(!validateActiveSource(true)) return;
    if(!rows || !rows.length){ addItem("ℹ️ Nothing to push. Click Capture or finish a batch first.","wanai-warn"); return; }
    const payloadRows = rows.map(r=>[r.taskId||"", r.prompt||"", r.downloadUrl||""]);
    const payload = JSON.stringify({ sheet: GS_SHEET_TAB(), rows: payloadRows });

    GM_xmlhttpRequest({
      method:"POST", url: GS_WEBAPP_URL(), headers:{ "Content-Type":"application/json" }, data: payload,
      onload:(res)=>{
        try{
          const body = JSON.parse(res.responseText||"{}");
          if(res.status>=200 && res.status<300 && body.ok){ addItem(`✅ Pushed ${payloadRows.length} row(s) to Google Sheets.`,"wanai-ok"); }
          else { addItem(`⚠️ Push failed: HTTP ${res.status} — ${body.error||"Unknown error"}`,"wanai-err"); }
        }catch{ addItem("⚠️ Push failed: Bad JSON response from GAS.","wanai-err"); }
      },
      onerror:(e)=>addItem(`⚠️ Push failed: ${e?.error||"Network error"}`,"wanai-err"),
      ontimeout:()=>addItem("⚠️ Push failed: Timeout","wanai-err"),
      timeout:30000
    });
  }

  /** ================= Submit-from-Sheet helper ================= **/
  async function submitAndMonitorSheetBatch(picked, pollSec, timeoutM){
    const lines = picked.map(p=>p.prompt);
    const rowByIndex = new Map(picked.map((p,i)=>[i,p.row]));
    totEl.textContent = String(lines.length); setProgress(0, lines.length);

    const idsInBatch = [];
    for(let i=0;i<lines.length;i++){
      const prompt = lines[i]; const nGlobal=i+1;
      const rowEl = addItem(`▶️ <b>#${nGlobal}</b> ${escapeHtml(truncate(prompt,120))}<br>taskId: <span class="wanai-id wanai-task" data-id="">(pending)</span><div class="wanai-statusline wanai-sm">Status: creating…</div>`);
      try{
        const { ok, status, body, taskId } = await createTask(prompt);
        if (ok && taskId){
          const idSpan=rowEl.querySelector(".wanai-task"); idSpan.textContent=taskId; idSpan.setAttribute("data-id",taskId);
          rowEl.classList.add("wanai-ok"); rowEl.querySelector(".wanai-statusline").textContent = "Status: queued";
          idsInBatch.push({ taskId, prompt, el: rowEl, sheetRow: rowByIndex.get(i) });
          saveTaskIdRecord(taskId, prompt);
          cntEl.textContent = String(parseInt(cntEl.textContent,10)+1);

          const okWrite = await gsMarkSubmitted([rowByIndex.get(i)]);
          if(!okWrite) addItem(`⚠️ Could not mark row ${rowByIndex.get(i)} as SUBMITTED`,"wanai-warn");
        } else {
          rowEl.classList.add("wanai-err");
          rowEl.querySelector(".wanai-statusline").innerHTML = `Status: create failed (${status}) ${escapeHtml(formatErr(body))}`;
        }
      }catch(e){
        rowEl.classList.add("wanai-err");
        rowEl.querySelector(".wanai-statusline").textContent = `Status: error (${e?.message||e})`;
      }
      await sleep(700); setProgress(parseInt(cntEl.textContent,10), lines.length);
    }

    if (idsInBatch.length){
      addItem(`🔎 Monitoring ${idsInBatch.length} task(s) via pagingList…`);
      await monitorBatchByPagingList(idsInBatch, { pollSec, timeoutMin: timeoutM }, ()=>{ if(__SHOW_TABLE__) renderResultsTable(idsInBatch); });
      addItem(`✅ Batch finished (or timed out).`);
      // update captured rows (not auto-show table)
      lastCapturedRows = idsInBatch.map(it=>({ taskId:it.taskId, prompt:it.prompt, downloadUrl: it.downloadUrl||"" }));
    }
  }


  /** ================= Restore & Boot ================= **/
  function restoreSavedToList(){
    const arr = loadSavedIds();
    if (!arr.length || !listEl) return;
    addItem(`♻️ Restored ${arr.length} saved taskId(s) from previous session.`, "wanai-warn");
    arr.forEach((r,i)=>{
      addItem(`🔁 <b>#${i+1}</b> ${escapeHtml(truncate(r.prompt||"",120))}<br>taskId: <span class="wanai-id" data-id="${escapeHtml(r.taskId)}">${escapeHtml(r.taskId)}</span><div class="wanai-statusline wanai-sm">Status: saved</div>`, "wanai-warn");
    });
  }

  function domReadyPromise(){ return new Promise(r => (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", r, {once:true}) : r()); }

  // Kick-off mount
  (async function init(){
    await domReady();
    ensureToggle();
    await ensureInjected(false);
    restoreSavedToList();
  })();

})();
