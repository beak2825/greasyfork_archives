// ==UserScript==
// @name         CIA Contact Form Autofill
// @namespace    https://www.cia.gov/
// @version      1.0.0
// @description  CIA Contact Modal 자동 열기 + Online Form 자동 선택 + 입력 필드 자동채우기
// @match        https://www.cia.gov/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546527/CIA%20Contact%20Form%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/546527/CIA%20Contact%20Form%20Autofill.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 🔧 사용자 정보
  const PROFILE = {
    email:     'YourMail@gmail.com',
    sender:    'YourName',
    ph_cc:     '+82',
    phone_num: '1012345678',
    mobilecc:  '+82',
    mobilenum: '1012345678'
  };

  console.log('💡 CIA Autofill v1.9.5 (DOM-ready)');

  function setReactValue(el, value) {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function fillFieldsOnly() {
    console.log('💡 Filling fields (message omitted)…');
    Object.entries(PROFILE).forEach(([name, val]) => {
      const el = document.querySelector(`[name="${name}"]`) || document.getElementById(name);
      if (el) {
        setReactValue(el, val);
        console.log(`  • ${name} → ${val}`);
      }
    });
  }

  function openContactModal() {
    const btn = Array.from(document.querySelectorAll('button, a'))
      .find(el => /contact cia/i.test(el.textContent));
    if (btn) {
      console.log('💡 Opening Contact CIA modal');
      btn.click();
    } else {
      console.warn('❌ Modal button not found');
    }
  }

  function startObserver() {
    const obs = new MutationObserver((mutations, observer) => {
      const tabs = document.querySelectorAll('li.contact-us-modal__tab');
      if (tabs.length) {
        const online = Array.from(tabs).find(el => el.textContent.trim() === 'Online Form');
        if (online) {
          console.log('💡 Found Online Form tab, clicking…');
          online.click();

          setTimeout(() => {
            if (document.querySelector('[name="email"]')) {
              fillFieldsOnly();
              observer.disconnect();
            }
          }, 300);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function runScript() {
    openContactModal();
    startObserver();
  }

  // ✅ DOM 준비 상태에 따라 즉시 실행 or 대기
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runScript();
  } else {
    document.addEventListener('DOMContentLoaded', runScript);
  }
})();
