// ==UserScript==
// @name       ChatGPT Enter Fix (GPT4)
// @name:ja       ChatGPT Enter Fix (GPT4)
// @namespace    http://tampermonkey.net/
// @description  This Chrome/Safari extension addresses the issue where ChatGPT sends text even when the Enter key is pressed during Japanese conversion.
// @description:ja  ChatGPTにおいて日本語IMEで変換中にEnterを押した時に送信されてしまうの問題を阻止します。 Safariにも対応。
// @version      2.1
// @author       satosh1suzuk1, d-engine
// @match      https://chat.openai.com
// @match      https://chat.openai.com/*
// @downloadURL https://update.greasyfork.org/scripts/461522/ChatGPT%20Enter%20Fix%20%28GPT4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461522/ChatGPT%20Enter%20Fix%20%28GPT4%29.meta.js
// ==/UserScript==

// wrap in anonymous scope to prevent confliction.
(() => {
  console.log('chatGPT fix')
  const tryInject = () => {
    console.log('tryInject')
    const textarea = document.getElementById('prompt-textarea')
    if (!textarea) {
      return;
    }
    // Documentが存在する場合のみ、処理を実行する
    clearInterval(interval);

    textarea.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          // [IME is on] && [Pressed Enter first time]
          if ( event.target.dataset.isComposing === 'true' && event.target.dataset.previousKey !== "Enter" ) {
            event.stopPropagation();
          }
        }
        event.target.dataset.previousKey = event.key;
        if (event.isComposing) {
          event.target.dataset.isComposing = 'true';
        } else {
          delete event.target.dataset.isComposing;
        }
      },
      { capture: true }
    );
  }
  const interval = setInterval(tryInject, 100);
})();