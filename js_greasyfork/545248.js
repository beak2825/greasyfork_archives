// ==UserScript==
// @name         TradingView Trade Buttons (MXC, Bybit, Binance)
// @namespace    http://tampermonkey.net/
// @version      0.43
// @description  Add MXC, Bybit, Binance, Copy buttons to TradingView Long/Short Position dialog
// @author       GPT
// @match        https://*.tradingview.com/chart/*
// @downloadURL https://update.greasyfork.org/scripts/545248/TradingView%20Trade%20Buttons%20%28MXC%2C%20Bybit%2C%20Binance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545248/TradingView%20Trade%20Buttons%20%28MXC%2C%20Bybit%2C%20Binance%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SELECTORS = {
    RISK_USDT: "//div[@role='dialog']//div[@class='content-RLntasnw']/div[6]//input[@name='number-input']",
    ENTRY: "//div[@role='dialog']//div[@class='content-RLntasnw']/div[8]//input[@name='number-input']",
    TAKE_PROFIT: "//div[@role='dialog']//div[@class='content-RLntasnw']/div[16]//input[@name='number-input']",
    STOP_LOSS: "//div[@role='dialog']//div[@class='content-RLntasnw']/div[22]//input[@name='number-input']",
    SYMBOL: "//*[@id='header-toolbar-symbol-search']/div",
    INTERVAL: "(//div[contains(@class,'legendMainSourceWrapper')]//button[normalize-space(text())!=''])[2]",
    REASON: "(//div[contains(@class,'legend')]//div[contains(@class,'mainTitle')]//div[contains(@class,'title-l31H9iuA')])[2]"
  };

  const CONSTANTS = {
    RISK_USDT: 2
  };

  class Logger {
    constructor() {
      this.currentUrls = null;
      this.lastTradeInfoWithoutUrls = null;
    }

    injectButtonsIntoTradeDialog(urls) {
      const dialog = document.querySelector("#overlap-manager-root div[role='dialog']");
      if (!dialog || dialog.querySelector(".custom-trade-buttons")) return;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "custom-trade-buttons";
      buttonContainer.style.cssText = `
        display: flex;
        gap: 6px;
        margin-top: 10px;
        justify-content: flex-end;
      `;

      const buttonStyle = `
        background: #333;
        color: #fff;
        border: none;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
      `;

      const createButton = (label, key) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.style.cssText = buttonStyle;
        btn.onclick = () => {
          if (urls && urls[`${key}Supported`]) window.open(urls[key], "_blank");
        };
        return btn;
      };

      buttonContainer.appendChild(createButton("MXC", "mexc"));
      buttonContainer.appendChild(createButton("Bybit", "bybit"));
      buttonContainer.appendChild(createButton("Binance", "binance"));

      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.style.cssText = buttonStyle;
      copyButton.onclick = () => {
        // Đây là ý bạn: Copy KHÔNG có urls
        const jsonContent = JSON.stringify(this.lastTradeInfoWithoutUrls, null, 2);
        navigator.clipboard.writeText(jsonContent).then(() => {
          console.log("Copied to clipboard");
        });
      };
      buttonContainer.appendChild(copyButton);

      const contentDiv = dialog.querySelector(".content-RLntasnw");
      if (contentDiv) contentDiv.appendChild(buttonContainer);
    }

    log(tradeInfo) {
      this.currentUrls = tradeInfo.urls;

      // Copy sẽ dùng object này => chủ động xoá urls
      const displayInfo = { ...tradeInfo };
      delete displayInfo.urls;
      this.lastTradeInfoWithoutUrls = displayInfo;

      this.injectButtonsIntoTradeDialog(tradeInfo.urls);
    }
  }

  class TradeInfoHandler {
    constructor(logger) {
      this.logger = logger;
      this.previousState = null;
    }

    getElementByXPath(xpath) {
      return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }

    // --- NEW: Parse chartId từ URL /chart/<chartId>/...
    getTradingViewChartIdFromUrl(href) {
      try {
        const u = new URL(href);
        const m = u.pathname.match(/\/chart\/([A-Za-z0-9]+)(?:\/|$)/);
        return m ? m[1] : null;
      } catch {
        return null;
      }
    }

    // --- NEW: Lấy symbol/interval theo "đúng querystring TradingView" nếu có
    // Fallback hợp lý nếu thiếu querystring.
    deriveTVSymbolInterval(symbolText, intervalText) {
      const u = new URL(document.location.href);

      // Ưu tiên lấy từ querystring
      let symbol = u.searchParams.get("symbol");
      let interval = u.searchParams.get("interval");

      // Fallback symbol: nếu toolbar không có symbol param
      // symbolText có thể dạng: "BTCUSDT.P" hoặc "BINANCE:BTCUSDT.P"
      if (!symbol) {
        const s = (symbolText || "").trim();
        symbol = s || null;
      }

      // Fallback interval: ưu tiên query; nếu không có, dùng text interval trên chart
      if (!interval) {
        const itv = (intervalText || "").trim();
        interval = itv || null;
      }

      return { symbol, interval };
    }

    // --- NEW: Build tradingviewURL dựa trên chartId + querystring (giữ các param khác)
    buildTradingViewURL(symbolText, intervalText) {
      const href = document.location.href;
      const current = new URL(href);

      const chartId = this.getTradingViewChartIdFromUrl(href);
      const { symbol, interval } = this.deriveTVSymbolInterval(symbolText, intervalText);

      // Base theo template chartId bạn muốn
      const base = chartId
        ? `https://www.tradingview.com/chart/${chartId}/`
        : `https://www.tradingview.com/chart/`;

      // Giữ nguyên querystring hiện tại, nhưng đảm bảo set symbol + interval
      const out = new URL(base);
      current.searchParams.forEach((v, k) => out.searchParams.set(k, v));

      if (symbol) out.searchParams.set("symbol", symbol);
      if (interval) out.searchParams.set("interval", interval);

      return {
        tradingviewURL: out.href,
        chartId,
        tvSymbol: symbol || null,
        tvInterval: interval || null
      };
    }

    getDirectTradeInfo() {
      const entry = this.getElementByXPath(SELECTORS.ENTRY)?.value;
      const takeprofit = this.getElementByXPath(SELECTORS.TAKE_PROFIT)?.value;
      const stoploss = this.getElementByXPath(SELECTORS.STOP_LOSS)?.value;
      const riskUsdt = this.getElementByXPath(SELECTORS.RISK_USDT)?.value;

      if (!entry || !takeprofit || !stoploss) {
        return null;
      }

      return {
        entry: parseFloat(entry),
        takeprofit: parseFloat(takeprofit),
        stoploss: parseFloat(stoploss),
        riskUSDT: parseFloat(riskUsdt || CONSTANTS.RISK_USDT),
        direction: parseFloat(entry) > parseFloat(stoploss) ? "buy" : "sell"
      };
    }

    generateUrls(tradeData, symbol) {
      const cleanSymbol = symbol.replace("/", "").replace("USDT", "").replace(".P", "");
      const fullSymbol = cleanSymbol + "USDT";

      const params = {
        direction: tradeData.direction,
        entry: tradeData.entry,
        type: "limit",
        stoploss: tradeData.stoploss,
        takeprofit: tradeData.takeprofit,
        riskUsdt: tradeData.riskUSDT || CONSTANTS.RISK_USDT,
        reason: "lý do vào lệnh"
      };
      const query = new URLSearchParams(params).toString();

      return {
        mexc: `https://futures.mexc.com/vi-VN/exchange/${cleanSymbol}_USDT?${query}`,
        bybit: `https://www.bybit.com/trade/usdt/${fullSymbol}?${query}`,
        binance: `https://www.binance.com/en/futures/${cleanSymbol}?${query}`,
        mexcSupported: true,
        bybitSupported: true,
        binanceSupported: true
      };
    }

    getTradeInfo() {
      try {
        const symbolText = this.getElementByXPath(SELECTORS.SYMBOL)?.textContent;
        const intervalText = this.getElementByXPath(SELECTORS.INTERVAL)?.textContent;
        const reason = this.getElementByXPath(SELECTORS.REASON)?.textContent;

        const tradeData = this.getDirectTradeInfo();
        if (!tradeData || !symbolText) return null;

        const urls = this.generateUrls(tradeData, symbolText);

        const entry = tradeData.entry;
        const takeprofit = tradeData.takeprofit;
        const stoploss = tradeData.stoploss;

        let rr = 0;
        if (entry && takeprofit && stoploss) {
          const risk = Math.abs(entry - stoploss);
          const reward = Math.abs(takeprofit - entry);
          rr = risk > 0 ? reward / risk : 0;
        }

        // --- NEW: Build tradingviewURL + chartId + tvSymbol/tvInterval
        const tv = this.buildTradingViewURL(symbolText, intervalText);

        const tradeInfo = {
          note: "SLTP",

          apiList: "BINANCE-02.P",
          direction: tradeData.direction,
          price: entry,
          type: "limit",
          riskUSDT: tradeData.riskUSDT,
          interval: intervalText || "Unknown",
          symQuote: "USDT",
          tp: takeprofit,
          sl: stoploss,
          rr: parseFloat(rr.toFixed(2)),
          urls: urls,
          symbol: symbolText.replace(".P", "") || "Unknown",
          createdBy: "tradingview.com",
          subnote: "Manual",
          reason: reason || "Ly_do_vao_lenh",

          // ✅ Đây là field bạn muốn thêm
          tradingviewURL: tv.tradingviewURL,
          chartId: tv.chartId,
          tvSymbol: tv.tvSymbol,
          tvInterval: tv.tvInterval
        };

        return tradeInfo;
      } catch (error) {
        console.error("Trade Info Error:", error);
        return null;
      }
    }

    start() {
      setInterval(() => {
        const tradeInfo = this.getTradeInfo();
        if (tradeInfo) {
          this.logger.log(tradeInfo);
        }
      }, 1000);
    }
  }

  const logger = new Logger();
  const handler = new TradeInfoHandler(logger);
  handler.start();
})();
