// ==UserScript==
// @name         Restore the maintaining image of Jianshu
// @name:zh-CN   恢复简书维护中的图片
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Restore these maintaining image of Jianshu.com
// @description:zh-cn 纯前端恢复简书维护中的图片
// @author       rrkelee_k
// @match        https://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384552/Restore%20the%20maintaining%20image%20of%20Jianshu.user.js
// @updateURL https://update.greasyfork.org/scripts/384552/Restore%20the%20maintaining%20image%20of%20Jianshu.meta.js
// ==/UserScript==

(function() {
    var delay_load = 1000, max_retry_times = 5;
    !function restore_callback (times) {
        var target = document.querySelector('.image-package .image-container .image-view-maintain');
        if (times <= 0) {
            return;
        }
        if (target === null) {
            // avoid arguments.callee
            setTimeout(restore_callback, delay_load, times - 1);
            return;
        }
        var maintain_tips = getComputedStyle(target, ':after').getPropertyValue('content');
        if (maintain_tips.length) {
            var node_list = document.querySelectorAll("img[data-original-src]")
            node_list.forEach(function (elem) {
                // mv "data-original-src" to "src", from dataset to property
                elem.src = elem.dataset.originalSrc;
                delete elem.dataset.originalSrc;
                elem.classList.remove("image-loading");
            });
            // remove maintaining tip via dynamic style
            var styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".image-package .image-container .image-view-maintain:after {content: '';} .image-package .image-container .image-view-error:after {content: '';}";
        }
    }(max_retry_times);
})();