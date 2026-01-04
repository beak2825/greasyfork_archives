// ==UserScript==
// @name         Google Forms: AI Form Filler (Gemini)
// @namespace    https://www.fiverr.com/web_coder_nsd
// @version      1.1.2
// @icon         https://cdn-icons-png.flaticon.com/512/720/720311.png
// @description  One-click AI autofill for Google Forms using Gemini with optional one-time instruction override + quick cleaner
// @match        https://docs.google.com/forms/*/viewform
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547099/Google%20Forms%3A%20AI%20Form%20Filler%20%28Gemini%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547099/Google%20Forms%3A%20AI%20Form%20Filler%20%28Gemini%29.meta.js
// ==/UserScript==

(() => {
  // UI buttons
  const btn = document.createElement('button');        // Run
  const btnEdit = document.createElement('button');    // One-time prompt
  const btnClean = document.createElement('button');   // Clean all

  Object.assign(btn.style, {
    position: 'fixed', right: '16px', top: '25px', zIndex: 2147483647,
    width: '44px', height: '44px', borderRadius: '50%', border: '0',
    background: '#111', color: '#fff', fontSize: '14px', lineHeight: '44px',
    textAlign: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,0,0,.28)', userSelect: 'none'
  });
  btn.textContent = '▶';
  document.documentElement.appendChild(btn);

  Object.assign(btnEdit.style, {
    position: 'fixed', right: '9px', top: '19px', zIndex: 2147483647,
    width: '24px', height: '24px', borderRadius: '50%', border: '0',
    background: '#444', color: '#fff', fontSize: '17px', lineHeight: '14px',
    textAlign: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,0,0,.28)', userSelect: 'none'
  });
  btnEdit.title = 'Add one-time instructions';
  btnEdit.textContent = '✎';
  document.documentElement.appendChild(btnEdit);

  Object.assign(btnClean.style, {
    position: 'fixed', right: '16px', top: '72px', zIndex: 2147483647,
    width: '44px', height: '44px', borderRadius: '50%', border: '0',
    background: '#7a1d1d', color: '#fff', fontSize: '18px', lineHeight: '44px',
    textAlign: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,0,0,.28)', userSelect: 'none'
  });
  btnClean.title = 'Clear all inputs';
  btnClean.textContent = '🧹';
  document.documentElement.appendChild(btnClean);

  // one-time extra instructions, cleared after each run
  let sessionExtraInstructions = '';
  btnEdit.addEventListener('click', () => {
    const next = prompt('One-time instructions for this run only.\nExample: "email should be xyz@gmail.com"');
    if (next == null) return;
    sessionExtraInstructions = (next || '').trim();
    btnEdit.style.background = sessionExtraInstructions ? '#0a7' : '#444';
  });

  // drag all three as a group (drag using main ▶ button)
  let drag = { x: 0, y: 0, sx: 0, sy: 0, down: false };
  const onDown = (e) => {
    drag.down = true; drag.sx = e.clientX; drag.sy = e.clientY;
    const r = btn.getBoundingClientRect(); drag.x = r.left; drag.y = r.top; e.preventDefault();
  };
  const onMove = (e) => {
    if (!drag.down) return;
    const nx = drag.x + (e.clientX - drag.sx);
    const ny = drag.y + (e.clientY - drag.sy);
    [ [btn, 0], [btnClean, 47] ].forEach(([el, dy]) => {
      el.style.left = nx + 'px'; el.style.top = (ny + dy) + 'px';
      el.style.right = 'auto'; el.style.bottom = 'auto';
    });
    // the small ✎ button sits near the ▶ button
    btnEdit.style.left = (nx + 28) + 'px';
    btnEdit.style.top = (ny - 6) + 'px';
    btnEdit.style.right = 'auto';
    btnEdit.style.bottom = 'auto';
  };
  const onUp = () => { drag.down = false; };
  btn.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Gemini client
  class GeminiClient {
    constructor() {
      this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
      this.primaryModel = 'gemini-2.0-flash';
      this.fallbackModel = 'gemini-1.5-flash';
      this.apiKey = null;
    }
    async init() {
      if (!this.apiKey) {
        let k = localStorage.getItem('gemini_api_key');
        if (!k) {
          k = prompt('Enter Gemini API key');
          if (!k) throw new Error('API key is required');
          localStorage.setItem('gemini_api_key', k.trim());
        }
        this.apiKey = k.trim();
      }
    }
    async fetchFromModel(model, prompt) {
      const res = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      return res;
    }
    async generateContent(prompt) {
      if (!this.apiKey) await this.init();
      let response = await this.fetchFromModel(this.primaryModel, prompt);
      if (response.status === 429) response = await this.fetchFromModel(this.fallbackModel, prompt);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  }

  // DOM helpers
  const getClosestListItem = (el) => el.closest('[role="listitem"]') || el.closest('.Qr7Oae') || el.closest('.geS5n');
  const getHeadingText = (container) => {
    let t = '';
    if (!container) return t;
    const heading = container.querySelector('[role="heading"] .M7eMe') || container.querySelector('[role="heading"]') || container.querySelector('.HoXoMd .M7eMe');
    if (heading) t = heading.textContent.trim();
    return t || (container.querySelector('label, .aDTYNe, .OIC90c')?.textContent?.trim() || '');
  };
  const plain = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const isVisible = (el) => !!(el && el.offsetParent !== null);

  // prompt builder
  function buildPrompt(schema, oneTimeExtra) {
    const now = new Date().toISOString();
    const extraBlock = oneTimeExtra
      ? `\nUser instructions for this run only. If they conflict, override defaults:\n${oneTimeExtra}\n`
      : '';
    return `
You are a data faker for autofilling Google Forms. Decide realistic but safe dummy values from the provided schema.
Rules:
- Only use provided options for radio, checkbox, and select.
- For "date" fields, return ISO YYYY-MM-DD. Respect "min" and "max" if given, otherwise pick within ±365 days from today.
- For "time" fields, return {"hour":1-12,"minute":0-59,"meridiem":"AM|PM"}.
- Keep text answers short and plausible. Email looks like a real address.
- Return STRICT JSON only. No markdown.
${extraBlock}
Schema (JSON):
${JSON.stringify(schema, null, 2)}

Output JSON array of objects, each:
{ "id": "<schema.id>", "value": <string | string[] | {"hour":number,"minute":number,"meridiem":string}> }

Now generate values. Current time: ${now}.
`;
  }

  // safe JSON
  function safeJson(txt) {
    const cleaned = txt.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try { return JSON.parse(cleaned); } catch (e) {
      const m = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (m) return JSON.parse(m[0]);
      throw e;
    }
  }

  // setters
  function setNativeValue(el, value) {
    let proto = el; let setter = null;
    while ((proto = Object.getPrototypeOf(proto)) && !setter) {
      const d = Object.getOwnPropertyDescriptor(proto, 'value');
      if (d && typeof d.set === 'function') setter = d.set;
    }
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Select helpers
  function clickOptionInListbox(listbox, wanted) {
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const open = () => { if (listbox.getAttribute('aria-expanded') === 'false') listbox.click(); };
    const close = () => { if (listbox.getAttribute('aria-expanded') === 'true') listbox.click(); };
    open();
    let popup = Array.from(document.querySelectorAll('.OA0qNb[jsname="V68bde"]')).find(m => isVisible(m));
    let options = popup ? Array.from(popup.querySelectorAll('[role="option"]'))
                        : Array.from(listbox.querySelectorAll('[role="option"]'));
    let target = options.find(o => norm(o.getAttribute('data-value')) === norm(wanted))
             || options.find(o => norm(o.textContent) === norm(wanted))
             || options.find(o => {
                  const txt = norm(o.getAttribute('data-value') || o.textContent);
                  return txt && txt !== 'choose';
                });
    if (target) target.click();
    close();
  }
  function resetListboxToChooseOrFirst(listbox) {
    const open = () => { if (listbox.getAttribute('aria-expanded') === 'false') listbox.click(); };
    const close = () => { if (listbox.getAttribute('aria-expanded') === 'true') listbox.click(); };
    open();
    let popup = Array.from(document.querySelectorAll('.OA0qNb[jsname="V68bde"]')).find(m => isVisible(m));
    let options = popup ? Array.from(popup.querySelectorAll('[role="option"]'))
                        : Array.from(listbox.querySelectorAll('[role="option"]'));
    // Prefer "Choose" / empty value
    let target = options.find(o => /choose/i.test(o.textContent || '') || (o.getAttribute('data-value') || '') === '');
    if (!target && options.length) target = options[0];
    if (target) target.click();
    close();
  }

  // CLEARING LOGIC
  function clearCheckboxesOnly() {
    // Uncheck all checked checkboxes (requested: auto-remove previously set checkmarks before run)
    Array.from(document.querySelectorAll('[role="checkbox"][aria-checked="true"]')).forEach(cb => cb.click());
  }

  function clearAllInputs() {
    // Text-like inputs
    document.querySelectorAll('input.whsOnd[type="text"], input.whsOnd[type="email"], input.whsOnd[type="number"]').forEach(el => setNativeValue(el, ''));
    // Textareas
    document.querySelectorAll('textarea').forEach(el => setNativeValue(el, ''));
    // Dates
    document.querySelectorAll('input[type="date"].whsOnd').forEach(el => setNativeValue(el, ''));
    // Time (Hour/Minute)
    document.querySelectorAll('.PfQ8Lb input[aria-label="Hour"]').forEach(el => setNativeValue(el, ''));
    document.querySelectorAll('.PfQ8Lb input[aria-label="Minute"]').forEach(el => setNativeValue(el, ''));
    // Time AM/PM reset to first option (usually AM)
    document.querySelectorAll('.PfQ8Lb [role="listbox"][aria-label="AM or PM"]').forEach(lb => resetListboxToChooseOrFirst(lb));
    // Checkboxes
    Array.from(document.querySelectorAll('[role="checkbox"][aria-checked="true"]')).forEach(cb => cb.click());
    // Radios (try to deselect active; Forms may keep one selected if required)
    Array.from(document.querySelectorAll('[role="radio"][aria-checked="true"]')).forEach(r => r.click());
    // Select listboxes reset to default
    document.querySelectorAll('[role="listbox"].jgvuAb, [role="listbox"].cGN2le, [role="listbox"].t9kgXb').forEach(lb => resetListboxToChooseOrFirst(lb));
  }

  btnClean.addEventListener('click', () => {
    clearAllInputs();
  });

  // fill from plan
  async function fillFromPlan(plan) {
    document.querySelectorAll('[data-ai-field-id^="text_"]').forEach(input => {
      const id = input.dataset.aiFieldId;
      const p = plan.find(x => x.id === id);
      if (p && typeof p.value === 'string') setNativeValue(input, p.value);
    });

    document.querySelectorAll('[data-ai-field-id^="textarea_"]').forEach(ta => {
      const id = ta.dataset.aiFieldId;
      const p = plan.find(x => x.id === id);
      if (p && typeof p.value === 'string') setNativeValue(ta, p.value);
    });

    document.querySelectorAll('[role="radiogroup"][data-ai-field-id]').forEach(group => {
      const id = group.dataset.aiFieldId;
      const p = plan.find(x => x.id === id);
      if (!p || typeof p.value !== 'string') return;
      const target = Array.from(group.querySelectorAll('[role="radio"]')).find(r => {
        const v = r.getAttribute('data-value') || r.getAttribute('aria-label') || r.textContent;
        return plain(v).toLowerCase() === plain(p.value).toLowerCase();
      }) || Array.from(group.querySelectorAll('[role="radio"]'))[0];
      if (target) target.click();
    });

    const groupIds = new Set(plan.filter(p => Array.isArray(p.value) || typeof p.value === 'string').map(p => p.id));
    groupIds.forEach(id => {
      const planned = plan.find(p => p.id === id);
      const values = Array.isArray(planned?.value) ? planned.value : [planned?.value].filter(Boolean);
      const cbs = Array.from(document.querySelectorAll(`[role="checkbox"][data-ai-field-id="${id}"]`));
      cbs.forEach(cb => { if (cb.getAttribute('aria-checked') === 'true') cb.click(); });
      values.forEach(val => {
        const target = cbs.find(cb => {
          const v = cb.getAttribute('data-answer-value') || cb.getAttribute('aria-label') || cb.textContent;
          return plain(v).toLowerCase() === plain(val).toLowerCase();
        }) || null;
        if (target) target.click();
      });
    });

    document.querySelectorAll('[role="listbox"][data-ai-field-id^="select_"]').forEach(lb => {
      const id = lb.dataset.aiFieldId;
      const p = plan.find(x => x.id === id);
      if (!p || typeof p.value !== 'string') return;
      clickOptionInListbox(lb, p.value);
    });

    document.querySelectorAll('input[type="date"][data-ai-field-id^="date_"]').forEach(dateEl => {
      const id = dateEl.dataset.aiFieldId;
      const p = plan.find(x => x.id === id);
      const min = dateEl.getAttribute('min');
      const max = dateEl.getAttribute('max');
      const value = (p && typeof p.value === 'string') ? p.value : randDate(min, max);
      setNativeValue(dateEl, value);
    });

    const timeGroups = {};
    document.querySelectorAll('[data-ai-field-id^="time_"]').forEach(el => {
      const id = el.dataset.aiFieldId.replace(/_(hour|minute|ampm)$/, '');
      if (!timeGroups[id]) timeGroups[id] = {};
      if (/_hour$/.test(el.dataset.aiFieldId)) timeGroups[id].hourEl = el;
      if (/_minute$/.test(el.dataset.aiFieldId)) timeGroups[id].minuteEl = el;
      if (/_ampm$/.test(el.dataset.aiFieldId)) timeGroups[id].ampmEl = el;
    });
    Object.keys(timeGroups).forEach(id => {
      const grp = timeGroups[id];
      const p = plan.find(x => x.id === id);
      let obj = null;
      if (p && typeof p.value === 'object' && p.value) {
        obj = { hour: clamp(parseInt(p.value.hour, 10) || 9, 1, 12),
                minute: clamp(parseInt(p.value.minute, 10) || 0, 0, 59),
                meridiem: String(p.value.meridiem || 'AM').toUpperCase() };
      } else if (p && typeof p.value === 'string') {
        obj = parseTimeLike(p.value);
      }
      if (!obj) obj = { hour: 10, minute: 30, meridiem: 'AM' };
      if (grp.hourEl) setNativeValue(grp.hourEl, String(obj.hour).padStart(2, '0'));
      if (grp.minuteEl) setNativeValue(grp.minuteEl, String(obj.minute).padStart(2, '0'));
      if (grp.ampmEl) clickOptionInListbox(grp.ampmEl, obj.meridiem);
    });
  }

  // schema scraper
  async function scrapeSchema() {
    const schema = [];

    document.querySelectorAll('input[type="text"].whsOnd, input[type="email"].whsOnd, input[type="number"].whsOnd').forEach((input, idx) => {
      const wrap = getClosestListItem(input);
      const label = getHeadingText(wrap);
      const id = `text_${idx}_${uid()}`;
      input.dataset.aiFieldId = id;
      schema.push({ id, type: 'text', label: plain(label), required: input.required || /[*]$/.test(label) });
    });

    document.querySelectorAll('textarea.KHxj8b, textarea').forEach((ta, idx) => {
      const wrap = getClosestListItem(ta);
      const label = getHeadingText(wrap);
      const id = `textarea_${idx}_${uid()}`;
      ta.dataset.aiFieldId = id;
      schema.push({ id, type: 'textarea', label: plain(label), required: ta.required || /[*]$/.test(label) });
    });

    document.querySelectorAll('[role="radiogroup"]').forEach((rg, idx) => {
      const wrap = getClosestListItem(rg);
      const label = getHeadingText(wrap);
      const options = Array.from(rg.querySelectorAll('[role="radio"]')).map(r => {
        const v = r.getAttribute('data-value') || r.getAttribute('aria-label') || r.textContent;
        return plain(v);
      }).filter(Boolean);
      if (!options.length) return;
      const id = `radio_${idx}_${uid()}`;
      rg.dataset.aiFieldId = id;
      schema.push({ id, type: 'radio', label: plain(label), options: Array.from(new Set(options)) });
    });

    const checkboxEls = Array.from(document.querySelectorAll('[role="checkbox"][data-answer-value], [role="checkbox"][aria-label]'));
    const groups = new Map();
    checkboxEls.forEach((cb) => {
      const wrap = getClosestListItem(cb);
      const groupLabel = getHeadingText(wrap) || 'Checkbox Group';
      const fieldId = cb.getAttribute('data-field-id') || groupLabel;
      const key = `${groupLabel}::${fieldId}`;
      if (!groups.has(key)) groups.set(key, []);
      const v = cb.getAttribute('data-answer-value') || cb.getAttribute('aria-label') || cb.textContent;
      groups.get(key).push({ el: cb, value: plain(v) });
    });
    let cidx = 0;
    for (const [key, items] of groups.entries()) {
      const [groupLabel] = key.split('::');
      const id = `checkbox_${cidx++}_${uid()}`;
      items.forEach(i => { i.el.dataset.aiFieldId = id; });
      const options = Array.from(new Set(items.map(i => i.value))).filter(Boolean);
      if (options.length) schema.push({ id, type: 'checkbox', label: plain(groupLabel), options });
    }

    // Select listboxes and floating popup
    const listboxes = Array.from(document.querySelectorAll('[role="listbox"].jgvuAb, [role="listbox"].cGN2le, [role="listbox"].t9kgXb'));
    for (let idx = 0; idx < listboxes.length; idx++) {
      const lb = listboxes[idx];
      const wrap = getClosestListItem(lb);
      const label = getHeadingText(wrap) || 'Select';
      const id = `select_${idx}_${uid()}`;
      lb.dataset.aiFieldId = id;

      if (lb.getAttribute('aria-expanded') === 'false') lb.click();
      await sleep(10);

      let popup = Array.from(document.querySelectorAll('.OA0qNb[jsname="V68bde"]')).find(m => isVisible(m));
      let opts = popup
        ? Array.from(popup.querySelectorAll('[role="option"]')).map(o => plain(o.getAttribute('data-value') || o.textContent))
        : Array.from(lb.querySelectorAll('[role="option"]')).map(o => plain(o.getAttribute('data-value') || o.textContent));

      if (lb.getAttribute('aria-expanded') === 'true') lb.click();

      opts = opts.filter(v => v && !/^choose$/i.test(v));
      if (opts.length) schema.push({ id, type: 'select', label: plain(label), options: Array.from(new Set(opts)) });
    }

    document.querySelectorAll('input[type="date"].whsOnd').forEach((dateEl, idx) => {
      const wrap = getClosestListItem(dateEl);
      const label = getHeadingText(wrap) || 'Date';
      const id = `date_${idx}_${uid()}`;
      dateEl.dataset.aiFieldId = id;
      schema.push({
        id, type: 'date', label: plain(label),
        min: dateEl.getAttribute('min') || null,
        max: dateEl.getAttribute('max') || null
      });
    });

    document.querySelectorAll('.PfQ8Lb').forEach((timeWrap, idx) => {
      const wrap = getClosestListItem(timeWrap);
      const label = getHeadingText(wrap) || 'Time';
      const hour = timeWrap.querySelector('input[aria-label="Hour"]');
      const minute = timeWrap.querySelector('input[aria-label="Minute"]');
      const meridianBox = timeWrap.querySelector('[role="listbox"][aria-label="AM or PM"]');
      if (hour && minute && meridianBox) {
        const id = `time_${idx}_${uid()}`;
        hour.dataset.aiFieldId = `${id}_hour`;
        minute.dataset.aiFieldId = `${id}_minute`;
        meridianBox.dataset.aiFieldId = `${id}_ampm`;
        const options = Array.from(meridianBox.querySelectorAll('[role="option"]')).map(o => plain(o.getAttribute('data-value') || o.textContent));
        schema.push({ id, type: 'time', label: plain(label), options: Array.from(new Set(options)) });
      }
    });

    return schema;
  }

  // main
  async function run() {
    const original = btn.textContent;
    btn.disabled = true; btn.textContent = '...';
    try {
      // Auto-remove previously set checkmarks (checkboxes) before running fill
      clearCheckboxesOnly();

      const schema = await scrapeSchema();
      if (!schema.length) throw new Error('No fields detected');

      const prompt = buildPrompt(schema, sessionExtraInstructions);
      // clear one-time instructions after use
      sessionExtraInstructions = '';
      btnEdit.style.background = '#444';

      const gemini = new GeminiClient();
      const txt = await gemini.generateContent(prompt);
      const plan = safeJson(txt);
      await fillFromPlan(plan);
      btn.textContent = '✓';
      await sleep(1200);
    } catch (e) {
      console.error(e);
      alert(e.message || 'AI fill failed');
    } finally {
      btn.disabled = false; btn.textContent = original;
    }
  }

  btn.addEventListener('click', run);
})();
