// ==UserScript==
// @name         CSDN 外链自动跳转
// @namespace    https://pdev.top/
// @version      1.0.0
// @description  CSDN 外链自动跳转，如果 Gitee 有加速那么首先跳转到 Gitee 加速
// @author       Peter1303
// @match        https://link.csdn.net/?target=*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428211/CSDN%20%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428211/CSDN%20%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkLink() {
        let link = ''
        let buttons = $('#linkPage .content .flex-end .loading-btn')
        link = buttons.eq(buttons.length - 1).attr('href')
        if (link != undefined) {
            window.clearInterval(linkInterval)
            window.location.href = link
        }
    }
    var linkInterval = setInterval(checkLink, 100)
})();