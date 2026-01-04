// ==UserScript==
// @name         Fps Booster
// @match        https://*.tankionline.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tankionline.com
// @version      3.0
// @author       uzi
// @description  Anonymous 
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/914747
// @downloadURL https://update.greasyfork.org/scripts/452231/Fps%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/452231/Fps%20Booster.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
let MAX = 300;
requestAnimationFrame = (a) => setTimeout(a, 1e3/MAX)
})();