// ==UserScript==
// @name         遊戲角落 18跳過
// @namespace    http://tampermonkey.net/
// @version      1
// @description  跳過18
// @author       You
// @match        https://game.udn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543418/%E9%81%8A%E6%88%B2%E8%A7%92%E8%90%BD%2018%E8%B7%B3%E9%81%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/543418/%E9%81%8A%E6%88%B2%E8%A7%92%E8%90%BD%2018%E8%B7%B3%E9%81%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
const wrapper = document.querySelector('.classification');
if (wrapper) wrapper.remove();
})();