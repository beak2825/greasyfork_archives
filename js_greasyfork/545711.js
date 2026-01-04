// ==UserScript==
// @name         Tequity Blackjack Helper (S17 • DOA • DAS)
// @namespace    bj-helper
// @version      1.9.0
// @description  HUD + Easytech auto-decode + robust split-hand handling + action/advance guards & fixes
// @match        https://*.tequity.ventures/games/tequity/*
// @match        https://*.easytech.ag/games/easytech/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545711/Tequity%20Blackjack%20Helper%20%28S17%20%E2%80%A2%20DOA%20%E2%80%A2%20DAS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545711/Tequity%20Blackjack%20Helper%20%28S17%20%E2%80%A2%20DOA%20%E2%80%A2%20DAS%29.meta.js
// ==/UserScript==

(() => {
    /* -------------------------- constants / settings -------------------------- */
    const RULES_LABEL = "S17 · DOA · DAS";
    const VERSION = GM_info.script.version;
    const JITTER_MS = [60, 120];
    const REBET_DELAY_MS = 250;
    const UI_TICK_MS = 150;
    const WARMUP_AFTER_RESUME_MS = 1250;
    const REBET_COOLDOWN_MS = 1200;
    const ACTING_COOLDOWN_MS = 450;
    const ACTING_COOLDOWN_AFTER_SPLIT_MS = 1100;
    const HAND_ADVANCE_TIMEOUT_MS = 2200; // watchdog (runs on tick)
    const WAIT_AFTER_INS_MS = 500;        // settle window after declining insurance

    // Quiet by default: only log split-hand advancement (or anything if DEBUG is checked)
    const ALWAYS_ALLOW_LOG = /^(MOVING TO SPLIT HAND|advance \(watchdog\))/;

    const LOG_LIMIT = 3000;

    /* -------------------------------- run state ------------------------------- */
    let RUNNING = false;
    let AUTOBET = loadBool("bjh.autobet", true);
    let ADVISOR_ONLY = loadBool("bjh.advisor", false);
    let DEBUG_NET = loadBool("bjh.debug", false);

    let rebetPending = false;
    let rebetCooldownUntil = 0;
    let actingCooldownUntil = 0;

    const seenPackets = new Set();
    const seenQueue = [];

    const state = {
        roundId: null,
        phase: "betting",
        insGateUntil: 0,

        dealerUpId: null,
        playerCards: [],
        playerIds: [],

        inSplit: false,
        totalHands: 1,
        activeHandIndex: 0,
        awaitingPostSplit: false,

        // hand-advance gate
        awaitingHandAdvance: false,
        awaitingAdvanceSince: 0,
        lastActedHandSig: "",
        lastActedIndex: 0,
        lastHandsSig: null,
        _lastSplitHandsSig: null,
        _lastHandsCards: [],
        _lastSplitSectionSig: "",
        _waitLogNextAt: 0,

        next: new Set(),

        baseBet: 0,
        stakeOut: 0,
        sessionPL: 0,
        wageredTotal: 0,

        playthroughTarget: loadNum("bjh.playthroughTarget", 0),

        wins: 0, losses: 0, pushes: 0,

        startingBalance: null,
        chartMode: "RTP",
        points: [],
        handCounter: 0,
    };

    /* ---------------------------------- utils --------------------------------- */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const rand = (a, b) => a + Math.random() * (b - a);
    const jitter = () => Math.round(rand(JITTER_MS[0], JITTER_MS[1]));
    const ts = () => `[${new Date().toTimeString().slice(0, 8)}]`;
    const fmtMoney = (n) => {
        const s = Number(n || 0).toFixed(2);
        return s.startsWith("-") ? `−${s.slice(1)}` : s;
    };
    function loadBool(k, d = false) { try { return JSON.parse(localStorage.getItem(k) ?? String(d)); } catch { return d; } }
    function saveBool(k, v) { localStorage.setItem(k, JSON.stringify(!!v)); }
    function loadNum(k, d = 0) { const n = Number(localStorage.getItem(k)); return Number.isFinite(n) ? n : d; }
    function saveNum(k, v) { localStorage.setItem(k, String(Number(v) || 0)); }

    function l(m) {
        // Quiet by default; only show split-hand advancement unless DEBUG is on
        if (!DEBUG_NET && !ALWAYS_ALLOW_LOG.test(m)) return;
        const pre = $("#bjh-log");
        if (!pre) return;
        pre.textContent += `${ts()} ${m}\n`;
        const lines = pre.textContent.split("\n");
        if (lines.length > LOG_LIMIT) pre.textContent = lines.slice(-Math.floor(LOG_LIMIT * 0.8)).join("\n");
        pre.scrollTop = pre.scrollHeight;
    }
    function lFullNet(obj, reason = "") {
        // Only when DEBUG is on
        if (!DEBUG_NET) return;
        try { l(`[NET FULL${reason ? " " + reason : ""}] ${JSON.stringify(obj)}`); }
        catch { l(`[NET FULL${reason ? " " + reason : ""}] <unserializable>`); }
    }
    const setDot = (on) => { const d = $("#bjh-dot"); if (d) d.style.background = on ? "var(--ok)" : "var(--muted)"; };

    function clickIfEnabled(btn, label, after) {
        if (!btn || btn.disabled) return false;
        setTimeout(() => { btn.click(); if (DEBUG_NET) l(`click ${label}`); after && after(); }, jitter());
        return true;
    }

    function getButtons() {
        const allBtns = Array.from(document.querySelectorAll('button,[role="button"]'));
        const byTid = (id) => document.querySelector(`button[data-testid="${id}"],[role="button"][data-testid="${id}"]`);
        const byText = (re) => allBtns.find((b) => re.test((b.textContent || "").trim()));
        const hit = byTid("BlackjackHitButton") || byText(/^hit\b/i);
        const stand = byTid("BlackjackStandButton") || byText(/^stand\b/i);
        const split = byTid("BlackjackSplitButton") || byText(/^split\b/i);
        const dbl = byTid("BlackjackDoubleButton") || byText(/^double\b/i);
        const bet = byTid("betButton") || byText(/^bet$/i);
        const insYes = byText(/accept insurance/i);
        const insNo = byText(/no insurance/i);
        return { hit, stand, split, dbl, bet, insYes, insNo };
    }

    function readBaseBet() {
        const inputs = $$("input").filter((el) => !el.closest("#bjh-root"));
        const leftThird = inputs.filter((el) => el.getBoundingClientRect().left < window.innerWidth / 3);
        const pool = leftThird.length ? leftThird : inputs;
        for (const el of pool) {
            const raw = (el.value ?? el.getAttribute("value") ?? "").toString();
            const v = parseFloat(raw.replace(/[^\d.]/g, ""));
            if (Number.isFinite(v) && v > 0 && v <= 100000) return v;
        }
        return state.baseBet || 0;
    }

    function readBalanceFromUI() {
        const nodes = $$("body *:not(script):not(style)").slice(0, 500);
        let best = null;
        for (const el of nodes) {
            const t = (el.textContent || "").trim();
            if (!/\d/.test(t) || t.length > 18) continue;
            const n = parseFloat(t.replace(/[^\d.]/g, ""));
            if (Number.isFinite(n) && (best === null || n > best)) best = n;
        }
        return best;
    }

    /* ------------------------- card helpers + formatting ---------------------- */
    const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const SUITS = ["♠", "♥", "♦", "♣"];

    function suitRankToId(suit, rank) {
        const s = { S: 0, H: 1, D: 2, C: 3 }[String(suit).toUpperCase()] ?? 0;
        const r =
            { A: 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9, J: 10, Q: 11, K: 12 }[
            String(rank).toUpperCase()
            ] ?? 0;
        return s * 13 + r;
    }
    function extractId(card) {
        if (typeof card === "number") return card;
        if (card && typeof card === "object") {
            if (Number.isFinite(card.index)) return Number(card.index);
            if (card.suit && card.rank) return suitRankToId(card.suit, card.rank);
        }
        return 0;
    }
    function idToLabel(id) { const r = id % 13, s = (id / 13) | 0; return `${RANKS[r]}${SUITS[s]}`; }
    function rankCharBJ(id) { const r = id % 13; return r === 0 ? "A" : (r >= 10 ? "X" : String(r + 1)); }
    function shortHand(ids, limit = 5) { return (ids || []).slice(0, limit).map(rankCharBJ).join(" / "); }

    function handTotalFromIds(ids) {
        let t = 0, a = 0;
        ids.forEach((cid) => { const r = cid % 13; if (r === 0) { t += 11; a++; } else if (r >= 10) t += 10; else t += r + 1; });
        const hard = ids.reduce((s, cid) => { const r = cid % 13; return s + (r === 0 ? 1 : r >= 10 ? 10 : r + 1); }, 0);
        while (t > 21 && a) { t -= 10; a--; }
        return { total: t, soft: t !== hard };
    }

    /* ------------------ strategy (S17 • DOA • DAS — basic) -------------------- */
    function decideMove(playerIds, dealerUpId) {
        const up = (dealerUpId % 13) + 1;
        const ranksArr = playerIds.map((c) => (c % 13) + 1);
        const { total, soft } = handTotalFromIds(playerIds);

        // pairs (DAS)
        if (ranksArr.length === 2 && ranksArr[0] === ranksArr[1]) {
            const r = ranksArr[0];
            if (r === 1 || r === 8) return "SPLIT";
            if (r === 9) return [2, 3, 4, 5, 6, 8, 9].includes(up) ? "SPLIT" : "STAND";
            if (r === 7) return [2, 3, 4, 5, 6, 7].includes(up) ? "SPLIT" : "HIT";
            if (r === 6) return [2, 3, 4, 5, 6].includes(up) ? "SPLIT" : "HIT";
            if (r === 5) return [2, 3, 4, 5, 6, 7, 8, 9].includes(up) ? "DOUBLE" : "HIT";
            if (r === 4) return [5, 6].includes(up) ? "SPLIT" : "HIT";
            if (r === 2 || r === 3) return [2, 3, 4, 5, 6, 7].includes(up) ? "SPLIT" : "HIT";
            if (r >= 10) return "STAND";
        }

        // soft totals (A+X)
        if (soft) {
            if (total >= 20) return "STAND";
            if (total === 19) return "STAND";
            if (total === 18) {
                if ([3, 4, 5, 6].includes(up)) return "DOUBLE";
                if ([2, 7, 8].includes(up)) return "STAND";
                return "HIT";
            }
            if (total === 17) return [3, 4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
            if (total === 16 || total === 15) return [4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
            if (total === 14 || total === 13) return [5, 6].includes(up) ? "DOUBLE" : "HIT"; // A/3 vs A → HIT
            return "HIT";
        }

        // hard totals
        if (total >= 17) return "STAND";
        if (total >= 13 && total <= 16) return [2, 3, 4, 5, 6].includes(up) ? "STAND" : "HIT";
        if (total === 12) return [4, 5, 6].includes(up) ? "STAND" : "HIT";
        if (total === 11) return "DOUBLE";
        if (total === 10) return [2, 3, 4, 5, 6, 7, 8, 9].includes(up) ? "DOUBLE" : "HIT";
        if (total === 9) return [3, 4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
        return "HIT";
    }

    /* --------------------- Easytech smart decode helpers ---------------------- */
    const isLikelyB64 = (s) =>
        typeof s === "string" && /^[A-Za-z0-9+/=\s]+$/.test(s) && (s.length % 4 === 0 || s.endsWith("="));
    const tryJSON = (s) => { try { return JSON.parse(s); } catch { return null; } };
    const b64ToJSON = (s) => { try { const txt = atob(s.trim()); const j = tryJSON(txt); return j || null; } catch { return null; } };

    function decodeEasytechPayload(payload) {
        if (payload && typeof payload === "object" && !Array.isArray(payload)) return payload;
        if (Array.isArray(payload)) {
            if (payload.length === 1 && typeof payload[0] === "string" && isLikelyB64(payload[0])) return b64ToJSON(payload[0]);
            return null;
        }
        if (typeof payload === "string") {
            const j1 = tryJSON(payload);
            if (j1) {
                if (Array.isArray(j1) && j1.length === 1 && typeof j1[0] === "string" && isLikelyB64(j1[0])) return b64ToJSON(j1[0]);
                if (j1 && typeof j1 === "object" && !Array.isArray(j1)) return j1;
            }
            if (isLikelyB64(payload)) return b64ToJSON(payload);
            if (payload.startsWith('["') && payload.endsWith('"]')) {
                const arr = tryJSON(payload);
                if (Array.isArray(arr) && arr.length === 1 && typeof arr[0] === "string" && isLikelyB64(arr[0])) return b64ToJSON(arr[0]);
            }
        }
        return null;
    }

    /* --------------------- Promise-tap fallback (site-decoded) ----------------- */
    function looksLikePacket(x) {
        if (!x || typeof x !== "object") return false;
        if ("roundId" in x && ("wager" in x || "complete" in x)) return true;
        const w = x.wager || x.data;
        if (w && (w.data || w.state || x.next || w.next)) return true;
        return false;
    }
    function tapCandidate(val, src) { try { if (looksLikePacket(val)) { if (DEBUG_NET) l(`[TAP] ${src} ✓`); onPlayPacket(val, true); } } catch { } }
    function installPromiseTap() {
        if (window.__bjh_promiseTap) return;
        window.__bjh_promiseTap = true;
        const _json = Response.prototype.json;
        Response.prototype.json = function (...a) { return _json.apply(this, a).then(v => { tapCandidate(v, "Response.json"); return v; }); };
        const _then = Promise.prototype.then;
        Promise.prototype.then = function (onFulfilled, onRejected) {
            const wrapped = typeof onFulfilled === "function" ? (v) => { tapCandidate(v, "Promise.then"); return onFulfilled(v); } : (v) => { tapCandidate(v, "Promise.then(pass)"); return v; };
            return _then.call(this, wrapped, onRejected);
        };
    }

    /* ---------------------- normalize hands (split-aware) ---------------------- */
    function findActiveIndexLike(obj) {
        const keys = ["activeSplitHandIndex", "activeHandIndex", "activeIndex", "activeHand", "currentHandIndex", "currentHand", "handIndex", "turnHandIndex", "turnIndex"];
        for (const k of keys) { const v = obj && obj[k]; if (Number.isInteger(v)) return v; }
        return null;
    }
    function normalizeHands(data, stateObj) {
        const s = stateObj || {}, d = data || {};
        const hs = s.splitHands || d.splitHands || s.playerHands || d.playerHands || s.hands || d.hands;
        if (Array.isArray(hs) && hs.length) {
            let ai = findActiveIndexLike(s); if (ai == null) ai = findActiveIndexLike(d);
            const ph = s.playerHand || d.playerHand || s.playerHandCurrent || d.playerHandCurrent;
            if (ai == null && ph && Array.isArray(ph.cards || ph)) {
                const p = (ph.cards || ph).map(extractId).join(",");
                const idx = hs.findIndex(h => Array.isArray(h) ? p === h.map(extractId).join(",")
                    : p === (h?.cards || []).map(extractId).join(","));
                if (idx >= 0) ai = idx;
            }
            if (ai == null) ai = 0;
            const norm = hs.map(h => Array.isArray(h) ? { cards: h } : (h || { cards: [] }));
            return { hands: norm, active: Math.max(0, Math.min(ai, norm.length - 1)) };
        }
        const ph = s.playerHand || d.playerHand || s.playerHandCurrent || d.playerHandCurrent;
        if (ph) return { hands: [ph.cards ? ph : { cards: ph }], active: 0 };
        return null;
    }

    /* ----------------------------------- HUD ---------------------------------- */
    const styles = `
    #bjh-root{position:fixed; top:12px; right:12px; z-index:999999; font-family:system-ui,-apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, sans-serif; --panel:#151833; --muted:#7c86a5; --ok:#2ecc71; color:#e7eaf6}
    #bjh-card{background:var(--panel); border:1px solid #262a4b; border-radius:12px; box-shadow:0 12px 34px rgba(0,0,0,.35); width:420px; max-width:42vw}
    #bjh-header{display:flex; gap:.5rem; align-items:center; padding:.5rem .65rem; border-bottom:1px solid #262a4b}
    #bjh-header .title{font-weight:600; font-size:.98rem; letter-spacing:.2px}
    #bjh-ver{ margin-left:auto; opacity:.65; font-size:.75rem }
    #bjh-dot{width:8px; height:8px; border-radius:99px; background:#7c86a5}
    #bjh-rules{opacity:.75; font-size:.82rem; margin-left:.35rem}
    #bjh-body{display:grid; gap:.55rem; padding:.6rem .65rem .75rem}
    #bjh-controls{display:flex; align-items:center; gap:.5rem}
    #bjh-controls .left{display:flex; gap:.35rem; align-items:center}
    #bjh-controls .right{margin-left:auto; display:flex; gap:.85rem; align-items:center; color:var(--muted)}
    #bjh-controls button{background:#1e2245; color:#e7eaf6; border:1px solid #2a2f5c; border-radius:8px; padding:.28rem .55rem; cursor:pointer; font-size:.85rem}
    #bjh-controls label{display:flex; align-items:center; gap:.35rem; font-size:.82rem}
    #bjh-kpis{display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:.55rem}
    .kpi{background:#1a1e3a; border:1px solid #2a2f5c; border-radius:10px; padding:.5rem .6rem}
    .kpi .label{color:var(--muted); font-size:.72rem; letter-spacing:.25px; text-transform:uppercase}
    .kpi .value{font-weight:600; font-size:.96rem; margin-top:.12rem}
    #bjh-ptcard{background:#171b3a; border:1px solid #2a2f5c; border-radius:10px; padding:.55rem .6rem; display:grid; grid-template-columns:1fr auto; align-items:center; gap:.6rem}
    #bjh-ptcard .title{font-weight:600; font-size:.9rem}
    .money-input{position:relative; width:130px}
    .money-input > span{position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#9aa3cc; font-size:.86rem; pointer-events:none}
    .money-input > input{width:100%; background:#0e1125; color:#e7eaf6; border:1px solid #2a2f5c; border-radius:8px; padding:.3rem .45rem .3rem 1.35rem}
    #bjh-ptmeta{grid-column:1 / -1; color:var(--muted); font-size:.82rem; display:flex; gap:1rem}
    details.bjh-sec{border:1px solid #262a4b; border-radius:10px; overflow:hidden}
    details.bjh-sec > summary{background:#14183a; padding:.5rem .65rem; cursor:pointer; list-style:none; font-size:.85rem; color:#b9c1e7; display:flex; align-items:center; justify-content:space-between}
    details.bjh-sec[open] > summary{border-bottom:1px solid #262a4b}
    .bjh-sec .sum-left{display:flex; align-items:center; gap:.45rem}
    .bjh-sec .caret{display:inline-block; transition:transform .18s ease; font-size:.9rem}
    details[open].bjh-sec .caret{transform:rotate(90deg)}
    .bjh-sec .content{padding:.6rem .65rem}
    #bjh-stats .content{font-size:.85rem; line-height:1.45}
    #bjh-stats .row{margin:.18rem 0}
    #bjh-chart-toggle,#bjh-saveimg,#bjh-savelog,#bjh-clear{background:#1a1e3a; border:1px solid #2a2f5c; color:#b4bce3; padding:.28rem .55rem; border-radius:8px; font-size:.78rem; cursor:pointer}
    #bjh-canvas{width:100%; height:180px; display:block; background:#0e1125; border:1px solid #262a4b; border-radius:8px}
    #bjh-log{width:100%; height:220px; background:#0e1125; border:1px solid #262a4b; border-radius:8px; padding:.5rem; overflow:auto; font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:12px; line-height:1.35}
  `;
    const hud = `
    <div id="bjh-root">
      <style>${styles}</style>
      <div id="bjh-card">
        <div id="bjh-header">
          <div id="bjh-dot"></div>
          <div class="title">BJ Strategy Helper</div>
          <div id="bjh-rules">${RULES_LABEL}</div>
          <div id="bjh-ver">v${VERSION}</div>
        </div>

        <div id="bjh-body">
          <div id="bjh-controls">
            <div class="left">
              <button id="bjh-start">Start</button>
              <button id="bjh-stop">Stop</button>
            </div>
            <div class="right">
              <label><input id="bjh-autobet" type="checkbox"> Autobet</label>
              <label><input id="bjh-adv" type="checkbox"> Advisor</label>
              <label><input id="bjh-debug" type="checkbox"> DEBUG</label>
            </div>
          </div>
          <div id="bjh-kpis">
            <div class="kpi"><div class="label">Base Bet</div><div class="value" id="bjh-base">–</div></div>
            <div class="kpi"><div class="label">Stake Out</div><div class="value" id="bjh-stake">–</div></div>
            <div class="kpi"><div class="label">Session P/L</div><div class="value" id="bjh-pl">0.00</div></div>
            <div class="kpi"><div class="label">Total Wagered</div><div class="value" id="bjh-wagered">0.00</div></div>
          </div>
          <div id="bjh-ptcard">
            <div class="title">Playthrough Target</div>
            <div class="money-input"><span>$</span><input id="bjh-pt" type="number" min="0" step="1" placeholder="e.g. 1000"/></div>
            <div id="bjh-ptmeta">
              <span id="bjh-pt-left"></span>
              <span id="bjh-hands"></span>
            </div>
          </div>
          <details id="bjh-stats" class="bjh-sec" open>
            <summary><span class="sum-left"><span class="caret">▶</span><span>Session Stats</span></span><span></span></summary>
            <div class="content">
              <div class="row"><span id="bjh-hwp">0 hands · W:0 L:0 P:0</span></div>
              <div class="row">Profit: <span id="bjh-prof">$0.00</span> (<span id="bjh-profPct">100.00%</span>)</div>
              <div class="row">RTP: <span id="bjh-rtp">—</span></div>
            </div>
          </details>
          <details id="bjh-chart" class="bjh-sec" open>
            <summary><span class="sum-left"><span class="caret">▶</span><span>Playthrough Charts</span></span><span><button id="bjh-chart-toggle">↔ RTP</button><button id="bjh-saveimg">Save Image</button></span></summary>
            <div class="content"><canvas id="bjh-canvas" width="760" height="180"></canvas></div>
          </details>
          <details id="bjh-logwrap" class="bjh-sec" open>
            <summary><span class="sum-left"><span class="caret">▶</span><span>Activity Log</span></span><span><button id="bjh-savelog">Save Log</button><button id="bjh-clear">Clear Log</button></span></summary>
            <div class="content"><pre id="bjh-log"></pre></div>
          </details>
        </div>
      </div>
    </div>`;

    /* ------------------------------- boot HUD -------------------------------- */
    function mountHUD() {
        if ($("#bjh-root")) return;
        document.body.insertAdjacentHTML("beforeend", hud);

        $("#bjh-autobet").checked = AUTOBET;
        $("#bjh-adv").checked = ADVISOR_ONLY;
        $("#bjh-debug").checked = DEBUG_NET;
        $("#bjh-pt").value = state.playthroughTarget || "";

        $("#bjh-start").onclick = async () => {
            RUNNING = true; setDot(true);
            AUTOBET = $("#bjh-autobet").checked; saveBool("bjh.autobet", AUTOBET);
            ADVISOR_ONLY = $("#bjh-adv").checked; saveBool("bjh.advisor", ADVISOR_ONLY);
            DEBUG_NET = $("#bjh-debug").checked; saveBool("bjh.debug", DEBUG_NET);
            state.playthroughTarget = Number($("#bjh-pt").value) || 0;
            saveNum("bjh.playthroughTarget", state.playthroughTarget);
            state.startingBalance = readBalanceFromUI();
            if (DEBUG_NET) l("RUNNING = true");
            await sleep(WARMUP_AFTER_RESUME_MS);
            if (RUNNING) kickAutoBetIfReady(true);
        };
        $("#bjh-stop").onclick = () => { RUNNING = false; setDot(false); if (DEBUG_NET) l("RUNNING = false"); };
        $("#bjh-autobet").onchange = (e) => { AUTOBET = e.target.checked; saveBool("bjh.autobet", AUTOBET); };
        $("#bjh-adv").onchange = (e) => { ADVISOR_ONLY = e.target.checked; saveBool("bjh.advisor", ADVISOR_ONLY); };
        $("#bjh-debug").onchange = (e) => { DEBUG_NET = e.target.checked; saveBool("bjh.debug", DEBUG_NET); };
        $("#bjh-pt").onchange = () => { state.playthroughTarget = Number($("#bjh-pt").value) || 0; saveNum("bjh.playthroughTarget", state.playthroughTarget); updateKPIs(); };
        $("#bjh-clear").onclick = () => { $("#bjh-log").textContent = ""; };
        $("#bjh-savelog").onclick = () => { const pre = $("#bjh-log"); const blob = new Blob([pre.textContent || ""], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.download = `bj-helper-log-${Date.now()}.txt`; a.href = url; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); };
        $("#bjh-chart-toggle").onclick = () => { state.chartMode = state.chartMode === "RTP" ? "PROFIT" : "RTP"; $("#bjh-chart-toggle").textContent = state.chartMode === "RTP" ? "↔ RTP" : "↔ Profit%"; drawChart(); };

        updateKPIs();
    }

    function updateKPIs() {
        $("#bjh-base").textContent = state.baseBet ? fmtMoney(state.baseBet) : "–";
        $("#bjh-stake").textContent = state.stakeOut ? fmtMoney(state.stakeOut) : "–";
        $("#bjh-pl").textContent = fmtMoney(state.sessionPL);
        $("#bjh-wagered").textContent = fmtMoney(state.wageredTotal);

        const left = (state.playthroughTarget || 0) - state.wageredTotal;
        $("#bjh-pt-left").textContent = state.playthroughTarget ? `left: $${fmtMoney(Math.max(left, 0))}` : "";
        const planned = state.playthroughTarget && state.baseBet ? Math.ceil(state.playthroughTarget / state.baseBet) : 0;
        const played = state.baseBet ? Math.floor(state.wageredTotal / state.baseBet) : 0;
        $("#bjh-hands").textContent = planned ? `• hands planned: ${planned} · left: ${Math.max(planned - played, 0)}` : "";

        $("#bjh-hwp").textContent = `${state.handCounter} hands · W:${state.wins} L:${state.losses} P:${state.pushes}`;

        const profPct = state.startingBalance && state.startingBalance > 0 ? 100 * ((state.startingBalance + state.sessionPL) / state.startingBalance) : 100;
        $("#bjh-prof").textContent = `$${(state.sessionPL || 0).toFixed(2)}`;
        $("#bjh-profPct").textContent = `${profPct.toFixed(2)}%`;

        const rtp = rtpPercent();
        $("#bjh-rtp").textContent = isFinite(rtp) ? `${rtp.toFixed(2)}%` : "—";
    }

    /* --------------------------- round helpers ---------------------------- */
    function resetRound() {
        state.phase = "betting";
        state.playerCards = [];
        state.playerIds = [];
        state.dealerUpId = null;
        state.next.clear();
        state.inSplit = false;
        state.totalHands = 1;
        state.activeHandIndex = 0;
        state.awaitingPostSplit = false;
        state.awaitingHandAdvance = false;
        state.awaitingAdvanceSince = 0;
        state.lastActedHandSig = "";
        state.lastActedIndex = 0;
        state.lastHandsSig = null;
        state._lastSplitHandsSig = null;
        state._lastHandsCards = [];
        state._lastSplitSectionSig = "";
        state._waitLogNextAt = 0;
        state.baseBet = readBaseBet();
        state.stakeOut = state.baseBet || 0;
        updateKPIs();
    }

    function maybeDeclineInsurance() {
        const { insNo } = getButtons();
        if (insNo && !insNo.disabled) {
            clickIfEnabled(insNo, "declined insurance");
            actingCooldownUntil = Date.now() + WAIT_AFTER_INS_MS; // small settle window
            state.insGateUntil = Date.now() + 2000;             // allow acting after 2s even if next still shows insurance
            return true;
        }
        return false;
    }

    function kickAutoBetIfReady(logReasons = false) {
        if (!RUNNING || !AUTOBET) return;
        if (Date.now() < rebetCooldownUntil) { if (logReasons && DEBUG_NET) l("skip Bet: cooldown"); return; }
        if (rebetPending) { if (logReasons && DEBUG_NET) l("skip Bet: pending"); return; }
        if (state.playthroughTarget && state.wageredTotal >= state.playthroughTarget) {
            RUNNING = false; setDot(false);
            if (DEBUG_NET) l(`Playthrough reached ($${fmtMoney(state.wageredTotal)} / $${fmtMoney(state.playthroughTarget)}). Stopping.`);
            return;
        }
        const { bet } = getButtons();
        if (!bet) { if (logReasons && DEBUG_NET) l("skip Bet: button not found"); return; }
        if (bet.disabled) { if (logReasons && DEBUG_NET) l("skip Bet: button disabled"); return; }

        rebetPending = true;
        setTimeout(() => {
            rebetPending = false;
            if (!RUNNING || !AUTOBET) return;
            if (state.playthroughTarget && state.wageredTotal >= state.playthroughTarget) return;
            const { bet } = getButtons();
            if (!bet || bet.disabled) return;
            const base = readBaseBet();
            clickIfEnabled(bet, "Bet", () => {
                resetRound();
                state.stakeOut = base;
                rebetCooldownUntil = Date.now() + REBET_COOLDOWN_MS;
            });
        }, REBET_DELAY_MS);
    }

    /* ----------------------------- network hook ---------------------------- */
    function installFetchSniffer() {
        if (window.__bjh_fetchPatched) return;
        window.__bjh_fetchPatched = true;

        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await origFetch(...args);
            try {
                const url = args[0]?.toString?.() || "";
                if (/\/game\/play/.test(url)) {
                    res.clone().json().then((j) => {
                        const obj = decodeEasytechPayload(j) || j;
                        if (obj && typeof obj === "object") onPlayPacket(obj);
                    }).catch(() => {
                        res.clone().text().then((t) => {
                            const obj = decodeEasytechPayload(t);
                            if (obj) onPlayPacket(obj);
                        }).catch(() => { });
                    });
                }
            } catch { }
            return res;
        };

        const oOpen = XMLHttpRequest.prototype.open;
        const oSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (m, u, ...r) { this.__bjh_url = u; return oOpen.call(this, m, u, ...r); };
        XMLHttpRequest.prototype.send = function (...a) {
            this.addEventListener("load", function () {
                try {
                    if (/\/game\/play/.test(this.__bjh_url || "")) {
                        const obj = decodeEasytechPayload(this.responseText) || decodeEasytechPayload(this.response);
                        if (obj) onPlayPacket(obj);
                    }
                } catch { }
            });
            return oSend.apply(this, a);
        };
    }

    function packetSig(d) {
        try {
            const rid = d?.roundId ?? "";
            const w = d?.wager ?? {};
            const data = w.data ?? {};
            const s = w.state ?? {};
            const hands = s.splitHands || data.splitHands || s.playerHands || data.playerHands || s.hands || data.hands;
            const ai = findActiveIndexLike(s) ?? findActiveIndexLike(data) ?? -1;
            const lens = Array.isArray(hands) ? hands.map(h => (Array.isArray(h) ? h.length : (h?.cards?.length ?? 0))).join(",")
                : (data.playerHand?.cards?.length ?? s.playerHand?.cards?.length ?? 0);
            const dc = (data.dealerHand?.cards?.length ?? s.dealerHand?.cards?.length ?? 0) ||
                (data.dealerUpcard?.cards?.length ?? s.dealerUpcard?.cards?.length ?? 0);
            const fw = d?.complete?.finalWin ?? "x";
            const ph = (data.result || s.result) ? "settle" : "start";
            return `${rid}|ph=${ph}|h=${lens}|ai=${ai}|dc=${dc}|fw=${fw}`;
        } catch { return String(Math.random()); }
    }
    function dedupe(d) {
        const sig = packetSig(d);
        if (seenPackets.has(sig)) return true;
        seenPackets.add(sig);
        seenQueue.push(sig);
        if (seenQueue.length > 150) seenPackets.delete(seenQueue.shift());
        return false;
    }

    /* ------------------------------ hand signature ---------------------------- */
    function currentHandSig() { return `${state.roundId}|ai=${state.activeHandIndex}|${state.playerIds.join(",")}`; }

    /* ------------------------------ split logger ------------------------------ */
    function logSplitSection(nh, wholePacket) {
        if (!DEBUG_NET) return; // only in DEBUG now
        try {
            const hands = nh.hands.map(h => (h.cards || h).map(extractId));
            const sig = hands.map(h => h.join(",")).join("|");
            if (sig === state._lastSplitSectionSig) return;
            state._lastSplitSectionSig = sig;

            l("### SPLIT DETECTED ###");
            if (hands.length >= 2 && hands[0][0] != null && hands[1][0] != null) {
                l(`SPLIT HAND - ${rankCharBJ(hands[0][0])} / ${rankCharBJ(hands[1][0])}`);
            }
            hands.forEach((ids, i) => l(`SPLIT HAND ${i} - ${shortHand(ids)}`));
            lFullNet(wholePacket, "(split packet)");
            l("### END OF SPLIT DETECTION ###");
        } catch (e) { l(`### SPLIT DETECTED (log error: ${e?.message || e}) ###`); }
    }

    /* ------------------------------- main ingest ------------------------------ */
    function onPlayPacket(data) {
        if (!data || typeof data !== "object") return;
        if (dedupe(data)) return;

        const wager = data?.wager || {};
        const d = wager.data || {};
        const s = wager.state || {};
        state.next = new Set(wager.next || s.next || []);

        if (data.roundId) state.roundId = data.roundId;
        const balance = data?.balance;
        if (Number.isFinite(balance) && state.startingBalance == null) state.startingBalance = Number(balance);

        // dealer upcard (explicit upcard preferred)
        const dealerUp = d.dealerUpcard || s.dealerUpcard || (d.dealerHand && { cards: [d.dealerHand.cards?.[0]] }) || (s.dealerHand && { cards: [s.dealerHand.cards?.[0]] });
        if (dealerUp?.cards?.length) state.dealerUpId = extractId(dealerUp.cards[0]);

        // normalize hands
        const nh = normalizeHands(d, s);
        if (nh) {
            state.phase = "acting"; // important: re-enter acting after insurance/peek
            const allIdsNow = nh.hands.map(h => (h.cards || h).map(extractId).join(","));
            const allCards = nh.hands.map(h => (h.cards || h).map(extractId));
            state._lastSplitHandsSig = allIdsNow;
            state._lastHandsCards = allCards;
            state.totalHands = nh.hands.length;

            if (nh.hands.length > 1) logSplitSection(nh, data);

            state.activeHandIndex = nh.active;
            const active = nh.hands[nh.active] || nh.hands[0] || { cards: [] };
            state.playerCards = active.cards || active;
            state.playerIds = (state.playerCards || []).map(extractId);

            if (state.awaitingPostSplit && state.playerIds.length >= 2) state.awaitingPostSplit = false;

            const sig = currentHandSig();
            const isSettleish = !!(d.result || s.result || d.splitHandWins || s.splitHandWins || data.complete);
            if (state.awaitingHandAdvance && sig !== state.lastActedHandSig) {
                if (state.inSplit && !isSettleish) l(`MOVING TO SPLIT HAND ${state.activeHandIndex}`);
                state.awaitingHandAdvance = false;
            }

            if (DEBUG_NET) {
                const { total, soft } = handTotalFromIds(state.playerIds);
                l(`start: ${state.playerIds.map(idToLabel).join(" ")} (${soft ? "soft" : "hard"} ${total}) vs ${idToLabel(state.dealerUpId)}`);
            }
        }

        if (d.result || s.result) state.phase = "settling";

        const complete = data?.complete || {};
        if (typeof complete.finalWin !== "undefined") {
            state.awaitingHandAdvance = false;

            const win = Number(complete.finalWin || 0);
            if (DEBUG_NET) l(`complete.finalWin=${win}`);

            const delta = win - (state.stakeOut || readBaseBet() || 0);
            if (delta > 0) state.wins++; else if (delta < 0) state.losses++; else state.pushes++;
            state.handCounter++;

            state.sessionPL += delta;
            state.wageredTotal += state.stakeOut || 0;
            updateKPIs();

            const rtp = rtpPercent();
            const profitPct = state.startingBalance && state.startingBalance > 0 ? 100 * ((state.startingBalance + state.sessionPL) / state.startingBalance) : 100;
            state.points.push({ h: state.handCounter, rtp, profitPct });
            drawChart();

            state.phase = "over";
            if (state.playthroughTarget && state.wageredTotal >= state.playthroughTarget) {
                RUNNING = false; setDot(false);
                if (DEBUG_NET) l(`Playthrough reached ($${fmtMoney(state.wageredTotal)} / $${fmtMoney(state.playthroughTarget)}). Stopping.`);
                return;
            }
            if (RUNNING) kickAutoBetIfReady();
        } else if (state.phase === "settling" && RUNNING) {
            state.awaitingHandAdvance = false;
            if (RUNNING) kickAutoBetIfReady();
        }
    }

    function rtpPercent() { if (!state.wageredTotal) return NaN; return 100 + (state.sessionPL / state.wageredTotal) * 100; }

    /* ----------------------------- decide + act ------------------------------ */
    function decideAndAct() {
        if (!RUNNING) return;
        if (maybeDeclineInsurance()) return;
        if (Date.now() < actingCooldownUntil) return;

        // Wait for server 'next' options, but fall back if UI is clearly ready
        if (state.next && state.next.size) {
            const choices = [...state.next];
            const hasAction = ["hit", "stand", "double", "split"].some(a => state.next.has(a));
            if (!hasAction) {
                const onlyInsurance = choices.every(x => x === "insurance" || x === "noInsurance");
                const { hit, stand, dbl, split } = getButtons();
                const uiActionable = [hit, stand, dbl, split].some(b => b && !b.disabled);
                if (onlyInsurance && (uiActionable || Date.now() > state.insGateUntil)) {
                    state.next = new Set(["hit", "stand", "double", "split"]);
                } else {
                    if (DEBUG_NET && Date.now() > state._waitLogNextAt) {
                        l(`waiting for options… next={${choices.join(",")}}`);
                        state._waitLogNextAt = Date.now() + 1000;
                    }
                    return;
                }
            }
        }

        // Split timing guard
        if (state.inSplit && state.playerIds.length < 2) {
            if (DEBUG_NET && Date.now() > state._waitLogNextAt) { l("split: waiting for second card on active hand…"); state._waitLogNextAt = Date.now() + 800; }
            return;
        }

        // Don’t act twice on same sub-hand while the table flips
        const sig = currentHandSig();
        if (state.awaitingHandAdvance && sig === state.lastActedHandSig) {
            if (DEBUG_NET && Date.now() > state._waitLogNextAt) { l("waiting for hand advance…"); state._waitLogNextAt = Date.now() + 400; }
            return;
        }

        const { hit, stand, split, dbl } = getButtons();
        if (!hit || !stand) return;
        if ([hit, stand, split, dbl].every((b) => !b || b.disabled)) return;

        if (handTotalFromIds(state.playerIds).total > 21) return;

        let move = decideMove(state.playerIds, state.dealerUpId);

        const has = (a) => !state.next.size || state.next.has(a);
        const hitOK = !!hit && !hit.disabled && has("hit");
        const dblOK = !!dbl && !dbl.disabled && has("double");
        const splitOK = !!split && !split.disabled && has("split");

        if (move === "DOUBLE" && !dblOK) move = "HIT";
        if (move === "SPLIT" && !splitOK) {
            // fallback: recalc ignoring pair rules
            const { total, soft } = handTotalFromIds(state.playerIds);
            const up = (state.dealerUpId % 13) + 1;
            if (soft) {
                if (total >= 20) move = "STAND";
                else if (total === 19) move = "STAND";
                else if (total === 18) move = [3, 4, 5, 6].includes(up) ? "DOUBLE" : ([2, 7, 8].includes(up) ? "STAND" : "HIT");
                else if (total === 17) move = [3, 4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
                else if (total === 16 || total === 15) move = [4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
                else if (total === 14 || total === 13) move = [5, 6].includes(up) ? "DOUBLE" : "HIT";
                else move = "HIT";
            } else {
                if (total >= 17) move = "STAND";
                else if (total >= 13 && total <= 16) move = [2, 3, 4, 5, 6].includes(up) ? "STAND" : "HIT";
                else if (total === 12) move = [4, 5, 6].includes(up) ? "STAND" : "HIT";
                else if (total === 11) move = "DOUBLE";
                else if (total === 10) move = [2, 3, 4, 5, 6, 7, 8, 9].includes(up) ? "DOUBLE" : "HIT";
                else if (total === 9) move = [3, 4, 5, 6].includes(up) ? "DOUBLE" : "HIT";
                else move = "HIT";
            }
        }

        // don't auto-stand if HIT isn't ready yet; wait instead
        if (move === "HIT" && !hitOK) {
            if (DEBUG_NET && Date.now() > state._waitLogNextAt) { l("HIT desired but not available yet — waiting…"); state._waitLogNextAt = Date.now() + 600; }
            return;
        }

        if (state.inSplit && DEBUG_NET) l(`ACTING ON SPLIT HAND ${state.activeHandIndex} > ${move}`);
        if (DEBUG_NET) l(`decide: ${state.playerIds.map(idToLabel).join(" ")} vs ${idToLabel(state.dealerUpId)} → ${move}`);
        if (ADVISOR_ONLY) return;

        if (move === "HIT") {
            actingCooldownUntil = Date.now() + ACTING_COOLDOWN_MS;
            clickIfEnabled(hit, "HIT");
            return;
        }
        if (move === "DOUBLE") {
            state.stakeOut += state.baseBet || readBaseBet() || 0;
            updateKPIs();
            actingCooldownUntil = Date.now() + ACTING_COOLDOWN_MS;

            state.awaitingHandAdvance = true;
            state.awaitingAdvanceSince = Date.now();
            state.lastActedHandSig = sig;
            state.lastActedIndex = state.activeHandIndex;
            state.lastHandsSig = (state.inSplit ? (state._lastSplitHandsSig || []).slice() : null);

            if (!clickIfEnabled(dbl, "DOUBLE")) clickIfEnabled(hit, "HIT");
            return;
        }
        if (move === "SPLIT") {
            state.inSplit = true;
            state.stakeOut += state.baseBet || readBaseBet() || 0;
            updateKPIs();
            actingCooldownUntil = Date.now() + ACTING_COOLDOWN_AFTER_SPLIT_MS;

            state.awaitingPostSplit = true;
            state.awaitingHandAdvance = true;
            state.awaitingAdvanceSince = Date.now();
            state.lastActedHandSig = sig;
            state.lastActedIndex = state.activeHandIndex;
            state.lastHandsSig = null;

            clickIfEnabled(split, "SPLIT");
            return;
        }
        // STAND
        actingCooldownUntil = Date.now() + ACTING_COOLDOWN_MS;

        state.awaitingHandAdvance = true;
        state.awaitingAdvanceSince = Date.now();
        state.lastActedHandSig = sig;
        state.lastActedIndex = state.activeHandIndex;
        state.lastHandsSig = state.inSplit ? (state._lastSplitHandsSig || []).slice() : null;

        clickIfEnabled(stand, "STAND");
    }

    /* ------------------------------ watchdog tick ---------------------------- */
    function advanceWatchdog() {
        if (!state.awaitingHandAdvance) return;
        if (!state.inSplit || (state.totalHands || 1) < 2) return;

        const now = Date.now();
        if (now - state.awaitingAdvanceSince <= HAND_ADVANCE_TIMEOUT_MS) return;

        const forced = Math.min(state.lastActedIndex + 1, (state.totalHands || 1) - 1);
        if (forced !== state.activeHandIndex) {
            state.activeHandIndex = forced;
            const cards = state._lastHandsCards[forced] || [];
            state.playerIds = cards.slice();
            l(`advance (watchdog) → hand ${state.activeHandIndex + 1}/${state.totalHands}`);
        }
        state.awaitingHandAdvance = false;
    }

    /* ---------------------------------- chart --------------------------------- */
    function drawChart() {
        const cv = $("#bjh-canvas"); if (!cv) return;
        const ctx = cv.getContext("2d");
        const W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);
        const LM = 52, TM = 10, RM = 10, BM = 24;
        ctx.strokeStyle = "#2a2f5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(LM, TM); ctx.lineTo(LM, H - BM); ctx.lineTo(W - RM, H - BM); ctx.stroke();
        const pts = state.points; if (!pts.length) return;
        const yKey = state.chartMode === "RTP" ? "rtp" : "profitPct";
        const ys = pts.map(p => p[yKey]).filter(v => isFinite(v));
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const padY = maxY - minY < .6 ? .3 : Math.max(.1 * (maxY - minY), .2);
        const y0 = minY - padY, y1 = maxY + padY;
        ctx.fillStyle = "#7c86a5"; ctx.font = "11px system-ui,sans-serif"; ctx.textAlign = "right";
        for (let i = 0; i <= 2; i++) { const vy = y0 + (i * (y1 - y0)) / 2; const y = mapY(vy, y0, y1, H, TM, BM); ctx.fillText(vy.toFixed(2), LM - 6, y + 3); ctx.strokeStyle = "#1b1f3b"; ctx.beginPath(); ctx.moveTo(LM, y); ctx.lineTo(W - RM, y); ctx.stroke(); }
        const maxH = pts[pts.length - 1].h; ctx.textAlign = "center";
        for (let i = 0; i <= 4; i++) { const vh = Math.round((i * maxH) / 4); const x = mapX(vh, 0, maxH, W, LM, RM); ctx.fillText(String(vh), x, H - 8); ctx.strokeStyle = "#1b1f3b"; ctx.beginPath(); ctx.moveTo(x, TM); ctx.lineTo(x, H - BM); ctx.stroke(); }
        ctx.strokeStyle = "#6cff6c"; ctx.lineWidth = 2; ctx.beginPath();
        pts.forEach((p, i) => { const x = mapX(p.h, 0, maxH, W, LM, RM); const y = mapY(p[yKey], y0, y1, H, TM, BM); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
        ctx.stroke();
        function mapX(v, v0, v1, W, LM, RM) { return LM + ((W - LM - RM) * (v - v0)) / Math.max(1, v1 - v0); }
        function mapY(v, v0, v1, H, TM, BM) { return TM + ((H - TM - BM) * (1 - (v - v0) / Math.max(1, v1 - v0))); }
    }
    function saveChartImage() { const cv = $("#bjh-canvas"); if (!cv) return; const a = document.createElement("a"); a.download = `bj-helper-${state.chartMode.toLowerCase()}-chart-${Date.now()}.png`; a.href = cv.toDataURL("image/png"); a.click(); }

    /* ----------------------------------- boot --------------------------------- */
    function init() {
        mountHUD();
        installFetchSniffer();
        installPromiseTap();
        setDot(false);
        resetRound();

        setInterval(() => {
            if (!RUNNING) return;
            if (maybeDeclineInsurance()) return;
            if (state.phase === "acting") decideAndAct();
            advanceWatchdog();
            if (state.phase === "over") kickAutoBetIfReady();
            if (state.phase === "betting") kickAutoBetIfReady();
        }, UI_TICK_MS);

        if (DEBUG_NET) l("Helper loaded.");
    }

    if (document.readyState === "complete" || document.readyState === "interactive") init();
    else window.addEventListener("DOMContentLoaded", init);
})();
