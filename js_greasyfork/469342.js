// ==UserScript==
// @name         v2ex-reaciton
// @namespace    npm/vite-plugin-monkey
// @version      0.1.1
// @author       yuyinws
// @description  给v2ex增加emoji reaction功能
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @iconURL      https://www.v2ex.com/static/favicon.ico
// @match        *://*.v2ex.com/t/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/469342/v2ex-reaciton.user.js
// @updateURL https://update.greasyfork.org/scripts/469342/v2ex-reaciton.meta.js
// ==/UserScript==

(o=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=o,document.head.append(e)})(' :root{--emojir-text-primary: #24292f}@media (prefers-color-scheme: dark){:root{--emojir-text-primary: #f5f5f5}}.emoji-reaction{display:flex;flex-direction:column;align-items:center;gap:1rem;margin:1rem 0;flex-wrap:wrap}.emoji-title{font-size:14px;font-weight:600;cursor:pointer;color:var(--emojir-text-primary)}.emoji-face-icon:before,.emoji-face-icon::-webkit-details-marker{display:none}.emoji-face-icon::marker{content:""}.emoji-face-icon{height:100%;width:100%;display:flex;justify-content:center;align-items:center;cursor:pointer}.emoji-list{display:flex;gap:5px}.emoji-menu{position:relative;background:#f6f8fa;border:1px solid #d0d7de;border-radius:50%;width:24px;height:24px}.emoji-menu:hover{background:#eaeef2}.emoji-panel-list{display:flex;flex-wrap:wrap;gap:.3rem}.emoji-panel{padding:.5rem;position:absolute;z-index:10;box-shadow:0 0 10px #0000001a;border-radius:.5rem;background-color:#fff;display:flex;flex-wrap:wrap;width:9.5rem}.emoji-panel-login{font-size:12px;color:#2563eb!important;font-style:italic}.emoji-item{padding:.5rem;width:1rem;height:1rem;cursor:pointer;border-radius:3px;display:flex;justify-content:center;align-items:center}.emoji-item:hover{background:#f3f4f6;font-size:20px;transition:font-size .2s ease-in-out}.emoji-item-reacted{background:#ddf4ff}.emoji-counter{padding:0 4px;font-size:12px;border-radius:100px;background:red;height:24px;width:34px;line-height:24px;background:#fff;border:1px solid #d1d5db;cursor:pointer;color:#222}.emoji-counter:hover{background:#eaeef2}.emoji-counter-reacted{background:#ddf4ff;border:1px solid #0969da}.emoji-counter-reacted:hover{background:#b6e3ff}.emoji-item-disabled{cursor:not-allowed;opacity:.5} ');

(function (vue) {
  'use strict';

  function getSearchParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }
  const emojiMap = {
    THUMBS_UP: "👍",
    THUMBS_DOWN: "👎",
    LAUGH: "😄",
    HOORAY: "🎉",
    CONFUSED: "😕",
    HEART: "❤️",
    ROCKET: "🚀",
    EYES: "👀"
  };
  const serverDomin = "https://v2ex-reaction.vercel.app";
  const token = vue.ref("");
  const authURL = vue.ref("");
  const isAuth = vue.ref(false);
  function useAuth() {
    async function genAuthURL() {
      const href = window.location.href;
      const response = await fetch(`${serverDomin}/authorize?app_return_url=${href}`);
      const data = await response.text();
      authURL.value = data;
    }
    function setToken() {
      const emoji_token = getSearchParam("emoji-reaction-token") || localStorage.getItem("emoji-reaction-token");
      if (emoji_token) {
        localStorage.setItem("emoji-reaction-token", emoji_token);
        token.value = emoji_token;
        isAuth.value = true;
      }
    }
    setToken();
    return {
      genAuthURL,
      authURL,
      token,
      isAuth
    };
  }
  const reactions = vue.ref([]);
  const subjectId = vue.ref("");
  const filteredReactions = vue.computed(() => {
    return reactions.value.filter((reaction) => reaction.totalCount > 0);
  });
  const totalCount = vue.computed(() => {
    return filteredReactions.value.reduce((total, reaction) => {
      return total + reaction.totalCount;
    }, 0);
  });
  function useReaction() {
    const discussionUrl = vue.ref("");
    const loading = vue.ref(false);
    async function getReaction() {
      try {
        loading.value = true;
        const pathname = window.location.pathname;
        if (pathname.includes("review"))
          return;
        const token2 = localStorage.getItem("emoji-reaction-token");
        const url = new URL(`${serverDomin}/getDiscussion`);
        if (token2)
          url.searchParams.append("token", token2);
        if (pathname)
          url.searchParams.append("pathname", pathname);
        const response = await fetch(url.toString());
        const { data, state } = await response.json();
        if (state === "fail")
          throw new Error(data);
        const reactionNodes = data.search.nodes;
        if (!reactionNodes.length) {
          const createUrl = new URL(`${serverDomin}/createDiscussion`);
          if (pathname)
            createUrl.searchParams.append("pathname", pathname);
          const res = await fetch(createUrl);
          const createData = await res.json();
          if (createData.state === "ok") {
            setTimeout(() => {
              getReaction();
            }, 2e3);
          }
        } else {
          const reactionGroups = reactionNodes[0].reactionGroups;
          const discussionId = reactionNodes[0].id;
          const _discussionUrl = reactionNodes[0].url;
          subjectId.value = discussionId;
          discussionUrl.value = _discussionUrl;
          reactions.value = reactionGroups.map((reaction) => {
            return {
              content: reaction.content,
              totalCount: reaction.users.totalCount,
              viewerHasReacted: reaction.viewerHasReacted,
              emoji: emojiMap[reaction.content]
            };
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }
    const TOGGLE_REACTION_QUERY = (mode) => `
  mutation($content: ReactionContent!, $subjectId: ID!) {
    toggleReaction: ${mode}Reaction(input: {content: $content, subjectId: $subjectId}) {
      reaction {
        content
        id
      }
    }
  }`;
    async function clickReaction(isAuth2, content, token2, viewerHasReacted, cb) {
      try {
        if (!isAuth2)
          return;
        await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token2}`
          },
          body: JSON.stringify({
            query: TOGGLE_REACTION_QUERY(viewerHasReacted ? "remove" : "add"),
            variables: {
              subjectId: subjectId.value,
              content
            }
          })
        });
        await getReaction();
      } catch (error) {
        console.log(error);
      } finally {
        cb();
      }
    }
    return {
      reactions,
      getReaction,
      filteredReactions,
      totalCount,
      clickReaction,
      discussionUrl,
      loading
    };
  }
  const _hoisted_1$1 = { class: "emoji-list" };
  const _hoisted_2$1 = { class: "emoji-face-icon" };
  const _hoisted_3$1 = ["fill"];
  const _hoisted_4$1 = /* @__PURE__ */ vue.createElementVNode("path", { d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.022-.015c.02.013.021.015.021.015v.001l-.001.002-.002.003-.005.007-.014.019a2.066 2.066 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.331 3.331 0 0 1-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.25 2.25.592.416a97.71 97.71 0 0 0-.592-.416Z" }, null, -1);
  const _hoisted_5$1 = [
    _hoisted_4$1
  ];
  const _hoisted_6$1 = { class: "emoji-panel" };
  const _hoisted_7$1 = ["href"];
  const _hoisted_8$1 = /* @__PURE__ */ vue.createElementVNode("span", { style: { "font-size": "12px", "font-style": "italic", "color": "#94a3b8" } }, "以添加反应", -1);
  const _hoisted_9 = { class: "emoji-panel-list" };
  const _hoisted_10 = ["onClick"];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Menu",
    props: {
      reactions: {
        type: Array,
        required: true
      },
      color: {
        type: String,
        default: "#000"
      }
    },
    setup(__props) {
      const { clickReaction } = useReaction();
      const { token: token2, isAuth: isAuth2, authURL: authURL2 } = useAuth();
      const emojiPanelRef = vue.ref(null);
      const vClickOutside = {
        beforeMount(el, binding) {
          el.clickOutsideEvent = function(event) {
            if (!(el === event.target || el.contains(event.target)))
              binding.value(event);
          };
          document.addEventListener("mousedown", el.clickOutsideEvent);
        },
        beforeUnmount(el) {
          document.removeEventListener("mousedown", el.clickOutsideEvent);
        }
      };
      function handleClickOutside() {
        emojiPanelRef.value.open = false;
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("details", {
            ref_key: "emojiPanelRef",
            ref: emojiPanelRef,
            class: "emoji-menu"
          }, [
            vue.createElementVNode("summary", _hoisted_2$1, [
              (vue.openBlock(), vue.createElementBlock("svg", {
                "aria-hidden": "true",
                focusable: "false",
                role: "img",
                viewBox: "0 0 16 16",
                width: "16",
                height: "16",
                fill: __props.color,
                style: { "display": "inline-block", "user-select": "none", "vertical-align": "text-bottom", "overflow": "visible" }
              }, _hoisted_5$1, 8, _hoisted_3$1))
            ]),
            vue.createElementVNode("div", _hoisted_6$1, [
              !vue.unref(isAuth2) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createElementVNode("a", {
                  href: vue.unref(authURL2),
                  class: "emoji-panel-login"
                }, "登录", 8, _hoisted_7$1),
                _hoisted_8$1
              ], 64)) : vue.createCommentVNode("", true),
              vue.createElementVNode("div", _hoisted_9, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.reactions, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: index,
                    class: vue.normalizeClass([[
                      item.viewerHasReacted ? "emoji-item-reacted" : "",
                      vue.unref(isAuth2) ? "" : "emoji-item-disabled"
                    ], "emoji-item"]),
                    onClick: ($event) => vue.unref(clickReaction)(vue.unref(isAuth2), item.content, vue.unref(token2), item.viewerHasReacted, handleClickOutside)
                  }, vue.toDisplayString(item.emoji), 11, _hoisted_10);
                }), 128))
              ])
            ])
          ])), [
            [vClickOutside, handleClickOutside]
          ])
        ]);
      };
    }
  });
  const _hoisted_1 = { key: 0 };
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("img", {
    width: "50",
    style: { "margin-top": "1rem" },
    height: "50",
    src: "https://raw.githubusercontent.com/yuyinws/v2ex-reaction/main/source/loading.gif",
    alt: "loading",
    srcset: ""
  }, null, -1);
  const _hoisted_3 = [
    _hoisted_2
  ];
  const _hoisted_4 = { key: 1 };
  const _hoisted_5 = { class: "emoji-reaction" };
  const _hoisted_6 = ["href"];
  const _hoisted_7 = { class: "emoji-list" };
  const _hoisted_8 = ["onClick"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const {
        reactions: reactions2,
        getReaction,
        filteredReactions: filteredReactions2,
        totalCount: totalCount2,
        clickReaction,
        discussionUrl,
        loading
      } = useReaction();
      const { genAuthURL, isAuth: isAuth2, token: token2 } = useAuth();
      function init() {
        if (!isAuth2.value)
          genAuthURL();
        getReaction();
      }
      vue.onMounted(() => {
        init();
      });
      return (_ctx, _cache) => {
        return vue.unref(loading) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, _hoisted_3)) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
          vue.createElementVNode("div", _hoisted_5, [
            vue.createElementVNode("a", {
              class: "emoji-title",
              href: vue.unref(discussionUrl),
              target: "_blank"
            }, vue.toDisplayString(vue.unref(totalCount2)) + "个反应 ", 9, _hoisted_6),
            vue.createElementVNode("div", _hoisted_7, [
              vue.createVNode(_sfc_main$1, {
                reactions: vue.unref(reactions2),
                color: "#444"
              }, null, 8, ["reactions"]),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(filteredReactions2), (item, index) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: index,
                  class: vue.normalizeClass([[
                    item.viewerHasReacted ? "emoji-counter-reacted" : "",
                    vue.unref(isAuth2) ? "" : "emoji-item-disabled"
                  ], "emoji-counter"]),
                  onClick: ($event) => vue.unref(clickReaction)(vue.unref(isAuth2), item.content, vue.unref(token2), item.viewerHasReacted)
                }, vue.toDisplayString(item.emoji) + " " + vue.toDisplayString(item.totalCount), 11, _hoisted_8);
              }), 128))
            ])
          ])
        ]));
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const emojiApp = document.createElement("div");
      emojiApp.id = "emoji-reaction";
      const parentEL = document.querySelector("#Main > .box");
      const topicBtnEl = document.querySelector(".topic_buttons");
      parentEL.insertBefore(emojiApp, topicBtnEl);
      return emojiApp;
    })()
  );

})(Vue);
