// ==UserScript==
// @name         GeoFS Mod Menu -cool-
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Mod Menu for GeoFS flight model variables using console-modifiable input fields
// @author       Jasp
// @match        https://www.geo-fs.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544402/GeoFS%20Mod%20Menu%20-cool-.user.js
// @updateURL https://update.greasyfork.org/scripts/544402/GeoFS%20Mod%20Menu%20-cool-.meta.js
// ==/UserScript==


(function () {
  'use strict';

  /* ===========================
     Config & variable lists
     =========================== */

  const allVars = [
    "maxRPM","minRPM","starterRPM","idleThrottle","fuelFlow","enginePower","brakeRPM",
    "wingArea","dragFactor","liftFactor","CD0","CLmax","elevatorFactor","rudderFactor","aileronFactor",
    "mass","emptyWeight","maxWeight","inertia","pitchMoment","yawMoment","rollMoment",
    "gearDrag","gearCompression","gearLength"
  ];

  const explanations = {
    maxRPM: "Maximum revolutions per minute of the engine.",
    minRPM: "Minimum engine RPM (idle lower bound).",
    starterRPM: "RPM used when starting the engine.",
    idleThrottle: "Throttle percentage at idle.",
    fuelFlow: "Fuel flow rate scaling.",
    enginePower: "Base engine power factor.",
    brakeRPM: "RPM threshold for brakes.",
    wingArea: "Wing area used for lift calculations.",
    dragFactor: "General drag multiplier.",
    liftFactor: "Lift multiplier applied to wing calculations.",
    CD0: "Parasitic drag coefficient.",
    CLmax: "Maximum lift coefficient before stall.",
    elevatorFactor: "Elevator control effectiveness.",
    rudderFactor: "Rudder control effectiveness.",
    aileronFactor: "Aileron control effectiveness.",
    mass: "Aircraft mass.",
    emptyWeight: "Empty weight of aircraft.",
    maxWeight: "Maximum allowable weight.",
    inertia: "Rotational inertia parameter.",
    pitchMoment: "Pitch moment (stability).",
    yawMoment: "Yaw moment (stability).",
    rollMoment: "Roll moment (stability).",
    gearDrag: "Drag contribution from gear.",
    gearCompression: "Suspension stiffness / compression.",
    gearLength: "Landing gear strut length."
  };

  /* ===========================
     Theme palettes & helpers
     =========================== */

  const PALETTE_DARK = {
    bg: "#0f1720", panel: "#111827", accent: "#2b9af3",
    text: "#e6eef8", muted: "#9aa8b6"
  };
  const PALETTE_LIGHT = {
    bg: "#f6fbff", panel: "#e9f2fb", accent: "#1e6fb8",
    text: "#07263a", muted: "#3f6b83"
  };

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    if (h.length === 3) return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
    const bigint = parseInt(h,16); return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
  }
  function rgbToHex(rgb){ return "#" + rgb.map(v=>{ const s=Math.round(v).toString(16); return s.length===1?"0"+s:s; }).join(""); }
  function lerpColor(a,b,t){ const A=hexToRgb(a), B=hexToRgb(b); return rgbToHex([A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t]); }

  /* ===========================
     Backdrop tint helpers
     =========================== */

  // dark tint (near-black) and light tint (near-white)
  const DARK_TINT_RGB = [4,8,12];   // near-black tint base
  const LIGHT_TINT_RGB = [255,255,255]; // light tint base

  function lerpRgb(a, b, t) {
    return [ Math.round(a[0] + (b[0]-a[0]) * t), Math.round(a[1] + (b[1]-a[1]) * t), Math.round(a[2] + (b[2]-a[2]) * t) ];
  }

  /* ===========================
     Injection core (per-document)
     =========================== */

  const injectedDocs = new WeakSet();

  function injectIntoWindow(targetWin) {
    if (!targetWin || !targetWin.document) return;
    const doc = targetWin.document;
    if (injectedDocs.has(doc)) return;
    injectedDocs.add(doc);

    // CSS (menu opaque; backdrop separate)
    const css = `
      :root{ --mod-panel:${PALETTE_DARK.panel}; --mod-text:${PALETTE_DARK.text}; --mod-accent:${PALETTE_DARK.accent}; --mod-muted:${PALETTE_DARK.muted}; }
      #geofsModMenu{ position:fixed; top:80px; right:18px; width:360px; max-height:86vh; overflow-y:auto; color:var(--mod-text); border-radius:14px; padding:12px; box-shadow:0 10px 40px rgba(2,6,23,0.6); z-index:2147484001; border:1px solid rgba(0,0,0,0.12); display:none; font-family:"Segoe UI",Roboto,Arial; font-size:13px; background:var(--mod-panel); }
      #geofsModMenu .panel{ background:var(--mod-panel); border-radius:10px; padding:10px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.02); }
      header{ display:flex; align-items:center; gap:10px; margin-bottom:8px; }
      #geofsModMenu h1{ font-size:15px; margin:0; color:var(--mod-text); font-weight:600; }
      #themeControl{ margin-left:auto; display:flex; align-items:center; gap:8px; }
      .theme-label{ font-size:12px; color:var(--mod-muted); width:36px; text-align:center; }
      input[type="range"].theme-range{ width:140px; appearance:none; height:8px; border-radius:999px; background:linear-gradient(90deg,var(--mod-accent),#00b4ff 50%,#9ad6ff); outline:none; box-shadow:inset 0 -1px 0 rgba(0,0,0,0.2); }
      input[type="range"].theme-range::-webkit-slider-thumb{ -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.35); border:2px solid rgba(0,0,0,0.2); cursor:pointer; }
      #actionRow{ display:flex; gap:8px; margin-bottom:10px; }
      .action-button{ background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.03)); border:1px solid rgba(255,255,255,0.02); color:var(--mod-text); padding:6px 10px; border-radius:8px; cursor:pointer; font-weight:600; font-size:13px; }
      .action-button.primary{ background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.06)); border:1px solid rgba(255,255,255,0.04); }
      h2.section-title{ margin:12px 0 6px; font-size:13px; color:var(--mod-accent); text-transform:uppercase; letter-spacing:0.6px; }
      .var-row{ display:flex; flex-direction:column; gap:6px; margin-bottom:8px; }
      .label-row{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
      label.name{ font-weight:600; color:var(--mod-text); font-size:13px; }
      .explain{ font-size:12px; color:var(--mod-muted); margin-top:-4px; }
      input[type="number"].num-input{ width:160px; background:transparent; border:1px solid rgba(255,255,255,0.04); color:var(--mod-text); padding:6px 8px; border-radius:8px; text-align:right; }
      #menuToggleBtn{ position:fixed; top:18px; right:18px; width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--mod-panel); color:var(--mod-text); border:1px solid rgba(255,255,255,0.03); box-shadow:0 6px 20px rgba(2,6,23,0.5); z-index:2147484002; cursor:pointer; }
      #menuBackdrop{ position:fixed; inset:0; z-index:2147484000; display:none; pointer-events:auto; transition: background-color 220ms ease, backdrop-filter 220ms ease, opacity 220ms ease; }
      #helpOverlay{ position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(2,6,23,0.9); color:#eaf6ff; padding:28px; z-index:2147484003; display:none; overflow-y:auto; font-size:14px; }
      #closeHelp{ position:absolute; top:18px; right:24px; font-size:22px; cursor:pointer; }
      .collapse-toggle{ cursor:pointer; font-size:13px; color:var(--mod-accent); background:none; border:none; padding:6px 8px; border-radius:6px; }
      .visual-row{ display:flex; align-items:center; gap:10px; margin-bottom:8px; }
      .visual-label{ width:140px; color:var(--mod-text); font-weight:600; font-size:13px; }
      @media (max-width:520px){ #geofsModMenu{ width:92%; left:4%; right:4%; top:80px; } }
    `;
    const styleEl = doc.createElement('style');
    styleEl.textContent = css;
    doc.head.appendChild(styleEl);

    // Create DOM elements
    const menu = doc.createElement('div'); menu.id = 'geofsModMenu'; menu.className = 'panel';
    const toggleBtn = doc.createElement('div'); toggleBtn.id = 'menuToggleBtn'; toggleBtn.title = 'Toggle GeoFS Mod Menu'; toggleBtn.textContent = '⚙️';
    const backdrop = doc.createElement('div'); backdrop.id = 'menuBackdrop';
    const helpOverlay = doc.createElement('div'); helpOverlay.id = 'helpOverlay';
    helpOverlay.innerHTML = `<div id="closeHelp">✕</div><h1>GeoFS Mod Menu — Help</h1><div id="helpContent"></div>`;

    // Header & theme control
    const header = doc.createElement('header');
    header.innerHTML = `<h1>GeoFS Mod Menu</h1>`;
    const themeControl = doc.createElement('div'); themeControl.id = 'themeControl';
    themeControl.innerHTML = `<div class="theme-label">Dark</div><input id="themeSlider" class="theme-range" type="range" min="0" max="100" value="0" /><div class="theme-label">Light</div>`;
    header.appendChild(themeControl);

    // Action row (no presets)
    const actionRow = doc.createElement('div'); actionRow.id = 'actionRow';
    const resetBtn = doc.createElement('button'); resetBtn.className = 'action-button'; resetBtn.textContent = 'Reset';
    const helpBtn = doc.createElement('button'); helpBtn.className = 'action-button primary'; helpBtn.textContent = 'Help';
    actionRow.appendChild(resetBtn); actionRow.appendChild(helpBtn);

    // Body container
    const bodyWrap = doc.createElement('div'); bodyWrap.className = 'panel';

    // Visual settings collapsible
    const visualToggle = doc.createElement('button'); visualToggle.className = 'collapse-toggle'; visualToggle.textContent = 'Visual Settings ▾';
    const visualContainer = doc.createElement('div'); visualContainer.style.display = 'none'; visualContainer.style.marginTop = '8px';
    // Visual sliders: blur and tint
    const blurRow = doc.createElement('div'); blurRow.className = 'visual-row';
    blurRow.innerHTML = `<div class="visual-label">Background Blur</div><input id="blurSlider" type="range" min="0" max="100" value="40" class="theme-range" />`;
    const tintRow = doc.createElement('div'); tintRow.className = 'visual-row';
    tintRow.innerHTML = `<div class="visual-label">Blur Tint</div><input id="tintSlider" type="range" min="0" max="100" value="50" class="theme-range" />`;

    visualContainer.appendChild(blurRow); visualContainer.appendChild(tintRow);

    // Assemble menu
    menu.appendChild(header);
    menu.appendChild(actionRow);
    bodyWrap.appendChild(visualToggle);
    bodyWrap.appendChild(visualContainer);

    // Add variable groups
    const groups = {
      Engine: ["maxRPM","minRPM","starterRPM","idleThrottle","fuelFlow","enginePower","brakeRPM"],
      Aerodynamics: ["wingArea","dragFactor","liftFactor","CD0","CLmax","elevatorFactor","rudderFactor","aileronFactor"],
      "Flight Model": ["mass","emptyWeight","maxWeight","inertia","pitchMoment","yawMoment","rollMoment"],
      "Landing Gear": ["gearDrag","gearCompression","gearLength"]
    };

    // mapping for inputs
    const inputsMap = {};

    function createNumberControl(varName) {
      const container = doc.createElement('div'); container.className = 'var-row';
      const labelRow = doc.createElement('div'); labelRow.className = 'label-row';
      const label = doc.createElement('label'); label.className = 'name'; label.textContent = varName;
      const input = doc.createElement('input'); input.type='number'; input.className='num-input'; input.setAttribute('inputmode','decimal'); input.placeholder='0';
      // enforce 9-digit cap: digits count excluding '.' and '-'
      input.addEventListener('input', ()=> {
        const original = input.value;
        const enforced = enforceNineDigitCap(original);
        if (enforced !== original) input.value = enforced;
        const parsed = parseFloat(input.value);
        if (!Number.isNaN(parsed)) updateModelInDoc(doc, varName, parsed);
      }, {passive:true});
      input.addEventListener('paste', (ev)=> {
        ev.preventDefault();
        const text = (ev.clipboardData || window.clipboardData).getData('text') || '';
        const enforced = enforceNineDigitCap(text);
        input.value = enforced;
        const parsed = parseFloat(enforced);
        if (!Number.isNaN(parsed)) updateModelInDoc(doc, varName, parsed);
      });
      input.addEventListener('blur', ()=> {
        if (input.value === '' || input.value === '-' || input.value === '.' || input.value === '-.') {
          input.value = '0'; updateModelInDoc(doc, varName, 0);
        } else {
          const parsed = parseFloat(input.value);
          if (Number.isNaN(parsed)) { input.value = '0'; updateModelInDoc(doc, varName, 0); }
          else updateModelInDoc(doc, varName, parsed);
        }
      });

      labelRow.appendChild(label); labelRow.appendChild(input); container.appendChild(labelRow);
      const explain = doc.createElement('div'); explain.className='explain'; explain.textContent = explanations[varName] || '';
      container.appendChild(explain);
      inputsMap[varName] = { input, container };
      return container;
    }

    for (const [groupName, vars] of Object.entries(groups)) {
      const h = doc.createElement('h2'); h.className='section-title'; h.textContent = groupName;
      bodyWrap.appendChild(h);
      for (const v of vars) {
        if (!allVars.includes(v)) continue;
        const ctrl = createNumberControl(v);
        bodyWrap.appendChild(ctrl);
      }
    }

    menu.appendChild(bodyWrap);

    // Append to document
    try { doc.body.appendChild(backdrop); doc.body.appendChild(menu); doc.body.appendChild(toggleBtn); doc.body.appendChild(helpOverlay); }
    catch (e) { console.error('[ModMenu] append failed', e); return; }

    // Help populating
    const helpContent = helpOverlay.querySelector('#helpContent');
    helpContent.innerHTML = '<p>Type numeric values (up to 9 digits) into the boxes; use Reset to set all to 0. Adjust Theme (top) and Visual Settings to control backdrop blur/tint.</p>';
    for (const [k,v] of Object.entries(explanations)) {
      const p = doc.createElement('p'); p.innerHTML = `<strong>${k}</strong>: ${v}`; helpContent.appendChild(p);
    }
    helpOverlay.querySelector('#closeHelp').addEventListener('click', ()=> { helpOverlay.style.display='none'; menu.style.display='block'; toggleBackdrop(false); });

    helpBtn.addEventListener('click', ()=> { menu.style.display='none'; helpOverlay.style.display='block'; toggleBackdrop(false); });

    // Reset button behavior
    resetBtn.addEventListener('click', ()=> {
      for (const [k,entry] of Object.entries(inputsMap)) {
        entry.input.value = '0';
        updateModelInDoc(doc, k, 0);
      }
    });

    // Visual settings collapse toggle
    let visualOpen = false;
    visualToggle.addEventListener('click', ()=> {
      visualOpen = !visualOpen;
      visualContainer.style.display = visualOpen ? 'block' : 'none';
      visualToggle.textContent = `Visual Settings ${visualOpen ? '▴' : '▾'}`;
    });

    // enforce 9-digit cap helper (digits only count)
    function enforceNineDigitCap(str) {
      let cleaned = String(str || '');
      // remove non digit/.- characters
      cleaned = cleaned.replace(/[^\d\.\-]/g,'');
      // sanitize minus: only one at start
      const minusMatches = cleaned.match(/-/g);
      if (minusMatches && minusMatches.length > 1) {
        cleaned = cleaned.replace(/-/g,'');
        cleaned = '-' + cleaned;
      }
      if (cleaned.indexOf('-') > 0) cleaned = cleaned.replace('-', '');
      // handle multiple dots
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts.shift() + '.' + parts.join('');
      }
      // count digits and truncate if necessary
      const digitsOnly = cleaned.replace(/[^0-9]/g,'');
      if (digitsOnly.length > 9) {
        const allowed = digitsOnly.slice(0,9);
        if (cleaned.includes('.')) {
          const [intPart, fracPart=''] = cleaned.split('.');
          const intDigits = intPart.replace(/[^0-9]/g,'').replace('-','');
          const keepInt = Math.min(intDigits.length, allowed.length);
          const newInt = intDigits.slice(0, keepInt) || '0';
          const newFrac = allowed.slice(keepInt);
          cleaned = (cleaned.startsWith('-')?'-':'') + newInt + (newFrac ? '.' + newFrac : '');
        } else {
          const wasNeg = cleaned.startsWith('-');
          cleaned = (wasNeg ? '-' : '') + allowed;
        }
      }
      return cleaned;
    }

    // Apply theme to doc (smooth via CSS variables)
    function applyThemeToDoc(docRef, t) {
      const panel = lerpColor(PALETTE_DARK.panel, PALETTE_LIGHT.panel, t);
      const text = lerpColor(PALETTE_DARK.text, PALETTE_LIGHT.text, t);
      const accent = lerpColor(PALETTE_DARK.accent, PALETTE_LIGHT.accent, t);
      const muted = lerpColor(PALETTE_DARK.muted, PALETTE_LIGHT.muted, t);
      const root = docRef.documentElement;
      root.style.setProperty('--mod-panel', panel);
      root.style.setProperty('--mod-text', text);
      root.style.setProperty('--mod-accent', accent);
      root.style.setProperty('--mod-muted', muted);
    }

    // Backdrop control: compute blur px and tint rgba and apply
    // blurSlider value 0..100 -> blurPx 0..maxBlurPx
    const maxBlurPx = 32; // adjustable for stronger blur
    function applyBackdropSettings(docRef, blurPercent, tintPercent) {
      // blur:
      const blurPx = (blurPercent/100) * maxBlurPx;
      // tint color between dark and light
      const tintRgb = lerpRgb(DARK_TINT_RGB, LIGHT_TINT_RGB, tintPercent/100);
      // opacity scales with blurPercent (so when blur=0 it's transparent)
      const maxOpacity = 0.85; // when blur=100, opacity cap
      const opacity = (blurPercent/100) * maxOpacity;
      backdrop.style.backdropFilter = `blur(${blurPx}px)`;
      backdrop.style.webkitBackdropFilter = `blur(${blurPx}px)`;
      backdrop.style.backgroundColor = `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${opacity})`;
      // also set opacity to 1 when visible for smooth transitions
      backdrop.style.opacity = blurPercent>0 ? '1' : '0';
    }

    // Theme slider smoothing (easing)
    const themeSlider = doc.getElementById('themeSlider');
    let themeT = parseFloat(themeSlider.value)/100;
    applyThemeToDoc(doc, themeT);
    let themeAnim = null;
    function animateThemeTo(targetT, duration = 320) {
      const startT = themeT, delta = targetT - startT, startTime = performance.now();
      if (themeAnim) cancelAnimationFrame(themeAnim);
      function step(now) {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = p < 0.5 ? 2*p*p : -1 + (4-2*p)*p;
        themeT = startT + delta * eased;
        applyThemeToDoc(doc, themeT);
        if (p < 1) themeAnim = requestAnimationFrame(step); else themeAnim = null;
      }
      themeAnim = requestAnimationFrame(step);
    }
    themeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value,10)/100;
      animateThemeTo(val, 320);
    });

    // Visual sliders: blur & tint with smoothing
    const blurSlider = doc.getElementById('blurSlider');
    const tintSlider = doc.getElementById('tintSlider');

    let backdropBlurT = parseFloat(blurSlider.value)/100;
    let backdropTintT = parseFloat(tintSlider.value)/100;
    // apply initial
    applyBackdropSettings(doc, backdropBlurT*100, backdropTintT*100);

    let backdropAnim = null;
    function animateBackdropTo(targetBlurT, targetTintT, duration = 220) {
      const startBlur = backdropBlurT, startTint = backdropTintT;
      const dBlur = targetBlurT - startBlur, dTint = targetTintT - startTint;
      const startTime = performance.now();
      if (backdropAnim) cancelAnimationFrame(backdropAnim);
      function step(now) {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = p < 0.5 ? 2*p*p : -1 + (4-2*p)*p;
        backdropBlurT = startBlur + dBlur * eased;
        backdropTintT = startTint + dTint * eased;
        applyBackdropSettings(doc, backdropBlurT*100, backdropTintT*100);
        if (p < 1) backdropAnim = requestAnimationFrame(step); else backdropAnim = null;
      }
      backdropAnim = requestAnimationFrame(step);
    }

    blurSlider.addEventListener('input', (e) => {
      const t = parseInt(e.target.value,10)/100;
      animateBackdropTo(t, backdropTintT, 180);
    });
    tintSlider.addEventListener('input', (e) => {
      const t = parseInt(e.target.value,10)/100;
      animateBackdropTo(backdropBlurT, t, 180);
    });

    // Toggle backdrop visibility when menu opens/closes
    function toggleBackdrop(show) {
      if (show) {
        // ensure it's visible (but blur/opacity may be zero depending on slider)
        backdrop.style.display = 'block';
        // apply current slider settings smoothly
        const bT = parseInt(blurSlider.value,10)/100;
        const ti = parseInt(tintSlider.value,10)/100;
        animateBackdropTo(bT, ti, 220);
      } else {
        // hide gradually then set display:none
        if (backdropAnim) cancelAnimationFrame(backdropAnim);
        // fade out by setting blur to 0 and opacity to 0
        animateBackdropTo(0, backdropTintT, 160);
        setTimeout(()=> { try { backdrop.style.display='none'; } catch(e) {} }, 240);
      }
    }

    // Toggle menu button behavior
    toggleBtn.addEventListener('click', ()=> {
      const open = menu.style.display === 'block';
      menu.style.display = open ? 'none' : 'block';
      if (!open) { toggleBtn.style.boxShadow = '0 10px 26px rgba(2,6,23,0.6)'; toggleBackdrop(true); }
      else { toggleBtn.style.boxShadow = '0 6px 20px rgba(2,6,23,0.5)'; toggleBackdrop(false); }
    });

    // keybinding
    doc.addEventListener('keydown', (e) => { if (e.key === '#') toggleBtn.click(); });

    // clicking backdrop does not close by default — but let's allow alt-click to close
    backdrop.addEventListener('click', (ev)=> {
      // if user holds Alt/Option while clicking backdrop, close menu
      if (ev.altKey) {
        menu.style.display = 'none';
        toggleBackdrop(false);
      }
    });

    // Model update helper (writes to window.geofs.* in that doc's window)
    function updateModelInDoc(docRef, variable, value) {
      const win = docRef.defaultView || window;
      try {
        const def = win.geofs?.aircraft?.instance?.definition || win.geofs?.aircraft?.definition;
        if (def && variable in def) {
          def[variable] = value;
        } else {
          // fallback nested attempt
          if (win.geofs && win.geofs.aircraft && win.geofs.aircraft.instance && win.geofs.aircraft.instance.definition) {
            win.geofs.aircraft.instance.definition[variable] = value;
          }
        }
      } catch (err) {
        // ignore silently
      }
    }

    // initialize inputs to 0
    for (const key of Object.keys(inputsMap)) {
      inputsMap[key].input.value = '0';
      updateModelInDoc(doc, key, 0);
    }

    // Build mapping (after creating inputs)
    // We already created inputs when building groups; ensure they are set to 0
    for (const v of allVars) {
      if (!inputsMap[v] && doc.querySelector) {
        // should not happen: but guard
      }
    }

    // initial backdrop hidden
    backdrop.style.display = 'none';
    backdrop.style.backdropFilter = 'blur(0px)';
    backdrop.style.backgroundColor = 'rgba(0,0,0,0)';

    // ensure menu hidden initially
    menu.style.display = 'none';

    console.log('[ModMenu] injected overlay into', doc.location && doc.location.href ? doc.location.href : 'unknown');
  } // end injectIntoWindow

  /* ===========================
     Injection orchestrator (main document + iframes)
     =========================== */

  // We must create inputsMap per doc; to avoid overcomplicating closure scope, we'll regenerate per injection.
  // The injectIntoWindow function creates and appends elements and wires events.

  function attemptInjectionAll() {
    try { injectIntoWindow(window); } catch(e){/* ignore */ }

    const iframes = Array.from(document.getElementsByTagName('iframe'));
    for (const iframe of iframes) {
      try {
        const src = (iframe.getAttribute('src') || '').toLowerCase();
        if (src.includes('geofs.php') || src.includes('geo-fs') || (iframe.id && /geofs|map|game/i.test(iframe.id))) {
          try {
            if (iframe.contentWindow && iframe.contentWindow.document) injectIntoWindow(iframe.contentWindow);
          } catch (err) {
            // cross-origin or not ready
          }
        }
      } catch (err) {}
    }
  }

  // initial attempt & observer
  attemptInjectionAll();

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (n.tagName && n.tagName.toLowerCase() === 'iframe') {
            const iframe = n;
            setTimeout(()=> {
              try { if (iframe.contentWindow && iframe.contentWindow.document) injectIntoWindow(iframe.contentWindow); } catch(e){}
            }, 300);
          }
        }
      }
      if (m.type === 'attributes' && m.target && m.target.tagName && m.target.tagName.toLowerCase() === 'iframe') {
        const iframe = m.target;
        setTimeout(()=> { try { if (iframe.contentWindow && iframe.contentWindow.document) injectIntoWindow(iframe.contentWindow); } catch(e){} }, 300);
      }
    }
  });

  observer.observe(document.documentElement || document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['src'] });

  // Poller fallback
  const poll = setInterval(()=> { attemptInjectionAll(); }, 1200);
  setTimeout(()=> clearInterval(poll), 90000);

  console.log('[ModMenu] overlay injector running — click cog in flight view to open panel.');

})();