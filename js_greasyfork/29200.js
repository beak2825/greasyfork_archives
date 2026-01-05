// ==UserScript==
// @name         F11 for FullScreen
// @name:zh-CN   F11全屏
// @version      0.1
// @description  make Edge fullsceen when press F11!
// @description:zh-cn 让Edge浏览器的F11键恢复作用
// @author       JoeyWNK
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/118753
// @downloadURL https://update.greasyfork.org/scripts/29200/F11%20for%20FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/29200/F11%20for%20FullScreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", function(e) {
        var key = event.which || event.keyCode;
        if (key == 122 && document.fullscreenEnabled){
            if (!document.fullscreenElement)
                document.documentElement.requestFullscreen();
            else if (document.exitFullscreen)
                document.exitFullscreen();
        }
    });
})();