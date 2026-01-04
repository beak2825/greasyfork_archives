// ==UserScript==
// @name         x.com photo full preview
// @namespace    http://tampermonkey.net/
// @description  解决推特预览图被裁剪，显示不全问题
// @version      1.0.0
// @author       zhowiny
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=19.5
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527908/xcom%20photo%20full%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/527908/xcom%20photo%20full%20preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('div[data-testid="tweetPhoto"]:has(div+img) > div {background-size: contain;}');
})();