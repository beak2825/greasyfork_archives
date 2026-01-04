// ==UserScript==
// @name         自动点击「全部已读」 (bbs.oldmantvg.net)
// @namespace    http://vDtv3vNZoE5d.com/
// @version      0.4
// @description  自动点击消息页面的「全部已读」按钮。
// @author       vDtv3vNZoE5d
// @match        https://bbs.oldmantvg.net/my-notice.htm
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480941/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%8C%E5%85%A8%E9%83%A8%E5%B7%B2%E8%AF%BB%E3%80%8D%20%28bbsoldmantvgnet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480941/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%8C%E5%85%A8%E9%83%A8%E5%B7%B2%E8%AF%BB%E3%80%8D%20%28bbsoldmantvgnet%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var readAllButton = document.querySelector('#readall');
        if (readAllButton) {
            readAllButton.click();
            console.log('全部已读！');
        }
    });
})();
