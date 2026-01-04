// ==UserScript==
// @name         直播插件
// @namespace    https://github.com/wuxin0011/tampermonkey-script/tree/main/live-plugin
// @version      4.1.23
// @author       wuxin0011
// @description  虎牙、斗鱼、哔哔哔里、抖音 页面美化！新增虎牙、斗鱼、哔哩哔哩的护眼主题🚀,ctrl+alt+j 查看菜单面板
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAArhJREFUWEfllz9ME1Ecx3+/dzUxIUpPxcTEqVD+LDjIoiTSwQldjHGDAwYpbYE4aOJQ8KBFTUx0KLSWoNIDoyFuGsMkcTBx0URjjFBQBmKiQ49ijInh3s/06iWlgfauh8Xoje++7/f5vN+73r0i7PCFO8yHDQI1QzG5HEIOgskPsm85w9IFMmBkQguBNlQOAQTWB4hryWB3V1YgFP++OOCtKAfcYLjD4xeJ8adYE4p5gINn8YpPb78oBehPihDQ0KoS1Vl65/MFnJJfNgLbLeJs6/UA457/S0CUfI3art0ra3dupbalA5UdfdXpRGTJ7PaIUmAWiMbUqehj2wJiR28zcLqPRD2p6ehsMQlR8n9GQTiZuhd5n8naEtjX1X+ctPVHquvgYefHrw8RUFGVsSdbSYjtgWV0sFYDbksgC+dB1XXgNMgy14tJ/hkidjs9NfosX8IpBeaZwM7kwksWyMK1F6qrSjDgBjAjwZhwMzUZeWmMiZL/NQpCWz48R6BlVYnqb9yi7wGxwx8GjkfV6qpT+fBcCQQKq0rsrS4kCPJm8JI6IEqBS6oydqPYw+aU/MOATAQNJ1anI2+2ytt6CAtKyLKj8tOXI+lE7FWh3G8B81tQbOVW7/8tAoW/BWJ7YM7qyqzkCel5wY+RlWJ2s5v+DK0U3dvZ7xZovUlNRB9YmWdkdYHaa3ddtP7zQnKgp99qkf2dvfWcQ5OqjE5bndswEj+kEZzVj2TuUPxbcsC7x2oRO3l3KP5D0HhD9kwYjp9DghnivDyHUsYuI+L5hWD3lK3/BfVXx2s5p2MLQW+i1G7YEqgbiTZqmtC6OOi9/u8LeOQ5xwpL1uWulDGtlnN2AgAncseJa7gk+96Z6YrpLagbnmjmqHk2gAArAOgwAsznjiNBemHQO7qtAmaKlZIx3YFSipuZ8wvlidcmZtmgQAAAAABJRU5ErkJggg==
// @source       https://github.com/wuxin0011/tampermonkey-script/tree/main/live-plugin
// @supportURL   https://github.com/wuxin0011/tampermonkey-script/issues
// @match        https://www.douyu.com/*
// @match        https://www.huya.com/*
// @match        https://*.douyin.com/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://game.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://t.bilibili.com/*
// @grant        GM.registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/449261/%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449261/%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const exculues = [
    "https://i.huya.com/",
    "https://www.douyu.com/member/",
    "https://yuba.douyu.com/",
    "https://www.bilibili.com/cheese",
    "https://www.bilibili.com/live"
  ];
  const prefix = "[live-plugin]:";
  const msg = (...args) => `${prefix} ${args}`;
  const emptyMethod = (...args) => {
    console.warn(`${prefix} run empty method...`);
  };
  const log = (...args) => console.log(msg(args));
  const warn = (...args) => console.warn(msg(args));
  const error = (...args) => console.error(msg(args));
  const douyu_address_pattern = /^https:\/\/www\.douyu\.((com)|(cn)).*/;
  const bilibili_address_pattern = /^https:\/\/(www|search|space|game|message|t)\.bilibili\..*/;
  const huya_address_pattern = /^https:\/\/www\.huya\.((com)|(cn)).*/;
  const douyin_address_pattern = /^https:\/\/.*\.douyin\.((com)|(cn)).*/;
  const localhost = /^http:\/\/127\.0\.0\.1\.*|^http:\/\/localhost.*/;
  const local_url = window.location.href;
  const is_huya = huya_address_pattern.test(local_url);
  const is_douyu = douyu_address_pattern.test(local_url);
  const is_bilibili = bilibili_address_pattern.test(local_url);
  const is_douyin = douyin_address_pattern.test(local_url);
  const is_localhost = localhost.test(local_url);
  const wd = window.document;
  const wls = window.localStorage;
  const download_plugin_url = "https://greasyfork.org//zh-CN/scripts/449261-%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD";
  const source_code_url = "https://github.com/wuxin0011/tampermonkey-script/tree/main/live-plugin";
  const isImage = (file) => /.*(\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp))$/.test(file);
  const querySelector = (el, sel) => !!el && !!sel && el instanceof HTMLElement ? el.querySelector(sel) : el ? wd.querySelector(el) : emptyMethod;
  const querySelectorAll = (el, sel) => !!el && !!sel && el instanceof HTMLElement ? el.querySelectorAll(sel) : el ? wd.querySelectorAll(el) : emptyMethod;
  const addEventListener = (el, type, callback) => !!el && type && typeof callback === "function" ? el === wd || el instanceof HTMLElement ? el.addEventListener(type, callback, false) : false : false;
  const createElement = (tag) => !!tag && wd.createElement(tag);
  const appendChild = (el1, el2) => !!el1 && !!el2 && el1 instanceof HTMLElement && el2 instanceof HTMLElement && el1.appendChild(el2);
  const insertChild = (el1, el2) => !!el1 && !!el2 && el1 instanceof HTMLElement && el2 instanceof HTMLElement && el1.insertBefore(el2, el1.firstChild);
  const is_exculues = exculues.filter((url) => local_url.indexOf(url) !== -1).length !== 0;
  const addStyle = (str) => {
    if (!isAutoPlugin()) {
      log("插件已关闭，样式不加载！");
      return;
    }
    if ((window == null ? void 0 : window.GM_addStyle) && typeof window.GM_addStyle == "function") {
      window.GM_addStyle(str);
    } else {
      let head = querySelector("head");
      let style = createElement("style");
      style.innerText = str;
      head.appendChild(style);
    }
  };
  const removeDOM = (element, realRemove = false) => {
    try {
      if (!(element instanceof HTMLElement)) {
        element = querySelector(element);
      }
      if (element instanceof HTMLElement) {
        if (realRemove) {
          element.remove();
        } else {
          element.style.display = "none";
        }
      }
    } catch (e) {
      error(e);
    }
  };
  const isArray = (a) => a && (a == null ? void 0 : a.length) > 0;
  const getLocalStore = (k, type = Array.name, isParse = true) => {
    let obj = wls.getItem(k);
    if (type === Array.name) {
      if (isParse && obj) {
        obj = JSON.parse(obj);
      }
      return Array.isArray(obj) ? obj : [];
    }
    if (type === Object.name) {
      if (isParse && obj) {
        obj = JSON.parse(obj);
      }
      return obj ? obj : {};
    }
    if (type === String.name) {
      return obj ? obj : "";
    }
    if (type === Boolean.name) {
      return obj === "true" || obj === true;
    }
    return obj;
  };
  const addLocalStore = (k, v = [], type = Array.name, isParse = true) => (type === Object.name || type === Array.name) && isParse ? wls.setItem(k, JSON.stringify(v)) : wls.setItem(k, v);
  const removeVideo = (selector, time1 = 1e3, maxCount = 10) => {
    let count = 0;
    let video_timer = setInterval(() => {
      try {
        const video2 = querySelector(selector);
        if (video2 && video2 instanceof HTMLVideoElement) {
          video2.pause();
        }
        removeDOM(video2, false);
        if (count >= maxCount) {
          clearInterval(video_timer);
        }
        count = count + 1;
      } catch (e) {
      }
    }, time1);
  };
  const throttle = (wait, func) => {
    let timerId = null;
    let lastArgs = null;
    const throttled = (...args) => {
      lastArgs = args;
      if (!timerId) {
        timerId = setTimeout(() => {
          func(...lastArgs);
          timerId = null;
          lastArgs = null;
        }, wait);
      }
    };
    throttled.cancel = () => {
      clearTimeout(timerId);
      timerId = null;
      lastArgs = null;
    };
    return throttled;
  };
  const intervalRemoveElement = (selectors, time = 160, maxCount = 1e3) => {
    if (!isArray(selectors)) {
      warn(`selectors 必须是数组 : ${selectors}`);
      return;
    }
    let count = 0;
    let timer = setInterval(() => {
      selectors.forEach((sel) => {
        removeDOM(sel, true);
      });
      if (count >= maxCount) {
        clearInterval(timer);
        return;
      }
      count = count + 1;
    }, time);
  };
  const loopDo = (callback, count = 100, wait = 100) => {
    if (typeof callback != "function") {
      warn("callback is a function!");
      return;
    }
    let timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
      } else {
        callback(timer);
      }
    }, wait);
  };
  const findMark = (selector, callback, count = 5, wait = 1e3) => {
    if (!selector) {
      warn("selector not allow  or null !");
      return;
    }
    if (typeof callback != "function") {
      warn("callback is a function!");
      return;
    }
    let selectors = [];
    if (!Array.isArray(selector)) {
      selectors.push(selector);
    } else {
      for (let sel of selector) {
        if (!sel)
          continue;
        selectors.push(sel);
      }
    }
    loopDo((timer) => {
      if (Array.isArray(selectors)) {
        for (let sel of selectors) {
          try {
            let element = sel instanceof HTMLElement ? sel : querySelector(sel);
            if (element && element instanceof HTMLElement) {
              if (!element.mark) {
                callback(element);
                element.mark = true;
                clearInterval(timer);
              } else {
                clearInterval(timer);
              }
            }
          } catch (e) {
            clearInterval(timer);
            error(e);
          }
        }
      }
    }, 100, 100);
    setTimeout(() => {
      let element = selector instanceof HTMLElement ? selector : querySelector(selector);
      if (element && element instanceof HTMLElement) {
        let isMark = element.getAttribute("mark");
        if (!isMark) {
          element.setAttribute("mark", true);
          callback(element);
        }
      }
    }, 5e3);
  };
  const backgroundNone = (element, selectors = [".layout-Main"], time = 100, maxCount = 500) => {
    if (!(element instanceof HTMLElement) || !isArray(selectors)) {
      warn(`element 参数应是 元素， selector 应该是元素选择器集合`);
      return;
    }
    let count = 0;
    let timer = setInterval(() => {
      selectors.forEach((sel) => {
        let b = querySelector(element, sel);
        if (!(b instanceof HTMLElement)) {
          return;
        }
        b.style.backgroundImage = "none";
      });
      if (count >= maxCount) {
        clearInterval(timer);
        return;
      }
      count = count + 1;
    }, time);
  };
  const uploadImage = (file, callback) => {
    try {
      if (!isImage(file == null ? void 0 : file.name)) {
        return alert("图片格式不正确！");
      }
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onerror = (e) => {
        return alert("图片解析失败！" + JSON.stringify(e));
      };
      fileReader.onload = (e) => {
        let base64 = e.target.result;
        let str = base64.slice(base64.indexOf(",") + 1);
        if (atob) {
          str = atob(str);
          let bytes = str.length;
          const size = (bytes / (1024 * 1024)).toFixed(2);
          if (size > 5) {
            if (confirm("图片保存失败，浏览器最大只能保存5MB大小图片，确认查看原因？")) {
              window.location.href = "https://developer.mozilla.org/zh-CN/docs/Web/API/File_and_Directory_Entries_API/Introduction";
            }
            return;
          }
          callback(base64);
        } else {
          alert("保存失败，当前浏览器不支持！");
        }
      };
    } catch (e) {
      alert("图片解析失败！");
    }
  };
  const findButton = (sel = "body", key = "full_screen_button_class_or_id", text = "全屏", tagName = "div") => {
    var _a, _b;
    const container = querySelector(sel);
    let classId = "";
    if (container) {
      const fullButton = querySelector(container, key);
      if (fullButton && fullButton instanceof HTMLElement && ((fullButton == null ? void 0 : fullButton.textContent) === text || (fullButton == null ? void 0 : fullButton.title) === text)) {
        classId = `${sel} ${fullButton.id ? fullButton.id : fullButton.className}`;
      }
      if (!classId) {
        const nodes = querySelectorAll(container, tagName);
        if (isArray(nodes)) {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] && nodes[i] instanceof HTMLElement && (((_a = nodes[i]) == null ? void 0 : _a.title) === text || ((_b = nodes[i]) == null ? void 0 : _b.textContent) === text)) {
              classId = `${sel} ${nodes[i].id ? nodes[i].id : nodes[i].className}`;
            }
          }
        }
      }
    }
    if (key && classId) {
      addLocalStore(key, classId, String.name, false);
    }
    return classId || key;
  };
  const addFullScreenEvent = (callback) => {
    if (typeof callback != "function") {
      return;
    }
    document.addEventListener("fullscreenchange", callback);
    document.addEventListener("webkitfullscreenchange", callback);
    document.addEventListener("mozfullscreenchange", callback);
    document.addEventListener("MSFullscreenChange", callback);
  };
  const handlerPromise = (result, callback) => {
    if (typeof callback !== "function") {
      warn("回调函数不能为空！");
      return;
    }
    if (!result) {
      warn("请求结果为空！");
      callback(result);
      return;
    }
    if (result instanceof Promise) {
      result.then((res) => {
        callback(res);
      }).catch((e) => {
        error(e);
      });
    } else {
      callback(result);
    }
  };
  const handlerDisplay = (element, isBlock) => {
    if (!(element && element instanceof HTMLElement)) {
      return;
    }
    if (isBlock) {
      if (!element.classList.contains("m-container-display-block")) {
        element.classList.add("m-container-display-block");
      }
      if (element.classList.contains("m-container-display-none")) {
        element.classList.remove("m-container-display-none");
      }
    } else {
      if (element.classList.contains("m-container-display-block")) {
        element.classList.remove("m-container-display-block");
      }
      if (!element.classList.contains("m-container-display-none")) {
        element.classList.add("m-container-display-none");
      }
    }
  };
  const support = {
    supportSearch() {
      return !is_douyin;
    },
    supportAdd() {
      return !is_douyin;
    },
    supportReset() {
      return !is_douyin;
    },
    supportBg() {
      if (is_bilibili) {
        let T = "https://www.bilibili.com";
        if ([`${T}`].find((url) => url == local_url)) {
          return true;
        }
        let S = [`${T}/video`].find((url) => {
          return local_url.indexOf(url) != -1;
        });
        return !!S;
      }
      return !is_douyin;
    },
    supportMenu() {
      return !is_douyin && !is_bilibili;
    },
    supportGift() {
      return !is_douyin && !is_bilibili;
    },
    supportAutoFullScreen() {
      return true;
    },
    supportAutoViewMaxPro() {
      return true;
    },
    supportTable() {
      return !is_douyin;
    },
    supportTheme() {
      return !is_douyin;
    }
  };
  class HostUser {
    constructor(roomId, name) {
      this.roomId = roomId;
      this.name = name;
    }
  }
  const isShowFansIconKey = "__isShowFansIconKey__";
  const isShowGiftRankKey = "__isShowGiftRankKey__";
  const isShowSysMsgKey = "__isShowSysMsgKey__";
  const isShowColorDmKey = "__isShowColorDm__";
  const isShowHotSearchKey = "__is_show_hot_search_key__";
  const isShowHotSearchInputKey = "__is_show_hot_search_input_key__";
  const isAutoPluginkey = "__is_auto_plugins__";
  const isShowPkKey = "__is_show_pk_key__";
  const isMainRoom = "__isMainRoom__";
  const isShowMatchContentKey = "__isShowMatchContentKey__";
  const isShowBg = () => is_bilibili ? getLocalStore("bg_show_key", Boolean.name) : wls.getItem("bg_is_first_key") === null ? true : getLocalStore("bg_show_key", Boolean.name);
  const isShowFansIcon = () => getLocalStore(isShowFansIconKey, Boolean.name);
  const isShowGiftRank = () => getLocalStore(isShowGiftRankKey, Boolean.name);
  const isShowMatchContent = () => getLocalStore(isShowMatchContentKey, Boolean.name);
  const isShowSysMsg = () => getLocalStore(isShowSysMsgKey, Boolean.name);
  const isShowColorDm = () => getLocalStore(isShowColorDmKey, Boolean.name);
  const isShowMainRoom = () => getLocalStore(isMainRoom, Boolean.name);
  const isShowHotSearch = () => wls.getItem(isShowHotSearchKey) != "false";
  const isShowHotSearchInputKeyword = () => wls.getItem(isShowHotSearchInputKey) != "false";
  const isAutoPlugin = () => wls.getItem(isAutoPluginkey) != "false";
  const isShowPk = () => wls.getItem(isAutoPluginkey) == "true";
  const isRisk = (obj) => obj ? JSON.stringify(obj).indexOf("非法访问") !== -1 : false;
  const isBVId = (keywords) => /.*\/BV(.*)/.test(keywords);
  const getBVId = (url) => {
    try {
      let videoBVId = "BV";
      if (/.*\/BV(.*)/.test(url)) {
        videoBVId += /.*\/BV(.*)\/.*/.test(url) ? url.match(/.*\/BV(.*)/)[1].match(/(.*)\/{1}.*/)[1] : url.match(/.*\/BV(.*)/)[1];
      }
      return videoBVId;
    } catch (error2) {
      warn("通过房间号获取up信息失败！，请检查是否 https://www.bilibili.com/video/xxxxxxx 空间地址...");
      return null;
    }
  };
  const isUserId = (keywords) => /https:\/\/space\.bilibili\.com\/\d+.*/.test(keywords) || /\d+/.test(keywords);
  const getUserId = (keywords) => {
    let isMatch = keywords.match(/https:\/\/space\.bilibili\.com.*\/(\d+).*/);
    if (isMatch) {
      try {
        return isMatch[1];
      } catch (error2) {
        warn("通过房间号获取up信息失败！，请检查是否 https://space.bilibili.com 空间地址...");
        return null;
      }
    }
    return keywords;
  };
  const getBiliBiliInfoByVideoID = async (url = window.location.href) => {
    if (!url) {
      return null;
    }
    let videoBVId = null;
    if (isBVId(url)) {
      videoBVId = getBVId(url);
    } else {
      videoBVId = url;
    }
    if (!videoBVId) {
      return null;
    }
    return await fetch(`https://api.bilibili.com/x/web-interface/wbi/view?bvid=${videoBVId}`, {
      method: "get",
      mode: "cors"
    }).then((res) => res.json());
  };
  const getBiliBiliInfoByUserId = async (userId) => {
    if (!isUserId(userId)) {
      return null;
    }
    userId = getUserId(userId);
    if (!userId) {
      return null;
    }
    log("user Id", userId);
    return await fetch(`https://api.bilibili.com/x/space/wbi/acc/info?mid=${userId}`, {
      method: "get",
      mode: "cors"
    }).then((res) => res.json());
  };
  const douyu = [
    "body",
    ".wm-general-bgblur",
    ".layout-Module-container",
    ".layout-Cover-list"
  ];
  const huya = [
    "body",
    ".js-responded-list",
    " #J_mainWrap",
    "#main_col",
    ".layout-Module-container"
  ];
  const bilibili = [
    "body",
    "#app",
    "#bili-header-banner-img"
  ];
  const darkImageCss = () => {
    let st = null;
    if (is_huya) {
      st = huya;
    } else if (is_douyu) {
      st = douyu;
    } else if (is_bilibili) {
      st = bilibili;
    } else {
      return [];
    }
    return [.../* @__PURE__ */ new Set([...st])];
  };
  const cssUpdate = () => {
    if (is_bilibili) {
      const imgElement = querySelector(".bili-header__banner .v-img img");
      if (imgElement) {
        console.log("run update");
        imgElement.style.display = isShowBg() ? "" : isNeedDark() ? "none" : "block";
      }
    }
    darkImageCss().forEach((selector) => {
      const ele = querySelector(selector);
      if (ele) {
        ele.style.backgroundColor = isShowBg() ? "" : isNeedDark() ? "var(--w-bg-darker)" : "";
      }
    });
  };
  const DARK_THEME_KEY = "wx_dark_theme_key";
  const THEME_IS_AUTO = "wx_dark_theme_is_auto";
  const THEME_TYPE_KEY = "wx_dark_theme_type_key";
  const DARK_COLOR_VARIABLE = "--w-bg-darker";
  const theme = {
    light: "light",
    dark: "dark"
  };
  const DARK_THEME_TYPE = {
    "DEFAULT": "DEFAULT",
    "ORDINARY": "ORDINARY",
    "BLACK0": "BLACK0",
    "BLACK1": "BLACK1",
    "BLACK2": "BLACK2",
    "BLACK3": "BLACK3"
  };
  const DARK_TYPE = {
    [DARK_THEME_TYPE.DEFAULT]: {
      "name": "默认",
      "color": "#343b44"
    },
    [DARK_THEME_TYPE.ORDINARY]: {
      "name": "普通",
      "color": "#37404c"
    },
    [DARK_THEME_TYPE.BLACK0]: {
      "name": "深黑1",
      "color": "#22272e"
    },
    [DARK_THEME_TYPE.BLACK1]: {
      "name": "深黑2",
      "color": "#232222"
    },
    [DARK_THEME_TYPE.BLACK2]: {
      "name": "深黑3",
      "color": "#171514"
    },
    [DARK_THEME_TYPE.BLACK3]: {
      "name": "深黑4",
      "color": "#121212"
    }
  };
  const isDark = () => wls.getItem(DARK_THEME_KEY) === theme.dark;
  const isAutoDark = () => wls.getItem(THEME_IS_AUTO) === THEME_IS_AUTO || wls.getItem(THEME_IS_AUTO) === null;
  const LOCAL_THEME_TYPE = wls.getItem(THEME_TYPE_KEY) === null ? DARK_THEME_TYPE.DEFAULT : wls.getItem(THEME_TYPE_KEY);
  const darkColor = () => {
    let type = wls.getItem(THEME_TYPE_KEY) === null ? DARK_THEME_TYPE.DEFAULT : wls.getItem(THEME_TYPE_KEY);
    let l1 = DARK_TYPE[type];
    return (l1 == null ? void 0 : l1.color) ?? "#121212";
  };
  const updateStyleColor = (key, value) => document.documentElement.style.setProperty(key, value);
  const updateDarkStyleType = (type) => {
    wls.setItem(THEME_TYPE_KEY, type);
    updateDarkClass();
  };
  const toggleColorMode = (event, isClick = false) => {
    if (!event) {
      return;
    }
    try {
      const isAppearanceTransition = (document == null ? void 0 : document.startViewTransition) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!isAppearanceTransition) {
        log("不支持快照切换...,将使用普通方式切换主题");
        isClick ? clickUpdateTheme() : updateDarkClass();
        return;
      }
    } catch (error2) {
      isClick ? clickUpdateTheme() : updateDarkClass();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );
    const transition = document.startViewTransition(() => {
      isClick ? clickUpdateTheme() : updateDarkClass();
    });
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        {
          clipPath: isNeedDark() ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: "ease-out",
          pseudoElement: isNeedDark() ? "::view-transition-old(root)" : "::view-transition-new(root)"
        }
      );
    });
  };
  const clickUpdateTheme = () => {
    const classList = document.documentElement.classList;
    if (!classList.contains("dark")) {
      classList.add("dark");
      wls.setItem(DARK_THEME_KEY, theme.dark);
    } else if (classList.contains("dark")) {
      classList.remove("dark");
      wls.setItem(DARK_THEME_KEY, theme.light);
    }
    cssUpdate();
  };
  const autoDarkType = () => {
    let hour = (/* @__PURE__ */ new Date()).getHours();
    let type = DARK_THEME_TYPE.DEFAULT;
    if (isAutoDark()) {
      if (hour >= 0 && hour <= 7) {
        type = DARK_THEME_TYPE.BLACK3;
      } else if (hour > 7 && hour <= 17)
        ;
      else if (hour > 17 && hour < 18) {
        type = DARK_THEME_TYPE.ORDINARY;
      } else if (hour >= 18 && hour < 19) {
        type = DARK_THEME_TYPE.BLACK0;
      } else if (hour >= 19 && hour < 20) {
        type = DARK_THEME_TYPE.BLACK1;
      } else if (hour >= 21 && hour < 22) {
        type = DARK_THEME_TYPE.BLACK2;
      } else if (hour >= 22 && hour <= 23) {
        type = DARK_THEME_TYPE.BLACK3;
      }
    }
    return type;
  };
  const autoDarkColor = () => {
    let color = "";
    if (isAutoDark()) {
      let type = autoDarkType();
      color = DARK_TYPE[type].color;
    } else {
      color = darkColor();
    }
    return color;
  };
  const isNeedDark = () => ((/* @__PURE__ */ new Date()).getHours() < 7 || (/* @__PURE__ */ new Date()).getHours() >= 17) && isAutoDark() || isDark();
  const updateDarkClass = () => {
    if (!support.supportTheme()) {
      return;
    }
    if (isNeedDark()) {
      updateStyleColor(DARK_COLOR_VARIABLE, autoDarkColor());
    }
    const classList = document.documentElement.classList;
    if (!classList.contains("dark") && isNeedDark()) {
      classList.add("dark");
    } else if (classList.contains("dark") && !isNeedDark()) {
      classList.remove("dark");
    }
    cssUpdate();
  };
  const themeOptions = () => {
    let str = "";
    let local_theme = LOCAL_THEME_TYPE;
    for (let [k, v] of Object.entries(DARK_TYPE)) {
      str += `<option value="${k}" ${local_theme == k ? "selected " : ""} class="m-select-option">${v.name}</option>`;
    }
    return str;
  };
  const root$1 = `
html {
  --w-brand: #3aa675;
  --w-light: #e5e7eb;
  --w-brand-light: #349469;
  --w-bg: #22272e;
  --w-bg-light: #2b313a;
  --w-bg-lighter: #262c34;
  --w-bg-dark: #343b44;
  --w-bg-darker: #37404c;
  --w-bg-darker: var(--w-bg-dark);
  --w-text: #adbac7;
  --w-text-light: #cbd4dc;
  --w-text-lighter: #cdd6dd;
  --w-text-lightest: #8094a8;
  --w-border: #3e4c5a;
  --w-border-dark: #34404c;
  --w-blue-link-hover:#00aeec;
  --w-skeleton:#494f57;
  --w-white: #fff;
}



.dark html {
  --bili-comment-tag-bg-light:var(--w-bg-dark);
}


::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 10;
}
::view-transition-new(root) {
  z-index: 10000;
}
.dark::view-transition-old(root) {
  z-index: 10000;
}
.dark::view-transition-new(root) {
  z-index: 10;
}


.m-container-display-block{
  display:block !important ;
}
.m-container-display-none{
  display:none  !important ;
}




::-webkit-scrollbar {
  width: 6px !important;
  background-color: teal !important;
}

::-webkit-scrollbar-track {
  background-color: #eee !important;
}

::-webkit-scrollbar-thumb {
  background-color: var(--w-blue-link-hover) !important;
  border-radius: 6px !important;
}


.dark ::-webkit-scrollbar {
  width: 6px !important;
  background-color: teal !important;
}

.dark ::-webkit-scrollbar-track {
  background-color: var(--w-text) !important;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: var(--w-bg-light) !important;
  border-radius: 6px !important;
}



`;
  const liveDarkCss = `

${root$1}


  .dark.m-container {
    --m-container-background-color: var(--w-bg-darker);
  }
  

  .dark .m-select-dark-option,
  .dark .m-select-dark,.dark .m-dark-type-select,
  .dark.m-container {
    background-color: var(--m-container-background-color) ;
    color:var(--w-text-light) ;
  }


  .dark.m-container .m-link,
  .dark.m-container .m-link:visited {
    color: var(--w-text) ;
  }
  


  .dark.m-container table tr,
  .dark.m-container table tbody tr:nth-child(1) 
   {
    border-color: var(--w-text-light) ;
   }





`;
  const css$5 = `
${root$1}
.m-container,
  .m-container .btn,
  .m-container table,
  .m-container table tbody,
  .m-container table thead,
  .m-container table tr {
    margin: 0 ;
    padding: 0 ;
    border: none;
    outline: none;
  }
  
  .m-container {
    --m-font-color: #fff;
    --m-container-background-color: #fff;
    --m-container-width: 800px;
    --m-container-height: 400px;
    --m-container-operation-right-width: 150px;
    --m-container-input-width: ${is_bilibili ? "150px" : "100px"};
    --m-container-box-transition: all 0.5s ease-in-out;
    --m-container-select-width: var(--m-container-input-width);
    --m-container-input-outline: 1px solid rgba(8, 125, 235, 0.6) ;
  }
  
  .m-container {
    box-sizing: border-box ;
    position: fixed ;
    flex-direction: column ;
    width: var(--m-container-width) ;
    height: var(--m-container-height) ;
    top: 100px ;
    left: 50% ;
    border-radius: 10px ;
    overflow: hidden ;
    font-size:14px;
    background-color: var(--m-container-background-color) ;
    z-index: ${is_douyin ? "10" : "100000000"} ;
    padding: 15px ;
    transition: var(--m-container-box-transition) ;
    box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1),
      -1px -2px 18px rgba(0, 0, 0, 0.1) ;
  
    opacity: 0;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    transform: translate(-50%, -150%);
  }
  
  .m-container-is-active {
    opacity: 1;
    transform: translate(-50%, 0%);
    z-index:100000000 ;
  }
  
  .m-container-box {
    display: flex ;
    flex-direction: column ;
    width: 100% ;
    height: 100% ;
  }
  
  .m-container .operation {
    box-sizing: border-box ;
    height: auto ;
    justify-content: start ;
  }
  
  
  .m-container input[type="text"] {
    width: var(--m-container-input-width) ;
    box-sizing: border-box ;
    border: 1px solid rgba(8, 125, 235, 0.6) ;
    outline: none ;
    padding: 5px 10px ;
    border-radius: 20px ;
    transition: var(--m-container-box-transition);
  }
  
  .m-container input:focus {
    border: 1px solid rgba(8, 125, 235, 1) ;
  }
  
  .m-container .operation input[type="checkbox"] {
    display: inline ;
  }
  
  .m-container .operation input[type="file"] {
    display: none ;
  }
  
  .m-container table {
    position: relative ;
    box-sizing: border-box ;
    overflow: hidden ;
    text-align: left ;
    flex: 1 ;
    display: flex ;
    flex-direction: column ;
  }
  
  .m-container table tr {
    margin: 5px 0 ;
    display: flex ;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4) ;
    justify-content: space-between;
  }
  
  .m-container table tr td:nth-child(1),
  .m-container table thead th:nth-child(1) {
    width: 50px;
    text-align: center ;
  }
  
  .m-container table tr td:nth-child(2),
  .m-container table tr td:nth-child(3),
  .m-container table tr td:nth-child(4),
  .m-container table thead th:nth-child(2),
  .m-container table thead th:nth-child(3),
  .m-container table thead th:nth-child(4) {
    flex: 1 ;
    text-align: center ;
    white-space: nowrap ;
    overflow: hidden ;
    text-overflow: ellipsis ;
  }
  
  .m-container table tbody {
    flex: 1 ;
    overflow: auto ;
  }
  
  .m-container table th,
  .m-container table td {
    padding: 10px ;
    font-size:14px;
  }
  
  .m-container table tbody tr:nth-child(1) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.4) ;
  }
  
  .m-container .m-link,
  .m-container .m-link:visited {
    color: teal ;
  }
  
  .m-container .m-link:hover {
    color: blue ;
    text-decoration: underline ;
  }
  
  .m-container .btn {
    cursor: pointer ;
    padding: 5px 8px ;
    border: none ;
    max-width:50px ;
    color: var(--m-font-color) ;
    font-size: 12px ;
    border-radius: 20px ;
    margin: 0 ;
    background-color: rgba(166, 169, 173, 1) ;
    z-index: 1000 ;
    outline: none ;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4), 0px 0px 1px rgba(0, 0, 0, 0.4) ;
  }
  
  .m-container .btn:hover {
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1) ;
  }
  
  .m-container .btn:hover {
    background-color: rgba(166, 169, 173, 0.6) ;
  }
  
  .m-container .btn-primary {
    background-color: rgba(64, 158, 255, 1) ;
  }
  
  .m-container .btn-primary:hover {
    background-color: rgba(64, 158, 255, 0.6) ;
  }
  
  .m-container .btn-success {
    background-color: rgba(103, 194, 58, 1) ;
  }
  
  .m-container .btn-success:hover {
    background-color: rgba(103, 194, 58, 0.6) ;
  }
  
  .m-container .btn-info {
    background-color: rgba(119, 119, 119, 1) ;
  }
  
  .m-container .btn-info:hover {
    background-color: rgba(119, 119, 119, 0.6) ;
  }
  
  .m-container .btn-warning {
    background-color: rgba(230, 162, 60, 1) ;
  }
  
  .m-container .btn-warning:hover {
    background-color: rgba(230, 162, 60, 0.6) ;
  }
  
  .m-container .btn-danger {
    background-color: rgba(245, 108, 108, 1) ;
  }
  
  .m-container .btn-danger:hover {
    background-color: rgba(245, 108, 108, 0.6) ;
  }
  
  #m-container-box1 {
    position: absolute ;
    z-index: 10000000 ;
    transition: var(--m-container-box-transition) ;
    width: 100% ;
    height: 100% ;
  }
  
  #m-container-box2 {
    position: absolute ;
    z-index: 9999 ;
    transition: var(--m-container-box-transition) ;
    width: 100% ;
    height: 100% ;
  }
  
  .m-ani-left-is-active {
    transform: translateX(0) ;
    visibility: visible ;
    opacity: 1 ;
  }
  
  .m-ani-left-is-close {
    transform: translateX(-100%) ;
    visibility: hidden ;
    opacity: 0 ;
  }
  
  .m-ani-right-is-active {
    transform: translateX(0) ;
    visibility: visible ;
    opacity: 1 ;
  }
  
  .m-ani-right-is-close {
    transform: translateX(100%) ;
    visibility: hidden ;
    opacity: 0 ;
  }
  
  .m-type-container .m-type-item {
    display: flex ;
    height: 30px ;
  }
  
  .m-type-container .m-type-item .m-type-item-left {
    flex: 1 ;
    position: relative ;
    box-sizing: border-box ;
    overflow: hidden ;
  }
  
  .m-type-container .m-type-item .m-type-item-right {
    width: var(--m-container-operation-right-width);
    text-align: center ;
  }
  
  .m-type-container .m-type-item .m-type-item-left .m-select-option-container,
  .m-type-container .m-type-item .m-type-item-left .m-select-input-container {
    transition: var(--m-container-box-transition) ;
    position: absolute ;
    width: 100% ;
  }
  
  .m-type-container .m-select {
    display: flex ;
  }
  
  .m-type-container .m-select .m-select-item {
    margin-right: 10px ;
  }
  
  .m-type-container .m-select .m-select-item:last-child {
    margin-right: 0 ;
  }
  
  .m-type-container .m-select select {
    width: 100px ;
    color: rgba(119, 119, 119, 0.9) ;
  }
  
  .m-type-container .m-select select::placeholder {
    color: rgba(119, 119, 119, 0.9) ;
  }
  
  .m-type-container .m-tag-select {
    width: calc(var(--m-container-select-width)/2) ;
    outline: none ;
    border: 1px solid rgba(8, 125, 235, 0.6) ;
    padding: 5px 8px ;
    padding: 5px 10px ;
  }
  
  .m-container select {
    border: 1px solid rgba(8, 125, 235, 1) ;
  }
  
  
  .m-type-container .m-select .m-option-default {
    color: rgba(119, 119, 119, 0.6) ;
  }
  
  .m-type-container input[type="text"] {
    width: 350px ;
  }
  
  .m-type-container .m-select input {
    width: var(--m-container-input-width) ;
  }
  
  .m-type-container .m-search-msg {
    color: red ;
  }
  

  .m-container-display-block{
     display:block !important;
  }
  .m-container-display-none{
     display:none !important;
  }

  .m-container .m-link:hover {
    color: var(--w-text-light) ;
    text-decoration: underline ;
  }
  
  


  ${liveDarkCss}

`;
  const htmlTemplate = (isShowBg2, isShowMenu, isShowFullScreen, isShowGift, isShowLogo, isMaxPro = true) => {
    return `
    <div class="m-container-box" id="m-container-box2">
        <div class="operation">
            ${support.supportSearch() ? `<input type="text" placeholder="房间号或者名称...">` : ``}
            ${support.supportAdd() ? `<button class="btn btn-primary add-room" title="复制地址栏房间号，手动添加房间,也可以通过点击房间名称添加">添加</button>` : ``}
            ${support.supportReset() ? `<button class="btn btn-success clear-room" title="重置表格数据">重置</button>` : ``}
            ${support.supportTheme() ? `<button class="btn btn-info room-theme" title="${isNeedDark() ? "点击切换到白天模式" : "点击切换到黑夜模式"}">${isNeedDark() ? "白天" : "黑夜"}</button>` : ``}
            ${support.supportBg() ? `<button class="btn btn-warning bg-btn" title="上传背景图">背景</button>` : ``}
            ${support.supportBg() ? `<input type="file" id="file">` : ``}
            ${support.supportBg() ? `<input type="checkbox" id="checkbox1" ${isShowBg2 ? "checked" : ""} class="checkbox" title="是否显示背景" />背景` : ``}
            ${support.supportMenu() ? `<input type="checkbox" id="checkbox2" ${isShowMenu ? "checked" : ""} class="checkbox" title="是否显示左侧菜单"/>菜单 ` : ``}
            ${` <input type="checkbox" id="checkbox3" ${isShowFullScreen ? "checked" : ""} class="checkbox" title="自动全屏"/>全屏`}
            ${support.supportGift() ? `<input type="checkbox" id="checkbox4" ${isShowGift ? "checked" : ""} class="checkbox" title="显示礼物栏"/>礼物` : ``}
            <input type="checkbox" id="checkbox5" ${isShowLogo ? "checked" : ""} class="checkbox" title="关闭或者显示插件Logo. ctrl+alt+j 可唤醒"/>logo
            ${`<input type="checkbox" id="checkbox6" ${isMaxPro ? "checked" : ""} class="checkbox" title="自动最高画质"/>画质`}
            ${support.supportTheme() ? `<input type="checkbox" id="m-dark-is-auto" ${isAutoDark() ? "checked" : ""} class="checkbox" title="自动调整主题,根据时间段改变"/>自动` : ``}
            ${support.supportTheme() ? `<select class="m-dark-type-select" id="m-dark-select">
                                            ${themeOptions()}
                                        </select>` : ``}
            <a class="m-link" href="https://greasyfork.org//zh-CN/scripts/449261-%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD" target="_blank" title="更新、反馈">更新</a>
            <button class="btn btn-info btn-close-container" title="关闭 , ctrl+alt+j 可唤醒" >关闭</button>
        </div>
        <table class="${support.supportTable() ? "" : "m-container-display-none"}">
            <thead>
                <th>序号</th>
                <th>名称</th>
                <th>房间号</th>
                <th>操作</th>
            </thead>
            <tbody>
            </tbody>
        </table>
        </div>
`;
  };
  class LivePluginElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.innerHTML = css$5;
      this.shadowRoot.appendChild(style);
    }
    createContainer(isShowBg2, isShowMenu, isShowFullScreen, isShowGift, isShowLogo, isMaxPro = true) {
      const livePlugin = document.createElement("live-plugin-element");
      const container = document.createElement("div");
      container.className = `${isNeedDark() ? "dark" : ""} m-container`;
      container.innerHTML = htmlTemplate(isShowBg2, isShowMenu, isShowFullScreen, isShowGift, isShowLogo, isMaxPro);
      livePlugin.shadowRoot.appendChild(container);
      document.querySelector("body").append(livePlugin);
      return container;
    }
  }
  const iconLogo = () => {
    let logo = "none";
    if (is_douyu) {
      logo = `<svg t="1694231763777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5947" width="40" height="40"><path d="M838.45600394 295.68265482c63.56182914-60.97275259 162.72346075-74.95376592 162.72346075-74.95376593s-6.08432987-74.95376592-101.10343901-106.41104592c-136.57378765-43.49648592-212.17482272 19.41807408-212.17482272 19.41807406S517.15160494 3.24645925 346.53146074 92.18123852s-291.27111111 332.04906667-291.27111111 332.04906666c65.63309037 81.03809581 234.31142717 82.9799032 234.31142717 81.68536495-20.0653432 4.66033778-51.5226232 28.73874963-49.58081582 28.73874962-71.58796642-20.71261235-236.25323457 74.95376592-210.88028445 141.88139456 26.14967309 66.92762864 257.74256987 49.58081581 257.74256989 49.58081582s47.50955457 35.47034864 37.54160988 35.47034863c-124.53458173-10.09739852-144.59992494 55.53569185-144.59992494 57.60695309 31.45728 0 222.27222124 51.5226232 222.27222122 51.52262321s31.45728 135.92651852 61.62002173 137.86832592c29.51547259 2.07126124 55.53569185-49.58081581 55.53569185-51.5226232 37.54160987-37.54160987 27.44421136-116.50844445 24.07841186-120.52151309 18.12353581-10.09739852 101.10343902-35.47034864 245.70336395-187.44914172s55.40623803-349.3958795 49.45136197-353.40894815z m-805.97952789 371.53248394c0-81.03809581 186.15460347-140.5868563 186.80187259-124.53458173-24.07841185 56.95968395 0 96.44310124 0 96.44310124l-37.54160988 33.52854123 51.52262321 2.07126125s29.51547259 41.55467852 31.45728 43.49648592c-131.91344987 11.9097521-228.87436642-14.23992098-232.24016592-51.00480791zM223.29141728 653.10467161v8.67340642h-8.02613728l8.02613728-8.67340642z m204.14868544 121.16878222c-2.07126124 6.08432987-20.71261235 12.03920592-20.71261236 12.03920592l-4.01306864-12.03920592c-0.12945383 0 26.66748839-5.30760691 24.725681 0z" fill="#999999" p-id="5948"></path><path d="M361.80701235 124.28578765c-48.80409283 0-88.41696395 36.76488691-88.41696396 82.97990321s39.48341728 82.9799032 88.41696396 82.97990322 88.41696395-36.76488691 88.41696395-82.97990322-39.61287111-82.9799032-88.41696395-82.97990321z m0 141.88139457c-11.3919368 0-23.43114272-3.3657995-32.75181827-10.09739852 11.3919368 0 20.71261235-9.32067555 20.71261234-20.71261234s-9.32067555-20.71261235-20.71261234-20.71261234c-10.74466765 0-19.41807408 8.02613728-20.71261236 18.1235358-4.01306864-8.02613728-6.08432987-16.6995437-6.08432987-26.14967309 0-32.75181827 26.79694222-58.90149136 59.5487605-58.90149136h5.3076069c-11.3919368 6.08432987-19.41807408 18.12353581-19.41807407 32.10454913 0 20.0653432 16.6995437 36.76488691 36.76488691 36.76488692 16.05227457 0 30.16274173-10.09739852 34.82307951-24.72568099 1.29453827 4.66033778 2.07126124 10.09739852 2.07126123 14.7577363 0 33.52854124-26.79694222 59.5487605-59.54876048 59.54876049z m-22.13660445 204.14868543s27.44421136 18.12353581 75.60103506 0l-18.1235358-25.37295012c0.12945383 0-57.47749925 25.37295013-57.47749926 25.37295012z m115.21390618-62.91456c-14.11046717 14.11046717-49.58081581 31.45728-49.58081581 31.45728s51.5226232 29.51547259 63.56182914 21.35988149c12.03920592-7.24941431-9.96794469-50.74590025-13.98101333-52.81716149z m43.49648592-33.3990874c-12.03920592 11.3919368-37.54160987 29.51547259-37.54160987 29.51547258l47.50955456 35.47034865c10.09739852-12.16865975-1.94180741-64.98582124-9.96794469-64.98582123z m22.00715061-31.45728c-2.07126124 9.32067555-13.33374419 23.43114272-17.34681283 26.14967308 10.74466765 5.30760691 28.73874963 24.72568098 28.73874963 24.72568098 11.3919368-16.05227457-3.23634569-48.1568237-11.3919368-50.87535406z" fill="#FFFFFF" p-id="5949"></path><path d="M777.48325136 240.7942321c8.02613728-2.07126124 53.59388445 45.56774717 47.50955456 47.50955457 77.6722963-85.05116445 146.54173235-82.9799032 146.54173235-85.05116445-20.0653432-51.5226232-113.14264494-74.95376592-113.14264494-74.95376592-140.5868563-25.37295013-158.7103921 37.54160987-162.72346075 39.48341728-162.72346075-118.45025185-317.29133037-47.50955457-315.34952295-49.5808158 105.11650765 23.43114272 75.60103506 108.48230717 75.60103506 108.48230716s-14.11046717 85.05116445-111.07138371 73.01195853c-97.09037037-12.03920592-81.03809581-120.52151309-81.0380958-120.5215131-97.7376395 78.96683457-186.80187259 241.04302617-186.8018726 241.04302616 10.09739852 16.05227457 119.09752098 53.59388445 154.56786964 55.53569186 210.23301531-4.01306864 325.31746765-217.61188347 329.33053629-217.61188345 44.79102419 73.01195852 33.52854124 148.61299358-12.03920593 187.44914173-48.54518518 41.55467852-186.41351111 44.14375506-186.4135111 44.14375506 20.0653432 52.16989235 161.29946864 30.81001086 161.29946865 30.81001086C519.09341235 592.13191902 360.38302024 615.56306173 354.42814419 615.56306173 519.09341235 688.57502025 655.6672 539.96202667 657.60900741 537.89076543c-9.32067555 71.58796642-112.49537581 117.15571358-114.43718322 117.15571359 12.03920592 56.95968395-99.03217778 153.9206005-140.58685629 145.8944632-101.10343902-43.49648592-170.74959803 2.07126124-170.74959804 2.07126125l93.07730174 25.37295011s97.09037037 10.09739852 101.10343901 49.58081581 37.54160987 86.99297185 41.55467853 86.99297185c97.09037037-70.94069728 47.50955457-133.85525728 47.50955456-133.85525729s184.73061136-73.01195852 287.9053116-271.07631408-33.52854124-317.29133037-25.50240394-319.23313777zM730.62096592 181.89274075c-31.45728-8.02613728-7.37886815-24.07841185 18.1235358-37.54160989 86.99297185-28.73874963 129.84218864 6.73159902 127.90038124 6.73159901-100.45616987-41.55467852-146.02391703 30.81001086-146.02391704 30.81001088z" fill="#D8D8D8" p-id="5950"></path><path d="M331.64427061 613.62125431c98.38490864-27.44421136 117.80298272-50.22808494 117.80298272-50.22808492s-91.0060405-56.18296098-139.93958717-56.95968396c-48.80409283-0.64726914-111.84810667 68.22216691-92.43003258 105.76377679 61.62002173 132.56071902 178.77573531 147.96572445 178.7757353 147.96572445 89.06423309-8.02613728 107.05831506-86.99297185 109.1295763-91.0060405-107.70558419 2.07126124-169.97287506-49.45136197-173.33867457-55.53569186z m-80.26137283 35.47034866c10.09739852-26.79694222 70.94069728-79.6141037 70.94069728-79.61410372-10.74466765-10.09739852-70.94069728-29.51547259-70.94069728-29.51547258 14.11046717-6.08432987 81.03809581 20.71261235 81.0380958 20.71261235 60.19602963-32.75181827 66.2803595-16.6995437 66.2803595-16.69954371-40.90740939 9.45012939-147.31845531 105.11650765-147.3184553 105.11650766z" fill="#FFFFFF" p-id="5951"></path><path d="M331.64427061 613.62125431c98.38490864-27.44421136 117.80298272-50.22808494 117.80298272-50.22808492s-91.0060405-56.18296098-139.93958717-56.95968396c-48.80409283-0.64726914-93.72457086 66.2803595-90.35877135 91.65330963 9.32067555 19.41807408 19.41807408 36.76488691 30.16274172 51.52262321 12.03920592-27.44421136 70.29342815-77.6722963 70.29342816-77.6722963-10.74466765-10.09739852-70.94069728-29.51547259-70.94069728-29.51547258 14.11046717-6.08432987 81.03809581 20.71261235 81.03809579 20.71261234 60.19602963-32.75181827 66.2803595-16.6995437 66.28035952-16.6995437-38.83614815 9.32067555-133.85525728 93.07730173-146.54173236 104.4692385 62.91456 84.40389531 145.8944632 95.66637827 145.89446322 95.66637829 89.06423309-8.02613728 107.05831506-73.01195852 109.12957628-77.02502717-107.18776889 1.68289975-169.45505975-49.83972347-172.82085925-55.92405334z" fill="#FFFFFF" p-id="5952"></path><path d="M839.75054222 292.96412445c63.56182914-61.62002173 163.37072987-74.95376592 163.37072987-74.95376593s-6.08432987-74.95376592-101.10343901-107.05831505c-137.2210568-43.49648592-212.82209185 20.0653432-212.82209185 20.0653432S517.79887408 0.39847506 346.40200691 89.46270815 54.48362666 421.51177482 54.48362666 421.51177482c65.63309037 81.03809581 234.31142717 82.9799032 234.31142717 82.33263407-20.0653432 4.66033778-51.5226232 28.73874963-49.58081581 28.73874963-71.58796642-21.35988148-236.25323457 74.95376592-210.88028444 141.88139457 26.14967309 66.92762864 258.38983902 49.58081581 258.389839 49.5808158s47.50955457 35.47034864 37.54160989 35.47034864c-124.53458173-9.32067555-144.59992494 55.53569185-144.59992495 57.60695308 32.10454914 0 222.91949037 51.5226232 222.91949038 51.52262322s32.10454914 136.57378765 61.62002173 138.51559506c30.16274173 2.07126124 55.53569185-49.58081581 55.53569185-51.5226232 37.54160987-37.54160987 28.0914805-116.50844445 24.07841185-120.5215131 18.12353581-10.09739852 101.10343902-35.47034864 246.35063309-188.09641086 144.59992494-151.84933925 55.66514569-350.04314864 49.5808158-354.05621728zM31.82920691 665.14387753c0-81.03809581 186.15460347-141.23412543 186.80187259-124.53458172-24.07841185 57.60695309 0 97.09037037 0 97.09037036l-37.54160987 33.52854124 51.5226232 2.07126123s30.16274173 41.55467852 32.10454914 43.49648593c-132.56071902 11.9097521-228.87436642-14.7577363-232.88743506-51.65207704z m191.46221037-13.98101334v8.67340642h-8.02613728l8.02613728-8.67340642z m204.79595457 121.81605136c-2.07126124 6.08432987-20.71261235 12.03920592-20.71261235 12.03920593l-4.01306864-12.03920593s26.66748839-6.08432987 24.72568099 0z" p-id="5953"></path><path d="M361.80701235 120.91998815c-48.80409283 0-88.41696395 37.54160987-88.41696396 82.97990321s39.48341728 82.9799032 88.41696396 82.97990321 88.41696395-37.54160987 88.41696395-82.97990321-39.61287111-82.9799032-88.41696395-82.97990321z m0 142.65811754c-12.03920592 0-23.43114272-3.3657995-32.75181827-10.09739852 11.3919368 0 20.71261235-9.32067555 20.71261234-20.71261235s-9.32067555-20.71261235-20.71261234-20.71261235c-10.74466765 0-19.41807408 8.02613728-20.71261236 18.1235358-4.01306864-8.02613728-6.08432987-16.6995437-6.08432987-26.14967309 0-32.75181827 26.79694222-59.5487605 59.5487605-59.54876049h6.08432987c-11.3919368 6.08432987-19.41807408 18.12353581-19.41807407 32.10454914 0 20.0653432 16.6995437 36.76488691 36.76488691 36.76488692 16.05227457 0 30.16274173-10.74466765 34.82307951-24.725681 1.29453827 4.66033778 2.07126124 10.09739852 2.07126123 14.7577363-0.77672297 33.39908741-27.57366518 60.19602963-60.32548345 60.19602964z m-22.13660445 204.79595456s28.0914805 18.12353581 75.60103506 0l-18.1235358-25.37295012c0.12945383-0.12945383-57.47749925 25.37295013-57.47749926 25.37295012z m115.8611753-63.56182914c-14.11046717 14.11046717-50.22808494 31.45728-50.22808493 31.45728s52.16989235 29.51547259 63.56182914 22.13660444c12.03920592-8.15559111-9.32067555-51.65207703-13.33374421-53.59388444z m43.49648594-33.52854124c-12.03920592 11.3919368-37.54160987 29.51547259-37.54160989 29.5154726l47.50955458 35.47034864c10.09739852-11.3919368-1.94180741-64.98582124-9.96794469-64.98582124z m22.13660444-31.45728c-2.07126124 9.32067555-13.33374419 23.43114272-17.34681284 26.1496731 10.74466765 5.30760691 28.73874963 24.72568098 28.73874962 24.72568098 11.26248297-16.05227457-3.3657995-48.1568237-11.39193678-50.87535408z" fill="#FFFFFF" p-id="5954"></path><path d="M778.1305205 238.07570173c8.02613728-2.07126124 53.59388445 45.56774717 47.50955456 47.50955457 77.6722963-85.05116445 147.31845531-82.9799032 147.3184553-85.05116445-20.0653432-51.5226232-113.14264494-74.95376592-113.14264493-74.95376593-141.23412543-25.37295013-159.35766124 37.54160987-163.37072988 39.48341728-162.72346075-119.09752098-317.9385995-48.1568237-315.99679209-50.22808493 105.11650765 23.43114272 75.60103506 109.1295763 75.60103505 109.1295763s-14.11046717 85.05116445-111.0713837 73.01195852c-97.09037037-12.03920592-81.68536494-120.52151309-81.68536495-120.52151309C165.68446419 255.55196839 76.62023111 417.49870617 76.62023111 417.49870617c10.09739852 16.05227457 119.09752098 53.59388445 155.34459259 55.53569186 210.23301531-4.01306864 325.9647368-217.61188347 329.3305363-217.61188346 44.79102419 73.01195852 33.52854124 149.26026272-12.03920592 188.09641086-48.93354667 41.55467852-186.80187259 44.27320889-186.8018726 44.27320888 20.0653432 52.16989235 161.94673778 30.81001086 161.94673777 30.81001087-4.66033778 70.94069728-164.01799902 95.01910914-169.32560592 95.01910913 165.31253728 73.01195852 301.88632494-75.60103506 303.95758617-77.67229628-10.09739852 72.23523555-113.14264494 117.80298272-115.08445234 117.80298272 12.03920592 57.60695309-99.03217778 153.9206005-141.23412544 146.54173234-101.10343902-43.49648592-170.74959803 2.07126124-170.74959802 2.07126122l93.72457087 25.37295014s97.7376395 10.09739852 101.10343901 49.5808158c4.01306864 39.48341728 37.54160987 86.99297185 41.55467851 86.99297185 97.7376395-70.94069728 47.50955457-134.50252642 47.50955457-134.50252641s184.73061136-73.01195852 288.55258075-271.72358322-34.30526419-318.58586864-26.27912691-320.00986074z m-46.86228544-59.54876049c-32.10454914-8.02613728-7.37886815-24.07841185 18.1235358-37.54160988 87.64024098-28.73874963 130.48945778 6.73159902 128.54765037 6.73159901-100.45616987-41.55467852-146.67118617 30.81001086-146.67118617 30.81001087z" fill="#D8D8D8" p-id="5955"></path><path d="M331.64427061 611.67944691c98.38490864-27.44421136 118.45025185-50.22808494 118.45025186-50.22808494s-91.65330963-56.18296098-139.93958717-57.60695308c-48.80409283-0.64726914-112.49537581 68.22216691-92.43003258 105.7637768 61.62002173 132.56071902 178.77573531 148.61299358 178.7757353 148.61299356 89.71150222-8.02613728 107.05831506-86.99297185 109.12957629-91.00604049-108.35285333 1.94180741-170.62014419-49.58081581-173.9859437-55.53569185z m-80.26137283 35.47034864c10.09739852-26.79694222 70.94069728-80.39082667 70.94069728-80.39082666-10.74466765-10.09739852-70.94069728-29.51547259-70.94069728-29.51547259 14.11046717-6.08432987 81.68536494 20.71261235 81.68536494 20.71261234 60.97275259-32.75181827 66.2803595-16.6995437 66.2803595-16.6995437-41.55467852 10.09739852-147.96572445 105.89323061-147.96572444 105.89323061z" fill="#9A6E38" p-id="5956"></path><path d="M331.64427061 611.67944691c98.38490864-27.44421136 118.45025185-50.22808494 118.45025186-50.22808494s-91.65330963-56.18296098-139.93958717-57.60695308c-48.80409283-0.64726914-94.37184 66.2803595-91.00604049 91.65330963 9.32067555 19.41807408 19.41807408 36.76488691 30.16274172 51.52262321 12.03920592-27.44421136 70.29342815-78.31956543 70.29342816-78.31956543-10.74466765-10.09739852-70.94069728-29.51547259-70.94069728-29.5154726 14.11046717-6.08432987 81.68536494 20.71261235 81.68536494 20.71261235 60.97275259-32.75181827 66.2803595-16.6995437 66.2803595-16.6995437-38.83614815 9.32067555-133.85525728 93.07730173-146.54173235 104.46923851 62.91456 85.05116445 146.54173235 96.44310124 146.54173235 96.44310124 89.71150222-8.02613728 107.05831506-73.01195852 109.1295763-77.02502716-108.48230717 2.07126124-170.74959803-49.45136197-174.11539754-55.40623803z" fill="#FCB316" p-id="5957"></path></svg>`;
    } else if (is_huya) {
      logo = `<svg t="1694231489964" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4471" width="40" height="40"><path d="M516.032 156.352a425.408 425.408 0 0 1 162.624 22.4 388.096 388.096 0 0 1 124.224 69.632 300.16 300.16 0 0 1 78.336 99.904c12.032 25.28 20.096 52.544 23.424 80.384 2.496 21.184 2.496 43.136-4.352 63.552a104.128 104.128 0 0 1-36.928 50.816c-22.4 16.896-49.28 26.496-76.16 33.408-45.568 11.328-92.416 15.552-139.072 19.392-49.664 3.776-99.392 6.976-148.992 11.52-33.472 2.752-66.944 5.888-100.544 7.296a554.24 554.24 0 0 1-90.432-2.112c-26.304-3.328-52.928-9.728-75.584-24.064a102.592 102.592 0 0 1-39.168-45.056c-11.136-24.704-13.504-52.352-12.416-79.168 1.728-58.496 22.848-115.84 57.728-162.624 42.048-56.896 102.336-99.008 168.576-122.944a394.816 394.816 0 0 1 108.736-22.336z m-32.576 101.312a24.32 24.32 0 0 0-13.888 6.272 51.072 51.072 0 0 0-10.624 18.56 217.344 217.344 0 0 0-10.24 53.12c-2.432 30.592-1.664 61.44 2.496 91.84 2.752 18.816 6.592 37.76 14.592 55.168 3.968 8.064 9.088 16.512 17.6 20.288 8.768 3.328 18.368 1.92 27.264 0.064 19.072-4.352 37.056-12.48 54.4-21.44a447.36 447.36 0 0 0 65.92-42.304c16.448-12.992 32.576-26.88 45.056-43.904 5.632-8.192 11.648-18.304 8.384-28.608-4.16-11.584-13.312-20.544-22.144-28.8a336.704 336.704 0 0 0-55.232-38.912 399.808 399.808 0 0 0-73.152-33.536c-16.192-5.056-33.216-9.92-50.432-7.808m212.544 473.28c19.2-7.424 37.952-16.64 54.016-29.632 0.768 26.112-5.568 52.224-16.384 75.904l-1.024-1.024c-7.936-8.384-16.896-15.872-23.68-25.344a189.312 189.312 0 0 1-12.928-19.904m-285.248 46.912c-1.216-10.624-3.584-21.568-0.96-32.128 20.032 6.144 40.768 9.728 61.632 11.712-12.544 21.952-32.192 38.976-53.632 51.968a208.96 208.96 0 0 0-1.664-2.176c-0.576-9.984-4.224-19.456-5.376-29.376" fill="#F6F8F9" p-id="4472"></path><path d="M553.664 65.984c22.784-23.488 51.072-42.752 83.136-50.56 5.76-1.6 11.328 1.6 16.832 2.944 42.176 14.272 79.68 39.744 112.256 69.632a486.848 486.848 0 0 1 85.824 107.52c1.536 2.496 3.136 5.056 4.288 7.808-31.616-34.688-62.4-70.4-98.496-100.608a399.36 399.36 0 0 0-99.008-60.16c-4.288-1.6-8.192-4.544-12.864-4.8-32.192 2.88-62.976 14.272-91.968 28.224M194.176 22.72c59.648 7.168 118.912 22.656 171.904 51.456 3.84 2.24 8 4.096 11.584 6.848-8.384-1.92-16.384-5.376-24.64-7.68C308.928 60.16 262.976 50.944 216.768 52.416c-3.584 0.256-7.872-0.32-10.432 2.88-14.08 14.208-24.256 31.616-33.728 49.088a802.56 802.56 0 0 0-49.664 119.488c-3.712 10.752-6.464 21.76-9.984 32.576 6.144-74.432 31.36-146.496 67.712-211.392 4.288-7.616 8.64-15.104 13.504-22.336M406.464 151.68c99.456-33.792 210.944-27.776 307.584 12.672 39.936 16.768 77.44 39.488 110.144 67.968a323.328 323.328 0 0 1 81.408 106.944c10.944 23.552 18.88 48.576 23.104 74.176 5.696 33.408 5.056 69.12-9.344 100.416-2.24 4.736-4.352 9.6-7.872 13.568-2.368 6.08-7.04 10.88-11.008 15.936-24.128 28.288-59.136 44.544-94.208 54.72-50.56 14.4-103.232 18.944-155.456 23.36-36.48 2.816-73.024 5.184-109.44 8.128-63.168 4.928-126.272 12.352-189.696 11.52a384.896 384.896 0 0 1-77.056-8.384 177.28 177.28 0 0 1-56.192-22.528 127.552 127.552 0 0 1-45.44-49.984c-13.76-26.752-18.304-57.28-18.048-87.104 0.192-63.616 20.992-126.72 57.408-178.816 46.72-67.136 116.864-116.608 194.112-142.592z m109.568 4.672a394.816 394.816 0 0 0-108.736 22.336c-66.24 23.936-126.592 66.048-168.576 122.944a288.896 288.896 0 0 0-57.728 162.624c-1.088 26.816 1.28 54.464 12.48 79.232 8.192 18.432 21.952 34.304 39.104 44.992 22.656 14.336 49.28 20.672 75.584 24 30.016 3.52 60.352 3.584 90.432 2.112 33.6-1.344 67.072-4.48 100.544-7.232 49.6-4.608 99.264-7.744 148.928-11.52 46.656-3.84 93.568-8.064 139.072-19.392 26.88-6.912 53.76-16.512 76.16-33.408 17.024-12.736 30.4-30.528 36.928-50.816 6.912-20.416 6.912-42.368 4.352-63.552a261.504 261.504 0 0 0-23.424-80.384 300.992 300.992 0 0 0-78.336-99.904 388.096 388.096 0 0 0-124.224-69.632 426.176 426.176 0 0 0-162.56-22.4" fill="#954607" p-id="4473"></path><path d="M483.456 257.664c17.152-2.048 34.176 2.752 50.432 7.808 25.536 8.448 49.856 20.16 73.152 33.536 19.52 11.328 38.4 23.936 55.232 38.976 8.832 8.256 17.92 17.152 22.144 28.8 3.264 10.304-2.752 20.416-8.384 28.608-12.416 17.024-28.544 30.912-45.056 43.904a447.36 447.36 0 0 1-65.92 42.304 238.272 238.272 0 0 1-54.4 21.44c-8.896 1.792-18.496 3.2-27.2-0.192-8.512-3.776-13.632-12.224-17.6-20.288-8-17.344-11.84-36.352-14.592-55.104a428.608 428.608 0 0 1-2.496-91.904c1.6-17.984 4.096-36.032 10.24-53.12a49.536 49.536 0 0 1 10.624-18.496 24.128 24.128 0 0 1 13.824-6.272m430.016 270.272c1.344-0.96 2.56-2.624 4.416-2.56a404.8 404.8 0 0 1 104.256 9.472c0.768 5.376 0.96 10.88 1.344 16.32a374.4 374.4 0 0 1-5.056 79.36A549.888 549.888 0 0 0 945.92 553.6c-10.56-8.896-20.8-18.304-32.448-25.664M40.576 611.2a415.36 415.36 0 0 1 138.752-37.76 185.792 185.792 0 0 1-9.152 9.664 527.04 527.04 0 0 0-109.824 168.448 327.232 327.232 0 0 1-52.544-121.92c10.496-6.912 21.504-12.992 32.768-18.432m794.944 40.32c25.408 1.472 50.56 7.424 73.984 17.28 27.136 11.264 51.776 27.84 73.984 46.912 1.984 1.856 4.608 3.584 5.12 6.528a328 328 0 0 1-82.432 102.912c-4.928-25.6-10.24-51.264-18.432-76.096-11.584-35.136-26.944-70.016-52.224-97.536m-87.936 10.112a12.992 12.992 0 0 1 19.712 5.376c3.008 8.576-1.664 17.408-6.72 24.128 3.968 34.112-5.76 68.096-19.584 98.944a158.144 158.144 0 0 1-65.408-31.232c-6.272-4.608-11.456-10.496-17.152-15.68a575.552 575.552 0 0 1-174.4 15.488c-15.168 28.544-40.832 50.048-68.8 65.408a206.08 206.08 0 0 1-45.504-96.576c-6.08-4.864-12.416-10.24-15.232-17.728-1.024-5.312 3.52-10.112 8.32-11.712 4.864-2.048 11.776-3.072 15.36 1.792 6.464 8.192 16.32 12.48 25.728 16.384 29.568 11.456 61.44 15.488 92.928 17.152A549.184 549.184 0 0 0 640 720.768c27.712-6.464 55.296-15.104 79.872-29.696 8-4.928 16.192-10.176 21.696-17.92 1.536-3.968 1.984-8.96 6.016-11.52z m-51.584 69.312c-8.32 3.2-16.896 5.696-25.28 8.64 17.28 16.896 38.464 30.336 61.952 36.608l1.024 1.024c10.816-23.68 17.152-49.792 16.384-75.904a200.512 200.512 0 0 1-54.08 29.632z m-313.472 4.032c6.336 25.984 17.024 51.264 33.664 72.32l1.664 2.176c21.44-12.992 41.152-30.016 53.632-51.968a314.688 314.688 0 0 1-61.632-11.712 186.688 186.688 0 0 1-27.328-10.816m-202.176 4.544a240.384 240.384 0 0 1 109.248-55.36 222.72 222.72 0 0 0-24.128 50.24c-17.088 50.688-21.632 104.64-21.632 157.824a449.728 449.728 0 0 1-125.888-76.864 288 288 0 0 1 62.4-75.84" fill="#954607" p-id="4474"></path><path d="M553.664 65.984c28.928-13.952 59.776-25.344 92.032-28.096 4.608 0.32 8.576 3.264 12.864 4.8a396.288 396.288 0 0 1 99.008 60.16c36.096 30.208 66.88 65.92 98.496 100.608 10.048 10.56 20.864 20.352 30.528 31.232 68.416 74.304 117.248 168.064 132.416 268.416 2.176 15.936 4.224 32 4.48 48.064-0.384-5.44-0.64-10.88-1.344-16.32a405.056 405.056 0 0 0-104.256-9.472c-1.856-0.064-3.072 1.6-4.416 2.56 11.648 7.36 21.888 16.768 32.448 25.6 26.752 23.104 50.688 49.216 72.512 76.928a324.672 324.672 0 0 1-29.824 91.776c-0.512-2.944-3.136-4.608-5.12-6.528a277.184 277.184 0 0 0-73.984-46.912 225.28 225.28 0 0 0-73.984-17.28c25.28 27.52 40.64 62.4 52.224 97.536 8.192 24.832 13.568 50.432 18.432 76.096l0.064 0.192c-49.408 41.472-108.736 69.824-170.304 88.128-80.704 23.936-165.504 31.616-249.408 28.928-82.88-3.072-165.952-18.112-242.752-49.856v-0.256c0-53.184 4.608-107.136 21.632-157.824 5.888-17.664 14.08-34.56 24.128-50.24a240.384 240.384 0 0 0-109.248 55.36 288.832 288.832 0 0 0-62.464 75.904 358.912 358.912 0 0 1-57.536-63.872 524.928 524.928 0 0 1 109.824-168.448c3.2-3.136 6.336-6.272 9.152-9.728a413.888 413.888 0 0 0-138.688 37.76c-11.264 5.44-22.272 11.52-32.768 18.432a404.48 404.48 0 0 1 4.736-176.896 491.392 491.392 0 0 1 100.416-196.288c3.52-10.816 6.272-21.824 9.984-32.576 13.696-40.896 29.568-81.216 49.664-119.488 9.472-17.472 19.648-34.944 33.728-49.088 2.496-3.2 6.784-2.624 10.432-2.88 46.208-1.472 92.16 7.744 136.256 20.928 8.32 2.304 16.256 5.696 24.64 7.68 1.664 0.512 3.328 1.6 5.12 0.832a494.336 494.336 0 0 1 167.488-15.552l3.392-0.32z m-147.2 85.696c-77.248 25.984-147.392 75.456-194.112 142.592a316.288 316.288 0 0 0-57.408 178.816c-0.256 29.824 4.288 60.352 18.048 87.104a128 128 0 0 0 45.44 49.984c17.024 11.072 36.48 17.856 56.192 22.528 25.216 5.824 51.2 7.744 77.056 8.384 63.424 0.832 126.592-6.592 189.696-11.52 36.48-2.944 72.96-5.312 109.44-8.128 52.224-4.416 104.896-8.896 155.456-23.36 35.072-10.176 70.08-26.432 94.208-54.72 3.968-5.056 8.64-9.856 11.008-15.936 3.52-3.968 5.632-8.832 7.872-13.568 14.336-31.232 14.976-67.008 9.344-100.416a286.976 286.976 0 0 0-23.104-74.176 323.328 323.328 0 0 0-81.408-106.944 408.256 408.256 0 0 0-110.144-67.968c-96.64-40.448-208.128-46.528-307.584-12.672z m341.12 509.952c-4.032 2.56-4.48 7.552-6.144 11.584-5.504 7.744-13.76 12.992-21.696 17.92-24.576 14.592-52.16 23.232-79.872 29.696a543.488 543.488 0 0 1-143.168 12.608c-31.488-1.6-63.36-5.696-92.928-17.152-9.408-3.904-19.264-8.192-25.728-16.384-3.584-4.864-10.496-3.84-15.36-1.792-4.8 1.6-9.28 6.4-8.32 11.712 2.88 7.488 9.152 12.8 15.232 17.728 6.528 35.392 21.952 69.248 45.504 96.576 28.032-15.36 53.632-36.864 68.8-65.408a577.408 577.408 0 0 0 174.4-15.488c5.696 5.248 10.816 11.072 17.152 15.68 18.944 15.424 41.6 25.92 65.408 31.232 13.888-30.848 23.616-64.832 19.584-98.944 5.056-6.72 9.792-15.616 6.72-24.128-2.752-7.68-13.248-10.56-19.584-5.44" fill="#F49F17" p-id="4475"></path><path d="M670.72 739.648c8.384-2.944 16.96-5.44 25.28-8.64 4.032 6.784 8.064 13.632 12.992 19.904 6.72 9.472 15.68 16.96 23.68 25.344a143.232 143.232 0 0 1-61.952-36.608z m-288.192-4.672c8.768 4.352 17.984 7.872 27.328 10.752-2.688 10.56-0.256 21.504 0.96 32.128 1.088 9.984 4.8 19.456 5.44 29.44a186.56 186.56 0 0 1-33.728-72.32z" fill="#F3EBDE" p-id="4476"></path></svg>`;
    } else if (is_douyin) {
      logo = `<svg t="1694230416862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4262" width="40" height="40"><path d="M230.4 51.2h563.2C892.416 51.2 972.8 131.584 972.8 230.4v563.2C972.8 892.416 892.416 972.8 793.6 972.8h-563.2C131.584 972.8 51.2 892.416 51.2 793.6v-563.2C51.2 131.584 131.584 51.2 230.4 51.2z" fill="#170B1A" p-id="4263"></path><path d="M511.488 323.072c0.512-57.856 0-115.712 0.512-173.568h118.272c-0.512 10.24 1.024 20.48 2.56 30.208h-87.04v470.016c0.512 19.968-4.608 39.936-14.336 57.344-15.36 26.624-44.032 45.056-74.752 47.616-19.456 1.536-39.424-2.048-56.832-11.776a97.570133 97.570133 0 0 1-33.28-29.696c30.208 16.896 69.632 15.36 98.816-3.584 28.16-17.408 46.592-50.176 46.592-83.968-0.512-100.864-0.512-201.728-0.512-302.592z m195.072-33.28c16.384 10.24 34.816 18.432 53.76 22.528 11.264 2.56 22.528 3.584 34.304 3.584v26.624c-33.792-7.68-65.024-26.624-88.064-52.736z" fill="#25F4EE" p-id="4264"></path><path d="M298.496 437.248c42.496-26.624 94.208-37.376 143.36-30.208v28.16c-13.312 0.512-26.112 2.048-39.424 4.608-31.744 6.656-61.952 19.968-88.064 39.424-28.16 20.992-49.664 49.664-64.512 81.408-14.336 30.208-21.504 63.488-20.992 97.28 0 36.864 10.24 72.704 27.648 104.96 8.192 14.848 17.408 29.184 29.696 40.96-25.088-17.408-46.08-40.96-61.44-67.584-20.992-35.328-31.232-76.8-30.208-118.272 1.536-37.888 12.288-75.264 32.256-108.032 17.408-29.184 42.496-54.784 71.68-72.704z" fill="#25F4EE" p-id="4265"></path><path d="M545.792 179.712h87.552c3.072 16.896 9.216 32.768 16.896 48.128 12.288 23.552 29.696 44.544 52.224 58.368a11.946667 11.946667 0 0 1 3.584 3.584 168.0384 168.0384 0 0 0 88.576 52.736c0.512 30.72 0 61.952 0 92.672a277.333333 277.333333 0 0 1-162.816-51.712c0 73.728 0 147.456 0.512 221.184 0 9.728 0.512 19.456 0 29.696-2.56 35.84-13.824 71.168-31.744 102.4-15.36 27.136-36.352 51.2-61.44 69.632-32.256 24.064-72.192 37.376-112.128 38.4-20.48 0.512-40.96-0.512-60.928-5.12-28.16-6.144-54.784-17.92-78.336-34.304l-1.536-1.536c-11.776-11.776-21.504-26.112-29.696-40.96-17.408-31.744-27.648-68.096-27.648-104.96-0.512-33.28 6.656-67.072 20.992-97.28 14.848-31.744 36.864-60.416 64.512-81.408 26.112-19.456 56.32-32.768 88.064-39.424 12.8-2.56 26.112-4.096 39.424-4.608 0.512 11.776 0 23.552 0.512 34.816v59.904c-14.848-5.12-31.232-5.12-46.592-1.536-18.432 4.096-35.84 12.288-50.176 24.576-8.704 7.68-16.384 16.896-21.504 27.136-9.216 17.408-12.288 37.888-10.24 57.344 2.048 18.944 10.24 37.376 22.528 51.712 8.192 10.24 18.944 17.92 29.696 25.088 8.704 12.288 19.968 22.528 33.28 29.696 17.408 9.216 37.376 13.312 56.832 11.776 30.72-2.048 59.392-20.992 74.752-47.616 9.728-17.408 14.848-37.376 14.336-57.344 1.024-157.696 0.512-314.368 0.512-471.04z" fill="#FFFFFF" p-id="4266"></path><path d="M633.344 179.712c10.24 0.512 20.48 0 31.232 0 0 34.304 10.752 68.608 30.72 96.768 2.56 3.584 5.12 6.656 7.68 9.728-22.528-13.824-40.448-34.816-52.224-58.368-7.68-14.848-13.824-31.232-17.408-48.128z m161.28 162.816c11.264 2.56 22.528 3.584 34.304 3.584v119.296c-58.368 0.512-116.736-18.944-164.352-53.248v236.544c0.512 17.92-1.024 35.84-5.12 53.248-11.264 53.248-43.008 101.376-87.04 132.608-23.552 16.896-50.176 28.672-77.824 34.816-33.792 7.68-69.12 7.168-102.4-1.536-39.424-10.24-76.288-32.256-103.936-62.464 23.552 16.896 50.176 28.16 78.336 34.304 19.968 4.608 40.448 5.632 60.928 5.12 39.936-1.024 79.872-14.336 112.128-38.4 25.088-18.432 45.568-42.496 61.44-69.632 17.92-31.232 29.184-66.56 31.744-102.4 0.512-9.728 0.512-19.456 0-29.696-0.512-73.728-0.512-147.456-0.512-221.184a277.333333 277.333333 0 0 0 162.816 51.712c-0.512-30.72 0-61.952-0.512-92.672z" fill="#FE2C55" p-id="4267"></path><path d="M442.368 434.688c11.264 0 23.04 0.512 34.304 2.048v122.368c-16.384-5.632-34.816-6.144-51.712-2.048-32.256 7.168-59.392 31.744-70.656 62.976-11.264 30.72-6.656 66.56 12.8 92.672-11.264-6.656-21.504-14.848-29.696-25.088-12.288-14.336-20.48-32.768-22.528-51.712-2.048-19.456 1.024-39.936 10.24-57.344 5.12-10.24 12.8-19.456 21.504-27.136 14.336-12.288 32.256-19.968 50.176-24.576 15.36-3.584 31.744-3.584 46.592 1.536v-59.904c-1.024-10.24-0.512-22.016-1.024-33.792z" fill="#FE2C55" p-id="4268"></path></svg>`;
    } else if (is_bilibili) {
      logo = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2753" width="24" height="24"><path d="M306.005333 117.632L444.330667 256h135.296l138.368-138.325333a42.666667 42.666667 0 0 1 60.373333 60.373333L700.330667 256H789.333333A149.333333 149.333333 0 0 1 938.666667 405.333333v341.333334a149.333333 149.333333 0 0 1-149.333334 149.333333h-554.666666A149.333333 149.333333 0 0 1 85.333333 746.666667v-341.333334A149.333333 149.333333 0 0 1 234.666667 256h88.96L245.632 177.962667a42.666667 42.666667 0 0 1 60.373333-60.373334zM789.333333 341.333333h-554.666666a64 64 0 0 0-63.701334 57.856L170.666667 405.333333v341.333334a64 64 0 0 0 57.856 63.701333L234.666667 810.666667h554.666666a64 64 0 0 0 63.701334-57.856L853.333333 746.666667v-341.333334A64 64 0 0 0 789.333333 341.333333zM341.333333 469.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666666-42.666667z m341.333334 0a42.666667 42.666667 0 0 1 42.666666 42.666667v85.333333a42.666667 42.666667 0 0 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z" p-id="2754" fill="currentColor"></path></svg>`;
    }
    return logo;
  };
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  class LivePlugin {
    constructor() {
      this.baseUrl = "/";
      this.key = "key";
      this.bg_key = "bg_key";
      this.bg_show_key = "bg_show_key";
      this.bg_is_first_key = "bg_is_first_key";
      this.full_screen_key = "full_screen_key";
      this.full_screen_is_find = true;
      this.full_screen_class_or_id = "full_screen_button_class_or_id";
      this.full_button_tag_name = "div";
      this.full_screen_button = getLocalStore(this.full_screen_class_or_id, String.name, false) || this.full_screen_class_or_id;
      this.full_screen_text = "全屏";
      this.full_cancel_text = "退出全屏";
      this.full_screen_is_first_key = "full_screen_is_first_key";
      this.default_background_image = "https://cdn.staticaly.com/gh/wuxin0011/blog-resource@main/picgo/bg5.jpg";
      this.users = [];
      this.menu = null;
      this.menu_show_key = "menu_show_key";
      this.menu_is_first_key = "menu_is_first_key";
      this.tbody = null;
      this.m_container = null;
      this.gift_key = `${this.key}_gift`;
      this.gift_tool = null;
      this.video_room_selector = null;
      this.gift_is_first_key = "gift_is_first_key";
      this.logo_btn = null;
      this.btn_logo_svg = iconLogo();
      this.logo_show_key = `${this.key}_logo_show`;
      this.header_logo = "none";
      this.button_name = "";
      this.is_new = false;
      this.btn_is_first_key = "btn_is_first_key";
      this.video_player_container = ".room-player-wrap";
      this.auto_max_pro_key = "auto_max_pro_key";
      this.is_first_auto_max_pro_key = "is_first_auto_max_pro_key";
      this.auto_max_pro_class_or_id_list = "auto_max_pro_class_or_id_list";
      this.auto_max_pro_keywords = ["登录", "会员", "大会员"];
      if (is_localhost) {
        this.init();
      }
    }
    // 初始化操作方法，子类可以继承该类，实现该类中空方法，参考此操作,初始化构造器实调用该方法就可以了。。。
    init() {
      this.clickLogoShowContainer();
      this.users = getLocalStore(this.key, Array.name, true) || [];
      if (!this.removeRoom()) {
        this.create_container();
        this.detail();
        this.index();
        this.category();
        this.common();
        if (is_huya || is_douyu) {
          loopDo(() => {
            this.isShowLeftMenu();
            this.isShowGift();
          }, 10, 1e3);
        }
      }
      this.addEven();
      this.settingBackgroundImage();
    }
    /*********************************建议下面操作方法必须重写的,并且参考此步骤*****************************/
    /**
     * 公共
     */
    common() {
    }
    /**
     * 首页
     */
    index() {
    }
    /**
     * 分类
     */
    category() {
    }
    /**
     * 详情
     */
    detail() {
    }
    /**
     * 点击房间名称操作
     */
    removeRoomByClickRoomName() {
    }
    /**
     * 通过房间号获取名称
     * @param roomId 房间号
     * @returns {null} name
     */
    getNameByRoomId(roomId) {
      warn("请自定义实现通过名称获取房间号方法");
      return null;
    }
    /**
     * 通过一个地址获取房间号
     * @param url 地址
     * @returns {null} 房间号
     */
    getRoomIdByUrl(url) {
      warn("请自定义实现通过名称获取房间号方法");
      return null;
    }
    /**
     * 自动最高画质！
     */
    isAutoMaxVideoPro() {
      let that = this;
      if (is_huya) {
        setTimeout(() => {
          this.autoSeletMax();
        }, 2e3);
        return;
      }
      if (!(wls.getItem(that.is_first_auto_max_pro_key) === null ? true : getLocalStore(that.auto_max_pro_key, Boolean.name))) {
        return;
      }
      log("查找播放视频画质列表", that.auto_max_pro_class_or_id_list);
      loopDo((timer) => {
        let items = querySelectorAll(that.auto_max_pro_class_or_id_list);
        log("画质:", items);
        if (isArray(items)) {
          for (let item of items) {
            let result = that.auto_max_pro_keywords.findIndex((key) => item.innerText.indexOf(key) !== -1);
            if (result === -1) {
              log("当前最高画质", item.innerText);
              if (is_huya) {
                item = querySelector(item, "span");
              }
              item.click();
              clearInterval(timer);
              return;
            }
          }
        }
      }, 100, 1e3);
    }
    updateHeaderIcon() {
    }
    /*********************************子类继承无需修改的方法******************************/
    /**
     * 容器，所有操作容器均在此容器中，
     */
    create_container() {
      let that = this;
      let isShowMenu = wls.getItem(this.menu_is_first_key) === null ? false : getLocalStore(that.menu_show_key, Boolean.name);
      let isShowFullScreen = wls.getItem(this.full_screen_is_first_key) === null ? false : getLocalStore(that.full_screen_key, Boolean.name);
      let isShowGift = wls.getItem(this.gift_is_first_key) === null ? false : getLocalStore(that.gift_key, Boolean.name);
      let isShowLogo = wls.getItem(this.btn_is_first_key) === null ? true : getLocalStore(that.logo_show_key, Boolean.name);
      let isAutoMaxPro = wls.getItem(this.is_first_auto_max_pro_key) === null ? true : getLocalStore(that.auto_max_pro_key, Boolean.name);
      that.m_container = new LivePluginElement().createContainer(isShowBg(), isShowMenu, isShowFullScreen, isShowGift, isShowLogo, isAutoMaxPro);
      if (querySelector(that.m_container, "#m-container-box2 table tbody")) {
        that.tbody = querySelector(that.m_container, "#m-container-box2 table tbody");
        that.is_new = true;
      } else {
        that.tbody = querySelector(that.m_container, ".m-container table tbody");
        that.is_new = false;
      }
      that.operationDOMButton();
      that.createRoomItem(that.users);
      that.createButton();
      log("操作面板初始化完毕！");
    }
    /**
     * 通过用户列表构建列表
     * @param {Object} arr  用户列表
     */
    createRoomItem(arr) {
      if (!isArray(arr)) {
        return;
      }
      let that = this;
      arr.forEach((item, index) => {
        if (item == null) {
          return;
        }
        if (!(item == null ? void 0 : item.name) || !(item == null ? void 0 : item.roomId) || item.roomId == "null" || item.roomId == "null") {
          this.userDelete(item.name, item.roomId);
          return;
        }
        let tr = createElement("tr");
        tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.roomId}</td>
                <td><button class="btn btn-danger" room-id="${item.roomId}">删除</button></td>
                `;
        appendChild(that.tbody, tr);
        addEventListener(querySelector(tr, "button"), "click", function(e) {
          let roomId = e.target.getAttribute("room-id");
          that.userDelete(roomId);
          handlerPromise(that.getRoomIdByUrl(local_url), (result) => {
            if (result === roomId) {
              window.location.reload();
            }
          });
          removeDOM(tr, true);
        });
      });
    }
    /**
     * 绘制表格
     * @param {Object} arr 表格数据
     */
    resetTbody(arr) {
      if (!this.tbody) {
        error("tbody 为 null ！");
        return;
      }
      querySelectorAll(this.tbody, "tr").forEach((item) => removeDOM(item, true));
      this.createRoomItem(arr);
    }
    /**
     * 操作框容器
     */
    operationDOMButton() {
      let that = this;
      if (!that.m_container) {
        return;
      }
      const container = that.m_container;
      const inputValue = querySelector(container, ".operation input");
      addEventListener(inputValue, "input", () => {
        let arr = [];
        try {
          arr = that.users.filter((item) => {
            var _a, _b;
            return item && (item == null ? void 0 : item.roomId) && ((_a = item == null ? void 0 : item.roomId) == null ? void 0 : _a.indexOf(inputValue.value)) !== -1 || item && (item == null ? void 0 : item.name) && ((_b = item == null ? void 0 : item.name) == null ? void 0 : _b.indexOf(inputValue.value)) !== -1;
          });
        } catch (error2) {
          arr = [...that.users];
        }
        that.resetTbody(arr);
      });
      const addRoomBtn = querySelector(container, ".operation button.add-room");
      addEventListener(addRoomBtn, "click", function() {
        const keywords = inputValue.value.trim();
        if (!keywords) {
          return alert("请输入房间号！");
        }
        if (!that.userIsExist(keywords)) {
          if (is_bilibili) {
            that.handlerBiliBiliKeywords(keywords, inputValue);
          } else {
            handlerPromise(that.getNameByRoomId(keywords), (res) => {
              that.searchUserByRoomId(res, keywords, inputValue);
            });
          }
        } else {
          alert("该主播已添加！");
        }
      });
      const clearRoomBtn = querySelector(container, ".operation button.clear-room");
      addEventListener(clearRoomBtn, "click", function() {
        if (confirm("确认重置？")) {
          that.users = [];
          let deleteKeyList = [
            that.key,
            that.bg_key,
            that.bg_show_key,
            that.menu_show_key,
            that.gift_key,
            that.logo_show_key,
            that.full_screen_key,
            that.bg_is_first_key,
            that.btn_is_first_key,
            that.full_screen_is_first_key,
            that.menu_is_first_key,
            that.gift_is_first_key,
            that.is_first_auto_max_pro_key,
            DARK_THEME_KEY,
            THEME_IS_AUTO,
            "__right_container_key__",
            "__right_video_list_reco_list_key__"
          ];
          for (let item of deleteKeyList) {
            try {
              wls.removeItem(item);
            } catch (e) {
            }
          }
          that.resetTbody(that.users);
          window.location.reload();
        }
      });
      const uploadButton = querySelector(container, ".operation #file");
      addEventListener(uploadButton, "change", function(e) {
        const file = uploadButton.files[0] || null;
        uploadImage(file, (base64) => {
          addLocalStore(that.bg_key, base64, String.name, false);
          that.settingBackgroundImage(base64);
        });
        addLocalStore(that.bg_is_first_key, false, Boolean.name);
      });
      const upload = querySelector(container, ".operation .bg-btn");
      addEventListener(upload, "click", function(e) {
        uploadButton.click();
        addLocalStore(that.bg_is_first_key, false, Boolean.name);
      });
      const close_container = querySelector(container, ".operation .btn-close-container");
      addEventListener(close_container, "click", function(e) {
        that.isShowContainer();
      });
      const close_container2 = querySelector(container, ".operation #m-close-button1");
      addEventListener(close_container2, "click", function(e) {
        that.isShowContainer();
      });
      const checkbox = querySelector(container, ".operation #checkbox1");
      addEventListener(checkbox, "change", function(e) {
        log("背景是否开启", e.target.checked ? "开启" : "关闭");
        addLocalStore(that.bg_show_key, e.target.checked, Boolean.name);
        addLocalStore(that.bg_is_first_key, false, Boolean.name);
        that.settingBackgroundImage();
      });
      const menu = querySelector(container, ".operation #checkbox2");
      addEventListener(menu, "change", function(e) {
        that.getLeftMenu(e.target.checked);
        addLocalStore(that.menu_is_first_key, false, Boolean.name);
      });
      const full_screen_btn = querySelector(container, ".operation #checkbox3");
      addEventListener(full_screen_btn, "change", function(e) {
        addLocalStore(that.full_screen_key, e.target.checked, Boolean.name);
        addLocalStore(that.full_screen_is_first_key, false, Boolean.name);
        that.isFullScreen(true);
      });
      const show_gift = querySelector(container, ".operation #checkbox4");
      addEventListener(show_gift, "change", function(e) {
        addLocalStore(that.gift_key, e.target.checked, Boolean.name);
        that.isShowGift();
        addLocalStore(that.gift_is_first_key, false, Boolean.name);
      });
      const show_logo_btn = querySelector(container, ".operation #checkbox5");
      addEventListener(show_logo_btn, "change", function(e) {
        e.preventDefault();
        if (!that.logo_btn) {
          warn("获取不到Logo哦！");
          return alert("获取不到logo");
        }
        if (that.logo_btn.style.display === "block") {
          if (confirm("确认隐藏Logo？隐藏之后不再显示哦!如需显示logo，点击直播头部Logo即可显示")) {
            that.logo_btn.style.display = "none";
            addLocalStore(that.logo_show_key, false, Boolean.name);
          }
        } else {
          that.logo_btn.style.display = "block";
          addLocalStore(that.logo_show_key, true, Boolean.name);
        }
        addLocalStore(that.btn_is_first_key, false, Boolean.name);
      });
      const auto_max_pro = querySelector(container, ".operation #checkbox6");
      addEventListener(auto_max_pro, "change", function(e) {
        addLocalStore(that.auto_max_pro_key, e.target.checked, Boolean.name);
        addLocalStore(that.is_first_auto_max_pro_key, false, Boolean.name);
        that.isAutoMaxVideoPro();
      });
      this.themeContr(container);
      this.initAnimation(container);
      log("操作按钮添加成功！");
    }
    handlerBiliBiliKeywords(keywords, inputValue) {
      let that = this;
      if (isBVId(keywords)) {
        handlerPromise(getBiliBiliInfoByVideoID(keywords), (result) => {
          var _a, _b, _c, _d;
          if (result && (result == null ? void 0 : result.code) == 0) {
            that.searchUserByRoomId((_b = (_a = result == null ? void 0 : result.data) == null ? void 0 : _a.owner) == null ? void 0 : _b.name, (_d = (_c = result == null ? void 0 : result.data) == null ? void 0 : _c.owner) == null ? void 0 : _d.mid, inputValue);
          } else if (isRisk(result)) {
            alert("服务不可用，该操作已被官方禁止，请待会再尝试吧！");
          } else {
            alert("搜索失败！请复制 https://www.bilibili.com/video/xxxxxx 地址尝试");
          }
        });
      } else if (isUserId(keywords)) {
        handlerPromise(getBiliBiliInfoByUserId(keywords), (result) => {
          var _a, _b;
          if (result && (result == null ? void 0 : result.code) == 0) {
            that.searchUserByRoomId((_a = result == null ? void 0 : result.data) == null ? void 0 : _a.name, (_b = result == null ? void 0 : result.data) == null ? void 0 : _b.mid, inputValue);
          } else if (isRisk(result)) {
            alert("服务不可用，该操作已被官方禁止，请待会再尝试吧！");
          } else {
            alert("搜索失败！请复制 https://space.bilibili.com/xxxxxxxx 地址尝试");
          }
        });
      } else {
        alert("搜索失败！请复制 https://space.bilibili.com/xxxxxxxx  或者 https://www.bilibili.com/video/xxxxxx  地址尝试");
      }
    }
    themeContr(container) {
      const theme_is_auto_box = querySelector(container, ".operation #m-dark-is-auto");
      const theme_btn = querySelector(container, ".operation .room-theme");
      const theme_select = querySelector(container, ".operation #m-dark-select");
      const cancelAutoTheme = (result = false) => {
        theme_is_auto_box.checked = result;
        wls.setItem(THEME_IS_AUTO, result ? THEME_IS_AUTO : `no_${THEME_IS_AUTO}`);
        theme_btn.innerText = isNeedDark() ? "白天" : "黑夜";
        theme_btn.title = isNeedDark() ? "点击切换到白天模式" : "点击切换到黑夜模式";
      };
      addEventListener(theme_btn, "click", function(e) {
        toggleColorMode(e, true);
        if (container.classList.contains("dark")) {
          container.classList.remove("dark");
          localStorage.setItem(DARK_THEME_KEY, theme.light);
        } else if (!container.classList.contains("dark")) {
          localStorage.setItem(DARK_THEME_KEY, theme.dark);
          container.className = `dark ${container.className}`;
        }
        cancelAutoTheme(false);
      });
      addEventListener(theme_is_auto_box, "change", function(e) {
        wls.setItem(DARK_THEME_KEY, theme.light);
        cancelAutoTheme(e.target.checked);
        toggleColorMode(e);
        if (!isNeedDark()) {
          container.classList.contains("dark") && container.classList.remove("dark");
        } else {
          !container.classList.contains("dark") && (container.className = `dark ${container.className}`);
        }
      });
      addEventListener(theme_select, "change", function(e) {
        localStorage.setItem(DARK_THEME_KEY, theme.dark);
        cancelAutoTheme(false);
        updateDarkStyleType(e.target.value);
        if (document.documentElement.classList.contains("dark")) {
          !container.classList.contains("dark") && (container.className = `dark ${container.className}`);
        }
      });
    }
    initAnimation(container) {
      let box1 = querySelector(container, "#m-container-box1");
      let box2 = querySelector(container, "#m-container-box2");
      let change1 = querySelector(container, "#m-change-box1");
      let change2 = querySelector(container, "#m-change-box2");
      let select1 = querySelector(container, ".m-type-item-left .m-select-option-container #m-select-input-address");
      let select2 = querySelector(".m-type-item-left .m-select-input-container #m-select-input-select");
      let select1_box1 = querySelector(container, ".m-type-item-left #m-select-option");
      let select2_box2 = querySelector(container, ".m-type-item-left #m-select-input");
      addEventListener(change1, "click", () => {
        if (box1 && box2) {
          box1.classList.add("m-ani-left-is-close");
          box1.classList.remove("m-ani-left-is-active");
          box2.classList.add("m-ani-right-is-active");
          box2.classList.remove("m-ani-right-is-close");
        }
      });
      addEventListener(change2, "click", () => {
        if (box1 && box2) {
          box1.classList.add("m-ani-left-is-active");
          box1.classList.remove("m-ani-left-is-close");
          box2.classList.add("m-ani-right-is-close");
          box2.classList.remove("m-ani-right-is-active");
        }
      });
      addEventListener(select1, "click", () => {
        if (select1_box1 && select2_box2) {
          select1_box1.classList.remove("m-ani-left-is-active");
          select1_box1.classList.add("m-ani-left-is-close");
          select2_box2.classList.remove("m-ani-right-is-close");
          select2_box2.classList.add("m-ani-right-is-active");
        }
      });
      addEventListener(select2, "click", () => {
        if (select1_box1 && select2_box2) {
          select1_box1.classList.add("m-ani-left-is-active");
          select1_box1.classList.remove("m-ani-left-is-close");
          select2_box2.classList.add("m-ani-right-is-close");
          select2_box2.classList.remove("m-ani-right-is-active");
        }
      });
      log("动画初始化完毕！");
    }
    searchUserByRoomId(name, roomId, inputValue) {
      let that = this;
      if (name) {
        that.addUser(roomId, name);
        inputValue.value = "";
      } else {
        if (confirm(`房间号为${roomId}的主播不存在！确定添加？`)) {
          that.addUser(roomId, roomId);
          inputValue.value = "";
        }
      }
    }
    /**
     * 右侧操作按钮
     * @param text 指定按钮文本，默认是小虎牙或者是小鱼丸
     */
    createButton() {
      let that = this;
      let body = querySelector("body");
      if (!body) {
        error("获取不到 body ");
        return;
      }
      if (!!that.logo_btn) {
        warn("button已经添加了！不能重复添加！");
        return;
      }
      let text = this.button_name;
      const btn = createElement("button");
      btn.style.cursor = "pointer";
      btn.style.position = "fixed";
      btn.style.top = "300px";
      btn.style.right = "0px";
      btn.style.zIndex = 999999999999;
      let backgroundColor = "";
      if (that.btn_logo_svg !== "none") {
        btn.innerHTML = that.btn_logo_svg;
        btn.style.backgroundColor = "transparent";
      } else {
        backgroundColor = is_bilibili ? "255,102,102" : "255, 93, 35";
        btn.style.padding = "5px 10px";
        btn.style.backgroundColor = `rgb(${backgroundColor})`;
        btn.style.borderRadius = "20px";
        btn.style.fontSize = "12px";
        btn.style.color = "#fff";
        btn.textContent = text ? text : is_huya ? "小虎牙" : is_douyu ? "小鱼丸" : is_bilibili ? "小B" : "默认";
      }
      btn.style.border = "none";
      btn.style.outline = "none";
      addEventListener(btn, "click", function() {
        that.isShowContainer();
      });
      addEventListener(btn, "mouseenter", function() {
        btn.style.backgroundColor = `rgba(${backgroundColor},0.6)`;
      });
      let flag = false;
      let x, y;
      const mouse_key = that.key + "_mouse_key";
      let { mouse_left, mouse_top } = getLocalStore(mouse_key, Object.name);
      log(`获到Logo位置信息 ${mouse_left}px, ${mouse_top}px`);
      if (!isNaN(Number(mouse_left)) && !isNaN(Number(mouse_top))) {
        btn.style.left = mouse_left + "px";
        btn.style.top = mouse_top + "px";
        btn.style.right = "auto";
      }
      addEventListener(btn, "mousedown", (event) => {
        x = event.offsetX;
        y = event.offsetY;
        log("mouseDown", x, y);
        flag = true;
        addEventListener(wd, "mousemove", move);
      });
      addEventListener(btn, "mouseup", () => {
        flag = false;
        wd.removeEventListener("mousemove", move);
        wd.onmousemove = null;
      });
      addEventListener(btn, "mouseleave", () => {
        flag = false;
        btn.style.backgroundColor = `rgba(${backgroundColor},1)`;
        wd.removeEventListener("mousemove", move);
        wd.onmousemove = null;
      });
      function move(e) {
        e.preventDefault();
        if (!flag) {
          return;
        }
        let btn_top = Math.min(Math.max(0, e.clientY - y), window.innerHeight - btn.offsetHeight);
        let btn_left = Math.min(Math.max(0, e.clientX - x), window.innerWidth - btn.offsetWidth);
        btn.style.left = `${btn_left}px`;
        btn.style.top = `${btn_top}px`;
        btn.style.right = "auto";
        addLocalStore(mouse_key, { "mouse_left": btn_left, "mouse_top": btn_top }, Object.name);
      }
      btn.style.display = wls.getItem(that.btn_is_first_key) == null || getLocalStore(that.logo_show_key, Boolean.name) ? "block" : "none";
      that.logo_btn = btn;
      appendChild(body, that.logo_btn);
      log("button 添加完毕！");
    }
    /**
     * 该房间是否已改被删除
     * @param url 房间链接地址 默认 window.location.href
     */
    removeRoom(url = local_url) {
      try {
        if (!this.isRemove(url)) {
          return false;
        }
        this.roomIsNeedRemove();
        return true;
      } catch (error2) {
        return false;
      }
    }
    /**
     * 房间已被删除之后操作
     * @param url 房间链接地址 默认 window.location.href
     */
    roomAlreadyRemove() {
      let that = this;
      removeDOM(querySelector("body"), true);
      const h2 = createElement("h3");
      let html = querySelector("html");
      let body = querySelector("body") ?? createElement("body");
      body.style.display = "flex";
      body.style.flexDirection = "column";
      body.style.justifyContent = "center";
      body.style.alignItems = "center";
      handlerPromise(this.getRoomIdByUrl(local_url), (roomId) => {
        let name = this.getUser(roomId) ? this.getUser(roomId).name : "";
        const a = createElement("a");
        a.textContent = "点击解锁";
        a.style.display = "block";
        a.style.cursor = "pointer";
        a.style.fontSize = "20px";
        a.onclick = (e) => {
          e.preventDefault();
          that.userDelete(roomId);
          window.location.reload();
        };
        h2.style.fontSize = "36px";
        h2.textContent = `主播【${name}】已被你屏蔽`;
        let title = querySelector("title");
        if (!title) {
          title = createElement("title");
        }
        title.textContent = `主播【${name}】已被你屏蔽`;
        html.appendChild(body);
        body.appendChild(h2);
        body.appendChild(a);
        let logo_show = getLocalStore(that.logo_show_key, Boolean.name);
        if (logo_show) {
          let logo = createElement("a");
          logo.textContent = "显示logo";
          logo.style.display = "block";
          logo.style.cursor = "pointer";
          logo.style.fontSize = "20px";
          logo.onclick = (e) => {
            e.preventDefault();
            logo.style.display = "none";
            addLocalStore(that.logo_show_key, false, Boolean.name);
            that.createButton();
          };
          body.appendChild(logo);
        }
        removeDOM(this.m_container, true);
        this.m_container = null;
        this.create_container();
      });
      loopDo((timer) => {
        const pause = querySelector("#room-html5-player [class^=pause]");
        if (pause) {
          pause.click();
          clearInterval(timer);
        }
      }, 20, 1e3);
    }
    /**
     * 判断链接是否应该被删除
     * @param href 房间链接地址 默认 window.location.href
     */
    isRemove(href) {
      try {
        let res = this.getRoomIdByUrl(href);
        if (res instanceof Promise) {
          return false;
        }
        return this.userIsExist(res);
      } catch (error2) {
        return false;
      }
    }
    /**
     * 设置背景图
     * @param url 背景图地址 默认 是默认地址
     * @param container 修改背景容器 默认是body
     */
    settingBackgroundImage(url, container) {
      if (!support.supportBg()) {
        log("当前平台不支持背景");
        return;
      }
      if (!container) {
        container = querySelector("body");
      }
      if (local_url.indexOf("https://www.bilibili.com/list/") != -1)
        ;
      if (!container || !(container instanceof HTMLElement)) {
        warn("壁纸设置失败 获取不到 container ！");
        return;
      }
      if (isShowBg()) {
        url = !!url ? url : wls.getItem(this.bg_key) && isShowBg() ? wls.getItem(this.bg_key) : this.default_background_image;
        container.style.background = "none";
        container.style.backgroundSize = "cover";
        container.style.backgroundRepeat = "no-repeat ";
        container.style.backgroundAttachment = "fixed";
        container.style.backgroundImage = `url(${url})`;
        log("背景图添加完毕！");
      } else {
        container.style.backgroundImage = "none";
        log("背景图已关闭！");
      }
      cssUpdate();
    }
    /**
     * 通过房间名称或者id判断房间是否已经保存到本地
     * @param keywords 房间名或者id
     * @param list 本地缓存数据，默认是本地缓存用户数据
     */
    userIsExist(keywords, list = this.users) {
      return !!this.getUser(keywords, list);
    }
    /**
     * 通过房间名称或者id判断房间是否已经保存到本地
     * @param keywords 房间名或者id
     * @param list 本地缓存数据，默认是本地缓存用户数据
     */
    getUser(keywords, list = this.users) {
      if (!keywords) {
        return null;
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].name && list[i].name === keywords || list[i].roomId && list[i].roomId === keywords) {
          return list[i];
        }
      }
      return null;
    }
    /**
     * 通过房间id或者房间名删除本地缓存的数据
     * @param keywords 房间名或者id
     */
    userDelete(keywords) {
      let that = this;
      if (!isArray(that.users)) {
        return;
      }
      that.users.forEach((item, index) => {
        if (keywords === item.name || keywords === item.roomId) {
          that.users.splice(index, 1);
        }
      });
      addLocalStore(this.key, this.users);
    }
    /**
     * 添加并保存直播间
     * @param id, 房间id
     * @param name 房间名
     */
    addUser(id, name) {
      if (!id || !name || id == "null" || name == "null") {
        return;
      }
      if (this.userIsExist(id) || this.userIsExist(name)) {
        alert("该房间已存在！");
        return;
      }
      if (!isArray(this.users)) {
        this.users = [];
      }
      const newUser = new HostUser(id, name);
      this.users.unshift(newUser);
      addLocalStore(this.key, this.users);
      this.resetTbody(this.users);
      handlerPromise(this.getRoomIdByUrl(local_url), (res) => {
        if (id === res) {
          this.roomIsNeedRemove(local_url);
        }
      });
    }
    /**
     * @param selector video
     */
    roomIsNeedRemove(selector = querySelector("video")) {
      this.roomAlreadyRemove();
      removeVideo(selector);
      this.settingBackgroundImage();
    }
    /*
     * 操作左侧导航栏，需要传入选择器，和修改值 建议放到公共方法下执行！
     * @param {selector}  = [选择器]
     * @param {value}  = [要修改的值]
     */
    getLeftMenu(value = false) {
      let menu = querySelector(this.menu);
      if (!menu) {
        return alert("获取不到导航菜单，操作失败！");
      }
      handlerDisplay(menu, value);
      addLocalStore(this.menu_show_key, value, Boolean.name, false);
    }
    /*
     * 操作左侧导航栏，需要传入选择器，和修改值 建议放到公共方法下执行！
     */
    isShowLeftMenu() {
      let menu = this.menu ? querySelector(this.menu) : "";
      const isShow = wls.getItem(this.menu_is_first_key) != null && getLocalStore(this.menu_show_key, Boolean.name);
      handlerDisplay(menu, isShow);
    }
    /**
     * 检查是否能找到全屏按钮
     * @returns
     */
    checkFullScreenButton() {
      if (this.full_screen_is_find) {
        this.full_screen_button = findButton(this.video_player_container, this.full_screen_class_or_id, this.full_screen_text, this.full_button_tag_name);
      }
    }
    /**
     * 自动全屏
     * @param isClickFull 是否是通过点击方式触发
     */
    isFullScreen(isClickFull = false) {
      let that = this;
      let is_should_full_screen = getLocalStore(that.full_screen_key, Boolean.name);
      if (!is_should_full_screen) {
        return;
      }
      let button = null;
      if (isClickFull) {
        button = querySelector(that.full_screen_button);
        if (button && button instanceof HTMLElement) {
          button.click();
          that.isShowContainer();
        } else {
          that.checkFullScreenButton(button);
        }
      } else {
        loopDo((timer) => {
          button = querySelector(that.full_screen_button);
          if (button && button instanceof HTMLElement) {
            let isClick = button == null ? void 0 : button.isClick;
            if (isClick) {
              clearInterval(timer);
              return;
            }
            if (!isClick) {
              log("全屏按钮自动触发了!");
              button.click();
              button.isClick = true;
            }
          } else {
            that.checkFullScreenButton(button);
          }
        }, 30, 3e3);
      }
    }
    /**
     * 是否显示礼物
     */
    isShowGift() {
      let gift = this.gift_tool ? querySelector(this.gift_tool) : "";
      handlerDisplay(gift, wls.getItem(this.gift_is_first_key) != null && getLocalStore(this.gift_key, Boolean.name));
    }
    /**
     * 是否显示容器
     */
    isShowContainer() {
      if (this.m_container && this.m_container instanceof HTMLElement) {
        if (this.is_new) {
          if (this.m_container.classList.contains("m-container-is-active")) {
            this.m_container.classList.remove("m-container-is-active");
          } else {
            this.m_container.classList.add("m-container-is-active");
          }
        } else {
          this.m_container.style.display = this.m_container.style.display === "block" ? "none" : "block";
        }
        log("container class=>", this.m_container.classList);
      }
    }
    /**
     *  点击 直播平台 Logo
     */
    clickLogoShowContainer() {
      let that = this;
      if (is_bilibili) {
        return;
      }
      if (this.header_logo === "none" || !this.header_logo) {
        warn("Logo选择器不能为 none ！");
        return;
      }
      findMark(that.header_logo, (a) => {
        a.href = "javascript:;void(0)";
        a.title = "点击Logo,显示插件配置";
        if (!a.mark) {
          a.mark = true;
          addEventListener(a, "click", (e) => {
            e.preventDefault();
            that.isShowContainer();
          });
          log("logo点击按钮装置完毕！");
        }
      }, 5, 500);
    }
    addEven() {
      const that = this;
      addFullScreenEvent(() => {
        that.isShowGift();
      });
      document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.altKey && event.key === "j") {
          that.isShowContainer();
        }
      });
      const core_room = querySelector(this.video_room_selector);
      addEventListener(core_room, "mouseover", (event) => {
        const gift = querySelector(this.gift_tool);
        if (gift instanceof HTMLElement) {
          gift.classList.add("m-container-display-block");
          gift.style.display = "block";
        }
      });
      addEventListener(core_room, "mouseout", (event) => {
        const gift = querySelector(this.gift_tool);
        if (gift instanceof HTMLElement) {
          gift.classList.remove("m-container-display-block");
          gift.style.display = "none";
        }
      });
      const showMessage = (bool) => !bool ? "YES" : "NO";
      if (is_huya) {
        log("================================================================");
        log("是否显示系统消息 : ", showMessage(isShowSysMsg()));
        log("是否显示粉丝排行 : ", showMessage(isShowGiftRank()));
        log("是否显示粉丝徽章 : ", showMessage(isShowFansIcon()));
        log("================================================================");
      }
      _GM_registerMenuCommand(`功能面板💎`, () => {
        that.isShowContainer();
      }, { title: "点击显示或者关闭插件菜单,默认关闭，也可以使用 Ctrl + alt + j 查看" });
    }
    autoSeletMax() {
      (function() {
        let _first_tip_max_video_key_ = "_first_tip_max_video_key_";
        let maxVideo = wls.getItem("is_first_auto_max_pro_key") === null ? true : getLocalStore("auto_max_pro_key", Boolean.name);
        log(maxVideo ? "自动最高画质" : "不是最高画质");
        let lastAlertTime = 0;
        const alertCooldown = 1e3;
        let clickMAX = false;
        setInterval(() => {
          try {
            const targetElement = document.querySelectorAll(".player-videotype-list li");
            if (targetElement) {
              targetElement.forEach((element) => {
                try {
                  var isFlag = false;
                  if ($(element).data("data").status !== 9) {
                    $(element).data("data").status = 9;
                    isFlag = true;
                  }
                  if (isFlag) {
                    const now = Date.now();
                    if (now - lastAlertTime > alertCooldown) {
                      if (!getLocalStore(_first_tip_max_video_key_, Boolean.name, false)) {
                        alert("成功解锁扫码限制！请选择自己需要的最高画质 后续该消息不再提示");
                      }
                      addLocalStore(_first_tip_max_video_key_, true, Boolean.name);
                      log("成功解锁扫码限制！");
                      lastAlertTime = now;
                      if (!maxVideo)
                        return;
                      setTimeout(() => {
                        let items = querySelectorAll(".player-videoline-videotype .player-videotype-list li");
                        let item = items.length > 1 ? items[1] : items[0];
                        if (!clickMAX && item) {
                          clickMAX = true;
                          item = item.querySelector("span");
                          item.click();
                        }
                      }, 2e3);
                    }
                  }
                } catch (e) {
                }
              });
            }
          } catch (error2) {
          }
        }, 500);
        const intervalId = setInterval(() => {
          const targetNode = document.querySelector(".player-videotype-list");
          if (targetNode) {
            clearInterval(intervalId);
            observeListChanges(targetNode);
          }
        }, 500);
        function observeListChanges(targetNode) {
          const config = { childList: true, subtree: false };
          const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
              if (mutation.type === "childList") {
                const list = document.querySelector(".player-videotype-list");
                const items = list.querySelectorAll("li");
                if (items.length > 0) {
                  if (list.querySelector('li[data-cloned="true"]')) {
                    return;
                  }
                  const firstLiClone = items[0].cloneNode(true);
                  firstLiClone.setAttribute("data-cloned", "true");
                  firstLiClone.classList.remove("on");
                  firstLiClone.classList.add("on");
                  firstLiClone.setAttribute("style", "display: none !important;");
                  list.insertBefore(firstLiClone, list.firstChild);
                }
              }
            });
          });
          observer.observe(targetNode, config);
        }
      })();
    }
  }
  class TriggerLive extends LivePlugin {
    constructor() {
      super();
      this.video_player_container = ".room-player-wrap";
      this.full_screen_button = ".room-player-wrap .player-fullscreen-btn";
      this.full_button_tag_name = "span";
      this.full_screen_is_find = false;
      this.default_background_image = "https://livewebbs2.msstatic.com/huya_1682329462_content.jpg";
      this.baseUrl = "https://www.huya.com/";
      this.menu = ".mod-sidebar";
      this.header_logo = "#duya-header #duya-header-logo a";
      this.gift_tool = ".room-core #player-gift-wrap";
      this.video_room_selector = "#J_playerMain";
      this.auto_max_pro_class_or_id_list = ".player-videoline-videotype .player-videotype-list li";
      this.init();
    }
    // 首页操作
    index() {
      if (local_url === this.baseUrl || /https:\/\/.*\.huya\.*\/\?/.test(local_url)) {
        removeVideo(".mod-index-main video");
        const banner_close = querySelector(".mod-index-wrap #banner i");
        if (banner_close) {
          banner_close.click();
        }
        this.removeRoomByClickRoomName();
        this.updateHeaderIcon();
      }
    }
    // 分类页操作
    category() {
      let that = this;
      if (new RegExp(/^https:\/\/.*\.huya\.((com)|(cn))\/g(\/.*)$/).test(local_url)) {
        this.removeRoomByClickRoomName();
        Array.from(querySelectorAll(".live-list-nav dd")).forEach((node) => {
          addEventListener(node, "click", () => {
            that.removeRoomByClickRoomName();
          });
        });
      }
    }
    // 公共部分操作
    common() {
      this.autoHideMenu();
    }
    // 头部logo显示不明显问题
    updateHeaderIcon() {
      try {
        querySelector("#duya-header-logo .hy-hd-logo-1").src = "https://a.msstatic.com/huya/main3/static/img/logo.png";
        querySelector("class^=NavItem] [class^=NavItemHd] i[class*=fav]").style.backgroundImage = "url(https://a.msstatic.com/huya/hd/h5/header/components/HeaderDynamic/NavItem/img/fav-0.15b3e0b4a39185db705b7c523cd3f17c.png)";
        querySelector("[class^=NavItem] [class^=NavItemHd] i[class*=history]").style.backgroundImage = "url(https://a.msstatic.com/huya/hd/h5/header/components/HeaderDynamic/NavItem/img/history-0.2b32fba04f79057de5abcb2b35cd8eec.png)";
      } catch (error2) {
      }
    }
    // 详情操作
    detail() {
      let that = this;
      if (!new RegExp(/^https:\/\/www\.huya\.com(\/\w+)$/).test(local_url)) {
        return;
      }
      findMark(".host-name", (hostName) => {
        hostName.title = `点击屏蔽主播【${hostName == null ? void 0 : hostName.textContent}】🧹`;
        addEventListener(hostName, "click", () => {
          if (confirm(`确认屏蔽主播【${hostName == null ? void 0 : hostName.textContent}】？`)) {
            that.addUser(that.getRoomIdByUrl(local_url), hostName.textContent);
          }
        });
      });
      this.isFullScreen();
      this.autoSeletMax();
      findMark("#J-room-chat-shield", (item) => {
        if (item.className.indexOf("shield-on") === -1) {
          item.click();
          log("自动点击了弹幕礼物显示工具");
        }
      }, 5, 1e3);
      setTimeout(() => {
        this.autoHideMenu();
      }, 1e4);
      setTimeout(() => {
        log("remove dom ....");
      }, 3e3);
    }
    // 通过地址获取房间号
    getRoomIdByUrl(url = local_url) {
      url = decodeURIComponent(url);
      try {
        let m = url.match(/https?:\/\/www\.huya\.com\/(\S+)\?&/);
        if (Array.isArray(m) && m.length > 1) {
          return m[1];
        }
        return url.replace("https://www.huya.com/", "");
      } catch (error2) {
        warn("url 匹配失败 请检查" + url);
        return "";
      }
    }
    // 通过房间号查找名称
    getNameByRoomId(roomId) {
      let that = this;
      let hostName = querySelector(".host-name");
      if (!hostName) {
        warn(`获取不到hostname`);
        return "";
      }
      const rooms = querySelectorAll(".game-live-item");
      if (!isArray(rooms)) {
        return "";
      }
      for (let room of rooms) {
        const a = querySelector(room, "a");
        if (a && a.href) {
          const id = that.getRoomIdByUrl(a.getAttribute("data-url"));
          const user = querySelector(room, ".txt i");
          if (id === roomId) {
            hostName = user;
          }
        }
      }
      return (hostName == null ? void 0 : hostName.textContent) || "";
    }
    // 通过点击直播间名称删除直播间
    removeRoomByClickRoomName() {
      const that = this;
      const addClick = () => {
        Array.from(querySelectorAll(".game-live-item:not([mark=true])")).forEach((li) => {
          if (!(li instanceof HTMLElement) || li.mark) {
            return;
          }
          const a = querySelector(li, "a");
          if (!a) {
            return;
          }
          const roomId = that.getRoomIdByUrl(a.getAttribute("data-url"));
          const user = querySelector(li, ".txt .nick");
          const name = (user == null ? void 0 : user.textContent) || "";
          if (!roomId || !user || !name)
            return;
          user.title = `点击屏蔽主播【${name}】 🧹`;
          li.mark = true;
          if (that.userIsExist(roomId) || that.userIsExist(name)) {
            removeDOM(li, true);
            return;
          }
          user.mark = "true";
          addEventListener(user, "click", () => {
            that.addUser(roomId, name);
            removeDOM(li, true);
          });
        });
      };
      addClick();
      loopDo(() => {
        addClick();
      }, 5, 5e3);
    }
    autoHideMenu() {
      const isShow = wls.getItem(this.menu_is_first_key) != null && getLocalStore(this.menu_show_key, Boolean.name);
      log("是否显示菜单", isShow ? "显示" : " 不显示");
      if (isShow) {
        return;
      }
      loopDo((timer) => {
        const b = querySelector("body");
        const clickM = querySelector("#sidebar-hide-btn");
        if (b instanceof HTMLElement && clickM instanceof HTMLElement) {
          if (!b.classList.contains("sidebar-min")) {
            clickM.click();
            log("左侧侧边栏自动收起！");
          }
          clearInterval(timer);
        }
      }, 10, 2e3);
    }
  }
  const getInfo = async (roomId = local_url) => {
    if (douyu_address_pattern.test(roomId)) {
      roomId = FishLive.prototype.getRoomIdByUrl(roomId);
    }
    return await fetch(`https://www.douyu.com/betard/${roomId}`, {
      mode: "cors",
      cache: "default",
      method: "GET"
    }).then((res) => res.json());
  };
  class FishLive extends LivePlugin {
    constructor() {
      super();
      this.video_player_container = "#room-html5-player";
      this.baseUrl = "https://www.douyu.com/";
      this.default_background_image = "https://sta-op.douyucdn.cn/dylamr/2022/11/07/1e10382d9a430b4a04245e5427e892c8.jpg";
      this.menu = "#js-aside";
      this.full_screen_button = "[class^=controlbar] [class^=fs]";
      this.gift_tool = ".layout-Player-main #js-player-toolbar";
      this.video_room_selector = "#js-player-video-above";
      this.header_logo = "#js-header .Header-left .Header-logo";
      this.auto_max_pro_class_or_id_list = "#js-player-video .room-Player-Box [class^=rate] ul>li";
      this.is_use_click_event = false;
      this.init();
    }
    // 公共部分页面操作
    common() {
      this.autoHideMenu();
    }
    //首页操作
    index() {
      let that = this;
      if (local_url.indexOf("https://www.douyu.com/topic") != -1) {
        return;
      }
      if (local_url.indexOf("https://www.douyu.com/home/beta") != -1 && !(local_url === that.baseUrl || new RegExp(/https:\/\/www\.douyu\.com\/\?.*/).test(local_url))) {
        return;
      }
      window.scroll(0, 0);
      findMark(".layout-Section.layout-Slide-banner", (a) => {
        a.href = "javascript:;void(0)";
        addEventListener(a, "click", (e) => e.preventDefault());
      }, 10, 1e3);
      loopDo((timer) => {
        const pause = querySelector("#room-html5-player #__controlbar [class^=pause]");
        if (pause) {
          pause.click();
          clearInterval(timer);
        }
      }, 5, 1e3);
      let topBtn = querySelector(".layout-Main .ToTopBtn");
      if (topBtn) {
        topBtn.style.display = "block";
      }
      function runIndex() {
        console.log("window index run ...");
        Array.from(querySelectorAll("li.layout-List-item")).forEach((li) => {
          const user = querySelector(li, ".DyCover-user");
          const a = querySelector(li, ".DyCover");
          if (!a) {
            return;
          }
          const name = (user == null ? void 0 : user.textContent) || "";
          if (that.isRemove(a == null ? void 0 : a.href) || that.userIsExist(name)) {
            removeDOM(li);
            return;
          }
          if (li.mark) {
            return;
          }
          addEventListener(user, "click", (e) => {
            e.preventDefault();
            that.addUser(that.getRoomIdByUrl(a == null ? void 0 : a.href), name);
            removeDOM(li);
          });
          li.mark = true;
        });
      }
      if (this.is_use_click_event) {
        runIndex();
        window.onscroll = throttle(1e3, runIndex);
      }
    }
    // 分类页面操作
    category() {
      let that = this;
      if (!new RegExp(/https:\/\/www.douyu.com(\/((directory.*)|(g_.*)))$/).test(local_url)) {
        return;
      }
      Array.from(querySelectorAll(".layout-Module-filter .layout-Module-label")).forEach((label) => {
        addEventListener(label, "click", (e) => {
          e.preventDefault();
          let to_link = label && label.href ? label.href : null;
          if (to_link) {
            window.location.href = to_link;
          } else {
            window.location.href = "https://www.douyu.com/g_" + local_url.match(RegExp(
              /subCate\/.*/g
            ))[0].replace("subCate", "").match(new RegExp(
              /\w+/g
            ))[0];
          }
        });
      });
      function runCategory() {
        Array.from(querySelectorAll(".layout-Cover-item")).forEach((li) => {
          if (li.mark) {
            return;
          }
          const link = querySelector(li, ".DyListCover-wrap");
          if (!link) {
            return;
          }
          link.setAttribute("href", "javascript:;void(0)");
          const user = querySelector(link, ".DyListCover-userName");
          const name = (user == null ? void 0 : user.textContent) || "";
          if (!name)
            return;
          const roomId = that.getRoomIdByUrl(link == null ? void 0 : link.href);
          if (that.isRemove(roomId) || that.userIsExist(name)) {
            removeDOM(li, true);
          } else {
            if (!user.mark && roomId && name) {
              user.mark = "mark";
              link.title = `点击移除主播:${name}`;
              addEventListener(user, "click", (e) => {
                e.preventDefault();
                that.addUser(roomId, name);
                removeDOM(li);
              });
            }
          }
          addEventListener(li, "mouseenter", () => {
            const a = querySelector(li, ".DyListCover-wrap.is-hover");
            if (!a) {
              return;
            }
            const user2 = querySelector(a, ".DyListCover-userName");
            if (!(user2 == null ? void 0 : user2.textContent))
              return;
            const id = that.getRoomIdByUrl(a.href);
            if (!user2 || !roomId || user2.mark) {
              return;
            }
            a.title = `点击移除主播:${user2.textContent}`;
            addEventListener(a, "click", (e) => {
              e.preventDefault();
            });
            addEventListener(user2, "click", (e) => {
              e.preventDefault();
              if (id && (user2 == null ? void 0 : user2.textContent)) {
                removeDOM(li);
                that.addUser(id, user2.textContent);
              }
            });
            user2.mark = "is-mark";
          });
          li.mark = "mark";
        });
      }
      if (this.is_use_click_event) {
        runCategory();
        window.addEventListener("scroll", throttle(1e3, runCategory));
      }
    }
    // 详情页操作
    detail() {
      let that = this;
      if (!new RegExp(/.*douyu.*(\/((.*rid=\d+)|(\d+)).*)$/).test(local_url)) {
        return;
      }
      findMark(".Title-roomInfo h2.Title-anchorNameH2", (hostName) => {
        hostName.title = `点击屏蔽主播【${hostName == null ? void 0 : hostName.textContent}】`;
        addEventListener(hostName, "click", () => {
          that.addUser(that.getRoomIdByUrl(local_url), hostName.textContent);
        });
      });
      loopDo((timer) => {
        let closeBtn = querySelector(".roomSmallPlayerFloatLayout-closeBtn");
        if (closeBtn && !(closeBtn == null ? void 0 : closeBtn.mark)) {
          closeBtn.click();
          window.clearInterval(timer);
          closeBtn.mark = true;
        }
      }, 5, 2e3);
      if (new RegExp(/.*douyu.*\/topic(\/(.*rid=\d+).*)/).test(local_url)) {
        let backgroundNones = [".wm-general-wrapper.bc-wrapper.bc-wrapper-player", ".wm-general-bgblur"];
        Array.from(querySelectorAll("#root>div")).forEach((element) => {
          if (!!querySelector(element, ".layout-Main")) {
            backgroundNone(element, backgroundNones);
          } else {
            removeDOM(element, true);
          }
        });
      }
      if (new RegExp(/.*douyu.*(\/(\d+)).*/).test(local_url)) {
        removeDOM(".layout-Main .ToTopBtn", true);
      }
      const ritghtADs = [
        ".side-top-uspension-box",
        ".js-player-asideTopSuspension"
      ];
      intervalRemoveElement(ritghtADs, 500, 30);
      this.isFullScreen();
      if (this.is_use_click_event) {
        this.isAutoMaxVideoPro();
      }
      findMark(".ChatToolBar .ShieldTool-enter .ShieldTool-listItem", (item) => {
        if (item.className.indexOf("is-noChecked") !== -1) {
          item.click();
          log("自动点击了弹幕礼物显示工具");
        }
      }, 1, 5e3);
    }
    // 通过房间号获取直播间name
    async getNameByRoomId(keywords) {
      var _a;
      let that = this;
      let searchResult = await getInfo(keywords);
      if ((searchResult == null ? void 0 : searchResult.room) && ((_a = searchResult == null ? void 0 : searchResult.room) == null ? void 0 : _a.nickname)) {
        log(`搜索到主播 ${searchResult.room.nickname}`);
        return searchResult.room.nickname;
      }
      let hostName = querySelector(".Title-blockInline .Title-anchorName h2");
      if (!hostName) {
        Array.from(querySelectorAll(".layout-List-item")).forEach((room) => {
          const id = that.getRoomIdByUrl(querySelector(room, "a").href);
          const user = querySelector(room, ".DyCover-user");
          if (id === keywords) {
            hostName = user;
          }
        });
        if (!hostName) {
          Array.from(querySelectorAll(".layout-Cover-item")).forEach((room) => {
            const id = that.getRoomIdByUrl(querySelector(room, "a").href);
            const user = querySelector(room, ".DyListCover-userName");
            if (id === keywords) {
              hostName = user;
            }
          });
        }
      }
      return (hostName == null ? void 0 : hostName.textContent) || "";
    }
    // 通过房间地址获取房间号
    getRoomIdByUrl(url = local_url) {
      try {
        if (new RegExp(/.*rid=(\d+).*/).test(url)) {
          return url.match(new RegExp(/rid=(\d+)/))[1];
        }
        if (/https:\/\/www\.douyu\.com\/(\d+).*/.test(url)) {
          return url.match(new RegExp(/https:\/\/www\.douyu\.com\/(\d+)/))[1];
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    isFullScreen() {
    }
    autoHideMenu() {
      const isShow = wls.getItem(this.menu_is_first_key) != null && getLocalStore(this.menu_show_key, Boolean.name);
      if (isShow) {
        return;
      }
      loopDo((timer) => {
        const clickM = querySelector(".Aside-toggle");
        const leftSider = querySelector("#js-aside");
        if (leftSider instanceof HTMLElement && clickM instanceof HTMLElement) {
          const leftSiderWidth = Number(window.getComputedStyle(leftSider).width.split("px")[0]);
          if (leftSiderWidth > 80) {
            clickM.click();
            log("左侧侧边栏自动收起！");
          }
          window.clearInterval(timer);
        }
      }, 10, 1e3);
    }
  }
  class BiliBili extends LivePlugin {
    constructor() {
      super();
      this.header_logo = ".bili-header .bili-header__bar ul>li>a";
      this.video_player_container = "#bilibili-player";
      this.fullScreenText = "进入全屏 (f)";
      this.full_screen_is_find = false;
      this.full_screen_button = ".bpx-player-ctrl-btn.bpx-player-ctrl-full";
      this.default_background_image = "https://s1.hdslb.com/bfs/static/blive/blfe-message-web/static/img/infocenterbg.a1a0d152.jpg";
      this.auto_max_pro_class_or_id_list = ".bpx-player-ctrl-btn.bpx-player-ctrl-quality .bpx-player-ctrl-quality-menu>.bpx-player-ctrl-quality-menu-item";
      this.init();
    }
    /**
     * 重写 button
     * @returns
     */
    createButton() {
      let that = this;
      let isShowLogo = () => wls.getItem(that.btn_is_first_key) === null ? true : getLocalStore(that.logo_show_key, Boolean.name);
      loopDo(() => {
        if (!!that.logo_btn) {
          return;
        }
        let buttonBoxs = querySelector(".palette-button-wrap .storage-box .storable-items");
        let btn = createElement("div");
        btn.className = "m-bilibili-btn";
        btn.style.fontSize = "16px";
        if (!buttonBoxs) {
          buttonBoxs = document.querySelector("body");
          btn = createElement("div");
          btn.style.display = "none";
          btn.className = "m-bilibili-btn";
          btn.style.cursor = "pointer";
          btn.style.position = "fixed";
          btn.style.bottom = "220px";
          btn.style.right = "6px";
          btn.style.display = "none";
          btn.style.zIndex = 9999999;
          window.onscroll = () => {
            if (window.scrollY >= 530 && isShowLogo()) {
              btn.style.display = "block";
            } else {
              btn.style.display = "none";
            }
          };
        }
        btn.title = "点击显示";
        btn.innerHTML = iconLogo();
        that.logo_btn = btn;
        addEventListener(btn, "click", function() {
          that.isShowContainer();
        });
        insertChild(buttonBoxs, that.logo_btn);
      }, 20, 500);
    }
    async getRoomIdByUrl(href) {
      var _a, _b;
      try {
        if (isBVId(href)) {
          let result = await getBiliBiliInfoByVideoID(local_url);
          if (result.code === 0 && ((_a = result == null ? void 0 : result.owner) == null ? void 0 : _a.mid)) {
            return (_b = result == null ? void 0 : result.owner) == null ? void 0 : _b.mid;
          }
        }
        if (isUserId(href)) {
          return href.match(/https:\/\/space\.bilibili\.com\/(\d+).*/)[1];
        }
      } catch (error2) {
      }
      return this.getBilibiliRoomId(href);
    }
    getBilibiliRoomId(href) {
      return !!href && href.replace(/https:\/\/.*\.bilibili.com\/(.*?)/, "$1").replace(/\//ig, "");
    }
    // 添加删除按钮
    addDeleteRoomButton(time = 1e3) {
      let that = this;
      const scan = () => {
        const scanVideo = (sc = true) => {
          Array.from(querySelectorAll(".feed-card")).forEach((feed) => {
            var _a, _b;
            const isMark = !!querySelector(feed, ".m-span-text");
            if (feed.querySelector(".bili-video-card__info--ad")) {
              removeDOM(feed);
              return;
            }
            if (feed.ok && isMark && sc) {
              return;
            }
            let item = querySelector(feed, "div.bili-video-card__info--bottom");
            const name = (_a = querySelector(item, "span.bili-video-card__info--author")) == null ? void 0 : _a.textContent;
            const href = (_b = querySelector(item, ".bili-video-card__info--owner")) == null ? void 0 : _b.href;
            const id = that.getBilibiliRoomId(href);
            if (!name || !id)
              return;
            if (!isMark) {
              createSpan(feed, item, id, name);
            }
            if (this.userIsExist(id) || this.userIsExist(name)) {
              removeDOM(feed, true);
              return;
            }
            feed.ok = true;
          });
          Array.from(querySelectorAll(".bili-video-card")).forEach((feed) => {
            var _a, _b, _c, _d;
            const isMark = !!querySelector(feed, ".m-span-text");
            if (feed.querySelector(".bili-video-card__info--ad")) {
              removeDOM(feed);
              return;
            }
            if (feed.ok && isMark && sc) {
              return;
            }
            let item = querySelector(feed, ".bili-video-card__info--bottom");
            let isLive = false;
            if (!item) {
              isLive = true;
              item = querySelector(feed, ".bili-live-card__info--text");
            }
            const name = !isLive ? (_a = querySelector(item, "span.bili-video-card__info--author")) == null ? void 0 : _a.textContent : (_b = querySelector(item, "a.bili-live-card__info--uname span")) == null ? void 0 : _b.textContent;
            const href = !isLive ? (_c = querySelector(item, ".bili-video-card__info--owner")) == null ? void 0 : _c.href : (_d = querySelector(item, "a.bili-live-card__info--uname")) == null ? void 0 : _d.href;
            const id = this.getBilibiliRoomId(href);
            if (!name || !id)
              return;
            if (!isMark) {
              createSpan(feed, item, id, name);
            }
            if (this.userIsExist(name) || this.userIsExist(id)) {
              removeDOM(feed, true);
            }
            feed.ok = true;
          });
        };
        const createSpan = (container, place, id, name = id, message = "确认屏蔽up主 ", remove = true) => {
          if (!container || !place || !id || !name) {
            return;
          }
          if (!!container.querySelector(".m-span-text")) {
            return;
          }
          const span = createElement("span");
          span.classList = "m-span-text";
          addEventListener(span, "click", (e) => {
            e.preventDefault();
            if (remove) {
              removeDOM(container, true);
            }
            that.addUser(id, name);
            scanVideo(false);
          });
          appendChild(place, span);
        };
        loopDo(() => {
          scanVideo();
        }, 10, 500);
      };
      scan();
      window.addEventListener("scroll", throttle(500, scan));
      findMark(".feed-roll-btn .roll-btn", (btn) => {
        addEventListener(btn, "click", () => {
          scan();
        });
      });
    }
    clickLogoShowContainer() {
      let that = this;
      super.clickLogoShowContainer();
      window.addEventListener("scroll", () => {
        if (parseInt(window.scrollY) > 90) {
          operationLogo();
        } else {
          super.clickLogoShowContainer();
        }
      });
      const operationLogo = () => {
        if (!(wls.getItem(that.btn_is_first_key) == null || getLocalStore(that.logo_show_key, Boolean.name))) {
          return;
        }
      };
    }
    common() {
      this.addDeleteRoomButton();
    }
    index() {
    }
    detailLeftVideoList(sel = ".card-box") {
      console.log("querySelectorAll('.video-page-card-small')>>>>>>>");
      const scanVideoList = (sc) => {
        Array.from(querySelectorAll(sel)).forEach((videoDom) => {
          var _a;
          if (videoDom.querySelector(".bili-video-card__info--ad")) {
            removeDOM(videoDom);
            return;
          }
          const isMark = !!videoDom.getAttribute("mark");
          const isAdd = !!videoDom.querySelector(".m-span-text");
          if (isMark && isAdd && !sc) {
            return;
          }
          videoDom.setAttribute("mark", true);
          const playinfo = querySelector(videoDom, ".playinfo");
          let link = querySelector(videoDom, ".upname") ?? querySelector(videoDom, ".upname a");
          const id = !!link && (link == null ? void 0 : link.href) && this.getBilibiliRoomId(link.href);
          const name = (_a = querySelector(videoDom, ".upname .name")) == null ? void 0 : _a.textContent;
          if (this.userIsExist(id) || this.userIsExist(name)) {
            removeDOM(videoDom, true);
            log("up主", name, "已经被移除！UUID=>", id);
          } else if (!isMark) {
            const span = createElement("span");
            span.classList = "m-span-text";
            addEventListener(span, "click", () => {
              this.addUser(id, name);
              scanVideoList(true);
            });
            appendChild(playinfo, span);
          }
        });
      };
      setTimeout(() => {
        scanVideoList(false);
        let button = querySelector(".rec-footer");
        addEventListener(button, "click", () => {
          scanVideoList(false);
        });
      }, 5e3);
    }
    async detail() {
      if (!/https:\/\/www\.bilibili\.com\/[video|list]/.test(local_url)) {
        return;
      }
      this.rightMenuVideoOperation();
      this.isFullScreen();
      this.isAutoMaxVideoPro();
    }
    async getNameByRoomId(keywords) {
      var _a, _b, _c;
      if (isBVId(keywords)) {
        let result = await getBiliBiliInfoByVideoID(keywords);
        if (result && (result == null ? void 0 : result.code) === 0) {
          return (_b = (_a = result == null ? void 0 : result.data) == null ? void 0 : _a.owner) == null ? void 0 : _b.name;
        }
      } else if (isUserId(keywords)) {
        let result = await getBiliBiliInfoByUserId(keywords);
        if (result && (result == null ? void 0 : result.code) === 0) {
          return (_c = result == null ? void 0 : result.data) == null ? void 0 : _c.name;
        }
      } else {
        warn(" getNameByRoomId can not find result ！");
        return null;
      }
    }
    settingBackgroundImage(url, container) {
      if (local_url.indexOf("https://www.bilibili.com/?") != -1 || local_url === "https://www.bilibili.com/" || local_url === "https://www.bilibili.com") {
        container = querySelector("#i_cecream");
      }
      if (local_url.indexOf("https://www.bilibili.com/video") != -1) {
        container = querySelector("#app");
      }
      super.settingBackgroundImage(url, container);
    }
    rightMenuVideoOperation() {
      let that = this;
      const right_container_key = "__right_container_key__";
      const right_video_list_reco_list_key = "__right_video_list_reco_list_key__";
      let right_video_list_container = querySelector(".right-container") ?? querySelector(".playlist-container--right");
      let show = wls.getItem(right_container_key) != "false";
      if (right_video_list_container) {
        right_video_list_container.style.display = show ? "" : "none";
      }
      let show_video = false;
      function scanVideoList() {
        that.detailLeftVideoList();
        that.detailLeftVideoList(".video-page-operator-card-small");
      }
      let addCommand = false;
      console.log("[class^=recommend-list]!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", document.querySelector("[class^=recommend-list]"));
      findMark(["#reco_list", "[class^=recommend-list]", "[class^=recommend-list-container]"], (element) => {
        let right_video_list_reco_list = element;
        if (addCommand)
          return;
        if (right_video_list_reco_list) {
          show_video = wls.getItem(right_video_list_reco_list_key) != "false";
          log("默认是否显示video ？ ", show_video, "默认是否显示right menu ？ ", show);
          right_video_list_reco_list.style.display = show_video ? "" : "none";
          _GM_registerMenuCommand(`右侧面板👔`, () => {
            show = !show;
            wls.setItem(right_container_key, show);
            scanVideoList();
            right_video_list_container.style.display = show ? "" : "none";
          }, { title: "如果你认为右侧视频推荐不想看，点我关闭,默认开启" });
          _GM_registerMenuCommand(`视频推荐🎬`, () => {
            log("click 视频推荐🎬");
            if (!show && !show_video) {
              show = !show;
              wls.setItem(right_container_key, show);
              right_video_list_container.style.display = show ? "" : "none";
            }
            show_video = !show_video;
            scanVideoList();
            wls.setItem(right_video_list_reco_list_key, show_video);
            right_video_list_reco_list.style.display = show_video ? "" : "none";
          }, { title: "如果你认为右侧视频推荐不想看，点我关闭,默认开启" });
          addCommand = true;
        }
      }, 20, 2e3);
      scanVideoList();
    }
  }
  class DouYin extends LivePlugin {
    constructor() {
      super();
      this.header_logo = "#root .N_HNXA04 .HQwsRJFy a";
      this.full_screen_class_or_id = ".xgplayer-page-full-screen .xgplayer-icon";
      this.full_button_tag_name = "div";
      this.full_screen_text = "进入全屏";
      this.full_cancel_text = "退出全屏";
      this.auto_max_pro_class_or_id_list = "#slidelist .gear .virtual>.item";
      this.init();
    }
    removeRoomByClickRoomName() {
      this.notSupport();
    }
    getNameByRoomId(roomId) {
      return this.notSupport();
    }
    getRoomIdByUrl(url) {
      return this.notSupport();
    }
    notSupport() {
      log("抖音暂时不支持该操作！");
      return null;
    }
    common() {
      this.isFullScreen();
      this.isAutoMaxVideoPro();
    }
  }
  const login$1 = () => {
    const addStyle2 = (str) => {
      const head = document.querySelector("head");
      const s = document.createElement("style");
      s.innerHTML = str;
      head.appendChild(s);
    };
    const login_box = "login-box";
    const login_btn = "login-btn";
    const cancel_btn = "cancel-btn";
    const localUrl = window.location.href;
    const huyaLogin = () => /https?:\/\/.*\.huya\.com\/.*/.test(localUrl);
    const douyinLogin = () => /https?:\/\/.*\.douyin\.com\/.*/.test(localUrl);
    const hy = [{
      [login_box]: "#HUYA-UDBSdkLgn",
      [login_btn]: "[class^=HeaderDynamic] [class^=Login] [class^=LoginHd] span",
      [cancel_btn]: "#UDBSdkLgn-box .close-layer"
    }];
    const douyin = [{
      [login_box]: "[id^=login-full-panel]",
      [login_btn]: "#_7hLtYmO>button",
      [cancel_btn]: ".dy-account-close"
    }, {
      [login_box]: "[id^=login-full-panel]",
      [login_btn]: "#tcTjz3nj",
      [cancel_btn]: ".dy-account-close"
    }];
    let LOGIN_BOX = [];
    const addLoginCancel = (loginSelector, loginBtnCancel) => {
      let loginContainer = document.querySelector(loginSelector);
      if (!(loginContainer instanceof HTMLElement)) {
        return;
      }
      if (loginContainer.classList.contains("m-display-block")) {
        loginContainer.classList.remove("m-display-block");
      }
      console.log("login cancel 扫描中...");
      let timer = setInterval(() => {
        let closeBtn = loginContainer.querySelector(loginBtnCancel);
        if (closeBtn && closeBtn.mark) {
          clearInterval(timer);
          return;
        }
        if (closeBtn && !closeBtn.mark) {
          console.log("cancel button 已经找到了", closeBtn);
          closeBtn.mark = true;
          closeBtn.addEventListener("click", () => {
            console.log("click me!", loginContainer);
          });
        }
      }, 1e3);
    };
    const handlerLogin = (loginSelector, loginBtnSelector, loginBtnCancel) => {
      let loginContainer = null;
      let timer = setInterval(() => {
        loginContainer = document.querySelector(loginSelector);
        if (!loginContainer) {
          return;
        }
        if (loginContainer.mark) {
          clearInterval(timer);
          return;
        }
        loginContainer.mark = true;
        if (loginContainer && !loginContainer.classList.contains("m-display-none")) {
          loginContainer.classList.add("m-display-none");
        }
      }, 100);
      let timer1 = setInterval(() => {
        const btn = document.querySelector(loginBtnSelector);
        if (btn && btn.mark) {
          clearInterval(timer1);
          return;
        }
        if (btn && !btn.mark) {
          btn.mark = true;
          btn.addEventListener("click", () => {
            loginContainer = document.querySelector(loginSelector);
            if (loginContainer) {
              if (loginContainer.classList.contains("m-display-none")) {
                loginContainer.classList.remove("m-display-none");
                if (!loginContainer.classList.contains("m-display-block")) {
                  loginContainer.classList.add("m-display-block");
                }
                addLoginCancel(loginSelector, loginBtnCancel);
              } else {
                if (loginContainer.classList.contains("m-display-block")) {
                  loginContainer.classList.remove("m-display-block");
                }
                if (!loginContainer.classList.contains("m-display-none")) {
                  loginContainer.classList.add("m-display-none");
                }
              }
            }
            console.log("click me login !", loginContainer);
          });
        }
      }, 100);
    };
    const initbox = () => {
      if (huyaLogin()) {
        LOGIN_BOX = [...hy];
      } else if (douyinLogin()) {
        LOGIN_BOX = [...douyin];
      } else
        ;
      LOGIN_BOX.forEach((item) => {
        handlerLogin(item[login_box], item[login_btn], item[cancel_btn]);
      });
    };
    initbox();
    const loginCss = `
  .m-display-block {
      display:block !important;
  }
  .m-display-none {
      display:none !important;
  }
`;
    addStyle2(loginCss);
  };
  const reload = () => {
    window.location.reload();
  };
  const changeRank = () => {
    addLocalStore(isShowGiftRankKey, !isShowGiftRank(), Boolean.name);
    reload();
  };
  const changeFansIcon = () => {
    addLocalStore(isShowFansIconKey, !isShowFansIcon(), Boolean.name);
    reload();
  };
  const changeSysMsg = () => {
    addLocalStore(isShowSysMsgKey, !isShowSysMsg(), Boolean.name);
    reload();
  };
  const changeColorDm = () => {
    addLocalStore(isShowColorDmKey, !isShowColorDm(), Boolean.name);
    reload();
  };
  const douyuCommand = () => {
    if (!is_douyu) {
      return;
    }
    _GM_registerMenuCommand(`${isShowPk() ? "显示" : "关闭"} pk 条📣`, () => {
      addLocalStore(isShowPkKey, !isShowPk(), Boolean.name);
    }, { title: "关闭或者显示PK条,默认关闭" });
  };
  const huyaCommand = () => {
    if (!is_huya) {
      return;
    }
    _GM_registerMenuCommand(`${isShowMatchContent() ? "关闭" : "显示"} 赛事数据🏆`, () => {
      addLocalStore(isShowMatchContentKey, !isShowMatchContent(), Boolean.name);
      reload();
    }, { title: "关闭或显示顶部大页图，默认关闭" });
    _GM_registerMenuCommand(`${isShowMainRoom() ? "关闭" : "显示"}顶部其他房间⛺`, () => {
      addLocalStore(isMainRoom, !isShowMainRoom(), Boolean.name);
      reload();
    }, { title: "关闭或显示顶部连接的其他房间，默认关闭" });
    _GM_registerMenuCommand(`${isShowSysMsg() ? "关闭" : "显示"}系统消息📣`, () => {
      changeSysMsg();
    }, { title: "关闭或显示房管操作或主播等操作信息,默认关闭" });
    _GM_registerMenuCommand(`${isShowGiftRank() ? "关闭" : "显示"}礼物排行榜🧧`, () => {
      changeRank();
    }, { title: "关闭或显示礼物排行，默认关闭" });
    _GM_registerMenuCommand(`${isShowFansIcon() ? "关闭" : "显示"}粉丝徽章🎫`, () => {
      changeFansIcon();
    }, { title: "关闭或显示粉丝徽章，默认关闭" });
    _GM_registerMenuCommand(`${isShowColorDm() ? "关闭" : "显示"}彩色弹幕🎈`, () => {
      changeColorDm();
    }, { title: "关闭或显示彩色弹幕，默认关闭 仅在黑夜模式下生效" });
  };
  const bilibiliCommand = () => {
    if (!is_bilibili)
      return;
    _GM_registerMenuCommand(`${isShowHotSearch() ? "关闭" : "开启"}热搜🍳`, () => {
      addLocalStore(isShowHotSearchKey, !isShowHotSearch(), Boolean.name);
      reload();
    }, { title: "如果不想看到热搜请点击，默认开启" });
    if (local_url.indexOf("https://live.bilibili.com/") != -1)
      ;
  };
  const installCommand = () => {
    log("install command ...");
    _GM_registerMenuCommand(`${isAutoPlugin() ? "关闭😵" : "启用🤣"} 插件`, () => {
      addLocalStore(isAutoPluginkey, !isAutoPlugin(), Boolean.name);
      window.location.reload();
    }, { title: "如果不想在该网址使用插件请点击这里😀" });
    if (!isAutoPlugin()) {
      return;
    }
    huyaCommand();
    bilibiliCommand();
    douyuCommand();
  };
  const isDouyuDetail = () => /.*douyu.*(\/((.*rid=\d+)|(\d+)).*)$/.test(local_url);
  const isCreate = () => local_url.indexOf("https://www.douyu.com/creator") !== -1;
  const dataLayoutItmeDarkCss = local_url.indexOf("https://www.douyu.com/g_wzry") != -1 ? `` : `.dark .layout-Cover-item{
  background-color: var(--w-bg-darker) !important;
  border:1px solid var(--w-text) !important;
  color: var(--w-text-light) !important;
}
`;
  const createDark = isCreate() ? `
  .dark * {
    background-color: var(--w-bg-darker) !important;
    border-color: var(--w-text) !important;
    color: var(--w-text-light) !important;
  }
  
  ` : ``;
  const loadingLazy = isDouyuDetail() ? `` : `
.dark .LazyLoad{
  background: var(--w-bg-dark) !important;
}
`;
  const darkCss$1 = `
${createDark}
${loadingLazy}
${dataLayoutItmeDarkCss}
.dark .DyCover-pic,
.dark .Search-backTop {
  background: var(--w-bg-dark) !important;
}


.dark  .Horn4Category-popWrap 
 {
  background: var(--w-bg) !important;
  background-image:none !important;
  border:1px solid var(--w-text-light) !important;
}


.dark .header__PRovh .Header-wrap.is-darkMode,
.dark [class^=header] .Header-wrap.is-darkMode,
.dark .Barrage-FansHome-letter,
.dark .DyLiveCover-wrap,.dark .DyLiveRecord-wrap,
.dark .DyHistoryCover-wrap,
.dark .layout-Module--aside.AnchorRank .layout-Module-container,
.dark .layout-Section.layout-Header,
.dark .layout-Slide-bannerInner,.dark .FKLiWrap,
.dark .layout-Module-head.is-fixed,
.dark .layout-List-item,.dark .layout-List-item .DyCover,
.dark .Header-wrap,.dark .AnchorRank-more,
.dark .Elevator,.dark .Elevator-item,.dark .Elevator-item.is-active>span::before,.dark .public-DropMenu-drop,
.dark .GiftInfoPanel-brief,
.dark .Header-menu-wrap,.dark .DyListCover-wrap,
.dark .layout-Module-label--hasList.is-active, .dark .layout-Module-label,
.dark .ListFooter .dy-Pagination-next, .dark .ListFooter .dy-Pagination-prev,
.dark .ListFooter .dy-Pagination .dy-Pagination-item,.dark .ListFooter .dy-Pagination .dy-Pagination-item-active,.dark .ListFooter .ListFooter-btn-wrap,
.dark .layout-Player-title,.dark .layout-Player-aside,
.dark .layout-Player-asideMain,.dark .layout-Player-barrage,.dark .layout-Player-toolbar,
.dark .Barrage-listItem,.dark .Barrage-EntranceIntroduce, .dark .Barrage-roomVip--super,
.dark .DiamondsFansBarrage, .dark #js-floatingbarrage-container li, .dark #js-fansflating-barrage,
.dark .Barrage-EntranceIntroduce-Anchor, .dark .Barrage-EntranceIntroduce-Goodgame, .dark .FollowGuide,
.dark .BarrageBuffer,.dark .Title-anchorName-HC,
.dark .Barrage-FansHome-content,.dark .Barrage-FansHome,
.dark .ChatSend-txt,.dark .layout-Classify-card,.dark .cate2TagB-item,
.dark .PlayerToolbar-signCont,.dark .dy-Modal-content,.dark .CustomGroupCommon .dy-Modal-title,
.dark .CustomGroupManager-title,.dark .FilterKeywords,
.dark .Barrage-toolbarClear .Barrage-toolbarText,.dark .Barrage-toolbarLock:hover .Barrage-toolbarText,
.dark .dy-ModalRadius-content, .dark .categoryTab-item, .dark customizeModal-submit, .dark .customizeModal-cancel, .dark .search-ipt,
.dark .addedCategory-item, .dark .Search, .dark .Header-wrap.is-start .Search, .dark .Search-historyList>li, .dark .Search-text,
.dark .ListHeader-hero-header,.dark .layout-Module-label--hasList,.dark .ListHeader-pop,.dark .layout-Module-filter-more,
.dark .Barrage-toolbarClear, .dark .Barrage-toolbarLock,.dark .AssembleExpressHeader-head, .dark .Emotion, .dark .ShieldTool-list,.dark .BarrageTips,
.dark .BarrageTips .BarrageTips--active,.dark .FansMedalDialog-normal, .dark .ChatBarrageCollect .ChatBarrageCollect-tip,.dark .AssembleExpressHeader,
.dark .TagItem,.dark .ChatBarrageCollectPop , .dark .Horn4Category-popWrap,.dark .Horn4Category-inputor,.dark .ChatFansBarragePop,
.dark .PopularBarrage .PopularBarragePanel-foot, .dark .PopularBarrage .PopularBarragePanelStyle, .dark .BarrageWordPanel-card,
.dark .BarrageWordPanel-btn,.dark .BarrageWordPanel-header h2,.dark .BarrageWordPanel-header,.dark .CustomGroupManager-saveBtn,
.dark .DyRecCover-wrap,.dark .CustomGroupCommon .dy-Modal-header,.dark .CustomGroupCommon .dy-Modal-close-x,
.dark .CustomGroupCommon .dy-Modal-close,.dark .CustomGroupCommon,.dark .dy-Modal-close,.dark .dy-Modal-header,
.dark .dy-Modal-footer button,.dark .FilterSwitchStatus-switch,.dark .LevelFilKeyTab .tab.active,.dark .LevelFilterLimit,
.dark .BarrageFilter-fkbutton, .dark .FilterKeywords-edit-input, .dark .LevelFilterLimit-input,.dark .LevelFilKeyTab,
.dark .Search-recommend:hover,.dark [class^=index-listWrap],
.dark .layout-Card-horizon,.dark .layout-Tab-container .layout-Tab-item.is-active,.dark .layout-Tab-container .layout-Tab-item,
.dark .SearchChannel-item,.dark SearchChannel-item-detail,.dark .layout-Tab-container.is-fixed,
.dark .layout-Player-chat,.dark .AnchorRank-item,
.dark .layout-Player-chat *,.dark .EmotionList.EmotionDiamondsPanel .EmotionList-con,
.dark #js-EmotionDiamondsPanel,
.dark #js-footer
{
  background-color: var(--w-bg-darker) !important;
  color: var(--w-text-light) !important;
}




.dark .Elevator-item.is-active>span,
.dark .Elevator-item:nth-child(odd)
 {
  background-color: rgba(var(--w-bg-darker),0.7) !important;
}

.dark [class^=favoriteTitle],
.dark .DyHistoryCover,
.dark .DyHistoryCover-intro,
.dark .DyHistoryCover-user,
.dark .SearchAnchorVideo-title,
.dark .dy-ModalRadius-header, .dark .addedCategory-count,
.dark .RoomList .layout-Module-title, .dark .RoomList .layout-Module-title a,.dark layout-Module-title span,
.dark .AnchorRank .layout-Module-title,.dark  .AnchorRank .layout-Module-title a,
.dark .DyCover-intro,.dark .DyCover-user,.dark .DyCover-zone,.dark a, .dark .layout-Module-title a,
.dark .DyRecCover-zone,.dark .DyRecCover-intro,.dark .DyRecCover-userName,.dark .DyRecCover-tag,
.dark .DropMenuList-name, .dark .ListHeader-title,
.dark .layout-Module-label--hasList.is-active, .dark .layout-Module-label.is-active,
.dark .DyListCover-intro,.dark .DyListCover-zone,.dark .DyListCover-hot,.dark .DyListCover-userName,
.dark .ListFooter .dy-Pagination .dy-Pagination-item-active a,
.dark .ListFooter .dy-Pagination .dy-Pagination-item,
.dark .ListFooter .dy-Pagination .dy-Pagination-item-active,
.dark .ListFooter .ListFooter-btn-input,.dark .ListFooter-btn,.dark .ListFooter-btn-label,
.dark .Title-header,.dark .Title-report,.dark .Title-anchorName,
.dark .Barrage-main .Barrage-content,.dark .Barrage-roomVip--super,
.dark .PlayerToolbar span,.dark .Title-followNum, .dark .PlayerToolbar-signCont,
.dark .Barrage-EntranceIntroduce-Anchor, .dark .Barrage-EntranceIntroduce-Goodgame ,.dark .Barrage-EntranceIntroduce-Content,
.dark .SwipeTabsContent .tabItem ,.dark .layout-Classify-card>strong ,.dark .secondCateCard-hot,
.dark .layout-Classify-card.secondCateCard,.dark .layout-Classify-card.secondCateCard.secondCateCark-hoverCard,.dark .HoverCark-wrap,
.dark .PlayerToolbar-signCont .RoomText-list .SignBaseComponent-text-link,.dark .customizeModal-title>h3,.dark .Search-label, .dark .Search-historyList>li,
.dark .Search-hotList li,.dark .Search-linkIcon svg,.dark .categoryTab-tab,.dark .ListHeader-hero-content-tag,
.dark .Barrage-toolbarClear, .dark .Barrage-toolbarLock,.dark .Barrage-toolbarText,.dark .ShieldTool-listItem,.dark .BarrageTips,.dark .ChatBarrageCollectPop-title,
.dark .FansBarrageColor-item-txt,.dark .ChatFansBarragePop-txt,
.dark .PopularBarrage .PopularBarragePanel-descFansPrivilege,
.dark .PopularBarrage .PopularBarragePanel-descFansRenew,
.dark .PopularBarrage .PopularBarragePanel-descLock,.dark .dy-Modal-close,
.dark .ChatFansBarragePop-diamondsTxt,.dark .BarrageWordPanel-example,.dark .BarrageWordPanel-feedbackTips,
.dark .BarrageWordPanel-block h3,.dark .BarrageWordPanel-reward,.dark .BarrageWordPanel-tips,
.dark .CustomGroupManager-title strong,.dark .CustomGroupManager-groupItem,.dark .CustomGroupManager-checkItem>span,
.dark .CustomGroupManager,.dark .LevelFilKeyTab .tab, .dark .layout-Result,
.dark .FKNokeywords-title, .dark .Search-recommend-info p,.dark .layout-Module-title,
.dark .Search-keyword, .dark .Search-anchor.is-horizon .Search-anchor-info .Search-anchor-recommendTitle,
.dark .Search-anchor .Search-anchor-info .Search-anchor-recommendTitle,.dark SearchAnchorVideo-title,
.dark .Search-anchor-info h1,.dark .Search-anchor-info h2,.dark .Search-anchor-info h3,.dark .Search-anchor-info h4,.dark .Search-anchor-info h5,.dark .Search-anchor-info h6,
.dark .DropPaneList-live.is-live,.dark .Search-category h3,.dark .Search-category p,.dark .Search-category p span,
.dark .FilterKeywords-allText, .dark .FilterKeywords-intelligentText,
.dark .SearchChannel-item-detail-name,.dark .SearchChannel-item-detail-name span,
.dark .SearchChannel-item-detail-desc.SearchChannel-item-detail-isCate,.dark .SearchChannel-item-detail-desc.SearchChannel-item-detail-isCate span,
.dark .Search-yuba .des .name,.dark .layout-Search-input>input,.dark .FKLiWrap:hover,
.dark .TreasureInfo-desc
{
  color: var(--w-text-light) !important;
}


.dark .Search-recommend-info h3,.dark .Search-feedback-section,.dark .Search-feedback-section,
.dark .Header-menu-link.active a:hover,
.dark .RoomList .layout-Module-title:hover,
.dark .RoomList .layout-Module-title a:hover,
.dark .DyCover-intro:hover,
.dark .DyCover-user:hover,
.dark .DyCover-zone:hover,
.dark a:hover,
.dark .FilterSwitchStatus h3,
.dark .FilterSwitchStatus-status,
.dark .layout-Module-title a:hover,
.dark .DropMenuList-name:hover,
.dark .ListHeader-title,
.dark .layout-Module-label--hasList.is-active:hover, 
.dark .layout-Module-label.is-active:hover,
.dark .ListFooter .dy-Pagination .dy-Pagination-item-active a:hover,
.dark .ListFooter .dy-Pagination .dy-Pagination-item:hover,
.dark .ListFooter .dy-Pagination .dy-Pagination-item-active:hover,
.dark .Title-anchorName:hover,.dark .Title-row-icon,.dark .Title-row-text,
.dark .SwipeTabsContent .tabItem:hover,.dark .SwipeTabsContent .tabItem.active,
.dark .layout-Classify-card>strong:hover,.dark .secondCateCard-hot:hover,
.dark .Barrage-toolbarClear:hover, .dark .Barrage-toolbarLock:hover,
.dark .ShieldTool-listItem.is-checked .ShieldTool-checkText,.dark .BarrageTips .BarrageTips--active,
.dark .ChatFansBarragePop-txt span,.dark .dark .ChatFansBarragePop-diamondsTxt span,.dark .ChatFansBarragePop-diamondsTxt span,
.dark .PopularBarrage .PopularBarragePanel-descFansPrivilege:hover,
.dark .PopularBarrage .PopularBarragePanel-descFansRenew:hover,.dark .DropPaneList-name,.dark .DropPaneList-title,
.dark .PopularBarrage .PopularBarragePanel-descLock:hover,.dark .DropPaneList span,
.dark .Search-content-title, .dark .Search-default-title, .dark .Search-history-title, .dark .Search-hot-title,
.dark .FilKeyTab .tab.active,.dark Search-anchor-data,.dark .Search-anchor.is-horizon .Search-anchor-info p,
.dark .Search-anchor .Search-anchor-info,.dark Search-anchor-cate,.dark .Search-anchor-info,
.dark .Search-anchor-info h4.is-official,.dark .Search-anchor-info h3.is-official,.dark .Search-anchor-info h2.is-official,.dark .Search-anchor-info .is-official
{
  color: var(--w-text) !important;
}



.dark .Title-followBtnBox,
.dark .dark .CustomGroupManager-saveBtn,.dark .CustomGroupCommon .dy-Modal-header,
.dark .Search-historyList>li,.dark .layout-List-item,.dark .DyListCover-wrap,
.dark .ListFooter .dy-Pagination-item,.dark .ListFooter .dy-Pagination-next,.dark .ListFooter .dy-Pagination-prev,
.dark .ListFooter .dy-Pagination .dy-Pagination-item,.dark .ListFooter .dy-Pagination .dy-Pagination-item-active,
.dark .layout-Player-aside,.dark .layout-Player-asideMain, .dark .layout-Player-barrage,
.dark .PopularBarrage .PopularBarragePanel-foot,.dark .BarrageWordPanel-card,.dark .BarrageWordPanel-btn,
.dark .dy-Modal-footer button,.dark .LevelFilterLimit-input,
.dark .layout-Classify-card, .dark customizeModal-submit,.dark .layout-Menu, 
.dark .layout-Player-asideMain, .layout-Player-toolbar,
.dark .customizeModal-cancel,.dark .ChatBarrageCollect .ChatBarrageCollect-tip
{
  border: 1px solid var(--w-border) !important;
}




.dark .Header-wrap,.dark .layout-Player-title,
.dark .ChatSend-txt,
.dark .public-DropMenu-drop-main:before,.dark .Search-anchor-avatar,
.dark .categoryTab-head,.dark .ListHeader-hero-header,.dark .ListHeader-hero-content-icon,
.dark .EmotionTab,.dark .ChatFansBarragePop-describe,.dark .FansMedalPanel-container,
.dark .LevelFilterLimit,.dark .FKNokeywords-title
{
  border-color:var(--w-border) !important;
}




.dark .layout-Module-label--hasList.is-active, 
.dark .layout-Module-label,

.dark .ListFooter .ListFooter-btn-wrap,
.dark .cate2TagB-item,
.dark .PlayerToolbar-signCont .RoomText-list .SignBaseComponent-text-link,
.dark .categoryTab-item,.dark .Header-wrap.is-start .Search ,.dark .addedCategory-item .dark .search-ipt,
.dark .layout-Module-filter-more,.dark .Barrage-toolbarClear, .dark .Barrage-toolbarLock,
.dark .ShieldTool-list,.dark .BarrageTips,.dark .ChatBarrageCollect .ChatBarrageCollect-tip:hover,
.dark .AssembleExpressHeader,.dark .TagItem,
.dark .dy-Modal-footer button:hover,.dark .FilterSwitchStatus-switch,
.dark .BarrageWordPanel-btn,.dark .LevelFilterLimit-input:focus,
.dark .BarrageFilter-fkbutton, .dark .FilterKeywords-edit-input, .dark .LevelFilterLimit-input,
.dark .FilterKeywords-edit-input:focus, .dark .LevelFilterLimit-input:focus,
.dark .MatchSystemChatFansBarragePop-describe
{
  border: 1px solid var(--w-text-light) !important;
}


.dark .layout-Module-label--hasList.is-active:hover, 
.dark .layout-Module-label:hover,
.dark .categoryTab-item:hover,
.dark .addedCategory-item:hover,
.dark .Barrage-toolbarClear:hover, .dark .Barrage-toolbarLock:hover,
.dark .ChatBarrageCollect .ChatBarrageCollect-tip:hover,
.dark .BarrageWordPanel-btn:hover
{
  border: 1px solid var(--w-text) !important;
}


.dark .Barrage-roomVip--super,
.dark .Barrage {
  border: none !important;
}


.dark [class^=cardTagContainer],
.dark .Search-direct,.dark .DropMenuList-linkAll,
.dark .DyCover,.dark .Search-yuba,
.dark .layout-Card-history, .dark .layout-Card-rank,
.dark .Search-input-pane,.dark .DyListCover.HeaderCell,
.dark .ListRecommend-refresh,.dark .ListHeader-pop-label,
.dark layout-Module-label,.dark .Search-default-item,
.dark .Search-recommend .Search-direct,.dark Search-category,
.dark .layout-Search-input,.dark .layout-Search-btn,
.dark .Search-feedback-textarea,.dark .VideoCollectionMix .layout-videoCollection-item,
.dark .categoryBoxB-editB .edit,.dark .layout-Nav-backTop,.dark .ChatSend-button,
.dark .MuteStatus.is-noLogin,.dark .FansMedalEnter-enterName,
.dark .FansBarrageSwitcher[class*=color],.dark .BarrageWord-fkbutton .fkbutton-icon,
.dark .PopularBarrage .PopularBarrageBtn,.dark .EnergyBarrageIcon,
.dark .ActiviesExpandPanel,.dark .GiftExpandPanel,.dark .GiftInfoPanel-cont,
.dark .BatchGiveForm-num,.dark .TreasureTips,.dark .FKLiWra,
.dark .MatchSystemChatFansBarragePop,.dark .TagItem,.dark .Category-item,
.dark .Header-search-wrap .Search,
.dark .Search-direct {
  background-color: var(--w-bg-darker) !important;
  border:1px solid var(--w-text) !important;
  color: var(--w-text-light) !important;
}




.dark .Title-anchorName-HC .Title-anchorName-block:hover,
.dark .DyCover:hover,.dark .layout-Search-btn:hover,
.dark .ChatSend-button:hover,.dark .DropMenuList-linkAll:hover,
.dark .dark Search-category:hover,.dark .categoryBoxB-editB .edit:hover,
.dark .Search-default-item:hover,.dark .Search-recommend .Search-direct:hover,
.dark .Category-item:hover,.dark .ListRecommend-refresh:hover,
.dark .Search-direct:hover,.dark .ListHeader-pop-label:hover,
.dark .Search-topicRecommend:hover,.dark layout-Module-label:hover,
.dark .Search-direct:hover,.dark .TagItem:hover,
.dark .Search-recommend:hover {
  background-color: var(--w-bg) !important;
  border:1px solid var(--w-text-light) !important;
  color: var(--w-text) !important;
}


.dark .dy-ModalRadius-footer button,
.dark .layout-Tab-item,.dark .dy-ModalRadius-close,
.dark .DropPaneList>a{
  background-color: var(--w-bg-darker) !important;
  border: none !important;
  color: var(--w-text-light) !important;
}


.dark .dy-ModalRadius-close:hover,.dy-ModalRadius-footer button:hover,
.dark .layout-Tab-item.is-active,.dark .layout-Tab-item:hover,
.dark .Search-rank-wrapper:hover .Search-rank,
.dark .YubaMessage-link:hover,
.dark .layout-Tab-item:hover,
.dark .Search-hotList li:hover,
.dark .DropPaneList>a:hover {
  background-color: var(--w-bg) !important;
  color: var(--w-text) !important;
}


.dark .HoverCard-wrap,
.dark .DropPaneList .HistoryList,
.dark .Header-history-tab.is-active,
.dark .Header-history-tab,
.dark .Header-follow-tab.is-active,
.dark .Header-follow-tab,
.dark .DropPane-linkAll,
.dark .CustomGroupMenu-wrapper,
.dark .Title-followBtn {
  background: var(--w-bg-darker) !important;
  border:1px solid var(--w-border) !important;
  color: var(--w-text-light) !important;
}

.dark .Header-history-tab.is-active,
.dark .Header-history-tab:hover,
.dark .Header-follow-tab.is-active,
.dark .Header-follow-tab:hover,
.dark .Title-followBtn:hover {
  background: var(--w-bg) !important;
}



/* new home */
.dark .header__PRovh .Header-wrap.is-darkMode,
.dark [class^=desc],
.dark [class^=cateHead],
.dark [class^=elevatorItem],
.dark [class^=layoutMain] [class^=block],
.dark [class^=elevatorHolder] {
  background: var(--w-bg-darker) !important;
  color: var(--w-text) !important;
}


.dark [class^=goTop]  {
  background-color: var(--w-bg-darker) !important;
  background-image: url('https://shark2.douyucdn.cn/front-publish/douyu-web-master/_next/static/media/goTop_hover.1133fe37.png') !important;
}

.dark #header-search-input {
     background: transparent !important;
}




`;
  const headerDarkCss = `
.layout-Section.layout-Header {
  background-color:#000  !important;
}
`;
  const pk = !isShowPk() ? `` : `
     

.MorePk {
  display:none !important;
}
  
  `;
  const css$4 = is_douyu ? `

.layout-List-item .DyCover-content .DyCover-user,.layout-Cover-item .DyListCover-userName,.Title-blockInline .Title-anchorName h2{
  cursor:pointer !important;
}
.layout-List-item .DyCover-content .DyCover-user:hover,.layout-Cover-item .DyListCover-userName:hover,.Title-blockInline .Title-anchorName h2:hover {
  color:rgb(255, 135, 0) !important;
}

.layout-Search-btn {
  width:55px !important;
}

.aside-top-uspension-box,
.js-player-asideTopSuspension,
[class*=aside-top-uspension],
#js-room-top-banner,
[class^=elevatorHolder] [class^=elevatorItem]:not(:last-child),
[class^=recommendCategoryContainer],
.DiamondsFansLanternBarrage,
.Barrage-newAuth.js-new-auth,
.Title-roomInfo .Title-followIcon,
#js-player-toolbar .RoomText-wrap,
.PkView,.SysSign-Ad,
.layout-Section.layout-Slide,
.Header-broadcast-wrap,
#lazyModule3,
#lazyModule4,
#lazyModule5,
#lazyModule6,
#lazyModule7,
#lazyModule8,
#lazyModule23,
#lazyModule24,
#js-room-activity,
#js-right-nav,
#js-bottom,
#js-header .Header .HeaderNav,
#js-header .Header .HeaderGif-left,
#js-header .Header .HeaderGif-right,
.Header-download-wrap,
.AnchorInterToolsUser,
.RechangeJulyPopups,
li.Header-menu-link,
.layout-Main .layout-Customize,
.HeaderCell-label-wrap,
.Title-AnchorLevel,.RoomVipSysTitle,
.Aside-nav .Aside-nav-item,
.Title-roomInfo .Title-row,
#player-marvel-controller+div,
.layout-Player-main .GuessGameMiniPanelB-wrapper,
#js-player-asideMain #layout-Player-aside .FirePower,
.layout-Player-video .layout-Player-videoAbove .ChargeTask-closeBg,
#bc4-bgblur,.Search-ad,
.SignBaseComponent-sign-ad, 
.SignBaseComponent-sign-ad .LazyLoad,
.list-Banner-adv,
.Baby-image.is-achievement,
.multiBitRate-da4b60{
  display:none !important;
}


li.Header-menu-link:nth-child(1),
li.Header-menu-link:nth-child(2),
li.Header-menu-link:nth-child(3),
.Aside-nav .Aside-nav-item:nth-child(1)
{
  display:inline-block !important;
}

.LiveRoomDianzan,
.SupremeRightIconJSX,.AnchorLevel,
.Barrage-main  .UserLevel,
.Barrage-main  .js-user-level,
.Barrage-main  .Barrage-icon,
.Barrage-main  .Motor,
.Barrage-main  .Motor-flag,
.Barrage-main  .Barrage-hiIcon,
.Barrage-main  .UserGameDataMedal,
.Barrage-main  .ChatAchievement,
.Barrage-main  .Barrage-notice,
.layout-Player .layout-Player-announce,
.layout-Player .layout-Player-rank,
.MatchSystemTeamMedal,
#js-player-video .ScreenBannerAd,
.layout-Main #layout-Player-aside .BarrageSuspendedBallAd,
.layout-Main #layout-Player-aside .SignBarrage,
#js-player-video-case .VRTips~div,
.layout-Main .Title-roomInfo .Title-row,
.layout-Main .ToTopBtn,
.Header-right .public-DropMenu-drop .DropPane-ad,
.Header-right .CloudGameLink,
.Header-menu-wrap .DropMenuList-ad,
.public-DropMenu-drop-main div.Header-UserPane-top~div,
#js-player-dialog .LiveRoomLoopVideo,
.Header-search-wrap .Search  label,
.RedEnvelopAd.RedEnvelopAdMouseDisable,
.Barrage .Barrage-userEnter{
display:none !important;
}

/* 一般禁用模式 */
.layout-Player-main #js-player-toolbar{
display:block;
}
#root div.layout-Main{
  margin-top:70px !important;
  display:block !important;
  width:auto !important;
  max-width:auto !important;
}
#root>div,
#root>div .wm-general-bgblur
{
background-image:none !important;
}

.Title-roomInfo .Title-row:nth-child(1),
.Title-roomInfo .Title-row:nth-child(2) {
 display:block !important;
}

 .layout-Player-main .Title-roomInfo .is-normal .Title-blockInline,
 .layout-Player-main .Title-roomInfo .is-normal:nth-child(2)

  {
  display:none !important;
}

.layout-Player-main .Title-roomInfo .is-normal .Title-blockInline:nth-child(0),
.layout-Player-main .Title-roomInfo .is-normal .Title-blockInline:nth-child(1),
.layout-Player-main .Title-roomInfo .is-normal .Title-blockInline:nth-child(2)
 {
  display:inline-block !important;
 }

.Barrage-main .Barrage-content {
color:#333 !important;
}
.Barrage-main .Barrage-nickName{
color:#2b94ff !important;
}
.Barrage-listItem{
color: #333 !important;
background-color: #f2f5f6 !important;
}

.Header-search-wrap input#header-search-input::placeholder {
   color: transparent !important;
   opacity:0 !important;
}

#js-aside,
.layout-Player-main #js-player-toolbar {
   display:none;
}
.js-noblefloating-barragecont {
  background: none !important;
  border: none !important;
}


#js-barrage-container .Barrage-main>div>div {
  margin-bottom: -20px !important;
}

.ChatSpeak .ChatBarrageCollect-tip {
  width:auto !important;
}

.Title-followBtnBox {
  white-space: inherit !important;
}

.Header-follow-tabs,
.Header-history-tabs {
  display:flex  !important;
  justify-content: center  !important;
}

.dark #js-player-title {
  background-image:none !important;
}




${pk}
${headerDarkCss}
${darkCss$1}


` : "";
  const dark_dm_color = () => isShowColorDm() ? "" : `

.dark #danmuwrap span {
  color: var(--w-text-light) !important;
}
`;
  const darkCss = `
.dark .chat-room__list .msg-bubble .colon,
.dark .chat-room__list .msg-bubble .msg,
.dark .chat-room__list .msg-bubble
{
  background:none !important;
}


${dark_dm_color()}


.dark .room-core {
  background : transparent !important;
}


/* 修改背景和字体颜色 */
.dark [class^=chat-popup-layer] [class^=uc-status],
.dark #J_roomWeeklyRankListRoot [class^=UserRankInfo],
.dark #J_roomWeeklyRankListRoot [class^=NobleApp],
.dark #J_roomWeeklyRankListRoot [class^=seat-item],
.dark #J_roomWeeklyRankListRoot [class^=userRank],
.dark .room-weeklyRankList-nav-item,
.dark .room-weeklyRankList-nav-item.room-weeklyRankList-nav-item-active,
.dark #J_roomWeeklyRankListRoot [class^=Item],
.dark #J_roomWeeklyRankListRoot [class^=item],
.dark [class^=room-weeklyRankList-skeleton],
.dark #J_roomWeeklyRankListRoot [class^=rank-item],
.dark #J_roomWeeklyRankListRoot [class^=SlideDownView],
.dark input,
.dark input:focus,
.dark textarea,
.dark textarea:focus,
.dark .hy-header-style-normal .duya-header-wrap,
.dark .duya-header,
.dark .duya-header .duya-header-bd,
.dark #J_liveListNav dl dd [class^=role],
.dark #J_liveListNav dl dd [class^=role]:hover,
.dark #J_liveListNav dl dd div li,
.dark #J_liveListNav dl dd div li:hover,
.dark [class^=emoticon] [class^=emot],
.dark .program-preview-box .preview-bd,
.dark .game-live-item,
.dark .game-live-item .txt .num,
.dark .game-live-item .txt .game-type a,
.dark .game-live-item .txt .game-type,
.dark .live-box .box-hd .more-list li,
.dark #J_duyaHeaderRight ul li a,
.dark [class^=Category] [class^=SecTitle],
.dark [class^=listItem],
.dark [class^=listItem] span,
.dark .nav-expand-list,
.dark .nav-expand-list-more ,
.dark #js-game-list li,
.dark .mod-list .box-hd .filter dd .tag-layer,
.dark .room-hd,.dark .room-core-r,
.dark .room-sidebar,.dark .room-player-gift-placeholder,
.dark #chat-room__wrap #chat-room__list div,.dark #chat-room__wrap #chat-room__list div a,
.dark #js-preview-box,.dark #recom-banners,.dark #tipsOrchat,
.dark .banners-box,.dark .box-recom .recom-banners,.dark .box-recom .recom-moments,
.dark .hotMoment-box .moment-item .moment-comment .comment-item,
.dark .chat-room__input,.dark .chat-room__ft,
.dark .room-panel,
.dark .subscribe-live-item,.dark .list-hd .follow-ctrl,
.dark .btn-more,.dark #js-search-main .host-item,.dark #js-search-main .host-item .desc,
.dark .search-left .superStar-item,.dark .chat-room__input .btn-sendMsg ,
.dark .nav-expand-list.nav-expand-game span a,.dark .chat-room__ft .chat-emot div,
.dark #tipsOrchat ._PortalChatPanelRoot div, .dark .ddJUGO,
.dark .laypageskin_default a,.dark .laypage_main button,.dark .laypage_main input,
.dark .player-gift-wrap,
.dark [class^=checkbox][class^=checked] i,
.dark .chat-room__bd .chat-room__scroll .clearBtn,
.dark .chat-room__bd .chat-room__scroll .lockBtn,
.dark [class^=panel],
.dark [class^=Panel],
.dark [class^=PanelHd],
.dark [class^=PanelBd],
.dark [class^=PanelFt],
.dark [class^=PopMsg],.dark [class^=PopMsg] [class^=title],.dark [class^=PopMsg] [class^=desc],
.dark [class^=PopMsg] [class^=PopMsgArr],
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off,
.dark .duya-header-search input,.dark .inpage-advice-list li:hover,
.dark #play2 .content .content-aside>div,.dark #play2 .content .content-aside>div h2,
.dark #play2 .content .content-aside>div .more,.dark .main-info,
.dark .comment-container textarea, .dark .main-vplayer .vplayer-wrap .video_embed .video_embed_flash,
.dark .loGrI3HWkrL4-I82d11qx,
.dark .loGrI3HWkrL4-I82d11qx ._5zt-PSmfE5nKpsIw9OQE,
.dark .loGrI3HWkrL4-I82d11qx ._5zt-PSmfE5nKpsIw9OQE .MuTvmvGkEFS9kogNu9hjs, 
.dark .loGrI3HWkrL4-I82d11qx ._5zt-PSmfE5nKpsIw9OQE .MuTvmvGkEFS9kogNu9hjs:focus,
.dark #play2, .dark .duya-header-bd,.dark .aside-danmulist .danmulist-header,
.dark .search-suggest, .dark .search-suggest ,
.dark .search-suggest .search-item:hover,
.dark .search-suggest .search-item.current,
.dark #J_liveListNav dl dd span,
.dark #player-gift-wrap,.dark .player-all-gift-panel,
.dark #player-box-panel,
.dark .more-attivity-panel,.dark [class^=roomBlockWords],
.dark [class*=msg-of-king],
.dark [class^=ButtonMon],
.dark #player-gift-tip .mic-name-color,
.dark #player-gift-tip .make-friend-people-switch,
.dark [class^=ucard],.dark .msg-bubble,.dark .chat-room__wrap,
.dark .game-live-item .txt .room,
.dark #messageboard,
.dark .huya-footer{
  background-color: var(--w-bg-darker) !important;
  color: var(--w-text-light) !important;
  outline: none !important;
}


/* 弹幕白条问题 */
.dark [class^=RoomMessageRichText],
.dark .msg-bubble {
  border:none  !important;
  margin:0 !important;
}


/* 修改字体颜色 */
.dark .hy-nav-item-on .hy-nav-link,
.dark .hy-nav-link:hover {
  background-color: none !important;
  color: #fff !important;
}


/* 修改border */
.dark .loGrI3HWkrL4-I82d11qx ._5zt-PSmfE5nKpsIw9OQE,
.dark .search-suggest .search-item:hover,
.dark .search-suggest .search-item.current {
  background-color:none !important;
  border:1px solid var(--w-text-light) !important;
  outline: none !important;
}

/* 修改字体颜色 */
.dark .duya-header a, .dark [class^=loginTips],
.dark p,
.dark h1,.dark h2, .dark h3,.dark h4,.dark h5,.dark h6,
.dark .duya-header-nav .hy-nav-item a,
.dark .duya-header-right a,
.dark .liveList-title a,
.dark .game-live-item .title,
.dark .game-live-item .txt,
.dark  .duya-header i,
.dark .video-funny .title span,
.dark .live-box .box-hd .title a,
.dark .hy-header-style-skr .hy-nav-link,
.dark [class^=Category] [class^=Item] a,
.dark #js-game-list li a .g-gameCard-fullName,
.dark .box-hd .title,
.dark .mod-list .box-hd .filter dd .tag-layer,
.dark .room-hd .host-info .host-title,
.dark .room-hd .host-name,
.dark .recom-title,
.dark .page-ctrl,
.dark .page-ctrl .ctrl-left,
.dark .page-ctrl .ctrl-right,
.dark .page-ctrl .ctrl-page,
.dark #chat-room__wrap #chat-room__list div a,
.dark #chat-room__wrap #chat-room__list div a span,
.dark .program-preview-box .preview-list .preview-item .preview-link,
.dark .program-preview-box .preview-hd .title,
.dark .program-preview-box .preview-list .preview-item .preview-line,
.dark .chat-room__list .msg-bubble span.msg,
.dark .subscribe-live-item .txt .msg-row .nick,
.dark .subscribe-live-item .txt .msg-row .intro,
.dark .subscribe-live-item .txt .msg-row .num,
.dark .list-hd .title,
.dark .list-hd .follow-ctrl .icon,
.dark .search-left .superStar-item .nick,
.dark .search-left .superStar-item .recommend,
.dark .search-left .superStar-item .room,
.dark .chat-room__list .msg-bubble .colon,
.dark .chat-room__list .msg-bubble .msg,
.dark .chat-room__input .btn-sendMsg,
.dark #tipsOrchat .live-tips,
.dark #tipsOrchat ._PortalChatPanelRoot div p,
.dark #tipsOrchat ._PortalChatPanelRoot div span,
.dark #tipsOrchat ._PortalChatPanelRoot div i,
.dark [class^=checkbox] i,
.dark [class^=checkbox] span,
.dark [class^=listItem],.dark [class^=listItem] span,
.dark [class^=barrageBox] [class^=title],
.dark [class^=barrageBox] [class^=panel], 
.dark [class^=panel],
.dark .chat-room__ft span,.dark .chat-room__ft p,
.dark .duya-header-right a i,
.dark .duya-header-right a span,
.dark #player-gift-tip .super-fans-gift .super-fans-gift-content i,
.dark #player-gift-tip .motorcade-gather-gift,.dark #player-gift-tip .mic-name,
.dark .chat-room__bd .chat-room__scroll .clearBtn,
.dark .chat-room__bd .chat-room__scroll .lockBtn,
.dark .search-advice-list li a,.dark .search-header .find-result,
.dark #play2 .crumb,.dark #play2 .crumb a,.dark .live-box .box-hd .more-list li a,
.dark #player-gift-dialog gift-yellow,
.dark .aside-videolist .video-item .item-detail .detail-nick span, dark .aside-videolist .video-item .item-detail .detail-playcount span
.dark .live-box .box-hd .more-list li a{
  color: var(--w-text-light) !important;
}


/* 修改字体颜色 hover */

.dark .liveList-title a:hover,.dark .game-live-item .title:hover,.dark .game-live-item .txt:hover,.dark .live-box .box-hd .title a:hover,.dark .live-box .box-hd .more-list li a:hover,
.dark #js-game-list li a .g-gameCard-fullName:hover,.dark .box-hd .title:hover,.dark .game-live-item .txt i:hover,.dark .host-name:hover,.dark .mod-list .box-hd .filter dd .tag-layer:hover,
.dark .subscribe-live-item .txt .msg-row .nick:hover,.dark .subscribe-live-item .txt .msg-row .intro:hover,.dark .list-hd .title:hover,.dark  #js-search-main .host-item .nick,
.dark .search-main .type-keyword,.dark #tipsOrchat .live-tips i,.dark .duya-header-right a:hover,.dark .duya-header-right a i:hover,.dark .duya-header-right a span:hover,.dark .chat-room__bd .chat-room__scroll .clearBtn:hover,
.dark .chat-room__bd .chat-room__scroll .lockBtn:hover,.dark .main-info .info-video .video-detail .video-title,
.dark .main-info .info-video .video-author h3,
.dark .search-header .find-result em,.dark .aside-videolist .video-item:hover .item-detail h3,
.dark dark [class^=FavoritePresenter] [class^=subscribe],
.dark dark [class^=FavoritePresenter] [class^=subscribe] [class^=subscribe],
.dark dark [class^=Category] [class^=Item] a:hover
{

  color: var(--w-text) !important;
}



/* 修改border */
.dark .program-preview-box,.dark .recom-banners,.dark .recom-moments,.dark .game-live-item,.dark .nav-expand-list,
.dark #js-game-list li,.dark .g-gameCard-item,.dark .room-sidebar,.dark .list-hd .follow-ctrl,.dark .btn-more,.dark #js-search-main .host-item,.dark .subscribe-live-item,
.dark .chat-room__input .btn-sendMsg,.dark .laypageskin_default a,.dark .chat-room__bd .chat-room__scroll .clearBtn,.dark .chat-room__bd .chat-room__scroll .lockBtn,
.dark .main-info .info-draw,.dark .main-info .info-comment,.dark .main-info .info-comment h2,
.dark #chat-room__wrap #chat-room__list [class^=RoomMessageRichText]{
  border:1px solid var(--w-border) !important;
  outline: none !important;
}


.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off:hover,
.dark .nav-expand-list.nav-expand-game span:hover {
  background-color: var(--w-bg-darker) !important;
  color: var(--w-text-light) !important;
  outline: none !important;
}


.dark [class^=roomBlockWords] li,
.dark [class^=panel] [class^=panel-hd] [class^=box] [class^=box-hd],
.dark [class^=panel] [class^=panel] [class^=lock] {
  background: var(--w-bg-darker) !important;
  color: var(--w-text-light) !important;
}



.dark .hy-header-style-normal .duya-header-wrap,.dark #player-gift-wrap,
.dark .duya-header,.dark .player-all-gift-panel,.dark .player-all-gift-panel .arrow,
.dark .chat-room__input,.dark #player-gift-tip,.dark .player-face li .player-superfans-card-count,
.dark .player-face li .player-superfans-card-count,
.dark #player-gift-tip,.dark #player-gift-tip .make-friend-people-switch,
.dark #player-gift-tip .make-friend-unsubscribe,
.dark #player-gift-tip .make-friend-line,
.dark #player-gift-tip .bottom,.dark #player-pc-watch-btn,
.dark .inpage-advice-list li,.dark #play2 .content .content-aside>div .more
{
  background-color: var(--w-bg-darker) !important;
  border-color:var(--w-border) !important;
  outline: none !important;
}


/* 只修改border-color */
.dark .chat-room__input,
.dark .chat-room__ft .chat-room__ft__chat,
.dark ._2uc0_gzwdW4cbL_UOgWDJd,
.dark #tipsOrchat{
  border-color:var(--w-border) !important;
  outline: none !important;
}

.dark #duya-header,
.dark #chat-room__wrap #chat-room__list div a,
.dark #chat-room__wrap #chat-room__list div a span {
  border:none !important;
  outline: none !important;
}

.dark .laypageskin_default a:hover,
.dark .comment-container textarea,.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off .subscribe-count,
.dark .nav-expand-list.nav-expand-game span a:hover{
  border-color:var(--w-text-light) !important;
}


/* 修改border color background */
.dark .laypage_main button:hover,
.dark .laypageskin_default .laypage_curr,
.dark #J_duyaHeaderRight ul li a,
.dark .chat-room__bd .load-more-msg,
.dark .ixyGIy,.dark .room-weeklyRankList-content.room-weeklyRankList-content-loading,
.dark .danmu-add--3lwPBnzV90glJnZ1h6GpeS>div,
.dark [class^=danmu-add],
.dark [class^=messageBoard] [class^=btn],
.dark .laypageskin_default a:hover {
  color: var(--w-text);
  border-color:var(--w-text) !important;
  background-color: var(--w-bg-darker) !important;
}

.dark .chat-room__bd .chat-room__scroll .clearBtn,
.dark .chat-room__bd .chat-room__scroll .lockBtn,
.dark .hy-header-style-normal .duya-header-search input,
.dark .comment-container textarea:focus,.dark #pub_msg_input,
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off
{
  border:1px solid var(--w-text-light) !important;
  outline: none !important;
}


.dark [class^=ChatSpeaker] textarea:focus,
.dark [class^=roomBlockWords] li,
.dark .hy-header-style-normal .duya-header-search input:focus {
  border:1px solid var(--w-text) !important;
  outline: none !important;
}



.dark [class^=MmdPopPanel],
.dark .msg-of-king,.dark [class^=roomBlockWords] [class^=btn],
.dark [class^=SubConfirmPop],
.dark [class^=SubConfirmPop] span,
.dark [class^=SubConfirmPop] [class^=control] span,
.dark [class^=colorNormal],
.dark #player-danmu-report,
.dark #pc-watch-download-tips,.dark #pc-watch-download-tips,
.dark [class^=colorNormal][class^=lock],
.dark [class^=ucard-normal],
.dark .chat-room__list .msg-timed span,
.dark [class^=PanelGuide] [class^=ClubPrivilege] [class^=Privilege] [class^=item],
.dark [class^=panel] [class^=panel] [class^=lock] [class^=btn],
.dark .hy-nav-item-on .hy-nav-link, .dark .hy-nav-link:hover,
.dark #search-bar-input,.dark [class^=barrageBox],
.dark [class^=FanClub] [class^=tips],
.dark #player-gift-tip .list .btn,
.dark #player-gift-dialog .btn,
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-on,
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off
 {
  background-color: var(--w-bg-darker) !important;
  border:1px solid var(--w-text) !important;
  color: var(--w-text-light) !important;
  outline: none !important;
}



.dark [class^=panel] [class^=panel-bd] [class^=box-hd],
.dark [class^=colorDefault],
.dark [class^=PanelFt] [class^=btn],
.dark #player-gift-dialog,
.dark [class^=PanelGuide] [class^=btn]
 {
  background: var(--w-bg-darker) !important;
  border:1px solid var(--w-text) !important;
  color: var(--w-text-light) !important;
  outline: none !important;
}



.dark #player-gift-dialog .btn:hover,
.dark [class^=SubConfirmPop] span:hover,
.dark #player-gift-tip .list .btn:hover,
.dark #player-gift-tip .list .btn.send,
.dark #J_liveListNav dl dd ul li ul li:hover,
.dark [class^=SubConfirmPop] [class^=control] span:hover,
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-on:hover,
.dark .room-hd .host-control .subscribe-entrance .subscribe-hd.sub-off:hover{
  background: var(--w-bg) !important;
  border:1px solid var(--w-text-light) !important;
  color: var(--w-text) !important;
  outline: none !important;
}

.dark .host-item .avatar .avatar-mask,
.dark .superStar-item .avatar .avatar-mask {
  background:none !important;
}


.dark #J_liveListNav dl dd span:hover,
.dark #J_duyaHeaderRight ul li a:hover,
.dark .g-gameCard-link:hover{
  background: var(--w-bg) !important;
  color: var(--w-text) !important;
  outline: none !important;
}

.dark .chat-room__ft .chat-room__ft__pannel .room-chat-tool-color {
  width: 20px !important;
  height: 20px !important;
  background: var(--w-bg-darker) !important;
  border:1px solid var(--w-text) !important;
  color: var(--w-text-light) !important;
  border-radius:50%  !important;
  position:relative !important;
}

.dark #J-room-chat-color::before {
  content: '饰';
  left:50% !important;
  top:50% !important;
  position: absolute !important;
  transform: translate(-50%,-50%) !important;
}

.dark .chat-room__input .btn-sendMsg.btn-sendMsg-enable,
.dark #msg_send_bt {
  /* border-left : 1px solid var(--w-text) !important; */
  background: var(--w-bg-darker) !important;
}

.dark [class^=BrowseHistory] [class^=c-login],
.dark #J_user_viewer_root + div,
.dark .J_RoomFollowRoot + div,
.dark .fansBadgeAnchor-box,
.dark .J_roomWeeklyRankList,
.dark .room-sidebar-hd,
.dark #J_roomHdHostLvInfo,
.dark .room-weeklyRankList-nav,
.dark #J_roomWeeklyRankListRoot [class^=tabPane],
.dark #J_RoomChatSpeaker textarea,
.dark [class^=HonorInfo],
.dark #yyliveRk_game_newsBut,
.dark .player-face .player-face-arrow,
.dark .player-face li .plaer-face-icon-bg,
.dark [class^=ButtonMon] [class^=sub],
.dark [class^=ButtonMon] [class^=btn]
 {
  background: var(--w-bg-darker) !important;
  border:1px solid var(--w-border) !important;
  color: var(--w-text) !important;
  outline: none !important;
}

.dark #J_roomWeeklyRankListRoot [class^=Item]:hover,
.dark #J_roomWeeklyRankListRoot [class^=item]:hover,
.dark #J_roomWeeklyRankListRoot [class^=seat-item]:hover,
.dark #J_roomWeeklyRankListRoot [class^=rank-item]:hover{
  background: var(--w-bg) !important;
}



`;
  const match_cms_content = isShowMatchContent() ? "" : `
#main_col #matchComponent2,
#match-cms-content
{
  display:none !important;
}
`;
  const main_room_user = isShowMainRoom() ? "" : `
 .match-room .match-nav
 {
   display:none !important;
}
`;
  const sys_msg = isShowSysMsg() ? "" : `
.treasureChest-winningRecord,
.chat-room__list .msg-auditorSys,
.chat-room__list .msg-sys {
  display:none !important;
}

`;
  const ranking = isShowGiftRank() ? "" : `
.room-weeklyRankList,
#J_roomSideHd{
   display: none !important;
 }

`;
  const fans_img = isShowFansIcon() ? "" : `

.chat-room__list .msg-bubble-decorationPrefix img,
.chat-room__list .msg-normal-decorationPrefix,
.chat-room__list .msg-normal-decorationSuffix,
.chat-room__list .msg-bubble-decorationSuffix,
.chat-room__list .msg-bubble-decorationPrefix 
{
  display:none !important;
}

.chat-room__list .msg-bubble .colon,
.chat-room__list .msg-bubble .msg,
.chat-room__list .msg-bubble
{
  background:none !important;
}
`;
  const css$3 = is_huya ? `
 
.game-live-item i,.host-name {
  cursor:pointer;
}
.game-live-item .txt i:hover,.host-name:hover {
  color:rgb(255, 135, 0);
}
 
/* NONE */
#ab-item,
.common-popup,
#J_playerMain .room-player-gift-placeholder,
.pre-ab-wrap,#pre-ab-wrap,.pre-ab-video,#pre-ab-video,#player-resource-wrap,
[class^=GuangG],.J_ad,#public-screen-ab, #ab-banner,.room-hd #ProfileGroup,
#player-ext-wrap,#J_noticeLive,.chat-room__list div[data-cmid="1"],
#public-screen-ab,.superFans-fansDay,
[class^=ChatPanelRoot] [class^=PanelFt] [class^=text],
.helperbar-root--12hgWk_4zOxrdJ73vtf1YI,[class^=helperbar-root],
.mod-index-wrap .mod-index-main .main-bd,
.mod-index-wrap .mod-index-main .main-hd,
.mod-index-wrap #js-main,#J_treasureChestContainer,
.mod-index-wrap #banner,.player-banner-activity,
.mod-index-wrap .mod-game-type,
.mod-index-wrap .mod-actlist,
.mod-index-wrap .mod-news-section,
.mod-index-wrap .mod-index-list .live-box #J_adBnM,
.mod-index-wrap .mod-index-recommend,
.mod-index-wrap .mod-news-section,
.mod-index-wrap .recommend-wrap,
#player-marquee-wrap,.small-handle-tip,
#player-marquee-wrap .player-marquee-noble-item,
#player-marquee-wrap .player-banner-enter,
#player-marquee-wrap [id^=player-banner-enter],
#player-marquee-wrap [id^=player-marquee],
.RoomPublicMessage--n3v61Bk0DehYuR0xEQ9S1,[class^=RoomPublicMessage],
#huya-ab-fixed,
#huya-ab,
.liveList-header-r,
.room-footer,
#J_profileNotice,

.hy-nav-item,
.list-adx,
.layout-Banner,
 #J_duyaHeaderRight>div>div>div,
 .nav-expand-list .third-clickstat,
 .player-recommend.recommend-ab-mode .end-ab-wrap,
 .chat-wrap-panel.wrap-income,
  [class^=NavItem][class*=NavDownload],
 .host-detail.J_roomHdDetail span,
 .host-detail.J_roomHdDetail .host-video,
 .room-hd-r .jump-to-phone,
 .room-hd-r #share-entrance,
 .room-hd-r #J_illegalReport,
 .room-hd-r .gamePromote.J_gamePromote,
 .main-wrap .room-mod-ggTop,
 #chatRoom .room-gg-chat,
 .room-core .room-business-game,
 .room-backToTop.j_room-backToTop,
 .end-ab-banner,
 .player-app-qrcode,
 .player-play-big, .chat-room__list .msg-nobleSpeak-decorationPrefix
 {
    display:none !important;
 }
 
 .ssr-wrapper .mod-sidebar, 
 .room-core #player-gift-wrap {
   display:none;
 }
 
 .hy-nav-item:nth-child(1),
 .hy-nav-item:nth-child(2),
 .hy-nav-item:nth-child(3),
  #J_duyaHeaderRight>div>div>div:has([class*=NavIcon-fav]),
  #J_duyaHeaderRight>div>div>div:has([class*=NavIcon-history])
 {
   display:inline-block !important;
 }

 .mod-index-wrap .mod-index-list{
/*    margin-top:80px !important; */
 }
 .duya-header{
   background: hsla(0,0%,100%,.95)  !important;
   border-bottom: 1px solid #e2e2e2 !important;
   box-shadow: 0 0 6px rgb(0 0 0 / 6%) !important;
 }
 .duya-header a,.duya-header i{
  color:#000 !important;
 }

 #J_mainRoom,
 #main_col
{
   background:none !important;
 }

 
 #wrap-ext,

.chat-room__list .msg-noble,
.J_box_msgOfKing,
.chat-room__list .msg-onTVLottery{
    display: none !important;
 }
.chat-room__list .msg-bubble span.msg{
    color: #333 !important;
 }

.chat-room__list .msg-bubble .colon,
.chat-room__list .msg-bubble .msg,
.chat-room__list .name{
    color: #3c9cfe !important;
}
 
#search-bar-input::placeholder{
    color: transparent !important;
    opacity:0 !important;
}

 
#player-ctrl-wrap {
  opacity: 0;
  transition: all 500ms ease-in 0s !important;
  bottom: 16px;
}
#J_playerMain:hover #player-ctrl-wrap{
   opacity: 1;
}
 
[class^=NavItem] span[class^=NavText] {
  color:#555 !important;
}
.duya-header-search input {
  background-color: #e5e7eb;
}
[class^=NavItem] [class^=NavItemHd] i[class*=fav] {
  background-image:url('https://a.msstatic.com/huya/hd/h5/header/components/HeaderDynamic/NavItem/img/fav-0.15b3e0b4a39185db705b7c523cd3f17c.png') !important;
}
 
[class^=NavItem] [class^=NavItemHd] i[class*=history] {
  background-image:url('https://a.msstatic.com/huya/hd/h5/header/components/HeaderDynamic/NavItem/img/history-0.2b32fba04f79057de5abcb2b35cd8eec.png') !important;
}


/* 评论区图片显示问题 */
.chat-room__list .msg img {
  display:inline-block !important;
 }

 .room-player-wrap .room-player-main {
  background : transparent !important;
 }


 #wrap-recGameLive {
    margin-top:50px !important;
 }

 ${fans_img}
 ${sys_msg}
 ${ranking}
 ${main_room_user}
 ${match_cms_content}
 ${darkCss}

` : "";
  const inputKeywords = () => isShowHotSearchInputKeyword() ? `` : `
#douyin-header>input,
.QSoEc32i>input,
.st2xnJtZ.YIde9aUh {
  color: transparent;
  opacity:0 !important;
}

`;
  const css$2 = is_douyin ? `
    #related-video-card-login-guide,
    #captcha_container,
    .video-info-detail,
    .JsAsIOEV,
    .wwNZW6za,
    #login-full-panel{
       display:none !important;
    }

    .login-mask-enter-done,
    .box-align-center, {
      display:none ;
    }

    .m-douyin-login{
        display:block !important;
    }

    ::-webkit-scrollbar {
        width: 6px !important;
        background-color: teal !important;
      }
      
      ::-webkit-scrollbar-track {
        background-color: var(--w-bg) !important;
      }
      
      ::-webkit-scrollbar-thumb {
        background-color: var(--w-bg-light) !important;
        border-radius: 6px !important;
      }


      ${inputKeywords()}
      
  
` : "";
  const anime = /.*:\/\/www\.bilibili\.com\/anime\/.*/.test(local_url) ? `
.dark .home-cell-desc-title[data-v-350d21cc],
.dark [class^=home-cell-desc-title],
.dark .home-cell-desc-subtitle[data-v-350d21cc], 
.dark [class^=home-cell-desc-subtitle], 
.dark [class^=with-up-space],
.dark .with-up-space[data-v-350d21cc]
 {
  color:var(--w-text-light) !important;
}


.dark .nav-tool-container [class^=section]{
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}



.dark .nav-tool-container [class^=section]:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}







` : ``;
  const blackboard = `

.dark .q-textarea {
  background-color : var(--w-bg-darker) !important;
  color : var(--w-text-light) !important;
  border :1px solid var(--w-text-light) !important;
}
.dark .activity-questions-list-wrap .activity-questions-item .activity-questions-item-title .title,
.dark .activity-questions-list-wrap .activity-questions-item .activity-questions-item-required,
.dark .activity-questions-item-index,
.dark .activity-questions-list-wrap .activity-questions-item {
  color : var(--w-text-light) !important;
}


`;
  const comment = `
 .dark .player-left-components *,
 .dark .bb-comment,

 .dark .bb-comment, .dark .comment-bilibili-fold,
 .dark .bb-comment .comment-send-lite .comment-emoji,
 .dark .bb-comment .comment-send.comment-send-lite,
 .dark .bb-comment .comment-send-lite.comment-send-lite,
 .dark .comment-bilibili-fold .comment-send .comment-emoji,
 .dark .comment-bilibili-fold .comment-send-lite .comment-emoji,
 .dark .comment-bilibili-fold .comment-send.comment-send-lite,
 .dark .comment-bilibili-fold .comment-send-lite.comment-send-lite,
 .dark .bili-rich-textarea__inner,.dark .bili-emoji__footer,
 .dark .bili-emoji__pkg,.dark .bili-emoji,.dark .emoji-box
 {
  background-color:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
}



.dark .bili-emoji,.dark .emoji-box .emoji-title,
.dark .bb-comment,
.dark .bb-comment .comment-header,
.dark .bb-comment .comment-header .tabs-order,
.dark .bb-comment .comment-header .tabs-order li,
.dark .bb-comment .comment-send .dynamic-repost, 
.dark .bb-comment .comment-send-lite .dynamic-repost, 
.dark .comment-bilibili-fold .comment-header .tabs-order li,
.dark .comment-bilibili-fold .comment-send .dynamic-repost, 
.dark .comment-bilibili-fold .comment-send-lite .dynamic-repost {
  color:var(--w-text-light) !important;
}




.dark .bb-comment .comment-send-lite .comment-emoji,
.dark .bb-comment .comment-header, 
.dark .bb-comment .comment-list .list-item .con,
.dark .bb-comment .bottom-page.center,
.dark .comment-bilibili-fold .comment-header,
.dark .comment-bilibili-fold .comment-send .comment-emoji,
.dark .comment-bilibili-fold .comment-send-lite .comment-emoji,
.dark .comment-bilibili-fold .comment-list .list-item .con{
  border-color: var(--w-border) !important;
}

.dark .reply-box .box-normal .reply-box-warp[data-v-a6daab22],
.dark .reply-box .box-normal [class^=reply-box-warp],
.dark .user-card,
.dark .user-card .btn-box .message
{
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background-color:var(--w-bg-darker) !important;
}



.dark .emoji-box,.dark .emoji-box .emoji-tabs,.dark .bili-emoji__pkg.active,
.dark .bb-comment .operation .opera-list,
.dark .bb-comment .comment-send .comment-emoji, 
.dark .bb-comment .comment-send .textarea-container .ipt-txt, 
.dark .bb-comment .comment-send-lite .textarea-container .ipt-txt, 
.dark .bb-comment .comment-list .list-item .info .reply-tags span, 
.dark .comment-bilibili-fold .comment-send .textarea-container .ipt-txt,
.dark .comment-bilibili-fold .comment-list .list-item .info .reply-tags span,
.dark .comment-bilibili-fold .comment-send-lite .textarea-container .ipt-txt,
.dark .comment-bilibili-fold .operation .opera-list{
  color:var(--w-text-light) !important;
  background-color:var(--w-bg-darker) !important;
  border-color: var(--w-border) !important;
}


.dark .bb-comment .comment-list .list-item .reply-box .view-more .btn-more:hover, .comment-bilibili-fold .comment-list .list-item .reply-box .view-more .btn-more:hover,
.dark .btn.idc-btn.primary:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background-color:var(--w-bg-darker) !important;
}

.dark .user-card .btn-box .message:hover,
.dark .btn.idc-btn.default:hover,.dark .bili-emoji__list__item:hover,
.dark .emoji-box .emoji-wrap .emoji-pic:hover,
.dark .emoji-list.emoji-text.emoji-pic:hover,
.dark .emoji-box .emoji-tabs .tab-link:hover,
.dark .emoji-box .emoji-tabs .tab-link.on {
  color:var(--w-blue-link-hover) !important;
  border:1px solid var(--w-blue-link-hover) !important;
  background-color:var(--w-bg-darker) !important;
}

`;
  const dialog = `
.dark .bili-dialog-bomb,.dark .bili-dialog-bomb .appeal-box,
.dark .bili-dialog-bomb .appeal-box .header,
.dark .bili-dialog-bomb .appeal-box .wrap .container .textarea .textarea-wrap textarea,
.dark .bili-dialog-bomb .appeal-box .submit
 {
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}

.dark .bili-dialog-bomb .appeal-box .wrap .container .question {
  color:var(--w-text-light) !important;
}



`;
  const footer = `
.bili-footer {
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}

.dark .bili-footer p {
  color:var(--w-text-light) !important;
}

`;
  const header = `
.dark .bili-header .bili-avatar-icon.bili-avatar-right-icon {
  display:none !important;
}

`;
  const login = `

.dark .tab__form,
.dark .tab__form .form__item input ,
.dark .tab__form .form__item input::placeholder,
.dark .tab__form .form__item input:focus,
.dark .bili-mini-content-wp {
  background:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
}


.dark .tab__form {
  border:1px solid var(--w-text) !important;
}


.dark .bili-mini-customer-title,
.dark .bili-mini-content-wp .login-scan-title,
.dark .bili-mini-content-wp .login-scan-desc p,
.dark .login-tab-item[data-v-35ff7abe],
.dark .login-tab-item, .dark .login-sns-name,
.dark .login-agreement-wp p,
.dark .tab__form .form__item .form_info {
  color:var(--w-text) !important;
}

.dark .btn_primary.disabled[data-v-327e145a],
.dark .btn_primary.disabled,
.dark .btn_primary,
.dark .btn_primary[data-v-327e145a],
.dark .btn_other,
.dark .btn_other[data-v-327e145a] {
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
  border:1px solid var(--w-text-light) !important;
}

.dark .btn_other:hover,
.dark .btn_primary:hover,
.dark .btn_primary[data-v-327e145a]:hover,
.dark .btn_other[data-v-327e145a]:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}


.dark .tab__form .form__item input ,
.dark .tab__form .form__item input::placeholder,
.dark .tab__form .form__item input:focus {
  border:none !important;
}



`;
  const page_num = `


.dark .be-pager-options-elevator {
  color:var(--w-text-light) !important;
}

.dark .be-pager-item-active,
.dark .be-pager-options-elevator input {
  background:var(--w-bg-darker) !important;
}

.dark .be-pager-next, 
.dark .be-pager-prev,
.dark .be-pager-item {
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
  border:1px solid var(--w-text-light) !important;
}


.dark .be-pager-next:hover,
.dark .be-pager-prev:hover,
.dark .be-pager-item:hover
{
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

.dark .be-pager-item .be-pager-item-active,
.dark .be-pager-item-active {
  color :var(--w-blue-link-hover) !important;
  border-color :var(--w-blue-link-hover) !important;
}

`;
  const videoToolsDarkCss = `

.dark .main-container .tool-bar *,
.dark .main-container .ep-list-wrapper *,
.dark .ep-section-module *,
.dark .nav-tools *,
.dark .toolbar *,

.dark .main-container .review-module .review-list *,
.dark .main-container .tool-bar .mobel-info .mobel-more {
  color:var(--w-text-light) !important;
  border-color: var(--w-border) !important;
  outline-color: var(--w-border) !important;
  background-color:var(--w-bg-darker) !important;
}

`;
  const root = `
:root {
  --w-brand: #3aa675;
  --w-light: #e5e7eb;
  --w-white: #fff;
  --w-brand-light: #349469;
  --w-bg: #22272e;
  --w-bg-light: #2b313a;
  --w-bg-lighter: #262c34;
  --w-bg-dark: #343b44;
  --w-bg-darker: #37404c;
  --w-bg-darker: var(--w-bg-dark);
  --w-text: #adbac7;
  --w-text-light: #cbd4dc;
  --w-text-lighter: #cdd6dd;
  --w-text-lightest: #8094a8;
  --w-border: #3e4c5a;
  --w-border-dark: #34404c;
  --w-blue-link-hover:#00aeec;
  --w-skeleton:#494f57;
}
.dark body,
.dark #app {
  --v_bg1: var(--w-bg-darker);
  --v_bg2: var(--w-bg-darker);
  --v_bg3: var(--w-bg-darker);
  --v_bg1_float: var(--w-bg-darker);
  --v_bg2_float: var(--w-bg-darker);
  --v_text_white: var(--w-white);
  --v_text1: var(--w-text);
  --v_text2: var(--w-text-light);
  --v_text3: var(--w-text-lighter);
  --v_text4: var(--w-text-lightest);
  --v_line_light:  var(--w-text-lighter);
  --v_line_regular: var(--w-text-lighter);
  --v_line_bold:  var(--w-text-lightest);
  --v_graph_white:var(--w-text);
  --v_graph_bg_thin: var(--w-bg-darker);
  --v_graph_bg_regular: var(--w-bg-darker);
  --v_graph_bg_thick: var(--w-bg);
  --v_graph_weak:  var(--w-text);
  --v_graph_medium:  var(--w-text-light);
  --v_graph_icon: var(--w-text-lightest);
  --v_shadow: var(--w-text);
  --v_text_hover: var(--w-blue-link-hover);
  --v_text_active:var(--w-blue-link-hover);
  --v_text_disabled: #C9CCD0 ;
  --v_line_border: var(--w-text-lighter);
  --v_line_bolder_hover:  var(--w-text-lightest);
  --v_line_bolder_active: var(--w-text-lightest);
  --v_line_bolder_disabled: var(--w-text);
 

}

.dark body,
.dark #app {
  --bg1:  var(--v_bg1);
  --bg2:  var(--v_bg2);
  --bg3:  var(--v_bg3);
  --bg1_float: var(--v_bg1_float);
  --bg2_float: var(--v_bg2_float);
  --text_white: var(--v_text_white);
  --text1:  var(--v_text1);
  --text2: var(--v_text2);
  --text3:  var(--v_text3);
  --text4:  var(--v_text4);
  --line_light:  var(--v_line_light);
  --line_regular: var(--v_line_regular);
  --line_bold: var(--v_line_bold);
  --graph_white: var(--v_graph_white);
  --graph_bg_thin: var(--v_graph_bg_thin);
  --graph_bg_regular: var(--v_graph_bg_regular);
  --graph_bg_thick: var(--v_graph_bg_thick);
  --graph_weak: var(--w-text);
  --graph_medium: var(--w-text-light);
  --graph_icon: var(--w-text-lightest);
  --shadow: var(--w-text);
  --text_hover: var(--v_text_hover);
  --text_active: var(--v_text_active);
  --text_disabled:  var(--v_text_disabled);
  --line_border: var(--v_line_border);
  --line_bolder_hover: var(--v_line_bolder_hover);
  --line_bolder_active: var(--v_line_bolder_active);
  --line_bolder_disabled:  var(--v_line_bolder_disabled);
  --b_text1: var(--text1);
  --b_text2: var(--text2);
  --b_text3: var(--text3);
  --b_text4: var(--text4);
}




`;
  const common = `
${root}
${header}
${footer}
${login}
${page_num}
${comment}
${dialog}
${videoToolsDarkCss}
`;
  const douga = /.*:\/\/www\.bilibili\.com\/v\/douga\/.*/.test(local_url) ? `


.dark .home-cell-desc-title[data-v-350d21cc],.dark .home-cell-desc-title,
.dark .home-cell-desc-subtitle[data-v-350d21cc], .with-up-space,.dark .home-cell-desc-subtitle[data-v-350d21cc], .with-up-space[data-v-350d21cc]
 {
  color:var(--w-text-light) !important;
}


.dark .channel-layout,
.dark channel-nav{
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}



.dark .nav-tool-container .section:hover,
.dark .nav-tool-container .section[data-v-3b26ecb6]:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

.dark .channel-layout,
.dark channel-nav,
.dark .bili-rank-list-video .bili-rank-list-video__item:nth-of-type(2n) {
   background:var(--w-bg-darker) !important;
}


.dark .bili-rank-list-video .bili-rank-list-video__item:nth-of-type(2n + 1) {
  background-color:var(--w-bg) !important;
}





` : ``;
  const guochuang = /.*:\/\/www\.bilibili\.com\/guochuang\/.*/.test(local_url) ? `
.dark .spread-module .t,.dark .spread-module,
.dark .pgc-rank-list .rank-item .ri-detail .ri-title,.dark .pgc-rank-list .rank-item .ri-detail .ri-point,
.dark .name, .dark .new-stat-module .zone-title .headline .name,.dark .headline .name, 
.dark .index-entry-wrapper .filter-block-title span,
.dark .block-area,.dark .block-area .timeline-title .headline .name,
.dark .block-area .block-left .block-header .block-title,
.dark .video-item-biref .biref-info .biref-title,
.dark .handpick-right-module .block-header .block-title {
  color:var(--w-text-light) !important;
}

.dark .video-item-biref .biref-info .biref-title:hover {
  color:var(--w-blue-link-hover) !important;
}

.dark .spread-module .num {
  background:var(--w-bg-darker) !important;
  color:var(--w-text-light) !important;
}

.dark .block-area .timeline-toggle-block .timeline-toggle-btn {
  background: none !important;
}



.dark .timeline-box .timeline-item .item-right p.num a, 
.dark .timeline-box .timeline-item .item-right p.num span,
.dark .new-stat-module .zone-title .headline .new-stat-more,
.dark .back-top-tools .tool-item,.dark .block-area .timeline-toggle-block .timeline-toggle-btn,
.dark .sec-rank .more-link,.dark .pgc-rank-dropdown,.dark .pgc-rank-dropdown .dropdown-list,
.dark .random-change {
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}

.dark .block-area .timeline-toggle-block .timeline-toggle-btn:hover,
.dark .new-stat-module .zone-title .headline .new-stat-more:hover,
.dark .timeline-box .timeline-item .item-right p.num a:hover, 
.dark .timeline-box .timeline-item .item-right p.num span:hover,
.dark .sec-rank .more-link:hover,.dark .back-top-tools .tool-item:hover,
.dark .random-change:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}







` : ``;
  const home = `

/* 黑色主题模式下骨架屏 */
.dark .bili-video-card__skeleton--cover,
.dark .bili-video-card__skeleton,
.dark .bili-video-card__skeleton--right,
.dark .bili-video-card__skeleton hide,
.dark .bili-video-card__skeleton--text.short,
.dark .bili-video-card__skeleton--light,
.dark .bili-video-card__skeleton--text {
  background:var(--w-skeleton) !important;
}


.dark body,.dark #header-v3,.dark .app-v1,.dark .app-v2,.dark .app-v3,.dark .app-v4,.dark .app-v5,
.dark #app, .dark .bili-header,
.dark .header-channel,.dark .header-channel-fixed-right-item,
.dark .bili-video-card__wrap,.dark .bili-header .game,
.dark .large-header,
.dark .bili-header .slide-down,
.dark .bili-header .bili-header__channel .channel-entry-more__link, 
.dark .bili-header .bili-header__channel .channel-link,
.dark .bili-header .bili-header__channel .channel-items__left,
.dark .bili-header .bili-header__channel,
.dark .bili-header .manga,
.dark .bili-header .manga-right-title,
.dark .bili-header .header-fav-card__image,
.dark .bili-header .header-fav-card,
.dark .bili-header .search-panel,
.dark .bili-header .center-search-container .center-search__bar #nav-searchform.is-actived .nav-search-content, 
.dark .bili-header .center-search-container .center-search__bar #nav-searchform.is-focus .nav-search-content,
.dark .history-panel-popover,.dark .bili-header .bili-header__banner,
.dark .bili-header .center-search-container .center-search__bar #nav-searchform,
.dark .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input:focus,
.dark .bili-header .avatar-panel-popover .level-item .level-item__bar .level-progress__inner,
.dark .bili-header .avatar-panel-popover .level-item .level-item__lv0,
.dark .bili-header .avatar-panel-popover .split-line,
.dark .bili-header .avatar-panel-popover .logout-item,
.dark .video-container-v1 .danmaku-box .danmaku-wrap,
.dark #i_cecream {
  background-color:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
}


.dark .bili-header .header-avatar-wrap .header-avatar-wrap--container .bili-avatar,
.dark .bili-header .game-left,.dark .bili-header .game-right,
.dark .bili-header .bili-header__channel .channel-items__left {
  border-color:var(--w-border-dark) !important;
}


.dark .feed-roll-btn .primary-btn,
.dark .header-channel-fixed-right-item,
.dark .bili-header .bili-header__channel .channel-entry-more__link, 
.dark .bili-header .bili-header__channel .channel-link {
  border:1px solid var(--w-border) !important;
}


.dark .bili-header .search-panel {
  border-color:1px solid var(--w-border) !important;
}



.dark .header-channel-fixed-right-item:hover,
.dark .bili-header,
.dark .bili-header .live-left-list,
.dark .bili-header .bili-header__channel .channel-entry-more__link, 
.dark .history-panel-popover .header-tabs-panel__item,
.dark .bili-header .avatar-panel-popover .vip-item .senior,
.dark .bili-header .avatar-panel-popover .coins-item .coin-item__text ,
.dark .bili-header .avatar-panel-popover .coins-item .coin-item__num ,
.dark .bili-header .avatar-panel-popover .level-item .level-item__bar--tag>span,
.dark .bili-header .center-search-container .center-search__icon,
.dark .bili-header .bili-header__channel .channel-link {
  border-color: var(--w-border) !important;
}


.dark a,.dark .roll-btn,
.dark .bili-header .left-entry .download-wrapper .download-top-title .main,
.dark .bili-header .left-entry .download-wrapper .download-top-title .sub,
.dark .bili-header .left-entry .download-wrapper .download-bottom,
.dark .bili-header .right-entry__outside .right-entry-icon ,
.dark .bili-header .slide-down .left-entry .mini-header__title, 
.dark .bili-header .slide-down .left-entry .entry-title, 
.dark .bili-header .slide-down .left-entry .default-entry,
.dark .bili-header .slide-down .left-entry .default-entry span,
.dark .bili-header .slide-down .left-entry .loc-mc-box__text,
.dark .bili-header .slide-down .left-entry .download-entry,
.dark .bili-header .slide-down .left-entry .loc-entry ,
.dark .bili-header .bili-header__channel .channel-link__right,
.dark .bili-header .bili-header__channel .channel-link__left,
.dark .bili-header .live-left-list-item-text,
.dark .bili-header .game-right-title,
.dark .bili-header .game-left-panel-item-title, 
.dark .bili-header .game-left-banner-title,
.dark .bili-header .manga-right-list-item-text,
.dark .bili-header .header-fav-card__info--name,
.dark .favorite-panel-popover__nav *,
.dark .favorite-panel-popover__nav .tab-item,
.dark .favorite-panel-popover__nav .tab-item__num,
.dark .bili-header .header-fav-card__info--title,
.dark .history-panel-popover .header-tabs-panel__content--date,
.dark .history-panel-popover .header-history-card__info--title,
.dark .header-tabs-panel *,
.dark .header-tabs-panel,
.dark .header-tabs-panel__content--date,
.dark .bili-video-card .bili-video-card__info--date,
.dark .bili-video-card .bili-video-card__info--author,
.dark .right-entry-text,.dark .channel-entry-popover .name, .dark .more-channel-popover .name ,
.dark .icon-title,.dark .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon,
.dark .bili-header .live .title,.dark .bili-header .live-left-list-item,
.dark .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input,
.dark .bili-header .avatar-panel-popover .links-item .single-link-item,
.dark .bili-header .avatar-panel-popover .vip-item__link,
.dark .bili-header .avatar-panel-popover .vip-item .senior,
.dark .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-clean svg,
.dark .bili-header .avatar-panel-popover .level-item .level-item__text,
.dark .bili-video-card .bili-video-card__info--tit>a {
  color:var(--w-text) !important;
}



.dark .v-inline-window__close-icon,.dark .bili-header .center-search-container .center-search__bar .nav-search-btn,
.dark .vip-entry-desc-subtitle,.dark .vip-entry-desc-title,.dark .vip-entry-desc-subtitle,
.dark .bili-header .avatar-panel-popover .coins-item .coin-item__num,
.dark .bili-header .avatar-panel-popover .counts-item .single-count-item .count-num {
  color:var(--w-text-light) !important;
}

.dark a:hover,.dark .roll-btn:hover,
.dark .vip-entry-desc-subtitle:hover,
.dark .bili-header .avatar-panel-popover .counts-item .single-count-item:hover .count-text,
.dark .bili-header .avatar-panel-popover .counts-item .single-count-item:hover .count-num ,
.dark .bili-header .avatar-panel-popover .vip-item__link:hover,
.dark .bili-header .manga-right-title:hover,
.dark .bili-header .game-right-list-item:hover,
.dark .bili-header .manga-right-list-item-text:hover,
.dark .bili-header .header-fav-card__info--name:hover,
.dark .bili-header .left-entry .download-wrapper .download-bottom:hover ,
.dark .bili-header .live-left-list-item-text:hover,
.dark .bili-header .game-right-title:hover,
.dark .bili-header .game-left-panel-item-title:hover, 
.dark .bili-header .slide-down .left-entry .default-entry span:hover,
.dark .bili-video-card .bili-video-card__info--date:hover,
.dark .bili-header .bili-header__channel .channel-link__right:hover,
.dark .bili-header .bili-header__channel .channel-link__left:hover,
.dark .bili-video-card .bili-video-card__info--author:hover,.dark .right-entry-text:hover,
.dark .icon-title:hover,.dark .bili-header .slide-down .right-entry .right-entry__outside .right-entry-icon:hover,
.dark .trending-item:hover .trending-text,
.dark .header-history-card:hover .header-history-card__info--title,
.dark .header-history-card .header-history-video:hover,
.dark .bili-header .header-fav-card:hover .header-fav-card__info--title,
.dark .bili-video-card .bili-video-card__info--tit>a:hover {
  color:var(--w-blue-link-hover) !important;
}


.dark .header-channel-fixed-right-item:hover,
.dark .channel-entry-popover .name:hover, .dark .more-channel-popover .name:hover,
.dark .bili-header .bili-header__channel .channel-entry-more__link:hover, 
.dark .bili-header .bili-header__channel .channel-link:hover,
.dark .channel-panel__item:hover,
.dark .dynamic-video-item:hover,
.dark .bili-header .header-dynamic-list-item .header-dynamic__box--right:hover,
.dark .bili-video-card .bili-video-card__info--tit>a:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}



/* all */
/* background 和 白色 border 和 白色 link */
.dark .bili-header .live,
.dark .bili-header .avatar-panel-popover,
.dark .history-tip,
.dark .bili-video-card .bili-video-card__info--icon-text,
.dark .v-popover-content,.dark .wnd_bottom .r-l,
.dark .history-panel-popover .header-tabs-panel__content .view-all-history-btn,
.dark .bili-header .histories .history-item,
.dark .bili-header .left-entry .download-wrapper .download-top-content .button,
.dark .bili-header .avatar-panel-popover .links-item .link-red-tip,
.dark .bili-header .avatar-panel-popover .links-item .link-beta-tip,
.dark .vip-entry-containter,
.dark [class^=vip-entry-btn],
.dark .feed-roll-btn .primary-btn,
.dark  .primary-btn
{
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
  border:1px solid var(--w-border) !important;
}

.dark .bili-header .center-search-container .center-search__bar #nav-searchform.is-focus,
.dark .bili-header .center-search-container .center-search__bar #nav-searchform::focus,
.dark .bili-header .center-search-container .center-search__bar #nav-searchform {
  border-color: var(--w-text) !important;
}



/* background 和 蓝色 border 和 蓝色 link */
.dark .wnd_bottom .r-l:hover,
.dark .vip-entry-containter:hover,.dark vip-entry-btn:hover,
.dark .vip-entry-btn[data-v-ae740c54]:hover,
.dark .bili-video-card .bili-video-card__info--icon-text:hover,
.dark .bili-header .game-right-list-item:hover,
.dark .history-panel-popover .header-tabs-panel__content .view-all-history-btn:hover,
.dark .bili-header .message-entry-popover .message-inner-list__item:hover,
.dark .bili-header .left-entry .download-wrapper .download-top-content .button:hover,
.dark .bili-header .histories .history-item:hover,
.dark .bili-header .center-search-container .center-search__bar .nav-search-btn:hover,
.dark .feed-roll-btn .primary-btn:hover,
.dark .bili-video-card span.no-interest-title:hover,
.dark .bili-video-card span.no-interest-desc:hover,
.dark .primary-btn:hover
{
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important; 
}



/* background 和 蓝色 border */
.dark .header-dynamic-list-item:hover,
.dark .bili-header .avatar-panel-popover .links-item .single-link-item:hover
{
  border:1px solid var(--w-border) !important;
  background:var(--w-bg-darker) !important;
}



/* 蓝色border */

.dark .suggest-item:hover {
  border:1px solid var(--w-border) !important;
  background:var(--w-bg-darker) !important;
}



/* border none */
.dark .bili-header .center-search-container .center-search__bar .nav-search-content,
.dark .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input:focus,
.dark .bili-header .search-panel {
  border: none !important;
}


/* fill */
.dark .bili-header .avatar-panel-popover .level-item .level-item__bar--next svg .level-bg {
  fill: var(--w-text)  !important;
}




`;
  const commonDark = `
.dark * {
  color:var(--w-text-light) !important;
  border-color: var(--w-border) !important;
  background-color:var(--w-bg-darker) !important;
  outline-color: var(--w-border) !important;
}


`;
  const css$1 = commonDark;
  const is_account = local_url.indexOf("https://account.bilibili.com/") !== -1;
  const account_css = is_account ? `
${css$1}

` : ``;
  const app_bilibili = /https:\/\/app\.bilibili\.com\/.*/.test(local_url) ? `

${css$1}

  .dark .head-img,
  .dark .header-wrap {
    background:var(--w-bg-darker) !important;
  }
  
  ` : ``;
  const game_bilibili = /https:\/\/game\.bilibili\.com\/.*/.test(local_url) ? `
${css$1}
.dark span,.dark a,.dark p,.dark h1,.dark h2,.dark h3,.dark h4,.dark h5,
.dark .aside-wrap_2TTgM .anchor_wrapper_2leFH .anchor_item_3DKWq .text_H0qLc,
.dark .gameSns-content-account-text_2kf1l .title_3cbN0,.dark .gameSns-content-account-text_2kf1l .subtitle_3xtPu,
.dark .contactUs-content-info-item_3hznU .text_NvNTR,.dark .mine-header-userInfo_2PEyA .user-basic-nav_3ydDD .user-statistics-type_2qxNK,
.dark .mine-header-userInfo_2PEyA .user-basic-nav_3ydDD .user-statistics-num_13v1B,
.dark .gameSns-content-other-account_9YJ6O .wechat-text_2GmEa, .dark .gameSns-content-other-account_9YJ6O .weibo-text_35duF,
.dark .Card-header_1d4vx .card-title_2RmHu .title_SE4va,.dark .game-item-footer-score_2F75T .gameScoreNum_EuGJV,
.dark .Card-header_1BQ_x .card-title_HKAAg,.dark .collection-wrap_19zMo .collection-item_1UBgM .collection-item-game-name_c4Qj2,
.dark .collection-wrap_19zMo .collection-item_1UBgM .collection-item-game-count_SEbUq,
.dark .game-item-footer-name_2wzwp,.dark .game-item-footer-type_wMU_g,.dark .game-item-footer-no_269PI,
.dark .list-item-cont_27du8 .testGameItem_1xvId .gameDes_1vyj7 .gameScore-no_UmJz1,
.dark .bili-game-footer .bili-game-footer-content .bili-game-footer-content-record,
.dark .bili-game-footer .bili-game-footer-content .bili-game-footer-content-record p,
.dark .list-item-cont_27du8 .testGameItem_1xvId .gameDes_1vyj7 .gameScore_OHEKi .gameScoreNum_2smPo,
.dark .list-item-cont_27du8 .testGameItem_1xvId .gameDes_1vyj7 .gameName_OGhFc,
.dark .Card-header_3tA8E .card-title_3s7_S, .dark .hotActivity-item-time_h-F8o,
.dark .list-item-title_IY-UG .date_cylZ8, .dark .list-item-title_IY-UG .games-num_2LlQZ,
.dark .list-item-cont_1zPV3 .hotGameItem_EJS60 .gameDes_2fvpP .gameName_2u5sS,
.dark .loadComplete-txt_2z5n_,.dark .Card-header_1d4vx .card-title_2RmHu .title_SE4va,
.dark .Card-recomend-item_1FSJD .card-content_1oudE .card-content-title_370f1>div,
.dark .feed-wrap_3BqTh .card-game-common_2b0P9 .card-content-info-text_1DwU6 .card-content-info-name_2y0cn,
.dark .feed-wrap_3BqTh .card-game-common_2b0P9 .card-content-info-text_1DwU6 .card-content-info-des_27h0g,
.dark .Bookswiper_3q1oK .gallery-thumbs_2oCbc .swiper-thumb-slide .gallery-thumbs-item_3mq8s .game-info_2X55m .game-info-tag_3lnOf,
.dark .Bookswiper_3q1oK .gallery-thumbs_2oCbc .swiper-thumb-slide .gallery-thumbs-item_3mq8s .game-info_2X55m .game-info-name_1X85G,
.dark .Card-recomend-item_1FSJD .card-content_1oudE .card-content-footer_2WHGE .score-degree_DnAAx,
.dark .Card-recomend-item_1FSJD .card-content_1oudE .card-content-footer_2WHGE .score-comment_3P3Er,
.dark .Card-recomend-item_1FSJD .card-content_1oudE .card-content-des_1sNxd{
  color:var(--w-text-light) !important;
}


.dark .game-item-footer-name_2wzwp:hover,
.dark .game-item-footer-type_wMU_g:hover,
.dark .list-item-cont_27du8 .testGameItem_1xvId .gameDes_1vyj7 .gameName_OGhFc:hover,
.dark .video-item-biref .biref-info .biref-title:hover {
  color:var(--w-blue-link-hover) !important;
}


.dark .bili-game-footer,.dark .list_item_1gw1l,.dark .scroll-wrap_1vXo6 ,
.dark .Card-header_1d4vx .card-title_2RmHu .title_SE4va,
.dark .bili-game-header-nav .bili-game-header-nav-bar {
  background:var(--w-bg-darker) !important;
  color:var(--w-text-light) !important;
}


.dark .Home_1ebVE,
.dark .block-area .timeline-toggle-block .timeline-toggle-btn {
  background: none !important;
}


.dark .loadingTip-loadMore_1ydD3 .load_btn_2aV1A,.dark .body_RAI9S .aside_17bL3,
.dark .category-item_3tacB,.dark .collection-wrap_19zMo .collection-item_1UBgM,
.dark .tag_2uAvO{
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}

.dark .category-item_3tacB:hover,.dark .Card-header_1BQ_x .btn-more_1RGB7 a:hover,
.dark .loadingTip-loadMore_1ydD3 .load_btn_2aV1A:hover,
.dark .tag_2uAvO:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

` : ``;
  const is_link$1 = local_url.indexOf("https://link.bilibili.com/") !== -1;
  const link_css$1 = is_link$1 ? `
${css$1}

` : ``;
  const is_link = local_url.indexOf("https://message.bilibili.com/") !== -1;
  const link_css = is_link ? `

${css$1}


` : ``;
  local_url.indexOf("https://live.bilibili.com/") !== -1;
  const other = `
${account_css}
${app_bilibili}
${game_bilibili}
${link_css$1}
${link_css}
`;
  const read = /.*:\/\/.*\.bilibili\.com\/read\/.*/.test(local_url) ? `
.dark p,.dark a,.dark span,
.dark  h1,.dark  h2,.dark  h3,.dark  h4,.dark  h5,.dark  h6,
.dark .iconfont,
.dark #article-content,.dark .interaction-info,.dark .interaction-info .toolbar .share-box,
.dark .normal-article-holder,
.dark .normal-article-holder h1,
.dark .normal-article-holder h2,
.dark .normal-article-holder h3,
.dark .normal-article-holder h4,
.dark .normal-article-holder h5,
.dark .normal-article-holder h6,
.dark .article-container .title-container .title,
.dark .article-breadcrumb .breadcrumb-title,
.dark [class^=article-read-info]>span,
.dark .right-side-bar .to-top [class^=iconfont],
.dark .right-side-bar .side-toolbar [class^=toolbar-item],
.dark .coin-dialog-wrapper .coin-title,.dark .coin-dialog-wrapper .van-icon-guanbi,
.dark .right-side-bar .side-toolbar .toolbar-item [class^=iconfont]

{
  color:var(--w-text-light) !important;
}
.dark .ql-container,
.dark .right-side-bar [class^=to-top],
.dark .right-side-bar [class^=side-toolbar],
.dark [class^=follow-btn],
.dark .coin-dialog-wrapper .confirm-btn,
.dark .van-popover.van-followed,
.dark .right-side-bar [class^=catalog],
.dark .coin-dialog-wrapper,
.dark .article-read-info .spoiler[data-v-36aefa22],
.dark .article-read-info .spoiler,
.dark .article-container {
  border: 1px solid var(--w-border) !important;
  color:var(--w-text-light) !important;
  background-color:var(--w-bg-darker) !important;
}

.dark .article-container ,
.dark .comment-wrapper .comment-m,
.dark [class^=followed],
.dark [class^=article-up-info],
.dark .right-side-bar [class^=catalog]::after,
.dark .fixed-top-header {
  color:var(--w-text-light) !important;
  background-color:var(--w-bg-darker) !important;
}



.dark .nav-tool-container .section:hover,
.dark .right-side-bar .to-top [class^=iconfont]:hover,
.dark .right-side-bar [class^=to-top]:hover,
.dark .coin-dialog-wrapper .confirm-btn:hover,
.dark .nav-tool-container [class^=section]:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background-color:var(--w-bg-darker) !important;
}


.dark .coin-dialog-wrapper .van-icon-guanbi:hover {
  color:var(--w-blue-link-hover) !important;
}


.dark .van-popover.van-followed .follow_dropdown li:hover {
  background-color:var(--w-bg) !important;
  color:var(--w-blue-link-hover) !important;
}





` : ``;
  const space = /.*:\/\/space\.bilibili\.com\/\d+.*/.test(local_url) ? `
.dark .list-create {
  background:var(--w-bg) !important;
}

.dark input#pin-layer-search,
.dark .elec .elec-status-bg-grey,
.dark #pin-wrapper #pin-layer,
.dark #page-index #i-ann-content textarea,
.dark .bili-dyn-item,
.dark .bili-dyn-card-video__body,
.dark .bili-rich-text__content,
.dark .bili-dyn-card-video__desc,
.dark .bili-dyn-card-video__title,
.dark .series-item .item-title .qipapnum[data-v-40b5e135],
.dark .series-item .item-title .qipapnum,
.dark .contribution-sidenav .contribution-item,
.dark .album-list__tabs,
.dark #page-series-index .channel-option.no-channel[data-v-9e6dac30],
.dark #page-series-index .channel-option.no-channel,
.dark #page-series-index .channel-option,
.dark .bili-rich-textarea__inner.empty,
.dark .note-editor .rich-text-options,
.dark .note-header,
.dark .bili-header-m .header-search-suggest, 
.dark .international-header .header-search-suggest,
.dark #web-toolbar,
.dark .n .n-inner {
  background-color:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
}

.dark .n .n-cursor {
  background:var(--w-text-light) !important;
}


.dark #page-series-index .channel-option.no-channel p[data-v-9e6dac30],
.dark #page-series-index .channel-option.no-channel p,
.dark .album-list__title,.dark .album-list__tab-name,
.dark .small-item .meta,.dark .n .n-data .n-data-v, .dark .n .n-data .n-data-k,
.dark #page-series-index .channel-item .channel-name,.dark #page-series-index .channel-item , .dark #page-series-index .channel-item .channel-name[data-v-9e6dac30],
.dark #page-index .channel.guest .channel-item .channel-title .channel-name, .dark #page-index .channel.guest .channel-name, .dark #page-index .channel-name,
.dark #page-index .col-2 .section-title,
.dark #page-index .col-2 .section .user-auth .auth-description,
.dark .user-info .user-info-title [class^=info-title],
.dark .user-info .info-content [class^=info-command],
.dark .user-info .info-content [class^=info-value],
.dark #id-card .idc-content .idc-username,.dark .m-level idc-m-level,
.dark .idc-meta-item,
.dark .elec .elec-count,.dark .elec,
.dark .elec .elec-setting, .elec .elec-total-c-num,
.dark .elec-total-c,
.dark .user-info .info-content .info-tags .info-tag [class^=icon-tag],
.dark .user-info .info-content .info-tags .info-tag [class^=tag-content],
.dark #page-video #submit-video-type-filter a .count,
.dark #page-series-index .channel-index .breadcrumb[data-v-9e6dac30],
.dark #page-series-index .channel-index [class^=breadcrumb], 
.dark #page-series-index .channel-index .breadcrumb .item.cur[data-v-9e6dac30],
.dark #page-series-index .channel-index .breadcrumb .item.cur,
.dark .breadcrumb, .dark .breadcrumb .item.cur, .dark .breadcrumb .item,
.dark #page-setting .setting-privacy-item .setting-privacy-name,
.dark #page-setting .setting-privacy-item,
.dark #page-fav .fav-sidenav .nav-title .text,.dark #page-fav .fav-main .filter-item .text,.dark #page-fav .fav-main .filter-item,.dark #page-fav .fav-main,
.dark #page-index .channel .empty-state p,.dark #page-index .channel,.dark #page-index p,.dark .private-hint,.dark .section-title,
.dark #page-fav .fav-main .filter-item,.dark .be-dropdown-item, .dark #page-fav .fav-main .filter-item .filter-type .be-dropdown-item i, .dark #page-fav .fav-main .filter-item .filter-type .be-dropdown-item span, .dark #page-fav .fav-main .filter-item .filter-type .be-dropdown-item p,.dark #page-fav .fav-main .filter-item .filter-type .be-dropdown-item a,
.dark .favInfo-box .favInfo-details .fav-options .meta,.dark .favInfo-box .favInfo-details .fav-options,
.dark span,.dark .sub-tabs span, .dark .sub-tabs .filter-content,.dark .sub-tabs,.dark .sub-tab,
.dark .bili-dyn-title__text,.dark .bili-rich-textarea__inner,
.dark .bili-dyn-forward-publishing__editor .bili-rich-textarea__inner,
.dark .bili-popover, .dark .bili-popover__arrow,
.dark [class^=game-card__info-title],
.dark #pin-wrapper .pin-layer-vlist .small-item .title,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .play,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .icon,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .time,
.dark .list-item .desc,
.dark .opus-list [class^=opus-item-title],
.dark .opus-list [class^=opus-item-content],
.dark .section-title {
  color:var(--w-text-light) !important;
}


.dark #page-setting .setting-tag-list a,
.dark #page-fav .fav-sidenav .nav-title .text:hover{
  color:var(--w-text-light) !important;
}


.dark .col-1, .dark .co1-2,
.dark #page-index,.dark #page-index .col-1, 
.dark #page-index .col-2,
.dark #page-dynamic .bili-dyn-item,
.dark .i-m-r2,
.dark .i-m-upload,
.dark .bili-rich-textarea__inner,
.dark .i-pin-v .be-tab,
.dark .bili-popover, .dark .bili-popover__arrow,
.dark .section {
  border-color: var(--w-border) !important;
}




/* border-color color background */
.dark .section .count,
.dark .g-search input,
.dark #id-card,
.dark #page-index .col-1,
.dark #page-fav .fav-main .search-input input,
.dark .bili-topic-search__popover,
.dark #page-video #submit-video-type-filter,
.dark #page-dynamic .col-2 .section,
.dark #page-index .col-2 .section  {
  border-color: var(--w-border) !important;
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
}


.dark #page-index .channel, .dark #page-index .channel .channel-item,
.dark #page-index .col-1 .section-title,.dark #page-index .col-2 .section-title,
.dark .series-item .split-line[data-v-40b5e135],.dark .series-item .split-line,
.dark .g-search input:focus {
  border-color: var(--w-border) !important;
}

.dark .n .n-inner {
  box-shadow:none !important;
}


.dark .col-full,
.dark .btn,
.dark .btn.btn-large, 
.dark .btn.btn-large [class^=btn-content],
.dark .new-elec-trigger,
.dark .btn.idc-btn.default,
.dark .elec-status,
.dark .bili-dyn-more__menu, .dark .be-dropdown-menu,
.dark #page-series-index .channel-option.no-channel .create-channel,
.dark .favInfo-box.favEmpty .favInfo-details .fav-options .fav-play, 
.dark .favInfo-box.invalid .favInfo-details .fav-options .fav-play,
.dark .reply-box .box-normal [class^=reply-box-send]::after,
.dark .reply-box .box-normal [class^=reply-box-send],
.dark .be-dropdown-item:hover,
.dark .resizable-component .editor-innter,
.dark .btn.idc-btn.primary {
  color:var(--w-text-light) !important;
  background-color:var(--w-bg-darker) !important;
  border-color: var(--w-text) !important;
}


.dark #pin-wrapper .pin-layer-vlist .small-item .title:hover,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .play:hover,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .icon:hover,
.dark #pin-wrapper .pin-layer-vlist .small-item .meta .time:hover,
.dark #pin-wrapper .pin-layer-vlist .small-item:hover,
.dark #page-series-index .channel-option.no-channel [class^=create-channel]:hover,
.dark .favInfo-box.favEmpty .favInfo-details .fav-options .fav-play:hover, 
.dark .favInfo-box.invalid .favInfo-details .fav-options .fav-play:hover,
.dark .btn.primary.btn-large:hover,
.dark .btn:hover,
.dark .btn.btn-large [class^=btn-content]:hover,
.dark .btn.btn-large:hover,
.dark .bili-dyn-more__menu:hover,
.dark .contribution-sidenav .contribution-item:hover,
.dark .btn:hover,
.dark .reply-box .box-normal [class^=reply-box-send]:hover::after,
.dark .reply-box .box-normal .reply-box-send,
.dark .reply-box .box-normal .reply-box-send:hover,
.dark .new-elec-trigger:hover,
.dark .elec-status:hover,
.dark .btn.idc-btn.primary:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

.dark .btn.idc-btn.default:hover {
  color:var(--w-blue-link-hover) !important;
  border:1px solid var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

.dark #page-setting #setting-new-tag-btn,
.dark #page-setting .setting-tag-list a,
.dark #page-setting #setting-new-tag {
  background:var(--w-bg) !important;
  border-color: var(--w-text) !important;
}

.dark #page-fav .fav-sidenav .fav-item.cur ,
.dark #page-fav .fav-sidenav .fav-item:hover  {
  background:var(--w-bg) !important;
}


.dark .h .h-v-host {
  color:  var(--w-white) !important;
  background: var(--w-blue-link-hove) !important;
}

.dark .elec .elec-status {
  background-image: none !important;
}



` : ``;
  const t = `
.dark .bili-dyn-card-video__body,
.dark .bili-dyn-card-ugc__wrap,
.dark .bili-dyn-card-goods .bili-dyn-card-goods__wrap,
.dark .reference .bili-dyn-card-goods__wrap,
.dark .bili-dyn-card-reserve .bili-dyn-card-reserve__card,
.dark .reference .bili-dyn-card-reserve__card 
{
  background-color:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
  border: 1px solid var(--w-border-dark) !important;
}
.dark .bili-dyn-up-list__item__name {
  color:var(--w-text) !important;
}

.dark .bili-dyn-up-list__item__name:hover {
  color:var(--w-blue-link-hover) !important;
}

`;
  const video = `

html {
  --graph_bg_thick:var(--w-border-dark);
}


.dark .bpx-player-dm-btn-time,
.dark .bpx-player-dm-btn-dm,
.dark .bpx-player-dm-btn-date,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-dm,
.dark .members-info-container .container,
.dark .bpx-player-contextmenu>li,
.dark .reply-item .root-reply-container .content-warp .user-info .user-name[data-v-eb69efad],
.dark .sub-reply-item .sub-user-info .sub-user-name[data-v-26797283],
.dark #reco_list,
.dark [class^=up-info-container],
.dark .left-container,
.dark .bili-header__bar,
.dark .bpx-player-sending-bar,
.dark .harmony-font,
.dark #v_desc,
.dark .bili-comment.browser-pc,
.dark .comment-container, .dark .bpx-player-auxiliary .bpx-player-dm-function,
.dark .reply-header,.dark .arc_toolbar_report,.dark .video-toolbar-left,
.dark .bui-collapse .bui-collapse-header,
.dark .bpx-player-auxiliary .bpx-player-collapse .bui-collapse-body,
.dark .bpx-player-auxiliary .bpx-player-contextmenu.bpx-player-white,
.dark .bpx-player-auxiliary .bpx-player-dm-wrap,
.dark .bpx-player-dm-load-status,
.dark .base-video-sections-v1,
.dark [class^=video-sections-v1],
.dark .video-sections-head_second-line,
.dark .bili-header [class^=header-login-entry],
.dark [class^=vip-login-tip],
.dark .reply-box[class^=fixed-box],
.dark .at-panel .at-list-container .at-list-ground .at-user-list [class^=at-user-item],
.dark .emoji-panel, .dark .emoji-panel [class^=emoji-content],
.dark .emoji-panel [class^=emoji-tab],
.dark .emoji-panel [class^=emoji-title],
.dark .note-list,
.dark .note-list [class^=list-note-operation],
.dark .note-list .note-card-container [class^=note-card],
.dark .user-card-m-exp .user-info-wrapper .face,
.dark #app [class^=header],
.dark #app .container .textarea .textarea-warp textarea[data-v-67c4001b],
.dark #app .container .textarea .textarea-warp textarea,
.dark #app [class^=submit],
.dark .coin-operated-m-exp,
.dark .video-ai-assistant.video-toolbar-right-item.toolbar-right-ai,
.dark .ai-summary-popup,
.dark .bpx-player-auxiliary .bpx-player-dm-management,
.dark .ai-summary-popup *,
.dark [class^=recommend-list],
.dark .mini-header {
  background-color:var(--w-bg-darker) !important;
  color:var(--w-text) !important;
}



.dark .reply-box[class^=fixed-box],
.dark .reply-box .box-expand .reply-box-emoji [class^=emoji-btn],
.dark [class^=emoji-panel], .dark .reply-box [class^=box-expand] [class^=at-btn],
.dark .arc_toolbar_report,
.dark .video-toolbar-container,
.dark #v_tag {
  border-color:var(--w-border) !important;
}

.dark .collection-m-exp .title,
.dark .reply-item [class^=bottom-line]{
  border-color:var(--w-border) !important;
}



.dark .collection-m-exp .content .group-list li label .count, 
.dark .collection-m-exp .content .group-list li label,.dark .collection-m-exp,
.dark .collection-m-exp .content .group-list li label .personal,
.dark .collection-m-exp .content .group-list,.dark .collection-m-exp .content,
.dark .at-panel .at-list-container .at-list-ground .at-user-list .at-user-item .user-info [class^=user-fan],
.dark .at-panel .at-list-container .at-list-ground [class^=ground-name],
.dark .user-card-m-exp .user-info-wrapper .info p ,
.dark .user-card-m-exp .user-info-wrapper .info .sign,
.dark .user-card-m-exp .user-info-wrapper .info .social a ,
.dark #app .container [class^=question],
.dark #app .container .textarea .textarea-warp [class^=limit],
.dark .collection-m-exp .content .group-list li,
.dark .note-list .note-card-container .note-card [class^=note-info]
{

  color:var(--w-text) !important;
}


.dark .bpx-player-contextmenu>li,
.dark .bpx-player-sending-bar .bpx-player-video-info,
.dark .bpx-player-video-info-dm,
.dark .bpx-player-video-info-online,
.dark .at-panel .at-list-container .at-list-ground .at-user-list .at-user-item .user-info [class^=user-name],
.dark .at-panel [class^=panel-title],
.dark .reply-box .box-expand .reply-box-emoji [class^=emoji-btn],
.dark .reply-box .box-expand [class^=at-btn],
.dark .arc_toolbar_report,
.dark .bpx-player-video-info-online,
.dark .bpx-player-video-info-divide,
.dark .bpx-player-video-info-dm,
.dark .basic-desc-info,
.dark .desc-info-text,
.dark .reply-content-container .reply-content,
.dark .root-reply,
.dark .play-num, 
.dark .abstract,
.dark .reply-item .root-reply-container .content-warp .user-info [class^=user-name],
.dark .mini-header__title,
.dark .toggle-btn-text,
.dark .video-toolbar-left-item,
.dark .video-complaint-info [class^=video-toolbar-item-text],
.dark .video-note .video-toolbar-right-item [class^=toolbar-right-note],
.dark .bpx-player-sending-bar .bpx-player-video-info,
.dark .mini-header .right-entry .right-entry__outside .right-entry-icon,
.dark .bpx-player-dm-btn-time,.dark .bpx-player-dm-btn-dm,.dark.bpx-player-dm-btn-date,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-dm,
.dark .bpx-player-auxiliary .bpx-player-contextmenu.bpx-player-white>li,
.dark .dm-info-date,.dark .first-line-title, .dark .cur-page,
.dark .bili-header .header-login-entry>img[data-v-fc330406],
.dark .bili-header .header-login-entry>img,
.dark .bili-header .login-panel-popover [class^=register-tip],
.dark .bili-header .login-panel-popover [class^=login-btn],
.dark .bili-header .login-panel-popover [class^=register-tip]>a,
.dark .vip-login-countdown-row [class^=countdown-lable],
.dark .vip-login-countdown-row [class^=counddown-wrap],
.dark .vip-login-countdown-row [class^=counddown-wrap] span,
.dark [class^=vip-login-title],
.dark [class^=vip-login-subtitle],
.dark .video-page-card-small .card-box .info .title,
.dark .bili-header .upload-panel-popover .upload-item [class^=item-title],
.dark .video-page-card-small .card-box .info .upname,
.dark .video-page-card-small .card-box .info .playinfo,
.dark .next-button .txt,.dark .video-episode-card__info-title, .dark .video-episode-card__info-duration,
.dark .membersinfo-normal .header [class^=staff-amt],
.dark .reply-header .reply-navigation .nav-bar .nav-title [class^=nav-title-text],
.dark .bili-header .login-panel-popover [class^=register-exper],
.dark .reply-header .reply-navigation .nav-bar .nav-sort.hot [class^=hot-sort],
.dark .reply-header .reply-navigation .nav-bar .nav-sort.time [class^=time-sort],
.dark .sub-reply-item .sub-user-info [class^=sub-user-name],
.dark .video-info-container [class^=video-title],
.dark [class^=video-info-detail],
.dark .reply-box.disabled .box-normal .reply-box-send [class^=send-text],
.dark .sub-reply-list .view-more [class^=view-more-paginatio],
.dark .note-list .note-card-container .note-card [class^=note-content],
.dark .note-list .note-card-container .note-card .user-info [class^=user-name],
.dark .recommend-list-v1 .rec-title,.dark .recommend-list-v1 [class^=rec-title],
.dark .video-toolbar-right-item, 
.dark .video-note[class^=video-toolbar-right-item],
.dark .user-card-m-exp .user-info-wrapper .info .social .tip_text,
.dark .user-card-m-exp .user-info-wrapper .info .official-wrapper,
.dark .user-card-m-exp .user-info-wrapper .info .user .name,
.dark .coin-operated-m-exp .coin-title,.dark .coin-operated-m-exp .like-checkbox,
.dark .coin-operated-m-exp .coin-bottom .tips,
.dark .collection-m-exp .title,
.dark .video-title {
  color:var(--w-text-light) !important;
}


.dark .user-card-m-exp .user-info-wrapper .info .user .name:hover,
.dark .video-page-card-small .card-box .info .title:hover,
.dark .bili-header .upload-panel-popover .upload-item [class^=item-title]:hover,
.dark .video-page-card-small .card-box .info .upname:hover,
.dark .video-episode-card:hover .video-episode-card__info-title,
.dark .video-episode-card:hover .video-episode-card__info-duration,
.dark .base-video-sections-v1 .video-section-list .video-episode-card__info-playing .video-episode-card__info-title,
.dark .base-video-sections-v1 .video-section-list .video-episode-card__info-playing .video-episode-card__info-duration,
.dark .first-line-title:hover,
.dark .video-complaint-info [class^=video-toolbar-item-text]:hover,
.dark .video-note [class^=video-toolbar-right-item] [class^=toolbar-right-note]:hover,
.dark .mini-header .right-entry .right-entry__outside .right-entry-icon:hover,
.dark .mini-header__title:hover,.dark .toggle-btn-text:hover,
.dark .bili-header .login-panel-popover  [class^=login-btn]:before,
.dark .bili-header .login-panel-popover  [class^=login-btn]:hover:before,
.dark .bili-header .login-panel-popover  [class^=login-btn]:hover:before,
.dark .bili-header .login-panel-popover [class^=register-tip]>a:hover,
.dark .reply-header .reply-navigation .nav-bar .nav-title [class^=nav-title-text]:hover,
.dark .user-card-m-exp .user-info-wrapper .info .social a:hover

{
  color:var(--w-blue-link-hover) !important;
}

.dark #tags .tag,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-block-btn,
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-protect-btn, 
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-recall-btn, 
.dark .bpx-player-auxiliary .bpx-player-dm-container .dm-info-row .dm-info-report-btn ,
.dark [class^=at-panel],
.dark .at-panel .at-list-container .at-list-ground .at-user-list [class^=at-user-item]:hover,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-footer,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-history.bpx-player-disable,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-history,
.dark .membersinfo-normal [class^=header],
.dark .reply-box .box-normal .reply-box-warp [class^=reply-box-textarea],
.dark .vip-login-countdown-row .counddown-wrap span[data-v-fc330406],
.dark .vip-login-countdown-row .counddown-wrap span,
.dark .reply-tag-item,
.dark [class^=vip-login-btn],
.dark .bili-header .header-upload-entry, 
.dark .second-line_right,
.dark .reply-box.disabled .box-normal .reply-box-warp [class^=disable-mask],
.dark .reply-box.disabled .box-normal .reply-box-warp .disable-mask .no-login-mask [class^=login-btn],
.dark .recommend-list-v1 [class^=rec-footer],
.dark .reply-box .box-normal [class^=reply-box-send],
.dark .reply-box [class^=reply-box-send],
.dark .video-tool-more-popover .video-tool-more-dropdown .dropdown-item,
.dark .video-tool-more-popover, 
.dark .user-card-m-exp .user-info-wrapper .info .user .user-label,
.dark .user-card-m-exp .user-info-wrapper .info .btn-box .like ,
.dark .user-card-m-exp .user-info-wrapper .info .btn-box .liked,
.dark .user-card-m-exp .user-info-wrapper .info .btn-box .message,
.dark #app .submit [class^=cancel],
.dark #app .submit [class^=confirm],
.dark .coin-operated-m,
.dark .coin-operated-m-exp .coin-bottom .bi-btn,
.dark .collection-m-exp,
.dark .primary-btn,
.dark .palette-button-wrap [class^=flexible-roll-btn-inner],
.dark .collection-m-exp .content .group-list .add-group .add-btn,
.dark .collection-m-exp .bottom .btn.disable,
.dark .collection-m-exp .bottom .btn,
.dark .video-ai-assistant-badge,
.dark .fixed-sidenav-storage [class^=fixed-sidenav-storage-item],
.dark .video-tag-container .tag-panel .tag [class^=show-more-btn],
.dark .video-tag-container .tag-panel .tag-link {
  color:var(--w-text-light) !important;
  background:var(--w-bg-darker) !important;
  border:1px solid var(--w-border) !important;
}


.dark .collection-m-exp .bottom .btn.disable:hover,.dark .collection-m-exp .bottom .btn:hover,
.dark .collection-m-exp .content .group-list .add-group .add-btn:hover,
.dark .coin-operated-m-exp .coin-bottom .bi-btn:hover,
.dark #app .submit [class^=cancel]:hover,
.dark #app .submit [class^=confirm]:hover,
.dark .fixed-sidenav-storage [class^=fixed-sidenav-storage-item]:hover,
.dark .primary-btn:hover,
.dark .palette-button-wrap [class^=flexible-roll-btn-inner]:hover,
.dark .dark .user-card-m-exp .user-info-wrapper .info .btn-box .message:hover,
.dark .user-card-m-exp .user-info-wrapper .info .user .user-label:hover,
.dark .user-card-m-exp .user-info-wrapper .info .btn-box .liked:hover,
.dark .user-card-m-exp .user-info-wrapper .info .btn-box .like:hover ,
.dark .reply-box.disabled .box-normal .reply-box-warp .disable-mask .no-login-mask [class^=login-btn]:hover,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-footer:hover,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-history.bpx-player-disable:hover,
.dark .bpx-player-auxiliary .bpx-player-dm-btn-history:hover,
.dark .second-line_right:hover,
.dark [class^=vip-login-btn]:hover,
.dark .bili-header .header-upload-entry:hover,
.dark .recommend-list-v1 [class^=rec-footer]:hover,
.dark .reply-box .box-normal [class^=reply-box-send]:hover,
.dark .reply-box [class^=reply-box-send]:hover,
.dark .video-tag-container .tag-panel .tag [class^=show-more-btn]:hover,
.dark .video-tag-container .tag-panel .tag-link:hover {
  color:var(--w-blue-link-hover) !important;
  border-color: var(--w-blue-link-hover) !important;
  background:var(--w-bg-darker) !important;
}

.dark .bpx-player-dm-setting-wrap,
.dark .bpx-player-dm-setting,
.dark .bui-dropdown-icon,
.dark .bui-collapse .bui-collapse-header .bui-collapse-arrow .bui-collapse-arrow-text .arrow-icon,
.dark .bui-danmaku-switch  {
  fill:var(--w-text-light) !important;
}


.dark #bilibili-player-placeholder {
  box-shadow: none !important;
}


.dark .header-upload-entry__text,
.dark .header-upload-entry__icon,
.dark .reply-box .box-normal .reply-box-warp .reply-box-textarea {
  border: none !important;
}

/* 视频三连 */
.dark .video-fav.video-toolbar-left-item.on,
.dark .video-coin.video-toolbar-left-item.on,
.dark .video-like.video-toolbar-left-item.on {
  color:var(--w-blue-link-hover) !important;
}




`;
  const isUrl = window.location.href.indexOf("https://www.bilibili.com/bangumi/play") !== -1;
  const bangumiCss = isUrl ? `

.dark * {
  color:var(--w-text-light) !important;
  border-color: var(--w-border) !important;
  outline-color: var(--w-border) !important;
}


.dark .SectionSelector_SectionSelector__TZ_QZ .SectionSelector_expand__VjjPD,
.dark .home-container,.dark #__next,.dark .main-container,
.dark .plp-r *,
.dark .mediainfo_mediaInfo__Cpow4 *{
  color:var(--w-text-light) !important;
  border-color: var(--w-border) !important;
  outline-color: var(--w-border) !important;
  background-color:var(--w-bg-darker) !important;
}

.dark .SectionSelector_expand__VjjPD {
  background:var(--w-bg-darker) !important;
}

.dark .bili-avatar-icon.bili-avatar-right-icon{
  display:none !important;
}


.dark .reply-box .box-normal .reply-box-send .send-text[data-v-757acbb5],
.dark .reply-box .box-normal .reply-box-send [class^=send-text] {
  background:none !important;
}


.dark * [class^=imageListItem_title][class^=imageListItem_active]:hover,
.dark * [class^=imageListItem_title]:hover,
.dark * .ep-title:hover {
  color:var(--w-blue-link-hover) !important;
}



` : ``;
  const isAccaout = window.location.href.indexOf("https://www.bilibili.com/account") !== -1 || window.location.href.indexOf("https://www.bilibili.com/v/customer-service") !== -1;
  const dark$1 = isAccaout ? `
${commonDark}
` : ``;
  const router = `
${home}
${video}
${space}
${blackboard}
${t}
${anime}
${guochuang}
${douga}
${read}
${bangumiCss}
${dark$1}
`;
  const dark = `
${common}
${router}
${other}

`;
  const is_hot = () => isShowHotSearch() ? `` : `
.search-panel .trending {
   display:none !important;
}

`;
  const css = is_bilibili ? `
.pop-live-small-mode,.vip-login-tip,
#slide_ad,
.ad-report,
div#i_cecream .floor-single-card,
div#i_cecream .bili-live-card.is-rcmd,
div#i_cecream .adblock-tips,
.activity-m-v1,#right-bottom-banner,
div.video-container-v1 div.pop-live-small-mode.part-undefined,
.recommended-swipe.grid-anchor,
.desktop-download-tip,
.video-page-special-card-small,
.recommended-swipe
{
   display:none !important;
}

/* 输入框*/
.nav-search-content .nav-search-input::placeholder,
#nav_searchform>input::placeholder,
.nav-search-content>input::placeholder {
   color: transparent;
   opacity:0 !important;
}

.m-bilibili-btn {
   cursor: pointer !important;
   background: #FFFFFF !important;
   background: var(--bg1_float) !important;
   border: 1px solid #E3E5E7 !important;
   border: 1px solid var(--line_regular) !important;
   border-radius: 8px !important;
   box-sizing: border-box !important;
   padding: 6px !important;
   margin-bottom: 6px !important;
   color: #18191C !important;
   color: var(--text1) !important;
   line-height: 14px;
   font-size: 12px;
   display: flex;
   flex-direction: column;
   align-items: center;
   width: 40px;
}

.m-span-text {
   transition: all 0.3s ease ;
   cursor: pointer  ;
   opacity: 0 ;
   float:right ;
   display:inline-block ;
   margin:0 10px ;
   transform: scale(0.5) ;
   font-size:20px ;
   position:relative ;
 }
 
 .m-span-text::before{
   content:"🧹" ;
   cursor: pointer ;
 }

.bili-video-card__info--bottom:hover .m-span-text,
.video-page-card-small:hover .m-span-text,
.up-info-container:hover .m-span-text,
.video-page-operator-card-small:hover .m-span-text
{
   opacity: 1;
   transform: scale(1.1);
   color:orange;
}

#reco_list,
[class^=up-info-container],
.members-info-container .container,
.left-container{
   background: #fff !important;
   padding:0 20px;
}


#reco_list {
   padding:6px;
}

${is_hot()}





${dark}
` : "";
  addStyle(
    `
  ${root$1}
  ${css$4}
  ${css$3}
  ${css}
  ${css$2}
`
  );
  (function() {
    if (typeof window == "undefined") {
      return;
    }
    if (window == null ? void 0 : window.LivePluginLoadingComplate) {
      return;
    }
    if (is_exculues) {
      return;
    }
    customElements.define("live-plugin-element", LivePluginElement);
    try {
      installCommand();
    } catch (error2) {
      console.error("live-plugin:", error2);
    }
    if (!isAutoPlugin()) {
      log("插件已关闭!");
      return;
    }
    let pluginSupport = true;
    try {
      if (is_huya) {
        new TriggerLive();
      } else if (is_douyu) {
        new FishLive();
      } else if (is_bilibili) {
        new BiliBili();
      } else if (is_douyin) {
        new DouYin();
      } else if (is_localhost) {
        new LivePlugin();
      } else {
        pluginSupport = false;
        error("插件地址不适配，请检查匹配地址！！！");
      }
    } catch (e) {
      pluginSupport = false;
      console.error(e);
    }
    try {
      if (pluginSupport) {
        login$1();
        updateDarkClass();
      }
    } catch (e) {
      error("other pluing error info live-plugin:", e);
    }
    window.LivePluginLoadingComplate = true;
    if (pluginSupport) {
      console.log(
        "%c%s%c%s",
        "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); padding: 2px;  border-radius: 20px 0 0 20px; color: #fff;font-size:12px;",
        `欢迎使用live-plugin 下载地址:`,
        "background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%); padding: 2px; border-radius: 0 20px 20px 0; color: #fff;font-size:12px;",
        download_plugin_url
      );
      console.log(
        "%c%s%c%s",
        " background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);padding: 2px; border-radius: 20px 0 0 20px; color: #fff;font-size:16px;",
        `源码地址:`,
        "background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%); padding: 2px; border-radius: 0 20px 20px 0; color: #fff;font-size:16px;",
        source_code_url
      );
    }
  })();

})();