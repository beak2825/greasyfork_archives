// ==UserScript==
// @name        ChatGPT Preserve Prompt Textarea
// @namespace   UserScript
// @match       https://chat.openai.com/*
// @grant       none
// @version     0.1.4
// @author      CY Fung
// @license     MIT
// @run-at      document-idle
// @description To preserve last typed prompt messages for chat being switched
// @downloadURL https://update.greasyfork.org/scripts/470979/ChatGPT%20Preserve%20Prompt%20Textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/470979/ChatGPT%20Preserve%20Prompt%20Textarea.meta.js
// ==/UserScript==

(() => {
  let tzz = 0;
  let jKey = null;
  let jValue = null;
  let isValid = () => { return false; }
  const map = new Map();
  (async () => {
    let wPathname = null;
    while (true) {
      await new Promise(r => requestAnimationFrame(r));
      let sPathname = location.pathname;
      if (wPathname === sPathname) continue;
      wPathname = sPathname;

      const vKey = jKey;
      const vValue = jValue;
      if (vKey) {
        Promise.resolve().then(() => {
          map.set(vKey, vValue);
        });
      }
      jKey = null;
      jValue = null;

      let tid = tzz;
      isValid = () => { return false }
      let expired = Date.now() + 200;
      while (Date.now() < expired) {
        let textarea = document.querySelector('textarea#prompt-textarea');
        if (textarea && !textarea.value) break;
        if (location.pathname !== sPathname) break;
        await new Promise(r => requestAnimationFrame(r));
        if (tid !== tzz) break;
      }
      if (location.pathname !== sPathname) continue;
      expired = Date.now() + 80;
      let s = map.get(location.pathname);
      if (s) {
        while (Date.now() < expired) {
          let textarea = document.querySelector('textarea#prompt-textarea');
          if (!textarea) break;
          if (location.pathname !== sPathname) break;
          if (textarea.value !== s && tid === tzz) textarea.value = s;
          await new Promise(r => requestAnimationFrame(r));
          if (tid !== tzz) break;
        }
        let textarea = document.querySelector('textarea#prompt-textarea');
        if (textarea && tid === tzz) {
          textarea.focus();
          textarea.value = '';
          try {
            document.execCommand("insertText", false, s)
          } catch (e) {
            textarea.value = s;
          }
        }
      }
      await new Promise(r => requestAnimationFrame(r));
      if (location.pathname !== sPathname) continue;
      ((pathname) => {
        isValid = function () { return location.pathname === pathname }
      })(location.pathname);
      let textarea = document.querySelector('textarea#prompt-textarea');
      if (textarea && textarea.value) {
        map.set(location.pathname, textarea.value);
      }
    }
  })();

  const eventHandler = (evt) => {
    const target = (evt || 0).target;
    if ((target || 0).id !== 'prompt-textarea') return;
    if (++tzz > 1e9) tzz = 9;
    if (isValid()) {
      jKey = location.pathname;
      jValue = target.value;
    }
  }

  document.addEventListener('keydown', eventHandler, true);
  document.addEventListener('keyup', eventHandler, true);
  document.addEventListener('change', eventHandler, true);
})();