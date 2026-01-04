// ==UserScript==
// @version 1
// @license MIT
// @name        Скрыть удаленные сообщения
// @description Скрывает удаленные сообщения
// @namespace   zalupa
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/523950/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523950/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideDeletedMessages() {
        const deletedMessages = document.querySelectorAll('li.messageSimple.deleted');

        deletedMessages.forEach(message => {
            message.style.display = 'none';
        });
    }

    hideDeletedMessages();

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if(mutation.addedNodes.length) {
          hideDeletedMessages()
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();