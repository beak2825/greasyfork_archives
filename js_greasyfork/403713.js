// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"EYOV":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;

function debounce(fn, wait) {
  var timeout = null;
  return function (...arg) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...arg);
    }, wait);
  };
}
},{}],"C9JJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AllStoreName = exports.isDev = void 0;

/** 是不是开发环境 */
const isDev = false;
exports.isDev = isDev;
const config = {
  state: 0,

  /** 是否开启编辑 */
  //是开发环境自动开启
  elementEdit: isDev,

  /** 服务器地址 */
  serverIp: 'https://shenzilong.cn/note/',

  /** 页面的url */
  locationUrl: decodeURIComponent(location.origin + location.pathname),

  /** 存储登录凭证的 */
  loginCredentials: 'loginCredentials'
};
/** 存储命令栈的地方 */

const AllStoreName = '_storeName_llej_' + config.locationUrl;
exports.AllStoreName = AllStoreName;
var _default = config;
exports.default = _default;
},{}],"BHXf":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyTitle = copyTitle;
exports.getSelectors = getSelectors;
exports.getIndex = getIndex;
exports.nodePath = nodePath;
exports.getJSon = getJSon;
exports.ajax_get = ajax_get;
exports.log = log;
exports.default = void 0;

var _config = require("./config");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/** 用于复制文本的input   */
const input_copy = document.createElement("textarea");
input_copy.id = "__";
input_copy.style.display = "none"; //不能设置为none因为会导致没有可访问性

input_copy.setAttribute("style", `
        position: absolute;
        top: -9999px;
        left: -9999px;`);
document.body.appendChild(input_copy);
/** 复制一个元素的titil 或者一段字符串到剪贴板 */

function copyTitle(el) {
  let title;
  if (typeof el === "string") title = el;else title = el.getAttribute("title");
  input_copy.setAttribute("readonly", "readonly");
  input_copy.setAttribute("value", title);
  input_copy.value = title;
  input_copy.select();
  input_copy.setSelectionRange(0, 9999);
  document.execCommand("copy");
}
/** 工具类 */


var _default = {
  copyTitle
};
/** 获取一个元素的选择器 */

exports.default = _default;

function getSelectors(el) {
  /** 通过path路径来确定元素 */
  let pathSelectors = nodePath(el).reverse().map(el => {
    return el.nodeName + `:nth-child(${getIndex(el)})`;
  }).join(">");
  /** 通过id以及class来确定元素 */

  let id_className = "";
  const id = el.id;
  if (id) id_className += `#${id}`;
  el.classList.forEach(className => {
    id_className += `.${className}`;
  });
  /** nth-child 选择 看它是第几个元素 */

  const index = getIndex(el);
  /** 最终构造出来的选择器 */

  return `${pathSelectors}${id_className}:nth-child(${index})`;
}
/** 获取元素它在第几位 */


function getIndex(el) {
  if (el.nodeName === "HTML") return 1;
  return 1 + Array.from(el.parentElement.children).findIndex(child => child === el);
}
/** 获取一个元素的所有父节点到html为止  */


function nodePath(...path) {
  while (path[path.length - 1].parentElement != null) {
    path.push(path[path.length - 1].parentElement);
  }
  /** 只需要是HTMLElement的 */


  const HTMLElementPath = path.filter(el => el instanceof HTMLElement);
  return HTMLElementPath;
}

function getJSon(url, data) {
  return __awaiter(this, void 0, void 0, function* () {
    const str = yield ajax_get(url, data);
    const res = JSON.parse(str);
    console.log(url, data, res);
    return res;
  });
}
/** 油猴的ajaxget */


function ajax_get(url, data) {
  if (data) url += "?" + jsonToURLpar(data);
  if (window.hasOwnProperty("GM") && window.hasOwnProperty("GM")) return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url,
      onload: function (response) {
        resolve(response.responseText);
      },
      onerror: reject
    });
  });else return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
      resolve(xhr.responseText);
    });
    xhr.addEventListener("error", reject);
    xhr.open("get", url);
    xhr.send();
  });
}
/** json 转 urlpar 只能转一层 */


function jsonToURLpar(json) {
  return Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
  }).join("&");
}
/** 开发时的调试log */


function log(...arg) {
  if (_config.isDev) console.log(`[dev] `, ...arg);
}
},{"./config":"C9JJ"}],"ZBYP":[function(require,module,exports) {
"use strict";

var _ = require("../util/fun/\u9632\u6296");

var _util = require("../\u7F51\u9875\u7B14\u8BB0/util");

// ==UserScript==
// @name         去除顶部遮挡
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  我算法不太行可能通用性不行，自测(简书，google,知乎)没问题
// @author       崮生 2234839456@qq.com
// @match        *
// @include      *
// @grant        unsafeWindow
// @connect      shenzilong.cn
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

// @downloadURL https://update.greasyfork.org/scripts/403713/%E5%8E%BB%E9%99%A4%E9%A1%B6%E9%83%A8%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/403713/%E5%8E%BB%E9%99%A4%E9%A1%B6%E9%83%A8%E9%81%AE%E6%8C%A1.meta.js
// ==/UserScript==
(function () {
  return __awaiter(this, void 0, void 0, function* () {
    const uw = window.unsafeWindow ? window.unsafeWindow : window;
    const style = document.createElement("style");
    const className = "llej_hide";
    style.innerHTML = `
  .${className}{
    opacity:0
  }
  `;
    document.body.appendChild(style);
    window.addEventListener("scroll", (0, _.debounce)(event => {
      if (document.documentElement.scrollTop < 100) {
        /** 还原 */
        // console.log("小于100", document.querySelectorAll("." + className));
        return Array.from(document.querySelectorAll("." + className)).forEach(el => el.classList.remove(className));
      }

      if (document.querySelectorAll("." + className).length) {
        /** 已存在疑似者，不在捕获 */
        return;
      }

      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      const top_el = document.elementFromPoint(x, 30);
      const center_el = document.elementFromPoint(x, y); // console.log(top_el, center_el);

      const top_selector = (0, _util.getSelectors)(top_el);
      const center_selector = (0, _util.getSelectors)(center_el);
      const min_length = top_selector.length < center_selector.length ? top_selector.length : center_selector.length;
      /** 获取最顶上的和主体不一致的元素的和主体同一级的祖先元素 */

      let top_parent_selector;

      for (let i = 0; i < min_length; i++) {
        if (top_selector[i] !== center_selector[i]) {
          top_parent_selector = top_selector.slice(0, i) + top_selector.slice(i).replace(/(.*?)>.*/, "$1");
          break;
        }
      }

      const top_parent = document.querySelector(top_parent_selector);

      if (isHeader(top_parent)) {
        top_parent.classList.add(className); // console.log(top_parent_selector, center_selector);
      }
    }, 100));
  });
})();

function isHeader(el) {
  const rect = el.getBoundingClientRect(); // console.log("疑似者", {
  //   "rect.bottom ": rect.bottom,
  //   "rect.top ": rect.top,
  // });

  if (
  /** 高过一百px不再可能是了吧 */
  rect.bottom > 100) {
    return false;
  }

  return true;
}
},{"../util/fun/防抖":"EYOV","../网页笔记/util":"BHXf"}]},{},["ZBYP"], null)