// ==UserScript==
// @name         YouTube Age Restriction Bypass (Stealth Version)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Safely bypass YouTube age restrictions, undetectably, for testing/educational purposes only.
// @author       
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521089/YouTube%20Age%20Restriction%20Bypass%20%28Stealth%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521089/YouTube%20Age%20Restriction%20Bypass%20%28Stealth%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const debug = false;
  const log = msg => debug && console.log(`[YTBypass]: ${msg}`);

  function overridePlayability(data) {
    if (!data?.playabilityStatus) return data;
    const status = data.playabilityStatus.status;
    if (['AGE_VERIFICATION_REQUIRED', 'LOGIN_REQUIRED', 'UNPLAYABLE', 'RESTRICTED'].includes(status)) {
      data.playabilityStatus.status = 'OK';
      delete data.playabilityStatus.errorScreen;
      delete data.playabilityStatus.messages;
      log('Patched playability status.');
    }
    return data;
  }

  // Safe proxy for fetch
  const nativeFetch = window.fetch;
  window.fetch = new Proxy(nativeFetch, {
    apply(target, thisArg, args) {
      return Reflect.apply(target, thisArg, args).then(async response => {
        const cloned = response.clone();
        const url = (typeof args[0] === 'string') ? args[0] : args[0].url || '';

        if (url.includes('/youtubei/v1/player')) {
          try {
            const json = await cloned.json();
            const modified = overridePlayability(JSON.parse(JSON.stringify(json)));
            const blob = new Blob([JSON.stringify(modified)], { type: 'application/json' });
            return new Response(blob, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          } catch (e) {
            log(`Fetch patch failed: ${e.message}`);
            return response;
          }
        }
        return response;
      });
    }
  });

  // Safe proxy for XMLHttpRequest
  const NativeXHR = XMLHttpRequest;
  window.XMLHttpRequest = new Proxy(NativeXHR, {
    construct(target, args) {
      const xhr = new target(...args);
      let isBypassURL = false;
      const originalOpen = xhr.open;

      xhr.open = function (method, url) {
        isBypassURL = url.includes('/youtubei/v1/player');
        return originalOpen.apply(this, arguments);
      };

      const originalSend = xhr.send;
      xhr.send = function () {
        if (isBypassURL) {
          xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4 && xhr.responseType === '' && xhr.responseText) {
              try {
                const json = JSON.parse(xhr.responseText);
                overridePlayability(json);
              } catch (e) {
                log('XHR patch failed');
              }
            }
          });
        }
        return originalSend.apply(this, arguments);
      };

      return xhr;
    }
  });

  // Inject script in page context to patch initial responses
  function injectStealthPatchScript() {
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        try {
          const patch = (res) => {
            if (!res?.playabilityStatus) return;
            const status = res.playabilityStatus.status;
            if (['AGE_VERIFICATION_REQUIRED','RESTRICTED','LOGIN_REQUIRED'].includes(status)) {
              res.playabilityStatus.status = 'OK';
              delete res.playabilityStatus.errorScreen;
              console.log('[YTBypass] ytInitialPlayerResponse patched.');
            }
          };
          if (window.ytInitialPlayerResponse) patch(window.ytInitialPlayerResponse);
          if (window.ytplayer?.config?.args?.player_response) {
            const res = JSON.parse(window.ytplayer.config.args.player_response);
            patch(res);
            window.ytplayer.config.args.player_response = JSON.stringify(res);
          }
        } catch (_) {}
      })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }

  // Monitor page changes for player reload
  new MutationObserver(() => {
    if (document.querySelector('ytd-watch-flexy[is-restricted]')) {
      log('Restricted video detected.');
      setTimeout(injectStealthPatchScript, 1000);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();