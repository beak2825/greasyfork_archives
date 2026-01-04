// ==UserScript==
// @name         Override fetch with GM_xmlhttpRequest. Chatgpt generated
// @namespace    Violentmonkey
// @version      1.0
// @description  Replaces global fetch() with GM_xmlhttpRequest for cross-origin and controlled fetch support
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license      MIT2
// @downloadURL https://update.greasyfork.org/scripts/520367/Override%20fetch%20with%20GM_xmlhttpRequest%20Chatgpt%20generated.user.js
// @updateURL https://update.greasyfork.org/scripts/520367/Override%20fetch%20with%20GM_xmlhttpRequest%20Chatgpt%20generated.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === fetchToGM: Wrapper around GM_xmlhttpRequest ===
  function fetchToGM(request) {
    const req = request.clone();
    const headers = Object.fromEntries(req.headers.entries());
    const method = req.method.toUpperCase();

    const serializeFormData = async (formData) => {
      return new Promise((resolve) => {
        const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substr(2);
        let body = "";

        for (const [key, value] of formData.entries()) {
          body += `--${boundary}\r\n`;
          if (value instanceof Blob) {
            body += `Content-Disposition: form-data; name="${key}"; filename="${value.name || 'file'}"\r\n`;
            body += `Content-Type: ${value.type || "application/octet-stream"}\r\n\r\n`;
            body += "[Binary data omitted]\r\n";
          } else {
            body += `Content-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
          }
        }
        body += `--${boundary}--`;
        headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
        resolve(body);
      });
    };

    const readBody = async () => {
      if (method === "GET" || method === "HEAD") return null;

      const contentType = headers["Content-Type"] || headers["content-type"] || "";

      if (req.body instanceof FormData) {
        return serializeFormData(req.body);
      }

      if (req.body instanceof Blob) {
        return req.body.text();
      }

      if (contentType.includes("application/json")) {
        return req.text();
      }

      return req.text();
    };

    return new Promise((resolve, reject) => {
      readBody().then(data => {
        GM_xmlhttpRequest({
          method,
          url: req.url,
          headers,
          data,
          anonymous: req.credentials === "omit",
          withCredentials: req.credentials === "include",
          onload: function (res) {
            let responseBody = res.responseText;
            let responseHeaders = res.responseHeaders;

            const response = new Response(responseBody, {
              status: res.status,
              statusText: res.statusText,
              headers: parseResponseHeaders(responseHeaders)
            });

            resolve(response);
          },
          onerror: () => reject(new TypeError("Network request failed")),
          ontimeout: () => reject(new TypeError("Network request timed out")),
          onabort: () => reject(new TypeError("Network request aborted")),
        });
      }).catch(reject);
    });
  }

  // === Helper to parse GM response headers into a Headers object ===
  function parseResponseHeaders(headerStr) {
    const headers = new Headers();
    if (!headerStr) return headers;
    const pairs = headerStr.trim().split(/[\r\n]+/);
    for (const line of pairs) {
      const parts = line.split(": ");
      const key = parts.shift();
      const value = parts.join(": ");
      headers.append(key, value);
    }
    return headers;
  }

  // === 🧠 Override Global fetch() ===
  window.fetch = function (input, init) {
    const request = input instanceof Request ? input : new Request(input, init);
    return fetchToGM(request);
  };

  console.log("✅ window.fetch has been overridden by fetchToGM");

})();
