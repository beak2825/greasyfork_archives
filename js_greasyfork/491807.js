// ==UserScript==
// @name         南×
// @namespace    npm/vite-plugin-monkey
// @version      1.0.1
// @author       monkey
// @description  南+（south-plus）论坛使用体验优化脚本。
// @license      MIT
// @icon         https://bbs.imoutolove.me/favicon.ico
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491807/%E5%8D%97%C3%97.user.js
// @updateURL https://update.greasyfork.org/scripts/491807/%E5%8D%97%C3%97.meta.js
// ==/UserScript==

(function ($) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  function parseQueryParams(search) {
    var _a;
    const htmlString = (_a = search.match(/\?(.+)\.html$/)) == null ? void 0 : _a[1];
    const queryParams = {};
    if (htmlString) {
      const queryParamsPairs = htmlString.split("-");
      for (let i = 0; i < queryParamsPairs.length; i += 2)
        queryParams[queryParamsPairs[i]] = queryParamsPairs[i + 1];
    } else if (search) {
      const queryParamsPairs = search.slice(1).split("&");
      queryParamsPairs.forEach((pair) => {
        const [key, value] = pair.split("=");
        queryParams[key] = value;
      });
    }
    return queryParams;
  }
  function getMyInfo() {
    var _a, _b;
    const myUid = (_b = (_a = $('#menu_profile a[href^="u.php?action-show-uid-"]').attr("href")) == null ? void 0 : _a.match(/uid-(\d+)/)) == null ? void 0 : _b[1];
    return {
      uid: myUid
    };
  }
  function getPostInfo() {
    var _a, _b;
    const bodyText = document.body.textContent;
    const categoryId = (_a = bodyText.match(/fid = '(\d+)'/)) == null ? void 0 : _a[1];
    const postId = (_b = bodyText.match(/tid = '(\d+)'/)) == null ? void 0 : _b[1];
    const pagesResult = bodyText.match(/Pages: (\d+)\/(\d+)/);
    const currentPage = (pagesResult == null ? void 0 : pagesResult[1]) !== void 0 ? Number(pagesResult[1]) : void 0;
    const pages = (pagesResult == null ? void 0 : pagesResult[2]) !== void 0 ? Number(pagesResult[2]) : void 0;
    return {
      categoryId,
      postId,
      currentPage,
      pages
    };
  }
  function getForumInfo() {
    const bodyText = document.body.textContent;
    const queryParams = parseQueryParams(document.location.search);
    const pagesResult = bodyText.match(/Pages: (\d+)\/(\d+)/);
    const currentPage = (pagesResult == null ? void 0 : pagesResult[1]) !== void 0 ? Number(pagesResult[1]) : void 0;
    const pages = (pagesResult == null ? void 0 : pagesResult[2]) !== void 0 ? Number(pagesResult[2]) : void 0;
    return {
      categoryId: queryParams.fid,
      type: queryParams.type,
      currentPage,
      pages
    };
  }
  function getSearchInfo() {
    const bodyText = document.body.textContent;
    const queryParams = parseQueryParams(document.location.search);
    const pagesResult = bodyText.match(/Pages: (\d+)\/(\d+)/);
    const currentPage = (pagesResult == null ? void 0 : pagesResult[1]) !== void 0 ? Number(pagesResult[1]) : void 0;
    const pages = (pagesResult == null ? void 0 : pagesResult[2]) !== void 0 ? Number(pagesResult[2]) : void 0;
    return {
      keyword: queryParams.keyword,
      currentPage,
      pages
    };
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const defaultStorage = {
    category_general_expanded: false,
    netdisk_check: false,
    auto_complete_tasks: false,
    daily_tasks_last_time: 0,
    weekly_tasks_last_time: 0,
    image_wall_default: false,
    image_wall_default_array: [],
    category_seamless_expanded: false,
    seamless_load_comment: false,
    seamless_load_post: false,
    seamless_load_search: false,
    category_sfw_expanded: false,
    replace_sfw_avatar: false,
    hide_post_image: false,
    category_redirect_expanded: false,
    force_desktop: false,
    domain_redirect: false,
    target_domain: "",
    category_about_expanded: false
  };
  function setValue(key, value) {
    _GM_setValue(key, value);
  }
  function getValue(key, defaultValue) {
    return _GM_getValue(key, defaultValue);
  }
  function deleteAllValues() {
    _GM_listValues().forEach((key) => _GM_deleteValue(key));
  }
  function getAllValues() {
    const values = {};
    for (const key in defaultStorage)
      values[key] = getValue(key);
    return values;
  }
  function setAllValues(values) {
    for (const key in values)
      setValue(key, values[key]);
  }
  function initSettings() {
    for (const key in defaultStorage) {
      if (getValue(key) === void 0)
        setValue(key, defaultStorage[key]);
    }
  }
  function resetAllSettings() {
    if (confirm("你确定初始化所有设置吗？")) {
      deleteAllValues();
      document.location.reload();
    }
  }
  function createElement(tagName, attributes = {}) {
    const $element = $(`<${tagName}>`, attributes);
    return $element[0];
  }
  function insertNewElement(parent, tagName, attributes = {}) {
    const element = createElement(tagName, attributes);
    $(parent).append(element);
    return element;
  }
  function exportSettings() {
    const settings = getAllValues();
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    $("<a>", { href: url, download: "settings.json" })[0].click();
    URL.revokeObjectURL(url);
  }
  function validateSettings(settings) {
    for (const key in settings) {
      if (!(key in defaultStorage))
        return false;
      if (typeof settings[key] !== typeof defaultStorage[key])
        return false;
    }
    return true;
  }
  function importSettings() {
    if (!confirm("你确定要导入设置吗？当前设置将被覆盖！"))
      return;
    const input = $("<input>", { type: "file" }).on("change", function() {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = function() {
        const data = reader.result;
        const settings = JSON.parse(data);
        if (!validateSettings(settings)) {
          alert("配置文件数据错误！");
          return;
        }
        setAllValues(settings);
      };
      reader.readAsText(file);
      document.location.reload();
    })[0];
    input.click();
  }
  class Checkbox {
    constructor(lable, key) {
      __publicField(this, "label");
      __publicField(this, "key");
      __publicField(this, "_checked");
      this.label = lable;
      this.key = key;
      this._checked = getValue(key, false);
    }
    get checked() {
      return this._checked;
    }
    set checked(value) {
      this._checked = value;
      setValue(this.key, value);
    }
  }
  class Input {
    constructor(label, key) {
      __publicField(this, "label");
      __publicField(this, "key");
      __publicField(this, "_value");
      this.label = label;
      this.key = key;
      this._value = getValue(key, "");
    }
    get value() {
      return this._value;
    }
    set value(value) {
      this._value = value;
      setValue(this.key, value);
    }
  }
  class Button {
    constructor(label, type, callback) {
      __publicField(this, "label");
      __publicField(this, "type");
      __publicField(this, "callback");
      this.label = label;
      this.type = type;
      this.callback = callback;
    }
  }
  class Category {
    constructor(label, key, items) {
      __publicField(this, "label");
      __publicField(this, "key");
      __publicField(this, "items");
      __publicField(this, "_expanded");
      this.label = label;
      this.key = key;
      this.items = items;
      this._expanded = getValue(key, false);
    }
    get expanded() {
      return this._expanded;
    }
    set expanded(value) {
      this._expanded = value;
      setValue(this.key, value);
    }
  }
  function initCheckbox(parent, checkbox) {
    const checkboxItem = insertNewElement(parent, "div", { class: "category-item category-checkbox" });
    const label = insertNewElement(checkboxItem, "label");
    const checkboxMain = insertNewElement(label, "input", { type: "checkbox", checked: checkbox.checked });
    checkboxMain.checked = checkbox.checked;
    insertNewElement(label, "span", { text: checkbox.label });
    checkboxMain.addEventListener("change", () => {
      checkbox.checked = !checkbox.checked;
      checkboxMain.checked = checkbox.checked;
    });
  }
  function initInput(parent, input) {
    const inputItem = insertNewElement(parent, "div", { class: "category-item category-input" });
    const label = insertNewElement(inputItem, "label");
    const span = insertNewElement(label, "span", { text: `${input.label}` });
    const expandAnchor = insertNewElement(span, "a", { text: "编辑" });
    const inputMain = insertNewElement(label, "textarea", { text: input.value });
    const updateValue = () => {
      input.value = inputMain.value;
    };
    expandAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      if (expandAnchor.textContent === "编辑") {
        expandAnchor.textContent = "收起";
        inputMain.style.display = "block";
        updateValue();
      } else {
        expandAnchor.textContent = "编辑";
        inputMain.style.display = "none";
      }
    });
    inputMain.addEventListener("input", () => {
      inputMain.style.height = "auto";
      inputMain.style.height = `${inputMain.scrollHeight - 1}px`;
    });
    inputMain.addEventListener("focusout", () => {
      updateValue();
    });
  }
  function initButton(parent, button) {
    const buttonItem = insertNewElement(parent, "div", { text: button.label, class: `category-item category-button ${button.type}` });
    buttonItem.addEventListener("click", button.callback);
  }
  function initCategory(parent, category) {
    const categoryHeader = insertNewElement(parent, "div", { class: `category-header ${category.expanded ? "expanded" : ""}`, text: category.label });
    const categoryContent = insertNewElement(parent, "div", { class: `category-content ${category.expanded ? "expanded" : ""}` });
    categoryHeader.addEventListener("click", () => {
      category.expanded = !category.expanded;
      categoryHeader.classList.toggle("expanded");
      categoryContent.classList.toggle("expanded");
    });
    category.items.forEach((item) => {
      if (item instanceof Checkbox)
        initCheckbox(categoryContent, item);
      else if (item instanceof Input)
        initInput(categoryContent, item);
      else if (item instanceof Button)
        initButton(categoryContent, item);
    });
  }
  const categories = [
    new Category("⚙️ 常规", "category_general_expanded", [
      new Checkbox("网盘失效检查", "netdisk_check"),
      new Checkbox("自动完成任务", "auto_complete_tasks"),
      new Checkbox("默认进入图墙模式开关", "image_wall_default")
    ]),
    new Category("🔄 无缝加载", "category_seamless_expanded", [
      new Checkbox("无缝加载评论", "seamless_load_comment"),
      new Checkbox("无缝加载帖子", "seamless_load_post"),
      new Checkbox("无缝加载搜索结果", "seamless_load_search")
    ]),
    new Category("🔞 SFW", "category_sfw_expanded", [
      new Checkbox("替换帖子内用户头像", "replace_sfw_avatar"),
      new Checkbox("隐藏帖子内图片", "hide_post_image")
    ]),
    new Category("🔗 跳转", "category_redirect_expanded", [
      new Checkbox("强制跳转桌面版", "force_desktop"),
      new Checkbox("重定向到指定域名", "domain_redirect"),
      new Input("指定域名", "target_domain")
    ]),
    new Category("ℹ️ 关于", "category_about_expanded", [
      new Button("导出设置", "primary", exportSettings),
      new Button("导入设置", "primary", importSettings),
      new Button("初始化所有设置", "danger", resetAllSettings)
    ])
  ];
  function initSettingsPanel() {
    const contentMain = document.querySelector("#u-contentmain");
    const settingsPanel = insertNewElement(contentMain, "div", { class: "settings-panel" });
    const settingsPanelTilte = insertNewElement(settingsPanel, "h5", { class: "u-h5" });
    insertNewElement(settingsPanelTilte, "span", { text: "插件设置" });
    categories.forEach((category) => {
      initCategory(settingsPanel, category);
    });
  }
  function initUI() {
    const { uid: myUid } = getMyInfo();
    const queryParams = parseQueryParams(document.location.search);
    if (document.location.pathname === "/u.php" && (!document.location.search || !queryParams.action && queryParams.uid === myUid))
      initSettingsPanel();
  }
  async function domainRedirect() {
    if (!getValue("domain_redirect") || getValue("force_desktop"))
      return;
    const targetDomain = getValue("target_domain");
    if (!targetDomain)
      return;
    const currentDomain = document.location.hostname;
    if (currentDomain !== targetDomain)
      document.location.href = `${document.location.protocol}//${targetDomain}${document.location.pathname}${document.location.search}`;
  }
  function forceDesktop() {
    if (!getValue("force_desktop"))
      return;
    if (document.location.pathname !== "/simple/index.php")
      return;
    const domain = getValue("domain_redirect") ? getValue("target_domain", document.location.hostname) : document.location.hostname;
    const origin = `${document.location.protocol}//${domain}`;
    if (document.location.search === "") {
      document.location.href = origin;
      return;
    }
    const match = document.location.search.match(/^\?t(\d+)(?:_(\d+))?\.html$/);
    if (match) {
      const postId = match[1];
      const page = match[2] || "1";
      document.location.href = `${origin}/read.php?tid-${postId}-fpage-0-toread--page-${page}.html`;
    }
  }
  function get(url, retries = 3, timeout = 5e3) {
    return new Promise((resolve, reject) => {
      const attempt = () => {
        _GM_xmlhttpRequest({
          method: "GET",
          url,
          timeout,
          onload: (res) => {
            resolve(res.responseText);
          },
          onerror: (err) => {
            if (retries > 0) {
              retries--;
              attempt();
            } else {
              reject(err);
            }
          },
          ontimeout: () => {
            if (retries > 0) {
              retries--;
              attempt();
            } else {
              reject(new Error(`Request to ${url} timed out`));
            }
          }
        });
      };
      attempt();
    });
  }
  function post(url, data, retries = 3, timeout = 5e3) {
    return new Promise((resolve, reject) => {
      const attempt = () => {
        _GM_xmlhttpRequest({
          method: "POST",
          url,
          data,
          timeout,
          onload: (res) => {
            resolve(res.responseText);
          },
          onerror: (err) => {
            if (retries > 0) {
              retries--;
              attempt();
            } else {
              reject(err);
            }
          },
          ontimeout: () => {
            if (retries > 0) {
              retries--;
              attempt();
            } else {
              reject(new Error(`Request to ${url} timed out`));
            }
          }
        });
      };
      attempt();
    });
  }
  async function getDocument(url, handler) {
    const html = await get(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    handler == null ? void 0 : handler(doc);
    return doc;
  }
  function baiduNetdiskCheck() {
    $("a[href^='https://pan.baidu.com/s/']").each((_, anchor) => {
      const link = anchor.href;
      anchor.textContent = `${link} ⏳`;
      get(link).then((responseText) => {
        console.log(responseText);
        if (responseText.includes("过期时间") || responseText.includes("请输入提取码"))
          anchor.textContent = `${link} ✔️`;
        else
          anchor.textContent = `${link} ❌️`;
      });
    });
  }
  function quarkNetdiskCheck() {
    const checkUrl = "https://drive.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc";
    $("a[href^='https://pan.quark.cn/s/']").each((_, anchor) => {
      var _a;
      const link = anchor.href;
      const shardId = (_a = link.match(/\/s\/([a-zA-Z0-9]+)(?=\?|$)/)) == null ? void 0 : _a[1];
      anchor.textContent = `${link} ⏳`;
      post(checkUrl, JSON.stringify({ pwd_id: shardId, passcode: "" })).then((responseText) => {
        const responseParsed = JSON.parse(responseText);
        if (responseParsed.message === "ok" || responseParsed.message === "需要提取码")
          anchor.textContent = `${link} ✔️`;
        else
          anchor.textContent = `${link} ❌️`;
      });
    });
  }
  function netdiskCheck() {
    if (document.location.pathname !== "/read.php" || !getValue("netdisk_check"))
      return;
    baiduNetdiskCheck();
    quarkNetdiskCheck();
  }
  const DAILY_TASK_ACCEPT = "https://bbs.imoutolove.me/plugin.php?H_name=tasks&action=ajax&actions=job&cid=15&nowtime=1711814495907&verify=22a6d4b9";
  const DAILY_TASK_COMPLETE = "https://bbs.imoutolove.me/plugin.php?H_name=tasks&action=ajax&actions=job2&cid=15&nowtime=1711814495907&verify=22a6d4b9";
  const WEEKLY_TASK_ACCEPT = "https://bbs.imoutolove.me/plugin.php?H_name=tasks&action=ajax&actions=job&cid=14&nowtime=1711814495907&verify=22a6d4b9";
  const WEEKLY_TASK_COMPLETE = "https://bbs.imoutolove.me/plugin.php?H_name=tasks&action=ajax&actions=job2&cid=14&nowtime=1711814495907&verify=22a6d4b9";
  async function getTaskLastTime() {
    const domain = getValue("domain_redirect") && getValue("target_domain") ? getValue("target_domain") : document.location.hostname;
    const res = await get(`https://${domain}/plugin.php?H_name-tasks-actions-endtasks.html`);
    if (res.includes("您没有登录或者您没有权限访问此页面"))
      return false;
    $(res).find('table table td[valign="top"]').each((_, el) => {
      const text = $(el).text();
      const match = text.match(/(\d{4}-\d{2}-\d{2}) (AM|PM):(\d{2}:\d{2}:\d{2})/);
      if (match) {
        const timestamp = (/* @__PURE__ */ new Date(`${match[1]} ${match[3]}`)).getTime();
        if (text.includes("日常"))
          setValue("daily_tasks_last_time", timestamp);
        else if (text.includes("周常"))
          setValue("weekly_tasks_last_time", timestamp);
      }
    });
    return true;
  }
  async function autoCompleteTasks() {
    if (!getValue("auto_complete_tasks"))
      return;
    if (getValue("daily_tasks_last_time") === 0 || getValue("weekly_tasks_last_time") === 0)
      getTaskLastTime();
    if (getValue("daily_tasks_last_time") + 1e3 * 60 * 60 * 18 > Date.now() && getValue("weekly_tasks_last_time") + 1e3 * 60 * 60 * 158 > Date.now())
      return;
    await get(DAILY_TASK_ACCEPT);
    await get(DAILY_TASK_COMPLETE);
    await get(WEEKLY_TASK_ACCEPT);
    await get(WEEKLY_TASK_COMPLETE);
  }
  function throttle(callback, delay) {
    let timer = null;
    return (...args) => {
      if (!timer) {
        callback(...args);
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      }
    };
  }
  function replaceSFWAvatar(img) {
    if (!getValue("replace_sfw_avatar"))
      return;
    if (document.location.pathname !== "/read.php")
      return;
    if (!img.closest(".user-pic"))
      return;
    const uid = $(img).parent().attr("href").match(/action-show-uid-(\d+).html/)[1];
    const formatUid = (+uid % 2774).toString();
    const sfwAvatarUrl = `https://api.dicebear.com/8.x/icons/svg?seed=${formatUid}`;
    const sourceAvatarUrl = $(img).attr("src");
    const width = $(img).attr("width") || 150;
    const height = $(img).attr("height") || 150;
    const $avatarContainer = $("<div>", { class: "avatar-container" });
    const $sfwAvatar = $("<img>", { src: sfwAvatarUrl, class: "sfw-avatar", style: `width: ${width}px; height: ${height}px;` });
    const $sourceAvatar = $("<img>", { src: sourceAvatarUrl, class: "source-avatar", style: `width: ${width}px; height: ${height}px;` });
    $avatarContainer.append($sourceAvatar, $sfwAvatar);
    $(img).replaceWith($avatarContainer);
  }
  function hidePostImage(img) {
    var _a;
    if (!getValue("hide_post_image"))
      return;
    if (document.location.pathname !== "/read.php")
      return;
    if (!img.closest(".tpc_content"))
      return;
    if ($(img).parent().hasClass("image-placeholder"))
      return;
    if ((_a = $(img).attr("src")) == null ? void 0 : _a.includes("images/post/smile/"))
      return;
    $(img).attr("data-src", $(img).attr("src"));
    $(img).attr("src", "");
    const $placeholder = $(`
      <div class="image-placeholder">
        <div class="hide-text">🙈</div>
        <div class="show-text">🙉</div>
      </div>
    `);
    $(img).replaceWith($placeholder);
    $placeholder.append(img);
    $placeholder.on("click", () => {
      $placeholder.toggleClass("show-image");
      $placeholder.css("border", "solid");
      if ($(img).attr("src") === "")
        $(img).attr("src", $(img).attr("data-src"));
    });
  }
  function initSafeForWork() {
    $("img").each((_, img) => {
      replaceSFWAvatar(img);
      hidePostImage(img);
    });
  }
  function isAtBottom() {
    return _unsafeWindow.innerHeight + _unsafeWindow.scrollY >= document.body.offsetHeight - 100;
  }
  function seamlessLoad(currentPage, pages, containerSelector, divider, dividerHandler, docPreprocess) {
    let nextPageUrl;
    let nextPageDoc;
    let requestLock = false;
    let $container = $(containerSelector).last();
    let $divider = $(divider);
    const _handleEvent = throttle(async () => {
      if (!nextPageDoc && !requestLock) {
        if (currentPage >= pages) {
          $(document).off("scroll wheel keydown", handleEvent);
          return;
        }
        $container.after($divider);
        nextPageUrl = $(".pages b").parent().next().find("a").attr("href");
        if (!nextPageUrl)
          return;
        dividerHandler.Loading($divider, currentPage + 1);
        try {
          requestLock = true;
          nextPageDoc = await getDocument(`${document.location.origin}/${nextPageUrl}`);
          docPreprocess && docPreprocess(nextPageDoc);
          dividerHandler.Loaded($divider, currentPage + 1);
        } catch (error) {
          console.error(error);
          dividerHandler.Failed($divider, currentPage + 1);
          nextPageDoc = void 0;
        } finally {
          requestLock = false;
        }
      }
      if (isAtBottom() && !requestLock && nextPageDoc) {
        dividerHandler.Showed($divider, currentPage + 1);
        const $nextPageContainer = $(nextPageDoc).find(containerSelector);
        $divider.after($nextPageContainer);
        const $pages = $(".pages");
        const $nextPagePages = $(nextPageDoc).find(".pages");
        for (let i = 0; i < $nextPagePages.length; i++)
          $pages[i].replaceWith($nextPagePages[i]);
        const url = `${document.location.origin}/${nextPageUrl}`;
        history.pushState({ [url]: true }, "", url);
        $container = $(containerSelector).last();
        $divider = $(divider);
        nextPageDoc = void 0;
        currentPage++;
      }
    }, 500);
    function handleEvent(e) {
      if (e.originalEvent instanceof WheelEvent && e.originalEvent.deltaY > 0 || e.originalEvent instanceof KeyboardEvent && (e.originalEvent.key === "ArrowDown" || e.originalEvent.key === "PageDown") || isAtBottom())
        _handleEvent();
    }
    $(document).on("scroll wheel keydown", handleEvent);
  }
  async function seamlessLoadComment() {
    if (!getValue("seamless_load_comment"))
      return;
    if (document.location.pathname !== "/read.php")
      return;
    const { currentPage, pages } = getPostInfo();
    if (!currentPage || !pages)
      return;
    const docPreprocess = (doc) => {
      $(doc).find("img").each((_, img) => {
        replaceSFWAvatar(img);
        hidePostImage(img);
      });
    };
    seamlessLoad(currentPage, pages, 'form[name="delatc"]', '<div class="h2 seamless-load-divider">分割线</div>', {
      Loading: (divider, nextPage) => {
        divider.text(`正在加载第${nextPage}页`);
      },
      Loaded: (divider, nextPage) => {
        divider.text(`第${nextPage}页已加载，向下滚动以展示`);
      },
      Showed: (divider, nextPage) => {
        divider.text(`第${nextPage}页已展示`);
      },
      Failed: (divider, nextPage) => {
        divider.text(`第${nextPage}页加载失败`);
      }
    }, docPreprocess);
  }
  function seamlessLoadPost() {
    if (!getValue("seamless_load_post"))
      return;
    if (document.location.pathname !== "/thread.php")
      return;
    const { currentPage, pages } = getForumInfo();
    if (!currentPage || !pages)
      return;
    seamlessLoad(currentPage, pages, 'tbody[style="table-layout:fixed;"]', '<tbody><tr><td colspan="5" class="h seamless-load-divider">分割线</td></tr></tbody>', {
      Loading: (divider, nextPage) => {
        divider.find("td").text(`正在加载第${nextPage}页`);
      },
      Loaded: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页已加载，向下滚动以展示`);
      },
      Showed: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页已展示`);
      },
      Failed: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页加载失败`);
      }
    });
  }
  function seamlessLoadSearch() {
    if (!getValue("seamless_load_search"))
      return;
    if (document.location.pathname !== "/search.php")
      return;
    const { currentPage, pages } = getSearchInfo();
    if (!currentPage || !pages)
      return;
    seamlessLoad(currentPage, pages, "#main .t table tbody", '<tbody><tr><td colspan="7" class="h seamless-load-divider">分割线</td></tr></tbody>', {
      Loading: (divider, nextPage) => {
        divider.find("td").text(`正在加载第${nextPage}页`);
      },
      Loaded: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页已加载，向下滚动以展示`);
      },
      Showed: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页已展示`);
      },
      Failed: (divider, nextPage) => {
        divider.find("td").text(`第${nextPage}页加载失败`);
      }
    });
  }
  function initImageWallDefaultButton(categoryId, type) {
    const $button = $('<span class="fr" style="margin-left:0.5em"><a href="#" style="color:rgb(255, 0, 255);font-weight:bold;">[默认进入图墙模式：❌️]</a></span>');
    $('#breadcrumbs span[class="fr gray3"]').before($button);
    const defaultArray = getValue("image_wall_default_array");
    if (defaultArray == null ? void 0 : defaultArray.includes(`${categoryId}-${type}`))
      $button.find("a").text("[默认进入图墙模式：✔️]");
    $button.on("click", (e) => {
      var _a;
      e.preventDefault();
      if ((_a = e.target.textContent) == null ? void 0 : _a.includes("❌️")) {
        setValue("image_wall_default_array", [...getValue("image_wall_default_array"), `${categoryId}-${type}`]);
        document.location.href = document.location.href.replace(/\/thread.php/, "/thread_new.php");
      } else {
        setValue("image_wall_default_array", getValue("image_wall_default_array").filter((item) => item !== `${categoryId}-${type}`));
        document.location.href = document.location.href.replace(/\/thread_new.php/, "/thread.php");
      }
    });
  }
  function replaceCategoryUrl() {
    $('a[href*="thread.php"]').each((_, anchor) => {
      var _a;
      const queryParams = parseQueryParams($(anchor).attr("href"));
      const categoryId = queryParams.fid;
      const type = queryParams.type || (queryParams.search === "digest" ? "digest" : "0");
      if ((_a = getValue("image_wall_default_array")) == null ? void 0 : _a.includes(`${categoryId}-${type}`))
        $(anchor).attr("href", $(anchor).attr("href").replace(/thread.php/, "thread_new.php"));
    });
  }
  function imageWallDefault() {
    var _a;
    if (!getValue("image_wall_default"))
      return;
    if (document.location.pathname === "/thread.php" || document.location.pathname === "/thread_new.php") {
      const queryParams = parseQueryParams(document.location.search);
      const categoryId = queryParams.fid;
      const type = queryParams.type || (queryParams.search === "digest" ? "digest" : "0");
      if (((_a = getValue("image_wall_default_array")) == null ? void 0 : _a.includes(`${categoryId}-${type}`)) && document.location.pathname !== "/thread_new.php")
        document.location.href = document.location.href.replace(/\/thread.php/, "/thread_new.php");
      initImageWallDefaultButton(categoryId, type);
    }
    replaceCategoryUrl();
  }
  const settingsPanelCss = "html {\r\n  margin-left: calc(100vw - 100%);\r\n}\r\n\r\n.category-header {\r\n  margin: 0;\r\n  padding: 0.7em;\r\n  color: #333;\r\n  background-color: #ccc;\r\n  font-size: 1.25em;\r\n  font-weight: bold;\r\n  cursor: pointer;\r\n  user-select: none;\r\n}\r\n\r\n.category-header:after {\r\n  content: '🔽';\r\n  float: right;\r\n  font-size: 1.0em;\r\n}\r\n\r\n.category-header.expanded::after {\r\n  content: '🔼';\r\n}\r\n\r\n.category-content {\r\n  margin-bottom: 0.2em;\r\n  background-color: #eee;\r\n  color: #333;\r\n  font-size: 1.2em;\r\n  overflow: hidden;\r\n  user-select: none;\r\n  max-height: 0;\r\n}\r\n\r\n.category-content.expanded {\r\n  max-height: 1000px;\r\n}\r\n\r\n.category-item {\r\n  padding: 0.6em 1em;\r\n}\r\n\r\n.category-checkbox input {\r\n  margin-top: -0.05em;\r\n  vertical-align: middle;\r\n}\r\n\r\n.category-checkbox span {\r\n  vertical-align: middle;\r\n}\r\n\r\n.category-input label {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n.category-input span {\r\n  margin-left: 0.2em;\r\n}\r\n\r\n.category-input a {\r\n  margin-left: 0.4em;\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n}\r\n\r\n.category-input a:not(:hover) {\r\n  color: inherit;\r\n}\r\n\r\n.category-input textarea {\r\n  margin-top: 0.1em;\r\n  display: none;\r\n  font-size: 1.2em;\r\n  min-height: 1.3em;\r\n  overflow: hidden;\r\n  resize: none;\r\n  outline: 0 none;\r\n}\r\n\r\n.category-button {\r\n  cursor: pointer;\r\n  text-align: center;\r\n  font-size: 1.2em;\r\n}\r\n\r\n.category-button.primary {\r\n  color: inherit;\r\n}\r\n\r\n.category-button.primary:hover {\r\n  background-color: #ddd;\r\n}\r\n\r\n.category-button.warning {\r\n  color: #e6a23c;\r\n}\r\n\r\n.category-button.warning:hover {\r\n  color: white;\r\n  background-color: #e6a23c;\r\n}\r\n\r\n.category-button.danger {\r\n  color: #f56c6c;\r\n}\r\n\r\n.category-button.danger:hover {\r\n  background-color: #f56c6c;\r\n  color: white;\r\n}";
  const safeForWorkCss = ".avatar-container .source-avatar {\r\n  display: none;\r\n}\r\n\r\n.avatar-container:hover .source-avatar {\r\n  display: block;\r\n}\r\n\r\n.avatar-container:hover .sfw-avatar {\r\n  display: none;\r\n}\r\n\r\n.image-placeholder {\r\n  cursor: pointer;\r\n  border: dashed;\r\n  user-select: none;\r\n}\r\n\r\n.image-placeholder div {\r\n  font-size: 20px;\r\n  text-align: center;\r\n  width: 100%;\r\n  height: 40px;\r\n  line-height: 40px;\r\n}\r\n\r\n.image-placeholder div.show-text {\r\n  display: none;\r\n}\r\n\r\n.image-placeholder img {\r\n  display: none;\r\n  width: 100%;\r\n}\r\n\r\n.image-placeholder.show-image .show-text {\r\n  display: block;\r\n}\r\n\r\n.image-placeholder.show-image .hide-text {\r\n  display: none;\r\n}\r\n\r\n.image-placeholder.show-image img {\r\n  display: block;\r\n}";
  const seamlessLoadCss = ".h2.seamless-load-divider {\r\n  text-align: center;\r\n  user-select: none;\r\n}\r\n.h.seamless-load-divider {\r\n  text-align: center;\r\n  user-select: none;\r\n}";
  _GM_addStyle(settingsPanelCss);
  _GM_addStyle(safeForWorkCss);
  _GM_addStyle(seamlessLoadCss);
  _GM_registerMenuCommand("设置", () => {
    _GM_openInTab(`${document.location.origin}/u.php`, { active: true });
  });
  function init() {
    initSettings();
    initUI();
    netdiskCheck();
    autoCompleteTasks();
    imageWallDefault();
    initSafeForWork();
    seamlessLoadComment();
    seamlessLoadPost();
    seamlessLoadSearch();
    forceDesktop();
    domainRedirect();
  }
  {
    document.addEventListener("DOMContentLoaded", () => {
      init();
    });
  }

})(jQuery);