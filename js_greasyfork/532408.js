// ==UserScript==
// @name         Nolets 超速先行
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  图形化选择商品并一次性全部加入购物车，支持库存显示、参数记忆、进度条、结果展示、更新库存,加入了保存参数重启功能
// @match        https://nolets.jp/*/store/*
// @include      https://nolets.jp/*store*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532408/Nolets%20%E8%B6%85%E9%80%9F%E5%85%88%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/532408/Nolets%20%E8%B6%85%E9%80%9F%E5%85%88%E8%A1%8C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForElement(selector, callback) {
    const target = document.querySelector(selector);
    if (target) return callback();
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function clearCookiesAndReload() {
    const cookies = document.cookie.split(";") || [];
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    alert("🍪 Cookie 已清除，页面即将刷新");
    setTimeout(() => location.reload(), 500);
  }

  async function ensureParams() {
    const wrapper = document.createElement("div");
    wrapper.style = "position: fixed; top: 60px; right: 20px; z-index: 9999; background: white; border: 1px solid #ccc; padding: 10px; width: 400px; font-size: 14px; max-height: 90vh; overflow-y: auto;";
    document.body.appendChild(wrapper);

    const title = document.createElement("h3");
    title.textContent = "🔐 Nolets 参数配置";
    title.style.marginTop = "0";
    wrapper.appendChild(title);

    const fields = ["login_id", "access_token", "session_id", "customer_id"];
    const values = {};
    for (const key of fields) {
      const val = await GM_getValue(key, "");
      values[key] = val;
      const label = document.createElement("div");
      label.innerHTML = key + ': <input type="text" id="' + key + '_input" style="width: 100%;" value="' + val + '">';
      wrapper.appendChild(label);
    }

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 保存配置";
    wrapper.appendChild(saveBtn);


    return new Promise(resolve => {
      saveBtn.onclick = async () => {
        for (const key of fields) {
          const v = document.getElementById(key + "_input").value.trim();
          await GM_setValue(key, v);
          values[key] = v;
        }
        wrapper.remove();
        resolve(values);
      };
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getStoreIdFromURL() {
    const match = window.location.href.match(/store_id=(\d+)/);
    if (!match) {
      alert("⚠️ 当前页面 URL 中未找到 store_id");
      return null;
    }
    return parseInt(match[1]);
  }

  async function fetchItemList({ login_id, access_token, store_id, session_id }) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const url = `https://admin.nolets.jp/V5/API/users/item?login_id=${encodeURIComponent(login_id)}&access_token=${access_token}&host=nolets.jp&app=order&store_id=${store_id}&method=system&limit=2000&offset=0&fhtg=2&category_id=all&start_datetime=${today}&end_datetime=${today}&session_id=${session_id}`;
    const res = await fetch(url, { headers: { "accept": "application/json, text/plain, */*" }, method: "GET" });
    const json = await res.json();
    return json?.ItemsInfo.map(item => ({
      item_id: item.item_id,
      name: item.name,
      value: item.value,
      stock: parseInt(item.total_stock),
      max_stock: parseInt(item.max_sale_stock || 0)
    })) || [];
  }

  function matchImageByName(products) {
    const itemElements = document.querySelectorAll('.NoletsItem_menu-item-com__EwMYv');
    for (const el of itemElements) {
      const nameEl = el.querySelector('.NoletsItem_item-title__bH8qQ');
      const imgEl = el.querySelector('img');
      if (!nameEl || !imgEl) continue;
      const name = nameEl.textContent.trim();
      const imageUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || '';
      for (const p of products) {
        if (name === p.name || name.includes(p.name) || p.name.includes(name)) {
          p.img = imageUrl;
          break;
        }
      }
    }
  }

  async function createUI(products, store_id) {
    const wrapper = document.createElement('div');
    wrapper.style = 'position:fixed; top:20px; right:20px; z-index:9999; background:#fff; border:1px solid #ccc; padding:10px; max-height:80vh; overflow:auto; font-size:14px; width:440px;';
    document.body.appendChild(wrapper);

    const login_id = await GM_getValue('login_id', '');
    const customer_id = await GM_getValue('customer_id', '');
    const session_id = await GM_getValue('session_id', '');
    const access_token = await GM_getValue('access_token', '');

    wrapper.innerHTML = `
      <style>
        .nolets-ui * { font-family: "Segoe UI", sans-serif; box-sizing: border-box; }
        .nolets-ui h3 { margin: 0 0 10px; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .nolets-ui input[type="text"], .nolets-ui input[type="number"] {
          width: 100%; padding: 5px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;
        }
        .nolets-ui .product-card {
          border: 1px solid #e0e0e0; border-radius: 5px; padding: 5px; margin: 5px 0;
          display: flex; align-items: center; gap: 10px;
        }
        .nolets-ui .product-card.low-stock {
          background-color: #ffe5e5;
          border: 1px solid #ff6b6b;
        }
        .nolets-ui .product-card img { height: 50px; width: auto; border-radius: 4px; }
        .nolets-ui .product-info { flex: 1; }
        .nolets-ui button {
          width: 100%; padding: 10px; background: #007bff; color: white;
          font-weight: bold; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;
        }
        .nolets-ui button:hover { background: #0056b3; }
        .nolets-ui .result-box {
          background: #f9f9f9; border: 1px solid #ccc; padding: 10px; margin-top: 10px; font-size: 13px; white-space: pre-line;
          max-height: 200px; overflow-y: auto;
        }
      </style>
      <div class="nolets-ui">
        <h3>🛒 Nolets 助手</h3>
        <button id="nolets_clear_cookie" style="background:#dc3545;">🧹 清除 Cookie 并刷新</button>
        <label>customer_id</label><input type="text" id="nolets_customer_id" value="${customer_id}">
        <label>login_id</label><input type="text" id="nolets_login_id" value="${login_id}">
        <label>session_id</label><input type="text" id="nolets_session_id" value="${session_id}">
        <label>access_token</label><input type="text" id="nolets_access_token" value="${access_token}">
        <button id="nolets_restart_script" style="background:#ffc107; margin-top:8px;">💾 保存参数并重启</button>
        <div id="nolets_product_list"></div>
      </div>
    `;

    const productList = wrapper.querySelector('#nolets_product_list');
    const resultBox = document.getElementById('nolets_result_box');
    const progressBar = document.getElementById('nolets_progress');
    const progressText = document.getElementById('nolets_progress_text');
    wrapper.querySelector('#nolets_clear_cookie').addEventListener('click', clearCookiesAndReload);

    products.forEach(p => {
      const item = document.createElement('div');
      item.className = 'product-card';
      if (p.stock < 3) item.classList.add('low-stock');
      item.innerHTML = `
        <img src="${p.img || "https://nolets.jp/files/item/main/" + p.item_id + ".jpg"}">
        <div class="product-info">
          <b>${p.name}</b>
          价格: ¥${p.value} <br>
          库存: ${p.stock} / ${p.max_stock} <br>
          数量:
          <input type="number" min="0" value="0" data-id="${p.item_id}" data-name="${p.name}" data-price="${p.value}" style="width:60px;">
        </div>`;
      productList.appendChild(item);
    });



// 创建并插入面板外部的按钮
const refreshBtn = document.createElement("button");
refreshBtn.textContent = "🔄 更新商品列表";
refreshBtn.style = `
  position: fixed;
  right: 20px;
  top: calc(20px + 80vh + 10px); /* 浮动面板底部+10px */
  z-index: 9999;
  background: #28a745;
  color: white;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
`;
document.body.appendChild(refreshBtn);

refreshBtn.onclick = async () => {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "🔄 更新中...";
  const login_id = await GM_getValue('login_id', '');
  const access_token = await GM_getValue('access_token', '');
  const session_id = await GM_getValue('session_id', '');
  const updated = await fetchItemList({ login_id, access_token, store_id, session_id });
  await new Promise(resolve => waitForElement('.NoletsItem_menu-item-com__EwMYv', resolve));
  matchImageByName(updated);
  updateProductListUI(updated);
  refreshBtn.textContent = "✅ 已更新";
  setTimeout(() => {
    refreshBtn.disabled = false;
    refreshBtn.textContent = "🔄 更新商品列表";
  }, 500);
};


// 浮动按钮：一键加入购物车
const addAllBtn = document.createElement("button");
addAllBtn.textContent = "🚀 一键全部加入";
addAllBtn.style = `
  position: fixed;
  right: 20px;
  top: calc(20px + 80vh + 60px); /* 更新按钮下方 */
  z-index: 9999;
  background: #007bff;
  color: white;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
`;
document.body.appendChild(addAllBtn);

// 按钮点击事件不变，直接复制原来 submit_all 的逻辑：
addAllBtn.addEventListener('click', async () => {
  progressBar.style.display = 'block';
  progressText.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = '进度：0%';

  const now = new Date().toISOString().replace('T', ' ').split('.')[0];
  const allInputs = Array.from(document.querySelectorAll('input[type="number"]'));
  const actionable = allInputs.filter(i => parseInt(i.value));
  const total = actionable.length;
  let done = 0;
  const summary = [];

  for (const input of actionable) {
    const amount = parseInt(input.value);
    const item_id = input.dataset.id;
    const name = input.dataset.name;
    const price = parseInt(input.dataset.price);
    const payload = {
      orders: { [item_id]: { item_id, item_name: name, item_amount: amount, item_price: price, price, customer_id, store_id, reservation_time: now } },
      order: { item_id, item_name: name, item_amount: amount, item_price: price, price, customer_id, store_id, reservation_time: now },
      store_id: String(store_id), customer_id, login_id, ticket_check: 0, item_id, item_amount: amount, val: 1, cart_flag: "1", reservation_time: now, session_id
    };

    try {
      const res = await fetch("https://admin.nolets.jp/V5/API/users/preorder", {
        method: "POST",
        headers: { 'accept': 'application/json, text/plain, */*', 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      summary.push(result.message ? `✅ ${name}: ${result.message}` : `❌ ${name}: 未知错误`);
    } catch {
      summary.push(`❌ ${name}: 网络错误`);
    }

    done++;
    const percent = Math.round((done / total) * 100);
    progressBar.value = percent;
    progressText.textContent = `进度：${percent}% (${done}/${total})`;
    await delay(50);
  }

  progressText.textContent = '✅ 加入完成';
  resultBox.textContent = summary.length ? `📦 加入结果：\n\n${summary.join('\n')}` : '⚠️ 未填写任何商品数量。';

  const cartBtn = document.querySelector('p.CartButton_cart-button__OXxbp.CartButton_extended__BfhJ8');
  if (cartBtn) {
    cartBtn.click();
    console.log("🛒 已模拟点击购物车按钮");
  } else {
    console.warn("⚠️ 未找到购物车按钮");
  }
});

document.getElementById("nolets_restart_script").addEventListener("click", async () => {
  const btn = document.getElementById("nolets_restart_script");
  btn.textContent = "🔄 正在重启...";
  btn.disabled = true;

  // 保存参数
  const keys = ["login_id", "access_token", "session_id", "customer_id"];
  for (const key of keys) {
    const val = document.getElementById("nolets_" + key).value.trim();
    await GM_setValue(key, val);
  }

  // 清除所有脚本相关内容
  const selectorsToRemove = [
    ".nolets-ui",                   // 右侧浮动 UI
    "#nolets_product_list",         // 商品区域
    "#nolets_result_box",           // 结果框
    "#nolets_progress",             // 进度条
    "#nolets_progress_text",        // 进度文本
    "#nolets_clear_cookie",         // cookie 按钮
    "#nolets_restart_script",       // 重启按钮本身
    "button[style*='right: 20px']", // 浮动按钮
    ".nolets-cart-panel"            // 🆕 添加的购物车面板
  ];

  selectorsToRemove.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  // 提示 + 重启
  await delay(500);
  showCartPanel(); // 🔁 重建购物车面板
  start();         // 🔁 重建商品面板
});

  }

  function updateProductListUI(products) {
  const productList = document.getElementById("nolets_product_list");
  if (!productList) return;
  productList.innerHTML = "";
  products.forEach(p => {
    const item = document.createElement('div');
    item.className = 'product-card';
    if (p.stock < 3) item.classList.add('low-stock');
    item.innerHTML = `
      <img src="${p.img || "https://nolets.jp/files/item/main/" + p.item_id + ".jpg"}">
      <div class="product-info">
        <b>${p.name}</b>
        价格: ¥${p.value} <br>
        库存: ${p.stock} / ${p.max_stock} <br>
        数量:
        <input type="number" min="0" value="0" data-id="${p.item_id}" data-name="${p.name}" data-price="${p.value}" style="width:60px;">
      </div>`;
    productList.appendChild(item);
  });
}

  async function start() {
    const store_id = getStoreIdFromURL();
    if (!store_id) return;
    let login_id = await GM_getValue("login_id", "");
    let access_token = await GM_getValue("access_token", "");
    let session_id = await GM_getValue("session_id", "");
    let customer_id = await GM_getValue("customer_id", "");
    if (!login_id || !access_token || !session_id || !customer_id) {
      const params = await ensureParams();
      login_id = params.login_id;
      access_token = params.access_token;
      session_id = params.session_id;
      customer_id = params.customer_id;
    }

    const products = await fetchItemList({ login_id, access_token, session_id, store_id });
    await new Promise(resolve => waitForElement('.NoletsItem_menu-item-com__EwMYv', resolve));
    matchImageByName(products);
    await createUI(products, store_id);
  }


  async function fetchCartList() {
  const login_id = await GM_getValue("login_id", "");
  const access_token = await GM_getValue("access_token", "");
  const customer_id = await GM_getValue("customer_id", "");
  const store_id = getStoreIdFromURL();
  if (!login_id || !access_token || !store_id || !customer_id) {
    console.warn("❌ 缺少参数：login_id, access_token, store_id, customer_id");
    return [];
  }

  const url = `https://admin.nolets.jp/V5/API/users/preorder?login_id=${encodeURIComponent(login_id)}&access_token=${access_token}&store_id=${store_id}&oem_id=287&customer_id=${customer_id}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "application/json, text/plain, */*"
      }
    });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log("🛒 购物车响应 JSON：", json);
      if (!json || !json.OrderInfo || !Array.isArray(json.OrderInfo)) {
        console.warn("⚠️ 购物车接口返回异常结构");
        return [];
      }
      return json.OrderInfo;
    } catch (parseErr) {
      console.error("❌ JSON 解析失败，返回内容如下：\n", text);
      return [];
    }
  } catch (err) {
    console.error("❌ 获取购物车失败", err);
    return [];
  }
}

  async function deleteCartItem(item) {
    const session_id = await GM_getValue("session_id", "");
    const payload = {
      orders: {
        item_id: item.item_id,
        item_name: item.item_name,
        variation_ids: {},
        variation_name: {},
        variation_name_en: {},
        item_amount: parseInt(item.item_amount),
        item_price: parseInt(item.item_price),
        price: parseInt(item.item_price),
        order_id: 0,
        fhtg: 0,
        bo_flag: "",
        detail_id: 0,
        item_state: 0,
        smaregi_item_id: "",
        smaregi_item_type: "",
        smaregi_menu_ids: {},
        smaregi_topping_ids: {},
        smaregi_custom_content_ids: {},
        before_time: 0,
        before_time_tmp: 0,
        after_time: 0,
        after_time_tmp: 0,
        customer_id: item.customer_id,
        store_id: item.store_id,
        tax_type: 2,
        tax_reduce: 2,
        options: [],
        plan_all_stocks: "",
        plan_cat: "",
        inPlan: false,
        plan_finish: "",
        reservation_time: item.reservation_time
      },
      store_id: item.store_id,
      item_id: item.item_id,
      customer_id: item.customer_id,
      delete_flag: "1",
      ticket_check: 0,
      session_id: item.session_id
    };

    const res = await fetch("https://admin.nolets.jp/V5/API/users/preorder", {
      method: "POST",
      headers: { 'accept': 'application/json, text/plain, */*', 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return await res.json();
  }

  async function showCartPanel() {
  const container = document.createElement("div");
  container.classList.add("nolets-cart-panel");
  container.style = "position:fixed; top:20px; left:20px; background:white; border:1px solid #ccc; padding:10px; max-height:80vh; overflow:auto; z-index:9999; width:400px; font-size:13px;";
  container.innerHTML = `
    <h4>🧾 当前购物车</h4>
    <div style="display:flex; gap:8px; margin-bottom:10px;">
      <button id="nolets_clear_all_cart" style="background:#dc3545; color:white; padding:6px 10px; border:none; border-radius:4px; cursor:pointer;">🗑 一键清空购物车</button>
      <button id="nolets_refresh_cart" style="background:#007bff; color:white; padding:6px 10px; border:none; border-radius:4px; cursor:pointer;">🔄 读取购物车</button>
    </div>
    <div id="nolets_cart_list">加载中...</div>
    <progress id="nolets_progress" value="0" max="100" style="
    width:100%; height:16px; margin-top:10px; display:none;
    "></progress>
    <div id="nolets_progress_text" style="
    font-size:12px; margin-top:4px; display:none;
    ">进度：0%</div>

  <div id="nolets_result_box" style="
  margin-top:10px;
  background:#f9f9f9;
  border:1px solid #ccc;
  padding:10px;
  font-size:13px;
  white-space:pre-line;
  max-height:200px;
  overflow-y:auto;
  border-radius:4px;
">📦 加入结果将在此显示...</div>
  `;
  document.body.appendChild(container);

  async function renderCartList() {
    const cartList = container.querySelector("#nolets_cart_list");
    cartList.innerHTML = "";

    const cart = await fetchCartList();
    if (cart.length === 0) {
      cartList.innerHTML = "<p>购物车为空或加载失败。</p>";
      return;
    }

    for (const item of cart) {
      const el = document.createElement("div");
      el.style = "border-bottom:1px solid #eee; padding:4px;";
      el.innerHTML = `
        🛍 <b>${item.item_name}</b><br>
        数量: ${item.item_amount} &nbsp; 价格: ¥${item.item_price} <br>
        <button style="margin-top:4px;" data-id="${item.item_id}">🗑 删除</button>
      `;
      el.querySelector("button").onclick = async () => {
        el.querySelector("button").disabled = true;
        el.querySelector("button").textContent = "⏳ 删除中...";
        const res = await deleteCartItem(item);
        el.innerHTML += `<div style="color:gray;">${res.message || "已尝试删除。"}</div>`;
        await renderCartList();
      };
      cartList.appendChild(el);
    }
  }

  container.querySelector("#nolets_clear_all_cart").onclick = async () => {
    const btn = container.querySelector("#nolets_clear_all_cart");
    btn.disabled = true;
    btn.textContent = "⏳ 正在删除...";

    const cart = await fetchCartList();
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      await deleteCartItem(item);
      await renderCartList();
      await delay(100);
    }

    btn.textContent = "✅ 删除完成，页面即将刷新...";
    setTimeout(() => {
      location.reload();
    }, 1500);
  };

  container.querySelector("#nolets_refresh_cart").onclick = async () => {
    container.querySelector("#nolets_cart_list").innerHTML = "🔄 刷新中...";
    await renderCartList();
  };

  renderCartList();
}

  // 自动展示购物车面板
  showCartPanel();
  start();
})();
