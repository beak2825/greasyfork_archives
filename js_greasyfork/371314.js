// ==UserScript==
// @name    Pixiv View Util
// @name:en Pixiv View Util
// @description    閲覧専用のユーティリティです。(1)各イラストの閲覧ページや作者ごとの画像一覧ページのレイアウトを変更します。(2)pixivサイト内でポップアップ機能を有効化します。
// @description:en this is  some  utility funcitions for pixiv.(1)change the layout of illust pages and auther's pages. (2)add popup tool.
// @namespace   Pixiv View Util
// @version     2.2.2-20191022
// @author      sotoba
// @noframes
// @homepageURL https://github.com/SotobatoNihu/PixivViewUtil
// @license     The MIT License
// @require     https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/8.15.0/vue-i18n.min.js
// @include     https://www.pixiv.net/*
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM.getResourceUrl
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/371314/Pixiv%20View%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/371314/Pixiv%20View%20Util.meta.js
// ==/UserScript==

(function (Vue, Vuex) {
  'use strict';

  

  function __$styleInject( css ) {
      if(!css) return ;

      if(typeof(window) == 'undefined') return ;
      let style = document.createElement('style');

      style.innerHTML = css;
      document.head.appendChild(style);
      return css;
  }

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  Vuex = Vuex && Vuex.hasOwnProperty('default') ? Vuex['default'] : Vuex;

  __$styleInject("\r\n");

  var script = {
    name: 'PixivIcons',
    props: {
      icon: {
        default: 'like',
        type: String,
      },
    },
  };
  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    }
    var options = typeof script === 'function' ? script.options : script;
    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true;
      if (isFunctionalTemplate) {
        options.functional = true;
      }
    }
    if (scopeId) {
      options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
      hook = function hook(context) {
        context = context ||
        this.$vnode && this.$vnode.ssrContext ||
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        }
        if (style) {
          style.call(this, createInjectorSSR(context));
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }
    if (hook) {
      if (options.functional) {
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return script;
  }
  var normalizeComponent_1 = normalizeComponent;
  const __vue_script__ = script;
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.icon === 'like')?_c('img',{attrs:{"src":"https://s.pximg.net/www/js/spa/e2b56a11e49a9eaaf6c26d75362bad8c.svg","width":"12","height":"12"}}):(_vm.icon === 'bookmark')?_c('svg',{attrs:{"viewBox":"0 0 12 12","width":"12","height":"12"}},[_c('path',{attrs:{"fill":"currentColor","d":"M9,0.75 C10.6568542,0.75 12,2.09314575 12,3.75 C12,6.68851315 10.0811423,9.22726429 6.24342696,11.3662534\n      L6.24342863,11.3662564 C6.09210392,11.4505987 5.90790324,11.4505988 5.75657851,11.3662565\n      C1.9188595,9.22726671 0,6.68851455 0,3.75 C1.1324993e-16,2.09314575 1.34314575,0.75 3,0.75\n      C4.12649824,0.75 5.33911281,1.60202454 6,2.66822994 C6.66088719,1.60202454 7.87350176,0.75 9,0.75 Z"}})]):(_vm.icon === 'view')?_c('img',{attrs:{"src":"https://s.pximg.net/www/js/spa/64a1477160859eee079f02a55ccc9de3.svg","width":"14","height":"12"}}):_vm._e()};
  var __vue_staticRenderFns__ = [];
    const __vue_inject_styles__ = undefined;
    const __vue_scope_id__ = undefined;
    const __vue_module_identifier__ = undefined;
    const __vue_is_functional_template__ = false;
    var PixivIcons = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );
  var script$1 = {
      name: 'Caption',
      components: {
          PixivIcons,
      },
      props: {
          id: {
              default: 'popup-caption',
              type: String,
          },
      },
      data() {
          return {
              captionWidth: 100,
          };
      },
      computed: {
          tagArray() {
              const json = this.$store.state.pixivJson;
              return json.body.tags.tags;
          },
          captionHtml() {
              const json = this.$store.state.pixivJson;
              return json.body.description;
          },
          date() {
              const json = this.$store.state.pixivJson;
              const date = new Date(json.body.createDate);
              return `upload:${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          },
          like() {
              const json = this.$store.state.pixivJson;
              return ` ${json.body.likeCount} `;
          },
          bookmark() {
              const json = this.$store.state.pixivJson;
              return ` ${json.body.bookmarkCount} `;
          },
          view() {
              const json = this.$store.state.pixivJson;
              return `${json.body.viewCount}`;
          },
          toggleCaption: function() {
              this.$store.commit('toggleCaption');
              return false;
          },
          captionStyle: function() {
              return {
                  width: `${this.$store.state.screen.width + 10}px`,
                  height: 'auto',
                  display: 'block',
                  backgroundColor: 'white',
                  border: '1px solid #000',
              };
          },
      },
      updated: function() {
          this.$nextTick(function() {
              this.$store.commit('captionHeight', this.$el.clientHeight);
          });
      },
  };
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });
    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;
      if (css.map) {
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }
      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);
        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }
        HEAD.appendChild(style.element);
      }
      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }
  var browser = createInjector;
  const __vue_script__$1 = script$1;
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.captionStyle),attrs:{"id":_vm.id}},[_c('div',{staticClass:"description",domProps:{"innerHTML":_vm._s(_vm.captionHtml)}}),_vm._v(" "),_c('div',{staticClass:"appendum"},[_c('div',{staticClass:"tags",staticStyle:{"display":"inline-block"}},_vm._l((_vm.tagArray),function(tagElem){return _c('span',[(tagElem.locked)?_c('span',[_vm._v("*")]):_vm._e(),_c('a',{attrs:{"href":"https://dic.pixiv.net/a/{{tagElem.tag}}"}},[_vm._v(_vm._s(tagElem.tag)),_c('span',{class:[ ( tagElem.romaji || tagElem.locked ) ? 'pixpedia-icon' : _vm.pixpedia-_vm.no-_vm.icon ]})])])}),0),_vm._v(" "),_c('div',{staticClass:"information"},[_c('div',{domProps:{"textContent":_vm._s(_vm.date)}}),_vm._v(" "),_c('PixivIcons',{attrs:{"icon":'like'}}),_vm._v(" "),_c('span',{staticClass:"like",domProps:{"textContent":_vm._s(_vm.like)}}),_vm._v(" "),_c('PixivIcons',{attrs:{"icon":'bookmark'}}),_vm._v(" "),_c('span',{attrs:{"id":"bookmark"},domProps:{"textContent":_vm._s(_vm.bookmark)}}),_vm._v(" "),_c('PixivIcons',{attrs:{"icon":'view'}}),_vm._v(" "),_c('span',{attrs:{"id":"view"},domProps:{"textContent":_vm._s(_vm.view)}})],1)])])};
  var __vue_staticRenderFns__$1 = [];
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-75b42063_0", { source: ".description[data-v-75b42063]{white-space:pre-line;z-index:10001;word-wrap:break-word;width:auto;height:70%;max-height:70%;overflow-y:scroll;scrollbar-width:thin}.appendum[data-v-75b42063]{width:auto;height:auto;max-height:30%;overflow-y:scroll}.information[data-v-75b42063]{background-color:#fff;font-size:x-small;width:auto;height:auto;max-height:20%;color:#999;line-height:1}.pixpedia-icon[data-v-75b42063]{display:inline-block;margin-left:2px;width:15px;height:14px;vertical-align:-2px;text-decoration:none;background:url(https://s.pximg.net/www/images/inline/pixpedia.png) no-repeat}.pixpedia-no-icon[data-v-75b42063]{display:inline-block;margin-left:2px;width:15px;height:14px;vertical-align:-2px;text-decoration:none;background:url(https://s.pximg.net/www/images/inline/pixpedia-no-item.png) no-repeat}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$1 = "data-v-75b42063";
    const __vue_module_identifier__$1 = undefined;
    const __vue_is_functional_template__$1 = false;
    var Caption = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );
  var script$2 = {
      name: 'Screen',
      props: {
          id: 'popup-screen',
      },
      data() {
          return {
              width: 1000,
              height: 1000,
          };
      },
      computed: {
          screenImg: function() {
              return this.$store.state.pixivJson.body.urls.regular;
          },
          getSize: function() {
              const imgWidth = this.$store.state.pixivJson.body.width;
              const imgHeight = this.$store.state.pixivJson.body.height;
              const wscale = (window.innerWidth * this.$store.state.screen.scale) / imgWidth;
              const hscale = (window.innerHeight * this.$store.state.screen.scale) / imgHeight;
              const scale = wscale < hscale ? wscale : hscale;
              const _height = imgHeight * scale;
              const _width = imgWidth * scale;
              this.$store.commit('screenWidth', _width);
              this.$store.commit('screenHeight', _height );
              return { height: _height, width: _width };
          },
          imgStyle: function() {
              const size = this.getSize;
              return {
                  width: 'auto',
                  height: 'auto',
                  pointerEvents: 'none',
                  maxWidth: `${size.width}px`,
                  maxHeight: `${size.height}px`,
              };
          },
          screenStyle: function() {
              const size = this.getSize;
              return {
                  border: '5px solid black',
                  backgroundColor: '#111',
                  position: 'relative',
                  width: 'auto',
                  height: 'auto',
                  maxWidth: `${size.width}px`,
                  maxHeight: `${size.height}px`,
                  float: 'left',
                  backgroundImage: `url(${this.screenImg})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
              };
          },
      },
      updated() {
          this.$nextTick(function() {
              this.$store.commit('screenLoaded');
          });
      },
  };
  const __vue_script__$2 = script$2;
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{style:(_vm.screenStyle),attrs:{"id":_vm.id}},[_c('img',{style:(_vm.imgStyle),attrs:{"src":_vm.screenImg}})])};
  var __vue_staticRenderFns__$2 = [];
    const __vue_inject_styles__$2 = undefined;
    const __vue_scope_id__$2 = "data-v-25a9257f";
    const __vue_module_identifier__$2 = undefined;
    const __vue_is_functional_template__$2 = false;
    var Screen = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );
  var script$3 = {
      name: "Illust",
      mixins: [Screen],
  };
  const __vue_script__$3 = script$3;
  var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{style:(_vm.screenStyle)},[_c('img',{style:(_vm.imgStyle),attrs:{"src":_vm.screenImg}})])};
  var __vue_staticRenderFns__$3 = [];
    const __vue_inject_styles__$3 = undefined;
    const __vue_scope_id__$3 = "data-v-804ad3fc";
    const __vue_module_identifier__$3 = undefined;
    const __vue_is_functional_template__$3 = false;
    var Illust = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );
  var script$4 = {
      name: "Manga",
      mixins: [Screen],
      data() {
          return {
              width: 1000,
              height: 1000,
              scrollWidth: 0,
              active: false,
              onmouse: false,
          };
      },
      computed: {
          ImageUrls: function() {
              let imgElemArray = [];
              const json = this.$store.state.pixivJson;
              const firstPageURL = json.body.urls.regular.replace(/\/...x...\//, '/600x600/');
              const pageNum = json.body.pageCount;
              for (let i = 0; i < pageNum; i++) {
                  const url = firstPageURL.replace('p0', 'p' + i);
                  imgElemArray.push(url);
              }
              return imgElemArray;
          },
          getHeight: function() {
              const store = this.$store;
              const height = window.innerHeight * this.$store.state.screen.scale;
              store.commit('screenHeight', height);
              return height;
          },
          getWidth: function() {
              const store = this.$store;
              const width = window.innerWidth * this.$store.state.screen.scale;
              store.commit('screenWidth', width);
              return width;
          },
          getSize: function() {
              this.height = window.innerHeight * this.$store.state.screen.scale;
              this.width = window.innerWidth * this.$store.state.screen.scale;
              this.$store.commit('screenWidth', this.width);
              this.$store.commit('screenHeight', this.height);
              return { width: this.width, height: this.height };
          },
          mangaStyle: function() {
              const size = this.getSize;
              return {
                  border: '5px solid black',
                  backgroundColor: '#111',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  height: 'auto',
                  maxWidth: `${size.width}px`,
                  maxHeight: `${size.height + 17}px`,
                  float: 'left',
                  overflow: 'hidden',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
              };
          },
          thumbStyle: function() {
              return {
                  left: `${this.scrollWidth}px`,
              };
          },
      },
      watch: {
          scrollWidth: function() {
              this.$refs.scrollable.scrollLeft = this.scrollWidth;
          },
      },
      updated: {},
      mounted() {
          const store = this.$store;
          const wrapper = this.$refs.wrapper;
          let onmouse = this.onmouse;
          wrapper.addEventListener('scroll', function(event) {
              store.state.screen.dragging = true;
              return false;
          });
          wrapper.addEventListener('mouseover', function(event) {
              onmouse = true;
          });
          wrapper.addEventListener('mouseout', function(event) {
              onmouse = false;
          });
          wrapper.addEventListener('mousemove', function(event) {
              onmouse = true;
          });
          wrapper.addEventListener('wheel', function(event) {
              onmouse = true;
          });
          document.addEventListener('wheel', function(event) {
              if (event.target.id === 'manga__main' || onmouse) {
                  event.preventDefault();
                  const scrollValue = event.deltaY > 0 ? 100 : -100;
                  wrapper.scrollBy(scrollValue, 0);
              }
          });
      },
      methods: {},
  };
  const __vue_script__$4 = script$4;
  var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{style:(_vm.mangaStyle),attrs:{"id":_vm.id}},[_c('div',{ref:"wrapper",staticClass:"scroll_wrapper"},[_c('div',{ref:"scrollable",attrs:{"id":"manga__main"}},_vm._l((_vm.ImageUrls),function(imgUrl){return _c('img',{key:_vm.number,style:(_vm.imgStyle),attrs:{"src":imgUrl}})}),0)])])};
  var __vue_staticRenderFns__$4 = [];
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-54943c6f_0", { source: ".scroll_wrapper[data-v-54943c6f]{height:calc(100% - 17px);width:100%;overflow-x:scroll;-webkit-overflow-scrolling:touch}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$4 = "data-v-54943c6f";
    const __vue_module_identifier__$4 = undefined;
    const __vue_is_functional_template__$4 = false;
    var Manga = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      browser,
      undefined
    );
  var ZipImagePlayer = (function() {
    function base64ArrayBuffer(arrayBuffer, off, byteLength) {
      let base64    = '';
      const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const bytes         = new Uint8Array(arrayBuffer);
      const byteRemainder = byteLength % 3;
      const mainLength    = off + byteLength - byteRemainder;
      let a, b, c, d;
      let chunk;
      for (let i = off; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        a = (chunk & 16515072) >> 18;
        b = (chunk & 258048)   >> 12;
        c = (chunk & 4032)     >>  6;
        d = chunk & 63;
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      }
      if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2;
        b = (chunk & 3)   << 4;
        base64 += `${encodings[a] + encodings[b]}==`;
      } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10;
        b = (chunk & 1008)  >>  4;
        c = (chunk & 15)    <<  2;
        base64 += `${encodings[a] + encodings[b] + encodings[c]}=`;
      }
      return base64;
    }
    class ZipImagePlayer {
      constructor(options) {
        this.op = options;
        this._rescale = false;
        this._URL = (window.URL || window.webkitURL || window.MozURL
                || window.MSURL);
        this._Blob = (window.Blob || window.WebKitBlob || window.MozBlob
                || window.MSBlob);
        this._BlobBuilder = (window.BlobBuilder || window.WebKitBlobBuilder
                || window.MozBlobBuilder || window.MSBlobBuilder);
        this._Uint8Array = (window.Uint8Array || window.WebKitUint8Array
                || window.MozUint8Array || window.MSUint8Array);
        this._DataView = (window.DataView || window.WebKitDataView
                || window.MozDataView || window.MSDataView);
        this._ArrayBuffer = (window.ArrayBuffer || window.WebKitArrayBuffer
                || window.MozArrayBuffer || window.MSArrayBuffer);
        this._maxLoadAhead = 0;
        if (!this._URL) {
          this._debugLog("No URL support! Will use slower data: URLs.");
          this._maxLoadAhead = 10;
        }
        if (!this._Blob) {
          this._error("No Blob support");
        }
        if (!this._Uint8Array) {
          this._error("No Uint8Array support");
        }
        if (!this._DataView) {
          this._error("No DataView support");
        }
        if (!this._ArrayBuffer) {
          this._error("No ArrayBuffer support");
        }
        this._isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        this._loadingState = 0;
        this._dead = false;
        this._context = options.canvas.getContext("2d");
        this._files = {};
        this._frameCount = this.op.metadata.frames.length;
        this._trailerBytes = 30000;
        this._failed = false;
        this._debugLog(`Frame count: ${this._frameCount}`);
        this._frame = 0;
        this._loadFrame = 0;
        this._frameImages = [];
        this._paused = false;
        this._loadTimer = null;
        this._startLoad();
        if (this.op.autoStart) {
          this.play();
        }
        else {
          this._paused = true;
        }
      }
      _mkerr(msg) {
        return () => {
          this._error(msg);
        };
      }
      _error(msg) {
        this._failed = true;
        throw Error(`ZipImagePlayer error: ${msg}`);
      }
      _debugLog(msg) {
        if (this.op.debug) {
          console.log(msg);
        }
      }
      _load(offset, length, callback) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
          if (this._dead) {
            return;
          }
          this._debugLog(`Load: ${offset} ${length} status=${xhr.status}`);
          if (xhr.status == 200) {
            this._debugLog("Range disabled or unsupported, complete load");
            offset = 0;
            length = xhr.response.byteLength;
            this._len = length;
            this._buf = xhr.response;
            this._bytes = new this._Uint8Array(this._buf);
          } else {
            if (xhr.status != 206) {
              this._error(`Unexpected HTTP status ${xhr.status}`);
            }
            if (xhr.response.byteLength != length) {
              this._error(`Unexpected length ${xhr.response.byteLength} (expected ${length})`);
            }
            this._bytes.set(new this._Uint8Array(xhr.response), offset);
          }
          if (callback) {
            callback.apply(this, [offset, length]);
          }
        }, false);
        xhr.addEventListener("error", this._mkerr("Fetch failed"), false);
        xhr.open("GET", this.op.source);
        xhr.responseType = "arraybuffer";
        if (offset != null && length != null) {
          const end = offset + length;
          xhr.setRequestHeader("Range", `bytes=${offset}-${(end - 1)}`);
          if (this._isSafari) {
            xhr.setRequestHeader("Cache-control", "no-cache");
            xhr.setRequestHeader("If-None-Match", Math.random().toString());
          }
        }
        xhr.send();
      }
      _startLoad() {
        if (!this.op.source) {
          this._loadNextFrame();
          return;
        }
        fetch(this.op.source, {
          method: "HEAD",
        }).then(resp => {
          if (this._dead) {
            return;
          }
          this._pHead = 0;
          this._pNextHead = 0;
          this._pFetch = 0;
          const len = parseInt(resp.headers.get("Content-Length"));
          if (!len) {
            this._debugLog("HEAD request failed: invalid file length.");
            this._debugLog("Falling back to full file mode.");
            this._load(null, null, (off, len) => {
              this._pTail = 0;
              this._pHead = len;
              this._findCentralDirectory();
            });
            return;
          }
          this._debugLog(`Len: ${len}`);
          this._len = len;
          this._buf = new this._ArrayBuffer(len);
          this._bytes = new this._Uint8Array(this._buf);
          let off = len - this._trailerBytes;
          if (off < 0) {
            off = 0;
          }
          this._pTail = len;
          this._load(off, len - off, (off) => {
            this._pTail = off;
            this._findCentralDirectory();
          });
        }).catch(this._mkerr("Length fetch failed"));
      }
      _findCentralDirectory() {
        const dv = new this._DataView(this._buf, this._len - 22, 22);
        if (dv.getUint32(0, true) != 0x06054b50) {
          this._error("End of Central Directory signature not found");
        }
        const cd_count = dv.getUint16(10, true);
        const cd_size = dv.getUint32(12, true);
        const cd_off = dv.getUint32(16, true);
        if (cd_off < this._pTail) {
          this._load(cd_off, this._pTail - cd_off, () => {
            this._pTail = cd_off;
            this._readCentralDirectory(cd_off, cd_size, cd_count);
          });
        } else {
          this._readCentralDirectory(cd_off, cd_size, cd_count);
        }
      }
      _readCentralDirectory(offset, size, count) {
        const dv = new this._DataView(this._buf, offset, size);
        let p = 0;
        for (let i = 0; i < count; i++ ) {
          if (dv.getUint32(p, true) != 0x02014b50) {
            this._error("Invalid Central Directory signature");
          }
          const compMethod = dv.getUint16(p + 10, true);
          const uncompSize = dv.getUint32(p + 24, true);
          const nameLen = dv.getUint16(p + 28, true);
          const extraLen = dv.getUint16(p + 30, true);
          const cmtLen = dv.getUint16(p + 32, true);
          const off = dv.getUint32(p + 42, true);
          if (compMethod != 0) {
            this._error("Unsupported compression method");
          }
          p += 46;
          const nameView = new this._Uint8Array(this._buf, offset + p, nameLen);
          let name = "";
          for (let j = 0; j < nameLen; j++) {
            name += String.fromCharCode(nameView[j]);
          }
          p += nameLen + extraLen + cmtLen;
          this._files[name] = { off: off, len: uncompSize };
        }
        if (this._pHead >= this._pTail) {
          this._pHead = this._len;
          this._loadNextFrame();
        } else {
          this._loadNextChunk();
          this._loadNextChunk();
        }
      }
      _loadNextChunk() {
        if (this._pFetch >= this._pTail) {
          return;
        }
        const off = this._pFetch;
        let len = this.op.chunkSize;
        if (this._pFetch + len > this._pTail) {
          len = this._pTail - this._pFetch;
        }
        this._pFetch += len;
        this._load(off, len, () => {
          if (off == this._pHead) {
            if (this._pNextHead) {
              this._pHead = this._pNextHead;
              this._pNextHead = 0;
            } else {
              this._pHead = off + len;
            }
            if (this._pHead >= this._pTail) {
              this._pHead = this._len;
            }
            if (!this._loadTimer) {
              this._loadNextFrame();
            }
          } else {
            this._pNextHead = off + len;
          }
          this._loadNextChunk();
        });
      }
      _fileDataStart(offset) {
        const dv = new DataView(this._buf, offset, 30);
        const nameLen = dv.getUint16(26, true);
        const extraLen = dv.getUint16(28, true);
        return offset + 30 + nameLen + extraLen;
      }
      _isFileAvailable(name) {
        const info = this._files[name];
        if (!info) {
          this._error(`File ${name} not found in ZIP`);
        }
        if (this._pHead < (info.off + 30)) {
          return false;
        }
        return this._pHead >= (this._fileDataStart(info.off) + info.len);
      }
      _loadNextFrame() {
        if (this._dead) {
          return;
        }
        const frame = this._loadFrame;
        if (frame >= this._frameCount) {
          return;
        }
        const meta = this.op.metadata.frames[frame];
        if (!this.op.source) {
          this._loadFrame += 1;
          this._loadImage(frame, meta.file, false);
          return;
        }
        if (!this._isFileAvailable(meta.file)) {
          return;
        }
        this._loadFrame += 1;
        const off = this._fileDataStart(this._files[meta.file].off);
        const end = off + this._files[meta.file].len;
        let url;
        const mime_type = this.op.metadata.mime_type || "image/png";
        if (this._URL) {
          let slice;
          if (!this._buf.slice) {
            slice = new this._ArrayBuffer(this._files[meta.file].len);
            const view = new this._Uint8Array(slice);
            view.set(this._bytes.subarray(off, end));
          } else {
            slice = this._buf.slice(off, end);
          }
          let blob;
          try {
            blob = new this._Blob([slice], { type: mime_type });
          }
          catch (err) {
            this._debugLog(`${"Blob constructor failed. Trying BlobBuilder..."
                               + " ("}${err.message})`);
            const bb = new this._BlobBuilder();
            bb.append(slice);
            blob = bb.getBlob();
          }
          url = this._URL.createObjectURL(blob);
          this._loadImage(frame, url, true);
        } else {
          url = (`data:${mime_type};base64,${
        base64ArrayBuffer(this._buf, off, end - off)}`);
          this._loadImage(frame, url, false);
        }
      }
      _loadImage(frame, url, isBlob) {
        const image = new Image();
        const meta = this.op.metadata.frames[frame];
        image.addEventListener('load', () => {
          this._debugLog(`Loaded ${meta.file} to frame ${frame}`);
          if (isBlob) {
            this._URL.revokeObjectURL(url);
          }
          if (this._dead) {
            return;
          }
          this._frameImages[frame] = image;
          if (this._loadingState == 0) {
            this._displayFrame.apply(this);
          }
          if (frame >= (this._frameCount - 1)) {
            this._setLoadingState(2);
            this._buf = null;
            this._bytes = null;
          } else {
            if (!this._maxLoadAhead ||
                        (frame - this._frame) < this._maxLoadAhead) {
              this._loadNextFrame();
            } else if (!this._loadTimer) {
              this._loadTimer = setTimeout(() => {
                this._loadTimer = null;
                this._loadNextFrame();
              }, 200);
            }
          }
        });
        image.src = url;
      }
      _setLoadingState(state) {
        if (this._loadingState != state) {
          this._loadingState = state;
        }
      }
      _displayFrame() {
        if (this._dead) {
          return;
        }
        const meta = this.op.metadata.frames[this._frame];
        this._debugLog(`Displaying frame: ${this._frame} ${meta.file}`);
        const image = this._frameImages[this._frame];
        if (!image) {
          this._debugLog("Image not available!");
          this._setLoadingState(0);
          return;
        }
        if (this._loadingState != 2) {
          this._setLoadingState(1);
        }
        if (this.op.autoscale) {
          if (!this._rescale) {
              this._context.canvas.width = this.op.width;
              this._context.canvas.height = this.op.height;
              const scale = this.op.width / image.width;
              this._context.scale(scale, scale);
            this._rescale = true;
          }
        } else  if (this.op.autosize) {
          if (this._context.canvas.width != image.width || this._context.canvas.height != image.height) {
            this._context.canvas.width = image.width;
            this._context.canvas.height = image.height;
          }
        }
        this._context.clearRect(0, 0, this.op.canvas.width,
          this.op.canvas.height);
        this._context.drawImage(image, 0, 0);
        if (!this._paused) {
          this._timer = setTimeout(() => {
            this._timer = null;
            this._nextFrame.apply(this);
          }, meta.delay);
        }
      }
      _nextFrame() {
        if (this._frame >= (this._frameCount - 1)) {
          if (this.op.loop) {
            this._frame = 0;
          } else {
            this.pause();
            return;
          }
        } else {
          this._frame += 1;
        }
        this._displayFrame();
      }
      play() {
        if (this._dead) {
          return;
        }
        if (this._paused) {
          this._paused = false;
          this._displayFrame();
        }
      }
      pause() {
        if (this._dead) {
          return;
        }
        if (!this._paused) {
          if (this._timer) {
            clearTimeout(this._timer);
          }
          this._paused = true;
        }
      }
      rewind() {
        if (this._dead) {
          return;
        }
        this._frame = 0;
        if (this._timer) {
          clearTimeout(this._timer);
        }
        this._displayFrame();
      }
      stop() {
        this._debugLog("Stopped!");
        this._dead = true;
        if (this._timer) {
          clearTimeout(this._timer);
        }
        if (this._loadTimer) {
          clearTimeout(this._loadTimer);
        }
        this._frameImages = null;
        this._buf = null;
        this._bytes = null;
      }
      getCurrentFrame() {
        return this._frame;
      }
      getLoadedFrames() {
        return this._frameImages.length;
      }
      getFrameCount() {
        return this._frameCount;
      }
      hasError() {
        return this._failed;
      }
    }
    return ZipImagePlayer;
  }());
  var script$5 = {
      name: 'Ugoira',
      mixins: [Screen],
      props: {
          id: 'popup-screen',
          visible: false,
      },
      data() {
          return {
              isVisible: this.visible,
              width: 600,
              height: 600,
          };
      },
      computed: {
      },
      watch: {
          visible: function() {
              if (this.visible) {
                  console.log("ugoira start!");
                  const size = this.getSize;
                  const screen = document.getElementById('popup-ugoira');
                  if (screen) {
                      screen.innerText = '';
                      this.canvas = document.createElement('canvas');
                      this.canvas.id = 'ugoira-canvas';
                      this.canvas.style.pointerEvents = 'none';
                      screen.appendChild(this.canvas);
                  }
                  const options = {
                      canvas: this.canvas,
                      metadata: this.$store.state.ugoiraJson.body,
                      source: this.$store.state.ugoiraJson.body.src,
                      mime_type: this.$store.state.ugoiraJson.body.mime_type,
                      chunkSize: 10000,
                      loop: true,
                      autoStart: false,
                      autoscale: true,
                      width: size.width,
                      height: size.height,
                  };
                  this.player = new ZipImagePlayer(options);
                  const player = this.player;
                  player.play();
              } else {
                  if (this.player) {
                      this.player.stop();
                  }
                  this.canvas = null;
              }
          },
      },
  };
  const __vue_script__$5 = script$5;
  var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{style:(_vm.screenStyle),attrs:{"id":"popup-ugoira"}},[_c('img',{style:(_vm.imgStyle),attrs:{"src":_vm.screenImg}})])};
  var __vue_staticRenderFns__$5 = [];
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-6d211b59_0", { source: "#ugoira-canvas[data-v-6d211b59]{width:100%;height:100%;position:absolute;top:0;left:0;right:0;bottom:0}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$5 = "data-v-6d211b59";
    const __vue_module_identifier__$5 = undefined;
    const __vue_is_functional_template__$5 = false;
    var Ugoira = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      browser,
      undefined
    );
  let basicResponse = {
      body: {
          illustTitile: '',
          createDate: '2000-12-31T15:00:00+00:00"',
          illustType: 0,
          width: 1080,
          height: 1080,
          likeCount: 0,
          bookmarkCount: 0,
          commentCount: 0,
          pageCount: 1,
          viewCount: 0,
          urls: {
              regular: '',
          },
          tags: {
              tags: [
                  {
                      tag: "",
                      locked: false,
                      deletable: false,
                      romaji: "",
                      translation: {
                          en: "",
                      },
                  },
              ],
          },
      },
  };
  let commentResponse = {
      error: false,
      message: "",
      body: {
          comments: [
              {
                  userId: 0,
                  userName: "",
                  img: "",
                  id: "",
                  comment: "no comment",
                  stampId: null,
                  stampLink: null,
                  commentDate: "",
                  commentRootId: null,
                  commentParentId: null,
                  commentUserId: "",
                  replyToUserId: null,
                  replyToUserName: null,
                  editable: false,
                  hasReplies: false,
              }
          ],
      },
  };
  let ugoiraResponse = {
      error: false,
      message: "",
      body: {
          src: "",
          originalSrc: "",
          mime_type: "",
          frames: [
              {
                  file: "000000.jpg",
                  delay: 100
              }
          ]
      },
  };
  let commentElement = {
      userId: 0,
      userName: "",
      img: "",
      id: "",
      comment: "no comment",
      stampId: null,
      stampLink: null,
      commentDate: "",
      commentRootId: null,
      commentParentId: null,
      commentUserId: "",
      replyToUserId: null,
      replyToUserName: null,
      editable: false,
      hasReplies: false,
  };
  let emoji = {
      "(normal2)": 201,
      "(shame2)": 202,
      "(love2)": 203,
      "(interesting2)": 204,
      "(blush2)": 205,
      "(fire2)": 206,
      "(angry2)": 207,
      "(shine2)": 208,
      "(panic2)": 209,
      "(normal3)": 301,
      "(satisfaction3)": 302,
      "(surprise3)": 303,
      "(smile3)": 304,
      "(shock3)": 305,
      "(gaze3)": 306,
      "(wink3)": 307,
      "(happy3)": 308,
      "(excited3)": 309,
      "(love3)": 310,
      "(normal4)": 401,
      "(surprise4)": 402,
      "(serious4)": 403,
      "(love4)": 404,
      "(shine4)": 405,
      "(sweat4)": 406,
      "(shame4)": 407,
      "(sleep4)": 408,
      "(normal)": 101,
      "(surprise)": 102,
      "(serious)": 103,
      "(heaven)": 104,
      "(happy)": 105,
      "(excited)": 106,
      "(sing)": 107,
      "(cry)": 108,
      "(heart)": 501,
      "(teardrop)": 502,
      "(star)": 503,
  };
  var script$6 = {
      name: "Comment",
      props: {
          commentElem: commentElement,
      },
      data() {
          return {
              emoji: emoji,
          };
      },
      computed: {
          isStamp() {
              if (this.commentElem.stampId !== null) {
                  return true;
              }
              else return false;
          },
          hasReply() {
              return this.commentElem.hasReplies;
          },
          getStampUrl() {
              return `https://s.pximg.net/common/images/stamp/generated-stamps/${commentElem.stampId}_s.jpg?20180605`;
          },
          replaceAll(str, beforeStr, afterStr) {
              var reg = new RegExp(beforeStr, "g");
              return str.replace(reg, afterStr);
          },
          getComment() {
              const comment = this.commentElem.comment;
              if (comment.includes(')')) {
                  let replaceComment = comment;
                  Object.keys(emoji).forEach(function(key) {
                      const regexp = new RegExp(key, 'g');
                      replaceComment = replaceComment.replace(regexp, `<span style="width: 14px; height: 14px; display: inline-block; background-image: url('https://s.pximg.net/common/images/emoji/${emoji[key]}.png'); background-size: contain;"></span>`);
                  });
                  return replaceComment;
              } else {
                  return comment;
              }
          },
          getName() {
              return this.commentElem.userName;
          },
          getDate() {
              return this.commentElem.commentDate;
          },
          commentInfo() {
              return "hoge";
          },
      },
      methods: {},
  };
  const __vue_script__$6 = script$6;
  var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"popup-comment"},[(_vm.isStamp)?_c('span',[_c('img',{attrs:{"src":'https://s.pximg.net/common/images/stamp/generated-stamps/' + _vm.commentElem.stampId+'_s.jpg?20180605'}})]):_c('span',{domProps:{"innerHTML":_vm._s(_vm.getComment)}}),_c('br'),_vm._v(" "),_c('span',{staticClass:"popup-comment-info"},[_vm._v(_vm._s(_vm.commentElem.userName)),_c('br'),_vm._v(_vm._s(_vm.commentElem.commentDate))])])};
  var __vue_staticRenderFns__$6 = [];
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-a8c38ba4_0", { source: ".popup-comment[data-v-a8c38ba4]{background:#eee;margin:5px;margin-right:15px}img[data-v-a8c38ba4]{width:48px;height:48px}.popup-ugoira-stamp[data-v-a8c38ba4]{width:48px;height:48px;background-repeat:no-repeat;background-size:cover;border-radius:2px}.popup-comment-info[data-v-a8c38ba4]{font-size:xx-small;text-align:left;color:#999}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$6 = "data-v-a8c38ba4";
    const __vue_module_identifier__$6 = undefined;
    const __vue_is_functional_template__$6 = false;
    var Comment = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      browser,
      undefined
    );
  var script$7 = {
      name: "CommentList",
      components: {
          Comment,
      },
      props: {
          id: {
              default: 'popup-commentlist',
              type: String,
          },
      },
      data() {
          return {
              screen: document.getElementById('popup-screen'),
              comment: {
                  offset: 0,
                  max: 100,
                  hasNext: true,
              },
          };
      },
      computed: {
          commentArray() {
              const json = this.$store.state.commentJson;
              return json.body.comments;
          },
          commentListStyle: function() {
              const top = this.$store.state.caption.isVisible ? this.$store.state.caption.height : 0;
              return {
                  whiteSpace: 'pre-wrap',
                  zIndex: 10000,
                  width: `120px`,
                  height: `${this.$store.state.screen.height + 10}px`,
                  display: 'inline-block',
                  overflowY: 'scroll',
                  backgroundColor: 'white',
                  border: '1px solid #000',
                  position: 'absolute',
                  top: `${top}px`,
                  left: `${this.$store.state.screen.width + 10}px`,
                  float: 'right',
              };
          },
          offset: function() {
              if (this.screen) {
                  const clientRect = this.screen.getBoundingClientRect();
                  return {
                      top: this.screen.style.top,
                      left: clientRect.left + this.screen.clientWidth + this.screen.clientWidth,
                  };
              } else {
                  return { top: 0, left: 0 };
              }
          },
      },
      created: {},
      updated: function() {
          this.$nextTick(function() {
              this.listHeight = this.$store.state.screen.height;
          });
      },
      methods: {
          infiniteHandler($state) {
          },
      },
  };
  const __vue_script__$7 = script$7;
  var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.commentListStyle),attrs:{"id":_vm.id}},_vm._l((_vm.commentArray),function(elem){return _c('Comment',{attrs:{"comment-elem":elem}})}),1)};
  var __vue_staticRenderFns__$7 = [];
    const __vue_inject_styles__$7 = undefined;
    const __vue_scope_id__$7 = "data-v-068ba0e9";
    const __vue_module_identifier__$7 = undefined;
    const __vue_is_functional_template__$7 = false;
    var CommentList = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      undefined,
      undefined
    );
  class PixivJson {
      constructor(json) {
          Object.assign(this, json);
      }
  }
  class Util {
      onloadExecute(store, url) {
          function changeIllustPageLayout() {
              let figures = document.getElementsByTagName('figure');
              let figcaptions = document.getElementsByTagName('figcaption');
              if (figures.length === figcaptions.length) {
                  for (let i = 0; i < figures.length; i++) {
                      figures[i].parentNode.insertBefore(figcaptions[i], figures[i]);
                  }
              }
          }
          function changeAutherPageLayout() {
              const h2Elems = document.getElementsByTagName('h2');
              if (typeof h2Elems !== 'undefined') {
                  for (const h2elem of h2Elems) {
                      if (h2elem.innerText.startsWith('イラスト') || h2elem.innerText.startsWith('作品')) {
                          const illustElem = h2elem.parentElement.parentElement;
                          const header = document.getElementsByTagName('header')[0];
                          const parent = header.parentNode;
                          parent.insertBefore(illustElem, header.nextSibling);
                          break;
                      }
                  }
              }
          }
          if (store.state.enable.modifyIllustPage && ~url.indexOf('member_illust.php?mode=medium')) {
              changeIllustPageLayout();
          } else if (store.state.enable.modifyAutherPage) {
              if (~url.indexOf('member.php?') || ~url.indexOf('member_illust.php?') || ~url.indexOf('bookmark.php?'))
                  changeAutherPageLayout();
          }
      }
      async getPixivJson(illustId) {
          await fetch(`https://www.pixiv.net/ajax/illust/${illustId}`,
              {
                  method: 'GET',
                  mode: 'cors',
                  keepalive: true,
              },
          ).then(function (response) {
              if (response.ok) {
                  return response.json();
              }
          }).then(async function (json) {
              return new PixivJson(json);
          });
      }
      async getUgoiraJson(illustId) {
          const url = `https://www.pixiv.net/ajax/illust/${illustId}/ugoira_meta`;
          await fetch(url,
              {
                  method: 'GET',
                  mode: 'cors',
                  keepalive: true,
              }).then(function (response) {
              if (response.ok) {
                  return response.json();
              }
          }).then((json) => {
              return new PixivJson(json)
          });
      }
      async loadGmData(store) {
          await GM.getValue("pixiv_viewutil_setting").then(jsonString => {
              if (jsonString !== undefined) {
                  const jsonData = JSON.parse(jsonString);
                  store.commit('setAutherPageBool', (jsonData.changeIllustPageLayout == null) ? true : jsonData.changeIllustPageLayout);
                  store.commit('setAutherPageBool', (jsonData.changeMemberPageLayout == null) ? true : jsonData.changeMemberPageLayout);
                  store.commit('setPopupBool', (jsonData.usePopup == null) ? true : jsonData.usePopup);
                  store.commit('setPopupScale', (jsonData.popupScale == null) ? 0.7 : jsonData.popupScale);
              } else {
                  store.commit('setAutherPageBool', true);
                  store.commit('setAutherPageBool', true);
                  store.commit('setPopupBool', true);
                  store.commit('setPopupScale', 0.7);
              }
          });
      }
      saveGmData(obj) {
          const jsonObj = JSON.stringify(obj);
          console.log(JSON.stringify(obj));
          GM.setValue("pixiv_viewutil_setting", jsonObj);
      }
  }
  var script$8 = {
      name: 'MainContainer',
      components: {
          Caption,
          Illust,
          Manga,
          Ugoira,
          CommentList,
      },
      data() {
          return {
              illustId: null,
          }
      },
      beforeCreate() {
      },
      computed: {
          myData: function () {
              const json = this.$store.state.pixivJson;
              return json.body.illustTitle;
          },
          isVisible: function () {
              return this.$store.state.screen.isVisible;
          },
          screenLoaded: function () {
              return this.$store.state.screen.isLoaded;
          },
          visibleCaption: function () {
              return this.$store.state.caption.isVisible;
          },
          visibleCommentList: function () {
              return this.$store.state.comment.isVisible;
          },
          isIllust: function () {
              return this.$store.state.pixivJson.body.illustType === 0 && this.$store.state.pixivJson.body.pageCount < 2
          },
          isManga: function () {
              return this.$store.state.pixivJson.body.illustType === 1 || (this.$store.state.pixivJson.body.pageCount && this.$store.state.pixivJson.body.pageCount > 1);
          },
          isUgoira: function () {
              return this.$store.state.pixivJson.body.illustType === 2
          },
          containerStyle: function () {
              const scroll = (window.pageYOffset !== undefined) ? window.pageYOffset : document.documentElement.scrollTop;
              return {
                  zIndex: 10000,
                  position: 'relative',
                  display: 'block',
                  top: `${scroll + window.innerHeight / 2}px`,
                  left: `${window.innerWidth / 2}px`,
                  transform: 'translate(-50%,-50%)',
                  width: `auto`,
                  height: `auto`,
              };
          },
      },
      mounted() {
          const store = this.$store;
          const el = this.$el;
          document.querySelectorAll('a[href^="/artworks/"],a[href*="member_illust.php?mode=medium&illust_id="]').forEach(link => {
              link.addEventListener('mouseenter', function () {
                  const clickElem = this.querySelector('.non-trim-thumb') || this;
                  clickElem.setAttribute('onclick', 'console.log();return false;');
                  if (clickElem.classList.contains('ugoku-illust')) {
                      store.commit('isUgoira', true);
                  } else {
                      store.commit('isUgoira', false);
                  }
                  const url = this.getAttribute('href');
                  let preLoadID = null;
                  if (url.startsWith("/artworks/")) {
                      const matches = url.match(/\/artworks\/([0-9]+)/);
                      preLoadID = Number(matches[1]);
                      this.illustId = preLoadID;
                      store.commit('setIllustID', preLoadID);
                      clickElem.addEventListener('click', function () {
                          el.style.top = `${window.pageYOffset + window.innerHeight / 2}px`,
                              el.style.left = `${window.innerWidth / 2}px`,
                              store.commit('fetchScreen');
                      });
                  } else {
                      const matches = url.match(/(.)+illust_id=([0-9]+)(&.+)?/);
                      preLoadID = Number(matches[2]);
                      this.illustId = preLoadID;
                      store.commit('setIllustID', preLoadID);
                      clickElem.addEventListener('click', function () {
                          el.style.top = `${window.pageYOffset + window.innerHeight / 2}px`,
                              el.style.left = `${window.innerWidth / 2}px`,
                              store.commit('fetchScreen');
                      });
                  }
              });
          });
      },
      destroyed: function () {
      },
      methods: {
          toggleComment: function () {
              this.$store.commit('toggleComment');
          },
          toggleCaption: function () {
              this.$store.commit('toggleCaption');
          },
          hide: function () {
              this.$store.commit('hide');
          },
      },
  };
  const __vue_script__$8 = script$8;
  var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isVisible),expression:"isVisible"}],style:(_vm.containerStyle),attrs:{"id":"popup-outer-container"}},[(_vm.visibleCaption)?_c('Caption',{directives:[{name:"show",rawName:"v-show",value:(_vm.screenLoaded),expression:"screenLoaded"}]}):_vm._e(),_vm._v(" "),(_vm.isIllust)?_c('Illust'):(_vm.isUgoira)?_c('Ugoira',{attrs:{"visible":_vm.isVisible}}):_c('Manga'),_vm._v(" "),(_vm.visibleCommentList)?_c('CommentList',{directives:[{name:"show",rawName:"v-show",value:(_vm.screenLoaded),expression:"screenLoaded"}]}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"togglebar togglebar-horizontal is-clickable",on:{"click":_vm.toggleCaption}},[(_vm.visibleCaption)?_c('i',{staticClass:"arrow down is-clickable"}):_vm._e(),_vm._v(" "),(! _vm.visibleCaption)?_c('i',{staticClass:"arrow up is-clickable"}):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"togglebar togglebar-vertical is-clickable",on:{"click":_vm.toggleComment}},[(_vm.visibleCommentList)?_c('i',{staticClass:"arrow left is-clickable"}):_vm._e(),_vm._v(" "),(! _vm.visibleCommentList)?_c('i',{staticClass:"arrow right is-clickable"}):_vm._e()])],1)};
  var __vue_staticRenderFns__$8 = [];
    const __vue_inject_styles__$8 = function (inject) {
      if (!inject) return
      inject("data-v-70cd807a_0", { source: ".arrow[data-v-70cd807a]{position:absolute;z-index:10002;border:solid #c1c1c1;border-width:0 3px 3px 0;display:inline-block;padding:3px;top:50%;left:50%;cursor:pointer}.right[data-v-70cd807a]{left:-1px;transform:rotate(-45deg);-webkit-transform:rotate(-45deg)}.left[data-v-70cd807a]{left:1px;transform:rotate(135deg);-webkit-transform:rotate(135deg)}.up[data-v-70cd807a]{transform:rotate(-135deg);-webkit-transform:rotate(-135deg)}.down[data-v-70cd807a]{top:0;transform:rotate(45deg);-webkit-transform:rotate(45deg)}.togglebar[data-v-70cd807a]{position:absolute;border-radius:10px 10px 10px 10px;border:1px solid #d4d4d4;cursor:pointer;z-index:10001;background-color:#f8f8f8}.togglebar-horizontal[data-v-70cd807a]{width:100px;height:10px;left:50%;transform:translate(-50%,0)}.togglebar-vertical[data-v-70cd807a]{width:10px;height:100px;top:50%;right:0;transform:translate(0,-50%)}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$8 = "data-v-70cd807a";
    const __vue_module_identifier__$8 = undefined;
    const __vue_is_functional_template__$8 = false;
    var App = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      browser,
      undefined
    );
  var script$9 = {
      name: "FontAwesome",
      props: {
          icon: {
              default: 'cog',
              type: String,
          },
      },
  };
  const __vue_script__$9 = script$9;
  var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.icon === 'cog')?_c('svg',{staticClass:"svg-inline--fa fa-cog fa-w-16",attrs:{"aria-hidden":"true","data-prefix":"fas","data-icon":"cog","role":"img","xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 512 512"}},[_c('path',{attrs:{"fill":"#becad8","d":"M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"}})]):_vm._e()};
  var __vue_staticRenderFns__$9 = [];
    const __vue_inject_styles__$9 = undefined;
    const __vue_scope_id__$9 = undefined;
    const __vue_module_identifier__$9 = undefined;
    const __vue_is_functional_template__$9 = false;
    var FontAwesome = normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      undefined,
      undefined
    );
  var script$a = {
      name: 'Modal',
      data() {
          return {}
      },
      computed: {
          changeIllustPage: {
              get() {
                  return this.$store.state.enable.modifyIllustPage
              },
              set(value) {
                  this.$store.commit('setIllustPageBool', value);
              }
          },
          changeAutherPage: {
              get() {
                  return this.$store.state.enable.modifyAutherPage
              },
              set(value) {
                  this.$store.commit('setAutherPageBool', value);
              }
          },
          enablePopup: {
              get() {
                  return this.$store.state.enable.pupupScreen
              },
              set(value) {
                  this.$store.commit('setPopupBool', value);
              }
          },
          setSize:{
              get() {
                  return this.$store.state.screen.scale
              },
              set(value) {
                  this.$store.commit('setPopupScale', value);
              }
          }
      }
  };
  const __vue_script__$a = script$a;
  var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"modal"}},[_c('div',{staticClass:"modal-mask"},[_c('div',{staticClass:"modal-wrapper ",on:{"click":function($event){if($event.target !== $event.currentTarget){ return null; }return _vm.$emit('close')}}},[_c('div',{staticClass:"modal-container"},[_c('div',{staticClass:"modal-header"},[_c('h1',[_vm._v("Pixiv View Util")])]),_vm._v(" "),_c('div',{staticClass:"modal-body"},[_c('label',{staticClass:"control control-checkbox"},[_vm._v("\n                        Modify the illust page's layout\n                        "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.changeIllustPage),expression:"changeIllustPage"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.changeIllustPage)?_vm._i(_vm.changeIllustPage,null)>-1:(_vm.changeIllustPage)},on:{"change":function($event){var $$a=_vm.changeIllustPage,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.changeIllustPage=$$a.concat([$$v]));}else{$$i>-1&&(_vm.changeIllustPage=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.changeIllustPage=$$c;}}}}),_vm._v(" "),_c('div',{staticClass:"control_indicator"})]),_vm._v(" "),_c('label',{staticClass:"control control-checkbox"},[_vm._v("\n                        Modify the auhor page's layout\n                        "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.changeAutherPage),expression:"changeAutherPage"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.changeAutherPage)?_vm._i(_vm.changeAutherPage,null)>-1:(_vm.changeAutherPage)},on:{"change":function($event){var $$a=_vm.changeAutherPage,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.changeAutherPage=$$a.concat([$$v]));}else{$$i>-1&&(_vm.changeAutherPage=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.changeAutherPage=$$c;}}}}),_vm._v(" "),_c('div',{staticClass:"control_indicator"})]),_vm._v(" "),_c('label',{staticClass:"control control-checkbox"},[_vm._v("\n                        Use popup function\n                        "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.enablePopup),expression:"enablePopup"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.enablePopup)?_vm._i(_vm.enablePopup,null)>-1:(_vm.enablePopup)},on:{"change":function($event){var $$a=_vm.enablePopup,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.enablePopup=$$a.concat([$$v]));}else{$$i>-1&&(_vm.enablePopup=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.enablePopup=$$c;}}}}),_vm._v(" "),_c('div',{staticClass:"control_indicator"})]),_vm._v(" "),_c('h2',[_vm._v("Popup size (min <-> max)")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.setSize),expression:"setSize"}],attrs:{"type":"range","min":"0.3","max":"1.2","step":"0.1","id":"pixiv-set-scale"},domProps:{"value":(_vm.setSize)},on:{"__r":function($event){_vm.setSize=$event.target.value;}}}),_vm._v(" "),_c('div',{staticClass:"modal-footer"},[_c('button',{staticClass:"myButton",on:{"click":function($event){return _vm.$emit('close')}}},[_vm._v("\n                            OK\n                        ")])])])])])])])};
  var __vue_staticRenderFns__$a = [];
    const __vue_inject_styles__$a = function (inject) {
      if (!inject) return
      inject("data-v-1193b908_0", { source: ".modal-mask[data-v-1193b908]{position:fixed;z-index:9998;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);display:table;transition:opacity .3s ease}.modal-wrapper[data-v-1193b908]{display:table-cell;vertical-align:middle}.modal-container[data-v-1193b908]{width:300px;margin:0 auto;padding:20px 30px;background-color:#fff;border-radius:2px;box-shadow:0 2px 8px rgba(0,0,0,.33);transition:all .3s ease;font-family:Helvetica,Arial,sans-serif}.modal-header h3[data-v-1193b908]{margin-top:0;color:#42b983}.modal-body[data-v-1193b908]{margin:20px 0}.modal-default-button[data-v-1193b908]{float:right}.modal-enter[data-v-1193b908]{opacity:0}.modal-leave-active[data-v-1193b908]{opacity:0}.modal-enter .modal-container[data-v-1193b908],.modal-leave-active .modal-container[data-v-1193b908]{-webkit-transform:scale(1.1);transform:scale(1.1)}.myButton[data-v-1193b908]{background:-webkit-gradient(linear,left top,left bottom,color-stop(.05,#7892c2),color-stop(1,#476e9e));background:-moz-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-webkit-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-o-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:-ms-linear-gradient(top,#7892c2 5%,#476e9e 100%);background:linear-gradient(to bottom,#7892c2 5%,#476e9e 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#7892c2', endColorstr='#476e9e', GradientType=0);background-color:#7892c2;-moz-border-radius:6px;-webkit-border-radius:6px;border-radius:6px;border:1px solid #4e6096;display:inline-block;cursor:pointer;color:#fff;font-family:Arial;font-size:16px;padding:10px 20px;text-decoration:none}.myButton[data-v-1193b908]:hover{background:-webkit-gradient(linear,left top,left bottom,color-stop(.05,#476e9e),color-stop(1,#7892c2));background:-moz-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-webkit-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-o-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:-ms-linear-gradient(top,#476e9e 5%,#7892c2 100%);background:linear-gradient(to bottom,#476e9e 5%,#7892c2 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#476e9e', endColorstr='#7892c2', GradientType=0);background-color:#476e9e}.myButton[data-v-1193b908]:active{position:relative;top:1px}input[type=range][data-v-1193b908]{height:25px;-webkit-appearance:none;margin:10px 0;width:100%}input[type=range][data-v-1193b908]:focus{outline:0}input[type=range][data-v-1193b908]::-webkit-slider-runnable-track{width:100%;height:5px;cursor:pointer;animate:.2s;box-shadow:0 0 0 #000;background:#c3d7e3;border-radius:1px;border:0 solid #000}input[type=range][data-v-1193b908]::-webkit-slider-thumb{box-shadow:0 0 0 #000;border:1px solid #4e6096;height:18px;width:18px;border-radius:25px;background:#597bab;cursor:pointer;-webkit-appearance:none;margin-top:-7px}input[type=range][data-v-1193b908]:focus::-webkit-slider-runnable-track{background:#c3d7e3}input[type=range][data-v-1193b908]::-moz-range-track{width:100%;height:5px;cursor:pointer;animate:.2s;box-shadow:0 0 0 #000;background:#c3d7e3;border-radius:1px;border:0 solid #000}input[type=range][data-v-1193b908]::-moz-range-thumb{box-shadow:0 0 0 #000;border:1px solid #2497e3;height:18px;width:18px;border-radius:25px;background:#5c82ff;cursor:pointer}input[type=range][data-v-1193b908]::-ms-track{width:100%;height:5px;cursor:pointer;animate:.2s;background:0 0;border-color:transparent;color:transparent}input[type=range][data-v-1193b908]::-ms-fill-lower{background:#c3d7e3;border:0 solid #000;border-radius:2px;box-shadow:0 0 0 #000}input[type=range][data-v-1193b908]::-ms-fill-upper{background:#c3d7e3;border:0 solid #000;border-radius:2px;box-shadow:0 0 0 #000}input[type=range][data-v-1193b908]::-ms-thumb{margin-top:1px;box-shadow:0 0 0 #000;border:1px solid #2497e3;height:18px;width:18px;border-radius:25px;background:#5c82ff;cursor:pointer}input[type=range][data-v-1193b908]:focus::-ms-fill-lower{background:#c3d7e3}input[type=range][data-v-1193b908]:focus::-ms-fill-upper{background:#c3d7e3}.control[data-v-1193b908]{font-family:arial;display:block;position:relative;padding-left:30px;margin-bottom:5px;padding-top:2px;cursor:pointer;font-size:14px}.control input[data-v-1193b908]{position:absolute;z-index:-1;opacity:0}.control_indicator[data-v-1193b908]{position:absolute;top:2px;left:0;height:20px;width:20px;background:#e6e6e6;border:0 solid #000}.control-radio .control_indicator[data-v-1193b908]{border-radius:undefined%}.control input:focus~.control_indicator[data-v-1193b908],.control:hover input~.control_indicator[data-v-1193b908]{background:#ccc}.control input:checked~.control_indicator[data-v-1193b908]{background:#597caf}.control input:checked:focus~.control_indicator[data-v-1193b908],.control:hover input:not([disabled]):checked~.control_indicator[data-v-1193b908]{background:#0e6647d}.control input:disabled~.control_indicator[data-v-1193b908]{background:#e6e6e6;opacity:.6;pointer-events:none}.control_indicator[data-v-1193b908]:after{box-sizing:unset;content:'';position:absolute;display:none}.control input:checked~.control_indicator[data-v-1193b908]:after{display:block}.control-checkbox .control_indicator[data-v-1193b908]:after{left:8px;top:4px;width:3px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}.control-checkbox input:disabled~.control_indicator[data-v-1193b908]:after{border-color:#7b7b7b}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$a = "data-v-1193b908";
    const __vue_module_identifier__$a = undefined;
    const __vue_is_functional_template__$a = false;
    var modal = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      browser,
      undefined
    );
  var script$b = {
      name: "Cog",
      components: {
          FontAwesome,
          modal
      },
      data() {
          return {
              showModal: false
          }
      },
      methods: {
          toggleModal() {
              if (this.showModal) {
                  this.showModal = false;
                  this.save();
              } else {
                  this.showModal = true;
              }
          },
          save(){
              const util=new Util();
              const obj = {
                  changeIllustPageLayout: this.$store.state.enable.modifyIllustPage,
                  changeMemberPageLayout: this.$store.state.enable.modifyAutherPage,
                  openComment: true,
                  usePopup: this.$store.state.enable.pupupScreen,
                  popupCaption:true,
                  popupComment:true,
                  popupScale: this.$store.state.screen.scale
              };
              util.saveGmData(obj);
          }
      }
  };
  const __vue_script__$b = script$b;
  var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"popup-cog"}},[_c('div',{staticClass:"icon",on:{"click":_vm.toggleModal}},[_c('FontAwesome',{staticStyle:{"margin":"auto"},attrs:{"icon":'cog'}})],1),_vm._v(" "),(_vm.showModal)?_c('modal',{on:{"close":_vm.toggleModal}}):_vm._e()],1)};
  var __vue_staticRenderFns__$b = [];
    const __vue_inject_styles__$b = function (inject) {
      if (!inject) return
      inject("data-v-1eb98629_0", { source: ".icon[data-v-1eb98629]{width:24px;height:24px;position:relative;cursor:pointer}", map: undefined, media: undefined });
    };
    const __vue_scope_id__$b = "data-v-1eb98629";
    const __vue_module_identifier__$b = undefined;
    const __vue_is_functional_template__$b = false;
    var Cog = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      browser,
      undefined
    );
  Vue.use(Vuex);
  const artworkType = {
      illust: Symbol('illust'),
      manga: Symbol('manga'),
      ugoira: Symbol('ugoira'),
  };
  const illustData = {
      imgUrl: '',
  };
  const mangaData = {
      page: 0,
      imgUrl: [],
  };
  const state = {
      illustID: 0,
      isUgoira: false,
      enable: {
          modifyIllustPage: true,
          modifyAutherPage: true,
          pupupScreen: true,
      },
      screen: {
          id: 'popup-outer-container',
          elem: { clientWidth: 600, clientHeight: 600 },
          isVisible: false,
          isLoaded: false,
          top: '50%',
          left: '50%',
          scale: 0.8,
          width: 600,
          height: 600,
          transform: 'translate(-50%,-70%)',
          dragging: false,
      },
      caption: {
          isVisible: true,
          height: 100,
      },
      comment: {
          isVisible: true,
      },
      preload: {
          pixivJson: basicResponse,
          commentJson: commentResponse,
          ugoiraJson: ugoiraResponse,
          artworktype: artworkType.illust,
          illustData: illustData,
          mangaData: mangaData,
      },
      pixivJson: basicResponse,
      commentJson: commentResponse,
      ugoiraJson: ugoiraResponse,
      artworktype: artworkType.illust,
      illustData: illustData,
      mangaData: mangaData,
  };
  const actions = {};
  const getters = {};
  const mutations = {
          async setIllustID(state, id) {
              state.illustID = id;
              state.preload.pixivJson = await fetch(`https://www.pixiv.net/ajax/illust/${id}`,
                  {
                      method: 'GET',
                      mode: 'cors',
                      keepalive: true,
                  },
              ).then(function(response) {
                  if (response.ok) {
                      return response.json();
                  }
              }).then(json => {
                  return new PixivJson$1(json);
              });
              if (state.comment.isVisible) {
                  const url = `https://www.pixiv.net/ajax/illusts/comments/roots?illust_id=${id}&offset=${0}&limit=${100}`;
                  state.preload.commentJson = await fetch(url,
                      {
                          method: 'GET',
                          mode: 'cors',
                          keepalive: true,
                      }).then(function(response) {
                      if (response.ok) {
                          return response.json();
                      }
                  }).then((json) => {
                      return new PixivJson$1(json);
                  });
              }
              if (state.isUgoira) {
                  const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira_meta`;
                  state.preload.ugoiraJson = await fetch(url,
                      {
                          method: 'GET',
                          mode: 'cors',
                          keepalive: true,
                      }).then(function(response) {
                      if (response.ok) {
                          return response.json();
                      }
                  }).then((json) => {
                      return new PixivJson$1(json);
                  });
              }
          },
          setScreen(state, elem) {
              state.screen.elem = elem;
          }
          ,
          screenTop() {
              return state.screen.top;
          }
          ,
          screenHeight(state, sHeight) {
              state.screen.height = sHeight;
              state.comment.height = sHeight + 10;
          },
          screenWidth(state, sWidth) {
              state.screen.width = sWidth;
              state.caption.width = sWidth + 10;
          },
          captionHeight(state, height) {
              state.caption.height = height;
          },
          screenLoaded(state) {
              state.screen.isLoaded = true;
          },
          isUgoira(state, bool) {
              state.isUgoira = bool;
          },
          fetchScreen(state) {
              state.pixivJson = JSON.parse(JSON.stringify(state.preload.pixivJson));
              state.commentJson = JSON.parse(JSON.stringify(state.preload.commentJson));
              state.ugoiraJson = JSON.parse(JSON.stringify(state.preload.ugoiraJson));
              state.artworktype = state.preload.artworktype;
              state.screen.isVisible = true;
              state.screen.left = '50%';
              state.screen.top = '50%';
          }
          ,
          showScreen(state) {
              state.screen.isVisible = true;
              state.screen.left = '50%';
              state.screen.top = '50%';
          }
          ,
          hide(state) {
              state.screen.isVisible = false;
              state.screen.isLoaded = false;
          }
          ,
          setIllustPageBool(state, value) {
              state.enable.modifyIllustPage = value;
          },
          setAutherPageBool(state, value) {
              state.enable.modifyAutherPage = value;
          },
          setPopupBool(state, value) {
              state.enable.pupupScreen = value;
          },
          setPopupScale(state, value) {
              state.screen.scale = value;
          },
          toggleCaption(state) {
              state.caption.isVisible = !state.caption.isVisible;
          },
          toggleComment(state) {
              state.comment.isVisible = !state.comment.isVisible;
          },
      }
  ;
  const store = new Vuex.Store({
      state,
      getters,
      actions,
      mutations,
  });
  class PixivJson$1 {
      constructor(json) {
          Object.assign(this, json);
      }
  }
  const util = new Util();
  util.loadGmData(store);
  Vue.config.productionTip = true;
  Vue.directive('draggable', {
      store: store,
      bind: function(el) {
          el.style.position = 'absolute';
          let startX, startY, initialMouseX, initialMouseY;
          function mousemove(e) {
              let dx = e.clientX - initialMouseX;
              var dy = e.clientY - initialMouseY;
              el.style.top = startY + dy + 'px';
              el.style.left = startX + dx + 'px';
              if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                  store.state.screen.dragging = true;
              }
              return false;
          }
          function mouseup(e) {
              document.removeEventListener('mousemove', mousemove);
              document.removeEventListener('mouseup', mouseup);
              if (store.state.screen.dragging || e.target.classList.contains('is-clickable')) {
                  store.state.screen.isVisible = true;
              } else {
                  store.state.screen.isVisible = false;
              }
              store.state.screen.dragging = false;
              return false;
          }
          el.addEventListener('mousedown', function(e) {
              startX = el.offsetLeft;
              startY = el.offsetTop;
              initialMouseX = e.clientX;
              initialMouseY = e.clientY;
              store.state.screen.dragging = false;
              document.addEventListener('mousemove', mousemove);
              document.addEventListener('mouseup', mouseup);
              return false;
          });
      },
  });
  window.onload = () => {
      util.onloadExecute(store, document.URL);
      const links = document.getElementsByTagName('a');
      for (const link of links) {
          link.addEventListener('click', () => {
              util.onloadExecute(store, document.URL);
          });
      }
      const cogID = 'popup-cog';
      const notification = document.getElementsByClassName('notifications');
      if (notification !== null && notification.length > 0 && document.getElementById('cogID') === null) {
          const _li = document.createElement('li');
          const div = document.createElement('div');
          div.id = cogID;
          notification[0].appendChild(_li);
          _li.appendChild(div);
          new Vue({
              store: store,
              el: `#popup-cog`,
              components: {
                  Cog,
                  modal,
              },
              template: '<Cog/>',
          });
      }
      const outerContainerID = 'popup-outer-container';
      if (document.getElementById(outerContainerID) === null) {
          const container = document.createElement('div');
          container.id = outerContainerID;
          document.body.appendChild(container);
          new Vue({
              store: store,
              el: `#popup-outer-container`,
              components: {
                  App,
              },
              template: '<App v-draggable/>',
          });
      }
  };

}(Vue, Vuex));
