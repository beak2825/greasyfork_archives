// ==UserScript==
// @name         编程猫账号保护
// @namespace    https://s-lightning.github.io/
// @version      0.0.14
// @description  保护你的编程猫账号。
// @author       SLIGHTNING
// @match        http://*.codemao.cn/*
// @match        https://*.codemao.cn/*
// @match        http://*.bcmcdn.com/*
// @match        https://*.bcmcdn.com/*
// @match        http://open.lihouse.xyz/omnia/player/*
// @match        https://open.lihouse.xyz/omnia/player/*
// @match        http://ccp.cloudroo.top/*
// @match        https://ccp.cloudroo.top/*
// @match        http://ccp.be-a.dev/*
// @match        https://ccp.be-a.dev/*
// @match        http://open.lihouse.xyz/static/ccp/*
// @match        https://open.lihouse.xyz/static/ccp/*
// @icon         https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3
// @grant        none
// @license      AGPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504192/%E7%BC%96%E7%A8%8B%E7%8C%AB%E8%B4%A6%E5%8F%B7%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504192/%E7%BC%96%E7%A8%8B%E7%8C%AB%E8%B4%A6%E5%8F%B7%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DangerLevel: function() { return /* binding */ DangerLevel; },
/* harmony export */   start: function() { return /* binding */ start; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _UI_reject_hint__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _UI_ask_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
var _DangerLevel;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




class DangerLevel {
  constructor(description, code) {
    this.description = description;
    this.code = code;
  }
  toString() {
    return this.description;
  }
}
_DangerLevel = DangerLevel;
_defineProperty(DangerLevel, "LOW", new _DangerLevel("低", 1));
_defineProperty(DangerLevel, "MEDIUM", new _DangerLevel("中", 2));
_defineProperty(DangerLevel, "HIGH", new _DangerLevel("高", 3));
const rejectRules = [{
  test: /https?:\/\/codemao1234\.pythonanywhere\.com\/add/,
  level: DangerLevel.HIGH,
  function: "发送学生信息以邀请加入班级，从而控制账号",
  consequence: "账号被他人控制"
}, {
  test: /https?:\/\/codemao1234\.pythonanywhere\.com/,
  level: DangerLevel.HIGH,
  function: "访问盗号服务",
  consequence: "账号被盗"
}, {
  page: {
    exclude: /^https?:\/\/edu\.codemao\.cn/
  },
  test: /https?:\/\/eduzone\.codemao\.cn\/edu\/zone\/sign\/login\/student\/info\/improve/,
  level: DangerLevel.HIGH,
  function: "完善学生信息",
  consequence: "账号被他人控制风险增加"
}, {
  page: {
    exclude: /^https?:\/\/edu\.codemao\.cn/
  },
  test: /https?:\/\/eduzone.codemao.cn\/edu\/zone\/invite\/student\/message\/next/,
  level: DangerLevel.HIGH,
  function: "获取加入班级邀请列表",
  consequence: "账号被他人控制风险增加"
}, {
  page: {
    exclude: /^https?:\/\/edu\.codemao\.cn/
  },
  test: /https?:\/\/eduzone.codemao.cn\/edu\/zone\/invite\/student\/message\/.*\/accept/,
  level: DangerLevel.HIGH,
  function: "加入班级",
  consequence: "账号被他人控制"
}, {
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/tokens\/convert/,
  level: DangerLevel.HIGH,
  function: "获取用户访问令牌",
  consequence: "账号被盗"
}, {
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/privacy/,
  level: DangerLevel.HIGH,
  function: "获取用户敏感信息",
  consequence: "隐私泄露；账号被控制"
}, {
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/username/,
  level: DangerLevel.HIGH,
  function: "设置用户名（用户名不是用户昵称）",
  consequence: "账号风险增加"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/password/,
  level: DangerLevel.HIGH,
  function: "通过旧密码验证更换账号密码",
  consequence: "账号被盗；账号密码泄露；账号密码被更改，失去账号访问权"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/captcha\/password\/update/,
  level: DangerLevel.HIGH,
  function: "发送更换账号密码的验证码",
  consequence: "账号被盗风险增加；账号密码被更改，失去账号访问权"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/password\/phone/,
  level: DangerLevel.HIGH,
  function: "通过验证码验证更换账号密码",
  consequence: "账号被盗；账号密码被更改，失去账号访问权"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/web\/users\/phone_number\/is_consistent/,
  level: DangerLevel.HIGH,
  function: "判断手机号是否为当前账号绑定的手机号",
  consequence: "账号绑定的手机号泄露，账号被盗风险增加"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/captcha\/phone\/change/,
  level: DangerLevel.HIGH,
  function: "发送更换手机号的验证码",
  consequence: "账号被盗风险增加；账号绑定的手机号被更换，失去账号访问权"
}, {
  page: {
    exclude: /^https?:\/\/shequ\.codemao\.cn\/setting$/
  },
  test: /https?:\/\/api\.codemao\.cn\/tiger\/v3\/web\/accounts\/phone\/change/,
  level: DangerLevel.HIGH,
  function: "通过验证码验证更换账号绑定的手机号",
  consequence: "账号被盗；账号绑定的手机号被更换，失去账号访问权"
}, {
  test: /https?:\/\/.*codemao.*\.pythonanywhere\.com/,
  level: DangerLevel.MEDIUM,
  function: "访问疑似盗号服务",
  consequence: "账号被盗"
}, {
  test: /https?:\/\/.*\.pythonanywhere\.com/,
  level: DangerLevel.MEDIUM,
  function: "访问 PythonAnyWhere 服务，PythonAnyWhere 常被用于提供盗号服务",
  consequence: "账号被盗"
}];
function start(theWindow = window) {
  if (theWindow.SLIGHTNING_ACCOUNT_PROTECT) {
    return;
  }
  theWindow.SLIGHTNING_ACCOUNT_PROTECT = true;
  const regExpTest = theWindow.Function.prototype.call.bind(theWindow.RegExp.prototype.test);
  const ID = Math.floor(Math.random() * 90000000) + 10000000;
  const name = `编程猫账号保护\$${ID}`;
  let styleLoaded = false;
  function loadStyle() {
    if (styleLoaded || document.body == null) {
      return;
    }
    theWindow.document.body.appendChild(/*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("style", {
      className: "codemao-account-protect--style-sheet"
    }, _style_index_css__WEBPACK_IMPORTED_MODULE_1__));
    styleLoaded = true;
  }
  loadStyle();
  document.addEventListener("DOMContentLoaded", loadStyle, {
    once: true
  });
  function showRejectHint(url) {
    theWindow.document.body.appendChild(/*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_UI_reject_hint__WEBPACK_IMPORTED_MODULE_2__.RejectHint, {
      title: name,
      url: url
    }));
  }
  function ask(url, rule) {
    return new Promise(resolve => {
      const element = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_UI_ask_dialog__WEBPACK_IMPORTED_MODULE_3__.AskDialog, {
        title: name,
        url: url,
        rule: rule,
        onResolve: resolve
      });
      theWindow.document.body.appendChild(element);
    });
  }
  const clearAccessTokenString = `access-token=0;path=/;domain=${location.hostname.endsWith(".codemao.cn") ? ".codemao.cn" : location.hostname};max-age=${30 * 24 * 60 * 60}`;
  theWindow.setInterval(() => {
    theWindow.document.cookie = clearAccessTokenString;
  }, 100);
  const interceptResponse = {
    code: 403,
    msg: `该操作已被${name}拦截`,
    data: null,
    domain: [],
    error_code: 403,
    error_message: `该操作已被${name}拦截`,
    log_uuid: `blocked-by-codemao-account-protect-script-\$${ID}-${Math.floor(Math.random() * 90000000) + 10000000}`
  };
  function onIntercept(url, go, reject, modify) {
    for (const rejectRule of rejectRules) {
      var _rejectRule$page, _rejectRule$page2;
      if ((((_rejectRule$page = rejectRule.page) === null || _rejectRule$page === void 0 ? void 0 : _rejectRule$page.test) == null || regExpTest(rejectRule.page.test, window.location.href)) && (((_rejectRule$page2 = rejectRule.page) === null || _rejectRule$page2 === void 0 ? void 0 : _rejectRule$page2.exclude) == null || !regExpTest(rejectRule.page.exclude, window.location.href)) && regExpTest(rejectRule.test, url)) {
        if (rejectRule.level == DangerLevel.HIGH) {
          reject();
          showRejectHint(url);
        } else if (rejectRule.level == DangerLevel.MEDIUM || rejectRule.level == DangerLevel.LOW) {
          ask(url, rejectRule).then(result => {
            if (result) {
              reject();
            } else {
              go();
            }
          });
        } else {
          throw new Error(`${name} 出错`);
        }
        return;
      }
    }
    if (regExpTest(/https?:\/\/api\.codemao\.cn\/web\/users\/details/, url)) {
      modify(function (response) {
        if (response.status == 200) {
          let data;
          try {
            data = JSON.parse(response.text);
          } catch (error) {
            return {};
          }
          Object.assign(data, {
            birthday: 0,
            phone_number: `已被${name}拦截`,
            qq: `已被${name}拦截`,
            real_name: `已被${name}拦截`,
            username: `已被${name}拦截`
          });
          data = JSON.stringify(data);
          return {
            text: data
          };
        } else {
          return {};
        }
      });
    } else if (regExpTest(/https?:\/\/api\.codemao\.cn\/api\/user\/info/, url)) {
      modify(function (response) {
        let data;
        try {
          data = JSON.parse(response.text);
        } catch (error) {
          return {};
        }
        if (data.code == 200) {
          Object.assign(data.data, {
            age: 0,
            username: `已被${name}拦截`,
            telephone: `已被${name}拦截`,
            qq: `已被${name}拦截`,
            email: `已被${name}拦截`,
            real_name: `已被${name}拦截`
          });
          return {
            text: JSON.stringify(response)
          };
        } else {
          return {};
        }
      });
    } else {
      go();
    }
  }
  ;
  (function () {
    let originalFetch = theWindow.fetch;
    theWindow.fetch = function (originalURL, options) {
      var _options$body;
      let url;
      let body;
      if (originalURL instanceof Request) {
        url = originalURL.url;
        body = originalURL.body;
      } else if (originalURL instanceof window.URL) {
        url = originalURL.href;
      } else {
        url = originalURL;
      }
      url = new URL(url, window.location.href).href;
      body = (_options$body = options === null || options === void 0 ? void 0 : options.body) !== null && _options$body !== void 0 ? _options$body : body;
      if (regExpTest(/^https?:\/\/(ccp\.cloudroo\.top|open\.lihouse\.xyz)\/omnia\/proxy$/, url)) {
        url = JSON.parse(String(body)).url;
      }
      return new Promise((resolve, reject) => {
        onIntercept(url, () => {
          originalFetch.call(this, originalURL, options).then(resolve).catch(reject);
        }, () => {
          var _options$method;
          console.error(new Error(`${name} 已拦截来自 fetch 的请求：${(_options$method = options === null || options === void 0 ? void 0 : options.method) !== null && _options$method !== void 0 ? _options$method : "GET"} ${url}`));
          resolve(new Response(JSON.stringify(interceptResponse), {
            status: 403,
            statusText: "403 Forbidden"
          }));
        }, callback => {
          let result = originalFetch.call(this, originalURL, options);
          result.then(response => {
            response.text().then(originalText => {
              let {
                status,
                text
              } = callback({
                status: response.status,
                text: originalText
              });
              let {
                statusText
              } = response;
              if (status == null) {
                status = response.status;
              } else {
                statusText = String(status);
              }
              if (text == null) {
                text = originalText;
              }
              resolve(new Response(text, {
                ...response,
                status,
                statusText
              }));
            }).catch(reject);
          }).catch(reject);
        });
      });
    };
    theWindow.fetch.toString = theWindow.Function.prototype.toString.bind(originalFetch);
  })();
  (function () {
    const openArgumentsSymbol = Symbol(`CodemaoProtect\$${ID}.openArguments`);
    const originalXMLHttpRequestSymbol = Symbol(`CodemaoProtect\$${ID}.originalXMLHttpRequest`);
    let originalGetOwnPropertySymbols = Object.getOwnPropertySymbols;
    Object.getOwnPropertySymbols = function getOwnPropertySymbols(object) {
      return originalGetOwnPropertySymbols(object).filter(item => item != openArgumentsSymbol && item != originalXMLHttpRequestSymbol);
    };
    let originalXMLHttpRequest = theWindow.XMLHttpRequest;
    let originalOpen = theWindow.XMLHttpRequest.prototype.open;
    let originalSend = theWindow.XMLHttpRequest.prototype.send;

    // @ts-ignore
    theWindow.XMLHttpRequest = function XMLHttpRequest() {
      let XHR = new originalXMLHttpRequest();
      for (let key in XHR) {
        if (key == "open" || key == "send") {
          continue;
        } else if (typeof XHR[key] == "function") {
          // @ts-ignore
          this[key] = XHR[key].bind(XHR);
        } else {
          Object.defineProperty(this, key, {
            get() {
              return XHR[key];
            },
            set(value) {
              // @ts-ignore
              XHR[key] = value;
            },
            configurable: true,
            enumerable: true
          });
        }
      }
      this[originalXMLHttpRequestSymbol] = XHR;
    };
    for (let key in originalXMLHttpRequest) {
      var _Object$getOwnPropert;
      Object.defineProperty(theWindow.XMLHttpRequest, key, (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(originalXMLHttpRequest, key)) !== null && _Object$getOwnPropert !== void 0 ? _Object$getOwnPropert : {});
    }
    theWindow.XMLHttpRequest.prototype = originalXMLHttpRequest.prototype;
    theWindow.XMLHttpRequest.prototype.constructor = theWindow.XMLHttpRequest;
    theWindow.XMLHttpRequest.prototype.open = function open(method, url, async, username, password) {
      var _async, _this$originalXMLHttp;
      if (url instanceof window.URL) {
        url = url.href;
      }
      (_async = async) !== null && _async !== void 0 ? _async : async = true;
      this[openArgumentsSymbol] = {
        method,
        url,
        async,
        username,
        password
      };
      originalOpen.call((_this$originalXMLHttp = this[originalXMLHttpRequestSymbol]) !== null && _this$originalXMLHttp !== void 0 ? _this$originalXMLHttp : this, method, url, async, username, password);
    };
    theWindow.XMLHttpRequest.prototype.send = function send(body) {
      var _this$openArgumentsSy, _this$openArgumentsSy2;
      let url = (_this$openArgumentsSy = (_this$openArgumentsSy2 = this[openArgumentsSymbol]) === null || _this$openArgumentsSy2 === void 0 ? void 0 : _this$openArgumentsSy2.url) !== null && _this$openArgumentsSy !== void 0 ? _this$openArgumentsSy : "";
      url = new URL(url, window.location.href).href;
      if (regExpTest(/^https?:\/\/(ccp\.cloudroo\.top|open\.lihouse\.xyz)\/omnia\/proxy$/, url)) {
        url = JSON.parse(String(body)).url;
      }
      const XHR = this;
      function reject() {
        var _XHR$openArgumentsSym, _XHR$openArgumentsSym2;
        console.error(new Error(`${name} 已拦截来自 XMLHttpRequest 的请求：${(_XHR$openArgumentsSym = (_XHR$openArgumentsSym2 = XHR[openArgumentsSymbol]) === null || _XHR$openArgumentsSym2 === void 0 ? void 0 : _XHR$openArgumentsSym2.method) !== null && _XHR$openArgumentsSym !== void 0 ? _XHR$openArgumentsSym : "UNKNOWN"} ${url}`));
        forgeResponse(XHR, {
          status: 403,
          statusText: "403 Forbidden",
          responseType: "json",
          response: JSON.stringify(interceptResponse),
          responseText: JSON.stringify(interceptResponse)
        });
      }
      onIntercept(url, () => {
        var _this$originalXMLHttp2;
        originalSend.call((_this$originalXMLHttp2 = this[originalXMLHttpRequestSymbol]) !== null && _this$originalXMLHttp2 !== void 0 ? _this$originalXMLHttp2 : this, body);
      }, () => {
        reject();
      }, callback => {
        modifyResponse(this, function (XHR) {
          let {
            status,
            text
          } = callback({
            status: XHR.status,
            text: XHR.responseText
          });
          let result = {};
          if (status != null) {
            result.states = status;
            result.statesText = String(status);
          }
          if (text != null) {
            result.response = text;
            result.responseText = text;
          }
          return result;
        });
      });
    };
    theWindow.XMLHttpRequest.toString = theWindow.Function.prototype.toString.bind(originalXMLHttpRequest);
    theWindow.XMLHttpRequest.prototype.open.toString = theWindow.Function.prototype.toString.bind(originalOpen);
    theWindow.XMLHttpRequest.prototype.send.toString = theWindow.Function.prototype.toString.bind(originalSend);
    function forgeResponse(XHR, response) {
      for (let key in response) {
        Object.defineProperty(XHR, key, {
          value: response[key]
        });
      }
      function dispatchEvent(eventType) {
        XHR.dispatchEvent(new Event(eventType));
      }
      dispatchEvent("loadstart");
      Object.defineProperty(XHR, "readyState", {
        value: XHR.DONE
      });
      dispatchEvent("readystatechange");
      if (XHR.status == 200) {
        dispatchEvent("load");
      } else {
        dispatchEvent("error");
      }
      dispatchEvent("loadend");
    }
    function modifyResponse(XHR, callback) {
      let originalXHR = new originalXMLHttpRequest();
      originalXHR.withCredentials = XHR.withCredentials;
      let openArguments = XHR[openArgumentsSymbol];
      if (openArguments != null) {
        originalOpen.call(originalXHR, openArguments.method, openArguments.url, openArguments.async, openArguments.username, openArguments.password);
      }
      originalXHR.onreadystatechange = function () {
        if (originalXHR.readyState == 4) {
          for (let key of ["status", "statusText", "responseType", "response", "responseText"]) {
            Object.defineProperty(XHR, key, {
              value: originalXHR[key]
            });
          }
          forgeResponse(XHR, callback(XHR));
        }
      };
      originalSend.call(originalXHR);
    }
  })();
  function setFrameCheck(element) {
    if (element instanceof theWindow.HTMLIFrameElement || element instanceof theWindow.HTMLFrameElement || element instanceof theWindow.HTMLObjectElement) {
      if (element.contentWindow != null) {
        start(element.contentWindow);
      }
      setInterval(() => {
        if (element.contentWindow != null) {
          try {
            start(element.contentWindow);
          } catch (ignore) {}
        }
      });
    }
  }
  ;
  (function () {
    for (const element of Array.from(theWindow.document.querySelectorAll("iframe, frame, object"))) {
      setFrameCheck(element);
    }
    const originalCreateElement = theWindow.document.createElement;
    theWindow.document.createElement = function createElement(tagName, options) {
      const element = originalCreateElement.call(theWindow.document, tagName, options);
      setFrameCheck(element);
      return element;
    };
    const originalAppendChild = theWindow.Node.prototype.appendChild;
    theWindow.Node.prototype.appendChild = function appendChild(node) {
      originalAppendChild.call(this, node);
      if (node instanceof theWindow.HTMLIFrameElement || node instanceof theWindow.HTMLFrameElement || node instanceof theWindow.HTMLObjectElement) {
        if (node.contentWindow != null) {
          start(node.contentWindow);
        }
      }
      return node;
    };
    const originalInsertBefore = theWindow.Node.prototype.insertBefore;
    theWindow.Node.prototype.insertBefore = function insertBefore(newNode, referenceNode) {
      originalInsertBefore.call(this, newNode, referenceNode);
      if (newNode instanceof theWindow.HTMLIFrameElement || newNode instanceof theWindow.HTMLFrameElement || newNode instanceof theWindow.HTMLObjectElement) {
        if (newNode.contentWindow != null) {
          start(newNode.contentWindow);
        }
      }
      return newNode;
    };
    const originalAppend = theWindow.Element.prototype.append;
    theWindow.Element.prototype.append = function append(...nodes) {
      originalAppend.call(this, ...nodes);
      for (const node of nodes) {
        if (node instanceof theWindow.HTMLIFrameElement || node instanceof theWindow.HTMLFrameElement || node instanceof theWindow.HTMLObjectElement) {
          if (node.contentWindow != null) {
            start(node.contentWindow);
          }
        }
      }
    };
  })();
}

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createElement = createElement;
function createElement(tagNameOrBuilder, attributes) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var element;
    if (typeof tagNameOrBuilder == "string") {
        element = document.createElement(tagNameOrBuilder);
        for (var key in attributes) {
            var value = attributes[key];
            switch (key) {
                case "style":
                    if (value != null && typeof value == "object") {
                        Object.assign(element.style, value);
                    }
                    break;
                case "ref":
                    if (typeof value == "function") {
                        value(element);
                    }
                    break;
                default:
                    if (key.startsWith("on")) {
                        key = key.toLowerCase().substring(2);
                        // @ts-ignore
                        element.addEventListener(key, value);
                    }
                    else {
                        // @ts-ignore
                        element[key] = value;
                    }
                    break;
            }
        }
        var append_1 = function (children) {
            var e_1, _a;
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var child = children_1_1.value;
                    if (typeof child == "string" ||
                        typeof child == "number" ||
                        typeof child == "boolean") {
                        element.append(String(child));
                    }
                    else if (child instanceof Node) {
                        element.append(child);
                    }
                    else {
                        append_1(child);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        append_1(children);
    }
    else {
        if ("prototype" in tagNameOrBuilder) {
            // @ts-ignore
            element = new tagNameOrBuilder(Object.assign({}, attributes, { children: children }));
        }
        else {
            // @ts-ignore
            element = tagNameOrBuilder(Object.assign({}, attributes, { children: children }));
        }
    }
    return element;
}
document.createElement("select").onchange;


/***/ }),
/* 3 */
/***/ (function(module) {

module.exports = ".codemao-account-protect--window--head {\r\n    color: white;\r\n    background-color: #C00000;\r\n    font-weight: bold;\r\n    display: flex;\r\n    justify-content: space-between;\r\n}\r\n.codemao-account-protect--window--head--title {\r\n    margin-top: 4px;\r\n    margin-bottom: 4px;\r\n    margin-left: 8px;\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n.codemao-account-protect--window--head--close-button {\r\n    width: 32px;\r\n    height: 32px;\r\n    font-size: 2rem;\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n            user-select: none;\r\n}\r\n.codemao-account-protect--window--head--close-button:hover {\r\n    background-color: rgba(0,0,0,0.12549);\r\n}\r\n.codemao-account-protect--window--head--close-button--text {\r\n    width: 32px;\r\n    height: 32px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.codemao-account-protect--slide-button--wrapper {\r\n    height: 32px;\r\n    margin-top: 4px;\r\n    margin-bottom: 4px;\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n}\r\n.codemao-account-protect--slide-button--track {\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0,0,0,0.12549);\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.codemao-account-protect--slide-button--slider {\r\n    width: 32px;\r\n    height: 32px;\r\n    font-size: 1.5rem;\r\n    background-color: white;\r\n    border: solid 1px black;\r\n    border-radius: 4px;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: flex-end;\r\n    justify-content: center;\r\n    transform: translateY(-100%);\r\n    cursor: move;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n            user-select: none;\r\n}\r\n.codemao-account-protect--reject-hint {\r\n    width: 320px;\r\n    height: 160px;\r\n    color: black;\r\n    background-color: white;\r\n    box-shadow: 0px 0px 8px rgba(128,128,128,0.50196);\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n    position: fixed;\r\n    right: -100%;\r\n    bottom: 32px;\r\n    z-index: 10000;\r\n    animation-name: codemao-account-protect--reject-hint--slide-in;\r\n    animation-duration: 1s;\r\n    animation-fill-mode: forwards;\r\n}\r\n@keyframes codemao-account-protect--reject-hint--slide-in {\r\n    from {\r\n        right: -100%;\r\n    }\r\n    to {\r\n        right: 32px;\r\n    }\r\n}\r\n.codemao-account-protect--reject-hint--content {\r\n    margin: 4px 8px;\r\n    word-break: break-all;\r\n}\r\n.codemao-account-protect--ask-dialog {\r\n    width: 320px;\r\n    color: black;\r\n    background-color: white;\r\n    box-shadow: 0px 0px 8px rgba(128,128,128,0.50196);\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n    position: fixed;\r\n    right: 32px;\r\n    bottom: 32px;\r\n    z-index: 10000;\r\n}\r\n.codemao-account-protect--ask-dialog--content {\r\n    margin: 4px 8px 8px;\r\n}\r\n.codemao-account-protect--ask-dialog--content>p {\r\n    margin-top: 8px;\r\n    margin-bottom: 8px;\r\n    word-break: break-all;\r\n}\r\n.codemao-account-protect--ask-dialog--content--button--wrapper {\r\n    height: 32px;\r\n    margin-top: 4px;\r\n    margin-bottom: 4px;\r\n    color: white;\r\n    background-color: #00A000;\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n}\r\n.codemao-account-protect--ask-dialog--content--button {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.codemao-account-protect--ask-dialog--content--button:hover {\r\n    background-color: rgba(0,0,0,0.12549);\r\n}\r\n";

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RejectHint: function() { return /* binding */ RejectHint; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _window_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


function RejectHint(props) {
  let element;
  setTimeout(() => {
    element.remove();
  }, 16000);
  return element = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--reject-hint"
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_window_head__WEBPACK_IMPORTED_MODULE_1__.WindowHead, {
    title: props.title,
    onClose: () => {
      element.remove();
    }
  }), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--reject-hint--content"
  }, "\u5DF2\u62E6\u622A\u8BF7\u6C42\uFF1A", props.url));
}

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WindowHead: function() { return /* binding */ WindowHead; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _close_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);


function WindowHead(props) {
  return /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--window--head"
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--window--head--title"
  }, props.title), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_close_button__WEBPACK_IMPORTED_MODULE_1__.CloseButton, {
    onClick: props.onClose
  }));
}

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CloseButton: function() { return /* binding */ CloseButton; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);

function CloseButton(props = {}) {
  return /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--window--head--close-button",
    onClick: props.onClick
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--window--head--close-button--text"
  }, "\xD7"));
}

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AskDialog: function() { return /* binding */ AskDialog; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _slide_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _window_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



function AskDialogOKButton(props) {
  return /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--ask-dialog--content--button--wrapper",
    onClick: props.onClick
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--ask-dialog--content--button"
  }, "\u62E6\u622A"));
}
function AskDialog(props) {
  let element, slideButtonExit;
  return element = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--ask-dialog"
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_window_head__WEBPACK_IMPORTED_MODULE_2__.WindowHead, {
    title: props.title,
    onClose: () => {
      element.remove();
      slideButtonExit();
      props.onResolve(true);
    }
  }), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--ask-dialog--content"
  }, /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u68C0\u6D4B\u5230\u654F\u611F\u8BF7\u6C42\uFF1A", props.url), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u5371\u9669\u7B49\u7EA7\uFF1A", props.rule.level.description), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u8BE5 API \u7684\u529F\u80FD\u4E3A\uFF1A", props.rule.function), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u8BE5 API \u5982\u679C\u88AB\u6076\u610F\u4F7F\u7528\uFF0C\u53EF\u80FD\u5BFC\u81F4", props.rule.consequence), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "\u662F\u5426\u62E6\u622A\u8BF7\u6C42\uFF1F"), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(AskDialogOKButton, {
    onClick: () => {
      element.remove();
      slideButtonExit();
      props.onResolve(true);
    }
  }), /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement(_slide_button__WEBPACK_IMPORTED_MODULE_1__.SlideButton, {
    onSlide: () => {
      element.remove();
      slideButtonExit();
      props.onResolve(false);
    },
    exit: exit => {
      slideButtonExit = exit;
    }
  }, "\u53D6\u6D88")));
}

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SlideButton: function() { return /* binding */ SlideButton; }
/* harmony export */ });
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__);

function SlideButton(props) {
  var _props$children;
  let root, track, slider;
  root = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--slide-button--wrapper"
  }, track = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--slide-button--track"
  }, (_props$children = props.children) !== null && _props$children !== void 0 ? _props$children : ""), slider = /*#__PURE__*/jsx_vanilla_dom__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "codemao-account-protect--slide-button--slider"
  }, "\u300B"));
  let mouseStartPosition = 0,
    sliderPosition = 0;
  function setSliderPosition(position) {
    if (position < 0) {
      position = 0;
    }
    if (position > track.offsetWidth - slider.offsetWidth) {
      position = track.offsetWidth - slider.offsetWidth;
    }
    sliderPosition = position;
    slider.style.transform = `translate(${position}px, -100%)`;
  }
  function getPosition(event) {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      var _event$touches$0$clie, _event$touches$;
      return (_event$touches$0$clie = (_event$touches$ = event.touches[0]) === null || _event$touches$ === void 0 ? void 0 : _event$touches$.clientX) !== null && _event$touches$0$clie !== void 0 ? _event$touches$0$clie : 0;
    }
  }
  function mouseDown(event) {
    mouseStartPosition = getPosition(event);
  }
  function mouseMove(event) {
    if (mouseStartPosition == 0) {
      return;
    }
    setSliderPosition(getPosition(event) - mouseStartPosition);
  }
  function mouseUp(__event) {
    mouseStartPosition = 0;
    if (sliderPosition == track.offsetWidth - slider.offsetWidth) {
      props.onSlide();
    } else {
      setSliderPosition(0);
    }
  }
  slider.addEventListener("mousedown", mouseDown);
  slider.addEventListener("touchstart", mouseDown);
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("touchmove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
  document.addEventListener("mouseleave", mouseUp);
  document.addEventListener("touchend", mouseUp);
  document.addEventListener("touchcancel", mouseUp);
  props.exit(() => {
    slider.removeEventListener("mousedown", mouseDown);
    slider.removeEventListener("touchstart", mouseDown);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("touchmove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("mouseleave", mouseUp);
    document.removeEventListener("touchend", mouseUp);
    document.removeEventListener("touchcancel", mouseUp);
  });
  return root;
}

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _codemao_account_protect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

(0,_codemao_account_protect__WEBPACK_IMPORTED_MODULE_0__.start)();
/******/ })()
;