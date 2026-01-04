// ==UserScript==
// @name         WaniKani Vocab+3-Kanji Daily Assistant (Wide Banner)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  New wide banner on the dashboard. Guides you to clear vocab first with a 9/day goal (progress + ETA), then up to 3 kanji/day. Vivid UI, mode switching, WKOF settings respected.
// @author       vbomedeiros (+ ChatGPT)
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545100/WaniKani%20Vocab%2B3-Kanji%20Daily%20Assistant%20%28Wide%20Banner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545100/WaniKani%20Vocab%2B3-Kanji%20Daily%20Assistant%20%28Wide%20Banner%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const APP = {
    id: 'wk-3kpd-wide',
    version: '2.0.0',
    defaults: {
      quota: 3,                    // kanji/day
      vocab_daily_goal: 9,         // vocab/day goal
      apprentice_ceiling: 100,     // block new kanji if Apprentice (all items) > this
      vocab_backlog_threshold: 0,  // block new kanji if unlocked vocab lessons > this
      tz_override: '',             // optional IANA tz; empty = use browser
      order: 'wk_default',         // 'wk_default' | 'level_strict'
    },
  };

  if (!window.wkof) {
    alert('This script requires Wanikani Open Framework (WKOF).\nYou will be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
  }

  // --- Bootstrap ---
  window.wkof.include('ItemData, Apiv2, Settings');
  window.wkof.ready('ItemData, Apiv2, Settings').then(main).catch(console.error);

  let SETTINGS_CONFIG = null;

  async function main() {
    // Load or initialize settings
    await wkof.Settings.load(APP.id, APP.defaults);
    const settings = wkof.settings[APP.id];

    // Prepare settings dialog config
    SETTINGS_CONFIG = {
      script_id: APP.id,
      title: 'Vocab + 3 Kanji/Day Assistant',
      on_save: () => { wkof.Settings.save(APP.id); location.reload(); },
      content: {
        general: { type: 'group', label: 'General', content: {
          vocab_daily_goal: { type: 'number', label: 'Daily vocabulary goal', default: APP.defaults.vocab_daily_goal, min: 3, step: 1 },
          quota: { type: 'number', label: 'Daily kanji quota', default: APP.defaults.quota, min: 1, step: 1 },
          apprentice_ceiling: { type: 'number', label: 'Apprentice ceiling (all items)', default: APP.defaults.apprentice_ceiling, min: 20, step: 5 },
          vocab_backlog_threshold: { type: 'number', label: 'Max unlocked vocab lessons allowed before kanji', default: APP.defaults.vocab_backlog_threshold, min: 0, step: 1 },
          order: { type: 'list', label: 'Kanji selection order', default: APP.defaults.order, content: {
            wk_default: 'WaniKani default',
            level_strict: 'Current-level first',
          }},
          tz_override: { type: 'text', label: 'Timezone override (IANA, optional)', default: APP.defaults.tz_override, placeholder: 'e.g., America/Los_Angeles' },
        }},
      },
    };

    const { items } = await load_data();
    const state = compute_state(items, settings);
    render_banner(state, settings);
  }

  // --- Data Load ---
  async function load_data() {
    const user = await wkof.Apiv2.fetch_endpoint('user');
    const level = user?.data?.level ?? 60;
    const items = await wkof.ItemData.get_items({
      wk_items: {
        options: { assignments: true },
        filters: { item_type: 'kan,voc,rad', level: '1..' + level },
      },
    });
    return { user, items };
  }

  // --- State ---
  function compute_state(items, settings) {
    const tz = (settings.tz_override || '').trim() || undefined; // undefined -> browser TZ
    const today = local_day_str(new Date(), tz);

    const voc = items.filter(i => i.object === 'vocabulary' && i.assignments && !i.hidden);
    const kan = items.filter(i => i.object === 'kanji' && i.assignments && !i.hidden);

    const apprentice_total = items.filter(i => is_apprentice(i.assignments?.srs_stage)).length;

    const vocab_unstarted = voc.filter(i => i.assignments?.srs_stage === 0); // lessons not started
    const vocab_started_today = voc.filter(i => started_on_day(i.assignments?.started_at, today, tz));

    const kanji_lessons_available = kan.filter(i => i.assignments?.srs_stage === 0);
    const kanji_started_today = kan.filter(i => started_on_day(i.assignments?.started_at, today, tz));

    const quota = Number(settings.quota || APP.defaults.quota);
    const quota_used = kanji_started_today.length;
    const quota_remaining = Math.max(0, quota - quota_used);

    const vocab_goal = Number(settings.vocab_daily_goal || APP.defaults.vocab_daily_goal);
    const vocab_done_today = vocab_started_today.length;
    const vocab_remaining_today = Math.max(0, vocab_goal - vocab_done_today);

    // Blocking logic for kanji
    const reasons = [];
    if (vocab_unstarted.length > Number(settings.vocab_backlog_threshold)) reasons.push('vocab backlog');
    if (apprentice_total > Number(settings.apprentice_ceiling)) reasons.push('apprentice ceiling');

    const blocked_for_kanji = reasons.length > 0;

    // Suggestions for kanji
    let suggestions = [];
    if (!blocked_for_kanji && quota_remaining > 0 && kanji_lessons_available.length > 0) {
      suggestions = pick_kanji(kanji_lessons_available, quota_remaining, settings.order);
    }

    return {
      // totals
      apprentice_total,
      vocab_backlog_count: vocab_unstarted.length,
      kanji_lessons_available: kanji_lessons_available.length,
      // vocab mode
      vocab_goal,
      vocab_done_today,
      vocab_remaining_today,
      vocab_eta_days: vocab_unstarted.length > 0 ? Math.ceil(vocab_unstarted.length / Math.max(1, vocab_goal)) : 0,
      // kanji mode
      kanji_started_today: quota_used,
      quota,
      quota_remaining,
      blocked_for_kanji,
      reasons,
      suggestions,
      // mode flag
      mode: (vocab_unstarted.length > 0) ? 'vocab' : 'kanji',
    };
  }

  function is_apprentice(stage) { return stage >= 1 && stage <= 4; }

  function started_on_day(started_at, day_str, tz) {
    if (!started_at) return false;
    try {
      const d = new Date(started_at);
      return local_day_str(d, tz) === day_str;
    } catch { return false; }
  }

  function local_day_str(date, tz) {
    // Returns YYYY-MM-DD in provided tz (or browser tz)
    const opts = { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' };
    const parts = new Intl.DateTimeFormat(undefined, opts).formatToParts(date);
    const y = parts.find(p => p.type === 'year').value;
    const m = parts.find(p => p.type === 'month').value;
    const d = parts.find(p => p.type === 'day').value;
    return `${y}-${m}-${d}`;
  }

  function pick_kanji(arr, n, order) {
    let list = [...arr];
    if (order === 'level_strict') {
      list.sort((a, b) => (a.data.level - b.data.level) || (a.id - b.id));
    } else {
      // Approximate WK default: subject_id ascending
      list.sort((a, b) => a.id - b.id);
    }
    return list.slice(0, n).map(i => ({ id: i.id, characters: i.data.characters, level: i.data.level }));
  }

  // --- UI ---
  function on_turbo_mount(fn){
    // Run once now (when DOM is ready) and on every Turbo navigation/render
    if (document.readyState !== 'loading') setTimeout(fn, 0); else document.addEventListener('DOMContentLoaded', fn, { once:true });
    addEventListener('turbo:load', () => setTimeout(fn, 0));
    addEventListener('turbo:render', () => setTimeout(fn, 0));
  }

  function render_banner(state, settings) {
    // Mount as a DIV outside the dashboard, so it pushes content down.
    on_turbo_mount(() => mount_banner_outside(state, settings));
  }

  function mount_banner(state, settings){
    const content = document.querySelector('.dashboard__content');
    if (!content) return;

    // if already mounted, update contents in place
    let host_panel = document.querySelector('section.wk-panel.wk-panel--vb-assistant');

    // Create a *real WK panel* so it participates in the layout and pushes content down.
    if (!host_panel){
      host_panel = document.createElement('section');
      host_panel.className = 'wk-panel wk-panel--vb-assistant';
      host_panel.innerHTML = '<div class="wk-panel__content"><div id="vb-assistant-mount"></div></div>';
      // Place as the very first panel so it occupies the full row
      content.insertAdjacentElement('afterbegin', host_panel);
    }

    // Inject styles once
    if (!document.getElementById('wk-3kpd-wide-styles')) {
      const style = document.createElement('style');
      style.id = 'wk-3kpd-wide-styles';
      style.textContent = `
        /* Ensure our wk-panel spans a full row in the dashboard flex grid */
        .wk-panel--vb-assistant { flex: 1 0 100%; order: -1000; }
        .wk-3kpd-wide { position: relative; margin: 0; padding: 14px 16px; border-radius: 12px; color: #fff; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,.25); font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
        .wk-3kpd-wide__grid { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; }
        .wk-3kpd-wide__title { font-weight: 800; font-size: 18px; letter-spacing: .2px; display:flex; align-items:center; gap:.6rem }
        .wk-3kpd-wide__subtitle { opacity: .95; font-size: 13px; margin-top: 2px }
        .wk-3kpd-pill { display:inline-flex; align-items:center; gap:.4rem; padding:4px 10px; border-radius: 999px; font-size:12px; font-weight:700; backdrop-filter: blur(2px); }
        .wk-3kpd-pill--ok { background: rgba(16,185,129,.2); border: 1px solid rgba(16,185,129,.7); }
        .wk-3kpd-pill--warn { background: rgba(244,63,94,.2); border: 1px solid rgba(244,63,94,.7); }
        .wk-3kpd-actions { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end }
        .wk-3kpd-btn { text-decoration:none; padding:8px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.28); color:#fff; font-weight:700; }
        .wk-3kpd-btn--primary { background: rgba(2,6,23,.35); border-color: rgba(16,185,129,.85); }
        .wk-3kpd-btn--ghost { background: rgba(2,6,23,.25); }
        .wk-3kpd-metrics { display:flex; gap:14px; flex-wrap:wrap; margin-top:8px; font-size:13px }
        .wk-3kpd-metric b { font-size:14px }
        .wk-3kpd-progress { height: 12px; border-radius: 999px; background: rgba(255,255,255,.2); overflow:hidden }
        .wk-3kpd-progress > span { display:block; height:100%; width:0%; transition: width .5s ease }
        .wk-3kpd-confetti { position:absolute; inset:0; pointer-events:none; background: radial-gradient(1200px 300px at 10% -20%, rgba(255,255,255,.28), transparent 60%), radial-gradient(1200px 300px at 90% 120%, rgba(255,255,255,.18), transparent 60%); }
        .wk-3kpd-wide--vocab { background: linear-gradient(90deg, #f43f5e 0%, #8b5cf6 100%); }
        .wk-3kpd-wide--kanji { background: linear-gradient(90deg, #10b981 0%, #2563eb 100%); }
        .wk-3kpd-eta { font-size:12px; opacity:.9 }
      `;
      document.head.appendChild(style);
    }

    // Build inner banner
    const banner = document.createElement('div');
    banner.className = `wk-3kpd-wide ${state.mode === 'vocab' ? 'wk-3kpd-wide--vocab' : 'wk-3kpd-wide--kanji'}`;

    const pill = (label, ok=true) => `<span class="wk-3kpd-pill ${ok?'wk-3kpd-pill--ok':'wk-3kpd-pill--warn'}">${label}</span>`;
    const progress = (value, max) => {
      const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1,max)) * 100)));
      return `<div class="wk-3kpd-progress" aria-label="progress ${value}/${max}"><span style="width:${pct}%"></span></div>`;
    };

    const apprenticeOK = state.apprentice_total <= SETTINGS().apprentice_ceiling;
    const apprenticeLine = `<span class="wk-3kpd-metric">Apprentice: <b>${state.apprentice_total}</b> ${pill(apprenticeOK?'OK':'High', apprenticeOK)}</span>`;

    let leftHTML = '', rightHTML = '';
    if (state.mode === 'vocab') {
      leftHTML = `
        <div>
          <div class="wk-3kpd-wide__title">📚 Vocabulary Mode ${pill('Clear vocab first')}</div>
          <div class="wk-3kpd-wide__subtitle">Goal: <b>${state.vocab_goal}</b> vocab today · Backlog: <b>${state.vocab_backlog_count}</b> ${state.vocab_backlog_count>0?`<span class=\"wk-3kpd-eta\">(~${state.vocab_eta_days} day${state.vocab_eta_days===1?'':'s'} @ ${state.vocab_goal}/day)</span>`:''}</div>
          <div style="margin-top:8px">${progress(state.vocab_done_today, state.vocab_goal)}</div>
          <div class="wk-3kpd-metrics" style="margin-top:6px">
            <span class="wk-3kpd-metric">Today: <b>${state.vocab_done_today}/${state.vocab_goal}</b> ${state.vocab_remaining_today>0?pill(`${state.vocab_remaining_today} to go`):pill('GOAL! 🎉')}</span>
            ${apprenticeLine}
          </div>
        </div>`;
      rightHTML = `
        <div class="wk-3kpd-actions">
          <a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="vocab">Study vocab now (${state.vocab_backlog_count})</a>
          <a href="#" class="wk-3kpd-btn wk-3kpd-btn--ghost" data-action="settings">Settings</a>
        </div>`;
    } else {
      const canStudy = !state.blocked_for_kanji && state.quota_remaining > 0 && state.kanji_lessons_available > 0;
      const preview = state.suggestions.map(s => s.characters || '—').join(' ');
      leftHTML = `
        <div>
          <div class="wk-3kpd-wide__title">🈚 Kanji Mode ${pill(state.blocked_for_kanji?'Blocked':'Ready', !state.blocked_for_kanji)}</div>
          <div class="wk-3kpd-wide__subtitle">Quota today: <b>${state.kanji_started_today}/${state.quota}</b> · Lessons available: <b>${state.kanji_lessons_available}</b>${preview?` · Suggestions: <b>${preview}</b>`:''}</div>
          <div style="margin-top:8px">${progress(state.kanji_started_today, state.quota)}</div>
          <div class="wk-3kpd-metrics" style="margin-top:6px">
            ${apprenticeLine}
            <span class="wk-3kpd-metric">Vocab backlog: <b>${state.vocab_backlog_count}</b> ${pill(state.vocab_backlog_count<=SETTINGS().vocab_backlog_threshold?'OK':'Clear first', state.vocab_backlog_count<=SETTINGS().vocab_backlog_threshold)}</span>
          </div>
        </div>`;
      const actionsBlocked = state.blocked_for_kanji ? `
          <div style="font-size:13px;margin-bottom:6px">Resolve: ${state.reasons.map(r=>`<b>${r}</b>`).join(', ')}</div>
          <a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="vocab">Do vocab (${state.vocab_backlog_count})</a>` : '';
      rightHTML = `
        <div class="wk-3kpd-actions">
          ${actionsBlocked || (canStudy ? `<a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="start-kanji">Start ${state.quota_remaining} kanji</a>` : `<span class="wk-3kpd-btn wk-3kpd-btn--ghost" aria-disabled="true">${state.quota_remaining===0?'Done for today! ✅':'No kanji available'}</span>`)}
          <a href="#" class="wk-3kpd-btn wk-3kpd-btn--ghost" data-action="settings">Settings</a>
        </div>`;
    }

    banner.innerHTML = `
      <div class="wk-3kpd-confetti"></div>
      <div class="wk-3kpd-wide__grid">
        ${leftHTML}
        ${rightHTML}
      </div>`;

    let mount = document.getElementById('vb-assistant-mount');
    if (!mount) {
      const wrap = host_panel.querySelector('.wk-panel__content') || host_panel;
      mount = document.createElement('div');
      mount.id = 'vb-assistant-mount';
      wrap.appendChild(mount);
    }
    mount.replaceChildren(banner);

    mount.addEventListener('click', (e) => {
      const a = e.target.closest('a.wk-3kpd-btn');
      if (!a) return;
      e.preventDefault();
      const action = a.getAttribute('data-action');
      if (action === 'settings') new wkof.Settings(SETTINGS_CONFIG).open();
      if (action === 'vocab') window.location.href = '/lesson';
      if (action === 'start-kanji') window.location.href = '/lesson';
    });

    if ((state.mode === 'vocab' && state.vocab_remaining_today === 0) || (state.mode === 'kanji' && state.quota_remaining === 0)) {
      flare(banner);
    }
  }
  function mount_banner_outside(state, settings){
    // Find the main dashboard container and insert our banner *before* it.
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard || !dashboard.parentElement) return;

    // Inject styles once (outside container + banner)
    if (!document.getElementById('wk-3kpd-wide-styles')) {
      const style = document.createElement('style');
      style.id = 'wk-3kpd-wide-styles';
      style.textContent = `
        .wk-3kpd-outside { width: 100%; margin: 12px 0 16px; display:block; }
        .wk-3kpd-wide { position: relative; margin: 0; padding: 14px 16px; border-radius: 12px;
          color:#fff; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,.25);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
        .wk-3kpd-wide__grid { display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; }
        .wk-3kpd-wide__title { font-weight:800; font-size:18px; letter-spacing:.2px; display:flex; align-items:center; gap:.6rem }
        .wk-3kpd-wide__subtitle { opacity:.95; font-size:13px; margin-top:2px }
        .wk-3kpd-pill { display:inline-flex; align-items:center; gap:.4rem; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:700; backdrop-filter:blur(2px) }
        .wk-3kpd-pill--ok { background:rgba(16,185,129,.2); border:1px solid rgba(16,185,129,.7) }
        .wk-3kpd-pill--warn { background:rgba(244,63,94,.2); border:1px solid rgba(244,63,94,.7) }
        .wk-3kpd-actions { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end }
        .wk-3kpd-btn { text-decoration:none; padding:8px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.28); color:#fff; font-weight:700 }
        .wk-3kpd-btn--primary { background:rgba(2,6,23,.35); border-color:rgba(16,185,129,.85) }
        .wk-3kpd-btn--ghost { background:rgba(2,6,23,.25) }
        .wk-3kpd-metrics { display:flex; gap:14px; flex-wrap:wrap; margin-top:8px; font-size:13px }
        .wk-3kpd-metric b { font-size:14px }
        .wk-3kpd-progress { height:12px; border-radius:999px; background:rgba(255,255,255,.2); overflow:hidden }
        .wk-3kpd-progress > span { display:block; height:100%; width:0%; transition:width .5s ease }
        .wk-3kpd-confetti { position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(1200px 300px at 10% -20%, rgba(255,255,255,.28), transparent 60%),
                      radial-gradient(1200px 300px at 90% 120%, rgba(255,255,255,.18), transparent 60%); }
        .wk-3kpd-wide--vocab { background: linear-gradient(90deg, #f43f5e 0%, #8b5cf6 100%) }
        .wk-3kpd-wide--kanji { background: linear-gradient(90deg, #10b981 0%, #2563eb 100%) }
        .wk-3kpd-eta { font-size:12px; opacity:.9 }
      `;
      document.head.appendChild(style);
    }

    // Create (or reuse) outside container and insert above the dashboard
    let outside = document.getElementById('vb-assistant-outside');
    if (!outside) {
      outside = document.createElement('div');
      outside.id = 'vb-assistant-outside';
      outside.className = 'wk-3kpd-outside';
      dashboard.parentElement.insertBefore(outside, dashboard);
    }

    // Build banner (reuse existing inner HTML logic)
    const banner = document.createElement('div');
    banner.className = `wk-3kpd-wide ${state.mode === 'vocab' ? 'wk-3kpd-wide--vocab' : 'wk-3kpd-wide--kanji'}`;

    const pill = (label, ok=true) => `<span class="wk-3kpd-pill ${ok?'wk-3kpd-pill--ok':'wk-3kpd-pill--warn'}">${label}</span>`;
    const progress = (value, max) => {
      const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(1,max)) * 100)));
      return `<div class="wk-3kpd-progress" aria-label="progress ${value}/${max}"><span style="width:${pct}%"></span></div>`;
    };

    const apprenticeOK = state.apprentice_total <= SETTINGS().apprentice_ceiling;
    const apprenticeLine = `<span class="wk-3kpd-metric">Apprentice: <b>${state.apprentice_total}</b> ${pill(apprenticeOK?'OK':'High', apprenticeOK)}</span>`;

    let leftHTML = '', rightHTML = '';
    if (state.mode === 'vocab') {
      leftHTML = `
        <div>
          <div class="wk-3kpd-wide__title">📚 Vocabulary Mode ${pill('Clear vocab first')}</div>
          <div class="wk-3kpd-wide__subtitle">Goal: <b>${state.vocab_goal}</b> vocab today · Backlog: <b>${state.vocab_backlog_count}</b> ${state.vocab_backlog_count>0?`<span class=\"wk-3kpd-eta\">(~${state.vocab_eta_days} day${state.vocab_eta_days===1?'':'s'} @ ${state.vocab_goal}/day)</span>`:''}</div>
          <div style="margin-top:8px">${progress(state.vocab_done_today, state.vocab_goal)}</div>
          <div class="wk-3kpd-metrics" style="margin-top:6px">
            <span class="wk-3kpd-metric">Today: <b>${state.vocab_done_today}/${state.vocab_goal}</b> ${state.vocab_remaining_today>0?pill(`${state.vocab_remaining_today} to go`):pill('GOAL! 🎉')}</span>
            ${apprenticeLine}
          </div>
        </div>`;
      rightHTML = `
        <div class="wk-3kpd-actions">
          <a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="vocab">Study vocab now (${state.vocab_backlog_count})</a>
          <a href="#" class="wk-3kpd-btn wk-3kpd-btn--ghost" data-action="settings">Settings</a>
        </div>`;
    } else {
      const canStudy = !state.blocked_for_kanji && state.quota_remaining > 0 && state.kanji_lessons_available > 0;
      const preview = state.suggestions.map(s => s.characters || '—').join(' ');
      leftHTML = `
        <div>
          <div class="wk-3kpd-wide__title">🈚 Kanji Mode ${pill(state.blocked_for_kanji?'Blocked':'Ready', !state.blocked_for_kanji)}</div>
          <div class="wk-3kpd-wide__subtitle">Quota today: <b>${state.kanji_started_today}/${state.quota}</b> · Lessons available: <b>${state.kanji_lessons_available}</b>${preview?` · Suggestions: <b>${preview}</b>`:''}</div>
          <div style="margin-top:8px">${progress(state.kanji_started_today, state.quota)}</div>
          <div class="wk-3kpd-metrics" style="margin-top:6px">
            ${apprenticeLine}
            <span class="wk-3kpd-metric">Vocab backlog: <b>${state.vocab_backlog_count}</b> ${pill(state.vocab_backlog_count<=SETTINGS().vocab_backlog_threshold?'OK':'Clear first', state.vocab_backlog_count<=SETTINGS().vocab_backlog_threshold)}</span>
          </div>
        </div>`;
      const actionsBlocked = state.blocked_for_kanji ? `
          <div style="font-size:13px;margin-bottom:6px">Resolve: ${state.reasons.map(r=>`<b>${r}</b>`).join(', ')}</div>
          <a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="vocab">Do vocab (${state.vocab_backlog_count})</a>` : '';
      rightHTML = `
        <div class="wk-3kpd-actions">
          ${actionsBlocked || (canStudy ? `<a href="/lesson" class="wk-3kpd-btn wk-3kpd-btn--primary" data-action="start-kanji">Start ${state.quota_remaining} kanji</a>` : `<span class="wk-3kpd-btn wk-3kpd-btn--ghost" aria-disabled="true">${state.quota_remaining===0?'Done for today! ✅':'No kanji available'}</span>`)}
          <a href="#" class="wk-3kpd-btn wk-3kpd-btn--ghost" data-action="settings">Settings</a>
        </div>`;
    }

    banner.innerHTML = `
      <div class="wk-3kpd-confetti"></div>
      <div class="wk-3kpd-wide__grid">
        ${leftHTML}
        ${rightHTML}
      </div>`;

    // Mount and wire actions
    outside.replaceChildren(banner);
    outside.addEventListener('click', (e) => {
      const a = e.target.closest('a.wk-3kpd-btn');
      if (!a) return;
      e.preventDefault();
      const action = a.getAttribute('data-action');
      if (action === 'settings') new wkof.Settings(SETTINGS_CONFIG).open();
      if (action === 'vocab') window.location.href = '/lesson';
      if (action === 'start-kanji') window.location.href = '/lesson';
    });

    if ((state.mode === 'vocab' && state.vocab_remaining_today === 0) || (state.mode === 'kanji' && state.quota_remaining === 0)) {
      flare(banner);
    }
  }

  function flare(el){
    el.animate([
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.02)', filter: 'brightness(1.15)' },
      { transform: 'scale(1)', filter: 'brightness(1)' },
    ], { duration: 900, easing: 'ease-out' });
  }

  function SETTINGS(){ return wkof.settings[APP.id] || APP.defaults; }
})();
