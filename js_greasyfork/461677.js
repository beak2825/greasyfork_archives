// ==UserScript==
// @name         RemoveJianShuNauseaThings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简书之堕落，让人遗憾，哀其不幸，怒其不争，为了不让广大作者的资产跟着陪葬，去除污染源，以正视听。 简书去广告。简书。广告。去除热门推荐。jianshu。JianShu。
// @author       longalong
// @match        *://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461677/RemoveJianShuNauseaThings.user.js
// @updateURL https://update.greasyfork.org/scripts/461677/RemoveJianShuNauseaThings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function do_track() {
        // remove baidu ads
        document.querySelectorAll("iframe").forEach(i => {
            document.querySelectorAll("iframe").forEach(i => {
                if (i.src.includes("pos.baidu.com")) {
                    i.style.display = "none";
                }
            });
        });

        // remove aside recommend
        let asideModle = document.querySelector("div[role=main] > aside > div");
        if (asideModle) {
            asideModle.style.display = "none";
        }

        // remove under recommend
        let unserModle = document.querySelector("div[role=main] > div > section:nth-child(2)");
        if (unserModle) {
            unserModle.style.display = "none";
        }
    }

    try {
        let message_box = document.querySelector("div#__next");
        // listen element change
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            let MutationObserverConfig = {
                childList: true,
                subtree: true,
            };
            let observer = new MutationObserver(function (mutations) {
                do_track();
            });
            observer.observe(message_box, MutationObserverConfig);
        } else if (message_box.addEventListener) {
            message_box.addEventListener("DOMSubtreeModified", function (evt) {
                do_track();
            }, false);
        } else {
            let timer = setInterval(function () {
                do_track();
            }, 1000);
        }
    } catch (error) {
        console.log("listen event fail", error);
    }

})();