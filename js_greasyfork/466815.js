// ==UserScript==
// @name         BiliReveal - 哔哩哔哩网页版显示 IP 属地
// @namespace    http://zhangmaimai.com
// @version      1.6.9
// @author       MaxChang3
// @description  我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？在哔哩哔哩网页版大部分场景中显示 IP 属地。
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/v/topic/detail/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://www.bilibili.com/blackroom/ban/*
// @match        https://www.bilibili.com/read/*
// @match        https://manga.bilibili.com/detail/*
// @match        https://www.bilibili.com/v/topic/detail*
// @require      https://update.greasyfork.org/scripts/449444/1081400/Hook%20Vue3%20app.js
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/466815/BiliReveal%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA%20IP%20%E5%B1%9E%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/466815/BiliReveal%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA%20IP%20%E5%B1%9E%E5%9C%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const REPLACEMENTS_KEY = "locationReplacements";
  const safeJSONParse = (text, defaultValue) => {
    try {
      return JSON.parse(text);
    } catch {
      return defaultValue;
    }
  };
  const parseReplacements = (rawJson) => {
    const json = _GM_getValue(REPLACEMENTS_KEY, "{}");
    const parsed = safeJSONParse(json, {});
    return new Map(Object.entries(parsed));
  };
  const replacements = parseReplacements();
  const preprocessLocation = (location2) => {
    if (!location2 || replacements.size === 0) return location2;
    let result = location2;
    for (const [target, replacement] of replacements) {
      if (result.includes(target)) {
        result = result.replaceAll(target, replacement);
      }
    }
    return result;
  };
  const getLocationString = (replyItem) => {
    const locationString = replyItem?.reply_control?.location;
    return preprocessLocation(locationString);
  };
  const fromError = (error) => error instanceof Error ? error.message : String(error);
  const registerConfigMenus = () => {
    _GM_registerMenuCommand("配置文本替换", () => {
      const currentRules = JSON.stringify(Object.fromEntries(replacements), null, 2);
      const input = prompt(
        '请输入新的位置替换规则（JSON格式的键值对，例如 {"旧字符串": "新字符串"}）：',
        currentRules
      );
      if (!input) {
        alert("替换规则未更改。");
        return;
      }
      try {
        const parsed = JSON.parse(input);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          throw new Error("必须是键值对对象格式");
        }
      } catch (error) {
        alert(`JSON 格式错误：${fromError(error)}`);
        return;
      }
      _GM.setValue(REPLACEMENTS_KEY, input).then(() => {
        location.reload();
      }).catch((error) => {
        alert(`更新替换规则失败：${fromError(error)}`);
      });
    });
  };
  const isElementLoaded = async (selector, root = document) => {
    const getElement = () => root.querySelector(selector);
    return new Promise((resolve) => {
      const element = getElement();
      if (element) return resolve(element);
      const observer = new MutationObserver((_) => {
        const element2 = getElement();
        if (!element2) return;
        resolve(element2);
        observer.disconnect();
      });
      observer.observe(root === document ? root.documentElement : root, {
        childList: true,
        subtree: true
      });
    });
  };
  const isConditionTrue = async (fn) => {
    const timeStart = performance.now();
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (performance.now() - timeStart > 1e4) {
          clearInterval(interval);
          resolve(false);
        }
        if (!fn()) return;
        clearInterval(interval);
        resolve(true);
      }, 100);
    });
  };
  class Router {
    routes = [];
    serve(prefix, action, constrait = {}) {
      if (Array.isArray(prefix)) {
        prefix.forEach((p) => this.routes.push({ prefix: p, action, constrait }));
        return;
      }
      this.routes.push({ prefix, action, constrait });
    }
    match(url) {
      for (const { prefix, action, constrait } of this.routes) {
        if (!url.startsWith(prefix)) continue;
        if (constrait.endsWith && !url.endsWith(constrait.endsWith)) continue;
        action();
        break;
      }
    }
  }
  const createPatch = (ActionButtonsRender) => {
    const applyHandler = (target, thisArg, args) => {
      const result = Reflect.apply(target, thisArg, args);
      const pubDateEl = thisArg.shadowRoot.querySelector("#pubdate");
      if (!pubDateEl) return result;
      let locationEl = thisArg.shadowRoot.querySelector("#location");
      const locationString = getLocationString(thisArg.data);
      if (!locationString) {
        if (locationEl) locationEl.remove();
        return result;
      }
      if (locationEl) {
        locationEl.textContent = locationString;
        return result;
      }
      locationEl = document.createElement("div");
      locationEl.id = "location";
      locationEl.textContent = locationString;
      pubDateEl.insertAdjacentElement("afterend", locationEl);
      return result;
    };
    ActionButtonsRender.prototype.update = new Proxy(ActionButtonsRender.prototype.update, { apply: applyHandler });
    return ActionButtonsRender;
  };
  const hookLit = () => {
    const { define: originalDefine } = _unsafeWindow.customElements;
    const applyHandler = (target, thisArg, args) => {
      const [name, classConstructor, ...rest] = args;
      if (typeof classConstructor !== "function" || name !== "bili-comment-action-buttons-renderer")
        return Reflect.apply(target, thisArg, args);
      const PatchActionButtonsRender = createPatch(classConstructor);
      return Reflect.apply(target, thisArg, [name, PatchActionButtonsRender, ...rest]);
    };
    _unsafeWindow.customElements.define = new Proxy(originalDefine, {
      apply: applyHandler
    });
  };
  const injectBBComment = async (bbComment, { blackroom } = { blackroom: false }) => {
    const { _createListCon: createListCon, _createSubReplyItem: createSubReplyItem } = bbComment.prototype;
    const applyHandler = (target, thisArg, args) => {
      const [item] = args;
      const result = Reflect.apply(target, thisArg, args);
      const replyTimeRegex = /<span class="reply-time">(.*?)<\/span>/;
      if (blackroom) {
        const blackroomRegex = /<span class="time">(.*?)<\/span>/;
        return result.replace(blackroomRegex, `<span class="time">$1&nbsp;&nbsp;${getLocationString(item)}</span>`);
      }
      return result.replace(
        replyTimeRegex,
        `<span class="reply-time">$1</span><span class="reply-location">${getLocationString(item)}</span>`
      );
    };
    bbComment.prototype._createListCon = new Proxy(createListCon, {
      apply: applyHandler
    });
    bbComment.prototype._createSubReplyItem = new Proxy(createSubReplyItem, {
      apply: applyHandler
    });
  };
  const hookBBComment = async ({ blackroom } = { blackroom: false }) => {
    if (_unsafeWindow.bbComment) {
      injectBBComment(_unsafeWindow.bbComment, { blackroom });
      return;
    }
    let bbComment;
    Object.defineProperty(_unsafeWindow, "bbComment", {
      get: () => bbComment,
      set: (value) => {
        bbComment = value;
        injectBBComment(value, { blackroom });
      },
      configurable: true
    });
  };
  const getLocationFromReply = (replyItemEl) => {
    let replyElement;
    let locationString;
    if (replyItemEl.className.startsWith("sub")) {
      replyElement = replyItemEl;
      locationString = getLocationString(replyElement?.__vue__.vnode.props.subReply);
    } else {
      replyElement = replyItemEl;
      locationString = getLocationString(replyElement?.__vue__.vnode.props.reply);
    }
    return locationString;
  };
  const insertLocation = (replyItemEl) => {
    const replyInfo = replyItemEl.className.startsWith("sub") ? replyItemEl.querySelector(".sub-reply-info") : replyItemEl.querySelector(".reply-info");
    if (!replyInfo) throw new Error("Can not detect reply info");
    const locationString = getLocationFromReply(replyItemEl);
    if (locationString && replyInfo.children.length !== 0 && !replyInfo.children[0].innerHTML.includes("IP属地")) {
      replyInfo.children[0].innerHTML += `&nbsp;&nbsp;${locationString}`;
    }
  };
  const isReplyItem = (el) => el instanceof HTMLDivElement && ["reply-item", "sub-reply-item"].includes(el.className);
  const observeAndInjectComments = async (root) => {
    const targetNode = await isElementLoaded(".reply-list", root);
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") continue;
        mutation.addedNodes.forEach((node) => {
          if (!isReplyItem(node)) return;
          insertLocation(node);
          if (node.className.startsWith("sub")) return;
          const subReplyListEl = node.querySelector(".sub-reply-list");
          if (!subReplyListEl) return;
          const subReplyList = Array.from(subReplyListEl.children);
          subReplyList.pop();
          subReplyList.map(insertLocation);
        });
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
  };
  const serveNewComments = async (itemSelector, root = document) => {
    const dynList = await isElementLoaded(itemSelector, root);
    let lastObserved;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList" || !(mutation.target instanceof HTMLElement) || !mutation.target.classList.contains("bili-comment-container") || mutation.target === lastObserved)
          continue;
        observeAndInjectComments(mutation.target);
        lastObserved = mutation.target;
      }
    });
    observer.observe(dynList, { childList: true, subtree: true });
  };
  const router = new Router();
  router.serve(
    [
      /** 视频 */
      "https://www.bilibili.com/video/",
      /** 新列表 */
      "https://www.bilibili.com/list/",
      /** 新版单独动态页 */
      "https://www.bilibili.com/opus/",
      /** 课程页 */
      "https://www.bilibili.com/cheese/play/",
      /** 话题页 */
      "https://www.bilibili.com/v/topic/detail"
    ],
    hookLit
  );
  router.serve(
    /** 活动页 */
    "https://www.bilibili.com/blackboard/",
    observeAndInjectComments
  );
  router.serve(
    /** 拜年祭 */
    "https://www.bilibili.com/festival/",
    hookBBComment
  );
  router.serve(
    /** 专栏 */
    "https://www.bilibili.com/read/",
    async () => {
      observeAndInjectComments();
      const articleDetail = await isElementLoaded(".article-detail");
      await isConditionTrue(() => {
        const readInfo = document.querySelector(".article-read-info");
        return !!(readInfo && readInfo.lastElementChild?.textContent !== "--评论");
      });
      const publishText = articleDetail.querySelector(".publish-text");
      if (!publishText || !articleDetail.__vue__?.readViewInfo?.location) return;
      publishText.innerHTML += `&nbsp;&nbsp;IP属地：${articleDetail.__vue__.readViewInfo.location}`;
    }
  );
  router.serve("https://www.bilibili.com/bangumi/play/", () => {
    const isNewBangumi = !!document.querySelector("meta[name=next-head-count]");
    if (isNewBangumi) {
      hookLit();
    } else {
      hookBBComment();
    }
  });
  router.serve("https://www.bilibili.com/v/topic/detail/", () => serveNewComments(".list-view"));
  router.serve(
    "https://space.bilibili.com/",
    async () => {
      const biliMainHeader = await isElementLoaded("#biliMainHeader");
      const isFreshSpace = biliMainHeader?.tagName === "HEADER";
      if (isFreshSpace) {
        hookLit();
      } else {
        serveNewComments(".bili-dyn-list__items");
      }
    },
    { endsWith: "dynamic" }
  );
  router.serve("https://space.bilibili.com/", async () => {
    const biliMainHeader = await isElementLoaded("#biliMainHeader");
    const isFreshSpace = biliMainHeader?.tagName === "HEADER";
    if (isFreshSpace) {
      const dyanmicTab = await isElementLoaded(".nav-tab__item:nth-child(2)");
      dyanmicTab.addEventListener(
        "click",
        () => {
          hookLit();
        },
        { once: true }
      );
    } else {
      const dynamicTab = await isElementLoaded(".n-dynamic");
      dynamicTab.addEventListener(
        "click",
        () => {
          serveNewComments(".bili-dyn-list__items");
        },
        { once: true }
      );
    }
  });
  router.serve(
    "https://t.bilibili.com/",
    async () => {
      const dynHome = await isElementLoaded(".bili-dyn-home--member");
      const isNewDyn = (() => {
        const dynBtnText = dynHome.querySelector(".bili-dyn-sidebar__btn")?.textContent;
        return dynBtnText ? dynBtnText.includes("新版反馈") || dynBtnText.includes("回到旧版") : false;
      })();
      if (isNewDyn) {
        hookLit();
      } else {
        hookBBComment();
      }
    },
    { endsWith: "/" }
  );
  router.serve("https://t.bilibili.com/", async () => {
    const dynItem = await isElementLoaded(".bili-dyn-item");
    const isNewDyn = !dynItem.querySelector(".bili-dyn-item__footer");
    if (isNewDyn) {
      hookLit();
    } else {
      hookBBComment();
    }
  });
  router.serve("https://www.bilibili.com/blackroom/ban/", () => hookBBComment({ blackroom: true }));
  router.serve("https://manga.bilibili.com/detail/", observeAndInjectComments);
  const { origin, pathname } = new URL(location.href);
  const urlWithoutQueryOrHash = `${origin}${pathname}`;
  router.match(urlWithoutQueryOrHash);
  registerConfigMenus();

})();