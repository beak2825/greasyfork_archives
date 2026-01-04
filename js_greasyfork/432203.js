// ==UserScript==
// @name     Remove dueling book chat
// @description Simply removes the chat/statuses section on the dueling book main page.
// @version  0.1
// @include https://www.duelingbook.com/
// @namespace https://greasyfork.org/users/814104
// @downloadURL https://update.greasyfork.org/scripts/432203/Remove%20dueling%20book%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/432203/Remove%20dueling%20book%20chat.meta.js
// ==/UserScript==

var chat = document.getElementById('statuses');
if (chat) {
    chat.parentNode.removeChild(chat);
}
