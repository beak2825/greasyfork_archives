// ==UserScript==
// @name        金额二次确认
// @namespace   Violentmonkey Scripts
// @match       http://admin.smart777v.com/main*
// @grant       none
// @version     2.0
// @author      -
// @description 2025/8/11 09:46:25
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545355/%E9%87%91%E9%A2%9D%E4%BA%8C%E6%AC%A1%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/545355/%E9%87%91%E9%A2%9D%E4%BA%8C%E6%AC%A1%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

// src/observer/ContentObserver.ts
var orderPageNames = ["/allOrders", "/waitQuotationOrder", "/waitBuyOrder", "/toBeSent", "/tax", "/sentOrder"];
var inventoryPageNames = ["/waitBuyInventory", "/inventoryConfirmTable", "/sentInventory"];
var logisticsPageNames = ["/logisticsDocking", "/consignmentLogistics"];
var systemPageNames = ["/recharge"];
var PAGE_NAMES = [
  ...orderPageNames,
  ...inventoryPageNames,
  ...logisticsPageNames,
  ...systemPageNames
];

class DynamicLoaderObserver {
  sidebarMenu;
  mainDiv;
  DEFAULT_OBSERVER_OPTS = {
    childList: true,
    subtree: false,
    attributes: false,
    characterData: false
  };
  pageConfigMap = new Map;
  mainObserver = null;
  childObservers = [];
  isProcessingMutations = false;
  constructor(sidebarMenu, mainDiv) {
    if (!mainDiv || !sidebarMenu) {
      throw new Error("mainDiv and sidebarMenu must be valid DOM elements");
    }
    this.sidebarMenu = sidebarMenu;
    this.mainDiv = mainDiv;
    this.bindMenuClick();
  }
  registerPage(pageName, config) {
    this.pageConfigMap.set(pageName, { ...config, pageName });
  }
  registerPages(pageNames, config) {
    for (const pageName of pageNames) {
      this.registerPage(pageName, config);
    }
  }
  bindMenuClick() {
    function assertPageName(name) {
      return PAGE_NAMES.includes(name) ? name : null;
    }
    this.sidebarMenu.addEventListener("click", (e) => {
      const target = e.target;
      const menuItem = target.closest("li");
      const a = menuItem?.querySelector("a[data-url]");
      if (menuItem && a) {
        const pageName = assertPageName(a.dataset.url || "");
        if (pageName) {
          const config = this.pageConfigMap.get(pageName);
          if (config) {
            this.handlePageLoad(config);
          }
        }
      }
    });
  }
  handlePageLoad(config) {
    this.cleanupObservers();
    if (config.mainSelector) {
      this.mainObserver = this.createMainObserver(config.mainSelector, config.onLoad);
      this.mainObserver.observe(this.mainDiv, this.DEFAULT_OBSERVER_OPTS);
    }
    if (config.childObservers) {
      config.childObservers.forEach((childConfig) => {
        const observer = this.createChildObserver(childConfig);
        this.childObservers.push(observer);
        const observerOptions = {
          ...this.DEFAULT_OBSERVER_OPTS,
          ...childConfig.observerOptions ?? {}
        };
        observer.observe(this.mainDiv, observerOptions);
      });
    }
  }
  createMainObserver(selector, onLoad) {
    return new MutationObserver((mutations, observer) => {
      const isLoaded = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some((node) => {
          return node instanceof HTMLElement && node.matches(selector);
        });
      });
      if (isLoaded) {
        onLoad?.();
        observer.disconnect();
      }
    });
  }
  createChildObserver(config) {
    let stabilityTimer = null;
    return new MutationObserver(() => {
      if (this.isProcessingMutations) {
        return;
      }
      this.isProcessingMutations = true;
      try {
        const targetElement = this.mainDiv.querySelector(config.selector);
        if (targetElement) {
          if (stabilityTimer)
            clearTimeout(stabilityTimer);
          stabilityTimer = setTimeout(() => {
            config.callback();
            stabilityTimer = null;
          }, config.stableTime || 0);
        }
      } finally {
        this.isProcessingMutations = false;
      }
    });
  }
  cleanupObservers() {
    this.mainObserver?.disconnect();
    this.mainObserver = null;
    this.childObservers.forEach((observer) => observer.disconnect());
    this.childObservers = [];
  }
  destroy() {
    this.cleanupObservers();
  }
}

// src/configs/recharge/btnCSS.ts
var btnCSS = `
/* 按钮基础样式 */
.toggle-btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 只有非禁用按钮才有点击下沉效果 */
.toggle-btn:not(:disabled):active {
    transform: translateY(1px);
}

/* 未开启 / 默认状态 */
.toggle-btn.off {
    background-color: #f1f3f4;
    color: #5f6368;
}

/* 已开启状态 */
.toggle-btn.on {
    background-color: #34a853;
    color: white;
}

/* 按钮内部文本样式（如 span） */
.btn-text {
    margin-left: 8px;
}

/* 禁用状态样式（推荐使用原生 disabled 属性触发） */
.toggle-btn:disabled {
    background-color: #e0e0e0 !important;
    color: #9e9e9e !important;
    cursor: not-allowed !important;
    transform: none !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}`;

// src/util/FunctionHooks.ts
class FunctionHookManager {
  hooksMap = {};
  register(hooks) {
    hooks.forEach(({ funcName, injectedFunction }) => {
      if (this.hooksMap[funcName]) {
        console.warn(`函数 ${funcName} 已注册`);
        return;
      }
      const original = window[funcName];
      if (typeof original !== "function") {
        console.warn(`函数 ${funcName} 不存在或不是函数`);
        return;
      }
      this.hooksMap[funcName] = {
        original,
        injected: injectedFunction,
        enabled: false
      };
    });
  }
  toggle(functionNames, action) {
    const names = Array.isArray(functionNames) ? functionNames : [functionNames];
    names.forEach((functionName) => {
      const hook = this.hooksMap[functionName];
      if (!hook) {
        console.warn(`函数 ${functionName} 尚未注册`);
        return;
      }
      if (action === "inject") {
        window[functionName] = hook.injected;
        hook.enabled = true;
      } else if (action === "restore") {
        window[functionName] = hook.original;
        hook.enabled = false;
      }
    });
  }
  toggleAll(action) {
    Object.keys(this.hooksMap).forEach((fn) => this.toggle(fn, action));
  }
  list() {
    return Object.entries(this.hooksMap).map(([name, data]) => ({
      functionName: name,
      status: data.enabled ? "已注入" : "已还原"
    }));
  }
}
var hooksManager = new FunctionHookManager;

// src/configs/recharge/paymentCache.ts
var CACHE_KEY = "payment_confirm_cache";
function getConfirmCache() {
  const raw = sessionStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : {};
}
function getConfirmFor(id) {
  const cache = getConfirmCache();
  return cache[id] || null;
}
function getCreatorConfimr(creatorName) {
  const cache = getConfirmCache();
  return Object.values(cache).filter((p) => p.creatorName === creatorName);
}
function setConfirmFor(id, record) {
  const cache = getConfirmCache();
  cache[id] = record;
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
var paymentCache_default = {
  getConfirmCache,
  getConfirmFor,
  getCreatorConfimr,
  setConfirmFor
};

// src/configs/recharge/template.ts
var confrim_StyleContent = `
    .confrim-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 320px;
    }
    .charge-info {
        display: flex;
        padding: 10px;
        flex-direction: column;
        gap: 5px;
        font-size: 14px;
        color: #333;
    }
    .input-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
    }

    .unit {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .unit-name, .charge-info-name {
        font-weight: bold;
    }

    .unit-canvas {
        width: 100%;
        height: 100px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        cursor: pointer;
    }

    .unit-canvas[data-active-canvas] {
        border: 2px solid #0066ff;
        background-color: #e6f0ff;
    }

    .unit-input {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .result-section {
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        background-color: #f0f0f0;
    }

    .result-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .result-value {
        font-size: 18px;
    }`;
var confrim_container_head = `
<div class="confrim-container">
    <div class="charge-info">
        <div class="charge-info-name">公司账户信息</div>
        <div>楽天銀行 第四営業支店</div>
        <div>株式会社スマート 7188953</div>
    </div>
    <div class="input-section">
        <div class="unit">
            <div class="unit-name">截图1</div>
            <canvas class="unit-canvas" id="canvas0" data-pid="0" data-active-canvas></canvas>
            <input type="text" class="unit-input" id="input0" value="">
        </div>
`;
var confrim_container_end = `
    </div>
    <div class="result-section">
        <div class="result-title">合計結果</div>
        <div class="result-value" id="result">0</div>
    </div>
</div>`;
function addUnit(length, date) {
  let html = confrim_container_head;
  for (let i = 1;i < length; i++) {
    const unitHTML = `
            <div class="unit">
                <div class="unit-name">截图${i + 1}</div>
                <canvas class="unit-canvas" id="canvas${i}" data-pid="${i}"></canvas>
                <input type="text" class="unit-input" id="input${i}" value="">
            </div>`;
    html += unitHTML;
  }
  const rechargeDateHTML = `<div class="charge-info-date">充值日期：${date}</div>`;
  return html + rechargeDateHTML + confrim_container_end;
}
function getConfirmHTML(length, rechargeInfo) {
  if (!document.querySelector("#confrim_Style")) {
    let confrim_Style = document.createElement("style");
    confrim_Style.id = "confrim-Style";
    confrim_Style.textContent = confrim_StyleContent;
    document.head.appendChild(confrim_Style);
  }
  return addUnit(length, rechargeInfo.rechargeDate);
}
function initialization() {
  let canvasSample = {
    canvas0: "#ff9999",
    canvas1: "#99ff99",
    canvas2: "#9999ff"
  };
  document.querySelectorAll(".unit-canvas").forEach((canvas) => {
    const style = window.getComputedStyle(canvas);
    canvas.width = parseInt(style.width);
    canvas.height = parseInt(style.height);
    const canvasId = canvas.id;
    if (canvasId && canvasSample[canvasId]) {
      drawCanvas(canvasId, canvasSample[canvasId]);
    }
  });
  function drawCanvas(canvasId, color) {
    const canvas = document.querySelector(`#${canvasId}`);
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 30, 30);
  }
  let inputSection = document.querySelector(".input-section");
  if (inputSection) {
    inputSection.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement))
        return;
      const targetCanvas = target.closest(".unit-canvas");
      const currentActiveCanvas = document.querySelector(".unit-canvas[data-active-canvas]");
      if (!targetCanvas || !currentActiveCanvas) {
        return;
      }
      if (targetCanvas !== currentActiveCanvas) {
        let currentPid = Number(currentActiveCanvas.dataset.pid);
        let targetPid = Number(targetCanvas.dataset.pid);
        layerImgChange(currentPid, targetPid);
      }
    });
    inputSection.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement))
        return;
      if (target.classList.contains("unit-input")) {
        formatUnitInput(target);
        calculateUnitInputsSum();
      }
    });
  }
  document.addEventListener("paste", function(e) {
    const activeCanvas = document.querySelector(".unit-canvas[data-active-canvas]");
    if (!activeCanvas || !e.clipboardData)
      return;
    const items = e.clipboardData.items;
    for (let i = 0;i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (!blob)
          continue;
        const boloUrl = URL.createObjectURL(blob);
        const img = new Image;
        img.onload = function() {
          const ctx = activeCanvas.getContext("2d");
          if (!ctx)
            return;
          URL.revokeObjectURL(boloUrl);
          drawImageWithNewLogic(ctx, img, activeCanvas.width, activeCanvas.height);
          let input = document.querySelector(`#${activeCanvas.id.replace("canvas", "input")}`);
          if (input) {
            input.focus();
          }
        };
        img.onerror = function() {
          console.error("画像の読み込みに失敗しました。");
          URL.revokeObjectURL(boloUrl);
        };
        img.src = boloUrl;
        break;
      }
    }
  });
}
function initCanvasActive(activeCanvas) {
  document.querySelectorAll(".unit-canvas").forEach((c) => {
    c.toggleAttribute("data-active-canvas", false);
  });
  activeCanvas.toggleAttribute("data-active-canvas", true);
}
function drawImageWithNewLogic(ctx, img, canvasWidth, canvasHeight) {
  if (img.width <= canvasWidth && img.height <= canvasHeight) {
    const x2 = (canvasWidth - img.width) / 2;
    const y2 = (canvasHeight - img.height) / 2;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x2, y2, img.width, img.height);
    return;
  }
  const widthRatio = img.width / canvasWidth;
  const heightRatio = img.height / canvasHeight;
  let newWidth = 0, newHeight = 0;
  if (widthRatio > heightRatio) {
    newWidth = Math.min(canvasWidth, img.width);
    const scale = newWidth / img.width;
    newHeight = img.height * scale;
  } else {
    newHeight = Math.min(canvasHeight, img.height);
    const scale = newHeight / img.height;
    newWidth = img.width * scale;
  }
  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight) / 2;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, newWidth, newHeight);
}
function formatUnitInput(input) {
  let value = input.value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248)).replace(/[^0-9]/g, "");
  if (value === "") {
    input.value = "";
    input.dataset.value = "";
    return;
  }
  let num = Number(value);
  const formattedValue = isNaN(num) ? "" : num.toLocaleString();
  input.value = formattedValue;
  input.dataset.value = num.toString();
}
function calculateUnitInputsSum(resultSel = "#result") {
  let resultDiv = document.querySelector(resultSel);
  if (!resultDiv)
    return;
  let sum = 0;
  document.querySelectorAll(".unit-input").forEach((input) => {
    let value = input.dataset.value ? Number(input.dataset.value) : 0;
    sum += value;
  });
  resultDiv.textContent = sum.toLocaleString();
}
function layerImgChange(currentPid, targetPid) {
  if (targetPid === currentPid)
    return;
  const photoLength = 3;
  const delta = (targetPid - currentPid + photoLength) % photoLength;
  const isNext = delta < photoLength / 2;
  const direction = isNext ? "next" : "prev";
  document.querySelector(`.layui-layer-img${direction}`)?.click();
}

// src/util/ButtonStateManager.ts
class ButtonStateManager {
  static #instance = null;
  states;
  configs;
  pageResolver = null;
  static getInstance() {
    if (!ButtonStateManager.#instance) {
      ButtonStateManager.#instance = new ButtonStateManager;
    }
    return ButtonStateManager.#instance;
  }
  constructor() {
    if (ButtonStateManager.#instance) {
      throw new Error("Use ButtonStateManager.getInstance() instead of new.");
    }
    this.states = new Map;
    this.configs = new Map;
  }
  setPageResolver(resolve) {
    this.pageResolver = resolve;
  }
  getPageId() {
    if (this.pageResolver) {
      return this.pageResolver();
    }
    const activePageLi = document.querySelector("ul.sidebar-menu.tree li.active");
    const activeLink = activePageLi?.querySelector("a[data-url]");
    if (!activeLink || !activeLink.dataset?.url) {
      return null;
    }
    const urlValue = activeLink.dataset.url;
    if (typeof urlValue === "string" && PAGE_NAMES.includes(urlValue)) {
      return urlValue;
    }
    return null;
  }
  register(buttonId, config) {
    const { defaultState = false, onStateChange, pageName } = config;
    if (pageName) {
      const invalidPages = pageName.filter((p) => !PAGE_NAMES.includes(p));
      if (invalidPages.length > 0) {
        console.warn(`ButtonStateManager: Button "${buttonId}" has invalid page names: ${invalidPages.join(", ")}`);
      }
    }
    this.states.set(buttonId, defaultState);
    this.configs.set(buttonId, { defaultState, onStateChange, pageName });
  }
  updateState(buttonId, state) {
    if (!this.states.has(buttonId)) {
      console.info(`ButtonStateManager: Button "${buttonId}" is not registered.`);
      return;
    }
    const previousState = this.states.get(buttonId);
    if (previousState === state) {
      return;
    }
    this.states.set(buttonId, state);
    const config = this.configs.get(buttonId);
    if (config && config.onStateChange) {
      config.onStateChange(buttonId, state);
    }
  }
  getState(buttonId) {
    return this.states.get(buttonId) ?? false;
  }
  refreshPageButtons() {
    let pageId = this.getPageId();
    let currentPageBtnIds = {};
    if (!pageId) {
      return currentPageBtnIds;
    }
    this.configs.forEach((config, buttonId) => {
      const { pageName } = config;
      if (pageName && !pageName.includes(pageId)) {
        return;
      }
      const currentState = this.states.get(buttonId);
      if (currentState !== undefined && config && config.onStateChange) {
        currentPageBtnIds[buttonId] = currentState;
        config.onStateChange(buttonId, currentState);
      }
    });
    return currentPageBtnIds;
  }
  clearAllStates() {
    this.states.clear();
  }
  isRegistered(buttonId) {
    return this.states.has(buttonId);
  }
}
var buttonStateManager = ButtonStateManager.getInstance();

// src/configs/recharge/combine.ts
var statusStyle = `
    // .instructions {
    //     margin-top: 2rem;
    //     padding: 1rem;
    //     background-color: #e8f5e9;
    //     border-radius: 5px;
    //     border-left: 4px solid #4caf50;
    // }
    // .instructions .title {
    //     font-weight: bold;
    //     margin-bottom: 0.5rem;
    //     color: #2e7d32;
    // }
/* 选中客户的行高亮 */
.highlight-row {
    background-color: #fffbe6; /* 柔和的黄色背景 */
    font-weight: bold;
}

/* 非选中客户的行禁用样式 */
.disabled-row {
    background-color: #f5f5f5; /* 灰色背景 */
    color: #999;              /* 字体变浅 */
    cursor: not-allowed;      /* 鼠标变为禁止状态 */
}

/* 禁用行里的复选框也灰掉 */
.disabled-row input[type="checkbox"] {
    cursor: not-allowed;
    opacity: 0.5;
}

/* 侧边栏样式 */
section.sidebar aside.instructions {
    border: 1px solid #ddd;
    padding: 12px;
    margin-top: 10px;
    border-radius: 4px;
    background: #fafafa;
    font-size: 14px;
    line-height: 1.6;
}

/* 标题 */
section.sidebar aside.instructions .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

/* 客户名 */
section.sidebar aside.instructions .customer-name {
    margin-bottom: 6px;
    font-weight: 500;
    color: #555;
}

/* 金额 */
section.sidebar aside.instructions .amount {
    color: #d46b08; /* 橙色强调 */
    font-weight: bold;
}
`;
var COL_INDEX = {
  CHECKBOX: 0,
  CUSTOMER_NAME: 0,
  AMOUNT: 7
};

class CombinePayState {
  selectedCustomer = null;
  selectedCbs = new Map;
  get amount() {
    let total = 0;
    this.selectedCbs.forEach((v) => total += v);
    return total;
  }
  reset() {
    this.selectedCustomer = null;
    this.selectedCbs.clear();
  }
}

class CombinePayUI {
  state;
  styleId = "combinePayStyle";
  rechargeTbodySel = "#rechargeTable tbody";
  constructor(state) {
    this.state = state;
  }
  injectStyle(css) {
    if (document.querySelector(`#${this.styleId}`))
      return;
    const style = document.createElement("style");
    style.id = this.styleId;
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  removeStyle() {
    document.querySelector(`#${this.styleId}`)?.remove();
  }
  updateSidebar() {
    const sidebar = document.querySelector("section.sidebar");
    if (!sidebar)
      return;
    let aside = sidebar.querySelector("aside.instructions");
    if (!aside) {
      aside = document.createElement("aside");
      aside.classList.add("instructions");
      sidebar.append(aside);
    }
    aside.innerHTML = `
            <div class="title">合并支付</div>
            <div class="customer-name">${this.state.selectedCustomer || "未选择用户"}</div>
            <div class="charge-num">已选择 ${this.state.selectedCbs.size} 笔充值</div>
            <div class="amount">总金额：${this.state.amount.toLocaleString()} 円</div>
        `;
  }
  removeSidebar() {
    document.querySelector("section.sidebar aside.instructions")?.remove();
  }
  updateTable() {
    const tbody = document.querySelector(this.rechargeTbodySel);
    if (!tbody)
      return;
    Array.from(tbody.rows).forEach((row) => {
      const checkBox = row.querySelector('input[type="checkbox"]');
      const btns = row.querySelectorAll("button");
      if (!checkBox)
        return;
      const customerName = row.cells[COL_INDEX.CUSTOMER_NAME].textContent?.trim();
      if (this.state.selectedCustomer) {
        if (customerName === this.state.selectedCustomer) {
          row.classList.add("highlight-row");
          row.classList.remove("disabled-row");
          checkBox.disabled = false;
          btns.forEach((b) => b.disabled = false);
        } else {
          row.classList.remove("highlight-row");
          row.classList.add("disabled-row");
          checkBox.disabled = true;
          btns.forEach((b) => b.disabled = true);
        }
      } else {
        row.classList.remove("highlight-row", "disabled-row");
        checkBox.disabled = false;
        btns.forEach((b) => b.disabled = false);
      }
    });
  }
  removeTableState() {
    const tbody = document.querySelector(this.rechargeTbodySel);
    if (!tbody)
      return;
    Array.from(tbody.rows).forEach((row) => {
      row.classList.remove("highlight-row", "disabled-row");
      const cb = row.querySelector('input[type="checkbox"]');
      cb?.remove();
      row.querySelectorAll("button").forEach((b) => b.disabled = false);
    });
  }
  refreshTableCheckboxes() {
    const tbody = document.querySelector(this.rechargeTbodySel);
    if (!tbody)
      return;
    tbody.querySelectorAll("tr").forEach((tr) => {
      const firstTd = tr.cells[0];
      if (!firstTd)
        return;
      if (firstTd.querySelector('input[type="checkbox"]'))
        return;
      const dataBtn = tr.querySelector('button[onclick="getAndShowRechargeImg(this)"]');
      const creatorId = dataBtn?.dataset.id;
      if (!creatorId)
        return;
      const div = document.createElement("div");
      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.dataset.id = creatorId;
      checkBox.name = "combinePayCheckbox";
      div.appendChild(checkBox);
      if (this.state.selectedCbs.has(creatorId)) {
        checkBox.checked = true;
      }
      firstTd.insertBefore(div, firstTd.firstChild);
    });
    this.updateTable();
  }
}

class CombinePayController {
  static instance = null;
  constructor() {
    this.state = new CombinePayState;
    this.ui = new CombinePayUI(this.state);
    this.handleTableClick = this.onTableClick.bind(this);
    this.handleTableChange = this.onTableChange.bind(this);
    this.rechargeTbodySel = "#rechargeTable tbody";
  }
  static getInstance() {
    if (!CombinePayController.instance) {
      CombinePayController.instance = new CombinePayController;
    }
    return CombinePayController.instance;
  }
  static resetInstance() {
    CombinePayController.instance = null;
  }
  state;
  ui;
  handleTableClick;
  handleTableChange;
  rechargeTbodySel;
  toggleCombinePayUI(state) {
    const tbody = document.querySelector(this.rechargeTbodySel);
    if (!tbody)
      return;
    if (state) {
      this.ui.injectStyle(statusStyle);
      this.ui.updateSidebar();
      this.ui.refreshTableCheckboxes();
      tbody.addEventListener("click", this.handleTableClick);
      tbody.addEventListener("change", this.handleTableChange);
    } else {
      this.ui.removeStyle();
      this.ui.removeSidebar();
      this.ui.removeTableState();
      tbody.removeEventListener("click", this.handleTableClick);
      tbody.removeEventListener("change", this.handleTableChange);
      this.state.reset();
    }
  }
  refreshCombinePayUI(state) {
    if (state) {
      this.ui.refreshTableCheckboxes();
      this.ui.updateSidebar();
    }
  }
  onTableClick(event) {
    const target = event.target;
    const td = target.closest("td");
    if (!td)
      return;
    const tr = td.closest("tr");
    const isTrDisabled = tr?.classList.contains("disabled-row");
    if (!tr || td !== tr.cells[0] || isTrDisabled)
      return;
    const checkbox = td.querySelector('input[type="checkbox"]');
    if (!checkbox || target === checkbox)
      return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
  }
  onTableChange(event) {
    const checkbox = event.target;
    if (!checkbox || checkbox.type !== "checkbox")
      return;
    const tr = checkbox.closest("tr");
    if (!tr)
      return;
    const customerName = tr.cells[COL_INDEX.CUSTOMER_NAME].textContent?.trim();
    const amountText = tr.cells[COL_INDEX.AMOUNT].textContent?.trim() || "0";
    const amount = parseFloat(amountText);
    if (checkbox.checked) {
      this.state.selectedCbs.set(checkbox.dataset.id || "", amount);
      this.state.selectedCustomer = this.state.selectedCustomer || customerName || null;
    } else {
      this.state.selectedCbs.delete(checkbox.dataset.id || "");
      if (this.state.selectedCbs.size === 0) {
        this.state.selectedCustomer = null;
      }
    }
    this.ui.updateSidebar();
    this.ui.updateTable();
  }
  getTotalAmount() {
    return this.state.amount;
  }
  static destroy() {
    const inst = CombinePayController.instance;
    if (!inst)
      return;
    const tbody = document.querySelector(inst.rechargeTbodySel);
    if (tbody) {
      tbody.removeEventListener("click", inst.handleTableClick);
      tbody.removeEventListener("change", inst.handleTableChange);
      inst.ui.removeStyle();
      inst.ui.removeSidebar();
      inst.ui.removeTableState();
      inst.state.reset();
    }
    CombinePayController.instance = null;
  }
}
var combinePay = CombinePayController.getInstance();

// src/configs/recharge/rechargeConfig.ts
var recharge = {
  pageName: "/recharge",
  mainSelector: 'script[src="/static/hui/h-ui.admin/js/H-ui.admin.js"]',
  onLoad: () => {
    rechargeCallback();
  },
  childObservers: [
    {
      selector: "#rechargeTable tbody",
      callback: () => {
        markVerifiedRecharges();
        const combineBtnState = buttonStateManager.getState("combinePaymentBtn");
        combinePay.toggleCombinePayUI(combineBtnState);
      },
      observerOptions: { childList: true, subtree: true, attributes: false }
    }
  ],
  isFirstLoad: true
};
var RECHARGE_BUTTON_CONFIGS = {
  openCheckBtn: {
    id: "openCheckBtn",
    defaultState: false,
    pageName: ["/recharge"],
    onStateChange: (buttonId, state) => {
      const action = state ? "inject" : "restore";
      hooksManager.toggle(["getAndShowRechargeImg", "updateRechargeStatus"], action);
      const config = RECHARGE_BUTTON_CONFIGS[buttonId];
      updateToggleButtonUI(`#${buttonId}`, state, config.uiConfig);
    },
    uiConfig: {
      iconOn: "✅",
      textOn: "关闭二次确认",
      iconOff: "⚪",
      textOff: "开启二次确认"
    },
    hookItems: [
      { getAndShowRechargeImg: (e) => newShowImg(e, combinePay) }
    ],
    decoratorHooks: { originalFnName: "updateRechargeStatus", decorator: withVerificationCheck }
  },
  combinePaymentBtn: {
    id: "combinePaymentBtn",
    defaultState: false,
    pageName: ["/recharge"],
    onStateChange: (buttonId, state) => {
      combinePay.toggleCombinePayUI(state);
      const config = RECHARGE_BUTTON_CONFIGS[buttonId];
      updateToggleButtonUI(`#${buttonId}`, state, config.uiConfig);
      const action = state ? "inject" : "restore";
      hooksManager.toggle(["getAndShowRechargeImg", "updateRechargeStatus"], action);
    },
    uiConfig: {
      iconOn: "\uD83D\uDD17",
      textOn: "关闭合并支付",
      iconOff: "⚪",
      textOff: "开启合并支付"
    },
    hookItems: [
      { getAndShowRechargeImg: (e) => newShowImg(e, combinePay) }
    ],
    decoratorHooks: { originalFnName: "updateRechargeStatus", decorator: withVerificationCheck }
  }
};
function rechargeCallback() {
  if (recharge.isFirstLoad) {
    initRechargeHooks();
    initRechargeButtons();
    recharge.isFirstLoad = false;
  }
  addRechargeButtons();
  markVerifiedRecharges();
}
function markVerifiedRecharges() {
  const rechargeTable = document.querySelector("#rechargeTable");
  let tbody = rechargeTable?.querySelector("tbody");
  if (!tbody) {
    return;
  }
  const confirmedPayments = paymentCache_default.getConfirmCache();
  if (Object.keys(confirmedPayments).length === 0) {
    return;
  }
  tbody.querySelectorAll("tr").forEach((tr) => {
    let photoBtn = tr.querySelector('button[onclick="getAndShowRechargeImg(this)"]');
    const DataId = photoBtn?.dataset.id || "";
    let currentCache = confirmedPayments[DataId];
    if (photoBtn && !photoBtn.dataset.verified && currentCache) {
      let verifiedDiv = document.createElement("div");
      verifiedDiv.textContent = "✅ 已验证";
      photoBtn.dataset.verified = "true";
      photoBtn.parentElement?.append(verifiedDiv);
    }
  });
}
function initRechargeHooks() {
  const allHooks = [];
  const funcNamesSet = new Set;
  Object.values(RECHARGE_BUTTON_CONFIGS).forEach((config) => {
    if (config.decoratorHooks) {
      if (funcNamesSet.has(config.decoratorHooks.originalFnName)) {
        return;
      }
      funcNamesSet.add(config.decoratorHooks.originalFnName);
      const { originalFnName: orignalFnName, decorator } = config.decoratorHooks;
      const originalFn = window[orignalFnName];
      if (typeof originalFn !== "function") {
        console.warn(`原函数 ${orignalFnName} 未找到，无法应用装饰器`);
        return;
      }
      const decoratedFn = decorator(originalFn);
      allHooks.push({ funcName: orignalFnName, injectedFunction: decoratedFn });
    }
    if (config.hookItems) {
      config.hookItems.forEach((hookItem) => {
        Object.entries(hookItem).forEach(([funcName, injectedFunction]) => {
          if (funcNamesSet.has(funcName)) {
            return;
          }
          allHooks.push({ funcName, injectedFunction });
        });
      });
    }
  });
  if (allHooks.length > 0) {
    hooksManager.register(allHooks);
  } else {
    console.info("No hooks to register for recharge page.");
  }
}
function initRechargeButtons() {
  Object.values(RECHARGE_BUTTON_CONFIGS).forEach((config) => {
    buttonStateManager.register(config.id, {
      defaultState: config.defaultState,
      pageName: config.pageName,
      onStateChange: config.onStateChange
    });
  });
}
function addRechargeButtons() {
  let divRow = document.querySelector("#rechargeTable_wrapper div.row");
  let isListening = divRow?.getAttribute("data-listening");
  if (!divRow || isListening)
    return;
  divRow.dataset.listening = "true";
  Object.values(RECHARGE_BUTTON_CONFIGS).forEach((config) => {
    const button = document.createElement("button");
    button.id = config.id;
    button.className = "toggle-btn";
    button.innerHTML = `<span class="btn-icon"></span><span class="btn-text"></span>`;
    divRow.appendChild(button);
  });
  divRow.addEventListener("click", (e) => {
    onRechargeButtonClick(e, divRow);
  });
  const currentPageBtnIds = buttonStateManager.refreshPageButtons();
  let activeBtnId = null;
  for (let [btnId, state] of Object.entries(currentPageBtnIds)) {
    if (state) {
      activeBtnId = btnId;
      break;
    }
  }
  divRow.querySelectorAll("button.toggle-btn").forEach((btn) => {
    if (btn.id === activeBtnId) {
      return;
    }
    if (activeBtnId) {
      btn.disabled = true;
    }
  });
}
function onRechargeButtonClick(event, contair) {
  let target = event.target;
  let button = target?.closest("button.toggle-btn");
  if (!button) {
    return;
  }
  const targetBtnId = button.id;
  if (buttonStateManager.isRegistered(targetBtnId) === false) {
    return;
  }
  let currentState = buttonStateManager.getState(targetBtnId);
  let newState = !currentState;
  buttonStateManager.updateState(targetBtnId, newState);
  contair.querySelectorAll("button.toggle-btn").forEach((btn) => {
    if (btn.id !== targetBtnId) {
      let otherBtnId = btn.id;
      if (buttonStateManager.isRegistered(otherBtnId)) {
        btn.disabled = newState;
      }
    }
  });
}
function withVerificationCheck(fn) {
  return function(btn) {
    const tr = btn.closest("tr");
    if (!tr) {
      console.warn(`未找到所在行 ${tr}`);
      return;
    }
    const verifiedButton = tr.querySelector('button[data-verified="true"]');
    if (verifiedButton) {
      console.log("✅ 已验证，执行原逻辑");
      fn(btn);
    } else {
      const userInputText = prompt("此图片未验证，是否继续？如需继续，请输入“继续操作”");
      if (userInputText === "继续操作") {
        console.log("用户选择继续操作，执行原逻辑");
        fn(btn);
      } else {
        console.log("用户取消或未输入正确内容，不执行");
        return;
      }
    }
  };
}
async function newShowImg(e, combinePay2) {
  if (!e) {
    return;
  }
  try {
    const rechargeId = e.dataset.id ?? "";
    const url = new URL("/recharge/queryreRechargePhoto", window.location.origin);
    url.searchParams.append("rechargeId", rechargeId);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const res = await response.json();
    let rechargeInfo = getChargeInfomation(e, combinePay2);
    if (!res?.length || !rechargeInfo) {
      return;
    }
    const arr = res.map((img, i) => ({ alt: "", src: img.url, pid: i, thumb: img.url }));
    window.layer?.open({
      type: 1,
      offset: "r",
      anim: "slideLeft",
      area: ["320px", "100%"],
      btn: ["验证", "关闭"],
      btn1: () => {
        verifyCharge(rechargeInfo);
        markVerifiedRecharges();
      },
      btn2: () => {
        closeLayerPhotos();
      },
      shade: 0.8,
      shadeClose: false,
      closeBtn: 0,
      id: "confrim-Page",
      content: getConfirmHTML(arr.length, rechargeInfo),
      success: () => {
        initialization();
        window.layer?.photos({
          photos: {
            title: "",
            id: 1,
            start: 0,
            data: arr
          },
          anim: 5,
          shade: 0,
          shadeClose: false,
          tab: (data) => {
            changeFocesUnit(`#confrim-Page canvas[data-pid="${data.pid.toString()}"]`);
          }
        });
      }
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
function changeFocesUnit(selector) {
  let canvas = document.querySelector(selector);
  if (!canvas) {
    return;
  }
  initCanvasActive(canvas);
}
function closeLayerPhotos(selctors = [".layui-layer-page", ".layui-layer-photos"]) {
  let layer = window.layer;
  if (layer) {
    selctors.forEach((sel) => {
      let layerElement = document.querySelector(sel);
      if (layerElement) {
        const layerIndex = layerElement.getAttribute("times");
        if (layerIndex) {
          layer.close(Number(layerIndex));
        }
      }
    });
  } else {
    document.querySelectorAll(".layui-layer-move, .layui-layer-shade, .layui-layer-photos, .layui-layer-page").forEach((el) => {
      el.remove();
    });
  }
}
function getChargeInfomation(button, combinePay2) {
  const data_id = button.dataset.id;
  const tr = button.closest("tr");
  if (!data_id || !tr) {
    return;
  }
  const rechargeId = data_id;
  const rechargeDate = tr.children[5].textContent.split(" ")[0];
  const rechargeAmount = getRechargeAmount(combinePay2, tr);
  const creatorName = tr.children[0].textContent;
  return { rechargeId, rechargeDate, rechargeAmount, creatorName };
  function getRechargeAmount(combinePay3, tr2) {
    if (combinePay3?.getTotalAmount()) {
      return combinePay3.getTotalAmount();
    } else {
      const amountText = tr2.children[7].textContent || "0";
      return parseFloat(amountText);
    }
  }
}
function verifyCharge(rechargeInfo, resultSel = "#result") {
  let resultDiv = document.querySelector(resultSel);
  if (!resultDiv) {
    return;
  }
  const resultText = resultDiv.textContent || "";
  const resultSum = parseInt(resultText.replaceAll(",", ""));
  if (isNaN(resultSum)) {
    console.error("Failed to parse amount from result element");
    return;
  }
  const { rechargeAmount, creatorName } = rechargeInfo;
  if (rechargeAmount !== resultSum) {
    const content = `截图的总金额${resultText}和声明的入金金额${rechargeAmount.toLocaleString()}不符
如需继续，请输入“继续操作”`;
    const value = prompt(content) || "";
    if (value === "继续操作") {
      paymentCache_default.setConfirmFor(rechargeInfo.rechargeId, {
        rechargeAmount,
        timestamp: Date.now(),
        creatorName
      });
      closeLayerPhotos();
    }
  } else {
    paymentCache_default.setConfirmFor(rechargeInfo.rechargeId, {
      rechargeAmount,
      timestamp: Date.now(),
      creatorName
    });
    closeLayerPhotos();
  }
}
function updateToggleButtonUI(btnSel, isOn, options) {
  const IconSel = ".btn-icon";
  const TextSel = ".btn-text";
  let btn = document.querySelector(btnSel);
  if (!btn) {
    return;
  }
  let icon = btn.querySelector(IconSel);
  let text = btn.querySelector(TextSel);
  let { iconOn, iconOff, textOn, textOff } = options;
  if (icon && text) {
    if (isOn) {
      icon.textContent = iconOn;
      text.textContent = textOn;
      btn.classList.remove("off");
      btn.classList.add("on");
    } else {
      icon.textContent = iconOff;
      text.textContent = textOff;
      btn.classList.remove("on");
      btn.classList.add("off");
    }
  }
}

// src/main.ts
var contentObserver = null;
var menuTree = document.querySelector('ul[data-widget="tree"]');
var mainDiv = document.querySelector("#mainDiv");
if (menuTree && mainDiv) {
  contentObserver = new DynamicLoaderObserver(menuTree, mainDiv);
  contentObserver.registerPage("/recharge", recharge);
}
var btnCSSStyle = document.createElement("style");
btnCSSStyle.id = "btnCSS";
btnCSSStyle.textContent = btnCSS;
document.head.append(btnCSSStyle);
