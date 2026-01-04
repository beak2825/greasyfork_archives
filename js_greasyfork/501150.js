// ==UserScript==
// @name         Weibo auto sign and post.
// @namespace    https://liyoung1874.github.io/
// @version      0.0.6
// @author       https://liyoung1874.github.io/
// @description  Weibo auto register and post. 微博自动签到和发帖。
// @license      MIT
// @homepage     https://github.com/liyoung1874/browser-scripts#readme
// @homepageURL  https://github.com/liyoung1874/browser-scripts#readme
// @source       https://github.com/liyoung1874/browser-scripts.git
// @supportURL   https://github.com/liyoung1874/browser-scripts/issues
// @match        https://weibo.com/p*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.32/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/501150/Weibo%20auto%20sign%20and%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/501150/Weibo%20auto%20sign%20and%20post.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .configBtn[data-v-23d56050]{position:fixed;left:3rem;bottom:5rem;z-index:99999999!important}.content[data-v-23d56050]{display:flex;flex-direction:column;gap:2rem;padding:1rem 0}.flex-row[data-v-23d56050]{display:flex;flex-direction:row;gap:1rem;align-items:center} ");

(function (vue, ElementPlus) {
  'use strict';

  function setDebugNamespace(namespace) {
    if (window.localStorage) {
      localStorage.setItem("debug", `${namespace}*`);
    }
  }
  function sleep(delay = 1) {
    log("tools", `Waiting for ${delay} seconds ...`);
    return new Promise((resolve) => setTimeout(resolve, delay * 1e3));
  }
  function getDelayUntilNextTargetTime(targetHour, targetMinute = 0) {
    log(
      "tools",
      `Target time: ${targetHour > 9 ? targetHour : "0" + targetHour}:${targetMinute > 9 ? targetMinute : "0" + targetMinute}`
    );
    const now = /* @__PURE__ */ new Date();
    let targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      targetHour,
      targetMinute,
      0,
      0
    );
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    return targetTime - now;
  }
  function ms2str(ms) {
    let seconds = Math.floor(ms / 1e3);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  const log = (name, ...args) => {
    const message = args.join(" ");
    const time = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { hour12: false });
    console.log(`[${time}] ${name}: ${message}`);
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = {
    class: "content",
    style: { "width": "500px" }
  };
  const _hoisted_2 = { class: "flex-row" };
  const _hoisted_3 = { class: "flex-row" };
  const _hoisted_4 = { style: { "margin-top": "2rem", "text-align": "center" } };
  const __default__ = {
    name: "Weibo"
  };
  const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
    setup(__props) {
      const namespace = "weibo";
      setDebugNamespace("weibo");
      const logger = (...args) => log(namespace, ...args);
      const dialogVisible = vue.ref(false);
      vue.ref("");
      const stSwitch = vue.ref(false);
      const dailyTimer = vue.ref(null);
      const dailyDelay = vue.ref(null);
      const position = "bottom-right";
      const targetTime = vue.ref("9:00");
      let reloadTry = 3;
      const openDialog = async () => {
        logger("自动配置窗口打开！");
        dialogVisible.value = true;
      };
      const closeDialog = () => {
        dialogVisible.value = false;
        logger("自动配置窗口关闭！");
        if (stSwitch.value) {
          startDailyTask();
        } else {
          logger("清除自动签到任务！");
          clearTimeout(dailyDelay.value);
          clearInterval(dailyTimer.value);
        }
        saveConfig();
      };
      const saveConfig = () => {
        logger("保存配置！");
        localStorage.setItem(
          "weibo:config",
          JSON.stringify({
            stSwitch: stSwitch.value,
            reloadTry,
            targetTime: targetTime.value
          })
        );
      };
      const loadConfig = () => {
        logger("加载配置！");
        const config = JSON.parse(localStorage.getItem("weibo:config"));
        const { stSwitch: Switch, reloadTry: Try, targetTime: time } = config;
        stSwitch.value = Switch || false;
        reloadTry = Try || 3;
        targetTime.value = time || "9:00";
        logger("加载配置成功！");
        logger("自动签到配置", stSwitch.value);
        logger("签到时间", targetTime.value);
      };
      const autoRegister = async () => {
        await sleep(3);
        if (!isSuperIndex()) {
          logger("当前不在超话页面！");
          return;
        }
        if (!stSwitch.value) {
          logger("自动签到未开启！");
          return;
        }
        const btn = document.querySelector(
          '[action-data*="api=http://i.huati.weibo.com/aj/super/checkin"]'
        );
        if (!btn && reloadTry > 0) {
          logger("未找到签到或已签到按钮！");
          reloadTry -= 1;
          saveConfig();
          window.location.reload();
        } else if (!btn && reloadTry === 0) {
          logger("未找到签到或已签到按钮！");
          ElementPlus.ElNotification({
            title: "超话签到通知",
            message: `超话签到失败！未找到签到或已签到按钮！异常时间${(/* @__PURE__ */ new Date()).toLocaleString()}`,
            type: "error",
            duration: 0,
            position
          });
          return;
        }
        const flag = btn.innerHTML.includes("已签到");
        if (flag) {
          logger("当前超话已签到！");
          return;
        }
        await sleep();
        btn.click();
        const res = await handleError();
        if (res === "error" || res === "not sure") {
          return;
        }
        if (res === "warning") {
          await sleep();
          btn.click();
          return;
        }
        logger("签到成功！");
        reloadTry = 3;
        saveConfig();
        ElementPlus.ElNotification({
          title: "超话签到通知",
          message: `超话签到成功！签到时间${(/* @__PURE__ */ new Date()).toLocaleString()}`,
          type: "success",
          duration: 0,
          position
        });
      };
      const isSuperIndex = () => {
        return window.location.href.includes("https://weibo.com/p/") && window.location.href.includes("super_index");
      };
      const handleError = async () => {
        await sleep(3);
        const errConfirm = document.querySelector("a[action-type='ok']");
        if (errConfirm) {
          if (errConfirm.innerHTML.includes("解除异常")) {
            logger("出现解除异常提示！请手动解除异常！");
            ElementPlus.ElNotification({
              title: "超话签到通知",
              message: `超话签到异常！出现解除异常提示！请手动解除异常！解除异常后刷新页面重试。异常时间${(/* @__PURE__ */ new Date()).toLocaleString()}`,
              type: "error",
              duration: 0,
              position
            });
            return "error";
          } else if (errConfirm.innerHTML.includes("确定")) {
            logger("弹出异常提示！");
            errConfirm.click();
            logger("点击异常提示，关闭异常提示！");
            return "warning";
          } else {
            logger("未知异常！");
            ElementPlus.ElNotification({
              title: "超话签到通知",
              message: `超话签到异常！未知异常！异常时间${(/* @__PURE__ */ new Date()).toLocaleString()}`,
              type: "error",
              duration: 0,
              position
            });
            return "not sure";
          }
        }
        return true;
      };
      const startDailyTask = async () => {
        logger("开启自动签到任务！");
        clearTimeout(dailyDelay.value);
        clearInterval(dailyTimer.value);
        await autoRegister();
        const [hour, minute] = targetTime.value.split(":");
        const delay = getDelayUntilNextTargetTime(+hour, +minute);
        logger("距离下一次签到还有：", ms2str(delay));
        dailyDelay.value = setTimeout(() => {
          window.location.reload();
          dailyTimer.value = setInterval(() => {
            window.location.reload();
          }, 1e3 * 60 * 60 * 24);
        }, delay);
      };
      vue.onMounted(async () => {
        await sleep(3);
        loadConfig();
        if (stSwitch.value) {
          startDailyTask();
        }
      });
      return (_ctx, _cache) => {
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_time_select = vue.resolveComponent("el-time-select");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(vue.unref(ElementPlus.ElDialog), {
            title: "自动配置",
            center: "",
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => dialogVisible.value = $event),
            "close-on-click-modal": false,
            "close-on-press-escape": false,
            "show-close": false,
            "destroy-on-close": "",
            width: "65%"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", null, [
                vue.createElementVNode("div", _hoisted_1, [
                  vue.createElementVNode("div", _hoisted_2, [
                    vue.createVNode(_component_el_text, {
                      class: "mx-1",
                      size: "large"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("超话签到")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_switch, {
                      modelValue: stSwitch.value,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => stSwitch.value = $event),
                      "active-text": "开",
                      "inactive-text": "关"
                    }, null, 8, ["modelValue"])
                  ]),
                  vue.createElementVNode("div", _hoisted_3, [
                    vue.createVNode(_component_el_text, {
                      class: "mx-1",
                      size: "large"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("签到时间")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_time_select, {
                      modelValue: targetTime.value,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => targetTime.value = $event),
                      style: { "width": "240px" },
                      start: "06:30",
                      step: "00:30",
                      end: "23:30",
                      placeholder: "Select time"
                    }, null, 8, ["modelValue"])
                  ])
                ])
              ]),
              vue.createElementVNode("div", _hoisted_4, [
                vue.createVNode(vue.unref(ElementPlus.ElButton), {
                  size: "large",
                  type: "primary",
                  onClick: closeDialog
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("确定")
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(ElementPlus.ElButton), {
                  size: "large",
                  onClick: _cache[2] || (_cache[2] = ($event) => dialogVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("取消")
                  ]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(vue.unref(ElementPlus.ElButton), {
            type: "primary",
            class: "configBtn",
            onClick: openDialog
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("自动配置")
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-23d56050"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const app = vue.createApp(App);
  const appContainer = () => {
    const app2 = document.createElement("div");
    document.body.appendChild(app2);
    return app2;
  };
  app.use(ElementPlus).mount(appContainer());

})(Vue, ElementPlus);