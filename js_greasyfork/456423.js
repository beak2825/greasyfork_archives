const SpeedReaderTools = (() => {
  function generateRandomString32(id) {
    function generateRandomString16() {
      let e = "";
      let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  
      for (let i = 0; i < 16; i++) {
        e += n.charAt(Math.floor(Math.random() * n.length));
      }
  
      return e;
    }
  
    let n = generateRandomString16(),
      i = Array(Math.ceil(16 / id.length) + 1).join(id),
      r = i.substr(0, 16),
      e = i.substr(-16, 16),
      s = 0,
      h = 0,
      u = 0;
    return n.split("").map(function (t, i) {
      return s ^= n.charCodeAt(i),
        h ^= r.charCodeAt(i),
        u ^= e.charCodeAt(i),
        t + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" [s + h + u & 63]
    }).join("");
  }
  
  function getDecryptedTable(t, i, n) { // id, randomString, table
    for (var r = t + ":" + i, e = 0, s = 0; s < r.length; s++)
      e += r.charCodeAt(s) << s % 16;
    0 == (e &= 2147483647) && (e = 305419896);
    var h = "",
      u = e;
  
    for (let s = 0; s < n.length; s++) {
      u = u >>> 1 ^ 1210056708 & -(1 & u);
      var o = (n.charCodeAt(s) - 32 + u) % 94 + 32;
  
      h += String.fromCharCode(o)
    }
  
    try {
      return JSON.parse(h)
    } catch (t) {}
  
    return null
  }
  
  function getDecryptionKey(t, ctbl, ptbl) { // filename, ctbl, ptbl
    var i = [0, 0];
    if (t) {
      for (var n = t.lastIndexOf("/") + 1, r = t.length - n, e = 0; e < r; e++)
        i[e % 2] += t.charCodeAt(e + n);
      i[0] %= 8,
        i[1] %= 8
    }
    var s = ptbl[i[0]],
      h = ctbl[i[1]];
  
    return [h, s];
  }
  
  class CoordDecoder {
    constructor(t, i) {
      this.It = null;
      this.kt = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
      var n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/),
        r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
      if (null !== n && null !== r && n[1] === r[1] && n[2] === r[2] && n[4] === r[4] && "+" === n[3] && "-" === r[3] && (this.T = parseInt(n[1], 10),
          this.j = parseInt(n[2], 10),
          this.xt = parseInt(n[4], 10),
          !(8 < this.T || 8 < this.j || 64 < this.T * this.j))) {
        var e = this.T + this.j + this.T * this.j;
        if (n[5].length === e && r[5].length === e) {
          var s = this.St(n[5]),
            h = this.St(r[5]);
          this.Ct = s.n,
            this.At = s.t,
            this.Tt = h.n,
            this.Pt = h.t,
            this.It = [];
          for (var u = 0; u < this.T * this.j; u++)
            this.It.push(s.p[h.p[u]])
        }
      }
    }
  
    St(t) {
      var i, n = [],
        r = [],
        e = [];
      for (i = 0; i < this.T; i++)
        n.push(this.kt[t.charCodeAt(i)]);
      for (i = 0; i < this.j; i++)
        r.push(this.kt[t.charCodeAt(this.T + i)]);
      for (i = 0; i < this.T * this.j; i++)
        e.push(this.kt[t.charCodeAt(this.T + this.j + i)]);
      return {
        t: n,
        n: r,
        p: e
      }
    }
  
    getCoords(t) {
      for (var i = t.width - 2 * this.T * this.xt, n = t.height - 2 * this.j * this.xt, r = Math.floor((i + this.T - 1) / this.T), e = i - (this.T - 1) * r, s = Math.floor((n + this.j - 1) / this.j), h = n - (this.j - 1) * s, u = [], o = 0; o < this.T * this.j; ++o) {
        var a = o % this.T,
          f = Math.floor(o / this.T),
          c = this.xt + a * (r + 2 * this.xt) + (this.Tt[f] < a ? e - r : 0),
          l = this.xt + f * (s + 2 * this.xt) + (this.Pt[a] < f ? h - s : 0),
          v = this.It[o] % this.T,
          d = Math.floor(this.It[o] / this.T),
          b = v * r + (this.Ct[d] < v ? e - r : 0),
          g = d * s + (this.At[v] < d ? h - s : 0),
          p = this.Tt[f] === a ? e : r,
          m = this.Pt[a] === f ? h : s;
        0 < i && 0 < n && u.push({
          srcX: c,
          srcY: l,
          width: p,
          height: m,
          destX: b,
          destY: g
        })
      }
      return u
    }
  }

  return {
    generateRandomString32,
    getDecryptedTable,
    getDecryptionKey,
    CoordDecoder
  }
})();