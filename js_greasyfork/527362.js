// ==UserScript==
// @name       qjjtools
// @namespace  npm/vite-plugin-monkey
// @version    10.0.0
// @icon       https://vitejs.dev/logo.svg
// @match      *://*/*
// @require    https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.18/vue.global.prod.min.js
// @require    data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require    https://cdnjs.cloudflare.com/ajax/libs/naive-ui/2.42.0/index.prod.js
// @require    data:application/javascript,%3Bwindow.naive%3Dnaive%3B
// @grant      GM_addStyle
// @description 在当前页面插入悬浮元素，点击展开窗口并发送请求，将结果展示在表格中并提供Excel下载按钮
// @downloadURL https://update.greasyfork.org/scripts/527362/qjjtools.user.js
// @updateURL https://update.greasyfork.org/scripts/527362/qjjtools.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const d=document.createElement("style");d.textContent=a,document.head.append(d)})(" [data-v-303426f9] .n-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0}[data-v-303426f9] .n-modal-mask{background-color:#0006}[data-v-303426f9] .n-modal-content{border-radius:8px;overflow:hidden}.n-progress[data-v-29be6a47],.n-progress[data-v-8edd34a0]{margin:10px 0}.createrplan-container[data-v-5dbab58c]{padding:24px;max-width:1000px;margin:0 auto;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh}.main-card[data-v-5dbab58c]{background:#fffffff2;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:16px;box-shadow:0 8px 32px #0000001a;border:1px solid rgba(255,255,255,.2)}.main-card[data-v-5dbab58c] .n-card-header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:16px 16px 0 0;padding:20px 24px}.main-card[data-v-5dbab58c] .n-card-content{padding:24px}[data-v-5dbab58c] .n-button{border-radius:12px;font-weight:500;transition:all .3s ease}[data-v-5dbab58c] .n-button:hover{transform:translateY(-2px);box-shadow:0 4px 16px #00000026}[data-v-5dbab58c] .n-input{border-radius:8px}[data-v-5dbab58c] .n-form-item-label{font-weight:500;color:#333}[data-v-5dbab58c] .n-tag{border-radius:20px;font-weight:500}.button-container[data-v-aaaae17f]{padding:20px}@media (max-width: 768px){.button-container[data-v-aaaae17f] .n-space{flex-direction:column!important}.button-container[data-v-aaaae17f] .n-button{width:100%!important;margin:4px 0!important}}.auto-height-card[data-v-aaaae17f],.auto-height-card[data-v-aaaae17f] .n-card__content{flex:1;display:flex;flex-direction:column}.flex-card[data-v-aaaae17f]{flex:2}.default-component[data-v-ff0a68db]{display:flex;justify-content:center;align-items:center;height:100%;padding:20px}.jihua-container[data-v-f7d071d3]{padding:20px;max-width:800px;margin:0 auto}.description[data-v-f7d071d3]{background-color:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px}.description pre[data-v-f7d071d3]{background-color:#fff;padding:8px;border-radius:4px;margin:8px 0;white-space:pre-wrap}.plan-container[data-v-f977d1aa]{padding:20px;max-width:800px;margin:0 auto}.description[data-v-f977d1aa]{background-color:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px}.description pre[data-v-f977d1aa]{background-color:#fff;padding:8px;border-radius:4px;margin:8px 0;white-space:pre-wrap}.button-container[data-v-c6e92986]{padding:20px}.kuaishou-container[data-v-7227acb7]{padding:24px;max-width:1000px;margin:0 auto;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh}.tool-card[data-v-7227acb7]{background:#fffffff2;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:16px;box-shadow:0 8px 32px #0000001a;border:1px solid rgba(255,255,255,.2)}.tool-card[data-v-7227acb7] .n-card-header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:16px 16px 0 0;padding:20px 24px}.tool-card[data-v-7227acb7] .n-card-content{padding:24px}[data-v-7227acb7] .n-button{border-radius:12px;font-weight:500;transition:all .3s ease}[data-v-7227acb7] .n-button:hover{transform:translateY(-2px);box-shadow:0 4px 16px #00000026}[data-v-7227acb7] .n-input{border-radius:8px}[data-v-7227acb7] .n-form-item-label{font-weight:500;color:#333}[data-v-7227acb7] .n-collapse,[data-v-7227acb7] .n-table{border-radius:8px;overflow:hidden} ");

(function (vue, naive) {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-DGUFX1JG.js"(exports, module) {
      class LinkChecker {
        constructor() {
          this.isLoading = false;
          this.tableData = [];
          this.responseData = [];
          this.stats = {
            totalCreativity: 0,
            clickUrlCounts: [],
            expoUrlCounts: []
          };
        }
        // 检查链接的主要方法
        async checkLinks() {
          this.isLoading = true;
          this.clearData();
          try {
            const allData = await this.fetchAllData();
            this.responseData = allData;
            this.tableData = allData;
            this.processStats(allData);
            console.log("读取成功");
            return { success: true, data: allData };
          } catch (error) {
            console.error("请求或处理数据时出错:", error);
            return { success: false, error: error.message };
          } finally {
            this.isLoading = false;
          }
        }
        // 获取所有数据
        async fetchAllData() {
          let maxPageNum = 4;
          let pageNum = 1;
          let totalPage = 1;
          let allData = [];
          do {
            const headers = this.getHeaders();
            const response = await fetch(
              `https://ad.xiaohongshu.com/api/leona/rtb/creativity/list?pageNum=${pageNum}&pageSize=50`,
              {
                method: "POST",
                headers,
                body: JSON.stringify({
                  startTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  endTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  pageNum,
                  pageSize: 50
                })
              }
            );
            const data = await response.json();
            if (data && data.data && data.data.list) {
              allData = allData.concat(data.data.list);
              totalPage = data.data.totalPage;
            } else {
              throw new Error("API 返回数据格式不正确");
            }
            pageNum++;
          } while (pageNum <= totalPage && pageNum <= maxPageNum);
          return allData;
        }
        // 获取请求头
        getHeaders() {
          const headers = {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
            priority: "u=1, i",
            "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            Referer: location.href,
            Origin: location.origin,
            "User-Agent": navigator.userAgent
          };
          if (location.href.indexOf("vSellerId") !== -1) {
            headers["v-seller-id"] = location.search.match(
              new RegExp("(?<=vSellerId=)[0-9a-z].*", "g")
            );
          }
          return headers;
        }
        // 处理统计数据
        processStats(data) {
          this.stats.totalCreativity = new Set(
            data.map((item) => item.creativityId)
          ).size;
          const groupCountByField = (data2, field) => {
            const map = {};
            data2.forEach((item) => {
              if (Array.isArray(item[field])) {
                item[field].forEach((url) => {
                  if (!url) return;
                  map[url] = (map[url] || 0) + 1;
                });
              }
            });
            return Object.entries(map).map(([url, count]) => ({
              url,
              count,
              displayUrl: this.ellipsisUrl(url)
            }));
          };
          this.stats.clickUrlCounts = groupCountByField(data, "clickUrls");
          this.stats.expoUrlCounts = groupCountByField(data, "expoUrls");
        }
        // URL 缩略
        ellipsisUrl(url, head = 30, tail = 30) {
          if (url.length <= head + tail + 3) return url;
          return url.slice(0, head) + "..." + url.slice(-tail);
        }
        // 提取 URL 参数
        extractUrlParam(url) {
          if (!url) return "";
          const match = url.match(/https:\/\/magellan\.alimama\.com\/(.*?)&/);
          return match ? match[1] : url;
        }
        // 清空数据
        clearData() {
          this.tableData = [];
          this.responseData = [];
          this.stats = {
            totalCreativity: 0,
            clickUrlCounts: [],
            expoUrlCounts: []
          };
        }
        // 下载数据为 CSV
        downloadCSV() {
          if (this.responseData.length === 0) {
            console.log("没有可下载的数据！");
            return;
          }
          const BOM = "\uFEFF";
          const headers = [
            "创建时间",
            "创意名",
            "创意ID",
            "点击链接",
            "曝光链接",
            "笔记id"
          ];
          const csvContent = [headers.join(",")];
          this.responseData.forEach((item) => {
            const createTime = item.creativityCreateTime || "";
            const creativityName = item.creativityName || "";
            const creativityId = item.creativityId || "";
            const clickUrl = JSON.stringify(item.clickUrls) || "";
            const expoUrl = JSON.stringify(item.expoUrls) || "";
            const noteId = item.noteId + "" || "";
            const escapeCsvValue = (value) => {
              if (typeof value !== "string") return value;
              if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            };
            const values = [
              createTime,
              creativityName,
              creativityId,
              clickUrl,
              expoUrl,
              noteId
            ].map(escapeCsvValue);
            csvContent.push(values.join(","));
          });
          const csv = BOM + csvContent.join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleString().replace(/[/:]/g, "-");
          link.setAttribute("href", url);
          link.setAttribute("download", `data_${timestamp}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        // 获取当前状态
        getState() {
          return {
            isLoading: this.isLoading,
            tableData: this.tableData,
            stats: this.stats,
            hasData: this.responseData.length > 0
          };
        }
      }
      if (typeof module !== "undefined" && module.exports) {
        module.exports = LinkChecker;
      } else if (typeof window !== "undefined") {
        window.LinkChecker = LinkChecker;
      }
      async function reanmeSend(id, name) {
        const headers = {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-b3-traceid": "dee287ce9b6526cc"
        };
        if (location.href.indexOf("vSellerId") != -1) {
          headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
        }
        return fetch(
          "https://ad.xiaohongshu.com/api/leona/rtb/creativity/batch/update/name",
          {
            headers,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `{"creativityId":${id},"creativityName":"${name}"}`,
            method: "POST",
            mode: "cors",
            credentials: "include"
          }
        );
      }
      async function mainSend(old1, new1, onProgress) {
        const n = location.href.match(/[0-9]{1,20}/g);
        const headers = {
          accept: "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/json;charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua": '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        };
        if (location.href.indexOf("vSellerId") != -1) {
          headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
        }
        const r = await fetch(
          "https://ad.xiaohongshu.com/api/leona/rtb/creativity/list",
          {
            headers,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `{"campaignId":${n[0]},"unitId":${n[1]},"startTime":"${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}","endTime":"${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}","pageNum":1,"pageSize":50}`,
            method: "POST",
            mode: "cors",
            credentials: "include"
          }
        );
        const j = await r.json();
        const creativeList = j.data.list;
        const total = creativeList.length;
        if (onProgress) {
          onProgress(0, 0, total);
        }
        for (let i = 0; i < total; i++) {
          const element = creativeList[i];
          const newName = element.creativityName.replace(new RegExp(old1, "g"), new1);
          await reanmeSend(element.creativityId, newName);
          if (onProgress) {
            const progress = (i + 1) / total * 100;
            onProgress(Math.round(progress), i + 1, total);
          }
        }
      }
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
          target[key] = val;
        }
        return target;
      };
      const _sfc_main$a = {
        __name: "rename",
        setup(__props) {
          const message = naive.useMessage();
          const isRenaming = vue.ref(false);
          const renameOldChar = vue.ref("");
          const renameNewChar = vue.ref("");
          const renameProgress = vue.ref(0);
          const currentProgress = vue.ref(0);
          const totalProgress = vue.ref(0);
          const progressText = vue.computed(() => {
            if (totalProgress.value > 0) {
              return `正在处理: ${currentProgress.value}/${totalProgress.value} (${renameProgress.value}%)`;
            }
            return "正在处理中...";
          });
          async function handleRename() {
            if (!renameOldChar.value) {
              message.warning("请输入要被替换的旧字符");
              return;
            }
            isRenaming.value = true;
            renameProgress.value = 0;
            currentProgress.value = 0;
            totalProgress.value = 0;
            try {
              await mainSend(renameOldChar.value, renameNewChar.value, (progress, current, total) => {
                renameProgress.value = progress;
                currentProgress.value = current;
                totalProgress.value = total;
              });
              message.success("批量重命名操作已完成！");
              renameOldChar.value = "";
              renameNewChar.value = "";
            } catch (error) {
              message.error("重命名过程中发生错误");
              console.error(error);
            } finally {
              isRenaming.value = false;
            }
          }
          function cancelRename() {
            renameOldChar.value = "";
            renameNewChar.value = "";
            renameProgress.value = 0;
            currentProgress.value = 0;
            totalProgress.value = 0;
          }
          return (_ctx, _cache) => {
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_progress = vue.resolveComponent("n-progress");
            const _component_n_text = vue.resolveComponent("n-text");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_modal = vue.resolveComponent("n-modal");
            return vue.openBlock(), vue.createBlock(_component_n_modal, {
              preset: "card",
              style: { "width": "500px" },
              title: "修改单元内计划字符",
              show: true,
              "mask-closable": false,
              "close-on-esc": false,
              "transform-origin": "center",
              closable: ""
            }, {
              footer: vue.withCtx(() => [
                vue.createVNode(_component_n_button, { onClick: cancelRename }, {
                  default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                    vue.createTextVNode("取消", -1)
                  ])),
                  _: 1,
                  __: [2]
                }),
                vue.createVNode(_component_n_button, {
                  type: "primary",
                  onClick: handleRename,
                  loading: isRenaming.value,
                  style: { "margin-left": "12px" }
                }, {
                  default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                    vue.createTextVNode("确认替换", -1)
                  ])),
                  _: 1,
                  __: [3]
                }, 8, ["loading"])
              ]),
              default: vue.withCtx(() => [
                vue.createVNode(_component_n_space, { vertical: "" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_n_input, {
                      value: renameOldChar.value,
                      "onUpdate:value": _cache[0] || (_cache[0] = ($event) => renameOldChar.value = $event),
                      placeholder: "输入要被替换的旧字符"
                    }, null, 8, ["value"]),
                    vue.createVNode(_component_n_input, {
                      value: renameNewChar.value,
                      "onUpdate:value": _cache[1] || (_cache[1] = ($event) => renameNewChar.value = $event),
                      placeholder: "输入用于替换的新字符"
                    }, null, 8, ["value"]),
                    isRenaming.value ? (vue.openBlock(), vue.createBlock(_component_n_progress, {
                      key: 0,
                      type: "line",
                      percentage: renameProgress.value,
                      "indicator-placement": "inside",
                      processing: ""
                    }, null, 8, ["percentage"])) : vue.createCommentVNode("", true),
                    isRenaming.value ? (vue.openBlock(), vue.createBlock(_component_n_text, {
                      key: 1,
                      depth: "3",
                      style: { "text-align": "center" }
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(progressText.value), 1)
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            });
          };
        }
      };
      const rename = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-303426f9"]]);
      const _sfc_main$9 = {
        __name: "BatchPrice",
        props: {
          show: {
            type: Boolean,
            default: false
          }
        },
        emits: ["update:show"],
        setup(__props, { emit: __emit }) {
          const props = __props;
          const emit = __emit;
          const message = naive.useMessage();
          const formRef = vue.ref(null);
          const showModal = vue.ref(false);
          const showProgress = vue.ref(false);
          const loading = vue.ref(false);
          const progress = vue.ref(0);
          const progressInfo = vue.ref("");
          const formValue = vue.reactive({
            mode: "all",
            // all 或 uid
            price: null,
            unitIds: ""
          });
          const modeOptions = [
            {
              label: "全部调价",
              value: "all"
            },
            {
              label: "指定单元ID调价",
              value: "uid"
            }
          ];
          const rules = {
            mode: {
              required: true,
              message: "请选择调价模式",
              trigger: "change"
            },
            price: {
              required: true,
              validator(rule, value) {
                if (!value && value !== 0) {
                  return new Error("请输入调整价格");
                } else if (value < 0) {
                  return new Error("价格不能为负数");
                }
                return true;
              },
              trigger: ["input", "blur"]
            },
            unitIds: {
              trigger: ["input", "blur"],
              validator(rule, value) {
                if (formValue.mode === "uid") {
                  if (!value) {
                    return new Error("请输入单元ID列表");
                  }
                  const ids = value.trim().split(/\s+/);
                  if (ids.length === 0) {
                    return new Error("请输入有效的单元ID");
                  }
                }
                return true;
              }
            }
          };
          vue.watch(
            () => props.show,
            (newVal) => {
              showModal.value = newVal;
            }
          );
          vue.watch(showModal, (newVal) => {
            emit("update:show", newVal);
          });
          const handleModeChange = (value) => {
            formValue.mode = value;
          };
          const closeModal = () => {
            showModal.value = false;
            formRef.value?.restoreValidation();
          };
          const getCurrentTimestamp = () => {
            return Math.floor(Date.now() / 1e3);
          };
          const processUnitData = (body, bid) => {
            body.removeBind = 0;
            body.sourceFlag = "web";
            body.pageEnterTime = getCurrentTimestamp() - 10;
            body.pageSubmitTime = getCurrentTimestamp();
            if (body.keywordWithBid && Array.isArray(body.keywordWithBid)) {
              body.keywordWithBid.forEach((item) => {
                item.bid = bid * 100;
              });
            }
            return body;
          };
          const updateUnitData = async (body) => {
            const requiredFields = [
              "sourceFlag",
              "unitId",
              "unitName",
              "promotionTarget",
              "keywordWithBid",
              "targetConfig",
              "phraseMatchTypeUpgrade",
              "removeBind",
              "noteIds",
              "keywordGenType",
              "pageEnterTime",
              "pageSubmitTime"
            ];
            const filteredBody = {};
            requiredFields.forEach((key) => {
              if (body.hasOwnProperty(key)) {
                if (key === "pageEnterTime" || key === "pageSubmitTime") {
                  const timestamp = body[key];
                  if (typeof timestamp === "number" && timestamp.toString().length === 10) {
                    filteredBody[key] = timestamp * 1e3;
                  } else {
                    filteredBody[key] = timestamp;
                  }
                } else {
                  filteredBody[key] = body[key];
                }
              }
            });
            filteredBody.keywordGenType = 0;
            const ntime = Date.now();
            filteredBody.pageSubmitTime = ntime;
            const headers = {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json",
              "priority": "u=1, i",
              "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"macOS"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-t": ntime
            };
            if (location.href.indexOf("vSellerId") !== -1) {
              headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
            }
            try {
              const response = await fetch("https://ad.xiaohongshu.com/api/leona/rtb/unit", {
                headers,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify(filteredBody),
                method: "PUT",
                mode: "cors",
                credentials: "include"
              });
              const result = await response.json();
              return result;
            } catch (error) {
              console.error("请求出错:", error);
              throw error;
            }
          };
          const fetchUnitList = async () => {
            const headers = {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json",
              priority: "u=1, i",
              "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
            };
            if (location.href.indexOf("vSellerId") !== -1) {
              headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
            }
            let data = [];
            let pageNum = 1;
            let totalPage = 1;
            do {
              const response = await fetch(
                "https://ad.xiaohongshu.com/api/leona/rtb/unit/search",
                {
                  headers,
                  referrer: "https://ad.xiaohongshu.com/aurora/ad/manage/creativity",
                  referrerPolicy: "strict-origin-when-cross-origin",
                  body: JSON.stringify({
                    startTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                    endTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                    pageNum,
                    pageSize: 100,
                    placementList: [2]
                  }),
                  method: "POST",
                  mode: "cors",
                  credentials: "include"
                }
              );
              const result = await response.json();
              data = data.concat(result.data.list);
              totalPage = result.data.totalPage;
              pageNum++;
            } while (pageNum <= totalPage);
            return data;
          };
          const filterUnits = (allUnits, unitIds) => {
            const ids = unitIds.trim().split(/\s+/);
            return allUnits.filter((unit) => ids.includes(String(unit.unitId)));
          };
          const handleSubmit = (e) => {
            e.preventDefault();
            formRef.value?.validate(async (errors) => {
              if (!errors) {
                loading.value = true;
                showProgress.value = true;
                progress.value = 0;
                progressInfo.value = "正在获取单元数据...";
                try {
                  const allUnits = await fetchUnitList();
                  message.info(`获取到 ${allUnits.length} 个单元`);
                  let targetUnits = [];
                  if (formValue.mode === "all") {
                    targetUnits = allUnits;
                  } else {
                    targetUnits = filterUnits(allUnits, formValue.unitIds);
                    message.info(`筛选出 ${targetUnits.length} 个指定单元`);
                  }
                  const results = [];
                  for (let i = 0; i < targetUnits.length; i++) {
                    const unit = targetUnits[i];
                    progress.value = Math.round((i + 1) / targetUnits.length * 100);
                    progressInfo.value = `正在调整单元: ${unit.unitName} (${i + 1}/${targetUnits.length})`;
                    try {
                      const processedData = processUnitData({ ...unit }, formValue.price);
                      const result = await updateUnitData(processedData);
                      results.push({
                        unitName: unit.unitName,
                        unitId: unit.unitId,
                        success: result.msg === "成功",
                        message: result.msg
                      });
                      await new Promise((resolve) => setTimeout(resolve, 700));
                    } catch (error) {
                      results.push({
                        unitName: unit.unitName,
                        unitId: unit.unitId,
                        success: false,
                        message: error.message || "请求失败"
                      });
                    }
                  }
                  const successCount = results.filter((r) => r.success).length;
                  message.success(`调整完成！成功: ${successCount}/${results.length}`);
                  console.log("调价结果:", results);
                  showModal.value = false;
                } catch (error) {
                  message.error("操作失败: " + (error.message || "未知错误"));
                  console.error("调价过程中出错:", error);
                } finally {
                  loading.value = false;
                  showProgress.value = false;
                }
              } else {
                message.error("请检查表单填写是否正确");
              }
            });
          };
          return (_ctx, _cache) => {
            const _component_n_select = vue.resolveComponent("n-select");
            const _component_n_form_item = vue.resolveComponent("n-form-item");
            const _component_n_input_number = vue.resolveComponent("n-input-number");
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_form = vue.resolveComponent("n-form");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_modal = vue.resolveComponent("n-modal");
            const _component_n_text = vue.resolveComponent("n-text");
            const _component_n_progress = vue.resolveComponent("n-progress");
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createVNode(_component_n_modal, {
                show: showModal.value,
                "onUpdate:show": _cache[3] || (_cache[3] = ($event) => showModal.value = $event),
                preset: "card",
                style: { "width": "600px" },
                title: "批量调整出价",
                "mask-closable": false,
                "close-on-esc": false
              }, {
                footer: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, { justify: "end" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_button, { onClick: closeModal }, {
                        default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                          vue.createTextVNode("取消", -1)
                        ])),
                        _: 1,
                        __: [5]
                      }),
                      vue.createVNode(_component_n_button, {
                        type: "primary",
                        onClick: handleSubmit,
                        loading: loading.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(loading.value ? "调整中..." : "确认调整"), 1)
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_form, {
                    model: formValue,
                    rules,
                    ref_key: "formRef",
                    ref: formRef
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_form_item, {
                        label: "调价模式",
                        path: "mode"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_select, {
                            value: formValue.mode,
                            "onUpdate:value": [
                              _cache[0] || (_cache[0] = ($event) => formValue.mode = $event),
                              handleModeChange
                            ],
                            options: modeOptions
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, {
                        label: "调整价格",
                        path: "price"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input_number, {
                            value: formValue.price,
                            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => formValue.price = $event),
                            "show-button": false,
                            placeholder: "请输入要调整的价格",
                            style: { "width": "100%" }
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.withDirectives(vue.createVNode(_component_n_form_item, {
                        label: "单元ID列表",
                        path: "unitIds"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formValue.unitIds,
                            "onUpdate:value": _cache[2] || (_cache[2] = ($event) => formValue.unitIds = $event),
                            type: "textarea",
                            placeholder: "请输入单元ID，每行一个",
                            autosize: { minRows: 3, maxRows: 6 }
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }, 512), [
                        [vue.vShow, formValue.mode === "uid"]
                      ])
                    ]),
                    _: 1
                  }, 8, ["model"])
                ]),
                _: 1
              }, 8, ["show"]),
              vue.createVNode(_component_n_modal, {
                show: showProgress.value,
                "onUpdate:show": _cache[4] || (_cache[4] = ($event) => showProgress.value = $event),
                preset: "card",
                style: { "width": "500px" },
                title: "调整进度",
                "mask-closable": false,
                "close-on-esc": false
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, { vertical: "" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_text, null, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode("正在调整出价，请稍候...", -1)
                        ])),
                        _: 1,
                        __: [6]
                      }),
                      vue.createVNode(_component_n_progress, {
                        type: "line",
                        percentage: progress.value,
                        "indicator-placement": "inside",
                        processing: ""
                      }, null, 8, ["percentage"]),
                      vue.createVNode(_component_n_text, { depth: "3" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(progressInfo.value), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["show"])
            ], 64);
          };
        }
      };
      const BatchPrice = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-29be6a47"]]);
      const _sfc_main$8 = {
        __name: "setplan",
        props: {
          show: {
            type: Boolean,
            default: false
          }
        },
        emits: ["update:show"],
        setup(__props, { emit: __emit }) {
          const props = __props;
          const emit = __emit;
          const message = naive.useMessage();
          const formRef = vue.ref(null);
          const showModal = vue.ref(false);
          const showProgress = vue.ref(false);
          const loading = vue.ref(false);
          const progress = vue.ref(0);
          const progressInfo = vue.ref("");
          const progressDetail = vue.ref("");
          const formValue = vue.reactive({
            searchType: "creativeId",
            // creativeId, name, noteId
            actionType: "2",
            // 1: 开启, 2: 关闭
            inputContent: ""
          });
          const searchTypeOptions = [
            {
              label: "创意ID",
              value: "creativeId"
            },
            {
              label: "文字匹配",
              value: "name"
            },
            {
              label: "笔记ID",
              value: "noteId"
            }
          ];
          const actionTypeOptions = [
            {
              label: "关闭",
              value: "2"
            },
            {
              label: "开启",
              value: "1"
            }
          ];
          const rules = {
            searchType: {
              required: true,
              message: "请选择搜索方式",
              trigger: "change"
            },
            actionType: {
              required: true,
              message: "请选择操作类型",
              trigger: "change"
            },
            inputContent: {
              required: true,
              trigger: ["input", "blur"],
              validator(rule, value) {
                if (!value) {
                  return new Error("请输入内容");
                }
                const lines = value.trim().split(/\r?\n/).filter((line) => line.trim() !== "");
                if (lines.length === 0) {
                  return new Error("请输入有效内容");
                }
                return true;
              }
            }
          };
          vue.watch(
            () => props.show,
            (newVal) => {
              showModal.value = newVal;
            }
          );
          vue.watch(showModal, (newVal) => {
            emit("update:show", newVal);
          });
          const closeModal = () => {
            showModal.value = false;
            formRef.value?.restoreValidation();
          };
          const chunkArray = (array, chunkSize) => {
            const chunks = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              chunks.push(array.slice(i, i + chunkSize));
            }
            return chunks;
          };
          const toggleCreativePlan = async (chunkedIds, actionType) => {
            const actionText = actionType === "1" ? "开启" : "关闭";
            const headers = {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
              priority: "u=1, i",
              "sec-ch-ua": '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"macOS"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
            };
            if (location.href.indexOf("vSellerId") !== -1) {
              headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
            }
            for (let i = 0; i < chunkedIds.length; i++) {
              const ids = chunkedIds[i];
              let retry = true;
              let attempts = 0;
              const maxAttempts = 3;
              progress.value = Math.round((i + 1) / chunkedIds.length * 100);
              progressInfo.value = `正在${actionText}创意... (${i + 1}/${chunkedIds.length})`;
              progressDetail.value = `正在处理ID: [${ids.join(", ")}]`;
              while (retry && attempts < maxAttempts) {
                try {
                  const response = await fetch(
                    "https://ad.xiaohongshu.com/api/leona/rtb/creativity/batch/status",
                    {
                      headers,
                      referrer: "https://ad.xiaohongshu.com/aurora/ad/manage/creativity",
                      referrerPolicy: "strict-origin-when-cross-origin",
                      body: JSON.stringify({
                        ids,
                        actionType: parseInt(actionType)
                      }),
                      method: "PUT",
                      mode: "cors",
                      credentials: "include"
                    }
                  );
                  const result = await response.json();
                  if (result.msg === "成功") {
                    message.success(`${actionText}创意成功: ${JSON.stringify(ids)}`);
                    retry = false;
                  } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                      message.error(`${actionText}创意失败: ${result.msg}, ID: ${JSON.stringify(ids)}`);
                      retry = false;
                    } else {
                      await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                  }
                } catch (error) {
                  attempts++;
                  if (attempts >= maxAttempts) {
                    message.error(`${actionText}创意出错: ${error.message}, ID: ${JSON.stringify(ids)}`);
                    retry = false;
                  } else {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                  }
                }
              }
            }
          };
          const toggleCreativeByNoteOrName = async (inputList, actionType, searchType) => {
            const headers = {
              accept: "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8",
              priority: "u=1, i",
              "sec-ch-ua": '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"macOS"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin"
            };
            if (location.href.indexOf("vSellerId") !== -1) {
              headers["v-seller-id"] = location.search.match(new RegExp("(?<=vSellerId=)[0-9a-z].*", "g"));
            }
            for (let index = 0; index < inputList.length; index++) {
              const inputItem = inputList[index];
              progress.value = Math.round((index + 1) / inputList.length * 100);
              progressInfo.value = `正在处理: ${inputItem} (${index + 1}/${inputList.length})`;
              try {
                let searchValue = inputItem;
                let placementList = null;
                if (inputItem.indexOf("	") !== -1) {
                  const parts = inputItem.split("	");
                  searchValue = parts[0];
                  const position = parts[1];
                  placementList = position === "信息流" ? [1] : position === "搜索" ? [2] : null;
                }
                const requestBody = {
                  startTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  endTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                  [searchType]: searchValue,
                  pageNum: 1,
                  pageSize: 50
                };
                if (placementList) {
                  requestBody.placementList = placementList;
                }
                const response = await fetch(
                  "https://ad.xiaohongshu.com/api/leona/rtb/creativity/list",
                  {
                    headers,
                    referrer: "https://ad.xiaohongshu.com/aurora/ad/manage/creativity",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: JSON.stringify(requestBody),
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                  }
                );
                const result = await response.json();
                if (result.data.list.length > 0) {
                  const creativeIds = result.data.list.map((item) => item.creativityId);
                  message.info(`找到 ${creativeIds.length} 个创意ID`);
                  const chunkedIds = chunkArray(creativeIds, 50);
                  await toggleCreativePlan(chunkedIds, actionType);
                } else {
                  message.warning(`未找到匹配的创意: ${searchValue}`);
                }
              } catch (error) {
                message.error(`处理 ${inputItem} 时出错: ${error.message}`);
              }
            }
          };
          const handleSubmit = (e) => {
            e.preventDefault();
            formRef.value?.validate(async (errors) => {
              if (!errors) {
                loading.value = true;
                showProgress.value = true;
                progress.value = 0;
                progressInfo.value = "开始处理...";
                progressDetail.value = "";
                try {
                  const inputLines = formValue.inputContent.trim().split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "");
                  if (inputLines.length === 0) {
                    message.error("请输入有效内容");
                    return;
                  }
                  if (formValue.searchType === "creativeId") {
                    const invalidIds = inputLines.filter((line) => line.length < 11);
                    if (invalidIds.length > 0) {
                      message.error(`以下内容不符合创意ID格式: ${invalidIds.join(", ")}`);
                      return;
                    }
                    const chunkedIds = chunkArray(inputLines, 50);
                    await toggleCreativePlan(chunkedIds, formValue.actionType);
                  } else {
                    if (formValue.searchType === "noteId") {
                      const invalidIds = inputLines.filter((line) => {
                        const id = line.split("	")[0];
                        return id.length <= 11;
                      });
                      if (invalidIds.length > 0) {
                        message.error(`以下内容不符合笔记ID格式: ${invalidIds.join(", ")}`);
                        return;
                      }
                    }
                    await toggleCreativeByNoteOrName(inputLines, formValue.actionType, formValue.searchType);
                  }
                  message.success("操作完成");
                  showModal.value = false;
                } catch (error) {
                  message.error("操作失败: " + (error.message || "未知错误"));
                  console.error("操作过程中出错:", error);
                } finally {
                  loading.value = false;
                  showProgress.value = false;
                }
              } else {
                message.error("请检查表单填写是否正确");
              }
            });
          };
          return (_ctx, _cache) => {
            const _component_n_select = vue.resolveComponent("n-select");
            const _component_n_form_item = vue.resolveComponent("n-form-item");
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_text = vue.resolveComponent("n-text");
            const _component_n_form = vue.resolveComponent("n-form");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_modal = vue.resolveComponent("n-modal");
            const _component_n_progress = vue.resolveComponent("n-progress");
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createVNode(_component_n_modal, {
                show: showModal.value,
                "onUpdate:show": _cache[3] || (_cache[3] = ($event) => showModal.value = $event),
                preset: "card",
                style: { "width": "600px" },
                title: "创意开关控制",
                "mask-closable": false,
                "close-on-esc": false
              }, {
                footer: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, { justify: "end" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_button, { onClick: closeModal }, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode("取消", -1)
                        ])),
                        _: 1,
                        __: [6]
                      }),
                      vue.createVNode(_component_n_button, {
                        type: "primary",
                        onClick: handleSubmit,
                        loading: loading.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(loading.value ? "处理中..." : "确认执行"), 1)
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_form, {
                    model: formValue,
                    rules,
                    ref_key: "formRef",
                    ref: formRef
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_form_item, {
                        label: "搜索方式",
                        path: "searchType"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_select, {
                            value: formValue.searchType,
                            "onUpdate:value": _cache[0] || (_cache[0] = ($event) => formValue.searchType = $event),
                            options: searchTypeOptions
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, {
                        label: "操作类型",
                        path: "actionType"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_select, {
                            value: formValue.actionType,
                            "onUpdate:value": _cache[1] || (_cache[1] = ($event) => formValue.actionType = $event),
                            options: actionTypeOptions
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, {
                        label: "输入内容",
                        path: "inputContent"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formValue.inputContent,
                            "onUpdate:value": _cache[2] || (_cache[2] = ($event) => formValue.inputContent = $event),
                            type: "textarea",
                            placeholder: "请输入内容，多个内容请换行分隔",
                            autosize: { minRows: 4, maxRows: 10 }
                          }, null, 8, ["value"]),
                          vue.createVNode(_component_n_text, {
                            depth: "3",
                            style: { "margin-top": "8px", "display": "block" }
                          }, {
                            default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                              vue.createTextVNode(" 提示：使用创意ID时每行一个；使用笔记ID或文字匹配时，如需指定位置可在内容后加制表符(Tab)和位置(如：信息流、搜索) ", -1)
                            ])),
                            _: 1,
                            __: [5]
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model"])
                ]),
                _: 1
              }, 8, ["show"]),
              vue.createVNode(_component_n_modal, {
                show: showProgress.value,
                "onUpdate:show": _cache[4] || (_cache[4] = ($event) => showProgress.value = $event),
                preset: "card",
                style: { "width": "500px" },
                title: "执行进度",
                "mask-closable": false,
                "close-on-esc": false
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, { vertical: "" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_text, null, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(progressInfo.value), 1)
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_progress, {
                        type: "line",
                        percentage: progress.value,
                        "indicator-placement": "inside",
                        processing: ""
                      }, null, 8, ["percentage"]),
                      vue.createVNode(_component_n_text, { depth: "3" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(progressDetail.value), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["show"])
            ], 64);
          };
        }
      };
      const setplan = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-8edd34a0"]]);
      const _hoisted_1$6 = { class: "createrplan-container" };
      const _hoisted_2$1 = { style: { "font-size": "14px" } };
      const _hoisted_3 = { style: { "font-size": "16px" } };
      const _sfc_main$7 = {
        __name: "createrplan",
        setup(__props) {
          const message = naive.useMessage();
          const currentVersion = vue.ref("old");
          const isLoading = vue.ref({
            autoOptimize: false,
            searchComponent: false,
            updateNames: false,
            addKeywords: false,
            addTracking: false
          });
          const selectorConfig = {
            old: {
              autoOptimize: ".flexible.align-center",
              searchComponent: ".d-grid.d-radio-main-label",
              creativeNameInput: 'input[placeholder="请输入你的创意名称"]',
              item: ".item",
              commentInput: 'input[placeholder="请输入置顶评论文案"]',
              searchWordInput: 'input[placeholder="请输入搜索词"]',
              linkButton: ".link-text",
              addAction: ".add-action",
              linkInput: 'input[placeholder="请输入链接"]',
              saveButton: ".d-button-content .d-text"
            },
            new: {
              autoOptimize: ".form-item-main button",
              searchComponent: ".search-component-new",
              creativeNameInput: 'input[placeholder="请输入创意名称"]',
              item: ".creativity-list-container",
              commentInput: 'input[placeholder="请输入置顶评论文案"]',
              searchWordInput: 'input[placeholder="请输入搜索词"]',
              linkButton: ".form-item-main button",
              addAction: ".add-action",
              linkInput: 'input[placeholder="请输入链接"]',
              saveButton: ".d-modal-footer button"
            }
          };
          const getSelectors = () => selectorConfig[currentVersion.value];
          const formData = vue.ref({
            baseCreativeName: "",
            exposureLink: "",
            clickLink: "",
            noteMatchingInfo: ""
          });
          vue.onMounted(() => {
            formData.value.baseCreativeName = localStorage.getItem("baseCreativeName") || "";
            formData.value.exposureLink = localStorage.getItem("exposureLink") || "";
            formData.value.clickLink = localStorage.getItem("clickLink") || "";
            formData.value.noteMatchingInfo = localStorage.getItem("noteMatchingInfo") || "";
            currentVersion.value = localStorage.getItem("currentVersion") || "old";
          });
          const switchVersion = () => {
            currentVersion.value = currentVersion.value === "old" ? "new" : "old";
            localStorage.setItem("currentVersion", currentVersion.value);
            message.success(
              `已切换到${currentVersion.value === "old" ? "老版本" : "新版本"}`
            );
          };
          const saveToLocalStorage = (key, value) => {
            localStorage.setItem(key, value);
          };
          const delay = (ms) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
          };
          const waitForElement = async (selector, text = null) => {
            while (true) {
              const elements = Array.from(document.querySelectorAll(selector));
              const el = elements.find((e) => !text || e.innerText.includes(text));
              if (el) return el;
              await delay(100);
            }
          };
          const waitForElements = async (selector, count) => {
            while (true) {
              const els = document.querySelectorAll(selector);
              if (els.length >= count) return els;
              await delay(100);
            }
          };
          const parseNoteInfo = () => {
            const text = formData.value.noteMatchingInfo;
            return text.trim().split("\n").map((line) => line.trim().split("	"));
          };
          const setupAutoOptimize = async () => {
            isLoading.value.autoOptimize = true;
            try {
              const selectors = getSelectors();
              document.querySelectorAll(selectors.autoOptimize).forEach((el) => {
                if (el.innerText === "关闭") {
                  el.click();
                }
              });
              message.success(`已关闭自动优化 (${currentVersion.value}版本)`);
            } catch (error) {
              message.error("关闭自动优化失败: " + error.message);
            } finally {
              isLoading.value.autoOptimize = false;
            }
          };
          const setupSearchComponent = async () => {
            isLoading.value.searchComponent = true;
            try {
              const selectors = getSelectors();
              document.querySelectorAll(selectors.searchComponent).forEach((el) => {
                if (el.innerText === "搜索组件") {
                  el.click();
                }
              });
              message.success(`已点击搜索组件 (${currentVersion.value}版本)`);
            } catch (error) {
              message.error("点击搜索组件失败: " + error.message);
            } finally {
              isLoading.value.searchComponent = false;
            }
          };
          const updateCreativeNames = async () => {
            if (currentVersion.value === "new") {
              const selectors = getSelectors();
              const baseName = formData.value.baseCreativeName;
              if (!baseName) {
                message.warning("请先输入基础创意名称");
                return;
              }
              const xhsINFO = document.querySelectorAll(
                ".promotion-note-content-info span:nth-child(3)"
              );
              console.log(xhsINFO);
              const inputg = document.querySelectorAll(selectors.creativeNameInput);
              console.log(inputg);
              for (let index = 0; index < inputg.length; index++) {
                const element = inputg[index];
                element.value = baseName.replace("达人昵称", xhsINFO[index].innerText.split(" ")[0]);
                element.dispatchEvent(new Event("input"));
              }
            } else {
              isLoading.value.updateNames = true;
              try {
                const baseName = formData.value.baseCreativeName;
                const noteInfo = parseNoteInfo();
                const selectors = getSelectors();
                if (!baseName) {
                  message.warning("请先输入基础创意名称");
                  return;
                }
                document.querySelectorAll(selectors.item).forEach((item) => {
                  const tds = item.querySelectorAll("td");
                  if (tds.length >= 4) {
                    const redbookId = tds[1].innerText;
                    const nickname = tds[3].innerText;
                    const scene = noteInfo.find((n) => n[1] === redbookId)?.[0];
                    if (scene) {
                      const input = item.querySelector(selectors.creativeNameInput);
                      if (input) {
                        const newName = baseName.replace("达人昵称", nickname).replace("场景", scene);
                        input.value = newName;
                        input.dispatchEvent(new Event("input"));
                      }
                    } else {
                      const input = item.querySelector(selectors.creativeNameInput);
                      if (input) {
                        const newName = baseName.replace("达人昵称", nickname);
                        input.value = newName;
                        input.dispatchEvent(new Event("input"));
                      }
                    }
                  }
                });
                message.success(`已完成创意名称修改 (${currentVersion.value}版本)`);
              } catch (error) {
                message.error("修改创意名称失败: " + error.message);
              } finally {
                isLoading.value.updateNames = false;
              }
            }
          };
          const addSearchKeywords = async () => {
            isLoading.value.addKeywords = true;
            try {
              const noteInfo = parseNoteInfo();
              const selectors = getSelectors();
              document.querySelectorAll(selectors.item).forEach((item) => {
                const tds = item.querySelectorAll("td");
                if (tds.length >= 2) {
                  const redbookId = tds[1].innerText;
                  const keyword = noteInfo.find((n) => n[1] === redbookId)?.[2];
                  if (keyword) {
                    const inputs = [
                      item.querySelectorAll(selectors.commentInput)[1],
                      item.querySelector(selectors.searchWordInput)
                    ];
                    inputs.forEach((input, i) => {
                      if (input) {
                        input.value = i === 0 ? keyword : keyword.match(new RegExp("(?<=【).*?(?=】)", "g"))?.[0] || "";
                        input.dispatchEvent(
                          new Event("input", {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                          })
                        );
                      }
                    });
                  }
                }
              });
              message.success(`已完成搜索词添加 (${currentVersion.value}版本)`);
            } catch (error) {
              message.error("添加搜索词失败: " + error.message);
            } finally {
              isLoading.value.addKeywords = false;
            }
          };
          const addTrackingLinks = async () => {
            isLoading.value.addTracking = true;
            try {
              const urls = [formData.value.exposureLink, formData.value.clickLink];
              const selectors = getSelectors();
              if (!urls[0] || !urls[1]) {
                message.warning("请先输入曝光链接和点击链接");
                return;
              }
              const buttons = Array.from(
                document.querySelectorAll(selectors.linkButton)
              ).filter(
                (el) => el.innerText === "添加监测链接" || el.innerText === "去配置"
              );
              for (const btn of buttons) {
                btn.click();
                await waitForElements(selectors.addAction, 2);
                document.querySelectorAll(selectors.addAction).forEach((b) => b.click());
                await delay(1e3);
                const inputs = await waitForElements(selectors.linkInput, 2);
                inputs.forEach((input, i) => {
                  if (urls[i]) {
                    input.value = urls[i];
                    input.dispatchEvent(new Event("input"));
                  }
                });
                await delay(1e3);
                const saveButton = await waitForElement(selectors.saveButton, "保存");
                saveButton.click();
                await delay(1e3);
              }
              message.success(`已完成监测链接添加 (${currentVersion.value}版本)`);
            } catch (error) {
              message.error("添加监测链接失败: " + error.message);
            } finally {
              isLoading.value.addTracking = false;
            }
          };
          const clearAllData = () => {
            try {
              const keys = [
                "baseCreativeName",
                "exposureLink",
                "clickLink",
                "noteMatchingInfo"
              ];
              keys.forEach((key) => {
                localStorage.removeItem(key);
                formData.value[key] = "";
              });
              message.success("已清除所有数据");
            } catch (error) {
              message.error("清除数据失败: " + error.message);
            }
          };
          return (_ctx, _cache) => {
            const _component_n_tag = vue.resolveComponent("n-tag");
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_form_item = vue.resolveComponent("n-form-item");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_grid_item = vue.resolveComponent("n-grid-item");
            const _component_n_grid = vue.resolveComponent("n-grid");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_card = vue.resolveComponent("n-card");
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
              vue.createVNode(_component_n_card, {
                title: "小红书创意计划工具1.2",
                class: "main-card"
              }, {
                "header-extra": vue.withCtx(() => [
                  vue.createVNode(_component_n_tag, {
                    type: currentVersion.value === "old" ? "warning" : "success",
                    size: "large"
                  }, {
                    icon: vue.withCtx(() => [
                      vue.createElementVNode("span", _hoisted_2$1, vue.toDisplayString(currentVersion.value === "old" ? "🕰️" : "🚀"), 1)
                    ]),
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" " + vue.toDisplayString(currentVersion.value === "old" ? "老版本" : "新版本"), 1)
                    ]),
                    _: 1
                  }, 8, ["type"])
                ]),
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, { vertical: "" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_form_item, { label: "基础创意名称" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formData.value.baseCreativeName,
                            "onUpdate:value": [
                              _cache[0] || (_cache[0] = ($event) => formData.value.baseCreativeName = $event),
                              _cache[1] || (_cache[1] = ($event) => saveToLocalStorage("baseCreativeName", $event))
                            ],
                            placeholder: "请输入基础创意名称 【达人昵称】-信息流"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, { label: "曝光链接" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formData.value.exposureLink,
                            "onUpdate:value": [
                              _cache[2] || (_cache[2] = ($event) => formData.value.exposureLink = $event),
                              _cache[3] || (_cache[3] = ($event) => saveToLocalStorage("exposureLink", $event))
                            ],
                            placeholder: "请输入曝光链接"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, { label: "点击链接" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formData.value.clickLink,
                            "onUpdate:value": [
                              _cache[4] || (_cache[4] = ($event) => formData.value.clickLink = $event),
                              _cache[5] || (_cache[5] = ($event) => saveToLocalStorage("clickLink", $event))
                            ],
                            placeholder: "请输入点击链接"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_form_item, { label: "笔记匹配信息" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formData.value.noteMatchingInfo,
                            "onUpdate:value": [
                              _cache[6] || (_cache[6] = ($event) => formData.value.noteMatchingInfo = $event),
                              _cache[7] || (_cache[7] = ($event) => saveToLocalStorage("noteMatchingInfo", $event))
                            ],
                            type: "textarea",
                            placeholder: "直接从EXCEL中复制格式：\n小红书笔记id 达人昵称 ",
                            autosize: { minRows: 4, maxRows: 6 }
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_grid, {
                        cols: 3,
                        "x-gap": 12,
                        "y-gap": 12
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "primary",
                                block: "",
                                onClick: setupAutoOptimize,
                                loading: isLoading.value.autoOptimize
                              }, {
                                icon: vue.withCtx(() => _cache[8] || (_cache[8] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "⚙️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[9] || (_cache[9] = vue.createTextVNode(" 关闭自动优化 ", -1))
                                ]),
                                _: 1,
                                __: [9]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "primary",
                                block: "",
                                onClick: setupSearchComponent,
                                loading: isLoading.value.searchComponent
                              }, {
                                icon: vue.withCtx(() => _cache[10] || (_cache[10] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "🔍", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[11] || (_cache[11] = vue.createTextVNode(" 点击搜索组件 ", -1))
                                ]),
                                _: 1,
                                __: [11]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: currentVersion.value === "old" ? "success" : "warning",
                                block: "",
                                onClick: switchVersion
                              }, {
                                icon: vue.withCtx(() => [
                                  vue.createElementVNode("span", _hoisted_3, vue.toDisplayString(currentVersion.value === "old" ? "🚀" : "🕰️"), 1)
                                ]),
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(" 切换到" + vue.toDisplayString(currentVersion.value === "old" ? "新版本" : "老版本"), 1)
                                ]),
                                _: 1
                              }, 8, ["type"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "info",
                                block: "",
                                onClick: updateCreativeNames,
                                loading: isLoading.value.updateNames
                              }, {
                                icon: vue.withCtx(() => _cache[12] || (_cache[12] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "✏️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[13] || (_cache[13] = vue.createTextVNode(" 修改创意名称 ", -1))
                                ]),
                                _: 1,
                                __: [13]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "info",
                                block: "",
                                onClick: addSearchKeywords,
                                loading: isLoading.value.addKeywords
                              }, {
                                icon: vue.withCtx(() => _cache[14] || (_cache[14] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "🏷️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[15] || (_cache[15] = vue.createTextVNode(" 添加搜索词 ", -1))
                                ]),
                                _: 1,
                                __: [15]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "warning",
                                block: "",
                                onClick: addTrackingLinks,
                                loading: isLoading.value.addTracking
                              }, {
                                icon: vue.withCtx(() => _cache[16] || (_cache[16] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "🔗", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[17] || (_cache[17] = vue.createTextVNode(" 添加监测链接 ", -1))
                                ]),
                                _: 1,
                                __: [17]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "error",
                                block: "",
                                onClick: clearAllData
                              }, {
                                icon: vue.withCtx(() => _cache[18] || (_cache[18] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "🗑️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[19] || (_cache[19] = vue.createTextVNode(" 清除所有数据 ", -1))
                                ]),
                                _: 1,
                                __: [19]
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]);
          };
        }
      };
      const createrplan = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-5dbab58c"]]);
      const _hoisted_1$5 = { class: "button-container" };
      const _hoisted_2 = { class: "modal-content" };
      const _sfc_main$6 = {
        __name: "XHS",
        setup(__props) {
          const linkChecker = new LinkChecker();
          const message = naive.useMessage();
          const checkingLinks = vue.ref(false);
          const showDataModal = vue.ref(false);
          const tableData = vue.ref([]);
          const linkStats = vue.reactive({
            totalCreativity: 0,
            clickUrlCounts: [],
            expoUrlCounts: []
          });
          const showRenameModal = vue.ref(false);
          const showBatchPriceModal = vue.ref(false);
          const showSetPlanModal = vue.ref(false);
          const createplanRef = vue.ref(false);
          const tableColumns = [
            {
              title: "创建时间",
              key: "creativityCreateTime",
              width: 150
            },
            {
              title: "创意名",
              key: "creativityName",
              resizable: true
            },
            {
              title: "创意ID",
              key: "creativityId",
              width: 120
            },
            {
              title: "点击链接",
              key: "clickUrls",
              render(row) {
                return row.clickUrls ? row.clickUrls.map((url) => linkChecker.extractUrlParam(url)).join("\n") : "";
              }
            },
            {
              title: "曝光链接",
              key: "expoUrls",
              render(row) {
                return row.expoUrls ? row.expoUrls.map((url) => linkChecker.extractUrlParam(url)).join("\n") : "";
              }
            }
          ];
          function downloadData() {
            linkChecker.downloadCSV();
          }
          const pagination = vue.reactive({
            page: 1,
            pageSize: 10,
            showSizePicker: true,
            pageSizes: [10, 20, 50],
            prefix({ itemCount }) {
              return `总共有 ${itemCount} 条数据`;
            },
            onChange: (page) => {
              pagination.page = page;
              console.log(`切换到第 ${page} 页`);
            },
            onUpdatePageSize: (pageSize) => {
              pagination.pageSize = pageSize;
              pagination.page = 1;
              console.log(`每页显示 ${pageSize} 条数据`);
            }
          });
          const checkAndShowLinks = async () => {
            checkingLinks.value = true;
            try {
              const result = await linkChecker.checkLinks();
              if (result.success) {
                console.log("检查成功", result.data);
                const state = linkChecker.getState();
                tableData.value = state.tableData;
                linkStats.totalCreativity = state.stats.totalCreativity;
                linkStats.clickUrlCounts = state.stats.clickUrlCounts;
                linkStats.expoUrlCounts = state.stats.expoUrlCounts;
                showDataModal.value = true;
                message.success("成功", {
                  duration: 3e3,
                  closable: true
                });
              } else {
                console.error("检查失败", result.error);
                message.info("失败", {
                  duration: 3e3,
                  closable: true
                });
              }
            } catch {
              message.error("失败", {
                duration: 3e3,
                closable: true
              });
            } finally {
              checkingLinks.value = false;
            }
          };
          const modifyCreativeNames = () => {
            if (showRenameModal.value) {
              showRenameModal.value = false;
              console.log("隐藏修改创模态窗口");
            } else {
              showRenameModal.value = true;
              console.log("修改创模态窗口");
            }
            console.log("修改创意名称");
          };
          const batchPriceAdjustment = () => {
            console.log("批量调价");
            showBatchPriceModal.value = true;
          };
          const enableCreatives = () => {
            console.log("开启创意");
            showSetPlanModal.value = true;
          };
          return (_ctx, _cache) => {
            const _component_n_icon = vue.resolveComponent("n-icon");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_tooltip = vue.resolveComponent("n-tooltip");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_statistic = vue.resolveComponent("n-statistic");
            const _component_n_card = vue.resolveComponent("n-card");
            const _component_n_grid_item = vue.resolveComponent("n-grid-item");
            const _component_n_grid = vue.resolveComponent("n-grid");
            const _component_n_ellipsis = vue.resolveComponent("n-ellipsis");
            const _component_n_list_item = vue.resolveComponent("n-list-item");
            const _component_n_list = vue.resolveComponent("n-list");
            const _component_n_scrollbar = vue.resolveComponent("n-scrollbar");
            const _component_n_data_table = vue.resolveComponent("n-data-table");
            const _component_n_modal = vue.resolveComponent("n-modal");
            return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
              vue.createElementVNode("div", _hoisted_1$5, [
                vue.createVNode(_component_n_space, {
                  justify: "space-between",
                  wrap: ""
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_n_button, {
                      type: "primary",
                      size: "large",
                      onClick: checkAndShowLinks,
                      loading: checkingLinks.value,
                      style: { "flex": "1", "min-width": "150px", "margin": "4px" }
                    }, {
                      icon: vue.withCtx(() => [
                        vue.createVNode(_component_n_icon, null, {
                          default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                            vue.createTextVNode(" 🐒 ", -1)
                          ])),
                          _: 1,
                          __: [6]
                        })
                      ]),
                      default: vue.withCtx(() => [
                        vue.createTextVNode(" " + vue.toDisplayString(checkingLinks.value ? "检查中..." : "检查链接"), 1)
                      ]),
                      _: 1
                    }, 8, ["loading"]),
                    vue.createVNode(_component_n_button, {
                      type: "info",
                      size: "large",
                      onClick: modifyCreativeNames,
                      style: { "flex": "1", "min-width": "150px", "margin": "4px" }
                    }, {
                      icon: vue.withCtx(() => [
                        vue.createVNode(_component_n_icon, null, {
                          default: vue.withCtx(() => _cache[7] || (_cache[7] = [
                            vue.createTextVNode(" 🐒 ", -1)
                          ])),
                          _: 1,
                          __: [7]
                        })
                      ]),
                      default: vue.withCtx(() => [
                        _cache[8] || (_cache[8] = vue.createTextVNode(" 修改名称 ", -1))
                      ]),
                      _: 1,
                      __: [8]
                    }),
                    vue.createVNode(_component_n_tooltip, { trigger: "hover" }, {
                      trigger: vue.withCtx(() => [
                        vue.createVNode(_component_n_button, {
                          type: "warning",
                          size: "large",
                          onClick: batchPriceAdjustment,
                          style: { "flex": "1", "min-width": "150px", "margin": "4px" },
                          disabled: true
                        }, {
                          icon: vue.withCtx(() => [
                            vue.createVNode(_component_n_icon, null, {
                              default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                                vue.createTextVNode(" 🐒 ", -1)
                              ])),
                              _: 1,
                              __: [9]
                            })
                          ]),
                          default: vue.withCtx(() => [
                            _cache[10] || (_cache[10] = vue.createTextVNode(" 批量调价 ", -1))
                          ]),
                          _: 1,
                          __: [10]
                        })
                      ]),
                      default: vue.withCtx(() => [
                        _cache[11] || (_cache[11] = vue.createElementVNode("span", null, "当前调价功能存在问题，暂时无法使用", -1))
                      ]),
                      _: 1,
                      __: [11]
                    }),
                    vue.createVNode(_component_n_button, {
                      type: "success",
                      size: "large",
                      onClick: enableCreatives,
                      style: { "flex": "1", "min-width": "150px", "margin": "4px" }
                    }, {
                      icon: vue.withCtx(() => [
                        vue.createVNode(_component_n_icon, null, {
                          default: vue.withCtx(() => _cache[12] || (_cache[12] = [
                            vue.createTextVNode(" 🐒 ", -1)
                          ])),
                          _: 1,
                          __: [12]
                        })
                      ]),
                      default: vue.withCtx(() => [
                        _cache[13] || (_cache[13] = vue.createTextVNode(" 关闭创意 ", -1))
                      ]),
                      _: 1,
                      __: [13]
                    }),
                    vue.createVNode(_component_n_button, {
                      type: "success",
                      size: "large",
                      onClick: _cache[0] || (_cache[0] = ($event) => createplanRef.value = true),
                      style: { "flex": "1", "min-width": "150px", "margin": "4px" }
                    }, {
                      icon: vue.withCtx(() => [
                        vue.createVNode(_component_n_icon, null, {
                          default: vue.withCtx(() => _cache[14] || (_cache[14] = [
                            vue.createTextVNode(" 🐒 ", -1)
                          ])),
                          _: 1,
                          __: [14]
                        })
                      ]),
                      default: vue.withCtx(() => [
                        _cache[15] || (_cache[15] = vue.createTextVNode(" 半自动搭建创意 ", -1))
                      ]),
                      _: 1,
                      __: [15]
                    })
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_n_modal, {
                  show: showDataModal.value,
                  "onUpdate:show": _cache[1] || (_cache[1] = ($event) => showDataModal.value = $event),
                  preset: "card",
                  style: { "width": "90vw" },
                  title: "链接检查结果",
                  "mask-closable": false,
                  "close-on-esc": false
                }, {
                  "header-extra": vue.withCtx(() => [
                    vue.createVNode(_component_n_button, {
                      strong: "",
                      secondary: "",
                      onClick: downloadData
                    }, {
                      default: vue.withCtx(() => _cache[16] || (_cache[16] = [
                        vue.createTextVNode(" 下载数据 ", -1)
                      ])),
                      _: 1,
                      __: [16]
                    })
                  ]),
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_2, [
                      linkStats.totalCreativity > 0 ? (vue.openBlock(), vue.createBlock(_component_n_grid, {
                        key: 0,
                        cols: 3,
                        responsive: "screen",
                        "x-gap": 12,
                        "y-gap": 12
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_card, { title: "总创意数" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_n_statistic, {
                                    value: linkStats.totalCreativity
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_card, { title: "点击链接种类" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_n_statistic, {
                                    value: linkStats.clickUrlCounts.length
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_card, { title: "曝光链接种类" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_n_statistic, {
                                    value: linkStats.expoUrlCounts.length
                                  }, null, 8, ["value"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : vue.createCommentVNode("", true),
                      linkStats.clickUrlCounts.length > 0 ? (vue.openBlock(), vue.createBlock(_component_n_card, {
                        key: 1,
                        title: "点击链接统计",
                        style: { "margin-top": "16px" },
                        class: "auto-height-card"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_scrollbar, { style: { "max-height": "150px" } }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_list, null, {
                                default: vue.withCtx(() => [
                                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(linkStats.clickUrlCounts, (item) => {
                                    return vue.openBlock(), vue.createBlock(_component_n_list_item, {
                                      key: item.url
                                    }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_n_ellipsis, {
                                          style: { "max-width": "100%" },
                                          tooltip: true
                                        }, {
                                          default: vue.withCtx(() => [
                                            vue.createTextVNode(vue.toDisplayString(item.displayUrl) + " ：" + vue.toDisplayString(item.count) + " 条 ", 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : vue.createCommentVNode("", true),
                      linkStats.expoUrlCounts.length > 0 ? (vue.openBlock(), vue.createBlock(_component_n_card, {
                        key: 2,
                        title: "曝光链接统计",
                        style: { "margin-top": "16px" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_scrollbar, { style: { "max-height": "150px" } }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_list, null, {
                                default: vue.withCtx(() => [
                                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(linkStats.expoUrlCounts, (item) => {
                                    return vue.openBlock(), vue.createBlock(_component_n_list_item, {
                                      key: item.url
                                    }, {
                                      default: vue.withCtx(() => [
                                        vue.createVNode(_component_n_ellipsis, {
                                          style: { "max-width": "100%" },
                                          tooltip: true
                                        }, {
                                          default: vue.withCtx(() => [
                                            vue.createTextVNode(vue.toDisplayString(item.displayUrl) + " ：" + vue.toDisplayString(item.count) + " 条 ", 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : vue.createCommentVNode("", true),
                      vue.createVNode(_component_n_card, {
                        title: "详细数据",
                        style: { "margin-top": "16px", "flex": "1" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_data_table, {
                            columns: tableColumns,
                            data: tableData.value,
                            pagination,
                            striped: "",
                            bordered: true
                          }, null, 8, ["data", "pagination"])
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }, 8, ["show"]),
                vue.createVNode(_component_n_modal, {
                  show: createplanRef.value,
                  "onUpdate:show": _cache[2] || (_cache[2] = ($event) => createplanRef.value = $event),
                  preset: "card",
                  style: { "width": "800px", "max-width": "90vw" },
                  title: "红书半自动搭建计划",
                  bordered: false,
                  "mask-closable": true,
                  "close-on-esc": true
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(createrplan)
                  ]),
                  _: 1
                }, 8, ["show"])
              ]),
              vue.createVNode(rename, {
                show: showRenameModal.value,
                "onUpdate:show": _cache[3] || (_cache[3] = ($event) => showRenameModal.value = $event)
              }, null, 8, ["show"]),
              vue.createVNode(BatchPrice, {
                show: showBatchPriceModal.value,
                "onUpdate:show": _cache[4] || (_cache[4] = ($event) => showBatchPriceModal.value = $event)
              }, null, 8, ["show"]),
              vue.createVNode(setplan, {
                show: showSetPlanModal.value,
                "onUpdate:show": _cache[5] || (_cache[5] = ($event) => showSetPlanModal.value = $event)
              }, null, 8, ["show"])
            ], 64);
          };
        }
      };
      const XHS = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-aaaae17f"]]);
      const _hoisted_1$4 = { class: "default-component" };
      const _sfc_main$5 = {
        __name: "DefaultComponent",
        setup(__props) {
          return (_ctx, _cache) => {
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
              vue.createVNode(vue.unref(naive.NEmpty), { description: "暂无适配" }, {
                icon: vue.withCtx(() => [
                  vue.createVNode(vue.unref(naive.NIcon), { size: "48" }, {
                    default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                      vue.createTextVNode(" 🐒 ", -1)
                    ])),
                    _: 1,
                    __: [0]
                  })
                ]),
                _: 1
              })
            ]);
          };
        }
      };
      const DefaultComponent = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-ff0a68db"]]);
      class RequestListener {
        constructor() {
          this.isActive = false;
          this.originalXHR = null;
          this.originalFetch = null;
          this.callbacks = [];
        }
        // 解码函数
        decodeRequestBody(body) {
          try {
            if (typeof body === "string") {
              if (body.trim().startsWith("{") || body.trim().startsWith("[")) {
                const parsed = JSON.parse(body);
                return parsed;
              } else {
                return body;
              }
            } else if (typeof body === "object") {
              return body;
            } else {
              return body;
            }
          } catch (e) {
            return body;
          }
        }
        // 启动监听器
        start() {
          if (this.isActive) return false;
          this.originalXHR = window.XMLHttpRequest;
          this.originalFetch = window.fetch;
          const self = this;
          window.XMLHttpRequest = function() {
            const xhr = new self.originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            let requestUrl = "";
            let method = "";
            xhr.open = function(xhrMethod, url) {
              requestUrl = url;
              method = xhrMethod;
              return originalOpen.apply(this, arguments);
            };
            xhr.send = function(body) {
              if (requestUrl.includes("queryJobPs")) {
                const decodedBody = self.decodeRequestBody(body);
                self.callbacks.forEach((callback) => {
                  callback({
                    type: "xhr",
                    url: requestUrl,
                    method,
                    requestBody: body,
                    decodedBody
                  });
                });
              }
              return originalSend.apply(this, arguments);
            };
            return xhr;
          };
          window.fetch = function(input, init) {
            let url = "";
            if (typeof input === "string") {
              url = input;
            } else if (input instanceof Request) {
              url = input.url;
            } else {
              url = String(input);
            }
            if (url.includes("queryJobPs")) {
              let body = null;
              if (init && init.body) {
                body = init.body;
              }
              const decodedBody = self.decodeRequestBody(body);
              self.callbacks.forEach((callback) => {
                callback({
                  type: "fetch",
                  url,
                  init,
                  requestBody: body,
                  decodedBody
                });
              });
            }
            return self.originalFetch.apply(this, arguments);
          };
          this.isActive = true;
          return true;
        }
        // 停止监听器
        stop() {
          if (!this.isActive) return false;
          if (this.originalXHR) {
            window.XMLHttpRequest = this.originalXHR;
          }
          if (this.originalFetch) {
            window.fetch = this.originalFetch;
          }
          this.isActive = false;
          return true;
        }
        // 添加回调函数
        addCallback(callback) {
          if (typeof callback === "function") {
            this.callbacks.push(callback);
          }
        }
        // 移除回调函数
        removeCallback(callback) {
          const index = this.callbacks.indexOf(callback);
          if (index > -1) {
            this.callbacks.splice(index, 1);
          }
        }
        // 获取监听器状态
        getStatus() {
          return this.isActive;
        }
      }
      const requestListener = new RequestListener();
      const _hoisted_1$3 = { class: "jihua-container" };
      const _sfc_main$4 = {
        __name: "chuangyi",
        setup(__props) {
          const message = naive.useMessage();
          const inputData = vue.ref("");
          const loading = vue.ref(false);
          const isEnable = vue.ref(false);
          function closeInfoStream(mediaIdList) {
            return fetch("https://galaxy.alibaba-inc.com/creativePlan/automatedSetUp", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "appname": "adcontent-op",
                "bx-v": "2.5.31",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
              },
              "referrer": "https://galaxy.alibaba-inc.com/",
              "body": JSON.stringify({
                "mediaCode": 0,
                "opType": 2,
                "taskOpType": 7,
                "taskType": 3,
                "name": !isEnable ? "创意开启" : "创意关闭",
                "campaignSettings": '{"startTime":null}',
                "unitSettings": "{}",
                "creativeSettings": !isEnable ? '{"status":1}' : '{"status":2}',
                "ext": '{"marketingTarget":4,"placement":1,"optimizeTarget":0,"type":"creative"}',
                "mediaIdList": mediaIdList
              }),
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
          }
          function closeSearch(mediaIdList) {
            return fetch("https://galaxy.alibaba-inc.com/creativePlan/automatedSetUp", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "appname": "adcontent-op",
                "bx-v": "2.5.31",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
              },
              "referrer": "https://galaxy.alibaba-inc.com/",
              "body": JSON.stringify({
                "mediaCode": 0,
                "opType": 2,
                "taskOpType": 7,
                "taskType": 3,
                "name": !isEnable ? "创意开启" : "创意关闭",
                "campaignSettings": '{"startTime":null}',
                "unitSettings": "{}",
                "creativeSettings": !isEnable ? '{"status":1}' : '{"status":2}',
                "ext": '{"marketingTarget":4,"placement":2,"optimizeTarget":0,"type":"creative"}',
                "mediaIdList": mediaIdList
              }),
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
          }
          function handleSubmit() {
            if (!inputData.value.trim()) {
              message.warning("请输入需要处理的数据");
              return;
            }
            loading.value = true;
            try {
              const rows = inputData.value.trim().split("\n").map((row) => row.trim().split("	"));
              const infoStreamMediaIds = [];
              const searchMediaIds = [];
              rows.forEach((row) => {
                if (row[0] === "信息流") {
                  infoStreamMediaIds.push(row[1]);
                } else if (row[0] === "搜索") {
                  searchMediaIds.push(row[1]);
                }
              });
              const promises = [];
              if (infoStreamMediaIds.length > 0) {
                promises.push(closeInfoStream(infoStreamMediaIds));
              }
              if (searchMediaIds.length > 0) {
                promises.push(closeSearch(searchMediaIds));
              }
              Promise.all(promises).then(() => {
                message.success("操作已提交成功");
                loading.value = false;
              }).catch((error) => {
                console.error("操作失败:", error);
                message.error("操作执行失败");
                loading.value = false;
              });
            } catch (error) {
              console.error("处理数据时出错:", error);
              message.error("数据处理失败");
              loading.value = false;
            }
          }
          return (_ctx, _cache) => {
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_checkbox = vue.resolveComponent("n-checkbox");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_space = vue.resolveComponent("n-space");
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
              vue.createVNode(_component_n_space, { vertical: "" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_input, {
                    value: inputData.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => inputData.value = $event),
                    type: "textarea",
                    placeholder: "请输入数据\n\n示例：\n搜索	2035614598\n信息流	2033338178\n搜索	2035670707",
                    autosize: { minRows: 10, maxRows: 15 },
                    clearable: ""
                  }, null, 8, ["value"]),
                  vue.createVNode(_component_n_checkbox, {
                    checked: isEnable.value,
                    "onUpdate:checked": _cache[1] || (_cache[1] = ($event) => isEnable.value = $event)
                  }, {
                    default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                      vue.createTextVNode(" 启用创意 (取消勾选则关闭创意) ", -1)
                    ])),
                    _: 1,
                    __: [2]
                  }, 8, ["checked"]),
                  vue.createVNode(_component_n_button, {
                    type: "primary",
                    onClick: handleSubmit,
                    loading: loading.value,
                    disabled: !inputData.value.trim()
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(loading.value ? "处理中..." : "提交执行"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ]),
                _: 1
              })
            ]);
          };
        }
      };
      const chuangyi = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-f7d071d3"]]);
      const _hoisted_1$2 = { class: "plan-container" };
      const _sfc_main$3 = {
        __name: "jihua",
        setup(__props) {
          const message = naive.useMessage();
          const mode = vue.ref("close");
          const budget = vue.ref(null);
          const inputData = vue.ref("");
          const loading = vue.ref(false);
          function buildPayload(planType, planIds, options) {
            const placementMap = {
              信息流: 1,
              搜索: 2
            };
            const placement = placementMap[planType];
            if (placement === void 0) {
              throw new Error(`未知的计划类型: "${planType}"`);
            }
            let campaignSettingsObj = {};
            let taskName = "";
            if (options.mode === "close") {
              campaignSettingsObj = { status: 2 };
              taskName = "关闭";
            } else if (options.mode === "adjust") {
              if (typeof options.budget !== "number" || options.budget <= 0) {
                throw new Error("预算金额无效。");
              }
              campaignSettingsObj = {
                campaignDayBudget: options.budget,
                startTime: "2025-08-01"
              };
              taskName = `调整预算至${options.budget}`;
            }
            const campaignSettings = JSON.stringify(campaignSettingsObj);
            const ext = JSON.stringify({
              marketingTarget: 4,
              placement,
              optimizeTarget: 0,
              type: "plan"
            });
            return {
              mediaCode: 0,
              opType: 2,
              taskOpType: options.mode === "close" ? 4 : 3,
              taskType: 1,
              name: taskName,
              campaignSettings,
              unitSettings: "{}",
              creativeSettings: "{}",
              ext,
              mediaIdList: planIds.map((id) => String(id))
              // 确保所有ID是字符串
            };
          }
          async function sendBulkRequest(planType, planIds, options) {
            const url = "https://galaxy.alibaba-inc.com/creativePlan/automatedSetUp";
            const actionText = options.mode === "close" ? "关闭" : `调价至 ${options.budget}`;
            console.log(
              `> 正在批量 [${actionText}] [${planType}] 类型的 ${planIds.length} 个计划...`
            );
            console.log("  ID 列表:", planIds);
            try {
              const payload = buildPayload(planType, planIds, options);
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  accept: "application/json, text/plain, */*",
                  "content-type": "application/json",
                  appname: "adcontent-op"
                },
                body: JSON.stringify(payload)
              });
              if (!response.ok) {
                throw new Error(`HTTP 错误! 状态码: ${response.status}`);
              }
              const result = await response.json();
              if (result.success || String(result.code) === "200") {
                message.success(`[${planType}] 类型的计划已提交 [${actionText}] 操作`);
                console.log(
                  `✅ [成功] [${planType}] 类型的计划已提交 [${actionText}] 操作。响应:`,
                  result.message || "OK"
                );
              } else {
                message.error(`[${planType}] 类型的计划操作失败`);
                console.error(
                  `❌ [失败] [${planType}] 类型的计划操作失败。业务响应:`,
                  result.message || result
                );
              }
            } catch (error) {
              message.error(`[${planType}] 类型的计划请求异常`);
              console.error(`❌ [失败] [${planType}] 类型的计划请求异常:`, error);
            }
          }
          function delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }
          const canSubmit = vue.computed(() => {
            if (!inputData.value.trim()) return false;
            if (mode.value === "adjust" && !budget.value) return false;
            return true;
          });
          async function handleSubmit() {
            if (!inputData.value.trim()) {
              message.warning("请输入需要处理的数据");
              return;
            }
            if (mode.value === "adjust" && !budget.value) {
              message.warning("请输入日预算金额");
              return;
            }
            loading.value = true;
            try {
              const options = {
                mode: mode.value,
                budget: budget.value
              };
              const groupedTasks = { 信息流: [], 搜索: [] };
              const lines = inputData.value.trim().split("\n");
              lines.forEach((line) => {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2 && parts[1]) {
                  const type = parts[0];
                  const id = parts[1];
                  if (groupedTasks[type]) {
                    groupedTasks[type].push(id);
                  } else {
                    console.warn(`! 跳过未知类型 "${type}" 的行: ${line}`);
                  }
                }
              });
              const infoStreamIds = groupedTasks["信息流"];
              const searchIds = groupedTasks["搜索"];
              if (infoStreamIds.length === 0 && searchIds.length === 0) {
                message.error("未能解析出任何有效的任务，请检查数据格式");
                loading.value = false;
                return;
              }
              let requestSent = false;
              if (infoStreamIds.length > 0) {
                await sendBulkRequest("信息流", infoStreamIds, options);
                requestSent = true;
              }
              if (searchIds.length > 0) {
                if (requestSent) {
                  await delay(1e3);
                }
                await sendBulkRequest("搜索", searchIds, options);
              }
              message.success("全部批量任务处理完毕！");
              loading.value = false;
            } catch (error) {
              console.error("处理数据时出错:", error);
              message.error("数据处理失败");
              loading.value = false;
            }
          }
          return (_ctx, _cache) => {
            const _component_n_radio = vue.resolveComponent("n-radio");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_radio_group = vue.resolveComponent("n-radio-group");
            const _component_n_input_number = vue.resolveComponent("n-input-number");
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_button = vue.resolveComponent("n-button");
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
              vue.createVNode(_component_n_space, { vertical: "" }, {
                default: vue.withCtx(() => [
                  _cache[6] || (_cache[6] = vue.createElementVNode("div", { class: "description" }, [
                    vue.createElementVNode("p", null, "请选择操作模式并输入需要处理的计划数据"),
                    vue.createElementVNode("p", null, "数据格式：平台 + Tab + 计划ID"),
                    vue.createElementVNode("p", null, "例如："),
                    vue.createElementVNode("pre", null, "搜索	2035614598\n信息流	2033338178\n搜索	2035670707")
                  ], -1)),
                  vue.createVNode(_component_n_radio_group, {
                    value: mode.value,
                    "onUpdate:value": _cache[0] || (_cache[0] = ($event) => mode.value = $event),
                    name: "mode"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_space, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_radio, { value: "close" }, {
                            default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                              vue.createTextVNode(" 批量关闭计划 ", -1)
                            ])),
                            _: 1,
                            __: [3]
                          }),
                          vue.createVNode(_component_n_radio, { value: "adjust" }, {
                            default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                              vue.createTextVNode(" 批量调整日预算 ", -1)
                            ])),
                            _: 1,
                            __: [4]
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value"]),
                  mode.value === "adjust" ? (vue.openBlock(), vue.createBlock(_component_n_input_number, {
                    key: 0,
                    value: budget.value,
                    "onUpdate:value": _cache[1] || (_cache[1] = ($event) => budget.value = $event),
                    placeholder: "请输入新的日预算金额",
                    min: 1,
                    clearable: ""
                  }, {
                    prefix: vue.withCtx(() => _cache[5] || (_cache[5] = [
                      vue.createTextVNode(" ¥ ", -1)
                    ])),
                    _: 1
                  }, 8, ["value"])) : vue.createCommentVNode("", true),
                  vue.createVNode(_component_n_input, {
                    value: inputData.value,
                    "onUpdate:value": _cache[2] || (_cache[2] = ($event) => inputData.value = $event),
                    type: "textarea",
                    placeholder: "请输入数据\n\n示例：\n搜索	2035614598\n信息流	2033338178\n搜索	2035670707",
                    autosize: { minRows: 10, maxRows: 15 },
                    clearable: ""
                  }, null, 8, ["value"]),
                  vue.createVNode(_component_n_button, {
                    type: "primary",
                    onClick: handleSubmit,
                    loading: loading.value,
                    disabled: !canSubmit.value
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(loading.value ? "处理中..." : "提交执行"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ]),
                _: 1,
                __: [6]
              })
            ]);
          };
        }
      };
      const jihua = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f977d1aa"]]);
      const _hoisted_1$1 = { class: "button-container" };
      const _sfc_main$2 = {
        __name: "app",
        setup(__props) {
          const showchuangyiModal = vue.ref(false);
          const showjihuaModal = vue.ref(false);
          const isListening = vue.ref(false);
          const message = naive.useMessage();
          const listenerCallback = (data) => {
            console.log("捕获到queryJobPs请求:", data);
            message.info(`捕获到${data.type}类型的queryJobPs请求`);
          };
          const toggleListener = () => {
            if (isListening.value) {
              requestListener.stop();
              requestListener.removeCallback(listenerCallback);
              isListening.value = false;
              message.success("已停止监听queryJobPs请求");
            } else {
              const started = requestListener.start();
              if (started) {
                requestListener.addCallback(listenerCallback);
                isListening.value = true;
                message.success("已开始监听queryJobPs请求");
              } else {
                message.warning("监听器已在运行中");
              }
            }
          };
          vue.onUnmounted(() => {
            if (isListening.value) {
              requestListener.stop();
              requestListener.removeCallback(listenerCallback);
            }
          });
          return (_ctx, _cache) => {
            const _component_n_icon = vue.resolveComponent("n-icon");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_alert = vue.resolveComponent("n-alert");
            const _component_n_modal = vue.resolveComponent("n-modal");
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
              vue.createVNode(_component_n_space, {
                justify: "space-between",
                wrap: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_button, {
                    type: "primary",
                    size: "large",
                    style: { "flex": "1", "min-width": "150px", "margin": "4px" },
                    onClick: _cache[0] || (_cache[0] = ($event) => showchuangyiModal.value = true)
                  }, {
                    icon: vue.withCtx(() => [
                      vue.createVNode(_component_n_icon, null, {
                        default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                          vue.createTextVNode(" 🐒 ", -1)
                        ])),
                        _: 1,
                        __: [4]
                      })
                    ]),
                    default: vue.withCtx(() => [
                      _cache[5] || (_cache[5] = vue.createTextVNode(" 创意关闭/开启 ", -1))
                    ]),
                    _: 1,
                    __: [5]
                  }),
                  vue.createVNode(_component_n_button, {
                    type: "info",
                    size: "large",
                    style: { "flex": "1", "min-width": "150px", "margin": "4px" },
                    onClick: _cache[1] || (_cache[1] = ($event) => showjihuaModal.value = true)
                  }, {
                    icon: vue.withCtx(() => [
                      vue.createVNode(_component_n_icon, null, {
                        default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                          vue.createTextVNode(" 🐒 ", -1)
                        ])),
                        _: 1,
                        __: [6]
                      })
                    ]),
                    default: vue.withCtx(() => [
                      _cache[7] || (_cache[7] = vue.createTextVNode(" 计划关闭/调价 ", -1))
                    ]),
                    _: 1,
                    __: [7]
                  }),
                  vue.createVNode(_component_n_button, {
                    type: isListening.value ? "error" : "warning",
                    size: "large",
                    style: { "flex": "1", "min-width": "150px", "margin": "4px" },
                    onClick: toggleListener
                  }, {
                    icon: vue.withCtx(() => [
                      vue.createVNode(_component_n_icon, null, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(isListening.value ? "⏹️" : "▶️"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" " + vue.toDisplayString(isListening.value ? "停止监听" : "开始监听"), 1)
                    ]),
                    _: 1
                  }, 8, ["type"]),
                  vue.createVNode(_component_n_button, {
                    type: "success",
                    size: "large",
                    style: { "flex": "1", "min-width": "150px", "margin": "4px" }
                  }, {
                    icon: vue.withCtx(() => [
                      vue.createVNode(_component_n_icon, null, {
                        default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                          vue.createTextVNode(" 🐒 ", -1)
                        ])),
                        _: 1,
                        __: [8]
                      })
                    ]),
                    default: vue.withCtx(() => [
                      _cache[9] || (_cache[9] = vue.createTextVNode(" 功能按钮4 ", -1))
                    ]),
                    _: 1,
                    __: [9]
                  })
                ]),
                _: 1
              }),
              isListening.value ? (vue.openBlock(), vue.createBlock(_component_n_alert, {
                key: 0,
                type: "info",
                style: { "margin-top": "20px" },
                closable: ""
              }, {
                icon: vue.withCtx(() => [
                  vue.createVNode(_component_n_icon, null, {
                    default: vue.withCtx(() => _cache[10] || (_cache[10] = [
                      vue.createTextVNode("🔊", -1)
                    ])),
                    _: 1,
                    __: [10]
                  })
                ]),
                default: vue.withCtx(() => [
                  _cache[11] || (_cache[11] = vue.createTextVNode(" 正在监听中...捕获到的queryJobPs请求将显示在浏览器控制台 ", -1))
                ]),
                _: 1,
                __: [11]
              })) : vue.createCommentVNode("", true),
              vue.createVNode(_component_n_modal, {
                show: showchuangyiModal.value,
                "onUpdate:show": _cache[2] || (_cache[2] = ($event) => showchuangyiModal.value = $event),
                preset: "card",
                style: { "width": "800px", "max-width": "90vw" },
                title: "批量关闭创意",
                bordered: false,
                "mask-closable": true,
                "close-on-esc": true
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(chuangyi)
                ]),
                _: 1
              }, 8, ["show"]),
              vue.createVNode(_component_n_modal, {
                show: showjihuaModal.value,
                "onUpdate:show": _cache[3] || (_cache[3] = ($event) => showjihuaModal.value = $event),
                preset: "card",
                style: { "width": "800px", "max-width": "90vw" },
                title: "计划批量关闭/调价操作",
                bordered: false,
                "mask-closable": true,
                "close-on-esc": true
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(jihua)
                ]),
                _: 1
              }, 8, ["show"])
            ]);
          };
        }
      };
      const zt = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c6e92986"]]);
      const _hoisted_1 = { class: "kuaishou-container" };
      const _sfc_main$1 = {
        __name: "kuaishou",
        setup(__props) {
          const message = naive.useMessage();
          const formData = vue.ref({
            batchData: ""
          });
          const emailConfig = vue.ref({
            apiKey: "",
            fromEmail: "",
            toEmails: ""
          });
          const isProcessing = vue.ref(false);
          const isSendingEmail = vue.ref(false);
          const logs = vue.ref([]);
          const parsedData = vue.ref([]);
          const selectors = {
            title: [
              'input[placeholder="请输入广告计划名称"]',
              "#ad_from_unitName_unitName input.ant-input",
              'input[placeholder="请输入创意名称"]'
            ],
            directLink: [
              'input[placeholder="填写后使用直达链接，不填则会使用落地页"]'
            ],
            h5Link: [
              'input[placeholder="请填写https://开头的链接；如投放原生广告，配置落地页应具备调起APP能力"]'
            ],
            exposure: [
              "#ad_from_monitorLinks_impressionUrl input",
              "#ad_from_monitorLinks_clickUrl input"
            ],
            click: [
              "#ad_from_monitorLinks_actionbarClickUrl input"
            ],
            other: [
              'input[placeholder="需遵守描述语规范，建议突出卖点和热点，有助于提升点击率，可在右侧预览展示效果"]'
            ]
          };
          vue.onMounted(() => {
            loadFromLocalStorage();
            addLog("快手广告填表工具已启动");
          });
          const loadFromLocalStorage = () => {
            formData.value.batchData = localStorage.getItem("ks_batchData") || "";
            emailConfig.value.apiKey = localStorage.getItem("ks_apiKey") || "";
            emailConfig.value.fromEmail = localStorage.getItem("ks_fromEmail") || "";
            emailConfig.value.toEmails = localStorage.getItem("ks_toEmails") || "";
          };
          const saveToLocalStorage = (key, value) => {
            localStorage.setItem(`ks_${key}`, value);
          };
          const addLog = (message2) => {
            const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
            logs.value.unshift(`[${timestamp}] ${message2}`);
            if (logs.value.length > 50) {
              logs.value = logs.value.slice(0, 50);
            }
          };
          const parseBatchData = () => {
            const lines = formData.value.batchData.trim().split("\n");
            return lines.map((line, index) => {
              const parts = line.trim().split("	");
              if (parts.length >= 3) {
                return {
                  index: index + 1,
                  title: parts[0] || "",
                  h5Link: parts[1] || "",
                  directLink: parts[2] || "",
                  isIOS: (parts[0] || "").includes("IOS") || (parts[0] || "").includes("iOS")
                };
              }
              return null;
            }).filter(Boolean);
          };
          const previewData = () => {
            parsedData.value = parseBatchData();
            if (parsedData.value.length === 0) {
              message.warning("请先输入有效的批量数据");
              return;
            }
            addLog(`解析完成，共 ${parsedData.value.length} 条数据`);
            message.success(`已解析 ${parsedData.value.length} 条数据`);
          };
          const setInputValue = (selectorArray, value) => {
            let successCount = 0;
            selectorArray.forEach((selector) => {
              try {
                const element = document.querySelector(selector);
                if (element) {
                  element.value = value;
                  const changeEvent = new Event("change", { bubbles: true });
                  element.dispatchEvent(changeEvent);
                  const inputEvent = new Event("input", { bubbles: true });
                  element.dispatchEvent(inputEvent);
                  const reactProp = Object.keys(element).find((p) => p.startsWith("__reactEventHandlers"));
                  if (reactProp && element[reactProp] && element[reactProp].onChange) {
                    element[reactProp].onChange(changeEvent);
                  }
                  successCount++;
                }
              } catch (error) {
                console.warn(`设置选择器 ${selector} 失败:`, error);
              }
            });
            return successCount;
          };
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          const fillFormData = async () => {
            if (!formData.value.batchData.trim()) {
              message.warning("请先输入批量数据");
              return;
            }
            isProcessing.value = true;
            try {
              const dataList = parseBatchData();
              if (dataList.length === 0) {
                message.warning("没有有效的数据可以处理");
                return;
              }
              addLog(`开始批量填充，共 ${dataList.length} 条数据`);
              const firstData = dataList[0];
              const titleCount = setInputValue(selectors.title, firstData.title);
              addLog(`填充标题: ${firstData.title} (成功 ${titleCount} 个字段)`);
              await delay(300);
              const directCount = setInputValue(selectors.directLink, firstData.directLink);
              addLog(`填充直达链接: ${firstData.directLink} (成功 ${directCount} 个字段)`);
              await delay(300);
              if (firstData.isIOS) {
                const h5Count = setInputValue(selectors.h5Link, firstData.h5Link);
                addLog(`检测到iOS，填充H5链接: ${firstData.h5Link} (成功 ${h5Count} 个字段)`);
              }
              message.success("表单填充完成");
              addLog("批量填充操作完成");
            } catch (error) {
              console.error("填充表单失败:", error);
              message.error("填充表单失败: " + error.message);
              addLog("填充失败: " + error.message);
            } finally {
              isProcessing.value = false;
            }
          };
          const sendEmail = async (to, subject, content) => {
            if (!emailConfig.value.apiKey) {
              throw new Error("请先配置SendGrid API Key");
            }
            const data = {
              personalizations: [{
                to: [{ email: to }],
                subject
              }],
              from: { email: emailConfig.value.fromEmail || "noreply@example.com" },
              content: [{
                type: "text/plain",
                value: content
              }]
            };
            try {
              const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${emailConfig.value.apiKey}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              });
              if (!response.ok) {
                throw new Error(`邮件发送失败: ${response.status}`);
              }
              return true;
            } catch (error) {
              console.error("邮件发送错误:", error);
              throw error;
            }
          };
          const testEmail = async () => {
            if (!emailConfig.value.toEmails) {
              message.warning("请先配置接收邮箱");
              return;
            }
            isSendingEmail.value = true;
            try {
              const emails = emailConfig.value.toEmails.split(",").map((email) => email.trim());
              const subject = "快手广告工具 - 测试邮件";
              const content = `这是一封来自快手广告填表工具的测试邮件。

发送时间: ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
              for (const email of emails) {
                await sendEmail(email, subject, content);
                addLog(`测试邮件已发送到: ${email}`);
              }
              message.success("测试邮件发送成功");
            } catch (error) {
              console.error("发送测试邮件失败:", error);
              message.error("发送测试邮件失败: " + error.message);
              addLog("邮件发送失败: " + error.message);
            } finally {
              isSendingEmail.value = false;
            }
          };
          const clearData = () => {
            const keys = ["batchData", "apiKey", "fromEmail", "toEmails"];
            keys.forEach((key) => {
              localStorage.removeItem(`ks_${key}`);
            });
            formData.value.batchData = "";
            emailConfig.value.apiKey = "";
            emailConfig.value.fromEmail = "";
            emailConfig.value.toEmails = "";
            parsedData.value = [];
            logs.value = [];
            message.success("已清除所有数据");
          };
          return (_ctx, _cache) => {
            const _component_n_input = vue.resolveComponent("n-input");
            const _component_n_text = vue.resolveComponent("n-text");
            const _component_n_form_item = vue.resolveComponent("n-form-item");
            const _component_n_space = vue.resolveComponent("n-space");
            const _component_n_collapse_item = vue.resolveComponent("n-collapse-item");
            const _component_n_collapse = vue.resolveComponent("n-collapse");
            const _component_n_button = vue.resolveComponent("n-button");
            const _component_n_grid_item = vue.resolveComponent("n-grid-item");
            const _component_n_grid = vue.resolveComponent("n-grid");
            const _component_n_tag = vue.resolveComponent("n-tag");
            const _component_n_table = vue.resolveComponent("n-table");
            const _component_n_log = vue.resolveComponent("n-log");
            const _component_n_card = vue.resolveComponent("n-card");
            return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              vue.createVNode(_component_n_card, {
                title: "快手广告填表工具",
                class: "tool-card"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_n_space, {
                    vertical: "",
                    size: 16
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_n_form_item, { label: "批量数据输入" }, {
                        feedback: vue.withCtx(() => [
                          vue.createVNode(_component_n_text, {
                            depth: "3",
                            style: { "font-size": "12px" }
                          }, {
                            default: vue.withCtx(() => _cache[8] || (_cache[8] = [
                              vue.createTextVNode(" 格式示例：广告计划名称-IOS https://example.com market://details?id=com.app ", -1)
                            ])),
                            _: 1,
                            __: [8]
                          })
                        ]),
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_input, {
                            value: formData.value.batchData,
                            "onUpdate:value": [
                              _cache[0] || (_cache[0] = ($event) => formData.value.batchData = $event),
                              _cache[1] || (_cache[1] = ($event) => saveToLocalStorage("batchData", $event))
                            ],
                            type: "textarea",
                            placeholder: "请按格式输入：标题名称[TAB]H5链接[TAB]直达链接，每行一条数据",
                            autosize: { minRows: 4, maxRows: 8 }
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_collapse, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_collapse_item, {
                            title: "邮件通知设置",
                            name: "email"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_space, { vertical: "" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_n_form_item, { label: "SendGrid API Key" }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_n_input, {
                                        value: emailConfig.value.apiKey,
                                        "onUpdate:value": [
                                          _cache[2] || (_cache[2] = ($event) => emailConfig.value.apiKey = $event),
                                          _cache[3] || (_cache[3] = ($event) => saveToLocalStorage("apiKey", $event))
                                        ],
                                        type: "password",
                                        placeholder: "请输入SendGrid API Key"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_n_form_item, { label: "发送邮箱" }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_n_input, {
                                        value: emailConfig.value.fromEmail,
                                        "onUpdate:value": [
                                          _cache[4] || (_cache[4] = ($event) => emailConfig.value.fromEmail = $event),
                                          _cache[5] || (_cache[5] = ($event) => saveToLocalStorage("fromEmail", $event))
                                        ],
                                        placeholder: "请输入发送邮箱地址"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  }),
                                  vue.createVNode(_component_n_form_item, { label: "接收邮箱" }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_n_input, {
                                        value: emailConfig.value.toEmails,
                                        "onUpdate:value": [
                                          _cache[6] || (_cache[6] = ($event) => emailConfig.value.toEmails = $event),
                                          _cache[7] || (_cache[7] = ($event) => saveToLocalStorage("toEmails", $event))
                                        ],
                                        placeholder: "请输入接收邮箱，多个用逗号分隔"
                                      }, null, 8, ["value"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_n_grid, {
                        cols: 2,
                        "x-gap": 12,
                        "y-gap": 12
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "primary",
                                block: "",
                                size: "large",
                                onClick: fillFormData,
                                loading: isProcessing.value
                              }, {
                                icon: vue.withCtx(() => _cache[9] || (_cache[9] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "✏️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[10] || (_cache[10] = vue.createTextVNode(" 批量填充表单 ", -1))
                                ]),
                                _: 1,
                                __: [10]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "info",
                                block: "",
                                size: "large",
                                onClick: testEmail,
                                loading: isSendingEmail.value
                              }, {
                                icon: vue.withCtx(() => _cache[11] || (_cache[11] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "📧", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[12] || (_cache[12] = vue.createTextVNode(" 发送测试邮件 ", -1))
                                ]),
                                _: 1,
                                __: [12]
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "warning",
                                block: "",
                                size: "large",
                                onClick: clearData
                              }, {
                                icon: vue.withCtx(() => _cache[13] || (_cache[13] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "🗑️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[14] || (_cache[14] = vue.createTextVNode(" 清除所有数据 ", -1))
                                ]),
                                _: 1,
                                __: [14]
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_n_grid_item, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_button, {
                                type: "success",
                                block: "",
                                size: "large",
                                onClick: previewData
                              }, {
                                icon: vue.withCtx(() => _cache[15] || (_cache[15] = [
                                  vue.createElementVNode("span", { style: { "font-size": "16px" } }, "👁️", -1)
                                ])),
                                default: vue.withCtx(() => [
                                  _cache[16] || (_cache[16] = vue.createTextVNode(" 预览解析数据 ", -1))
                                ]),
                                _: 1,
                                __: [16]
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      parsedData.value.length > 0 ? (vue.openBlock(), vue.createBlock(_component_n_collapse, { key: 0 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_collapse_item, {
                            title: "数据预览",
                            name: "preview"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_table, {
                                bordered: false,
                                "single-line": false,
                                size: "small"
                              }, {
                                default: vue.withCtx(() => [
                                  _cache[17] || (_cache[17] = vue.createElementVNode("thead", null, [
                                    vue.createElementVNode("tr", null, [
                                      vue.createElementVNode("th", null, "序号"),
                                      vue.createElementVNode("th", null, "标题名称"),
                                      vue.createElementVNode("th", null, "H5链接"),
                                      vue.createElementVNode("th", null, "直达链接"),
                                      vue.createElementVNode("th", null, "是否iOS")
                                    ])
                                  ], -1)),
                                  vue.createElementVNode("tbody", null, [
                                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(parsedData.value, (item, index) => {
                                      return vue.openBlock(), vue.createElementBlock("tr", { key: index }, [
                                        vue.createElementVNode("td", null, vue.toDisplayString(index + 1), 1),
                                        vue.createElementVNode("td", null, vue.toDisplayString(item.title), 1),
                                        vue.createElementVNode("td", null, vue.toDisplayString(item.h5Link), 1),
                                        vue.createElementVNode("td", null, vue.toDisplayString(item.directLink), 1),
                                        vue.createElementVNode("td", null, [
                                          vue.createVNode(_component_n_tag, {
                                            type: item.isIOS ? "success" : "default",
                                            size: "small"
                                          }, {
                                            default: vue.withCtx(() => [
                                              vue.createTextVNode(vue.toDisplayString(item.isIOS ? "iOS" : "普通"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["type"])
                                        ])
                                      ]);
                                    }), 128))
                                  ])
                                ]),
                                _: 1,
                                __: [17]
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : vue.createCommentVNode("", true),
                      logs.value.length > 0 ? (vue.openBlock(), vue.createBlock(_component_n_collapse, { key: 1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_n_collapse_item, {
                            title: "操作日志",
                            name: "logs"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_n_log, {
                                log: logs.value.join("\n"),
                                rows: 6
                              }, null, 8, ["log"])
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
            ]);
          };
        }
      };
      const kuaishou = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7227acb7"]]);
      const _sfc_main = {
        __name: "App",
        setup(__props) {
          const active = vue.ref(false);
          const placement = vue.ref("right");
          const activate = (place) => {
            active.value = true;
            placement.value = place;
          };
          const currentComponent = vue.computed(() => {
            const url = window.location.href;
            if (url.includes("xiaohongshu.com") || url.includes("xhslink.com")) {
              return XHS;
            }
            if (url.includes("galaxy.alibaba-inc.com")) {
              return zt;
            }
            if (url.includes("ad.e.kuaishou.com")) {
              return kuaishou;
            }
            return DefaultComponent;
          });
          return (_ctx, _cache) => {
            const _component_n_icon = vue.resolveComponent("n-icon");
            const _component_n_float_button = vue.resolveComponent("n-float-button");
            const _component_n_drawer_content = vue.resolveComponent("n-drawer-content");
            const _component_n_drawer = vue.resolveComponent("n-drawer");
            const _component_n_message_provider = vue.resolveComponent("n-message-provider");
            return vue.openBlock(), vue.createBlock(_component_n_message_provider, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_n_float_button, {
                  type: "primary",
                  position: "fixed",
                  right: 24,
                  bottom: 24,
                  onClick: _cache[0] || (_cache[0] = ($event) => activate("right"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_n_icon, null, {
                      default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                        vue.createTextVNode(" 🐒 ", -1)
                      ])),
                      _: 1,
                      __: [2]
                    })
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_n_drawer, {
                  show: active.value,
                  "onUpdate:show": _cache[1] || (_cache[1] = ($event) => active.value = $event),
                  width: 502,
                  placement: placement.value
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_n_drawer_content, { title: "工具箱 by.qjj" }, {
                      default: vue.withCtx(() => [
                        _cache[3] || (_cache[3] = vue.createTextVNode(" 通用工具箱 ", -1)),
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(currentComponent.value)))
                      ]),
                      _: 1,
                      __: [3]
                    })
                  ]),
                  _: 1
                }, 8, ["show", "placement"])
              ]),
              _: 1
            });
          };
        }
      };
      if (window.self === window.top) {
        vue.createApp(_sfc_main).use(naive).mount(
          (() => {
            const app = document.createElement("div");
            app.style.position = "absolute";
            app.style.top = "0";
            app.style.left = "0";
            app.style.zIndex = "10000";
            document.body.append(app);
            return app;
          })()
        );
      } else {
        console.log("在 iframe 中，不加载应用");
      }
    }
  });
  require_main_001();

})(Vue, naive);
