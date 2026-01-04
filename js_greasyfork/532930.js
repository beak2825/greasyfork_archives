// ==UserScript==
// @name         建行积存金价格持续监控（卡尔曼滤波预测版）
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  实时监控建行积存金价格，使用卡尔曼滤波预测价格，价格变化时输出日志和通知，保持会话活跃。
// @match        https://ibsbjstar.ccb.com.cn/CCBIS/B2CMainPlat_07*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532930/%E5%BB%BA%E8%A1%8C%E7%A7%AF%E5%AD%98%E9%87%91%E4%BB%B7%E6%A0%BC%E6%8C%81%E7%BB%AD%E7%9B%91%E6%8E%A7%EF%BC%88%E5%8D%A1%E5%B0%94%E6%9B%BC%E6%BB%A4%E6%B3%A2%E9%A2%84%E6%B5%8B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532930/%E5%BB%BA%E8%A1%8C%E7%A7%AF%E5%AD%98%E9%87%91%E4%BB%B7%E6%A0%BC%E6%8C%81%E7%BB%AD%E7%9B%91%E6%8E%A7%EF%BC%88%E5%8D%A1%E5%B0%94%E6%9B%BC%E6%BB%A4%E6%B3%A2%E9%A2%84%E6%B5%8B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 防止脚本重复执行
  if (window.scriptHasRun) return;
  window.scriptHasRun = true;

  console.log("script start running");

  // 配置参数
  const SERVERCHAN_KEY = 'SCT170695TVgILvV5PXeNF7akHCyhT8V7d';
  const ALERT_LOW = 750.00;
  const ALERT_HIGH = 770.00;
  const ALERT_HIGH_2 = 800.00;
  const ALERT_LOW_2 = 798.00;

  let lastPrice = null;
  let kalmanFilter = null;
  let hasNotifiedLow = false;  // 是否已发送价格跌破760的通知
  let hasNotifiedHigh = false; // 是否已发送价格涨过800的通知
  let previousPrice = null;    // 用于记录上次价格，确保价格变动才通知

  // 卡尔曼滤波器类（自适应 Q 和 R）
  class AdaptiveKalmanFilter {
    /**
     * @param {number} initialPrice 初始状态估计
     * @param {number} processNoise 初始过程噪声 Q
     * @param {number} measurementNoise 初始测量噪声 R
     * @param {number} alphaQ 过程噪声更新遗忘因子（0<alphaQ<1）
     * @param {number} alphaR 测量噪声更新遗忘因子（0<alphaR<1）
     */
    constructor(initialPrice,
      processNoise = 0.01,
      measurementNoise = 0.1,
      alphaQ = 0.95,
      alphaR = 0.90) {
      this.estimate = initialPrice;        // x̂ₖ|ₖ
      this.P = 1;                          // 估计协方差 Pₖ|ₖ
      this.Q = processNoise;              // 过程噪声 Q
      this.R = measurementNoise;          // 测量噪声 R
      this.alphaQ = alphaQ;                // Q 更新遗忘因子
      this.alphaR = alphaR;                // R 更新遗忘因子
      this.prevEstimate = initialPrice;    // 上一次滤波后的状态
    }

    // 预测步骤
    predict() {
      // x̂ₖ|ₖ₋₁ = x̂ₖ₋₁|ₖ₋₁
      // Pₖ|ₖ₋₁ = Pₖ₋₁|ₖ₋₁ + Q
      this.P += this.Q;
      return this.estimate;
    }

    // 更新步骤，并自适应更新 Q、R
    update(measurement) {
      // 计算卡尔曼增益
      const K = this.P / (this.P + this.R);

      // 预测值与测量值之差（创新）
      const residual = measurement - this.estimate;

      // 状态更新：x̂ₖ|ₖ = x̂ₖ|ₖ₋₁ + K * residual
      this.estimate += K * residual;

      // 协方差更新：Pₖ|ₖ = (1 - K) * Pₖ|ₖ₋₁
      this.P *= (1 - K);

      // -------- 自适应噪声更新 --------
      // 1. 更新测量噪声 R：基于创新的平方
      //    R_new = alphaR * R_old + (1 - alphaR) * residual^2
      this.R = this.alphaR * this.R + (1 - this.alphaR) * residual * residual;

      // 2. 更新过程噪声 Q：基于状态变化量
      //    stateDiff = x̂ₖ|ₖ - x̂ₖ₋₁|ₖ₋₁
      const stateDiff = this.estimate - this.prevEstimate;
      //    Q_new = alphaQ * Q_old + (1 - alphaQ) * stateDiff^2
      this.Q = this.alphaQ * this.Q + (1 - this.alphaQ) * stateDiff * stateDiff;

      // 保存本次估计，以用于下一次 Q 计算
      this.prevEstimate = this.estimate;

      return this.estimate;
    }
  }
  // 获取价格的函数，增加错误处理
  function getPrice() {
    try {
      const priceRow = document.getElementById('realTimePriceTr');
      if (!priceRow) return null;
      const priceTds = priceRow.querySelectorAll('td');
      if (priceTds.length < 2) return null;
      const price = parseFloat(priceTds[1].textContent.match(/\d+\.\d+/)[0]);

      const refreshBtn = document.querySelector('img[onclick="refresh();"]');
      if (refreshBtn) {
        refreshBtn.click();
      }
      return isNaN(price) ? null : price;
    } catch (e) {
      console.error('获取价格失败:', e);
      return null;
    }
  }

  // 模拟用户操作函数
  function simulateMouseActivity() {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    ['mousemove', 'mousedown', 'mouseup'].forEach(eventType => {
      document.dispatchEvent(new MouseEvent(eventType, {
        bubbles: true,
        clientX: randomX,
        clientY: randomY
      }));
    });
  }

  function simulateKeyboardActivity() {
    ['keydown', 'keyup'].forEach(eventType => {
      document.dispatchEvent(new KeyboardEvent(eventType, {
        key: 'Shift',
        bubbles: true
      }));
    });
  }

  // 价格监控与预测逻辑
  const priceCheckInterval = setInterval(() => {
    const currentPrice = getPrice();
    if (currentPrice === null) return;

    // 初始化卡尔曼滤波器
    if (!kalmanFilter) {
      kalmanFilter = new AdaptiveKalmanFilter(currentPrice,
        /*processNoise=*/0.01,
        /*measurementNoise=*/0.1,
        /*alphaQ=*/0.95,
        /*alphaR=*/0.90);
      console.log('卡尔曼滤波器已初始化，初始价格：', currentPrice);
      return;
    }

    // 执行预测并更新
    const predictedPrice = kalmanFilter.predict().toFixed(2);
    const updatedPrice = kalmanFilter.update(currentPrice).toFixed(2);


    if (currentPrice !== lastPrice) {
      console.log(`当前价格：${currentPrice.toFixed(2)} | 预测下次：${predictedPrice}`);
      lastPrice = currentPrice;

      // 价格跌破770并涨回772后再次跌破770通知
      if (currentPrice < ALERT_HIGH && currentPrice >= ALERT_LOW && !hasNotifiedLow) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://www.zakiu.site/send-alert',
          data: JSON.stringify({ price: currentPrice.toFixed(2) }),
          headers: { 'Content-Type': 'application/json' },
          onload: res => console.log(res.status === 200 ? '推送成功' : '推送失败'),
          onerror: () => console.error('推送失败，网络问题')
        });
        GM_notification({
          title: '价格跌破770',
          text: `当前价格：${currentPrice.toFixed(2)}（预测下次：${predictedPrice}）`,
          timeout: 5000
        });
        hasNotifiedLow = true;
      } else if (currentPrice >= 772) {
        hasNotifiedLow = false;
      }

      // 价格涨过800并跌回798后再次涨过800通知
      if (currentPrice > ALERT_HIGH_2 && previousPrice <= ALERT_HIGH_2 && !hasNotifiedHigh) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://www.zakiu.site/send-alert',
          data: JSON.stringify({ price: currentPrice.toFixed(2) }),
          headers: { 'Content-Type': 'application/json' },
          onload: res => console.log(res.status === 200 ? '推送成功' : '推送失败'),
          onerror: () => console.error('推送失败，网络问题')
        });
        GM_notification({
          title: '价格涨过800',
          text: `当前价格：${currentPrice.toFixed(2)}（预测下次：${predictedPrice}）`,
          timeout: 5000
        });
        hasNotifiedHigh = true;
      } else if (currentPrice < ALERT_LOW_2) {
        hasNotifiedHigh = false;
      }

      previousPrice = currentPrice;
    }
  }, 1000);

  // 保活操作
  const keepAliveInterval = setInterval(() => {
    simulateMouseActivity();
    simulateKeyboardActivity();
  }, 10000);

  // 错误捕捉机制
  window.addEventListener('error', function (e) {
    console.error('脚本发生错误:', e.message);
    // 可以选择清理定时器或重启脚本的逻辑
  });

  // 页面元素变化时，检查价格获取函数是否有效
  const priceCheckMutationObserver = new MutationObserver(() => {
    const price = getPrice();
    if (price !== null && price !== lastPrice) {
      clearInterval(priceCheckInterval);
      lastPrice = price;
      priceCheckInterval = setInterval(() => { /* 更新定时器的逻辑 */ }, 1000);
    }
  });

  // 观察价格表格的变化
  const priceTable = document.getElementById('realTimePriceTr');
  if (priceTable) {
    priceCheckMutationObserver.observe(priceTable, { childList: true, subtree: true });
  }

})();
