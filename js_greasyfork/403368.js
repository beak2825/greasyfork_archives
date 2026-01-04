// ==UserScript==
// @name         Auto Boss
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.hupu.cdn.ttnba.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403368/Auto%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/403368/Auto%20Boss.meta.js
// ==/UserScript==

(function() {
setInterval(
() => {
if (document.querySelector('.cardwar-pve-boss-challenge')) {
    angular.element(document.querySelector('.cardwar-pve-boss-challenge')).triggerHandler('click');
};
if (document.querySelectorAll('.btn span')[2]) {
    angular.element(document.querySelectorAll('.btn span')[2]).triggerHandler('click');
};
}, 2000)})();