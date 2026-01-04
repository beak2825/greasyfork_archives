// ==UserScript==
// @name         caixin auto load more
// @namespace    http://tampermonkey.net/
// @version      2024-12-09
// @description  财新首页信息流中，滑动到底部自动点击“加载更多文章”
// @author       You
// @match        https://www.caixin.com/
// @icon         https://file.caixin.com/file/weixin/cx_logo.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520225/caixin%20auto%20load%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/520225/caixin%20auto%20load%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Function to check if the user has scrolled to the bottom of the page
    function isScrolledToBottom() {
        return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    }

    // Function to click the button
    function clickButton() {
        const button = document.querySelector('#moreArticle a').click()
        if (button) {
            button.click();
        }
    }

    // Debounced scroll event handler
    const handleScroll = debounce(function() {
        if (isScrolledToBottom()) {
            clickButton();
        }
    }, 500); // Adjust the debounce wait time as needed

    // Add an event listener for the scroll event
    window.addEventListener('scroll', handleScroll);
})();