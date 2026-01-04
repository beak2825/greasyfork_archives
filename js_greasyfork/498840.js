// ==UserScript==
// @name         Amazon 数据采集整合版·自动推送（订单/库存/广告）
// @namespace    https://tampermonkey.net/
// @version      1.9
// @description  自动监听元素加载完成后采集并POST；订单(date/asin/count/orderNum/price)、库存(asin/price/available/reserved)、广告(date/name/spend)；移除分批+取消重复限制+自定义按钮位置+修复所有按钮重复创建问题+等待页面加载完成后再推送
// @match        https://sellercentral.amazon.com/*
// @match        https://sellercentral.amazon.*/*
// @match        https://advertising.amazon.com/*
// @match        https://advertising.amazon.*/*
// @grant        GM_xmlhttpRequest
// @connect      amzsold.natapp1.cc
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/498840/Amazon%20%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E6%95%B4%E5%90%88%E7%89%88%C2%B7%E8%87%AA%E5%8A%A8%E6%8E%A8%E9%80%81%EF%BC%88%E8%AE%A2%E5%8D%95%E5%BA%93%E5%AD%98%E5%B9%BF%E5%91%8A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/498840/Amazon%20%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E6%95%B4%E5%90%88%E7%89%88%C2%B7%E8%87%AA%E5%8A%A8%E6%8E%A8%E9%80%81%EF%BC%88%E8%AE%A2%E5%8D%95%E5%BA%93%E5%AD%98%E5%B9%BF%E5%91%8A%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 全局配置 ==========
  const CONFIG = {
    MAX_RETRY: 3,          // 单条失败最大重试次数
    RETRY_DELAY_BASE: 1000, // 基础重试间隔（毫秒），每次重试翻倍
    LOADING_TIMEOUT: 30000 // 等待loading结束的超时时间
  };

  // ========== 接口地址 ==========
  const API = {
    orders:    'http://amzsold.natapp1.cc/apply/post',
    inventory: 'http://amzsold.natapp1.cc/apply/inventory',
    ads:       'http://amzsold.natapp1.cc/apply/cost',
  };

  // ========== 公共工具 ==========
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const txt = (el) => (el?.textContent || '').trim();
  const trim = (s) => (s ?? '').replace(/^\s+|\s+$/g, '');
  const rawText = (el) => (el?.textContent ?? '');

  // 行数保持稳定 stableMs 毫秒后认为表格加载完成
  function waitForStableCount(selector, { min = 1, stableMs = 800, pollMs = 250, timeout = 30000 } = {}) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      let lastCount = -1;
      let stableStart = null;

      const timer = setInterval(() => {
        const count = document.querySelectorAll(selector).length;

        // 是否达到最小行数
        if (count >= min) {
          if (count === lastCount) {
            if (stableStart == null) stableStart = Date.now();
            if (Date.now() - stableStart >= stableMs) {
              clearInterval(timer);
              resolve(count);
            }
          } else {
            lastCount = count;
            stableStart = null; // 重置稳定计时
          }
        }

        if (Date.now() - t0 > timeout) {
          clearInterval(timer);
          reject(new Error(`waitForStableCount timeout for ${selector}`));
        }
      }, pollMs);
    });
  }

  // DOM 出现即触发一次（配合 AJAX/SPA）
  function fireWhenAppears(selector, cb, options = {}) {
    let fired = false;

    // 先尝试一次
    const tryFire = () => {
      if (!fired && document.querySelector(selector)) {
        fired = true;
        cb().catch(() => { fired = false; }); // 失败允许再次触发
      }
    };
    tryFire();

    // 观察整个文档，适配异步加载
    const obs = new MutationObserver(() => tryFire());
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // 可选：在回调中自行断开 obs；这里不强制断开，保持对 SPA 路由切换的感知
    return () => obs.disconnect();
  }

  // 监听路由变化（适配 SellerCentral 的 SPA）- 核心：路由变化前清理指定按钮
  function onRouteChange(cb, cleanBtnIds = []) {
    const _push = history.pushState;
    const _replace = history.replaceState;
    const fire = () => {
      // 路由变化前先强制清理所有指定按钮
      cleanBtnIds.forEach(btnId => {
        const oldBtn = document.getElementById(btnId);
        if (oldBtn) {
          oldBtn.remove();
          console.log(`[路由变化] 清理按钮 ${btnId}`);
        }
      });
      setTimeout(() => { try { cb(); } catch(e) { console.warn(e); } }, 0);
    };
    history.pushState = function() { const r = _push.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); fire(); return r; };
    history.replaceState = function() { const r = _replace.apply(this, arguments); window.dispatchEvent(new Event('locationchange')); fire(); return r; };
    window.addEventListener('popstate', fire);
    window.addEventListener('locationchange', fire);
  }

  // 任一选择器出现就触发一次；失败则允许再次触发
  function fireWhenAppearsAny(selectors, cb) {
    let firing = false;
    const test = () => {
      if (firing) return;
      const hit = selectors.some(sel => document.querySelector(sel));
      if (hit) {
        firing = true;
        Promise.resolve(cb('appear')).catch(() => { firing = false; });
      }
    };
    // 先测一次，再挂观察器
    test();
    const obs = new MutationObserver(test);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    // 路由变化再测
    window.addEventListener('locationchange', test);
    window.addEventListener('popstate', test);
    return () => obs.disconnect();
  }

  // ========== 增强版POST方法（移除分批+保留重试） ==========
  async function postDataWithRetry(url, data, moduleName) {
    let retryCount = 0;
    while (retryCount < CONFIG.MAX_RETRY) {
      try {
        console.log(`[${moduleName}] 提交数据，共${data.length}条`, data);
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            data: JSON.stringify(data),
            onload(xhr) {
              console.log(`[${moduleName}] 响应:`, xhr.status, xhr.responseText);
              resolve({ status: xhr.status, body: xhr.responseText });
            },
            onerror(err) {
              console.error(`[${moduleName}] 请求错误:`, err);
              reject(err);
            },
            ontimeout() { reject(new Error(`[${moduleName}] 请求超时`)); },
            timeout: 30000
          });
        });
      } catch (error) {
        retryCount++;
        const delay = CONFIG.RETRY_DELAY_BASE * Math.pow(2, retryCount - 1);
        console.error(`[${moduleName}] 提交失败（重试${retryCount}/${CONFIG.MAX_RETRY}）:`, error);

        if (retryCount >= CONFIG.MAX_RETRY) {
          throw new Error(`[${moduleName}] 提交最终失败: ${error.message}`);
        }

        console.log(`[${moduleName}] 等待${delay}ms后重试...`);
        await sleep(delay);
      }
    }
    throw new Error(`[${moduleName}] 提交超出最大重试次数`);
  }

  async function postData(url, data, moduleName) {
    if (!data || data.length === 0) {
      console.log(`[${moduleName}] 无数据可推送`);
      return;
    }

    try {
      const res = await postDataWithRetry(url, data, moduleName);
      if (res.status >= 200 && res.status < 300) {
        console.log(`[${moduleName}] 推送成功 - 共${data.length}条`);
      } else {
        console.warn(`[${moduleName}] 接口返回非2xx：${res.status}`, res.body);
        alert(`[${moduleName}] 推送失败，接口返回${res.status}，请检查！`);
      }
    } catch (error) {
      console.error(`[${moduleName}] 推送失败:`, error);
      alert(`[${moduleName}] 推送失败：${error.message}`);
    }
  }

  // =========================================================
  // =============== ① 订单页：#orders-table ================
  // =========================================================
  const OrdersModule = (() => {
    // 全局唯一标识
    const ORDER_BTN_ID = '__amz_btn_orders_manual';
    const BTN_ID = '__amz_order_push_btn'; // 第一份代码的按钮ID
    let isBtnCreated = false; // 仅创建一次标记

    // ===== 新增：检测页面是否处于loading状态 =====
    function isPageLoading() {
      // 1. 检测亚马逊卖家后台常见的loading元素（可根据实际页面调整选择器）
      const loadingSelectors = [
        '.a-loading-spinner',
        '.loading-overlay',
        '[data-testid="loading-indicator"]',
        '.spinner',
        '#orders-table .loading',
        '.myo-loading-spinner',
        '.order-table-loading',
        '[aria-busy="true"]'
      ];
      for (const selector of loadingSelectors) {
        if (document.querySelector(selector)) {
          console.log('[订单采集] 检测到页面loading元素：', selector);
          return true;
        }
      }

      // 2. 检测浏览器原生的document.loading状态
      if (document.readyState !== 'complete') {
        console.log('[订单采集] document未完全加载，当前状态：', document.readyState);
        return true;
      }

      // 3. 检测订单表格是否处于加载中（行数据为空但有加载提示）
      const orderTable = document.querySelector('#orders-table');
      if (orderTable && !orderTable.querySelector('tbody tr') && orderTable.textContent.includes('加载') || orderTable.textContent.includes('Loading')) {
        console.log('[订单采集] 订单表格为空且包含加载提示');
        return true;
      }

      return false;
    }

    // ===== 新增：等待loading结束的工具函数 =====
    function waitForLoadingEnd(timeout = CONFIG.LOADING_TIMEOUT) {
      return new Promise((resolve, reject) => {
        const checkInterval = 500;
        let elapsed = 0;

        const check = () => {
          if (!isPageLoading()) {
            resolve();
          } else if (elapsed >= timeout) {
            reject(new Error(`等待loading结束超时（${timeout}ms）`));
          } else {
            elapsed += checkInterval;
            setTimeout(check, checkInterval);
          }
        };

        check();
      });
    }

    function getSubtotalFromProductCell(prodTd) {
      if (!prodTd) return '';
      const spans = Array.from(prodTd.querySelectorAll('span'));
      const labelSpan = spans.find(s => s && txt(s) === '商品小计');
      if (!labelSpan) return '';
      const line = txt(labelSpan.parentElement || labelSpan);
      const afterLabel = line.replace(/^商品小计\s*:?/, '').trim();
      const m = afterLabel.match(/([A-Z]{2,3}\$|\$|[A-Z]{3})?\s*\$?\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?/);
      return m ? m[0].replace(/\s+/g, '') : '';
    }

    function parseProductCell(prodTd) {
      const info = { asin: '', count: '1', price: '' };
      if (!prodTd) return info;
      for (const b of Array.from(prodTd.querySelectorAll('b'))) {
        const p = b.parentElement?.textContent || '';
        if (/ASIN/i.test(p)) { info.asin = b.textContent.trim(); break; }
      }
      for (const d of Array.from(prodTd.querySelectorAll('div'))) {
        const t = (d.textContent || '').replace(/\s+/g, '');
        const m = t.match(/(为配送的数量|数量)\D*:?(\d+)/);
        if (m) { info.count = m[2]; break; }
      }
      info.price = getSubtotalFromProductCell(prodTd);
      return info;
    }

    function parseOrderIdCell(orderTd) {
      if (!orderTd) return '';
      const a = orderTd.querySelector('a[href*="/orders-v3/order/"]');
      if (a) return txt(a);
      for (const d of Array.from(orderTd.querySelectorAll('div'))) {
        const t = txt(d);
        const m = t.match(/卖家订单编号\s*:\s*([0-9-]+)/);
        if (m) return m[1];
      }
      return '';
    }

    function parseTimeCell(timeTd) {
      if (!timeTd) return '';
      const parts = Array
        .from(timeTd.querySelectorAll('.cell-body > div > div, .cell-body .cell-body-title'))
        .map(e => txt(e)).filter(Boolean);

      let dateStr = parts.find(s => /\d{4}\/\d{1,2}\/\d{1,2}/.test(s)) || '';
      let timeStr = parts.find(s => /\d{1,2}:\d{2}/.test(s)) || '';

      if (!dateStr || !timeStr) {
        const whole = txt(timeTd);
        const mDate = whole.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
        const mTime = whole.match(/(\d{1,2}:\d{2})/);
        dateStr = dateStr || (mDate ? mDate[1] : '');
        timeStr = timeStr || (mTime ? mTime[1] : '');
      }

      timeStr = (timeStr.match(/\d{1,2}:\d{2}/) || [''])[0];
      if (!dateStr || !timeStr) return '';
      const [y, m, d] = dateStr.split('/');
      const [H, M] = timeStr.split(':');
      const HH = String(H).padStart(2, '0');
      const MM = String(M).padStart(2, '0');
      return `${y}/${parseInt(m,10)}/${parseInt(d,10)} ${HH}:${MM}:00`;
    }

    async function collectAndPost() {
      try {
        // 步骤1：等待页面loading完全结束
        console.log('[订单采集] 开始等待页面loading结束...');
        await waitForLoadingEnd();
        console.log('[订单采集] 页面loading已结束');

        // 步骤2：等待订单表格行数稳定（延长稳定时间到1500ms）
        await waitForStableCount('#orders-table tbody tr', {
          min: 1,
          stableMs: 1500, // 延长稳定检测时间，确保数据完全渲染
          timeout: 45000
        });

        const table = document.querySelector('#orders-table');
        const tbody = table?.querySelector('tbody');
        if (!tbody) throw new Error('未找到订单表格主体');

        const trs = Array.from(tbody.querySelectorAll('tr'));
        const payload = [];
        let lastOrderNum = '';
        let lastDate = '';

        for (const tr of trs) {
          const tds = Array.from(tr.children).filter(el => el.tagName === 'TD');
          const timeTd    = tds.find(td => /\d{4}\/\d{1,2}\/\d{1,2}|\d{1,2}:\d{2}/.test(td.textContent)) || null;
          const orderTd   = tds.find(td => td.querySelector('a[href*="/orders-v3/order/"]')) || null;
          const productTd = tds.find(td => td.querySelector('.myo-list-orders-product-name-cell')) || null;

          const orderNum = parseOrderIdCell(orderTd) || lastOrderNum;
          const date     = parseTimeCell(timeTd)     || lastDate;
          if (orderNum) lastOrderNum = orderNum;
          if (date)     lastDate     = date;

          if (!productTd) continue;
          const { asin, count, price } = parseProductCell(productTd);

          payload.push({ date, asin, count: count || '1', orderNum, price });
        }

        if (!payload.length) throw new Error('没有解析到任何商品行');
        await postData(API.orders, payload, 'orders');
      } catch (err) {
        alert('[订单] 推送失败：' + (err?.message || err));
        console.error('[订单采集] 失败：', err);
      }
    }

    // 强制清理旧按钮
    function cleanOldOrderBtn() {
      const oldBtn = document.getElementById(ORDER_BTN_ID);
      const oldBtn2 = document.getElementById(BTN_ID);
      if (oldBtn) {
        oldBtn.remove();
        console.log('[订单按钮] 清理旧按钮成功');
      }
      if (oldBtn2) {
        oldBtn2.remove();
        console.log('[订单按钮] 清理第一份代码旧按钮成功');
      }
      isBtnCreated = false; // 重置创建标记
    }

        // 【核心】创建按钮：优先插入到.push-right同级 + 固定最右侧（第一份代码逻辑）
    function createPushButton() {
      // 已创建过 → 直接返回
      if (isBtnCreated || document.getElementById(BTN_ID)) {
        return;
      }

      console.log('[推送按钮] 开始创建，定位.push-right容器...');

      // 1. 找到.push-right容器及其父元素
      const pushRight = document.querySelector('.push-right');
      const pushRightParent = pushRight ? pushRight.parentElement : document.body;

      // 2. 创建推送按钮（核心样式：与.push-right同级+最右侧）
      const pushBtn = document.createElement('button');
      pushBtn.id = BTN_ID;
      pushBtn.textContent = '推送数据·订单';
      pushBtn.type = 'button';

      // 核心样式：视觉同步库存按钮，定位分场景（避免重叠+悬浮生效）
      pushBtn.style.cssText = `
        /* 基础样式（完全同步库存按钮） */
        padding: 8px 12px !important;
        background: #146eb4 !important;
        color: #fff !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,0,0,.2) !important;
        opacity: 0.85 !important;
        z-index: 999999 !important; /* 与库存按钮同层级 */

        /* 定位逻辑：找到push-right则保留原有，否则固定底部60px（避开库存按钮） */
        ${pushRight ?
          'display: inline-block !important; position: static !important; float: right !important; margin-left: 10px !important; vertical-align: middle !important;' :
          'display: block !important; position: fixed !important; right: 20px !important; bottom: 60px !important;'}
      `;

      // 修复悬浮样式：强制覆盖!important，确保生效
      pushBtn.addEventListener('mouseenter', () => {
        pushBtn.style.setProperty('opacity', '1', 'important');
        pushBtn.style.setProperty('box-shadow', '0 2px 8px rgba(0,0,0,.4)', 'important'); // 增强悬浮阴影
      });
      pushBtn.addEventListener('mouseleave', () => {
        pushBtn.style.setProperty('opacity', '0.85', 'important');
        pushBtn.style.setProperty('box-shadow', '0 2px 8px rgba(0,0,0,.2)', 'important');
      });

      // 点击事件（绑定第二份代码的collectAndPost）
      pushBtn.addEventListener('click', () => {
        collectAndPost().catch(err => alert('[订单] 推送失败：' + (err?.message || err)));
      });

      // 3. 插入逻辑（核心：与.push-right同级）
      if (pushRight) {
        // 方式1：push-right存在 → 插入到push-right后面（同级，最右侧）
        pushRightParent.insertBefore(pushBtn, pushRight.nextSibling);
        console.log('[推送按钮] 成功插入到.push-right同级右侧！');
      } else {
        // 方式2：push-right不存在 → 直接插入body（与库存按钮一致）
        document.body.appendChild(pushBtn);
        console.log('[推送按钮] 找不到push-right，固定底部右侧60px！');
      }

      // 标记：已创建，不再重复
      isBtnCreated = true;
    }

    // 替换原makeOrderBtn为第一份代码的创建逻辑
    function makeOrderBtn() {
      // 第一步：强制清理旧按钮
      cleanOldOrderBtn();

      // 第二步：执行第一份代码的创建逻辑
      setTimeout(() => {
        createPushButton();

        // 轻量监听：仅当.push-right结构变化且按钮消失时重建（仅一次）
        const observer = new MutationObserver((mutations) => {
          const pushBtn = document.getElementById(BTN_ID);
          const pushRight = document.querySelector('.push-right');

          if (pushRight && !pushBtn && !isBtnCreated) {
            createPushButton();
            observer.disconnect();
          }
        });

        // 监听.push-right的父容器变化
        const pushRightParent = document.querySelector('.push-right')?.parentElement;
        if (pushRightParent) {
          observer.observe(pushRightParent, { childList: true, subtree: false });
        }

        // 页面卸载清理
        window.addEventListener('beforeunload', () => observer.disconnect());
      }, 1000);
    }

    function init() {
      if (!/sellercentral\.amazon\./.test(location.hostname)) return;
      fireWhenAppears('#orders-table', collectAndPost);
      makeOrderBtn();

      // 路由变化：先清理，再延迟创建
      onRouteChange(() => {
        cleanOldOrderBtn();
        setTimeout(makeOrderBtn, 500);
      }, [ORDER_BTN_ID, BTN_ID]);
    }
    return { init };
  })();

  // =========================================================
  // =============== ② 库存页：Janus data-sku ===============
  // =========================================================
  const InventoryModule = (() => {
    const INVENTORY_BTN_ID = '__amz_btn_inventory_manual';

    const digits = (s) => {
      s = (s ?? '').replace(/\s+/g, ' ').trim();
      if (!s) return '';
      const m = s.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
      return m ? m[1] : '';
    };

    function rightValueByLeftLabel(scope, leftLabel) {
      const rows = scope.querySelectorAll('.JanusSplitBox-module__row--yjQ5L');
      const want = (leftLabel || '').replace(/\s/g, '');
      for (const row of rows) {
        const panels = row.querySelectorAll('.JanusSplitBox-module__panel--AbYDg');
        if (!panels.length) continue;
        const left = panels[0];
        const leftTxt = (left.textContent || '').replace(/\s/g, '');
        if (!leftTxt.includes(want)) continue;

        const right = panels[panels.length - 1];
        const katInput = right.querySelector('kat-input');
        if (katInput && katInput.getAttribute('value') != null) {
          return (katInput.getAttribute('value') || '').replace(/\s+/g, ' ').trim();
        }
        return (right.textContent || '').replace(/\s+/g, ' ').trim();
      }
      return '';
    }

    function getAsin(row) {
      const a = row.querySelector('.ProductDetails-module__titleContainer--wRcGp a[href*="/dp/"]');
      if (a) {
        const m = a.getAttribute('href').match(/\/dp\/([A-Z0-9]{10})/i);
        if (m) return m[1].toUpperCase();
      }
      return rightValueByLeftLabel(row, 'ASIN') || '';
    }

    function getPrice(row) {
      const box = row.querySelector('[class*="VolusPriceInputComposite-module__container"]');
      if (!box) return '';
      const priceRow = Array.from(box.querySelectorAll('.VolusPriceInputComposite-module__priceInputRow--1DG3s'))
      .find(el => /价格/.test(el.textContent || ''));
      const input = priceRow ? priceRow.querySelector('kat-input[type="text"]') : null;
      const val = input ? input.getAttribute('value') : '';
      return digits(val);
    }

    function getAvailableAndReserved(row) {
      const inventoryCells = row.querySelectorAll('.JanusTable-module__janusCell1--SdDkI');
      let availableFBA = '', reservedFBA = '', availableMFN = '';
      for (const cell of inventoryCells) {
        const a1 = rightValueByLeftLabel(cell, '有货（亚马逊物流）');
        const r1 = rightValueByLeftLabel(cell, '预留');
        const a2 = rightValueByLeftLabel(cell, '有货（卖家自配送）');
        if (a1) availableFBA = digits(a1);
        if (r1) reservedFBA  = digits(r1);
        if (a2) availableMFN = digits(a2);
      }
      const available = availableFBA || availableMFN || '0';
      const reserved  = reservedFBA || '0';
      return { available, reserved };
    }

    function collect() {
      const wraps = Array.from(document.querySelectorAll('[data-sku]'));
      const items = [];
      for (const wrap of wraps) {
        const row = wrap.querySelector('.JanusTable-module__tableContentRow--MGDsi') || wrap;
        const asin = getAsin(row);
        if (!asin) continue;
        const price = getPrice(row);
        const { available, reserved } = getAvailableAndReserved(row);
        items.push({ asin, price, available, reserved });
      }
      return items;
    }

    async function warmUpRender() {
      const sc = document.scrollingElement || document.documentElement;
      const start = sc.scrollTop;
      for (let i = 0; i < 3; i++) {
        sc.scrollTo(0, sc.scrollHeight);
        await sleep(250);
      }
      sc.scrollTo(0, start);
      await sleep(150);
    }

    async function collectAndPost(reason = 'auto') {
      console.log('[inventory] trigger ->', reason, location.href);

      await waitForStableCount(
        '[data-sku], .JanusTable-module__tableContentRow--MGDsi, .ProductDetails-module__titleContainer--wRcGp a[href*="/dp/"]',
        { min: 1, stableMs: 1200, timeout: 90000 }
      );

      await warmUpRender();

      const data = collect();
      if (!data.length) throw new Error('未采集到任何 SKU');
      await postData(API.inventory, data, 'inventory');
    }

    // 清理旧库存按钮
    function cleanOldInventoryBtn() {
      const oldBtn = document.getElementById(INVENTORY_BTN_ID);
      if (oldBtn) {
        oldBtn.remove();
        console.log('[库存按钮] 清理旧按钮成功');
      }
    }

    // 创建库存按钮
    function makeInventoryBtn() {
      cleanOldInventoryBtn(); // 强制清理

      const btn = document.createElement('button');
      btn.id = INVENTORY_BTN_ID;
      btn.textContent = '推送数据·库存';
      Object.assign(btn.style, {
        position: 'fixed', right: '20px', zIndex: '999999',
        bottom: '20px', padding: '8px 12px', background: '#146eb4', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)', opacity: '0.85'
      });

      btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
      btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.85'));
      btn.addEventListener('click', () => {
        collectAndPost('manual').catch(err => alert('[库存] 推送失败：' + (err?.message || err)));
      });
      document.body.appendChild(btn);
    }

    function init() {
      if (!/sellercentral\.amazon\./.test(location.hostname)) return;

      fireWhenAppearsAny([
        '[data-sku]',
        '.JanusTable-module__tableContentRow--MGDsi',
        '.ProductDetails-module__titleContainer--wRcGp a[href*="/dp/"]'
      ], collectAndPost);

      onRouteChange(() => {
        cleanOldInventoryBtn();
        setTimeout(() => collectAndPost('route'), 1200);
        setTimeout(makeInventoryBtn, 500);
      }, [INVENTORY_BTN_ID]);

      makeInventoryBtn();
    }

    return { init };
  })();

  // =========================================================
  // ============ ③ 广告组合页：advertising.* ===============
  // =========================================================
  const AdsModule = (() => {
    // 广告按钮全局唯一ID（核心修复重复问题）
    const AD_BTN_ID = '__amz_btn_ads_manual';
    const BTN_ID = '__amz_ads_push_btn'; // 第一份代码的按钮ID
    let observer = null; // 保存监听实例

    const SEL = {
      dateRangeBtn:  '[data-e2e-id="dateRangePickerButton"]',
      cellAny:       '[data-e2e-id^="tableCell_cell_"]',
      leftGrid:      '.BottomLeftGrid_ScrollWrapper .ReactVirtualized__Grid',
      rightGrid:     '[class*="bottomRightGridStyle"] .ReactVirtualized__Grid, [class*="bottomRightGridStyle_"].ReactVirtualized__Grid'
    };

    // 精准定位核心容器：DatePickerWrapper（dateRangeFilter的父容器）- 第一份代码逻辑
    function getRootDateContainer() {
      return document.querySelector('.DatePickerWrapper-sc-mjxzmj-0.kozGEt');
    }

    // 定位dateRangeFilter元素（广告按钮的同级元素）- 第一份代码逻辑
    function getDateRangeFilter() {
      return document.querySelector('[data-e2e-id="dateRangeFilter"]');
    }

    const parseRowCol = (el) => {
      const s = el.getAttribute('data-e2e-index') || '';
      const m = s.match(/cellIndex_(\d+)_(\d+)/);
      return m ? {row: parseInt(m[1],10), col: parseInt(m[2],10)} : {row:-1,col:-1};
    };

    function harvestVisible(rowsMap) {
      document.querySelectorAll(SEL.cellAny).forEach(cell => {
        const {row} = parseRowCol(cell);
        if (row < 0) return;
        if (!rowsMap.has(row)) rowsMap.set(row, {});
        const id = cell.getAttribute('data-e2e-id');
        const rec = rowsMap.get(row);
        if (id === 'tableCell_cell_name') {
          const a = cell.querySelector('[data-e2e-id="entityNameRenderer"]');
          rec.name = trim(a?.textContent || '');
        } else if (id === 'tableCell_cell_spend') {
          const v = cell.querySelector('[data-e2e-id="currencyRenderer"]') || cell;
          rec.spend = rawText(v);
        }
      });
    }

    async function harvestAll() {
      const rowsMap = new Map();
      const left  = document.querySelector(SEL.leftGrid);
      const right = document.querySelector(SEL.rightGrid);

      if (!left || !right) {
        harvestVisible(rowsMap);
        return rowsMap;
      }

      const step = Math.max(60, left.clientHeight - 20);
      const maxH = Math.max(left.scrollHeight, right.scrollHeight);

      left.scrollTop = right.scrollTop = 0;
      await sleep(120);
      harvestVisible(rowsMap);

      for (let top = 0, guard = 0; top < maxH && guard < 400; top += step, guard++) {
        left.scrollTop = right.scrollTop = top;
        await sleep(80);
        harvestVisible(rowsMap);
      }

      left.scrollTop = right.scrollTop = 0;
      await sleep(60);
      harvestVisible(rowsMap);

      return rowsMap;
    }

    function buildPayload(rowsMap) {
      const dateLabel = trim(document.querySelector(SEL.dateRangeBtn)?.textContent || '');
      return Array.from(rowsMap.entries())
        .sort((a,b) => a[0]-b[0])
        .map(([_, r]) => ({ date: dateLabel || '', name: r.name || '', spend: r.spend ?? '' }));
    }

    async function collectAndPost() {
      await waitForStableCount(SEL.cellAny, { min: 1, stableMs: 500, timeout: 60000 });
      const rowsMap = await harvestAll();
      const payload = buildPayload(rowsMap);
      if (!payload.length) throw new Error('未采集到任何广告行');

      await postData(API.ads, payload, 'ads');
    }

    // 核心：强制清理旧广告按钮（解决重复创建）
    function cleanOldAdBtn() {
      const oldBtn = document.getElementById(AD_BTN_ID);
      const oldBtn2 = document.getElementById(BTN_ID);
      if (oldBtn) {
        oldBtn.remove();
        console.log('[广告按钮] 清理旧按钮成功');
      }
      if (oldBtn2) {
        oldBtn2.remove();
        console.log('[广告按钮] 清理第一份代码旧按钮成功');
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    // 降级按钮（核心容器未找到时）- 第一份代码逻辑
    function createFallbackButton() {
      const btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.textContent = '推送数据·广告';
      btn.type = 'button';
      // 核心样式：视觉样式同步库存按钮，定位逻辑保留原有
      btn.style.cssText = `
        /* 基础样式（同步库存按钮） */
        padding: 8px 12px !important;
        background: #146eb4 !important;
        color: #fff !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,0,0,.2) !important;
        opacity: 0.85 !important;
        z-index: 9999 !important;

        /* 原有定位逻辑（完全保留） */
        display: inline-block !important;
        position: static !important;
        float: right !important;
        margin-left: 10px !important;
        vertical-align: middle !important;
      `;

      // 鼠标悬浮效果（同步库存按钮）
      btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1 !important';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.85 !important';
      });
      // 绑定第二份代码的点击事件
      btn.addEventListener('click', () => {
        collectAndPost().catch(err => alert('[广告] 推送失败：' + (err?.message || err)));
      });
      return btn;
    }

    // 核心：创建广告按钮（与dateRangeFilter同级）- 第一份代码逻辑
    function createAdsButton(forceRecreate = false) {
      // 避免重复创建（非强制重建时）
      const existingBtn = document.getElementById(BTN_ID);
      if (existingBtn && !forceRecreate) {
        return existingBtn;
      }
      // 移除旧按钮（强制重建）
      if (existingBtn) existingBtn.remove();

      const rootContainer = getRootDateContainer();
      const dateRangeFilter = getDateRangeFilter();

      // 未找到核心容器 → 降级创建（保底）
      if (!rootContainer) {
        console.log('[广告按钮] 未找到DatePickerWrapper，创建降级固定按钮');
        const btn = createFallbackButton();
        document.body.appendChild(btn);
        return btn;
      }

      // 创建按钮（与dateRangeFilter同级）
      const btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.textContent = '推送数据·广告';
      btn.type = 'button';

      // 核心样式：视觉样式同步库存按钮，定位逻辑保留原有
      btn.style.cssText = `
        /* 基础样式（同步库存按钮） */
        padding: 8px 12px !important;
        background: #146eb4 !important;
        color: #fff !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0,0,0,.2) !important;
        opacity: 0.85 !important;
        z-index: 9999 !important;

        /* 原有定位逻辑（完全保留） */
        display: inline-block !important;
        position: static !important;
        float: right !important;
        margin-left: 10px !important;
        vertical-align: middle !important;
      `;

      // 鼠标悬浮效果（同步库存按钮）
      btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1 !important';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.85 !important';
      });

      // 点击事件（绑定第二份代码的collectAndPost）
      btn.addEventListener('click', () => {
        collectAndPost().catch(err => alert('[广告] 推送失败：' + (err?.message || err)));
      });

      // 插入逻辑：到rootContainer内，dateRangeFilter的后面（同级）
      if (dateRangeFilter) {
        rootContainer.insertBefore(btn, dateRangeFilter.nextSibling);
      } else {
        // dateRangeFilter未加载 → 插入到rootContainer末尾
        rootContainer.appendChild(btn);
      }

      console.log('[广告按钮] 成功创建，与dateRangeFilter同级！');
      return btn;
    }

    // 轮询检测：确保核心容器加载后创建按钮（第一份代码逻辑）
    async function pollForRootContainer() {
      const ADS_CONFIG = {
        ADS_POLL_DELAY: 500,
        ADS_POLL_MAX_TIMES: 20
      };
      let pollCount = 0;
      while (pollCount < ADS_POLL_MAX_TIMES) {
        const rootContainer = getRootDateContainer();
        const btn = document.getElementById(BTN_ID);

        // 找到核心容器且无按钮 → 创建
        if (rootContainer && !btn) {
          createAdsButton();
          break;
        }

        pollCount++;
        await sleep(ADS_CONFIG.ADS_POLL_DELAY);
      }
      console.log(`[广告按钮] 轮询结束（${pollCount}次），按钮状态：${!!document.getElementById(BTN_ID)}`);
    }

    // 监听DOM变化：容器/按钮变化时重建（第一份代码逻辑）
    function startDomObserver() {
      if (observer) observer.disconnect();

      const ADS_CONFIG = {
        ADS_OBSERVER_DELAY: 200
      };

      observer = new MutationObserver((mutations) => {
        let timeoutId;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const rootContainer = getRootDateContainer();
          const btn = document.getElementById(BTN_ID);
          const dateRangeFilter = getDateRangeFilter();

          // 场景1：有核心容器但无按钮 → 重建
          if (rootContainer && !btn) {
            createAdsButton();
          }
          // 场景2：按钮存在但父容器不是rootContainer → 重建（确保同级）
          else if (btn && btn.parentElement !== rootContainer) {
            createAdsButton(true);
          }
          // 场景3：dateRangeFilter加载完成但按钮位置不对 → 重建
          else if (rootContainer && dateRangeFilter && btn && btn.parentElement === rootContainer && btn.previousSibling !== dateRangeFilter) {
            createAdsButton(true);
          }
        }, ADS_CONFIG.ADS_OBSERVER_DELAY);
      });

      // 监听body变化（低消耗）
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });

      // 页面卸载清理
      window.addEventListener('beforeunload', () => observer.disconnect());
    }

    // 替换原makeAdBtn为第一份代码的创建逻辑
    function makeAdBtn() {
      // 第一步：强制清理旧按钮
      cleanOldAdBtn();

      // 第二步：执行第一份代码的创建逻辑
      // 1. 立即尝试创建按钮
      createAdsButton();
      // 2. 轮询确保核心容器加载后调整位置
      pollForRootContainer();
      // 3. 监听DOM变化，自动修复位置
      startDomObserver();
    }

    function init() {
      if (!/advertising\.amazon\./.test(location.hostname)) return;
      fireWhenAppears(SEL.cellAny, collectAndPost);

      // 初始化创建按钮
      makeAdBtn();

      // 路由变化：先清理旧按钮，再延迟创建新按钮（核心解决重复问题）
      onRouteChange(() => {
        cleanOldAdBtn(); // 路由变化立即清理
        setTimeout(makeAdBtn, 500); // 延迟创建，避免DOM未加载完成
      }, [AD_BTN_ID, BTN_ID]); // 传入按钮ID，路由变化前强制清理

      // 监听dateRangeBtn出现后重新检查按钮
      fireWhenAppears(SEL.dateRangeBtn, () => {
        cleanOldAdBtn();
        makeAdBtn();
      });
    }
    return { init };
  })();

  // ====== 启动 ======
  OrdersModule.init();
  InventoryModule.init();
  AdsModule.init();
})();