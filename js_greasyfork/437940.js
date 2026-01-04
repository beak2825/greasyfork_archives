// ==UserScript==
// @name                知乎辅助工具
// @description         知乎辅助增强脚本，提供隐藏侧边栏等功能
//
// @author              xiao
// @license             GPLv3.0
// @namespace           https://github.com/xiaoboost
// @supportURL          https://github.com/xiaoboost/scripts/issues
// @homepageURL         https://github.com/xiaoboost/scripts/tree/master/packages/zhihu
// @icon                https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
//
// @grant               GM_addStyle
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               unsafeWindow
// @run-at              document-start
// @include             https://www.zhihu.com/*
// @include             https://zhuanlan.zhihu.com/*
//
// @date                2022/01/05
// @modified            2022/10/29
// @version             1.3.4
// @downloadURL https://update.greasyfork.org/scripts/437940/%E7%9F%A5%E4%B9%8E%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/437940/%E7%9F%A5%E4%B9%8E%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(() => {
  // src/hide-sidebar/style.jss.ts
  var style_jss_default = {
    classes: {
      ".Topstory-container, .Question-main": "Topstory-container, .Question-main",
      "SideBarBtn": "script-side-bar-btn-0",
      "WidthFullMain": "script-width-full-main-0"
    },
    toString: function() {
      return `.Topstory-container, .Question-main {
  position: relative;
}
.script-side-bar-btn-0 {
  color: #8590a6;
  right: -26px;
  width: 32px;
  cursor: pointer;
  height: 32px;
  display: flex;
  position: absolute;
  font-size: 24px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
  align-items: center;
  border-radius: 6px;
  justify-content: center;
}
.script-width-full-main-0 .css-1qyytj7, .script-width-full-main-0 .Question-sideColumn--sticky, .script-width-full-main-0 .css-knqde {
  display: none;
}
.script-width-full-main-0 .Topstory-mainColumn, .script-width-full-main-0 .Question-mainColumn, .script-width-full-main-0 .SearchMain {
  width: 1000px !important;
  max-width: 100%;
  margin-right: 0;
}
.script-width-full-main-0 .RichContent figure img {
  max-width: 70%;
}
.script-width-full-main-0 .RichContent-actions {
  width: 1000px !important;
  max-width: 100%;
}`;
    }
  };

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/assert.js
  function isNumber(x) {
    return typeof x === "number";
  }
  function isUndef(x) {
    return x === void 0 || x === null;
  }
  function isFunc(x) {
    return typeof x === "function";
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/func.js
  function debounce(cb, delay = 200) {
    let timer;
    let _resolve;
    let _reject;
    const end = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    return function delayInDebounce(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const result = cb(...args);
          if (result && isFunc(result.then)) {
            result.then(_resolve);
          } else {
            _resolve(result);
          }
        } catch (e) {
          _reject(e);
        }
      }, delay);
      return end;
    };
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/subject.js
  var Subject = class {
    constructor() {
      this._events = [];
    }
    observe(ev) {
      this._events.push(ev);
      return () => this.unObserve(ev);
    }
    unObserve(ev) {
      if (!ev) {
        this._events = [];
      } else {
        this._events = this._events.filter((cb) => cb !== ev);
      }
    }
    notify(newVal, lastVal) {
      this._events.forEach((cb) => cb(newVal, lastVal));
    }
  };
  var Watcher = class extends Subject {
    constructor(initVal) {
      super();
      this._data = initVal;
    }
    static computed(watchers, cb) {
      const initVal = cb(...watchers.map(({ _data }) => _data));
      const newWatchers = initVal.map((init) => new Watcher(init));
      const observeCb = () => {
        const current = watchers.map(({ _data }) => _data);
        cb(...current).forEach((val, i) => {
          newWatchers[i].setData(val);
        });
      };
      watchers.forEach((watcher) => watcher.observe(observeCb));
      return newWatchers;
    }
    get data() {
      return this._data;
    }
    setData(val) {
      if (val !== this._data) {
        const last = this._data;
        this._data = val;
        this.notify(val, last);
      }
    }
    observe(event, immediately = false) {
      const unObserve = super.observe(event);
      if (immediately) {
        event(this._data);
      }
      return unObserve;
    }
    once(val) {
      const func = arguments.length === 0 ? () => true : isFunc(val) ? val : (item) => item === val;
      return new Promise((resolve) => {
        const callback = (item) => {
          if (func(item)) {
            this.unObserve(callback);
            resolve(item);
          }
        };
        this.observe(callback);
      });
    }
    computed(cb) {
      const watcher = new Watcher(cb(this._data));
      this.observe((val) => watcher.setData(cb(val)));
      return watcher;
    }
  };

  // ../utils/src/command.ts
  function registerTiggerCommand(names, defaultIndex, cb) {
    let commandId = void 0;
    let index = defaultIndex;
    function tiger() {
      if (isNumber(commandId)) {
        GM_unregisterMenuCommand(commandId);
      }
      commandId = GM_registerMenuCommand(names[index], () => {
        cb(tiger);
      });
      index = 1 - index;
    }
    tiger();
  }

  // ../utils/src/style.ts
  var codes = [];
  function addStyle(code) {
    codes.push(code);
  }
  setTimeout(() => {
    GM_addStyle(codes.join("\n"));
    if (false) {
      log("\u6837\u5F0F\u5143\u7D20\u52A0\u8F7D\u6210\u529F");
    }
  });

  // ../utils/src/web.ts
  function onLoad(window2, cb) {
    if (document.readyState === "complete") {
      cb();
    }
    window2.addEventListener("load", cb);
  }

  // src/hide-sidebar/constant.ts
  var StoreKey = "hide-sidebar";

  // src/utils/constant.ts
  var ZhihuClassName = {
    MainContainer: "Topstory-container",
    MainSideBar: "css-1qyytj7",
    MainQuestionList: "Topstory-mainColumn",
    MainQuestionItem: "TopstoryItem",
    MainQuestionListContainer: "Topstory-follow",
    MainQuestionItemTitle: "ContentItem-title",
    QuestionContainer: "Question-main",
    QuestionPageSideBar: "Question-sideColumn--sticky",
    ShortAnswerListContainer: "ListShortcut",
    QuestionAnswerList: "Question-mainColumn",
    AnswerBottomAction: "RichContent-actions",
    SearchItemList: "SearchMain",
    SearchSideBar: "css-knqde",
    AnswerContainer: "RichContent",
    AnswerContentContainer: "RichText",
    AnswerCollapsed: "is-collapsed",
    ColumnContainer: "Post-Main",
    ColumnAction: "Post-SideActions"
  };
  var observerOption = {
    attributes: false,
    attributeOldValue: false,
    characterData: false,
    characterDataOldValue: false,
    childList: false,
    subtree: false
  };

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/env.js
  var inBrowser = typeof window !== "undefined";
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
  var isEdge = UA && UA.indexOf("edge/") > 0;
  var isAndroid = UA && UA.indexOf("android") > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var supportsPassive = false;
  var supportsOnce = false;
  if (inBrowser) {
    try {
      document.body.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get() {
          supportsPassive = true;
        }
      }));
    } catch (e) {
    }
    try {
      document.body.addEventListener("test", null, Object.defineProperty({}, "once", {
        get() {
          supportsOnce = true;
        }
      }));
    } catch (e) {
    }
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/event.js
  var MouseButtons;
  (function(MouseButtons2) {
    MouseButtons2[MouseButtons2["Left"] = 0] = "Left";
    MouseButtons2[MouseButtons2["Middle"] = 1] = "Middle";
    MouseButtons2[MouseButtons2["Right"] = 2] = "Right";
    MouseButtons2[MouseButtons2["Back"] = 3] = "Back";
    MouseButtons2[MouseButtons2["Forward"] = 4] = "Forward";
  })(MouseButtons || (MouseButtons = {}));

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/web/class-name.js
  function addClassName(el, className) {
    var _a;
    const classNameTrim = className.trim();
    const oldClassNames = ((_a = el.getAttribute("class")) !== null && _a !== void 0 ? _a : "").split(/\s+/);
    if (oldClassNames.includes(classNameTrim)) {
      return;
    }
    const newCLassNames = oldClassNames.concat(className.trim()).join(" ");
    el.setAttribute("class", newCLassNames);
  }
  function removeClassName(el, className) {
    var _a;
    const classNameTrim = className.trim();
    const oldClassNames = ((_a = el.getAttribute("class")) !== null && _a !== void 0 ? _a : "").split(/\s+/);
    if (!oldClassNames.includes(classNameTrim)) {
      return;
    }
    const newCLassNames = oldClassNames.filter((name) => name !== classNameTrim).join(" ");
    el.setAttribute("class", newCLassNames);
  }

  // src/hide-sidebar/store.ts
  var isHide = new Watcher(GM_getValue(StoreKey, true));
  function setStatus(val) {
    if (false) {
      log2(`\u5F53\u524D\u8FB9\u680F\u72B6\u6001\u4E3A: ${val ? "\u9690\u85CF" : "\u9ED8\u8BA4"}`);
    }
    GM_setValue(StoreKey, val);
    val ? addClassName(document.body, style_jss_default.classes.WidthFullMain) : removeClassName(document.body, style_jss_default.classes.WidthFullMain);
  }
  function active() {
    onLoad(unsafeWindow, () => {
      setStatus(isHide.data);
      const observer = new MutationObserver(() => {
        setStatus(isHide.data);
        if (false) {
          log2("body \u5143\u7D20 class \u5C5E\u6027\u53D8\u66F4\uFF0C\u91CD\u7F6E\u5C5E\u6027");
        }
      });
      observer.observe(document.body, {
        ...observerOption,
        attributeFilter: ["class"],
        attributes: true
      });
    });
  }
  isHide.observe(setStatus);

  // src/hide-sidebar/command.ts
  function active2() {
    registerTiggerCommand(["\u9690\u85CF\u4FA7\u8FB9\u680F", "\u6062\u590D\u4FA7\u8FB9\u680F"], Number(isHide.data), (tigger) => {
      isHide.setData(!isHide.data);
      tigger();
    });
  }

  // src/hide-sidebar/index.ts
  function active3() {
    active();
    active2();
    addStyle(style_jss_default.toString());
  }

  // src/hide-image/style.jss.ts
  var style_jss_default2 = {
    classes: {
      "ImageBtn": "script-image-btn-0",
      "ImageBox": "script-image-box-0",
      "ImageBoxHide": "script-image-box-hide-0",
      ".RichContent": "RichContent"
    },
    toString: function() {
      return `.script-image-box-hide-0 {
  margin: 0;
}
.RichContent .script-image-box-0 figure[data-size] {
  width: 100%;
  margin: 0;
  margin-top: 2px;
}
.RichContent .script-image-btn-0 {
  color: #AAA;
  cursor: pointer;
  margin: 0;
  font-size: 12px;
  text-decoration: none;
}
.RichContent .script-image-box-0 {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.RichContent .script-image-box-0.script-image-box-hide-0 figure {
  display: none;
}`;
    }
  };

  // src/hide-image/constant.ts
  var isInBoxAttr = "in-box";
  var btnText = ["\u663E\u793A\u56FE\u7247", "\u5C06\u56FE\u7247\u9690\u85CF"];

  // src/hide-image/render.ts
  function wrapImage(img) {
    const box = document.createElement("div");
    const btn = document.createElement("a");
    let isHide2 = false;
    function setStatus2() {
      if (isHide2) {
        btn.textContent = `\u2550\u2550\u2550 [${btnText[0]}] \u2550\u2550\u2550`;
        addClassName(box, style_jss_default2.classes.ImageBoxHide);
      } else {
        btn.textContent = `\u2554\u2550\u2550 [${btnText[1]}] \u2550\u2550\u2557`;
        removeClassName(box, style_jss_default2.classes.ImageBoxHide);
      }
    }
    img.setAttribute(isInBoxAttr, "true");
    box.setAttribute("class", style_jss_default2.classes.ImageBox);
    btn.setAttribute("class", style_jss_default2.classes.ImageBtn);
    box.appendChild(btn);
    box.appendChild(img);
    setStatus2();
    btn.addEventListener("click", () => {
      isHide2 = !isHide2;
      setStatus2();
    });
    return box;
  }
  function wrapAllImage() {
    if (false) {
      log3("\u5237\u65B0\u9875\u9762\u4E2D\u7684\u6240\u6709\u56FE\u7247");
    }
    const tempDiv = document.createElement("div");
    const selector = `.${ZhihuClassName.AnswerContainer} figure[data-size]`;
    Array.from(document.querySelectorAll(selector)).filter((img) => isUndef(img.getAttribute(isInBoxAttr))).forEach((img) => {
      const parent = img.parentElement;
      if (parent) {
        parent.replaceChild(tempDiv, img);
        parent.replaceChild(wrapImage(img), tempDiv);
      }
    });
  }

  // src/hide-image/index.ts
  addStyle(style_jss_default2.toString());
  function active4() {
    onLoad(unsafeWindow, () => {
      const wrapImageDebounce = debounce(wrapAllImage, 200);
      const observer = new MutationObserver(wrapImageDebounce);
      observer.observe(document.body, {
        ...observerOption,
        childList: true,
        subtree: true
      });
      wrapImageDebounce();
    });
  }

  // src/column-widescreen/index.jss.ts
  var index_jss_default = {
    classes: {
      ".Post-SideActions": "Post-SideActions"
    },
    toString: function() {
      return `article.Post-Main>* {
  width: 900px !important;
}
.Post-SideActions {
  right: calc(50vw - 550px) !important;
}`;
    }
  };

  // src/column-widescreen/index.ts
  function active5() {
    addStyle(index_jss_default.toString());
  }

  // src/record-answer/style.jss.ts
  var style_jss_default3 = {
    classes: {
      "readAnswer": "script-read-answer-0"
    },
    toString: function() {
      return `
        .script-read-answer-0.TopstoryItem .ContentItem-title, .script-read-answer-0.TopstoryItem .RichContent.is-collapsed
       {
  color: #777;
}`;
    }
  };

  // src/record-answer/utils.ts
  var recordLimit = 100;
  var recordStoreKey = "record-answer";
  var bindEventAttr = "bind-record-event";
  var listSelector = `.${ZhihuClassName.MainQuestionListContainer} > div`;

  // src/record-answer/store.ts
  var recordList = GM_getValue(recordStoreKey, []);
  var getRecordList = () => recordList.reduce((ans, key) => (ans[key] = true, ans), {});
  function addRecord(href) {
    const val = href.trim();
    if (!val || recordList.find((href2) => href2 === val)) {
      return;
    }
    if (false) {
      log4(`\u6DFB\u52A0\u5DF2\u8BFB\u94FE\u63A5\u8BB0\u5F55\uFF1A${val}`);
    }
    recordList.push(val);
    while (recordList.length > recordLimit) {
      recordList.shift();
    }
    GM_setValue(recordStoreKey, recordList);
  }

  // src/record-answer/render.ts
  function getAnswerUrl(answer) {
    const selector = `.${ZhihuClassName.MainQuestionItemTitle} a[href]`;
    const urlDom = answer.querySelector(selector);
    if (urlDom) {
      return urlDom.getAttribute("href");
    } else {
      return null;
    }
  }
  function wrapAnswer(answer) {
    if (answer.getAttribute(bindEventAttr)) {
      return;
    }
    answer.setAttribute(bindEventAttr, "true");
    answer.addEventListener("click", () => {
      addClassName(answer, style_jss_default3.classes.readAnswer);
      addRecord(getAnswerUrl(answer) ?? "");
    });
  }
  function wrapAllAnswer() {
    if (false) {
      log5("\u6807\u8BB0\u9875\u9762\u4E2D\u7684\u6240\u6709\u65E7\u56DE\u7B54");
    }
    const record = getRecordList();
    const selector = `${listSelector} > .${ZhihuClassName.MainQuestionItem}`;
    const answers = Array.from(document.querySelectorAll(selector));
    for (const ans of answers) {
      const ansUrl = getAnswerUrl(ans);
      if (!ansUrl) {
        continue;
      }
      if (record[ansUrl.trim()]) {
        addClassName(ans, style_jss_default3.classes.readAnswer);
      }
      wrapAnswer(ans);
    }
  }

  // src/record-answer/index.ts
  addStyle(style_jss_default3.toString());
  function active6() {
    onLoad(unsafeWindow, () => {
      const listDom = document.querySelector(listSelector);
      if (!listDom) {
        if (false) {
          log6("\u672A\u53D1\u73B0\u95EE\u9898\u5217\u8868\u5BB9\u5668\u5143\u7D20\uFF0C\u5DF2\u8BFB\u95EE\u9898\u6807\u8BB0\u5931\u8D25");
        }
        return;
      }
      const wrapImageDebounce = debounce(wrapAllAnswer, 200);
      const observer = new MutationObserver(wrapImageDebounce);
      observer.observe(document.body, {
        ...observerOption,
        childList: true
      });
      wrapImageDebounce();
    });
  }

  // src/index.ts
  active3();
  active4();
  active5();
  active6();
})();
