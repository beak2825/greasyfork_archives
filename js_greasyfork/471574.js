// ==UserScript==
// @name       vue-router-tool
// @namespace  npm/vue-router-tool
// @version    0.0.1
// @author     shixiaoshi
// @license    MIT
// @description vue项目路由切换工具
// @icon       https://vitejs.dev/logo.svg
// @match      https://*/*
// @match      http://*/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @connect    localhost
// @grant      GM_deleteValue
// @grant      GM_getValue
// @grant      GM_listValues
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/471574/vue-router-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/471574/vue-router-tool.meta.js
// ==/UserScript==

(a=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=a,document.head.append(e)})(' .monkey-box-wrap[data-v-a5e7cb6f]{position:fixed;z-index:9999;background:rgba(255,255,255,.9);box-shadow:0 4px 8px #07111b33;border-radius:8px}.monkey-box-wrap[data-v-a5e7cb6f]:before{content:"";display:block;width:8px;height:8px;background:#fff;z-index:1900;position:absolute;transform:rotate(45deg);left:20px}.belowPart[data-v-a5e7cb6f]:before{bottom:-4px}.upPart[data-v-a5e7cb6f]:before{top:-4px}.router-wrap[data-v-8fdc01fd]{width:100%;padding:4px;max-height:200px;min-height:20px;overflow-y:auto;overflow-x:hidden;cursor:pointer}.router-wrap .no-data[data-v-8fdc01fd]{text-align:center;font-size:14px;line-height:30px;color:gray}.router-wrap .router-item[data-v-8fdc01fd]{border-radius:3px;padding:4px;align-items:center;justify-content:space-between;display:flex;transition:all .1s linear}.router-wrap .router-item .left[data-v-8fdc01fd]{width:20px;height:20px;border-radius:5px;background:#fff;display:flex;justify-content:center;align-items:center;padding:2px;overflow:hidden;transition:padding .1s linear}.router-wrap .router-item .left[data-v-8fdc01fd]:hover{padding:5px;transition:padding .1s linear}.router-wrap .router-item .right[data-v-8fdc01fd]{flex:1;display:flex;flex-flow:column;justify-content:space-between;margin-left:4px;height:28px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.router-wrap .router-item .right .path-wrap[data-v-8fdc01fd]{line-height:14px;display:block;font-size:12px;color:#303133;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.router-wrap .router-item .right .name-wrap[data-v-8fdc01fd]{font-size:12px;line-height:12px;color:#c3c7cb}.router-wrap .router-item[data-v-8fdc01fd]:hover{transform:translate(3px);background:#EBEDF0;box-shadow:0 4px 8px #07111b1a}.monkey-wrap[data-v-2c3d75a0]{position:fixed;cursor:pointer;z-index:9999;-webkit-user-select:none;user-select:none;background:rgba(255,255,255,.5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 4px 8px #07111b1a;border-radius:8px;display:flex;align-items:center;padding:2px 5px;height:32px;right:auto}.monkey-wrap .v-drag-handle[data-v-2c3d75a0]{cursor:move}.monkey-wrap .icon[data-v-2c3d75a0]{width:16px;height:16px;display:inline-block;display:flex;justify-content:center;align-items:center;overflow:hidden;margin:0 5px}.monkey-wrap .icon img[data-v-2c3d75a0]{width:16px}.monkey-wrap .monkey-home-wrap[data-v-2c3d75a0]{overflow:hidden;display:flex;height:25px;align-items:center;border-radius:15px;color:#0065b3;background-color:#e1f2ff}.monkey-wrap .monkey-home-wrap .monkey-name-wrap[data-v-2c3d75a0]{display:flex;min-width:80px;align-items:center}.monkey-wrap .monkey-home-wrap .monkey-name-wrap .monkey-arrow[data-v-2c3d75a0]{width:10px;height:10px;display:flex;justify-content:center;align-items:center;transform:rotate(180deg);margin:2px 10px 0 5px;transition:transform .3s}.monkey-wrap .monkey-home-wrap .monkey-name-wrap .monkey-arrow img[data-v-2c3d75a0]{width:10px}.monkey-wrap .monkey-home-wrap .monkey-name-wrap .monkey-name[data-v-2c3d75a0]{text-align:center;display:inline-block;margin:5px;font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.monkey-wrap .monkey-home-wrap .monkey-name-wrap:hover .monkey-arrow[data-v-2c3d75a0]{transform:rotate(0);transition:transform .3s}.monkey-wrap .monkey-menu-wrap[data-v-2c3d75a0]{display:flex;align-items:center;margin-left:10px}.proxy .monkey-home-wrap[data-v-2c3d75a0]{background-color:#ffe6e6}.name-wrap-enter-active[data-v-2c3d75a0]{transition:all .2s ease-out}.name-wrap-leave-active[data-v-2c3d75a0]{transition:all .2s ease-in}.name-wrap-enter-from[data-v-2c3d75a0]{transform:scale(.9);width:100%;opacity:0}.name-wrap-leave-to[data-v-2c3d75a0]{transform:scale(.9);width:50%;opacity:0}.btn-wrap-enter-active[data-v-2c3d75a0]{transition:all .2s ease-out}.btn-wrap-leave-active[data-v-2c3d75a0]{transition:all .2s ease-in}.btn-wrap-enter-from[data-v-2c3d75a0],.btn-wrap-leave-to[data-v-2c3d75a0]{transform:translate(5px);opacity:0} ');

(function (vue) {
  'use strict';

  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const GM_setObject = function(name, value) {
    _GM_setValue(name, JSON.stringify(value));
  };
  let mkApi = {};
  const keyList = [
    {
      key: "DEVTOOL_VISIBLE",
      default: false,
      name: "开发工具可见性"
      /* DEVTOOL_VISIBLE */
    },
    {
      key: "BOX_TOP",
      default: 20,
      name: "弹框距离顶部距离"
      /* BOX_TOP */
    },
    {
      key: "BOX_LEFT",
      default: 50,
      name: "弹框距离左侧距离"
      /* BOX_LEFT */
    },
    {
      key: "ERROR_COUNT",
      default: 0,
      name: "项目报错次数"
      /* ERROR_COUNT */
    }
  ];
  keyList.forEach((item) => {
    mkApi[item.key] = {};
    mkApi[item.key].get = function() {
      let value = _GM_getValue(item.key, void 0);
      try {
        if (value == void 0)
          return item.default;
        return JSON.parse(value);
      } catch (e) {
        return item.default;
      }
    };
    mkApi[item.key].set = function(value) {
      _GM_setValue(item.key, JSON.stringify(value));
    };
  });
  mkApi.registerMenuCommand = function() {
    let dev = mkApi.DEVTOOL_VISIBLE.get();
    let tip = dev ? "Show in localhost" : "Display on all pages";
    _GM_registerMenuCommand(tip, function() {
      mkApi.DEVTOOL_VISIBLE.set(!dev);
      _unsafeWindow.location.reload();
    });
    _GM_registerMenuCommand("Reset script", function() {
      const list = _GM_listValues();
      if (list.length > 0)
        list.forEach((res) => _GM_deleteValue(res));
      _unsafeWindow.location.reload();
    });
  };
  const _imports_0 = "data:image/svg+xml;base64,PHN2ZyB0PSIxNjY5Mjc4MzIzMDU2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMzAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzODkzIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk5Ni43MTA0IDQ0MS45Nzg4OCA2MDkuNDMzNiAzOC44MDk2QzU4NS4zNjQ0OCAxMy43Nzc5MiA1NTMuMjAwNjQgMCA1MTguNzIyNTYgMFM0NTIuMDgwNjQgMTMuNzc3OTIgNDI4LjAxNjY0IDM4LjgwOTZMNDAuNzM5ODQgNDQxLjk3ODg4Yy0zOS45NjE2IDQxLjYxNTM2LTM0LjgxNiA3Ny41ODMzNi0yOC4yMTEyIDkyLjYxMDU2IDQuNzA1MjggMTAuNjU5ODQgMjAuNjAyODggMzkuOTYxNiA2Ni4zOTYxNiAzOS45NjE2bDU2Ljc2NTQ0IDAgMCAzMTAuMTU5MzZjMCA3MC40MTUzNiA1MC41NiAxMzYuNzE5MzYgMTIyLjQxNDA4IDEzNi43MTkzNmw2NS4xNDY4OCAwTDQyMi45NjMyIDEwMjEuNDI5NzZsMC03Mi44NzgwOCAwLTI1NS4zNmMwLTM1LjE5NDg4LTUuMzI5OTItNTQuNzk5MzYgMzAuNjEyNDgtNTQuNzk5MzZsNjUuMTQ2ODggMCA2NS4xNDY4OCAwYzM1LjkzNzI4IDAgMzAuNjEyNDggMTkuNjA0NDggMzAuNjEyNDggNTQuNzk5MzZsMCAyNTUuMzYgMCA3Mi44NzgwOCA5OS43MTcxMiAwIDY1LjE1MiAwYzcxLjg0ODk2IDAgMTIyLjQwMzg0LTY2LjMwNCAxMjIuNDAzODQtMTM2LjcxOTM2bDAtMzEwLjE1OTM2IDU2Ljc3MDU2IDBjNDUuNzc3OTIgMCA2MS42ODU3Ni0yOS4zMDE3NiA2Ni4zOTYxNi0zOS45NjE2QzEwMzEuNTM2NjQgNTE5LjU2NzM2IDEwMzYuNjcyIDQ4My41OTQyNCA5OTYuNzEwNCA0NDEuOTc4ODh6IiBwLWlkPSIxMzg5NCIgZmlsbD0iIHJnYmEoMCwgMTAxLCAxNzksLjcpIj48L3BhdGg+PC9zdmc+";
  const _imports_1 = "data:image/svg+xml;base64,PHN2ZyB0PSIxNjY5Mjc4NjExMTMxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0OTI3IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEwMDUuOSA2OTFjMTEuMiAxMS4yIDE2LjcgMjUuOCAxNi43IDQwLjUgMCAxNC42LTUuNSAyOS4zLTE2LjcgNDAuNS0yMi4zIDIyLjMtNTguNSAyMi4zLTgwLjggMEw1MTEuNCAzNTguMSA5Ny42IDc3MS43Yy0yMi4zIDIyLjMtNTguNSAyMi4zLTgwLjggMC0yMi4zLTIyLjMtMjIuMy01OC41IDAtODAuOEw0NDYuNyAyNjFjMTcuMy0xNy4zIDQwLjItMjYuNyA2NC43LTI2LjdzNDcuNCA5LjUgNjQuNyAyNi43bDQyOS44IDQzMHogbTAgMCIgZmlsbD0iICMwMDY1QjMiIHAtaWQ9IjE0OTI4Ij48L3BhdGg+PC9zdmc+";
  const _imports_2 = "data:image/svg+xml;base64,PHN2ZyB0PSIxNjY5Mjc5NTI5OTUzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzNTIyIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEwMTcuODU2IDQ2MC44bC0xODUuNDA4LTIzMy41MzZjLTIwLjQ4LTI1LjYtNTguMzY4LTI1LjYtNzguODQ4IDBMNTY5LjIxNiA0NjAuOEM1NTQuODggNDc4LjIwOCA1NjguMjU2IDUwNC44MzIgNTkwLjc4NCA1MDQuODMybDcyLjcwNCAwYy0yLjA0OCAxMzYuMTkyLTIuMDQ4IDMwOS4zMTItMjQwLjcwNCA0NDcuNTUyLTYuMTQ0IDQuMDk2LTMuMDcyIDEzLjMxMiA0LjA5NiAxMi4yODggNDU2Ljc2OC03MC42NTYgNDkzLjYzMi0zNzYuODk2IDQ5NC42NTYtNDU4LjgxNmw3NS43NzYgMEMxMDE5LjkwNCA1MDQuODMyIDEwMzIuMTkyIDQ3OC4yMDggMTAxNy44NTYgNDYwLjhMMTAxNy44NTYgNDYwLjh6TTQzNC4wNDggNTE5LjE2OCAzNjEuMzQ0IDUxOS4xNjhjMi4wNDgtMTM2LjE5MiAyLjA0OC0zMDkuMzEyIDI0MC43MDQtNDQ3LjU1MiA2LjE0NC00LjA5NiAzLjA3Mi0xMy4zMTItNC4wOTYtMTIuMjg4QzE0MS4xMiAxMjkuOTg0IDEwNC4yNTYgNDM3LjI0OCAxMDMuMjMyIDUxOC4xNDRMMjcuNDU2IDUxOC4xNDRjLTIyLjUyOCAwLTM1Ljg0IDI2LjYyNC0yMS41MDQgNDQuMDMybDE4NS4zNDQgMjMzLjUzNmMyMC40OCAyNS42IDU4LjM2OCAyNS42IDc4Ljg0OCAwbDE4NS40MDgtMjMzLjUzNkM0NjguODY0IDU0NS43OTIgNDU2LjU3NiA1MTkuMTY4IDQzNC4wNDggNTE5LjE2OEw0MzQuMDQ4IDUxOS4xNjh6TTQzNC4wNDggNTE5LjE2OCIgcC1pZD0iMjM1MjMiIGZpbGw9IiNDN0NCQ0YiPjwvcGF0aD48L3N2Zz4=";
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    props: ["top", "left", "width", "bottom", "upperPart", "name"],
    emits: ["destroy"],
    setup(__props, { emit }) {
      const props = __props;
      const boxWrap = vue.ref();
      const styles = vue.computed(
        () => {
          return {
            left: props.left,
            width: props.width,
            bottom: props.upperPart ? "" : props.bottom,
            top: props.upperPart ? props.top : ""
          };
        }
      );
      const customClass = vue.computed(() => {
        return props.upperPart ? "upPart" : "belowPart";
      });
      let visible = vue.ref(false);
      function beforeUnload() {
        if (props.name === "router") {
          emit("destroy");
        }
      }
      vue.onMounted(() => {
        visible.value = true;
        boxWrap.value.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          onAfterLeave: beforeUnload,
          onMouseleave: beforeUnload
        }, [
          vue.withDirectives(vue.createElementVNode("div", {
            class: vue.normalizeClass(["monkey-box-wrap", customClass.value]),
            style: vue.normalizeStyle(styles.value),
            ref_key: "boxWrap",
            ref: boxWrap
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ], 6), [
            [vue.vShow, vue.unref(visible)]
          ])
        ], 32);
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
  const boxWrapComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a5e7cb6f"]]);
  let vm;
  const bodyHight = document.documentElement.clientHeight;
  const container = document.createElement("div");
  const createBoxWarp = (dragBox, component) => {
    if (!component) {
      return vue.render(null, container);
    }
    const centerLinePosition = dragBox.offsetTop + dragBox.clientHeight / 2;
    const upperPart = bodyHight / 2 - centerLinePosition > 0 ? true : false;
    const left = dragBox.offsetLeft + "px";
    const width = dragBox.offsetWidth + "px";
    const name = component.__name;
    if (vm) {
      vue.render(null, container);
    }
    const props = {
      upperPart,
      top: dragBox.offsetTop + dragBox.offsetHeight + 10 + "px",
      bottom: bodyHight - dragBox.offsetTop + 10 + "px",
      width,
      left,
      name,
      onDestroy: () => {
        vue.render(null, container);
      }
    };
    vm = vue.createVNode(boxWrapComponent, props, () => vue.h(component));
    vue.render(vm, container);
    document.body.appendChild(container.firstElementChild);
    //!表示一定有
  };
  function compare(eleName, reverse = true) {
    return function(value1, value2) {
      let v1 = value1[eleName];
      let v2 = value2[eleName];
      return reverse === true ? v2 - v1 : v1 - v2;
    };
  }
  const routerApi = {
    appInfo: [
      {
        name: "vue2",
        technical: "vue",
        mountDomProName: "__vue__",
        getAppInfo: (mountDom) => {
          var _a, _b, _c, _d;
          const vue2App = mountDom.__vue__;
          return {
            rawBaseUrl: ((_b = (_a = vue2App.$router) == null ? void 0 : _a.options) == null ? void 0 : _b.base) ?? "",
            routerList: (_d = (_c = vue2App == null ? void 0 : vue2App.$router) == null ? void 0 : _c.options) == null ? void 0 : _d.routes
          };
        }
      },
      {
        name: "vue3",
        technical: "vue",
        mountDomProName: "__vue_app__",
        getAppInfo: (mountDom) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i;
          const vue3App = mountDom.__vue_app__;
          return {
            rawBaseUrl: ((_e = (_d = (_c = (_b = (_a = vue3App == null ? void 0 : vue3App.config) == null ? void 0 : _a.globalProperties) == null ? void 0 : _b.$router) == null ? void 0 : _c.options) == null ? void 0 : _d.history) == null ? void 0 : _e.base) ?? "",
            routerList: ((_i = (_h = (_g = (_f = vue3App == null ? void 0 : vue3App.config) == null ? void 0 : _f.globalProperties) == null ? void 0 : _g.$router) == null ? void 0 : _h.options) == null ? void 0 : _i.routes) || []
          };
        }
      }
    ],
    // 获取dom上的路由信息
    getRouterDomInfo() {
      let routerInfo = { baseUrl: "", routerList: [] };
      const mountDom = document.body.querySelector("div");
      if (!mountDom)
        return routerInfo;
      let appItem = this.appInfo.find((res) => {
        return mountDom.hasOwnProperty(res.mountDomProName);
      });
      if (!appItem)
        return routerInfo;
      let { rawBaseUrl, routerList } = appItem.getAppInfo(mountDom);
      let baseUrl = rawBaseUrl == null ? void 0 : rawBaseUrl.replaceAll("//", "/");
      if (rawBaseUrl == null ? void 0 : rawBaseUrl.startsWith("/"))
        baseUrl = baseUrl.substring(1);
      if (rawBaseUrl == null ? void 0 : rawBaseUrl.endsWith("/"))
        baseUrl = baseUrl.substring(0, baseUrl.length - 1);
      routerInfo.baseUrl = baseUrl;
      if ((routerList == null ? void 0 : routerList.length) > 0) {
        routerInfo.routerList = routerList.filter((res) => !res.path.includes(":"));
      }
      return routerInfo;
    },
    // 获取包装好的路由信息
    getRouterArrayInfo() {
      const { baseUrl, routerList } = this.getRouterDomInfo();
      const routerArray = (routerList == null ? void 0 : routerList.map((res) => {
        var _a, _b;
        const path = res.path ? res.path.replaceAll("//", "/") : "";
        const pathName = `/${baseUrl}${path}`.replaceAll("//", "/");
        let url = `${location.protocol}//${location.host}${pathName}`;
        return {
          path: path || "/",
          name: pathName === "/" ? "web-homepage" : res.title ?? ((_a = res == null ? void 0 : res.meta) == null ? void 0 : _a.title) ?? ((_b = res == null ? void 0 : res.meta) == null ? void 0 : _b.name) ?? (res == null ? void 0 : res.name) ?? path,
          fulUrl: url,
          pathName,
          select: pathName === location.pathname,
          port: (location == null ? void 0 : location.port) || "80"
        };
      })) || [];
      return routerArray.sort(compare("select"));
    },
    // 获取当前激活的路由名称
    getActiveName() {
      const routerList = this.getRouterArrayInfo();
      let routerItem = routerList.find((res) => res.select);
      return routerItem ? routerItem.name ? routerItem.name : "---/---" : "---/---";
    }
  };
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-8fdc01fd"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "router-wrap" };
  const _hoisted_2$1 = { class: "left" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    t: "1669605726745",
    class: "icon",
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    "p-id": "3188",
    width: "18",
    height: "18"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      d: "M512 504L764.8 68.8h-134.4L512 275.2 393.6 70.4h-134.4L512 504zM819.2 70.4L512 600 204.8 68.8H0l512 886.4L1024 70.4H819.2z",
      fill: "#C7CBCF",
      "p-id": "3189"
    })
  ], -1));
  const _hoisted_4$1 = [
    _hoisted_3$1
  ];
  const _hoisted_5$1 = { class: "left" };
  const _hoisted_6$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "aria-hidden": "true",
    role: "img",
    class: "iconify iconify--logos",
    width: "37.07",
    height: "36",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 256 198"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#41B883",
      d: "M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#41B883",
      d: "m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"
    }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#35495E",
      d: "M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"
    })
  ], -1));
  const _hoisted_7$1 = [
    _hoisted_6$1
  ];
  const _hoisted_8$1 = ["onClick"];
  const _hoisted_9 = { class: "path-wrap" };
  const _hoisted_10 = { class: "name-wrap" };
  const _hoisted_11 = { class: "no-data" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "router",
    setup(__props) {
      const vTitle = {
        mounted(el) {
          el.onmouseenter = (e) => {
            const { clientWidth, scrollWidth, title } = el;
            if (!title && scrollWidth > clientWidth)
              el.title = el.innerText;
          };
        }
      };
      const routerArray = routerApi.getRouterArrayInfo();
      const jump = (urlInfo) => {
        location.href = urlInfo.fulUrl;
      };
      function getName(url) {
        if (!url || url === "/")
          return "/";
        if (url.startsWith("/")) {
          return url.substring(1);
        } else {
          return url;
        }
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(routerArray), (item, index) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: "router-item",
              key: index
            }, [
              vue.withDirectives(vue.createElementVNode("div", _hoisted_2$1, _hoisted_4$1, 512), [
                [vue.vShow, !item.select]
              ]),
              vue.withDirectives(vue.createElementVNode("div", _hoisted_5$1, _hoisted_7$1, 512), [
                [vue.vShow, item.select]
              ]),
              vue.createElementVNode("div", {
                class: "right",
                onClick: ($event) => jump(item)
              }, [
                vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_9, [
                  vue.createTextVNode(vue.toDisplayString(getName(item.path)), 1)
                ])), [
                  [vTitle]
                ]),
                vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
                  vue.createTextVNode(vue.toDisplayString(getName(item.name)), 1)
                ])), [
                  [vTitle]
                ])
              ], 8, _hoisted_8$1)
            ]);
          }), 128)),
          vue.withDirectives(vue.createElementVNode("div", _hoisted_11, "No data", 512), [
            [vue.vShow, vue.unref(routerArray).length === 0]
          ])
        ]);
      };
    }
  });
  const routerComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8fdc01fd"]]);
  let realWidth = vue.ref();
  const position = vue.computed(() => {
    var _a;
    const bodyWidth = ((_a = document == null ? void 0 : document.body) == null ? void 0 : _a.clientWidth) ?? 0;
    const bodyHight2 = document.documentElement.clientHeight;
    let boxTop = mkApi.BOX_TOP.get();
    let boxLeft = mkApi.BOX_LEFT.get();
    if (realWidth.value && realWidth.value + boxLeft - bodyWidth > 0) {
      return {
        boxTop: boxTop + "px",
        boxLeft: bodyWidth - realWidth.value + "px"
      };
    }
    if (boxTop < 0 || boxTop > bodyWidth || boxTop > bodyHight2 || boxTop < 0) {
      return {
        boxTop: "20px",
        boxLeft: "20px"
      };
    }
    return {
      boxTop: boxTop + "px",
      boxLeft: boxLeft + "px"
    };
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-2c3d75a0"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "monkey-home-wrap" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("img", { src: _imports_0 }, null, -1));
  const _hoisted_3 = [
    _hoisted_2
  ];
  const _hoisted_4 = { class: "monkey-name" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "monkey-arrow" }, [
    /* @__PURE__ */ vue.createElementVNode("img", { src: _imports_1 })
  ], -1));
  const _hoisted_6 = {
    key: 0,
    class: "monkey-menu-wrap"
  };
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("img", { src: _imports_2 }, null, -1));
  const _hoisted_8 = [
    _hoisted_7
  ];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const routerName = vue.ref("---/---");
      const box = vue.ref();
      vue.onMounted(() => {
        realWidth.value = box.value.clientWidth;
        routerName.value = routerApi.getActiveName();
      });
      document.addEventListener("click", () => {
        createBoxWarp(box.value, null);
      });
      const clearStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (var i = keys.length; i--; ) {
            document.cookie = keys[i] + "=0;path=/;expires=" + (/* @__PURE__ */ new Date(0)).toUTCString();
            document.cookie = keys[i] + "=0;path=/;domain=" + document.domain + ";expires=" + (/* @__PURE__ */ new Date(0)).toUTCString();
          }
        }
        location.href = location.href;
      };
      const nameWrapVisible = vue.ref(false);
      const mouseenterMoveBtn = () => {
        createBoxWarp(box.value, null);
        nameWrapVisible.value = true;
      };
      return (_ctx, _cache) => {
        const _directive_drag = vue.resolveDirective("drag");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "monkey-wrap",
          ref_key: "box",
          ref: box,
          style: vue.normalizeStyle({ top: vue.unref(position).boxTop, left: vue.unref(position).boxLeft }),
          onMouseleave: _cache[2] || (_cache[2] = ($event) => nameWrapVisible.value = false)
        }, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("span", {
              class: "icon v-drag-handle",
              onMouseenter: _cache[0] || (_cache[0] = ($event) => mouseenterMoveBtn())
            }, _hoisted_3, 32),
            vue.createVNode(vue.Transition, { name: "name-wrap" }, {
              default: vue.withCtx(() => [
                nameWrapVisible.value ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  class: "monkey-name-wrap",
                  onMouseenter: _cache[1] || (_cache[1] = ($event) => vue.unref(createBoxWarp)(box.value, routerComponent))
                }, [
                  vue.createElementVNode("span", _hoisted_4, vue.toDisplayString(routerName.value), 1),
                  _hoisted_5
                ], 32)) : vue.createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          vue.createVNode(vue.Transition, { name: "btn-wrap" }, {
            default: vue.withCtx(() => [
              nameWrapVisible.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
                vue.createElementVNode("span", {
                  class: "icon",
                  onClick: clearStorage
                }, _hoisted_8)
              ])) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })
        ], 36)), [
          [_directive_drag]
        ]);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c3d75a0"]]);
  const monkeyTool = {
    // 是否注入脚本
    inject() {
      let devToolVisible = mkApi.DEVTOOL_VISIBLE.get();
      const localhostUrl = location.href.includes("localhost");
      return devToolVisible || localhostUrl;
    },
    // 如果无路由信息或项目报错，不显示脚本
    isPageHaveError() {
      let error = document.body.querySelector("#webpack-dev-server-client-overlay");
      if (error)
        return true;
      let count = mkApi.ERROR_COUNT.get();
      if (count > 1) {
        mkApi.ERROR_COUNT.set(0);
        return true;
      }
      mkApi.ERROR_COUNT.set(count + 1);
      setTimeout(() => {
        mkApi.ERROR_COUNT.set(0);
      }, 1e3);
    },
    registerMenuCommand() {
      mkApi.registerMenuCommand();
    }
  };
  const directive$1 = {
    beforeMount(el) {
      const dragBox = el;
      const dragArea = el.getElementsByClassName("v-drag-handle").length > 0 ? el.getElementsByClassName("v-drag-handle")[0] : el;
      const bodyWidth = document.body.clientWidth;
      const bodyHight2 = document.documentElement.clientHeight;
      dragArea.onmousedown = (e) => {
        let domLeft = dragBox.offsetLeft;
        let domTop = dragBox.offsetTop;
        e.preventDefault();
        e.stopPropagation();
        let mouseX = e.clientX - domLeft;
        let mouseY = e.clientY - domTop;
        const domWidth = dragBox.offsetWidth;
        const domHeight = dragBox.offsetHeight;
        document.onmousemove = (e2) => {
          let domCenterLeft = e2.clientX - mouseX;
          let domCenterTop = e2.clientY - mouseY;
          dragBox.style.left = domCenterLeft + "px";
          dragBox.style.top = domCenterTop + "px";
          domLeft = dragBox.offsetLeft;
          domTop = dragBox.offsetTop;
          let domRight = bodyWidth - domLeft - domWidth;
          let domBottom = bodyHight2 - domHeight - domTop;
          if (domRight <= 0) {
            dragBox.style.left = bodyWidth - domWidth + "px";
          }
          if (domBottom < 0) {
            dragBox.style.top = bodyHight2 - domHeight + "px";
          }
          if (domLeft < 0) {
            dragBox.style.left = 0;
          }
          if (domTop < 0) {
            dragBox.style.top = 0;
          }
        };
        document.onmouseup = (e2) => {
          e2.preventDefault();
          document.onmousemove = null;
          document.onmouseup = null;
          GM_setObject("BOX_LEFT", dragBox.offsetLeft);
          GM_setObject("BOX_TOP", dragBox.offsetTop);
        };
      };
    }
  };
  const drag = {
    install: function(app) {
      app.directive("drag", directive$1);
    }
  };
  const directive = {
    install: function(app) {
      app.use(drag);
    }
  };
  monkeyTool.registerMenuCommand();
  const injectTool = monkeyTool.inject();
  if (injectTool) {
    _unsafeWindow.addEventListener("load", () => {
      const pageError = monkeyTool.isPageHaveError();
      if (pageError)
        return console.error("[vite-plugin-monkey]Please resolve the error on the current page and continue to use this plug-in");
      vue.createApp(App).use(directive).mount(
        (() => {
          const el = document.createElement("div");
          document.body.append(el);
          return el;
        })()
      );
    });
  }

})(Vue);
