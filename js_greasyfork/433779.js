// ==UserScript==
// @name         IT之家了解到
// @version      2025.11.25
// @namespace    https://greasyfork.org/zh-CN/users/452492-0x400
// @description  去掉文章内容中的废话
// @author       0x400
// @match        https://www.ithome.com/*
// @icon         https://www.google.com/s2/favicons?domain=ithome.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433779/IT%E4%B9%8B%E5%AE%B6%E4%BA%86%E8%A7%A3%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433779/IT%E4%B9%8B%E5%AE%B6%E4%BA%86%E8%A7%A3%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var regex = /(<div class="tougao-user"[^>]*>[\s\S]*?<\/div>|<p class="ad-tips"[^>]*>[\s\S]*?<\/p>|(<a[^>]*>)?IT\s?之家(<\/>a)?[^，。：]*[，。：])/g;
    document.querySelector('.post_content').innerHTML = document.querySelector('.post_content').innerHTML.replaceAll(regex,'');
})();