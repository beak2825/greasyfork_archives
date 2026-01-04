// ==UserScript==
// @name         Go to top when page changes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Go to top when page changes!
// @author       You
// @match        https://www.yrxitong.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yrxitong.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449802/Go%20to%20top%20when%20page%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/449802/Go%20to%20top%20when%20page%20changes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init(){
        let content = document.querySelector('#centerTopForms');

        let observer = new MutationObserver(mutationRecords => {
            // siteBackToTop_small_box.dispatchEvent(new MouseEvent('click'), {bubbles: true});
            content.scrollIntoView(true);
            // scrollSmoothTo($('#centerTopForms').offset().top);
        });

        // 观察除了特性之外的所有变动
        observer.observe(content, {
            childList: true, // 观察直接子节点
            subtree: true, // 及其更低的后代节点
            characterDataOldValue: true // 将旧的数据传递给回调
        });
    }
    $(document).ready(init);

})();