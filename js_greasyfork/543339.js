// ==UserScript==
// @name         ChatGPT Power Continues
// @namespace    https://greasyfork.org/users/rafagale
// @version      1.0.0
// @description  Quick prompt helper for ChatGPT
// @author       hxreborn
// @icon         https://chat.openai.com/favicon.ico
// @run-at       document-idle
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     prompts https://raw.githubusercontent.com/hxreborn/chatgpt-power-continues/master/prompts/prompts.json
// @license      MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/543339/ChatGPT%20Power%20Continues.user.js
// @updateURL https://update.greasyfork.org/scripts/543339/ChatGPT%20Power%20Continues.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const INPUT_SEL = '#prompt-textarea, div[contenteditable="true"]';
  const SUBMIT_SEL = "#composer-submit-button";
  const FORM_SEL = 'form[data-type="unified-composer"]';
  let autosend = GM_getValue("cpc:autosend", "true") !== "false";

  GM_addStyle('.cpc-toolbar{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:800px;margin:0 auto .25rem auto;padding-inline:.7rem;box-sizing:border-box;gap:.5rem}.cpc-btn{border-radius:9999px;border:1px solid var(--token-border-medium,#d1d5db);background:var(--token-main-surface-primary,#fff);color:var(--token-text-primary,#111);font-size:.9rem;font-weight:400;padding:.18rem .8rem;transition:background-color .2s,color .2s}.cpc-btn:hover{background:var(--token-main-surface-secondary,rgba(0,0,0,.06))}@media(prefers-color-scheme:dark){.cpc-btn{background:var(--token-main-surface-primary,#23272f)!important;color:var(--token-text-primary,#fff)!important;border:1px solid var(--token-border-medium,#393a41)!important}.cpc-btn:hover{background:rgba(255,255,255,0.06)!important}}.cpc-toggle-label{display:flex;align-items:center;gap:.25rem;font-size:.8rem;color:var(--token-text-secondary,#6b7280);margin-left:1rem}.cpc-toggle{width:2rem;height:1.25rem;border-radius:9999px;border:1px solid var(--token-border-medium,#d1d5db);position:relative;display:inline-flex;align-items:center;cursor:pointer;background:var(--token-main-surface-primary,#fff);transition:background .2s}.cpc-knob{width:1rem;height:1rem;border-radius:9999px;background:var(--token-main-surface-primary,#fff);position:absolute;left:.125rem;transition:transform .15s}.cpc-toggle.on{background:var(--token-brand,#2563eb)}.cpc-toggle.on .cpc-knob{transform:translateX(.75rem)}.hide-scrollbar::-webkit-scrollbar{display:none}@media(max-width:580px){.cpc-toggle-label{display:none!important}}');

  const PROMPTS = (() => {
    try {
      const raw = GM_getResourceText("prompts");
      const parsed = JSON.parse(raw).prompts || [];
      return parsed;
    } catch (err) {
      console.warn("[CPC] Failed to load prompts", err);
      return [];
    }
  })();

  const buildToolbar = prompts => {
    const html =
      `<div class="cpc-toolbar">` +
      `<div class="flex items-center gap-2 hide-scrollbar" style="flex-shrink:0;">` +
      prompts.map(p =>
        `<button class="cpc-btn" data-value="${p.value}">${p.label}</button>`
      ).join("") +
      `</div><span style="flex:1"></span>` +
      `<span class="cpc-toggle-label" style="margin-left:auto;">Send on click<span class="cpc-toggle${autosend ? " on" : ""}" data-action="toggle-autosend"><span class="cpc-knob"></span></span></span></div>`;

    return document.createRange().createContextualFragment(html).firstChild;
  };

  const injectToolbar = prompts => {
    const inject = () => {
      if (document.querySelector(".cpc-toolbar")) return true;
      const form = document.querySelector(FORM_SEL) || document.querySelector(INPUT_SEL)?.closest("form");
      if (!form?.parentNode) return false;
      form.parentNode.insertBefore(buildToolbar(prompts), form);
      return true;
    };

    if (!inject()) {
      new MutationObserver(m => inject() && m.disconnect())
        .observe(document.body, { childList: true, subtree: true });
    }
  };

  const fillPrompt = (txt) => {
    const input = document.querySelector(INPUT_SEL);
    if (!input) return;
    if ("value" in input) input.value = txt;
    else input.textContent = txt;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    if (autosend) setTimeout(() => document.querySelector(SUBMIT_SEL)?.click(), 25);
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".cpc-btn");
    if (btn?.dataset.value) return fillPrompt(btn.dataset.value);
    const toggle = e.target.closest(".cpc-toggle");
    if (toggle?.dataset.action === "toggle-autosend") {
      autosend = !autosend;
      GM_setValue("cpc:autosend", autosend);
      toggle.classList.toggle("on", autosend);
    }
  });

  injectToolbar(PROMPTS);
})();
