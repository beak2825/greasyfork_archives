// ==UserScript==
// @name         MBSS Too MaTchING
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Перевод на матчинг в 2 клика
// @author       v.stazhok & s.bylinovich
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        none
// @namespace    https://greasyfork.org/users/1494852
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545205/MBSS%20Too%20MaTchING.user.js
// @updateURL https://update.greasyfork.org/scripts/545205/MBSS%20Too%20MaTchING.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const projectSelector      = '.list-item';
  const sidebarPanelSelector = '.flex.sidebar-panel .panel-elements';

  // Минимальные таймауты для ускорения работы
  const TIMEOUT = {
    short: 1000,
    normal: 3000,
    long: 5000,
  };

  const TRANSFER_TEXTS = ['TRANSFER', 'ПЕРЕВЕСТИ', 'ПЕРЕНАПРАВИТЬ'];

  const log  = (...a) => console.info('[MBSS Transfer]', ...a);
  const err  = (...a) => console.error('[MBSS Transfer]', ...a);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const normUpper = (s) => normalize(s).toUpperCase();

  function isVisible(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
    const rect = el.getBoundingClientRect();
    return !!(el.offsetParent || style.position === 'fixed') && rect.width > 0 && rect.height > 0;
  }

  async function waitForSelector(selector, { root = document, timeout = TIMEOUT.normal, visible = false } = {}) {
    const start = Date.now();
    let el = root.querySelector(selector);
    if (el && (!visible || isVisible(el))) return el;

    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        el = root.querySelector(selector);
        if (el && (!visible || isVisible(el))) {
          observer.disconnect();
          resolve(el);
        } else if (Date.now() - start > timeout) {
          observer.disconnect();
          reject(new Error(`waitForSelector timeout: ${selector}`));
        }
      });
      observer.observe(root === document ? document.documentElement : root, { childList: true, subtree: true });
    });
  }

  async function waitFor(fn, { timeout = TIMEOUT.normal, interval = 50 } = {}) {
    const start = Date.now();
    let v = fn();
    while (!v) {
      if (Date.now() - start > timeout) throw new Error('waitFor timeout');
      await sleep(interval);
      v = fn();
    }
    return v;
  }

  async function waitForTabByText(regex, { timeout = TIMEOUT.normal } = {}) {
    return waitFor(() => {
      const candidates = Array.from(document.querySelectorAll('[role="tab"], .el-tabs__item, #tab-1, #tab-2'))
        .filter(isVisible)
        .filter(el => regex.test(el.textContent || ''));
      return candidates[0] || null;
    }, { timeout });
  }

  function safeClick(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const x = rect.left + Math.max(1, Math.min(rect.width - 1, rect.width / 2));
    const y = rect.top + Math.max(1, Math.min(rect.height - 1, rect.height / 2));
    const opts = { view: window, bubbles: true, cancelable: true, clientX: x, clientY: y };
    el.dispatchEvent(new MouseEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    return true;
  }

  function getItemContainer(el) {
    return el.closest('li.infinite-list-item, li, .list-card-item') || el;
  }

  function parseNameIdFromContainer(container) {
    const p = container.querySelector('p.list-card-item_detail--name, .user-name p') || container.querySelector('p');
    let name = '';
    let id = null;
    if (p) {
      const spans = Array.from(p.querySelectorAll('span'));
      if (spans[0]) name = normalize(spans[0].textContent);
      if (!name) name = normalize(p.textContent).replace(/\(ID:\s*\d+\)/i, '').trim();
      const idSpan = spans.map(s => s.textContent || '').find(t => /\(ID:\s*\d+\)/i.test(t));
      if (idSpan) {
        const m = idSpan.match(/\(ID:\s*(\d+)\)/i);
        if (m) id = Number(m[1]);
      }
    }
    return { name, id };
  }

  function findMatchingItem(root, { code }) {
    const items = Array.from(root.querySelectorAll('li.infinite-list-item, .list-card-item'));
    const pref = normUpper(code);
    const best = items
      .map(c => {
        const { name } = parseNameIdFromContainer(c);
        const nameU = normUpper(name);
        const hasMatching = nameU.includes('MATCHING');
        const startsWithCode = pref && nameU.startsWith(pref);
        let score = 0;
        if (hasMatching) score += 10;
        if (startsWithCode) score += 5;
        return { container: c, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
    return best[0] && best[0].score > 0 ? best[0].container : null;
  }

  function buttonLooksDisabled(btn) {
    if (!btn) return true;
    if (btn.disabled) return true;
    const aria = btn.getAttribute('aria-disabled');
    if (aria && aria !== 'false') return true;
    if (/\bis-disabled\b/.test(btn.className || '')) return true;
    return false;
  }

  async function waitForEnabled(btn, timeout = TIMEOUT.normal) {
    if (!btn) throw new Error('Кнопка не найдена');
    if (!buttonLooksDisabled(btn)) return btn;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        obs.disconnect();
        reject(new Error('Ожидание разблокировки кнопки истекло'));
      }, timeout);
      const obs = new MutationObserver(() => {
        if (!buttonLooksDisabled(btn)) {
          clearTimeout(timer);
          obs.disconnect();
          resolve(btn);
        }
      });
      obs.observe(btn, { attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'class'] });
    });
  }

  function findTransferButton(root = document) {
    const texts = TRANSFER_TEXTS.map(normUpper);
    const candidates = Array.from(root.querySelectorAll('button, [role="button"], .el-button'));
    const matched = candidates.filter(btn => {
      const t = normUpper(btn.textContent || btn.innerText || '');
      return t && texts.some(x => t.includes(x));
    });
    const vis = matched.filter(isVisible);
    vis.sort((a, b) => Number(buttonLooksDisabled(a)) - Number(buttonLooksDisabled(b)));
    return vis[0] || matched[0] || null;
  }

  const initObserver = new MutationObserver(() => {
    const panel = document.querySelector(sidebarPanelSelector);
    if (panel && !panel.querySelector('.transfer-to-matching-btn')) {
      injectButton(panel);
    }
  });
  initObserver.observe(document.body, { childList: true, subtree: true });

  function injectButton(container) {
    const btn = document.createElement('div');
    btn.classList.add('vac-svg-button', 'transfer-to-matching-btn');
    btn.style.cssText = `
        padding: 6px 14px;
        margin-left: 8px;
        cursor: pointer;
        border-radius: 6px;
        background: linear-gradient(135deg, #4CAF50, #45A049);
        color: #fff;
        font-weight: 600;
        font-size: 13px;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.2s ease-in-out;
        user-select: none;
        border: 1px solid rgba(255,255,255,0.2);
    `;

    btn.textContent = '⇆ Transfer to Matching';

    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'linear-gradient(135deg, #5ECF5B, #4CAF50)';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        btn.style.transform = 'translateY(-1px)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45A049)';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        btn.style.transform = 'translateY(0)';
    });

    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(1px) scale(0.98)';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-1px) scale(1)';
    });

    btn.addEventListener('click', onTransferClick);
    container.appendChild(btn);
  }

  async function onTransferClick() {
    try {
      if (!confirm('Вы уверены, что желаете перевести чат на линию поддержки Matching?')) return;

      const text = document.querySelector(projectSelector)?.innerText || '';
      const code = text.split(' ')[0] || '';
      const target = `${code} MATCHING`;

      const optionsBtn = await waitForSelector('.vac-svg-button.vac-room-options', { visible: true, timeout: TIMEOUT.short });
      safeClick(optionsBtn);

      const transferTo = await waitForSelector('#active_room_transferTo, [data-tab="transferTo"]', { timeout: TIMEOUT.short });
      safeClick(transferTo);

      const groupTab = await waitForTabByText(/^(group|группа)$/i, { timeout: TIMEOUT.short }).catch(() => null);
      if (groupTab) safeClick(groupTab);
      else safeClick(document.querySelector('#tab-1'));

      const dialog = await waitForSelector('.el-dialog, .el-drawer, .el-card', { timeout: TIMEOUT.short }).catch(() => document);
      const input = await waitForSelector('.el-input__inner', { root: dialog, visible: true, timeout: TIMEOUT.short });
      input.focus();
      input.value = target;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const listRoot = dialog || document;
      const item = await waitFor(() => findMatchingItem(listRoot, { code }), { timeout: TIMEOUT.short });
      safeClick(getItemContainer(item));

      const transferBtn = findTransferButton(dialog) || findTransferButton(document);
      if (transferBtn) {
        await waitForEnabled(transferBtn, TIMEOUT.short);
        safeClick(transferBtn);
      } else {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
      }
    } catch (e) {
      err(e.message || e);
      alert('Transfer failed: ' + (e.message || e));
    }
  }
})();
