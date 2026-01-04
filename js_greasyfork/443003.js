// ==UserScript==
// @name         pornhub without vk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove registration through vk
// @author       You
// @match        https://rt.pornhub.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443003/pornhub%20without%20vk.user.js
// @updateURL https://update.greasyfork.org/scripts/443003/pornhub%20without%20vk.meta.js
// ==/UserScript==

(function() {
    'use strict';
 	var input = document.querySelector("#age-verification-container");
	input.remove();
	var input = document.querySelector("#age-verification-wrapper");
	input.remove();
})();