// ==UserScript==
// @name         ChatGPT TTS Grabber
// @namespace    https://github.com/dudebot/greasyfork-scripts/tree/main/ChatGPT
// @version      1.2.0
// @description  Automatically downloads ChatGPT's TTS audio with filename based on chat title.
// @author       dudebot
// @license      MIT
// @supportURL   https://github.com/dudebot/greasyfork-scripts/issues
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536858/ChatGPT%20TTS%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/536858/ChatGPT%20TTS%20Grabber.meta.js
// ==/UserScript==

(() => {
  const OrigMS = window.MediaSource;
  let latestTitleSlug = 'chatgpt';

  function updateTitleSlugFromBody(bodyText) {
    try {
      const json = JSON.parse(bodyText);
      const title = json && json.context && json.context.page && json.context.page.title;
      if (typeof title === 'string' && title.trim()) {
        let slug = title.trim().replace(/\s+/g, '_');
        slug = slug.replace(/[^\w\-]+/g, '');
        if (!slug) slug = 'chat';
        latestTitleSlug = slug;
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // hook fetch so we can grab context.page.title from /ces/v1/t
  const origFetch = window.fetch;
  window.fetch = function(input, init) {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof Request) {
      url = input.url;
    }

    if (url.includes('/ces/v1/t')) {
      // handle request object case
      if (input instanceof Request) {
        try {
          input.clone().text().then(updateTitleSlugFromBody).catch(() => {});
        } catch (e) {
          // ignore
        }
      } else if (init && typeof init.body === 'string') {
        updateTitleSlugFromBody(init.body);
      }
    }

    return origFetch.apply(this, arguments);
  };

  function getFilename(mime) {
    const ext = (mime.split('/')[1] || 'webm').split(';')[0];
    const safeSlug = latestTitleSlug || 'chatgpt';
    return `${safeSlug}-${Date.now()}.${ext}`;
  }

  function doDownload(url, mime) {
    const filename = getFilename(mime);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  window.MediaSource = function() {
    const ms = new OrigMS();
    const origAdd = ms.addSourceBuffer.bind(ms);

    ms.addSourceBuffer = mime => {
      const sb = origAdd(mime);

      if (mime.startsWith('audio/')) {
        const chunks = [];
        const origAppend = sb.appendBuffer.bind(sb);

        sb.appendBuffer = buf => {
          chunks.push(buf.slice(0));
          origAppend(buf);
        };

        // when the player calls endOfStream:
        ms.addEventListener('sourceended', () => {
          const blob = new Blob(chunks, { type: mime });
          const url = URL.createObjectURL(blob);
          doDownload(url, mime);
        });
      }

      return sb;
    };

    return ms;
  };

  window.MediaSource.prototype = OrigMS.prototype;
  MediaSource.isTypeSupported = OrigMS.isTypeSupported;
})();
