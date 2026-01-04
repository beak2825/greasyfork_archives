// ==UserScript==
// @name Roriwalrus Shout Tools
// @namespace roriwalrus.com
// @version 1.0.1
// @match https://www.roriwalrus.com/*
// @run-at document-idle
// @description Shoutbox helper: input + dropdown tags (U/I/B, marquee, links, images)
// @license GPL-3.0-or-later
// @uploadURL https://update.greasyfork.org/scripts/497559/Roriwalrus%20Shout%20Tools.meta.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/497559/Roriwalrus%20Shout%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/497559/Roriwalrus%20Shout%20Tools.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SHOUT_IMG_MAX = 360;
  const HELP_URL = "https://www.roriwalrus.com/index.php?threads/roriwalrus-shout-userscript.354/post-256475";

  /* ---------- helpers ---------- */

  function getShoutBox() {
    return document.querySelector('input[name="shout"].siropuShoutboxInput') ||
           document.querySelector('input[name="shout"]') ||
           null;
  }

  function findSiropuBlock(shoutEl) {
    return shoutEl.closest(".block.siropuShoutbox") ||
           shoutEl.closest(".siropuShoutbox") ||
           shoutEl.closest(".block") ||
           null;
  }

  function findInjectionPoint(blockEl) {
    // XenForo headers often have an “end/extra” container. Use it if present.
    const header = blockEl.querySelector(".block-header");
    if (!header) return blockEl;

    return header.querySelector(".block-header__end") ||
           header.querySelector(".block-header__extra") ||
           header;
  }

  function insertAtCursor(input, text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;

    const before = input.value.slice(0, start);
    const after = input.value.slice(end);

    input.value = before + text + after;

    const pos = before.length + text.length;
    input.focus();
    input.setSelectionRange(pos, pos);
  }

  function replaceSelection(input, text) {
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const before = input.value.slice(0, start);
    const after = input.value.slice(end);

    input.value = before + text + after;

    input.focus();
    input.setSelectionRange(start, start + text.length);
  }

  // INPUT > SELECTION > PLACEHOLDER
  function smartWrap(input, helperInput, open, close, placeholder = "  ") {
    const typed = (helperInput.value || "").trim();
    if (typed) {
      insertAtCursor(input, open + typed + close);
      return;
    }

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start !== end) {
      const sel = input.value.slice(start, end);
      replaceSelection(input, open + sel + close);
      return;
    }

    insertAtCursor(input, open + placeholder + close);

    const pos = input.selectionStart ?? input.value.length;
    const a = pos - close.length - placeholder.length;
    const b = pos - close.length;
    input.setSelectionRange(a, b);
  }

  function getInputUrl(helperInput) {
    let v = (helperInput.value || "").trim();
    if (!v) return "";
    if (/^www\./i.test(v)) v = "https://" + v;
    return v;
  }

  /* ---------- dropdown ---------- */

  function injectStyles() {
    if (document.getElementById("gm-shout-style")) return;

    const s = document.createElement("style");
    s.id = "gm-shout-style";
    s.textContent = `
      #gm-shout-tools{
        display:inline-flex;
        gap:6px;
        align-items:center;
        margin-left:8px;
        vertical-align:middle;
      }
      .gm-menu{
        position:fixed !important;
        z-index:999999 !important;
        background:#fff !important;
        color:#000 !important;
        border:1px solid rgba(0,0,0,.35) !important;
        border-radius:10px !important;
        box-shadow:0 10px 24px rgba(0,0,0,.22) !important;
        padding:6px !important;
        min-width:240px !important;
        font:14px/1.3 sans-serif !important;
      }
      .gm-menu button{
        display:block !important;
        width:100% !important;
        text-align:left !important;
        padding:8px 10px !important;
        border:0 !important;
        background:transparent !important;
        color:#000 !important;
        cursor:pointer !important;
        border-radius:8px !important;
      }
      .gm-menu button:hover{
        background:rgba(0,0,0,.06) !important;
      }
      #gm-helper{
        width:260px;
        text-align:left;
      }
    `;
    document.head.appendChild(s);
  }

  function createDropdown(anchor, items) {
    injectStyles();

    const menu = document.createElement("div");
    menu.className = "gm-menu";
    menu.hidden = true;

    for (const it of items) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = it.label;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.hidden = true;
        it.onClick();
      });
      menu.appendChild(b);
    }

    document.body.appendChild(menu);

    function place() {
      const r = anchor.getBoundingClientRect();
      const w = menu.offsetWidth || 240;
      const h = menu.offsetHeight || 220;

      const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      const top = Math.max(8, Math.min(r.bottom + 6, window.innerHeight - h - 8));

      menu.style.left = left + "px";
      menu.style.top = top + "px";
    }

    function open() {
      menu.hidden = false;
      requestAnimationFrame(place);
    }

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (menu.hidden) open();
      else menu.hidden = true;
    });

    document.addEventListener("click", () => (menu.hidden = true));
    window.addEventListener("scroll", () => { if (!menu.hidden) place(); }, { passive: true });
    window.addEventListener("resize", () => { if (!menu.hidden) place(); });

    return menu;
  }

  /* ---------- inject UI ---------- */

  function addToolsOnce() {
    const shout = getShoutBox();
    if (!shout) return false;

    const block = findSiropuBlock(shout);
    if (!block) return false;

    const injectInto = findInjectionPoint(block);
    if (!injectInto) return false;

    if (injectInto.querySelector("#gm-shout-tools")) return true;

    const wrap = document.createElement("span");
    wrap.id = "gm-shout-tools";

    const helper = document.createElement("input");
    helper.id = "gm-helper";
    helper.type = "text";
    helper.className = "input";
    helper.placeholder = "text or URL (optional)";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "button--iconOnly button--link button button--icon";
    btn.textContent = "Tags ▾";

    createDropdown(btn, [
      { label: "U", onClick: () => smartWrap(shout, helper, "[u]", "[/u]") },
      { label: "I",   onClick: () => smartWrap(shout, helper, "[i]", "[/i]") },
      { label: "B",      onClick: () => smartWrap(shout, helper, "[b]", "[/b]") },

      { label: "Marquee",        onClick: () => smartWrap(shout, helper, "[marquee]", "[/marquee]", "      ") },
      { label: "rev.Marquee", onClick: () => smartWrap(shout, helper, "[rightscroll]", "[/rightscroll]", "      ") },

      { label: "Link [url]", onClick: () => {
          const u = getInputUrl(helper);
          if (!u) return alert("Put a URL in the helper input.");
          insertAtCursor(shout, `[url]${u}[/url]`);
        }
      },

      { label: "Image (url)", onClick: () => {
          const u = getInputUrl(helper);
          if (!u) return alert("Put an image URL in the helper input.");
          insertAtCursor(shout, `[img width=${SHOUT_IMG_MAX}]${u}[/img]`);
        }
      },

      { label: "Help", onClick: () => {
        window.open(HELP_URL, "_blank", "noopener,noreferrer");
      }
      },



      { label: "Clear helper", onClick: () => { helper.value = ""; helper.focus(); } },
    ]);

    wrap.appendChild(helper);
    wrap.appendChild(btn);
        
    const spacer = document.createElement("span");
		spacer.innerHTML = "&nbsp;&nbsp;&nbsp;";
		injectInto.appendChild(spacer);
		injectInto.appendChild(wrap);
    
    return true;
  }

  function boot() {
    addToolsOnce();

    // Retry for late-loaded shoutbox
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (addToolsOnce() || tries > 60) clearInterval(t);
    }, 250);

    // Reinjection on XenForo redraws
    const obs = new MutationObserver(() => addToolsOnce());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  boot();
})();







