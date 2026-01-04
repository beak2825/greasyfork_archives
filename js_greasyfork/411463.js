// ==UserScript==
// @name         Kilicen-apw
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填入缺陷修改格式
// @author       tangxiaobin
// @match        http://jira.iklicen.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/411463/Kilicen-apw.user.js
// @updateURL https://update.greasyfork.org/scripts/411463/Kilicen-apw.meta.js
// ==/UserScript==
(function () {
    'use strict';
    init()

    function init() {
        window.addEventListener('click', run)
    }

    function run(e) {
        try {
            setTimeout(() => {
                setValue(e)
            }, 500);
        } catch (e) {
            console.warn('Tang: run -> e', e)
        }
    }

    function setValue(e) {
        const className = e.target.className
        if (!className.includes('textarea long-field')) return

        const preEleInnerHtml = e.target.previousElementSibling.innerHTML;
        if (!preEleInnerHtml.includes('RootCause&amp;解决方案')) return

        if (!e.target.innerHTML) {
            e.target.innerHTML =
                `[RootCause]：
                  
[解决方案]：
    `;
        }

    }
})();

