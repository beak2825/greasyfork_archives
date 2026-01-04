// ==UserScript==
// @name        Moegirlpedia Preview Fix
// @name:zh-CN  萌娘百科预览修复
// @namespace   https://greasyfork.org/zh-CN/users/163820-ysc3839
// @description Fix Moegirlpedia Mouse Hover Preview
// @description:zh-CN 修复萌娘百科鼠标悬停预览
// @license     MIT
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     3
// @author      ysc3839
// @match       *://zh.moegirl.org.cn/*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/487410/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%A2%84%E8%A7%88%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/487410/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%A2%84%E8%A7%88%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  let first_load = true;
  (function f() {
    const $ = unsafeWindow.jQuery;
    if (!$) {
      if (first_load) {
        first_load = false;
        setTimeout(f, 100);
      }
      return;
    }

    const API_PATH = '/api.php';
    // https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
    const FORBIDDEN_HEADERS = new Set([
      'Accept-Charset',
      'Accept-Encoding',
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method',
      'Connection',
      'Content-Length',
      'Cookie',
      'Date',
      'DNT',
      'Expect',
      'Host',
      'Keep-Alive',
      'Origin',
      'Permissions-Policy',
      'Referer',
      'TE',
      'Trailer',
      'Transfer-Encoding',
      'Upgrade',
      'Via',
    ]);

    $.ajaxTransport('json', function (options) {
      if (options.crossDomain || !options.async) return;
      if (!options.url.startsWith(API_PATH)) return;
      const u = new URL(options.url, document.baseURI);
      if (u.pathname !== API_PATH || u.host !== location.host) return;

      const s = u.searchParams;
      const prop = s.get('prop');
      if (prop) {
        const p = new Set(prop.split('|'));
        p.delete('revisions');
        s.set('prop', Array.from(p).join('|'));
      }
      s.delete('rvprop');
      s.delete('uselang');

      let callback;
      return {
        send: function (headers, complete) {
          // Apply custom fields if provided
          if (options.xhrFields) {
            console.warn('options.xhrFields unsupported', options.xhrFields);
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if (!options.crossDomain && !headers['X-Requested-With']) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
          }

          // Remove forbidden headers
          for (let i in headers) {
            if (i.startsWith('Proxy-') || i.startsWith('Sec-') || FORBIDDEN_HEADERS.has(i)) {
              delete headers[i];
            }
          }

          let controller;

          // Callback
          callback = function (type) {
            return function (xhr) {
              if (callback) {
                callback = null;

                if (type === 'abort') {
                  if (controller)
                    controller.abort();
                } else if (type === 'error') {
                  complete(
                    xhr.status,
                    xhr.statusText
                  );
                } else {
                  complete(
                    (xhr.status === 0) ? 200 : xhr.status,
                    xhr.statusText,
                    { text: xhr.responseText },
                    xhr.responseHeaders
                  );
                }
              }
            };
          };

          // Listen to events
          const onload = callback();
          const onerror = callback('error');

          // Create the abort callback
          callback = callback('abort');

          try {
            // Do send the request (this may raise an exception)
            controller = GM_xmlhttpRequest({
              url: u.href,
              method: options.type,
              user: options.username,
              password: options.password,
              overrideMimeType: options.mimeType,
              headers,
              data: options.hasContent && options.data || null,
              anonymous: true, // Sending cookie may cause server return api error
              onload,
              onabort: onerror,
              onerror,
              ontimeout: onerror,
            });
          } catch (e) {
            // trac-14683: Only rethrow if this hasn't been notified as an error yet
            if (callback) {
              throw e;
            }
          }
        },

        abort: function () {
          if (callback) {
            callback();
          }
        }
      };
    });
  })();
})();
