// ==UserScript==
// @name         Yandex (by/ya): автозакрытие баннера установки браузера
// @author       sailars
// @version      1.2
// @description  Разблокирует страницу ya.ru и yandex.by, и фокусирует строку поиска.
// @description:en  Closes the Yandex browser install splash on yandex.by/ya.ru and re-enables the page (focuses search).
// @match        https://yandex.by/*
// @match        https://www.yandex.by/*
// @match        https://ya.ru/*
// @name:en      Yandex (by/ya): auto-close browser install splash
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1508445
// @downloadURL https://update.greasyfork.org/scripts/547132/Yandex%20%28byya%29%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0%20%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B8%20%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/547132/Yandex%20%28byya%29%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0%20%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B8%20%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const host = location.hostname;
  const isBY = /(?:^|\.)yandex\.by$/.test(host);
  const isYA = /(?:^|\.)ya\.ru$/.test(host);

  let handled = false;
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();

  function unlockBody() {
    const b = document.body;
    if (!b) return;
    b.style.overflow = '';
    b.style.position = '';
    b.style.pointerEvents = '';
    b.classList.remove('no-scroll','Body_lock','_locked','lock','is-locked','modal-open');

    // поле поиска оставляем НЕактивным
    const input = document.querySelector('input[name="text"], input[type="search"]');
    if (input) {
      input.removeAttribute('disabled');
      if (document.activeElement === input) input.blur();
    }
  }

  function findBYBanner() {
    const content = document.querySelector('.Distribution-SplashScreenModalContent');
    if (!content) return null;
    const wrapper = content.closest('.Modal-Wrapper') || content.closest('[role="dialog"]') || content;
    const parent = wrapper?.parentElement;
    let overlay = null;
    if (parent) {
      try { overlay = parent.querySelector(':scope > .Modal-Overlay'); }
      catch { overlay = parent.querySelector('.Modal-Overlay'); }
    }
    return { content, wrapper, overlay };
  }

  function closeBY() {
    const banner = findBYBanner();
    if (!banner) return false;

    const closeBtn =
      banner.content.querySelector('button.Distribution-ButtonClose') ||
      banner.content.querySelector('button.SplashscreenDefault-DeclineButton') ||
      banner.content.querySelector('button[title*="Нет"][title*="спасибо" i]');

    if (closeBtn) closeBtn.click();
    else { banner.wrapper?.remove(); banner.overlay?.remove(); }

    unlockBody();
    return true;
  }

  function closeYA() {
    const btn = Array.from(document.querySelectorAll('button, [role="button"], a')).find(el =>
      /нет,?\s*спасибо/i.test(norm(el.textContent || el.getAttribute('aria-label') || el.title || ''))
    );
    if (btn) { btn.click(); unlockBody(); return true; }

    const dlg = Array.from(document.querySelectorAll('[role="dialog"]')).find(d =>
      /установ(ить|ка).+яндекс.? ?браузер/i.test(norm(d.textContent || ''))
    );
    if (dlg) {
      const wrapper = dlg.closest('.Modal-Wrapper') || dlg;
      const parent = wrapper?.parentElement;
      let overlay = null;
      if (parent) {
        try { overlay = parent.querySelector(':scope > .Modal-Overlay'); }
        catch { overlay = parent.querySelector('.Modal-Overlay'); }
      }
      wrapper?.remove();
      overlay?.remove();
      unlockBody();
      return true;
    }
    return false;
  }

  function tryHandle() {
    if (handled) return;
    const ok = (isBY && closeBY()) || (isYA && closeYA());
    if (ok) handled = true;
  }

  const mo = new MutationObserver(() => tryHandle());

  function start() {
    tryHandle();
    mo.observe(document.documentElement || document, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

