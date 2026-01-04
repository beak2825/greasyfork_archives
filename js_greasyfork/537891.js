// ==UserScript==
// @name               larger thumbnails v2
// @name:zh-CN         封面大图v2
// @namespace          https://github.com/kygo233/tkjs/tree/v2
// @version            2025.06.01
// @author             kygo233
// @description        Show larger thumbnails on javbus and javdb. 123av,jable,and missav can get magnet from javbus
// @description:zh-CN  javbus和javdb显示大图封面; 123av,jable,missav获取javbus的磁力
// @license            MIT
// @homepage           https://greasyfork.org/zh-CN/scripts/537891-larger-thumbnails-v2
// @include            /^https?:\/\/.*(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\..*$/
// @include            /^https?:\/\/.*(javdb)[0-9]*\..*$/
// @include            /^https?:\/\/.*(missav)\.(ws|ai).*$/
// @include            /^https?:\/\/.*(123av\.com|123av\.ws|1av\.to).*$/
// @include            /^https?:\/\/.*(jable\.tv).*$/
// @connect            javbus.com
// @connect            javfree.me
// @connect            blogjav.net
// @connect            missav.ws
// @connect            *
// @grant              GM_addStyle
// @grant              GM_download
// @grant              GM_getValue
// @grant              GM_setClipboard
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/537891/%E5%B0%81%E9%9D%A2%E5%A4%A7%E5%9B%BEv2.user.js
// @updateURL https://update.greasyfork.org/scripts/537891/%E5%B0%81%E9%9D%A2%E5%A4%A7%E5%9B%BEv2.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .hidden-b{display:none!important}.alert-zdy{position:fixed;white-space:nowrap;top:50%;left:50%;padding:10px;font-size:20px;color:#fff;background-color:#000000bf;border-radius:5px;z-index:1051;transform:translate(-50%,-50%)}.alert-close{display:inline-block;padding:0 0 0 10px;color:gray;cursor:pointer}.btn-copy{display:block;margin:auto;border:none;color:#fff;white-space:nowrap;background-color:#dc3545;padding:.375rem .75rem;border-radius:.25rem}[data-theme=dark] body[javdb] #grid-b a.box-b{color:#d1d1d1;background-color:#222}[data-theme=dark] body[javdb] .alert-zdy{color:#000;background-color:#ffffffe5}[data-theme=light] body[javdb] #myModal .modal-content-b[id^=magnet]{background-color:#ffffffe5}body[javdb] #myModal #modal-div article.message{margin-bottom:0}body[javdb] .max-width-100{max-width:100%!important}body[missav] #myModal,body[missav] .alert-zdy,body[missav] .menu-b{z-index:2147483648!important}body[missav] div.scroll-status{color:#dbdbdb}body[jable] #myModal,body[jable] .alert-zdy{z-index:1901}.menu-b.svelte-1tay3fy{position:fixed;z-index:1030;left:0;top:0;display:flex;flex-direction:column}.menu-b.svelte-1tay3fy .menu-tool:where(.svelte-1tay3fy){width:30px;height:30px;cursor:pointer;font-size:20px;opacity:0}.menu-b.svelte-1tay3fy .menu-tool:where(.svelte-1tay3fy):hover{opacity:1}.menu-b.svelte-1tay3fy .menu-tool:where(.svelte-1tay3fy).menu-tool-opacity{opacity:1}.menu-list.svelte-1tay3fy{padding:5px;background:linear-gradient(to left top,#f3fef4,#fbfbfb);color:#000;border-radius:5px;font-size:large;font-weight:550;box-shadow:0 10px 20px #0000007f;animation:fadeInUp .2s ease-out;max-height:calc(99vh - 30px);overflow-y:auto}.menu-list.svelte-1tay3fy>div:where(.svelte-1tay3fy){display:flex;align-items:center;padding:5px;border-radius:5px}.menu-list.svelte-1tay3fy>div:where(.svelte-1tay3fy):hover{background-color:#39563637}.menu-list.svelte-1tay3fy input:where(.svelte-1tay3fy){margin:0;padding:0}.menu-list.svelte-1tay3fy label:where(.svelte-1tay3fy){margin:0;padding:0 5px}.menu-list.svelte-1tay3fy .checkbox-div:where(.svelte-1tay3fy) label:where(.svelte-1tay3fy){flex-grow:1}.menu-list.svelte-1tay3fy .range-div:where(.svelte-1tay3fy) input:where(.svelte-1tay3fy){width:250px}.menu-list.svelte-1tay3fy .range-div:where(.svelte-1tay3fy) input:where(.svelte-1tay3fy):disabled+span:where(.svelte-1tay3fy){opacity:.5}.menu-list.svelte-1tay3fy .input-div:where(.svelte-1tay3fy) input:where(.svelte-1tay3fy){border-radius:3px;border:1px solid rgb(0,0,0,.5);padding:3px;font-size:medium;flex-grow:1;outline:none}.menu-list.svelte-1tay3fy .radio-div:where(.svelte-1tay3fy) label:where(.svelte-1tay3fy){font-weight:initial}.scroll-status.svelte-3t0pvd{display:flex;align-items:center;justify-content:center;height:15px;font-size:20px}.scroll-status.svelte-3t0pvd .scroll-load:where(.svelte-3t0pvd){width:100px;height:5px;border-radius:10px;background:currentColor;opacity:.5}.preview-panel.svelte-1i4knad{min-height:100vh}.preview-panel.svelte-1i4knad ul.preview-title-ul:where(.svelte-1i4knad){margin:0;padding:10px 10px 10px 40px;list-style-type:disc}.preview-panel.svelte-1i4knad .preview-dwonload:where(.svelte-1i4knad){position:absolute;border-radius:3px;padding:3px;right:0;z-index:2;cursor:pointer;background-color:#3333338d;color:#f0f8ff}.preview-panel.svelte-1i4knad .preview-dwonload:where(.svelte-1i4knad)>svg{width:25px;height:25px;vertical-align:middle}.preview-panel.svelte-1i4knad .preview-dwonload:where(.svelte-1i4knad).span-loading{animation:span-loading 1s infinite}.preview-panel.svelte-1i4knad .preview-title:where(.svelte-1i4knad){color:#ffffff7f;font-size:20px;cursor:pointer}.preview-panel.svelte-1i4knad .preview-title-current:where(.svelte-1i4knad){color:#fff}.preview-panel.svelte-1i4knad .preview-title-loading:where(.svelte-1i4knad){animation:svelte-1i4knad-changeTextColor 1s ease-in infinite}.preview-panel.svelte-1i4knad .img-none:where(.svelte-1i4knad){color:#fff;font-size:30px;margin-left:20px}.preview-panel.svelte-1i4knad .preview-img:where(.svelte-1i4knad){width:100%;cursor:zoom-in}.preview-panel.svelte-1i4knad .preview-img:where(.svelte-1i4knad).img-zoom{max-width:120%;width:120%;margin:0 -10%;cursor:zoom-out}@keyframes svelte-1i4knad-changeTextColor{0%,to{color:#fff}50%{color:#ffffff80}}#myModal.svelte-196dhj1{overflow-x:hidden;overflow-y:auto;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1050;background-color:#000000bf;display:flex;justify-content:center;align-items:center}#modal-div.svelte-196dhj1{position:relative;width:80%;max-width:1400px;animation:svelte-196dhj1-fadeInDown .5s ease-out;max-height:100vh}#modal-div.svelte-196dhj1 .modal-content-b{background-color:#00000080;border-radius:5px}#modal-div.svelte-196dhj1 .sample-box-zdy,#modal-div.svelte-196dhj1 .avatar-box-zdy{display:inline-block;border-radius:5px;background-color:#fff;text-align:center;margin:0 5px 5px 0;width:130px}#modal-div.svelte-196dhj1 .sample-box-zdy .photo-frame{overflow:hidden;margin:5px}#modal-div.svelte-196dhj1 .sample-box-zdy img{height:90px}#modal-div.svelte-196dhj1 .avatar-box-zdy .photo-frame{overflow:hidden;height:120px;margin:5px}#modal-div.svelte-196dhj1 .avatar-box-zdy img{height:120px}#modal-div.svelte-196dhj1 .avatar-box-zdy span{font-weight:700;word-wrap:break-word;padding:5px;line-height:22px;color:#333}#modal-div.svelte-196dhj1 .javbus-table{width:100%;background-color:#fff;border-radius:5px;overflow:hidden}#modal-div.svelte-196dhj1 .javbus-table tr td:first-child{padding-left:10px}#modal-div.svelte-196dhj1 .javbus-table tr:hover{background-color:#d4d4d4!important}#modal-div.svelte-196dhj1 .javbus-table a.btn{color:#fff;padding:1px 3px;white-space:nowrap;border-radius:.25rem;opacity:.65}#modal-div.svelte-196dhj1 .javbus-table a.btn.btn-primary{background-color:#265a88}#modal-div.svelte-196dhj1 .javbus-table a.btn.btn-warning{background-color:#eb9316}@keyframes svelte-196dhj1-fadeInDown{0%{transform:translate3d(0,-50%,0);opacity:0}to{transform:none;opacity:1}}#grid-b.svelte-1ljjefi{display:flex;flex-wrap:wrap}#grid-b.svelte-1ljjefi .item-b:where(.svelte-1ljjefi){padding:5px;transition:width .5s;animation:fadeInUp .5s ease-out}#grid-b.svelte-1ljjefi .item-b:where(.svelte-1ljjefi) .avatar-box{display:flex;flex-direction:column;border-radius:5px;align-items:center;width:100%;margin:0}#grid-b.svelte-1ljjefi .item-b:where(.svelte-1ljjefi) .avatar-box .photo-frame{margin:5px}#grid-b.svelte-1ljjefi .item-b:where(.svelte-1ljjefi) .avatar-box p{margin:0!important}#grid-b.svelte-1ljjefi .box-b:where(.svelte-1ljjefi){display:block;border-radius:5px;background-color:#fff;border:1px solid rgba(0,0,0,.2);box-shadow:0 2px 3px #0000001a;overflow:hidden;color:#000}#grid-b.svelte-1ljjefi .box-b:where(.svelte-1ljjefi):visited .detail-title:where(.svelte-1ljjefi){color:gray}#grid-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi){position:relative}#grid-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi) img:where(.svelte-1ljjefi){position:absolute;bottom:0;left:0;width:100%;height:100%;object-fit:cover}#grid-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi) img:where(.svelte-1ljjefi):not([src]){visibility:hidden}#grid-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi) img.lazy.error{width:auto}#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi){padding:6px 8px}#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi) .info-bottom:where(.svelte-1ljjefi){display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi) .detail-title:where(.svelte-1ljjefi):hover,#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi) .detail-avid:where(.svelte-1ljjefi):hover{text-decoration:underline}#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi) .detail-avid:where(.svelte-1ljjefi){font-size:18px}#grid-b.svelte-1ljjefi .detail-b:where(.svelte-1ljjefi) .titleNowrap:where(.svelte-1ljjefi){white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#grid-b.full-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi){padding-top:67.25%}#grid-b.half-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi){padding-top:142.57%}#grid-b.half-b.svelte-1ljjefi .cover-b:where(.svelte-1ljjefi) img:where(.svelte-1ljjefi){object-position:right}.toolbar-b.svelte-1ljjefi{display:flex}.cover-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi{position:absolute;bottom:0;right:0;padding:16px 6px 6px 16px;opacity:0}.cover-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi:hover{opacity:1;animation:fadeInUp .5s ease-out}.cover-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi:has(span.span-loading:where(.svelte-1ljjefi)){opacity:1}.cover-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi){margin:2px;padding:4px;color:#0ff;background-color:#383838e6}.detail-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi){opacity:.6;padding:0 2px}.detail-b:where(.svelte-1ljjefi) .toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi):hover{opacity:1}.toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi){display:flex;border-radius:5px}.toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi) svg{width:24px;height:24px}.toolbar-b.svelte-1ljjefi span:where(.svelte-1ljjefi).span-loading{animation:span-loading 1s infinite}@keyframes span-loading{0%,to{transform:none;animation-timing-function:cubic-bezier(0,0,.2,1)}50%{transform:translateY(-15%);animation-timing-function:cubic-bezier(.8,0,1,1)}}@keyframes fadeInUp{0%{transform:translate3d(0,5%,0);opacity:.5}to{transform:none;opacity:1}}.magnet-grid.svelte-zo3rh{opacity:0;border-radius:5px;color:#e5e9f0;padding:5px;cursor:pointer}.magnet-grid.svelte-zo3rh svg{width:22px;height:22px}.magnet-grid.svelte-zo3rh:hover{opacity:1}body[missav] .magnet-grid.svelte-zo3rh{width:initial;height:initial;bottom:initial;left:initial;right:5px;top:5px;background-color:#1f2937bf}body[av123] .magnet-grid.svelte-zo3rh{position:absolute;right:10px;top:10px;background-color:#0006}body[jable] .magnet-grid.svelte-zo3rh{position:absolute;right:15px;top:5px;z-index:100;background-color:#00000080}.magnet-video.svelte-zo3rh{color:#eceff4;cursor:pointer}body[av123] .magnet-video.svelte-zo3rh{margin-left:10px}span.span-loading.svelte-zo3rh{opacity:1;animation:span-loading 1s infinite} ");

(function () {
  'use strict';

  var _a, _b;
  const [JAVBUS, JAVDB, MISSAV, AV123, JABLE, JAVFREE, BLOGJAV] = ["javbus", "javdb", "missav", "av123", "jable", "javfree", "blogjav"];
  const [GRID, VIDEO] = ["grid", "video"];
  const id = () => Math.random().toString(16).slice(2);
  const siteList = [
    {
      name: JAVBUS,
      domainReg: /^https?:\/\/.*(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\..*$/,
      excludePages: ["/actresses", "mdl=favor&sort=1", "mdl=favor&sort=2", "mdl=favor&sort=3", "mdl=favor&sort=4", "searchstar"],
      halfImgBlockPages: ["/uncensored", "mod=uc", "javbus.hair"],
      gridSelector: "div#waterfall",
      itemSelector: "div#waterfall>div.item",
      pageNext: "a#next",
      getAvItem: function(elem) {
        var _a2, _b2, _c, _d;
        let AVID = (_a2 = elem.querySelector("date")) == null ? void 0 : _a2.textContent;
        if (!AVID) return { html: elem.innerHTML };
        let href = (_b2 = elem.querySelector("a")) == null ? void 0 : _b2.href;
        let img = elem.querySelector("div.photo-frame>img");
        let src = img == null ? void 0 : img.src;
        if (src.match(/pics.dmm.co.jp/)) {
          src = src.replace(/ps.jpg/, "pl.jpg");
        } else if (src.match(/image.mgstage.com/)) {
          src = src.replace(/pf_o1_|pb_p_/, "pb_e_");
        } else {
          src = src.replace(/thumbs/, "cover").replace(/thumb/, "cover").replace(/.jpg/, "_b.jpg");
        }
        let title = img == null ? void 0 : img.title;
        let date = (_c = elem.querySelectorAll("date")[1]) == null ? void 0 : _c.textContent;
        let itemTag = (_d = elem.querySelector("div.photo-info div:first-of-type")) == null ? void 0 : _d.innerHTML;
        return { id: id(), AVID, href, src, title, date, itemTag, score: "" };
      }
    },
    {
      name: JAVDB,
      domainReg: /^https?:\/\/.*(javdb)[0-9]*\..*$/,
      excludePages: ["/users/"],
      halfImgBlockPages: ["/uncensored", "/western", "/video_uncensored", "/video_western"],
      itemSelector: "div.movie-list.h>div.item",
      pageNext: "a.pagination-next",
      getAvItem: function(elem) {
        var _a2, _b2, _c, _d, _e, _f, _g;
        let href = (_a2 = elem.querySelector("a")) == null ? void 0 : _a2.href;
        let src = (_b2 = elem.querySelector("div.cover > img")) == null ? void 0 : _b2.src;
        let title = (_c = elem.querySelector("a")) == null ? void 0 : _c.title;
        let AVID = (_d = elem.querySelector("div.video-title>strong")) == null ? void 0 : _d.textContent;
        let date = (_e = elem.querySelector("div.meta")) == null ? void 0 : _e.textContent;
        let score = (_f = elem.querySelector("div.score")) == null ? void 0 : _f.innerHTML;
        let itemTag = (_g = elem.querySelector(".tags.has-addons")) == null ? void 0 : _g.innerHTML;
        return { id: id(), AVID, href, src, title, date, itemTag, score };
      }
    },
    {
      name: MISSAV,
      domainReg: /^https?:\/\/.*(missav)\.(ws|ai).*$/,
      itemSelectorObj: {
        [GRID]: "div.grid[x-init]>div",
        [VIDEO]: `button[\\@click\\.prevent="togglePanel('share')"]`
      },
      pageNext: "a[rel=next]"
    },
    {
      name: AV123,
      domainReg: /^https?:\/\/.*(123av\.com|123av\.ws|1av\.to).*$/,
      itemSelectorObj: {
        [GRID]: "#page-list .box-item-list>div",
        [VIDEO]: "button.btn.favourite"
      },
      pageNext: ".pagination .active + li a"
    },
    {
      name: JABLE,
      domainReg: /^https?:\/\/.*(jable\.tv).*$/,
      itemSelectorObj: {
        [GRID]: "div[id^=list_videos_] div.row>div",
        [VIDEO]: ".video-info .my-3 button"
      }
    }
  ];
  const DEV = false;
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var array_from = Array.from;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  const noop = () => {
  };
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i2 = 0; i2 < arr.length; i2++) {
      arr[i2]();
    }
  }
  const DERIVED = 1 << 1;
  const EFFECT = 1 << 2;
  const RENDER_EFFECT = 1 << 3;
  const BLOCK_EFFECT = 1 << 4;
  const BRANCH_EFFECT = 1 << 5;
  const ROOT_EFFECT = 1 << 6;
  const BOUNDARY_EFFECT = 1 << 7;
  const UNOWNED = 1 << 8;
  const DISCONNECTED = 1 << 9;
  const CLEAN = 1 << 10;
  const DIRTY = 1 << 11;
  const MAYBE_DIRTY = 1 << 12;
  const INERT = 1 << 13;
  const DESTROYED = 1 << 14;
  const EFFECT_RAN = 1 << 15;
  const EFFECT_TRANSPARENT = 1 << 16;
  const LEGACY_DERIVED_PROP = 1 << 17;
  const HEAD_EFFECT = 1 << 19;
  const EFFECT_HAS_DERIVED = 1 << 20;
  const EFFECT_IS_UPDATING = 1 << 21;
  const STATE_SYMBOL = Symbol("$state");
  const LEGACY_PROPS = Symbol("legacy props");
  const LOADING_ATTR_SYMBOL = Symbol("");
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a2, b2) {
    return a2 != a2 ? b2 == b2 : a2 !== b2 || a2 !== null && typeof a2 === "object" || typeof a2 === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }
  function effect_in_teardown(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function props_invalid_value(key) {
    {
      throw new Error(`https://svelte.dev/e/props_invalid_value`);
    }
  }
  function state_descriptors_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  let legacy_mode_flag = false;
  let tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }
  const EACH_ITEM_REACTIVE = 1;
  const EACH_INDEX_REACTIVE = 1 << 1;
  const EACH_IS_CONTROLLED = 1 << 2;
  const EACH_IS_ANIMATED = 1 << 3;
  const EACH_ITEM_IMMUTABLE = 1 << 4;
  const PROPS_IS_IMMUTABLE = 1;
  const PROPS_IS_RUNES = 1 << 1;
  const PROPS_IS_UPDATED = 1 << 2;
  const PROPS_IS_BINDABLE = 1 << 3;
  const PROPS_IS_LAZY_INITIAL = 1 << 4;
  const TEMPLATE_FRAGMENT = 1;
  const TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  const UNINITIALIZED = Symbol();
  const NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  function lifecycle_outside_component(name) {
    {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }
  let component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  function push(props, runes = false, fn) {
    var ctx = component_context = {
      p: component_context,
      c: null,
      d: false,
      e: null,
      m: false,
      s: props,
      x: null,
      l: null
    };
    if (legacy_mode_flag && !runes) {
      component_context.l = {
        s: null,
        u: null,
        r1: [],
        r2: source(false)
      };
    }
    teardown(() => {
      ctx.d = true;
    });
  }
  function pop(component) {
    const context_stack_item = component_context;
    if (context_stack_item !== null) {
      if (component !== void 0) {
        context_stack_item.x = component;
      }
      const component_effects = context_stack_item.e;
      if (component_effects !== null) {
        var previous_effect = active_effect;
        var previous_reaction = active_reaction;
        context_stack_item.e = null;
        try {
          for (var i2 = 0; i2 < component_effects.length; i2++) {
            var component_effect = component_effects[i2];
            set_active_effect(component_effect.effect);
            set_active_reaction(component_effect.reaction);
            effect(component_effect.fn);
          }
        } finally {
          set_active_effect(previous_effect);
          set_active_reaction(previous_reaction);
        }
      }
      component_context = context_stack_item.p;
      context_stack_item.m = true;
    }
    return component || /** @type {T} */
    {};
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = /* @__PURE__ */ state(0);
    var reaction = active_reaction;
    var with_parent = (fn) => {
      var previous_reaction = active_reaction;
      set_active_reaction(reaction);
      var result = fn();
      set_active_reaction(previous_reaction);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", /* @__PURE__ */ state(
        /** @type {any[]} */
        value.length
      ));
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_2, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s2 = sources.get(prop2);
          if (s2 === void 0) {
            s2 = with_parent(() => /* @__PURE__ */ state(descriptor.value));
            sources.set(prop2, s2);
          } else {
            set(
              s2,
              with_parent(() => proxy(descriptor.value))
            );
          }
          return true;
        },
        deleteProperty(target, prop2) {
          var s2 = sources.get(prop2);
          if (s2 === void 0) {
            if (prop2 in target) {
              sources.set(
                prop2,
                with_parent(() => /* @__PURE__ */ state(UNINITIALIZED))
              );
              update_version(version);
            }
          } else {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n2 = Number(prop2);
              if (Number.isInteger(n2) && n2 < ls.v) {
                set(ls, n2);
              }
            }
            set(s2, UNINITIALIZED);
            update_version(version);
          }
          return true;
        },
        get(target, prop2, receiver) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          var s2 = sources.get(prop2);
          var exists = prop2 in target;
          if (s2 === void 0 && (!exists || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            s2 = with_parent(() => /* @__PURE__ */ state(proxy(exists ? target[prop2] : UNINITIALIZED)));
            sources.set(prop2, s2);
          }
          if (s2 !== void 0) {
            var v2 = get(s2);
            return v2 === UNINITIALIZED ? void 0 : v2;
          }
          return Reflect.get(target, prop2, receiver);
        },
        getOwnPropertyDescriptor(target, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor && "value" in descriptor) {
            var s2 = sources.get(prop2);
            if (s2) descriptor.value = get(s2);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2 == null ? void 0 : source2.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target, prop2) {
          var _a2;
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s2 = sources.get(prop2);
          var has = s2 !== void 0 && s2.v !== UNINITIALIZED || Reflect.has(target, prop2);
          if (s2 !== void 0 || active_effect !== null && (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable))) {
            if (s2 === void 0) {
              s2 = with_parent(() => /* @__PURE__ */ state(has ? proxy(target[prop2]) : UNINITIALIZED));
              sources.set(prop2, s2);
            }
            var value2 = get(s2);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target, prop2, value2, receiver) {
          var _a2;
          var s2 = sources.get(prop2);
          var has = prop2 in target;
          if (is_proxied_array && prop2 === "length") {
            for (var i2 = value2; i2 < /** @type {Source<number>} */
            s2.v; i2 += 1) {
              var other_s = sources.get(i2 + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i2 in target) {
                other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
                sources.set(i2 + "", other_s);
              }
            }
          }
          if (s2 === void 0) {
            if (!has || ((_a2 = get_descriptor(target, prop2)) == null ? void 0 : _a2.writable)) {
              s2 = with_parent(() => /* @__PURE__ */ state(void 0));
              set(
                s2,
                with_parent(() => proxy(value2))
              );
              sources.set(prop2, s2);
            }
          } else {
            has = s2.v !== UNINITIALIZED;
            set(
              s2,
              with_parent(() => proxy(value2))
            );
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target, prop2);
          if (descriptor == null ? void 0 : descriptor.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n2 = Number(prop2);
              if (Number.isInteger(n2) && n2 >= ls.v) {
                set(ls, n2 + 1);
              }
            }
            update_version(version);
          }
          return true;
        },
        ownKeys(target) {
          get(version);
          var own_keys = Reflect.ownKeys(target).filter((key2) => {
            var source3 = sources.get(key2);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key in target)) {
              own_keys.push(key);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function update_version(signal, d2 = 1) {
    set(signal, signal.v + d2);
  }
  function get_proxied_value(value) {
    try {
      if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
        return value[STATE_SYMBOL];
      }
    } catch {
    }
    return value;
  }
  function is(a2, b2) {
    return Object.is(get_proxied_value(a2), get_proxied_value(b2));
  }
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags = DERIVED | DIRTY;
    var parent_derived = active_reaction !== null && (active_reaction.f & DERIVED) !== 0 ? (
      /** @type {Derived} */
      active_reaction
    ) : null;
    if (active_effect === null || parent_derived !== null && (parent_derived.f & UNOWNED) !== 0) {
      flags |= UNOWNED;
    } else {
      active_effect.f |= EFFECT_HAS_DERIVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        null
      ),
      wv: 0,
      parent: parent_derived ?? active_effect
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d2 = /* @__PURE__ */ derived(fn);
    push_reaction_value(d2);
    return d2;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived2) {
    var effects = derived2.effects;
    if (effects !== null) {
      derived2.effects = null;
      for (var i2 = 0; i2 < effects.length; i2 += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i2]
        );
      }
    }
  }
  function get_derived_parent_effect(derived2) {
    var parent = derived2.parent;
    while (parent !== null) {
      if ((parent.f & DERIVED) === 0) {
        return (
          /** @type {Effect} */
          parent
        );
      }
      parent = parent.parent;
    }
    return null;
  }
  function execute_derived(derived2) {
    var value;
    var prev_active_effect = active_effect;
    set_active_effect(get_derived_parent_effect(derived2));
    {
      try {
        destroy_derived_effects(derived2);
        value = update_reaction(derived2);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived2) {
    var value = execute_derived(derived2);
    if (!derived2.equals(value)) {
      derived2.v = value;
      derived2.wv = increment_write_version();
    }
    if (is_destroying_effect) return;
    var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
    set_signal_status(derived2, status);
  }
  const old_values = /* @__PURE__ */ new Map();
  function source(v2, stack) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v: v2,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v2, stack) {
    const s2 = source(v2);
    push_reaction_value(s2);
    return s2;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false) {
    var _a2;
    const s2 = source(initial_value);
    if (!immutable) {
      s2.equals = safe_equals;
    }
    if (legacy_mode_flag && component_context !== null && component_context.l !== null) {
      ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s2);
    }
    return s2;
  }
  function mutate(source2, value) {
    set(
      source2,
      untrack(() => get(source2))
    );
    return value;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && !untracking && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && !(reaction_sources == null ? void 0 : reaction_sources.includes(source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    return internal_set(source2, new_value);
  }
  function internal_set(source2, value) {
    if (!source2.equals(value)) {
      var old_value = source2.v;
      if (is_destroying_effect) {
        old_values.set(source2, value);
      } else {
        old_values.set(source2, old_value);
      }
      source2.v = value;
      if ((source2.f & DERIVED) !== 0) {
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(
            /** @type {Derived} */
            source2
          );
        }
        set_signal_status(source2, (source2.f & UNOWNED) === 0 ? CLEAN : MAYBE_DIRTY);
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
    return value;
  }
  function mark_reactions(signal, status) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i2 = 0; i2 < length; i2++) {
      var reaction = reactions[i2];
      var flags = reaction.f;
      if ((flags & DIRTY) !== 0) continue;
      if (!runes && reaction === active_effect) continue;
      set_signal_status(reaction, status);
      if ((flags & (CLEAN | UNOWNED)) !== 0) {
        if ((flags & DERIVED) !== 0) {
          mark_reactions(
            /** @type {Derived} */
            reaction,
            MAYBE_DIRTY
          );
        } else {
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  let hydrating = false;
  var $window;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype.__click = void 0;
      element_prototype.__className = void 0;
      element_prototype.__attributes = null;
      element_prototype.__style = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype.__t = void 0;
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return first_child_getter.call(node);
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return next_sibling_getter.call(node);
  }
  function child(node, is_text) {
    {
      return /* @__PURE__ */ get_first_child(node);
    }
  }
  function first_child(fragment, is_text) {
    {
      var first = (
        /** @type {DocumentFragment} */
        /* @__PURE__ */ get_first_child(
          /** @type {Node} */
          fragment
        )
      );
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = node;
    while (count--) {
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    {
      return next_sibling;
    }
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function validate_effect(rune) {
    if (active_effect === null && active_reaction === null) {
      effect_orphan();
    }
    if (active_reaction !== null && (active_reaction.f & UNOWNED) !== 0 && active_effect === null) {
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown();
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn, sync, push2 = true) {
    var parent = active_effect;
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes_start: null,
      nodes_end: null,
      f: type | DIRTY,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      prev: null,
      teardown: null,
      transitions: null,
      wv: 0
    };
    if (sync) {
      try {
        update_effect(effect2);
        effect2.f |= EFFECT_RAN;
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
    } else if (fn !== null) {
      schedule_effect(effect2);
    }
    var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & (EFFECT_HAS_DERIVED | BOUNDARY_EFFECT)) === 0;
    if (!inert && push2) {
      if (parent !== null) {
        push_effect(effect2, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
        var derived2 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived2.effects ?? (derived2.effects = [])).push(effect2);
      }
    }
    return effect2;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null, false);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect();
    var defer = active_effect !== null && (active_effect.f & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.m;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push({
        fn,
        effect: active_effect,
        reaction: active_reaction
      });
    } else {
      var signal = effect(fn);
      return signal;
    }
  }
  function user_pre_effect(fn) {
    validate_effect();
    return render_effect(fn);
  }
  function component_root(fn) {
    const effect2 = create_effect(ROOT_EFFECT, fn, true);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn, false);
  }
  function render_effect(fn) {
    return create_effect(RENDER_EFFECT, fn, true);
  }
  function template_effect(fn, thunks = [], d2 = derived) {
    const deriveds = thunks.map(d2);
    const effect2 = () => fn(...deriveds.map(get));
    return block(effect2);
  }
  function block(fn, flags = 0) {
    return create_effect(RENDER_EFFECT | BLOCK_EFFECT | flags, fn, true);
  }
  function branch(fn, push2 = true) {
    return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null) {
      remove_effect_dom(
        effect2.nodes_start,
        /** @type {TemplateNode} */
        effect2.nodes_end
      );
      removed = true;
    }
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    set_signal_status(effect2, DESTROYED);
    var transitions = effect2.transitions;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect2);
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes_start = effect2.nodes_end = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next = node === end ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next = effect2.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    run_out_transitions(transitions, () => {
      destroy_effect(effect2);
      if (callback) callback();
    });
  }
  function run_out_transitions(transitions, fn) {
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition of transitions) {
        transition.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transitions.push(transition);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      effect2.f ^= CLEAN;
    }
    if (check_dirtiness(effect2)) {
      set_signal_status(effect2, DIRTY);
      schedule_effect(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    if (effect2.transitions !== null) {
      for (const transition of effect2.transitions) {
        if (transition.is_global || local) {
          transition.in();
        }
      }
    }
  }
  let micro_tasks = [];
  let idle_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function run_idle_tasks() {
    var tasks = idle_tasks;
    idle_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0) {
      queueMicrotask(run_micro_tasks);
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    if (micro_tasks.length > 0) {
      run_micro_tasks();
    }
    if (idle_tasks.length > 0) {
      run_idle_tasks();
    }
  }
  let is_throwing_error = false;
  let is_flushing = false;
  let last_scheduled_effect = null;
  let is_updating_effect = false;
  let is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  let queued_root_effects = [];
  let active_reaction = null;
  let untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  let active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  let reaction_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && active_reaction.f & EFFECT_IS_UPDATING) {
      if (reaction_sources === null) {
        reaction_sources = [value];
      } else {
        reaction_sources.push(value);
      }
    }
  }
  let new_deps = null;
  let skipped_deps = 0;
  let untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  let write_version = 1;
  let read_version = 0;
  let skip_reaction = false;
  function increment_write_version() {
    return ++write_version;
  }
  function check_dirtiness(reaction) {
    var _a2;
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) {
      return true;
    }
    if ((flags & MAYBE_DIRTY) !== 0) {
      var dependencies = reaction.deps;
      var is_unowned = (flags & UNOWNED) !== 0;
      if (dependencies !== null) {
        var i2;
        var dependency;
        var is_disconnected = (flags & DISCONNECTED) !== 0;
        var is_unowned_connected = is_unowned && active_effect !== null && !skip_reaction;
        var length = dependencies.length;
        if (is_disconnected || is_unowned_connected) {
          var derived2 = (
            /** @type {Derived} */
            reaction
          );
          var parent = derived2.parent;
          for (i2 = 0; i2 < length; i2++) {
            dependency = dependencies[i2];
            if (is_disconnected || !((_a2 = dependency == null ? void 0 : dependency.reactions) == null ? void 0 : _a2.includes(derived2))) {
              (dependency.reactions ?? (dependency.reactions = [])).push(derived2);
            }
          }
          if (is_disconnected) {
            derived2.f ^= DISCONNECTED;
          }
          if (is_unowned_connected && parent !== null && (parent.f & UNOWNED) === 0) {
            derived2.f ^= UNOWNED;
          }
        }
        for (i2 = 0; i2 < length; i2++) {
          dependency = dependencies[i2];
          if (check_dirtiness(
            /** @type {Derived} */
            dependency
          )) {
            update_derived(
              /** @type {Derived} */
              dependency
            );
          }
          if (dependency.wv > reaction.wv) {
            return true;
          }
        }
      }
      if (!is_unowned || active_effect !== null && !skip_reaction) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function propagate_error(error, effect2) {
    var current = effect2;
    while (current !== null) {
      if ((current.f & BOUNDARY_EFFECT) !== 0) {
        try {
          current.fn(error);
          return;
        } catch {
          current.f ^= BOUNDARY_EFFECT;
        }
      }
      current = current.parent;
    }
    is_throwing_error = false;
    throw error;
  }
  function should_rethrow_error(effect2) {
    return (effect2.f & DESTROYED) === 0 && (effect2.parent === null || (effect2.parent.f & BOUNDARY_EFFECT) === 0);
  }
  function handle_error(error, effect2, previous_effect, component_context2) {
    if (is_throwing_error) {
      if (previous_effect === null) {
        is_throwing_error = false;
      }
      if (should_rethrow_error(effect2)) {
        throw error;
      }
      return;
    }
    if (previous_effect !== null) {
      is_throwing_error = true;
    }
    propagate_error(error, effect2);
    if (should_rethrow_error(effect2)) {
      throw error;
    }
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root2 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    for (var i2 = 0; i2 < reactions.length; i2++) {
      var reaction = reactions[i2];
      if (reaction_sources == null ? void 0 : reaction_sources.includes(signal)) continue;
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root2) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_skip_reaction = skip_reaction;
    var previous_reaction_sources = reaction_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var flags = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    skip_reaction = (flags & UNOWNED) !== 0 && (untracking || !is_updating_effect || active_reaction === null);
    active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    reaction_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    read_version++;
    reaction.f |= EFFECT_IS_UPDATING;
    try {
      var result = (
        /** @type {Function} */
        (0, reaction.fn)()
      );
      var deps = reaction.deps;
      if (new_deps !== null) {
        var i2;
        remove_reactions(reaction, skipped_deps);
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i2 = 0; i2 < new_deps.length; i2++) {
            deps[skipped_deps + i2] = new_deps[i2];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (!skip_reaction) {
          for (i2 = skipped_deps; i2 < deps.length; i2++) {
            ((_a2 = deps[i2]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i2 = 0; i2 < /** @type {Source[]} */
        untracked_writes.length; i2++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i2],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      return result;
    } finally {
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      skip_reaction = previous_skip_reaction;
      reaction_sources = previous_reaction_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      reaction.f ^= EFFECT_IS_UPDATING;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !new_deps.includes(dependency))) {
      set_signal_status(dependency, MAYBE_DIRTY);
      if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
        dependency.f ^= DISCONNECTED;
      }
      destroy_derived_effects(
        /** @type {Derived} **/
        dependency
      );
      remove_reactions(
        /** @type {Derived} **/
        dependency,
        0
      );
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i2 = start_index; i2 < dependencies.length; i2++) {
      remove_reaction(signal, dependencies[i2]);
    }
  }
  function update_effect(effect2) {
    var flags = effect2.f;
    if ((flags & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var previous_component_context = component_context;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    try {
      if ((flags & BLOCK_EFFECT) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      var deps = effect2.deps;
      var dep;
      if (DEV && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && deps !== null) ;
      if (DEV) ;
    } catch (error) {
      handle_error(error, effect2, previous_effect, previous_component_context || effect2.ctx);
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
    }
  }
  function infinite_loop_guard() {
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      if (last_scheduled_effect !== null) {
        {
          handle_error(error, last_scheduled_effect, null);
        }
      } else {
        throw error;
      }
    }
  }
  function flush_queued_root_effects() {
    var was_updating_effect = is_updating_effect;
    try {
      var flush_count = 0;
      is_updating_effect = true;
      while (queued_root_effects.length > 0) {
        if (flush_count++ > 1e3) {
          infinite_loop_guard();
        }
        var root_effects = queued_root_effects;
        var length = root_effects.length;
        queued_root_effects = [];
        for (var i2 = 0; i2 < length; i2++) {
          var collected_effects = process_effects(root_effects[i2]);
          flush_queued_effects(collected_effects);
        }
        old_values.clear();
      }
    } finally {
      is_flushing = false;
      is_updating_effect = was_updating_effect;
      last_scheduled_effect = null;
    }
  }
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    for (var i2 = 0; i2 < length; i2++) {
      var effect2 = effects[i2];
      if ((effect2.f & (DESTROYED | INERT)) === 0) {
        try {
          if (check_dirtiness(effect2)) {
            update_effect(effect2);
            if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
              if (effect2.teardown === null) {
                unlink_effect(effect2);
              } else {
                effect2.fn = null;
              }
            }
          }
        } catch (error) {
          handle_error(error, effect2, null, effect2.ctx);
        }
      }
    }
  }
  function schedule_effect(signal) {
    if (!is_flushing) {
      is_flushing = true;
      queueMicrotask(flush_queued_root_effects);
    }
    var effect2 = last_scheduled_effect = signal;
    while (effect2.parent !== null) {
      effect2 = effect2.parent;
      var flags = effect2.f;
      if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags & CLEAN) === 0) return;
        effect2.f ^= CLEAN;
      }
    }
    queued_root_effects.push(effect2);
  }
  function process_effects(root2) {
    var effects = [];
    var effect2 = root2;
    while (effect2 !== null) {
      var flags = effect2.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      if (!is_skippable_branch && (flags & INERT) === 0) {
        if ((flags & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (is_branch) {
          effect2.f ^= CLEAN;
        } else {
          try {
            if (check_dirtiness(effect2)) {
              update_effect(effect2);
            }
          } catch (error) {
            handle_error(error, effect2, null, effect2.ctx);
          }
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      var parent = effect2.parent;
      effect2 = effect2.next;
      while (effect2 === null && parent !== null) {
        effect2 = parent.next;
        parent = parent.parent;
      }
    }
    return effects;
  }
  function flushSync(fn) {
    var result;
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        return (
          /** @type {T} */
          result
        );
      }
      is_flushing = true;
      flush_queued_root_effects();
    }
  }
  async function tick() {
    await Promise.resolve();
    flushSync();
  }
  function get(signal) {
    var flags = signal.f;
    var is_derived = (flags & DERIVED) !== 0;
    if (active_reaction !== null && !untracking) {
      if (!(reaction_sources == null ? void 0 : reaction_sources.includes(signal))) {
        var deps = active_reaction.deps;
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else if (!skip_reaction || !new_deps.includes(signal)) {
            new_deps.push(signal);
          }
        }
      }
    } else if (is_derived && /** @type {Derived} */
    signal.deps === null && /** @type {Derived} */
    signal.effects === null) {
      var derived2 = (
        /** @type {Derived} */
        signal
      );
      var parent = derived2.parent;
      if (parent !== null && (parent.f & UNOWNED) === 0) {
        derived2.f ^= UNOWNED;
      }
    }
    if (is_derived) {
      derived2 = /** @type {Derived} */
      signal;
      if (check_dirtiness(derived2)) {
        update_derived(derived2);
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    return signal.v;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  const STATUS_MASK = -7169;
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key in value) {
        const prop2 = value[key];
        if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
          deep_read(prop2);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key in value) {
        try {
          deep_read(value[key], visited);
        } catch (e2) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key in descriptors) {
          const get2 = descriptors[key].get;
          if (get2) {
            try {
              get2.call(value);
            } catch (e2) {
            }
          }
        }
      }
    }
  }
  const PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  let listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            var _a2;
            if (!evt.defaultPrevented) {
              for (
                const e2 of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                (_a2 = e2.__on_r) == null ? void 0 : _a2.call(e2);
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
        { capture: true }
      );
    }
  }
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
    element.addEventListener(event, () => without_reactive_context(handler));
    const prev = element.__on_r;
    if (prev) {
      element.__on_r = () => {
        prev();
        on_reset(true);
      };
    } else {
      element.__on_r = () => on_reset(true);
    }
    add_form_reset_listener();
  }
  const all_registered_events = /* @__PURE__ */ new Set();
  const root_event_handles = /* @__PURE__ */ new Set();
  function delegate(events) {
    for (var i2 = 0; i2 < events.length; i2++) {
      all_registered_events.add(events[i2]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  function handle_event_propagation(event) {
    var _a2;
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event.type;
    var path = ((_a2 = event.composedPath) == null ? void 0 : _a2.call(event)) || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event.target
    );
    var path_idx = 0;
    var handled_at = event.__root;
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event.__root = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event.target;
    if (current_target === handler_element) return;
    define_property(event, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated = current_target["__" + event_name];
          if (delegated != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event.target === current_target)) {
            if (is_array(delegated)) {
              var [fn, ...data] = delegated;
              fn.apply(current_target, [event, ...data]);
            } else {
              delegated.call(current_target, event);
            }
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event.__root = handler_element;
      delete event.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function create_fragment_from_html(html2) {
    var elem = document.createElement("template");
    elem.innerHTML = html2.replaceAll("<!>", "<!---->");
    return elem.content;
  }
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes_start === null) {
      effect2.nodes_start = start;
      effect2.nodes_end = end;
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags) {
    var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {Node} */
        /* @__PURE__ */ get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          /* @__PURE__ */ get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function comment() {
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }
  function set_text(text, value) {
    var str = value == null ? "" : typeof value === "object" ? value + "" : value;
    if (str !== (text.__t ?? (text.__t = text.nodeValue))) {
      text.__t = str;
      text.nodeValue = str + "";
    }
  }
  function mount(component, options) {
    return _mount(component, options);
  }
  const document_listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
    init_operations();
    var registered_events = /* @__PURE__ */ new Set();
    var event_handle = (events2) => {
      for (var i2 = 0; i2 < events2.length; i2++) {
        var event_name = events2[i2];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        target.addEventListener(event_name, handle_event_propagation, { passive });
        var n2 = document_listeners.get(event_name);
        if (n2 === void 0) {
          document.addEventListener(event_name, handle_event_propagation, { passive });
          document_listeners.set(event_name, 1);
        } else {
          document_listeners.set(event_name, n2 + 1);
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    var component = void 0;
    var unmount = component_root(() => {
      var anchor_node = anchor ?? target.appendChild(create_text());
      branch(() => {
        if (context) {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          ctx.c = context;
        }
        if (events) {
          props.$$events = events;
        }
        component = Component(anchor_node, props) || {};
        if (context) {
          pop();
        }
      });
      return () => {
        var _a2;
        for (var event_name of registered_events) {
          target.removeEventListener(event_name, handle_event_propagation);
          var n2 = (
            /** @type {number} */
            document_listeners.get(event_name)
          );
          if (--n2 === 0) {
            document.removeEventListener(event_name, handle_event_propagation);
            document_listeners.delete(event_name);
          } else {
            document_listeners.set(event_name, n2);
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          (_a2 = anchor_node.parentNode) == null ? void 0 : _a2.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component, unmount);
    return component;
  }
  let mounted_components = /* @__PURE__ */ new WeakMap();
  function if_block(node, fn, [root_index, hydrate_index] = [0, 0]) {
    var anchor = node;
    var consequent_effect = null;
    var alternate_effect = null;
    var condition = UNINITIALIZED;
    var flags = root_index > 0 ? EFFECT_TRANSPARENT : 0;
    var has_branch = false;
    const set_branch = (fn2, flag = true) => {
      has_branch = true;
      update_branch(flag, fn2);
    };
    const update_branch = (new_condition, fn2) => {
      if (condition === (condition = new_condition)) return;
      if (condition) {
        if (consequent_effect) {
          resume_effect(consequent_effect);
        } else if (fn2) {
          consequent_effect = branch(() => fn2(anchor));
        }
        if (alternate_effect) {
          pause_effect(alternate_effect, () => {
            alternate_effect = null;
          });
        }
      } else {
        if (alternate_effect) {
          resume_effect(alternate_effect);
        } else if (fn2) {
          alternate_effect = branch(() => fn2(anchor, [root_index + 1, hydrate_index]));
        }
        if (consequent_effect) {
          pause_effect(consequent_effect, () => {
            consequent_effect = null;
          });
        }
      }
    };
    block(() => {
      has_branch = false;
      fn(set_branch);
      if (!has_branch) {
        update_branch(null, null);
      }
    }, flags);
  }
  function index(_2, i2) {
    return i2;
  }
  function pause_effects(state2, items, controlled_anchor, items_map) {
    var transitions = [];
    var length = items.length;
    for (var i2 = 0; i2 < length; i2++) {
      pause_children(items[i2].e, transitions, true);
    }
    var is_controlled = length > 0 && transitions.length === 0 && controlled_anchor !== null;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        /** @type {Element} */
        controlled_anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(
        /** @type {Element} */
        controlled_anchor
      );
      items_map.clear();
      link(state2, items[0].prev, items[length - 1].next);
    }
    run_out_transitions(transitions, () => {
      for (var i3 = 0; i3 < length; i3++) {
        var item = items[i3];
        if (!is_controlled) {
          items_map.delete(item.k);
          link(state2, item.prev, item.next);
        }
        destroy_effect(item.e, !is_controlled);
      }
    });
  }
  function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
    var anchor = node;
    var state2 = { flags, items: /* @__PURE__ */ new Map(), first: null };
    var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = parent_node.appendChild(create_text());
    }
    var fallback = null;
    var was_empty = false;
    var each_array = /* @__PURE__ */ derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    block(() => {
      var array = get(each_array);
      var length = array.length;
      if (was_empty && length === 0) {
        return;
      }
      was_empty = length === 0;
      {
        reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection);
      }
      if (fallback_fn !== null) {
        if (length === 0) {
          if (fallback) {
            resume_effect(fallback);
          } else {
            fallback = branch(() => fallback_fn(anchor));
          }
        } else if (fallback !== null) {
          pause_effect(fallback, () => {
            fallback = null;
          });
        }
      }
      get(each_array);
    });
  }
  function reconcile(array, state2, anchor, render_fn, flags, get_key, get_collection) {
    var _a2, _b2, _c, _d;
    var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
    var should_update = (flags & (EACH_ITEM_REACTIVE | EACH_INDEX_REACTIVE)) !== 0;
    var length = array.length;
    var items = state2.items;
    var first = state2.first;
    var current = first;
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key;
    var item;
    var i2;
    if (is_animated) {
      for (i2 = 0; i2 < length; i2 += 1) {
        value = array[i2];
        key = get_key(value, i2);
        item = items.get(key);
        if (item !== void 0) {
          (_a2 = item.a) == null ? void 0 : _a2.measure();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(item);
        }
      }
    }
    for (i2 = 0; i2 < length; i2 += 1) {
      value = array[i2];
      key = get_key(value, i2);
      item = items.get(key);
      if (item === void 0) {
        var child_anchor = current ? (
          /** @type {TemplateNode} */
          current.e.nodes_start
        ) : anchor;
        prev = create_item(
          child_anchor,
          state2,
          prev,
          prev === null ? state2.first : prev.next,
          value,
          key,
          i2,
          render_fn,
          flags,
          get_collection
        );
        items.set(key, prev);
        matched = [];
        stashed = [];
        current = prev.next;
        continue;
      }
      if (should_update) {
        update_item(item, value, i2, flags);
      }
      if ((item.e.f & INERT) !== 0) {
        resume_effect(item.e);
        if (is_animated) {
          (_b2 = item.a) == null ? void 0 : _b2.unfix();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).delete(item);
        }
      }
      if (item !== current) {
        if (seen !== void 0 && seen.has(item)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j2;
            prev = start.prev;
            var a2 = matched[0];
            var b2 = matched[matched.length - 1];
            for (j2 = 0; j2 < matched.length; j2 += 1) {
              move(matched[j2], start, anchor);
            }
            for (j2 = 0; j2 < stashed.length; j2 += 1) {
              seen.delete(stashed[j2]);
            }
            link(state2, a2.prev, b2.next);
            link(state2, prev, a2);
            link(state2, b2, start);
            current = start;
            prev = b2;
            i2 -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(item);
            move(item, current, anchor);
            link(state2, item.prev, item.next);
            link(state2, item, prev === null ? state2.first : prev.next);
            link(state2, prev, item);
            prev = item;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current.k !== key) {
          if ((current.e.f & INERT) === 0) {
            (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          }
          stashed.push(current);
          current = current.next;
        }
        if (current === null) {
          continue;
        }
        item = current;
      }
      matched.push(item);
      prev = item;
      current = item.next;
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = seen === void 0 ? [] : array_from(seen);
      while (current !== null) {
        if ((current.e.f & INERT) === 0) {
          to_destroy.push(current);
        }
        current = current.next;
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i2 = 0; i2 < destroy_length; i2 += 1) {
            (_c = to_destroy[i2].a) == null ? void 0 : _c.measure();
          }
          for (i2 = 0; i2 < destroy_length; i2 += 1) {
            (_d = to_destroy[i2].a) == null ? void 0 : _d.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor, items);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        var _a3;
        if (to_animate === void 0) return;
        for (item of to_animate) {
          (_a3 = item.a) == null ? void 0 : _a3.apply();
        }
      });
    }
    active_effect.first = state2.first && state2.first.e;
    active_effect.last = prev && prev.e;
  }
  function update_item(item, value, index2, type) {
    if ((type & EACH_ITEM_REACTIVE) !== 0) {
      internal_set(item.v, value);
    }
    if ((type & EACH_INDEX_REACTIVE) !== 0) {
      internal_set(
        /** @type {Value<number>} */
        item.i,
        index2
      );
    } else {
      item.i = index2;
    }
  }
  function create_item(anchor, state2, prev, next, value, key, index2, render_fn, flags, get_collection) {
    var reactive = (flags & EACH_ITEM_REACTIVE) !== 0;
    var mutable = (flags & EACH_ITEM_IMMUTABLE) === 0;
    var v2 = reactive ? mutable ? /* @__PURE__ */ mutable_source(value) : source(value) : value;
    var i2 = (flags & EACH_INDEX_REACTIVE) === 0 ? index2 : source(index2);
    var item = {
      i: i2,
      v: v2,
      k: key,
      a: null,
      // @ts-expect-error
      e: null,
      prev,
      next
    };
    try {
      item.e = branch(() => render_fn(anchor, v2, i2, get_collection), hydrating);
      item.e.prev = prev && prev.e;
      item.e.next = next && next.e;
      if (prev === null) {
        state2.first = item;
      } else {
        prev.next = item;
        prev.e.next = item.e;
      }
      if (next !== null) {
        next.prev = item;
        next.e.prev = item.e;
      }
      return item;
    } finally {
    }
  }
  function move(item, next, anchor) {
    var end = item.next ? (
      /** @type {TemplateNode} */
      item.next.e.nodes_start
    ) : anchor;
    var dest = next ? (
      /** @type {TemplateNode} */
      next.e.nodes_start
    ) : anchor;
    var node = (
      /** @type {TemplateNode} */
      item.e.nodes_start
    );
    while (node !== end) {
      var next_node = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      dest.before(node);
      node = next_node;
    }
  }
  function link(state2, prev, next) {
    if (prev === null) {
      state2.first = next;
    } else {
      prev.next = next;
      prev.e.next = next && next.e;
    }
    if (next !== null) {
      next.prev = prev;
      next.e.prev = prev && prev.e;
    }
  }
  function html(node, get_value, svg = false, mathml = false, skip_warning = false) {
    var anchor = node;
    var value = "";
    template_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (value === (value = get_value() ?? "")) {
        return;
      }
      if (effect2.nodes_start !== null) {
        remove_effect_dom(
          effect2.nodes_start,
          /** @type {TemplateNode} */
          effect2.nodes_end
        );
        effect2.nodes_start = effect2.nodes_end = null;
      }
      if (value === "") return;
      var html2 = value + "";
      if (svg) html2 = `<svg>${html2}</svg>`;
      else if (mathml) html2 = `<math>${html2}</math>`;
      var node2 = create_fragment_from_html(html2);
      if (svg || mathml) {
        node2 = /** @type {Element} */
        /* @__PURE__ */ get_first_child(node2);
      }
      assign_nodes(
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_first_child(node2),
        /** @type {TemplateNode} */
        node2.lastChild
      );
      if (svg || mathml) {
        while (/* @__PURE__ */ get_first_child(node2)) {
          anchor.before(
            /** @type {Node} */
            /* @__PURE__ */ get_first_child(node2)
          );
        }
      } else {
        anchor.before(node2);
      }
    });
  }
  function r$6(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o2 = e2.length;
      for (t2 = 0; t2 < o2; t2++) e2[t2] && (f2 = r$6(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx$1() {
    for (var e2, t2, f2 = 0, n2 = "", o2 = arguments.length; f2 < o2; f2++) (e2 = arguments[f2]) && (t2 = r$6(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function clsx(value) {
    if (typeof value === "object") {
      return clsx$1(value);
    } else {
      return value ?? "";
    }
  }
  function to_class(value, hash, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash) {
      classname = classname ? classname + " " + hash : hash;
    }
    return classname === "" ? null : classname;
  }
  function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
    var prev = dom.__className;
    if (prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash);
      {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else {
          dom.className = next_class_name;
        }
      }
      dom.__className = value;
    }
    return next_classes;
  }
  const IS_CUSTOM_ELEMENT = Symbol("is custom element");
  const IS_HTML = Symbol("is html");
  function set_attribute(element, attribute, value, skip_warning) {
    var attributes = get_attributes(element);
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
      element[attribute] = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
  function get_attributes(element) {
    return (
      /** @type {Record<string | symbol, unknown>} **/
      // @ts-expect-error
      element.__attributes ?? (element.__attributes = {
        [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
        [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element) {
    var setters = setters_cache.get(element.nodeName);
    if (setters) return setters;
    setters_cache.set(element.nodeName, setters = []);
    var descriptors;
    var proto = element;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key in descriptors) {
        if (descriptors[key].set) {
          setters.push(key);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function bind_value(input, get2, set2 = get2) {
    var runes = is_runes();
    listen_to_event_and_reset_event(input, "input", (is_reset) => {
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (runes && value !== (value = get2())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        input.value = value ?? "";
        if (end !== null) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get2) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    }
    render_effect(() => {
      var value = get2();
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  const pending = /* @__PURE__ */ new Set();
  function bind_group(inputs, group_index, input, get2, set2 = get2) {
    var is_checkbox = input.getAttribute("type") === "checkbox";
    var binding_group = inputs;
    if (group_index !== null) {
      for (var index2 of group_index) {
        binding_group = binding_group[index2] ?? (binding_group[index2] = []);
      }
    }
    binding_group.push(input);
    listen_to_event_and_reset_event(
      input,
      "change",
      () => {
        var value = input.__value;
        if (is_checkbox) {
          value = get_binding_group_value(binding_group, value, input.checked);
        }
        set2(value);
      },
      // TODO better default value handling
      () => set2(is_checkbox ? [] : null)
    );
    render_effect(() => {
      var value = get2();
      if (is_checkbox) {
        value = value || [];
        input.checked = value.includes(input.__value);
      } else {
        input.checked = is(input.__value, value);
      }
    });
    teardown(() => {
      var index3 = binding_group.indexOf(input);
      if (index3 !== -1) {
        binding_group.splice(index3, 1);
      }
    });
    if (!pending.has(binding_group)) {
      pending.add(binding_group);
      queue_micro_task(() => {
        binding_group.sort((a2, b2) => a2.compareDocumentPosition(b2) === 4 ? -1 : 1);
        pending.delete(binding_group);
      });
    }
    queue_micro_task(() => {
    });
  }
  function bind_checked(input, get2, set2 = get2) {
    listen_to_event_and_reset_event(input, "change", (is_reset) => {
      var value = is_reset ? input.defaultChecked : input.checked;
      set2(value);
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the update value from the input instead.
      // If defaultChecked is set, then checked == defaultChecked
      untrack(get2) == null
    ) {
      set2(input.checked);
    }
    render_effect(() => {
      var value = get2();
      input.checked = Boolean(value);
    });
  }
  function get_binding_group_value(group, __value, checked) {
    var value = /* @__PURE__ */ new Set();
    for (var i2 = 0; i2 < group.length; i2 += 1) {
      if (group[i2].checked) {
        value.add(group[i2].__value);
      }
    }
    if (!checked) {
      value.delete(__value);
    }
    return Array.from(value);
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function bind_prop(props, prop2, value) {
    var desc = get_descriptor(props, prop2);
    if (desc && desc.set) {
      props[prop2] = value;
      teardown(() => {
        props[prop2] = null;
      });
    }
  }
  function is_bound_this(bound_value, element_or_component) {
    return bound_value === element_or_component || (bound_value == null ? void 0 : bound_value[STATE_SYMBOL]) === element_or_component;
  }
  function bind_this(element_or_component = {}, update, get_value, get_parts) {
    effect(() => {
      var old_parts;
      var parts;
      render_effect(() => {
        old_parts = parts;
        parts = [];
        untrack(() => {
          if (element_or_component !== get_value(...parts)) {
            update(element_or_component, ...parts);
            if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
              update(null, ...old_parts);
            }
          }
        });
      });
      return () => {
        queue_micro_task(() => {
          if (parts && is_bound_this(get_value(...parts), element_or_component)) {
            update(null, ...parts);
          }
        });
      };
    });
    return element_or_component;
  }
  function init(immutable = false) {
    const context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev = (
        /** @type {Record<string, any>} */
        {}
      );
      const d2 = /* @__PURE__ */ derived(() => {
        let changed = false;
        const props2 = context.s;
        for (const key in props2) {
          if (props2[key] !== prev[key]) {
            prev[key] = props2[key];
            changed = true;
          }
        }
        if (changed) version++;
        return version;
      });
      props = () => get(d2);
    }
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context, props);
        run_all(callbacks.b);
      });
    }
    user_effect(() => {
      const fns = untrack(() => callbacks.m.map(run));
      return () => {
        for (const fn of fns) {
          if (typeof fn === "function") {
            fn();
          }
        }
      };
    });
    if (callbacks.a.length) {
      user_effect(() => {
        observe_all(context, props);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context, props) {
    if (context.l.s) {
      for (const signal of context.l.s) get(signal);
    }
    props();
  }
  let is_store_binding = false;
  function capture_store_binding(fn) {
    var previous_is_store_binding = is_store_binding;
    try {
      is_store_binding = false;
      return [fn(), is_store_binding];
    } finally {
      is_store_binding = previous_is_store_binding;
    }
  }
  function has_destroyed_component_ctx(current_value) {
    var _a2;
    return ((_a2 = current_value.ctx) == null ? void 0 : _a2.d) ?? false;
  }
  function prop(props, key, flags, fallback) {
    var _a2;
    var immutable = (flags & PROPS_IS_IMMUTABLE) !== 0;
    var runes = !legacy_mode_flag || (flags & PROPS_IS_RUNES) !== 0;
    var bindable = (flags & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags & PROPS_IS_LAZY_INITIAL) !== 0;
    var is_store_sub = false;
    var prop_value;
    if (bindable) {
      [prop_value, is_store_sub] = capture_store_binding(() => (
        /** @type {V} */
        props[key]
      ));
    } else {
      prop_value = /** @type {V} */
      props[key];
    }
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    var setter = bindable && (((_a2 = get_descriptor(props, key)) == null ? void 0 : _a2.set) ?? (is_entry_props && key in props && ((v2) => props[key] = v2))) || void 0;
    var fallback_value = (
      /** @type {V} */
      fallback
    );
    var fallback_dirty = true;
    var fallback_used = false;
    var get_fallback = () => {
      fallback_used = true;
      if (fallback_dirty) {
        fallback_dirty = false;
        if (lazy) {
          fallback_value = untrack(
            /** @type {() => V} */
            fallback
          );
        } else {
          fallback_value = /** @type {V} */
          fallback;
        }
      }
      return fallback_value;
    };
    if (prop_value === void 0 && fallback !== void 0) {
      if (setter && runes) {
        props_invalid_value();
      }
      prop_value = get_fallback();
      if (setter) setter(prop_value);
    }
    var getter;
    if (runes) {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        fallback_used = false;
        return value;
      };
    } else {
      var derived_getter = (immutable ? derived : derived_safe_equal)(
        () => (
          /** @type {V} */
          props[key]
        )
      );
      derived_getter.f |= LEGACY_DERIVED_PROP;
      getter = () => {
        var value = get(derived_getter);
        if (value !== void 0) fallback_value = /** @type {V} */
        void 0;
        return value === void 0 ? fallback_value : value;
      };
    }
    if ((flags & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return function(value, mutation) {
        if (arguments.length > 0) {
          if (!runes || !mutation || legacy_parent || is_store_sub) {
            setter(mutation ? getter() : value);
          }
          return value;
        } else {
          return getter();
        }
      };
    }
    var from_child = false;
    var inner_current_value = /* @__PURE__ */ mutable_source(prop_value);
    var current_value = /* @__PURE__ */ derived(() => {
      var parent_value = getter();
      var child_value = get(inner_current_value);
      if (from_child) {
        from_child = false;
        return child_value;
      }
      return inner_current_value.v = parent_value;
    });
    if (bindable) {
      get(current_value);
    }
    if (!immutable) current_value.equals = safe_equals;
    return function(value, mutation) {
      if (arguments.length > 0) {
        const new_value = mutation ? get(current_value) : runes && bindable ? proxy(value) : value;
        if (!current_value.equals(new_value)) {
          from_child = true;
          set(inner_current_value, new_value);
          if (fallback_used && fallback_value !== void 0) {
            fallback_value = new_value;
          }
          if (has_destroyed_component_ctx(current_value)) {
            return value;
          }
          untrack(() => get(current_value));
        }
        return value;
      }
      if (has_destroyed_component_ctx(current_value)) {
        return current_value.v;
      }
      return get(current_value);
    };
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    if (legacy_mode_flag && component_context.l !== null) {
      init_update_callbacks(component_context).m.push(fn);
    } else {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  function onDestroy(fn) {
    if (component_context === null) {
      lifecycle_outside_component();
    }
    onMount(() => () => untrack(fn));
  }
  function init_update_callbacks(context) {
    var l2 = (
      /** @type {ComponentContextLegacy} */
      context.l
    );
    return l2.u ?? (l2.u = { a: [], b: [], m: [] });
  }
  const PUBLIC_VERSION = "5";
  if (typeof window !== "undefined") {
    ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const Page = siteList.find((v2) => v2.domainReg.test(location.href));
  if (!Page) {
    throw new Error(`domain not matched`);
  }
  if ((_b = Page.excludePages) == null ? void 0 : _b.find((page) => location.pathname.includes(page))) {
    throw new Error(`excluded Page`);
  }
  let rawItemsEl;
  if (Page.itemSelector) {
    rawItemsEl = document.body.querySelectorAll(Page.itemSelector);
  } else if (Page.itemSelectorObj) {
    for (const [pageType, itemSelector] of Object.entries(Page.itemSelectorObj)) {
      rawItemsEl = document.body.querySelectorAll(itemSelector);
      if (rawItemsEl.length > 0) {
        Page.pageType = pageType;
        Page.itemSelector = itemSelector;
        break;
      }
    }
  }
  if (!rawItemsEl || rawItemsEl.length < 1) {
    throw new Error("No items found");
  }
  Page.rawItemsEl = rawItemsEl;
  if (Page.gridSelector) {
    Page.rawGridEl = document.body.querySelector(Page.gridSelector);
  } else {
    Page.rawGridEl = Page.rawItemsEl[0].parentElement;
  }
  document.body.setAttribute(Page.name, "");
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  const defaultConfig = {
    autoPage: false,
    pageHistory: false,
    toolbar: true,
    autoHide: !isMobile(),
    previewSite: JAVFREE,
    linkUrl: "https://missav.ws/",
    avInfo: false,
    newWindow: true,
    halfImg: false,
    fullTitle: false,
    clickToCopy: true,
    autoColumn: true,
    columnNumFull: 3,
    columnNumHalf: 4
  };
  const missav = {
    autoPage: false,
    pageHistory: false,
    toolbar: true,
    uncensoredFilter: false
  };
  const av123 = {
    autoPage: false,
    pageHistory: false,
    toolbar: true
  };
  const configValueName = "config";
  if (Page.name == MISSAV) {
    Page.defaultConfig = missav;
    Page.configValueName = configValueName + "-" + Page.name;
  } else if (Page.name == AV123) {
    Page.defaultConfig = av123;
    Page.configValueName = configValueName + "-" + Page.name;
  } else {
    if (Page.name == JAVDB) {
      defaultConfig.maxWidth = true;
    }
    Page.defaultConfig = defaultConfig;
    Page.configValueName = configValueName;
  }
  function merge(target, source2) {
    const result = {};
    for (const key in target) {
      result[key] = source2.hasOwnProperty(key) ? source2[key] : target[key];
    }
    return result;
  }
  let obj = merge(Page.defaultConfig, _GM_getValue(Page.configValueName, {}));
  const config = proxy(obj);
  const e$6 = "undefined" != typeof window, i$6 = e$6 && !("onscroll" in window) || "undefined" != typeof navigator && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent), n$7 = e$6 && window.devicePixelRatio > 1;
  const a$7 = { elements_selector: ".lazy", container: i$6 || e$6 ? document : null, threshold: 300, thresholds: null, data_src: "src", data_srcset: "srcset", data_sizes: "sizes", data_bg: "bg", data_bg_hidpi: "bg-hidpi", data_bg_multi: "bg-multi", data_bg_multi_hidpi: "bg-multi-hidpi", data_bg_set: "bg-set", data_poster: "poster", class_applied: "applied", class_loading: "loading", class_loaded: "loaded", class_error: "error", class_entered: "entered", class_exited: "exited", unobserve_completed: true, unobserve_entered: false, cancel_on_exit: true, callback_enter: null, callback_exit: null, callback_applied: null, callback_loading: null, callback_loaded: null, callback_error: null, callback_finish: null, callback_cancel: null, use_native: false, restore_on_error: false }, t$8 = (l2) => Object.assign({}, a$7, l2);
  const t$7 = function(t2, e2) {
    let n2;
    const i2 = "LazyLoad::Initialized", o2 = new t2(e2);
    try {
      n2 = new CustomEvent(i2, { detail: { instance: o2 } });
    } catch (t3) {
      n2 = document.createEvent("CustomEvent"), n2.initCustomEvent(i2, false, false, { instance: o2 });
    }
    window.dispatchEvent(n2);
  }, e$5 = (e2, n2) => {
    if (n2) if (n2.length) for (let i2, o2 = 0; i2 = n2[o2]; o2 += 1) t$7(e2, i2);
    else t$7(e2, n2);
  };
  const s$4 = "src", t$6 = "srcset", r$5 = "sizes", e$4 = "poster", a$6 = "llOriginalAttrs", c$3 = "data";
  const e$3 = "loading", d$3 = "loaded", o$5 = "applied", r$4 = "entered", a$5 = "error", n$6 = "native";
  const r$3 = "data-", s$3 = "ll-status", o$4 = (t2, e2) => t2.getAttribute(r$3 + e2), i$5 = (t2, e2, l2) => {
    const u2 = r$3 + e2;
    null !== l2 ? t2.setAttribute(u2, l2) : t2.removeAttribute(u2);
  }, a$4 = (t2) => o$4(t2, s$3), m$4 = (t2, e2) => i$5(t2, s$3, e2), b$2 = (t2) => m$4(t2, null), A$1 = (t2) => null === a$4(t2), c$2 = (t2) => a$4(t2) === e$3, d$2 = (t2) => a$4(t2) === a$5, f$2 = (e2) => a$4(e2) === n$6, p$1 = [e$3, d$3, o$5, a$5], x$2 = (t2) => p$1.indexOf(a$4(t2)) >= 0;
  const o$3 = (o2, t2, i2, n2) => {
    o2 && "function" == typeof o2 && (void 0 === n2 ? void 0 === i2 ? o2(t2) : o2(t2, i2) : o2(t2, i2, n2));
  };
  const o$2 = (o2, t2) => {
    e$6 && "" !== t2 && o2.classList.add(t2);
  }, t$5 = (o2, t2) => {
    e$6 && "" !== t2 && o2.classList.remove(t2);
  };
  const e$2 = (e2) => {
    e2.llTempImage = document.createElement("IMG");
  }, l$2 = (e2) => {
    delete e2.llTempImage;
  }, m$3 = (e2) => e2.llTempImage;
  const e$1 = (e2, n2) => {
    if (!n2) return;
    const r2 = n2._observer;
    r2 && r2.unobserve(e2);
  }, n$5 = (e2) => {
    e2.disconnect();
  }, r$2 = (n2, r2, o2) => {
    r2.unobserve_entered && e$1(n2, o2);
  };
  const o$1 = (o2, t2) => {
    o2 && (o2.loadingCount += t2);
  }, t$4 = (o2) => {
    o2 && (o2.toLoadCount -= 1);
  }, n$4 = (o2, t2) => {
    o2 && (o2.toLoadCount = t2);
  }, a$3 = (o2) => o2.loadingCount > 0, d$1 = (o2) => o2.toLoadCount > 0;
  const e = (e2) => {
    let t2 = [];
    for (let r2, a2 = 0; r2 = e2.children[a2]; a2 += 1) "SOURCE" === r2.tagName && t2.push(r2);
    return t2;
  }, t$3 = (t2, r2) => {
    const a2 = t2.parentNode;
    a2 && "PICTURE" === a2.tagName && e(a2).forEach(r2);
  }, r$1 = (t2, r2) => {
    e(t2).forEach(r2);
  };
  const c$1 = [s$4], s$2 = [s$4, e$4], u$1 = [s$4, t$6, r$5], g$3 = [c$3], b$1 = (e2) => !!e2[a$6], i$4 = (e2) => e2[a$6], m$2 = (e2) => delete e2[a$6], f$1 = (e2, r2) => {
    if (b$1(e2)) return;
    const o2 = {};
    r2.forEach((t2) => {
      o2[t2] = e2.getAttribute(t2);
    }), e2[a$6] = o2;
  }, d = (e2) => {
    b$1(e2) || (e2[a$6] = { backgroundImage: e2.style.backgroundImage });
  }, k$1 = (t2, e2) => {
    if (!b$1(t2)) return;
    const r2 = i$4(t2);
    e2.forEach((e3) => {
      ((t3, e4, r3) => {
        r3 ? t3.setAttribute(e4, r3) : t3.removeAttribute(e4);
      })(t2, e3, r2[e3]);
    });
  }, I$2 = (t2) => {
    if (!b$1(t2)) return;
    const e2 = i$4(t2);
    t2.style.backgroundImage = e2.backgroundImage;
  };
  const E$1 = (t2, a2, s2) => {
    o$2(t2, a2.class_applied), m$4(t2, o$5), s2 && (a2.unobserve_completed && e$1(t2, a2), o$3(a2.callback_applied, t2, s2));
  }, h = (t2, a2, s2) => {
    o$2(t2, a2.class_loading), m$4(t2, e$3), s2 && (o$1(s2, 1), o$3(a2.callback_loading, t2, s2));
  }, v = (t2, a2, s2) => {
    s2 && t2.setAttribute(a2, s2);
  }, y = (a2, s2) => {
    v(a2, r$5, o$4(a2, s2.data_sizes)), v(a2, t$6, o$4(a2, s2.data_srcset)), v(a2, s$4, o$4(a2, s2.data_src));
  }, M = (t2, a2) => {
    t$3(t2, (t3) => {
      f$1(t3, u$1), y(t3, a2);
    }), f$1(t2, u$1), y(t2, a2);
  }, N = (a2, s2) => {
    f$1(a2, c$1), v(a2, s$4, o$4(a2, s2.data_src));
  }, O$1 = (s2, o2) => {
    r$1(s2, (a2) => {
      f$1(a2, c$1), v(a2, s$4, o$4(a2, o2.data_src));
    }), f$1(s2, s$2), v(s2, e$4, o$4(s2, o2.data_poster)), v(s2, s$4, o$4(s2, o2.data_src)), s2.load();
  }, S = (t2, a2) => {
    f$1(t2, g$3), v(t2, c$3, o$4(t2, a2.data_src));
  }, $ = (a2, s2, o2) => {
    const r2 = o$4(a2, s2.data_bg), m2 = o$4(a2, s2.data_bg_hidpi), i2 = n$7 && m2 ? m2 : r2;
    i2 && (a2.style.backgroundImage = `url("${i2}")`, m$3(a2).setAttribute(s$4, i2), h(a2, s2, o2));
  }, x$1 = (t2, a2, s2) => {
    const o2 = o$4(t2, a2.data_bg_multi), r2 = o$4(t2, a2.data_bg_multi_hidpi), m2 = n$7 && r2 ? r2 : o2;
    m2 && (t2.style.backgroundImage = m2, E$1(t2, a2, s2));
  }, z = (t2, a2, s2) => {
    const o2 = o$4(t2, a2.data_bg_set);
    if (!o2) return;
    let r2 = o2.split("|").map((t3) => `image-set(${t3})`);
    t2.style.backgroundImage = r2.join(), E$1(t2, a2, s2);
  }, B = { IMG: M, IFRAME: N, VIDEO: O$1, OBJECT: S }, C = (t2, a2) => {
    const s2 = B[t2.tagName];
    s2 && s2(t2, a2);
  }, D$1 = (t2, a2, s2) => {
    const o2 = B[t2.tagName];
    o2 && (o2(t2, a2), h(t2, a2, s2));
  };
  const _ = ["IMG", "IFRAME", "VIDEO", "OBJECT"], j$1 = (r2) => _.indexOf(r2.tagName) > -1, b = (r2, o2) => {
    !o2 || a$3(o2) || d$1(o2) || o$3(r2.callback_finish, o2);
  }, L = (r2, o2, s2) => {
    r2.addEventListener(o2, s2), r2.llEvLisnrs[o2] = s2;
  }, u = (r2, o2, s2) => {
    r2.removeEventListener(o2, s2);
  }, g$2 = (r2) => !!r2.llEvLisnrs, I$1 = (r2, o2, s2) => {
    g$2(r2) || (r2.llEvLisnrs = {});
    const e2 = "VIDEO" === r2.tagName ? "loadeddata" : "load";
    L(r2, e2, o2), L(r2, "error", s2);
  }, k = (r2) => {
    if (!g$2(r2)) return;
    const o2 = r2.llEvLisnrs;
    for (let s2 in o2) {
      const e2 = o2[s2];
      u(r2, s2, e2);
    }
    delete r2.llEvLisnrs;
  }, O = (r2, s2, e2) => {
    l$2(r2), o$1(e2, -1), t$4(e2), t$5(r2, s2.class_loading), s2.unobserve_completed && e$1(r2, e2);
  }, x = (o2, a2, n2, i2) => {
    const m2 = f$2(a2);
    O(a2, n2, i2), o$2(a2, n2.class_loaded), m$4(a2, d$3), o$3(n2.callback_loaded, a2, i2), m2 || b(n2, i2);
  }, A = (o2, l2, n2, i2) => {
    const m2 = f$2(l2);
    O(l2, n2, i2), o$2(l2, n2.class_error), m$4(l2, a$5), o$3(n2.callback_error, l2, i2), n2.restore_on_error && k$1(l2, u$1), m2 || b(n2, i2);
  }, D = (r2, o2, s2) => {
    const e2 = m$3(r2) || r2;
    g$2(e2) || I$1(e2, (t2) => {
      x(0, r2, o2, s2), k(e2);
    }, (t2) => {
      A(0, r2, o2, s2), k(e2);
    });
  };
  const n$3 = (e2, i2, a2) => {
    j$1(e2) ? ((t2, o2, r2) => {
      D(t2, o2, r2), D$1(t2, o2, r2);
    })(e2, i2, a2) : ((m2, e3, i3) => {
      e$2(m2), D(m2, e3, i3), d(m2), $(m2, e3, i3), x$1(m2, e3, i3), z(m2, e3, i3);
    })(e2, i2, a2);
  }, l$1 = (t2, o2, r2) => {
    t2.setAttribute("loading", "lazy"), D(t2, o2, r2), C(t2, o2), m$4(t2, n$6);
  };
  const m$1 = (e2) => {
    e2.removeAttribute(s$4), e2.removeAttribute(t$6), e2.removeAttribute(r$5);
  }, i$3 = (t2) => {
    t$3(t2, (t3) => {
      m$1(t3);
    }), m$1(t2);
  };
  const f = (s2) => {
    t$3(s2, (s3) => {
      k$1(s3, u$1);
    }), k$1(s2, u$1);
  }, n$2 = (s2) => {
    r$1(s2, (s3) => {
      k$1(s3, c$1);
    }), k$1(s2, s$2), s2.load();
  }, j = (s2) => {
    k$1(s2, c$1);
  }, E = (s2) => {
    k$1(s2, g$3);
  }, g$1 = { IMG: f, IFRAME: j, VIDEO: n$2, OBJECT: E }, I = (t2, e2) => {
    ((s2) => {
      const o2 = g$1[s2.tagName];
      o2 ? o2(s2) : I$2(s2);
    })(t2), ((o2, t3) => {
      A$1(o2) || f$2(o2) || (t$5(o2, t3.class_entered), t$5(o2, t3.class_exited), t$5(o2, t3.class_applied), t$5(o2, t3.class_loading), t$5(o2, t3.class_loaded), t$5(o2, t3.class_error));
    })(t2, e2), b$2(t2), m$2(t2);
  };
  const i$2 = (i2, l2, p2, f$12) => {
    p2.cancel_on_exit && c$2(i2) && "IMG" === i2.tagName && (k(i2), i$3(i2), f(i2), t$5(i2, p2.class_loading), o$1(f$12, -1), b$2(i2), o$3(p2.callback_cancel, i2, l2, f$12));
  };
  const n$1 = (e2, a2, n2, p2) => {
    const f2 = x$2(e2);
    m$4(e2, r$4), o$2(e2, n2.class_entered), t$5(e2, n2.class_exited), r$2(e2, n2, p2), o$3(n2.callback_enter, e2, a2, p2), f2 || n$3(e2, n2, p2);
  }, p = (o2, s2, r2, m2) => {
    A$1(o2) || (o$2(o2, r2.class_exited), i$2(o2, s2, r2, m2), o$3(r2.callback_exit, o2, s2, m2));
  };
  const t$2 = ["IMG", "IFRAME", "VIDEO"], r = (o2) => o2.use_native && "loading" in HTMLImageElement.prototype, a$2 = (r2, a2, m2) => {
    r2.forEach((e2) => {
      -1 !== t$2.indexOf(e2.tagName) && l$1(e2, a2, m2);
    }), n$4(m2, 0);
  };
  const n = (r2) => r2.isIntersecting || r2.intersectionRatio > 0, s$1 = (r2, e2) => {
    e2.forEach((e3) => {
      r2.observe(e3);
    });
  }, i$1 = (r2, e2) => {
    n$5(r2), s$1(r2, e2);
  }, a$1 = (t2, s2) => {
    r(t2) || (s2._observer = new IntersectionObserver((o2) => {
      ((o3, t3, s3) => {
        o3.forEach((o4) => n(o4) ? n$1(o4.target, o4, t3, s3) : p(o4.target, o4, t3, s3));
      })(o2, t2, s2);
    }, ((r2) => ({ root: r2.container === document ? null : r2.container, rootMargin: r2.thresholds || r2.threshold + "px" }))(t2)));
  };
  const t$1 = (e2) => Array.prototype.slice.call(e2), l = (e2) => e2.container.querySelectorAll(e2.elements_selector), o = (r2) => t$1(r2).filter(A$1), c = (e2) => d$2(e2), a = (e2) => t$1(e2).filter(c), i = (e2, r2) => o(e2 || l(r2));
  const t = (n2, t2) => {
    a(l(n2)).forEach((r2) => {
      t$5(r2, n2.class_error), b$2(r2);
    }), t2.update();
  }, m = (o2, e2) => {
    e$6 && (e2._onlineHandler = () => {
      t(o2, e2);
    }, window.addEventListener("online", e2._onlineHandler));
  }, s = (o2) => {
    e$6 && window.removeEventListener("online", o2._onlineHandler);
  };
  const g = function(o2, s2) {
    const e2 = t$8(o2);
    this._settings = e2, this.loadingCount = 0, a$1(e2, this), m(e2, this), this.update(s2);
  };
  g.prototype = { update: function(t2) {
    const o2 = this._settings, s2 = i(t2, o2);
    n$4(this, s2.length), i$6 ? this.loadAll(s2) : r(o2) ? a$2(s2, o2, this) : i$1(this._observer, s2);
  }, destroy: function() {
    this._observer && this._observer.disconnect(), s(this), l(this._settings).forEach((t2) => {
      m$2(t2);
    }), delete this._observer, delete this._settings, delete this._onlineHandler, delete this.loadingCount, delete this.toLoadCount;
  }, loadAll: function(t2) {
    const o2 = this._settings;
    i(t2, o2).forEach((t3) => {
      e$1(t3, this), n$3(t3, o2, this);
    });
  }, restoreAll: function() {
    const t2 = this._settings;
    l(t2).forEach((o2) => {
      I(o2, t2);
    });
  } }, g.load = (o2, i2) => {
    const e2 = t$8(i2);
    n$3(o2, e2);
  }, g.resetStatus = (t2) => {
    b$2(t2);
  }, e$6 && e$5(g, window.lazyLoadOptions);
  const LOCALE = {
    menu_autoPage: ["自动下一页", "Auto Next Page"],
    menu_pageHistory: ["地址栏显示下一页", "Show the next page in the URL bar"],
    menu_newWindow: ["新窗口打开详情页", "Open the details page in a new window"],
    menu_toolbar: ["功能图标", "Tools icons"],
    menu_autoHide: ["功能图标自动隐藏", "Tools icons auto hide"],
    menu_avInfo: ["磁力弹窗中的演员和图片", "Actors and images in magnet pop-ups"],
    menu_halfImg: ["竖图模式", "Vertical image mode"],
    menu_fullTitle: ["标题全显", "Full title"],
    menu_clickToCopy: ["标题和番号点击复制", "Click to copy title and code"],
    menu_autoColumn: ["自适应列数", "Adaptive columns"],
    menu_uncensoredFilter: ["去掉未经审查的泄露", "Remove uncensored leaks"],
    menu_maxWidth: ["最大宽度", "Max width"],
    menu_previewSite: ["预览图", "Video preview"],
    menu_linkUrl: ["跳转到", "Jump to"],
    copyButton: ["复制", "Copy"],
    copySuccess: ["复制成功", "Copy successful"],
    preview_none: ["未搜索到", "No results found"],
    tip_magnet: ["磁力", "Magnet"],
    tip_preview: ["预览图", "Video preview"],
    tip_link: ["跳转", "jump to url"],
    autoPage_end: ["完", "End"]
  };
  const language = navigator.language.toLowerCase().replace("_", "-").split("-")[0];
  const LOCALE_INDEX = language === "zh" ? 0 : 1;
  const LANG = {};
  Object.entries(LOCALE).forEach(([key, value]) => LANG[key] = value[LOCALE_INDEX]);
  var root_2$1 = /* @__PURE__ */ from_html(`<div class="range-div svelte-1tay3fy"><input type="range" min="1" max="8" step="1" class="svelte-1tay3fy"/> <span class="svelte-1tay3fy"> </span></div>`);
  var root_3$3 = /* @__PURE__ */ from_html(`<div class="range-div svelte-1tay3fy"><input type="range" min="1" max="8" step="1" class="svelte-1tay3fy"/> <span class="svelte-1tay3fy"> </span></div>`);
  var root_1$4 = /* @__PURE__ */ from_html(`<!> <div class="input-div svelte-1tay3fy"><span> </span> <input class="svelte-1tay3fy"/></div> <div class="radio-div svelte-1tay3fy"><span> </span>&nbsp; <input type="radio" class="svelte-1tay3fy"/> <label class="svelte-1tay3fy">javfree.me</label> <input type="radio" class="svelte-1tay3fy"/> <label class="svelte-1tay3fy">blogjav.net</label></div>`, 1);
  var on_click$3 = (_2, isVisible) => set(isVisible, !get(isVisible));
  var root_4$2 = /* @__PURE__ */ from_html(`<div class="checkbox-div svelte-1tay3fy"><input type="checkbox" class="svelte-1tay3fy"/> <label class="svelte-1tay3fy"> </label></div>`);
  var root$4 = /* @__PURE__ */ from_html(`<div class="menu-b svelte-1tay3fy"><div>&#x1F528;</div> <div><!> <!></div></div>`);
  function Menu($$anchor, $$props) {
    push($$props, true);
    const binding_group = [];
    const others = ($$anchor2) => {
      var fragment = root_1$4();
      var node = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          var div = root_2$1();
          var input = child(div);
          var span = sibling(input, 2);
          var text_1 = child(span);
          template_effect(() => {
            input.disabled = config2().autoColumn || isHalfImgBlock();
            set_text(text_1, config2().columnNumHalf);
          });
          bind_value(input, () => config2().columnNumHalf, ($$value) => config2().columnNumHalf = $$value);
          append($$anchor3, div);
        };
        var alternate = ($$anchor3) => {
          var div_1 = root_3$3();
          var input_1 = child(div_1);
          var span_1 = sibling(input_1, 2);
          var text_2 = child(span_1);
          template_effect(() => {
            input_1.disabled = config2().autoColumn;
            set_text(text_2, config2().columnNumFull);
          });
          bind_value(input_1, () => config2().columnNumFull, ($$value) => config2().columnNumFull = $$value);
          append($$anchor3, div_1);
        };
        if_block(node, ($$render) => {
          if (config2().halfImg) $$render(consequent);
          else $$render(alternate, false);
        });
      }
      var div_2 = sibling(node, 2);
      var span_2 = child(div_2);
      var text_3 = child(span_2);
      var input_2 = sibling(span_2, 2);
      var div_3 = sibling(div_2, 2);
      var span_3 = child(div_3);
      var text_4 = child(span_3);
      var input_3 = sibling(span_3, 2);
      var input_3_value;
      var label = sibling(input_3, 2);
      var input_4 = sibling(label, 2);
      var input_4_value;
      var label_1 = sibling(input_4, 2);
      template_effect(() => {
        set_text(text_3, LANG.menu_linkUrl);
        set_text(text_4, LANG.menu_previewSite);
        set_attribute(input_3, "id", JAVFREE + "_radio");
        if (input_3_value !== (input_3_value = JAVFREE)) {
          input_3.value = (input_3.__value = JAVFREE) ?? "";
        }
        set_attribute(label, "for", JAVFREE + "_radio");
        set_attribute(input_4, "id", BLOGJAV + "_radio");
        if (input_4_value !== (input_4_value = BLOGJAV)) {
          input_4.value = (input_4.__value = BLOGJAV) ?? "";
        }
        set_attribute(label_1, "for", BLOGJAV + "_radio");
      });
      bind_value(input_2, () => config2().linkUrl, ($$value) => config2().linkUrl = $$value);
      bind_group(
        binding_group,
        [],
        input_3,
        () => {
          return config2().previewSite;
        },
        ($$value) => config2().previewSite = $$value
      );
      bind_group(
        binding_group,
        [],
        input_4,
        () => {
          return config2().previewSite;
        },
        ($$value) => config2().previewSite = $$value
      );
      append($$anchor2, fragment);
    };
    let config2 = prop($$props, "config", 7), isHalfImgBlock = prop($$props, "isHalfImgBlock", 3, false);
    let isVisible = /* @__PURE__ */ state(false);
    let checkboxList = proxy([]);
    for (const [key, value] of Object.entries(Page.defaultConfig)) {
      if (typeof value === "boolean") {
        checkboxList.push({
          key,
          text: LANG[`menu_${key}`],
          disabled: key === "halfImg" && isHalfImgBlock()
        });
      }
    }
    user_effect(() => {
      _GM_setValue(Page.configValueName, config2());
    });
    var div_4 = root$4();
    var div_5 = child(div_4);
    div_5.__click = [on_click$3, isVisible];
    var div_6 = sibling(div_5, 2);
    var node_1 = child(div_6);
    each(node_1, 17, () => checkboxList, index, ($$anchor2, $$item) => {
      let key = () => get($$item).key;
      let text = () => get($$item).text;
      let disabled = () => get($$item).disabled;
      var div_7 = root_4$2();
      var input_5 = child(div_7);
      var label_2 = sibling(input_5, 2);
      var text_5 = child(label_2);
      template_effect(() => {
        input_5.disabled = disabled();
        set_attribute(input_5, "id", key() + "_checkbox");
        set_attribute(label_2, "for", key() + "_checkbox");
        set_text(text_5, text());
      });
      bind_checked(input_5, () => config2()[key()], ($$value) => config2()[key()] = $$value);
      append($$anchor2, div_7);
    });
    var node_2 = sibling(node_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        others($$anchor2);
      };
      if_block(node_2, ($$render) => {
        if (Page.name == JAVBUS || Page.name == JAVDB) $$render(consequent_1);
      });
    }
    template_effect(() => {
      set_class(
        div_5,
        1,
        clsx([
          "menu-tool",
          get(isVisible) && "menu-tool-opacity"
        ]),
        "svelte-1tay3fy"
      );
      set_class(
        div_6,
        1,
        clsx([
          "menu-list",
          !get(isVisible) && "hidden-b"
        ]),
        "svelte-1tay3fy"
      );
    });
    append($$anchor, div_4);
    pop();
  }
  delegate(["click"]);
  const asyncWithLoading = async (fn, item, loadingProp = "isLoading") => {
    try {
      item[loadingProp] = true;
      await fn();
    } catch (error) {
      console.error(error);
      Tips.show(error.message ?? error, Tips.TYPE.ERROR);
    } finally {
      item[loadingProp] = false;
    }
  };
  async function safeFetch(url, init2) {
    const response = await fetch(url, init2);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }
  function getRequest(url, params) {
    console.log(url);
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest(
        Object.assign(
          {
            method: "GET",
            url,
            timeout: 1e4,
            headers: { Referer: url },
            onload: (r2) => {
              r2.status >= 200 && r2.status < 300 ? resolve(r2) : reject(`HTTP error! status: ${r2.status}`);
            },
            onerror: () => reject(`error错误`),
            ontimeout: () => reject(`timeout超时`)
          },
          params
        )
      );
    });
  }
  function getDownload(url, name) {
    return new Promise((resolve, reject) => {
      _GM_download({
        url,
        name: url.split("/").pop(),
        headers: { Referer: url },
        onload: () => resolve("success"),
        onerror: () => reject(`error错误`),
        ontimeout: () => reject(`timeout超时`)
      });
    });
  }
  const Tips = {
    TYPE: {
      SUCCESS: "✅",
      ERROR: "❌"
    },
    show: (msg, type, close) => {
      const alert = document.createElement("div");
      alert.className = "alert-zdy";
      alert.innerHTML = (type ?? "") + msg;
      if (close) {
        const closeButton = document.createElement("div");
        closeButton.className = "alert-close";
        closeButton.innerHTML = "&#x2715;";
        closeButton.addEventListener("click", () => alert.style.display = "none");
        alert.appendChild(closeButton);
      }
      document.body.appendChild(alert);
      if (!close) {
        setTimeout(() => {
          alert.style.display = "none";
        }, 3e3);
      }
    }
  };
  const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>`;
  const pictureSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m6,5.5a1.5,1.5 0 1 1 -3,0a1.5,1.5 0 0 1 3,0"/><path d="m2,1a2,2.14 0 0 0 -2,2.14l0,10.71a2,2.14 0 0 0 2,2.14l12,0a2,2.14 0 0 0 2,-2.14l0,-10.71a2,2.14 0 0 0 -2,-2.14l-12,0zm12,1.07a1,1.07 0 0 1 1,1.07l0,10.18l-3.78,-3.75a0.5,0.54 0 0 0 -0.57,0l-3.71,3.21l-2.66,-1.52a0.5,0.54 0 0 0 -0.63,0.07l-2.65,2.52l0,-10.71a1,1.07 0 0 1 1,-1.07l12,0z"/></svg>`;
  const magnetSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a7 7 0 0 0-7 7v3h4V8a3 3 0 0 1 6 0v3h4V8a7 7 0 0 0-7-7m7 11h-4v3h4zM5 12H1v3h4zM0 8a8 8 0 1 1 16 0v8h-6V8a2 2 0 1 0-4 0v8H0z"/></svg>`;
  const linkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/></svg>`;
  const clickToCopy = (event) => {
    event.preventDefault();
    _GM_setClipboard(event.target.textContent, "text");
    Tips.show(LANG.copySuccess, Tips.TYPE.SUCCESS);
  };
  async function getMagnetFromJavbus(avid) {
    const originUrl = "https://www.javbus.com";
    avid = avid.replace(/(-uncensored-leak|-uncensored-leaked|-chinese-subtitle|-c)$/, "");
    const url = `${originUrl}/${avid}`;
    const response = await getRequest(url);
    const [gid, uc_code] = getGid(response.responseText);
    const magnetUrl = `${originUrl}/ajax/uncledatoolsbyajax.php?gid=${gid}&lang=zh&img=&uc=${uc_code}&floor=` + Math.floor(Math.random() * 1e3 + 1);
    const magnetDoc = await getRequest(magnetUrl).then((r2) => r2.responseText);
    const table = getMagnetTable(magnetDoc);
    return [table];
  }
  const getGid = (doc) => {
    const str = /var\s+gid\s+=\s+(\d{1,})/.exec(doc);
    const uc = /var\s+uc\s+=\s+(0|1)/.exec(doc);
    if (!str || !uc) {
      throw new Error("getGid error");
    }
    return [str[1], uc[1]];
  };
  const getMagnetTable = (doc) => {
    const table = document.createElement("table");
    table.classList.add("javbus-table");
    table.innerHTML = doc.substring(0, doc.indexOf("<script")).trim();
    addCopybutton(table);
    return table;
  };
  const addCopybutton = (table) => {
    table.querySelectorAll("tr").forEach((tr) => {
      var _a2;
      const a2 = tr.querySelector("a");
      if (!a2) return;
      const magent = a2.href;
      const td = document.createElement("td");
      const button = document.createElement("button");
      button.className = "btn-copy";
      button.textContent = LANG.copyButton;
      button.addEventListener("click", function() {
        _GM_setClipboard(magent, "text");
        Tips.show(LANG.copySuccess, Tips.TYPE.SUCCESS);
      });
      td.appendChild(button);
      (_a2 = tr.firstElementChild) == null ? void 0 : _a2.after(td);
    });
  };
  const getMagnet = {
    [JAVBUS]: async (item) => {
      const doc = await safeFetch(item.href);
      const [gid, uc_code] = getGid(doc);
      const resultEl = [];
      if (config.avInfo) {
        const docParsed = new DOMParser().parseFromString(doc, "text/html");
        const sample = docParsed.querySelector("#sample-waterfall");
        const avatar = docParsed.querySelector("#avatar-waterfall");
        if (avatar) {
          avatar.id = "";
          avatar.querySelectorAll("a.avatar-box").forEach((a2) => {
            a2.setAttribute("target", "_blank");
            a2.classList.replace("avatar-box", "avatar-box-zdy");
          });
          resultEl.push(avatar);
        }
        if (sample) {
          sample.id = "";
          sample.querySelectorAll(".sample-box").forEach((box) => {
            box.classList.replace("sample-box", "sample-box-zdy");
          });
          resultEl.push(sample);
        }
      }
      const url = `${location.protocol}//${location.hostname}/ajax/uncledatoolsbyajax.php?gid=${gid}&lang=zh&img=&uc=${uc_code}&floor=` + Math.floor(Math.random() * 1e3 + 1);
      const magnetDoc = await safeFetch(url);
      const table = getMagnetTable(magnetDoc);
      resultEl.push(table);
      return resultEl;
    },
    [JAVDB]: async (item) => {
      var _a2, _b2, _c;
      const response = await safeFetch(item.href);
      const docParsed = new DOMParser().parseFromString(response, "text/html");
      const resultEl = [];
      if (config.avInfo) {
        const actors = (_a2 = docParsed.querySelector("div.video-meta-panel .panel-block a[href^='/actors/']")) == null ? void 0 : _a2.closest(".panel-block");
        if (actors) {
          actors.querySelectorAll("a").forEach((a2) => {
            a2.setAttribute("target", "_blank");
          });
          resultEl.push(actors);
        }
        const previewImages = (_b2 = docParsed.querySelector(".columns .tile-images.preview-images")) == null ? void 0 : _b2.closest(".columns");
        if (previewImages) {
          previewImages.querySelectorAll(".preview-video-container").forEach((container) => {
            container.setAttribute("href", `#preview-video-${item.id}`);
          });
          (_c = previewImages.querySelector("#preview-video")) == null ? void 0 : _c.setAttribute("id", `preview-video-${item.id}`);
          previewImages.querySelectorAll("img[data-src]").forEach((img) => {
            img.setAttribute("src", img.getAttribute("data-src"));
          });
          resultEl.push(previewImages);
        }
      }
      const magnetTable = docParsed.querySelector(`div.columns[data-controller="movie-tab"]`);
      if (magnetTable) {
        magnetTable.querySelectorAll("div.top-meta").forEach((meta) => meta.remove());
        resultEl.push(magnetTable);
      }
      return resultEl;
    },
    [MISSAV]: getMagnetFromJavbus,
    [JABLE]: getMagnetFromJavbus,
    [AV123]: getMagnetFromJavbus
  };
  var root_1$3 = /* @__PURE__ */ from_html(`<div class="scroll-load svelte-3t0pvd"></div>`);
  var root_3$2 = /* @__PURE__ */ from_html(`<div class="scroll-end"> </div>`);
  var root_5 = /* @__PURE__ */ from_html(`<div class="scroll-error">error</div>`);
  var root$3 = /* @__PURE__ */ from_html(`<div class="scroll-status svelte-3t0pvd"><!></div>`);
  function LoadMore($$anchor, $$props) {
    push($$props, true);
    const [LOAD, ERROR, END] = ["1", "2", "3"];
    let status = /* @__PURE__ */ state("");
    let el;
    let locked = false;
    let nextURL;
    function init2() {
      var _a2;
      nextURL = (_a2 = document.body.querySelector(Page.pageNext)) == null ? void 0 : _a2.getAttribute("href");
      nextURL && addListener();
    }
    function addListener() {
      document.addEventListener("scroll", domWatch);
      history.scrollRestoration = "manual";
    }
    function removeListener() {
      document.removeEventListener("scroll", domWatch);
      history.scrollRestoration = "auto";
    }
    function domWatch() {
      if (el.getBoundingClientRect().top - window.innerHeight < 300 && !locked && nextURL) {
        locked = true;
        loadNextPage(nextURL).then(() => {
          locked = false;
        });
      }
    }
    async function loadNextPage(url) {
      var _a2, _b2, _c;
      try {
        console.log(url);
        set(status, LOAD, true);
        let responseText = await safeFetch(url, { credentials: "same-origin" });
        let doc = new DOMParser().parseFromString(responseText, "text/html");
        let items = $$props.itemsOperations.get(doc.body.querySelectorAll(Page.itemSelector));
        (_b2 = (_a2 = $$props.itemsOperations).filter) == null ? void 0 : _b2.call(_a2, items);
        $$props.itemsOperations.update(items);
        $$props.config.pageHistory && history.pushState({}, "", url);
        nextURL = (_c = doc.body.querySelector(Page.pageNext)) == null ? void 0 : _c.getAttribute("href");
        set(status, nextURL ? "" : END, true);
      } catch (error) {
        console.log(error);
        set(status, ERROR, true);
      }
    }
    init2();
    onDestroy(removeListener);
    var div = root$3();
    var node = child(div);
    {
      var consequent = ($$anchor2) => {
        var div_1 = root_1$3();
        append($$anchor2, div_1);
      };
      var alternate = ($$anchor2, $$elseif) => {
        {
          var consequent_1 = ($$anchor3) => {
            var div_2 = root_3$2();
            var text = child(div_2);
            template_effect(() => set_text(text, LANG.autoPage_end));
            append($$anchor3, div_2);
          };
          var alternate_1 = ($$anchor3, $$elseif2) => {
            {
              var consequent_2 = ($$anchor4) => {
                var div_3 = root_5();
                append($$anchor4, div_3);
              };
              if_block(
                $$anchor3,
                ($$render) => {
                  if (get(status) == ERROR) $$render(consequent_2);
                },
                $$elseif2
              );
            }
          };
          if_block(
            $$anchor2,
            ($$render) => {
              if (get(status) == END) $$render(consequent_1);
              else $$render(alternate_1, false);
            },
            $$elseif
          );
        }
      };
      if_block(node, ($$render) => {
        if (get(status) == LOAD) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    bind_this(div, ($$value) => el = $$value, () => el);
    append($$anchor, div);
    pop();
  }
  const searchOptionsAll = {
    [JAVFREE]: {
      urlPrefix: "https://javfree.me/?s=",
      resultSelector: "#primary article h2.entry-title>a",
      imgSelector: '#primary .entry-content>p>img[src$=".jpeg"]'
    },
    [BLOGJAV]: {
      urlPrefix: "https://blogjav.net/?s=",
      resultSelector: "#primary article h2.entry-title>a",
      imgSelector: '#primary .entry-content>p img[src*="pixhost.to/thumbs"]',
      parseSrc: (src) => src.replace("thumbs", "images").replace("//t", "//img")
    }
  };
  let searchOptions = searchOptionsAll[JAVFREE];
  const setSearchOptions = (site) => {
    searchOptions = searchOptionsAll[site];
  };
  async function getPreviewSearchResult(avid) {
    const r2 = await getRequest(searchOptions.urlPrefix + avid, { timeout: 2e4 });
    const doc = new DOMParser().parseFromString(r2.responseText, "text/html");
    const resultsEl = doc.querySelectorAll(searchOptions.resultSelector);
    const results = Array.from(resultsEl).map((v2) => ({
      title: v2.innerHTML,
      href: v2.href
    }));
    for (let i2 = 0; i2 < results.length; i2++) {
      const src = await getPreviewUrl(results[i2].href);
      if (src.length > 0) {
        results[i2].src = src;
        return results.slice(i2);
      }
    }
    throw new Error(LANG.preview_none);
  }
  async function getPreviewUrl(href) {
    const r2 = await getRequest(href);
    const doc = new DOMParser().parseFromString(r2.responseText, "text/html");
    const imgElements = doc.querySelectorAll(searchOptions.imgSelector);
    const src = Array.from(imgElements).map((img) => img.src);
    const parseSrc = searchOptions.parseSrc;
    return parseSrc ? src.map(parseSrc) : src;
  }
  const download = (_2, results, current, downloadStatus) => {
    const src = results[get(current)].src;
    if (downloadStatus.isLoading || !src) return;
    asyncWithLoading(
      async () => {
        for (let index2 = 0; index2 < src.length; index2++) {
          await getDownload(src[index2]);
        }
      },
      downloadStatus
    );
  };
  var root_1$2 = /* @__PURE__ */ from_html(`<li> </li>`);
  var root_4$1 = /* @__PURE__ */ from_html(`<div class="img-none svelte-1i4knad"> </div>`);
  var on_click$2 = (__1, item) => get(item).zoom = !get(item).zoom;
  var root_7 = /* @__PURE__ */ from_html(`<img/>`);
  var root_3$1 = /* @__PURE__ */ from_html(`<div class="svelte-1i4knad"><!></div>`);
  var root$2 = /* @__PURE__ */ from_html(`<div class="preview-panel svelte-1i4knad"><ul class="preview-title-ul svelte-1i4knad"></ul> <span><!></span> <!></div>`);
  function Preview($$anchor, $$props) {
    push($$props, true);
    let results = proxy($$props.results);
    let current = /* @__PURE__ */ state(0);
    let downloadStatus = proxy({ isLoading: false });
    const showImage = (index2) => {
      const item = results[index2];
      set(current, index2, true);
      if (item.isLoading || item.src) {
        return;
      } else {
        asyncWithLoading(
          async () => {
            item.src = await getPreviewUrl(item.href);
          },
          item
        );
      }
    };
    var div = root$2();
    var ul = child(div);
    each(ul, 21, () => results, index, ($$anchor2, item, index2) => {
      var li = root_1$2();
      li.__click = () => showImage(index2);
      var text = child(li);
      template_effect(() => {
        set_class(
          li,
          1,
          clsx([
            "preview-title",
            get(current) === index2 && "preview-title-current",
            get(item).isLoading && "preview-title-loading"
          ]),
          "svelte-1i4knad"
        );
        set_text(text, get(item).title);
      });
      append($$anchor2, li);
    });
    var span = sibling(ul, 2);
    span.__click = [download, results, current, downloadStatus];
    var node = child(span);
    html(node, () => downloadSvg);
    var node_1 = sibling(span, 2);
    each(node_1, 17, () => results, index, ($$anchor2, item, index$1) => {
      var fragment = comment();
      var node_2 = first_child(fragment);
      {
        var consequent_2 = ($$anchor3) => {
          var div_1 = root_3$1();
          var node_3 = child(div_1);
          {
            var consequent = ($$anchor4) => {
              var div_2 = root_4$1();
              var text_1 = child(div_2);
              template_effect(() => set_text(text_1, LANG.preview_none));
              append($$anchor4, div_2);
            };
            var alternate = ($$anchor4, $$elseif) => {
              {
                var consequent_1 = ($$anchor5) => {
                  var fragment_1 = comment();
                  var node_4 = first_child(fragment_1);
                  each(node_4, 17, () => get(item).src, index, ($$anchor6, src) => {
                    var img = root_7();
                    img.__click = [on_click$2, item];
                    template_effect(() => {
                      set_attribute(img, "src", get(src));
                      set_class(
                        img,
                        1,
                        clsx([
                          "preview-img",
                          get(item).zoom && "img-zoom"
                        ]),
                        "svelte-1i4knad"
                      );
                    });
                    append($$anchor6, img);
                  });
                  append($$anchor5, fragment_1);
                };
                if_block(
                  $$anchor4,
                  ($$render) => {
                    if (get(item).src && get(item).src.length > 0) $$render(consequent_1);
                  },
                  $$elseif
                );
              }
            };
            if_block(node_3, ($$render) => {
              if (get(item).src && get(item).src.length == 0) $$render(consequent);
              else $$render(alternate, false);
            });
          }
          append($$anchor3, div_1);
        };
        if_block(node_2, ($$render) => {
          if (get(current) == index$1) $$render(consequent_2);
        });
      }
      append($$anchor2, fragment);
    });
    template_effect(() => set_class(
      span,
      1,
      clsx([
        "preview-dwonload",
        downloadStatus.isLoading && "span-loading"
      ]),
      "svelte-1i4knad"
    ));
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);
  enable_legacy_mode_flag();
  function onclick(e2, hide) {
    e2.target.id === "myModal" && hide();
  }
  function onkeydown(e2, hide) {
    if (e2.key === "Escape") {
      hide();
    }
  }
  var root$1 = /* @__PURE__ */ from_html(`<div id="myModal" class="hidden-b svelte-196dhj1" tabindex="-1"><div id="modal-div" class="svelte-196dhj1"></div></div>`);
  function Modal($$anchor, $$props) {
    push($$props, false);
    let modalEl = /* @__PURE__ */ mutable_source();
    let isFirst = true;
    function creatEl(id2, innerHTML = "") {
      const div = document.createElement("div");
      div.classList.add("modal-content-b");
      div.setAttribute("id", id2);
      div.innerHTML = innerHTML;
      return div;
    }
    function append$1(id2, content) {
      if (isFirst) {
        isFirst = false;
        init$1();
      }
      let el;
      if (typeof content === "string") {
        el = creatEl(id2, content);
      } else if (Array.isArray(content)) {
        el = creatEl(id2);
        el.append(...content);
      } else if (content instanceof Object && content.props) {
        el = creatEl(id2);
        mount(content.component, { target: el, props: content.props });
      } else {
        throw new Error("content can't be parsed");
      }
      get(modalEl).querySelector("#modal-div").append(el);
      show();
    }
    function show(id2) {
      var _a2;
      document.documentElement.classList.add("scrollBarHide");
      if (id2) {
        (_a2 = get(modalEl).querySelector(`#${id2}`)) == null ? void 0 : _a2.classList.remove("hidden-b");
      }
      get(modalEl).classList.remove("hidden-b");
      get(modalEl).focus();
      mutate(modalEl, get(modalEl).scrollTop = 0);
    }
    function hide() {
      document.documentElement.classList.remove("scrollBarHide");
      get(modalEl).classList.add("hidden-b");
      get(modalEl).querySelectorAll(".modal-content-b").forEach((el) => el.classList.add("hidden-b"));
    }
    function init$1() {
      setScrollBarWidth();
      if (Page.name == JAVBUS) {
        globalThis.$(get(modalEl)).magnificPopup({
          delegate: "a.sample-box-zdy:visible",
          type: "image",
          closeOnContentClick: false,
          closeBtnInside: false,
          mainClass: "mfp-with-zoom mfp-img-mobile",
          image: { verticalFit: true },
          gallery: { enabled: true },
          zoom: {
            enabled: true,
            duration: 300,
            opener(element) {
              return element.find("img");
            }
          }
        });
      }
    }
    function setScrollBarWidth() {
      const el = document.createElement("p");
      Object.assign(el.style, {
        position: "absolute",
        top: "-1000px",
        width: "100px",
        height: "100px",
        overflowY: "scroll"
      });
      document.body.appendChild(el);
      const scrollBarWidth = el.offsetWidth - el.clientWidth;
      el.remove();
      _GM_addStyle(`.scrollBarHide{ padding-right: ${scrollBarWidth}px;overflow:hidden;}`);
    }
    init();
    var div_1 = root$1();
    div_1.__click = [onclick, hide];
    div_1.__keydown = [onkeydown, hide];
    bind_this(div_1, ($$value) => set(modalEl, $$value), () => get(modalEl));
    append($$anchor, div_1);
    bind_prop($$props, "append", append$1);
    bind_prop($$props, "show", show);
    return pop({ append: append$1, show });
  }
  delegate(["click", "keydown"]);
  var on_click$1 = (event, handleClick, item) => handleClick(event, item());
  var root_1$1 = /* @__PURE__ */ from_html(`<div class="toolbar-b svelte-1ljjefi"><span data-name="magnet"><!></span> <span data-name="preview"><!></span> <span data-name="link"><!></span></div>`);
  var root_4 = /* @__PURE__ */ from_html(`<div class="score svelte-1ljjefi"><!></div>`);
  var root_2 = /* @__PURE__ */ from_html(`<a class="box-b svelte-1ljjefi"><div class="cover-b svelte-1ljjefi"><img class="lazy svelte-1ljjefi"/> <!></div> <div class="detail-b svelte-1ljjefi"><div> </div> <!> <div class="info-bottom svelte-1ljjefi"><div class="svelte-1ljjefi"><span class="detail-avid svelte-1ljjefi"> </span> <span class="svelte-1ljjefi">/ <span class="svelte-1ljjefi"> </span></span></div> <div class="item-tag svelte-1ljjefi"><!></div> <!></div></div></a>`);
  var root_8 = /* @__PURE__ */ from_html(`<div class="svelte-1ljjefi"><!></div>`);
  var root_6 = /* @__PURE__ */ from_html(`<div class="item-b svelte-1ljjefi"><!></div>`);
  var root = /* @__PURE__ */ from_html(`<div id="grid-b"></div> <!>`, 1);
  function JavbusAndJavdb($$anchor, $$props) {
    var _a2;
    push($$props, true);
    const toolbar = ($$anchor2, item = noop) => {
      var div = root_1$1();
      div.__click = [on_click$1, handleClick, item];
      var span = child(div);
      var node = child(span);
      html(node, () => magnetSvg);
      var span_1 = sibling(span, 2);
      var node_1 = child(span_1);
      html(node_1, () => pictureSvg);
      var span_2 = sibling(span_1, 2);
      var node_2 = child(span_2);
      html(node_2, () => linkSvg);
      template_effect(() => {
        set_class(span, 1, clsx({ "span-loading": item().magnetLoading }), "svelte-1ljjefi");
        set_attribute(span, "title", LANG.tip_magnet);
        set_class(span_1, 1, clsx({ "span-loading": item().previewLoading }), "svelte-1ljjefi");
        set_attribute(span_1, "title", LANG.tip_preview);
        set_class(span_2, 1, clsx({ "span-loading": item().linkLoading }), "svelte-1ljjefi");
        set_attribute(span_2, "title", LANG.tip_link);
      });
      append($$anchor2, div);
    };
    const box = ($$anchor2, item = noop) => {
      var a2 = root_2();
      var div_1 = child(a2);
      var img_1 = child(div_1);
      var node_3 = sibling(img_1, 2);
      {
        var consequent = ($$anchor3) => {
          toolbar($$anchor3, item);
        };
        if_block(node_3, ($$render) => {
          if (config.toolbar && config.autoHide) $$render(consequent);
        });
      }
      var div_2 = sibling(div_1, 2);
      var div_3 = child(div_2);
      div_3.__click = function(...$$args) {
        var _a3;
        (_a3 = config.clickToCopy ? (event) => clickToCopy(event) : void 0) == null ? void 0 : _a3.apply(this, $$args);
      };
      var text = child(div_3);
      var node_4 = sibling(div_3, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var div_4 = root_4();
          var node_5 = child(div_4);
          html(node_5, () => item().score);
          append($$anchor3, div_4);
        };
        if_block(node_4, ($$render) => {
          if (Page.name == JAVDB) $$render(consequent_1);
        });
      }
      var div_5 = sibling(node_4, 2);
      var div_6 = child(div_5);
      var span_3 = child(div_6);
      span_3.__click = function(...$$args) {
        var _a3;
        (_a3 = config.clickToCopy ? (event) => clickToCopy(event) : void 0) == null ? void 0 : _a3.apply(this, $$args);
      };
      var text_1 = child(span_3);
      var span_4 = sibling(span_3, 2);
      var span_5 = sibling(child(span_4));
      var text_2 = child(span_5);
      var div_7 = sibling(div_6, 2);
      var node_6 = child(div_7);
      html(node_6, () => item().itemTag);
      var node_7 = sibling(div_7, 2);
      {
        var consequent_2 = ($$anchor3) => {
          toolbar($$anchor3, item);
        };
        if_block(node_7, ($$render) => {
          if (config.toolbar && !config.autoHide) $$render(consequent_2);
        });
      }
      template_effect(() => {
        set_attribute(a2, "href", item().href);
        set_attribute(a2, "target", config.newWindow ? "_blank" : "_self");
        set_attribute(img_1, "data-src", item().src);
        set_class(
          div_3,
          1,
          clsx([
            "detail-title",
            !config.fullTitle && "titleNowrap"
          ]),
          "svelte-1ljjefi"
        );
        set_text(text, item().title);
        set_text(text_1, item().AVID);
        set_text(text_2, item().date);
      });
      append($$anchor2, a2);
    };
    let gridEL;
    const isHalfImgBlock = Boolean((_a2 = Page.halfImgBlockPages) == null ? void 0 : _a2.find((page) => location.href.includes(page)));
    let isFullImg = /* @__PURE__ */ user_derived(() => isHalfImgBlock || !config.halfImg);
    let windowWidth = /* @__PURE__ */ state(proxy(window.innerWidth));
    let AvItems = proxy([]);
    let lazyLoad;
    function init2() {
      lazyLoad = new g({
        callback_loaded: (img) => imgResize(img)
      });
      itemsOperations.update(itemsOperations.get(Page.rawItemsEl));
      watchConfig();
      window.addEventListener("resize", () => {
        set(windowWidth, window.innerWidth, true);
      });
    }
    const itemsOperations = {
      get: (raw) => {
        return Array.from(raw).map((el) => Page.getAvItem(el));
      },
      filter: (items) => {
        if (Page.name == JAVBUS && location.pathname.includes("/star/") && items) {
          items.splice(0, 1);
        }
      },
      update: (items) => {
        AvItems.push(...items);
        tick().then(() => {
          lazyLoad.update();
        });
      }
    };
    function handleClick(event, item) {
      var _a3;
      event.preventDefault();
      const name = (_a3 = event.target.closest("span[data-name]")) == null ? void 0 : _a3.getAttribute("data-name");
      if (!name || !(name in toolbarFunc)) return;
      const loadingName = `${name}Loading`;
      const contentId = `${name}-${item.id}`;
      if (item[loadingName]) return;
      if (item.hasOwnProperty(contentId)) {
        modal.show(contentId);
        return;
      }
      asyncWithLoading(
        async () => {
          const content = await toolbarFunc[name](item);
          if (content) {
            modal.append(contentId, content);
            item[contentId] = contentId;
          }
        },
        item,
        loadingName
      );
    }
    const toolbarFunc = {
      magnet: async (item) => {
        return await getMagnet[Page.name](item);
      },
      preview: async (item) => {
        const results = await getPreviewSearchResult(item.AVID);
        return { component: Preview, props: { results } };
      },
      link: async (item) => {
        new URL(config.linkUrl);
        if (!config.linkUrl.endsWith("/")) {
          config.linkUrl += "/";
        }
        const url = `${config.linkUrl}${item.AVID}`;
        await getRequest(url, { method: "HEAD" });
        window.open(url, "_blank");
      }
    };
    function imgResize(img) {
      const imgRatio = img.naturalHeight / img.naturalWidth;
      if (imgRatio > 0.8) {
        if (get(isFullImg)) {
          img.style = "object-fit: contain;";
        } else {
          if (imgRatio < 1.3) {
            img.style = "object-position: bottom;object-fit:contain";
          } else {
            img.style = "object-position: center;object-fit:cover";
          }
        }
      }
    }
    function watchConfig() {
      let isFirst = true;
      user_effect(() => {
        config.halfImg;
        if (isFirst) {
          isFirst = false;
          return;
        }
        gridEL.querySelectorAll(".box-b img.loaded").forEach((element) => {
          imgResize(element);
        });
      });
    }
    const setcolumnNum = () => {
      let columnNum;
      if (config.autoColumn) {
        columnNum = Math.round(get(windowWidth) / (get(isFullImg) ? 500 : 350));
      } else {
        columnNum = get(isFullImg) ? config.columnNumFull : config.columnNumHalf;
      }
      _GM_addStyle(`#grid-b .item-b{ width:${100 / columnNum}%; }`);
    };
    if (Page.name == JAVDB) {
      user_pre_effect(() => {
        const el = document.body.querySelector(".section .container");
        if (config.maxWidth) {
          el.classList.add("max-width-100");
        } else {
          el.classList.remove("max-width-100");
        }
      });
    }
    user_pre_effect(setcolumnNum);
    init2();
    mount(Menu, {
      target: document.body,
      props: { config, isHalfImgBlock }
    });
    const modal = mount(Modal, { target: document.body });
    user_pre_effect(() => {
      setSearchOptions(config.previewSite);
    });
    var fragment_2 = root();
    var div_8 = first_child(fragment_2);
    each(div_8, 21, () => AvItems, index, ($$anchor2, item) => {
      var div_9 = root_6();
      var node_8 = child(div_9);
      {
        var consequent_3 = ($$anchor3) => {
          box($$anchor3, () => get(item));
        };
        var alternate = ($$anchor3) => {
          var div_10 = root_8();
          var node_9 = child(div_10);
          html(node_9, () => get(item).html);
          append($$anchor3, div_10);
        };
        if_block(node_8, ($$render) => {
          if (get(item).AVID) $$render(consequent_3);
          else $$render(alternate, false);
        });
      }
      append($$anchor2, div_9);
    });
    bind_this(div_8, ($$value) => gridEL = $$value, () => gridEL);
    var node_10 = sibling(div_8, 2);
    {
      var consequent_4 = ($$anchor2) => {
        LoadMore($$anchor2, {
          get itemsOperations() {
            return itemsOperations;
          },
          get config() {
            return config;
          }
        });
      };
      if_block(node_10, ($$render) => {
        if (config.autoPage) $$render(consequent_4);
      });
    }
    template_effect(() => set_class(div_8, 1, clsx(get(isFullImg) ? "full-b" : "half-b"), "svelte-1ljjefi"));
    append($$anchor, fragment_2);
    pop();
  }
  delegate(["click"]);
  var root_1 = /* @__PURE__ */ from_html(`<span><!></span>`);
  var on_click = (event, showMagnet) => showMagnet(event);
  var root_3 = /* @__PURE__ */ from_html(`<span><!></span>`);
  function Magnet($$anchor, $$props) {
    push($$props, true);
    let config2 = prop($$props, "config", 19, () => ({}));
    const id2 = "magnet" + Math.random().toString(16).slice(2);
    let loadState = proxy({ isLoading: false, isLoaded: false });
    function showMagnet(event) {
      event.preventDefault();
      if (loadState.isLoading) return;
      if (loadState.isLoaded) {
        $$props.modal.show(id2);
        return;
      }
      asyncWithLoading(
        async () => {
          const content = await getMagnet[Page.name]($$props.AVID);
          $$props.modal.append(id2, content);
          loadState.isLoaded = true;
        },
        loadState
      );
    }
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        var span = root_1();
        span.__click = showMagnet;
        var node_1 = child(span);
        html(node_1, () => magnetSvg);
        template_effect(() => set_class(
          span,
          1,
          clsx([
            "magnet-grid",
            loadState.isLoading && "span-loading",
            config2().toolbar === false && "hidden-b"
          ]),
          "svelte-zo3rh"
        ));
        append($$anchor2, span);
      };
      var alternate = ($$anchor2, $$elseif) => {
        {
          var consequent_1 = ($$anchor3) => {
            var span_1 = root_3();
            span_1.__click = [on_click, showMagnet];
            var node_2 = child(span_1);
            html(node_2, () => magnetSvg);
            template_effect(() => set_class(
              span_1,
              1,
              clsx([
                "magnet-video",
                loadState.isLoading && "span-loading"
              ]),
              "svelte-zo3rh"
            ));
            append($$anchor3, span_1);
          };
          if_block(
            $$anchor2,
            ($$render) => {
              if (Page.pageType == VIDEO) $$render(consequent_1);
            },
            $$elseif
          );
        }
      };
      if_block(node, ($$render) => {
        if (Page.pageType == GRID) $$render(consequent);
        else $$render(alternate, false);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  delegate(["click"]);
  function Missav($$anchor, $$props) {
    push($$props, false);
    let lozadObj;
    function init$1() {
      let items = itemsOperations.get(Page.rawItemsEl);
      itemsOperations.filter(items);
      lozadObj = lozad(".lozad", {
        loaded(element) {
          element.classList.remove("lozad");
        }
      });
    }
    const itemsOperations = {
      get: (raw) => {
        var _a2;
        for (let i2 = 0; i2 < raw.length; i2++) {
          const el = raw[i2];
          const AVID = (_a2 = el.querySelector("a")) == null ? void 0 : _a2.getAttribute("alt");
          mount(Magnet, {
            target: el.querySelector("div.thumbnail>div:first-child"),
            props: { AVID, type: Page.pageType, modal, config }
          });
        }
        return raw;
      },
      filter: (items) => {
        if (config.uncensoredFilter) {
          items.forEach((element) => {
            let el = element.querySelector("a[alt$=uncensored-leak]");
            if (el) {
              element.style.display = "none";
            }
          });
        }
      },
      update: (items) => {
        Page.rawGridEl.append(...Array.from(items));
        tick().then(() => {
          lozadObj.observe();
        });
      }
    };
    const modal = mount(Modal, { target: document.body });
    init$1();
    mount(Menu, { target: document.body, props: { config } });
    init();
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        LoadMore($$anchor2, {
          get itemsOperations() {
            return itemsOperations;
          },
          get config() {
            return config;
          }
        });
      };
      if_block(node, ($$render) => {
        if (config.autoPage) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  function Jable($$anchor, $$props) {
    push($$props, false);
    function parseItems(raw) {
      for (let i2 = 0; i2 < raw.length; i2++) {
        const imgBox = raw[i2].querySelector(".img-box a");
        const AVID = imgBox.href.split("/").filter(Boolean).slice(-1)[0];
        mount(Magnet, {
          target: imgBox,
          props: { AVID, type: Page.pageType, modal }
        });
      }
    }
    function creatObserver() {
      const targetSelector = location.pathname.includes("/my/") ? "#site-content>.container" : "#site-content";
      const targetNode = document.body.querySelector(targetSelector);
      if (!targetNode) return;
      const callback = function(mutationsList) {
        mutationsList.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((addNode) => {
              if (/list_videos.*_videos/.test(addNode.id)) {
                requestAnimationFrame(() => {
                  parseItems(document.body.querySelectorAll(Page.itemSelector));
                });
              }
            });
          }
        });
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, { childList: true });
    }
    const modal = mount(Modal, { target: document.body });
    parseItems(Page.rawItemsEl);
    creatObserver();
    init();
    pop();
  }
  function Av123($$anchor, $$props) {
    push($$props, false);
    const itemsOperations = {
      get: (raw) => {
        var _a2;
        for (let i2 = 0; i2 < raw.length; i2++) {
          const el = raw[i2];
          const href = (_a2 = el.querySelector("a[title]")) == null ? void 0 : _a2.getAttribute("href");
          const AVID = href.split("/").filter(Boolean).slice(-1)[0];
          mount(Magnet, {
            target: el.querySelector("div.thumb"),
            props: { AVID, type: Page.pageType, modal, config }
          });
        }
        return raw;
      },
      update: (items) => {
        Page.rawGridEl.append(...Array.from(items));
      }
    };
    const modal = mount(Modal, { target: document.body });
    itemsOperations.get(Page.rawItemsEl);
    mount(Menu, { target: document.body, props: { config } });
    init();
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor2) => {
        LoadMore($$anchor2, {
          get itemsOperations() {
            return itemsOperations;
          },
          get config() {
            return config;
          }
        });
      };
      if_block(node, ($$render) => {
        if (config.autoPage) $$render(consequent);
      });
    }
    append($$anchor, fragment);
    pop();
  }
  function render(GridComponent) {
    if (Page.pageType == GRID) {
      const target = document.createElement("div");
      Page.rawGridEl.insertAdjacentElement("afterend", target);
      mount(GridComponent, { target });
    } else if (Page.pageType == VIDEO) {
      const AVID = location.pathname.split("/").filter(Boolean).slice(-1)[0];
      const modal = mount(Modal, { target: document.body });
      mount(Magnet, {
        target: Page.rawGridEl,
        props: { AVID, modal }
      });
    }
  }
  function main() {
    const target = document.createElement("div");
    Page.rawGridEl.style.display = "none";
    Page.rawGridEl.insertAdjacentElement("beforebegin", target);
    mount(JavbusAndJavdb, { target });
  }
  const pageComponentMap = {
    [MISSAV]: Missav,
    [AV123]: Av123,
    [JABLE]: Jable,
    [JAVBUS]: JavbusAndJavdb,
    [JAVDB]: JavbusAndJavdb
  };
  if (pageComponentMap[Page.name]) {
    if (Page.name === JAVBUS || Page.name === JAVDB) {
      main();
    } else {
      render(pageComponentMap[Page.name]);
    }
  }

})();