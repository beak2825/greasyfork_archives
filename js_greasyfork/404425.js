// ==UserScript==
// @name           KG_PrivateChatLink
// @namespace      klavogonki
// @include        http://klavogonki.ru/gamelist/
// @include        https://klavogonki.ru/g/*
// @author         NoNe
// @description    Private dialog in the chat (Shift + LMB) on nickname of the user in the messages block
// @version        0.1
// @downloadURL https://update.greasyfork.org/scripts/404425/KG_PrivateChatLink.user.js
// @updateURL https://update.greasyfork.org/scripts/404425/KG_PrivateChatLink.meta.js
// ==/UserScript==

(function () {
  var matches = document.body.msMatchesSelector ? 'msMatchesSelector' : 'matches';

  window.addEventListener('click', function (event) {
    if (!event.shiftKey) {
      return;
    }

    var target = event.target;
    if (!target[matches]('.chat .username > span')) {
      return;
    }

    var inputs = document.querySelectorAll('.chat input.text');
    [].forEach.call(inputs, function (input) {
      // Check the input is visible:
      if (input.offsetParent) {
        input.value = '<' + target.textContent + '>';
        input.focus();
      }
    });

    event.stopPropagation();
  }, true);
})();
