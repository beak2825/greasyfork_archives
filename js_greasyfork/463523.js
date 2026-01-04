// ==UserScript==
// @name               Genshin Impact Map Toggle Chest Pin Style
// @name:en            Genshin Impact Map Toggle Chest Pin Style
// @name:zh            原神米游社大地图更换宝箱标点样式
// @name:zh-CN         原神米游社大地图更换宝箱标点样式
// @namespace          WEGFan
// @version            1.1.0
// @author             WEGFan
// @description        Toggle chest pin style between type and obtain way on the fly in the Teyvat Interactive Map
// @description:en     Toggle chest pin style between type and obtain way on the fly in the Teyvat Interactive Map
// @description:zh     原神米游社大地图实时切换解谜宝箱的标点样式，可选择显示品质或获取方式
// @description:zh-CN  原神米游社大地图实时切换解谜宝箱的标点样式，可选择显示品质或获取方式
// @license            MIT
// @icon               https://webstatic.mihoyo.com/ys/app/interactive-map/mapicon.png
// @homepage           https://github.com/WEGFan/Genshin-Impact-Map-Toggle-Chest-Pin-Style
// @supportURL         https://github.com/WEGFan/Genshin-Impact-Map-Toggle-Chest-Pin-Style/issues
// @match              https://webstatic.mihoyo.com/ys/app/interactive-map/*
// @match              https://act.hoyolab.com/ys/app/interactive-map/*
// @require            https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.1.3/dist/index.js
// @require            https://cdn.jsdelivr.net/npm/i18next@22.4.14/i18next.min.js
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/463523/Genshin%20Impact%20Map%20Toggle%20Chest%20Pin%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/463523/Genshin%20Impact%20Map%20Toggle%20Chest%20Pin%20Style.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(' .wegfan__chest-marker-style-toggle .chest-marker-style-option{display:flex;justify-content:space-between;align-items:center;margin-top:.04rem;color:#ece6d9bf;font-size:.12rem}.wegfan__chest-marker-style-toggle .button-container{display:flex;gap:.1rem}.wegfan__chest-marker-style-toggle .button-container .button{height:.24rem;width:.57rem;border-radius:.06rem;background-color:#323947;background-position:50%;background-repeat:no-repeat;background-size:100%;overflow:hidden;line-height:.24rem;text-align:center;display:inline-block;white-space:nowrap;text-overflow:ellipsis;cursor:pointer;position:relative}.wegfan__chest-marker-style-toggle .button.selected{color:#d3bc8e}.wegfan__chest-marker-style-toggle .button.selected:after{position:absolute;display:block;content:"";top:0;left:0;width:100%;height:100%;border:.5px solid #d3bc8e;border-radius:.06rem;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:2} ');

(function (i18next, VM) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const VM__namespace = /*#__PURE__*/_interopNamespaceDefault(VM);

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const languageDetector = {
    type: "languageDetector",
    async: false,
    detect() {
      const url = new URL(location.href);
      const lang = url.searchParams.get("lang");
      if (lang) {
        return lang;
      }
      if (url.host.includes("webstatic.mihoyo.com")) {
        return "zh-cn";
      }
      if (url.host.includes("act.hoyolab.com")) {
        return "en-us";
      }
      return "en-us";
    }
  };
  const translation$1 = {
    "解谜宝箱显示样式": '"Puzzle Chest" pin style',
    "品质": "Type",
    "获取方式": "Obtain way"
  };
  const enUs = {
    translation: translation$1
  };
  const translation = {
    "解谜宝箱显示样式": "解谜宝箱显示样式",
    "品质": "品质",
    "获取方式": "获取方式"
  };
  const zhCn = {
    translation
  };
  const i18n = i18next.createInstance({
    debug: false,
    initImmediate: false,
    lowerCaseLng: true,
    fallbackLng: "en-us",
    resources: {
      "en-us": enUs,
      "zh-cn": zhCn
    }
  }).use(languageDetector);
  let i18nInited = false;
  const init = () => {
    var _a, _b;
    const map = (_b = (_a = document.querySelector(".mhy-game-gis")) == null ? void 0 : _a.__vue__) == null ? void 0 : _b.map;
    const markerLayers = Object.values((map == null ? void 0 : map._layers) ?? {}).filter((layer) => layer._drawMarker);
    if (!map || !markerLayers) {
      return;
    }
    if (!i18nInited) {
      i18n.init();
      i18nInited = true;
    }
    const insertMarkerStyleTogglePanel = () => {
      const className = "wegfan__chest-marker-style-toggle";
      if (document.querySelector(`.${className}`)) {
        return;
      }
      const chestFilterPanelContentElement = document.querySelector('[id="13"]>div.filter-panel__labels-content');
      if (!chestFilterPanelContentElement) {
        return;
      }
      const panelElement = VM__namespace.m(
        /* @__PURE__ */ VM__namespace.h("div", { className: "wegfan__chest-marker-style-toggle" }, /* @__PURE__ */ VM__namespace.h("div", { className: "chest-marker-style-option" }, /* @__PURE__ */ VM__namespace.h("span", null, i18n.t("解谜宝箱显示样式")), /* @__PURE__ */ VM__namespace.h("div", { className: "button-container" }, /* @__PURE__ */ VM__namespace.h("div", { className: "button", "data-chest-marker-style-index": "1", title: i18n.t("品质") }, i18n.t("品质")), /* @__PURE__ */ VM__namespace.h("div", { className: "button", "data-chest-marker-style-index": "2", title: i18n.t("获取方式") }, i18n.t("获取方式")))))
      );
      chestFilterPanelContentElement.parentElement.insertBefore(panelElement, chestFilterPanelContentElement);
      const buttons = panelElement.querySelectorAll(".chest-marker-style-option .button");
      const toggleMarkerStyle = (event) => {
        event.preventDefault();
        buttons.forEach((button) => button.classList.remove("selected"));
        event.target.classList.add("selected");
        _GM_setValue("markerStyle", event.target.getAttribute("data-chest-marker-style-index"));
        markerLayers.forEach((layer) => {
          layer._latlngMarkers.dirty = 1;
          layer._latlngMarkers.total = 1;
          layer.redraw();
        });
      };
      buttons.forEach((button) => {
        if (button.getAttribute("data-chest-marker-style-index") === _GM_getValue("markerStyle", "1")) {
          button.classList.add("selected");
        }
        button.addEventListener("click", toggleMarkerStyle);
        button.addEventListener("touchend", toggleMarkerStyle);
      });
    };
    const hookMapDrawMarker = (layer) => {
      if (layer._wegfan_toggleChestMarkerStyleHooked) {
        return;
      }
      layer._drawMarker = function(t, e) {
        var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
        let n = this;
        this._imageLookup || (this._imageLookup = {}), e || (e = n._map.latLngToContainerPoint(t.getLatLng()));
        let iconUrl = t.options.icon.options.iconUrl;
        const markerStyle = _GM_getValue("markerStyle", "1");
        if (markerStyle === "2") {
          let extAttrs = (_b2 = (_a2 = t == null ? void 0 : t.attrs) == null ? void 0 : _a2.marker) == null ? void 0 : _b2.ext_attrs;
          if (extAttrs) {
            let chestSource = (_c = JSON.parse(extAttrs)) == null ? void 0 : _c["3"];
            let sourceIconUrl = (_j = (_i = (_h = (_g = (_f = (_e = (_d = t == null ? void 0 : t.attrs) == null ? void 0 : _d.config) == null ? void 0 : _e.group) == null ? void 0 : _f.ext_attr_list) == null ? void 0 : _g[0]) == null ? void 0 : _h.children) == null ? void 0 : _i[chestSource]) == null ? void 0 : _j.icon;
            if (sourceIconUrl) {
              iconUrl = sourceIconUrl;
            }
          }
        }
        if (t.canvas_img && t.previousChestMarkerStyle !== markerStyle) {
          t.canvas_img = null;
        }
        t.previousChestMarkerStyle = markerStyle;
        if (t.canvas_img) {
          n._drawImage(t, e);
        } else if (n._imageLookup[iconUrl]) {
          t.canvas_img = n._imageLookup[iconUrl][0], false === n._imageLookup[iconUrl][1] ? n._imageLookup[iconUrl][2].push([
            t,
            e
          ]) : n._drawImage(t, e);
        } else {
          let r = new Image();
          r.crossOrigin = "Anonymous", r.src = iconUrl, t.canvas_img = r, n._imageLookup[iconUrl] = [
            r,
            false,
            [
              [
                t,
                e
              ]
            ]
          ], r.onload = function() {
            n._imageLookup[iconUrl][1] = true, n._imageLookup[iconUrl][2].forEach(function(t2) {
              n._drawImage(t2[0], t2[1]);
            });
          };
        }
      };
      layer._wegfan_toggleChestMarkerStyleHooked = true;
    };
    insertMarkerStyleTogglePanel();
    markerLayers.forEach((layer) => {
      hookMapDrawMarker(layer);
    });
  };
  init();
  setInterval(init, 500);

})(i18next, VM);
