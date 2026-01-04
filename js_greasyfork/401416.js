// ==UserScript==
// @name         屏蔽acfun主页文章区的综合板块
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  屏蔽综合板块
// @author       猫猫
// @match        https://www.acfun.cn/
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/401416/%E5%B1%8F%E8%94%BDacfun%E4%B8%BB%E9%A1%B5%E6%96%87%E7%AB%A0%E5%8C%BA%E7%9A%84%E7%BB%BC%E5%90%88%E6%9D%BF%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/401416/%E5%B1%8F%E8%94%BDacfun%E4%B8%BB%E9%A1%B5%E6%96%87%E7%AB%A0%E5%8C%BA%E7%9A%84%E7%BB%BC%E5%90%88%E6%9D%BF%E5%9D%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var tableHeaders = document.querySelectorAll('.main-header-item');
        if (tableHeaders === null || tableHeaders.length === 0 ) {
            var banana = document.querySelector('#pagelet_list_banana');
            //监听子节点的变化
            var observer = new MutationObserver(function(mutations, observer) {
                if (mutations[0].type === 'childList') {
                    tableHeaders = document.querySelectorAll('.main-header-item');
                    tableHeaders[0].style.display = 'none';
                    tableHeaders[1].children[0].classList.add('header-active');
                    tableHeaders[1].children[1].classList.add('content-active');
                    observer.disconnect();
                }
            });
            var config = {
                childList: true
            };
            observer.observe(banana, config);
        } else {
            tableHeaders[0].style.display = 'none';
            tableHeaders[1].children[0].classList.add('header-active');
            tableHeaders[1].children[1].classList.add('content-active');
        }
})();