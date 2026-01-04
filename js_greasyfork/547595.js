// ==UserScript==
// @name         ShadowSec Panel v13
// @namespace    http://tampermonkey.net/
// @version      13.0.1
// @description  Shadow DOM UI with advanced OWASP-aligned checks: v10.3 UI + v5 depth + intrusive probes (SQLi/IDOR/SSRF/Rate-limit) and heuristics (ports/cache/fingerprinting). Live summary, filters, search, export, copy, and a Settings page for wordlists and options.
// @author       AbyssBite
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/547595/ShadowSec%20Panel%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/547595/ShadowSec%20Panel%20v13.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;
  if (window.__SEC_TOOL_LOADED) return;
  window.__SEC_TOOL_LOADED = true;

  // ------------------ Persistent Settings ------------------
  const getVal = (k, d) => {
    try { return GM_getValue(k, d); } catch { return d; }
  };
  const setVal = (k, v) => {
    try { GM_setValue(k, v); } catch {}
  };

  const settings = {
    wordlistUrl: getVal('sec_wordlist_url', ''),      // external wordlist raw URL (optional)
    dirProbeLimit: getVal('sec_dir_limit', 200),      // max paths to probe in Extended Directory Probing
    execXss: getVal('sec_exec_xss', false),           // execute XSS payloads (default false)
    extraPorts: getVal('sec_extra_ports', ''),        // e.g., "9090, 9200"
    graphqlPaths: getVal('sec_graphql_paths', ''),    // e.g., "/graphql,/api/graphql"
    rateBurst: getVal('sec_rate_burst', 8)            // burst requests for Rate Limiting Test
  };

  // ------------------ Config (some overridable via settings) ------------------
  let EXECUTE_XSS_PAYLOADS = !!settings.execXss;

  const DIRECTORY_PROBE_PATHS_BASE = [
    "/robots.txt","/sitemap.xml","/admin/","/backup/","/.git/","/.env","/phpinfo.php",
    "/.htaccess","/config.php","/config/","/wp-admin/","/wp-login.php","/vendor/","/logs/","/old/","/test/","/staging/","/dev/",
    "/_next/","/graphql","/api","/api/graphql","/server-status"
  ];

  const OUTDATED_LIBS = [
    { name: "jQuery", regex: /jquery(?:\.min)?-([0-9.]+)\.js/i, min: "3.5.0" },
  ];

  const OPEN_REDIRECT_KEYS = ["url","next","redirect","return","rurl","dest","goto","redir","u","continue"];

  const SQLI_PAYLOADS = [
    "' OR 1=1 --", "' OR '1'='1", "'; WAITFOR DELAY '0:0:3' --", "') OR ('1'='1", "SLEEP(3))--", "' OR 1=1#"
  ];
  const SQL_ERROR_PATTERNS = [
    /you have an error in your sql syntax/i,
    /unclosed quotation mark/i,
    /warning: mysql/i, /mysqli?/i,
    /psql:.+ERROR/i, /postgresql/i,
    /sql server/i, /odbc/i,
    /ORA-\d+/i, /SQLite\/JDBCDriver/i
  ];

  const SSRF_PARAM_HINTS = /(url|uri|target|dest|image|feed|proxy|callback|return|endpoint)/i;

  let GRAPHQL_PATHS = ["/graphql", "/api/graphql"];
  if (settings.graphqlPaths && typeof settings.graphqlPaths === 'string') {
    const extra = settings.graphqlPaths.split(',').map(s=>s.trim()).filter(Boolean);
    GRAPHQL_PATHS = [...new Set([...GRAPHQL_PATHS, ...extra])];
  }

  const PORTS_WEB_HTTP = [80, 8080, 8000, 3000];
  const PORTS_WEB_HTTPS = [443, 8443];
  const PORTS_MISC = [9200, 27017, 5432, 3306, 6379, 15672, 5000];
  const SETTINGS_EXTRA_PORTS = (settings.extraPorts || '')
    .split(',').map(s=>parseInt(s.trim(),10))
    .filter(n=>Number.isInteger(n) && n>0);
  const EXTRA_PORTS = [...new Set(SETTINGS_EXTRA_PORTS)];

  const REFLECTION_PARAM_LIMIT = 10;

  // ------------------ Shadow DOM UI ------------------
  const wrapper = document.createElement('div');
  wrapper.id = 'sec_wrapper';
  document.body.appendChild(wrapper);
  const shadow = wrapper.attachShadow({ mode: 'open' });

  const panel = document.createElement('div');
  panel.id = 'sec_panel';
  shadow.appendChild(panel);

  panel.innerHTML = `
    <div id="sec_header">
      <span>🔐 ShadowSec Panel v13</span>
      <div>
        <button id="sec_settings" title="Settings">⚙️</button>
        <button id="sec_minimize" title="Minimize">−</button>
        <button id="sec_close" title="Close">×</button>
      </div>
    </div>

    <div id="sec_controls">
      <button id="sec_clear" title="Clear logs">Clear</button>
      <button id="sec_run_all" title="Run all tests">Run All</button>
      <button id="sec_export" title="Export report (JSON)">Export</button>
      <button id="sec_copy" title="Copy report (JSON)">Copy</button>
      <label><input type="checkbox" id="sec_intrusive"> Intrusive</label>
      <label>Filter:
        <select id="sec_filter">
          <option>All</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
      </label>
      <input type="text" id="sec_search" placeholder="Search logs...">
      <button id="sec_theme" title="Toggle Dark/Light">☀️</button>
    </div>

    <div id="sec_summary">
      <div class="chip high">High: <span id="sum_high">0</span></div>
      <div class="chip medium">Medium: <span id="sum_medium">0</span></div>
      <div class="chip low">Low: <span id="sum_low">0</span></div>
    </div>

    <div id="sec_buttons"></div>
    <div id="sec_output"></div>
    <div id="sec_loading" style="display:none;">⏳ Running tests...</div>

    <!-- Settings Modal -->
    <div id="sec_modal_backdrop" hidden>
      <div id="sec_modal">
        <div id="sec_modal_header">
          <span>Settings</span>
          <button id="sec_modal_close" title="Close">×</button>
        </div>
        <div id="sec_modal_body">
          <label class="field">
            <span>External wordlist URL (raw):</span>
            <input type="url" id="inp_wordlist_url" placeholder="https://raw.githubusercontent.com/.../common.txt">
          </label>
          <label class="field">
            <span>Directory probe limit:</span>
            <input type="number" id="inp_dir_limit" min="10" max="2000" step="10">
          </label>
          <label class="field">
            <span>Execute XSS payloads (dangerous):</span>
            <input type="checkbox" id="inp_exec_xss">
          </label>
          <label class="field">
            <span>Extra probe ports (comma-separated):</span>
            <input type="text" id="inp_extra_ports" placeholder="9090, 9200, 5001">
          </label>
          <label class="field">
            <span>GraphQL paths (comma-separated):</span>
            <input type="text" id="inp_graphql_paths" placeholder="/graphql, /api/graphql, /gql">
          </label>
          <label class="field">
            <span>Rate-limit burst size:</span>
            <input type="number" id="inp_rate_burst" min="1" max="50" step="1">
          </label>
        </div>
        <div id="sec_modal_actions">
          <button id="sec_modal_save">Save</button>
          <button id="sec_modal_cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; font-family: Inter, Segoe UI, system-ui, sans-serif !important; }
    #sec_panel { position:fixed; bottom:16px; right:16px; width:580px; height:600px;
      display:flex; flex-direction:column; background:#181818; color:#eee;
      border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.55); z-index:2147483647;
      overflow:hidden; transition:all .3s ease; font-size:13px; }
    #sec_panel.light { background:#fdfdfd; color:#222; }
    #sec_header { display:flex; justify-content:space-between; align-items:center;
      background:#202020; padding:8px 12px; font-weight:600; cursor:move; user-select:none; }
    #sec_panel.light #sec_header { background:#e6e6e6; }
    #sec_header button { all: unset; cursor:pointer; margin-left:6px; padding:2px 6px;
      border-radius:4px; background:#444; color:#fff; font-weight:bold; }
    #sec_header button:hover { background:#666; }
    #sec_panel.light #sec_header button { background:#ccc; color:#222; }

    #sec_controls { display:flex; flex-wrap:wrap; gap:6px; padding:8px;
      background:#252525; align-items:center; }
    #sec_panel.light #sec_controls { background:#f1f1f1; }
    #sec_controls button, #sec_buttons button, #sec_controls select {
      all: unset; cursor:pointer; padding:6px 10px; border-radius:6px;
      background:linear-gradient(180deg,#444,#333); color:#fff; font-size:13px; text-align:center; }
    #sec_controls button:hover, #sec_buttons button:hover { background:#666; }
    #sec_panel.light #sec_controls button, #sec_panel.light #sec_buttons button {
      background:linear-gradient(180deg,#ccc,#bbb); color:#222; }
    #sec_search { all: unset; flex:1; padding:6px; border:1px solid #444;
      border-radius:6px; background:#2a2a2a; color:#eee; font-size:13px; }
    #sec_panel.light #sec_search { background:#fff; color:#222; border:1px solid #ccc; }

    #sec_summary { display:flex; gap:8px; padding:8px; background:#1d1d1d; }
    #sec_panel.light #sec_summary { background:#ececec; }
    .chip { padding:4px 8px; border-radius:999px; font-weight:600; }
    .chip.high { background:#3b1212; color:#ff6969; }
    .chip.medium { background:#3b2a12; color:#ffc56a; }
    .chip.low { background:#123b18; color:#75d98a; }

    #sec_buttons { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr));
      gap:6px; padding:8px; max-height:160px; overflow-y:auto; }
    #sec_output { flex:1; background:#101010; padding:8px; overflow-y:auto; }
    #sec_panel.light #sec_output { background:#fff; }
    #sec_output details { margin:4px 0; border:1px solid #333; border-radius:6px; overflow:hidden; }
    #sec_panel.light #sec_output details { border:1px solid #ccc; }
    #sec_output summary { background:#1f1f1f; padding:4px 8px; cursor:pointer; font-weight:500; }
    #sec_panel.light #sec_output summary { background:#eaeaea; }
    .log-entry { padding:3px 8px; border-top:1px solid rgba(255,255,255,0.05); }
    .high { color:#ff4c4c; }
    .medium { color:#ffb347; }
    .low { color:#4caf50; }

    #sec_loading { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      background:rgba(0,0,0,0.75); padding:10px 18px; border-radius:6px; font-size:14px; color:#fff; }

    .minimized { height:34px !important; overflow:hidden; }

    /* Settings modal */
    #sec_modal_backdrop[hidden] { display:none; }
    #sec_modal_backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display:flex; align-items:center; justify-content:center; z-index:2147483648; }
    #sec_modal { width: 520px; background: #222; color:#eee; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); overflow:hidden; }
    #sec_panel.light #sec_modal { background: #fff; color:#222; }
    #sec_modal_header { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#333; font-weight:700; }
    #sec_panel.light #sec_modal_header { background:#eee; }
    #sec_modal_header button { all:unset; cursor:pointer; padding:4px 8px; background:#444; color:#fff; border-radius:6px; }
    #sec_panel.light #sec_modal_header button { background:#ccc; color:#222; }
    #sec_modal_body { padding:12px; display:flex; flex-direction:column; gap:10px; max-height: 50vh; overflow:auto; }
    .field { display:grid; grid-template-columns: 200px 1fr; gap:8px; align-items:center; }
    .field input[type="text"], .field input[type="url"], .field input[type="number"] {
      all:unset; border:1px solid #444; border-radius:6px; padding:8px; background:#2a2a2a; color:#eee; }
    #sec_panel.light .field input[type="text"], #sec_panel.light .field input[type="url"], #sec_panel.light .field input[type="number"] {
      background:#fff; color:#222; border:1px solid #ccc; }
    .field input[type="checkbox"] { transform: scale(1.2); }
    #sec_modal_actions { display:flex; gap:8px; justify-content:flex-end; padding:10px 12px; background:#2b2b2b; }
    #sec_panel.light #sec_modal_actions { background:#f2f2f2; }
    #sec_modal_actions button { all:unset; cursor:pointer; padding:8px 12px; border-radius:6px; background:#444; color:#fff; font-weight:600; }
    #sec_panel.light #sec_modal_actions button { background:#ccc; color:#222; }
    #sec_modal_actions button:hover { filter:brightness(1.1); }
  `;
  shadow.appendChild(style);

  // ------------------ Elements & State ------------------
  const outputDiv = panel.querySelector('#sec_output');
  const buttonsDiv = panel.querySelector('#sec_buttons');
  const loadingDiv = panel.querySelector('#sec_loading');
  const filterSelect = panel.querySelector('#sec_filter');
  const intrusiveCheckbox = panel.querySelector('#sec_intrusive');
  const searchInput = panel.querySelector('#sec_search');
  const themeButton = panel.querySelector('#sec_theme');
  const settingsBtn = panel.querySelector('#sec_settings');

  const sumHighEl = panel.querySelector('#sum_high');
  const sumMedEl  = panel.querySelector('#sum_medium');
  const sumLowEl  = panel.querySelector('#sum_low');

  const modalBackdrop = panel.querySelector('#sec_modal_backdrop');
  const modalClose = panel.querySelector('#sec_modal_close');
  const modalSave = panel.querySelector('#sec_modal_save');
  const modalCancel = panel.querySelector('#sec_modal_cancel');

  const inpWordlist = panel.querySelector('#inp_wordlist_url');
  const inpDirLimit = panel.querySelector('#inp_dir_limit');
  const inpExecXss = panel.querySelector('#inp_exec_xss');
  const inpExtraPorts = panel.querySelector('#inp_extra_ports');
  const inpGraphqlPaths = panel.querySelector('#inp_graphql_paths');
  const inpRateBurst = panel.querySelector('#inp_rate_burst');

  let findings = [];
  let isLightMode = false;

  // ------------------ Utils ------------------
  const now = () => new Date().toLocaleTimeString();
  const sanitize = (s) => (s ?? "").toString().replace(/[<>]/g, (c) => ({'<':'&lt;','>':'&gt;'}[c]));
  const debounce = (fn, d=100) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), d); } };
  const sameOrigin = (u) => { try { const x = new URL(u, location.href); return x.origin === location.origin; } catch { return false; } };
  const base64urlDecode = (b64u) => {
    try {
      const pad = '='.repeat((4 - (b64u.length % 4)) % 4);
      const s = (b64u + pad).replace(/-/g,'+').replace(/_/g,'/');
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch { return null; }
  };

  const log = (msg, severity="Low", testName="General") => {
    findings.push({ msg, severity, testName, timestamp: now() });
    renderLogs();
  };
  const toggleLoading = (s) => loadingDiv.style.display = s ? "block" : "none";
  const updateSummary = () => {
    const stats = { High:0, Medium:0, Low:0 };
    findings.forEach(f => { if (stats[f.severity] != null) stats[f.severity]++; });
    sumHighEl.textContent = stats.High; sumMedEl.textContent = stats.Medium; sumLowEl.textContent = stats.Low;
  };
  const renderLogs = debounce(() => {
    const filter = filterSelect.value;
    const needle = (searchInput.value || "").toLowerCase();
    outputDiv.innerHTML = "";
    const grouped = {};
    findings
      .filter(f => (filter === "All" || f.severity === filter) && f.msg.toLowerCase().includes(needle))
      .forEach(f => { grouped[f.testName] = grouped[f.testName] || []; grouped[f.testName].push(f); });

    for (const [test, logs] of Object.entries(grouped)) {
      const details = document.createElement('details'); details.open = true;
      const summary = document.createElement('summary'); summary.textContent = `${test} (${logs.length})`;
      details.appendChild(summary);
      logs.forEach(f => {
        const div = document.createElement('div');
        div.className = `log-entry ${f.severity.toLowerCase()}`;
        div.textContent = `[${f.timestamp}] [${f.severity}] ${sanitize(f.msg)}`;
        details.appendChild(div);
      });
      outputDiv.appendChild(details);
    }
    updateSummary();
  });

  // ------------------ Tests (merged baseline + advanced) ------------------
  const tests = {
    "HTTPS & Mixed Content": async () => {
      const T = "HTTPS";
      if (location.protocol !== "https:") {
        log("Page not served over HTTPS", "High", T);
      } else {
        let mixed = false;
        document.querySelectorAll("img,script,link,iframe,source,object,embed,video,audio").forEach(el => {
          const src = el.src || el.href || el.data;
          if (src && src.startsWith("http:")) { log(`Mixed content: ${src}`, "High", T); mixed = true; }
        });
        if (!mixed) log("No mixed content detected", "Low", T);
      }
    },

    "Cookies (Heuristics)": () => {
      const T = "Cookies";
      const cookies = document.cookie ? document.cookie.split(";").map(s => s.trim()) : [];
      if (!cookies.length) { log("No cookies visible via document.cookie", "Low", T); return; }
      cookies.forEach(c => {
        const [name, ...rest] = c.split('=');
        const value = rest.join('=');
        log(`Cookie readable by JS (not HttpOnly): ${name}=${(value||'').slice(0,40)}${(value||'').length>40?'...':''}`, "Medium", T);
        if (name.startsWith("__Host-")) log(`Cookie ${name} uses __Host- prefix (requires Secure, path=/, no Domain)`, "Low", T);
        else if (name.startsWith("__Secure-")) log(`Cookie ${name} uses __Secure- prefix (should be Secure over HTTPS)`, "Low", T);
      });
      log("Note: Secure/SameSite/HttpOnly flags are not exposed to JS; above are heuristics only.", "Low", T);
    },

    "Forms & CSRF": () => {
      const T = "Forms";
      const forms = Array.from(document.forms);
      if (!forms.length) { log("No forms found", "Low", T); return; }
      forms.forEach((form, i) => {
        const idx = `Form #${i+1}`;
        const hasCSRF = Array.from(form.elements).some(e => /csrf|_token/i.test(e.name));
        if (!hasCSRF) log(`${idx} lacks CSRF token`, "High", T);
        const action = form.getAttribute('action') || "(same-page)";
        if (/^http:\/\//i.test(action)) log(`${idx} action over HTTP: ${action}`, "High", T);
        try {
          const url = action === "(same-page)" ? location : new URL(action, location.href);
          if (url.origin !== location.origin) log(`${idx} posts cross-origin to ${url.origin}`, "Medium", T);
        } catch {}
        Array.from(form.elements).forEach(el => {
          if (el.type === 'password') {
            const ac = (el.getAttribute('autocomplete') || form.getAttribute('autocomplete') || "").toLowerCase();
            if (ac !== "off" && ac !== "new-password") {
              log(`${idx} password input without autocomplete="off/new-password"`, "Medium", T);
            }
          }
          if (el.type === 'file' && !el.getAttribute('accept')) {
            log(`${idx} file input lacks accept attribute`, "Medium", T);
          }
        });
      });
    },

    "Inline Event Handlers": () => {
      const T = "DOM";
      let found = false;
      document.querySelectorAll("*").forEach(el => {
        for (const a of el.attributes) {
          if (a.name.startsWith("on")) { log(`Inline handler ${a.name} on <${el.tagName.toLowerCase()}>`, "Medium", T); found = true; }
        }
      });
      if (!found) log("No inline handlers found", "Low", T);
    },

    "Security Headers (deep)": async () => {
      const T = "Headers";
      try {
        const res = await fetch(location.href, { method: "HEAD", credentials: "same-origin" });
        const h = (k) => res.headers.get(k);
        const lower = {}; for (const [k,v] of res.headers.entries()) lower[k.toLowerCase()] = v;
        const csp=h("content-security-policy"), xfo=h("x-frame-options"), hsts=h("strict-transport-security");
        const xcto=h("x-content-type-options"), refp=h("referrer-policy"), pp=h("permissions-policy");
        const coop=h("cross-origin-opener-policy"), coep=h("cross-origin-embedder-policy"), corp=h("cross-origin-resource-policy");
        const cache=h("cache-control");
        ["content-security-policy","x-frame-options","referrer-policy","x-content-type-options"].forEach(n => { if (!lower[n]) log(`Missing header: ${n}`, "High", T); });
        if (csp) {
          if (!/default-src/i.test(csp)) log("CSP lacks default-src directive", "Medium", T);
          if (/unsafe-inline/i.test(csp)) log("CSP allows 'unsafe-inline'", "High", T);
          if (/unsafe-eval/i.test(csp)) log("CSP allows 'unsafe-eval'", "High", T);
          if (!/object-src\s+('none'|none)/i.test(csp)) log("CSP should set object-src 'none'", "Medium", T);
          if (!xfo && !/frame-ancestors/i.test(csp)) log("No X-Frame-Options and CSP lacks frame-ancestors", "High", T);
        }
        if (xcto && xcto.toLowerCase() !== 'nosniff') log("X-Content-Type-Options should be 'nosniff'", "Medium", T);
        if (!refp) log("Missing Referrer-Policy", "Medium", T);
        else if (/unsafe-url/i.test(refp)) log("Referrer-Policy 'unsafe-url' is weak", "Medium", T);
        if (location.protocol === "https:" && !hsts) log("Missing Strict-Transport-Security on HTTPS", "Medium", T);
        if (!pp) log("Missing Permissions-Policy", "Medium", T);
        if (!coop) log("Missing Cross-Origin-Opener-Policy", "Medium", T);
        if (!coep) log("Missing Cross-Origin-Embedder-Policy", "Medium", T);
        if (!corp) log("Missing Cross-Origin-Resource-Policy", "Medium", T);
        if (cache && !/no-store|no-cache|must-revalidate/i.test(cache)) { log(`Cache-Control may allow caching: ${cache}`, "Medium", T); }
      } catch (e) {
        log("Could not read headers (CORS or opaque). Falling back to meta tags.", "Low", T);
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content;
        if (!metaCSP) log("No CSP meta found", "High", T);
        else {
          if (/unsafe-inline/i.test(metaCSP)) log("CSP meta allows 'unsafe-inline'", "High", T);
          if (/unsafe-eval/i.test(metaCSP)) log("CSP meta allows 'unsafe-eval'", "High", T);
          if (!/default-src/i.test(metaCSP)) log("CSP meta lacks default-src", "Medium", T);
        }
      }
    },

    "OWASP Headers Compliance": async () => {
      const T = "OWASP Headers";
      try {
        const res = await fetch(location.href, { method: "HEAD", credentials: "same-origin" });
        const h = k => (res.headers.get(k) || "");
        const csp=h("content-security-policy"), xfo=h("x-frame-options"), hsts=h("strict-transport-security");
        const xcto=h("x-content-type-options"), refp=h("referrer-policy"), pp=h("permissions-policy");
        const coop=h("cross-origin-opener-policy"), coep=h("cross-origin-embedder-policy"), corp=h("cross-origin-resource-policy");
        if (!csp) log("Missing CSP", "High", T);
        if (!xfo && !(csp && /frame-ancestors/i.test(csp))) log("Missing X-Frame-Options and CSP frame-ancestors", "High", T);
        if (!xcto || xcto.toLowerCase() !== "nosniff") log("X-Content-Type-Options should be 'nosniff'", "Medium", T);
        if (!refp) log("Missing Referrer-Policy", "Medium", T);
        if (location.protocol === "https:") {
          if (!hsts) log("Missing HSTS on HTTPS", "High", T);
          else {
            const m = hsts.match(/max-age=(\d+)/i);
            const age = m ? parseInt(m[1], 10) : 0;
            if (age < 31536000) log(`HSTS max-age too low (${age})`, "Medium", T);
            if (!/includeSubDomains/i.test(hsts)) log("HSTS missing includeSubDomains", "Low", T);
          }
        }
        if (!pp) log("Missing Permissions-Policy", "Medium", T);
        if (!coop) log("Missing COOP", "Medium", T);
        if (!coep) log("Missing COEP", "Medium", T);
        if (!corp) log("Missing CORP", "Medium", T);
        if (csp) {
          if (/unsafe-inline/i.test(csp)) log("CSP allows 'unsafe-inline'", "High", T);
          if (/unsafe-eval/i.test(csp))   log("CSP allows 'unsafe-eval'", "High", T);
          if (!/default-src/i.test(csp))  log("CSP lacks default-src", "Medium", T);
          if (!/object-src\s+('none'|none)/i.test(csp)) log("CSP should set object-src 'none'", "Medium", T);
        }
        log("OWASP header audit complete", "Low", T);
      } catch {
        log("Header audit failed (CORS/opaque). Consider server-side check.", "Low", T);
      }
    },

    "CORS Policy": async () => {
      const T = "CORS";
      try {
        const res = await fetch(location.origin + "/", {
          method: "GET",
          headers: { "Origin": "https://evil.example" },
          credentials: "omit",
          cache: "no-store"
        });
        const acao = res.headers.get("access-control-allow-origin");
        const acac = res.headers.get("access-control-allow-credentials");
        if (acao === "*") log("Wildcard ACAO '*'", "Medium", T);
        else if (acao) log(`ACAO: ${acao}`, "Low", T);
        else log("No CORS headers on GET", "Low", T);
        if (acac === "true" && acao === "*") log("ACAC true with ACAO '*' is invalid/insecure", "High", T);
      } catch {
        log("CORS test failed (blocked or network error)", "Low", T);
      }
    },

    "Open Redirects": () => {
      const T = "Redirects";
      const params = new URLSearchParams(location.search);
      let cnt = 0;
      for (const key of OPEN_REDIRECT_KEYS) {
        if (params.has(key)) {
          const v = params.get(key) || "";
          cnt++;
          if (/^https?:\/\//i.test(v) || /^\/\//.test(v) || v.includes("..")) {
            log(`Potential open redirect param: ${key}=${v}`, "High", T);
          } else {
            log(`Redirect-like param present: ${key}=${v}`, "Medium", T);
          }
        }
        if (cnt >= REFLECTION_PARAM_LIMIT) break;
      }
      if (!cnt) log("No typical redirect parameters found", "Low", T);
    },

    "Exposed Storage": () => {
      const T = "Storage";
      const patterns = [/token/i, /key/i, /pass/i, /secret/i, /credential/i, /email/i];
      [["localStorage", localStorage], ["sessionStorage", sessionStorage]].forEach(([name, store]) => {
        if (!store || Object.keys(store).length === 0) { log(`${name}: empty`, "Low", T); return; }
        for (const k in store) {
          const v = String(store[k] ?? "").slice(0, 80);
          const flag = patterns.some(p => p.test(k) || p.test(v)) ? "High" : "Medium";
          log(`${name}: ${k}=${v}${(store[k] && store[k].length>80)?'...':''}`, flag, T);
        }
      });
    },

    "Clickjacking": () => {
      const T = "Clickjacking";
      if (window.top !== window.self) log("Page is inside an iframe", "High", T);
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe, i) => {
        if (!iframe.hasAttribute('sandbox')) log(`Iframe #${i+1} lacks sandbox`, "Medium", T);
        else log(`Iframe #${i+1} sandbox="${iframe.getAttribute('sandbox')}"`, "Low", T);
        const allow = iframe.getAttribute('allow');
        if (allow && /camera|microphone|geolocation|payment|usb/i.test(allow)) {
          log(`Iframe #${i+1} allow contains powerful features: ${allow}`, "Medium", T);
        }
      });
      if (!iframes.length) log("No iframes found", "Low", T);
    },

    "WebSocket Security": () => {
      const T = "WebSockets";
      const WS = window.WebSocket;
      window.WebSocket = function (url, ...rest) {
        try {
          const u = new URL(url, location.href);
          if (u.protocol === "ws:") log(`Insecure WebSocket: ${url}`, "High", T);
          else log(`WebSocket: ${url}`, "Low", T);
        } catch { log(`Invalid WebSocket URL: ${url}`, "Medium", T); }
        return new WS(url, ...rest);
      };
      setTimeout(() => { window.WebSocket = WS; log("WebSocket hook complete", "Low", T); }, 1200);
    },

    "Service Workers": async () => {
      const T = "SW";
      if (!("serviceWorker" in navigator)) { log("Service Workers not supported", "Low", T); return; }
      const regs = await navigator.serviceWorker.getRegistrations();
      if (!regs.length) { log("No Service Workers registered", "Low", T); return; }
      regs.forEach((r, i) => {
        const scope = r.scope;
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "(unknown)";
        log(`SW #${i+1}: scope=${scope}, script=${url}`, "Medium", T);
      });
    },

    "Third-Party Scripts": () => {
      const T = "Scripts";
      let found = false;
      document.querySelectorAll("script[src]").forEach(s => {
        try {
          const u = new URL(s.src, location.href);
          if (u.hostname !== location.hostname) {
            found = true;
            const hasSRI = !!s.integrity;
            log(`3rd-party script: ${s.src} ${hasSRI?'(with SRI)':'(no SRI)'}`, hasSRI ? "Low" : "Medium", T);
          }
        } catch {}
      });
      if (!found) log("No 3rd-party scripts", "Low", T);
    },

    "DOM-based XSS (reflections)": () => {
      const T = "DOM-XSS";
      const params = new URLSearchParams(location.search);
      const docHTML = document.documentElement.innerHTML;
      let hits = 0;
      params.forEach((v, k) => {
        if (!v) return;
        if (docHTML.includes(v)) { log(`Param reflected in DOM: ${k}=${v.slice(0,80)}`, "High", T); hits++; }
      });
      if (!hits) log("No obvious param reflections in DOM", "Low", T);
    },

    "CSP Effectiveness": () => {
      const T = "CSP";
      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content;
      if (!csp) { log("No CSP meta tag found (header may still exist)", "Medium", T); return; }
      log(`CSP meta: ${csp.slice(0,180)}${csp.length>180?'...':''}`, "Low", T);
      if (/unsafe-inline/i.test(csp)) log("CSP allows 'unsafe-inline'", "High", T);
      if (/unsafe-eval/i.test(csp))   log("CSP allows 'unsafe-eval'", "High", T);
      if (!/default-src/i.test(csp))  log("CSP lacks default-src", "Medium", T);
      if (!/object-src\s+('none'|none)/i.test(csp)) log("CSP should set object-src 'none'", "Medium", T);
    },

    "Subresource Integrity": () => {
      const T = "SRI";
      let flagged = 0;
      document.querySelectorAll("script[src], link[rel=stylesheet][href]").forEach(el => {
        const url = el.src || el.href;
        if (!url) return;
        const xorigin = !sameOrigin(url);
        if (xorigin && !el.integrity) { log(`Cross-origin resource without SRI: ${url}`, "Medium", T); flagged++; }
        else if (el.integrity) { log(`SRI present: ${url}`, "Low", T); }
      });
      if (!flagged) log("No cross-origin resources missing SRI", "Low", T);
    },

    "Privacy APIs": () => {
      const T = "Privacy";
      const canvas = document.createElement("canvas");
      if (canvas.getContext("2d")) log("Canvas API available (fingerprinting vector)", "Medium", T);
      try {
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) log("WebGL available (fingerprinting vector)", "Medium", T);
      } catch {}
      if (navigator.getBattery) log("Battery Status API available (fingerprinting vector)", "Low", T);
      if ("RTCPeerConnection" in window) log("WebRTC available (IP leak vector)", "Medium", T);
      if ("geolocation" in navigator) log("Geolocation API available", "Low", T);
    },

    "JavaScript Eval": () => {
      const T = "JS";
      const origEval = window.eval;
      const origSetTimeout = window.setTimeout;
      const origSetInterval = window.setInterval;
      window.eval = (...args) => { log("eval() used", "High", T); return origEval(...args); };
      window.setTimeout = (...args) => {
        if (typeof args[0] === "string") log("setTimeout called with string", "High", T);
        return origSetTimeout(...args);
      };
      window.setInterval = (...args) => {
        if (typeof args[0] === "string") log("setInterval called with string", "High", T);
        return origSetInterval(...args);
      };
      setTimeout(() => {
        window.eval = origEval;
        window.setTimeout = origSetTimeout;
        window.setInterval = origSetInterval;
        log("Eval hooks restored", "Low", T);
      }, 1200);
    },

    "HTTP Methods": async () => {
      const T = "Methods";
      for (const m of ["PUT","DELETE","TRACE"]) {
        try {
          const r = await fetch(location.origin + "/", { method: m });
          if (r.status < 400) log(`${m} allowed (potential risk)`, "High", T);
          else log(`${m} rejected with status ${r.status}`, "Low", T);
        } catch { log(`${m} request blocked`, "Low", T); }
      }
    },

    "Sensitive Attributes": () => {
      const T = "Attributes";
      const patterns = /token|key|pass|secret|cred|email/i;
      const all = document.querySelectorAll("*");
      let found = 0;
      all.forEach(el => {
        for (const a of el.attributes) {
          if (a.name === "value" || a.name.startsWith("data-")) {
            if (patterns.test(String(a.value))) {
              log(`Sensitive data in ${a.name} on <${el.tagName.toLowerCase()}>: ${String(a.value).slice(0,80)}`, "High", T);
              found++;
            }
          }
        }
      });
      if (!found) log("No sensitive-looking attribute values detected", "Low", T);
    },

    "XSS Payload Fuzzing": () => {
      const T = "XSS-Fuzz";
      if (!intrusiveCheckbox.checked) { log("Fuzzing skipped (Intrusive disabled)", "Low", T); return; }
      const nonExecPayloads = [
        `"><img src=x onerror=1>`,
        `<svg onload=1>`,
        `"><svg><desc>__XSS__</desc></svg>`,
        `"><b id="__XSS__">x</b>`,
        `</textarea>__XSS__<textarea>`,
        `' onmouseover=1 '`,
        `javascript:1`,
        `"><iframe srcdoc="__XSS__"></iframe>`
      ];
      const execPayloads = [
        `"><img src=x onerror=alert(1)>`,
        `<svg onload=alert(1)>`,
        `<a href="javascript:alert(1)">x</a>`,
        `<input value="x" onfocus=alert(1)>`
      ];
      const payloads = EXECUTE_XSS_PAYLOADS ? nonExecPayloads.concat(execPayloads) : nonExecPayloads;
      const inputs = Array.from(document.querySelectorAll("input[type=text],input[type=search],textarea"));
      if (!inputs.length) { log("No inputs found to fuzz", "Low", T); return; }
      inputs.forEach((input, i) => {
        const rn = input.getRootNode && input.getRootNode();
        if (rn && rn !== document) return; // avoid touching Shadow DOM (panel)
        payloads.forEach(p => {
          try {
            const original = input.value;
            input.value = p;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            input.value = original;
            log(`Fuzzed input #${i+1} with payload: ${p}`, "Low", T);
          } catch (e) {
            log(`Error fuzzing input #${i+1}: ${e.message}`, "Medium", T);
          }
        });
      });
      log("XSS fuzzing complete (check UI for unexpected reflections/popups)", "Low", T);
    },

    "Outdated Libraries": () => {
      const T = "Libs";
      document.querySelectorAll("script[src]").forEach(s => {
        const src = s.getAttribute("src") || "";
        OUTDATED_LIBS.forEach(lib => {
          const m = src.match(lib.regex);
          if (m) {
            const ver = m[1];
            log(`${lib.name} detected: ${ver} (recommended >= ${lib.min})`, "Medium", T);
          }
        });
      });
    },

    "Directory Probing": async () => {
      const T = "Dirs";
      for (const p of ["/robots.txt", "/sitemap.xml", "/admin/", "/backup/"]) {
        try {
          const r = await fetch(p, { cache: "no-store" });
          if (r.ok) log(`Accessible: ${p} (status ${r.status})`, "Medium", T);
          else if (r.status === 403) log(`Forbidden but present: ${p}`, "Low", T);
        } catch {}
      }
    },

    "Extended Directory Probing": async () => {
      const T = "Dirs+";
      const set = new Set(DIRECTORY_PROBE_PATHS_BASE);

      // Optional external wordlist from settings
      const WORDLIST_URL = settings.wordlistUrl;
      if (WORDLIST_URL) {
        try {
          log(`Fetching external wordlist from ${WORDLIST_URL}`, "Low", T);
          const txt = await fetch(WORDLIST_URL, { cache:"no-store" }).then(r => r.text());
          txt.split(/\r?\n/).forEach(line => {
            const l = line.trim();
            if (!l || l.startsWith("#")) return;
            const norm = l.startsWith("/") ? l : "/" + l;
            set.add(norm);
          });
          log(`Wordlist loaded, total candidates so far: ${set.size}`, "Low", T);
        } catch (e) {
          log(`Failed to fetch wordlist: ${e.message}`, "Medium", T);
        }
      }

      // Harvest from page links/scripts for path candidates
      const harvest = (url) => {
        try {
          const u = new URL(url, location.href);
          if (u.origin !== location.origin) return;
          const path = u.pathname;
          const parts = path.split('/').filter(Boolean);
          if (parts.length) {
            for (let i=1; i<=parts.length; i++) set.add("/" + parts.slice(0,i).join("/") + "/");
            if (/\.[a-z0-9]{1,6}$/i.test(parts[parts.length-1])) {
              set.add(path + ".bak");
              set.add(path + "~");
              set.add(path.replace(/\.[^.]+$/, ".old"));
            }
          }
        } catch {}
      };
      document.querySelectorAll('a[href],link[href],script[src]').forEach(el => {
        const u = el.getAttribute('href') || el.getAttribute('src');
        if (u) harvest(u);
      });

      const limit = Math.max(10, Math.min(2000, Number(settings.dirProbeLimit) || 200));
      const paths = Array.from(set).slice(0, limit);
      for (const p of paths) {
        try {
          const r = await fetch(p, { cache:"no-store" });
          if (r.ok) log(`Accessible: ${p} (status ${r.status})`, "Medium", T);
          else if (r.status === 403) log(`Forbidden but present: ${p}`, "Low", T);
        } catch {}
      }
      log(`Directory probing complete (${paths.length} checks)`, "Low", T);
    },

    "Reflected Params": () => {
      const T = "Reflections";
      const params = new URLSearchParams(location.search);
      let any = 0;
      params.forEach((v, k) => {
        if (!v) return;
        if (document.body.innerHTML.includes(v)) {
          any++;
          log(`Param ${k} appears reflected in body`, "High", T);
        }
      });
      if (!any) log("No param reflections found in body", "Low", T);
    },

    "Weak Form Inputs": () => {
      const T = "Weak Inputs";
      document.querySelectorAll("input[type=text],input[type=password]").forEach(el => {
        if (!el.hasAttribute("maxlength")) log(`Input "${el.name || el.id || '(unnamed)'}" missing maxlength`, "Low", T);
        if (el.type === "password" && !el.hasAttribute("minlength")) log(`Password input "${el.name || el.id || '(unnamed)'}" missing minlength`, "Low", T);
      });
    },

    "Links (_blank) Hygiene": () => {
      const T = "Links";
      document.querySelectorAll('a[target="_blank"]').forEach((a, i) => {
        const rel = (a.getAttribute('rel') || "").toLowerCase();
        if (!/\bnoopener\b/.test(rel) && !/\bnoreferrer\b/.test(rel)) {
          log(`Link #${i+1} opens new tab without rel="noopener"`, "Medium", T);
        }
      });
    },

    "Meta / Version Disclosure": async () => {
      const T = "Meta";
      const gen = document.querySelector('meta[name="generator"]')?.getAttribute('content');
      if (gen) log(`Meta generator: ${gen}`, "Medium", T);
      try {
        const res = await fetch(location.href, { method: "HEAD", credentials: "same-origin" });
        const xp = res.headers.get("x-powered-by");
        if (xp) log(`Header X-Powered-By: ${xp}`, "Medium", T);
      } catch {}
    },

    // -------- Advanced Additions --------

    "Open Ports (Heuristic)": async () => {
      const T = "Ports";
      if (!intrusiveCheckbox.checked) { log("Skipped (Intrusive disabled)", "Low", T); return; }
      const host = location.hostname;
      const isHTTPS = location.protocol === "https:";
      const candidates = [
        ...(isHTTPS ? PORTS_WEB_HTTPS : PORTS_WEB_HTTP),
        ...PORTS_MISC,
        ...EXTRA_PORTS
      ];
      log(`Probing ports on ${host} (heuristics)`, "Low", T);
      for (const p of candidates) {
        try {
          const proto = isHTTPS ? "https" : "http";
          if (isHTTPS && (p === 80 || p === 8080 || p === 8000 || p === 3000)) {
            log(`Skipping http://${host}:${p} due to mixed-content restrictions`, "Low", T);
          } else {
            const resp = await fetch(`${proto}://${host}:${p}/`, { mode: "no-cors", cache:"no-store", redirect:"follow" });
            log(`Fetch to ${proto}://${host}:${p} resolved (possible service)`, (p===3306||p===5432||p===6379||p===27017) ? "High":"Medium", T);
          }
        } catch {
          try {
            const wsProto = isHTTPS ? "wss" : "ws";
            const ws = new WebSocket(`${wsProto}://${host}:${p}`);
            ws.onopen = () => { log(`WebSocket open on port ${p}`, "Medium", T); ws.close(); };
            ws.onerror = () => {};
            await new Promise(r => setTimeout(r, 150));
          } catch {}
        }
      }
      log("Port probing completed (best-effort client heuristic)", "Low", T);
    },

    "SQL Injection Hints": async () => {
      const T = "SQLi";
      if (!intrusiveCheckbox.checked) { log("Skipped (Intrusive disabled)", "Low", T); return; }
      const url = new URL(location.href);
      const baseline = await fetch(url.toString(), { credentials:"include", cache:"no-store" }).then(r => r.text()).catch(()=>null);
      if (!baseline) { log("Baseline fetch failed", "Low", T); return; }
      const params = Array.from(url.searchParams.keys()).slice(0, 8);
      if (!params.length) { log("No query params to fuzz", "Low", T); }
      for (const k of params) {
        for (const p of SQLI_PAYLOADS) {
          const u = new URL(url.toString());
          u.searchParams.set(k, p);
          const t0 = performance.now();
          try {
            const txt = await fetch(u.toString(), { credentials:"include", cache:"no-store" }).then(r => r.text());
            const dt = (performance.now()-t0)|0;
            if (SQL_ERROR_PATTERNS.some(rx => rx.test(txt))) log(`DB error pattern after ${k}='${p}'`, "High", T);
            if (dt > 2500) log(`Slow response (${dt}ms) after ${k}='${p}' (time-based hint)`, "Medium", T);
          } catch {
            log(`Request failed for ${k}='${p}'`, "Low", T);
          }
        }
      }
      log("SQLi fuzzing complete (heuristics only)", "Low", T);
    },

    "Insecure Direct Object References (IDOR)": async () => {
      const T = "IDOR";
      if (!intrusiveCheckbox.checked) { log("Skipped (Intrusive disabled)", "Low", T); return; }
      const url = new URL(location.href);
      const baseline = await fetch(url.toString(), { credentials:"include", cache:"no-store" }).then(r=>r.text()).catch(()=>null);
      if (!baseline) { log("Baseline fetch failed", "Low", T); return; }
      let candidates = [];
      url.searchParams.forEach((v,k) => { const m = (v||"").match(/^\d{2,8}$/); if (m) candidates.push({type:"param", key:k, val:parseInt(v,10)}); });
      const segs = url.pathname.split('/').filter(Boolean);
      segs.forEach((s, idx) => { if (/^\d{2,8}$/.test(s)) candidates.push({type:"path", index:idx, val:parseInt(s,10)}); });
      if (!candidates.length) { log("No obvious numeric IDs detected in URL", "Low", T); return; }
      for (const c of candidates.slice(0,5)) {
        for (const delta of [1, -1, 100]) {
          const u = new URL(location.href);
          if (c.type === "param") u.searchParams.set(c.key, String(c.val + delta));
          else {
            const parts = u.pathname.split('/');
            const nonEmpty = parts.filter(Boolean);
            nonEmpty[c.index] = String(c.val + delta);
            u.pathname = "/" + nonEmpty.join("/") + (location.pathname.endsWith('/')?'/':'');
          }
          try {
            const txt = await fetch(u.toString(), { credentials:"include", cache:"no-store" }).then(r=>r.text());
            if (txt && Math.abs(txt.length - baseline.length) > 500) {
              log(`Response size changed for ID mutation (${c.type}:${c.val}→${c.val+delta})`, "High", T);
            }
          } catch {}
        }
      }
      log("IDOR heuristic probing complete", "Low", T);
    },

    "Server-Side Request Forgery (SSRF)": async () => {
      const T = "SSRF";
      if (!intrusiveCheckbox.checked) { log("Skipped (Intrusive disabled)", "Low", T); return; }
      const endpoints = new Set();
      Array.from(document.forms).forEach(f => {
        const a = f.getAttribute('action') || location.href;
        try { const u = new URL(a, location.href); if (u.origin === location.origin) endpoints.add(u.pathname + (u.search||"")); } catch {}
      });
      Array.from(document.querySelectorAll('a[href]')).forEach(a => {
        try { const u = new URL(a.href, location.href); if (u.origin === location.origin && SSRF_PARAM_HINTS.test(u.search)) endpoints.add(u.pathname + u.search); } catch {}
      });
      Array.from(document.querySelectorAll('script[src],link[href]')).forEach(el => {
        const href = el.getAttribute('src') || el.getAttribute('href');
        try { const u = new URL(href, location.href); if (u.origin === location.origin && SSRF_PARAM_HINTS.test(u.search)) endpoints.add(u.pathname + u.search); } catch {}
      });
      const targets = ["http://127.0.0.1", "http://169.254.169.254/latest/meta-data/"];
      if (!endpoints.size) { log("No candidate endpoints with URL-like params found", "Low", T); return; }
      for (const path of Array.from(endpoints).slice(0,6)) {
        for (const target of targets) {
          try {
            const u = new URL(path, location.origin);
            const sp = new URLSearchParams(u.search);
            let hit = false;
            for (const [k,v] of sp.entries()) { if (SSRF_PARAM_HINTS.test(k)) { sp.set(k, target); hit = true; } }
            if (!hit) continue;
            u.search = sp.toString();
            const r = await fetch(u.toString(), { credentials:"include", cache:"no-store" });
            if (r.ok) {
              const text = await r.text();
              if (/ami-|instance|meta-|availability-zone|hostname/i.test(text) || text.length > 0) {
                log(`Potential SSRF via ${u.pathname}?${sp} → returned ${text.length} bytes`, "High", T);
              } else {
                log(`Endpoint responded (status ${r.status}) to internal URL probe`, "Medium", T);
              }
            } else if (r.status === 403) {
              log(`Endpoint forbids internal URL (403) — SSRF mitigated at ${u.pathname}`, "Low", T);
            }
          } catch {}
        }
      }
      log("SSRF probing complete (same-origin endpoints only)", "Low", T);
    },

    "Prototype Pollution": async () => {
      const T = "Prototype Pollution";
      const cleanUp = (key) => { try { delete Object.prototype[key]; } catch {} };
      const payload = JSON.parse('{"__proto__":{"__sec_polluted__":true}}');
      let polluted = false;
      if (window._ && typeof _.merge === "function") {
        try {
          _.merge({}, payload);
          if (({}).__sec_polluted__ === true) { polluted = true; log("_.merge produced prototype pollution", "High", T); }
          cleanUp("__sec_polluted__");
        } catch {}
      }
      if (window.jQuery && typeof jQuery.extend === "function") {
        try {
          jQuery.extend(true, {}, payload);
          if (({}).__sec_polluted__ === true) { polluted = true; log("$.extend(true, ...) produced prototype pollution", "High", T); }
          cleanUp("__sec_polluted__");
        } catch {}
      }
      Array.from(document.querySelectorAll('script:not([src])')).forEach(s => {
        const t = (s.textContent || "").slice(0, 4000);
        if (/extend\s*\(\s*true|merge\s*\(/i.test(t) && /__proto__|constructor|prototype/i.test(t)) {
          log("Inline script contains risky deep-merge patterns", "Medium", T);
        }
      });
      if (!polluted) log("No prototype pollution detected in quick checks", "Low", T);
    },

    "Web Cache Poisoning (Heuristics)": async () => {
      const T = "Cache Poisoning";
      try {
        const r = await fetch(location.href, { method:"GET", cache:"no-store", headers: { "X-SEC-TEST": "A" } });
        const vary = r.headers.get("vary") || "";
        const cache = r.headers.get("cache-control") || "";
        if (!/no-store|no-cache|private/i.test(cache)) log(`Cache-Control may allow caching HTML: ${cache}`, "Medium", T);
        if (vary && !/accept-encoding|accept-language|origin/i.test(vary)) log(`Vary header lacks common keys: ${vary}`, "Low", T);
        else if (!vary) log("No Vary header present", "Low", T);
        log("Note: Browser cannot confirm poisoning; review headers and CDN config", "Low", T);
      } catch {
        log("Cache heuristic failed (request error)", "Low", T);
      }
    },

    "GraphQL Introspection": async () => {
      const T = "GraphQL";
      const q = { query: "query { __schema { queryType { name } types { name } } }" };
      let tried = 0, hits = 0;
      for (const path of GRAPHQL_PATHS) {
        tried++;
        try {
          const r = await fetch(path, {
            method:"POST",
            headers: { "content-type":"application/json" },
            credentials:"include",
            body: JSON.stringify(q),
          });
          const js = await r.json().catch(()=> ({}));
          if (js.data && js.data.__schema) { log(`${path}: Introspection ENABLED`, "High", T); hits++; }
          else if (js.errors) { log(`${path}: Errors returned (likely disabled)`, "Low", T); }
          else { log(`${path}: No GraphQL response`, "Low", T); }
        } catch {}
      }
      if (!tried) log("No /graphql endpoints tried", "Low", T);
      if (!hits) log("No introspection enabled detected", "Low", T);
    },

    "Advanced Fingerprinting Detection": async () => {
      const T = "Fingerprinting";
      let flagged = 0;
      Array.from(document.querySelectorAll('script:not([src])')).forEach(s => {
        const t = (s.textContent || "");
        if (/toDataURL\s*\(|getImageData\s*\(|AudioContext|webkitAudioContext|getChannelData/i.test(t)) {
          flagged++; log("Inline script uses canvas/audio APIs (fingerprinting vector)", "Medium", T);
        }
        if (/fingerprint|fp2|device.+id/i.test(t)) { flagged++; log("Inline script mentions fingerprint identifiers", "Medium", T); }
      });
      let canvasCalls = 0;
      const canvasProto = HTMLCanvasElement.prototype;
      const _toDataURL = canvasProto.toDataURL;
      canvasProto.toDataURL = function(...a){ canvasCalls++; try { return _toDataURL.apply(this,a); } catch(e){ throw e; } };
      await new Promise(r => setTimeout(r, 1000));
      canvasProto.toDataURL = _toDataURL;
      if (canvasCalls>0) log(`Canvas toDataURL invoked ${canvasCalls}x during probe window`, "Medium", T);
      if (!flagged && canvasCalls===0) log("No obvious fingerprinting signals in brief probe", "Low", T);
    },

    "Broken Authentication (Heuristics)": () => {
      const T = "Auth";
      const jwtRx = /eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]*/g;
      const scanStr = (s) => { const found = (s||"").match(jwtRx) || []; return [...new Set(found)]; };
      let any = 0;
      [["localStorage", localStorage], ["sessionStorage", sessionStorage]].forEach(([name, store]) => {
        try {
          for (const k in store) {
            const vals = scanStr(String(store[k] || ""));
            vals.forEach(tok => {
              any++; log(`${name} contains JWT-like token (${k})`, "Medium", T);
              const [h,p] = tok.split('.'); const header = base64urlDecode(h); const payload = base64urlDecode(p);
              if (header && header.alg && /none/i.test(header.alg)) log("JWT alg=none (weak)", "High", T);
              if (payload && payload.exp && (payload.exp*1000 < Date.now())) log("JWT appears expired", "Low", T);
            });
          }
        } catch {}
      });
      (document.cookie || "").split(';').forEach(c => {
        const parts = c.trim().split('=');
        if (!parts[0]) return;
        const vals = scanStr(decodeURIComponent(parts.slice(1).join('=')));
        vals.forEach(tok => {
          any++; log(`Cookie contains JWT-like token: ${parts[0]} (readable ⇒ not HttpOnly)`, "High", T);
        });
      });
      if (!any) log("No JWT-like tokens detected in quick scan", "Low", T);
      log("Session fixation requires auth flow observation; not auto-tested", "Low", T);
    },

    "Rate Limiting Test": async () => {
      const T = "Rate Limit";
      if (!intrusiveCheckbox.checked) { log("Skipped (Intrusive disabled)", "Low", T); return; }
      const url = new URL(location.href);
      url.searchParams.set("sec_rate_test", String(Date.now()%100000));
      const N = Math.max(1, Math.min(50, Number(settings.rateBurst) || 8));
      let got429 = 0;
      await Promise.all(Array.from({length:N}, async () => {
        try {
          const r = await fetch(url.toString(), { credentials:"include", cache:"no-store" });
          if (r.status === 429) got429++;
        } catch {}
      }));
      if (got429>0) log(`429 detected (${got429}/${N}) — rate limiting present`, "Low", T);
      else log(`No 429 responses in ${N} rapid requests — rate limit possibly absent`, "Medium", T);
    },

    "Client-Side Template Injection (CSTI)": async () => {
      const T = "CSTI";
      const inputs = Array.from(document.querySelectorAll("input[type=text],input[type=search],textarea"))
        .filter(el => (el.getRootNode && el.getRootNode() === document));
      if (!inputs.length) { log("No candidate inputs", "Low", T); return; }
      const exprs = ["{{7*7}}", "<%= 7*7 %>", "${{7*7}}", "${7*7}"];
      const beforeHTML = document.documentElement.innerHTML;
      for (const el of inputs.slice(0,8)) {
        const orig = el.value;
        for (const ex of exprs) {
          try {
            el.value = ex;
            el.dispatchEvent(new Event("input", { bubbles:true }));
            el.dispatchEvent(new Event("change", { bubbles:true }));
          } catch {}
        }
        el.value = orig;
      }
      await new Promise(r => setTimeout(r, 300));
      const afterHTML = document.documentElement.innerHTML;
      if (afterHTML.includes("49") && !beforeHTML.includes("49")) {
        log("Found '49' after injecting '{{7*7}}' expressions — CSTI hint", "High", T);
      } else {
        log("No clear CSTI signal from simple expressions", "Low", T);
      }
    }
  };

  // ------------------ Buttons ------------------
  for (const [name, fn] of Object.entries(tests)) {
    const b = document.createElement("button");
    b.textContent = name;
    b.onclick = async () => {
      findings = []; renderLogs(); toggleLoading(true);
      try { await fn(); }
      catch (e) { log(`Unexpected error in ${name}: ${e.message}`, "Medium", name); }
      toggleLoading(false);
    };
    buttonsDiv.appendChild(b);
  }

  // ------------------ Controls ------------------
  panel.querySelector('#sec_clear').onclick = () => { findings = []; renderLogs(); };
  panel.querySelector('#sec_close').onclick = () => wrapper.remove();
  panel.querySelector('#sec_minimize').onclick = () => panel.classList.toggle("minimized");

  panel.querySelector('#sec_run_all').onclick = async () => {
    findings = []; renderLogs(); toggleLoading(true);
    for (const [name, fn] of Object.entries(tests)) {
      try { await fn(); }
      catch (e) { log(`Unexpected error in ${name}: ${e.message}`, "Medium", name); }
    }
    const stats = { High:0, Medium:0, Low:0 };
    findings.forEach(f => { if (stats[f.severity] != null) stats[f.severity]++; });
    log(`Summary: High=${stats.High}, Medium=${stats.Medium}, Low=${stats.Low}`, "Low", "Summary");
    toggleLoading(false);
  };

  panel.querySelector('#sec_export').onclick = () => {
    const report = { url: location.href, time: new Date().toISOString(), findings };
    GM_download({
      url: "data:application/json," + encodeURIComponent(JSON.stringify(report, null, 2)),
      name: `sec_report_${Date.now()}.json`,
      saveAs: true
    });
  };

  panel.querySelector('#sec_copy').onclick = () => {
    const report = { url: location.href, time: new Date().toISOString(), findings };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(
      () => GM_notification("Report copied to clipboard!", "Success"),
      () => GM_notification("Failed to copy report.", "Error")
    );
  };

  filterSelect.onchange = renderLogs;
  searchInput.oninput = renderLogs;
  themeButton.onclick = () => {
    isLightMode = !isLightMode;
    panel.classList.toggle("light", isLightMode);
    themeButton.textContent = isLightMode ? "🌙" : "☀️";
  };

  // ------------------ Settings Modal Logic ------------------
  const openSettings = () => {
    inpWordlist.value = settings.wordlistUrl || '';
    inpDirLimit.value = Number(settings.dirProbeLimit || 200);
    inpExecXss.checked = !!settings.execXss;
    inpExtraPorts.value = settings.extraPorts || '';
    inpGraphqlPaths.value = settings.graphqlPaths || '';
    inpRateBurst.value = Number(settings.rateBurst || 8);
    modalBackdrop.hidden = false;
  };
  const closeSettings = () => { modalBackdrop.hidden = true; };

  settingsBtn.onclick = openSettings;
  modalClose.onclick = closeSettings;
  modalCancel.onclick = closeSettings;

  modalSave.onclick = () => {
    const wl = inpWordlist.value.trim();
    const dl = Math.max(10, Math.min(2000, Number(inpDirLimit.value) || 200));
    const ex = !!inpExecXss.checked;
    const ep = inpExtraPorts.value.trim();
    const gp = inpGraphqlPaths.value.trim();
    const rb = Math.max(1, Math.min(50, Number(inpRateBurst.value) || 8));

    settings.wordlistUrl = wl;
    settings.dirProbeLimit = dl;
    settings.execXss = ex;
    settings.extraPorts = ep;
    settings.graphqlPaths = gp;
    settings.rateBurst = rb;

    setVal('sec_wordlist_url', wl);
    setVal('sec_dir_limit', dl);
    setVal('sec_exec_xss', ex);
    setVal('sec_extra_ports', ep);
    setVal('sec_graphql_paths', gp);
    setVal('sec_rate_burst', rb);

    // apply in-memory for current session
    EXECUTE_XSS_PAYLOADS = ex;

    // Ports
    const newExtra = (ep || '').split(',').map(s=>parseInt(s.trim(),10)).filter(n=>Number.isInteger(n) && n>0);
    EXTRA_PORTS.length = 0;
    newExtra.forEach(n => { if (!EXTRA_PORTS.includes(n)) EXTRA_PORTS.push(n); });

    // GraphQL paths
    GRAPHQL_PATHS = ["/graphql", "/api/graphql"];
    if (gp) {
      const extra = gp.split(',').map(s=>s.trim()).filter(Boolean);
      GRAPHQL_PATHS = [...new Set([...GRAPHQL_PATHS, ...extra])];
    }

    closeSettings();
    GM_notification("Settings saved.", "Security Panel");
  };

  // ------------------ Dragging ------------------
  let dragging = false, offX=0, offY=0;
  panel.querySelector('#sec_header').addEventListener('mousedown', e => {
    dragging = true; const r = panel.getBoundingClientRect();
    offX = e.clientX - r.left; offY = e.clientY - r.top; e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - offX}px`;
    panel.style.top  = `${e.clientY - offY}px`;
    panel.style.right = "auto"; panel.style.bottom = "auto";
  });
  document.addEventListener('mouseup', () => dragging = false);

  // ------------------ Init ------------------
  log("Security Panel v13 initialized", "Low", "General");
})();
