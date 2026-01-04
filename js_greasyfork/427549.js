// ==UserScript==
// @name            移动页面的阅读模式
// @namespace       Reading_mode_for_mobile_CN
// @version         0.0.6beta
// @description     只是希望能够稍微提高一点在移动端的阅读体验。
// @author          稻米鼠
// @run-at          document-start
// @icon            https://i.v2ex.co/L00DUOAOl.png
// @contributionURL https://script.izyx.xyz/reading-mode-for-mobile/
// @require         https://cdn.bootcdn.net/ajax/libs/highlight.js/11.0.0-alpha0/highlight.min.js
// @noframes
// @antifeature     payment
// @match           *://www.jianshu.com/p/*
// @match           *://www.zhihu.com/question/*
// @match           *://zhuanlan.zhihu.com/p/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/427549/%E7%A7%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427549/%E7%A7%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(() => {
  "use strict";
  var e = {
    863: (e, t, o) => {
      o.d(t, {
        Z: () => l
      });
      var r = o(645);
      var n = o.n(r);
      var i = n()((function(e) {
        return e[1];
      }));
      i.push([ e.id, "/*\n\nAtom One Dark by Daniel Gamage\nOriginal One Dark Syntax theme from https://github.com/atom/one-dark-syntax\n\nbase:    #282c34\nmono-1:  #abb2bf\nmono-2:  #818896\nmono-3:  #5c6370\nhue-1:   #56b6c2\nhue-2:   #61aeee\nhue-3:   #c678dd\nhue-4:   #98c379\nhue-5:   #e06c75\nhue-5-2: #be5046\nhue-6:   #d19a66\nhue-6-2: #e6c07b\n\n*/\n\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #abb2bf;\n  background: #282c34;\n}\n\n.hljs-comment,\n.hljs-quote {\n  color: #5c6370;\n  font-style: italic;\n}\n\n.hljs-doctag,\n.hljs-keyword,\n.hljs-formula {\n  color: #c678dd;\n}\n\n.hljs-section,\n.hljs-name,\n.hljs-selector-tag,\n.hljs-deletion,\n.hljs-subst {\n  color: #e06c75;\n}\n\n.hljs-literal {\n  color: #56b6c2;\n}\n\n.hljs-string,\n.hljs-regexp,\n.hljs-addition,\n.hljs-attribute,\n.hljs-meta-string {\n  color: #98c379;\n}\n\n.hljs-built_in,\n.hljs-class .hljs-title {\n  color: #e6c07b;\n}\n\n.hljs-attr,\n.hljs-variable,\n.hljs-template-variable,\n.hljs-type,\n.hljs-selector-class,\n.hljs-selector-attr,\n.hljs-selector-pseudo,\n.hljs-number {\n  color: #d19a66;\n}\n\n.hljs-symbol,\n.hljs-bullet,\n.hljs-link,\n.hljs-meta,\n.hljs-selector-id,\n.hljs-title {\n  color: #61aeee;\n}\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}\n\n.hljs-link {\n  text-decoration: underline;\n}\n", "" ]);
      const l = i;
    },
    152: (e, t, o) => {
      o.d(t, {
        Z: () => l
      });
      var r = o(645);
      var n = o.n(r);
      var i = n()((function(e) {
        return e[1];
      }));
      i.push([ e.id, '.rmfm-body-hidden{display:none !important}#reading-mode-for-mobile{position:fixed;top:0;left:0;width:100vw;height:100vh;margin:0;padding:0;overflow-y:auto;overflow-x:hidden;font-family:-apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif;font-size:16px;line-height:1.8;background-color:#e0e0e4;box-sizing:border-box;z-index:2147483647}#reading-mode-for-mobile *{box-sizing:border-box}#reading-mode-for-mobile > article.rmfm-main{position:relative;width:100vw;max-width:800px;margin:0 auto;padding:36px 72px;background-color:#fff;box-shadow:0 0 72px rgba(0,0,0,0.1);color:#18181c}#reading-mode-for-mobile > article.rmfm-main > .rmfm-title,#reading-mode-for-mobile > article.rmfm-main > .rmfm-content{position:relative}#reading-mode-for-mobile > article.rmfm-main > .rmfm-title > .rmfm-section,#reading-mode-for-mobile > article.rmfm-main > .rmfm-content > .rmfm-section{border-top:3px solid #f0f0f4;padding:18px 0}#reading-mode-for-mobile h1,#reading-mode-for-mobile h2,#reading-mode-for-mobile h3,#reading-mode-for-mobile h4,#reading-mode-for-mobile h5,#reading-mode-for-mobile h6{line-height:2.16;margin:18px 0}#reading-mode-for-mobile h1{font-size:22.4px;font-weight:200;text-align:center}#reading-mode-for-mobile h2{font-size:20.8px;font-weight:200}#reading-mode-for-mobile h3{font-size:19.2px;font-weight:600;color:#505054}#reading-mode-for-mobile h4{font-size:17.6px;font-weight:600;color:#78787c}#reading-mode-for-mobile h5{font-size:17.6px;font-weight:400;color:#a0a0a4}#reading-mode-for-mobile h6{font-size:17.6px;font-weight:200;color:#c8c8cc}#reading-mode-for-mobile p{margin:18px 0;text-indent:2em}#reading-mode-for-mobile hr{height:3px;background-color:#f0f0f4;margin:18px 0}#reading-mode-for-mobile b,#reading-mode-for-mobile strong{color:#000}#reading-mode-for-mobile del{color:#c0c0c4}#reading-mode-for-mobile ul,#reading-mode-for-mobile ol{margin:18px 0 18px 36px}#reading-mode-for-mobile li > ol,#reading-mode-for-mobile li > ul{margin:0 0 0 36px}#reading-mode-for-mobile table{border:2px solid #e0e0e4;border-spacing:0}#reading-mode-for-mobile table tr,#reading-mode-for-mobile table td,#reading-mode-for-mobile table th{border:1px solid #e0e0e4}#reading-mode-for-mobile table td,#reading-mode-for-mobile table th{padding:9px 18px}#reading-mode-for-mobile img,#reading-mode-for-mobile video,#reading-mode-for-mobile embed,#reading-mode-for-mobile svg{max-width:100%}#reading-mode-for-mobile a{color:#f46;text-decoration:none}#reading-mode-for-mobile a:hover{text-decoration:underline}#reading-mode-for-mobile blockquote{background-color:rgba(0,0,32,0.05);border-left:5px solid rgba(0,0,32,0.08);padding:9px 18px;margin:18px 0}#reading-mode-for-mobile pre{margin:36px -72px;padding:18px 0;background-color:#282c34;color:#a8a8ac;white-space:pre-wrap;word-break:break-all}#reading-mode-for-mobile pre code{padding:18px 72px;position:relative;font-family:"Fira Code",monospace,MonoLisa,"source code pro","consolas"}#reading-mode-for-mobile pre code::before{content:\' \';position:absolute;height:100%;left:63px;top:0;z-index:100;border-left:1px solid #88888c}#reading-mode-for-mobile pre code .rmfm-code-line{position:relative}#reading-mode-for-mobile pre code .rmfm-code-line .rmfm-code-line-num{position:absolute;top:0;left:-90px;width:72px;height:100%;background-repeat:no-repeat;background-position:top right}#reading-mode-for-mobile #rmfm-menu{position:fixed;width:100vh;height:28.8px;top:calc(50vh - 14.4px);left:calc(14.4px - 50vh);transform:rotate(90deg)}#reading-mode-for-mobile #rmfm-menu .rmfm-menu-item{display:inline-block;padding:0 9px;cursor:pointer;color:#c0c0c4;font-size:12.8px}#reading-mode-for-mobile #rmfm-menu .rmfm-menu-item:hover{color:#f46}#reading-mode-for-mobile #rmfm-menu .rmfm-menu-hidden{display:none}#reading-mode-for-mobile .rmfm-menu-top,#reading-mode-for-mobile .rmfm-menu-bottom{float:left}#reading-mode-for-mobile .rmfm-menu-bottom{float:right}#reading-mode-for-mobile #rmfm-toc-list{position:fixed;top:0;left:0;z-index:-1;width:400px;max-width:90vw;margin:0;padding:9px 9px 9px 36px;font-size:12.8px}#reading-mode-for-mobile #rmfm-toc-list .rmfm-toc-item{cursor:pointer;list-style-type:disc;overflow-wrap:break-word;word-break:break-all}#reading-mode-for-mobile #rmfm-toc-list .rmfm-toc-item:hover{color:#f46}@media screen and (max-width:800px){#reading-mode-for-mobile > article.rmfm-main{padding:36px 9vw}#reading-mode-for-mobile pre{margin:36px -9vw}#reading-mode-for-mobile pre code{padding:18px -9vw 18px 72px}}', "" ]);
      const l = i;
    },
    920: (e, t, o) => {
      o.d(t, {
        Z: () => l
      });
      var r = o(645);
      var n = o.n(r);
      var i = n()((function(e) {
        return e[1];
      }));
      i.push([ e.id, "#reading-mode-for-mobile-start-card{width:100vw;height:100vh;position:fixed;bottom:0;left:0;background-color:rgba(0,0,0,0.8);z-index:2147483647}#reading-mode-for-mobile-start-card .start-content{position:absolute;bottom:0;width:90vw;left:5vw;text-align:center;box-sizing:border-box}#reading-mode-for-mobile-start-card .start-content p.rmfm-small-tip{font-size:12.8px;color:#a8a8ac;line-height:1.8;padding:0;margin:9px}#reading-mode-for-mobile-start-card .start-content .start-card{padding:18px 0}#reading-mode-for-mobile-start-card .start-content button{display:block;color:#909094;font-weight:200;line-height:1em;padding:16px;margin:8px auto}#reading-mode-for-mobile-start-card .start-content button#rmfm-show-button{background-color:#3ae;color:#fff;font-size:19.2px;border:1px solid #d0d0d4;border-radius:8px}#reading-mode-for-mobile-start-card .start-content button#rmfm-hide-button{font-size:48px}#reading-mode-for-mobile-start-card .start-content span#rmfm-countdown{font-weight:600;color:#f46}", "" ]);
      const l = i;
    },
    645: e => {
      e.exports = function(e) {
        var t = [];
        t.toString = function toString() {
          return this.map((function(t) {
            var o = e(t);
            if (t[2]) return "@media ".concat(t[2], " {").concat(o, "}");
            return o;
          })).join("");
        };
        t.i = function(e, o, r) {
          if ("string" === typeof e) e = [ [ null, e, "" ] ];
          var n = {};
          if (r) for (var i = 0; i < this.length; i++) {
            var l = this[i][0];
            if (null != l) n[l] = true;
          }
          for (var a = 0; a < e.length; a++) {
            var s = [].concat(e[a]);
            if (r && n[s[0]]) continue;
            if (o) if (!s[2]) s[2] = o; else s[2] = "".concat(o, " and ").concat(s[2]);
            t.push(s);
          }
        };
        return t;
      };
    }
  };
  var t = {};
  function __webpack_require__(o) {
    var r = t[o];
    if (void 0 !== r) return r.exports;
    var n = t[o] = {
      id: o,
      exports: {}
    };
    e[o](n, n.exports, __webpack_require__);
    return n.exports;
  }
  (() => {
    __webpack_require__.n = e => {
      var t = e && e.__esModule ? () => e["default"] : () => e;
      __webpack_require__.d(t, {
        a: t
      });
      return t;
    };
  })();
  (() => {
    __webpack_require__.d = (e, t) => {
      for (var o in t) if (__webpack_require__.o(t, o) && !__webpack_require__.o(e, o)) Object.defineProperty(e, o, {
        enumerable: true,
        get: t[o]
      });
    };
  })();
  (() => {
    __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  })();
  var o = {};
  (() => {
    const e = {
      "www.jianshu.com": {
        name: "JianShu",
        blockModal: true,
        rules: [ {
          urlReg: /\/p\/\w+/i,
          contentGetter: ".main-view .content",
          contentHandler: e => {
            e.querySelectorAll("img").forEach((e => {
              if (!e.src) e.src = e.getAttribute("data-original-src");
            }));
            e.querySelectorAll('div[aria-label="3rd-ad"]').forEach((e => {
              e.parentNode.removeChild(e);
            }));
          }
        } ]
      },
      "www.zhihu.com": {
        name: "Zhihu",
        blockModal: true,
        rules: [ {
          urlReg: /\/question\/\d+\/answer\/\d+/i,
          titleGetter: ".QuestionHeader-title",
          contentGetter: ".Question-main .QuestionAnswer-content",
          contentHandler: e => {
            e.querySelectorAll(`\n            .ContentItem-actions,\n            .ModalWrap,\n            .ModalLoading-content,\n            .CommentItemV2-footer,\n            .RichContent--unescapable.is-collapsed .ContentItem-rightButton,\n            .ContentItem.AnswerItem button.Button--primary`).forEach((e => {
              e.parentNode.removeChild(e);
            }));
            e.querySelectorAll(".CommentItemV2").forEach((e => {
              const t = document.createElement("br");
              e.before(t);
            }));
          }
        }, {
          urlReg: /\/question\/\d+/i,
          titleGetter: ".QuestionHeader-title",
          contentGetter: ".Question-main .List-item",
          contentHandler: e => {
            e.querySelectorAll(`\n            .ContentItem-actions,\n            .ModalWrap,\n            .ModalLoading-content,\n            .CommentItemV2-footer,\n            .RichContent--unescapable.is-collapsed .ContentItem-rightButton,\n            .ContentItem.AnswerItem button.Button--primary`).forEach((e => {
              e.parentNode.removeChild(e);
            }));
            e.querySelectorAll(".CommentItemV2").forEach((e => {
              const t = document.createElement("br");
              e.before(t);
            }));
          }
        } ]
      },
      "zhuanlan.zhihu.com": {
        name: "Zhihu Zhuanlan",
        blockModal: true,
        rules: [ {
          urlReg: /\/p\/\d+/i,
          titleGetter: "h1.Post-Title",
          contentGetter: ".Post-RichTextContainer"
        } ]
      }
    };
    const t = e;
    const o = null && [ "EnterPage", "StartCard", "ReadingMode" ];
    const r = {
      redirect: [ "pushState", "replaceState", "popstate" ],
      sameSite: [ "pushState", "replaceState", "popstate", "alert", "confirm" ]
    };
    const valORnull = e => e ? e : null;
    const n = {
      state: {
        is_debug: 0,
        auto_reading_mode: 0,
        log: [],
        warn: [],
        el: {},
        restore: {},
        pos: {},
        rule: {},
        modal: [ "alert", "confirm" ],
        toc: []
      },
      get is_debug() {
        return this.state.is_debug;
      },
      get auto_reading_mode() {
        return this.state.auto_reading_mode;
      },
      get modal() {
        return this.state.modal;
      },
      log(e, t) {
        if (this.is_debug) this.state.log.push((new Date).toLocaleString() + (e ? " " + e : "") + ": " + ([ "string", "number" ].includes(typeof t) ? t : JSON.stringify(t)));
      },
      warn(e, t) {
        this.state.warn.push((new Date).toLocaleString() + (e ? " " + e : "") + ": " + ([ "string", "number" ].includes(typeof t) ? t : JSON.stringify(t)));
      },
      exposeState() {
        if (this.is_debug) this.log("State expose", "Debug: " + this.is_debug);
        if (this.is_debug) window.rmfmState = this.state;
      },
      setRestore(e, t = null) {
        if (this.is_debug) this.log("State set Restore", {
          name: e,
          method: t
        });
        if (t) {
          this.state.restore[e] = t;
          return;
        }
        delete this.state.restore[e];
      },
      getRestore(e) {
        if (this.is_debug) this.log("State get Restore", {
          name: e,
          el: valORnull(this.state.restore[e])
        });
        return valORnull(this.state.restore[e]);
      },
      restore(e = []) {
        if (this.is_debug) this.log("State restore", e);
        if ("string" === typeof e) e = r[e] ? r[e] : [];
        const t = this.state.restore;
        for (const o in t) {
          if (e.includes(o)) continue;
          this.getRestore(o)();
          this.setRestore(o);
        }
      },
      getKeys(e) {
        if (this.is_debug) this.log("State get keys", {
          name: e,
          keys: Object.keys(this.state[e])
        });
        return Object.keys(this.state[e]);
      },
      addToc(e) {
        if (this.is_debug) this.log("State set TOC", e);
        this.state.toc.push(e);
      },
      getToc() {
        if (this.is_debug) this.log("State get TOC", this.state.toc);
        return this.state.toc;
      },
      clearEls() {
        this.getKeys("el").forEach((e => {
          if ("el_root" === e) return;
          delete this.state.el[e];
        }));
      }
    };
    const i = {
      el: [ "root", "startCard", "readingMode", "main", "title", "content", "menu", "toc", "tocList" ],
      rule: [ "site", "default", "now" ],
      pos: [ "toc", "menu" ]
    };
    for (const e in i) for (const t of i[e]) {
      const o = e + "_" + t;
      Object.defineProperty(n, o, {
        get: function() {
          if (this.is_debug) this.log("Store " + e + " get", o);
          return this.state[e][o];
        },
        set: function(t) {
          if (this.is_debug) this.log("Store " + e + " set", o + " = " + t);
          this.state[e][o] = t;
        }
      });
    }
    n.exposeState();
    const l = n;
    var a = __webpack_require__(920);
    var s = '<div class="start-content"> <p class="rmfm-small-tip">此提示来自于脚本：</p> <p class="rmfm-small-tip"><strong>移动页面的阅读模式</strong></p> <p class="rmfm-small-tip">当前版本号： 0.0.6beta</p> <p class="rmfm-small-tip">只是希望能够稍微提高一点在移动端的阅读体验。</p> <p class="rmfm-small-tip">此提示会在 <span id="rmfm-countdown"></span> 秒之后隐藏，刷新页面可以重新显示此提示。</p> <div class="start-card"> <button id="rmfm-show-button">进入阅读模式</button> <button id="rmfm-hide-button">╳</button> </div> </div>';
    const d = s;
    var m = __webpack_require__(152);
    var c = '<article class="rmfm-main"> <div id="rmfm-menu"> <div class="rmfm-menu-top"> <div id="rmfm-close-button" class="rmfm-menu-item">关闭</div> <div id="rmfm-toc-button" class="rmfm-menu-item rmfm-menu-hidden">大纲</div> </div> <div class="rmfm-menu-bottom"> <div id="rmfm-top-button" class="rmfm-menu-item">返回顶部</div> </div> </div> <ul id="rmfm-toc-list"></ul> <h1 class="rmfm-title"></h1> <div class="rmfm-content"></div> </article>';
    const f = c;
    var u = __webpack_require__(863);
    const removeEl = (e, t = false) => {
      if (l.is_debug) l.log("removeEl", {
        el: e,
        force: t
      });
      try {
        e.parentNode.removeChild(e);
      } catch (o) {
        l.warn("Remove el", {
          parent: e.parentNode,
          el: e,
          error: o
        });
        if (t) l.el_root.innerHTML = "";
      }
    };
    const addRootEl = () => {
      if (l.is_debug) l.log("addRootEl", "Everyone in it");
      if (l.el_root) {
        l.warn("Add root el", "But here have a root el.");
        return;
      }
      l.el_root = document.createElement("div");
      l.el_root.id = "rmfm-root-box";
      document.querySelector("html").appendChild(l.el_root);
    };
    const exitScript = () => {
      if (l.is_debug) l.log("exitScript", "End.");
      l.restore("redirect");
      l.clearEls();
    };
    const getPostToShow = () => {
      if (l.is_debug) l.log("getPostToShow", "");
      const e = l.rule_now;
      if (e.style) l.el_readingMode.querySelector("style").innerHTML += "\n" + e.style;
      l.el_title.innerText = titleGetter(e.titleGetter);
      l.el_content.innerHTML = contentGetter(e.contentGetter);
      const t = e.contentHandler;
      if ("function" === typeof t) t(l.el_content);
      getToc();
      clearContent();
      highlightCode();
    };
    const titleGetter = e => {
      if (l.is_debug) l.log("titleGetter", {
        selector: e
      });
      if (e) {
        if ("string" === typeof e && e.length) return document.body.querySelector(e).innerText;
        if ("function" === typeof e) return e();
      }
      const t = document.body.querySelector("h1");
      if (t) return t.innerHTML;
      return document.title;
    };
    const contentGetter = e => {
      if (l.is_debug) l.log("contentGetter", {
        selector: e
      });
      const t = [];
      if (e) {
        if ("function" === typeof e) return e();
        if ("string" === typeof e && e.length) t.unshift(e);
      }
      for (const e of t) {
        const t = document.body.querySelectorAll(e);
        if (t) {
          let e = "";
          t.forEach((t => {
            e += `<div class="rmfm-section">` + t.innerHTML + `</div>`;
          }));
          return e;
        }
      }
      return document.body.innerHTML;
    };
    const getToc = () => {
      const e = l.rule_now.toc ? l.rule_now.toc : [ "h1", "h2", "h3", "h4", "h5", "h6" ];
      e.forEach(((e, t) => {
        l.el_content.querySelectorAll(e).forEach((e => {
          e.classList.add("rmfm-toc-title");
          e.setAttribute("data-rmfm-toc-level", t);
        }));
      }));
      const t = [];
      l.el_content.querySelectorAll(".rmfm-toc-title").forEach(((e, o) => {
        const r = e.getAttribute("data-rmfm-toc-level");
        e.setAttribute("data-rmfm-toc-mairk", o);
        l.addToc({
          name: e.innerText,
          level: r,
          mark: o
        });
        if (!t.includes(r)) t.push(r);
      }));
      t.sort();
      if (l.getToc().length) {
        l.el_toc = l.el_readingMode.querySelector("#rmfm-toc-button");
        l.el_tocList = l.el_readingMode.querySelector("#rmfm-toc-list");
        let e = 0;
        l.getToc().forEach(((o, r) => {
          const n = document.createElement("li");
          if (!r) e = t.indexOf(o.level); else if (e < o.level) e = 0;
          const i = t.indexOf(o.level) - e;
          n.id = "rmfm-toc-item-" + r;
          n.classList.add("rmfm-toc-item");
          n.classList.add("rmfm-toc-item-" + i);
          n.style.marginLeft = 2 * i + "em";
          n.innerHTML = "<span>" + o.name + "<span>";
          n.onclick = () => {
            l.el_readingMode.scrollTo({
              top: l.el_content.querySelector('[data-rmfm-toc-mairk="' + o.mark + '"]').offsetTop + l.el_content.offsetTop,
              behavior: "smooth"
            });
            if (l.el_main.style.marginLeft) {
              l.el_main.style.marginLeft = "";
              l.pos_menu();
            }
          };
          l.el_tocList.appendChild(n);
        }));
        let o = 0;
        let r = 0;
        l.pos_toc = () => {
          r = 0;
          l.el_tocList.querySelectorAll("li.rmfm-toc-item>span").forEach((e => {
            r = Math.max(r, e.offsetWidth + Number(window.getComputedStyle(e.parentNode).marginLeft.replace("px", "")));
          }));
          if (r) r += 64;
          o = l.el_main.offsetLeft - r;
          l.el_tocList.style.left = (o < 0 ? 0 : o) + "px";
          const e = window.getComputedStyle(l.el_main);
          if (o < 0 || +e.marginLeft.replace("px", "") > +e.marginRight.replace("px", "")) l.el_toc.classList.remove("rmfm-menu-hidden"); else {
            l.el_main.style.marginLeft = "";
            l.el_toc.classList.add("rmfm-menu-hidden");
          }
        };
        l.pos_toc();
        window.addEventListener("resize", l.pos_toc);
        l.setRestore("tocResetOffset", (() => {
          window.removeEventListener("resize", l.pos_toc);
        }));
        l.el_toc.onclick = () => {
          if (o >= 0) return;
          if (l.el_main.style.marginLeft) l.el_main.style.marginLeft = ""; else l.el_main.style.marginLeft = r + "px";
          l.pos_menu();
        };
      }
    };
    const clearContent = () => {
      if (l.is_debug) l.log("clearContent", "");
      l.el_content.querySelectorAll(".rmfm-section *").forEach((e => {
        if (/^(style|script|header|footer|aside|nav|meta)$/i.test(e.tagName)) {
          removeEl(e);
          return;
        }
        e.removeAttribute("class");
        e.removeAttribute("id");
        e.removeAttribute("style");
      }));
      l.el_content.querySelectorAll(".rmfm-section").forEach((e => {
        e.innerHTML = e.innerHTML.replace(/<\/?(div|span)[^>]*>/gi, "").replace(/<p>\s*(<br\s?\/?>\s*)*<\/p>/g, "").replace(/(<br\s?\/?>\s*){2,}/g, "<br />");
      }));
    };
    const highlightCode = () => {
      const e = l.el_content.querySelectorAll("pre");
      if (e) {
        e.forEach((e => {
          const t = e.querySelector("code");
          if ("undefined" !== typeof hljs) hljs.highlightBlock(t); else t.classList.add("hljs");
          setLineNumber(t);
        }));
        l.el_readingMode.querySelector("style").innerHTML = u.Z + "\n" + l.el_readingMode.querySelector("style").innerHTML;
      }
    };
    const generateLineNumber = (e, t) => {
      const o = document.createElement("canvas");
      const r = o.getContext("2d");
      const n = {
        font: t.fontSize + " " + (t.fontFamily ? t.fontFamily : window.getComputedStyle(document.body).fontFamily),
        textAlign: "right",
        fillStyle: "#999999"
      };
      for (const e in n) r[e] = n[e];
      t.width = r.measureText(e).width;
      t.height = Number(t.lineHeight.replace("px", ""));
      o.width = t.width;
      o.height = t.height;
      for (const e in n) r[e] = n[e];
      const i = t.height / 2 + Number(t.fontSize.replace("px", "")) / 2;
      r.fillText(e, t.width, i);
      return o.toDataURL("image/png");
    };
    const setLineNumber = e => {
      const t = e ? [ e ] : [];
      t.forEach((e => {
        const t = window.getComputedStyle(e);
        const o = {
          fontSize: t.fontSize,
          fontFamily: t.fontFamily,
          lineHeight: t.lineHeight
        };
        e.innerHTML = e.innerHTML.split("\n").map(((e, t) => {
          const r = t + 1;
          const n = generateLineNumber(r, o);
          return '<div class="rmfm-code-line"><div class="rmfm-code-line-num" date-line-num="' + r + '" style="background-image: url(' + n + ')"></div>' + e + "</div>";
        })).join("");
      }));
    };
    const pageRedirectEvent = () => {
      const e = new Event("pageRedirect", {
        bubbles: true,
        cancelable: true
      });
      e.arguments = arguments;
      window.dispatchEvent(e);
    };
    const methodChanger = (e, t = window, o) => {
      const r = t[e];
      t[e] = o ? function() {
        const e = r.apply(this, arguments);
        o(arguments);
        return e;
      } : function() {
        if (l.is_debug) l.log("Evevt Killer - " + e, JSON.stringify(arguments));
      };
      return function() {
        t[e] = r;
      };
    };
    const addPageRedirectTrigger = () => {
      [ "pushState", "replaceState" ].forEach((e => {
        l.setRestore(e, methodChanger(e, history, pageRedirectEvent));
      }));
      window.addEventListener("popstate", pageRedirectEvent);
      l.setRestore("popstate", (() => {
        window.removeEventListener("popstate", pageRedirectEvent);
      }));
      const pageRedirectListener = () => {
        if (window.rmfmState.pageUrl === window.location.href) return;
      };
      window.addEventListener("pageRedirect", pageRedirectListener);
      l.setRestore("pageRedirect", (() => {
        window.removeEventListener("pageRedirect", pageRedirectListener);
      }));
    };
    const enterPage = e => {
      if (l.is_debug) l.log("Page enter", "Start.");
      if (self != top) return;
      l.rule_site = e[window.location.host];
      if (!l.rule_site) return;
      addPageRedirectTrigger();
      l.rule_default = Object.assign({}, l.rule_site);
      delete l.rule_default.rules;
      if (l.rule_default.blockModal) l.modal.forEach((e => {
        l.setRestore(e, methodChanger(e));
      }));
      for (const e of l.rule_site.rules) if (e.urlReg.test(window.location.href)) {
        l.rule_now = Object.assign({}, l.rule_default, e);
        break;
      }
      if (!l.rule_now) {
        exitScript();
        return;
      }
      addRootEl();
      if (l.auto_reading_mode) {
        showReadingMode();
        return;
      }
      showStartCard();
    };
    const showStartCard = () => {
      if (l.is_debug) l.log("showStartCard", "");
      if (l.el_startCard) {
        l.warn("Add start el", "But here have a start el.");
        return;
      }
      l.el_startCard = document.createElement("div");
      l.el_startCard.id = "reading-mode-for-mobile-start-card";
      l.el_startCard.innerHTML = "<style>" + a.Z + "</style>\n" + d;
      l.el_root.appendChild(l.el_startCard);
      const closeStartCard = () => {
        window.clearInterval(o);
        removeEl(l.el_startCard, true);
        l.el_startCard = null;
        l.setRestore("closeStartCard");
      };
      l.setRestore("closeStartCard", closeStartCard);
      l.el_startCard.querySelector("#rmfm-hide-button").onclick = exitScript;
      l.el_startCard.querySelector("#rmfm-show-button").onclick = () => {
        closeStartCard();
        showReadingMode();
      };
      let e = 8;
      const t = l.el_startCard.querySelector("#rmfm-countdown");
      t.innerText = e;
      let o = window.setInterval((() => {
        e--;
        if (!e) closeStartCard();
        t.innerText = e;
      }), 1e3);
    };
    const showReadingMode = () => {
      if (l.is_debug) l.log("showReadingMode", "");
      const e = l.rule_now;
      if (l.el_readingMode) {
        l.warn("Add reading el", "But here have a reading el.");
        return;
      }
      l.el_readingMode = document.createElement("div");
      l.el_readingMode.id = "reading-mode-for-mobile";
      l.el_readingMode.innerHTML = "<style>" + m.Z + "</style>\n" + f;
      l.el_root.appendChild(l.el_readingMode);
      document.body.classList.add("rmfm-body-hidden");
      const closeReadingMode = () => {
        document.body.classList.remove("rmfm-body-hidden");
        removeEl(l.el_readingMode, true);
        document.removeEventListener("keydown", escCloseReadingMode);
        l.setRestore("closeReadingMode");
      };
      l.setRestore("closeReadingMode", closeReadingMode);
      const escCloseReadingMode = e => {
        if ("Escape" === e.code) exitScript();
      };
      document.addEventListener("keydown", escCloseReadingMode);
      l.el_main = l.el_readingMode.querySelector(".rmfm-main");
      l.el_title = l.el_readingMode.querySelector(".rmfm-title");
      l.el_content = l.el_readingMode.querySelector(".rmfm-content");
      l.el_menu = l.el_readingMode.querySelector("#rmfm-menu");
      l.pos_menu = () => {
        l.el_menu.style.marginLeft = l.el_main.offsetLeft + "px";
      };
      l.pos_menu();
      window.addEventListener("resize", l.pos_menu);
      l.setRestore("menuResetOffset", (() => {
        window.removeEventListener("resize", l.pos_menu);
      }));
      l.el_menu.querySelector("#rmfm-close-button").onclick = exitScript;
      l.el_menu.querySelector("#rmfm-top-button").onclick = () => {
        l.el_readingMode.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      };
      if ("loading" === document.readyState) {
        l.el_content.innerHTML = `<div style="text-align: center">loading……</div>`;
        document.addEventListener("DOMContentLoaded", (() => {
          getPostToShow();
        }));
      } else getPostToShow();
    };
    if (l.is_debug) l.log("Script", "Now, script is loaded.");
    const g = {
      enterPage
    };
    if (l.is_debug) l.log("Script", "Now, script start.");
    g.enterPage(t);
  })();
})();