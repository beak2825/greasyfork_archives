// ==UserScript==
// @name         Cokcekirdek Send on Ctrl+Enter
// @namespace    https://github.com/veotaar
// @version      0.1
// @description  Send posts on cokcekirdek with Ctrl+Enter
// @author       outrun
// @match        https://cokcekirdek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481537/Cokcekirdek%20Send%20on%20Ctrl%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/481537/Cokcekirdek%20Send%20on%20Ctrl%2BEnter.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function() {
  'use strict';

  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
      const textAreaComment = Array.from(document.querySelectorAll('textarea.ps-comments__input[name="comment"]:has(+ input[value])'));
      const textAreaPost = document.querySelector('textarea.ps-postbox__input');
      const postInputValue = document.querySelector('textarea.ps-postbox__input + input')?.value;
      const postButton = document.querySelector('*:not([style*="display: none"]) button.postbox-submit');

      const activeTextArea = textAreaComment.filter(textarea => textarea === document.activeElement)[0];
      const activeDiv = activeTextArea?.closest('[id^="act-new-comment"]');
      const sendButton = activeDiv?.querySelector('.ps-comment-actions button.ps-button-action:not(:disabled)');

      // Send comment
      if (activeTextArea && sendButton) {
        sendButton.click();
        return;
      }

      // Send post
      if (textAreaPost === document.activeElement && postButton && postInputValue !== "") {
        postButton.click();
      }
    }
  });
})();