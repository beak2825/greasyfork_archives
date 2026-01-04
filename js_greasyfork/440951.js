// ==UserScript==
// @name              新度盘助手 (v2)
// @name:en           (New) Baidu™ WebDisk Helper v2 (dupan-helper)
// @namespace         moe.jixun.dupan.v2
// @version           0.0.1
// @description       度盘增强
// @description:en    Enhancements for Baidu™ WebDisk.
// @author            Jixun<https://jixun.moe/>

// @match             https://pan.baidu.com/disk/main*
// @match             https://yun.baidu.com/disk/main*

// @compatible        chrome Violentmonkey

// @license           BSD-3-Clause
// @homepageURL       https://github.com/jixunmoe/dupan-helper-v2/
// @supportURL        https://github.com/jixunmoe/dupan-helper-v2/issues
// @contributionURL   https://jixun.moe/donate

// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/440951/%E6%96%B0%E5%BA%A6%E7%9B%98%E5%8A%A9%E6%89%8B%20%28v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440951/%E6%96%B0%E5%BA%A6%E7%9B%98%E5%8A%A9%E6%89%8B%20%28v2%29.meta.js
// ==/UserScript==

function entryPoint () {
  "use strict";
  
  var css_248z$2 =
    ".jx-align-right {\n  text-align: right;\n}\n\n.jx-compact-form-items .u-form-item--small.u-form-item {\n  margin-bottom: 0;\n}\n\n.jx-compact-form-items .u-form-item--small .u-form-item__label {\n  font-family: sans-serif;\n  width: 7em;\n  text-align: right;\n  user-select: none;\n  line-height: 1.25em;\n}\n\n.jx-compact-form-items .u-form-item--small .u-form-item__content {\n  line-height: 1.25em;\n  overflow: hidden;\n}\n";
  styleInject(css_248z$2);
  
  const CHUNK_EARLY_HOOK = "home";
  const ENTRY_ID = "jixun: entry :D";
  const __default = "a";
  // module name
  var WEBPACK_MODULE_ID;
  (function (WEBPACK_MODULE_ID) {
    WEBPACK_MODULE_ID["RegisterComponent"] = "0083";
    WEBPACK_MODULE_ID["Globals"] = "49fe";
    WEBPACK_MODULE_ID["Vue"] = "7231";
    WEBPACK_MODULE_ID["PolyfillMakeClass"] = "1586";
  })(WEBPACK_MODULE_ID || (WEBPACK_MODULE_ID = {}));
  // require.x keys
  var WEBPACK_REQUIRE_KEYS;
  (function (WEBPACK_REQUIRE_KEYS) {
    WEBPACK_REQUIRE_KEYS["CACHED_MODULES"] = "c";
    WEBPACK_REQUIRE_KEYS["EXPORT_ES6_MEMBER"] = "d";
  })(WEBPACK_REQUIRE_KEYS || (WEBPACK_REQUIRE_KEYS = {}));
  // module keys
  var WEBPACK_MODULE_KEYS;
  (function (WEBPACK_MODULE_KEYS) {
    WEBPACK_MODULE_KEYS["MODULE_ID"] = "i";
    WEBPACK_MODULE_KEYS["MODULE_LOADED"] = "l";
    WEBPACK_MODULE_KEYS["EXPORTS"] = "exports";
  })(WEBPACK_MODULE_KEYS || (WEBPACK_MODULE_KEYS = {}));
  const EVENTS = {
    SHOW_CODE_UPLOAD_DIALOG: Symbol("SHOW_CODE_UPLOAD_DIALOG"),
    ADD_RAPID_UPLOAD_TASKS: Symbol("ADD_RAPID_UPLOAD_TASKS"),
  };
  
  class DelayedValue {
    constructor() {
      this.queue = [];
      this.setValue = (value) => {
        this.value = value;
        for (const resolve of this.queue) {
          resolve(value);
        }
        this.queue = [];
      };
      this.getValue = () => {
        return this.value;
      };
      this.get = (callback) => {
        if (this.value !== undefined) {
          if (callback) {
            return callback(this.value);
          } else {
            return Promise.resolve(this.value);
          }
        }
        if (callback) {
          this.queue.push(callback);
        } else {
          return new Promise((resolve) => {
            this.queue.push(resolve);
          });
        }
      };
      this.getAsync = async () => {
        return new Promise((resolve) => {
          this.get(resolve);
        });
      };
    }
    get isSet() {
      return this.value !== undefined;
    }
  }
  
  var BAIDU_GLOBALS_KEY;
  (function (BAIDU_GLOBALS_KEY) {
    BAIDU_GLOBALS_KEY["SOME_API_URLS"] = "a";
    BAIDU_GLOBALS_KEY["ENTERPRISE_URLS"] = "b";
    BAIDU_GLOBALS_KEY["ERROR_MESSAGES"] = "c";
  })(BAIDU_GLOBALS_KEY || (BAIDU_GLOBALS_KEY = {}));
  const baiduContext = new DelayedValue();
  const baiduGlobals = new DelayedValue();
  
  const reorderMD5 = (str) => {
    return str.slice(8, 16) + str.slice(0, 8) + str.slice(24) + str.slice(16, 24);
  };
  const scrambleMD5 = (hash) => {
    // 百度的实现就是如此，应该是写错了？
    if (parseInt(hash) & Number(hash.length !== 32)) {
      return hash;
    }
    // 如果包含非法字符，不进行处理。
    // 可能是防止二次调用？
    if (/[^0-9a-f]/.test(hash)) {
      return hash;
    }
    let result = reorderMD5(hash)
      .split("")
      .map((c, i) => {
        let byte = (parseInt(c, 16) ^ i) & 0x0f;
        if (i === 9) {
          return String.fromCharCode(byte + 0x67);
        }
        return byte.toString(16);
      })
      .join("");
    // 百度的实现如此，补位 String.fromCharString(NaN) - 被转换为字符码 0 的字符串
    if (result.length < 10) result += "\x00";
    return result;
  };
  
  const URL_RAPID_UPLOAD = "/api/rapidupload";
  const DAYS_IN_SECONDS = 86400;
  const DAYS_90 = DAYS_IN_SECONDS * 90;
  const DAYS_180 = DAYS_IN_SECONDS * 180;
  const rand = (a, b) => (b - a) * Math.random();
  const generateMTime = () => (Date.now() / 1000 - rand(DAYS_90, DAYS_180)) | 0;
  class BaiduUploadAPI {
    constructor() {
      baiduContext.get((baidu) => {
        this.baidu = baidu;
      });
    }
    async rapidUpload(opt) {
      if (!this.baidu) {
        return Promise.reject("Baidu Context 尚未初始化");
      }
      const { ctx } = this.baidu;
      const { replaceType, name, sliceMD5, contentMD5, size } = opt;
      const { bdstoken } = ctx.yunData;
      const dirPath = ctx.currentPath;
      const fullPath = dirPath + "/" + name;
      return ctx.$http.request({
        url: `${URL_RAPID_UPLOAD}?rtype=${replaceType}&bdstoken=${bdstoken}`,
        method: "POST",
        data: {
          path: fullPath,
          "content-length": size,
          "content-md5": scrambleMD5(contentMD5),
          "slice-md5": scrambleMD5(sliceMD5),
          target_path: dirPath,
          local_mtime: generateMTime(),
        },
      });
    }
  }
  const baiduUploadAPI = new BaiduUploadAPI();
  
  class EventBus {
    constructor() {
      this.handler = new Map();
    }
    on(name, callback) {
      if (this.handler.has(name)) {
        this.handler.get(name)?.add(callback);
      } else {
        this.handler.set(name, new Set([callback]));
      }
    }
    off(name, callback) {
      if (!callback) {
        this.handler.delete(name);
      } else if (this.handler.has(name)) {
        this.handler.get(name)?.delete(callback);
      }
    }
    emit(name, ...data) {
      const handlers = this.handler.get(name);
      if (handlers) {
        for (const callback of handlers) {
          callback.apply(null, data);
        }
      }
    }
  }
  const bus = new EventBus();
  
  bus.on(
    EVENTS.ADD_RAPID_UPLOAD_TASKS,
    async (items, replaceType, updateProgress) => {
      for (const item of items) {
        const { md5, md5s, name, size } = item;
        const resp = await baiduUploadAPI.rapidUpload({
          contentMD5: md5,
          sliceMD5: md5s,
          name,
          size,
          replaceType,
        });
        updateProgress(item, resp);
      }
      // 刷新所在目录
      const ctx = await baiduContext.getAsync();
      ctx.ctx.currentInstance.reloadList();
    }
  );
  
  class DelayedFunctionCall {
    constructor() {
      this.value = new DelayedValue();
      this.setImpl = (f) => {
        this.value.setValue(f);
      };
      this.getImpl = () => {
        return this.value.getValue();
      };
      this.call = (...args) => {
        return this.callWithContext(null, ...args);
      };
      this.callWithContext = (ctx, ...args) => {
        const f = this.value.getValue();
        if (f) {
          return f.apply(ctx, args);
        }
        return new Promise((resolve, reject) => {
          this.value.get((f) => {
            try {
              resolve(f.apply(ctx, args));
            } catch (err) {
              reject(err);
            }
          });
        });
      };
    }
  }
  
  const webpackRequire = new DelayedFunctionCall();
  const waitModuleLoad = new DelayedFunctionCall();
  function hookOnSet(obj, name, callback) {
    let value = obj[name];
    Object.defineProperty(obj, name, {
      configurable: false,
      enumerable: true,
      get() {
        return value;
      },
      set(v) {
        if (v !== value) {
          callback(v);
          value = v;
        }
      },
    });
  }
  function setWebpackRequire(require) {
    // DEBUG
    window.__require = require;
    webpackRequire.setImpl(require);
    waitModuleLoad.setImpl((moduleId, callback) => {
      hookOnSet(
        require[WEBPACK_REQUIRE_KEYS.CACHED_MODULES],
        moduleId,
        (module) => {
          hookOnSet(module, WEBPACK_MODULE_KEYS.MODULE_LOADED, (loaded) => {
            if (loaded) {
              callback(module, require);
            }
          });
        }
      );
    });
  }
  
  const Vue = new DelayedValue();
  
  const logFactory = (level) => {
    {
      return (..._) => {};
    }
  };
  const debug = logFactory();
  
  function hookMixinPluginContainer(createdFn) {
    return function () {
      const result = createdFn.apply(this, arguments);
      this.previewPlugin.push({
        compName: "JixunCodeUploadContainer",
        show: true,
        key: "Jixun Code Input Dialog",
        compProps: {
          fileMetaList: [],
          currentFileMeta: null,
          otherParam: null,
        },
      });
      return result;
    };
  }
  function hookListToolActions(listToolActions) {
    return function () {
      const result = listToolActions.apply(this, arguments);
      if (result?.[0]?.comp === "upload-button") {
        result.splice(1, 0, {
          comp: "JixunCodeUploadButton",
          evt: "instant-code-upload",
          icon: "u-icon-upper-shelf",
          plugin: "code-upload@com.baidu.pan",
          text: "秒传",
        });
      }
      // console.info("listToolActions:", result);
      return result;
    };
  }
  function hookComponentInit(componentInit) {
    return function (component) {
      debug("register component: ", component);
      if (component?.computed?.listToolActions) {
        component.computed.listToolActions = hookListToolActions(
          component.computed.listToolActions
        );
      }
      if (component?.computed?.hideHeader) {
        component.mixins?.forEach((plugin) => {
          if (plugin?.methods?.handlePreview && plugin.created) {
            plugin.created = hookMixinPluginContainer(plugin.created);
          }
        });
      }
      return componentInit.apply(this, arguments);
    };
  }
  
  var JixunButton = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "u-button",
        _vm._g(
          {
            attrs: {
              size: "medium",
              round: "",
              nativeType: "button",
              disabled: _vm.disabled,
              type: _vm.primary ? "primary" : "",
            },
          },
          _vm.$listeners
        ),
        [_vm._t("default")],
        2
      );
    },
    props: {
      primary: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  };
  
  var css_248z$1 =
    "\r\na.jx-upload-button-container {\r\n  margin-left: 0.5em;\r\n}\r\n\r\n  a.jx-upload-button-container > button {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n\r\n    background-color: #ac13f2;\r\n    border: 1px solid #eeabf4;\r\n\r\n    transition: all 0.3s;\r\n  }\r\n\r\n  a.jx-upload-button-container > button:hover,\r\n    a.jx-upload-button-container > button:focus {\r\n      background-color: #890fc2;\r\n      border-color: #eeabf4;\r\n    }\r\n";
  styleInject(css_248z$1);
  
  var JixunCodeUploadButton = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a",
        {
          staticClass:
            "nd-upload-button upload-wrapper jx-upload-button-container",
        },
        [
          _c(
            "u-button",
            {
              staticClass: "nd-file-list-toolbar-action-item",
              class: { "is-has-icon": _vm.conf.icon },
              attrs: {
                size: "small",
                round: "",
                type: "primary",
                icon: "u-icon " + _vm.conf.icon,
              },
              on: { click: _vm.handleClick },
            },
            [_vm._v("\n    " + _vm._s(_vm.conf.text) + "\n  ")]
          ),
        ],
        1
      );
    },
    props: {
      conf: {
        type: Object,
        default: function () {},
      },
    },
    methods: {
      handleClick: function () {
        bus.emit(EVENTS.SHOW_CODE_UPLOAD_DIALOG);
      },
    },
  };
  
  var css_248z =
    "\n.jx-dialog {\n  margin-top: 24px;\n  color: #424e67;\n}\n\n  .jx-dialog textarea {\n    width: 100%;\n    min-height: 10em;\n    border: 1px solid #ccc;\n  }\n\n  .jx-dialog p {\n    padding-top: 0.55em;\n  }\n\n  .jx-dialog label > span {\n      cursor: pointer;\n    }\n";
  styleInject(css_248z);
  
  const hex = (value) => {
    const hex = Math.floor(value).toString(16);
    return `0${hex}`.slice(-2);
  };
  /**
   * UTF-8 字符转换成 base64 后在 JS 里解析会出毛病。
   * 这个转换会进行一些特别的纠正。
   */
  const decodeBase64 = (str) => {
    try {
      str = atob(str);
    } catch (e) {
      console.error("base64 decode failed: %s", str);
      return "";
    }
    return decodeURIComponent(
      str.replace(/[^\x00-\x7F]/g, (z) => `%${hex(z.charCodeAt(0))}`)
    );
  };
  
  const slice = Function.prototype.call.bind(Array.prototype.slice);
  /**
   * 一个简单的类似于 NodeJS Buffer 的实现.
   * 用于解析游侠度娘提取码。
   */
  class SimpleBuffer {
    constructor(str) {
      this.buf = new Uint8Array();
      this.fromString(str);
    }
    fromString(str) {
      const len = str.length;
      this.buf = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        this.buf[i] = str.charCodeAt(i);
      }
    }
    readUnicode(index, size) {
      const bufText = slice(this.buf, index, index + size).map(hex);
      const buf = [""];
      for (let i = 0; i < size; i += 2) {
        buf.push(bufText[i + 1] + bufText[i]);
      }
      return JSON.parse(`"${buf.join("\\u")}"`);
    }
    /**
     * Read a number (Big Endian) from buffer.
     * @param index Index
     * @param size Integer size
     * @returns {number} an integer representing the value at given index
     */
    readNumber(index, size) {
      let ret = 0;
      for (let i = index + size; i > index; i--) {
        // 2^8 = 256
        ret = this.buf[i] + ret * 256;
      }
      return ret;
    }
    readUInt(index) {
      return this.readNumber(index, 4);
    }
    readULong(index) {
      return this.readNumber(index, 8);
    }
    readHex(index, size) {
      const blob = slice(this.buf, index, index + size);
      return blob.map(hex).join("");
    }
  }
  
  const trim = (str) => String.prototype.trim.call(str);
  /**
   * 百度网盘用的(非官方)标准提取码。
   * 支持解析：
   * 1. 游侠的 `BDLINK` 提取码
   * 2. 我的“标准提取码”
   * 3. PanDownload 的 `bdpan://` 协议。
   */
  class DuParser {
    constructor() {
      this.results = [];
      this.versions = new Set();
      this.reset();
    }
    reset() {
      this.results = [];
      this.versions = new Set();
    }
    /**
     * 判断地址类型并解析。
     * @param url
     */
    parse(url) {
      this.reset();
      // 游侠的格式是多行，不好判断结束位置。
      // 所以一次只能解析一条数据。
      if (url.indexOf("BDLINK") === 0) {
        this.parseAli(url);
        return;
      }
      // 其他两个格式一行一个文件信息。
      const links = url.split("\n").map(trim);
      for (const link of links) {
        if (link.startsWith("bdpan://")) {
          this.parsePanDownload(link);
        } else {
          this.parseStandard(link);
        }
      }
    }
    get hasResults() {
      return this.results.length;
    }
    parseAli(url) {
      const raw = atob(url.slice(6).replace(/\s/g, ""));
      if (raw.slice(0, 5) !== "BDFS\x00") return null;
      const buf = new SimpleBuffer(raw);
      let ptr = 9;
      const fileCount = buf.readUInt(5);
      if (fileCount === 0) {
        return null;
      }
      this.versions.add("游侠 v1");
      for (let i = 0; i < fileCount; i++) {
        // 大小 (8 bytes)
        // MD5 + MD5S (0x20)
        // nameSize (4 bytes)
        // Name (unicode)
        const fileInfo = Object.create(null);
        fileInfo.size = buf.readULong(ptr);
        fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
        fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
        const sizeofName = buf.readUInt(ptr + 0x28) * 2;
        ptr += 0x2c;
        fileInfo.name = buf.readUnicode(ptr, sizeofName);
        this.results.push(fileInfo);
        ptr += sizeofName;
      }
      return true;
    }
    parseStandard(line) {
      const match = line.match(
        /^([\dA-F]{32})#([\dA-F]{32})#([\d]{1,20})#([\s\S]+)$/i
      );
      if (match) {
        const [, md5, md5s, size, name] = match;
        this.versions.add("梦姬标准");
        this.results.push({
          md5,
          md5s,
          size: parseInt(size, 10),
          name,
        });
      }
      return null;
    }
    parsePanDownload(line) {
      const match = decodeBase64(line.slice(8)).match(
        /^([\s\S]+)\|([\d]{1,20})\|([\dA-F]{32})\|([\dA-F]{32})$/i
      );
      if (match) {
        const [, name, size, md5, md5s] = match;
        this.versions.add("PanDownload");
        this.results.push({
          md5,
          md5s,
          size: parseInt(size, 10),
          name,
        });
      }
      return null;
    }
  }
  
  var RAPID_UPLOAD_REPLACE;
  (function (RAPID_UPLOAD_REPLACE) {
    RAPID_UPLOAD_REPLACE[(RAPID_UPLOAD_REPLACE["FAILURE"] = 0)] = "FAILURE";
    RAPID_UPLOAD_REPLACE[(RAPID_UPLOAD_REPLACE["DUPLICATE"] = 1)] = "DUPLICATE";
    // UNKNOWN_REPLACE_RULE = 2,
    RAPID_UPLOAD_REPLACE[(RAPID_UPLOAD_REPLACE["REPLACE"] = 3)] = "REPLACE";
  })(RAPID_UPLOAD_REPLACE || (RAPID_UPLOAD_REPLACE = {}));
  
  /**
   * 将数字形式的文件大小转换为更可读的文本形式
   */
  function readableSize(size) {
    let unit = "MiB";
    let sizeInUnit = size / 1024 / 1024;
    // 超过 GB
    if (sizeInUnit > 1024) {
      unit = "GiB";
      sizeInUnit /= 1024;
    }
    return `${sizeInUnit.toFixed(2)} ${unit}`;
  }
  
  var JixunBaiduError = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("span", [
        _vm._v(_vm._s(_vm.text) + " (错误码 " + _vm._s(_vm.errno) + ")"),
      ]);
    },
    props: {
      errno: Number,
    },
    data() {
      return {
        text: "",
      };
    },
    async created() {
      const globals = await baiduGlobals.get();
      const ctx = await baiduContext.get();
      let message = globals[BAIDU_GLOBALS_KEY.ERROR_MESSAGES][this.errno];
      if (!message) {
        message = `未知错误`;
      } else if (typeof message === "function") {
        message = message(ctx.ctx.userInfo);
      }
      this.text = message.replace(/<\/?.*?>/g, "").replace(/\s+/, " ");
    },
  };
  
  var JixunDuParseEntryFormItems = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        [
          _c("u-form-item", { attrs: { label: "文件名" } }, [
            _c("code", [_vm._v(_vm._s(_vm.data.name))]),
          ]),
          _vm._v(" "),
          _c("u-form-item", { attrs: { label: "文件大小" } }, [
            _c("code", [_vm._v(_vm._s(_vm.readableSize(_vm.data.size)))]),
          ]),
          _vm._v(" "),
          _c("u-form-item", { attrs: { label: "文件 MD5" } }, [
            _c("code", [_vm._v(_vm._s(_vm.data.md5))]),
          ]),
          _vm._v(" "),
          _c("u-form-item", { attrs: { label: "首片 MD5" } }, [
            _c("code", [_vm._v(_vm._s(_vm.data.md5s))]),
          ]),
        ],
        1
      );
    },
    props: {
      data: {
        type: Object,
      },
    },
    methods: {
      readableSize,
    },
  };
  
  var JixunUploadResultTable = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "section",
        { staticClass: "jx-compact-form-items" },
        [
          _c(
            "u-table",
            {
              attrs: {
                data: _vm.data,
                height: _vm.height,
                "row-key": "request_id",
                stripe: true,
                size: "small",
              },
            },
            [
              _c("u-table-column", {
                attrs: { type: "expand" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c(
                          "u-form",
                          { attrs: { "label-position": "left", size: "small" } },
                          [
                            _c("jixun-du-parse-entry-form-items", {
                              attrs: { data: scope.row },
                            }),
                            _vm._v(" "),
                            _c(
                              "u-form-item",
                              { attrs: { label: "上传结果" } },
                              [
                                _c("jixun-baidu-error", {
                                  attrs: { errno: scope.row.errno },
                                }),
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c("u-form-item", { attrs: { label: "提取码" } }, [
                              _c("pre", [_vm._v(_vm._s(_vm.toCode(scope.row)))]),
                            ]),
                          ],
                          1
                        ),
                      ];
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("u-table-column", {
                attrs: { prop: "name", label: "文件名" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [_c("code", [_vm._v(_vm._s(scope.row.name))])];
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("u-table-column", {
                attrs: { prop: "result", label: "结果", width: "80" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c(
                          "u-tag",
                          {
                            attrs: { type: scope.row.resultType, effect: "dark" },
                          },
                          [
                            _vm._v(
                              "\n          " +
                                _vm._s(scope.row.result) +
                                "\n        "
                            ),
                          ]
                        ),
                      ];
                    },
                  },
                ]),
              }),
            ],
            1
          ),
        ],
        1
      );
    },
    components: { JixunBaiduError, JixunDuParseEntryFormItems },
    props: {
      data: {
        type: [],
        required: true,
      },
    },
    methods: {
      readableSize,
      toCode(entry) {
        const { name, size, md5, md5s } = entry;
        return `${md5}#${md5s}#${size}#${name}`;
      },
    },
  };
  
  var JixunCodeUploadDialog = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "nd-dialog-common" },
        [
          _vm.showForm
            ? _c(
                "u-dialog",
                {
                  staticClass: "u-dialog__wrapper nd-dialog-common-header",
                  attrs: {
                    title: "标准提取码",
                    width: "600px",
                    lockScroll: false,
                    visible: true,
                  },
                  on: { "update:visible": _vm.updateVisible },
                },
                [
                  _c(
                    "div",
                    { staticClass: "jx-dialog" },
                    [
                      _c("section", [
                        _c(
                          "label",
                          [
                            _c("span", [_vm._v("秒传链接，一行一个：")]),
                            _vm._v(" "),
                            _c("u-input", {
                              attrs: {
                                type: "textarea",
                                rows: 5,
                                placeholder: "请输入内容",
                              },
                              on: { input: _vm.validateLinks },
                              model: {
                                value: _vm.links,
                                callback: function ($v) {
                                  _vm.links = $v;
                                },
                                expression: "links",
                              },
                            }),
                          ],
                          1
                        ),
                      ]),
                      _vm._v(" "),
                      _c(
                        "p",
                        [
                          _c("span", [_vm._v("文件重复时：")]),
                          _vm._v(" "),
                          _c(
                            "u-radio-group",
                            {
                              attrs: { size: "small" },
                              model: {
                                value: _vm.ondup,
                                callback: function ($v) {
                                  _vm.ondup = $v;
                                },
                                expression: "ondup",
                              },
                            },
                            [
                              _c(
                                "u-radio-button",
                                {
                                  attrs: {
                                    label: _vm.RAPID_UPLOAD_REPLACE.DUPLICATE,
                                  },
                                },
                                [_vm._v("\n            建立副本\n          ")]
                              ),
                              _vm._v(" "),
                              _c(
                                "u-radio-button",
                                {
                                  attrs: {
                                    label: _vm.RAPID_UPLOAD_REPLACE.REPLACE,
                                  },
                                },
                                [_vm._v("\n            覆盖文件\n          ")]
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("jixun-du-parse-table", {
                        attrs: { data: _vm.previewResults, height: 180 },
                      }),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "jx-align-right",
                      attrs: { slot: "footer" },
                      slot: "footer",
                    },
                    [
                      _c(
                        "jixun-button",
                        {
                          on: {
                            click: function ($event) {
                              return _vm.updateVisible(false);
                            },
                          },
                        },
                        [_vm._v("取消")]
                      ),
                      _vm._v(" "),
                      _c(
                        "jixun-button",
                        {
                          attrs: {
                            primary: "",
                            disabled: _vm.previewResults.length === 0,
                          },
                          on: { click: _vm.handleAddURL },
                        },
                        [_vm._v("\n        确定\n      ")]
                      ),
                    ],
                    1
                  ),
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.showProgress
            ? _c(
                "u-dialog",
                {
                  staticClass: "u-dialog__wrapper nd-dialog-common-header",
                  attrs: {
                    title:
                      "标准提取码 - " +
                      (_vm.rapidUploadFinished ? "完成" : "进行中"),
                    width: "600px",
                    lockScroll: false,
                    visible: true,
                    "show-close": _vm.rapidUploadFinished,
                    "close-on-click-modal": _vm.rapidUploadFinished,
                    "close-on-press-escape": _vm.rapidUploadFinished,
                  },
                  on: { "update:visible": _vm.updateVisible },
                },
                [
                  _c(
                    "div",
                    { staticClass: "jx-dialog" },
                    [
                      _c("u-progress", {
                        attrs: { percentage: _vm.progress, status: "success" },
                      }),
                      _vm._v(" "),
                      _c("jixun-upload-result-table", {
                        attrs: { data: _vm.uploadResults, height: 180 },
                      }),
                    ],
                    1
                  ),
                ]
              )
            : _vm._e(),
        ],
        1
      );
    },
    components: { JixunUploadResultTable },
    data() {
      return {
        RAPID_UPLOAD_REPLACE,
        showForm: true,
        showProgress: false,
        parser: new DuParser(),
        ondup: RAPID_UPLOAD_REPLACE.DUPLICATE,
        radioOverwrite: 1111,
        links: "",
        previewResults: [],
        parsedLinks: [],
        uploadResults: [],
      };
    },
    computed: {
      progress() {
        if (this.rapidUploadFinished) {
          return 100;
        }
        return (this.uploadResults.length / this.parsedLinks.length) * 100;
      },
      rapidUploadFinished() {
        return this.uploadResults.length === this.parsedLinks.length;
      },
    },
    methods: {
      updateVisible(visible) {
        if (!visible) {
          this.$emit("hide");
        }
      },
      handleAddURL() {
        const results = this.parseLinks();
        if (results.length > 0) {
          this.showForm = false;
          this.resetProgress(results);
          this.showProgress = true;
          this.beginUpload();
        }
      },
      resetProgress(parsedLinks) {
        this.uploadResults = [];
        this.parsedLinks = parsedLinks;
      },
      beginUpload() {
        bus.emit(
          EVENTS.ADD_RAPID_UPLOAD_TASKS,
          this.parsedLinks,
          this.ondup,
          this.updateProgress
        );
      },
      updateProgress(entry, resp) {
        const success = resp.errno === 0;
        this.uploadResults.unshift({
          ...entry,
          ...resp,
          result: success ? "成功" : "失败",
          resultType: success ? "success" : "danger",
        });
      },
      validateLinks() {
        this.previewResults = this.parseLinks();
      },
      parseLinks() {
        this.parser.parse(this.links);
        return this.parser.results;
      },
    },
  };
  
  var JixunCodeUploadContainer = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.showCodeUploadDialog
        ? _c("jixun-code-upload-dialog", {
            on: {
              hide: function ($event) {
                _vm.showCodeUploadDialog = false;
              },
            },
          })
        : _vm._e();
    },
    components: { JixunCodeUploadDialog },
    beforeDestroy: function () {
      bus.off(EVENTS.SHOW_CODE_UPLOAD_DIALOG, this.renderCodeUploadDialog);
    },
    mounted: function () {
      bus.on(EVENTS.SHOW_CODE_UPLOAD_DIALOG, this.renderCodeUploadDialog);
    },
    data: function () {
      return {
        showCodeUploadDialog: false,
      };
    },
    methods: {
      renderCodeUploadDialog: function () {
        this.showCodeUploadDialog = true;
      },
    },
  };
  
  var JixunDuParseTable = {
    render: function () {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "section",
        { staticClass: "jx-compact-form-items" },
        [
          _c(
            "u-table",
            {
              attrs: {
                data: _vm.data,
                height: _vm.height,
                stripe: true,
                size: "small",
              },
            },
            [
              _c("u-table-column", {
                attrs: { type: "expand" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c(
                          "u-form",
                          { attrs: { "label-position": "left", size: "small" } },
                          [
                            _c("jixun-du-parse-entry-form-items", {
                              attrs: { data: scope.row },
                            }),
                          ],
                          1
                        ),
                      ];
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("u-table-column", {
                attrs: { prop: "name", label: "文件名" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [_c("code", [_vm._v(_vm._s(scope.row.name))])];
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c("u-table-column", {
                attrs: { prop: "size", label: "大小", width: "110" },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function (scope) {
                      return [
                        _c("code", [
                          _vm._v(_vm._s(_vm.readableSize(scope.row.size))),
                        ]),
                      ];
                    },
                  },
                ]),
              }),
            ],
            1
          ),
        ],
        1
      );
    },
    components: { JixunDuParseEntryFormItems },
    props: {
      data: {
        type: Array,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    methods: {
      readableSize,
    },
  };
  
  /**
   * Register available components.
   * @param Vue
   * @param require
   */
  function registerComponents(Vue, require) {
    Vue.component("JixunButton", JixunButton);
    Vue.component("JixunCodeUploadButton", JixunCodeUploadButton);
    Vue.component("JixunCodeUploadContainer", JixunCodeUploadContainer);
    Vue.component("JixunCodeUploadDialog", JixunCodeUploadDialog);
    Vue.component("JixunDuParseTable", JixunDuParseTable);
  }
  
  function hookModuleDefaultExport(moduleId, hookMethod) {
    waitModuleLoad.call(moduleId, (module, require) => {
      const originalExports = module[WEBPACK_MODULE_KEYS.EXPORTS];
      const originalDefaultExport = originalExports[__default];
      const newExports = {};
      module[WEBPACK_MODULE_KEYS.EXPORTS] = newExports;
      const hookedDefaultExport = hookMethod(originalDefaultExport);
      require[WEBPACK_REQUIRE_KEYS.EXPORT_ES6_MEMBER](
        newExports,
        __default,
        () => hookedDefaultExport
      );
    });
  }
  
  const byKey = (key) => (item) => {
    return key === item.key;
  };
  function hookMakeClass(callback) {
    hookModuleDefaultExport(
      WEBPACK_MODULE_ID.PolyfillMakeClass,
      (makeClass) => (ctr, p, s) => {
        return callback(makeClass, ctr, p, s);
      }
    );
  }
  
  waitModuleLoad.call(WEBPACK_MODULE_ID.Vue, (module, require) => {
    debug("Vue loaded");
    const Vue$1 = module[WEBPACK_MODULE_KEYS.EXPORTS].default;
    Object.defineProperty(Vue$1.config, "devtools", {
      get() {
        return true;
      },
      set() {},
    });
    Vue.setValue(Vue$1);
    registerComponents(Vue$1);
  });
  hookModuleDefaultExport(
    WEBPACK_MODULE_ID.RegisterComponent,
    (originalRegisterComponent) => {
      debug("RegisterComponent hooked");
      return hookComponentInit(originalRegisterComponent);
    }
  );
  waitModuleLoad.call(WEBPACK_MODULE_ID.Globals, (module, require) => {
    const globals = module[WEBPACK_MODULE_KEYS.EXPORTS];
    baiduGlobals.setValue(globals);
    debug("baiduGlobals init ok", globals);
  });
  hookMakeClass((makeClass, ctr, p, s) => {
    if (Array.isArray(p)) {
      try {
        if (p.some(byKey("_sendFileInChunkStyle"))) {
          const getInstanceMethod = s.find(byKey("getInstance"));
          const getInstance = getInstanceMethod.value;
          getInstanceMethod.value = (ctx) => {
            debug("baiduContext init ok", ctx);
            baiduContext.setValue(ctx);
            return getInstance(ctx);
          };
          debug("class hooked w/ _sendFileInChunkStyle");
        }
      } catch (err) {
        console.error("hook make class failed", err);
      }
    }
    return makeClass(ctr, p, s);
  });
  (window.webpackJsonp = window.webpackJsonp || []).push([
    [
      /* 新百度网盘 */
    ],
    {
      [ENTRY_ID]: function (module, exports, require) {
        debug("Entry loaded");
        setWebpackRequire(require);
      },
    },
    [[ENTRY_ID, CHUNK_EARLY_HOOK]],
  ]);
  
  // eslint-disable-next-line no-unused-vars
  function styleInject(css) {
    function addStyle(cssText) {
      const style = document.createElement("style");
      style.textContent = cssText;
      document.head.appendChild(style);
    }
  
    if (document.head) {
      addStyle(css);
    } else if (styleInject.pending) {
      styleInject.pending.push(css);
    } else {
      const injectPendingCSS = () => {
        styleInject.pending.forEach(addStyle);
        styleInject.pending = undefined;
        window.removeEventListener("DOMContentLoaded", injectPendingCSS);
      };
  
      styleInject.pending = [css];
      window.addEventListener("DOMContentLoaded", injectPendingCSS);
    }
  }
  
}
const isGm = (typeof unsafeWindow !== 'undefined') && (unsafeWindow !== window);
if (isGm) {
  const INFO = '[仓库助手]';

  console.info('%s 以 GreaseMonkey 兼容模式执行。该脚本管理器所遇到的问题不能保证能够修复。', INFO);
  unsafeWindow.eval(`;(${entryPoint})();`);
} else {
  entryPoint();
}
