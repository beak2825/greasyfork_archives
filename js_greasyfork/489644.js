// ==UserScript==
// @name           BiliBili自动添加视频收藏
// @description    进入视频页面后, 自动添加视频到收藏夹中. 
// @version        0.6.2
// @author         Yiero
// @match          https://www.bilibili.com/video/*
// @match          https://www.bilibili.com/s/video/*
// @match          https://www.bilibili.com/bangumi/play/*
// @run-at         document-start
// @license        GPL-3
// @connect        api.bilibili.com
// @icon           https://www.bilibili.com/favicon.ico
// @namespace      https://github.com/AliubYiero/Yiero_WebScripts
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
// @grant          GM_xmlhttpRequest
// @grant          GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/489644/BiliBili%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489644/BiliBili%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E8%A7%86%E9%A2%91%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
/*
* @module      : @yiero/gmlib
* @author      : Yiero
* @version     : 0.1.23
* @description : GM Lib for Tampermonkey
* @keywords    : tampermonkey, lib, scriptcat, utils
* @license     : MIT
* @repository  : git+https://github.com/AliubYiero/GmLib.git
*/
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
const environmentTest = () => {
  return GM_info.scriptHandler;
};
function getCookie(content, key) {
  const isTextCookie = [/^\w+=[^=;]+$/, /^\w+=[^=;]+;/].some((reg) => reg.test(content));
  if (isTextCookie) {
    if (!key) {
      return Promise.reject(new Error(`\u8BF7\u8F93\u5165\u9700\u8981\u83B7\u53D6\u7684\u5177\u4F53 Cookie \u7684\u952E\u540D.`));
    }
    const cookieList = content.split(/;\s?/).map((cookie) => cookie.split("="));
    const cookieMap = new Map(cookieList);
    const cookieValue = cookieMap.get(key);
    if (!cookieValue) {
      return Promise.reject(new Error("\u83B7\u53D6 Cookie \u5931\u8D25, key \u4E0D\u5B58\u5728."));
    }
    return Promise.resolve(cookieValue);
  }
  return new Promise((resolve, reject) => {
    const env = environmentTest();
    if (env !== "ScriptCat") {
      reject(`\u5F53\u524D\u811A\u672C\u4E0D\u652F\u6301 ${env} \u73AF\u5883, \u4EC5\u652F\u6301 ScriptCat .`);
    }
    GM_cookie("list", {
      domain: content
    }, (cookieList) => {
      if (!cookieList) {
        reject(new Error("\u83B7\u53D6 Cookie \u5931\u8D25, \u8BE5\u57DF\u540D\u4E0B\u6CA1\u6709 cookie. "));
        return;
      }
      if (!key) {
        resolve(cookieList);
      }
      const userIdCookie = cookieList.find(
        (cookie) => cookie.name === key
      );
      if (!userIdCookie) {
        reject(new Error("\u83B7\u53D6 Cookie \u5931\u8D25, key \u4E0D\u5B58\u5728. "));
        return;
      }
      resolve(userIdCookie.value);
    });
  });
}
const parseResponseText = (responseText) => {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    try {
      const domParser = new DOMParser();
      return domParser.parseFromString(responseText, "text/html");
    } catch (e2) {
      return responseText;
    }
  }
};
function gmRequest(param1, method, body, GMXmlHttpRequestConfig) {
  const unifiedParameters = () => {
    if (typeof param1 !== "string") {
      return {
        url: param1.url,
        method: param1.method || "GET",
        param: param1.method === "POST" ? param1.data : void 0,
        GMXmlHttpRequestConfig: param1
      };
    }
    return {
      url: param1,
      method,
      param: body,
      GMXmlHttpRequestConfig: {}
    };
  };
  const params = unifiedParameters();
  if (params.method === "GET" && params.param && typeof params.param === "object") {
    params.url = `${params.url}?${new URLSearchParams(params.param).toString()}`;
  }
  if (params.method === "POST" && params.param) {
    params.GMXmlHttpRequestConfig.data = JSON.stringify(params.param);
  }
  return new Promise((resolve, reject) => {
    const newGMXmlHttpRequestConfig = {
      // 默认20s的超时等待
      timeout: 2e4,
      // 请求地址, 请求方法和请求返回
      url: params.url,
      method: params.method,
      onload(response) {
        resolve(parseResponseText(response.responseText));
      },
      onerror(error) {
        reject(error);
      },
      ontimeout() {
        reject(new Error("Request timed out"));
      },
      headers: {
        "Content-Type": "application/json"
      },
      // 用户自定义的油猴配置项
      ...params.GMXmlHttpRequestConfig
    };
    GM_xmlhttpRequest(newGMXmlHttpRequestConfig);
  });
}
const returnElement = (selector, options, resolve, reject) => {
  setTimeout(() => {
    const element = options.parent.querySelector(selector);
    if (!element) {
      reject(new Error("Void Element"));
      return;
    }
    resolve(element);
  }, options.delayPerSecond * 1e3);
};
const getElementByTimer = (selector, options, resolve, reject) => {
  const intervalDelay = 100;
  let intervalCounter = 0;
  const maxIntervalCounter = Math.ceil(options.timeoutPerSecond * 1e3 / intervalDelay);
  const timer = window.setInterval(() => {
    if (++intervalCounter > maxIntervalCounter) {
      clearInterval(timer);
      returnElement(selector, options, resolve, reject);
      return;
    }
    const element = options.parent.querySelector(selector);
    if (element) {
      clearInterval(timer);
      returnElement(selector, options, resolve, reject);
    }
  }, intervalDelay);
};
const getElementByMutationObserver = (selector, options, resolve, reject) => {
  const timer = options.timeoutPerSecond && window.setTimeout(() => {
    observer.disconnect();
    returnElement(selector, options, resolve, reject);
  }, options.timeoutPerSecond * 1e3);
  const observeElementCallback = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((addNode) => {
        if (addNode.nodeType !== Node.ELEMENT_NODE) {
          return;
        }
        const addedElement = addNode;
        const element = addedElement.matches(selector) ? addedElement : addedElement.querySelector(selector);
        if (element) {
          timer && clearTimeout(timer);
          returnElement(selector, options, resolve, reject);
        }
      });
    });
  };
  const observer = new MutationObserver(observeElementCallback);
  observer.observe(options.parent, {
    subtree: true,
    childList: true
  });
  return true;
};
function elementWaiter(selector, options) {
  const elementWaiterOptions = {
    parent: document,
    timeoutPerSecond: 20,
    delayPerSecond: 0.5,
    ...options
  };
  return new Promise((resolve, reject) => {
    const targetElement = elementWaiterOptions.parent.querySelector(selector);
    if (targetElement) {
      returnElement(selector, elementWaiterOptions, resolve, reject);
      return;
    }
    if (MutationObserver) {
      getElementByMutationObserver(selector, elementWaiterOptions, resolve, reject);
      return;
    }
    getElementByTimer(selector, elementWaiterOptions, resolve, reject);
  });
}
let messageContainer = null;
const messageTypes = {
  success: {
    backgroundColor: "#f0f9eb",
    borderColor: "#e1f3d8",
    textColor: "#67c23a",
    icon: "\u2713"
  },
  warning: {
    backgroundColor: "#fdf6ec",
    borderColor: "#faecd8",
    textColor: "#e6a23c",
    icon: "\u26A0"
  },
  error: {
    backgroundColor: "#fef0f0",
    borderColor: "#fde2e2",
    textColor: "#f56c6c",
    icon: "\u2715"
  },
  info: {
    backgroundColor: "#edf2fc",
    borderColor: "#e4e7ed",
    textColor: "#909399",
    icon: "i"
  }
};
const messagePositions = {
  "top": { top: "20px" },
  "top-left": { top: "20px", left: "20px" },
  "top-right": { top: "20px", right: "20px" },
  "left": { left: "20px" },
  "right": { right: "20px" },
  "bottom": { bottom: "20px" },
  "bottom-left": { bottom: "20px", left: "20px" },
  "bottom-right": { bottom: "20px", right: "20px" }
};
function createMessageContainer() {
  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.setAttribute("style", `
                    position: fixed;
                    z-index: 9999999999;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100vw;
                `);
    document.body.appendChild(messageContainer);
  }
  return messageContainer;
}
function Message(options) {
  const detail = {
    type: "info",
    duration: 3e3,
    position: "top",
    message: ""
  };
  if (typeof options === "string") {
    detail.message = options;
  } else {
    Object.assign(detail, options);
  }
  messageContainer = createMessageContainer();
  const messageEl = document.createElement("div");
  const typeConfig = messageTypes[detail.type] || messageTypes.info;
  messageEl.setAttribute("style", `
                position: absolute;
                min-width: 300px;
                max-width: 500px;
                padding: 15px 20px;
                border-radius: 8px;
                transform: translateY(-20px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                background-color: ${typeConfig.backgroundColor};
                border: 1px solid ${typeConfig.borderColor};
                color: ${typeConfig.textColor};
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
                opacity: 0;
                pointer-events: auto;
                cursor: pointer;
                ${Object.entries(messagePositions[detail.position || "top"]).map(([k, v]) => `${k}: ${v};`).join(" ")}
            `);
  const iconEl = document.createElement("span");
  iconEl.setAttribute("style", `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                margin-right: 12px;
                font-size: 16px;
                font-weight: bold;
            `);
  iconEl.textContent = typeConfig.icon;
  messageEl.appendChild(iconEl);
  const contentEl = document.createElement("span");
  contentEl.setAttribute("style", `
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            `);
  contentEl.textContent = detail.message;
  messageEl.appendChild(contentEl);
  messageContainer.appendChild(messageEl);
  setTimeout(() => {
    messageEl.style.opacity = "1";
    messageEl.style.transform = "translateY(0)";
  }, 10);
  let timer = setTimeout(() => {
    closeMessage(messageEl);
  }, detail.duration);
  messageEl.addEventListener("click", () => {
    clearTimeout(timer);
    closeMessage(messageEl);
  });
}
function closeMessage(element) {
  element.style.opacity = "0";
  element.style.transform = "translateY(-20px)";
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }, 300);
}
Message.success = (message, options) => Message({
  ...options,
  message,
  type: "success"
});
Message.warning = (message, options) => Message({
  ...options,
  message,
  type: "warning"
});
Message.error = (message, options) => Message({
  ...options,
  message,
  type: "error"
});
Message.info = (message, options) => Message({
  ...options,
  message,
  type: "info"
});
const _gmMenuCommand = class _gmMenuCommand2 {
  constructor() {
  }
  /**
   * 获取一个菜单按钮
   */
  static get(title) {
    const commandButton = this.list.find((commandButton2) => commandButton2.title === title);
    if (!commandButton) {
      throw new Error("\u83DC\u5355\u6309\u94AE\u4E0D\u5B58\u5728");
    }
    return commandButton;
  }
  /**
   * 创建一个带有状态的菜单按钮
   */
  static createToggle(details) {
    this.create(details.active.title, () => {
      this.toggleActive(details.active.title);
      this.toggleActive(details.inactive.title);
      details.active.onClick();
      this.render();
    }, true).create(details.inactive.title, () => {
      this.toggleActive(details.active.title);
      this.toggleActive(details.inactive.title);
      details.inactive.onClick();
      this.render();
    }, false);
    return _gmMenuCommand2;
  }
  /**
   * 手动激活一个菜单按钮
   */
  static click(title) {
    const commandButton = this.get(title);
    commandButton.onClick();
    return _gmMenuCommand2;
  }
  /**
   * 创建一个菜单按钮
   */
  static create(title, onClick, isActive = true) {
    if (this.list.some((commandButton) => commandButton.title === title)) {
      throw new Error("\u83DC\u5355\u6309\u94AE\u5DF2\u5B58\u5728");
    }
    this.list.push({ title, onClick, isActive, id: 0 });
    return _gmMenuCommand2;
  }
  /**
   * 删除一个菜单按钮
   */
  static remove(title) {
    this.list = this.list.filter((commandButton) => commandButton.title !== title);
    return _gmMenuCommand2;
  }
  /**
   * 修改两个菜单按钮的顺序
   */
  static swap(title1, title2) {
    const index1 = this.list.findIndex((commandButton) => commandButton.title === title1);
    const index2 = this.list.findIndex((commandButton) => commandButton.title === title2);
    if (index1 === -1 || index2 === -1) {
      throw new Error("\u83DC\u5355\u6309\u94AE\u4E0D\u5B58\u5728");
    }
    [this.list[index1], this.list[index2]] = [this.list[index2], this.list[index1]];
    return _gmMenuCommand2;
  }
  /**
   * 修改一个菜单按钮
   */
  static modify(title, details) {
    const commandButton = this.get(title);
    details.onClick && (commandButton.onClick = details.onClick);
    details.isActive && (commandButton.isActive = details.isActive);
    return _gmMenuCommand2;
  }
  /**
   * 切换菜单按钮激活状态
   */
  static toggleActive(title) {
    const commandButton = this.get(title);
    commandButton.isActive = !commandButton.isActive;
    return _gmMenuCommand2;
  }
  /**
   * 渲染所有激活的菜单按钮
   */
  static render() {
    this.list.forEach((commandButton) => {
      GM_unregisterMenuCommand(commandButton.id);
      if (commandButton.isActive) {
        commandButton.id = GM_registerMenuCommand(commandButton.title, commandButton.onClick);
      }
    });
  }
};
__publicField2(_gmMenuCommand, "list", []);
let gmMenuCommand = _gmMenuCommand;
class GmStorage {
  constructor(key, defaultValue) {
    __publicField2(this, "listenerId", 0);
    this.key = key;
    this.defaultValue = defaultValue;
    this.key = key;
    this.defaultValue = defaultValue;
  }
  /**
   * 获取当前存储的值
   *
   * @alias get()
   */
  get value() {
    return this.get();
  }
  /**
   * 获取当前存储的值
   */
  get() {
    return GM_getValue(this.key, this.defaultValue);
  }
  /**
   * 给当前存储设置一个新值
   */
  set(value) {
    return GM_setValue(this.key, value);
  }
  /**
   * 移除当前键
   */
  remove() {
    GM_deleteValue(this.key);
  }
  /**
   * 监听元素更新, 同时只能存在 1 个监听器
   */
  updateListener(callback) {
    this.removeListener();
    this.listenerId = GM_addValueChangeListener(this.key, (key, oldValue, newValue, remote) => {
      callback({
        key,
        oldValue,
        newValue,
        remote
      });
    });
  }
  /**
   * 移除元素更新回调
   */
  removeListener() {
    GM_removeValueChangeListener(this.listenerId);
  }
}
const favoriteTitleStorage = new GmStorage("\u914D\u7F6E\u9879.favouriteTitle", "fun");
const showMessageStorage = new GmStorage("showMessage", true);
const registerMenu = () => {
  gmMenuCommand.create("\u8BF7\u8F93\u5165\u6536\u85CF\u5939\u6807\u9898", () => {
    const title = (prompt("\u8BF7\u8F93\u5165\u6536\u85CF\u5939\u6807\u9898", favoriteTitleStorage.get()) || "").trim();
    if (!title) {
      return;
    }
    favoriteTitleStorage.set(title);
  }).createToggle({
    active: {
      title: "\u6536\u85CF\u72B6\u6001\u901A\u77E5(on)",
      onClick: () => {
        showMessageStorage.set(false);
      }
    },
    inactive: {
      title: "\u6536\u85CF\u72B6\u6001\u901A\u77E5(off)",
      onClick: () => {
        showMessageStorage.set(true);
      }
    }
  }).render();
  if (!showMessageStorage.get()) {
    gmMenuCommand.toggleActive("\u6536\u85CF\u72B6\u6001\u901A\u77E5(on)").toggleActive("\u6536\u85CF\u72B6\u6001\u901A\u77E5(off)").render();
  }
};
async function freshListenerPushState(callback, delayPerSecond = 1) {
  let _pushState = window.history.pushState.bind(window.history);
  window.history.pushState = function() {
    setTimeout(callback, delayPerSecond * 1e3);
    return _pushState.apply(this, arguments);
  };
}
const codeConfig = {
  XOR_CODE: 23442827791579n,
  MASK_CODE: 2251799813685247n,
  BASE: 58n,
  data: "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"
};
function bvToAv(bvid) {
  const { MASK_CODE, XOR_CODE, data, BASE } = codeConfig;
  const bvidArr = Array.from(bvid);
  [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
  [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
  bvidArr.splice(0, 3);
  const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
  return Number(tmp & MASK_CODE ^ XOR_CODE);
}
const api_getEpInfo = async (epId) => {
  const response = await gmRequest("https://api.bilibili.com/pgc/view/web/season", "GET", {
    ep_id: epId
  });
  const episode = response.result.episodes.find((item) => item.id === Number(epId));
  if (!episode) return Promise.reject("\u83B7\u53D6\u756A\u5267\u4FE1\u606F\u5931\u8D25");
  return episode;
};
const getVideoEpId = async () => {
  let urlPathNameList = new URL(window.location.href).pathname.split("/");
  let videoId = urlPathNameList.find(
    (urlPathName) => urlPathName.startsWith("ep") || urlPathName.startsWith("ss")
  );
  if (!videoId) return void 0;
  if (videoId.startsWith("ss")) {
    const linkNode = await elementWaiter(
      'link[rel="canonical"]',
      { parent: document }
    );
    if (!linkNode) return void 0;
    urlPathNameList = new URL(linkNode.href).pathname.split("/");
    videoId = urlPathNameList.find((urlPathName) => urlPathName.startsWith("ep"));
    if (!videoId) return void 0;
  }
  videoId = videoId.slice(2);
  return videoId;
};
const getVideoAvId = async () => {
  const urlPathNameList = new URL(window.location.href).pathname.split("/");
  let videoId = urlPathNameList.find(
    (urlPathName) => urlPathName.startsWith("BV1") || urlPathName.startsWith("av") || urlPathName.startsWith("ep") || urlPathName.startsWith("ss")
  );
  if (!videoId) {
    throw new Error("\u6CA1\u6709\u83B7\u53D6\u5230\u89C6\u9891id");
  }
  if (videoId.startsWith("BV1")) {
    videoId = String(bvToAv(videoId));
  }
  if (videoId.startsWith("av")) {
    videoId = videoId.slice(2);
  }
  if (videoId.startsWith("ep") || videoId.startsWith("ss")) {
    const epId = await getVideoEpId();
    if (!epId) throw new Error("\u6CA1\u6709\u83B7\u53D6\u5230\u89C6\u9891id");
    const epInfo = await api_getEpInfo(epId);
    videoId = String(epInfo.aid);
  }
  return videoId;
};
const api_isFavorVideo = async () => {
  const aid = await getVideoAvId();
  const res = await gmRequest("https://api.bilibili.com/x/v2/fav/video/favoured", "GET", {
    aid
  });
  if (res.code !== 0) {
    throw new Error(res.message);
  }
  return res.data.favoured;
};
const api_listAllFavorites = async (upUid) => {
  const res = await gmRequest("https://api.bilibili.com/x/v3/fav/folder/created/list-all", "GET", {
    up_mid: upUid
  });
  if (res.code !== 0) {
    throw new Error(res.message);
  }
  return res.data.list;
};
const requestConfig = {
  baseURL: "https://api.bilibili.com",
  csrf: ""
};
getCookie(document.cookie, "bili_jct").then((bili_jct) => requestConfig.csrf = bili_jct);
const xhrRequest = (url, method, data) => {
  if (!url.startsWith("http")) {
    url = requestConfig.baseURL + url;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  return new Promise((resolve, reject) => {
    xhr.addEventListener("load", () => {
      const response = JSON.parse(xhr.response);
      if (response.code !== 0) {
        return reject(response.message);
      }
      return resolve(response);
    });
    xhr.addEventListener("error", () => reject(xhr.status));
    xhr.send(new URLSearchParams(data));
  });
};
const api_collectVideoToFavorite = async (videoId, favoriteId) => {
  const epId = await getVideoEpId();
  const formData = {
    rid: videoId,
    type: epId ? "42" : "2",
    add_media_ids: favoriteId,
    csrf: requestConfig.csrf
  };
  return xhrRequest(
    "/x/v3/fav/resource/deal",
    "POST",
    formData
  );
};
const api_createFavorites = (favTitle) => {
  return xhrRequest("/x/v3/fav/folder/add", "POST", {
    // 视频标题
    title: favTitle,
    // 默认私密收藏夹
    privacy: 1,
    // csrf
    csrf: requestConfig.csrf
  });
};
const isEqual = (x, y) => {
  if (Object.is(x, y))
    return true;
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }
  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString();
  }
  if (typeof x !== "object" || x === null || typeof y !== "object" || y === null) {
    return false;
  }
  const keysX = Reflect.ownKeys(x);
  const keysY = Reflect.ownKeys(y);
  if (keysX.length !== keysY.length)
    return false;
  for (let i = 0; i < keysX.length; i++) {
    if (!Reflect.has(y, keysX[i]))
      return false;
    if (!isEqual(x[keysX[i]], y[keysX[i]]))
      return false;
  }
  return true;
};
const sleep = (milliseconds) => {
  return new Promise((res) => setTimeout(res, milliseconds));
};
const api_sortFavorites = async (favoriteIdList) => {
  return xhrRequest("/x/v3/fav/folder/sort", "POST", {
    sort: favoriteIdList.toString(),
    csrf: requestConfig.csrf
  });
};
const getUserUid = async () => {
  const uid = await getCookie(document.cookie, "DedeUserID");
  if (!uid) {
    return Promise.reject("\u7528\u6237\u672A\u767B\u5F55");
  }
  return Promise.resolve(uid);
};
class Favourites {
  constructor() {
    // 所有收藏夹
    __publicField(this, "favouriteList", []);
    // 所有已看收藏夹
    __publicField(this, "readFavouriteList", []);
    // 已看收藏夹标题
    __publicField(this, "readFavouriteTitle", favoriteTitleStorage.get());
    // 用户 uid
    __publicField(this, "userUid", "");
  }
  /**
   * 获取最新的已看收藏夹
   */
  get latestReadFavourite() {
    return this.readFavouriteList[0];
  }
  /**
   * 获取最新的已看收藏夹编号
   */
  get latestReadFavouriteId() {
    if (!this.latestReadFavourite) {
      return 0;
    }
    return Number(this.latestReadFavourite.title.slice(this.readFavouriteTitle.length));
  }
  /**
   * 默认收藏夹
   */
  get defaultFavourite() {
    return this.favouriteList[0];
  }
  /**
   * 获取所有收藏夹
   */
  async get(isFresh = false) {
    if (!isFresh && this.favouriteList.length) {
      return this.favouriteList;
    }
    this.favouriteList = await api_listAllFavorites(this.userUid);
    return this.favouriteList;
  }
  /**
   * 添加视频到已看收藏夹
   */
  async addVideo(videoAvId) {
    videoAvId = String(videoAvId);
    if (!this.latestReadFavourite || this.isFull(this.latestReadFavourite)) {
      await this.createNew();
    }
    const latestReadFavourite = this.latestReadFavourite;
    const latestFavoriteId = String(latestReadFavourite.id);
    const res = await api_collectVideoToFavorite(videoAvId, latestFavoriteId);
    const successfullyAdd = res.data.success_num === 0;
    if (!successfullyAdd) {
      console.error(res.data.toast_msg);
      return;
    }
    console.info(`\u5F53\u524D\u89C6\u9891\u5DF2\u6DFB\u52A0\u81F3\u6536\u85CF\u5939 [${latestReadFavourite.title}]`);
    await this.sortOlderFavoritesToLast();
  }
  /**
   * 创建一个新的收藏夹
   */
  async createNew() {
    if (this.readFavouriteTitle === "\u9ED8\u8BA4\u6536\u85CF\u5939") {
      return;
    }
    await api_createFavorites(`${this.readFavouriteTitle}${this.latestReadFavouriteId + 1}`);
    await sleep(1e3);
    await this.init();
    await this.sortOlderFavoritesToLast();
    await this.init();
  }
  /**
   * 获取所有已看收藏夹
   */
  getRead(isFresh = false) {
    if (!isFresh && this.readFavouriteList.length) {
      return this.readFavouriteList;
    }
    const readFavouriteList = this.favouriteList.filter(
      (favoriteInfo) => favoriteInfo.title.trim().match(new RegExp(`^${this.readFavouriteTitle}\\d*$`))
    );
    readFavouriteList.sort((a, b) => {
      const aIndex = Number(a.title.slice(this.readFavouriteTitle.length));
      const bIndex = Number(b.title.slice(this.readFavouriteTitle.length));
      return bIndex - aIndex;
    });
    this.readFavouriteList = readFavouriteList;
    return readFavouriteList;
  }
  /**
   * 初始化收藏夹数据
   */
  async init() {
    this.userUid = await getUserUid();
    await this.get(true);
    this.getRead(true);
    /* @__PURE__ */ (() => {
    })("\u6536\u85CF\u5939\u5217\u8868: ", await this.get());
  }
  /**
   * 判断收藏夹是否已满
   */
  isFull(favoriteInfo) {
    if (this.readFavouriteTitle === "\u9ED8\u8BA4\u6536\u85CF\u5939") {
      return false;
    }
    return favoriteInfo.media_count >= 1e3;
  }
  /**
   * 将已满的收藏夹排序到最后
   *
   * 排序顺序:
   * [默认收藏夹, 最新创建的已看收藏夹, ...原来的其它收藏夹(按照原来的顺序), ...其它已看收藏夹(按编号从大到小排序)]
   */
  async sortOlderFavoritesToLast() {
    if (this.readFavouriteTitle === "\u9ED8\u8BA4\u6536\u85CF\u5939") {
      return;
    }
    const [_, ...oldReadFavouriteList] = this.readFavouriteList;
    const otherFavouriteList = this.favouriteList.filter((favoriteInfo) => {
      return favoriteInfo.title !== "\u9ED8\u8BA4\u6536\u85CF\u5939" && !favoriteInfo.title.match(new RegExp(`^${this.readFavouriteTitle}\\d*$`));
    });
    const sortedFavouriteList = [
      this.defaultFavourite,
      this.latestReadFavourite,
      ...otherFavouriteList,
      ...oldReadFavouriteList
    ].filter(Boolean);
    const favoriteIdList = this.favouriteList.map((favoriteInfo) => favoriteInfo.id);
    const sortedFavouriteIdList = sortedFavouriteList.map(
      (favoriteInfo) => favoriteInfo.id
    );
    if (isEqual(favoriteIdList, sortedFavouriteIdList)) {
      return;
    }
    await api_sortFavorites(sortedFavouriteIdList);
  }
}
const favourites = new Favourites();
const addVideoToFavorites = async () => {
  await favourites.init();
  let isFavorVideo = await api_isFavorVideo();
  if (showMessageStorage.get()) {
    await elementWaiter("body");
    Message({
      type: isFavorVideo ? "warning" : "success",
      message: isFavorVideo ? "\u5F53\u524D\u89C6\u9891\u5DF2\u6536\u85CF" : "\u89C6\u9891\u6536\u85CF\u6210\u529F",
      duration: 3e3,
      position: "top-left"
    });
  }
  const videoAvId = await getVideoAvId();
  if (isFavorVideo) {
    console.info("\u5F53\u524D\u89C6\u9891\u5DF2\u7ECF\u88AB\u6536\u85CF:", `av${videoAvId}`);
    return;
  }
  if (!favourites.getRead().length) {
    await favourites.createNew();
  }
  await favourites.addVideo(videoAvId);
  await sleep(1e3);
  isFavorVideo = await getVideoEpId() ? true : await api_isFavorVideo();
  const favButtonDom = await elementWaiter('[title="\u6536\u85CF\uFF08E\uFF09"]').catch(() => document.createElement("div"));
  if (!isFavorVideo) {
    favButtonDom.classList.remove("on");
    throw new Error("\u6536\u85CF\u5931\u8D25");
  }
  favButtonDom.classList.add("on");
};
const main = async () => {
  registerMenu();
  addVideoToFavorites().catch(console.error);
  freshListenerPushState(() => {
    addVideoToFavorites().catch(console.error);
  }, 5).catch(console.error);
};
main().catch((error) => {
  console.error(error);
});
