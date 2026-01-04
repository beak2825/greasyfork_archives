// ==UserScript==
// @name         React.js官网顶部横幅移除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这个顶部横幅真的实在是太占地方了，对不起黑人哥哥们。
// @author       Whidy
// @match        https://*.reactjs.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411650/Reactjs%E5%AE%98%E7%BD%91%E9%A1%B6%E9%83%A8%E6%A8%AA%E5%B9%85%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/411650/Reactjs%E5%AE%98%E7%BD%91%E9%A1%B6%E9%83%A8%E6%A8%AA%E5%B9%85%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.getElementById('___gatsby')
    const config = { attributes: true, childList: true, subtree: true }
    const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // console.log('A child node has been added or removed.');
            document.querySelector('.css-f5odvb').style.display = 'none'
            document.querySelector('.css-tctv7l').style.display = 'none'
        }
    }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();