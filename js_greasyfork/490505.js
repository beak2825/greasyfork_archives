// ==UserScript==
// @name         boce 自動排序asd
// @version      1.2
// @description  Open specific spans on www.boce.com and click on status code anomaly link in PopupMsg
// @author       123
// @match        *://www.boce.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1277699
// @downloadURL https://update.greasyfork.org/scripts/490505/boce%20%E8%87%AA%E5%8B%95%E6%8E%92%E5%BA%8Fasd.user.js
// @updateURL https://update.greasyfork.org/scripts/490505/boce%20%E8%87%AA%E5%8B%95%E6%8E%92%E5%BA%8Fasd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let openSpans = function() {
        let spans = document.querySelectorAll('span[data-order="httpCode"]');

        spans.forEach(function(span) {
            span.click();
            span.classList.remove('before');
            span.classList.add('on');
        });
    };

    let clickStatusAnomalyLink = function() {
        let link = document.querySelector('.map_nav a[data-isp="103"]');

        if (link) {
            link.click();
        }
    };

    window.addEventListener('load', function() {
        openSpans();
        observePopup();
    });

    let observePopup = function() {
        let targetElement = document.querySelector('.PopupMsg');

        if (targetElement) {
            console.log('已检测到 .PopupMsg');
            openSpans();
            clickStatusAnomalyLink();
        } else {
            console.log('未找到 .PopupMsg');
            setTimeout(observePopup, 1000);
        }
    };

})();
