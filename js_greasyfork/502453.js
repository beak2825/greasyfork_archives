// ==UserScript==
// @name         Disable Dark Mode for wangdoc.com
// @name:zh-TW          关闭Wangdoc的深色模式
// @name:zh-CN          关闭Wangdoc的深色模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When the browser turns on the dark mode, wangdoc.com will also switch to an unfinished dark mode. The contrast of the text will be wrong and the page will no longer be beautiful.  This simple script may temporarily solve the problem.
// @description:zh-TW   浏览器开启深色模式时wangdoc.com也会跟随切换到一个尚未完工的深色模式，文字对比度会错误，页面也不再美观。这个简易脚本暂时可以解决问题。
// @description:zh-CN   浏览器开启深色模式时wangdoc.com也会跟随切换到一个尚未完工的深色模式，文字对比度会错误，页面也不再美观。这个简易脚本暂时可以解决问题。
// @author       lilili
// @match        https://wangdoc.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502453/Disable%20Dark%20Mode%20for%20wangdoccom.user.js
// @updateURL https://update.greasyfork.org/scripts/502453/Disable%20Dark%20Mode%20for%20wangdoccom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove dark mode styles
    function disableDarkMode() {
        // Remove the dark mode media query styles
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeMediaQuery.matches) {
            const stylesheets = document.styleSheets;
            for (let i = 0; i < stylesheets.length; i++) {
                try {
                    const rules = stylesheets[i].cssRules || stylesheets[i].rules;
                    for (let j = 0; j < rules.length; j++) {
                        if (rules[j].media && rules[j].media.mediaText.includes('prefers-color-scheme: dark')) {
                            stylesheets[i].deleteRule(j);
                            j--;
                        }
                    }
                } catch (e) {
                    console.error('Error accessing stylesheet:', e);
                }
            }
        }

        // Optionally, you can add your own styles to override dark mode styles
        const style = document.createElement('style');
        style.textContent = `
            body {
                background-color: white !important;
                color: black !important;
            }
            /* Add more styles as needed */
        `;
        document.head.appendChild(style);
    }

    // Run the function when the page loads
    window.addEventListener('load', disableDarkMode);
})();