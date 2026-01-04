// ==UserScript==
// @name         Immich SuperSearch
// @namespace    immich-supersearch
// @version      1.0
// @description  Adds a powerful SuperSearch interface to Immich.
// @author       Nazzal
// @license MIT
//
// == USERSCRIPT SETUP ==
// IMPORTANT: To make this script work, you MUST replace the two @match lines below
// with the actual URL of YOUR Immich instance.
// For example, if your Immich is at https://photos.example.com, change them to:
// @match        https://photos.example.com/*
// OR
// @match        http://<machine-ip-address>:2283/*
//
// @match        http://YOUR_IMMICH_URL/*
// @match        https://YOUR_IMMICH_URL/*
//
// == PERMISSIONS ==
// If you run the sidecar on a different machine from your browser,
// you MUST add its hostname or IP here.
// For example, if your sidecar is at http://192.168.1.50:8080, add this line:
// @connect      192.168.1.50
//
// @connect      localhost
// @connect      self
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547302/Immich%20SuperSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/547302/Immich%20SuperSearch.meta.js
// ==/UserScript==
(() => {
  "use strict";

  // *** NEW SMART DEFAULT LOGIC ***
  const STORAGE_SIDECAR = "ss.sidecarUrl";
  const smartDefault = `http://${window.location.hostname}:8080`;
  const DEFAULT_SIDECAR = localStorage.getItem(STORAGE_SIDECAR) || smartDefault;

  function isDarkTheme() {
    const html = document.documentElement;
    const body = document.body;
    const darkClass = html?.classList.contains("dark") || body?.classList.contains("dark");
    const attrDark = html?.getAttribute("data-theme") === "dark" || body?.getAttribute("data-theme") === "dark";
    var mediaDark = false;
    try {
      const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
      mediaDark = !!mq?.matches;
    } catch {}
    return !!(darkClass || attrDark || mediaDark);
  }
  function applyThemeVars() {
    const rootEl = document.documentElement;
    if (!rootEl?.style) return;
    const dark = isDarkTheme();
    const vars = dark ? {
      "--ss-bg":         "#0f172a", "--ss-text":       "#e5e7eb", "--ss-sub":        "rgba(229,231,235,.85)",
      "--ss-border":     "rgba(255,255,255,.06)", "--ss-input-bg":   "#101724", "--ss-input-bd":   "#404c5c",
      "--ss-btn":        "#1f2937",
      "--ss-primary":    "#2563eb", "--ss-primary-bd": "#1d4ed8", "--ss-primary-h":  "#1d4ed8",
      "--ss-ok":         "#10b981", "--ss-ok-bd":      "#059669", "--ss-ok-text":    "#06221a",
      "--ss-overlay":    "rgba(15,23,42,.85)", "--ss-shadow":     "rgba(0,0,0,.35)", "--ss-acc-head-bg":"#374053",
      "--ss-acc-head-text":"#e5e7eb", "--ss-header-border": "rgba(255,255,255,.06)", "--ss-error": "#f87171"
    } : {
      "--ss-bg":         "#ffffff", "--ss-text":       "#111827", "--ss-sub":        "rgba(17,24,39,.75)",
      "--ss-border":     "rgba(17,24,39,.10)", "--ss-input-bg":   "#f9fafb", "--ss-input-bd":   "#d1d5db",
      "--ss-btn":        "#f3f4f6",
      "--ss-primary":    "#2563eb", "--ss-primary-bd": "#1d4ed8", "--ss-primary-h":  "#1e40af",
      "--ss-ok":         "#10b981", "--ss-ok-bd":      "#059669", "--ss-ok-text":    "#064e3b",
      "--ss-overlay":    "rgba(0,0,0,.35)", "--ss-shadow":     "rgba(0,0,0,.18)", "--ss-acc-head-bg":"#e5e7eb",
      "--ss-acc-head-text":"#111827", "--ss-header-border": "rgba(17,24,39,.10)", "--ss-error": "#ef4444"
    };
    for (const k in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, k)) rootEl.style.setProperty(k, vars[k]);
    }
  }

  const css = `
    #ss-header-icon {
      background-color: #3B82F6; color: white; border: none; border-radius: 50%;
      width: 36px; height: 36px; margin: 0 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background-color 0.2s;
    }
    #ss-header-icon:hover { background-color: #2563EB; }
    #ss-header-icon svg { width: 20px; height: 20px; }
    #ss-modal-backdrop {
      position: fixed; inset: 0; background: var(--ss-overlay);
      display: none; align-items: center; justify-content: center; z-index: 999998;
    }
    #ss-modal {
      width: 720px; max-width: 92vw; background: var(--ss-bg); color: var(--ss-text);
      border-radius: 16px; box-shadow: 0 12px 32px var(--ss-shadow);
      border: 1px solid var(--ss-border); font: 14px/1.35 ui-sans-serif,system-ui;
      position: relative; max-height: 90vh; display: flex; flex-direction: column;
    }
    #ss-modal-header {
        padding: 12px 20px; border-bottom: 1px solid var(--ss-header-border);
        display: flex; align-items: center; justify-content: space-between;
    }
    #ss-modal-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; }
    .ss-header-controls { display: flex; align-items: center; gap: 16px; }
    #ss-settings-btn-header { cursor: pointer; font-size: 20px; opacity: 0.6; transition: opacity 0.2s; }
    #ss-settings-btn-header:hover { opacity: 1; }
    #ss-close-btn-header {
        cursor: pointer; font-size: 28px; font-weight: 600; line-height: 1;
        opacity: 0.7; transition: opacity 0.2s; user-select: none;
    }
    #ss-close-btn-header:hover { opacity: 1; }
    #ss-modal-content { overflow-y: auto; padding: 16px; }
    #ss-modal-footer { padding: 12px 16px; border-top: 1px solid var(--ss-border); }
    #ss-form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
    #ss-form label { font-size: 12px; color: var(--ss-sub) }
    #ss-form input, #ss-form select {
      width: 100%; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--ss-input-bd);
      background: var(--ss-input-bg); color: var(--ss-text); outline: none;
    }
    #ss-actions { display: flex; gap: 8px; justify-content: center; margin-top: 8px; }
    .ss-btn { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--ss-input-bd); cursor: pointer; background: var(--ss-btn); color: var(--ss-text); }
    .ss-btn.primary { background: var(--ss-primary); border-color: var(--ss-primary-bd); color: #fff }
    .ss-btn.primary:hover:not(:disabled) { background: var(--ss-primary-h) }
    .ss-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #ss-modal-footer-info { display: flex; justify-content: space-between; align-items: center; min-height: 24px; }
    #ss-status { font-size: 12px; color: var(--ss-sub); }
    #ss-status.ss-error-text { color: var(--ss-error); }
    #ss-result { display: none; text-align: right; }
    .ss-album-btn { color: var(--ss-primary); text-decoration: underline; font-weight: 700; cursor: pointer; }
    #ss-loading { position: absolute; inset: 0; display:none; align-items:center; justify-content:center; background: var(--ss-overlay); border-radius: 16px; z-index: 10; }
    .ss-spinner { width: 44px; height: 44px; border-radius: 9999px; border: 4px solid var(--ss-input-bd); border-top-color: var(--ss-primary); animation: ss-spin 1s linear infinite; }
    @keyframes ss-spin { to { transform: rotate(360deg); } }
    details.ss-acc { grid-column: 1 / -1; border: 1px solid var(--ss-input-bd); border-radius: 10px;  padding: 0; overflow:hidden; }
    summary.ss-sum { list-style: none; cursor: pointer; padding: 10px 12px; color: var(--ss-acc-head-text); font-weight: 700; display:flex; align-items:center; justify-content: space-between; background: var(--ss-acc-head-bg); }
    summary.ss-sum::-webkit-details-marker { display: none; }
    .ss-acc-content { padding: 12px; }
    .ss-caret { font-size: 12px; opacity: .8; }
    .ss-filter-row { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; align-items: flex-end; }
    input[type=checkbox], input[type=radio] {width: unset !important;}
    #ss-confirm-backdrop { position: fixed; inset: 0; background: var(--ss-overlay); display: flex; align-items: center; justify-content: center; z-index: 999999; }
    #ss-confirm-dialog { background: var(--ss-bg); color: var(--ss-text); padding: 24px; border-radius: 16px; border: 1px solid var(--ss-border); box-shadow: 0 12px 32px var(--ss-shadow); text-align: center; max-width: 400px; }
  `;

  function ensureStyles() {
    if (!document.getElementById("ss-style")) {
      const st = document.createElement("style"); st.id = "ss-style"; st.textContent = css; document.head.appendChild(st);
    }
  }

  function showCustomConfirm(message, onConfirm) {
    const backdrop = document.createElement("div"); backdrop.id = "ss-confirm-backdrop";
    const dialog = document.createElement("div"); dialog.id = "ss-confirm-dialog";
    dialog.innerHTML = `<div style="margin:0 0 20px;font-size:15px;line-height:1.5;">${message.replace(/\n/g, '<br>')}</div><div style="display:flex;justify-content:center;gap:12px;"><button type="button" id="ss-confirm-cancel" class="ss-btn">Cancel</button><button type="button" id="ss-confirm-ok" class="ss-btn primary">OK</button></div>`;
    backdrop.appendChild(dialog); document.body.appendChild(backdrop);
    const cleanup = () => document.body.removeChild(backdrop);
    backdrop.querySelector("#ss-confirm-ok").addEventListener("click", () => { cleanup(); if (typeof onConfirm === 'function') onConfirm(); });
    backdrop.querySelector("#ss-confirm-cancel").addEventListener("click", cleanup);
  }

  function injectHeaderButton() {
    if (document.getElementById("ss-header-icon")) return;
    const searchButton = document.getElementById("search-button");
    if (searchButton && searchButton.parentElement) {
      const button = document.createElement("button"); button.id = "ss-header-icon"; button.title = "Super Search";
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path></svg>`;
      button.addEventListener("click", (e) => { e.preventDefault(); const bd = document.getElementById("ss-modal-backdrop"); if (bd) bd.style.display = "flex"; });
      searchButton.parentElement.insertBefore(button, searchButton.nextSibling);
    }
  }

  function caretEl(symbol) { const span = document.createElement("span"); span.className = "ss-caret"; span.textContent = symbol; return span; }

  function buildModal() {
    let bd = document.getElementById("ss-modal-backdrop");
    if (bd) return bd;
    bd = document.createElement("div"); bd.id = "ss-modal-backdrop";
    const modal = document.createElement("div"); modal.id = "ss-modal"; bd.appendChild(modal);

    modal.innerHTML = `
      <div id="ss-loading"><div class="ss-spinner"></div></div>
      <div id="ss-modal-header">
        <h2>Super Search</h2>
        <div class="ss-header-controls">
            <span id="ss-settings-btn-header" title="Sidecar Settings">⚙️</span>
            <span id="ss-close-btn-header" title="Close">&times;</span>
        </div>
      </div>
      <div id="ss-modal-content">
        <form id="ss-form">
          <div><label>File name starts with</label><input id="ss-fnPrefix" type="text" placeholder="e.g. 2022_11 or IMG_"></div>
          <div>
            <label>Type</label>
            <div style="display:flex;gap:16px;align-items:center;padding-top:8px;">
              <label style="display:flex;gap:6px;align-items:center;font-size:14px;color:var(--ss-text);"><input type="radio" name="ss-type" value="" checked> All</label>
              <label style="display:flex;gap:6px;align-items:center;font-size:14px;color:var(--ss-text);"><input type="radio" name="ss-type" value="IMAGE"> Image</label>
              <label style="display:flex;gap:6px;align-items:center;font-size:14px;color:var(--ss-text);"><input type="radio" name="ss-type" value="VIDEO"> Video</label>
            </div>
          </div>
          <details class="ss-acc" id="ss-duration-details" style="display:none;"><summary class="ss-sum">Duration</summary><div class="ss-acc-content"><div class="ss-filter-row"><div><label>Filter Type</label><select class="ss-filter-type" data-section="duration"><option value="" selected>Any</option><option value="between">Between</option><option value="longer">Longer than</option><option value="shorter">Shorter than</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;"><div class="ss-min-container" style="display:none;"><label>Min Duration</label><div style="display:flex;gap:8px;"><input id="ss-minDur" type="number" placeholder="5"><select id="ss-minDurUnit"><option value="s" selected>seconds</option><option value="m">minutes</option><option value="h">hours</option></select></div></div><div class="ss-max-container" style="display:none;"><label>Max Duration</label><div style="display:flex;gap:8px;"><input id="ss-maxDur" type="number" placeholder="180"><select id="ss-maxDurUnit"><option value="s" selected>seconds</option><option value="m">minutes</option><option value="h">hours</option></select></div></div></div></div></div></details>
          <details class="ss-acc"><summary class="ss-sum">File Size</summary><div class="ss-acc-content"><div class="ss-filter-row"><div><label>Filter Type</label><select class="ss-filter-type" data-section="filesize"><option value="" selected>Any</option><option value="between">Between</option><option value="larger">Larger than</option><option value="smaller">Smaller than</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;"><div class="ss-min-container" style="display:none;"><label>Min File Size</label><div style="display:flex;gap:8px;"><input id="ss-minFS" type="number" placeholder="10"><select id="ss-minFSUnit"><option value="B">bytes</option><option value="KB">KB</option><option value="MB" selected>MB</option><option value="GB">GB</option></select></div></div><div class="ss-max-container" style="display:none;"><label>Max File Size</label><div style="display:flex;gap:8px;"><input id="ss-maxFS" type="number"><select id="ss-maxFSUnit"><option value="B">bytes</option><option value="KB">KB</option><option value="MB" selected>MB</option><option value="GB">GB</option></select></div></div></div></div></div></details>
          <details class="ss-acc"><summary class="ss-sum">Width</summary><div class="ss-acc-content"><div class="ss-filter-row"><div><label>Filter Type</label><select class="ss-filter-type" data-section="width"><option value="" selected>Any</option><option value="between">Between</option><option value="wider">Wider than</option><option value="narrower">Narrower than</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;"><div class="ss-min-container" style="display:none;"><label>Min Width (px)</label><input id="ss-minW" type="number"></div><div class="ss-max-container" style="display:none;"><label>Max Width (px)</label><input id="ss-maxW" type="number"></div></div></div></div></details>
          <details class="ss-acc"><summary class="ss-sum">Height</summary><div class="ss-acc-content"><div class="ss-filter-row"><div><label>Filter Type</label><select class="ss-filter-type" data-section="height"><option value="" selected>Any</option><option value="between">Between</option><option value="taller">Taller than</option><option value="shorter">Shorter than</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;"><div class="ss-min-container" style="display:none;"><label>Min Height (px)</label><input id="ss-minH" type="number"></div><div class="ss-max-container" style="display:none;"><label>Max Height (px)</label><input id="ss-maxH" type="number"></div></div></div></div></details>
          <details class="ss-acc"><summary class="ss-sum">Date Taken</summary><div class="ss-acc-content"><div class="ss-filter-row"><div><label>Filter Type</label><select class="ss-filter-type" data-section="date"><option value="" selected>Any</option><option value="between">Between</option><option value="after">Taken After</option><option value="before">Taken Before</option></select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;"><div class="ss-min-container" style="display:none;"><label>Taken After</label><input id="ss-after" type="date"></div><div class="ss-max-container" style="display:none;"><label>Taken Before</label><input id="ss-before" type="date"></div></div></div></div></details>
          <details class="ss-acc"><summary class="ss-sum">Extra options</summary><div class="ss-acc-content" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 12px;"><label style="display:flex;gap:8px;align-items:center;"><input id="ss-isMotion" type="checkbox"> Is Motion</label><label style="display:flex;gap:8px;align-items:center;"><input id="ss-isFavorite" type="checkbox"> Favorite</label><label style="display:flex;gap:8px;align-items:center;"><input id="ss-isNotInAlbum" type="checkbox"> Not In Album</label></div></details>
          <details class="ss-acc open"><summary class="ss-sum">Search Results Options</summary><div class="ss-acc-content" style="display:grid;grid-template-columns:1fr 2fr 1fr;gap:10px 12px;"><div><label>Limit</label><input id="ss-limit" type="number" min="1" step="1" value="200"></div><div><label>Album Name (required)</label><input id="ss-album" type="text" required value="[SuperSearch] Results"></div><div style="display:flex;align-items:end;"><label style="display:flex;gap:8px;align-items:center;"><input id="ss-replace" type="checkbox" checked> Replace Album</label></div></div></details>
        </form>
      </div>
      <div id="ss-modal-footer">
        <div id="ss-modal-footer-info">
            <div id="ss-status"></div>
            <div id="ss-result"></div>
        </div>
        <div id="ss-actions"><button type="submit" id="ss-submit" form="ss-form" class="ss-btn primary" disabled>Super Search!</button><button type="button" id="ss-reset" class="ss-btn">Reset</button></div>
      </div>
    `;

    const statusEl = modal.querySelector("#ss-status"), resultEl = modal.querySelector("#ss-result");
    const loadingEl = modal.querySelector("#ss-loading"), formEl = modal.querySelector("#ss-form");
    const submitBtn = modal.querySelector("#ss-submit");

    function qsel(sel){ return modal.querySelector(sel); }
    function val(sel) { const n = qsel(sel); return n ? (n.value || "").trim() : ""; }
    function numOrNull(sel) { const v = val(sel); if (v === "") return null; const n = Number(v); return isFinite(n) ? n : null; }
    function strOrNull(sel) { const v = val(sel); return v === "" ? null : v; }
    function toSeconds(n, unit) { if (n == null) return null; if (unit === "m") return n*60; if (unit === "h") return n*3600; return n; }
    function toBytes(n, unit) { if (n == null) return null; const K=1024; if (unit === "KB") return n*K; if (unit === "MB") return n*K*K; if (unit === "GB") return n*K*K*K; return n; }

    function setStatus(message, isError = false) {
        statusEl.textContent = message;
        statusEl.classList.toggle('ss-error-text', isError);
    }

    function setupAccordion(d) {
        const sum = d.querySelector("summary.ss-sum"); if (!sum) return;
        const el = caretEl(d.open ? "▾" : "▸"); sum.appendChild(el);
        d.addEventListener("toggle", () => { el.textContent = d.open ? "▾" : "▸"; });
    }

    function setupDynamicFilters(dropdown) {
        const filterRow = dropdown.closest('.ss-filter-row');
        if (!filterRow) return;
        const minC = filterRow.querySelector('.ss-min-container');
        const maxC = filterRow.querySelector('.ss-max-container');

        const update = () => {
            if (!minC || !maxC) return;
            const v = dropdown.value;
            minC.style.display = (v === 'between' || ['longer', 'larger', 'wider', 'taller', 'after'].includes(v)) ? '' : 'none';
            maxC.style.display = (v === 'between' || ['shorter', 'smaller', 'narrower', 'before'].includes(v)) ? '' : 'none';
            if (v === '') {
                minC.querySelectorAll('input').forEach(i => i.value = '');
                maxC.querySelectorAll('input').forEach(i => i.value = '');
            }
        };
        dropdown.addEventListener('change', update);
        update();
    }

    function updateSubmitButtonState() {
        let hasSufficientInput = false;
        if (val('#ss-fnPrefix').trim() !== '') hasSufficientInput = true;
        if (val('input[name="ss-type"]:checked') !== '') hasSufficientInput = true;
        if (qsel('#ss-isMotion').checked || qsel('#ss-isFavorite').checked || qsel('#ss-isNotInAlbum').checked) hasSufficientInput = true;

        if (!hasSufficientInput) {
            const filterRows = modal.querySelectorAll('.ss-filter-row');
            for (const row of filterRows) {
                const dropdown = row.querySelector('.ss-filter-type');
                if (dropdown && dropdown.value !== '') {
                    const inputs = row.querySelectorAll('input');
                    if (Array.from(inputs).some(i => i.value.trim() !== '')) {
                        hasSufficientInput = true;
                        break;
                    }
                }
            }
        }
        submitBtn.disabled = !hasSufficientInput;
    }

    function validateForm() {
      const minDur = toSeconds(numOrNull("#ss-minDur"), val("#ss-minDurUnit")), maxDur = toSeconds(numOrNull("#ss-maxDur"), val("#ss-maxDurUnit"));
      if(minDur != null && maxDur != null && maxDur < minDur) return "Max Duration must be greater than Min Duration.";
      const minFS = toBytes(numOrNull("#ss-minFS"), val("#ss-minFSUnit")), maxFS = toBytes(numOrNull("#ss-maxFS"), val("#ss-maxFSUnit"));
      if(minFS != null && maxFS != null && maxFS < minFS) return "Max File Size must be greater than Min File Size.";
      const minW = numOrNull("#ss-minW"), maxW = numOrNull("#ss-maxW");
      if(minW != null && maxW != null && maxW < minW) return "Max Width must be greater than Min Width.";
      const minH = numOrNull("#ss-minH"), maxH = numOrNull("#ss-maxH");
      if(minH != null && maxH != null && maxH < minH) return "Max Height must be greater than Min Height.";
      const minD = strOrNull("#ss-after"), maxD = strOrNull("#ss-before");
      if(minD && maxD && maxD < minD) return "Date Before must be after Date After.";
      return null;
    }

    function resetForm() {
        formEl.reset();
        setStatus("");
        resultEl.style.display = "none";
        modal.querySelectorAll('.ss-filter-type, input[name="ss-type"]').forEach(el => el.dispatchEvent(new Event('change')));
        updateSubmitButtonState();
    }

    modal.querySelectorAll("details.ss-acc").forEach(setupAccordion);
    modal.querySelectorAll(".ss-filter-type").forEach(setupDynamicFilters);
    modal.querySelectorAll('input[name="ss-type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            qsel("#ss-duration-details").style.display = (qsel('input[name="ss-type"]:checked').value === 'VIDEO') ? '' : 'none';
        });
    });

    qsel("#ss-close-btn-header").addEventListener("click", () => { bd.style.display = "none"; });
    qsel("#ss-settings-btn-header").addEventListener("click", () => {
        const newUrl = prompt(
            "Enter the full URL for your SuperSearch Sidecar service:",
            localStorage.getItem(STORAGE_SIDECAR) || smartDefault
        );
        if (newUrl) {
            localStorage.setItem(STORAGE_SIDECAR, newUrl.trim());
            alert("Sidecar URL has been updated to: " + newUrl.trim());
        }
    });
    formEl.addEventListener('input', updateSubmitButtonState);
    qsel("#ss-reset").addEventListener("click", resetForm);

    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) { setStatus(validationError, true); return; }
        const sidecarUrl = localStorage.getItem(STORAGE_SIDECAR) || smartDefault;
        if (!strOrNull("#ss-album")) { setStatus("Album Name is required.", true); return; }

        const payload = {
            fileNameStartsWith: strOrNull("#ss-fnPrefix"), limit: numOrNull("#ss-limit") ?? 200,
            minDurationSec: toSeconds(numOrNull("#ss-minDur"), val("#ss-minDurUnit")), maxDurationSec: toSeconds(numOrNull("#ss-maxDur"), val("#ss-maxDurUnit")),
            minFileSize: toBytes(numOrNull("#ss-minFS"), val("#ss-minFSUnit")), maxFileSize: toBytes(numOrNull("#ss-maxFS"), val("#ss-maxFSUnit")),
            minWidth: numOrNull("#ss-minW"), maxWidth: numOrNull("#ss-maxW"), minHeight: numOrNull("#ss-minH"), maxHeight: numOrNull("#ss-maxH"),
            takenAfter: strOrNull("#ss-after"), takenBefore: strOrNull("#ss-before"),
            createAlbumName: strOrNull("#ss-album"), replace: qsel("#ss-replace")?.checked,
            isMotion: qsel("#ss-isMotion")?.checked, isFavorite: qsel("#ss-isFavorite")?.checked, isNotInAlbum: qsel("#ss-isNotInAlbum")?.checked,
            type: strOrNull('input[name="ss-type"]:checked')
        };
        Object.keys(payload).forEach(k => (payload[k] == null || payload[k] === "" || payload[k] === false) && delete payload[k]);

        setStatus("Searching..."); resultEl.style.display = "none"; loadingEl.style.display = "flex";

        GM_xmlhttpRequest({
          method: "POST", url: `${sidecarUrl}/supersearch/search`, headers: { "Content-Type": "application/json" },
          data: JSON.stringify(payload), timeout: 120000,
          onload: (resp) => {
            loadingEl.style.display = "none";
            try {
              const data = JSON.parse(resp.responseText || "{}");
              if (data.error) { setStatus("Sidecar error: " + data.error, true); return; }
              const count = data.count || 0;
              setStatus(`Found ${count} assets.`);
              if (data.albumUrl) {
                showCustomConfirm(`Found ${count} assets.\nShow Results now?`, () => window.location.assign(data.albumUrl));
                resultEl.innerHTML = `<a class="ss-album-btn" href="${data.albumUrl}">Show Results</a>`;
                resultEl.style.display = "block";
              }
            } catch (err) { setStatus("Parse error: " + err, true); }
          },
          onerror: () => { loadingEl.style.display = "none"; setStatus("Request failed (network error)", true); },
          ontimeout: () => { loadingEl.style.display = "none"; setStatus("Request timed out — sidecar unreachable.", true); }
        });
    });
    return bd;
  }

  function injectUI() {
    ensureStyles(); applyThemeVars();
    if (!document.getElementById("ss-modal-backdrop")) {
        const m = buildModal(); if (m) document.body.appendChild(m);
    }
    const backdropDiv = document.getElementById("ss-modal-backdrop");
    if (backdropDiv && !backdropDiv.dataset.clickAway) {
        backdropDiv.dataset.clickAway = "true";
        backdropDiv.addEventListener("click", (t) => { if(t.target.id === 'ss-modal-backdrop') backdropDiv.style.display = "none"; });
    }
  }

  function initialize() {
    injectUI();
    new MutationObserver(() => { injectHeaderButton(); applyThemeVars(); }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("keydown", (e) => {
      if (e.altKey && (e.key || "").toLowerCase() === "s") {
        injectUI(); const bd = document.getElementById("ss-modal-backdrop");
        if (bd) bd.style.display = (bd.style.display === "flex") ? "none" : "flex";
      }
    });
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') initialize();
  else document.addEventListener('DOMContentLoaded', initialize, { once: true });
})();