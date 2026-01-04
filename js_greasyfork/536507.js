// ==UserScript==
// @name         Cmanga Popup Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tự động loại bỏ popup và hiển thị nội dung trên các trang web có tên miền cmanga
// @author       You
// @match        https://cmangax2.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536507/Cmanga%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/536507/Cmanga%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        $(".popup_content").attr("style", "display: none !important;");
        $(".chapter_content").attr("style", "opacity: 1 !important;");
    }, 2000);
})();