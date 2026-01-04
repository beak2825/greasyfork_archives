// ==UserScript==
// @name         [Wallapop] Toggles to hide reserved / non-reserved items on search results (left of Sort-by)
// @namespace    https://greasyfork.org/en/scripts/546440-wallapop-toggles-to-hide-reserved-non-reserved-items-on-search-results-left-of-sort-by
// @match        https://es.wallapop.com/*
// @version      2025-08-20
// @author       nooobye
// @license      MIT
// @description  Two native-looking chips to the LEFT of “Ordenar por:”. Selected = green + bold + stronger outline; width locked with fractional measurements to avoid layout shift. Simple display:none filtering.
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=wallapop.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain_url=wallapop.com
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546440/%5BWallapop%5D%20Toggles%20to%20hide%20reserved%20%20non-reserved%20items%20on%20search%20results%20%28left%20of%20Sort-by%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546440/%5BWallapop%5D%20Toggles%20to%20hide%20reserved%20%20non-reserved%20items%20on%20search%20results%20%28left%20of%20Sort-by%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const KEY_HIDE_RESERVED = "gm_walla_hide_reserved";
  const KEY_HIDE_NONRES = "gm_walla_hide_nonreserved";
  let hideReserved = !!GM_getValue(KEY_HIDE_RESERVED, false);
  let hideNonRes = !!GM_getValue(KEY_HIDE_NONRES, false);

  GM_addStyle(
    ".gm-hide-reserved{display:none!important}.gm-hide-nonreserved{display:none!important}.gm-selected{background-color:#e8f6f4!important;color:#015354!important;border-color:#015354!important}.gm-strong-outline{box-shadow:0 0 0 1.25px currentColor inset}"
  );

  function chipsRow() {
    return document.querySelector('[class*="SearchPage__bubbles"] .d-flex.flex-wrap');
  }
  function sortBySlotIn(row) {
    if (!row) return null;
    const sortBtn = row.querySelector('[class*="SortByButton__"]');
    if (!sortBtn) return null;
    return sortBtn.closest(".me-2") || sortBtn.parentElement || null;
  }

  function findSelectedFromButton(btn) {
    const hit = Array.from(btn.classList).find(c => c.includes("applied-bubble_Bubble--selected__"));
    return hit || "";
  }
  function findSelectedFromCSS() {
    try {
      const sheets = Array.from(document.styleSheets);
      for (let i = 0; i < sheets.length; i += 1) {
        let rules;
        try { rules = sheets[i].cssRules; } catch (e) { continue; }
        if (!rules) continue;
        for (let j = 0; j < rules.length; j += 1) {
          const sel = rules[j].selectorText || "";
          if (!sel || !sel.includes("applied-bubble_Bubble--selected__")) continue;
          const m = sel.match(/\.applied-bubble_Bubble--selected__[\w-]+/);
          if (m && m[0]) return m[0].slice(1);
        }
      }
    } catch (e) {}
    return "";
  }

  function readNativeChipClasses() {
    const row = chipsRow();
    if (!row) return null;
    const exampleBtn = row.querySelector('button[class*="applied-bubble_Bubble__"]');

    let selected = findSelectedFromCSS();
    if (!selected && exampleBtn) selected = findSelectedFromButton(exampleBtn);
    if (!selected) selected = "";

    const button = exampleBtn ? Array.from(exampleBtn.classList)
      : ["applied-bubble_Bubble__Xbe51", "px-2", "d-flex", "justify-content-center", "align-items-center"];

    const contentWrapEl = exampleBtn && exampleBtn.querySelector('[class*="applied-bubble_Bubble__content_wrapper__"]');
    const contentEl = exampleBtn && exampleBtn.querySelector('[class*="applied-bubble_Bubble__content__"]');

    const contentWrap = contentWrapEl ? Array.from(contentWrapEl.classList)
      : ["applied-bubble_Bubble__content_wrapper__2LGtw", "px-2", "d-flex", "justify-content-center", "align-items-center"];
    const content = contentEl ? Array.from(contentEl.classList)
      : ["applied-bubble_Bubble__content__9tP0J"];

    return { button, selected, contentWrap, content };
  }

  // Measure off-DOM with fractional precision and return width in px (float)
  function measureChipWidth(label, classes, isSelected, boldWeight) {
    const measWrap = document.createElement("div");
    measWrap.style.position = "absolute";
    measWrap.style.visibility = "hidden";
    measWrap.style.left = "-9999px";
    measWrap.style.top = "-9999px";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = classes.button.join(" ");
    if (isSelected) {
      if (classes.selected) btn.classList.add(classes.selected);
      else btn.classList.add("gm-selected");
      btn.classList.add("gm-strong-outline");
    }

    const contentWrap = document.createElement("div");
    contentWrap.className = classes.contentWrap.join(" ");

    const text = document.createElement("div");
    text.className = classes.content.join(" ");
    text.textContent = label;
    if (isSelected) text.style.fontWeight = boldWeight || "700";

    contentWrap.appendChild(text);
    btn.appendChild(contentWrap);
    measWrap.appendChild(btn);
    document.body.appendChild(measWrap);

    const rect = btn.getBoundingClientRect();
    const w = rect.width;
    measWrap.remove();
    return w;
  }

  function lockButtonWidth(btn, textNode, label, classes) {
    const baseline = getComputedStyle(textNode).fontWeight || "400";
    const wNormal = measureChipWidth(label, classes, false, baseline);
    const wSelected = measureChipWidth(label, classes, true, "700");
    const lock = Math.ceil(Math.max(wNormal, wSelected)) + 1;
    btn.style.width = lock + "px";
    btn.style.minWidth = lock + "px";
    btn.style.boxSizing = "border-box";
    return { baselineWeight: baseline };
  }

  function buildChip({ id, label, get, set }) {
    const row = chipsRow();
    if (!row) return null;
    const existing = document.getElementById(id);
    if (existing) return existing;

    const classes = readNativeChipClasses();
    if (!classes) return null;

    const wrap = document.createElement("div");
    wrap.className = "me-2 mb-2";
    wrap.id = id;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = classes.button.join(" ");
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-pressed", "false");

    const contentWrap = document.createElement("div");
    contentWrap.className = classes.contentWrap.join(" ");

    const text = document.createElement("div");
    text.className = classes.content.join(" ");
    text.textContent = label;

    contentWrap.appendChild(text);
    btn.appendChild(contentWrap);
    wrap.appendChild(btn);

    // === Change here: insert to the LEFT of Sort-by (before the Sort-by slot) ===
    const slot = sortBySlotIn(row);
    if (slot && slot.parentNode === row) row.insertBefore(wrap, slot);
    else if (slot && slot.parentNode) slot.parentNode.insertBefore(wrap, slot);
    else return null;

    const { baselineWeight } = lockButtonWidth(btn, text, label, classes);

    function syncVisual() {
      const active = !!get();
      btn.setAttribute("aria-pressed", String(active));
      text.style.fontWeight = active ? "700" : baselineWeight;
      if (classes.selected) {
        btn.classList.toggle(classes.selected, active);
        btn.classList.toggle("gm-selected", false);
      } else {
        btn.classList.toggle("gm-selected", active);
      }
      btn.classList.toggle("gm-strong-outline", active);
    }

    function toggle() {
      const next = !get();
      set(next);
      applyFilter();
      syncVisual();
    }

    btn.addEventListener("click", toggle);
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => lockButtonWidth(btn, text, label, classes)).catch(function (e) {});
    }

    syncVisual();
    return wrap;
  }

  function grid() {
    return document.querySelector('div[aria-label="Items list"]');
  }
  function cards() {
    const g = grid();
    return g ? Array.from(g.querySelectorAll('a[href^="/item/"]')) : [];
  }
  function isReserved(card) {
    return !!card.querySelector('wallapop-badge[badge-type="reserved"]');
  }
  function applyFilter() {
    const list = cards();
    for (let i = 0; i < list.length; i += 1) {
      const el = list[i];
      el.classList.remove("gm-hide-reserved", "gm-hide-nonreserved");
      const reserved = isReserved(el);
      if (hideReserved && reserved) el.classList.add("gm-hide-reserved");
      if (hideNonRes && !reserved) el.classList.add("gm-hide-nonreserved");
    }
  }

  function injectChips() {
    const row = chipsRow();
    const slot = sortBySlotIn(row);
    if (!row || !slot) return false;

    buildChip({
      id: "gm_chip_hide_reserved",
      label: "Ocultar reservados",
      get: () => hideReserved,
      set: v => { hideReserved = !!v; GM_setValue(KEY_HIDE_RESERVED, hideReserved); }
    });
    buildChip({
      id: "gm_chip_hide_nonreserved",
      label: "Ocultar no reservados",
      get: () => hideNonRes,
      set: v => { hideNonRes = !!v; GM_setValue(KEY_HIDE_NONRES, hideNonRes); }
    });
    return true;
  }

  const root = document.querySelector("#__next") || document.body;
  const mo = new MutationObserver(list => {
    for (let i = 0; i < list.length; i += 1) {
      const m = list[i];
      if (m.addedNodes && m.addedNodes.length) {
        injectChips();
        applyFilter();
        break;
      }
    }
  });
  mo.observe(root, { childList: true, subtree: true });

  let tries = 0;
  (function tick() {
    if (injectChips()) {
      applyFilter();
    } else if (tries < 20) {
      tries += 1;
      setTimeout(tick, 200);
    }
  }());
})();
