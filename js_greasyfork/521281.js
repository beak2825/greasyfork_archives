// ==UserScript==
// @name         领星售后信息复制
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  一键复制领星 ERP 页面中的售后信息。
// @author       祀尘
// @match        https://erp.lingxing.com/*
// @icon         https://www.google.com/s2/favicons?domain=lingxing.com
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/521281/%E9%A2%86%E6%98%9F%E5%94%AE%E5%90%8E%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521281/%E9%A2%86%E6%98%9F%E5%94%AE%E5%90%8E%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========= 配置区 =========
  const brandNameMap = {
    'BORNOON': 'BRN',
    'ANYMAPLE': 'AMP',
    'XIXINI': 'XXN',
    'HUANLEGO': 'HLG',
    'Wodeer': 'WD',
    'MCMACROS': 'MC',
    'Thacuok': 'TC',
    'BOXACTION': 'BOX',
    'BOONATU': 'BNT'
  };

  const storeToBrandMap = {
    'XIxini-US': 'XIXINI',
    'BOXACTION-US': 'BOX',
    'Jiangxin Tech-US': 'BOONATU'
  };

  // ========= UI =========
  const button = document.createElement('button');
  button.textContent = '复制售后信息';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.backgroundColor = '#007BFF';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.padding = '10px 20px';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '100000';
  button.disabled = true;
  document.body.appendChild(button);

  function showNotification(message, duration = 2400) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.right = '20px';
    notification.style.maxWidth = '560px';
    notification.style.whiteSpace = 'pre-line';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.78)';
    notification.style.color = '#fff';
    notification.style.padding = '10px 16px';
    notification.style.borderRadius = '6px';
    notification.style.zIndex = '100000';
    notification.style.fontSize = '14px';
    notification.style.lineHeight = '1.35';
    notification.style.transition = 'opacity 0.25s ease';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 250);
    }, duration);
  }

  // ========= 工具 =========
  const cleanText = (s) => (s ?? '').toString().replace(/\s+/g, ' ').trim();

  function normalizeCityState(addressRaw) {
    let s = cleanText(addressRaw)
      .replace('United States of America (USA)(美国)，', '')
      .trim();

    if (!s) return '';
    const parts = s.split('，').map(x => cleanText(x)).filter(Boolean);
    if (parts.length === 2) return `${parts[1]}，${parts[0]}`;
    if (parts.length >= 3) return `${parts[parts.length - 1]}，${parts[parts.length - 2]}`;
    return s;
  }

  function getStoreNameFromPage() {
    return cleanText(document.querySelector('.store-name')?.textContent);
  }

  function getDetailBoxLeft() {
    const list = Array.from(document.querySelectorAll('.detail-box-left'));
    for (const el of list) {
      if (el.querySelector('.item-grid') && el.querySelector('.item-title')) return el;
    }
    return list[0] || null;
  }

  function getGridValue(detailBoxLeft, labelText) {
    if (!detailBoxLeft) return '';
    const labels = Array.from(detailBoxLeft.querySelectorAll('.item-grid .label'));
    const target = cleanText(labelText);

    for (const lab of labels) {
      const t = cleanText(lab.textContent);
      if (t === target || t.includes(target)) {
        const valueEl = lab.nextElementSibling;
        if (!valueEl) return '';
        const span = valueEl.querySelector('span');
        return cleanText(span ? span.textContent : valueEl.textContent);
      }
    }
    return '';
  }

  function getReceiveInfoValueByLabel(receiveInfo, labelIncludes) {
    if (!receiveInfo) return '';
    const wrappers = Array.from(receiveInfo.querySelectorAll('.info-wrapper'));
    for (const w of wrappers) {
      const lab = cleanText(w.querySelector('.label')?.textContent);
      if (lab.includes(labelIncludes)) {
        return cleanText(w.querySelector('.value')?.textContent);
      }
    }
    return '';
  }

  /**
   * ✅ 平台单号：只从 vxe-table 中 “订单信息” 这一列提取
   * 步骤：
   * 1) 找到 header 中标题文字=订单信息 的 th，拿到 colid
   * 2) 在同一个 vxe-table（同 xid）对应的 body 里，找 td[colid=该colid]，取 span 文本
   *
   */
  function findPlatformOrderNumberFromOrderInfoColumn() {
    // 找所有 vxe-table 的主容器
    const wrappers = Array.from(document.querySelectorAll('.vxe-table--main-wrapper'));

    const isVisible = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    // 从一个 wrapper 中取平台单号
    const extractFromWrapper = (wrapper) => {
      if (!wrapper) return '';

      // 1) header 里找到“订单信息”的 th
      const headerWrapper = wrapper.querySelector('.vxe-table--header-wrapper');
      if (!headerWrapper) return '';

      const ths = Array.from(headerWrapper.querySelectorAll('th.vxe-header--column'));
      let orderInfoColId = '';
      for (const th of ths) {
        const titleText = cleanText(th.querySelector('.vxe-cell--title')?.textContent);
        if (titleText === '订单信息' || titleText.includes('订单信息')) {
          orderInfoColId = th.getAttribute('colid') || '';
          break;
        }
      }
      if (!orderInfoColId) return '';

      // 2) body 里找 td[colid=orderInfoColId]
      const bodyWrapper = wrapper.querySelector('.vxe-table--body-wrapper');
      if (!bodyWrapper) return '';

      // body 表格
      const bodyTable = bodyWrapper.querySelector('table.vxe-table--body');
      if (!bodyTable) return '';

      // 找到第一行（一般详情页就一行；如果多行也优先取第一条有值的）
      const tds = Array.from(bodyTable.querySelectorAll(`td[colid="${orderInfoColId}"]`));
      for (const td of tds) {
        const box = td.querySelector('div.vxe-cell.c--tooltip div.ak-align-center.oneLine');
        if (!box) continue;

        const hasCopyIcon = !!box.querySelector('i.iconfont.lx_copy');
        if (!hasCopyIcon) continue;

        const span = box.querySelector('span');
        const text = cleanText(span?.textContent);
        if (!text) continue;
        if (!/\d/.test(text)) continue;

        return text;
      }

      return '';
    };

    // 优先：可见的 wrapper
    for (const w of wrappers) {
      if (!isVisible(w)) continue;
      const v = extractFromWrapper(w);
      if (v) return v;
    }

    // 兜底：不可见也扫一遍
    for (const w of wrappers) {
      const v = extractFromWrapper(w);
      if (v) return v;
    }

    return '';
  }

  // ========= 核心 =========
  function copyInfo() {
    const missing = [];
    try {
      const receiveInfo = document.querySelector('div.receive-info');
      if (!receiveInfo) missing.push('收件信息区域(receive-info)未找到');

      const recipient = receiveInfo ? cleanText(receiveInfo.querySelector('.info-wrapper:nth-child(1) .value')?.textContent) : '';
      if (!recipient) missing.push('收件人未找到');

      const phoneRaw = receiveInfo ? getReceiveInfoValueByLabel(receiveInfo, '电话') : '';
      if (!phoneRaw) missing.push('电话未找到');
      const phone = `电话：${phoneRaw}`;

      const postalCode = receiveInfo ? getReceiveInfoValueByLabel(receiveInfo, '邮编') : '';
      if (!postalCode) missing.push('邮编未找到');

      const addressElement = receiveInfo ? cleanText(receiveInfo.querySelector('.receive-address-box .value')?.textContent) : '';
      const address = normalizeCityState(addressElement);
      if (!address) missing.push('城市/州未找到');

      const detailedAddress = receiveInfo ? cleanText(receiveInfo.querySelector('.detail-address-box .value')?.textContent) : '';
      if (!detailedAddress) missing.push('详细地址未找到');

      const recipientInfo = [
        recipient,
        detailedAddress,
        address,
        postalCode,
        phone
      ].filter(Boolean).join('\n');

      // ✅ 平台单号（只认“订单信息”列）
      const platformOrderNumber = findPlatformOrderNumberFromOrderInfoColumn();
      if (!platformOrderNumber) missing.push('平台单号未找到(表格列标题=订单信息)');

      // 商品信息：detail-box-left
      const detailBoxLeft = getDetailBoxLeft();
      if (!detailBoxLeft) missing.push('商品信息区域(detail-box-left)未找到');

      const itemTitle = detailBoxLeft ? cleanText(detailBoxLeft.querySelector('.item-title')?.textContent) : '';
      let brand = itemTitle ? itemTitle.split(' ')[0] : '';
      if (!brand) missing.push('店铺名/品牌未找到(item-title)');

      const fullStoreName = getStoreNameFromPage();
      if (fullStoreName && storeToBrandMap[fullStoreName]) {
        brand = storeToBrandMap[fullStoreName];
      }

      const sku = detailBoxLeft ? getGridValue(detailBoxLeft, 'SKU') : '';
      if (!sku) missing.push('SKU未找到(item-grid)');

      const productName = detailBoxLeft ? getGridValue(detailBoxLeft, '品名') : '';
      if (!productName) missing.push('品名未找到(item-grid)');

      // 店铺输出兜底
      let storeShort = brandNameMap[brand];
      if (!storeShort) {
        if (fullStoreName) {
          storeShort = fullStoreName;
          missing.push('未匹配品牌，已使用页面店铺名');
        } else {
          storeShort = brand ? brand.substring(0, 3).toUpperCase() : 'N/A';
          if (!brand) missing.push('品牌简称匹配失败');
        }
      }

      const output = [
        platformOrderNumber || '平台单号未找到',
        recipientInfo,
        `货号：${sku || 'SKU 未找到'}`,
        `店铺：${storeShort || 'N/A'}`,
        `${productName || '品名未找到'}，`
      ].join('\n');

      GM_setClipboard(output);

      if (missing.length > 0) {
        showNotification(`已复制（未匹配品牌）\n- ${missing.join('\n- ')}`, 3400);
      } else {
        showNotification('复制成功！');
      }
    } catch (err) {
      console.error('[领星售后信息复制] Error:', err);
      showNotification('复制失败：页面结构可能已变更', 3400);
    }
  }

  button.addEventListener('click', copyInfo);

  // ========= 启用按钮 =========
  const observer = new MutationObserver(() => {
    const receiveInfo = document.querySelector('div.receive-info');
    const detailBoxLeft = getDetailBoxLeft();
    if (receiveInfo && detailBoxLeft) {
      button.disabled = false;
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    const receiveInfo = document.querySelector('div.receive-info');
    const detailBoxLeft = getDetailBoxLeft();
    if (receiveInfo && detailBoxLeft) button.disabled = false;
  }, 2500);

})();
