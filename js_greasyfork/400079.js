// ==UserScript==
// @name         百度热榜屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽百度热榜
// @author       deepwzh
// @match        https://www.baidu.com/*
// @grant        none
// @run-at document-start  
// @downloadURL https://update.greasyfork.org/scripts/400079/%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/400079/%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function hideElements() {
        var elements = document.getElementsByClassName("FYB_RD");
        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "none";
                if (observer) {
                    observer.disconnect();
                }
            }
        }
    }
    let observer;

    var observerConfig = {
        childList: true,
        subtree: true
    };

    var observerCallback = function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                hideElements();
            }
        }
    };

    observer = new MutationObserver(observerCallback);

    observer.observe(document.body, observerConfig);

    document.addEventListener('DOMContentLoaded', hideElements);
})();