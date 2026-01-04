// ==UserScript==
// @name        GollyJer's Wistia Fresh Urls
// @description Clean tracking parameters from urls (better for bookmarking).
// @namespace   gollyjer.com
// @version     1.0
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/397369/GollyJer%27s%20Wistia%20Fresh%20Urls.user.js
// @updateURL https://update.greasyfork.org/scripts/397369/GollyJer%27s%20Wistia%20Fresh%20Urls.meta.js
// ==/UserScript==

let FreshUrl;
(FreshUrl = (function () {
  function n(t) {
    let e;
    let r;
    let i;
    let o;
    if ((t == null && (t = []), window.history.replaceState)) {
      for (this.key = 0, this._isReady = {}, e = 0, o = t.length; o > e; e++) {
        (i = t[e]),
        typeof i === 'string' && n.libraries[i]
          ? this.wait(n.libraries[i].ready, i)
          : typeof i === 'function'
            ? this.wait(i)
            : typeof console !== 'undefined'
              && console !== null
              && console.log(`FreshURL: Don't know how to wait for ${i}`);
      }
      t.length === 0 && this.allReady() && this.allReadyCallback(),
      n.updateWistiaIframes(),
      (r = function (t) {
        return t.data === 'new-wistia-iframe' ? n.updateWistiaIframes() : void 0;
      }),
      typeof window !== 'undefined'
          && window !== null
          && window.addEventListener('message', r, !1);
    }
  }
  return (
    (n.libraries = {
      googleAnalytics: {
        present() {
          return window._gaq || window[window.GoogleAnalyticsObject];
        },
        ready(t) {
          return n.waitsFor(n.libraries.googleAnalytics.present).then(() => {
            let n;
            return (n = window._gaq)
              ? n.push(() => t())
              : (n = window[window.GoogleAnalyticsObject])
                ? n(() => t())
                : void 0;
          });
        },
      },
      hubspot: {
        present() {
          return window._hsq || n.scriptFrom(/\/\/(js\.hubspot\.com|js.hs-analytics\.net)/);
        },
        ready(t) {
          return n.waitsFor(() => window._hsq).then(() => _hsq.push(() => t()));
        },
      },
      clicky: {
        present() {
          return (
            window.clicky || window.clicky_site_ids || n.scriptFrom(/\/\/static\.getclicky\.com/)
          );
        },
        ready(t) {
          return n.waitsFor(() => window.clicky_obj).then(t);
        },
      },
      pardot: {
        present() {
          return window.piAId || window.piCId || n.scriptContains(/\.pardot\.com\/pd\.js/);
        },
        ready(t) {
          return n
            .waitsFor(() => {
              let n;
              let t;
              return (n = window.pi) != null && (t = n.tracker) != null ? t.url : void 0;
            })
            .then(t);
        },
      },
      simplex: {
        present() {
          return window.simplex || n.scriptFrom(/\/simplex\.js/);
        },
        ready(t) {
          return n.waitsFor(() => window.simplex).then(t);
        },
      },
      analyticsJs: {
        present() {
          let n;
          return (n = window.analytics) != null ? n.ready : void 0;
        },
        ready(t) {
          return n
            .waitsFor(() => {
              let n;
              return (n = window.analytics) != null ? n.ready : void 0;
            })
            .then(() => analytics.ready(t));
        },
      },
    }),
    (n.originalUrl = window.location.href),
    (n.prototype.wait = function (n, t) {
      return (
        t == null && (t = this.nextKey()),
        (this._isReady[t] = !1),
        n(
          (function (n) {
            return function () {
              return n.ready(t);
            };
          }(this)),
        )
      );
    }),
    (n.prototype.ready = function (n) {
      return (this._isReady[n] = !0), this.allReady() ? this.allReadyCallback() : void 0;
    }),
    (n.prototype.allReady = function () {
      let n;
      let t;
      let e;
      let r;
      (t = []), (e = this._isReady);
      for (n in e) (r = e[n]), r || t.push(n);
      return t.length === 0;
    }),
    (n.prototype.allReadyCallback = function () {
      return window.history.replaceState(window.history.state, '', n.cleanUrl());
    }),
    (n.cleanUrl = function () {
      let n;
      return (
        (n = window.location.search
          .replace(/utm_[^&]+&?/g, '')
          .replace(/(wkey|wemail)[^&]+&?/g, '')
          .replace(/(_hsenc|_hsmi|hsCtaTracking)[^&]+&?/g, '')
          .replace(/&$/, '')
          .replace(/^\?$/, '')),
        window.location.pathname + n + window.location.hash
      );
    }),
    (n.poll = function (n, t, e, r) {
      let i;
      let o;
      let a;
      return (
        e == null && (e = 50),
        r == null && (r = 5e3),
        (o = null),
        (a = new Date().getTime()),
        (i = function () {
          return new Date().getTime() - a > r
            ? void 0
            : n()
              ? t()
              : (clearTimeout(o), (o = setTimeout(i, e)));
        }),
        (o = setTimeout(i, 1))
      );
    }),
    (n.waitsFor = function (t) {
      return {
        then(e) {
          return n.poll(t, e);
        },
      };
    }),
    (n.prototype.nextKey = function () {
      return (this.key += 1);
    }),
    (n.scriptFrom = function (n) {
      let t;
      let e;
      let r;
      let i;
      let o;
      for (r = document.getElementsByTagName('script'), t = 0, e = r.length; e > t; t++) if (((o = r[t]), (i = o.getAttribute('src')) != null ? i.match(n) : void 0)) return !0;
      return !1;
    }),
    (n.scriptContains = function (n) {
      let t;
      let e;
      let r;
      let i;
      let o;
      for (r = document.getElementsByTagName('script'), t = 0, e = r.length; e > t; t++) if (((o = r[t]), (i = o.innerHTML) != null ? i.match(n) : void 0)) return !0;
      return !1;
    }),
    (n.librariesPresent = function () {
      let t;
      let e;
      let r;
      let i;
      (r = n.libraries), (i = []);
      for (e in r) (t = r[e]), t.present() && i.push(e);
      return i;
    }),
    (n.wistiaIframes = function () {
      let n;
      let t;
      let e;
      let r;
      let i;
      for (r = document.getElementsByTagName('iframe'), i = [], n = 0, e = r.length; e > n; n++) (t = r[n]), t.src.match(/\/\/.*\.wistia\..*\//) && i.push(t);
      return i;
    }),
    (n.updateWistiaIframes = function () {
      let n;
      let t;
      let e;
      let r;
      let i;
      let o;
      let a;
      let s;
      for (
        o = {
          method: 'updateProperties',
          args: [{ params: { pageUrl: this.originalUrl }, options: { pageUrl: this.originalUrl } }],
        },
        a = this.wistiaIframes(),
        s = [],
        e = 0,
        i = a.length;
        i > e;
        e++
      ) {
        r = a[e];
        try {
          s.push(r.contentWindow.postMessage(o, '*'));
        } catch (t) {
          n = t;
        }
      }
      return s;
    }),
    n
  );
}())),
window.FreshUrl || (window.FreshUrl = FreshUrl),
typeof _freshenUrlAfter !== 'undefined' && _freshenUrlAfter !== null
  ? (window.freshUrl = new FreshUrl(_freshenUrlAfter))
  : window.dataLayer
    ? dataLayer.push(() => (window.freshUrl = new FreshUrl(FreshUrl.librariesPresent())))
    : (window.freshUrl = new FreshUrl(FreshUrl.librariesPresent()));
