// ==UserScript==
// @name         文章导出成pdf
// @namespace    https://github.com/Vanisper/web-article-to-pdf
// @version      1.3.2
// @author       Vanisper
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @defaulticon  将一些主流的网站的文章，去除掉一些无关部分直接启动浏览器自带打印功能
// @match        https://www.bilibili.com/read/cv*
// @match        https://www.cnblogs.com/*/p/*
// @match        https://www.cnblogs.com/*/archive/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.jianshu.com/p/*
// @match        https://juejin.cn/post/*
// @match        https://segmentfault.com/a/*
// @match        https://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/s?*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://www.zhihu.com/question/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @description 将一些主流的网站的文章，去除掉一些无关部分直接启动浏览器自带打印功能
// @downloadURL https://update.greasyfork.org/scripts/462793/%E6%96%87%E7%AB%A0%E5%AF%BC%E5%87%BA%E6%88%90pdf.user.js
// @updateURL https://update.greasyfork.org/scripts/462793/%E6%96%87%E7%AB%A0%E5%AF%BC%E5%87%BA%E6%88%90pdf.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" *{padding:0;margin:0}button[data-v-13bc6f6b]{font-weight:700;color:#fff;border-radius:2rem;width:95.02px;height:42.66px;border:none;background-color:#3653f8;display:flex;justify-content:center;align-items:center}button .span-mother[data-v-13bc6f6b]{display:flex;overflow:hidden}button .span-mother span[data-v-13bc6f6b]{display:flex;justify-content:center;align-items:center}button .span-mother2[data-v-13bc6f6b]{display:flex;position:absolute;overflow:hidden}button .span-mother2 span[data-v-13bc6f6b]{transform:translateY(-1.2em);display:flex;justify-content:center;align-items:center}button:hover .span-mother[data-v-13bc6f6b]{position:absolute}button:hover .span-mother span[data-v-13bc6f6b]{transform:translateY(1.2em)}button:hover .span-mother2 span[data-v-13bc6f6b]{transform:translateY(0)}@keyframes spin-19ff1008{to{transform:rotate(360deg)}}#loading[data-v-19ff1008]{position:fixed;display:flex;top:0;left:0;width:100%;height:100%;background-color:#8ae79d82;z-index:9999}#loading .spinner[data-v-19ff1008]{margin:auto;width:40px;height:40px;border-radius:50%;border:3px solid transparent;border-top-color:#fff;animation:spin-19ff1008 .8s ease infinite}.setpdf[data-v-af70e9ff]{position:fixed;top:100px;right:24px;box-sizing:border-box;cursor:pointer;user-select:none;transition:opacity .2s ease .1s;z-index:9998} ");

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class useDraggable {
    // dom初始top
    constructor(element) {
      __publicField(this, "draggableElement");
      __publicField(this, "isDragging");
      __publicField(this, "isDraggable");
      __publicField(this, "startPosition");
      __publicField(this, "currentX");
      // dom初始left
      __publicField(this, "currentY");
      __publicField(this, "startDragging", (event) => {
        const elementRect = this.draggableElement.getBoundingClientRect();
        this.startPosition = { x: elementRect.x, y: elementRect.y };
        this.currentX = elementRect.left;
        this.currentY = elementRect.top;
        this.isDragging = true;
        this.startPosition = {
          x: event.clientX,
          y: event.clientY
        };
        window.addEventListener("mousemove", this.dragging);
        window.addEventListener("mouseup", this.stopDragging);
      });
      __publicField(this, "dragging", (event) => {
        if (this.isDragging && this.draggableElement) {
          const maxLeft = document.documentElement.clientWidth - this.draggableElement.offsetWidth;
          const maxTop = document.documentElement.clientHeight - this.draggableElement.offsetHeight;
          const offsetX = event.clientX - this.startPosition.x;
          const offsetY = event.clientY - this.startPosition.y;
          let left = this.currentX + offsetX;
          let top = this.currentY + offsetY;
          if (offsetX < 0) {
            left = Math.max(0, left);
          } else {
            left = Math.min(maxLeft, left);
          }
          if (offsetY < 0) {
            top = Math.max(0, top);
          } else {
            top = Math.min(maxTop, top);
          }
          this.draggableElement.style.position = "fixed";
          this.draggableElement.style.top = top + "px";
          this.draggableElement.style.left = left + "px";
        }
      });
      __publicField(this, "stopDragging", (event) => {
        this.isDragging = false;
        window.removeEventListener("mousemove", this.dragging, false);
        window.removeEventListener("mouseup", this.stopDragging, false);
      });
      __publicField(this, "resetPosition", () => {
        const elementRect = this.draggableElement.getBoundingClientRect();
        this.draggableElement.style.position = "fixed";
        if (window.innerWidth < elementRect.right) {
          this.draggableElement.style.left = window.innerWidth - elementRect.width + "px";
        }
        if (window.innerHeight < elementRect.bottom) {
          this.draggableElement.style.top = window.innerHeight - elementRect.height + "px";
        }
        if (elementRect.top < 0) {
          this.draggableElement.style.top = "0px";
        }
      });
      this.draggableElement = element;
      this.isDraggable = element.getAttribute("draggable") === "true" || element.getAttribute("draggable") === "" ? true : false;
      this.isDragging = false;
      const elementRect = element.getBoundingClientRect();
      this.startPosition = { x: elementRect.x, y: elementRect.y };
      this.currentX = elementRect.left;
      this.currentY = elementRect.top;
      this.init();
    }
    init() {
      var _a;
      this.unDraggable();
      const elementRect = this.draggableElement.getBoundingClientRect();
      this.draggableElement.style.position = "fixed";
      this.draggableElement.style.left = elementRect.left + "px";
      this.draggableElement.style.top = elementRect.top + "px";
      this.draggableElement.style.right = "unset";
      window.addEventListener("resize", this.resetPosition);
      (_a = this.draggableElement) == null ? void 0 : _a.addEventListener("mousedown", this.startDragging);
    }
    draggable() {
      var _a;
      (_a = this.draggableElement) == null ? void 0 : _a.setAttribute("draggable", "true");
      this.isDraggable = true;
    }
    unDraggable() {
      var _a;
      (_a = this.draggableElement) == null ? void 0 : _a.setAttribute("draggable", "false");
      this.isDraggable = false;
    }
    preventDefault(event) {
      event.preventDefault();
    }
    destroy() {
      var _a;
      (_a = this.draggableElement) == null ? void 0 : _a.removeEventListener("mousedown", this.startDragging);
      window.removeEventListener("resize", this.resetPosition);
    }
  }
  const _hoisted_1$1 = { class: "span-mother" };
  const _hoisted_2$1 = { class: "span-mother2" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "button1",
    props: {
      text: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      vue.ref(props.text.length);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("button", null, [
          vue.createElementVNode("span", _hoisted_1$1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.text, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: item,
                style: vue.normalizeStyle({ transition: `${0.1 * index + 0.1}s` })
              }, vue.toDisplayString(item), 5);
            }), 128))
          ]),
          vue.createElementVNode("span", _hoisted_2$1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.text, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("span", {
                key: item,
                style: vue.normalizeStyle({ transition: `${0.1 * index + 0.1}s` })
              }, vue.toDisplayString(item), 5);
            }), 128))
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
  const button1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-13bc6f6b"]]);
  const _sfc_main$1 = {};
  const _withScopeId = (n) => (vue.pushScopeId("data-v-19ff1008"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { id: "loading" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "spinner" }, null, -1));
  const _hoisted_3 = [
    _hoisted_2
  ];
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, _hoisted_3);
  }
  const loading1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-19ff1008"]]);
  const bilibiliRules = [{
    url: "https?://www.bilibili.com/read/cv\\w+",
    name: "bilibili",
    class: "#bili-header-container, div.article-breadcrumb, div.right-side-bar.on.is-mini-page, #comment-wrapper, div.fixed-top-header,#readRecommendInfo, div.interaction-info",
    style: `@media print {
            #app > div > div.article-container {}
    }`
  }];
  const cnblogsRules = [
    {
      url: "https?://www\\.cnblogs\\.com/\\w+/(p|archive)/\\w+",
      name: "cnblogs",
      class: "#top_nav, #header, #sideBar,#blog_post_info,#post_next_prev,#topics > div > div.postDesc,#comment_form,#footer,#top_nav,#header,#mylinks,#mytopmenu,body > div.footer,#leftcontent,#blog_post_info_block,#comment_form",
      style: `@media print {
                #main {
                    display: flex !important;
            }
                #mainContent {
                    max-width: 1080px!important;
                    min-width: 720px!important;
                    width: 100%!important;
            }
                #post_detail {
                    display: flex !important;
                    justify-content: center;
            }
        }`
    }
  ];
  const csdnRules = [
    {
      url: "https?://blog\\.csdn\\.net/\\w+/article/details/\\w+",
      name: "csdn",
      class: "#mainBox > aside, #toolbarBox #csdn-toolbar, body > div:nth-child(49) > div, #toolBarBox, #mainBox > main > div.recommend-box, #recommendNps, #copyright-box, #treeSkill > div, .csdn-side-toolbar, .left-toolbox",
      style: `
        @media print {
            #mainBox > main > div.blog-content-box {
                position: absolute; top: 0; left: 0; max-width: 1080px; z-index: 999;
            }
            main div.blog-content-box pre.set-code-hide {
                height: auto; overflow-y: auto;
            }
            main div.blog-content-box pre.set-code-hide .hide-preCode-box {
                display: none;
            }
            #article_content .markdown_views pre.prettyprint * {
                white-space: pre-wrap; word-break: break-word; word-wrap: normal;
            }
            #toolBarBox, #csdn-toolbar, .recommend-right, .recommend-right1, .blog_container_aside {
                display: none !important;
            }
        }`,
      copyrightTarget: ".blog-content-box"
    }
  ];
  const jianshuRules = [{
    url: "https?://www.jianshu.com/p/\\w+",
    name: "jianshu",
    class: "#__next > header, #__next aside,#__next > div._3Pnjry, #__next > footer, #__next > div > div > div._gp-ck > section:nth-child(1) > div._13lIbp, #__next > div > div > div._gp-ck > section:nth-child(2), #__next > div._21bLU4._3kbg6I > div > div._gp-ck > section:nth-child(5),#note-page-comment",
    style: `@media print {
            #__next > div._21bLU4._3kbg6I > div > div._gp-ck > section:nth-child(1) {
                position: absolute; top: 0; left: 0;z-index: 999;
                max-width: 1080px;
                min-width: 1080px;
                width: 1080px;
        }
    }`
  }];
  const juejinRules = [
    {
      url: "https?://juejin.cn/post/\\w+",
      name: "juejin",
      class: "#juejin > div.view-container > div, #juejin > div.view-container > main > div > div.article-suspended-panel.dynamic-data-ready,#juejin > div.view-container > main > div > div.main-area.article-area > div.wrap.category-course-recommend,#comment-box,#juejin > div.view-container > main > div > div.main-area.recommended-area.shadow,#juejin > div.view-container > main > div > div.recommended-links.main-area,#juejin > div.view-container > main > div > div.sidebar.sidebar,#juejin > div.global-component-box, #juejin > div.view-container > main > div > div.main-area.article-area > div.article-end > div.column-container,#juejin > div.view-container > main > div > div.main-area.article-area > div.article-end > div.extension-banner,#juejin > div.recommend-box,#juejin > div.view-container > main > div > div.main-area.article-area > div.action-box.action-bar",
      style: `@media print {
                article {
                    position: absolute; top: 0; left: 0;z-index: 999;
                    max-width: 1080px;
                    min-width: 1080px;
                    width: 1080px;
            }
        }`
    }
  ];
  const segmentfaultRules = [
    {
      url: "https?://segmentfault.com/a/\\w+",
      name: "segmentfault",
      class: ".fix-bottom-action-wrap, nav, .right-side, .sticky-wrap, #comment-area, div.article-content div.card.mt-4",
      style: `@media print {
                .fmt pre {max-height: unset !important;
            }
        }`,
      copyright: ""
    }
  ];
  const weixinRules = [
    {
      url: "https?://mp.weixin.qq.com/s(\\?|/)\\w+",
      name: "weixin",
      class: "#js_base_container > div.rich_media_area_extra, #js_pc_qr_code",
      style: `@media print {}`
    }
  ];
  const zhihuRules = [
    {
      url: "https?://zhuanlan.zhihu.com/p/\\w+",
      name: "zhihu",
      class: ".Catalog, .ColumnPageHeader-Wrapper, .RichContent-actions, .RichContent-actions, .Post-NormalSub, .Post-SideActions, .complementary, .CornerAnimayedFlex",
      style: `@media print {
                article > div, article > header {
                    max-width: 1080px;
                    min-width: 1080px;
                    width: 1080px;
            }
        }`
    },
    // 知乎提问板块-指定某个回答
    {
      url: "https?://www.zhihu.com/question/\\d+/answer/\\d+",
      name: "zhihu",
      class: ".AppHeader, .Question-sideColumn, .ContentItem-actions, .CornerButtons, .MoreAnswers, .ViewAll",
      style: `
        @media print {
            .ListShortcut{
                width: 100%;
            }
            .Question-mainColumn {
                width: 100%;
            }
        }`
    },
    {
      url: "https?://www.zhihu.com/question/\\d+",
      name: "zhihu",
      class: ".AppHeader, .Question-sideColumn, .ContentItem-actions, .CornerButtons, .MoreAnswers, .ViewAll",
      style: `
        @media print {
            .ListShortcut{
                width: 100%;
            }
            .Question-mainColumn {
                width: 100%;
            }
        }`,
      hideDefault: true,
      javascript: () => {
        var _a;
        const listItem = (_a = document.querySelector(".AnswersNavWrapper")) == null ? void 0 : _a.querySelectorAll(".List-item");
        if (!listItem)
          return false;
        const printItem = (doc, url) => {
          if (!doc)
            return false;
          window.open(
            url,
            "_blank",
            "width=1080,height=800,menubar=yes,scrollbars=yes,resizable=yes"
          );
        };
        listItem.forEach((item, index) => {
          var _a2, _b;
          const box = item.querySelector(".AnswerItem-authorInfo");
          const name = (_b = (_a2 = item.querySelector(".AnswerItem")) == null ? void 0 : _a2.attributes.getNamedItem("name")) == null ? void 0 : _b.value;
          if (!box || !name)
            return false;
          const printBtn = document.createElement("button");
          printBtn.innerHTML = "打印当前回答";
          printBtn.className = "print-btn_" + index;
          const url = window.location.href + `/answer/${name}`;
          printBtn.onclick = () => {
            printItem(item, url);
          };
          box.append(printBtn);
        });
      }
    }
  ];
  const rules = [
    ...bilibiliRules,
    ...cnblogsRules,
    ...csdnRules,
    ...jianshuRules,
    ...juejinRules,
    ...segmentfaultRules,
    ...weixinRules,
    ...zhihuRules
  ];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const dragDomRef = vue.ref();
      let draggableInstance;
      const isShow = vue.ref(false);
      function preventDefault(e) {
        e.preventDefault();
      }
      const action = () => {
        stopScroll.value = false;
        isShow.value = true;
        window.addEventListener("wheel", preventDefault, { passive: false });
        window.scrollTo(0, 0);
        smoothScrollToBottom();
      };
      const stopScroll = vue.ref(false);
      const stop = () => {
        stopScroll.value = true;
      };
      function smoothScrollToBottom() {
        var scrollHeight = document.body.scrollHeight;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (stopScroll.value) {
          isShow.value = false;
          window.removeEventListener("wheel", preventDefault);
          return;
        }
        if (scrollTop + clientHeight >= scrollHeight) {
          isShow.value = false;
          window.removeEventListener("wheel", preventDefault);
          setTimeout(() => {
            window.print();
          }, 200);
          return;
        } else {
          window.scrollTo({
            top: scrollTop + clientHeight,
            behavior: "auto"
            // 可以设置成光滑的
          });
          setTimeout(smoothScrollToBottom, 1e3);
        }
      }
      const currentUrl = window.location.href;
      let curr = {
        url: "",
        name: "",
        class: "",
        style: "",
        /** 版权信息将插入的css选择器 */
        target: "body"
      };
      const flag = vue.ref(false);
      vue.onMounted(() => {
        flag.value = rules.some((e) => {
          var reg = new RegExp(e.url);
          if (reg.test(currentUrl)) {
            curr.url = currentUrl;
            curr.name = e.name;
            curr.class = e.class;
            curr.style = e.style;
            curr.target = e.copyrightTarget || "body";
            curr.js = e.javascript;
            curr.hideDefault = e.hideDefault;
            return true;
          }
        });
        if (flag.value) {
          var style2 = document.createElement("style");
          style2.innerHTML = `@media print {${curr.class}, .mod, button.setpdf, .web-article-to-pdf { display: none!important;} div.setpdf-copyright { display: block!important; }} ${curr.style}`;
          document.head.appendChild(style2);
          const target = document.querySelector(curr.target);
          const copyright = document.createElement("div");
          copyright.setAttribute("style", "display:none");
          copyright.setAttribute("class", "setpdf-copyright");
          copyright.appendChild(document.createTextNode("来源："));
          const link = document.createElement("a");
          link.textContent = currentUrl;
          link.setAttribute("href", currentUrl);
          copyright.appendChild(link);
          target.appendChild(copyright);
          setTimeout(() => {
            draggableInstance = new useDraggable(dragDomRef.value.$el);
            curr.js && (() => {
              curr.js();
            })();
          }, 200);
          curr.hideDefault && (flag.value = false);
        }
      });
      vue.onUnmounted(() => {
        draggableInstance.destroy();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.withDirectives(vue.createVNode(button1, {
            onClick: action,
            class: "setpdf",
            text: "导出PDF",
            draggable: "true",
            ref_key: "dragDomRef",
            ref: dragDomRef
          }, null, 512), [
            [vue.vShow, flag.value]
          ]),
          vue.withDirectives(vue.createVNode(loading1, { onDblclick: stop }, null, 512), [
            [vue.vShow, flag.value && isShow.value]
          ])
        ], 64);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-af70e9ff"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      app.classList.add("web-article-to-pdf");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);
