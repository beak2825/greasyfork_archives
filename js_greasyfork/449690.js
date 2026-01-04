// ==UserScript==
// @name         Remove yandex mail ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes add from yandex mail
// @author       Can Kurt
// @match        https://mail.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru<
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449690/Remove%20yandex%20mail%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/449690/Remove%20yandex%20mail%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nonAddKeys = ["box=fake-head-background-box", "box=toolbar-box", "box=infoline-box", "box=right-box", "box=toolbar-box", "box=advanced-search-box"]

    setInterval(function () {
        var element;
        element = document.querySelector(".ns-view-react-left-column");
        if(element) {
            element.nextElementSibling.remove()
        }

        element = document.querySelector(".mail-Layout-Content");
        if(element) {
            for (const elm of element.children) {
                var data_key = elm.getAttribute("data-key");
                if(data_key && !nonAddKeys.includes(data_key)) {
                    elm.remove()
                }
            }
        }
    }, 100);
})();