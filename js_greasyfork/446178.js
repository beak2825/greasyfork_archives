// ==UserScript==
// @name         USTB-VPN-counter-killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除USTB外网访问网站的10s弱密码提示
// @author       WitchElaina
// @match        https://n.ustb.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446178/USTB-VPN-counter-killer.user.js
// @updateURL https://update.greasyfork.org/scripts/446178/USTB-VPN-counter-killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onkeydown=function(){
        document.getElementsByClassName('el-dialog__wrapper psd-dialog')[0].remove();
        document.getElementsByClassName('v-modal')[0].remove();
    }
    // Your code here...
})();