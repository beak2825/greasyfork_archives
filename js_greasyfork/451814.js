var PublusPage;
(() => {
  var t = {
      2: (t, e, r) => {
        "use strict";
        var i = r(791),
          n = function () {
            function t(t, e, r) {
              this.sourceImage = t, this.page = e, this.size = r
            }
            return t.prototype.decode = function () {
              const t = this;
              return new Promise((e => {
                const r = new Image;
                r.onload = function () {
                  const i = t.createScript(t.page, r.width, r.height);
                  let n = document.createElement("canvas");
                  n.width = r.width, n.height = r.height;
                  let o = n.getContext("2d");
                  if (t.executeDecodeByScript(r, i, o), t.size && (r.width !== t.size.Width || r.height !== t.size.Height)) {
                    const e = n;
                    n = document.createElement("canvas"), n.width = t.size.Width, n.height = t.size.Height, o = n.getContext("2d"), o.drawImage(e, 0, 0, t.size.Width, t.size.Height, 0, 0, t.size.Width, t.size.Height)
                  }
                  e(n.toDataURL("image/jpeg", 1))
                }, r.src = t.sourceImage
              }))
            }, t.prototype.createScript = function (t, e, r) {
              return i.default(t, e, r)
            }, t.prototype.executeDecodeByScript = function (t, e, r) {
              e.forEach((function (e) {
                r.drawImage(t, e.destX, e.destY, e.width, e.height, e.srcX, e.srcY, e.width, e.height)
              }))
            }, t
          }();
        e.__esModule = !0, e.default = n
      },
      546: (t, e, r) => {
        "use strict";
        var i = r(733),
          n = r(188),
          o = r(2),
          a = function () {
            function t(t, e, r, n, o, a, u, f) {
              this.index = t, this.pageId = e, this.config = r, this.axios = n, this.key1 = o, this.key2 = a, this.key3 = u, this.baseUrl = f, this.pageConfig = this.config.FileLinkInfo.PageLinkInfoList[0].Page;
              for (var c = this.pageConfig.NS, g = this.pageConfig.PS, l = this.pageConfig.RS, d = 47, v = 0; v < this.pageId.length; v++) d += this.pageId.charCodeAt(v);
              var p = this.pageConfig.No.toString(10);
              for (v = 0; v < p.length; v++) d += p.charCodeAt(v);
              d += function (t, e, r) {
                return h(t) + h(e) + h(r)
              }(this.key1, this.key2, this.key3);
              var b = 255 & d;
              b |= b << 8, b |= b << 16, this.B0A = d % i.default.b4v, this.B0J = (b ^ s(o) ^ c) >>> 0, this.B0K = (b ^ s(a) ^ g) >>> 0, this.B0n = (b ^ s(u) ^ l) >>> 0, this.b8A = this.pageConfig.BlockWidth, this.b6V = this.pageConfig.BlockHeight
            }
            return t.prototype.getImage = async function (t) {
              const e = n.default(this.pageId, this.key1, this.key2, this.key3),
                r = `${this.baseUrl}${e}` + (t ? `?hti=${t.hti}&cfg=1&bid=${t.bid}&uuid=${t.uuid}&Policy=${t.Policy}&Signature=${t.Signature}&Key-Pair-Id=${t["Key-Pair-Id"]}` : ""),
                i = "data:image/jpeg;base64," + function (t) {
                  for (var e = "", r = new Uint8Array(t), i = r.byteLength, n = 0; n < i; n++) e += String.fromCharCode(r[n]);
                  return window.btoa(e)
                }(await axios.get(r, {
                  responseType: "arraybuffer"
                }).then((t => t.data)));
              return (r.includes("bookwalker.jp") || r.includes("bookwalker.com.tw")) && 1 === this.index ? i : new o.default(i, this, this.pageConfig.Size).decode()
            }, t
          }();

        function h(t, e) {
          return void 0 === e && (e = 0), t.reduce((function (t, e) {
            return t + e
          }), e)
        }

        function s(t) {
          var e = 0,
            r = -4 & t.length;
          r > 32 && (r = 32);
          for (var i = 0; i < r;) e ^= t[i++] << 24, e ^= t[i++] << 16, e ^= t[i++] << 8, e ^= t[i++] << 0;
          return e >>> 0
        }
        e.__esModule = !0, e.default = a
      },
      791: (t, e, r) => {
        "use strict";
        var i = r(46),
          n = r(733);
        e.__esModule = !0, e.default = function (t, e, r) {
          var o = t.b8A,
            a = t.b6V,
            h = t.B0J,
            s = t.B0K,
            u = t.B0n,
            f = t.B0A,
            c = n.default.b6o,
            g = n.default.b6b,
            l = Math.floor(e / o),
            d = Math.floor(r / a),
            v = e % o,
            p = r % a,
            b = l + 1 << 1,
            _ = d + 1 << 1,
            y = (l + 1) * o - v,
            k = (d + 1) * a - p,
            w = new n.default,
            m = f ^ l ^ d,
            B = m % g,
            M = (m - B) / g % c,
            S = [];
          w.b9es(M, B), w.B0o(h ^ s ^ u);
          var C = w.b4K(65536) + 65536 * w.b4K(65536) + 4294967296 * w.b4K(512),
            W = 4294967296 * l + h,
            I = 4294967296 * d + s,
            x = 4294967296 * f + u,
            K = i.default(C, W, I, x),
            P = function (t, e, r, i) {
              if (0 !== r && 0 !== i)
                for (; t < e;) {
                  var n = K[t++],
                    h = K[t++],
                    s = n % b,
                    u = h % _,
                    f = (h - u) / _,
                    c = (n - s) / b;
                  S.push({
                    srcX: s * o - (s > l ? y : 0),
                    srcY: u * a - (u > d ? k : 0),
                    destX: f * o - (f > l ? y : 0),
                    destY: c * a - (c > d ? k : 0),
                    width: r,
                    height: i
                  })
                }
            },
            z = 0,
            j = l * d * 2;
          return P(z, j, o, a), P(z = j, j += 2, v, p), P(z = j, j += 2 * l, o, p), P(z = j, j += 2 * d, v, a), S
        }
      },
      733: (t, e) => {
        "use strict";
        e.__esModule = !0;
        var r = JSON.parse("[[1,3,10],[1,5,16],[1,5,19],[1,9,29],[1,11,6],[1,11,16],[1,19,3],[1,21,20],[1,27,27],[2,5,15],[2,5,21],[2,7,7],[2,7,9],[2,7,25],[2,9,15],[2,15,17],[2,15,25],[2,21,9],[3,1,14],[3,3,26],[3,3,28],[3,3,29],[3,5,20],[3,5,22],[3,5,25],[3,7,29],[3,13,7],[3,23,25],[3,25,24],[3,27,11],[4,3,17],[4,3,27],[4,5,15],[5,3,21],[5,7,22],[5,9,7],[5,9,28],[5,9,31],[5,13,6],[5,15,17],[5,17,13],[5,21,12],[5,27,8],[5,27,21],[5,27,25],[5,27,28],[6,1,11],[6,3,17],[6,17,9],[6,21,7],[6,21,13],[7,1,9],[7,1,18],[7,1,25],[7,13,25],[7,17,21],[7,25,12],[7,25,20],[8,7,23],[8,9,23],[9,5,14],[9,5,25],[9,11,19],[9,21,16],[10,9,21],[10,9,25],[11,7,12],[11,7,16],[11,17,13],[11,21,13],[12,9,23],[13,3,17],[13,3,27],[13,5,19],[13,17,15],[14,1,15],[14,13,15],[15,1,29],[17,15,20],[17,15,23],[17,15,26]]"),
          i = [function (t, e, r, i) {
            return t ^= t << e, (t ^= t >>> r) ^ t << i
          }, function (t, e, r, i) {
            return t ^= t << i, (t ^= t >>> r) ^ t << e
          }, function (t, e, r, i) {
            return t ^= t >>> e, (t ^= t << r) ^ t >>> i
          }, function (t, e, r, i) {
            return t ^= t >>> i, (t ^= t << r) ^ t >>> e
          }, function (t, e, r, i) {
            return t ^= t << e, (t ^= t << i) ^ t >>> r
          }, function (t, e, r, i) {
            return t ^= t >>> e, (t ^= t >>> i) ^ t << r
          }],
          n = 2463534242,
          o = function () {
            function t() {
              this.v_kgh = 0, this.v_jgh = n, this.v_lgh = r[74][this.v_kgh++], this.v_mgh = r[74][this.v_kgh++], this.v_ngh = r[74][this.v_kgh++], this.v_ogh = i[0]
            }
            return t.prototype.b9es = function (t, e) {
              this.v_jgh = n;
              var o = r[t],
                a = 0;
              this.v_lgh = o[a++], this.v_mgh = o[a++], this.v_ngh = o[2], this.v_ogh = i[e]
            }, t.prototype.B0o = function (t) {
              var e = t >>> 0;
              this.v_jgh = e || n
            }, t.prototype.b4K = function (t) {
              if (t <= 1) return 0;
              var e, r, i = 4294967295 - t,
                n = this.v_jgh;
              do {
                e = (r = (n = this.v_ogh(n, this.v_lgh, this.v_mgh, this.v_ngh) >>> 0) - 1) % t
              } while (i < r - e);
              return this.v_jgh = n, e
            }, t.b6o = r.length, t.b6b = i.length, t.b4v = r.length * i.length, t
          }();
        e.default = o
      },
      46: (t, e, r) => {
        "use strict";
        var i = r(733);

        function n(t, e) {
          for (var r = [], i = 0; i < e; i++) {
            var n = t(i + 1);
            r[i] = r[n], r[n] = i
          }
          return r
        }

        function o(t, e) {
          return e < 4 ? t(e + 1) : t(e - 1) + 1
        }

        function a(t, e, r) {
          if (r <= 0) return 0;
          var i = t(r);
          return i < e ? i : i + 1
        }

        function h(t, e, r, i, n, o, a) {
          for (var h = void 0, s = void 0, u = void 0, f = o, c = a, g = i, l = n, d = 0, v = 0; f + c > 0;) {
            var p = -1;
            if ((h = t(f + c)) < f) {
              if (h < g) {
                for (s = v; s > 0 && !(d >= e[s + p]); s--);
                for (u = v + c; u < a && !(d >= e[u]); u++);
                r[d] = t(u - s) + s, d++, g--
              } else {
                for (s = v; s > 0 && !(d + f <= e[s + p]); s--);
                for (u = v + c; u < a && !(d + f <= e[u]); u++);
                r[d + f + p] = t(u - s) + s
              }
              f--
            } else {
              if (h - f < l) {
                for (s = d; s > 0 && !(v >= r[s + p]); s--);
                for (u = d + f; u < o && !(v >= r[u]); u++);
                e[v] = t(u - s) + s, v++, l--
              } else {
                for (s = d; s > 0 && !(v + c <= r[s + p]); s--);
                for (u = d + f; u < o && !(v + c <= r[u]); u++);
                e[v + c + p] = t(u - s) + s
              }
              c--
            }
          }
        }
        e.__esModule = !0, e.default = function (t, e, r, s) {
          var u = new i.default,
            f = e ^ r ^ s,
            c = Math.floor(t / 65536),
            g = Math.floor(e / 65536),
            l = Math.floor(r / 65536),
            d = Math.floor(s / 65536),
            v = i.default.b6o,
            p = i.default.b6b,
            b = g ^ l ^ d,
            _ = c ^ d,
            y = t ^ e,
            k = t ^ r,
            w = t ^ s,
            m = (b >>>= 16) % p,
            B = (b - m) / p % v,
            M = u.b4K.bind(u);
          u.b9es(B, m), u.B0o(f);
          var S = u.b4K(65536) | u.b4K(65536) << 16,
            C = g >>> 16,
            W = l >>> 16;
          y = (y ^ S) >>> 0, k = (k ^ S) >>> 0, w = (w ^ S) >>> 0;
          var I = (_ = _ >>> 16 ^ u.b4K(512)) % p,
            x = (_ - I) / p % v;
          u.b9es(x, I), u.B0o(y);
          var K = n(M, C * W);
          u.B0o(k);
          var P = o(M, C),
            z = o(M, W),
            j = a(M, P, C),
            A = a(M, z, W);
          u.B0o(w);
          var N = [],
            $ = [];
          h(M, N, $, P, z, C, W);
          var H = n(M, C),
            L = n(M, W),
            U = [],
            X = [];
          return h(M, X, U, j, A, C, W),
            function (t, e, r, i, n, o, a, h, s, u, f, c, g) {
              for (var l = [], d = t + 1, v = e + 1, p = d << 1, b = v << 1, _ = 0; _ < t; _++)
                for (var y = 0; y < e; y++) {
                  var k = r[_ + y * t],
                    w = (k - (C = k % t)) / t,
                    m = _ < f[y] ? _ : _ + d,
                    B = y < u[_] ? y : y + v,
                    M = C < a[w] ? C : C + d,
                    S = w < o[C] ? w : w + v;
                  l.push(S * p + m), l.push(M * b + B)
                }
              for (l.push(s * p + c), l.push(h * b + g), _ = 0; _ < t; _++) {
                var C;
                m = _ < c ? _ : _ + d, M = (C = i[_]) < h ? C : C + d, l.push(o[C] * p + m), l.push(M * b + u[_])
              }
              for (y = 0; y < e; y++) B = y < g ? y : y + v, S = (w = n[y]) < s ? w : w + v, l.push(S * p + f[y]), l.push(a[w] * b + B);
              return l
            }(C, W, K, H, L, U, X, j, A, $, N, P, z)
        }
      },
      188: (t, e) => {
        "use strict";
        e.__esModule = !0, e.default = function (t, e, r, o) {
          var a = {
              B0G: t,
              url: t + "/0.jpeg",
              B0H: ".jpeg",
              fileName: "0"
            },
            h = {
              b9W: n(e, r, o),
              configuration: {
                "file-name-version": "1.0"
              }
            };
          return "string" == typeof h.configuration["file-name-version"] ? a.B0G + "/" + function (t) {
            var e = parseInt(t, 10);
            if (!isNaN(e) && e >= 0 && e <= 0x1000000000000000) {
              var r = e.toString(16);
              return r.length.toString(16) + r
            }
            return "0" + t
          }(a.fileName) + function (t, e) {
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
                  k = 435 * d + ((7 & v) << 18) + (y >>> 22),
                  w = 435 * l + ((3 & d) << 19) + ((4194296 & v) >>> 3) + (k >>> 21);
                v = 4194303 & y, d = 2097151 & k, l = 2097151 & w, b >= t.b9W.length && (b = 0)
              }
            var m = new Array(16);
            for (p = 0; p < m.length; p += 2) switch (p) {
              case 0:
                i(m, p, l >>> 13 ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 2:
                i(m, p, l >>> 5 & 255 ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 4:
                i(m, p, ((31 & l) << 3 | d >>> 18) ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 6:
                i(m, p, d >>> 10 & 255 ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 8:
                i(m, p, d >>> 2 & 255 ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 10:
                i(m, p, ((3 & d) << 6 | v >>> 16) ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 12:
                i(m, p, v >>> 8 & 255 ^ t.b9W[Math.floor(p / 2)]);
                break;
              case 14:
                i(m, p, 255 & v ^ t.b9W[Math.floor(p / 2)])
            }
            return String.fromCharCode.apply(String, m)
          }(h, a) + a.B0H : a.url
        };
        var r = function (t) {
            return (t < 10 ? 48 : 87) + t
          },
          i = function (t, e, i) {
            t[e] = r(i >>> 4), t[e + 1] = r(15 & i)
          };

        function n(t, e, r) {
          var i = [];
          return o(i, t), o(i, e), o(i, r), i
        }

        function o(t, e) {
          for (var r = 0; r < e.length; r++) t[r] ^= e[r]
        }
      },
      10: (t, e, r) => {
        const i = r(546);
        e.__esModule = !0, t.exports = {
          init: function (t, e, r, n, o, a, h, s) {
            return new i.default(t, e, r, n, o, a, h, s)
          }
        }
      }
    },
    e = {},
    r = function r(i) {
      var n = e[i];
      if (void 0 !== n) return n.exports;
      var o = e[i] = {
        exports: {}
      };
      return t[i](o, o.exports, r), o.exports
    }(10);
  PublusPage = r
})();