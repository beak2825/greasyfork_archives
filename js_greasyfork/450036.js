// ==UserScript==
// @name         Webmota Ext
// @namespace    https://webmota.houtar.eu.org/
// @version      0.3
// @description  它提供了广告移除功能。
// @author       Houtar
// @match        *://*.webmota.com/comic/chapter/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webmota.com
// @license      GNU GPLv3
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/450036/Webmota%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/450036/Webmota%20Ext.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
  Array.prototype.forEach.call(document.getElementsByClassName("mobadsq"), function (el) {
    el.remove();
  });
})();
