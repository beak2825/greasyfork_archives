/**
 * Original file: /npm/@trim21/gm-fetch@0.1.15/dist/gm_fetch.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var GM_fetch = (function () {
    "use strict";
    function e(e) {
      const t = e.trim();
      if (!t) return new Headers();
      const r = t.split("\r\n").map((e) => {
        let t = e.split(":");
        return [t[0].trim(), t[1].trim()];
      });
      return new Headers(r);
    }
    class t {
      constructor(e, t) {
        var r;
        (this.rawBody = e),
          (this.init = t),
          (this.body =
            ((r = e),
            new ReadableStream({
              start(e) {
                e.enqueue(r), e.close();
              },
            })));
        const {
          headers: s,
          statusCode: o,
          statusText: n,
          finalUrl: a,
          redirected: d,
        } = t;
        (this.headers = s),
          (this.status = o),
          (this.statusText = n),
          (this.url = a),
          (this.type = "basic"),
          (this.redirected = d),
          (this._bodyUsed = !1);
      }
      get bodyUsed() {
        return this._bodyUsed;
      }
      get ok() {
        return this.status < 300;
      }
      arrayBuffer() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'arrayBuffer' on 'Response': body stream already read"
          );
        return (this._bodyUsed = !0), this.rawBody.arrayBuffer();
      }
      blob() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'blob' on 'Response': body stream already read"
          );
        return (
          (this._bodyUsed = !0),
          Promise.resolve(
            this.rawBody.slice(0, this.rawBody.size, this.rawBody.type)
          )
        );
      }
      clone() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'clone' on 'Response': body stream already read"
          );
        return new t(this.rawBody, this.init);
      }
      formData() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'formData' on 'Response': body stream already read"
          );
        return (this._bodyUsed = !0), this.rawBody.text().then(r);
      }
      async json() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'json' on 'Response': body stream already read"
          );
        return (this._bodyUsed = !0), JSON.parse(await this.rawBody.text());
      }
      text() {
        if (this.bodyUsed)
          throw new TypeError(
            "Failed to execute 'text' on 'Response': body stream already read"
          );
        return (this._bodyUsed = !0), this.rawBody.text();
      }
    }
    function r(e) {
      const t = new FormData();
      return (
        e
          .trim()
          .split("&")
          .forEach(function (e) {
            if (e) {
              const r = e.split("="),
                s = r.shift()?.replace(/\+/g, " "),
                o = r.join("=").replace(/\+/g, " ");
              t.append(decodeURIComponent(s), decodeURIComponent(o));
            }
          }),
        t
      );
    }
    const s = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "TRACE",
      "OPTIONS",
      "CONNECT",
    ];
    function o(e) {
      if (((t = e), s.includes(t))) return e;
      var t;
      throw new Error(`unsupported http method ${e}`);
    }
    return async function (r, s) {
      const n = new Request(r, s);
      let a;
      return (
        s?.body && (a = await n.text()),
        await (function (r, s, n) {
          return new Promise((a, d) => {
            if (r.signal && r.signal.aborted)
              return d(new DOMException("Aborted", "AbortError"));
            GM.xmlHttpRequest({
              url: r.url,
              method: o(r.method.toUpperCase()),
              headers: Object.fromEntries(new Headers(s?.headers).entries()),
              data: n,
              responseType: "blob",
              onload(s) {
                a(
                  (function (r, s) {
                    return new t(s.response, {
                      statusCode: s.status,
                      statusText: s.statusText,
                      headers: e(s.responseHeaders),
                      finalUrl: s.finalUrl,
                      redirected: s.finalUrl === r.url,
                    });
                  })(r, s)
                );
              },
              onabort() {
                d(new DOMException("Aborted", "AbortError"));
              },
              ontimeout() {
                d(new TypeError("Network request failed, timeout"));
              },
              onerror(e) {
                d(new TypeError("Failed to fetch: " + e.finalUrl));
              },
            });
          });
        })(n, s, a)
      );
    };
  })();