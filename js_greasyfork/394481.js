// ==UserScript==
// @name         Cnbeta Remove AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  原版存在性能问题
// @author       yyy
// @match        https://www.cnbeta.com/articles/*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394481/Cnbeta%20Remove%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/394481/Cnbeta%20Remove%20AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function addMutationObserver(selector, callback) {
        let timer;
        var watch = document.querySelector(selector);
        if (!watch) return;

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.addedNodes.length > 0) {
                    clearTimeout(timer)
                    timer = setTimeout(callback, 100)
                }
            });
        });
        observer.observe(watch, { childList: true, subtree: true });
    }

    var clearAd = function clearAd() {
        var adNode = document.querySelector('a[href$="/articles/3.htm"]');
        if (adNode) {
            var adContainer = adNode.parentNode.parentNode.parentNode;
            var mainContainer = adContainer.parentNode;
            mainContainer.removeChild(adContainer);
            document.body.style = "";
        }
    };

    addMutationObserver('body', () => {
        // console.log(111)
        clearAd()
    })
})();