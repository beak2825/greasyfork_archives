// ==UserScript==
// @name         OsmAnd link helper (generic, pin links)
// @namespace    jasper-tools
// @version      1.5.3
// @description  Convert address/coords in focused fields into osmand.net/map pin links (split pill + hotkey). No site-specific code.
// @license      GPL-3.0-or-later
// @author       Jasper Aorangi
// @match        https://ksuite.infomaniak.com/*/calendar/*
// @match        https://calendar.google.com/calendar/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      nominatim.openstreetmap.org
// @downloadURL https://update.greasyfork.org/scripts/546816/OsmAnd%20link%20helper%20%28generic%2C%20pin%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546816/OsmAnd%20link%20helper%20%28generic%2C%20pin%20links%29.meta.js
// ==/UserScript==

/*!
 * OsmAnd Link Helper
 * Copyright (C) 2025 Jasper Aorangi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

(() => {
  // ===================== SETTINGS =====================
  const SETTINGS = {
    linkType: "map",        // "map" | "go"  (map → ?pin=LAT,LON#ZOOM/LAT/LON)
    zoom: 17,               // 15=city, 17=street, 18–19=building
    decimals: 6,            // coord precision in URL
    limit: 5,               // max geocoder choices in picker
    countrycodes: "",       // e.g. "us,nz,gb" to bias results
    keepOriginalInClipboard: true,
    debug: true,            // extra console logging

    // ---- Hotkey (configurable) ----
    // Default = Alt+O
    hotkey: { alt: true, ctrl: false, meta: false, shift: false, key: "o" },

    // ---- append options ----
    // "none"             → replace with just the link
    // "link"             → keep original text, newline + link
    // "address_and_link" → address, newline + link
    // "all"              → keep original, newline + address, newline + link
    // ---- hotkey mode ----
    appendMode: "link",
    // ---- split pill modes (LEFT / RIGHT halves) ----
    appendModeLeft: "none",
    appendModeRight: "address_and_link",

    useGeocoderAddressForAppend: true,     // use geocoder's display_name for the address line
    addressLabel: "",                       // e.g. "Address: "
    linkLabel: "",                          // e.g. "OsmAnd: "
    newlineReplacementInSingleLine: " — ",  // <input> can't display "\n"

  };

  // Put this near the top-level (under SETTINGS is fine):
  let actionLock = false;

  // ===================== LOGGING ======================
  const LOG_TAG = "%c[OsmAnd]";
  const LOG_STYLE = "color:#0a84ff;font-weight:bold";
  const log = (...a) => {
    if (!SETTINGS.debug) return;
    try { console.log(LOG_TAG, LOG_STYLE, ...a); } catch(_) {}
  };

  // Match a keyboard event against SETTINGS.hotkey
  const matchesHotkey = (e, hk = SETTINGS.hotkey) => {
    if (!hk) return false;
    const wantKey = String(hk.key || "").toLowerCase();
    const gotKey  = String(e.key || "").toLowerCase();
    return (!!hk.alt   === !!e.altKey)  &&
           (!!hk.ctrl  === !!e.ctrlKey) &&
           (!!hk.meta  === !!e.metaKey) &&
           (!!hk.shift === !!e.shiftKey) &&
           (wantKey === gotKey);
  };

  // Temporarily switch append mode for the duration of an action
  const withAppendMode = async (mode, fn) => {
    const prev = SETTINGS.appendMode;
    SETTINGS.appendMode = mode;
    try { await fn(); } finally { SETTINGS.appendMode = prev; }
  };

  // ===================== UTILS ========================
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const visible = (el) => !!(el && el.getClientRects().length &&
                             getComputedStyle(el).visibility !== "hidden" &&
                             getComputedStyle(el).display !== "none");
  const escapeHtml = (s)=>String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]));

  // apply \n policy for single-line inputs
  const applyNewlinePolicy = (el, text) =>
    (el?.tagName?.toLowerCase() === "input")
      ? String(text).replace(/\r?\n/g, SETTINGS.newlineReplacementInSingleLine)
      : String(text);

  // ===================== TOASTS / PICKER ==============
  const toast = (msg, ok=true) => {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style,{
      position:"fixed",left:"50%",transform:"translateX(-50%)",bottom:"24px",
      padding:"10px 14px",borderRadius:"10px",background:ok?"#0a0a0a":"#7a1d1d",
      color:"#fff",fontSize:"12px",zIndex:2147483647,boxShadow:"0 6px 20px rgba(0,0,0,.25)",
      maxWidth:"80%",textAlign:"center",whiteSpace:"pre-wrap",pointerEvents:"none"
    });
    document.body.appendChild(t); setTimeout(()=>t.remove(),2500);
  };

  // NOTE: Added third parameter onCancel; clicking scrim/Cancel now resolves the awaiting Promise.
  const picker = (results,onPick,onCancel)=>{
    const wrap=document.createElement("div");
    Object.assign(wrap.style,{
      position:"fixed",left:"50%",top:"20%",transform:"translateX(-50%)",
      background:"#fff",color:"#111",border:"1px solid #ccc",borderRadius:"12px",
      zIndex:2147483647,maxWidth:"640px",width:"90%",boxShadow:"0 10px 30px rgba(0,0,0,.25)",overflow:"hidden"
    });
    const head=document.createElement("div");
    head.textContent="Select a location";
    Object.assign(head.style,{padding:"10px 14px",fontWeight:"600",borderBottom:"1px solid #eee"});
    const list=document.createElement("div");
    results.forEach((r,idx)=>{
      const item=document.createElement("button");
      item.type="button";
      item.innerHTML=`<div style="font-size:13px;text-align:left;">
        <div style="font-weight:600">${escapeHtml(r.display_name||"Unnamed")}</div>
        ${r.lat&&r.lon?`<div style="opacity:.7">${r.lat}, ${r.lon}</div>`:""}
      </div>`;
      Object.assign(item.style,{width:"100%",padding:"10px 14px",border:"0",borderBottom:"1px solid #f0f0f0",background:"#fff",cursor:"pointer"});
      item.addEventListener("mouseover",()=>item.style.background="#fafafa");
      item.addEventListener("mouseout",()=>item.style.background="#fff");
      item.addEventListener("click",()=>{ cleanup(); onPick(r,idx); });
      list.appendChild(item);
    });
    const foot=document.createElement("div");
    Object.assign(foot.style,{padding:"8px 14px",display:"flex",gap:"8px",justifyContent:"flex-end"});
    const cancel=document.createElement("button");
    cancel.textContent="Cancel";
    Object.assign(cancel.style,{padding:"6px 10px",borderRadius:"8px",border:"1px solid #ccc",background:"#fff",cursor:"pointer"});
    cancel.onclick=()=>{ cleanup(); onCancel && onCancel(); };
    foot.appendChild(cancel);
    wrap.append(head,list,foot);
    const scrim=document.createElement("div");
    Object.assign(scrim.style,{position:"fixed",inset:"0",background:"rgba(0,0,0,.25)",zIndex:2147483646});
    scrim.addEventListener("click",()=>{ cleanup(); onCancel && onCancel(); });
    const cleanup=()=>{wrap.remove();scrim.remove();};
    document.body.append(scrim,wrap);
  };

  // ===================== FIELD HELPERS =================
  const isEditable=(el)=>{
    if(!el||!(el instanceof Element)) return false;
    const tag=el.tagName?.toLowerCase();
    if(tag==="input"||tag==="textarea") return !el.disabled&&!el.readOnly;
    if(el.isContentEditable) return true;
    const role=el.getAttribute("role");
    return role==="textbox"||role==="combobox";
  };
  const getEditableRoot=(el)=>{
    let cur=el;
    for(let i=0;i<7&&cur;i++){
      if(isEditable(cur)) return cur;
      const ce=cur.querySelector?.("[contenteditable='true'],[contenteditable='']");
      if(ce) return ce;
      cur=cur.parentElement;
    }
    return null;
  };
  const getText=(el)=>{
    const tag=el.tagName?.toLowerCase();
    if(tag==="input"||tag==="textarea") return el.value||"";
    if(el.isContentEditable||el.getAttribute("role")==="textbox") return (el.innerText||el.textContent||"").trim();
    return "";
  };

  // Insert for rich editors
  const insertTextRich = (el, text) => {
    try{ el.focus(); document.execCommand("selectAll", false, null); const ok=document.execCommand("insertText", false, text); if(ok) return true; }catch(_){}
    try{
      el.focus();
      const ev1=new InputEvent("beforeinput",{bubbles:true,cancelable:true,data:text,inputType:"insertFromPaste"});
      el.dispatchEvent(ev1);
      const ev2=new InputEvent("input",{bubbles:true,data:text,inputType:"insertFromPaste"});
      el.dispatchEvent(ev2);
      el.textContent=text;
      el.dispatchEvent(new Event("change",{bubbles:true}));
      el.dispatchEvent(new Event("blur",{bubbles:true}));
      return true;
    }catch(_){}
    return false;
  };

  const setTextGeneric=(el,text)=>{
    const finalText = applyNewlinePolicy(el, text); // normalize newlines for <input>
    if(SETTINGS.keepOriginalInClipboard){
      const prev=getText(el); if(prev) navigator.clipboard?.writeText(prev).catch(()=>{});
    }
    const tag=el.tagName?.toLowerCase();
    if(tag==="input"||tag==="textarea"){
      el.value=finalText;
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
      el.dispatchEvent(new Event("blur",{bubbles:true}));
      return true;
    }
    if(el.isContentEditable||el.getAttribute("role")==="textbox"){
      return insertTextRich(el, finalText);
    }
    const ce=el.querySelector?.("[contenteditable='true'],[contenteditable='']");
    if(ce) return insertTextRich(ce, finalText);
    return false;
  };

  // ===================== URL BUILDING ==================
  const fmt = (n) => Number(n).toFixed(SETTINGS.decimals);
  const buildUrl=(lat,lon)=>{
    const z=SETTINGS.zoom;
    if(SETTINGS.linkType==="map"){
      return `https://osmand.net/map?pin=${fmt(lat)},${fmt(lon)}#${z}/${fmt(lat)}/${fmt(lon)}`;
    }
    return `https://osmand.net/go.html?lat=${fmt(lat)}&lon=${fmt(lon)}&z=${z}`;
  };
  const parseLatLon=(s)=>{
    const m=String(s).trim().match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
    return m?{lat:m[1],lon:m[2]}:null;
  };

  // ---- compose final text with append options ----
  const composeFinal = ({ original, url, addressText }) => {
    const nl = "\n";
    const addrLine = (SETTINGS.addressLabel || "") + (addressText || "");
    const linkLine = (SETTINGS.linkLabel || "") + url;
    switch (SETTINGS.appendMode) {
      case "none":
        return url;
      case "link":
        return original ? `${original}${nl}${linkLine}` : linkLine;
      case "address_and_link":
        return addressText ? `${addrLine}${nl}${linkLine}` : linkLine;
      case "all":
        if (original) return addressText ? `${original}${nl}${addrLine}${nl}${linkLine}` : `${original}${nl}${linkLine}`;
        return addressText ? `${addrLine}${nl}${linkLine}` : linkLine;
      default:
        return url;
    }
  };

  // ===================== NETWORK ======================
  const getJSON=(url)=>new Promise((resolve,reject)=>{
    if(typeof GM_xmlhttpRequest==="function"){
      GM_xmlhttpRequest({
        method:"GET",url,headers:{Accept:"application/json","Accept-Language":navigator.language||"en"},
        onload:(res)=>{ if(res.status>=200&&res.status<300){ try{resolve(JSON.parse(res.responseText));}catch(e){reject(e);} } else reject(new Error(`HTTP ${res.status}`)); },
        onerror:()=>reject(new Error("Network error (GM)")), ontimeout:()=>reject(new Error("Network timeout (GM)"))
      });
    } else {
      fetch(url,{headers:{Accept:"application/json","Accept-Language":navigator.language||"en"}})
        .then(r=>r.ok?r.json():Promise.reject(new Error(`HTTP ${r.status}`))).then(resolve,reject);
    }
  });
  const geocode = async (q) => {
    const base = "https://nominatim.openstreetmap.org/search";
    const params = new URLSearchParams({ format:"jsonv2", limit:String(SETTINGS.limit||5), q });
    if(SETTINGS.countrycodes) params.set("countrycodes", SETTINGS.countrycodes);
    const url = `${base}?${params.toString()}`;
    log("Geocode URL:", url);
    const data = await getJSON(url);
    log("Geocode results:", data);
    return data;
  };

  // ===================== FLOATING PILL =================
  const btn=document.createElement("button");
  btn.textContent="→ OsmAnd";
  Object.assign(btn.style,{
    position:"fixed",zIndex:2147483647,padding:"6px 10px",borderRadius:"999px",
    border:"1px solid #888",background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.15)",fontSize:"12px",
    display:"none",cursor:"pointer",userSelect:"none",pointerEvents:"auto"
  });
  // Keep contents inside the rounded pill
  btn.style.overflow = "hidden";
  btn.style.backgroundClip = "padding-box";

  // Base color (left half)
  btn.style.backgroundColor = "#fff";

  // Two layered gradients:
  //  - top layer: a 2px vertical divider at 50%
  //  - bottom layer: right half tinted (≈25% grey)
  btn.style.backgroundImage = [
    "linear-gradient(to right," +
      "transparent 0, transparent calc(50% - 1px)," +
      "#bdbdbd calc(50% - 1px), #bdbdbd calc(50% + 1px)," +  // divider
      "transparent calc(50% + 1px), transparent 100%)",
    "linear-gradient(to right," +
      "#fff 0, #fff 50%," +
      "rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25) 100%)"         // right-half tint
  ].join(", ");
  btn.style.backgroundRepeat = "no-repeat, no-repeat";
  btn.style.backgroundSize   = "100% 100%, 100% 100%";
  btn.style.backgroundPosition = "0 0, 0 0";
  btn.style.setProperty("pointer-events","auto","important");
  btn.style.setProperty("z-index","2147483647","important");
  document.documentElement.appendChild(btn);

  let lastEditable=null, btnVisible=false;

  const placeBtnNear=(el)=>{
    const r=el.getBoundingClientRect();
    const top=Math.max(8, r.bottom+6);
    const left=Math.min(window.innerWidth-120, r.right-100);
    btn.style.top=`${top+window.scrollY}px`;
    btn.style.left=`${left+window.scrollX}px`;
  };
  const showBtn=(el)=>{ lastEditable=el; placeBtnNear(el); btn.style.display="block"; btnVisible=true; };
  const hideBtn=()=>{ btn.style.display="none"; btnVisible=false; };

  document.addEventListener("focusin",(e)=>{
    const root=getEditableRoot(e.target) || e.target;
    if(root) showBtn(root); else hideBtn();
  }, true);
  document.addEventListener("scroll",()=>{ if(btnVisible && lastEditable) placeBtnNear(lastEditable); }, true);

  // ===================== ACTION FLOW ===================
  const buildAndInsert = async (target, text, originalText) => {
    // 1) Coordinates passthrough
    const coord=parseLatLon(text);
    let url;
    if (coord) {
      url = buildUrl(coord.lat, coord.lon);
      log("Coord passthrough → URL:", url);
      const finalText = composeFinal({
        original: originalText,
        url,
        addressText: SETTINGS.useGeocoderAddressForAppend ? null : text
      });
      if (!setTextGeneric(target, finalText)) await navigator.clipboard?.writeText(finalText);
      toast("Converted coordinates → OsmAnd link");
      return;
    }

    // 2) Geocode text
    toast("Looking up address…");
    const results = await geocode(text);
    if(!Array.isArray(results)||results.length===0){
      toast("No geocoding result.", false);
      return;
    }
    const pickOne = async (r) => {
      url = buildUrl(r.lat, r.lon);
      log("Chosen result:", r, "URL:", url);
      const addr = SETTINGS.useGeocoderAddressForAppend ? (r.display_name || text) : text;
      const finalText = composeFinal({
        original: originalText,
        url,
        addressText: addr
      });
      if (!setTextGeneric(target, finalText)) await navigator.clipboard?.writeText(finalText);
      toast(`Set link for:\n${addr}`);
    };
    if (results.length === 1) return pickOne(results[0]);

    // NOTE: Resolve on cancel/close so the action lock always releases
    return new Promise((resolve)=>picker(
      results.slice(0, SETTINGS.limit||5),
      async (r)=>{ await pickOne(r); resolve(); },
      ()=>resolve()
    ));
  };

  const handleAction = async () => {
    if (actionLock) { log("handleAction ignored (already running)"); return; }
    actionLock = true;

    // Optional: visually disable the pill while we work
    const oldTxt = btn.textContent;
    btn.textContent = "…";
    btn.style.opacity = "0.6";
    btn.style.pointerEvents = "none";

    try {
      const target = lastEditable || getEditableRoot(document.activeElement) || document.activeElement;
      if(!target) { toast("No editable field focused.", false); return; }
      const originalText = getText(target);
      let text = (originalText || "").trim();
      if(!text){
        text = prompt("Address to geocode for OsmAnd:");
        if(!text) return;
      }
      log("Triggered on target:", target, "Initial text:", text);
      await buildAndInsert(target, text, originalText);
    } catch (err) {
      log("handleAction error:", err);
      toast(`Failed: ${err.message}`, false);
    } finally {
      actionLock = false;
      btn.textContent = oldTxt;
      btn.style.opacity = "";
      btn.style.pointerEvents = "auto";
    }
  };

  // Split pill click handler (left/right half → different append modes)
  const handleSplitPillClick = (e) => {
    const rect = btn.getBoundingClientRect();
    const leftHalf = (e.clientX - rect.left) <= (rect.width / 2);
    const chosenMode = leftHalf
      ? (SETTINGS.appendModeLeft  || "none")
      : (SETTINGS.appendModeRight || "address_and_link");
    e.preventDefault();
    e.stopPropagation();
    withAppendMode(chosenMode, handleAction);
  };

  ["pointerdown","mousedown","click"].forEach(ev=>{
    btn.addEventListener(ev, (e)=>handleSplitPillClick(e), true);
  });

  // Hotkey (uses SETTINGS.hotkey) -- continues to use SETTINGS.appendMode
  document.addEventListener("keydown", (e) => {
    if (matchesHotkey(e)) {
      if (actionLock) return;
      e.preventDefault();
      handleAction();
    }
  });

  log("Ready. Focus any editable field, then click the pill (left/right) or press the hotkey.");
})();