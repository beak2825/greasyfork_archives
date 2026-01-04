// ==UserScript==
// @name         在浙学助手
// @namespace    http://tampermonkey.net/
// @homepage     https://pages.zaizhexue.top/
// @version      2.1.3
// @description  完全免费的在浙学脚本，支持答案显示，自动挂课，粘贴限制解除 官网：https://pages.zaizhexue.top/
// @author       Miaoz
// @match        *://www.zjooc.cn/*
// @match        *://www.zjlll.cn/*
// @icon         https://cdn.zerror.cc/images/%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%9B%BE%E6%A0%87.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520141/%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520141/%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(() => {
  var __webpack_modules__ = {
    "./src/utils/matter.min.js": function(module, __unused_webpack_exports, __webpack_require__) {
      /*!
 * matter-js 0.18.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 */
      module.exports = function(e) {
        var t = {};
        function n(i) {
          if (t[i]) return t[i].exports;
          var o = t[i] = {
            i: i,
            l: !1,
            exports: {}
          };
          return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
        }
        return n.m = e, n.c = t, n.d = function(e, t, i) {
          n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
          });
        }, n.r = function(e) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(e, "__esModule", {
            value: !0
          });
        }, n.t = function(e, t) {
          if (1 & t && (e = n(e)), 8 & t) return e;
          if (4 & t && "object" == typeof e && e && e.__esModule) return e;
          var i = Object.create(null);
          if (n.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
          }), 2 & t && "string" != typeof e) for (var o in e) n.d(i, o, function(t) {
            return e[t];
          }.bind(null, o));
          return i;
        }, n.n = function(e) {
          var t = e && e.__esModule ? function() {
            return e.default;
          } : function() {
            return e;
          };
          return n.d(t, "a", t), t;
        }, n.o = function(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, n.p = "", n(n.s = 21);
      }([ function(e, t) {
        var n = {};
        e.exports = n, function() {
          n._nextId = 0, n._seed = 0, n._nowStartTime = +new Date, n._warnedOnce = {}, n._decomp = null, 
          n.extend = function(e, t) {
            var i, o;
            "boolean" == typeof t ? (i = 2, o = t) : (i = 1, o = !0);
            for (var r = i; r < arguments.length; r++) {
              var a = arguments[r];
              if (a) for (var s in a) o && a[s] && a[s].constructor === Object ? e[s] && e[s].constructor !== Object ? e[s] = a[s] : (e[s] = e[s] || {}, 
              n.extend(e[s], o, a[s])) : e[s] = a[s];
            }
            return e;
          }, n.clone = function(e, t) {
            return n.extend({}, t, e);
          }, n.keys = function(e) {
            if (Object.keys) return Object.keys(e);
            var t = [];
            for (var n in e) t.push(n);
            return t;
          }, n.values = function(e) {
            var t = [];
            if (Object.keys) {
              for (var n = Object.keys(e), i = 0; i < n.length; i++) t.push(e[n[i]]);
              return t;
            }
            for (var o in e) t.push(e[o]);
            return t;
          }, n.get = function(e, t, n, i) {
            t = t.split(".").slice(n, i);
            for (var o = 0; o < t.length; o += 1) e = e[t[o]];
            return e;
          }, n.set = function(e, t, i, o, r) {
            var a = t.split(".").slice(o, r);
            return n.get(e, t, 0, -1)[a[a.length - 1]] = i, i;
          }, n.shuffle = function(e) {
            for (var t = e.length - 1; t > 0; t--) {
              var i = Math.floor(n.random() * (t + 1)), o = e[t];
              e[t] = e[i], e[i] = o;
            }
            return e;
          }, n.choose = function(e) {
            return e[Math.floor(n.random() * e.length)];
          }, n.isElement = function(e) {
            return "undefined" != typeof HTMLElement ? e instanceof HTMLElement : !!(e && e.nodeType && e.nodeName);
          }, n.isArray = function(e) {
            return "[object Array]" === Object.prototype.toString.call(e);
          }, n.isFunction = function(e) {
            return "function" == typeof e;
          }, n.isPlainObject = function(e) {
            return "object" == typeof e && e.constructor === Object;
          }, n.isString = function(e) {
            return "[object String]" === toString.call(e);
          }, n.clamp = function(e, t, n) {
            return e < t ? t : e > n ? n : e;
          }, n.sign = function(e) {
            return e < 0 ? -1 : 1;
          }, n.now = function() {
            if ("undefined" != typeof window && window.performance) {
              if (window.performance.now) return window.performance.now();
              if (window.performance.webkitNow) return window.performance.webkitNow();
            }
            return Date.now ? Date.now() : new Date - n._nowStartTime;
          }, n.random = function(t, n) {
            return n = void 0 !== n ? n : 1, (t = void 0 !== t ? t : 0) + e() * (n - t);
          };
          var e = function() {
            return n._seed = (9301 * n._seed + 49297) % 233280, n._seed / 233280;
          };
          n.colorToNumber = function(e) {
            return 3 == (e = e.replace("#", "")).length && (e = e.charAt(0) + e.charAt(0) + e.charAt(1) + e.charAt(1) + e.charAt(2) + e.charAt(2)), 
            parseInt(e, 16);
          }, n.logLevel = 1, n.log = function() {
            console && n.logLevel > 0 && n.logLevel <= 3 && console.log.apply(console, [ "matter-js:" ].concat(Array.prototype.slice.call(arguments)));
          }, n.info = function() {
            console && n.logLevel > 0 && n.logLevel <= 2 && console.info.apply(console, [ "matter-js:" ].concat(Array.prototype.slice.call(arguments)));
          }, n.warn = function() {
            console && n.logLevel > 0 && n.logLevel <= 3 && console.warn.apply(console, [ "matter-js:" ].concat(Array.prototype.slice.call(arguments)));
          }, n.warnOnce = function() {
            var e = Array.prototype.slice.call(arguments).join(" ");
            n._warnedOnce[e] || (n.warn(e), n._warnedOnce[e] = !0);
          }, n.deprecated = function(e, t, i) {
            e[t] = n.chain((function() {
              n.warnOnce("🔅 deprecated 🔅", i);
            }), e[t]);
          }, n.nextId = function() {
            return n._nextId++;
          }, n.indexOf = function(e, t) {
            if (e.indexOf) return e.indexOf(t);
            for (var n = 0; n < e.length; n++) if (e[n] === t) return n;
            return -1;
          }, n.map = function(e, t) {
            if (e.map) return e.map(t);
            for (var n = [], i = 0; i < e.length; i += 1) n.push(t(e[i]));
            return n;
          }, n.topologicalSort = function(e) {
            var t = [], i = [], o = [];
            for (var r in e) i[r] || o[r] || n._topologicalSort(r, i, o, e, t);
            return t;
          }, n._topologicalSort = function(e, t, i, o, r) {
            var a = o[e] || [];
            i[e] = !0;
            for (var s = 0; s < a.length; s += 1) {
              var l = a[s];
              i[l] || t[l] || n._topologicalSort(l, t, i, o, r);
            }
            i[e] = !1, t[e] = !0, r.push(e);
          }, n.chain = function() {
            for (var e = [], t = 0; t < arguments.length; t += 1) {
              var n = arguments[t];
              n._chained ? e.push.apply(e, n._chained) : e.push(n);
            }
            var i = function() {
              for (var t, n = new Array(arguments.length), i = 0, o = arguments.length; i < o; i++) n[i] = arguments[i];
              for (i = 0; i < e.length; i += 1) {
                var r = e[i].apply(t, n);
                void 0 !== r && (t = r);
              }
              return t;
            };
            return i._chained = e, i;
          }, n.chainPathBefore = function(e, t, i) {
            return n.set(e, t, n.chain(i, n.get(e, t)));
          }, n.chainPathAfter = function(e, t, i) {
            return n.set(e, t, n.chain(n.get(e, t), i));
          }, n.setDecomp = function(e) {
            n._decomp = e;
          }, n.getDecomp = function() {
            var e = n._decomp;
            try {
              e || "undefined" == typeof window || (e = window.decomp), e || void 0 === __webpack_require__.g || (e = __webpack_require__.g.decomp);
            } catch (t) {
              e = null;
            }
            return e;
          };
        }();
      }, function(e, t) {
        var n = {};
        e.exports = n, n.create = function(e) {
          var t = {
            min: {
              x: 0,
              y: 0
            },
            max: {
              x: 0,
              y: 0
            }
          };
          return e && n.update(t, e), t;
        }, n.update = function(e, t, n) {
          e.min.x = 1 / 0, e.max.x = -1 / 0, e.min.y = 1 / 0, e.max.y = -1 / 0;
          for (var i = 0; i < t.length; i++) {
            var o = t[i];
            o.x > e.max.x && (e.max.x = o.x), o.x < e.min.x && (e.min.x = o.x), o.y > e.max.y && (e.max.y = o.y), 
            o.y < e.min.y && (e.min.y = o.y);
          }
          n && (n.x > 0 ? e.max.x += n.x : e.min.x += n.x, n.y > 0 ? e.max.y += n.y : e.min.y += n.y);
        }, n.contains = function(e, t) {
          return t.x >= e.min.x && t.x <= e.max.x && t.y >= e.min.y && t.y <= e.max.y;
        }, n.overlaps = function(e, t) {
          return e.min.x <= t.max.x && e.max.x >= t.min.x && e.max.y >= t.min.y && e.min.y <= t.max.y;
        }, n.translate = function(e, t) {
          e.min.x += t.x, e.max.x += t.x, e.min.y += t.y, e.max.y += t.y;
        }, n.shift = function(e, t) {
          var n = e.max.x - e.min.x, i = e.max.y - e.min.y;
          e.min.x = t.x, e.max.x = t.x + n, e.min.y = t.y, e.max.y = t.y + i;
        };
      }, function(e, t) {
        var n = {};
        e.exports = n, n.create = function(e, t) {
          return {
            x: e || 0,
            y: t || 0
          };
        }, n.clone = function(e) {
          return {
            x: e.x,
            y: e.y
          };
        }, n.magnitude = function(e) {
          return Math.sqrt(e.x * e.x + e.y * e.y);
        }, n.magnitudeSquared = function(e) {
          return e.x * e.x + e.y * e.y;
        }, n.rotate = function(e, t, n) {
          var i = Math.cos(t), o = Math.sin(t);
          n || (n = {});
          var r = e.x * i - e.y * o;
          return n.y = e.x * o + e.y * i, n.x = r, n;
        }, n.rotateAbout = function(e, t, n, i) {
          var o = Math.cos(t), r = Math.sin(t);
          i || (i = {});
          var a = n.x + ((e.x - n.x) * o - (e.y - n.y) * r);
          return i.y = n.y + ((e.x - n.x) * r + (e.y - n.y) * o), i.x = a, i;
        }, n.normalise = function(e) {
          var t = n.magnitude(e);
          return 0 === t ? {
            x: 0,
            y: 0
          } : {
            x: e.x / t,
            y: e.y / t
          };
        }, n.dot = function(e, t) {
          return e.x * t.x + e.y * t.y;
        }, n.cross = function(e, t) {
          return e.x * t.y - e.y * t.x;
        }, n.cross3 = function(e, t, n) {
          return (t.x - e.x) * (n.y - e.y) - (t.y - e.y) * (n.x - e.x);
        }, n.add = function(e, t, n) {
          return n || (n = {}), n.x = e.x + t.x, n.y = e.y + t.y, n;
        }, n.sub = function(e, t, n) {
          return n || (n = {}), n.x = e.x - t.x, n.y = e.y - t.y, n;
        }, n.mult = function(e, t) {
          return {
            x: e.x * t,
            y: e.y * t
          };
        }, n.div = function(e, t) {
          return {
            x: e.x / t,
            y: e.y / t
          };
        }, n.perp = function(e, t) {
          return {
            x: (t = !0 === t ? -1 : 1) * -e.y,
            y: t * e.x
          };
        }, n.neg = function(e) {
          return {
            x: -e.x,
            y: -e.y
          };
        }, n.angle = function(e, t) {
          return Math.atan2(t.y - e.y, t.x - e.x);
        }, n._temp = [ n.create(), n.create(), n.create(), n.create(), n.create(), n.create() ];
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(2), r = n(0);
        i.create = function(e, t) {
          for (var n = [], i = 0; i < e.length; i++) {
            var o = e[i], r = {
              x: o.x,
              y: o.y,
              index: i,
              body: t,
              isInternal: !1
            };
            n.push(r);
          }
          return n;
        }, i.fromPath = function(e, t) {
          var n = [];
          return e.replace(/L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi, (function(e, t, i) {
            n.push({
              x: parseFloat(t),
              y: parseFloat(i)
            });
          })), i.create(n, t);
        }, i.centre = function(e) {
          for (var t, n, r, a = i.area(e, !0), s = {
            x: 0,
            y: 0
          }, l = 0; l < e.length; l++) r = (l + 1) % e.length, t = o.cross(e[l], e[r]), n = o.mult(o.add(e[l], e[r]), t), 
          s = o.add(s, n);
          return o.div(s, 6 * a);
        }, i.mean = function(e) {
          for (var t = {
            x: 0,
            y: 0
          }, n = 0; n < e.length; n++) t.x += e[n].x, t.y += e[n].y;
          return o.div(t, e.length);
        }, i.area = function(e, t) {
          for (var n = 0, i = e.length - 1, o = 0; o < e.length; o++) n += (e[i].x - e[o].x) * (e[i].y + e[o].y), 
          i = o;
          return t ? n / 2 : Math.abs(n) / 2;
        }, i.inertia = function(e, t) {
          for (var n, i, r = 0, a = 0, s = e, l = 0; l < s.length; l++) i = (l + 1) % s.length, 
          r += (n = Math.abs(o.cross(s[i], s[l]))) * (o.dot(s[i], s[i]) + o.dot(s[i], s[l]) + o.dot(s[l], s[l])), 
          a += n;
          return t / 6 * (r / a);
        }, i.translate = function(e, t, n) {
          n = void 0 !== n ? n : 1;
          var i, o = e.length, r = t.x * n, a = t.y * n;
          for (i = 0; i < o; i++) e[i].x += r, e[i].y += a;
          return e;
        }, i.rotate = function(e, t, n) {
          if (0 !== t) {
            var i, o, r, a, s = Math.cos(t), l = Math.sin(t), c = n.x, u = n.y, d = e.length;
            for (a = 0; a < d; a++) o = (i = e[a]).x - c, r = i.y - u, i.x = c + (o * s - r * l), 
            i.y = u + (o * l + r * s);
            return e;
          }
        }, i.contains = function(e, t) {
          for (var n, i = t.x, o = t.y, r = e.length, a = e[r - 1], s = 0; s < r; s++) {
            if (n = e[s], (i - a.x) * (n.y - a.y) + (o - a.y) * (a.x - n.x) > 0) return !1;
            a = n;
          }
          return !0;
        }, i.scale = function(e, t, n, r) {
          if (1 === t && 1 === n) return e;
          var a, s;
          r = r || i.centre(e);
          for (var l = 0; l < e.length; l++) a = e[l], s = o.sub(a, r), e[l].x = r.x + s.x * t, 
          e[l].y = r.y + s.y * n;
          return e;
        }, i.chamfer = function(e, t, n, i, a) {
          t = "number" == typeof t ? [ t ] : t || [ 8 ], n = void 0 !== n ? n : -1, i = i || 2, 
          a = a || 14;
          for (var s = [], l = 0; l < e.length; l++) {
            var c = e[l - 1 >= 0 ? l - 1 : e.length - 1], u = e[l], d = e[(l + 1) % e.length], p = t[l < t.length ? l : t.length - 1];
            if (0 !== p) {
              var f = o.normalise({
                x: u.y - c.y,
                y: c.x - u.x
              }), v = o.normalise({
                x: d.y - u.y,
                y: u.x - d.x
              }), y = Math.sqrt(2 * Math.pow(p, 2)), m = o.mult(r.clone(f), p), g = o.normalise(o.mult(o.add(f, v), .5)), x = o.sub(u, o.mult(g, y)), h = n;
              -1 === n && (h = 1.75 * Math.pow(p, .32)), (h = r.clamp(h, i, a)) % 2 == 1 && (h += 1);
              for (var b = Math.acos(o.dot(f, v)) / h, S = 0; S < h; S++) s.push(o.add(o.rotate(m, b * S), x));
            } else s.push(u);
          }
          return s;
        }, i.clockwiseSort = function(e) {
          var t = i.mean(e);
          return e.sort((function(e, n) {
            return o.angle(t, e) - o.angle(t, n);
          })), e;
        }, i.isConvex = function(e) {
          var t, n, i, o, r = 0, a = e.length;
          if (a < 3) return null;
          for (t = 0; t < a; t++) if (i = (t + 2) % a, o = (e[n = (t + 1) % a].x - e[t].x) * (e[i].y - e[n].y), 
          (o -= (e[n].y - e[t].y) * (e[i].x - e[n].x)) < 0 ? r |= 1 : o > 0 && (r |= 2), 3 === r) return !1;
          return 0 !== r || null;
        }, i.hull = function(e) {
          var t, n, i = [], r = [];
          for ((e = e.slice(0)).sort((function(e, t) {
            var n = e.x - t.x;
            return 0 !== n ? n : e.y - t.y;
          })), n = 0; n < e.length; n += 1) {
            for (t = e[n]; r.length >= 2 && o.cross3(r[r.length - 2], r[r.length - 1], t) <= 0; ) r.pop();
            r.push(t);
          }
          for (n = e.length - 1; n >= 0; n -= 1) {
            for (t = e[n]; i.length >= 2 && o.cross3(i[i.length - 2], i[i.length - 1], t) <= 0; ) i.pop();
            i.push(t);
          }
          return i.pop(), r.pop(), i.concat(r);
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(0);
        i.on = function(e, t, n) {
          for (var i, o = t.split(" "), r = 0; r < o.length; r++) i = o[r], e.events = e.events || {}, 
          e.events[i] = e.events[i] || [], e.events[i].push(n);
          return n;
        }, i.off = function(e, t, n) {
          if (t) {
            "function" == typeof t && (n = t, t = o.keys(e.events).join(" "));
            for (var i = t.split(" "), r = 0; r < i.length; r++) {
              var a = e.events[i[r]], s = [];
              if (n && a) for (var l = 0; l < a.length; l++) a[l] !== n && s.push(a[l]);
              e.events[i[r]] = s;
            }
          } else e.events = {};
        }, i.trigger = function(e, t, n) {
          var i, r, a, s, l = e.events;
          if (l && o.keys(l).length > 0) {
            n || (n = {}), i = t.split(" ");
            for (var c = 0; c < i.length; c++) if (a = l[r = i[c]]) {
              (s = o.clone(n, !1)).name = r, s.source = e;
              for (var u = 0; u < a.length; u++) a[u].apply(e, [ s ]);
            }
          }
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(4), r = n(0), a = n(1), s = n(6);
        i.create = function(e) {
          return r.extend({
            id: r.nextId(),
            type: "composite",
            parent: null,
            isModified: !1,
            bodies: [],
            constraints: [],
            composites: [],
            label: "Composite",
            plugin: {},
            cache: {
              allBodies: null,
              allConstraints: null,
              allComposites: null
            }
          }, e);
        }, i.setModified = function(e, t, n, o) {
          if (e.isModified = t, t && e.cache && (e.cache.allBodies = null, e.cache.allConstraints = null, 
          e.cache.allComposites = null), n && e.parent && i.setModified(e.parent, t, n, o), 
          o) for (var r = 0; r < e.composites.length; r++) {
            var a = e.composites[r];
            i.setModified(a, t, n, o);
          }
        }, i.add = function(e, t) {
          var n = [].concat(t);
          o.trigger(e, "beforeAdd", {
            object: t
          });
          for (var a = 0; a < n.length; a++) {
            var s = n[a];
            switch (s.type) {
             case "body":
              if (s.parent !== s) {
                r.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                break;
              }
              i.addBody(e, s);
              break;

             case "constraint":
              i.addConstraint(e, s);
              break;

             case "composite":
              i.addComposite(e, s);
              break;

             case "mouseConstraint":
              i.addConstraint(e, s.constraint);
            }
          }
          return o.trigger(e, "afterAdd", {
            object: t
          }), e;
        }, i.remove = function(e, t, n) {
          var r = [].concat(t);
          o.trigger(e, "beforeRemove", {
            object: t
          });
          for (var a = 0; a < r.length; a++) {
            var s = r[a];
            switch (s.type) {
             case "body":
              i.removeBody(e, s, n);
              break;

             case "constraint":
              i.removeConstraint(e, s, n);
              break;

             case "composite":
              i.removeComposite(e, s, n);
              break;

             case "mouseConstraint":
              i.removeConstraint(e, s.constraint);
            }
          }
          return o.trigger(e, "afterRemove", {
            object: t
          }), e;
        }, i.addComposite = function(e, t) {
          return e.composites.push(t), t.parent = e, i.setModified(e, !0, !0, !1), e;
        }, i.removeComposite = function(e, t, n) {
          var o = r.indexOf(e.composites, t);
          if (-1 !== o && i.removeCompositeAt(e, o), n) for (var a = 0; a < e.composites.length; a++) i.removeComposite(e.composites[a], t, !0);
          return e;
        }, i.removeCompositeAt = function(e, t) {
          return e.composites.splice(t, 1), i.setModified(e, !0, !0, !1), e;
        }, i.addBody = function(e, t) {
          return e.bodies.push(t), i.setModified(e, !0, !0, !1), e;
        }, i.removeBody = function(e, t, n) {
          var o = r.indexOf(e.bodies, t);
          if (-1 !== o && i.removeBodyAt(e, o), n) for (var a = 0; a < e.composites.length; a++) i.removeBody(e.composites[a], t, !0);
          return e;
        }, i.removeBodyAt = function(e, t) {
          return e.bodies.splice(t, 1), i.setModified(e, !0, !0, !1), e;
        }, i.addConstraint = function(e, t) {
          return e.constraints.push(t), i.setModified(e, !0, !0, !1), e;
        }, i.removeConstraint = function(e, t, n) {
          var o = r.indexOf(e.constraints, t);
          if (-1 !== o && i.removeConstraintAt(e, o), n) for (var a = 0; a < e.composites.length; a++) i.removeConstraint(e.composites[a], t, !0);
          return e;
        }, i.removeConstraintAt = function(e, t) {
          return e.constraints.splice(t, 1), i.setModified(e, !0, !0, !1), e;
        }, i.clear = function(e, t, n) {
          if (n) for (var o = 0; o < e.composites.length; o++) i.clear(e.composites[o], t, !0);
          return t ? e.bodies = e.bodies.filter((function(e) {
            return e.isStatic;
          })) : e.bodies.length = 0, e.constraints.length = 0, e.composites.length = 0, i.setModified(e, !0, !0, !1), 
          e;
        }, i.allBodies = function(e) {
          if (e.cache && e.cache.allBodies) return e.cache.allBodies;
          for (var t = [].concat(e.bodies), n = 0; n < e.composites.length; n++) t = t.concat(i.allBodies(e.composites[n]));
          return e.cache && (e.cache.allBodies = t), t;
        }, i.allConstraints = function(e) {
          if (e.cache && e.cache.allConstraints) return e.cache.allConstraints;
          for (var t = [].concat(e.constraints), n = 0; n < e.composites.length; n++) t = t.concat(i.allConstraints(e.composites[n]));
          return e.cache && (e.cache.allConstraints = t), t;
        }, i.allComposites = function(e) {
          if (e.cache && e.cache.allComposites) return e.cache.allComposites;
          for (var t = [].concat(e.composites), n = 0; n < e.composites.length; n++) t = t.concat(i.allComposites(e.composites[n]));
          return e.cache && (e.cache.allComposites = t), t;
        }, i.get = function(e, t, n) {
          var o, r;
          switch (n) {
           case "body":
            o = i.allBodies(e);
            break;

           case "constraint":
            o = i.allConstraints(e);
            break;

           case "composite":
            o = i.allComposites(e).concat(e);
          }
          return o ? 0 === (r = o.filter((function(e) {
            return e.id.toString() === t.toString();
          }))).length ? null : r[0] : null;
        }, i.move = function(e, t, n) {
          return i.remove(e, t), i.add(n, t), e;
        }, i.rebase = function(e) {
          for (var t = i.allBodies(e).concat(i.allConstraints(e)).concat(i.allComposites(e)), n = 0; n < t.length; n++) t[n].id = r.nextId();
          return e;
        }, i.translate = function(e, t, n) {
          for (var o = n ? i.allBodies(e) : e.bodies, r = 0; r < o.length; r++) s.translate(o[r], t);
          return e;
        }, i.rotate = function(e, t, n, o) {
          for (var r = Math.cos(t), a = Math.sin(t), l = o ? i.allBodies(e) : e.bodies, c = 0; c < l.length; c++) {
            var u = l[c], d = u.position.x - n.x, p = u.position.y - n.y;
            s.setPosition(u, {
              x: n.x + (d * r - p * a),
              y: n.y + (d * a + p * r)
            }), s.rotate(u, t);
          }
          return e;
        }, i.scale = function(e, t, n, o, r) {
          for (var a = r ? i.allBodies(e) : e.bodies, l = 0; l < a.length; l++) {
            var c = a[l], u = c.position.x - o.x, d = c.position.y - o.y;
            s.setPosition(c, {
              x: o.x + u * t,
              y: o.y + d * n
            }), s.scale(c, t, n);
          }
          return e;
        }, i.bounds = function(e) {
          for (var t = i.allBodies(e), n = [], o = 0; o < t.length; o += 1) {
            var r = t[o];
            n.push(r.bounds.min, r.bounds.max);
          }
          return a.create(n);
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(3), r = n(2), a = n(7), s = (n(16), n(0)), l = n(1), c = n(11);
        !function() {
          i._inertiaScale = 4, i._nextCollidingGroupId = 1, i._nextNonCollidingGroupId = -1, 
          i._nextCategory = 1, i.create = function(t) {
            var n = {
              id: s.nextId(),
              type: "body",
              label: "Body",
              parts: [],
              plugin: {},
              angle: 0,
              vertices: o.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
              position: {
                x: 0,
                y: 0
              },
              force: {
                x: 0,
                y: 0
              },
              torque: 0,
              positionImpulse: {
                x: 0,
                y: 0
              },
              constraintImpulse: {
                x: 0,
                y: 0,
                angle: 0
              },
              totalContacts: 0,
              speed: 0,
              angularSpeed: 0,
              velocity: {
                x: 0,
                y: 0
              },
              angularVelocity: 0,
              isSensor: !1,
              isStatic: !1,
              isSleeping: !1,
              motion: 0,
              sleepThreshold: 60,
              density: .001,
              restitution: 0,
              friction: .1,
              frictionStatic: .5,
              frictionAir: .01,
              collisionFilter: {
                category: 1,
                mask: 4294967295,
                group: 0
              },
              slop: .05,
              timeScale: 1,
              render: {
                visible: !0,
                opacity: 1,
                strokeStyle: null,
                fillStyle: null,
                lineWidth: null,
                sprite: {
                  xScale: 1,
                  yScale: 1,
                  xOffset: 0,
                  yOffset: 0
                }
              },
              events: null,
              bounds: null,
              chamfer: null,
              circleRadius: 0,
              positionPrev: null,
              anglePrev: 0,
              parent: null,
              axes: null,
              area: 0,
              mass: 0,
              inertia: 0,
              _original: null
            }, i = s.extend(n, t);
            return e(i, t), i;
          }, i.nextGroup = function(e) {
            return e ? i._nextNonCollidingGroupId-- : i._nextCollidingGroupId++;
          }, i.nextCategory = function() {
            return i._nextCategory = i._nextCategory << 1, i._nextCategory;
          };
          var e = function(e, t) {
            t = t || {}, i.set(e, {
              bounds: e.bounds || l.create(e.vertices),
              positionPrev: e.positionPrev || r.clone(e.position),
              anglePrev: e.anglePrev || e.angle,
              vertices: e.vertices,
              parts: e.parts || [ e ],
              isStatic: e.isStatic,
              isSleeping: e.isSleeping,
              parent: e.parent || e
            }), o.rotate(e.vertices, e.angle, e.position), c.rotate(e.axes, e.angle), l.update(e.bounds, e.vertices, e.velocity), 
            i.set(e, {
              axes: t.axes || e.axes,
              area: t.area || e.area,
              mass: t.mass || e.mass,
              inertia: t.inertia || e.inertia
            });
            var n = e.isStatic ? "#14151f" : s.choose([ "#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1" ]), a = e.isStatic ? "#555" : "#ccc", u = e.isStatic && null === e.render.fillStyle ? 1 : 0;
            e.render.fillStyle = e.render.fillStyle || n, e.render.strokeStyle = e.render.strokeStyle || a, 
            e.render.lineWidth = e.render.lineWidth || u, e.render.sprite.xOffset += -(e.bounds.min.x - e.position.x) / (e.bounds.max.x - e.bounds.min.x), 
            e.render.sprite.yOffset += -(e.bounds.min.y - e.position.y) / (e.bounds.max.y - e.bounds.min.y);
          };
          i.set = function(e, t, n) {
            var o;
            for (o in "string" == typeof t && (o = t, (t = {})[o] = n), t) if (Object.prototype.hasOwnProperty.call(t, o)) switch (n = t[o], 
            o) {
             case "isStatic":
              i.setStatic(e, n);
              break;

             case "isSleeping":
              a.set(e, n);
              break;

             case "mass":
              i.setMass(e, n);
              break;

             case "density":
              i.setDensity(e, n);
              break;

             case "inertia":
              i.setInertia(e, n);
              break;

             case "vertices":
              i.setVertices(e, n);
              break;

             case "position":
              i.setPosition(e, n);
              break;

             case "angle":
              i.setAngle(e, n);
              break;

             case "velocity":
              i.setVelocity(e, n);
              break;

             case "angularVelocity":
              i.setAngularVelocity(e, n);
              break;

             case "parts":
              i.setParts(e, n);
              break;

             case "centre":
              i.setCentre(e, n);
              break;

             default:
              e[o] = n;
            }
          }, i.setStatic = function(e, t) {
            for (var n = 0; n < e.parts.length; n++) {
              var i = e.parts[n];
              i.isStatic = t, t ? (i._original = {
                restitution: i.restitution,
                friction: i.friction,
                mass: i.mass,
                inertia: i.inertia,
                density: i.density,
                inverseMass: i.inverseMass,
                inverseInertia: i.inverseInertia
              }, i.restitution = 0, i.friction = 1, i.mass = i.inertia = i.density = 1 / 0, i.inverseMass = i.inverseInertia = 0, 
              i.positionPrev.x = i.position.x, i.positionPrev.y = i.position.y, i.anglePrev = i.angle, 
              i.angularVelocity = 0, i.speed = 0, i.angularSpeed = 0, i.motion = 0) : i._original && (i.restitution = i._original.restitution, 
              i.friction = i._original.friction, i.mass = i._original.mass, i.inertia = i._original.inertia, 
              i.density = i._original.density, i.inverseMass = i._original.inverseMass, i.inverseInertia = i._original.inverseInertia, 
              i._original = null);
            }
          }, i.setMass = function(e, t) {
            var n = e.inertia / (e.mass / 6);
            e.inertia = n * (t / 6), e.inverseInertia = 1 / e.inertia, e.mass = t, e.inverseMass = 1 / e.mass, 
            e.density = e.mass / e.area;
          }, i.setDensity = function(e, t) {
            i.setMass(e, t * e.area), e.density = t;
          }, i.setInertia = function(e, t) {
            e.inertia = t, e.inverseInertia = 1 / e.inertia;
          }, i.setVertices = function(e, t) {
            t[0].body === e ? e.vertices = t : e.vertices = o.create(t, e), e.axes = c.fromVertices(e.vertices), 
            e.area = o.area(e.vertices), i.setMass(e, e.density * e.area);
            var n = o.centre(e.vertices);
            o.translate(e.vertices, n, -1), i.setInertia(e, i._inertiaScale * o.inertia(e.vertices, e.mass)), 
            o.translate(e.vertices, e.position), l.update(e.bounds, e.vertices, e.velocity);
          }, i.setParts = function(e, t, n) {
            var r;
            for (t = t.slice(0), e.parts.length = 0, e.parts.push(e), e.parent = e, r = 0; r < t.length; r++) {
              var a = t[r];
              a !== e && (a.parent = e, e.parts.push(a));
            }
            if (1 !== e.parts.length) {
              if (n = void 0 === n || n) {
                var s = [];
                for (r = 0; r < t.length; r++) s = s.concat(t[r].vertices);
                o.clockwiseSort(s);
                var l = o.hull(s), c = o.centre(l);
                i.setVertices(e, l), o.translate(e.vertices, c);
              }
              var u = i._totalProperties(e);
              e.area = u.area, e.parent = e, e.position.x = u.centre.x, e.position.y = u.centre.y, 
              e.positionPrev.x = u.centre.x, e.positionPrev.y = u.centre.y, i.setMass(e, u.mass), 
              i.setInertia(e, u.inertia), i.setPosition(e, u.centre);
            }
          }, i.setCentre = function(e, t, n) {
            n ? (e.positionPrev.x += t.x, e.positionPrev.y += t.y, e.position.x += t.x, e.position.y += t.y) : (e.positionPrev.x = t.x - (e.position.x - e.positionPrev.x), 
            e.positionPrev.y = t.y - (e.position.y - e.positionPrev.y), e.position.x = t.x, 
            e.position.y = t.y);
          }, i.setPosition = function(e, t) {
            var n = r.sub(t, e.position);
            e.positionPrev.x += n.x, e.positionPrev.y += n.y;
            for (var i = 0; i < e.parts.length; i++) {
              var a = e.parts[i];
              a.position.x += n.x, a.position.y += n.y, o.translate(a.vertices, n), l.update(a.bounds, a.vertices, e.velocity);
            }
          }, i.setAngle = function(e, t) {
            var n = t - e.angle;
            e.anglePrev += n;
            for (var i = 0; i < e.parts.length; i++) {
              var a = e.parts[i];
              a.angle += n, o.rotate(a.vertices, n, e.position), c.rotate(a.axes, n), l.update(a.bounds, a.vertices, e.velocity), 
              i > 0 && r.rotateAbout(a.position, n, e.position, a.position);
            }
          }, i.setVelocity = function(e, t) {
            e.positionPrev.x = e.position.x - t.x, e.positionPrev.y = e.position.y - t.y, e.velocity.x = t.x, 
            e.velocity.y = t.y, e.speed = r.magnitude(e.velocity);
          }, i.setAngularVelocity = function(e, t) {
            e.anglePrev = e.angle - t, e.angularVelocity = t, e.angularSpeed = Math.abs(e.angularVelocity);
          }, i.translate = function(e, t) {
            i.setPosition(e, r.add(e.position, t));
          }, i.rotate = function(e, t, n) {
            if (n) {
              var o = Math.cos(t), r = Math.sin(t), a = e.position.x - n.x, s = e.position.y - n.y;
              i.setPosition(e, {
                x: n.x + (a * o - s * r),
                y: n.y + (a * r + s * o)
              }), i.setAngle(e, e.angle + t);
            } else i.setAngle(e, e.angle + t);
          }, i.scale = function(e, t, n, r) {
            var a = 0, s = 0;
            r = r || e.position;
            for (var u = 0; u < e.parts.length; u++) {
              var d = e.parts[u];
              o.scale(d.vertices, t, n, r), d.axes = c.fromVertices(d.vertices), d.area = o.area(d.vertices), 
              i.setMass(d, e.density * d.area), o.translate(d.vertices, {
                x: -d.position.x,
                y: -d.position.y
              }), i.setInertia(d, i._inertiaScale * o.inertia(d.vertices, d.mass)), o.translate(d.vertices, {
                x: d.position.x,
                y: d.position.y
              }), u > 0 && (a += d.area, s += d.inertia), d.position.x = r.x + (d.position.x - r.x) * t, 
              d.position.y = r.y + (d.position.y - r.y) * n, l.update(d.bounds, d.vertices, e.velocity);
            }
            e.parts.length > 1 && (e.area = a, e.isStatic || (i.setMass(e, e.density * a), i.setInertia(e, s))), 
            e.circleRadius && (t === n ? e.circleRadius *= t : e.circleRadius = null);
          }, i.update = function(e, t, n, i) {
            var a = Math.pow(t * n * e.timeScale, 2), s = 1 - e.frictionAir * n * e.timeScale, u = e.position.x - e.positionPrev.x, d = e.position.y - e.positionPrev.y;
            e.velocity.x = u * s * i + e.force.x / e.mass * a, e.velocity.y = d * s * i + e.force.y / e.mass * a, 
            e.positionPrev.x = e.position.x, e.positionPrev.y = e.position.y, e.position.x += e.velocity.x, 
            e.position.y += e.velocity.y, e.angularVelocity = (e.angle - e.anglePrev) * s * i + e.torque / e.inertia * a, 
            e.anglePrev = e.angle, e.angle += e.angularVelocity, e.speed = r.magnitude(e.velocity), 
            e.angularSpeed = Math.abs(e.angularVelocity);
            for (var p = 0; p < e.parts.length; p++) {
              var f = e.parts[p];
              o.translate(f.vertices, e.velocity), p > 0 && (f.position.x += e.velocity.x, f.position.y += e.velocity.y), 
              0 !== e.angularVelocity && (o.rotate(f.vertices, e.angularVelocity, e.position), 
              c.rotate(f.axes, e.angularVelocity), p > 0 && r.rotateAbout(f.position, e.angularVelocity, e.position, f.position)), 
              l.update(f.bounds, f.vertices, e.velocity);
            }
          }, i.applyForce = function(e, t, n) {
            e.force.x += n.x, e.force.y += n.y;
            var i = t.x - e.position.x, o = t.y - e.position.y;
            e.torque += i * n.y - o * n.x;
          }, i._totalProperties = function(e) {
            for (var t = {
              mass: 0,
              area: 0,
              inertia: 0,
              centre: {
                x: 0,
                y: 0
              }
            }, n = 1 === e.parts.length ? 0 : 1; n < e.parts.length; n++) {
              var i = e.parts[n], o = i.mass !== 1 / 0 ? i.mass : 1;
              t.mass += o, t.area += i.area, t.inertia += i.inertia, t.centre = r.add(t.centre, r.mult(i.position, o));
            }
            return t.centre = r.div(t.centre, t.mass), t;
          };
        }();
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(4);
        i._motionWakeThreshold = .18, i._motionSleepThreshold = .08, i._minBias = .9, i.update = function(e, t) {
          for (var n = t * t * t, o = 0; o < e.length; o++) {
            var r = e[o], a = r.speed * r.speed + r.angularSpeed * r.angularSpeed;
            if (0 === r.force.x && 0 === r.force.y) {
              var s = Math.min(r.motion, a), l = Math.max(r.motion, a);
              r.motion = i._minBias * s + (1 - i._minBias) * l, r.sleepThreshold > 0 && r.motion < i._motionSleepThreshold * n ? (r.sleepCounter += 1, 
              r.sleepCounter >= r.sleepThreshold && i.set(r, !0)) : r.sleepCounter > 0 && (r.sleepCounter -= 1);
            } else i.set(r, !1);
          }
        }, i.afterCollisions = function(e, t) {
          for (var n = t * t * t, o = 0; o < e.length; o++) {
            var r = e[o];
            if (r.isActive) {
              var a = r.collision, s = a.bodyA.parent, l = a.bodyB.parent;
              if (!(s.isSleeping && l.isSleeping || s.isStatic || l.isStatic) && (s.isSleeping || l.isSleeping)) {
                var c = s.isSleeping && !s.isStatic ? s : l, u = c === s ? l : s;
                !c.isStatic && u.motion > i._motionWakeThreshold * n && i.set(c, !1);
              }
            }
          }
        }, i.set = function(e, t) {
          var n = e.isSleeping;
          t ? (e.isSleeping = !0, e.sleepCounter = e.sleepThreshold, e.positionImpulse.x = 0, 
          e.positionImpulse.y = 0, e.positionPrev.x = e.position.x, e.positionPrev.y = e.position.y, 
          e.anglePrev = e.angle, e.speed = 0, e.angularSpeed = 0, e.motion = 0, n || o.trigger(e, "sleepStart")) : (e.isSleeping = !1, 
          e.sleepCounter = 0, n && o.trigger(e, "sleepEnd"));
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o, r, a, s = n(3), l = n(9);
        o = [], r = {
          overlap: 0,
          axis: null
        }, a = {
          overlap: 0,
          axis: null
        }, i.create = function(e, t) {
          return {
            pair: null,
            collided: !1,
            bodyA: e,
            bodyB: t,
            parentA: e.parent,
            parentB: t.parent,
            depth: 0,
            normal: {
              x: 0,
              y: 0
            },
            tangent: {
              x: 0,
              y: 0
            },
            penetration: {
              x: 0,
              y: 0
            },
            supports: []
          };
        }, i.collides = function(e, t, n) {
          if (i._overlapAxes(r, e.vertices, t.vertices, e.axes), r.overlap <= 0) return null;
          if (i._overlapAxes(a, t.vertices, e.vertices, t.axes), a.overlap <= 0) return null;
          var o, c, u = n && n.table[l.id(e, t)];
          u ? o = u.collision : ((o = i.create(e, t)).collided = !0, o.bodyA = e.id < t.id ? e : t, 
          o.bodyB = e.id < t.id ? t : e, o.parentA = o.bodyA.parent, o.parentB = o.bodyB.parent), 
          e = o.bodyA, t = o.bodyB, c = r.overlap < a.overlap ? r : a;
          var d = o.normal, p = o.supports, f = c.axis, v = f.x, y = f.y;
          v * (t.position.x - e.position.x) + y * (t.position.y - e.position.y) < 0 ? (d.x = v, 
          d.y = y) : (d.x = -v, d.y = -y), o.tangent.x = -d.y, o.tangent.y = d.x, o.depth = c.overlap, 
          o.penetration.x = d.x * o.depth, o.penetration.y = d.y * o.depth;
          var m = i._findSupports(e, t, d, 1), g = 0;
          if (s.contains(e.vertices, m[0]) && (p[g++] = m[0]), s.contains(e.vertices, m[1]) && (p[g++] = m[1]), 
          g < 2) {
            var x = i._findSupports(t, e, d, -1);
            s.contains(t.vertices, x[0]) && (p[g++] = x[0]), g < 2 && s.contains(t.vertices, x[1]) && (p[g++] = x[1]);
          }
          return 0 === g && (p[g++] = m[0]), p.length = g, o;
        }, i._overlapAxes = function(e, t, n, i) {
          var o, r, a, s, l, c, u = t.length, d = n.length, p = t[0].x, f = t[0].y, v = n[0].x, y = n[0].y, m = i.length, g = Number.MAX_VALUE, x = 0;
          for (l = 0; l < m; l++) {
            var h = i[l], b = h.x, S = h.y, w = p * b + f * S, A = v * b + y * S, P = w, C = A;
            for (c = 1; c < u; c += 1) (s = t[c].x * b + t[c].y * S) > P ? P = s : s < w && (w = s);
            for (c = 1; c < d; c += 1) (s = n[c].x * b + n[c].y * S) > C ? C = s : s < A && (A = s);
            if ((o = (r = P - A) < (a = C - w) ? r : a) < g && (g = o, x = l, o <= 0)) break;
          }
          e.axis = i[x], e.overlap = g;
        }, i._projectToAxis = function(e, t, n) {
          for (var i = t[0].x * n.x + t[0].y * n.y, o = i, r = 1; r < t.length; r += 1) {
            var a = t[r].x * n.x + t[r].y * n.y;
            a > o ? o = a : a < i && (i = a);
          }
          e.min = i, e.max = o;
        }, i._findSupports = function(e, t, n, i) {
          var r, a, s, l, c, u = t.vertices, d = u.length, p = e.position.x, f = e.position.y, v = n.x * i, y = n.y * i, m = Number.MAX_VALUE;
          for (c = 0; c < d; c += 1) (l = v * (p - (a = u[c]).x) + y * (f - a.y)) < m && (m = l, 
          r = a);
          return m = v * (p - (s = u[(d + r.index - 1) % d]).x) + y * (f - s.y), v * (p - (a = u[(r.index + 1) % d]).x) + y * (f - a.y) < m ? (o[0] = r, 
          o[1] = a, o) : (o[0] = r, o[1] = s, o);
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(17);
        i.create = function(e, t) {
          var n = e.bodyA, o = e.bodyB, r = {
            id: i.id(n, o),
            bodyA: n,
            bodyB: o,
            collision: e,
            contacts: [],
            activeContacts: [],
            separation: 0,
            isActive: !0,
            confirmedActive: !0,
            isSensor: n.isSensor || o.isSensor,
            timeCreated: t,
            timeUpdated: t,
            inverseMass: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 0,
            slop: 0
          };
          return i.update(r, e, t), r;
        }, i.update = function(e, t, n) {
          var i = e.contacts, r = t.supports, a = e.activeContacts, s = t.parentA, l = t.parentB, c = s.vertices.length;
          e.isActive = !0, e.timeUpdated = n, e.collision = t, e.separation = t.depth, e.inverseMass = s.inverseMass + l.inverseMass, 
          e.friction = s.friction < l.friction ? s.friction : l.friction, e.frictionStatic = s.frictionStatic > l.frictionStatic ? s.frictionStatic : l.frictionStatic, 
          e.restitution = s.restitution > l.restitution ? s.restitution : l.restitution, e.slop = s.slop > l.slop ? s.slop : l.slop, 
          t.pair = e, a.length = 0;
          for (var u = 0; u < r.length; u++) {
            var d = r[u], p = d.body === s ? d.index : c + d.index, f = i[p];
            f ? a.push(f) : a.push(i[p] = o.create(d));
          }
        }, i.setActive = function(e, t, n) {
          t ? (e.isActive = !0, e.timeUpdated = n) : (e.isActive = !1, e.activeContacts.length = 0);
        }, i.id = function(e, t) {
          return e.id < t.id ? "A" + e.id + "B" + t.id : "A" + t.id + "B" + e.id;
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(3), r = n(2), a = n(7), s = n(1), l = n(11), c = n(0);
        i._warming = .4, i._torqueDampen = 1, i._minLength = 1e-6, i.create = function(e) {
          var t = e;
          t.bodyA && !t.pointA && (t.pointA = {
            x: 0,
            y: 0
          }), t.bodyB && !t.pointB && (t.pointB = {
            x: 0,
            y: 0
          });
          var n = t.bodyA ? r.add(t.bodyA.position, t.pointA) : t.pointA, i = t.bodyB ? r.add(t.bodyB.position, t.pointB) : t.pointB, o = r.magnitude(r.sub(n, i));
          t.length = void 0 !== t.length ? t.length : o, t.id = t.id || c.nextId(), t.label = t.label || "Constraint", 
          t.type = "constraint", t.stiffness = t.stiffness || (t.length > 0 ? 1 : .7), t.damping = t.damping || 0, 
          t.angularStiffness = t.angularStiffness || 0, t.angleA = t.bodyA ? t.bodyA.angle : t.angleA, 
          t.angleB = t.bodyB ? t.bodyB.angle : t.angleB, t.plugin = {};
          var a = {
            visible: !0,
            lineWidth: 2,
            strokeStyle: "#ffffff",
            type: "line",
            anchors: !0
          };
          return 0 === t.length && t.stiffness > .1 ? (a.type = "pin", a.anchors = !1) : t.stiffness < .9 && (a.type = "spring"), 
          t.render = c.extend(a, t.render), t;
        }, i.preSolveAll = function(e) {
          for (var t = 0; t < e.length; t += 1) {
            var n = e[t], i = n.constraintImpulse;
            n.isStatic || 0 === i.x && 0 === i.y && 0 === i.angle || (n.position.x += i.x, n.position.y += i.y, 
            n.angle += i.angle);
          }
        }, i.solveAll = function(e, t) {
          for (var n = 0; n < e.length; n += 1) {
            var o = e[n], r = !o.bodyA || o.bodyA && o.bodyA.isStatic, a = !o.bodyB || o.bodyB && o.bodyB.isStatic;
            (r || a) && i.solve(e[n], t);
          }
          for (n = 0; n < e.length; n += 1) r = !(o = e[n]).bodyA || o.bodyA && o.bodyA.isStatic, 
          a = !o.bodyB || o.bodyB && o.bodyB.isStatic, r || a || i.solve(e[n], t);
        }, i.solve = function(e, t) {
          var n = e.bodyA, o = e.bodyB, a = e.pointA, s = e.pointB;
          if (n || o) {
            n && !n.isStatic && (r.rotate(a, n.angle - e.angleA, a), e.angleA = n.angle), o && !o.isStatic && (r.rotate(s, o.angle - e.angleB, s), 
            e.angleB = o.angle);
            var l = a, c = s;
            if (n && (l = r.add(n.position, a)), o && (c = r.add(o.position, s)), l && c) {
              var u = r.sub(l, c), d = r.magnitude(u);
              d < i._minLength && (d = i._minLength);
              var p, f, v, y, m, g = (d - e.length) / d, x = e.stiffness < 1 ? e.stiffness * t : e.stiffness, h = r.mult(u, g * x), b = (n ? n.inverseMass : 0) + (o ? o.inverseMass : 0), S = b + ((n ? n.inverseInertia : 0) + (o ? o.inverseInertia : 0));
              if (e.damping) {
                var w = r.create();
                v = r.div(u, d), m = r.sub(o && r.sub(o.position, o.positionPrev) || w, n && r.sub(n.position, n.positionPrev) || w), 
                y = r.dot(v, m);
              }
              n && !n.isStatic && (f = n.inverseMass / b, n.constraintImpulse.x -= h.x * f, n.constraintImpulse.y -= h.y * f, 
              n.position.x -= h.x * f, n.position.y -= h.y * f, e.damping && (n.positionPrev.x -= e.damping * v.x * y * f, 
              n.positionPrev.y -= e.damping * v.y * y * f), p = r.cross(a, h) / S * i._torqueDampen * n.inverseInertia * (1 - e.angularStiffness), 
              n.constraintImpulse.angle -= p, n.angle -= p), o && !o.isStatic && (f = o.inverseMass / b, 
              o.constraintImpulse.x += h.x * f, o.constraintImpulse.y += h.y * f, o.position.x += h.x * f, 
              o.position.y += h.y * f, e.damping && (o.positionPrev.x += e.damping * v.x * y * f, 
              o.positionPrev.y += e.damping * v.y * y * f), p = r.cross(s, h) / S * i._torqueDampen * o.inverseInertia * (1 - e.angularStiffness), 
              o.constraintImpulse.angle += p, o.angle += p);
            }
          }
        }, i.postSolveAll = function(e) {
          for (var t = 0; t < e.length; t++) {
            var n = e[t], c = n.constraintImpulse;
            if (!(n.isStatic || 0 === c.x && 0 === c.y && 0 === c.angle)) {
              a.set(n, !1);
              for (var u = 0; u < n.parts.length; u++) {
                var d = n.parts[u];
                o.translate(d.vertices, c), u > 0 && (d.position.x += c.x, d.position.y += c.y), 
                0 !== c.angle && (o.rotate(d.vertices, c.angle, n.position), l.rotate(d.axes, c.angle), 
                u > 0 && r.rotateAbout(d.position, c.angle, n.position, d.position)), s.update(d.bounds, d.vertices, n.velocity);
              }
              c.angle *= i._warming, c.x *= i._warming, c.y *= i._warming;
            }
          }
        }, i.pointAWorld = function(e) {
          return {
            x: (e.bodyA ? e.bodyA.position.x : 0) + e.pointA.x,
            y: (e.bodyA ? e.bodyA.position.y : 0) + e.pointA.y
          };
        }, i.pointBWorld = function(e) {
          return {
            x: (e.bodyB ? e.bodyB.position.x : 0) + e.pointB.x,
            y: (e.bodyB ? e.bodyB.position.y : 0) + e.pointB.y
          };
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(2), r = n(0);
        i.fromVertices = function(e) {
          for (var t = {}, n = 0; n < e.length; n++) {
            var i = (n + 1) % e.length, a = o.normalise({
              x: e[i].y - e[n].y,
              y: e[n].x - e[i].x
            }), s = 0 === a.y ? 1 / 0 : a.x / a.y;
            t[s = s.toFixed(3).toString()] = a;
          }
          return r.values(t);
        }, i.rotate = function(e, t) {
          if (0 !== t) for (var n = Math.cos(t), i = Math.sin(t), o = 0; o < e.length; o++) {
            var r, a = e[o];
            r = a.x * n - a.y * i, a.y = a.x * i + a.y * n, a.x = r;
          }
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(3), r = n(0), a = n(6), s = n(1), l = n(2);
        i.rectangle = function(e, t, n, i, s) {
          s = s || {};
          var l = {
            label: "Rectangle Body",
            position: {
              x: e,
              y: t
            },
            vertices: o.fromPath("L 0 0 L " + n + " 0 L " + n + " " + i + " L 0 " + i)
          };
          if (s.chamfer) {
            var c = s.chamfer;
            l.vertices = o.chamfer(l.vertices, c.radius, c.quality, c.qualityMin, c.qualityMax), 
            delete s.chamfer;
          }
          return a.create(r.extend({}, l, s));
        }, i.trapezoid = function(e, t, n, i, s, l) {
          l = l || {};
          var c, u = n * (s *= .5), d = u + (1 - 2 * s) * n, p = d + u;
          c = s < .5 ? "L 0 0 L " + u + " " + -i + " L " + d + " " + -i + " L " + p + " 0" : "L 0 0 L " + d + " " + -i + " L " + p + " 0";
          var f = {
            label: "Trapezoid Body",
            position: {
              x: e,
              y: t
            },
            vertices: o.fromPath(c)
          };
          if (l.chamfer) {
            var v = l.chamfer;
            f.vertices = o.chamfer(f.vertices, v.radius, v.quality, v.qualityMin, v.qualityMax), 
            delete l.chamfer;
          }
          return a.create(r.extend({}, f, l));
        }, i.circle = function(e, t, n, o, a) {
          o = o || {};
          var s = {
            label: "Circle Body",
            circleRadius: n
          };
          a = a || 25;
          var l = Math.ceil(Math.max(10, Math.min(a, n)));
          return l % 2 == 1 && (l += 1), i.polygon(e, t, l, n, r.extend({}, s, o));
        }, i.polygon = function(e, t, n, s, l) {
          if (l = l || {}, n < 3) return i.circle(e, t, s, l);
          for (var c = 2 * Math.PI / n, u = "", d = .5 * c, p = 0; p < n; p += 1) {
            var f = d + p * c, v = Math.cos(f) * s, y = Math.sin(f) * s;
            u += "L " + v.toFixed(3) + " " + y.toFixed(3) + " ";
          }
          var m = {
            label: "Polygon Body",
            position: {
              x: e,
              y: t
            },
            vertices: o.fromPath(u)
          };
          if (l.chamfer) {
            var g = l.chamfer;
            m.vertices = o.chamfer(m.vertices, g.radius, g.quality, g.qualityMin, g.qualityMax), 
            delete l.chamfer;
          }
          return a.create(r.extend({}, m, l));
        }, i.fromVertices = function(e, t, n, i, c, u, d, p) {
          var f, v, y, m, g, x, h, b, S, w, A = r.getDecomp();
          for (f = Boolean(A && A.quickDecomp), i = i || {}, y = [], c = void 0 !== c && c, 
          u = void 0 !== u ? u : .01, d = void 0 !== d ? d : 10, p = void 0 !== p ? p : .01, 
          r.isArray(n[0]) || (n = [ n ]), S = 0; S < n.length; S += 1) if (g = n[S], !(m = o.isConvex(g)) && !f && r.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."), 
          m || !f) g = m ? o.clockwiseSort(g) : o.hull(g), y.push({
            position: {
              x: e,
              y: t
            },
            vertices: g
          }); else {
            var P = g.map((function(e) {
              return [ e.x, e.y ];
            }));
            A.makeCCW(P), !1 !== u && A.removeCollinearPoints(P, u), !1 !== p && A.removeDuplicatePoints && A.removeDuplicatePoints(P, p);
            var C = A.quickDecomp(P);
            for (x = 0; x < C.length; x++) {
              var M = C[x].map((function(e) {
                return {
                  x: e[0],
                  y: e[1]
                };
              }));
              d > 0 && o.area(M) < d || y.push({
                position: o.centre(M),
                vertices: M
              });
            }
          }
          for (x = 0; x < y.length; x++) y[x] = a.create(r.extend(y[x], i));
          if (c) for (x = 0; x < y.length; x++) {
            var B = y[x];
            for (h = x + 1; h < y.length; h++) {
              var k = y[h];
              if (s.overlaps(B.bounds, k.bounds)) {
                var _ = B.vertices, I = k.vertices;
                for (b = 0; b < B.vertices.length; b++) for (w = 0; w < k.vertices.length; w++) {
                  var T = l.magnitudeSquared(l.sub(_[(b + 1) % _.length], I[w])), R = l.magnitudeSquared(l.sub(_[b], I[(w + 1) % I.length]));
                  T < 5 && R < 5 && (_[b].isInternal = !0, I[w].isInternal = !0);
                }
              }
            }
          }
          return y.length > 1 ? (v = a.create(r.extend({
            parts: y.slice(0)
          }, i)), a.setPosition(v, {
            x: e,
            y: t
          }), v) : y[0];
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(0);
        i.create = function(e) {
          var t = {};
          return e || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), 
          t.element = e || document.body, t.absolute = {
            x: 0,
            y: 0
          }, t.position = {
            x: 0,
            y: 0
          }, t.mousedownPosition = {
            x: 0,
            y: 0
          }, t.mouseupPosition = {
            x: 0,
            y: 0
          }, t.offset = {
            x: 0,
            y: 0
          }, t.scale = {
            x: 1,
            y: 1
          }, t.wheelDelta = 0, t.button = -1, t.pixelRatio = parseInt(t.element.getAttribute("data-pixel-ratio"), 10) || 1, 
          t.sourceEvents = {
            mousemove: null,
            mousedown: null,
            mouseup: null,
            mousewheel: null
          }, t.mousemove = function(e) {
            var n = i._getRelativeMousePosition(e, t.element, t.pixelRatio);
            e.changedTouches && (t.button = 0, e.preventDefault()), t.absolute.x = n.x, t.absolute.y = n.y, 
            t.position.x = t.absolute.x * t.scale.x + t.offset.x, t.position.y = t.absolute.y * t.scale.y + t.offset.y, 
            t.sourceEvents.mousemove = e;
          }, t.mousedown = function(e) {
            var n = i._getRelativeMousePosition(e, t.element, t.pixelRatio);
            e.changedTouches ? (t.button = 0, e.preventDefault()) : t.button = e.button, t.absolute.x = n.x, 
            t.absolute.y = n.y, t.position.x = t.absolute.x * t.scale.x + t.offset.x, t.position.y = t.absolute.y * t.scale.y + t.offset.y, 
            t.mousedownPosition.x = t.position.x, t.mousedownPosition.y = t.position.y, t.sourceEvents.mousedown = e;
          }, t.mouseup = function(e) {
            var n = i._getRelativeMousePosition(e, t.element, t.pixelRatio);
            e.changedTouches && e.preventDefault(), t.button = -1, t.absolute.x = n.x, t.absolute.y = n.y, 
            t.position.x = t.absolute.x * t.scale.x + t.offset.x, t.position.y = t.absolute.y * t.scale.y + t.offset.y, 
            t.mouseupPosition.x = t.position.x, t.mouseupPosition.y = t.position.y, t.sourceEvents.mouseup = e;
          }, t.mousewheel = function(e) {
            t.wheelDelta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)), e.preventDefault();
          }, i.setElement(t, t.element), t;
        }, i.setElement = function(e, t) {
          e.element = t, t.addEventListener("mousemove", e.mousemove), t.addEventListener("mousedown", e.mousedown), 
          t.addEventListener("mouseup", e.mouseup), t.addEventListener("mousewheel", e.mousewheel), 
          t.addEventListener("DOMMouseScroll", e.mousewheel), t.addEventListener("touchmove", e.mousemove), 
          t.addEventListener("touchstart", e.mousedown), t.addEventListener("touchend", e.mouseup);
        }, i.clearSourceEvents = function(e) {
          e.sourceEvents.mousemove = null, e.sourceEvents.mousedown = null, e.sourceEvents.mouseup = null, 
          e.sourceEvents.mousewheel = null, e.wheelDelta = 0;
        }, i.setOffset = function(e, t) {
          e.offset.x = t.x, e.offset.y = t.y, e.position.x = e.absolute.x * e.scale.x + e.offset.x, 
          e.position.y = e.absolute.y * e.scale.y + e.offset.y;
        }, i.setScale = function(e, t) {
          e.scale.x = t.x, e.scale.y = t.y, e.position.x = e.absolute.x * e.scale.x + e.offset.x, 
          e.position.y = e.absolute.y * e.scale.y + e.offset.y;
        }, i._getRelativeMousePosition = function(e, t, n) {
          var i, o, r = t.getBoundingClientRect(), a = document.documentElement || document.body.parentNode || document.body, s = void 0 !== window.pageXOffset ? window.pageXOffset : a.scrollLeft, l = void 0 !== window.pageYOffset ? window.pageYOffset : a.scrollTop, c = e.changedTouches;
          return c ? (i = c[0].pageX - r.left - s, o = c[0].pageY - r.top - l) : (i = e.pageX - r.left - s, 
          o = e.pageY - r.top - l), {
            x: i / (t.clientWidth / (t.width || t.clientWidth) * n),
            y: o / (t.clientHeight / (t.height || t.clientHeight) * n)
          };
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(0), r = n(8);
        i.create = function(e) {
          return o.extend({
            bodies: [],
            pairs: null
          }, e);
        }, i.setBodies = function(e, t) {
          e.bodies = t.slice(0);
        }, i.clear = function(e) {
          e.bodies = [];
        }, i.collisions = function(e) {
          var t, n, o = [], a = e.pairs, s = e.bodies, l = s.length, c = i.canCollide, u = r.collides;
          for (s.sort(i._compareBoundsX), t = 0; t < l; t++) {
            var d = s[t], p = d.bounds, f = d.bounds.max.x, v = d.bounds.max.y, y = d.bounds.min.y, m = d.isStatic || d.isSleeping, g = d.parts.length, x = 1 === g;
            for (n = t + 1; n < l; n++) {
              var h = s[n];
              if ((B = h.bounds).min.x > f) break;
              if (!(v < B.min.y || y > B.max.y) && (!m || !h.isStatic && !h.isSleeping) && c(d.collisionFilter, h.collisionFilter)) {
                var b = h.parts.length;
                if (x && 1 === b) (C = u(d, h, a)) && o.push(C); else for (var S = b > 1 ? 1 : 0, w = g > 1 ? 1 : 0; w < g; w++) for (var A = d.parts[w], P = (p = A.bounds, 
                S); P < b; P++) {
                  var C, M = h.parts[P], B = M.bounds;
                  p.min.x > B.max.x || p.max.x < B.min.x || p.max.y < B.min.y || p.min.y > B.max.y || (C = u(A, M, a)) && o.push(C);
                }
              }
            }
          }
          return o;
        }, i.canCollide = function(e, t) {
          return e.group === t.group && 0 !== e.group ? e.group > 0 : !!(e.mask & t.category) && !!(t.mask & e.category);
        }, i._compareBoundsX = function(e, t) {
          return e.bounds.min.x - t.bounds.min.x;
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(0);
        i._registry = {}, i.register = function(e) {
          if (i.isPlugin(e) || o.warn("Plugin.register:", i.toString(e), "does not implement all required fields."), 
          e.name in i._registry) {
            var t = i._registry[e.name], n = i.versionParse(e.version).number, r = i.versionParse(t.version).number;
            n > r ? (o.warn("Plugin.register:", i.toString(t), "was upgraded to", i.toString(e)), 
            i._registry[e.name] = e) : n < r ? o.warn("Plugin.register:", i.toString(t), "can not be downgraded to", i.toString(e)) : e !== t && o.warn("Plugin.register:", i.toString(e), "is already registered to different plugin object");
          } else i._registry[e.name] = e;
          return e;
        }, i.resolve = function(e) {
          return i._registry[i.dependencyParse(e).name];
        }, i.toString = function(e) {
          return "string" == typeof e ? e : (e.name || "anonymous") + "@" + (e.version || e.range || "0.0.0");
        }, i.isPlugin = function(e) {
          return e && e.name && e.version && e.install;
        }, i.isUsed = function(e, t) {
          return e.used.indexOf(t) > -1;
        }, i.isFor = function(e, t) {
          var n = e.for && i.dependencyParse(e.for);
          return !e.for || t.name === n.name && i.versionSatisfies(t.version, n.range);
        }, i.use = function(e, t) {
          if (e.uses = (e.uses || []).concat(t || []), 0 !== e.uses.length) {
            for (var n = i.dependencies(e), r = o.topologicalSort(n), a = [], s = 0; s < r.length; s += 1) if (r[s] !== e.name) {
              var l = i.resolve(r[s]);
              l ? i.isUsed(e, l.name) || (i.isFor(l, e) || (o.warn("Plugin.use:", i.toString(l), "is for", l.for, "but installed on", i.toString(e) + "."), 
              l._warned = !0), l.install ? l.install(e) : (o.warn("Plugin.use:", i.toString(l), "does not specify an install function."), 
              l._warned = !0), l._warned ? (a.push("🔶 " + i.toString(l)), delete l._warned) : a.push("✅ " + i.toString(l)), 
              e.used.push(l.name)) : a.push("❌ " + r[s]);
            }
            a.length > 0 && o.info(a.join("  "));
          } else o.warn("Plugin.use:", i.toString(e), "does not specify any dependencies to install.");
        }, i.dependencies = function(e, t) {
          var n = i.dependencyParse(e), r = n.name;
          if (!(r in (t = t || {}))) {
            e = i.resolve(e) || e, t[r] = o.map(e.uses || [], (function(t) {
              i.isPlugin(t) && i.register(t);
              var r = i.dependencyParse(t), a = i.resolve(t);
              return a && !i.versionSatisfies(a.version, r.range) ? (o.warn("Plugin.dependencies:", i.toString(a), "does not satisfy", i.toString(r), "used by", i.toString(n) + "."), 
              a._warned = !0, e._warned = !0) : a || (o.warn("Plugin.dependencies:", i.toString(t), "used by", i.toString(n), "could not be resolved."), 
              e._warned = !0), r.name;
            }));
            for (var a = 0; a < t[r].length; a += 1) i.dependencies(t[r][a], t);
            return t;
          }
        }, i.dependencyParse = function(e) {
          return o.isString(e) ? (/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/.test(e) || o.warn("Plugin.dependencyParse:", e, "is not a valid dependency string."), 
          {
            name: e.split("@")[0],
            range: e.split("@")[1] || "*"
          }) : {
            name: e.name,
            range: e.range || e.version
          };
        }, i.versionParse = function(e) {
          var t = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
          t.test(e) || o.warn("Plugin.versionParse:", e, "is not a valid version or range.");
          var n = t.exec(e), i = Number(n[4]), r = Number(n[5]), a = Number(n[6]);
          return {
            isRange: Boolean(n[1] || n[2]),
            version: n[3],
            range: e,
            operator: n[1] || n[2] || "",
            major: i,
            minor: r,
            patch: a,
            parts: [ i, r, a ],
            prerelease: n[7],
            number: 1e8 * i + 1e4 * r + a
          };
        }, i.versionSatisfies = function(e, t) {
          t = t || "*";
          var n = i.versionParse(t), o = i.versionParse(e);
          if (n.isRange) {
            if ("*" === n.operator || "*" === e) return !0;
            if (">" === n.operator) return o.number > n.number;
            if (">=" === n.operator) return o.number >= n.number;
            if ("~" === n.operator) return o.major === n.major && o.minor === n.minor && o.patch >= n.patch;
            if ("^" === n.operator) return n.major > 0 ? o.major === n.major && o.number >= n.number : n.minor > 0 ? o.minor === n.minor && o.patch >= n.patch : o.patch === n.patch;
          }
          return e === t || "*" === e;
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(0), r = n(5), a = n(1), s = n(4), l = n(2), c = n(13);
        !function() {
          var e, t;
          "undefined" != typeof window && (e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
            window.setTimeout((function() {
              e(o.now());
            }), 1e3 / 60);
          }, t = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), 
          i._goodFps = 30, i._goodDelta = 1e3 / 60, i.create = function(e) {
            var t = {
              controller: i,
              engine: null,
              element: null,
              canvas: null,
              mouse: null,
              frameRequestId: null,
              timing: {
                historySize: 60,
                delta: 0,
                deltaHistory: [],
                lastTime: 0,
                lastTimestamp: 0,
                lastElapsed: 0,
                timestampElapsed: 0,
                timestampElapsedHistory: [],
                engineDeltaHistory: [],
                engineElapsedHistory: [],
                elapsedHistory: []
              },
              options: {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: "#14151f",
                wireframeBackground: "#14151f",
                hasBounds: !!e.bounds,
                enabled: !0,
                wireframes: !0,
                showSleeping: !0,
                showDebug: !1,
                showStats: !1,
                showPerformance: !1,
                showBounds: !1,
                showVelocity: !1,
                showCollisions: !1,
                showSeparations: !1,
                showAxes: !1,
                showPositions: !1,
                showAngleIndicator: !1,
                showIds: !1,
                showVertexNumbers: !1,
                showConvexHulls: !1,
                showInternalEdges: !1,
                showMousePosition: !1
              }
            }, n = o.extend(t, e);
            return n.canvas && (n.canvas.width = n.options.width || n.canvas.width, n.canvas.height = n.options.height || n.canvas.height), 
            n.mouse = e.mouse, n.engine = e.engine, n.canvas = n.canvas || d(n.options.width, n.options.height), 
            n.context = n.canvas.getContext("2d"), n.textures = {}, n.bounds = n.bounds || {
              min: {
                x: 0,
                y: 0
              },
              max: {
                x: n.canvas.width,
                y: n.canvas.height
              }
            }, n.options.showBroadphase = !1, 1 !== n.options.pixelRatio && i.setPixelRatio(n, n.options.pixelRatio), 
            o.isElement(n.element) ? n.element.appendChild(n.canvas) : n.canvas.parentNode || o.log("Render.create: options.element was undefined, render.canvas was created but not appended", "warn"), 
            n;
          }, i.run = function(t) {
            !function o(r) {
              t.frameRequestId = e(o), n(t, r), i.world(t, r), (t.options.showStats || t.options.showDebug) && i.stats(t, t.context, r), 
              (t.options.showPerformance || t.options.showDebug) && i.performance(t, t.context, r);
            }();
          }, i.stop = function(e) {
            t(e.frameRequestId);
          }, i.setPixelRatio = function(e, t) {
            var n = e.options, i = e.canvas;
            "auto" === t && (t = p(i)), n.pixelRatio = t, i.setAttribute("data-pixel-ratio", t), 
            i.width = n.width * t, i.height = n.height * t, i.style.width = n.width + "px", 
            i.style.height = n.height + "px";
          }, i.lookAt = function(e, t, n, i) {
            i = void 0 === i || i, t = o.isArray(t) ? t : [ t ], n = n || {
              x: 0,
              y: 0
            };
            for (var r = {
              min: {
                x: 1 / 0,
                y: 1 / 0
              },
              max: {
                x: -1 / 0,
                y: -1 / 0
              }
            }, a = 0; a < t.length; a += 1) {
              var s = t[a], l = s.bounds ? s.bounds.min : s.min || s.position || s, u = s.bounds ? s.bounds.max : s.max || s.position || s;
              l && u && (l.x < r.min.x && (r.min.x = l.x), u.x > r.max.x && (r.max.x = u.x), l.y < r.min.y && (r.min.y = l.y), 
              u.y > r.max.y && (r.max.y = u.y));
            }
            var d = r.max.x - r.min.x + 2 * n.x, p = r.max.y - r.min.y + 2 * n.y, f = e.canvas.height, v = e.canvas.width / f, y = d / p, m = 1, g = 1;
            y > v ? g = y / v : m = v / y, e.options.hasBounds = !0, e.bounds.min.x = r.min.x, 
            e.bounds.max.x = r.min.x + d * m, e.bounds.min.y = r.min.y, e.bounds.max.y = r.min.y + p * g, 
            i && (e.bounds.min.x += .5 * d - d * m * .5, e.bounds.max.x += .5 * d - d * m * .5, 
            e.bounds.min.y += .5 * p - p * g * .5, e.bounds.max.y += .5 * p - p * g * .5), e.bounds.min.x -= n.x, 
            e.bounds.max.x -= n.x, e.bounds.min.y -= n.y, e.bounds.max.y -= n.y, e.mouse && (c.setScale(e.mouse, {
              x: (e.bounds.max.x - e.bounds.min.x) / e.canvas.width,
              y: (e.bounds.max.y - e.bounds.min.y) / e.canvas.height
            }), c.setOffset(e.mouse, e.bounds.min));
          }, i.startViewTransform = function(e) {
            var t = e.bounds.max.x - e.bounds.min.x, n = e.bounds.max.y - e.bounds.min.y, i = t / e.options.width, o = n / e.options.height;
            e.context.setTransform(e.options.pixelRatio / i, 0, 0, e.options.pixelRatio / o, 0, 0), 
            e.context.translate(-e.bounds.min.x, -e.bounds.min.y);
          }, i.endViewTransform = function(e) {
            e.context.setTransform(e.options.pixelRatio, 0, 0, e.options.pixelRatio, 0, 0);
          }, i.world = function(e, t) {
            var n, u = o.now(), d = e.engine, p = d.world, f = e.canvas, y = e.context, m = e.options, g = e.timing, x = r.allBodies(p), h = r.allConstraints(p), b = m.wireframes ? m.wireframeBackground : m.background, S = [], w = [], A = {
              timestamp: d.timing.timestamp
            };
            if (s.trigger(e, "beforeRender", A), e.currentBackground !== b && v(e, b), y.globalCompositeOperation = "source-in", 
            y.fillStyle = "transparent", y.fillRect(0, 0, f.width, f.height), y.globalCompositeOperation = "source-over", 
            m.hasBounds) {
              for (n = 0; n < x.length; n++) {
                var P = x[n];
                a.overlaps(P.bounds, e.bounds) && S.push(P);
              }
              for (n = 0; n < h.length; n++) {
                var C = h[n], M = C.bodyA, B = C.bodyB, k = C.pointA, _ = C.pointB;
                M && (k = l.add(M.position, C.pointA)), B && (_ = l.add(B.position, C.pointB)), 
                k && _ && (a.contains(e.bounds, k) || a.contains(e.bounds, _)) && w.push(C);
              }
              i.startViewTransform(e), e.mouse && (c.setScale(e.mouse, {
                x: (e.bounds.max.x - e.bounds.min.x) / e.options.width,
                y: (e.bounds.max.y - e.bounds.min.y) / e.options.height
              }), c.setOffset(e.mouse, e.bounds.min));
            } else w = h, S = x, 1 !== e.options.pixelRatio && e.context.setTransform(e.options.pixelRatio, 0, 0, e.options.pixelRatio, 0, 0);
            !m.wireframes || d.enableSleeping && m.showSleeping ? i.bodies(e, S, y) : (m.showConvexHulls && i.bodyConvexHulls(e, S, y), 
            i.bodyWireframes(e, S, y)), m.showBounds && i.bodyBounds(e, S, y), (m.showAxes || m.showAngleIndicator) && i.bodyAxes(e, S, y), 
            m.showPositions && i.bodyPositions(e, S, y), m.showVelocity && i.bodyVelocity(e, S, y), 
            m.showIds && i.bodyIds(e, S, y), m.showSeparations && i.separations(e, d.pairs.list, y), 
            m.showCollisions && i.collisions(e, d.pairs.list, y), m.showVertexNumbers && i.vertexNumbers(e, S, y), 
            m.showMousePosition && i.mousePosition(e, e.mouse, y), i.constraints(w, y), m.hasBounds && i.endViewTransform(e), 
            s.trigger(e, "afterRender", A), g.lastElapsed = o.now() - u;
          }, i.stats = function(e, t, n) {
            for (var i = e.engine, o = i.world, a = r.allBodies(o), s = 0, l = 0, c = 0; c < a.length; c += 1) s += a[c].parts.length;
            var u = {
              Part: s,
              Body: a.length,
              Cons: r.allConstraints(o).length,
              Comp: r.allComposites(o).length,
              Pair: i.pairs.list.length
            };
            for (var d in t.fillStyle = "#0e0f19", t.fillRect(l, 0, 302.5, 44), t.font = "12px Arial", 
            t.textBaseline = "top", t.textAlign = "right", u) {
              var p = u[d];
              t.fillStyle = "#aaa", t.fillText(d, l + 55, 8), t.fillStyle = "#eee", t.fillText(p, l + 55, 26), 
              l += 55;
            }
          }, i.performance = function(e, t) {
            var n = e.engine, o = e.timing, r = o.deltaHistory, a = o.elapsedHistory, s = o.timestampElapsedHistory, l = o.engineDeltaHistory, c = o.engineElapsedHistory, d = n.timing.lastDelta, p = u(r), f = u(a), v = u(l), y = u(c), m = u(s) / p || 0, g = 1e3 / p || 0;
            t.fillStyle = "#0e0f19", t.fillRect(0, 50, 370, 34), i.status(t, 10, 69, 60, 4, r.length, Math.round(g) + " fps", g / i._goodFps, (function(e) {
              return r[e] / p - 1;
            })), i.status(t, 82, 69, 60, 4, l.length, d.toFixed(2) + " dt", i._goodDelta / d, (function(e) {
              return l[e] / v - 1;
            })), i.status(t, 154, 69, 60, 4, c.length, y.toFixed(2) + " ut", 1 - y / i._goodFps, (function(e) {
              return c[e] / y - 1;
            })), i.status(t, 226, 69, 60, 4, a.length, f.toFixed(2) + " rt", 1 - f / i._goodFps, (function(e) {
              return a[e] / f - 1;
            })), i.status(t, 298, 69, 60, 4, s.length, m.toFixed(2) + " x", m * m * m, (function(e) {
              return (s[e] / r[e] / m || 0) - 1;
            }));
          }, i.status = function(e, t, n, i, r, a, s, l, c) {
            e.strokeStyle = "#888", e.fillStyle = "#444", e.lineWidth = 1, e.fillRect(t, n + 7, i, 1), 
            e.beginPath(), e.moveTo(t, n + 7 - r * o.clamp(.4 * c(0), -2, 2));
            for (var u = 0; u < i; u += 1) e.lineTo(t + u, n + 7 - (u < a ? r * o.clamp(.4 * c(u), -2, 2) : 0));
            e.stroke(), e.fillStyle = "hsl(" + o.clamp(25 + 95 * l, 0, 120) + ",100%,60%)", 
            e.fillRect(t, n - 7, 4, 4), e.font = "12px Arial", e.textBaseline = "middle", e.textAlign = "right", 
            e.fillStyle = "#eee", e.fillText(s, t + i, n - 5);
          }, i.constraints = function(e, t) {
            for (var n = t, i = 0; i < e.length; i++) {
              var r = e[i];
              if (r.render.visible && r.pointA && r.pointB) {
                var a, s, c = r.bodyA, u = r.bodyB;
                if (a = c ? l.add(c.position, r.pointA) : r.pointA, "pin" === r.render.type) n.beginPath(), 
                n.arc(a.x, a.y, 3, 0, 2 * Math.PI), n.closePath(); else {
                  if (s = u ? l.add(u.position, r.pointB) : r.pointB, n.beginPath(), n.moveTo(a.x, a.y), 
                  "spring" === r.render.type) for (var d, p = l.sub(s, a), f = l.perp(l.normalise(p)), v = Math.ceil(o.clamp(r.length / 5, 12, 20)), y = 1; y < v; y += 1) d = y % 2 == 0 ? 1 : -1, 
                  n.lineTo(a.x + p.x * (y / v) + f.x * d * 4, a.y + p.y * (y / v) + f.y * d * 4);
                  n.lineTo(s.x, s.y);
                }
                r.render.lineWidth && (n.lineWidth = r.render.lineWidth, n.strokeStyle = r.render.strokeStyle, 
                n.stroke()), r.render.anchors && (n.fillStyle = r.render.strokeStyle, n.beginPath(), 
                n.arc(a.x, a.y, 3, 0, 2 * Math.PI), n.arc(s.x, s.y, 3, 0, 2 * Math.PI), n.closePath(), 
                n.fill());
              }
            }
          }, i.bodies = function(e, t, n) {
            var i, o, r, a, s = n, l = (e.engine, e.options), c = l.showInternalEdges || !l.wireframes;
            for (r = 0; r < t.length; r++) if ((i = t[r]).render.visible) for (a = i.parts.length > 1 ? 1 : 0; a < i.parts.length; a++) if ((o = i.parts[a]).render.visible) {
              if (l.showSleeping && i.isSleeping ? s.globalAlpha = .5 * o.render.opacity : 1 !== o.render.opacity && (s.globalAlpha = o.render.opacity), 
              o.render.sprite && o.render.sprite.texture && !l.wireframes) {
                var u = o.render.sprite, d = f(e, u.texture);
                s.translate(o.position.x, o.position.y), s.rotate(o.angle), s.drawImage(d, d.width * -u.xOffset * u.xScale, d.height * -u.yOffset * u.yScale, d.width * u.xScale, d.height * u.yScale), 
                s.rotate(-o.angle), s.translate(-o.position.x, -o.position.y);
              } else {
                if (o.circleRadius) s.beginPath(), s.arc(o.position.x, o.position.y, o.circleRadius, 0, 2 * Math.PI); else {
                  s.beginPath(), s.moveTo(o.vertices[0].x, o.vertices[0].y);
                  for (var p = 1; p < o.vertices.length; p++) !o.vertices[p - 1].isInternal || c ? s.lineTo(o.vertices[p].x, o.vertices[p].y) : s.moveTo(o.vertices[p].x, o.vertices[p].y), 
                  o.vertices[p].isInternal && !c && s.moveTo(o.vertices[(p + 1) % o.vertices.length].x, o.vertices[(p + 1) % o.vertices.length].y);
                  s.lineTo(o.vertices[0].x, o.vertices[0].y), s.closePath();
                }
                l.wireframes ? (s.lineWidth = 1, s.strokeStyle = "#bbb", s.stroke()) : (s.fillStyle = o.render.fillStyle, 
                o.render.lineWidth && (s.lineWidth = o.render.lineWidth, s.strokeStyle = o.render.strokeStyle, 
                s.stroke()), s.fill());
              }
              s.globalAlpha = 1;
            }
          }, i.bodyWireframes = function(e, t, n) {
            var i, o, r, a, s, l = n, c = e.options.showInternalEdges;
            for (l.beginPath(), r = 0; r < t.length; r++) if ((i = t[r]).render.visible) for (s = i.parts.length > 1 ? 1 : 0; s < i.parts.length; s++) {
              for (o = i.parts[s], l.moveTo(o.vertices[0].x, o.vertices[0].y), a = 1; a < o.vertices.length; a++) !o.vertices[a - 1].isInternal || c ? l.lineTo(o.vertices[a].x, o.vertices[a].y) : l.moveTo(o.vertices[a].x, o.vertices[a].y), 
              o.vertices[a].isInternal && !c && l.moveTo(o.vertices[(a + 1) % o.vertices.length].x, o.vertices[(a + 1) % o.vertices.length].y);
              l.lineTo(o.vertices[0].x, o.vertices[0].y);
            }
            l.lineWidth = 1, l.strokeStyle = "#bbb", l.stroke();
          }, i.bodyConvexHulls = function(e, t, n) {
            var i, o, r, a = n;
            for (a.beginPath(), o = 0; o < t.length; o++) if ((i = t[o]).render.visible && 1 !== i.parts.length) {
              for (a.moveTo(i.vertices[0].x, i.vertices[0].y), r = 1; r < i.vertices.length; r++) a.lineTo(i.vertices[r].x, i.vertices[r].y);
              a.lineTo(i.vertices[0].x, i.vertices[0].y);
            }
            a.lineWidth = 1, a.strokeStyle = "rgba(255,255,255,0.2)", a.stroke();
          }, i.vertexNumbers = function(e, t, n) {
            var i, o, r, a = n;
            for (i = 0; i < t.length; i++) {
              var s = t[i].parts;
              for (r = s.length > 1 ? 1 : 0; r < s.length; r++) {
                var l = s[r];
                for (o = 0; o < l.vertices.length; o++) a.fillStyle = "rgba(255,255,255,0.2)", a.fillText(i + "_" + o, l.position.x + .8 * (l.vertices[o].x - l.position.x), l.position.y + .8 * (l.vertices[o].y - l.position.y));
              }
            }
          }, i.mousePosition = function(e, t, n) {
            var i = n;
            i.fillStyle = "rgba(255,255,255,0.8)", i.fillText(t.position.x + "  " + t.position.y, t.position.x + 5, t.position.y - 5);
          }, i.bodyBounds = function(e, t, n) {
            var i = n, o = (e.engine, e.options);
            i.beginPath();
            for (var r = 0; r < t.length; r++) if (t[r].render.visible) for (var a = t[r].parts, s = a.length > 1 ? 1 : 0; s < a.length; s++) {
              var l = a[s];
              i.rect(l.bounds.min.x, l.bounds.min.y, l.bounds.max.x - l.bounds.min.x, l.bounds.max.y - l.bounds.min.y);
            }
            o.wireframes ? i.strokeStyle = "rgba(255,255,255,0.08)" : i.strokeStyle = "rgba(0,0,0,0.1)", 
            i.lineWidth = 1, i.stroke();
          }, i.bodyAxes = function(e, t, n) {
            var i, o, r, a, s = n, l = (e.engine, e.options);
            for (s.beginPath(), o = 0; o < t.length; o++) {
              var c = t[o], u = c.parts;
              if (c.render.visible) if (l.showAxes) for (r = u.length > 1 ? 1 : 0; r < u.length; r++) for (i = u[r], 
              a = 0; a < i.axes.length; a++) {
                var d = i.axes[a];
                s.moveTo(i.position.x, i.position.y), s.lineTo(i.position.x + 20 * d.x, i.position.y + 20 * d.y);
              } else for (r = u.length > 1 ? 1 : 0; r < u.length; r++) for (i = u[r], a = 0; a < i.axes.length; a++) s.moveTo(i.position.x, i.position.y), 
              s.lineTo((i.vertices[0].x + i.vertices[i.vertices.length - 1].x) / 2, (i.vertices[0].y + i.vertices[i.vertices.length - 1].y) / 2);
            }
            l.wireframes ? (s.strokeStyle = "indianred", s.lineWidth = 1) : (s.strokeStyle = "rgba(255, 255, 255, 0.4)", 
            s.globalCompositeOperation = "overlay", s.lineWidth = 2), s.stroke(), s.globalCompositeOperation = "source-over";
          }, i.bodyPositions = function(e, t, n) {
            var i, o, r, a, s = n, l = (e.engine, e.options);
            for (s.beginPath(), r = 0; r < t.length; r++) if ((i = t[r]).render.visible) for (a = 0; a < i.parts.length; a++) o = i.parts[a], 
            s.arc(o.position.x, o.position.y, 3, 0, 2 * Math.PI, !1), s.closePath();
            for (l.wireframes ? s.fillStyle = "indianred" : s.fillStyle = "rgba(0,0,0,0.5)", 
            s.fill(), s.beginPath(), r = 0; r < t.length; r++) (i = t[r]).render.visible && (s.arc(i.positionPrev.x, i.positionPrev.y, 2, 0, 2 * Math.PI, !1), 
            s.closePath());
            s.fillStyle = "rgba(255,165,0,0.8)", s.fill();
          }, i.bodyVelocity = function(e, t, n) {
            var i = n;
            i.beginPath();
            for (var o = 0; o < t.length; o++) {
              var r = t[o];
              r.render.visible && (i.moveTo(r.position.x, r.position.y), i.lineTo(r.position.x + 2 * (r.position.x - r.positionPrev.x), r.position.y + 2 * (r.position.y - r.positionPrev.y)));
            }
            i.lineWidth = 3, i.strokeStyle = "cornflowerblue", i.stroke();
          }, i.bodyIds = function(e, t, n) {
            var i, o, r = n;
            for (i = 0; i < t.length; i++) if (t[i].render.visible) {
              var a = t[i].parts;
              for (o = a.length > 1 ? 1 : 0; o < a.length; o++) {
                var s = a[o];
                r.font = "12px Arial", r.fillStyle = "rgba(255,255,255,0.5)", r.fillText(s.id, s.position.x + 10, s.position.y - 10);
              }
            }
          }, i.collisions = function(e, t, n) {
            var i, o, r, a, s = n, l = e.options;
            for (s.beginPath(), r = 0; r < t.length; r++) if ((i = t[r]).isActive) for (o = i.collision, 
            a = 0; a < i.activeContacts.length; a++) {
              var c = i.activeContacts[a].vertex;
              s.rect(c.x - 1.5, c.y - 1.5, 3.5, 3.5);
            }
            for (l.wireframes ? s.fillStyle = "rgba(255,255,255,0.7)" : s.fillStyle = "orange", 
            s.fill(), s.beginPath(), r = 0; r < t.length; r++) if ((i = t[r]).isActive && (o = i.collision, 
            i.activeContacts.length > 0)) {
              var u = i.activeContacts[0].vertex.x, d = i.activeContacts[0].vertex.y;
              2 === i.activeContacts.length && (u = (i.activeContacts[0].vertex.x + i.activeContacts[1].vertex.x) / 2, 
              d = (i.activeContacts[0].vertex.y + i.activeContacts[1].vertex.y) / 2), o.bodyB === o.supports[0].body || !0 === o.bodyA.isStatic ? s.moveTo(u - 8 * o.normal.x, d - 8 * o.normal.y) : s.moveTo(u + 8 * o.normal.x, d + 8 * o.normal.y), 
              s.lineTo(u, d);
            }
            l.wireframes ? s.strokeStyle = "rgba(255,165,0,0.7)" : s.strokeStyle = "orange", 
            s.lineWidth = 1, s.stroke();
          }, i.separations = function(e, t, n) {
            var i, o, r, a, s, l = n, c = e.options;
            for (l.beginPath(), s = 0; s < t.length; s++) if ((i = t[s]).isActive) {
              r = (o = i.collision).bodyA;
              var u = 1;
              (a = o.bodyB).isStatic || r.isStatic || (u = .5), a.isStatic && (u = 0), l.moveTo(a.position.x, a.position.y), 
              l.lineTo(a.position.x - o.penetration.x * u, a.position.y - o.penetration.y * u), 
              u = 1, a.isStatic || r.isStatic || (u = .5), r.isStatic && (u = 0), l.moveTo(r.position.x, r.position.y), 
              l.lineTo(r.position.x + o.penetration.x * u, r.position.y + o.penetration.y * u);
            }
            c.wireframes ? l.strokeStyle = "rgba(255,165,0,0.5)" : l.strokeStyle = "orange", 
            l.stroke();
          }, i.inspector = function(e, t) {
            e.engine;
            var n, i = e.selected, o = e.render, r = o.options;
            if (r.hasBounds) {
              var a = o.bounds.max.x - o.bounds.min.x, s = o.bounds.max.y - o.bounds.min.y, l = a / o.options.width, c = s / o.options.height;
              t.scale(1 / l, 1 / c), t.translate(-o.bounds.min.x, -o.bounds.min.y);
            }
            for (var u = 0; u < i.length; u++) {
              var d = i[u].data;
              switch (t.translate(.5, .5), t.lineWidth = 1, t.strokeStyle = "rgba(255,165,0,0.9)", 
              t.setLineDash([ 1, 2 ]), d.type) {
               case "body":
                n = d.bounds, t.beginPath(), t.rect(Math.floor(n.min.x - 3), Math.floor(n.min.y - 3), Math.floor(n.max.x - n.min.x + 6), Math.floor(n.max.y - n.min.y + 6)), 
                t.closePath(), t.stroke();
                break;

               case "constraint":
                var p = d.pointA;
                d.bodyA && (p = d.pointB), t.beginPath(), t.arc(p.x, p.y, 10, 0, 2 * Math.PI), t.closePath(), 
                t.stroke();
              }
              t.setLineDash([]), t.translate(-.5, -.5);
            }
            null !== e.selectStart && (t.translate(.5, .5), t.lineWidth = 1, t.strokeStyle = "rgba(255,165,0,0.6)", 
            t.fillStyle = "rgba(255,165,0,0.1)", n = e.selectBounds, t.beginPath(), t.rect(Math.floor(n.min.x), Math.floor(n.min.y), Math.floor(n.max.x - n.min.x), Math.floor(n.max.y - n.min.y)), 
            t.closePath(), t.stroke(), t.fill(), t.translate(-.5, -.5)), r.hasBounds && t.setTransform(1, 0, 0, 1, 0, 0);
          };
          var n = function(e, t) {
            var n = e.engine, o = e.timing, r = o.historySize, a = n.timing.timestamp;
            o.delta = t - o.lastTime || i._goodDelta, o.lastTime = t, o.timestampElapsed = a - o.lastTimestamp || 0, 
            o.lastTimestamp = a, o.deltaHistory.unshift(o.delta), o.deltaHistory.length = Math.min(o.deltaHistory.length, r), 
            o.engineDeltaHistory.unshift(n.timing.lastDelta), o.engineDeltaHistory.length = Math.min(o.engineDeltaHistory.length, r), 
            o.timestampElapsedHistory.unshift(o.timestampElapsed), o.timestampElapsedHistory.length = Math.min(o.timestampElapsedHistory.length, r), 
            o.engineElapsedHistory.unshift(n.timing.lastElapsed), o.engineElapsedHistory.length = Math.min(o.engineElapsedHistory.length, r), 
            o.elapsedHistory.unshift(o.lastElapsed), o.elapsedHistory.length = Math.min(o.elapsedHistory.length, r);
          }, u = function(e) {
            for (var t = 0, n = 0; n < e.length; n += 1) t += e[n];
            return t / e.length || 0;
          }, d = function(e, t) {
            var n = document.createElement("canvas");
            return n.width = e, n.height = t, n.oncontextmenu = function() {
              return !1;
            }, n.onselectstart = function() {
              return !1;
            }, n;
          }, p = function(e) {
            var t = e.getContext("2d");
            return (window.devicePixelRatio || 1) / (t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1);
          }, f = function(e, t) {
            var n = e.textures[t];
            return n || ((n = e.textures[t] = new Image).src = t, n);
          }, v = function(e, t) {
            var n = t;
            /(jpg|gif|png)$/.test(t) && (n = "url(" + t + ")"), e.canvas.style.background = n, 
            e.canvas.style.backgroundSize = "contain", e.currentBackground = t;
          };
        }();
      }, function(e, t) {
        var n = {};
        e.exports = n, n.create = function(e) {
          return {
            vertex: e,
            normalImpulse: 0,
            tangentImpulse: 0
          };
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(7), r = n(19), a = n(14), s = n(20), l = n(4), c = n(5), u = n(10), d = n(0), p = n(6);
        i.create = function(e) {
          e = e || {};
          var t = d.extend({
            positionIterations: 6,
            velocityIterations: 4,
            constraintIterations: 2,
            enableSleeping: !1,
            events: [],
            plugin: {},
            gravity: {
              x: 0,
              y: 1,
              scale: .001
            },
            timing: {
              timestamp: 0,
              timeScale: 1,
              lastDelta: 0,
              lastElapsed: 0
            }
          }, e);
          return t.world = e.world || c.create({
            label: "World"
          }), t.pairs = e.pairs || s.create(), t.detector = e.detector || a.create(), t.grid = {
            buckets: []
          }, t.world.gravity = t.gravity, t.broadphase = t.grid, t.metrics = {}, t;
        }, i.update = function(e, t, n) {
          var p = d.now();
          t = t || 1e3 / 60, n = n || 1;
          var f, v = e.world, y = e.detector, m = e.pairs, g = e.timing, x = g.timestamp;
          g.timestamp += t * g.timeScale, g.lastDelta = t * g.timeScale;
          var h = {
            timestamp: g.timestamp
          };
          l.trigger(e, "beforeUpdate", h);
          var b = c.allBodies(v), S = c.allConstraints(v);
          for (v.isModified && a.setBodies(y, b), v.isModified && c.setModified(v, !1, !1, !0), 
          e.enableSleeping && o.update(b, g.timeScale), i._bodiesApplyGravity(b, e.gravity), 
          i._bodiesUpdate(b, t, g.timeScale, n, v.bounds), u.preSolveAll(b), f = 0; f < e.constraintIterations; f++) u.solveAll(S, g.timeScale);
          u.postSolveAll(b), y.pairs = e.pairs;
          var w = a.collisions(y);
          for (s.update(m, w, x), e.enableSleeping && o.afterCollisions(m.list, g.timeScale), 
          m.collisionStart.length > 0 && l.trigger(e, "collisionStart", {
            pairs: m.collisionStart
          }), r.preSolvePosition(m.list), f = 0; f < e.positionIterations; f++) r.solvePosition(m.list, g.timeScale);
          for (r.postSolvePosition(b), u.preSolveAll(b), f = 0; f < e.constraintIterations; f++) u.solveAll(S, g.timeScale);
          for (u.postSolveAll(b), r.preSolveVelocity(m.list), f = 0; f < e.velocityIterations; f++) r.solveVelocity(m.list, g.timeScale);
          return m.collisionActive.length > 0 && l.trigger(e, "collisionActive", {
            pairs: m.collisionActive
          }), m.collisionEnd.length > 0 && l.trigger(e, "collisionEnd", {
            pairs: m.collisionEnd
          }), i._bodiesClearForces(b), l.trigger(e, "afterUpdate", h), e.timing.lastElapsed = d.now() - p, 
          e;
        }, i.merge = function(e, t) {
          if (d.extend(e, t), t.world) {
            e.world = t.world, i.clear(e);
            for (var n = c.allBodies(e.world), r = 0; r < n.length; r++) {
              var a = n[r];
              o.set(a, !1), a.id = d.nextId();
            }
          }
        }, i.clear = function(e) {
          s.clear(e.pairs), a.clear(e.detector);
        }, i._bodiesClearForces = function(e) {
          for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n.force.x = 0, n.force.y = 0, n.torque = 0;
          }
        }, i._bodiesApplyGravity = function(e, t) {
          var n = void 0 !== t.scale ? t.scale : .001;
          if ((0 !== t.x || 0 !== t.y) && 0 !== n) for (var i = 0; i < e.length; i++) {
            var o = e[i];
            o.isStatic || o.isSleeping || (o.force.y += o.mass * t.y * n, o.force.x += o.mass * t.x * n);
          }
        }, i._bodiesUpdate = function(e, t, n, i, o) {
          for (var r = 0; r < e.length; r++) {
            var a = e[r];
            a.isStatic || a.isSleeping || p.update(a, t, n, i);
          }
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(3), r = n(1);
        i._restingThresh = 4, i._restingThreshTangent = 6, i._positionDampen = .9, i._positionWarming = .8, 
        i._frictionNormalMultiplier = 5, i.preSolvePosition = function(e) {
          var t, n, i, o = e.length;
          for (t = 0; t < o; t++) (n = e[t]).isActive && (i = n.activeContacts.length, n.collision.parentA.totalContacts += i, 
          n.collision.parentB.totalContacts += i);
        }, i.solvePosition = function(e, t) {
          var n, o, r, a, s, l, c, u, d = i._positionDampen, p = e.length;
          for (n = 0; n < p; n++) (o = e[n]).isActive && !o.isSensor && (a = (r = o.collision).parentA, 
          s = r.parentB, l = r.normal, o.separation = l.x * (s.positionImpulse.x + r.penetration.x - a.positionImpulse.x) + l.y * (s.positionImpulse.y + r.penetration.y - a.positionImpulse.y));
          for (n = 0; n < p; n++) (o = e[n]).isActive && !o.isSensor && (a = (r = o.collision).parentA, 
          s = r.parentB, l = r.normal, u = (o.separation - o.slop) * t, (a.isStatic || s.isStatic) && (u *= 2), 
          a.isStatic || a.isSleeping || (c = d / a.totalContacts, a.positionImpulse.x += l.x * u * c, 
          a.positionImpulse.y += l.y * u * c), s.isStatic || s.isSleeping || (c = d / s.totalContacts, 
          s.positionImpulse.x -= l.x * u * c, s.positionImpulse.y -= l.y * u * c));
        }, i.postSolvePosition = function(e) {
          for (var t = i._positionWarming, n = e.length, a = o.translate, s = r.update, l = 0; l < n; l++) {
            var c = e[l], u = c.positionImpulse, d = u.x, p = u.y, f = c.velocity;
            if (c.totalContacts = 0, 0 !== d || 0 !== p) {
              for (var v = 0; v < c.parts.length; v++) {
                var y = c.parts[v];
                a(y.vertices, u), s(y.bounds, y.vertices, f), y.position.x += d, y.position.y += p;
              }
              c.positionPrev.x += d, c.positionPrev.y += p, d * f.x + p * f.y < 0 ? (u.x = 0, 
              u.y = 0) : (u.x *= t, u.y *= t);
            }
          }
        }, i.preSolveVelocity = function(e) {
          var t, n, i = e.length;
          for (t = 0; t < i; t++) {
            var o = e[t];
            if (o.isActive && !o.isSensor) {
              var r = o.activeContacts, a = r.length, s = o.collision, l = s.parentA, c = s.parentB, u = s.normal, d = s.tangent;
              for (n = 0; n < a; n++) {
                var p = r[n], f = p.vertex, v = p.normalImpulse, y = p.tangentImpulse;
                if (0 !== v || 0 !== y) {
                  var m = u.x * v + d.x * y, g = u.y * v + d.y * y;
                  l.isStatic || l.isSleeping || (l.positionPrev.x += m * l.inverseMass, l.positionPrev.y += g * l.inverseMass, 
                  l.anglePrev += l.inverseInertia * ((f.x - l.position.x) * g - (f.y - l.position.y) * m)), 
                  c.isStatic || c.isSleeping || (c.positionPrev.x -= m * c.inverseMass, c.positionPrev.y -= g * c.inverseMass, 
                  c.anglePrev -= c.inverseInertia * ((f.x - c.position.x) * g - (f.y - c.position.y) * m));
                }
              }
            }
          }
        }, i.solveVelocity = function(e, t) {
          var n, o, r, a, s = t * t, l = i._restingThresh * s, c = i._frictionNormalMultiplier, u = i._restingThreshTangent * s, d = Number.MAX_VALUE, p = e.length;
          for (r = 0; r < p; r++) {
            var f = e[r];
            if (f.isActive && !f.isSensor) {
              var v = f.collision, y = v.parentA, m = v.parentB, g = y.velocity, x = m.velocity, h = v.normal.x, b = v.normal.y, S = v.tangent.x, w = v.tangent.y, A = f.activeContacts, P = A.length, C = 1 / P, M = y.inverseMass + m.inverseMass, B = f.friction * f.frictionStatic * c * s;
              for (g.x = y.position.x - y.positionPrev.x, g.y = y.position.y - y.positionPrev.y, 
              x.x = m.position.x - m.positionPrev.x, x.y = m.position.y - m.positionPrev.y, y.angularVelocity = y.angle - y.anglePrev, 
              m.angularVelocity = m.angle - m.anglePrev, a = 0; a < P; a++) {
                var k = A[a], _ = k.vertex, I = _.x - y.position.x, T = _.y - y.position.y, R = _.x - m.position.x, E = _.y - m.position.y, V = g.x - T * y.angularVelocity, L = g.y + I * y.angularVelocity, O = V - (x.x - E * m.angularVelocity), D = L - (x.y + R * m.angularVelocity), F = h * O + b * D, H = S * O + w * D, j = f.separation + F, q = Math.min(j, 1), W = (q = j < 0 ? 0 : q) * B;
                H > W || -H > W ? (o = H > 0 ? H : -H, (n = f.friction * (H > 0 ? 1 : -1) * s) < -o ? n = -o : n > o && (n = o)) : (n = H, 
                o = d);
                var G = I * b - T * h, N = R * b - E * h, U = C / (M + y.inverseInertia * G * G + m.inverseInertia * N * N), z = (1 + f.restitution) * F * U;
                if (n *= U, F * F > l && F < 0) k.normalImpulse = 0; else {
                  var X = k.normalImpulse;
                  k.normalImpulse += z, k.normalImpulse = Math.min(k.normalImpulse, 0), z = k.normalImpulse - X;
                }
                if (H * H > u) k.tangentImpulse = 0; else {
                  var Q = k.tangentImpulse;
                  k.tangentImpulse += n, k.tangentImpulse < -o && (k.tangentImpulse = -o), k.tangentImpulse > o && (k.tangentImpulse = o), 
                  n = k.tangentImpulse - Q;
                }
                var Y = h * z + S * n, Z = b * z + w * n;
                y.isStatic || y.isSleeping || (y.positionPrev.x += Y * y.inverseMass, y.positionPrev.y += Z * y.inverseMass, 
                y.anglePrev += (I * Z - T * Y) * y.inverseInertia), m.isStatic || m.isSleeping || (m.positionPrev.x -= Y * m.inverseMass, 
                m.positionPrev.y -= Z * m.inverseMass, m.anglePrev -= (R * Z - E * Y) * m.inverseInertia);
              }
            }
          }
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(9), r = n(0);
        i.create = function(e) {
          return r.extend({
            table: {},
            list: [],
            collisionStart: [],
            collisionActive: [],
            collisionEnd: []
          }, e);
        }, i.update = function(e, t, n) {
          var i, r, a, s, l = e.list, c = l.length, u = e.table, d = t.length, p = e.collisionStart, f = e.collisionEnd, v = e.collisionActive;
          for (p.length = 0, f.length = 0, v.length = 0, s = 0; s < c; s++) l[s].confirmedActive = !1;
          for (s = 0; s < d; s++) (a = (i = t[s]).pair) ? (a.isActive ? v.push(a) : p.push(a), 
          o.update(a, i, n), a.confirmedActive = !0) : (u[(a = o.create(i, n)).id] = a, p.push(a), 
          l.push(a));
          var y = [];
          for (c = l.length, s = 0; s < c; s++) (a = l[s]).confirmedActive || (o.setActive(a, !1, n), 
          f.push(a), a.collision.bodyA.isSleeping || a.collision.bodyB.isSleeping || y.push(s));
          for (s = 0; s < y.length; s++) a = l[r = y[s] - s], l.splice(r, 1), delete u[a.id];
        }, i.clear = function(e) {
          return e.table = {}, e.list.length = 0, e.collisionStart.length = 0, e.collisionActive.length = 0, 
          e.collisionEnd.length = 0, e;
        };
      }, function(e, t, n) {
        var i = e.exports = n(22);
        i.Axes = n(11), i.Bodies = n(12), i.Body = n(6), i.Bounds = n(1), i.Collision = n(8), 
        i.Common = n(0), i.Composite = n(5), i.Composites = n(23), i.Constraint = n(10), 
        i.Contact = n(17), i.Detector = n(14), i.Engine = n(18), i.Events = n(4), i.Grid = n(24), 
        i.Mouse = n(13), i.MouseConstraint = n(25), i.Pair = n(9), i.Pairs = n(20), i.Plugin = n(15), 
        i.Query = n(26), i.Render = n(16), i.Resolver = n(19), i.Runner = n(27), i.SAT = n(28), 
        i.Sleeping = n(7), i.Svg = n(29), i.Vector = n(2), i.Vertices = n(3), i.World = n(30), 
        i.Engine.run = i.Runner.run, i.Common.deprecated(i.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(15), r = n(0);
        i.name = "matter-js", i.version = "0.18.0", i.uses = [], i.used = [], i.use = function() {
          o.use(i, Array.prototype.slice.call(arguments));
        }, i.before = function(e, t) {
          return e = e.replace(/^Matter./, ""), r.chainPathBefore(i, e, t);
        }, i.after = function(e, t) {
          return e = e.replace(/^Matter./, ""), r.chainPathAfter(i, e, t);
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(5), r = n(10), a = n(0), s = n(6), l = n(12), c = a.deprecated;
        i.stack = function(e, t, n, i, r, a, l) {
          for (var c, u = o.create({
            label: "Stack"
          }), d = e, p = t, f = 0, v = 0; v < i; v++) {
            for (var y = 0, m = 0; m < n; m++) {
              var g = l(d, p, m, v, c, f);
              if (g) {
                var x = g.bounds.max.y - g.bounds.min.y, h = g.bounds.max.x - g.bounds.min.x;
                x > y && (y = x), s.translate(g, {
                  x: .5 * h,
                  y: .5 * x
                }), d = g.bounds.max.x + r, o.addBody(u, g), c = g, f += 1;
              } else d += r;
            }
            p += y + a, d = e;
          }
          return u;
        }, i.chain = function(e, t, n, i, s, l) {
          for (var c = e.bodies, u = 1; u < c.length; u++) {
            var d = c[u - 1], p = c[u], f = d.bounds.max.y - d.bounds.min.y, v = d.bounds.max.x - d.bounds.min.x, y = p.bounds.max.y - p.bounds.min.y, m = {
              bodyA: d,
              pointA: {
                x: v * t,
                y: f * n
              },
              bodyB: p,
              pointB: {
                x: (p.bounds.max.x - p.bounds.min.x) * i,
                y: y * s
              }
            }, g = a.extend(m, l);
            o.addConstraint(e, r.create(g));
          }
          return e.label += " Chain", e;
        }, i.mesh = function(e, t, n, i, s) {
          var l, c, u, d, p, f = e.bodies;
          for (l = 0; l < n; l++) {
            for (c = 1; c < t; c++) u = f[c - 1 + l * t], d = f[c + l * t], o.addConstraint(e, r.create(a.extend({
              bodyA: u,
              bodyB: d
            }, s)));
            if (l > 0) for (c = 0; c < t; c++) u = f[c + (l - 1) * t], d = f[c + l * t], o.addConstraint(e, r.create(a.extend({
              bodyA: u,
              bodyB: d
            }, s))), i && c > 0 && (p = f[c - 1 + (l - 1) * t], o.addConstraint(e, r.create(a.extend({
              bodyA: p,
              bodyB: d
            }, s)))), i && c < t - 1 && (p = f[c + 1 + (l - 1) * t], o.addConstraint(e, r.create(a.extend({
              bodyA: p,
              bodyB: d
            }, s))));
          }
          return e.label += " Mesh", e;
        }, i.pyramid = function(e, t, n, o, r, a, l) {
          return i.stack(e, t, n, o, r, a, (function(t, i, a, c, u, d) {
            var p = Math.min(o, Math.ceil(n / 2)), f = u ? u.bounds.max.x - u.bounds.min.x : 0;
            if (!(c > p || a < (c = p - c) || a > n - 1 - c)) return 1 === d && s.translate(u, {
              x: (a + (n % 2 == 1 ? 1 : -1)) * f,
              y: 0
            }), l(e + (u ? a * f : 0) + a * r, i, a, c, u, d);
          }));
        }, i.newtonsCradle = function(e, t, n, i, a) {
          for (var s = o.create({
            label: "Newtons Cradle"
          }), c = 0; c < n; c++) {
            var u = l.circle(e + c * (1.9 * i), t + a, i, {
              inertia: 1 / 0,
              restitution: 1,
              friction: 0,
              frictionAir: 1e-4,
              slop: 1
            }), d = r.create({
              pointA: {
                x: e + c * (1.9 * i),
                y: t
              },
              bodyB: u
            });
            o.addBody(s, u), o.addConstraint(s, d);
          }
          return s;
        }, c(i, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), 
        i.car = function(e, t, n, i, a) {
          var c = s.nextGroup(!0), u = .5 * -n + 20, d = .5 * n - 20, p = o.create({
            label: "Car"
          }), f = l.rectangle(e, t, n, i, {
            collisionFilter: {
              group: c
            },
            chamfer: {
              radius: .5 * i
            },
            density: 2e-4
          }), v = l.circle(e + u, t + 0, a, {
            collisionFilter: {
              group: c
            },
            friction: .8
          }), y = l.circle(e + d, t + 0, a, {
            collisionFilter: {
              group: c
            },
            friction: .8
          }), m = r.create({
            bodyB: f,
            pointB: {
              x: u,
              y: 0
            },
            bodyA: v,
            stiffness: 1,
            length: 0
          }), g = r.create({
            bodyB: f,
            pointB: {
              x: d,
              y: 0
            },
            bodyA: y,
            stiffness: 1,
            length: 0
          });
          return o.addBody(p, f), o.addBody(p, v), o.addBody(p, y), o.addConstraint(p, m), 
          o.addConstraint(p, g), p;
        }, c(i, "car", "Composites.car ➤ moved to car example"), i.softBody = function(e, t, n, o, r, s, c, u, d, p) {
          d = a.extend({
            inertia: 1 / 0
          }, d), p = a.extend({
            stiffness: .2,
            render: {
              type: "line",
              anchors: !1
            }
          }, p);
          var f = i.stack(e, t, n, o, r, s, (function(e, t) {
            return l.circle(e, t, u, d);
          }));
          return i.mesh(f, n, o, c, p), f.label = "Soft Body", f;
        }, c(i, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(9), r = n(0), a = r.deprecated;
        i.create = function(e) {
          return r.extend({
            buckets: {},
            pairs: {},
            pairsList: [],
            bucketWidth: 48,
            bucketHeight: 48
          }, e);
        }, i.update = function(e, t, n, o) {
          var r, a, s, l, c, u = n.world, d = e.buckets, p = !1;
          for (r = 0; r < t.length; r++) {
            var f = t[r];
            if ((!f.isSleeping || o) && (!u.bounds || !(f.bounds.max.x < u.bounds.min.x || f.bounds.min.x > u.bounds.max.x || f.bounds.max.y < u.bounds.min.y || f.bounds.min.y > u.bounds.max.y))) {
              var v = i._getRegion(e, f);
              if (!f.region || v.id !== f.region.id || o) {
                f.region && !o || (f.region = v);
                var y = i._regionUnion(v, f.region);
                for (a = y.startCol; a <= y.endCol; a++) for (s = y.startRow; s <= y.endRow; s++) {
                  l = d[c = i._getBucketId(a, s)];
                  var m = a >= v.startCol && a <= v.endCol && s >= v.startRow && s <= v.endRow, g = a >= f.region.startCol && a <= f.region.endCol && s >= f.region.startRow && s <= f.region.endRow;
                  !m && g && g && l && i._bucketRemoveBody(e, l, f), (f.region === v || m && !g || o) && (l || (l = i._createBucket(d, c)), 
                  i._bucketAddBody(e, l, f));
                }
                f.region = v, p = !0;
              }
            }
          }
          p && (e.pairsList = i._createActivePairsList(e));
        }, a(i, "update", "Grid.update ➤ replaced by Matter.Detector"), i.clear = function(e) {
          e.buckets = {}, e.pairs = {}, e.pairsList = [];
        }, a(i, "clear", "Grid.clear ➤ replaced by Matter.Detector"), i._regionUnion = function(e, t) {
          var n = Math.min(e.startCol, t.startCol), o = Math.max(e.endCol, t.endCol), r = Math.min(e.startRow, t.startRow), a = Math.max(e.endRow, t.endRow);
          return i._createRegion(n, o, r, a);
        }, i._getRegion = function(e, t) {
          var n = t.bounds, o = Math.floor(n.min.x / e.bucketWidth), r = Math.floor(n.max.x / e.bucketWidth), a = Math.floor(n.min.y / e.bucketHeight), s = Math.floor(n.max.y / e.bucketHeight);
          return i._createRegion(o, r, a, s);
        }, i._createRegion = function(e, t, n, i) {
          return {
            id: e + "," + t + "," + n + "," + i,
            startCol: e,
            endCol: t,
            startRow: n,
            endRow: i
          };
        }, i._getBucketId = function(e, t) {
          return "C" + e + "R" + t;
        }, i._createBucket = function(e, t) {
          return e[t] = [];
        }, i._bucketAddBody = function(e, t, n) {
          var i, r = e.pairs, a = o.id, s = t.length;
          for (i = 0; i < s; i++) {
            var l = t[i];
            if (!(n.id === l.id || n.isStatic && l.isStatic)) {
              var c = a(n, l), u = r[c];
              u ? u[2] += 1 : r[c] = [ n, l, 1 ];
            }
          }
          t.push(n);
        }, i._bucketRemoveBody = function(e, t, n) {
          var i, a = e.pairs, s = o.id;
          t.splice(r.indexOf(t, n), 1);
          var l = t.length;
          for (i = 0; i < l; i++) {
            var c = a[s(n, t[i])];
            c && (c[2] -= 1);
          }
        }, i._createActivePairsList = function(e) {
          var t, n, i = e.pairs, o = r.keys(i), a = o.length, s = [];
          for (n = 0; n < a; n++) (t = i[o[n]])[2] > 0 ? s.push(t) : delete i[o[n]];
          return s;
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(3), r = n(7), a = n(13), s = n(4), l = n(14), c = n(10), u = n(5), d = n(0), p = n(1);
        i.create = function(e, t) {
          var n = (e ? e.mouse : null) || (t ? t.mouse : null);
          n || (e && e.render && e.render.canvas ? n = a.create(e.render.canvas) : t && t.element ? n = a.create(t.element) : (n = a.create(), 
          d.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
          var o = {
            type: "mouseConstraint",
            mouse: n,
            element: null,
            body: null,
            constraint: c.create({
              label: "Mouse Constraint",
              pointA: n.position,
              pointB: {
                x: 0,
                y: 0
              },
              length: .01,
              stiffness: .1,
              angularStiffness: 1,
              render: {
                strokeStyle: "#90EE90",
                lineWidth: 3
              }
            }),
            collisionFilter: {
              category: 1,
              mask: 4294967295,
              group: 0
            }
          }, r = d.extend(o, t);
          return s.on(e, "beforeUpdate", (function() {
            var t = u.allBodies(e.world);
            i.update(r, t), i._triggerEvents(r);
          })), r;
        }, i.update = function(e, t) {
          var n = e.mouse, i = e.constraint, a = e.body;
          if (0 === n.button) {
            if (i.bodyB) r.set(i.bodyB, !1), i.pointA = n.position; else for (var c = 0; c < t.length; c++) if (a = t[c], 
            p.contains(a.bounds, n.position) && l.canCollide(a.collisionFilter, e.collisionFilter)) for (var u = a.parts.length > 1 ? 1 : 0; u < a.parts.length; u++) {
              var d = a.parts[u];
              if (o.contains(d.vertices, n.position)) {
                i.pointA = n.position, i.bodyB = e.body = a, i.pointB = {
                  x: n.position.x - a.position.x,
                  y: n.position.y - a.position.y
                }, i.angleB = a.angle, r.set(a, !1), s.trigger(e, "startdrag", {
                  mouse: n,
                  body: a
                });
                break;
              }
            }
          } else i.bodyB = e.body = null, i.pointB = null, a && s.trigger(e, "enddrag", {
            mouse: n,
            body: a
          });
        }, i._triggerEvents = function(e) {
          var t = e.mouse, n = t.sourceEvents;
          n.mousemove && s.trigger(e, "mousemove", {
            mouse: t
          }), n.mousedown && s.trigger(e, "mousedown", {
            mouse: t
          }), n.mouseup && s.trigger(e, "mouseup", {
            mouse: t
          }), a.clearSourceEvents(t);
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(2), r = n(8), a = n(1), s = n(12), l = n(3);
        i.collides = function(e, t) {
          for (var n = [], i = t.length, o = e.bounds, s = r.collides, l = a.overlaps, c = 0; c < i; c++) {
            var u = t[c], d = u.parts.length, p = 1 === d ? 0 : 1;
            if (l(u.bounds, o)) for (var f = p; f < d; f++) {
              var v = u.parts[f];
              if (l(v.bounds, o)) {
                var y = s(v, e);
                if (y) {
                  n.push(y);
                  break;
                }
              }
            }
          }
          return n;
        }, i.ray = function(e, t, n, r) {
          r = r || 1e-100;
          for (var a = o.angle(t, n), l = o.magnitude(o.sub(t, n)), c = .5 * (n.x + t.x), u = .5 * (n.y + t.y), d = s.rectangle(c, u, l, r, {
            angle: a
          }), p = i.collides(d, e), f = 0; f < p.length; f += 1) {
            var v = p[f];
            v.body = v.bodyB = v.bodyA;
          }
          return p;
        }, i.region = function(e, t, n) {
          for (var i = [], o = 0; o < e.length; o++) {
            var r = e[o], s = a.overlaps(r.bounds, t);
            (s && !n || !s && n) && i.push(r);
          }
          return i;
        }, i.point = function(e, t) {
          for (var n = [], i = 0; i < e.length; i++) {
            var o = e[i];
            if (a.contains(o.bounds, t)) for (var r = 1 === o.parts.length ? 0 : 1; r < o.parts.length; r++) {
              var s = o.parts[r];
              if (a.contains(s.bounds, t) && l.contains(s.vertices, t)) {
                n.push(o);
                break;
              }
            }
          }
          return n;
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(4), r = n(18), a = n(0);
        !function() {
          var e, t, n;
          "undefined" != typeof window && (e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame, 
          t = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), 
          e || (e = function(e) {
            n = setTimeout((function() {
              e(a.now());
            }), 1e3 / 60);
          }, t = function() {
            clearTimeout(n);
          }), i.create = function(e) {
            var t = a.extend({
              fps: 60,
              correction: 1,
              deltaSampleSize: 60,
              counterTimestamp: 0,
              frameCounter: 0,
              deltaHistory: [],
              timePrev: null,
              timeScalePrev: 1,
              frameRequestId: null,
              isFixed: !1,
              enabled: !0
            }, e);
            return t.delta = t.delta || 1e3 / t.fps, t.deltaMin = t.deltaMin || 1e3 / t.fps, 
            t.deltaMax = t.deltaMax || 1e3 / (.5 * t.fps), t.fps = 1e3 / t.delta, t;
          }, i.run = function(t, n) {
            return void 0 !== t.positionIterations && (n = t, t = i.create()), function o(r) {
              t.frameRequestId = e(o), r && t.enabled && i.tick(t, n, r);
            }(), t;
          }, i.tick = function(e, t, n) {
            var i, a = t.timing, s = 1, l = {
              timestamp: a.timestamp
            };
            o.trigger(e, "beforeTick", l), e.isFixed ? i = e.delta : (i = n - e.timePrev || e.delta, 
            e.timePrev = n, e.deltaHistory.push(i), e.deltaHistory = e.deltaHistory.slice(-e.deltaSampleSize), 
            s = (i = (i = (i = Math.min.apply(null, e.deltaHistory)) < e.deltaMin ? e.deltaMin : i) > e.deltaMax ? e.deltaMax : i) / e.delta, 
            e.delta = i), 0 !== e.timeScalePrev && (s *= a.timeScale / e.timeScalePrev), 0 === a.timeScale && (s = 0), 
            e.timeScalePrev = a.timeScale, e.correction = s, e.frameCounter += 1, n - e.counterTimestamp >= 1e3 && (e.fps = e.frameCounter * ((n - e.counterTimestamp) / 1e3), 
            e.counterTimestamp = n, e.frameCounter = 0), o.trigger(e, "tick", l), o.trigger(e, "beforeUpdate", l), 
            r.update(t, i, s), o.trigger(e, "afterUpdate", l), o.trigger(e, "afterTick", l);
          }, i.stop = function(e) {
            t(e.frameRequestId);
          }, i.start = function(e, t) {
            i.run(e, t);
          };
        }();
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(8), r = n(0).deprecated;
        i.collides = function(e, t) {
          return o.collides(e, t);
        }, r(i, "collides", "SAT.collides ➤ replaced by Collision.collides");
      }, function(e, t, n) {
        var i = {};
        e.exports = i, n(1);
        var o = n(0);
        i.pathToVertices = function(e, t) {
          "undefined" == typeof window || "SVGPathSeg" in window || o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
          var n, r, a, s, l, c, u, d, p, f, v, y = [], m = 0, g = 0, x = 0;
          t = t || 15;
          var h = function(e, t, n) {
            var i = n % 2 == 1 && n > 1;
            if (!p || e != p.x || t != p.y) {
              p && i ? (f = p.x, v = p.y) : (f = 0, v = 0);
              var o = {
                x: f + e,
                y: v + t
              };
              !i && p || (p = o), y.push(o), g = f + e, x = v + t;
            }
          }, b = function(e) {
            var t = e.pathSegTypeAsLetter.toUpperCase();
            if ("Z" !== t) {
              switch (t) {
               case "M":
               case "L":
               case "T":
               case "C":
               case "S":
               case "Q":
                g = e.x, x = e.y;
                break;

               case "H":
                g = e.x;
                break;

               case "V":
                x = e.y;
              }
              h(g, x, e.pathSegType);
            }
          };
          for (i._svgPathToAbsolute(e), a = e.getTotalLength(), c = [], n = 0; n < e.pathSegList.numberOfItems; n += 1) c.push(e.pathSegList.getItem(n));
          for (u = c.concat(); m < a; ) {
            if ((l = c[e.getPathSegAtLength(m)]) != d) {
              for (;u.length && u[0] != l; ) b(u.shift());
              d = l;
            }
            switch (l.pathSegTypeAsLetter.toUpperCase()) {
             case "C":
             case "T":
             case "S":
             case "Q":
             case "A":
              s = e.getPointAtLength(m), h(s.x, s.y, 0);
            }
            m += t;
          }
          for (n = 0, r = u.length; n < r; ++n) b(u[n]);
          return y;
        }, i._svgPathToAbsolute = function(e) {
          for (var t, n, i, o, r, a, s = e.pathSegList, l = 0, c = 0, u = s.numberOfItems, d = 0; d < u; ++d) {
            var p = s.getItem(d), f = p.pathSegTypeAsLetter;
            if (/[MLHVCSQTA]/.test(f)) "x" in p && (l = p.x), "y" in p && (c = p.y); else switch ("x1" in p && (i = l + p.x1), 
            "x2" in p && (r = l + p.x2), "y1" in p && (o = c + p.y1), "y2" in p && (a = c + p.y2), 
            "x" in p && (l += p.x), "y" in p && (c += p.y), f) {
             case "m":
              s.replaceItem(e.createSVGPathSegMovetoAbs(l, c), d);
              break;

             case "l":
              s.replaceItem(e.createSVGPathSegLinetoAbs(l, c), d);
              break;

             case "h":
              s.replaceItem(e.createSVGPathSegLinetoHorizontalAbs(l), d);
              break;

             case "v":
              s.replaceItem(e.createSVGPathSegLinetoVerticalAbs(c), d);
              break;

             case "c":
              s.replaceItem(e.createSVGPathSegCurvetoCubicAbs(l, c, i, o, r, a), d);
              break;

             case "s":
              s.replaceItem(e.createSVGPathSegCurvetoCubicSmoothAbs(l, c, r, a), d);
              break;

             case "q":
              s.replaceItem(e.createSVGPathSegCurvetoQuadraticAbs(l, c, i, o), d);
              break;

             case "t":
              s.replaceItem(e.createSVGPathSegCurvetoQuadraticSmoothAbs(l, c), d);
              break;

             case "a":
              s.replaceItem(e.createSVGPathSegArcAbs(l, c, p.r1, p.r2, p.angle, p.largeArcFlag, p.sweepFlag), d);
              break;

             case "z":
             case "Z":
              l = t, c = n;
            }
            "M" != f && "m" != f || (t = l, n = c);
          }
        };
      }, function(e, t, n) {
        var i = {};
        e.exports = i;
        var o = n(5);
        n(0), i.create = o.create, i.add = o.add, i.remove = o.remove, i.clear = o.clear, 
        i.addComposite = o.addComposite, i.addBody = o.addBody, i.addConstraint = o.addConstraint;
      } ]);
    }
  }, __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
    module.exports;
  }
  __webpack_require__.n = module => {
    var getter = module && module.__esModule ? () => module.default : () => module;
    return __webpack_require__.d(getter, {
      a: getter
    }), getter;
  }, __webpack_require__.d = (exports, definition) => {
    for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
      enumerable: !0,
      get: definition[key]
    });
  }, __webpack_require__.g = function() {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  }(), __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
  (() => {
    "use strict";
    const settings = class {
      static STORAGE_KEY_TOKEN="floating_window_token";
      static STORAGE_KEY_POSITION="floating_window_position";
      static STORAGE_KEY_MUTE="video_mute";
      static STORAGE_KEY_SPEED="video_speed";
      static STORAGE_KEY_EXAM_MODE="exam_mode";
      static STORAGE_KEY_USERNAME="username";
      static STORAGE_KEY_CREATE_TIME="create_time";
      static STORAGE_KEY_DEEPSEEK_API_KEY="deepseek_api_key";
      static STORAGE_KEY_DEEPSEEKPROXY="deepseekproxy";
      static STORAGE_KEY_DO_VIDEO="do_video";
      static get createTime() {
        return localStorage.getItem(this.STORAGE_KEY_CREATE_TIME);
      }
      static set createTime(value) {
        localStorage.setItem(this.STORAGE_KEY_CREATE_TIME, value);
      }
      static get deepseekApiKey() {
        return localStorage.getItem(this.STORAGE_KEY_DEEPSEEK_API_KEY) || "";
      }
      static set deepseekApiKey(value) {
        localStorage.setItem(this.STORAGE_KEY_DEEPSEEK_API_KEY, value);
      }
      static get deepseekProxy() {
        return "true" === localStorage.getItem(this.STORAGE_KEY_DEEPSEEKPROXY);
      }
      static set deepseekProxy(value) {
        localStorage.setItem(this.STORAGE_KEY_DEEPSEEKPROXY, value.toString());
      }
      static get doVideo() {
        return "true" === localStorage.getItem(this.STORAGE_KEY_DO_VIDEO);
      }
      static set doVideo(value) {
        localStorage.setItem(this.STORAGE_KEY_DO_VIDEO, value.toString());
      }
      static get username() {
        return localStorage.getItem(this.STORAGE_KEY_USERNAME);
      }
      static set username(value) {
        localStorage.setItem(this.STORAGE_KEY_USERNAME, value);
      }
      static get token() {
        return localStorage.getItem(this.STORAGE_KEY_TOKEN);
      }
      static set token(value) {
        localStorage.setItem(this.STORAGE_KEY_TOKEN, value);
      }
      static get position() {
        const position = localStorage.getItem(this.STORAGE_KEY_POSITION);
        return position ? JSON.parse(position) : {
          left: 0,
          top: 0
        };
      }
      static set position(value) {
        localStorage.setItem(this.STORAGE_KEY_POSITION, JSON.stringify(value));
      }
      static get speed() {
        return localStorage.getItem(this.STORAGE_KEY_SPEED) || "1";
      }
      static set speed(value) {
        localStorage.setItem(this.STORAGE_KEY_SPEED, String(value));
      }
      static get mute() {
        return "true" === localStorage.getItem(this.STORAGE_KEY_MUTE);
      }
      static set mute(value) {
        localStorage.setItem(this.STORAGE_KEY_MUTE, value.toString());
      }
      static get examMode() {
        return "true" === localStorage.getItem(this.STORAGE_KEY_EXAM_MODE);
      }
      static set examMode(value) {
        localStorage.setItem(this.STORAGE_KEY_EXAM_MODE, value.toString());
      }
    }, imageData = {
      defaultImage: "data:image/jpeg;base64,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OrmrmzYLQ6ubKzY2rebKzY2rebKzYU0urmrjc2C0Lq5q43Njarq5q43Njarq5q5WbG1brmrlZsbVuubKzY2rdc1crNjat1zVys2Nq3XNXKzY2rdcquUcrG1X1zVxtc1cbTS7KrlZsK03XNXNmwWh1c1c2bG1dXNXNmxtXVzVzZsbV1c1c2bG1dXNXNmxtXVzVzZsbTTq5q5s2NodXNXNmxtXVzVzZsbVrNnDc2KXuWbOG5sVe5b5t84bmxV7lvm3zhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuW+bfOG5sVe5b5t84bmxQ9yzZw3Nil7lmzhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFD3LNnDc2KXuW+bfOG5sVe5b5t84bmxS9yzZw3Nir3LNnDc2KHuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuWbOG5sVe5Zs4bmxV7lmzhubFXuW+bfOG5sVe5Zs4bmxV7lmzhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuObOHZsVe5Zs4bmxS9yzb5w3Nir3LfNvnDc2KHuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFXuW+bfOG5sVe5b5t84bmxV7lvm3zhubFX//Z",
      weChatQr: "data:image/jpeg;base64,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DyCK+1P+CUv7Ufwx/Zr/AOFo/wDCxvE3/CO/21/Zf2D/AEC6uvO8n7X5n+oifbjzY/vYzu4zg48s/wCCov8AyfR8Tfrpn/prta+VKAP6Jfhb+3n8DPjT4703wd4O8cf2z4k1LzfstkNIv4PM8uJ5X+eWBEGERjywzjA5IFfQWK/AT/glz/yfX8M/pqf/AKbLuv38oA/AI/8ABLz9pz/omX/le0v/AOSa+fvij8L/ABN8GfHWp+DvGOmf2P4j03yhd2XnxT+X5kSSp88TMhykinhj1weQRX9P1fgF/wAFRf8Ak+j4m/XTP/TXa0Aepf8ABKb9qH4Zfs2n4oj4jeJv+EcGtf2X9g/0C5uvO8n7X5n+oifbjzY/vYznjODj6q/aj/aj+GP7Z/wI8TfBv4O+JD4v+I/iX7N/ZWi/2fdWP2j7PdRXU3765iihTbDbyv8AM4ztwMsQD+LAr6q/4Je/8n0/DX/uJ/8Apsu6AD/h11+07/0TL/yvaZ/8k1+qn/D0b9mPGf8AhZnHr/YGqf8AyNX1VX8rP8NAH9Pnwu+KPhj4z+BdM8ZeDtT/ALY8N6l5v2S9+zyweZ5crxP8kqq4w8bjlRnGRkEGvin/AIKt/su/E39pL/hV3/CufDP/AAkX9jf2p9v/ANPtbXyfO+yeX/r5U3Z8qT7ucbecZGfVv+CXX/Jinwy/7iX/AKdLuvqqgD8gP2Cv2DPjn8F/2sPA3jPxl4H/ALH8OaZ9u+1Xv9r2E/l+ZYXESfJFOznLyIOFPXJwATX6/wBJiloA+UT/AMFRP2ZP+imf+UHVP/kavyH/AG8fih4X+M37Vnjnxj4O1P8Atnw5qRsvsl79nlg8zy7G3if5JVVxh0ccgZxkZBBr5+Vc80h4NAH6Af8ABKb9qP4Zfs2f8LR/4WN4m/4R3+2v7L+wf6BdXXneT9r8z/URPtx5sf3sZ3cZwce+/t5/t5/Az40/sneOvBvg7xwNY8Sal9h+y2Q0i/h8zy7+3lf55YFQYSNzywzjAySBX5BUUwCv6qK/lXr+qihgfgF/wVG/5Pr+Jf8A3DP/AE12lfK5JNfVH/BUb/k+v4mf9wz/ANNdpXytTA9//YM+J/hn4M/tYeBvGPjHUv7I8Oab9v8AtV79nln8vzLC4iT5IlZzl5EHCnGcnABNfr3/AMPRv2Yv+il/+UHU/wD5Gr8BabQB/VRRRRUgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2bhK9z8AAAAA+NalPSB03rj7PoYA79ek/w==",
      fingerEmoji: "data:image/png;base64,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",
      zzxLogo: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX+WbvuWxgl8xIiBkYXRhLW5hbWU9IuWbvuWxgiAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTAuMjQgNTEwLjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZjdmOGY4OwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICM2YWM2ZGM7CiAgICAgICAgc3Ryb2tlOiAjYTJkOWVkOwogICAgICAgIHN0cm9rZS1taXRlcmxpbWl0OiAxMDsKICAgICAgICBzdHJva2Utd2lkdGg6IC41cHg7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJjbHMtMiIgd2lkdGg9IjUxMC4yNCIgaGVpZ2h0PSI1MTAuMjQiIHJ4PSI5My4zIiByeT0iOTMuMyIvPgogIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQyNi44NCwyMzQuNDhjMi4wMSwxLjU3LDEuOTIsOC42OCwxLjkzLDEzLjg2LS4xNywxMi4wOC4zNiwyNy44OC0uMjcsMzkuODQtLjMsNi4zNC00LjU5LDYuNjEtOS44MSw2LjY2LTcuMTQuMDctMTQuNjQuMDEtMjEuODkuMDMtMy4wMiwwLTUuOTcsMC04LjY5LDAtOS40Ni4wNi0xNi4xNS0uMjItMjIuNDkuOS0yLjY5LjUxLTUuMzUsMS40LTcuNjksMy4wMy04LjQ0LDUuNC03LjY2LDE5LjI3LDEuNzYsMjIuNjksOC4xMiwzLjA1LDE2LjAzLDIuMjcsMjQuODEsMi41MiwxMi4zOS4wNCwzMS4wMy0uMDYsNDEuMDYuMDQsNC40MS4wOCw4LjgzLjEzLDguODcsNi41LjQzLDE1LjEzLjA0LDQ2LjU3LjE1LDYyLjcxLS4wOSw0Ljc1LjQsMTAuNzEtNS4xNCwxMC43Ni0xMy45OS42NS0zNi4zNiwwLTUxLjguMjItOS44Ni4wMy0xOS4yMiwwLTI5LjQyLS45Ny00NC4zMy0zLjM4LTgxLjYxLTI2LjM0LTg0LjM3LTc5LjkyLS45Mi0yOS44LS4xLTY5LjQ3LS4zNy05OC43LTEuMDYtMzUuNSw0LjU3LTY1LjMzLDMyLjAyLTg1LjAxLDMyLjczLTIyLjc5LDc0LjQ1LTE1LjkzLDExMi43OC0xNy4wNCwxMC41OS4zMywxNi40Ni0uNjgsMjMuMjMuNTgsNC4zOC44NCwyLjc0LDExLjU0LDMuMDgsMTcuMjcsMCwxMy45MSwwLDM2LjE4LDAsNTAuMjktLjA0LDcuNjguMzYsMTIuNjUtNi4zNywxMi43NS0xMC43OC40NC0yMi40LjA4LTMzLjIyLjE5LTExLjU1LjI0LTE4LjQ5LS44NS0yOC4xNSwyLjU1LTEwLjI1LDMuNDMtMTMuNDEsMTUuMTgtMy44MiwyMS45LDQuMDgsMi43Myw4LjgzLDMuNDksMTMuNiwzLjg4LDguNDEuNjEsMjIuMTYuMzIsMzIuNjYuMzksNC45NS4yMiwxNC43Mi0uODYsMTcuNDYsMi4wMmwuMDguMDlaIi8+CiAgPHJlY3QgY2xhc3M9ImNscy0xIiB4PSI3OC43OCIgeT0iMTI0LjQiIHdpZHRoPSIxNzcuMjMiIGhlaWdodD0iNTYuNjkiIHJ4PSIyNS41MSIgcnk9IjI1LjUxIi8+CiAgPHJlY3QgY2xhc3M9ImNscy0xIiB4PSIxMzAuMzIiIHk9IjE5OC4xNCIgd2lkdGg9Ijk1LjQzIiBoZWlnaHQ9IjU2LjY5IiByeD0iMjUuNTEiIHJ5PSIyNS41MSIvPgogIDxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMTAwLjkyIiB5PSIyNzEuODgiIHdpZHRoPSI5NS40MyIgaGVpZ2h0PSI1Ni42OSIgcng9IjI1LjUxIiByeT0iMjUuNTEiLz4KICA8cmVjdCBjbGFzcz0iY2xzLTEiIHg9Ijc4Ljc4IiB5PSIzNDQuODMiIHdpZHRoPSIxNzcuMjMiIGhlaWdodD0iNTYuNjkiIHJ4PSIyNS41MSIgcnk9IjI1LjUxIi8+Cjwvc3ZnPg=="
    };
    function findDeepestElement(element) {
      let deepestElement = element;
      for (let child of element.children) {
        const computedStyle = getComputedStyle(child);
        if ("input" === child.tagName.toLowerCase() || "center" === computedStyle.textAlign) continue;
        "span" === child.tagName.toLowerCase() && (deepestElement = child), "p" === child.tagName.toLowerCase() && (deepestElement = child);
        const deepChild = findDeepestElement(child);
        deepChild && deepChild !== child && (deepestElement = deepChild);
      }
      return deepestElement;
    }
    function insertIntoDeepestElement(parentElement, content) {
      const deepestElement = findDeepestElement(parentElement), originalText = deepestElement.textContent, newElement = document.createElement("span");
      newElement.classList.add("modified");
      const textContent = function(content) {
        const div = document.createElement("div");
        return div.innerHTML = content, div.querySelectorAll("img").forEach((img => {
          img.style.maxWidth = "100%";
        })), div.innerHTML;
      }(content);
      newElement.innerHTML = textContent, newElement.style.opacity = .2, deepestElement.appendChild(newElement), 
      deepestElement.dataset.originalText = originalText;
    }
    var matter_min = __webpack_require__("./src/utils/matter.min.js"), matter_min_default = __webpack_require__.n(matter_min);
    function createFloatingImageWorld(imageKey = "defaultImage") {
      const imageSrc = imageData[imageKey], engine = matter_min_default().Engine.create({
        gravity: {
          x: 0,
          y: 0,
          scale: 0
        }
      }), world = engine.world;
      let runner, floatingImage, mouseConstraint;
      const createWalls = () => {
        const width = window.innerWidth, height = window.innerHeight;
        return [ matter_min_default().Bodies.rectangle(width / 2, -499.5, width, 999, {
          isStatic: !0
        }), matter_min_default().Bodies.rectangle(-499.5, height / 2, 999, height, {
          isStatic: !0
        }), matter_min_default().Bodies.rectangle(width + 499.5, height / 2, 999, height, {
          isStatic: !0
        }), matter_min_default().Bodies.rectangle(width / 2, height + 499.5, width, 999, {
          isStatic: !0
        }) ];
      };
      let currentWalls = [];
      const updateWalls = () => {
        matter_min_default().World.remove(world, currentWalls), currentWalls = createWalls(), 
        matter_min_default().World.add(world, currentWalls);
      }, init = async () => {
        currentWalls = createWalls(), matter_min_default().World.add(world, currentWalls);
        try {
          const imageBody = await (src => {
            const img = document.createElement("img");
            return img.src = src, img.style.position = "fixed", img.style.transform = "translate(-50%, -50%)", 
            img.style.pointerEvents = "auto", img.style.zIndex = "9999", img.style.width = "130px", 
            img.addEventListener("dragstart", (e => e.preventDefault())), img.addEventListener("contextmenu", (e => e.preventDefault())), 
            document.body.appendChild(img), console.log("已经创建图片标签"), new Promise((resolve => {
              img.onload = () => {
                const body = matter_min_default().Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 130, 191, {
                  restitution: .8,
                  frictionAir: .002,
                  render: {
                    visible: !1
                  },
                  chamfer: {
                    radius: 5
                  }
                });
                matter_min_default().Body.setVelocity(body, {
                  x: 5 * (Math.random() - .5),
                  y: 5 * (Math.random() - .5)
                }), matter_min_default().Body.setAngularVelocity(body, .2 * (Math.random() - .5)), 
                matter_min_default().Events.on(engine, "beforeUpdate", (() => {
                  img.style.transform = "", img.style.left = "0", img.style.top = "0";
                  const angle = body.angle, translateX = body.position.x, translateY = body.position.y;
                  img.style.transform = `\n                        translate(${translateX}px, ${translateY}px)\n                        translate(-50%, -50%)\n                        rotate(${angle}rad)\n                    `;
                })), resolve(body);
              };
            }));
          })(imageSrc);
          floatingImage = imageBody, matter_min_default().World.add(world, imageBody);
          const mouse = matter_min_default().Mouse.create(document.body);
          mouseConstraint = matter_min_default().MouseConstraint.create(engine, {
            mouse: mouse
          }), matter_min_default().World.add(world, mouseConstraint), runner = matter_min_default().Runner.run(engine);
        } catch (error) {
          console.error("初始化失败:", error);
        }
      };
      return init().catch((error => console.error("初始化过程出错:", error))), window.addEventListener("resize", (() => {
        updateWalls(), console.log("已经更新边界"), document.body.style.width = window.innerWidth + "px", 
        document.body.style.height = window.innerHeight + "px";
      })), window.addEventListener("load", init), () => {
        runner && matter_min_default().Runner.stop(runner), floatingImage && matter_min_default().World.remove(world, floatingImage), 
        mouseConstraint && matter_min_default().World.remove(world, mouseConstraint), matter_min_default().World.remove(world, currentWalls), 
        window.removeEventListener("resize", updateWalls), window.removeEventListener("load", init);
        document.querySelectorAll("img").forEach((img => {
          "fixed" === img.style.position && "9999" === img.style.zIndex && img.remove();
        }));
      };
    }
    const utils_getCourseId = function() {
      const match = window.location.href.match(/course\/study\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    };
    function md5(e) {
      function t(e, t) {
        return e << t | e >>> 32 - t;
      }
      function n(e, t) {
        var n, i, r, o, a;
        return r = 2147483648 & e, o = 2147483648 & t, a = (1073741823 & e) + (1073741823 & t), 
        (n = 1073741824 & e) & (i = 1073741824 & t) ? 2147483648 ^ a ^ r ^ o : n | i ? 1073741824 & a ? 3221225472 ^ a ^ r ^ o : 1073741824 ^ a ^ r ^ o : a ^ r ^ o;
      }
      function i(e, i, r, o, a, s, l) {
        return e = n(e, n(n(function(e, t, n) {
          return e & t | ~e & n;
        }(i, r, o), a), l)), n(t(e, s), i);
      }
      function r(e, i, r, o, a, s, l) {
        return e = n(e, n(n(function(e, t, n) {
          return e & n | t & ~n;
        }(i, r, o), a), l)), n(t(e, s), i);
      }
      function o(e, i, r, o, a, s, l) {
        return e = n(e, n(n(function(e, t, n) {
          return e ^ t ^ n;
        }(i, r, o), a), l)), n(t(e, s), i);
      }
      function a(e, i, r, o, a, s, l) {
        return e = n(e, n(n(function(e, t, n) {
          return t ^ (e | ~n);
        }(i, r, o), a), l)), n(t(e, s), i);
      }
      function s(e) {
        var t, n = "", i = "";
        for (t = 0; t <= 3; t++) n += (i = "0" + (e >>> 8 * t & 255).toString(16)).substr(i.length - 2, 2);
        return n;
      }
      var l, c, u, d, h, f, p, g, m, A = Array();
      for (A = function(e) {
        for (var t, n = e.length, i = n + 8, r = 16 * ((i - i % 64) / 64 + 1), o = Array(r - 1), a = 0, s = 0; s < n; ) a = s % 4 * 8, 
        o[t = (s - s % 4) / 4] = o[t] | e.charCodeAt(s) << a, s++;
        return a = s % 4 * 8, o[t = (s - s % 4) / 4] = o[t] | 128 << a, o[r - 2] = n << 3, 
        o[r - 1] = n >>> 29, o;
      }(e = function(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
          var i = e.charCodeAt(n);
          i < 128 ? t += String.fromCharCode(i) : i > 127 && i < 2048 ? (t += String.fromCharCode(i >> 6 | 192), 
          t += String.fromCharCode(63 & i | 128)) : (t += String.fromCharCode(i >> 12 | 224), 
          t += String.fromCharCode(i >> 6 & 63 | 128), t += String.fromCharCode(63 & i | 128));
        }
        return t;
      }(e)), f = 1732584193, p = 4023233417, g = 2562383102, m = 271733878, l = 0; l < A.length; l += 16) c = f, 
      u = p, d = g, h = m, f = i(f, p, g, m, A[l + 0], 7, 3614090360), m = i(m, f, p, g, A[l + 1], 12, 3905402710), 
      g = i(g, m, f, p, A[l + 2], 17, 606105819), p = i(p, g, m, f, A[l + 3], 22, 3250441966), 
      f = i(f, p, g, m, A[l + 4], 7, 4118548399), m = i(m, f, p, g, A[l + 5], 12, 1200080426), 
      g = i(g, m, f, p, A[l + 6], 17, 2821735955), p = i(p, g, m, f, A[l + 7], 22, 4249261313), 
      f = i(f, p, g, m, A[l + 8], 7, 1770035416), m = i(m, f, p, g, A[l + 9], 12, 2336552879), 
      g = i(g, m, f, p, A[l + 10], 17, 4294925233), p = i(p, g, m, f, A[l + 11], 22, 2304563134), 
      f = i(f, p, g, m, A[l + 12], 7, 1804603682), m = i(m, f, p, g, A[l + 13], 12, 4254626195), 
      g = i(g, m, f, p, A[l + 14], 17, 2792965006), f = r(f, p = i(p, g, m, f, A[l + 15], 22, 1236535329), g, m, A[l + 1], 5, 4129170786), 
      m = r(m, f, p, g, A[l + 6], 9, 3225465664), g = r(g, m, f, p, A[l + 11], 14, 643717713), 
      p = r(p, g, m, f, A[l + 0], 20, 3921069994), f = r(f, p, g, m, A[l + 5], 5, 3593408605), 
      m = r(m, f, p, g, A[l + 10], 9, 38016083), g = r(g, m, f, p, A[l + 15], 14, 3634488961), 
      p = r(p, g, m, f, A[l + 4], 20, 3889429448), f = r(f, p, g, m, A[l + 9], 5, 568446438), 
      m = r(m, f, p, g, A[l + 14], 9, 3275163606), g = r(g, m, f, p, A[l + 3], 14, 4107603335), 
      p = r(p, g, m, f, A[l + 8], 20, 1163531501), f = r(f, p, g, m, A[l + 13], 5, 2850285829), 
      m = r(m, f, p, g, A[l + 2], 9, 4243563512), g = r(g, m, f, p, A[l + 7], 14, 1735328473), 
      f = o(f, p = r(p, g, m, f, A[l + 12], 20, 2368359562), g, m, A[l + 5], 4, 4294588738), 
      m = o(m, f, p, g, A[l + 8], 11, 2272392833), g = o(g, m, f, p, A[l + 11], 16, 1839030562), 
      p = o(p, g, m, f, A[l + 14], 23, 4259657740), f = o(f, p, g, m, A[l + 1], 4, 2763975236), 
      m = o(m, f, p, g, A[l + 4], 11, 1272893353), g = o(g, m, f, p, A[l + 7], 16, 4139469664), 
      p = o(p, g, m, f, A[l + 10], 23, 3200236656), f = o(f, p, g, m, A[l + 13], 4, 681279174), 
      m = o(m, f, p, g, A[l + 0], 11, 3936430074), g = o(g, m, f, p, A[l + 3], 16, 3572445317), 
      p = o(p, g, m, f, A[l + 6], 23, 76029189), f = o(f, p, g, m, A[l + 9], 4, 3654602809), 
      m = o(m, f, p, g, A[l + 12], 11, 3873151461), g = o(g, m, f, p, A[l + 15], 16, 530742520), 
      f = a(f, p = o(p, g, m, f, A[l + 2], 23, 3299628645), g, m, A[l + 0], 6, 4096336452), 
      m = a(m, f, p, g, A[l + 7], 10, 1126891415), g = a(g, m, f, p, A[l + 14], 15, 2878612391), 
      p = a(p, g, m, f, A[l + 5], 21, 4237533241), f = a(f, p, g, m, A[l + 12], 6, 1700485571), 
      m = a(m, f, p, g, A[l + 3], 10, 2399980690), g = a(g, m, f, p, A[l + 10], 15, 4293915773), 
      p = a(p, g, m, f, A[l + 1], 21, 2240044497), f = a(f, p, g, m, A[l + 8], 6, 1873313359), 
      m = a(m, f, p, g, A[l + 15], 10, 4264355552), g = a(g, m, f, p, A[l + 6], 15, 2734768916), 
      p = a(p, g, m, f, A[l + 13], 21, 1309151649), f = a(f, p, g, m, A[l + 4], 6, 4149444226), 
      m = a(m, f, p, g, A[l + 11], 10, 3174756917), g = a(g, m, f, p, A[l + 2], 15, 718787259), 
      p = a(p, g, m, f, A[l + 9], 21, 3951481745), f = n(f, c), p = n(p, u), g = n(g, d), 
      m = n(m, h);
      return (s(f) + s(p) + s(g) + s(m)).toLowerCase();
    }
    let isDoVideoRunning = !1, doVideoModal = null, doVideoStyle = null;
    function createAjaxTimestamp() {
      return function(e) {
        for (var t = e || 32, n = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", r = "", o = 0; o < t; o++) r += n.charAt(Math.floor(48 * Math.random()));
        return r;
      }(32) + Date.parse(new Date);
    }
    function updateDoVideoProgress(current, total, currentName) {
      if (!doVideoModal) return;
      const progressElement = doVideoModal.querySelector("#do-video-progress"), currentElement = doVideoModal.querySelector("#do-video-current"), progress = current / total * 100, progressBar = "#".repeat(Math.floor(progress / 10)) + "-".repeat(10 - Math.floor(progress / 10));
      progressElement.textContent = `进度: ${current}/${total} ${progressBar} [${Math.floor(progress)}%]`, 
      currentElement.textContent = `当前: ${currentName}`;
    }
    function closeDoVideoModal() {
      doVideoModal && (document.body.removeChild(doVideoModal), doVideoModal = null), 
      doVideoStyle && (document.head.removeChild(doVideoStyle), doVideoStyle = null);
    }
    async function doVideo() {
      if (isDoVideoRunning) return void console.log("doVideo已在运行中");
      isDoVideoRunning = !0, doVideoStyle = document.createElement("style"), doVideoStyle.textContent = "\n    .do-video-modal {\n      position: fixed;\n      top: 50%;\n      left: 50%;\n      transform: translate(-50%, -50%);\n      background: white;\n      padding: 20px;\n      border-radius: 8px;\n      box-shadow: 0 0 10px rgba(0,0,0,0.3);\n      z-index: 9999;\n      width: 400px;\n      height: 200px;\n      text-align: center;\n      font-family: Arial, sans-serif;\n      overflow: auto;\n    }\n    .do-video-spinner {\n      border: 4px solid #f3f3f3;\n      border-top: 4px solid #3498db;\n      border-radius: 50%;\n      width: 30px;\n      height: 30px;\n      animation: spin 2s linear infinite;\n      margin: 15px auto;\n    }\n    @keyframes spin {\n      0% { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n    .do-video-actions {\n      margin-top: 15px;\n    }\n    .do-video-progress {\n      margin: 10px 0;\n      font-size: 14px;\n      color: #333;\n    }\n    .do-video-current {\n      margin: 5px 0;\n      font-size: 12px;\n      color: #666;\n      word-break: break-all;\n    }\n  ", 
      doVideoStyle.setAttribute("data-for", "do-video-modal"), document.head.appendChild(doVideoStyle), 
      doVideoModal = document.createElement("div"), doVideoModal.className = "do-video-modal", 
      doVideoModal.innerHTML = '\n    <h3>正在完成课程</h3>\n    <div class="do-video-spinner"></div>\n    <div class="do-video-progress" id="do-video-progress">准备中...</div>\n    <div class="do-video-current" id="do-video-current"></div>\n  ', 
      document.body.appendChild(doVideoModal);
      const courseId = utils_getCourseId();
      try {
        const videoList = await async function(courseId) {
          const time = createAjaxTimestamp(), url = `https://www.zjooc.cn/ajax?service=/jxxt/api/course/courseStudent/getStudentCourseChapters&params[pageNo]=1&params[courseId]=${courseId}&params[urlNeed]=0&time=${time}&checkTimeout=true`;
          try {
            const signcheck = md5(Date.parse(new Date) + "gxpt_lanao"), timedate = Date.parse(new Date), response = await fetch(url, {
              headers: {
                signcheck: signcheck,
                timedate: timedate
              }
            }), content = await response.text(), data = JSON.parse(content), videoMsg = [];
            return data.data && Array.isArray(data.data) && data.data.forEach((chapter => {
              const chapterName = chapter.name;
              chapter.children && Array.isArray(chapter.children) && chapter.children.forEach((section => {
                const sectionName = section.name;
                section.children && Array.isArray(section.children) && section.children.forEach((resource => {
                  const videoInfo = {
                    Name: `${chapterName}-${sectionName}-${resource.name}`,
                    courseId: courseId,
                    chapterId: resource.id,
                    learnStatus: resource.learnStatus || 0,
                    time: resource.vedioTimeLength || 0
                  };
                  videoMsg.push(videoInfo);
                }));
              }));
            })), videoMsg;
          } catch (error) {
            throw console.error("获取视频信息失败:", error), error;
          }
        }(courseId), videoCount = videoList.length;
        if (0 === videoCount) return updateDoVideoProgress(0, 0, "没有未完成的视频！"), void setTimeout((() => {
          closeDoVideoModal(), isDoVideoRunning = !1;
        }), 2e3);
        for (let idx = 0; idx < videoCount; idx++) {
          if (!isDoVideoRunning) return void console.log("doVideo被用户停止");
          const video = videoList[idx];
          updateDoVideoProgress(idx + 1, videoCount, video.Name);
          const time = createAjaxTimestamp(), checkTimeout = !0;
          let url;
          url = video.time > 0 ? `https://www.zjooc.cn/ajax?service=/learningmonitor/api/learning/monitor/videoPlaying&params[chapterId]=${video.chapterId}&params[courseId]=${video.courseId}&params[playTime]=${video.time}&params[percent]=100&time=${time}&checkTimeout=${checkTimeout}` : `https://www.zjooc.cn/ajax?service=/learningmonitor/api/learning/monitor/finishTextChapter&params[courseId]=${video.courseId}&params[chapterId]=${video.chapterId}&time=${time}&checkTimeout=${checkTimeout}`;
          const signcheck = md5(Date.parse(new Date) + "gxpt_lanao"), timedate = Date.parse(new Date);
          await fetch(url, {
            headers: {
              signcheck: signcheck,
              timedate: timedate
            }
          }), console.log(`${video.Name}正在完成！[${Math.floor((idx + 1) / videoCount * 100)}%]`), 
          await new Promise((resolve => setTimeout(resolve, 100)));
        }
        return doVideoModal && isDoVideoRunning && (doVideoModal.innerHTML = `\n        <h3>✅ 完成</h3>\n        <p>所有课程都已完成！</p>\n        <p>共完成 ${videoCount} 个课程</p>\n        <div class="do-video-actions">\n          <button id="do-video-close-btn">关闭</button>\n        </div>\n      `, 
        doVideoModal.querySelector("#do-video-close-btn").addEventListener("click", (() => {
          closeDoVideoModal();
        }))), console.log("全部完成！"), isDoVideoRunning = !1, !0;
      } catch (error) {
        throw console.error("执行视频学习失败:", error), doVideoModal && isDoVideoRunning && (doVideoModal.innerHTML = `\n        <h3>❌ 错误</h3>\n        <p>执行失败: ${error.message}</p>\n        <div class="do-video-actions">\n          <button id="do-video-close-btn">关闭</button>\n        </div>\n      `, 
        doVideoModal.querySelector("#do-video-close-btn").addEventListener("click", (() => {
          closeDoVideoModal();
        }))), isDoVideoRunning = !1, error;
      }
    }
    let isRunning = !0, currentVideoElement = null;
    function findLessons() {
      const allITags = document.getElementsByTagName("i");
      return Array.from(allITags).filter((tag => tag.classList.contains("iconfont") && "SPAN" === tag.parentElement.tagName && !tag.classList.contains("icon-bianji")));
    }
    async function playVideo() {
      if (!isRunning) return;
      let errorCount = 0, stuckCheckInterval = null, lastTime = null, stuckCounter = 0;
      function startStuckDetection(video, onStuck) {
        function checkStuck() {
          try {
            const currentTime = video.currentTime;
            console.log("检测中 - 当前时间:", currentTime, "上次时间:", lastTime), null !== lastTime && Math.abs(lastTime - currentTime) < .1 ? (stuckCounter++, 
            console.log("视频可能卡住，计数:", stuckCounter), stuckCounter >= 4 && (stuckCounter = 0, 
            console.log("视频已卡住超过阈值"), onStuck())) : stuckCounter = 0, lastTime = currentTime;
          } catch (e) {
            console.error("卡住检测出错:", e);
          }
        }
        return console.log("开始视频卡住检测"), checkStuck(), stuckCheckInterval = setInterval(checkStuck, 1e3), 
        console.log("卡住检测定时器已启动，ID:", stuckCheckInterval), stuckCheckInterval;
      }
      return new Promise(((resolve, reject) => {
        console.log("开始准备播放视频..."), setTimeout((() => {
          const video = document.querySelector("video");
          if (!video) return reject(new Error("未找到视频元素")), resolve();
          currentVideoElement = video, video.muted = settings.mute, video.playbackRate = parseFloat(settings.speed) || 1;
          let playTimer = null;
          const handleEnd = () => {
            stuckCheckInterval && (console.log("清理卡住检测定时器"), clearInterval(stuckCheckInterval)), 
            playTimer && clearTimeout(playTimer), currentVideoElement = null, console.log("视频播放完成"), 
            resolve();
          }, handleError = () => {
            if (stuckCheckInterval && (console.log("清理卡住检测定时器"), clearInterval(stuckCheckInterval)), 
            playTimer && clearTimeout(playTimer), errorCount++, console.log(`视频播放异常 (第${errorCount}次)`), 
            errorCount >= 3) return console.log("视频播放失败次数超过限制，终止播放"), void reject(new Error("视频播放失败次数超过限制"));
            setTimeout((() => {
              console.log("尝试重新播放视频"), video.play().catch((() => {
                handleError();
              })), setTimeout((() => {
                console.log("重新启动卡住检测"), lastTime = null, stuckCounter = 0, startStuckDetection(video, (() => {
                  handleError();
                }));
              }), 5e3);
            }), 1e3);
          };
          startStuckDetection(video, (() => {
            handleError();
          })), video.addEventListener("ended", handleEnd, {
            once: !0
          }), video.addEventListener("error", handleError, {
            once: !0
          });
          const setupTimer = () => {
            const duration = video.duration;
            if (isNaN(duration) || !isFinite(duration)) playTimer = setTimeout(handleEnd, 1e4), 
            console.log("无法获取视频时长，将播放至少10秒"); else {
              const actualPlayTime = Math.max(1e3 * duration, 1e4);
              playTimer = setTimeout(handleEnd, actualPlayTime), console.log(`视频时长${duration}秒，将播放${actualPlayTime / 1e3}秒`);
            }
          };
          video.readyState >= 1 ? setupTimer() : video.addEventListener("loadedmetadata", setupTimer, {
            once: !0
          }), console.log("开始播放视频"), video.play().catch((err => {
            console.log("视频播放失败:", err), handleError();
          }));
        }), 1e3);
      }));
    }
    async function completeLesson() {
      for (let retry = 0; retry < 3; retry++) {
        const button = Array.from(document.querySelectorAll("button")).find((btn => btn.textContent.includes("完成学习")));
        if (button) return button.disabled = !1, button.click(), await new Promise((r => setTimeout(r, 2e3))), 
        !0;
        await new Promise((r => setTimeout(r, 1e3)));
      }
      return !1;
    }
    function stopAutoPlay() {
      console.log("正在停止自动播放..."), isRunning = !1;
      try {
        isDoVideoRunning = !1, closeDoVideoModal(), console.log("doVideo已停止"), console.log("已停止doVideo执行");
      } catch (error) {
        console.error("停止doVideo时出错:", error);
      }
      if (currentVideoElement) try {
        console.log("正在停止视频播放"), currentVideoElement.pause(), currentVideoElement.removeAttribute("src"), 
        currentVideoElement.load();
        [ "ended", "error", "loadedmetadata", "play" ].forEach((event => {
          currentVideoElement.removeEventListener(event, (() => {}));
        })), currentVideoElement = null;
      } catch (error) {
        console.error("停止视频播放时出错:", error);
      }
      const timers = window.setTimeout((() => {}), 0);
      for (let i = 0; i <= timers; i++) window.clearTimeout(i);
      const intervals = window.setInterval((() => {}), 0);
      for (let i = 0; i <= intervals; i++) window.clearInterval(i);
      try {
        const existingModal = document.querySelector(".task-modal");
        if (existingModal) {
          console.log("正在关闭任务选择窗口");
          const modalStyle = document.querySelector('style[data-for="task-modal"]');
          modalStyle && document.body.removeChild(modalStyle), document.body.removeChild(existingModal);
        }
      } catch (error) {
        console.error("关闭任务选择窗口时出错:", error);
      }
      try {
        const doVideoModal = document.querySelector(".do-video-modal");
        if (doVideoModal) {
          console.log("正在关闭doVideo窗口");
          const doVideoStyle = document.querySelector('style[data-for="do-video-modal"]');
          doVideoStyle && document.head.removeChild(doVideoStyle), document.body.removeChild(doVideoModal);
        }
      } catch (error) {
        console.error("关闭doVideo窗口时出错:", error);
      }
      console.log("自动播放已完全停止");
    }
    async function autoPlay(parsedData, listenRouteWarpper) {
      if (isRunning = !0, console.log("视频速刷：", settings.doVideo), settings.doVideo) return await doVideo(), 
      [ "success", "所有任务已完成" ];
      const sections = Array.from(document.querySelectorAll("li span.of_eno")).filter((span => "LI" === span.parentElement.tagName));
      if (!sections.length) return console.log("未找到节元素"), [ "error", "请进入 章节内容>任意课件 再尝试自动播放" ];
      if (!parsedData || 0 === Object.keys(parsedData).length) return console.log("未找到数据"), 
      [ "error", "定位未完成课件失败,可能由于页面被刷新，正在从头排查课件" ];
      const defaultTasks = function(parsedData) {
        let globalSectionIndex = 0;
        return (parsedData.data || []).flatMap((chapter => (chapter.children || []).map(((section, localSectionIndex) => {
          const currentSectionIndex = globalSectionIndex++, lessons = (section.children || []).map(((lesson, lessonIndex) => 2 !== lesson.learnStatus ? {
            index: lessonIndex,
            resourceType: lesson.resourceType,
            chapterName: "",
            sectionName: section.name,
            lessonName: lesson.name
          } : null)).filter(Boolean);
          return lessons.length ? [ currentSectionIndex, lessons ] : null;
        })).filter(Boolean)));
      }(parsedData), taskTree = function(parsedData, defaultTasks) {
        const taskMap = new Map;
        defaultTasks.forEach((([sectionIndex, lessons]) => {
          lessons.forEach((lesson => {
            taskMap.set(`${sectionIndex}-${lesson.index}`, !0);
          }));
        }));
        let globalSectionIndex = 0;
        return parsedData.data.map(((chapter, chapterIndex) => {
          const chapterChildren = chapter.children.map(((section, localSectionIndex) => {
            const currentSectionIndex = globalSectionIndex++;
            return {
              name: section.name,
              sectionIndex: currentSectionIndex,
              children: section.children.map(((lesson, lessonIndex) => {
                const isNotCompleted = 2 !== lesson.learnStatus;
                return {
                  name: lesson.name,
                  chapterIndex: chapterIndex,
                  sectionIndex: currentSectionIndex,
                  lessonIndex: lessonIndex,
                  resourceType: lesson.resourceType,
                  defaultSelected: isNotCompleted,
                  selected: taskMap.has(`${currentSectionIndex}-${lessonIndex}`) || isNotCompleted
                };
              }))
            };
          }));
          return {
            name: chapter.name,
            children: chapterChildren
          };
        }));
      }(parsedData, defaultTasks), selectedTasks = await function(taskTree) {
        return new Promise((resolve => {
          const style = document.createElement("style");
          style.textContent = "\n  .task-modal {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background: white;\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 0 10px rgba(0,0,0,0.3);\n    z-index: 9999;\n    max-width: 80%;\n    max-height: 80vh;\n    overflow: auto;\n    width: 500px;\n  }\n  .task-tree {\n    margin: 10px 0;\n  }\n  .task-item {\n    margin-left: 20px;\n    padding: 5px 0;\n    word-break: break-word;\n    overflow-wrap: break-word;\n  }\n  .modal-actions {\n    text-align: right;\n    margin-top: 15px;\n  }\n  .task-checkbox {\n    margin-right: 8px;\n  }\n", 
          style.setAttribute("data-for", "task-modal");
          const modal = document.createElement("div");
          modal.className = "task-modal";
          const renderTree = (items, depth = 0) => items.map((item => `\n        <div class="task-item" style="margin-left: ${20 * depth}px">\n          ${item.children ? `\n            <strong>${item.name}</strong>\n            ${renderTree(item.children, depth + 1)}\n          ` : `\n            <label>\n              <input type="checkbox" \n                class="task-checkbox" \n                ${item.selected ? "checked" : ""}\n                data-section="${item.sectionIndex}"\n                data-lesson="${item.lessonIndex}"\n                data-resource-type="${item.resourceType}">\n              ${item.name} (${1 === item.resourceType ? "视频" : "文档"})\n            </label>\n          `}\n        </div>\n      `)).join("");
          modal.innerHTML = `\n      <h3>请选择要完成的课件</h3>\n      <div class="task-tree">\n        ${renderTree(taskTree)}\n      </div>\n      <div class="modal-actions">\n        <button id="confirm-btn">开始任务</button>\n        <button id="cancel-btn">取消</button>\n      </div>\n    `, 
          modal.querySelector("#confirm-btn").addEventListener("click", (() => {
            const selectedTasks = [], checkboxes = modal.querySelectorAll("input.task-checkbox:checked");
            console.log("选中的复选框数量:", checkboxes.length), checkboxes.forEach((checkbox => {
              const sectionIndex = parseInt(checkbox.dataset.section, 10), lessonIndex = parseInt(checkbox.dataset.lesson, 10), resourceType = parseInt(checkbox.dataset.resourceType, 10);
              isNaN(sectionIndex) || isNaN(lessonIndex) || isNaN(resourceType) ? console.error("无效的任务数据:", checkbox.dataset) : selectedTasks.push({
                sectionIndex: sectionIndex,
                lessonIndex: lessonIndex,
                resourceType: resourceType
              });
            })), console.log("最终选择的任务:", selectedTasks), document.body.removeChild(modal), document.body.removeChild(style), 
            resolve(selectedTasks);
          })), modal.querySelector("#cancel-btn").addEventListener("click", (() => {
            document.body.removeChild(modal), document.body.removeChild(style), resolve(null);
          })), document.body.appendChild(style), document.body.appendChild(modal);
        }));
      }(taskTree);
      if (console.log(selectedTasks), !selectedTasks) return stopAutoPlay(), [ "info", "用户取消任务" ];
      const taskMap = new Map;
      selectedTasks.forEach((({sectionIndex: sectionIndex, lessonIndex: lessonIndex, resourceType: resourceType}) => {
        taskMap.has(sectionIndex) || taskMap.set(sectionIndex, []), taskMap.get(sectionIndex).push({
          index: lessonIndex,
          resourceType: resourceType
        });
      }));
      const tasks = Array.from(taskMap.entries());
      if (!tasks.length) return console.log("所有任务已完成"), [ "success", "所有任务已完成" ];
      const failedTasks = new Map;
      try {
        for (let retry = 0; retry < 3; retry++) {
          for (const [sectionIndex, lessons] of tasks) {
            if (console.log("这是一个提示：", tasks), !isRunning) break;
            listenRouteWarpper.listenRoute = !1, sections[sectionIndex]?.click(), await new Promise((r => setTimeout(r, 20))), 
            listenRouteWarpper.listenRoute = !0, await new Promise((r => setTimeout(r, 2e3)));
            const lessonElements = findLessons();
            console.log(lessonElements);
            for (const {index: index, resourceType: resourceType} of lessons) {
              if (console.log("正在完成第", index, "/", lessonElements.length, "课", "资源类型:", resourceType), 
              !isRunning) break;
              const lessonElement = lessonElements[index];
              if (listenRouteWarpper.listenRoute = !1, lessonElement?.click(), await new Promise((r => setTimeout(r, 20))), 
              listenRouteWarpper.listenRoute = !0, console.log(lessonElement), await new Promise((r => setTimeout(r, 2e3))), 
              1 === resourceType) {
                console.log("开始播放视频");
                try {
                  await playVideo(), console.log("视频播放完成，继续下一步");
                } catch (error) {
                  console.log("已跳过"), failedTasks.has(sectionIndex) || failedTasks.set(sectionIndex, []), 
                  failedTasks.get(sectionIndex).push({
                    index: index,
                    resourceType: resourceType
                  });
                  continue;
                }
              } else console.log("处理文档类型资源"), await completeLesson();
              await new Promise((r => setTimeout(r, 2e3)));
            }
          }
          if (0 === failedTasks.size) break;
          tasks.length = 0, failedTasks.forEach(((lessons, sectionIndex) => {
            tasks.push([ sectionIndex, lessons ]);
          })), failedTasks.clear(), console.log("开始重试失败的任务:", tasks);
        }
      } catch (error) {
        return console.error("执行异常:", error), [ "error", "执行过程中发生异常: " + error.message ];
      } finally {
        stopAutoPlay();
      }
      return isRunning ? [ "success", "所有任务已完成" ] : [ "info", "用户已停止任务" ];
    }
    function createButton(text = "Get started", onClick = () => {}) {
      if (!createButton.styleAdded) {
        const style = document.createElement("style");
        style.textContent = "\n        .VerificationCode{\n        font-size:14px;\n            color:white;\n        font-weight:600;\n        }\n        .cssbuttons-io-button {\n          background: #e8e8e8;\n          color: rgb(13, 13, 13);\n          font-family: inherit;\n          padding: 0.35em;\n          padding-left: 1.2em;\n          font-size: 12px;\n          font-weight: 500;\n          border-radius: 0.9em;\n          border: none;\n          letter-spacing: 0.05em;\n          display: flex;\n          align-items: center;\n          box-shadow: inset 0 0 1.6em -0.6em #ffffff;\n          overflow: hidden;\n          position: relative;\n          height: 2.8em;\n          padding-right: 3.3em;\n          cursor: pointer;\n        }\n  \n        .cssbuttons-io-button .icon {\n          background: rgb(98 177 251);\n          margin-left: 1em;\n          position: absolute;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          height: 2.2em;\n          width: 2.2em;\n          border-radius: 0.7em;\n          right: 0.3em;\n          transition: all 0.3s;\n        }\n  \n        .cssbuttons-io-button:hover .icon {\n          width: calc(100% - 0.6em);\n        }\n  \n        .cssbuttons-io-button .icon svg {\n          width: 1.1em;\n          transition: transform 0.3s;\n          color: #e8e8e8;\n        }\n  \n        .cssbuttons-io-button:hover .icon svg {\n          transform: translateX(0.1em);\n        }\n  \n        .cssbuttons-io-button:active .icon {\n          transform: scale(0.95);\n        }\n\n        /* 加载动画样式 */\n        .cssbuttons-io-button .wrapper {\n            position: relative;\n            width: 4.2em;\n            height: 2em;\n            margin-left: 0em;\n        }\n\n        .cssbuttons-io-button .circle {\n            width: 6px;\n            height: 6px;\n            position: absolute;\n            border-radius: 50%;\n            background: #fff;\n            animation: circleBounce 0.5s alternate infinite ease;\n        }\n\n        @keyframes circleBounce {\n            0% { top: 15px; height: 5px; }\n            100% { top: 5px; }\n        }\n\n        .cssbuttons-io-button .shadow {\n            width: 6px;\n            height: 2px;\n            background: rgba(0,0,0,0.2);\n            position: absolute;\n            top: 18px;\n            animation: shadowScale 0.5s alternate infinite ease;\n        }\n\n        @keyframes shadowScale {\n            0% { transform: scaleX(1.5); }\n            100% { transform: scaleX(0.5); }\n        }\n\n        /* 悬停状态调整 */\n        .cssbuttons-io-button.loading:hover .icon {\n            width: 2.2em !important;\n        }\n\n        /* 定位调整 */\n        .cssbuttons-io-button .circle:nth-child(1) { left: 15%; }\n        .cssbuttons-io-button .circle:nth-child(2) { left: 45%; animation-delay: 0.2s; }\n        .cssbuttons-io-button .circle:nth-child(3) { right: 15%; animation-delay: 0.3s; }\n        .cssbuttons-io-button .shadow:nth-child(4) { left: 15%; }\n        .cssbuttons-io-button .shadow:nth-child(5) { left: 45%; animation-delay: 0.2s; }\n        .cssbuttons-io-button .shadow:nth-child(6) { right: 15%; animation-delay: 0.3s; }\n      \n        /* 加载状态下的特殊处理 */\n        .cssbuttons-io-button.loading .icon {\n        width: calc(100% - 0.6em) !important;\n        right: 0.3em !important;\n        }\n        /* 保持悬停效果 */\n        .cssbuttons-io-button.loading:hover .icon {\n        width: calc(100% - 0.6em) !important;\n        }       \n        ", 
        document.head.appendChild(style), createButton.styleAdded = !0;
      }
      const button = document.createElement("button");
      button.className = "cssbuttons-io-button";
      const textNode = document.createTextNode(text);
      button.appendChild(textNode);
      const iconDiv = document.createElement("div");
      iconDiv.className = "icon";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("height", "24"), svg.setAttribute("width", "24"), svg.setAttribute("viewBox", "0 0 24 24");
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M0 0h24v24H0z"), path1.setAttribute("fill", "none");
      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      return path2.setAttribute("d", "M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"), 
      path2.setAttribute("fill", "currentColor"), svg.appendChild(path1), svg.appendChild(path2), 
      iconDiv.appendChild(svg), button.appendChild(iconDiv), button.addEventListener("click", onClick), 
      button;
    }
    function pollLogin(verificationCode, LoggedWarpper) {
      let attempts = 0;
      const interval = setInterval((async () => {
        const user = await (async () => {
          try {
            const response = await fetch("https://app.zaizhexue.top/polling", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                verification_code: verificationCode
              })
            });
            if (!response.ok) throw new Error("请求失败");
            const data = await response.json();
            if (data.logged_in) return LoggedWarpper.Logged = !0, data.user;
          } catch (error) {
            console.error("请求失败:", error);
          }
          if (attempts++, attempts >= 60) return console.log("已发送60次请求，停止请求"), null;
        })();
        if (user) {
          clearInterval(interval), console.log("登录成功！"), settings.token = user.token.split("|")[0];
          const imgContainer = document.getElementById("imgContainer");
          imgContainer && (imgContainer.style.display = "none");
          const username = document.getElementById("username");
          username && (username.innerHTML = user.nickname), settings.username = user.nickname;
          const createTime = document.getElementById("createTime"), userCreatedTime = new Date(user.createdTime), formattedDate = `${userCreatedTime.getMonth() + 1}/${userCreatedTime.getDate()}/${userCreatedTime.getFullYear()}`;
          createTime && (createTime.innerHTML = formattedDate + "注册"), settings.createTime = formattedDate;
          const userInfoContainer = document.getElementById("userInfoContainer");
          return userInfoContainer && (userInfoContainer.style.display = "flex"), user;
        }
      }), 3e3);
    }
    async function toggleButtonState(button, isLoading = !0, LoggedWarpper) {
      const iconContainer = button.querySelector(".icon");
      if (!iconContainer) return;
      isLoading ? (iconContainer.innerHTML = '\n            <div class="wrapper">\n                <div class="circle"></div>\n                <div class="circle"></div>\n                <div class="circle"></div>\n            </div>\n        ', 
      button.classList.add("loading")) : (iconContainer.innerHTML = '\n            <svg viewBox="0 0 24 24">\n                <path fill="none" d="M0 0h24v24H0z"/>\n                <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>\n            </svg>\n        ', 
      button.classList.remove("loading")), console.log("切换状态");
      const code = await async function() {
        try {
          const requestBody = {}, response = await fetch("https://app.zaizhexue.top/trigger_login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
          if (!response.ok) throw new Error("网络请求失败");
          return (await response.json()).verification_code;
        } catch (error) {
          return console.error("请求失败:", error), null;
        }
      }();
      iconContainer.innerHTML = `<div class="VerificationCode">${code}<div>`, LoggedWarpper.code = code, 
      button.disabled = !0, pollLogin(code, LoggedWarpper);
    }
    function insertButtonAndFetchContent(element) {
      if (settings.examMode) return;
      const style = document.createElement("style");
      if (style.textContent = "\n        .deepseek-button {\n            background: transparent;\n            border: none;\n            cursor: pointer;\n            padding: 8px;\n            transition: all 0.3s;\n            position: relative;\n            display: flex;\n            align-items: center;\n        }\n\n        .deepseek-button svg {\n            width: 24px;\n            height: 24px;\n            transition: transform 0.3s;\n        }\n\n        .deepseek-button:hover svg {\n            transform: scale(1.1);\n        }\n\n        .deepseek-button.loading .icon {\n            display: none;\n        }\n\n        .deepseek-button .wrapper {\n            position: relative;\n            width: 24px;\n            height: 24px;\n            display: none;\n        }\n\n        .deepseek-button.loading .wrapper {\n            display: block;\n        }\n\n        .deepseek-button .circle {\n            width: 4px;\n            height: 4px;\n            position: absolute;\n            border-radius: 50%;\n            background: #4D6BFE;\n            animation: circleBounce 0.5s alternate infinite ease;\n        }\n\n        @keyframes circleBounce {\n            0% { top: 12px; height: 4px; }\n            100% { top: 4px; }\n        }\n\n        .deepseek-button .circle:nth-child(1) { left: 15%; }\n        .deepseek-button .circle:nth-child(2) { left: 45%; animation-delay: 0.2s; }\n        .deepseek-button .circle:nth-child(3) { right: 15%; animation-delay: 0.3s; }\n\n        .response-container {\n            display: none;\n            border: 1px solid #e0e0e0;\n            border-radius: 8px;\n            padding: 16px;\n            margin-left: 12px;\n            background: #f8f9fa;\n            font-size: 14px;\n            line-height: 1.6;\n            color: #333;\n            white-space: pre-wrap;\n        }\n    ", 
      document.head.appendChild(style), !document.getElementById("katex-css")) {
        const loadKaTeX = new Promise((resolve => {
          const katexCSS = document.createElement("link");
          katexCSS.id = "katex-css", katexCSS.rel = "stylesheet", katexCSS.href = "https://fastly.jsdelivr.net/gh/Miaozeqiu/fontRepository/katex.min.css", 
          document.head.appendChild(katexCSS);
          const katexJS = document.createElement("script");
          katexJS.src = "https://fastly.jsdelivr.net/gh/Miaozeqiu/fontRepository/katex.min.js";
          const katexAutoJS = document.createElement("script");
          katexAutoJS.src = "https://fastly.jsdelivr.net/gh/Miaozeqiu/fontRepository/auto-render.min.js", 
          katexJS.onload = () => {
            document.head.appendChild(katexAutoJS), katexAutoJS.onload = resolve;
          }, document.head.appendChild(katexJS);
        }));
        window.katexReady = loadKaTeX;
      }
      const button = document.createElement("button");
      button.className = "deepseek-button", button.classList.add("modified"), button.innerHTML = '\n<svg t="1740664524049" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4489" width="200" height="200"><path d="M1013.248 166.8608c-10.8032-5.4272-15.5136 4.864-21.8624 10.0864-2.1504 1.7408-3.9936 3.9424-5.7856 5.9392-15.872 17.3056-34.4064 28.672-58.5728 27.2384-35.4304-1.9456-65.6384 9.3696-92.3136 36.9664-5.6832-34.048-24.576-54.3744-53.248-67.3792-15.0016-6.7584-30.208-13.568-40.704-28.2624-7.3728-10.496-9.3184-22.1184-13.056-33.6384-2.304-6.912-4.6592-14.0288-12.4928-15.2576-8.4992-1.3824-11.8272 5.9392-15.1552 12.032-13.4144 24.832-18.5344 52.224-18.0736 80.0256 1.1776 62.464 27.0848 112.128 78.4384 147.5584 5.888 3.9936 7.3728 8.1408 5.5296 14.0288-3.4816 12.1856-7.68 24.0128-11.3664 36.1984-2.304 7.7824-5.8368 9.472-13.9776 6.0416a234.752 234.752 0 0 1-74.0864-51.2c-36.5568-36.0448-69.632-75.776-110.848-106.9056a475.4432 475.4432 0 0 0-29.3376-20.48c-42.0864-41.6768 5.5296-75.8784 16.4864-79.872 11.52-4.2496 3.9936-18.7904-33.2288-18.6368-37.1712 0.1536-71.2192 12.8512-114.5856 29.696-6.3488 2.6112-13.0048 4.5056-19.8656 5.9392a404.8384 404.8384 0 0 0-123.0336-4.352c-80.384 9.216-144.64 47.9232-191.8976 114.0736C3.4816 346.1632-9.8304 436.5312 6.4512 530.7904c17.2032 99.2768 66.9184 181.5552 143.36 245.8624 79.3088 66.56 170.5984 99.2256 274.688 92.9792 63.232-3.6864 133.6832-12.288 213.0944-80.8448 20.0704 10.1376 41.0624 14.1824 75.9808 17.2544 26.88 2.56 52.736-1.3824 72.7552-5.5808 31.3856-6.7584 29.184-36.352 17.8688-41.8304-91.9552-43.6224-71.7824-25.856-90.1632-40.192 46.7456-56.4224 117.1968-114.944 144.7424-304.5376 2.0992-15.104 0.256-24.5248 0-36.7616-0.2048-7.3728 1.4336-10.2912 9.7792-11.1616 23.04-2.6624 45.4144-9.1136 65.9456-20.6336 59.5968-33.1776 83.5584-87.6032 89.2416-152.9344 0.8704-9.9328-0.1536-20.3264-10.4448-25.6zM494.08 754.6368c-89.088-71.424-132.3008-94.9248-150.1696-93.9008-16.64 0.9728-13.6704 20.4288-10.0352 33.1264 3.84 12.4928 8.8576 21.1456 15.872 32.1024 4.864 7.3216 8.192 18.176-4.8128 26.2656-28.672 18.176-78.592-6.144-80.9472-7.3216-58.112-34.816-106.6496-80.7936-140.8512-143.7184a445.7984 445.7984 0 0 1-55.3984-194.9184c-0.8192-16.7936 3.9936-22.7328 20.3264-25.7024 21.504-4.096 43.776-4.9152 65.28-1.7408 90.9312 13.568 168.3968 55.04 233.2672 120.6272 37.0688 37.4272 65.1264 82.0736 94.0032 125.7472 30.72 46.336 63.744 90.4704 105.7792 126.6688 14.848 12.6976 26.7264 22.3744 38.0416 29.4912-34.2016 3.84-91.2896 4.7104-130.304-26.7776z m42.752-280.064a13.2096 13.2096 0 0 1 17.7152-12.4928 11.52 11.52 0 0 1 4.8128 3.2256 13.1072 13.1072 0 0 1 3.6864 9.2672 13.2096 13.2096 0 0 1-13.2096 13.3632 13.056 13.056 0 0 1-13.0048-13.312z m132.608 69.4272c-8.448 3.5328-16.9472 6.656-25.088 6.9632a53.0944 53.0944 0 0 1-34.0992-11.0592c-11.6736-9.9328-19.968-15.5136-23.552-33.024a78.2336 78.2336 0 0 1 0.6656-25.5488c3.072-14.2336-0.3072-23.296-10.1376-31.5904-8.0384-6.8096-18.176-8.6016-29.3888-8.6016a23.5008 23.5008 0 0 1-10.8544-3.4304 11.1616 11.1616 0 0 1-4.864-15.5648 50.688 50.688 0 0 1 8.192-9.1136c15.2064-8.8064 32.7168-5.888 48.896 0.6656 15.0528 6.2976 26.368 17.7664 42.7008 33.9456 16.7424 19.6608 19.712 25.1392 29.2352 39.7824 7.4752 11.5712 14.336 23.3984 19.0464 36.9664 2.816 8.3968-0.8704 15.36-10.752 19.6096z" fill="#4D6BFE" p-id="4490"></path></svg>\n        <div class="wrapper">\n            <div class="circle"></div>\n            <div class="circle"></div>\n            <div class="circle"></div>\n        </div>\n    ', 
      element.appendChild(button);
      const outputElement = document.createElement("div");
      outputElement.className = "response-container", outputElement.classList.add("modified"), 
      element.appendChild(outputElement);
      let abortController = null;
      function updateButtonState(loading = !1, error = !1) {
        button.disabled = loading, button.classList[loading ? "add" : "remove"]("loading");
      }
      function keepScrolledToBottom(element) {
        element.scrollTop = element.scrollHeight;
      }
      button.addEventListener("click", (async function() {
        if (!button.disabled) {
          updateButtonState(!0), outputElement.innerHTML = "", outputElement.style.display = "block", 
          abortController = new AbortController;
          try {
            Array.from(element.querySelectorAll("*"));
            let combinedContent = "";
            function processNode(node) {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                text && (combinedContent += text + " ");
              } else if ("IMG" === node.nodeName) {
                const alt = node.getAttribute("alt");
                alt && (combinedContent += `[图片: ${alt}] `);
              } else Array.from(node.childNodes).forEach((child => processNode(child)));
            }
            if (processNode(element), combinedContent.trim() || (combinedContent = element.textContent.trim()), 
            !combinedContent) return void (outputElement.innerHTML = '<div class="error-message">⚠️ 未找到可提取的文本内容</div>');
            var apiUrl = "https://api.csid.cc/deepseek";
            settings.deepseekProxy && (apiUrl = "http://localhost:5233");
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${settings.token}`,
                Accept: "text/event-stream"
              },
              body: JSON.stringify({
                messages: [ {
                  role: "system",
                  content: "你是有用的人工智能助手，请用清晰格式回答，适当使用段落和列表，但不要使用markdown格式，并且在开头都要回答出你认为对的回答"
                }, {
                  role: "user",
                  content: combinedContent
                } ],
                stream: !0
              }),
              signal: abortController.signal
            });
            response.ok || response.json().then((data => {
              "Authorization limit reached" === data.error ? outputElement.innerHTML = "<div>请求失败：今日使用次数已用完,请尝试</div><a href='https://pages.zaizhexue.top/home/DeepSeek' target='_blank'>DeepSeekProxy</a>" : outputElement.textContent = `请求失败: ${response.status}`;
            })).catch((() => {
              outputElement.textContent = `请求失败: ${response.status}`;
            })).finally((() => {
              throw new Error(`请求失败: ${response.status}`);
            }));
            const reader = response.body.getReader(), decoder = new TextDecoder;
            for (;;) {
              const {done: done, value: value} = await reader.read();
              if (done) break;
              const lines = decoder.decode(value, {
                stream: !0
              }).split("\n");
              console.log("lines:", lines), lines.forEach((line => {
                if (line.startsWith("data: ") && !line.includes("[DONE]")) try {
                  const {choices: choices} = JSON.parse(line.slice(6));
                  if (choices?.[0]?.delta?.content && (outputElement.innerHTML += choices[0].delta.content, 
                  keepScrolledToBottom(outputElement), window.renderMathInElement && 0 === outputElement.querySelectorAll(".katex").length)) try {
                    window.renderMathInElement(outputElement, {
                      delimiters: [ {
                        left: "$$",
                        right: "$$",
                        display: !0
                      }, {
                        left: "$",
                        right: "$",
                        display: !1
                      }, {
                        left: "\\(",
                        right: "\\)",
                        display: !1
                      }, {
                        left: "\\[",
                        right: "\\]",
                        display: !0
                      } ],
                      throwOnError: !1
                    });
                  } catch (e) {
                    console.error("LaTeX 渲染错误:", e);
                  }
                } catch (e) {
                  console.error("解析错误:", e);
                }
              }));
            }
          } catch (e) {
            "AbortError" !== e.name && (outputElement.innerHTML += `<div class="error-message">⚠️ 请求中断：${e}</div><a href='https://pages.zaizhexue.top/home/DeepSeek' target="_blank">使用教程</a>`);
          } finally {
            updateButtonState(!1), setTimeout((() => {
              if (window.renderMathInElement) try {
                window.renderMathInElement(outputElement, {
                  delimiters: [ {
                    left: "$$",
                    right: "$$",
                    display: !0
                  }, {
                    left: "$",
                    right: "$",
                    display: !1
                  }, {
                    left: "\\(",
                    right: "\\)",
                    display: !1
                  }, {
                    left: "\\[",
                    right: "\\]",
                    display: !0
                  } ],
                  throwOnError: !1
                });
              } catch (e) {
                console.error("LaTeX 渲染错误:", e);
              }
            }), 500);
          }
        }
      }));
    }
    function showConfirmDialog(message, title = "是否确认开启") {
      return new Promise((resolve => {
        const overlay = document.createElement("div");
        overlay.style.cssText = "\n            position: fixed;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background: rgba(0, 0, 0, 0.5);\n            z-index: 9999999;\n        ", 
        document.body.appendChild(overlay);
        const modal = document.createElement("div");
        modal.style.cssText = "\n            position: fixed;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 0 10px rgba(0,0,0,0.3);\n            z-index: 10000000000000;\n            width: 400px;\n        ", 
        modal.innerHTML = `\n            <h3 style="margin-top: 0; font-size: 20px; font-weight: 600;">${title}</h3>\n            <p>${message}</p>\n            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">\n                <button id="confirm-yes" style="\n                    padding: 8px 16px;\n                    background: #4D6BFE;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                ">是</button>\n                <button id="confirm-no" style="\n                    padding: 8px 16px;\n                    background: #f5f5f5;\n                    color: #333;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    cursor: pointer;\n                ">否</button>\n            </div>\n        `, 
        document.body.appendChild(modal);
        const yesButton = modal.querySelector("#confirm-yes"), noButton = modal.querySelector("#confirm-no");
        yesButton.addEventListener("click", (() => {
          document.body.removeChild(modal), document.body.removeChild(overlay), resolve(!0);
        })), noButton.addEventListener("click", (() => {
          document.body.removeChild(modal), document.body.removeChild(overlay), resolve(!1);
        }));
      }));
    }
    async function autoPlayZJLLL() {
      const wait = ms => new Promise((resolve => setTimeout(resolve, ms)));
      await (async () => {
        const chapters = (() => {
          const chapters = document.querySelectorAll("div.chapter");
          return console.log("找到的章节数量:", chapters.length), chapters;
        })();
        for (const chapter of chapters) {
          const chapterText = chapter.textContent;
          chapterText.includes("100%") || (console.log("开始播放章节:", chapterText), chapter.click(), 
          await wait(3e3), await new Promise((resolve => {
            const checkVideo = setInterval((() => {
              const video = document.querySelector("video");
              !video || video.ended ? (clearInterval(checkVideo), resolve()) : video && (video.playbackRate = parseFloat(settings.speed) || 1);
            }), 1e3);
          })), await wait(2e3));
        }
        console.log("所有章节播放完成");
      })();
    }
    createButton.styleAdded = !1;
    const ifZJLLL = function() {
      if (window.location.href.includes("https://www.zjlll.cn/")) {
        const dialogDiv = document.createElement("div");
        dialogDiv.style.cssText = "\n            position: fixed;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n            z-index: 9999;\n            max-width: 400px;\n        ", 
        dialogDiv.innerHTML = '\n            <h3 style="margin-top: 0;">在这学助手无法当前网站运行</h3>\n            <br>\n            <p>请使用"<strong>浙江省全民终身学习公共服务平台自动播放</strong>"脚本</p>\n            <p>脚本地址: <a href="https://scriptcat.org/zh-CN/script-show-page/4095" target="_blank" onclick="window.open(this.href); return false;">https://scriptcat.org/zh-CN/script-show-page/4095</a></p>\n            <button style="\n                padding: 8px 16px;\n                background: #4CAF50;\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n                float: right;\n            ">确定</button>\n        ', 
        document.body.appendChild(dialogDiv);
        return dialogDiv.querySelector("button").onclick = () => {
          dialogDiv.remove();
        }, !0;
      }
      return !1;
    };
    !function() {
      if (ifZJLLL()) return;
      (async function(fontName, fontUrl) {
        try {
          const fontFace = new FontFace(fontName, `url(${fontUrl})`), loadedFont = await fontFace.load();
          return document.fonts.add(loadedFont), window[`${fontName}Loaded`] = !0, console.log(`字体 ${fontName} 加载成功`), 
          !0;
        } catch (error) {
          return console.error(`字体加载失败: ${error}`), !1;
        }
      })("SmileySans-Oblique", "https://fastly.jsdelivr.net/gh/Miaozeqiu/fontRepository/SmileySans-Oblique.ttf.ec5470fd.woff2").then((success => {
        success && (document.body.style.fontFamily = "SmileySans-Oblique, sans-serif");
      }));
      const LoggedWarpper = {
        Logged: !1,
        code: ""
      };
      var stopAnimation, CourseChapters = {}, isPlaying = !1;
      const listenRouteWarpper = {
        listenRoute: !0
      };
      if (window.top != window) return void console.log("当前脚本在iframe中执行，窗口不渲染");
      const style = document.createElement("style");
      style.type = "text/css", style.innerHTML = '.answer {\r\n    background-color: #f5f5f5;\r\n    padding: 2px 8px;\r\n    border-radius: 3px;\r\n    cursor: pointer;\r\n    transition: background-color 0.3s ease;\r\n    margin: 5px;\r\n}\r\n\r\n.answer:hover {\r\n    background-color: #e0e0e0;\r\n\r\n}\r\n\r\n/* 固定窗口样式 */\r\n#scriptWindow {\r\n    position: fixed;\r\n    top: 10px;\r\n    left: 10px;\r\n    width: 300px;\r\n    height: 400px;\r\n    background-color: #fff;\r\n    z-index: 10000;\r\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\r\n    border-radius: 8px;\r\n    overflow: hidden;\r\n}\r\n\r\n\r\n#window-header {\r\n    height: 40px;\r\n    background-color: #007bff;\r\n    color: #fff;\r\n    padding: 10px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    cursor: move;\r\n  }\r\n\r\n#window-navBar {\r\n    width: 50px;\r\n    background-color: #f8f9fa;\r\n    border-right: 1px solid #ddd;\r\n    display: flex;\r\n    flex-direction: column;\r\n    padding-top: 10px;\r\n    padding-bottom: 10px;\r\n}\r\n\r\n#window-pageLink{\r\n    padding: 12px 16px;\r\n    margin-bottom: 10px;\r\n    cursor: pointer;\r\n    border-radius: 6px;\r\n    transition: background-color 0.3s ease;\r\n}\r\n\r\n#checklist {\r\n    --background: #fff;\r\n    --text: #414856;\r\n    --check: #4f29f0;\r\n    --disabled: #c3c8de;\r\n    --width: 280px;\r\n    --height: 180px;\r\n    --border-radius: 10px;\r\n    overflow-y: auto;\r\n    /* 内容超出时显示滚动条 */\r\n    overflow-x: hidden;\r\n    /* 内容超出时显示滚动条 */\r\n    background: var(--background);\r\n    width: var(--width);\r\n    max-height: 180px;\r\n    border-radius: var(--border-radius);\r\n    position: relative;\r\n    box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05);\r\n    display: grid;\r\n    grid-template-columns: 30px auto;\r\n    align-items: center;\r\n    justify-content: left;\r\n}\r\n\r\n#checklist label {\r\n    color: var(--text);\r\n    position: relative;\r\n    cursor: pointer;\r\n    display: grid;\r\n    align-items: center;\r\n    width: fit-content;\r\n    transition: color 0.3s ease;\r\n    margin-right: 0px;\r\n}\r\n\r\n#checklist label::before,\r\n#checklist label::after {\r\n    content: "";\r\n    position: absolute;\r\n}\r\n\r\n#checklist label::before {\r\n    height: 2px;\r\n    width: 8px;\r\n    left: -27px;\r\n    background: var(--check);\r\n    border-radius: 2px;\r\n    transition: background 0.3s ease;\r\n}\r\n\r\n#checklist label:after {\r\n    height: 4px;\r\n    width: 4px;\r\n    top: 8px;\r\n    left: -25px;\r\n    border-radius: 50%;\r\n}\r\n\r\n#checklist input[type="checkbox"] {\r\n    position: relative;\r\n    height: 15px;\r\n    width: 15px;\r\n    outline: none;\r\n    border: 0;\r\n    margin: 0 15px 0 0;\r\n    cursor: pointer;\r\n    background: var(--background);\r\n    display: grid;\r\n    align-items: center;\r\n    margin-right: 20px;\r\n}\r\n\r\n#checklist input[type="checkbox"]::before,\r\n#checklist input[type="checkbox"]::after {\r\n    content: "";\r\n    position: absolute;\r\n    height: 2px;\r\n    top: auto;\r\n    background: var(--check);\r\n    border-radius: 2px;\r\n}\r\n\r\n#checklist input[type="checkbox"]::before {\r\n    width: 0px;\r\n    right: 60%;\r\n    transform-origin: right bottom;\r\n}\r\n\r\n#checklist input[type="checkbox"]::after {\r\n    width: 0px;\r\n    left: 40%;\r\n    transform-origin: left bottom;\r\n}\r\n\r\n#checklist input[type="checkbox"]:checked::before {\r\n    animation: check-01 0.4s ease forwards;\r\n}\r\n\r\n#checklist input[type="checkbox"]:checked::after {\r\n    animation: check-02 0.4s ease forwards;\r\n}\r\n\r\n#checklist input[type="checkbox"]:checked+label {\r\n    color: var(--disabled);\r\n    animation: move 0.3s ease 0.1s forwards;\r\n}\r\n\r\n#checklist input[type="checkbox"]:checked+label::before {\r\n    background: var(--disabled);\r\n    animation: slice 0.4s ease forwards;\r\n}\r\n\r\n#checklist input[type="checkbox"]:checked+label::after {\r\n    animation: firework 0.5s ease forwards 0.1s;\r\n}\r\n\r\n@keyframes move {\r\n    50% {\r\n        padding-left: 8px;\r\n        padding-right: 0px;\r\n    }\r\n\r\n    100% {\r\n        padding-right: 4px;\r\n    }\r\n}\r\n\r\n@keyframes slice {\r\n    60% {\r\n        width: 100%;\r\n        left: 4px;\r\n    }\r\n\r\n    100% {\r\n        width: 100%;\r\n        left: -2px;\r\n        padding-left: 0;\r\n    }\r\n}\r\n\r\n@keyframes check-01 {\r\n    0% {\r\n        width: 4px;\r\n        top: auto;\r\n        transform: rotate(0);\r\n    }\r\n\r\n    50% {\r\n        width: 0px;\r\n        top: auto;\r\n        transform: rotate(0);\r\n    }\r\n\r\n    51% {\r\n        width: 0px;\r\n        top: 8px;\r\n        transform: rotate(45deg);\r\n    }\r\n\r\n    100% {\r\n        width: 5px;\r\n        top: 8px;\r\n        transform: rotate(45deg);\r\n    }\r\n}\r\n\r\n@keyframes check-02 {\r\n    0% {\r\n        width: 4px;\r\n        top: auto;\r\n        transform: rotate(0);\r\n    }\r\n\r\n    50% {\r\n        width: 0px;\r\n        top: auto;\r\n        transform: rotate(0);\r\n    }\r\n\r\n    51% {\r\n        width: 0px;\r\n        top: 8px;\r\n        transform: rotate(-45deg);\r\n    }\r\n\r\n    100% {\r\n        width: 10px;\r\n        top: 8px;\r\n        transform: rotate(-45deg);\r\n    }\r\n}\r\n\r\n@keyframes firework {\r\n    0% {\r\n        opacity: 1;\r\n        box-shadow: 0 0 0 -2px #4f29f0, 0 0 0 -2px #4f29f0, 0 0 0 -2px #4f29f0, 0 0 0 -2px #4f29f0, 0 0 0 -2px #4f29f0, 0 0 0 -2px #4f29f0;\r\n    }\r\n\r\n    30% {\r\n        opacity: 1;\r\n    }\r\n\r\n    100% {\r\n        opacity: 0;\r\n        box-shadow: 0 -15px 0 0px #4f29f0, 14px -8px 0 0px #4f29f0, 14px 8px 0 0px #4f29f0, 0 15px 0 0px #4f29f0, -14px 8px 0 0px #4f29f0, -14px -8px 0 0px #4f29f0;\r\n    }\r\n}\r\n\r\n.body-container {\r\n    place-items: left;\r\n    align-content: left;\r\n    font-family: "SF Pro Text", "SF Pro Icons", "AOS Icons", "Helvetica Neue",\r\n        Helvetica, Arial, sans-serif, system-ui;\r\n\r\n}\r\n\r\n.radio-input input {\r\n    display: none;\r\n    width: 250px;\r\n}\r\n\r\n.radio-input {\r\n    justify-content: center;\r\n    /* 添加这行来水平居中 */\r\n    display: grid;\r\n    place-items: center;\r\n    align-content: center;\r\n    --container_width: 185px;\r\n    position: relative;\r\n    display: flex;\r\n    align-items: center;\r\n    border-radius: 10px;\r\n    background-color: #fff;\r\n    color: #000000;\r\n    width: calc(var(--container_width) + 40px);\r\n    ;\r\n    overflow: hidden;\r\n    border: 1px solid rgba(53, 52, 52, 0.226);\r\n}\r\n\r\n.radio-input label {\r\n    width: 100%;\r\n    padding: 10px;\r\n    cursor: pointer;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    z-index: 1;\r\n    font-weight: 600;\r\n    letter-spacing: -1px;\r\n    font-size: 14px;\r\n    color: gray;\r\n}\r\n\r\n.selection {\r\n    position: relative;\r\n    display: none;\r\n    position: absolute;\r\n    height: 80%;\r\n    width: calc(var(--container_width) / 4);\r\n    z-index: 0;\r\n    left: 0;\r\n    top: 10%;\r\n    border-radius: 10px;\r\n    transform: translateY(-50%);\r\n    /* 竖直居中 */\r\n    transition: 0.3s ease;\r\n    background-color: #FF5733;\r\n}\r\n\r\n.radio-input label:has(input:checked) {\r\n    color: #fff;\r\n}\r\n\r\n.radio-input label:has(input:checked)~.selection {\r\n    background-color: #2BA8FB;\r\n    display: inline-block;\r\n}\r\n\r\n.radio-input label:nth-child(1):has(input:checked)~.selection {\r\n    transform: translateX(calc(var(--container_width) * 0 / 4 + 5px));\r\n}\r\n\r\n.radio-input label:nth-child(2):has(input:checked)~.selection {\r\n    transform: translateX(calc(var(--container_width) * 1 / 4 + 15px));\r\n}\r\n\r\n.radio-input label:nth-child(3):has(input:checked)~.selection {\r\n    transform: translateX(calc(var(--container_width) * 2 / 4 + 25px));\r\n}\r\n\r\n.radio-input label:nth-child(4):has(input:checked)~.selection {\r\n    transform: translateX(calc(var(--container_width) * 3 / 4 + 35px));\r\n}\r\n\r\n.selection2 {\r\n    display: none;\r\n    position: absolute;\r\n    height: 80%;\r\n    width: calc(var(--container_width) / 4);\r\n    z-index: 0;\r\n    left: 0;\r\n    top: 10%;\r\n    border-radius: 10px;\r\n    transform: translateY(-50%);\r\n    /* 竖直居中 */\r\n    transition: 0.2s ease;\r\n    background-color: #FF5733;\r\n}\r\n\r\n.radio-input label:has(input:checked) {\r\n    color: #fff;\r\n}\r\n\r\n.radio-input label:has(input:checked)~.selection2 {\r\n    background-color: #2BA8FB;\r\n    display: inline-block;\r\n}\r\n\r\n.radio-input label:nth-child(1):has(input:checked)~.selection2 {\r\n    transform: translateX(calc(var(--container_width) * 0 / 4 + 5px));\r\n}\r\n\r\n.radio-input label:nth-child(2):has(input:checked)~.selection2 {\r\n    transform: translateX(calc(var(--container_width) * 1 / 4 + 15px));\r\n}\r\n\r\n.radio-input label:nth-child(3):has(input:checked)~.selection2 {\r\n    transform: translateX(calc(var(--container_width) * 2 / 4 + 25px));\r\n}\r\n\r\n.radio-input label:nth-child(4):has(input:checked)~.selection2 {\r\n    transform: translateX(calc(var(--container_width) * 3 / 4 + 35px));\r\n}\r\n\r\n.selection {\r\n    --ease: linear(0,\r\n            0.1641 3.52%,\r\n            0.311 7.18%,\r\n            0.4413 10.99%,\r\n            0.5553 14.96%,\r\n            0.6539 19.12%,\r\n            0.738 23.5%,\r\n            0.8086 28.15%,\r\n            0.8662 33.12%,\r\n            0.9078 37.92%,\r\n            0.9405 43.12%,\r\n            0.965 48.84%,\r\n            0.9821 55.28%,\r\n            0.992 61.97%,\r\n            0.9976 70.09%,\r\n            1);\r\n}\r\n\r\n.selection2 {\r\n    --ease: linear(0,\r\n            0.1641 3.52%,\r\n            0.311 7.18%,\r\n            0.4413 10.99%,\r\n            0.5553 14.96%,\r\n            0.6539 19.12%,\r\n            0.738 23.5%,\r\n            0.8086 28.15%,\r\n            0.8662 33.12%,\r\n            0.9078 37.92%,\r\n            0.9405 43.12%,\r\n            0.965 48.84%,\r\n            0.9821 55.28%,\r\n            0.992 61.97%,\r\n            0.9976 70.09%,\r\n            1);\r\n}\r\n\r\n.response-output{\r\n    background-color: #f5f5f5;\r\n    border-radius: 8px;\r\n    padding: 16px;\r\n}\r\n\r\n#DeepSeekProxyWrapper{\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.question-mark{\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.question-mark:hover{\r\n    cursor: pointer;\r\n}\r\n', 
      document.head.appendChild(style);
      var originalJson = {};
      let showAnswer = !1;
      function copyText(element) {
        const range = document.createRange();
        range.selectNode(element), window.getSelection().removeAllRanges(), window.getSelection().addRange(range);
        try {
          document.execCommand("copy"), displaySuccessNotification("复制成功", "😀");
        } catch (err) {
          alert("复制失败");
        }
        window.getSelection().removeAllRanges();
      }
      try {
        unsafeWindow.copyText = copyText;
      } catch (e) {
        window.copyText = copyText;
      }
      const windowDiv = document.createElement("div");
      windowDiv.id = "scriptWindow";
      const initialPosition = function() {
        const position = settings.position, screenWidth = window.innerWidth, screenHeight = window.innerHeight;
        return position && position.left >= 0 && position.top >= 0 && position.left <= screenWidth && position.top <= screenHeight ? position : {
          left: 10,
          top: 10
        };
      }();
      windowDiv.style.left = `${initialPosition.left}px`, windowDiv.style.top = `${initialPosition.top}px`;
      const header = document.createElement("div");
      header.id = "window-header";
      const zzxLogo = document.createElement("img");
      zzxLogo.src = imageData.zzxLogo, zzxLogo.style.width = "20px";
      const titleText = document.createElement("span");
      titleText.innerHTML = "在浙学助手 v2.1.3", titleText.style.marginLeft = "10px";
      const title = document.createElement("div");
      title.style.display = "flex", title.appendChild(zzxLogo), title.appendChild(titleText), 
      header.appendChild(title);
      const minimizeButton = document.createElement("button");
      minimizeButton.style.backgroundColor = "transparent", minimizeButton.style.border = "none", 
      minimizeButton.innerHTML = '\n          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">\n              <path d="M0 0h24v24H0V0z" fill="none"></path>\n              <path d="M19 13H5v-2h14v2z" fill="white"></path>\n          </svg>\n      ', 
      minimizeButton.style.cursor = "pointer", header.appendChild(minimizeButton);
      const contentDiv = document.createElement("div");
      contentDiv.style.display = "flex", contentDiv.style.height = "calc(100% - 40px)";
      const navBar = document.createElement("div");
      navBar.id = "window-navBar";
      [ "🏠", "⚙️" ].forEach((page => {
        const pageLink = document.createElement("div");
        pageLink.id = "window-pageLink", pageLink.textContent = page, pageLink.addEventListener("click", (() => {
          "⚙️" === page ? renderSettingsPage() : "🏠" === page ? renderHomePage() : "在线搜题" === page || (displayArea.innerHTML = page + " 内容");
        })), pageLink.addEventListener("mouseenter", (() => {
          pageLink.style.backgroundColor = "#51AFEF", pageLink.style.color = "#fff";
        })), pageLink.addEventListener("mouseleave", (() => {
          pageLink.style.backgroundColor = "transparent", pageLink.style.color = "#333";
        })), navBar.appendChild(pageLink);
      }));
      const displayArea = document.createElement("div");
      displayArea.style.flex = "1", displayArea.style.padding = "10px", displayArea.innerHTML = "内容显示", 
      contentDiv.appendChild(navBar), contentDiv.appendChild(displayArea), windowDiv.appendChild(header), 
      windowDiv.appendChild(contentDiv), document.body.appendChild(windowDiv);
      let isMinimized = !1;
      minimizeButton.addEventListener("click", (() => {
        isMinimized ? (contentDiv.style.display = "flex", windowDiv.style.height = "400px", 
        minimizeButton.innerHTML = '\n          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">\n              <path d="M0 0h24v24H0V0z" fill="none"></path>\n              <path d="M19 13H5v-2h14v2z" fill="white"></path>\n          </svg>\n      ') : (contentDiv.style.display = "none", 
        windowDiv.style.height = "50px", minimizeButton.innerHTML = '\n          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">\n              <path d="M0 0h24v24H0V0z" fill="none"></path>\n              <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z" fill="white"></path>\n          </svg>\n      '), 
        isMinimized = !isMinimized;
      }));
      let offsetX, offsetY, isDragging = !1;
      function onMouseMove(e) {
        if (isDragging) {
          const windowWidth = windowDiv.offsetWidth, windowHeight = windowDiv.offsetHeight, screenWidth = window.innerWidth, screenHeight = window.innerHeight;
          let newLeft = e.clientX - offsetX, newTop = e.clientY - offsetY;
          newLeft < 0 && (newLeft = 0), newLeft + windowWidth > screenWidth && (newLeft = screenWidth - windowWidth), 
          newTop < 0 && (newTop = 0), newTop + windowHeight > screenHeight && (newTop = screenHeight - windowHeight), 
          windowDiv.style.left = `${newLeft}px`, windowDiv.style.top = `${newTop}px`;
        }
      }
      function onMouseUp() {
        isDragging = !1, document.removeEventListener("mousemove", onMouseMove), document.removeEventListener("mouseup", onMouseUp);
        const newPosition = {
          left: windowDiv.offsetLeft,
          top: windowDiv.offsetTop
        };
        settings.position = newPosition;
      }
      function toggleMute() {
        const videoElement = document.querySelector("video"), muteLabel = document.querySelector(".switch"), muteCheckbox = muteLabel ? muteLabel.querySelector('input[type="checkbox"]') : null;
        videoElement && (videoElement.muted = muteCheckbox.checked), settings.mute = muteCheckbox.checked;
      }
      function setVideoSpeed(speed) {
        const videoElement = document.querySelector("video");
        videoElement && speed && (videoElement.playbackRate = parseFloat(speed)), settings.speed = speed;
      }
      function applySwitchStyles() {
        document.querySelectorAll(".switch").forEach((switchElement => {
          const checkbox = switchElement.querySelector(".checkbox"), slider = switchElement.querySelector(".slider");
          checkbox.style.display = "none", slider.style.width = "60px", slider.style.height = "30px", 
          slider.style.backgroundColor = "lightgray", slider.style.borderRadius = "20px", 
          slider.style.overflow = "hidden", slider.style.display = "flex", slider.style.alignItems = "center", 
          slider.style.border = "4px solid transparent", slider.style.transition = ".3s", 
          slider.style.cursor = "pointer", slider.style.position = "relative";
          const before = document.createElement("div");
          before.style.content = '""', before.style.width = "100%", before.style.height = "100%", 
          before.style.backgroundColor = "#fff", before.style.transform = "translateX(-30px)", 
          before.style.borderRadius = "20px", before.style.transition = ".3s", before.style.position = "absolute", 
          slider.appendChild(before), checkbox.addEventListener("change", (() => {
            checkbox.checked ? (slider.style.backgroundColor = "#2196F3", before.style.transform = "translateX(30px)") : (slider.style.backgroundColor = "lightgray", 
            before.style.transform = "translateX(-30px)");
          })), slider.addEventListener("mousedown", (() => {
            checkbox.checked || (before.style.transform = "translateX(0)");
          })), slider.addEventListener("mouseup", (() => {
            checkbox.checked && (before.style.transform = "translateX(30px)");
          })), checkbox.checked && (slider.style.backgroundColor = "#2196F3", before.style.transform = "translateX(30px)");
        }));
      }
      function renderSettingsPage() {
        displayArea.innerHTML = "";
        const userInfoContainer = document.createElement("div");
        userInfoContainer.setAttribute("id", "userInfoContainer"), userInfoContainer.style.display = "flex", 
        userInfoContainer.style.marginBottom = "10px";
        const userInfo = document.createElement("div");
        document.createElement("div").setAttribute("id", "avatarContainer");
        const avatar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        avatar.setAttribute("t", "1734414003129"), avatar.setAttribute("class", "icon"), 
        avatar.setAttribute("viewBox", "0 0 1024 1024"), avatar.setAttribute("version", "1.1"), 
        avatar.setAttribute("xmlns", "http://www.w3.org/2000/svg"), avatar.setAttribute("p-id", "15777"), 
        avatar.setAttribute("width", "132"), avatar.setAttribute("height", "132");
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M511.990738 510.660058H1.33068A510.660058 510.660058 0 1 0 511.990738 0 510.660058 510.660058 0 0 0 1.33068 510.660058z"), 
        path1.setAttribute("fill", "#23a3f8"), path1.setAttribute("p-id", "15778");
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M496.041101 430.881001h31.917798v95.753392h-31.917798z"), 
        path2.setAttribute("fill", "#F4BAC2"), path2.setAttribute("p-id", "15779");
        const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path3.setAttribute("d", "M287.41840599 469.33024634a223.418406 223.418406 0 1 0 223.418407-223.418407L287.41840599 245.91183934z"), 
        path3.setAttribute("fill", "#FFFFFF"), path3.setAttribute("p-id", "15780");
        const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path4.setAttribute("d", "M506.96055065 494.698072a15.078983 15.078983 0 0 1-15.955811-15.955812L491.00473965 414.919015a15.955811 15.955811 0 0 1 31.917797 0l0 63.835595a15.078983 15.078983 0 0 1-15.961986 15.943462z m111.709203-1e-8a15.078983 15.078983 0 0 1-15.955811-15.95581199L602.71394265 414.919015a15.955811 15.955811 0 0 1 31.917798 0l0 63.835595a15.078983 15.078983 0 0 1-15.961987 15.94346199z"), 
        path4.setAttribute("fill", "#23a3f8"), path4.setAttribute("p-id", "15781");
        const path5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path5.setAttribute("d", "M208.256063 921.250504c0-122.879506 101.069937-187.165865 223.949444-187.165865h159.582811c122.879506 0 222.072289 65.453405 222.07229 188.332911 0 0-109.486257 101.934416-300.097688 101.563925s-305.506856-102.730972-305.506857-102.730971z"), 
        path5.setAttribute("fill", "#FFFFFF"), path5.setAttribute("p-id", "15782"), avatar.appendChild(path1), 
        avatar.appendChild(path2), avatar.appendChild(path3), avatar.appendChild(path4), 
        avatar.appendChild(path5), document.body.appendChild(avatar), avatar.setAttribute("id", "avatar"), 
        avatar.style.width = "40px", avatar.style.height = "40px", avatar.style.marginLeft = "10px", 
        userInfo.appendChild(avatar);
        const userTextContainer = document.createElement("div");
        userTextContainer.setAttribute("id", "userTextContainer"), userTextContainer.style.display = "flex", 
        userTextContainer.style.flexDirection = "column", userTextContainer.style.marginLeft = "10px";
        const username = document.createElement("span");
        username.textContent = settings.username, username.style.fontSize = "16px", username.style.fontWeight = "bold", 
        username.setAttribute("id", "username"), userTextContainer.appendChild(username);
        const createTime = document.createElement("span");
        createTime.setAttribute("id", "createTime"), createTime.textContent = settings.createTime + "注册", 
        userTextContainer.appendChild(createTime);
        document.createElement("div").setAttribute("id", "uaerDataContainer"), LoggedWarpper.Logged ? userInfoContainer.style.display = "flex" : userInfoContainer.style.display = "none", 
        userInfoContainer.appendChild(userInfo), userInfoContainer.appendChild(userTextContainer), 
        displayArea.appendChild(userInfoContainer);
        const imgContainer = document.createElement("div");
        imgContainer.setAttribute("id", "imgContainer"), LoggedWarpper.Logged ? imgContainer.style.display = "none" : imgContainer.style.display = "flex", 
        imgContainer.style.width = "100%", imgContainer.style.marginBottom = "20px";
        const imge = document.createElement("img");
        imge.src = imageData.weChatQr, imge.style.width = "50%", imgContainer.appendChild(imge);
        const rightContainer = document.createElement("div");
        rightContainer.style.width = "50%", rightContainer.style.alignContent = "center", 
        rightContainer.style.justifyItems = "center";
        const instructions = document.createElement("instructions"), span1 = document.createElement("span"), fingerImg = document.createElement("img");
        fingerImg.src = imageData.fingerEmoji, fingerImg.style.width = "16.8px", instructions.appendChild(fingerImg), 
        span1.innerHTML = "关注公众号", span1.style.fontFamily = "SmileySans-Oblique, sans-serif", 
        span1.style.fontSize = "12px";
        const span2 = document.createElement("span");
        span2.innerHTML = "未耕之地", span2.style.color = "#03a9f5", span2.style.fontFamily = "SmileySans-Oblique, sans-serif", 
        span2.style.fontSize = "12px";
        const div2 = document.createElement("div"), span3 = document.createElement("span");
        span3.innerHTML = "发送验证码完成登录", span3.style.fontFamily = "SmileySans-Oblique, sans-serif", 
        span3.style.fontSize = "12px", div2.appendChild(span3), instructions.appendChild(span1), 
        instructions.appendChild(span2), instructions.appendChild(div2);
        const text = document.createElement("p");
        text.innerHTML = "验证码：", text.style.fontFamily = "SmileySans-Oblique, sans-serif";
        const btn = createButton("点击生成", (async () => {
          await toggleButtonState(btn, !0, LoggedWarpper);
        }));
        if (LoggedWarpper.code) {
          const iconContainer = btn.querySelector(".icon");
          btn.classList.add("loading"), iconContainer.innerHTML = `<div class="VerificationCode">${LoggedWarpper.code}<div>`, 
          btn.disabled = !0;
        }
        rightContainer.appendChild(instructions), rightContainer.appendChild(text), rightContainer.appendChild(btn), 
        imgContainer.appendChild(rightContainer), displayArea.appendChild(imgContainer);
        const examModeLabel = document.createElement("label");
        examModeLabel.classList.add("switch");
        const examModeCheckbox = document.createElement("input");
        examModeCheckbox.type = "checkbox", examModeCheckbox.classList.add("checkbox"), 
        examModeCheckbox.classList.add("examMode");
        const sliderDiv = document.createElement("div");
        sliderDiv.classList.add("slider");
        const examModeText = document.createElement("span");
        examModeText.textContent = "考试模式", examModeText.style.whiteSpace = "nowrap", examModeText.style.marginRight = "112px";
        const examModeWrapper = document.createElement("div");
        examModeWrapper.style.display = "flex", examModeWrapper.style.width = "89%", examModeWrapper.style.alignItems = "center", 
        examModeWrapper.style.justifyContent = "flex-start", examModeWrapper.style.marginTop = "8px", 
        examModeWrapper.style.marginBottom = "0px", examModeWrapper.appendChild(examModeText), 
        examModeWrapper.appendChild(examModeLabel), examModeCheckbox.checked = settings.examMode, 
        examModeCheckbox.addEventListener("change", toggleExamMode), examModeLabel.appendChild(examModeCheckbox), 
        examModeLabel.appendChild(sliderDiv);
        const DeepSeekProxyLabel = document.createElement("label");
        DeepSeekProxyLabel.classList.add("switch");
        const DeepSeekProxyCheckbox = document.createElement("input");
        DeepSeekProxyCheckbox.type = "checkbox", DeepSeekProxyCheckbox.classList.add("checkbox"), 
        DeepSeekProxyCheckbox.classList.add("examMode");
        const sliderDiv2 = document.createElement("div");
        sliderDiv2.classList.add("slider"), DeepSeekProxyLabel.appendChild(DeepSeekProxyCheckbox), 
        DeepSeekProxyLabel.appendChild(sliderDiv2);
        const DeepSeekProxyText = document.createElement("span");
        DeepSeekProxyText.textContent = "本地AI", DeepSeekProxyText.style.whiteSpace = "nowrap", 
        DeepSeekProxyText.style.marginRight = "0px";
        const DeepSeekProxyWrapper = document.createElement("div");
        DeepSeekProxyWrapper.setAttribute("id", "DeepSeekProxyWrapper"), DeepSeekProxyWrapper.style.display = "flex", 
        DeepSeekProxyWrapper.style.width = "89%", DeepSeekProxyWrapper.style.alignItems = "center", 
        DeepSeekProxyWrapper.style.justifyContent = "flex-start", DeepSeekProxyWrapper.style.marginBottom = "0px", 
        DeepSeekProxyWrapper.appendChild(DeepSeekProxyText);
        const questionMark = document.createElement("div");
        questionMark.addEventListener("click", (() => {
          window.open("https://pages.zaizhexue.top/home/DeepSeek");
        })), questionMark.classList.add("question-mark"), questionMark.innerHTML = '<svg t="1741083582512" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5218" width="20" height="20"><path d="M512 981.3C253.2 981.3 42.7 770.8 42.7 512S253.2 42.7 512 42.7 981.3 253.2 981.3 512 770.8 981.3 512 981.3z m0-853.3c-211.7 0-384 172.3-384 384s172.3 384 384 384 384-172.3 384-384-172.3-384-384-384z" fill="#BDBDBD" p-id="5219"></path><path d="M512 640c-23.6 0-42.7-19.1-42.7-42.7 0-53.5 28.7-101.8 74.8-126.2 22.9-12.1 42.6-40.4 35.1-76.2-5.4-25.7-26.2-46.6-51.9-51.9-21.4-4.5-42.3 0.4-58.7 13.8-16.2 13.2-25.5 32.6-25.5 53.5 0 23.6-19.1 42.7-42.7 42.7s-42.7-19.1-42.7-42.7c0-46.6 20.8-90.2 57-119.7 36.2-29.4 83.6-40.8 129.9-31.1 58.4 12.2 105.9 59.6 118.1 118.1 14.3 68.6-17.3 136.6-78.8 169-18.1 9.6-29.4 29.1-29.4 50.8 0.2 23.5-18.9 42.6-42.5 42.6z" fill="#BDBDBD" p-id="5220"></path><path d="M512 725.3m-42.7 0a42.7 42.7 0 1 0 85.4 0 42.7 42.7 0 1 0-85.4 0Z" fill="#BDBDBD" p-id="5221"></path></svg>', 
        questionMark.style.marginLeft = "4px", questionMark.style.marginRight = "103px", 
        DeepSeekProxyWrapper.appendChild(questionMark), DeepSeekProxyWrapper.appendChild(DeepSeekProxyLabel), 
        DeepSeekProxyCheckbox.checked = settings.deepseekProxy, console.log("deepseekProxy", settings.deepseekProxy), 
        DeepSeekProxyCheckbox.addEventListener("change", (() => {
          settings.deepseekProxy ? settings.deepseekProxy = !1 : (settings.deepseekProxy = !0, 
          async function() {
            try {
              const controller = new AbortController, timeoutId = setTimeout((() => controller.abort()), 1e3);
              return await fetch("http://localhost:5233/courseware", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  username: "",
                  password: ""
                }),
                signal: controller.signal
              }), clearTimeout(timeoutId), !0;
            } catch (error) {
              const modal = document.createElement("div");
              return modal.style.cssText = "\n            position: fixed;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 0 10px rgba(0,0,0,0.3);\n            z-index: 10000;\n            width: 400px;\n        ", 
              modal.innerHTML = '\n            <h3 style="margin-top: 0;">无法连接到本地服务器，请下载ZError并开启服务，否则请关闭该选项</h3>\n            <p>下载途径：</p>\n            <ul style="list-style: none; padding-left: 0;">\n                <li style="margin-bottom: 10px;">\n                    <strong>蓝奏云：</strong>\n                    <a href="https://wwyl.lanzouv.com/b00ocrzzje" target="_blank">点击下载</a>\n                    （密码：43so）\n                </li>\n                <li style="margin-bottom: 10px;">\n                    <strong>直链下载：</strong>\n                    <a href="https://dwpan.com/f/bYhj/ZError_Setup_1.0.0.exe" target="_blank">点击下载</a>\n                </li>\n                    <li style="margin-bottom: 10px;">\n                    <strong>官网：</strong>\n                    <a href="https://zerror.neoregion.cn/" target="_blank">点击访问</a>\n                </li>\n            </ul>\n            <button style="\n                padding: 8px 16px;\n                background: #4D6BFE;\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n                display: block;\n                margin: 20px auto 0;\n            ">关闭</button>\n        ', 
              document.body.appendChild(modal), modal.querySelector("button").addEventListener("click", (() => {
                document.body.removeChild(modal);
              })), !1;
            }
          }());
        }));
        const DoVideoLabel = document.createElement("label");
        DoVideoLabel.classList.add("switch");
        const DoVideoCheckbox = document.createElement("input");
        DoVideoCheckbox.type = "checkbox", DoVideoCheckbox.classList.add("checkbox"), DoVideoCheckbox.classList.add("dovideo");
        const sliderDiv3 = document.createElement("div");
        sliderDiv3.classList.add("slider"), DoVideoLabel.appendChild(DoVideoCheckbox), DoVideoLabel.appendChild(sliderDiv3);
        const DoVideoText = document.createElement("span");
        DoVideoText.textContent = "课件速刷", DoVideoText.style.whiteSpace = "nowrap", DoVideoText.style.marginRight = "0px";
        const DoVideoWrapper = document.createElement("div");
        DoVideoWrapper.setAttribute("id", "DoVideoWrapper"), DoVideoWrapper.style.display = "flex", 
        DoVideoWrapper.style.width = "89%", DoVideoWrapper.style.alignItems = "center", 
        DoVideoWrapper.style.justifyContent = "flex-start", DoVideoWrapper.style.marginBottom = "0px", 
        DoVideoWrapper.style.marginTop = "8px", DoVideoWrapper.appendChild(DoVideoText);
        const questionMark2 = document.createElement("div");
        questionMark2.addEventListener("click", (() => {
          window.open("https://pages.zaizhexue.top/home/QuickCoursewareBrowsing");
        })), questionMark2.classList.add("question-mark"), questionMark2.innerHTML = '<svg t="1741083582512" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5218" width="20" height="20"><path d="M512 981.3C253.2 981.3 42.7 770.8 42.7 512S253.2 42.7 512 42.7 981.3 253.2 981.3 512 770.8 981.3 512 981.3z m0-853.3c-211.7 0-384 172.3-384 384s172.3 384 384 384 384-172.3 384-384-172.3-384-384-384z" fill="#BDBDBD" p-id="5219"></path><path d="M512 640c-23.6 0-42.7-19.1-42.7-42.7 0-53.5 28.7-101.8 74.8-126.2 22.9-12.1 42.6-40.4 35.1-76.2-5.4-25.7-26.2-46.6-51.9-51.9-21.4-4.5-42.3 0.4-58.7 13.8-16.2 13.2-25.5 32.6-25.5 53.5 0 23.6-19.1 42.7-42.7 42.7s-42.7-19.1-42.7-42.7c0-46.6 20.8-90.2 57-119.7 36.2-29.4 83.6-40.8 129.9-31.1 58.4 12.2 105.9 59.6 118.1 118.1 14.3 68.6-17.3 136.6-78.8 169-18.1 9.6-29.4 29.1-29.4 50.8 0.2 23.5-18.9 42.6-42.5 42.6z" fill="#BDBDBD" p-id="5220"></path><path d="M512 725.3m-42.7 0a42.7 42.7 0 1 0 85.4 0 42.7 42.7 0 1 0-85.4 0Z" fill="#BDBDBD" p-id="5221"></path></svg>', 
        questionMark2.style.marginLeft = "4px", questionMark2.style.marginRight = "88px", 
        DoVideoWrapper.appendChild(questionMark2), DoVideoWrapper.appendChild(DoVideoLabel), 
        DoVideoCheckbox.checked = settings.doVideo, DoVideoCheckbox.addEventListener("change", (async function() {
          if (console.log(DoVideoCheckbox), !settings.doVideo) {
            if (!await showConfirmDialog('不建议开启，关闭该选项也可以使用"自动播放"挂课，但开启后"自动播放"将在几秒内完成所有课件，会有被清空的风险，因此除真的非来不及，否则不建议开启！')) return console.log("取消开启"), 
            void renderSettingsPage();
          }
          !settings.doVideo && this.checked ? settings.doVideo = !0 : settings.doVideo = this.checked;
        }));
        const notice = document.createElement("div"), zerrorLink = document.createElement("a");
        zerrorLink.textContent = " ZError ", zerrorLink.href = "https://tiku.zerror.cc", 
        zerrorLink.style.fontWeight = "bold", zerrorLink.style.textDecoration = "none", 
        zerrorLink.style.color = "#DAA520", zerrorLink.target = "_blank";
        const websiteLink = document.createElement("a");
        websiteLink.textContent = "pages.zaizhexue.top", websiteLink.href = "https://pages.zaizhexue.top", 
        websiteLink.style.textDecoration = "none", websiteLink.style.color = "#DAA520", 
        websiteLink.target = "_blank", notice.appendChild(document.createTextNode("由")), 
        notice.appendChild(zerrorLink), notice.appendChild(document.createTextNode("提供题库支持，在浙学助手官网")), 
        notice.appendChild(websiteLink), notice.style.border = "1px solid #FFE44D", notice.style.backgroundColor = "#FFF8DC", 
        notice.style.padding = "10px", notice.style.marginBottom = "10px", notice.style.marginTop = "10px", 
        notice.style.borderRadius = "8px", notice.style.fontSize = "14px", notice.style.fontFamily = "SmileySans-Oblique, sans-serif", 
        notice.style.color = "#DAA520", displayArea.appendChild(DeepSeekProxyWrapper), displayArea.appendChild(DoVideoWrapper), 
        displayArea.appendChild(examModeWrapper), displayArea.appendChild(notice), applySwitchStyles();
      }
      function renderHomePage() {
        displayArea.innerHTML = "";
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex", buttonContainer.style.flexDirection = "column", 
        buttonContainer.style.justifyContent = "flex-start", buttonContainer.style.gap = "20px", 
        buttonContainer.style.marginTop = "20px";
        const showAnswerButton = document.createElement("button");
        showAnswerButton.textContent = showAnswer ? "隐藏答案" : "显示答案", showAnswerButton.classList.add("showAnswerButton"), 
        showAnswerButton.style.padding = "12.5px 30px", showAnswerButton.style.border = "0", 
        showAnswerButton.style.borderRadius = "10px", showAnswerButton.style.marginLeft = "10px", 
        showAnswerButton.style.marginRight = "10px", showAnswerButton.style.backgroundColor = "#2ba8fb", 
        showAnswerButton.style.color = "#ffffff", showAnswerButton.style.fontWeight = "Bold", 
        showAnswerButton.style.transition = "all 0.2s", showAnswerButton.style.webkitTransition = "all 0.2s", 
        showAnswerButton.addEventListener("click", (async () => {
          await toggleModifiedElements();
        })), showAnswerButton.addEventListener("mouseenter", (() => {
          showAnswerButton.style.backgroundColor = "#6fc5ff", showAnswerButton.style.boxShadow = "0 0 20px #6fc5ff50", 
          showAnswerButton.style.transform = "scale(1.1)";
        })), showAnswerButton.addEventListener("mouseleave", (() => {
          showAnswerButton.style.backgroundColor = "#2ba8fb", showAnswerButton.style.boxShadow = "none", 
          showAnswerButton.style.transform = "scale(1)";
        })), showAnswerButton.addEventListener("mousedown", (() => {
          showAnswerButton.style.transform = "scale(0.98)";
        })), showAnswerButton.addEventListener("mouseup", (() => {
          showAnswerButton.style.transform = "scale(1.1)";
        }));
        const syncButton = document.createElement("button");
        syncButton.textContent = "解除复制限制", syncButton.style.padding = "12.5px 30px", syncButton.style.border = "0", 
        syncButton.style.borderRadius = "10px", syncButton.style.marginLeft = "10px", syncButton.style.marginRight = "10px", 
        syncButton.style.backgroundColor = "#2ba8fb", syncButton.style.color = "#ffffff", 
        syncButton.style.fontWeight = "Bold", syncButton.style.transition = "all 0.2s", 
        syncButton.style.webkitTransition = "all 0.2s", syncButton.addEventListener("click", initializeEditorSync), 
        syncButton.addEventListener("mouseenter", (() => {
          syncButton.style.backgroundColor = "#6fc5ff", syncButton.style.boxShadow = "0 0 20px #6fc5ff50", 
          syncButton.style.transform = "scale(1.1)";
        })), syncButton.addEventListener("mouseleave", (() => {
          syncButton.style.backgroundColor = "#2ba8fb", syncButton.style.boxShadow = "none", 
          syncButton.style.transform = "scale(1)";
        })), syncButton.addEventListener("mousedown", (() => {
          syncButton.style.transform = "scale(0.98)";
        })), syncButton.addEventListener("mouseup", (() => {
          syncButton.style.transform = "scale(1.1)";
        }));
        const autoplayButton = document.createElement("button");
        autoplayButton.setAttribute("id", "autoplay-button-id"), autoplayButton.textContent = isPlaying ? "停止自动播放" : "自动播放", 
        autoplayButton.style.padding = "12.5px 30px", autoplayButton.style.border = "0", 
        autoplayButton.style.borderRadius = "10px", autoplayButton.style.marginLeft = "10px", 
        autoplayButton.style.marginRight = "10px", autoplayButton.style.backgroundColor = "#2ba8fb", 
        autoplayButton.style.color = "#ffffff", autoplayButton.style.fontWeight = "Bold", 
        autoplayButton.style.transition = "all 0.2s", autoplayButton.style.webkitTransition = "all 0.2s", 
        autoplayButton.addEventListener("click", (async function() {
          if ("自动播放" === autoplayButton.innerText) {
            if (isPlaying = !0, autoplayButton.innerText = "停止自动播放", "www.zjooc.cn" !== window.location.hostname) console.log(localStorage.getItem("CourseChaptersZJLLL")), 
            displaySuccessNotification("该功能尚不完善", "如想为该功能优化做测试，请前往脚本官网联系开发者"), await autoPlayZJLLL(); else {
              CourseChapters && 0 !== Object.keys(CourseChapters).length || (CourseChapters = JSON.parse(localStorage.getItem("CourseChapters"))), 
              stopAnimation = createFloatingImageWorld();
              const msg = await autoPlay(CourseChapters, listenRouteWarpper);
              console.log(msg), "error" === msg[0] ? (console.log(msg[1]), displayErrorNotification("页面错误", [ msg[1] ])) : (console.log(msg[1]), 
              displaySuccessNotification(msg[1], ""));
            }
            autoplayButton.innerText = "自动播放", isPlaying = !1, stopAnimation();
          } else isPlaying = !1, stopAutoPlay(), autoplayButton.innerText = "自动播放", stopAnimation();
        })), autoplayButton.addEventListener("mouseenter", (() => {
          autoplayButton.style.backgroundColor = "#6fc5ff", autoplayButton.style.boxShadow = "0 0 20px #6fc5ff50", 
          autoplayButton.style.transform = "scale(1.1)";
        })), autoplayButton.addEventListener("mouseleave", (() => {
          autoplayButton.style.backgroundColor = "#2ba8fb", autoplayButton.style.boxShadow = "none", 
          autoplayButton.style.transform = "scale(1)";
        })), autoplayButton.addEventListener("mousedown", (() => {
          autoplayButton.style.transform = "scale(0.98)";
        })), autoplayButton.addEventListener("mouseup", (() => {
          autoplayButton.style.transform = "scale(1.1)";
        }));
        const muteLabel = document.createElement("label");
        muteLabel.classList.add("switch");
        const muteCheckbox = document.createElement("input");
        muteCheckbox.type = "checkbox", muteCheckbox.classList.add("checkbox");
        const sliderDiv = document.createElement("div");
        sliderDiv.classList.add("slider"), muteLabel.appendChild(muteCheckbox), muteLabel.appendChild(sliderDiv);
        const muteText = document.createElement("span");
        muteText.textContent = "视频静音", muteText.style.marginRight = "10px";
        const muteWrapper = document.createElement("div");
        muteWrapper.style.display = "flex", muteWrapper.style.width = "89%", muteWrapper.style.alignItems = "center", 
        muteWrapper.style.justifyContent = "flex-start", muteWrapper.style.marginBottom = "0px", 
        muteWrapper.appendChild(muteText), muteWrapper.appendChild(muteLabel), muteCheckbox.checked = settings.mute, 
        muteCheckbox.addEventListener("change", toggleMute);
        const bodyContainer = document.createElement("div");
        bodyContainer.classList.add("body-container");
        const speedText = document.createElement("div");
        speedText.textContent = "视频倍速", speedText.style.textAlign = "left", speedText.style.marginBottom = "8px";
        const radioInputDiv = document.createElement("div");
        radioInputDiv.classList.add("radio-input");
        const currentSpeed = settings.speed, label1 = document.createElement("label"), input1 = document.createElement("input");
        input1.type = "radio", input1.name = "fav_language", input1.id = "value-1", input1.value = "1";
        const span1 = document.createElement("span");
        span1.textContent = "1", label1.appendChild(input1), label1.appendChild(span1), 
        input1.addEventListener("change", (e => {
          e.target.checked && setVideoSpeed(e.target.value);
        })), input1.value === currentSpeed && (input1.checked = !0);
        const label2 = document.createElement("label"), input2 = document.createElement("input");
        input2.type = "radio", input2.name = "fav_language", input2.id = "value-2", input2.value = "2";
        const span2 = document.createElement("span");
        span2.textContent = "2", label2.appendChild(input2), label2.appendChild(span2), 
        input2.addEventListener("change", (e => {
          e.target.checked && setVideoSpeed(e.target.value);
        })), input2.value === currentSpeed && (input2.checked = !0);
        const label3 = document.createElement("label"), input3 = document.createElement("input");
        input3.type = "radio", input3.name = "fav_language", input3.id = "value-3", input3.value = "3";
        const span3 = document.createElement("span");
        span3.textContent = "3", label3.appendChild(input3), label3.appendChild(span3), 
        input3.addEventListener("change", (e => {
          e.target.checked && setVideoSpeed(e.target.value);
        })), input3.value === currentSpeed && (input3.checked = !0);
        const label4 = document.createElement("label"), input4 = document.createElement("input");
        input4.type = "radio", input4.name = "fav_language", input4.id = "value-4", input4.value = "4";
        const span4 = document.createElement("span");
        span4.textContent = "4", label4.appendChild(input4), label4.appendChild(span4), 
        label4.appendChild(span4), input4.addEventListener("change", (e => {
          e.target.checked && setVideoSpeed(e.target.value);
        })), input4.value === currentSpeed && (input4.checked = !0);
        const selection1 = document.createElement("span");
        selection1.classList.add("selection");
        const selection2 = document.createElement("span");
        selection2.classList.add("selection2"), radioInputDiv.appendChild(label1), radioInputDiv.appendChild(label2), 
        radioInputDiv.appendChild(label3), radioInputDiv.appendChild(label4), radioInputDiv.appendChild(selection1), 
        radioInputDiv.appendChild(selection2), bodyContainer.appendChild(speedText), bodyContainer.appendChild(radioInputDiv), 
        buttonContainer.appendChild(showAnswerButton), buttonContainer.appendChild(syncButton), 
        buttonContainer.appendChild(autoplayButton), buttonContainer.appendChild(muteWrapper), 
        buttonContainer.appendChild(bodyContainer), displayArea.appendChild(buttonContainer), 
        applySwitchStyles();
      }
      function displaySuccessNotification(heading, prompt) {
        if (settings.examMode) return;
        const notificationContainer = document.createElement("div");
        notificationContainer.className = "notifications-container";
        const notificationHTML = `\n      <div class="success">\n          <div class="flex">\n              <div class="flex-shrink-0">\n                  <svg class="succes-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">\n                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>\n                  </svg>\n              </div>\n              <div class="success-prompt-wrap">\n                  <p class="success-prompt-heading">${heading}</p>\n                  <div class="success-prompt-prompt">${prompt}</div>\n              </div>\n          </div>\n      </div>\n      `;
        notificationContainer.innerHTML = notificationHTML;
        const style = document.createElement("style");
        style.textContent = "\n      .notifications-container {\n          width: 320px;\n          height: auto;\n          font-size: 0.875rem;\n          line-height: 1.25rem;\n          display: flex;\n          flex-direction: column;\n          gap: 1rem;\n          position: fixed;\n          top: 20px;\n          right: 20px;\n          z-index: 9999;\n      }\n\n      .flex {\n          display: flex;\n      }\n\n      .flex-shrink-0 {\n          flex-shrink: 0;\n      }\n\n      .success {\n          padding: 1rem;\n          border-radius: 0.375rem;\n          background-color: rgb(240 253 244);\n          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n      }\n\n      .succes-svg {\n          color: rgb(74 222 128);\n          width: 1.25rem;\n          height: 1.25rem;\n      }\n\n      .success-prompt-wrap {\n          margin-left: 0.75rem;\n      }\n\n      .success-prompt-heading {\n          font-weight: bold;\n          color: rgb(22 101 52);\n      }\n\n      .success-prompt-prompt {\n          margin-top: 0.5rem;\n          color: rgb(21 128 61);\n      }\n      ", 
        document.head.appendChild(style), document.body.appendChild(notificationContainer), 
        setTimeout((() => {
          notificationContainer.remove();
        }), 3e3);
      }
      function displayErrorNotification(heading, details) {
        if (settings.examMode) return;
        const notificationContainer = document.createElement("div");
        notificationContainer.className = "notifications-container";
        const notificationHTML = `\n  <div class="error-alert">\n      <div class="flex">\n          <div class="flex-shrink-0">\n              <svg class="error-svg" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">\n                  <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>\n              </svg>\n          </div>\n          <div class="error-prompt-container">\n              <p class="error-prompt-heading">${heading}</p>\n              <div class="error-prompt-wrap">\n                  <ul class="error-prompt-list" role="list">\n                      ${details.map((item => `<li>${item}</li>`)).join("")}\n                  </ul>\n              </div>\n          </div>\n      </div>\n  </div>\n  `;
        notificationContainer.innerHTML = notificationHTML, notificationContainer.style.cssText = "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      z-index: 9999;\n      opacity: 0;\n      animation: fadeIn 0.5s forwards, fadeOut 0.5s forwards 3s;\n  ", 
        document.body.appendChild(notificationContainer);
        const style = document.createElement("style");
        style.textContent = "\n  .notifications-container {\n      width: 320px;\n      height: auto;\n      font-size: 0.875rem;\n      line-height: 1.25rem;\n      display: flex;\n      flex-direction: column;\n      gap: 1rem;\n  }\n\n  .flex {\n      display: flex;\n  }\n\n  .flex-shrink-0 {\n      flex-shrink: 0;\n  }\n\n  .error-alert {\n      border-radius: 0.375rem;\n      padding: 1rem;\n      background-color: rgb(254 242 242);\n      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n  }\n\n  .error-svg {\n      color: #F87171;\n      width: 1.25rem;\n      height: 1.25rem;\n  }\n\n  .error-prompt-heading {\n      color: #991B1B;\n      font-size: 0.875rem;\n      line-height: 1.25rem;\n      font-weight: bold;\n  }\n\n  .error-prompt-container {\n      display: flex;\n      flex-direction: column;\n      margin-left: 1.25rem;\n  }\n\n  .error-prompt-wrap {\n      margin-top: 0.5rem;\n      color: #B91C1C;\n      font-size: 0.875rem;\n      line-height: 1.25rem;\n  }\n\n  .error-prompt-list {\n      padding-left: 1.25rem;\n      margin-top: 0.25rem;\n      list-style-type: disc;\n  }\n\n  @keyframes fadeIn {\n      from { opacity: 0; transform: translateY(-20px); }\n      to { opacity: 1; transform: translateY(0); }\n  }\n\n  @keyframes fadeOut {\n      from { opacity: 1; transform: translateY(0); }\n      to { opacity: 0; transform: translateY(-20px); }\n  }\n  ", 
        document.head.querySelector("#error-notification-styles") || (style.id = "error-notification-styles", 
        document.head.appendChild(style)), setTimeout((() => {
          notificationContainer.remove();
        }), 3e3);
      }
      async function toggleExamMode() {
        const examModeCheckbox = document.getElementsByClassName("examMode")[0];
        if (console.log(examModeCheckbox), !settings.examMode) {
          if (!await showConfirmDialog("开启后插件窗口将默认不显示！！！你可以您可以通过快捷键F9开关窗口，F2开关答案显示，所有提示弹窗提示也将不会显示。你确定要开启吗？")) return console.log("取消开启"), 
          void renderSettingsPage();
        }
        document.querySelectorAll(".modified").forEach((element => {
          element.remove();
        })), settings.examMode = !settings.examMode, console.log(settings.examMode), showAnswer && displayRightAnswers();
      }
      header.addEventListener("mousedown", (e => {
        isDragging = !0, offsetX = e.clientX - windowDiv.offsetLeft, offsetY = e.clientY - windowDiv.offsetTop, 
        document.addEventListener("mousemove", onMouseMove), document.addEventListener("mouseup", onMouseUp);
      })), async function(retries = 3) {
        const attemptFetch = async retryCount => {
          try {
            const response = await fetch("https://app.zaizhexue.top/validateToken", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                token: settings.token
              })
            });
            if (!response.ok) {
              throw await response.json();
            }
            {
              const data = await response.json();
              LoggedWarpper.Logged = !0;
              let userInfoContainer = document.getElementById("userInfoContainer");
              userInfoContainer && (userInfoContainer.style.display = "flex");
              let imgContainer = document.getElementById("imgContainer");
              imgContainer && (imgContainer.style.display = "none");
              const usernameElement = document.getElementById("username");
              usernameElement && (usernameElement.innerHTML = data.user.nickname), settings.username = data.user.nickname;
              const createTimeElement = document.getElementById("createTime"), userCreatedTime = new Date(data.user.createdTime), formattedDate = `${userCreatedTime.getMonth() + 1}/${userCreatedTime.getDate()}/${userCreatedTime.getFullYear()}`;
              createTimeElement && (createTimeElement.innerHTML = formattedDate + "注册"), settings.createTime = formattedDate, 
              renderHomePage();
            }
          } catch (error) {
            if (console.error("Error:", error), retryCount > 0) return await new Promise((resolve => setTimeout(resolve, 1e3))), 
            attemptFetch(retryCount - 1);
            "Token expired" === error.error ? displayErrorNotification("登录过期", [ "已过期，请重新登录" ]) : displayErrorNotification("登录信息出错", [ "请重新登录" ]), 
            settings.token = "", renderSettingsPage();
          }
        };
        await attemptFetch(retries);
      }(), function(LoggedWarpper) {
        const currentPath = window.location.pathname;
        "/dist" !== currentPath && "/dist/" !== currentPath || (console.log("跳转到根路径"), window.location.href = "/", 
        LoggedWarpper.Logged = !0);
      }();
      let cachedPaperSubjectList = null, alerted = 0;
      function displayAnswersRecursively(questions, subject, index) {
        if (!(subject.rightAnswer || subject.childrenList && 0 !== subject.childrenList.length || 0 != alerted)) return alert("请求中没有答案"), 
        void (alerted = 1);
        if (subject.rightAnswer && questions[index]) {
          const answerElement = document.createElement("div");
          answerElement.style.color = "green", answerElement.style.fontWeight = "bold", answerElement.className = "answer-display", 
          answerElement.classList.add("modified");
          const isHtml = /<[^>]*>/g.test(subject.rightAnswer);
          if (7 == subject.subjectType) {
            let formattedAnswers = "";
            if (settings.examMode) {
              let rawAnswer = subject.rightAnswer.replace(/\|/g, ",");
              JSON.parse(rawAnswer).forEach(((answerSet, idx) => {
                const answerToDisplay = Array.isArray(answerSet) && answerSet.length > 0 ? answerSet[0] : answerSet;
                formattedAnswers += `${answerToDisplay} `;
              })), formattedAnswers = formattedAnswers.trim(), console.log(formattedAnswers), 
              insertIntoDeepestElement(questions[index], formattedAnswers);
            } else {
              console.log("填空题");
              let rawAnswer = subject.rightAnswer.replace(/\|/g, ","), parsedAnswers = JSON.parse(rawAnswer);
              const fillBlankDivs = questions[index].querySelectorAll(".el-row");
              if (fillBlankDivs && fillBlankDivs.length == parsedAnswers.length) fillBlankDivs.forEach(((div, idx) => {
                if (parsedAnswers[idx]) {
                  const individualAnswer = document.createElement("div");
                  individualAnswer.style.color = "blue", individualAnswer.classList.add("modified"), 
                  Array.isArray(parsedAnswers[idx]) && parsedAnswers[idx].length > 1 ? individualAnswer.innerHTML = `第${idx + 1}问:<br>${parsedAnswers[idx].map((ans => `<code class="answer" onclick="copyText(this)">${ans}</code>`)).join(" ")}（只用填一个，多填不给分）` : individualAnswer.innerHTML = `第${idx + 1}问: <code class="answer" onclick="copyText(this)">${parsedAnswers[idx]}</code>`, 
                  div.appendChild(individualAnswer);
                }
              })); else {
                try {
                  parsedAnswers.forEach(((answerSet, idx) => {
                    Array.isArray(answerSet) && answerSet.length > 1 ? formattedAnswers += `第${idx + 1}问:<br>${answerSet.map((ans => `<code class="answer" onclick="copyText(this)">${ans}</code>`)).join(" ")}（只用填一个，多填不给分）<br>` : formattedAnswers += `第${idx + 1}问: <code class="answer" onclick="copyText(this)">${answerSet}</code><br>`;
                  })), formattedAnswers = formattedAnswers.trim(), answerElement.innerHTML = `正确答案:<br>${formattedAnswers}`;
                } catch (e) {
                  console.error("Failed to parse rightAnswer:", subject.rightAnswer, e), answerElement.textContent = "正确答案: 格式错误";
                }
                questions[index].appendChild(answerElement);
              }
            }
          } else if (settings.examMode) insertIntoDeepestElement(questions[index], subject.rightAnswer); else {
            isHtml ? answerElement.innerHTML = `正确答案:<br>${subject.rightAnswer}` : answerElement.textContent = `正确答案: ${subject.rightAnswer}`, 
            questions[index].appendChild(answerElement);
            let answers = subject.rightAnswer.split(",");
            const common_test_options = questions[index].querySelectorAll(".common_test_option");
            common_test_options.length > 0 && (console.log("开始答题"), answers.forEach(((answer, index) => {
              let optionIndex;
              if ("yes" === answer.toLowerCase()) optionIndex = 0; else if ("no" === answer.toLowerCase()) optionIndex = 1; else {
                if (!/^[A-Za-z]$/.test(answer.trim())) return void console.log(`无效的答案：${answer}`);
                optionIndex = answer.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
              }
              if (optionIndex >= 0 && optionIndex < common_test_options.length) {
                const firstChild = common_test_options[optionIndex].firstElementChild;
                firstChild ? setTimeout((() => {
                  firstChild.classList.contains("is-checked") || (firstChild.click(), console.log("点击了", firstChild));
                }), 200 * index) : console.log(`选项 ${answer} 没有子元素`);
              } else console.log(`无效的选项索引：${optionIndex}`);
            })));
          }
        }
        if (subject.childrenList && Array.isArray(subject.childrenList)) {
          const subquestions = questions[index].querySelectorAll(".questiono-main");
          subject.childrenList.forEach(((child, index) => {
            displayAnswersRecursively(subquestions, child, index);
          }));
        }
      }
      function checkRightAnswer(obj) {
        if (!obj || !obj.data || !Array.isArray(obj.data.paperSubjectList)) return !1;
        for (const subject of obj.data.paperSubjectList) {
          if ("rightAnswer" in subject) return !0;
          if (subject.childrenList) for (const child of subject.childrenList) if ("rightAnswer" in child) return !0;
        }
        return !1;
      }
      async function uploadOriginalJson() {
        console.log(originalJson);
        try {
          const response = await fetch("https://app.zaizhexue.top/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(originalJson)
          }), data = await response.json();
          console.log("Success:", data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
      async function fetchOriginalJson(id, needData = !0) {
        try {
          console.log("正在发请求");
          const token = settings.token, response = await fetch(`https://app.zaizhexue.top/originalJson?id=${id}&need_data=${needData}&token=${token}`);
          if (!response.ok) throw new Error(`Error: ${response.statusText}`);
          return await response.json();
        } catch (error) {
          return console.error("Failed to fetch original JSON:", error), null;
        }
      }
      async function displayRightAnswers() {
        if (document.querySelectorAll(".modified").length > 0) return;
        const questions = document.querySelectorAll(".questiono-item");
        questions.length > 0 && questions.forEach((question => {
          insertButtonAndFetchContent(question);
        }));
        if (!settings.token) return void displayErrorNotification("请先登录", [ "未登录状态不能使用显示答案功能，其他功能不受限" ]);
        const originalJsonCopy = JSON.parse(localStorage.getItem("originalJsonCopy")), TitleP = document.querySelector("div.top_title p"), TitleH6 = document.querySelector("h6");
        if (!TitleP && !TitleH6) return console.error("无法获取试卷标题"), displayErrorNotification("无法获取试卷标题", [ "请进入试卷页面再进行答题" ]), 
        void (showAnswer = !1);
        const title = TitleP ? TitleP.textContent : TitleH6.textContent;
        if (console.log(originalJsonCopy), originalJsonCopy && (originalJsonCopy.data.paperName.trim() == title.trim() ? cachedPaperSubjectList = (originalJson = originalJsonCopy).data.paperSubjectList : (console.log(originalJsonCopy.data.paperName.trim()), 
        console.log(title.trim()))), console.log("DOM中的标题：", title), !originalJson || !originalJson.data || void 0 === originalJson.data.id) return console.error("Invalid originalJson structure or missing id"), 
        displayErrorNotification("无法获取试卷ID", [ "不用担心，这可能是因为你刷新了页面，退出后重新进入答题即可" ]), void console.log(originalJson);
        if (!checkRightAnswer(originalJson)) {
          const paperId = originalJson.data.id;
          try {
            originalJson = await fetchOriginalJson(paperId), localStorage.setItem("originalJsonCopy", JSON.stringify(originalJson)), 
            console.log("已经存储");
          } catch (error) {
            return console.error("Error fetching new originalJson:", error), void displayErrorNotification("很抱歉", [ "暂时没有答案" ]);
          }
        }
        const customOrder = [ 1, 2, 3, 10, 11, 5, 7, 8, 9 ], sortedSubjects = [ ...cachedPaperSubjectList ].sort(((a, b) => customOrder.indexOf(a.subjectType || 0) - customOrder.indexOf(b.subjectType || 0)));
        if (questions.length > 0) {
          if (!checkRightAnswer(originalJson)) return void displayErrorNotification("很抱歉", [ "暂时没有答案" ]);
          sortedSubjects.forEach(((subject, index) => {
            displayAnswersRecursively(questions, subject, index);
          }));
        } else {
          const indexbox = document.querySelector(".index_box");
          if (!indexbox) return void displayErrorNotification("未在页面上找到题目", [ "请在答题页面中尝试显示答案" ]);
          if (indexbox.querySelectorAll("li").forEach((li => {
            if (li.classList.contains("show_select")) {
              const questionTitle = document.querySelector(".question_content .question_title").textContent.trim().replace(/\s+/g, ""), matchedSubject = sortedSubjects.find((subject => {
                const tempDiv = document.createElement("div");
                return tempDiv.innerHTML = subject.subjectName, tempDiv.textContent.trim().replace(/\s+/g, ""), 
                console.log(tempDiv.textContent.trim().replace(/\s+/g, "")), tempDiv.textContent.trim().replace(/\s+/g, "") === questionTitle;
              }));
              matchedSubject ? console.log("Found matched subject:", matchedSubject) : console.log("No matching subject found."), 
              handleClick(matchedSubject);
            }
          })), indexbox) {
            const buttons = document.querySelectorAll("button"), previousButton = Array.from(buttons).find((button => "上一题" === button.textContent.trim())), nextButton = Array.from(buttons).find((button => "下一题" === button.textContent.trim()));
            indexbox.querySelectorAll("li").forEach((li => {
              li.addEventListener("click", (() => {
                const questionTitle = document.querySelector(".question_content .question_title").textContent.trim().replace(/\s+/g, "");
                console.log(questionTitle);
                const matchedSubject = sortedSubjects.find((subject => {
                  const tempDiv = document.createElement("div");
                  return tempDiv.innerHTML = subject.subjectName, tempDiv.textContent.trim().replace(/\s+/g, ""), 
                  console.log(tempDiv.textContent.trim().replace(/\s+/g, "")), tempDiv.textContent.trim().replace(/\s+/g, "") === questionTitle;
                }));
                if (matchedSubject) console.log("Found matched subject:", matchedSubject); else {
                  console.log("No matching subject found.");
                  document.querySelectorAll(".answer-display").forEach((el => el.remove()));
                }
                showAnswer && handleClick(matchedSubject);
              }));
            }));
            for (const button of [ previousButton, nextButton ]) button.addEventListener("click", (() => {
              const questionTitle = document.querySelector(".question_content .question_title").textContent.trim().replace(/\s+/g, "");
              console.log(questionTitle);
              const matchedSubject = sortedSubjects.find((subject => {
                const tempDiv = document.createElement("div");
                return tempDiv.innerHTML = subject.subjectName, tempDiv.textContent.trim().replace(/\s+/g, ""), 
                console.log(tempDiv.textContent.trim().replace(/\s+/g, "")), tempDiv.textContent.trim().replace(/\s+/g, "") === questionTitle;
              }));
              if (matchedSubject) console.log("Found matched subject:", matchedSubject); else {
                console.log("No matching subject found.");
                document.querySelectorAll(".answer-display").forEach((el => el.remove()));
              }
              showAnswer && handleClick(matchedSubject);
            }));
          } else console.error("没有找到 .index_box 元素");
        }
      }
      function handleClick(subject) {
        document.querySelectorAll(".modified").forEach((el => el.remove()));
        const question_content = document.querySelector(".question_content"), answerElement = document.createElement("div");
        if (answerElement.style.color = "green", answerElement.style.fontWeight = "bold", 
        answerElement.className = "answer-display", answerElement.classList.add("modified"), 
        insertButtonAndFetchContent(question_content), !subject) return;
        const isHtml = /<[^>]*>/g.test(subject.rightAnswer);
        if (7 == subject.subjectType) {
          let rawAnswer = subject.rightAnswer.replace(/\|/g, ","), parsedAnswers = JSON.parse(rawAnswer), formattedAnswers = "";
          if (settings.examMode) {
            let rawAnswer = subject.rightAnswer.replace(/\|/g, ",");
            JSON.parse(rawAnswer).forEach(((answerSet, idx) => {
              const answerToDisplay = Array.isArray(answerSet) && answerSet.length > 0 ? answerSet[0] : answerSet;
              formattedAnswers += `${answerToDisplay} `;
            })), formattedAnswers = formattedAnswers.trim(), console.log(formattedAnswers), 
            insertIntoDeepestElement(question_content, formattedAnswers);
          } else console.log(question_content), setTimeout((() => {
            const blanks_box = question_content.querySelectorAll(".blanks_box");
            if (blanks_box ? console.log(blanks_box) : console.log("元素未找到"), blanks_box) blanks_box.forEach(((div, idx) => {
              if (parsedAnswers[idx]) {
                const individualAnswer = document.createElement("div");
                individualAnswer.style.color = "blue", individualAnswer.classList.add("modified"), 
                Array.isArray(parsedAnswers[idx]) && parsedAnswers[idx].length > 1 ? individualAnswer.innerHTML = `第${idx + 1}问:<br>${parsedAnswers[idx].map((ans => `<code class="answer" onclick="copyText(this)">${ans}</code>`)).join(" ")}（只用填一个，多填不给分）` : individualAnswer.innerHTML = `第${idx + 1}问: <code class="answer" onclick="copyText(this)">${parsedAnswers[idx]}</code>`, 
                div.appendChild(individualAnswer);
              }
            })); else {
              try {
                parsedAnswers.forEach((answerSet => {
                  Array.isArray(answerSet) && answerSet.length > 1 ? formattedAnswers += answerSet.join("，") + "（只用填一个，多填不给分）\n" : formattedAnswers += answerSet + "\n";
                })), formattedAnswers = formattedAnswers.trim(), answerElement.innerHTML = `正确答案:<br>${formattedAnswers.replace(/\n/g, "<br>")}`;
              } catch (e) {
                console.error("Failed to parse rightAnswer:", subject.rightAnswer, e), answerElement.textContent = "正确答案: 格式错误";
              }
              question_content.appendChild(answerElement);
            }
          }), 200);
        } else settings.examMode ? insertIntoDeepestElement(question_content, subject.rightAnswer) : (isHtml ? answerElement.innerHTML = `${subject.rightAnswer}` : answerElement.textContent = `正确答案: ${subject.rightAnswer}`, 
        question_content.appendChild(answerElement), setTimeout((() => {
          const radio_contents = question_content.querySelectorAll(".radio_content"), answers = subject.rightAnswer.split(",");
          console.log(radio_contents), radio_contents.length > 0 && (console.log("开始答题"), 
          answers.forEach(((answer, index) => {
            let optionIndex = -1;
            if (optionIndex = "yes" === answer.toLowerCase() ? 0 : "no" === answer.toLowerCase() ? 1 : answer.toUpperCase().charCodeAt(0) - "A".charCodeAt(0), 
            optionIndex >= 0 && optionIndex < radio_contents.length) {
              const firstChild = radio_contents[optionIndex].firstElementChild;
              firstChild ? firstChild.classList.contains("is-checked") ? console.log(`选项 ${answer} 已经被选中了，跳过点击`) : setTimeout((() => {
                firstChild.click(), console.log("点击了", firstChild);
              }), 200 * index) : console.log(`选项 ${answer} 没有子元素`);
            } else console.log(`无效的答案：${answer}`);
          })));
        }), 500));
        if (subject.childrenList && subject.childrenList.length > 0) {
          const liElements = question_content.querySelectorAll("li");
          subject.childrenList.forEach(((child, i) => {
            console.log("遍历子题");
            const isHtml_ = /<[^>]*>/g.test(subject.rightAnswer);
            if (7 == child.subjectType) {
              let rawAnswer = child.rightAnswer.replace(/\|/g, ","), parsedAnswers = JSON.parse(rawAnswer), formattedAnswers = "";
              if (settings.examMode) {
                let rawAnswer = subject.rightAnswer.replace(/\|/g, ",");
                JSON.parse(rawAnswer).forEach(((answerSet, idx) => {
                  const answerToDisplay = Array.isArray(answerSet) && answerSet.length > 0 ? answerSet[0] : answerSet;
                  formattedAnswers += `${answerToDisplay} `;
                })), formattedAnswers = formattedAnswers.trim(), console.log(formattedAnswers), 
                insertIntoDeepestElement(liElements[i], formattedAnswers);
              } else {
                const blanks_box = liElements[i].querySelectorAll(".blanks_box");
                if (blanks_box) blanks_box.forEach(((div, idx) => {
                  if (parsedAnswers[idx]) {
                    const individualAnswer = document.createElement("div");
                    individualAnswer.style.color = "blue", individualAnswer.classList.add("modified"), 
                    Array.isArray(parsedAnswers[idx]) && parsedAnswers[idx].length > 1 ? individualAnswer.innerHTML = `第${idx + 1}问:<br>${parsedAnswers[idx].map((ans => `<code class="answer" onclick="copyText(this)">${ans}</code>`)).join(" ")}（只用填一个，多填不给分）` : individualAnswer.innerHTML = `第${idx + 1}问: <code class="answer" onclick="copyText(this)">${parsedAnswers[idx]}</code>`, 
                    div.appendChild(individualAnswer);
                  }
                })); else {
                  try {
                    parsedAnswers.forEach((answerSet => {
                      Array.isArray(answerSet) && answerSet.length > 1 ? formattedAnswers += answerSet.join("，") + "（只用填一个，多填不给分）\n" : formattedAnswers += answerSet + "\n";
                    })), formattedAnswers = formattedAnswers.trim(), answerElement.innerHTML = `正确答案:<br>${formattedAnswers.replace(/\n/g, "<br>")}`;
                  } catch (e) {
                    console.error("Failed to parse rightAnswer:", subject.rightAnswer, e), answerElement.textContent = "正确答案: 格式错误";
                  }
                  liElements[i].appendChild(answerElement);
                }
              }
            } else {
              const newElement = document.createElement("span");
              newElement.classList.add("modified"), settings.examMode ? insertIntoDeepestElement(question_content, subject.rightAnswer) : (isHtml_ ? newElement.innerHTML = `正确答案: <br> ${subject.rightAnswer}` : newElement.textContent = `正确答案: ${subject.rightAnswer}`, 
              liElements[index].appendChild(newElement));
            }
          }));
        }
      }
      var originalOpen, originalFetch;
      function initializeEditorSync() {
        if (document.querySelector(".ckeditor-container")) displayErrorNotification("请勿重复点击", [ "检测到页面中已存在替换后的输入框，已跳过执行解除限制操作" ]); else {
          var elements = document.querySelectorAll('[class*="cke_browser_webkit"]');
          0 != elements.length ? (elements.forEach((function(element, index) {
            if (!document.getElementById("editor-new-" + index)) {
              var editorContainer = document.createElement("div");
              editorContainer.classList.add("ckeditor-container"), editorContainer.id = "editor-new-" + index, 
              editorContainer.style.marginTop = "10px";
              var hintContainer = document.createElement("div");
              hintContainer.classList.add("editor-hint"), hintContainer.style.marginBottom = "10px", 
              hintContainer.textContent = "在下面输入的内容将同步至上方的输入框，下方的输入框已解除粘贴限制";
              var iframe = element.querySelector("iframe");
              if (iframe) {
                var iframeBody = iframe.contentWindow.document.body;
                element.parentNode.insertBefore(editorContainer, element.nextSibling), element.parentNode.insertBefore(hintContainer, editorContainer), 
                CKEDITOR.replace("editor-new-" + index, {
                  on: {
                    instanceReady: function() {
                      var newEditor = CKEDITOR.instances["editor-new-" + index];
                      newEditor.on("change", (function() {
                        iframeBody.innerHTML = newEditor.getData();
                      })), iframeBody.addEventListener("input", (function() {
                        newEditor.setData(iframeBody.innerHTML);
                      })), newEditor.setData(iframeBody.innerHTML);
                    }
                  }
                });
              }
            }
          })), displaySuccessNotification("解除粘贴限制成功", "现在可以直接将复制的内容粘贴到输入框中了")) : displayErrorNotification("未检测到输入框", [ "请在有粘贴限制的输入框的页面点击按钮" ]);
        }
      }
      if (XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send, originalOpen = XMLHttpRequest.prototype.open, 
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        const fullUrl = new URL(url, window.location.href);
        this.addEventListener("load", (async function() {
          try {
            if (this.responseType && "" !== this.responseType && "text" !== this.responseType) return void console.log("Response type is not text, skipping processing:", this.responseType);
            if (!this.responseText || this.responseText.trim().startsWith("<")) return void console.log("Response is not JSON format, skipping processing");
            const response = JSON.parse(this.responseText);
            if (response.data) {
              if (response.data.paperSubjectList && (cachedPaperSubjectList = response.data.paperSubjectList, 
              (originalJson = response) && originalJson.data && originalJson.data.hasOwnProperty("stuName") && delete originalJson.data.stuName, 
              checkRightAnswer(originalJson))) {
                localStorage.setItem("originalJsonCopy", JSON.stringify(originalJson));
                try {
                  const paperId = originalJson.data.id, response = await fetchOriginalJson(paperId, !1);
                  response && response.has_original_json ? console.log("Paper exists with original JSON") : (console.log("No paper found, uploading..."), 
                  uploadOriginalJson());
                } catch (error) {
                  console.error("Error checking originalJson:", error);
                }
              }
              if ("/jxxt/api/course/courseStudent/getStudentCourseChapters" === new URLSearchParams(fullUrl.search).get("service")) {
                const CourseChapters = JSON.parse(this.responseText);
                localStorage.setItem("CourseChapters", JSON.stringify(CourseChapters));
              }
            }
          } catch (e) {
            console.error("Error processing response:", e), e instanceof SyntaxError && e.message.includes("JSON") && (console.error("JSON解析错误，响应可能不是有效的JSON格式"), 
            console.log("Response text:", this.responseText.substring(0, 200) + "..."));
          }
        })), originalOpen.apply(this, arguments);
      }, originalFetch = window.fetch, window.fetch = async function(input, init) {
        try {
          console.log("Fetch Request Sent: ", input, init);
          const response = await originalFetch(input, init);
          return response.clone().text().then((text => {
            if (!text || text.trim().startsWith("<")) return void console.log("Fetch response is not JSON format, skipping processing");
            const data = JSON.parse(text);
            try {
              data.data?.paperSubjectList && (console.log("paperSubjectList:", data.data.paperSubjectList), 
              cachedPaperSubjectList = data.data.paperSubjectList);
              const url = input instanceof Request ? input.url : input;
              "/jxxt/api/course/courseStudent/getStudentCourseChapters" === new URLSearchParams(url).get("service") && localStorage.setItem("CourseChapters", JSON.stringify(data)), 
              data.data?.hasOwnProperty("stuName") && delete data.data.stuName, checkRightAnswer(data) && (localStorage.setItem("originalJsonCopy", JSON.stringify(data)), 
              fetchOriginalJson(data.data.id, !1).then((response => {
                response?.has_original_json ? console.log("试卷数据已存在") : (console.log("未找到试卷数据，开始上传..."), 
                uploadOriginalJson());
              })).catch((error => console.error("检查原始JSON出错:", error))));
            } catch (error) {
              console.error("处理响应数据时出错:", error);
            }
          })).catch((error => {
            console.error("解析响应文本时出错:", error);
          })), response;
        } catch (error) {
          throw console.error("Fetch请求出错:", error), error;
        }
      }, settings.examMode) {
        const scriptWindow = document.getElementById("scriptWindow");
        scriptWindow && ("none" === scriptWindow.style.display ? scriptWindow.style.display = "block" : scriptWindow.style.display = "none");
      }
      async function toggleModifiedElements() {
        const showAnswerButton = document.querySelector(".showAnswerButton"), responseContainers = document.querySelectorAll(".response-container");
        if (showAnswer) return showAnswerButton.innerHTML = "显示答案", showAnswer = !1, void document.querySelectorAll(".modified").forEach((element => {
          element.style.display = "none";
        }));
        {
          const elements = document.querySelectorAll(".modified");
          return elements && elements.forEach((element => {
            element.style.display = "";
          })), responseContainers && responseContainers.forEach((responseContainer => {
            "" !== responseContainer.innerHTML && (responseContainer.style.display = "block");
          })), showAnswerButton.innerHTML = "隐藏答案", showAnswer = !0, await displayRightAnswers(), 
          console.log("token", settings.token), void (showAnswer || (showAnswerButton.innerHTML = "显示答案"));
        }
      }
      window.addEventListener("keydown", (function(event) {
        if (120 === event.keyCode) {
          const scriptWindow = document.getElementById("scriptWindow");
          scriptWindow && ("none" === scriptWindow.style.display ? scriptWindow.style.display = "block" : scriptWindow.style.display = "none");
        }
      })), window.addEventListener("keydown", (function(event) {
        113 === event.keyCode && toggleModifiedElements();
      })), window.addEventListener("popstate", handleRouteChange);
      const originalPushState = history.pushState;
      function handleRouteChange() {
        if (listenRouteWarpper.listenRoute) {
          if (isPlaying) {
            stopAutoPlay();
            const autoplayButton = document.getElementById("autoplay-button-id");
            autoplayButton && (autoplayButton.innerHTML = "自动播放"), isPlaying = !1, stopAnimation();
          }
          showAnswer && toggleModifiedElements();
        }
      }
      history.pushState = function() {
        originalPushState.apply(this, arguments), handleRouteChange();
      };
    }();
  })();
})();