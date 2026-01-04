// ==UserScript==
// @name Gpsies Export
// @description Export own Gpsies tracks (adds export item in user menu)
// @version 0.1
// @namespace Violentmonkey Scripts
// @match https://www.gpsies.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/390217/Gpsies%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/390217/Gpsies%20Export.meta.js
// ==/UserScript==

if (!this.setTimeout) {
    this.setTimeout = function (callback, timeout, p1, p2, p3){
        var args = Array.prototype.slice.call(arguments,2);
        return  window.setTimeout(function(){
            return callback.apply(window, args);
        } ,timeout);
    }
}
function aa(e) {
  var h = 0;
  return function() {
    return h < e.length ? {done:!1, value:e[h++]} : {done:!0};
  };
}
function ba(e) {
  var h = "undefined" != typeof Symbol && Symbol.iterator && e[Symbol.iterator];
  return h ? h.call(e) : {next:aa(e)};
}
var ca = "function" == typeof Object.create ? Object.create : function(e) {
  function h() {
  }
  h.prototype = e;
  return new h;
}, ea;
if ("function" == typeof Object.setPrototypeOf) {
  ea = Object.setPrototypeOf;
} else {
  var fa;
  a: {
    var ha = {fb:!0}, ia = {};
    try {
      ia.__proto__ = ha;
      fa = ia.fb;
      break a;
    } catch (e) {
    }
    fa = !1;
  }
  ea = fa ? function(e, h) {
    e.__proto__ = h;
    if (e.__proto__ !== h) {
      throw new TypeError(e + " is not extensible");
    }
    return e;
  } : null;
}
var ja = ea;
function ka(e, h) {
  e.prototype = ca(h.prototype);
  e.prototype.constructor = e;
  if (ja) {
    ja(e, h);
  } else {
    for (var r in h) {
      if ("prototype" != r) {
        if (Object.defineProperties) {
          var x = Object.getOwnPropertyDescriptor(h, r);
          x && Object.defineProperty(e, r, x);
        } else {
          e[r] = h[r];
        }
      }
    }
  }
}
var w = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this, la = "function" == typeof Object.defineProperties ? Object.defineProperty : function(e, h, r) {
  e != Array.prototype && e != Object.prototype && (e[h] = r.value);
};
function ma(e, h) {
  if (h) {
    for (var r = w, x = e.split("."), E = 0; E < x.length - 1; E++) {
      var y = x[E];
      y in r || (r[y] = {});
      r = r[y];
    }
    x = x[x.length - 1];
    E = r[x];
    y = h(E);
    y != E && null != y && la(r, x, {configurable:!0, writable:!0, value:y});
  }
}
ma("Promise", function(e) {
  function h(d) {
    this.T = 0;
    this.na = void 0;
    this.N = [];
    var g = this.ha();
    try {
      d(g.resolve, g.reject);
    } catch (k) {
      g.reject(k);
    }
  }
  function r() {
    this.v = null;
  }
  function x(d) {
    return d instanceof h ? d : new h(function(g) {
      g(d);
    });
  }
  if (e) {
    return e;
  }
  r.prototype.Ca = function(d) {
    if (null == this.v) {
      this.v = [];
      var g = this;
      this.Da(function() {
        g.Eb();
      });
    }
    this.v.push(d);
  };
  var E = w.setTimeout;
  r.prototype.Da = function(d) {
    E(d, 0);
  };
  r.prototype.Eb = function() {
    for (; this.v && this.v.length;) {
      var d = this.v;
      this.v = [];
      for (var g = 0; g < d.length; ++g) {
        var k = d[g];
        d[g] = null;
        try {
          k();
        } catch (A) {
          this.hb(A);
        }
      }
    }
    this.v = null;
  };
  r.prototype.hb = function(d) {
    this.Da(function() {
      throw d;
    });
  };
  h.prototype.ha = function() {
    function d(A) {
      return function(K) {
        k || (k = !0, A.call(g, K));
      };
    }
    var g = this, k = !1;
    return {resolve:d(this.yc), reject:d(this.ma)};
  };
  h.prototype.yc = function(d) {
    if (d === this) {
      this.ma(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (d instanceof h) {
        this.Bc(d);
      } else {
        a: {
          switch(typeof d) {
            case "object":
              var g = null != d;
              break a;
            case "function":
              g = !0;
              break a;
            default:
              g = !1;
          }
        }
        g ? this.xc(d) : this.Pa(d);
      }
    }
  };
  h.prototype.xc = function(d) {
    var g = void 0;
    try {
      g = d.then;
    } catch (k) {
      this.ma(k);
      return;
    }
    "function" == typeof g ? this.Cc(g, d) : this.Pa(d);
  };
  h.prototype.ma = function(d) {
    this.$a(2, d);
  };
  h.prototype.Pa = function(d) {
    this.$a(1, d);
  };
  h.prototype.$a = function(d, g) {
    if (0 != this.T) {
      throw Error("Cannot settle(" + d + ", " + g + "): Promise already settled in state" + this.T);
    }
    this.T = d;
    this.na = g;
    this.Fb();
  };
  h.prototype.Fb = function() {
    if (null != this.N) {
      for (var d = 0; d < this.N.length; ++d) {
        y.Ca(this.N[d]);
      }
      this.N = null;
    }
  };
  var y = new r;
  h.prototype.Bc = function(d) {
    var g = this.ha();
    d.X(g.resolve, g.reject);
  };
  h.prototype.Cc = function(d, g) {
    var k = this.ha();
    try {
      d.call(g, k.resolve, k.reject);
    } catch (A) {
      k.reject(A);
    }
  };
  h.prototype.then = function(d, g) {
    function k(N, Q) {
      return "function" == typeof N ? function(T) {
        try {
          A(N(T));
        } catch (W) {
          K(W);
        }
      } : Q;
    }
    var A, K, Z = new h(function(N, Q) {
      A = N;
      K = Q;
    });
    this.X(k(d, A), k(g, K));
    return Z;
  };
  h.prototype["catch"] = function(d) {
    return this.then(void 0, d);
  };
  h.prototype.X = function(d, g) {
    function k() {
      switch(A.T) {
        case 1:
          d(A.na);
          break;
        case 2:
          g(A.na);
          break;
        default:
          throw Error("Unexpected state: " + A.T);
      }
    }
    var A = this;
    null == this.N ? y.Ca(k) : this.N.push(k);
  };
  h.resolve = x;
  h.reject = function(d) {
    return new h(function(g, k) {
      k(d);
    });
  };
  h.race = function(d) {
    return new h(function(g, k) {
      for (var A = ba(d), K = A.next(); !K.done; K = A.next()) {
        x(K.value).X(g, k);
      }
    });
  };
  h.all = function(d) {
    var g = ba(d), k = g.next();
    return k.done ? x([]) : new h(function(A, K) {
      function Z(T) {
        return function(W) {
          N[T] = W;
          Q--;
          0 == Q && A(N);
        };
      }
      var N = [], Q = 0;
      do {
        N.push(void 0), Q++, x(k.value).X(Z(N.length - 1), K), k = g.next();
      } while (!k.done);
    });
  };
  return h;
});
ma("Promise.prototype.finally", function(e) {
  return e ? e : function(h) {
    return this.then(function(r) {
      return Promise.resolve(h()).then(function() {
        return r;
      });
    }, function(r) {
      return Promise.resolve(h()).then(function() {
        throw r;
      });
    });
  };
});
function na() {
  na = function() {
  };
  w.Symbol || (w.Symbol = qa);
}
function ra(e, h) {
  this.bb = e;
  la(this, "description", {configurable:!0, writable:!0, value:h});
}
ra.prototype.toString = function() {
  return this.bb;
};
var qa = function() {
  function e(r) {
    if (this instanceof e) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new ra("jscomp_symbol_" + (r || "") + "_" + h++, r);
  }
  var h = 0;
  return e;
}();
function sa() {
  na();
  var e = w.Symbol.iterator;
  e || (e = w.Symbol.iterator = w.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[e] && la(Array.prototype, e, {configurable:!0, writable:!0, value:function() {
    return ta(aa(this));
  }});
  sa = function() {
  };
}
function ta(e) {
  sa();
  e = {next:e};
  e[w.Symbol.iterator] = function() {
    return this;
  };
  return e;
}
function ua() {
  this.R = !1;
  this.w = null;
  this.f = void 0;
  this.a = 1;
  this.Oa = this.K = 0;
  this.D = null;
}
function va(e) {
  if (e.R) {
    throw new TypeError("Generator is already running");
  }
  e.R = !0;
}
ua.prototype.S = function(e) {
  this.f = e;
};
ua.prototype.U = function(e) {
  this.D = {ia:e, bc:!0};
  this.a = this.K || this.Oa;
};
ua.prototype["return"] = function(e) {
  this.D = {"return":e};
  this.a = this.Oa;
};
function D(e, h, r) {
  e.a = r;
  return {value:h};
}
function wa(e) {
  e.a = 3;
  e.K = 0;
}
function xa(e) {
  e.K = 0;
  var h = e.D.ia;
  e.D = null;
  return h;
}
function ya(e) {
  this.b = new ua;
  this.tc = e;
}
ya.prototype.S = function(e) {
  va(this.b);
  if (this.b.w) {
    return za(this, this.b.w.next, e, this.b.S);
  }
  this.b.S(e);
  return Aa(this);
};
function Ba(e, h) {
  va(e.b);
  var r = e.b.w;
  if (r) {
    return za(e, "return" in r ? r["return"] : function(x) {
      return {value:x, done:!0};
    }, h, e.b["return"]);
  }
  e.b["return"](h);
  return Aa(e);
}
ya.prototype.U = function(e) {
  va(this.b);
  if (this.b.w) {
    return za(this, this.b.w["throw"], e, this.b.S);
  }
  this.b.U(e);
  return Aa(this);
};
function za(e, h, r, x) {
  try {
    var E = h.call(e.b.w, r);
    if (!(E instanceof Object)) {
      throw new TypeError("Iterator result " + E + " is not an object");
    }
    if (!E.done) {
      return e.b.R = !1, E;
    }
    var y = E.value;
  } catch (d) {
    return e.b.w = null, e.b.U(d), Aa(e);
  }
  e.b.w = null;
  x.call(e.b, y);
  return Aa(e);
}
function Aa(e) {
  for (; e.b.a;) {
    try {
      var h = e.tc(e.b);
      if (h) {
        return e.b.R = !1, {value:h.value, done:!1};
      }
    } catch (r) {
      e.b.f = void 0, e.b.U(r);
    }
  }
  e.b.R = !1;
  if (e.b.D) {
    h = e.b.D;
    e.b.D = null;
    if (h.bc) {
      throw h.ia;
    }
    return {value:h["return"], done:!0};
  }
  return {value:void 0, done:!0};
}
function Ca(e) {
  this.next = function(h) {
    return e.S(h);
  };
  this["throw"] = function(h) {
    return e.U(h);
  };
  this["return"] = function(h) {
    return Ba(e, h);
  };
  sa();
  this[Symbol.iterator] = function() {
    return this;
  };
}
function Da(e) {
  function h(x) {
    return e.next(x);
  }
  function r(x) {
    return e["throw"](x);
  }
  return new Promise(function(x, E) {
    function y(d) {
      d.done ? x(d.value) : Promise.resolve(d.value).then(h, r).then(y, E);
    }
    y(e.next());
  });
}
function S(e) {
  return Da(new Ca(new ya(e)));
}
(function(e) {
  e.addCss = function(h) {
    var r = document.createElement("style");
    r.innerHTML = h;
    (document.head || document.documentElement).appendChild(r);
  };
  e.waitScripts = function(h) {
    var r, x;
    return S(function(E) {
      r = [];
      h.forEach(function(y) {
        try {
          if (y.check()) {
            console.log(y.url + " preinstalled");
          } else {
            var d = document.createElement("script");
            d.setAttribute("src", y.url);
            (document.head || document.documentElement).appendChild(d);
            r.push(y);
            console.log("added " + y.url);
          }
        } catch (g) {
          console.error("error adding script", g);
        }
      });
      x = r.map(function(y) {
        return new Promise(function(d) {
          function g() {
            var k = y.check();
            k ? (console.log(y.url + " works"), d(k)) : (console.log("waiting for " + y.url), setTimeout(g, 300));
          }
          g();
        });
      });
      return E["return"](Promise.all(x));
    });
  };
})(window);
window.addCss('\n        .down-log {\n            display: flex;\n            flex-direction: column;\n            width: 95%;\n            max-width: 650px;\n            max-height: 90%;\n            min-height: 250px;\n            overflow-y: auto;\n            padding: 20px;\n            border: none;\n            margin: 10px auto;\n            position: fixed;\n            top: 20px;\n            left: 0;\n            right: 0;\n            z-index: 99999;\n        }\n        .block-background {\n            position: fixed;\n            height: 100%;\n            width: 100%;\n            top: 0;\n            left: 0;\n            background: black;\n            opacity: 0.5;\n            z-index: 99999;\n        }\n        .down-log > .line {\n            whitespace: nowrap;\n            padding: 5px 0 5px 20px;\n        }\n        .down-log > .line > * {\n            display: inline-block;\n        }\n        .down-log > .line > button {\n            float: right;\n        }\n        .down-log > .line > span {\n            min-width: 70px;\n        }\n        .down-log > .line > label {\n            padding: 0 5px 0 10px;\n            margin-bottom: 0;\n            cursor: pointer;\n        }\n        .down-log > .line > label.disabled {\n            pointer-events: none;\n            opacity: 0.7;\n        }\n        .down-log > .line > label > input {\n            padding: 0 5px 0 0 !important;\n            margin: 0px 3px 0 0 !important;\n            top: 3px;\n            position: relative;\n            cursor: pointer;\n        }\n        .down-log > .line.log-container {\n            flex-grow: 1;\n            overflow-y: auto;\n            max-height: 400px;\n            padding: 10px 5px 10px 25px;\n            background: #eee;\n        }\n        .down-log ul {\n            width: 100%;\n        }\n        .down-log ul > li {\n            font-size: small;\n            white-space: pre-wrap;"\n        }\n        .down-log.download-pending {\n            cursor: wait;\n        }\n        .down-log.download-pending .download-btn {\n            background-color: gray !important;\n            pointer-events: none;\n        }\n        .down-log.download-error .download-btn {\n            background-color: red !important;\n        }\n    ');
(function(e) {
  function h() {
    this.s = [];
  }
  function r(g) {
    return null != g && g instanceof Date && !isNaN(g.getTime());
  }
  function x(g) {
    var k = g && g.message;
    if (!k) {
      try {
        k = JSON.stringify(g);
      } catch (A) {
      }
    }
    return k || "<...>";
  }
  var E = {Vb:function(g) {
    return "Error: " + g;
  }, Ub:function(g) {
    return "Data: " + g;
  }, c:{Ua:"Export my data", ta:"Gpsies Export", za:"Public", xa:"Private", wa:"Notepad", ua:"Groups", ya:"Private groups", J:"Tracks", I:"Track data", H:"Photos", pa:function(g, k) {
    return g ? k ? " (new: " + g + ", cached: " + k + ")" : " (" + g + ")" : k ? " (all " + k + " cached)" : " (none)";
  }, qa:"Download", ra:"Waiting...", sa:function(g) {
    return "Download (" + g + ")";
  }, oa:"Cancel"}, log:{kb:"Counting objects to download", error:"error", ia:function(g) {
    return "error : " + x(g);
  }, Xb:function(g) {
    return "invalid cb id " + g;
  }, Sb:"Getting own public track files", Rb:"Getting own private track files", Qb:"Getting notepad track files", Ob:"Getting public group track files", Pb:"Getting private group track files", Mc:"Getting photos", lc:"Packaging files", hc:"no tracks found", Gb:"error extracting extended fields", Cb:function(g) {
    return "error writing " + g + " to db";
  }, ac:"invalid url, skipping", Gc:function(g) {
    return "too many tracks to download, skipping the rest (~" + g + ")";
  }, mb:function(g, k, A) {
    return g + 1 + "/" + k + " id " + A + " (" + Math.floor((g + 1) / k * 100) + "%)";
  }, Dc:function(g) {
    return "skipped file " + g;
  }, vc:function(g, k) {
    return "Cached track " + g + " changed on " + k + ", redownloading";
  }, Db:function(g) {
    return "Cached track " + g + " has errors, redownloading";
  }, Tb:function(g) {
    return "Got " + g + " from cache";
  }, tb:function(g) {
    return "Error getting object " + g + " from cache";
  }, nb:function(g) {
    return "Dowloading GPX for track " + g + "....";
  }, Hb:"File not saved", wb:"Error loading  saved track", Ab:function(g) {
    return "error parsing tracklist attributes : " + g;
  }, kc:function(g) {
    return "opening url list " + g;
  }, zb:"error parsing row, skipping", ib:function(g, k) {
    return "collected " + g + " urls, total " + k;
  }, Fc:function(g) {
    return "too many pages: " + g;
  }, lb:function(g) {
    return "done with " + g + " urls";
  }, xb:"error parsing page", vb:function(g) {
    return "error getting page " + g;
  }, wc:"request timeout", Bb:"error parsing value", $b:"invalid upload date", Zb:"invalid ride date", Yb:function(g, k) {
    return "invalid dates " + g + " and " + k;
  }, gc:"no track points", sb:"error extracting dates", yb:function(g) {
    return "error parsing responce for file " + g;
  }, rb:function(g, k) {
    return "error downloading file " + g + " status " + k;
  }, ub:function(g, k) {
    return 'error getting group "' + g + '" track urls : ' + x(k);
  }, jb:function(g) {
    return "collecting " + g + " records to files...";
  }, qb:function(g) {
    return "error collecting file " + g + ", skipping";
  }, gb:function(g) {
    return "archiving " + g + " files...";
  }, fc:"collected no files to archive!", done:"done!"}, filename:{Ic:"(with private)", zc:"route planner", ob:function(g) {
    return "(edited " + g + ")";
  }, rc:"private", ic:"notepad", groups:"groups", la:"private groups"}, Va:{Fa:"Close the page manually to stop downloading"}}, y = Object.assign({}, E);
  y.c = {Ua:"\u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u043c\u043e\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445", ta:"\u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 Gpsies", za:"\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435", xa:"\u0427\u0430\u0441\u0442\u043d\u044b\u0435", wa:"\u0411\u043b\u043e\u043a\u043d\u043e\u0442", ua:"\u0413\u0440\u0443\u043f\u043f\u044b \u0442\u0440\u0435\u043a\u043e\u0432", ya:"\u0427\u0430\u0441\u0442\u043d\u044b\u0435 \u0433\u0440\u0443\u043f\u043f\u044b", 
  J:"\u0422\u0440\u0435\u043a\u0438", I:"\u0414\u0430\u043d\u043d\u044b\u0435 \u0442\u0440\u0435\u043a\u043e\u0432", H:"\u0424\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0438", pa:function(g, k) {
    return g ? k ? " (\u043d\u043e\u0432\u044b\u0435: " + g + ", \u0441\u043e\u0445\u0440\u0430\u043d\u0451\u043d\u044b\u0435: " + k + ")" : " (" + g + ")" : k ? " (\u0432\u0441\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b (" + k + "))" : " (\u043d\u0435\u0442)";
  }, qa:"\u0421\u043a\u0430\u0447\u0430\u0442\u044c", ra:"\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435...", sa:function(g) {
    return "\u0421\u043a\u0430\u0447\u0430\u0442\u044c (" + g + ")";
  }, oa:"\u0417\u0430\u043a\u0440\u044b\u0442\u044c"};
  y.Va = {Fa:"\u0414\u043b\u044f \u043e\u0442\u043c\u0435\u043d\u044b \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u043d\u0430\u0434\u043e \u0432\u0440\u0443\u0447\u043d\u0443\u044e \u0437\u0430\u043a\u0440\u044b\u0442\u044c \u0432\u043a\u043b\u0430\u0434\u043a\u0443"};
  var d = (e.navigator.language || e.navigator.userLanguage || "").match(/(^|-)(ru|RU|ua|UA|uk|UK|by|BY)(-|$)/) ? y : E;
  h.prototype.add = function(g, k) {
    this.s.push(g);
    console.warn(g, k);
  };
  h.prototype.qc = function() {
    var g = this.s;
    this.s = [];
    return g;
  };
  e.exportGpsies = function(g, k, A, K, Z, N) {
    function Q(H) {
      var a = new XMLSerializer;
      return new Promise(function(b, f) {
        return k.get(H).done(function(c, l, m) {
          try {
            var n = m.getResponseHeader("Content-Disposition"), q = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(n)[1].replace("UTF-8''", ""), p = {url:H, filename:decodeURI(q), data:c, Ha:a.serializeToString(c)};
            debugger;
            b(p);
          } catch (v) {
            O.warn(d.log.yb(H), v), f(v);
          }
        }).fail(function(c) {
          O.warn(d.log.rb(H, c && c.status), c);
          f(c);
        });
      });
    }
    function T(H) {
      return (H = H.match(/fileId=([a-z]+)/)) && H[1] || void 0;
    }
    function W(H) {
      console.assert(H, "empty filename");
      return (H || "").replace(/[<>:"\/\\|?*]+/gi, "-").replace(/\s+/gi, " ").replace(/(\.)$/gi, "");
    }
    function Ea(H) {
      var a, b, f, c, l;
      return S(function(m) {
        if (1 == m.a) {
          a = new N;
          b = new XMLSerializer;
          f = function(n) {
            var q = n.getMonth() + 1, p = n.getDate();
            return n.getFullYear() + "." + (10 > q ? "0" + q : q) + "." + (10 > p ? "0" + p : p);
          };
          O.log(d.log.jb(H.length));
          H.forEach(function(n) {
            try {
              var q = "" + n.name + (n.fa ? " (" + n.fa + ")" : "") + ".gpx";
              n.l && (q = n.l + " - " + q);
              if (n.V) {
                var p = f(n.V);
                r(n.o) && n.V.toDateString() != n.o.toDateString() && (p += " " + d.filename.ob(f(n.o)));
                q = p + " - " + q;
              }
              q = W(q);
              p = "";
              if (n.group) {
                if (n.i && !n.group.i) {
                  throw Error("private track in public group usupported, skipping");
                }
                p = (n.group.i ? d.filename.la : d.filename.groups) + "\\" + W(n.group.name) + "\\";
              } else {
                if (n.cc) {
                  if (n.i) {
                    throw Error("private track in notepad unsupported, skipping");
                  }
                  p = d.filename.ic + "\\";
                } else {
                  n.i && (p = d.filename.rc + "\\");
                }
              }
              a.file("" + p + q, b.serializeToString(n.data));
            } catch (v) {
              O.error(d.log.qb(T(n.url)), {Lc:v, file:n});
            }
          });
          c = Object.keys(a.files).length;
          if (!c) {
            return O.error(d.log.fc), m["return"](null);
          }
          O.log(d.log.gb(c));
          return D(m, a.generateAsync({type:"blob", compression:"DEFLATE", compressionOptions:{level:6}}), 3);
        }
        l = m.f;
        O.log(d.log.done);
        return m["return"](l);
      });
    }
    var X, U, Y, V, L, G, M, da, O, oa, pa;
    return S(function(H) {
      if (1 == H.a) {
        return X = function() {
          this.A = k();
        }, X.prototype.warn = function(a, b) {
          this.ga(a, b, "#c8c417", console.warn, !0);
        }, X.prototype.error = function(a, b) {
          this.ga(a, b, "red", console.error, !0);
        }, X.prototype.log = function(a, b) {
          this.ga(a, b, "#333", console.log, !1);
        }, X.prototype.ga = function(a, b, f, c, l) {
          this.A.show();
          c(a, null != b ? b : "");
          a = k('<li style="color: ' + f + ' !important">').text((new Date).toLocaleString() + " : " + a).appendTo(this.A.find("ul"));
          if (l && b) {
            try {
              a = k('<li style="color: gray !important" class="gray" >').text(b instanceof Error ? d.Vb(b.message) : d.Ub(JSON.stringify(b, null, " "))).appendTo(this.A.find("ul"));
            } catch (m) {
            }
          }
          if (b = a[0].offsetTop) {
            a.closest(".log-container")[0].scrollTop = b;
          }
        }, U = function(a) {
          function b(c) {
            function l() {
              n.prop("checked") ? q.prop("disabled", !1).parent().removeClass("disabled") : q.prop("checked", !1).prop("disabled", !0).parent().addClass("disabled");
            }
            var m = "#gpd-" + c;
            c = ".gpd-" + c;
            var n = f.h.find(m), q = f.h.find(c).not(m);
            n.on("change", l);
            l();
          }
          var f = X.call(this) || this;
          f.j = null;
          k(".down-log-parent").remove();
          f.A = k('\n                <div class="down-log-parent">\n                    <div class="block-background"/>\n                    <div class="down-log dropdown-menu on-top">\n                        <h4>' + d.c.ta + '</h4>\n                        <div class="line">\n                            <span>' + d.c.za + '</span>\n                            <label><input id="gpd-cpt" class="gpd-cpt" type="checkbox"/>' + d.c.J + '<span/></label>\n                            \x3c!--<label><input id="gpd-cpd" class="gpd-cpt" type="checkbox"/>' + 
          d.c.I + '<span/></label>--\x3e\n                            <label><input id="gpd-cpp" class="gpd-cpt" type="checkbox"/>' + d.c.H + '<span/></label>\n                        </div>\n                        <div class="line">\n                            <span>' + d.c.xa + '</span>\n                            <label><input id="gpd-crt" class="gpd-crt" type="checkbox"/>' + d.c.J + '<span/></label>\n                            \x3c!--<label><input id="gpd-crd" class="gpd-crt" type="checkbox"/>' + 
          d.c.I + '<span/></label>--\x3e\n                            <label><input id="gpd-crp" class="gpd-crt" type="checkbox"/>' + d.c.H + '<span/></label>\n                        </div>\n                        <div class="line">\n                            <span>' + d.c.wa + '</span>\n                            <label><input id="gpd-cnt" class="gpd-cnt" type="checkbox"/>' + d.c.J + '<span/></label>\n                            \x3c!--<label><input id="gpd-cnd" class="gpd-cnt" type="checkbox"/>' + 
          d.c.I + '<span/></label>--\x3e\n                            <label><input id="gpd-cnp" class="gpd-cnt" type="checkbox"/>' + d.c.H + '<span/></label>\n                        </div>\n                        <div class="line">\n                            <span>' + d.c.ua + '</span>\n                            <label><input id="gpd-cgt" class="gpd-cgt" type="checkbox"/>' + d.c.J + '<span/></label>\n                            \x3c!--<label><input id="gpd-cgd" class="gpd-cgt" type="checkbox"/>' + 
          d.c.I + '<span/></label>--\x3e\n                            <label><input id="gpd-cgp" class="gpd-cgt" type="checkbox"/>' + d.c.H + '<span/></label>\n                        </div>\n                        <div class="line">\n                            <span>' + d.c.ya + '</span>\n                            <label><input id="gpd-cgpt" class="gpd-cgpt" type="checkbox"/>' + d.c.J + '<span/></label>\n                            \x3c!--<label><input id="gpd-cgpd" class="gpd-cgpt" type="checkbox"/>' + 
          d.c.I + '<span/></label>--\x3e\n                            <label><input id="gpd-cgpp" class="gpd-cgpt" type="checkbox"/>' + d.c.H + '<span/></label>\n                        </div>\n                        <div class="line">\n                            <div style="float: right">\n                                <button type="button" class="download-btn btn btn-default">' + d.c.qa + '</button>\n                                <button type="button" class="close-btn btn btn-primary">' + 
          d.c.oa + '</button>\n                            </div>\n                        </div>\n                        <div class="line log-container">\n                            <ul/>\n                        </div>\n                    </div>\n                </div>').hide().appendTo(a);
          f.h = f.A.find(".down-log");
          f.m = f.h.find(".download-btn");
          b("cpt");
          b("crt");
          b("cnt");
          b("cgt");
          b("cgpt");
          return f;
        }, ka(U, X), U.prototype.Za = function() {
          this.h.removeClass("download-error");
          this.h.addClass("download-pending");
          this.m.prop("orig-text", this.m.text()).text(d.c.ra);
        }, U.prototype.dc = function() {
          return this.h.hasClass("download-pending");
        }, U.prototype.Ya = function() {
          this.h.removeClass("download-error");
          this.h.removeClass("download-pending");
          this.m.text(this.m.prop("orig-text"));
        }, U.prototype.Xa = function() {
          this.h.addClass("download-error");
          this.h.removeClass("download-pending");
          this.m.text(this.m.prop("orig-text"));
        }, Y = function(a) {
          function b() {
            var c = 0;
            f.h.find("input:checked").get().forEach(function(l) {
              return c += k(l).prop("remote-cnt") || 0;
            });
            f.m.prop("dowload-cnt", c);
            f.m.text(d.c.sa(c));
          }
          var f = U.call(this, a) || this;
          f.m.on("click", function() {
            return f.download();
          });
          f.h.find(".close-btn").on("click", function() {
            return f.close();
          });
          f.h.find("input").on("change", b);
          b();
          return f;
        }, ka(Y, U), Y.prototype.open = function() {
          var a = this, b, f, c, l, m, n, q, p, v, u, F, z, B, J, I;
          return S(function(t) {
            switch(t.a) {
              case 1:
                return t.K = 2, a.Za(), a.log(d.log.kb), b = da.children("a").first().text().trim(), a.j = new L(b, a), f = function(C) {
                  return C.reduce(function(P, R) {
                    return P + (R.oc || 0);
                  }, 0);
                }, c = function(C, P, R) {
                  P -= R;
                  var Fa = d.c.pa(P, R);
                  C = a.h.find("#gpd-" + C);
                  C.parent().find("span").text(Fa);
                  C.prop("remote-cnt", P);
                  C.prop("cached-cnt", R);
                }, D(t, a.j.Ac()["catch"](function(C) {
                  return console.warn(C);
                }), 4);
              case 4:
                debugger;
                return D(t, a.j.Mb(), 5);
              case 5:
                return l = t.f, a.ea = l.filter(function(C) {
                  return !C.i;
                }), D(t, M.L(a.ea), 6);
              case 6:
                return m = t.f, c("cpt", a.ea.length, m.length), c("cpp", f(a.ea), f(m)), a.ca = l.filter(function(C) {
                  return C.i;
                }), D(t, M.L(a.ca), 7);
              case 7:
                n = t.f;
                c("crt", a.ca.length, n.length);
                c("crp", f(a.ca), f(n));
                debugger;
                q = a;
                return D(t, a.j.Sa(), 8);
              case 8:
                return q.M = t.f, D(t, M.L(a.M), 9);
              case 9:
                return p = t.f, c("cnt", a.M.length, p.length), c("cnp", f(a.M), f(p)), D(t, a.j.Kb(), 10);
              case 10:
                return v = t.f, u = v.filter(function(C) {
                  return !C.i;
                }), F = a, D(t, a.j.Ra(u), 11);
              case 11:
                return F.da = t.f, D(t, M.L(a.da), 12);
              case 12:
                return z = t.f, c("cgt", a.da.length, z.length), c("cgp", f(a.da), f(z)), a.la = v.filter(function(C) {
                  return C.i;
                }), B = a, D(t, a.j.Ra(a.la), 13);
              case 13:
                return B.ba = t.f, D(t, M.L(a.ba), 14);
              case 14:
                J = t.f;
                c("cgpt", a.ba.length, J.length);
                c("cgpp", f(a.ba), f(J));
                a.Ya();
                wa(t);
                break;
              case 2:
                I = xa(t), O.error(d.log.error, I), a.Xa();
              case 3:
                t.a = 0;
            }
          });
        }, Y.prototype.close = function() {
          this.dc() ? alert(d.Va.Fa) : this.A.hide();
        }, Y.prototype.P = function(a) {
          var b = this.A.find("#gpd-" + a);
          console.assert(b.length, d.log.Xb(a));
          return !!b.prop("checked");
        }, Y.prototype.download = function() {
          var a = this, b, f, c, l, m, n, q, p, v, u, F, z, B, J, I;
          return S(function(t) {
            switch(t.a) {
              case 1:
                t.K = 2;
                a.Za();
                b = [];
                if (!a.P("cpt")) {
                  t.a = 4;
                  break;
                }
                a.log(d.log.Sb);
                f = b;
                c = f.concat;
                return D(t, a.j.O(a.ea), 5);
              case 5:
                b = c.call(f, t.f);
              case 4:
                if (!a.P("crt")) {
                  t.a = 6;
                  break;
                }
                a.log(d.log.Rb);
                l = b;
                m = l.concat;
                return D(t, a.j.O(a.ca), 7);
              case 7:
                b = m.call(l, t.f);
              case 6:
                if (!a.P("cnt")) {
                  t.a = 8;
                  break;
                }
                a.log(d.log.Qb);
                n = b;
                q = n.concat;
                return D(t, a.j.Lb(), 9);
              case 9:
                b = q.call(n, t.f.map(function(C) {
                  return Object.assign({}, C, {cc:!0});
                }));
              case 8:
                if (!a.P("cgt")) {
                  t.a = 10;
                  break;
                }
                a.log(d.log.Ob);
                p = b;
                v = p.concat;
                return D(t, a.j.Jb(a.da), 11);
              case 11:
                b = v.call(p, t.f);
              case 10:
                if (!a.P("cgpt")) {
                  t.a = 12;
                  break;
                }
                a.log(d.log.Pb);
                u = b;
                F = u.concat;
                return D(t, a.j.O(a.ba), 13);
              case 13:
                b = F.call(u, t.f);
              case 12:
                a.log(d.log.lc);
                if (!b.length) {
                  throw Error(d.log.hc);
                }
                return D(t, Ea(b), 15);
              case 15:
                z = t.f, B = b.reduce(function(C, P) {
                  return C || !!P.i;
                }, !1), J = W(a.j.l), B && (J = J + " " + d.filename.Ic), Z(z, J);
              case 14:
                a.Ya();
                wa(t);
                break;
              case 2:
                I = xa(t), O.error(d.log.error, I), a.Xa();
              case 3:
                t.a = 0;
            }
          });
        }, V = function() {
          this.db = new A("gpsies_tracks");
          this.nc = new A("gpsies_photos");
          this.mc = new A("gpsies_pages");
        }, V.prototype.Wb = function() {
          var a = this;
          return S(function(b) {
            return 1 == b.a ? D(b, a.db.info().then(function(f) {
              return console.log(f);
            })["catch"](function(f) {
              return console.warn(f);
            }).then(function() {
              return a.db.createIndex({index:{fields:["isPrivate"]}});
            })["catch"](function(f) {
              return console.warn(f);
            }), 2) : 3 != b.a ? D(b, a.nc.info().then(function(f) {
              return console.log(f);
            })["catch"](function(f) {
              return console.warn(f);
            }), 3) : D(b, a.mc.info().then(function(f) {
              return console.log(f);
            })["catch"](function(f) {
              return console.warn(f);
            }), 0);
          });
        }, V.prototype.Wa = function(a, b, f, c) {
          var l = this, m, n, q, p, v, u;
          return S(function(F) {
            f = f || {url:a};
            m = new h;
            n = T(a);
            q = {Aa:n, W:c, Y:new Date, filename:b.filename, Ga:K.compressToUTF16(b.Ha)};
            p = {};
            try {
              var z = b.data, B = z.querySelector("gpx > metadata");
              p.name = k(B.querySelector("name")).text();
              p.Ea = k(B.querySelector("author > name")).text();
              p.F = new Date(k(B.querySelector("time")).text());
              p.F && !r(p.F) && (p.F = void 0, m.add(d.log.Zb));
              p.length = parseFloat(k(B.querySelector("extensions > trackLengthMeter")).text()) || void 0;
              p.Ba = parseFloat(k(B.querySelector("extensions > totalAscentMeter")).text()) || void 0;
              p.Na = parseFloat(k(B.querySelector("extensions > totalDescentMeter")).text()) || void 0;
              try {
                var J = z.querySelectorAll("gpx > trk > trkseg > trkpt > time");
                if (J.length) {
                  var I = k(J[0]).text();
                  if ("2010-01-01T00:00:00Z" !== I) {
                    var t = k(J[J.length - 1]).text(), C = new Date(I), P = new Date(t);
                    r(C) && r(P) ? (p.La = C, p.Ka = P) : (m.add(d.log.Yb(I, t)), p.Ma = I, p.Ia = t);
                  }
                } else {
                  m.add(d.log.gc);
                }
              } catch (R) {
                m.add(d.log.sb, R);
              }
            } catch (R) {
              m.add(d.log.Gb, R);
            }
            v = m.qc();
            v.length && (p.s = v);
            u = Object.assign({}, q, p, f);
            c && (u.W = c);
            return F["return"](l.uc(u));
          });
        }, V.prototype.uc = function(a) {
          var b = this, f;
          return S(function(c) {
            f = {_id:a.Aa, _rev:a.W, ascent:a.Ba, author:a.Ea, dataCompressed:a.Ga, date:a.F, dateEndText:a.Ia, dateRefresh:a.Y, dateTrackEnd:a.Ka, dateTrackStart:a.La, dateTrackStartText:a.Ma, descent:a.Na, editedDate:a.o, errors:a.s, filename:a.filename, flags:a.flags, isPrivate:a.i, uname:a.l, length:a.length, name:a.name, sourceType:a.fa, uploadDate:a.V, url:a.url};
            return c["return"](b.db.put(f)["catch"](function(l) {
              return console.warn(d.log.Cb(JSON.stringify(a, null, " ")), l);
            }));
          });
        }, V.prototype.Qa = function(a) {
          var b = this;
          return S(function(f) {
            return f["return"](b.db.get(a).then(function(c) {
              var l = c.dataCompressed, m = K.decompressFromUTF16(l);
              c = {Aa:c._id, W:c._rev, Ba:c.ascent, Ea:c.author, Ga:l, F:c.date && new Date(c.date), Ia:c.dateEndText, Y:new Date(c.dateRefresh), Ka:c.dateTrackEnd, La:c.dateTrackStart, Ma:c.dateTrackStartText, Na:c.descent, o:c.editedDate, s:c.errors, filename:c.filename, flags:c.flags, i:c.isPrivate, l:c.uname, length:c.length, name:c.name, fa:c.sourceType, V:c.uploadDate, url:c.url, data:(new DOMParser).parseFromString(m, "text/xml"), Ha:m};
              debugger;
              console.assert(!c.F || r(c.F));
              console.assert(!c.Y || r(c.Y));
              return c;
            }));
          });
        }, V.prototype.L = function(a) {
          var b, f;
          return S(function(c) {
            if (1 == c.a) {
              return b = a.map(function(l) {
                return T(l.url);
              }), D(c, M.db.find({selector:{_id:{$in:b}}, fields:["_id"]}), 2);
            }
            f = c.f;
            return c["return"]((f && f.docs || []).map(function(l) {
              return l._id;
            }));
          });
        }, V.prototype.sync = function(a, b) {
          return S(function(f) {
            return f["return"](a.replicate.to(b, {live:!0, retry:!0}).on("change", function(c) {
              return console.info(b + " sync: changed: direction:" + c.direction + ", written:" + (c.change && c.change.docs_written) + ', errors:"' + (c.change && JSON.stringify(c.change.errors || "")) + '"');
            }).on("denied", function(c) {
              return console.warn(b + " sync: denied", c);
            }).on("complete", function(c) {
              return console.info(b + " sync: complete: " + JSON.stringify(c));
            }).on("error", function(c) {
              return console.warn(b + " sync: error", c);
            }));
          });
        }, L = function(a, b) {
          this.g = b;
          this.l = a;
          this.Z = 0;
          this.eb = 10;
          this.va = 200;
        }, L.prototype.Lb = function() {
          var a = this, b;
          return S(function(f) {
            if (1 == f.a) {
              return D(f, a.Sa(), 2);
            }
            b = f.f;
            return f["return"](a.O(b));
          });
        }, L.prototype.Jb = function(a) {
          var b = this, f, c, l, m, n, q, p, v, u, F;
          return S(function(z) {
            switch(z.a) {
              case 1:
                f = {}, a.forEach(function(B) {
                  return f[B.group.aa] = (f[B.group.aa] || []).concat(B);
                }), c = [], l = ba(Object.keys(f)), m = l.next();
              case 2:
                if (m.done) {
                  z.a = 4;
                  break;
                }
                n = m.value;
                q = f[n];
                p = ba(q);
                v = p.next();
              case 5:
                if (v.done) {
                  m = l.next();
                  z.a = 2;
                  break;
                }
                u = v.value;
                return D(z, b.O([u]), 8);
              case 8:
                F = z.f;
                F.length && c.push(Object.assign({}, F[0], {group:u.group}));
                v = p.next();
                z.a = 5;
                break;
              case 4:
                return z["return"](c);
            }
          });
        }, L.prototype.O = function(a) {
          var b = this, f, c, l, m;
          return S(function(n) {
            if (1 == n.a) {
              return D(n, M.L(a), 2);
            }
            f = n.f;
            c = Promise.resolve();
            l = [];
            for (m = {C:0}; m.C < a.length; m = {B:m.B, G:m.G, C:m.C}, m.C++) {
              if (m.G = a[m.C], m.B = T(m.G.url), m.B) {
                if (!f.includes(m.B) && (b.Z += 1, b.Z >= b.va)) {
                  b.Z === b.va && b.g.warn(d.log.Gc(a.length - m.C));
                  continue;
                }
                c = c.then(function(q) {
                  return function() {
                    return b.Nb(q.B, q.G);
                  };
                }(m)).then(function(q) {
                  return function(p) {
                    b.g.log(d.log.mb(q.C, a.length, q.B));
                    l = l.concat(Object.assign({}, p, q.G));
                  };
                }(m))["catch"](function(q) {
                  return function(p) {
                    return b.g.warn(d.log.Dc(q.B), p);
                  };
                }(m));
              } else {
                b.g.error(d.log.ac, m.G);
              }
            }
            return n["return"](c.then(function() {
              return l;
            }));
          });
        }, L.prototype.Nb = function(a, b) {
          var f = this, c, l, m, n, q, p, v;
          return S(function(u) {
            switch(u.a) {
              case 1:
                return c = "//www.gpsies.com/download.do?fileId=" + a, m = "", u.K = 2, D(u, M.Qa(a), 4);
              case 4:
                l = u.f;
                m = l.W;
                n = b && b.o && b.o.getTime() || 0;
                q = (new Date(l.o)).getTime() || 0;
                if (n !== q) {
                  debugger;
                  f.g.log(d.log.vc(l.filename, b.o));
                  l = null;
                  u.a = 5;
                  break;
                }
                if (l.s && l.s.length) {
                  f.g.warn(d.log.Db(l.filename), l.s);
                  l = null;
                  u.a = 5;
                  break;
                }
                return D(u, M.Wa(c, l, b, m), 7);
              case 7:
                f.g.log(d.log.Tb(l.filename));
              case 5:
                wa(u);
                break;
              case 2:
                (p = xa(u)) && 404 !== p.status && (f.g.error(d.log.tb(c), p), l = void 0);
              case 3:
                if (l) {
                  u.a = 8;
                  break;
                }
                f.g.log(d.log.nb(c));
                v = Number(new Date);
                return D(u, Q(c).then(function(F) {
                  return M.Wa(c, F, b, m || void 0).then(function(z) {
                    return new Promise(function(B) {
                      setTimeout(function() {
                        return B(z);
                      }, Math.random() * Math.pow(15, 3) + Math.pow(15, 3) - (Number(new Date) - v));
                    });
                  })["catch"](function(z) {
                    return f.g.warn(d.log.Hb, z);
                  }).then(function(z) {
                    return M.Qa(z.id)["catch"](function(B) {
                      f.g.warn(d.log.wb, B);
                      return F;
                    });
                  });
                }), 9);
              case 9:
                l = u.f;
              case 8:
                return u["return"](Object.assign({}, l, b));
            }
          });
        }, L.prototype.Mb = function() {
          var a = this, b, f;
          return S(function(c) {
            if (1 == c.a) {
              if (a.ab) {
                c.a = 2;
                return;
              }
              b = "//www.gpsies.com/userList.do?username=" + a.l;
              f = a;
              return D(c, a.ja(b), 3);
            }
            2 != c.a && (f.ab = c.f);
            return c["return"](a.ab);
          });
        }, L.prototype.Sa = function() {
          var a = this, b, f;
          return S(function(c) {
            if (1 == c.a) {
              if (a.M) {
                c.a = 2;
                return;
              }
              b = "//www.gpsies.com/notepadList.do?username=" + a.l;
              f = a;
              return D(c, a.ja(b), 3);
            }
            2 != c.a && (f.M = c.f);
            return c["return"](a.M);
          });
        }, L.prototype.Ra = function(a) {
          var b = this, f, c;
          return S(function(l) {
            f = [];
            c = Promise.resolve();
            a.forEach(function(m) {
              c = c.then(function() {
                return b.ja("//www.gpsies.com/mapFolder.do?id=" + m.aa);
              }).then(function(n) {
                return f = f.concat(n.map(function(q) {
                  return Object.assign({}, q, {group:m});
                }));
              })["catch"](function(n) {
                return console.warn(d.log.ub(m.aa, n), n);
              });
            });
            return l["return"](c.then(function() {
              return f;
            }));
          });
        }, L.prototype.Kb = function() {
          var a = this, b, f;
          return S(function(c) {
            if (1 == c.a) {
              if (a.Ta) {
                c.a = 2;
                return;
              }
              b = function(l) {
                var m = l.find("td > h5 > a.btn-link");
                return {aa:l.find('h5 > a.btn-link[href*="mapFolder"]').attr("href").match(/id=([0-9]+)/)[1], name:m.text().trim(), Kc:m.closest("td").next("td:not(.text-right)").text().trim(), i:0 < l.find("a.btn-link > .fa-lock").length};
              };
              f = a;
              return D(c, a.ka("//www.gpsies.com/userFolder.do", 1, 100, b, []), 3);
            }
            2 != c.a && (f.Ta = c.f);
            return c["return"](a.Ta);
          });
        }, L.prototype.ja = function(a) {
          var b, f = this, c, l;
          return S(function(m) {
            b = b || f.eb;
            c = a.includes("/notepad");
            l = function(n) {
              var q = new G(n), p = {url:q.u(G.Hc, 3), l:c ? "" : f.l};
              try {
                var v = n.find("td > p.preview").closest("td"), u = n.find('td > a.btn-link[href*="mapUser.do?username"]').closest("td"), F = (c ? u : v).next("td"), z = F.next("td");
                p.flags = q.u(G.Ib, 2, n.find('td > img[src*="flags"]').parent());
                p.fa = q.u(G.Ec, 3, v);
                p.oc = q.u(G.pc, 3, v);
                p.i = c ? !1 : q.u(G.sc, 3, v);
                p.length = q.u(G.ec, c ? 5 : 4, F);
                p.V = q.u(G.Ja(/([0-9]+)[\.,]([0-9]+)[\.,]([0-9]+)/), c ? 6 : 5, z);
                p.o = q.u(G.Ja(/([0-9]+)[\.,]([0-9]+)[\.,]([0-9]+)\s([0-9]+):([0-9]+)\s*$/), c ? 6 : 5, z);
                c && (p.l = q.u(G.jc, 4, u));
              } catch (B) {
                f.g.log(d.log.Ab(B.message));
              }
              return p;
            };
            return m["return"](f.ka(a, 1, b, l, []));
          });
        }, L.prototype.ka = function(a, b, f, c, l) {
          var m = this;
          return S(function(n) {
            m.g.log(d.log.kc(a));
            return n["return"](new Promise(function(q, p) {
              return k.get(a).done(function(v) {
                try {
                  var u = k(v), F = u.find("#displayTable > tbody > tr").get().map(function(I) {
                    try {
                      return c(k(I));
                    } catch (t) {
                      m.g.error(d.log.zb, I);
                    }
                  }).filter(function(I) {
                    return !!I;
                  });
                  l = l.concat(F);
                  m.g.log(d.log.ib(F.length, l.length), F);
                  if (b >= f) {
                    m.g.warn(d.log.Fc(b)), q(l);
                  } else {
                    var z = a.match(/\/([a-zA-Z]+\.do)\?/), B = z && z[1];
                    console.assert(B, "empty action name");
                    var J = u.find('.pagination li > a:contains(">")[href^="' + (B || a) + '"]').first();
                    0 < J.length ? q(m.ka(J.attr("href"), b + 1, f, c, l)) : (m.g.log(d.log.lb(l.length), l), q(l));
                  }
                } catch (I) {
                  m.g.error(d.log.xb, I), q(l);
                }
              }).fail(function(v) {
                m.g.warn(d.log.vb(a), v);
                p(v);
              });
            }));
          });
        }, L.prototype.Ac = function() {
          return S(function(a) {
            return a["return"](new Promise(function(b, f) {
              e.Gpsies.setDisplayTablePageSize(100, function() {
                return b();
              });
              setTimeout(function() {
                return f(d.log.wc);
              }, 5000);
            }));
          });
        }, G = function(a, b) {
          this.cb = a;
          this.g = b;
        }, G.prototype.u = function(a, b, f) {
          var c = void 0, l = this.cb.find("td:nth-child(" + b + ")");
          try {
            f && (console.assert(f[0] === l[0], "wrong els", {pb:f[0], Jc:l[0]}), c = a(f)), null == c && (c = a(l));
          } catch (m) {
            this.g.error(d.log.Bb, {Nc:b, pb:f[0]});
          }
          return c;
        }, G.ec = function(a) {
          a = a.text().trim().replace(",", ".").split(" ")[0];
          a = Number.parseFloat(a);
          return null != a && !isNaN(a) && a || void 0;
        }, G.Ib = function(a) {
          return a.find('img[src*="flags"]').get().map(function(b) {
            return k(b).attr("src").trim();
          }).map(function(b) {
            return /flags\/([a-z]+)\./.exec(b);
          }).map(function(b) {
            return b && b[1];
          }).filter(function(b) {
            return !!b;
          });
        }, G.Ec = function(a) {
          a = a.children("span.label").first().text().trim();
          return a.includes("route planner") ? d.filename.zc : a.includes("Uploaded as") ? a.replace("Google Earth", "").replace("Uploaded as", "").replace(" Track ", "").trim() : a.replace("Uploaded by", "").replace(" GPSies ", "").trim();
        }, G.pc = function(a) {
          return Number.parseInt(a.children('img[src^="images/photo"]').get().map(function(b) {
            return /[0-9]+/.exec(k(b.nextSibling).text().trim());
          }).map(function(b) {
            return b && b[0];
          }).filter(function(b) {
            return !!b;
          })[0]) || void 0;
        }, G.sc = function(a) {
          return !!(a.find("h5 > a.btn-link").next("img").attr("src") || "").match(/\/lock\.png/);
        }, G.Ja = function(a) {
          return function(b) {
            a: {
              if (b = b.text().trim().match(a)) {
                var f = Number(b[3]), c = Number(b[2]) - 1, l = Number(b[1]), m = (b[4] || null) && Number(b[4]), n = (b[5] || null) && Number(b[5]);
                f = Number((70 > f ? "20" : 100 > f ? "19" : "ERROR") + f);
                if ((c = b && new Date(f, c, l, m, n) || void 0) && !r(c)) {
                  debugger;
                  console.warn(d.log.$b, b);
                } else {
                  b = c;
                  break a;
                }
              }
              b = void 0;
            }
            return b;
          };
        }, G.jc = function(a) {
          return (a = a.find("a.btn-link").attr("href").match(/username=(.+)(&|$)/)) && a[1] || void 0;
        }, G.Hc = function(a) {
          return a.find("h5 > a").attr("href");
        }, M = new V, D(H, M.Wb(), 2);
      }
      da = k(".dropdown-toggle.bg-hover-color > i").closest(".dropdown");
      O = new Y(da.closest("body"));
      oa = da.find(".dropdown-menu > li").last();
      oa.hasClass("downl") || (pa = k('<li class="downl"><a href="#" class="bg-hover-color">' + d.c.Ua + "</a></li>"), pa.find("a").on("click", function() {
        return S(function(a) {
          O.open();
          a.a = 0;
        });
      }), oa.after(pa));
      H.a = 0;
    });
  };
})(window);
(function(e) {
  e.waitScripts([{url:"//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js", check:function() {
    return e.jQuery;
  }}, {url:"https://unpkg.com/pouchdb@7.1.1/dist/pouchdb.js", check:function() {
    return e.PouchDB;
  }}, {url:"//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js", check:function() {
    return e.JSZip;
  }}, {url:"//cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js", check:function() {
    return e.saveAs;
  }}, {url:"//cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js", check:function() {
    return e.LZString;
  }}]).then(function() {
    return new Promise(function(h) {
      return setTimeout(h, 300);
    });
  }).then(function() {
    return e.waitScripts([{url:"https://unpkg.com/pouchdb@7.1.1/dist/pouchdb.find.js", check:function() {
      return (new e.PouchDB("test")).createIndex;
    }}]);
  }).then(function() {
    return e.exportGpsies(e, e.jQuery, e.PouchDB, e.LZString, e.saveAs, e.JSZip);
  });
})(window);