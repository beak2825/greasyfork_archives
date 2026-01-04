// ==UserScript==
// @name            Inbox button canardpc.com
// @name:fr         Bouton "Tableau de bord" canardpc.com
// @description:fr  12/03/2025 19:04:17
// @namespace       Violentmonkey Scripts
// @match           https://forum.canardpc.com/*
// @grant           none
// @version         1.0
// @author          sangoon
// @license         MIT
// @description     12/03/2025 19:04:17
// @downloadURL https://update.greasyfork.org/scripts/532456/Inbox%20button%20canardpccom.user.js
// @updateURL https://update.greasyfork.org/scripts/532456/Inbox%20button%20canardpccom.meta.js
// ==/UserScript==;;;
const i = document.createElement('i');
i.className = 'b-icon-fa b-icon-fa--32 fa-solid fa-inbox';
const a = document.createElement('a');
a.href = 'https://forum.canardpc.com/search?searchJSON=%7B%22view%22%3A%22topic%22%2C%22unread_only%22%3A1%2C%22sort%22%3A%7B%22lastcontent%22%3A%22desc%22%7D%2C%22exclude_type%22%3A%5B%22vBForum_PrivateMessage%22%5D%2C%22my_following%22%3A%221%22%7D';
a.appendChild(i);
const li = document.createElement('li');
li.className = 'b-top-menu__item js-shrink-event-child';
li.appendChild(a);
document.querySelector("#vb-page-body > nav > div > ul").prepend(li);

const stickTopMenuBtn = document.querySelector("#stick-topmenu-btn")
stickTopMenuBtn.className = 'b-icon-fa b-icon-fa--32 fa-solid fa-thumbtack';
stickTopMenuBtn.style = 'opacity: 1; cursor: pointer;';