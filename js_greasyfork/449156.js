// ==UserScript==
// @name         学堂
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  解决积分要求 仅自动点击功能
// @author       LUOX
// @include      http://jgxt.zflclass.com//student/video*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449156/%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/449156/%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){document.getElementById("popup_ok").click();},1000);
    setInterval(function(){document.querySelector('video').playbackRate = 1.5},1000);
})();