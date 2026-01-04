// ==UserScript==
// @name         Jira Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Jira QuickFilter Helper 
// @author       Lin
// @match        https://jira.zhenguanyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhenguanyu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483213/Jira%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/483213/Jira%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', e => {
        if (e.target.classList.contains('js-quickfilter-button')) {
            const activedBtns = [...document.querySelectorAll('.js-quickfilter-button.ghx-active')];
            if (activedBtns.length > 1) {
                activedBtns.filter(b => b !== e.target).forEach(b => {
                    b.click();
                })
            }
        }
    })

})();