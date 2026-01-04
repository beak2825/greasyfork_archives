// ==UserScript==
// @name         ChatGPT chat Send message on ctrl+Enter
// @namespace    byabyabya
// @version      0.0.4
// @description  bya bya bya
// @author       byabyabya
// @match        https://chat.openai.com/chat*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463321/ChatGPT%20chat%20Send%20message%20on%20ctrl%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/463321/ChatGPT%20chat%20Send%20message%20on%20ctrl%2BEnter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName.toLowerCase() === 'textarea' && e.code == "Enter" && !e.ctrlKey) {
        e.stopPropagation();
      }
    }, { capture: true });
})();