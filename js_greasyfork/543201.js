// ==UserScript==
// @name         jojoWork功能增强器
// @namespace    https://greasyfork.org/users/408872
// @version      3.0.1
// @author       gongzhimin, sunquan, caizhenyu
// @description  支持多网站的功能增强脚本，包括 Redmine、日志网站等项目管理系统的功能扩展
// @match        https://t.xjjj.co/*
// @match        https://git.xjjj.co/*
// @match        https://log.xjjj.co/*
// @match        https://log.fat.xjjj.co/*
// @match        https://log.uat.xjjj.co/*
// @match        https://www.json.cn/*
// @connect      oapi.dingtalk.com
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543201/jojoWork%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543201/jojoWork%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class SiteDetector {
    constructor() {
      this.siteConfigs = /* @__PURE__ */ new Map();
      this.initializeSiteConfigs();
    }
    static getInstance() {
      if (!SiteDetector.instance) {
        SiteDetector.instance = new SiteDetector();
      }
      return SiteDetector.instance;
    }
    /**
     * 初始化网站配置
     */
    initializeSiteConfigs() {
      this.siteConfigs.set("redmine", {
        name: "Redmine",
        domains: ["t.xjjj.co"],
        features: ["batchCreate", "statusUpdate", "timeTracking", "taskManagement"],
        apiEndpoint: "/issues",
        authMethod: "csrf"
      });
      this.siteConfigs.set("gitlab", {
        name: "GitLab",
        domains: ["git.xjjj.co"],
        features: ["jobsChecker", "dingTalkNotification", "pipelineMonitor"],
        apiEndpoint: "/api/v4",
        authMethod: "api-key"
      });
      this.siteConfigs.set("log-site", {
        name: "LogSite",
        domains: ["log.xjjj.co", "log.fat.xjjj.co", "log.uat.xjjj.co"],
        features: ["environmentSwitcher", "logEnhancement"],
        authMethod: "session"
      });
      this.siteConfigs.set("json-tool", {
        name: "JsonTool",
        domains: ["www.json.cn"],
        features: ["jsonEnhancement", "fullscreenTrigger"],
        authMethod: "session"
      });
    }
    /**
     * 检测当前网站类型
     */
    detectCurrentSite() {
      const currentHostname = window.location.hostname;
      const currentPath = window.location.pathname;
      if (this.isRedmineSite(currentHostname, currentPath)) {
        return "redmine";
      }
      if (this.isGitlabSite(currentHostname, currentPath)) {
        return "gitlab";
      }
      if (this.isLogSite(currentHostname)) {
        return "log-site";
      }
      if (this.isJsonToolSite(currentHostname)) {
        return "json-tool";
      }
      return null;
    }
    /**
     * 检查是否为 Redmine 网站
     */
    isRedmineSite(hostname, path) {
      const redmineConfig = this.siteConfigs.get("redmine");
      if (!redmineConfig) return false;
      const isRedmineDomain = redmineConfig.domains.some((domain) => hostname.includes(domain));
      const isIssuePage = /\/issues\/\d+(?:[?#]|$)/.test(path);
      const isIssuesListPage = /\/issues(?:[?#]|$)/.test(path);
      const isProjectPage = /\/projects\/[^/]+(?:[?#]|$)/.test(path);
      return isRedmineDomain && (isIssuePage || isIssuesListPage || isProjectPage);
    }
    /**
     * 检查是否为 GitLab 网站
     */
    isGitlabSite(hostname, path) {
      const gitlabConfig = this.siteConfigs.get("gitlab");
      if (!gitlabConfig) return false;
      const isGitlabDomain = gitlabConfig.domains.some((domain) => hostname.includes(domain));
      const isProjectPage = /^\/[^/]+\/[^/]+/.test(path);
      return isGitlabDomain && isProjectPage;
    }
    /**
     * 检查是否为日志网站
     */
    isLogSite(hostname) {
      const logConfig = this.siteConfigs.get("log-site");
      if (!logConfig) return false;
      return logConfig.domains.some((domain) => hostname.includes(domain));
    }
    /**
     * 检查是否为 JSON 工具网站
     */
    isJsonToolSite(hostname) {
      const jsonConfig = this.siteConfigs.get("json-tool");
      if (!jsonConfig) return false;
      return jsonConfig.domains.some((domain) => hostname.includes(domain));
    }
    /**
     * 获取网站配置
     */
    getSiteConfig(siteType) {
      return this.siteConfigs.get(siteType);
    }
    /**
     * 获取所有支持的网站
     */
    getAllSiteConfigs() {
      return new Map(this.siteConfigs);
    }
    /**
     * 注册新的网站配置
     */
    registerSiteConfig(siteType, config) {
      this.siteConfigs.set(siteType, config);
    }
  }
  class UserscriptPlatformAdapter {
    constructor() {
      this.platformName = "userscript";
    }
    async initialize() {
      console.log("油猴脚本平台适配器初始化完成");
    }
    getStorage() {
      return new UserscriptStorage();
    }
    getMessaging() {
      return new UserscriptMessaging();
    }
    getNetwork() {
      return new UserscriptNetwork();
    }
    cleanup() {
      console.log("油猴脚本平台适配器清理完成");
    }
  }
  class ChromeExtensionPlatformAdapter {
    constructor() {
      this.platformName = "chrome-extension";
    }
    async initialize() {
      console.log("Chrome 扩展平台适配器初始化完成");
    }
    getStorage() {
      return new ChromeExtensionStorage();
    }
    getMessaging() {
      return new ChromeExtensionMessaging();
    }
    getNetwork() {
      return new ChromeExtensionNetwork();
    }
    cleanup() {
      console.log("Chrome 扩展平台适配器清理完成");
    }
  }
  class UserscriptStorage {
    async get(key2) {
      try {
        const value = localStorage.getItem(`userscript_${key2}`);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error("获取存储失败:", error);
        return null;
      }
    }
    async set(key2, value) {
      try {
        localStorage.setItem(`userscript_${key2}`, JSON.stringify(value));
      } catch (error) {
        console.error("设置存储失败:", error);
      }
    }
    async remove(key2) {
      try {
        localStorage.removeItem(`userscript_${key2}`);
      } catch (error) {
        console.error("删除存储失败:", error);
      }
    }
    async clear() {
      try {
        const keys = Object.keys(localStorage).filter((key2) => key2.startsWith("userscript_"));
        keys.forEach((key2) => localStorage.removeItem(key2));
      } catch (error) {
        console.error("清空存储失败:", error);
      }
    }
  }
  class ChromeExtensionStorage {
    async get(key2) {
      try {
        const result = await chrome.storage.local.get(key2);
        return result[key2] || null;
      } catch (error) {
        console.error("获取存储失败:", error);
        return null;
      }
    }
    async set(key2, value) {
      try {
        await chrome.storage.local.set({ [key2]: value });
      } catch (error) {
        console.error("设置存储失败:", error);
      }
    }
    async remove(key2) {
      try {
        await chrome.storage.local.remove(key2);
      } catch (error) {
        console.error("删除存储失败:", error);
      }
    }
    async clear() {
      try {
        await chrome.storage.local.clear();
      } catch (error) {
        console.error("清空存储失败:", error);
      }
    }
  }
  class UserscriptMessaging {
    constructor() {
      this.listeners = [];
    }
    async send(_message) {
      console.log("发送消息:", _message);
      return Promise.resolve();
    }
    listen(_callback) {
      this.listeners.push(_callback);
    }
    unlisten() {
      this.listeners = [];
    }
  }
  class ChromeExtensionMessaging {
    constructor() {
      this.listener = null;
    }
    async send(message) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }
    listen(_callback) {
      this.listener = (_message, _sender, _sendResponse) => {
        _callback(_message);
      };
      chrome.runtime.onMessage.addListener(this.listener);
    }
    unlisten() {
      if (this.listener) {
        chrome.runtime.onMessage.removeListener(this.listener);
        this.listener = null;
      }
    }
  }
  class UserscriptNetwork {
    async request(options) {
      const response = await fetch(options.url, {
        method: options.method || "GET",
        headers: options.headers,
        body: options.body ? JSON.stringify(options.body) : void 0
      });
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: await response.json()
      };
    }
    getPageInfo() {
      return {
        url: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        title: document.title
      };
    }
  }
  class ChromeExtensionNetwork {
    async request(options) {
      const response = await fetch(options.url, {
        method: options.method || "GET",
        headers: options.headers,
        body: options.body ? JSON.stringify(options.body) : void 0
      });
      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: await response.json()
      };
    }
    getPageInfo() {
      return {
        url: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        title: document.title
      };
    }
  }
  const _PlatformDetector = class _PlatformDetector {
    constructor() {
      this.currentPlatform = "unknown";
      this.adapter = null;
      this.detectPlatform();
    }
    /**
     * 获取单例实例
     */
    static getInstance() {
      if (!_PlatformDetector.instance) {
        _PlatformDetector.instance = new _PlatformDetector();
      }
      return _PlatformDetector.instance;
    }
    /**
     * 检测当前平台
     */
    detectPlatform() {
      if (this.isChromeExtension()) {
        this.currentPlatform = "chrome-extension";
        console.log("检测到 Chrome 扩展环境");
        return;
      }
      if (this.isUserscript()) {
        this.currentPlatform = "userscript";
        console.log("检测到油猴脚本环境");
        return;
      }
      this.currentPlatform = "unknown";
      console.warn("未知的运行环境");
    }
    /**
     * 检测是否为 Chrome 扩展环境
     */
    isChromeExtension() {
      try {
        return !!(typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id && chrome.extension);
      } catch (error) {
        return false;
      }
    }
    /**
     * 检测是否为油猴脚本环境
     */
    isUserscript() {
      try {
        return !!// Tampermonkey
        (typeof globalThis.GM !== "undefined" || typeof globalThis.GM_info !== "undefined" || // Greasemonkey
        typeof globalThis.unsafeWindow !== "undefined" || // Violentmonkey
        typeof globalThis.VM !== "undefined" || // 通用检测：检查是否在用户脚本环境中
        typeof window !== "undefined" && window.GM_info || // 检查脚本标签中是否包含油猴脚本特征
        this.hasUserscriptMetadata());
      } catch (error) {
        return false;
      }
    }
    /**
     * 检查是否有油猴脚本元数据
     */
    hasUserscriptMetadata() {
      try {
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
          const content = script.textContent || script.innerHTML;
          if (content.includes("// ==UserScript==") || content.includes("@name") || content.includes("@namespace")) {
            return true;
          }
        }
        return false;
      } catch (error) {
        return false;
      }
    }
    /**
     * 获取当前平台类型
     */
    getCurrentPlatform() {
      return this.currentPlatform;
    }
    /**
     * 获取平台适配器
     */
    async getPlatformAdapter() {
      if (this.adapter) {
        return this.adapter;
      }
      switch (this.currentPlatform) {
        case "userscript":
          this.adapter = new UserscriptPlatformAdapter();
          break;
        case "chrome-extension":
          this.adapter = new ChromeExtensionPlatformAdapter();
          break;
        default:
          console.warn("不支持的平台类型:", this.currentPlatform);
          return null;
      }
      await this.adapter.initialize();
      return this.adapter;
    }
    /**
     * 检查平台是否支持特定功能
     */
    isPlatformFeatureSupported(feature) {
      switch (this.currentPlatform) {
        case "userscript":
          return this.isUserscriptFeatureSupported(feature);
        case "chrome-extension":
          return this.isChromeExtensionFeatureSupported(feature);
        default:
          return false;
      }
    }
    /**
     * 检查油猴脚本是否支持特定功能
     */
    isUserscriptFeatureSupported(feature) {
      switch (feature) {
        case "storage":
          return typeof localStorage !== "undefined";
        case "network":
          return typeof fetch !== "undefined";
        case "dom":
          return typeof document !== "undefined";
        case "messaging":
          return false;
        default:
          return false;
      }
    }
    /**
     * 检查 Chrome 扩展是否支持特定功能
     */
    isChromeExtensionFeatureSupported(feature) {
      try {
        switch (feature) {
          case "storage":
            return !!(chrome && chrome.storage);
          case "network":
            return typeof fetch !== "undefined";
          case "dom":
            return typeof document !== "undefined";
          case "messaging":
            return !!(chrome && chrome.runtime && chrome.runtime.sendMessage);
          case "tabs":
            return !!(chrome && chrome.tabs);
          case "notifications":
            return !!(chrome && chrome.notifications);
          default:
            return false;
        }
      } catch (error) {
        return false;
      }
    }
    /**
     * 获取平台信息
     */
    getPlatformInfo() {
      const supportedFeatures = ["storage", "network", "dom", "messaging", "tabs", "notifications"].filter((feature) => this.isPlatformFeatureSupported(feature));
      const info = {
        type: this.currentPlatform,
        name: this.getPlatformName(),
        features: supportedFeatures
      };
      try {
        if (this.currentPlatform === "chrome-extension" && chrome.runtime) {
          return {
            ...info,
            version: chrome.runtime.getManifest().version
          };
        }
        if (this.currentPlatform === "userscript" && window.GM_info) {
          return {
            ...info,
            version: window.GM_info.script.version
          };
        }
      } catch (error) {
      }
      return info;
    }
    /**
     * 获取平台名称
     */
    getPlatformName() {
      switch (this.currentPlatform) {
        case "userscript":
          return "油猴脚本";
        case "chrome-extension":
          return "Chrome 扩展";
        default:
          return "未知平台";
      }
    }
    /**
     * 清理资源
     */
    cleanup() {
      if (this.adapter) {
        this.adapter.cleanup();
        this.adapter = null;
      }
    }
    /**
     * 重置检测器（用于测试）
     */
    static reset() {
      if (_PlatformDetector.instance) {
        _PlatformDetector.instance.cleanup();
        _PlatformDetector.instance = null;
      }
    }
  };
  _PlatformDetector.instance = null;
  let PlatformDetector = _PlatformDetector;
  class BaseEnhancer {
    constructor() {
      this.siteName = "JoJo PMS";
      this.isEnabled = false;
      this.features = /* @__PURE__ */ new Map();
      this.styles = /* @__PURE__ */ new Map();
      this.platformAdapter = null;
      this.init();
    }
    /**
     * 初始化增强器
     */
    async init() {
      if (!this.detectSite()) {
        console.log(`${this.siteName} 增强器：当前网站不匹配`);
        return;
      }
      this.isEnabled = true;
      console.log(`=== ${this.siteName} 功能增强器启动 ===`);
      try {
        await this.initializePlatformAdapter();
        await this.initializeCore();
        await this.initializeFeatures();
        console.log(`${this.siteName} 增强器初始化完成`);
      } catch (error) {
        console.error(`${this.siteName} 增强器初始化失败:`, error);
      }
    }
    /**
     * 初始化平台适配器
     */
    async initializePlatformAdapter() {
      const detector = PlatformDetector.getInstance();
      this.platformAdapter = await detector.getPlatformAdapter();
      if (this.platformAdapter) {
        console.log(`${this.siteName} 平台适配器已初始化: ${this.platformAdapter.platformName}`);
      } else {
        console.warn(`${this.siteName} 无法初始化平台适配器`);
      }
    }
    /**
     * 注册功能模块
     */
    registerFeature(name, feature) {
      this.features.set(name, feature);
      console.log(`${this.siteName} 注册功能: ${name}`);
    }
    /**
     * 获取功能模块
     */
    getFeature(name) {
      return this.features.get(name);
    }
    /**
     * 获取平台适配器
     */
    getPlatformAdapter() {
      return this.platformAdapter;
    }
    /**
     * 获取平台存储
     */
    getPlatformStorage() {
      var _a;
      return (_a = this.platformAdapter) == null ? void 0 : _a.getStorage();
    }
    /**
     * 获取平台消息接口
     */
    getPlatformMessaging() {
      var _a;
      return (_a = this.platformAdapter) == null ? void 0 : _a.getMessaging();
    }
    /**
     * 获取平台网络接口
     */
    getPlatformNetwork() {
      var _a;
      return (_a = this.platformAdapter) == null ? void 0 : _a.getNetwork();
    }
    /**
     * 添加样式
     */
    addStyle(name, css) {
      if (this.styles.has(name)) {
        return;
      }
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
      this.styles.set(name, style);
    }
    /**
     * 移除样式
     */
    removeStyle(name) {
      const style = this.styles.get(name);
      if (style) {
        style.remove();
        this.styles.delete(name);
      }
    }
    /**
     * 等待元素出现
     */
    waitForElement(selector, timeout = 5e3) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        const observer = new MutationObserver(() => {
          const element2 = document.querySelector(selector);
          if (element2) {
            observer.disconnect();
            resolve(element2);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`等待元素超时: ${selector}`));
        }, timeout);
      });
    }
    /**
     * 销毁增强器
     */
    destroy() {
      this.styles.forEach((style) => style.remove());
      this.styles.clear();
      this.features.clear();
      if (this.platformAdapter) {
        this.platformAdapter.cleanup();
        this.platformAdapter = null;
      }
      this.isEnabled = false;
      console.log(`${this.siteName} 增强器已销毁`);
    }
  }
  class ConfigManager {
    constructor() {
      this.config = /* @__PURE__ */ new Map();
      this.storageKey = "multi-site-enhancer-config";
      this.loadConfig();
    }
    static getInstance() {
      if (!ConfigManager.instance) {
        ConfigManager.instance = new ConfigManager();
      }
      return ConfigManager.instance;
    }
    /**
     * 加载配置
     */
    loadConfig() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.config = new Map(Object.entries(parsed));
        }
      } catch (error) {
        console.warn("加载配置失败:", error);
      }
      this.setDefaultConfig();
    }
    /**
     * 设置默认配置
     */
    setDefaultConfig() {
      const defaults = {
        // 全局配置
        "global.debug": false,
        "global.autoSave": true,
        // Redmine 配置
        "redmine.batchCreate.enabled": true,
        "redmine.batchCreate.defaultAssignee": "",
        "redmine.batchCreate.defaultPriority": "正常",
        "redmine.statusUpdate.enabled": true,
        "redmine.timeTracking.enabled": true,
        "redmine.timeTracking.defaultActivity": "开发",
        // GitLab 配置
        "gitlab.jobsChecker.enabled": true,
        "gitlab.jobsChecker.autoCheck": false,
        "gitlab.jobsChecker.checkInterval": 3e4,
        "gitlab.dingTalk.enabled": false,
        "gitlab.dingTalk.webhook": "",
        "gitlab.dingTalk.secret": "",
        // 日志网站配置
        "logSite.environmentSwitcher.enabled": true,
        "logSite.environmentSwitcher.defaultEnv": "fat",
        // JSON 工具配置
        "jsonTool.enhancement.enabled": true,
        "jsonTool.fullscreen.autoTrigger": false
      };
      for (const [key2, value] of Object.entries(defaults)) {
        if (!this.config.has(key2)) {
          this.config.set(key2, value);
        }
      }
    }
    /**
     * 保存配置
     */
    saveConfig() {
      try {
        const configObj = Object.fromEntries(this.config);
        localStorage.setItem(this.storageKey, JSON.stringify(configObj));
      } catch (error) {
        console.error("保存配置失败:", error);
      }
    }
    /**
     * 获取配置值
     */
    get(key2, defaultValue) {
      return this.config.get(key2) ?? defaultValue;
    }
    /**
     * 设置配置值
     */
    set(key2, value) {
      this.config.set(key2, value);
      this.saveConfig();
    }
    /**
     * 删除配置
     */
    delete(key2) {
      const result = this.config.delete(key2);
      if (result) {
        this.saveConfig();
      }
      return result;
    }
    /**
     * 检查配置是否存在
     */
    has(key2) {
      return this.config.has(key2);
    }
    /**
     * 获取所有配置
     */
    getAll() {
      return Object.fromEntries(this.config);
    }
    /**
     * 批量设置配置
     */
    setMultiple(configs) {
      for (const [key2, value] of Object.entries(configs)) {
        this.config.set(key2, value);
      }
      this.saveConfig();
    }
    /**
     * 重置配置
     */
    reset() {
      this.config.clear();
      localStorage.removeItem(this.storageKey);
      this.setDefaultConfig();
      this.saveConfig();
    }
    /**
     * 导出配置
     */
    export() {
      return JSON.stringify(Object.fromEntries(this.config), null, 2);
    }
    /**
     * 导入配置
     */
    import(configJson) {
      try {
        const parsed = JSON.parse(configJson);
        this.config = new Map(Object.entries(parsed));
        this.saveConfig();
        return true;
      } catch (error) {
        console.error("导入配置失败:", error);
        return false;
      }
    }
    /**
     * 获取网站特定配置
     */
    getSiteConfig(siteType) {
      const siteConfig = {};
      const prefix = `${siteType}.`;
      for (const [key2, value] of this.config) {
        if (key2.startsWith(prefix)) {
          const configKey = key2.substring(prefix.length);
          siteConfig[configKey] = value;
        }
      }
      return siteConfig;
    }
    /**
     * 设置网站特定配置
     */
    setSiteConfig(siteType, config) {
      const updates = {};
      for (const [key2, value] of Object.entries(config)) {
        updates[`${siteType}.${key2}`] = value;
      }
      this.setMultiple(updates);
    }
  }
  class RedmineAuthManager {
    constructor() {
      this.csrfToken = null;
      this.lastTokenCheck = 0;
      this.TOKEN_CACHE_DURATION = 5 * 60 * 1e3;
    }
    // 5分钟缓存
    /**
     * 获取 CSRF Token
     */
    getCSRFToken() {
      const now = Date.now();
      if (this.csrfToken && now - this.lastTokenCheck < this.TOKEN_CACHE_DURATION) {
        return this.csrfToken;
      }
      this.csrfToken = this.extractCSRFToken();
      this.lastTokenCheck = now;
      if (this.csrfToken) {
        console.log("获取到 CSRF Token:", this.csrfToken.substring(0, 10) + "...");
      } else {
        console.warn("未找到 CSRF Token");
        this.debugCSRFTokenSources();
      }
      return this.csrfToken;
    }
    /**
     * 从页面中提取 CSRF Token
     */
    extractCSRFToken() {
      var _a, _b, _c;
      let token2 = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
      if (token2) {
        console.log('从 meta[name="csrf-token"] 获取到 CSRF Token');
        return token2;
      }
      token2 = (_b = document.querySelector('meta[name="_csrf"]')) == null ? void 0 : _b.getAttribute("content");
      if (token2) {
        console.log('从 meta[name="_csrf"] 获取到 CSRF Token');
        return token2;
      }
      const tokenInput = document.querySelector('input[name="authenticity_token"]');
      if (tokenInput == null ? void 0 : tokenInput.value) {
        console.log('从 input[name="authenticity_token"] 获取到 CSRF Token');
        return tokenInput.value;
      }
      if ((_c = window.Rails) == null ? void 0 : _c.csrfToken) {
        token2 = window.Rails.csrfToken();
        if (token2) {
          console.log("从 Rails.csrfToken() 获取到 CSRF Token");
          return token2;
        }
      }
      const formTokenInput = document.querySelector('form input[name="authenticity_token"]');
      if (formTokenInput == null ? void 0 : formTokenInput.value) {
        console.log("从表单隐藏字段获取到 CSRF Token");
        return formTokenInput.value;
      }
      const redmineTokenInput = document.querySelector('#new_issue input[name="authenticity_token"]');
      if (redmineTokenInput == null ? void 0 : redmineTokenInput.value) {
        console.log("从 Redmine 新建问题表单获取到 CSRF Token");
        return redmineTokenInput.value;
      }
      return null;
    }
    /**
     * 调试 CSRF Token 来源
     */
    debugCSRFTokenSources() {
      console.log("=== CSRF Token 调试信息 ===");
      const metaTokens = document.querySelectorAll('meta[name*="csrf"], meta[name*="_csrf"]');
      console.log("Meta 标签数量:", metaTokens.length);
      metaTokens.forEach((meta, index) => {
        var _a;
        console.log(`Meta ${index + 1}:`, meta.getAttribute("name"), "=", ((_a = meta.getAttribute("content")) == null ? void 0 : _a.substring(0, 10)) + "...");
      });
      const tokenInputs = document.querySelectorAll('input[name="authenticity_token"]');
      console.log("Token 输入框数量:", tokenInputs.length);
      tokenInputs.forEach((input, index) => {
        const value = input.value;
        console.log(`Token 输入框 ${index + 1}:`, value ? value.substring(0, 10) + "..." : "空值");
      });
      if (window.Rails) {
        console.log("Rails 对象存在:", Object.keys(window.Rails));
        if (window.Rails.csrfToken) {
          console.log("Rails.csrfToken 方法存在");
        }
      } else {
        console.log("Rails 对象不存在");
      }
    }
    /**
     * 获取认证头信息
     */
    getAuthHeaders(options = {}) {
      const headers = {};
      if (!options.isFormData) {
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          headers["X-CSRF-Token"] = csrfToken;
          console.log("使用CSRF Token认证");
        } else {
          console.warn("没有CSRF Token，请求可能会失败");
        }
      }
      headers["X-Requested-With"] = "XMLHttpRequest";
      if (!options.skipContentType && !options.isFormData && options.isJsonApi) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
      }
      console.log("准备的认证头信息:", Object.keys(headers));
      return headers;
    }
    /**
     * 判断是否为 JSON API 请求
     */
    isJsonApiRequest(url, options = {}) {
      var _a, _b;
      if (url.includes(".json")) {
        return true;
      }
      if (options.dataType === "json" || options.contentType === "application/json") {
        return true;
      }
      if ((_b = (_a = options.headers) == null ? void 0 : _a.Accept) == null ? void 0 : _b.includes("application/json")) {
        return true;
      }
      return false;
    }
    /**
     * 记录当前认证状态
     */
    logAuthStatus() {
      const csrfToken = this.getCSRFToken();
      console.log("=== Redmine 认证状态 ===");
      console.log("CSRF Token:", csrfToken ? "✓ 已获取" : "✗ 未找到");
      if (!csrfToken) {
        console.warn("警告: 未找到 CSRF Token，请求可能会失败");
        this.debugCSRFTokenSources();
      } else {
        console.log("✓ 已获取CSRF Token，可以进行认证请求");
      }
    }
    /**
     * 清除缓存的 token
     */
    clearTokenCache() {
      this.csrfToken = null;
      this.lastTokenCheck = 0;
    }
  }
  class RedmineApiClient {
    constructor(authManager) {
      this.authManager = authManager;
      this.baseUrl = window.location.origin;
    }
    /**
     * 发送认证请求
     */
    async authenticatedRequest(url, options = {}) {
      const { isJsonApi = false, ...requestOptions } = options;
      const headers = {
        ...this.authManager.getAuthHeaders({
          isFormData: requestOptions.body instanceof FormData,
          isJsonApi
        }),
        ...requestOptions.headers || {}
      };
      const finalOptions = {
        ...requestOptions,
        headers,
        credentials: "same-origin"
      };
      return fetch(url, finalOptions);
    }
    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/users/current.json`,
        { method: "GET", isJsonApi: true }
      );
      if (!response.ok) {
        throw new Error(`获取用户信息失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 创建任务
     */
    async createIssue(issueData) {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/issues.json`,
        {
          method: "POST",
          body: JSON.stringify({ issue: issueData }),
          isJsonApi: true
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`创建任务失败: ${response.status} - ${errorText}`);
      }
      return response.json();
    }
    /**
     * 使用表单方式创建任务
     */
    async createIssueWithForm(formData) {
      return this.authenticatedRequest(`${this.baseUrl}/issues`, {
        method: "POST",
        body: formData
      });
    }
    /**
     * 更新任务状态
     */
    async updateIssueStatus(issueId, statusId) {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/issues/${issueId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            issue: { status_id: statusId }
          }),
          isJsonApi: true
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`更新任务状态失败: ${response.status} - ${errorText}`);
      }
      return response.json();
    }
    /**
     * 更新任务（通用方法）
     */
    async updateIssue(issueId, issueData) {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/issues/${issueId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(issueData),
          isJsonApi: true
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`更新任务失败: ${response.status} - ${errorText}`);
      }
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || response.status === 204) {
        console.log(`任务 ${issueId} 更新成功 (${response.status})`);
        return { success: true, status: response.status };
      }
      try {
        const responseText = await response.text();
        if (!responseText || responseText.trim() === "") {
          console.log(`任务 ${issueId} 更新成功 (空响应体)`);
          return { success: true, status: response.status };
        }
        try {
          const jsonData = JSON.parse(responseText);
          return jsonData;
        } catch (parseError) {
          console.warn(`任务 ${issueId} 更新成功，但响应不是JSON:`, responseText);
          return { success: true, status: response.status, rawResponse: responseText };
        }
      } catch (readError) {
        console.warn(`任务 ${issueId} 更新成功，但无法读取响应:`, readError);
        return { success: true, status: response.status };
      }
    }
    /**
     * 获取任务详情
     */
    async getIssue(issueId, params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}/issues/${issueId}.json${queryString ? "?" + queryString : ""}`;
      const response = await this.authenticatedRequest(url, {
        method: "GET",
        isJsonApi: true
      });
      if (!response.ok) {
        throw new Error(`获取任务详情失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取项目成员列表
     */
    async getProjectMembers(projectId) {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/projects/${projectId}/memberships.json`,
        { method: "GET", isJsonApi: true }
      );
      if (!response.ok) {
        throw new Error(`获取项目成员失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 记录工时
     */
    async logTime(timeEntryData) {
      const response = await this.authenticatedRequest(
        `${this.baseUrl}/time_entries.json`,
        {
          method: "POST",
          body: JSON.stringify({ time_entry: timeEntryData }),
          isJsonApi: true
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`记录工时失败: ${response.status} - ${errorText}`);
      }
      return response.json();
    }
    /**
     * 获取工时记录
     */
    async getTimeEntries(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}/time_entries.json${queryString ? "?" + queryString : ""}`;
      const response = await this.authenticatedRequest(url, {
        method: "GET",
        isJsonApi: true
      });
      if (!response.ok) {
        throw new Error(`获取工时记录失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 批量更新任务
     */
    async batchUpdateIssues(issueIds, updateData) {
      const promises = issueIds.map(
        (id) => this.authenticatedRequest(
          `${this.baseUrl}/issues/${id}.json`,
          {
            method: "PUT",
            body: JSON.stringify({ issue: updateData }),
            isJsonApi: true
          }
        )
      );
      const responses = await Promise.allSettled(promises);
      const results = {
        success: [],
        failed: []
      };
      responses.forEach((result, index) => {
        const issueId = issueIds[index];
        if (result.status === "fulfilled" && result.value.ok) {
          results.success.push(issueId);
        } else {
          const error = result.status === "rejected" ? result.reason.message : `HTTP ${result.value.status}`;
          results.failed.push({ id: issueId, error });
        }
      });
      return results;
    }
    /**
     * 搜索任务
     */
    async searchIssues(query, params = {}) {
      const searchParams = {
        ...params,
        q: query
      };
      const queryString = new URLSearchParams(searchParams).toString();
      const url = `${this.baseUrl}/issues.json?${queryString}`;
      const response = await this.authenticatedRequest(url, {
        method: "GET",
        isJsonApi: true
      });
      if (!response.ok) {
        throw new Error(`搜索任务失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 通用请求方法
     */
    async request(url, options = {}) {
      const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
      return this.authenticatedRequest(fullUrl, options);
    }
  }
  function waitForElement$1(selector, timeout = 5e3) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      const observer = new MutationObserver(() => {
        const element2 = document.querySelector(selector);
        if (element2) {
          observer.disconnect();
          resolve(element2);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素超时: ${selector}`));
      }, timeout);
    });
  }
  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    if (options.className) {
      element.className = options.className;
    }
    if (options.id) {
      element.id = options.id;
    }
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key2, value]) => {
        element.setAttribute(key2, value);
      });
    }
    if (options.styles) {
      Object.assign(element.style, options.styles);
    }
    if (options.events) {
      Object.entries(options.events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
      });
    }
    return element;
  }
  function addStyle(css, id) {
    const style = document.createElement("style");
    style.textContent = css;
    if (id) {
      style.id = id;
    }
    document.head.appendChild(style);
    return style;
  }
  function formatDate(date, format = "YYYY-MM-DD") {
    const d = typeof date === "string" ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return format.replace("YYYY", String(year)).replace("MM", month).replace("DD", day).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);
  }
  function getTodayString(format = "YYYY-MM-DD") {
    return formatDate(/* @__PURE__ */ new Date(), format);
  }
  class RedmineTaskManager {
    constructor(apiClient, currentUserId) {
      this.taskList = [];
      this.defaultParentId = "";
      this.projectId = "";
      this.currentUserId = "";
      this.baseUrl = "";
      this.apiClient = apiClient;
      if (currentUserId) {
        this.currentUserId = currentUserId;
      }
      this.initializeVariables();
    }
    /**
     * 初始化变量
     */
    async initializeVariables() {
      try {
        if (!this.currentUserId) {
          await this.initCurrentUser();
        }
        const pathMatch = window.location.pathname.match(/\/projects\/([^/]+)/);
        if (pathMatch) {
          this.projectId = pathMatch[1];
          console.log("当前项目ID:", this.projectId);
        }
        const parentSelect = document.querySelector("#issue_parent_issue_id");
        if (parentSelect == null ? void 0 : parentSelect.value) {
          this.defaultParentId = parentSelect.value;
          console.log("默认父任务ID:", this.defaultParentId);
        }
        const searchForm = document.querySelector("#quick-search form");
        const searchFormAction = searchForm == null ? void 0 : searchForm.getAttribute("action");
        if (searchFormAction) {
          this.baseUrl = searchFormAction.replace("search", "issues");
        } else if (this.projectId) {
          this.baseUrl = `${window.location.origin}/projects/${this.projectId}/issues`;
        } else {
          this.baseUrl = `${window.location.origin}/issues`;
        }
        console.log("任务创建URL:", this.baseUrl);
      } catch (error) {
        console.error("初始化变量失败:", error);
      }
    }
    /**
     * 初始化当前用户信息
     */
    async initCurrentUser() {
      try {
        const loggedAsLink = document.querySelector("#loggedas a");
        if (loggedAsLink) {
          const href = loggedAsLink.href;
          const userIdMatch = href.match(/\/users\/(\d+)$/);
          if (userIdMatch) {
            this.currentUserId = userIdMatch[1];
            console.log("当前用户ID:", this.currentUserId);
          }
        }
        if (!this.currentUserId) {
          console.error("无法从页面获取当前用户ID");
        }
      } catch (error) {
        console.error("获取当前用户信息失败:", error);
      }
    }
    /**
     * 添加任务到列表
     */
    addTask(taskData) {
      const task = {
        title: taskData.title || "",
        startDate: taskData.startDate || getTodayString(),
        dueDate: taskData.dueDate || "",
        parentId: taskData.parentId || this.defaultParentId,
        isParent: taskData.isParent ?? true,
        children: taskData.children || [],
        createdId: null,
        assigneeId: taskData.assigneeId || this.currentUserId,
        priority: taskData.priority || "正常",
        description: taskData.description || ""
      };
      this.taskList.push(task);
      console.log("添加任务到列表:", task.title);
    }
    /**
     * 移除任务
     */
    removeTask(index) {
      if (index >= 0 && index < this.taskList.length) {
        const removedTask = this.taskList.splice(index, 1)[0];
        console.log("移除任务:", removedTask.title);
        return true;
      }
      return false;
    }
    /**
     * 获取任务列表
     */
    getTaskList() {
      return [...this.taskList];
    }
    /**
     * 清空任务列表
     */
    clearTaskList() {
      this.taskList = [];
      console.log("任务列表已清空");
    }
    /**
     * 获取总任务数量（包括子任务）
     */
    getTotalTaskCount() {
      let total = this.taskList.length;
      this.taskList.forEach((task) => {
        if (task.children) {
          total += task.children.length;
        }
      });
      return total;
    }
    /**
     * 获取子任务数量
     */
    getChildTaskCount() {
      return this.taskList.reduce((count, task) => {
        var _a;
        return count + (((_a = task.children) == null ? void 0 : _a.length) || 0);
      }, 0);
    }
    /**
     * 创建单个任务
     */
    async createSingleTask(task, parentIssueId) {
      try {
        console.log(`开始创建任务: ${task.title}`);
        const issueData = {
          subject: task.title,
          assigned_to_id: task.assigneeId || this.currentUserId,
          project_id: this.projectId
        };
        if (parentIssueId) {
          issueData.parent_issue_id = parentIssueId;
        }
        if (task.startDate && /^\d{4}-\d{2}-\d{2}$/.test(task.startDate)) {
          issueData.start_date = task.startDate;
        }
        if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
          issueData.due_date = task.dueDate;
        }
        if (task.description) {
          issueData.description = task.description;
        }
        const result = await this.createTaskWithForm(task, parentIssueId);
        return result;
      } catch (error) {
        console.error(`✗ 任务创建失败: ${task.title}`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "未知错误"
        };
      }
    }
    /**
     * 使用表单方式创建任务 - 迁移自原版 jojo-work.js
     */
    async createTaskWithForm(task, parentIssueId) {
      try {
        const formData = new FormData();
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          formData.append("authenticity_token", csrfToken);
          console.log("已添加 CSRF Token 到 FormData:", csrfToken.substring(0, 10) + "...");
        } else {
          console.error("未找到 CSRF Token，请求可能会失败！");
        }
        formData.append("issue[subject]", task.title);
        formData.append("issue[assigned_to_id]", task.assigneeId || this.currentUserId);
        if (this.projectId) {
          formData.append("issue[project_id]", this.projectId);
          console.log("设置项目ID:", this.projectId);
        }
        const useParentId = parentIssueId || task.parentId || this.defaultParentId;
        if (useParentId) {
          formData.append("issue[parent_issue_id]", useParentId);
        }
        if (task.startDate && /^\d{4}-\d{2}-\d{2}$/.test(task.startDate)) {
          formData.append("issue[start_date]", task.startDate);
        }
        if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
          formData.append("issue[due_date]", task.dueDate);
        }
        formData.append("issue[tracker_id]", "1");
        formData.append("issue[status_id]", "1");
        const submitUrl = this.baseUrl || `${window.location.origin}/issues`;
        const headers = {
          "X-Requested-With": "XMLHttpRequest"
        };
        console.log("=== 表单任务创建请求 ===");
        console.log("提交URL:", submitUrl);
        const response = await fetch(submitUrl, {
          method: "POST",
          body: formData,
          headers,
          credentials: "same-origin"
        });
        console.log(`任务 "${task.title}" 响应状态:`, response.status);
        if (response.status === 401) {
          throw new Error("身份验证失败 (401): 请检查 CSRF Token 配置");
        } else if (response.status === 403) {
          throw new Error("权限不足 (403): 当前用户没有创建任务的权限");
        } else if (response.status === 422) {
          const responseText = await response.text();
          console.error("请求参数错误，响应内容:", responseText);
          throw new Error(`请求参数错误 (422): ${responseText}`);
        }
        let taskId = null;
        if (response.status === 302 || response.status === 301) {
          const location = response.headers.get("Location");
          console.log(`任务 "${task.title}" Location头:`, location);
          if (location) {
            const locationMatch = location.match(/\/issues\/(\d+)/);
            if (locationMatch) {
              taskId = locationMatch[1];
              console.log(`从重定向URL提取任务ID: ${taskId}`);
            }
          }
        } else if (response.status === 200 || response.status === 201) {
          const responseText = await response.text();
          const idMatch = responseText.match(/\/issues\/(\d+)/) || responseText.match(/"id":(\d+)/) || responseText.match(/issue_(\d+)/);
          if (idMatch) {
            taskId = idMatch[1];
            console.log(`从响应内容提取任务ID: ${taskId}`);
          }
        }
        if (taskId) {
          return { success: true, issueId: taskId };
        } else {
          console.warn(`任务 "${task.title}" 创建可能成功，但未能获取任务ID`);
          return { success: true, issueId: void 0 };
        }
      } catch (error) {
        console.error(`表单创建任务失败: ${task.title}`, error);
        return { success: false, error: error instanceof Error ? error.message : "未知错误" };
      }
    }
    /**
     * 获取 CSRF Token
     */
    getCSRFToken() {
      var _a;
      let token2 = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
      if (token2) {
        console.log('从 meta[name="csrf-token"] 获取到 CSRF Token:', token2.substring(0, 10) + "...");
        return token2;
      }
      const tokenInput = document.querySelector('input[name="authenticity_token"]');
      if (tokenInput == null ? void 0 : tokenInput.value) {
        token2 = tokenInput.value;
        console.log('从 input[name="authenticity_token"] 获取到 CSRF Token:', token2.substring(0, 10) + "...");
        return token2;
      }
      console.warn("未找到 CSRF Token");
      return "";
    }
    /**
     * 批量创建任务
     */
    async createAllTasks(onProgress) {
      if (this.taskList.length === 0) {
        throw new Error("请至少添加一个任务！");
      }
      const totalTasks = this.getTotalTaskCount();
      let completedTasks = 0;
      let successCount = 0;
      let failCount = 0;
      const results = [];
      console.log(`开始批量创建任务，总计: ${totalTasks}个`);
      for (const task of this.taskList) {
        onProgress == null ? void 0 : onProgress(completedTasks, totalTasks, `创建父任务: ${task.title}`);
        const result = await this.createSingleTask(task);
        results.push({ task: task.title, type: "parent", ...result });
        completedTasks++;
        if (result.success) {
          successCount++;
          task.createdId = result.issueId;
          if (task.children && task.children.length > 0) {
            for (const childTask of task.children) {
              onProgress == null ? void 0 : onProgress(completedTasks, totalTasks, `创建子任务: ${childTask.title}`);
              const childResult = await this.createSingleTask(childTask, result.issueId);
              results.push({ task: childTask.title, type: "child", parent: task.title, ...childResult });
              completedTasks++;
              if (childResult.success) {
                successCount++;
                childTask.createdId = childResult.issueId;
              } else {
                failCount++;
              }
            }
          }
        } else {
          failCount++;
        }
      }
      console.log(`批量创建完成: 成功 ${successCount}个, 失败 ${failCount}个`);
      return { success: successCount, failed: failCount, results };
    }
    /**
     * 更新任务状态
     */
    async updateTaskStatus(taskId, statusId) {
      try {
        console.log(`更新任务 ${taskId} 状态为: ${statusId}`);
        await this.apiClient.updateIssueStatus(taskId, statusId);
        console.log(`✓ 任务 ${taskId} 状态更新成功`);
        return { success: true };
      } catch (error) {
        console.error(`✗ 任务 ${taskId} 状态更新失败:`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "未知错误"
        };
      }
    }
    /**
     * 批量更新任务状态
     */
    async batchUpdateTaskStatus(taskIds, statusId, onProgress) {
      const results = {
        success: [],
        failed: []
      };
      for (let i = 0; i < taskIds.length; i++) {
        const taskId = taskIds[i];
        onProgress == null ? void 0 : onProgress(i, taskIds.length, `更新任务 ${taskId}`);
        const result = await this.updateTaskStatus(taskId, statusId);
        if (result.success) {
          results.success.push(taskId);
        } else {
          results.failed.push({ id: taskId, error: result.error || "未知错误" });
        }
      }
      console.log(`批量状态更新完成: 成功 ${results.success.length}个, 失败 ${results.failed.length}个`);
      return results;
    }
    /**
     * 获取当前用户ID
     */
    getCurrentUserId() {
      return this.currentUserId;
    }
    /**
     * 设置当前用户ID
     */
    setCurrentUserId(userId) {
      this.currentUserId = userId;
      console.log("设置任务管理器当前用户ID:", userId);
    }
  }
  class RedmineBatchCreator {
    constructor(taskManager) {
      this.container = null;
      this.toggleButton = null;
      this.isVisible = false;
      this.taskList = [];
      this.defaultParentId = "";
      this.currentUserId = "";
      this.taskManager = taskManager;
      this.initializeVariables();
      this.addStyles();
    }
    /**
     * 初始化变量
     */
    initializeVariables() {
      const userLink = document.querySelector("#loggedas a");
      if (userLink) {
        this.currentUserId = userLink.href.split("/").pop() || "";
      }
      this.defaultParentId = window.location.pathname.split("/issues/")[1] || "";
      console.log("批量任务创建器初始化:", {
        currentUserId: this.currentUserId,
        defaultParentId: this.defaultParentId
      });
    }
    /**
     * 添加样式 - 迁移自原版 jojo-work.js
     */
    addStyles() {
      const css = `
      /* 批量任务创建器主容器 */
      #batch-task-creator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ffffff;
        border: 2px solid #628DB6;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 500px;
        max-width: 1200px;
        max-height: 90vh;
        overflow-y: auto;
        display: none;
        font-family: Arial, sans-serif;
      }

      /* 悬浮切换按钮 */
      #batch-task-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #628DB6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 28px;
        font-weight: 300;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      /* 标题栏 */
      #batch-task-creator h3 {
        margin: 0 0 10px 0;
        color: #628DB6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      /* 表单控件 */
      #batch-task-creator input,
      #batch-task-creator select,
      #batch-task-creator button {
        padding: 5px;
        border-radius: 4px;
        font-size: 14px;
      }

      #batch-task-creator button {
        color: white;
        cursor: pointer;
      }

      #batch-task-creator .button-positive {
        background: #169F4B;
        color: white;
        border: 1px solid #169F4B;
      }

      /* 任务列表表格 */
      #batch-task-creator .list {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin: 10px 0;
      }

      #batch-task-creator .list th,
      #batch-task-creator .list td {
        padding: 5px;
        text-align: left;
      }

      #batch-task-creator .list th {
        background: #f5f5f5;
        font-weight: bold;
      }

      #batch-task-creator .list input {
        width: 100%;
        padding: 2px;
        border-radius: 2px;
        box-sizing: border-box;
      }

      /* 进度条 */
      #batch-task-creator #task-progress {
        margin-top: 10px;
        display: none;
      }

      #batch-task-creator #progress-bar {
        height: 20px;
        background: #169F4B;
        width: 0%;
        transition: width 0.3s;
        border-radius: 4px;
      }

      #batch-task-creator #progress-text {
        text-align: center;
        margin-top: 5px;
        font-size: 12px;
      }

      /* 拖拽手柄 */
      #batch-task-creator .resize-handle {
        position: absolute;
        left: 0;
        top: 0;
        width: 20px;
        height: 20px;
        cursor: nw-resize;
        background: #f0f0f0;
        border-radius: 6px 0 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
        user-select: none;
        z-index: 1001;
      }

      /* 常用标题下拉UI样式 */
      #custom-title-list {
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        min-width: 180px;
        max-width: 400px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px 0;
        z-index: 99999;
      }

      /* 输入框容器需要相对定位 */
      .input-container {
        position: relative;
      }

      .custom-title-item {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background 0.2s;
        border: none;
        background: none;
      }

      .custom-title-item:hover {
        background: #e6f7ff;
      }

      .custom-title-remove {
        margin-left: auto;
        color: #bbb;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding-left: 8px;
        transition: color 0.2s;
      }

      .custom-title-remove:hover {
        color: #f5222d;
      }

      .custom-title-empty {
        padding: 12px 16px;
        color: #bbb;
        text-align: center;
        font-size: 14px;
      }
    `;
      addStyle(css, "batch-task-creator-styles");
    }
    /**
     * 初始化批量任务创建器
     */
    init() {
      if (!/^\d+$/.test(this.defaultParentId)) {
        console.log("父任务ID无效，批量创建功能不启用");
        return;
      }
      const existingCreator = document.getElementById("batch-task-creator");
      if (existingCreator) {
        console.log("发现已存在的批量任务创建器，清理后重新创建");
        existingCreator.remove();
      }
      const existingToggle = document.getElementById("batch-task-toggle");
      if (existingToggle) {
        existingToggle.remove();
      }
      this.createUI();
      this.setDefaultStartDate();
      this.bindEvents();
    }
    /**
     * 创建UI界面
     */
    createUI() {
      const batchTaskArea = this.createBatchTaskHTML();
      document.body.insertAdjacentHTML("beforeend", batchTaskArea);
      this.container = document.getElementById("batch-task-creator");
      this.toggleButton = document.getElementById("batch-task-toggle");
    }
    /**
     * 显示批量创建器
     */
    show() {
      if (this.container) {
        this.container.style.display = "block";
      }
      if (this.toggleButton) {
        this.toggleButton.style.display = "none";
      }
      this.isVisible = true;
      console.log("批量任务创建器已显示");
    }
    /**
     * 隐藏批量创建器
     */
    hide() {
      if (this.container) {
        this.container.style.display = "none";
      }
      if (this.toggleButton) {
        this.toggleButton.style.display = "flex";
      }
      this.isVisible = false;
      console.log("批量任务创建器已隐藏");
    }
    /**
     * 创建批量任务HTML - 迁移自原版
     */
    createBatchTaskHTML() {
      const savedMode = localStorage.getItem("redmine_task_mode") || "select";
      return `
      <div id="batch-task-creator" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ffffff;
        border: 2px solid #628DB6;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 500px;
        max-width: 1200px;
        max-height: 90vh;
        overflow-y: auto;
        display: none;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="margin: 0; color: #628DB6;">批量创建任务</h3>
          <div style="display: flex; align-items: center; gap: 8px;">
            <select id="task-mode-switch" style="padding: 2px 8px; font-size: 13px;">
              <option value="select" ${savedMode === "select" ? "selected" : ""}>选择模式</option>
              <option value="custom" ${savedMode === "custom" ? "selected" : ""}>自定义模式</option>
            </select>
            <button id="close-task-creator" style="background: #d00; color: white; border: none; padding: 3px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">×</button>
          </div>
        </div>

        <div id="task-creator-content" style="display: flex; flex-direction: column; height: calc(100% - 60px);">
          <div style="margin: 5px 0; flex-shrink: 0;">
            <div style="margin-bottom: 5px;">
              <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                <select id="task-title-select" style="flex: 1; padding: 5px;margin-top: 2px;">
                  <option value="">请选择任务类型</option>
                  <option value="后端开发任务">后端开发任务</option>
                  <option value="技术方案设计">技术方案设计</option>
                  <option value="技术方案评审">技术方案评审</option>
                  <option value="冒烟自测">冒烟自测</option>
                  <option value="单元测试">单元测试</option>
                  <option value="开发任务">开发任务</option>
                  <option value="测试任务">测试任务</option>
                  <option value="测试用例编写">测试用例编写</option>
                  <option value="用例评审">用例评审</option>
                  <option value="fat测试">fat测试</option>
                  <option value="uat测试">uat测试</option>
                </select>
                <button id="use-custom-title" class="button" title="使用自定义标题">自定义</button>
              </div>
              <div class="input-container" style="display: flex; gap: 5px; align-items: center; margin-bottom: 5px; position: relative;">
                <input type="text" id="task-title" placeholder="或输入自定义任务标题" style="width: 100%; padding: 5px; display: none;">
                <button id="save-custom-title" class="button" style="display: none; white-space: nowrap;">保存为常用</button>
                <div id="custom-title-list" style="display: none;"></div>
              </div>
            </div>
            <div style="display: flex; gap: 5px; margin-bottom: 5px;">
              <input type="date" id="task-start-date" style="flex: 1; padding: 5px;" title="开始日期">
              <input type="date" id="task-due-date" style="flex: 1; padding: 5px;" title="结束日期">
              <input type="text" id="task-parent-id" placeholder="父任务ID" style="flex: 1; padding: 5px;">
            </div>
            <button id="add-task" class="button" style="width: 100%; margin-bottom: 10px;">添加到列表</button>
          </div>

          <div id="task-list" style="margin: 10px 0; overflow-y: auto; flex: 1; min-height: 200px;">
            <table class="list" style="width: 100%; font-size: 12px;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 5px;">任务标题</th>
                  <th style="padding: 5px;">开始日期</th>
                  <th style="padding: 5px;">结束日期</th>
                  <th style="padding: 5px;">父任务ID</th>
                  <th style="padding: 5px;">操作</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <!-- 底部按钮区域 -->
          <div style="flex-shrink: 0; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
            <button id="create-batch-tasks" class="button-positive" style="width: 100%; background: #169F4B; color: white; padding: 12px; font-size: 14px; font-weight: bold;">创建所有任务</button>
          </div>

          <div id="task-progress" style="margin-top: 10px; display: none; flex-shrink: 0;">
            <div style="background: #f0f0f0; border-radius: 4px; overflow: hidden;">
              <div id="progress-bar" style="height: 20px; background: #169F4B; width: 0%; transition: width 0.3s;"></div>
            </div>
            <div id="progress-text" style="text-align: center; margin-top: 5px; font-size: 12px;"></div>
          </div>
        </div>

        <!-- 拖拽手柄 -->
        <div class="resize-handle" style="
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 20px;
          cursor: nw-resize;
          background: #f0f0f0;
          border-radius: 6px 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #666;
          user-select: none;
          z-index: 1001;
        " title="拖拽调整大小">⋮⋮</div>
      </div>

      <!-- 悬浮按钮，默认显示 -->
      <div id="batch-task-toggle" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #628DB6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 28px;
        font-weight: 300;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      " title="批量创建任务">+</div>
    `;
    }
    /**
     * 设置默认开始日期
     */
    setDefaultStartDate() {
      const today = /* @__PURE__ */ new Date();
      const dateString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      setTimeout(() => {
        const startDateInput = document.getElementById("task-start-date");
        if (startDateInput) {
          startDateInput.value = dateString;
        }
      }, 100);
    }
    /**
     * 绑定事件 - 迁移自原版完整逻辑
     */
    bindEvents() {
      const savedWidth = localStorage.getItem("redmine_batch_creator_width");
      const savedHeight = localStorage.getItem("redmine_batch_creator_height");
      const creator = document.getElementById("batch-task-creator");
      if (creator) {
        if (savedWidth) {
          creator.style.width = parseInt(savedWidth) + "px";
        }
        if (savedHeight) {
          creator.style.height = parseInt(savedHeight) + "px";
        }
      }
      this.setupResizeHandle();
      this.bindMainEvents();
      this.bindCustomTitleEvents();
      this.bindModeSwitch();
    }
    /**
     * 设置拖拽调整大小功能
     */
    setupResizeHandle() {
      let isResizing = false;
      let startX, startY, startWidth, startHeight, startLeft, startTop;
      const resizeHandle = document.querySelector(".resize-handle");
      const creator = document.getElementById("batch-task-creator");
      if (!resizeHandle || !creator) return;
      resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = creator.offsetWidth;
        startHeight = creator.offsetHeight;
        const rect = creator.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        e.preventDefault();
      });
      document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newWidth = startWidth - deltaX;
        const newHeight = startHeight - deltaY;
        const minWidth = 500, maxWidth = Math.min(1200, window.innerWidth - 40);
        const minHeight = 400, maxHeight = Math.min(800, window.innerHeight - 40);
        const finalWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        const finalHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        let newLeft = startLeft + (startWidth - finalWidth);
        let newTop = startTop + (startHeight - finalHeight);
        newLeft = Math.max(20, Math.min(newLeft, window.innerWidth - finalWidth - 20));
        newTop = Math.max(20, Math.min(newTop, window.innerHeight - finalHeight - 20));
        creator.style.width = finalWidth + "px";
        creator.style.height = finalHeight + "px";
        creator.style.left = newLeft + "px";
        creator.style.top = newTop + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isResizing) {
          isResizing = false;
          localStorage.setItem("redmine_batch_creator_width", creator.offsetWidth.toString());
          localStorage.setItem("redmine_batch_creator_height", creator.offsetHeight.toString());
        }
      });
    }
    /**
     * 绑定主要事件
     */
    bindMainEvents() {
      const toggleBtn = document.getElementById("batch-task-toggle");
      toggleBtn == null ? void 0 : toggleBtn.addEventListener("click", () => this.show());
      const closeBtn = document.getElementById("close-task-creator");
      closeBtn == null ? void 0 : closeBtn.addEventListener("click", () => this.hide());
      const addTaskBtn = document.getElementById("add-task");
      addTaskBtn == null ? void 0 : addTaskBtn.addEventListener("click", () => this.addTaskToList());
      const createBtn = document.getElementById("create-batch-tasks");
      createBtn == null ? void 0 : createBtn.addEventListener("click", () => this.createAllTasks());
      const titleSelect = document.getElementById("task-title-select");
      titleSelect == null ? void 0 : titleSelect.addEventListener("change", () => {
        const selectedType = titleSelect.value;
        if (selectedType) {
          this.setDatesByTaskType(selectedType);
        }
        if (selectedType === "开发任务") {
          const startDateInput2 = document.getElementById("task-start-date");
          const dueDateInput = document.getElementById("task-due-date");
          if (startDateInput2 && dueDateInput) {
            dueDateInput.value = startDateInput2.value;
          }
        }
      });
      const startDateInput = document.getElementById("task-start-date");
      startDateInput == null ? void 0 : startDateInput.addEventListener("change", () => {
        const titleSelect2 = document.getElementById("task-title-select");
        if ((titleSelect2 == null ? void 0 : titleSelect2.value) === "开发任务") {
          const dueDateInput = document.getElementById("task-due-date");
          if (dueDateInput) {
            dueDateInput.value = startDateInput.value;
          }
        }
      });
      const titleInput = document.getElementById("task-title");
      const parentIdInput = document.getElementById("task-parent-id");
      titleInput == null ? void 0 : titleInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addTaskToList();
        }
      });
      parentIdInput == null ? void 0 : parentIdInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addTaskToList();
        }
      });
      titleSelect == null ? void 0 : titleSelect.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addTaskToList();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.hide();
        }
      });
    }
    /**
     * 绑定常用标题事件
     */
    bindCustomTitleEvents() {
      const getCustomTitles = () => {
        return JSON.parse(localStorage.getItem("redmine_custom_titles") || "[]");
      };
      const setCustomTitles = (titles) => {
        localStorage.setItem("redmine_custom_titles", JSON.stringify(titles));
      };
      const renderCustomTitleList = () => {
        const titles = getCustomTitles();
        const input = document.getElementById("task-title");
        const list = document.getElementById("custom-title-list");
        if (!input || !list) return;
        list.innerHTML = "";
        if (titles.length === 0) {
          list.innerHTML = '<div class="custom-title-empty">暂无常用标题</div>';
          list.style.display = "block";
          return;
        }
        titles.forEach((title) => {
          const item = document.createElement("div");
          item.className = "custom-title-item";
          item.textContent = title;
          const removeBtn = document.createElement("span");
          removeBtn.className = "custom-title-remove";
          removeBtn.textContent = "×";
          removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const newTitles = getCustomTitles().filter((t) => t !== title);
            setCustomTitles(newTitles);
            renderCustomTitleList();
          });
          item.addEventListener("click", () => {
            input.value = title;
            input.focus();
            list.style.display = "none";
          });
          item.appendChild(removeBtn);
          list.appendChild(item);
        });
        list.style.display = "block";
      };
      const useCustomBtn = document.getElementById("use-custom-title");
      useCustomBtn == null ? void 0 : useCustomBtn.addEventListener("click", () => {
        const select = document.getElementById("task-title-select");
        const input = document.getElementById("task-title");
        const button = useCustomBtn;
        if (input.style.display !== "none") {
          input.style.display = "none";
          select.style.display = "block";
          button.textContent = "自定义";
          button.title = "使用自定义标题";
          select.focus();
          this.showCustomTitleUI(false);
        } else {
          select.style.display = "none";
          input.style.display = "block";
          button.textContent = "选择";
          button.title = "从预设选项中选择";
          input.focus();
          const today = /* @__PURE__ */ new Date();
          const todayString = this.formatDate(today);
          const startDateInput = document.getElementById("task-start-date");
          const dueDateInput = document.getElementById("task-due-date");
          if (startDateInput) startDateInput.value = todayString;
          if (dueDateInput) dueDateInput.value = "";
          this.showCustomTitleUI(true);
        }
      });
      const saveBtn = document.getElementById("save-custom-title");
      saveBtn == null ? void 0 : saveBtn.addEventListener("click", () => {
        const input = document.getElementById("task-title");
        const val = input.value.trim();
        if (!val) return;
        let titles = getCustomTitles();
        if (!titles.includes(val)) {
          titles.push(val);
          setCustomTitles(titles);
          renderCustomTitleList();
        }
        input.value = "";
        input.focus();
      });
      const titleInput = document.getElementById("task-title");
      titleInput == null ? void 0 : titleInput.addEventListener("focus", () => {
        if (titleInput.style.display !== "none") {
          renderCustomTitleList();
        }
      });
      titleInput == null ? void 0 : titleInput.addEventListener("click", () => {
        if (titleInput.style.display !== "none") {
          renderCustomTitleList();
        }
      });
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.closest("#custom-title-list") && !target.closest("#task-title")) {
          const list = document.getElementById("custom-title-list");
          if (list) list.style.display = "none";
        }
      });
    }
    /**
     * 绑定模式切换事件
     */
    bindModeSwitch() {
      const applyMode = (mode) => {
        const titleSelect = document.getElementById("task-title-select");
        const titleInput = document.getElementById("task-title");
        const useCustomBtn = document.getElementById("use-custom-title");
        if (mode === "custom") {
          titleSelect.style.display = "none";
          titleInput.style.display = "block";
          if (useCustomBtn) {
            useCustomBtn.textContent = "选择";
            useCustomBtn.title = "从预设选项中选择";
          }
          this.showCustomTitleUI(true);
        } else {
          titleSelect.style.display = "block";
          titleInput.style.display = "none";
          if (useCustomBtn) {
            useCustomBtn.textContent = "自定义";
            useCustomBtn.title = "使用自定义标题";
          }
          this.showCustomTitleUI(false);
        }
      };
      const modeSwitch = document.getElementById("task-mode-switch");
      modeSwitch == null ? void 0 : modeSwitch.addEventListener("change", () => {
        const mode = modeSwitch.value;
        localStorage.setItem("redmine_task_mode", mode);
        applyMode(mode);
      });
      const savedMode = localStorage.getItem("redmine_task_mode") || "select";
      applyMode(savedMode);
    }
    /**
     * 显示/隐藏自定义标题UI
     */
    showCustomTitleUI(show) {
      const saveBtn = document.getElementById("save-custom-title");
      const titleList = document.getElementById("custom-title-list");
      if (show) {
        if (saveBtn) saveBtn.style.display = "inline-block";
      } else {
        if (saveBtn) saveBtn.style.display = "none";
        if (titleList) titleList.style.display = "none";
      }
    }
    /**
     * 根据任务类型设置默认日期
     */
    setDatesByTaskType(taskType) {
      let startDate = "";
      let endDate = "";
      switch (taskType) {
        case "技术方案设计":
          startDate = this.getThisMonday();
          endDate = this.getThisTuesday();
          break;
        case "技术方案评审":
          startDate = this.getThisTuesday();
          endDate = this.getThisTuesday();
          break;
        case "冒烟自测":
          startDate = this.getNextMonday();
          endDate = this.getNextMonday();
          break;
        case "单元测试":
          startDate = this.getNextTuesday();
          endDate = "";
          break;
        case "fat测试":
          startDate = this.getNextTuesday();
          endDate = this.getNextThursday();
          break;
        case "uat测试":
          startDate = this.getNextFriday();
          endDate = this.getNextFriday();
          break;
        default: {
          const today = /* @__PURE__ */ new Date();
          startDate = this.formatDate(today);
          endDate = "";
          break;
        }
      }
      const startDateInput = document.getElementById("task-start-date");
      const dueDateInput = document.getElementById("task-due-date");
      if (startDateInput) startDateInput.value = startDate;
      if (dueDateInput) dueDateInput.value = endDate;
    }
    /**
     * 获取本周一的日期
     */
    getThisMonday() {
      const today = /* @__PURE__ */ new Date();
      const dayOfWeek = today.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(today);
      monday.setDate(today.getDate() + daysToMonday);
      return this.formatDate(monday);
    }
    /**
     * 获取本周二的日期
     */
    getThisTuesday() {
      const monday = new Date(this.parseDate(this.getThisMonday()));
      monday.setDate(monday.getDate() + 1);
      return this.formatDate(monday);
    }
    /**
     * 获取下周一的日期
     */
    getNextMonday() {
      const thisMonday = new Date(this.parseDate(this.getThisMonday()));
      thisMonday.setDate(thisMonday.getDate() + 7);
      return this.formatDate(thisMonday);
    }
    /**
     * 获取下周二的日期
     */
    getNextTuesday() {
      const thisMonday = new Date(this.parseDate(this.getThisMonday()));
      thisMonday.setDate(thisMonday.getDate() + 8);
      return this.formatDate(thisMonday);
    }
    /**
     * 获取下周四的日期
     */
    getNextThursday() {
      const thisMonday = new Date(this.parseDate(this.getThisMonday()));
      thisMonday.setDate(thisMonday.getDate() + 10);
      return this.formatDate(thisMonday);
    }
    /**
     * 获取下周五的日期
     */
    getNextFriday() {
      const thisMonday = new Date(this.parseDate(this.getThisMonday()));
      thisMonday.setDate(thisMonday.getDate() + 11);
      return this.formatDate(thisMonday);
    }
    /**
     * 格式化日期为 YYYY-MM-DD
     */
    formatDate(date) {
      return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
    }
    /**
     * 解析日期字符串
     */
    parseDate(dateString) {
      const parts = dateString.split("-");
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    /**
     * 添加任务到列表
     */
    addTaskToList() {
      const titleSelect = document.getElementById("task-title-select");
      const titleInput = document.getElementById("task-title");
      const startDateInput = document.getElementById("task-start-date");
      const dueDateInput = document.getElementById("task-due-date");
      const parentIdInput = document.getElementById("task-parent-id");
      let title = titleSelect.value || titleInput.value.trim();
      if (!title) {
        alert("请选择或输入任务标题！");
        return;
      }
      const startDate = startDateInput.value;
      const dueDate = dueDateInput.value;
      const parentId = parentIdInput.value.trim() || this.defaultParentId;
      this.taskList.push({
        title,
        startDate,
        dueDate,
        parentId,
        isParent: true,
        children: [],
        createdId: null
      });
      this.updateTaskList();
      titleSelect.value = "";
      titleInput.value = "";
      const today = /* @__PURE__ */ new Date();
      const todayString = this.formatDate(today);
      startDateInput.value = todayString;
      dueDateInput.value = "";
      parentIdInput.value = "";
      if (titleInput.style.display !== "none") {
        titleInput.focus();
      } else {
        titleSelect.focus();
      }
    }
    /**
     * 更新任务列表显示 - 迁移自原版实现
     */
    updateTaskList() {
      const tbody = document.querySelector("#task-list tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      if (this.taskList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999; padding: 20px;">暂无任务</td></tr>';
        return;
      }
      this.taskList.forEach((task, index) => {
        const parentTr = document.createElement("tr");
        const titleCell = document.createElement("td");
        titleCell.style.padding = "3px";
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.className = "task-title-edit";
        titleInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;";
        titleInput.value = task.title;
        titleInput.addEventListener("change", () => {
          this.taskList[index].title = titleInput.value;
        });
        titleCell.appendChild(titleInput);
        parentTr.appendChild(titleCell);
        const startDateCell = document.createElement("td");
        startDateCell.style.padding = "3px";
        const startDateInput = document.createElement("input");
        startDateInput.type = "date";
        startDateInput.className = "task-start-date-edit";
        startDateInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box; cursor: pointer;";
        startDateInput.value = task.startDate || "";
        startDateInput.addEventListener("change", () => {
          this.taskList[index].startDate = startDateInput.value;
        });
        startDateCell.appendChild(startDateInput);
        parentTr.appendChild(startDateCell);
        const dueDateCell = document.createElement("td");
        dueDateCell.style.padding = "3px";
        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.className = "task-due-date-edit";
        dueDateInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box; cursor: pointer;";
        dueDateInput.value = task.dueDate || "";
        dueDateInput.addEventListener("change", () => {
          this.taskList[index].dueDate = dueDateInput.value;
        });
        dueDateCell.appendChild(dueDateInput);
        parentTr.appendChild(dueDateCell);
        const parentIdCell = document.createElement("td");
        parentIdCell.style.padding = "3px";
        const parentIdInput = document.createElement("input");
        parentIdInput.type = "text";
        parentIdInput.className = "task-parent-id-edit";
        parentIdInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;";
        parentIdInput.placeholder = "父任务ID";
        parentIdInput.value = task.parentId || "";
        parentIdInput.addEventListener("change", () => {
          this.taskList[index].parentId = parentIdInput.value;
        });
        parentIdCell.appendChild(parentIdInput);
        parentTr.appendChild(parentIdCell);
        const actionCell = document.createElement("td");
        actionCell.style.padding = "3px";
        const addChildBtn = document.createElement("button");
        addChildBtn.className = "button";
        addChildBtn.style.cssText = "padding: 2px 8px; font-size: 11px; margin-right: 5px;";
        addChildBtn.title = "添加子任务";
        addChildBtn.textContent = "+子任务";
        addChildBtn.addEventListener("click", () => {
          this.addChildTask(index);
        });
        const deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.style.cssText = "color: #d00; text-decoration: none;";
        deleteLink.title = "删除";
        deleteLink.textContent = "×";
        deleteLink.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("删除父任务:", this.taskList[index].title, "索引:", index);
          this.taskList.splice(index, 1);
          this.updateTaskList();
        });
        actionCell.appendChild(addChildBtn);
        actionCell.appendChild(deleteLink);
        parentTr.appendChild(actionCell);
        tbody.appendChild(parentTr);
        task.children.forEach((childTask, childIndex) => {
          const childTr = document.createElement("tr");
          childTr.style.background = "#f9f9f9";
          const childTitleCell = document.createElement("td");
          childTitleCell.style.cssText = "padding: 3px; padding-left: 20px;";
          const prefix = document.createElement("span");
          prefix.style.cssText = "color: #666; margin-right: 5px;";
          prefix.textContent = "└─";
          const childTitleInput = document.createElement("input");
          childTitleInput.type = "text";
          childTitleInput.className = "child-task-title-edit";
          childTitleInput.style.cssText = "width: calc(100% - 20px); padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;";
          childTitleInput.value = childTask.title;
          childTitleInput.addEventListener("change", () => {
            this.taskList[index].children[childIndex].title = childTitleInput.value;
          });
          childTitleCell.appendChild(prefix);
          childTitleCell.appendChild(childTitleInput);
          childTr.appendChild(childTitleCell);
          const childStartDateCell = document.createElement("td");
          childStartDateCell.style.padding = "3px";
          const childStartDateInput = document.createElement("input");
          childStartDateInput.type = "date";
          childStartDateInput.className = "child-start-date-edit";
          childStartDateInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box; cursor: pointer;";
          childStartDateInput.value = childTask.startDate || "";
          childStartDateInput.addEventListener("change", () => {
            this.taskList[index].children[childIndex].startDate = childStartDateInput.value;
          });
          childStartDateCell.appendChild(childStartDateInput);
          childTr.appendChild(childStartDateCell);
          const childDueDateCell = document.createElement("td");
          childDueDateCell.style.padding = "3px";
          const childDueDateInput = document.createElement("input");
          childDueDateInput.type = "date";
          childDueDateInput.className = "child-due-date-edit";
          childDueDateInput.style.cssText = "width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box; cursor: pointer;";
          childDueDateInput.value = childTask.dueDate || "";
          childDueDateInput.addEventListener("change", () => {
            this.taskList[index].children[childIndex].dueDate = childDueDateInput.value;
          });
          childDueDateCell.appendChild(childDueDateInput);
          childTr.appendChild(childDueDateCell);
          const autoCell = document.createElement("td");
          autoCell.style.cssText = "padding: 3px; text-align: center; color: #999;";
          autoCell.textContent = "自动设置";
          childTr.appendChild(autoCell);
          const childActionCell = document.createElement("td");
          childActionCell.style.padding = "3px";
          const childDeleteLink = document.createElement("a");
          childDeleteLink.href = "#";
          childDeleteLink.style.cssText = "color: #d00; text-decoration: none;";
          childDeleteLink.title = "删除";
          childDeleteLink.textContent = "×";
          childDeleteLink.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("删除子任务:", this.taskList[index].children[childIndex].title, "父任务索引:", index, "子任务索引:", childIndex);
            this.taskList[index].children.splice(childIndex, 1);
            this.updateTaskList();
          });
          childActionCell.appendChild(childDeleteLink);
          childTr.appendChild(childActionCell);
          tbody.appendChild(childTr);
        });
      });
    }
    /**
     * 添加子任务
     */
    addChildTask(parentIndex) {
      const parentTask = this.taskList[parentIndex];
      if (!parentTask) return;
      const existingDialog = document.getElementById("child-task-dialog");
      if (existingDialog) {
        existingDialog.remove();
      }
      const childTaskDialog = document.createElement("div");
      childTaskDialog.id = "child-task-dialog";
      childTaskDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #628DB6;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2000;
      min-width: 400px;
    `;
      childTaskDialog.innerHTML = `
      <h4 style="margin: 0 0 15px 0; color: #628DB6;">为父任务"${parentTask.title}"添加子任务</h4>
      <div style="margin-bottom: 10px;">
        <div style="display: flex; gap: 10px; margin-bottom: 5px;">
          <input type="text" id="child-task-title" placeholder="子任务标题" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
          <button id="save-child-custom-title" style="background: #628DB6; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap;">保存为常用</button>
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <input type="date" id="child-start-date" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        <input type="date" id="child-due-date" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div class="input-container" style="position: relative; margin-bottom: 15px;">
        <div id="child-custom-title-list" style="
          display: none;
          background: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          min-width: 180px;
          max-width: 400px;
          max-height: 200px;
          overflow-y: auto;
          padding: 4px 0;
          z-index: 99999;
        "></div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="add-child-task-btn" style="background: #169F4B; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">添加</button>
        <button id="cancel-child-task" style="background: #d00; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
      </div>
    `;
      const today = /* @__PURE__ */ new Date();
      const todayString = this.formatDate(today);
      document.body.appendChild(childTaskDialog);
      const childStartDate = childTaskDialog.querySelector("#child-start-date");
      if (childStartDate) childStartDate.value = todayString;
      const hideDropdown = (e) => {
        const target = e.target;
        const list = childTaskDialog.querySelector("#child-custom-title-list");
        if (list && !target.closest("#child-custom-title-list") && !target.closest("#child-task-title")) {
          list.style.display = "none";
        }
      };
      const cleanup2 = () => {
        document.removeEventListener("click", hideDropdown);
      };
      const cancelBtn = childTaskDialog.querySelector("#cancel-child-task");
      const addBtn = childTaskDialog.querySelector("#add-child-task-btn");
      const titleInput = childTaskDialog.querySelector("#child-task-title");
      const saveBtn = childTaskDialog.querySelector("#save-child-custom-title");
      cancelBtn == null ? void 0 : cancelBtn.addEventListener("click", () => {
        cleanup2();
        childTaskDialog.remove();
      });
      addBtn == null ? void 0 : addBtn.addEventListener("click", () => {
        this.addChildTaskFromDialog(childTaskDialog, parentIndex);
      });
      titleInput == null ? void 0 : titleInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addChildTaskFromDialog(childTaskDialog, parentIndex);
        }
      });
      saveBtn == null ? void 0 : saveBtn.addEventListener("click", () => {
        const val = titleInput.value.trim();
        if (!val) return;
        let titles = JSON.parse(localStorage.getItem("redmine_custom_titles") || "[]");
        if (!titles.includes(val)) {
          titles.push(val);
          localStorage.setItem("redmine_custom_titles", JSON.stringify(titles));
        }
        titleInput.value = "";
        titleInput.focus();
      });
      titleInput == null ? void 0 : titleInput.addEventListener("focus", () => {
        this.renderChildCustomTitleList(childTaskDialog);
      });
      titleInput == null ? void 0 : titleInput.addEventListener("click", () => {
        this.renderChildCustomTitleList(childTaskDialog);
      });
      document.addEventListener("click", hideDropdown);
      childTaskDialog.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          cleanup2();
          childTaskDialog.remove();
        }
      });
      const originalRemove = childTaskDialog.remove.bind(childTaskDialog);
      childTaskDialog.remove = () => {
        cleanup2();
        originalRemove();
      };
      setTimeout(() => {
        titleInput == null ? void 0 : titleInput.focus();
      }, 100);
    }
    /**
     * 渲染子任务常用标题列表
     */
    renderChildCustomTitleList(dialog) {
      const titles = JSON.parse(localStorage.getItem("redmine_custom_titles") || "[]");
      const input = dialog.querySelector("#child-task-title");
      const list = dialog.querySelector("#child-custom-title-list");
      if (!input || !list) return;
      list.innerHTML = "";
      if (titles.length === 0) {
        list.innerHTML = '<div style="padding: 12px 16px; color: #bbb; text-align: center; font-size: 14px;">暂无常用标题</div>';
        list.style.display = "block";
        return;
      }
      titles.forEach((title) => {
        const item = document.createElement("div");
        item.className = "custom-title-item";
        item.style.cssText = `
        display: flex;
        align-items: center;
        padding: 8px 16px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background 0.2s;
        border: none;
        background: none;
      `;
        item.textContent = title;
        const removeBtn = document.createElement("span");
        removeBtn.className = "custom-title-remove";
        removeBtn.textContent = "×";
        removeBtn.style.cssText = `
        margin-left: auto;
        color: #bbb;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding-left: 8px;
        transition: color 0.2s;
      `;
        item.addEventListener("mouseenter", () => {
          item.style.background = "#e6f7ff";
        });
        item.addEventListener("mouseleave", () => {
          item.style.background = "none";
        });
        removeBtn.addEventListener("mouseenter", () => {
          removeBtn.style.color = "#f5222d";
        });
        removeBtn.addEventListener("mouseleave", () => {
          removeBtn.style.color = "#bbb";
        });
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const newTitles = JSON.parse(localStorage.getItem("redmine_custom_titles") || "[]").filter((t) => t !== title);
          localStorage.setItem("redmine_custom_titles", JSON.stringify(newTitles));
          this.renderChildCustomTitleList(dialog);
        });
        item.addEventListener("click", () => {
          input.value = title;
          input.focus();
          list.style.display = "none";
        });
        item.appendChild(removeBtn);
        list.appendChild(item);
      });
      list.style.display = "block";
    }
    /**
     * 从对话框添加子任务
     */
    addChildTaskFromDialog(dialog, parentIndex) {
      const titleInput = dialog.querySelector("#child-task-title");
      const startDateInput = dialog.querySelector("#child-start-date");
      const dueDateInput = dialog.querySelector("#child-due-date");
      const childTitle = titleInput.value.trim();
      const childStartDate = startDateInput.value;
      const childDueDate = dueDateInput.value;
      if (!childTitle) {
        alert("请输入子任务标题！");
        return;
      }
      this.taskList[parentIndex].children.push({
        title: childTitle,
        startDate: childStartDate,
        dueDate: childDueDate,
        parentId: "",
        isParent: false,
        children: []
      });
      this.updateTaskList();
      titleInput.value = "";
      dueDateInput.value = "";
      const today = /* @__PURE__ */ new Date();
      const todayString = this.formatDate(today);
      startDateInput.value = todayString;
      setTimeout(() => {
        titleInput.focus();
      }, 100);
    }
    /**
     * 创建所有任务
     */
    async createAllTasks() {
      if (this.taskList.length === 0) {
        alert("请至少添加一个任务！");
        return;
      }
      console.log("开始创建任务，任务列表:", this.taskList);
      const createBtn = document.getElementById("create-batch-tasks");
      const progressContainer = document.getElementById("task-progress");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");
      if (!createBtn || !progressContainer || !progressBar || !progressText) {
        console.error("找不到必要的UI元素");
        return;
      }
      progressContainer.style.display = "block";
      createBtn.disabled = true;
      createBtn.textContent = "正在创建...";
      const totalTasks = this.getTotalTaskCount();
      console.log(`开始创建任务，总计: ${totalTasks}个`);
      try {
        this.taskManager.clearTaskList();
        this.taskList.forEach((task) => {
          this.taskManager.addTask({
            title: task.title,
            startDate: task.startDate,
            dueDate: task.dueDate,
            parentId: task.parentId,
            isParent: task.isParent,
            children: task.children
          });
        });
        const result = await this.taskManager.createAllTasks((completed, total, current) => {
          const percentage = Math.round(completed / total * 100);
          progressBar.style.width = `${percentage}%`;
          progressText.textContent = `${current} (${completed}/${total})`;
        });
        const message = `任务创建完成！
成功: ${result.success}个
失败: ${result.failed}个`;
        if (confirm(message + "\n是否刷新页面查看最新状态？")) {
          window.location.reload();
        }
        this.taskList = [];
        this.updateTaskList();
      } catch (error) {
        console.error("批量创建任务失败:", error);
        alert(`创建任务失败: ${error instanceof Error ? error.message : "未知错误"}`);
      } finally {
        progressContainer.style.display = "none";
        createBtn.disabled = false;
        createBtn.textContent = "创建所有任务";
      }
    }
    /**
     * 获取总任务数量
     */
    getTotalTaskCount() {
      let total = this.taskList.length;
      this.taskList.forEach((task) => {
        total += task.children.length;
      });
      return total;
    }
    /**
     * 检查是否可见
     */
    isShowing() {
      return this.isVisible;
    }
    /**
     * 切换显示状态
     */
    toggle() {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }
    /**
     * 销毁创建器
     */
    destroy() {
      if (this.container) {
        this.container.remove();
        this.container = null;
      }
      if (this.toggleButton) {
        this.toggleButton.remove();
        this.toggleButton = null;
      }
      this.isVisible = false;
      this.taskList = [];
      console.log("批量任务创建器已销毁");
    }
    // 以下方法保留兼容性，但使用新的内部实现
  }
  class UnifiedTaskManager {
    constructor(apiClient, currentUserId) {
      this.allTasksData = [];
      this.taskHierarchy = /* @__PURE__ */ new Map();
      this.projectMembers = [];
      this.currentUserId = "";
      this.assigneeFilterUserId = "";
      this.collapsedTaskIds = /* @__PURE__ */ new Set();
      this.checkboxStates = /* @__PURE__ */ new Map();
      this.isBatchMode = false;
      this.batchTargetStatus = "";
      this.collapseStorageKey = "redmine_collapsed_tasks";
      this.filterStorageKey = "redmine_my_task_filter";
      this.controlPanelId = "issue-tree-controls";
      this.apiClient = apiClient;
      if (currentUserId) {
        this.currentUserId = currentUserId;
        this.assigneeFilterUserId = currentUserId;
      }
    }
    /**
     * 初始化任务管理器
     */
    async init() {
      try {
        console.log("=== 初始化统一任务管理器 ===");
        if (!this.currentUserId) {
          await this.initCurrentUser();
        }
        await this.loadAllTasksData();
        this.buildTaskHierarchy();
        this.extractProjectMembers();
        this.restoreStates();
        this.initUI();
        this.initCheckboxes();
        console.log("✓ 统一任务管理器初始化完成");
      } catch (error) {
        console.error("统一任务管理器初始化失败:", error);
      }
    }
    /**
     * 获取当前用户信息
     */
    async initCurrentUser() {
      try {
        const loggedAsLink = document.querySelector("#loggedas a");
        if (loggedAsLink) {
          const href = loggedAsLink.href;
          const userIdMatch = href.match(/\/users\/(\d+)$/);
          if (userIdMatch) {
            this.currentUserId = userIdMatch[1];
            this.assigneeFilterUserId = this.currentUserId;
            console.log("当前用户ID:", this.currentUserId);
          }
        }
      } catch (error) {
        console.error("获取当前用户信息失败:", error);
      }
    }
    /**
     * 通过REST API加载所有任务数据
     */
    async loadAllTasksData() {
      try {
        const currentIssueId = this.getCurrentIssueId();
        if (!currentIssueId) {
          console.error("无法获取当前任务ID");
          return false;
        }
        console.log(`通过REST API获取任务 ${currentIssueId} 的数据...`);
        const response = await this.apiClient.getIssue(currentIssueId, {
          include: "children,relations,assigned_to"
        });
        if (response.issue) {
          const currentTask = this.convertIssueToTaskData(response.issue);
          this.allTasksData = [currentTask];
          if (response.issue.children) {
            this.processChildren(response.issue.children, currentTask.id);
          }
          this.supplementTaskDataFromDOM();
          console.log("任务数据加载完成:", this.allTasksData.length, "个任务");
          return true;
        }
        return false;
      } catch (error) {
        console.error("加载任务数据失败:", error);
        return false;
      }
    }
    /**
     * 获取当前任务ID
     */
    getCurrentIssueId() {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/issues\/(\d+)/);
      return match ? match[1] : "";
    }
    /**
     * 递归处理子任务
     */
    processChildren(children, parentId) {
      children.forEach((child) => {
        const childTask = this.convertIssueToTaskData(child, parentId);
        this.allTasksData.push(childTask);
        if (child.children) {
          this.processChildren(child.children, childTask.id);
        }
      });
    }
    /**
     * 将API返回的issue数据转换为TaskData格式
     */
    convertIssueToTaskData(issue, parentId) {
      var _a, _b, _c, _d, _e, _f;
      return {
        id: issue.id,
        subject: issue.subject || "",
        assigned_to_id: (_a = issue.assigned_to) == null ? void 0 : _a.id,
        assigned_to_name: (_b = issue.assigned_to) == null ? void 0 : _b.name,
        parent: parentId,
        status_id: ((_c = issue.status) == null ? void 0 : _c.id) || 1,
        status_name: ((_d = issue.status) == null ? void 0 : _d.name) || "",
        tracker_id: ((_e = issue.tracker) == null ? void 0 : _e.id) || 1,
        tracker_name: ((_f = issue.tracker) == null ? void 0 : _f.name) || "",
        start_date: issue.start_date,
        due_date: issue.due_date,
        done_ratio: issue.done_ratio || 0,
        description: issue.description || ""
      };
    }
    /**
     * 从DOM补充任务数据
     */
    supplementTaskDataFromDOM() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const rows = issueTree.querySelectorAll("tr.issue");
      rows.forEach((row) => {
        var _a, _b;
        const taskId = this.getTaskIdFromRow(row);
        if (taskId) {
          const task = this.allTasksData.find((t) => t.id === taskId);
          if (task) {
            const assignedCell = row.querySelector("td.assigned_to");
            if (assignedCell && ((_a = assignedCell.textContent) == null ? void 0 : _a.trim())) {
              const assignedText = assignedCell.textContent.trim();
              if (!task.assigned_to_name && assignedText !== "-") {
                task.assigned_to_name = assignedText;
                const assignedLink = assignedCell.querySelector("a");
                if (assignedLink) {
                  const href = assignedLink.getAttribute("href");
                  const userIdMatch = href == null ? void 0 : href.match(/\/users\/(\d+)/);
                  if (userIdMatch) {
                    task.assigned_to_id = parseInt(userIdMatch[1]);
                  }
                }
              }
            }
            const statusCell = row.querySelector("td.status");
            if (statusCell && ((_b = statusCell.textContent) == null ? void 0 : _b.trim())) {
              const statusText = statusCell.textContent.trim();
              if (!task.status_name && statusText !== "-") {
                task.status_name = statusText;
                task.status_id = this.getStatusIdByName(statusText);
              }
            }
          }
        }
      });
    }
    /**
     * 根据状态名称获取状态ID
     */
    getStatusIdByName(statusName) {
      const statusMap = {
        "新建": 1,
        "进行中": 2,
        "已实施[完成]": 5,
        "已实施": 5,
        "完成": 5,
        "已完成": 5
      };
      return statusMap[statusName] || 1;
    }
    /**
     * 构建任务层级关系
     */
    buildTaskHierarchy() {
      this.taskHierarchy.clear();
      console.log("开始构建任务层级关系...");
      this.allTasksData.forEach((task) => {
        if (task.parent) {
          if (!this.taskHierarchy.has(task.parent)) {
            this.taskHierarchy.set(task.parent, []);
          }
          this.taskHierarchy.get(task.parent).push(task);
        }
      });
      console.log("任务层级关系构建完成:", this.taskHierarchy);
      this.taskHierarchy.forEach((children, parentId) => {
        console.log(`父任务 ${parentId} 有 ${children.length} 个子任务:`, children.map((c2) => c2.id));
      });
    }
    /**
     * 从任务数据中提取项目成员
     */
    extractProjectMembers() {
      const members = /* @__PURE__ */ new Map();
      this.allTasksData.forEach((task) => {
        if (task.assigned_to_id && task.assigned_to_name) {
          const userId = task.assigned_to_id.toString();
          if (!members.has(userId)) {
            members.set(userId, {
              id: userId,
              name: task.assigned_to_name
            });
          }
        }
      });
      this.projectMembers = Array.from(members.values()).sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
      console.log("提取到项目成员:", this.projectMembers);
    }
    /**
     * 恢复各种状态
     */
    restoreStates() {
      this.restoreCollapseState();
      this.restoreCheckboxStates();
    }
    /**
     * 恢复折叠状态
     */
    restoreCollapseState() {
      try {
        const saved = localStorage.getItem(this.collapseStorageKey);
        if (saved) {
          const collapsedArray = JSON.parse(saved);
          this.collapsedTaskIds = new Set(collapsedArray);
          console.log("恢复折叠状态:", this.collapsedTaskIds);
        }
      } catch (error) {
        console.error("恢复折叠状态失败:", error);
        this.collapsedTaskIds = /* @__PURE__ */ new Set();
      }
    }
    /**
     * 恢复复选框状态（修复版本，避免干扰系统处理）
     */
    restoreCheckboxStates() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      let restoredCount = 0;
      this.checkboxStates.forEach((checked, taskId) => {
        const checkbox = issueTree.querySelector(`input[name="ids[]"][value="${taskId}"]`);
        if (checkbox && !checkbox.disabled && checkbox.style.display !== "none") {
          if (checkbox.checked !== checked) {
            checkbox.checked = checked;
            restoredCount++;
            console.log(`恢复任务 ${taskId} 复选框状态为: ${checked}`);
          }
        }
      });
      if (restoredCount > 0) {
        console.log(`恢复了 ${restoredCount} 个复选框状态`);
        this.updateSelectedTasksCount();
      }
    }
    /**
     * 保存当前复选框状态（修复版本，只保存可见的复选框）
     */
    saveCheckboxStates() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      this.checkboxStates.clear();
      let checkedCount = 0;
      const checkedIds = [];
      issueTree.querySelectorAll('input[name="ids[]"]').forEach((checkbox) => {
        const input = checkbox;
        const taskId = input.value;
        if (taskId && input.style.display !== "none" && !input.disabled) {
          const isChecked = input.checked;
          this.checkboxStates.set(taskId, isChecked);
          if (isChecked) {
            checkedCount++;
            checkedIds.push(taskId);
          }
        }
      });
      console.log(`保存了复选框状态，选中 ${checkedCount} 个任务:`, checkedIds);
    }
    /**
     * 初始化UI
     */
    initUI() {
      if (document.querySelector(`#${this.controlPanelId}`)) {
        console.log("任务管理控制面板已存在，跳过重复初始化");
        return;
      }
      this.createControlPanel();
      this.bindEvents();
      this.initializeUIState();
    }
    /**
     * 创建控制面板
     */
    createControlPanel() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const controlPanel = this.createControlPanelHTML();
      issueTree.insertAdjacentHTML("afterbegin", controlPanel);
    }
    /**
     * 创建控制面板HTML
     */
    createControlPanelHTML() {
      return `
      <div id="${this.controlPanelId}" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 3px; border: 1px solid #ddd;">
        <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; cursor: pointer; margin: 0;">
            <input type="checkbox" id="task-filter-switch" style="margin-right: 8px;">
            <span>我的任务</span>
          </label>
          <div style="display: flex;">
            <button id="collapse-all-btn" class="button" style="font-size: 12px; padding: 4px 8px;">一键折叠</button>
            <button id="expand-all-btn" class="button" style="font-size: 12px; padding: 4px 8px;">一键展开</button>
            <button id="scroll-today-task-btn" class="button" style="font-size: 12px; padding: 4px 8px; display: none; background: #ffe066; color: #333;margin-left: 4px;">定位到今天的任务</button>
          </div>
          <div id="task-filter-switch-other" style="display: none; align-items: center; margin-left: -15px;">
            <select id="assignee-filter-select" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px;>
              <option value="">加载中...</option>
            </select>
          </div>
        </div>

        <!-- 批量变更任务状态功能 -->
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <span style="font-size: 12px; color: #666;">批量变更状态:</span>
            <select id="batch-status-select" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px;">
              <option value="">请选择目标状态</option>
              <option value="2">进行中</option>
              <option value="5">已实施[完成]</option>
            </select>
            <button id="batch-update-status-btn" class="button" style="font-size: 12px; padding: 4px 8px;" disabled>批量更新</button>
            <button id="cancel-batch-mode-btn" class="button" style="font-size: 12px; padding: 4px 8px; display: none; background: #f44336; color: white;">取消</button>
            <span id="selected-tasks-count" style="font-size: 12px; color: #666;">请选择要操作的任务</span>
          </div>
          <div id="batch-mode-notice" style="display: none; margin-top: 8px; padding: 8px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 3px; font-size: 12px; color: #856404;">
            <strong>批量状态变更模式</strong> - 页面其他功能已禁用，请选择要更新的任务后点击"批量更新"按钮，或点击"取消"退出此模式。
          </div>
        </div>

        <!-- 日期显示模式切换 -->
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-size: 12px; color: #666;">日期显示规则:</span>
          <select id="date-display-mode" style="padding: 2px; font-size: 12px;">
            <option value="date">日期</option>
            <option value="week">周几</option>
          </select>
        </div>
      </div>
    `;
    }
    /**
     * 绑定事件
     */
    bindEvents() {
      const filterSwitch = document.querySelector("#task-filter-switch");
      if (filterSwitch) {
        filterSwitch.addEventListener("change", (e) => {
          const target = e.target;
          if (target.checked) {
            localStorage.setItem(this.filterStorageKey, "1");
            this.applyTaskFilter();
          } else {
            localStorage.setItem(this.filterStorageKey, "0");
            this.showAllTasks();
          }
          this.updateTodayTaskButtonVisibility();
        });
      }
      const assigneeSelect = document.querySelector("#assignee-filter-select");
      if (assigneeSelect) {
        assigneeSelect.addEventListener("change", (e) => {
          const target = e.target;
          const userId = target.value.trim();
          this.assigneeFilterUserId = userId || this.currentUserId;
          console.log("切换筛选用户:", userId, "当前用户:", this.currentUserId);
          this.checkboxStates.clear();
          this.updateCheckboxVisibility();
          if (filterSwitch == null ? void 0 : filterSwitch.checked) {
            this.applyTaskFilter();
          }
          this.updateSelectedTasksCount();
          this.updateTodayTaskButtonVisibility();
        });
      }
      const collapseAllBtn = document.querySelector("#collapse-all-btn");
      if (collapseAllBtn) {
        collapseAllBtn.addEventListener("click", () => {
          this.collapseAllTasks();
        });
      }
      const expandAllBtn = document.querySelector("#expand-all-btn");
      if (expandAllBtn) {
        expandAllBtn.addEventListener("click", () => {
          this.expandAllTasks();
        });
      }
      const scrollTodayBtn = document.querySelector("#scroll-today-task-btn");
      if (scrollTodayBtn) {
        scrollTodayBtn.addEventListener("click", () => {
          this.scrollToTodayTask();
        });
      }
      const batchUpdateBtn = document.querySelector("#batch-update-status-btn");
      if (batchUpdateBtn) {
        batchUpdateBtn.addEventListener("click", () => {
          this.batchUpdateTaskStatus();
        });
      }
      const statusSelect = document.querySelector("#batch-status-select");
      if (statusSelect) {
        statusSelect.addEventListener("change", (e) => {
          const target = e.target;
          const selectedStatus = target.value;
          console.log("状态下拉框值改变:", selectedStatus);
          if (selectedStatus) {
            this.enterBatchMode(selectedStatus);
          } else {
            this.exitBatchMode();
          }
        });
      }
      const cancelBatchBtn = document.querySelector("#cancel-batch-mode-btn");
      if (cancelBatchBtn) {
        cancelBatchBtn.addEventListener("click", () => {
          this.exitBatchMode();
        });
      }
      const dateDisplayMode = document.querySelector("#date-display-mode");
      if (dateDisplayMode) {
        dateDisplayMode.addEventListener("change", (e) => {
          const target = e.target;
          const mode = target.value;
          localStorage.setItem("redmine_date_display_mode", mode);
          this.updateDateDisplay(mode);
        });
      }
    }
    /**
     * 初始化UI状态
     */
    initializeUIState() {
      const isFilterEnabled = localStorage.getItem(this.filterStorageKey) === "1";
      const filterSwitch = document.querySelector("#task-filter-switch");
      if (filterSwitch) {
        filterSwitch.checked = isFilterEnabled;
      }
      this.loadAndPopulateAssigneeFilter();
      setTimeout(() => {
        if (isFilterEnabled) {
          console.log("恢复筛选状态，应用任务筛选");
          this.applyTaskFilter();
        }
        this.updateTodayTaskButtonVisibility();
      }, 100);
      const savedMode = localStorage.getItem("redmine_date_display_mode") || "date";
      const dateDisplayMode = document.querySelector("#date-display-mode");
      if (dateDisplayMode) {
        dateDisplayMode.value = savedMode;
        this.updateDateDisplay(savedMode);
      }
    }
    /**
     * 加载并填充"当前项目相关人员"下拉框
     */
    loadAndPopulateAssigneeFilter() {
      const assigneeSelect = document.querySelector("#assignee-filter-select");
      if (!assigneeSelect) return;
      assigneeSelect.innerHTML = "";
      const myOption = document.createElement("option");
      myOption.value = this.currentUserId;
      myOption.textContent = "我自己";
      assigneeSelect.appendChild(myOption);
      if (this.projectMembers && this.projectMembers.length > 0) {
        this.projectMembers.forEach((member) => {
          if (member.id === this.currentUserId) return;
          const option = document.createElement("option");
          option.value = member.id;
          option.textContent = member.name;
          assigneeSelect.appendChild(option);
        });
      } else {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.disabled = true;
        emptyOption.textContent = "（无任务相关人员）";
        assigneeSelect.appendChild(emptyOption);
      }
      assigneeSelect.value = this.currentUserId;
      console.log(`从任务中提取到 ${this.projectMembers.length} 个相关人员`);
    }
    /**
     * 筛选我的任务
     */
    filterMyTasks() {
      const targetUserId = this.getActiveFilterUserId();
      if (!targetUserId) {
        console.error("未找到目标用户ID，无法筛选任务");
        return [];
      }
      console.log("开始筛选我的任务，目标用户ID:", targetUserId);
      const visibleTaskIds = [];
      const myTasks = this.allTasksData.filter(
        (task) => task.assigned_to_id && task.assigned_to_id.toString() === targetUserId
      );
      console.log(`找到 ${myTasks.length} 个我的任务:`, myTasks.map((t) => t.id));
      myTasks.forEach((task) => {
        visibleTaskIds.push(task.id.toString());
      });
      myTasks.forEach((task) => {
        this.addParentTasks(task, visibleTaskIds);
      });
      const currentIssueId = this.getCurrentIssueId();
      if (currentIssueId && this.hasMyTasksInSubtree(parseInt(currentIssueId))) {
        if (!visibleTaskIds.includes(currentIssueId)) {
          visibleTaskIds.push(currentIssueId);
        }
      }
      console.log("筛选结果，可见任务ID:", visibleTaskIds);
      return visibleTaskIds;
    }
    /**
     * 递归添加父任务
     */
    addParentTasks(task, visibleTaskIds) {
      if (task.parent) {
        const parentId = task.parent.toString();
        if (!visibleTaskIds.includes(parentId)) {
          visibleTaskIds.push(parentId);
          const parentTask = this.allTasksData.find((t) => t.id === task.parent);
          if (parentTask) {
            this.addParentTasks(parentTask, visibleTaskIds);
          }
        }
      }
    }
    /**
     * 检查任务树中是否包含我的任务
     */
    hasMyTasksInSubtree(taskId) {
      const myUserId = this.getActiveFilterUserId();
      const task = this.allTasksData.find((t) => t.id === taskId);
      if (task && task.assigned_to_id && task.assigned_to_id.toString() === myUserId) {
        return true;
      }
      const children = this.taskHierarchy.get(taskId) || [];
      for (const child of children) {
        if (child.assigned_to_id && child.assigned_to_id.toString() === myUserId) {
          return true;
        }
        if (this.hasMyTasksInSubtree(child.id)) {
          return true;
        }
      }
      return false;
    }
    /**
     * 获取当前筛选所用的用户ID
     */
    getActiveFilterUserId() {
      return this.assigneeFilterUserId || this.currentUserId || "";
    }
    /**
     * 应用任务筛选
     */
    applyTaskFilter() {
      console.log("开始应用任务筛选...");
      const visibleTaskIds = this.filterMyTasks();
      this.applyFilterToDOM(visibleTaskIds);
      localStorage.setItem(this.filterStorageKey, "1");
    }
    /**
     * 显示所有任务
     */
    showAllTasks() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.querySelectorAll("tr.issue").forEach((row) => {
        row.style.display = "";
      });
      this.applyCollapseStateToDOM();
      localStorage.setItem(this.filterStorageKey, "0");
    }
    /**
     * 应用筛选到DOM
     */
    applyFilterToDOM(visibleTaskIds) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      console.log("应用筛选到DOM，可见任务:", visibleTaskIds);
      issueTree.querySelectorAll("tr.issue").forEach((row) => {
        row.style.display = "none";
      });
      visibleTaskIds.forEach((taskId) => {
        const row = issueTree.querySelector(`tr.issue[data-task-id="${taskId}"], tr.issue.issue-${taskId}`);
        if (row) {
          row.style.display = "";
        }
      });
      this.applyCollapseStateWithFilter(visibleTaskIds);
      setTimeout(() => {
        issueTree.querySelectorAll('tr.issue:not([style*="display: none"])[data-has-children="true"]').forEach((row) => {
          const taskId = this.getTaskIdFromRow(row);
          const collapseBtn = row.querySelector(".collapse-btn");
          if (taskId && collapseBtn) {
            const isCollapsed = this.collapsedTaskIds.has(taskId);
            collapseBtn.textContent = isCollapsed ? "+" : "-";
            collapseBtn.title = isCollapsed ? "展开子任务" : "折叠子任务";
          }
        });
      }, 50);
    }
    /**
     * 在筛选状态下应用折叠状态
     */
    applyCollapseStateWithFilter(visibleTaskIds) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      console.log("在筛选状态下应用折叠状态");
      issueTree.querySelectorAll('tr.issue:not([style*="display: none"])[data-has-children="true"]').forEach((row) => {
        const taskId = this.getTaskIdFromRow(row);
        if (taskId) {
          const isCollapsed = this.collapsedTaskIds.has(taskId);
          if (isCollapsed) {
            this.collapseChildrenInFilter(taskId, visibleTaskIds);
          } else {
            this.expandChildrenInFilter(taskId, visibleTaskIds);
          }
        }
      });
    }
    /**
     * 在筛选状态下折叠子任务
     */
    collapseChildrenInFilter(parentTaskId, visibleTaskIds) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const children = this.taskHierarchy.get(parentTaskId) || [];
      children.forEach((child) => {
        const childRow = issueTree.querySelector(`tr.issue[data-task-id="${child.id}"], tr.issue.issue-${child.id}`);
        if (childRow) {
          childRow.style.display = "none";
          if (this.taskHierarchy.has(child.id)) {
            this.collapseChildrenInFilter(child.id, visibleTaskIds);
          }
        }
      });
    }
    /**
     * 在筛选状态下展开子任务
     */
    expandChildrenInFilter(parentTaskId, visibleTaskIds) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const children = this.taskHierarchy.get(parentTaskId) || [];
      children.forEach((child) => {
        const childRow = issueTree.querySelector(`tr.issue[data-task-id="${child.id}"], tr.issue.issue-${child.id}`);
        if (childRow) {
          if (visibleTaskIds.includes(child.id.toString())) {
            childRow.style.display = "";
            if (this.taskHierarchy.has(child.id)) {
              const isChildCollapsed = this.collapsedTaskIds.has(child.id);
              if (!isChildCollapsed) {
                this.expandChildrenInFilter(child.id, visibleTaskIds);
              } else {
                this.collapseChildrenInFilter(child.id, visibleTaskIds);
              }
            }
          } else {
            childRow.style.display = "none";
          }
        }
      });
    }
    /**
     * 更新今天任务按钮和用户选择下拉框的显示状态
     */
    updateTodayTaskButtonVisibility() {
      const scrollTodayBtn = document.querySelector("#scroll-today-task-btn");
      const taskFilterSwitchOther = document.querySelector("#task-filter-switch-other");
      const isFilterEnabled = localStorage.getItem(this.filterStorageKey) === "1";
      if (isFilterEnabled) {
        if (taskFilterSwitchOther) {
          taskFilterSwitchOther.style.display = "flex";
        }
        if (scrollTodayBtn) {
          scrollTodayBtn.style.display = "inline-block";
        }
      } else {
        if (taskFilterSwitchOther) {
          taskFilterSwitchOther.style.display = "none";
        }
        if (scrollTodayBtn) {
          scrollTodayBtn.style.display = "none";
        }
      }
    }
    /**
     * 初始化复选框功能
     */
    initCheckboxes() {
      this.addCollapseButtonsToExistingTasks();
      this.setupCheckboxBehavior();
      this.applyCollapseStateToDOM();
    }
    /**
     * 为现有任务添加折叠按钮
     */
    addCollapseButtonsToExistingTasks() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.querySelectorAll("tr.issue").forEach((row) => {
        const taskId = this.getTaskIdFromRow(row);
        if (taskId) {
          if (this.taskHierarchy.has(taskId)) {
            this.addCollapseButtonToRow(row, taskId);
            row.setAttribute("data-has-children", "true");
            row.classList.add("has-children", "parent");
          } else {
            this.addCollapsePlaceholderToRow(row);
            row.setAttribute("data-has-children", "false");
          }
        }
      });
    }
    /**
     * 从行元素获取任务ID
     */
    getTaskIdFromRow(row) {
      const dataTaskId = row.getAttribute("data-task-id");
      if (dataTaskId) {
        return parseInt(dataTaskId);
      }
      const classes = row.className.split(" ");
      for (const cls of classes) {
        if (cls.startsWith("issue-")) {
          const id = cls.replace("issue-", "");
          if (/^\d+$/.test(id)) {
            return parseInt(id);
          }
        }
      }
      return null;
    }
    /**
     * 为单个行添加折叠按钮
     */
    addCollapseButtonToRow(row, taskId) {
      if (row.querySelector(".collapse-btn")) return;
      const isCollapsed = this.collapsedTaskIds.has(taskId);
      const subjectCell = row.querySelector("td.subject");
      if (!subjectCell) return;
      const collapseBtn = document.createElement("span");
      collapseBtn.className = "collapse-btn";
      collapseBtn.textContent = isCollapsed ? "+" : "-";
      collapseBtn.title = isCollapsed ? "展开子任务" : "折叠子任务";
      collapseBtn.style.cssText = `
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      cursor: pointer;
      margin-right: 5px;
      font-size: 12px;
      font-weight: bold;
      color: #666;
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 2px;
      user-select: none;
      vertical-align: middle;
    `;
      collapseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleCollapseByDOM(row, taskId);
      });
      collapseBtn.addEventListener("mouseenter", () => {
        collapseBtn.style.background = "#e0e0e0";
      });
      collapseBtn.addEventListener("mouseleave", () => {
        collapseBtn.style.background = "#f0f0f0";
      });
      const subjectLink = subjectCell.querySelector("a");
      if (subjectLink) {
        subjectCell.insertBefore(collapseBtn, subjectLink);
      } else {
        subjectCell.insertBefore(collapseBtn, subjectCell.firstChild);
      }
    }
    /**
     * 为单个行添加折叠按钮占位符
     */
    addCollapsePlaceholderToRow(row) {
      if (row.querySelector(".collapse-placeholder")) return;
      const subjectCell = row.querySelector("td.subject");
      if (!subjectCell) return;
      const placeholder = document.createElement("span");
      placeholder.className = "collapse-placeholder";
      placeholder.style.cssText = `
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      vertical-align: middle;
    `;
      const subjectLink = subjectCell.querySelector("a");
      if (subjectLink) {
        subjectCell.insertBefore(placeholder, subjectLink);
      } else {
        subjectCell.insertBefore(placeholder, subjectCell.firstChild);
      }
    }
    /**
     * 切换折叠状态
     */
    toggleCollapseByDOM(row, taskId) {
      const isCollapsed = this.collapsedTaskIds.has(taskId);
      const collapseBtn = row.querySelector(".collapse-btn");
      const isFilterEnabled = localStorage.getItem(this.filterStorageKey) === "1";
      console.log(`切换任务 ${taskId} 的折叠状态，当前状态: ${isCollapsed ? "折叠" : "展开"}，筛选状态: ${isFilterEnabled}`);
      if (isCollapsed) {
        if (isFilterEnabled) {
          this.expandChildrenWithFilter(row, taskId);
        } else {
          this.expandChildrenByDOM(row, taskId);
        }
        collapseBtn.textContent = "-";
        collapseBtn.title = "折叠子任务";
        this.collapsedTaskIds.delete(taskId);
      } else {
        this.collapseChildrenByDOM(row, taskId);
        collapseBtn.textContent = "+";
        collapseBtn.title = "展开子任务";
        this.collapsedTaskIds.add(taskId);
      }
      this.saveCollapseState();
    }
    /**
     * 展开子任务（普通模式）
     */
    expandChildrenByDOM(_parentRow, parentTaskId) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const children = this.taskHierarchy.get(parentTaskId) || [];
      console.log(`展开任务 ${parentTaskId} 的子任务`);
      children.forEach((child) => {
        const childRow = issueTree.querySelector(`tr.issue[data-task-id="${child.id}"], tr.issue.issue-${child.id}`);
        if (childRow) {
          childRow.style.display = "";
          if (!this.collapsedTaskIds.has(child.id) && this.taskHierarchy.has(child.id)) {
            this.expandChildrenByDOM(childRow, child.id);
          }
        }
      });
    }
    /**
     * 在筛选状态下有选择性地展开子任务
     */
    expandChildrenWithFilter(_parentRow, parentTaskId) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const children = this.taskHierarchy.get(parentTaskId) || [];
      console.log(`筛选状态下展开任务 ${parentTaskId} 的子任务`);
      children.forEach((child) => {
        const childRow = issueTree.querySelector(`tr.issue[data-task-id="${child.id}"], tr.issue.issue-${child.id}`);
        if (childRow) {
          const shouldShow = this.shouldShowTaskInFilter(child.id);
          console.log(`检查子任务 ${child.id}，应该显示: ${shouldShow}`);
          if (shouldShow) {
            childRow.style.display = "";
            console.log(`显示子任务 ${child.id}`);
            if (this.taskHierarchy.has(child.id)) {
              const isChildCollapsed = this.collapsedTaskIds.has(child.id);
              console.log(`子任务 ${child.id} 的折叠状态: ${isChildCollapsed ? "折叠" : "展开"}`);
              if (!isChildCollapsed) {
                this.expandChildrenWithFilter(childRow, child.id);
              }
            }
          } else {
            childRow.style.display = "none";
            console.log(`隐藏子任务 ${child.id}`);
          }
        }
      });
    }
    /**
     * 折叠子任务
     */
    collapseChildrenByDOM(_parentRow, parentTaskId) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const children = this.taskHierarchy.get(parentTaskId) || [];
      children.forEach((child) => {
        const childRow = issueTree.querySelector(`tr.issue[data-task-id="${child.id}"], tr.issue.issue-${child.id}`);
        if (childRow) {
          childRow.style.display = "none";
          if (this.taskHierarchy.has(child.id)) {
            this.collapseChildrenByDOM(childRow, child.id);
          }
        }
      });
    }
    /**
     * 检查任务在筛选状态下是否应该显示
     */
    shouldShowTaskInFilter(taskId) {
      const myUserId = this.getActiveFilterUserId();
      const task = this.allTasksData.find((t) => t.id === taskId);
      if (task && task.assigned_to_id && task.assigned_to_id.toString() === myUserId) {
        console.log(`任务 ${taskId} 是我的任务，指派给: ${task.assigned_to_id}`);
        return true;
      }
      const myTasks = this.allTasksData.filter(
        (t) => t.assigned_to_id && t.assigned_to_id.toString() === myUserId
      );
      for (const myTask of myTasks) {
        const parents = this.getAllParents(myTask.id);
        if (parents.some((parent2) => parent2.id === taskId)) {
          console.log(`任务 ${taskId} 是我的任务 ${myTask.id} 的父任务`);
          return true;
        }
      }
      const currentIssueId = this.getCurrentIssueId();
      if (currentIssueId && taskId === parseInt(currentIssueId)) {
        console.log(`任务 ${taskId} 是当前任务`);
        return true;
      }
      if (task) {
        console.log(`任务 ${taskId} 不应该在筛选中显示，指派给: ${task.assigned_to_id || "无人"}`);
      } else {
        console.log(`任务 ${taskId} 不在任务数据中`);
      }
      return false;
    }
    /**
     * 获取任务的所有父任务
     */
    getAllParents(taskId) {
      const parents = [];
      const task = this.allTasksData.find((t) => t.id === taskId);
      if (task && task.parent) {
        const parentTask = this.allTasksData.find((t) => t.id === task.parent);
        if (parentTask) {
          parents.push(parentTask);
          parents.push(...this.getAllParents(parentTask.id));
        }
      }
      return parents;
    }
    /**
     * 获取任务的所有子任务
     */
    getAllChildren(taskId, recursive = false) {
      const children = [];
      const directChildren = this.taskHierarchy.get(taskId) || [];
      children.push(...directChildren);
      if (recursive) {
        directChildren.forEach((child) => {
          children.push(...this.getAllChildren(child.id, true));
        });
      }
      return children;
    }
    /**
     * 一键折叠所有任务
     */
    collapseAllTasks() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const isFilterEnabled = localStorage.getItem(this.filterStorageKey) === "1";
      console.log("一键折叠所有任务，筛选状态:", isFilterEnabled);
      issueTree.querySelectorAll('tr.issue[data-has-children="true"]').forEach((row) => {
        const taskId = this.getTaskIdFromRow(row);
        if (taskId) {
          this.collapsedTaskIds.add(taskId);
          const collapseBtn = row.querySelector(".collapse-btn");
          if (collapseBtn) {
            collapseBtn.textContent = "+";
            collapseBtn.title = "展开子任务";
          }
        }
      });
      this.saveCollapseState();
      if (isFilterEnabled) {
        const visibleTaskIds = this.filterMyTasks();
        this.applyFilterToDOM(visibleTaskIds);
      } else {
        this.applyCollapseStateToDOM();
      }
    }
    /**
     * 一键展开所有任务
     */
    expandAllTasks() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const isFilterEnabled = localStorage.getItem(this.filterStorageKey) === "1";
      console.log("一键展开所有任务，筛选状态:", isFilterEnabled);
      this.collapsedTaskIds.clear();
      this.saveCollapseState();
      issueTree.querySelectorAll('tr.issue[data-has-children="true"] .collapse-btn').forEach((btn) => {
        const collapseBtn = btn;
        collapseBtn.textContent = "-";
        collapseBtn.title = "折叠子任务";
      });
      if (isFilterEnabled) {
        console.log("筛选状态下重新应用筛选");
        const visibleTaskIds = this.filterMyTasks();
        this.applyFilterToDOM(visibleTaskIds);
      } else {
        console.log("非筛选状态下显示所有任务");
        issueTree.querySelectorAll("tr.issue").forEach((row) => {
          row.style.display = "";
        });
      }
    }
    /**
     * 应用折叠状态到DOM
     */
    applyCollapseStateToDOM() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      console.log("应用折叠状态到DOM");
      issueTree.querySelectorAll('tr.issue[data-has-children="true"]').forEach((row) => {
        const taskId = this.getTaskIdFromRow(row);
        if (taskId) {
          const collapseBtn = row.querySelector(".collapse-btn");
          if (this.collapsedTaskIds.has(taskId)) {
            this.collapseChildrenByDOM(row, taskId);
            if (collapseBtn) {
              collapseBtn.textContent = "+";
              collapseBtn.title = "展开子任务";
            }
          } else {
            this.expandChildrenByDOM(row, taskId);
            if (collapseBtn) {
              collapseBtn.textContent = "-";
              collapseBtn.title = "折叠子任务";
            }
          }
        }
      });
    }
    /**
     * 设置复选框行为（修复版本，避免干扰系统ajax）
     */
    setupCheckboxBehavior() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      this.cacheOriginalCheckboxStates();
      issueTree.addEventListener("change", (e) => {
        const target = e.target;
        if (target.name === "ids[]") {
          console.log("复选框状态变化:", target.value, target.checked);
          if (target.disabled) {
            target.checked = false;
            console.log("复选框被禁用，强制取消选中");
            return;
          }
          this.saveCheckboxStates();
          clearTimeout(this.statusUpdateTimer);
          this.statusUpdateTimer = setTimeout(() => {
            this.updateSelectedTasksCount();
          }, 150);
        }
      });
      issueTree.addEventListener("click", (e) => {
        const target = e.target;
        if (target.name === "ids[]") {
          e.stopPropagation();
          setTimeout(() => {
            this.saveCheckboxStates();
          }, 10);
        }
      });
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest("#batch-status-select") || target.closest("#batch-update-status-btn") || target.closest("#selected-tasks-count")) {
          setTimeout(() => {
            this.restoreCheckboxStates();
          }, 50);
        }
      });
      this.updateCheckboxVisibility();
      setTimeout(() => {
        this.updateCheckboxVisibility();
      }, 2e3);
      this.saveCheckboxStates();
    }
    /**
     * 进入批量模式
     */
    enterBatchMode(targetStatus) {
      console.log("进入批量模式，目标状态:", targetStatus);
      this.isBatchMode = true;
      this.batchTargetStatus = targetStatus;
      this.clearAllCheckboxes();
      this.disablePageFunctions();
      this.showBatchModeUI();
      this.updateCheckboxVisibility();
      this.updateSelectedTasksCount();
    }
    /**
     * 退出批量模式
     */
    exitBatchMode() {
      console.log("退出批量模式");
      this.isBatchMode = false;
      this.batchTargetStatus = "";
      this.clearAllCheckboxes();
      this.enablePageFunctions();
      this.hideBatchModeUI();
      const statusSelect = document.querySelector("#batch-status-select");
      if (statusSelect) {
        statusSelect.value = "";
      }
      this.resetAllCheckboxes();
      this.updateSelectedTasksCount();
    }
    /**
     * 清空所有复选框选择
     */
    clearAllCheckboxes() {
      this.checkboxStates.clear();
      const issueTree = document.querySelector("#issue_tree");
      if (issueTree) {
        issueTree.querySelectorAll('input[name="ids[]"]').forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    }
    /**
     * 创建并显示蒙层
     */
    showOverlay() {
      if (document.querySelector("#batch-mode-overlay")) return;
      const overlay = document.createElement("div");
      overlay.id = "batch-mode-overlay";
      overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      z-index: 9998;
      pointer-events: auto;
      backdrop-filter: blur(1px);
    `;
      overlay.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        overlay.style.background = "rgba(0, 0, 0, 0.4)";
        setTimeout(() => {
          overlay.style.background = "rgba(0, 0, 0, 0.2)";
        }, 150);
      });
      overlay.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      overlay.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      document.body.appendChild(overlay);
      console.log("批量模式蒙层已创建");
    }
    /**
     * 隐藏并移除蒙层
     */
    hideOverlay() {
      const overlay = document.querySelector("#batch-mode-overlay");
      if (overlay) {
        overlay.remove();
        console.log("批量模式蒙层已移除");
      }
    }
    /**
     * 禁用页面其他功能（使用蒙层方案）
     */
    disablePageFunctions() {
      this.showOverlay();
      const batchElements = [
        "#issue-tree-controls",
        "#batch-mode-notice"
      ];
      batchElements.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.position = "relative";
          element.style.zIndex = "9999";
        }
      });
      this.disableTaskRowInteractions();
    }
    /**
     * 禁用任务行的交互功能
     */
    disableTaskRowInteractions() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.style.position = "relative";
      issueTree.style.zIndex = "9999";
      issueTree.querySelectorAll("tr.issue").forEach((row) => {
        const htmlRow = row;
        this.addRowOverlay(htmlRow);
      });
    }
    /**
     * 为任务行添加局部蒙层（排除复选框）
     */
    addRowOverlay(row) {
      if (row.querySelector(".row-overlay")) return;
      const overlay = document.createElement("div");
      overlay.className = "row-overlay";
      overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 35px;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      z-index: 10000;
      pointer-events: auto;
      cursor: not-allowed;
      transition: background-color 0.1s ease;
    `;
      overlay.addEventListener("mouseenter", () => {
        overlay.style.background = "rgba(255, 255, 255, 0.2)";
      });
      overlay.addEventListener("mouseleave", () => {
        overlay.style.background = "rgba(255, 255, 255, 0.1)";
      });
      overlay.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      overlay.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      overlay.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      row.style.position = "relative";
      row.appendChild(overlay);
    }
    /**
     * 恢复页面功能（移除蒙层）
     */
    enablePageFunctions() {
      this.hideOverlay();
      const batchElements = [
        "#issue-tree-controls",
        "#batch-mode-notice"
      ];
      batchElements.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.position = "";
          element.style.zIndex = "";
        }
      });
      this.enableTaskRowInteractions();
    }
    /**
     * 恢复任务行的交互功能
     */
    enableTaskRowInteractions() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.style.position = "";
      issueTree.style.zIndex = "";
      issueTree.querySelectorAll(".row-overlay").forEach((overlay) => {
        overlay.remove();
      });
      issueTree.querySelectorAll("tr.issue").forEach((row) => {
        const htmlRow = row;
        htmlRow.style.position = "";
      });
    }
    /**
     * 显示批量模式UI
     */
    showBatchModeUI() {
      const cancelBtn = document.querySelector("#cancel-batch-mode-btn");
      const notice = document.querySelector("#batch-mode-notice");
      if (cancelBtn) cancelBtn.style.display = "inline-block";
      if (notice) notice.style.display = "block";
    }
    /**
     * 隐藏批量模式UI
     */
    hideBatchModeUI() {
      const cancelBtn = document.querySelector("#cancel-batch-mode-btn");
      const notice = document.querySelector("#batch-mode-notice");
      if (cancelBtn) cancelBtn.style.display = "none";
      if (notice) notice.style.display = "none";
    }
    /**
     * 重置所有复选框状态
     */
    resetAllCheckboxes(clearSelection = true) {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.querySelectorAll('input[name="ids[]"]').forEach((checkbox) => {
        const checkboxElement = checkbox;
        if (clearSelection) {
          checkboxElement.checked = false;
        }
        const originalDisabled = checkboxElement.dataset.originalDisabled === "true";
        const originalTitle = checkboxElement.dataset.originalTitle || "";
        checkboxElement.disabled = originalDisabled;
        checkboxElement.style.opacity = "";
        checkboxElement.style.transform = "";
        checkboxElement.style.cursor = "";
        checkboxElement.style.zIndex = "";
        checkboxElement.style.position = "";
        if (originalTitle) {
          checkboxElement.title = originalTitle;
        } else {
          checkboxElement.removeAttribute("title");
        }
      });
    }
    /**
     * 更新复选框可见性和可选择性（重新实现 - 蒙层方案）
     */
    updateCheckboxVisibility() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      if (!this.isBatchMode) {
        this.resetAllCheckboxes(false);
        return;
      }
      const targetStatusId = parseInt(this.batchTargetStatus);
      const myUserId = this.currentUserId;
      const myUserHref = `/users/${myUserId}`;
      console.log("批量模式更新复选框状态，目标状态ID:", targetStatusId);
      const existingCheckboxes = issueTree.querySelectorAll('input[name="ids[]"]');
      existingCheckboxes.forEach((checkbox) => {
        const checkboxElement = checkbox;
        const row = checkboxElement.closest("tr.issue");
        if (!row) return;
        const assignedToLink = row.querySelector("td.assigned_to a.user");
        const isMine = assignedToLink && assignedToLink.href.endsWith(myUserHref);
        if (!isMine) {
          checkboxElement.disabled = true;
          checkboxElement.checked = false;
          checkboxElement.style.opacity = "0.3";
          checkboxElement.title = "此任务未指派给您";
          this.checkboxStates.delete(checkboxElement.value);
          return;
        }
        const task = this.allTasksData.find((t) => t.id === parseInt(checkboxElement.value));
        if (!task) {
          checkboxElement.disabled = true;
          checkboxElement.checked = false;
          checkboxElement.style.opacity = "0.3";
          checkboxElement.title = "任务数据不存在";
          this.checkboxStates.delete(checkboxElement.value);
          return;
        }
        const canSelect = this.canSelectTaskForBatchUpdate(task, targetStatusId);
        if (canSelect) {
          checkboxElement.disabled = false;
          checkboxElement.style.opacity = "1";
          checkboxElement.style.transform = "scale(1.2)";
          checkboxElement.style.cursor = "pointer";
          checkboxElement.style.zIndex = "10001";
          checkboxElement.style.position = "relative";
          checkboxElement.title = `点击选择此任务更新为${this.getStatusName(targetStatusId)}`;
        } else {
          checkboxElement.disabled = true;
          checkboxElement.checked = false;
          checkboxElement.style.opacity = "0.3";
          this.checkboxStates.delete(checkboxElement.value);
          if (task.status_id === targetStatusId) {
            checkboxElement.title = "任务状态无需变更";
          } else if (task.status_id === 5) {
            checkboxElement.title = "已完成的任务不能变更状态";
          } else if (targetStatusId === 5 && this.hasIncompleteChildren(task.id)) {
            checkboxElement.title = "子任务未全部完成，无法更新为已实施";
          } else {
            checkboxElement.title = "此任务不符合更新条件";
          }
        }
      });
    }
    /**
     * 缓存页面原始的复选框禁用状态和提示信息
     */
    cacheOriginalCheckboxStates() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      issueTree.querySelectorAll('input[name="ids[]"]').forEach((checkbox) => {
        const checkboxElement = checkbox;
        if (!checkboxElement.dataset.originalDisabled) {
          checkboxElement.dataset.originalDisabled = checkboxElement.disabled ? "true" : "false";
        }
        if (!checkboxElement.dataset.originalTitle) {
          checkboxElement.dataset.originalTitle = checkboxElement.getAttribute("title") || "";
        }
      });
    }
    /**
     * 检查任务是否可以被选择进行批量更新
     */
    canSelectTaskForBatchUpdate(task, targetStatusId) {
      if (task.status_id === targetStatusId) {
        return false;
      }
      if (task.status_id === 5 && targetStatusId !== 5) {
        return false;
      }
      if (targetStatusId === 5) {
        const hasIncompleteChildren = this.hasIncompleteChildren(task.id);
        if (hasIncompleteChildren) {
          return false;
        }
      }
      return true;
    }
    /**
     * 获取状态名称
     */
    getStatusName(statusId) {
      const statusNames = {
        1: "新建",
        2: "进行中",
        5: "已实施[完成]"
      };
      return statusNames[statusId] || `状态${statusId}`;
    }
    /**
     * 保存折叠状态
     */
    saveCollapseState() {
      const collapsedArray = Array.from(this.collapsedTaskIds);
      localStorage.setItem(this.collapseStorageKey, JSON.stringify(collapsedArray));
    }
    /**
     * 定位到今天的任务
     */
    scrollToTodayTask() {
      console.log("=== 开始定位今天的任务 ===");
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const highlighted = issueTree.querySelectorAll("tr.issue.today-highlight");
      if (highlighted.length > 0) {
        console.log("取消现有高亮，共", highlighted.length, "个任务");
        highlighted.forEach((row) => {
          row.classList.remove("today-highlight");
          row.style.background = "";
          row.style.backgroundColor = "";
          row.querySelectorAll("td").forEach((td) => {
            td.style.background = "";
            td.style.backgroundColor = "";
          });
        });
        return;
      }
      const targetUserId = this.getActiveFilterUserId();
      if (!targetUserId) {
        alert("未找到目标用户，无法定位任务！");
        return;
      }
      const today = /* @__PURE__ */ new Date();
      const todayStr = this.formatDate(today);
      let found = false;
      const foundTasks = [];
      const targetUserHref = `/users/${targetUserId}`;
      console.log("查找目标用户:", targetUserId, "今天日期:", todayStr);
      issueTree.querySelectorAll('tr.issue:not([style*="display: none"])').forEach((row) => {
        var _a, _b, _c;
        const htmlRow = row;
        const assignedToLink = row.querySelector("td.assigned_to a.user");
        const isTargetUser = assignedToLink && assignedToLink.href && assignedToLink.href.endsWith(targetUserHref);
        if (!isTargetUser) return;
        const classes = htmlRow.className.split(/\s+/);
        if (classes.includes("parent")) return;
        const startDateCell = row.querySelector("td.start_date");
        const dueDateCell = row.querySelector("td.due_date");
        if (!startDateCell || !dueDateCell) return;
        let startDate = startDateCell.getAttribute("data-original-date") || "";
        let dueDate = dueDateCell.getAttribute("data-original-date") || "";
        if (!startDate) {
          const startDateClone = startDateCell.cloneNode(true);
          startDateClone.querySelectorAll(".task-edit-icon").forEach((icon) => icon.remove());
          startDate = ((_a = startDateClone.textContent) == null ? void 0 : _a.trim()) || "";
          startDate = this.convertWeekdayToDate(startDate);
        }
        if (!dueDate) {
          const dueDateClone = dueDateCell.cloneNode(true);
          dueDateClone.querySelectorAll(".task-edit-icon").forEach((icon) => icon.remove());
          dueDate = ((_b = dueDateClone.textContent) == null ? void 0 : _b.trim()) || "";
          dueDate = this.convertWeekdayToDate(dueDate);
        }
        const subjectLink = row.querySelector("td.subject a");
        const taskName = ((_c = subjectLink == null ? void 0 : subjectLink.textContent) == null ? void 0 : _c.trim()) || "未知任务";
        console.log("检查任务:", taskName, "开始日期:", startDate, "结束日期:", dueDate);
        if (startDate && dueDate && startDate !== "" && dueDate !== "" && startDate <= todayStr && dueDate >= todayStr) {
          console.log("✓ 找到今天的任务:", taskName);
          htmlRow.classList.add("today-highlight");
          htmlRow.style.background = "#ffe066 !important";
          htmlRow.style.backgroundColor = "#ffe066 !important";
          htmlRow.querySelectorAll("td").forEach((td) => {
            td.style.background = "#ffe066 !important";
            td.style.backgroundColor = "#ffe066 !important";
          });
          foundTasks.push(taskName);
          if (!found) {
            console.log("滚动到第一个找到的任务");
            htmlRow.scrollIntoView({ behavior: "smooth", block: "center" });
            found = true;
          }
        }
      });
      if (!found) {
        const userName = this.getUserNameById(targetUserId);
        console.log("未找到今天的任务");
        alert(`没有找到${userName}今天在进行中的任务！`);
      } else {
        console.log("✓ 成功高亮", foundTasks.length, "个今天的任务:", foundTasks);
        console.log('高亮将保持显示，再次点击"定位到今天的任务"按钮可取消高亮');
      }
    }
    /**
     * 格式化日期为 YYYY-MM-DD 格式
     */
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    /**
     * 根据用户ID获取用户名
     */
    getUserNameById(userId) {
      const user = this.projectMembers.find((u) => u.id === userId);
      return user ? user.name : "该用户";
    }
    /**
     * 检查任务是否有未完成的子任务
     */
    hasIncompleteChildren(taskId) {
      const children = this.taskHierarchy.get(taskId) || [];
      for (const child of children) {
        if (child.status_id !== 5) {
          return true;
        }
        if (this.hasIncompleteChildren(child.id)) {
          return true;
        }
      }
      return false;
    }
    /**
     * 更新日期显示模式
     */
    updateDateDisplay(mode) {
      console.log("更新日期显示模式:", mode);
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const startDateCells = issueTree.querySelectorAll("td.start_date");
      startDateCells.forEach((cell) => {
        this.updateDateCell(cell, mode);
      });
      const dueDateCells = issueTree.querySelectorAll("td.due_date");
      dueDateCells.forEach((cell) => {
        this.updateDateCell(cell, mode);
      });
    }
    /**
     * 更新单个日期单元格
     */
    updateDateCell(cell, mode) {
      var _a;
      const textNodes = Array.from(cell.childNodes).filter(
        (node) => {
          var _a2;
          return node.nodeType === Node.TEXT_NODE && ((_a2 = node.textContent) == null ? void 0 : _a2.trim());
        }
      );
      if (textNodes.length === 0) return;
      const originalDate = (_a = textNodes[0].textContent) == null ? void 0 : _a.trim();
      if (!originalDate || originalDate === "") return;
      if (!cell.getAttribute("data-original-date")) {
        cell.setAttribute("data-original-date", originalDate);
      }
      const savedOriginalDate = cell.getAttribute("data-original-date");
      if (!savedOriginalDate) return;
      let displayText = savedOriginalDate;
      if (mode === "week") {
        displayText = this.convertDateToWeekday(savedOriginalDate);
      }
      textNodes[0].textContent = displayText;
    }
    /**
     * 将日期转换为周几显示
     */
    convertDateToWeekday(dateStr) {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return dateStr;
        }
        const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const weekday = weekdays[date.getDay()];
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}-${day}(${weekday})`;
      } catch (error) {
        console.warn("日期转换失败:", dateStr, error);
        return dateStr;
      }
    }
    /**
     * 将周几格式转换回日期格式
     */
    convertWeekdayToDate(weekdayStr) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(weekdayStr)) {
        return weekdayStr;
      }
      const weekdayMatch = weekdayStr.match(/^(\d{2})-(\d{2})\(周.\)$/);
      if (weekdayMatch) {
        const month = weekdayMatch[1];
        const day = weekdayMatch[2];
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const dateStr = `${currentYear}-${month}-${day}`;
        const testDate = new Date(dateStr);
        if (!isNaN(testDate.getTime())) {
          return dateStr;
        }
      }
      return weekdayStr;
    }
    /**
     * 更新选中任务计数和按钮状态（重新实现）
     */
    updateSelectedTasksCount() {
      const updateBtn = document.querySelector("#batch-update-status-btn");
      const countDisplay = document.querySelector("#selected-tasks-count");
      if (!updateBtn || !countDisplay) return;
      if (!this.isBatchMode) {
        countDisplay.textContent = "请选择要操作的任务";
        updateBtn.disabled = true;
        return;
      }
      const targetUserId = this.currentUserId;
      let selectedCount = 0;
      const statusCounts = { 1: 0, 2: 0, 5: 0 };
      this.checkboxStates.forEach((isChecked, taskId) => {
        if (isChecked) {
          const task = this.allTasksData.find((t) => t.id.toString() === taskId);
          if (task && task.assigned_to_id && task.assigned_to_id.toString() === targetUserId) {
            selectedCount++;
            if (Object.prototype.hasOwnProperty.call(statusCounts, task.status_id)) {
              statusCounts[task.status_id]++;
            }
          }
        }
      });
      if (selectedCount === 0) {
        countDisplay.textContent = `请选择要更新为"${this.getStatusName(parseInt(this.batchTargetStatus))}"的任务`;
      } else {
        const statusNames = { 1: "新建", 2: "进行中", 5: "已完成" };
        const statusText = Object.entries(statusCounts).filter(([_status, count]) => count > 0).map(([status, count]) => `${statusNames[parseInt(status)]}${count}个`).join(", ");
        countDisplay.textContent = `已选择 ${selectedCount} 个任务: ${statusText} → ${this.getStatusName(parseInt(this.batchTargetStatus))}`;
      }
      updateBtn.disabled = selectedCount === 0;
      if (selectedCount > 0) {
        updateBtn.title = `将选中的 ${selectedCount} 个任务状态更新为 ${this.getStatusName(parseInt(this.batchTargetStatus))}`;
      } else {
        updateBtn.title = "请先选择要更新的任务";
      }
      console.log(`批量模式选中任务统计: 总计${selectedCount}个`);
    }
    /**
     * 批量更新任务状态（重新实现）
     */
    async batchUpdateTaskStatus() {
      if (!this.isBatchMode || !this.batchTargetStatus) {
        alert("请先选择要变更的状态！");
        return;
      }
      const selectedTasks = [];
      const targetUserId = this.currentUserId;
      this.checkboxStates.forEach((isChecked, taskId) => {
        if (isChecked) {
          const task = this.allTasksData.find((t) => t.id.toString() === taskId);
          if (task && task.assigned_to_id && task.assigned_to_id.toString() === targetUserId) {
            selectedTasks.push({
              id: taskId,
              currentStatus: task.status_id
            });
          }
        }
      });
      if (selectedTasks.length === 0) {
        alert("请至少选择一个任务！");
        return;
      }
      const statusText = this.getStatusName(parseInt(this.batchTargetStatus));
      const confirmed = window.confirm(`确定要将选中的 ${selectedTasks.length} 个任务状态变更为 "${statusText}" 吗？`);
      if (!confirmed) return;
      const updateBtn = document.querySelector("#batch-update-status-btn");
      updateBtn.disabled = true;
      updateBtn.textContent = "更新中...";
      let completedTasks = 0;
      let successCount = 0;
      let failCount = 0;
      const totalTasks = selectedTasks.length;
      console.log(`开始批量更新 ${totalTasks} 个任务状态为: ${statusText}`);
      for (let i = 0; i < selectedTasks.length; i++) {
        const task = selectedTasks[i];
        setTimeout(async () => {
          try {
            if (task.currentStatus === 1 && this.batchTargetStatus === "5") {
              console.log(`任务 ${task.id} 需要两步完成：新建 → 进行中 → 已实施`);
              await this.completeTaskInTwoSteps(task.id);
            } else {
              await this.updateSingleTaskStatus(task.id, this.batchTargetStatus);
            }
            successCount++;
            console.log(`✅ 任务 ${task.id} 状态更新成功`);
          } catch (error) {
            failCount++;
            console.error(`❌ 任务 ${task.id} 状态更新失败:`, error);
          }
          completedTasks++;
          if (completedTasks === totalTasks) {
            this.finalizeBatchUpdate(successCount, failCount, statusText);
          }
        }, i * 500);
      }
    }
    /**
     * 完成批量更新后的处理
     */
    finalizeBatchUpdate(successCount, failCount, _statusText) {
      const updateBtn = document.querySelector("#batch-update-status-btn");
      updateBtn.disabled = false;
      updateBtn.textContent = "批量更新";
      const message = `任务状态更新完成！
成功：${successCount}个
失败：${failCount}个`;
      this.exitBatchMode();
      if (window.confirm(message + "\n\n是否刷新页面查看最新状态？")) {
        window.location.reload();
      }
    }
    /**
     * 两步完成任务
     */
    async completeTaskInTwoSteps(taskId) {
      console.log(`开始两步完成任务 ${taskId}`);
      try {
        await this.updateSingleTaskStatus(taskId, "2");
        console.log(`任务 ${taskId} 第一步成功：新建 -> 进行中`);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        await this.updateSingleTaskStatus(taskId, "5");
        console.log(`任务 ${taskId} 第二步成功：进行中 -> 已实施[完成]`);
      } catch (error) {
        console.error(`任务 ${taskId} 两步完成失败:`, error);
        throw error;
      }
    }
    /**
     * 更新单个任务状态 - 使用REST API
     */
    async updateSingleTaskStatus(taskId, newStatus) {
      console.log(`开始更新任务 ${taskId} 状态为: ${newStatus}`);
      const issueData = {
        issue: {
          status_id: parseInt(newStatus)
        }
      };
      try {
        const response = await this.apiClient.updateIssue(taskId, issueData);
        console.log(`✅ 任务 ${taskId} 状态更新成功`);
        return response;
      } catch (error) {
        console.error(`❌ 任务 ${taskId} 状态更新失败:`, error);
        throw error;
      }
    }
    // ========== 公共接口方法 ==========
    /**
     * 获取所有任务数据
     */
    getAllTasksData() {
      return this.allTasksData;
    }
    /**
     * 获取任务层级关系
     */
    getTaskHierarchy() {
      return this.taskHierarchy;
    }
    /**
     * 获取项目成员列表
     */
    getProjectMembers() {
      return this.projectMembers;
    }
    /**
     * 获取当前用户ID
     */
    getCurrentUserId() {
      return this.currentUserId;
    }
    /**
     * 设置当前用户ID
     */
    setCurrentUserId(userId) {
      this.currentUserId = userId;
      this.assigneeFilterUserId = userId;
      console.log("设置当前用户ID:", userId);
    }
    /**
     * 设置筛选用户ID
     */
    setAssigneeFilterUserId(userId) {
      this.assigneeFilterUserId = userId || this.currentUserId;
    }
    /**
     * 检查任务是否折叠
     */
    isTaskCollapsed(taskId) {
      return this.collapsedTaskIds.has(taskId);
    }
    /**
     * 获取折叠状态
     */
    getCollapsedTaskIds() {
      return this.collapsedTaskIds;
    }
    /**
     * 清除所有折叠状态
     */
    clearCollapseState() {
      this.collapsedTaskIds.clear();
      this.saveCollapseState();
    }
    /**
     * 刷新任务相关人员列表
     */
    refreshTaskRelatedUsers() {
      console.log("手动刷新任务相关人员列表...");
      this.loadAndPopulateAssigneeFilter();
    }
    /**
     * 获取控制面板元素
     */
    getControlPanel() {
      return document.querySelector(`#${this.controlPanelId}`);
    }
    /**
     * 销毁管理器
     */
    destroy() {
      const controlPanel = this.getControlPanel();
      if (controlPanel) {
        controlPanel.remove();
      }
      if (this.statusUpdateTimer) {
        clearTimeout(this.statusUpdateTimer);
      }
    }
  }
  const todayHighlightStyles = `
  .today-highlight,
  tr.issue.today-highlight,
  #issue_tree tr.issue.today-highlight {
    background: #ffe066 !important;
    background-color: #ffe066 !important;
    transition: background 0.5s;
  }
  .today-highlight td,
  tr.issue.today-highlight td,
  #issue_tree tr.issue.today-highlight td {
    background: #ffe066 !important;
    background-color: #ffe066 !important;
  }
`;
  const customTitleUIStyles = `
  #custom-title-list {
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    min-width: 180px;
    max-width: 400px;
    max-height: 240px;
    overflow-y: auto;
    padding: 4px 0;
    z-index: 99999;
  }
  .custom-title-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    background: none;
  }
  .custom-title-item:hover {
    background: #e6f7ff;
  }
  .custom-title-remove {
    margin-left: auto;
    color: #bbb;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    padding-left: 8px;
    transition: color 0.2s;
  }
  .custom-title-remove:hover {
    color: #f5222d;
  }
  .custom-title-empty {
    padding: 12px 16px;
    color: #bbb;
    text-align: center;
    font-size: 14px;
  }
`;
  const checkboxStyles = `
  /* 复选框基础样式（不强制显示） */
  input[name="ids[]"] {
    width: 16px !important;
    height: 16px !important;
    margin-right: 8px !important;
    position: static !important;
    clip: auto !important;
    overflow: visible !important;
  }

  /* 强制限制复选框父单元格宽度 */
  table.list tbody tr td.checkbox,
  table.list thead tr th.checkbox,
  #issue_tree tbody tr td.checkbox,
  #issue_tree thead tr th.checkbox,
  .list tbody tr td.checkbox,
  .list thead tr th.checkbox,
  tbody tr td.checkbox,
  thead tr th.checkbox,
  td.checkbox,
  th.checkbox {
    display: table-cell !important;
    width: 30px !important;
    min-width: 30px !important;
    max-width: 30px !important;
    padding: 2px 4px !important;
    text-align: center !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    vertical-align: middle !important;
  }

  /* 当前用户任务的复选框样式 */
  tr.issue[data-user-task="true"] input[name="ids[]"] {
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  tr.issue[data-user-task="true"] td.checkbox {
    display: table-cell !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 30px !important;
    min-width: 30px !important;
    max-width: 30px !important;
  }

  /* 其他用户任务的复选框样式 - 完全隐藏列 */
  tr.issue[data-user-task="false"] input[name="ids[]"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }

  tr.issue[data-user-task="false"] td.checkbox {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }
`;
  const copyMessageStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
  const timeLoggingStyles = `
  .time-logging-mode .time-entry-container {
    display: inline-block;
    margin-left: 10px;
    padding: 4px 8px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 12px;
  }
  .time-entry-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0;
    padding: 4px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  .time-entry-item input[type="date"] {
    width: 120px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .time-entry-item input[type="number"] {
    width: 60px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .time-entry-item input[type="text"] {
    width: 400px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
  .time-entry-item select {
    width: 140px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    border-radius: 2px;
    font-size: 11px;
  }
  .time-entry-actions {
    display: flex;
    gap: 4px;
  }
  .time-entry-btn {
    padding: 2px 6px;
    font-size: 11px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
  }
  .time-entry-btn.add {
    background: #28a745;
    color: white;
  }
  .time-entry-btn.remove {
    background: #dc3545;
    color: white;
  }
  .time-entry-btn.edit {
    background: #ffc107;
    color: #212529;
  }
  .time-entry-btn:hover {
    opacity: 0.8;
  }
  .time-logging-mode #issue_tree tr.issue td.subject {
    position: relative;
  }
`;
  const taskFilterStyles = `
  /* 控制面板样式 */
  #issue-tree-controls {
    margin: 10px 0;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 3px;
    border: 1px solid #ddd;
  }

  #issue-tree-controls .button {
    font-size: 12px;
    padding: 4px 8px;
    margin-right: 5px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  /* 折叠按钮样式 */
  .collapse-btn {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
    margin-right: 5px;
    font-size: 12px;
    font-weight: bold;
    color: #666;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 2px;
    user-select: none;
    vertical-align: middle;
  }

  .collapse-btn:hover {
    background: #e0e0e0;
  }

  /* 折叠占位符样式 */
  .collapse-placeholder {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
  }

  /* 任务行标记样式 */
  tr.issue[data-has-children="true"] {
    font-weight: normal;
  }

  tr.issue.parent {
    background-color: #f9f9f9;
  }

  /* 筛选状态指示 */
  .task-filter-active {
    background-color: #e6f7ff !important;
    border-left: 3px solid #1890ff !important;
  }
`;
  const copyTaskIdStyles = `
  .copy-task-id-btn {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    margin-left: 5px;
    font-size: 12px;
    color: #666;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 3px;
    user-select: none;
    vertical-align: middle;
    transition: background-color 0.2s;
  }

  .copy-task-id-btn:hover {
    background: #e0e0e0;
  }

  /* 复制成功状态 */
  .copy-task-id-btn.success {
    background: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
  }

  /* 复制失败状态 */
  .copy-task-id-btn.error {
    background: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
  }
`;
  let StyleInjector$1 = class StyleInjector {
    constructor() {
      this.injectedStyles = /* @__PURE__ */ new Set();
    }
    /**
     * 注入单个样式
     */
    injectStyle(id, css) {
      if (this.injectedStyles.has(id)) {
        return;
      }
      const style = document.createElement("style");
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
      this.injectedStyles.add(id);
      console.log(`已注入样式: ${id}`);
    }
    /**
     * 移除样式
     */
    removeStyle(id) {
      const style = document.getElementById(id);
      if (style) {
        style.remove();
        this.injectedStyles.delete(id);
        console.log(`已移除样式: ${id}`);
      }
    }
    /**
     * 注入所有Redmine增强器样式
     */
    injectAllRedmineStyles() {
      this.injectStyle("redmine-today-highlight", todayHighlightStyles);
      this.injectStyle("redmine-custom-title-ui", customTitleUIStyles);
      this.injectStyle("redmine-checkbox-styles", checkboxStyles);
      this.injectStyle("redmine-copy-message-styles", copyMessageStyles);
      this.injectStyle("redmine-time-logging-styles", timeLoggingStyles);
      this.injectStyle("redmine-task-filter-styles", taskFilterStyles);
      this.injectStyle("redmine-copy-task-id-styles", copyTaskIdStyles);
    }
    /**
     * 移除所有样式
     */
    removeAllStyles() {
      this.injectedStyles.forEach((id) => {
        this.removeStyle(id);
      });
    }
    /**
     * 获取已注入的样式列表
     */
    getInjectedStyles() {
      return Array.from(this.injectedStyles);
    }
  };
  class TimeLogger {
    // 防重复点击
    constructor(apiClient) {
      this.activityOptions = [];
      this.timeLoggingMode = false;
      this.timeEntries = /* @__PURE__ */ new Map();
      this.lastClickTime = {};
      this.apiClient = apiClient;
    }
    /**
     * 初始化工时登记器
     */
    async init() {
      try {
        await this.loadActivityOptions();
        this.initTimeLoggingUI();
        console.log("工时登记器初始化完成");
      } catch (error) {
        console.error("工时登记器初始化失败:", error);
      }
    }
    /**
     * 初始化工时登记UI
     */
    initTimeLoggingUI() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) {
        console.log("未找到任务列表，工时登记功能不启用");
        return;
      }
      this.addTimeLoggingButton();
      this.bindTimeLoggingEvents();
      this.observePageChanges();
    }
    /**
     * 加载活动选项
     */
    async loadActivityOptions() {
      try {
        const response = await this.apiClient.request("/enumerations/time_entry_activities.json");
        if (response.ok) {
          const data = await response.json();
          if (data.time_entry_activities) {
            this.activityOptions = data.time_entry_activities.map((activity) => ({
              id: String(activity.id),
              name: activity.name
            }));
            console.log("活动选项加载完成:", this.activityOptions.length, "个");
            return;
          }
        }
      } catch (error) {
        console.warn("从API加载活动选项失败:", error);
      }
      this.activityOptions = [
        { id: "9", name: "开发" },
        { id: "10", name: "设计" },
        { id: "11", name: "测试" }
      ];
      console.log("使用默认活动选项");
    }
    /**
     * 添加工时登记按钮到控制栏
     */
    addTimeLoggingButton() {
      var _a;
      let controls = document.querySelector("#issue-tree-controls");
      if (!controls) {
        controls = document.createElement("div");
        controls.id = "issue-tree-controls";
        controls.style.marginBottom = "10px";
        const issueTree = document.querySelector("#issue_tree");
        if (issueTree && issueTree.parentNode) {
          issueTree.parentNode.insertBefore(controls, issueTree);
        }
      }
      if (document.querySelector("#time-logging-btn")) {
        return;
      }
      const timeLoggingBtn = document.createElement("button");
      timeLoggingBtn.type = "button";
      timeLoggingBtn.id = "time-logging-btn";
      timeLoggingBtn.style.cssText = `
      background: #28a745;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
    `;
      timeLoggingBtn.textContent = "登记工时";
      timeLoggingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleTimeLoggingMode();
      });
      const expandAllBtn = document.querySelector("#expand-all-btn");
      if (expandAllBtn) {
        (_a = expandAllBtn.parentNode) == null ? void 0 : _a.insertBefore(timeLoggingBtn, expandAllBtn.nextSibling);
      } else {
        controls.appendChild(timeLoggingBtn);
      }
    }
    /**
     * 切换工时登记模式
     */
    toggleTimeLoggingMode() {
      this.timeLoggingMode = !this.timeLoggingMode;
      const btn = document.querySelector("#time-logging-btn");
      const issueTree = document.querySelector("#issue_tree");
      if (this.timeLoggingMode) {
        console.log("进入工时登记模式");
        if (btn) {
          btn.textContent = "提交工时";
          btn.style.background = "#dc3545";
        }
        if (issueTree) {
          issueTree.classList.add("time-logging-mode");
        }
        this.showTimeEntryInputs();
      } else {
        console.log("退出工时登记模式");
        this.submitTimeEntries().then((result) => {
          if (result && result.cancelled) {
            console.log("提交被取消或存在不完整条目，保持工时登记模式");
            return;
          }
          if (btn) {
            btn.textContent = "登记工时";
            btn.style.background = "#28a745";
          }
          if (issueTree) {
            issueTree.classList.remove("time-logging-mode");
          }
          this.hideTimeEntryInputs();
        }).catch((error) => {
          console.error("提交工时失败:", error);
          if (btn) {
            btn.textContent = "登记工时";
            btn.style.background = "#28a745";
          }
          if (issueTree) {
            issueTree.classList.remove("time-logging-mode");
          }
          this.hideTimeEntryInputs();
        });
      }
    }
    /**
     * 绑定工时登记相关事件
     */
    bindTimeLoggingEvents() {
      document.removeEventListener("click", this.handleTimeEntryClick);
      document.addEventListener("click", this.handleTimeEntryClick.bind(this));
      console.log("工时登记事件监听器已绑定");
    }
    /**
     * 处理工时相关按钮点击事件
     */
    handleTimeEntryClick(e) {
      const target = e.target;
      if (target.classList.contains("time-entry-btn")) {
        e.preventDefault();
        e.stopPropagation();
        const taskId = target.getAttribute("data-task-id");
        if (!taskId) return;
        if (target.classList.contains("add")) {
          this.addTimeEntry(taskId);
        } else if (target.classList.contains("edit")) {
          const index = parseInt(target.getAttribute("data-entry-index") || "0");
          this.editTimeEntry(taskId, index);
        } else if (target.classList.contains("remove")) {
          const index = parseInt(target.getAttribute("data-entry-index") || "0");
          this.removeTimeEntry(taskId, index);
        }
      }
    }
    /**
     * 显示工时输入界面
     */
    showTimeEntryInputs() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const visibleRows = issueTree.querySelectorAll('tr.issue:not([style*="display: none"])');
      visibleRows.forEach((row) => {
        const taskId = this.extractTaskIdFromRow(row);
        if (!taskId) return;
        const subjectCell = row.querySelector("td.subject");
        if (!subjectCell) return;
        let existingContainer = subjectCell.querySelector(".time-entry-container");
        if (existingContainer) {
          this.refreshTimeEntryContainer(taskId);
          return;
        }
        const timeEntryContainer = this.createTimeEntryContainer(taskId);
        subjectCell.appendChild(timeEntryContainer);
      });
    }
    /**
     * 隐藏工时输入界面
     */
    hideTimeEntryInputs() {
      const timeEntryContainers = document.querySelectorAll(".time-entry-container");
      timeEntryContainers.forEach((container) => container.remove());
    }
    /**
     * 创建工时输入容器
     */
    createTimeEntryContainer(taskId) {
      const existingEntries = this.timeEntries.get(taskId) || [];
      const container = document.createElement("div");
      container.className = "time-entry-container";
      container.setAttribute("data-task-id", taskId);
      const list = document.createElement("div");
      list.className = "time-entry-list";
      existingEntries.forEach((entry, index) => {
        const entryElement = this.createTimeEntryItem(taskId, entry, index);
        list.appendChild(entryElement);
      });
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "time-entry-btn add";
      addButton.setAttribute("data-task-id", taskId);
      addButton.textContent = "+ 添加工时";
      container.appendChild(list);
      container.appendChild(addButton);
      return container;
    }
    /**
     * 创建单个工时条目
     */
    createTimeEntryItem(taskId, entry = {}, index = 0) {
      var _a;
      console.log("创建工时条目，当前活动选项:", this.activityOptions);
      const filteredActivities = this.getFilteredActivitiesByUserRole(taskId);
      console.log("筛选后的活动选项:", filteredActivities);
      const activityOptions = filteredActivities.map(
        (activity) => `<option value="${activity.id}" ${activity.id == entry.activity_id ? "selected" : ""}>${activity.name}</option>`
      ).join("");
      const defaultIssueId = ((_a = entry.issue_id) == null ? void 0 : _a.trim()) || taskId;
      const defaultDate = entry.spent_on || this.formatDate(/* @__PURE__ */ new Date());
      const item = document.createElement("div");
      item.className = "time-entry-item";
      item.setAttribute("data-entry-index", index.toString());
      item.innerHTML = `
      <input type="number"
             class="time-issue-id"
             placeholder="任务ID"
             value="${defaultIssueId || ""}"
             title="关联的任务ID" style="width: 80px">
      <input type="date"
             class="time-date"
             value="${defaultDate}"
             title="工时日期">
      <input type="number"
             class="time-hours"
             placeholder="工时"
             min="0"
             step="0.5"
             value="${entry.hours || ""}"
             title="工时（小时）">
      <input type="text"
             class="time-comments"
             placeholder="注释"
             value="${entry.comments || ""}"
             title="工时注释">
      <select class="time-activity" title="活动类型">
        <option value="">选择活动</option>
        ${activityOptions}
      </select>
      <div class="time-entry-actions">
        <button type="button" class="time-entry-btn remove"
                data-task-id="${taskId}" data-entry-index="${index}"
                title="删除">
          🗑️
        </button>
      </div>
    `;
      return item;
    }
    /**
     * 添加工时条目
     */
    addTimeEntry(taskId) {
      console.log("=== 添加工时条目 ===");
      console.log("任务ID:", taskId);
      if (!taskId) {
        console.error("任务ID为空，无法添加工时条目");
        alert("无法获取任务ID，请刷新页面后重试");
        return;
      }
      const now = Date.now();
      const lastClickKey = `addTimeEntry_${taskId}`;
      if (this.lastClickTime[lastClickKey] && now - this.lastClickTime[lastClickKey] < 500) {
        console.log("防重复点击保护：忽略重复点击");
        return;
      }
      this.lastClickTime[lastClickKey] = now;
      this.saveAllTimeEntriesFromUIForTask(taskId);
      const entries = this.timeEntries.get(taskId) || [];
      const newEntry = {
        issue_id: taskId,
        // 默认当前任务ID
        spent_on: this.formatDate(/* @__PURE__ */ new Date()),
        // 默认今天
        hours: "",
        comments: "",
        activity_id: ""
      };
      entries.push(newEntry);
      this.timeEntries.set(taskId, entries);
      console.log("已添加工时条目，当前条目数:", entries.length);
      this.appendTimeEntryToUI(taskId, newEntry, entries.length - 1);
    }
    /**
     * 编辑工时条目
     */
    editTimeEntry(taskId, index) {
      console.log("编辑工时条目:", taskId, index);
      const container = document.querySelector(`.time-entry-container[data-task-id="${taskId}"]`);
      const item = container == null ? void 0 : container.querySelector(`.time-entry-item[data-entry-index="${index}"]`);
      if (!item) return;
      this.saveTimeEntryFromUI(taskId, index);
      item.style.background = "#fff3cd";
      setTimeout(() => {
        item.style.background = "white";
      }, 1e3);
    }
    /**
     * 删除工时条目
     */
    removeTimeEntry(taskId, index) {
      console.log("删除工时条目:", taskId, index);
      const entries = this.timeEntries.get(taskId) || [];
      if (index >= 0 && index < entries.length) {
        entries.splice(index, 1);
        this.timeEntries.set(taskId, entries);
        this.refreshTimeEntryContainer(taskId);
      }
    }
    /**
     * 从任务行中提取任务ID
     */
    extractTaskIdFromRow(row) {
      let taskId = row.getAttribute("data-task-id");
      if (!taskId) {
        const rowId = row.id;
        if (rowId) {
          const match = rowId.match(/issue-(\d+)/);
          if (match) {
            taskId = match[1];
          }
        }
      }
      if (!taskId) {
        const taskLink = row.querySelector("td.subject a");
        if (taskLink) {
          const href = taskLink.href;
          if (href) {
            const match = href.match(/\/issues\/(\d+)/);
            if (match) {
              taskId = match[1];
            }
          }
        }
      }
      if (!taskId) {
        const checkbox = row.querySelector('input[name="ids[]"]');
        if (checkbox) {
          taskId = checkbox.value;
        }
      }
      return taskId || null;
    }
    /**
     * 监听页面变化
     */
    observePageChanges() {
      const observer = new MutationObserver((mutations) => {
        if (this.timeLoggingMode) {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                var _a;
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node;
                  if ((_a = element.classList) == null ? void 0 : _a.contains("issue")) {
                    const taskId = this.extractTaskIdFromRow(element);
                    if (taskId) {
                      const subjectCell = element.querySelector("td.subject");
                      if (subjectCell && !subjectCell.querySelector(".time-entry-container")) {
                        const timeEntryContainer = this.createTimeEntryContainer(taskId);
                        subjectCell.appendChild(timeEntryContainer);
                      }
                    }
                  }
                }
              });
            }
          });
        }
      });
      const issueTree = document.querySelector("#issue_tree");
      if (issueTree) {
        observer.observe(issueTree, {
          childList: true,
          subtree: true
        });
      }
    }
    /**
     * 刷新工时条目容器
     */
    refreshTimeEntryContainer(taskId) {
      console.log("刷新工时条目容器，任务ID:", taskId);
      const container = document.querySelector(`.time-entry-container[data-task-id="${taskId}"]`);
      if (!container) {
        console.log("未找到工时容器");
        return;
      }
      const list = container.querySelector(".time-entry-list");
      const entries = this.timeEntries.get(taskId) || [];
      console.log("当前条目数:", entries.length);
      const items = list == null ? void 0 : list.querySelectorAll(".time-entry-item");
      items == null ? void 0 : items.forEach((item) => {
        const entryIndex = parseInt(item.getAttribute("data-entry-index") || "0");
        if (entryIndex >= 0 && entryIndex < entries.length) {
          this.saveTimeEntryFromUIElement(item, taskId, entryIndex);
        }
      });
      this.timeEntries.set(taskId, entries);
      if (list) {
        list.innerHTML = "";
        entries.forEach((entry, index) => {
          const entryElement = this.createTimeEntryItem(taskId, entry, index);
          list.appendChild(entryElement);
        });
      }
      console.log("刷新完成，最终条目数:", entries.length);
    }
    /**
     * 从UI保存工时条目数据
     */
    saveTimeEntryFromUI(taskId, index) {
      console.log(`保存工时数据 - 任务ID: ${taskId}, 索引: ${index}`);
      const container = document.querySelector(`.time-entry-container[data-task-id="${taskId}"]`);
      const item = container == null ? void 0 : container.querySelector(`.time-entry-item[data-entry-index="${index}"]`);
      if (!item) {
        console.warn("未找到工时条目元素");
        return;
      }
      this.saveTimeEntryFromUIElement(item, taskId, index);
    }
    /**
     * 从UI元素保存工时条目数据
     */
    saveTimeEntryFromUIElement(item, taskId, index) {
      var _a, _b, _c, _d, _e, _f;
      const issue_id = (_a = item.querySelector(".time-issue-id")) == null ? void 0 : _a.value;
      const spent_on = (_b = item.querySelector(".time-date")) == null ? void 0 : _b.value;
      const hours = (_c = item.querySelector(".time-hours")) == null ? void 0 : _c.value;
      const comments = (_d = item.querySelector(".time-comments")) == null ? void 0 : _d.value;
      const activity_id = (_e = item.querySelector(".time-activity")) == null ? void 0 : _e.value;
      console.log("从UI获取的数据:", { issue_id, spent_on, hours, comments, activity_id });
      const entries = this.timeEntries.get(taskId) || [];
      if (index >= 0 && index < entries.length) {
        const currentEntry = entries[index] || {};
        const normalizedIssueId = issue_id && issue_id.trim() !== "" ? issue_id.trim() : ((_f = currentEntry.issue_id) == null ? void 0 : _f.trim()) || taskId;
        entries[index] = {
          ...currentEntry,
          issue_id: normalizedIssueId,
          spent_on: spent_on || currentEntry.spent_on,
          hours: hours || currentEntry.hours,
          comments: comments || currentEntry.comments,
          activity_id: activity_id || currentEntry.activity_id
        };
        this.timeEntries.set(taskId, entries);
        console.log("已保存到内存:", entries[index]);
      } else {
        console.warn("索引超出范围:", index, "数组长度:", entries.length);
      }
    }
    /**
     * 保存所有UI中的工时数据
     */
    saveAllTimeEntriesFromUI() {
      console.log("=== 保存所有UI中的工时数据 ===");
      const containers = document.querySelectorAll(".time-entry-container");
      console.log("找到工时容器数量:", containers.length);
      containers.forEach((container) => {
        const taskId = container.getAttribute("data-task-id");
        if (!taskId) return;
        console.log(`处理任务 ${taskId} 的工时容器`);
        const items = container.querySelectorAll(".time-entry-item");
        console.log(`任务 ${taskId} 有 ${items.length} 个工时条目`);
        items.forEach((item) => {
          const entryIndex = parseInt(item.getAttribute("data-entry-index") || "0");
          console.log(`保存任务 ${taskId} 的第 ${entryIndex} 个工时条目`);
          this.saveTimeEntryFromUIElement(item, taskId, entryIndex);
        });
      });
      console.log("所有UI数据保存完成");
    }
    /**
     * 保存指定任务的UI中的工时数据
     */
    saveAllTimeEntriesFromUIForTask(taskId) {
      console.log("保存任务工时数据:", taskId);
      const container = document.querySelector(`.time-entry-container[data-task-id="${taskId}"]`);
      if (!container) return;
      const items = container.querySelectorAll(".time-entry-item");
      items.forEach((item) => {
        const entryIndex = parseInt(item.getAttribute("data-entry-index") || "0");
        this.saveTimeEntryFromUIElement(item, taskId, entryIndex);
      });
    }
    /**
     * 直接添加工时条目到UI，不刷新整个容器
     */
    appendTimeEntryToUI(taskId, entry, index) {
      console.log("添加工时条目到UI:", taskId, index);
      const container = document.querySelector(`.time-entry-container[data-task-id="${taskId}"]`);
      if (!container) {
        console.error("未找到工时容器");
        return;
      }
      const list = container.querySelector(".time-entry-list");
      if (!list) {
        console.error("未找到工时列表");
        return;
      }
      const entryElement = this.createTimeEntryItem(taskId, entry, index);
      list.appendChild(entryElement);
      console.log("已添加工时条目到UI");
    }
    /**
     * 提交所有工时条目
     */
    async submitTimeEntries() {
      try {
        console.log("=== 开始提交工时条目 ===");
        console.log("保存UI中的工时数据...");
        this.saveAllTimeEntriesFromUI();
        console.log("保存完成，当前内存中的工时数据:", this.timeEntries);
        const allEntries = [];
        const incompleteEntries = [];
        let hasValidEntries = false;
        for (const [taskId, entries] of this.timeEntries) {
          console.log(`检查任务 ${taskId} 的工时条目:`, entries);
          for (const [entryIndex, entry] of entries.entries()) {
            console.log("检查工时条目:", entry);
            const hasIssueId = entry.issue_id && entry.issue_id.trim() !== "";
            const hasHours = entry.hours && parseFloat(entry.hours) > 0;
            const hasActivity = entry.activity_id && entry.activity_id !== "";
            const hasComments = entry.comments && entry.comments.trim() !== "";
            const hasDate = entry.spent_on && entry.spent_on.trim() !== "";
            if (hasIssueId && hasHours && hasActivity && hasDate) {
              allEntries.push({
                taskId: entry.issue_id.trim(),
                hours: parseFloat(entry.hours),
                comments: entry.comments || "",
                activity_id: entry.activity_id,
                spent_on: entry.spent_on,
                entryIndex
              });
              hasValidEntries = true;
              console.log("✓ 有效的工时条目");
            } else if (hasHours || hasActivity || hasComments || hasDate) {
              incompleteEntries.push({
                taskId,
                entryIndex,
                entry,
                missingFields: {
                  issue: !hasIssueId,
                  hours: !hasHours,
                  activity: !hasActivity,
                  date: !hasDate
                }
              });
              console.log("✗ 不完整的工时条目");
            }
          }
        }
        console.log("收集到的有效工时条目:", allEntries);
        console.log("收集到的不完整工时条目:", incompleteEntries);
        if (incompleteEntries.length > 0) {
          let alertMessage = `发现 ${incompleteEntries.length} 个工时条目填写不完整：

`;
          incompleteEntries.forEach((item, index) => {
            const missingFields = [];
            if (item.missingFields.issue) missingFields.push("任务ID");
            if (item.missingFields.date) missingFields.push("日期");
            if (item.missingFields.hours) missingFields.push("工时");
            if (item.missingFields.activity) missingFields.push("活动类型");
            const displayTaskId = item.entry.issue_id || item.taskId;
            alertMessage += `${index + 1}. 任务 ${displayTaskId}: 缺少 ${missingFields.join("、")}
`;
          });
          alertMessage += "\n请补充完整信息后再提交！";
          alert(alertMessage);
          this.timeLoggingMode = true;
          const btn = document.querySelector("#time-logging-btn");
          if (btn) {
            btn.textContent = "提交工时";
            btn.style.background = "#dc3545";
          }
          const issueTree = document.querySelector("#issue_tree");
          if (issueTree) {
            issueTree.classList.add("time-logging-mode");
          }
          return { cancelled: true };
        }
        if (!hasValidEntries) {
          alert("没有找到有效的工时条目！请确保填写了任务ID、日期、工时和活动类型。");
          throw new Error("没有有效的工时条目");
        }
        console.log("准备提交的工时条目:", allEntries);
        const confirmMessage = `确定要提交 ${allEntries.length} 个工时条目吗？

` + allEntries.map(
          (entry) => `任务 ${entry.taskId}: ${entry.spent_on} - ${entry.hours}小时 - ${this.getActivityNameById(entry.activity_id)}${entry.comments ? ` - ${entry.comments}` : ""}`
        ).join("\n");
        if (!confirm(confirmMessage)) {
          console.log("用户取消提交，保持工时登记模式");
          this.timeLoggingMode = true;
          const btn = document.querySelector("#time-logging-btn");
          if (btn) {
            btn.textContent = "提交工时";
            btn.style.background = "#dc3545";
          }
          const issueTree = document.querySelector("#issue_tree");
          if (issueTree) {
            issueTree.classList.add("time-logging-mode");
          }
          return { cancelled: true };
        }
        let successCount = 0;
        let failCount = 0;
        for (const entry of allEntries) {
          try {
            const success = await this.submitSingleTimeEntry(entry);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (error) {
            console.error("提交工时条目失败:", entry, error);
            failCount++;
          }
        }
        const resultMessage = `工时提交完成！
成功: ${successCount} 个
失败: ${failCount} 个`;
        alert(resultMessage);
        if (failCount === 0) {
          this.timeEntries.clear();
          console.log("工时提交成功，准备刷新页面...");
          window.location.reload();
        }
        return { success: true, successCount, failCount };
      } catch (error) {
        console.error("提交工时时发生错误:", error);
        throw error;
      }
    }
    /**
     * 根据活动ID获取活动名称
     */
    getActivityNameById(activityId) {
      const activity = this.activityOptions.find((a) => a.id == activityId);
      return activity ? activity.name : `活动${activityId}`;
    }
    /**
     * 提交单个工时条目
     */
    async submitSingleTimeEntry(entry) {
      console.log("=== 提交单个工时条目 ===");
      console.log("工时条目数据:", entry);
      try {
        const timeEntryData = {
          time_entry: {
            issue_id: entry.taskId,
            hours: entry.hours,
            comments: entry.comments,
            activity_id: entry.activity_id,
            spent_on: entry.spent_on || this.formatDate(/* @__PURE__ */ new Date())
          }
        };
        console.log("构建的工时数据:", timeEntryData);
        console.log("准备发送到 /time_entries.json");
        const response = await this.apiClient.request("/time_entries.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(timeEntryData)
        });
        console.log("工时提交响应状态:", response.status);
        if (response.ok) {
          console.log("✓ 工时条目提交成功:", entry.taskId);
          return true;
        } else {
          const errorText = await response.text();
          console.error("✗ 工时条目提交失败:", response.status, errorText);
          return false;
        }
      } catch (error) {
        console.error("提交工时条目时发生异常:", error);
        return false;
      }
    }
    /**
     * 根据用户角色筛选活动选项
     */
    getFilteredActivitiesByUserRole(taskId) {
      var _a;
      try {
        const taskRows = document.querySelectorAll("tr.issue");
        let taskRow = null;
        for (const row of taskRows) {
          const currentTaskId = this.extractTaskIdFromRow(row);
          if (currentTaskId == taskId) {
            taskRow = row;
            break;
          }
        }
        if (!taskRow) {
          console.log("未找到任务行，返回所有活动");
          return this.activityOptions || [];
        }
        const assignedUser = taskRow.querySelector("td.assigned_to a.user");
        if (!assignedUser) {
          console.log("未找到指派用户，返回所有活动");
          return this.activityOptions || [];
        }
        const userText = ((_a = assignedUser.textContent) == null ? void 0 : _a.trim()) || "";
        console.log("用户信息:", userText);
        const roleMatch = userText.match(/\[([^\]]+)\]/);
        if (!roleMatch) {
          console.log("未找到用户角色信息，返回所有活动");
          return this.activityOptions || [];
        }
        const userRole = roleMatch[1];
        console.log("提取的用户角色:", userRole);
        const filteredActivities = this.filterActivitiesByRole(userRole);
        console.log("筛选后的活动数量:", filteredActivities.length);
        return filteredActivities;
      } catch (error) {
        console.error("筛选活动时出错:", error);
        return this.activityOptions || [];
      }
    }
    /**
     * 根据角色筛选活动选项
     */
    filterActivitiesByRole(role) {
      if (!this.activityOptions || this.activityOptions.length === 0) {
        return [];
      }
      const roleFilters = {
        "游戏研发": ["研发:"],
        "研发": ["研发:"],
        "测试": ["测试:"]
      };
      const filters = roleFilters[role];
      if (!filters) {
        console.log("未找到角色筛选规则，返回所有活动");
        return this.activityOptions;
      }
      console.log("角色筛选关键词:", filters);
      const filteredActivities = this.activityOptions.filter((activity) => {
        return filters.some((filter) => activity.name.includes(filter));
      });
      console.log(`筛选结果: 从 ${this.activityOptions.length} 个活动中筛选出 ${filteredActivities.length} 个`);
      if (filteredActivities.length === 0) {
        console.log("筛选后无结果，返回所有活动");
        return this.activityOptions;
      }
      return filteredActivities;
    }
    /**
     * 格式化日期为 YYYY-MM-DD
     */
    formatDate(date) {
      return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
    }
    /**
     * 销毁工时登记器
     */
    destroy() {
      const timeLoggingBtn = document.querySelector("#time-logging-btn");
      if (timeLoggingBtn) {
        timeLoggingBtn.remove();
      }
      this.hideTimeEntryInputs();
      const issueTree = document.querySelector("#issue_tree");
      if (issueTree) {
        issueTree.classList.remove("time-logging-mode");
      }
      document.removeEventListener("click", this.handleTimeEntryClick);
      console.log("工时登记器已销毁");
    }
  }
  class QuickCopy {
    constructor() {
      this.rowObserver = null;
    }
    /**
     * 初始化快速复制功能
     */
    init() {
      try {
        this.addCopyButtonsToAllRows();
        this.observeNewRows();
        this.registerStyles();
        console.log("快速复制功能初始化完成");
      } catch (error) {
        console.error("快速复制功能初始化失败:", error);
      }
    }
    /**
     * 为所有任务行添加复制按钮
     */
    addCopyButtonsToAllRows() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const issueRows = issueTree.querySelectorAll("tr.issue");
      issueRows.forEach((row) => {
        this.addCopyButtonToRow(row);
      });
    }
    /**
     * 为单个任务行添加复制按钮
     */
    addCopyButtonToRow(row) {
      this.ensureCopyMenuButton(row);
    }
    /**
     * 创建复制按钮基础样式
     */
    createCopyButton(label) {
      const copyBtn = document.createElement("span");
      copyBtn.innerHTML = label;
      Object.assign(copyBtn.style, {
        display: "inline-block",
        width: "18px",
        height: "18px",
        lineHeight: "18px",
        textAlign: "center",
        cursor: "pointer",
        marginLeft: "5px",
        fontSize: "12px",
        color: "#666",
        background: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "3px",
        userSelect: "none",
        verticalAlign: "middle"
      });
      copyBtn.addEventListener("mouseenter", () => {
        copyBtn.style.background = "#e0e0e0";
      });
      copyBtn.addEventListener("mouseleave", () => {
        copyBtn.style.background = "#f0f0f0";
      });
      return copyBtn;
    }
    /**
     * 确保行上存在综合复制按钮
     */
    ensureCopyMenuButton(row) {
      if (row.querySelector(".copy-task-menu-btn")) return;
      const taskId = this.getTaskIdFromRow(row);
      const taskName = this.getTaskNameFromRow(row);
      const taskUrl = this.getTaskUrlFromRow(row);
      if (!taskId && !taskName && !taskUrl) return;
      const copyBtn = this.createCopyButton("⧉");
      copyBtn.className = "copy-task-menu-btn";
      copyBtn.title = "复制: ID / 名称 / URL";
      const targetCell = row.querySelector("td.subject") || row.querySelector("td.id");
      targetCell == null ? void 0 : targetCell.appendChild(copyBtn);
      copyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openCopyMenu(copyBtn, { taskId, taskName, taskUrl });
      });
    }
    /**
     * 展示复制菜单
     */
    openCopyMenu(anchor, data) {
      document.querySelectorAll(".copy-task-menu").forEach((menu2) => menu2.remove());
      const options = [];
      if (data.taskId) options.push({ label: "复制ID", text: data.taskId, type: "任务ID" });
      if (data.taskName) options.push({ label: "复制名称", text: data.taskName, type: "任务名称" });
      if (data.taskUrl) options.push({ label: "复制URL", text: data.taskUrl, type: "任务URL" });
      if (!options.length) return;
      const menu = document.createElement("div");
      menu.className = "copy-task-menu";
      options.forEach((opt) => {
        const item = document.createElement("div");
        item.className = "copy-task-menu-item";
        item.textContent = opt.label;
        item.title = opt.text;
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.copyTextToClipboard(opt.text, anchor, opt.type);
          menu.remove();
        });
        menu.appendChild(item);
      });
      document.body.appendChild(menu);
      const rect = anchor.getBoundingClientRect();
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom + 4}px`;
      const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== anchor) {
          menu.remove();
          document.removeEventListener("click", closeMenu, true);
        }
      };
      setTimeout(() => {
        document.addEventListener("click", closeMenu, true);
      }, 0);
    }
    /**
     * 复制文本到剪贴板
     */
    async copyTextToClipboard(text, button, label) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          this.showCopySuccess(button, text, label);
        } else {
          this.fallbackCopyToClipboard(text, button, label);
        }
      } catch (error) {
        console.error("复制失败:", error);
        this.fallbackCopyToClipboard(text, button, label);
      }
    }
    /**
     * 降级复制方法
     */
    fallbackCopyToClipboard(text, button, label) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      try {
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        if (successful) {
          this.showCopySuccess(button, text, label);
        } else {
          this.showCopyError(button, text, label);
        }
      } catch (error) {
        console.error("降级复制也失败:", error);
        this.showCopyError(button, text, label);
      } finally {
        document.body.removeChild(textArea);
      }
    }
    /**
     * 显示复制成功反馈
     */
    showCopySuccess(button, text, label) {
      const originalText = button.textContent || "";
      const originalTitle = button.title;
      button.textContent = "✓";
      Object.assign(button.style, {
        background: "#d4edda",
        color: "#155724",
        borderColor: "#c3e6cb"
      });
      button.title = `已复制${label}: ${text}`;
      this.showFloatingMessage(`已复制${label}: ${text}`, "success");
      setTimeout(() => {
        button.textContent = originalText;
        Object.assign(button.style, {
          background: "#f0f0f0",
          color: "#666",
          borderColor: "#ccc"
        });
        button.title = originalTitle || "复制按钮";
      }, 2e3);
    }
    /**
     * 显示复制失败反馈
     */
    showCopyError(button, text, label) {
      const originalText = button.textContent || "";
      const originalTitle = button.title;
      button.textContent = "✗";
      Object.assign(button.style, {
        background: "#f8d7da",
        color: "#721c24",
        borderColor: "#f5c6cb"
      });
      button.title = `复制${label}失败: ${text}`;
      this.showFloatingMessage(`复制${label}失败: ${text}`, "error");
      setTimeout(() => {
        button.textContent = originalText;
        Object.assign(button.style, {
          background: "#f0f0f0",
          color: "#666",
          borderColor: "#ccc"
        });
        button.title = originalTitle || "复制按钮";
      }, 2e3);
    }
    /**
     * 显示浮动消息
     */
    showFloatingMessage(message, type = "info") {
      const existingMessages = document.querySelectorAll(".copy-message");
      existingMessages.forEach((msg) => msg.remove());
      const bgColor = type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1";
      const textColor = type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460";
      const borderColor = type === "success" ? "#c3e6cb" : type === "error" ? "#f5c6cb" : "#bee5eb";
      const messageElement = document.createElement("div");
      messageElement.className = "copy-message";
      messageElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: ${textColor};
      border: 1px solid ${borderColor};
      border-radius: 5px;
      padding: 10px 15px;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;
      messageElement.innerHTML = message;
      document.body.appendChild(messageElement);
      setTimeout(() => {
        messageElement.style.animation = "slideOutRight 0.3s ease-in";
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
          }
        }, 300);
      }, 3e3);
    }
    /**
     * 监听新添加的行
     */
    observeNewRows() {
      if (this.rowObserver) {
        this.rowObserver.disconnect();
      }
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      this.rowObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                const element = node;
                if (element.classList.contains("issue")) {
                  this.addCopyButtonToRow(element);
                } else {
                  const issueRows = element.querySelectorAll("tr.issue");
                  issueRows.forEach((row) => {
                    this.addCopyButtonToRow(row);
                  });
                }
              }
            });
          }
        });
      });
      this.rowObserver.observe(issueTree, {
        childList: true,
        subtree: true
      });
    }
    /**
     * 从任务行获取任务ID
     */
    getTaskIdFromRow(row) {
      const classes = row.className.split(/\s+/);
      const issueClass = classes.find((c2) => /^issue-\d+$/.test(c2));
      if (issueClass) {
        return issueClass.replace("issue-", "");
      }
      const checkbox = row.querySelector('input[name="ids[]"]');
      if (checkbox && checkbox.value) {
        return checkbox.value;
      }
      const taskLink = row.querySelector("td.subject a");
      if (taskLink && taskLink.href) {
        const match = taskLink.href.match(/\/issues\/(\d+)/);
        if (match) return match[1];
      }
      return null;
    }
    /**
     * 从任务行获取任务名称
     */
    getTaskNameFromRow(row) {
      var _a, _b, _c;
      const subjectCell = row.querySelector("td.subject");
      if (!subjectCell) return null;
      const textParts = [];
      subjectCell.childNodes.forEach((node) => {
        var _a2;
        if (node.nodeType === Node.TEXT_NODE) {
          const text = (_a2 = node.textContent) == null ? void 0 : _a2.trim();
          if (text) {
            textParts.push(text.replace(/^[:：]\s*/, ""));
          }
        }
      });
      if (textParts.length) {
        const merged = textParts.join(" ").trim();
        if (merged) return merged;
      }
      const fullText = ((_a = subjectCell.textContent) == null ? void 0 : _a.trim()) || "";
      const linkText = ((_c = (_b = subjectCell.querySelector("a")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.trim()) || "";
      const cleaned = fullText.replace(linkText, "").trim().replace(/^[:：]\s*/, "");
      return cleaned || null;
    }
    /**
     * 从任务行获取任务URL
     */
    getTaskUrlFromRow(row) {
      const link = row.querySelector("td.subject a");
      if (!link || !link.getAttribute("href")) return null;
      const href = link.getAttribute("href") || "";
      try {
        const url = new URL(href, window.location.origin);
        return url.href;
      } catch {
        return null;
      }
    }
    /**
     * 注册样式
     */
    registerStyles() {
      const styles = `
      /* 复制按钮动画 */
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      /* 复制按钮样式增强 */
      .copy-task-menu-btn {
        transition: all 0.2s ease;
      }

      .copy-task-menu-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .copy-task-menu-btn:active {
        transform: scale(0.95);
      }

      .copy-task-menu {
        position: fixed;
        min-width: 110px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        z-index: 10001;
        overflow: hidden;
      }

      .copy-task-menu-item {
        padding: 6px 10px;
        font-size: 12px;
        color: #333;
        cursor: pointer;
        white-space: nowrap;
      }

      .copy-task-menu-item:hover {
        background: #f5f5f5;
      }
    `;
      if (!document.querySelector("#quick-copy-styles")) {
        const styleElement = document.createElement("style");
        styleElement.id = "quick-copy-styles";
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
      }
    }
    /**
     * 销毁快速复制功能
     */
    destroy() {
      if (this.rowObserver) {
        this.rowObserver.disconnect();
        this.rowObserver = null;
      }
      const copyButtons = document.querySelectorAll(".copy-task-menu-btn");
      copyButtons.forEach((btn) => btn.remove());
      document.querySelectorAll(".copy-task-menu").forEach((menu) => menu.remove());
      const styleElement = document.querySelector("#quick-copy-styles");
      if (styleElement) {
        styleElement.remove();
      }
      const copyMessages = document.querySelectorAll(".copy-message");
      copyMessages.forEach((msg) => msg.remove());
      console.log("快速复制功能已销毁");
    }
  }
  class TodayHoursDisplay {
    constructor(_apiClient) {
      this.currentUserId = "";
    }
    /**
     * 初始化当日工时统计显示
     */
    async init() {
      try {
        await this.initCurrentUser();
        if (this.isIssueDetailPage()) {
          this.addTodayHoursField();
        }
        console.log("当日工时统计显示初始化完成");
      } catch (error) {
        console.error("当日工时统计显示初始化失败:", error);
      }
    }
    /**
     * 初始化当前用户
     */
    async initCurrentUser() {
      const loggedAsLink = document.querySelector("#loggedas a");
      if (loggedAsLink) {
        const href = loggedAsLink.href;
        const match = href == null ? void 0 : href.match(/\/users\/(\d+)/);
        if (match) {
          this.currentUserId = match[1];
        }
      }
      if (!this.currentUserId) {
        console.error("无法获取当前用户ID");
      }
    }
    /**
     * 检查是否在任务详情页面
     */
    isIssueDetailPage() {
      const pathname = window.location.pathname;
      return /\/issues\/\d+(?:[?#]|$)/.test(pathname);
    }
    /**
     * 添加当日工时统计字段
     */
    addTodayHoursField() {
      var _a;
      const spentTime = document.querySelector(".spent-time");
      if (!spentTime) {
        console.warn("未找到 spent-time 元素");
        return;
      }
      if (document.querySelector(".today-hours")) {
        console.log("当日工时字段已存在，跳过重复初始化");
        this.calculateAndDisplayTodayHours();
        return;
      }
      const todayHoursField = document.createElement("div");
      todayHoursField.className = "today-hours attribute";
      todayHoursField.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0;
    `;
      const label = document.createElement("div");
      label.className = "label";
      label.style.cssText = `
      font-weight: bold;
      color: #2060a0;
      font-size: 14px;
      min-width: 80px;
    `;
      label.textContent = "当日工时:";
      const value = document.createElement("div");
      value.className = "value";
      value.id = "today-hours-value";
      value.style.cssText = `
      font-weight: bold;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 4px;
      background-color: #f0f8ff;
      border: 1px solid #2060a0;
      min-width: 80px;
      text-align: center;
    `;
      value.textContent = "计算中...";
      todayHoursField.appendChild(label);
      todayHoursField.appendChild(value);
      (_a = spentTime.parentNode) == null ? void 0 : _a.insertBefore(todayHoursField, spentTime.nextSibling);
      this.calculateAndDisplayTodayHours();
    }
    /**
     * 计算并显示当日工时
     */
    async calculateAndDisplayTodayHours() {
      try {
        const currentIssueId = this.getCurrentIssueId();
        if (!currentIssueId) {
          const todayHoursValue2 = document.getElementById("today-hours-value");
          if (todayHoursValue2) {
            todayHoursValue2.textContent = "无法获取任务ID";
          }
          return;
        }
        if (!this.currentUserId) {
          const todayHoursValue2 = document.getElementById("today-hours-value");
          if (todayHoursValue2) {
            todayHoursValue2.textContent = "无法获取用户ID";
          }
          return;
        }
        const timeEntriesUrl = this.buildTimeEntriesUrl(currentIssueId, this.currentUserId);
        const response = await fetch(timeEntriesUrl, {
          method: "GET",
          credentials: "same-origin"
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const htmlText = await response.text();
        const totalHours = this.extractTotalHours(htmlText);
        const link = document.createElement("a");
        link.href = timeEntriesUrl;
        link.target = "_blank";
        link.textContent = `${totalHours} 小时`;
        const hoursValue = parseFloat(totalHours);
        if (hoursValue < 6) {
          link.style.color = "red";
        }
        const todayHoursValue = document.getElementById("today-hours-value");
        if (todayHoursValue) {
          todayHoursValue.innerHTML = "";
          todayHoursValue.appendChild(link);
        }
      } catch (error) {
        console.error("计算当日工时失败:", error);
        const todayHoursValue = document.getElementById("today-hours-value");
        if (todayHoursValue) {
          todayHoursValue.innerHTML = '<span style="color: red;">获取失败</span>';
        }
      }
    }
    /**
     * 获取当前任务ID
     */
    getCurrentIssueId() {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/issues\/(\d+)/);
      if (match) {
        return match[1];
      }
      const spentTimeLink = document.querySelector(".spent-time a");
      if (spentTimeLink) {
        const href = spentTimeLink.href;
        const linkMatch = href == null ? void 0 : href.match(/issue_id=~(\d+)/);
        if (linkMatch) {
          return linkMatch[1];
        }
      }
      return null;
    }
    /**
     * 构建时间条目查询URL
     */
    buildTimeEntriesUrl(issueId, userId) {
      const baseUrl = window.location.origin;
      const params = new URLSearchParams();
      params.append("utf8", "✓");
      params.append("set_filter", "1");
      params.append("sort", "spent_on:desc");
      params.append("f[]", "spent_on");
      params.append("f[]", "issue_id");
      params.append("f[]", "user_id");
      params.append("op[spent_on]", "t");
      params.append("op[issue_id]", "~");
      params.append("v[issue_id][]", issueId);
      params.append("op[user_id]", "=");
      params.append("v[user_id][]", userId);
      params.append("c[]", "project");
      params.append("c[]", "spent_on");
      params.append("c[]", "user");
      params.append("c[]", "activity");
      params.append("c[]", "issue");
      params.append("c[]", "comments");
      params.append("c[]", "hours");
      params.append("group_by", "");
      params.append("t[]", "hours");
      return `${baseUrl}/time_entries?${params.toString()}`;
    }
    /**
     * 从HTML中提取总工时
     */
    extractTotalHours(htmlText) {
      var _a;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const totalHoursContainer = doc.querySelector(".total-for-hours");
        if (totalHoursContainer) {
          const totalHoursElement = totalHoursContainer.querySelector(".value");
          if (totalHoursElement) {
            const totalHours = (_a = totalHoursElement.textContent) == null ? void 0 : _a.trim();
            return totalHours || "0.00";
          }
        }
        const tables = doc.querySelectorAll("table");
        for (const table of tables) {
          const rows = table.querySelectorAll("tr");
          for (const row of rows) {
            const text = row.textContent || "";
            if (text.includes("总计") || text.includes("Total")) {
              const hoursMatch = text.match(/(\d+\.?\d*)\s*小时|(\d+\.?\d*)\s*hours?/i);
              if (hoursMatch) {
                return hoursMatch[1] || hoursMatch[2] || "0.00";
              }
            }
          }
        }
        return "0.00";
      } catch (error) {
        console.error("解析工时HTML失败:", error);
        return "0.00";
      }
    }
    /**
     * 刷新当日工时显示
     */
    refreshTodayHours() {
      if (document.querySelector(".today-hours")) {
        this.calculateAndDisplayTodayHours();
      }
    }
    /**
     * 销毁当日工时显示
     */
    destroy() {
      const todayHoursElements = document.querySelectorAll(".today-hours");
      todayHoursElements.forEach((element) => element.remove());
      console.log("当日工时统计显示已销毁");
    }
  }
  class TaskEditor {
    constructor(apiClient) {
      this.projectMembers = [];
      this.statusOptions = [];
      this.currentUserId = "";
      this.taskEditorRowObserver = null;
      this.statusTransitions = {
        "1": ["2", "5"],
        // 新建 -> 进行中, 完成
        "2": ["5"],
        // 进行中 -> 完成
        "5": ["5"]
        // 完成 -> 完成（允许保持当前状态）
      };
      this.apiClient = apiClient;
    }
    /**
     * 初始化任务编辑器功能
     */
    async init() {
      try {
        const issueTree = document.querySelector("#issue_tree");
        if (!issueTree) {
          console.log("未找到任务列表，任务编辑器功能不启用");
          return;
        }
        await this.initTaskEditorData();
        this.addEditorsToExistingCells();
        this.observeNewRowsForTaskEditor();
        this.registerTaskEditorStyles();
        console.log("任务编辑器功能初始化完成");
      } catch (error) {
        console.error("任务编辑器功能初始化失败:", error);
      }
    }
    /**
     * 初始化任务编辑器数据
     */
    async initTaskEditorData() {
      await this.initCurrentUser();
      await this.loadProjectMembers();
      await this.loadStatusOptions();
      console.log("任务编辑器数据初始化完成");
    }
    /**
     * 初始化当前用户
     */
    async initCurrentUser() {
      const loggedAsLink = document.querySelector("#loggedas a");
      if (loggedAsLink) {
        const href = loggedAsLink.href;
        const match = href == null ? void 0 : href.match(/\/users\/(\d+)/);
        if (match) {
          this.currentUserId = match[1];
        }
      }
    }
    /**
     * 加载项目成员列表
     */
    async loadProjectMembers() {
      try {
        this.extractProjectMembersFromPage();
        console.log("项目成员加载完成:", this.projectMembers.length, "个成员");
      } catch (error) {
        console.error("加载项目成员失败:", error);
      }
    }
    /**
     * 从页面中提取项目成员信息
     */
    extractProjectMembersFromPage() {
      const memberSet = /* @__PURE__ */ new Set();
      const members = [];
      const userLinks = document.querySelectorAll("#issue_tree tr.issue td.assigned_to a.user");
      userLinks.forEach((element) => {
        var _a;
        const link = element;
        const href = link.href;
        const name = (_a = link.textContent) == null ? void 0 : _a.trim();
        if (href && name) {
          const match = href.match(/\/users\/(\d+)/);
          if (match) {
            const userId = match[1];
            const memberKey = `${userId}:${name}`;
            if (!memberSet.has(memberKey)) {
              memberSet.add(memberKey);
              members.push({
                id: userId,
                name
              });
            }
          }
        }
      });
      this.projectMembers = members;
    }
    /**
     * 加载状态选项
     */
    async loadStatusOptions() {
      try {
        const response = await this.apiClient.request("/issue_statuses.json");
        if (response.ok) {
          const data = await response.json();
          if (data.issue_statuses) {
            this.statusOptions = data.issue_statuses.map((status) => ({
              id: String(status.id),
              name: status.name
            }));
            console.log("成功加载状态选项:", this.statusOptions.length, "个");
            return;
          }
        }
      } catch (error) {
        console.warn("从API加载状态选项失败:", error);
      }
      this.extractStatusOptionsFromPage();
    }
    /**
     * 从页面中提取状态选项
     */
    extractStatusOptionsFromPage() {
      const statusOptions = [];
      const statusSet = /* @__PURE__ */ new Set();
      const statusCells = document.querySelectorAll("#issue_tree tr.issue td.status");
      statusCells.forEach((cell) => {
        var _a;
        const statusText = (_a = cell.textContent) == null ? void 0 : _a.trim();
        if (statusText && statusText !== "-" && !statusSet.has(statusText)) {
          statusSet.add(statusText);
          let statusId = "1";
          if (statusText.includes("进行中")) statusId = "2";
          else if (statusText.includes("已实施") || statusText.includes("完成")) statusId = "5";
          statusOptions.push({
            id: statusId,
            name: statusText
          });
        }
      });
      this.statusOptions = statusOptions;
      console.log("从页面提取到状态选项:", this.statusOptions);
    }
    /**
     * 注册任务编辑器相关样式
     */
    registerTaskEditorStyles() {
      const styles = `
      /* 任务编辑器样式 */
      .task-editor-input, .task-editor-select {
        width: 100%;
        padding: 2px 4px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 11px;
        background: #fff;
        box-sizing: border-box;
      }

      .task-editor-input:focus, .task-editor-select:focus {
        border-color: #628DB6;
        outline: none;
        box-shadow: 0 0 3px rgba(98, 141, 182, 0.3);
      }

      .task-cell-editable {
        cursor: pointer;
        position: relative;
        min-width: 80px;
      }

      .task-cell-editable:hover {
        background-color: #f0f8ff;
      }

      .task-edit-icon {
        position: absolute;
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        color: #999;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .task-cell-editable:hover .task-edit-icon {
        opacity: 1;
      }

      .task-saving {
        background-color: #fff3cd !important;
        border: 1px solid #ffeaa7;
      }

      .task-save-success {
        background-color: #d4edda !important;
        border: 1px solid #c3e6cb;
        transition: background-color 2s ease;
      }

      .task-save-error {
        background-color: #f8d7da !important;
        border: 1px solid #f5c6cb;
      }

      /* 特定字段样式 */
      .assigned-to-cell-editable {
        min-width: 100px;
      }

      .status-cell-editable {
        min-width: 80px;
      }

      .date-cell-editable {
        min-width: 90px;
      }
    `;
      if (!document.querySelector("#task-editor-styles")) {
        const styleElement = document.createElement("style");
        styleElement.id = "task-editor-styles";
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
      }
    }
    /**
     * 为现有的可编辑单元格添加编辑功能
     */
    addEditorsToExistingCells() {
      const issueTree = document.querySelector("#issue_tree");
      if (!issueTree) return;
      const editableCells = issueTree.querySelectorAll("td.start_date, td.due_date, td.assigned_to, td.status");
      editableCells.forEach((cell) => {
        this.addEditorToCell(cell);
      });
      console.log("已为现有可编辑单元格添加编辑功能");
    }
    /**
     * 为单个单元格添加编辑功能
     */
    addEditorToCell(cell) {
      const row = cell.closest("tr.issue");
      const taskId = this.extractTaskIdFromRow(row);
      if (!taskId) return;
      let fieldType, fieldLabel, cssClass;
      if (cell.classList.contains("start_date")) {
        fieldType = "start_date";
        fieldLabel = "开始日期";
        cssClass = "date-cell-editable";
      } else if (cell.classList.contains("due_date")) {
        fieldType = "due_date";
        fieldLabel = "结束日期";
        cssClass = "date-cell-editable";
      } else if (cell.classList.contains("assigned_to")) {
        fieldType = "assigned_to";
        fieldLabel = "指派人员";
        cssClass = "assigned-to-cell-editable";
      } else if (cell.classList.contains("status")) {
        fieldType = "status";
        fieldLabel = "状态";
        cssClass = "status-cell-editable";
      } else {
        return;
      }
      if (cell.classList.contains("task-cell-editable")) return;
      cell.classList.add("task-cell-editable", cssClass);
      cell.setAttribute("title", `点击编辑${fieldLabel}`);
      if (!cell.querySelector(".task-edit-icon")) {
        const editIcon = document.createElement("span");
        editIcon.className = "task-edit-icon";
        editIcon.textContent = "✏️";
        cell.appendChild(editIcon);
      }
      const clickHandler = (e) => {
        e.stopPropagation();
        this.startFieldEdit(cell, taskId, fieldType);
      };
      cell.removeEventListener("click", clickHandler);
      cell.addEventListener("click", clickHandler);
    }
    /**
     * 开始编辑字段
     */
    async startFieldEdit(cell, taskId, fieldType) {
      if (cell.querySelector(".task-editor-input, .task-editor-select")) return;
      const currentValue = this.extractCurrentValue(cell, fieldType);
      const fieldLabel = this.getFieldLabel(fieldType);
      console.log(`开始编辑任务 ${taskId} 的${fieldLabel}，当前值: ${currentValue}`);
      const originalContent = cell.innerHTML;
      try {
        const editor = await this.createFieldEditor(fieldType, currentValue, taskId, originalContent);
        cell.innerHTML = "";
        cell.appendChild(editor);
        if (editor instanceof HTMLInputElement || editor instanceof HTMLSelectElement) {
          editor.focus();
        }
        const handleEvent = (e) => {
          const keyboardEvent = e;
          if (e.type === "keydown" && keyboardEvent.key !== "Enter" && keyboardEvent.key !== "Escape") return;
          if (keyboardEvent.key === "Escape") {
            cell.innerHTML = originalContent;
            return;
          }
          const newValue = editor.value;
          if (newValue === currentValue) {
            console.log(`任务 ${taskId} 的${fieldLabel}没有变更，取消保存`);
            cell.innerHTML = originalContent;
            return;
          }
          if (fieldType === "status") {
            if (!newValue || newValue === "") {
              console.log(`任务 ${taskId} 状态未选择或无可变更状态，还原显示`);
              cell.innerHTML = originalContent;
              return;
            }
          }
          this.saveFieldEdit(cell, taskId, fieldType, newValue, originalContent);
        };
        editor.addEventListener("blur", handleEvent);
        editor.addEventListener("keydown", handleEvent);
        editor.addEventListener("change", handleEvent);
      } catch (error) {
        console.error(`创建${fieldLabel}编辑器失败:`, error);
        cell.innerHTML = originalContent;
        this.showTaskEditError(`无法加载${fieldLabel}编辑器，请重试`);
      }
    }
    /**
     * 提取当前字段值
     */
    extractCurrentValue(cell, fieldType) {
      var _a;
      const clonedCell = cell.cloneNode(true);
      const editIcon = clonedCell.querySelector(".task-edit-icon");
      if (editIcon) {
        editIcon.remove();
      }
      const cellText = ((_a = clonedCell.textContent) == null ? void 0 : _a.trim()) || "";
      switch (fieldType) {
        case "start_date":
        case "due_date":
          return this.parseDateString(cellText) || "";
        case "assigned_to": {
          const userLink = cell.querySelector("a.user");
          if (userLink) {
            const href = userLink.href;
            const match = href == null ? void 0 : href.match(/\/users\/(\d+)$/);
            return match ? match[1] : "";
          }
          return "";
        }
        case "status": {
          const status = this.statusOptions.find((s) => s.name === cellText);
          return status ? status.id : "";
        }
        default:
          return cellText;
      }
    }
    /**
     * 获取字段标签
     */
    getFieldLabel(fieldType) {
      const labels = {
        "start_date": "开始日期",
        "due_date": "结束日期",
        "assigned_to": "指派人员",
        "status": "状态"
      };
      return labels[fieldType] || fieldType;
    }
    /**
     * 创建字段编辑器
     */
    async createFieldEditor(fieldType, currentValue, taskId, originalContent) {
      switch (fieldType) {
        case "start_date":
        case "due_date": {
          const input = document.createElement("input");
          input.type = "date";
          input.className = "task-editor-input";
          input.value = currentValue;
          return input;
        }
        case "assigned_to": {
          const select = document.createElement("select");
          select.className = "task-editor-select";
          const currentUserOption = document.createElement("option");
          currentUserOption.value = this.currentUserId;
          currentUserOption.textContent = "我自己";
          currentUserOption.selected = currentValue === this.currentUserId;
          select.appendChild(currentUserOption);
          this.projectMembers.forEach((member) => {
            if (member.id !== this.currentUserId) {
              const option = document.createElement("option");
              option.value = member.id;
              option.textContent = member.name;
              option.selected = currentValue === member.id;
              select.appendChild(option);
            }
          });
          return select;
        }
        case "status": {
          const select = document.createElement("select");
          select.className = "task-editor-select";
          const loadingOption = document.createElement("option");
          loadingOption.value = "";
          loadingOption.textContent = "加载中...";
          select.appendChild(loadingOption);
          select.disabled = true;
          if (taskId) {
            this.loadTaskAvailableStatuses(taskId, currentValue).then((availableStatuses) => {
              select.innerHTML = "";
              select.disabled = false;
              if (availableStatuses.length === 0) {
                const noStatusOption = document.createElement("option");
                noStatusOption.value = "";
                noStatusOption.textContent = "无可变更状态";
                select.appendChild(noStatusOption);
                select.disabled = true;
              } else {
                availableStatuses.forEach((status) => {
                  const option = document.createElement("option");
                  option.value = status.id;
                  option.textContent = status.name;
                  option.selected = status.id === currentValue;
                  select.appendChild(option);
                });
                console.log(`✓ 状态选择器已创建，包含 ${availableStatuses.length} 个可变更状态`);
              }
              select.dataset.originalContent = originalContent || "";
              select.dataset.currentValue = currentValue;
            }).catch((error) => {
              console.error("加载可用状态失败:", error);
              select.innerHTML = "";
              const errorOption = document.createElement("option");
              errorOption.value = "";
              errorOption.textContent = "加载状态失败";
              select.appendChild(errorOption);
              select.disabled = true;
              select.dataset.originalContent = originalContent || "";
            });
          } else {
            select.innerHTML = "";
            const errorOption = document.createElement("option");
            errorOption.value = "";
            errorOption.textContent = "缺少任务ID";
            select.appendChild(errorOption);
            select.disabled = true;
            select.dataset.originalContent = originalContent || "";
          }
          return select;
        }
        default: {
          const input = document.createElement("input");
          input.type = "text";
          input.className = "task-editor-input";
          input.value = currentValue;
          return input;
        }
      }
    }
    /**
     * 从任务编辑页面获取可用状态（严格按照历史实现）
     */
    async loadTaskAvailableStatuses(taskId, currentStatusId) {
      console.log(`=== 从编辑页面加载任务 ${taskId} 的可用状态 ===`);
      try {
        const editUrl = `${window.location.origin}/issues/${taskId}/edit`;
        const response = await fetch(editUrl, {
          method: "GET",
          credentials: "same-origin"
        });
        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const statusSelect = doc.querySelector("#issue_status_id");
          if (statusSelect) {
            const availableStatuses = [];
            statusSelect.querySelectorAll("option").forEach((option) => {
              var _a;
              const optionElement = option;
              if (optionElement.value && optionElement.value !== "") {
                availableStatuses.push({
                  id: optionElement.value,
                  name: ((_a = optionElement.textContent) == null ? void 0 : _a.trim()) || ""
                });
              }
            });
            console.log(`✓ 从编辑页面获取到 ${availableStatuses.length} 个可用状态:`, availableStatuses);
            console.log(`✓ 返回可变更状态 ${availableStatuses.length} 个:`, availableStatuses);
            return availableStatuses;
          }
        }
      } catch (error) {
        console.error("从编辑页面加载可用状态失败:", error);
      }
      console.warn(`任务 ${taskId} 无法获取可用状态，使用默认状态转换规则`);
      return this.getAvailableStatusTransitionsFallback(currentStatusId);
    }
    /**
     * 获取可用的状态转换（备用方案）
     */
    getAvailableStatusTransitionsFallback(currentStatusId) {
      const availableStatusIds = this.statusTransitions[currentStatusId] || [];
      return this.statusOptions.filter((status) => availableStatusIds.includes(status.id));
    }
    /**
     * 验证状态转换是否有效（异步版本）
     */
    async isValidStatusTransition(taskId, currentStatusId, newStatusId) {
      if (currentStatusId === newStatusId) return true;
      try {
        const availableStatuses = await this.loadTaskAvailableStatuses(taskId, currentStatusId);
        const availableStatusIds = availableStatuses.map((s) => s.id);
        return availableStatusIds.includes(newStatusId);
      } catch (error) {
        console.error("验证状态转换时出错:", error);
        const availableStatusIds = this.statusTransitions[currentStatusId] || [];
        return availableStatusIds.includes(newStatusId);
      }
    }
    /**
     * 从原始内容中提取当前状态ID
     */
    extractCurrentStatusId(cell, originalContent) {
      var _a, _b;
      const statusId = cell.getAttribute("data-status-id");
      if (statusId) return statusId;
      let statusText = "";
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = originalContent;
        const editIcon = tempDiv.querySelector(".task-edit-icon");
        if (editIcon) {
          editIcon.remove();
        }
        statusText = ((_a = tempDiv.textContent) == null ? void 0 : _a.trim()) || "";
      } catch (error) {
        console.warn("解析状态文本失败，使用备用方法:", error);
        const clonedCell = cell.cloneNode(true);
        const editIcon = clonedCell.querySelector(".task-edit-icon");
        if (editIcon) {
          editIcon.remove();
        }
        statusText = ((_b = clonedCell.textContent) == null ? void 0 : _b.trim()) || "";
      }
      console.log("提取到的状态文本:", statusText);
      const status = this.statusOptions.find((s) => s.name === statusText);
      return status ? status.id : "1";
    }
    /**
     * 保存字段编辑
     */
    async saveFieldEdit(cell, taskId, fieldType, newValue, originalContent) {
      const fieldLabel = this.getFieldLabel(fieldType);
      console.log(`保存任务 ${taskId} 的${fieldLabel}: ${newValue}`);
      cell.classList.add("task-saving");
      cell.innerHTML = "<span>保存中...</span>";
      try {
        const updateData = { issue: {} };
        switch (fieldType) {
          case "start_date":
          case "due_date":
            updateData.issue[fieldType] = newValue || null;
            break;
          case "assigned_to":
            updateData.issue.assigned_to_id = newValue || null;
            break;
          case "status": {
            const currentStatusId = this.extractCurrentStatusId(cell, originalContent);
            const isValid = await this.isValidStatusTransition(taskId, currentStatusId, newValue);
            if (!isValid) {
              throw new Error(`无效的状态转换: 从状态${currentStatusId}无法变更为状态${newValue}`);
            }
            updateData.issue.status_id = parseInt(newValue);
            break;
          }
        }
        const success = await this.updateTaskField(taskId, updateData);
        if (success) {
          cell.classList.remove("task-saving");
          cell.classList.add("task-save-success");
          const displayValue = this.formatFieldForDisplay(fieldType, newValue);
          cell.innerHTML = `${displayValue}<span class="task-edit-icon">✏️</span>`;
          console.log(`✅ 任务 ${taskId} 的${fieldLabel}更新成功: ${newValue}`);
          setTimeout(() => {
            cell.classList.remove("task-save-success");
          }, 2e3);
        } else {
          cell.classList.remove("task-saving");
          cell.classList.add("task-save-error");
          cell.innerHTML = originalContent;
          console.error(`❌ 任务 ${taskId} 的${fieldLabel}更新失败`);
          this.showTaskEditError(`${fieldLabel}更新失败，请重试`);
          setTimeout(() => {
            cell.classList.remove("task-save-error");
          }, 3e3);
        }
      } catch (error) {
        console.error(`任务 ${taskId} 的${fieldLabel}更新异常:`, error);
        cell.classList.remove("task-saving");
        cell.classList.add("task-save-error");
        cell.innerHTML = originalContent;
        this.showTaskEditError(`${fieldLabel}更新异常: ${error}`);
        setTimeout(() => {
          cell.classList.remove("task-save-error");
        }, 3e3);
      }
    }
    /**
     * 格式化字段显示值
     */
    formatFieldForDisplay(fieldType, value) {
      switch (fieldType) {
        case "start_date":
        case "due_date":
          return value ? this.formatDateForDisplay(value) : "-";
        case "assigned_to": {
          if (!value) return "-";
          if (value === this.currentUserId) return "我自己";
          const member = this.projectMembers.find((m) => m.id === value);
          return member ? member.name : `用户${value}`;
        }
        case "status": {
          if (!value) return "-";
          const status = this.statusOptions.find((s) => String(s.id) === String(value));
          return status ? status.name : `状态${value}`;
        }
        default:
          return value || "-";
      }
    }
    /**
     * 更新任务字段
     */
    async updateTaskField(taskId, updateData) {
      try {
        const response = await this.apiClient.request(`/issues/${taskId}.json`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateData)
        });
        return response.ok;
      } catch (error) {
        console.error("更新任务字段时发生异常:", error);
        return false;
      }
    }
    /**
     * 解析日期字符串为 YYYY-MM-DD 格式
     */
    parseDateString(dateStr) {
      if (!dateStr || dateStr === "-" || dateStr === "") return "";
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      } catch (e) {
        console.warn("无法解析日期字符串:", dateStr);
      }
      return "";
    }
    /**
     * 格式化日期用于显示
     */
    formatDateForDisplay(dateStr) {
      if (!dateStr) return "-";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      } catch (e) {
        return dateStr;
      }
    }
    /**
     * 显示任务编辑错误提示
     */
    showTaskEditError(message) {
      const errorMsg = document.createElement("div");
      errorMsg.className = "task-edit-error-msg";
      errorMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f8d7da;
      color: #721c24;
      padding: 10px 15px;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 10000;
      max-width: 300px;
      font-size: 14px;
    `;
      errorMsg.innerHTML = `<strong>任务编辑错误:</strong><br>${message}`;
      document.body.appendChild(errorMsg);
      setTimeout(() => {
        errorMsg.style.transition = "opacity 300ms";
        errorMsg.style.opacity = "0";
        setTimeout(() => {
          if (errorMsg.parentNode) {
            errorMsg.parentNode.removeChild(errorMsg);
          }
        }, 300);
      }, 3e3);
    }
    /**
     * 监听新添加的行，为新的可编辑单元格添加编辑功能
     */
    observeNewRowsForTaskEditor() {
      if (this.taskEditorRowObserver) {
        this.taskEditorRowObserver.disconnect();
      }
      this.taskEditorRowObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              var _a;
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                if ((_a = element.classList) == null ? void 0 : _a.contains("issue")) {
                  const editableCells = element.querySelectorAll("td.start_date, td.due_date, td.assigned_to, td.status");
                  editableCells.forEach((cell) => {
                    this.addEditorToCell(cell);
                  });
                }
                const newRows = element.querySelectorAll("tr.issue");
                newRows.forEach((row) => {
                  const editableCells = row.querySelectorAll("td.start_date, td.due_date, td.assigned_to, td.status");
                  editableCells.forEach((cell) => {
                    this.addEditorToCell(cell);
                  });
                });
              }
            });
          }
        });
      });
      const targetNode = document.querySelector("#issue_tree") || document.body;
      this.taskEditorRowObserver.observe(targetNode, {
        childList: true,
        subtree: true
      });
      console.log("任务编辑器行观察器已启动");
    }
    /**
     * 从任务行中提取任务ID
     */
    extractTaskIdFromRow(row) {
      let taskId = row.getAttribute("data-task-id");
      if (!taskId) {
        const rowId = row.id;
        if (rowId) {
          const match = rowId.match(/issue-(\d+)/);
          if (match) {
            taskId = match[1];
          }
        }
      }
      if (!taskId) {
        const taskLink = row.querySelector("td.subject a");
        if (taskLink) {
          const href = taskLink.href;
          if (href) {
            const match = href.match(/\/issues\/(\d+)/);
            if (match) {
              taskId = match[1];
            }
          }
        }
      }
      return taskId || null;
    }
    /**
     * 销毁任务编辑器
     */
    destroy() {
      if (this.taskEditorRowObserver) {
        this.taskEditorRowObserver.disconnect();
        this.taskEditorRowObserver = null;
      }
      const editableCells = document.querySelectorAll(".task-cell-editable");
      editableCells.forEach((cell) => {
        cell.classList.remove("task-cell-editable", "assigned-to-cell-editable", "status-cell-editable", "date-cell-editable");
      });
      const editIcons = document.querySelectorAll(".task-edit-icon");
      editIcons.forEach((icon) => icon.remove());
      const styleElement = document.querySelector("#task-editor-styles");
      if (styleElement) {
        styleElement.remove();
      }
      const errorMessages = document.querySelectorAll(".task-edit-error-msg");
      errorMessages.forEach((msg) => msg.remove());
      console.log("任务编辑器已销毁");
    }
  }
  class RedmineEnhancer extends BaseEnhancer {
    constructor() {
      super(...arguments);
      this.siteName = "Redmine";
      this.currentUserId = "";
      this.projectId = "";
    }
    /**
     * 检测当前网站是否匹配
     */
    detectSite() {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const isRedmineDomain = hostname.includes("t.xjjj.co");
      const isIssuePage = /\/issues\/\d+(?:[?#]|$)/.test(pathname);
      const isIssuesListPage = /\/issues(?:[?#]|$)/.test(pathname);
      const isProjectPage = /\/projects\/[^/]+(?:[?#]|$)/.test(pathname);
      return isRedmineDomain && (isIssuePage || isIssuesListPage || isProjectPage);
    }
    /**
     * 获取网站配置
     */
    getSiteConfig() {
      return {
        name: "Redmine",
        domains: ["t.xjjj.co"],
        features: ["batchCreate", "statusUpdate", "timeTracking", "taskManagement", "timeLogging", "batchStatusUpdate", "quickCopy", "todayHours", "taskEditor"],
        apiEndpoint: "/issues",
        authMethod: "csrf"
      };
    }
    /**
     * 初始化核心功能
     */
    async initializeCore() {
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
          resolve();
        }
      });
      ConfigManager.getInstance();
      this.authManager = new RedmineAuthManager();
      this.apiClient = new RedmineApiClient(this.authManager);
      this.taskManager = new RedmineTaskManager(this.apiClient);
      this.batchCreator = new RedmineBatchCreator(this.taskManager);
      this.styleInjector = new StyleInjector$1();
      this.unifiedTaskManager = new UnifiedTaskManager(this.apiClient);
      this.timeLogger = new TimeLogger(this.apiClient);
      this.quickCopy = new QuickCopy();
      this.todayHoursDisplay = new TodayHoursDisplay(this.apiClient);
      this.taskEditor = new TaskEditor(this.apiClient);
      this.setupGlobalAjaxDefaults();
      this.monitorAjaxRequests();
      await this.initializeVariables();
      console.log("Redmine 核心功能初始化完成");
    }
    /**
     * 初始化网站特定功能
     */
    async initializeFeatures() {
      this.registerFeature("batchTaskCreator", this.batchCreator);
      this.registerFeature("authManager", this.authManager);
      this.registerFeature("apiClient", this.apiClient);
      this.registerFeature("taskManager", this.taskManager);
      this.registerFeature("unifiedTaskManager", this.unifiedTaskManager);
      this.registerFeature("timeLogger", this.timeLogger);
      this.registerFeature("quickCopy", this.quickCopy);
      this.registerFeature("todayHoursDisplay", this.todayHoursDisplay);
      this.registerFeature("taskEditor", this.taskEditor);
      this.styleInjector.injectAllRedmineStyles();
      await this.initUnifiedTaskManager();
      this.initBatchTaskCreator();
      await this.initNewFeatures();
      console.log("Redmine 功能模块初始化完成");
    }
    /**
     * 初始化新功能模块
     */
    async initNewFeatures() {
      try {
        await this.timeLogger.init();
        this.quickCopy.init();
        await this.todayHoursDisplay.init();
        await this.taskEditor.init();
        console.log("新功能模块初始化完成");
      } catch (error) {
        console.error("新功能模块初始化失败:", error);
      }
    }
    /**
     * 初始化变量
     */
    async initializeVariables() {
      try {
        await this.initCurrentUser();
        if (this.unifiedTaskManager && this.currentUserId) {
          this.unifiedTaskManager.setCurrentUserId(this.currentUserId);
        }
        if (this.taskManager && this.currentUserId) {
          this.taskManager.setCurrentUserId(this.currentUserId);
        }
        const pathMatch = window.location.pathname.match(/\/projects\/([^/]+)/);
        if (pathMatch) {
          this.projectId = pathMatch[1];
          console.log("当前项目ID:", this.projectId);
        }
      } catch (error) {
        console.error("初始化变量失败:", error);
      }
    }
    /**
     * 初始化当前用户信息
     */
    async initCurrentUser() {
      try {
        const loggedAsLink = document.querySelector("#loggedas a");
        if (loggedAsLink) {
          const href = loggedAsLink.href;
          const userIdMatch = href.match(/\/users\/(\d+)$/);
          if (userIdMatch) {
            this.currentUserId = userIdMatch[1];
            console.log("当前用户ID:", this.currentUserId);
          }
        }
        if (!this.currentUserId) {
          console.error("无法从页面获取当前用户ID");
        }
      } catch (error) {
        console.error("获取当前用户信息失败:", error);
      }
    }
    /**
     * 设置全局 AJAX 默认值
     */
    setupGlobalAjaxDefaults() {
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const headers = this.authManager.getAuthHeaders({
          isFormData: false,
          isJsonApi: this.authManager.isJsonApiRequest(url, init)
        });
        const modifiedInit = {
          ...init,
          headers: {
            ...init == null ? void 0 : init.headers,
            ...headers
          }
        };
        return originalFetch.call(window, input, modifiedInit);
      };
      if (typeof window.$ !== "undefined") {
        const $ = window.$;
        $.ajaxSetup({
          beforeSend: (xhr, settings) => {
            const headers = this.authManager.getAuthHeaders({
              isFormData: false,
              isJsonApi: this.authManager.isJsonApiRequest(settings.url || "", settings)
            });
            Object.entries(headers).forEach(([key2, value]) => {
              xhr.setRequestHeader(key2, value);
            });
          }
        });
      }
    }
    /**
     * 监控 AJAX 请求
     */
    monitorAjaxRequests() {
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const method = (init == null ? void 0 : init.method) || "GET";
        console.log("Fetch 请求:", {
          url,
          method,
          body: init == null ? void 0 : init.body
        });
        try {
          const response = await originalFetch.call(window, input, init);
          console.log("Fetch 成功:", {
            url,
            status: response.status,
            statusText: response.statusText
          });
          return response;
        } catch (error) {
          console.error("Fetch 失败:", {
            url,
            error
          });
          throw error;
        }
      };
      if (typeof window.$ !== "undefined") {
        const $ = window.$;
        const originalAjax = $.ajax;
        $.ajax = function(options) {
          console.log("jQuery AJAX 请求:", {
            url: options.url,
            method: options.type || options.method || "GET",
            data: options.data
          });
          const jqXHR = originalAjax.call(this, options);
          jqXHR.done((data, _textStatus, xhr) => {
            console.log("jQuery AJAX 成功:", {
              url: options.url,
              status: xhr.status,
              response: data
            });
          });
          jqXHR.fail((xhr, _textStatus, errorThrown) => {
            console.error("jQuery AJAX 失败:", {
              url: options.url,
              status: xhr.status,
              error: errorThrown,
              response: xhr.responseText
            });
          });
          return jqXHR;
        };
      }
    }
    /**
     * 初始化统一任务管理功能
     */
    async initUnifiedTaskManager() {
      try {
        console.log("=== 初始化统一任务管理功能 ===");
        if (!this.isIssueDetailPage()) {
          console.log("不在任务详情页面，跳过统一任务管理功能初始化");
          return;
        }
        await this.unifiedTaskManager.init();
        console.log("✓ 统一任务管理功能初始化完成");
      } catch (error) {
        console.error("统一任务管理功能初始化失败:", error);
      }
    }
    /**
     * 检查是否在任务详情页面
     */
    isIssueDetailPage() {
      const pathname = window.location.pathname;
      const isIssuePage = /\/issues\/\d+(?:[?#]|$)/.test(pathname);
      const hasIssueTree = document.querySelector("#issue_tree") !== null;
      return isIssuePage && hasIssueTree;
    }
    /**
     * 初始化批量任务创建器
     */
    initBatchTaskCreator() {
      this.batchCreator.init();
      console.log("✓ 批量任务创建器初始化完成");
    }
  }
  class GitlabAuthManager {
    constructor() {
      this.accessToken = null;
      this.csrfToken = null;
      this.lastTokenCheck = 0;
      this.TOKEN_CACHE_DURATION = 10 * 60 * 1e3;
    }
    // 10分钟缓存
    /**
     * 获取访问令牌
     */
    getAccessToken() {
      const now = Date.now();
      if (this.accessToken && now - this.lastTokenCheck < this.TOKEN_CACHE_DURATION) {
        return this.accessToken;
      }
      this.accessToken = this.extractAccessToken();
      this.lastTokenCheck = now;
      if (this.accessToken) {
        console.log("获取到 GitLab Access Token:", this.accessToken.substring(0, 10) + "...");
      } else {
        console.warn("未找到 GitLab Access Token");
        this.debugTokenSources();
      }
      return this.accessToken;
    }
    /**
     * 获取 CSRF Token
     */
    getCSRFToken() {
      if (this.csrfToken) {
        return this.csrfToken;
      }
      this.csrfToken = this.extractCSRFToken();
      if (this.csrfToken) {
        console.log("获取到 GitLab CSRF Token:", this.csrfToken.substring(0, 10) + "...");
      }
      return this.csrfToken;
    }
    /**
     * 从页面中提取访问令牌
     */
    extractAccessToken() {
      var _a, _b, _c, _d;
      if ((_a = window.gon) == null ? void 0 : _a.api_token) {
        const token22 = window.gon.api_token;
        console.log("从 gon.api_token 获取到 Token");
        return token22;
      }
      if ((_c = (_b = window.gl) == null ? void 0 : _b.client) == null ? void 0 : _c.token) {
        const token22 = window.gl.client.token;
        console.log("从 gl.client.token 获取到 Token");
        return token22;
      }
      try {
        const storedToken = localStorage.getItem("gitlab_token") || localStorage.getItem("access_token");
        if (storedToken) {
          console.log("从 localStorage 获取到 Token");
          return storedToken;
        }
      } catch (error) {
        console.warn("无法访问 localStorage:", error);
      }
      const scripts = document.querySelectorAll("script");
      for (const script of scripts) {
        const content = script.textContent || "";
        const tokenMatch = content.match(/(?:api_token|access_token)['"]?\s*[:=]\s*['"]([^'"]+)['"]/i);
        if (tokenMatch && tokenMatch[1] && tokenMatch[1].length > 10) {
          console.log("从页面脚本中提取到 Token");
          return tokenMatch[1];
        }
      }
      const token2 = (_d = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _d.getAttribute("content");
      if (token2) {
        console.log('从 meta[name="csrf-token"] 获取到 Token (作为备选)');
        return token2;
      }
      return null;
    }
    /**
     * 从页面中提取 CSRF Token
     */
    extractCSRFToken() {
      var _a, _b;
      let token2 = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
      if (token2) {
        return token2;
      }
      const tokenInput = document.querySelector('input[name="authenticity_token"]');
      if (tokenInput == null ? void 0 : tokenInput.value) {
        return tokenInput.value;
      }
      if ((_b = window.gon) == null ? void 0 : _b.csrf_token) {
        return window.gon.csrf_token;
      }
      return null;
    }
    /**
     * 调试 Token 来源
     */
    debugTokenSources() {
      console.log("=== GitLab Token 调试信息 ===");
      const metaTokens = document.querySelectorAll('meta[name*="token"], meta[name*="csrf"]');
      console.log("Meta 标签数量:", metaTokens.length);
      metaTokens.forEach((meta, index) => {
        const name = meta.getAttribute("name");
        const content = meta.getAttribute("content");
        console.log(`Meta ${index + 1}:`, name, "=", content ? content.substring(0, 10) + "..." : "null");
      });
      if (window.gon) {
        console.log("gon 对象存在:", Object.keys(window.gon));
      }
      if (window.gl) {
        console.log("gl 对象存在:", Object.keys(window.gl));
      }
      try {
        const keys = Object.keys(localStorage).filter(
          (key2) => key2.toLowerCase().includes("token") || key2.toLowerCase().includes("auth")
        );
        console.log("localStorage 中的认证相关键:", keys);
      } catch (error) {
        console.log("无法访问 localStorage");
      }
    }
    /**
     * 获取认证头信息
     */
    getAuthHeaders(options = {}) {
      const headers = {};
      const accessToken = this.getAccessToken();
      if (accessToken) {
        if (accessToken.startsWith("glpat-") || accessToken.length > 20) {
          headers["x-csrf-token"] = accessToken;
        } else {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
      const csrfToken = this.getCSRFToken();
      if (csrfToken && csrfToken !== accessToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }
      headers["X-Requested-With"] = "XMLHttpRequest";
      if (!options.skipContentType && options.isJsonApi) {
        headers["Content-Type"] = "application/json";
        headers["Accept"] = "application/json";
      }
      console.log("准备的认证头信息:", Object.keys(headers));
      return headers;
    }
    /**
     * 获取当前用户信息（从页面中提取）
     */
    getCurrentUserInfo() {
      var _a, _b, _c;
      if ((_a = window.gon) == null ? void 0 : _a.current_user_id) {
        return {
          id: (_b = window.gon.current_user_id) == null ? void 0 : _b.toString(),
          username: window.gon.current_username,
          name: window.gon.current_user_fullname
        };
      }
      const userAvatar = document.querySelector(".header-user-avatar, .avatar");
      if (userAvatar) {
        const userId = userAvatar.getAttribute("data-user-id");
        const username = userAvatar.getAttribute("data-username");
        const name = userAvatar.getAttribute("alt") || userAvatar.getAttribute("title");
        if (userId || username) {
          return { id: userId || void 0, username: username || void 0, name: name || void 0 };
        }
      }
      const userDropdown = document.querySelector(".header-user-dropdown-toggle");
      if (userDropdown) {
        const username = userDropdown.getAttribute("data-username");
        const name = (_c = userDropdown.textContent) == null ? void 0 : _c.trim();
        if (username) {
          return { username, name: name || void 0 };
        }
      }
      return null;
    }
    /**
     * 记录当前认证状态
     */
    logAuthStatus() {
      const accessToken = this.getAccessToken();
      const csrfToken = this.getCSRFToken();
      const userInfo = this.getCurrentUserInfo();
      console.log("=== GitLab 认证状态 ===");
      console.log("Access Token:", accessToken ? "✓ 已获取" : "✗ 未找到");
      console.log("CSRF Token:", csrfToken ? "✓ 已获取" : "✗ 未找到");
      console.log("用户信息:", userInfo || "✗ 未找到");
      if (!accessToken && !csrfToken) {
        console.warn("警告: 未找到任何认证信息，API 请求可能会失败");
      }
    }
    /**
     * 清除缓存的 token
     */
    clearTokenCache() {
      this.accessToken = null;
      this.csrfToken = null;
      this.lastTokenCheck = 0;
    }
  }
  class GitlabApiClient {
    constructor(authManager) {
      this.authManager = authManager;
      this.baseUrl = window.location.origin;
      this.apiBaseUrl = `${this.baseUrl}/api/v4`;
    }
    /**
     * 发送认证请求
     */
    async authenticatedRequest(url, options = {}) {
      const { isJsonApi = true, ...requestOptions } = options;
      const headers = {
        ...this.authManager.getAuthHeaders({
          isJsonApi,
          skipContentType: requestOptions.body instanceof FormData
        }),
        ...requestOptions.headers || {}
      };
      const finalOptions = {
        ...requestOptions,
        headers,
        credentials: "same-origin"
      };
      return fetch(url, finalOptions);
    }
    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/user`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取用户信息失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取项目信息
     */
    async getProject(projectPath) {
      const encodedPath = encodeURIComponent(projectPath);
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${encodedPath}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取项目信息失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取项目的 Pipelines
     */
    async getProjectPipelines(projectId, params = {}) {
      const queryParams = new URLSearchParams();
      if (params.username) queryParams.append("username", params.username);
      if (params.status) queryParams.append("status", params.status);
      if (params.ref) queryParams.append("ref", params.ref);
      queryParams.append("per_page", (params.per_page || 20).toString());
      queryParams.append("page", (params.page || 1).toString());
      const url = `${this.apiBaseUrl}/projects/${projectId}/pipelines?${queryParams.toString()}`;
      const response = await this.authenticatedRequest(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`获取 Pipelines 失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取 Pipeline 的 Jobs
     */
    async getPipelineJobs(projectId, pipelineId) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${projectId}/pipelines/${pipelineId}/jobs`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取 Pipeline Jobs 失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取项目的所有 Jobs
     */
    async getProjectJobs(projectId, params = {}) {
      const queryParams = new URLSearchParams();
      if (params.scope) {
        params.scope.forEach((scope) => queryParams.append("scope[]", scope));
      }
      queryParams.append("per_page", (params.per_page || 20).toString());
      queryParams.append("page", (params.page || 1).toString());
      const url = `${this.apiBaseUrl}/projects/${projectId}/jobs?${queryParams.toString()}`;
      const response = await this.authenticatedRequest(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`获取项目 Jobs 失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取用户的 Pipelines（跨项目）
     */
    async getUserPipelines(username, params = {}) {
      const projects = await this.getUserProjects(username);
      const allPipelines = [];
      for (const project of projects.slice(0, 10)) {
        try {
          const pipelines = await this.getProjectPipelines(project.id.toString(), {
            username,
            status: params.status,
            per_page: 5
            // 每个项目只获取最近5个
          });
          pipelines.forEach((pipeline) => {
            pipeline.project = {
              id: project.id,
              name: project.name,
              path_with_namespace: project.path_with_namespace
            };
          });
          allPipelines.push(...pipelines);
        } catch (error) {
          console.warn(`获取项目 ${project.name} 的 pipelines 失败:`, error);
        }
      }
      allPipelines.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return allPipelines.slice(0, params.per_page || 20);
    }
    /**
     * 获取用户参与的项目
     */
    async getUserProjects(username) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/users/${username}/projects?per_page=50`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取用户项目失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取 Job 详情
     */
    async getJob(projectId, jobId) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${projectId}/jobs/${jobId}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取 Job 详情失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 获取 Job 日志
     */
    async getJobTrace(projectId, jobId) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${projectId}/jobs/${jobId}/trace`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`获取 Job 日志失败: ${response.status}`);
      }
      return response.text();
    }
    /**
     * 重试 Job
     */
    async retryJob(projectId, jobId) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${projectId}/jobs/${jobId}/retry`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error(`重试 Job 失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 取消 Job
     */
    async cancelJob(projectId, jobId) {
      const response = await this.authenticatedRequest(
        `${this.apiBaseUrl}/projects/${projectId}/jobs/${jobId}/cancel`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error(`取消 Job 失败: ${response.status}`);
      }
      return response.json();
    }
    /**
     * 通用请求方法
     */
    async request(url, options = {}) {
      const fullUrl = url.startsWith("http") ? url : `${this.apiBaseUrl}${url}`;
      return this.authenticatedRequest(fullUrl, options);
    }
    /**
     * 获取 API 基础 URL
     */
    getApiBaseUrl() {
      return this.apiBaseUrl;
    }
  }
  var JobType = /* @__PURE__ */ ((JobType2) => {
    JobType2["MERGE_CHECK"] = "merge_check";
    JobType2["TAG_BUILD"] = "tag_build";
    JobType2["REGULAR_BUILD"] = "regular_build";
    JobType2["TEST"] = "test";
    JobType2["DEPLOY"] = "deploy";
    JobType2["OTHER"] = "other";
    return JobType2;
  })(JobType || {});
  class JobsChecker {
    constructor(apiClient) {
      this.dingTalkNotifier = null;
      this.projectInfo = null;
      this.lastCheckTime = 0;
      this.checkInterval = 15e3;
      this.notifiedJobs = /* @__PURE__ */ new Set();
      this.monitoringInterval = null;
      this.isMonitoring = false;
      this.monitoringJobs = /* @__PURE__ */ new Set();
      this.cachedUser = null;
      this.cacheExpireTime = 5 * 60 * 1e3;
      this.monitoringPipelines = /* @__PURE__ */ new Map();
      this.jobToPipelineMap = /* @__PURE__ */ new Map();
      this.activeNotifications = [];
      this.apiClient = apiClient;
    }
    /**
     * 设置钉钉通知器
     */
    setDingTalkNotifier(notifier) {
      this.dingTalkNotifier = notifier;
      notifier.setJobsChecker(this);
    }
    /**
     * 设置项目信息
     */
    setProjectInfo(projectInfo) {
      this.projectInfo = projectInfo;
    }
    /**
     * 识别Job类型（保留兼容性）
     * @deprecated 现在主要使用 identifyPipelineType，但保留此方法以备将来使用
     */
    // @ts-ignore - 保留此方法以备将来使用
    identifyJobType(job) {
      const jobName = job.name.toLowerCase();
      const pipelineRef = job.pipeline.ref.toLowerCase();
      if (pipelineRef.startsWith("v") || pipelineRef.startsWith("t") || pipelineRef.includes("tag") || jobName.includes("tag") || jobName.includes("release")) {
        return "tag_build";
      }
      if (pipelineRef.startsWith("feature/") || pipelineRef.includes("merge") || jobName.includes("merge") || jobName.includes("check") || job.stage === "test" || jobName.includes("test")) {
        return "merge_check";
      }
      if (jobName.includes("deploy") || job.stage === "deploy") {
        return "deploy";
      }
      if (jobName.includes("test") || job.stage === "test") {
        return "test";
      }
      if (jobName.includes("build") || job.stage === "build") {
        return "regular_build";
      }
      return "other";
    }
    /**
     * 识别Pipeline类型
     */
    identifyPipelineType(pipeline) {
      if (!pipeline || !pipeline.ref) {
        console.warn("Pipeline或ref为空，返回默认类型");
        return "regular_build";
      }
      const pipelineRef = pipeline.ref.toLowerCase();
      if (pipelineRef.startsWith("v") || pipelineRef.startsWith("t") || pipelineRef.includes("tag")) {
        return "tag_build";
      }
      if (pipelineRef.startsWith("refs/merge-requests/")) {
        return "merge_check";
      }
      if (pipelineRef === "main" || pipelineRef === "master" || pipelineRef === "develop") {
        return "regular_build";
      }
      if (pipelineRef.startsWith("feature/") || pipelineRef.startsWith("feat/")) {
        return "regular_build";
      }
      return "other";
    }
    /**
     * 分析Pipelines状态
     */
    analyzePipelines(pipelines) {
      const analysis = {
        total: pipelines.length,
        running: 0,
        pending: 0,
        tagBuilds: 0,
        mergeChecks: 0,
        regularBuilds: 0
      };
      pipelines.forEach((pipeline) => {
        if (pipeline.status === "running") analysis.running++;
        if (pipeline.status === "pending") analysis.pending++;
        const type = this.identifyPipelineType(pipeline);
        if (type === "tag_build") analysis.tagBuilds++;
        else if (type === "merge_check") analysis.mergeChecks++;
        else analysis.regularBuilds++;
      });
      return analysis;
    }
    /**
     * 显示Pipelines结果
     */
    displayPipelinesResult(analysis) {
      const message = `Pipeline状态统计：
总计: ${analysis.total}
运行中: ${analysis.running}
等待中: ${analysis.pending}
打Tag任务: ${analysis.tagBuilds}
合并检查: ${analysis.mergeChecks}
常规构建: ${analysis.regularBuilds}`;
      console.log(message);
      this.showNotification(message, "info");
    }
    /**
     * 检查 Jobs 状态
     */
    async checkJobs() {
      try {
        this.showInfo("开始检查 Jobs 状态...");
        if (!this.cachedUser || this.isCacheExpired()) {
          await this.refreshUserCache();
        }
        console.log("当前用户:", this.cachedUser.username);
        const pipelines = await this.getUserRecentPipelines(this.cachedUser.username);
        console.log(`找到 ${pipelines.length} 个 Pipelines`);
        const runningPipelines = [];
        for (const pipeline of pipelines) {
          if (pipeline.status === "running" || pipeline.status === "pending") {
            runningPipelines.push(pipeline);
          }
        }
        console.log(`找到 ${runningPipelines.length} 个执行中的 Pipelines`);
        if (runningPipelines.length === 0) {
          this.showNotification("没有发现执行中的Pipeline任务", "success");
          return;
        }
        const pipelineAnalysis = this.analyzePipelines(runningPipelines);
        this.displayPipelinesResult(pipelineAnalysis);
        runningPipelines.forEach((pipeline) => {
          const pipelineType = this.identifyPipelineType(pipeline);
          this.monitoringJobs.add(pipeline.id);
          if (!this.monitoringPipelines.has(pipeline.id)) {
            this.monitoringPipelines.set(pipeline.id, {
              ...pipeline,
              pipelineType
            });
          }
        });
        this.startContinuousMonitoring();
        this.showInfo(`已开始监控 ${runningPipelines.length} 个执行中的Pipeline任务`);
        this.lastCheckTime = Date.now();
      } catch (error) {
        console.error("检查 Jobs 失败:", error);
        this.showError("检查 Jobs 失败: " + error.message);
      }
    }
    /**
     * 检查缓存是否过期
     */
    isCacheExpired() {
      return Date.now() - this.lastCheckTime > this.cacheExpireTime;
    }
    /**
     * 刷新用户缓存
     */
    async refreshUserCache() {
      console.log("刷新用户缓存...");
      this.cachedUser = await this.getCurrentUser();
      if (!this.cachedUser) {
        throw new Error("无法获取当前用户信息");
      }
      console.log("用户缓存已更新:", this.cachedUser.username);
    }
    /**
     * 开始持续监控
     */
    startContinuousMonitoring() {
      if (this.isMonitoring) {
        console.log("已经在监控中，跳过");
        return;
      }
      this.isMonitoring = true;
      console.log("开始持续监控运行中的任务...");
      this.monitoringInterval = window.setInterval(async () => {
        try {
          await this.continuousCheck();
        } catch (error) {
          console.error("持续监控检查失败:", error);
        }
      }, this.checkInterval);
    }
    /**
     * 停止持续监控
     */
    stopContinuousMonitoring() {
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }
      this.isMonitoring = false;
      this.monitoringJobs.clear();
      this.monitoringPipelines.clear();
      this.jobToPipelineMap.clear();
      console.log("已停止持续监控并清理缓存");
    }
    /**
     * 持续检查监控中的Pipeline任务
     */
    async continuousCheck() {
      if (this.monitoringJobs.size === 0) {
        console.log("没有需要监控的Pipeline，停止监控");
        this.stopContinuousMonitoring();
        return;
      }
      console.log(`持续检查 ${this.monitoringJobs.size} 个监控中的Pipeline...`);
      try {
        if (!this.cachedUser) {
          console.warn("缓存的用户信息不存在，重新获取");
          await this.refreshUserCache();
        }
        const monitoringPipelinesList = [];
        const pipelines = await this.getUserRecentPipelines(this.cachedUser.username);
        for (const pipeline of pipelines) {
          if (this.monitoringJobs.has(pipeline.id)) {
            monitoringPipelinesList.push(pipeline);
          }
        }
        console.log(`找到 ${monitoringPipelinesList.length} 个监控中的Pipeline`);
        const completedPipelines = [];
        const stillRunningPipelines = [];
        for (const pipeline of monitoringPipelinesList) {
          const pipelineType = this.identifyPipelineType(pipeline);
          if (pipeline.status === "success" || pipeline.status === "failed") {
            completedPipelines.push({
              ...pipeline,
              pipelineType
            });
            this.monitoringJobs.delete(pipeline.id);
            this.monitoringPipelines.delete(pipeline.id);
            console.log(`Pipeline ${pipeline.id} 已完成，清理缓存`);
          } else if (pipeline.status === "running" || pipeline.status === "pending") {
            stillRunningPipelines.push(pipeline);
          } else {
            console.log(`Pipeline ${pipeline.id} 状态为 ${pipeline.status}，继续监控`);
          }
        }
        console.log(`检查完成：${completedPipelines.length} 个Pipeline已完成，${stillRunningPipelines.length} 个Pipeline仍在执行`);
        if (completedPipelines.length > 0) {
          console.log(`发现 ${completedPipelines.length} 个Pipeline已完成`);
          await this.checkAndNotifyPipelines(completedPipelines);
        }
        if (this.monitoringJobs.size === 0) {
          this.showInfo("所有监控的Pipeline已完成");
          this.stopContinuousMonitoring();
        }
      } catch (error) {
        console.error("持续检查失败:", error);
      }
    }
    /**
     * 获取合并请求信息
     */
    async getMergeRequestInfo(mrNumber) {
      try {
        var projectId = this.projectInfo.projectId;
        const response = await fetch(`/api/v4/projects/${projectId}/merge_requests/${mrNumber}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          console.warn(`获取合并请求信息失败: ${response.status} ${response.statusText}`);
          return null;
        }
        const mrData = await response.json();
        return {
          sourceBranch: mrData.source_branch || "未知分支",
          targetBranch: mrData.target_branch || "未知分支",
          webUrl: mrData.web_url || ""
        };
      } catch (error) {
        console.error("获取合并请求信息失败:", error);
        return null;
      }
    }
    /**
     * 检查并通知Pipeline完成
     */
    async checkAndNotifyPipelines(pipelines) {
      if (!this.dingTalkNotifier) {
        console.log("钉钉通知器未配置，跳过通知");
        return;
      }
      for (const pipeline of pipelines) {
        try {
          if (!pipeline.finished_at) {
            pipeline.finished_at = pipeline.updated_at;
          }
          const pipelineInfo = {
            id: pipeline.id,
            name: this.getPipelineDisplayName(pipeline),
            stage: "pipeline",
            status: pipeline.status,
            duration: this.calculatePipelineDuration(pipeline),
            created_at: pipeline.created_at,
            finished_at: pipeline.finished_at || pipeline.updated_at,
            web_url: pipeline.web_url,
            pipeline: {
              id: pipeline.id,
              ref: pipeline.ref,
              status: pipeline.status,
              web_url: pipeline.web_url
            },
            project: this.projectInfo ? {
              id: this.projectInfo.projectId || "",
              name: this.projectInfo.project,
              path_with_namespace: `${this.projectInfo.namespace}/${this.projectInfo.project}`
            } : {
              id: "",
              name: "unknown",
              path_with_namespace: "unknown/unknown"
            },
            jobType: pipeline.pipelineType
          };
          if (pipeline.status === "success") {
            await this.dingTalkNotifier.sendSuccessNotification(pipelineInfo);
          } else if (pipeline.status === "failed") {
            await this.dingTalkNotifier.sendFailureNotification(pipelineInfo);
          }
          console.log(`已发送Pipeline ${pipeline.id} 的${pipeline.status === "success" ? "成功" : "失败"}通知`);
        } catch (error) {
          console.error(`发送Pipeline ${pipeline.id} 通知失败:`, error);
        }
      }
    }
    /**
     * 获取Pipeline显示名称
     */
    getPipelineDisplayName(pipeline) {
      var _a;
      const ref = pipeline.ref;
      const pipelineType = this.identifyPipelineType(pipeline);
      if (pipelineType === "tag_build") {
        return ref;
      } else if (pipelineType === "merge_check") {
        if (ref.startsWith("refs/merge-requests/")) {
          const mrNumber = (_a = ref.match(/refs\/merge-requests\/(\d+)\/head/)) == null ? void 0 : _a[1];
          return mrNumber ? `merge-request-${mrNumber}` : "merge-check";
        }
        return "merge-check";
      }
      return ref;
    }
    /**
     * 计算Pipeline耗时
     */
    calculatePipelineDuration(pipeline) {
      if (pipeline.duration) {
        return pipeline.duration;
      }
      if (pipeline.created_at && pipeline.finished_at) {
        const start = new Date(pipeline.created_at).getTime();
        const end = new Date(pipeline.finished_at).getTime();
        return Math.round((end - start) / 1e3);
      }
      return 0;
    }
    /**
     * 获取当前用户信息
     */
    async getCurrentUser() {
      try {
        const userInfo = this.apiClient["authManager"].getCurrentUserInfo();
        if (userInfo && userInfo.username) {
          console.log("从页面获取到用户信息:", userInfo);
          return { username: userInfo.username, name: userInfo.name, id: userInfo.id };
        }
        console.log("尝试通过API获取用户信息...");
        return await this.apiClient.getCurrentUser();
      } catch (error) {
        console.error("获取用户信息失败:", error);
        const fallbackUser = {
          username: "current-user",
          name: "当前用户",
          id: "unknown"
        };
        console.warn("使用备选用户信息:", fallbackUser);
        return fallbackUser;
      }
    }
    /**
     * 获取用户最近的 Pipelines
     */
    async getUserRecentPipelines(username) {
      var _a;
      if ((_a = this.projectInfo) == null ? void 0 : _a.projectId) {
        return await this.apiClient.getProjectPipelines(this.projectInfo.projectId, {
          username,
          per_page: 5
        });
      } else {
        return await this.apiClient.getUserPipelines(username, {
          per_page: 10
        });
      }
    }
    /**
     * 显示通知（支持垂直堆叠显示）
     */
    showNotification(message, type = "success") {
      const notification = document.createElement("div");
      notification.className = `gitlab-jobs-notification gitlab-jobs-notification-${type}`;
      notification.innerHTML = `
      <div class="notification-content">
        <pre>${message}</pre>
        <button class="notification-close">×</button>
      </div>
    `;
      const topOffset = 20 + this.activeNotifications.length * 120;
      notification.style.top = `${topOffset}px`;
      const closeBtn = notification.querySelector(".notification-close");
      const closeNotification = () => {
        if (notification.parentNode) {
          notification.remove();
        }
        const index = this.activeNotifications.indexOf(notification);
        if (index > -1) {
          this.activeNotifications.splice(index, 1);
        }
        this.repositionNotifications();
      };
      closeBtn == null ? void 0 : closeBtn.addEventListener("click", closeNotification);
      document.body.appendChild(notification);
      this.activeNotifications.push(notification);
      setTimeout(closeNotification, 5e3);
    }
    /**
     * 重新调整通知位置
     */
    repositionNotifications() {
      this.activeNotifications.forEach((notification, index) => {
        const topOffset = 20 + index * 120;
        notification.style.top = `${topOffset}px`;
      });
    }
    /**
     * 显示信息提示
     */
    showInfo(message) {
      this.showNotification(message, "info");
    }
    /**
     * 显示错误信息
     */
    showError(message) {
      this.showNotification(message, "error");
    }
    /**
     * 测试任务检查 - 执行一次真实的任务检查并触发通知
     */
    async testJobsCheck() {
      if (!this.projectInfo) {
        throw new Error("项目信息未设置");
      }
      try {
        console.log("开始测试任务检查...");
        if (!this.dingTalkNotifier) {
          throw new Error("钉钉通知器未设置");
        }
        if (!this.cachedUser) {
          await this.refreshUserCache();
        }
        if (!this.cachedUser) {
          throw new Error("无法获取当前用户信息");
        }
        console.log(`获取用户 ${this.cachedUser.username} 的最近Pipeline...`);
        const pipelines = await this.getUserRecentPipelines(this.cachedUser.username);
        if (pipelines.length === 0) {
          console.log("没有找到Pipeline");
          return false;
        }
        console.log(`找到 ${pipelines.length} 个Pipeline，开始检查...`);
        const completedPipelines = [];
        for (let i = 0; i < Math.min(pipelines.length, 3); i++) {
          const pipeline = pipelines[i];
          if (pipeline.status === "success" || pipeline.status === "failed") {
            console.log(`处理Pipeline ${pipeline.id}, 状态: ${pipeline.status}`);
            const pipelineType = this.identifyPipelineType(pipeline);
            completedPipelines.push({
              ...pipeline,
              pipelineType
            });
          }
        }
        await this.checkAndNotifyPipelines(completedPipelines);
        return completedPipelines.length;
      } catch (error) {
        console.error("测试任务检查失败:", error);
        throw error;
      }
    }
    /**
     * 启动自动检查
     */
    startAutoCheck() {
      setInterval(() => {
        this.checkJobs();
      }, this.checkInterval);
    }
    /**
     * 停止自动检查
     */
    stopAutoCheck() {
    }
  }
  class DingTalkNotifier {
    constructor(storageKey = "dingtalk_config") {
      this.storageKey = storageKey;
      this.config = this.loadConfig();
    }
    /**
     * 加载配置
     */
    loadConfig() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn("加载钉钉配置失败:", error);
      }
      return {
        webhook: "",
        secret: "",
        enabled: false,
        atMobiles: [],
        atUserIds: [],
        isAtAll: false
      };
    }
    /**
     * 保存配置
     */
    saveConfig() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.config));
      } catch (error) {
        console.warn("保存钉钉配置失败:", error);
      }
    }
    /**
     * 设置钉钉配置
     */
    setConfig(config) {
      this.config = { ...this.config, ...config };
      this.saveConfig();
    }
    /**
     * 获取当前配置
     */
    getConfig() {
      return { ...this.config };
    }
    /**
     * 发送文本消息
     */
    async sendTextMessage(content, atMobiles, isAtAll) {
      if (!this.config.enabled || !this.config.webhook) {
        console.log("钉钉通知未启用或未配置 webhook");
        return;
      }
      const finalAtMobiles = [
        ...atMobiles || [],
        ...this.config.atMobiles || []
      ];
      const finalIsAtAll = isAtAll || this.config.isAtAll || false;
      const message = {
        msgtype: "text",
        text: {
          content
        },
        at: {
          atMobiles: finalAtMobiles,
          atUserIds: this.config.atUserIds || [],
          isAtAll: finalIsAtAll
        }
      };
      await this.sendMessage(message);
    }
    /**
     * 发送Markdown消息
     */
    async sendMarkdownMessage(title, text, atMobiles, isAtAll) {
      if (!this.config.enabled || !this.config.webhook) {
        console.log("钉钉通知未启用或未配置 webhook");
        return;
      }
      const finalAtMobiles = [
        ...atMobiles || [],
        ...this.config.atMobiles || []
      ];
      const finalIsAtAll = isAtAll || this.config.isAtAll || false;
      const message = {
        msgtype: "markdown",
        markdown: {
          title,
          text
        },
        at: {
          atMobiles: finalAtMobiles,
          atUserIds: this.config.atUserIds || [],
          isAtAll: finalIsAtAll
        }
      };
      await this.sendMessage(message);
    }
    /**
     * 发送链接消息
     */
    async sendLinkMessage(title, text, messageUrl, picUrl) {
      if (!this.config.enabled || !this.config.webhook) {
        console.log("钉钉通知未启用或未配置 webhook");
        return;
      }
      const message = {
        msgtype: "link",
        link: {
          title,
          text,
          messageUrl,
          picUrl: picUrl || ""
        }
      };
      await this.sendMessage(message);
    }
    /**
     * 发送消息到钉钉
     */
    async sendMessage(message) {
      try {
        const url = await this.buildWebhookUrl();
        if (typeof window.GM_xmlhttpRequest !== "undefined") {
          return new Promise((resolve, reject) => {
            window.GM_xmlhttpRequest({
              method: "POST",
              url,
              headers: {
                "Content-Type": "application/json"
              },
              data: JSON.stringify(message),
              onload: (response2) => {
                try {
                  if (response2.status >= 200 && response2.status < 300) {
                    const result2 = JSON.parse(response2.responseText);
                    if (result2.errcode !== 0) {
                      reject(new Error(`钉钉消息发送失败: ${result2.errmsg}`));
                    } else {
                      console.log("钉钉通知发送成功");
                      resolve();
                    }
                  } else {
                    reject(new Error(`钉钉 API 请求失败: ${response2.status}`));
                  }
                } catch (error) {
                  reject(error);
                }
              },
              onerror: (_error) => {
                reject(new Error("钉钉通知发送失败: 网络错误"));
              }
            });
          });
        }
        if (typeof chrome !== "undefined" && chrome.runtime) {
          console.log("🔄 Chrome 扩展环境：通过后台脚本发送钉钉请求");
          console.log("📤 发送URL:", url);
          console.log("📤 发送消息:", JSON.stringify(message, null, 2));
          return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
              type: "send-dingtalk-message",
              data: { url, message }
            }, (response2) => {
              if (chrome.runtime.lastError) {
                console.error("❌ Chrome运行时错误:", chrome.runtime.lastError.message);
                reject(new Error(chrome.runtime.lastError.message));
              } else if (response2 && response2.success) {
                console.log("✅ 钉钉消息发送成功");
                console.log("📥 后台脚本响应:", response2.result);
                resolve();
              } else {
                const error = (response2 == null ? void 0 : response2.error) || "未知错误";
                console.error("❌ 钉钉消息发送失败:", error);
                console.error("📥 后台脚本响应:", response2);
                reject(new Error(error));
              }
            });
          });
        }
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(message)
        });
        if (!response.ok) {
          throw new Error(`钉钉 API 请求失败: ${response.status}`);
        }
        const result = await response.json();
        if (result.errcode !== 0) {
          throw new Error(`钉钉消息发送失败: ${result.errmsg}`);
        }
        console.log("钉钉通知发送成功");
      } catch (error) {
        console.error("发送钉钉通知失败:", error);
        throw error;
      }
    }
    /**
     * 构建 webhook URL
     */
    async buildWebhookUrl() {
      let url = this.config.webhook;
      if (this.config.secret) {
        const timestamp = Date.now();
        const sign2 = await this.generateSign(timestamp, this.config.secret);
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}timestamp=${timestamp}&sign=${encodeURIComponent(sign2)}`;
      }
      return url;
    }
    /**
     * 生成签名
     */
    async generateSign(timestamp, secret) {
      const stringToSign = `${timestamp}
${secret}`;
      try {
        if (window.CryptoJS) {
          const hash = window.CryptoJS.HmacSHA256(stringToSign, secret);
          return window.CryptoJS.enc.Base64.stringify(hash);
        }
        if (window.crypto && window.crypto.subtle) {
          const encoder = new TextEncoder();
          const keyData = encoder.encode(secret);
          const messageData = encoder.encode(stringToSign);
          const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
          );
          const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, messageData);
          const signatureArray = new Uint8Array(signature);
          let binary = "";
          for (let i = 0; i < signatureArray.byteLength; i++) {
            binary += String.fromCharCode(signatureArray[i]);
          }
          return btoa(binary);
        }
        throw new Error("浏览器不支持加密功能，请使用支持Web Crypto API的现代浏览器");
      } catch (error) {
        console.error("生成签名失败:", error);
        throw new Error("签名生成失败: " + error.message);
      }
    }
    /**
     * 测试Pipeline通知（子类可以重写）
     */
    async testPipelineNotifications() {
      try {
        await this.sendMessage({
          msgtype: "text",
          text: {
            content: "🧪 任务通知测试\n\n这是一条测试消息，用于验证钉钉通知配置是否正确。\n\n如果您看到这条消息，说明配置成功！"
          },
          at: {
            atMobiles: this.config.atMobiles || [],
            atUserIds: this.config.atUserIds || [],
            isAtAll: this.config.isAtAll || false
          }
        });
        return true;
      } catch (error) {
        console.error("Pipeline通知测试失败:", error);
        return false;
      }
    }
    /**
     * 测试钉钉配置
     */
    async testConfig() {
      if (!this.config.webhook) {
        throw new Error("请先配置 webhook 地址");
      }
      try {
        if (!this.config.secret) {
          await this.sendTextMessage("这是一条来自增强器的测试消息（无签名）");
          return true;
        }
        await this.sendTextMessage("这是一条来自增强器的测试消息（带签名验证）");
        return true;
      } catch (error) {
        console.error("钉钉配置测试失败:", error);
        if (error instanceof Error && error.message.includes("签名不匹配")) {
          throw new Error("签名验证失败，请检查：\n1. 签名密钥是否正确\n2. 机器人是否启用了加签验证\n3. 时间同步是否正常");
        }
        throw error;
      }
    }
    /**
     * 显示配置对话框
     */
    showConfigDialog() {
      const dialog = document.createElement("div");
      dialog.className = "dingtalk-config-dialog";
      dialog.innerHTML = `
      <div class="dialog-overlay">
        <div class="dialog-content">
          <h3>钉钉通知配置</h3>
          <form class="config-form">
            <div class="form-group">
              <label for="webhook">Webhook 地址:</label>
              <input type="url" id="webhook" value="${this.config.webhook}" placeholder="https://oapi.dingtalk.com/robot/send?access_token=..." required>
            </div>
            <div class="form-group">
              <label for="secret">签名密钥 (可选):</label>
              <input type="text" id="secret" value="${this.config.secret || ""}" placeholder="签名密钥">
              <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
                如果钉钉机器人启用了"加签"安全设置，请填入签名密钥。如果选择了"自定义关键词"或"IP地址"，可以留空。
              </small>
            </div>
            <div class="form-group">
              <label for="atMobiles">@手机号 (可选):</label>
              <input type="text" id="atMobiles" value="${(this.config.atMobiles || []).join(", ")}" placeholder="13800138000, 13900139000">
              <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
                需要@的人的手机号，多个手机号用逗号分隔。手机号必须是钉钉群成员的手机号。
              </small>
            </div>
            <div class="form-group">
              <label for="atUserIds">@用户ID (可选):</label>
              <input type="text" id="atUserIds" value="${(this.config.atUserIds || []).join(", ")}" placeholder="user001, user002">
              <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
                需要@的人的用户ID，多个用户ID用逗号分隔。用户ID可以通过钉钉开放平台获取。
              </small>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="isAtAll" ${this.config.isAtAll ? "checked" : ""}>
                @所有人
              </label>
              <small style="color: #666; font-size: 12px; margin-top: 4px; display: block;">
                勾选后会@群里的所有人，请谨慎使用。
              </small>
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" id="enabled" ${this.config.enabled ? "checked" : ""}>
                启用钉钉通知
              </label>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-test">测试通知</button>
              <button type="button" class="btn-test-pipeline">任务通知测试</button>
              <button type="submit" class="btn-save">保存</button>
              <button type="button" class="btn-cancel">取消</button>
            </div>
          </form>
        </div>
      </div>
    `;
      const form = dialog.querySelector(".config-form");
      const testBtn = dialog.querySelector(".btn-test");
      const testPipelineBtn = dialog.querySelector(".btn-test-pipeline");
      const cancelBtn = dialog.querySelector(".btn-cancel");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveConfigFromForm(form);
        dialog.remove();
      });
      testBtn.addEventListener("click", async () => {
        const formData = this.getConfigFromForm(form);
        const originalConfig = { ...this.config };
        this.setConfig(formData);
        try {
          testBtn.disabled = true;
          testBtn.textContent = "测试中...";
          const success = await this.testConfig();
          alert(success ? "测试成功！" : "测试失败，请检查配置");
        } catch (error) {
          alert("测试失败: " + error.message);
        } finally {
          this.config = originalConfig;
          testBtn.disabled = false;
          testBtn.textContent = "测试通知";
        }
      });
      testPipelineBtn.addEventListener("click", async () => {
        const formData = this.getConfigFromForm(form);
        const originalConfig = { ...this.config };
        this.setConfig(formData);
        try {
          testPipelineBtn.disabled = true;
          testPipelineBtn.textContent = "测试中...";
          const success = await this.testPipelineNotifications();
          alert(success ? "任务通知测试完成！请检查钉钉群消息" : "任务通知测试失败，请检查配置");
        } catch (error) {
          alert("任务通知测试失败: " + error.message);
        } finally {
          this.config = originalConfig;
          testPipelineBtn.disabled = false;
          testPipelineBtn.textContent = "任务通知测试";
        }
      });
      cancelBtn.addEventListener("click", () => {
        dialog.remove();
      });
      document.body.appendChild(dialog);
    }
    /**
     * 从表单获取配置
     */
    getConfigFromForm(form) {
      const atMobilesInput = form.querySelector("#atMobiles").value;
      const atMobiles = atMobilesInput.split(",").map((mobile) => mobile.trim()).filter((mobile) => mobile.length > 0);
      const atUserIdsInput = form.querySelector("#atUserIds").value;
      const atUserIds = atUserIdsInput.split(",").map((userId) => userId.trim()).filter((userId) => userId.length > 0);
      return {
        webhook: form.querySelector("#webhook").value,
        secret: form.querySelector("#secret").value,
        atMobiles,
        atUserIds,
        isAtAll: form.querySelector("#isAtAll").checked,
        enabled: form.querySelector("#enabled").checked
      };
    }
    /**
     * 从表单保存配置
     */
    saveConfigFromForm(form) {
      const config = this.getConfigFromForm(form);
      this.setConfig(config);
      console.log("钉钉配置已保存");
    }
  }
  class GitlabDingTalkNotifier extends DingTalkNotifier {
    constructor() {
      super("gitlab_dingtalk_config");
      this.jobsChecker = null;
    }
    /**
     * 设置API客户端和项目信息
     */
    setApiClient(_apiClient) {
    }
    setProjectInfo(_projectInfo) {
    }
    /**
     * 设置JobsChecker引用
     */
    setJobsChecker(jobsChecker) {
      this.jobsChecker = jobsChecker;
    }
    /**
     * 重写Pipeline通知测试方法 - 直接调用任务检查逻辑
     */
    async testPipelineNotifications() {
      if (!this.jobsChecker) {
        console.error("JobsChecker未设置，无法进行任务通知测试");
        return super.testPipelineNotifications();
      }
      try {
        console.log("开始任务通知测试，调用真实的任务检查逻辑...");
        const result = await this.jobsChecker.testJobsCheck();
        if (result) {
          console.log("任务通知测试成功完成");
          return true;
        } else {
          console.log("任务通知测试未找到可通知的任务");
          await this.sendTextMessage("🧪 任务通知测试完成\n\n当前没有找到可通知的Pipeline任务。\n\n这可能是因为：\n1. 当前用户没有正在运行的Pipeline\n2. 最近没有完成的Pipeline任务\n3. 项目配置或权限问题\n\n如果您有正在运行或最近完成的Pipeline，请稍后再试。");
          return true;
        }
      } catch (error) {
        console.error("任务通知测试失败:", error);
        await this.sendTextMessage(`🧪 任务通知测试失败

错误信息：${error.message}

请检查：
1. GitLab API访问权限
2. 项目配置是否正确
3. 网络连接是否正常`);
        return false;
      }
    }
    /**
     * 发送成功通知
     */
    async sendSuccessNotification(job) {
      const { title, text } = await this.createSuccessMessage(job);
      await this.sendMarkdownMessage(title, text);
    }
    /**
     * 发送失败通知
     */
    async sendFailureNotification(job) {
      const { title, text } = await this.createFailureMessage(job);
      await this.sendMarkdownMessage(title, text);
    }
    /**
     * 创建成功消息
     */
    async createSuccessMessage(job) {
      const duration = this.formatDuration(job.duration);
      const jobTypeText = this.getJobTypeText(job.jobType);
      const emoji = this.getJobTypeEmoji(job.jobType);
      const atText = this.buildAtText();
      const branchInfo = await this.formatBranchNameWithLink(job.pipeline.ref, job.web_url, job.pipeline.web_url);
      return {
        title: `✅ ${jobTypeText}执行成功`,
        text: `## ${emoji} ${jobTypeText}执行成功

**项目**: ${job.project.path_with_namespace}

**任务**: ${job.name}

**类型**: ${jobTypeText}

**分支**: ${branchInfo.displayName}

**耗时**: ${duration}

**开始时间**: ${new Date(job.created_at || "").toLocaleString("zh-CN")}

**完成时间**: ${new Date(job.finished_at || "").toLocaleString("zh-CN")}

---

${branchInfo.links}${atText}`
      };
    }
    /**
     * 创建失败消息
     */
    async createFailureMessage(job) {
      const duration = this.formatDuration(job.duration);
      const jobTypeText = this.getJobTypeText(job.jobType);
      const emoji = this.getJobTypeEmoji(job.jobType, true);
      const atText = this.buildAtText();
      const branchInfo = await this.formatBranchNameWithLink(job.pipeline.ref, job.web_url, job.pipeline.web_url);
      return {
        title: `❌ ${jobTypeText}执行失败`,
        text: `## ${emoji} ${jobTypeText}执行失败

**项目**: ${job.project.path_with_namespace}

**任务**: ${job.name}

**类型**: ${jobTypeText}

**分支**: ${branchInfo.displayName}

**耗时**: ${duration}

**开始时间**: ${new Date(job.created_at || "").toLocaleString("zh-CN")}

**失败时间**: ${new Date(job.finished_at || "").toLocaleString("zh-CN")}

---

⚠️ **请及时检查并修复问题！**

${branchInfo.links}${atText}`
      };
    }
    /**
     * 格式化分支名称显示（带链接信息）
     */
    async formatBranchNameWithLink(ref, jobUrl, pipelineUrl) {
      if (ref.startsWith("refs/merge-requests/")) {
        const mrMatch = ref.match(/refs\/merge-requests\/(\d+)\/head/);
        if (mrMatch) {
          const mrNumber = mrMatch[1];
          const mrInfo = await this.jobsChecker.getMergeRequestInfo(mrNumber);
          if (mrInfo) {
            return {
              displayName: `${mrInfo.sourceBranch} → ${mrInfo.targetBranch} (MR #${mrNumber})`,
              links: `[查看合并请求](${mrInfo.webUrl}) | [查看任务](${jobUrl || "#"}) | [查看 Pipeline](${pipelineUrl || "#"})`
            };
          }
          return {
            displayName: `合并请求 #${mrNumber}`,
            links: `[查看任务](${jobUrl || "#"}) | [查看 Pipeline](${pipelineUrl || "#"})`
          };
        }
        return {
          displayName: "合并请求",
          links: `[查看任务](${jobUrl || "#"}) | [查看 Pipeline](${pipelineUrl || "#"})`
        };
      }
      return {
        displayName: ref,
        links: `[查看任务](${jobUrl || "#"}) | [查看 Pipeline](${pipelineUrl || "#"})`
      };
    }
    /**
     * 获取任务类型文本
     */
    getJobTypeText(jobType) {
      switch (jobType) {
        case JobType.MERGE_CHECK:
          return "合并任务";
        case JobType.TAG_BUILD:
          return "Tag任务";
        case JobType.REGULAR_BUILD:
          return "构建任务";
        case JobType.TEST:
          return "测试任务";
        case JobType.DEPLOY:
          return "部署任务";
        default:
          return "GitLab任务";
      }
    }
    /**
     * 获取任务类型表情符号
     */
    getJobTypeEmoji(jobType, isFailed = false) {
      if (isFailed) {
        switch (jobType) {
          case JobType.MERGE_CHECK:
            return "🚫";
          case JobType.TAG_BUILD:
            return "🏷️❌";
          case JobType.DEPLOY:
            return "🚀❌";
          default:
            return "❌";
        }
      } else {
        switch (jobType) {
          case JobType.MERGE_CHECK:
            return "✅";
          case JobType.TAG_BUILD:
            return "🏷️✅";
          case JobType.DEPLOY:
            return "🚀✅";
          default:
            return "✅";
        }
      }
    }
    /**
     * 格式化耗时
     */
    formatDuration(duration) {
      if (!duration) {
        return "未知";
      }
      const totalSeconds = Math.round(duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      if (minutes > 0) {
        return `${minutes}分${seconds}秒`;
      } else {
        return `${seconds}秒`;
      }
    }
    /**
     * 构建@文本
     */
    buildAtText() {
      const config = this.getConfig();
      const atParts = [];
      if (config.isAtAll) {
        atParts.push("@所有人");
      }
      if (config.atMobiles && config.atMobiles.length > 0) {
        config.atMobiles.forEach((mobile) => {
          atParts.push(`@${mobile}`);
        });
      }
      if (config.atUserIds && config.atUserIds.length > 0) {
        config.atUserIds.forEach((userId) => {
          atParts.push(`@${userId}`);
        });
      }
      return atParts.length > 0 ? `

${atParts.join(" ")}` : "";
    }
  }
  class StyleInjector2 {
    constructor() {
      this.injectedStyles = /* @__PURE__ */ new Set();
    }
    /**
     * 注入所有 GitLab 样式
     */
    injectGitlabStyles() {
      this.injectJobsCheckerStyles();
      this.injectNotificationStyles();
      this.injectConfigDialogStyles();
      this.injectQuickButtonStyles();
    }
    /**
     * 注入 Jobs 检查器样式
     */
    injectJobsCheckerStyles() {
      if (this.injectedStyles.has("jobs-checker")) return;
      const css = `
      /* GitLab Jobs 检查器按钮样式 */
      .gitlab-jobs-checker-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        margin-left: 8px;
        background-color: #fff;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        color: #303030;
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .gitlab-jobs-checker-btn:hover {
        background-color: #f0f0f0;
        border-color: #c4c4c4;
        text-decoration: none;
        color: #303030;
      }

      .gitlab-jobs-checker-btn:active {
        background-color: #e8e8e8;
        transform: translateY(1px);
      }

      .gitlab-jobs-checker-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
      }

      .gitlab-jobs-checker-btn svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .gitlab-jobs-checker-btn .gl-spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* GitLab 增强器控制区域 */
      .gitlab-enhancer-controls {
        display: inline-flex;
        align-items: center;
        margin-left: 16px;
      }

      /* 适配不同的 GitLab 版本和主题 */
      .project-header .gitlab-enhancer-controls,
      .breadcrumbs-container .gitlab-enhancer-controls {
        margin-left: auto;
      }

      /* 响应式设计 */
      @media (max-width: 768px) {
        .gitlab-jobs-checker-btn {
          padding: 4px 8px;
          font-size: 12px;
        }
        
        .gitlab-jobs-checker-btn svg {
          width: 14px;
          height: 14px;
        }
      }
    `;
      this.injectCSS("jobs-checker", css);
    }
    /**
     * 注入通知样式
     */
    injectNotificationStyles() {
      if (this.injectedStyles.has("notifications")) return;
      const css = `
      /* GitLab Jobs 通知样式 */
      .gitlab-jobs-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        min-width: 300px;
        z-index: 10000;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        transition: top 0.3s ease-out;
      }

      .gitlab-jobs-notification-success {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
      }

      .gitlab-jobs-notification-warning {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
      }

      .gitlab-jobs-notification-error {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
      }

      .gitlab-jobs-notification-info {
        background-color: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
      }

      .gitlab-jobs-notification .notification-content {
        padding: 16px;
        position: relative;
      }

      .gitlab-jobs-notification pre {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .gitlab-jobs-notification .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 18px;
        font-weight: bold;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        opacity: 0.7;
      }

      .gitlab-jobs-notification .notification-close:hover {
        opacity: 1;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* 多个通知的垂直堆叠效果 */
      .gitlab-jobs-notification + .gitlab-jobs-notification {
        margin-top: 10px;
      }
    `;
      this.injectCSS("notifications", css);
    }
    /**
     * 注入配置对话框样式
     */
    injectConfigDialogStyles() {
      if (this.injectedStyles.has("config-dialog")) return;
      const css = `
      /* 钉钉配置对话框样式 */
      .dingtalk-config-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
      }

      .dingtalk-config-dialog .dialog-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }

      .dingtalk-config-dialog .dialog-content {
        background: white;
        border-radius: 8px;
        padding: 24px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: scaleIn 0.2s ease-out;
      }

      .dingtalk-config-dialog h3 {
        margin: 0 0 20px 0;
        font-size: 18px;
        font-weight: 600;
        color: #303030;
      }

      .dingtalk-config-dialog .form-group {
        margin-bottom: 16px;
      }

      .dingtalk-config-dialog label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #303030;
        font-size: 14px;
      }

      .dingtalk-config-dialog input[type="url"],
      .dingtalk-config-dialog input[type="text"] {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s ease;
      }

      .dingtalk-config-dialog input[type="url"]:focus,
      .dingtalk-config-dialog input[type="text"]:focus {
        outline: none;
        border-color: #1f75cb;
        box-shadow: 0 0 0 2px rgba(31, 117, 203, 0.2);
      }

      .dingtalk-config-dialog input[type="checkbox"] {
        margin-right: 8px;
      }

      .dingtalk-config-dialog small {
        display: block;
        margin-top: 4px;
        color: #666;
        font-size: 12px;
        line-height: 1.4;
      }

      .dingtalk-config-dialog .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
        flex-wrap: wrap;
      }

      .dingtalk-config-dialog button {
        padding: 8px 16px;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .dingtalk-config-dialog .btn-save {
        background-color: #1f75cb;
        color: white;
        border-color: #1f75cb;
      }

      .dingtalk-config-dialog .btn-save:hover {
        background-color: #1a65b3;
        border-color: #1a65b3;
      }

      .dingtalk-config-dialog .btn-test {
        background-color: #28a745;
        color: white;
        border-color: #28a745;
      }

      .dingtalk-config-dialog .btn-test:hover {
        background-color: #218838;
        border-color: #218838;
      }

      .dingtalk-config-dialog .btn-test:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .dingtalk-config-dialog .btn-test-pipeline {
        background-color: #17a2b8;
        color: white;
        border-color: #17a2b8;
      }

      .dingtalk-config-dialog .btn-test-pipeline:hover {
        background-color: #138496;
        border-color: #138496;
      }

      .dingtalk-config-dialog .btn-test-pipeline:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .dingtalk-config-dialog .btn-cancel {
        background-color: #fff;
        color: #303030;
      }

      .dingtalk-config-dialog .btn-cancel:hover {
        background-color: #f8f9fa;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* 响应式设计 */
      @media (max-width: 480px) {
        .gitlab-dingtalk-config-dialog .dialog-content {
          min-width: auto;
          margin: 20px;
          width: calc(100% - 40px);
        }
      }
    `;
      this.injectCSS("config-dialog", css);
    }
    /**
     * 注入快捷按钮样式
     */
    injectQuickButtonStyles() {
      if (this.injectedStyles.has("quick-buttons")) return;
      const css = `
      /* GitLab 快捷按钮样式 - 模仿导航栏样式 */
      #fastWay {
        display: flex !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
        align-items: center !important;
        background: transparent !important;
      }

      #fastWay li {
        margin: 0 !important;
        padding: 0 !important;
        display: inline-block !important;
      }

      #fastWay li a {
        display: inline-block !important;
        background: transparent !important;
        color: rgba(255, 255, 255, 0.8) !important;
        text-decoration: none !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        border: none !important;
        transition: all 0.2s ease !important;
        line-height: 1.5 !important;
      }

      #fastWay li a:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: rgba(255, 255, 255, 1) !important;
        text-decoration: none !important;
      }

      #fastWay li a[style*="color:green"] {
        background: transparent !important;
        color: #4caf50 !important;
        border: none !important;
      }

      #fastWay li a[style*="color:green"]:hover {
        background: rgba(76, 175, 80, 0.1) !important;
        color: #66bb6a !important;
      }

      /* 确保快捷按钮容器正确集成到导航栏 */
      .navbar-nav .quick-buttons-container {
        display: flex !important;
        align-items: center !important;
        margin-right: 20px !important;
      }

      /* 兼容不同的导航栏结构 */
      .header-content .quick-buttons-container {
        display: flex !important;
        align-items: center !important;
        margin-right: 20px !important;
      }
    `;
      this.injectCSS("quick-buttons", css);
    }
    /**
     * 注入 CSS 样式
     */
    injectCSS(name, css) {
      if (this.injectedStyles.has(name)) {
        return;
      }
      const style = document.createElement("style");
      style.textContent = css;
      style.setAttribute("data-gitlab-enhancer", name);
      document.head.appendChild(style);
      this.injectedStyles.add(name);
      console.log(`GitLab 样式已注入: ${name}`);
    }
    /**
     * 移除样式
     */
    removeStyle(name) {
      const style = document.querySelector(`style[data-gitlab-enhancer="${name}"]`);
      if (style) {
        style.remove();
        this.injectedStyles.delete(name);
      }
    }
    /**
     * 移除所有样式
     */
    removeAllStyles() {
      const styles = document.querySelectorAll("style[data-gitlab-enhancer]");
      styles.forEach((style) => style.remove());
      this.injectedStyles.clear();
    }
  }
  class GitlabEnhancer extends BaseEnhancer {
    constructor() {
      super(...arguments);
      this.siteName = "GitLab";
    }
    /**
     * 检测当前网站是否匹配
     */
    detectSite() {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const isGitlabDomain = hostname === "git.xjjj.co";
      const isProjectPage = /^\/[^/]+\/[^/]+/.test(pathname);
      return isGitlabDomain && isProjectPage;
    }
    /**
     * 获取网站配置
     */
    getSiteConfig() {
      return {
        name: "GitLab",
        domains: ["git.xjjj.co"],
        features: ["jobsChecker", "dingTalkNotification", "pipelineMonitor"],
        apiEndpoint: "/api/v4",
        authMethod: "api-key"
      };
    }
    /**
     * 初始化核心功能
     */
    async initializeCore() {
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
          resolve();
        }
      });
      ConfigManager.getInstance();
      this.authManager = new GitlabAuthManager();
      this.apiClient = new GitlabApiClient(this.authManager);
      this.styleInjector = new StyleInjector2();
      this.jobsChecker = new JobsChecker(this.apiClient);
      this.dingTalkNotifier = new GitlabDingTalkNotifier();
      this.dingTalkNotifier.setApiClient(this.apiClient);
      this.jobsChecker.setDingTalkNotifier(this.dingTalkNotifier);
      console.log("GitLab 核心功能初始化完成");
    }
    /**
     * 初始化网站特定功能
     */
    async initializeFeatures() {
      this.registerFeature("authManager", this.authManager);
      this.registerFeature("apiClient", this.apiClient);
      this.registerFeature("jobsChecker", this.jobsChecker);
      this.registerFeature("dingTalkNotifier", this.dingTalkNotifier);
      this.styleInjector.injectGitlabStyles();
      await this.initJobsChecker();
      await this.addQuickButtons();
      console.log("GitLab 功能模块初始化完成");
    }
    /**
     * 初始化 Jobs 检查功能
     */
    async initJobsChecker() {
      try {
        let projectInfo = this.extractProjectInfo();
        if (!projectInfo) {
          console.warn("无法获取项目信息，跳过 Jobs 检查功能初始化");
          return;
        }
        this.jobsChecker.setProjectInfo(projectInfo);
        this.dingTalkNotifier.setProjectInfo(projectInfo);
        this.createJobsCheckButton();
        console.log("Jobs 检查功能初始化完成");
      } catch (error) {
        console.error("Jobs 检查功能初始化失败:", error);
      }
    }
    /**
     * 提取项目信息
     */
    extractProjectInfo() {
      const body = document.body;
      return {
        namespace: body.getAttribute("data-group") || "未知",
        project: body.getAttribute("data-project") || "未知",
        projectId: body.getAttribute("data-project-id") || "未知"
      };
    }
    /**
     * 创建 Jobs 检查按钮
     */
    createJobsCheckButton() {
      const targetContainer = this.findButtonContainer();
      if (!targetContainer) {
        console.warn("未找到合适的位置插入 Jobs 检查按钮");
        return;
      }
      const buttonGroup = document.createElement("div");
      buttonGroup.className = "gitlab-enhancer-controls";
      const checkButton = document.createElement("button");
      checkButton.className = "btn btn-default gitlab-jobs-checker-btn";
      checkButton.innerHTML = `
      <svg class="s16" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6L7 10.5 4.5 8 6 6.5l1 1 3-3L11.5 6z"/>
      </svg>
      检查 Jobs
    `;
      checkButton.title = "检查当前用户的 Pipeline Jobs 状态";
      checkButton.addEventListener("click", () => this.handleJobsCheck());
      const configButton = document.createElement("button");
      configButton.className = "btn btn-default gitlab-config-btn";
      configButton.innerHTML = `
      <svg class="s16" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
        <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    `;
      configButton.title = "配置钉钉通知";
      configButton.addEventListener("click", () => this.dingTalkNotifier.showConfigDialog());
      buttonGroup.appendChild(checkButton);
      buttonGroup.appendChild(configButton);
      targetContainer.appendChild(buttonGroup);
      console.log("GitLab 增强器按钮已创建");
    }
    /**
     * 查找按钮容器
     */
    findButtonContainer() {
      const selectors = [
        ".nav-controls",
        // GitLab 导航控制区域
        ".project-buttons",
        // 项目按钮区域
        ".breadcrumbs-container",
        // 面包屑容器
        ".project-home-panel .project-buttons",
        // 项目主页按钮区域
        ".tree-controls",
        // 文件树控制区域
        ".js-project-refs-dropdown-container"
        // 分支选择器容器
      ];
      for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container) {
          return container;
        }
      }
      const header = document.querySelector(".project-header, .breadcrumbs-container");
      if (header) {
        const container = document.createElement("div");
        container.className = "gitlab-enhancer-controls";
        header.appendChild(container);
        return container;
      }
      return null;
    }
    /**
     * 处理 Jobs 检查
     */
    async handleJobsCheck() {
      const button = document.querySelector(".gitlab-jobs-checker-btn");
      if (!button) return;
      try {
        button.disabled = true;
        button.innerHTML = `
        <svg class="s16 gl-spinner" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0v4l3-3 3 3V0H8zM0 8h4L1 5l3-3H0v6zm16-8v4l-3-3-3 3V0h6zM0 16h4l-3-3 3-3v6H0z"/>
        </svg>
        检查中...
      `;
        await this.jobsChecker.checkJobs();
      } catch (error) {
        console.error("Jobs 检查失败:", error);
      } finally {
        button.disabled = false;
        button.innerHTML = `
        <svg class="s16" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6L7 10.5 4.5 8 6 6.5l1 1 3-3L11.5 6z"/>
        </svg>
        检查 Jobs
      `;
      }
    }
    /**
     * 添加快捷按钮
     */
    async addQuickButtons() {
      try {
        await this.waitForElementOrNull(".nav-sidebar-inner-scroll .shortcuts-project[href]", 3e3);
        const projectLink = document.querySelector(".nav-sidebar-inner-scroll .shortcuts-project[href]");
        if (!projectLink) {
          console.warn("未找到项目链接，跳过快捷按钮添加");
          return;
        }
        const projectUrl = projectLink.href;
        console.log("项目URL:", projectUrl);
        let navContainer = document.querySelector(".navbar-gitlab .navbar-nav");
        if (!navContainer) {
          navContainer = document.querySelector(".header-content .navbar-nav");
        }
        if (!navContainer) {
          navContainer = document.querySelector(".navbar-nav");
        }
        if (!navContainer) {
          navContainer = document.querySelector(".header-content .title-container");
        }
        if (!navContainer) {
          console.warn("未找到合适的导航容器，跳过快捷按钮添加");
          return;
        }
        const quickButtonsContainer = document.createElement("ul");
        quickButtonsContainer.className = "nav navbar-nav quick-buttons-container";
        quickButtonsContainer.id = "fastWay";
        navContainer.insertBefore(quickButtonsContainer, navContainer.firstChild);
        this.addReleaseButton(projectUrl, true);
        this.addMergeButton(projectUrl);
        this.addNewBranchButton(projectUrl, true);
        this.addNewTagButton(projectUrl);
        this.addBranches(projectUrl, true);
        console.log("✓ GitLab 快捷按钮添加完成");
      } catch (error) {
        console.error("添加快捷按钮失败:", error);
      }
    }
    /**
     * 等待元素出现（GitLab特定版本，允许返回null）
     */
    waitForElementOrNull(selector, timeout = 5e3) {
      return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        const observer = new MutationObserver(() => {
          const element2 = document.querySelector(selector);
          if (element2) {
            observer.disconnect();
            resolve(element2);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
      });
    }
    /**
     * 添加发布检查按钮
     */
    addReleaseButton(url, greenFlag = false) {
      const fastWay = document.getElementById("fastWay");
      if (!fastWay) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}/-/branches/all?utf8=✓&search=rel" ${greenFlag ? 'style="color:green"' : ""}>check-release</a>`;
      fastWay.appendChild(li);
    }
    /**
     * 添加合并请求按钮
     */
    addMergeButton(url, greenFlag = false) {
      const fastWay = document.getElementById("fastWay");
      if (!fastWay) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}/-/merge_requests/new" ${greenFlag ? 'style="color:green"' : ""}>merge</a>`;
      fastWay.appendChild(li);
    }
    /**
     * 添加新分支按钮
     */
    addNewBranchButton(url, greenFlag = false) {
      const fastWay = document.getElementById("fastWay");
      if (!fastWay) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}/-/branches/new" ${greenFlag ? 'style="color:green"' : ""}>newBranch</a>`;
      fastWay.appendChild(li);
    }
    /**
     * 添加标签按钮
     */
    addNewTagButton(url, greenFlag = false) {
      const fastWay = document.getElementById("fastWay");
      if (!fastWay) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}/-/tags" ${greenFlag ? 'style="color:green"' : ""}>tags</a>`;
      fastWay.appendChild(li);
    }
    addBranches(url, greenFlag = false) {
      const fastWay = document.getElementById("fastWay");
      if (!fastWay) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="${url}/-/branches" ${greenFlag ? 'style="color:green"' : ""}>branches</a>`;
      fastWay.appendChild(li);
    }
  }
  class EnvironmentSwitcher {
    // 引用JsonToolEnhancer实例
    constructor() {
      this.switcher = null;
      this.isCollapsed = false;
      this.STORAGE_KEY = "envSwitcherPosition_Global";
      this.jsonToolEnhancer = null;
      this.environments = {
        prod: {
          name: "线上",
          urlPattern: "https://log.xjjj.co/",
          color: "#ff4d4f"
        },
        fat: {
          name: "FAT",
          urlPattern: "https://log.fat.xjjj.co/",
          color: "#1890ff"
        },
        uat: {
          name: "UAT",
          urlPattern: "https://log.uat.xjjj.co/",
          color: "#52c41a"
        }
      };
      this.addStyles();
      this.init();
    }
    /**
     * 添加样式
     */
    addStyles() {
      const css = `
      #env-switcher {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 4px 0 0 4px;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
        font-family: Arial, sans-serif;
        font-size: 12px;
        user-select: none;
      }

      #env-switcher .title {
        padding: 8px 12px;
        background: #f0f0f0;
        font-weight: bold;
        border-bottom: 1px solid #d9d9d9;
        text-align: center;
        cursor: move;
      }

      #env-switcher .button-container {
        display: flex;
        flex-direction: column;
        padding: 4px;
      }

      #env-switcher button {
        margin: 2px 0;
        padding: 6px 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: #fff;
        color: #000;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 12px;
      }

      #env-switcher button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      #env-switcher button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `;
      addStyle(css, "environment-switcher-styles");
    }
    /**
     * 检测当前环境
     */
    detectCurrentEnvironment() {
      const currentUrl = window.location.href;
      if (currentUrl.startsWith(this.environments.fat.urlPattern)) {
        return "fat";
      } else if (currentUrl.startsWith(this.environments.uat.urlPattern)) {
        return "uat";
      } else if (currentUrl.startsWith(this.environments.prod.urlPattern)) {
        return "prod";
      }
      return "prod";
    }
    /**
     * 创建环境切换器
     */
    createEnvironmentSwitcher() {
      this.switcher = createElement("div", {
        id: "env-switcher"
      });
      const title = createElement("div", {
        className: "title",
        textContent: "环境切换"
      });
      const buttonContainer = createElement("div", {
        className: "button-container"
      });
      const currentEnv = this.detectCurrentEnvironment();
      Object.keys(this.environments).forEach((envKey) => {
        const env = this.environments[envKey];
        const button = createElement("button", {
          textContent: env.name,
          styles: {
            background: currentEnv === envKey ? env.color : "#fff",
            color: currentEnv === envKey ? "#fff" : "#000"
          }
        });
        if (currentEnv === envKey) {
          button.disabled = true;
        } else {
          button.addEventListener("mouseenter", () => {
            button.style.background = env.color;
            button.style.color = "#fff";
          });
          button.addEventListener("mouseleave", () => {
            button.style.background = "#fff";
            button.style.color = "#000";
          });
          button.addEventListener("click", () => {
            this.switchToEnvironment(envKey);
          });
        }
        buttonContainer.appendChild(button);
      });
      const separator = createElement("div", {
        styles: {
          height: "1px",
          background: "#d9d9d9",
          margin: "4px 0"
        }
      });
      buttonContainer.appendChild(separator);
      const jsonButton = createElement("button", {
        textContent: "JSON转换",
        styles: {
          margin: "2px 0",
          padding: "6px 8px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          background: "#fff",
          color: "#000",
          cursor: "pointer",
          transition: "all 0.3s",
          fontSize: "12px"
        }
      });
      jsonButton.addEventListener("mouseenter", () => {
        jsonButton.style.background = "#1890ff";
        jsonButton.style.color = "#fff";
      });
      jsonButton.addEventListener("mouseleave", () => {
        jsonButton.style.background = "#fff";
        jsonButton.style.color = "#000";
      });
      jsonButton.addEventListener("click", () => {
        if (this.jsonToolEnhancer) {
          this.jsonToolEnhancer.showJsonToolWindow();
        } else {
          console.warn("JsonToolEnhancer 未初始化");
        }
      });
      buttonContainer.appendChild(jsonButton);
      this.switcher.appendChild(title);
      this.switcher.appendChild(buttonContainer);
      this.addDragFunctionality(title);
      this.addCollapseFunctionality(title, buttonContainer);
      this.restorePosition();
      document.body.appendChild(this.switcher);
      console.log("环境切换器已创建");
    }
    /**
     * 添加拖拽功能
     */
    addDragFunctionality(titleElement) {
      if (!this.switcher) return;
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      const startDrag = (e) => {
        if (!this.switcher) return;
        isDragging = true;
        const rect = this.switcher.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
      };
      const drag = (e) => {
        if (!isDragging || !this.switcher) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        const maxX = window.innerWidth - this.switcher.offsetWidth;
        const maxY = window.innerHeight - this.switcher.offsetHeight;
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        this.switcher.style.left = boundedX + "px";
        this.switcher.style.top = boundedY + "px";
      };
      const stopDrag = () => {
        isDragging = false;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
        this.savePosition();
      };
      titleElement.addEventListener("mousedown", startDrag);
    }
    /**
     * 添加折叠/展开功能
     */
    addCollapseFunctionality(titleElement, buttonContainer) {
      if (!this.switcher) return;
      titleElement.addEventListener("dblclick", () => {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
          buttonContainer.style.display = "none";
          this.switcher.style.width = "60px";
          titleElement.textContent = "ENV";
        } else {
          buttonContainer.style.display = "flex";
          this.switcher.style.width = "auto";
          titleElement.textContent = "环境切换";
        }
      });
    }
    /**
     * 保存位置
     */
    savePosition() {
      if (!this.switcher) return;
      const position = {
        left: this.switcher.style.left,
        top: this.switcher.style.top
      };
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(position));
      } catch (error) {
        console.warn("保存位置失败:", error);
      }
    }
    /**
     * 恢复位置
     */
    restorePosition() {
      if (!this.switcher) return;
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const position = JSON.parse(saved);
          if (position.left) this.switcher.style.left = position.left;
          if (position.top) this.switcher.style.top = position.top;
        }
      } catch (error) {
        console.warn("恢复位置失败:", error);
      }
    }
    /**
     * 切换到指定环境
     */
    switchToEnvironment(envKey) {
      const env = this.environments[envKey];
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      window.location.href = env.urlPattern + path.substring(1);
    }
    /**
     * 初始化
     */
    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.createEnvironmentSwitcher();
          this.startJsonConvertFeature();
        });
      } else {
        this.createEnvironmentSwitcher();
        this.startJsonConvertFeature();
      }
    }
    /**
     * 启动JSON转换功能
     */
    startJsonConvertFeature() {
      if (this.jsonToolEnhancer) {
        console.log("环境切换器启动JSON转换功能");
      }
    }
    /**
     * 销毁环境切换器
     */
    destroy() {
      if (this.switcher) {
        this.switcher.remove();
        this.switcher = null;
      }
    }
    /**
     * 获取当前环境
     */
    getCurrentEnvironment() {
      return this.detectCurrentEnvironment();
    }
    /**
     * 获取所有环境配置
     */
    getEnvironments() {
      return { ...this.environments };
    }
    /**
     * 设置JsonToolEnhancer实例
     */
    setJsonToolEnhancer(enhancer) {
      this.jsonToolEnhancer = enhancer;
    }
  }
  function createElementWithStyle(tagName, options = {}) {
    const element = document.createElement(tagName);
    if (options.className) {
      element.className = options.className;
    }
    if (options.id) {
      element.id = options.id;
    }
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    if (options.style) {
      element.style.cssText = options.style;
    }
    if (options.onclick) {
      element.onclick = options.onclick;
    }
    return element;
  }
  class JSONFormatter {
    constructor(jsonString) {
      try {
        this.data = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("Invalid JSON: " + e.message);
      }
    }
    /**
     * 格式化为HTML
     */
    toHTML() {
      return this.format(this.data, 1);
    }
    /**
     * 格式化数据
     */
    format(object, indentCount) {
      let htmlFragment = "";
      switch (this.getType(object)) {
        case "Null":
          htmlFragment = this.formatNull();
          break;
        case "Boolean":
          htmlFragment = this.formatBoolean(object);
          break;
        case "Number":
          htmlFragment = this.formatNumber(object);
          break;
        case "String":
          htmlFragment = this.formatString(object);
          break;
        case "Array":
          htmlFragment = this.formatArray(object, indentCount);
          break;
        case "Object":
          htmlFragment = this.formatObject(object, indentCount);
          break;
      }
      return htmlFragment;
    }
    /**
     * 获取数据类型
     */
    getType(object) {
      if (object === null) return "Null";
      if (typeof object === "boolean") return "Boolean";
      if (typeof object === "number") return "Number";
      if (typeof object === "string") return "String";
      if (Array.isArray(object)) return "Array";
      if (typeof object === "object") return "Object";
      return "Unknown";
    }
    /**
     * 格式化null值
     */
    formatNull() {
      return '<span class="json-null">null</span>';
    }
    /**
     * 格式化布尔值
     */
    formatBoolean(value) {
      return `<span class="json-boolean">${value}</span>`;
    }
    /**
     * 格式化数字
     */
    formatNumber(value) {
      return `<span class="json-number">${value}</span>`;
    }
    /**
     * 格式化字符串
     */
    formatString(value) {
      const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      if (/^https?:\/\//.test(value)) {
        return `<span class="json-string">"<a href="${value}" target="_blank" class="json-link">${escaped}</a>"</span>`;
      }
      return `<span class="json-string">"${escaped}"</span>`;
    }
    /**
     * 格式化数组
     */
    formatArray(array, indentCount) {
      const items = array.map(
        (item) => this.indentTab(indentCount) + this.format(item, indentCount + 1)
      );
      return `<span class="json-array" data-type="array" data-size="${array.length}" data-item-count="${array.length}"><span class="json-toggle json-toggle-minus" data-collapsed="false">−</span>[<div class="json-array-content">${items.join(",<br>")}</div><div class="json-collapsed-view" style="display: none;"><span class="json-ellipsis">...</span></div>${this.indentTab(indentCount - 1)}]</span>`;
    }
    /**
     * 格式化对象
     */
    formatObject(obj, indentCount) {
      const keys = Object.keys(obj);
      const items = keys.map(
        (key2) => `${this.indentTab(indentCount)}<span class="json-key">"${key2}"</span>: ${this.format(obj[key2], indentCount + 1)}`
      );
      return `<span class="json-object" data-type="object" data-item-count="${keys.length}"><span class="json-toggle json-toggle-minus" data-collapsed="false">−</span>{<div class="json-object-content">${items.join(",<br>")}</div><div class="json-collapsed-view" style="display: none;"><span class="json-ellipsis">...</span></div>${this.indentTab(indentCount - 1)}}</span>`;
    }
    /**
     * 生成缩进
     */
    indentTab(indentCount) {
      return "    ".repeat(indentCount);
    }
  }
  class JsonTool {
    // 0: 默认, 1: 升序, -1: 降序
    constructor(initialData = "") {
      this.overlay = null;
      this.dialog = null;
      this.textarea = null;
      this.resultContainer = null;
      this.statusBar = null;
      this.currentData = "";
      this.autoUnpackJsonString = false;
      this.sortMode = 0;
      this.currentData = initialData;
      this.createDialog();
    }
    /**
     * 创建弹窗
     */
    createDialog() {
      this.overlay = createElementWithStyle("div", {
        id: "json-tool-overlay",
        style: `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.5) !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      `
      });
      this.dialog = createElementWithStyle("div", {
        style: `
        background: #fff !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        width: 95% !important;
        max-width: 1200px !important;
        height: 90% !important;
        max-height: 800px !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      `
      });
      this.createHeader();
      this.createToolbar();
      this.createMainContent();
      this.createStatusBar();
      this.overlay.appendChild(this.dialog);
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }
    /**
     * 创建标题栏
     */
    createHeader() {
      const header = createElementWithStyle("div", {
        style: `
        padding: 16px 20px !important;
        border-bottom: 1px solid #e8e8e8 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        background: #fafafa !important;
      `
      });
      const title = createElementWithStyle("h3", {
        innerHTML: "JSON 格式化工具",
        style: `
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: #333 !important;
      `
      });
      const closeBtn = createElementWithStyle("button", {
        innerHTML: "×",
        style: `
        background: #ff4757 !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        width: 30px !important;
        height: 30px !important;
        font-size: 18px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      `,
        onclick: () => this.close()
      });
      header.appendChild(title);
      header.appendChild(closeBtn);
      this.dialog.appendChild(header);
    }
    /**
     * 创建工具栏
     */
    createToolbar() {
      const toolbar = createElementWithStyle("div", {
        style: `
        padding: 12px 20px !important;
        border-bottom: 1px solid #e8e8e8 !important;
        display: flex !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        background: #fff !important;
      `
      });
      const buttonRow1 = createElementWithStyle("div", {
        style: `
        display: flex !important;
        gap: 8px !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        width: 100% !important;
      `
      });
      const formatBtn = createElementWithStyle("button", {
        textContent: "格式化",
        style: `
        padding: 6px 12px !important;
        background: #1890ff !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      `,
        onclick: () => this.formatJson()
      });
      const compressBtn = createElementWithStyle("button", {
        textContent: "压缩",
        style: `
        padding: 6px 12px !important;
        background: #52c41a !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      `,
        onclick: () => this.compressJson()
      });
      const validateBtn = createElementWithStyle("button", {
        textContent: "验证",
        style: `
        padding: 6px 12px !important;
        background: #fa8c16 !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      `,
        onclick: () => this.validateJson()
      });
      const copyBtn = createElementWithStyle("button", {
        textContent: "复制",
        style: `
        padding: 6px 12px !important;
        background: #722ed1 !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      `,
        onclick: () => this.copyToClipboard()
      });
      const clearBtn = createElementWithStyle("button", {
        textContent: "清空",
        style: `
        padding: 6px 12px !important;
        background: #f5222d !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 12px !important;
      `,
        onclick: () => this.clearContent()
      });
      const separator1 = createElementWithStyle("span", {
        textContent: "|",
        style: `
        color: #d9d9d9 !important;
        margin: 0 4px !important;
        font-size: 14px !important;
      `
      });
      const nestedLabel = createElementWithStyle("label", {
        innerHTML: `
        <input type="checkbox" style="margin-right: 4px !important;">
        支持嵌套解析
      `,
        style: `
        display: flex !important;
        align-items: center !important;
        font-size: 12px !important;
        color: #666 !important;
        cursor: pointer !important;
        user-select: none !important;
      `
      });
      const nestedCheckbox = nestedLabel.querySelector("input");
      nestedCheckbox.addEventListener("change", () => {
        this.autoUnpackJsonString = nestedCheckbox.checked;
        this.updateJsonView();
      });
      const separator2 = createElementWithStyle("span", {
        textContent: "|",
        style: `
        color: #d9d9d9 !important;
        margin: 0 4px !important;
        font-size: 14px !important;
      `
      });
      const sortContainer = createElementWithStyle("div", {
        style: `
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      `
      });
      const sortLabel = createElementWithStyle("span", {
        textContent: "排序：",
        style: `
        font-size: 12px !important;
        color: #666 !important;
      `
      });
      const sortDefault = createElementWithStyle("label", {
        innerHTML: `
        <input type="radio" name="json-sort" value="0" checked style="margin-right: 4px !important;">
        默认
      `,
        style: `
        display: flex !important;
        align-items: center !important;
        font-size: 12px !important;
        color: #666 !important;
        cursor: pointer !important;
        user-select: none !important;
      `
      });
      const sortAsc = createElementWithStyle("label", {
        innerHTML: `
        <input type="radio" name="json-sort" value="1" style="margin-right: 4px !important;">
        升序
      `,
        style: `
        display: flex !important;
        align-items: center !important;
        font-size: 12px !important;
        color: #666 !important;
        cursor: pointer !important;
        user-select: none !important;
      `
      });
      const sortDesc = createElementWithStyle("label", {
        innerHTML: `
        <input type="radio" name="json-sort" value="-1" style="margin-right: 4px !important;">
        降序
      `,
        style: `
        display: flex !important;
        align-items: center !important;
        font-size: 12px !important;
        color: #666 !important;
        cursor: pointer !important;
        user-select: none !important;
      `
      });
      const sortRadios = [sortDefault, sortAsc, sortDesc];
      sortRadios.forEach((label) => {
        const radio = label.querySelector("input");
        radio.addEventListener("change", () => {
          if (radio.checked) {
            this.sortMode = parseInt(radio.value);
            this.updateJsonView();
          }
        });
      });
      buttonRow1.appendChild(formatBtn);
      buttonRow1.appendChild(compressBtn);
      buttonRow1.appendChild(validateBtn);
      buttonRow1.appendChild(copyBtn);
      buttonRow1.appendChild(clearBtn);
      buttonRow1.appendChild(separator1);
      buttonRow1.appendChild(nestedLabel);
      buttonRow1.appendChild(separator2);
      buttonRow1.appendChild(sortContainer);
      sortContainer.appendChild(sortLabel);
      sortContainer.appendChild(sortDefault);
      sortContainer.appendChild(sortAsc);
      sortContainer.appendChild(sortDesc);
      toolbar.appendChild(buttonRow1);
      this.dialog.appendChild(toolbar);
    }
    /**
     * 创建主要内容区域
     */
    createMainContent() {
      const mainContent = createElementWithStyle("div", {
        style: `
        flex: 1 !important;
        display: flex !important;
        overflow: hidden !important;
      `
      });
      const leftPanel = createElementWithStyle("div", {
        style: `
        width: 50% !important;
        display: flex !important;
        flex-direction: column !important;
        border-right: 1px solid #e8e8e8 !important;
      `
      });
      const leftHeader = createElementWithStyle("div", {
        textContent: "JSON 输入",
        style: `
        padding: 8px 16px !important;
        background: #f5f5f5 !important;
        border-bottom: 1px solid #e8e8e8 !important;
        font-weight: 600 !important;
        font-size: 14px !important;
      `
      });
      this.textarea = createElementWithStyle("textarea", {
        style: `
        flex: 1 !important;
        border: none !important;
        outline: none !important;
        padding: 16px !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        resize: none !important;
        background: #fff !important;
      `
      });
      const rightPanel = createElementWithStyle("div", {
        style: `
        width: 50% !important;
        display: flex !important;
        flex-direction: column !important;
      `
      });
      const rightHeader = createElementWithStyle("div", {
        textContent: "JSON 视图",
        style: `
        padding: 8px 16px !important;
        background: #f5f5f5 !important;
        border-bottom: 1px solid #e8e8e8 !important;
        font-weight: 600 !important;
        font-size: 14px !important;
      `
      });
      this.resultContainer = createElementWithStyle("div", {
        style: `
        flex: 1 !important;
        padding: 16px !important;
        overflow: auto !important;
        background: #fff !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
      `
      });
      leftPanel.appendChild(leftHeader);
      leftPanel.appendChild(this.textarea);
      rightPanel.appendChild(rightHeader);
      rightPanel.appendChild(this.resultContainer);
      mainContent.appendChild(leftPanel);
      mainContent.appendChild(rightPanel);
      this.dialog.appendChild(mainContent);
      this.textarea.addEventListener("input", () => {
        this.updateJsonView();
      });
    }
    /**
     * 创建状态栏
     */
    createStatusBar() {
      this.statusBar = createElementWithStyle("div", {
        style: `
        padding: 8px 20px !important;
        border-top: 1px solid #e8e8e8 !important;
        background: #f5f5f5 !important;
        font-size: 12px !important;
        color: #666 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      `
      });
      this.dialog.appendChild(this.statusBar);
    }
    /**
     * 显示弹窗
     */
    show() {
      if (this.overlay) {
        document.body.appendChild(this.overlay);
        if (this.currentData && this.textarea) {
          this.textarea.value = this.currentData;
          this.updateJsonView();
          this.textarea.focus();
        }
      }
    }
    /**
     * 关闭弹窗
     */
    close() {
      if (this.overlay) {
        this.overlay.remove();
      }
    }
    /**
     * 格式化JSON
     */
    formatJson() {
      if (!this.textarea) return;
      try {
        const jsonObj = JSON.parse(this.textarea.value);
        this.textarea.value = JSON.stringify(jsonObj, null, 2);
        this.updateJsonView();
        this.showMessage("JSON格式化成功", "success");
      } catch (e) {
        this.showMessage("JSON格式错误: " + e.message, "error");
      }
    }
    /**
     * 压缩JSON
     */
    compressJson() {
      if (!this.textarea) return;
      try {
        const jsonObj = JSON.parse(this.textarea.value);
        this.textarea.value = JSON.stringify(jsonObj);
        this.updateJsonView();
        this.showMessage("JSON压缩成功", "success");
      } catch (e) {
        this.showMessage("JSON格式错误: " + e.message, "error");
      }
    }
    /**
     * 验证JSON
     */
    validateJson() {
      if (!this.textarea) return;
      try {
        JSON.parse(this.textarea.value);
        this.showMessage("JSON格式正确", "success");
      } catch (e) {
        this.showMessage("JSON格式错误: " + e.message, "error");
      }
    }
    /**
     * 复制到剪贴板
     */
    async copyToClipboard() {
      if (!this.textarea) return;
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(this.textarea.value);
        } else {
          this.textarea.select();
          document.execCommand("copy");
        }
        this.showMessage("已复制到剪贴板", "success");
      } catch (e) {
        this.showMessage("复制失败", "error");
      }
    }
    /**
     * 清空内容
     */
    clearContent() {
      if (this.textarea) {
        this.textarea.value = "";
        this.updateJsonView();
        this.showMessage("内容已清空", "success");
      }
    }
    /**
     * 更新JSON视图
     */
    updateJsonView() {
      if (!this.textarea || !this.resultContainer || !this.statusBar) return;
      const content = this.textarea.value.trim();
      if (!content) {
        this.resultContainer.innerHTML = '<div style="color: #999; text-align: center; padding: 40px;">请输入JSON数据</div>';
        this.statusBar.innerHTML = "<span>就绪</span>";
        return;
      }
      try {
        let parsed = JSON.parse(content);
        if (this.autoUnpackJsonString) {
          parsed = this.unpackNestedJsonStrings(parsed);
        }
        if (this.sortMode !== 0) {
          parsed = this.sortJsonKeys(parsed, this.sortMode);
        }
        const formatter = new JSONFormatter(JSON.stringify(parsed));
        this.resultContainer.innerHTML = formatter.toHTML();
        this.addToggleListeners();
        const lines = content.split("\n").length;
        const chars = content.length;
        const statusText = this.autoUnpackJsonString || this.sortMode !== 0 ? `有效的JSON (已处理) - ${chars} 字符，${lines} 行` : `有效的JSON - ${chars} 字符，${lines} 行`;
        this.statusBar.innerHTML = `<span>${statusText}</span>`;
      } catch (e) {
        this.resultContainer.innerHTML = `<div style="color: #f5222d; padding: 20px;">
        <strong>JSON解析错误:</strong><br>
        ${e.message}
      </div>`;
        this.statusBar.innerHTML = '<span style="color: #f5222d;">JSON格式错误</span>';
      }
    }
    /**
     * 添加折叠/展开监听器
     */
    addToggleListeners() {
      if (!this.resultContainer) return;
      const toggles = this.resultContainer.querySelectorAll(".json-toggle");
      toggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = e.target;
          const parent2 = target.parentElement;
          if (!parent2) return;
          const isCollapsed = target.getAttribute("data-collapsed") === "true";
          if (isCollapsed) {
            target.textContent = "−";
            target.setAttribute("data-collapsed", "false");
            target.classList.remove("json-toggle-plus");
            target.classList.add("json-toggle-minus");
            parent2.classList.remove("collapsed");
          } else {
            target.textContent = "+";
            target.setAttribute("data-collapsed", "true");
            target.classList.remove("json-toggle-minus");
            target.classList.add("json-toggle-plus");
            parent2.classList.add("collapsed");
          }
        });
      });
    }
    /**
     * 嵌套解析JSON字符串
     */
    unpackNestedJsonStrings(obj) {
      if (typeof obj === "string") {
        try {
          const trimmed = obj.trim();
          if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) {
            const parsed = JSON.parse(trimmed);
            return this.unpackNestedJsonStrings(parsed);
          }
        } catch (e) {
        }
        return obj;
      } else if (Array.isArray(obj)) {
        return obj.map((item) => this.unpackNestedJsonStrings(item));
      } else if (obj !== null && typeof obj === "object") {
        const result = {};
        for (const key2 in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key2)) {
            result[key2] = this.unpackNestedJsonStrings(obj[key2]);
          }
        }
        return result;
      }
      return obj;
    }
    /**
     * 排序JSON对象的键
     */
    sortJsonKeys(obj, sortMode) {
      if (Array.isArray(obj)) {
        return obj.map((item) => this.sortJsonKeys(item, sortMode));
      } else if (obj !== null && typeof obj === "object") {
        const keys = Object.keys(obj);
        if (sortMode === 1) {
          keys.sort();
        } else if (sortMode === -1) {
          keys.sort().reverse();
        }
        const result = {};
        keys.forEach((key2) => {
          result[key2] = this.sortJsonKeys(obj[key2], sortMode);
        });
        return result;
      }
      return obj;
    }
    /**
     * 显示消息提示
     */
    showMessage(message, type) {
      const messageEl = createElementWithStyle("div", {
        textContent: message,
        style: `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        padding: 12px 16px !important;
        background: ${type === "success" ? "#52c41a" : "#f5222d"} !important;
        color: white !important;
        border-radius: 4px !important;
        z-index: 100000 !important;
        font-size: 14px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        max-width: 300px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
      `
      });
      document.body.appendChild(messageEl);
      setTimeout(() => {
        messageEl.remove();
      }, 3e3);
    }
  }
  const jsonToolStyles = `
  .json-null { color: #f1592a; font-weight: bold; }
  .json-boolean { color: #f98280; font-weight: bold; }
  .json-number { color: #25aae2; font-weight: bold; }
  .json-string { color: #3ab54a; font-weight: bold; }
  .json-key { color: #92278f; font-weight: bold; }
  .json-link { color: #61D2D6; font-weight: bold; text-decoration: none; }
  .json-link:hover { text-decoration: underline; }
  .json-toggle {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    margin-right: 4px;
    user-select: none;
  }
  .json-toggle:hover {
    background: #e0e0e0;
  }
  .json-array-content,
  .json-object-content {
    margin-left: 20px;
  }
  .json-collapsed-view {
    display: inline;
  }
  .json-ellipsis {
    color: #999;
    font-style: italic;
  }

  /* 使用CSS伪元素实现统计信息 */
  .json-object.collapsed::after,
  .json-array.collapsed::after {
    color: #999;
    font-style: italic;
    margin-left: 4px;
    content: "// " attr(data-item-count) " items";
  }

  /* 折叠状态的样式 */
  .json-object.collapsed .json-object-content,
  .json-array.collapsed .json-array-content {
    display: none !important;
  }

  .json-object.collapsed .json-collapsed-view,
  .json-array.collapsed .json-collapsed-view {
    display: inline !important;
  }
`;
  function injectJsonToolStyles() {
    const styleId = "json-tool-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = jsonToolStyles;
    document.head.appendChild(style);
  }
  injectJsonToolStyles();
  var Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
  var ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
  var ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
  var unicode = {
    Space_Separator,
    ID_Start,
    ID_Continue
  };
  var util = {
    isSpaceSeparator(c2) {
      return typeof c2 === "string" && unicode.Space_Separator.test(c2);
    },
    isIdStartChar(c2) {
      return typeof c2 === "string" && (c2 >= "a" && c2 <= "z" || c2 >= "A" && c2 <= "Z" || c2 === "$" || c2 === "_" || unicode.ID_Start.test(c2));
    },
    isIdContinueChar(c2) {
      return typeof c2 === "string" && (c2 >= "a" && c2 <= "z" || c2 >= "A" && c2 <= "Z" || c2 >= "0" && c2 <= "9" || c2 === "$" || c2 === "_" || c2 === "‌" || c2 === "‍" || unicode.ID_Continue.test(c2));
    },
    isDigit(c2) {
      return typeof c2 === "string" && /[0-9]/.test(c2);
    },
    isHexDigit(c2) {
      return typeof c2 === "string" && /[0-9A-Fa-f]/.test(c2);
    }
  };
  let source;
  let parseState;
  let stack;
  let pos;
  let line;
  let column;
  let token;
  let key;
  let root;
  var parse = function parse2(text, reviver) {
    source = String(text);
    parseState = "start";
    stack = [];
    pos = 0;
    line = 1;
    column = 0;
    token = void 0;
    key = void 0;
    root = void 0;
    do {
      token = lex();
      parseStates[parseState]();
    } while (token.type !== "eof");
    if (typeof reviver === "function") {
      return internalize({ "": root }, "", reviver);
    }
    return root;
  };
  function internalize(holder, name, reviver) {
    const value = holder[name];
    if (value != null && typeof value === "object") {
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const key2 = String(i);
          const replacement = internalize(value, key2, reviver);
          if (replacement === void 0) {
            delete value[key2];
          } else {
            Object.defineProperty(value, key2, {
              value: replacement,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      } else {
        for (const key2 in value) {
          const replacement = internalize(value, key2, reviver);
          if (replacement === void 0) {
            delete value[key2];
          } else {
            Object.defineProperty(value, key2, {
              value: replacement,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      }
    }
    return reviver.call(holder, name, value);
  }
  let lexState;
  let buffer;
  let doubleQuote;
  let sign;
  let c;
  function lex() {
    lexState = "default";
    buffer = "";
    doubleQuote = false;
    sign = 1;
    for (; ; ) {
      c = peek();
      const token2 = lexStates[lexState]();
      if (token2) {
        return token2;
      }
    }
  }
  function peek() {
    if (source[pos]) {
      return String.fromCodePoint(source.codePointAt(pos));
    }
  }
  function read() {
    const c2 = peek();
    if (c2 === "\n") {
      line++;
      column = 0;
    } else if (c2) {
      column += c2.length;
    } else {
      column++;
    }
    if (c2) {
      pos += c2.length;
    }
    return c2;
  }
  const lexStates = {
    default() {
      switch (c) {
        case "	":
        case "\v":
        case "\f":
        case " ":
        case " ":
        case "\uFEFF":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
          read();
          return;
        case "/":
          read();
          lexState = "comment";
          return;
        case void 0:
          read();
          return newToken("eof");
      }
      if (util.isSpaceSeparator(c)) {
        read();
        return;
      }
      return lexStates[parseState]();
    },
    comment() {
      switch (c) {
        case "*":
          read();
          lexState = "multiLineComment";
          return;
        case "/":
          read();
          lexState = "singleLineComment";
          return;
      }
      throw invalidChar(read());
    },
    multiLineComment() {
      switch (c) {
        case "*":
          read();
          lexState = "multiLineCommentAsterisk";
          return;
        case void 0:
          throw invalidChar(read());
      }
      read();
    },
    multiLineCommentAsterisk() {
      switch (c) {
        case "*":
          read();
          return;
        case "/":
          read();
          lexState = "default";
          return;
        case void 0:
          throw invalidChar(read());
      }
      read();
      lexState = "multiLineComment";
    },
    singleLineComment() {
      switch (c) {
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
          read();
          lexState = "default";
          return;
        case void 0:
          read();
          return newToken("eof");
      }
      read();
    },
    value() {
      switch (c) {
        case "{":
        case "[":
          return newToken("punctuator", read());
        case "n":
          read();
          literal("ull");
          return newToken("null", null);
        case "t":
          read();
          literal("rue");
          return newToken("boolean", true);
        case "f":
          read();
          literal("alse");
          return newToken("boolean", false);
        case "-":
        case "+":
          if (read() === "-") {
            sign = -1;
          }
          lexState = "sign";
          return;
        case ".":
          buffer = read();
          lexState = "decimalPointLeading";
          return;
        case "0":
          buffer = read();
          lexState = "zero";
          return;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          buffer = read();
          lexState = "decimalInteger";
          return;
        case "I":
          read();
          literal("nfinity");
          return newToken("numeric", Infinity);
        case "N":
          read();
          literal("aN");
          return newToken("numeric", NaN);
        case '"':
        case "'":
          doubleQuote = read() === '"';
          buffer = "";
          lexState = "string";
          return;
      }
      throw invalidChar(read());
    },
    identifierNameStartEscape() {
      if (c !== "u") {
        throw invalidChar(read());
      }
      read();
      const u = unicodeEscape();
      switch (u) {
        case "$":
        case "_":
          break;
        default:
          if (!util.isIdStartChar(u)) {
            throw invalidIdentifier();
          }
          break;
      }
      buffer += u;
      lexState = "identifierName";
    },
    identifierName() {
      switch (c) {
        case "$":
        case "_":
        case "‌":
        case "‍":
          buffer += read();
          return;
        case "\\":
          read();
          lexState = "identifierNameEscape";
          return;
      }
      if (util.isIdContinueChar(c)) {
        buffer += read();
        return;
      }
      return newToken("identifier", buffer);
    },
    identifierNameEscape() {
      if (c !== "u") {
        throw invalidChar(read());
      }
      read();
      const u = unicodeEscape();
      switch (u) {
        case "$":
        case "_":
        case "‌":
        case "‍":
          break;
        default:
          if (!util.isIdContinueChar(u)) {
            throw invalidIdentifier();
          }
          break;
      }
      buffer += u;
      lexState = "identifierName";
    },
    sign() {
      switch (c) {
        case ".":
          buffer = read();
          lexState = "decimalPointLeading";
          return;
        case "0":
          buffer = read();
          lexState = "zero";
          return;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          buffer = read();
          lexState = "decimalInteger";
          return;
        case "I":
          read();
          literal("nfinity");
          return newToken("numeric", sign * Infinity);
        case "N":
          read();
          literal("aN");
          return newToken("numeric", NaN);
      }
      throw invalidChar(read());
    },
    zero() {
      switch (c) {
        case ".":
          buffer += read();
          lexState = "decimalPoint";
          return;
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
        case "x":
        case "X":
          buffer += read();
          lexState = "hexadecimal";
          return;
      }
      return newToken("numeric", sign * 0);
    },
    decimalInteger() {
      switch (c) {
        case ".":
          buffer += read();
          lexState = "decimalPoint";
          return;
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalPointLeading() {
      if (util.isDigit(c)) {
        buffer += read();
        lexState = "decimalFraction";
        return;
      }
      throw invalidChar(read());
    },
    decimalPoint() {
      switch (c) {
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util.isDigit(c)) {
        buffer += read();
        lexState = "decimalFraction";
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalFraction() {
      switch (c) {
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalExponent() {
      switch (c) {
        case "+":
        case "-":
          buffer += read();
          lexState = "decimalExponentSign";
          return;
      }
      if (util.isDigit(c)) {
        buffer += read();
        lexState = "decimalExponentInteger";
        return;
      }
      throw invalidChar(read());
    },
    decimalExponentSign() {
      if (util.isDigit(c)) {
        buffer += read();
        lexState = "decimalExponentInteger";
        return;
      }
      throw invalidChar(read());
    },
    decimalExponentInteger() {
      if (util.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    hexadecimal() {
      if (util.isHexDigit(c)) {
        buffer += read();
        lexState = "hexadecimalInteger";
        return;
      }
      throw invalidChar(read());
    },
    hexadecimalInteger() {
      if (util.isHexDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    string() {
      switch (c) {
        case "\\":
          read();
          buffer += escape();
          return;
        case '"':
          if (doubleQuote) {
            read();
            return newToken("string", buffer);
          }
          buffer += read();
          return;
        case "'":
          if (!doubleQuote) {
            read();
            return newToken("string", buffer);
          }
          buffer += read();
          return;
        case "\n":
        case "\r":
          throw invalidChar(read());
        case "\u2028":
        case "\u2029":
          separatorChar(c);
          break;
        case void 0:
          throw invalidChar(read());
      }
      buffer += read();
    },
    start() {
      switch (c) {
        case "{":
        case "[":
          return newToken("punctuator", read());
      }
      lexState = "value";
    },
    beforePropertyName() {
      switch (c) {
        case "$":
        case "_":
          buffer = read();
          lexState = "identifierName";
          return;
        case "\\":
          read();
          lexState = "identifierNameStartEscape";
          return;
        case "}":
          return newToken("punctuator", read());
        case '"':
        case "'":
          doubleQuote = read() === '"';
          lexState = "string";
          return;
      }
      if (util.isIdStartChar(c)) {
        buffer += read();
        lexState = "identifierName";
        return;
      }
      throw invalidChar(read());
    },
    afterPropertyName() {
      if (c === ":") {
        return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    beforePropertyValue() {
      lexState = "value";
    },
    afterPropertyValue() {
      switch (c) {
        case ",":
        case "}":
          return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    beforeArrayValue() {
      if (c === "]") {
        return newToken("punctuator", read());
      }
      lexState = "value";
    },
    afterArrayValue() {
      switch (c) {
        case ",":
        case "]":
          return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    end() {
      throw invalidChar(read());
    }
  };
  function newToken(type, value) {
    return {
      type,
      value,
      line,
      column
    };
  }
  function literal(s) {
    for (const c2 of s) {
      const p = peek();
      if (p !== c2) {
        throw invalidChar(read());
      }
      read();
    }
  }
  function escape() {
    const c2 = peek();
    switch (c2) {
      case "b":
        read();
        return "\b";
      case "f":
        read();
        return "\f";
      case "n":
        read();
        return "\n";
      case "r":
        read();
        return "\r";
      case "t":
        read();
        return "	";
      case "v":
        read();
        return "\v";
      case "0":
        read();
        if (util.isDigit(peek())) {
          throw invalidChar(read());
        }
        return "\0";
      case "x":
        read();
        return hexEscape();
      case "u":
        read();
        return unicodeEscape();
      case "\n":
      case "\u2028":
      case "\u2029":
        read();
        return "";
      case "\r":
        read();
        if (peek() === "\n") {
          read();
        }
        return "";
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        throw invalidChar(read());
      case void 0:
        throw invalidChar(read());
    }
    return read();
  }
  function hexEscape() {
    let buffer2 = "";
    let c2 = peek();
    if (!util.isHexDigit(c2)) {
      throw invalidChar(read());
    }
    buffer2 += read();
    c2 = peek();
    if (!util.isHexDigit(c2)) {
      throw invalidChar(read());
    }
    buffer2 += read();
    return String.fromCodePoint(parseInt(buffer2, 16));
  }
  function unicodeEscape() {
    let buffer2 = "";
    let count = 4;
    while (count-- > 0) {
      const c2 = peek();
      if (!util.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
    }
    return String.fromCodePoint(parseInt(buffer2, 16));
  }
  const parseStates = {
    start() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      push();
    },
    beforePropertyName() {
      switch (token.type) {
        case "identifier":
        case "string":
          key = token.value;
          parseState = "afterPropertyName";
          return;
        case "punctuator":
          pop();
          return;
        case "eof":
          throw invalidEOF();
      }
    },
    afterPropertyName() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      parseState = "beforePropertyValue";
    },
    beforePropertyValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      push();
    },
    beforeArrayValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      if (token.type === "punctuator" && token.value === "]") {
        pop();
        return;
      }
      push();
    },
    afterPropertyValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      switch (token.value) {
        case ",":
          parseState = "beforePropertyName";
          return;
        case "}":
          pop();
      }
    },
    afterArrayValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      switch (token.value) {
        case ",":
          parseState = "beforeArrayValue";
          return;
        case "]":
          pop();
      }
    },
    end() {
    }
  };
  function push() {
    let value;
    switch (token.type) {
      case "punctuator":
        switch (token.value) {
          case "{":
            value = {};
            break;
          case "[":
            value = [];
            break;
        }
        break;
      case "null":
      case "boolean":
      case "numeric":
      case "string":
        value = token.value;
        break;
    }
    if (root === void 0) {
      root = value;
    } else {
      const parent2 = stack[stack.length - 1];
      if (Array.isArray(parent2)) {
        parent2.push(value);
      } else {
        Object.defineProperty(parent2, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    if (value !== null && typeof value === "object") {
      stack.push(value);
      if (Array.isArray(value)) {
        parseState = "beforeArrayValue";
      } else {
        parseState = "beforePropertyName";
      }
    } else {
      const current = stack[stack.length - 1];
      if (current == null) {
        parseState = "end";
      } else if (Array.isArray(current)) {
        parseState = "afterArrayValue";
      } else {
        parseState = "afterPropertyValue";
      }
    }
  }
  function pop() {
    stack.pop();
    const current = stack[stack.length - 1];
    if (current == null) {
      parseState = "end";
    } else if (Array.isArray(current)) {
      parseState = "afterArrayValue";
    } else {
      parseState = "afterPropertyValue";
    }
  }
  function invalidChar(c2) {
    if (c2 === void 0) {
      return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
    }
    return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
  }
  function invalidEOF() {
    return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
  }
  function invalidIdentifier() {
    column -= 5;
    return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
  }
  function separatorChar(c2) {
    console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
  }
  function formatChar(c2) {
    const replacements = {
      "'": "\\'",
      '"': '\\"',
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\v": "\\v",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    if (replacements[c2]) {
      return replacements[c2];
    }
    if (c2 < " ") {
      const hexString = c2.charCodeAt(0).toString(16);
      return "\\x" + ("00" + hexString).substring(hexString.length);
    }
    return c2;
  }
  function syntaxError(message) {
    const err = new SyntaxError(message);
    err.lineNumber = line;
    err.columnNumber = column;
    return err;
  }
  var stringify = function stringify2(value, replacer, space) {
    const stack2 = [];
    let indent = "";
    let propertyList;
    let replacerFunc;
    let gap = "";
    let quote;
    if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
      space = replacer.space;
      quote = replacer.quote;
      replacer = replacer.replacer;
    }
    if (typeof replacer === "function") {
      replacerFunc = replacer;
    } else if (Array.isArray(replacer)) {
      propertyList = [];
      for (const v of replacer) {
        let item;
        if (typeof v === "string") {
          item = v;
        } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
          item = String(v);
        }
        if (item !== void 0 && propertyList.indexOf(item) < 0) {
          propertyList.push(item);
        }
      }
    }
    if (space instanceof Number) {
      space = Number(space);
    } else if (space instanceof String) {
      space = String(space);
    }
    if (typeof space === "number") {
      if (space > 0) {
        space = Math.min(10, Math.floor(space));
        gap = "          ".substr(0, space);
      }
    } else if (typeof space === "string") {
      gap = space.substr(0, 10);
    }
    return serializeProperty("", { "": value });
    function serializeProperty(key2, holder) {
      let value2 = holder[key2];
      if (value2 != null) {
        if (typeof value2.toJSON5 === "function") {
          value2 = value2.toJSON5(key2);
        } else if (typeof value2.toJSON === "function") {
          value2 = value2.toJSON(key2);
        }
      }
      if (replacerFunc) {
        value2 = replacerFunc.call(holder, key2, value2);
      }
      if (value2 instanceof Number) {
        value2 = Number(value2);
      } else if (value2 instanceof String) {
        value2 = String(value2);
      } else if (value2 instanceof Boolean) {
        value2 = value2.valueOf();
      }
      switch (value2) {
        case null:
          return "null";
        case true:
          return "true";
        case false:
          return "false";
      }
      if (typeof value2 === "string") {
        return quoteString(value2);
      }
      if (typeof value2 === "number") {
        return String(value2);
      }
      if (typeof value2 === "object") {
        return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
      }
      return void 0;
    }
    function quoteString(value2) {
      const quotes = {
        "'": 0.1,
        '"': 0.2
      };
      const replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      let product = "";
      for (let i = 0; i < value2.length; i++) {
        const c2 = value2[i];
        switch (c2) {
          case "'":
          case '"':
            quotes[c2]++;
            product += c2;
            continue;
          case "\0":
            if (util.isDigit(value2[i + 1])) {
              product += "\\x00";
              continue;
            }
        }
        if (replacements[c2]) {
          product += replacements[c2];
          continue;
        }
        if (c2 < " ") {
          let hexString = c2.charCodeAt(0).toString(16);
          product += "\\x" + ("00" + hexString).substring(hexString.length);
          continue;
        }
        product += c2;
      }
      const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
      product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
      return quoteChar + product + quoteChar;
    }
    function serializeObject(value2) {
      if (stack2.indexOf(value2) >= 0) {
        throw TypeError("Converting circular structure to JSON5");
      }
      stack2.push(value2);
      let stepback = indent;
      indent = indent + gap;
      let keys = propertyList || Object.keys(value2);
      let partial = [];
      for (const key2 of keys) {
        const propertyString = serializeProperty(key2, value2);
        if (propertyString !== void 0) {
          let member = serializeKey(key2) + ":";
          if (gap !== "") {
            member += " ";
          }
          member += propertyString;
          partial.push(member);
        }
      }
      let final;
      if (partial.length === 0) {
        final = "{}";
      } else {
        let properties;
        if (gap === "") {
          properties = partial.join(",");
          final = "{" + properties + "}";
        } else {
          let separator = ",\n" + indent;
          properties = partial.join(separator);
          final = "{\n" + indent + properties + ",\n" + stepback + "}";
        }
      }
      stack2.pop();
      indent = stepback;
      return final;
    }
    function serializeKey(key2) {
      if (key2.length === 0) {
        return quoteString(key2);
      }
      const firstChar = String.fromCodePoint(key2.codePointAt(0));
      if (!util.isIdStartChar(firstChar)) {
        return quoteString(key2);
      }
      for (let i = firstChar.length; i < key2.length; i++) {
        if (!util.isIdContinueChar(String.fromCodePoint(key2.codePointAt(i)))) {
          return quoteString(key2);
        }
      }
      return key2;
    }
    function serializeArray(value2) {
      if (stack2.indexOf(value2) >= 0) {
        throw TypeError("Converting circular structure to JSON5");
      }
      stack2.push(value2);
      let stepback = indent;
      indent = indent + gap;
      let partial = [];
      for (let i = 0; i < value2.length; i++) {
        const propertyString = serializeProperty(String(i), value2);
        partial.push(propertyString !== void 0 ? propertyString : "null");
      }
      let final;
      if (partial.length === 0) {
        final = "[]";
      } else {
        if (gap === "") {
          let properties = partial.join(",");
          final = "[" + properties + "]";
        } else {
          let separator = ",\n" + indent;
          let properties = partial.join(separator);
          final = "[\n" + indent + properties + ",\n" + stepback + "]";
        }
      }
      stack2.pop();
      indent = stepback;
      return final;
    }
  };
  const JSON5 = {
    parse,
    stringify
  };
  var lib = JSON5;
  class JsonToolEnhancer {
    constructor() {
      this.SEARCH_POSITION_KEY = "logSearchPosition_Global";
    }
    /**
     * 启动JSON工具网站功能
     */
    startJsonToolFeature() {
      this.initJsonToolEnhancement();
    }
    /**
     * 启动日志网站的JSON转换功能
     */
    startLogSiteJsonFeature() {
      this.initJsonConvertFeature();
      this.initSearchFeature();
    }
    /**
     * 初始化 JSON 工具网站增强功能
     */
    initJsonToolEnhancement() {
      console.log("JSON工具网站增强功能已由主入口处理");
    }
    /**
     * 初始化搜索功能
     */
    initSearchFeature() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.addSearchFeature();
        });
      } else {
        this.addSearchFeature();
      }
    }
    /**
     * 初始化 JSON 转换功能
     */
    initJsonConvertFeature() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.addJsonConvertButtonToContextMenu();
        });
      } else {
        this.addJsonConvertButtonToContextMenu();
      }
    }
    /**
     * 为 http.responseBody 添加"转 JSON"菜单项
     */
    addJsonConvertButtonToContextMenu() {
      let currentContextMenu = null;
      let currentActiveTag = null;
      let jsonButton = null;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("context-menu-container___irwM9")) {
                console.log("检测到新的 context-menu-container");
                currentContextMenu = node;
                handleContextMenuCreation();
                setTimeout(() => {
                  updateActiveTag();
                }, 10);
              }
            });
          }
          if (mutation.type === "attributes" && mutation.target === currentContextMenu) {
            console.log("context-menu-container 属性发生变化");
            if (currentContextMenu) {
              setTimeout(() => {
                updateActiveTag();
              }, 10);
            }
          }
          if (mutation.removedNodes) {
            mutation.removedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("context-menu-container___irwM9")) {
                console.log("context-menu-container 已关闭");
                clearContextMenuState();
              }
            });
          }
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"]
      });
      const clearContextMenuState = () => {
        currentContextMenu = null;
        currentActiveTag = null;
        removeJsonButton();
        console.log("已清除上下文菜单状态");
      };
      const updateActiveTag = () => {
        if (!currentContextMenu) return;
        const newActiveTag = document.querySelector(".field-tag___NdYUB.context-menu-tag-checked");
        console.log("activeTag 已更新:", newActiveTag);
        currentActiveTag = newActiveTag;
        updateJsonButtonState();
      };
      const updateJsonButtonState = () => {
        var _a;
        const menuItemsContainer = currentContextMenu == null ? void 0 : currentContextMenu.querySelector(".block___lALi4");
        if (!menuItemsContainer) {
          removeJsonButton();
          return;
        }
        const activeTagText = (_a = currentActiveTag == null ? void 0 : currentActiveTag.textContent) == null ? void 0 : _a.trim();
        if (currentActiveTag && activeTagText) {
          ensureJsonButtonExists(menuItemsContainer, activeTagText);
        } else {
          removeJsonButton();
        }
      };
      const ensureJsonButtonExists = (menuItemsContainer, fieldType) => {
        if (jsonButton && document.contains(jsonButton)) {
          return;
        }
        let buttonText = "转 JSON";
        if (fieldType === "message") {
          buttonText = "解析 JSON";
        }
        jsonButton = createElement("button", {
          className: "ant-btn ant-btn-text action-btn___Cu1ED json-convert-button",
          innerHTML: `
          <span role="img" aria-label="copy" class="anticon anticon-copy">
            <svg viewBox="64 64 896 896" focusable="false" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V72c0-4.4-3.6-8-8-8z"></path>
            </svg>
          </span>
          <span>${buttonText}</span>
        `
        });
        menuItemsContainer.insertBefore(jsonButton, menuItemsContainer.firstChild);
        jsonButton.addEventListener("click", async () => {
          var _a;
          console.log("点击JSON按钮，当前activeTag:", currentActiveTag);
          const activeTagText = (_a = currentActiveTag == null ? void 0 : currentActiveTag.textContent) == null ? void 0 : _a.trim();
          const valueText = await this.extractJsonDataAsync(currentActiveTag);
          if (!valueText) {
            alert("无法读取字段值");
            console.error("无法获取数据，activeTag:", currentActiveTag);
            return;
          }
          console.log("获取到的原始数据:", valueText);
          try {
            const cleanValueText = valueText.replace(/^:\s*/, "");
            console.log("清理后的数据:", cleanValueText);
            if (activeTagText === "message") {
              this.handleMessageField(cleanValueText);
            } else {
              this.handleJsonField(cleanValueText);
            }
          } catch (e) {
            console.error("数据处理失败:", e);
            alert("数据处理失败：\n" + e.message);
          }
        });
        console.log('已为 http.responseBody 添加"转 JSON"按钮');
      };
      const removeJsonButton = () => {
        if (jsonButton) {
          jsonButton.remove();
          jsonButton = null;
          console.log('已删除"转 JSON"按钮');
        }
      };
      const handleContextMenuCreation = (_menuContainer) => {
        waitForElement$1(".field-tag___NdYUB.context-menu-tag-checked", 1e3).then((activeTag) => {
          if (!activeTag) {
            console.warn("未找到激活的 field-tag");
            return;
          }
          console.log("找到 activeTag:", activeTag);
          currentActiveTag = activeTag;
          updateJsonButtonState();
        }).catch((error) => {
          console.error("处理上下文菜单时出错:", error);
        });
      };
    }
    /**
     * 显示JSON工具窗口并传递数据
     */
    showJsonToolWindow(jsonData) {
      console.log("显示JSON工具弹窗，数据长度:", (jsonData == null ? void 0 : jsonData.length) || 0);
      const jsonTool = new JsonTool(jsonData || "");
      jsonTool.show();
    }
    /**
     * 异步提取JSON数据
     */
    async extractJsonDataAsync(activeTag) {
      var _a, _b, _c;
      if (!activeTag) {
        console.error("activeTag为空");
        return null;
      }
      console.log("开始提取JSON数据");
      console.log("activeTag:", activeTag);
      console.log("activeTag.textContent:", activeTag.textContent);
      console.log("activeTag.nextElementSibling:", activeTag.nextElementSibling);
      const nextElement = activeTag.nextElementSibling;
      if (nextElement) {
        const text = (_a = nextElement.textContent) == null ? void 0 : _a.trim();
        console.log("nextElementSibling文本内容:", text);
        console.log("nextElementSibling HTML:", nextElement.outerHTML);
        if (text && text.length > 0 && text !== ":") {
          console.log("方法1成功，返回数据:", text);
          return text;
        }
      }
      console.log("方法1失败，尝试延迟获取...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      const delayedNextElement = activeTag.nextElementSibling;
      if (delayedNextElement) {
        const delayedText = (_b = delayedNextElement.textContent) == null ? void 0 : _b.trim();
        console.log("延迟获取的文本:", delayedText);
        if (delayedText && delayedText.length > 0 && delayedText !== ":") {
          console.log("延迟获取成功:", delayedText);
          return delayedText;
        }
      }
      console.log("延迟获取也失败，遍历所有兄弟节点...");
      let sibling = activeTag.nextSibling;
      while (sibling) {
        console.log("检查兄弟节点:", sibling);
        if (sibling.nodeType === Node.ELEMENT_NODE) {
          const element = sibling;
          const text = (_c = element.textContent) == null ? void 0 : _c.trim();
          console.log("兄弟元素文本:", text);
          if (text && text.length > 0 && text !== ":" && !text.includes("http.responseBody")) {
            console.log("找到兄弟节点数据:", text);
            return text;
          }
        }
        sibling = sibling.nextSibling;
      }
      console.error("所有方法都无法提取JSON数据");
      return null;
    }
    /**
     * 处理普通JSON字段（http.responseBody, http.requestPayload）
     */
    handleJsonField(data) {
      try {
        JSON.parse(data);
        this.createJsonDialog(data);
      } catch (e) {
        console.error("JSON解析失败:", e);
        alert("不是有效的 JSON 字符串：\n" + e.message);
      }
    }
    /**
     * 处理message字段，解析其中的多个JSON
     */
    handleMessageField(data) {
      console.log("处理message字段，数据:", data);
      const parsedData = this.parseMessageJsons(data);
      if (parsedData.jsonCount === 0) {
        alert("在message中未找到有效的JSON数据");
        return;
      }
      const resultData = parsedData.parsedJsons;
      this.createJsonDialog(JSON.stringify(resultData, null, 2));
    }
    /**
     * 解析message中的JSON数据 - 使用强大的JSON解析库
     */
    parseMessageJsons(message) {
      const result = {};
      let jsonCount = 0;
      let remainingMessage = message;
      const jsonMatches = this.extractJsonSequentially(message);
      for (const match of jsonMatches) {
        const parsed = this.tryParseJson(match.content);
        if (parsed !== null) {
          jsonCount++;
          let key2 = match.prefix.trim();
          if (!key2) {
            key2 = `json_${jsonCount}`;
          } else {
            if (!key2.endsWith(":") && !key2.endsWith("=")) {
              key2 += ":";
            }
          }
          result[key2] = parsed;
          const fullMatch = match.prefix + match.content;
          remainingMessage = remainingMessage.replace(fullMatch, "").trim();
        }
      }
      if (remainingMessage && remainingMessage.trim()) {
        result[remainingMessage.trim()] = null;
      }
      return {
        parsedJsons: result,
        jsonCount
      };
    }
    /**
     * 顺序提取JSON，避免重复和嵌套问题
     */
    extractJsonSequentially(text) {
      const results = [];
      let currentPos = 0;
      while (currentPos < text.length) {
        const nextBrace = text.indexOf("{", currentPos);
        const nextBracket = text.indexOf("[", currentPos);
        let nextStart = -1;
        let isObject = true;
        if (nextBrace === -1 && nextBracket === -1) {
          break;
        } else if (nextBrace === -1) {
          nextStart = nextBracket;
          isObject = false;
        } else if (nextBracket === -1) {
          nextStart = nextBrace;
          isObject = true;
        } else {
          nextStart = Math.min(nextBrace, nextBracket);
          isObject = nextStart === nextBrace;
        }
        const jsonContent = this.extractBalancedJson(text, nextStart, isObject);
        if (jsonContent) {
          if (this.tryParseJson(jsonContent.content) !== null) {
            const prefix = text.substring(currentPos, nextStart);
            results.push({
              content: jsonContent.content,
              prefix,
              start: nextStart,
              end: jsonContent.end
            });
            currentPos = jsonContent.end;
          } else {
            currentPos = nextStart + 1;
          }
        } else {
          currentPos = nextStart + 1;
        }
      }
      return results;
    }
    /**
     * 提取平衡的JSON内容
     */
    extractBalancedJson(text, start, isObject) {
      const openChar = isObject ? "{" : "[";
      const closeChar = isObject ? "}" : "]";
      let depth = 0;
      let inString = false;
      let escapeNext = false;
      for (let i = start; i < text.length; i++) {
        const char = text[i];
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === "\\") {
          escapeNext = true;
          continue;
        }
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (char === openChar) {
            depth++;
          } else if (char === closeChar) {
            depth--;
            if (depth === 0) {
              return {
                content: text.substring(start, i + 1),
                end: i + 1
              };
            }
          }
        }
      }
      return null;
    }
    /**
     * 尝试解析JSON，支持多种格式
     */
    tryParseJson(text) {
      if (!text || text.trim().length === 0) {
        return null;
      }
      const cleanText = text.trim();
      try {
        return JSON.parse(cleanText);
      } catch (e) {
      }
      try {
        return lib.parse(cleanText);
      } catch (e) {
      }
      try {
        let fixedText = cleanText;
        fixedText = fixedText.replace(/'/g, '"');
        fixedText = fixedText.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        fixedText = fixedText.replace(/,(\s*[}\]])/g, "$1");
        return JSON.parse(fixedText);
      } catch (e) {
      }
      return null;
    }
    /**
     * 创建JSON工具弹窗
     */
    createJsonDialog(jsonData) {
      const existingDialog = document.getElementById("json-tool-overlay");
      if (existingDialog) {
        existingDialog.remove();
      }
      console.log("创建JSON工具弹窗，数据长度:", jsonData.length);
      const jsonTool = new JsonTool(jsonData);
      jsonTool.show();
    }
    /**
     * 添加搜索功能
     */
    addSearchFeature() {
      const checkForGrid = () => {
        const agRoot = document.querySelector(".ag-root-wrapper");
        if (agRoot) {
          this.createSearchBox(agRoot);
        } else {
          setTimeout(checkForGrid, 1e3);
        }
      };
      checkForGrid();
    }
    /**
     * 创建搜索框
     */
    createSearchBox(_agRoot) {
      if (document.getElementById("log-search-container")) {
        return;
      }
      const searchContainer = createElement("div", {
        attributes: {
          id: "log-search-container"
        },
        styles: {
          position: "fixed",
          top: "60px",
          left: "20px",
          zIndex: "10000",
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(4px)",
          cursor: "move",
          userSelect: "none",
          minWidth: "300px",
          transition: "all 0.3s ease"
        }
      });
      const searchInput = createElement("input", {
        attributes: {
          id: "log-search-box",
          type: "text",
          placeholder: "输入查询条件..."
        },
        styles: {
          width: "200px",
          padding: "4px 8px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          fontSize: "12px",
          outline: "none"
        }
      });
      const andSearchButton = createElement("button", {
        textContent: "AND查询",
        styles: {
          padding: "4px 8px",
          background: "#1890ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
          minWidth: "70px"
        }
      });
      const replaceSearchButton = createElement("button", {
        textContent: "查询",
        styles: {
          padding: "4px 8px",
          background: "#52c41a",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
          minWidth: "70px"
        }
      });
      const statusSpan = createElement("span", {
        attributes: {
          id: "search-status"
        },
        styles: {
          fontSize: "11px",
          color: "#666",
          whiteSpace: "nowrap",
          marginLeft: "8px"
        }
      });
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(andSearchButton);
      searchContainer.appendChild(replaceSearchButton);
      searchContainer.appendChild(statusSpan);
      document.body.appendChild(searchContainer);
      this.makeDraggable(searchContainer);
      this.restoreSearchPosition(searchContainer);
      const performAndSearch = () => {
        const queryCondition = searchInput.value.trim();
        if (!queryCondition) {
          this.updateStatus(statusSpan, "请输入查询条件", "warning");
          return;
        }
        this.updateStatus(statusSpan, "正在打开AND查询页面...", "info");
        this.openSearchPage(queryCondition, false);
      };
      const performReplaceSearch = () => {
        const queryCondition = searchInput.value.trim();
        if (!queryCondition) {
          this.updateStatus(statusSpan, "请输入查询条件", "warning");
          return;
        }
        this.updateStatus(statusSpan, "正在打开替换查询页面...", "info");
        this.openSearchPage(queryCondition, true);
      };
      andSearchButton.addEventListener("click", performAndSearch);
      replaceSearchButton.addEventListener("click", performReplaceSearch);
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performAndSearch();
        }
      });
      console.log("搜索功能已添加");
    }
    /**
     * 更新状态显示
     */
    updateStatus(statusElement, message, type = "info") {
      statusElement.textContent = message;
      const colors = {
        info: "#666",
        warning: "#fa8c16",
        success: "#52c41a",
        error: "#ff4d4f"
      };
      statusElement.style.color = colors[type];
    }
    /**
     * 解析当前页面URL并构建新的查询URL
     */
    buildSearchUrl(queryCondition, replaceMode = false) {
      const currentUrl = new URL(window.location.href);
      const currentQuery = currentUrl.searchParams.get("query") || "";
      let newQuery = "";
      if (replaceMode) {
        newQuery = queryCondition;
      } else {
        if (currentQuery) {
          newQuery = `${currentQuery} and ${queryCondition}`;
        } else {
          newQuery = queryCondition;
        }
      }
      const newUrl = new URL(currentUrl);
      newUrl.searchParams.set("query", newQuery);
      console.log("构建查询URL:", {
        原始查询: currentQuery,
        新增条件: queryCondition,
        替换模式: replaceMode,
        最终查询: newQuery,
        完整URL: newUrl.toString()
      });
      return newUrl.toString();
    }
    /**
     * 打开搜索结果页面
     */
    openSearchPage(queryCondition, replaceMode = false) {
      const searchUrl = this.buildSearchUrl(queryCondition, replaceMode);
      window.open(searchUrl, "_blank");
      const statusElement = document.getElementById("search-status");
      if (statusElement) {
        this.updateStatus(statusElement, `已打开${replaceMode ? "替换" : "AND"}查询页面`, "success");
        setTimeout(() => {
          this.updateStatus(statusElement, "输入查询条件后点击按钮", "info");
        }, 2e3);
      }
      console.log(`已打开${replaceMode ? "替换" : "AND"}查询页面:`, searchUrl);
    }
    /**
     * 使元素可拖拽
     */
    makeDraggable(element, handle) {
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialX = 0;
      let initialY = 0;
      const dragHandle = handle || element;
      dragHandle.addEventListener("mousedown", (e) => {
        if (handle) {
          const target = e.target;
          if (target.tagName === "INPUT" || target.tagName === "BUTTON") {
            return;
          }
        } else {
          const target = e.target;
          if (target.tagName === "INPUT" || target.tagName === "BUTTON") {
            return;
          }
        }
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        dragHandle.style.cursor = "grabbing";
        e.preventDefault();
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        element.style.left = constrainedX + "px";
        element.style.top = constrainedY + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          dragHandle.style.cursor = handle ? "move" : "grab";
          if (!handle) {
            this.saveSearchPosition(element);
          }
        }
      });
      dragHandle.style.cursor = handle ? "move" : "grab";
    }
    /**
     * 保存搜索框位置
     */
    saveSearchPosition(element) {
      const position = {
        left: element.style.left,
        top: element.style.top
      };
      try {
        localStorage.setItem(this.SEARCH_POSITION_KEY, JSON.stringify(position));
        console.log("搜索框位置已保存:", position);
      } catch (error) {
        console.warn("保存搜索框位置失败:", error);
      }
    }
    /**
     * 恢复搜索框位置
     */
    restoreSearchPosition(element) {
      try {
        const saved = localStorage.getItem(this.SEARCH_POSITION_KEY);
        if (saved) {
          const position = JSON.parse(saved);
          element.style.left = position.left || "20px";
          element.style.top = position.top || "20px";
          console.log("搜索框位置已恢复:", position);
        }
      } catch (error) {
        console.warn("恢复搜索框位置失败:", error);
      }
    }
    /**
     * 销毁JSON工具增强器
     */
    destroy() {
      const dialog = document.getElementById("json-tool-overlay");
      if (dialog) {
        dialog.remove();
      }
      const searchContainer = document.getElementById("log-search-container");
      if (searchContainer) {
        searchContainer.remove();
      }
      console.log("JSON工具增强器已销毁");
    }
  }
  class LogSiteEnhancer extends BaseEnhancer {
    constructor() {
      super(...arguments);
      this.siteName = "LogSite";
    }
    /**
     * 检测当前网站是否匹配
     */
    detectSite() {
      const hostname = window.location.hostname;
      return hostname.includes("log.xjjj.co") || hostname.includes("log.fat.xjjj.co") || hostname.includes("log.uat.xjjj.co");
    }
    /**
     * 获取网站配置
     */
    getSiteConfig() {
      const hostname = window.location.hostname;
      if (hostname === "www.json.cn") {
        return {
          name: "JsonTool",
          domains: ["www.json.cn"],
          features: ["jsonEnhancement", "fullscreenTrigger"],
          authMethod: "session"
        };
      } else {
        return {
          name: "LogSite",
          domains: ["log.xjjj.co", "log.fat.xjjj.co", "log.uat.xjjj.co"],
          features: ["environmentSwitcher", "logEnhancement"],
          authMethod: "session"
        };
      }
    }
    /**
     * 初始化核心功能
     */
    async initializeCore() {
      await new Promise((resolve) => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => resolve());
        } else {
          resolve();
        }
      });
      ConfigManager.getInstance();
      console.log("日志网站核心功能初始化完成");
    }
    /**
     * 初始化网站特定功能
     */
    async initializeFeatures() {
      const hostname = window.location.hostname;
      if (hostname === "www.json.cn") {
        this.initJsonToolFeatures();
      } else if (hostname.includes("log.")) {
        this.initLogSiteFeatures();
      } else {
        console.log("未匹配到任何已知网站类型");
      }
      console.log("日志网站功能模块初始化完成");
    }
    /**
     * 初始化 JSON 工具网站功能
     */
    initJsonToolFeatures() {
      console.log("开始初始化JSON工具网站功能");
      this.jsonToolEnhancer = new JsonToolEnhancer();
      console.log("JsonToolEnhancer实例已创建");
      this.jsonToolEnhancer.startJsonToolFeature();
      console.log("JsonToolEnhancer.startJsonToolFeature()已调用");
      this.registerFeature("jsonToolEnhancer", this.jsonToolEnhancer);
      console.log("JsonToolEnhancer已注册为功能模块");
      console.log("JSON 工具网站功能已启用");
    }
    /**
     * 初始化日志网站功能
     */
    initLogSiteFeatures() {
      this.environmentSwitcher = new EnvironmentSwitcher();
      this.jsonToolEnhancer = new JsonToolEnhancer();
      this.jsonToolEnhancer.startLogSiteJsonFeature();
      this.environmentSwitcher.setJsonToolEnhancer(this.jsonToolEnhancer);
      this.registerFeature("environmentSwitcher", this.environmentSwitcher);
      this.registerFeature("jsonToolEnhancer", this.jsonToolEnhancer);
      this.initLogEnhancements();
      console.log("日志网站功能已启用");
    }
    /**
     * 初始化日志增强功能
     */
    initLogEnhancements() {
      console.log("日志增强功能初始化完成");
    }
    /**
     * 获取环境切换器实例
     */
    getEnvironmentSwitcher() {
      return this.environmentSwitcher;
    }
    /**
     * 获取 JSON 工具增强器实例
     */
    getJsonToolEnhancer() {
      return this.jsonToolEnhancer;
    }
    /**
     * 销毁增强器
     */
    destroy() {
      if (this.environmentSwitcher) {
        this.environmentSwitcher.destroy();
      }
      if (this.jsonToolEnhancer) {
        this.jsonToolEnhancer.destroy();
      }
      super.destroy();
    }
    /**
     * 获取增强器实例（用于调试）
     */
    static getInstance() {
      var _a;
      return ((_a = window.SiteEnhancer) == null ? void 0 : _a.activeEnhancer) instanceof LogSiteEnhancer ? window.SiteEnhancer.activeEnhancer : null;
    }
  }
  class EnhancerFactory {
    constructor() {
      this.enhancers = /* @__PURE__ */ new Map();
      this.activeEnhancer = null;
      this.registerEnhancers();
    }
    static getInstance() {
      if (!EnhancerFactory.instance) {
        EnhancerFactory.instance = new EnhancerFactory();
      }
      return EnhancerFactory.instance;
    }
    /**
     * 注册所有增强器
     */
    registerEnhancers() {
      this.enhancers.set("redmine", async () => {
        return new RedmineEnhancer();
      });
      this.enhancers.set("gitlab", async () => {
        return new GitlabEnhancer();
      });
      this.enhancers.set("log-site", async () => {
        return new LogSiteEnhancer();
      });
      this.enhancers.set("json-tool", async () => {
        return new LogSiteEnhancer();
      });
    }
    /**
     * 创建并启动适当的增强器
     */
    async createAndStartEnhancer() {
      const detector = SiteDetector.getInstance();
      const siteType = detector.detectCurrentSite();
      if (!siteType) {
        console.log("未检测到支持的网站");
        return null;
      }
      const enhancerFactory = this.enhancers.get(siteType);
      if (!enhancerFactory) {
        console.warn(`未找到 ${siteType} 的增强器`);
        return null;
      }
      try {
        console.log(`正在启动 ${siteType} 增强器...`);
        this.activeEnhancer = await enhancerFactory();
        return this.activeEnhancer;
      } catch (error) {
        console.error(`启动 ${siteType} 增强器失败:`, error);
        return null;
      }
    }
    /**
     * 获取当前活动的增强器
     */
    getActiveEnhancer() {
      return this.activeEnhancer;
    }
    /**
     * 销毁当前增强器
     */
    destroyActiveEnhancer() {
      if (this.activeEnhancer) {
        this.activeEnhancer.destroy();
        this.activeEnhancer = null;
      }
    }
    /**
     * 重新启动增强器
     */
    async restartEnhancer() {
      this.destroyActiveEnhancer();
      return await this.createAndStartEnhancer();
    }
    /**
     * 注册新的增强器
     */
    registerEnhancer(siteType, factory) {
      this.enhancers.set(siteType, factory);
    }
    /**
     * 获取所有已注册的增强器类型
     */
    getRegisteredEnhancers() {
      return Array.from(this.enhancers.keys());
    }
  }
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  async function main() {
    if (isInIframe()) {
      console.log("=== JoJo PMS 功能增强器启动 ===");
      console.log("检测到在iframe中运行，启动iframe模式");
      if (window.location.hostname === "www.json.cn") {
        initJsonToolIframeMode();
      }
      return;
    }
    console.log("=== 多网站功能增强器启动 ===");
    try {
      const factory = EnhancerFactory.getInstance();
      const enhancer = await factory.createAndStartEnhancer();
      if (enhancer) {
        console.log(`✓ ${enhancer.siteName} 增强器启动成功`);
      } else {
        console.log("当前网站不支持增强功能");
      }
    } catch (error) {
      console.error("增强器启动失败:", error);
    }
  }
  function initJsonToolIframeMode() {
    window.addEventListener("load", () => {
      parent.postMessage({ type: "READY" }, "*");
    });
    window.addEventListener("message", (event) => {
      if (event.data.type === "TRIGGER_FULLSCREEN") {
        const fullScreenButton = document.getElementById(event.data.buttonId);
        if (fullScreenButton) {
          fullScreenButton.click();
          console.log("已触发全屏按钮事件");
        } else {
          console.log("未找到全屏按钮: " + event.data.buttonId);
        }
      } else if (event.data.type === "LOAD_JSON_DATA") {
        loadJsonDataToTextarea(event.data.data);
      }
    });
    console.log("JSON工具iframe模式已启动");
  }
  async function loadJsonDataToTextarea(jsonData) {
    try {
      const textarea = await waitForElement("#json-src", 5e3);
      if (textarea) {
        const jsonString = JSON.stringify(jsonData, null, 2);
        textarea.value = "";
        textarea.value = jsonString;
        window.scrollTo({ top: 0, behavior: "smooth" });
        const events = ["input", "change", "blur", "keyup"];
        events.forEach((eventType) => {
          textarea.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        if (textarea._valueTracker) {
          textarea._valueTracker.setValue(jsonString);
        }
        console.log("已将JSON数据填入文本框并触发多种事件");
      } else {
        console.error("未找到JSON输入框");
      }
    } catch (error) {
      console.error("填入JSON数据时出错:", error);
    }
  }
  function waitForElement(selector, timeout = 5e3) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
      const observer = new MutationObserver(() => {
        const element2 = document.querySelector(selector);
        if (element2) {
          clearTimeout(timeoutId);
          observer.disconnect();
          resolve(element2);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function handleError(error) {
    console.error("多网站增强器发生错误:", error);
  }
  function cleanup() {
    const factory = EnhancerFactory.getInstance();
    factory.destroyActiveEnhancer();
    console.log("增强器已清理");
  }
  window.addEventListener("error", (event) => {
    handleError(event.error);
  });
  window.addEventListener("unhandledrejection", (event) => {
    handleError(new Error(event.reason));
  });
  window.addEventListener("beforeunload", cleanup);
  main().catch(handleError);

})();