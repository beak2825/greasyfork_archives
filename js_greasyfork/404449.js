// ==UserScript==
// @name         ABN New Messages
// @namespace    ABN New Messages
// @version      0.1.0
// @description  Add a link in the forum page to see most recent messages
// @author       Scorpathos
// @match        https://abnormal.ws/forums.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404449/ABN%20New%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/404449/ABN%20New%20Messages.meta.js
// ==/UserScript==

'use strict';

const linkboxes = document.getElementById("content").getElementsByClassName("linkbox");
const length = linkboxes.length;

if (length > 0) {
    const bottomBox = linkboxes[length - 1];
    const url = "forums.php?action=search&search=&type=body";
    const link = ` <a href="${url}" class="brackets">Voir les nouveaux messages</a>`;
    bottomBox.insertAdjacentHTML("beforeend", link);
}