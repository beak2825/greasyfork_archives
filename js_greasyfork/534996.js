// ==UserScript==
// @name         B站收藏夹分区筛选功能
// @namespace    https://github.com/Jayvin-Leung
// @version      1.0.0
// @author       Jayvin Leung
// @description  恢复B站收藏夹分区筛选功能
// @license      MIT
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @homepageURL  https://github.com/Jayvin-Leung/Bilibili-Fav-Filter
// @supportURL   https://github.com/Jayvin-Leung/Bilibili-Fav-Filter/issues
// @match        https://space.bilibili.com/*/favlist*
// @require      https://registry.npmmirror.com/vue/3.5.13/files/dist/vue.global.prod.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534996/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/534996/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .vui_popover-content[data-v-12251a92]{display:flex}.menu-popover__panel-item[data-v-12251a92],.vui_button[data-v-c84debb6],.vui_button span[data-v-c84debb6]{display:flex;align-items:center;justify-content:space-evenly}.vui_button span[data-v-c84debb6]{padding:0 4px}.items__item[data-v-a3628dd0]{position:relative} ");

(function (vue) {
  'use strict';

  const XOR_CODE = 23442827791579n;
  const MASK_CODE = 2251799813685247n;
  const MAX_AID = 1n << 51n;
  const BASE = 58n;
  const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
  const getCookieValue = (key) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim().split("=");
      if (cookie[0] === key) {
        return cookie.length > 1 ? cookie[1] : "";
      }
    }
    return null;
  };
  const getUid = () => {
    return getCookieValue("DedeUserID");
  };
  const getCsrf = () => {
    return getCookieValue("bili_jct");
  };
  const getCurrLocation = () => {
    const currLocation = location.origin + location.pathname;
    return currLocation.endsWith("/") ? currLocation : currLocation + "/";
  };
  const getCurrBvid = () => {
    if (location.origin != "https://www.bilibili.com") return "";
    const arr = location.pathname.split("/");
    if (arr[1] !== "video") return "";
    if (!new RegExp(/(BV|av)[a-zA-Z0-9]+/).test(arr[2])) return "";
    return arr[2];
  };
  const av2bv = (aid) => {
    const bytes = ["B", "V", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
    while (tmp > 0) {
      bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
      tmp = tmp / BASE;
      bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join("");
  };
  const bv2av = (bvid) => {
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce(
      (pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)),
      0n
    );
    return Number(tmp & MASK_CODE ^ XOR_CODE);
  };
  const biliUtil = {
    getCookieValue,
    getUid,
    getCsrf,
    getCurrLocation,
    getCurrBvid,
    av2bv,
    bv2av
  };
  const request = async (url, option, success, failure) => {
    if (!url || !option) {
      throw new Error("invaild url or option");
    }
    return fetch(url, option).then((response) => response.json()).then((result) => {
      if (result.code === 0) {
        success && success(result.data);
        return result.data;
      } else {
        failure && failure(result.message);
        return result.message;
      }
    }).catch((e) => {
      failure && failure("请求发生错误：" + e);
      return e;
    });
  };
  class Request {
    get(url, params = {}, success, failure) {
      params.platform = "web";
      const keys = Object.keys(params).sort();
      const query = keys.map((k) => `${k}=${params[k]}`).join("&");
      return request(
        query ? `${url}?${query}` : url,
        {
          method: "GET",
          credentials: "include",
          mode: "cors"
        },
        success,
        failure
      );
    }
    post(url, params = {}, success, failure) {
      params.platform = "web";
      params.csrf = biliUtil.getCsrf();
      const keys = Object.keys(params).sort();
      const query = new URLSearchParams();
      keys.forEach((k) => query.append(k, params[k]));
      return request(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: query.toString(),
          credentials: "include",
          mode: "cors"
        },
        success,
        failure
      );
    }
  }
  const request$1 = new Request();
  const all = ({ upMid }, success, failure) => {
    if (!upMid) return;
    let url = "https://api.bilibili.com/x/v3/fav/folder/created/list-all";
    let params = {
      up_mid: upMid
    };
    return request$1.get(url, params, success, failure);
  };
  const list = ({ mediaId: mediaId2, pn = 1, ps = 36, tid = 0, type = 0, keyword = "", order = "mtime" }, success, failure) => {
    if (!mediaId2) return;
    let url = "https://api.bilibili.com/x/v3/fav/resource/list";
    let params = {
      media_id: mediaId2,
      pn,
      ps,
      tid,
      type,
      keyword,
      order
    };
    return request$1.get(url, params, success, failure);
  };
  const del$1 = ({ mediaId: mediaId2, resources }, success, failure) => {
    if (!mediaId2 || !resources) return;
    let url = "https://api.bilibili.com/x/v3/fav/resource/batch-del";
    let params = {
      media_id: mediaId2,
      resources
    };
    return request$1.post(url, params, success, failure);
  };
  const copy = ({ mid: mid2, srcMediaId, tarMediaId, resources }, success, failure) => {
    if (!mid2 || !srcMediaId || !tarMediaId || !resources) return;
    let url = "https://api.bilibili.com/x/v3/fav/resource/copy";
    let params = {
      mid: mid2,
      src_media_id: srcMediaId,
      tar_media_id: tarMediaId,
      resources
    };
    return request$1.post(url, params, success, failure);
  };
  const move = ({ mid: mid2, srcMediaId, tarMediaId, resources }, success, failure) => {
    if (!mid2 || !srcMediaId || !tarMediaId || !resources) return;
    let url = "https://api.bilibili.com/x/v3/fav/resource/move";
    let params = {
      mid: mid2,
      src_media_id: srcMediaId,
      tar_media_id: tarMediaId,
      resources
    };
    return request$1.post(url, params, success, failure);
  };
  const clean = ({ mediaId: mediaId2 }, success, failure) => {
    if (!mediaId2) return;
    let url = "https://api.bilibili.com/x/v3/fav/resource/clean";
    let params = {
      media_id: mediaId2
    };
    return request$1.post(url, params, success, failure);
  };
  const _hoisted_1$8 = {
    key: 0,
    class: "vui_toast--wrapper"
  };
  const _hoisted_2$8 = { class: "vui_toast" };
  const _sfc_main$c = {
    __name: "Message",
    props: /* @__PURE__ */ vue.mergeModels({
      text: {
        required: false,
        default: ""
      }
    }, {
      "open": {},
      "openModifiers": {}
    }),
    emits: ["update:open"],
    setup(__props) {
      const open = vue.useModel(__props, "open");
      return (_ctx, _cache) => {
        return open.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$8, [
          vue.createElementVNode("div", _hoisted_2$8, vue.toDisplayString(__props.text), 1)
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  let app$2 = null;
  let timerId = null;
  const openRef$2 = vue.ref(false);
  const textRef = vue.ref("");
  const render$3 = () => {
    if (app$2) return;
    app$2 = vue.createApp({
      render: () => {
        return vue.h(_sfc_main$c, {
          open: openRef$2.value,
          text: textRef.value
        });
      }
    });
    app$2.mount(
      (() => {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
      })()
    );
  };
  const message = {
    info: ({ text }) => {
      render$3();
      openRef$2.value = true;
      textRef.value = text;
      timerId && clearTimeout(timerId);
      timerId = setTimeout(() => {
        openRef$2.value = false;
      }, 3e3);
    }
  };
  const _hoisted_1$7 = { class: "vui_dialog--root" };
  const _hoisted_2$7 = { class: "vui_dialog--wrapper" };
  const _hoisted_3$5 = { class: "vui_dialog--header" };
  const _hoisted_4$3 = { class: "vui_dialog--title" };
  const _hoisted_5$3 = { class: "vui_dialog--body" };
  const _hoisted_6$3 = { class: "vui_dialog--footer" };
  const _sfc_main$b = {
    __name: "Modal",
    props: /* @__PURE__ */ vue.mergeModels({
      wrapClassName: {
        type: String,
        required: false,
        default: ""
      },
      title: {
        required: false,
        default: ""
      },
      okText: {
        required: false,
        default: ""
      },
      cancelText: {
        required: false,
        default: ""
      }
    }, {
      "open": {},
      "openModifiers": {}
    }),
    emits: /* @__PURE__ */ vue.mergeModels(["ok", "cancel", "close"], ["update:open"]),
    setup(__props, { emit: __emit }) {
      const open = vue.useModel(__props, "open");
      const emits = __emit;
      const modalRef = vue.ref(null);
      const ok = () => {
        emits("ok");
      };
      const cancel = () => {
        open.value = false;
        emits("cancel");
      };
      const close = () => {
        open.value = false;
        emits("close");
      };
      const globalClose = (event) => {
        if (!modalRef.value) return;
        if (!modalRef.value.contains(event.target)) {
          close();
        }
      };
      vue.watch(
        () => open.value,
        () => {
          if (open.value) {
            document.addEventListener("click", globalClose);
          } else {
            document.removeEventListener("click", globalClose);
          }
        }
      );
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "vui_dialog--mask" }, null, -1)),
          vue.createElementVNode("div", _hoisted_2$7, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(`vui_dialog--content ${__props.wrapClassName}`),
              ref_key: "modalRef",
              ref: modalRef
            }, [
              vue.createElementVNode("div", {
                class: "vui_dialog--close",
                onClick: close
              }, _cache[0] || (_cache[0] = [
                vue.createElementVNode("svg", {
                  class: "vui_icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  width: "20",
                  height: "20",
                  "xmlns:xlink": "http://www.w3.org/1999/xlink"
                }, [
                  vue.createElementVNode("path", {
                    d: "M4.106275 4.108583333333334C4.350341666666667 3.8645000000000005 4.746083333333333 3.8645000000000005 4.9901583333333335 4.108583333333334L9.998666666666667 9.117125L15.008583333333334 4.107216666666667C15.252625 3.8631333333333338 15.648375000000001 3.8631333333333338 15.892458333333334 4.107216666666667C16.136541666666666 4.351291666666667 16.136541666666666 4.747025000000001 15.892458333333334 4.9911L10.882541666666667 10.001000000000001L15.891375 15.009791666666667C16.135458333333332 15.253874999999999 16.135458333333332 15.649625 15.891375 15.893708333333334C15.647291666666668 16.13775 15.251541666666668 16.13775 15.0075 15.893708333333334L9.998666666666667 10.884875000000001L4.991233333333334 15.892333333333333C4.747158333333333 16.13641666666667 4.351425 16.13641666666667 4.10735 15.892333333333333C3.8632750000000002 15.648249999999999 3.8632750000000002 15.252541666666666 4.10735 15.008458333333333L9.114791666666667 10.001000000000001L4.106275 4.992466666666667C3.8621916666666665 4.7483916666666675 3.8621916666666665 4.352658333333333 4.106275 4.108583333333334z",
                    fill: "currentColor"
                  })
                ], -1)
              ])),
              vue.createElementVNode("div", _hoisted_3$5, [
                vue.createElementVNode("div", _hoisted_4$3, vue.toDisplayString(__props.title), 1)
              ]),
              vue.createElementVNode("div", _hoisted_5$3, [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              vue.createElementVNode("div", _hoisted_6$3, [
                __props.cancelText ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 0,
                  class: "vui_button vui_dialog--btn vui_dialog--btn-cancel",
                  onClick: cancel
                }, vue.toDisplayString(__props.cancelText || "取消"), 1)) : vue.createCommentVNode("", true),
                __props.okText ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 1,
                  class: "vui_button vui_button--blue vui_dialog--btn vui_dialog--btn-confirm",
                  onClick: ok
                }, vue.toDisplayString(__props.okText || "确定"), 1)) : vue.createCommentVNode("", true)
              ])
            ], 2)
          ])
        ], 512)), [
          [vue.vShow, open.value]
        ]);
      };
    }
  };
  let app$1 = null;
  const openRef$1 = vue.ref(false);
  const wrapClassNameRef = vue.ref("");
  const titleRef = vue.ref("");
  const templateRef = vue.shallowRef(null);
  const templatePropsRef = vue.ref(null);
  const $okRef = vue.ref(null);
  const $cancelRef$1 = vue.ref(null);
  const $closeRef = vue.ref(null);
  const render$2 = () => {
    if (app$1) return;
    app$1 = vue.createApp({
      render: () => {
        return vue.h(
          _sfc_main$b,
          {
            open: openRef$1.value,
            "onUpdate:open": (newValue) => openRef$1.value = newValue,
            wrapClassName: wrapClassNameRef.value,
            title: titleRef.value,
            okText: $okRef.value && "确定",
            onOk: () => {
              $okRef.value && $okRef.value();
            },
            cancelText: $cancelRef$1.value && "取消",
            onCancel: () => {
              $cancelRef$1.value && $cancelRef$1.value();
            },
            onClose: () => {
              $closeRef.value && $closeRef.value();
            }
          },
          () => templateRef.value && vue.h(templateRef.value, { ...templatePropsRef.value })
        );
      }
    });
    app$1.mount(
      (() => {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
      })()
    );
  };
  const modal = {
    open: ({ wrapClassName, title, template, templateProps, $ok, $cancel, $close }) => {
      render$2();
      openRef$1.value = true;
      wrapClassNameRef.value = wrapClassName;
      titleRef.value = title;
      templateRef.value = template;
      templatePropsRef.value = templateProps;
      $okRef.value = $ok;
      $cancelRef$1.value = $cancel;
      $closeRef.value = $close;
      return () => {
        openRef$1.value = false;
        $closeRef.value && $closeRef.value();
      };
    }
  };
  const _hoisted_1$6 = { class: "modify-fav-wrapper" };
  const _hoisted_2$6 = { class: "modify-fav-list" };
  const _hoisted_3$4 = { class: "vui_radio-group" };
  const _hoisted_4$2 = ["onClick"];
  const _hoisted_5$2 = { class: "vui_radio--input" };
  const _hoisted_6$2 = ["value"];
  const _hoisted_7$1 = { class: "vui_radio--label" };
  const _hoisted_8$1 = { class: "modify-fav-item__content" };
  const _hoisted_9$1 = { class: "modify-fav-item__info" };
  const _hoisted_10$1 = { class: "modify-fav-item__title" };
  const _hoisted_11$1 = { class: "modify-fav-item__count" };
  const _sfc_main$a = {
    __name: "Modify",
    props: /* @__PURE__ */ vue.mergeModels({
      favs: {
        type: Array,
        required: true,
        default: []
      }
    }, {
      "selected": {},
      "selectedModifiers": {}
    }),
    emits: ["update:selected"],
    setup(__props) {
      const selected = vue.useModel(__props, "selected");
      const handleSelect = (id, event) => {
        event.preventDefault();
        event.stopPropagation();
        selected.value = id;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          vue.createElementVNode("div", _hoisted_2$6, [
            vue.createElementVNode("div", _hoisted_3$4, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.favs, (fav) => {
                return vue.openBlock(), vue.createElementBlock("label", {
                  role: "radio",
                  class: vue.normalizeClass({
                    vui_radio: true,
                    "modify-fav-item": true,
                    "vui_radio--checked": selected.value === fav.id
                  }),
                  onClick: (event) => handleSelect(fav.id, event)
                }, [
                  vue.createElementVNode("span", _hoisted_5$2, [
                    vue.createElementVNode("input", {
                      type: "radio",
                      class: "vui_radio--input-original",
                      value: fav.id
                    }, null, 8, _hoisted_6$2),
                    _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "vui_radio--input-box" }, null, -1))
                  ]),
                  vue.createElementVNode("span", _hoisted_7$1, [
                    vue.createElementVNode("div", _hoisted_8$1, [
                      vue.createElementVNode("div", _hoisted_9$1, [
                        _cache[1] || (_cache[1] = vue.createElementVNode("i", {
                          class: "vui_icon sic-fsp-folder_locked_line",
                          style: { "font-variation-settings": "'strk' 1.5", "font-size": "20px" }
                        }, null, -1)),
                        vue.createElementVNode("div", _hoisted_10$1, vue.toDisplayString(fav.title), 1)
                      ]),
                      vue.createElementVNode("div", _hoisted_11$1, vue.toDisplayString(fav.media_count), 1)
                    ])
                  ])
                ], 10, _hoisted_4$2);
              }), 256))
            ])
          ])
        ]);
      };
    }
  };
  const _sfc_main$9 = {
    __name: "Order",
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const emits = __emit;
      const selected = vue.ref("mtime");
      const handleSelect = (order) => {
        selected.value = order;
        emits("change", order);
      };
      __expose({
        reset: () => {
          selected.value = "mtime";
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "radio-filter" }), [
          vue.createElementVNode("div", {
            class: vue.normalizeClass({
              "radio-filter__item": true,
              "radio-filter__item--active": selected.value === "mtime"
            }),
            onClick: _cache[0] || (_cache[0] = ($event) => handleSelect("mtime"))
          }, " 最近收藏 ", 2),
          vue.createElementVNode("div", {
            class: vue.normalizeClass({
              "radio-filter__item": true,
              "radio-filter__item--active": selected.value === "view"
            }),
            onClick: _cache[1] || (_cache[1] = ($event) => handleSelect("view"))
          }, " 最多播放 ", 2),
          vue.createElementVNode("div", {
            class: vue.normalizeClass({
              "radio-filter__item": true,
              "radio-filter__item--active": selected.value === "pubtime"
            }),
            onClick: _cache[2] || (_cache[2] = ($event) => handleSelect("pubtime"))
          }, " 最近投稿 ", 2)
        ], 16);
      };
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$5 = { class: "vui_popover-content" };
  const _hoisted_2$5 = {
    "data-v-831e1505": "",
    class: "menu-popover__panel"
  };
  const _hoisted_3$3 = ["innerHTML", "onClick"];
  const _sfc_main$8 = {
    __name: "Popover",
    props: /* @__PURE__ */ vue.mergeModels({
      target: {
        required: true
      },
      items: {
        type: Array,
        required: true,
        default: []
      }
    }, {
      "open": {},
      "openModifiers": {}
    }),
    emits: /* @__PURE__ */ vue.mergeModels(["cancel"], ["update:open"]),
    setup(__props, { emit: __emit }) {
      const open = vue.useModel(__props, "open");
      const props = __props;
      const emits = __emit;
      const popoverRef = vue.ref(null);
      const offsetTop = vue.ref(0);
      const offsetLeft = vue.ref(0);
      const globalClose = (event) => {
        if (!popoverRef.value) return;
        if (!popoverRef.value.contains(event.target)) {
          open.value = false;
          emits("cancel");
        }
      };
      const globalResize = () => {
        const targetRect = props.target.getBoundingClientRect();
        const popoverRect = popoverRef.value.getBoundingClientRect();
        offsetTop.value = targetRect.bottom + 10;
        if (window.scrollY) offsetTop.value += window.scrollY;
        offsetLeft.value = targetRect.left + (targetRect.width - popoverRect.width) / 2;
        if (window.scrollX) offsetLeft.value += window.scrollX;
      };
      vue.watch(
        () => open.value,
        () => {
          if (open.value) {
            document.addEventListener("click", globalClose);
            window.addEventListener("resize", globalResize);
            vue.nextTick(() => globalResize());
          } else {
            document.removeEventListener("click", globalClose);
            window.removeEventListener("resize", globalResize);
          }
        }
      );
      vue.watch(
        () => props.target,
        () => {
          if (open.value) {
            vue.nextTick(() => globalResize());
          }
        }
      );
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "vui_popover vui_popover-is-bottom-end",
          "data-popper-placement": "bottom-end",
          style: vue.normalizeStyle({
            "z-index": 1e4,
            position: "absolute",
            // inset: '0px 0px auto auto',
            top: "0px",
            left: "0px",
            margin: "0px",
            transform: `translate(${offsetLeft.value}px, ${offsetTop.value}px)`
          }),
          ref_key: "popoverRef",
          ref: popoverRef
        }, [
          vue.createElementVNode("div", _hoisted_1$5, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.items, (col) => {
              return vue.openBlock(), vue.createElementBlock("div", _hoisted_2$5, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(col, (row) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    "data-v-831e1505": "",
                    class: "menu-popover__panel-item",
                    innerHTML: row.$html,
                    onClick: row.$click
                  }, null, 8, _hoisted_3$3);
                }), 256))
              ]);
            }), 256))
          ])
        ], 4)), [
          [vue.vShow, open.value]
        ]);
      };
    }
  };
  const Popover = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-12251a92"]]);
  let app = null;
  const openRef = vue.ref(false);
  const targetRef = vue.ref(null);
  const itemsRef = vue.ref([]);
  const $cancelRef = vue.ref(null);
  const render$1 = () => {
    if (app) return;
    app = vue.createApp({
      render: () => {
        return vue.h(Popover, {
          open: openRef.value,
          "onUpdate:open": (newValue) => openRef.value = newValue,
          target: targetRef.value,
          items: itemsRef.value,
          onCancel: () => {
            $cancelRef.value && $cancelRef.value();
          }
        });
      }
    });
    app.mount(
      (() => {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
      })()
    );
  };
  const popover = {
    open: ({ target, items, $cancel }) => {
      render$1();
      if (targetRef.value && targetRef.value !== target) {
        $cancelRef.value && $cancelRef.value();
      }
      openRef.value = true;
      targetRef.value = target;
      itemsRef.value = items;
      $cancelRef.value = $cancel;
    }
  };
  const _hoisted_1$4 = { key: 0 };
  const _hoisted_2$4 = ["innerHTML"];
  const _sfc_main$7 = {
    __name: "Channel",
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const channels = [
        [
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M5.67687 4.05598L5.67687 4.05598C4.8817 4.05598 4.23687 4.70064 4.23687 5.49582L4.23687 11.94893L8.11451 15.3912L12.12979 11.94893L12.12979 4.05598L5.67687 4.05598z" fill="#6D69E4ff"></path><path d="M15.57206 15.82656L12.12979 19.72838L5.67687 19.72838C4.88158 19.72838 4.23687 19.08365 4.23687 18.28838L4.23687 11.94893L6.74114 11.94893C6.63916 12.15446 6.58075 12.38554 6.58075 12.63053C6.58075 13.47792 7.26776 14.16461 8.11482 14.16461C8.96189 14.16461 9.64886 13.47792 9.64886 12.63053C9.64886 12.38554 9.59049 12.15446 9.48819 11.94893L12.12979 11.94893L15.57206 15.82656z" fill="#9796EDff"></path><path d="M16.00752 8.16033L12.12989 11.63318L12.12989 14.24419C12.33542 14.14195 12.56659 14.08349 12.81158 14.08349C13.65898 14.08349 14.34566 14.77046 14.34566 15.61757C14.34566 16.46467 13.65898 17.15165 12.81158 17.15165C12.56659 17.15165 12.33542 17.09357 12.12989 16.99094L12.12989 19.72838L18.46934 19.72838C19.26461 19.72838 19.90934 19.08365 19.90934 18.28838L19.90934 11.63318L16.00752 8.16033z" fill="#6D69E4ff"></path><path d="M18.46934 4.05598C19.26461 4.05598 19.90934 4.70069 19.90934 5.49598L19.90934 11.94893L17.38723 11.94893C17.48947 11.74339 17.54755 11.51222 17.54755 11.26694C17.54755 10.41984 16.86086 9.73286 16.01357 9.73286C15.16646 9.73286 14.47949 10.41984 14.47949 11.26694C14.47949 11.51222 14.53786 11.74339 14.64019 11.94893L12.12989 11.94893L12.12989 9.3073C11.92435 9.40959 11.69328 9.46768 11.44829 9.46768C10.6009 9.46768 9.91392 8.781 9.91392 7.93361C9.91392 7.08655 10.6009 6.39986 11.44829 6.39986C11.69328 6.39986 11.92435 6.45795 12.12989 6.56025L12.12989 4.05598L18.46934 4.05598z" fill="#9796EDff"></path><path d="M12.12979 9.04368L10.4809 8.09169C9.47782 7.51265 8.65694 7.98655 8.65694 9.14492L8.65694 14.57338C8.65694 14.69107 8.66543 14.80176 8.68171 14.90496L12.12979 11.94893L12.12979 9.04368z" fill="#FDDE80ff"></path><path d="M13.72944 13.75075L10.4809 15.6263C9.47782 16.20557 8.65694 15.73171 8.65694 14.57338L8.65694 14.06611C9.23658 13.84704 9.64886 13.28707 9.64886 12.63053C9.64886 12.38554 9.59049 12.15446 9.48819 11.94893L12.12979 11.94893L13.72944 13.75075z" fill="#FDDE80ff"></path><path d="M13.88794 10.05869L15.1823 10.80595C16.18531 11.38522 16.18531 12.33302 15.1823 12.9121L13.10477 14.11152C13.00982 14.09309 12.91181 14.08349 12.81158 14.08349C12.56659 14.08349 12.33542 14.14195 12.12989 14.24419L12.12989 11.63318L13.88794 10.05869z" fill="#FDDE80ff"></path><path d="M8.65694 9.14491C8.65694 7.98655 9.47781 7.51266 10.4808 8.09169L15.18221 10.80586C16.18522 11.38522 16.18522 12.33302 15.18221 12.9121L10.4808 15.6263C9.47781 16.20557 8.65694 15.73171 8.65694 14.57338L8.65694 9.14491z" fill="#FDDE80ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">动画</span>',
            tid: 1
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M5.73713 20.26694L18.61296 20.26694C19.40822 20.26694 20.05296 19.6223 20.05296 18.82694L20.05296 5.83225C20.05296 5.03696 19.40822 4.39225 18.61296 4.39225L5.73712 4.39225C4.94183 4.39225 4.29712 5.03696 4.29712 5.83225L4.29713 18.82694C4.29713 19.6223 4.94184 20.26694 5.73713 20.26694z" fill="#57D587ff"></path><path d="M7.73276 8.05963C7.60831 8.05963 7.50647 8.16223 7.50647 8.28763L7.50647 10.96666C7.50647 11.09203 7.60831 11.19466 7.73276 11.19466L10.39162 11.19466C10.51603 11.19466 10.61789 11.09203 10.61789 10.96666L10.61789 8.28763C10.61789 8.16223 10.51603 8.05963 10.39162 8.05963L7.73276 8.05963z" fill="#1F9F81ff"></path><path d="M16.84051 8.28763C16.84051 8.16223 16.73875 8.05963 16.61424 8.05963L13.95542 8.05963C13.83091 8.05963 13.72915 8.16223 13.72915 8.28763L13.72915 10.96666C13.72915 11.09203 13.83091 11.19466 13.95542 11.19466L16.61424 11.19466C16.73875 11.19466 16.84051 11.09203 16.84051 10.96666L16.84051 8.28763z" fill="#1F9F81ff"></path><path d="M10.84416 11.19456C10.71974 11.19456 10.61789 11.29718 10.61789 11.42256L10.61789 12.70666C10.61789 12.83203 10.51603 12.93466 10.39162 12.93466L9.37919 12.93466C9.25473 12.93466 9.1529 13.03728 9.1529 13.16266L9.1529 14.27395L9.1529 14.72995L9.1529 15.84163L9.1529 16.29763L9.1529 17.40893C9.1529 17.5343 9.25473 17.63693 9.37919 17.63693L10.27843 17.63693C10.40294 17.63693 10.5047 17.5343 10.5047 17.40893L10.5047 16.29763C10.5047 16.17226 10.60656 16.06963 10.73098 16.06963L11.85658 16.06963L12.17338 16.06963L12.49066 16.06963L13.61616 16.06963C13.74058 16.06963 13.84243 16.17226 13.84243 16.29763L13.84243 17.40893C13.84243 17.5343 13.94429 17.63693 14.0687 17.63693L14.96755 17.63693C15.09197 17.63693 15.19382 17.5343 15.19382 17.40893L15.19382 16.29763L15.19382 15.84163L15.19382 14.72995L15.19382 14.27395L15.19382 13.16266C15.19382 13.03728 15.09197 12.93466 14.96755 12.93466L13.95562 12.93466C13.8311 12.93466 13.72934 12.83203 13.72934 12.70666L13.72934 11.42256C13.72934 11.29718 13.62749 11.19456 13.50298 11.19456L10.84416 11.19456z" fill="#1F9F81ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">游戏</span>',
            tid: 4
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M21.44573 11.95363C21.44573 9.55713 19.50038 7.61437 17.10058 7.61437C15.08016 7.61437 13.38701 8.99326 12.90048 10.85837C12.61642 10.97539 12.34656 11.1191 12.09197 11.28422C11.8248 11.11114 11.54035 10.9632 11.24141 10.8431C10.7495 8.98562 9.05986 7.61437 7.04517 7.61437C4.64539 7.61437 2.7 9.55713 2.7 11.95363C2.7 13.36733 3.37985 14.61888 4.42758 15.41136C4.42758 15.4225 4.42605 15.43315 4.42605 15.4439C4.42605 18.18326 6.64974 20.40394 9.39251 20.40394C10.38893 20.40394 11.31456 20.10806 12.09197 19.60387C12.86947 20.10806 13.7951 20.40394 14.7911 20.40394C17.5343 20.40394 19.75795 18.18326 19.75795 15.4439C19.75795 15.42365 19.75488 15.40406 19.75488 15.38381C20.78198 14.59027 21.44573 13.35091 21.44573 11.95363z" fill="#FF5C7Aff"></path><path d="M12.58224 5.53555L11.71478 5.53555C9.34452 5.53555 7.40521 7.47222 7.40521 9.83926L7.40521 15.31181C7.40521 17.67888 9.34452 19.61558 11.71478 19.61558L12.58224 19.61558C14.95258 19.61558 16.89187 17.67888 16.89187 15.31181L16.89187 9.83926C16.89187 7.47222 14.95258 5.53555 12.58224 5.53555z" fill="#ffffffff"></path><path d="M9.46395 12.41309C9.51499 12.25402 9.73997 12.25402 9.79104 12.41309L9.80074 12.44323C9.99446 13.04669 10.41043 13.55386 10.96445 13.86182C11.0785 13.92528 11.0785 14.08934 10.96445 14.1527C10.41043 14.46067 9.99446 14.96784 9.80074 15.5713L9.79104 15.60154C9.73997 15.76051 9.51499 15.76051 9.46395 15.60154L9.45425 15.5713C9.26053 14.96784 8.84449 14.46067 8.29054 14.1527C8.17648 14.08934 8.17648 13.92528 8.29054 13.86182C8.84449 13.55386 9.26053 13.04669 9.45425 12.44323L9.46395 12.41309z" fill="#FF5C7Aff"></path><path d="M14.28221 12.41309C14.33328 12.25402 14.55821 12.25402 14.60928 12.41309L14.61898 12.44323C14.8127 13.04669 15.22877 13.55386 15.78269 13.86182C15.89674 13.92528 15.89674 14.08934 15.78269 14.1527C15.22877 14.46067 14.8127 14.96784 14.61898 15.5713L14.60928 15.60154C14.55821 15.76051 14.33328 15.76051 14.28221 15.60154L14.27251 15.5713C14.07878 14.96784 13.66282 14.46067 13.1088 14.1527C12.99475 14.08934 12.99475 13.92528 13.1088 13.86182C13.66282 13.55386 14.07878 13.04669 14.27251 12.44323L14.28221 12.41309z" fill="#FF5C7Aff"></path><path d="M15.88627 4.34697C15.40176 4.34697 14.94173 4.44877 14.52384 4.62983C13.90205 3.99273 13.03459 3.59566 12.07315 3.59566C11.11171 3.59566 10.24426 3.99273 9.62208 4.62983C9.20452 4.44877 8.74409 4.34697 8.25997 4.34697C6.36862 4.34697 4.83576 5.87813 4.83576 7.76653C4.83576 9.65493 6.36862 11.18611 8.25997 11.18611C9.22144 11.18611 10.08883 10.78906 10.71072 10.1519C11.12861 10.33296 11.58864 10.43482 12.07315 10.43482C12.55766 10.43482 13.0177 10.33296 13.4352 10.1519C14.05738 10.78906 14.92483 11.18611 15.88627 11.18611C17.77728 11.18611 19.3105 9.65493 19.3105 7.76653C19.3105 5.87813 17.77728 4.34697 15.88627 4.34697z" fill="#FF5C7Aff"></path><path d="M13.46515 16.05629C13.46515 16.85155 12.81917 17.49658 12.02285 17.49658C11.22586 17.49658 10.58064 16.85155 10.58064 16.05629C10.58064 15.26102 11.22586 14.616 12.02285 14.616C12.81917 14.616 13.46515 15.26102 13.46515 16.05629z" fill="#FF5C7Aff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">鬼畜</span>',
            tid: 119
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M20.36371 11.11344C20.36371 7.03327 17.00093 3.69495 12.89088 3.69495L11.25552 3.69495C7.1455 3.69495 3.78273 7.03327 3.78273 11.11344L3.78273 17.13898C3.78273 17.88566 4.38811 18.49114 5.1349 18.49114C5.43671 19.51978 5.98057 20.27731 7.11021 20.27731L8.35096 20.27731C8.80764 20.27731 9.17878 19.91088 9.18128 19.45718L9.21324 13.14941C9.21532 12.69274 8.84292 12.32102 8.38293 12.32102L7.11021 12.32102C6.69256 12.32102 6.29858 12.42566 5.95151 12.60826L5.95151 10.98528C5.95151 8.03846 8.38018 5.62746 11.34854 5.62746L12.85142 5.62746C15.81984 5.62746 18.24845 8.03846 18.24845 10.98528L18.24845 12.63706C17.88893 12.4368 17.47546 12.32102 17.03616 12.32102L15.76349 12.32102C15.30346 12.32102 14.93107 12.69274 14.93318 13.14941L14.96515 19.45718C14.96765 19.91088 15.33878 20.27731 15.79546 20.27731L17.03616 20.27731C18.16589 20.27731 18.70973 19.51978 19.01155 18.49114C19.75834 18.49114 20.36371 17.88566 20.36371 17.13898L20.36371 11.11344z" fill="#59E0F9ff"></path><path d="M5.11552 15.22608C5.11552 14.15078 5.11552 13.61309 5.32479 13.2024C5.50887 12.84115 5.8026 12.54739 6.16386 12.36336C6.57458 12.15408 7.11223 12.15408 8.18752 12.15408L8.61742 12.15408C9.15507 12.15408 9.4239 12.15408 9.62928 12.25872C9.80986 12.35078 9.95674 12.49757 10.0488 12.67824C10.15344 12.88358 10.15344 13.15238 10.15344 13.69008L10.15344 18.74131C10.15344 19.27891 10.15344 19.54781 10.0488 19.75315C9.95674 19.93373 9.80986 20.08061 9.62928 20.17267C9.4239 20.27731 9.15507 20.27731 8.61742 20.27731L8.18752 20.27731C7.11223 20.27731 6.57458 20.27731 6.16386 20.06803C5.8026 19.884 5.50887 19.59024 5.32479 19.22899C5.11552 18.81821 5.11552 18.28061 5.11552 17.20531L5.11552 15.22608z" fill="#00B9E7ff"></path><path d="M19.03075 15.22608C19.03075 14.15078 19.03075 13.61309 18.82147 13.2024C18.63734 12.84115 18.34368 12.54739 17.98243 12.36336C17.57165 12.15408 17.03405 12.15408 15.95875 12.15408L15.52675 12.15408C14.98906 12.15408 14.72026 12.15408 14.51491 12.25872C14.33424 12.35078 14.18736 12.49757 14.09539 12.67824C13.99075 12.88358 13.99075 13.15238 13.99075 13.69008L13.99075 18.74131C13.99075 19.27891 13.99075 19.54781 14.09539 19.75315C14.18736 19.93373 14.33424 20.08061 14.51491 20.17267C14.72026 20.27731 14.98906 20.27731 15.52675 20.27731L15.95875 20.27731C17.03405 20.27731 17.57165 20.27731 17.98243 20.06803C18.34368 19.884 18.63734 19.59024 18.82147 19.22899C19.03075 18.81821 19.03075 18.28061 19.03075 17.20531L19.03075 15.22608z" fill="#00B9E7ff"></path><path d="M13.9992 12.87389C13.9992 12.34349 14.42928 11.91341 14.95968 11.91341L14.95968 11.91341C15.49018 11.91341 15.92026 12.34349 15.92026 12.87389L15.92026 19.55741C15.92026 20.0879 15.49018 20.51798 14.95968 20.51798L14.95968 20.51798C14.42928 20.51798 13.9992 20.0879 13.9992 19.55741L13.9992 12.87389z" fill="#FDDE80ff"></path><path d="M8.24077 12.87389C8.24077 12.34349 8.67081 11.91341 9.20127 11.91341L9.20127 11.91341C9.73171 11.91341 10.16179 12.34349 10.16179 12.87389L10.16179 19.55741C10.16179 20.0879 9.73171 20.51798 9.20127 20.51798L9.20127 20.51798C8.67081 20.51798 8.24077 20.0879 8.24077 19.55741L8.24077 12.87389z" fill="#FDDE80ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">音乐</span>',
            tid: 3
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M22.45853 11.58826C22.62758 11.94816 22.47293 12.37699 22.11302 12.54614L11.7097 17.43446C11.34979 17.60362 10.92096 17.44896 10.7519 17.08906C10.58275 16.72915 10.73741 16.30032 11.09731 16.13117L21.50064 11.24285C21.86054 11.0737 22.28938 11.22845 22.45853 11.58826z" fill="#FFCFE6ff"></path><path d="M17.59709 7.57625C17.94307 7.77225 18.06461 8.21161 17.86867 8.55759L12.62534 17.81386C12.42941 18.15984 11.99002 18.28138 11.64403 18.08544C11.29805 17.88941 11.17642 17.45002 11.37245 17.10403L16.61568 7.84786C16.81171 7.50186 17.2511 7.38026 17.59709 7.57625z" fill="#FFCFE6ff"></path><path d="M12.16022 6.47833C12.55786 6.47833 12.88022 6.80069 12.88022 7.19833L12.88022 17.40806C12.88022 17.8057 12.55786 18.12806 12.16022 18.12806C11.76259 18.12806 11.44022 17.8057 11.44022 17.40806L11.44022 7.19833C11.44022 6.80069 11.76259 6.47833 12.16022 6.47833z" fill="#FFCFE6ff"></path><path d="M6.70345 8.53544C7.03465 8.31539 7.48154 8.40548 7.7016 8.73668L13.0248 16.74845C13.24493 17.07965 13.15478 17.52653 12.82358 17.74656C12.49238 17.96669 12.0455 17.87654 11.82547 17.54534L6.5022 9.53359C6.28214 9.20239 6.37225 8.7555 6.70345 8.53544z" fill="#FFCFE6ff"></path><path d="M9.66182 17.5007C9.57036 17.28797 9.68467 17.0519 9.89453 16.95398L12.09898 15.92611L14.30141 16.95312C14.51126 17.05094 14.6256 17.28691 14.5343 17.49955C14.1288 18.44381 13.1905 19.10515 12.09782 19.10515C11.00554 19.10515 10.06752 18.44429 9.66182 17.5007z" fill="#FFCFE6ff"></path><path d="M7.16267 14.97974C7.7695 12.8303 9.75514 11.23526 12.09878 11.23526C14.44253 11.23526 16.4183 12.81062 17.02512 14.96026L22.13731 12.53549C22.50115 12.36288 22.67424 11.93654 22.5119 11.568C22.49309 11.52528 22.47504 11.48554 22.45862 11.45078C20.62118 7.57511 16.67299 4.89487 12.09878 4.89487C7.45255 4.89487 3.4522 7.66017 1.65375 11.63472L1.65375 11.63472C1.49874 11.97734 1.64364 12.38957 1.98407 12.54922C3.48774 13.25472 7.16267 14.97974 7.16267 14.97974z" fill="#FF5C7Aff"></path><path d="M1.65842 11.60611C1.82741 11.24611 2.2562 11.09126 2.61615 11.26032L12.85507 16.06723C13.21507 16.23619 13.36982 16.66502 13.20086 17.02493C13.0319 17.38493 12.60307 17.53968 12.24317 17.37072L2.00419 12.56381C1.64424 12.39485 1.48943 11.96602 1.65842 11.60611z" fill="#FFCFE6ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">舞蹈</span>',
            tid: 129
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M5.16093 18.89558L18.83645 18.89558C19.63171 18.89558 20.27645 18.25085 20.27645 17.45558L20.27645 6.34031C20.27645 5.54503 19.63171 4.90031 18.83645 4.90031L5.16094 4.90031C4.36565 4.90031 3.72094 5.54503 3.72094 6.34031L3.72094 17.45558C3.72094 18.25085 4.36565 18.89558 5.16093 18.89558z" fill="#9796EDff"></path><path d="M5.49187 7.15125C5.49187 7.54889 5.81423 7.87125 6.21187 7.87125L7.53881 7.87125C7.93645 7.87125 8.25881 7.54889 8.25881 7.15125C8.25881 6.75361 7.93645 6.43125 7.53881 6.43125L6.21187 6.43125C5.81423 6.43125 5.49187 6.75361 5.49187 7.15125z" fill="#6D69E4ff"></path><path d="M10.6897 7.15125C10.6897 7.54889 11.01206 7.87125 11.4097 7.87125L12.73661 7.87125C13.13424 7.87125 13.45661 7.54889 13.45661 7.15125C13.45661 6.75361 13.13424 6.43125 12.73661 6.43125L11.4097 6.43125C11.01206 6.43125 10.6897 6.75361 10.6897 7.15125z" fill="#6D69E4ff"></path><path d="M15.88733 7.15125C15.88733 7.54889 16.2097 7.87125 16.60733 7.87125L17.93424 7.87125C18.33187 7.87125 18.65424 7.54889 18.65424 7.15125C18.65424 6.75361 18.33187 6.43125 17.93424 6.43125L16.60733 6.43125C16.2097 6.43125 15.88733 6.75361 15.88733 7.15125z" fill="#6D69E4ff"></path><path d="M5.49187 17.14742C5.49187 17.54515 5.81423 17.86742 6.21187 17.86742L7.53881 17.86742C7.93645 17.86742 8.25881 17.54515 8.25881 17.14742C8.25881 16.74979 7.93645 16.42742 7.53881 16.42742L6.21187 16.42742C5.81423 16.42742 5.49187 16.74979 5.49187 17.14742z" fill="#6D69E4ff"></path><path d="M10.6897 17.14742C10.6897 17.54515 11.01206 17.86742 11.4097 17.86742L12.73661 17.86742C13.13424 17.86742 13.45661 17.54515 13.45661 17.14742C13.45661 16.74979 13.13424 16.42742 12.73661 16.42742L11.4097 16.42742C11.01206 16.42742 10.6897 16.74979 10.6897 17.14742z" fill="#6D69E4ff"></path><path d="M15.88733 17.14742C15.88733 17.54515 16.2097 17.86742 16.60733 17.86742L17.93424 17.86742C18.33187 17.86742 18.65424 17.54515 18.65424 17.14742C18.65424 16.74979 18.33187 16.42742 17.93424 16.42742L16.60733 16.42742C16.2097 16.42742 15.88733 16.74979 15.88733 17.14742z" fill="#6D69E4ff"></path><path d="M3.72094 14.9591L20.27645 14.9591L20.27645 8.83594L3.72094 8.83594L3.72094 14.9591z" fill="#6D69E4ff"></path><path d="M9.8783 12.948C9.91536 12.84787 9.93389 12.79776 9.95213 12.77434C10.02883 12.67565 10.17802 12.67565 10.25482 12.77434C10.27296 12.79776 10.29149 12.84787 10.32854 12.948C10.53485 13.50557 10.97443 13.94515 11.532 14.15146C11.63222 14.18851 11.68224 14.20704 11.70566 14.22528C11.80435 14.30198 11.80435 14.45117 11.70566 14.52787C11.68224 14.54611 11.63222 14.56464 11.532 14.6017C10.97443 14.808 10.53485 15.24758 10.32854 15.80515C10.29149 15.90528 10.27296 15.95539 10.25482 15.97882C10.17802 16.0775 10.02883 16.0775 9.95213 15.97882C9.93389 15.95539 9.91536 15.90528 9.8783 15.80515C9.672 15.24758 9.23242 14.808 8.67487 14.6017C8.5747 14.56464 8.52462 14.54611 8.50123 14.52787C8.40254 14.45117 8.40254 14.30198 8.50123 14.22528C8.52462 14.20704 8.5747 14.18851 8.67487 14.15146C9.23242 13.94515 9.672 13.50557 9.8783 12.948z" fill="#FDDE80ff"></path><path d="M13.42128 6.99748C13.50605 6.76846 13.54838 6.65394 13.58995 6.60048C13.76544 6.37484 14.10653 6.37484 14.28202 6.60048C14.32358 6.65394 14.36592 6.76846 14.45069 6.99748C14.92234 8.27225 15.92746 9.27733 17.20224 9.74909C17.4313 9.83376 17.54573 9.87619 17.5992 9.91776C17.8249 10.09325 17.8249 10.43424 17.5992 10.60973C17.54573 10.6513 17.4313 10.69373 17.20224 10.7785C15.92746 11.25014 14.92234 12.25526 14.45069 13.53005C14.36592 13.75901 14.32358 13.87354 14.28202 13.92701C14.10653 14.1527 13.76544 14.1527 13.58995 13.92701C13.54838 13.87354 13.50605 13.75901 13.42128 13.53005C12.94954 12.25526 11.94451 11.25014 10.66973 10.7785C10.44067 10.69373 10.32614 10.6513 10.27267 10.60973C10.04707 10.43424 10.04707 10.09325 10.27267 9.91776C10.32614 9.87619 10.44067 9.83376 10.66973 9.74909C11.94451 9.27733 12.94954 8.27225 13.42128 6.99748z" fill="#FDDE80ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">影视</span>',
            tid: 181
          }
        ],
        [
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M4.07763 7.63768C4.05931 6.56311 5.5539 6.83651 6.30349 7.10752C7.97693 7.98802 10.8193 9.80818 8.8013 10.0448C6.27878 10.3405 4.10053 8.98089 4.07763 7.63768z" fill="#FB813Aff"></path><path d="M4.55611 14.4882C4.84141 11.4532 7.31628 10.1389 8.31998 9.82821C8.48729 9.82821 9.61772 10.5076 13.464 11.2928C16.0255 11.8156 17.6628 11.0097 18.4364 9.93394C18.805 9.42136 19.3229 9.07939 19.7434 9.55032C20.3467 10.226 21.0067 11.5269 21.0067 13.5405C21.0067 17.3561 18.0324 20.9886 12.5657 20.9886C7.48437 20.9886 4.24105 17.8397 4.55611 14.4882z" fill="#FDDE80ff"></path><path d="M14.8068 7.41519C14.8068 9.84733 12.8352 11.819 10.4031 11.819C7.97092 11.819 5.99929 9.84733 5.99929 7.41519C5.99929 4.98305 7.97092 3.01141 10.4031 3.01141C12.8352 3.01141 14.8068 4.98305 14.8068 7.41519z" fill="#FDDE80ff"></path><path d="M10.0014 7.74284C10.0014 8.297 9.5522 8.74623 8.99804 8.74623C8.44388 8.74623 7.99465 8.297 7.99465 7.74284C7.99465 7.18868 8.44388 6.73944 8.99804 6.73944C9.5522 6.73944 10.0014 7.18868 10.0014 7.74284z" fill="#FB813Aff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">生活</span>',
            tid: 160
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M5.92972 20.481C5.34469 21.0726 4.39035 21.075 3.80205 20.4867L3.42324 20.1078C2.83711 19.5217 2.83752 18.5713 3.42416 17.9856L12.0134 9.41117C12.372 9.05293 12.9589 9.05293 13.3175 9.41117L14.4768 10.5692C14.8355 10.9275 14.8355 11.5132 14.4768 11.8714C12.0808 14.2648 7.88596 18.5029 5.92972 20.481z" fill="#FF5C7Aff"></path><path d="M8.72852 12.693L12.0139 9.41126C12.3725 9.05302 12.9593 9.05302 13.318 9.41126L14.4773 10.5693C14.836 10.9276 14.836 11.5137 14.4773 11.872L11.1758 15.1698L8.72852 12.693z" fill="#FC6376ff"></path><path d="M16.2118 14.531C16.5704 14.8893 16.971 14.782 17.1024 14.2925L19.5843 5.04082C19.7152 4.55181 19.422 4.25849 18.932 4.38973L9.67009 6.86887C9.18053 6.99964 9.07312 7.40025 9.43176 7.75849L16.2118 14.531z" fill="#FDDE80ff"></path><path d="M20.7561 9.99241C21.1147 10.3507 21.0073 10.7508 20.5173 10.882L11.2554 13.3612C10.7658 13.4919 10.4722 13.1991 10.6036 12.7096L13.0855 3.45795C13.2164 2.96893 13.6174 2.86165 13.9761 3.21989L20.7561 9.99241z" fill="#FDDE80ff"></path><path d="M6.6992 14.7177L9.17585 17.167L8.47269 17.878L5.99603 15.4287L6.6992 14.7177z" fill="#FFCFE6ff"></path><path d="M8.67909 12.7448L11.1456 15.2003L10.44 15.909L7.97356 13.4535L8.67909 12.7448z" fill="#FFCFE6ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">娱乐</span>',
            tid: 5
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M11.314 2.23489C12.9446 2.23067 14.532 2.75886 15.8349 3.73921C17.1379 4.71955 18.0852 6.09845 18.5329 7.66636C18.9806 9.23427 18.9042 10.9055 18.3154 12.426C17.8016 13.7526 16.9223 14.9013 15.7852 15.7421C15.4744 15.972 15.2705 16.326 15.2705 16.7125L15.2705 17.592C15.2617 17.8153 15.2705 18.4288 15.2705 18.4288C15.2705 18.4288 14.2951 18.5929 13.8545 18.5929C13.4139 18.5929 8.6663 18.5929 8.6663 18.5929C8.23657 18.5929 7.26348 18.3716 7.26348 18.3716C7.26348 18.3716 7.26348 17.3741 7.26348 16.9398L7.26348 16.6997C7.26348 16.3201 7.06671 15.9714 6.76507 15.741C5.64258 14.8837 4.78051 13.7248 4.28335 12.394C3.71494 10.8724 3.65406 9.20783 4.10982 7.64882C4.56557 6.08982 5.51348 4.7201 6.81195 3.7443C8.11043 2.7685 9.68976 2.239 11.314 2.23489z" fill="#FF8834ff"></path><path d="M12.1195 12.5257C12.3663 12.5257 12.5664 12.3256 12.5664 12.0788L12.5664 11.3639C12.5664 11.1171 12.7665 10.917 13.0133 10.917L13.6389 10.917C14.6152 10.917 14.7114 10.3559 14.7114 10.0232L14.7114 6.7135C14.7114 6.22927 14.351 5.81976 13.6389 5.81976L9.17018 5.81976C8.28824 5.81976 7.91895 6.26199 7.91895 6.7135L7.91895 8.50456C7.91895 8.75099 8.11871 8.95076 8.36514 8.95076L9.61773 8.95076C9.86415 8.95076 10.0639 8.75099 10.0639 8.50456L10.0639 7.96765C10.0639 7.72085 10.264 7.52078 10.5108 7.52078L12.1195 7.52078C12.3663 7.52078 12.5664 7.72085 12.5664 7.96765L12.5664 9.57638C12.5664 9.82318 12.3663 10.0232 12.1195 10.0232L11.4939 10.0232C10.2266 10.0114 9.88517 10.5345 9.88517 10.917L9.88517 12.0788C9.88517 12.3256 10.0852 12.5257 10.332 12.5257L12.1195 12.5257zM11.2537 13.0396C11.5011 13.0396 11.7431 13.113 11.9488 13.2505C12.1546 13.388 12.315 13.5834 12.4097 13.812C12.5044 14.0407 12.5291 14.2922 12.4809 14.535C12.4326 14.7777 12.3134 15.0006 12.1384 15.1756C11.9634 15.3506 11.7405 15.4698 11.4978 15.518C11.2551 15.5663 11.0035 15.5415 10.7748 15.4468C10.5462 15.3521 10.3508 15.1918 10.2133 14.986C10.0758 14.7802 10.0024 14.5383 10.0024 14.2909C10.0024 13.959 10.1343 13.6407 10.3689 13.4061C10.6036 13.1714 10.9218 13.0396 11.2537 13.0396z" fill="#FFE8AFff"></path><path d="M7.61193 19.1082C7.56041 18.8267 7.79538 18.593 8.0816 18.593L14.5507 18.593C14.8369 18.593 15.0719 18.8267 15.0204 19.1082C14.9 19.7663 14.5593 20.4539 14.0385 20.8941C13.3787 21.4518 12.4838 21.7652 11.5507 21.7652L11.0816 21.7652C10.1485 21.7652 9.25362 21.4518 8.59382 20.8941C8.073 20.4539 7.73233 19.7663 7.61193 19.1082z" fill="#00B9E7ff"></path><path d="M6.53796 17.9091C6.53796 17.4028 6.94835 16.9924 7.45459 16.9924L14.9778 16.9924C15.484 16.9924 15.8944 17.4028 15.8944 17.9091L15.8944 18.0758C15.8944 18.582 15.484 18.9924 14.9778 18.9924L7.45459 18.9924C6.94835 18.9924 6.53796 18.582 6.53796 18.0758L6.53796 17.9091z" fill="#FFD671ff"></path><path d="M20.289 3.28204C20.345 3.15749 20.5218 3.15749 20.5779 3.28204L20.8592 3.90715C21.1186 4.4836 21.5405 4.97188 22.0732 5.31218L22.267 5.43598C22.3971 5.51903 22.3971 5.70894 22.267 5.79199L22.0821 5.91013C21.5438 6.25396 21.1188 6.74879 20.8602 7.33278L20.5783 7.96932C20.5226 8.09501 20.3442 8.09501 20.2886 7.96932L20.0206 7.36425C19.7533 6.76065 19.3084 6.25278 18.7453 5.90825L18.5589 5.79416C18.4242 5.71178 18.4242 5.51619 18.5589 5.43381L18.7543 5.3142C19.3118 4.9731 19.7535 4.47182 20.0217 3.87581L20.289 3.28204z" fill="#FFD671ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">知识</span>',
            tid: 36
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M12.02688 16.19126L9.47718 16.19126L8.48827 20.24736C8.41458 20.54966 8.64349 20.84102 8.95461 20.84102L12.02688 20.84102L15.09946 20.84102C15.41059 20.84102 15.63955 20.54966 15.56582 20.24736L14.57693 16.19126L12.02688 16.19126z" fill="#FDDE80ff"></path><path d="M12.0265 5.11161C11.68627 5.11161 11.40749 4.83518 11.40749 4.49694L11.40749 2.92935C11.40749 2.59111 11.68627 2.31468 12.0265 2.31468C12.36662 2.31468 12.6455 2.59111 12.6455 2.92935L12.6455 4.49694C12.6455 4.83518 12.36662 5.11161 12.0265 5.11161z" fill="#00B9E7ff"></path><path d="M5.44948 12.45869L5.44948 10.1089C5.44948 6.51677 8.40948 3.57738 12.02678 3.57738C15.64464 3.57738 18.60461 6.51677 18.60461 10.1089L18.60461 12.45869C18.60461 12.81619 18.31267 13.10611 17.95267 13.10611L6.1014 13.10611C5.74138 13.10611 5.44948 12.81619 5.44948 12.45869z" fill="#00B9E7ff"></path><path d="M18.30816 16.26451L5.74677 16.26451C4.34618 16.26451 3.20062 15.15648 3.20062 13.80269C3.20062 12.44851 4.34618 11.34048 5.74677 11.34048L18.30816 11.34048C19.7088 11.34048 20.85427 12.44851 20.85427 13.80269C20.85427 15.15648 19.7088 16.26451 18.30816 16.26451z" fill="#59E1F9ff"></path><path d="M18.0864 13.80269C18.0864 14.2633 17.71018 14.63683 17.2463 14.63683C16.78205 14.63683 16.40621 14.2633 16.40621 13.80269C16.40621 13.34208 16.78205 12.96845 17.2463 12.96845C17.71018 12.96845 18.0864 13.34208 18.0864 13.80269z" fill="#00B9E7ff"></path><path d="M7.64822 13.80259C7.64822 14.2632 7.272 14.63683 6.80816 14.63683C6.3439 14.63683 5.9681 14.2632 5.9681 13.80259C5.9681 13.34198 6.3439 12.96835 6.80816 12.96835C7.272 12.96835 7.64822 13.34198 7.64822 13.80259z" fill="#00B9E7ff"></path><path d="M12.91315 13.8025C12.91315 14.2631 12.53693 14.63674 12.07315 14.63674C11.6089 14.63674 11.23306 14.2631 11.23306 13.8025C11.23306 13.34189 11.6089 12.96826 12.07315 12.96826C12.53693 12.96826 12.91315 13.34189 12.91315 13.8025z" fill="#00B9E7ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">科技数码</span>',
            tid: 188
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M20.7696 9.43989C20.7696 8.64461 20.12486 7.99991 19.3296 7.99988C16.87613 7.9998 14.42275 7.99956 11.96928 7.99979C11.17411 7.99986 10.52957 8.64452 10.52957 9.4397L10.52957 18.96499C10.52957 19.76026 11.17421 20.40499 11.96957 20.40499C14.42285 20.40499 16.87622 20.40499 19.3296 20.40499C20.12486 20.40499 20.7696 19.76026 20.7696 18.96499C20.7696 15.78998 20.7696 12.61498 20.7696 9.43989z" fill="#00B9E7ff"></path><path d="M17.56512 4.12356L5.86988 4.12356C5.16028 4.12356 4.58508 4.65644 4.58508 5.3136L4.58508 19.21469C4.58508 19.8719 5.16028 20.4047 5.86988 20.4047L17.56512 20.4047C18.27427 20.4047 18.8495 19.8719 18.8495 19.21469L18.8495 5.3136C18.8495 4.65644 18.27427 4.12356 17.56512 4.12356z" fill="#59E1F9ff"></path><path d="M6.55239 15.36586C6.55239 14.96861 6.87441 14.64662 7.27164 14.64662L16.14778 14.64662C16.54493 14.64662 16.86701 14.96861 16.86701 15.36586C16.86701 15.7631 16.54493 16.08509 16.14778 16.08509L7.27164 16.08509C6.87441 16.08509 6.55239 15.7631 6.55239 15.36586z" fill="#00B9E7ff"></path><path d="M6.55239 17.90045C6.55239 17.5032 6.87441 17.18122 7.27164 17.18122L16.14778 17.18122C16.54493 17.18122 16.86701 17.5032 16.86701 17.90045C16.86701 18.2977 16.54493 18.61968 16.14778 18.61968L7.27164 18.61968C6.87441 18.61968 6.55239 18.2977 6.55239 17.90045z" fill="#00B9E7ff"></path><path d="M15.61574 13.17888L7.81898 13.17888C7.13058 13.17888 6.56738 12.61891 6.56738 11.93443L6.56738 7.62798C6.56738 6.94351 7.13058 6.38353 7.81898 6.38353L15.61574 6.38353C16.30416 6.38353 16.86701 6.94351 16.86701 7.62798L16.86701 11.93443C16.86701 12.61891 16.30416 13.17888 15.61574 13.17888z" fill="#00B9E7ff"></path><path d="M10.3943 8.60394C10.3943 8.06573 10.77312 7.84541 11.23603 8.11452L13.40477 9.37584C13.86768 9.64495 13.86768 10.08557 13.40477 10.35466L11.23603 11.616C10.77312 11.88566 10.3943 11.66534 10.3943 11.12659L10.3943 8.60394z" fill="#FDDE80ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">资讯</span>',
            tid: 202
          }
        ],
        [
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M3.18094 10.5647C3.18094 11.01408 3.35942 11.44493 3.67714 11.76269C3.99484 12.08035 4.42574 12.25882 4.87505 12.25882C5.32436 12.25882 5.75527 12.08035 6.07298 11.76269C6.39068 11.44493 6.56917 11.01408 6.56917 10.5647C6.56917 10.11542 6.39068 9.68453 6.07298 9.36682C5.75527 9.04911 5.32436 8.87062 4.87505 8.87062C4.42574 8.87062 3.99484 9.04911 3.67714 9.36682C3.35942 9.68453 3.18094 10.11542 3.18094 10.5647z" fill="#FB813Aff"></path><path d="M5.69523 9.30581C5.69518 9.60927 5.76987 9.90977 5.91502 10.19011C6.06016 10.47053 6.27294 10.72531 6.54118 10.93987C6.80942 11.15443 7.12788 11.32474 7.47837 11.4408C7.82887 11.55696 8.20452 11.61677 8.5839 11.61677C8.96327 11.61677 9.33893 11.55696 9.68938 11.4408C10.03987 11.32474 10.3584 11.15443 10.62662 10.93987C10.89485 10.72531 11.10758 10.47053 11.25274 10.19011C11.39789 9.90977 11.47258 9.60927 11.47258 9.30581C11.47258 9.00234 11.39789 8.70184 11.25274 8.42147C11.10758 8.1411 10.89485 7.88634 10.62662 7.67174C10.3584 7.45715 10.03987 7.28693 9.68938 7.17079C9.33893 7.05465 8.96327 6.99487 8.5839 6.99487C8.20452 6.99487 7.82887 7.05465 7.47837 7.17079C7.12788 7.28693 6.80942 7.45715 6.54118 7.67174C6.27294 7.88634 6.06016 8.1411 5.91502 8.42147C5.76987 8.70184 5.69518 9.00234 5.69523 9.30581z" fill="#FB813Aff"></path><path d="M14.90909 11.21645C14.90899 11.59296 14.9832 11.96582 15.1272 12.31373C15.2713 12.66163 15.4825 12.97766 15.7487 13.24397C16.01501 13.51018 16.33104 13.72147 16.67894 13.86557C17.02675 14.00966 17.39962 14.08378 17.77622 14.08378C18.15274 14.08378 18.5256 14.00966 18.87341 13.86557C19.22131 13.72147 19.53744 13.51018 19.80365 13.24397C20.06986 12.97766 20.28106 12.66163 20.42515 12.31373C20.56925 11.96582 20.64336 11.59296 20.64326 11.21645C20.64336 10.83994 20.56925 10.46707 20.42515 10.11917C20.28106 9.77126 20.06986 9.45516 19.80365 9.1889C19.53744 8.92264 19.22131 8.71142 18.87341 8.56733C18.5256 8.42322 18.15274 8.34905 17.77622 8.34905C17.39962 8.34905 17.02675 8.42322 16.67894 8.56733C16.33104 8.71142 16.01501 8.92264 15.7487 9.1889C15.4825 9.45516 15.2713 9.77126 15.1272 10.11917C14.9832 10.46707 14.90899 10.83994 14.90909 11.21645z" fill="#FB813Aff"></path><path d="M11.7816 9.52223C11.7816 9.91584 11.85907 10.3056 12.0097 10.66925C12.16032 11.0329 12.38112 11.36323 12.65942 11.64163C12.93773 11.91994 13.26816 12.14074 13.63181 12.29136C13.99546 12.44198 14.38522 12.51946 14.77882 12.51946C15.17242 12.51946 15.56218 12.44198 15.92582 12.29136C16.28947 12.14074 16.61981 11.91994 16.89821 11.64163C17.17651 11.36323 17.39722 11.0329 17.54784 10.66925C17.69846 10.3056 17.77603 9.91584 17.77603 9.52223C17.77603 8.72732 17.46029 7.96496 16.89821 7.40287C16.33603 6.84078 15.5737 6.525 14.77882 6.525C13.98384 6.525 13.2215 6.84078 12.65942 7.40287C12.09734 7.96496 11.7816 8.72732 11.7816 9.52223z" fill="#FB813Aff"></path><path d="M21.52992 9.91312C21.70147 9.91322 21.86602 9.98144 21.98736 10.10275C22.10861 10.22419 22.17677 10.38874 22.17677 10.56029L22.17571 10.59082L22.1737 10.62125C21.85181 14.01696 19.23504 16.76074 15.85699 17.35306L16.31107 19.16976C16.33027 19.24666 16.33171 19.32682 16.3153 19.40429C16.29878 19.48176 16.26499 19.55443 16.21622 19.61683C16.16746 19.67923 16.10515 19.72973 16.03402 19.76448C15.96288 19.79923 15.88474 19.81728 15.80554 19.81728L8.27921 19.81728C8.20003 19.81728 8.12188 19.79923 8.05071 19.76448C7.97955 19.72973 7.91723 19.67923 7.8685 19.61683C7.81977 19.55443 7.7859 19.48176 7.76947 19.40429C7.75305 19.32682 7.75449 19.24666 7.7737 19.16976L8.22772 17.35306C4.89166 16.76822 2.29831 14.08474 1.92424 10.74768L1.91171 10.62672C1.90307 10.53629 1.9134 10.44509 1.94207 10.35898C1.97073 10.27286 2.01708 10.19366 2.07813 10.12646C2.13919 10.05928 2.21362 10.0056 2.29664 9.96886C2.37965 9.93212 2.46943 9.91314 2.56021 9.91312L21.52992 9.91312z" fill="#FDDE80ff"></path><path d="M10.51066 3.65813L13.57402 3.65813C14.05238 3.65813 14.4695 3.9834 14.58538 4.44758L15.95184 9.91314L8.13281 9.91314L9.49929 4.44792C9.55566 4.22235 9.68582 4.02209 9.86909 3.87899C10.05235 3.73588 10.27814 3.65814 10.51066 3.65813z" fill="#FDDE80ff"></path><path d="M12.04234 15.12614C12.5953 15.12614 13.1257 15.34579 13.5167 15.7368C13.90771 16.1279 14.12746 16.65821 14.12746 17.21126L14.12746 19.81747L9.95722 19.81747L9.95722 17.21126C9.95722 16.65821 10.17686 16.1279 10.56787 15.7368C10.95898 15.34579 11.48928 15.12614 12.04234 15.12614z" fill="#FB813Aff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">美食</span>',
            tid: 211
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M21.24202 9.24032C21.31075 9.46754 21.28675 9.71272 21.1753 9.92231C21.06374 10.13194 20.87386 10.2888 20.64701 10.35888L20.0521 10.53139C19.93997 10.56576 19.82218 10.57776 19.70544 10.56653C19.5887 10.55539 19.47533 10.52141 19.37174 10.4664C19.26816 10.41149 19.17638 10.33661 19.1017 10.24618C19.02701 10.15574 18.97094 10.05152 18.93658 9.9394C18.90221 9.82728 18.89021 9.70949 18.90134 9.59275C18.91248 9.47601 18.94656 9.36261 19.00147 9.25902C19.05648 9.15543 19.13126 9.06369 19.2217 8.98902C19.31213 8.91435 19.41638 8.85823 19.52851 8.82385L20.12352 8.65131C20.23555 8.61552 20.35363 8.6024 20.47085 8.61272C20.58806 8.62304 20.70211 8.65659 20.80618 8.71141C20.91034 8.76624 21.0025 8.84124 21.07728 8.93204C21.15206 9.02286 21.20813 9.12765 21.24202 9.24032zM5.17807 9.93642C5.10935 10.16285 4.95356 10.35264 4.74493 10.46419C4.53631 10.57574 4.29192 10.59994 4.06548 10.53139L3.47052 10.35888C3.2437 10.2888 3.0538 10.13194 2.94231 9.92231C2.83084 9.71272 2.80684 9.46754 2.87556 9.24032C2.9089 9.12779 2.96424 9.02298 3.03839 8.932C3.11254 8.84102 3.20402 8.76568 3.30752 8.71033C3.41101 8.65499 3.52448 8.62074 3.64131 8.60959C3.75815 8.59843 3.87604 8.6106 3.98814 8.64536L4.5831 8.8179C4.69586 8.85188 4.80079 8.90785 4.89181 8.98257C4.98284 9.05729 5.05818 9.1493 5.11349 9.25328C5.16879 9.35725 5.20298 9.47115 5.21406 9.58839C5.22515 9.70564 5.21291 9.82393 5.17807 9.93642z" fill="#00B9E7ff"></path><path d="M6.97476 4.78406C8.65316 4.44467 10.36118 4.27327 12.07354 4.27239C13.82131 4.27461 15.56477 4.44596 17.27952 4.78406C17.47834 4.82236 17.6641 4.91076 17.81923 5.04089C17.97437 5.17104 18.0937 5.33861 18.16598 5.52776L20.34038 11.24707C20.38176 11.35603 20.40307 11.47171 20.40307 11.58826L20.40307 16.76659C20.40307 16.92442 20.34038 17.07571 20.22874 17.18726C20.11718 17.29882 19.96589 17.3615 19.80806 17.3615L4.33908 17.3615C4.18129 17.3615 4.02996 17.29882 3.91837 17.18726C3.8068 17.07571 3.74412 16.92442 3.74412 16.76659L3.74412 11.59834C3.74412 11.47526 3.76781 11.35325 3.8139 11.23901L6.12396 5.51586C6.19464 5.33331 6.30926 5.17102 6.45767 5.04336C6.60609 4.91571 6.7837 4.82665 6.97476 4.78406z" fill="#00B9E7ff"></path><path d="M5.529 12.00691L7.90884 12.00691C8.30549 12.00691 8.5038 12.20515 8.5038 12.60182L8.5038 13.19683C8.5038 13.59341 8.30549 13.79174 7.90884 13.79174L5.529 13.79174C5.13236 13.79174 4.93404 13.59341 4.93404 13.19683L4.93404 12.60182C4.93404 12.20515 5.13236 12.00691 5.529 12.00691z" fill="#FDDE80ff"></path><path d="M16.2383 12.00691L18.61814 12.00691C19.01482 12.00691 19.21315 12.20515 19.21315 12.60182L19.21315 13.19683C19.21315 13.59341 19.01482 13.79174 18.61814 13.79174L16.2383 13.79174C15.84173 13.79174 15.64339 13.59341 15.64339 13.19683L15.64339 12.60182C15.64339 12.20515 15.84173 12.00691 16.2383 12.00691z" fill="#FDDE80ff"></path><path d="M7.79001 6.40233C9.11029 6.17235 10.44797 6.05689 11.78813 6.05724C13.31962 6.07062 14.84832 6.1899 16.36339 6.41422C16.47677 6.43024 16.58304 6.47862 16.66954 6.55355C16.75613 6.62846 16.8192 6.72677 16.85126 6.83665L17.77344 9.96614C17.79533 10.04115 17.80224 10.11974 17.7937 10.19741C17.78525 10.27507 17.76154 10.35034 17.724 10.41878C17.68637 10.48733 17.63568 10.54771 17.57482 10.59667C17.51386 10.64554 17.44387 10.68202 17.3689 10.7039C17.29622 10.7185 17.22144 10.7185 17.14877 10.7039C15.20918 10.51747 13.42426 10.42426 11.79408 10.42426C10.20394 10.4255 8.61508 10.51286 7.0344 10.68605C6.95666 10.6943 6.87804 10.6871 6.80307 10.66502C6.72808 10.64285 6.6582 10.60608 6.59743 10.55693C6.53665 10.50778 6.48615 10.4471 6.44884 10.37837C6.41152 10.30963 6.38811 10.23427 6.37995 10.15651C6.36471 10.07993 6.36471 10.00109 6.37995 9.9245L7.31404 6.81879C7.3462 6.71165 7.40791 6.61574 7.4921 6.54207C7.57629 6.46841 7.67954 6.41997 7.79001 6.40233z" fill="#59E1F9ff"></path><path d="M3.74414 15.65299C3.74414 14.85763 4.38885 14.21299 5.18414 14.21299L5.28938 14.21299C6.08466 14.21299 6.72938 14.85763 6.72938 15.65299L6.72938 17.70653C6.72938 18.50189 6.08466 19.14653 5.28938 19.14653L5.18414 19.14653C4.38885 19.14653 3.74414 18.50189 3.74414 17.70653L3.74414 15.65299z" fill="#00B9E7ff"></path><path d="M17.42822 15.65299C17.42822 14.85763 18.07296 14.21299 18.86822 14.21299L18.97344 14.21299C19.7688 14.21299 20.41344 14.85763 20.41344 15.65299L20.41344 17.70653C20.41344 18.50189 19.7688 19.14653 18.97344 19.14653L18.86822 19.14653C18.07296 19.14653 17.42822 18.50189 17.42822 17.70653L17.42822 15.65299z" fill="#00B9E7ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">汽车</span>',
            tid: 223
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M16.0695 2.7305C12.7258 3.85612 10.9074 4.09695 8.30573 2.7305L12.1298 8.01044L16.0695 2.7305z" fill="#FFCFE6ff"></path><path d="M8.37409 10.243C6.22673 12.7549 5.26956 15.1018 4.17298 18.4108C4.09425 18.6483 4.10943 18.9135 4.27234 19.1035C6.38097 21.5625 16.2982 21.696 19.208 19.118C19.4281 18.923 19.4887 18.6141 19.4071 18.3315C18.4274 14.9392 16.8594 12.462 14.8639 10.243L8.37409 10.243z" fill="#FF5C7Aff"></path><path d="M6.71505 2.5833C7.21559 2.4809 7.56291 2.47743 8.05183 2.52926C8.29103 2.55462 8.50926 2.67534 8.66566 2.85809L11.0339 5.6253C11.3497 5.99425 11.9202 5.99425 12.236 5.6253L14.5849 2.88068C14.7528 2.68446 14.9917 2.56125 15.2493 2.54369C15.689 2.51373 16.0305 2.51088 16.555 2.59268C17.7675 2.77617 18.4473 4.98552 18.4928 6.49521C18.5014 6.77775 18.3517 7.04445 18.089 7.1489C17.3664 7.43628 16.3941 7.44278 15.6755 7.33024L14.8472 10.6895C12.29 11.0952 10.8825 11.103 8.42274 10.6895L7.60432 7.36766C6.85494 7.52539 5.78994 7.47444 5.07016 7.13883C4.84587 7.03425 4.71412 6.80481 4.71142 6.55735C4.69584 5.13103 5.45156 3.01836 6.71505 2.5833z" fill="#FF5C7Aff"></path><path d="M8.19688 9.85347C9.66073 10.5601 13.5345 10.7668 15.1159 9.75003L15.6793 11.2107C12.9174 12.2073 9.85241 12.1155 7.65021 11.2107L8.19688 9.85347z" fill="#FFCFE6ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">时尚美妆</span>',
            tid: 155
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M11.96112 11.90266L12.51312 12.57888C12.73104 12.84586 12.83904 13.18579 12.81494 13.52957C12.79085 13.87334 12.63658 14.19494 12.38362 14.4289L6.04611 20.28893C5.83904 20.48045 5.56644 20.58538 5.2844 20.58211C5.00236 20.57875 4.7323 20.46749 4.52977 20.27117C4.32434 20.07216 4.20036 19.80374 4.18199 19.51834C4.16362 19.23283 4.25216 18.95078 4.43037 18.7271L6.93946 15.57552L9.85382 11.91571C9.97968 11.7576 10.13942 11.62973 10.32115 11.54141C10.50298 11.45309 10.70227 11.40653 10.90435 11.40528C11.10643 11.40403 11.3063 11.4481 11.48918 11.53411C11.67206 11.62022 11.83334 11.74618 11.96112 11.90266z" fill="#1F9F81ff"></path><path d="M16.60733 3.48445C17.30227 3.48483 17.97043 3.75239 18.47347 4.23176C18.97651 4.71111 19.27603 5.36557 19.30992 6.05964C19.34381 6.75371 19.10957 7.43424 18.65558 7.96035C18.2017 8.48647 17.56282 8.81788 16.87123 8.88599L18.26746 9.94675C18.36806 10.02369 18.50237 10.0373 18.61651 9.98345L20.31802 9.18298C20.5559 9.07102 20.82662 9.05058 21.07862 9.12555C21.33053 9.20052 21.54614 9.36564 21.6841 9.58942C21.82022 9.81035 21.86755 10.07472 21.81638 10.32912C21.76522 10.58362 21.61939 10.80912 21.40838 10.96022L18.49757 13.0463C18.27658 13.2047 18.01296 13.29283 17.74118 13.29926C17.46931 13.3057 17.20186 13.23014 16.97357 13.0824L15.44717 12.09437L14.42717 13.19837L16.05888 15.12403C16.09757 15.16934 16.13309 15.21725 16.16544 15.26726L16.21037 15.34358C16.38432 15.6576 16.42637 16.02787 16.3273 16.37299C16.22822 16.71802 15.9961 17.00957 15.68208 17.18352L11.24246 19.64112C10.98701 19.78234 10.6872 19.82035 10.40458 19.7473C10.12205 19.67424 9.87821 19.49568 9.72317 19.24829C9.56556 18.99667 9.50644 18.69571 9.55721 18.4031C9.60797 18.11059 9.76512 17.84707 9.9983 17.66333L12.43757 15.74112L9.98122 14.16269L9.9457 14.13898C9.93869 14.13437 9.93178 14.12966 9.92496 14.12486L9.60547 13.95917C9.44086 13.87421 9.29545 13.75632 9.17823 13.6129C9.06103 13.46938 8.9745 13.30339 8.92404 13.12512C8.87357 12.94694 8.86022 12.76022 8.88483 12.57658C8.90943 12.39293 8.97147 12.21638 9.06708 12.0577L10.72368 9.31018L10.01366 8.9907C9.96048 8.96686 9.90202 8.95716 9.84403 8.96255C9.78595 8.96794 9.73027 8.98823 9.68237 9.02147L7.82232 10.30646C7.60337 10.45786 7.338 10.52707 7.07301 10.50182C6.80803 10.47658 6.56048 10.35859 6.37402 10.16861C6.28791 10.08096 6.22047 9.97679 6.17576 9.86235C6.13105 9.74791 6.10999 9.62558 6.11386 9.50278C6.11773 9.37997 6.14645 9.25923 6.19828 9.14782C6.25011 9.03642 6.32398 8.93669 6.41543 8.85463L9.38007 6.1935C9.55734 6.03445 9.77347 5.925 10.00656 5.87618C10.23965 5.82735 10.48147 5.8409 10.70765 5.91543L14.02493 7.00758C13.89667 6.60188 13.86595 6.17168 13.93507 5.75185C14.00419 5.33202 14.17133 4.93441 14.42285 4.59125C14.67437 4.24808 15.00326 3.96903 15.38275 3.77674C15.76234 3.58444 16.18186 3.4843 16.60733 3.48445L16.60733 3.48445z" fill="#57D587ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">体育运动</span>',
            tid: 234
          },
          {
            icon: '<svg data-v-17815a47="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="navigation-channel-icon"><path d="M14.36582 3.67143C15.80352 3.65373 17.00323 4.92678 17.39434 6.70047C17.46086 7.00223 17.7719 7.19548 18.07651 7.14389C18.6671 7.04388 19.24147 7.11564 19.73645 7.38712C21.21533 8.19796 21.42538 10.48176 20.20589 12.48835C19.88563 13.02058 19.48099 13.49606 19.00848 13.89667C18.84211 14.0377 18.77798 14.26694 18.84067 14.47584C18.95462 14.85523 19.01606 15.25757 19.01606 15.67392L19.01606 16.1641C19.01606 17.26858 18.57734 18.32774 17.79638 19.1087C17.01542 19.88966 15.95626 20.32838 14.85178 20.32838L9.29912 20.32838C8.19468 20.32838 7.1355 19.88966 6.35456 19.1087C5.57361 18.32774 5.13488 17.26858 5.13488 16.1641L5.13488 15.67392C5.13488 15.25699 5.19634 14.85485 5.31033 14.47517C5.37301 14.26637 5.3088 14.03712 5.14245 13.89619C4.66991 13.49578 4.26526 13.02038 3.94509 12.48835C2.72556 10.48176 2.93556 8.19796 4.41446 7.38712C4.90967 7.11554 5.48421 7.04383 6.07527 7.14374C6.37981 7.19522 6.69059 7.0019 6.75702 6.70026C7.14757 4.92688 8.34733 3.65373 9.78518 3.67143C10.47494 3.68023 11.11843 3.98481 11.64941 4.49674C11.88154 4.72055 12.26957 4.72063 12.5017 4.49685C13.03267 3.98511 13.67597 3.68023 14.36582 3.67143z" fill="#FF5C7Aff"></path><path d="M11.7289 7.80475C11.84861 8.98123 11.20435 9.99031 10.28861 10.05924C9.3728 10.12819 8.53423 9.22949 8.41399 8.05301C8.29375 6.87653 8.93848 5.86693 9.85373 5.79852C10.76957 5.72959 11.60861 6.62827 11.7289 7.80475zM15.7225 8.05301C15.60221 9.23001 14.76317 10.12762 13.8479 10.05924C12.93264 9.99083 12.28733 8.98071 12.40762 7.80423C12.52781 6.62775 13.36694 5.72959 14.28269 5.79852C15.19795 5.86693 15.84269 6.87653 15.7225 8.05301zM18.16906 11.42227C17.58182 12.4055 16.52822 12.8807 15.8161 12.48317C15.10349 12.08573 15.0024 10.96675 15.59011 9.98358C16.17734 9.00041 17.23104 8.52516 17.94365 8.92267C18.65578 9.32019 18.75677 10.43914 18.16906 11.42227zM8.55615 9.98358C9.14388 10.96675 9.04281 12.08573 8.33018 12.48317C7.61808 12.8807 6.56443 12.4055 5.97671 11.42227C5.38951 10.43914 5.49057 9.32019 6.20319 8.92267C6.9153 8.52516 7.96895 9.00041 8.55615 9.98358z" fill="#FFCFE6ff"></path><path d="M12.17328 11.43072C12.72787 11.43072 13.26845 11.60534 13.71821 11.92982C13.89734 12.05904 14.06899 12.21734 14.21914 12.39619C14.67053 12.9337 15.25728 13.46515 15.83606 13.8623C16.0105 13.98192 16.16976 14.12496 16.30896 14.28874C16.70842 14.75875 16.91242 15.36394 16.8791 15.97978C16.84579 16.59562 16.57757 17.17526 16.12973 17.5993C15.68189 18.02342 15.08851 18.25968 14.47181 18.25949L9.67882 18.25949C9.06126 18.26083 8.46676 18.02506 8.018 17.60074C7.56923 17.17651 7.30045 16.59619 7.26714 15.97949C7.23383 15.36288 7.43852 14.75693 7.83897 14.28682C7.97802 14.12352 8.137 13.98096 8.31101 13.86173C8.89154 13.46381 9.5054 12.94397 9.94973 12.39821C10.10381 12.20899 10.27306 12.04474 10.43242 11.92982C10.88218 11.60534 11.42275 11.43072 11.97734 11.43072L12.17328 11.43072z" fill="#FFCFE6ff"></path></svg>',
            title: '<span data-v-17815a47="" class="name">动物</span>',
            tid: 217
          }
        ]
      ];
      const emits = __emit;
      const textOfSelected = vue.ref(null);
      const handleShow = (event) => {
        event.stopPropagation();
        let button = null;
        let arrow = null;
        if (event.target.classList.contains("vui_button")) {
          button = event.target;
        } else {
          button = event.target.closest(".vui_button");
        }
        arrow = button.querySelector(".sic-BDC-arrow_expand_line");
        arrow.classList.add("revert");
        popover.open({
          target: button,
          items: channels.map((col) => {
            return col.map((row) => {
              return {
                $html: row.icon + row.title,
                $click: () => {
                  textOfSelected.value = row.icon + row.title;
                  emits("change", row.tid);
                }
              };
            });
          }),
          $cancel: () => {
            arrow.classList.remove("revert");
          }
        });
      };
      const handleDeselect = (event) => {
        event.stopPropagation();
        textOfSelected.value = null;
        emits("change", 0);
      };
      __expose({
        reset: () => {
          textOfSelected.value = null;
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("div", vue.mergeProps({ "data-v-831e1505": "" }, _ctx.$attrs, { class: "menu-popover" }), [
            vue.createElementVNode("button", vue.mergeProps(_ctx.$attrs, {
              class: "vui_button",
              onClick: handleShow
            }), [
              textOfSelected.value === null ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$4, "全部分区")) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                vue.createElementVNode("div", {
                  class: "vui_input-clear",
                  onClick: handleDeselect
                }, _cache[0] || (_cache[0] = [
                  vue.createElementVNode("svg", {
                    class: "vui_icon vui_input-clear-base__icon",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 16 16",
                    width: "16",
                    height: "16",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink"
                  }, [
                    vue.createElementVNode("path", {
                      d: "M8 1.3333333333333333C4.318099999999999 1.3333333333333333 1.3333333333333333 4.318099999999999 1.3333333333333333 8C1.3333333333333333 11.681899999999999 4.318099999999999 14.666666666666666 8 14.666666666666666C11.681899999999999 14.666666666666666 14.666666666666666 11.681899999999999 14.666666666666666 8C14.666666666666666 4.318099999999999 11.681899999999999 1.3333333333333333 8 1.3333333333333333zM5.64258 6.3496C5.4473199999999995 6.1543399999999995 5.4473199999999995 5.837753333333333 5.64258 5.6424933333333325C5.837846666666666 5.447233333333333 6.154426666666667 5.447233333333333 6.349693333333333 5.6424933333333325L8 7.2928L9.650333333333332 5.6424933333333325C9.845566666666667 5.447233333333333 10.162166666666666 5.447233333333333 10.357433333333333 5.6424933333333325C10.552666666666667 5.837753333333333 10.552666666666667 6.1543399999999995 10.357433333333333 6.3496L8.7071 7.9999L10.357433333333333 9.650233333333333C10.552666666666667 9.845466666666667 10.552666666666667 10.162066666666666 10.357433333333333 10.357333333333333C10.162166666666666 10.5526 9.845566666666667 10.5526 9.650333333333332 10.357333333333333L8 8.706999999999999L6.349693333333333 10.357333333333333C6.154426666666667 10.5526 5.837846666666666 10.5526 5.64258 10.357333333333333C5.4473199999999995 10.162066666666666 5.4473199999999995 9.845466666666667 5.64258 9.650233333333333L7.2928999999999995 7.9999L5.64258 6.3496z",
                      fill: "currentColor"
                    })
                  ], -1)
                ])),
                vue.createElementVNode("span", { innerHTML: textOfSelected.value }, null, 8, _hoisted_2$4)
              ], 64)),
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-BDC-arrow_expand_line",
                style: { "font-size": "12px" }
              }), null, 16)
            ], 16)
          ], 16)
        ]);
      };
    }
  };
  const Channel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-c84debb6"]]);
  const _hoisted_1$3 = { class: "vui_input__prepend" };
  const _hoisted_2$3 = { class: "vui_input-wrapper vui_input-wrapper--prepped" };
  const _hoisted_3$2 = { class: "vui_input__suffix" };
  const _sfc_main$6 = {
    __name: "Search",
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const emits = __emit;
      const selected = vue.ref(0);
      const textOfSelected = vue.computed(() => {
        switch (selected.value) {
          case 0:
            return "当前";
          case 1:
            return "全部";
          default:
            return "";
        }
      });
      const keyword = vue.ref("");
      const handleShow = (event) => {
        event.stopPropagation();
        let button = null;
        let arrow = null;
        if (event.target.classList.contains("vui_button")) {
          button = event.target;
        } else {
          button = event.target.closest(".vui_button");
        }
        arrow = button.querySelector(".sic-BDC-arrow_expand_line");
        arrow.classList.add("revert");
        popover.open({
          target: button,
          items: [
            [
              {
                $html: "当前收藏夹",
                $click: () => {
                  selected.value = 0;
                }
              },
              {
                $html: "全部收藏夹",
                $click: () => {
                  selected.value = 1;
                }
              }
            ]
          ],
          $cancel: () => {
            arrow.classList.remove("revert");
          }
        });
      };
      const handleSearch = () => {
        if (!keyword.value) {
          message.info({ text: "请输入关键词" });
          return;
        }
        emits("change", selected.value, keyword.value);
      };
      const handleEnter = () => {
        handleSearch();
      };
      const handleClear = () => {
        keyword.value = "";
      };
      vue.watch(
        () => keyword.value,
        (value, oldValue) => {
          if (!value && oldValue) {
            emits("change", 0, keyword.value);
          }
        }
      );
      __expose({
        reset: () => {
          selected.value = 0;
          keyword.value = "";
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "vui_input fav-list-header-filter__search" }), [
          vue.createElementVNode("div", _hoisted_1$3, [
            vue.createElementVNode("div", vue.mergeProps({ "data-v-831e1505": "" }, _ctx.$attrs, { class: "menu-popover" }), [
              vue.createElementVNode("button", vue.mergeProps(_ctx.$attrs, {
                class: "vui_button",
                onClick: handleShow
              }), [
                vue.createTextVNode(vue.toDisplayString(textOfSelected.value) + " ", 1),
                vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                  class: "vui_icon sic-BDC-arrow_expand_line",
                  style: { "font-size": "12px" }
                }), null, 16)
              ], 16)
            ], 16)
          ]),
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.withDirectives(vue.createElementVNode("input", {
              type: "text",
              class: "vui_input__input vui_input__input-resizable fav-list-header-filter__search",
              placeholder: "请输入关键词",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => keyword.value = $event),
              onKeyup: vue.withKeys(handleEnter, ["enter"])
            }, null, 544), [
              [vue.vModelText, keyword.value]
            ]),
            vue.createElementVNode("div", _hoisted_3$2, [
              keyword.value ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "vui_input-clear",
                onClick: handleClear
              }, _cache[1] || (_cache[1] = [
                vue.createElementVNode("svg", {
                  class: "vui_icon vui_input-clear-base__icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 16 16",
                  width: "16",
                  height: "16",
                  "xmlns:xlink": "http://www.w3.org/1999/xlink"
                }, [
                  vue.createElementVNode("path", {
                    d: "M8 1.3333333333333333C4.318099999999999 1.3333333333333333 1.3333333333333333 4.318099999999999 1.3333333333333333 8C1.3333333333333333 11.681899999999999 4.318099999999999 14.666666666666666 8 14.666666666666666C11.681899999999999 14.666666666666666 14.666666666666666 11.681899999999999 14.666666666666666 8C14.666666666666666 4.318099999999999 11.681899999999999 1.3333333333333333 8 1.3333333333333333zM5.64258 6.3496C5.4473199999999995 6.1543399999999995 5.4473199999999995 5.837753333333333 5.64258 5.6424933333333325C5.837846666666666 5.447233333333333 6.154426666666667 5.447233333333333 6.349693333333333 5.6424933333333325L8 7.2928L9.650333333333332 5.6424933333333325C9.845566666666667 5.447233333333333 10.162166666666666 5.447233333333333 10.357433333333333 5.6424933333333325C10.552666666666667 5.837753333333333 10.552666666666667 6.1543399999999995 10.357433333333333 6.3496L8.7071 7.9999L10.357433333333333 9.650233333333333C10.552666666666667 9.845466666666667 10.552666666666667 10.162066666666666 10.357433333333333 10.357333333333333C10.162166666666666 10.5526 9.845566666666667 10.5526 9.650333333333332 10.357333333333333L8 8.706999999999999L6.349693333333333 10.357333333333333C6.154426666666667 10.5526 5.837846666666666 10.5526 5.64258 10.357333333333333C5.4473199999999995 10.162066666666666 5.4473199999999995 9.845466666666667 5.64258 9.650233333333333L7.2928999999999995 7.9999L5.64258 6.3496z",
                    fill: "currentColor"
                  })
                ], -1)
              ]))) : vue.createCommentVNode("", true),
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-BDC-magnifier_search_line",
                style: { "font-size": "20px" },
                onClick: handleSearch
              }), null, 16)
            ])
          ])
        ], 16);
      };
    }
  };
  const _sfc_main$5 = {
    __name: "Filter",
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const emits = __emit;
      const orderRef = vue.ref(null);
      const channelRef = vue.ref(null);
      const searchRef = vue.ref(null);
      const handleChangeOrder = (order) => {
        emits("change", [{ key: "order", value: order }]);
      };
      const handleChangeChannel = (tid) => {
        emits("change", [{ key: "tid", value: tid }]);
      };
      const handleChangeSearch = (type, keyword) => {
        emits("change", [
          { key: "type", value: type },
          { key: "keyword", value: keyword }
        ]);
      };
      __expose({
        reset: () => {
          var _a, _b, _c, _d, _e, _f;
          ((_a = orderRef.value) == null ? void 0 : _a.reset) && ((_b = orderRef.value) == null ? void 0 : _b.reset());
          ((_c = channelRef.value) == null ? void 0 : _c.reset) && ((_d = channelRef.value) == null ? void 0 : _d.reset());
          ((_e = searchRef.value) == null ? void 0 : _e.reset) && ((_f = searchRef.value) == null ? void 0 : _f.reset());
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter__left" }), [
            vue.createVNode(_sfc_main$9, vue.mergeProps(_ctx.$attrs, {
              ref_key: "orderRef",
              ref: orderRef,
              onChange: handleChangeOrder
            }), null, 16)
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter__center" }), [
            vue.createVNode(Channel, vue.mergeProps(_ctx.$attrs, {
              ref_key: "channelRef",
              ref: channelRef,
              onChange: handleChangeChannel
            }), null, 16)
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter__right" }), [
            vue.createVNode(_sfc_main$6, vue.mergeProps(_ctx.$attrs, {
              ref_key: "searchRef",
              ref: searchRef,
              onChange: handleChangeSearch
            }), null, 16)
          ], 16)
        ], 16);
      };
    }
  };
  const _hoisted_1$2 = { class: "vui_checkbox--input" };
  const _hoisted_2$2 = ["value"];
  const _sfc_main$4 = {
    __name: "Batch",
    props: /* @__PURE__ */ vue.mergeModels({
      list: {
        type: Array,
        required: true,
        default: []
      },
      isSelf: {
        type: Boolean,
        required: true,
        default: false
      }
    }, {
      "selected": {},
      "selectedModifiers": {}
    }),
    emits: /* @__PURE__ */ vue.mergeModels(["batchAction"], ["update:selected"]),
    setup(__props, { emit: __emit }) {
      const selected = vue.useModel(__props, "selected");
      const props = __props;
      const emits = __emit;
      const isClickSelectAllBtn = vue.ref(false);
      const checked = vue.computed(() => {
        if (props.list.length > 0) {
          return selected.value.length === props.list.length;
        } else {
          return isClickSelectAllBtn.value;
        }
      });
      const handleSelect = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (checked.value) {
          if (props.list.length > 0) {
            selected.value = [];
          } else {
            isClickSelectAllBtn.value = false;
          }
        } else {
          if (props.list.length > 0) {
            selected.value = [];
            selected.value = props.list.map((media) => {
              return `${media.id}:${media.type}`;
            });
          } else {
            isClickSelectAllBtn.value = true;
          }
        }
      };
      const handleClean = (event) => {
        event.stopPropagation();
        emits("batchAction", { type: "clean" });
      };
      const handleDel = (event) => {
        event.stopPropagation();
        emits("batchAction", { type: "del" });
      };
      const handleCopy = (event) => {
        event.stopPropagation();
        emits("batchAction", { type: "copy" });
      };
      const handleMove = (event) => {
        event.stopPropagation();
        emits("batchAction", { type: "move" });
      };
      vue.watch(
        () => props.list,
        () => {
          isClickSelectAllBtn.value = false;
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter__left" }), [
            vue.createElementVNode("label", vue.mergeProps(_ctx.$attrs, {
              role: "checkbox",
              class: { vui_checkbox: true, "vui_checkbox--checked": checked.value },
              onClick: handleSelect
            }), [
              vue.createElementVNode("span", _hoisted_1$2, [
                vue.createElementVNode("input", {
                  type: "checkbox",
                  class: "vui_checkbox--input-original",
                  value: checked.value
                }, null, 8, _hoisted_2$2),
                _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "vui_checkbox--input-box" }, null, -1))
              ]),
              _cache[1] || (_cache[1] = vue.createElementVNode("span", { class: "vui_checkbox--label" }, "全选", -1))
            ], 16),
            vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "selected" }), "已选择 " + vue.toDisplayString(selected.value.length) + " 个视频", 17)
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header-filter__right" }), [
            __props.isSelf ? (vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({ key: 0 }, _ctx.$attrs, {
              class: "vui_button action-btn",
              onClick: handleClean
            }), [
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-BDC-brush_clear_line",
                style: { "font-size": "16px" }
              }), null, 16),
              _cache[2] || (_cache[2] = vue.createTextVNode(" 清除失效内容 "))
            ], 16)) : vue.createCommentVNode("", true),
            __props.isSelf ? (vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({ key: 1 }, _ctx.$attrs, {
              class: "vui_button action-btn",
              onClick: handleDel
            }), [
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-BDC-star_favorite_off_line",
                style: { "font-size": "16px" }
              }), null, 16),
              _cache[3] || (_cache[3] = vue.createTextVNode(" 取消收藏 "))
            ], 16)) : vue.createCommentVNode("", true),
            vue.createElementVNode("button", vue.mergeProps(_ctx.$attrs, {
              class: "vui_button action-btn",
              onClick: handleCopy
            }), [
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-BDC-copy_line",
                style: { "font-size": "16px" }
              }), null, 16),
              _cache[4] || (_cache[4] = vue.createTextVNode(" 复制至 "))
            ], 16),
            __props.isSelf ? (vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({ key: 2 }, _ctx.$attrs, {
              class: "vui_button action-btn",
              onClick: handleMove
            }), [
              vue.createElementVNode("i", vue.mergeProps(_ctx.$attrs, {
                class: "vui_icon sic-fsp-folder_add_line",
                style: { "font-size": "16px" }
              }), null, 16),
              _cache[5] || (_cache[5] = vue.createTextVNode(" 移动至 "))
            ], 16)) : vue.createCommentVNode("", true)
          ], 16)
        ], 16);
      };
    }
  };
  const _sfc_main$3 = {
    __name: "Empty",
    props: {
      keyword: {
        type: String,
        required: false
      }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-main-empty" }), [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "b-img fav-list-main-empty__img" }), _cache[0] || (_cache[0] = [
            vue.createElementVNode("img", {
              src: "//i1.hdslb.com/bfs/static/jinkela/long/images/load-data-nothing.svg",
              class: "b-img__inner",
              alt: "什么都没有",
              onload: "bmgCmptOnload(this)",
              onerror: "bmgCmptOnerror(this)"
            }, null, -1)
          ]), 16),
          __props.keyword ? (vue.openBlock(), vue.createElementBlock("p", vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.$attrs)), [
            _cache[1] || (_cache[1] = vue.createTextVNode(" 所有收藏夹都没有相关视频_(:зゝ∠)_")),
            vue.createElementVNode("br", vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), null, 16),
            _cache[2] || (_cache[2] = vue.createTextVNode("换个关键词试试吧 "))
          ], 16)) : (vue.openBlock(), vue.createElementBlock("p", vue.normalizeProps(vue.mergeProps({ key: 1 }, _ctx.$attrs)), "这里还什么都没有呢～", 16))
        ], 16);
      };
    }
  };
  const timestampToDate = [
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  ];
  const formatSeconds = [
    (seconds) => {
      const date = new Date(seconds * 1e3);
      const hh = date.getUTCHours().toString().padStart(2, "0");
      const mm = date.getUTCMinutes().toString().padStart(2, "0");
      const ss = date.getSeconds().toString().padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    },
    (seconds) => {
      const date = new Date(seconds * 1e3);
      const mm = date.getUTCMinutes().toString().padStart(2, "0");
      const ss = date.getSeconds().toString().padStart(2, "0");
      return `${mm}:${ss}`;
    }
  ];
  const dateUtil = { timestampToDate, formatSeconds };
  const add = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/add";
    let params = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params, success, failure);
  };
  const del = ({ bvid }, success, failure) => {
    if (!bvid) return;
    let url = "https://api.bilibili.com/x/v2/history/toview/del";
    let params = {
      aid: biliUtil.bv2av(bvid)
    };
    return request$1.post(url, params, success, failure);
  };
  const _hoisted_1$1 = { class: "bili-video-card__wrap" };
  const _hoisted_2$1 = ["href"];
  const _hoisted_3$1 = { class: "bili-cover-card__thumbnail" };
  const _hoisted_4$1 = ["src", "alt"];
  const _hoisted_5$1 = {
    key: 0,
    class: "bili-cover-card__tags"
  };
  const _hoisted_6$1 = { class: "bili-cover-card__tag" };
  const _hoisted_7 = { class: "bili-cover-card__stats" };
  const _hoisted_8 = {
    key: 0,
    class: "bili-cover-card__stat"
  };
  const _hoisted_9 = {
    key: 1,
    class: "bili-cover-card__stat"
  };
  const _hoisted_10 = { class: "bili-cover-card__stat" };
  const _hoisted_11 = { class: "bili-card-watch-later" };
  const _hoisted_12 = ["onClick"];
  const _hoisted_13 = { class: "bili-card-watch-later__tip" };
  const _hoisted_14 = { class: "bili-video-card__details" };
  const _hoisted_15 = ["title"];
  const _hoisted_16 = ["href"];
  const _hoisted_17 = { class: "bili-video-card__subtitle" };
  const _hoisted_18 = ["title"];
  const _hoisted_19 = ["href"];
  const _hoisted_20 = { class: "bili-video-card__text" };
  const _hoisted_21 = ["title"];
  const _hoisted_22 = ["onClick"];
  const _hoisted_23 = ["onClick"];
  const _hoisted_24 = ["onClick"];
  const _hoisted_25 = ["onClick"];
  const _sfc_main$2 = {
    __name: "List",
    props: /* @__PURE__ */ vue.mergeModels({
      list: {
        type: Array,
        required: true,
        default: []
      },
      isSelf: {
        type: Boolean,
        required: true,
        default: false
      },
      isShowBatch: {
        type: Boolean,
        required: true,
        default: false
      }
    }, {
      "selected": {},
      "selectedModifiers": {}
    }),
    emits: /* @__PURE__ */ vue.mergeModels(["action"], ["update:selected"]),
    setup(__props, { emit: __emit }) {
      const selected = vue.useModel(__props, "selected");
      const emits = __emit;
      let timerId2 = null;
      let dropdown = null;
      const mouseenterCard = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-dropdown")) == null ? void 0 : _a.classList.add("bili-card-dropdown--visible");
      };
      const mouseleaveCard = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-dropdown")) == null ? void 0 : _a.classList.remove("bili-card-dropdown--visible");
      };
      const mouseenterCover = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-watch-later")) == null ? void 0 : _a.classList.add("bili-card-watch-later--visible");
      };
      const mouseleaveCover = (event) => {
        var _a;
        (_a = event.target.querySelector(".bili-card-watch-later")) == null ? void 0 : _a.classList.remove("bili-card-watch-later--visible");
      };
      const mouseenterDropdown = (event) => {
        var _a, _b, _c, _d;
        timerId2 && clearTimeout(timerId2);
        if (dropdown && dropdown !== event.target) {
          (_b = (_a = dropdown.closest(".items__item")) == null ? void 0 : _a.querySelector(".bili-card-dropdown-popper")) == null ? void 0 : _b.classList.remove("visible");
        }
        (_d = (_c = event.target.closest(".items__item")) == null ? void 0 : _c.querySelector(".bili-card-dropdown-popper")) == null ? void 0 : _d.classList.add("visible");
      };
      const mouseleaveDropdown = (event) => {
        timerId2 = setTimeout(() => {
          var _a, _b;
          (_b = (_a = event.target.closest(".items__item")) == null ? void 0 : _a.querySelector(".bili-card-dropdown-popper")) == null ? void 0 : _b.classList.remove("visible");
        }, 200);
        dropdown = event.target;
      };
      const mouseenterPopper = (event) => {
        event.target.classList.add("visible");
        timerId2 && clearTimeout(timerId2);
      };
      const mouseleavePopper = (event) => {
        event.target.classList.remove("visible");
      };
      const handleSelect = (media, event) => {
        event.stopPropagation();
        const value = `${media.id}:${media.type}`;
        if (selected.value.includes(value)) {
          selected.value.splice(selected.value.indexOf(value), 1);
        } else {
          selected.value.push(value);
        }
      };
      const handleWatchLater = (media, event) => {
        event.stopPropagation();
        const bvid = media.bvid;
        if (media.toview) {
          del({ bvid }, () => {
            media.toview = false;
          });
        } else {
          add({ bvid }, () => {
            media.toview = true;
          });
        }
      };
      const handleDel = (media, event) => {
        event.stopPropagation();
        emits("action", { type: "del", resources: `${media.id}:${media.type}` });
      };
      const handleCopy = (media, event) => {
        event.stopPropagation();
        emits("action", { type: "copy", resources: `${media.id}:${media.type}` });
      };
      const handleMove = (media, event) => {
        event.stopPropagation();
        emits("action", { type: "move", resources: `${media.id}:${media.type}` });
      };
      return (_ctx, _cache) => {
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.list, (item) => {
          var _a;
          return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ ref_for: true }, _ctx.$attrs, { class: "items__item" }), [
            vue.createElementVNode("div", vue.mergeProps({ ref_for: true }, _ctx.$attrs, {
              class: "bili-video-card",
              onMouseenter: mouseenterCard,
              onMouseleave: mouseleaveCard
            }), [
              vue.createElementVNode("div", _hoisted_1$1, [
                vue.createElementVNode("div", {
                  class: "bili-video-card__cover",
                  onMouseenter: mouseenterCover,
                  onMouseleave: mouseleaveCover
                }, [
                  vue.createElementVNode("a", {
                    class: "bili-cover-card",
                    href: `https://www.bilibili.com/video/${item.bvid}?spm_id_from=333.1387.favlist.content.click`,
                    target: "_blank"
                  }, [
                    vue.createElementVNode("div", _hoisted_3$1, [
                      vue.createElementVNode("img", {
                        src: item.cover.slice(item.cover.indexOf("//")) + "@672w_378h_1c.avif",
                        class: "",
                        alt: item.title,
                        onload: "typeof window.bmgCmptOnload === 'function' && window.bmgCmptOnload(this)",
                        onerror: "typeof window.bmgCmptOnerror === 'function' && window.bmgCmptOnerror(this)"
                      }, null, 8, _hoisted_4$1)
                    ]),
                    item.type === 24 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$1, [
                      vue.createElementVNode("div", _hoisted_6$1, [
                        vue.createElementVNode("span", null, vue.toDisplayString((_a = item.ogv) == null ? void 0 : _a.type_name), 1)
                      ])
                    ])) : vue.createCommentVNode("", true),
                    vue.createElementVNode("div", _hoisted_7, [
                      item.type !== 24 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, [
                        _cache[0] || (_cache[0] = vue.createElementVNode("i", { class: "sic-BDC-playdata_square_line" }, null, -1)),
                        vue.createElementVNode("span", null, vue.toDisplayString(item.cnt_info.view_text_1), 1)
                      ])) : vue.createCommentVNode("", true),
                      item.type !== 24 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
                        _cache[1] || (_cache[1] = vue.createElementVNode("i", { class: "sic-BDC-danmu_square_line" }, null, -1)),
                        vue.createElementVNode("span", null, vue.toDisplayString(item.cnt_info.danmaku < 1e4 ? item.cnt_info.danmaku : (item.cnt_info.danmaku / 1e4).toFixed(1) + "万"), 1)
                      ])) : vue.createCommentVNode("", true),
                      vue.createElementVNode("div", _hoisted_10, [
                        vue.createElementVNode("span", null, vue.toDisplayString(item.duration < 3600 ? vue.unref(dateUtil).formatSeconds[1](item.duration) : vue.unref(dateUtil).formatSeconds[0](item.duration)), 1)
                      ])
                    ])
                  ], 8, _hoisted_2$1),
                  vue.createElementVNode("div", _hoisted_11, [
                    vue.createElementVNode("div", {
                      class: "bili-card-watch-later__btn",
                      onClick: (event) => handleWatchLater(item, event)
                    }, [
                      vue.createElementVNode("i", {
                        class: vue.normalizeClass(
                          item.toview ? "sic-BDC-checkmark_line" : "sic-BDC-arrow_play_next_line"
                        ),
                        style: { "font-variation-settings": "'strk' 1.5" }
                      }, null, 2)
                    ], 8, _hoisted_12),
                    vue.createElementVNode("span", _hoisted_13, vue.toDisplayString(item.toview ? "移除" : "稍后再看"), 1)
                  ]),
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass({
                      "bili-card-checkbox": true,
                      "bili-card-checkbox--visible": __props.isShowBatch,
                      "bili-card-checkbox--checked": selected.value.includes(`${item.id}:${item.type}`)
                    })
                  }, _cache[2] || (_cache[2] = [
                    vue.createElementVNode("div", { class: "bili-card-checkbox__inner" }, [
                      vue.createElementVNode("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 16 16",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg"
                      }, [
                        vue.createElementVNode("path", {
                          "fill-rule": "evenodd",
                          "clip-rule": "evenodd",
                          d: "M14.3378 3.00678C14.0492 2.74694 13.6046 2.77024 13.3447 3.05882L5.46602 11.809L2.66657 8.69993C2.40673 8.41135 1.96215 8.38805 1.67357 8.64789C1.38498 8.90773 1.36168 9.35232 1.62153 9.6409L4.93385 13.3196C5.11955 13.5259 5.39962 13.5966 5.64967 13.5253C5.78192 13.4929 5.90618 13.4218 6.00416 13.313L14.3898 3.99979C14.6496 3.7112 14.6263 3.26662 14.3378 3.00678Z",
                          fill: "white"
                        }),
                        vue.createElementVNode("path", {
                          d: "M13.3447 3.05882L13.9021 3.56067L13.9021 3.56067L13.3447 3.05882ZM14.3378 3.00678L13.8359 3.56414L14.3378 3.00678ZM5.46602 11.809L4.90866 12.3109L5.46602 12.9299L6.02338 12.3109L5.46602 11.809ZM2.66657 8.69993L3.22393 8.19809L3.22393 8.19809L2.66657 8.69993ZM1.67357 8.64789L1.17172 8.09053L1.17172 8.09053L1.67357 8.64789ZM1.62153 9.6409L2.17888 9.13905L2.17888 9.13905L1.62153 9.6409ZM4.93385 13.3196L5.4912 12.8178L5.4912 12.8178L4.93385 13.3196ZM5.64967 13.5253L5.47111 12.7969L5.45752 12.8002L5.44406 12.8041L5.64967 13.5253ZM6.00416 13.313L6.56152 13.8148L6.56152 13.8148L6.00416 13.313ZM14.3898 3.99979L14.9472 4.50163L14.9472 4.50163L14.3898 3.99979ZM13.9021 3.56067C13.8848 3.57991 13.8551 3.58146 13.8359 3.56414L14.8396 2.44942C14.2432 1.91242 13.3244 1.96057 12.7874 2.55697L13.9021 3.56067ZM6.02338 12.3109L13.9021 3.56067L12.7874 2.55697L4.90866 11.3072L6.02338 12.3109ZM6.02338 11.3072L3.22393 8.19809L2.10921 9.20178L4.90866 12.3109L6.02338 11.3072ZM3.22393 8.19809C2.68693 7.60168 1.76812 7.55353 1.17172 8.09053L2.17541 9.20525C2.15618 9.22257 2.12654 9.22102 2.10921 9.20178L3.22393 8.19809ZM1.17172 8.09053C0.575316 8.62754 0.527163 9.54634 1.06417 10.1427L2.17888 9.13905C2.19621 9.15829 2.19465 9.18793 2.17541 9.20525L1.17172 8.09053ZM1.06417 10.1427L4.37649 13.8215L5.4912 12.8178L2.17888 9.13905L1.06417 10.1427ZM4.37649 13.8215C4.76102 14.2485 5.34044 14.3933 5.85527 14.2466L5.44406 12.8041C5.45258 12.8016 5.46061 12.8017 5.46824 12.8039C5.47717 12.8063 5.48577 12.8117 5.4912 12.8178L4.37649 13.8215ZM5.4468 12.8111C5.44921 12.8085 5.45292 12.8052 5.45767 12.8024C5.46225 12.7997 5.46684 12.7979 5.47111 12.7969L5.82823 14.2538C6.10199 14.1866 6.35971 14.039 6.56152 13.8148L5.4468 12.8111ZM13.8324 3.49794L5.4468 12.8111L6.56152 13.8148L14.9472 4.50163L13.8324 3.49794ZM13.8359 3.56414C13.8167 3.54681 13.8151 3.51718 13.8324 3.49794L14.9472 4.50163C15.4842 3.90523 15.436 2.98642 14.8396 2.44942L13.8359 3.56414Z",
                          fill: "white"
                        })
                      ])
                    ], -1)
                  ]), 2)
                ], 32),
                vue.createElementVNode("div", _hoisted_14, [
                  vue.createElementVNode("div", {
                    class: "bili-video-card__title bili-video-card__title--pr",
                    title: item.type === 24 ? item.intro : item.title
                  }, [
                    vue.createElementVNode("a", {
                      href: `https://www.bilibili.com/video/${item.bvid}?spm_id_from=333.1387.favlist.content.click`,
                      target: "_blank"
                    }, vue.toDisplayString(item.type === 24 ? item.intro : item.title), 9, _hoisted_16),
                    __props.isSelf ? (vue.openBlock(), vue.createElementBlock("div", {
                      key: 0,
                      class: "bili-card-dropdown",
                      onMouseenter: mouseenterDropdown,
                      onMouseleave: mouseleaveDropdown
                    }, _cache[3] || (_cache[3] = [
                      vue.createElementVNode("i", {
                        class: "sic-BDC-more_vertical_fill",
                        style: { "font-variation-settings": "'strk' 1.5" }
                      }, null, -1)
                    ]), 32)) : vue.createCommentVNode("", true)
                  ], 8, _hoisted_15),
                  vue.createElementVNode("div", _hoisted_17, [
                    item.type === 24 ? (vue.openBlock(), vue.createElementBlock("span", {
                      key: 0,
                      title: `${item.title} · 收藏于${vue.unref(dateUtil).timestampToDate[2](
                      item.fav_time * 1e3
                    )}`
                    }, vue.toDisplayString(item.title) + " · 收藏于" + vue.toDisplayString(vue.unref(dateUtil).timestampToDate[2](item.fav_time * 1e3)), 9, _hoisted_18)) : (vue.openBlock(), vue.createElementBlock("a", {
                      key: 1,
                      class: "bili-video-card__author",
                      href: `https://space.bilibili.com/${item.upper.mid}?spm_id_from=333.1387.favlist.content.click`,
                      target: "_blank"
                    }, [
                      _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "bili-video-card__text" }, [
                        vue.createElementVNode("i", { class: "sic-BDC-uploader_name_square_line" }),
                        vue.createElementVNode("span")
                      ], -1)),
                      vue.createElementVNode("div", _hoisted_20, [
                        vue.createElementVNode("span", {
                          title: `${item.upper.name} · 收藏于${vue.unref(dateUtil).timestampToDate[2](
                          item.fav_time * 1e3
                        )}`
                        }, vue.toDisplayString(item.upper.name) + " · 收藏于" + vue.toDisplayString(vue.unref(dateUtil).timestampToDate[2](item.fav_time * 1e3)), 9, _hoisted_21)
                      ])
                    ], 8, _hoisted_19))
                  ])
                ])
              ]),
              __props.isShowBatch ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "bili-card-checkbox-overlay",
                style: { "z-index": "1036" },
                onClick: (event) => handleSelect(item, event)
              }, null, 8, _hoisted_22)) : vue.createCommentVNode("", true)
            ], 16),
            __props.isSelf ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "bili-card-dropdown-popper",
              style: { "position": "absolute", "inset": "0px 0px auto auto", "margin": "0px", "z-index": "1005", "transform": "translate(0px, 151px)" },
              "data-popper-placement": "bottom-end",
              onMouseenter: mouseenterPopper,
              onMouseleave: mouseleavePopper
            }, [
              vue.createElementVNode("div", {
                class: "bili-card-dropdown-popper__item",
                "data-key": "CANCEL",
                onClick: (event) => handleDel(item, event)
              }, " 取消收藏 ", 8, _hoisted_23),
              vue.createElementVNode("div", {
                class: "bili-card-dropdown-popper__item",
                "data-key": "COPY",
                onClick: (event) => handleCopy(item, event)
              }, " 复制至 ", 8, _hoisted_24),
              vue.createElementVNode("div", {
                class: "bili-card-dropdown-popper__item",
                "data-key": "MOVE",
                onClick: (event) => handleMove(item, event)
              }, " 移动至 ", 8, _hoisted_25)
            ], 32)) : vue.createCommentVNode("", true)
          ], 16);
        }), 256);
      };
    }
  };
  const List = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a3628dd0"]]);
  const _hoisted_1 = { class: "vui_pagenation--btns" };
  const _hoisted_2 = ["onClick"];
  const _hoisted_3 = { class: "vui_pagenation-go" };
  const _hoisted_4 = { class: "vui_pagenation-go__count" };
  const _hoisted_5 = { class: "vui_input" };
  const _hoisted_6 = { class: "vui_input-wrapper" };
  const _sfc_main$1 = {
    __name: "Pagination",
    props: {
      total: {
        type: Number,
        required: true
      },
      currPage: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        required: true
      }
    },
    emits: ["change"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emits = __emit;
      const totalPage = vue.computed(() => Math.ceil(props.total / props.pageSize));
      const hasPrev = vue.computed(() => totalPage.value > 1 && props.currPage !== 1);
      const hasNext = vue.computed(() => totalPage.value > 1 && props.currPage !== totalPage.value);
      const pages = vue.computed(() => {
        const maxVisiblePages = 9;
        const _pages = [];
        if (totalPage.value <= maxVisiblePages) {
          for (let i = 1; i <= totalPage.value; i++) {
            _pages.push(i);
          }
        } else {
          const halfVisiblePages = Math.floor(maxVisiblePages / 2);
          _pages.push(1);
          let startPage, endPage;
          if (props.currPage <= halfVisiblePages + 1) {
            startPage = 2;
            endPage = maxVisiblePages - 2;
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push({ text: "...", to: props.currPage + 5 });
            _pages.push(totalPage.value);
          } else if (props.currPage >= totalPage.value - halfVisiblePages) {
            _pages.push({ text: "...", to: props.currPage - 5 });
            startPage = totalPage.value - (maxVisiblePages - 3);
            endPage = totalPage.value - 1;
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push(totalPage.value);
          } else {
            _pages.push({ text: "...", to: props.currPage - 5 });
            startPage = props.currPage - Math.floor((maxVisiblePages - 4) / 2);
            endPage = props.currPage + Math.floor((maxVisiblePages - 4) / 2);
            for (let i = startPage; i <= endPage; i++) {
              _pages.push(i);
            }
            _pages.push({ text: "...", to: props.currPage + 5 });
            _pages.push(totalPage.value);
          }
        }
        return _pages;
      });
      const jump = (to) => {
        emits("change", to);
      };
      const handleEnter = (event) => {
        const to = Number(event.target.value);
        if (Number.isInteger(to) && to >= 1 && to <= totalPage.value) {
          jump(to);
        }
        event.target.value = "";
      };
      return (_ctx, _cache) => {
        return totalPage.value > 1 ? (vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ key: 0 }, _ctx.$attrs, { class: "vui_pagenation vui_pagenation--jump card-pagenation" }), [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("button", {
              class: vue.normalizeClass({
                vui_button: true,
                "vui_pagenation--btn": true,
                "vui_pagenation--btn-side": true,
                "vui_button--disabled": !hasPrev.value
              }),
              onClick: _cache[0] || (_cache[0] = ($event) => jump(__props.currPage - 1))
            }, " 上一页 ", 2),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(pages.value, (page) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                class: vue.normalizeClass({
                  vui_button: true,
                  "vui_button--no-transition": true,
                  "vui_pagenation--btn": true,
                  "vui_pagenation--btn-num": true,
                  "vui_button--active": __props.currPage === page,
                  "vui_button--active-blue": __props.currPage === page
                }),
                onClick: ($event) => jump(typeof page === "object" ? page.to : page)
              }, vue.toDisplayString(typeof page === "object" ? page.text : page), 11, _hoisted_2);
            }), 256)),
            vue.createElementVNode("button", {
              class: vue.normalizeClass({
                vui_button: true,
                "vui_pagenation--btn": true,
                "vui_pagenation--btn-side": true,
                "vui_button--disabled": !hasNext.value
              }),
              onClick: _cache[1] || (_cache[1] = ($event) => jump(__props.currPage + 1))
            }, " 下一页 ", 2)
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            vue.createElementVNode("span", _hoisted_4, " 共 " + vue.toDisplayString(totalPage.value) + " 页 / " + vue.toDisplayString(__props.total) + " 个，跳至 ", 1),
            vue.createElementVNode("div", _hoisted_5, [
              vue.createElementVNode("div", _hoisted_6, [
                vue.createElementVNode("input", {
                  type: "number",
                  class: "vui_input__input vui_input__input-resizable",
                  onKeyup: vue.withKeys(handleEnter, ["enter"])
                }, null, 32)
              ])
            ]),
            _cache[2] || (_cache[2] = vue.createElementVNode("span", { class: "vui_pagenation-go__page" }, "页", -1))
          ])
        ], 16)) : vue.createCommentVNode("", true);
      };
    }
  };
  const _sfc_main = {
    __name: "Main",
    props: /* @__PURE__ */ vue.mergeModels({
      mid: {
        type: String,
        required: true,
        default: ""
      },
      mediaId: {
        type: Number,
        required: true,
        default: 0
      }
    }, {
      "mode": {},
      "modeModifiers": {}
    }),
    emits: ["update:mode"],
    setup(__props) {
      const mode2 = vue.useModel(__props, "mode");
      const props = __props;
      let uid = biliUtil.getUid();
      const filterRef = vue.ref(null);
      const params = vue.ref({
        pn: 1,
        ps: 36,
        type: 0,
        tid: 0,
        keyword: "",
        order: "mtime"
      });
      const total = vue.ref(0);
      const list$1 = vue.ref([]);
      const selected = vue.ref([]);
      const search = () => {
        list({ mediaId: props.mediaId, ...params.value }, (result) => {
          total.value = result.info.media_count;
          list$1.value = result.medias;
        });
      };
      const del2 = (resources) => {
        del$1({ mediaId: props.mediaId, resources }, () => {
          message.info({ text: "操作成功" });
          setTimeout(() => {
            mode2.value = "list";
            selected.value = [];
            search();
          }, 200);
        });
      };
      const copy$1 = (count, resources) => {
        all({ upMid: uid }, (result) => {
          const tarMediaId = vue.ref(0);
          const close = modal.open({
            wrapClassName: "fav-modify-modal-content",
            title: `将${count}个视频复制至`,
            template: _sfc_main$a,
            templateProps: {
              selected: tarMediaId,
              "onUpdate:selected": (newValue) => {
                tarMediaId.value = newValue;
              },
              favs: (result == null ? void 0 : result.list) || []
            },
            $ok: () => {
              if (!tarMediaId.value) {
                message.info({ text: "请选择目标收藏夹" });
                return;
              }
              copy(
                {
                  mid: props.mid,
                  srcMediaId: props.mediaId,
                  tarMediaId: tarMediaId.value,
                  resources
                },
                () => {
                  close && close();
                  message.info({ text: "操作成功" });
                  setTimeout(() => {
                    mode2.value = "list";
                    selected.value = [];
                  }, 200);
                }
              );
            },
            $close: () => {
              tarMediaId.value = 0;
            }
          });
        });
      };
      const move$1 = (count, resources) => {
        all({ upMid: uid }, (result) => {
          const tarMediaId = vue.ref(0);
          const close = modal.open({
            wrapClassName: "fav-modify-modal-content",
            title: `将${count}个视频移动至`,
            template: _sfc_main$a,
            templateProps: {
              selected: tarMediaId,
              "onUpdate:selected": (newValue) => {
                tarMediaId.value = newValue;
              },
              favs: (result == null ? void 0 : result.list) || []
            },
            $ok: () => {
              if (!tarMediaId.value) {
                message.info({ text: "请选择目标收藏夹" });
                return;
              }
              move(
                {
                  mid: props.mid,
                  srcMediaId: props.mediaId,
                  tarMediaId: tarMediaId.value,
                  resources
                },
                () => {
                  close && close();
                  message.info({ text: "操作成功" });
                  setTimeout(() => {
                    mode2.value = "list";
                    selected.value = [];
                    search();
                  }, 200);
                }
              );
            },
            $close: () => {
              tarMediaId.value = 0;
            }
          });
        });
      };
      const clean$1 = () => {
        const close = modal.open({
          title: "清除失效内容",
          template: "span",
          templateProps: {
            innerHTML: "是否一键清除当前文件夹所有失效内容？"
          },
          $ok: () => {
            clean(
              {
                mediaId: props.mediaId
              },
              () => {
                close && close();
                message.info({ text: "操作成功" });
                setTimeout(() => {
                  mode2.value = "list";
                  selected.value = [];
                  search();
                }, 200);
              }
            );
          },
          $cancel: () => {
          }
        });
      };
      const handleFilter = (items) => {
        items.forEach((item) => {
          params.value[item.key] = item.value;
        });
        params.value.pn = 1;
        search();
      };
      const handleBatchAction = ({ type }) => {
        if (!type) return;
        if (type === "clean") {
          clean$1();
        } else {
          if (!selected.value || selected.value.length === 0) {
            message.info({ text: "请先选择视频" });
            return;
          }
          const conut = selected.value.length;
          const resources = selected.value.join(",");
          if (type === "del") {
            if (conut > 1) {
              const close = modal.open({
                title: "取消收藏",
                template: "span",
                templateProps: {
                  innerHTML: `是否确认取消 ${conut} 个视频？`
                },
                $ok: () => {
                  close && close();
                  del2(resources);
                },
                $cancel: () => {
                }
              });
            } else {
              del2(resources);
            }
          }
          if (type === "copy") copy$1(conut, resources);
          if (type === "move") move$1(conut, resources);
        }
      };
      const handleAction = ({ type, resources }) => {
        if (!type || !resources) return;
        if (type === "del") del2(resources);
        if (type === "copy") copy$1(1, resources);
        if (type === "move") move$1(1, resources);
      };
      const handleJump = (to) => {
        params.value.pn = to;
        search();
      };
      vue.watch(
        () => props.mediaId,
        () => {
          var _a;
          params.value = {
            pn: 1,
            ps: 36,
            type: 0,
            tid: 0,
            keyword: "",
            order: "mtime"
          };
          ((_a = filterRef.value) == null ? void 0 : _a.reset) && filterRef.value.reset();
          mode2.value = "list";
          selected.value = [];
          search();
        }
      );
      vue.watch(
        () => mode2.value,
        () => {
          if (mode2.value === "list") selected.value = [];
        }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "fav-list-header" }), [
            vue.withDirectives(vue.createVNode(_sfc_main$5, vue.mergeProps(_ctx.$attrs, {
              ref_key: "filterRef",
              ref: filterRef,
              onChange: handleFilter
            }), null, 16), [
              [vue.vShow, mode2.value === "list"]
            ]),
            vue.withDirectives(vue.createVNode(_sfc_main$4, vue.mergeProps(_ctx.$attrs, {
              list: list$1.value || [],
              isSelf: __props.mid === vue.unref(uid),
              selected: selected.value,
              "onUpdate:selected": _cache[0] || (_cache[0] = ($event) => selected.value = $event),
              onBatchAction: handleBatchAction
            }), null, 16, ["list", "isSelf", "selected"]), [
              [vue.vShow, mode2.value === "batch"]
            ])
          ], 16),
          vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, { class: "items" }), [
            list$1.value && list$1.value.length > 0 ? (vue.openBlock(), vue.createBlock(List, vue.mergeProps({ key: 0 }, _ctx.$attrs, {
              list: list$1.value || [],
              isSelf: __props.mid === vue.unref(uid),
              isShowBatch: mode2.value === "batch",
              selected: selected.value,
              "onUpdate:selected": _cache[1] || (_cache[1] = ($event) => selected.value = $event),
              onAction: handleAction
            }), null, 16, ["list", "isSelf", "isShowBatch", "selected"])) : vue.createCommentVNode("", true)
          ], 16),
          list$1.value && list$1.value.length > 0 ? (vue.openBlock(), vue.createBlock(_sfc_main$1, vue.mergeProps({ key: 0 }, _ctx.$attrs, {
            total: total.value,
            currPage: params.value.pn,
            pageSize: params.value.ps,
            onChange: handleJump
          }), null, 16, ["total", "currPage", "pageSize"])) : vue.createCommentVNode("", true),
          !list$1.value || list$1.value.length === 0 ? (vue.openBlock(), vue.createBlock(_sfc_main$3, vue.mergeProps({ key: 1 }, _ctx.$attrs, {
            keyword: params.value.keyword
          }), null, 16, ["keyword"])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  };
  let attr = null;
  let mid = location.pathname.split("/")[1];
  let originInfoBatch = null;
  let customInfoBatch = null;
  let originListMain = null;
  let customListMain = null;
  const mediaId = vue.ref(0);
  const mode = vue.ref("list");
  const render = () => {
    originInfoBatch = document.querySelector(".favlist-main .favlist-info-batch");
    if (customInfoBatch) customInfoBatch.parentNode.removeChild(customInfoBatch);
    customInfoBatch = originInfoBatch.cloneNode(true);
    customInfoBatch.id = "custom-batch-btn";
    customInfoBatch.addEventListener("click", () => {
      if (mode.value === "list") {
        mode.value = "batch";
        customInfoBatch.innerHTML = "返回";
      } else {
        mode.value = "list";
        customInfoBatch.innerHTML = "批量操作";
      }
    });
    originInfoBatch.parentNode.append(customInfoBatch);
    vue.createApp({
      render: () => {
        return vue.h(_sfc_main, {
          [attr.name]: attr.value,
          mid,
          mediaId: mediaId.value,
          mode: mode.value,
          "onUpdate:mode": (newValue) => {
            mode.value = newValue;
            if (newValue === "list") {
              customInfoBatch.innerHTML = "批量操作";
            } else {
              customInfoBatch.innerHTML = "返回";
            }
          }
        });
      }
    }).mount(
      (() => {
        originListMain = document.querySelector(".favlist-main .fav-list-main");
        attr = Object.values(originListMain.attributes).find((item) => {
          return item.name.startsWith("data-v-");
        });
        if (customListMain) customListMain.parentNode.removeChild(customListMain);
        customListMain = originListMain.cloneNode();
        customListMain.id = "custom-list-main";
        originListMain.parentNode.append(customListMain);
        return customListMain;
      })()
    );
  };
  const replace = () => {
    if (originInfoBatch) originInfoBatch.style.display = "none";
    if (originListMain) originListMain.style.display = "none";
    if (customInfoBatch) customInfoBatch.style.display = "";
    if (customListMain) customListMain.style.display = "";
  };
  const restore = () => {
    if (originInfoBatch) originInfoBatch.style.display = "";
    if (originListMain) originListMain.style.display = "";
    if (customInfoBatch) customInfoBatch.style.display = "none";
    if (customListMain) customListMain.style.display = "none";
  };
  (async () => {
    const result = await all({ upMid: mid });
    const favs = result == null ? void 0 : result.list;
    const load_observer = new MutationObserver(() => {
      let items = null;
      const sidebar = document.querySelector(".favlist-aside .vui_sidebar");
      if (!sidebar || !sidebar.querySelector(".vui_sidebar-item--active")) return;
      load_observer.disconnect();
      render();
      const _ = () => {
        var _a;
        if (!items) items = Array.from(sidebar.querySelectorAll(".fav-sidebar-item"));
        const actived = sidebar.querySelector(".vui_sidebar-item--active");
        if (actived) {
          replace();
          const fid = (_a = favs[items.indexOf(actived.parentNode)]) == null ? void 0 : _a.id;
          if (mediaId.value !== fid) mediaId.value = fid;
        } else {
          restore();
        }
      };
      _();
      new MutationObserver(_).observe(sidebar, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true
      });
    });
    load_observer.observe(document.body, { childList: true, subtree: true });
  })();

})(Vue);