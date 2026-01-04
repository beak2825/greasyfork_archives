// ==UserScript==
// @name         Perplexity
// @description  Free Max
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       AntiKeks
// @license      MIT
// @match        https://*.perplexity.ai/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542565/Perplexity.user.js
// @updateURL https://update.greasyfork.org/scripts/542565/Perplexity.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ─────────────────────────── ЛОГИРОВАНИЕ ─────────────────────────── */
  const DEBUG = false;
  const log = (...args) => DEBUG && console.log('[MAX-FINAL]', ...args);
  log('инициализация завершена');

  /* ───────────────────────── ДРОССЕЛИРОВАНИЕ UI ────────────────────── */
  const COOLDOWN = 300;              // минимальный интервал между «пинками» React (мс)
  let lastUpdate = 0;

  function forceReactUpdate() {
    const now = Date.now();
    if (now - lastUpdate < COOLDOWN) return;   // вызываем не чаще, чем раз в COOLDOWN
    lastUpdate = now;

    requestAnimationFrame(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('resize'));
      log('отправлены события visibilitychange/resize для обновления UI');
    });
  }

  /* ──────────────────────── ПАТЧ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ───────────────── */
  function patchDataRecursively(obj) {
    if (!obj || typeof obj !== 'object' || obj.$$typeof) return false;

    let changed = false;

    // рекурсивно проходим по объекту
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'object') {
        if (patchDataRecursively(obj[key])) changed = true;
      }
    }

    // целевые поля тарифа
    ['subscription_tier', 'payment_tier', 'user_tier'].forEach(field => {
      if (obj[field] !== undefined && obj[field] !== 'max') {
        obj[field] = 'max';
        changed = true;
        log(`JSON.${field} → max`);
      }
    });

    if (obj.hasOwnProperty('is_pro')) {
      if (obj.is_pro !== false) changed = true;
      obj.is_pro = false;
      obj.is_max = true;
    }

    if (obj.hasOwnProperty('subscription_source') && obj.subscription_source !== 'stripe') {
      obj.subscription_source = 'stripe';
      changed = true;
    }

    if (obj.features && typeof obj.features === 'object') {
      const featuresToEnable = {
        max_models: true,
        o3_pro_access: true,
        claude_opus_access: true,
        all_models: true,
        unlimited_searches: true,
        unlimited_focuses: true,
        copilot_access: true
      };
      for (const f in featuresToEnable) {
        if (obj.features[f] !== true) {
          obj.features[f] = true;
          changed = true;
        }
      }
    }

    return changed;
  }

  /* ──────────────── ПЕРЕХВАТ ГЛОБАЛЬНОГО JSON.parse ───────────────── */
  const originalParse = JSON.parse;
  JSON.parse = function (text, reviver) {
    const data = originalParse.call(this, text, reviver);

    if (patchDataRecursively(data)) {
      log('JSON-объект преобразован в Max');
      forceReactUpdate();
    }
    return data;
  };

  /* ──────────────────────────── ПЕРЕХВАТ fetch ─────────────────────── */
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const response = await originalFetch(input, init);

    try {
      // проверяем, что ответ действительно JSON
      const ct = response.headers.get('content-type') || '';
      if (!ct.startsWith('application/json')) return response;

      const cloned = response.clone();
      const json = await cloned.json();

      if (patchDataRecursively(json)) {
        log(`ответ модифицирован ← ${input.url || input}`);
        forceReactUpdate();
        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
    } catch (e) {
      /* не JSON — игнорируем */
    }
    return response;
  };
})();
