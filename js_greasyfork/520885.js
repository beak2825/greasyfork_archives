// ==UserScript==
// @name         MC百科 - 便捷工具
// @namespace    https://github.com/ifover/UserScript
// @version      0.4
// @author       ifover
// @description  在MC百科首页显示收藏列表，方便导航
// @license      GPL-3.0 License
// @icon         https://www.mcmod.cn/images/favicon.ico
// @match        https://*.mcmod.cn/*
// @require      https://kit.fontawesome.com/d4dda3d6cc.js
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @require      https://unpkg.com/vue-demi@latest/lib/index.iife.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/pinia@2.3.0/dist/pinia.iife.prod.js
// @require      https://unpkg.com/naive-ui@2.40.4/dist/index.prod.js
// @connect      center.mcmod.cn
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520885/MC%E7%99%BE%E7%A7%91%20-%20%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520885/MC%E7%99%BE%E7%A7%91%20-%20%E4%BE%BF%E6%8D%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const a=document.createElement("style");a.textContent=e,document.head.append(a)})(" div,a,ul,li{color:unset}.ooops{z-index:1}.mcver>ul>ul{display:block!important}.n-message-container{z-index:10000}#mm-main{cursor:default;font-size:12px}.mm-more:hover,.mm-close:hover{cursor:pointer;color:#00a0d8}.mm-sidebar[data-v-011f4e02]{display:flex;flex-direction:column;gap:12px;position:fixed;left:0;top:286px;z-index:10;transform:translate(-60%)}.mm-sidebar .mm-btn[data-v-011f4e02]{height:42px;transition:.3s ease-out}.mm-sidebar .mm-btn[data-v-011f4e02]:hover{transform:translate(60%)}.mm-sidebar .mm-btn.disabled[data-v-011f4e02]{cursor:not-allowed;color:#999;opacity:.6}.mm-sidebar .mm-icon[data-v-011f4e02]{display:flex;align-items:center;justify-content:center}.mm-sidebar .mm-icon.mm-fav[data-v-011f4e02]{font-size:26px;color:#ccc}.mm-manage[data-v-8a18aa94]{cursor:default;width:420px;background-color:#fff;border-radius:5px}.mm-manage .mm-manage-header[data-v-8a18aa94]{display:flex;align-items:center;padding:10px 15px;border-bottom:1px solid #88888822}.mm-manage .mm-manage-header .mm-manage-header-title[data-v-8a18aa94]{font-size:16px;font-weight:600}.mm-manage .mm-manage-header .mm-close[data-v-8a18aa94]{margin-left:auto}.mm-manage .mm-manage-content[data-v-8a18aa94]{padding:10px 15px}.mm-manage .mm-manage-content .mm-description[data-v-8a18aa94]{display:flex;gap:8px;margin-bottom:8px}.mm-manage .mm-manage-content .mm-description>div[data-v-8a18aa94]{background-color:#33333320;padding:0 6px;border-radius:4px}.mm-manage .mm-manage-content .mm-icon-group[data-v-8a18aa94]{display:flex;gap:12px;align-items:center;justify-content:center}.mm-manage .mm-manage-content .mm-icon-group .mm-action-icon[data-v-8a18aa94]{cursor:pointer;color:#666;transition:color .2s ease}.mm-manage .mm-manage-content .mm-icon-group .mm-action-icon[data-v-8a18aa94]:hover:not(.disabled){color:#18a058}.mm-manage .mm-manage-content .mm-icon-group .mm-action-icon.disabled[data-v-8a18aa94]{cursor:not-allowed;color:#999;opacity:.6}#mm-favorites[data-v-b88b14de]{width:320px;max-height:calc(100vh - 70px);overflow:hidden;background-color:#fff;box-shadow:0 4px 12px #0000000d;border-radius:4px;position:fixed;top:60px;left:10px;z-index:11}#mm-favorites .mm-panel-header[data-v-b88b14de]{height:46px;display:flex;align-items:center;box-sizing:border-box;gap:8px;border-bottom:1px solid rgba(136,136,136,.133);padding:8px 12px;color:#000;fill:#000}#mm-favorites .mm-panel-header .mm-header-title[data-v-b88b14de]{font-size:18px;font-weight:600}#mm-favorites .mm-panel-header .mm-more[data-v-b88b14de]{margin-left:auto}#mm-favorites .mm-panel-content[data-v-b88b14de]{padding:6px 12px}#mm-favorites .mm-panel-content .mm-empty[data-v-b88b14de]{text-align:center}[data-v-b88b14de] .n-tree .n-tree-node-switcher.n-tree-node-switcher--expanded{transform:none}[data-v-b88b14de] .n-tree .n-tree-node-wrapper:has(.mm-fav-label-lv1){position:sticky;top:0;z-index:1;background-color:#fff}[data-v-b88b14de] .n-tree .n-tree-node-wrapper:has(.mm-fav-label-lv1):has(.n-tree-node-switcher--hide){top:30px}[data-v-b88b14de] .n-tree a{text-decoration:none}[data-v-b88b14de] .n-tree a:hover *{color:#2575f9}[data-v-b88b14de] .n-tree .mm-fav-label-icon{font-size:12px;margin-left:8px;color:#888}[data-v-b88b14de] .n-tree .mm-fav-list{display:flex;align-items:center;padding:2px 0;cursor:pointer}[data-v-b88b14de] .n-tree .mm-fav-list .mm-fav-cover{width:60px;opacity:.77;margin-right:6px}[data-v-b88b14de] .n-tree .mm-fav-list .mm-fav-label{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}#mm-setting[data-v-7cfc0576]{width:320px;max-height:calc(100vh - 70px);overflow:hidden;background-color:#fff;box-shadow:0 4px 12px #0000000d;border-radius:4px;position:fixed;top:60px;left:10px;z-index:11}#mm-setting .mm-panel-header[data-v-7cfc0576]{height:46px;display:flex;align-items:center;box-sizing:border-box;gap:8px;border-bottom:1px solid rgba(136,136,136,.133);padding:8px 12px;color:#000;fill:#000}#mm-setting .mm-panel-header .mm-header-title[data-v-7cfc0576]{font-size:18px;font-weight:600}#mm-setting .mm-panel-header .mm-close[data-v-7cfc0576]{margin-left:auto}#mm-setting .mm-panel-content[data-v-7cfc0576]{padding:6px 12px}#mm-setting .mm-panel-content .mm-setting-content[data-v-7cfc0576]{display:flex;justify-content:space-between;align-items:center}#mm-setting .mm-panel-content .mm-setting-content-title[data-v-7cfc0576]{font-size:14px}#mm-setting .mm-panel-content .mm-setting-content-value[data-v-7cfc0576]{width:120px} ");

(function (vue, pinia$1, naiveUi) {
  'use strict';

  const useMMStore = pinia$1.defineStore("mm", {
    state: () => ({
      userID: "0000",
      favoriteData: [],
      showFavorite: false,
      showSettings: false
    }),
    actions: {
      setUserID(id) {
        this.userID = id;
      },
      setFavoriteData(data) {
        this.favoriteData = data;
      },
      setPanelShow(data, b) {
        this[data] = b;
      }
    }
  });
  const _hoisted_1$3 = { class: "mm-sidebar" };
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "MSidebar",
    setup(__props) {
      const mmStore = useMMStore();
      const handleOpen = (d) => {
        mmStore.$patch({
          showFavorite: false,
          showSettings: false
        });
        mmStore.setPanelShow(d, true);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createVNode(vue.unref(naiveUi.NFloatButton), {
            class: vue.normalizeClass(["mm-btn", { disabled: vue.unref(mmStore).showFavorite }]),
            width: "42",
            position: "relative",
            right: 0,
            bottom: 0,
            onClick: _cache[0] || (_cache[0] = ($event) => handleOpen("showFavorite"))
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(naiveUi.NIcon), { size: "26" }, {
                default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                  vue.createElementVNode("i", { class: "fa-solid fa-heart" }, null, -1)
                ])),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["class"]),
          vue.createVNode(vue.unref(naiveUi.NFloatButton), {
            class: vue.normalizeClass(["mm-btn", { disabled: vue.unref(mmStore).showSettings }]),
            width: "42",
            position: "relative",
            right: 0,
            bottom: 0,
            onClick: _cache[1] || (_cache[1] = ($event) => handleOpen("showSettings"))
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(naiveUi.NIcon), { size: "26" }, {
                default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                  vue.createElementVNode("i", { class: "fa-solid fa-gear" }, null, -1)
                ])),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["class"])
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
  const MSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-011f4e02"]]);
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const _hoisted_1$2 = { class: "mm-manage" };
  const _hoisted_2$2 = { class: "mm-manage-header" };
  const _hoisted_3$2 = { class: "mm-manage-content" };
  const _hoisted_4$2 = { class: "mm-description" };
  const _hoisted_5 = { style: { "text-align": "center" } };
  const _hoisted_6 = { class: "mm-icon-group" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "MManage",
    props: {
      showModal: {
        type: Boolean,
        default: false
      }
    },
    emits: ["emitClose"],
    setup(__props, { emit: __emit }) {
      const mmStore = useMMStore();
      let tableData = vue.reactive([]);
      const props = __props;
      const emits = __emit;
      vue.watch(() => mmStore.favoriteData, (newV, oldV) => {
        tableData = [...newV];
      }, { deep: true });
      const handleClose = () => {
        emits("emitClose", false);
      };
      const toggleHidden = (item) => {
        item.folderHidden = !item.folderHidden;
        if (item.folderHidden) {
          item.folderExpand = false;
        }
        let gmFavList = _GM_getValue("favList");
        if (gmFavList) {
          let arr = gmFavList.map((o) => {
            if (item.favID === o.favID) {
              return {
                ...o,
                folderHidden: item.folderHidden,
                folderExpand: item.folderHidden && false
              };
            }
            return o;
          });
          _GM_setValue("favList", arr);
        }
      };
      const toggleExpand = (item) => {
        item.folderExpand = !item.folderExpand;
        let gmFavList = _GM_getValue("favList");
        if (gmFavList) {
          let arr = gmFavList.map((o) => {
            if (item.favID === o.favID) {
              return {
                ...o,
                folderExpand: item.folderExpand
              };
            }
            return o;
          });
          _GM_setValue("favList", arr);
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(naiveUi.NModal), {
          show: props.showModal
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1$2, [
              vue.createElementVNode("div", _hoisted_2$2, [
                _cache[1] || (_cache[1] = vue.createElementVNode("div", { class: "mm-manage-header-title" }, "收藏夹管理", -1)),
                vue.createVNode(vue.unref(naiveUi.NIcon), {
                  class: "mm-close",
                  size: "18",
                  title: "关闭",
                  onClick: handleClose
                }, {
                  default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                    vue.createElementVNode("i", { class: "fa-solid fa-xmark" }, null, -1)
                  ])),
                  _: 1
                })
              ]),
              vue.createElementVNode("div", _hoisted_3$2, [
                vue.createElementVNode("div", _hoisted_4$2, [
                  _cache[6] || (_cache[6] = vue.createTextVNode(" Tips: ")),
                  vue.createElementVNode("div", null, [
                    vue.createVNode(vue.unref(naiveUi.NIcon), { style: { "margin-right": "3px" } }, {
                      default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                        vue.createElementVNode("i", { class: "fa-solid fa-eye-slash" }, null, -1)
                      ])),
                      _: 1
                    }),
                    _cache[3] || (_cache[3] = vue.createTextVNode(" 隐藏 "))
                  ]),
                  vue.createElementVNode("div", null, [
                    vue.createVNode(vue.unref(naiveUi.NIcon), { style: { "margin-right": "3px" } }, {
                      default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                        vue.createElementVNode("i", { class: "fas fa-folder-open" }, null, -1)
                      ])),
                      _: 1
                    }),
                    _cache[5] || (_cache[5] = vue.createTextVNode(" 自动展开 "))
                  ])
                ]),
                vue.createVNode(vue.unref(naiveUi.NTable), {
                  bordered: true,
                  "single-line": false
                }, {
                  default: vue.withCtx(() => [
                    _cache[7] || (_cache[7] = vue.createElementVNode("thead", null, [
                      vue.createElementVNode("tr", null, [
                        vue.createElementVNode("th", null, "收藏夹名"),
                        vue.createElementVNode("th", { style: { "width": "80px", "text-align": "center" } }, "操作")
                      ])
                    ], -1)),
                    vue.createElementVNode("tbody", null, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(tableData), (i, k) => {
                        return vue.openBlock(), vue.createElementBlock("tr", { key: k }, [
                          vue.createElementVNode("td", null, vue.toDisplayString(i.favName), 1),
                          vue.createElementVNode("td", _hoisted_5, [
                            vue.createElementVNode("div", _hoisted_6, [
                              vue.createVNode(vue.unref(naiveUi.NIcon), {
                                class: "mm-action-icon",
                                onClick: ($event) => toggleHidden(i)
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createElementVNode("i", {
                                    class: vue.normalizeClass(["fa-solid", i.folderHidden ? "fa-eye-slash" : "fa-eye"])
                                  }, null, 2)
                                ]),
                                _: 2
                              }, 1032, ["onClick"]),
                              vue.createVNode(vue.unref(naiveUi.NIcon), {
                                class: vue.normalizeClass(["mm-action-icon", { disabled: i.folderHidden }]),
                                title: i.folderHidden ? "隐藏时自动展开禁用" : "",
                                onClick: ($event) => i.folderHidden ? null : toggleExpand(i)
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createElementVNode("i", {
                                    class: vue.normalizeClass(["fas", i.folderExpand ? "fa-folder-open" : "fa-folder"])
                                  }, null, 2)
                                ]),
                                _: 2
                              }, 1032, ["class", "title", "onClick"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ])
                  ]),
                  _: 1
                })
              ])
            ])
          ]),
          _: 1
        }, 8, ["show"]);
      };
    }
  });
  const MManage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8a18aa94"]]);
  const json2FormData = (json) => {
    return Object.keys(json).map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    }).join("&");
  };
  const request = (url, data) => {
    const userStore = useMMStore();
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "POST",
        url,
        data: json2FormData(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Referer": `https://center.mcmod.cn/${userStore.userID}/`
        },
        responseType: "json",
        onload: (response) => {
          if (response.responseText) {
            resolve(response.response);
          } else {
            reject(response);
          }
        }
      });
    });
  };
  const _hoisted_1$1 = { id: "mm-favorites" };
  const _hoisted_2$1 = { class: "mm-panel-header" };
  const _hoisted_3$1 = {
    class: "mm-panel-content",
    style: { "--height": "calc(100vh - 122px)" }
  };
  const _hoisted_4$1 = {
    key: 0,
    class: "mm-skeleton"
  };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "MFavorite",
    setup(__props) {
      const mmStore = useMMStore();
      let isLoading = vue.ref(true);
      let draggable = vue.ref(true);
      const mmDropDownOptions = vue.ref([
        {
          label: "刷新",
          key: "reload"
        },
        {
          label: "收藏夹管理",
          key: "manage"
        }
      ]);
      let mmTreeData = vue.ref([]);
      let mmDefaultExpandedKeys = vue.reactive([]);
      let mmManageShow = vue.ref(false);
      const categoryEm = {
        class: "mod",
        mod: "class",
        modpack: "modpack"
      };
      const handleClose = () => {
        mmStore.setPanelShow("showFavorite", false);
      };
      const handleReload = () => {
        isLoading.value = true;
        mmTreeData.value = [];
        getFavoriteFold();
      };
      const eventClose = () => {
        mmManageShow.value = false;
        handleReload();
      };
      const getFavoriteFold = async () => {
        let u = "https://center.mcmod.cn/frame/CenterFavoriteFold/";
        let d = {
          uid: mmStore.userID,
          data: JSON.stringify({})
        };
        let res = await request(u, d);
        let { state, html } = res;
        if (state !== 0) return;
        let node = new DOMParser().parseFromString(html, "text/html");
        let nodeList = node.querySelectorAll(".favorite-fold-list ul > a");
        let _favList = [];
        nodeList.forEach((n, i) => {
          var _a, _b;
          let favID = n.getAttribute("data-id");
          let favName = (_a = n.querySelector('li span[class="title"]')) == null ? void 0 : _a.getAttribute("title");
          let c = (_b = n.querySelector('li span[class="count"]')) == null ? void 0 : _b.getAttribute("title");
          let modCount = 0, modPackCount = 0;
          if (c) {
            c.split(",").forEach((o) => {
              let modMatch = o.match(/(\d+).个模组/);
              if (modMatch && modMatch.length) modCount = parseInt(modMatch[1]);
              let modPackMatch = o.match(/(\d+).个整合包/);
              if (modPackMatch && modPackMatch.length) modPackCount = parseInt(modPackMatch[1]);
            });
          }
          _favList.push({
            key: favID,
            label: favName,
            modCount,
            modPackCount,
            isLeaf: false
          });
        });
        if (!_favList.length) return;
        parseData(_favList);
      };
      const onLoadData = async (node) => {
        return new Promise(async (resolve) => {
          let { key, modCount, modPackCount, children } = node;
          if (children) {
            resolve();
            return;
          }
          let modArr = [];
          const getFavList = async (category) => {
            let u = "https://center.mcmod.cn/frame/CenterFavoriteSoltPage/";
            let d = {
              uid: mmStore.userID,
              data: JSON.stringify({
                fold: key,
                category
              })
            };
            let res = await request(u, d);
            let { state, html } = res;
            if (state !== 0) return;
            let childrenNode = new DOMParser().parseFromString(html, "text/html");
            let nodeList = childrenNode.querySelectorAll(".favorite-slot-ul li");
            nodeList.forEach((n) => {
              var _a;
              let modID = n.getAttribute("data-id");
              let modURL = (_a = n.querySelector('span[class="cover"] a')) == null ? void 0 : _a.getAttribute("href");
              let _modInfoNode = n.querySelector('span[class="cover"] img');
              let modPic = _modInfoNode == null ? void 0 : _modInfoNode.getAttribute("src");
              let modName = _modInfoNode == null ? void 0 : _modInfoNode.getAttribute("alt");
              modArr.push({
                label: modName,
                key: modID,
                modPic,
                modURL,
                mode: category === "class" ? "mod" : "modpack",
                parentKey: key,
                isLeaf: true
              });
            });
          };
          if (modCount) {
            modArr.push({
              label: `模组 (${modCount})`,
              mode: "mod",
              parentKey: key,
              disabled: true,
              isLeaf: true
            });
            await getFavList("class");
          }
          if (modPackCount) {
            modArr.push({
              label: `整合包 (${modPackCount})`,
              mode: "modpack",
              parentKey: key,
              disabled: true,
              isLeaf: true
            });
            await getFavList("modpack");
          }
          if (modCount === 0 && modPackCount === 0) {
            modArr.push({
              label: `这个收藏夹是空的。`,
              disabled: true,
              isLeaf: true
            });
          }
          node.children = modArr;
          resolve();
        });
      };
      const parseData = (treeData) => {
        let gmFavList = _GM_getValue("favList");
        let mmFavList;
        if (gmFavList && gmFavList.length) {
          mmFavList = treeData.filter((item) => {
            let o = gmFavList.find((i) => i.favID === item.key);
            if (o && o.folderHidden === false) {
              return {
                ...item
              };
            }
          });
          gmFavList = treeData.map((item) => {
            let o = gmFavList.find((i) => i.favID === item.key);
            return {
              favID: item.key,
              favName: item.label,
              folderHidden: o ? o.folderHidden : false,
              folderExpand: o ? o.folderExpand : false
            };
          });
          mmDefaultExpandedKeys = gmFavList.filter((item) => item.folderExpand).map((item) => item.favID);
        } else {
          gmFavList = treeData.map((item) => {
            return {
              favID: item.key,
              favName: item.label,
              folderHidden: false,
              folderExpand: false
            };
          });
          mmFavList = treeData;
        }
        _GM_setValue("favList", gmFavList);
        mmStore.setFavoriteData(gmFavList);
        mmTreeData.value = mmFavList;
        isLoading.value = false;
      };
      const handleDropDownSelect = (key) => {
        switch (key) {
          case "manage":
            mmManageShow.value = true;
            break;
          case "reload":
            handleReload();
            break;
        }
      };
      const treeRenderSwitcherIcon = (node) => {
        const { expanded } = node;
        let nodeIcon = vue.h("i", {
          class: `fas fa-folder${expanded ? "-open" : ""}`
        });
        return [nodeIcon];
      };
      const treeRenderLabel = (node) => {
        const { key, label, modPic, modURL, modCount, modPackCount } = node.option;
        if (modURL) {
          let nodeImg = vue.h("img", { class: "mm-fav-cover", src: modPic });
          let nodeTitle = vue.h("span", { class: "mm-fav-label" }, label);
          let nodeA = vue.h("a", {
            href: modURL,
            title: label,
            target: "_blank"
          }, vue.h("div", { class: "mm-fav-list" }, [nodeImg, nodeTitle]));
          return [nodeA];
        }
        if (!modURL) {
          let nodeArr = [vue.h("span", { class: "mm-fav-label-lv1" }, label)];
          if (modCount) {
            let nodeModCount = vue.h("span", {
              class: "mm-fav-label-icon",
              title: "模组"
            }, [vue.h("i", { class: "fa fa-cubes" }), " x" + modCount]);
            nodeArr.push(nodeModCount);
          }
          if (modPackCount) {
            let nodeModPackCount = vue.h("span", {
              class: "mm-fav-label-icon",
              title: "整合包"
            }, [vue.h("i", { class: "fa fa-file-zip-o" }), " x" + modPackCount]);
            nodeArr.push(nodeModPackCount);
          }
          return nodeArr;
        }
      };
      const findSiblingsAndIndex = (node, nodes) => {
        if (!nodes) return [null, null];
        for (let i = 0; i < nodes.length; ++i) {
          const siblingNode = nodes[i];
          if (siblingNode.key === node.key)
            return [nodes, i];
          const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
          if (siblings && index !== null)
            return [siblings, index];
        }
        return [null, null];
      };
      const treeDrop = async (data) => {
        draggable.value = false;
        let { node, dragNode, dropPosition } = data;
        let str;
        if (node.mode !== dragNode.mode) {
          str = dragNode.mode === "mod" ? "你不能把模组放到整合包内" : "你不能把整合包放到模组内";
        }
        if (node.parentKey !== dragNode.parentKey) {
          str = "你不能跨收藏夹操作";
          if (node.mode !== dragNode.mode) {
            str += dragNode.mode === "mod" ? "，更不能把模组放到整合包内" : "，更不能把整合包放到模组内";
          }
        }
        if (str) {
          window.$message.warning(str);
          draggable.value = true;
          return;
        }
        const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, mmTreeData.value);
        if (dragNodeSiblings === null || dragNodeIndex === null) return;
        dragNodeSiblings.splice(dragNodeIndex, 1);
        if (dropPosition === "after") {
          const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, mmTreeData.value);
          if (nodeSiblings === null || nodeIndex === null) return;
          nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
        }
        let arr = dragNodeSiblings.filter((o) => o.mode === dragNode.mode && !o.disabled);
        let objList = {};
        for (let i = 0; i < arr.length; i++) {
          objList[i] = arr[i].key;
        }
        let u = "https://center.mcmod.cn/action/doFavoriteSortSlot/";
        let sortData = {
          data: JSON.stringify({
            fold: dragNode.parentKey,
            category: categoryEm[dragNode.mode],
            list: objList
          })
        };
        let res = await request(u, sortData);
        let { state } = res;
        draggable.value = true;
        if (state !== 0) return;
        mmTreeData.value = Array.from(mmTreeData.value);
      };
      vue.onMounted(() => {
        getFavoriteFold();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createVNode(vue.unref(naiveUi.NIcon), { size: "24" }, {
              default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                vue.createElementVNode("i", { class: "fas fa-star" }, null, -1)
              ])),
              _: 1
            }),
            _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "mm-header-title" }, "收藏", -1)),
            vue.createVNode(vue.unref(naiveUi.NDropdown), {
              trigger: "click",
              options: mmDropDownOptions.value,
              onSelect: handleDropDownSelect
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naiveUi.NIcon), {
                  class: "mm-more",
                  size: "18",
                  title: "更多"
                }, {
                  default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                    vue.createElementVNode("i", { class: "fa-solid fa-ellipsis" }, null, -1)
                  ])),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["options"]),
            vue.createVNode(vue.unref(naiveUi.NIcon), {
              class: "mm-close",
              size: "18",
              title: "关闭",
              onClick: handleClose
            }, {
              default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                vue.createElementVNode("i", { class: "fa-solid fa-xmark" }, null, -1)
              ])),
              _: 1
            })
          ]),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.unref(isLoading) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$1, [
              vue.createVNode(vue.unref(naiveUi.NSkeleton), {
                text: "",
                repeat: 2
              })
            ])) : (vue.openBlock(), vue.createBlock(vue.unref(naiveUi.NScrollbar), {
              key: 1,
              style: { "max-height": "var(--height)" }
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(naiveUi.NTree), {
                  "block-line": "",
                  "expand-on-click": "",
                  "default-expanded-keys": vue.unref(mmDefaultExpandedKeys),
                  draggable: true,
                  selectable: false,
                  data: vue.unref(mmTreeData),
                  "on-load": onLoadData,
                  "render-switcher-icon": treeRenderSwitcherIcon,
                  "render-label": treeRenderLabel,
                  onDrop: treeDrop
                }, {
                  empty: vue.withCtx(() => _cache[4] || (_cache[4] = [
                    vue.createElementVNode("p", { class: "mm-empty" }, "暂无收藏夹。", -1)
                  ])),
                  _: 1
                }, 8, ["default-expanded-keys", "data"])
              ]),
              _: 1
            }))
          ]),
          vue.createVNode(MManage, {
            showModal: vue.unref(mmManageShow),
            onEmitClose: eventClose
          }, null, 8, ["showModal"])
        ]);
      };
    }
  });
  const MFavorite = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-b88b14de"]]);
  const _hoisted_1 = { id: "mm-setting" };
  const _hoisted_2 = { class: "mm-panel-header" };
  const _hoisted_3 = { class: "mm-panel-content" };
  const _hoisted_4 = { class: "mm-setting-content" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "MSettings",
    setup(__props) {
      const mmStore = useMMStore();
      const mmFavShowMode = vue.ref(0);
      const mmFavShowModeList = [
        { label: "总是", value: 0 },
        { label: "仅首页", value: 1 },
        { label: "手动", value: 2 }
      ];
      const handleClose = () => {
        mmStore.setPanelShow("showSettings", false);
      };
      const handleFavShowModeUpdate = (value) => {
        _GM_setValue("favShowMode", value);
      };
      vue.onMounted(() => {
        mmFavShowMode.value = _GM_getValue("favShowMode") || 0;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", _hoisted_2, [
            vue.createVNode(vue.unref(naiveUi.NIcon), { size: "24" }, {
              default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                vue.createElementVNode("i", { class: "fa-solid fa-gear" }, null, -1)
              ])),
              _: 1
            }),
            _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "mm-header-title" }, "设置", -1)),
            vue.createVNode(vue.unref(naiveUi.NIcon), {
              class: "mm-close",
              size: "18",
              title: "关闭",
              onClick: handleClose
            }, {
              default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                vue.createElementVNode("i", { class: "fa-solid fa-xmark" }, null, -1)
              ])),
              _: 1
            })
          ]),
          vue.createElementVNode("div", _hoisted_3, [
            vue.createElementVNode("div", _hoisted_4, [
              _cache[4] || (_cache[4] = vue.createElementVNode("h3", { class: "mm-setting-content-title" }, "收藏显示模式", -1)),
              vue.createVNode(vue.unref(naiveUi.NSelect), {
                class: "mm-setting-content-value",
                value: mmFavShowMode.value,
                "onUpdate:value": [
                  _cache[0] || (_cache[0] = ($event) => mmFavShowMode.value = $event),
                  handleFavShowModeUpdate
                ],
                size: "small",
                options: mmFavShowModeList
              }, null, 8, ["value"])
            ])
          ])
        ]);
      };
    }
  });
  const MSettings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7cfc0576"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const mmStore = useMMStore();
      let isLogged = vue.ref(false);
      const getUserID = () => {
        let userUrlNode = document.querySelector(".top-username a") || document.querySelector(".header-user-avatar a");
        if (!userUrlNode) return null;
        let url = userUrlNode.getAttribute("href");
        let arr = url == null ? void 0 : url.match(/\d+/);
        if (arr == null ? void 0 : arr.length) {
          mmStore.setUserID(arr[0]);
          isLogged.value = true;
        }
      };
      const showFavorite = () => {
        let favShowMode = _GM_getValue("favShowMode");
        switch (favShowMode) {
          case 1:
            let { host, pathname } = location;
            if (host === "www.mcmod.cn" && pathname === "/") {
              mmStore.setPanelShow("showFavorite", true);
            }
            break;
          case 2:
            mmStore.setPanelShow("showFavorite", false);
            break;
          default:
            mmStore.setPanelShow("showFavorite", true);
            break;
        }
      };
      vue.onMounted(() => {
        getUserID();
        if (!isLogged.value) return;
        showFavorite();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(MSidebar),
          vue.unref(mmStore).showFavorite ? (vue.openBlock(), vue.createBlock(MFavorite, { key: 0 })) : vue.createCommentVNode("", true),
          vue.unref(mmStore).showSettings ? (vue.openBlock(), vue.createBlock(MSettings, { key: 1 })) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  const app = vue.createApp(_sfc_main);
  const pinia = pinia$1.createPinia();
  app.use(pinia);
  const { message } = naiveUi.createDiscreteApi(["message"]);
  window.$message = message;
  app.mount(
    (() => {
      const nodeDiv = document.createElement("div");
      nodeDiv.id = "mm-main";
      document.body.append(nodeDiv);
      return nodeDiv;
    })()
  );

})(Vue, Pinia, naive);