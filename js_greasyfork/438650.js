// ==UserScript==
// @name        QQ邮箱链接免跳转
// @include     *://mail.qq.com/*
// @include     *://exmail.qq.com/*
// @grant       none
// @version     1.0
// @author      kazutoiris
// @description QQ邮箱链接免跳转，一键直达，支持QQ邮箱、微信邮箱、腾讯企业邮箱
// @namespace https://greasyfork.org/users/865750
// @downloadURL https://update.greasyfork.org/scripts/438650/QQ%E9%82%AE%E7%AE%B1%E9%93%BE%E6%8E%A5%E5%85%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438650/QQ%E9%82%AE%E7%AE%B1%E9%93%BE%E6%8E%A5%E5%85%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    function patch(object, attr) {
        object[attr] = function() {
            // if (arguments[0].href) {
            //     console.log(arguments[0].href);
            // }
            return true;
        }
    }
    patch(window, 'openExtLink');
    patch(window, '_openExtLink');
})();