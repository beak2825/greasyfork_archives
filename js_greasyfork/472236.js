// ==UserScript==
// @name         GM Fetch
// @namespace    https://github.com/Sec-ant
// @version      1.2.3
// @author       Ze-Zheng Wu
// @description  A fetch API for GM_xmlhttpRequest / GM.xmlHttpRequest
// @license      MIT
// @homepage     https://github.com/Sec-ant/gm-fetch
// @homepageURL  https://github.com/Sec-ant/gm-fetch
// @source       https://github.com/Sec-ant/gm-fetch.git
// @supportURL   https://github.com/Sec-ant/gm-fetch/issues
// @downloadURL  https://fastly.jsdelivr.net/npm/@sec-ant/gm-fetch@latest/dist/gm-fetch.user.js
// @updateURL    https://fastly.jsdelivr.net/npm/@sec-ant/gm-fetch@latest/dist/gm-fetch.meta.js
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.gmFetch = factory());
  })(undefined, function() {
    var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
    var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
    function parseHeaders(rawHeaders) {
      var _a;
      const headers = new Headers();
      const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
      for (const line of preProcessedHeaders.split(/\r?\n/)) {
        const parts = line.split(":");
        const key = (_a = parts.shift()) == null ? void 0 : _a.trim();
        if (key) {
          const value = parts.join(":").trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn(`Response ${error.message}`);
          }
        }
      }
      return headers;
    }
    const gmFetch = async (input, init) => {
      const gmXhr = _GM_xmlhttpRequest || _GM.xmlHttpRequest;
      if (typeof gmXhr !== "function") {
        throw new DOMException(
          "GM_xmlhttpRequest or GM.xmlHttpRequest is not granted.",
          "NotFoundError"
        );
      }
      const request = new Request(input, init);
      if (request.signal.aborted) {
        throw new DOMException("Network request aborted.", "AbortError");
      }
      const data = await request.blob();
      const headers = Object.fromEntries(request.headers);
      new Headers(init == null ? void 0 : init.headers).forEach((value, key) => {
        headers[key] = value;
      });
      return new Promise((resolve, reject) => {
        let settled = false;
        const responseBlobPromise = new Promise((resolveBlob) => {
          const { abort } = gmXhr({
            method: request.method.toUpperCase(),
            url: request.url || location.href,
            headers,
            data: data.size ? data : void 0,
            redirect: request.redirect,
            binary: true,
            nocache: request.cache === "no-store",
            revalidate: request.cache === "reload",
            timeout: 3e5,
            responseType: gmXhr.RESPONSE_TYPE_STREAM ?? "blob",
            overrideMimeType: request.headers.get("Content-Type") ?? void 0,
            anonymous: request.credentials === "omit",
            onload: ({ response: responseBody }) => {
              if (settled) {
                resolveBlob(null);
                return;
              }
              resolveBlob(responseBody);
            },
            async onreadystatechange({
              readyState,
              responseHeaders,
              status,
              statusText,
              finalUrl,
              response: responseBody
            }) {
              if (readyState === XMLHttpRequest.DONE) {
                request.signal.removeEventListener("abort", abort);
              } else if (readyState !== XMLHttpRequest.HEADERS_RECEIVED) {
                return;
              }
              if (settled) {
                resolveBlob(null);
                return;
              }
              const parsedHeaders = parseHeaders(responseHeaders);
              const redirected = request.url !== finalUrl;
              const response = new Response(
                responseBody instanceof ReadableStream ? responseBody : await responseBlobPromise,
                {
                  headers: parsedHeaders,
                  status,
                  statusText
                }
              );
              Object.defineProperties(response, {
                url: {
                  value: finalUrl
                },
                type: {
                  value: "basic"
                },
                ...response.redirected !== redirected ? {
                  redirected: {
                    value: redirected
                  }
                } : {},
                // https://fetch.spec.whatwg.org/#forbidden-response-header-name
                ...parsedHeaders.has("set-cookie") || parsedHeaders.has("set-cookie2") ? {
                  headers: {
                    value: parsedHeaders
                  }
                } : {}
              });
              resolve(response);
              settled = true;
            },
            onerror: ({ statusText, error }) => {
              reject(
                new TypeError(statusText || error || "Network request failed.")
              );
              resolveBlob(null);
            },
            ontimeout() {
              reject(new TypeError("Network request timeout."));
              resolveBlob(null);
            },
            onabort() {
              reject(new DOMException("Network request aborted.", "AbortError"));
              resolveBlob(null);
            }
          });
          request.signal.addEventListener("abort", abort);
        });
      });
    };
    return gmFetch;
  });

})();