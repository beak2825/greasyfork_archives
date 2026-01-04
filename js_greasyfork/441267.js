// ==UserScript==
// @name         react官网顶部横幅隐藏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除react官网顶部横幅
// @author       You
// @match        https://*.reactjs.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441267/react%E5%AE%98%E7%BD%91%E9%A1%B6%E9%83%A8%E6%A8%AA%E5%B9%85%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/441267/react%E5%AE%98%E7%BD%91%E9%A1%B6%E9%83%A8%E6%A8%AA%E5%B9%85%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetNode = document.getElementById('___gatsby')
    var config = { attributes: true, childList: true, subtree: true }
    var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            document.querySelector('.css-1loxuh3').style.display = 'none'
            document.querySelector('.css-tctv7l').style.display = 'none'
        }
    }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();