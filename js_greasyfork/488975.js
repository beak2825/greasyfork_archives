// ==UserScript==
// @name         煎蛋吐槽记录器
// @namespace    yunyuyuan/jandan-recorder
// @version      1.2.7
// @author       yunyuyuan
// @description  煎蛋吐槽记录器，自动记录发送过的主题和评论
// @license      MIT
// @icon         data:image/png;base64,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
// @match        *://*.jandan.net/*
// @require      https://unpkg.com/vue@3.5.13/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/488975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E8%AE%B0%E5%BD%95%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/488975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E8%AE%B0%E5%BD%95%E5%99%A8.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const e=document.createElement("style");e.textContent=a,document.head.append(e)})(" .table-container[data-v-da57043c]{overflow:auto;flex-grow:1;align-self:stretch;border:1px solid #c1c1c1}table[data-v-da57043c]{width:100%;border-collapse:collapse}table thead[data-v-da57043c]{border-radius:12px 12px 0 0}table thead th[data-v-da57043c]{padding:10px 0;font-size:16px;position:sticky;top:0;z-index:1;background:#c8c8c8}table tbody tr td[data-v-da57043c]{word-break:break-word;white-space:pre-wrap}table tbody tr.is-child td[data-v-da57043c]{border-color:transparent}table tbody td[data-v-da57043c]{font-size:14px;padding:8px 0;border-top:1px solid rgb(218,218,218)}@media screen and (min-width: 769px){table tbody td[data-v-da57043c]{min-width:80px}}.settings-container{width:100%;overflow:auto;text-align:center}.settings-container>div{padding:20px 0;border-bottom:1px solid gray}.settings-container .github svg{height:30px;width:30px}#jandan-recorder-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:99999;background:#0009}#jandan-recorder-modal .inner{background:#fff;color:#000;width:70%;height:calc(100% - 100px);margin:50px auto auto;padding:10px;border-radius:12px;box-shadow:0 0 12px #0003;display:flex;align-items:center;flex-direction:column}@media screen and (min-width: 769px){#jandan-recorder-modal .inner{min-width:400px}}@media screen and (max-width: 768px){#jandan-recorder-modal .inner{width:90%}}#jandan-recorder-modal .header{position:relative;margin-bottom:10px;width:100%}#jandan-recorder-modal .header .switcher{font-size:15px;padding:4px 8px;margin:auto}#jandan-recorder-modal .header .close{position:absolute;right:0;cursor:pointer}#jandan-recorder-modal .header .close svg{stroke:#000;width:25px;height:25px}#jandan-recorder-modal .header .close:hover svg{stroke:red}#header .nav-items .nav-item:last-of-type{display:flex}#header .nav-items .nav-item:last-of-type .jandan-record-link{cursor:pointer}.jandan-record-link{word-break:keep-all}.jandan-record-rainbow-text{font-size:1.1rem!important;background:linear-gradient(to right,#66f,#09f,#0f0,#f39,#66f);-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;animation:rainbowanimation 6s ease-in-out infinite!important;background-size:400% 100%!important}@keyframes rainbowanimation{0%,to{background-position:0 0}50%{background-position:100% 0}} ");

(function (vue) {
  'use strict';

  const InterceptUrls = [
    /**
     * TODO 文章发布: N/A
    */
    /**
     * 创建 问答/树洞/随手拍/无聊图 : /api/comment/create, /jandan-comment.php
      request 
      {
        author: "",
        email: "",
        comment: "",
        comment_post_ID: ""
      }
      response string(id)
     */
    "/api/comment/create",
    "/jandan-comment.php",
    /**
     * 楼中回复: /api/tucao/create
      request 
      {
        content: "",
        comment_id?: 5637737, // 树洞id
        comment_post_ID: 102312
      }
      response
      {
        "code": 0,
        "msg": "success",
        "data": {
          "comment_ID": 12039174,
          "comment_author": "xiaoc",
          "comment_content": "祝福！",
          "comment_date": "2024-03-04T15:53:55.267675774+08:00",
          "comment_date_int": 1709538835,
          "comment_post_ID": 5637795,
          "comment_parent": 102312,
          "comment_reply_ID": 0,
          "is_jandan_user": 0,
          "is_tip_user": 0,
          "vote_negative": 0,
          "vote_positive": 0
        }
      }
     */
    "/api/tucao/create",
    /**
     * BBS发布: /api/forum/posts
      request
      {
        "title": "",
        "content": "",
        "page_id": 112928
      }
      response 
      {
          "code": 0,
          "msg": "success",
          "data": ""
          "post_id": ???
      }
     */
    // TODO "/api/forum/posts", 没有返回id，所以暂时不做
    /**
     * BBS吐槽: /api/forum/replies
      request
      {
        "content": "",
        "post_id": 1282,
        "page_id": 112928
      }
     */
    "/api/forum/replies"
  ];
  const OneDay = 1e3 * 60 * 60 * 24;
  const ShowModalEvent = "show-modal";
  const PushRecordEvent = "push-record";
  const AjaxSuccessEvent = "ajax-success";
  const SettingsStorageKey = "jandan-recorder-settings";
  const SettingsKeyAutoDeleteDay = "auto-delete-day";
  const SettingsKeyAutoDelete404 = "auto-delete-404";
  const SettingsKeyFoldItem = "fold-item";
  const SettingsKeyRGBName = "rgb-name";
  const DefaultSettings = {
    [SettingsKeyAutoDeleteDay]: "0",
    [SettingsKeyAutoDelete404]: false,
    [SettingsKeyFoldItem]: true,
    [SettingsKeyRGBName]: true
  };
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function mitt(n) {
    return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }
  const emitter = mitt();
  const _window = _unsafeWindow || window;
  (_window == null ? void 0 : _window.jQuery) || (_window == null ? void 0 : _window.$);
  const _hoisted_1$2 = { class: "table-container" };
  const _hoisted_2$1 = ["onClick"];
  const _hoisted_3$1 = ["href"];
  const _hoisted_4$1 = ["onClick"];
  const _hoisted_5$1 = { key: 0 };
  const ListStorageKey = "jandan-recorder";
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props) {
      const theadItems = vue.markRaw([{
        name: "日期"
      }, {
        name: "类型"
      }, {
        name: "内容"
      }, {
        name: "网址",
        width: "40px",
        keepWords: true
      }, {
        name: "操作",
        width: "40px",
        keepWords: true
      }]);
      const settings = vue.readonly(vue.inject("settings"));
      const inSetting = vue.readonly(vue.inject("inSetting"));
      const list = vue.reactive([]);
      const openedUrls = vue.reactive(/* @__PURE__ */ new Set());
      const listWithFold = vue.computed(() => {
        if (settings[SettingsKeyFoldItem]) {
          const result = [];
          for (const item of list) {
            const sameUrlItemIdx = result.findIndex((i) => i.url === item.url);
            if (sameUrlItemIdx > -1) {
              const sameUrlItem = result[sameUrlItemIdx];
              sameUrlItem.childrenNum += 1;
              result.splice(sameUrlItemIdx + sameUrlItem.childrenNum, 0, { ...item, isChild: true });
            } else {
              result.push({ ...item, childrenNum: 0 });
            }
          }
          return result;
        } else {
          return list;
        }
      });
      const getListFromStorage = () => {
        list.splice(0, list.length, ...JSON.parse(localStorage.getItem(ListStorageKey) || "[]"));
      };
      const saveList = () => {
        localStorage.setItem(ListStorageKey, JSON.stringify(vue.toRaw(list)));
        getListFromStorage();
      };
      emitter.on(PushRecordEvent, (newItem) => {
        if (!newItem) return;
        list.unshift(newItem);
        saveList();
      });
      const removeListItem = (idx) => {
        list.splice(idx, 1);
        saveList();
      };
      const toggleOpened = (url) => {
        if (openedUrls.has(url)) {
          openedUrls.delete(url);
        } else {
          openedUrls.add(url);
        }
      };
      vue.watch(inSetting, (inSetting2) => {
        if (!inSetting2) {
          getListFromStorage();
        }
      });
      vue.onMounted(() => {
        getListFromStorage();
        const now2 = Date.now();
        const autoDeleteDay = parseInt(settings[SettingsKeyAutoDeleteDay]);
        if (typeof autoDeleteDay === "number" && autoDeleteDay > 0) {
          list.splice(0, list.length, ...list.filter((item) => {
            return item.timestamp > now2 - OneDay * autoDeleteDay;
          }));
        }
        saveList();
        if (settings[SettingsKeyAutoDelete404]) {
          const allUrls = new Set(list.map((item) => item.url));
          (async () => {
            for (const url of allUrls) {
              const biggest = list.filter((item) => item.url === url).map((item) => item.lastCheck404 || 0).sort((a, b) => a - b).pop();
              if (biggest < now2 - OneDay) {
                const res = await fetch(url);
                if (res.status === 404) {
                  list.splice(0, list.length, ...list.filter((item) => {
                    return item.url !== url;
                  }));
                }
                list.forEach((item) => {
                  if (item.url === url) {
                    item.lastCheck404 = now2;
                  }
                });
                await new Promise((resolve) => setTimeout(resolve, 1e3));
              }
              saveList();
            }
          })();
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("table", null, [
            vue.createElementVNode("thead", null, [
              vue.createElementVNode("tr", null, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(theadItems), (i) => {
                  return vue.openBlock(), vue.createElementBlock("th", {
                    key: i.name,
                    style: vue.normalizeStyle({
                      "word-break": i.keepWords ? "keep-all" : "unset",
                      "min-width": i.width ?? "unset"
                    })
                  }, vue.toDisplayString(i.name), 5);
                }), 128))
              ])
            ]),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(listWithFold.value, (item, idx) => {
                return vue.openBlock(), vue.createElementBlock("tr", {
                  key: item.timestamp,
                  class: vue.normalizeClass({ "is-child": item.isChild })
                }, [
                  !item.isChild || openedUrls.has(item.url) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.createElementVNode("td", null, vue.toDisplayString(new Date(item.timestamp).toLocaleString()), 1),
                    vue.createElementVNode("td", null, vue.toDisplayString(item.isCreate ? "楼主" : "吐槽"), 1),
                    vue.createElementVNode("td", null, [
                      vue.createTextVNode(vue.toDisplayString(item.content) + " ", 1),
                      vue.unref(settings)[vue.unref(SettingsKeyFoldItem)] && item.childrenNum ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        _cache[0] || (_cache[0] = vue.createElementVNode("br", null, null, -1)),
                        vue.createElementVNode("button", {
                          onClick: ($event) => toggleOpened(item.url)
                        }, vue.toDisplayString(openedUrls.has(item.url) ? "收起" : "展开") + vue.toDisplayString(item.childrenNum) + "条 ", 9, _hoisted_2$1)
                      ], 64)) : vue.createCommentVNode("", true)
                    ]),
                    vue.createElementVNode("td", null, [
                      vue.createElementVNode("a", {
                        target: "_blank",
                        href: item.urlWithAnchor || item.url
                      }, "前往", 8, _hoisted_3$1)
                    ]),
                    vue.createElementVNode("td", null, [
                      vue.createElementVNode("button", {
                        onClick: ($event) => removeListItem(idx)
                      }, " 删除 ", 8, _hoisted_4$1)
                    ])
                  ], 64)) : vue.createCommentVNode("", true)
                ], 2);
              }), 128)),
              list.length === 0 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$1, "一条都没有，赶快去吐槽吧！")) : vue.createCommentVNode("", true)
            ])
          ])
        ]);
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
  const ListComp = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-da57043c"]]);
  const _hoisted_1$1 = { class: "settings-container" };
  const _hoisted_2 = { title: "每次打开网站时检查" };
  const _hoisted_3 = { title: "每天自动检查一次" };
  const _hoisted_4 = { title: "在同一个贴子下面有多个吐槽，则自动折叠，但依然可以手动展开" };
  const _hoisted_5 = { title: "给自己的昵称加上牛逼闪闪的RGB特效" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "settings",
    setup(__props) {
      const version = "v1.2.7";
      const settings = vue.inject("settings");
      const refreshSettings = () => {
        Object.assign(settings, {
          ...DefaultSettings,
          ...JSON.parse(localStorage.getItem(SettingsStorageKey) || "{}")
        });
      };
      const updateSettings = (newSettings) => {
        localStorage.setItem(SettingsStorageKey, JSON.stringify({
          ...vue.toRaw(settings),
          ...newSettings
        }));
      };
      const inputAutoDeleteDay = (e) => {
        const val = parseInt(e.target.value || "");
        updateSettings({
          [SettingsKeyAutoDeleteDay]: isNaN(val) || val < 1 ? "0" : val.toString()
        });
      };
      const inputAutoDelete404 = (e) => {
        updateSettings({
          [SettingsKeyAutoDelete404]: e.target.checked
        });
        refreshSettings();
      };
      const toggleFoldItem = (e) => {
        updateSettings({
          [SettingsKeyFoldItem]: e.target.checked
        });
        refreshSettings();
      };
      const toggleRGBName = (e) => {
        updateSettings({
          [SettingsKeyRGBName]: e.target.checked
        });
        refreshSettings();
      };
      vue.onMounted(() => {
        refreshSettings();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2, [
            _cache[4] || (_cache[4] = vue.createTextVNode(" 自动删除 ")),
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(settings)[vue.unref(SettingsKeyAutoDeleteDay)] = $event),
              type: "number",
              min: "0",
              step: "1",
              onInput: inputAutoDeleteDay,
              onFocusout: refreshSettings
            }, null, 544), [
              [vue.vModelText, vue.unref(settings)[vue.unref(SettingsKeyAutoDeleteDay)]]
            ]),
            _cache[5] || (_cache[5] = vue.createTextVNode(" 天前的记录(默认设置为0则不自动删除) "))
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(settings)[vue.unref(SettingsKeyAutoDelete404)] = $event),
              type: "checkbox",
              onChange: inputAutoDelete404
            }, null, 544), [
              [vue.vModelCheckbox, vue.unref(settings)[vue.unref(SettingsKeyAutoDelete404)]]
            ]),
            _cache[6] || (_cache[6] = vue.createTextVNode(" 自动删除已失效(404)的记录 "))
          ]),
          vue.createElementVNode("div", _hoisted_4, [
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(settings)[vue.unref(SettingsKeyFoldItem)] = $event),
              type: "checkbox",
              onChange: toggleFoldItem
            }, null, 544), [
              [vue.vModelCheckbox, vue.unref(settings)[vue.unref(SettingsKeyFoldItem)]]
            ]),
            _cache[7] || (_cache[7] = vue.createTextVNode(" 折叠主题相同的项目 "))
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(settings)[vue.unref(SettingsKeyRGBName)] = $event),
              type: "checkbox",
              onChange: toggleRGBName
            }, null, 544), [
              [vue.vModelCheckbox, vue.unref(settings)[vue.unref(SettingsKeyRGBName)]]
            ]),
            _cache[8] || (_cache[8] = vue.createTextVNode(" 🪄")),
            _cache[9] || (_cache[9] = vue.createElementVNode("span", { class: "jandan-record-rainbow-text" }, "个人名称RGB特效", -1)),
            _cache[10] || (_cache[10] = vue.createTextVNode("🪄 "))
          ]),
          vue.createElementVNode("div", null, [
            _cache[13] || (_cache[13] = vue.createElementVNode("p", null, [
              vue.createElementVNode("a", {
                class: "github",
                target: "_blank",
                href: "https://github.com/yunyuyuan/jandan-recorder"
              }, [
                vue.createElementVNode("svg", { viewBox: "0 0 16 16" }, [
                  vue.createElementVNode("path", { d: "M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" })
                ])
              ])
            ], -1)),
            vue.createElementVNode("p", null, [
              vue.createTextVNode(" 当前版本：" + vue.toDisplayString(vue.unref(version)), 1),
              _cache[11] || (_cache[11] = vue.createElementVNode("span", { style: { "color": "grey", "margin": "0 10px" } }, "|", -1)),
              _cache[12] || (_cache[12] = vue.createElementVNode("a", {
                target: "_blank",
                href: "https://update.greasyfork.org/scripts/488975/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%E8%AE%B0%E5%BD%95%E5%99%A8.user.js"
              }, "检查更新", -1))
            ])
          ])
        ]);
      };
    }
  });
  const _hoisted_1 = { class: "header" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "modal",
    setup(__props) {
      const inSetting = vue.inject("inSetting");
      const showModal = vue.ref(false);
      emitter.on(ShowModalEvent, () => {
        showModal.value = true;
      });
      const close = () => {
        showModal.value = false;
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          id: "jandan-recorder-modal",
          onMousedown: _cache[3] || (_cache[3] = ($event) => showModal.value = false)
        }, [
          vue.createElementVNode("div", {
            class: "inner",
            onMousedown: _cache[2] || (_cache[2] = (e) => e.stopPropagation())
          }, [
            vue.createElementVNode("div", _hoisted_1, [
              vue.createElementVNode("button", {
                class: "switcher",
                onClick: _cache[0] || (_cache[0] = ($event) => inSetting.value = !vue.unref(inSetting))
              }, vue.toDisplayString(vue.unref(inSetting) ? "返回列表(设置会自动保存)" : "前往设置"), 1),
              vue.createElementVNode("span", {
                class: "close",
                onClick: _cache[1] || (_cache[1] = ($event) => close())
              }, _cache[4] || (_cache[4] = [
                vue.createElementVNode("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  vue.createElementVNode("path", {
                    d: "M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ], -1)
              ]))
            ]),
            vue.withDirectives(vue.createVNode(ListComp, null, null, 512), [
              [vue.vShow, !vue.unref(inSetting)]
            ]),
            vue.withDirectives(vue.createVNode(_sfc_main$2, null, null, 512), [
              [vue.vShow, vue.unref(inSetting)]
            ])
          ], 32)
        ], 544)), [
          [vue.vShow, showModal.value]
        ]);
      };
    }
  });
  function myBbs(userData) {
    var _a;
    if (!document.getElementById("my-bbs-link") && _window.location.pathname === "/bbs" && userData) {
      const myBbs2 = document.createElement("a");
      myBbs2.innerText = "我的贴子";
      myBbs2.id = "my-bbs-link";
      myBbs2.href = `/bbs#/user/${userData.id}`;
      myBbs2.target = "_blank";
      (_a = document.querySelector(".list-header")) == null ? void 0 : _a.appendChild(myBbs2);
    }
  }
  const addRGB = (nickname) => {
    getAllNickNameEl().forEach((el) => {
      if (el.innerText == nickname) {
        el.classList.add("jandan-record-rainbow-text");
      } else {
        el.classList.remove("jandan-record-rainbow-text");
      }
    });
  };
  const rmRGB = () => {
    getAllNickNameEl().forEach((el) => {
      el.classList.remove("jandan-record-rainbow-text");
    });
  };
  const getAllNickNameEl = () => {
    const result = [];
    const url = _window.location.pathname.replace(/^(\/[^/]+).*?$/, "$1");
    switch (url) {
      case "/dzh":
        result.push(...document.querySelectorAll(".tucao-author-bar .tucao-author"));
        break;
      case "/bbs":
        result.push(...document.querySelectorAll(".topic-author .author-link"));
        result.push(...document.querySelectorAll(".thread-info .author-link,.reply .topic-author >b"));
        break;
      case "/p":
        result.push(...document.querySelectorAll(".reply-container .jdcomment-author >b"));
        break;
      default:
        result.push(...document.querySelectorAll(".row >.author >strong[title]"));
        result.push(...document.querySelectorAll(".tucao-author >span:first-of-type"));
        result.push(...document.querySelectorAll("#comments .comment-topic >b:first-of-type"));
        result.push(...document.querySelectorAll(".commentlist >li[id] > b:first-of-type"));
        break;
    }
    return result;
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$2;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$2 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$2;
  var root$1 = _root;
  var now$1 = function() {
    return root$1.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var root = _root;
  var Symbol$3 = root.Symbol;
  var _Symbol = Symbol$3;
  var Symbol$2 = _Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag$1(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$1;
  function isObjectLike$1(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$1;
  var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
  var symbolTag = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$1 = isObject_1, isSymbol = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject$1(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$1(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_1 = debounce;
  const debounce$1 = /* @__PURE__ */ getDefaultExportFromCjs(debounce_1);
  function processResponse(url, requestData, res) {
    let item = null;
    const now2 = Date.now();
    switch (url) {
      case "/jandan-comment.php":
      case "/api/comment/create":
        item = {
          url: `/t/${res}`,
          urlWithAnchor: `/t/${res}`,
          isCreate: true,
          content: requestData.comment,
          timestamp: now2,
          lastCheck404: now2
        };
        break;
      case "/api/tucao/create":
        if (res.msg == "success") {
          const isPost = _window.location.pathname.startsWith("/p/");
          item = {
            url: isPost ? `/p/${requestData.comment_post_ID}` : `/t/${requestData.comment_id}`,
            urlWithAnchor: isPost ? `/p/${requestData.comment_post_ID}#${res.data.comment_ID}` : `/t/${requestData.comment_id}#tucao-${res.data.comment_ID}`,
            isCreate: false,
            content: requestData.content,
            timestamp: now2,
            lastCheck404: now2
          };
        }
        break;
      case "/api/forum/replies":
        if (res.msg == "success") {
          item = {
            url: `/bbs#/topic/${requestData.post_id}`,
            urlWithAnchor: `/bbs#/topic/${requestData.post_id}`,
            isCreate: false,
            content: requestData.content,
            timestamp: now2,
            lastCheck404: now2
          };
        }
        break;
    }
    item && emitter.emit(PushRecordEvent, item);
  }
  function parseRequestData(requestData) {
    let result = requestData;
    const parsedObj = {};
    if (typeof requestData == "string") {
      try {
        return JSON.parse(requestData);
      } catch {
        for (const [key, value] of new URLSearchParams(requestData)) {
          parsedObj[key] = value;
        }
        result = parsedObj;
      }
    } else if (requestData instanceof FormData) {
      requestData.forEach(function(value, key) {
        parsedObj[key] = value;
      });
      result = parsedObj;
    }
    return result;
  }
  function initHttpInterception() {
    if ($) {
      $(document).on("ajaxSuccess", function(_event, _jqXHR, settings, data) {
        try {
          emitter.emit(AjaxSuccessEvent);
          const url = settings.url;
          if (InterceptUrls.includes(url)) {
            processResponse(url, parseRequestData(settings.data), data);
          }
        } catch {
        }
      });
    }
    if (_window.axios) {
      _window.axios.interceptors.response.use((response) => {
        try {
          emitter.emit(AjaxSuccessEvent);
          processResponse(response.config.url, parseRequestData(response.config.data), response.data);
        } catch {
        }
        return response;
      });
    }
  }
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const settings = vue.reactive({
        ...DefaultSettings,
        ...JSON.parse(localStorage.getItem(SettingsStorageKey) || "{}")
      });
      const userData = vue.reactive({});
      vue.provide("settings", settings);
      vue.provide("inSetting", vue.ref(false));
      vue.provide("userData", userData);
      const documentMutation = debounce$1(() => {
        myBbs(userData);
        if (settings[SettingsKeyRGBName]) {
          setTimeout(() => {
            addRGB(userData.nickname);
          });
        }
      }, 200);
      vue.watch(settings, ({ [SettingsKeyRGBName]: rgbEnabled }) => {
        if (!rgbEnabled) {
          rmRGB();
        } else {
          addRGB(userData.nickname);
        }
      });
      vue.onMounted(() => {
        fetch("/api/member/get_info").then((res) => {
          if (res.ok) {
            res.json().then((res2) => {
              var _a;
              if ((_a = res2.data) == null ? void 0 : _a.id) {
                Object.assign(userData, res2.data);
              }
            });
          }
        });
        emitter.on(AjaxSuccessEvent, documentMutation);
        const observer = new MutationObserver(documentMutation);
        observer.observe(document.body, { childList: true, subtree: true });
        documentMutation();
        initHttpInterception();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
  const memberLink = document.querySelector('a[href="/member"]');
  const myPost = document.createElement("a");
  myPost.classList.add("nav-link", "jandan-record-link");
  myPost.innerText = "我的吐槽";
  myPost.onclick = () => {
    emitter.emit(ShowModalEvent);
  };
  memberLink.parentElement.appendChild(myPost);
  console.log("煎蛋吐槽记录器加载成功！");

})(Vue);