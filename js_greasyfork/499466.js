// ==UserScript==
// @name         0x3f-problem-solution
// @namespace    https://greasyfork.org/zh-CN/users/1326420-wuxin0012
// @version      0.0.1
// @author       wuxin0011
// @description  配合灵神题单解题
// @license      MIT
// @icon         https://assets.leetcode.cn/aliyun-lc-upload/users/endlesscheng/avatar_1690721039.png
// @source       https://greasyfork.org/zh-CN/users/1326420-wuxin0012
// @match        https://leetcode.cn/circle/discuss/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://unpkg.com/element-plus@2.7.6/dist/index.full.js
// @resource     elementPlusCss  https://unpkg.com/element-plus@2.7.6/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/499466/0x3f-problem-solution.user.js
// @updateURL https://update.greasyfork.org/scripts/499466/0x3f-problem-solution.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .m-setting-button[data-v-6d3b190f]{position:fixed;top:200px;right:0;z-index:100000} ");

(function (vue, ElementPlus) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const inf = 4e3;
  const mi = 1e3;
  const __0x3f_problmes_solution__ = "__0x3f_problmes_solution__";
  const __0x3f_problmes_urls__ = "__0x3f_problmes_urls__";
  const __0x3f_problmes_update__ = "__0x3f_problmes_update__";
  const __add_cur__ = "__add_cur__";
  const Problems = () => Array.from(document.querySelectorAll(".css-1ayia3m-MarkdownContent li>a"));
  const defaultObj = {
    min: mi,
    max: inf,
    visiableMember: true,
    onlyUrls: false,
    useDefaultSetting: true
  };
  function isShow(text, min, max) {
    if (!text) {
      return true;
    }
    let res = text.match(/\d+/ig);
    if (!res) {
      return true;
    }
    if (Array.isArray(res) && res.length < 2) {
      return true;
    }
    let s = 0;
    for (let i = res.length - 1; i >= 0; i--) {
      s = res[i];
      if (s >= mi && s <= inf) {
        return s >= min && s <= max;
      }
    }
    return true;
  }
  let A = Problems();
  function handlerProblem(data) {
    var _a;
    if (!Array.isArray(A) || Array.isArray(A) && A.length == 0) {
      A = Problems();
    }
    let { min, max, visiableMember, useDefaultSetting, onlyUrls } = data;
    if (isNaN(min) || isNaN(max)) {
      min = mi;
      max = inf;
    }
    if (min < mi) {
      min = mi;
    }
    if (max < min) {
      max = inf;
    }
    min = Number(min);
    max = Number(max);
    data.min = min;
    data.max = max;
    _GM_setValue(__0x3f_problmes_solution__, data);
    for (let i = 0; i < A.length; i++) {
      let d = (_a = A[i]) == null ? void 0 : _a.parentElement;
      if (!d) {
        continue;
      }
      let flag = isShow(d.textContent, min, max);
      d.style.display = flag ? "" : "none";
      let c = d.textContent && d.textContent.indexOf("会员") != -1;
      if (!c) {
        continue;
      }
      d.style.display = visiableMember ? "" : "none";
    }
  }
  const initUrls = () => _GM_getValue(__0x3f_problmes_update__) ? Array.isArray(_GM_getValue(__0x3f_problmes_urls__)) ? _GM_getValue(__0x3f_problmes_urls__) : [] : defaultUrls;
  const initObj = () => _GM_getValue(__0x3f_problmes_solution__) ? Object.assign(defaultObj, _GM_getValue(__0x3f_problmes_solution__)) : defaultObj;
  const support_plugins = () => {
    const u = initObj();
    if (!u || !u.onlyUrls) return true;
    const url = window.location.href;
    const urls = initUrls();
    for (let info of urls) {
      if (!info || !(info == null ? void 0 : info.link)) {
        continue;
      }
      console.log("url find", info.link.indexOf(url) != -1, info.link, url);
      if (info.link.indexOf(url) != -1) {
        return true;
      }
    }
    return false;
  };
  const defaultUrls = [
    {
      title: "滑动窗口（定长/不定长/多指针）",
      link: "https://leetcode.cn/circle/discuss/0viNMK/"
    },
    {
      title: "二分算法（二分答案/最小化最大值/最大化最小值/第K小）",
      link: "https://leetcode.cn/circle/discuss/SqopEo/"
    },
    {
      title: "单调栈（矩形面积/贡献法/最小字典序）",
      link: "https://leetcode.cn/circle/discuss/9oZFK9/"
    },
    {
      title: "网格图（DFS/BFS/综合应用）",
      link: "https://leetcode.cn/circle/discuss/YiXPXW/"
    },
    {
      title: "位运算（基础/性质/拆位/试填/恒等式/贪心/脑筋急转弯）",
      link: "https://leetcode.cn/circle/discuss/dHn9Vk/"
    },
    {
      title: "图论算法（DFS/BFS/拓扑排序/最短路/最小生成树/二分图/基环树/欧拉路径）",
      link: "https://leetcode.cn/circle/discuss/01LUak/"
    },
    {
      title: "动态规划（入门/背包/状态机/划分/区间/状压/数位/树形/数据结构优化）",
      link: "https://leetcode.cn/circle/discuss/tXLS3i/"
    },
    {
      title: "常用数据结构（前缀和/差分/栈/队列/堆/字典树/并查集/树状数组/线段树）",
      link: "https://leetcode.cn/circle/discuss/mOr1u6/"
    },
    {
      title: "数学算法（数论/组合/概率期望/博弈/计算几何/随机算法）",
      link: "https://leetcode.cn/circle/discuss/IYT3ss/"
    }
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "dialog-footer" };
  const formLabelWidth = "44px";
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const drawer = vue.ref(false);
      const fromData = vue.reactive(initObj());
      vue.watch(fromData, () => {
        handlerProblem(vue.toRaw(Object.assign({}, fromData)));
      });
      let tableData = vue.reactive(initUrls());
      const keywords = vue.ref("");
      const dialogTableVisible = vue.ref(false);
      const urlsData = vue.computed(() => tableData.filter((v) => v && v.title && v.title.indexOf(keywords.value) != -1));
      const dialogFormVisible = vue.ref(false);
      const info = vue.reactive({
        title: "",
        link: "",
        status: "add"
      });
      const addlocal = () => {
        let ok = false;
        for (let a of tableData) {
          if (a && a.link.indexOf(window.location.href) != -1) {
            ok = true;
          }
        }
        if (ok) {
          return;
        }
        tableData.unshift({ title: document.title, link: window.location.href });
      };
      const updateIndex = vue.ref(-1);
      const showProblems = () => {
        dialogTableVisible.value = true;
        if (_GM_getValue(__add_cur__)) {
          addlocal();
        }
      };
      const handlerProblems = (status, updateInfo = { title: "", link: "" }, index = -1) => {
        dialogFormVisible.value = true;
        info.status = status;
        updateIndex.value = index;
        Object.assign(info, updateInfo);
      };
      const handlerMessage = (u, title, link) => {
        const a = u ? "添加" : "修改";
        const error = !title || !/https?:\/\/.*/.test(link);
        if (error) {
          ElementPlus.ElMessage.error(`${a} 失败 请保证标题或者链接有效 `);
        } else {
          ElementPlus.ElMessage.success(`${a} 成功 `);
        }
        return !error;
      };
      const addOrUpdate = () => {
        if (!handlerMessage(info.status == "add", info.title, info.link)) {
          return;
        }
        if (info.status == "add") {
          tableData.unshift({ title: info.title, link: info.link });
        } else {
          let index = updateIndex.value;
          if (index != -1 && index < tableData.length) {
            tableData[index].link = info.link;
            tableData[index].title = info.title;
          }
        }
        dialogFormVisible.value = false;
      };
      const deleteProblems = (index) => {
        tableData.splice(index, 1);
        _GM_setValue(__0x3f_problmes_urls__, vue.toRaw(tableData));
      };
      const handlerDefault = () => {
        ElementPlus.ElMessageBox.confirm(
          "确认使用默认题单，将会重置题单?",
          "警告",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          for (let i = 0; i < tableData.length; i++) {
            delete tableData[i];
          }
          for (let item of defaultUrls) {
            tableData.unshift(item);
          }
          ElementPlus.ElMessage({
            type: "success",
            message: "重置成功"
          });
        }).catch(() => {
          ElementPlus.ElMessage({
            type: "info",
            message: "取消重置"
          });
        });
      };
      window.addEventListener("beforeunload", () => {
        console.log("save ....");
        _GM_setValue(__0x3f_problmes_urls__, vue.toRaw(tableData));
        _GM_setValue(__0x3f_problmes_update__, true);
        _GM_setValue(__add_cur__, false);
      });
      vue.onMounted(() => {
        if (support_plugins()) {
          setTimeout(() => {
            handlerProblem(vue.toRaw(Object.assign({}, fromData)));
          }, 3e3);
        }
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", null, [
            vue.createVNode(_component_el_button, {
              type: "primary",
              style: { "margin-left": "16px" },
              onClick: _cache[0] || (_cache[0] = ($event) => drawer.value = !drawer.value),
              class: "m-setting-button"
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(" 设置 ")
              ]),
              _: 1
            })
          ]),
          vue.createVNode(_component_el_drawer, {
            modelValue: drawer.value,
            "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => drawer.value = $event),
            "with-header": false,
            size: "30%"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, {
                "label-position": "left",
                "label-width": "auto",
                model: fromData,
                style: { "max-width": "600px" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, { label: "分数区间" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 10 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: fromData.min,
                            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => fromData.min = $event),
                            "aria-placeholder": "",
                            placeholder: " min  "
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, {
                        class: "text-center",
                        span: 1,
                        style: { "margin": "0 0.5rem" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("-")
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 10 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: fromData.max,
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => fromData.max = $event),
                            "aria-placeholder": "",
                            placeholder: " max"
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "显示会员题" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_switch, {
                        modelValue: fromData.visiableMember,
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => fromData.visiableMember = $event)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "只在收藏题单中生效" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, {
                        content: "插件只在收藏题单中生效，刷新生效 ",
                        placement: "bottom-end"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_switch, {
                            modelValue: fromData.onlyUrls,
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => fromData.onlyUrls = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, { label: "使用题单" }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_switch, {
                        modelValue: fromData.useDefaultSetting,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => fromData.useDefaultSetting = $event)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"]),
              fromData.useDefaultSetting ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createVNode(_component_el_divider),
                vue.createVNode(_component_el_button, {
                  plain: "",
                  onClick: showProblems
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 查看收藏的题单 ")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_divider)
              ], 64)) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_dialog, {
                modelValue: dialogTableVisible.value,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => dialogTableVisible.value = $event),
                title: "题单"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, { gutter: 10 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: 8 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: keywords.value,
                            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => keywords.value = $event),
                            placeholder: "请输入关键词过滤",
                            clearable: ""
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: 16 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            plain: "",
                            onClick: addlocal
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 添加本页 ")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_button, {
                            plain: "",
                            onClick: _cache[7] || (_cache[7] = ($event) => handlerProblems("add"))
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 自定义 ")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_button, {
                            plain: "",
                            onClick: handlerDefault
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 默认 ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table, {
                    data: urlsData.value,
                    height: "300",
                    style: { "width": "100%", "margin-top": "10px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_table_column, {
                        label: "标题",
                        width: "auto",
                        align: "center"
                      }, {
                        default: vue.withCtx((scope) => [
                          vue.createVNode(_component_el_link, {
                            href: scope.row.link,
                            target: "_blank",
                            type: "default"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(vue.toDisplayString(scope.row.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_table_column, {
                        label: "操作",
                        width: "auto",
                        align: "center"
                      }, {
                        default: vue.withCtx((scope) => [
                          vue.createVNode(_component_el_button, {
                            type: "primary",
                            size: "small",
                            onClick: ($event) => handlerProblems("update", scope.row, scope.$index)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("编辑")
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          vue.createVNode(_component_el_button, {
                            type: "danger",
                            size: "small",
                            onClick: ($event) => deleteProblems(scope.$index)
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
              }, 8, ["modelValue"]),
              vue.createVNode(_component_el_dialog, {
                modelValue: dialogFormVisible.value,
                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => dialogFormVisible.value = $event),
                title: `${info.status == "add" ? "添加" : "编辑"}`,
                width: "400"
              }, {
                footer: vue.withCtx(() => [
                  vue.createElementVNode("div", _hoisted_1, [
                    vue.createVNode(_component_el_button, {
                      onClick: _cache[11] || (_cache[11] = ($event) => dialogFormVisible.value = false)
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("取消")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_el_button, {
                      type: "primary",
                      onClick: addOrUpdate
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(" 确认 ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form, null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_form_item, {
                        label: "标题",
                        "label-width": formLabelWidth
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: info.title,
                            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => info.title = $event),
                            autocomplete: "off"
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_form_item, {
                        label: "链接",
                        "label-width": formLabelWidth
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_input, {
                            modelValue: info.link,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => info.link = $event),
                            autocomplete: "off"
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "title"])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6d3b190f"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("elementPlusCss");
  let Container = null;
  const VueApp = vue.createApp(App);
  const start = () => {
    Container = document.createElement("div");
    const body = document.querySelector("body");
    body.append(Container);
    Container.style.display = support_plugins() ? "block" : "none";
    return Container;
  };
  VueApp.use(ElementPlus).mount(start());
  _GM_registerMenuCommand(`${initObj().onlyUrls ? "仅在收藏题单页面生效" : "所有题单生效"}`, () => {
    const u = initObj();
    u.onlyUrls = !u.onlyUrls;
    Container.style.display = support_plugins() ? "block" : "none";
    _GM_setValue(__0x3f_problmes_solution__, u);
  });
  _GM_registerMenuCommand(`添加本页`, () => {
    const urls = initUrls();
    let ok = false;
    const url = window.location.href;
    for (let info of urls) {
      if (!info || !(info == null ? void 0 : info.link)) {
        continue;
      }
      if (info.link.indexOf(url) != -1) {
        ok = true;
        break;
      }
    }
    if (ok) {
      ElementPlus.ElMessage({
        message: "收藏失败,链接已经存在！",
        type: "error"
      });
    } else {
      urls.unshift({
        title: document.title,
        link: url
      });
      Container.style.display = "block";
      _GM_setValue(__0x3f_problmes_urls__, urls);
      _GM_setValue(__add_cur__, true);
      ElementPlus.ElMessage({
        message: "收藏成功！刷新生效",
        type: "success"
      });
    }
  });

})(Vue, ElementPlus);