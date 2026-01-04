// ==UserScript==
// @name         KG_RmDisabledAttribute
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Unblock private chat
// @author       You
// @match        http://klavogonki.ru/gamelist/
// @match        https://klavogonki.ru/gamelist/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33348/KG_RmDisabledAttribute.user.js
// @updateURL https://update.greasyfork.org/scripts/33348/KG_RmDisabledAttribute.meta.js
// ==/UserScript==

setTimeout (function() {
    'use strict';

   document.querySelector('.text').removeAttribute("disabled");
   document.querySelector('.send').removeAttribute("disabled");
   document.querySelector('.text').value = "";
}, 5000)();