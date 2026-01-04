// ==UserScript==
// @name         太极助手
// @namespace    npm/vite-plugin-monkey
// @version      1.0.1
// @author       taichi
// @description  基于用户自定义规则执行指定网页操作任务，可使用第三方规则
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAADZQTFRFR3BMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwEdi1QAAABF0Uk5TABEfMT9DWGRwgJGfscbX5vMMJIWWAAAA20lEQVR42n3T2w6EIAwE0EEU5FLY+f+f3bgQDEr3vJjQZlJKxMS4mAurpLBjwWfeanKYOeFDmsIz32Qb9a1wJaPbqfDrupy7F16K+dU/nBRcwh0hj7oBxnEEcCq3SyQpgCmcRTSRFyBod8s9Qfh04nL0OMs3hxHsELhQpY6Bhf8YoPCPA0ClzgEAh+D3zexnEjbZALgTxGKw7nS2lceQAZo0HlAReLFQ2Xu5Ntbs8VLJCoxnT6shYutUxj362cYm4ym2Bqs2mJJ+H6obcWxJ+kb6v+zlUxKWor6nLwYtIxUkRE8IAAAAAElFTkSuQmCC
// @match        *://*.asklib.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.4.21/vue.global.prod.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.6/index.iife.js
// @require      https://cdn.bootcdn.net/ajax/libs/layx/2.5.4/layx.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.6.2/index.full.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @resource     ElementPlus            https://cdn.bootcdn.net/ajax/libs/element-plus/2.6.2/index.min.css
// @resource     vue-layx/src/layx.css  https://cdn.bootcdn.net/ajax/libs/layx/2.5.4/layx.min.css
// @connect      127.0.0.1
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491150/%E5%A4%AA%E6%9E%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491150/%E5%A4%AA%E6%9E%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(" *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.static{position:static}.mt-5{margin-top:1.25rem}.inline{display:inline}.border{border-width:1px}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.demo-tabs>.el-tabs__content[data-v-fcce9659]{padding:32px;color:#6b778c;font-size:32px;font-weight:600}.demo-tabs .custom-tabs-label .el-icon[data-v-fcce9659]{vertical-align:middle}.demo-tabs .custom-tabs-label span[data-v-fcce9659]{vertical-align:middle;margin-left:4px} ");

(function (vue, layx, $, ElementPlus) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  class Layx {
    /**
     * 弹出一个html
     * @param id 弹窗id
     * @param title 标题
     * @param content 内容
     * @param options 选项
     */
    static html(id, title, content, options) {
      let configs = Object.assign({}, this.defaultOptions, options);
      layx.html(id, title, content, configs);
    }
  }
  __publicField(Layx, "defaultOptions", {
    position: "rb",
    width: 500,
    height: 600,
    borderRadius: "5px",
    skin: "default",
    storeStatus: false,
    opacity: 1,
    // readonly: true,
    stickMenu: true,
    maxMenu: false,
    event: {
      // 加载事件
      onload: {
        //@ts-ignore
        before: function(layxWindow, winform) {
          console.log(layxWindow, winform);
        },
        //@ts-ignore
        after: function(layxWindow, winform) {
          console.log("layx加载完成");
          console.log(layxWindow, winform);
        }
      }
    }
    //style: "#layx_div{background-color:#F5F7FA;color:#000;height:100%;width:100%;overflow:auto;}#layx_msg{background-color:#fff;padding:10px;border-bottom:1px solid #ccc;border-radius:5px;margin:10px;}#layx_log{height:60%;padding:10px;color:#A8A8B3;}#layx_content{height:10%;}.layx_success{color:green;font-weight:bold;}.layx_error{color:#F56C6C;font-weight:bold;}.layx_info{color:#909399;font-weight:bold;}.layx_notice{color:#E6A23C;font-weight:bold;}.layx_status_msg{color:green;font-weight:bold;}h2{text-align:center;}"
  });
  const prefix = "TaiChi_";
  class Cache {
    /**
     * 封装缓存
     * @param key 缓存key
     * @param value 缓存值
     * @param expire 过期时间
     * 
     * @returns 缓存值
     */
    static set(key, value, expire = 0) {
      key = prefix + key;
      if (expire > 0) {
        _GM_setValue(key, {
          value,
          expire: (/* @__PURE__ */ new Date()).getTime() + expire * 1e3
        });
      } else {
        _GM_setValue(key, {
          value,
          expire: 0
        });
      }
      return _GM_getValue(key);
    }
    /**
     * 获取缓存
     * @param key 缓存key
     * 
     * @returns 缓存值
     */
    static get(key, defaultVal = null) {
      key = prefix + key;
      let cache = _GM_getValue(key);
      if (cache && cache.expire > 0 && cache.expire < (/* @__PURE__ */ new Date()).getTime()) {
        _GM_setValue(key, null);
        return defaultVal;
      }
      return cache ? cache.value : defaultVal;
    }
  }
  const appConfigKey = "TaiChi_appConfig";
  const def = {
    thtoken: "",
    uid: "",
    host: location.host,
    rules: [],
    api: [
      {
        url: "http://127.0.0.1:9966/",
        header: {}
      },
      {
        url: "http://127.0.0.1:9966/",
        header: {}
      }
    ]
  };
  function getConfig() {
    var _a;
    let config2 = ((_a = Cache.get(appConfigKey)) == null ? void 0 : _a.value) || def;
    config2 = Object.assign(config2, {
      script: _GM_info.script
    });
    return config2;
  }
  const config$1 = getConfig();
  function commonRequest(url, method, data, headers) {
    if (method === "GET") {
      let params = [];
      for (let key in data) {
        params.push(key + "=" + data[key]);
      }
      url = url + "?" + params.join("&");
      data = null;
    }
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method,
        url,
        data,
        headers,
        onload: function(response) {
          resolve(response);
        },
        onerror: function(response) {
          reject(response);
        }
      });
    });
  }
  async function request(url, method, data, headers) {
    let apis = config$1.api;
    for (let i = 0; i < apis.length; i++) {
      let api = apis[i].url + url;
      let header = apis[i].header;
      header = Object.assign(header, headers);
      let res = await commonRequest(api, method, data, header).catch((err) => {
        console.error(err);
        return false;
      });
      if (res && res.status === 200) {
        return JSON.parse(res.responseText);
      }
    }
    return false;
  }
  function getRuleList() {
    let url = "app/taichi/api/v1/getRuleList";
    return request(url, "GET", {}, {});
  }
  function getRuleCode(id) {
    let url = "app/taichi/api/v1/getRuleCode";
    return request(url, "GET", { id }, {});
  }
  async function saveRule(id) {
    let ruleList = Cache.get("ruleList", []);
    let rule = await getRuleCode(id);
    if (rule.code === 200) {
      let index = ruleList.findIndex((item) => item.id === id);
      if (index !== -1) {
        ruleList[index] = rule.data;
      } else {
        ruleList.push(rule.data);
      }
      Cache.set("ruleList", ruleList);
      return true;
    } else {
      return false;
    }
  }
  async function deleteRule(id) {
    let ruleList = Cache.get("ruleList", []);
    let index = ruleList.findIndex((item) => item.id === id);
    if (index !== -1) {
      ruleList.splice(index, 1);
      Cache.set("ruleList", ruleList);
    }
  }
  async function matchRule() {
    let url = location.href;
    let ruleList = Cache.get("ruleList", []);
    let matchRuleList = ruleList.filter((item) => {
      let match = JSON.parse(item.match);
      for (let i = 0; i < match.length; i++) {
        console.log(match[i]);
        let reg = new RegExp(match[i].replace(/\./g, "\\.").replace(/\*/g, ".*"));
        if (reg.test(url)) {
          return true;
        }
      }
    });
    return matchRuleList;
  }
  class Lowcode {
    /**
     * 生成随机ip
     */
    static randomIp() {
      return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");
    }
    /**
     * 判断href是否包含指定字符串
     */
    static isContainHref(str) {
      return location.href.indexOf(str) != -1;
    }
    /**
     * 封装请求
     */
    static async req(url, method, data, headers) {
      let res = await commonRequest(url, method, data, headers).then((res2) => {
        return res2;
      });
      return res;
    }
    /**
     * 解析规则
     */
    //@ts-ignore
    static async parseRule(data, value) {
      let key = data[0];
      if (Array.isArray(key)) {
        data.forEach(async (item) => {
          console.log("array", item);
          await this.parseRule(item);
        });
      } else {
        console.log(key);
        switch (key) {
          case "urlmatch":
            let urlMatch = data[1];
            let urlMatchAction = data[2];
            if (location.href.indexOf(urlMatch) != -1) {
              console.log("匹配成功");
              console.log(urlMatchAction);
              await this.parseRule(urlMatchAction);
            }
            break;
          case "jqFind":
            let jqFindItem = $(await this.parseRule(data[1])).find(await this.parseRule(data[2]))[await this.parseRule(data[3])]();
            console.log("jqFind", data[1], data[2], jqFindItem);
            await this.parseRule(data[4], jqFindItem);
            break;
          case "jqSet":
            console.log("jsset", $(await this.parseRule(data[1]))[await this.parseRule(data[2])]());
            console.log("jsset", await this.parseRule(data[3]));
            $(await this.parseRule(data[1]))[await this.parseRule(data[2])](await this.parseRule(data[3]));
            break;
          case "function":
            let functionName = data[1];
            console.log("fffff", functionName);
            let parm = [];
            for (let i = 0; i < data[2].length; i++) {
              parm.push(await this.parseRule(data[2][i]));
            }
            let ret = data[3];
            let functionRes = null;
            if (parm.length == 0) {
              functionRes = this[functionName]();
            } else if (parm.length == 1) {
              functionRes = this[functionName](parm[0]);
            } else if (parm.length == 2) {
              functionRes = this[functionName](parm[0], parm[1]);
            } else if (parm.length == 3) {
              functionRes = this[functionName](parm[0], parm[1], parm[2]);
            } else if (parm.length == 4) {
              functionRes = this[functionName](parm[0], parm[1], parm[2], parm[3]);
            } else {
              console.error("参数过多");
            }
            console.log(functionRes);
            if (ret == "return") {
              return functionRes;
            }
            break;
          case "req":
            let reqUrl = await this.parseRule(data[1]);
            let reqMethod = await this.parseRule(data[2]);
            let reqData = await this.parseRule(data[3]);
            let headers = await this.parseRule(data[4]);
            await this.req(reqUrl, reqMethod, reqData, headers).then(async (res2) => {
              console.log("res11", res2, data[5]);
              await this.parseRule(data[5], res2);
            });
            break;
          case "Setwin":
            console.log(data, value);
            let setWin = data[1];
            let setWinSz = setWin.split(".");
            let setWinObj = window;
            for (let i = 0; i < setWinSz.length; i++) {
              if (i == setWinSz.length - 1) {
                setWinObj[setWinSz[i]] = value;
                console.log("setWinObj", setWinSz[i], setWinObj, value);
              } else {
                if (setWinObj[setWinSz[i]] == void 0) {
                  setWinObj[setWinSz[i]] = {};
                }
                setWinObj = setWinObj[setWinSz[i]];
              }
            }
            if (data[2]) {
              await this.parseRule(data[2]);
            }
            break;
          case "Getwin":
            let getWin = data[1];
            let getWinSz = getWin.split(".");
            let getWinObj = window;
            for (let i = 0; i < getWinSz.length; i++) {
              if (i == getWinSz.length - 1) {
                return getWinObj[getWinSz[i]];
              } else {
                if (getWinObj[getWinSz[i]] == void 0) {
                  getWinObj[getWinSz[i]] = {};
                }
                getWinObj = getWinObj[getWinSz[i]];
              }
            }
            break;
          case "str":
            return data[1];
          case "json":
            let sz = {};
            for (let i = 0; i < data[1].length; i++) {
              sz[data[1][i][0]] = await this.parseRule(data[1][i][1]);
            }
            return sz;
        }
      }
    }
    /**
     * 根据href匹配规则，并按顺序执行
     */
    static async matchRuleRun() {
      let ruleList = await matchRule();
      console.log(ruleList);
      for (let i = 0; i < ruleList.length; i++) {
        let rule = ruleList[i];
        console.log(rule.code);
        let code = JSON.parse(rule.code);
        console.log(code);
        await this.parseRule(code);
      }
    }
  }
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("vue-layx/src/layx.css");
  cssLoader("ElementPlus");
  const _hoisted_1 = ["innerHTML"];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "Rule",
    setup(__props) {
      const host = location.host;
      const localRule = vue.ref([]);
      const ruleList = vue.ref([]);
      const ruleDetail = vue.ref({
        id: 0,
        name: "",
        description: "",
        author: "",
        updated_at: ""
      });
      const selectedRuleId = vue.ref(null);
      const loadLocalRules = async () => {
        const res = await matchRule();
        localRule.value = res;
      };
      loadLocalRules();
      const getRules = async () => {
        const { data } = await getRuleList();
        ruleList.value = data;
      };
      const downloadAndUseRule = async () => {
        if (!selectedRuleId.value)
          return;
        try {
          await saveRule(selectedRuleId.value);
          showNotification("Success", "规则下载成功", "success");
          await loadLocalRules();
        } catch (error) {
          showNotification("Error", "规则下载失败", "error");
        }
      };
      const deleteRuleById = async (id) => {
        await deleteRule(id);
        await loadLocalRules();
        showNotification("Success", "规则删除成功", "success");
      };
      vue.watch(selectedRuleId, (newVal) => {
        ruleDetail.value = ruleList.value.find((item) => item.id === newVal) || {
          id: 0,
          name: "",
          description: "",
          author: "",
          updated_at: ""
        };
      });
      const showNotification = (title, message, type) => {
        ElementPlus.ElNotification({
          //@ts-ignore
          "title": title,
          "message": message,
          "type": type
        });
      };
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_empty = vue.resolveComponent("el-empty");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_card = vue.resolveComponent("el-card");
        const _component_el_row = vue.resolveComponent("el-row");
        return vue.openBlock(), vue.createBlock(_component_el_row, null, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_el_col, { span: 24 }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_card, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_form, { inline: true }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form_item, { label: "当前域名" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: vue.unref(host),
                              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(host) ? host.value = $event : null),
                              disabled: ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, null, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_button, {
                              type: "primary",
                              onClick: getRules
                            }, {
                              default: vue.withCtx(() => [
                                vue.createTextVNode("获取云端规则")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_form_item, { label: "本地规则" }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_table, {
                          data: localRule.value,
                          "empty-text": "暂无已加载规则",
                          border: ""
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_table_column, {
                              prop: "author",
                              label: "作者"
                            }),
                            vue.createVNode(_component_el_table_column, {
                              prop: "name",
                              label: "脚本名称"
                            }),
                            vue.createVNode(_component_el_table_column, { label: "操作" }, {
                              default: vue.withCtx((scope) => [
                                vue.createVNode(_component_el_button, {
                                  size: "small",
                                  type: "danger",
                                  onClick: () => deleteRuleById(scope.row.id)
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("删除")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["data"])
                      ]),
                      _: 1
                    }),
                    !ruleList.value.length ? (vue.openBlock(), vue.createBlock(_component_el_empty, {
                      key: 0,
                      description: "暂无规则"
                    })) : (vue.openBlock(), vue.createBlock(_component_el_form, {
                      key: 1,
                      inline: true
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form_item, { label: "规则列表" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_select, {
                              modelValue: selectedRuleId.value,
                              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedRuleId.value = $event),
                              placeholder: "请选择规则",
                              "no-data-text": "暂无数据",
                              style: { "min-width": "200px" }
                            }, {
                              default: vue.withCtx(() => [
                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(ruleList.value, (item) => {
                                  return vue.openBlock(), vue.createBlock(_component_el_option, {
                                    key: item.id,
                                    label: `[${item.author}]${item.name}`,
                                    value: item.id
                                  }, null, 8, ["label", "value"]);
                                }), 128))
                              ]),
                              _: 1
                            }, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, null, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("button", {
                              type: "button",
                              class: "el-button el-button--text",
                              onClick: downloadAndUseRule
                            }, "下载并启用")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })),
                    selectedRuleId.value ? (vue.openBlock(), vue.createBlock(_component_el_col, { key: 2 }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_form_item, { label: "名称" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: ruleDetail.value.name,
                              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => ruleDetail.value.name = $event),
                              disabled: ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, { label: "作者" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_input, {
                              modelValue: ruleDetail.value.author,
                              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => ruleDetail.value.author = $event),
                              disabled: ""
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        }),
                        vue.createVNode(_component_el_form_item, { label: "描述" }, {
                          default: vue.withCtx(() => [
                            vue.createElementVNode("div", {
                              innerHTML: ruleDetail.value.description
                            }, null, 8, _hoisted_1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  });
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Main",
    setup(__props) {
      const activeName = vue.ref("first");
      const handleClick = (tab, event) => {
        console.log(tab, event);
      };
      return (_ctx, _cache) => {
        const _component_el_tab_pane = vue.resolveComponent("el-tab-pane");
        const _component_el_tabs = vue.resolveComponent("el-tabs");
        return vue.openBlock(), vue.createBlock(_component_el_tabs, {
          modelValue: activeName.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => activeName.value = $event),
          type: "card",
          class: "demo-tabs mt-5",
          onTabClick: handleClick
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_el_tab_pane, {
              label: "页面规则",
              name: "first"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_sfc_main$2)
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_tab_pane, {
              label: "运行状态",
              name: "second"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("运行状态")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_tab_pane, {
              label: "页面配置",
              name: "third"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("页面配置")
              ]),
              _: 1
            }),
            vue.createVNode(_component_el_tab_pane, {
              label: "关于我们",
              name: "fourth"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("关于我们")
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]);
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
  const Main = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-fcce9659"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Main);
      };
    }
  });
  var config = getConfig();
  _GM_registerMenuCommand(`获取当前页云端规则`, () => {
    console.log("获取当前页云端规则");
  });
  console.log("脚本加载");
  _unsafeWindow.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM 完全加载和解析");
  });
  _unsafeWindow.addEventListener("load", function(event) {
    console.log("页面及所有外部资源已加载完成");
  });
  _unsafeWindow.onload = () => {
    console.log("页面加载完毕");
    init();
  };
  async function init() {
    if (_unsafeWindow == _unsafeWindow.top) {
      Layx.html("str", `太极助手 - ${config.script.version}`, "", {
        icon: `<img src="${config.script.icon}" style="width: 16px;height: 16px;">`,
        event: {
          onload: {
            //@ts-ignore
            after: function(layxWindow, winform) {
              vue.createApp(_sfc_main).use(ElementPlus, { zIndex: 20000001 }).mount(
                (() => {
                  const app = _unsafeWindow.document.createElement("div");
                  app.id = "app";
                  app.style.zIndex = "30000003";
                  const layxHtml = layxWindow.getElementsByClassName("layx-html")[0];
                  layxHtml.innerHTML = "";
                  layxHtml.appendChild(app);
                  return app;
                })()
              );
            }
          }
        }
      });
    }
    console.log(config);
    console.log(location.host);
    Lowcode.matchRuleRun();
  }

})(Vue, layx, $, ElementPlus);