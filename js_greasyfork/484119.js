// ==UserScript==
// @name         西柚英语辅助脚本
// @namespace    ravizhan/xiyou_crack
// @version      0.0.9
// @author       Ravi & awaxiaoyu
// @description  一键修改分数，一键获取答案，VIP破解。
// @license      AGPL-3.0-only
// @match        https://student.xiyouyingyu.com/*
// @require      https://registry.npmmirror.com/vue/3.3.4/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/element-plus/2.4.4/files/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://registry.npmmirror.com/element-plus/2.4.4/files/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484119/%E8%A5%BF%E6%9F%9A%E8%8B%B1%E8%AF%AD%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484119/%E8%A5%BF%E6%9F%9A%E8%8B%B1%E8%AF%AD%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
  'use strict';

  const d=new Set;const e = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  e(" .side-blank[data-v-c5510b64]{display:flex;flex-direction:column;margin-top:10px}.div-style[data-v-c5510b64]{white-space:pre-line;overflow:auto;height:300px;color:#000}.side-blank[data-v-da9845e4]{display:flex;flex-direction:column;margin-top:10px}.tip-text[data-v-da9845e4]{padding-bottom:15px}.side-blank[data-v-96104ecd]{display:flex;flex-direction:column;margin-top:10px}.div-style[data-v-96104ecd]{white-space:pre-line;overflow:auto;height:300px;color:#000}.setting_blank[data-v-bd57d942],.setting_blank[data-v-0e14c382]{display:flex;flex-direction:column;margin-top:10px}.div-style[data-v-0e14c382]{white-space:pre-line;overflow:auto;height:300px;color:#000} ");

  function processResponse(res, mode) {
    let answer = "";
    if (mode === 1) {
      for (let i of res) {
        console.log(i);
        if (i["name"] !== "模仿朗读" || i["name"] !== "单词或句子朗读") {
          for (let question of i["smallList"]) {
            for (let process of question["processList"]) {
              if (process["name"] === "录音作答") {
                let question_text = JSON.parse(process["content"])["showTxt"];
                let question_answer = String(process["oralTypeModel"]["answerTxt"]);
                question_answer = question_answer.replaceAll("<blockquote>", "");
                question_answer = question_answer.replaceAll("</blockquote>", "");
                answer += `
${question_text}

${question_answer}
`;
              }
              if (process["name"] === "选项勾选") {
                let data = JSON.parse(process["content"])["textModelList"];
                for (let a of data) {
                  if (a["showType"] === "3" || a["showType"] === "4") {
                    for (let b of JSON.parse(a["showTxt"])) {
                      let question_text = b["text"];
                      let question_answer = b["answer"];
                      answer += `
${question_text}

${question_answer}
`;
                    }
                  }
                  if (a["showType"] === "5") {
                    for (let b of JSON.parse(a["showTxt"])) {
                      let question_text = b["text"];
                      let question_answer = b["answers"][0];
                      answer += `
${question_text}

${question_answer}
`;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (mode === 2) {
      for (let i of res["titleList"]) {
        if (["单项选择", "重点词汇听写"].includes(i["questionsTypeName"])) {
          for (let question of i["writtenList"]) {
            let question_text = question["libList"][0]["titleType"]["text"];
            let question_answer = question["libList"][0]["titleType"]["answer"];
            answer += `
${question_text}

${question_answer}
`;
          }
        }
      }
    }
    return answer;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$4 = {
    data() {
      return {
        modifyDialogVisible: false,
        answerDialogVisible: false,
        score: 60,
        min: 0.7,
        max: 0.8
      };
    },
    computed: {
      answer() {
        return localStorage.getItem(window.location.hash.split("&")[0].split("id=")[1]);
      }
    },
    mounted() {
      if (localStorage.getItem("auto_modify_limit") !== null) {
        const data = JSON.parse(localStorage.getItem("auto_modify_limit"));
        this.score = data.score;
        this.min = data.min;
        this.max = data.max;
      }
      if (localStorage.getItem("modify_switch") == null) {
        localStorage.setItem("modify_switch", "false");
      }
      if (localStorage.getItem("modify_switch") === "true") {
        document.getElementById("btn2").innerText = "禁用";
      } else {
        document.getElementById("btn2").innerText = "启用";
      }
    },
    methods: {
      switch_mute: function() {
        const dom = document.querySelector("#app > div > div.paper-detail-container > div.content > div > div > div.substance > div > video");
        dom.muted = dom.muted === false;
        if (document.getElementById("btn1").innerText === "开启") {
          document.getElementById("btn1").innerText = "关闭";
        } else {
          document.getElementById("btn1").innerText = "开启";
        }
      },
      switch_modify: function() {
        if (document.getElementById("btn2").innerText === "启用") {
          document.getElementById("btn2").innerText = "禁用";
          this.modifyDialogVisible = true;
          localStorage.setItem("modify_switch", "true");
        } else {
          document.getElementById("btn2").innerText = "启用";
          localStorage.setItem("modify_switch", "false");
          ElementPlus.ElNotification({
            title: "Success",
            duration: 2e3,
            message: "分数修改已禁用",
            type: "success"
          });
        }
      },
      setting: function() {
        const data = {
          score: this.score,
          min: this.min,
          max: this.max
        };
        localStorage.setItem("auto_modify_limit", JSON.stringify(data));
        this.modifyDialogVisible = false;
        ElementPlus.ElNotification({
          title: "Success",
          duration: 2e3,
          message: "设置保存成功",
          type: "success"
        });
      }
    }
  };
  const _hoisted_1$4 = { class: "side-blank" };
  const _hoisted_2$3 = { style: { "text-align": "center", "padding-top": "10px" } };
  const _hoisted_3 = { class: "div-style" };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = vue.resolveComponent("el-button");
    const _component_el_input_number = vue.resolveComponent("el-input-number");
    const _component_el_col = vue.resolveComponent("el-col");
    const _component_el_row = vue.resolveComponent("el-row");
    const _component_el_dialog = vue.resolveComponent("el-dialog");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
      vue.createVNode(_component_el_button, {
        onClick: _cache[0] || (_cache[0] = ($event) => $data.answerDialogVisible = true)
      }, {
        default: vue.withCtx(() => [..._cache[9] || (_cache[9] = [
          vue.createTextVNode(" 参考答案 ", -1)
        ])]),
        _: 1
      }),
      _cache[17] || (_cache[17] = vue.createElementVNode("span", { style: { "text-align": "center" } }, "模仿朗读声音", -1)),
      vue.createVNode(_component_el_button, {
        id: "btn1",
        style: { "margin-left": "0", "margin-top": "5px" },
        onClick: _cache[1] || (_cache[1] = ($event) => $options.switch_mute())
      }, {
        default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
          vue.createTextVNode(" 开启 ", -1)
        ])]),
        _: 1
      }),
      _cache[18] || (_cache[18] = vue.createElementVNode("span", { style: { "text-align": "center" } }, "自动修改分数", -1)),
      vue.createVNode(_component_el_button, {
        id: "btn2",
        style: { "margin-left": "0", "margin-top": "5px" },
        onClick: _cache[2] || (_cache[2] = ($event) => $options.switch_modify())
      }, {
        default: vue.withCtx(() => [..._cache[11] || (_cache[11] = [
          vue.createTextVNode(" 启用 ", -1)
        ])]),
        _: 1
      }),
      vue.createVNode(_component_el_dialog, {
        modelValue: $data.modifyDialogVisible,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.modifyDialogVisible = $event),
        title: "设置",
        width: "40%",
        draggable: "",
        "align-center": ""
      }, {
        default: vue.withCtx(() => [
          _cache[16] || (_cache[16] = vue.createElementVNode("div", { style: { "padding-bottom": "10px", "text-align": "center" } }, " 自动修改分数设置 ", -1)),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[12] || (_cache[12] = vue.createElementVNode("div", null, " 低于多少分才修改 ", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.score,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.score = $event),
                    precision: 2,
                    step: 0.01,
                    max: 100,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[13] || (_cache[13] = vue.createElementVNode("div", null, "修改后最低分数百分比", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.max,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.max = $event),
                    precision: 1,
                    step: 0.1,
                    max: 1,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[14] || (_cache[14] = vue.createElementVNode("div", null, " 修改后最高分数百分比 ", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.min,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.min = $event),
                    precision: 1,
                    step: 0.1,
                    max: 1,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createVNode(_component_el_button, {
              onClick: _cache[6] || (_cache[6] = ($event) => $options.setting())
            }, {
              default: vue.withCtx(() => [..._cache[15] || (_cache[15] = [
                vue.createTextVNode(" 设定 ", -1)
              ])]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      vue.createVNode(_component_el_dialog, {
        modelValue: $data.answerDialogVisible,
        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.answerDialogVisible = $event),
        title: "参考答案",
        width: "40%",
        draggable: "",
        "align-center": ""
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", _hoisted_3, vue.toDisplayString($options.answer), 1)
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]);
  }
  const paper = _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-c5510b64"]]);
  function show_answer_for_paper() {
    if (localStorage.getItem(window.location.hash.split("&")[0].split("id=")[1]) === null) {
      alert("未找到答案，请重新进入当前页面");
    } else {
      setTimeout(() => {
        vue.createApp(paper).use(ElementPlus).mount(
          (() => {
            const app = document.createElement("div");
            document.querySelector("#app > div > div.slider").appendChild(app);
            return app;
          })()
        );
      }, 1e3);
    }
  }
  const _sfc_main$3 = {
    data() {
      return {
        modifyDialogVisible: false,
        score: 60,
        min: 0.7,
        max: 0.8
      };
    },
    mounted() {
      if (localStorage.getItem("auto_modify_limit") !== null) {
        const data = JSON.parse(localStorage.getItem("auto_modify_limit"));
        this.score = data.score;
        this.min = data.min;
        this.max = data.max;
      }
      if (localStorage.getItem("modify_switch") == null) {
        localStorage.setItem("modify_switch", "false");
      }
      if (localStorage.getItem("modify_switch") === "true") {
        document.getElementById("btn2").innerText = "禁用";
      } else {
        document.getElementById("btn2").innerText = "启用";
      }
    },
    methods: {
      switch_modify: function() {
        if (document.getElementById("btn2").innerText === "启用") {
          document.getElementById("btn2").innerText = "禁用";
          this.modifyDialogVisible = true;
          localStorage.setItem("modify_switch", "true");
        } else {
          document.getElementById("btn2").innerText = "启用";
          localStorage.setItem("modify_switch", "false");
          ElementPlus.ElNotification({
            title: "Success",
            duration: 2e3,
            message: "分数修改已禁用",
            type: "success"
          });
        }
      },
      setting: function() {
        const data = {
          score: this.score,
          min: this.min,
          max: this.max
        };
        localStorage.setItem("auto_modify_limit", JSON.stringify(data));
        this.modifyDialogVisible = false;
        ElementPlus.ElNotification({
          title: "Success",
          duration: 2e3,
          message: "设置保存成功",
          type: "success"
        });
      }
    }
  };
  const _hoisted_1$3 = { class: "side-blank" };
  const _hoisted_2$2 = { style: { "text-align": "center", "padding-top": "10px" } };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = vue.resolveComponent("el-button");
    const _component_el_input_number = vue.resolveComponent("el-input-number");
    const _component_el_col = vue.resolveComponent("el-col");
    const _component_el_row = vue.resolveComponent("el-row");
    const _component_el_dialog = vue.resolveComponent("el-dialog");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
      _cache[12] || (_cache[12] = vue.createElementVNode("span", { style: { "text-align": "center", "color": "black" } }, "自动修改分数", -1)),
      vue.createVNode(_component_el_button, {
        id: "btn2",
        style: { "margin-left": "0", "margin-top": "20px" },
        onClick: _cache[0] || (_cache[0] = ($event) => $options.switch_modify())
      }, {
        default: vue.withCtx(() => [..._cache[6] || (_cache[6] = [
          vue.createTextVNode(" 启用 ", -1)
        ])]),
        _: 1
      }),
      vue.createVNode(_component_el_dialog, {
        modelValue: $data.modifyDialogVisible,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.modifyDialogVisible = $event),
        title: "设置",
        width: "40%",
        draggable: "",
        "align-center": ""
      }, {
        default: vue.withCtx(() => [
          _cache[11] || (_cache[11] = vue.createElementVNode("div", { style: { "padding-bottom": "25px", "text-align": "center" } }, " 自动修改分数设置 ", -1)),
          vue.createVNode(_component_el_row, null, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "tip-text" }, " 低于多少分才修改 ", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.score,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.score = $event),
                    precision: 2,
                    step: 0.01,
                    max: 100,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[8] || (_cache[8] = vue.createElementVNode("div", { class: "tip-text" }, " 修改后最低分数百分比 ", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.max,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.max = $event),
                    precision: 1,
                    step: 0.1,
                    max: 1,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_col, {
                span: 8,
                style: { "text-align": "center" }
              }, {
                default: vue.withCtx(() => [
                  _cache[9] || (_cache[9] = vue.createElementVNode("div", { class: "tip-text" }, " 修改后最高分数百分比 ", -1)),
                  vue.createVNode(_component_el_input_number, {
                    modelValue: $data.min,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.min = $event),
                    precision: 1,
                    step: 0.1,
                    max: 1,
                    "controls-position": "right"
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createVNode(_component_el_button, {
              onClick: _cache[4] || (_cache[4] = ($event) => $options.setting())
            }, {
              default: vue.withCtx(() => [..._cache[10] || (_cache[10] = [
                vue.createTextVNode(" 设定 ", -1)
              ])]),
              _: 1
            })
          ])
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]);
  }
  const accent = _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-da9845e4"]]);
  function show_setting_for_accent() {
    setTimeout(() => {
      vue.createApp(accent).use(ElementPlus).mount(
        (() => {
          const app = document.createElement("div");
          document.querySelector("#app > div > div.container > div.slider > ul").appendChild(app);
          return app;
        })()
      );
    }, 1e3);
  }
  const _sfc_main$2 = {
    data() {
      return {
        answerDialogVisible: false
      };
    },
    computed: {
      answer() {
        return localStorage.getItem(window.location.hash.split("&")[0].split("id=")[1]);
      }
    }
  };
  const _hoisted_1$2 = { class: "side-blank" };
  const _hoisted_2$1 = { class: "div-style" };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = vue.resolveComponent("el-button");
    const _component_el_dialog = vue.resolveComponent("el-dialog");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
      vue.createVNode(_component_el_button, {
        onClick: _cache[0] || (_cache[0] = ($event) => $data.answerDialogVisible = true)
      }, {
        default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [
          vue.createTextVNode(" 参考答案 ", -1)
        ])]),
        _: 1
      }),
      vue.createVNode(_component_el_dialog, {
        modelValue: $data.answerDialogVisible,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.answerDialogVisible = $event),
        title: "参考答案",
        width: "40%",
        draggable: "",
        "align-center": ""
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", _hoisted_2$1, vue.toDisplayString($options.answer), 1)
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]);
  }
  const written = _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-96104ecd"]]);
  function show_answer_for_written() {
    if (localStorage.getItem(window.location.hash.split("&")[0].split("id=")[1]) === null) {
      alert("未找到答案，请重新进入当前页面");
    } else {
      setTimeout(() => {
        vue.createApp(written).use(ElementPlus).mount(
          (() => {
            const app = document.createElement("div");
            document.querySelector("#app > div > div.card > div.main").appendChild(app);
            return app;
          })()
        );
      }, 1e3);
    }
  }
  const _sfc_main$1 = {
    data() {
      return {
        score: 70
      };
    },
    mounted() {
      if (localStorage.getItem("next_one_limit") !== null) {
        this.score = localStorage.getItem("next_one_limit");
      }
    },
    methods: {
      setting: function() {
        localStorage.setItem("next_one_limit", this.score);
      }
    }
  };
  const _hoisted_1$1 = { class: "setting_blank" };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_input_number = vue.resolveComponent("el-input-number");
    const _component_el_button = vue.resolveComponent("el-button");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
      _cache[3] || (_cache[3] = vue.createElementVNode("span", { style: { "padding-bottom": "5px" } }, "设定自动下一个分数阈值", -1)),
      vue.createVNode(_component_el_input_number, {
        modelValue: $data.score,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.score = $event),
        precision: 2,
        step: 0.01,
        max: 100,
        "controls-position": "right"
      }, null, 8, ["modelValue"]),
      vue.createVNode(_component_el_button, {
        style: { "margin-top": "5px" },
        onClick: _cache[1] || (_cache[1] = ($event) => $options.setting())
      }, {
        default: vue.withCtx(() => [..._cache[2] || (_cache[2] = [
          vue.createTextVNode(" 设定 ", -1)
        ])]),
        _: 1
      })
    ]);
  }
  const word = _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-bd57d942"]]);
  function show_setting_for_word() {
    if (localStorage.getItem("next_one_limit") === "undefined") {
      localStorage.setItem("next_one_limit", "70.00");
    }
    setTimeout(() => {
      vue.createApp(word).use(ElementPlus).mount(
        (() => {
          const app = document.createElement("div");
          app.setAttribute("style", "text-align: center");
          document.querySelector("#app > div > div.left-menu").appendChild(app);
          return app;
        })()
      );
    }, 1e3);
    let old_score = null;
    setInterval(() => {
      const num = document.querySelector("#app > div > div.read-container > div.ant-spin-nested-loading > div > div > div.top > div:nth-child(1)").innerHTML.split("/")[0];
      const score = document.querySelector("#app > div > div.read-container > div.ant-spin-nested-loading > div > div > div.ul > div:nth-child(" + num + ") > div.user > div > div.score");
      if (score) {
        if (parseFloat(score.innerHTML) === old_score) {
          console.log("stop");
        } else {
          if (parseFloat(score.innerHTML) >= localStorage.getItem("next_one_limit")) {
            old_score = parseFloat(score.innerHTML);
            console.log("next");
            document.querySelector("#app > div > div.read-container > div.ant-spin-nested-loading > div > div > div.tool > div.right > div:nth-child(2)").click();
          }
        }
      }
    }, 1e3);
  }
  const _sfc_main = {
    data() {
      return {
        answerDialogVisible: false,
        answer: "暂无参考答案"
      };
    },
    mounted() {
    },
    computed: {
      answer() {
        const data = sessionStorage.getItem("translate_answers");
        if (data) {
          return JSON.parse(data).join("\n");
        } else {
          return "暂无参考答案";
        }
      }
    },
    methods: {
      async autoFinish() {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const normalizeText = (text) => text.replace(/\s+/g, " ").trim();
        const raw = sessionStorage.getItem("translate_answers");
        if (!raw) return;
        const data = JSON.parse(raw);
        for (const correctAnswer of data) {
          const visibleQuestion = Array.from(document.querySelectorAll(".word-list")).find((el) => el.offsetParent !== null);
          if (!visibleQuestion) break;
          const normalizedCorrect = normalizeText(String(correctAnswer).replace(/^[A-D]\.\s*/, ""));
          const optionElements = visibleQuestion.querySelectorAll(".options .text");
          for (const optionElement of optionElements) {
            const optionText = normalizeText(optionElement.innerText.replace(/^[A-D]\.\s*/, ""));
            if (optionText.includes(normalizedCorrect)) {
              optionElement.click();
              break;
            }
          }
          const nextButton = visibleQuestion.querySelector(".next-btn");
          if (nextButton && nextButton.offsetParent !== null) {
            await sleep(1500);
            nextButton.click();
          }
          await sleep(1500);
        }
      }
    }
  };
  const _hoisted_1 = { class: "setting_blank" };
  const _hoisted_2 = { class: "div-style" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = vue.resolveComponent("el-button");
    const _component_el_dialog = vue.resolveComponent("el-dialog");
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      vue.createVNode(_component_el_button, {
        onClick: _cache[0] || (_cache[0] = ($event) => $data.answerDialogVisible = true)
      }, {
        default: vue.withCtx(() => [..._cache[3] || (_cache[3] = [
          vue.createTextVNode(" 参考答案 ", -1)
        ])]),
        _: 1
      }),
      _cache[5] || (_cache[5] = vue.createElementVNode("br", null, null, -1)),
      vue.createVNode(_component_el_button, {
        onClick: _cache[1] || (_cache[1] = ($event) => $options.autoFinish())
      }, {
        default: vue.withCtx(() => [..._cache[4] || (_cache[4] = [
          vue.createTextVNode(" 一键完成 ", -1)
        ])]),
        _: 1
      }),
      vue.createVNode(_component_el_dialog, {
        modelValue: $data.answerDialogVisible,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.answerDialogVisible = $event),
        "align-center": "",
        draggable: "",
        title: "参考答案",
        width: "40%"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", _hoisted_2, vue.toDisplayString($options.answer), 1)
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]);
  }
  const translate = _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0e14c382"]]);
  function parse_answer_for_chooseTranslate(dict) {
    const answers = [];
    for (let index = 0; index < dict.data.length; index++) {
      const answer = dict["data"][index]["titleType"]["optionsTypeList"];
      for (let i = 0; i < 4; i++) {
        if (answer[i]["answer"] === true) {
          answers.push(answer[i]["text"]);
        }
      }
    }
    sessionStorage.setItem("translate_answers", JSON.stringify(answers));
  }
  function parse_answer_for_chooseTranslateV2(dict) {
    try {
      const extractData = extractTextbookFromData(dict);
      let answers;
      if (extractData === null) {
        throw new Error("未找到课文数据");
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          answers = extractWordLists(extractData);
        });
      } else {
        setTimeout(() => {
          answers = extractWordLists(extractData);
        }, 1e3);
      }
      sessionStorage.setItem("translate_answers", JSON.stringify(answers));
    } catch (e) {
    }
  }
  function extractTextbookFromData(data) {
    if (!data || typeof data !== "object") return null;
    let result = null;
    function findTextbookArrays(obj, path = "") {
      if (Array.isArray(obj)) {
        const hasTextbook = obj.some(
          (item) => item && typeof item === "object" && item.textBookParaphrase !== void 0
        );
        if (hasTextbook) {
          console.log(`发现课文数据数组: ${path || "root"}, 长度: ${obj.length}`);
          result = extractAndOutput(obj);
        }
      } else if (typeof obj === "object" && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          findTextbookArrays(value, `${path}.${key}`.replace(/^\./, ""));
        }
      }
    }
    findTextbookArrays(data);
    return result;
  }
  function extractAndOutput(textbookArray) {
    if (!Array.isArray(textbookArray)) return null;
    const extracted = textbookArray.map((item, index) => {
      return {
        index,
        textBookParaphrase: item.textBookParaphrase || null,
        textBookParaphraseCn: item.textBookParaphraseCn || null,
        textBookParaphraseEn: item.textBookParaphraseEn || null,
        originalText: item.originalText || null,
        translation: item.translation || null,
        id: item.id || null,
        unitId: item.unitId || null,
        lessonId: item.lessonId || null
      };
    }).filter((item) => item.textBookParaphrase !== null);
    if (extracted.length > 0) {
      console.log("=== 课文数据提取完成 ===");
      console.log("提取结果数组:", extracted);
      console.log("数组长度:", extracted.length);
      return extracted;
    }
  }
  function extractWordLists(textbookData) {
    console.log("开始提取单词列表...");
    const xpath = "/html/body/div[1]/div/div[2]/div[2]/div/div/div[2]";
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const parentElement = result.singleNodeValue;
    if (!parentElement) {
      console.error(`未找到指定XPath路径的父元素: ${xpath}`);
      return;
    }
    const wordLists = parentElement.querySelectorAll('div[class*="word-list"]');
    if (wordLists.length === 0) {
      console.log("在指定路径下未找到类名包含word-list的div元素");
      return;
    }
    console.log(`找到 ${wordLists.length} 个类名包含word-list的div元素`);
    const indexedResults = [];
    const correctOptions = [];
    wordLists.forEach((wordList, listIndex) => {
      const listItem = {
        index: listIndex,
        element: wordList,
        bottomOptions: []
      };
      const bottomElement = wordList.querySelector(".bottom");
      if (bottomElement) {
        const options = bottomElement.querySelectorAll(".options");
        const topFourOptions = Array.from(options).slice(0, 4);
        topFourOptions.forEach((option, optionIndex) => {
          listItem.bottomOptions.push({
            index: optionIndex,
            text: option.textContent.trim(),
            element: option
          });
        });
      } else {
        console.error(`div.word-list[${listIndex}] 中未找到类名为bottom的元素`);
      }
      indexedResults.push(listItem);
    });
    indexedResults.forEach((listItem, listIndex) => {
      if (listIndex < textbookData.length) {
        const textbookItem = textbookData[listIndex];
        const targetPhrase = textbookItem.textBookParaphrase;
        if (targetPhrase) {
          listItem.bottomOptions.forEach((option) => {
            if (option.text.includes(targetPhrase)) {
              option.isCorrect = true;
              correctOptions.push({
                wordListIndex: listIndex,
                optionIndex: option.index,
                text: option.text
              });
            }
          });
        } else {
          console.error(`textbookData[${listIndex}].textBookParaphrase不存在`);
        }
      } else {
        console.error(`word-list[${listIndex}] 没有对应的textbookData项`);
      }
    });
    const answers = [];
    correctOptions.forEach(({ text }) => answers.push(text));
    return answers;
  }
  function show_setting_for_translate() {
    setTimeout(() => {
      vue.createApp(translate).use(ElementPlus).mount(
        (() => {
          const app = document.createElement("div");
          app.setAttribute("style", "text-align: center");
          document.querySelector("#app > div > div.left-menu").appendChild(app);
          return app;
        })()
      );
    }, 2e3);
  }
  class HARRecorder {
    constructor() {
      this.entries = [];
      this.startTime = ( new Date()).toISOString();
      this.isRecording = false;
    }
    startRecording() {
      this.isRecording = true;
      this.entries = [];
      this.startTime = ( new Date()).toISOString();
      console.log("HAR recording started");
    }
    stopRecording() {
      this.isRecording = false;
      console.log("HAR recording stopped");
    }
    recordRequest(method, url, requestHeaders, requestBody, status, responseHeaders, responseBody) {
      if (!this.isRecording) return;
      const startTime = ( new Date()).toISOString();
      const entry = {
        startedDateTime: startTime,
        time: 100,
request: {
          method,
          url,
          httpVersion: "HTTP/1.1",
          headers: this.formatHeaders(requestHeaders || {}),
          queryString: this.parseQueryString(url),
          headersSize: -1,
          bodySize: requestBody ? requestBody.length : 0
        },
        response: {
          status,
          statusText: "OK",
          httpVersion: "HTTP/1.1",
          headers: this.formatHeaders(responseHeaders || {}),
          content: {
            size: responseBody ? responseBody.length : 0,
            mimeType: "application/json",
            text: responseBody || ""
          },
          headersSize: -1,
          bodySize: responseBody ? responseBody.length : 0
        },
        cache: {},
        timings: {
          blocked: -1,
          dns: -1,
          connect: -1,
          send: 0,
          wait: 100,
          receive: 0,
          ssl: -1
        },
        pageref: "page_1"
      };
      if (requestBody) {
        entry.request.postData = {
          mimeType: "application/x-www-form-urlencoded",
          text: requestBody
        };
      }
      this.entries.push(entry);
    }
    formatHeaders(headers) {
      if (Array.isArray(headers)) return headers;
      return Object.keys(headers).map((name) => ({
        name,
        value: headers[name]
      }));
    }
    parseQueryString(url) {
      try {
        const urlObj = new URL(url);
        const params = [];
        urlObj.searchParams.forEach((value, name) => {
          params.push({ name, value });
        });
        return params;
      } catch (e) {
        return [];
      }
    }
    generateHAR() {
      return JSON.stringify({
        log: {
          version: "1.2",
          creator: {
            name: "Xiyou Crack HAR Recorder",
            version: "1.0"
          },
          pages: [{
            startedDateTime: this.startTime,
            id: "page_1",
            title: "Xiyou English App Requests",
            pageTimings: { onContentLoad: -1, onLoad: -1 }
          }],
          entries: this.entries
        }
      }, null, 2);
    }
    downloadHAR() {
      this.stopRecording();
      const harData = this.generateHAR();
      const blob = new Blob([harData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `xiyou-requests-${( new Date()).toISOString().replace(/[:.]/g, "-")}.har`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("HAR file downloaded and recording stopped");
    }
    getRecordedEntries() {
      return this.entries;
    }
  }
  const harRecorder = new HARRecorder();
  harRecorder.startRecording();
  console.log("HAR recording started automatically. Use downloadHAR() in console to stop and download.");
  window.downloadHAR = function() {
    harRecorder.downloadHAR();
  };
  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const cssLoader = (e) => _GM_addStyle(_GM_getResourceText(e));
  cssLoader("element-plus/dist/index.css");
  const hash = window.location.hash;
  let old = history.pushState;
  history.pushState = function(...arg) {
    if (arg[2].includes("paperDetail")) {
      show_answer_for_paper();
    }
    if (arg[2].includes("readingLoudly")) {
      show_setting_for_word();
    }
    if (arg[2].includes("accentDetail")) {
      show_setting_for_accent();
    }
    if (arg[2].includes("writtenDetail")) {
      show_answer_for_written();
    }
    if (arg[2].includes("chooseTranslate")) {
      show_setting_for_translate();
    }
    return old.call(this, ...arg);
  };
  if (hash.includes("readingLoudly")) {
    show_setting_for_word();
  }
  if (hash.includes("paperDetail")) {
    show_answer_for_paper();
  }
  if (hash.includes("accentDetail")) {
    show_setting_for_accent();
  }
  if (hash.includes("writtenDetail")) {
    show_answer_for_written();
  }
  if (hash.includes("chooseTranslate")) {
    show_setting_for_translate();
  }
  const originOpen = XMLHttpRequest.prototype.open;
  const oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    this._method = method;
    this._requestHeaders = {};
    const originalSetRequestHeader = this.setRequestHeader;
    this.setRequestHeader = function(name, value) {
      this._requestHeaders[name] = value;
      return originalSetRequestHeader.call(this, name, value);
    };
    originOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(data) {
    const self = this;
    this.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        harRecorder.recordRequest(
          self._method,
          self._url,
          self._requestHeaders,
          data,
          this.status,
          self.parseResponseHeaders(self.getAllResponseHeaders()),
          this.responseText
        );
        if (self._method.toLowerCase() === "post") {
          try {
            if (self._url === "https://app.xiyouyingyu.com/paper/getPaperGroupById") {
              localStorage.setItem(data.split("groupId=")[1], processResponse(JSON.parse(this.responseText)["data"], 1));
            } else if (self._url === "https://app.xiyouyingyu.com/write/selectByPrimaryKey") {
              localStorage.setItem(data.split("examId=")[1], processResponse(JSON.parse(this.responseText)["data"], 2));
            } else if (self._url === "https://app.xiyouyingyu.com/word/findListByIds" || self._url === "https://app.xiyouyingyu.com/word/getWordPush") {
              try {
                parse_answer_for_chooseTranslate(JSON.parse(this.responseText));
              } catch (e) {
                parse_answer_for_chooseTranslateV2(JSON.parse(this.responseText));
              }
            } else if (self._url === "https://app.xiyouyingyu.com/entrance/moduleListNew") {
              const response = JSON.parse(this.responseText);
              if (Array.isArray(response["data"]["common"])) {
                for (let i = 0; i < response["data"]["common"].length; i++) {
                  if (response["data"]["common"][i]["isLock"] === 1) {
                    response["data"]["common"][i]["isLock"] = 0;
                  }
                }
              }
              if (Array.isArray(response["data"]["special"])) {
                for (let i = 0; i < response["data"]["special"].length; i++) {
                  if (response["data"]["special"][i]["isLock"] === 1) {
                    response["data"]["special"][i]["isLock"] = 0;
                  }
                }
              }
              Object.defineProperty(this, "responseText", {
                get: function() {
                  return JSON.stringify(response);
                }
              });
            } else if (self._url === "https://app.xiyouyingyu.com/entrance/getModulesByPid") {
              const response = JSON.parse(this.responseText);
              for (let i = 0; i < response["moduleList"].length; i++) {
                if (response["moduleList"][i]["isLock"] === 1) {
                  response["moduleList"][i]["isLock"] = 0;
                }
              }
              Object.defineProperty(this, "responseText", {
                get: function() {
                  return JSON.stringify(response);
                }
              });
            } else if (self._url === "https://app.xiyouyingyu.com/paperAnswerCount/userPracticeInfo") {
              const response = JSON.parse(this.responseText);
              if (response["data"]["expire"] === "1") {
                response["data"]["expire"] = "0";
                response["data"]["expireAt"] = "2099-12-31 23:59:59";
              }
              if (response["data"]["hasVipCard"] === 0) {
                response["data"]["hasVipCard"] = 1;
              }
              Object.defineProperty(this, "responseText", {
                get: function() {
                  return JSON.stringify(response);
                }
              });
            } else if (self._url === "https://app.xiyouyingyu.com/user/login/account") {
              const response = JSON.parse(this.responseText);
              if (response["data"]["userInfo"]["expire"] === "1") {
                response["data"]["userInfo"]["expire"] = "0";
                response["data"]["userInfo"]["expireAt"] = "2099-12-31 23:59:59";
              }
              if (response["data"]["hasVipCard"] === 0) {
                response["data"]["hasVipCard"] = 1;
              }
              Object.defineProperty(this, "responseText", {
                get: function() {
                  return JSON.stringify(response);
                }
              });
            } else if (self._url === "https://app.xiyouyingyu.com/user/getVipCard") {
              let response = JSON.parse(this.responseText);
              if (response["data"].length === 0) {
                let randomCode = function() {
                  let t = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", a = t.length, n = "";
                  for (let i = 0; i < 8; i++) n += t.charAt(Math.floor(Math.random() * a));
                  return n;
                };
                response = {
                  "data": [
                    {
                      "code": randomCode(),
                      "bigGrayPhoto": "http://image.xiyouyingyu.com/product/software/app/21F6D8F15912466AB0D068A4487F2EBE.png",
                      "city": "-1",
                      "photo": "http://image.xiyouyingyu.com/product/software/app/1C2AD0043E8F4AC38C56FDF072FD00EB.png",
                      "remark": "1. 试题权限：此学习卡开放广东高中试题。\n\n2. 有效期：自激活日起730内有效，到期自动失效。\n\n3. 此学习卡为电子资源，一旦激活，不可退回。\n\n4. 学习卡权益仅限本人使用，不可转让，出借或售卖。\n\n5. 在使用过程中有任何问题可在上班期间致电客服电话，我们将会优先处理您的需求。\n\n6. 在使用过程中有任何问题可在APP内提交反馈，您的意见对我们很重要，感谢支持！",
                      "type": "31062",
                      "bigPhoto": "http://image.xiyouyingyu.com/product/software/app/50B8A89D27EA4E1CAE24446E29C0466E.png",
                      "vipExpireDateStr": "2099-12-31",
                      "grayPhoto": "http://image.xiyouyingyu.com/product/software/app/09BE3A1319A441C185A207F86C5BDC8A.png",
                      "vipExpireDate": "2099-12-31",
                      "province": "440000",
                      "scope": "广东高中",
                      "grade": "8",
                      "expire": "0",
                      "name": "广东高中VIP学习卡",
                      "shortName": "VIP学习卡",
                      "status": "1"
                    }
                  ],
                  "state": "11"
                };
              }
              Object.defineProperty(this, "responseText", {
                get: function() {
                  return JSON.stringify(response);
                }
              });
            } else {
              parse_answer_for_chooseTranslateV2(JSON.parse(this.responseText));
            }
          } catch (e) {
            ElementPlus.ElNotification({
              title: "Error",
              message: "答案解析失败，右键->检查->控制台 查看错误详情",
              type: "error"
            });
            console.log(e);
            console.log("脚本出现错误，请粘贴 downloadHAR() 到下方并回车");
            console.log("将下载的 HAR 文件提交至 https://github.com/ravizhan/xiyou_crack/issues");
          }
        }
      }
    });
    oldSend.apply(this, arguments);
  };
  XMLHttpRequest.prototype.parseResponseHeaders = function(headerStr) {
    const headers = {};
    if (!headerStr) return headers;
    const headerPairs = headerStr.split("\r\n");
    for (let i = 0; i < headerPairs.length; i++) {
      const headerPair = headerPairs[i];
      const index = headerPair.indexOf(": ");
      if (index > 0) {
        const key = headerPair.substring(0, index);
        headers[key] = headerPair.substring(index + 2);
      }
    }
    return headers;
  };
  const originSocket = _unsafeWindow.WebSocket;
  _unsafeWindow.WebSocket = function(...args) {
    let callback = void 0;
    const ws = new originSocket(...args);
    ws.onmessage = function(evt) {
      const proxyEvent = new Proxy(evt, {
        get: function(target, prop) {
          let data = target[prop];
          if (prop === "data") {
            data = JSON.parse(data);
            if (JSON.stringify(data).includes("tokenId") && localStorage.getItem("modify_switch") === "true") {
              let auto_modify_limit = JSON.parse(localStorage.getItem("auto_modify_limit"));
              const old2 = data["result"]["overall"];
              const min = data["result"]["rank"] * auto_modify_limit["min"];
              const max = data["result"]["rank"] * auto_modify_limit["max"];
              if (old2 > auto_modify_limit["score"]) {
                return JSON.stringify(data);
              }
              data["result"]["overall"] = (Math.random() * (max - min) + min).toPrecision(2);
              console.log("分数修改成功\n修改前: " + old2.toString() + "\n修改后: " + data["result"]["overall"].toString());
              ElementPlus.ElNotification({
                title: "Success",
                duration: 3e3,
                message: "分数修改成功\n修改前: " + old2.toString() + "\n修改后: " + data["result"]["overall"].toString(),
                type: "success"
              });
              return JSON.stringify(data);
            }
            return JSON.stringify(data);
          }
          return JSON.stringify(data);
        }
      });
      callback && callback(proxyEvent);
    };
    Object.defineProperty(ws, "onmessage", {
      get: () => {
        return callback;
      },
      set: (setCall) => {
        callback = setCall;
      }
    });
    return ws;
  };
  window.harRecorder = harRecorder;

})(Vue, ElementPlus);