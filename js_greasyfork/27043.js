// ==UserScript==
// @name         阿里云 云栖社区 快速回复
// @namespace    http://www.ixiqin.com/
// @version      0.1
// @description  Ctrl + Enter 快速回复
// @author       西秦公子
// @match        https://yq.aliyun.com/ask/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27043/%E9%98%BF%E9%87%8C%E4%BA%91%20%E4%BA%91%E6%A0%96%E7%A4%BE%E5%8C%BA%20%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/27043/%E9%98%BF%E9%87%8C%E4%BA%91%20%E4%BA%91%E6%A0%96%E7%A4%BE%E5%8C%BA%20%E5%BF%AB%E9%80%9F%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
        function keyDown(e) {
            if (e.which == 13 && e.ctrlKey) {
                $('.js-answer-create').submit();
            }
        }
        document.onkeydown = keyDown;
})();