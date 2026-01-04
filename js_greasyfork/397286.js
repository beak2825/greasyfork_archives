// ==UserScript==
// @name         垃圾 Axure RP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/397286/%E5%9E%83%E5%9C%BE%20Axure%20RP.user.js
// @updateURL https://update.greasyfork.org/scripts/397286/%E5%9E%83%E5%9C%BE%20Axure%20RP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('body').setAttribute('plugindetected', true);
    // document.addEventListener('DOMContentLoaded', function () {
    //    console.log(document.querySelector('body'));
    // })
})();