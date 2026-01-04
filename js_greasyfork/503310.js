// ==UserScript==
// @name         FunPay — Ultra Modal: "Новое расширение!"
// @namespace    https://funpay.com/
// @version      9.0.0
// @description  Красивейшее всплывающее окно поверх страницы с ссылкой на новое расширение FunPay Tools. Закрывается кликом/ESC, можно "не показывать снова".
// @author       you
// @match        https://funpay.com/*
// @match        https://*.funpay.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503310/FunPay%20%E2%80%94%20Ultra%20Modal%3A%20%22%D0%9D%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D0%B5%21%22.user.js
// @updateURL https://update.greasyfork.org/scripts/503310/FunPay%20%E2%80%94%20Ultra%20Modal%3A%20%22%D0%9D%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D0%B5%21%22.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- SETTINGS ----------
  const STORE_URL = "https://chromewebstore.google.com/detail/funpay-tools/pibmnjjfpojnakckilflcboodkndkibb/";
  const STORAGE_KEY = "fpt_ultra_modal_dismissed";
  const REMIND_AFTER_DAYS = 7; // спустя сколько дней снова показать, если было "Не показывать"
  const HOTKEY = { altKey: true, key: "f" }; // Alt+F — снова открыть модалку вручную

  // Показать снова, если прошло N дней
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { ts } = JSON.parse(raw);
      const days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
      if (days < REMIND_AFTER_DAYS) return;
    }
  } catch (_) {}

  // Дождаться готовности body
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // ----------- MAIN ------------
  function init() {
    // Shadow DOM, чтобы стили ни с чем не конфликтовали
    const host = document.createElement("div");
    host.style.all = "initial";
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.zIndex = "999999999"; // поверх всего
    host.style.pointerEvents = "none"; // пока не вставим слои
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    // Backdrop + контейнер
    const wrapper = document.createElement("div");
    wrapper.className = "fp-wrapper";
    wrapper.innerHTML = `
      <div class="fp-backdrop"></div>
      <div class="fp-center">
        <div class="fp-card">
          <button class="fp-close" aria-label="Закрыть">✕</button>

          <div class="fp-badge">
            <span class="fp-pulse"></span>
            <span class="fp-badge-text">Новинка</span>
          </div>

          <div class="fp-title">
            Внимание! Вышло <span class="grad">новое расширение</span>
          </div>

          <div class="fp-subtitle">
            Ваш старый юзерскрипт — <em>древняя хуйня</em> и уже устарел.
            Переходите на <strong>FunPay Tools</strong> — быстрее, удобнее, красивее.
          </div>

          <div class="fp-feats">
            <div class="feat">
              <div class="dot"></div>
              Свежие фичи
            </div>
            <div class="feat">
              <div class="dot"></div>
              Ноль танцев с бубном
            </div>
            <div class="feat">
              <div class="dot"></div>
              Поддержка и стабильность
            </div>
          </div>

          <div class="fp-actions">
            <a class="fp-primary" href="${STORE_URL}" target="_blank" rel="noopener">
              Установить FunPay Tools
            </a>
            <button class="fp-ghost" data-close>Позже</button>
          </div>

          <label class="fp-checkbox">
            <input type="checkbox" class="fp-nomore" />
            Не показывать снова
          </label>
        </div>
      </div>
    `;
    shadow.appendChild(style());
    shadow.appendChild(wrapper);

    // Включаем клики
    host.style.pointerEvents = "auto";

    // Закрытия
    const closeModal = () => {
      wrapper.classList.add("fp-hide");
      setTimeout(() => host.remove(), 220);
      // запомнить, если включен чекбокс
      const noMore = shadow.querySelector(".fp-nomore");
      if (noMore && noMore.checked) {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ts: Date.now() })
          );
        } catch (_) {}
      }
      // убрать обработчик хоткея
      window.removeEventListener("keydown", onKey);
    };

    const onKey = (e) => {
      // ESC закрыть
      if (e.key === "Escape") closeModal();
      // Alt+F — снова открыть (работает до закрытия)
      if (
        e.key.toLowerCase() === HOTKEY.key &&
        !!e.altKey === HOTKEY.altKey
      ) {
        // Ничего: модал уже открыт. Подсветим кнопку.
        const primary = shadow.querySelector(".fp-primary");
        if (primary) {
          primary.classList.add("fp-wiggle");
          setTimeout(() => primary.classList.remove("fp-wiggle"), 600);
        }
      }
    };

    shadow.querySelector(".fp-backdrop")?.addEventListener("click", closeModal);
    shadow.querySelector(".fp-close")?.addEventListener("click", closeModal);
    shadow.querySelector("[data-close]")?.addEventListener("click", closeModal);
    window.addEventListener("keydown", onKey, false);

    // Лёгкий вход-анимация
    requestAnimationFrame(() => wrapper.classList.add("fp-show"));
  }

  // ---------- STYLES ----------
  function style() {
    const el = document.createElement("style");
    el.textContent = `
      @keyframes fpFadeIn {
        from { opacity: 0 } to { opacity: 1 }
      }
      @keyframes fpPop {
        0% { transform: translateY(6px) scale(.96); opacity: 0 }
        100% { transform: translateY(0) scale(1); opacity: 1 }
      }
      @keyframes fpGlow {
        0% { filter: drop-shadow(0 0 0px rgba(255,255,255,.0)); }
        100% { filter: drop-shadow(0 0 18px rgba(255,255,255,.35)); }
      }
      @keyframes fpPulse {
        0% { transform: scale(1); opacity: .9 }
        50% { transform: scale(1.18); opacity: .5 }
        100% { transform: scale(1); opacity: .9 }
      }
      @keyframes fpWiggle {
        0%,100%{ transform: translateX(0) }
        25%{ transform: translateX(-4px) }
        75%{ transform: translateX(4px) }
      }

      :host, .fp-wrapper { all: initial; }

      .fp-wrapper {
        position: fixed; inset: 0;
        display: grid; place-items: center;
        opacity: 0; transition: opacity .2s ease;
      }
      .fp-wrapper.fp-show { opacity: 1; animation: fpFadeIn .2s ease both; }
      .fp-wrapper.fp-hide { opacity: 0; }

      .fp-backdrop {
        position: absolute; inset: 0;
        background: radial-gradient(80vmax 80vmax at center, rgba(24,24,27,.65), rgba(0,0,0,.55) 60%, rgba(0,0,0,.75));
        backdrop-filter: blur(8px) saturate(120%);
      }

      .fp-center {
        position: relative; width: min(92vw, 720px); padding: 24px;
      }

      .fp-card {
        position: relative;
        border-radius: 24px;
        padding: 28px clamp(20px, 4vw, 36px);
        background:
          linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.05)),
          radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,.08), transparent 40%),
          rgba(24,24,27,.72);
        color: #fff;
        box-shadow:
          0 20px 40px rgba(0,0,0,.45),
          inset 0 0 0 1px rgba(255,255,255,.08);
        backdrop-filter: blur(16px) saturate(140%);
        animation: fpPop .25s ease both, fpGlow 1.2s ease .2s both;
        overflow: clip;
      }

      /* Неоновая граница */
      .fp-card::before {
        content: "";
        position: absolute; inset: -1px;
        border-radius: 26px;
        padding: 1px;
        background: linear-gradient(135deg,
          #a78bfa, #60a5fa 20%, #34d399 40%, #f59e0b 60%, #f472b6 80%, #a78bfa);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        pointer-events: none;
        filter: blur(.4px) saturate(140%);
      }

      .fp-close {
        position: absolute; top: 10px; right: 10px;
        width: 36px; height: 36px; border-radius: 10px;
        border: none; cursor: pointer;
        font-size: 18px; line-height: 1;
        background: rgba(255,255,255,.08);
        color: #fff;
        transition: transform .15s ease, background .2s ease, opacity .2s ease;
      }
      .fp-close:hover { transform: scale(1.06); background: rgba(255,255,255,.14); }
      .fp-close:active { transform: scale(.98); opacity: .9; }

      .fp-badge {
        position: relative;
        display: inline-flex; align-items: center; gap: 10px;
        margin-bottom: 12px; padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255,255,255,.08);
        border: 1px solid rgba(255,255,255,.14);
      }
      .fp-pulse {
        width: 10px; height: 10px; border-radius: 999px;
        background: #34d399;
        box-shadow: 0 0 16px #34d399;
        animation: fpPulse 1.6s ease-in-out infinite;
      }
      .fp-badge-text { font-weight: 600; letter-spacing: .3px; }

      .fp-title {
        font-size: clamp(24px, 3.4vw, 36px);
        font-weight: 800;
        line-height: 1.15;
        margin-bottom: 10px;
        letter-spacing: .2px;
      }

      .grad {
        background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399, #f472b6);
        -webkit-background-clip: text; background-clip: text;
        color: transparent;
      }

      .fp-subtitle {
        opacity: .95;
        font-size: clamp(14px, 2vw, 16px);
        line-height: 1.6;
        margin-bottom: 18px;
      }
      .fp-subtitle em { font-style: normal; opacity: .9; text-decoration: underline wavy rgba(255,255,255,.35); }
      .fp-subtitle strong { font-weight: 800; }

      .fp-feats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin: 14px 0 22px;
      }
      @media (min-width: 520px) {
        .fp-feats { grid-template-columns: 1fr 1fr 1fr; }
      }
      .feat {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; border-radius: 12px;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.1);
        white-space: nowrap;
        text-overflow: ellipsis; overflow: hidden;
      }
      .feat .dot {
        width: 8px; height: 8px; border-radius: 999px;
        background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,.9);
      }

      .fp-actions {
        display: flex; gap: 10px; flex-wrap: wrap;
        align-items: center; margin-bottom: 10px;
      }

      .fp-primary, .fp-ghost {
        appearance: none; border: none; cursor: pointer;
        padding: 12px 16px; border-radius: 14px;
        font-weight: 700; text-decoration: none;
        transition: transform .12s ease, box-shadow .2s ease, background .2s ease, opacity .2s ease;
        will-change: transform;
      }
      .fp-primary {
        background: linear-gradient(135deg, #6366f1, #22c55e);
        color: #fff;
        box-shadow: 0 12px 22px rgba(34,197,94,.25), 0 6px 12px rgba(99,102,241,.25);
      }
      .fp-primary:hover { transform: translateY(-1px); }
      .fp-primary:active { transform: translateY(0); opacity: .92; }
      .fp-primary.fp-wiggle { animation: fpWiggle .6s ease both; }

      .fp-ghost {
        background: rgba(255,255,255,.08); color: #fff;
        border: 1px solid rgba(255,255,255,.14);
      }
      .fp-ghost:hover { background: rgba(255,255,255,.12); transform: translateY(-1px); }
      .fp-ghost:active { transform: translateY(0); opacity: .95; }

      .fp-checkbox {
        display: inline-flex; align-items: center; gap: 8px;
        opacity: .85; user-select: none; cursor: pointer;
      }
      .fp-checkbox input {
        width: 16px; height: 16px; accent-color: #22c55e; cursor: pointer;
      }
    `;
    return el;
  }
})();
