var NovelPage = function (t) {
  var e = {};

  function r(n) {
    if (e[n]) return e[n].exports;
    var i = e[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return t[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports
  }
  return r.m = t, r.c = e, r.d = function (t, e, n) {
    r.o(t, e) || Object.defineProperty(t, e, {
      configurable: !1,
      enumerable: !0,
      get: n
    })
  }, r.r = function (t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, r.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return r.d(e, "a", e), e
  }, r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, r.p = "", r(r.s = 6)
}([function (t, e, r) {
  "use strict";
  e.__esModule = !0;
  var n = JSON.parse("[[1,3,10],[1,5,16],[1,5,19],[1,9,29],[1,11,6],[1,11,16],[1,19,3],[1,21,20],[1,27,27],[2,5,15],[2,5,21],[2,7,7],[2,7,9],[2,7,25],[2,9,15],[2,15,17],[2,15,25],[2,21,9],[3,1,14],[3,3,26],[3,3,28],[3,3,29],[3,5,20],[3,5,22],[3,5,25],[3,7,29],[3,13,7],[3,23,25],[3,25,24],[3,27,11],[4,3,17],[4,3,27],[4,5,15],[5,3,21],[5,7,22],[5,9,7],[5,9,28],[5,9,31],[5,13,6],[5,15,17],[5,17,13],[5,21,12],[5,27,8],[5,27,21],[5,27,25],[5,27,28],[6,1,11],[6,3,17],[6,17,9],[6,21,7],[6,21,13],[7,1,9],[7,1,18],[7,1,25],[7,13,25],[7,17,21],[7,25,12],[7,25,20],[8,7,23],[8,9,23],[9,5,14],[9,5,25],[9,11,19],[9,21,16],[10,9,21],[10,9,25],[11,7,12],[11,7,16],[11,17,13],[11,21,13],[12,9,23],[13,3,17],[13,3,27],[13,5,19],[13,17,15],[14,1,15],[14,13,15],[15,1,29],[17,15,20],[17,15,23],[17,15,26]]"),
    i = [function (t, e, r, n) {
      return t ^= t << e, t ^= t >>> r, t ^= t << n
    }, function (t, e, r, n) {
      return t ^= t << n, t ^= t >>> r, t ^= t << e
    }, function (t, e, r, n) {
      return t ^= t >>> e, t ^= t << r, t ^= t >>> n
    }, function (t, e, r, n) {
      return t ^= t >>> n, t ^= t << r, t ^= t >>> e
    }, function (t, e, r, n) {
      return t ^= t << e, t ^= t << n, t ^= t >>> r
    }, function (t, e, r, n) {
      return t ^= t >>> e, t ^= t >>> n, t ^= t << r
    }],
    o = 2463534242,
    a = function () {
      function t() {
        this.v_kgh = 0, this.v_jgh = o, this.v_lgh = n[74][this.v_kgh++], this.v_mgh = n[74][this.v_kgh++], this.v_ngh = n[74][this.v_kgh++], this.v_ogh = i[0]
      }
      return t.prototype.b9es = function (t, e) {
        this.v_jgh = o;
        var r = n[t],
          a = 0;
        this.v_lgh = r[a++], this.v_mgh = r[a++], this.v_ngh = r[a], this.v_ogh = i[e]
      }, t.prototype.B0o = function (t) {
        var e = t >>> 0;
        this.v_jgh = e || o
      }, t.prototype.b4K = function (t) {
        if (t <= 1) return 0;
        var e, r, n = 4294967295 - t,
          i = this.v_jgh;
        do {
          e = (r = (i = this.v_ogh(i, this.v_lgh, this.v_mgh, this.v_ngh) >>> 0) - 1) % t
        } while (n < r - e);
        return this.v_jgh = i, e
      }, t.b6o = n.length, t.b6b = i.length, t.b4v = n.length * i.length, t
    }();
  e.default = a
}, function (t, e, r) {
  "use strict";
  var n = r(0);

  function i(t, e) {
    for (var r = [], n = 0; n < e; n++) {
      var i = t(n + 1);
      r[n] = r[i], r[i] = n
    }
    return r
  }

  function o(t, e) {
    return e < 4 ? t(e + 1) : t(e - 1) + 1
  }

  function a(t, e, r) {
    if (r <= 0) return 0;
    var n = t(r);
    return n < e ? n : n + 1
  }

  function h(t, e, r, n, i, o, a) {
    for (var h = void 0, s = void 0, u = void 0, f = o, c = a, g = n, l = i, d = 0, v = 0; f + c > 0;) {
      if ((h = t(f + c)) < f) {
        if (h < g) {
          for (s = v; s > 0 && !(d >= e[s + -1]); s--);
          for (u = v + c; u < a && !(d >= e[u]); u++);
          r[d] = t(u - s) + s, d++, g--
        } else {
          for (s = v; s > 0 && !(d + f <= e[s + -1]); s--);
          for (u = v + c; u < a && !(d + f <= e[u]); u++);
          r[d + f + -1] = t(u - s) + s
        }
        f--
      } else {
        if (h - f < l) {
          for (s = d; s > 0 && !(v >= r[s + -1]); s--);
          for (u = d + f; u < o && !(v >= r[u]); u++);
          e[v] = t(u - s) + s, v++, l--
        } else {
          for (s = d; s > 0 && !(v + c <= r[s + -1]); s--);
          for (u = d + f; u < o && !(v + c <= r[u]); u++);
          e[v + c + -1] = t(u - s) + s
        }
        c--
      }
    }
  }
  e.__esModule = !0, e.default = function (t, e, r, s) {
    var u = new n.default,
      f = e ^ r ^ s,
      c = Math.floor(t / 65536),
      g = Math.floor(e / 65536),
      l = Math.floor(r / 65536),
      d = Math.floor(s / 65536),
      v = n.default.b6o,
      p = n.default.b6b,
      b = g ^ l ^ d,
      _ = c ^ d,
      y = t ^ e,
      m = t ^ r,
      k = t ^ s,
      w = (b >>>= 16) % p,
      B = (b - w) / p % v,
      M = u.b4K.bind(u);
    u.b9es(B, w), u.B0o(f);
    var I = u.b4K(65536) | u.b4K(65536) << 16,
      S = u.b4K(512),
      x = g >>> 16,
      C = l >>> 16;
    y = (y ^ I) >>> 0, m = (m ^ I) >>> 0, k = (k ^ I) >>> 0;
    var W = (_ = _ >>> 16 ^ S) % p,
      P = (_ - W) / p % v;
    u.b9es(P, W), u.B0o(y);
    var j = i(M, x * C);
    u.B0o(m);
    var K = o(M, x),
      z = o(M, C),
      N = a(M, K, x),
      A = a(M, z, C);
    u.B0o(k);
    var $ = [],
      L = [];
    h(M, $, L, K, z, x, C);
    var H = i(M, x),
      O = i(M, C),
      U = [],
      X = [];
    return h(M, X, U, N, A, x, C),
      function (t, e, r, n, i, o, a, h, s, u, f, c, g) {
        for (var l = [], d = t + 1, v = e + 1, p = d << 1, b = v << 1, _ = 0; _ < t; _++)
          for (var y = 0; y < e; y++) {
            var m = r[_ + y * t],
              k = m % t,
              w = (m - k) / t,
              B = _ < f[y] ? _ : _ + d,
              M = y < u[_] ? y : y + v,
              I = k < a[w] ? k : k + d,
              S = w < o[k] ? w : w + v;
            l.push(S * p + B), l.push(I * b + M)
          }
        l.push(s * p + c), l.push(h * b + g);
        for (var _ = 0; _ < t; _++) {
          var k = n[_],
            B = _ < c ? _ : _ + d,
            I = k < h ? k : k + d;
          l.push(o[k] * p + B), l.push(I * b + u[_])
        }
        for (var y = 0; y < e; y++) {
          var w = i[y],
            M = y < g ? y : y + v,
            S = w < s ? w : w + v;
          l.push(S * p + f[y]), l.push(a[w] * b + M)
        }
        return l
      }(x, C, j, H, O, U, X, N, A, L, $, K, z)
  }
}, function (t, e, r) {
  "use strict";
  var n = r(1),
    i = r(0);
  e.__esModule = !0, e.default = function (t, e, r) {
    var o = t.b8A,
      a = t.b6V,
      h = t.B0J,
      s = t.B0K,
      u = t.B0n,
      f = t.B0A,
      c = i.default.b6o,
      g = i.default.b6b,
      l = Math.floor(e / o),
      d = Math.floor(r / a),
      v = e % o,
      p = r % a,
      b = l + 1 << 1,
      _ = d + 1 << 1,
      y = (l + 1) * o - v,
      m = (d + 1) * a - p,
      k = new i.default,
      w = f ^ l ^ d,
      B = w % g,
      M = (w - B) / g % c,
      I = [];
    k.b9es(M, B), k.B0o(h ^ s ^ u);
    var S = k.b4K(65536) + 65536 * k.b4K(65536) + 4294967296 * k.b4K(512),
      x = 4294967296 * l + h,
      C = 4294967296 * d + s,
      W = 4294967296 * f + u,
      P = n.default(S, x, C, W),
      j = function (t, e, r, n) {
        if (0 !== r && 0 !== n)
          for (; t < e;) {
            var i = P[t++],
              h = P[t++],
              s = i % b,
              u = h % _,
              f = (h - u) / _,
              c = (i - s) / b;
            I.push({
              srcX: s * o - (s > l ? y : 0),
              srcY: u * a - (u > d ? m : 0),
              destX: f * o - (f > l ? y : 0),
              destY: c * a - (c > d ? m : 0),
              width: r,
              height: n
            })
          }
      },
      K = 0,
      z = l * d * 2;
    return j(K, z, o, a), j(K = z, z += 2, v, p), j(K = z, z += 2 * l, o, p), j(K = z, z += 2 * d, v, a), I
  }
}, function (t, e, r) {
  "use strict";
  var n = r(2),
    i = function () {
      function t(t, e, r) {
        this.sourceImage = t, this.page = e, this.size = r
      }
      return t.prototype.decode = function () {
        const t = this;
        return new Promise(e => {
          const r = new Image;
          r.onload = function () {
            const n = t.createScript(t.page, r.width, r.height);
            let i = document.createElement("canvas");
            i.width = r.width, i.height = r.height;
            let o = i.getContext("2d");
            if (t.executeDecodeByScript(r, n, o), t.size && (r.width !== t.size.Width || r.height !== t.size.Height)) {
              const e = i;
              (i = document.createElement("canvas")).width = t.size.Width, i.height = t.size.Height, (o = i.getContext("2d")).drawImage(e, 0, 0, t.size.Width, t.size.Height, 0, 0, t.size.Width, t.size.Height)
            }
            e(i.toDataURL("image/jpeg", 1))
          }, r.src = t.sourceImage
        })
      }, t.prototype.createScript = function (t, e, r) {
        return n.default(t, e, r)
      }, t.prototype.executeDecodeByScript = function (t, e, r) {
        e.forEach(function (e) {
          r.drawImage(t, e.destX, e.destY, e.width, e.height, e.srcX, e.srcY, e.width, e.height)
        })
      }, t
    }();
  e.__esModule = !0, e.default = i
}, function (t, e, r) {
  "use strict";
  e.__esModule = !0, e.default = function (t, e, r, n, a) {
    var h = {
        B0G: t,
        url: t + `/${a}.jpeg`,
        B0H: ".jpeg",
        fileName: a.toString()
      },
      s = {
        b9W: function (t, e, r) {
          var n = [];
          return o(n, t), o(n, e), o(n, r), n
        }(e, r, n),
        configuration: {
          "file-name-version": "1.0"
        }
      };
    return "string" == typeof s.configuration["file-name-version"] ? h.B0G + "/" + function (t) {
      var e = parseInt(t, 10);
      if (!isNaN(e) && e >= 0 && e <= 0x1000000000000000) {
        var r = e.toString(16);
        return r.length.toString(16) + r
      }
      return "0" + t
    }(h.fileName) + function (t, e) {
      var r = e.B0G + "/",
        n = r.length + e.fileName.length,
        o = 1 + n << 1,
        a = new Array(o),
        h = String.prototype.charCodeAt.bind(r + e.fileName);
      a[0] = 0, a[1] = 59;
      for (var s = 2, u = 0; u < n; u++) {
        var f = h(u);
        a[s++] = f >>> 8, a[s++] = f % 256
      }
      for (var c = 3, g = (e.fileName.length << 1) + o + o; g < 256; c++) g += o;
      for (var l = 1670739, d = 1282576, v = 2237221, p = 1 + r.length << 1, b = 0, _ = 0; _ < c; _++, p = 0)
        for (; p < o;) {
          var y = 435 * (v ^= a[p++] ^ t.b9W[b++]),
            m = 435 * d + ((7 & v) << 18) + (y >>> 22),
            k = 435 * l + ((3 & d) << 19) + ((4194296 & v) >>> 3) + (m >>> 21);
          v = 4194303 & y, d = 2097151 & m, l = 2097151 & k, b >= t.b9W.length && (b = 0)
        }
      for (var w = new Array(16), p = 0; p < w.length; p += 2) switch (p) {
        case 0:
          i(w, p, l >>> 13 ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 2:
          i(w, p, l >>> 5 & 255 ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 4:
          i(w, p, ((31 & l) << 3 | d >>> 18) ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 6:
          i(w, p, d >>> 10 & 255 ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 8:
          i(w, p, d >>> 2 & 255 ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 10:
          i(w, p, ((3 & d) << 6 | v >>> 16) ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 12:
          i(w, p, v >>> 8 & 255 ^ t.b9W[Math.floor(p / 2)]);
          break;
        case 14:
          i(w, p, 255 & v ^ t.b9W[Math.floor(p / 2)])
      }
      return String.fromCharCode.apply(String, w)
    }(s, h) + h.B0H : h.url
  };
  var n = function (t) {
      return (t < 10 ? 48 : 87) + t
    },
    i = function (t, e, r) {
      t[e] = n(r >>> 4), t[e + 1] = n(15 & r)
    };

  function o(t, e) {
    for (var r = 0; r < e.length; r++) t[r] ^= e[r]
  }
}, function (t, e, r) {
  "use strict";
  var n = r(0),
    i = r(4),
    o = r(3),
    a = function () {
      function t(t, e, r, i, o, a, u, f, c) {
        this.index = t, this.pageId = e, this.config = r, this.axios = i, this.key1 = o, this.key2 = a, this.key3 = u, this.baseUrl = f, this.pageIndex = c, this.pageConfig = this.config.FileLinkInfo.PageLinkInfoList[c].Page;
        for (var g = this.pageConfig.NS, l = this.pageConfig.PS, d = this.pageConfig.RS, v = 47, p = 0; p < this.pageId.length; p++) v += this.pageId.charCodeAt(p);
        var b = this.pageConfig.No.toString(10);
        for (p = 0; p < b.length; p++) v += b.charCodeAt(p);
        var _ = 255 & (v += function (t, e, r) {
          return h(t) + h(e) + h(r)
        }(this.key1, this.key2, this.key3));
        _ |= _ << 8, _ |= _ << 16, this.B0A = v % n.default.b4v, this.B0J = (_ ^ s(o) ^ g) >>> 0, this.B0K = (_ ^ s(a) ^ l) >>> 0, this.B0n = (_ ^ s(u) ^ d) >>> 0, this.b8A = this.pageConfig.BlockWidth, this.b6V = this.pageConfig.BlockHeight
      }
      return t.prototype.getImage = async function (t) {
        let e = i.default(this.pageId, this.key1, this.key2, this.key3, this.pageIndex);
        e = -1 !== e.indexOf("shared") ? e.slice(3) : "normal_default/" + e;
        const r = `${this.baseUrl}${e}?hti=${t.hti}&cfg=1&bid=${t.bid}&uuid=${t.uuid}&Policy=${t.Policy}&Signature=${t.Signature}&Key-Pair-Id=${t["Key-Pair-Id"]}`,
          n = "data:image/jpeg;base64," + function (t) {
            for (var e = "", r = new Uint8Array(t), n = r.byteLength, i = 0; i < n; i++) e += String.fromCharCode(r[i]);
            return window.btoa(e)
          }(await axios.get(r, {
            responseType: "arraybuffer"
          }).then(t => t.data));
        return new o.default(n, this, this.pageConfig.Size).decode()
      }, t
    }();

  function h(t, e) {
    return void 0 === e && (e = 0), t.reduce(function (t, e) {
      return t + e
    }, e)
  }

  function s(t) {
    var e = 0,
      r = -4 & t.length;
    r > 32 && (r = 32);
    for (var n = 0; n < r;) e ^= t[n++] << 24, e ^= t[n++] << 16, e ^= t[n++] << 8, e ^= t[n++] << 0;
    return e >>> 0
  }
  e.__esModule = !0, e.default = a
}, function (t, e, r) {
  const n = r(5);
  e.__esModule = !0, t.exports = {
    init: function (t, e, r, i, o, a, h, s) {
      return r.FileLinkInfo.PageLinkInfoList.map((u, f) => new n.default(t, e, r, i, o, a, h, s, f))
    }
  }
}]);