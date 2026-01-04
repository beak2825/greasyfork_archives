// ==UserScript==
// @name         Kook 自动跳转
// @namespace    http://github.com/tajoy
// @version      0.1
// @description  Kook的外部连接页面自动跳转功能
// @author       Tajoy tj328111241@gmail.com
// @license      MIT
// @match        *://www.kookapp.cn/go-wild.html*
// @icon         https://www.kookapp.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464357/Kook%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464357/Kook%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function jump() {
        var elm = document.getElementsByClassName("jump-button")[0]
        if (elm) {
            elm.click();
        } else {
            setTimeout(jump, 0);
        }
    }
    jump();
})();