// ==UserScript==
// @name        KAD & MKAD
// @namespace   Violentmonkey Scripts
// @match       https://www.online-perevozka.ru/tablica-rasstojanij.html*
// @grant       none
// @version     1.1
// @author      lincot
// @run-at      document-start
// @description 7/24/2024, 11:15:23 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/501707/KAD%20%20MKAD.user.js
// @updateURL https://update.greasyfork.org/scripts/501707/KAD%20%20MKAD.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  const scriptToReplace = 'app_y.min.js';
  const newScript = String.raw`
(function() {
    function B(h) {
        var c = !1;
        return function() {
            if (c) {
                throw Error("")
            }
            c = !0;
            h.apply(w, arguments)
        }
    }
    var D = {}, w, d;
    w = this;
    null != w && (d = w.async);
    D.noConflict = function() {
        w.async = d;
        return D
    }
    ;
    var g = Object.prototype.toString
      , j = Array.isArray || function(c) {
        return "[object Array]" === g.call(c)
    }
      , o = function(h, c) {
        if (h.forEach) {
            return h.forEach(c)
        }
        for (var k = 0; k < h.length; k += 1) {
            c(h[k], k, h)
        }
    }
      , H = function(h, c) {
        if (h.map) {
            return h.map(c)
        }
        var k = [];
        o(h, function(m, n, l) {
            k.push(c(m, n, l))
        });
        return k
    }
      , E = function(h, c, k) {
        if (h.reduce) {
            return h.reduce(c, k)
        }
        o(h, function(m, n, l) {
            k = c(k, m, n, l)
        });
        return k
    }
      , e = function(h) {
        if (Object.keys) {
            return Object.keys(h)
        }
        var c = [], k;
        for (k in h) {
            h.hasOwnProperty(k) && c.push(k)
        }
        return c
    };
    "undefined" !== typeof process && process.nextTick ? (D.nextTick = process.nextTick,
    D.setImmediate = "undefined" !== typeof setImmediate ? function(c) {
        setImmediate(c)
    }
    : D.nextTick) : (D.nextTick = "function" === typeof setImmediate ? function(c) {
        setImmediate(c)
    }
    : function(c) {
        setTimeout(c, 0)
    }
    ,
    D.setImmediate = D.nextTick);
    D.each = function(h, c, m) {
        function l(a) {
            a ? (m(a),
            m = function() {}
            ) : (k += 1,
            k >= h.length && m())
        }
        m = m || function() {}
        ;
        if (!h.length) {
            return m()
        }
        var k = 0;
        o(h, function(n) {
            c(n, B(l))
        })
    }
    ;
    D.forEach = D.each;
    D.eachSeries = function(h, c, m) {
        m = m || function() {}
        ;
        if (!h.length) {
            return m()
        }
        var l = 0
          , k = function() {
            c(h[l], function(a) {
                a ? (m(a),
                m = function() {}
                ) : (l += 1,
                l >= h.length ? m() : k())
            })
        };
        k()
    }
    ;
    D.forEachSeries = D.eachSeries;
    D.eachLimit = function(h, c, l, k) {
        F(c).apply(null, [h, l, k])
    }
    ;
    D.forEachLimit = D.eachLimit;
    var F = function(c) {
        return function(h, n, m) {
            m = m || function() {}
            ;
            if (!h.length || 0 >= c) {
                return m()
            }
            var l = 0
              , a = 0
              , k = 0;
            (function p() {
                if (l >= h.length) {
                    return m()
                }
                for (; k < c && a < h.length; ) {
                    a += 1,
                    k += 1,
                    n(h[a - 1], function(q) {
                        q ? (m(q),
                        m = function() {}
                        ) : (l += 1,
                        k -= 1,
                        l >= h.length ? m() : p())
                    })
                }
            }
            )()
        }
    }
      , b = function(a) {
        return function() {
            var c = Array.prototype.slice.call(arguments);
            return a.apply(null, [D.each].concat(c))
        }
    }
      , C = function(h, c) {
        return function() {
            var a = Array.prototype.slice.call(arguments);
            return c.apply(null, [F(h)].concat(a))
        }
    }
      , G = function(a) {
        return function() {
            var c = Array.prototype.slice.call(arguments);
            return a.apply(null, [D.eachSeries].concat(c))
        }
    }
      , x = function(h, c, m, l) {
        c = H(c, function(p, n) {
            return {
                index: n,
                value: p
            }
        });
        if (l) {
            var k = [];
            h(c, function(p, n) {
                m(p.value, function(q, a) {
                    k[p.index] = a;
                    n(q)
                })
            }, function(n) {
                l(n, k)
            })
        } else {
            h(c, function(p, n) {
                m(p.value, function(q) {
                    n(q)
                })
            })
        }
    };
    D.map = b(x);
    D.mapSeries = G(x);
    D.mapLimit = function(h, c, l, k) {
        return C(c, x)(h, l, k)
    }
    ;
    D.reduce = function(c, a, k, h) {
        D.eachSeries(c, function(l, m) {
            k(a, l, function(n, p) {
                a = p;
                m(n)
            })
        }, function(l) {
            h(l, a)
        })
    }
    ;
    D.inject = D.reduce;
    D.foldl = D.reduce;
    D.reduceRight = function(c, a, k, h) {
        c = H(c, function(l) {
            return l
        }).reverse();
        D.reduce(c, a, k, h)
    }
    ;
    D.foldr = D.reduceRight;
    var i = function(h, c, m, l) {
        var k = [];
        c = H(c, function(p, n) {
            return {
                index: n,
                value: p
            }
        });
        h(c, function(p, n) {
            m(p.value, function(a) {
                a && k.push(p);
                n()
            })
        }, function(n) {
            l(H(k.sort(function(q, p) {
                return q.index - p.index
            }), function(p) {
                return p.value
            }))
        })
    };
    D.filter = b(i);
    D.filterSeries = G(i);
    D.select = D.filter;
    D.selectSeries = D.filterSeries;
    i = function(h, c, m, l) {
        var k = [];
        c = H(c, function(p, n) {
            return {
                index: n,
                value: p
            }
        });
        h(c, function(p, n) {
            m(p.value, function(a) {
                a || k.push(p);
                n()
            })
        }, function(n) {
            l(H(k.sort(function(q, p) {
                return q.index - p.index
            }), function(p) {
                return p.value
            }))
        })
    }
    ;
    D.reject = b(i);
    D.rejectSeries = G(i);
    i = function(h, c, l, k) {
        h(c, function(n, m) {
            l(n, function(a) {
                a ? (k(n),
                k = function() {}
                ) : m()
            })
        }, function(m) {
            k()
        })
    }
    ;
    D.detect = b(i);
    D.detectSeries = G(i);
    D.some = function(c, a, h) {
        D.each(c, function(k, l) {
            a(k, function(m) {
                m && (h(!0),
                h = function() {}
                );
                l()
            })
        }, function(k) {
            h(!1)
        })
    }
    ;
    D.any = D.some;
    D.every = function(c, a, h) {
        D.each(c, function(k, l) {
            a(k, function(m) {
                m || (h(!1),
                h = function() {}
                );
                l()
            })
        }, function(k) {
            h(!0)
        })
    }
    ;
    D.all = D.every;
    D.sortBy = function(c, a, h) {
        D.map(c, function(k, l) {
            a(k, function(m, n) {
                m ? l(m) : l(null, {
                    value: k,
                    criteria: n
                })
            })
        }, function(l, k) {
            if (l) {
                return h(l)
            }
            h(null, H(k.sort(function(n, m) {
                var q = n.criteria
                  , p = m.criteria;
                return q < p ? -1 : q > p ? 1 : 0
            }), function(m) {
                return m.value
            }))
        })
    }
    ;
    D.auto = function(m, a) {
        a = a || function() {}
        ;
        var p = e(m)
          , n = p.length;
        if (!n) {
            return a()
        }
        var l = {}
          , q = []
          , h = function(c) {
            q.unshift(c)
        }
          , k = function() {
            n--;
            o(q.slice(0), function(c) {
                c()
            })
        };
        h(function() {
            if (!n) {
                var c = a;
                a = function() {}
                ;
                c(null, l)
            }
        });
        o(p, function(v) {
            var u = j(m[v]) ? m[v] : [m[v]]
              , s = function(y) {
                var t = Array.prototype.slice.call(arguments, 1);
                1 >= t.length && (t = t[0]);
                if (y) {
                    var A = {};
                    o(e(l), function(I) {
                        A[I] = l[I]
                    });
                    A[v] = t;
                    a(y, A);
                    a = function() {}
                } else {
                    l[v] = t,
                    D.setImmediate(k)
                }
            }
              , z = u.slice(0, Math.abs(u.length - 1)) || []
              , r = function() {
                return E(z, function(y, t) {
                    return y && l.hasOwnProperty(t)
                }, !0) && !l.hasOwnProperty(v)
            };
            if (r()) {
                u[u.length - 1](s, l)
            } else {
                var c = function() {
                    if (r()) {
                        var y = c
                          , t = 0;
                        y: for (; t < q.length; t += 1) {
                            if (q[t] === y) {
                                q.splice(t, 1);
                                break y
                            }
                        }
                        u[u.length - 1](s, l)
                    }
                };
                h(c)
            }
        })
    }
    ;
    D.retry = function(h, a, l) {
        var k = [];
        "function" === typeof h && (l = a,
        a = h,
        h = 5);
        h = parseInt(h, 10) || 5;
        var c = function(n, p) {
            for (var m = function(r, q) {
                return function(s) {
                    r(function(t, u) {
                        s(!t || q, {
                            err: t,
                            result: u
                        })
                    }, p)
                }
            }; h; ) {
                k.push(m(a, !(h -= 1)))
            }
            D.series(k, function(r, q) {
                q = q[q.length - 1];
                (n || l)(q.err, q.result)
            })
        };
        return l ? c() : c
    }
    ;
    D.waterfall = function(c, a) {
        a = a || function() {}
        ;
        if (!j(c)) {
            return a(Error("First argument to waterfall must be an array of functions"))
        }
        if (!c.length) {
            return a()
        }
        var h = function(k) {
            return function(l) {
                if (l) {
                    a.apply(null, arguments),
                    a = function() {}
                } else {
                    var m = Array.prototype.slice.call(arguments, 1)
                      , n = k.next();
                    n ? m.push(h(n)) : m.push(a);
                    D.setImmediate(function() {
                        k.apply(null, m)
                    })
                }
            }
        };
        h(D.iterator(c))()
    }
    ;
    var f = function(h, c, l) {
        l = l || function() {}
        ;
        if (j(c)) {
            h.map(c, function(n, m) {
                n && n(function(p) {
                    var q = Array.prototype.slice.call(arguments, 1);
                    1 >= q.length && (q = q[0]);
                    m.call(null, p, q)
                })
            }, l)
        } else {
            var k = {};
            h.each(e(c), function(m, n) {
                c[m](function(a) {
                    var p = Array.prototype.slice.call(arguments, 1);
                    1 >= p.length && (p = p[0]);
                    k[m] = p;
                    n(a)
                })
            }, function(m) {
                l(m, k)
            })
        }
    };
    D.parallel = function(c, a) {
        f({
            map: D.map,
            each: D.each
        }, c, a)
    }
    ;
    D.parallelLimit = function(h, c, k) {
        f({
            map: C(c, x),
            each: F(c)
        }, h, k)
    }
    ;
    D.series = function(c, a) {
        a = a || function() {}
        ;
        if (j(c)) {
            D.mapSeries(c, function(l, k) {
                l && l(function(m) {
                    var n = Array.prototype.slice.call(arguments, 1);
                    1 >= n.length && (n = n[0]);
                    k.call(null, m, n)
                })
            }, a)
        } else {
            var h = {};
            D.eachSeries(e(c), function(l, k) {
                c[l](function(m) {
                    var n = Array.prototype.slice.call(arguments, 1);
                    1 >= n.length && (n = n[0]);
                    h[l] = n;
                    k(m)
                })
            }, function(k) {
                a(k, h)
            })
        }
    }
    ;
    D.iterator = function(h) {
        var c = function(k) {
            var a = function() {
                h.length && h[k].apply(null, arguments);
                return a.next()
            };
            a.next = function() {
                return k < h.length - 1 ? c(k + 1) : null
            }
            ;
            return a
        };
        return c(0)
    }
    ;
    D.apply = function(h) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function() {
            return h.apply(null, c.concat(Array.prototype.slice.call(arguments)))
        }
    }
    ;
    i = function(h, c, m, l) {
        var k = [];
        h(c, function(p, n) {
            m(p, function(q, r) {
                k = k.concat(r || []);
                n(q)
            })
        }, function(n) {
            l(n, k)
        })
    }
    ;
    D.concat = b(i);
    D.concatSeries = G(i);
    D.whilst = function(c, a, h) {
        c() ? a(function(k) {
            if (k) {
                return h(k)
            }
            D.whilst(c, a, h)
        }) : h()
    }
    ;
    D.doWhilst = function(c, a, h) {
        c(function(l) {
            if (l) {
                return h(l)
            }
            var k = Array.prototype.slice.call(arguments, 1);
            a.apply(null, k) ? D.doWhilst(c, a, h) : h()
        })
    }
    ;
    D.until = function(c, a, h) {
        c() ? h() : a(function(k) {
            if (k) {
                return h(k)
            }
            D.until(c, a, h)
        })
    }
    ;
    D.doUntil = function(c, a, h) {
        c(function(l) {
            if (l) {
                return h(l)
            }
            var k = Array.prototype.slice.call(arguments, 1);
            a.apply(null, k) ? h() : D.doUntil(c, a, h)
        })
    }
    ;
    i = function(c) {
        return function(a) {
            var h = Array.prototype.slice.call(arguments, 1);
            a.apply(null, h.concat([function(k) {
                var l = Array.prototype.slice.call(arguments, 1);
                "undefined" !== typeof console && (k ? console.error && console.error(k) : console[c] && o(l, function(m) {
                    console[c](m)
                }))
            }
            ]))
        }
    }
    ;
    D.log = i("log");
    D.dir = i("dir");
    D.memoize = function(h, a) {
        var l = {}
          , k = {};
        a = a || function(c) {
            return c
        }
        ;
        var m = function() {
            var q = Array.prototype.slice.call(arguments)
              , p = q.pop()
              , n = a.apply(null, q);
            n in l ? D.nextTick(function() {
                p.apply(null, l[n])
            }) : n in k ? k[n].push(p) : (k[n] = [p],
            h.apply(null, q.concat([function() {
                l[n] = arguments;
                var s = k[n];
                delete k[n];
                for (var r = 0, t = s.length; r < t; r++) {
                    s[r].apply(null, arguments)
                }
            }
            ])))
        };
        m.memo = l;
        m.unmemoized = h;
        return m
    }
    ;
    D.unmemoize = function(c) {
        return function() {
            return (c.unmemoized || c).apply(null, arguments)
        }
    }
    ;
    D.times = function(m, a, l) {
        for (var k = [], h = 0; h < m; h++) {
            k.push(h)
        }
        return D.map(k, a, l)
    }
    ;
    D.timesSeries = function(m, a, l) {
        for (var k = [], h = 0; h < m; h++) {
            k.push(h)
        }
        return D.mapSeries(k, a, l)
    }
    ;
    D.seq = function() {
        var a = arguments;
        return function() {
            var c = this
              , k = Array.prototype.slice.call(arguments)
              , h = k.pop();
            D.reduce(a, k, function(l, m, n) {
                m.apply(c, l.concat([function() {
                    var q = arguments[0]
                      , p = Array.prototype.slice.call(arguments, 1);
                    n(q, p)
                }
                ]))
            }, function(l, m) {
                h.apply(c, [l].concat(m))
            })
        }
    }
    ;
    D.compose = function() {
        return D.seq.apply(null, Array.prototype.reverse.call(arguments))
    }
    ;
    i = function(k, h) {
        var l = function() {
            var n = this
              , p = Array.prototype.slice.call(arguments)
              , a = p.pop();
            return k(h, function(q, c) {
                q.apply(n, p.concat([c]))
            }, a)
        };
        if (2 < arguments.length) {
            var m = Array.prototype.slice.call(arguments, 2);
            return l.apply(this, m)
        }
        return l
    }
    ;
    D.applyEach = b(i);
    D.applyEachSeries = G(i);
    D.forever = function(h, c) {
        function k(a) {
            if (a) {
                if (c) {
                    return c(a)
                }
                throw a
            }
            h(k)
        }
        k()
    }
    ;
    "undefined" !== typeof module && module.exports ? module.exports = D : "undefined" !== typeof define && define.amd ? define([], function() {
        return D
    }) : w.async = D
}
)();
var kad_poly = [[60.095536, 30.254934], [60.091452, 30.368123], [60.062202, 30.387087], [60.048768, 30.419977], [60.045538, 30.430528], [60.040465, 30.438458], [60.019448, 30.456463], [60.017484, 30.460783], [59.982901, 30.501907], [59.982089, 30.509338], [59.976065, 30.535800], [59.946145, 30.540758], [59.916007, 30.525641], [59.892010, 30.523934], [59.854671, 30.504745], [59.853379, 30.479584], [59.830996, 30.442744], [59.816374, 30.382509], [59.815507, 30.372902], [59.811108, 30.323690], [59.834057, 30.279238], [59.834413, 30.269397], [59.799640, 30.156503], [59.816074, 30.075059], [59.820690, 29.992993], [59.814940, 29.927290], [59.812778, 29.883753], [59.825561, 29.827041], [59.859558, 29.801486], [59.869088, 29.766911], [59.887229, 29.676096], [59.926411, 29.667351], [60.014065, 29.719567], [60.038973, 29.976641], [60.058717, 30.143604], [60.095536, 30.254934]]
  , kad_b_junctions = [[60.095536, 30.254934], [60.091452, 30.368123], [60.062202, 30.387087], [60.048768, 30.419977], [60.045538, 30.430528], [60.040465, 30.438458], [60.019448, 30.456463], [60.017484, 30.460783], [59.982901, 30.501907], [59.982089, 30.509338], [59.976065, 30.535800], [59.946145, 30.540758], [59.916007, 30.525641], [59.892010, 30.523934], [59.854671, 30.504745], [59.853379, 30.479584], [59.830996, 30.442744], [59.816374, 30.382509], [59.815507, 30.372902], [59.811108, 30.323690], [59.834057, 30.279238], [59.834413, 30.269397], [59.799640, 30.156503], [59.816074, 30.075059], [59.820690, 29.992993], [59.814940, 29.927290], [59.812778, 29.883753], [59.825561, 29.827041], [59.859558, 29.801486], [59.869088, 29.766911], [59.887229, 29.676096], [59.926411, 29.667351], [60.014065, 29.719567], [60.038973, 29.976641], [60.058717, 30.143604]],
  mkad_poly = [[55.77682929150693, 37.8427186924053], [55.77271261339107, 37.843152686304705], [55.738276896644805, 37.84134161820584], [55.71399689835854, 37.83813880871875], [55.699921267680175, 37.83078428272048], [55.6962950504132, 37.82954151435689], [55.6928207993758, 37.82931794772561], [55.6892209716432, 37.829854389528585], [55.66165146026852, 37.83966290527148], [55.658376283618054, 37.8394483285503], [55.65605007409182, 37.838791290011436], [55.6531141363056, 37.8370746762419], [55.65145113826342, 37.83568956934368], [55.64812656859308, 37.8314409502641], [55.644824797922006, 37.82628977266418], [55.625585595616016, 37.79678983996685], [55.62124956968963, 37.78912615774818], [55.60391627214637, 37.75711862597196], [55.59919459324873, 37.74706053825473], [55.59180719241245, 37.72946947797549], [55.588836348363664, 37.7225364780563], [55.575884202346515, 37.68793829096614], [55.57326575851499, 37.679926824757885], [55.57229316496271, 37.67458386440024], [55.571916278457984, 37.66924090404256], [55.57203486325925, 37.66469310778763], [55.576012618166274, 37.59661654265479], [55.576997275315456, 37.58977417112674], [55.593461027106216, 37.52076943829923], [55.5950406236937, 37.51480420545011], [55.59619490389248, 37.51175721600919], [55.597166902872914, 37.509675821813644], [55.59866130413232, 37.50692923978237], [55.59992481831982, 37.505169710668625], [55.60066420884299, 37.50419141558768], [55.61116763612223, 37.491928885586624], [55.638875974823236, 37.459586882490854], [55.659861822998046, 37.43484779763937], [55.66403637567329, 37.43088149929608], [55.68274170580392, 37.41690766704496], [55.68445104083821, 37.41598498714383], [55.68864009415873, 37.41437258409716], [55.69086356292832, 37.41284823307507], [55.69271798296722, 37.41115307697766], [55.694411609835676, 37.40906103948314], [55.69633857479258, 37.40646466115671], [55.70821582138647, 37.39042283284293], [55.709960382334486, 37.388470184680074], [55.71100223559, 37.387526047106846], [55.714297215701556, 37.38550902592765], [55.74299678995391, 37.37085040270776], [55.74737891548303, 37.3693383084583], [55.749835763080554, 37.36897352803228], [55.78212184948561, 37.36975523402037], [55.78471424142089, 37.370104443868414], [55.7865400068638, 37.370812547048324], [55.789647237893845, 37.37287248357179], [55.80029924148098, 37.38296043585071], [55.804902293956964, 37.38656302639442], [55.80873309836682, 37.38838692852456], [55.83469933158447, 37.39616684582014], [55.838100191970035, 37.39588770506112], [55.84068411346117, 37.394943567487864], [55.844347068377, 37.39240249367216], [55.84601308639975, 37.391908967213396], [55.847449667553015, 37.39193042488553], [55.84921212285334, 37.39242395134426], [55.85763645302826, 37.39690455309926], [55.860737839006916, 37.39879032715197], [55.862584159418496, 37.40035673721667], [55.864949251589444, 37.40273853882189], [55.86706126571094, 37.40537841047629], [55.869498474258364, 37.40936953749045], [55.871054829060206, 37.412373611587114], [55.87204410730281, 37.41473395552023], [55.87320337129219, 37.41764120434771], [55.875543687912774, 37.424979728212456], [55.8813305362832, 37.44392953059815], [55.88207002762898, 37.44778576813208], [55.882588650864065, 37.452763948063726], [55.88275750343904, 37.46081057510839], [55.88292635527642, 37.464286717991705], [55.883384663688354, 37.46735516510474], [55.88551934442368, 37.47628155670629], [55.888075982000466, 37.48647395096288], [55.88926982558072, 37.49010029755102], [55.89215178082288, 37.496623429875235], [55.904441104424826, 37.52475156556294], [55.90586346265124, 37.529643914806094], [55.90676747666915, 37.53442897568867], [55.90726166205295, 37.538141152965274], [55.910865408147124, 37.57275237809345], [55.911022085130945, 37.57652892838642], [55.91097387689595, 37.579554460155215], [55.91063641756565, 37.58356704484148], [55.90998559481434, 37.587579629527774], [55.9092021825094, 37.5910986877553], [55.90847901858254, 37.593480489360545], [55.901901172883115, 37.6180182383294], [55.89891144249577, 37.63301715114069], [55.89687395332799, 37.64762982585381], [55.89576474245468, 37.659367172502996], [55.89456572248885, 37.69416117435827], [55.89393874366838, 37.699139354289926], [55.89328763950915, 37.70195030933754], [55.89247977280019, 37.70471834904089], [55.89140661030458, 37.70757221943274], [55.880130573679516, 37.73042464023962], [55.8304865952908, 37.8268977445699], [55.829001074066674, 37.82968724194538], [55.82757588633297, 37.831725720796705], [55.82488607061184, 37.834775327717445], [55.822361493423664, 37.836706518208175], [55.82024748644772, 37.8376291981093], [55.816165064041414, 37.83857287182817], [55.81242284003345, 37.83903585464755], [55.803139424516395, 37.839775801016756], [55.77682929150693, 37.8427186924053]]
  , mkad_b_junctions = [[55.77682626803085, 37.84269989967345], [55.76903191638017, 37.84318651588698], [55.74392477931212, 37.84185519957153], [55.73052122580085, 37.84037898416108], [55.71863531207276, 37.83895012458452], [55.711831272333605, 37.83713368900962], [55.707901422046966, 37.8350106548768], [55.6869523798766, 37.83057993978087], [55.65692789667629, 37.83910426510268], [55.640528720308474, 37.819652386266085], [55.617789410062215, 37.782276430404394], [55.59175631830074, 37.72929474857808], [55.57581125568298, 37.687799514747375], [55.57272629492449, 37.65277241112271], [55.57605719591829, 37.59643530860042], [55.58106457666858, 37.57265144016032], [55.59150701569656, 37.52902190629794], [55.61120819157864, 37.49189413873337], [55.638972144200956, 37.45948542596951], [55.66189360804507, 37.432824164364256], [55.68278581583797, 37.416807425418966], [55.668026850906536, 37.42778473861195], [55.70188946767468, 37.39895204348993], [55.713602586285944, 37.38589295731531], [55.72348037785042, 37.38078139017449], [55.73175585229489, 37.37657178200628], [55.76508406345848, 37.36928736556715], [55.76996256764349, 37.36942982797446], [55.789736950483615, 37.3728868615282], [55.808798087528174, 37.388344151047676], [55.83260998737753, 37.39560097816893], [55.851747102850375, 37.39376480087579], [55.87090570963696, 37.41209100527676], [55.87659696295345, 37.42839459978549], [55.88161130650381, 37.445221243317135], [55.88711708090231, 37.482644383447834], [55.89207427475143, 37.49649435563702], [55.90782224163112, 37.54371914983502], [55.90978840669936, 37.58858112800599], [55.89518876022445, 37.67325996719509], [55.82959228057486, 37.82861019557688], [55.8822323534685, 37.72592724800108], [55.8138082895938, 37.83884777073161]];
function pegasus(d, b) {
    return b = new XMLHttpRequest,
    b.open("GET", d),
    d = [],
    b.onreadystatechange = b.then = function(a, c, e) {
        a.call && (d = [, a, c]);
        4 == b.readyState && (e = d[0 | b.status / 200],
        e && e(JSON.parse(b.responseText), b))
    }
    ,
    b.send(),
    b
}
(function() {
    function j(c, l, k) {
        if ("_root" == l) {
            return k
        }
        if (c !== k) {
            if ((g ? g : c.matches ? g = c.matches : c.webkitMatchesSelector ? g = c.webkitMatchesSelector : c.mozMatchesSelector ? g = c.mozMatchesSelector : c.msMatchesSelector ? g = c.msMatchesSelector : c.oMatchesSelector ? g = c.oMatchesSelector : g = f.matchesSelector).call(c, l)) {
                return c
            }
            if (c.parentNode) {
                return t++,
                j(c.parentNode, l, k)
            }
        }
    }
    function m(l, q, p, n) {
        d[l.id] || (d[l.id] = {});
        d[l.id][q] || (d[l.id][q] = {});
        d[l.id][q][p] || (d[l.id][q][p] = []);
        d[l.id][q][p].push(n)
    }
    function i(n, s, q, p) {
        if (d[n.id]) {
            if (!s) {
                for (var l in d[n.id]) {
                    d[n.id].hasOwnProperty(l) && (d[n.id][l] = {})
                }
            } else {
                if (!p && !q) {
                    d[n.id][s] = {}
                } else {
                    if (!p) {
                        delete d[n.id][s][q]
                    } else {
                        if (d[n.id][s][q]) {
                            for (l = 0; l < d[n.id][s][q].length; l++) {
                                if (d[n.id][s][q][l] === p) {
                                    d[n.id][s][q].splice(l, 1);
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function b(p, u, s) {
        if (d[p][s]) {
            var w = u.target || u.srcElement, l, x, v = {}, c = x = 0;
            t = 0;
            for (l in d[p][s]) {
                d[p][s].hasOwnProperty(l) && (x = j(w, l, r[p].element)) && f.matchesEvent(s, r[p].element, x, "_root" == l, u) && (t++,
                d[p][s][l].match = x,
                v[t] = d[p][s][l])
            }
            u.stopPropagation = function() {
                u.cancelBubble = !0
            }
            ;
            for (x = 0; x <= t; x++) {
                if (v[x]) {
                    for (c = 0; c < v[x].length; c++) {
                        if (!1 === v[x][c].call(v[x].match, u)) {
                            f.cancel(u);
                            return
                        }
                        if (u.cancelBubble) {
                            return
                        }
                    }
                }
            }
        }
    }
    function e(w, l, u, p) {
        function a(c) {
            return function(k) {
                b(h, k, c)
            }
        }
        if (this.element) {
            w instanceof Array || (w = [w]);
            u || "function" != typeof l || (u = l,
            l = "_root");
            var h = this.id, q;
            for (q = 0; q < w.length; q++) {
                p ? i(this, w[q], l, u) : (d[h] && d[h][w[q]] || f.addEvent(this, w[q], a(w[q])),
                m(this, w[q], l, u))
            }
            return this
        }
    }
    function f(k, n) {
        if (!(this instanceof f)) {
            for (var l in r) {
                if (r[l].element === k) {
                    return r[l]
                }
            }
            o++;
            r[o] = new f(k,o);
            return r[o]
        }
        this.element = k;
        this.id = n
    }
    var g, t = 0, o = 0, d = {}, r = {};
    f.prototype.on = function(k, n, l) {
        return e.call(this, k, n, l)
    }
    ;
    f.prototype.off = function(k, n, l) {
        return e.call(this, k, n, l, !0)
    }
    ;
    f.matchesSelector = function() {}
    ;
    f.cancel = function(c) {
        c.preventDefault();
        c.stopPropagation()
    }
    ;
    f.addEvent = function(k, n, l) {
        k.element.addEventListener(n, l, "blur" == n || "focus" == n)
    }
    ;
    f.matchesEvent = function() {
        return !0
    }
    ;
    window.Gator = f
}
)();
var myMap = null
  , kad_poly_obj = null
  , kad_bjGq = null
  , mkad_poly_obj = null
  , mkad_bjGq = null
  , collection = null
  , searchControl = null;
ymaps.ready(init);
function init() {
    document.getElementById("loading-text").innerHTML = "\u0418\u0437\u043c\u0435\u0440\u044f\u044e..";
    layout.hideLoading();
    myMap = new ymaps.Map("map",{
        center: [55.75119082121071, 37.61699737548825],
        zoom: 9,
        controls: ["zoomControl", "typeSelector", "trafficControl", "rulerControl"]
    });
    collection = new ymaps.GeoObjectCollection({});
    myMap.geoObjects.add(collection);
    prepareData();
    myMap.events.add("click", function(c) {
        c = c.get("coords");
        console.log(c);
        getDistance(c)
    });
    initSearchControls();
    var d = checkSavedUrl();
    if (d) {
        loadSavedUrl(d)
    } else {
        var b = checkSearchUrl();
        b && b.length && setTimeout(function() {
            searchControl.search(b)
        }, 500)
    }
}
function checkSearchUrl() {
    var d = /\/s\/(.*?)$/.exec(location.pathname);
    if (d) {
        return decodeURIComponent(d[1])
    }
    if (location.search) {
        var b = {};
        location.search.replace(/^\?/, "").split("&").forEach(function(a) {
            a = a.split("=");
            b[a[0]] = a[1]
        });
        if (b.s) {
            return decodeURIComponent(b.s)
        }
    }
    return null
}
function loadSavedUrl(d) {
    var b = document.getElementById("loading-text");
    b.innerHTML = "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044e..";
    layout.showLoading();
    api.loadCoords(d, function(a) {
        a ? (document.getElementById("link-value").value = layout.url + d,
        getRoute([a.lat_mkad, a.lon_mkad], [a.lat, a.lon], function(e, f) {
            showResults(f, "mkad", [a.lat, a.lon], !0)
        })) : layout.showMessage("\u041c\u0430\u0440\u0448\u0440\u0443\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d");
        layout.hideLoading();
        b.innerHTML = "\u0418\u0437\u043c\u0435\u0440\u044f\u044e.."
    })
}
function checkSavedUrl() {
    var a = /\/m\/([\w\d]+)/.exec(location.pathname);
    return a ? a[1] : null
}
function initSearchControls() {
    var d = new ymaps.control.SearchControl({
        options: {
            noPlacemark: !0,
            boundedBy: [[54.519290287469204, 34.24300222066421], [56.797905844997935, 41.581869408164216]]
        }
    });
    searchControl = d;
    myMap.controls.add(d);
    var b = new ymaps.GeoObjectCollection(null,{
        hintContentLayout: ymaps.templateLayoutFactory.createClass("$[properties.name]")
    });
    myMap.geoObjects.add(b);
    d.events.add("resultselect", function(a) {
        a = a.get("index");
        d.getResult(a).then(function(e) {
            getDistance(e.geometry.getCoordinates());
            b.add(e)
        })
    }).add("submit", function() {
        b.removeAll()
    })
}
function prepareData() {
    kad_poly_obj = new ymaps.Polygon([kad_poly]);
    ymaps.geoQuery(kad_poly_obj).setOptions("visible", !1).addToMap(myMap);
    var d = new ymaps.GeoObjectCollection({});
    kad_b_junctions.forEach(function(a) {
        d.add(new ymaps.Placemark(a));
    });
    kad_bjGq = ymaps.geoQuery(d).setOptions("visible", !1).addToMap(myMap);
    kad_poly = d = kad_b_junctions = null
 
    mkad_poly_obj = new ymaps.Polygon([mkad_poly]);
    ymaps.geoQuery(mkad_poly_obj).setOptions("visible", !1).addToMap(myMap);
    var mkad_d = new ymaps.GeoObjectCollection({});
    mkad_b_junctions.forEach(function(a) {
        mkad_d.add(new ymaps.Placemark(a));
    });
    mkad_bjGq = ymaps.geoQuery(mkad_d).setOptions("visible", !1).addToMap(myMap);
    mkad_poly = mkad_d = mkad_b_junctions = null
}
function getDistance(d) {
    clearPrev();
    layout.showLoading();
    if (checkIn(d, mkad_poly_obj)) {
        layout.showMessage("\u0422\u043e\u0447\u043a\u0430 \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0441\u044f \u0432\u043d\u0443\u0442\u0440\u0438 \u041c\u041a\u0410\u0414")
    } else if (checkIn(d, kad_poly_obj)) {
        layout.showMessage("\u0422\u043e\u0447\u043a\u0430 \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0441\u044f \u0432\u043d\u0443\u0442\u0440\u0438 \u041a\u0410\u0414")
    } else {
        var b = [];
        routeFromCenter(d, function(c, e) {
            b.push(e[0]);
            var a = [];
            const kadRoutes = findNearest(kad_bjGq, d, 5);
            const mkadRoutes = findNearest(mkad_bjGq, d, 5);
            a = kadRoutes.concat(mkadRoutes);
            a.forEach(function(g) {
                g[0] == e[0][0] && g[1] == e[0][1] || b.push(g)
            });
            async.map(b, function(g, i) {
                getRoute(g, d, i)
            }, function(i, j) {
                var g = j.map(function(h) {
                    return h.getLength()
                })
                  , g = indexOfSmallest(g);
 
                const closestRoute = j[g];
                const isKadCloser = closestRoute.requestPoints[0][1] < 33;
                const closerRoad = isKadCloser ? '\u041a\u0410\u0414' : '\u041c\u041a\u0410\u0414';
 
                showResults(closestRoute, closerRoad, d)
            })
        });
    }
}
function showResults(i, closerRoad, d, e) {
    var f = i.getHumanLength();
    i.getPaths().options.set({
        strokeColor: "1e98ff"
    });
    var g, b;
    i.getWayPoints().each(function(c) {
        "1" == c.properties.get("iconContent") && (c.properties.set("iconContent", closerRoad),
        c.options.set("preset", "islands#blueStretchyIcon"),
        b = c.geometry.getCoordinates(),
        c.properties.set("balloonContent", ""),
        c.events.add("click", layout.showExistsLink));
        "2" == c.properties.get("iconContent") && (c.options.set("preset", "islands#blueStretchyIcon"),
        c.properties.set("iconContent", f),
        g = c.geometry.getCoordinates(),
        c.properties.set("balloonContent", ""),
        c.events.add("click", layout.showExistsLink))
    });
    collection.add(i);
    e || (layout.showLink(g, b, ""),
    stat.reachGoal("Distance", {
        length: f,
        coords: d
    }));
    layout.hideLoading()
}
function clearPrev() {
    collection.removeAll();
    stat.onceClear("link-click");
    stat.onceClear("link-keydown")
}
function checkIn(d, poly_obj) {
    d = new ymaps.Placemark(d);
    var b = ymaps.geoQuery(d).setOptions("visible", !1).addToMap(myMap).searchInside(poly_obj).getLength();
    myMap.geoObjects.remove(d);
    return b
}
function routeFromCenter(d, b) {
    getRoute([55.75119082121071, 37.61699737548825], d, function(h, f) {
        var g = [];
        ymaps.geoQuery(f.getPaths()).each(function(i) {
            i = i.geometry.getCoordinates();
            for (var k = 1, j = i.length; k < j; k++) {
                g.push({
                    type: "LineString",
                    coordinates: [i[k], i[k - 1]]
                })
            }
        });
        var a = ymaps.geoQuery(g).setOptions("visible", !1).addToMap(myMap)
          , e = a.searchInside(kad_poly_obj)
          , e = a.remove(e).get(0).geometry.getCoordinates()[1];
        a.removeFromMap(myMap);
        a = findNearest(kad_bjGq, e, 1);
        b(null, a)
    })
}
function findNearest(f, b, d) {
    f = f.sortByDistance(b);
    b = [];
    for (var e = 0; e < d; e++) {
        b.push(f.get(e).geometry.getCoordinates())
    }
    return b
}
function getPointDistance(d, b) {
    return myMap.options.get("projection").getCoordSystem().getDistance(d, b)
}
function indexOfSmallest(a) {
    return a.indexOf(Math.min.apply(Math, a))
}
function getRoute(e, b, d) {
    ymaps.route([e, b]).done(function(c) {
        d(null, c)
    })
}
var api = {
    saveCoords: function(i, d, e, f, g, b) {
        pegasus("/api/s/" + i + "/" + d + "/" + e + "/" + f + "/").then(function(c) {
            b(c.id)
        })
    },
    loadCoords: function(d, b) {
        pegasus("/api/" + d).then(b)
    }
}
  , layout = {
    url: "https://www.online-perevozka.ru/tablica-rasstojanij.html",
    hideLoading: function() {
        document.getElementById("loading").style.display = "none"
    },
    showLoading: function() {
        document.getElementById("loading").style.display = ""
    },
    showMessage: function(d) {
        layout.hideLoading();
        var b = document.getElementById("message");
        b.innerHTML = d;
        b.style.display = "";
        setTimeout(function() {
            b.style.display = "none"
        }, 1200)
    },
    showLink: function(e, b, d) {
        api.saveCoords(e[0], e[1], b[0], b[1], d, function(c) {
            document.getElementById("link-value").value = layout.url + c;
            document.getElementById("link-panel").style.display = "block"
        })
    },
    showExistsLink: function() {
        document.getElementById("link-panel").style.display = "block";
        layout.linkInputSelect()
    },
    hideLink: function() {
        document.getElementById("link-panel").style.display = "none"
    },
    linkInputSelect: function() {
        var a = document.getElementById("link-value");
        a.focus();
        a.setSelectionRange(0, a.value.length)
    },
    init: function() {
        Gator(document).on("click", "#link-value", function() {
            layout.linkInputSelect();
            stat.reachGoalOnce("link-click")
        });
        Gator(document).on("click", "#link-close", layout.hideLink);
        Gator(document).on("keydown", "#link-value", function() {
            stat.reachGoalOnce("link-keydown")
        })
    }
};
layout.init();
var stat = {
    yObj: "yaCounter",
    reachGoal: function(d, b) {
        window[stat.yObj] && window[stat.yObj].reachGoal(d, b);
        window.ga && window.ga("send", "event", d)
    },
    onceCounter: {},
    reachGoalOnce: function(d, b) {
        stat.onceCounter[d] || (stat.onceCounter[d] = !0,
        stat.reachGoal(d, b))
    },
    onceClear: function(a) {
        delete stat.onceCounter[a]
    }
};
`;
 
  new MutationObserver(async (mutations, observer) => {
    let oldScript = mutations
      .flatMap(e => [...e.addedNodes])
      .filter(e => e.tagName == 'SCRIPT')
      .find(e => e.src.includes(scriptToReplace));
 
    if (oldScript) {
      observer.disconnect();
      oldScript.remove();
 
      let newScriptElement = document.createElement('script');
      newScriptElement.type = 'text/javascript';
      newScriptElement.textContent = newScript;
      document.querySelector('head').appendChild(newScriptElement);
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
})();