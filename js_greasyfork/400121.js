// ==UserScript==
// @name         Json formatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       RobinTsai
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400121/Json%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/400121/Json%20formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var indentation = 4; // Change this to vary the indentation
     var pre = document.querySelector('body pre:only-of-type');  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-of-type

     if (!pre) return; // Don't do anything if this don't seem to be a json only document
     try {
         pre.innerHTML = JSON.stringify(JSON.parse(pre.innerHTML), null, indentation);
     } catch (e) {
         console.log(e);
     }
})();