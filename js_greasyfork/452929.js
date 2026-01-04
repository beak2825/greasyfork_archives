// ==UserScript==
// @name         WebUI 태그 자동완성
// @namespace    https://greasyfork.org/users/815641
// @version      1.3.1
// @author       우흐
// @description  WebUI 태그 자동완성 추가
// @license      MIT
// @match        *://127.0.0.1:*/*
// @match        *://*.gradio.app/*
// @match        *://localhost:*/*
// @match        *://*.ngrok.io/*
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452929/WebUI%20%ED%83%9C%EA%B7%B8%20%EC%9E%90%EB%8F%99%EC%99%84%EC%84%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/452929/WebUI%20%ED%83%9C%EA%B7%B8%20%EC%9E%90%EB%8F%99%EC%99%84%EC%84%B1.meta.js
// ==/UserScript==

(function() {
  "use strict";
  var autoComplete_min = { exports: {} };
  (function(module, exports) {
    var t;
    t = function() {
      function e(e2, t3) {
        var n2 = Object.keys(e2);
        if (Object.getOwnPropertySymbols) {
          var r2 = Object.getOwnPropertySymbols(e2);
          t3 && (r2 = r2.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e2, t4).enumerable;
          })), n2.push.apply(n2, r2);
        }
        return n2;
      }
      function t2(t3) {
        for (var n2 = 1; n2 < arguments.length; n2++) {
          var i2 = null != arguments[n2] ? arguments[n2] : {};
          n2 % 2 ? e(Object(i2), true).forEach(function(e2) {
            r(t3, e2, i2[e2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t3, Object.getOwnPropertyDescriptors(i2)) : e(Object(i2)).forEach(function(e2) {
            Object.defineProperty(t3, e2, Object.getOwnPropertyDescriptor(i2, e2));
          });
        }
        return t3;
      }
      function n(e2) {
        return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
          return typeof e3;
        } : function(e3) {
          return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
        }, n(e2);
      }
      function r(e2, t3, n2) {
        return t3 in e2 ? Object.defineProperty(e2, t3, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t3] = n2, e2;
      }
      function i(e2) {
        return function(e3) {
          if (Array.isArray(e3))
            return s(e3);
        }(e2) || function(e3) {
          if ("undefined" != typeof Symbol && null != e3[Symbol.iterator] || null != e3["@@iterator"])
            return Array.from(e3);
        }(e2) || o(e2) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function o(e2, t3) {
        if (e2) {
          if ("string" == typeof e2)
            return s(e2, t3);
          var n2 = Object.prototype.toString.call(e2).slice(8, -1);
          return "Object" === n2 && e2.constructor && (n2 = e2.constructor.name), "Map" === n2 || "Set" === n2 ? Array.from(e2) : "Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2) ? s(e2, t3) : void 0;
        }
      }
      function s(e2, t3) {
        (null == t3 || t3 > e2.length) && (t3 = e2.length);
        for (var n2 = 0, r2 = new Array(t3); n2 < t3; n2++)
          r2[n2] = e2[n2];
        return r2;
      }
      var u = function(e2) {
        return "string" == typeof e2 ? document.querySelector(e2) : e2();
      }, a = function(e2, t3) {
        var n2 = "string" == typeof e2 ? document.createElement(e2) : e2;
        for (var r2 in t3) {
          var i2 = t3[r2];
          if ("inside" === r2)
            i2.append(n2);
          else if ("dest" === r2)
            u(i2[0]).insertAdjacentElement(i2[1], n2);
          else if ("around" === r2) {
            var o2 = i2;
            o2.parentNode.insertBefore(n2, o2), n2.append(o2), null != o2.getAttribute("autofocus") && o2.focus();
          } else
            r2 in n2 ? n2[r2] = i2 : n2.setAttribute(r2, i2);
        }
        return n2;
      }, c = function(e2, t3) {
        return e2 = String(e2).toLowerCase(), t3 ? e2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") : e2;
      }, l = function(e2, n2) {
        return a("mark", t2({ innerHTML: e2 }, "string" == typeof n2 && { class: n2 })).outerHTML;
      }, f = function(e2, t3) {
        t3.input.dispatchEvent(new CustomEvent(e2, { bubbles: true, detail: t3.feedback, cancelable: true }));
      }, p = function(e2, t3, n2) {
        var r2 = n2 || {}, i2 = r2.mode, o2 = r2.diacritics, s2 = r2.highlight, u2 = c(t3, o2);
        if (t3 = String(t3), e2 = c(e2, o2), "loose" === i2) {
          var a2 = (e2 = e2.replace(/ /g, "")).length, f2 = 0, p2 = Array.from(t3).map(function(t4, n3) {
            return f2 < a2 && u2[n3] === e2[f2] && (t4 = s2 ? l(t4, s2) : t4, f2++), t4;
          }).join("");
          if (f2 === a2)
            return p2;
        } else {
          var d2 = u2.indexOf(e2);
          if (~d2)
            return e2 = t3.substring(d2, d2 + e2.length), d2 = s2 ? t3.replace(e2, l(e2, s2)) : t3;
        }
      }, d = function(e2, t3) {
        return new Promise(function(n2, r2) {
          var i2;
          return (i2 = e2.data).cache && i2.store ? n2() : new Promise(function(e3, n3) {
            return "function" == typeof i2.src ? i2.src(t3).then(e3, n3) : e3(i2.src);
          }).then(function(t4) {
            try {
              return e2.feedback = i2.store = t4, f("response", e2), n2();
            } catch (e3) {
              return r2(e3);
            }
          }, r2);
        });
      }, h = function(e2, t3) {
        var n2 = t3.data, r2 = t3.searchEngine, i2 = [];
        n2.store.forEach(function(s3, u2) {
          var a2 = function(n3) {
            var o2 = n3 ? s3[n3] : s3, u3 = "function" == typeof r2 ? r2(e2, o2) : p(e2, o2, { mode: r2, diacritics: t3.diacritics, highlight: t3.resultItem.highlight });
            if (u3) {
              var a3 = { match: u3, value: s3 };
              n3 && (a3.key = n3), i2.push(a3);
            }
          };
          if (n2.keys) {
            var c2, l2 = function(e3, t4) {
              var n3 = "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
              if (!n3) {
                if (Array.isArray(e3) || (n3 = o(e3)) || t4 && e3 && "number" == typeof e3.length) {
                  n3 && (e3 = n3);
                  var r3 = 0, i3 = function() {
                  };
                  return { s: i3, n: function() {
                    return r3 >= e3.length ? { done: true } : { done: false, value: e3[r3++] };
                  }, e: function(e4) {
                    throw e4;
                  }, f: i3 };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
              }
              var s4, u3 = true, a3 = false;
              return { s: function() {
                n3 = n3.call(e3);
              }, n: function() {
                var e4 = n3.next();
                return u3 = e4.done, e4;
              }, e: function(e4) {
                a3 = true, s4 = e4;
              }, f: function() {
                try {
                  u3 || null == n3.return || n3.return();
                } finally {
                  if (a3)
                    throw s4;
                }
              } };
            }(n2.keys);
            try {
              for (l2.s(); !(c2 = l2.n()).done; )
                a2(c2.value);
            } catch (e3) {
              l2.e(e3);
            } finally {
              l2.f();
            }
          } else
            a2();
        }), n2.filter && (i2 = n2.filter(i2));
        var s2 = i2.slice(0, t3.resultsList.maxResults);
        t3.feedback = { query: e2, matches: i2, results: s2 }, f("results", t3);
      }, m = "aria-expanded", b = "aria-activedescendant", y = "aria-selected", v = function(e2, n2) {
        e2.feedback.selection = t2({ index: n2 }, e2.feedback.results[n2]);
      }, g = function(e2) {
        e2.isOpen || ((e2.wrapper || e2.input).setAttribute(m, true), e2.list.removeAttribute("hidden"), e2.isOpen = true, f("open", e2));
      }, w = function(e2) {
        e2.isOpen && ((e2.wrapper || e2.input).setAttribute(m, false), e2.input.setAttribute(b, ""), e2.list.setAttribute("hidden", ""), e2.isOpen = false, f("close", e2));
      }, O = function(e2, t3) {
        var n2 = t3.resultItem, r2 = t3.list.getElementsByTagName(n2.tag), o2 = !!n2.selected && n2.selected.split(" ");
        if (t3.isOpen && r2.length) {
          var s2, u2, a2 = t3.cursor;
          e2 >= r2.length && (e2 = 0), e2 < 0 && (e2 = r2.length - 1), t3.cursor = e2, a2 > -1 && (r2[a2].removeAttribute(y), o2 && (u2 = r2[a2].classList).remove.apply(u2, i(o2))), r2[e2].setAttribute(y, true), o2 && (s2 = r2[e2].classList).add.apply(s2, i(o2)), t3.input.setAttribute(b, r2[t3.cursor].id), t3.list.scrollTop = r2[e2].offsetTop - t3.list.clientHeight + r2[e2].clientHeight + 5, t3.feedback.cursor = t3.cursor, v(t3, e2), f("navigate", t3);
        }
      }, A = function(e2) {
        O(e2.cursor + 1, e2);
      }, k = function(e2) {
        O(e2.cursor - 1, e2);
      }, L = function(e2, t3, n2) {
        (n2 = n2 >= 0 ? n2 : e2.cursor) < 0 || (e2.feedback.event = t3, v(e2, n2), f("selection", e2), w(e2));
      };
      function j(e2, n2) {
        var r2 = this;
        return new Promise(function(i2, o2) {
          var s2, u2;
          return s2 = n2 || ((u2 = e2.input) instanceof HTMLInputElement || u2 instanceof HTMLTextAreaElement ? u2.value : u2.innerHTML), function(e3, t3, n3) {
            return t3 ? t3(e3) : e3.length >= n3;
          }(s2 = e2.query ? e2.query(s2) : s2, e2.trigger, e2.threshold) ? d(e2, s2).then(function(n3) {
            try {
              return e2.feedback instanceof Error ? i2() : (h(s2, e2), e2.resultsList && function(e3) {
                var n4 = e3.resultsList, r3 = e3.list, i3 = e3.resultItem, o3 = e3.feedback, s3 = o3.matches, u3 = o3.results;
                if (e3.cursor = -1, r3.innerHTML = "", s3.length || n4.noResults) {
                  var c3 = new DocumentFragment();
                  u3.forEach(function(e4, n5) {
                    var r4 = a(i3.tag, t2({ id: "".concat(i3.id, "_").concat(n5), role: "option", innerHTML: e4.match, inside: c3 }, i3.class && { class: i3.class }));
                    i3.element && i3.element(r4, e4);
                  }), r3.append(c3), n4.element && n4.element(r3, o3), g(e3);
                } else
                  w(e3);
              }(e2), c2.call(r2));
            } catch (e3) {
              return o2(e3);
            }
          }, o2) : (w(e2), c2.call(r2));
          function c2() {
            return i2();
          }
        });
      }
      var S = function(e2, t3) {
        for (var n2 in e2)
          for (var r2 in e2[n2])
            t3(n2, r2);
      }, T = function(e2) {
        var n2, r2, i2, o2 = e2.events, s2 = (n2 = function() {
          return j(e2);
        }, r2 = e2.debounce, function() {
          clearTimeout(i2), i2 = setTimeout(function() {
            return n2();
          }, r2);
        }), u2 = e2.events = t2({ input: t2({}, o2 && o2.input) }, e2.resultsList && { list: o2 ? t2({}, o2.list) : {} }), a2 = { input: { input: function() {
          s2();
        }, keydown: function(t3) {
          !function(e3, t4) {
            switch (e3.keyCode) {
              case 40:
              case 38:
                e3.preventDefault(), 40 === e3.keyCode ? A(t4) : k(t4);
                break;
              case 13:
                t4.submit || e3.preventDefault(), t4.cursor >= 0 && L(t4, e3);
                break;
              case 9:
                t4.resultsList.tabSelect && t4.cursor >= 0 && L(t4, e3);
                break;
              case 27:
                t4.input.value = "", w(t4);
            }
          }(t3, e2);
        }, blur: function() {
          w(e2);
        } }, list: { mousedown: function(e3) {
          e3.preventDefault();
        }, click: function(t3) {
          !function(e3, t4) {
            var n3 = t4.resultItem.tag.toUpperCase(), r3 = Array.from(t4.list.querySelectorAll(n3)), i3 = e3.target.closest(n3);
            i3 && i3.nodeName === n3 && L(t4, e3, r3.indexOf(i3));
          }(t3, e2);
        } } };
        S(a2, function(t3, n3) {
          (e2.resultsList || "input" === n3) && (u2[t3][n3] || (u2[t3][n3] = a2[t3][n3]));
        }), S(u2, function(t3, n3) {
          e2[t3].addEventListener(n3, u2[t3][n3]);
        });
      };
      function E(e2) {
        var n2 = this;
        return new Promise(function(r2, i2) {
          var o2, s2, u2;
          if (o2 = e2.placeHolder, u2 = { role: "combobox", "aria-owns": (s2 = e2.resultsList).id, "aria-haspopup": true, "aria-expanded": false }, a(e2.input, t2(t2({ "aria-controls": s2.id, "aria-autocomplete": "both" }, o2 && { placeholder: o2 }), !e2.wrapper && t2({}, u2))), e2.wrapper && (e2.wrapper = a("div", t2({ around: e2.input, class: e2.name + "_wrapper" }, u2))), s2 && (e2.list = a(s2.tag, t2({ dest: [s2.destination, s2.position], id: s2.id, role: "listbox", hidden: "hidden" }, s2.class && { class: s2.class }))), T(e2), e2.data.cache)
            return d(e2).then(function(e3) {
              try {
                return c2.call(n2);
              } catch (e4) {
                return i2(e4);
              }
            }, i2);
          function c2() {
            return f("init", e2), r2();
          }
          return c2.call(n2);
        });
      }
      function x(e2) {
        var t3 = e2.prototype;
        t3.init = function() {
          E(this);
        }, t3.start = function(e3) {
          j(this, e3);
        }, t3.unInit = function() {
          if (this.wrapper) {
            var e3 = this.wrapper.parentNode;
            e3.insertBefore(this.input, this.wrapper), e3.removeChild(this.wrapper);
          }
          var t4;
          S((t4 = this).events, function(e4, n2) {
            t4[e4].removeEventListener(n2, t4.events[e4][n2]);
          });
        }, t3.open = function() {
          g(this);
        }, t3.close = function() {
          w(this);
        }, t3.goTo = function(e3) {
          O(e3, this);
        }, t3.next = function() {
          A(this);
        }, t3.previous = function() {
          k(this);
        }, t3.select = function(e3) {
          L(this, null, e3);
        }, t3.search = function(e3, t4, n2) {
          return p(e3, t4, n2);
        };
      }
      return function e2(t3) {
        this.options = t3, this.id = e2.instances = (e2.instances || 0) + 1, this.name = "autoComplete", this.wrapper = 1, this.threshold = 1, this.debounce = 0, this.resultsList = { position: "afterend", tag: "ul", maxResults: 5 }, this.resultItem = { tag: "li" }, function(e3) {
          var t4 = e3.name, r2 = e3.options, i2 = e3.resultsList, o2 = e3.resultItem;
          for (var s2 in r2)
            if ("object" === n(r2[s2]))
              for (var a2 in e3[s2] || (e3[s2] = {}), r2[s2])
                e3[s2][a2] = r2[s2][a2];
            else
              e3[s2] = r2[s2];
          e3.selector = e3.selector || "#" + t4, i2.destination = i2.destination || e3.selector, i2.id = i2.id || t4 + "_list_" + e3.id, o2.id = o2.id || t4 + "_result", e3.input = u(e3.selector);
        }(this), x.call(this, e2), E(this);
      };
    }, module.exports = t();
  })(autoComplete_min);
  const autoComplete = autoComplete_min.exports;
  (async function() {
    const style = document.createElement("style");
    style.innerHTML = ".autoComplete_wrapper{position:relative}.autoComplete_wrapper>input{height:3rem;width:370px;margin:0;padding:0 2rem 0 3.2rem;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;font-size:1rem;text-overflow:ellipsis;color:rgba(255,122,122,.3);outline:0;border-radius:10rem;border:.05rem solid rgba(255,122,122,.5);background-image:url(images/search.svg);background-size:1.4rem;background-position:left 1.05rem top .8rem;background-repeat:no-repeat;background-origin:border-box;background-color:#fff;transition:all .4s ease;-webkit-transition:all -webkit-transform .4s ease}.autoComplete_wrapper>input::placeholder{color:rgba(255,122,122,.5);transition:all .3s ease;-webkit-transition:all -webkit-transform .3s ease}.autoComplete_wrapper>input:hover::placeholder{color:rgba(255,122,122,.6);transition:all .3s ease;-webkit-transition:all -webkit-transform .3s ease}.autoComplete_wrapper>input:focus::placeholder{padding:.1rem .6rem;font-size:.95rem;color:rgba(255,122,122,.4)}.autoComplete_wrapper>input:focus::selection{background-color:rgba(255,122,122,.15)}.autoComplete_wrapper>input::selection{background-color:rgba(255,122,122,.15)}.autoComplete_wrapper>input:hover{color:rgba(255,122,122,.8);transition:all .3s ease;-webkit-transition:all -webkit-transform .3s ease}.autoComplete_wrapper>input:focus{color:rgba(255,122,122,1);border:.06rem solid rgba(255,122,122,.8)}.autoComplete_wrapper>ul{overflow-y:scroll;position:absolute;max-height:400px;box-sizing:border-box;left:0;margin:.5rem 0 0 0;padding:0;z-index:1000;list-style:none;border-radius:.6rem;background-color:#fff;border:1px solid rgba(33,33,33,.07);box-shadow:0 3px 6px rgba(149,157,165,.15);outline:0;transition:opacity .15s ease-in-out;-moz-transition:opacity .15s ease-in-out;-webkit-transition:opacity .15s ease-in-out}.autoComplete_wrapper>ul::-webkit-scrollbar{width:10px;height:10px;transition:1s}.autoComplete_wrapper>ul::-webkit-scrollbar-thumb{background-color:rgba(127,127,127,.6);background-clip:padding-box;border:2px solid transparent;border-radius:.6rem;transition:1s}.autoComplete_wrapper>ul::-webkit-scrollbar-thumb:horizontal:hover,.autoComplete_wrapper>ul::-webkit-scrollbar-thumb:vertical:hover{background-color:#6e6e6e;transition:.3s}.autoComplete_wrapper>ul:empty,.autoComplete_wrapper>ul[hidden]{display:block;opacity:0;transform:scale(0)}.autoComplete_wrapper>ul>li{margin:.3rem;padding:.3rem .5rem;text-align:left;font-size:1rem;color:#212121;border-radius:.35rem;background-color:rgba(255,255,255,1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .2s ease}.autoComplete_wrapper>ul>li mark{background-color:transparent;color:#ff1e00;font-weight:700}.autoComplete_wrapper>ul>li:hover{cursor:pointer;background-color:rgba(255,122,122,.15)}.autoComplete_wrapper>ul>li[aria-selected=true]{background-color:rgba(255,122,122,.15)}@media only screen and (max-width:600px){.autoComplete_wrapper>input{width:18rem}}";
    console.time("startup time");
    let useUesrscript = false;
    let debounce = 250;
    let availableSite;
    let korTags = [];
    let danbooruTags = [];
    if (typeof GM_fetch === "function") {
      let serverCheck = function(site) {
        return GM_fetch(site).then((res) => {
          if (site.includes("danbooru"))
            serverStatus += 1;
          if (site.includes("hijiribe"))
            serverStatus += 2;
          if (site.includes("sonohara"))
            serverStatus += 4;
        }).catch((err) => console.log(`${site} \uC2E4\uD328`));
      };
      console.log("\uC720\uC800\uC2A4\uD06C\uB9BD\uD2B8 \uC0AC\uC6A9");
      useUesrscript = true;
      debounce = 100;
      const siteList = {
        danbooru: "https://danbooru.donmai.us/autocomplete.json",
        hijiribe: "https://hijiribe.donmai.us/autocomplete.json",
        sonohara: "https://sonohara.donmai.us/autocomplete.json"
      };
      let serverStatus = 0;
      const promises = Object.values(siteList).map((site) => {
        return serverCheck(site);
      });
      await Promise.allSettled(promises).then(() => {
        console.log(`\uC11C\uBC84 \uD655\uC778 \uC644\uB8CC: ${serverStatus}`);
      }).catch((err) => {
        console.log(err);
      });
      switch (serverStatus) {
        case 7:
        case 5:
        case 3:
        case 1:
          availableSite = siteList.danbooru;
          console.log("\uB2E8\uBD80\uB8E8 \uC120\uD0DD");
          break;
        case 6:
        case 2:
          availableSite = siteList.hijiribe;
          console.log("\uD788\uC9C0\uB9AC\uBCA0 \uC120\uD0DD");
          break;
        case 4:
          availableSite = siteList.sonohara;
          console.log("\uC18C\uB178\uD558\uB77C \uC120\uD0DD");
          break;
        case 0:
          Swal.fire({
            width: "40rem",
            title: "\uC790\uB3D9\uC644\uC131 API \uC5F0\uACB0 \uC624\uB958",
            html: `
          <p>\uC544\uB798 3\uAC1C\uC758 \uC0AC\uC774\uD2B8\uC5D0 \uC811\uC18D\uD558\uC5EC </br>\uBD07 \uAC80\uC0AC\uB97C \uD1B5\uACFC\uD55C \uD6C4 \uC0AC\uC774\uD2B8\uAC00 \uD45C\uC2DC\uB418\uB294\uC9C0 \uD655\uC778 \uBC14\uB78D\uB2C8\uB2E4.</p>
          <p><b>\uD55C \uAC1C\uC758 \uC0AC\uC774\uD2B8</b>\uB77C\uB3C4 \uC815\uC0C1\uC801\uC73C\uB85C \uD45C\uC2DC\uB41C\uB2E4\uBA74 \uC0C8\uB85C\uACE0\uCE68\uC744 \uD55C\uBC88 \uD558\uC138\uC694.</p>
          <p>\uC0AC\uC774\uD2B8\uAC00 \uC815\uC0C1\uC801\uC73C\uB85C \uD45C\uC2DC\uB418\uB294\uB370 \uC774 \uCC3D\uC774 \uBCF4\uC774\uBA74 \uB313\uAE00\uB85C \uC54C\uB824\uC8FC\uC138\uC694.</p>
            <a href="//danbooru.donmai.us" target='_blank'>danbooru</a></></br>
            <a href="//hijiribe.donmai.us" target='_blank'>hijiribe</a></br>
            <a href="//sonohara.donmai.us" target='_blank'>sonohara</a></br>
            `
          });
      }
    } else {
      console.log("WebUI\uC5D0 \uC124\uCE58\uB428");
      fetch(
        "https://raw.githubusercontent.com/DominikDoom/a1111-sd-webui-tagcomplete/main/tags/danbooru.csv"
      ).then((res) => res.text()).then((result) => {
        danbooruTags = csvToArray(result);
      }).catch((err) => console.log(err));
    }
    fetch(
      "https://gist.githubusercontent.com/Soochaehwa/1951b95690e810085b920e39ef73354a/raw/tags.txt"
    ).then((res) => res.json()).then((result) => korTags = result).catch((err) => console.log(err));
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source)
        ) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          );
        });
      }
      return target;
    }
    function create(tag, options) {
      var el = typeof tag === "string" ? document.createElement(tag) : tag;
      for (var key in options) {
        var val = options[key];
        if (key === "inside") {
          val.append(el);
        } else if (key === "dest") {
          select$1(val[0]).insertAdjacentElement(val[1], el);
        } else if (key === "around") {
          var ref = val;
          ref.parentNode.insertBefore(el, ref);
          el.append(ref);
          if (ref.getAttribute("autofocus") != null)
            ref.focus();
        } else if (key in el) {
          el[key] = val;
        } else {
          el.setAttribute(key, val);
        }
      }
      return el;
    }
    function mark(value, cls) {
      return create(
        "mark",
        _objectSpread2(
          {
            innerHTML: value
          },
          typeof cls === "string" && {
            class: cls
          }
        )
      ).outerHTML;
    }
    function csvToArray(csv) {
      const rows = csv.split("\n");
      return rows.map(function(row) {
        return row.replaceAll("_", " ").split(",").shift();
      });
    }
    function intToString(count) {
      return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1
      }).format(count);
    }
    function attach(el) {
      const autoCompleteJS = new autoComplete({
        selector: () => {
          return el;
        },
        searchEngine: (query, record) => {
          record = String(record);
          if (query.startsWith("#")) {
            query = query.replace(/ /g, "");
            var qLength = query.length;
            var cursor = 0;
            var match = Array.from(record).map(function(character, index) {
              if (cursor < qLength && record[index] === query[cursor]) {
                character = mark(character, true);
                cursor++;
              }
              return character;
            }).join("");
            if (cursor === qLength)
              return match;
          } else {
            var _match = record.indexOf(query);
            if (~_match) {
              query = record.substring(_match, _match + query.length);
              _match = record.replace(query, mark(query, true));
              return _match;
            }
          }
        },
        debounce,
        data: {
          src: async (query) => {
            try {
              let data = [];
              let source;
              if (!query.startsWith("#")) {
                if (useUesrscript) {
                  source = await GM_fetch(
                    `${availableSite}?search%5Bquery%5D=${query}&search%5Btype%5D=tag_query&version=1&limit=10`
                  );
                } else {
                  return danbooruTags;
                }
                const tagsObj = await source.json();
                data = tagsObj.map((el2) => {
                  if (el2.antecedent)
                    return `${el2.antecedent.replaceAll("_", " ")} \u2192 ${el2.label} [${intToString(el2.post_count)}]`;
                  return `${el2.label} [${intToString(el2.post_count)}]`;
                });
                return data;
              } else {
                return korTags;
              }
            } catch (error) {
              return error;
            }
          }
        },
        resultsList: {
          maxResults: 15
        },
        query: (query) => {
          const querySplit = query.split(",");
          const lastQuery = querySplit.length - 1;
          const newQuery = querySplit[lastQuery].trim();
          return newQuery;
        },
        events: {
          input: {
            selection(event) {
              if (!autoCompleteJS.isOpen)
                return;
              const feedback = event.detail;
              const input = autoCompleteJS.input;
              const selection = feedback.selection.value.trim().replace(/\s*\[\d*.?\d*K?M?\]/gm, "").replace(/.*→\s*/gm, "").replaceAll("(", "\\(").replaceAll(")", "\\)");
              const query = input.value.split(",").map((item) => item.replace(/(^ *| *$)/gm, ""));
              let newline = "";
              const lastQuery = query[query.length - 1];
              if (query.length > 1 && lastQuery.includes("\n")) {
                const temp = lastQuery.replace(/\n/gm, "");
                newline = lastQuery.replace(temp, "");
              }
              query.pop();
              query.push(`${newline}${selection}`);
              input.value = query.join(", ") + ", ";
            },
            keydown: (event) => {
              switch (event.keyCode) {
                case 40:
                case 38:
                  if (!autoCompleteJS.isOpen)
                    return;
                  event.preventDefault();
                  event.keyCode === 40 ? autoCompleteJS.next() : autoCompleteJS.previous();
                  break;
                case 13:
                  if (!autoCompleteJS.isOpen)
                    return;
                  if (!autoCompleteJS.submit)
                    event.preventDefault();
                  if (autoCompleteJS.cursor >= 0)
                    autoCompleteJS.select(event);
                  break;
                case 27:
                  autoCompleteJS.close();
                  break;
              }
            }
          }
        }
      });
    }
    onUiUpdate(function() {
      const t2i = gradioApp().querySelector("#txt2img_prompt > label > textarea");
      if (!t2i)
        return;
      const i2i = gradioApp().querySelector("#img2img_prompt > label > textarea");
      if (!i2i)
        return;
      const negative = gradioApp().querySelectorAll(
        "#negative_prompt > label > textarea"
      );
      if (!negative)
        return;
      gradioApp().appendChild(style);
      attach(t2i);
      attach(i2i);
      negative.forEach((el) => {
        attach(el);
      });
      console.log("end");
      console.timeEnd("startup time");
    });
  })();
})();
