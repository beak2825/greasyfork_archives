// ==UserScript==
// @name         make work with chatgpt Download a McGraw Hill Education eTextbook
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  try ts
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491055/make%20work%20with%20chatgpt%20Download%20a%20McGraw%20Hill%20Education%20eTextbook.user.js
// @updateURL https://update.greasyfork.org/scripts/491055/make%20work%20with%20chatgpt%20Download%20a%20McGraw%20Hill%20Education%20eTextbook.meta.js
// ==/UserScript==

//https://gist.github.com/101arrowz/88156556326106a6ccd58ecb4526498c
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {  // For old versions of IE
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  // For modern browsers
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Load the html2canvas library
loadScript("https://html2canvas.hertzen.com/dist/html2canvas.min.js", function() {
  console.log("html2canvas library loaded!", html2canvas);

  // Load the jsPDF library
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js", function() {
    console.log("jsPDF library loaded!", jsPDF);
    // You can now use both libraries in your code
  });
});







function captureAndSaveAsPDF(elementId) {
  var element = document.getElementsByClassName('mhhe-blk-header')[0]; // Get the element
  html2canvas(element).then(function(canvas) { // Convert the element to a canvas
    var imgData = canvas.toDataURL('image/png'); // Convert the canvas to a PNG image
    var doc = new jsPDF('p', 'mm'); // Create a new jsPDF instance
    doc.addImage(imgData, 'PNG', 10, 10); // Add the image to the PDF
    doc.save('sample.pdf'); // Save the PDF
  });
}

captureAndSaveAsPDF()






/*
// Source code for the downloader.
import('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js').then(async () => {
  alert('This is the McGraw-Hill Education Textbook Downloader. Click OK to start downloading the files.');
  const IMPORT_URL = (await (await fetch('https://player-api.mheducation.com/lti', { credentials: 'include' })).json()).custom_epub_url;
  const epub = new JSZip();
  const metaInf = epub.folder('META-INF');
  metaInf.file('container.xml', await (await fetch(IMPORT_URL + 'META-INF/container.xml', { credentials: 'include' })).text());
  const epubData = epub.folder('OPS');
  const opfString = await (await fetch(IMPORT_URL + 'OPS/content.opf', { credentials: 'include' })).text();
  epubData.file('content.opf', opfString);
  const opf = new DOMParser().parseFromString(opfString, 'application/xml');
  for (let item of opf.querySelector('manifest').children) {
    const href = item.getAttribute('href');
    try {
      const data = await (await fetch(`${IMPORT_URL}OPS/${href}`, { credentials: 'include' })).arrayBuffer();
      epubData.file(href, data);
      console.log('Finished downloading', href);
     } catch(e) {
       throw `Failed to download ${href}: ${e}`;
     }
  }
  alert('Finished downloading data! Click OK to start compression.');
  window.__savedTextbook = epub;
  let highestPercent = 0;
  const data = await epub.generateInternalStream({ type: 'blob' }).accumulate(({ percent }) => {
    const intPercent = Math.floor(percent);
    if (intPercent > highestPercent) {
      console.log(intPercent+'% complete');
      highestPercent = intPercent
    }
  });
  alert('Finished compressing textbook! Click OK to start download.');
  window.__savedTextbookEpub = data;
  const url = URL.createObjectURL(data);
  const tmpLink = document.createElement('a');
  tmpLink.href = url;
  const possibleTitle = opf.querySelector('metadata title');
  const titleString = possibleTitle ? possibleTitle.innerHTML : 'textbook';
  tmpLink.download = titleString + '.epub';
  tmpLink.click();
  URL.revokeObjectURL(url);
}).catch(err => alert('Textbook download failed because an error occurred: '+err)); */










// Optimized code for the downloader.
! function() {
  var t = function(t) {
    var e = Object.prototype,
        r = e.hasOwnProperty,
        n = "function" == typeof Symbol ? Symbol : {},
        o = n.iterator || "@@iterator",
        i = n.asyncIterator || "@@asyncIterator",
        a = n.toStringTag || "@@toStringTag";

    function c(t, e, r, n) {
      var o = e && e.prototype instanceof u ? e : u,
          i = Object.create(o.prototype),
          a = new L(n || []);
      return i._invoke = function(t, e, r) {
        var n = "suspendedStart";
        return function(o, i) {
          if ("executing" === n) throw new Error("Generator is already running");
          if ("completed" === n) {
            if ("throw" === o) throw i;
            return k()
          }
          for (r.method = o, r.arg = i;;) {
            var a = r.delegate;
            if (a) {
              var c = w(a, r);
              if (c) {
                if (c === l) continue;
                return c
              }
            }
            if ("next" === r.method) r.sent = r._sent = r.arg;
            else if ("throw" === r.method) {
              if ("suspendedStart" === n) throw n = "completed", r.arg;
              r.dispatchException(r.arg)
            } else "return" === r.method && r.abrupt("return", r.arg);
            n = "executing";
            var u = s(t, e, r);
            if ("normal" === u.type) {
              if (n = r.done ? "completed" : "suspendedYield", u.arg === l) continue;
              return {
                value: u.arg,
                done: r.done
              }
            }
            "throw" === u.type && (n = "completed", r.method = "throw", r.arg = u.arg)
          }
        }
      }(t, r, a), i
    }

    function s(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        }
      } catch (t) {
        return {
          type: "throw",
          arg: t
        }
      }
    }
    t.wrap = c;
    var l = {};

    function u() {}

    function h() {}

    function d() {}
    var f = {};
    f[o] = function() {
      return this
    };
    var p = Object.getPrototypeOf,
        v = p && p(p(E([])));
    v && v !== e && r.call(v, o) && (f = v);
    var y = d.prototype = u.prototype = Object.create(f);

    function m(t) {
      ["next", "throw", "return"].forEach((function(e) {
        t[e] = function(t) {
          return this._invoke(e, t)
        }
      }))
    }

    function g(t, e) {
      var n;
      this._invoke = function(o, i) {
        function a() {
          return new e((function(n, a) {
            ! function n(o, i, a, c) {
              var l = s(t[o], t, i);
              if ("throw" !== l.type) {
                var u = l.arg,
                    h = u.value;
                return h && "object" == typeof h && r.call(h, "__await") ? e.resolve(h.__await).then((function(t) {
                  n("next", t, a, c)
                }), (function(t) {
                  n("throw", t, a, c)
                })) : e.resolve(h).then((function(t) {
                  u.value = t, a(u)
                }), (function(t) {
                  return n("throw", t, a, c)
                }))
              }
              c(l.arg)
            }(o, i, n, a)
          }))
        }
        return n = n ? n.then(a, a) : a()
      }
    }

    function w(t, e) {
      var r = t.iterator[e.method];
      if (void 0 === r) {
        if (e.delegate = null, "throw" === e.method) {
          if (t.iterator.return && (e.method = "return", e.arg = void 0, w(t, e), "throw" === e.method)) return l;
          e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method")
        }
        return l
      }
      var n = s(r, t.iterator, e.arg);
      if ("throw" === n.type) return e.method = "throw", e.arg = n.arg, e.delegate = null, l;
      var o = n.arg;
      return o ? o.done ? (e[t.resultName] = o.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", e.arg = void 0), e.delegate = null, l) : o : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, l)
    }

    function x(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
    }

    function b(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e
    }

    function L(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(x, this), this.reset(!0)
    }

    function E(t) {
      if (t) {
        var e = t[o];
        if (e) return e.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var n = -1,
              i = function e() {
                for (; ++n < t.length;)
                  if (r.call(t, n)) return e.value = t[n], e.done = !1, e;
                return e.value = void 0, e.done = !0, e
              };
          return i.next = i
        }
      }
      return {
        next: k
      }
    }

    function k() {
      return {
        value: void 0,
        done: !0
      }
    }
    return h.prototype = y.constructor = d, d.constructor = h, d[a] = h.displayName = "GeneratorFunction", t.isGeneratorFunction = function(t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === h || "GeneratorFunction" === (e.displayName || e.name))
    }, t.mark = function(t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, d) : (t.__proto__ = d, a in t || (t[a] = "GeneratorFunction")), t.prototype = Object.create(y), t
    }, t.awrap = function(t) {
      return {
        __await: t
      }
    }, m(g.prototype), g.prototype[i] = function() {
      return this
    }, t.AsyncIterator = g, t.async = function(e, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new g(c(e, r, n, o), i);
      return t.isGeneratorFunction(r) ? a : a.next().then((function(t) {
        return t.done ? t.value : a.next()
      }))
    }, m(y), y[a] = "Generator", y[o] = function() {
      return this
    }, y.toString = function() {
      return "[object Generator]"
    }, t.keys = function(t) {
      var e = [];
      for (var r in t) e.push(r);
      return e.reverse(),
        function r() {
        for (; e.length;) {
          var n = e.pop();
          if (n in t) return r.value = n, r.done = !1, r
        }
        return r.done = !0, r
      }
    }, t.values = E, L.prototype = {
      constructor: L,
      reset: function(t) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(b), !t)
          for (var e in this) "t" === e.charAt(0) && r.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
      },
      stop: function() {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval
      },
      dispatchException: function(t) {
        if (this.done) throw t;
        var e = this;

        function n(r, n) {
          return a.type = "throw", a.arg = t, e.next = r, n && (e.method = "next", e.arg = void 0), !!n
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
              a = i.completion;
          if ("root" === i.tryLoc) return n("end");
          if (i.tryLoc <= this.prev) {
            var c = r.call(i, "catchLoc"),
                s = r.call(i, "finallyLoc");
            if (c && s) {
              if (this.prev < i.catchLoc) return n(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return n(i.finallyLoc)
            } else if (c) {
              if (this.prev < i.catchLoc) return n(i.catchLoc, !0)
            } else {
              if (!s) throw new Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return n(i.finallyLoc)
            }
          }
        }
      },
      abrupt: function(t, e) {
        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
          var o = this.tryEntries[n];
          if (o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, l) : this.complete(a)
      },
      complete: function(t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), l
      },
      finish: function(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), b(r), l
        }
      },
      catch: function(t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              b(r)
            }
            return o
          }
        }
        throw new Error("illegal catch attempt")
      },
      delegateYield: function(t, e, r) {
        return this.delegate = {
          iterator: E(t),
          resultName: e,
          nextLoc: r
        }, "next" === this.method && (this.arg = void 0), l
      }
    }, t
  }({});
  try {
    regeneratorRuntime = t
  } catch (e) {
    Function("r", "regeneratorRuntime = r")(t)
  }

  function e(t, e, r, n, o, i, a) {
    try {
      var c = t[i](a),
          s = c.value
      } catch (t) {
        return void r(t)
      }
    c.done ? e(s) : Promise.resolve(s).then(n, o)
  }
  self.fetch || (self.fetch = function(t, e) {
    return e = e || {}, new Promise((r, n) => {
      const o = new XMLHttpRequest,
            i = [],
            a = [],
            c = {},
            s = () => ({
              ok: 2 == (o.status / 100 | 0),
              statusText: o.statusText,
              status: o.status,
              url: o.responseURL,
              text: () => Promise.resolve(o.responseText),
              json: () => Promise.resolve(JSON.parse(o.responseText)),
              blob: () => Promise.resolve(new Blob([o.response])),
              clone: s,
              headers: {
                keys: () => i,
                entries: () => a,
                get: t => c[t.toLowerCase()],
                has: t => t.toLowerCase() in c
              }
            });
      o.open(e.method || "get", t, !0), o.onload = () => {
        o.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, (t, e, r) => {
          i.push(e = e.toLowerCase()), a.push([e, r]), c[e] = c[e] ? `${c[e]},${r}` : r
        }), r(s())
      }, o.onerror = n, o.withCredentials = "include" == e.credentials;
      for (const t in e.headers) o.setRequestHeader(t, e.headers[t]);
      o.send(e.body || null)
    })
  });
  var r = document.createElement("script");
  r.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js";
  var n = document.createElement("div");
  n.style.background = "white", n.style.position = "fixed", n.style.width = "100vw", n.style.height = "100vh", n.style.top = 0, n.style.left = 0, n.style.zIndex = 1e6;
  var o = document.createTextNode("");
  n.appendChild(o), document.body.style.marginBottom = 0, document.body.appendChild(n);
  var i = function() {
    var t;
    n.removeChild(n.lastChild);
    for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++) r[o] = arguments[o];
    (t = console).log.apply(t, r);
    var i = document.createElement("div");
    i.textContent = r.join(" "), n.appendChild(i)
  },
      a = function() {
        var t;
        n.removeChild(n.lastChild);
        for (var e = arguments.length, r = new Array(e), i = 0; i < e; i++) r[i] = arguments[i];
        (t = console).error.apply(t, r);
        var a = document.createElement("div");
        a.style.color = "red", a.textContent = r.join(" "), n.appendChild(a), n.appendChild(o)
      },
      c = function() {
        var t, r = (t = regeneratorRuntime.mark((function t() {
          var e, r, c, s, l, u, h, d, f, p, v, y, m, g, w, x, b, L;
          return regeneratorRuntime.wrap((function(t) {
            for (;;) switch (t.prev = t.next) {
              case 0:
                return i("This is the McGraw-Hill Education Textbook Downloader. Once the download completes, refresh the page to go back to the original site. Starting file download..."), n.appendChild(o), t.next = 4, fetch("https://player-api.mheducation.com/lti", {
                  credentials: "include"
                });
              case 4:
                return t.next = 6, t.sent.json();
              case 6:
                return e = t.sent.custom_epub_url, r = new JSZip, c = r.folder("META-INF"), t.t0 = c, t.next = 12, fetch(e + "META-INF/container.xml", {
                  credentials: "include"
                });
              case 12:
                return t.next = 14, t.sent.text();
              case 14:
                return t.t1 = t.sent, t.t0.file.call(t.t0, "container.xml", t.t1), s = r.folder("OPS"), t.next = 19, fetch(e + "OPS/content.opf", {
                  credentials: "include"
                });
              case 19:
                return t.next = 21, t.sent.text();
              case 21:
                l = t.sent, s.file("content.opf", l), u = (new DOMParser).parseFromString(l, "application/xml"), h = u.querySelector("manifest").children, d = h.length, f = 0;
              case 27:
                if (!(f < d)) {
                  t.next = 46;
                  break
                }
                return p = h.item(f), v = p.getAttribute("href"), t.prev = 30, t.next = 33, fetch("".concat(e, "OPS/").concat(v), {
                  credentials: "include"
                });
              case 33:
                return t.next = 35, t.sent.arrayBuffer();
              case 35:
                y = t.sent, s.file(v, y), i("Finished downloading", v, "(".concat(f, " of ").concat(d, ")")), t.next = 43;
                break;
              case 40:
                t.prev = 40, t.t2 = t.catch(30), a("Failed to download ".concat(v, ": ").concat(t.t2));
              case 43:
                f++, t.next = 27;
                break;
              case 46:
                return i("Finished downloading data! Starting compression..."), n.appendChild(o), window.__savedTextbook = r, m = 0, t.next = 52, r.generateInternalStream({
                  type: "blob",
                  compression: "STORE"
                }).accumulate((function(t) {
                  var e = t.percent,
                      r = Math.floor(e);
                  r > m && (i(r + "% complete"), m = r)
                }));
              case 52:
                g = t.sent, i("Finished compressing textbook! Starting download..."), n.appendChild(o), window.__savedTextbookEpub = g, w = URL.createObjectURL(g), (x = document.createElement("a")).href = w, b = u.querySelector("metadata title"), L = b ? b.innerHTML : "textbook", x.download = L + ".epub", x.click(), URL.revokeObjectURL(w);
              case 64:
              case "end":
                return t.stop()
            }
          }), t, null, [
            [30, 40]
          ])
        })), function() {
          var r = this,
              n = arguments;
          return new Promise((function(o, i) {
            var a = t.apply(r, n);

            function c(t) {
              e(a, o, i, c, s, "next", t)
            }

            function s(t) {
              e(a, o, i, c, s, "throw", t)
            }
            c(void 0)
          }))
        });
        return function() {
          return r.apply(this, arguments)
        }
      }();
  document.head.appendChild(r), r.onload = c
}();