// ==UserScript==
// @name         一键领种、弃种
// @namespace    方便用户一键领种、弃种
// @version      1.8.4
// @author       waibuzheng
// @description  努力支持多个站点一键领种、一键放弃本人没在做种的种子（慎用、测试可用）
// @icon         https://lsky.939593.xyz:11111/Y7bbx9.jpg
// @match        **/userdetails.php?id=*
// @match        **://*/claim.php?uid=*
// @match        http*://pterclub.com/getusertorrentlist.php?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478851/%E4%B8%80%E9%94%AE%E9%A2%86%E7%A7%8D%E3%80%81%E5%BC%83%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/478851/%E4%B8%80%E9%94%AE%E9%A2%86%E7%A7%8D%E3%80%81%E5%BC%83%E7%A7%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  var SiteType = ((SiteType2) => {
    SiteType2["GENERIC"] = "generic";
    SiteType2["PTER"] = "pter";
    SiteType2["SPRING_SUNDAY"] = "spring_sunday";
    return SiteType2;
  })(SiteType || {});
  var ActionType = ((ActionType2) => {
    ActionType2["CLAIM"] = "claim";
    ActionType2["ABANDON"] = "abandon";
    return ActionType2;
  })(ActionType || {});
  const REQUEST_TIMEOUT = 3e4;
  const DEFAULT_CONCURRENCY_LIMIT = 2;
  const DEFAULT_DELAY_AFTER_REQUEST_MS = 1e3;
  const API_PATHS = {
USER_TORRENT_LIST_AJAX: "getusertorrentlistajax.php",
USER_TORRENT_LIST: "getusertorrentlist.php",
CLAIM_HISTORY: "claim.php",
AJAX: "/ajax.php",
VIEW_CLAIMS: "viewclaims.php",
USER_DETAILS: "userdetails.php",
LOGIN: "/login",
SSD_ADOPT: "/adopt.php"
  };
  const SITE_DOMAINS = {
PTER: "pterclub.net",
SPRING_SUNDAY: "springsunday.net"
  };
  const API_PARAMS = {
PAGE: "page",
USER_ID: "userid",
UID: "uid",
TYPE: "type",
ACTION: "action",
TORRENT_ID_PARAM: "params[torrent_id]",
ID_PARAM: "params[id]",
ID: "id"
  };
  const API_PARAM_VALUES = {
SEEDING: "seeding",
CLAIM: "addClaim",
REMOVE_CLAIM: "removeClaim",
SSD_CLAIM: "add"
  };
  const SELECTORS = {
SSD_BUTTON: ".btn",
SSD_NOWRAP: ".nowrap",
CLAIM_TABLE_CELL: "#claim-table td",
TORRENT_LIST_CELL: "td",
PTER_CLAIM_CONFIRM: ".claim-confirm",
PTER_REMOVE_CONFIRM: ".remove-confirm",
BUTTON: "button"
  };
  const TEXT_CONTENT = {
CLAIMED_CN: "已认领",
CLAIM_BUTTON_CN: "领",
CLAIM_BUTTON_TW: "領",
ABANDON_BUTTON_CN: "弃",
ABANDON_BUTTON_TW: "棄"
  };
  const CSS_VALUES = {
DISPLAY_NONE: "none"
  };
  const MESSAGES = {
ABANDON_NOT_SUPPORTED: {
      generic: "该站点不支持弃种操作",
      pter: "猫站不支持弃种操作",
      springsunday: "春天站不支持弃种操作"
    },
SUCCESS: {
      claim: "领取成功",
      abandon: "弃种成功",
      operation: "操作成功"
    },
FAILURE: {
      claim: "领取失败",
      abandon: "弃种失败",
      operation: "操作失败"
    },
ERROR: {
TIMEOUT: "请求超时，请检查网络连接后重试",
UNAUTHORIZED: "登录失效或无权限访问，请重新登录",
NETWORK_ERROR: "网络请求失败，请检查网络连接"
    }
  };
  const HTTP_STATUS = {
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };
  const ERROR_STATUS_CODES = [
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.NOT_FOUND,
    HTTP_STATUS.FORBIDDEN
  ];
  class AppError extends Error {
    userMessage;
    timestamp;
    originalError;
    constructor(message, userMessage, originalError) {
      super(message);
      this.name = this.constructor.name;
      Object.setPrototypeOf(this, new.target.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.userMessage = userMessage;
      this.timestamp = new Date();
      this.originalError = originalError;
    }
  }
  class NetworkError extends AppError {
    kind = "network";
  }
  class ApiError extends AppError {
    kind = "api";
    statusCode;
    constructor(message, userMessage, statusCode, originalError) {
      super(message, userMessage, originalError);
      this.statusCode = statusCode;
    }
  }
  function isAppError(error) {
    return error instanceof AppError;
  }
  function getUserMessage(error) {
    if (isAppError(error)) {
      return error.userMessage;
    }
    return "发生未知错误，请稍后重试";
  }
  class HttpClient {
    timeout;
    requestInterceptors = [];
    responseInterceptors = [];
    constructor(timeout = REQUEST_TIMEOUT) {
      this.timeout = timeout;
    }
useRequest(interceptor) {
      this.requestInterceptors.push(interceptor);
    }
useResponse(interceptor) {
      this.responseInterceptors.push(interceptor);
    }
buildURL(url, params) {
      if (!params)
        return url;
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (!queryString)
        return url;
      return url + (url.includes("?") ? "&" : "?") + queryString;
    }
async fetchWithTimeout(input, init) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          throw new NetworkError(
            "Request timeout",
            MESSAGES.ERROR.TIMEOUT,
            error
          );
        }
        throw error;
      }
    }
async request(url, config = {}) {
      const {
        method = "GET",
        headers = {},
        body,
        timeout,
        params
      } = config;
      const finalConfig = {
        method,
        headers,
        body,
        timeout,
        params
      };
      const appliedConfig = this.requestInterceptors.reduce(
        (acc, interceptor) => interceptor(acc),
        finalConfig
      );
      try {
        const fullURL = method === "GET" ? this.buildURL(url, appliedConfig.params) : url;
        const response = await this.fetchWithTimeout(fullURL, {
          method: appliedConfig.method,
          headers: appliedConfig.headers,
          body: appliedConfig.body
        });
        const interceptedResponse = this.responseInterceptors.reduce(
          (acc, interceptor) => interceptor(acc),
          response
        );
        if (url.includes(API_PATHS.VIEW_CLAIMS)) {
          try {
            await interceptedResponse.json();
            return true;
          } catch {
            return false;
          }
        }
        if (url.includes("user-seeding-torrent")) {
          if (ERROR_STATUS_CODES.includes(interceptedResponse.status) || interceptedResponse.url.includes(API_PATHS.LOGIN)) {
            throw new ApiError(
              `API Error: ${interceptedResponse.status}`,
              MESSAGES.ERROR.UNAUTHORIZED,
              interceptedResponse.status
            );
          }
        }
        if (url.includes(API_PATHS.USER_TORRENT_LIST_AJAX) || url.includes(API_PATHS.CLAIM_HISTORY) || url.includes(API_PATHS.USER_TORRENT_LIST)) {
          return await interceptedResponse.text();
        }
        return await interceptedResponse.json();
      } catch (error) {
        if (error instanceof NetworkError) {
          throw error;
        }
        if (error instanceof ApiError) {
          throw error;
        }
        throw new NetworkError(
          `Fetch error: ${error}`,
          MESSAGES.ERROR.NETWORK_ERROR,
          error
        );
      }
    }
  }
  const httpClient = new HttpClient();
  function request(url, config) {
    return httpClient.request(url, config);
  }
  function getNPHPLedTorrent(id, type) {
    const body = new FormData();
    if (type === "addClaim") {
      body.append(API_PARAMS.ACTION, API_PARAM_VALUES.CLAIM);
      body.append(API_PARAMS.TORRENT_ID_PARAM, `${id}`);
    } else {
      body.append(API_PARAMS.ACTION, API_PARAM_VALUES.REMOVE_CLAIM);
      body.append(API_PARAMS.ID_PARAM, `${id}`);
    }
    return request(API_PATHS.AJAX, {
      method: "POST",
      body
    });
  }
  async function getNPHPUsertorrentlistajax(params) {
    return request(
      API_PATHS.USER_TORRENT_LIST_AJAX,
      {
        method: "GET",
        params
      }
    );
  }
  async function getNPHPUsertorrentHistory(params) {
    return request(API_PATHS.CLAIM_HISTORY, {
      method: "GET",
      params
    });
  }
  async function getNPHPPterUsertorrentlistajax(params) {
    return request(
      API_PATHS.USER_TORRENT_LIST,
      {
        method: "GET",
        params
      }
    );
  }
  function getNPHPPterLedTorrent(id) {
    const body = new FormData();
    return request(id, {
      method: "POST",
      body
    });
  }
  function getSSDLedTorrent(id) {
    const body = new FormData();
    body.append(API_PARAMS.ACTION, API_PARAM_VALUES.SSD_CLAIM);
    body.append(API_PARAMS.ID, `${id}`);
    return request(API_PATHS.SSD_ADOPT, {
      method: "POST",
      body
    });
  }
  function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) ?? "";
  }
  function hasNextPage(doc, selector) {
    return Boolean(doc.querySelector(selector));
  }
  function parseHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }
  async function processWithConcurrencyAndDelay(items, processor, concurrency, delayMs, onProgress) {
    if (items.length === 0) {
      return [];
    }
    const results = [];
    let index = 0;
    let completed = 0;
    const processItem = async () => {
      const currentIndex = index++;
      try {
        results.push(await processor(items[currentIndex]));
      } finally {
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        completed++;
        onProgress?.(completed, items.length);
      }
    };
    const worker = async () => {
      while (index < items.length) {
        await processItem();
      }
    };
    const workers = Array.from(
      { length: Math.min(concurrency, items.length) },
      () => worker()
    );
    await Promise.all(workers);
    return results;
  }
  class BaseAdapter {
    hasNextPage(doc, selector) {
      return Boolean(doc.querySelector(selector));
    }
    parseHTML(html) {
      const parser = new DOMParser();
      return parser.parseFromString(html, "text/html");
    }
async batchPerformAction(torrentIds, action, context, concurrency = DEFAULT_CONCURRENCY_LIMIT, delayMs = DEFAULT_DELAY_AFTER_REQUEST_MS) {
      return processWithConcurrencyAndDelay(
        torrentIds,
        (torrentId) => this.performAction(torrentId, action, context),
        concurrency,
        delayMs,
        context?.onProgress
      );
    }
  }
  class GenericAdapter extends BaseAdapter {
    name = "通用站点";
    type = SiteType.GENERIC;
    supports(url) {
      return url.includes(API_PATHS.USER_DETAILS) && !url.includes(SITE_DOMAINS.PTER);
    }
    async loadUserTorrents(userId, context) {
      const claimable = [];
      const claimed = [];
      let page = 0;
      do {
        context?.onPageLoad?.(page);
        const html = await getNPHPUsertorrentlistajax({
          page,
          userid: userId,
          type: "seeding"
        });
        const doc = parseHTML(html);
        const tdList = doc.querySelectorAll(SELECTORS.TORRENT_LIST_CELL);
        tdList.forEach((td) => {
          const buttons = td.querySelectorAll(SELECTORS.BUTTON);
          if (buttons.length < 2)
            return;
          const button0 = buttons[0];
          const button1 = buttons[1];
          const torrentId = button0.getAttribute("data-torrent_id");
          if (!torrentId)
            return;
          const text0 = button0.textContent || "";
          const text1 = button1.textContent || "";
          const display0 = button0.style.display;
          const display1 = button1.style.display;
          const isClaimable = (text0.includes(TEXT_CONTENT.CLAIM_BUTTON_CN) || text0.includes(TEXT_CONTENT.CLAIM_BUTTON_TW)) && display1 === CSS_VALUES.DISPLAY_NONE && !claimable.includes(torrentId);
          if (isClaimable) {
            claimable.push(torrentId);
          }
          const isClaimed = display0 === CSS_VALUES.DISPLAY_NONE && (text1.includes(TEXT_CONTENT.ABANDON_BUTTON_CN) || text1.includes(TEXT_CONTENT.ABANDON_BUTTON_TW)) && !claimed.includes(torrentId);
          if (isClaimed) {
            claimed.push(torrentId);
          }
        });
        page++;
        const hasMore = hasNextPage(
          doc,
          `a[href*="${API_PATHS.USER_TORRENT_LIST_AJAX}?${API_PARAMS.PAGE}=${page}"]`
        );
        if (!hasMore)
          break;
      } while (true);
      return { claimable, claimed };
    }
    async loadUserTorrentsHistory(uid, claimed, context) {
      const notSeeding = [];
      let page = 0;
      do {
        context?.onPageLoad?.(page);
        const html = await getNPHPUsertorrentHistory({ page, uid });
        const doc = parseHTML(html);
        const tdList = doc.querySelectorAll(SELECTORS.CLAIM_TABLE_CELL);
        tdList.forEach((td) => {
          const buttons = td.querySelectorAll(SELECTORS.BUTTON);
          if (buttons.length < 2)
            return;
          const button0 = buttons[0];
          const button1 = buttons[1];
          const torrentId = button1.getAttribute("data-torrent_id");
          const claimId = button1.getAttribute("data-claim_id");
          const display0 = button0.style.display;
          const text1 = button1.textContent || "";
          const shouldAdd = display0 === CSS_VALUES.DISPLAY_NONE && (text1.includes(TEXT_CONTENT.ABANDON_BUTTON_CN) || text1.includes(TEXT_CONTENT.ABANDON_BUTTON_TW)) && torrentId && !claimed.includes(torrentId) && claimId && !notSeeding.includes(claimId);
          if (shouldAdd && claimId) {
            notSeeding.push(claimId);
          }
        });
        page++;
        const hasMore = hasNextPage(doc, `a[href*="?${API_PARAMS.UID}=${uid}&${API_PARAMS.PAGE}=${page}"]`);
        if (!hasMore)
          break;
      } while (true);
      return notSeeding;
    }
    async performAction(torrentId, action, _context) {
      try {
        const data = await getNPHPLedTorrent(
          torrentId,
          action === ActionType.CLAIM ? API_PARAM_VALUES.CLAIM : API_PARAM_VALUES.REMOVE_CLAIM
        );
        return {
          success: true,
          message: data.msg || MESSAGES.SUCCESS.operation
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : MESSAGES.FAILURE.operation
        };
      }
    }
  }
  function setupRequestInterceptors() {
    httpClient.useRequest((config) => {
      const referer = window.location.href;
      return {
        ...config,
        headers: {
          ...config.headers,
"X-Requested-With": "XMLHttpRequest",
"Referer": referer,
"Origin": window.location.origin
        }
      };
    });
  }
  class PterAdapter extends BaseAdapter {
    name = "猫站";
    type = SiteType.PTER;
    supports(url) {
      setupRequestInterceptors();
      return url.includes(`${SITE_DOMAINS.PTER}/${API_PATHS.USER_DETAILS}`);
    }
    async loadUserTorrents(userId, context) {
      const claimable = [];
      const claimed = [];
      let page = 0;
      do {
        context?.onPageLoad?.(page);
        const html = await getNPHPPterUsertorrentlistajax({
          userid: userId,
          type: "seeding",
          do_ajax: 1
        });
        const doc = parseHTML(html);
        const claimDoms = doc.querySelectorAll(SELECTORS.PTER_CLAIM_CONFIRM);
        claimDoms.forEach((dom) => {
          const id = dom.getAttribute("data-url") || "";
          if (id && !claimable.includes(id)) {
            claimable.push(id);
          }
        });
        const removeDoms = doc.querySelectorAll(SELECTORS.PTER_REMOVE_CONFIRM);
        removeDoms.forEach((dom) => {
          const id = dom.getAttribute("data-url") || "";
          if (id && !claimed.includes(id)) {
            claimed.push(id);
          }
        });
        page++;
        const hasMore = hasNextPage(
          doc,
          `a[href*="?${API_PARAMS.USER_ID}=${userId}&${API_PARAMS.TYPE}=seeding&${API_PARAMS.PAGE}=${page}"]`
        );
        if (!hasMore)
          break;
      } while (true);
      return { claimable, claimed };
    }
    async performAction(torrentId, action, _context) {
      if (action !== ActionType.CLAIM) {
        return {
          success: false,
          message: MESSAGES.ABANDON_NOT_SUPPORTED.pter
        };
      }
      try {
        const success = await getNPHPPterLedTorrent(torrentId);
        return {
          success,
          message: success ? MESSAGES.SUCCESS.claim : MESSAGES.FAILURE.claim
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : MESSAGES.FAILURE.claim
        };
      }
    }
  }
  class SpringSundayAdapter extends BaseAdapter {
    name = "春天站";
    type = SiteType.SPRING_SUNDAY;
    supports(url) {
      return url.includes(`${SITE_DOMAINS.SPRING_SUNDAY}/${API_PATHS.USER_DETAILS}`);
    }
    async loadUserTorrents(userId, context) {
      const claimable = [];
      const claimed = [];
      let page = 0;
      do {
        context?.onPageLoad?.(page);
        const html = await getNPHPUsertorrentlistajax({
          page,
          userid: userId,
          type: "seeding"
        });
        const doc = parseHTML(html);
        const claimDoms = doc.querySelectorAll(SELECTORS.SSD_BUTTON);
        claimDoms.forEach((dom) => {
          const id = dom.getAttribute("id")?.replace("btn", "") || "";
          if (id && !claimable.includes(id)) {
            claimable.push(id);
          }
        });
        const removeDoms = doc.querySelectorAll(SELECTORS.SSD_NOWRAP);
        removeDoms.forEach((dom) => {
          if (dom.textContent?.trim() === TEXT_CONTENT.CLAIMED_CN) {
            const id = dom.getAttribute("id")?.replace("btn", "") || "";
            if (id && !claimed.includes(id)) {
              claimed.push(id);
            }
          }
        });
        page++;
        const hasMore = hasNextPage(
          doc,
          `a[href*="?userid=${userId}&type=seeding&page=${page}"]`
        );
        if (!hasMore)
          break;
      } while (true);
      return { claimable, claimed };
    }
    async performAction(torrentId, action, _context) {
      if (action !== ActionType.CLAIM) {
        return {
          success: false,
          message: MESSAGES.ABANDON_NOT_SUPPORTED.springsunday
        };
      }
      try {
        const data = await getSSDLedTorrent(torrentId);
        return {
          success: true,
          message: data.msg || MESSAGES.SUCCESS.claim
        };
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : MESSAGES.FAILURE.claim
        };
      }
    }
  }
  class SiteFactory {
    static adapters = [
      new PterAdapter(),
      new SpringSundayAdapter(),
      new GenericAdapter()
    ];
    static getAdapter(url) {
      return this.adapters.find((adapter) => adapter.supports(url)) || null;
    }
    static registerAdapter(adapter) {
      this.adapters.unshift(adapter);
    }
  }
  class TorrentService {
    constructor(adapter) {
      this.adapter = adapter;
    }
    async loadUserTorrents(userId, onProgress) {
      try {
        onProgress?.("正在加载种子数据...");
        const data = await this.adapter.loadUserTorrents(userId, {
          onPageLoad: (page) => onProgress?.(`正在加载第 ${page + 1} 页...`)
        });
        const total = data.claimable.length + data.claimed.length;
        onProgress?.(`加载完成，共找到 ${total} 个种子`);
        return data;
      } catch (error) {
        const message = getUserMessage(error);
        onProgress?.(`加载失败: ${message}`);
        throw error;
      }
    }
async loadUserTorrentsHistory(userId, claimed, onProgress) {
      if (!this.adapter.loadUserTorrentsHistory) {
        onProgress?.("当前站点不支持历史记录查询");
        return [];
      }
      try {
        onProgress?.("正在加载历史领种数据...");
        const notSeeding = await this.adapter.loadUserTorrentsHistory(userId, claimed, {
          onPageLoad: (page) => onProgress?.(`正在加载第 ${page + 1} 页...`)
        });
        onProgress?.(`加载完成，找到 ${notSeeding.length} 个不在做种的种子`);
        return notSeeding;
      } catch (error) {
        const message = getUserMessage(error);
        onProgress?.(`加载失败: ${message}`);
        throw error;
      }
    }
async batchPerformAction(torrentIds, action, onProgress) {
      const results = await this.adapter.batchPerformAction(
        torrentIds,
        action,
        { onProgress }
      );
      const stats = {};
      for (const result of results) {
        stats[result.message] = (stats[result.message] ?? 0) + 1;
      }
      return stats;
    }
    getAdapterName() {
      return this.adapter.name;
    }
  }
  function animateButton(event) {
    event.preventDefault();
    const target = event.target;
    if (!target)
      return;
    target.classList.remove("animate");
    void target.offsetWidth;
    target.classList.add("animate");
    setTimeout(() => {
      target.classList.remove("animate");
    }, 700);
  }
  function buildMessageList(messages) {
    return Object.entries(messages).map(([key, value]) => `<li>${key}: ${value}</li>`).join("");
  }
  function buildProgressText(total, current) {
    return `努力再努力 ${total} / ${current}`;
  }
  const ledTorrentScss = '.led-box{position:fixed;top:80px;left:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}.led-box ul{margin-left:0;padding-left:0}.led-box li{color:#fff;background-color:#ff0081;list-style:none;line-height:20px;font-size:14px;margin-left:0;padding:8px 10px}.bubbly-button{font-family:Helvetica,Arial,sans-serif;display:inline-block;font-size:20px;padding:8px 10px;appearance:none;background-color:#ff0081;color:#fff;border-radius:4px;border:none;cursor:pointer;position:relative;transition:transform ease-in .1s,box-shadow ease-in .25s;box-shadow:0 2px 25px #ff008280}.bubbly-button:hover{background-color:#ff0081}.bubbly-button:focus{outline:0}.bubbly-button:before,.bubbly-button:after{position:absolute;content:"";display:block;width:140%;height:100%;left:-20%;z-index:-1000;transition:all ease-in-out .5s;background-repeat:no-repeat}.bubbly-button:before{display:none;top:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 20%,#ff0081 20%,transparent 30%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:10% 10%,20% 20%,15% 15%,20% 20%,18% 18%,10% 10%,15% 15%,10% 10%,18% 18%}.bubbly-button:after{display:none;bottom:-75%;background-image:radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,transparent 10%,#ff0081 15%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%),radial-gradient(circle,#ff0081 20%,transparent 20%);background-size:15% 15%,20% 20%,18% 18%,20% 20%,15% 15%,10% 10%,20% 20%}.bubbly-button:active{transform:scale(.9);background-color:#e60074;box-shadow:0 2px 25px #ff008233}.bubbly-button.animate:before{display:block;animation:topBubbles ease-in-out .75s forwards}.bubbly-button.animate:after{display:block;animation:bottomBubbles ease-in-out .75s forwards}@keyframes topBubbles{0%{background-position:5% 90%,10% 90%,10% 90%,15% 90%,25% 90%,25% 90%,40% 90%,55% 90%,70% 90%}50%{background-position:0% 80%,0% 20%,10% 40%,20% 0%,30% 30%,22% 50%,50% 50%,65% 20%,90% 30%}to{background-position:0% 70%,0% 10%,10% 30%,20% -10%,30% 20%,22% 40%,50% 40%,65% 10%,90% 20%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}@keyframes bottomBubbles{0%{background-position:10% -10%,30% 10%,55% -10%,70% -10%,85% -10%,70% -10%,70% 0%}50%{background-position:0% 80%,20% 80%,45% 60%,60% 100%,75% 70%,95% 60%,105% 0%}to{background-position:0% 90%,20% 90%,45% 70%,60% 110%,75% 80%,95% 70%,110% 10%;background-size:0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%}}';
  importCSS(ledTorrentScss);
  class LoadingState {
    _loading = false;
    get isLoading() {
      return this._loading;
    }
    start() {
      this._loading = true;
    }
    stop() {
      this._loading = false;
    }
  }
  class UIManager {
    button;
    messageList;
    loadingState;
    constructor(button, messageList) {
      this.button = button;
      this.messageList = messageList;
      this.loadingState = new LoadingState();
    }
    setupButtonListener(handler) {
      this.button.addEventListener("click", async (e) => {
        if (this.loadingState.isLoading) {
          e.preventDefault();
          return;
        }
        this.loadingState.start();
        animateButton(e);
        this.button.disabled = true;
        try {
          await handler();
        } catch (error) {
          console.error("Error:", error);
          this.showError(error);
        } finally {
          this.loadingState.stop();
          this.button.disabled = false;
        }
      });
    }
    showError(error) {
      const message = error instanceof Error ? error.message : "未知错误";
      this.button.textContent = message;
    }
    setText(text) {
      this.button.textContent = text;
    }
    updateMessages(messages) {
      this.messageList.innerHTML = buildMessageList(messages);
    }
    addMessage(message) {
      this.messageList.innerHTML += `<li>${message}</li>`;
    }
  }
  class AppController {
    ui;
    service = null;
    constructor(ui) {
      this.ui = ui;
    }
    init() {
      const url = window.location.href;
      const adapter = SiteFactory.getAdapter(url);
      if (!adapter) {
        this.ui.setText("当前站点不支持");
        this.ui.addMessage("未找到适配当前站点的处理器");
        return;
      }
      this.service = new TorrentService(adapter);
      if (url.includes("claim.php")) {
        this.setupAbandonButton();
      } else {
        this.setupClaimButton();
      }
    }
    setupClaimButton() {
      if (!this.service)
        return;
      this.ui.setText("一键认领");
      this.ui.addMessage("点击按钮开始认领种子");
      this.ui.setupButtonListener(async () => {
        const userId = getUrlParam("id");
        if (!userId)
          throw new Error("无法获取用户ID");
        this.ui.setText("正在加载种子数据...");
        const data = await this.service.loadUserTorrents(userId, (msg) => this.ui.addMessage(msg));
        if (data.claimed.length > 0)
          this.ui.updateMessages({ 已经认领过: data.claimed.length });
        if (data.claimable.length === 0) {
          this.ui.setText("没有可认领的种子");
          return;
        }
        const confirmed = confirm(`找到 ${data.claimable.length} 个可认领种子，是否开始认领？`);
        if (!confirmed)
          return;
        this.ui.setText("开始认领...");
        const stats = await this.service.batchPerformAction(
          data.claimable,
          ActionType.CLAIM,
          (current, total) => {
            this.ui.setText(buildProgressText(total, current));
          }
        );
        this.ui.setText("认领完成，刷新查看");
        this.ui.updateMessages(stats);
      });
    }
    setupAbandonButton() {
      if (!this.service)
        return;
      this.ui.setText("一键弃种");
      this.ui.addMessage("放弃本人没在做种的种子");
      this.ui.setupButtonListener(async () => {
        const userId = getUrlParam("uid");
        if (!userId)
          throw new Error("无法获取用户ID");
        const confirmed = confirm("真的要弃种吗?");
        if (!confirmed)
          return;
        this.ui.setText("正在获取做种数据...");
        const seedingData = await this.service.loadUserTorrents(userId, (msg) => this.ui.addMessage(msg));
        this.ui.addMessage(`获取所有在做种且领取状态的数据一共 ${seedingData.claimed.length} 个`);
        this.ui.setText("正在获取历史领种数据...");
        const notSeeding = await this.service.loadUserTorrentsHistory(
          userId,
          seedingData.claimed,
          (msg) => this.ui.addMessage(msg)
        );
        if (notSeeding.length === 0) {
          this.ui.setText("没有需要弃种的种子");
          return;
        }
        this.ui.addMessage(`获取所有没在做种且领取状态的数据一共 ${notSeeding.length} 个`);
        const confirmed2 = confirm(
          `目前有 ${notSeeding.length} 个可能不在做种状态，真的要放弃领种吗?`
        );
        if (!confirmed2)
          return;
        this.ui.setText("开始弃种...");
        const stats = await this.service.batchPerformAction(
          notSeeding,
          ActionType.ABANDON,
          (current, total) => {
            this.ui.setText(buildProgressText(total, current));
          }
        );
        this.ui.setText("弃种完成");
        this.ui.updateMessages(stats);
      });
    }
  }
  function bootstrap() {
    const button = document.createElement("button");
    button.className = "bubbly-button";
    const messageList = document.createElement("ul");
    const container = document.createElement("div");
    container.className = "led-box";
    container.appendChild(button);
    container.appendChild(messageList);
    const ui = new UIManager(button, messageList);
    const controller = new AppController(ui);
    controller.init();
    document.body.appendChild(container);
  }
  bootstrap();

})();