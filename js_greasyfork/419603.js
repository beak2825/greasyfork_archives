// ==UserScript==
// @name                Google: Remove Garbage Result
// @name:zh-TW          Google 隱藏農場網站
// @namespace           https://github.com/HayaoGai
// @version             1.0.0
// @description         Remove garbage result.
// @description:zh-TW   移除 Google 搜尋出來的垃圾農場網站
// @author              Hayao-Gai
// @match               https://www.google.com/search*
// @icon                https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/471px-Google_%22G%22_Logo.svg.png
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/419603/Google%3A%20Remove%20Garbage%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/419603/Google%3A%20Remove%20Garbage%20Result.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict'

    const garbageList = [
        "https://kknews.cc",
        "https://read01.com"
    ]

    const threadClass = "MjjYud"
    const htmlClass = "iUh30"
    let currentUrl;

    init(10)

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(filter, 500 * i)
        }
    }

    function filter() {
        const webList = document.querySelectorAll(`.${htmlClass}`);
        if (!webList || webList.length === 0) return;
        webList.forEach(web => {
            garbageList.forEach(garbage => {
                if (web.innerHTML.includes(garbage)) {
                    web.closest(`.${threadClass}`).remove();
                }
            });
        });
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.querySelector("body");
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
