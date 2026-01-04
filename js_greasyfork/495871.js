// ==UserScript==
// @name         添加有质量的版块到S1快速访问
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  添加有质量的版块
// @author       一只野牲达达利亚
// @match        https://*.saraba1st.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495871/%E6%B7%BB%E5%8A%A0%E6%9C%89%E8%B4%A8%E9%87%8F%E7%9A%84%E7%89%88%E5%9D%97%E5%88%B0S1%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/495871/%E6%B7%BB%E5%8A%A0%E6%9C%89%E8%B4%A8%E9%87%8F%E7%9A%84%E7%89%88%E5%9D%97%E5%88%B0S1%E5%BF%AB%E9%80%9F%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nvElement = document.getElementById('nv');
    if (nvElement) {
        var generator = function(tagName, targetUrl) {
            var liBody = document.createElement('li');
            var tagBody = document.createElement('a');
            tagBody.href = targetUrl;
            tagBody.textContent = tagName;
            liBody.style = 'list-style-type: none'
            liBody.appendChild(tagBody);
            return liBody;
        };
        nvElement.appendChild(generator('刀版', 'forum-138-1.html'));
        nvElement.appendChild(generator('刀楼', 'https://bbs.saraba1st.com/2b/thread-2192314-1-1.html'));
        nvElement.appendChild(generator('拌匀', 'https://bbs.saraba1st.com/2b/thread-2192341-1-1.html'));
        nvElement.appendChild(generator('手厕', 'https://bbs.saraba1st.com/2b/forum-156-1.html'));
    }
})();
