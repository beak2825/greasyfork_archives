// ==UserScript==
// @name         智能订单审核
// @namespace    http://tampermonkey.net/
// @version      1.4.14
// @description  根据多重条件自动审核大额订单（完整重构版）
// @author       Cisco
// @match        https://7777m.topcms.org/*
// @match        https://111bet22.topcms.org/*
// @match        https://888bet.topcms.org/*
// @match        https://hkgame.topcms.org/*
// @match        https://666bet.topcms.org/*
// @match        https://111bet.topcms.org/*
// @match        https://k9.topcms.org/*
// @match        https://34jogo.topcms.org/*
// @match        https://555x.topcms.org/*
// @match        https://888k.topcms.org/*
// @match        https://t9bet.topcms.org/*
// @match        https://999wbet.topcms.org/*
// @match        https://r8.topcms.org/*
// @match        https://8dbet.topcms.org/*
// @match        https://888p.topcms.org/*
// @match        https://t9bet.topcms.org/*
// @match        https://8dbet.topcms.org/*
// @match        https://u9bet.topcms.org/*
// @match        https://555d.topcms.org/*
// @match        https://8t.topcms.org/*
// @match        https://8888t.topcms.org/*
// @match        https://h5555.topcms.org/*
// @icon         https://7777m.topcms.org/favicon.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544836/%E6%99%BA%E8%83%BD%E8%AE%A2%E5%8D%95%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/544836/%E6%99%BA%E8%83%BD%E8%AE%A2%E5%8D%95%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
  
    // 配置参数
    const rawConfig = {
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      pageSize: 200, // 每页订单数量
      isLastPage: false, // 是否是最后一页
      maxWithdrawAmount: 80, // 最大提现金额
      betToBonusRatio: 20, // 总投注额/赠送总额最小比率
      betToRechargeRatio: 3, // 总投注额/订单充值最小比率
      profitToRechargeRatio: 3, // 游戏盈亏/订单充值最大比率
      maxSameIPUsers: 2, // 最大相同IP用户数
      minBalance: 9, // 最小余额要求
      maxWithdrawTimes: 3, // 最大提现次数
      password: "", // 充值密码
      processedOrders: GM_getValue("processedOrders", {}), // 已处理订单记录
      payOutOrders: GM_getValue("payOutOrders", {}), // 已出款订单记录
      currentOrderId: null, // 当前处理的订单ID
      isProcessing: false, // 是否正在处理中
      isReturning: false, // 是否正在返回订单页面
      panelCollapsed: false, // 面板是否收起
      completedOneRound: false, // 是否完成了一轮处理
      processingOrderId: null, // 正在处理的订单ID
      totalBetAmount: 0, // 当前订单的总投注额
      profitAmount: 0, // 当前订单的游戏盈亏
    };
  
    // 使用 Proxy 监听 config 变化
    const config = new Proxy(rawConfig, {
      set(target, prop, value) {
        target[prop] = value;
        if (prop === "currentOrderId") {
          const el = document.getElementById("currentOrderId");
          if (el) el.textContent = value || "";
        }
        return true;
      }
    });
  
    // 添加控制面板样式
    GM_addStyle(`
      .monitor-panel-order {
        position: fixed;
        top: 20px;
        right: 80px;
        z-index: 9999;
        background: white;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-family: Arial, sans-serif;
        width: 320px;
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.3s ease;
      }
      .monitor-panel-order.collapsed {
        width: 40px;
        height: 40px;
        overflow: hidden;
        padding: 5px;
      }
      .toggle-panel {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 30px;
        height: 30px;
        border: none;
        background: #f0f0f0;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 10000;
      }
      .toggle-panel:hover {
        background: #e0e0e0;
      }
      .collapsed .panel-content {
        display: none;
      }
      .monitor-header {
        margin: 0 0 15px 0;
        color: #409EFF;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      .config-group {
        margin-bottom: 12px;
        position: relative;
      }
      .config-label {
        display: block;
        margin-bottom: 5px;
        color: #666;
        font-size: 13px;
        font-weight: bold;
      }
      .config-label.required:after {
        content: " *";
        color: #F56C6C;
      }
      .config-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .config-input.error {
        border-color: #F56C6C;
      }
      .error-message {
        color: #F56C6C;
        font-size: 12px;
        margin-top: 3px;
        display: none;
      }
      .monitor-button {
        width: 100%;
        padding: 10px;
        background: #409EFF;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s;
        margin-bottom: 10px;
      }
      .monitor-button:disabled {
        background: #C0C4CC;
        cursor: not-allowed;
      }
      .monitor-button.stop {
        background: #F56C6C;
      }
      .monitor-stats {
        margin-top: 15px;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
      .monitor-stat-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      .monitor-progress-container {
        margin: 10px 0;
        height: 10px;
        background: #f0f0f0;
        border-radius: 5px;
        overflow: hidden;
      }
      .monitor-progress-bar {
        height: 100%;
        background: linear-gradient(to right, #67C23A, #409EFF);
        transition: width 0.3s;
      }
      #statusText {
        font-weight: bold;
        color: #409EFF;
      }
      #processedCount {
        font-weight: bold;
        color: #67C23A;
      }
      .button-container {
        display: flex;
        flex-direction: column;
      }
      .monitor-button.hidden {
        display: none;
      }
    `);
  
    // ==================== 工具函数 ====================
  
    /**
     * 延迟执行
     * @param {number} ms 毫秒数
     * @returns {Promise<void>}
     */
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    /**
     * 等待指定元素出现（可选检测其文本内容），超时返回 null 而不是抛异常
     * @param {string} selector - CSS 选择器
     * @param {number} [timeout=10000] - 等待的最长时间（毫秒）
     * @param {ParentNode} [parent=document] - 查找的父容器（默认 document）
     * @param {AbortSignal|null} [signal=null] - 可选的 AbortSignal，用于提前中断等待
     * @param {Object} [options={}] - 额外选项
     * @param {boolean} [options.requireText=false] - 是否要求元素有非空文本才算找到
     * @returns {Promise<Element|null>} - 找到则返回元素，没找到或超时返回 null
     */
    function waitForElement(
        selector,
        timeout = 10000,
        parent = document,
        signal = null,
        options = {}
    ) {
        // 如果 parent 为 null，则兜底使用 document
        if (!parent) parent = document;

        // 解析选项
        const { requireText = false } = options;

        return new Promise(resolve => {
            // 如果调用时就已经中断，直接返回 null
            if (signal?.aborted) return resolve(null);

            // 计算超时时间点
            const endTime = Date.now() + timeout;

            // 定时检测函数
            const check = () => {
                // 如果外部中断，直接返回 null
                if (signal?.aborted) return resolve(null);

                // 查找元素
                const element = parent.querySelector(selector);

                if (element) {
                    // 如果要求有文本内容，但当前元素文本为空，继续等待
                    if (requireText && !element.textContent.trim()) {
                        if (Date.now() < endTime) {
                            setTimeout(check, 200); // 每 200ms 再检测一次
                            return;
                        }
                        // 超时依然没内容
                        return resolve(null);
                    }

                    // 找到符合条件的元素
                    return resolve(element);
                }

                // 元素还没出现，检查是否超时
                if (Date.now() >= endTime) {
                    return resolve(null); // 超时返回 null
                }

                // 继续等待
                setTimeout(check, 200);
            };

            check(); // 启动首次检测
        });
    }

  
    /**
     * 等待页面跳转完成
     * @param {string} targetHash 目标页面hash
     * @param {number} timeout 超时时间(ms)
     * @returns {Promise<void>}
     */
    function waitForPageChange(targetHash, timeout = 10000) {
      return new Promise((resolve, reject) => {
        if (window.location.hash.includes(targetHash)) {
          return resolve();
        }
  
        const timer = setTimeout(() => {
          window.removeEventListener('hashchange', handler);
          reject(new Error(`Timeout waiting for page change to ${targetHash}`));
        }, timeout);
  
        const handler = () => {
          if (window.location.hash.includes(targetHash)) {
            clearTimeout(timer);
            window.removeEventListener('hashchange', handler);
            resolve();
          }
        };
  
        window.addEventListener('hashchange', handler);
      });
    }
  
    /**
     * 带重试的操作
     * @param {Function} operation 操作函数
     * @param {number} retries 重试次数
     * @param {number} delayMs 重试间隔(ms)
     * @param {AbortSignal} signal 取消信号
     * @returns {Promise<any>}
     */
    async function retryOperation(operation, retries = 3, delayMs = 1000, signal = null) {
      let lastError;
      for (let i = 0; i < retries; i++) {
        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        try {
          return await operation();
        } catch (err) {
          lastError = err;
          if (i < retries - 1) await delay(delayMs);
        }
      }
      throw lastError;
    }
  
    /**
     * 检查是否在订单页面
     * @returns {boolean}
     */
    function isOrderPage() {
      return window.location.hash.includes("#/order/unread-withdraw");
    }
  
    /**
     * 检查是否在代理页面
     * @returns {boolean}
     */
    function isAgentPage() {
      return window.location.hash.includes("#/agent/agent-list");
    }
  
    /**
     * 检查是否在提现记录页面
     * @returns {boolean}
     */
    function isWithdrawPage() {
      return window.location.hash.includes("#/order/order-withdraw");
    }
  
    /**
     * 检查是否在充值记录页面
     * @returns {boolean}
     */
    function isTopupPage() {
      return window.location.hash.includes("#/order/order-topup");
    }
  
    /**
     * 更新状态显示
     * @param {string} text 状态文本
     */
    function updateStatus(text) {
      const statusEl = document.getElementById("statusText");
      if (statusEl) {
        statusEl.textContent = text;
      }
    }
  
    /**
     * 更新按钮显示状态
     */
    function updateButtonVisibility() {
      const startBtn = document.getElementById("startBtn");
      const stopBtn = document.getElementById("stopBtn");
  
      if (config.isProcessing) {
        startBtn?.classList.add("hidden");
        stopBtn?.classList.remove("hidden");
      } else {
        startBtn?.classList.remove("hidden");
        stopBtn?.classList.add("hidden");
      }
    }
  
    /**
     * 验证输入参数
     * @returns {boolean}
     */
    function validateInputs() {
      let isValid = true;
      const inputs = [
        { id: "maxAmount", name: "最大提现金额" },
        { id: "betBonusRatio", name: "总投注额大于赠送总额指定倍数" },
        { id: "betRechargeRatio", name: "总投注额大于订单充值指定倍数" },
        { id: "profitRatio", name: "游戏盈亏大于订单充值指定倍数" },
        { id: "maxSameIPUsers", name: "最大相同IP用户数" },
        { id: "minBalance", name: "最大余额要求" },
        { id: "withdrawPassword", name: "充值密码" },
      ];
  
      inputs.forEach((input) => {
        const element = document.getElementById(input.id);
        const errorElement =
          element.parentElement.querySelector(".error-message") ||
          createErrorElement(element.parentElement);
  
        if (input.id === "withdrawPassword") {
          if (!element.value.trim()) {
            element.classList.add("error");
            errorElement.textContent = `${input.name}不能为空`;
            errorElement.style.display = "block";
            isValid = false;
          } else {
            element.classList.remove("error");
            errorElement.style.display = "none";
          }
        } else {
          if (!element.value.trim()) {
            element.classList.add("error");
            errorElement.textContent = `${input.name}不能为空`;
            errorElement.style.display = "block";
            isValid = false;
          } else if (isNaN(element.value)) {
            element.classList.add("error");
            errorElement.textContent = `${input.name}必须是数字`;
            errorElement.style.display = "block";
            isValid = false;
          } else {
            element.classList.remove("error");
            errorElement.style.display = "none";
          }
        }
      });
  
      return isValid;
    }
  
    /**
     * 创建错误提示元素
     * @param {HTMLElement} parent 父元素
     * @returns {HTMLElement}
     */
    function createErrorElement(parent) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      parent.appendChild(errorElement);
      return errorElement;
    }
  
    /**
     * 更新配置
     */
    function updateConfig() {
      config.maxWithdrawAmount = parseFloat(
        document.getElementById("maxAmount").value
      );
      config.betToBonusRatio = parseFloat(
        document.getElementById("betBonusRatio").value
      );
      config.betToRechargeRatio = parseFloat(
        document.getElementById("betRechargeRatio").value
      );
      config.profitToRechargeRatio = parseFloat(
        document.getElementById("profitRatio").value
      );
      config.maxSameIPUsers = parseInt(
        document.getElementById("maxSameIPUsers").value
      );
      config.minBalance = parseFloat(document.getElementById("minBalance").value);
      config.password = document.getElementById("withdrawPassword").value;
    }
  
    /**
     * 标记订单为已处理
     * @param {string} orderId 订单ID
     * @param {string} reason 原因
     */
    function markOrderAsProcessed(orderId, reason = "") {
      if (!orderId) return;
  
      config.processedOrders[orderId] = {
        time: new Date().toISOString(),
        reason: reason || "已处理",
      };
      GM_setValue("processedOrders", config.processedOrders);
      document.getElementById("processedCount").textContent = Object.keys(
        config.processedOrders
      ).length;
      console.log(`订单 ${orderId} 已标记为已处理`, reason ? `原因: ${reason}` : "");
    }
  
    /**
     * 从行中获取订单ID
     * @param {HTMLElement} row 表格行
     * @returns {string}
     */
    function getOrderIdFromRow(row) {
      // 1. 先找到包含"订单号"的表头单元格
      const headerCells = document.querySelectorAll(".el-table__header .cell");
      const orderHeader = Array.from(headerCells).find(
        (cell) => cell.textContent.trim() === "订单号"
      );
  
      if (orderHeader) {
        // 2. 获取列索引
        const colIndex = orderHeader.closest("th").getAttribute("aria-colindex");
        if (colIndex) {
          // 3. 使用列索引找到对应数据单元格
          const orderIdEl = row.querySelector(
            `td:nth-child(${colIndex}) .cell > span`
          );
          if (orderIdEl) {
            return orderIdEl.textContent.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
          }
        }
      }
  
      // 备用方案：通过内容特征匹配
      const cells = Array.from(row.querySelectorAll(".cell > span"));
      const idCell = cells.find((cell) => {
        const text = cell.textContent.trim();
        return /^tx_\d+_\d{8}\w+$/.test(text); // 匹配订单号格式
      });
  
      return idCell ? idCell.textContent.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() : "";
    }
  
    /**
     * 更新分页信息
     */
    function updatePaginationInfo() {
      const pagination = document.querySelector(".el-pagination");
      if (!pagination) {
        console.error("无法找到分页元素");
        // 默认值
        config.currentPage = 1;
        config.totalPages = 1;
        config.isLastPage = true;
        return;
      }
  
      // 当前页
      const activePage = pagination.querySelector(".el-pager .number.active");
      config.currentPage = activePage ? parseInt(activePage.textContent) : 1;
  
      // 每页数量
      const pageSizeSelect = pagination.querySelector(
        ".el-select-dropdown__item.selected"
      );
      config.pageSize = pageSizeSelect
        ? parseInt(pageSizeSelect.textContent)
        : null;
  
      // 总条数
      let totalItems = null;
      const totalTextEl = pagination.querySelector(".el-pagination__total");
      if (totalTextEl) {
        const totalMatch = totalTextEl.textContent.match(/共\s*(\d+)\s*条/);
        if (totalMatch) {
          totalItems = parseInt(totalMatch[1]);
        }
      }
  
      // 计算总页数
      if (totalItems !== null && config.pageSize) {
        config.totalPages = Math.ceil(totalItems / config.pageSize);
      } else {
        config.totalPages = config.currentPage || 1;
      }
  
      // 是否最后一页
      const nextBtn = pagination.querySelector(".btn-next");
      if (config.totalPages === 1) {
        config.isLastPage = true;
      } else if (nextBtn) {
        config.isLastPage = nextBtn.disabled;
      } else {
        config.isLastPage = config.currentPage >= config.totalPages;
      }
  
      console.log(
        `当前页码: ${config.currentPage}/${config.totalPages}`,
        `每页: ${config.pageSize || "-"}条`,
        `是否末页: ${config.isLastPage}`
      );
    }
  
    /**
     * 清空所有搜索输入框
     */
    function clearAllSearchInputs() {
      // 清空订单号输入框
      const orderInput = document.querySelector(
        '.filter-container input[placeholder="请输入订单号"]'
      );
      if (orderInput) {
        orderInput.value = "";
        orderInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
  
      // 清空用户ID输入框
      const userIdInput = document.querySelector(
        '.filter-container input[placeholder="请输入用户ID"]'
      );
      if (userIdInput) {
        userIdInput.value = "";
        userIdInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
  
      // 重置第三方选择器
      const thirdPartySelect = document.querySelector(
        '.el-select input[placeholder="全部"]'
      );
      if (thirdPartySelect && thirdPartySelect.value !== "全部") {
        thirdPartySelect.value = "全部";
        thirdPartySelect.dispatchEvent(new Event("input", { bubbles: true }));
      }
  
      // 清空日期范围选择器
      const dateInputs = document.querySelectorAll(".el-range-input");
      dateInputs.forEach((input) => {
        if (input.value) {
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }
  
    /**
     * 添加控制面板
     */
    function addControlPanel() {
      const panel = document.createElement("div");
      panel.className = "monitor-panel-order";
      panel.id = "autoWithdrawPanel";
  
      // 添加收起/展开按钮
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "toggle-panel";
      toggleBtn.innerHTML = "×";
      toggleBtn.title = "收起/展开控制面板";
      toggleBtn.addEventListener("click", togglePanel);
  
      // 面板内容
      const panelContent = document.createElement("div");
      panelContent.className = "panel-content";
      panelContent.innerHTML = `
        <h3 class="monitor-header">智能自动出款系统</h3>
        <div class="config-group">
          <label class="config-label required">最大提现金额</label>
          <input type="number" class="config-input" id="maxAmount" value="${
            config.maxWithdrawAmount
          }" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">总投注额大于赠送总额指定倍数</label>
          <input type="number" class="config-input" id="betBonusRatio" value="${
            config.betToBonusRatio
          }" step="0.1" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">总投注额大于订单充值指定倍数</label>
          <input type="number" class="config-input" id="betRechargeRatio" value="${
            config.betToRechargeRatio
          }" step="0.1" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">游戏盈亏小于订单充值指定倍数</label>
          <input type="number" class="config-input" id="profitRatio" value="${
            config.profitToRechargeRatio
          }" step="0.1" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">最大相同IP用户数</label>
          <input type="number" class="config-input" id="maxSameIPUsers" value="${
            config.maxSameIPUsers
          }" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">最大余额要求</label>
          <input type="number" class="config-input" id="minBalance" value="${
            config.minBalance
          }" required>
          <div class="error-message"></div>
        </div>
        <div class="config-group">
          <label class="config-label required">充值密码</label>
          <input type="text" class="config-input" id="withdrawPassword" value="${
            config.password
          }" required>
          <div class="error-message"></div>
        </div>
        <div class="button-container">
          <button id="startBtn" class="monitor-button ${
            config.isProcessing ? "hidden" : ""
          }">开始处理</button>
          <button id="stopBtn" class="monitor-button stop ${
            !config.isProcessing ? "hidden" : ""
          }">停止处理</button>
        </div>
        <div class="button-container">
          <button id="clearCacheBtn" class="monitor-button">清理缓存</button>
        </div>
  
        <div class="monitor-stats">
          <div class="monitor-stat-row">
            <span>状态:</span>
            <span id="statusText">待命</span>
          </div>
          <div class="monitor-stat-row">
            <span>当前处理:</span>
            <span id="currentOrderId">${config.currentOrderId || ""}</span>
          </div>
          <div class="monitor-stat-row">
            <span>已处理:</span>
            <span id="processedCount">${
              Object.keys(config.processedOrders).length
            }</span> 单
          </div>
          <div class="monitor-stat-row">
            <span>已出款:</span>
            <span id="payOutOrders">${Object.keys(
              config.payOutOrders
            ).join(", ")}</span>
          </div>
        </div>
      `;
  
      panel.appendChild(toggleBtn);
      panel.appendChild(panelContent);
      document.body.appendChild(panel);
  
      // 恢复面板状态
      config.panelCollapsed = GM_getValue("panelCollapsed", false);
      if (config.panelCollapsed) {
        panel.classList.add("collapsed");
        toggleBtn.innerHTML = "≡";
      }
  
      // 事件监听
      document.getElementById("startBtn").addEventListener("click", function () {
        if (validateInputs()) {
          updateConfig();
          processor.start();
        }
      });
  
      document.getElementById("stopBtn").addEventListener("click", function () {
        processor.stop();
      });
  
      // 为所有输入框添加实时验证
      document.querySelectorAll(".config-input").forEach((input) => {
        input.addEventListener("input", function () {
          validateInputs();
        });
      });
  
      // 绑定清理缓存事件
      document.getElementById("clearCacheBtn").addEventListener("click", function () {
        if (confirm("确定要清理缓存数据吗？这会清空已处理订单记录。")) {
          config.processedOrders = {};
          config.payOutOrders = {};
          config.currentOrderId = null;
  
          GM_setValue("processedOrders", {});
          GM_setValue("payOutOrders", {});
          GM_setValue("currentOrderId", null);
  
          document.getElementById("processedCount").textContent = "0";
          document.getElementById("payOutOrders").textContent = "";
          document.getElementById("currentOrderId").textContent = "";
  
          updateStatus("缓存已清理");
        }
      });
    }
  
    /**
     * 收起/展开面板
     */
    function togglePanel() {
      const panel = document.getElementById("autoWithdrawPanel");
      config.panelCollapsed = !panel.classList.contains("collapsed");
  
      if (config.panelCollapsed) {
        panel.classList.add("collapsed");
        this.innerHTML = "≡";
      } else {
        panel.classList.remove("collapsed");
        this.innerHTML = "×";
      }
  
      GM_setValue("panelCollapsed", config.panelCollapsed);
    }
  
    // ==================== 主流程控制器 ====================
  
    class OrderProcessor {
      constructor(config) {
        this.config = config;
        this.abortController = new AbortController();
        this.currentTask = null;
      }
  
      /**
       * 开始处理流程
       */
      async start() {
        if (this.currentTask) return;
  
        this.config.isProcessing = true;
        updateButtonVisibility();
        updateStatus("开始处理订单...");
  
        this.currentTask = this.runProcessingLoop()
          .catch(err => {
            console.error('Processing error:', err);
            updateStatus(`处理出错: ${err.message}`);
          })
          .finally(() => {
            this.currentTask = null;
            updateButtonVisibility();
          });
      }
  
      /**
       * 停止处理流程
       */
      stop() {
        this.abortController.abort();
        this.config.isProcessing = false;
        this.abortController = new AbortController();
        updateStatus("处理已停止");
      }
  
      /**
       * 主处理循环
       */
      async runProcessingLoop() {
        const { signal } = this.abortController;
  
        while (this.config.isProcessing && !signal.aborted) {
          try {
            if (isOrderPage()) {
                console.log('当前在订单页面');
                await this.processOrderPage(signal);
            } else {
                console.log('当前在订单页面');
                await this.navigateToOrderPage();
            }
          } catch (err) {
            if (err.name === 'AbortError') break;
            console.error('Loop error:', err);
            await delay(3000);
          }
        }
      }
  
      /**
       * 处理订单页面
       * @param {AbortSignal} signal 取消信号
       */
      async processOrderPage(signal) {
        if (!isOrderPage()) {
            // 如果当前不是订单页面就跳转过来
            processor.navigateToOrderPage();
            return;
        }
        if (signal.aborted) return;
        this.closeAllDialogs(signal);
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
            console.log('暂无数据');
            // 无数据隔5秒重开
            await delay(5000);
            await this.startNewRound(signal);
            return;
        }
  
        // 1. 确保页面完全加载
        const el = await waitForElement('.el-table--scrollable-x .el-table__body .el-table__row .cell > span', 10000, null, signal, { requireText: true });
        if (!el) {
            console.warn('没找到元素或超时');
            await this.processOrderPage(signal);
            return;
        }

        // 4. 设置订单状态为"已支付"
        //await this.selectDropdownOption("请选择", "200条/页", signal);
        // 2. 更新分页信息
        updatePaginationInfo();
  
        // 3. 如果不是最后一页，先跳转到最后一页
        // if (!this.config.isLastPage && this.config.currentPage < this.config.totalPages) {
        //   await this.goToLastPage(signal);
        //   return;
        // }
  
        // 5. 点击查询按钮
        // const queryBtn = await this.findQueryButton(signal);
        // queryBtn.click();
        
        // // 6. 等待查询结果
        // await delay(1500);

        // 4. 获取当前页订单行
        const rows = await this.getOrderRows(signal);
        console.log("当前页订单所有行", rows);
        if (rows.length === 0) {
          if (this.config.currentPage > 1) {
            await this.goToPrevPage(signal);
          } else {
            await this.startNewRound(signal);
          }
          return;
        }
  
        // 5. 从最后一行开始处理
        for (let i = rows.length - 1; i >= 0; i--) {
          if (signal.aborted || !this.config.isProcessing) break;
  
          try {
            console.log("当前页订单行", rows[i]);
            await this.processSingleOrder(rows[i], signal);
          } catch (err) {
            console.error(`处理订单失败:`, err);
            const orderId = getOrderIdFromRow(rows[i]);
            markOrderAsProcessed(orderId, `处理失败: ${err.message}`);
          }
        }
  
        // 6. 当前页处理完成后翻页或开始新一轮
        if (this.config.currentPage > 1) {
          await this.goToPrevPage(signal);
        } else {
          await this.startNewRound(signal);
        }
      }

      /**
       * 加载已处理订单
       */
      async loadProcessedOrders() {
        const stored = await GM_getValue("processedOrders");
        if (stored && typeof stored === "object" && !Array.isArray(stored)) {
          // 如果是 Proxy 或特殊对象，用 Object.assign 复制到空对象
          config.processedOrders = Object.assign(Object.create(null), stored);
        } else {
          config.processedOrders = Object.create(null);
        }
        console.log("加载后的 processedOrders:", config.processedOrders);
      }

      /**
       * 处理单个订单
       * @param {HTMLElement} row 订单行
       * @param {AbortSignal} signal 取消信号
       */
      async processSingleOrder(row, signal) {
        const orderId = getOrderIdFromRow(row);
        console.log("当前订单ID", orderId);
        if (config.processedOrders[orderId]) {
          console.log(`订单 ${orderId} 已处理，跳过`);
          return;
        }

        this.config.currentOrderId = orderId;
        updateStatus(`处理订单: ${orderId}`);
  
        // 1. 检查提现金额
        const amount = await this.getWithdrawAmount(row, signal);
        console.log("订单号:",orderId,"提现金额:",amount);
        if (amount == 0 || amount > this.config.maxWithdrawAmount) {
          return markOrderAsProcessed(orderId, "金额超限");
        }
  
        // 2. 检查用户详情
        const userDetails = await this.getUserDetails(row, signal);
        if (!userDetails) {
          return markOrderAsProcessed(orderId, "获取用户详情失败");
        }

        // 3. 检查财务条件
        if (!this.checkFinancialConditions(userDetails)) {
          return markOrderAsProcessed(orderId, "财务条件不满足");
        }
  
        // 4. 检查提现记录
        // const withdrawOk = await this.checkWithdrawRecords(userDetails.userId, signal);
        // if (!withdrawOk) {
        //   return markOrderAsProcessed(orderId, "提现记录不满足");
        // }
  
        // 5. 检查代理条件
        await this.processAgentPage(userDetails.userId, signal);
        const agentOk = await this.checkAgentConditions(signal);
        if (!agentOk) {
          return markOrderAsProcessed(orderId, "代理条件不满足");
        }
        
        // 6. 返回订单页面
        await this.goBackToOrderPage(signal);
        console.log("返回订单页面");

        // 重新查找订单行（不依赖旧的row）
        const freshRow = await this.findOrderRowById(orderId, signal);
        if (!freshRow) {
            return markOrderAsProcessed(orderId, "返回后找不到订单");
        }
        // 7. 批准订单
        await this.approveOrder(freshRow, signal);
  
        // 8. 标记为已处理
        markOrderAsProcessed(orderId, "已批准");
        this.config.payOutOrders[orderId] = true;
        GM_setValue("payOutOrders", this.config.payOutOrders);
        document.getElementById("payOutOrders").textContent = Object.keys(
          this.config.payOutOrders
        ).join(", ");
      }

        /**
         * 返回到订单页面
         * @param {AbortSignal} signal 取消信号
         */
        async goBackToOrderPage(signal) {
            updateStatus("返回订单页面...");
            // 跳转到订单页面
            await this.navigateTo("#/order/unread-withdraw", signal);
            // 等待查询结果
            await delay(1500);
        }

        /**
         * 在订单列表页中根据 orderId 重新查找订单行
         * @param {string} orderId 订单ID
         * @param {AbortSignal} signal 取消信号
         * @returns {Promise<HTMLElement|null>} 返回找到的行，如果找不到则返回 null
         */
        async findOrderRowById(orderId, signal) {
            updateStatus(`正在查找订单 ${orderId}...`);
            
            const maxAttempts = 5;
            let attempts = 0;
            
            while (attempts < maxAttempts && !signal.aborted) {
                // 方法1：使用列位置（第7列的单元格）
                const cells = Array.from(document.querySelectorAll('.el-table__body tr td:nth-child(7) .cell'));
                const targetCell = cells.find(cell => cell.textContent.trim() === orderId);
                
                if (targetCell) {
                    const row = targetCell.closest('tr');
                    if (row) return row;
                }
                
                // 方法2：如果方法1失效，改用遍历所有行，检查第7列的文本
                const rows = document.querySelectorAll('.el-table__body tr');
                for (const row of rows) {
                    const orderCell = row.querySelector('td:nth-child(7) .cell');
                    if (orderCell?.textContent.trim() === orderId) {
                        return row;
                    }
                }
                
                // 如果没有找到，等待后重试
                attempts++;
                await delay(1000);
            }
            
            console.error(`找不到订单 ${orderId} 的行`);
            return null;
        }

        /**
         * 处理提现记录页面
         * @param {AbortSignal} signal 取消信号
         */
        async processWithdrawPage(signal) {
            if (signal.aborted) return;
            
            updateStatus(`检查用户 ${this.config.currentUserId} 的提现记录...`);
            
            try {
            // 1. 确保页面完全加载
            const el = await waitForElement('.el-table__body', 10000, null, signal);
            if (!el) {
                console.warn('没找到元素或超时');
                return;
            }
            // 2. 设置用户ID搜索条件
            const idInput = await waitForElement(
                'input[placeholder="请输入用户ID"].el-input__inner',
                5000,
                null,
                signal
            );
            
            // 清空并设置用户ID
            await this.setInputValue(idInput, this.config.currentUserId, signal);
            
            // 3. 调整日期范围（当天GMT+0时间）
            await this.adjustWithdrawDateRange(signal);
            
            // 4. 设置订单状态为"已支付"
            await this.selectDropdownOption("全部状态", "已支付", signal);
            
            // 5. 点击查询按钮
            const queryBtn = await this.findQueryButton(signal);
            queryBtn.click();
            
            // 6. 等待查询结果
            await delay(2000);
            
            // 7. 检查提现记录
            const todayCount = await this.checkWithdrawTimes(signal);
            if (todayCount > this.config.maxWithdrawTimes) {
                throw new Error(`当天提现次数已达 ${todayCount} 次（限制: ${this.config.maxWithdrawTimes} 次）`);
            }
            
            // 8. 检查CoinPay记录
            const hasCoinPay = await this.checkCoinPayWithdraw(signal);
            if (hasCoinPay) {
                throw new Error("检测到CoinPay提现记录");
            }
            
            } catch (err) {
            console.error('处理提现页面出错:', err);
            markOrderAsProcessed(this.config.currentOrderId, `提现记录检查失败: ${err.message}`);
            await this.navigateToOrderPage();
            throw err;
            }
        }
        
        /**
         * 调整提现记录查询日期范围（GMT+0当天）
         */
        async adjustWithdrawDateRange(signal) {
            const dateInputs = await waitForElement(
            ".el-range-input",
            5000,
            null,
            signal
            );
            
            if (!dateInputs || dateInputs.length < 2) {
            throw new Error("找不到日期范围输入框");
            }
        
            const now = new Date();
            const startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            startDate.setHours(startDate.getHours() - 8); // 转为GMT+0
            
            const endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            endDate.setHours(endDate.getHours() - 8); // 转为GMT+0
        
            const formatDate = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            };
        
            const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
            ).set;
            
            setter.call(dateInputs[0], formatDate(startDate));
            dateInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
            
            setter.call(dateInputs[1], formatDate(endDate));
            dateInputs[1].dispatchEvent(new Event("input", { bubbles: true }));
        }
        /**
         * 处理充值记录页面
         * @param {AbortSignal} signal 取消信号
         */
        async processTopupPage(signal) {
            if (signal.aborted) return;
            
            updateStatus(`检查用户 ${this.config.currentUserId} 的充值记录...`);
            
            try {
            // 1. 确保页面完全加载
            await waitForElement('.el-table__body', 10000, null, signal);
            
            // 2. 设置用户ID搜索条件
            const idInput = await waitForElement(
                'input[placeholder="请输入用户ID"].el-input__inner',
                5000,
                null,
                signal
            );
            
            // 清空并设置用户ID
            await this.setInputValue(idInput, this.config.currentUserId, signal);
            
            // 3. 调整日期范围（最近7天）
            await this.adjustTopupDateRange(signal);
            
            // 4. 设置订单状态为"已支付"
            await this.selectDropdownOption("全部状态", "已支付", signal);
            
            // 5. 点击查询按钮
            const queryBtn = await this.findQueryButton(signal);
            queryBtn.click();
            
            // 6. 等待查询结果
            await delay(2000);
            
            // 7. 获取最新充值记录
            const latestRecharge = await this.getLatestRecharge(signal);
            if (!latestRecharge) {
                throw new Error("没有找到充值记录");
            }
            
            // 8. 验证投注额与充值额比率
            if (this.config.totalBetAmount <= latestRecharge.amount * this.config.betToRechargeRatio) {
                throw new Error(`投注额 ${this.config.totalBetAmount} 不满足大于充值额 ${latestRecharge.amount} 的 ${this.config.betToRechargeRatio} 倍要求`);
            }
            
            // 9. 验证盈亏与充值额比率
            if (Math.abs(this.config.profitAmount) < latestRecharge.amount * this.config.profitToRechargeRatio) {
                throw new Error(`盈亏 ${this.config.profitAmount} 低于充值额 ${latestRecharge.amount} 的 ${this.config.profitToRechargeRatio} 倍限制`);
            }
            
            } catch (err) {
            console.error('处理充值页面出错:', err);
            markOrderAsProcessed(this.config.currentOrderId, `充值记录检查失败: ${err.message}`);
            await this.navigateToOrderPage();
            throw err;
            }
        }
        
        /**
         * 调整充值记录查询日期范围（最近7天）
         */
        async adjustTopupDateRange(signal) {
            const dateInputs = await waitForElement(
            ".el-range-input",
            5000,
            null,
            signal
            );
            
            if (!dateInputs || dateInputs.length < 2) {
            throw new Error("找不到日期范围输入框");
            }
        
            const now = new Date();
            const endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            endDate.setHours(endDate.getHours() - 8); // 转为GMT+0
            
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 6); // 7天范围
            startDate.setHours(0, 0, 0, 0);
        
            const formatDate = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            };
        
            const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
            ).set;
            
            setter.call(dateInputs[0], formatDate(startDate));
            dateInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
            
            setter.call(dateInputs[1], formatDate(endDate));
            dateInputs[1].dispatchEvent(new Event("input", { bubbles: true }));
        }
        
        /**
         * 获取最新充值记录
         */
        async getLatestRecharge(signal) {
            const rows = document.querySelectorAll('.el-table__body .el-table__row');
            if (rows.length <= 1) return null; // 第一行是表头
            
            // 取第二行（第一行数据），第5列是金额（根据实际结构调整）
            const amountCell = rows[1].querySelector('td:nth-child(5) .cell');
            if (!amountCell) return null;
            
            const amount = parseFloat(amountCell.textContent.replace(/[^\d.-]/g, '')) || 0;
            
            return {
            amount,
            time: new Date().toISOString()
            };
        }
 
      /**
       * 获取提现金额
       * @param {HTMLElement} row 订单行
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<number>}
       */
      async getWithdrawAmount(row, signal) {
        // 第8列通常是金额列
        console.log("当前订单row", row);
        // 数值解析函数
        const parseValue = (text) => {
          // 移除所有非数字字符（保留小数点和负号）
          const numStr = text.replace(/[^\d.-]/g, "");
          return parseFloat(numStr) || 0;
        };
        const amountNode = row.querySelector("td:nth-child(8) .cell > span");
        if (!amountNode) {
          // 如果第8列找不到，尝试其他可能的位置
          const amountNodes = row.querySelectorAll("td .cell > span");
          let foundNode = null;
  
          for (const node of amountNodes) {
            // 检查是否是金额（包含数字和小数点）
            if (/^\d+\.\d{2}$/.test(node.textContent.trim())) {
              foundNode = node;
              break;
            }
          }
  
          if (!foundNode) {
            throw new Error("提取提现金额失败");
          }
          return parseValue(foundNode.textContent);
        }
        return parseValue(amountNode.textContent);
      }
  
      /**
         * 查找查询按钮（带重试机制）
         */
        async findQueryButton(signal) {
            return await retryOperation(
            async () => {
                const buttons = document.querySelectorAll('.filter-container button.el-button');
                const btn = Array.from(buttons).find(b => 
                b.textContent.includes('查询') || 
                (b.querySelector('span')?.textContent.includes('查询'))
                );
                
                if (!btn) throw new Error('找不到查询按钮');
                if (btn.disabled) throw new Error('查询按钮不可用');
                return btn;
            },
            3, // 重试3次
            1000, // 间隔1秒
            signal
            );
        }

      /**
       * 获取用户详情
       * @param {HTMLElement} row 订单行
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<Object>}
       */
      async getUserDetails(row, signal) {
        // 使用更稳定的选择器定位用户名元素
        let usernameEl = row.querySelector("td:nth-child(2) .el-tooltip"); // 用户名通常在第二列
        if (!usernameEl) {
          // 如果第二列找不到，尝试其他方式
          const usernameEls = row.querySelectorAll(".el-tooltip");
          if (usernameEls.length > 0) {
            usernameEl = usernameEls[0]; // 取第一个el-tooltip元素
          } else {
            // throw new Error("找不到用户名元素");
            return null;
          }
        }
  
        // 点击用户名打开详情弹窗
        usernameEl.click();
        
        // 等待弹窗出现
        const dialog = await waitForElement(
          '.el-dialog__wrapper:not([style*="display: none"])',
          5000,
          document,
          signal
        );
  
        if (!dialog) {
          // throw new Error("用户详情弹窗格式异常");
          return null;
        }
        // 等待财务表格渲染并有内容
        const el = await waitForElement(
            ".el-table__body .cell > span",
            5000,
            dialog,
            signal,
            { requireText: true }
        );
        if (!el) {
          // throw new Error("用户详情弹窗格式异常");
          return null;
        }

        // 获取弹窗中的所有表格
        const tables = dialog.querySelectorAll(".el-table");
        if (tables.length < 2) {
          //throw new Error("用户详情弹窗格式异常");
          return null;
        }
  
        console.log("用户详情弹窗第一个表格", tables[0]);
        console.log("用户详情弹窗第二个表格", tables[1]);
        console.log("用户详情弹窗第三个表格", tables[2]);
        console.log("用户详情弹窗第四个表格", tables[3]);
        console.log("用户详情弹窗第五个表格", tables[4]);
        console.log("用户详情弹窗第六个表格", tables[5]);

        // 第二个表格包含所需的财务数据
        const financialTable = tables[1];
        const cells = financialTable.querySelectorAll(".el-table__body .cell > span");
  
        // 按固定位置提取数值（索引从0开始）
        // 列顺序：余额, 误差, 订单充值, 订单提现, 提现手续费, 公积金购买, 通行证购买, 充提差, 游戏盈亏, 总投注额, 总打码量, 赠送总额
        const balanceText = cells[0]?.textContent || "0"; // 余额
        const totalRechargeText = cells[2]?.textContent || "0"; // 订单充值
        const profitText = cells[8]?.textContent || "0"; // 游戏盈亏
        const totalBetText = cells[9]?.textContent || "0"; // 总投注额
        const totalBonusText = cells[11]?.textContent || "0"; // 赠送总额
  
        // 第一个表格包含相同IP用户数
        const sameIPTable = tables[0];
        const sameIPUsersText = sameIPTable?.querySelector(".el-table__body tr td:nth-child(4) .cell > span")?.textContent || "0";

        // 数值解析函数
        const parseValue = (text) => {
          // 移除所有非数字字符（保留小数点和负号）
          const numStr = text.replace(/[^\d.-]/g, "");
          return parseFloat(numStr) || 0;
        };
  
        // 解析各数值
        const totalBet = parseValue(totalBetText); // 总投注额
        const totalBonus = parseValue(totalBonusText); // 赠送总额
        const totalRecharge = parseValue(totalRechargeText); // 订单充值
        const profit = parseValue(profitText); // 游戏盈亏
        const sameIPUsers = parseInt(sameIPUsersText) || 0; // 相同IP用户数
        const balance = parseValue(balanceText); // 余额
  
        this.config.totalBetAmount = totalBet; // 记录当前订单的总投注额
        this.config.profitAmount = profit; // 记录当前订单的游戏盈亏
  
        // 从用户信息区域提取用户ID
        const userIdEl = dialog.querySelector(
          ".el-table__row .cell div div:nth-child(3)"
        );
        const userId = userIdEl
          ? userIdEl.textContent.replace("ID:", "").trim()
          : null;
  
        console.log("订单号:",this.config.currentOrderId,"用户ID:",userId);
        console.log("订单号:",this.config.currentOrderId,"相同IP用户数:",sameIPUsers);
        console.log("订单号:",this.config.currentOrderId,"余额:",balance);
        console.log("订单号:",this.config.currentOrderId,"订单充值:",totalRecharge);
        console.log("订单号:",this.config.currentOrderId,"游戏盈亏:",profit);
        console.log("订单号:",this.config.currentOrderId,"总投注额:",totalBet);
        console.log("订单号:",this.config.currentOrderId,"赠送总额:",totalBonus);

        if (!userId) {
          // throw new Error("无法获取用户ID");
          return null;
        }
  
        // 关闭弹窗
        this.closeDialog(dialog);
  
        return {
          userId,
          totalBet,
          totalBonus,
          totalRecharge,
          profit,
          sameIPUsers,
          balance
        };
      }
  
      /**
       * 检查财务条件
       * @param {Object} details 用户详情
       * @returns {boolean}
       */
      checkFinancialConditions(details) {
        const {
          totalBet,
          totalBonus,
          totalRecharge,
          profit,
          sameIPUsers,
          balance
        } = details;
  
        // 1.2 检查总投注额 > 赠送总额 × 指定倍数
        if (totalBet <= totalBonus * this.config.betToBonusRatio) {
          updateStatus(
            `订单 ${this.config.currentOrderId} 投注额不满足大于赠送额指定倍数条件`
          );
          return false;
        }
  
        // 1.3 检查总投注额 > 订单充值 × 指定倍数
        if (totalBet <= totalRecharge * this.config.betToRechargeRatio) {
          updateStatus(
            `订单 ${this.config.currentOrderId} 投注额不满足大于充值额指定倍数条件`
          );
          return false;
        }
  
        // 1.4 检查游戏盈亏绝对值 < 订单充值 × 指定倍数
        if (Math.abs(profit) >= totalRecharge * this.config.profitToRechargeRatio) {
          updateStatus(
            `订单 ${this.config.currentOrderId} 盈亏不满足小于充值额指定倍数条件`
          );
          return false;
        }
  
        // 检查相同IP用户数是否超过限制
        if (sameIPUsers > this.config.maxSameIPUsers) {
          updateStatus(`订单 ${this.config.currentOrderId} 相同IP用户数超过限制`);
          return false;
        }
  
        // 检查用户余额是否满足最低要求
        if (balance > this.config.minBalance) {
          updateStatus(
            `订单 ${this.config.currentOrderId} 余额过多 (${balance} > ${this.config.minBalance})`
          );
          return false;
        }
  
        return true;
      }
  
      /**
       * 检查提现记录
       * @param {string} userId 用户ID
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async checkWithdrawRecords(userId, signal) {
        // 跳转到提现记录页面
        await this.navigateTo("#/order/order-withdraw", signal);
  
        // 1. 查找用户ID输入框
        const idInput = await waitForElement(
          'input[placeholder="请输入用户ID"].el-input__inner',
          5000,
          null,
          signal
        );
  
        // 2. 设置用户ID值
        await this.setInputValue(idInput, userId, signal);
  
        // 3. 调整日期范围
        await this.adjustDateTimeRange(signal);
  
        // 4. 设置订单状态为"已支付"
        await this.selectDropdownOption("全部状态", "已支付", signal);
  
        // 5. 点击查询按钮
        
        const queryBtn = await this.findQueryButton(signal);
        if (!queryBtn) {
            updateStatus(`用户 ${userId} 找不到查询按钮`);
            return false;
        }
        queryBtn.click();
  
        // 6. 等待查询结果
        await delay(2000);
  
        // 7. 检查提现次数
        const todayCount = await this.checkWithdrawTimes(signal);
        if (todayCount > this.config.maxWithdrawTimes) {
          updateStatus(`用户 ${userId} 当天提现次数超过限制`);
          return false;
        }
  
        // 8. 检查CoinPay提现记录
        const hasCoinPay = await this.checkCoinPayWithdraw(signal);
        if (hasCoinPay) {
          updateStatus(`用户 ${userId} 有CoinPay提现记录`);
          return false;
        }
  
        return true;
      }
  
      /**
       * 处理代理页面
       * @param {string} userId 用户ID
       * @param {AbortSignal} signal 取消信号
       */
      async processAgentPage(userId, signal) {
        // 跳转到代理页面
        await this.navigateTo("#/agent/agent-list", signal);
        await delay(1000);
        // 1. 查找用户ID输入框
        const idInput = await waitForElement(
          'input[placeholder="请输入用户ID"].el-input__inner',
          5000,
          null,
          signal
        );
  
        if (!idInput) {
          return false;
        }
        // 2. 设置用户ID值
        await this.setInputValue(idInput, userId, signal);
  
        // 3. 点击查询按钮
        const queryBtn = await this.findQueryButton(signal);
        if (!queryBtn) {
            updateStatus(`用户 ${userId} 找不到查询按钮`);
            return false;
        }
        queryBtn.click();
  
        // 4. 等待查询结果
        await delay(1500);
        return true;
      }
      
      /**
       * 检查代理条件
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async checkAgentConditions(signal) {
        // 获取代理信息
        const rows = await this.getAgentRows(signal);
        if (rows.length === 0) {
          return false; // 根据用户id没有查询到对应的用户数据
        }
        if (rows.length > 1) {
          return false; // 查询到多个用户数据说明没有根据用户id查询
        }
        // 取第一行数据进行判断
        const row = rows[0];
        const cells = row.querySelectorAll("td");
        if (cells.length < 4) {
          throw new Error("代理表格结构异常");
        }
  
        // 获取上级代理（第2列）
        let superiorAgent = "";
        const agentCell = cells[1];
        if (agentCell) {
          const span =
            agentCell.querySelector(".el-tooltip") ||
            agentCell.querySelector("span");
          if (span) {
            superiorAgent = span.textContent.trim();
          }
        }
  
        // 获取直推成员数量（第4列）
        let directMembers = 0;
        const directMembersSpan = cells[3]?.querySelector(".cell > span");
        if (directMembersSpan) {
          directMembers = parseInt(directMembersSpan.textContent.trim()) || 0;
        }
  
        console.log(`上级代理: ${superiorAgent}, 直推成员: ${directMembers}`);

        // 判断代理条件：存在上级代理或直推成员>=1则不满足
        if (superiorAgent || directMembers >= 1) {
          updateStatus(`代理条件不满足`);
          return false;
        }
  
        return true;
      }
  
      /**
       * 批准订单
       * @param {HTMLElement} row 订单行
       * @param {AbortSignal} signal 取消信号
       */
      async approveOrder(row, signal) {
        // 点击"待审核大额"按钮
        const cells = row.querySelectorAll("td");
        const statusCell = cells[10]; // 第11列单元格（订单状态）
        
        if (!statusCell) {
          throw new Error("找不到订单状态单元格");
        }
  
        const statusSpan = statusCell.querySelector(".cell > span");
        if (!statusSpan?.textContent.includes("待审核")) {
          throw new Error("订单状态不是待审核");
        }
  
        statusSpan.click();
  
        // 等待弹窗出现
        const dialog = await waitForElement(
          '.el-dialog__wrapper:not([style*="display: none"])',
          5000,
          document,
          signal
        );
        if (!dialog) {
          throw new Error("同意出款弹窗格式异常");
        }
  
        // 查找密码输入框
        const passwordInput = await waitForElement(
            '.myDialog input.el-input__inner',
            3000,
            dialog,
            signal
        );
  
        // 设置密码
        await this.setInputValue(passwordInput, this.config.password, signal);
  
        // 点击批准按钮
        const approveBtn = await waitForElement(
          '.el-button--success',
          3000,
          dialog,
          signal
        );
        approveBtn.click();
  
        // 等待确认弹窗
        const confirmDialog = await waitForElement(
          '.el-message-box__wrapper:not([style*="display: none"])',
          5000,
          document,
          signal
        );
  
        // 点击确认按钮
        const confirmBtn = await waitForElement(
          '.el-button--primary',
          3000,
          confirmDialog,
          signal
        );
        confirmBtn.click();
  
        // 等待操作完成
        await delay(1000);
      }
  
      /**
       * 跳转到指定页面
       * @param {string} hash 页面hash
       * @param {AbortSignal} signal 取消信号
       */
      async navigateTo(hash, signal) {
        if (window.location.hash.includes(hash)) {
          await delay(1000);
          return;
        }
  
        window.location.hash = hash;
        await waitForPageChange(hash, 10000);
        await delay(1000); // 额外等待确保页面稳定
      }
  
      /**
       * 跳转到订单页面
       */
      async navigateToOrderPage() {
        await this.navigateTo("#/order/unread-withdraw");
      }
  
      /**
       * 跳转到最后一页
       * @param {AbortSignal} signal 取消信号
       */
      async goToLastPage(signal) {
        const pageInput = await waitForElement(
          ".el-pagination__editor input",
          5000,
          null,
          signal
        );
        const jumpBtn = await waitForElement(
          ".el-pagination__jump",
          5000,
          null,
          signal
        );
  
        // 设置页码为总页数
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        ).set;
        setter.call(pageInput, config.totalPages);
        pageInput.dispatchEvent(new Event("input", { bubbles: true }));
        pageInput.dispatchEvent(new Event("change", { bubbles: true }));
  
        // 模拟回车键触发跳转
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        });
        pageInput.dispatchEvent(enterEvent);
  
        // 等待页面加载
        await delay(2000);
        await this.processOrderPage(signal);
      }
  
      /**
       * 跳转到上一页
       * @param {AbortSignal} signal 取消信号
       */
      async goToPrevPage(signal) {
        const prevBtn = await waitForElement(
          ".el-pagination .btn-prev:not([disabled])",
          5000,
          null,
          signal
        );
        prevBtn.click();
        config.currentPage--;
        await delay(2000);
        await this.processOrderPage(signal);
      }
  
      /**
       * 开始新一轮处理
       */
      async startNewRound(signal) {
        updateStatus("所有订单已处理完成");
        config.completedOneRound = true;
        GM_setValue("completedOneRound", true);
  
        // 点击查询按钮重新开始
        await this.clickSearchButton(signal);
      }
  
      /**
       * 点击查询按钮
       */
      async clickSearchButton(signal) {
        // 获取所有filter-container元素
        const filterContainers = document.querySelectorAll(".filter-container");
  
        // 第三个filter-container包含查询按钮
        if (filterContainers.length >= 3) {
          const searchContainer = filterContainers[2];
  
          // 查找查询按钮
          const searchBtn = Array.from(
            searchContainer.querySelectorAll("button.el-button")
          ).find((btn) => !btn.disabled && btn.textContent.includes("查询"));
  
          if (searchBtn) {
            updateStatus("点击查询按钮重新开始处理...");
  
            // 先清空所有搜索条件
            clearAllSearchInputs();
  
            // 点击查询按钮
            searchBtn.click();
  
            // 等待查询完成
            await delay(1500);
  
            config.completedOneRound = false;
            GM_setValue("completedOneRound", false);
  
            // 重新开始处理
            await delay(500);
            await this.processOrderPage(signal);
            return;
          }
        }
  
        // 如果没找到按钮，尝试其他方式
        updateStatus("未找到查询按钮，3秒后尝试重新开始");
        await delay(3000);
        await this.processOrderPage(signal);
      }
  
      /**
       * 获取订单行
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<NodeListOf<HTMLElement>>}
       */
      async getOrderRows(signal) {
        return await retryOperation(
          () => {
            // 找到包含“提现用户”表头的表格
            const orderTable = Array.from(document.querySelectorAll(".el-table--scrollable-x"))
              .find(table => table.textContent.includes("提现用户"));

            if (!orderTable) {
              throw new Error("未找到包含 '提现用户' 的订单表格");
            }

            const rows = orderTable.querySelectorAll(".el-table__body .el-table__row");
            if (rows.length === 0) {
              throw new Error("订单表格没有行数据");
            }

            return rows;
          },
          3,
          1000,
          signal
        );
      }
  
      /**
       * 获取代理行
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<NodeListOf<HTMLElement>>}
       */
      async getAgentRows(signal) {
        return await retryOperation(
          () => {
            const rows = document.querySelectorAll(".el-table__body .el-table__row");
            return rows;
          },
          3,
          1000,
          signal
        );
      }
  
      /**
       * 检查提现次数
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<number>}
       */
      async checkWithdrawTimes(signal) {
        // 检查是否有"暂无数据"提示
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
          return 0;
        }
  
        // 获取表格的所有行
        const rows = await this.getOrderRows(signal);
        if (rows.length <= 1) {
          return 0; // 只有统计行，没有实际数据
        }
  
        // 计算当天的 GMT+0 日期（系统时间默认是 GMT+8，所以减去 8 小时得到 GMT+0）
        const now = new Date();
        now.setHours(now.getHours() - 8);
        const todayGMT0Year = now.getUTCFullYear();
        const todayGMT0Month = now.getUTCMonth();
        const todayGMT0Date = now.getUTCDate();
  
        let todayCount = 0;
  
        // 遍历数据行（跳过第一行统计数据）
        for (let i = 1; i < rows.length; i++) {
          const cells = rows[i].querySelectorAll("td");
  
          // 固定位置第 6 列（索引 5）为 "回调时间(GMT+0:00)"
          const timeCell = cells[5]?.querySelector(".cell");
          if (!timeCell) continue;
  
          const timeText = timeCell.textContent.trim();
          if (!timeText) continue;
  
          // 解析日期字符串
          const recordDate = new Date(timeText); // 假设 timeText 是 GMT+0 时间
          if (
            recordDate.getUTCFullYear() === todayGMT0Year &&
            recordDate.getUTCMonth() === todayGMT0Month &&
            recordDate.getUTCDate() === todayGMT0Date
          ) {
            todayCount++;
          }
        }
  
        return todayCount;
      }
  
      /**
       * 检查CoinPay提现记录
       * @param {AbortSignal} signal 取消信号
       * @returns {Promise<boolean>}
       */
      async checkCoinPayWithdraw(signal) {
        // 找到第三方下拉选择框
        const thirdPartySelect = await waitForElement(
          '.el-select input[placeholder="全部"]',
          5000,
          null,
          signal
        );
  
        // 点击下拉框
        thirdPartySelect.click();
  
        // 等待下拉菜单出现
        const dropdown = await waitForElement(
          '.el-select-dropdown.el-popper:not([style*="display: none"])',
          5000,
          null,
          signal
        );
  
        // 查找CoinPay选项
        const items = dropdown.querySelectorAll(".el-select-dropdown__item");
        let coinPayItem = null;
        for (const item of items) {
          if (item.textContent.trim().toLowerCase() === "coinpay") {
            coinPayItem = item;
            break;
          }
        }
  
        if (!coinPayItem) {
          throw new Error("找不到CoinPay选项");
        }
  
        // 点击选项
        coinPayItem.click();
  
        // 点击查询按钮
        
        const queryBtn = await this.findQueryButton(signal);
        if (!queryBtn) {
            return false;
        }
        queryBtn.click();
  
        // 等待查询结果
        await delay(2000);
  
        // 检查是否有数据
        const emptyText = document.querySelector(".el-table__empty-text");
        if (emptyText?.textContent.includes("暂无数据")) {
          return false;
        }
  
        // 检查表格行数（减1是因为第一行是统计数据）
        const rows = document.querySelectorAll(".el-table__body .el-table__row");
        return rows.length > 1;
      }
  
      /**
       * 调整日期时间范围（减8小时）
       * @param {AbortSignal} signal 取消信号
       */
      async adjustDateTimeRange(signal) {
        const dateRangeInputs = await waitForElement(
          ".el-range-input",
          5000,
          null,
          signal
        );
        if (!dateRangeInputs || dateRangeInputs.length < 2) {
          throw new Error("找不到日期范围输入框");
        }
  
        const startInput = dateRangeInputs[0];
        const endInput = dateRangeInputs[1];
  
        // 获取当前日期时间
        const now = new Date();
        const endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59
        );
        const startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        );
  
        // 减8小时
        startDate.setHours(startDate.getHours() - 8);
        endDate.setHours(endDate.getHours() - 8);
  
        // 格式化日期时间
        const formatDate = (date) => {
          const pad = (num) => num.toString().padStart(2, "0");
          return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
          )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
          )}`;
        };
  
        // 设置日期时间
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        ).set;
        setter.call(startInput, formatDate(startDate));
        startInput.dispatchEvent(new Event("input", { bubbles: true }));
  
        setter.call(endInput, formatDate(endDate));
        endInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
  
      /**
       * 设置输入框值
       * @param {HTMLInputElement} input 输入框
       * @param {string} value 值
       * @param {AbortSignal} signal 取消信号
       */
      async setInputValue(input, value, signal = null) {
        if (signal?.aborted) return;
  
        input.focus();
        input.value = "";
  
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(input, value);
  
        ["input", "change", "blur"].forEach((eventType) => {
          input.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
  
        await delay(300); // 确保值已设置
      }
  
      /**
       * 选择下拉选项
       * @param {string} placeholder 下拉框placeholder
       * @param {string} optionText 选项文本
       * @param {AbortSignal} signal 取消信号
       */
      async selectDropdownOption(placeholder, optionText, signal) {
        const selectInput = await waitForElement(
          `.el-select input[placeholder="${placeholder}"]`,
          5000,
          null,
          signal
        );
        selectInput.click();
  
        const dropdown = await waitForElement(
          '.el-select-dropdown.el-popper:not([style*="display: none"])',
          5000,
          null,
          signal
        );
  
        const options = dropdown.querySelectorAll(".el-select-dropdown__item");
        const targetOption = Array.from(options).find(option => 
          option.textContent.trim().toLowerCase() === optionText.toLowerCase()
        );
  
        if (!targetOption) {
          throw new Error(`找不到选项: ${optionText}`);
        }
  
        targetOption.click();
        await delay(500); // 等待选择生效
      }
  
      /**
       * 关闭弹窗
       * @param {HTMLElement} dialog 弹窗元素
       */
      closeDialog(dialog) {
        const closeBtn = dialog.querySelector(".el-dialog__headerbtn");
        if (closeBtn) closeBtn.click();
      }
  
      /**
       * 关闭所有弹窗
       */
      async closeAllDialogs(signal) {
        const dialogs = document.querySelectorAll('.el-dialog__wrapper:not([style*="display: none"])');
        if (!dialogs) {
          processor.processOrderPage(signal);
          return;
        }
        for (const dialog of dialogs) {
          const closeBtn = dialog.querySelector('.el-dialog__headerbtn');
          if (closeBtn) closeBtn.click();
          await delay(300);
        }
      }
    }
  
    // 创建处理器实例
    const processor = new OrderProcessor(config);
  
    // 初始化
    function init() {
      // 初始化控制面板
      addControlPanel();
  
      // 检查是否已完成一轮处理
      config.completedOneRound = GM_getValue("completedOneRound", false);
      if (config.completedOneRound) {
        updateStatus("检测到已完成一轮处理，开始新一轮处理");
        GM_setValue("completedOneRound", false);
        // config.processedOrders = {};
        // GM_setValue("processedOrders", {});
        // document.getElementById("processedCount").textContent = "0";
      }
  
      updateStatus("准备就绪");
  
      // 监听hash变化
      // window.addEventListener("hashchange", () => {
      //   if (!config.isProcessing) return;
  
      //   if (isOrderPage()) {
      //     processor.processOrderPage();
      //   } else if (isAgentPage()) {
      //     processor.checkAgentConditions();
      //   } else if (isWithdrawPage()) {
      //     processor.processWithdrawPage();
      //   } else if (isTopupPage()) {
      //     processor.processTopupPage();
      //   } else {
      //       // 其他所有页面都返回订单页
      //       processor.navigateToOrderPage();
      //   }
      // });
  
      // 如果当前已经在订单页面且正在处理中，直接开始处理
      if (config.isProcessing) {
        updateStatus("恢复处理中...");
        processor.processOrderPage(processor.abortController.signal);
      }
    }
  
    // 页面加载完成后执行
    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init);
    }
  })();