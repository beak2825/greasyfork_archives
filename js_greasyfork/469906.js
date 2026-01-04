// ==UserScript==
// @name       GoogleMore
// @namespace  https://greasyfork.org/zh-CN/scripts/469906-googlemore
// @version    1.5.0
// @author     marumaru
// @icon       https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match      https://www.google.com/search?q*
// @match      https://www.google.com.hk/search?q*
// @require    https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_setValue
// @description 谷歌搜索快速跳转搜索其他网站
// @downloadURL https://update.greasyfork.org/scripts/469906/GoogleMore.user.js
// @updateURL https://update.greasyfork.org/scripts/469906/GoogleMore.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" *[data-v-1d2257bf]{box-sizing:border-box}.configContainer[data-v-1d2257bf]{display:flex;flex-direction:column;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;width:490px;padding:20px;border:1px solid #ccc;background-color:#fff;border-radius:8px}.configContainer .configItemBox[data-v-1d2257bf]{height:300px;overflow:auto}.configItem[data-v-1d2257bf]{width:100%;margin-bottom:10px}.configItem .input[data-v-1d2257bf]{margin-bottom:2px;width:100%;padding:8px;border:1px solid #ccc;border-radius:4px}.configItem button[data-v-1d2257bf]{width:120px;padding:4px;margin-top:10px;background-color:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;width:70px;margin-right:10px;margin-top:unset}.configItem button[data-v-1d2257bf]:hover{background-color:#0056b3}.btnBox[data-v-1d2257bf]{display:flex;justify-content:space-around;align-items:center;margin-top:10px}.btnBox button[data-v-1d2257bf]{width:120px;padding:4px;margin-top:10px;background-color:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer}.btnBox button[data-v-1d2257bf]:hover{background-color:#0056b3} ");

(function (vue) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "configContainer" };
  const _hoisted_2 = { class: "configItemBox" };
  const _hoisted_3 = ["onUpdate:modelValue"];
  const _hoisted_4 = ["onUpdate:modelValue"];
  const _hoisted_5 = ["onClick"];
  const _hoisted_6 = ["onClick"];
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const defaultConfig = [
        { name: "百度", url: "https://www.baidu.com/s?wd=" },
        { name: "豆瓣", url: "https://www.douban.com/search?source=suggest&q=" },
        { name: "知乎", url: "https://www.zhihu.com/search?type=content&q=" },
        { name: "必应", url: "https://www.bing.com/search?cc=sg&q=" },
        { name: "V2EX", url: "https://www.google.com/search?q=site:v2ex.com/t%20" },
        { name: "哔哩哔哩", url: "https://search.bilibili.com/all?keyword=" },
        { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
        { name: "淘宝", url: "https://s.taobao.com/search?commend=all&ie=utf8&initiative_id=tbindexz_20170306&q=" }
      ];
      const getWebMenuItem = () => {
        const bar = document.querySelector('[data-st-cnt="mode"]');
        let imageElementAll = bar.querySelectorAll("a");
        return imageElementAll;
      };
      const addMenuElementListener = (element) => {
        element.addEventListener("mouseenter", function(event) {
          var inputElement = document.querySelector("#APjFqb");
          var keyword = encodeURIComponent(inputElement.value);
          var url = event.target.href;
          var lastEqualSign = url.lastIndexOf("=");
          var result;
          if (url.includes("q=site:v2ex")) {
            result = "https://www.google.com/search?q=site:v2ex.com/t%20";
          } else {
            result = url.substring(0, lastEqualSign + 1);
          }
          event.target.href = result + keyword;
        });
      };
      const createLinkElement = (item, cloneObj, elementType = "a") => {
        var copiedElement = cloneObj.cloneNode(true);
        let aElement;
        if (copiedElement.tagName.toLowerCase() === "a") {
          aElement = copiedElement;
        } else {
          aElement = copiedElement.querySelector("a");
        }
        aElement.href = item.url;
        aElement.target = "_blank";
        if (item.url === "edit") {
          aElement.href = "javascript:void(0)";
        }
        function getDeepestChild(element) {
          if (element.children.length === 0) {
            return element;
          }
          return getDeepestChild(element.children[0]);
        }
        const deepChild = getDeepestChild(copiedElement);
        deepChild.innerText = item.name;
        copiedElement.style.cssText = "margin-right:5px";
        return copiedElement;
      };
      const setBar1Menu = () => {
        const imageElement = getWebMenuItem()[1];
        const parentElement1 = imageElement.parentNode.parentNode;
        for (var i = 0; i < customCofig.value.length; i++) {
          var item = customCofig.value[i];
          const newElement2 = createLinkElement(item, imageElement);
          addMenuElementListener(newElement2);
          parentElement1.insertBefore(newElement2, imageElement.parentNode);
        }
        const editButton = createLinkElement({ url: "edit", name: "编辑" }, imageElement, "button");
        editButton.addEventListener("click", toggleDialog);
        parentElement1.append(editButton);
      };
      const customCofig = vue.ref([]);
      vue.onMounted(() => {
        var navigation = document.querySelector('[role="navigation"]');
        navigation.style.width = "calc(var(--center-width) + var(--rhs-margin) + var(--rhs-width) + -170px)";
        customCofig.value = _GM_getValue("data") || defaultConfig;
        setBar1Menu();
      });
      const dialogVisible = vue.ref(false);
      const toggleDialog = () => {
        dialogVisible.value = !dialogVisible.value;
      };
      const confirm = () => {
        _GM_setValue("data", customCofig.value);
        location.reload();
      };
      const reset = () => {
        _GM_setValue("data", defaultConfig);
        location.reload();
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(customCofig.value, (config, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: index,
                class: "configItem"
              }, [
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": ($event) => config.name = $event,
                  class: "input",
                  placeholder: "Name"
                }, null, 8, _hoisted_3), [
                  [vue.vModelText, config.name]
                ]),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": ($event) => config.url = $event,
                  class: "input",
                  placeholder: "URL"
                }, null, 8, _hoisted_4), [
                  [vue.vModelText, config.url]
                ]),
                vue.createElementVNode("button", {
                  onClick: ($event) => customCofig.value.splice(index, 1)
                }, "删除", 8, _hoisted_5),
                vue.createElementVNode("button", {
                  onClick: ($event) => customCofig.value.splice(index, 0, config)
                }, "插入", 8, _hoisted_6)
              ]);
            }), 128))
          ]),
          vue.createElementVNode("div", { class: "btnBox" }, [
            vue.createElementVNode("button", { onClick: confirm }, "确认"),
            vue.createElementVNode("button", { onClick: reset }, "重置")
          ])
        ], 512)), [
          [vue.vShow, dialogVisible.value]
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1d2257bf"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);