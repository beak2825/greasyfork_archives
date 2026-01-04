// ==UserScript==
// @name         tampermonkey-xinbang
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  暂无
// @author       simsir
// @run-at       document-start
// @match        https://www.newrank.cn/*/*
// @icon         https://chs.newrank.cn/favicon/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT License
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://update.greasyfork.org/scripts/455943/1270016/ajaxHooker.js
// @downloadURL https://update.greasyfork.org/scripts/483918/tampermonkey-xinbang.user.js
// @updateURL https://update.greasyfork.org/scripts/483918/tampermonkey-xinbang.meta.js
// ==/UserScript==
(function() {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = "\n.app[data-v-c6963245] {\n  position: fixed;\n  right: 0px;\n  top: 0px;\n  height: 100vh;\n  width: 380px;\n  z-index: 1999999999999;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);\n  transition: all 0.3s ease-out;\n  box-sizing: border-box;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n}\n.app-switch[data-v-c6963245] {\n  position: absolute;\n  top: 50%;\n  left: 0px;\n  transform: translate(-100%, -50%);\n  width: 28px;\n  font-size: 14px;\n  padding: 10px 7px;\n  border-radius: 8px 0px 0px 8px;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);\n  text-align: center;\n  line-height: 20px;\n}\n.app-switch[data-v-c6963245]:hover {\n  cursor: pointer;\n}\n.app-hidden[data-v-c6963245] {\n  transform: translateX(100%);\n}\n.app-show[data-v-c6963245] {\n  transform: translateX(0%);\n}\n.app-body[data-v-c6963245] {\n  max-height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.app-foot[data-v-c6963245] {\n  margin-top: auto;\n  text-align: center;\n}\n.dmt-ios-glass {\n  backdrop-filter: saturate(180%) blur(10px);\n  background-color: rgba(255, 255, 255, 0.87);\n}\n\n.dmt-font {\n  font-size: 14px;\n  color: rgba(0, 0, 0, 0.9);\n}\n\n.dmt-color {\n  color: #1d6b40;\n}\n\n.dmt-link {\n  color: #1677ff;\n}\n\n.dmt-button {\n  outline: none;\n  position: relative;\n  display: inline-block;\n  font-weight: 400;\n  white-space: nowrap;\n  text-align: center;\n  background-image: none;\n  background-color: transparent;\n  border: 1px solid transparent;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);\n  user-select: none;\n  touch-action: manipulation;\n  line-height: 1.5714285714285714;\n  border-radius: 40px;\n  padding-inline-start: 20px;\n  padding-inline-end: 20px;\n  font-size: 14px;\n  height: 40px;\n  padding: 6px 15px;\n  color: #fff;\n  background-color: #1d6b40;\n  /* box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1); */\n  width: 100%;\n}\n\n.dmt-button-white {\n  background-color: #ffffff;\n  border-color: #d9d9d9;\n  color: rgba(0, 0, 0, 0.88);\n  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);\n}\n\n.dmt-input-group {\n  border-radius: 8px;\n  overflow: hidden;\n  background-color: #f8f8f8;\n  box-sizing: border-box;\n  padding: 0px 10px;\n}\n\n.dmt-input {\n  display: flex;\n  align-items: center;\n  height: 38px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.02);\n}\n\n.dmt-input:last-child {\n  border-bottom: none;\n}\n\n.dmt-input label {\n  width: 120px;\n}\n\n.dmt-input input {\n  text-align: right;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 4px 11px;\n  display: inline-block;\n  width: 100%;\n  min-width: 0;\n  background-image: none;\n  border: none;\n  background-color: transparent;\n  outline: none;\n}\n\n.tabs {\n  --bg-color: rgba(0, 0, 0, 0.1);\n  --color: #333;\n  padding: 0px 6px;\n  position: relative;\n  background-color: var(--bg-color);\n  border-radius: 20px;\n  height: 42px;\n  flex-shrink: 0;\n}\n.tab-menu {\n  position: absolute;\n  left: 0;\n  top: 5px;\n  display: flex;\n  width: 100%;\n  z-index: 2;\n}\n.tab-current {\n  position: absolute;\n  left: 6px;\n  top: 5px;\n  box-shadow: 0px 3px 8px rgba(var(--gray-rgb-99), 0.12), 0px 3px 1px rgba(var(--gray-rgb-99), 0.04);\n  background-color: #fff;\n  width: calc(50% - 3px);\n  height: 32px;\n  border-radius: 32px;\n  transition: all 0.3s;\n}\n.tab {\n  width: calc(50% - 3px);\n  height: 32px;\n  border-radius: 32px;\n  color: var(--color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 14px;\n  margin-left: 6px;\n}\n.tab:first-child {\n  margin-left: 0px;\n}\n.tab:hover {\n  cursor: pointer;\n}\n\n.flex-grow {\n  flex-grow: 1;\n}\n\n.flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.flex-shrink {\n  flex-shrink: 0;\n}\n\n@media (prefers-color-scheme: dark) {\n  .dmt-ios-glass {\n    background-color: rgba(20, 20, 20, 0.87);\n  }\n\n  .dmt-font {\n    color: #f9f9f9;\n  }\n\n  .tabs {\n    --bg-color: rgba(255, 255, 255, 0.1);\n    --color: #666;\n  }\n\n  .dmt-input-group {\n    background-color: #080808;\n  }\n  .dmt-input {\n    border-bottom: 1px solid #383838;\n  }\n}\n";
  document.head.appendChild(__vite_style__);
  function format(format2, time) {
    const now = time ? new Date(time) : /* @__PURE__ */ new Date();
    const map = {
      y: now.getFullYear(),
      M: now.getMonth() + 1 > 9 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`,
      d: now.getDate() > 9 ? now.getDate() : `0${now.getDate()}`,
      h: now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`,
      m: now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`,
      s: now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`
    };
    const res = [];
    for (let i = 0; i < format2.length; i++) {
      if (map[format2.charAt(i)]) {
        res.push(map[format2.charAt(i)]);
      } else {
        res.push(format2.charAt(i));
      }
    }
    return res.join("");
  }
  function useVisible() {
    const visible = Vue.ref(false);
    const toggleVisible = () => {
      visible.value = !visible.value;
    };
    return {
      visible,
      toggleVisible
    };
  }
  function useRun() {
    const isRun = Vue.ref(false);
    const isFinish = Vue.ref(false);
    const logs = Vue.ref([]);
    const _runData = Vue.ref({
      name: "",
      list: [],
      time: 5,
      maxLength: 3,
      clickCount: 0
      // 防止循环点击
    });
    const _getTrList = () => {
      const tbody = document.querySelector("table").querySelector("tbody");
      const tr = tbody.querySelectorAll("tr[data-row-key]");
      return tr;
    };
    const _searchClickDiv = (index) => {
      const trs = _getTrList();
      const tds = trs[index].querySelectorAll("td");
      const divs = tds[0].querySelectorAll("div");
      let clickdiv = void 0;
      divs.forEach((div) => {
        if (/查看作品/.test(div.innerHTML)) {
          clickdiv = div;
        }
      });
      return clickdiv;
    };
    const start = (index) => {
      const trs = _getTrList();
      const clickdiv = _searchClickDiv(index);
      if (clickdiv) {
        logs.value.push(`将自动点击第${index + 1}行并进行链接数据拦截...`);
        window.GLOBAL_DATA.ajax("searchWork", (res) => {
          logs.value.push(`成功拦截第${index + 1}行数据...`);
          try {
            if (res.json && res.json.code === 2e3 && res.json.data && res.json.data.workDetailVos && res.json.data.workDetailVos.length) {
              const data = res.json.data;
              const tds = trs[index].querySelectorAll("td");
              const json = {
                account: trs[index].querySelector("a span").textContent.trim(),
                tag: data.tags && data.tags.length ? data.tags.join("|") : "",
                content: ""
              };
              for (let index2 = 3; index2 < 10; index2++) {
                json[`td${index2 - 3}`] = tds[index2].textContent.trim();
              }
              data.workDetailVos.forEach((element, elementi) => {
                json[`url${elementi + 1}`] = element.linkUrl;
                json[`title${elementi + 1}`] = element.title.replace(/\s/g, "").replace(",", "，");
                json[`count${elementi + 1}`] = element.clickCount;
                json[`pubTime${elementi + 1}`] = element.pubTime;
              });
              _runData.value.list.push(json);
              next(index);
            } else {
              logs.value.push(`第${index + 1}行接口数据存在问题，将自动跳过...`);
              next(index);
            }
          } catch (error) {
            console.log(error);
            logs.value.push(`捕获到错误，请截图反馈...`);
            logs.value.push(`${JSON.stringify(error)}`);
          }
        });
        clickdiv.click();
      } else {
        logs.value.push(`第${index + 1}行找不到展开按钮，无法获取链接，将自动跳到下一行...`);
      }
    };
    const next = (current) => {
      window.GLOBAL_DATA.unajax("searchWork");
      if (current >= _runData.value.maxLength - 1) {
        logs.value.push(`已完成点击所有行，正在处理数据...`);
        urlToText(current).then(() => {
          download(_runData.value.list);
          over();
        });
        return;
      }
      logs.value.push(`等待${_runData.value.time}秒后自动点击第${current + 2}行...`);
      urlToText(current).then(() => {
        setTimeout(() => {
          start(current + 1);
        }, _runData.value.time * 1e3);
      });
    };
    const over = () => {
      isFinish.value = true;
      isRun.value = false;
    };
    const urlToText = (current) => {
      return new Promise((resolve) => {
        resolve(current);
      });
    };
    const download = (json) => {
      let str = `公众号,标签,总阅读数,头条,平均,最高,总点赞数,总在看数,文章,文章阅读数,发布时间,链接,纯文字`;
      str += `
    `;
      for (let i = 0; i < json.length; i++) {
        str += `${json[i].account + "	"},`;
        str += `${json[i].tag + "	"},`;
        for (let index = 0; index < 6; index++) {
          str += `${json[i][`td${index}`] + "	"},`;
        }
        for (let index = 0; index < 1; index++) {
          if (json[i][`url${index + 1}`]) {
            str += `${json[i][`title${index + 1}`] + "	"},`;
            str += `${json[i][`count${index + 1}`] + "	"},`;
            str += `${json[i][`pubTime${index + 1}`] + "	"},`;
            str += `${json[i][`url${index + 1}`] + "	"},`;
            str += `${json[i]["content"] + "	"},`;
          } else {
            str += `${"-	"},`;
            str += `${"-	"},`;
            str += `${"-	"},`;
            str += `${"-	"},`;
          }
        }
        str += `
      `;
      }
      const dataUrl = "data:text/csv;charset=utf-8," + encodeURIComponent(str);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${_runData.value.name}.csv`;
      logs.value.push(`${format("y-M-d h:m")}: 成功导出${_runData.value.name}.csv`);
      link.click();
      link.remove();
    };
    const run = (name2, config) => {
      if (isRun.value) {
        return;
      }
      logs.value = [];
      isFinish.value = false;
      isRun.value = true;
      _runData.value.clickCount = 0;
      _runData.value.list = [];
      _runData.value.name = name2;
      _runData.value.time = config.time;
      _runData.value.maxLength = config.maxLength;
      logs.value.push(`程序已启动，请勿刷新页面或点击操作按钮...`);
      start(0);
    };
    return {
      run,
      isRun,
      isFinish,
      logs
    };
  }
  const app_vue_vue_type_style_index_0_scoped_c6963245_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (Vue.pushScopeId("data-v-c6963245"), n = n(), Vue.popScopeId(), n);
  const _hoisted_1 = {
    key: 0,
    class: "flex-center flex-grow"
  };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("div", { class: "dmt-font" }, "请先登录", -1));
  const _hoisted_3 = [
    _hoisted_2
  ];
  const _hoisted_4 = {
    key: 1,
    class: "flex-center flex-grow"
  };
  const _hoisted_5 = { class: "dmt-font" };
  const _hoisted_6 = { class: "app-body" };
  const _hoisted_7 = {
    key: 0,
    class: "dmt-color",
    style: { "font-size": "16px", "margin-bottom": "16px", "font-weight": "bold" }
  };
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("div", { class: "dmt-font" }, "运行日志：", -1));
  const _hoisted_9 = {
    class: "flex-shrink",
    style: { "margin-top": "16px" }
  };
  const _hoisted_10 = { class: "dmt-input-group" };
  const _hoisted_11 = { class: "dmt-input dmt-font" };
  const _hoisted_12 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("label", { class: "flex-shrink" }, "自动点击间隔秒数", -1));
  const _hoisted_13 = ["value"];
  const _hoisted_14 = { class: "dmt-input dmt-font" };
  const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("label", { class: "flex-shrink" }, "导出榜单数量", -1));
  const _hoisted_16 = ["value"];
  const _hoisted_17 = { class: "app-foot flex-shrink" };
  const _hoisted_18 = { class: "dmt-font" };
  const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("span", null, [
    /* @__PURE__ */ Vue.createElementVNode("a", {
      href: "https://ne8p66imfs.feishu.cn/docx/ZVQGdI74doPRDnxlTEVcEl19nde?from=from_copylink",
      target: "_blank",
      style: { "margin-left": "8px" },
      class: "dmt-link"
    }, "帮助文档")
  ], -1));
  const _sfc_main = {
    __name: "app",
    setup(__props) {
      const token = Vue.ref(window.GLOBAL_TOKEN);
      const version2 = Vue.ref(window.GLOBAL_DATA.version);
      const msg = Vue.ref("");
      const titleMap = {
        "weixin": "公众号",
        "gongzhonghao": "公众号"
      };
      const page = Vue.ref({
        date: "识别失败",
        title: "",
        rank: ""
      });
      const config = Vue.ref({
        max: "",
        time: 5
      });
      const { visible, toggleVisible } = useVisible();
      const { run, isRun, logs } = useRun();
      const start = () => {
        if (!/\d+/.test(config.value.time)) {
          alert("秒数只能输入数字");
          return;
        }
        if (config.value.max && !/\d+/.test(config.value.max)) {
          alert("榜单数只能输入数字");
          return;
        }
        run(page.value.title ? `${page.value.date}_${page.value.title}${page.value.rank}` : `${format("y-M-d h:m")}`, {
          maxLength: config.value.max ? Number(config.value.max) : 0,
          time: config.value.time
        });
      };
      const toggleVisibleWrap = () => {
        toggleVisible();
        if (visible.value) {
          if (!/weixin|gongzhonghao/.test(window.location.pathname)) {
            msg.value = "目前仅支持公众号榜";
            return;
          }
          const res = window.location.pathname.split("/");
          const defatulDate = (/* @__PURE__ */ new Date()).getTime() - 24 * 60 * 60 * 1e3;
          page.value.title = titleMap[res[2]];
          if (!res[3]) {
            page.value.rank = "日榜";
            page.value.date = format("y-M-d", defatulDate);
          } else {
            if (/\d+/.test(res[3]) && /\d+/.test(res[4])) {
              page.value.rank = "日榜";
              if (res[5]) {
                page.value.date = res[5];
              } else {
                page.value.date = format("y-M-d", defatulDate);
              }
            }
          }
        } else {
          page.value = {
            date: "",
            title: "",
            rank: ""
          };
          msg.value = "";
        }
      };
      const input = (event) => {
        config.value[event.target.dataset.key] = event.target.value;
      };
      Vue.onMounted(() => {
        setTimeout(() => {
          toggleVisibleWrap();
        }, 1e3);
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass({
            app: true,
            "dmt-ios-glass": true,
            "app-hidden": !Vue.unref(visible),
            "app-show": Vue.unref(visible)
          })
        }, [
          !token.value ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1, _hoisted_3)) : msg.value ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_4, [
            Vue.createElementVNode("div", _hoisted_5, Vue.toDisplayString(msg.value), 1)
          ])) : (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 2 }, [
            Vue.createElementVNode("div", _hoisted_6, [
              page.value.title ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_7, " 当前页：" + Vue.toDisplayString(page.value.date) + "的" + Vue.toDisplayString(page.value.title) + Vue.toDisplayString(page.value.rank) + "（如识别有误请刷新页面） ", 1)) : Vue.createCommentVNode("", true),
              Vue.unref(logs).length ? (Vue.openBlock(), Vue.createElementBlock(Vue.Fragment, { key: 1 }, [
                _hoisted_8,
                (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(Vue.unref(logs), (item, index) => {
                  return Vue.openBlock(), Vue.createElementBlock("div", {
                    class: "dmt-font",
                    style: { "margin-top": "6px" },
                    key: index
                  }, Vue.toDisplayString(item), 1);
                }), 128))
              ], 64)) : Vue.createCommentVNode("", true)
            ]),
            Vue.createElementVNode("div", _hoisted_9, [
              Vue.createElementVNode("div", _hoisted_10, [
                Vue.createElementVNode("div", _hoisted_11, [
                  _hoisted_12,
                  Vue.createElementVNode("input", {
                    value: config.value.time,
                    onInput: input,
                    class: "flex-grow",
                    "data-key": "time",
                    placeholder: "请输入自动点击间隔秒数",
                    maxlength: "2"
                  }, null, 40, _hoisted_13)
                ]),
                Vue.createElementVNode("div", _hoisted_14, [
                  _hoisted_15,
                  Vue.createElementVNode("input", {
                    value: config.value.max,
                    onInput: input,
                    class: "flex-grow",
                    "data-key": "max",
                    placeholder: "不输入则代表导出整个榜单"
                  }, null, 40, _hoisted_16)
                ])
              ]),
              Vue.createElementVNode("button", {
                class: "dmt-button",
                style: { "margin-bottom": "16px", "margin-top": "16px" },
                onClick: start
              }, Vue.toDisplayString(Vue.unref(isRun) ? "导出中..." : "导出榜单"), 1)
            ])
          ], 64)),
          Vue.createElementVNode("div", _hoisted_17, [
            Vue.createElementVNode("span", _hoisted_18, "v" + Vue.toDisplayString(version2.value), 1),
            _hoisted_19
          ]),
          Vue.createElementVNode("div", {
            class: "dmt-ios-glass dmt-font app-switch",
            onClick: toggleVisibleWrap
          }, Vue.toDisplayString(Vue.unref(visible) ? "隐藏" : "打开") + "下载工具 ", 1)
        ], 2);
      };
    }
  };
  const app = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c6963245"]]);
  const main = "";
  const name = "tampermonkey-xinbang";
  const version = "1.2.0";
  const description = "修复网站改版";
  const scripts = {
    dev: "vite build --mode dev",
    build: "vite build --mode prod"
  };
  const dependencies = {
    vue: "^3.2.47"
  };
  const devDependencies = {
    "@vitejs/plugin-vue": "^4.1.0",
    "rollup-plugin-external-globals": "^0.7.3",
    vite: "^4.2.1"
  };
  const packageJson = {
    name,
    "private": true,
    version,
    description,
    scripts,
    dependencies,
    devDependencies
  };
  const divid = packageJson.name;
  const isDevelopment = /baidu/.test(window.location.href);
  const ajaxMap = {};
  function searchQuery(url, key) {
    const split = url.split("?");
    let res = "";
    const reg = new RegExp(`${key}=`);
    if (split.length > 1 && reg.test(split[1])) {
      split[1].split("&").forEach((item) => {
        if (reg.test(item)) {
          if (item.indexOf("#") >= 0) {
            res = item.split("#")[0].split("=")[1];
          } else {
            res = item.split("=")[1];
          }
        }
      });
    }
    return res;
  }
  ajaxHooker.hook((request) => {
    if (/getLoginUser/.test(request.url)) {
      const token = searchQuery(request.url, "n-token");
      window.GLOBAL_TOKEN = token;
    } else if (/gw.newrank.cn\/api/.test(request.url)) {
      request.response = (res) => {
        const keys = Object.keys(ajaxMap);
        if (keys.length) {
          keys.forEach((key) => {
            if (request.url.indexOf(key) && ajaxMap[key]) {
              ajaxMap[key](res);
            }
          });
        }
      };
    }
  });
  $(function() {
    window.GLOBAL_DATA = {
      version: packageJson.version,
      isDevelopment,
      ajax(api, cb) {
        ajaxMap[api] = cb;
      },
      unajax(api) {
        ajaxMap[api] = void 0;
      }
    };
    GM_addElement(document.body, "div", {
      id: divid
    });
    Vue.createApp(app).mount(`#${divid}`);
    console.log(`${divid} 启动！`);
  });
})();
