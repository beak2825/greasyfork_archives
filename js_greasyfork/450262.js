// ==UserScript==
// @name         PT Signed
// @namespace    http://rachpt.cn/
// @version      0.5
// @description  PT 去签到
// @author       rachpt
// @license      MIT
// @match        https://totheglory.im/*
// @match        https://hdhome.org/*
// @match        https://www.hdarea.co/*
// @match        https://hdchina.org/*
// @icon         https://totheglory.im/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450262/PT%20Signed.user.js
// @updateURL https://update.greasyfork.org/scripts/450262/PT%20Signed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.host === 'totheglory.im') document.querySelector('#signed')?.click()
    else if (location.host === 'hdhome.org' ) {
        const btn = document.querySelector('.faqlink')
        if (btn) {
            btn.click()
            history.back()
        }
    }
    else if (location.host === 'www.hdarea.co') document.querySelector('#sign_in a')?.click()
    else if (location.host === 'hdchina.org') document.querySelector('.label-default[onclick]')?.click()
})();