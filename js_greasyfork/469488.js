// ==UserScript==
// @name         拦截CUG网页VPN弹窗
// @version      1.0
// @description  拦截具有特定类名的<div>元素
// @match        https://webvpn.cug.edu.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/1112554
// @downloadURL https://update.greasyfork.org/scripts/469488/%E6%8B%A6%E6%88%AACUG%E7%BD%91%E9%A1%B5VPN%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/469488/%E6%8B%A6%E6%88%AACUG%E7%BD%91%E9%A1%B5VPN%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetClassNames = [ 'dialog-mask','dialog'];
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && targetClassNames.some(function(className) { return node.classList.contains(className); })) {
                            node.remove();
                    }
                });
            }
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();