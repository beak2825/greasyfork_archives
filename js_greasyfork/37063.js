// ==UserScript==
// @name         Show points on Amazon.co.jp wishlist
// @version      25.10.0
// @description  Amazon.co.jpの欲しいものリストと検索ページで、Kindleの商品にポイントを表示しようとします
// @namespace    https://greasyfork.org/ja/users/165645-agn5e3
// @author       Nathurru
// @match        https://www.amazon.co.jp/*/wishlist/*
// @match        https://www.amazon.co.jp/wishlist/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/*/gp/*
// @match        https://www.amazon.co.jp/gp/*
// @match        https://www.amazon.co.jp/s*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @compatible   firefox
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/37063/Show%20points%20on%20Amazoncojp%20wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/37063/Show%20points%20on%20Amazoncojp%20wishlist.meta.js
// ==/UserScript==

/**********************************************************************************************************************
 NOTICE:このアプリケーションは国立国会図書館サーチAPI( https://iss.ndl.go.jp/information/api/ )と、openBDAPI( https://openbd.jp/ )を利用しています
 **********************************************************************************************************************/

(function () {
  "use strict";

  // ===========================================================================================
  // 設定・定数
  // ===========================================================================================
  const Config = {
    CACHE_LIFETIME_DAYS: 14,
    RESCAN_INTERVAL_HOURS: 3,
    AUTO_CLEAN_PROBABILITY: 0.01,

    CONCURRENT_PROCESSES: 3,
    PROCESS_INTERVAL_MS: 200,
    DISCOVERY_INTERVAL_MS: 1000,

    TAX_RATE: 0.1,

    DEBUG_MODE: false,

    ISBN: {
      CHECK_10_MULTIPLIER: [10, 9, 8, 7, 6, 5, 4, 3, 2],
      CHECK_13_MULTIPLIER: [1, 3],
      MODULO_10: 10,
      MODULO_11: 11,
    },

    COLORS: {
      NEGATIVE: { color: "#9B1D1E", bgColor: "initial" },
      LOW: { color: "initial", bgColor: "initial" },
      MEDIUM: { color: "initial", bgColor: "#F7D44A" },
      HIGH: { color: "#FFFFFF", bgColor: "#FE7E03" },
      VERY_HIGH: { color: "#FFFFFF", bgColor: "#9B1D1E" },
      ERROR: "#ff3c00",
      KDP: { color: "#FFFFFF", bgColor: "#ff0000" },
      PROCESSING: "#EE0077",
    },

    CLASSES: {
      PROCESSING: "amz-point-processing",
      PROCESSED: "amz-point-processed",
    },
  };

  const CACHE_LIFETIME_MS = Config.CACHE_LIFETIME_DAYS * 24 * 60 * 60 * 1000;
  const RESCAN_INTERVAL_MS = Config.RESCAN_INTERVAL_HOURS * 60 * 60 * 1000;

  // ===========================================================================================
  // URL管理
  // ===========================================================================================
  const API_URLS = {
    NDL_ISBN: (isbn) =>
      `https://iss.ndl.go.jp/api/sru?operation=searchRetrieve&recordSchema=dcndl&recordPacking=xml&query=isbn=${isbn}`,
    NDL_PUBLISHER: (publisher) =>
      `https://iss.ndl.go.jp/api/sru?operation=searchRetrieve&recordSchema=dcndl&recordPacking=xml&maximumRecords=1&mediatype=1&query=publisher=${publisher}`,
    AMAZON_PRODUCT: (asin) => `https://www.amazon.co.jp/dp/${asin}`,
    OPENBD: (isbn) => `https://api.openbd.jp/v1/get?isbn=${isbn}`,
    AMAZON_BLACK_ALLOW: () => `https://www.amazon.co.jp/black-curtain/save-eligibility/black-curtain`,
  };

  // ===========================================================================================
  // 商業出版社リスト
  // ===========================================================================================
  const COMMERCIAL_PUBLISHERS = [
    "集英社",
    "講談社",
    "KADOKAWA",
    "小学館",
    "日経BP",
    "東京書籍",
    "学研プラス",
    "文藝春秋",
    "SBクリエイティブ",
    "インプレス",
    "DeNA",
    "スクウェア・エニックス",
    "ダイヤモンド社",
    "ドワンゴ",
    "一迅社",
    "技術評論社",
    "近代科学社",
    "幻冬舎",
    "秋田書店",
    "少年画報社",
    "新潮社",
    "双葉社",
    "早川書房",
    "竹書房",
    "筑摩書房",
    "朝日新聞出版",
    "東洋経済新報社",
    "徳間書店",
    "日本文芸社",
    "白泉社",
    "扶桑社",
    "芳文社",
    "翔泳社",
  ];

  const Logger = {
    log: (...args) => Config.DEBUG_MODE && console.log(...args),
    error: (...args) => console.error(...args),
    info: (...args) => console.info(...args),
  };

  const Utils = {
    calculateTaxIncludedPrice: (price) =>
      Math.floor(price * (1 + Config.TAX_RATE)),

    calculateRate: (numerator, denominator) =>
      denominator === 0 ? 0 : (numerator / denominator) * 100,

    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

    getColorByRate(rate) {
      const { COLORS } = Config;
      if (rate < 0) return COLORS.NEGATIVE;
      if (rate < 20) return COLORS.LOW;
      if (rate < 50) return COLORS.MEDIUM;
      if (rate < 80) return COLORS.HIGH;
      return COLORS.VERY_HIGH;
    },

    parseIntSafe(str, removeComma = false) {
      if (!str) return null;
      const cleaned = removeComma ? str.replace(/,/g, "") : str;
      const parsed = parseInt(cleaned, 10);
      return isNaN(parsed) ? null : parsed;
    },

    extractNumber(text, pattern, index = 0, removeComma = false) {
      if (!text) return null;
      const match = text.match(pattern);
      if (!match || !match[index]) return null;
      return this.parseIntSafe(match[index], removeComma);
    },

    validateISBN(isbn) {
      const { ISBN } = Config;

      // ISBN-10のチェック
      if (/^4[0-9]{8}[0-9X]?$/.test(isbn)) {
        let checksum = 0;
        for (let i = 0; i < 9; i++) {
          checksum += ISBN.CHECK_10_MULTIPLIER[i] * Number(isbn[i]);
        }
        checksum =
          (ISBN.MODULO_11 - (checksum % ISBN.MODULO_11)) % ISBN.MODULO_11;
        checksum = checksum === 10 ? "X" : String(checksum);
        return checksum === isbn[9];
      }

      // ISBN-13のチェック
      if (/^9784[0-9]{9}?$/.test(isbn)) {
        let checksum = 0;
        for (let i = 0; i < 12; i++) {
          checksum += Number(isbn[i]) * ISBN.CHECK_13_MULTIPLIER[i % 2];
        }
        checksum =
          (ISBN.MODULO_10 - (checksum % ISBN.MODULO_10)) % ISBN.MODULO_10;
        return String(checksum) === isbn[12];
      }

      return false;
    },
  };

  class StorageManager {
    constructor() {
      this.SETTINGS_KEY = "SETTINGS";
      this.PUBLISHERS_KEY = "PUBLISHERS";
    }

    save(key, data) {
      if (!key || !data) return null;
      GM_setValue(key, JSON.stringify(data));
      Logger.log(`SAVED: ${key}`, data);
    }

    load(key) {
      if (!key) return null;
      const data = GM_getValue(key);
      Logger.log(`LOADED: ${key}`, data);
      return data ? JSON.parse(data) : null;
    }

    exists(key) {
      return !!GM_getValue(key);
    }

    delete(key) {
      Logger.log(`DELETE: ${key}`);
      GM_deleteValue(key);
    }

    list() {
      return GM_listValues();
    }

    isCacheActive(asin) {
      if (!this.exists(asin)) return false;
      const data = this.load(asin);
      return data && Date.now() - data.updatedAt <= RESCAN_INTERVAL_MS;
    }

    clean() {
      const keys = this.list();
      const now = Date.now();

      keys.forEach((key) => {
        if (key === this.SETTINGS_KEY || key === this.PUBLISHERS_KEY) return;

        const data = this.load(key);
        if (data && now - data.updatedAt > CACHE_LIFETIME_MS) {
          this.delete(key);
        }
      });
    }

    autoClean() {
      if (Math.random() < Config.AUTO_CLEAN_PROBABILITY) {
        this.clean();
      }
    }
  }

  class HttpClient {
    static async get(url) {
      Logger.log(`GET: ${url}`);

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          withCredentials: true,
          onload: resolve,
          onerror: reject,
          onabort: reject,
          ontimeout: reject,
        });
      });
    }
  }

  class APIClient {
    static async fetchNDLPrice(isbn) {
      try {
        const response = await HttpClient.get(API_URLS.NDL_ISBN(isbn));
        const priceElement = response.responseXML?.querySelector("price");

        if (!priceElement) return null;

        const priceText = priceElement.innerHTML.replace(/[０-９]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        );
        return Utils.extractNumber(priceText, /[0-9]+/);
      } catch (error) {
        Logger.error("NDL API Error:", error);
        return null;
      }
    }

    static async fetchOpenBDPrice(isbn) {
      try {
        const response = await HttpClient.get(API_URLS.OPENBD(isbn));
        const json = JSON.parse(response.responseText);
        return (
          json?.[0]?.onix?.ProductSupply?.SupplyDetail?.Price?.[0]
            ?.PriceAmount ?? null
        );
      } catch (error) {
        Logger.error("OpenBD API Error:", error);
        return null;
      }
    }

    static async checkPublisherInNDL(publisher) {
      try {
        const response = await HttpClient.get(
          API_URLS.NDL_PUBLISHER(publisher),
        );
        const recordsElement =
          response.responseXML?.querySelector("numberOfRecords");
        return recordsElement?.innerHTML !== "0";
      } catch (error) {
        Logger.error("NDL Publisher Check Error:", error);
        return false;
      }
    }

    /**
     * 複数のISBNから最も安い価格の書籍情報を取得
     * @param {string[]} isbns - ISBNの配列
     * @returns {Promise<{isbn: string|null, price: number|null, source: string|null}>}
     */
    static async findLowestPriceBook(isbns) {
      if (!isbns || isbns.length === 0) {
        return { isbn: null, price: null, source: null };
      }

      const priceResults = await this.fetchAllBookPrices(isbns);

      const validPrices = priceResults.filter(result =>
        result.price != null && result.price > 0
      );

      if (validPrices.length === 0) {
        Logger.log("No valid prices found for ISBNs:", isbns);
        return { isbn: null, price: null, source: null };
      }

      return validPrices.reduce((cheapest, current) =>
        current.price < cheapest.price ? current : cheapest
      );
    }

    /**
     * 複数のISBNから価格情報を並列取得
     * @private
     */
    static async fetchAllBookPrices(isbns) {
      const pricePromises = isbns.map(isbn =>
        this.fetchBookPriceWithSource(isbn)
      );

      try {
        return await Promise.all(pricePromises);
      } catch (error) {
        Logger.error("Error fetching book prices:", error);
        return [];
      }
    }

    /**
     * 単一ISBNの価格を複数のソースから取得
     * @private
     */
    static async fetchBookPriceWithSource(isbn) {
      // OpenBDを優先的に試す（一般的に高速）
      const openBDPrice = await this.fetchOpenBDPrice(isbn);
      if (openBDPrice != null) {
        return { isbn, price: openBDPrice, source: 'OpenBD' };
      }

      // OpenBDで見つからない場合はNDLを試す
      const ndlPrice = await this.fetchNDLPrice(isbn);
      if (ndlPrice != null) {
        return { isbn, price: ndlPrice, source: 'NDL' };
      }

      // どちらでも見つからない場合
      return { isbn, price: null, source: null };
    }
  }

  class AmazonDOMParser {
    constructor() {
      this.parser = new window.DOMParser();
    }

    parseHTML(html) {
      return this.parser.parseFromString(html, "text/html");
    }

    querySelector(dom, selector) {
      return dom.querySelector(selector);
    }

    querySelectorAll(dom, selector) {
      return Array.from(dom.querySelectorAll(selector));
    }

    isKindlePage(dom) {
      const element = this.querySelector(dom, "#title");
      return element && /kindle版/i.test(element.innerText);
    }

    isAgeVerification(dom) {
      return !!this.querySelector(dom, "#black-curtain-warning");
    }

    isKindleUnlimited(dom) {
      Logger.log(this.querySelector(dom, "#Kibbo-KINDLE_UNLIMITED-Desktop"),!!this.querySelector(dom, "#Kibbo-KINDLE_UNLIMITED-Desktop"))
      return !!this.querySelector(dom, "#Kibbo-KINDLE_UNLIMITED-Desktop");
    }

    getASIN(dom) {
      return this.querySelector(dom, "#ASIN")?.value ?? null;
    }

    getKindlePrice(dom) {
      const element = this.querySelector(dom, "#Ebooks-desktop-KINDLE_ALC-prices-kindlePrice");
      if (!element) return null;
      Logger.log(element);
      return Utils.extractNumber(element.innerText, /[0-9,]+/, 0, true);
    }

    getPointReturn(dom) {
      // まとめ買いキャンペーンポイント
      const multibuyCPElement = this.querySelector(
        dom,
        '[id^="added-slot-"] .a-size-base',
      );
      if (multibuyCPElement) {
        const points = Utils.extractNumber(multibuyCPElement.innerText, /([0-9,]+)pt/, 1, true);
        if (points) return points;
      }

      // Kindleフォーマットポイント
      const swatchElements = this.querySelectorAll(dom, ".swatchElement");
      for (const element of swatchElements) {
        if (/Kindle/.test(element.innerText)) {
          const points = Utils.extractNumber(element.innerText, /([0-9,]+)pt/, 1, true);
          if (points) return points;
        }
      }

      // 通常ポイント
      const loyaltyElement = this.querySelector(dom, ".loyalty-points");
      if (loyaltyElement) {
        const points = Utils.extractNumber(loyaltyElement.innerText, /[0-9,]+/, 0, true);
        if (points) return points;
      }

      const aip = this.querySelector(dom, "#aip-buybox-display-text");
      if (aip) {
        const points = Utils.extractNumber(aip.innerText, /[0-9,]+/, 0, true);
        if (points) return points;
      }

      return 0;
    }

    getISBNs(dom) {
      const isbns = new Set();
      const links = this.querySelectorAll(dom, "#tmmSwatches a");

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const match = href.match(/\/(4[0-9]{8}[0-9X])/);
        if (match && Utils.validateISBN(match[1])) {
          isbns.add(match[1]);
        }
      });

      return [...isbns];
    }

    async isKDP(dom, storage) {
      const elements = this.querySelectorAll(
        dom,
        "#detailBullets_feature_div .a-list-item",
      );

      for (const element of elements) {
        if (!/出版社/.test(element.innerText)) continue;

        const publisherElement = element.querySelector("span:nth-child(2)");
        if (!publisherElement) return true;

        const match = publisherElement.innerText.match(/^[^;(]*/);
        if (!match?.[0]) return true;

        const publisher = match[0].trim();
        Logger.log(`Publisher: ${publisher}`);

        if (COMMERCIAL_PUBLISHERS.some((p) => new RegExp(p).test(publisher))) {
          return false;
        }

        let publishersCache = storage.load("PUBLISHERS") || {};
        if (publishersCache[publisher] !== undefined) {
          return !publishersCache[publisher];
        }

        const hasPublisher = await APIClient.checkPublisherInNDL(publisher);
        publishersCache[publisher] = hasPublisher;
        storage.save("PUBLISHERS", publishersCache);

        return !hasPublisher;
      }

      return true;
    }

    getCampaigns(dom) {
      let tmp = [];

      const promo = dom.querySelector("#promoPriceBlockMessageAboveBuyButton");
      if (promo && promo.innerText) {
        const m = promo.innerText.match(/(\d+\s*% OFF)/)
        if (m) {
          tmp.push('クーポン：' + m[0]); // 例: "10%OFF"
        }
      }

      const multibuy = dom.querySelector("#multibuy-widget-container");
      if (multibuy) {
        tmp.push("まとめ買いキャンペーン");
      }

      return tmp;
    }

    getWishlistItemTitle(dom) {
      return this.querySelector(dom, 'a[id^="itemName_"]')?.innerText ?? null;
    }

    getWishlistItemASIN(dom) {
      const element = this.querySelector(dom, ".price-section");
      const attribute = element?.getAttribute("data-item-prime-info");

      try {
        return attribute ? JSON.parse(attribute).asin : undefined;
      } catch {
        return undefined;
      }
    }

    isWishlistKindleItem(dom) {
      return /Kindle版/.test(dom.innerText);
    }

    isItemProcessed(dom) {
      return dom.classList.contains(Config.CLASSES.PROCESSED);
    }

    isSearchKindleItem(dom) {
      return this.querySelectorAll(dom, "a.a-text-bold").some((el) =>
        /^Kindle版/.test(el.innerHTML.trim()),
      );
    }

    getSearchItemTitle(dom) {
      return this.querySelector(dom, "h2 > a")?.innerText.trim() ?? null;
    }

    getSearchItemASIN(dom) {
      return dom.getAttribute("data-asin");
    }

    isSearchBulkBuy(dom) {
      return /まとめ買い/.test(dom.innerText);
    }
  }

  const Templates = {
    paperPriceRow: (paperPrice, discount, discountRate) => `
            <tr class="print-list-price">
                <td class="a-span1 a-color-secondary a-size-small a-text-left a-nowrap">
                    紙の本の価格：
                </td>
                <td class="a-color-base a-align-bottom a-text-strike">
                    ￥${paperPrice}
                </td>
            </tr>
            <tr class="savings">
                <td class="a-span1 a-color-secondary a-text-left a-nowrap">
                    割引:
                </td>
                <td class="a-color-base a-align-bottom">
                    ￥${discount}(${discountRate}%)
                </td>
            </tr>
            <tr>
                <td colspan="2" class="a-span1 a-color-secondary">
                    <hr class="a-spacing-small a-spacing-top-small a-divider-normal">
                </td>
            </tr>
        `,

    pointsRow: (points, pointRate) => `
            <tr class="loyalty-points">
                <td class="a-span6 a-color-secondary a-size-base a-text-left">
                    <div class="a-section a-spacing-top-small">獲得ポイント:</div>
                </td>
                <td class="a-align-bottom">
                    <div class="a-section a-spacing-top-small">
                        <span>
                            <span class="a-size-base a-color-price a-text-bold">${points}ポイント</span>
                            <span class="a-size-base a-color-price">(${pointRate}%)</span>
                        </span>
                    </div>
                </td>
            </tr>
        `,

    processingIndicator: (message = "取得待ち") =>
      `<div class="a-row ${Config.CLASSES.PROCESSING}" style="color:${Config.COLORS.PROCESSING}">${message}</div>`,

    priceInfo: (type, price) => `
            <div>
                <span class="a-price-symbol">${type}:￥</span>
                <span class="a-price-whole">${price}</span>
            </div>
        `,

    priceInfoLarge: (type, price) => `
            <div>
                <span class="a-price-symbol a-color-price a-size-large">${type}:￥</span>
                <span class="a-price-whole a-color-price a-size-large">${price}</span>
            </div>
        `,

    discountInfo: (discount, rate, color) => `
            <div style="color:${color.color};background-color:${color.bgColor}">
                <span class="a-price-symbol">割り引き:</span>
                <span class="a-price-whole">${discount}円( ${Math.round(rate)}%割引)</span>
            </div>
        `,

    pointInfo: (points, rate, color) => `
            <div style="color:${color.color};background-color:${color.bgColor}">
                <span class="a-price-symbol">ポイント:</span>
                <span class="a-price-whole">${points}ポイント(${Math.round(rate)}%還元)</span>
            </div>
        `,

    kindleUnlimited: () => `
            <div>
                <span class="a-price-symbol a-text-bold">Kindle Unlimited対象</span>
            </div>
        `,

    campaign: (name) => `
            <div>
                <span class="a-price-symbol a-text-bold">${name}</span>
            </div>
        `,

    kdpBadge: () =>
      `<div class="a-size-medium" style="color:${Config.COLORS.KDP.color};background-color:${Config.COLORS.KDP.bgColor}">KDP</div>`,

    noPaperBook: () =>
      `<span class="a-price-symbol" style="color:${Config.COLORS.ERROR}">紙の本:無し</span>`,

    unknownISBN: () =>
      `<div class="a-size-medium" style="color:${Config.COLORS.ERROR}">ISBN不明</div>`,
  };

  class ViewRenderer {
    static renderPaperPrice(dom, paperPrice, kindlePrice) {
      if (!paperPrice) return;

      paperPrice = Utils.calculateTaxIncludedPrice(paperPrice);
      const discount = paperPrice - kindlePrice;
      const discountRate = Math.round(
        Utils.calculateRate(discount, paperPrice),
      );

      const existing = dom.querySelector(".print-list-price");
      if (existing) existing.remove();

      const target =
        dom.querySelector("#buybox tbody") ||
        dom.querySelector("#buyOneClick tbody");
      target?.insertAdjacentHTML(
        "afterbegin",
        Templates.paperPriceRow(paperPrice, discount, discountRate),
      );
    }

    static renderPoints(dom, price, points) {
      if (dom.querySelector(".loyalty-points") || !points) return;

      const pointRate = Math.round(Utils.calculateRate(points, price));
      const target =
        dom.querySelector("#buybox tbody") ||
        dom.querySelector("#buyOneClick tbody");
      target?.insertAdjacentHTML(
        "beforeend",
        Templates.pointsRow(points, pointRate),
      );
    }

    static emphasizePrice(dom) {
      const label = dom.querySelector("tr.kindle-price td");
      const price = dom.querySelector("tr.kindle-price span");

      if (!label || !price) return;

      [label, price].forEach((el) => {
        el.classList.remove("a-color-secondary", "a-size-small");
        el.classList.add("a-color-price", "a-text-bold", "a-size-medium");
      });
    }

    static renderListItem(dom, data, isWishlist = true) {
      const paperPrice = Utils.calculateTaxIncludedPrice(data.paperPrice);
      const kindlePrice = data.kindlePrice;
      const discount = paperPrice - kindlePrice;
      const discountRate = Utils.calculateRate(discount, paperPrice);
      const discountColor = Utils.getColorByRate(discountRate);
      const points = data.pointReturn;
      const pointRate = Utils.calculateRate(points, kindlePrice);
      const pointColor = Utils.getColorByRate(pointRate);

      let html = "<div>";

      if (data.paperPrice) {
        html += Templates.priceInfo("紙の本", paperPrice);
      } else if (!isWishlist && data.isKdp) {
        html += Templates.kdpBadge();
      } else if (!data.isbn) {
        html += isWishlist
          ? Templates.noPaperBook()
          : Templates.unknownISBN();
      }

      html += Templates.priceInfoLarge("価格", kindlePrice);

      if (data.paperPrice) {
        html += Templates.discountInfo(discount, discountRate, discountColor);
      }

      html += Templates.pointInfo(points, pointRate, pointColor);

      if (data.campaigns) {
        data.campaigns.forEach((campaign) => {
          html += Templates.campaign(campaign);
        });
      }

      // Kindle Unlimited
      if (isWishlist && data.isKindleUnlimited) {
        html += Templates.kindleUnlimited();
      }

      html += "</div>";

      if (isWishlist) {
        const priceSection = dom.querySelector(".price-section");
        if (priceSection) priceSection.innerHTML = html;
      } else {

        let isChanged = false;
        dom.querySelectorAll("div.a-row.a-size-base").forEach((element) => {
          if (/ポイント|税込|購入/.test(element.innerText)) {
            element.remove();
          } else if (/[￥\\]/.test(element.innerText) && !isChanged) {
            element.innerHTML = html;
            isChanged = true;
          }
        });
      }
    }

    static updateProcessingIndicator(dom, message, isError = false) {
      const indicator = dom.querySelector(`.${Config.CLASSES.PROCESSING}`);
      if (!indicator) return;

      if (message) {
        const color = isError ? "red" : Config.COLORS.PROCESSING;
        indicator.innerHTML = `<div class="a-row ${Config.CLASSES.PROCESSING}" style="color:${color}">${message}</div>`;
      } else {
        indicator.remove();
        dom.classList.add(Config.CLASSES.PROCESSED);
      }
    }
  }

  class ConcurrencyManager {
    constructor(maxConcurrent = Config.CONCURRENT_PROCESSES) {
      this.maxConcurrent = maxConcurrent;
      this.running = 0;
      this.queue = [];
    }

    async acquire() {
      if (this.running >= this.maxConcurrent) {
        await new Promise((resolve) => this.queue.push(resolve));
      }
      this.running++;
    }

    release() {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }

    async run(task) {
      await this.acquire();
      try {
        return await task();
      } finally {
        this.release();
      }
    }
  }

  class BasePageHandler {
    constructor(storage, parser) {
      this.storage = storage;
      this.parser = parser;
      this.discoveries = [];
      this.observer = null;
      this.concurrencyManager = new ConcurrencyManager();
      this.isRunning = false;
      this.processingSet = new Set();
    }

    async initialize(dom) {
      await this.setupInitialItems(dom);
      this.setupObserver(dom);
      this.startProcessing();
    }

    setupInitialItems(dom) {
      throw new Error("setupInitialItems must be implemented");
    }

    setupObserver(dom) {
      throw new Error("setupObserver must be implemented");
    }

    startProcessing() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.processQueue();
    }

    async processQueue() {
      while (this.isRunning) {
        const batch = this.extractBatch();

        if (batch.length > 0) {
          const promises = batch.map((item) =>
            this.concurrencyManager.run(() => this.safeProcessItem(item)),
          );

          Promise.allSettled(promises).then(() => {
            Logger.log(`Batch of ${batch.length} items processed`);
          });
        }

        await Utils.sleep(
          this.discoveries.length > 0
            ? Config.PROCESS_INTERVAL_MS
            : Config.DISCOVERY_INTERVAL_MS,
        );
      }
    }

    extractBatch() {
      const batch = [];
      const maxBatch = Math.min(
        Config.CONCURRENT_PROCESSES,
        this.discoveries.length,
      );

      for (let i = 0; i < maxBatch; i++) {
        const item = this.discoveries.shift();
        if (item) {
          const asin = this.getItemASIN(item);
          if (asin && !this.processingSet.has(asin)) {
            this.processingSet.add(asin);
            batch.push(item);
          }
        }
      }

      return batch;
    }

    getItemASIN(dom) {
      return (
        dom.getAttribute?.("data-asin") ||
        this.parser.getWishlistItemASIN?.(dom) ||
        this.parser.getSearchItemASIN?.(dom)
      );
    }

    async safeProcessItem(item) {
      const asin = this.getItemASIN(item);

      try {
        await this.processItem(item);
      } catch (error) {
        Logger.error(`Error processing item [${asin}]:`, error);
        ViewRenderer.updateProcessingIndicator(
          item,
          error.message || "エラーが発生しました",
          true,
        );
      } finally {
        if (asin) {
          this.processingSet.delete(asin);
        }
      }
    }

    async fetchItemData(asin, title) {
      if (this.storage.isCacheActive(asin)) {
        Logger.log(`CACHE HIT: [${asin}] ${title}`);
        return this.storage.load(asin);
      }

      const maxRetries = 3;
      let lastError;

      for (let i = 0; i < maxRetries; i++) {
        try {
          Logger.log(`CACHE MISS: [${asin}] ${title} (attempt ${i + 1})`);
          const response = await HttpClient.get(API_URLS.AMAZON_PRODUCT(asin));
          const itemDom = this.parser.parseHTML(response.response);
          const itemHandler = new ItemPageHandler(this.storage, this.parser);
          return await itemHandler.getItemInfo(itemDom);
        } catch (error) {
          lastError = error;
          if (i < maxRetries - 1) {
            await Utils.sleep(Math.pow(2, i) * 1000);
          }
        }
      }

      throw lastError;
    }

    addProcessingIndicator(dom, selector) {
      const element = dom.querySelector(selector);
      element?.insertAdjacentHTML(
        "afterbegin",
        Templates.processingIndicator(),
      );
    }

    stop() {
      this.isRunning = false;
      this.observer?.disconnect();
    }
  }

  class ItemPageHandler {
    constructor(storage, parser) {
      this.storage = storage;
      this.parser = parser;
    }

    async getItemInfo(dom) {
      if (this.parser.isAgeVerification(dom)) {
        throw new Error("年齢確認が必要です");
      }

      if (!this.parser.isKindlePage(dom)) return null;

      const asin = this.parser.getASIN(dom);
      if (!asin) throw new Error("ASINが見つかりません");

      const cachedData = this.storage.load(asin);
      const [bookInfo, kindleInfo] = await Promise.all([
        this.getBookInfo(dom, cachedData),
        this.getKindleInfo(dom, cachedData),
      ]);

      return {
        asin,
        isbn: bookInfo.isbn,
        paperPrice: bookInfo.price,
        kindlePrice: kindleInfo.price,
        pointReturn: kindleInfo.point,
        isKdp: kindleInfo.isKdp,
        isKindleUnlimited: kindleInfo.isKindleUnlimited,
        campaigns: kindleInfo.campaigns,
        updatedAt: Date.now(),
      };
    }

    async getBookInfo(dom, cachedData) {
      if (cachedData?.paperPrice != null) {
        return {
          isbn: cachedData.isbn,
          price: cachedData.paperPrice,
        };
      }

      const isbns = this.parser.getISBNs(dom);
      Logger.log("ISBNs found:", isbns);

      if (isbns.length === 0) {
        return { isbn: null, price: null };
      }

      const book = await APIClient.findLowestPriceBook(isbns);
      Logger.log("Lowest price book:", book);
      return { isbn: book.isbn, price: book.price };
    }

    async getKindleInfo(dom, cachedData) {
      const [
        kindlePrice,
        pointReturn,
        isKdp,
        isKindleUnlimited,
        campaigns,
      ] = await Promise.all([
        this.parser.getKindlePrice(dom),
        this.parser.getPointReturn(dom),
        this.parser.isKDP(dom, this.storage),
        this.parser.isKindleUnlimited(dom),
        this.parser.getCampaigns(dom),
      ]);

      const info = {
        price: kindlePrice ?? cachedData?.kindlePrice,
        point: pointReturn,
        isKdp,
        isKindleUnlimited,
        campaigns,
      };

      Logger.log("Kindle info:", info);
      return info;
    }

    clickPrompt(dom) {
      const prompt = dom.querySelector("#buyOneClick .a-expander-prompt");
      prompt?.click();
    }

    async process(dom) {
      ViewRenderer.emphasizePrice(dom);
      this.clickPrompt(dom);

      try {
        const data = await this.getItemInfo(dom);
        if (data) {
          this.storage.save(data.asin, data);
          ViewRenderer.renderPaperPrice(dom, data.paperPrice, data.kindlePrice);
          ViewRenderer.renderPoints(dom, data.kindlePrice, data.pointReturn);
        }
      } catch (error) {
        Logger.error("Item page processing error:", error);
      }
    }
  }

  class WishlistPageHandler extends BasePageHandler {
    async setupInitialItems(dom) {
      await this.push(dom.querySelectorAll(".g-item-sortable"));
    }

    setupObserver(dom) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            this.push(mutation.addedNodes);
          }
        });
      });

      const targetNode = document.querySelector("#g-items");
      targetNode && this.observer.observe(targetNode, { childList: true });
    }

    async push(nodes) {
      for (const dom of Array.from(nodes).filter(
        (el) => el.nodeName === "LI",
      )) {
        const title = this.parser.getWishlistItemTitle(dom);
        const asin = this.parser.getWishlistItemASIN(dom);

        if (!this.parser.isWishlistKindleItem(dom) || !asin) {
          Logger.log(`DROP: [${asin}] ${title}`);
          continue;
        }

        Logger.log(`PUSH: [${asin}] ${title}`);
        this.addProcessingIndicator(dom, 'div[id^="itemInfo_"]');
        this.discoveries.push(dom);
      }
    }

    async processItem(dom) {
      const indicator = dom.querySelector(`.${Config.CLASSES.PROCESSING}`);
      if (indicator) indicator.textContent = "取得中";

      const title = this.parser.getWishlistItemTitle(dom);
      const asin = this.parser.getWishlistItemASIN(dom);

      Logger.log(`PROCESSING: [${asin}] ${title}`);

      if (this.parser.isItemProcessed(dom)) {
        ViewRenderer.updateProcessingIndicator(dom);
        return;
      }

      try {
        const data = await this.fetchItemData(asin, title);

        if (data) {
          this.storage.save(data.asin, data);
          ViewRenderer.renderListItem(dom, data, true);
        }

        ViewRenderer.updateProcessingIndicator(dom);
        Logger.log(`COMPLETE: [${asin}] ${title}`);
      } catch (error) {
        Logger.error(`ERROR: [${asin}] ${title}`, error);
        ViewRenderer.updateProcessingIndicator(dom, error.message, true);
      }
    }
  }

  class Application {
    constructor() {
      this.storage = new StorageManager();
      this.parser = new AmazonDOMParser();
    }

    detectPageType(url) {
      if (/\/(dp|gp)\//.test(url)) return "item";
      if (/\/wishlist\//.test(url)) return "wishlist";
      return null;
    }

    async run() {
      const url = location.href;
      const pageType = this.detectPageType(url);

      Logger.info(`Page type detected: ${pageType}`);
      this.storage.autoClean();
      await HttpClient.get(API_URLS.AMAZON_BLACK_ALLOW());

      try {
        switch (pageType) {
          case "item":
            if (this.parser.isKindlePage(document)) {
              Logger.info("Processing item page...");
              const itemHandler = new ItemPageHandler(
                this.storage,
                this.parser,
              );
              await itemHandler.process(document);
            }
            break;

          case "wishlist":
            Logger.info("Processing wishlist page...");
            const wishlistHandler = new WishlistPageHandler(
              this.storage,
              this.parser,
            );
            await wishlistHandler.initialize(document);
            break;

          default:
            Logger.info("Page type not supported");
        }
      } catch (error) {
        Logger.error("Application error:", error);
      }
    }
  }

  const app = new Application();
  app.run();
})();
