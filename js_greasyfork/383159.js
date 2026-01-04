// ==UserScript==
// @name               DMHY download helper
// @name:zh-CN         动漫花园下载助手
// @description        A userscript for share.dmhy.org.
// @description:zh-CN  动漫花园（share.dmhy.org）扩展，提供批量选择、列表下载种子文件及详情页树状展示等功能。
// @author             Xingwang Liao
// @namespace          https://github.com/kuoruan
// @homepage           https://github.com/kuoruan/dmhy-download-helper#readme
// @supportURL         https://github.com/kuoruan/dmhy-download-helper/issues
// @match              *://dmhy.org/
// @match              *://dmhy.org/topics/list/*
// @match              *://dmhy.org/topics/list?*
// @match              *://dmhy.org/topics/view/*
// @match              *://www.dmhy.org/
// @match              *://www.dmhy.org/topics/list/*
// @match              *://www.dmhy.org/topics/list?*
// @match              *://www.dmhy.org/topics/view/*
// @match              *://share.dmhy.org/
// @match              *://share.dmhy.org/topics/list/*
// @match              *://share.dmhy.org/topics/list?*
// @match              *://share.dmhy.org/topics/view/*
// @match              *://dmhy.b168.net/
// @match              *://dmhy.b168.net/topics/list/*
// @match              *://dmhy.b168.net/topics/list?*
// @match              *://dmhy.b168.net/topics/view/*
// @require            https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js
// @require            https://cdn.jsdelivr.net/npm/xbytes@1.9.1/dist/index.min.js
// @connect            dmhy.org
// @connect            b168.net
// @grant              GM_addStyle
// @grant              GM_setClipboard
// @grant              GM_xmlhttpRequest
// @source             https://github.com/kuoruan/dmhy-download-helper.git
// @license            MIT
// @run-at             document-end
// @version            1.6.2
// @icon               https://share.dmhy.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/383159/DMHY%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/383159/DMHY%20download%20helper.meta.js
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle('body{position:relative}#topic_list .odd:hover,#topic_list .even:hover,#topic_list .odd:hover td,#topic_list .even:hover td{background-color:#0eb9e7}.toast[data-v-e92e135b]{position:fixed;bottom:30px;left:50%;z-index:99;display:none;padding:10px 20px;border-radius:2px;background-color:#333;transform:translate(-50%)}.toast.show[data-v-e92e135b]{display:block;animation:fadein-e92e135b .5s,fadeout-e92e135b .5s 2.5s}.toast .text[data-v-e92e135b]{color:#fff;font-size:14px;line-height:1.5}@-moz-keyframes fadein-e92e135b{0%{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@-webkit-keyframes fadein-e92e135b{0%{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@-o-keyframes fadein-e92e135b{0%{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@keyframes fadein-e92e135b{0%{bottom:0;opacity:0}to{bottom:30px;opacity:1}}@-moz-keyframes fadeout-e92e135b{0%{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@-webkit-keyframes fadeout-e92e135b{0%{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@-o-keyframes fadeout-e92e135b{0%{bottom:30px;opacity:1}to{bottom:0;opacity:0}}@keyframes fadeout-e92e135b{0%{bottom:30px;opacity:1}to{bottom:0;opacity:0}}.select-all[data-v-2f21319e],.select[data-v-6070ffc2]{cursor:pointer;width:14px;height:14px}.overlay[data-v-99f90792]{position:fixed;top:0;right:0;bottom:0;left:0;background-color:#0000004d;text-align:center}.overlay[data-v-99f90792]:after{display:inline-block;width:0;height:100%;content:"";vertical-align:middle}.overlay .popup[data-v-99f90792]{display:inline-block;overflow:hidden;padding:2px;border:1px solid #247;background-color:#fff;box-shadow:0 2px 12px #0000001a;text-align:left;backface-visibility:hidden}.overlay .popup.middle[data-v-99f90792]{vertical-align:middle}.btn[data-v-272d8422]{padding:2px 5px;outline:none;border:1px solid #247;background-color:#fff;color:#247}.popup-header[data-v-272d8422]{display:flex;flex-direction:row;align-items:center;padding:5px;background-color:#247}.popup-header h4[data-v-272d8422]{flex:1 1 0;color:#fff;text-align:left;font-weight:400;font-size:14px;line-height:1.5}.popup-body[data-v-272d8422]{padding:5px;background-color:#fff}.popup-body .links-box[data-v-272d8422]{overflow:auto;padding:4px 8px;border:1px solid #247;background-color:#eef;background-image:none;color:#333;font-size:12px;line-height:1.5;resize:none;cursor:text}.popup-footer[data-v-272d8422]{display:flex;flex-direction:row;align-items:center;padding:5px;background-color:#cdf}.popup-footer .btn[data-v-272d8422]:not(:first-child){margin-left:10px}.popup-footer p[data-v-272d8422]{flex:1 1 0;margin:0;text-align:right}.tool-bar[data-v-0aeef348]{display:none;background-color:#247;color:#fff}.tool-bar.top[data-v-0aeef348]{border-bottom:1px solid #fff}.tool-bar.bottom[data-v-0aeef348]{border-top:1px solid #fff}.tool-bar.visible[data-v-0aeef348]{display:block}.wrapper[data-v-0aeef348]{display:flex;flex-direction:row;align-items:center;height:auto}.wrapper label[data-v-0aeef348]{margin-left:10px}.wrapper .title[data-v-0aeef348]{padding:8px 15px;border-right:2px solid #fff}.wrapper .checkbox[data-v-0aeef348]{width:14px;height:14px;vertical-align:middle}.wrapper .btn-wrapper[data-v-0aeef348]{margin-left:10px}.wrapper .btn-wrapper .btn[data-v-0aeef348]{margin:0 5px;padding:2px 5px;outline:none;border:1px solid #247;background-color:#fff;color:#247}.loading[data-v-f5ce47f3]{display:inline-block;border:2px solid #dbdfe4;border-radius:50%;border-top:2px solid #075ea4;width:12px;height:12px;animation:spinner-f5ce47f3 2s linear infinite}@-moz-keyframes spinner-f5ce47f3{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes spinner-f5ce47f3{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-o-keyframes spinner-f5ce47f3{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes spinner-f5ce47f3{0%{transform:rotate(0)}to{transform:rotate(360deg)}}li.tree-item[data-v-3ab763b5]{margin:0;padding:2px 0 2px 16px;background:url(data:image/gif;base64,R0lGODlhEADwBvABAICAgAAAACH5BAUAAAEALAAAAAAQAPAGQAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydnp+QkaKjpKWmp6ipqqusp6ATDxKhEbMQvxehuAq1D7wOvg2wDMILxAvAuLLJtMu2zb3Pv8Gx08PVxdfH2svM3M7ewNDS4tTk1ubY6Nrt3N/t0e/j4eXz5/Xp9+v+6+D88v708PoD2B+Ajq64fwX8KACwc2LPjwoMKJDL0YS3ARQcYD/xsNdMyVDWNIjSM5lvR4EqQ6kStJtjT5EmVMlflY1nR5E2ZOmTtpGrT5E2dQnUN5FvUZEWhSoUuJNjX6FClFh1MhVpVYMStVrVa5Yt0KtmvYr2LLkj2r9Gpar2vHtjX7Fi1TtXPZ1nV7F25euU7p9rX7F29gvYP5QvV7GHBiwYsJNzYsVXFkxpMdV4b8MXNKzTM59/R8FHRU0Ygvxz29F3Vh1Y9Zm04Ne3Xs1rNfy75NG7ft3Lx3+yYtGThl4ZaJY96MvHPyz8tDNx/9vLRx19NrV9d9vXf239GDdx/+vXj448rLMzfvHD109dLHU3dvHT52+drpc2fvHT94/eL5k/8/D2B6Aa43YHv+vXdgfAnOt2B9Dd5XYH4R7jdhfxX+J2CGBGpo4IUIeqggiAyK6CCJEHIoIYoUqmghixhuCGOHLn44Y4g1jnhjiTmeGGOKPa74Y4tBvijjkDQaaSOSOCqpI5M8Fgmlj1ECOaWQVRIpZZZUamkll1huCWaXYX4pZplknnnklWl6ueaYbZr5JppJqjknm3W6eSececq5JJ192vknnoHqOSifTfp5KKCJCroooY0a+qSikTI6qaOVQrpdpvZp+iCnJnq6I6hOioropXGeuieqhar6KKumpgrrqrG2Ouurst5KK6625srrrr6SKimwlAprKbGYbopsp8knfrpsqM2O+mypxro6ba3V6nptr9n+Gm2w3Q77bbHhHqtsuczicksBADs=) 0 0 no-repeat}li.tree-item.collection[data-v-3ab763b5]{background-position:0 -176px}li.tree-item.last[data-v-3ab763b5]{background-position:0 -1766px}li.tree-item .hitarea[data-v-3ab763b5]{float:left;margin-left:-16px;width:16px;height:16px;background:url(data:image/gif;base64,R0lGODlhYACFAPACAAAAAICAgCH5BAUAAAIALAAAAABgAIUAAAL/lI+py+0PBZjA0Yiz3qjyD4aaJ5amSZ7qyrbuGsSy/NZmsOD2/unS4eMJIz5ScIhk4CgTAe6ZjCKKQKl1ejBet0dDdzucicHkstl5Tqul37X7fWrDUfNkqlqPXCzNPOjOIeeXNVhoeAgmNoNY8iXICOEIGSI52SPBhAZliVHJqeH52ZkjCqoYU5pq9aja+sLqGqsCqwoo+2BLW7fXwOtqCyoKfEtcbFx3inqMl6BbSuW1zKwljcZUAeU8CY1Wza39GXqcDF5tfo6ero4xXN3OmdnbF/u+nGtef3y/zu+UbC7O2DeAhKJ5w3Qh27iC3aQNPKignCVy/SpavCgtnzGNWsU4IvK1AGStih5vlcSIMhZFiM0IRnTZ8uA1TQ2JBSx20yYpb/9S+vwJdNBJeiSJiewwL6griUohMW06aKXDnVNfssQiM5NCgVSX5bz1VZZUqGTLmj2LNu2tAgA7) -48px -47px no-repeat;cursor:pointer}li.tree-item .hitarea.last-hitarea[data-v-3ab763b5]{background-color:#fff;background-position:-32px -69px}li.tree-item .hitarea.collapsable-hitarea[data-v-3ab763b5]{background-position:-16px -91px}li.tree-item .hitarea.collapsable-hitarea.last-hitarea[data-v-3ab763b5]{background-position:0 -113px}li.tree-item .title[data-v-3ab763b5]{position:relative;display:flex;flex-direction:row;box-sizing:border-box;padding-left:18px;width:100%;height:16px;line-height:16px}li.tree-item .title h5[data-v-3ab763b5]{flex:1 1 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400;font-size:12px}li.tree-item .title[data-v-3ab763b5]:before{position:absolute;top:0;left:0;display:block;width:16px;height:16px;background-color:#fff;background-repeat:no-repeat;content:""}li.tree-item .title.folder-close[data-v-3ab763b5]:before{background-image:url(data:image/gif;base64,R0lGODdhEAAOAPIHAK1zLeC6eP/insOHNP/////Sg59oJJdaHywAAAAAEAAOAEADM0i63AoiygnYkCWEwXkzYCg6RDeQyzWtB3MUcCy3aL1Ud33qDLRSDINsWDC4AMQYzUZKAAA7)}li.tree-item .title.folder-open[data-v-3ab763b5]:before{background-image:url(data:image/gif;base64,R0lGODlhEAAOAIIAAZdaH+C6eP/inq1zLf/////Sg59oJMOHNCwAAAAAEAAOAAIDN0i63P7vyAPXYBcewUsIk8RQFalsXKoCmDq8cEwMKa2mxWUUOe//GUDvB1wABsQiw8BsOitQQgIAOw==)}li.tree-item .title.document[data-v-3ab763b5]:before{background-image:url(data:image/gif;base64,R0lGODdhDwAOAPIHANS9fIy3oamMQX98XzmJdP////9tcGpsYiwAAAAADwAOAEADOlgl3KxQjWJMGefIKGi1UAdNUUQqYgQAKVoE8KQtZgHAAUFsYWm3rtKKxfH1jsbWybdclpqDqHSqSAAAOw==)}li.tree-item .title.video[data-v-3ab763b5]:before{background-image:url(/images/icon/mkv.gif)}li.tree-item .title.audio[data-v-3ab763b5]:before{background-image:url(/images/icon/mp3.gif)}li.tree-item .title.image[data-v-3ab763b5]:before{background-image:url(/images/icon/jpg.gif)}li.tree-item .title.archive[data-v-3ab763b5]:before{background-image:url(/images/icon/rar.gif)}li.tree-item .title.subtitle[data-v-3ab763b5]:before{background-image:url(/images/icon/txt.gif)}li.tree-item .title.unknown[data-v-3ab763b5]:before{background-image:url(/images/icon/unknown.gif)}li.tree-item .title .size[data-v-3ab763b5]{display:block;flex:0;color:gray;white-space:nowrap}li.tree-item:nth-child(2n)>.title[data-v-3ab763b5]{background-color:#cdf}li.tree-item::nth-child(odd)>.title[data-v-3ab763b5]{background-color:#fff}li.tree-item ul[data-v-3ab763b5]{margin:4px 0 0;padding:0;list-style:none}');
})();
(function(Vue2, XBytes) {
  "use strict";
  var render$9 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "toast", class: { "show": _vm.show } }, [_c("span", { staticClass: "text" }, [_vm._v(_vm._s(_vm.text))])]);
  };
  var staticRenderFns$9 = [];
  function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render2) {
      options.render = render2;
      options.staticRenderFns = staticRenderFns2;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const _sfc_main$9 = {
    name: "ToastItem",
    data() {
      return {
        text: "",
        show: false,
        timer: 0
      };
    },
    methods: {
      display(text) {
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = 0;
        }
        this.text = text;
        this.show = true;
        const _self = this;
        this.timer = window.setTimeout(function() {
          _self.show = false;
          _self.text = "";
          _self.timer = 0;
        }, 3e3);
      }
    }
  };
  var __component__$9 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$9,
    render$9,
    staticRenderFns$9,
    false,
    null,
    "e92e135b"
  );
  const ToastItem = __component__$9.exports;
  var render$8 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("th", { staticClass: "{sorter: false}", attrs: { "width": "40" } }, [_c("input", { directives: [{ name: "model", rawName: "v-model", value: _vm.checked, expression: "checked" }], staticClass: "select-all", attrs: { "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.checked) ? _vm._i(_vm.checked, null) > -1 : _vm.checked }, on: { "change": [function($event) {
      var $$a = _vm.checked, $$el = $event.target, $$c = $$el.checked ? true : false;
      if (Array.isArray($$a)) {
        var $$v = null, $$i = _vm._i($$a, $$v);
        if ($$el.checked) {
          $$i < 0 && (_vm.checked = $$a.concat([$$v]));
        } else {
          $$i > -1 && (_vm.checked = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
        }
      } else {
        _vm.checked = $$c;
      }
    }, function($event) {
      return _vm.$emit("change", $event.target.checked);
    }] } })]);
  };
  var staticRenderFns$8 = [];
  const _sfc_main$8 = {
    name: "CheckboxHeader",
    data() {
      return {
        checked: false
      };
    }
  };
  var __component__$8 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$8,
    render$8,
    staticRenderFns$8,
    false,
    null,
    "2f21319e"
  );
  const CheckboxHeader = __component__$8.exports;
  var render$7 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("td", { attrs: { "width": "40" } }, [_c("input", { directives: [{ name: "model", rawName: "v-model", value: _vm.checked, expression: "checked" }], staticClass: "select", attrs: { "type": "checkbox", "data-index": _vm.index }, domProps: { "checked": Array.isArray(_vm.checked) ? _vm._i(_vm.checked, null) > -1 : _vm.checked }, on: { "change": [function($event) {
      var $$a = _vm.checked, $$el = $event.target, $$c = $$el.checked ? true : false;
      if (Array.isArray($$a)) {
        var $$v = null, $$i = _vm._i($$a, $$v);
        if ($$el.checked) {
          $$i < 0 && (_vm.checked = $$a.concat([$$v]));
        } else {
          $$i > -1 && (_vm.checked = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
        }
      } else {
        _vm.checked = $$c;
      }
    }, function($event) {
      return _vm.$emit("change", $event.target.checked);
    }] } })]);
  };
  var staticRenderFns$7 = [];
  const _sfc_main$7 = {
    name: "CheckboxItem",
    props: {
      index: {
        type: Number,
        default: 0
      },
      magnet: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        checked: false
      };
    }
  };
  var __component__$7 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$7,
    render$7,
    staticRenderFns$7,
    false,
    null,
    "6070ffc2"
  );
  const CheckboxItem = __component__$7.exports;
  var render$6 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "overlay", style: { "z-index": _vm.zIndex }, on: { "click": function($event) {
      if ($event.target !== $event.currentTarget)
        return null;
      return _vm.$emit("overlay-click");
    }, "touchmove": _vm.onScroll, "mousewheel": _vm.onScroll } }, [_c("div", { staticClass: "popup", class: { "middle": _vm.middle }, style: { "margin-top": `${_vm.marginTop}px` } }, [_vm._t("default")], 2)]);
  };
  var staticRenderFns$6 = [];
  const _sfc_main$6 = {
    name: "PopupWrapper",
    props: {
      zIndex: {
        type: Number,
        default: 10
      },
      middle: {
        type: Boolean,
        default: false
      },
      marginTop: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onScroll(evt) {
        const el = evt.target;
        const { overflow, overflowY, overflowX } = window.getComputedStyle(el);
        const { scrollTop, scrollHeight, clientHeight } = el;
        const isAutoOrScroll = /(auto|scroll)/.test(
          overflow + overflowX + overflowY
        );
        const scroll = scrollTop === 0 && evt.deltaY < 0 || Math.abs(scrollTop - (scrollHeight - clientHeight)) <= 1 && evt.deltaY > 0;
        if (!isAutoOrScroll || scroll) {
          evt.preventDefault();
        }
      }
    }
  };
  var __component__$6 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$6,
    render$6,
    staticRenderFns$6,
    false,
    null,
    "99f90792"
  );
  const PopupWrapper = __component__$6.exports;
  function magnetLinksWithOptions(magnetLinks, opts) {
    if (!magnetLinks || magnetLinks.length <= 0) {
      return [];
    }
    if (opts.clean) {
      return magnetLinks.map((l) => l.substring(0, l.indexOf("&")));
    }
    return [...magnetLinks];
  }
  function getDefaultLinebreak() {
    let linebreak = "\n";
    if (navigator.userAgent.indexOf("Windows") > -1) {
      linebreak = "\r\n";
    }
    return linebreak;
  }
  function hashCode(str) {
    let hash = 0;
    if (!str || str.length <= 0)
      return hash;
    for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
  const TORRENT_LINK_TAG_REGEX = /<a(?:.+)href=["']((?:https?:)?\/\/[^"']+\.torrent)["'](?:.*)>(.+)?<\/a>/;
  function getTorrentLinkFromHTML(html) {
    const matches = html.match(TORRENT_LINK_TAG_REGEX);
    if (matches && matches.length === 3) {
      return { href: matches[1].replace(/\n/g, ""), title: matches[2] };
    }
    return null;
  }
  var render$5 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("popup-wrapper", { attrs: { "z-index": _vm.zIndex, "middle": false, "margin-top": 100 }, on: { "overlay-click": function($event) {
      return _vm.$emit("close");
    } } }, [_c("div", { staticClass: "popup-header" }, [_c("h4", [_vm._v("查看链接")]), _c("button", { staticClass: "btn", on: { "click": function($event) {
      return _vm.$emit("close");
    } } }, [_vm._v("关闭")])]), _c("div", { staticClass: "popup-body" }, [_c("textarea", { directives: [{ name: "model", rawName: "v-model", value: _vm.content, expression: "content" }], ref: "textarea", staticClass: "links-box", style: _vm.textStyle, attrs: { "rows": "10", "cols": "80" }, domProps: { "value": _vm.content }, on: { "input": function($event) {
      if ($event.target.composing)
        return;
      _vm.content = $event.target.value;
    } } })]), _c("div", { staticClass: "popup-footer" }, [_c("button", { staticClass: "btn", on: { "click": _vm.resetContent } }, [_vm._v("重置")]), _c("button", { staticClass: "btn", on: { "click": _vm.selectAll } }, [_vm._v("全选")]), _c("button", { staticClass: "btn", on: { "click": _vm.copySelected } }, [_vm._v("复制选中")]), _c("button", { staticClass: "btn", on: { "click": _vm.copyAll } }, [_vm._v("复制全部")]), _c("p", [_vm._v("共 " + _vm._s(_vm.links.length) + " 条链接")])])]);
  };
  var staticRenderFns$5 = [];
  const _sfc_main$5 = {
    name: "LinksPopup",
    components: {
      PopupWrapper
    },
    props: {
      zIndex: {
        type: Number,
        default: 10
      },
      links: {
        type: Array,
        default() {
          return [];
        }
      },
      options: {
        type: Object,
        default() {
          const linebreak = getDefaultLinebreak();
          return {
            separator: linebreak
          };
        }
      }
    },
    data() {
      return {
        content: ""
      };
    },
    computed: {
      textStyle() {
        if (["\n", "\r\n"].indexOf(this.options.separator) > -1 && this.links.length > 1) {
          return {
            "white-space": "nowrap",
            "word-break": "normal"
          };
        } else {
          return {
            "white-space": "pre-line",
            "word-break": "break-all"
          };
        }
      }
    },
    watch: {
      links() {
        this.resetContent();
      }
    },
    created() {
      this.resetContent();
    },
    methods: {
      resetContent() {
        this.content = this.links.join(this.options.separator);
      },
      copySelected() {
        const target = this.$refs["textarea"];
        if (target) {
          const start = target.selectionStart;
          const finish = target.selectionEnd;
          if (start < 0 || finish <= start) {
            this.$toast.display("所选内容为空！");
            return;
          }
          try {
            const text = this.content.substring(start, finish);
            GM_setClipboard(text, "{ type: 'text', mimetype: 'text/plain'}");
            this.$toast.display("复制成功！");
          } catch (e) {
            this.$toast.display("复制失败。");
          }
        } else {
          this.$toast.display("获取文本框失败！");
        }
      },
      copyAll() {
        if (!this.content) {
          this.$toast.display("文本框内容为空！");
          return;
        }
        try {
          GM_setClipboard(
            this.content,
            "{ type: 'text', mimetype: 'text/plain'}"
          );
          this.$toast.display("复制成功！");
        } catch (e) {
          this.$toast.display("复制失败。");
        }
      },
      selectAll() {
        const target = this.$refs["textarea"];
        if (target) {
          target.select();
        } else {
          this.$toast.display("获取文本框失败！");
        }
      }
    }
  };
  var __component__$5 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$5,
    render$5,
    staticRenderFns$5,
    false,
    null,
    "272d8422"
  );
  const LinksPopup = __component__$5.exports;
  var render$4 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "tool-bar", class: [_vm.position, { "visible": _vm.visible }] }, [_c("div", { staticClass: "wrapper" }, [_c("span", { staticClass: "title" }, [_vm._v("下载助手")]), _c("label", { attrs: { "for": `clean-${_vm.position}` } }, [_vm._v("清理链接：")]), _c("input", { directives: [{ name: "model", rawName: "v-model", value: _vm.opts.clean, expression: "opts.clean" }], staticClass: "checkbox", attrs: { "id": `clean-${_vm.position}`, "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.opts.clean) ? _vm._i(_vm.opts.clean, null) > -1 : _vm.opts.clean }, on: { "change": function($event) {
      var $$a = _vm.opts.clean, $$el = $event.target, $$c = $$el.checked ? true : false;
      if (Array.isArray($$a)) {
        var $$v = null, $$i = _vm._i($$a, $$v);
        if ($$el.checked) {
          $$i < 0 && _vm.$set(_vm.opts, "clean", $$a.concat([$$v]));
        } else {
          $$i > -1 && _vm.$set(_vm.opts, "clean", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
        }
      } else {
        _vm.$set(_vm.opts, "clean", $$c);
      }
    } } }), _c("label", { attrs: { "for": `separator-${_vm.position}` } }, [_vm._v("分隔符：")]), _c("select", { directives: [{ name: "model", rawName: "v-model", value: _vm.opts.separator, expression: "opts.separator" }], attrs: { "id": `separator-${_vm.position}` }, on: { "change": function($event) {
      var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
        return o.selected;
      }).map(function(o) {
        var val = "_value" in o ? o._value : o.value;
        return val;
      });
      _vm.$set(_vm.opts, "separator", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
    } } }, [_c("option", { attrs: { "value": "\n" } }, [_vm._v("\\n")]), _c("option", { attrs: { "value": "\r\n" } }, [_vm._v("\\r\\n")]), _c("option", { attrs: { "value": "	" } }, [_vm._v("\\t")]), _c("option", { attrs: { "value": " " } }, [_vm._v("空格")]), _c("option", { attrs: { "value": "," } }, [_vm._v(",")])]), _c("div", { staticClass: "btn-wrapper" }, [_c("button", { staticClass: "btn", on: { "click": function($event) {
      return _vm.$emit("copy", _vm.opts);
    } } }, [_vm._v("复制")]), _c("button", { staticClass: "btn", on: { "click": function($event) {
      return _vm.$emit("show", _vm.opts);
    } } }, [_vm._v("查看")])])])]);
  };
  var staticRenderFns$4 = [];
  const _sfc_main$4 = {
    name: "ToolBar",
    props: {
      position: {
        type: String,
        default: "top"
      }
    },
    data() {
      let linebreak = getDefaultLinebreak();
      return {
        visible: false,
        opts: {
          clean: true,
          separator: linebreak
        }
      };
    }
  };
  var __component__$4 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$4,
    render$4,
    staticRenderFns$4,
    false,
    null,
    "0aeef348"
  );
  const ToolBar = __component__$4.exports;
  var render$3 = function render2() {
    var _vm = this;
    _vm._self._c;
    return _vm._m(0);
  };
  var staticRenderFns$3 = [function() {
    var _vm = this, _c = _vm._self._c;
    return _c("th", { staticClass: "{sorter: false}", attrs: { "width": "5%", "nowrap": "nowrap" } }, [_c("span", { staticClass: "title" }, [_vm._v("Torrent")])]);
  }];
  const _sfc_main$3 = {
    name: "TorrentDownloadHeader"
  };
  var __component__$3 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$3,
    render$3,
    staticRenderFns$3,
    false,
    null,
    null
  );
  const TorrentDownloadHeader = __component__$3.exports;
  var render$2 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("td", { attrs: { "nowrap": "nowrap", "align": "center" } }, [_vm.loading ? _c("span", { staticClass: "loading" }) : _c("a", { staticClass: "download-arrow arrow-torrent", attrs: { "title": "Torrent 下载", "href": "javascript:void(0);", "data-index": _vm.index }, on: { "click": _vm.getAndDownloadTorrent } })]);
  };
  var staticRenderFns$2 = [];
  const _sfc_main$2 = {
    name: "TorrentDownloadItem",
    props: {
      index: {
        type: Number,
        default: 0
      },
      detailLink: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        loading: false
      };
    },
    methods: {
      getTorrentUrl(pageLink, pageTitle) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: pageLink,
            timeout: 15e3,
            context: { pageTitle },
            ontimeout: () => {
              reject(new Error("下载超时，请重试！"));
            },
            onerror: () => {
              reject(new Error("下载失败，请重试！"));
            },
            onload: ({ context = {}, responseText = "" }) => {
              let torrent;
              if (responseText && (torrent = getTorrentLinkFromHTML(responseText))) {
                let url = torrent.href;
                if (url.indexOf("//") === 0) {
                  url = window.location.protocol + url;
                }
                resolve({
                  url,
                  filename: `${torrent.title || context.pageTitle}.torrent`
                });
              } else {
                reject(new Error("获取下载链接失败！"));
              }
            }
          });
        });
      },
      async downloadTorrent(torrentUrl, torrentName) {
        const blob = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: torrentUrl,
            responseType: "blob",
            timeout: 15e3,
            ontimeout: () => {
              reject(new Error("下载超时，请重试！"));
            },
            onerror: () => {
              reject(new Error("下载失败，请重试！"));
            },
            onload: ({ response }) => {
              resolve(response);
            }
          });
        });
        const herf = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = herf;
        anchor.style.display = "none";
        anchor.download = torrentName;
        this.$el.appendChild(anchor);
        anchor.click();
        setTimeout(() => {
          this.$el.removeChild(anchor);
          URL.revokeObjectURL(herf);
        }, 0);
      },
      async getAndDownloadTorrent() {
        if (!this.detailLink) {
          this.$toast.display("无法获取下载链接。");
          return;
        }
        try {
          this.loading = true;
          const { url, filename } = await this.getTorrentUrl(
            this.detailLink,
            this.title
          );
          await this.downloadTorrent(url, filename);
        } catch (e) {
          this.$toast.display(e.message);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    render$2,
    staticRenderFns$2,
    false,
    null,
    "f5ce47f3"
  );
  const TorrentDownloadItem = __component__$2.exports;
  const CheckboxHeaderVM = Vue2.extend(CheckboxHeader);
  const CheckboxItemVM = Vue2.extend(CheckboxItem);
  const TorrentDownloadHeaderVM = Vue2.extend(TorrentDownloadHeader);
  const TorrentDownloadItemVM = Vue2.extend(TorrentDownloadItem);
  const ToolBarVM = Vue2.extend(ToolBar);
  const LinksPopupVM = Vue2.extend(LinksPopup);
  function mountListElement(el) {
    const list = new Vue2({
      data() {
        return {
          header: null,
          all: [],
          selected: [],
          popupIndex: 10,
          toolbars: []
        };
      },
      computed: {
        links() {
          return this.selected.map((item) => item.magnet).filter((m) => !!m);
        }
      },
      watch: {
        links(val) {
          const isEmpty = !val || val.length <= 0;
          this.toolbars.forEach((t) => {
            t.visible = !isEmpty;
          });
        }
      },
      mounted() {
        this.$nextTick(function() {
          const table = this.$el;
          let tableContainer;
          if (!table.parentNode || (tableContainer = table.parentNode.parentNode, !tableContainer || tableContainer.className.indexOf("table") < 0)) {
            return;
          }
          if (table.tHead && table.tBodies) {
            if (table.tHead.rows && table.tHead.rows.length > 0) {
              this.insertHeaderToRow(table.tHead.rows[0]);
            }
            let index = 0;
            for (let i = 0, len = table.tBodies.length; i < len; i++) {
              let body = table.tBodies[i];
              for (let j = 0, rowLen = body.rows.length; j < rowLen; j++) {
                this.insertItemToRow(body.rows[j], index++);
              }
            }
          } else {
            if (table.rows) {
              for (let i = 0, len = table.rows.length; i < len; i++) {
                let row = table.rows[i];
                if (i === 0) {
                  this.insertHeaderToRow(row);
                } else {
                  this.insertItemToRow(row, i - 1);
                }
              }
            }
          }
          this.initToolBars(tableContainer);
        });
      },
      beforeDestroy() {
        if (this.header) {
          this.header.$off("change");
          this.header = null;
        }
        this.all.forEach((item) => {
          item.$off("change");
        });
        this.toolbars.forEach((t) => {
          t.$off("copy");
          t.$off("show");
        });
        this.all.splice(0, this.all.length);
        this.selected.splice(0, this.selected.length);
        this.toolbars.splice(0, this.toolbars.length);
      },
      methods: {
        initToolBars(tableContainer) {
          const headerToolbar = new ToolBarVM({
            propsData: {
              position: "top"
            }
          }).$mount();
          headerToolbar.$on("copy", this.onCopyLinks);
          headerToolbar.$on("show", this.onShowLinks);
          const bottomToobar = new ToolBarVM({
            propsData: {
              position: "bottom"
            }
          }).$mount();
          bottomToobar.$on("copy", this.onCopyLinks);
          bottomToobar.$on("show", this.onShowLinks);
          tableContainer.insertBefore(
            headerToolbar.$el,
            tableContainer.firstChild
          );
          tableContainer.appendChild(bottomToobar.$el);
          this.toolbars.push(headerToolbar, bottomToobar);
        },
        insertHeaderToRow(row) {
          if (row.cells.length <= 0)
            return;
          const firstCell = row.cells[0];
          let sizeCell;
          if (row.cells.length >= 5) {
            sizeCell = row.cells[4];
          }
          const checkboxTH = new CheckboxHeaderVM().$mount();
          checkboxTH.$on("change", this.onSelectAllChange);
          row.insertBefore(checkboxTH.$el, firstCell);
          this.header = checkboxTH;
          if (sizeCell) {
            const bittorrentDownloadTH = new TorrentDownloadHeaderVM().$mount();
            row.insertBefore(bittorrentDownloadTH.$el, sizeCell);
          }
        },
        insertItemToRow(row, index) {
          if (row.cells.length <= 0)
            return;
          const firstCell = row.cells[0];
          let sizeCell;
          if (row.cells.length >= 5) {
            sizeCell = row.cells[4];
          }
          const magnetLinkDOM = row.querySelector("td > .arrow-magnet");
          const checkboxTD = new CheckboxItemVM({
            propsData: {
              index,
              magnet: magnetLinkDOM ? magnetLinkDOM.href : ""
            }
          }).$mount();
          const _self = this;
          checkboxTD.$on("change", function(checked) {
            _self.onItemSelectChange(checkboxTD, checked);
          });
          row.insertBefore(checkboxTD.$el, firstCell);
          this.all.push(checkboxTD);
          if (sizeCell) {
            const detailLinkDom = row.querySelector("td.title > a");
            const bittorrentDownloadTD = new TorrentDownloadItemVM({
              propsData: {
                index,
                detailLink: detailLinkDom ? detailLinkDom.href : "",
                title: detailLinkDom ? detailLinkDom.innerText : ""
              }
            }).$mount();
            row.insertBefore(bittorrentDownloadTD.$el, sizeCell);
          }
        },
        onSelectAllChange(checked) {
          this.all.forEach(function(item) {
            item.checked = checked;
          });
          if (checked) {
            this.selected = [...this.all];
          } else {
            this.selected.splice(0, this.selected.length);
          }
        },
        onItemSelectChange(item, checked) {
          const selectedIndex = this.selected.indexOf(item);
          if (checked && selectedIndex < 0) {
            this.selected.push(item);
          } else if (!checked && selectedIndex > -1) {
            this.selected.splice(selectedIndex, 1);
          }
          if (this.header) {
            this.header.checked = this.all.length === this.selected.length;
          }
        },
        onCopyLinks(opts) {
          const links = magnetLinksWithOptions(this.links, opts);
          if (links.length > 0) {
            try {
              const content = links.join(opts.separator);
              GM_setClipboard(content, "{ type: 'text', mimetype: 'text/plain'}");
              this.$toast.display("复制成功！");
            } catch (e) {
              this.$toast.display("复制失败，请重试。");
            }
          }
        },
        onShowLinks(opts) {
          const links = magnetLinksWithOptions(this.links, opts);
          if (links.length > 0) {
            const popup = new LinksPopupVM({
              propsData: {
                zIndex: this.popupIndex++,
                links,
                options: opts
              }
            }).$mount();
            popup.$on("close", function() {
              popup.$off("close");
              try {
                popup.$el.remove();
              } catch (e) {
                document.body.removeChild(popup.$el);
              }
            });
            document.body.appendChild(popup.$el);
          }
        }
      }
    });
    list.$mount(el);
  }
  var render$1 = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("li", { staticClass: "tree-item", class: { "collection": this.isFolder, "last": this.isLast } }, [_vm.isFolder ? _c("div", { staticClass: "hitarea", class: { "collapsable-hitarea": _vm.isOpen, "last-hitarea": _vm.isLast }, on: { "click": _vm.toggle } }) : _vm._e(), _c("div", { class: ["title", _vm.icon], on: { "click": function($event) {
      _vm.isFolder && _vm.toggle();
    } } }, [_c("h5", [_vm._v(_vm._s(_vm.name))]), _c("span", { staticClass: "size" }, [_vm._v(_vm._s(_vm.totalSize))])]), _vm.isFolder ? _c("ul", { directives: [{ name: "show", rawName: "v-show", value: _vm.isOpen, expression: "isOpen" }] }, _vm._l(_vm.children, function(child, index) {
      return _c("tree-item", _vm._b({ key: child.key, staticClass: "item", attrs: { "is-last": index === _vm.children.length - 1 } }, "tree-item", child, false));
    }), 1) : _vm._e()]);
  };
  var staticRenderFns$1 = [];
  const Videos = ["mp4", "rmvb", "avi", "mkv", "wmv", "flv", "ts"];
  const Audios = ["mp3", "ogg", "wma", "wav", "aac", "flac", "mka", "cue"];
  const Subtitles = ["sub", "idx", "sup", "sst", "srt", "ssa", "ass", "tts"];
  const Images = ["jpg", "jpeg", "png", "gif", "bmp", "pdf", "webp"];
  const Archives = ["rar", "rar5", "zip", "7z", "tar", "gz", "xz"];
  const Documents = [
    "txt",
    "log",
    "md",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "md5"
  ];
  const _sfc_main$1 = {
    name: "TreeItem",
    props: {
      parentKey: {
        type: Number,
        default: -1
      },
      name: {
        type: String,
        default: ""
      },
      level: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 0
      },
      children: {
        type: Array,
        default() {
          return [];
        }
      },
      isLast: {
        type: Boolean,
        default: false
      },
      expand: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isOpen: this.expand
      };
    },
    computed: {
      isFolder() {
        return this.children && this.children.length > 0;
      },
      totalSize() {
        let sum;
        if (this.size > 0) {
          sum = this.size;
        } else {
          const sizeList = this.sizeListWithItem({
            size: this.size,
            children: this.children
          });
          sum = sizeList.reduce((a, b) => a + b, 0);
        }
        return XBytes(sum, { iec: true, fixed: 1 });
      },
      icon() {
        if (this.isFolder) {
          return this.isOpen ? "folder-open" : "folder-close";
        }
        const ext = this.name.split(".").pop().toLowerCase();
        switch (true) {
          case Videos.indexOf(ext) > -1:
            return "video";
          case Images.indexOf(ext) > -1:
            return "image";
          case Archives.indexOf(ext) > -1:
            return "archive";
          case Audios.indexOf(ext) > -1:
            return "audio";
          case Documents.indexOf(ext) > -1:
            return "document";
          case Subtitles.indexOf(ext) > -1:
            return "subtitle";
          default:
            return "unknown";
        }
      }
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      },
      sizeListWithItem(item) {
        const children = item.children;
        if (!children || children.length <= 0) {
          return item.size ? [item.size] : [];
        }
        let list = [];
        for (let i = 0, len = children.length; i < len; i++) {
          let cList = this.sizeListWithItem(children[i]);
          list.push(...cList);
        }
        return list;
      }
    }
  };
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    render$1,
    staticRenderFns$1,
    false,
    null,
    "3ab763b5"
  );
  const TreeItem = __component__$1.exports;
  var render = function render2() {
    var _vm = this, _c = _vm._self._c;
    return _c("ul", { staticStyle: { "padding": "0", "margin": "0", "list-style": "none" } }, _vm._l(_vm.folders, function(folder, index) {
      return _c("tree-item", _vm._b({ key: folder.key, attrs: { "is-last": index === _vm.folders.length - 1, "expand": true } }, "tree-item", folder, false));
    }), 1);
  };
  var staticRenderFns = [];
  const _sfc_main = {
    name: "TreeRoot",
    components: {
      TreeItem
    },
    props: {
      folders: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  };
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    render,
    staticRenderFns,
    false,
    null,
    null
  );
  const TreeRoot = __component__.exports;
  const TreeRootVM = Vue2.extend(TreeRoot);
  function folderTreeFromNodeList(fileNodeList) {
    const map = {};
    const list = [];
    for (let i = 0, len = fileNodeList.length; i < len; i++) {
      const fileNode = fileNodeList[i];
      const fileSizeNode = fileNode.querySelector(".bt_file_size");
      const nodeText = fileNode.innerText;
      let fileSizeStr;
      if (fileSizeNode) {
        fileSizeStr = fileSizeNode.innerText.trim();
      }
      let filePath;
      let fileBytes = 0;
      if (fileSizeStr) {
        const bytes = fileSizeStr.replace(/(\d+)bytes?/i, "$1");
        if (!isNaN(+bytes)) {
          fileBytes = +bytes;
        } else {
          fileBytes = XBytes.parseSize(fileSizeStr, { iec: false });
        }
        filePath = nodeText.substring(0, nodeText.indexOf(fileSizeStr)).trim();
      } else {
        filePath = nodeText.trim();
      }
      if (!filePath) {
        filePath = `No. ${i + 1} - Unknown filename`;
      }
      let slice = filePath.split("/");
      let parentKey = 0;
      for (let j = 0, sLen = slice.length; j < sLen; j++) {
        let fileName = slice[j];
        let level = j + 1;
        let baseName = filePath.substring(
          0,
          filePath.indexOf(fileName) + fileName.length
        );
        let key = hashCode(baseName);
        if (!map[key]) {
          let file = {
            key,
            parentKey,
            name: fileName,
            level,
            size: level === sLen ? fileBytes : 0,
            children: level === sLen ? null : []
          };
          map[key] = file;
          list.push(file);
        }
        parentKey = key;
      }
    }
    const root = [];
    for (let i = 0, len = list.length; i < len; i++) {
      let file = list[i];
      if (!file.parentKey) {
        root.push(file);
      } else {
        map[file.parentKey].children.push(file);
      }
    }
    return root;
  }
  function mountFileListElement(el, title) {
    const fileListNode = el.querySelector("ul");
    const fileItemNodeList = el.querySelectorAll("ul > li");
    if (!fileListNode || fileItemNodeList.length <= 0) {
      return;
    }
    const folders = folderTreeFromNodeList(fileItemNodeList);
    if (folders.length <= 0) {
      return;
    }
    const tree = new TreeRootVM({
      propsData: {
        folders: (folders.length > 1 || folders[0].size) && title ? [
          {
            key: 0,
            parentKey: -1,
            name: title,
            children: folders
          }
        ] : folders
      }
    });
    tree.$mount(fileListNode);
  }
  const ToastItemVM = Vue2.extend(ToastItem);
  const toast = new ToastItemVM().$mount();
  document.body.appendChild(toast.$el);
  Object.defineProperty(Vue2.prototype, "$toast", { value: toast });
  let topicListEl, fileListEl;
  if (topicListEl = document.querySelector("#topic_list")) {
    mountListElement(topicListEl);
    if (typeof jQuery !== "undefined" && typeof jQuery.tablesorter !== "undefined") {
      jQuery("#topic_list").tablesorter({ widgets: ["zebra"] });
      jQuery("#topic_list").bind("sortStart", function() {
        jQuery("#overlay").show();
      }).bind("sortEnd", function() {
        jQuery("#overlay").hide();
      });
    }
  }
  if (fileListEl = document.querySelector("#resource-tabs .file_list")) {
    let title = "";
    let titleEl;
    if (titleEl = document.querySelector(".topic-title h3")) {
      title = titleEl.innerText.trim();
    }
    mountFileListElement(fileListEl, title);
  }
})(Vue, xbytes);
