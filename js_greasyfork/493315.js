// ==UserScript==
// @name         jingjia_grab_phone
// @namespace    npm/vite-plugin-monkey
// @version      v1.0.1
// @author       monkey
// @description  竞价建档
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://tongji66.com/linkadmin*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.10/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      data:application/javascript,console.log(%22jQuery%22%2CjQuery)%2Cwindow.jQuery%3DjQuery%3B
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.full.min.js
// @resource     ElementPlus  https://cdn.jsdelivr.net/npm/element-plus@2.4.3/dist/index.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/493315/jingjia_grab_phone.user.js
// @updateURL https://update.greasyfork.org/scripts/493315/jingjia_grab_phone.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .px-btn[data-v-1ed48cd9]{position:fixed;bottom:100px;right:100px;z-index:3} ");

(function (vue, dayjs, $, ElementPlus) {
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
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const parseHtmlTable = (str) => {
    let root = $(str);
    let table = root.find("table");
    let headers = table.find("thead th");
    let keys = [];
    for (let header of headers) {
      keys.push($.trim(header.innerText));
    }
    let bodyRows = table.find("tbody tr");
    let result = [];
    for (let row of bodyRows) {
      let rowData = $(row).find("td");
      let o = {};
      rowData.each((index, item) => {
        var _a;
        (_a = $(item).find("input")) == null ? void 0 : _a.each(function() {
          if (this.name && this.value) {
            o[`name-${this.name}`] = this.value;
          }
          $.each(this.attributes, function() {
            if (this.specified)
              o[this.name] = this.value;
          });
        });
        let key = keys[index];
        if (!key) {
          return;
        }
        o[key] = $.trim(item.innerText);
      });
      if (Object.keys(o).length)
        result.push(o);
    }
    return result;
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "block" };
  const _hoisted_2 = { key: 0 };
  const _hoisted_3 = {
    key: 0,
    class: "result-row"
  };
  const _hoisted_4 = {
    key: 1,
    class: "result-row"
  };
  const _hoisted_5 = {
    key: 2,
    class: "result-row"
  };
  const _hoisted_6 = {
    key: 3,
    class: "result-row"
  };
  const _hoisted_7 = { class: "dialog-footer" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const isRunning = vue.ref(false);
      const dialogVisible = vue.ref(false);
      const isLoading = vue.ref(false);
      const startAuto = vue.ref(false);
      const preRunTime = vue.ref("");
      const totalCount = vue.ref(0);
      const successCount = vue.ref(0);
      const repeatCount = vue.ref(0);
      const errorCount = vue.ref(0);
      const me = vue.ref(null);
      const DEFAULT_BD_OBJ = {
        CustName: "22024",
        CreatedBy: "7001",
        TmpCustRegType: "793B803DF6E54BC1BA45ADF30103A32E",
        MediaSourceType: "BDEF9B34C2A4417184362CE1671F25DE",
        MediaSource: "5E563682BB4B4051B3805A69199A2C28"
      };
      const nextRunTime = vue.computed(() => {
        if (!preRunTime.value)
          return "-";
        return dayjs(preRunTime.value).add(60 * 5 + 10, "second").format("YYYY-MM-DD HH:mm:ss");
      });
      const handleRequestUrl = (page) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
        myHeaders.append("Accept-Language", "zh-CN,zh;q=0.9");
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("DNT", "1");
        myHeaders.append("Referer", "https://tongji66.com/linkadmin");
        myHeaders.append("Sec-Fetch-Dest", "iframe");
        myHeaders.append("Sec-Fetch-Mode", "navigate");
        myHeaders.append("Sec-Fetch-Site", "same-origin");
        myHeaders.append("Sec-Fetch-User", "?1");
        myHeaders.append("Upgrade-Insecure-Requests", "1");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
        myHeaders.append("sec-ch-ua", '"Not-A.Brand";v="99", "Chromium";v="124"');
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", '"macOS"');
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        return new Promise((resolve, reject) => {
          fetch(`https://tongji66.com/linkadmin/baidu_ds_tel?page=${page}`, requestOptions).then((response) => response.text()).then((result) => resolve(result)).catch((error) => reject(error));
        });
      };
      const cachePhone = (phone) => {
        _GM_setValue(phone, 1);
      };
      const checkHasCache = (phone) => {
        return _GM_getValue(phone);
      };
      const handleRequestPhoneArchive = (obj) => {
        var formdata = new FormData();
        for (let [key, value] of Object.entries(obj)) {
          formdata.append(key, value);
        }
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
      const makePhoneArchive = async (obj) => {
        try {
          let phone = obj.phone;
          if (checkHasCache(phone)) {
            repeatCount.value++;
            return;
          }
          let response = await handleRequestPhoneArchive(obj);
          switch (response == null ? void 0 : response.type) {
            case 0:
              cachePhone(phone);
              successCount.value++;
              break;
            case 1:
              cachePhone(phone);
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
      const handleDoingBd = async () => {
        totalCount.value += bdList.value.length;
        let fnList = bdList.value.map((item) => () => makePhoneArchive(item));
        await work(fnList, 6);
      };
      const handleRun = async () => {
        if (isRunning.value)
          return;
        init();
        await handleLoadingData();
        try {
          isRunning.value = true;
          if (bdList.value.length > 0) {
            await handleDoingBd();
          }
          preRunTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
        } catch (e) {
          console.log("e", e);
        }
        isRunning.value = false;
      };
      const timer = vue.ref(null);
      const handleStartAuto = async () => {
        startAuto.value = !startAuto.value;
        if (startAuto.value) {
          await handleRun();
          timer.value = setInterval(async () => {
            await handleRun();
          }, 60 * 1e3 * 5);
        } else {
          timer.value && clearInterval(timer.value);
          timer.value = null;
        }
      };
      const bdList = vue.ref([]);
      const handleLoadingBdData = async () => {
        let page = 1;
        let doing = true;
        let result = [];
        while (doing) {
          console.log("page", page);
          let res = await handleRequestUrl(page);
          let table = parseHtmlTable(res);
          if (!table.length) {
            doing = false;
            continue;
          }
          for (let i = 0; i < table.length; i++) {
            let item = table[i];
            let obj = { ...DEFAULT_BD_OBJ };
            let phone = /1[3-9]\d{9}/.exec(item["电话/归属地"]);
            phone = (phone == null ? void 0 : phone[0]) || "";
            console.log("phone", phone);
            if (!phone)
              continue;
            obj.phone = phone;
            result.push(obj);
          }
          page++;
        }
        bdList.value = result;
        return result;
      };
      const handleLoadingData = async () => {
        isLoading.value = true;
        await handleLoadingBdData();
        isLoading.value = false;
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_divider = vue.resolveComponent("el-divider");
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
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogVisible.value = $event),
            title: "给历史数据建档",
            width: "70%",
            "destroy-on-close": "",
            modal: false,
            "before-close": handleClose,
            ref_key: "me",
            ref: me,
            draggable: ""
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("span", _hoisted_7, [
                vue.createVNode(_component_el_button, {
                  loading: isRunning.value,
                  onClick: handleRun
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 单次执行 ")
                  ]),
                  _: 1
                }, 8, ["loading"]),
                vue.createVNode(_component_el_button, {
                  type: "primary",
                  onClick: handleStartAuto,
                  loading: isRunning.value
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(isRunning.value ? "正在运行." : startAuto.value ? `等待运行.点击停止` : "开始自动"), 1)
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ]),
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
                vue.createElementVNode("div", null, " 上次运行时间: " + vue.toDisplayString(preRunTime.value), 1),
                vue.createElementVNode("div", null, " 预计下次运行时间: " + vue.toDisplayString(nextRunTime.value), 1),
                bdList.value.length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, " 百度线索: " + vue.toDisplayString(bdList.value.length) + "条 ", 1)) : vue.createCommentVNode("", true)
              ])), [
                [_directive_loading, isLoading.value]
              ]),
              vue.createVNode(_component_el_divider),
              totalCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3, " 总线索数: " + vue.toDisplayString(totalCount.value), 1)) : vue.createCommentVNode("", true),
              successCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, " 建档成功: " + vue.toDisplayString(successCount.value), 1)) : vue.createCommentVNode("", true),
              repeatCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, " 建档重复: " + vue.toDisplayString(repeatCount.value), 1)) : vue.createCommentVNode("", true),
              errorCount.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, " 建档失败: " + vue.toDisplayString(errorCount.value), 1)) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1ed48cd9"]]);
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

})(Vue, dayjs, jQuery, ElementPlus);