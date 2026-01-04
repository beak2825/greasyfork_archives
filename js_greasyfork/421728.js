// ==UserScript==
// @name         Paxful快捷查询
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Paxful列表按钮用新窗口打开，自动选择全世界
// @homeurl      https://greasyfork.org/zh-CN/scripts/421728
// @author       You
// @match        https://paxful.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421728/Paxful%E5%BF%AB%E6%8D%B7%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/421728/Paxful%E5%BF%AB%E6%8D%B7%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function applyLinkTarget () {
        let list = document.querySelectorAll('.Offer__offerRow');
        if (list != null && list.length > 0) {
            document.querySelector('#react-select-3-option-0-0').click()

            for (let i = 0; i < list.length; i++) {
                let button = list[i].querySelector('.justify-content-xs-start');
                if (!button.getAttribute('target')) {
                    button.setAttribute('target', "_blank")
                }
            }
        }
    }


    const main = document.querySelector('body')
    if (main != null) {
        const observer = new MutationObserver(function (mutations, observer) {
            applyLinkTarget()
        })
        observer.observe(main, {
            childList: true
        })

    }
})();
