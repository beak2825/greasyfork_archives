// ==UserScript==
// @name       ChatGPT Enter Fix (GPT4)
// @name:ja       ChatGPT Enter Fix (GPT4)
// @namespace    http://tampermonkey.net/
// @description  This Chrome/Safari extension addresses the issue where ChatGPT sends text even when the Enter key is pressed during Japanese conversion.
// @description:ja  ChatGPTにおいて日本語IMEで変換中にEnterを押した時に送信されてしまうの問題を阻止します。 Safariにも対応。
// @version      2.0
// @author       satosh1suzuk1, d-engine
// @match      https://chat.openai.com/chat
// @match      https://chat.openai.com/chat/*
// @downloadURL https://update.greasyfork.org/scripts/461838/ChatGPT%20Enter%20Fix%20%28GPT4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461838/ChatGPT%20Enter%20Fix%20%28GPT4%29.meta.js
// ==/UserScript==

// wrap in anonymous scope to prevent confliction.
(() => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  window.addEventListener("load", ()=> {
    const tryInject = () => {
      const textarea = document.querySelector('textarea[tabindex="0"]');
      if (!textarea) {
        return;
      }
      if(textarea.dataset.isInjected === 'true'){
        return;
      }
      textarea.dataset.isInjected = 'true';

      textarea.addEventListener(
        "keydown",
        (event) => {
          // SafariではisComposingが機能しない。 普通のEnterはkeyCodeが13に、IME確定のEnterは229になる
          if (
            (isSafari && event.keyCode === 229) ||
            (event.key === "Enter" && event.isComposing)
          ) {
            event.target.dataset.isComposing = 'true';
            event.stopPropagation();
          }
        },
        { capture: true }
      );
      textarea.addEventListener(
        "keyup",
        (event) => {
          if (event.key === "Enter" && event.target.dataset.isComposing === 'true') {
              event.stopPropagation();
          }
        },
        { capture: true }
      );
    }
    setInterval(tryInject, 1000);
  }, false);
})();
