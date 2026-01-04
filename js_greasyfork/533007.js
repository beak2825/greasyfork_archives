// ==UserScript==
// @name         Bushiroad 购物车
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  批量加入购物车
// @match        https://bushiroad-store.com/pages/*
// @match        https://bushiroad-store.com/collections/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533007/Bushiroad%20%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/533007/Bushiroad%20%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const style = document.createElement('style');
  style.textContent = `
    input.qty-input {
      width: 80px;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      font-size: 20px;
    }
    .limit-info {
      font-size: 20px;
      color: #d32f2f;
      margin-bottom: 6px;
    }
    .add-progress {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      width: 140px;
    }
    .add-progress .bar {
      width: 100%;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }
    .add-progress .fill {
      height: 100%;
      width: 0%;
      background: #28a745;
      transition: width 0.3s ease;
    }
    .add-progress .text {
      font-size: 20px;
      color: #333;
      text-align: center;
      width: 100%;
    }
  `;
  document.head.appendChild(style);

  const progressBox = document.createElement('div');
  progressBox.className = 'add-progress';
  progressBox.innerHTML = `
    <div class="bar"><div class="fill"></div></div>
    <div class="text">0 / 0</div>
  `;
  const fillBar = progressBox.querySelector('.fill');
  const textBar = progressBox.querySelector('.text');
  const updateProgress = (cur, total) => {
    fillBar.style.width = `${(cur / total) * 100}%`;
    textBar.textContent = `${cur} / ${total}`;
  };
  const resetProgress = () => {
    fillBar.style.width = '0%';
    textBar.textContent = `0 / 0`;
  };

  const products = Array.from(document.querySelectorAll('.product-item[data-id][data-variants]')).map(el => {
    const imageWrapper = el.querySelector('.product-item__image-wrapper');
    const link = el.querySelector('a')?.getAttribute('href');
    const priceTextRaw = el.querySelector('.product-item__price-list .price')?.textContent || '';
    const priceMatch = priceTextRaw.match(/([0-9,]+円)/);
    const priceText = priceMatch ? `価格：${priceMatch[1]}` : '価格不明';
    return {
      title: el.getAttribute('data-title'),
      productId: el.getAttribute('data-id'),
      variantId: el.getAttribute('data-variants'),
      sectionId: el.querySelector('form input[name="section-id"]')?.value || '',
      imageHtml: imageWrapper?.outerHTML || '',
      productUrl: link ? new URL(link, location.origin).href : '',
      priceText
    };
  });
  if (products.length === 0) return;

  const btnContainer = document.createElement('div');
  Object.assign(btnContainer.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  });

  const createStyledButton = (label, bgColor) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      background: bgColor,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      fontSize: '16px'
    });
    return btn;
  };

  const toggleBtn = createStyledButton('🛒 打开购物车', '#0070f3');
  const addBtn = createStyledButton('✅ 加入购物车', '#28a745');
  btnContainer.appendChild(toggleBtn);
  btnContainer.appendChild(addBtn);
  document.body.appendChild(btnContainer);

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '20px',
    left: '20px',
    right: '20px',
    bottom: '80px',
    background: '#fff',
    border: '1px solid #ccc',
    padding: '16px',
    zIndex: '9999',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    borderRadius: '12px',
    fontSize: '20px',
    display: 'none',
    boxSizing: 'border-box',
  });

  const titleBar = document.createElement('div');
  titleBar.innerHTML = `<div style="font-size: 20px; font-weight: bold; margin-bottom: 12px;">🛒 购物车（共 ${products.length} 项）</div>`;
  panel.appendChild(titleBar);

  const grid = document.createElement('div');
  Object.assign(grid.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '12px',
  });
  panel.appendChild(grid);

  const itemRows = [];

  products.forEach((p, i) => {
    const id = `chk_${i}`;
    const row = document.createElement('div');
    row.className = 'product-row';
    row.id = `row_${i}`;
    Object.assign(row.style, {
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #eee',
      padding: '10px',
      borderRadius: '6px',
    });

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = '1';
    qtyInput.className = 'qty-input';
    qtyInput.id = `${id}_qty`;

    const limitSpan = document.createElement('div');
    limitSpan.className = 'limit-info';

    row.innerHTML = `
      <label style="display: flex; align-items: center; margin-bottom: 8px; font-weight: bold;">
        <input type="checkbox" id="${id}" style="margin-right: 10px; transform: scale(1.5); cursor: pointer;" />
        <span>${p.title}</span>
      </label>
      <div style="width: 100%; margin-bottom: 8px;">${p.imageHtml}</div>
      <div style="font-size: 20px; color: #444; margin-bottom: 4px;">${p.priceText}</div>
    `;
    row.appendChild(limitSpan);
    row.appendChild(qtyInput);
    grid.appendChild(row);

    itemRows.push({ checkboxId: id, qtyId: qtyInput.id, qtyInput, limitSpan, ...p });

    // 限购与售罄判断
    fetch(p.productUrl)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // ❌ 检查是否已售罄
        const soldOutBtn = doc.querySelector('.product-form__add-button.button--disabled');
        const soldOutText = soldOutBtn?.textContent?.trim();
        const checkbox = row.querySelector(`#${id}`);
        if (soldOutText === '在庫なし') {
          checkbox.disabled = true;
          checkbox.checked = false;
          qtyInput.disabled = true;
          qtyInput.style.backgroundColor = '#eee';
          qtyInput.style.cursor = 'not-allowed';

          const soldOutNotice = document.createElement('div');
          soldOutNotice.textContent = '❌ 已售罄';
          soldOutNotice.style.color = 'red';
          soldOutNotice.style.fontSize = '20px';
          soldOutNotice.style.marginTop = '4px';
          row.appendChild(soldOutNotice);
          return;
        }

        // 📌 限购识别
        const descText = doc.querySelector('.product__short-description')?.textContent || '';
        const metaLimit = doc.querySelector('.max__product-metafield')?.textContent || '';
        const allLimitText = descText + metaLimit;
        const limitMatch = allLimitText.match(/お(?:一)?人様\s*(\d+)\s*点まで/);
        if (limitMatch) {
          const max = parseInt(limitMatch[1], 10);
          qtyInput.max = max;
          if (max === 1) {
            qtyInput.value = '1';
            qtyInput.readOnly = true;
            qtyInput.style.backgroundColor = '#f0f0f0';
            qtyInput.style.cursor = 'not-allowed';
          }
          limitSpan.textContent = `📌 限购：每人限购 ${max} 件`;
        }
      });
  });

  document.body.appendChild(panel);

  toggleBtn.addEventListener('click', () => {
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    toggleBtn.textContent = isVisible ? '🛒 打开购物车' : '❌ 隐藏购物车';
  });

  addBtn.addEventListener('click', async () => {
    btnContainer.insertBefore(progressBox, toggleBtn);

    const selected = itemRows
      .filter(item => {
        const checkbox = document.getElementById(item.checkboxId);
        return checkbox.checked && !checkbox.disabled;
      })
      .map(item => {
        const qty = parseInt(document.getElementById(item.qtyId).value || '1', 10);
        const max = parseInt(document.getElementById(item.qtyId).max || '999', 10);
        return { ...item, quantity: Math.min(qty, max) };
      })
      .filter(item => item.quantity > 0);

    if (selected.length === 0) {
      alert('请至少选择一个有效商品');
      progressBox.remove();
      return;
    }

    updateProgress(0, selected.length);
    for (let i = 0; i < selected.length; i++) {
      const product = selected[i];
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2);
      const body = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="form_type"\r\n`,
        `product`,
        `--${boundary}`,
        `Content-Disposition: form-data; name="utf8"\r\n`,
        `✓`,
        `--${boundary}`,
        `Content-Disposition: form-data; name="quantity"\r\n`,
        `${product.quantity}`,
        `--${boundary}`,
        `Content-Disposition: form-data; name="id"\r\n`,
        product.variantId,
        `--${boundary}`,
        `Content-Disposition: form-data; name="product-id"\r\n`,
        product.productId,
        `--${boundary}`,
        `Content-Disposition: form-data; name="section-id"\r\n`,
        product.sectionId,
        `--${boundary}--`
      ].join('\r\n');

      try {
        await fetch("https://bushiroad-store.com/cart/add", {
          method: "POST",
          headers: { "Content-Type": `multipart/form-data; boundary=${boundary}`, "Accept": "text/html" },
          credentials: "include",
          body
        });
      } catch (err) {
        console.error(`[失败] ${product.title}`, err);
      }

      updateProgress(i + 1, selected.length);
      await sleep(500);
    }

    textBar.textContent = '✅ 完成';
    fillBar.style.width = '100%';

    setTimeout(() => {
      resetProgress();
      progressBox.remove();
    }, 3000);

    window.location.href = "https://bushiroad-store.com/cart";
  });
})();
