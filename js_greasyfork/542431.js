// ==UserScript==
// @name        4ndr0tools-Pixverse++
// @namespace   https://github.com/4ndr0666/userscripts
// @author      4ndr0666
// @version     1.3
// @description Bypass Pixverse video blocks, auto-reveal download, intercept all API methods (XHR+fetch), credit restore, and automatic prompt obfuscation to bypass moderation using zero-width spaces.
// @match       https://app.pixverse.ai/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/542431/4ndr0tools-Pixverse%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/542431/4ndr0tools-Pixverse%2B%2B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ───────────────────────────── CONSTANTS & STATE ────────────────────────────── */
  const DEBUG_PREFIX = '[Pixverse Bypass]';
  const MAX_ATTEMPTS = 30;
  let savedMediaPath = null;
  let isInitialized  = false;
  let btnAttached    = false;

  /* ──────────────────────────────── LOGGING HELPERS ───────────────────────────── */
  function log(...args)   { console.log(`${DEBUG_PREFIX}`, ...args); }
  function error(...args) { console.error(`${DEBUG_PREFIX}`, ...args); }

  /* ──────────────── API RESPONSE MODIFICATION CORE ───────────────── */

  function extractMediaPath(data, url) {
    if (!data) return null;
    if (url.includes('/media/batch_upload_media')) {
      return data?.images?.[0]?.path || null;
    } else if (url.includes('/media/upload')) {
      return data?.path || null;
    }
    return null;
  }

  function tryModifyCredits(data) {
    if (data?.Resp?.credits !== undefined) {
      log('Restoring credits to 100');
      data.Resp.credits = 100;
      return data;
    }
    return null;
  }

  function modifyVideoList(data) {
    if (!data?.Resp?.data) return data;
    return {
      ...data,
      Resp: {
        ...data.Resp,
        data: data.Resp.data.map(item => ({
          ...item,
          video_status: item.video_status === 7 ? 1 : item.video_status,
          first_frame: (item.extended === 1 && item.customer_paths?.customer_video_last_frame_url) ||
                      item.customer_paths?.customer_img_url || '',
          url: item.video_path ? `https://media.pixverse.ai/${item.video_path}` : ''
        }))
      }
    };
  }

  function modifyBatchUpload(data) {
    if ([400, 403, 401].includes(data?.ErrCode) && savedMediaPath) {
      const imageId   = Date.now();
      const imageName = savedMediaPath.split('/').pop() || 'uploaded_media';
      return {
        ErrCode: 0,
        ErrMsg: "success",
        Resp: {
          result: [{
            id: imageId,
            category: 0,
            err_msg: "",
            name: imageName,
            path: savedMediaPath,
            size: 0,
            url: `https://media.pixverse.ai/${savedMediaPath}`
          }]
        }
      };
    }
    return data;
  }

  function modifySingleUpload(data) {
    if ([400040, 500063, 403, 401].includes(data?.ErrCode) && savedMediaPath) {
      log('Bypassing ErrCode:', data.ErrCode, 'with savedMediaPath:', savedMediaPath);
      return {
        ErrCode: 0,
        ErrMsg: "success",
        Resp: {
          path: savedMediaPath,
          url: `https://media.pixverse.ai/${savedMediaPath}`,
          name: savedMediaPath.split('/').pop() || 'uploaded_media',
          type: 1
        }
      };
    }
    log('No modification applied for ErrCode:', data?.ErrCode);
    return data;
  }

  function modifyResponse(data, url) {
    if (!data || typeof data !== 'object') return null;
    if (url.includes('/user/credits')) return tryModifyCredits(data);
    else if (url.includes('/video/list/personal')) return modifyVideoList(data);
    else if (url.includes('/media/batch_upload_media')) return modifyBatchUpload(data);
    else if (url.includes('/media/upload')) return modifySingleUpload(data);
    return null;
  }

  /* ────────────── PROMPT OBFUSCATION FOR MODERATION BYPASS ────────────── */
  const sensitiveWords = [
    'deep', 'throat', 'throats', 'blowjob', 'fellatio', 'fuck', 'fucking', 'pussy', 'cock', 'dick',
    'tits', 'boobs', 'asshole', 'shit', 'suck', 'sucks', 'sucking', 'penis', 'vagina', 'anus', 'breasts',
    'sex', 'intercourse', 'oral', 'anal', 'nsfw' // Add more as needed
  ];

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function obfuscateWord(word) {
    return word.split('').join('\u200B'); // Insert zero-width space between each letter
  }

  function obfuscatePrompt(prompt) {
    let modified = prompt;
    for (const sensitive of sensitiveWords) {
      const regex = new RegExp(`\\b${escapeRegExp(sensitive)}\\b`, 'gi');
      modified = modified.replace(regex, match => obfuscateWord(match));
    }
    return modified;
  }

  /* ────────────── XHR INTERCEPTOR ────────────── */

  function overrideXHR() {
    if (!window.XMLHttpRequest) {
      error('XMLHttpRequest not supported');
      return;
    }
    try {
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.open = function (method, url) {
        this._pixverseRequestUrl = url;
        return originalOpen.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function (body) {
        let currentBody = body;
        const url = this._pixverseRequestUrl || '';

        // Obfuscate prompt for video creation to bypass moderation
        if (url.includes('/creative_platform/video/') && currentBody && typeof currentBody === 'string') {
          try {
            const data = JSON.parse(currentBody);
            if (data.prompt) {
              const originalPrompt = data.prompt;
              data.prompt = obfuscatePrompt(originalPrompt);
              currentBody = JSON.stringify(data);
              log('Obfuscated prompt to bypass moderation:', { original: originalPrompt, modified: data.prompt });
            }
          } catch (e) {
            error('Error obfuscating video creation prompt:', e);
          }
        }

        // Capture media path
        if ((url.includes('/media/batch_upload_media') || url.includes('/media/upload')) && currentBody) {
          try {
            let data = currentBody;
            if (currentBody instanceof FormData) {
              data = Object.fromEntries(currentBody);
            } else if (typeof currentBody === 'string') {
              data = JSON.parse(currentBody || '{}');
            }
            savedMediaPath = extractMediaPath(data, url);
            log('Captured media path:', savedMediaPath, 'from request:', data);
          } catch (e) {
            error('Error parsing request body:', e, 'Body:', currentBody);
          }
        }

        const self = this;
        const loadHandler = function () {
          if (self.status >= 200 && self.status < 300) {
            try {
              let response = (self.responseType === 'json' ? self.response : JSON.parse(self.responseText || '{}'));
              let modified = modifyResponse(response, url);
              if (modified) {
                Object.defineProperties(self, {
                  response:     { value: modified, writable: true, configurable: true },
                  responseText: { value: JSON.stringify(modified), writable: true, configurable: true }
                });
                log('XHR response modified:', url, 'Modified response:', modified);
              } else {
                log('XHR response not modified:', url, 'Original response:', response);
              }
            } catch (e) {
              error('XHR response processing error:', e, 'Response:', self.responseText);
            }
          } else {
            error('XHR request failed with status:', self.status, 'URL:', url);
          }
        };
        self.addEventListener('load', loadHandler, { once: true });

        return originalSend.apply(self, [currentBody]);
      };
      log('XHR overrides initialized');
    } catch (e) {
      error('XHR override failed:', e);
    }
  }

  /* ────────────── FETCH INTERCEPTOR ────────────── */
  function overrideFetch() {
    if (!window.fetch) {
      error('Fetch API not supported');
      return;
    }
    try {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        let [input, init] = args;
        let url = typeof input === 'string' ? input : (input?.url || '');
        let reqBody = init?.body || '';

        let currentInit = { ...init };

        // Obfuscate prompt for video creation to bypass moderation
        if (url.includes('/creative_platform/video/') && reqBody && typeof reqBody === 'string') {
          try {
            const data = JSON.parse(reqBody);
            if (data.prompt) {
              const originalPrompt = data.prompt;
              data.prompt = obfuscatePrompt(originalPrompt);
              currentInit.body = JSON.stringify(data);
              log('FETCH: Obfuscated prompt to bypass moderation:', { original: originalPrompt, modified: data.prompt });
            }
          } catch (e) {
            error('FETCH: Error obfuscating video creation prompt:', e);
          }
        }

        // Capture media path if uploading
        if ((url.includes('/media/batch_upload_media') || url.includes('/media/upload')) && reqBody) {
          try {
            let data = reqBody;
            if (reqBody instanceof FormData) {
              data = Object.fromEntries(reqBody);
            } else if (typeof reqBody === 'string') {
              data = JSON.parse(reqBody || '{}');
            }
            savedMediaPath = extractMediaPath(data, url);
            log('FETCH: Captured media path:', savedMediaPath, 'from request:', data);
          } catch (e) {
            error('FETCH: Error parsing request body:', e, 'Body:', reqBody);
          }
        }

        // Pass through, then patch the response if necessary
        let res = await originalFetch.call(this, input, currentInit);
        let cloned = res.clone();

        try {
          if (cloned.headers.get('content-type')?.includes('application/json')) {
            let json = await cloned.json();
            let modified = modifyResponse(json, url);
            if (modified) {
              let newRes = new Response(JSON.stringify(modified), {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers,
              });
              Object.defineProperties(newRes, {
                json: {
                  value: () => Promise.resolve(modified),
                  writable: false,
                  configurable: true
                },
                text: {
                  value: () => Promise.resolve(JSON.stringify(modified)),
                  writable: false,
                  configurable: true
                }
              });
              log('FETCH: Response modified:', url, 'Modified response:', modified);
              return newRes;
            } else {
              log('FETCH: Response not modified:', url, 'Original response:', json);
            }
          }
        } catch (e) {
          error('FETCH: Response handling error:', e);
        }
        return res;
      };
      log('Fetch override initialized');
    } catch (e) {
      error('Fetch override failed:', e);
    }
  }

  /* ────────────────────────────────────────────────────────────── */

  // Watermark-free download button logic (robust/SPA-aware)
  function setupWatermarkButton() {
    if (btnAttached) return;
    function tryAttachButton(attempts = 0) {
      let watermarkDiv = Array.from(document.querySelectorAll('div,button')).find(
        el => (el.textContent.trim() === 'Watermark-free')
      );
      if (!watermarkDiv) {
        if (attempts < MAX_ATTEMPTS) {
          setTimeout(() => tryAttachButton(attempts + 1), 350);
        }
        return;
      }

      if (watermarkDiv.dataset.ytdlcInjected) return;

      const newButton = document.createElement('button');
      newButton.textContent = 'Watermark-free';
      const computed = window.getComputedStyle(watermarkDiv);
      newButton.style.cssText = computed.cssText || '';
      newButton.style.background = '#142830';
      newButton.style.color      = '#15FFFF';
      newButton.style.fontWeight = 'bold';
      newButton.style.cursor     = 'pointer';
      newButton.style.borderRadius = '6px';
      newButton.style.marginLeft = '8px';
      newButton.style.padding    = '6px 12px';

      newButton.onclick = function (event) {
        event.stopPropagation();
        const videoElement = document.querySelector(".component-video > video, video");
        if (videoElement && videoElement.src) {
          const videoUrl = videoElement.src;
          log('[Watermark-free] Video URL:', videoUrl);

          const link = document.createElement('a');
          link.href = videoUrl;
          link.download = videoUrl.split('/').pop() || 'video.mp4';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          log('[Watermark-free] Download triggered for:', videoUrl);
        } else {
          error('[Watermark-free] Video element not found or no src attribute');
          alert('Could not find the video to download. Please ensure a video is loaded.');
        }
      };

      watermarkDiv.parentNode.replaceChild(newButton, watermarkDiv);
      newButton.dataset.ytdlcInjected = '1';
      btnAttached = true;
      log('[Watermark-free] Button replaced and listener attached');
    }

    tryAttachButton();
    const mo = new MutationObserver(() => tryAttachButton());
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ────────────── INITIALIZATION ────────────── */
  function initialize() {
    if (isInitialized) return;
    try {
      overrideXHR();
      overrideFetch();
      setupWatermarkButton();
      isInitialized = true;
      log('Script initialized successfully');
    } catch (e) {
      error('Initialization failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

})();