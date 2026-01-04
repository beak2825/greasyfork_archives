// ==UserScript==
// @name         OC Timing: Travel Blocker (Modular)
// @namespace    zonure.scripts
// @version      1.3.6
// @description  Modular travel blocker for Torn. Core engine with pluggable rule modules.
// @author       Zonure [3787510]
// @match        https://www.torn.com/page.php?sid=travel
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543904/OC%20Timing%3A%20Travel%20Blocker%20%28Modular%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543904/OC%20Timing%3A%20Travel%20Blocker%20%28Modular%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
     BOOT / GLOBAL FLAGS
     ========================= */

  const DEBUG = false;
  const FORCE_OCREADY_TEST = false;
  const BOOT_TS = performance.now();

  const log = (...a) => { if (DEBUG) console.log('[OC-TB]', ...a); };
  const warn = (...a) => { if (DEBUG) console.warn('[OC-TB]', ...a); };

  log('BOOT START');

  /* =========================
     VIEW MODE DETECTION
     ========================= */

  const isMobileView = window.matchMedia('(max-width: 600px)').matches;
  log('VIEW MODE', isMobileView ? 'MOBILE' : 'DESKTOP');

  /* =========================
     STYLE (UI ONLY)
     ========================= */

  const style = document.createElement('style');
  style.textContent = `
  #oc-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 12px;
    font-size: 14px;
    color: var(--appheader-title-color);
  }

  .oc-settings-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--appheader-title-color);
    font-size: 20px;
    font-weight: 700;
  }

  .oc-settings-panel {
    position: fixed;
    top: 80px;
    right: 24px;
    width: 320px;
    max-width: calc(100% - 48px);
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    border: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    padding: 16px 16px 18px;
    border-radius: 12px;
    z-index: 99999;
    color: var(--appheader-title-color);
}

@media (max-width: 600px) {
  .oc-settings-panel {
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translate(-50%, -50%);
    width: calc(100% - 32px);
    max-width: 360px;
  }
}

  .dark-mode .oc-settings-panel {
    background: rgba(20,20,20,0.85);
  }

  .oc-settings-panel h4 {
    margin: 0 0 14px 0;
    font-size: 17px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.2px;
    color: var(--appheader-title-color);
  }

  .oc-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
  }

  .oc-settings-label {
    font-size: 14px;
    font-weight: 500;
  }

  .oc-switch {
    position: relative;
    width: 40px;
    height: 20px;
    flex-shrink: 0;
  }

  .oc-switch input {
    display: none;
  }

  .oc-switch-slider {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.25);
    border-radius: 999px;
    transition: background 0.2s ease;
  }

  .oc-switch-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: currentColor;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  .oc-switch input:checked + .oc-switch-slider {
    background: rgba(0,150,0,0.6);
  }

  .oc-switch input:checked + .oc-switch-slider::before {
    transform: translateX(20px);
  }

  .script-disabled-button {
    background-color: #a00 !important;
    color: crimson !important;
    font-weight: bold;
    text-transform: uppercase;
    cursor: not-allowed !important;
    pointer-events: none;
  }
  `;
  document.head.appendChild(style);

  /* =========================
     CORE ENGINE
     ========================= */

  const Core = (() => {
    const shownPopups = new Set();
    const modules = [];
    const appliedChanges = new Map();

    const registerModule = module => {
      if (!module || !module.id || typeof module.evaluate !== 'function') return;
      const saved = localStorage.getItem('oc-tb-module-' + module.id);
      module.enabled = saved !== null ? saved === '1' : module.enabled !== false ? module.enabled : true;
      module.label = module.label || module.id;
      modules.push(module);
    };

    const getModuleRefs = () => modules;

    const setModuleEnabled = (id, enabled) => {
      const mod = modules.find(m => m.id === id);
      if (!mod) return;
      mod.enabled = !!enabled;
      localStorage.setItem('oc-tb-module-' + id, mod.enabled ? '1' : '0');
      if (!mod.enabled) clearAppliedForModule(id);
    };

    const getTravelRoot = () => document.getElementById('travel-root');

    const getDataModel = () => {
      const root = getTravelRoot();
      if (!root) return null;
      const raw = root.getAttribute('data-model');
      if (!raw) return null;
      try { return JSON.parse(raw); } catch { return null; }
    };

    const collectDecisions = ctx => {
      const decisions = [];
      for (const mod of modules) {
        if (!mod.enabled) continue;
        const res = mod.evaluate(ctx);
        if (!res) continue;
        res._moduleId = mod.id;
        decisions.push(res);
      }
      return decisions;
    };

    const showPopup = decision => {
      if (shownPopups.has(decision._moduleId)) return;
      shownPopups.add(decision._moduleId);

      const panel = document.createElement('div');
      panel.className = 'oc-settings-panel';
      panel.style.top = '50%';
      panel.style.left = '50%';
      panel.style.transform = 'translate(-50%, -50%)';
      panel.innerHTML = '<h4>' + decision.module + '</h4>' +
        '<div style="font-size:14px;line-height:1.4;padding:6px 0 14px;">' + decision.reason + '</div>' +
        '<button class="oc-settings-btn" style="width:100%;justify-content:center;">OK</button>';

      const btn = panel.querySelector('button');
      btn.addEventListener('click', () => panel.remove());

      document.body.appendChild(panel);
    };

    const recordApplied = (moduleId, el) => {
      const orig = {
        disabled: el.disabled,
        text: el.textContent,
        title: el.title,
        hadClass: el.classList.contains('script-disabled-button')
      };
      const arr = appliedChanges.get(moduleId) || [];
      if (!arr.find(x => x.el === el)) arr.push({ el, orig });
      appliedChanges.set(moduleId, arr);
    };

    const clearAppliedForModule = moduleId => {
      const arr = appliedChanges.get(moduleId);
      if (!arr) return;
      for (const { el, orig } of arr) {
        el.disabled = orig.disabled;
        el.textContent = orig.text;
        el.title = orig.title || '';
        if (!orig.hadClass) el.classList.remove('script-disabled-button');
      }
      appliedChanges.delete(moduleId);
    };

    const reEnableActionButton = label => {
      const buttons = Array.from(document.querySelectorAll('a.torn-btn.btn-dark-bg,button.torn-btn.btn-dark-bg'));
      const target = buttons.find(b => b.textContent.trim() === label);
      if (!target) return;

      // Revert all applied changes for this button
      for (const [moduleId, arr] of appliedChanges) {
        const entry = arr.find(x => x.el === target);
        if (entry) {
          const { orig } = entry;
          target.disabled = orig.disabled;
          target.textContent = orig.text;
          target.title = orig.title || '';
          if (!orig.hadClass) target.classList.remove('script-disabled-button');
          // Remove the entry
          appliedChanges.set(moduleId, arr.filter(x => x.el !== target));
        }
      }
    };

    const disableActionButton = (label, reasons) => {
      const blockers = reasons.filter(r => r.action === 'block' || r.action === 'both');
      if (!blockers.length) return;

      const buttons = Array.from(document.querySelectorAll('a.torn-btn.btn-dark-bg,button.torn-btn.btn-dark-bg'));
      const target = buttons.find(b => b.textContent.trim() === label);
      if (!target) return;

      target.disabled = true;
      target.textContent = 'DISABLED';
      target.title = blockers.map(r => '[' + r.module + '] ' + r.reason).join('\n');
      target.classList.add('script-disabled-button');

      for (const r of blockers) if (r._moduleId) recordApplied(r._moduleId, target);
    };

    return {
      registerModule,
      getModuleRefs,
      setModuleEnabled,
      getTravelRoot,
      getDataModel,
      collectDecisions,
      disableActionButton,
      reEnableActionButton,
      showPopup
    };
  })();

  /* =========================
     MODULE DEFINITIONS
     ========================= */

  Core.registerModule({
    id: 'oc-timing',
    label: 'OC Timing',
    evaluate(ctx) {
      if (!ctx.match || !ctx.method) return null;
      const ocReady = ctx.match[ctx.method] && ctx.match[ctx.method].ocReadyBeforeBack;
      const shouldBlock = FORCE_OCREADY_TEST ? ocReady !== undefined : ocReady === true;
      if (shouldBlock) return { module: 'OC Timing', action: 'block', reason: 'Return time overlaps with an upcoming OC.' };
      return null;
    }
  });

  Core.registerModule({
    id: 'drug-cooldown',
    label: 'Drug Cooldown',
    evaluate() {
      const sidebarRoot = document.getElementById('sidebarroot');
      if (!sidebarRoot) return { module: 'Drug Cooldown', action: 'popup', reason: 'Drug cooldown finished' };

      const iconClasses = ['icon49','icon50','icon51','icon52','icon53'];
      const found = iconClasses.filter(c => sidebarRoot.querySelector('li.' + c));

      if (!found.length) return { module: 'Drug Cooldown', action: 'popup', reason: 'Drug cooldown finished' };
      if (found.indexOf('icon49') !== -1) return { module: 'Drug Cooldown', action: 'popup', reason: 'Cooldown almost done' };
      return null;
    }
  });

  /* =========================
     SETTINGS PANEL
     ========================= */

  const createSettingsPanel = () => {
    let panel = document.getElementById('oc-settings-panel');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'oc-settings-panel';
    panel.className = 'oc-settings-panel';
    panel.innerHTML = '<h4>Travel Blocker</h4><div id="oc-settings-rows"></div>';
    document.body.appendChild(panel);

    setTimeout(() => {
      const outside = e => {
        if (!panel.contains(e.target) && document.getElementById('oc-settings-btn') && !document.getElementById('oc-settings-btn').contains(e.target)) {
          panel.remove();
          document.removeEventListener('click', outside);
        }
      };
      document.addEventListener('click', outside);
    }, 0);

    return panel;
  };

  const renderSettingsPanel = panel => {
    const rows = panel.querySelector('#oc-settings-rows');
    rows.innerHTML = '';

    for (const module of Core.getModuleRefs()) {
      const row = document.createElement('div');
      row.className = 'oc-settings-row';

      const label = document.createElement('div');
      label.className = 'oc-settings-label';
      label.textContent = module.label;

      const toggle = document.createElement('label');
      toggle.className = 'oc-switch';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = module.enabled;

      const slider = document.createElement('span');
      slider.className = 'oc-switch-slider';

      toggle.appendChild(input);
      toggle.appendChild(slider);

      input.addEventListener('change', e => Core.setModuleEnabled(module.id, e.target.checked));

      row.appendChild(label);
      row.appendChild(toggle);
      rows.appendChild(row);
    }
  };

  /* =========================
     INJECTION WITH SAFETY
     ========================= */

  const injectToggle = () => {
    try {
      const root = Core.getTravelRoot();
      if (!root) return;
      const top = Array.from(root.querySelectorAll('div')).find(d => Array.from(d.classList).some(c => c.startsWith('topSection')));
      if (!top) return;
      const links = Array.from(top.children).find(d => Array.from(d.classList).some(c => c.startsWith('linksContainer')));
      if (!links) return;

      let container = document.getElementById('oc-toggle-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'oc-toggle-container';

        const btn = document.createElement('button');
        btn.id = 'oc-settings-btn';
        btn.className = 'oc-settings-btn';
        btn.textContent = '⚙';

        btn.addEventListener('click', e => {
          e.stopPropagation();
          let panel = document.getElementById('oc-settings-panel');
          if (panel) { panel.remove(); return; }
          panel = createSettingsPanel();
          renderSettingsPanel(panel);
        });

        container.appendChild(btn);
      }

      if (container.parentNode !== top) top.insertBefore(container, links);
    } catch (e) {
      warn('injectToggle failed', e);
    }
  };

  /* =========================
     HELPER: GET SELECTED TRAVEL METHOD
     ========================= */

  const getSelectedTravelMethod = () => {
    // Try exact selector from old script first, then fallback
    let methodInput = document.querySelector('fieldset.travelTypeSelector___zK5N4 input[name="travelType"]:checked');
    if (!methodInput) methodInput = document.querySelector('fieldset[class^="travelTypeSelector"] input[name="travelType"]:checked');
    return methodInput ? methodInput.value : 'standard'; // Default to 'standard' if none selected
  };

  /* =========================
     EVENT BINDING (DELAYED)
     ========================= */

  const start = () => {
    const initialDecisions = Core.collectDecisions({});
    for (const d of initialDecisions) {
      if (d.action === 'popup' || d.action === 'both') Core.showPopup(d);
    }
    document.body.addEventListener('click', e => isMobileView ? handleMobileClick(e) : handleDesktopClick(e));  // Pass event to desktop handler
    
    // Add listeners for method changes to re-evaluate
    const methodInputs = document.querySelectorAll('input[name="travelType"]');
    methodInputs.forEach(input => input.addEventListener('change', () => {
      log('Method changed, re-evaluating...');
      // Simplified: No need for full re-run, as blocking is per-click
    }));
    
    new MutationObserver(() => setTimeout(injectToggle, 0)).observe(document.body, { childList: true, subtree: true });
    injectToggle();
    log('BOOT COMPLETE', (performance.now() - BOOT_TS).toFixed(1) + 'ms');
  };

  const handleDesktopClick = (e) => {  // Now takes event 'e'
    log('Handling desktop click...');
    const button = e.target.closest("button.torn-btn.btn-dark-bg, a.torn-btn.btn-dark-bg");
    if (!button) { log('No relevant button clicked'); return; }

    // Extract country from the grid (present during click)
    const flightGrid = button.closest('div[class^="flightDetailsGrid"]');
    const countrySpan = flightGrid?.querySelector('span[class^="country"]');
    const country = countrySpan?.textContent.trim();
    if (!country) { warn('No country detected'); return; }

    const data = Core.getDataModel();
    if (!data) { warn('No data-model'); return; }
    const match = data.destinations && data.destinations.find(d => d.country.toLowerCase() === country.toLowerCase());
    if (!match) { warn('No match for country:', country); return; }

    const method = getSelectedTravelMethod();
    log('Detected country:', country, 'method:', method);

    const decisions = Core.collectDecisions({ country, method, match });
    log('Decisions:', decisions);
    if (decisions.length) Core.disableActionButton('Continue', decisions);  // Disable globally, like old script
  };

  const handleMobileClick = e => {
    log('Handling mobile click...');
    const button = e.target.closest('button');
    if (!button) return;
    Core.reEnableActionButton('Continue'); // Re-enable before checking
    const spans = Array.from(button.querySelectorAll('span'));
    const country = spans.map(s => s.textContent.trim()).find(Boolean);
    if (!country) { warn('No country detected'); return; }
    const data = Core.getDataModel();
    if (!data) { warn('No data-model'); return; }
    const match = data.destinations && data.destinations.find(d => d.country.toLowerCase() === country.toLowerCase());
    if (!match) { warn('No match for country:', country); return; }
    const method = getSelectedTravelMethod();
    log('Detected country:', country, 'method:', method);
    const decisions = Core.collectDecisions({ country, method, match });
    log('Decisions:', decisions);
    if (decisions.length) Core.disableActionButton('Continue', decisions);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();