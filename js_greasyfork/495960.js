// ==UserScript==
// @name        ArchTranslator
// @namespace   bb89542e-b358-4be0-8c01-3797d1f3a1e3
// @match       https://wiki.archlinux.org/*
// @grant       none
// @version     2.0.5
// @author      bonk-dev
// @description Useful tools for ArchWiki translators, now written in TypeScript.
// @icon        https://gitlab.archlinux.org/uploads/-/system/group/avatar/23/iconfinder_archlinux_386451.png
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/495960/ArchTranslator.user.js
// @updateURL https://update.greasyfork.org/scripts/495960/ArchTranslator.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/Utilities/MediaWikiJsApi.ts
  function isMwApiReady() {
    return typeof mw !== "undefined";
  }
  function getMwApi() {
    return mw;
  }

  // src/Injection/InjectionAgents.ts
  var DocumentLoadAgent = class {
    start() {
      return new Promise((resolve) => {
        window.addEventListener("load", () => {
          resolve();
        });
      });
    }
  };
  var StartupLoadAgent = class {
    constructor() {
      this._observer = null;
    }
    start() {
      if (isMwApiReady()) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        const checkScriptElement = (scriptElement) => {
          const srcUrl = new URL(scriptElement.src);
          const modules = srcUrl.searchParams.get("modules");
          if (modules === "startup") {
            scriptElement.addEventListener("load", () => {
              this._observer?.disconnect();
              resolve();
            });
            scriptElement.addEventListener("error", (e) => {
              reject(e);
            });
          }
        };
        const scripts = document.querySelectorAll("script[src]");
        if (scripts.length > 0) {
          for (const script of scripts) {
            checkScriptElement(script);
          }
        }
        this._observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type !== "childList" || mutation.addedNodes.length <= 0 || mutation.target.nodeName !== "HEAD" || mutation.addedNodes[0].nodeName !== "SCRIPT") continue;
            const scriptElement = mutation.addedNodes[0];
            if (scriptElement.src.length <= 0) continue;
            checkScriptElement(scriptElement);
          }
        });
        this._observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      });
    }
  };

  // src/Injection/InjectionManager.ts
  var mediaWikiHookFunction = null;
  var onHookReady = null;
  var InjectionManager = class {
    constructor() {
      this._callbacks = {
        [0 /* DocumentLoad */]: {
          callbacks: [],
          fired: false
        },
        [1 /* MediaWikiStartup */]: {
          callbacks: [],
          fired: false
        },
        [3 /* ExtCodeMirrorSwitch */]: {
          callbacks: [],
          fired: false
        },
        [2 /* JQueryEditForm */]: {
          callbacks: [],
          fired: false,
          jqueryElement: null
        }
      };
      this._agentsStarted = false;
    }
    startAgents() {
      onHookReady = () => {
        this.fire(1 /* MediaWikiStartup */);
        getMwApi().hook("ext.CodeMirror.switch").add(() => {
          this.fire(3 /* ExtCodeMirrorSwitch */);
        });
        getMwApi().hook("wikipage.editform").add((jQueryEditForm) => {
          this.fireEditForm(jQueryEditForm);
        });
      };
      if (this._agentsStarted) {
        throw new Error("Agents were already started");
      }
      this._agentsStarted = true;
      const loadAgent = new DocumentLoadAgent();
      loadAgent.start().then(() => {
        this.fire(0 /* DocumentLoad */);
      });
      const startupAgent = new StartupLoadAgent();
      startupAgent.start().then(() => {
        if (getMwApi().hook == null) {
          console.debug("hook is null. Hijacking mw.hook");
          Object.defineProperty(getMwApi(), "hook", {
            get() {
              return mediaWikiHookFunction;
            },
            set(v) {
              mediaWikiHookFunction = v;
              console.debug("mw.hook hijacked");
              if (onHookReady != null) {
                onHookReady();
              }
            }
          });
        } else {
          if (onHookReady != null) {
            onHookReady();
          }
        }
      });
    }
    on(step, callback) {
      if (this._callbacks[step].fired) {
        callback();
      } else {
        this._callbacks[step].callbacks.push(callback);
      }
    }
    /**
     * Fired exclusively on edit pages. The manager will pass the JQuery editForm object as the first parameter.
     */
    onEditForm(callback) {
      const info = this._callbacks[2 /* JQueryEditForm */];
      if (info.fired) {
        callback(info.jqueryElement);
      } else {
        info.callbacks.push(callback);
      }
    }
    fire(step) {
      const info = this._callbacks[step];
      for (const callback of info.callbacks) {
        callback();
      }
      info.fired = true;
    }
    fireEditForm(jqueryEditForm) {
      const info = this._callbacks[2 /* JQueryEditForm */];
      info.jqueryElement = jqueryEditForm;
      for (const callback of info.callbacks) {
        callback(jqueryEditForm);
      }
      info.fired = true;
    }
  };

  // src/Tools/Utils/CollapsibleFooter.ts
  function makeCollapsibleFooter($content, $toggler, storeKey) {
    const collapsedVal = "0";
    const expandedVal = "1";
    const isCollapsed = mw.storage.get(storeKey) !== expandedVal;
    $toggler.addClass("mw-editfooter-toggler").prop("tabIndex", 0).attr("role", "button");
    $content.makeCollapsible({
      $customTogglers: $toggler,
      linksPassthru: true,
      plainMode: true,
      collapsed: isCollapsed
    });
    $toggler.addClass(isCollapsed ? "mw-icon-arrow-collapsed" : "mw-icon-arrow-expanded");
    $content.on("beforeExpand.mw-collapsible", () => {
      $toggler.removeClass("mw-icon-arrow-collapsed").addClass("mw-icon-arrow-expanded");
      mw.storage.set(storeKey, expandedVal);
    });
    $content.on("beforeCollapse.mw-collapsible", () => {
      $toggler.removeClass("mw-icon-arrow-expanded").addClass("mw-icon-arrow-collapsed");
      mw.storage.set(storeKey, collapsedVal);
    });
  }

  // src/Tools/Utils/ToolManager.ts
  var toolInProgressClass = "at-tool-inProgress";
  function sideTool(toolInfo) {
    const element = document.createElement("a");
    element.innerHTML = toolInfo.displayText;
    element.addEventListener("click", (e) => {
      if (element.parentElement.classList.contains(toolInProgressClass)) {
        return;
      }
      const result = toolInfo.handler(e);
      if (result instanceof Promise) {
        element.parentElement.classList.add(toolInProgressClass);
        result.finally(() => {
          element.parentElement.classList.remove(toolInProgressClass);
        });
      }
    });
    return {
      name: toolInfo.name,
      toolElement: element,
      showCallback: toolInfo.showCallback
    };
  }
  var ToolManager = class _ToolManager {
    constructor() {
      this._sidebarToolSectionAddedToDom = false;
      this._footerTools = [];
      this._footerToolContainer = null;
      if (_ToolManager._instance != null) {
        throw new Error("ToolManager was initialized already");
      }
      _ToolManager._instance = this;
      this._sidebarToolSection = _ToolManager._createToolSectionElement();
    }
    static {
      this._instance = null;
    }
    /**
     * Adds the ArchTranslator tool section to the DOM
     * @param parent If not null, adds the tool section to the specified element (otherwise looks for #vector-page-tools)
     */
    addSidebarToPage(parent = null) {
      if (this._sidebarToolSectionAddedToDom) {
        throw new Error("The tool section was added to DOM already");
      }
      if (parent == null) {
        parent = document.getElementById("vector-page-tools");
        if (parent == null) {
          throw new Error("Could not find vector-page-tools");
        }
      }
      parent.appendChild(this._sidebarToolSection.rootElement);
      this._sidebarToolSectionAddedToDom = true;
    }
    /**
     * Adds the footer tools to the DOM
     * @param editForm The JQuery element from editForm hook
     */
    addFooterToPage(editForm) {
      if (this._footerToolContainer != null) {
        throw new Error("Footer tool container was already initialized");
      }
      this._footerToolContainer = editForm;
      for (const tool of this._footerTools) {
        this._addFooterToolToContainer(tool);
      }
    }
    /**
     * Adds a custom tool to the sidebar
     * @param tool
     * @param currentPageInfo Used to hide useless tools based on the info about the current page
     */
    addSidebarTool(tool, currentPageInfo) {
      if (tool.showCallback != null && !tool.showCallback(currentPageInfo)) {
        return;
      }
      const listItem = document.createElement("li");
      listItem.id = `t-at-${tool.name}`;
      listItem.classList.add("mw-list-item");
      listItem.appendChild(tool.toolElement);
      this._sidebarToolSection.list.appendChild(listItem);
    }
    /**
     * Adds a custom tool to the footer as a collapsible element
     * @param tool
     */
    addFooterTool(tool) {
      const registeredTool = this._registerFooterTool(tool);
      this._addFooterToolToContainer(registeredTool);
      makeCollapsibleFooter(
        $(registeredTool.tool),
        $(registeredTool.toggler),
        tool.storeKey
      );
    }
    _addFooterToolToContainer(tool) {
      if (this._footerToolContainer != null) {
        this._footerToolContainer.find(".templatesUsed").before(tool.container);
      }
    }
    _registerFooterTool(tool) {
      const parentElement = document.createElement("div");
      parentElement.className = tool.name;
      const togglerElement = document.createElement("div");
      togglerElement.className = `${tool.name}-toggler`;
      togglerElement.innerHTML = `<p>${tool.header}</p>`;
      parentElement.appendChild(togglerElement);
      parentElement.appendChild(tool.toolElement);
      if (tool.toolElement.tagName === "UL" || tool.toolElement.tagName === "OL" || tool.toolElement.tagName === "DL") {
        tool.toolElement.classList.add("mw-editfooter-list");
      }
      const registeredTool = {
        container: parentElement,
        tool: tool.toolElement,
        toggler: togglerElement
      };
      this._footerTools.push(registeredTool);
      return registeredTool;
    }
    /** Returns the singleton instance of ToolManager */
    static get instance() {
      if (this._instance == null) {
        return new _ToolManager();
      }
      return this._instance;
    }
    static _createToolSectionElement() {
      const toolContainer = document.createElement("div");
      toolContainer.id = "p-arch-translator";
      toolContainer.classList.add("vector-menu", "mw-portlet");
      const menuHeading = document.createElement("div");
      menuHeading.classList.add("vector-menu-heading");
      menuHeading.innerText = "Arch Translator";
      toolContainer.appendChild(menuHeading);
      const menuContent = document.createElement("div");
      menuContent.classList.add("vector-menu-content");
      toolContainer.appendChild(menuContent);
      const menuList = document.createElement("ul");
      menuList.classList.add("vector-menu-content-list");
      menuContent.appendChild(menuList);
      return {
        rootElement: toolContainer,
        list: menuList
      };
    }
  };

  // src/Internalization/I18nConstants.ts
  var LanguageInfo = class {
    constructor(subtag, englishName, localizedName, customKey) {
      this.subtag = subtag;
      this.englishName = englishName;
      this.localizedName = localizedName;
      this.key = customKey ?? this.englishName;
    }
  };
  var LanguagesInfo = {
    Arabic: new LanguageInfo("ar", "Arabic", "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"),
    Bangla: new LanguageInfo(null, "Bangla", "\u09AC\u09BE\u0982\u09B2\u09BE"),
    Bosnian: new LanguageInfo("bs", "Bosnian", "Bosanski"),
    Bulgarian: new LanguageInfo("bg", "Bulgarian", "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"),
    Cantonese: new LanguageInfo(null, "Cantonese", "\u7CB5\u8A9E"),
    Catalan: new LanguageInfo("ca", "Catalan", "Catal\xE0"),
    ChineseClassical: new LanguageInfo(null, "Chinese (Classical)", "\u6587\u8A00\u6587", "ChineseClassical"),
    ChineseSimplified: new LanguageInfo("zh-hans", "Chinese (Simplified)", "\u7B80\u4F53\u4E2D\u6587", "ChineseSimplified"),
    ChineseTraditional: new LanguageInfo("zh-hant", "Chinese (Traditional)", "\u6B63\u9AD4\u4E2D\u6587", "ChineseTraditional"),
    Croatian: new LanguageInfo("hr", "Croatian", "Hrvatski"),
    Czech: new LanguageInfo("cs", "Czech", "\u010Ce\u0161tina"),
    Danish: new LanguageInfo("da", "Danish", "Dansk"),
    Dutch: new LanguageInfo("nl", "Dutch", "Nederlands"),
    English: new LanguageInfo("en", "English", "English"),
    Esperanto: new LanguageInfo(null, "Esperanto", "Esperanto"),
    Finnish: new LanguageInfo("fi", "Finnish", "Suomi"),
    French: new LanguageInfo("fr", "French", "Fran\xE7ais"),
    German: new LanguageInfo("de", "German", "Deutsch"),
    Greek: new LanguageInfo("el", "Greek", "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"),
    Hebrew: new LanguageInfo("he", "Heberew", "\u05E2\u05D1\u05E8\u05D9\u05EA"),
    Hungarian: new LanguageInfo("hu", "Hungarian", "Magyar"),
    Indonesian: new LanguageInfo("id", "Indonesian", "Bahasa Indonesia"),
    Italian: new LanguageInfo("it", "Italian", "Italiano"),
    Japanese: new LanguageInfo("ja", "Japanese", "\u65E5\u672C\u8A9E"),
    Korean: new LanguageInfo("ko", "Korean", "\uD55C\uAD6D\uC5B4"),
    Lithuanian: new LanguageInfo("lt", "Lithuanian", "Lietuvi\u0173"),
    NorwegianBokmal: new LanguageInfo(null, "Norwegian (Bokm\xE5l)", "Norsk Bokm\xE5l", "NorwegianBokmal"),
    Polish: new LanguageInfo("pl", "Polish", "Polski"),
    Portuguese: new LanguageInfo("pt", "Portuguese", "Portugu\xEAs"),
    Romanian: new LanguageInfo(null, "Romanian", "Rom\xE2n\u0103"),
    Russian: new LanguageInfo("ru", "Russian", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439"),
    Serbian: new LanguageInfo("sr", "Serbian", "\u0421\u0440\u043F\u0441\u043A\u0438 (Srpski)"),
    Slovak: new LanguageInfo("sk", "Slovak", "Sloven\u010Dina"),
    Spanish: new LanguageInfo("es", "Spanish", "Espa\xF1ol"),
    Swedish: new LanguageInfo("sv", "Swedish", "Svenska"),
    Thai: new LanguageInfo("th", "Thai", "\u0E44\u0E17\u0E22"),
    Turkish: new LanguageInfo("tr", "Turkish", "T\xFCrk\xE7e"),
    Ukrainian: new LanguageInfo("uk", "Ukrainian", "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"),
    Vietnamese: new LanguageInfo(null, "Vietnamese", "Ti\u1EBFng Vi\u1EC7t"),
    Quechua: new LanguageInfo(null, "Quechua", "Runa simi")
  };
  var validLangPostfixes = Object.values(LanguagesInfo).map((i) => "(" + i.localizedName + ")");
  var validLangSubtags = Object.values(LanguagesInfo).filter((i) => i.subtag != null).map((i) => i.subtag);
  function isTranslated(title) {
    for (const postfix of validLangPostfixes) {
      if (title.endsWith(postfix)) {
        return true;
      }
    }
    return false;
  }
  function removeLanguagePostfix(pageOrTitle) {
    const remove = (target, postfix) => {
      return target.substring(0, target.length - 1 - postfix.length);
    };
    for (const postfix of validLangPostfixes) {
      if (!pageOrTitle.endsWith(postfix)) {
        continue;
      }
      const split = pageOrTitle.split("/");
      if (split.length <= 1) {
        return remove(pageOrTitle, postfix);
      } else {
        return split.map((part) => remove(part, postfix)).join("/");
      }
    }
    return pageOrTitle;
  }
  function getLangInfoFor(key) {
    const info = LanguagesInfo[key];
    if (info == null) {
      throw new Error(`Invalid language key: ${key}`);
    }
    return info;
  }

  // src/Utilities/Api/MediaWikiApiClient.ts
  var MAX_PAGE_QUERY_LIMIT = 50;
  var getPageContent = async (pageName) => {
    pageName = titleToPageName(pageName);
    const response = await fetch(
      `/api.php?action=query&prop=revisions&titles=${pageName}&rvslots=*&rvprop=ids|content&format=json&formatversion=2`
    );
    const jsonObj = await response.json();
    const revision = jsonObj.query.pages[0].revisions[0];
    return {
      revisionId: revision.revid,
      content: revision.slots.main.content,
      title: jsonObj.query.pages[0].title
    };
  };
  var getPageInfos = async (titles) => {
    if (titles.length <= 0) {
      throw new Error("Titles array must be larger than 0");
    }
    const fetchInfo = async (titles2) => {
      const encodedTitles = encodeURIComponent(titles2.join("|"));
      const apiResponse = await fetch(`/api.php?action=query&prop=info&titles=${encodedTitles}&format=json`);
      if (!apiResponse.ok) {
        throw new Error("API request failed: " + apiResponse.statusText);
      }
      return await apiResponse.json();
    };
    const groupLimit = (bigArray, limit) => {
      if (limit <= 0) {
        throw new Error("groupLimit 'limit' parameter must be larger than 0");
      }
      if (bigArray.length <= limit) {
        return [bigArray];
      }
      const parentArray = [];
      let addedTitles = 0;
      while (addedTitles < bigArray.length) {
        const childArray = [];
        const childSize = Math.min(bigArray.length - addedTitles, limit);
        const startingIndex = addedTitles;
        for (let i = 0; i < childSize; ++i) {
          childArray.push(bigArray[i + startingIndex]);
          addedTitles++;
        }
        parentArray.push(childArray);
      }
      return parentArray;
    };
    const groups = groupLimit(titles, MAX_PAGE_QUERY_LIMIT);
    const responses = [];
    for (const titleGroup of groups) {
      responses.push(await fetchInfo(titleGroup));
    }
    return Object.assign({}, ...responses);
  };
  var getPageLinks = async (titles) => {
    const titleConcat = encodeURIComponent(titles.join("|"));
    const response = await fetch(`/api.php?action=query&prop=links&titles=${titleConcat}&format=json`);
    if (!response.ok) {
      throw new Error("API request failed: " + response.statusText);
    }
    return await response.json();
  };

  // src/Storage/IndexedDbPromiseWrappers.ts
  var openDb = (name, version) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onsuccess = (e) => {
        resolve({
          type: 0 /* Success */,
          // @ts-ignore
          database: e.target.result
        });
      };
      request.onblocked = (e) => {
        resolve({
          type: 1 /* Blocked */
        });
      };
      request.onupgradeneeded = (e) => {
        resolve({
          type: 2 /* UpgradeNeeded */,
          // @ts-ignore
          database: e.target.result,
          oldVer: e.oldVersion,
          newVer: e.newVersion
        });
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  };
  var wrapGenericRequest = (request) => {
    return new Promise((resolve, reject) => {
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  };
  var get = async (store, key) => {
    const request = store.get(key);
    return await wrapGenericRequest(request);
  };
  var put = async (store, value, key) => {
    const request = store.put(value, key);
    return await wrapGenericRequest(request);
  };

  // src/Storage/ScriptDb.ts
  var ARCH_TRANSLATOR_DB_NAME = "ArchTranslator";
  var ARCH_TRANSLATOR_DB_VERSION = 1;
  var CACHED_PAGES_STORE = "cached_pages";
  var SETTINGS_STORE = "settings";
  var SETTINGS_LANG_KEY = "language";
  var DEFAULT_SETTINGS = {
    [SETTINGS_LANG_KEY]: "Polish"
  };
  var database = null;
  var getDb = () => {
    if (database == null) {
      throw new Error("Non-null database instance was requested, but the instance was null");
    }
    return database;
  };
  var upgradeDb = async (oldVersion, newVersion) => {
    console.debug(`upgradeDb: Upgrading from ${oldVersion} to ${newVersion}`);
    getDb().createObjectStore(CACHED_PAGES_STORE, {
      keyPath: "pageName"
    });
    getDb().createObjectStore(SETTINGS_STORE);
  };
  var setupDb = async () => {
    console.debug(`setupDb: ${ARCH_TRANSLATOR_DB_NAME} (${ARCH_TRANSLATOR_DB_VERSION})`);
    try {
      const dbResult = await openDb(ARCH_TRANSLATOR_DB_NAME, ARCH_TRANSLATOR_DB_VERSION);
      switch (dbResult.type) {
        case 0 /* Success */:
          database = dbResult.database;
          return true;
        case 2 /* UpgradeNeeded */:
          database = dbResult.database;
          await upgradeDb(dbResult.oldVer, dbResult.newVer);
          return true;
        default:
          console.error(dbResult);
          return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  var getCachedPageInfo = async (pageName) => {
    const db = getDb();
    const tr = db.transaction([CACHED_PAGES_STORE]);
    const store = tr.objectStore(CACHED_PAGES_STORE);
    return await get(store, pageName);
  };
  var setCachedPageInfo = async (pageInfo) => {
    const db = getDb();
    const tr = db.transaction(CACHED_PAGES_STORE, "readwrite");
    const store = tr.objectStore(CACHED_PAGES_STORE);
    await put(store, pageInfo);
  };
  var getDefaultSettingValue = (key) => {
    return DEFAULT_SETTINGS[key];
  };
  var getCurrentLanguage = async () => {
    const db = getDb();
    const tr = db.transaction(SETTINGS_STORE);
    const store = tr.objectStore(SETTINGS_STORE);
    let languageKey = await get(store, SETTINGS_LANG_KEY);
    if (languageKey == null) {
      languageKey = getDefaultSettingValue(SETTINGS_LANG_KEY);
    }
    return getLangInfoFor(languageKey);
  };
  var setCurrentLanguage = async (info) => {
    const db = getDb();
    const tr = db.transaction(SETTINGS_STORE, "readwrite");
    const store = tr.objectStore(SETTINGS_STORE);
    await put(store, info.key, SETTINGS_LANG_KEY);
  };

  // src/Utilities/PageUtils.ts
  var cachedPageContent = null;
  var codeMirrorInstance = null;
  function getCurrentPageType() {
    const isArticle = getMwApi().config.values.wgIsArticle;
    const action = getMwApi().config.values.wgAction;
    switch (action) {
      case "edit":
        const isEditable = getMwApi().config.values.wgIsProbablyEditable;
        const editMessage = getMwApi().config.values.wgEditMessage;
        if (editMessage === "creating" /* Creating */) {
          return 3 /* CreateEditor */;
        }
        return isEditable ? 2 /* Editor */ : 4 /* ViewOnlyEditor */;
      case "view":
        const revisionId = getMwApi().config.values.wgCurRevisionId;
        if (revisionId === 0) {
          return 1 /* ReadNonExisting */;
        }
        return isArticle ? 0 /* Read */ : 5 /* Other */;
      default:
        return 5 /* Other */;
    }
  }
  function getCurrentPageInfo() {
    const title = getMwApi().config.values.wgTitle;
    const pageName = getMwApi().config.values.wgPageName;
    const isRedirect = getMwApi().config.values.wgIsRedirect;
    const revisionId = getMwApi().config.values.wgCurRevisionId;
    return {
      isRedirect,
      isTranslated: isTranslated(title),
      latestRevisionId: revisionId,
      pageName,
      pageType: getCurrentPageType(),
      title
    };
  }
  function cacheCurrentPageContent(content) {
    cachedPageContent = content;
  }
  function storeCodeMirrorInstance(cmEditor) {
    codeMirrorInstance = cmEditor;
  }
  async function getCurrentPageContent() {
    if (codeMirrorInstance == null && cachedPageContent != null) {
      console.debug(`getCurrentPageContent: cache hit`);
      return cachedPageContent;
    } else if (codeMirrorInstance != null) {
      return codeMirrorInstance.getValue();
    }
    const pageName = getMwApi().config.values.wgPageName;
    const type = getCurrentPageType();
    switch (type) {
      case 2 /* Editor */:
      case 3 /* CreateEditor */:
      case 4 /* ViewOnlyEditor */:
        console.warn("cachedPageContent was null on edit page. You might be requesting the page content too soon.");
        return (await getPageContent(pageName)).content;
      case 0 /* Read */:
        return (await getPageContent(pageName)).content;
      case 1 /* ReadNonExisting */:
        return "";
      case 5 /* Other */:
        throw new Error("Cannot return content for page of 'Other' type");
    }
  }
  async function getEnglishRevisionId() {
    const info = getCurrentPageInfo();
    if (!info.isTranslated) {
      throw new Error("The current page is not a translation");
    }
    const englishPageName = removeLanguagePostfix(info.pageName);
    if (englishPageName === info.pageName) {
      console.warn(`getEnglishRevisionId: Could not get the English for the ${info.pageName}`);
      return null;
    }
    const cachedInfo = await getCachedPageInfo(englishPageName);
    console.debug(`getEnglishRevisionId english name: ${englishPageName}`);
    if (cachedInfo != null) {
      console.debug("getEnglishRevisionId: cache hit");
      return cachedInfo.latestRevisionId;
    }
    return null;
  }
  function pageNameToTitle(pageName) {
    return pageName.replaceAll("_", "");
  }
  function titleToPageName(title) {
    return title.replaceAll(" ", "_");
  }

  // src/Utilities/WikiTextParser.ts
  var WikiLink = class {
    constructor(rawLink) {
      if (rawLink.startsWith("[[")) {
        rawLink = rawLink.substring(2);
      }
      if (rawLink.endsWith("]]")) {
        rawLink = rawLink.substring(0, rawLink.length - 2);
      }
      const split = rawLink.split("|");
      this._link = split[0];
      const headerSplit = this._link.split("#");
      if (headerSplit.length > 1) {
        this._link = headerSplit[0];
        this._linkedHeader = headerSplit[1];
      } else {
        this._linkedHeader = null;
      }
      this._alias = split.length > 1 ? split[1] : null;
      if (split[0].startsWith(":")) {
        this._linkType = "category" /* Category */;
      } else if (split[0].startsWith("#")) {
        this._linkType = "header" /* Header */;
      } else {
        this._linkType = "article" /* Article */;
      }
    }
    get link() {
      return this._link;
    }
    get alias() {
      return this._alias;
    }
    get linkType() {
      return this._linkType;
    }
    get header() {
      return this._linkedHeader;
    }
    get linkWithHeader() {
      const header = this.header != null ? `#${this.header}` : "";
      return this.link + header;
    }
  };
  var WikiTextParser = class {
    constructor() {
      this._redirects = [];
      this._magicWords = [];
      this._categories = [];
      this._interlanguageLinks = {};
      this._templates = [];
      this._relatedArticleElements = [];
      this._parsingContent = false;
      this._parseMagicWords = true;
      this._rawContentLines = [];
      this._links = [];
    }
    get headerText() {
      let sortedLinks = [];
      for (let langSubtag of Object.keys(this._interlanguageLinks).sort()) {
        sortedLinks.push(this._interlanguageLinks[langSubtag]);
      }
      const finalArray = [
        ...this._redirects,
        ...this._magicWords,
        ...this._categories,
        ...sortedLinks,
        ...this._templates,
        ...this._relatedArticleElements
      ];
      return finalArray.join("\n") + "\n";
    }
    get pageBodyText() {
      return this._rawContentLines.join("\n");
    }
    get pageContent() {
      return this.headerText + this.pageBodyText;
    }
    parse(wikiTextContent) {
      const lines = wikiTextContent.split("\n");
      for (let line of lines) {
        this.parseLine(line);
      }
    }
    parseLine(line) {
      if (!this._parsingContent) {
        const headerResult = this._parseHeaderLine(line);
        if (headerResult === 6 /* EndOfHeader */ || headerResult === 0 /* Redirect */) {
          this._parsingContent = true;
        }
        return headerResult;
      } else {
        return this._parseContentLine(line);
      }
    }
    get localizableLinks() {
      const firstCapitalLetter = (str) => {
        if (str.length < 2) {
          return str.toUpperCase();
        }
        return `${str[0].toUpperCase()}${str.substring(1)}`;
      };
      return [
        ...new Set(this._links.filter((l) => !isTranslated(l.link) && (l.linkType === "category" /* Category */ || l.linkType === "article" /* Article */)).map((l) => firstCapitalLetter(l.link)))
      ];
    }
    _parseHeaderLine(line) {
      const isBlank = (str) => {
        return !str || /^\s*$/.test(str);
      };
      if (isBlank(line)) {
        return 7 /* EmptyLine */;
      }
      if (line.startsWith("#REDIRECT")) {
        this._redirects.push(line);
        this._log("Found redirect: " + line);
        return 0 /* Redirect */;
      }
      for (let subtag of validLangSubtags) {
        if (line.startsWith(`[[${subtag}:`)) {
          this.addInterlanguageLink(line, subtag);
          this._parseMagicWords = false;
          return 3 /* InterlanguageLink */;
        }
      }
      if (line.startsWith("[[Category")) {
        this._addCategory(line);
        this._parseMagicWords = false;
        return 2 /* Category */;
      } else if (line.startsWith("{{Related")) {
        this._addRelatedArticleElement(line);
        return 5 /* RelatedArticle */;
      } else if (line.startsWith("{{") || line.startsWith("__")) {
        if (this._parseMagicWords) {
          this._addMagicWord(line);
          return 1 /* MagicWord */;
        } else {
          this.addTemplate(line);
          return 4 /* Template */;
        }
      } else {
        this._rawContentLines.push(line);
        return 6 /* EndOfHeader */;
      }
    }
    addInterlanguageLink(line, subtag) {
      this._interlanguageLinks[subtag] = line;
    }
    _addCategory(line) {
      this._categories.push(line);
    }
    _addMagicWord(line) {
      this._magicWords.push(line);
    }
    addTemplate(line) {
      this._templates.push(line);
    }
    _addRelatedArticleElement(line) {
      this._relatedArticleElements.push(line);
    }
    _parseContentLine(line) {
      this._rawContentLines.push(line);
      for (let match of line.matchAll(/\[\[(?!Wikipedia)(?!w)(?!mw)([^\[\]]*)]]/ig)) {
        const link = new WikiLink(match[1]);
        this._links.push(link);
      }
      return 8 /* ContentLine */;
    }
    _log(msg) {
      console.debug(`WikiTextParser: ${msg}`);
    }
  };
  var findRedirect = (wikiText) => {
    const prefix = "#REDIRECT ";
    if (wikiText.length < prefix.length) {
      return null;
    }
    const probablePrefix = wikiText.substring(0, prefix.length);
    if (probablePrefix.toUpperCase() != prefix) {
      return null;
    }
    const linkText = wikiText.substring(prefix.length).trim();
    return new WikiLink(linkText);
  };

  // src/Tools/Workers/TranslatedArticlesWorker.ts
  var localizeLink = (link, lang) => {
    const subPageSplit = link.split("/");
    const prefix = ` (${lang.localizedName})`;
    if (subPageSplit.length < 2) {
      return link + prefix;
    }
    return subPageSplit.map((s) => s + prefix).join("/");
  };
  var TranslatedArticlesWorker = class {
    constructor(pageInfo) {
      this._info = pageInfo;
    }
    willRun() {
      return (this._info.pageType === 3 /* CreateEditor */ || this._info.pageType === 2 /* Editor */) && this._info.isTranslated;
    }
    async run(parser) {
      if (!this.willRun()) {
        return {
          existing: [],
          notExisting: [],
          redirects: []
        };
      }
      const language = await getCurrentLanguage();
      const linksWithPostfixes = parser.localizableLinks.map((l) => localizeLink(l, language));
      if (linksWithPostfixes.length <= 0) {
        return {
          existing: [],
          notExisting: [],
          redirects: []
        };
      }
      const info = await this._getPageInfosFor(linksWithPostfixes);
      console.debug(info.filter((i) => i.exists));
      const possibleRedirects = info.filter((r) => !r.exists).map((r) => removeLanguagePostfix(r.link));
      const redirectsAndOther = await this._findRedirects(possibleRedirects);
      console.debug(redirectsAndOther.filter((r) => r.redirects));
      const actualRedirects = redirectsAndOther.filter((r) => r.redirects && !isTranslated(r.redirectsTo)).map((r) => localizeLink(r.redirectsTo, language));
      const redirectResults = actualRedirects.length > 0 ? await this._getPageInfosFor(actualRedirects) : [];
      console.debug(redirectResults);
      const findRedirectSource = (localizedLink) => {
        const englishLink = removeLanguagePostfix(localizedLink);
        if (englishLink.toLowerCase() === localizedLink.toLowerCase()) return localizedLink;
        const original = redirectsAndOther.find((r) => r.redirectsTo?.toLowerCase() === englishLink.toLowerCase());
        return original.link;
      };
      return {
        existing: info.filter((i) => i.exists).map((r) => r.link),
        redirects: redirectResults.map((r) => {
          return {
            link: findRedirectSource(r.link),
            redirectsTo: removeLanguagePostfix(r.link),
            localizedRedirectTarget: r.link,
            exists: r.exists
          };
        }),
        notExisting: redirectsAndOther.filter((r) => !r.redirects).map((r) => localizeLink(r.link, language))
      };
    }
    async _getPageInfosFor(links) {
      const apiData = await getPageInfos(links);
      if (Array.isArray(typeof apiData.query.pages)) {
        return apiData.query.pages.map((p) => {
          return {
            link: p.title,
            exists: "missing" in p
          };
        });
      }
      const data = [];
      const keyedApiData = apiData;
      if ("pages" in keyedApiData.query) {
        const pageValues = Object.values(keyedApiData.query.pages);
        data.push(...pageValues.map((pageInfo) => {
          return {
            link: pageInfo.title,
            exists: !("missing" in pageInfo)
          };
        }));
      }
      if ("interwiki" in keyedApiData.query) {
        const interwikiValues = Object.values(keyedApiData.query.interwiki);
        data.push(...interwikiValues.map((iwInfo) => {
          return {
            link: iwInfo.title,
            exists: false
            // Just assume it does not exist TODO: for now
          };
        }));
      }
      return data;
    }
    async _findRedirects(links) {
      const apiData = await getPageInfos(links);
      const redirects = [];
      if (Array.isArray(typeof apiData.query.pages)) {
        apiData.query.pages.forEach((p) => {
          if ("redirect" in p) {
            redirects.push(p.title);
          }
        });
      } else {
        const keyedApiData = apiData;
        Object.values(keyedApiData.query.pages).forEach((p) => {
          if ("redirect" in p) {
            redirects.push(p.title);
          }
        });
      }
      if (redirects.length <= 0) {
        return [];
      }
      const linksApiData = await getPageLinks(redirects);
      const redirectsInfo = Object.values(linksApiData.query.pages).map((l) => {
        return {
          link: l.title,
          redirects: true,
          redirectsTo: "links" in l ? l.links[0].title : null
        };
      });
      for (const info of redirectsInfo) {
        if (info.redirectsTo == null) {
          console.warn(`API returned no links for the redirect "${info.link}". Fixing...`);
          const content = await getPageContent(titleToPageName(info.link));
          console.debug(content);
          const redirectLink = findRedirect(content.content);
          if (redirectLink == null) {
            throw new Error(`Could not get redirect target for link ${info.link}`);
          }
          info.redirectsTo = redirectLink.link;
        }
      }
      const nonRedirectsInfo = links.filter((l) => !redirects.includes(l)).map((l) => {
        return {
          link: l,
          redirects: false
        };
      });
      return [...redirectsInfo, ...nonRedirectsInfo];
    }
  };

  // src/Tools/TranslatedArticlesUi.ts
  var LOCALIZED_LINKS_UI_STORE_KEY = "mwedit-state-arch-translator-translated-art";
  var editFormLocalizedArticlesTable = null;
  var tableBody = null;
  var addTranslatedArticlesUi = ($editForm) => {
    const localizedArticlesUiHtml = `<div class="localizedArticlesUi">
            <div class="localizedArticlesUi-toggler">
                <p>AT - Localized articles:</p>
            </div>
            <table class="wikitable mw-editfooter-list">
                <thead>
                    <tr>
                        <th>Localized name</th>
                        <th>Redirected from</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="2">Please wait</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    $editForm.find(".templatesUsed").before(localizedArticlesUiHtml);
    const linksTable = $editForm.find(".localizedArticlesUi table");
    editFormLocalizedArticlesTable = linksTable[0];
    tableBody = $editForm.find(".localizedArticlesUi table tbody")[0];
    makeCollapsibleFooter(
      linksTable,
      $editForm.find(".localizedArticlesUi-toggler"),
      LOCALIZED_LINKS_UI_STORE_KEY
    );
  };
  var addWorkerResultToUi = (result) => {
    const compareRedirects = (a, b) => {
      const aOrder = a.exists ? 0 : 1;
      const bOrder = b.exists ? 0 : 1;
      return aOrder - bOrder;
    };
    const linkify = (title, followRedirects = true) => {
      return followRedirects ? `/title/${titleToPageName(title)}` : `/index.php?title=${encodeURIComponent(titleToPageName(title))}&redirect=no`;
    };
    if (editFormLocalizedArticlesTable == null || tableBody == null) {
      throw new Error("editFormLocalizedArticlesTable was not created yet");
    }
    if (result.existing.length <= 0 && result.redirects.length <= 0 && result.notExisting.length <= 0) {
      tableBody.innerHTML = '<td class="muted-link" colspan="2">No links were found in the page content</td>';
      return;
    }
    tableBody.innerHTML = "";
    const existingRedirectCell = `<td class="muted-link" rowspan="${result.existing.length}">N/A</td>`;
    let existingRedirectCellAdded = false;
    for (const existing of result.existing) {
      const row = document.createElement("tr");
      const className = "green-link";
      row.classList.add(className);
      row.innerHTML = `<td class="${className}"><a href="${linkify(existing)}">${existing}</td></a>`;
      if (!existingRedirectCellAdded) {
        row.innerHTML += existingRedirectCell;
        existingRedirectCellAdded = true;
      }
      tableBody.appendChild(row);
    }
    for (const redirect of result.redirects.sort(compareRedirects)) {
      const row = document.createElement("tr");
      const className = "blue-link";
      row.classList.add(className);
      const nameCell = document.createElement("td");
      nameCell.className = redirect.exists ? "green-link" : "red-link";
      nameCell.innerHTML = redirect.exists ? `<a href="${linkify(redirect.localizedRedirectTarget)}">${redirect.localizedRedirectTarget}</a>` : redirect.localizedRedirectTarget;
      row.appendChild(nameCell);
      const redirectCell = document.createElement("td");
      redirectCell.className = className;
      const redirectSrc = `<a href="${linkify(redirect.link, false)}">${redirect.link}</a>`;
      const redirectTarget = `<a href="${linkify(redirect.redirectsTo)}">${redirect.redirectsTo}</a>`;
      redirectCell.innerHTML = `${redirectSrc} -&gt; ${redirectTarget}`;
      row.appendChild(redirectCell);
      tableBody.appendChild(row);
    }
    const notExistingRedirectCell = `<td class="muted-link" rowspan="${result.notExisting.length}">N/A</td>`;
    let notExistingRedirectCellAdded = false;
    for (const notExisting of result.notExisting) {
      const row = document.createElement("tr");
      const className = "red-link";
      row.classList.add(className);
      row.innerHTML = `<td class="${className}">${notExisting}</td>`;
      if (!notExistingRedirectCellAdded) {
        row.innerHTML += notExistingRedirectCell;
        notExistingRedirectCellAdded = true;
      }
      tableBody.appendChild(row);
    }
  };

  // src/Tools/SidebarTools.ts
  var copyCurrentRevisionIdTool = () => {
    const showCallback = (info) => {
      return info.pageType !== 3 /* CreateEditor */ && info.pageType !== 1 /* ReadNonExisting */;
    };
    const toolHandler = async () => {
      const revisionId = getMwApi().config.values.wgCurRevisionId;
      await window.navigator.clipboard.writeText(revisionId.toString());
    };
    return sideTool({
      name: "copy-current-revision-id",
      displayText: "Copy revision ID",
      handler: toolHandler,
      showCallback
    });
  };
  var copyEnglishRevisionIdTool = () => {
    const handler = async () => {
      const englishRevisionId = await getEnglishRevisionId();
      console.debug("English revision id: " + englishRevisionId);
      await window.navigator.clipboard.writeText(englishRevisionId?.toString() ?? "null");
    };
    const showCallback = (info) => {
      if (!info.isTranslated) {
        console.debug("Hiding copy English revision ID tool because current page is not a translation");
        return false;
      }
      return true;
    };
    return sideTool({
      name: "copy-english-revision-id",
      displayText: "Copy latest English revision ID",
      handler,
      showCallback
    });
  };
  var createTranslationTool = () => {
    const handler = async () => {
      const pageInfo = getCurrentPageInfo();
      const currentLang = await getCurrentLanguage();
      const translationPageName = `${pageInfo.pageName}_(${currentLang.localizedName})`;
      const target = `/index.php?title=${encodeURIComponent(translationPageName)}&action=edit`;
      console.debug(`createTranslationTool: navigating to ${target}`);
      window.location.assign(target);
    };
    const showCallback = (info) => {
      if (info.isTranslated) {
        console.debug("Hiding create translation tool because current page is already a translation");
        return false;
      }
      return true;
    };
    return sideTool({
      name: "create-translation",
      displayText: "Translate this page",
      handler,
      showCallback
    });
  };
  var changeActiveLanguageTool = () => {
    let anchorElement = null;
    let select = null;
    const saveLanguage = async () => {
      if (select == null) {
        throw new Error("Tried to save the language when the UI was not yet created");
      }
      const newLanguage = getLangInfoFor(select.value);
      await setCurrentLanguage(newLanguage);
      alert(`The Arch Translator active language was changed to ${newLanguage.localizedName}. Please refresh the page.`);
      select.parentElement.classList.add("hidden");
    };
    const createChangeUi = async () => {
      const parent = document.createElement("div");
      parent.classList.add("hidden");
      const selectElement = document.createElement("select");
      for (const [langKey, langInfo] of Object.entries(LanguagesInfo)) {
        const option = document.createElement("option");
        option.value = langKey;
        option.innerText = langInfo.localizedName;
        selectElement.appendChild(option);
      }
      selectElement.onchange = saveLanguage;
      const currentLang = await getCurrentLanguage();
      selectElement.value = currentLang.key;
      select = selectElement;
      parent.appendChild(selectElement);
      return parent;
    };
    const handler = async () => {
      if (anchorElement == null) {
        anchorElement = document.getElementById("t-at-change-language");
      }
      if (select == null) {
        const changeUi = await createChangeUi();
        anchorElement.after(changeUi);
      }
      select.parentElement.classList.toggle("hidden");
    };
    return sideTool({
      name: "change-language",
      displayText: "Change active language",
      handler
    });
  };
  var refreshTranslatedArticles = () => {
    const handler = async () => {
      console.debug("Rerunning translated articles worker");
      const pageInfo = getCurrentPageInfo();
      const contentToParse = await getCurrentPageContent();
      const parser = new WikiTextParser();
      parser.parse(contentToParse);
      const translatedArticleWorker = new TranslatedArticlesWorker(pageInfo);
      translatedArticleWorker.run(parser).then((r) => {
        console.debug(r);
        console.debug("Translated articles worker done");
        addWorkerResultToUi(r);
      });
    };
    return sideTool({
      name: "refresh-translated-articles",
      displayText: "Refresh translated articles",
      handler
    });
  };
  var allSidebarTools = [
    changeActiveLanguageTool(),
    copyCurrentRevisionIdTool(),
    copyEnglishRevisionIdTool(),
    createTranslationTool(),
    refreshTranslatedArticles()
  ];

  // src/Tools/CurrentPageDumper.ts
  var cacheCurrentPage = async () => {
    const info = getCurrentPageInfo();
    if (info.pageType !== 0 /* Read */) return;
    if (info.isRedirect) {
      const content = await getCurrentPageContent();
      const redirectTarget = findRedirect(content);
      if (redirectTarget == null) {
        throw new Error("The current page is a redirect but no redirect link was found");
      }
      await setCachedPageInfo({
        latestRevisionId: info.latestRevisionId,
        pageName: info.pageName,
        redirectsTo: redirectTarget.linkWithHeader,
        type: "redirect" /* Redirect */
      });
    } else {
      await setCachedPageInfo({
        latestRevisionId: info.latestRevisionId,
        pageName: info.pageName,
        type: info.isTranslated ? "translated" /* Translated */ : "english" /* English */
      });
    }
  };

  // src/Utilities/TemplateUtils.ts
  var translateTemplate = (template, language) => {
    return language == null ? template : `${template} (${language.localizedName})`;
  };
  var buildTranslationStatusTemplate = (englishName, date, englishRevisionId, language) => {
    const templateName = translateTemplate("TranslationStatus", language);
    const formattedDate = date.toISOString().split("T")[0];
    return `{{${templateName}|${englishName}|${formattedDate}|${englishRevisionId}}}`;
  };

  // src/Tools/Workers/NewArticleWorker.ts
  var NewArticleWorker = class {
    constructor(pageInfo, language, englishRevisionId) {
      this._info = pageInfo;
      this._language = language;
      this._englishRevisionId = englishRevisionId ?? 0;
    }
    willRun() {
      return this._info.pageType === 3 /* CreateEditor */ && this._info.isTranslated;
    }
    run(parser) {
      if (!this.willRun()) return;
      console.debug("NewArticleWorker: running");
      const englishName = removeLanguagePostfix(this._info.pageName);
      console.debug(`NewArticleWorker: fetching content of ${englishName}`);
      const englishTitle = pageNameToTitle(englishName);
      parser.addInterlanguageLink(`[[en:${englishTitle}]]`, "en");
      const translationStatus = buildTranslationStatusTemplate(
        englishName,
        /* @__PURE__ */ new Date(),
        this._englishRevisionId,
        this._language
      );
      parser.addTemplate(translationStatus);
    }
  };

  // src/Utilities/CssInjector.ts
  var injectCssCode = (cssCode) => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = cssCode;
    document.head.appendChild(styleElement);
  };

  // src/Styles/WikiTable.css
  var WikiTable_default = "/* Sadly, the Template:Yes and Template:No use inline styles and not CSS classes, so we need to include\n our own stylesheet. Besides, there is no Template:Blue */\n\n.wikitable {\n    .green-link {\n        background: #afa;\n    }\n    .blue-link {\n        background: #aaf;\n    }\n    .red-link {\n        background: #faa;\n    }\n    .muted-link {\n        background: #d6d6d6;\n        text-align: center;\n        vertical-align: center;\n        font-size: .7rem;\n    }\n}";

  // src/Styles/Common.css
  var Common_default = ".hidden {\n    display: none;\n}";

  // src/index.ts
  globalThis.getMwApi = getMwApi;
  globalThis.getId = getCachedPageInfo;
  globalThis.setId = setCachedPageInfo;
  globalThis.getContent = getCurrentPageContent;
  var runEditHook = true;
  var editFormJQuery = null;
  var codeMirrorFound = false;
  var initAfterCodeMirror = async (cmEditor) => {
    storeCodeMirrorInstance(cmEditor);
    codeMirrorFound = true;
    cacheCurrentPageContent(cmEditor.getValue());
    if (editFormJQuery == null) {
      throw new Error("editForm was null");
    }
    const pageInfo = getCurrentPageInfo();
    if (pageInfo.pageType === 3 /* CreateEditor */ || pageInfo.pageType === 2 /* Editor */) {
      const info = getCurrentPageInfo();
      if (!info.isTranslated) return;
      addTranslatedArticlesUi(editFormJQuery);
      const englishName = removeLanguagePostfix(info.pageName);
      const englishContent = await getPageContent(englishName);
      await setCachedPageInfo({
        pageName: englishName,
        type: "english" /* English */,
        latestRevisionId: englishContent.revisionId
      });
      const contentToParse = pageInfo.pageType === 3 /* CreateEditor */ ? englishContent.content : cmEditor.getValue();
      const parser = new WikiTextParser();
      parser.parse(contentToParse);
      const newTranslationWorker = new NewArticleWorker(
        pageInfo,
        await getCurrentLanguage(),
        englishContent.revisionId
      );
      const translatedArticleWorker = new TranslatedArticlesWorker(pageInfo);
      translatedArticleWorker.run(parser).then((r) => {
        console.debug(r);
        console.debug("Translated articles worker done");
        addWorkerResultToUi(r);
      });
      if (pageInfo.pageType === 3 /* CreateEditor */) {
        newTranslationWorker.run(parser);
        const newContent = parser.pageContent;
        cacheCurrentPageContent(newContent);
        cmEditor.setValue(newContent);
      }
    }
  };
  setupDb().then(() => {
    console.debug("ArchTranslator: setupDb successful");
    const manager = new InjectionManager();
    manager.on(0 /* DocumentLoad */, () => {
      console.debug("Document loaded");
      injectCssCode(Common_default);
      injectCssCode(WikiTable_default);
    });
    manager.on(1 /* MediaWikiStartup */, () => {
      const api = getMwApi();
      console.debug(api.config.values.wgTitle);
      cacheCurrentPage().then(() => {
        console.debug("index (MediaWikiStartup): cached current page");
      });
      const pageInfo = getCurrentPageInfo();
      for (const tool of allSidebarTools) {
        ToolManager.instance.addSidebarTool(tool, pageInfo);
      }
      ToolManager.instance.addSidebarToPage();
    });
    manager.on(3 /* ExtCodeMirrorSwitch */, async () => {
      if (codeMirrorFound) {
        return;
      }
      const cmElement = $(".CodeMirror");
      if (cmElement != null) {
        const cmEditor = cmElement.get()[0].CodeMirror;
        if (cmEditor == null) {
          console.error("Found .CodeMirror during the ExtCodeMirrorSwitch hook, but the JS editor instance was null");
        } else {
          console.debug("Found CodeMirror instance");
          await initAfterCodeMirror(cmEditor);
        }
      } else {
        console.error("Could not find .CodeMirror during the ExtCodeMirrorSwitch hook");
      }
    });
    manager.onEditForm(async (form) => {
      if (!runEditHook || codeMirrorFound) return;
      console.debug("editform hook");
      if (editFormJQuery == null) {
        console.debug("editForm found");
        editFormJQuery = form;
      }
      const codeMirrorElement = form.find(".CodeMirror");
      if (!codeMirrorFound && codeMirrorElement.length > 0) {
        console.debug("CodeMirror found (editForm hook)");
        runEditHook = false;
        const cmEditor = codeMirrorElement.get()[0].CodeMirror;
        await initAfterCodeMirror(cmEditor);
      }
    });
    manager.startAgents();
  }).catch((e) => {
    console.debug("ArchTranslator: an error has occurred while setting up the database");
    console.error(e);
  });
})();
