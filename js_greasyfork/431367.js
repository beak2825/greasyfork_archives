var ConfigDecoder = function (e) {
  var t = {};

  function r(a) {
    if (t[a]) return t[a].exports;
    var n = t[a] = {
      i: a,
      l: !1,
      exports: {}
    };
    return e[a].call(n.exports, n, n.exports, r), n.l = !0, n.exports
  }
  return r.m = e, r.c = t, r.d = function (e, t, a) {
    r.o(e, t) || Object.defineProperty(e, t, {
      configurable: !1,
      enumerable: !0,
      get: a
    })
  }, r.r = function (e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, r.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    };
    return r.d(t, "a", t), t
  }, r.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, r.p = "", r(r.s = 17)
}([function (e, t, r) {
  "use strict";
  this && this.__awaiter, this && this.__generator;
  var a = this && this.__spreadArray || function (e, t) {
    for (var r = 0, a = t.length, n = e.length; r < a; r++, n++) e[n] = t[r];
    return e
  };
  t.__esModule = !0, t.readJsonFile = t.createTA8jResult = t.isEqual = t.arraySum = t.v_smi = t.v_qmi = t.v_ifi = void 0;
  var n = r(3),
    u = r(11);
  t.v_ifi = function (e) {
    for (;;) {
      var t = e();
      if (void 0 !== t) return t
    }
  }, t.v_qmi = function (e, t, r) {
    return n.default(a(a(a([], e), t), r))
  }, t.v_smi = function (e, t, r, n) {
    return u.default(e, a(a(a([], t), r), n))
  };
  t.arraySum = function (e) {
    return e.reduce(function (e, t) {
      return void 0 === e && (e = 0), e + t
    })
  }, t.createTA8jResult = function (e) {
    return [new Uint8Array(e[0]), e[1], e[2].slice(0, e[2].length), e[3].slice(0, e[3].length), e[4].slice(0, e[4].length)]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0, t.default = function (e, t, r) {
    var a = e[t];
    e[t] = e[r], e[r] = a
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0, t.step = void 0;
  var a = r(1);

  function n(e, t, r, n, u) {
    return t = (t + n[e = (e + 1) % 256]) % 256, a.default(n, e, t), u[r] ^= n[(n[e] + n[t]) % 256], [e, t]
  }
  t.default = function (e, t, r) {
    for (var a, u = e[0], f = e[1], i = e[2], o = e[3], s = e[4], c = 0, d = 0; r >= 0; r -= 2) c = (a = n(c, d, r, t, u))[0], d = a[1];
    return [u, f, i, o, s]
  }, t.step = n
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(1);
  t.default = function (e) {
    for (var t = new Array(256).fill(0).map(function (e, t) {
        return t
      }), r = "string" == typeof e ? e.charCodeAt.bind(e) : function (t) {
        return e[t]
      }, n = 0, u = 0; u < 256; u++) {
      var f = u % e.length;
      n = (n + t[u] + r(f)) % 256, a.default(t, u, n)
    }
    return t
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(0),
    n = r(2);
  t.default = function (e, t) {
    for (var r, u = t[0], f = t[1], i = t[2], o = t[3], s = t[4], c = a.v_qmi(s, o, e), d = 0, l = 0, v = 0; d < f; d++) l = (r = n.step(l, v, d, c, u))[0], v = r[1];
    return [u, f, i, o, s]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0, t.default = function (e) {
    for (var t = [], r = 0; r < e.length;) {
      var a = e.charCodeAt(r++);
      a < 128 ? t.push(a) : (a < 2048 ? t.push(192 | a >> 6) : (a < 55296 || a >= 57344 || r === e.length ? t.push(224 | a >> 12) : (a = (1023 & a) << 10, a |= 1023 & e.charCodeAt(r++), a += 65536, t.push(240 | a >> 18), t.push(128 | a >> 12 & 63)), t.push(128 | a >> 6 & 63)), t.push(128 | 63 & a))
    }
    return t
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(0);
  t.default = function (e, t) {
    for (var r = t[0], n = t[1], u = t[2], f = t[3], i = t[4], o = a.v_qmi(f, e, i), s = 0, c = 0; s < n; c %= 256) r[s++] ^= o[c++];
    return [r, n, u, f, i]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(0);
  t.default = function (e, t) {
    var r = t[0],
      n = t[1],
      u = t[2],
      f = t[3],
      i = t[4];
    return i = a.v_smi(i, f, u, e), f = a.v_smi(f, u, e, i), [r, n, u = a.v_smi(u, e, i, f), f, i]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  for (var a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"], n = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47], u = [], f = [], i = [], o = [], s = [], c = [], d = [], l = [], v = 0; v < 64; v++) {
    var h = n[v];
    u[v] = a[v], f[h] = v, i[h] = v << 2, o[h] = v << 4 & 255, s[h] = v << 6 & 255, c[h] = v >> 2, d[h] = v >> 4, l[h] = !0
  }
  var _ = [f, i, o, s, c, d, l];
  t.default = _
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(8);
  t.default = function (e, t, r) {
    var n = t + 128,
      u = r - n;
    if (3 & u) throw new Error;
    for (var f = new Array(32), i = new Array(32), o = new Array(32), s = t, c = f, d = 0; s < n;) {
      var l = e.charCodeAt(s++),
        v = e.charCodeAt(s++),
        h = e.charCodeAt(s++),
        _ = e.charCodeAt(s++);
      if (!(a.default[6][l] && a.default[6][v] && a.default[6][h] && a.default[6][_])) throw new Error;
      c[d++] = a.default[1][l] | a.default[5][v], s === t + 88 && (c = o, d = 0), c[d++] = a.default[2][v] | a.default[4][h], s === t + 44 && (c = i, d = 0), c[d++] = a.default[3][h] | a.default[0][_]
    }
    if (0 === u) return [new Uint8Array(0), 0, f, i, o];
    var p = 3 * u >> 2;
    61 === e.charCodeAt(r - 2) ? p -= 2 : 61 === e.charCodeAt(r - 1) && (p -= 1);
    for (var b = new Uint8Array(p), w = n, A = 0; w < r - 4;) {
      var k = e.charCodeAt(w++),
        y = e.charCodeAt(w++),
        M = e.charCodeAt(w++),
        m = e.charCodeAt(w++);
      if (!(a.default[6][k] && a.default[6][y] && a.default[6][M] && a.default[6][m])) throw new Error;
      b[A++] = a.default[1][k] | a.default[5][y], b[A++] = a.default[2][y] | a.default[4][M], b[A++] = a.default[3][M] | a.default[0][m]
    }
    var C = e.charCodeAt(w++),
      g = e.charCodeAt(w++),
      O = e.charCodeAt(w++),
      E = e.charCodeAt(w++);
    if (!a.default[6][C] || !a.default[6][g]) throw new Error;
    if (b[A++] = a.default[1][C] | a.default[5][g], a.default[6][O]) {
      if (b[A++] = a.default[2][g] | a.default[4][O], a.default[6][E]) b[A++] = a.default[3][O] | a.default[0][E];
      else if (61 !== E) throw new Error
    } else if (61 !== O || 61 !== E) throw new Error;
    return [b, p, f, i, o]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(0),
    n = r(2);
  t.default = function (e, t) {
    var r = t[0],
      u = t[1],
      f = t[2],
      i = t[3],
      o = t[4],
      s = (1 | u) - 2,
      c = a.v_qmi(e, f, i);
    return n.default([r, u, f, i, o], c, s)
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(1),
    n = r(3);
  t.default = function (e, t) {
    for (var r = [], u = n.default(t), f = 0, i = 0, o = 0; f < e.length; f++) {
      o = (o + u[i = (i + 1) % 256]) % 256, a.default(u, i, o);
      var s = (u[i] + u[o]) % 256;
      r.push(e[f] ^ u[s])
    }
    return r
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(0),
    n = r(2);
  t.default = function (e, t) {
    var r = t[0],
      u = t[1],
      f = t[2],
      i = t[3],
      o = t[4],
      s = u - 1 & -2,
      c = a.v_qmi(o, e, f);
    return n.default([r, u, f, i, o], c, s)
  }
}, function (e, t, r) {
  "use strict";

  function a(e) {
    for (var t = new Array(64), r = 0, a = 0; r < 32; r++) t[a++] = n(e[r] >>> 4), t[a++] = n(15 & e[r]);
    return String.fromCharCode.apply(String, t)
  }

  function n(e) {
    return (e < 10 ? 48 : 87) + e
  }
  t.__esModule = !0, t.keyToStr = void 0, t.default = function (e) {
    for (var t = e[0], r = e[1], n = e[2], f = e[3], i = e[4], o = [], s = 0; s < r;) {
      var c = t[s++];
      if (c < 128) o.push(c);
      else {
        var d = t[s];
        if (s >= r || c < 194 || c > 244 || !u(d) || 224 === c && d < 160 || 237 === c && d >= 160 || 240 === c && d < 144 || 244 === c && d >= 144) o.push(65533);
        else if (s++, c < 224) o.push(63 & d | (31 & c) << 6);
        else {
          var l = t[s];
          if (s >= r || !u(l)) o.push(65533);
          else if (s++, c < 240) o.push(63 & l | (63 & d) << 6 | (15 & c) << 12);
          else {
            var v = t[s];
            if (s >= r || !u(v)) o.push(65533);
            else {
              s++;
              var h = (48 & l) >> 4 | (63 & d) << 2 | (7 & c) << 8,
                _ = 63 & v | (15 & l) << 6;
              o.push(55232 + h), o.push(56320 + _)
            }
          }
        }
      }
    }
    return [o.map(function (e) {
      return String.fromCharCode(e)
    }).join(""), a(n), a(f), a(i), n, f, i]
  }, t.keyToStr = a;
  var u = function (e) {
    return 128 == (192 & e)
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(1);

  function n(e, t, r) {
    for (var a = 0; a < 32; a++) e = e + r[a] & 255, t ^= r[a];
    return [e, t]
  }

  function u(e, t, r) {
    for (var n = e; t > e; t--, n--) a.default(r, t, n)
  }
  t.default = function (e, t) {
    var r, a, i = t[0],
      o = t[1],
      s = t[2],
      c = t[3],
      d = t[4],
      l = [],
      v = 0,
      h = [],
      _ = [],
      p = [];
    switch (e) {
      case 3:
        l = s, v = 32, 32, h = c, _ = d, p = null;
        break;
      case 2:
        l = c, v = 32, 32, h = s, _ = d, p = null;
        break;
      case 1:
        l = d, v = 32, 32, h = s, _ = c, p = null;
        break;
      case 0:
        l = i, v = o, 65536, h = s, _ = c, p = d
    }
    var b = n(0, 0, h),
      w = b[0],
      A = b[1];
    w = (r = n(w, A, _))[0], A = r[1], p && (w = (a = n(w, A, p))[0], A = a[1]);
    for (var k = !f(w, 2), y = !f(w, 4), M = !f(w, 8), m = A >>> 5, C = 8 - m, g = 0, O = [], E = g + 32, S = void 0, j = void 0, x = void 0, q = void 0, T = void 0, P = void 0, U = void 0, J = void 0; g < v;) {
      for ((S = (E = g + 32) > v) ? j = (E = v) - g : j = 32, P = w, U = A, q = 0, T = g; q < j;) x = l[T++], k && (x = (85 & x) << 1 | x >>> 1 & 85), y && (x = (51 & x) << 2 | x >>> 2 & 51), M && (x = (15 & x) << 4 | x >>> 4 & 15), O[q++] = x, P = P + x & 255, U ^= x;
      for (var K = 0; K < j; K++)
        for (var R = 1; R <= 6; R++) {
          var D = Math.pow(2, R);
          if (!f(K, D - 1)) break;
          f(P, D) || u(K - Math.pow(2, R - 1), K, O)
        }
      if (J = U >>> 3, S ? J %= j : J &= 31, 0 === m)
        for (R = g, K = j - J; R < E;) K === j && (K = 0), l[R++] = O[K++];
      else
        for (R = g, K = j - J - 1; R < E;) x = O[K] << C, ++K === j && (K = 0), x |= O[K] >>> m, l[R++] = 255 & x;
      g = E
    }
    return [i, o, s, c, d]
  };
  var f = function (e, t) {
    return (e & t) === t
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0, t.default = function (e) {
    for (var t, r, a = e[0], n = e[1], u = e[2], f = e[3], i = e[4], o = Math.min(32, n), s = 0; s < o; s++) {
      var c = a[s] ^ u[s] ^ f[s] ^ i[s];
      switch (12 & c) {
        case 0:
          t = u[s];
          break;
        case 4:
          t = f[s];
          break;
        case 8:
          t = i[s];
          break;
        case 12:
          t = a[s]
      }
      switch (3 & c) {
        case 0:
          r = u[s], u[s] = t;
          break;
        case 1:
          r = f[s], f[s] = t;
          break;
        case 2:
          r = i[s], i[s] = t;
          break;
        case 3:
          r = a[s], a[s] = t
      }
      switch (12 & c) {
        case 0:
          u[s] = r;
          break;
        case 4:
          f[s] = r;
          break;
        case 8:
          i[s] = r;
          break;
        case 12:
          a[s] = r
      }
      switch (192 & c) {
        case 0:
          t = u[s];
          break;
        case 64:
          t = f[s];
          break;
        case 128:
          t = i[s];
          break;
        case 192:
          t = a[s]
      }
      switch (48 & c) {
        case 0:
          r = u[s], u[s] = t;
          break;
        case 16:
          r = f[s], f[s] = t;
          break;
        case 32:
          r = i[s], i[s] = t;
          break;
        case 48:
          r = a[s], a[s] = t
      }
      switch (192 & c) {
        case 0:
          u[s] = r;
          break;
        case 64:
          f[s] = r;
          break;
        case 128:
          i[s] = r;
          break;
        case 192:
          a[s] = r
      }
    }
    return [a, n, u, f, i]
  }
}, function (e, t, r) {
  "use strict";
  t.__esModule = !0;
  var a = r(15),
    n = r(14),
    u = r(13),
    f = r(12),
    i = r(10),
    o = r(9),
    s = r(7),
    c = r(6),
    d = r(5),
    l = r(4),
    v = '"data":"',
    h = function () {
      function e(e, t) {
        if (void 0 === t && (t = "configuration_pack.json"), this.content = e, this.dataOffset = e.indexOf(v) + v.length, this.dataEndOffset = e.indexOf('"', this.dataOffset), this.dataEndOffset - this.dataOffset < 128) throw new Error;
        this.filenameKey = d.default(t)
      }
      return e.prototype.decode = function () {
        var e = this.createScript(this.filenameKey).reduce(function (e, t) {
            return t(e)
          }, o.default(this.content, this.dataOffset, this.dataEndOffset)),
          t = u.default(e);
        return t[0] = JSON.parse(t[0]), t
      }, e.prototype.createScript = function (e) {
        return [n.default.bind(null, 0), c.default.bind(null, e), i.default.bind(null, e), f.default.bind(null, e), a.default, s.default.bind(null, e), n.default.bind(null, 1), n.default.bind(null, 2), n.default.bind(null, 3), l.default.bind(null, e)]
      }, e
    }();
  t.default = h
}, function (e, t, r) {
  const a = r(16);
  t.__esModule = !0, e.exports = {
    decode: function (e) {
      return new a.default(e, "configuration_pack.json").decode()
    }
  }
}]);