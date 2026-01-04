// ==UserScript==
// @name         steam价格转换
// @namespace    https://github.com/marioplus/steam-price-converter
// @version      2.6.1
// @author       marioplus
// @description  steam商店中的价格转换为人民币
// @license      GPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=store.steampowered.com
// @homepage     https://github.com/marioplus
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @match        https://checkout.steampowered.com/checkout/*
// @require      https://cdn.jsdelivr.net/npm/mdui@2.1.4/mdui.global.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @resource     mdui/mdui.css  https://cdn.jsdelivr.net/npm/mdui@2.1.4/mdui.css
// @connect      api.augmentedsteam.com
// @connect      store.steampowered.com
// @connect      cdn.jsdelivr.net
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452504/steam%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452504/steam%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" div.home_tabs_content .tab_item_discount{width:185px}.search_result_row .col.search_name{width:240px}.search_result_row .col.search_released{width:105px}.search_result_row .col.search_discount_and_price .discount_block{width:165px}#popularItemsTable .market_listing_table_header .market_listing_their_price{width:130px}#popularItemsTable .market_listing_row_link>.market_listing_row .market_listing_right_cell.market_listing_their_price{width:130px}mdui-dialog[data-v-93f93f99]::part(panel){max-height:50em}.setting-item[data-v-93f93f99]{color:rgb(var(--mdui-color-on-surface));padding:1em .75em;min-width:33em}.setting-item-title[data-v-93f93f99]{display:flex;align-items:center;padding:8px 0}.setting-item-title label[data-v-93f93f99]{display:inline-block;padding-right:.4em;font-size:var(--mdui-typescale-body-large-size);font-weight:var(--mdui-typescale-body-medium-weight);letter-spacing:var(--mdui-typescale-body-medium-tracking);line-height:var(--mdui-typescale-body-medium-line-height)}.setting-item-title .setting-region-title-icon[data-v-93f93f99]{font-size:var(--mdui-typescale-body-large-size)}mdui-select[data-v-93f93f99]::part(menu){max-height:256px;overflow:auto} ");

(function (mdui, vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("mdui/mdui.css");
  const STORAGE_KEY_PREFIX = "Storage:";
  const STORAGE_KEY_RATE_CACHES = STORAGE_KEY_PREFIX + "RateCache";
  const STORAGE_KEY_SETTING = STORAGE_KEY_PREFIX + "Setting";
  const IM_MENU_SETTING = "设置";
  const IM_MENU_ISSUES = "反馈";
  class Attrs {
  }
  __publicField(Attrs, "STATUS_KEY", "data-spc-status");
  __publicField(Attrs, "STATUS_CONVERTED", "converted");
  class AbstractConverter {
    /**
     * 匹配到的元素，是否匹配这个 exchanger
     * @param elementSnap 选择器选择到的元素快照
     */
    match(elementSnap) {
      if (!elementSnap || !elementSnap.element) {
        return false;
      }
      const status = elementSnap.element.getAttribute(Attrs.STATUS_KEY);
      const converted = Attrs.STATUS_CONVERTED === status;
      if (converted) {
        return false;
      }
      const content = elementSnap.textContext;
      if (!content) {
        return false;
      }
      if (content.match(/\d/) === null) {
        return false;
      }
      if (/^[,.\d\s]+$/.test(content)) {
        return false;
      }
      const parent = elementSnap.element.parentElement;
      if (!parent) {
        return false;
      }
      for (const selector of this.getCssSelectors()) {
        const element = parent.querySelector(selector);
        if (element && element === elementSnap.element) {
          elementSnap.selector = selector;
          return true;
        }
      }
      return false;
    }
    /**
     * 替换之后的操作
     * @param elementSnap 选择器选择到的元素快照
     */
    // @ts-ignore
    afterConvert(elementSnap) {
      elementSnap.element.setAttribute(Attrs.STATUS_KEY, Attrs.STATUS_CONVERTED);
    }
  }
  class Setting {
    constructor() {
      /**
       * 目标国家代码，默认CN
       */
      __publicField(this, "countyCode", "CN");
      /**
       * 目标货币符号，默认 ￥
       */
      __publicField(this, "currencySymbol", "￥");
      /**
       * 符号位置在首
       */
      __publicField(this, "currencySymbolBeforeValue", true);
      /**
       * 汇率获取时间，默认1小时
       */
      __publicField(this, "rateCacheExpired", 1e3 * 60 * 60);
      /**
       * 使用自定义汇率
       */
      __publicField(this, "useCustomRate", false);
      /**
       * 自定义汇率
       */
      __publicField(this, "customRate", 1);
      /**
       * 前一个版本
       */
      __publicField(this, "oldVersion", "0.0.0");
      /**
       * 当前版本
       */
      __publicField(this, "currVersion", "0.0.0");
      /**
       * 日志级别
       */
      __publicField(this, "logLevel", "info");
    }
  }
  const countyObjs = [
    {
      code: "AE",
      currencyCode: "AED",
      name: "阿联酋",
      nameEn: "United Arab Emirates"
    },
    {
      code: "AU",
      currencyCode: "AUD",
      name: "澳大利亚",
      nameEn: "Australia"
    },
    {
      code: "BR",
      currencyCode: "BRL",
      name: "巴西",
      nameEn: "Brazil"
    },
    {
      code: "CA",
      currencyCode: "CAD",
      name: "加拿大",
      nameEn: "Canada"
    },
    {
      code: "CH",
      currencyCode: "CHF",
      name: "瑞士",
      nameEn: "Switzerland"
    },
    {
      code: "CL",
      currencyCode: "CLP",
      name: "智利",
      nameEn: "Chile"
    },
    {
      code: "CN",
      currencyCode: "CNY",
      name: "中国",
      nameEn: "China"
    },
    {
      code: "CO",
      currencyCode: "COP",
      name: "哥伦比亚",
      nameEn: "Colombia"
    },
    {
      code: "CR",
      currencyCode: "CRC",
      name: "哥斯达黎加",
      nameEn: "Costa Rica"
    },
    {
      code: "AD",
      currencyCode: "EUR",
      name: "安道尔",
      nameEn: "Andorra"
    },
    {
      code: "DE",
      currencyCode: "EUR",
      name: "德国",
      nameEn: "Germany"
    },
    {
      code: "EE",
      currencyCode: "EUR",
      name: "爱沙尼亚",
      nameEn: "Estonia"
    },
    {
      code: "ES",
      currencyCode: "EUR",
      name: "西班牙",
      nameEn: "Spain"
    },
    {
      code: "FR",
      currencyCode: "EUR",
      name: "法国",
      nameEn: "France"
    },
    {
      code: "IT",
      currencyCode: "EUR",
      name: "意大利",
      nameEn: "Italy"
    },
    {
      code: "LT",
      currencyCode: "EUR",
      name: "立陶宛",
      nameEn: "Lithuania"
    },
    {
      code: "LU",
      currencyCode: "EUR",
      name: "卢森堡",
      nameEn: "Luxembourg"
    },
    {
      code: "LV",
      currencyCode: "EUR",
      name: "拉脱维亚",
      nameEn: "Latvia"
    },
    {
      code: "MC",
      currencyCode: "EUR",
      name: "摩纳哥",
      nameEn: "Monaco"
    },
    {
      code: "ME",
      currencyCode: "EUR",
      name: "黑山",
      nameEn: "Montenegro"
    },
    {
      code: "SI",
      currencyCode: "EUR",
      name: "斯洛文尼亚",
      nameEn: "Slovenia"
    },
    {
      code: "SK",
      currencyCode: "EUR",
      name: "斯洛伐克",
      nameEn: "Slovakia"
    },
    {
      code: "SM",
      currencyCode: "EUR",
      name: "圣马力诺",
      nameEn: "San Marino"
    },
    {
      code: "VA",
      currencyCode: "EUR",
      name: "梵蒂冈",
      nameEn: "Holy See"
    },
    {
      code: "GB",
      currencyCode: "GBP",
      name: "英国",
      nameEn: "United Kingdom"
    },
    {
      code: "HK",
      currencyCode: "HKD",
      name: "中国香港",
      nameEn: "Hong Kong"
    },
    {
      code: "ID",
      currencyCode: "IDR",
      name: "印度尼西亚",
      nameEn: "Indonesia"
    },
    {
      code: "IL",
      currencyCode: "ILS",
      name: "以色列",
      nameEn: "Israel"
    },
    {
      code: "IN",
      currencyCode: "INR",
      name: "印度",
      nameEn: "India"
    },
    {
      code: "JP",
      currencyCode: "JPY",
      name: "日本",
      nameEn: "Japan"
    },
    {
      code: "KR",
      currencyCode: "KRW",
      name: "韩国",
      nameEn: "South Korea"
    },
    {
      code: "KW",
      currencyCode: "KWD",
      name: "科威特",
      nameEn: "Kuwait"
    },
    {
      code: "KZ",
      currencyCode: "KZT",
      name: "哈萨克斯坦",
      nameEn: "Kazakhstan"
    },
    {
      code: "MX",
      currencyCode: "MXN",
      name: "墨西哥",
      nameEn: "Mexico"
    },
    {
      code: "MY",
      currencyCode: "MYR",
      name: "马来西亚",
      nameEn: "Malaysia"
    },
    {
      code: "NO",
      currencyCode: "NOK",
      name: "挪威",
      nameEn: "Norway"
    },
    {
      code: "NZ",
      currencyCode: "NZD",
      name: "新西兰",
      nameEn: "New Zealand"
    },
    {
      code: "PE",
      currencyCode: "PEN",
      name: "秘鲁",
      nameEn: "Peru"
    },
    {
      code: "PH",
      currencyCode: "PHP",
      name: "菲律宾",
      nameEn: "Philippines"
    },
    {
      code: "PL",
      currencyCode: "PLN",
      name: "波兰",
      nameEn: "Poland"
    },
    {
      code: "QA",
      currencyCode: "QAR",
      name: "卡塔尔",
      nameEn: "Qatar"
    },
    {
      code: "RU",
      currencyCode: "RUB",
      name: "俄罗斯",
      nameEn: "Russia"
    },
    {
      code: "SA",
      currencyCode: "SAR",
      name: "沙特阿拉伯",
      nameEn: "Saudi Arabia"
    },
    {
      code: "SG",
      currencyCode: "SGD",
      name: "新加坡",
      nameEn: "Singapore"
    },
    {
      code: "TH",
      currencyCode: "THB",
      name: "泰国",
      nameEn: "Thailand"
    },
    {
      code: "TW",
      currencyCode: "TWD",
      name: "中国台湾",
      nameEn: "Taiwan"
    },
    {
      code: "UA",
      currencyCode: "UAH",
      name: "乌克兰",
      nameEn: "Ukraine"
    },
    {
      code: "AR",
      currencyCode: "USD",
      name: "阿根廷",
      nameEn: "Argentina"
    },
    {
      code: "AZ",
      currencyCode: "USD",
      name: "阿塞拜疆",
      nameEn: "Azerbaijan"
    },
    {
      code: "PK",
      currencyCode: "USD",
      name: "巴基斯坦",
      nameEn: "Pakistan"
    },
    {
      code: "TR",
      currencyCode: "USD",
      name: "土耳其",
      nameEn: "Turkey"
    },
    {
      code: "US",
      currencyCode: "USD",
      name: "美国",
      nameEn: "United States"
    },
    {
      code: "ZA",
      currencyCode: "USD",
      name: "南非",
      nameEn: "South Africa"
    },
    {
      code: "UY",
      currencyCode: "UYU",
      name: "乌拉圭",
      nameEn: "Uruguay"
    },
    {
      code: "VN",
      currencyCode: "VND",
      name: "越南",
      nameEn: "Vietnam"
    }
  ];
  class Jsons {
    /**
     * 将对象转换为普通 JSON 对象
     */
    static toJson(obj) {
      return { ...obj };
    }
    /**
     * 将对象转换为 JSON 字符串
     */
    static toString(obj) {
      return JSON.stringify(this.toJson(obj));
    }
    /**
     * 将普通 JSON 对象解析为指定类型，支持嵌套处理，包括 Map 和 Record 中的 class
     */
    static readJson(json, cls) {
      if (!cls) {
        if (typeof json !== "object" || json === null) {
          throw new Error("Invalid JSON input");
        }
        return json;
      }
      const instance = new cls();
      if (instance instanceof Map) {
        return this.handleMap(json, instance);
      }
      for (const key of Reflect.ownKeys(json)) {
        const value = json[key];
        if (value === null || value === void 0) {
          instance[key] = value;
          continue;
        }
        const fieldValue = instance[key];
        if (fieldValue !== null && typeof fieldValue === "object" && !(fieldValue instanceof Array)) {
          if (fieldValue instanceof Map) {
            instance[key] = this.handleMap(value, fieldValue);
          } else if (fieldValue instanceof Object) {
            instance[key] = this.readJson(value, fieldValue.constructor);
          }
        } else if (Array.isArray(fieldValue)) {
          instance[key] = value.map(
            (item) => {
              var _a;
              return typeof item === "object" ? this.readJson(item, (_a = fieldValue[0]) == null ? void 0 : _a.constructor) : item;
            }
          );
        } else {
          instance[key] = value;
        }
      }
      return instance;
    }
    /**
     * 处理 Map 类型的转换，其中 V 可以是一个 class
     */
    static handleMap(value, mapInstance) {
      const map = /* @__PURE__ */ new Map();
      if (value && typeof value === "object") {
        for (const key of Object.keys(value)) {
          const mapValue = value[key];
          if (mapValue === null || mapValue === void 0) {
            map.set(key, mapValue);
            continue;
          }
          const existingValue = mapInstance.get(key);
          if (this.isObject(mapValue) && existingValue) {
            map.set(key, this.readJson(mapValue, existingValue.constructor));
          } else {
            map.set(key, mapValue);
          }
        }
      }
      return map;
    }
    static isObject(value) {
      return value !== null && typeof value === "object";
    }
    /**
     * 将 JSON 字符串解析为指定类型，支持嵌套处理，包括 Map 和 Record 中的 class
     */
    static readString(jsonString, cls) {
      const json = JSON.parse(jsonString);
      return this.readJson(json, cls);
    }
  }
  const countyInfos = Jsons.readJson(countyObjs, Array).sort((a, b) => a.name.localeCompare(b.name));
  const countyCode2Info = new Map(countyInfos.map((v) => [v.code, v]));
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function initializeLogTitle() {
    const isInIFrame = window.parent !== window || window.frames.length > 0;
    return isInIFrame ? `steam-price-convertor iframe(${(/* @__PURE__ */ new Date()).getMilliseconds()})` : "steam-price-convertor";
  }
  function createLogStyle(color) {
    return `
            background: ${color};
            color: white;
            padding: 1px 3px;
            border-radius: 2px;
        `;
  }
  function composeLogHint() {
    return `%c${initializeLogTitle()}`;
  }
  const LogDefinitions = {
    debug: {
      index: 0,
      color: "#009688",
      label: "debug",
      bindMethod: console.info
    },
    info: {
      index: 1,
      color: "#2196f3",
      label: "info",
      bindMethod: console.info
    },
    warn: {
      index: 2,
      color: "#ffc107",
      label: "warn",
      bindMethod: console.warn
    },
    error: {
      index: 3,
      color: "#e91e63",
      label: "error",
      bindMethod: console.error
    },
    off: {
      index: 4,
      color: "",
      label: "off",
      bindMethod: () => {
      }
    }
  };
  const Logger = {
    debug: noopLog.bind(null),
    info: noopLog.bind(null),
    warn: noopLog.bind(null),
    error: noopLog.bind(null)
  };
  function noopLog() {
  }
  let currLogLevel = LogDefinitions.info;
  function refreshBinding() {
    const hint = composeLogHint();
    Object.entries(LogDefinitions).forEach(([label, def]) => {
      if (def.index >= currLogLevel.index) {
        const logStyle = createLogStyle(def.color);
        Logger[label.toLowerCase()] = def.bindMethod.bind(console, hint, logStyle);
      } else {
        Logger[label.toLowerCase()] = noopLog.bind(null);
      }
    });
  }
  function setLogLevel(levelLabel) {
    const newLevel = LogDefinitions[levelLabel];
    if (newLevel) {
      currLogLevel = newLevel;
      refreshBinding();
    } else {
      console.error(`Invalid log level: ${levelLabel}`);
    }
  }
  refreshBinding();
  class Strings {
    static format(format, ...args) {
      args = args || [];
      let message = format;
      for (let arg of args) {
        message = message.replace("%s", arg);
      }
      return message;
    }
  }
  class GmUtils {
    static getSimpleValue(key, defaultValue) {
      const value = _GM_getValue(key);
      return value || defaultValue;
    }
    static getObjValue(cls, key, defaultValue) {
      const value = _GM_getValue(key);
      return value ? Jsons.readString(value, cls) : defaultValue;
    }
    static setSimpleValue(key, value) {
      _GM_setValue(key, value);
    }
    static setObjValue(key, value) {
      _GM_setValue(key, Jsons.toString(value));
    }
    static deleteValue(key) {
      _GM_deleteValue(key);
    }
    static registerMenuCommand(caption, onClick) {
      const menuValueKey = GmUtils.buildMenuValueKey(caption);
      _GM_registerMenuCommand(caption, () => {
        GmUtils.setSimpleValue(menuValueKey, (/* @__PURE__ */ new Date()).getTime());
        Logger.debug("点击菜单：" + caption);
        if (onClick) {
          onClick();
        }
      });
    }
    static addMenuClickEventListener(caption, onClick) {
      const menuValueKey = GmUtils.buildMenuValueKey(caption);
      _GM_addValueChangeListener(menuValueKey, onClick);
    }
    static buildMenuValueKey(caption) {
      return `GM_registerMenuCommand@${caption}`;
    }
    static openInTab(url) {
      _GM_openInTab(url);
    }
  }
  const _SettingManager = class _SettingManager {
    constructor() {
      __publicField(this, "setting");
      this.setting = this.loadSetting();
    }
    loadSetting() {
      const setting = GmUtils.getObjValue(Setting, STORAGE_KEY_SETTING, new Setting());
      setting.oldVersion = setting.currVersion;
      setting.currVersion = _GM_info.script.version;
      if (setting.oldVersion === setting.currVersion) {
        Logger.info("读取设置", setting);
      } else {
        Logger.debug(Strings.format(`版本更新重置设置：%s -> %s`, setting.oldVersion, setting.currVersion));
        this.saveSetting(setting);
      }
      return setting;
    }
    /**
     * 保存设置
     * @param setting  设置
     */
    saveSetting(setting) {
      Logger.info("保存设置", setting);
      this.setting = setting;
      GmUtils.setObjValue(STORAGE_KEY_SETTING, setting);
    }
    setCountyCode(countyCode) {
      const county = countyCode2Info.get(countyCode);
      if (!county) {
        throw Error(`国家代码不存在：${countyCode}`);
      }
      this.setting.countyCode = countyCode;
      this.saveSetting(this.setting);
    }
    setCurrencySymbol(currencySymbol) {
      this.setting.currencySymbol = currencySymbol;
      this.saveSetting(this.setting);
    }
    setCurrencySymbolBeforeValue(isCurrencySymbolBeforeValue) {
      this.setting.currencySymbolBeforeValue = isCurrencySymbolBeforeValue;
      this.saveSetting(this.setting);
    }
    reset() {
      this.saveSetting(new Setting());
    }
    setRateCacheExpired(rateCacheExpired) {
      this.setting.rateCacheExpired = rateCacheExpired;
      this.saveSetting(this.setting);
    }
    setUseCustomRate(isUseCustomRate) {
      this.setting.useCustomRate = isUseCustomRate;
      this.saveSetting(this.setting);
    }
    setCustomRate(customRate) {
      this.setting.customRate = customRate;
      this.saveSetting(this.setting);
    }
  };
  __publicField(_SettingManager, "instance", new _SettingManager());
  let SettingManager = _SettingManager;
  function parsePrice(content) {
    let priceStr = content.replaceAll(/([^-]+\s-)+/g, "").replaceAll(/\/ \d{0,2} 个 个月/g, "").replace(/руб\./g, "").replace(/pуб\./g, "").replace(/\s/g, "").replace(/^[^0-9]+/, "").replace(/[^0-9,.]+$/, "").replace(/,(?=\d\d\d)/g, "");
    const numberStr = priceStr.replace(/\D/g, "");
    let price = Number.parseInt(numberStr) ?? 0;
    if (priceStr.match(/\D/)) {
      price = price / 100;
    }
    return price;
  }
  function convertPrice(price, rate) {
    return Number.parseFloat((price / rate).toFixed(2));
  }
  function convertPriceContent(originalContent, rate) {
    const safeContent = originalContent.trim();
    const price = parsePrice(safeContent);
    const convertedPrice = convertPrice(price, rate);
    const setting = SettingManager.instance.setting;
    let finalContent = setting.currencySymbolBeforeValue ? `${safeContent}(${setting.currencySymbol}${convertedPrice})` : `${safeContent}(${convertedPrice}${setting.currencySymbol})`;
    const message = `转换前文本：${safeContent}; 提取到的价格：${price}; 转换后的价格：${convertedPrice}; 转换后文本：${finalContent}`;
    Logger.debug(message);
    return finalContent;
  }
  class ElementConverter extends AbstractConverter {
    getCssSelectors() {
      const home = [
        // 大图
        ".discount_prices > .discount_final_price",
        // 头像下拉
        ".Hxi-pnf9Xlw- span.HOrB6lehQpg-",
        // 低于 xx
        ".btnv6_white_transparent > span"
      ];
      const category = [
        // 原价
        ".Wh0L8EnwsPV_8VAu8TOYr",
        "._3j4dI1yA7cRfCvK8h406OB",
        // 折扣价
        "._1EKGZBnKFWOr3RqVdnLMRN",
        "._3fFFsvII7Y2KXNLDk_krOW"
      ];
      const account = [
        // 钱包余额
        "div.accountData.price",
        // 充值
        ".addfunds_area_purchase_game.game_area_purchase_game > h1",
        // 自定义充值
        ".addfunds_area_purchase_game.game_area_purchase_game.es_custom_money > p"
      ];
      const wishlist = [
        // 右上角钱包
        "div.Hxi-pnf9Xlw- > div._79DIT7RUQ5g-",
        // 当前价格
        "div.ME2eMO7C1Tk- > div.DOnsaVcV0Is-",
        // 原价
        "div.ME2eMO7C1Tk- > div.ywNldZ-YzEE-",
        // 筛选
        "label.idELaaXmvTo-",
        // 筛选后的标签
        "button.Wh-OfiQaHSM-"
      ];
      const inventory = [
        '#iteminfo1_item_market_actions  div[id^="market_item_action_buyback_at_price_"]'
      ];
      const cart = [
        // 原价
        ".Panel.Focusable ._3-o3G9jt3lqcvbRXt8epsn.StoreOriginalPrice",
        // 折扣价
        ".Panel.Focusable .pk-LoKoNmmPK4GBiC9DR8",
        // 总额
        "._2WLaY5TxjBGVyuWe_6KS3N"
      ];
      const cartCheckout = [
        // 列表
        "#checkout_review_cart_area .checkout_review_item_price > .price",
        // 小计
        "#review_subtotal_value.price",
        // 合计
        "#review_total_value.price"
      ];
      const market = [
        // 头像下拉菜单
        "#account_dropdown .account_name",
        // 市场统计
        "#es_summary .es_market_summary_item"
      ];
      const notify = [
        // 通知列表
        ".QFW0BtI4l77AFmv1xLAkx._1B1XTNsfuwOaDPAkkr8M42 ._3hEeummFKRey8l5VXxZwxz > span"
      ];
      const app = [
        // 订阅
        ".game_area_purchase_game_dropdown_selection > span",
        // 订阅下拉
        ".game_area_purchase_game_dropdown_menu_items_container_background.game_area_purchase_game_dropdown_menu_items_container  td.game_area_purchase_game_dropdown_menu_item_text"
      ];
      const selectors = [
        // 商店
        // 首页
        ".discount_original_price",
        ".discount_final_price",
        ".col.search_price.responsive_secondrow strike",
        // 头像旁边
        "#header_wallet_balance > span.tooltip",
        // 愿望单总价值
        ".esi-wishlist-stat > .num",
        // 新版卡片
        ".salepreviewwidgets_StoreOriginalPrice_1EKGZ",
        ".salepreviewwidgets_StoreSalePriceBox_Wh0L8",
        // 分类查看游戏
        ".contenthubshared_OriginalPrice_3hBh3",
        ".contenthubshared_FinalPrice_F_tGv",
        ".salepreviewwidgets_StoreSalePriceBox_Wh0L8:not(.salepreviewwidgets_StoreSalePrepurchaseLabel_Wxeyn)",
        // 市场
        // 总余额
        "#marketWalletBalanceAmount",
        // 列表
        "span.normal_price[data-price]",
        "span.sale_price",
        // 求购、求售统计
        ".market_commodity_orders_header_promote:nth-child(even)",
        // 求购、求售列表
        ".market_commodity_orders_table td:nth-child(odd)",
        // 详情列表
        ".market_table_value > span",
        ".jqplot-highlighter-tooltip",
        // 消费记录
        "tr.wallet_table_row > td.wht_total",
        "tr.wallet_table_row > td.wht_wallet_change.wallet_column",
        "tr.wallet_table_row > td.wht_wallet_balance.wallet_column",
        // 捆绑包
        ".package_totals_row > .price:not(.bundle_discount)",
        "#package_savings_bar > .savings.bundle_savings",
        // 低于xxx 分类标题
        ".home_page_content_title a.btn_small_tall > span"
      ];
      selectors.push(...home);
      selectors.push(...category);
      selectors.push(...account);
      selectors.push(...wishlist);
      selectors.push(...inventory);
      selectors.push(...cart);
      selectors.push(...cartCheckout);
      selectors.push(...market);
      selectors.push(...notify);
      selectors.push(...app);
      return selectors;
    }
    convert(elementSnap, rate) {
      elementSnap.element.textContent = convertPriceContent(elementSnap.textContext, rate);
      return true;
    }
  }
  class TextNodeConverter extends AbstractConverter {
    constructor() {
      super(...arguments);
      // @ts-ignore
      __publicField(this, "parseFirstChildTextNodeFn", (el) => el.firstChild);
      // 购物车
      __publicField(this, "cart", /* @__PURE__ */ new Map([
        // 卡牌获取进度
        [".Panel.Focusable ._18eO4-XadW5jmTpgdATkSz", [(el) => el.childNodes[1]]]
      ]));
      // 愿望单
      __publicField(this, "wishlist", /* @__PURE__ */ new Map([
        // 统计
        ["div.stat.svelte-1epviyc", [this.parseFirstChildTextNodeFn]]
      ]));
      // @ts-ignore
      __publicField(this, "targets", new Map([
        [
          ".col.search_price.responsive_secondrow",
          [
            // @ts-ignore
            (el) => el.firstChild.nextSibling.nextSibling.nextSibling,
            this.parseFirstChildTextNodeFn
          ]
        ],
        ["#header_wallet_balance", [this.parseFirstChildTextNodeFn]],
        // iframe
        [".game_purchase_price.price", [this.parseFirstChildTextNodeFn]],
        // 低于xxx 分类标题
        [".home_page_content_title", [this.parseFirstChildTextNodeFn]],
        // dlc 中没有折扣
        [".game_area_dlc_row > .game_area_dlc_price", [
          (el) => el,
          this.parseFirstChildTextNodeFn
        ]],
        ...this.cart,
        ...this.wishlist
      ]));
    }
    getCssSelectors() {
      return [...this.targets.keys()];
    }
    convert(elementSnap, rate) {
      const selector = elementSnap.selector;
      this.targets.get(selector);
      const parseNodeFns = this.targets.get(selector) || [];
      if (!parseNodeFns) {
        return false;
      }
      const textNode = this.safeParseNode(selector, elementSnap.element, parseNodeFns);
      if (!textNode) {
        return false;
      }
      const content = textNode.nodeValue;
      if (!content || content.trim().length === 0) {
        return false;
      }
      textNode.nodeValue = convertPriceContent(content, rate);
      return true;
    }
    safeParseNode(selector, el, fns) {
      for (let fn of fns) {
        try {
          const node = fn(el);
          if (node && node.nodeName === "#text" && node.nodeValue && node.nodeValue.length > 0) {
            return node;
          }
        } catch (e) {
          console.debug("获取文本节点失败，但不确定该节点是否一定会出现。selector：" + selector);
        }
      }
      return null;
    }
  }
  const _ConverterManager = class _ConverterManager {
    constructor() {
      __publicField(this, "converters");
      this.converters = [
        new ElementConverter(),
        new TextNodeConverter()
      ];
    }
    getSelector() {
      return this.converters.map((exchanger) => exchanger.getCssSelectors()).flat(1).join(", ");
    }
    convert(elements, rate) {
      if (!elements) {
        return;
      }
      elements.forEach((element) => {
        const elementSnap = {
          element,
          textContext: element.textContent,
          classList: element.classList,
          attributes: element.attributes
        };
        this.converters.filter((converter) => converter.match(elementSnap)).forEach((converter) => {
          try {
            const exchanged = converter.convert(elementSnap, rate);
            if (exchanged) {
              converter.afterConvert(elementSnap);
            }
          } catch (e) {
            console.group("转换失败");
            console.error(e);
            console.error("转换失败请将下列内容反馈给开发者，右键 > 复制(copy) > 复制元素(copy element)");
            console.error("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
            console.error(element);
            console.error("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
            console.groupEnd();
          }
        });
      });
    }
  };
  __publicField(_ConverterManager, "instance", new _ConverterManager());
  let ConverterManager = _ConverterManager;
  class RateCache {
    constructor(from, to, rate, createdAt) {
      __publicField(this, "from");
      __publicField(this, "to");
      __publicField(this, "createdAt");
      __publicField(this, "rate");
      this.from = from;
      this.to = to;
      this.createdAt = createdAt || 0;
      this.rate = rate || 0;
    }
  }
  class RateCaches {
    constructor() {
      __publicField(this, "caches", /* @__PURE__ */ new Map());
    }
    getCache(from, to) {
      return this.caches.get(this.buildCacheKey(from, to));
    }
    setCache(cache) {
      this.caches.set(this.buildCacheKey(cache.from, cache.to), cache);
    }
    buildCacheKey(from, to) {
      return `${from}:${to}`;
    }
  }
  class Http {
    static get(cls, url, details) {
      if (!details) {
        details = { url };
      }
      details.method = "GET";
      return this.request(cls, details);
    }
    static post(url, cls, details) {
      if (!details) {
        details = { url };
      }
      details.method = "POST";
      return this.request(cls, details);
    }
    static request(cls, details) {
      return new Promise((resolve, reject) => {
        details.onload = (response) => {
          if (cls.name === String.name) {
            resolve(response.response);
          } else {
            const json = JSON.parse(response.response);
            resolve(Jsons.readJson(json, cls));
          }
        };
        details.onerror = (error) => reject(error);
        _GM_xmlhttpRequest(details);
      });
    }
  }
  class SpcContext {
    constructor(setting, targetCountyInfo, targetCountyCode) {
      __publicField(this, "_setting");
      __publicField(this, "_targetCountyInfo");
      __publicField(this, "_currentCountyInfo");
      this._setting = setting;
      this._targetCountyInfo = targetCountyInfo;
      this._currentCountyInfo = targetCountyCode;
    }
    static getContext() {
      return _unsafeWindow.spcContext;
    }
    get setting() {
      return this._setting;
    }
    get targetCountyInfo() {
      return this._targetCountyInfo;
    }
    get currentCountyInfo() {
      return this._currentCountyInfo;
    }
  }
  class AugmentedSteamRateApi {
    getName() {
      return "AugmentedSteamRateApi";
    }
    async getRate() {
      const context = SpcContext.getContext();
      Logger.info(Strings.format(
        "通过 AugmentedSteam 获取汇率 %s(%s) -> %s(%s)...",
        context.currentCountyInfo.currencyCode,
        context.currentCountyInfo.name,
        context.targetCountyInfo.currencyCode,
        context.targetCountyInfo.name
      ));
      const url = `https://api.augmentedsteam.com/rates/v1?to=${context.currentCountyInfo.currencyCode}`;
      let rate = await Http.get(Map, url).then((res) => res.get(context.targetCountyInfo.currencyCode)[context.currentCountyInfo.currencyCode]).catch((err) => Logger.error("通过 AugmentedSteam 获取汇率失败", err));
      if (rate) {
        return rate;
      }
      throw new Error(`通过 ${this.getName()} 获取汇率失败。`);
    }
  }
  const _RateManager = class _RateManager {
    constructor() {
      __publicField(this, "rateApis");
      __publicField(this, "rateCaches", new RateCaches());
      this.rateApis = [
        new AugmentedSteamRateApi()
      ];
    }
    getName() {
      return "RateManager";
    }
    async getRate4Remote() {
      Logger.info("远程获取汇率...");
      let rate;
      for (let rateApi of this.rateApis) {
        try {
          rate = await rateApi.getRate();
        } catch (e) {
          Logger.error(`使用实现(${rateApi.getName()})获取汇率失败`);
        }
        if (rate) {
          return rate;
        }
      }
      throw Error("所有汇率获取实现获取汇率均失败");
    }
    async getRate() {
      const context = SpcContext.getContext();
      if (context.setting.useCustomRate) {
        Logger.info("使用自定义汇率");
        return context.setting.customRate;
      }
      this.rateCaches = this.loadRateCache();
      let cache = this.rateCaches.getCache(context.currentCountyInfo.code, context.targetCountyInfo.code);
      const now = (/* @__PURE__ */ new Date()).getTime();
      const expired = context.setting.rateCacheExpired;
      if (!cache || !cache.rate || now > cache.createdAt + expired) {
        Logger.info(`本地缓存已过期`);
        cache = new RateCache(context.currentCountyInfo.code, context.targetCountyInfo.code);
        cache.rate = await this.getRate4Remote();
        cache.createdAt = (/* @__PURE__ */ new Date()).getTime();
        this.rateCaches.setCache(cache);
        this.saveRateCache();
      }
      return cache.rate;
    }
    loadRateCache() {
      const setting = SpcContext.getContext().setting;
      if (setting.oldVersion !== setting.currVersion) {
        Logger.info(`脚本版本发生变化需要刷新汇率缓存`);
        this.clear();
        return new RateCaches();
      }
      Logger.info(`读取汇率缓存`);
      return GmUtils.getObjValue(RateCaches, STORAGE_KEY_RATE_CACHES, new RateCaches());
    }
    saveRateCache() {
      Logger.info("保存汇率缓存", this.rateCaches);
      GmUtils.setObjValue(STORAGE_KEY_RATE_CACHES, this.rateCaches);
    }
    clear() {
      GmUtils.deleteValue(STORAGE_KEY_RATE_CACHES);
    }
  };
  __publicField(_RateManager, "instance", new _RateManager());
  let RateManager = _RateManager;
  async function main() {
    const context = SpcContext.getContext();
    if (context.currentCountyInfo.code === context.targetCountyInfo.code) {
      Logger.info(`${context.currentCountyInfo.name}无需转换`);
      return;
    }
    const rate = await RateManager.instance.getRate();
    if (!rate) {
      throw Error("获取汇率失败");
    }
    Logger.info(Strings.format(`汇率 %s -> %s：%s`, context.currentCountyInfo.currencyCode, context.targetCountyInfo.currencyCode, rate));
    await convert(rate);
  }
  async function convert(rate) {
    const exchangerManager = ConverterManager.instance;
    const elements = document.querySelectorAll(exchangerManager.getSelector());
    exchangerManager.convert(elements, rate);
    const selector = exchangerManager.getSelector();
    const priceObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target;
        let priceEls = target.querySelectorAll(selector);
        if (!priceEls || priceEls.length === 0) {
          return;
        }
        exchangerManager.convert(priceEls, rate);
      });
    });
    priceObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  const _withScopeId = (n) => (vue.pushScopeId("data-v-93f93f99"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("link", {
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    rel: "stylesheet"
  }, null, -1));
  const _hoisted_2 = ["open"];
  const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { slot: "headline" }, "设置", -1));
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { slot: "description" }, "随心所欲设置 steam-price-converter", -1));
  const _hoisted_5 = { class: "setting-item" };
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "目标区域"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "将价格转换为此区域的货币",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_7 = { class: "setting-item-content" };
  const _hoisted_8 = ["value"];
  const _hoisted_9 = ["value"];
  const _hoisted_10 = { class: "setting-item" };
  const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "货币符号"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "转换后的价格的货币符号",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_12 = { class: "setting-item-content" };
  const _hoisted_13 = ["value"];
  const _hoisted_14 = { class: "setting-item" };
  const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "货币符号展示位置"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "控制转换后的价格货币符号的位置",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_16 = { class: "setting-item-content" };
  const _hoisted_17 = ["value"];
  const _hoisted_18 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("mdui-menu-item", { value: "true" }, "价格之前", -1));
  const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("mdui-menu-item", { value: "false" }, "价格之后", -1));
  const _hoisted_20 = [
    _hoisted_18,
    _hoisted_19
  ];
  const _hoisted_21 = { class: "setting-item" };
  const _hoisted_22 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "汇率缓存有效期"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "获取汇率后进行缓存，在此时间内将使用缓存汇率",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_23 = { class: "setting-item-content" };
  const _hoisted_24 = ["value"];
  const _hoisted_25 = { class: "setting-item" };
  const _hoisted_26 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "使用自定义汇率"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "使用自定义汇率进行价格转换，不再获取区域，不再根据区域获取汇率",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_27 = { class: "setting-item-content" };
  const _hoisted_28 = ["value"];
  const _hoisted_29 = { class: "setting-item" };
  const _hoisted_30 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "自定义汇率"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "开启“使用自定义汇率”后使用此汇率进行转换",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_31 = { class: "setting-item-content" };
  const _hoisted_32 = ["value"];
  const _hoisted_33 = { class: "setting-item" };
  const _hoisted_34 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "setting-item-title" }, [
    /* @__PURE__ */ vue.createElementVNode("label", null, "日志等级"),
    /* @__PURE__ */ vue.createElementVNode("mdui-tooltip", {
      content: "日志等级 debug > info > warn > error > off",
      placement: "right"
    }, [
      /* @__PURE__ */ vue.createElementVNode("mdui-icon", {
        name: "error",
        class: "setting-region-title-icon"
      })
    ])
  ], -1));
  const _hoisted_35 = { class: "setting-item-content" };
  const _hoisted_36 = ["value"];
  const _hoisted_37 = ["value"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      mdui.setColorScheme("#171D25");
      const vueCountyInfos = countyInfos;
      const dialogOpen = vue.ref(false);
      const setting = vue.reactive(new Setting());
      GmUtils.addMenuClickEventListener(IM_MENU_SETTING, () => dialogOpen.value = true);
      vue.onMounted(() => Object.assign(setting, SettingManager.instance.setting));
      const getSelected = (target) => {
        var _a;
        return (_a = target.querySelector("*[selected]")) == null ? void 0 : _a.value;
      };
      const resetSetting = () => {
        const defaultSetting = new Setting();
        Object.assign(setting, defaultSetting);
        SettingManager.instance.saveSetting(setting);
        dialogOpen.value = false;
      };
      const handleSave = () => {
        SettingManager.instance.saveSetting(setting);
        dialogOpen.value = false;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          _hoisted_1,
          vue.createElementVNode("mdui-dialog", {
            "close-on-esc": "",
            "close-on-overlay-click": "",
            class: "setting",
            open: dialogOpen.value
          }, [
            _hoisted_3,
            _hoisted_4,
            vue.createElementVNode("div", _hoisted_5, [
              _hoisted_6,
              vue.createElementVNode("div", _hoisted_7, [
                vue.createElementVNode("mdui-select", {
                  value: setting.countyCode,
                  icon: "location_city",
                  placement: "bottom",
                  onChange: _cache[0] || (_cache[0] = ($event) => setting.countyCode = getSelected($event.target))
                }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(vueCountyInfos), (countyInfo) => {
                    return vue.openBlock(), vue.createElementBlock("mdui-menu-item", {
                      value: countyInfo.code
                    }, vue.toDisplayString(countyInfo.name) + " (" + vue.toDisplayString(countyInfo.code) + ") ", 9, _hoisted_9);
                  }), 256))
                ], 40, _hoisted_8)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_10, [
              _hoisted_11,
              vue.createElementVNode("div", _hoisted_12, [
                vue.createElementVNode("mdui-text-field", {
                  icon: "currency_yen",
                  value: setting.currencySymbol,
                  onChange: _cache[1] || (_cache[1] = ($event) => setting.currencySymbol = $event.target.value)
                }, null, 40, _hoisted_13)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_14, [
              _hoisted_15,
              vue.createElementVNode("div", _hoisted_16, [
                vue.createElementVNode("mdui-select", {
                  icon: "location_on",
                  value: setting.currencySymbolBeforeValue.toString(),
                  placement: "bottom",
                  onChange: _cache[2] || (_cache[2] = ($event) => setting.currencySymbolBeforeValue = getSelected($event.target) === "true")
                }, _hoisted_20, 40, _hoisted_17)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_21, [
              _hoisted_22,
              vue.createElementVNode("div", _hoisted_23, [
                vue.createElementVNode("mdui-text-field", {
                  icon: "update",
                  type: "number",
                  value: setting.rateCacheExpired / (60 * 60 * 1e3),
                  suffix: "h",
                  onChange: _cache[3] || (_cache[3] = ($event) => setting.rateCacheExpired = $event.target.value * (60 * 60 * 1e3))
                }, null, 40, _hoisted_24)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_25, [
              _hoisted_26,
              vue.createElementVNode("div", _hoisted_27, [
                vue.createElementVNode("mdui-switch", {
                  "checked-icon": "auto_awesome",
                  "unchecked-icon": "auto_awesome",
                  slot: "end-icon",
                  value: setting.useCustomRate,
                  onChange: _cache[4] || (_cache[4] = ($event) => setting.useCustomRate = $event.target.checked)
                }, null, 40, _hoisted_28)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_29, [
              _hoisted_30,
              vue.createElementVNode("div", _hoisted_31, [
                vue.createElementVNode("mdui-text-field", {
                  icon: "auto_awesome",
                  type: "number",
                  value: setting.customRate,
                  onChange: _cache[5] || (_cache[5] = ($event) => setting.customRate = $event.target.value)
                }, null, 40, _hoisted_32)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_33, [
              _hoisted_34,
              vue.createElementVNode("div", _hoisted_35, [
                vue.createElementVNode("mdui-select", {
                  icon: "article",
                  value: setting.logLevel,
                  onChange: _cache[6] || (_cache[6] = ($event) => setting.logLevel = getSelected($event.target))
                }, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(LogDefinitions), (def) => {
                    return vue.openBlock(), vue.createElementBlock("mdui-menu-item", {
                      value: def.label
                    }, vue.toDisplayString(def.label), 9, _hoisted_37);
                  }), 256))
                ], 40, _hoisted_36)
              ])
            ]),
            vue.createElementVNode("mdui-button", {
              class: "setting-btn-reset",
              slot: "action",
              variant: "text",
              onClick: resetSetting
            }, "重置"),
            vue.createElementVNode("mdui-button", {
              class: "setting-btn-canal",
              slot: "action",
              variant: "text",
              onClick: _cache[7] || (_cache[7] = ($event) => dialogOpen.value = false)
            }, "取消"),
            vue.createElementVNode("mdui-button", {
              class: "setting-btn-save",
              slot: "action",
              variant: "filled",
              onClick: handleSave
            }, "保存")
          ], 8, _hoisted_2)
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-93f93f99"]]);
  class CookieCountyInfoProvider {
    name() {
      return "cookie";
    }
    match() {
      return true;
    }
    async getCountyCode() {
      return new Promise(async (resolve, reject) => {
        const cookies = await _GM_cookie.list({ name: "steamCountry" });
        if (cookies && cookies.length > 0) {
          const match = cookies[0].value.match(/^[a-zA-Z][a-zA-Z]/);
          if (match) {
            resolve(match[0]);
          }
        }
        reject();
      });
    }
  }
  class StorePageCountyCodeProvider {
    name() {
      return "商店页面";
    }
    match() {
      return window.location.href.includes("store.steampowered.com");
    }
    async getStoreDocument() {
      return document;
    }
    async getCountyCode() {
      var _a, _b, _c, _d, _e;
      const storeDom = await this.getStoreDocument();
      try {
        let countyCode = (_c = (_b = (_a = storeDom == null ? void 0 : storeDom.GStoreItemData) == null ? void 0 : _a.rgNavParams) == null ? void 0 : _b.__page_default_obj) == null ? void 0 : _c.countrycode;
        if (countyCode) {
          return countyCode;
        }
      } catch (e) {
        Logger.warn("读取商店页面区域代码变量失败： " + e.message);
      }
      const dataConfig = (_d = storeDom.querySelector("div#application_config")) == null ? void 0 : _d.getAttribute("data-config");
      if (dataConfig) {
        const countyCode = (_e = JSON.parse(dataConfig)) == null ? void 0 : _e["COUNTRY"];
        if (countyCode) {
          return countyCode;
        }
      }
      const matcher = new RegExp('(?<="countrycode":")[A-Z]{2}(?!=")', "g");
      const scripts = storeDom.querySelectorAll("script");
      for (let scriptText in scripts) {
        const flag = scriptText.includes(`("countrycode":")HK(")`);
        if (flag) {
          const match = scriptText.match(matcher);
          if (match) {
            return match.toString();
          }
        }
      }
      throw new Error("无法从商店页面获取国家代码");
    }
  }
  class RequestStorePageCountyCodeProvider extends StorePageCountyCodeProvider {
    name() {
      return "请求商店页面";
    }
    match() {
      const href = window.location.href;
      return !href.includes("store.steampowered.com") || href.includes("store.steampowered.com/wishlist");
    }
    async getStoreDocument() {
      const storeHtml = await Http.get(String, "https://store.steampowered.com/");
      const parser = new DOMParser();
      return parser.parseFromString(storeHtml, "text/html");
    }
  }
  class MarketPageCountyCodeProvider {
    name() {
      return "市场页面";
    }
    match() {
      return window.location.href.includes("steamcommunity.com");
    }
    getCountyCode() {
      return new Promise((resolve, reject) => {
        try {
          const code = g_strCountryCode;
          if (code)
            return resolve(code);
        } catch (err) {
          Logger.error(err);
        }
        reject();
      });
    }
  }
  const _CountyCodeProviderManager = class _CountyCodeProviderManager {
    constructor() {
      __publicField(this, "providers");
      this.providers = [
        new StorePageCountyCodeProvider(),
        new MarketPageCountyCodeProvider(),
        new RequestStorePageCountyCodeProvider(),
        new CookieCountyInfoProvider()
      ];
    }
    async getCountyCode() {
      Logger.info("尝试获取区域代码");
      for (let provider of this.providers) {
        if (!provider.match()) {
          continue;
        }
        Logger.debug(`尝试通过[${provider.name()}]获取区域代码`);
        try {
          const countyCode = await provider.getCountyCode();
          Logger.info(`通过[${provider.name()}]获取区域代码成功`);
          return countyCode;
        } catch (e) {
          Logger.error(`通过[${provider.name()}]获取区域代码失败`);
        }
      }
      throw new Error("所有获取区域代码策略都获取失败");
    }
  };
  __publicField(_CountyCodeProviderManager, "instance", new _CountyCodeProviderManager());
  let CountyCodeProviderManager = _CountyCodeProviderManager;
  const _SpcManager = class _SpcManager {
    constructor() {
    }
    setCountyCode(code) {
      SettingManager.instance.setCountyCode(code);
    }
    setCurrencySymbol(symbol) {
      SettingManager.instance.setCurrencySymbol(symbol);
    }
    setCurrencySymbolBeforeValue(isCurrencySymbolBeforeValue) {
      SettingManager.instance.setCurrencySymbolBeforeValue(isCurrencySymbolBeforeValue);
    }
    setRateCacheExpired(expired) {
      SettingManager.instance.setRateCacheExpired(expired);
    }
    resetSetting() {
      SettingManager.instance.reset();
    }
    clearCache() {
      RateManager.instance.clear();
    }
    setUseCustomRate(isUseCustomRate) {
      SettingManager.instance.setUseCustomRate(isUseCustomRate);
    }
    setCustomRate(customRate) {
      SettingManager.instance.setCustomRate(customRate);
    }
  };
  __publicField(_SpcManager, "instance", new _SpcManager());
  let SpcManager = _SpcManager;
  (async () => {
    await initContext();
    initApp();
    registerMenu();
    await main();
  })();
  function initApp() {
    vue.createApp(App).mount(
      (() => {
        const app = document.createElement("div");
        app.setAttribute("id", "spc-menu");
        app.setAttribute("class", "mdui-theme-dark");
        document.body.append(app);
        return app;
      })()
    );
  }
  function registerMenu() {
    GmUtils.registerMenuCommand(IM_MENU_SETTING);
    GmUtils.registerMenuCommand(IM_MENU_ISSUES, () => GmUtils.openInTab("https://github.com/marioplus/steam-price-converter"));
  }
  async function initContext() {
    const setting = SettingManager.instance.setting;
    setLogLevel(setting.logLevel);
    let targetCountyInfo = countyCode2Info.get(setting.countyCode);
    if (!targetCountyInfo) {
      Logger.warn(`获取转换后的国家(${setting.countyCode})信息失败，默认为美国：` + setting.countyCode);
      targetCountyInfo = countyCode2Info.get("US");
    }
    Logger.info("目标区域：", targetCountyInfo);
    const currCountyCode = await CountyCodeProviderManager.instance.getCountyCode();
    if (currCountyCode) {
      Logger.info("区域代码：", currCountyCode);
    }
    let currCountInfo = countyCode2Info.get(currCountyCode);
    if (!currCountInfo) {
      Logger.warn("缺少当前国家的信息映射：county: " + currCountyCode + ", 默认为美国");
      currCountInfo = countyCode2Info.get("US");
    }
    Logger.info("当前区域：", currCountInfo);
    _unsafeWindow.SpcManager = SpcManager.instance;
    _unsafeWindow.spcContext = new SpcContext(setting, targetCountyInfo, currCountInfo);
  }

})(mdui, Vue);