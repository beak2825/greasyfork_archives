// ==UserScript==
// @name         BotMafia
// @namespace    https://tampermonkey.net/
// @version      1.0.5
// @description  Automatyczne ataki dla polskamafia.pl
// @match        https://*.polskamafia.pl/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545601/BotMafia.user.js
// @updateURL https://update.greasyfork.org/scripts/545601/BotMafia.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.botWlaczony = false;
  let aktualniePracuje = false;

  const WORKER = "https://backend-killswitch.miki-falkowski.workers.dev";
  let KS_enabled = false;
  let KS_reason = "";

  const DEFAULTS = { energiaMin: 27, odwagaMin: 25, lvlMax: 30, victimsType: "not-active-gang", delayMs: 0 };
  let PROGI = { ...DEFAULTS };

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));
  const wait  = (ms = 0) => sleep(ms + Math.max(0, Number(PROGI?.delayMs || 0)));

  async function gmGet(key, def) {
    try { const v = await GM_getValue(key); return (v === undefined ? def : v); }
    catch { return def; }
  }
  async function gmSet(key, val) {
    try { await GM_setValue(key, val); } catch {}
  }

  async function fetchConfig() {
    const r = await fetch(`${WORKER}/config`, { cache: "no-store" });
    if (!r.ok) throw new Error("config failed");
    return r.json();
  }
  function isActive(cfg) {
    return cfg.enabled && (!cfg.expiresAt || Date.now() < Date.parse(cfg.expiresAt));
  }
  async function refreshFlag() {
    try {
      const cfg = await fetchConfig();
      const enabled = isActive(cfg);
      await gmSet("appEnabled", enabled);
      await gmSet("disableReason", enabled ? "" : (cfg.message || "Dostęp wyłączony."));
      KS_enabled = enabled;
      KS_reason = enabled ? "" : (cfg.message || "Dostęp wyłączony.");
      console.log("[KS] enabled:", enabled, "reason:", KS_reason);
    } catch (e) {
      await gmSet("appEnabled", false);
      await gmSet("disableReason", "Brak łączności z serwerem.");
      KS_enabled = false;
      KS_reason = "Brak łączności z serwerem.";
      console.warn("[KS] błąd/Offline:", e);
    }
  }
  async function readFlag() {
    KS_enabled = !!(await gmGet("appEnabled", false));
    KS_reason = await gmGet("disableReason", "");
    if (!KS_enabled) console.warn("⛔ Bot wyłączony:", KS_reason || "(brak powodu)");
  }

  async function loadSettings() {
    const energiaMin = Number(gmCast(await GM_getValue("energiaMin", DEFAULTS.energiaMin)));
    const odwagaMin  = Number(gmCast(await GM_getValue("odwagaMin",  DEFAULTS.odwagaMin)));
    const lvlMax     = Number(gmCast(await GM_getValue("lvlMax",     DEFAULTS.lvlMax)));
    const victimsType= String(gmCast(await GM_getValue("victimsType",DEFAULTS.victimsType)));
    const delayMs    = Number(gmCast(await GM_getValue("delayMs",    DEFAULTS.delayMs)));

    PROGI.energiaMin  = Number.isFinite(+energiaMin) ? +energiaMin : DEFAULTS.energiaMin;
    PROGI.odwagaMin   = Number.isFinite(+odwagaMin)  ? +odwagaMin  : DEFAULTS.odwagaMin;
    PROGI.lvlMax      = Number.isFinite(+lvlMax)     ? +lvlMax     : DEFAULTS.lvlMax;
    PROGI.victimsType = victimsType || DEFAULTS.victimsType;
    PROGI.delayMs     = Number.isFinite(+delayMs)    ? +delayMs    : DEFAULTS.delayMs;

    console.log("⚙️ Załadowane progi:", PROGI);
  }

  function gmCast(v) { return (v === undefined || v === null) ? "" : v; }
  async function saveSettings(newVals) {
    Object.assign(PROGI, newVals);
    await GM_setValue("energiaMin",  PROGI.energiaMin);
    await GM_setValue("odwagaMin",   PROGI.odwagaMin);
    await GM_setValue("lvlMax",      PROGI.lvlMax);
    await GM_setValue("victimsType", PROGI.victimsType);
    console.log("💾 Zapisano progi:", PROGI);
    await GM_setValue("delayMs",     PROGI.delayMs);
  }

  function czekajNaElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const effTimeout = timeout + Math.max(0, Number(PROGI?.delayMs || 0));
      const sprawdz = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - start > effTimeout) return reject("⏰ Timeout: " + selector);
        requestAnimationFrame(sprawdz);
      };
      sprawdz();
    });
  }

  GM_addStyle(`
    .pm-field{display:flex;align-items:center;justify-content:space-between;margin:6px 0 4px}
    .pm-field label{flex:1;color:#2b1e4b;font-weight:600}
    .pm-help{
      display:inline-flex;align-items:center;justify-content:center;
      width:18px;height:18px;border-radius:50%;
      background:#eee;color:#666;font-weight:700;font-size:12px;
      border:1px solid #ccc;cursor:default;user-select:none;margin-left:6px;position:relative
    }
    .pm-help::after{
      content: attr(data-tip);
      position:absolute;left:50%;bottom:130%;transform:translateX(-50%) translateY(6px);
      background:#2b1e4b;color:#fff;padding:8px 10px;border-radius:8px;
      box-shadow:0 8px 18px rgba(0,0,0,.25);max-width:240px;width:max-content;min-width:160px;
      font-weight:500;font-size:12px;line-height:1.35;opacity:0;pointer-events:none;transition:.15s ease;
      z-index:2147483647;white-space:normal;text-align:left
    }
    .pm-help::before{
      content:"";position:absolute;left:50%;bottom:120%;transform:translateX(-50%);
      border:6px solid transparent;border-top-color:#2b1e4b;opacity:0;transition:.15s ease
    }
    .pm-help:hover::after, .pm-help:hover::before{opacity:1;transform:translateX(-50%) translateY(0)}
    .pm-like-bot {
    position: fixed;
    z-index: 2147483647;
    padding: 8px 12px;
    background: #bfa5f2;
    border: 2px solid #6d55ab;
    color: #2b1e4b;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
    transition: all .2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    }
    .pm-like-bot:hover {
      filter: brightness(1.03);
      transform: translateY(-1px);
    }
    .pm-like-bot:active {
      transform: translateY(0);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    #pm-settings-btn svg {
      display: block;
      width: 18px;
      height: 18px;
      pointer-events: none; /* klik na całym przycisku */
    }
    .pm-tip { position: relative; }
    .pm-tip::after{
      content: attr(data-tip);
      position:absolute;left:50%;bottom:130%;transform:translateX(-50%) translateY(6px);
      background:#2b1e4b;color:#fff;padding:8px 10px;border-radius:8px;
      box-shadow:0 8px 18px rgba(0,0,0,.25);max-width:240px;width:max-content;min-width:160px;
      font-weight:500;font-size:12px;line-height:1.35;opacity:0;pointer-events:none;transition:.15s ease;
      z-index:2147483647;white-space:normal;text-align:left
    }
    .pm-tip::before{
      content:"";position:absolute;left:50%;bottom:120%;transform:translateX(-50%);
      border:6px solid transparent;border-top-color:#2b1e4b;opacity:0;transition:.15s ease
    }
    .pm-tip:hover::after, .pm-tip:hover::before{opacity:1;transform:translateX(-50%) translateY(0)}
  `);

  function stworzPrzyciskStylizowany(label, variableName, leftOffset) {
    const btn = document.createElement("button");
    btn.id = `pm-${label.toLowerCase()}-btn`;
    btn.innerText = `${label}: OFF`;
    btn.dataset.stan = "OFF";
    btn.classList.add("pm-tip");
    btn.setAttribute("data-tip", "Włączenie/Wyłącznie autoataków");
    btn.title = "Włączenie/Wyłącznie autoataków";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "10px",
      left: `${leftOffset}px`,
      zIndex: "2147483647",
      padding: "8px 12px",
      backgroundColor: "#bfa5f2",
      border: "2px solid #6d55ab",
      color: "#2b1e4b",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: "inset 0 0 4px rgba(0,0,0,0.4)",
      transition: "all 0.2s",
    });

    btn.addEventListener("click", () => {
      window[variableName] = !window[variableName];
      const aktywny = window[variableName];
      btn.innerText = `${label}: ${aktywny ? "ON" : "OFF"}`;
      btn.style.backgroundColor = aktywny ? "#8be58b" : "#bfa5f2";
      btn.style.color = aktywny ? "#044a04" : "#2b1e4b";
      btn.style.borderColor = aktywny ? "#1e8f1e" : "#6d55ab";
      console.log(`🔁 ${label} ${aktywny ? "włączony" : "wyłączony"}`);
    });

    document.body.appendChild(btn);
  }

  function initIndependentSettingsButton() {
    const gear = document.createElement("button");
    gear.id = "pm-settings-btn";
    gear.className = "pm-like-bot";
    gear.style.bottom = "10px";
    gear.style.left = "150px";

    gear.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M12 21a8.985 8.985 0 0 1-1.755-.173 1 1 0 0 1-.791-.813l-.273-1.606a6.933 6.933 0 0 1-1.32-.762l-1.527.566a1 1 0 0 1-1.1-.278 8.977 8.977 0 0 1-1.756-3.041 1 1 0 0 1 .31-1.092l1.254-1.04a6.979 6.979 0 0 1 0-1.524L3.787 10.2a1 1 0 0 1-.31-1.092 8.977 8.977 0 0 1 1.756-3.042 1 1 0 0 1 1.1-.278l1.527.566a6.933 6.933 0 0 1 1.32-.762l.274-1.606a1 1 0 0 1 .791-.813 8.957 8.957 0 0 1 3.51 0 1 1 0 0 1 .791.813l.273 1.606a6.933 6.933 0 0 1 1.32.762l1.527-.566a1 1 0 0 1 1.1.278 8.977 8.977 0 0 1 1.756 3.041 1 1 0 0 1-.31 1.092l-1.254 1.04a6.979 6.979 0 0 1 0 1.524l1.254 1.04a1 1 0 0 1 .31 1.092 8.977 8.977 0 0 1-1.756 3.041 1 1 0 0 1-1.1.278l-1.527-.566a6.933 6.933 0 0 1-1.32.762l-.273 1.606a1 1 0 0 1-.791.813A8.985 8.985 0 0 1 12 21zm-.7-2.035a6.913 6.913 0 0 0 1.393 0l.247-1.451a1 1 0 0 1 .664-.779 4.974 4.974 0 0 0 1.696-.975 1 1 0 0 1 1.008-.186l1.381.512a7.012 7.012 0 0 0 .7-1.206l-1.133-.939a1 1 0 0 1-.343-.964 5.018 5.018 0 0 0 0-1.953 1 1 0 0 1 .343-.964l1.124-.94a7.012 7.012 0 0 0-.7-1.206l-1.38.512a1 1 0 0 1-1-.186 4.974 4.974 0 0 0-1.688-.976 1 1 0 0 1-.664-.779l-.248-1.45a6.913 6.913 0 0 0-1.393 0l-.25 1.45a1 1 0 0 1-.664.779A4.974 4.974 0 0 0 8.7 8.24a1 1 0 0 1-1 .186l-1.385-.512a7.012 7.012 0 0 0-.7 1.206l1.133.939a1 1 0 0 1 .343.964 5.018 5.018 0 0 0 0 1.953 1 1 0 0 1-.343.964l-1.128.94a7.012 7.012 0 0 0 .7 1.206l1.38-.512a1 1 0 0 1 1 .186 4.974 4.974 0 0 0 1.688.976 1 1 0 0 1 .664.779zm.7-3.725a3.24 3.24 0 0 1 0-6.48 3.24 3.24 0 0 1 0 6.48zm0-4.48A1.24 1.24 0 1 0 13.24 12 1.244 1.244 0 0 0 12 10.76z"/>
    </svg>
    `;
    document.body.appendChild(gear);

    const panel = document.createElement("div");
    panel.id = "pm-settings-panel";
    panel.style.cssText = `
      position: fixed; display: none; z-index: 2147483647;
      min-width: 240px; max-width: 280px; width: 260px;
      padding: 10px; background: #fff; border: 2px solid #6d55ab; border-radius: 12px;
      box-shadow: 0 10px 24px rgba(0,0,0,.28); color: #2b1e4b; font-family: system-ui, sans-serif;
    `;
    panel.innerHTML = `
      <div style="font-weight:700; margin-bottom:6px;">Ustawienia bota</div>

      <div class="pm-field">
        <label>Min energia</label>
        <span class="pm-help"
              title="Minimalny poziom energii wymagany do startu sekwencji."
              data-tip="Minimalny poziom energii wymagany, aby bot uruchomił sekwencję ataku. Jeśli aktualna energia ≤ tej wartości, bot czeka.">?</span>
      </div>
      <input id="inp-energia" type="number" min="0"
            style="width:100%; padding:6px; border:1px solid #ccc; border-radius:8px;" />

      <div class="pm-field">
        <label>Min odwaga</label>
        <span class="pm-help"
              title="Minimalny próg odwagi wymagany do akcji."
              data-tip="Minimalny poziom odwagi wymagany, aby bot zaczął działać. Przy niższej odwadze bot nic nie robi.">?</span>
      </div>
      <input id="inp-odwaga" type="number" min="0"
            style="width:100%; padding:6px; border:1px solid #ccc; border-radius:8px;" />

      <div class="pm-field">
        <label>Max lvl przeciwnika</label>
        <span class="pm-help"
              title="Górny limit poziomu celu."
              data-tip="Maksymalny poziom przeciwnika, którego bot spróbuje zaatakować z wyników wyszukiwania. Wyżsi przeciwnicy są pomijani.">?</span>
      </div>
      <input id="inp-lvl" type="number" min="1"
            style="width:100%; padding:6px; border:1px solid #ccc; border-radius:8px;" />
      <div class="pm-field" style="margin-top:8px;">
        <label>Kogo atakować</label>
        <span class="pm-help"
              title="Filtr ofiar w wyszukiwarce"
              data-tip="Zdecyduj, kogo bot ma wyszukiwać przed atakiem.">?</span>
      </div>
      <select id="sel-victimsType" style="width:100%; padding:6px; border:1px solid #ccc; border-radius:8px;">
        <option value="all">Wszyscy gracze</option>
        <option value="not-active">Nieaktywni gracze</option>
        <option value="not-active-gang">Nieaktywni członkowie gangu</option>
        <option value="active-gang">Aktywni członkowie gangu</option>
        <option value="enemies">Twoi wrogowie</option>
      </select>
      <div class="pm-field" style="margin-top:8px;">
        <label>Globalne opóźnienie (ms)</label>
        <span class="pm-help"
            title="Dodaj stałe opóźnienie do wszystkich czekań (sleep/timeout) poza pętlami setInterval."
            data-tip="Wartość w milisekundach dodawana do *każdego* oczekiwania w logice bota, ale NIE wpływa na interwały setInterval.">?</span>
      </div>
      <input id="inp-delay" type="number" min="0"
        style="width:100%; padding:6px; border:1px solid #ccc; border-radius:8px;" />
      <div style="display:flex; gap:6px; margin-top:8px;">
        <button id="btn-zapisz" style="flex:1; padding:8px; background:#8be58b; border:2px solid #1e8f1e; color:#044a04; border-radius:10px; font-weight:700; cursor:pointer;">Zapisz</button>
        <button id="btn-reset"  style="flex:1; padding:8px; background:#ffd28b; border:2px solid #a87300; color:#4a2b00; border-radius:10px; font-weight:700; cursor:pointer;">Domyślne</button>
      </div>
    `;

    document.body.appendChild(panel);

    const energiaInp = panel.querySelector("#inp-energia");
    const odwagaInp = panel.querySelector("#inp-odwaga");
    const lvlInp = panel.querySelector("#inp-lvl");
    const victimsSel = panel.querySelector("#sel-victimsType");
    const delayInp   = panel.querySelector("#inp-delay");

    const fill = () => {
      energiaInp.value = PROGI.energiaMin;
      odwagaInp.value = PROGI.odwagaMin;
      lvlInp.value = PROGI.lvlMax;
      victimsSel.value  = PROGI.victimsType;
      delayInp.value = PROGI.delayMs;
    };
    fill();

    panel.querySelector("#btn-zapisz").addEventListener("click", async () => {
      const energiaMin = Math.max(0, parseInt(energiaInp.value || DEFAULTS.energiaMin, 10));
      const odwagaMin = Math.max(0, parseInt(odwagaInp.value || DEFAULTS.odwagaMin, 10));
      const lvlMax = Math.max(1, parseInt(lvlInp.value || DEFAULTS.lvlMax, 10));
      const victimsType = victimsSel.value || DEFAULTS.victimsType;
      const delayMs = Math.max(0, parseInt(delayInp.value || DEFAULTS.delayMs, 10));
      await saveSettings({ energiaMin, odwagaMin, lvlMax, victimsType, delayMs });
      fill();
      alert("Zapisano ustawienia ✅");
    });
    panel.querySelector("#btn-reset").addEventListener("click", async () => {
      await saveSettings({ ...DEFAULTS });
      fill();
      alert("Przywrócono domyślne wartości.");
    });

    function placeNearBot() {
      const bot = document.getElementById("pm-bot-btn")
           || Array.from(document.querySelectorAll("button"))
                .find(b => (b.textContent||"").trim().toUpperCase() === "BOT");
      if (!bot) return;
      const r = bot.getBoundingClientRect();
      const gap = 10;
      const left = Math.min(window.innerWidth - 56, Math.max(12, r.left + r.width + gap));
      gear.style.left = `${left}px`;
      gear.style.bottom = `${Math.max(12, window.innerHeight - (r.top + r.height))}px`;

      const gearRect = gear.getBoundingClientRect();
      panel.style.left = `${Math.max(12, Math.min(window.innerWidth - 280, gearRect.left - 8))}px`;
      panel.style.bottom = `${window.innerHeight - gearRect.top + 8}px`;
    }
    placeNearBot();
    window.addEventListener("resize", placeNearBot);
    window.addEventListener("scroll", placeNearBot, { passive: true });

    let open = false;
    gear.addEventListener("click", () => {
      open = !open;
      if (open) { fill(); placeNearBot(); panel.style.display = "block"; }
      else { panel.style.display = "none"; }
    });
    document.addEventListener("click", (e) => {
      if (!open) return;
      if (!gear.contains(e.target) && !panel.contains(e.target)) {
        open = false; panel.style.display = "none";
      }
    });
  }

  function dodajWszystkiePrzyciski() {
    stworzPrzyciskStylizowany("BOT", "botWlaczony", 60);
    initIndependentSettingsButton();
  }

  async function zamknijOknoModalne() {
    const btnZamknij = document.querySelector('.icon.icon-x');
    if (btnZamknij) {
      btnZamknij.click();
      console.log("❎ Zamknięto okno modalne");
    } else {
      console.warn("⚠️ Nie znaleziono przycisku zamykania");
    }
  }

  function secondsFromSekString(txt) {
  const m = String(txt || "").match(/(\d+)\s*(?:s|sek)?/i);
  return m ? Math.max(0, parseInt(m[1], 10)) : 0;
}

function getUnavailableStatus() {
  const el = document.querySelector("#hospitalPrisonTimeLeft")
        || document.querySelector("#prisonTimeLeft")
        || document.querySelector("#hospitalTimeLeft");
  if (el) {
    const leftText = (el.textContent || "").trim();
    const m = leftText.match(/(\d+)\s*(?:s|sek)?/i);
    const seconds = m ? parseInt(m[1], 10) : 0;
    if (Number.isFinite(seconds) && seconds > 0) {
      return { blocked: true, reason: "prison-hospital", secondsLeft: seconds, rawText: leftText };
    }
  }

  const noLivesBox = document.querySelector(".alert-icon-box.active.widget");
  if (noLivesBox && noLivesBox.textContent.includes("Brak żyć")) {
    return { blocked: true, reason: "no-lives" };
  }

  return { blocked: false, reason: null };
}


  async function Main() {
    if (!window.botWlaczony || aktualniePracuje) return;
    if (!KS_enabled) return;
    aktualniePracuje = true;
    const status = getUnavailableStatus();
    if (status.blocked) {
      if (status.reason === "prison-hospital") {
        console.log(`⛔ Wstrzymuję sekwencję – kara jeszcze trwa (${status.rawText || status.secondsLeft + "s"}). Sprawdzę ponownie za chwilę…`);
      } else if (status.reason === "no-lives") {
        console.log("⛔ Wstrzymuję sekwencję – brak żyć. Sprawdzę ponownie za chwilę…");
      }
      aktualniePracuje = false;
      return;
    }

    try {
      const energia = document.querySelector(".renew-energy");
      const energiaValue = parseInt(energia?.textContent?.split('/')[0]?.trim());
      const odwagaElement = document.querySelector(".renew-nerve");
      const odwagaValue = parseInt(odwagaElement?.textContent?.split('/')[0]?.trim());

      if (energiaValue > PROGI.energiaMin && odwagaValue > PROGI.odwagaMin) {
        console.log("⚡ Energia i odwaga w połowie – rozpoczynam sekwencję!");

        const btnEkwipunek = document.querySelector('a.icon-side[data-modal="/search"]');
        if (btnEkwipunek) {
          btnEkwipunek.click();
          console.log("🎒 Otworzono wyszukiwarke");
        } else {
          console.warn("⚠️ Nie znaleziono przycisku otwierającego wyszukiwarke");
        }

        await wait();

        const selectElement = document.querySelector('select[name="victimsType"]');
        if (selectElement) {
          selectElement.value = PROGI.victimsType;
          const changeEvent = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(changeEvent);
          console.log(`✅ Ustawiono filtr na '${PROGI.victimsType}'`);
        } else {
          console.warn("⚠️ Nie znaleziono pola wyboru ofiar");
        }

        const szukajBtn = document.querySelector('button.canAttack');
        if (szukajBtn) {
          szukajBtn.click();
          console.log("🔍 Kliknięto przycisk 'SZUKAJ'");
        } else {
          console.warn("⚠️ Nie znaleziono przycisku 'SZUKAJ'");
        }

        await wait(1000);

        const gracze = Array.from(document.querySelectorAll('#searchResults .t-item')).reverse();
        for (let gracz of gracze) {
          const levelDiv = gracz.querySelector('.w-level');
          if (!levelDiv) { console.warn("⚠️ Nie znaleziono poziomu dla gracza – pomijam"); continue; }

          const lvl = parseInt(levelDiv.textContent.trim());
          if (isNaN(lvl)) { console.warn("⚠️ Nieprawidłowy poziom – pomijam"); continue; }

          console.log(`🔍 Sprawdzam gracza: poziom = ${lvl}`);
          if (lvl < PROGI.lvlMax) {
            const atakBtn = gracz.querySelector('a.btn-danger[data-modal^="/attack-scene"]');
            if (atakBtn) {
              console.log(`⚔️ Atakuję gracza z poziomem ${lvl}`);
              atakBtn.click();
              break;
            } else {
              console.warn("❌ Nie znaleziono przycisku ATAKUJ – pomijam");
            }
          } else {
            console.log(`⏭️ Gracz ma zbyt wysoki poziom (${lvl}) – pomijam`);
          }
          await sleep(100);
        }

        await wait(100);

        const fightButton = document.querySelector('a.attackButton.fight-round');
        if (fightButton) {
          fightButton.click();
          console.log("🥊 Rozpoczęto rundę ataku!");
          const prisonTimeElement = document.querySelector("#hospitalPrisonTimeLeft");
          if (prisonTimeElement) {
            const prisonTime = parseInt(prisonTimeElement.textContent.trim());
            if (!isNaN(prisonTime)) {
              const waitTime = prisonTime + 10;
              console.log(`⏳ Zatrzymuję bota na ${waitTime} sekund z powodu więzienia.`);
              await wait(waitTime * 1000);
              console.log(`⏩ Czas minął, kontynuuję działanie...`);
            } else {
              console.log("❌ Nie udało się pobrać czasu z okna więzienia.");
            }
          }
        } else {
          console.warn("⚠️ Nie znaleziono przycisku 'ATAKUJ' w modalu walki");
        }

        await wait();
        await zamknijOknoModalne();
      } else {
        console.log("⚡ Energia lub Odwaga nie jest wystarczająca, skanuję dalej...");
      }
    } finally {
      aktualniePracuje = false;
    }
  }

  (async function start() {
    await refreshFlag();
    await readFlag();
    await loadSettings();
    dodajWszystkiePrzyciski();

    if (!KS_enabled) {
      console.warn("⛔ Kill-switch: bot nie wystartuje. Powód:", KS_reason || "(brak powodu)");
    } else {
      console.log("📦 Bot gotowy – czeka na uruchomienie");
    }
    setInterval(Main, 5000);
    setInterval(refreshFlag, 60 * 1000);
  })();

})();