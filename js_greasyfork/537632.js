// ==UserScript==
// @name         Yandex SERP: Promo
// @namespace    https://github.com/xxrxtnxxov
// @version      5.1.1
// @description  Добавляет стилизованный бейдж «ПРОМО» и «РЕКЛАМА» к рекламным блокам Яндекса в разделах: «Поиск», «Финансы» и «Квартиры».
// @author       xxrxtnxxov
// @homepageURL  https://github.com/xxrxtnxxov/ya-promo-serp
// @supportURL   https://github.com/xxrxtnxxov/ya-promo-serp/issues
// @icon         https://raw.githubusercontent.com/xxrxtnxxov/ya-promo-serp/main/ya.png
// @match        https://yandex.ru/search*
// @match        https://yandex.ru/realty*
// @match        https://yandex.ru/finance*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537632/Yandex%20SERP%3A%20Promo.user.js
// @updateURL https://update.greasyfork.org/scripts/537632/Yandex%20SERP%3A%20Promo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .promo-title-label, .realty-ad-label {
      display: inline-block;
      margin-right: 6px;
      padding: 1px 4px;
      background-color: #DC143C;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
      border-radius: 1px;
      vertical-align: middle;
      pointer-events: none;
    }
    li[data-fast] { position: relative; }
    .promo-card { /* marker for search promos */ }
    .promo-toggle-btn {
      display: inline-block;
      margin-left: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: bold;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      vertical-align: middle;
    }
    .promo-toggle-btn.hide { background-color: #DC143C; color: #fff; }
    .promo-toggle-btn.show { background-color: #aaa; color: #fff; }
  `;
  document.head.appendChild(style);

  let promoVisible = true;

  // === ПОИСК ===

  function markPromoInSearch(card) {
    if (card.classList.contains('promo-card')) return;
    const title = card.querySelector('span.OrganicTitleContentSpan');
    if (!title) return;
    const isPromo = !!card.querySelector('.PromoOffer, [data-fast-name="PromoOffer"]')
      || Array.from(card.querySelectorAll('span')).some(s => s.textContent.trim() === 'Промо');
    if (!isPromo) return;
    const badge = document.createElement('span');
    badge.className = 'promo-title-label';
    badge.textContent = 'ПРОМО';
    title.prepend(badge);
    card.classList.add('promo-card');
    card.style.display = promoVisible ? '' : 'none';
  }

  function processSearch() {
    const container = document.querySelector('[data-bem="serp-list"]') || document.body;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          markPromoInSearch(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 200px 0px' });

    function observeCards(cards) {
      cards.forEach(card => {
        if (!card.classList.contains('promo-card')) {
          observer.observe(card);
        }
      });
    }

    function handleNewNodes(nodes) {
      nodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('li[data-fast]')) {
          observer.observe(node);
        }
      });
    }

    const initialCards = container.querySelectorAll('li[data-fast]');
    observeCards(initialCards);

    new MutationObserver(muts => {
      muts.forEach(({ addedNodes }) => handleNewNodes(addedNodes));
    }).observe(container, { childList: true, subtree: true });

    insertToggleButton();
    new MutationObserver(insertToggleButton).observe(document.body, { childList: true, subtree: true });
  }

  function togglePromoEntries() {
    document.querySelectorAll('li.promo-card').forEach(card => {
      card.style.display = promoVisible ? 'none' : '';
    });
    promoVisible = !promoVisible;
    updateToggleButton();
  }

  function updateToggleButton() {
    const btn = document.querySelector('nav.HeaderNav.HeaderDesktop-Navigation .promo-toggle-btn');
    if (!btn) return;
    if (promoVisible) {
      btn.textContent = 'УБРАТЬ ПРОМО';
      btn.className = 'promo-toggle-btn hide';
    } else {
      btn.textContent = 'ПОКАЗАТЬ ПРОМО';
      btn.className = 'promo-toggle-btn show';
    }
  }

  function insertToggleButton() {
    const nav = document.querySelector('nav.HeaderNav.HeaderDesktop-Navigation');
    if (!nav || nav.querySelector('.promo-toggle-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'promo-toggle-btn hide';
    btn.textContent = 'УБРАТЬ ПРОМО';
    btn.addEventListener('click', togglePromoEntries);
    nav.appendChild(btn);
  }

  // === КВАРТИРЫ ===

  function markAdInRealty(el) {
    if (el.querySelector('.realty-ad-label')) return;
    if (!/^\s*Реклама\s*$/.test(el.textContent)) return;
    const target = el.closest('h3, .OfferSnippet-Header') || el;
    const badge = document.createElement('span');
    badge.className = 'realty-ad-label';
    badge.textContent = 'РЕКЛАМА';
    target.prepend(badge);
  }

  function processRealty() {
    const container = document.querySelector('.OffersSerpContainer') || document.body;

    function scanElements(root) {
      root.querySelectorAll('div, span').forEach(el => {
        if (!el.querySelector('.realty-ad-label')) {
          markAdInRealty(el);
        }
      });
    }

    scanElements(container);

    new MutationObserver(muts => {
      muts.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            scanElements(node);
          }
        });
      });
    }).observe(container, { childList: true, subtree: true });
  }

  // === ФИНАНСЫ ===

  function replaceFinancePromo() {
    document.querySelectorAll('span.AdvLabel-Text').forEach(span => {
      if (span.textContent.trim() === 'Промо') {
        const badge = document.createElement('span');
        badge.className = 'promo-title-label';
        badge.textContent = 'ПРОМО';
        span.replaceWith(badge);
      }
    });
  }

  function processFinance() {
    const container = document.querySelector('.news-feed') || document.body;

    replaceFinancePromo();

    new MutationObserver(() => {
      replaceFinancePromo();
    }).observe(container, { childList: true, subtree: true });
  }

  if (/^\/search/.test(location.pathname)) processSearch();
  if (/^\/realty/.test(location.pathname)) processRealty();
  if (/^\/finance/.test(location.pathname)) processFinance();

})();
