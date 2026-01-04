// ==UserScript==
// @name         影刀自动刷课(xxdl)
// @namespace    npm/vite-plugin-monkey
// @version      0.0.2
// @author       monkey
// @description  影刀自动刷课,自动做选择题,自动下一节
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.yingdao.com/
// @match        https://college.yingdao.com/*
// @match        https://college.yingdao.com
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.32/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.iife.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.7/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/512528/%E5%BD%B1%E5%88%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28xxdl%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512528/%E5%BD%B1%E5%88%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28xxdl%29.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const r=document.createElement("style");r.textContent=n,document.head.append(r)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}#dia-box{position:fixed;top:0;right:0;z-index:2;margin:0;background-color:#9370db;display:flex;place-items:baseline;flex-direction:column;min-width:320px;min-height:100px}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.pointer[data-v-d6e839be]{pointer-events:auto!important}.logo[data-v-d6e839be]{height:6em;padding:1.5em;will-change:filter}.logo[data-v-d6e839be]:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.vue[data-v-d6e839be]:hover{filter:drop-shadow(0 0 2em #42b883aa)}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.aspect-square{aspect-ratio:1/1}.w-100\\%,.w-full{width:100%}.w-200{width:200px}.flex-row{flex-direction:row}.rounded-5{border-radius:5px}.rounded-l-20{border-top-left-radius:20px;border-bottom-left-radius:20px}.bg-blue-200{--un-bg-opacity:1;background-color:rgb(191 219 254 / var(--un-bg-opacity))}.bg-blue-300{--un-bg-opacity:1;background-color:rgb(147 197 253 / var(--un-bg-opacity))}.bg-blue-400{--un-bg-opacity:1;background-color:rgb(96 165 250 / var(--un-bg-opacity))}.bg-blue-500{--un-bg-opacity:1;background-color:rgb(59 130 246 / var(--un-bg-opacity))}.bg-gray{--un-bg-opacity:1;background-color:rgb(156 163 175 / var(--un-bg-opacity))}.bg-gray-200{--un-bg-opacity:1;background-color:rgb(229 231 235 / var(--un-bg-opacity))}.bg-slate-300{--un-bg-opacity:1;background-color:rgb(203 213 225 / var(--un-bg-opacity))}.px-5{padding-left:5px;padding-right:5px}.py-5{padding-top:5px;padding-bottom:5px}.filter{filter:var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)} ");

(function (vue, jquery, ElementPlus) {
  'use strict';

  function okMsg(title, msg = "") {
    if (msg) {
      ElementPlus.ElNotification({
        title,
        message: msg,
        type: "success"
      });
    } else {
      ElementPlus.ElNotification({
        title,
        type: "success"
      });
    }
  }
  function errMsg(title, msg = "") {
    if (msg) {
      ElementPlus.ElNotification({
        title,
        message: msg,
        type: "error"
      });
    } else {
      ElementPlus.ElNotification({
        title,
        type: "error"
      });
    }
  }
  function warnMsg(title, msg = "") {
    if (msg) {
      ElementPlus.ElNotification({
        title,
        message: msg,
        type: "warning"
      });
    } else {
      ElementPlus.ElNotification({
        title,
        type: "warning"
      });
    }
  }
  function filterLogList(type) {
    const logMain = jquery("#el-log-main");
    logMain.empty();
    let list = window.logList;
    if (type !== "all") {
      list = list.filter((i) => {
        return i.type === type;
      });
    }
    const dDiv = jquery("<div></div>");
    list.forEach((i) => {
      dDiv.append(getPByLog(i));
    });
    logMain.get()[0].append(dDiv.get()[0]);
  }
  function getPByLog(log) {
    const msg = log.id + " " + log.msg;
    let tex = jquery(`<p class="scrollbar-demo-item">${msg}</p>`);
    if (log.type === "warn") {
      tex = jquery(`<p style="color:indianred">${msg}</p>`);
    }
    if (log.type === "err") {
      tex = jquery(`<p style="color:darkred">${msg}</p>`);
    }
    tex.get()[0].style.whiteSpace = "pre-wrap";
    return tex;
  }
  function printLog(msg, type = "info") {
    if (!window.logListSize) {
      window.logListSize = 0;
    }
    let pojo = {
      type,
      msg,
      id: window.logListSize + 1
    };
    window.logListSize = pojo.id;
    const logMain = jquery("#el-log-main").get()[0];
    let log = getPByLog(pojo);
    logMain.prepend(log[0]);
    window.logList.unshift(pojo);
    if (type === "err") {
      errMsg(msg);
    }
  }
  function getOneByClassLike(className, eleName = "", needThrow = true) {
    const eles = jquery(`[class*=${className}]`);
    if (eles.length === 1) {
      return eles[0];
    }
    if (needThrow) {
      errMsg("元素获取失败", eleName);
      throw new Error("元素获取失败");
    }
  }
  function gotoOffSet(selectStr) {
    var _a;
    const ele = jquery(selectStr);
    let top = ((_a = ele.offset()) == null ? void 0 : _a.top) || 10;
    if (top > 10) {
      jquery(".ant-layout-content")[0].scrollTo(0, top);
    }
  }
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getOneByClassFull(className, eleName = "", needThrow = true) {
    const eles = jquery(className);
    if (eles.length === 1) {
      return eles[0];
    }
    if (needThrow) {
      errMsg("元素获取失败", eleName);
    } else {
      return null;
    }
  }
  function getOneById(id, eleName = "", needThrow = true) {
    const eles = jquery(`#${id}`);
    if (eles.length === 1) {
      return eles[0];
    }
    if (needThrow) {
      errMsg("元素获取失败", eleName);
    } else {
      return null;
    }
  }
  function getOneBySelect(xpath, eleName = "", needThrow = true) {
    const eles = jquery(xpath);
    if (eles.length === 1) {
      return eles[0];
    }
    if (needThrow) {
      errMsg("元素获取失败", eleName);
    } else {
      return null;
    }
  }
  function sleep(time) {
    const rate = window["ydExamRate"] ? window["ydExamRate"] : 3;
    time = rate * time;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, time);
    });
  }
  const _hoisted_1$1 = { class: "flex-row w-full" };
  const _hoisted_2$1 = { class: "bg-blue-300 px-5 py-5 rounded-l-20" };
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("div", null, " 设置等待的倍率 ", -1);
  const _hoisted_4 = /* @__PURE__ */ vue.createElementVNode("span", null, "等待倍率", -1);
  const _hoisted_5 = { class: "bg-blue-400 px-5 py-5 rounded-l-20" };
  const _hoisted_6 = { class: "bg-blue-500 px-5 py-5 rounded-l-20" };
  const _hoisted_7 = /* @__PURE__ */ vue.createElementVNode("span", { class: "w-full" }, "1. 先进入课程", -1);
  const _hoisted_8 = /* @__PURE__ */ vue.createElementVNode("span", { class: "w-full" }, "2. 点击左侧学习", -1);
  const _hoisted_9 = /* @__PURE__ */ vue.createElementVNode("span", { class: "w-full" }, "3. 考试题库,全自动脚本请联系: xxdlovo", -1);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "MainPage",
    props: {
      msg: {}
    },
    setup(__props) {
      const helpShow = vue.ref(false);
      const srcList = vue.ref([
        "https://img.picui.cn/free/2024/10/14/670c7b0d13805.png",
        "https://img.picui.cn/free/2024/10/14/670c7cfd42cf1.png",
        "https://img.picui.cn/free/2024/10/14/670c7d91d3e70.png"
      ]);
      const forceStop = vue.ref(false);
      const showHelp = () => {
        helpShow.value = !helpShow.value;
      };
      const autoExam = async () => {
        warnMsg("全自动刷课,可接入题库,自动考试/搜题. 高级版专享,联系xxdlovo");
      };
      const needStop = async () => {
        if (forceStop.value) {
          printLog("强制停止了", "err");
          throw new Error("强制停止了");
        }
      };
      const subExamSelectMock = async (lessonSection = "") => {
        await needStop();
        var exams = jquery("div[class^=radio_or_checkbox_box]").children();
        printLog("选择题个数: " + exams.length);
        gotoOffSet("div[class^=radio_or_checkbox_box]");
        for (let i = 0; i < exams.length; i++) {
          printLog("操作选择题..." + i);
          await needStop();
          const exam = exams[i];
          if (exam.style.display === "none") {
            continue;
          }
          const options = jquery(exam).find("li");
          const ele = options[getRandom(0, options.length - 1)];
          const itemClassName = ele.children[0].className;
          if (itemClassName.indexOf("ant-checkbox-wrapper-checked") === -1) {
            ele.click();
            await sleep(5);
          }
          if (i != exams.length - 1) {
            await manyClickExam(exam);
          }
          await manyClickExam(exam);
          await sleep(6);
        }
        const inputAnswer = jquery("#viewer_QuestionsAnswers .ant-input");
        printLog("输入题个数 " + inputAnswer.length);
        if (inputAnswer.length !== 0) {
          printLog("付费开启: xxdlovo", "warn");
        }
        const operation = jquery("#viewer_software_operation");
        printLog("操作题个数: " + operation.length);
        if (operation.length != 0) {
          printLog("付费开启: xxdlovo", "warn");
        }
      };
      const manyClickExam = async (exam) => {
        var _a;
        await needStop();
        const btnList = jquery(exam).find(".ant-btn-round");
        if (btnList) {
          for (let btn of btnList.children()) {
            await needStop();
            const btnName = btn.textContent.trim();
            console.log("按钮名称", btn.textContent.trim());
            if (btnName === "提 交" || btnName === "下一题" || btnName === "开启下一课") {
              await sleep(200);
              if ((_a = btn.parentElement) == null ? void 0 : _a.getAttributeNode("disabled")) {
                warnMsg("选项不能提交,请检查!");
                throw new Error("不能点击,请检查");
              }
              await sleep(10);
              btn.click();
              break;
            }
          }
        }
        console.log("不点了");
        return;
      };
      const leftTreeLearn = async () => {
        const href = window.location.href;
        if (href !== "https://college.yingdao.com/course/courseDetail") {
          warnMsg("请先进入学习页面");
          return;
        }
        await sleep(200);
        const leftTree = jquery("#course_detail_sidebar .list_item");
        for (let i = 0; i < leftTree.length; i++) {
          await needStop();
          let course = leftTree[i];
          const courseName = jquery(course).find(".list_item_text")[0].textContent;
          const isOk = jquery(course).find(".finished_icon");
          if (isOk.length === 1) {
            printLog(courseName, "学完了");
          } else {
            printLog(courseName, "还没学");
            course.click();
            await sleep(500);
            try {
              await learnBook(i === leftTree.length - 1);
            } catch (e) {
            }
          }
        }
        okMsg("恭喜,都学完了");
      };
      const ydExamRate = vue.ref(2);
      const setExamRate = () => {
        if (ydExamRate.value && ydExamRate.value > 0) {
          window["ydExamRate"] = ydExamRate.value;
        } else {
          window["ydExamRate"] = 3;
        }
        okMsg("设置成功");
      };
      const learnBook = async (isFinal = false) => {
        var _a, _b;
        await needStop();
        const href = window.location.href;
        if (href !== "https://college.yingdao.com/course/courseDetail") {
          warnMsg("请先进入学习页面");
          return;
        }
        await sleep(30);
        if (window.location.href !== "https://college.yingdao.com/course/courseDetail") {
          await warnMsg("请进入课程目标后再开始学习");
          return;
        }
        const lessonSection = (_a = getOneByClassFull(".list_item.active")) == null ? void 0 : _a.textContent;
        const finished = !!getOneByClassFull(".list_item.active .finished_icon", "是否完成", false);
        if (finished) {
          printLog("已学习! ->" + lessonSection);
        } else {
          printLog("未学习! ->" + lessonSection);
          await subExamSelectMock(lessonSection || "");
        }
        await okMsg(lessonSection || "", "完成学习");
        await sleep(50);
        let nextLesson = getOneByClassLike("next_lesson_button", "开启下一课/继续闯关按钮");
        nextLesson.click();
        if (isFinal) {
          await sleep(200);
          printLog("检测打分弹窗...");
          const close = getOneByClassLike("close___", "关闭打分", true);
          console.log("clode?", close);
          if (close) {
            close.click();
            return;
          }
        } else {
          for (let i = 0; i < 5; i++) {
            await needStop();
            const newTitle = (_b = getOneByClassFull(".list_item.active")) == null ? void 0 : _b.textContent;
            if (newTitle === lessonSection) {
              printLog("等待跳转...");
              await sleep(300);
              if (i === 4) {
                warnMsg("跳转超时");
                throw new Error("跳转超时");
              }
            } else {
              printLog("成功跳转...");
              break;
            }
          }
        }
        await sleep(200);
      };
      return (_ctx, _cache) => {
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_input_number = vue.resolveComponent("el-input-number");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_image = vue.resolveComponent("el-image");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createVNode(_component_el_divider, { "content-position": "left" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("基本信息")
              ]),
              _: 1
            }),
            vue.createElementVNode("div", _hoisted_2$1, [
              vue.createVNode(_component_el_row, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    type: "success",
                    onClick: showHelp
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("帮助")
                    ]),
                    _: 1
                  }),
                  !forceStop.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                    key: 0,
                    round: "",
                    type: "warning",
                    onClick: _cache[0] || (_cache[0] = ($event) => forceStop.value = !forceStop.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("暂停")
                    ]),
                    _: 1
                  })) : vue.createCommentVNode("", true),
                  forceStop.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                    key: 1,
                    round: "",
                    type: "success",
                    onClick: _cache[1] || (_cache[1] = ($event) => forceStop.value = !forceStop.value)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("继续")
                    ]),
                    _: 1
                  })) : vue.createCommentVNode("", true)
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_row, { class: "px-5 py-5" }, {
                default: vue.withCtx(() => [
                  _hoisted_3,
                  vue.createVNode(_component_el_input_number, {
                    modelValue: ydExamRate.value,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => ydExamRate.value = $event),
                    min: 1,
                    max: 10
                  }, {
                    prefix: vue.withCtx(() => [
                      _hoisted_4
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  vue.createVNode(_component_el_button, {
                    round: "",
                    type: "danger",
                    onClick: setExamRate
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("设置")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            vue.createVNode(_component_el_divider, { "content-position": "left" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("前置课程")
              ]),
              _: 1
            }),
            vue.createElementVNode("div", _hoisted_5, [
              vue.createVNode(_component_el_tooltip, {
                class: "box-item",
                effect: "dark",
                content: "进入课程页面,开始刷课",
                placement: "top-start"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    type: "success",
                    onClick: autoExam
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("课程学习")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_tooltip, {
                class: "box-item",
                effect: "dark",
                content: "找到下一个未学章节并进入",
                placement: "top-start"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    onClick: autoExam
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("继续闯关")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_tooltip, {
                class: "box-item",
                effect: "dark",
                content: "依次学习左侧的小节",
                placement: "top-start"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    onClick: leftTreeLearn
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("左侧学习")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_tooltip, {
                class: "box-item",
                effect: "dark",
                content: "只学习当前小节",
                placement: "top-start"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    onClick: _cache[3] || (_cache[3] = ($event) => learnBook(false))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("小节学习")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            vue.createVNode(_component_el_divider, { "content-position": "left" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("考试区")
              ]),
              _: 1
            }),
            vue.createElementVNode("div", _hoisted_6, [
              vue.createVNode(_component_el_row, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_button, {
                    round: "",
                    type: "success",
                    onClick: autoExam
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("自动答题")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ])
          ]),
          vue.createVNode(_component_el_dialog, {
            modelValue: helpShow.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => helpShow.value = $event),
            title: "帮助",
            width: "500"
          }, {
            default: vue.withCtx(() => [
              _hoisted_7,
              vue.createVNode(_component_el_image, {
                style: { "width": "100%", "height": "300px" },
                src: srcList.value[0],
                "preview-src-list": srcList.value
              }, null, 8, ["src", "preview-src-list"]),
              _hoisted_8,
              vue.createVNode(_component_el_image, {
                style: { "width": "100%", "height": "300px" },
                src: srcList.value[1],
                "preview-src-list": srcList.value
              }, null, 8, ["src", "preview-src-list"]),
              _hoisted_9,
              vue.createVNode(_component_el_image, {
                style: { "width": "100%", "height": "300px" },
                src: srcList.value[2],
                "preview-src-list": srcList.value
              }, null, 8, ["src", "preview-src-list"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  });
  const _hoisted_1 = { class: "w-100%" };
  const _hoisted_2 = { class: "bg-gray-200 w-100% px-5 py-5 rounded-5" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const mainPageShow = vue.ref(false);
      const clearLogHandle = () => {
        okMsg("日志已清空");
        window.logListSize = 0;
        window.logList = [];
        jquery("#el-log-main").empty();
      };
      const sleepLock = async () => {
        await sleep(500);
        console.log("清除");
        window.lockInitSkip = false;
      };
      const init = async () => {
        window.lockInit = true;
        await sleep(600);
        const mainInit = getOneById("mainInit", "操作按钮", false);
        if (mainInit) {
          window.lockInitSkip = true;
          window.lockInit = false;
          sleepLock();
          console.log("已初始化");
          return;
        }
        let main = null;
        console.log("重新已初始化");
        console.log(window.location.href);
        if (window.location.href === "https://college.yingdao.com/examination") {
          console.log(getOneBySelect("#examination_header > div:nth-child(3)"));
          main = getOneBySelect("#examination_header > div:nth-child(3)");
        } else {
          main = getOneByClassLike("login_right___", "主", false);
          if (!main) {
            main = getOneById("course_detail_header", "课程表格", false);
            if (main) {
              main = main.children[1];
            }
          }
        }
        window.logList = [];
        let div = document.createElement("div");
        div.setAttribute("float", "right");
        let aa = '<button id="mainInit" class="" style="font-weight: 600;padding-right: 10px;padding-top: 2px;padding-bottom: 2px;border-radius: 30px; background-color:#bfb2ff; color:purple">开始😀</button>';
        div.innerHTML = aa;
        if (main) {
          main.append(div);
        }
        jquery("#mainInit").on("click", function() {
          changeMainPage();
        });
        window.lockInit = false;
      };
      const changeMainPage = () => {
        mainPageShow.value = !mainPageShow.value;
      };
      var _wr = function(type) {
        var orig = history[type];
        return function() {
          var rv = orig.apply(this, arguments);
          var e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
        };
      };
      history.pushState = _wr("pushState");
      history.replaceState = _wr("replaceState");
      vue.onMounted(() => {
        init();
        window.addEventListener("replaceState", function(e) {
          if (window.lockInit || window.lockInitSkip) {
            return;
          }
          init();
        });
        window.addEventListener("popstate", function(event) {
          if (window.lockInit || window.lockInitSkip) {
            return;
          }
          init();
        });
        window.addEventListener("pushState", function(e) {
          if (window.lockInit || window.lockInitSkip) {
            return;
          }
          init();
        });
      });
      return (_ctx, _cache) => {
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: mainPageShow.value,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => mainPageShow.value = $event),
          title: "控制台(基础版)",
          width: "500",
          draggable: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", _hoisted_1, [
              vue.createVNode(_sfc_main$1, { msg: " " }),
              vue.createVNode(_component_el_divider, { "content-position": "left" }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("日志展示")
                ]),
                _: 1
              }),
              vue.createElementVNode("div", _hoisted_2, [
                vue.createVNode(_component_el_button, {
                  onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(filterLogList)("all"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("全部")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, {
                  onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(filterLogList)("warn")),
                  type: "warning"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("警告")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, {
                  onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(filterLogList)("err")),
                  type: "danger"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("错误")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, {
                  onClick: clearLogHandle,
                  type: "info"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("清空")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_scrollbar, {
                  id: "el-log-main",
                  height: "400px"
                })
              ])
            ], 512), [
              [vue.vShow, mainPageShow.value]
            ])
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d6e839be"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const app = vue.createApp(App);
  app.use(ElementPlus);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue, jQuery, ElementPlus);