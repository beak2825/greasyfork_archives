// ==UserScript==
// @name         删除walles.ai/chat背景
// @namespace    ZJY
// @version      1.1
// @description  删除walles.ai的背景
// @include      https://walles.ai/chat/*
// @include      https://walles.ai/chat
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477031/%E5%88%A0%E9%99%A4wallesaichat%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/477031/%E5%88%A0%E9%99%A4wallesaichat%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    var canvas = document.querySelector(".vanta-canvas");
                    if (canvas) {
                        canvas.parentNode.removeChild(canvas);
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
