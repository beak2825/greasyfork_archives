// ==UserScript==
// @name         Dim images
// @namespace    who knows
// @version      0.1
// @description  dim , darken images , reduce brightness
// @author       atylo
// @match        *://*/*
// @grant          GM_deleteValue
// @grant          GM_getResourceURL
// @grant          GM_getValue
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM.deleteValue
// @grant          GM.getResourceUrl
// @grant          GM.getValue
// @grant          GM.openInTab
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412235/Dim%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/412235/Dim%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create our stylesheet
var style = document.createElement('style');
style.innerHTML =
'img {' +
 'filter:brightness(0.5);' +
'}' +
'img:hover {' +
 'filter:brightness(0.9);' +
 'transition:1s;' +
'}' +
    'div.image-container {' +
 'filter:brightness(0.5);' +
'}' +
'div.image-container:hover {' +
 'filter:brightness(0.9);' +
 'transition:1s;' +
'}';

// Get the first script tag
var ref = document.querySelector('script');

// Insert our new styles before the first script tag
ref.parentNode.insertBefore(style, ref);

})();