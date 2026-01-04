// ==UserScript==
// @name         华为云论坛快捷回复
// @namespace    http://www.ixiqin.com/
// @version      0.1.1
// @description  Ctrl+Enter 快速提交回复
// @author       Bestony
// @match        https://forum.huaweicloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40523/%E5%8D%8E%E4%B8%BA%E4%BA%91%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/40523/%E5%8D%8E%E4%B8%BA%E4%BA%91%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function keyDown(e) {
            if (e.which == 13 && e.ctrlKey) {
               checkname('fastpostform');
            }
        }
        document.onkeydown = keyDown;
})();