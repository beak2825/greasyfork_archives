// ==UserScript==
// @name         Arrow Keys Flip Pages
// @namespace    https://4kliksAlex.github.com/
// @version      v0.2.4
// @description  Trigger Pages Flips with custom arrow key shortcuts
// @author       4kliksAlex
// @match        *://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/c/c7/Computer_keyboard_German-key-4.svg
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/506754/Arrow%20Keys%20Flip%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/506754/Arrow%20Keys%20Flip%20Pages.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const selectors = {
        "*://*.oracle.com/javase/tutorial/*": {
            ArrowLeft: "body > div.MainFlow_wide > div:nth-child(6) > a:nth-child(1)",
            ArrowRight: "body > div.MainFlow_wide > div:nth-child(6) > a:nth-child(3)"
        },
        // "*://*.google.com/search?*": {
        //     ArrowLeft: "#pnprev",
        //     ArrowRight: "#pnnext",
        // },
        "*://*.leetcode.*/leetbook/read/*": {
            ArrowLeft: "#lc-home > div > div.css-17lel75-layer1-Container.e19m4yof0 > div.css-1qeh80o-MainContainer.e19m4yof1 > div.css-op50bu-ContentLayoutContainer.e1t6ajs0 > div > div.css-1p8jlme-ContentContainer.e12hyigg1 > div:nth-child(4) > div.css-ob1q0v-Container.elt4qmr0 > a:nth-child(1)",
            ArrowRight: "#lc-home > div > div.css-17lel75-layer1-Container.e19m4yof0 > div.css-1qeh80o-MainContainer.e19m4yof1 > div.css-op50bu-ContentLayoutContainer.e1t6ajs0 > div > div.css-1p8jlme-ContentContainer.e12hyigg1 > div:nth-child(4) > div.css-ob1q0v-Container.elt4qmr0 > a:nth-child(2)"
        },
        "*://docs.spring.io/**": {
            ArrowLeft: "body > div.body > main > div.content > article > nav > span.prev > a",
            ArrowRight: "body > div.body > main > div.content > article > nav > span.next > a"
        },
        "*://www.zhipin.com/web/geek/resumeAnalyze**": {
            ArrowRight: "#wrap > div.resume-analyze > div > div.main-content > div.resume-box > div.resume-item.resume-history > div > form > div.resume-analyze-btns > button.btn.btn-outlint"
        },
        "*://dev.mysql.com/doc/refman/**": {
            ArrowLeft: "#docs-in-page-nav > a:nth-child(1)",
            ArrowRight: "#docs-in-page-nav > a:nth-child(4)"
        }
    };

    function getSelectorsForCurrentURL() {
        const url = window.location.href;
        for (const pattern in selectors) {
            const urlPattern = new URLPattern(pattern, {
                ignoreCase: true,
            });
            const patternMatch = urlPattern.test(url);
            console.info(pattern, patternMatch);
            if (patternMatch) {
                return selectors[pattern];
            }
        }
        return null;
    }

    const currentSelectors = getSelectorsForCurrentURL();
    if (currentSelectors) {
        document.addEventListener("keydown", function (event) {
            const selector = currentSelectors[event.key];
            if (selector) {
                event.preventDefault();
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                }
            }
        });
    }
})();
