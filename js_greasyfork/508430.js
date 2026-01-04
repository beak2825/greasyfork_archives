// ==UserScript==
// @name         豆瓣自动确认助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在豆瓣电影、音乐和读书页面点击状态时自动确认
// @author       [您的名字]
// @match        https://book.douban.com/subject/*
// @match        https://movie.douban.com/subject/*
// @match        https://music.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508430/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/508430/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonSelectors = {
        book: 'input[value="想读"], input[value="在读"], input[value="读过"]',
        movie: 'a.collect_btn[name^="pbtn-"], input[value="想看"], input[value="看过"]',
        music: 'a.collect_btn[name^="pbtn-"], input[value="想听"], input[value="在听"], input[value="听过"]'
    };

    function addListeners(selectors) {
        document.querySelectorAll(selectors).forEach(button => {
            if (!button.dataset.listenerAdded) {
                button.addEventListener('click', handleStatusClick);
                button.dataset.listenerAdded = 'true';
            }
        });
    }

    function handleStatusClick(event) {
        event.preventDefault();
        setTimeout(() => {
            const confirmButton = document.querySelector('input[value="确定"], button[type="submit"], .bn-flat input[type="submit"], .j.a_show_login');
            if (confirmButton) confirmButton.click();
        }, 500);
    }

    function init() {
        const pageType = location.hostname.split('.')[0];
        if (buttonSelectors[pageType]) {
            addListeners(buttonSelectors[pageType]);
            new MutationObserver(() => addListeners(buttonSelectors[pageType]))
                .observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
