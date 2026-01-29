// ==UserScript==
// @name               Github Time Format Converter
// @name:zh-CN         Github 时间格式转换
// @name:zh-TW         Github 時間格式轉換
// @description        Convert relative times on GitHub to absolute date and time
// @description:zh-CN  将 GitHub 页面上的相对时间转换为绝对日期和时间
// @description:zh-TW  將 GitHub 頁面上的相對時間轉換成絕對日期與時間
// @version            1.3.1
// @icon               https://raw.githubusercontent.com/MiPoNianYou/UserScripts/main/Icons/Github-Time-Format-Converter-Icon.svg
// @author             念柚
// @namespace          https://github.com/MiPoNianYou/UserScripts
// @supportURL         https://github.com/MiPoNianYou/UserScripts/issues
// @license            AGPL-3.0
// @match              https://github.com/*
// @exclude            https://github.com/topics/*
// @grant              GM_addStyle
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/533903/Github%20Time%20Format%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/533903/Github%20Time%20Format%20Converter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    SETTINGS: {
      TOOLTIP_OFFSET: 5,
      EDGE_MARGIN: 5,
      TRANSITION_MS: 100,
      FONT_STACK: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      FONT_MONO: "ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    IDS: {
      TOOLTIP: "TimeConverterTooltipContainer",
    },
    CLASSES: {
      PROCESSED: "time-converter-processed",
      VISIBLE: "time-converter-visible",
      NO_TRANSLATE: "notranslate",
    },
    SELECTORS: {
      RELATIVE_TIME: "relative-time:not(.time-converter-processed)",
      PROCESSED_SPAN: "span.time-converter-processed[data-tooltip-time]",
    },
    I18N: {
      "zh-CN": { INVALID: "无效日期" },
      "zh-TW": { INVALID: "無效日期" },
      "en-US": { INVALID: "Invalid Date" },
    },
  };

  const state = {
    locale: "en-US",
    formatters: { date: null, time: null },
    tooltip: null,

    init() {
      this.locale = this.detectLocale();
      this.createFormatters();
    },

    detectLocale() {
      const langs = navigator.languages || [navigator.language];
      for (const lang of langs) {
        const lower = lang.toLowerCase();
        if (lower === "zh-cn" || lower.startsWith("zh-hans")) return "zh-CN";
        if (lower.match(/^zh-(tw|hk|mo|hant)/)) return "zh-TW";
        if (lower.startsWith("zh")) return "zh-CN";
        if (lower.startsWith("en")) return "en-US";
      }
      return "en-US";
    },

    createFormatters() {
      try {
        this.formatters.date = new Intl.DateTimeFormat(this.locale, {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        });
        this.formatters.time = new Intl.DateTimeFormat(this.locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      } catch {
        this.formatters = { date: null, time: null };
      }
    },

    getText(key) {
      return (
        CONFIG.I18N[this.locale]?.[key] ?? CONFIG.I18N["en-US"][key] ?? key
      );
    },
  };

  const ui = {
    injectStyles() {
      const { TRANSITION_MS, FONT_MONO } = CONFIG.SETTINGS;
      const { TOOLTIP } = CONFIG.IDS;
      const { PROCESSED, VISIBLE } = CONFIG.CLASSES;

      GM_addStyle(`
        :root {
          --tooltip-bg-dark: rgba(41, 44, 60, 0.92);
          --tooltip-text-dark: rgb(198, 208, 245);
          --tooltip-border-dark: rgba(98, 104, 128, 0.25);
          --tooltip-shadow-dark: 0 1px 3px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.2);

          --tooltip-bg-light: rgba(230, 233, 239, 0.92);
          --tooltip-text-light: rgb(76, 79, 105);
          --tooltip-border-light: rgba(172, 176, 190, 0.3);
          --tooltip-shadow-light: 0 1px 3px rgba(90,90,90,0.08), 0 5px 10px rgba(90,90,90,0.12);
        }

        #${TOOLTIP} {
          position: fixed;
          padding: 6px 10px;
          border-radius: 8px;
          font: 12px/1.4 ${FONT_MONO};
          z-index: 2147483647;
          pointer-events: none;
          white-space: pre;
          max-width: 350px;
          opacity: 0;
          visibility: hidden;
          backdrop-filter: blur(10px) saturate(180%);
          transition: opacity ${TRANSITION_MS}ms cubic-bezier(0,0,0.58,1),
                      visibility ${TRANSITION_MS}ms cubic-bezier(0,0,0.58,1);
          background: var(--tooltip-bg-dark);
          color: var(--tooltip-text-dark);
          border: 1px solid var(--tooltip-border-dark);
          box-shadow: var(--tooltip-shadow-dark);
        }

        #${TOOLTIP}.${VISIBLE} {
          opacity: 1;
          visibility: visible;
        }

        .${PROCESSED}[data-tooltip-time] {
          display: inline-block;
          font-family: ${FONT_MONO};
          cursor: help;
        }

        @media (prefers-color-scheme: light) {
          #${TOOLTIP} {
            background: var(--tooltip-bg-light);
            color: var(--tooltip-text-light);
            border-color: var(--tooltip-border-light);
            box-shadow: var(--tooltip-shadow-light);
          }
        }
      `);
    },

    createTooltip() {
      if (state.tooltip) return state.tooltip;

      const tooltip = document.createElement("div");
      tooltip.id = CONFIG.IDS.TOOLTIP;
      tooltip.setAttribute("role", "tooltip");
      tooltip.setAttribute("aria-hidden", "true");
      tooltip.setAttribute("translate", "no");
      tooltip.classList.add(CONFIG.CLASSES.NO_TRANSLATE);

      document.body?.appendChild(tooltip);
      state.tooltip = tooltip;
      return tooltip;
    },

    showTooltip(target) {
      const time = target.dataset.tooltipTime;
      if (!time) return;

      const tooltip = this.createTooltip();
      tooltip.textContent = time;
      tooltip.setAttribute("aria-hidden", "false");
      tooltip.classList.add(CONFIG.CLASSES.VISIBLE);

      requestAnimationFrame(() => this.positionTooltip(target, tooltip));
    },

    positionTooltip(target, tooltip) {
      if (!target.isConnected) {
        this.hideTooltip();
        return;
      }

      const rect = target.getBoundingClientRect();
      const { TOOLTIP_OFFSET: offset, EDGE_MARGIN: margin } = CONFIG.SETTINGS;
      const { offsetWidth: w, offsetHeight: h } = tooltip;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = rect.left + rect.width / 2 - w / 2;
      left = Math.max(margin, Math.min(vw - w - margin, left));

      const spaceAbove = rect.top - offset;
      const spaceBelow = vh - rect.bottom - offset;
      let top;

      if (spaceAbove >= h + margin) {
        top = rect.top - h - offset;
      } else if (spaceBelow >= h + margin) {
        top = rect.bottom + offset;
      } else {
        top =
          spaceAbove > spaceBelow
            ? Math.max(margin, rect.top - h - offset)
            : Math.min(vh - h - margin, rect.bottom + offset);
      }

      Object.assign(tooltip.style, {
        left: `${left}px`,
        top: `${top}px`,
        visibility: "visible",
      });
    },

    hideTooltip() {
      state.tooltip?.classList.remove(CONFIG.CLASSES.VISIBLE);
      state.tooltip?.setAttribute("aria-hidden", "true");
    },
  };

  const converter = {
    format(dateStr, type) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return state.getText("INVALID");

      const formatter = state.formatters[type];
      if (formatter) {
        return formatter.format(date).replace(/\//g, "-");
      }

      const pad = (n) => String(n).padStart(2, "0");
      if (type === "date") {
        const y = String(date.getFullYear()).slice(-2);
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        return `${y}-${m}-${d}`;
      }
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    },

    convertElement(el) {
      if (
        !(el instanceof Element) ||
        el.classList.contains(CONFIG.CLASSES.PROCESSED)
      ) {
        return;
      }

      const datetime = el.getAttribute("datetime");
      if (!datetime) {
        el.classList.add(CONFIG.CLASSES.PROCESSED);
        return;
      }

      const dateText = this.format(datetime, "date");
      const timeText = this.format(datetime, "time");
      const invalid = state.getText("INVALID");

      if (dateText === invalid || timeText === invalid) {
        el.classList.add(CONFIG.CLASSES.PROCESSED);
        return;
      }

      const span = document.createElement("span");
      span.textContent = dateText;
      span.dataset.tooltipTime = timeText;
      span.classList.add(CONFIG.CLASSES.PROCESSED);
      span.classList.add(CONFIG.CLASSES.NO_TRANSLATE);
      span.setAttribute("translate", "no");

      el.parentNode?.replaceChild(span, el);
    },

    processAll(root = document.body) {
      root
        ?.querySelectorAll(CONFIG.SELECTORS.RELATIVE_TIME)
        .forEach((el) => this.convertElement(el));
    },
  };

  const events = {
    init() {
      this.setupTooltipEvents();
      this.setupObserver();
    },

    setupTooltipEvents() {
      const selector = CONFIG.SELECTORS.PROCESSED_SPAN;

      document.body.addEventListener("mouseover", (e) => {
        const target = e.target.closest(selector);
        if (target) ui.showTooltip(target);
      });

      document.body.addEventListener("mouseout", (e) => {
        const target = e.target.closest(selector);
        if (target && !e.relatedTarget?.closest?.(`#${CONFIG.IDS.TOOLTIP}`)) {
          ui.hideTooltip();
        }
      });

      document.body.addEventListener(
        "focusin",
        (e) => {
          const target = e.target.closest(selector);
          if (target) ui.showTooltip(target);
        },
        true
      );

      document.body.addEventListener(
        "focusout",
        (e) => {
          const target = e.target.closest(selector);
          if (target) ui.hideTooltip();
        },
        true
      );
    },

    setupObserver() {
      const selector = CONFIG.SELECTORS.RELATIVE_TIME;
      const observer = new MutationObserver((mutations) => {
        const elements = new Set();

        for (const { addedNodes } of mutations) {
          for (const node of addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;

            if (node.matches?.(selector)) {
              elements.add(node);
            } else {
              node
                .querySelectorAll?.(selector)
                .forEach((el) => elements.add(el));
            }
          }
        }

        elements.forEach((el) => converter.convertElement(el));
      });

      observer.observe(document.body, { childList: true, subtree: true });
    },
  };

  function init() {
    state.init();
    ui.injectStyles();
    converter.processAll();
    events.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();