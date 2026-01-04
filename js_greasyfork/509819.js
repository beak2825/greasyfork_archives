// ==UserScript==
// @name            PPrivateBookmarkButton
// @namespace       sgthr7/monkey-script
// @version         0.0.3
// @author          SGThr7
// @description     pixiv.netで、非公開状態でブックマークするボタンを追加します
// @description:en  Add private bookmark button to pixiv.net
// @license         MIT
// @match           https://www.pixiv.net/*
// @require         https://cdn.jsdelivr.net/npm/vue@3.5.18/dist/vue.global.prod.js
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509819/PPrivateBookmarkButton.user.js
// @updateURL https://update.greasyfork.org/scripts/509819/PPrivateBookmarkButton.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .ppbb-button[data-v-fd9e3920]{color:inherit;font-size:large;font-family:inherit;padding:0}.container[data-v-fd9e3920]{position:relative}.bookmarked[data-v-fd9e3920]{color:var(--3b0451ac)}.lock-icon[data-v-fd9e3920]{font-size:100%;position:absolute;right:-5px;bottom:1px}.ppbb-root{display:inline;-webkit-user-select:none;user-select:none}.ppbb-main{padding-right:13px}.ppbb-absolute{position:absolute;bottom:0;right:32px}:has(>.ppbb-root){display:flex} ");

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  function testNodeGen(nodeType) {
    return (node) => node instanceof nodeType;
  }
  function iterElementStack(target) {
    function* gen() {
      let current = target;
      while (current != null) {
        yield current;
        current = current.parentElement;
      }
    }
    return Iterator.from(gen());
  }
  function makeLogGroupCollapsedFn(...data) {
    let isGrouping = false;
    function begin() {
      if (!isGrouping) {
        isGrouping = true;
        console.groupCollapsed(...data);
      }
    }
    function end() {
      if (isGrouping) {
        console.groupEnd();
      }
    }
    function getState() {
      return isGrouping;
    }
    return {
      beginLogGroup: begin,
      endLogGroup: end,
      isGrouping: getState
    };
  }
  function findStyles(selector) {
    return Iterator.from(document.styleSheets).map((sheet) => {
      try {
        const rules = sheet.cssRules;
        return rules;
      } catch (e) {
        if (e.name !== "SecurityError") throw e;
        return void 0;
      }
    }).filter((val) => val != null).flatMap((rules) => Iterator.from(rules)).filter((rule) => rule.constructor.name === CSSStyleRule.name).filter((rule) => rule.selectorText === selector).toArray();
  }
  const baseUrl = new URL("https://www.pixiv.net/");
  class PContent {
    // MARK: constructor
    constructor(id, type, baseFavButtonContainer, toggleFavButton) {
      __publicField(this, "_id");
      __publicField(this, "_type");
      __publicField(this, "_baseFavButtonContainer");
      __publicField(this, "_toggleFavButton");
      __publicField(this, "_toggleFavSvg");
      __publicField(this, "_onChangedFav");
      __publicField(this, "_isFavCache");
      __publicField(this, "_observers");
      this._id = id;
      this._type = type;
      this._baseFavButtonContainer = baseFavButtonContainer;
      this._toggleFavButton = toggleFavButton;
      this._toggleFavSvg = this._toggleFavButton.getElementsByTagName("svg").item(0);
      this._onChangedFav = /* @__PURE__ */ new Map();
      this._isFavCache = this.testIsFav();
      this._observers = [];
      {
        const observer = new MutationObserver((records) => {
          const newIsFavValue = Iterator.from(records.values()).map((record) => record.target).filter(testNodeGen(Element)).map((el) => PContent.testIsFav(el)).reduce((prev, cur) => cur, this._isFavCache);
          this.isFavCache = newIsFavValue;
        });
        observer.observe(this._toggleFavButton, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
        this._observers.push(observer);
      }
    }
    // MARK: accessor
    get id() {
      return this._id;
    }
    get type() {
      return this._type;
    }
    get url() {
      const relativeUrl = PContent.makeContentUrl(this.type, this.id);
      const fullUrl = new URL(relativeUrl, baseUrl);
      return fullUrl;
    }
    get favButton() {
      return this._baseFavButtonContainer;
    }
    get isFavCache() {
      return this._isFavCache;
    }
    set isFavCache(value) {
      if (this._isFavCache !== value) {
        this._isFavCache = value;
        Iterator.from(this._onChangedFav.values()).forEach((fn) => fn(this._isFavCache));
      }
    }
    static tryFromFavButton(favButtonElement) {
      const contentLinkElement = PContent.findRelatedContentAnchorWithFavButton(favButtonElement);
      if (contentLinkElement == null) return void 0;
      const containerElement = favButtonElement.parentElement;
      if (containerElement == null) return void 0;
      const info = PContent.findInfoFromLinkElement(contentLinkElement);
      if (info == null) return void 0;
      const { type, id } = info;
      const testIsButton = testNodeGen(HTMLButtonElement);
      const toggleFavButton = PContent.testIsMainArtworkFavButton(favButtonElement) ? PContent.findFavButtonWithId(document, id) : favButtonElement;
      if (toggleFavButton == null || !testIsButton(toggleFavButton)) return void 0;
      return new PContent(id, type, favButtonElement, toggleFavButton);
    }
    // MARK: Edit contents
    toggleFav() {
      this._toggleFavButton.click();
    }
    testIsFav() {
      return this._toggleFavSvg != null ? PContent.testIsFav(this._toggleFavSvg) : false;
    }
    registerOnChangedFav(fn) {
      const uuid = self.crypto.randomUUID();
      if (this._onChangedFav.has(uuid)) {
        return void 0;
      }
      this._onChangedFav.set(uuid, fn);
      return uuid;
    }
    unregisterOnChangedFav(id) {
      if (this._onChangedFav.has(id)) {
        this._onChangedFav.delete(id);
        return true;
      } else {
        return false;
      }
    }
    // MARK: Static fn
    static get favButtonQuery() {
      return ':is(button,a[href^="/bookmark_add.php"]):has(> svg[width="32"][height="32"] path+path)';
    }
    static findFavButton(container) {
      return container.querySelector(PContent.favButtonQuery);
    }
    static makeToggleFavButtonQuery(id) {
      return `div:has(> a img[src*="${id}"]) button`;
    }
    static findFavButtonWithId(container, id) {
      return container.querySelector(PContent.makeToggleFavButtonQuery(id));
    }
    // static get mainContentFavButtonQuery() {
    // 	return ':is(button.gtm-main-bookmark,a[href^="/bookmark_add.php"]):has(> svg[width="32"][height="32"] path+path)'
    // }
    static testIsMainArtworkFavButton(favButton) {
      const isAnchor = testNodeGen(HTMLAnchorElement);
      return favButton.classList.contains("gtm-main-bookmark") || favButton.tagName === HTMLAnchorElement.toString() && isAnchor(favButton);
    }
    static get childContentAnchorQuery() {
      return ':is(a[href^="/artworks/"],a[href^="/novel/"],a[href*="i.pximg.net"]):has(img)';
    }
    static findChildContentAnchor(container) {
      return container.querySelector(PContent.childContentAnchorQuery);
    }
    static findRelatedContentAnchorWithFavButton(favButton) {
      return iterElementStack(favButton).map(PContent.findChildContentAnchor).find((val) => val != null);
    }
    static findInfoFromLinkElement(imageAnchor) {
      var _a, _b, _c;
      const imageDom = imageAnchor.getElementsByTagName("img")[0];
      const imageSrc = imageDom.src;
      if (imageSrc.includes("img-master") || imageSrc.includes("custom-thumb")) {
        const id = (_a = imageSrc.split("/").at(-1)) == null ? void 0 : _a.split("_").at(0);
        if (id != null) {
          return { type: "artworks", id };
        }
      } else if (imageSrc.includes("novel-cover-master")) {
        const id = (_c = (_b = imageSrc.split("/").at(-1)) == null ? void 0 : _b.split("_").at(0)) == null ? void 0 : _c.slice("ci".length);
        if (id != null) {
          return { type: "novel", id };
        }
      }
      return void 0;
    }
    static makeContentUrl(type, id) {
      switch (type) {
        case "artworks": {
          return new URL(`/artworks/${id}`);
        }
        case "novel": {
          return new URL(`/novel/show.php?id=${id}`);
        }
      }
    }
    static get favButtonColor() {
      return "rgb(255, 64, 96)";
    }
    static testIsFav(el) {
      const favColor = PContent.favButtonColor;
      const isFav = Iterator.from(el.classList.values()).flatMap((className) => findStyles(`.${className}`)).map((rule) => rule.style.getPropertyValue("color")).filter((val) => val !== "").some((val) => val === favColor);
      return isFav;
    }
  }
  function collectContents(container) {
    return Iterator.from(collectFavButtons(container).values()).map(PContent.tryFromFavButton).filter((val) => val != null).toArray();
  }
  function collectFavButtons(container) {
    return container.querySelectorAll(PContent.favButtonQuery);
  }
  async function bookmarkAsPrivate(id) {
    const url = new URL("https://www.pixiv.net/ajax/illusts/bookmarks/add");
    const payload = {
      illust_id: id,
      restrict: 1,
      comment: "",
      tags: []
    };
    const req = new Request(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json; charset=UTF-8",
        "x-csrf-token": findToken() ?? ""
      },
      body: JSON.stringify(payload),
      credentials: "same-origin"
    });
    const res = await fetch(req);
    const body = await res.json();
    if (!res.ok) {
      console.error("Response", body.message, res);
    }
  }
  function findToken() {
    var _a, _b, _c;
    const nextData = window.__NEXT_DATA__;
    if (nextData == null) return void 0;
    const serverStateRaw = (_b = (_a = nextData.props) == null ? void 0 : _a.pageProps) == null ? void 0 : _b.serverSerializedPreloadedState;
    if (serverStateRaw == null) return void 0;
    const serverState = JSON.parse(serverStateRaw);
    const token = (_c = serverState.api) == null ? void 0 : _c.token;
    return token;
  }
  const _hoisted_1 = { class: "container" };
  const _hoisted_2 = ["innerHTML"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "PrivateBookmarkButton",
    props: {
      content: {
        type: PContent,
        required: true
      }
    },
    setup(__props) {
      vue.useCssVars((_ctx) => ({
        "3b0451ac": vue.unref(favColor)
      }));
      const props = __props;
      const contentId = vue.computed(() => props.content.id);
      const originalFavSvg = vue.computed(() => props.content.favButton.querySelector("svg"));
      const favImg = vue.computed(() => {
        var _a;
        return ((_a = originalFavSvg.value) == null ? void 0 : _a.outerHTML) ?? "♥";
      });
      const favColor = PContent.favButtonColor;
      let onChangedFavHandler;
      const isFav = makeIsFavRef();
      function makeIsFavRef() {
        const retRef = vue.customRef((track, trigger) => {
          onChangedFavHandler = props.content.registerOnChangedFav(trigger);
          return {
            get() {
              track();
              return props.content.testIsFav();
            },
            // no setter
            set() {
            }
          };
        });
        return retRef;
      }
      function privateBookmark() {
        props.content.toggleFav();
        setTimeout(() => {
          bookmarkAsPrivate(contentId.value).then(() => {
          });
        }, 100);
        return;
      }
      vue.onBeforeUnmount(() => {
        if (onChangedFavHandler != null) {
          props.content.unregisterOnChangedFav(onChangedFavHandler);
        }
      });
      return (_ctx, _cache) => {
        return !vue.unref(isFav) ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          type: "button",
          class: "ppbb-button",
          onClick: privateBookmark
        }, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("div", { innerHTML: favImg.value }, null, 8, _hoisted_2),
            _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "lock-icon" }, "🔒️", -1))
          ])
        ])) : vue.createCommentVNode("", true);
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
  const PrivateBookmarkButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fd9e3920"]]);
  init();
  function init() {
    console.groupCollapsed("Initial insert");
    const contents = collectContents(document);
    Iterator.from(contents.values()).forEach(insertButton);
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver((records) => {
      const { beginLogGroup, endLogGroup, isGrouping } = makeLogGroupCollapsedFn("Detect new contents loaded", `len=${records.length}`);
      records.forEach((record) => {
        observer.disconnect();
        Iterator.from(record.addedNodes.values()).filter(testNodeGen(Element)).map(PContent.findFavButton).filter((val) => val != null).map(PContent.tryFromFavButton).filter((val) => val != null).filter(() => {
          beginLogGroup();
          return true;
        }).forEach(insertButton);
        observer.observe(document, observerConfig);
      });
      if (isGrouping()) {
        console.log(records);
      }
      endLogGroup();
    });
    observer.observe(document, observerConfig);
    console.groupEnd();
  }
  function insertButton(content) {
    console.groupCollapsed("insertButton", content.id);
    console.log("content", content);
    const favContainer = content.favButton.parentElement;
    if (favContainer == null) {
      console.error("Failed to find parent element of fav button", content.favButton);
      return;
    }
    const { appElement } = makeButton(content);
    favContainer.insertBefore(appElement, content.favButton);
    console.log("Insert private fav button", appElement);
    console.groupEnd();
  }
  function makeButton(content) {
    const appElement = document.createElement("div");
    appElement.classList.add("ppbb-root", ...content.favButton.classList);
    const app = vue.createApp(PrivateBookmarkButton, { content });
    app.mount(appElement);
    return { app, appElement };
  }

})(Vue);