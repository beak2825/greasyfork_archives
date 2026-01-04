// ==UserScript==
// @name                Ani Gamer Age Verification Auto Agree
// @icon                https://ani.gamer.com.tw/favicon.ico
// @name:zh-TW          動畫瘋自動同意
// @name:zh-CN          动画疯自动同意
// @namespace           electroknight22_ani_gamer_age_verification_auto_agree_namespace
// @match               *://ani.gamer.com.tw/animeVideo.php*
// @match               *://ani.gamer.com.tw/party.php*
// @run-at              document-start
// @version             1.1.2
// @author              ElectroKnight22
// @license             MIT
// @description         Automatically agrees to the age verification prompt on the Ani-Gamer website.
// @description:zh-TW   自動同意動畫瘋網站的年齡驗證提示。
// @description:zh-CN   自动同意动画疯网站的年龄验证提示。
// @downloadURL https://update.greasyfork.org/scripts/509309/Ani%20Gamer%20Age%20Verification%20Auto%20Agree.user.js
// @updateURL https://update.greasyfork.org/scripts/509309/Ani%20Gamer%20Age%20Verification%20Auto%20Agree.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function agree() {
        waitForElement('.choose-btn-agree').then((element) => {
            console.log(`Agreement button found: "${element.textContent}". Automatically agreeing for the user.`);
            element.click();
        });
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches(selector)) {
                                observer.disconnect();
                                resolve(node);
                                return;
                            }
                            const matchingDescendant = node.querySelector(selector);
                            if (matchingDescendant) {
                                observer.disconnect();
                                resolve(matchingDescendant);
                                return;
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

    window.addEventListener('loadstart', agree, true);
})();
