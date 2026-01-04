// ==UserScript==
// @name        Scroll - qq.com
// @namespace   Violentmonkey Scripts
// @match       https://wx.qq.com/
// @grant       none
// @version     1.0
// @license     GNU GPLv3
// @author      -
// @description 2023/5/12 18:25:56
// @downloadURL https://update.greasyfork.org/scripts/466135/Scroll%20-%20qqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/466135/Scroll%20-%20qqcom.meta.js
// ==/UserScript==


(function () {
    'use strict';

    document.getElementById('J_NavChatScrollBody').parentElement.style.overflow = "auto";
    document.getElementById('J_NavReadScrollBody').parentElement.style.overflow = "auto";
    document.getElementById('navContact').parentElement.style.overflow = "auto";

})();