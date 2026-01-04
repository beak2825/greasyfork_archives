// ==UserScript==
// @name         stable diffusion 3 去除3张/24h限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  白嫖stable diffusion 3地址：https://sdxlturbo.ai/stable-diffusion3
// @author       @王嗨皮
// @icon         https://sdxlturbo.ai/_next/static/media/logo.58e19c56.webp
// @match        https://sdxlturbo.ai/stable-diffusion3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493085/stable%20diffusion%203%20%E5%8E%BB%E9%99%A43%E5%BC%A024h%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/493085/stable%20diffusion%203%20%E5%8E%BB%E9%99%A43%E5%BC%A024h%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.cookie = "uniqueId=" + Array.from({length: 32}, () => Math.floor(Math.random() * 36).toString(36)).join('');
})();
