// ==UserScript==
// @name         kk-helper
// @namespace    https://greasyfork.org/zh-CN/users/1167332-stephenykk
// @homepage    https://greasyfork.org/zh-CN/scripts/474672-kk-helper
// @version      3.0.0
// @description  个人开发常用帮助脚本
// @author       #stephenykk
// @match        https://juejin.cn/post/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.jianshu.com/p/*
// @match        https://segmentfault.com/a/*
// @match        https://mp.weixin.qq.com/s*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://sspai.com/post/*
// @match        *://www.news.cn/*/**/*.htm*
// @match        *://*.people.com.cn/*/**/*.htm*
// @icon         https://res.wx.qq.com/a/fed_upload/9300e7ac-cec5-4454-b75c-f92260dd5b47/logo-mp.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474672/kk-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474672/kk-helper.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function log(...args) {
    console.log("[KKCopy]", ...args);
  }

  const autoClick = (ele, callback, seconds = 2) => {
    console.log("try auto click ele:", ele);
    ele.click();
    callback && setTimeout(callback, seconds * 1000);
  };

  function toast(msg) {
    const toastEle = document.createElement("div");
    toastEle.style = `
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 15px 30px;
    border-radius: 5px;
    z-index: 1000000;
    font-size: 15px;
    line-height: 1.5;
    `;
    toastEle.innerText = msg;
    document.body.appendChild(toastEle);
    setTimeout(() => {
      document.body.removeChild(toastEle);
    }, 2000);
  }

  const btnStyle = `
  opacity: 0.7;
  font-size: 15px;
  border: 0;
  background: brown;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 20px;
  `;

  function createBtn(text, listener, style = "") {
    let btnsWrap = $("#myBtnsWrap");
    if (!btnsWrap) {
      btnsWrap = document.createElement("div");
      btnsWrap.id = "myBtnsWrap";
      btnsWrap.style =
        "position: fixed; left: 50%; top: 10px; z-index: 10000; transform: translateX(-50%);";
      document.body.appendChild(btnsWrap);
    }
    //   if (this.mybtn) return;
    const btn = document.createElement("button");
    btn.textContent = text || "Submit";
    btn.className = "mybtn";
    btn.setAttribute("data-txt", text);
    btn.style = btnStyle + style;
    btnsWrap.appendChild(btn);
    btn.addEventListener("click", listener);
    console.log("createBtn: btn=", btn);
    //   this.mybtn = btn;
    return btn;
  }

  function getCopyMethod() {
    let input = document.querySelector("#myInputEle");
    if (input) {
      return input.copyOf;
    }

    const inpEle = document.createElement("input");
    inpEle.type = "text";
    document.body.insertBefore(inpEle, null);
    inpEle.style = "position: fixed; top: -100px; right: 0; z-index: 10000;";
    inpEle.setAttribute("id", "myInputEle");
    input = inpEle;

    const doCopy = function (text) {
      input.value = text;
      input.select();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("copy");
      toast("copy ok");
      log("copy done");
    };

    input.copyOf = doCopy;

    return input.copyOf;
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  class OriginLinkCopyAction {
    start() {
      // 复制原文地址按钮
      this.btn = createBtn("原文地址", () => {
        const copy = getCopyMethod();
        copy(`> 原文地址: [${document.title}](${location.href})`);
      });
    }
  }

  // eslint-disable-next-line
  const linkCopyAction = new OriginLinkCopyAction();
  linkCopyAction.start();

  class BlogTitleCopyAction {
    start() {
      // 复制原文地址按钮
      this.btn = createBtn(
        "文章标题",
        () => {
          const copy = getCopyMethod();
          copy(document.title);
        },
        "right: 300px"
      );
    }
  }

  const titleCopyAction = new BlogTitleCopyAction();
  titleCopyAction.start();

  // 表单填写
  class FormFiller {
    constructor(enableUrl, values, btn) {
      this.url = enableUrl;
      this.values = values;
      this.btn = btn;
    }

    element(selector) {
      return $(selector);
    }

    fill() {
      const inputSelectors = Object.keys(this.values);
      const inputValues = Object.values(this.values);
      inputSelectors.forEach((inpSelctor, i) => {
        const input = this.element(inpSelctor);
        if (input) {
          input.value = inputValues[i];
        } else {
          console.log("not found element for", inpSelctor);
        }
      });
    }

    submit() {
      if (this.btn.selector) {
        const submitBtn = this.element(this.btn.selector);
        submitBtn?.click();
        return;
      }

      console.log("not found submitBtn cancel", this.btn); // debug only
    }

    createBtn() {
      //   if (this.mybtn) return;
      const btn = document.createElement("button");
      btn.textContent = this.btn.text || "Submit";
      btn.className = "mybtn";
      btn.style = btnStyle;
      document.body.appendChild(btn);
      //   this.mybtn = btn;
      return btn;
    }

    start() {
      if (location.href.includes(this.url) === false) return;

      this.mybtn = this.createBtn();
      // click mybtn, fill data to input box, and trigger submit button click method
      this.mybtn.addEventListener("click", () => {
        this.fill();
        this.submit();
      });
    }
  }
})();

(function () {
  function clearStorageAndCookie(isrefresh = true) {
    [sessionStorage, localStorage].forEach((storage) => storage.clear());
    clearCookies();
    console.log(document.cookie, "done!!");
    isrefresh && setTimeout(location.reload.bind(location), 1000);
  }

  function pick(data, keys) {
    return keys.reduce((ret, key) => {
      ret[key] = data[key];
      return ret;
    }, {});
  }

  function localCacheEntries(data) {
    Object.keys(data).forEach((key) => {
      localStorage[key] = data[key];
    });

    console.log("done", localStorage);
  }

  function getCookies() {
    return document.cookie.match(/[\w-]+(?=\=[^;]+)/g) || [];
  }

  function clearCookies() {
    getCookies().forEach((cname) => {
      delCookie(cname);
    });
  }

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "; Expires=" + d.toUTCString();
    // document.cookie = cname + "=" + cvalue + expires + "; Path=/";
    document.cookie = cname + "=" + cvalue + expires;
  }

  function delCookie(cname) {
    console.log("del cookie:", cname);
    setCookie(cname, "", -1);
  }

  function copy(str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  function toUnicode(str) {
    const ls = str.split("");
    const result = ls
      .map((c) => {
        if (/\w/.test(c)) return c;

        return "\\u" + c.charCodeAt(0).toString(16).toUpperCase();
      })
      .join("");

    copy(result);
    console.log("copy done");
    return result;
  }

  function isPlainObject(val) {
    return Object.prototype.toString.call(val).slice(8, -1) === "Object";
  }

  function getTableTypeDefines(vm) {
    const { tableData, schema } = vm.props ?? {};
    if (!tableData) {
      console.warn("not tableData found:", vm.props);
      return;
    }

    return getTypeDefines(tableData[0], schema);
  }

  function getTypeDefines(obj = {}, schema = false, level = 10) {
    // if (Array.isArray(obj)) {
    //   if (obj.length === 0) {
    //     return 'Array<any>'
    //   }
    //   return `Array<${getTypeDefines(obj[0], schema, level - 1)}>`
    // }
    if (Array.isArray(obj)) {
      obj = obj[0];
    }

    const getPrimativeType = (key, val) => {
      let type = typeof val;
      let text = "";

      if (!schema) {
        return { type, text };
      }

      const props = schema.properties ?? {};
      if (props[key]) {
        type = props[key].type;
        text = props[key].title;
      }

      return { type, text };
    };
    let ret = "{\n";
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("_")) return;
      const val = obj[key];
      const isPrimative = !isPlainObject(val) && !Array.isArray(val);
      let title = "";
      let valType;
      if (isPrimative) {
        const { type, text } = getPrimativeType(key, val);
        valType = type;
        title = text;
      } else {
        valType = getTypeDefines(val, schema);
      }

      const keyDefine = `${key}: ${valType};${title ? " // " + title : ""}\n`;
      ret += keyDefine;
    });
    ret += "\n}";

    copy(ret);
    console.log("copy done!");
    return ret;
  }

  window.my = {
    getTableTypeDefines,

    toUnicode,
    pick,
    copy,

    getCookies,
    setCookie,
    delCookie,
    clearCookies,

    localCacheEntries,
    clearStorageAndCookie,
  };
})();
