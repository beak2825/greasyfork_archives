// ==UserScript==
// @name         emails VMA-V2 with HUD & Clear Global
// @namespace    http://tampermonkey.net/
// @version      4.7.1
// @description  emails Auto Vote for VMA
// @license      JBT
// @match        https://www.mtv.com/event/vma/vote/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545408/emails%20VMA-V2%20with%20HUD%20%20Clear%20Global.user.js
// @updateURL https://update.greasyfork.org/scripts/545408/emails%20VMA-V2%20with%20HUD%20%20Clear%20Global.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- helpers ----------
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const ts = () => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  };

  // ---------- storage keys ----------
  const EMAIL_STORE_KEY_GLOBAL = "vmaEmails";
  const RUN_ID_KEY = "vmaActiveRunId";
  const STATE_KEY  = "vmaState";

  let RUN_ID = localStorage.getItem(RUN_ID_KEY);
  if (!RUN_ID) {
    RUN_ID = Date.now().toString();
    localStorage.setItem(RUN_ID_KEY, RUN_ID);
  }
  const EMAIL_STORE_KEY_RUN = `vmaEmails:${RUN_ID}`;

  // ---------- email capture (per-run + global) ----------
  let emailsGlobal = [];
  let emailsRun = [];

  function refreshEmails() {
    try { emailsGlobal = JSON.parse(localStorage.getItem(EMAIL_STORE_KEY_GLOBAL) || "[]"); } catch { emailsGlobal = []; }
    try { emailsRun    = JSON.parse(localStorage.getItem(EMAIL_STORE_KEY_RUN)    || "[]"); } catch { emailsRun    = []; }
  }

  function persistEmails() {
    emailsGlobal = Array.from(new Set(emailsGlobal));
    emailsRun    = Array.from(new Set(emailsRun));
    try { localStorage.setItem(EMAIL_STORE_KEY_GLOBAL, JSON.stringify(emailsGlobal)); } catch {}
    try { localStorage.setItem(EMAIL_STORE_KEY_RUN,    JSON.stringify(emailsRun));    } catch {}
    updateHUD();
  }

  function saveEmail(email) {
    if (!email) return;
    refreshEmails();
    if (!emailsGlobal.includes(email)) emailsGlobal.push(email);
    if (!emailsRun.includes(email))    emailsRun.push(email);
    persistEmails();
    console.log(`[emails] saved: ${email} (run=${emailsRun.length}, global=${emailsGlobal.length})`);
  }

  function clearGlobalEmails() {
    try { localStorage.removeItem(EMAIL_STORE_KEY_GLOBAL); } catch {}
    refreshEmails();
    persistEmails();
    updateHUD();
    showPopup("🧹 Cleared GLOBAL emails", "#374151");
  }

  function downloadBlob(lines, filename) {
    if (!lines.length) { console.log("[emails] nothing to download"); return; }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    console.log(`[emails] Downloaded ${lines.length} emails -> ${filename}`);
  }

  function downloadEmailsTXT(name = `emails_global_${ts()}.txt`) {
    refreshEmails();
    downloadBlob(emailsGlobal, name);
  }

  function downloadEmailsTXTLatestRun(name = `emails_${ts()}_${RUN_ID}.txt`) {
    refreshEmails();
    downloadBlob(emailsRun, name);
  }

  // expose some helpers if you want to call from console
  window.downloadEmailsTXT = downloadEmailsTXT;
  window.downloadEmailsTXTLatestRun = downloadEmailsTXTLatestRun;
  window.countEmails = () => (refreshEmails(), { run: emailsRun.length, global: emailsGlobal.length });

  // ---------- state (resume) ----------
  let totalLoops  = 0; // 0 = infinite
  let currentLoop = 0;
  window.__stopVoting = false;

  function saveState() {
    const state = { totalLoops, currentLoop, stopped: window.__stopVoting === true, runId: RUN_ID };
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
    updateHUD();
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); } catch { return {}; }
  }

  function clearRunIfCompleted() {
    localStorage.removeItem(RUN_ID_KEY); // forces a new RUN_ID next time
  }

  // ---------- original voting logic (kept intact) ----------
  const loopGapMin = rand(1000, 3000);
  const loopGapMax = loopGapMin + rand(2000, 3000);
  console.log(`🌀 This tab's loop gap range: ${loopGapMin}-${loopGapMax} ms`);

  function showPopup(message, bgColor = "red") {
    const div = document.createElement("div");
    div.textContent = message;
    Object.assign(div.style, {
      position: "fixed", top: "20px", right: "20px", padding: "10px 20px",
      backgroundColor: bgColor, color: "white", fontSize: "16px", fontWeight: "bold",
      borderRadius: "8px", zIndex: 999999, boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  }

  document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key.toLowerCase() === 's') {
      window.__stopVoting = true;
      saveState();
      console.log("⛔ Kill switch activated — voting stopped.");
      showPopup("⛔ VOTING STOPPED", "darkred");
      setTimeout(() => downloadEmailsTXTLatestRun(), 300);
    }
  });

  function generateUniqueEmail() {
    const chars   = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const domains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'aol.com', 'icloud.com'];
    let email;
    if (!window.__usedEmailsSet) window.__usedEmailsSet = new Set();
    do {
      let username = '';
      const length = rand(8, 12);
      for (let i = 0; i < length; i++) username += chars.charAt(Math.floor(Math.random() * chars.length));
      email = `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
    } while (window.__usedEmailsSet.has(email));
    window.__usedEmailsSet.add(email);
    return email;
  }

  async function waitForElement(selector, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (window.__stopVoting) return null;
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(200);
    }
    return null;
  }

  async function login() {
    if (window.__stopVoting) return false;

    const addVoteBtn = await waitForElement('button[aria-label="Add Vote"]');
    if (!addVoteBtn) return false;

    await delay(rand(500, 1500));
    addVoteBtn.click();

    await delay(rand(800, 1500));
    const emailInput = document.querySelector('input[id^="field-:"]');
    if (!emailInput) return false;

    const email = generateUniqueEmail();
    saveEmail(email);
    console.log(`📧 Generated email: ${email}`);

    const reactProps = Object.values(emailInput).find(x => x?.onChange);
    const fireEvent = value => ({
      target: { value, name: emailInput.name, type: "email" },
      currentTarget: { value, name: emailInput.name, type: "email" },
      preventDefault: () => {}, stopPropagation: () => {}, persist: () => {},
      nativeEvent: new InputEvent("input", { bubbles: true })
    });

    emailInput.focus();
    reactProps?.onChange?.(fireEvent(email));
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(emailInput, email);
    ['input', 'change'].forEach(type => emailInput.dispatchEvent(new Event(type, { bubbles: true })));
    reactProps?.onBlur?.(fireEvent(email));

    await delay(rand(400, 900));
    const loginBtn = [...document.querySelectorAll('button.chakra-button')]
      .find(btn => btn.textContent.trim().toLowerCase() === 'log in');
    if (loginBtn && emailInput.value === email) {
      loginBtn.click();
      console.log("🔐 Attempting login...");
    }

    await delay(rand(1200, 2000));
    return true;
  }

  async function openSection() {
    if (window.__stopVoting) return false;
    const btn = await waitForElement('#accordion-button-best-k-pop', 5000);
    if (!btn) return false;

    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(rand(800, 1500));
    if (btn.getAttribute('aria-expanded') !== 'true') {
      btn.click();
      await delay(rand(1000, 1500));
    }
    return true;
  }

  async function voteJiminAuto() {
    if (window.__stopVoting) return false;

    const sectionOpen = await openSection();
    if (!sectionOpen) return false;

    const heading = [...document.querySelectorAll("h3")]
      .find(el => el.textContent.trim().toLowerCase() === "jimin");
    if (!heading) return false;

    let btn = null, node = heading;
    for (let i = 0; i < 8 && !btn; i++) {
      node = node.nextElementSibling || node.parentElement;
      if (!node) break;
      btn = node.querySelector?.('button[aria-label="Add Vote"]') || (node.matches?.('button[aria-label="Add Vote"]') ? node : null);
    }
    if (!btn) return false;

    const display = btn.parentElement.querySelector('p.chakra-text') || btn.closest('div')?.querySelector?.('p.chakra-text');

    let lastCount = -1;
    let stagnantTicks = 0;

    for (let i = 0; i < rand(120, 160); i++) {
      if (window.__stopVoting) return false;
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') break;
      btn.click();
      await delay(rand(90, 160));
      if (display) {
        const m = display.textContent.match(/\d+/);
        if (m) {
          const n = parseInt(m[0], 10);
          if (n === lastCount) stagnantTicks++;
          else { stagnantTicks = 0; lastCount = n; }
          if (stagnantTicks >= 5) break;
        }
      }
    }

    const confirm = async sel => {
      for (let i = 0; i < 50; i++) {
        if (window.__stopVoting) return null;
        const b = document.querySelector(sel);
        if (b && !b.disabled) return b;
        await delay(150);
      }
    };
    (await confirm('button[type="button"]:not([disabled])'))?.click();
    (await confirm('button.chakra-button.css-ufo2k5:not([disabled])'))?.click();
    return true;
  }

  async function logoutAndLoopAgain() {
    if (window.__stopVoting) return;

    console.log("🔁 Submitting vote...");
    await delay(rand(1500, 2500));

    let logoutBtn = document.querySelector('button.chakra-button.AuthNav__login-btn.css-ki1yvo');
    if (!logoutBtn) {
      logoutBtn = document.querySelector('#root > div > main > div.chakra-stack.chakra-container.css-8qrqqa > button');
    }
    if (logoutBtn) {
      logoutBtn.click();
      console.log("🚪 Logged out successfully");
    } else {
      console.warn("⚠️ Logout button not found");
    }

    const gap = rand(loopGapMin, loopGapMax);
    console.log(`⏳ Waiting ${gap}ms before next loop (this tab)...`);
    await delay(gap);
    runLoop();
  }

  async function runLoop() {
    if (window.__stopVoting) {
      console.log("⛔ Voting stopped manually.");
      return;
    }
    if (totalLoops !== 0 && currentLoop >= totalLoops) {
      console.log("✅ All loops completed.");
      saveState();
      downloadEmailsTXTLatestRun();
      clearRunIfCompleted();
      return;
    }
    currentLoop++;
    saveState();
    console.log(`🔁 Loop ${currentLoop}/${totalLoops || '∞'}`);

    const loggedIn = await login();
    if (!loggedIn) {
      console.warn("⚠️ Login failed");
      return;
    }

    const voted = await voteJiminAuto();
    if (!voted) {
      console.warn("⚠️ Vote failed");
      return;
    }

    await logoutAndLoopAgain();
  }

  // ---------- HUD ----------
  let hudEl = null;

  function ensureHUD() {
    if (hudEl) return;
    hudEl = document.createElement("div");
    Object.assign(hudEl.style, {
      position: "fixed", bottom: "16px", right: "16px", zIndex: 999999,
      background: "rgba(0,0,0,0.78)", color: "#fff", borderRadius: "12px",
      padding: "10px 12px", boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      font: "12px system-ui", minWidth: "260px"
    });
    hudEl.innerHTML = `
      <div style="font-weight:600;font-size:13px;margin-bottom:6px;">VMA Helper</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <label for="vmaLoops" style="opacity:.85;">Loops</label>
        <input id="vmaLoops" type="number" min="0" value="0" style="flex:1;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;padding:6px 8px;outline:none;">
        <button id="vmaStart" style="all:unset;background:#22c55e;padding:6px 10px;border-radius:8px;cursor:pointer;">Start</button>
      </div>
      <div id="vmaCounts" style="margin-bottom:8px;">Run: 0 · Global: 0 · Loop 0/∞</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <button id="vmaBtnRun"         style="all:unset;background:#1f6feb;padding:6px 8px;border-radius:8px;cursor:pointer;">Download Run</button>
        <button id="vmaBtnGlobal"      style="all:unset;background:#0ea5e9;padding:6px 8px;border-radius:8px;cursor:pointer;">Download Global</button>
        <button id="vmaBtnClearGlobal" style="all:unset;background:#6b7280;padding:6px 8px;border-radius:8px;cursor:pointer;">Clear Global</button>
        <button id="vmaBtnStop"        style="all:unset;background:#dc2626;padding:6px 8px;border-radius:8px;cursor:pointer;">Stop</button>
      </div>
    `;
    document.body.appendChild(hudEl);

    const inp = document.getElementById("vmaLoops");
    const st  = loadState();
    const savedLoops = parseInt(localStorage.getItem("vmaLoopCount") || "0", 10);
    inp.value = Number.isFinite(st.totalLoops) && st.totalLoops !== undefined
      ? st.totalLoops
      : (Number.isFinite(savedLoops) ? savedLoops : 0);

    document.getElementById("vmaStart").onclick = () => {
      const v = parseInt(inp.value || "0", 10);
      if (Number.isNaN(v) || v < 0) return;
      totalLoops = v;
      localStorage.setItem("vmaLoopCount", v);
      currentLoop = 0;
      window.__stopVoting = false;
      saveState();
      runLoop();
    };
    document.getElementById("vmaBtnRun").onclick         = () => downloadEmailsTXTLatestRun();
    document.getElementById("vmaBtnGlobal").onclick      = () => downloadEmailsTXT();
    document.getElementById("vmaBtnClearGlobal").onclick = () => clearGlobalEmails();
    document.getElementById("vmaBtnStop").onclick        = () => {
      window.__stopVoting = true;
      saveState();
      showPopup("⛔ VOTING STOPPED", "darkred");
      setTimeout(() => downloadEmailsTXTLatestRun(), 300);
    };
    updateHUD();
  }

  function updateHUD() {
    if (!hudEl) return;
    refreshEmails();
    const st = loadState();
    const counts = `Run: ${emailsRun.length} · Global: ${emailsGlobal.length} · Loop ${st.currentLoop || 0}/${(st.totalLoops === 0 || st.totalLoops === undefined) ? '∞' : st.totalLoops}`;
    const el = document.getElementById("vmaCounts");
    if (el) el.textContent = counts;
  }

  // ---------- Boot (robust: runs once, no auto-start unless resuming) ----------
  (function bootOnce() {
    const INIT_FLAG = "__vmaInit_hud_controls";
    if (window[INIT_FLAG]) return;
    window[INIT_FLAG] = true;

    function startOrResume() {
      ensureHUD();

      // resume only if there is an active run and it wasn't stopped and not finished
      const st = loadState();
      if (st.runId && st.runId === RUN_ID && st.totalLoops !== undefined && st.stopped !== true &&
          (st.totalLoops === 0 || st.currentLoop < st.totalLoops)) {
        totalLoops = parseInt(st.totalLoops || 0, 10);
        currentLoop = parseInt(st.currentLoop || 0, 10);
        window.__stopVoting = false;
        console.log("⏯️ Resuming run after reload...", st);
        updateHUD();
        runLoop();
        return;
      }

      // otherwise wait for user to set loops and press Start
      console.log("Ready. Set desired loops in the HUD and click Start.");
      updateHUD();
    }

    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", startOrResume, { once: true });
    } else {
      startOrResume();
    }
  })();

})();
