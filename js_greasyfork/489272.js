// ==UserScript==
// @name         懒盘
// @namespace    https://www.lzpan.com/v3
// @version			1.0.0
// @description    自动填写网盘密码并提交，支持百度 蓝奏 天翼云 123网盘 阿里云盘 夸克网盘。去除脚本共享  vip视频 优惠券 比价
// @include			*://*/*
// @exclude			*://*.lanzou*.com/*
// @author			YOU
// @note 			2023-07-31 添加 123网盘 阿里云盘 夸克网盘 支持 去除脚本共享  vip视频 优惠券 比价
// @grant           unsafeWindow
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_log
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @license MIT
// @connect      *
// @require			http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require			https://cdn.jsdelivr.net/npm/js-base64@3.2.4/base64.min.js
// @icon     data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/489272/%E6%87%92%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/489272/%E6%87%92%E7%9B%98.meta.js
// ==/UserScript==

/******/ (function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Flag the module as loaded
    /******/ module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/ __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/ __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/ __webpack_require__.r = function (exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module",
      });
      /******/
    }
    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/ __webpack_require__.t = function (value, mode) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value,
    });
    /******/ if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/ __webpack_require__.p = "";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/ return __webpack_require__((__webpack_require__.s = 1));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function (module, exports, __webpack_require__) {
      // Imports
      var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(2);
      exports = ___CSS_LOADER_API_IMPORT___(false);
      // Module
      exports.push([
        module.i,
        ".kuan-left-bar{position:fixed;top:50%;transform:translateY(-50%);left:1rem;width:28px !important;text-align:center;font-size:16px !important;z-index:99999}.kuan-left-bar .kuan-link{max-width:100%;padding:4px 5px;border-radius:3px;text-decoration:none;margin-top:0.4rem;display:inline-block;background:#e74c3c;color:white !important;border:1px solid #e74c3c}.kuan-left-bar .kuan-link:hover{transition:all 0.2s;background:#c0392b}.kuan-left-bar .kuan-link.history{background:#2ecc71;border:1px solid #2ecc71}.kuan-left-bar .kuan-link.history:hover{background:#27ae60;border:1px solid #27ae60}.kuan-left-bar .kuan-link.kuan-coupon{background:#9b59b6;border:1px solid #9b59b6}.kuan-left-bar .kuan-link.kuan-coupon:hover{background:#8e44ad;border:1px solid #8e44ad}.kuan-left-bar .kuan-link.kuan-vip{background:#3498db;border:1px solid #3498db}.kuan-left-bar .kuan-link.kuan-vip:hover{border:1px solid #2980b9;background:#2980b9}.kuan-left-bar .kuan-link.bd{background:#09aaff;border:1px solid #09aaff}.kuan-left-bar .kuan-link.bd:hover{border:1px solid #0098ea;background:#0098ea}.kuan-left-bar .kuan-link.setting{background:#9b59b6;border:1px solid #9b59b6}.kuan-left-bar .kuan-link.setting:hover{border:1px solid #8e44ad;background:#8e44ad}.active-link{color:#e84393;text-decoration:none !important;border:1px solid}.kuan-wrapper{z-index:999999;width:100%;height:100%;position:fixed;top:0;left:0;bottom:0;background-color:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:center;box-shadow:0 0.5rem 1rem rgba(0,0,0,0.15) !important}.kuan-wrapper .card{width:500px;padding:10px 10px 20px 10px;background-color:#fff;border-radius:5px;margin-top:-300px}.kuan-wrapper .card .heading{user-select:none;font-size:19px;font-weight:bold;border-bottom:1px solid #ddd;padding-bottom:4px}.kuan-wrapper .card .heading .close{user-select:none;float:right;font-size:26px;cursor:pointer;padding-right:10px}.kuan-wrapper .card .heading .close:hover{color:#e74c3c}.kuan-wrapper .card .body{padding:10px}.kuan-wrapper .card .body p{line-height:40px}.kuan-links-wrapper{position:fixed;box-shadow:0 0.5rem 1rem rgba(0,0,0,0.15) !important;top:150px;right:20px;border:1px solid #ddd;width:300px;z-index:99999;background-color:#fff;clear:both}.kuan-links-wrapper .kuan-title{user-select:none;cursor:pointer;font-size:18px;font-weight:bold;color:#3498db;height:20px;line-height:20px;border-bottom:1px solid #ddd;padding:7px 12px}.kuan-links-wrapper .kuan-title.fold{border-bottom:none}.kuan-links-wrapper .kuan-title .kuan-notice{font-size:13px;color:#aaa}.kuan-links-wrapper .kuan-title .kuan-close{float:right;font-size:30px}.kuan-links-wrapper .kuan-title .kuan-close:hover{color:red}.kuan-links-wrapper .kuan-links{width:100%;max-height:400px;overflow-y:auto;box-sizing:border-box;padding:10px 0 10px 3px}.kuan-links-wrapper .kuan-links.fold{height:0;padding:0}.kuan-links-wrapper .kuan-links:hover::-webkit-scrollbar{width:5px}.kuan-links-wrapper .kuan-links::-webkit-scrollbar{width:0;height:0}.kuan-links-wrapper .kuan-links::-webkit-scrollbar-thumb{background-color:#95a5a6}.kuan-links-wrapper .kuan-links::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:#dddddd}.kuan-links-wrapper .kuan-links .item{border-bottom:1px solid #ddd;padding:5px;white-space:wrap;word-break:break-all;font-size:14px}.kuan-links-wrapper .kuan-links .item:last-child{border-bottom:none}.kuan-links-wrapper .kuan-links .item em{color:#666666;margin-right:0.2rem;font-style:normal}.kuan-links-wrapper .kuan-links .item a.kuan-link{color:#2980b9;text-decoration:none}.kuan-links-wrapper .kuan-links .item a.kuan-link:hover{text-decoration:underline}.kuan-links-wrapper .kuan-links .item .pwd{color:green;margin-left:1rem}\n",
        "",
      ]);
      // Exports
      module.exports = exports;

      /***/
    },
    /* 1 */
    /***/ function (module, exports, __webpack_require__) {
      __webpack_require__(3);

      /***/
    },
    /* 2 */
    /***/ function (module, exports, __webpack_require__) {
      "use strict";

      /*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
      // css base code, injected by the css-loader
      // eslint-disable-next-line func-names
      module.exports = function (useSourceMap) {
        var list = []; // return the list of modules as css string

        list.toString = function toString() {
          return this.map(function (item) {
            var content = cssWithMappingToString(item, useSourceMap);

            if (item[2]) {
              return "@media ".concat(item[2], " {").concat(content, "}");
            }

            return content;
          }).join("");
        }; // import a list of modules into the list
        // eslint-disable-next-line func-names

        list.i = function (modules, mediaQuery, dedupe) {
          if (typeof modules === "string") {
            // eslint-disable-next-line no-param-reassign
            modules = [[null, modules, ""]];
          }

          var alreadyImportedModules = {};

          if (dedupe) {
            for (var i = 0; i < this.length; i++) {
              // eslint-disable-next-line prefer-destructuring
              var id = this[i][0];

              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }

          for (var _i = 0; _i < modules.length; _i++) {
            var item = [].concat(modules[_i]);

            if (dedupe && alreadyImportedModules[item[0]]) {
              // eslint-disable-next-line no-continue
              continue;
            }

            if (mediaQuery) {
              if (!item[2]) {
                item[2] = mediaQuery;
              } else {
                item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
              }
            }

            list.push(item);
          }
        };

        return list;
      };

      function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || ""; // eslint-disable-next-line prefer-destructuring

        var cssMapping = item[3];

        if (!cssMapping) {
          return content;
        }

        if (useSourceMap && typeof btoa === "function") {
          var sourceMapping = toComment(cssMapping);
          var sourceURLs = cssMapping.sources.map(function (source) {
            return "/*# sourceURL="
              .concat(cssMapping.sourceRoot || "")
              .concat(source, " */");
          });
          return [content]
            .concat(sourceURLs)
            .concat([sourceMapping])
            .join("\n");
        }

        return [content].join("\n");
      } // Adapted from convert-source-map (MIT)

      function toComment(sourceMap) {
        // eslint-disable-next-line no-undef
        var base64 = btoa(
          unescape(encodeURIComponent(JSON.stringify(sourceMap)))
        );
        var data =
          "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
            base64
          );
        return "/*# ".concat(data, " */");
      }

      /***/
    },
    /* 3 */
    /***/ function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      // ESM COMPAT FLAG
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./src/config.js
      var TMALL_TITLE_SELECTTOR =
        "#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1 > a";
      var TAOBAO_TITLE_SELECTTOR = [
        "#J_Title > h3",
        "#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-detail-hd > h1",
      ];
      var API_DISK_URL = "https://api2.lzpan.com/disk/v1";
      var KEY_LINKS_DIALOG = "_setting_link_dialog_";
      var NOTICE_TEXT_CLOSE_LINK_DIALOG =
        "已经关闭啦，再次开启请到脚本支持的网盘页面左侧的设置按钮中开启！";
      var DISK_INFO_START_WITH = "懒盘:";
      var BUTTON_TEXT_SETTING = "设置";
      var BUTTON_TEXT_VIP_VIDEO = "跳转解析平台";
      var BUTTON_TEXT_PARSE_BAIDU = "解析高速链接";
      var TYY_PRIVATE_TEXT = "私密分享";
      var SYS_ERROR_NOTICE = "抱歉，系统错误，获取密码失败";
      var QUERY_SUCCESS_NOTICE = "查询密码成功！";
      var PLEASE_INPUT_NOTICE = "查询密码失败，请手动输入！";
      // var ACTIVE_LINK_REG = [
      //   //激活页面链接的正则表达式
      //   /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/s[hare]*\/[int?surl=]*[\w-_]{5,25})/gi,
      //   /((?:https?:\/\/)?(?:\w+\.)?lanzou.?.com\/[\w\-_]{6,13})/gi,
      //   /((?:https?:\/\/)?cloud\.?189?.cn\/t\/[\w\-_]+)/gi,
      //   /((?:https?:\/\/)?(?:\w+\.)?123pan?.com\/s\/[\w\-_]+)/gi,
      //   /((?:https?:\/\/)?(?:\w+\.)?(aliyundrive|alipan)?.com\/s\/[\w\-_]+)/gi,
      //   /((?:https?:\/\/)?(?:yun|pan|eyun).quark.cn\/s\/[\w\-_]+)/gi,
      //   /pan.baidu.com\/s\/[\w-_]{5,25}\?pwd=[a-zA-z0-9]{3,10}/gi,
      // ];
      var LINKIFY_REG = [
        // /(https?:\/\/)?((?:\w+\.)?lanzou.?\.com\/(?:[a-z\d]+))(?:.*?码.*?([a-z\d]+))?/gi,
        // /(https?:\/\/)?(cloud\.189?\.cn\/t\/(?:[a-z\d]+))(?:.*?码.*?([a-z\d]+))?/gi,
        // /(https?:\/\/)?((?:pan|e?yun)\.baidu\.com\/s\/(?:[a-z\d\-_]+)(?:#[a-z\d-_]*)?)(?:.*?码.*?([a-z\d]+))?/gi,
        // /(https?:\/\/)?((?:\w+\.)?123pan.?\.com\/s\/(?:[\w-]+)\.html)(?:.*?码.*?([a-z\d]+))?/gi,
        // /(https?:\/\/)?((?:\w+\.)?(aliyundrive|alipan)\.com\/s\/(?:[\w]+))(?:.*?码.*?([a-z\d]+))?/gi,
        // /(https?:\/\/)?((?:\w+\.)?quark\.cn\/s\/(?:[\w]+))(?:.*?码.*?([a-z\d]+))?/gi,
      ];
      var INVALIDATE_LINK_REG = [
        /(被取消了|分享文件已过期|已经被删除|分享内容可能因为|啊哦，你来晚了|取消分享了|外链不存在)/gi,
      ];
      // dmlx 42023-08-01 此处添加页面悬浮的链接和密码
      var PARSE_PWD_REG = [
        /(https?:\/\/(?:pan|yun|eyun)\.baidu\.com\/s[hare]*\/[int?surl=]*[\w-_]{8,25})[&\w=]*[^\w]*(?:密码|授权码|提取码)[：:]*[^\w]*([\w]{4})*/gim,
        /(https?:\/\/(?:\w+)?\.?lanzou.?\.com\/[\w-_]{6,13})\/?[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{3,})*/gim,
        /(https?:\/\/cloud.189.cn\/t\/[\w\-_]+)\/?[^\w]*[(（:：]*([\w]+)*[)）]*/gim,
        /(https?:\/\/(?:\w+)?\.?123pan\.com\/s\/(?:[\w-]{6,13})\.html)(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4})/gim,
        /(https?:\/\/(?:\w+)?\.?(aliyundrive|alipan)\.com\/s\/[\w-_]{6,13})\/?[&\w=]*[^\w]*(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4,})*/gim,
        /(https?:\/\/(?:\w+)?\.?quark\.cn\/s\/[\w-_]{6,25})\/?[&\w=]*[^\w]*(?:密码|授权码|提取码)+[：:]*[^\w]*([\w]{4,})*/gim,
        /(https?:\/\/(?:pan|yun|eyun)\.baidu\.com\/s\/[\w-_]{5,25}\?pwd=[a-zA-z0-9]{3,10})/gim,
        /(https?:\/\/t.wss.ink\/f\/[\w]{5,15})/gim,
        // https://cowtransfer.com/s/fcccf290f15c46
        /(https?:\/\/cowtransfer.com\/s\/[\w]{5,15})/gim,
        /(https?:\/\/cloud.189.cn\/web\/share\?code\=[a-zA-Z0-9]*)(?:密码|授权码|提取码)*[：:]*[^\w]*([\w]{4,})/gim,
      ];
      var BAIDU_ELEMENT = {
        input: "form input",
        notice: ".verify-form > div",
        click: "#submitBtn",
      };
      var TY_ELEMENT = {
        input: "#code_txt",
        notice:
          "#__qiankun_microapp_wrapper_for_micro_home_share__ > div > div.get-file-container > div.file-info.get-file-box > div.code-panel > div.title",
        click:
          "#__qiankun_microapp_wrapper_for_micro_home_share__ > div > div.get-file-container > div.file-info.get-file-box > div.code-panel > div.access-code-item.clearfix > a",
      };
      var _123PAN_ELEMENT = {
        input: ".ant-input",
        notice:
          "body > div.content > div.error-content > div > div.file-info.get-file-box > div.code-panel > div.error-tips.visit_error",
        click:
          "#app > div > div > div.webbody > div:nth-child(2) > div > div.card > div.ca-fot > button",
      };
      var ALY_ELEMENT = {
        input: ".ant-input",
        notice:
          "body > div.content > div.error-content > div > div.file-info.get-file-box > div.code-panel > div.error-tips.visit_error",
        click: "#root > div > div.container--Gg24j > form > button",
      };
      var QRK_ELEMENT = {
        input: ".ant-input.ShareReceivePC--input--1p01p8f",
        notice:
          "body > div.content > div.error-content > div > div.file-info.get-file-box > div.code-panel > div.error-tips.visit_error",
        click: ".ant-btn.ShareReceivePC--submit-btn--1tyQVhs.ant-btn-primary",
      };
      var LZ_PWD_EXITS_ELEMENT = ["#pwdload", "#passwddiv"];
      var LZ_ELEMENT = [
        {
          //type1
          input: "input#pwd",
          notice: "#pwderr",
          click: "input#sub",
        },
        {
          //type2
          input: "input#pwd",
          notice: "#info",
          click: "#passwddiv > div > div.passwddiv-input > div",
        },
      ];
      // EXTERNAL MODULE: ./src/styles/styles.scss
      var styles = __webpack_require__(0);
      var styles_default = /*#__PURE__*/ __webpack_require__.n(styles);

      // CONCATENATED MODULE: ./src/util.js
      function parseItemId(url) {
        var res = /id=(\d+)&?/gi.exec(url);
        if (res && res.length >= 2) return res[1];
        else return null;
      }
      function jumpUrl(url) {
        var w = window.open(url, "_blank");

        if (!w) {
          window.location.href = url;
        }
      }
      function uniqueArr(arr) {
        var hash = [];

        for (var i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i]);
          }
        }

        return [].concat(hash);
      }
      // CONCATENATED MODULE: ./src/func.js
      function _toConsumableArray(arr) {
        return (
          _arrayWithoutHoles(arr) ||
          _iterableToArray(arr) ||
          _unsupportedIterableToArray(arr) ||
          _nonIterableSpread()
        );
      }

      function _nonIterableSpread() {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      }

      function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
          return Array.from(iter);
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
      }

      function _slicedToArray(arr, i) {
        return (
          _arrayWithHoles(arr) ||
          _iterableToArrayLimit(arr, i) ||
          _unsupportedIterableToArray(arr, i) ||
          _nonIterableRest()
        );
      }

      function _nonIterableRest() {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (
          n === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return _arrayLikeToArray(o, minLen);
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }

      function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
          for (
            var _i = arr[Symbol.iterator](), _s;
            !(_n = (_s = _i.next()).done);
            _n = true
          ) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }

      function selector(dom) {
        return document.querySelector(dom);
      } // 导出样式

      function exportStyle() {
        var styleDom = document.createElement("style");
        styleDom.textContent = styles_default.a;
        document.head.appendChild(styleDom);
      } // 添加左侧根节点

      function appendLeftBarDom() {
        var leftBar = selector(".kuan-left-bar");
        if (leftBar) return leftBar;
        var divDom = document.createElement("div");
        divDom.classList.add("kuan-left-bar");
        document.body.appendChild(divDom);
        return divDom;
      } // 添加设置按钮

      function appendSettingDom() {
        let v_dom = document.querySelector(".kuan-wrapper");
        if (!!v_dom) {
          return;
        }
        var aDom = document.createElement("a");
        aDom.innerText = BUTTON_TEXT_SETTING;
        aDom.setAttribute("href", "#");
        aDom.classList.add("kuan-link");
        aDom.classList.add("setting");
        var leftDivDom = appendLeftBarDom();
        leftDivDom.appendChild(aDom); // dialog

        var t_dialogDom =
          '\n    <div class="kuan-wrapper">\n        <div class="card">\n            <div class="heading">\u61D2\u76D8\u811A\u672C\u8BBE\u7F6E <span class="close">&times;</span></div>\n                <div class="body">\n                    <p>1\u3001\u6E05\u7A7A\u7F13\u5B58 \uFF08\u6E05\u7A7A\u4E4B\u524D\u7F13\u5B58\u7684\u63D0\u53D6\u7801\u7B49\u4FE1\u606F\uFF09[\u7F13\u5B58\uFF1A<span class="cache-count"></span> ] <button class="clear-cache">\u6E05\u7A7A</button></p>\n                    <p>2\u3001\u67E5\u627E\u7F13\u5B58[\u7F13\u5B58\u7684\u63D0\u53D6\u7801] <input type="text" class="key" placeholder="\u8F93\u5165\u7F51\u76D8\u94FE\u63A5"> <button\n                        class="find">\u67E5\u627E</button></p>\n                    <p>3\u3001\u5F00\u542F\u9875\u9762\u7F51\u76D8\u94FE\u63A5\u5C55\u793A\u6846\uFF1A<button class="btn_link">\u5F00\u542F/\u5173\u95ED</button>\uFF0C\u5F53\u524D\u72B6\u6001\uFF1A<span class="link_status"></span></p>\n                </div>\n        </div>\n    </div>';
        var dialogDom = parseDom(t_dialogDom);
        document.body.appendChild(dialogDom);
        var lists = getVlues(); // console.log(lists);

        var oWrapper = dialogDom; // let oWrapper = document.querySelector('.kuan-wrapper');

        var oCacheCount = oWrapper.querySelector(".kuan-wrapper .cache-count");
        var oClose = oWrapper.querySelector(".kuan-wrapper .close");
        var oClearCache = oWrapper.querySelector(".kuan-wrapper .clear-cache");
        var oInputKey = oWrapper.querySelector(".kuan-wrapper .key");
        var oFind = oWrapper.querySelector(".kuan-wrapper .find");
        var oSpanLinkStatus = oWrapper.querySelector(
          ".kuan-wrapper .link_status"
        );
        var oBtnLink = oWrapper.querySelector(".kuan-wrapper .btn_link"); //页面链接展示控制
        // console.log(oClose);

        oCacheCount.innerText = lists.length; // 展示页面链接按钮

        oSpanLinkStatus.innerText =
          getValue(KEY_LINKS_DIALOG, "true") === "true" ? "开启" : "关闭";
        oBtnLink.addEventListener("click", function () {
          var st = getValue(KEY_LINKS_DIALOG, "true");
          var newSt = st === "true" ? "false" : "true";
          oSpanLinkStatus.innerText = newSt === "true" ? "开启" : "关闭";
          setValue(KEY_LINKS_DIALOG, newSt);
        });
        oFind.addEventListener("click", function () {
          if (oInputKey.value === "" || !oInputKey.value) {
            alert("请输入网盘链接");
            return;
          }

          var _getDiskIdAndType = getDiskIdAndType(oInputKey.value),
            _getDiskIdAndType2 = _slicedToArray(_getDiskIdAndType, 2),
            disk_type = _getDiskIdAndType2[0],
            disk_id = _getDiskIdAndType2[1];

          if (!disk_type || !disk_id) {
            alert("请输入准确的网盘链接");
            return;
          }

          var val = getPwdValue(disk_type, disk_id);

          if (!val) {
            alert("抱歉，未在缓存中找到提取码");
            return;
          }

          oInputKey.value = "找到的提取码：" + val;
        });
        aDom.addEventListener("click", function () {
          oWrapper.style.display = "flex";
        });
        oClose.addEventListener("click", function () {
          oWrapper.style.display = "none";
        });
        oClearCache.addEventListener("click", function () {
          lists.forEach(function (item) {
            if (item.indexOf("setting") === -1) delValue(item);
          });
          oCacheCount.innerText = getValues().length;
        });
      }

      function parseDom(arg) {
        var objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.firstElementChild;
      } // 添加页面链接汇总dom

      function appendLinksDom(linksArr) {
        console.log(linksArr);
        if (linksArr.length <= 0) return; // 没有东西，就不要创建了

        var open = getValue(KEY_LINKS_DIALOG, "true");
        if (open !== "true") return;
        var dom =
          '\n    <div class="kuan-links-wrapper">\n        <div class="kuan-title">\n            <span>\u9875\u9762\u94FE\u63A5</span>\n            <span class="kuan-notice">\uFF08\u62D6\u62FD\u79FB\u52A8\uFF0C\u70B9\u51FB\u5C55\u5F00\u6298\u53E0\uFF09</span>\n            <span class="kuan-close">&times;</span>\n        </div>\n        <div class="kuan-links">\n            \n        </div>\n    </div>';
        var linksDom = parseDom(dom);
        var oTitle = linksDom.querySelector(".kuan-title");
        var oLinks = linksDom.querySelector(".kuan-links");
        var oClose = linksDom.querySelector(".kuan-close");
        var oWrapper = linksDom; // console.log(oTitle, oLinks, oWrapper);

        if (!document.querySelector(".kuan-links-wrapper")) {
          document.body.appendChild(oWrapper);
        }

        oLinks.innerHTML = ""; //先清空呀

        linksArr.forEach(function (item, i) {
          // console.log(i);
          var link = item.link,
            pwd = item.pwd;

          if (link !== undefined && link !== "undefined") {
            var linkDom = '<div class="item"><em>['
              .concat(i + 1, ']</em><a class="kuan-link" href="')
              .concat(link, '" target="_blank">')
              .concat(link, '</a><span class="pwd">')
              .concat(pwd, "</span></div>");
            oLinks.appendChild(parseDom(linkDom));
          }
        }); // 折叠展开

        oTitle.addEventListener("click", clickFun);
        var x = 0,
          y = 0,
          l = 0,
          t = 0;
        var key = false; //设置了一个标志 false为点击事件 ture为鼠标移动事件

        var firstTime = 0;
        var lastTime = 0;
        oTitle.addEventListener("mousedown", function (e) {
          firstTime = new Date().getTime();
          x = e.clientX;
          y = e.clientY; //获取左部和顶部的偏移量

          l = oWrapper.offsetLeft;
          t = oWrapper.offsetTop; //开关打开
          // console.log('x', x, 'y', y);
          // console.log(l, t);
          // console.log('mouseDown');

          oTitle.style.cursor = "move";
          window.addEventListener("mousemove", moveFunc);
        });
        oTitle.addEventListener("mouseup", function () {
          lastTime = new Date().getTime();

          if (lastTime - firstTime < 200) {
            key = true;
          }

          console.log("mouseup");
          oTitle.style.cursor = "pointer";
          window.removeEventListener("mousemove", moveFunc);
        });

        function clickFun(ev) {
          if (ev.target === oClose) {
            setValue(KEY_LINKS_DIALOG, "false");
            alert(NOTICE_TEXT_CLOSE_LINK_DIALOG);
            location.reload();
            return;
          }

          if (key) {
            oTitle.classList.toggle("fold");
            oLinks.classList.toggle("fold");
            key = false;
          }
        }

        function moveFunc(e) {
          var nx = e.clientX;
          var ny = e.clientY; //计算移动后的左偏移量和顶部的偏移量

          var nl = nx - (x - l);
          var nt = ny - (y - t);
          oWrapper.style.left = nl + "px";
          oWrapper.style.top = nt + "px";
        }
      } // 场景：有些dom是js动态添加的，但用户点击时，重新获取这些dom里面的看可能存在的link

      function AddLinks(oldLinkArr, aimLink) {
        var newArr = [].concat(_toConsumableArray(oldLinkArr), [aimLink]);
        return uniqueArr(newArr);
      }
      function parseTitle(title) {
        return title.replace(/^【.*】/gi, "");
      }
      function appendBaiduParseDom(disk_id) {
        var pwd =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : "";
        var aDom = document.createElement("a");
        aDom.setAttribute("target", "_blank");
        aDom.innerText = BUTTON_TEXT_PARSE_BAIDU;
        var url = API_PARSE_BAIDU_URL.replace("[disk_id]", disk_id).replace(
          "[pwd]",
          pwd
        );
        aDom.setAttribute("href", url);
        aDom.classList.add("kuan-link");
        aDom.classList.add("bd");
        var leftDivDom = appendLeftBarDom();
        leftDivDom.appendChild(aDom);
      } // 插入播放视频的dom

      function appendVipVideoDom(url) {
        var aDom = document.createElement("a");
        aDom.setAttribute("target", "_blank");
        aDom.innerText = BUTTON_TEXT_VIP_VIDEO;
        aDom.setAttribute("href", url);
        aDom.classList.add("kuan-link");
        aDom.classList.add("kuan-vip");
        var leftDivDom = appendLeftBarDom();
        leftDivDom.appendChild(aDom);
      }

      function getCompressPass() {
        var re_pass =
          /[【\[激活解压壓提取密码碼：:\]】]{3,}\s*([\w+\.\-\~]+)/gi;
        var matchArray = document.body.innerText.match(re_pass);
        var result = [];
        if (!matchArray) return "";

        for (var i = 0; i < matchArray.length; i++) {
          result.push(matchArray[i]);
        }

        result = unique(result); // console.log(result);

        return result.join("~~");
      } // gm xml http request

      function req(url, met, data, onload, onerr) {
        GM_xmlhttpRequest({
          method: met.toUpperCase(),
          url: url,
          data: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          onload: onload,
          onerror: onerr,
        });
      }
      function getPass(disk_type, disk_id, callBack) {
        var pwd = getPwdValue(disk_type, disk_id); // if (pwd) {//本地密码
        callBack({ diskPass: pwd, from: "local" }, "success");
        return;
      }

      function sendPass(disk_type, disk_id, local_pass, callBack) {
        if (1 == 1) return;
        var local_compress_pass = getCompressValue(disk_type, disk_id); // let data = {
        //     disk_id,
        //     disk_type,
        //     disk_info: local_compress_pass
        // }

        var data =
          "disk_id=" +
          disk_id +
          "&disk_pass=" +
          local_pass +
          "&disk_type=" +
          disk_type +
          "&disk_info=" +
          local_compress_pass; // let data = 'disk_id=' + disk_id + '&disk_type=' + disk_type + '&disk_state=1' + '&disk_pass=' + local_pass + '&file_pass=' + local_compress_pass;
        // return $.post(API_DISK_URL + '/pass/send', data, callBack);

        req(
          API_DISK_URL,
          "post",
          data,
          function (res) {
            GM_log("sent"); // GM_log('send: ', res)
          },
          null
        );
      }
      function sendInvalidate(disk_type, disk_id) {
        if (disk_type === undefined || disk_id === undefined) return; // let data = 'disk_state=0&disk_id=' + disk_id + '&disk_type=' + disk_type;

        req(
          API_DISK_URL + "/invalid/" + disk_type + "/" + disk_id,
          "get",
          null,
          function (res) {
            GM_log("sent invalid");
          }
        ); // return $.post(API_DISK_URL + '/pass/send', data, callBack);
      }
      function activeAnyLink(html) {
        html = html.replace(
          new RegExp(html, "ig"),
          '<a target="_blank" href="http://'
            .concat(html, '" class="active-link">')
            .concat(html, "</a>")
        );
        return html;
      } // ===========
      // ===========set/get value func===========

      function getValues() {
        return GM_listValues();
      }
      function setValue(key, value) {
        GM_setValue(key, value);
      }
      function getValue(key) {
        var defaultValue =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : "";
        return GM_getValue(key, defaultValue);
      }
      function getVlues() {
        return GM_listValues();
      }
      function delValue(key) {
        GM_deleteValue(key);
      }
      function setPwdValue(disk_type, disk_id, value) {
        GM_setValue(disk_type + "_" + disk_id, value);
      }
      function getPwdValue(disk_type, disk_id) {
        let pass = GM_getValue(disk_type + "_" + disk_id, "");
        console.log(
          "获取本地密码：disk_type:" +
            disk_type +
            "=> dis_id:" +
            disk_id +
            "=>disk_pass:" +
            pass
        );
        return pass;
      }
      function getSentValue(disk_type, disk_id) {
        return GM_getValue(disk_type + "_sent_" + disk_id, "");
      }
      function setSentValue(disk_type, disk_id) {
        GM_setValue(disk_type + "_sent_" + disk_id, "ok");
      }
      function getCompressValue(disk_type, disk_id) {
        return GM_getValue(disk_type + "_compress_" + disk_id, "");
      }
      function setCompressValue(disk_type, disk_id, val) {
        GM_setValue(disk_type + "_compress_" + disk_id, val);
      } // ===========inner func===========

      function unique(arr) {
        // 去重
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
              //第一个等同于第二个，splice方法删除第二个
              arr.splice(j, 1);
              j--;
            }
          }
        }

        return arr;
      } // 根据正则解析出网盘链接地址

      function parseLink(html) {
        console.log("html", html);

        for (var i = 0; i < ACTIVE_LINK_REG.length; i++) {
          var res = matchAll(html, ACTIVE_LINK_REG[i]);
          console.log("res", res);

          for (var j = 0; j < res.length; j++) {
            if (res[j].length >= 3 && res[j][2] !== undefined) {
              var diskUrl = res[j][1];
              console.log("diskUrl", diskUrl);

              var _getDiskIdAndType3 = getDiskIdAndType(res[j][1]),
                _getDiskIdAndType4 = _slicedToArray(_getDiskIdAndType3, 2),
                disk_type = _getDiskIdAndType4[0],
                disk_id = _getDiskIdAndType4[1]; // setCompressValue(disk_type, disk_id, getCompressPass());//密码
            } // linksArr.push({ link: res[j][1], pwd: res[j][2] || '' });
          }
        }
      } // 顺带抓取链接后面的密码
      // 返回：{ link: res[j][1], pwd: res[j][2] || ''}

      function parsePwd(html) {
        /*
  0: "https://pan.baidu.com/s/1KpvGklksecWEEAQop1PumQ 提取码: 9g4q"
  1: "https://pan.baidu.com/s/1KpvGklksecWEEAQop1PumQ"
  2: "9g4q"
  groups: undefined */
        var linksArr = [];
        var cprP = getCompressPass();

        for (var i = 0; i < PARSE_PWD_REG.length; i++) {
          var res = matchAll(html, PARSE_PWD_REG[i]);

          for (var j = 0; j < res.length; j++) {
            if (res[j].length >= 3 && res[j][2] !== undefined) {
              var _getDiskIdAndType5 = getDiskIdAndType(res[j][1]),
                _getDiskIdAndType6 = _slicedToArray(_getDiskIdAndType5, 2),
                disk_type = _getDiskIdAndType6[0],
                disk_id = _getDiskIdAndType6[1];

              setCompressValue(disk_type, disk_id, cprP); //密码

              console.log("find pwd: ", disk_type, disk_id, "===>>", res[j][2]);
              setPwdValue(disk_type, disk_id, res[j][2]);
            }

            linksArr.push({
              link: res[j][1],
              pwd: res[j][2] || "",
            });
          }
        }

        return linksArr;
      }
      function matchAll(str, reg) {
        // helper,简单封装匹配函数
        var res = [];
        var match;

        while ((match = reg.exec(str))) {
          res.push(match);
        }

        return res;
      } // ===========about disk===========
      // return [type,id]

      function getDiskIdAndType(url) {
        console.log(url);
        if (typeof url !== "string") return [];
        var matches;
        matches =
          /https?:\/\/(?:pan|eyun)\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,25})/gi.exec(
            url
          );

        if (matches && matches.length === 2) {
          return ["BDY", matches[1]];
        }

        matches =
          /https?:\/\/(?:pan|eyun)\.baidu\.com\/s\/[\d]([a-zA-Z0-9_\-]{5,25})/gi.exec(
            url
          );

        if (matches && matches.length === 2) {
          return ["BDY", matches[1]];
        }

        matches = /https?:\/\/(?:\w+)?\.?lanzou.?\.com\/([\w-_]{6,13})/gi.exec(
          url
        );

        if (matches && matches.length === 2) {
          return ["LZY", matches[1]];
        }

        matches = /https?:\/\/cloud.?189?\.cn\/t\/([\w_]{4,20})/gi.exec(url);

        if (matches && matches.length === 2) {
          return ["TYY", matches[1]];
        }
        matches =
          /https?:\/\/cloud.189.cn\/web\/share\?code=([a-zA-Z0-9]{5,15})/gi.exec(
            url
          );

        if (matches && matches.length === 2) {
          return ["TYY", matches[1]];
        }
        matches =
          /https?:\/\/(?:\w+)?\.?123pan\.com\/s\/([\w-]{6,13})\.html/gi.exec(
            url
          );

        if (matches && matches.length === 2) {
          return ["123PAN", matches[1]];
        }
        // 阿里云
        matches = /https?:\/\/(?:www\.)?(aliyundrive|alipan)\.com\/s\/([\w\-]+)/gi.exec(
          url
        );
        if (matches && matches.length === 2) {
          console.log("ALY" + matches[1]);
          return ["ALY", matches[1]];
        }

        // 夸克云
        matches = /https?:\/\/(?:\w+\.)?quark\.cn\/s\/([\w\-]+)/gi.exec(url);
        if (matches && matches.length === 2) {
          return ["QKY", matches[1]];
        }

        return [];
      }
      function mactchReplaceHtml(html, reg) {
        var tag =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : false;
        // let reg = /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/s[hare]*\/[int?surl=]*[\w-_]{5,25})/ig;
        var exec_res;
        var isMatch = false;
        var i = 0;
        var newHtml = html; // console.log(html);

        while ((exec_res = reg.exec(html))) {
          if (i++ > 100) break;
          console.log("exec_res", exec_res);
          var h = html.substring(
            exec_res.index - 1,
            exec_res.index + exec_res[1].length + 1
          ); // console.log('h', h);

          if (exec_res && exec_res[1]) {
            if (
              !/^[='"\/]/gi.test(exec_res[1]) &&
              html.split(exec_res[1]).length - 1 < 2
            ) {
              console.log("can do && no link");
              isMatch = true;

              if (exec_res[1].indexOf("http") === -1) {
                newHtml = html.replace(
                  new RegExp(exec_res[1], "ig"),
                  '<a target="_blank" class="active-link" href="http://'
                    .concat(exec_res[1], '">')
                    .concat(exec_res[1], "</a>")
                );
              } else {
                newHtml = html.replace(
                  new RegExp(exec_res[1], "ig"),
                  '<a target="_blank" class="active-link" href="'
                    .concat(exec_res[1], '">')
                    .concat(exec_res[1], "</a>")
                );
              }

              newHtml = newHtml.replace(/www(\.lanzous\.com)/gi, "pan$1"); //将www替换为pan
            }
          } // ===========以下为旧版本的写法
          // let start = html.substring(0, exec_res.index).slice(-8);
          // if (!/href=['"]?/ig.test(start) && !/['"]?>$/ig.test(start)) {
          //     if (exec_res && exec_res[1]) {
          //         isMatch = true;
          //         if (exec_res[1].indexOf('http') === -1) {
          //             newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="http://${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
          //         } else {
          //             newHtml = html.replace(new RegExp(exec_res[1], 'ig'), `<a target="_blank" href="${exec_res[1]}" class="active-link">${exec_res[1]}</a>`);
          //         }
          //         newHtml = newHtml.replace(/www(\.lanzous\.com)/ig, 'pan$1');//将www替换为pan
          //     }
          // }
        }

        return [isMatch, newHtml];
      }
      // CONCATENATED MODULE: ./src/helper.js
      function _createForOfIteratorHelper(o, allowArrayLike) {
        var it;
        if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
          if (
            Array.isArray(o) ||
            (it = helper_unsupportedIterableToArray(o)) ||
            (allowArrayLike && o && typeof o.length === "number")
          ) {
            if (it) o = it;
            var i = 0;
            var F = function F() {};
            return {
              s: F,
              n: function n() {
                if (i >= o.length) return { done: true };
                return { done: false, value: o[i++] };
              },
              e: function e(_e2) {
                throw _e2;
              },
              f: F,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        }
        var normalCompletion = true,
          didErr = false,
          err;
        return {
          s: function s() {
            it = o[Symbol.iterator]();
          },
          n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
          },
          e: function e(_e3) {
            didErr = true;
            err = _e3;
          },
          f: function f() {
            try {
              if (!normalCompletion && it["return"] != null) it["return"]();
            } finally {
              if (didErr) throw err;
            }
          },
        };
      }

      function helper_slicedToArray(arr, i) {
        return (
          helper_arrayWithHoles(arr) ||
          helper_iterableToArrayLimit(arr, i) ||
          helper_unsupportedIterableToArray(arr, i) ||
          helper_nonIterableRest()
        );
      }

      function helper_nonIterableRest() {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      }

      function helper_unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return helper_arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (
          n === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return helper_arrayLikeToArray(o, minLen);
      }

      function helper_arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }
        return arr2;
      }

      function helper_iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
          for (
            var _i = arr[Symbol.iterator](), _s;
            !(_n = (_s = _i.next()).done);
            _n = true
          ) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }

      function helper_arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }
      function baiduPwdPage(config) {
        var href = config.href;
        console.log("helper...");
        appendSettingDom();
        var _getDiskIdAndType = getDiskIdAndType(href),
          _getDiskIdAndType2 = helper_slicedToArray(_getDiskIdAndType, 2),
          disk_type = _getDiskIdAndType2[0],
          disk_id = _getDiskIdAndType2[1];

        var selector_input = selector(BAIDU_ELEMENT.input);
        var selector_click = selector(BAIDU_ELEMENT.click);
        var selector_notice = selector(BAIDU_ELEMENT.notice);

        getPass(disk_type, disk_id, function (res, status) {
          // todo 从这里开始要写从本地获取的密码
          if (status === "success") {
            console.log(res);

            if (res && res.diskPass) {
              selector_input.value = res.diskPass;
              selector_click.click();
            } else {
              selector_notice.innerText =
                DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
            }
          } else {
            console.log("系统错误");
            selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
          }
        }); // 这里等用户输入

        selector_input.addEventListener("input", function (ev) {
          var value = ev.target.value;
          setPwdValue(disk_type, disk_id, value);
        });
      } //百度正文页面

      function baiduIndexPage(config) {
        var href = config.href;
        console.log("helper...baiduIndexPage");

        var _getDiskIdAndType3 = getDiskIdAndType(href),
          _getDiskIdAndType4 = helper_slicedToArray(_getDiskIdAndType3, 2),
          disk_type = _getDiskIdAndType4[0],
          disk_id = _getDiskIdAndType4[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        } // 左侧按钮，跳转解析
        // appendBaiduParseDom(disk_id, getPwdValue(disk_type, disk_id));
        // 设置dom

        appendSettingDom();

        if (!getSentValue(disk_type, disk_id)) {
          // not sent
          var val = getPwdValue(disk_type, disk_id);
          sendPass(disk_type, disk_id, val, function () {
            return setSentValue(disk_type, disk_id);
          });
        } else {
          console.log("has sent");
        }
      } // 蓝奏云页面

      function lzyPage(config) {
        var href = config.href;
        console.log("helper...");
        var pathname = location.pathname;

        if (pathname.indexOf("/fn") === -1) {
          // 设置dom
          appendSettingDom();
        }

        var _getDiskIdAndType5 = getDiskIdAndType(href),
          _getDiskIdAndType6 = helper_slicedToArray(_getDiskIdAndType5, 2),
          disk_type = _getDiskIdAndType6[0],
          disk_id = _getDiskIdAndType6[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        } //1.先判断是否有密码的页面

        var select0 = selector(LZ_PWD_EXITS_ELEMENT[0]);
        var select1 = selector(LZ_PWD_EXITS_ELEMENT[1]);
        var style = null;

        if (
          select0 &&
          (style = getComputedStyle(select0)).getPropertyValue("display") ===
            "block"
        ) {
          console.log("Pwd page Type 1"); // e.g. https://xihan.lanzous.com/b03yu4atg

          operate(
            selector(LZ_ELEMENT[0].input),
            selector(LZ_ELEMENT[0].click),
            selector(LZ_ELEMENT[0].notice)
          );
        } else if (
          select1 &&
          (style = getComputedStyle(select1)).getPropertyValue("display") ===
            "block"
        ) {
          console.log("Pwd page Type 2"); // e.g. https://skyamg.lanzous.com/i64lVerm67g

          operate(
            selector(LZ_ELEMENT[1].input),
            selector(LZ_ELEMENT[1].click),
            selector(LZ_ELEMENT[1].notice)
          );
        } //操作是否有密码

        function operate(selector_input, selector_click, selector_notice) {
          // 这是从服务器获取密码
          getPass(disk_type, disk_id, function (res, status) {
            // todo 从这里开始要写从本地获取的密码
            if (status === "success") {
              console.log(res);

              if (res && res.diskPass) {
                selector_notice.innerText =
                  DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                selector_input.value = res.diskPass;
                selector_click.click();
              }
            } else {
              selector_notice.innerText =
                DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
            }
          }); // 这里等用户输入

          selector_input.addEventListener("input", function (ev) {
            var value = ev.target.value;
            setPwdValue(disk_type, disk_id, value);
          });
        } //send

        var timer = setInterval(function () {
          if (getSentValue(disk_type, disk_id)) {
            clearInterval(timer);
            return;
          }

          if (
            (!select0 && !select1) ||
            !style ||
            style.getPropertyValue("display") === "none"
          ) {
            console.log("sent");
            var pass = getPwdValue(disk_type, disk_id) || "";
            sendPass(disk_type, disk_id, pass, function () {
              setSentValue(disk_type, disk_id);
            });
            clearInterval(timer);
          }
        }, 2000);
      }
      function change_vue_value(input_dom, value) {
        let el = input_dom;
        el.value = value;
        el.dispatchEvent(new Event("input"));
      }
      function tyyPage(config) {
        var href = config.href;
        console.log("helper..."); // 设置dom

        appendSettingDom();

        var _getDiskIdAndType7 = getDiskIdAndType(href),
          _getDiskIdAndType8 = helper_slicedToArray(_getDiskIdAndType7, 2),
          disk_type = _getDiskIdAndType8[0],
          disk_id = _getDiskIdAndType8[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        }

        var selector_input = selector(TY_ELEMENT.input);
        var selector_click = selector(TY_ELEMENT.click);
        var selector_notice = selector(TY_ELEMENT.notice);
        var textBody = document.body.innerText;
        var wait_timer = null;

        if (textBody.indexOf(TYY_PRIVATE_TEXT) !== -1) {
          // 这是从服务器获取密码
          getPass(disk_type, disk_id, function (res, status) {
            // todo 从这里开始要写从本地获取的密码
            if (status === "success") {
              console.log(res);

              if (res && res.diskPass) {
                if (selector_notice) selector_notice.style.display = "block";
                setTimeout(function () {
                  //延迟一点
                  if (selector_notice)
                    selector_notice.innerText =
                      DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                  change_vue_value(selector_input, res.diskPass);
                  selector_click.click();
                }, 500);
              } else {
                if (selector_notice) {
                  selector_notice.style.display = "block";
                  selector_notice.innerText =
                    DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
                }
              }
            } else {
              console.log("系统错误");
              selector_notice.innerText =
                DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
            }
          }); // 这里等用户输入

          selector_input.addEventListener("input", function (ev) {
            var value = ev.target.value;
            setPwdValue(disk_type, disk_id, value);
          });
        }

        wait_timer = setInterval(waitSuccess, 1000);

        function waitSuccess() {
          if (getSentValue(disk_type, disk_id)) clearInterval(wait_timer); //clear

          if (textBody.indexOf(TYY_PRIVATE_TEXT) === -1) {
            clearInterval(wait_timer); //clear

            var val = getPwdValue(disk_type, disk_id) || "";

            if (!getSentValue(disk_type, disk_id)) {
              sendPass(disk_type, disk_id, val, function () {
                console.log("sent");
                setSentValue(disk_type, disk_id);
              });
            }
          }
        }
      } // 其他页面
      function _123panPage(config) {
        var href = config.href;
        console.log("helper123..."); // 设置dom

        appendSettingDom();

        var _getDiskIdAndType7 = getDiskIdAndType(href),
          _getDiskIdAndType8 = helper_slicedToArray(_getDiskIdAndType7, 2),
          disk_type = _getDiskIdAndType8[0],
          disk_id = _getDiskIdAndType8[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        }

        var selector_input = selector(_123PAN_ELEMENT.input);
        var selector_click = selector(_123PAN_ELEMENT.click);
        var selector_notice = selector(_123PAN_ELEMENT.notice);
        var textBody = document.body.innerText;
        var wait_timer = null;

        // 这是从服务器获取密码
        getPass(disk_type, disk_id, function (res, status) {
          // todo 从这里开始要写从本地获取的密码
          if (status === "success") {
            console.log(res);

            if (res && res.diskPass) {
              if (selector_notice) selector_notice.style.display = "block";
              setTimeout(function () {
                console.log(res.diskPass);
                //延迟一点
                if (selector_notice)
                  selector_notice.innerText =
                    DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                changeReactInputValue(selector_input, res.diskPass);
                selector_click.click();
              }, 500);
            } else {
              if (selector_notice) {
                selector_notice.style.display = "block";
                selector_notice.innerText =
                  DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
              }
            }
          } else {
            console.log("系统错误");
            selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
          }
        }); // 这里等用户输入

        selector_input.addEventListener("input", function (ev) {
          var value = ev.target.value;
          setPwdValue(disk_type, disk_id, value);
        });

        wait_timer = setInterval(waitSuccess, 1000);

        function waitSuccess() {
          if (getSentValue(disk_type, disk_id)) clearInterval(wait_timer); //clear

          if (textBody.indexOf(TYY_PRIVATE_TEXT) === -1) {
            clearInterval(wait_timer); //clear

            var val = getPwdValue(disk_type, disk_id) || "";

            if (!getSentValue(disk_type, disk_id)) {
              sendPass(disk_type, disk_id, val, function () {
                console.log("sent");
                setSentValue(disk_type, disk_id);
              });
            }
          }
        }
      }
      function changeReactInputValue(inputDom, newText) {
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
      }
      function aliyunPage(config) {
        var href = config.href;
        console.log("helper123..."); // 设置dom

        appendSettingDom();

        var _getDiskIdAndType7 = getDiskIdAndType(href),
          _getDiskIdAndType8 = helper_slicedToArray(_getDiskIdAndType7, 2),
          disk_type = _getDiskIdAndType8[0],
          disk_id = _getDiskIdAndType8[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        }

        var selector_input = selector(ALY_ELEMENT.input);
        var selector_click = selector(ALY_ELEMENT.click);
        var selector_notice = selector(ALY_ELEMENT.notice);
        var textBody = document.body.innerText;
        var wait_timer = null;

        // 这是从服务器获取密码
        getPass(disk_type, disk_id, function (res, status) {
          // todo 从这里开始要写从本地获取的密码
          if (status === "success") {
            console.log(res);

            if (res && res.diskPass) {
              if (selector_notice) selector_notice.style.display = "block";
              setTimeout(function () {
                console.log(res.diskPass);
                //延迟一点
                if (selector_notice)
                  selector_notice.innerText =
                    DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                changeReactInputValue(selector_input, res.diskPass);
                selector_click.click();
              }, 500);
            } else {
              if (selector_notice) {
                selector_notice.style.display = "block";
                selector_notice.innerText =
                  DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
              }
            }
          } else {
            console.log("系统错误");
            selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
          }
        }); // 这里等用户输入

        selector_input.addEventListener("input", function (ev) {
          var value = ev.target.value;
          setPwdValue(disk_type, disk_id, value);
        });

        wait_timer = setInterval(waitSuccess, 1000);

        function waitSuccess() {
          if (getSentValue(disk_type, disk_id)) clearInterval(wait_timer); //clear

          if (textBody.indexOf(TYY_PRIVATE_TEXT) === -1) {
            clearInterval(wait_timer); //clear

            var val = getPwdValue(disk_type, disk_id) || "";

            if (!getSentValue(disk_type, disk_id)) {
              sendPass(disk_type, disk_id, val, function () {
                console.log("sent");
                setSentValue(disk_type, disk_id);
              });
            }
          }
        }
      }
      function quarkPage(config) {
        var href = config.href;
        console.log("helper123..."); // 设置dom

        appendSettingDom();

        var _getDiskIdAndType7 = getDiskIdAndType(href),
          _getDiskIdAndType8 = helper_slicedToArray(_getDiskIdAndType7, 2),
          disk_type = _getDiskIdAndType8[0],
          disk_id = _getDiskIdAndType8[1]; // 检测是否已失效

        for (var i = 0; i < INVALIDATE_LINK_REG.length; i++) {
          var reg = INVALIDATE_LINK_REG[i];

          if (reg.test(document.body.innerText)) {
            console.log("detected invalid page");
            sendInvalidate(disk_type, disk_id);
            return; //已失效，不往下进行了；
          }
        }

        var selector_input = selector(ALY_ELEMENT.input);
        var selector_click = selector(ALY_ELEMENT.click);
        var selector_notice = selector(ALY_ELEMENT.notice);
        var textBody = document.body.innerText;
        var wait_timer = null;

        // 这是从服务器获取密码
        getPass(disk_type, disk_id, function (res, status) {
          // todo 从这里开始要写从本地获取的密码
          if (status === "success") {
            console.log(res);

            if (res && res.diskPass) {
              if (selector_notice) selector_notice.style.display = "block";
              setTimeout(function () {
                console.log(res.diskPass);
                //延迟一点
                if (selector_notice)
                  selector_notice.innerText =
                    DISK_INFO_START_WITH + QUERY_SUCCESS_NOTICE;
                changeReactInputValue(selector_input, res.diskPass);
                selector_click.click();
              }, 500);
            } else {
              if (selector_notice) {
                selector_notice.style.display = "block";
                selector_notice.innerText =
                  DISK_INFO_START_WITH + PLEASE_INPUT_NOTICE;
              }
            }
          } else {
            console.log("系统错误");
            selector_notice.innerText = DISK_INFO_START_WITH + SYS_ERROR_NOTICE;
          }
        }); // 这里等用户输入

        selector_input.addEventListener("input", function (ev) {
          var value = ev.target.value;
          setPwdValue(disk_type, disk_id, value);
        });

        wait_timer = setInterval(waitSuccess, 1000);

        function waitSuccess() {
          if (getSentValue(disk_type, disk_id)) clearInterval(wait_timer); //clear

          if (textBody.indexOf(TYY_PRIVATE_TEXT) === -1) {
            clearInterval(wait_timer); //clear

            var val = getPwdValue(disk_type, disk_id) || "";

            if (!getSentValue(disk_type, disk_id)) {
              sendPass(disk_type, disk_id, val, function () {
                console.log("sent");
                setSentValue(disk_type, disk_id);
              });
            }
          }
        }
      }
      function tansertounique(arr) {
        let obj = {};
        arr = arr.reduce(function (a, b) {
          obj[b.link] ? "" : (obj[b.link] = true && a.push(b));
          return a;
        }, []);
        return arr;
      }
      function OtherPage(config) {
        var href = config.href; // Array.prototype.slice.call(document.querySelectorAll(
        //     "a[href*='pan.baidu.com'], a[href*='lanzou'], a[href*='lanzoui.com'], a[href*='lanzous.com'], a[href*='lanzoux.com']"
        // )).forEach(function (link) {
        //     let txt = link.nextSibling && link.nextSibling.nodeValue;
        //     console.log('link', link);
        //     console.log('txt', txt);
        //     parseLink(link)
        //     let linkcode = /码.*?([a-z\d]{4})/i.exec(txt) && RegExp.$1;
        //     if (!linkcode) {
        //         txt = link.parentNode.innerText;
        //         linkcode = /码.*?([a-z\d]{4})/i.exec(txt) && RegExp.$1;
        //     }
        // });

        var linkArr = parsePwd(document.body.innerText); //先分析下密码
        linkArr = tansertounique(linkArr);
        appendLinksDom(linkArr); // document.addEventListener('click', (ev) => {
        //     if (ev.target === document.body) return
        //     linkArr = AddLinks(linkArr, parsePwd(ev.target.innerText))
        //     appendLinksDom(linkArr)
        // })

        /*
  以下代码，参考自：https://greasyfork.org/zh-CN/scripts/18733-%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7/code
  */

        var CODE_RULE_COMMON = /^([a-z\d]{3,})$/i;
        var MAX_SEARCH_CODE_RANGE = 5; //functions...

        var textNodesUnder = function textNodesUnder(el) {
          var n,
            a = [],
            walk = document.createTreeWalker(
              el,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );

          while ((n = walk.nextNode())) {
            if (n.nodeName === "#text") a.push(n);
          }

          return a;
        };

        var generalLinkifyText = function generalLinkifyText(
          source,
          eles,
          index,
          testReg,
          validateRule
        ) {
          var count = 0,
            text = source,
            match;

          while ((match = testReg.exec(source))) {
            count++;
            var url = (match[1] || "http://") + match[2];
            var originalText = (match[1] || "") + match[2];
            var code =
              match[3] || findCodeFromElements(eles, index, validateRule) || "";
            url = url.split("#")[0];
            text = text.replace(
              originalText,
              "<a href='" +
                url +
                "#" +
                code +
                "' target='_blank'>" +
                url +
                "</a>"
            );
          }

          return {
            count: count,
            text: text,
          };
        };

        var findCodeFromElements = function findCodeFromElements(
          eles,
          index,
          rule
        ) {
          for (var i = 0; i < MAX_SEARCH_CODE_RANGE && i < eles.length; i++) {
            var txt = null;

            try {
              txt = eles[i + index].textContent || "";
            } catch (e) {
              continue;
            }

            var codeReg = /码.*?([a-z\d]+)/gi;
            var codeMatch = codeReg.exec(txt) && RegExp.$1;
            if (!codeMatch) continue;
            var linkTestReg = /(https?:|\.(net|cn|com|gov|cc|me))/gi;

            if (
              linkTestReg.exec(txt) &&
              linkTestReg.lastIndex <= codeReg.lastIndex
            ) {
              break;
            }

            if (rule.test(codeMatch)) return codeMatch;
          }

          return null;
        };

        var linkify = function linkify() {
          var eles = textNodesUnder(document.body);
          var processor = [];

          var _loop = function _loop(m) {
            processor.push(function () {
              for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
              ) {
                args[_key] = arguments[_key];
              }

              return generalLinkifyText.apply(
                void 0,
                [].concat(args, [LINKIFY_REG[m], CODE_RULE_COMMON])
              );
            });
          };

          for (var m = 0; m < LINKIFY_REG.length; m++) {
            _loop(m);
          }

          for (var i = 0; i < eles.length; i++) {
            var ele = eles[i];
            if (ele.parentNode.tagName == "a" || !ele.textContent) continue;
            var txt = ele.textContent;
            var loopCount = 0;

            var _iterator = _createForOfIteratorHelper(processor),
              _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var action = _step.value;

                var _action = action(txt, eles, i + 1),
                  count = _action.count,
                  text = _action.text;

                loopCount += count;
                txt = text;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            if (loopCount > 0) {
              var span = document.createElement("span");
              span.innerHTML = txt;
              ele.parentNode.replaceChild(span, ele);
            }
          }
        };

        linkify();
      }
      // CONCATENATED MODULE: ./src/entry.js
      var _regular_express;

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      var entry_href = location.href; // 完整路径

      var hash = location.hash;
      var host = location.hostname.replace(/^www\./i, "").toLowerCase();
      var entry_config = {
        href: entry_href,
        hash: hash,
        host: host,
      }; //引入自己的helper

      exportStyle(); //先导出样式

      var regular_express =
        ((_regular_express = {
          youkuVideo: /^https?:\/\/v\.youku\.com\/v_show\/.*/gi,
          qqVideo: /^https?:\/\/v\.qq\.com\/x\/cover\/.*/gi,
          iqyVideo: /^https?:\/\/\w+\.?iqiyi\.com\/v_.*/gi,
          mgVideo: /^https?:\/\/\w+\.?mgtv\.com\/b\//gi,
          leVideo: /^https?:\/\/\w+\.?le\.com\/ptv\/vplay\//gi,
          tudouVideo: /^https?:\/\/video\.tudou\.com\/v\//gi,
          souhuVideo: /^https?:\/\/tv\.sohu\.com\/v\//gi,
          pptvVideo: /^https?:\/\/v\.pptv\.com\/show\//gi,
        }),
        _defineProperty(
          _regular_express,
          "mgVideo",
          /^https?:\/\/\w+\.?miguvideo\.com\/mgs\//gi
        ),
        _defineProperty(
          _regular_express,
          "bdyPwd",
          /^https?:\/\/pan\.baidu\.com\/share\/init\?surl=.*/gi
        ),
        _defineProperty(
          _regular_express,
          "bdyPage",
          /^https?:\/\/pan\.baidu\.com\/s\/.*/gi
        ),
        _defineProperty(
          _regular_express,
          "lzyPage",
          /^https?:\/\/(?:\w+)?\.?lanzou.?\.com\/.*/gi
        ),
        _defineProperty(
          _regular_express,
          "tyyPage",
          /^https?:\/\/(?:\w+)?\.?189.?\.cn\/.*/gi
        ),
        _defineProperty(
          _regular_express,
          "_123panPage",
          /^https?:\/\/(?:\w+)?\.?123pan.?\.com\/.*/gi
        ),
        _defineProperty(
          _regular_express,
          "aliyunPage",
          /^https?:\/\/(?:\w+)?\.?(aliyundrive|alipan)\.com\/.*/gi
        ),
        _defineProperty(
          _regular_express,
          "quarkPage",
          /^https?:\/\/(?:\w+)?\.?quark.?\.cn\/.*/gi
        ),
        _regular_express);
      ~(function () {
        //百度网盘输入密码页面
        console.log(entry_href);
        if (regular_express.bdyPwd.test(entry_href)) {
          console.log("BDY PWD Page");
          baiduPwdPage(entry_config);
          return;
        } // 百度云

        if (regular_express.bdyPage.test(entry_href)) {
          // 百度网盘正文页面
          console.log("BDY Index Page");
          baiduIndexPage(entry_config);
          return;
        } // 蓝奏云

        if (regular_express.lzyPage.test(entry_href)) {
          // 百度网盘正文页面
          console.log("LZY Index Page");
          lzyPage(entry_config);
          return;
        } // 天翼云

        if (regular_express.tyyPage.test(entry_href)) {
          // 天翼云网盘正文页面

          let tyy_interval = setInterval(() => {
            if (!!selector(TY_ELEMENT.click)) {
              console.log("TYY Index Page");
              tyyPage(entry_config);
            }
          }, 1000);
          setTimeout(() => {
            clearInterval(tyy_interval);
          }, 10000);
          return;
        }
        if (regular_express._123panPage.test(entry_href)) {
          // 123网盘正文页面
          console.log("123pan Index Page");
          _123panPage(entry_config);
          return;
        }
        if (regular_express.aliyunPage.test(entry_href)) {
          // 阿里云网盘正文页面
          console.log("aliyunPage Index Page");
          setTimeout(() => {
            aliyunPage(entry_config);
          }, 2000);
          return;
        }
        if (regular_express.quarkPage.test(entry_href)) {
          // 阿里云网盘正文页面
          console.log("quarkPage Index Page");

          setTimeout(() => {
            quarkPage(entry_config);
          }, 2000);

          return;
        }
        console.log("Other Page");
        OtherPage(entry_config);
      })();

      /***/
    },
    /******/
  ]
);
