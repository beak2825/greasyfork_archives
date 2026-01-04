// ==UserScript==
// @name         青铜器辅助
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动登录+破解时间日期选择限制
// @author       luc
// @match        http://it.maxvisioncloud.com:52801/*
// @match        http://183.94.24.139:2000/*
// @icon         http://maxvision.eicp.net:52800/maxhome/ui/images/nav-01.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516209/%E9%9D%92%E9%93%9C%E5%99%A8%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/516209/%E9%9D%92%E9%93%9C%E5%99%A8%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.click();
        }

        var textarea = document.getElementById('report_action_date');
        if (textarea) {
            textarea.removeAttribute('onfocus');

            var input = document.createElement('input');
            input.id = textarea.id;
            input.name = textarea.name;
            input.className = textarea.className;
            input.style.cssText = textarea.style.cssText;
            input.value = textarea.value;

            textarea.parentNode.replaceChild(input, textarea);
            var img = input.nextElementSibling;
            if (img && img.tagName.toLowerCase() === 'img') {
                img.remove();
            }
        }
    };
})();