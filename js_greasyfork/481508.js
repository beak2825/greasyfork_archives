// ==UserScript==
// @name         hzdaba_grab_phone
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  历史建档
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://ai.hzdaba.cn/staff*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.10/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.full.min.js
// @resource     ElementPlus  https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/481508/hzdaba_grab_phone.user.js
// @updateURL https://update.greasyfork.org/scripts/481508/hzdaba_grab_phone.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .px-btn[data-v-36e68006]{position:fixed;bottom:100px;right:100px;z-index:3} ");

(function (vue, dayjs, ElementPlus) {
  'use strict';

  const { log } = console;
  const work = async (fnList = [], max = 10, taskName = "default") => {
    const count = fnList.length;
    if (!count)
      return;
    log(`开始执行多个异步任务，最大并发数： ${max}`);
    const startTime = (/* @__PURE__ */ new Date()).getTime();
    const schedule = async (index) => {
      return new Promise(async (resolve) => {
        const fn = fnList[index];
        if (!fn)
          return resolve();
        await fn();
        await schedule(index + max);
        resolve();
      });
    };
    const scheduleList = new Array(max).fill(0).map((_, index) => schedule(index));
    await Promise.all(scheduleList);
    const cost = ((/* @__PURE__ */ new Date()).getTime() - startTime) / 1e3;
    log(`所有数据获取完成，最大并发数： ${max}，耗时：${cost}s`);
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "block" };
  const _hoisted_2 = {
    key: 0,
    class: "result-row"
  };
  const _hoisted_3 = {
    key: 1,
    class: "result-row"
  };
  const _hoisted_4 = {
    key: 2,
    class: "result-row"
  };
  const _hoisted_5 = {
    key: 3,
    class: "result-row"
  };
  const _hoisted_6 = { class: "dialog-footer" };
  const pageSize = 999;
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const isRunning = vue.ref(false);
      const dialogVisible = vue.ref(false);
      const value1 = vue.ref("");
      const totalCount = vue.ref(0);
      const successCount = vue.ref(0);
      const repeatCount = vue.ref(0);
      const errorCount = vue.ref(0);
      const me = vue.ref(null);
      const handleRequestUrl = (data) => {
        var raw = JSON.stringify(data);
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json, text/plain, */*");
        myHeaders.append("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
        myHeaders.append("Cache-Control", "no-cache");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Pragma", "no-cache");
        myHeaders.append("Sec-Fetch-Dest", "empty");
        myHeaders.append("Sec-Fetch-Mode", "cors");
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        return new Promise((resolve, reject) => {
          fetch("https://ai.hzdaba.cn/emp/call-record/page", requestOptions).then((response) => response.text()).then((result) => {
            try {
              result = JSON.parse(result);
            } catch (e) {
            }
            resolve(result);
          }).catch((error) => reject(error));
        });
      };
      const handleRequestPhoneArchive = (phone) => {
        var formdata = new FormData();
        formdata.append("phone", phone);
        var requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };
        return new Promise((resolve, reject) => {
          fetch("https://hm-crm.xahmyk.cn/api/archive/create", requestOptions).then((response) => response.text()).then((result) => {
            try {
              result = JSON.parse(result);
            } catch (e) {
            }
            resolve(result);
          }).catch((error) => reject(error));
        });
      };
      const handleClose = (done) => {
        if (!isRunning.value)
          done();
      };
      const init = () => {
        successCount.value = 0;
        repeatCount.value = 0;
        errorCount.value = 0;
        totalCount.value = 0;
      };
      const handleRequestApi = async (data) => {
        let response = await handleRequestUrl(data);
        if ((response == null ? void 0 : response.code) === 0) {
          return response;
        }
        return {
          msg: "请求错误",
          count: 0,
          data: []
        };
      };
      const makePhoneArchive = async (phone) => {
        try {
          let response = await handleRequestPhoneArchive(phone);
          switch (response == null ? void 0 : response.type) {
            case 0:
              successCount.value++;
              break;
            case 1:
              repeatCount.value++;
              break;
            default:
              errorCount.value++;
              break;
          }
        } catch (e) {
          errorCount.value++;
        }
      };
      const handleDoing = async (params) => {
        let { data, count } = await handleRequestApi(params);
        if (count) {
          if (!totalCount.value)
            totalCount.value = count;
          let fnList = data.filter((item) => {
            return /1[3-9]\d{9}/.test(item["clientName"]);
          }).map((item) => () => makePhoneArchive(item["clientName"]));
          await work(fnList, 6);
          if (count > params.pageNum * pageSize) {
            params.pageNum = params.pageNum + 1;
            await handleDoing(params);
          }
        }
      };
      const handleRun = async () => {
        var _a;
        if (isRunning.value)
          return;
        init();
        let page = 1;
        let params = {
          "pageSize": pageSize,
          "pageNum": page
        };
        if ((_a = value1.value) == null ? void 0 : _a[0]) {
          params["startTime"] = dayjs(value1.value[0]).valueOf();
          params["endTime"] = dayjs(value1.value[1]).endOf("day").valueOf();
        }
        console.log("params", params);
        try {
          isRunning.value = true;
          await handleDoing(params);
        } catch (e) {
          console.log("e", e);
        }
        isRunning.value = false;
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_button, {
            class: "px-btn",
            onClick: _cache[0] || (_cache[0] = ($event) => dialogVisible.value = true)
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 打开批量建档窗口 ")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
            title: "给历史数据建档",
            width: "30%",
            "destroy-on-close": "",
            modal: false,
            "before-close": handleClose,
            ref_key: "me",
            ref: me,
            draggable: ""
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("span", _hoisted_6, [
                vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_button, {
                  type: "primary",
                  onClick: handleRun
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 执行 ")
                  ]),
                  _: 1
                })), [
                  [_directive_loading, isRunning.value]
                ])
              ])
            ]),
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
                vue.createVNode(_component_el_date_picker, {
                  modelValue: value1.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value1.value = $event),
                  type: "daterange",
                  "range-separator": "到",
                  "start-placeholder": "开始时间",
                  "end-placeholder": "结束时间"
                }, null, 8, ["modelValue"])
              ])), [
                [_directive_loading, isRunning.value]
              ]),
              totalCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, " 总线索数: " + vue.toDisplayString(totalCount.value), 1)) : vue.createCommentVNode("", true),
              successCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, " 建档成功: " + vue.toDisplayString(successCount.value), 1)) : vue.createCommentVNode("", true),
              repeatCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, " 建档重复: " + vue.toDisplayString(repeatCount.value), 1)) : vue.createCommentVNode("", true),
              errorCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, " 建档失败: " + vue.toDisplayString(errorCount.value), 1)) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-36e68006"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("ElementPlus");
  const app = vue.createApp(App);
  app.use(ElementPlus);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue, dayjs, ElementPlus);