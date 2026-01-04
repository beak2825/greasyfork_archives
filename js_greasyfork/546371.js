// ==UserScript==
// @name         Zyxel Router: Bitwarden Autofill Fix
// @namespace    io.zyxel.autofill
// @version      1.0.2
// @description  Fixes Bitwarden autofill on Zyxel router login pages (EX7710-B0, EX5601-T0, and similar). 
//               Prevents the router UI from deleting the password field and ensures the correct value is submitted.
// @match        http://192.168.1.1/*
// @match        https://192.168.1.1/*
// @run-at       document-idle
// @noframes
// @grant        none
// @license      GPL-2.0-only; https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
// @downloadURL https://update.greasyfork.org/scripts/546371/Zyxel%20Router%3A%20Bitwarden%20Autofill%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/546371/Zyxel%20Router%3A%20Bitwarden%20Autofill%20Fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CSS selectors for important elements on Zyxel login page
  const SEL = {
    user: '#username',
    passCandidates: '#userpassword, .maskPassword, .unmaskPassword',
    passMask: '.maskPassword',
    passUnmask: '.unmaskPassword',
    eye: '#userpassword_maskCheck', // toggle mask/unmask checkbox
    loginBtn: '#loginBtn',
    form: 'form.form-login'
  };

  // Tracks latest captured username and password
  const state = { user: '', pw: '' };

  // Helper shortcuts
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const fire = (el, type, opts = {}) =>
    el && el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true, ...opts }));
  const keyup = (el) =>
    el && el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));

  // Sets element value and fires events so the page detects the change
  const setVal = (el, v) => {
    if (!el || el.value === v) return;
    el.value = v;
    fire(el, 'input');
    keyup(el);
    fire(el, 'change');
  };

  // Returns all candidate password fields currently in DOM
  const passInputs = () =>
    $$(SEL.passCandidates).filter((el) => el instanceof HTMLInputElement);

  // Makes sure the unmasked password field is active instead of masked
  const preferUnmasked = () => {
    const eye = $(SEL.eye);
    const m = $(SEL.passMask);
    const u = $(SEL.passUnmask);
    if (!eye || !m || !u) return;

    const maskedVisible = m.style.display !== 'none';
    const unmaskedVisible = u.style.display !== 'none';
    if (maskedVisible && !unmaskedVisible) eye.click(); // simulate clicking eye icon
  };

  // Capture value from username/password once and mark element to avoid duplicate binding
  const hookCaptureOnce = (el, isUser) => {
    if (!el || el.__zyCap) return;
    el.__zyCap = true;

    const update = () => {
      const v = el.value || '';
      if (!v) return;
      if (isUser) state.user = v; else state.pw = v;
    };

    el.addEventListener('input', update, true);
    el.addEventListener('change', update, true);
    update();
  };

  // Attach capture hooks to username and all password fields
  const wireCapture = () => {
    hookCaptureOnce($(SEL.user), true);
    passInputs().forEach((el) => hookCaptureOnce(el, false));
  };

  // Reapply captured values into fields (Bitwarden fix)
  const applyOnce = () => {
    const uEl = $(SEL.user);
    if (state.user && uEl) setVal(uEl, state.user);
    if (state.pw) passInputs().forEach((el) => setVal(el, state.pw));
  };

  // Ensure values are re-applied just before submit (button click, Enter key, or form submit)
  const installPreSubmit = () => {
    const pre = () => {
      preferUnmasked();
      applyOnce();
    };

    // Clicks on login button
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest && e.target.closest(SEL.loginBtn);
      if (btn) pre();
    }, true);
    document.addEventListener('mousedown', (e) => {
      const btn = e.target.closest && e.target.closest(SEL.loginBtn);
      if (btn) pre();
    }, true);

    // Pressing Enter on form
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if ($(SEL.form)) pre();
    }, true);

    // Submitting the form
    document.addEventListener('submit', (e) => {
      if (e.target.matches && e.target.matches(SEL.form)) pre();
    }, true);
  };

  // Continuously re-assert values against Zyxel's aggressive DOM rewrites
  const installGlobalCapture = () => {
    // Keeps applying values for a duration after an event
    const armKeepAlive = (() => {
      let rafId = null;
      let until = 0;
      const tick = () => {
        applyOnce();
        if (performance.now() < until) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      };
      return (ms) => {
        until = performance.now() + ms;
        if (!rafId) rafId = requestAnimationFrame(tick);
      };
    })();

    // Capture user typing into fields
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(SEL.user) && t.value) {
        state.user = t.value;
        armKeepAlive(5000);
      }
      if (t.matches(SEL.passCandidates) && t.value) {
        state.pw = t.value;
        armKeepAlive(5000);
      }
    }, true);

    // Capture change events too
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;
      if (t.matches(SEL.user) && t.value) state.user = t.value;
      if (t.matches(SEL.passCandidates) && t.value) state.pw = t.value;
    }, true);

    // Watch DOM mutations (Zyxel rebuilds inputs often)
    const mo = new MutationObserver(() => {
      preferUnmasked();
      wireCapture();
      if (state.user || state.pw) armKeepAlive(1500);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  };

  // Entry point: prepare fields and start listeners
  const init = () => {
    preferUnmasked();
    wireCapture();
    installGlobalCapture();
    installPreSubmit();
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
