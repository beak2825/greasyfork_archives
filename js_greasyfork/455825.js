/*!
// ==UserScript==
// @name          黑白网页颜色还原
// @namespace     https://github.com/maomao1996/tampermonkey-scripts
// @version       0.2.0
// @description   移除灰度滤镜，还你一个五彩斑斓的网页（支持所有使用 CSS filter 的站点）
// @author        maomao1996
// @include       *
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/455825/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E9%A2%9C%E8%89%B2%E8%BF%98%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/455825/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E9%A2%9C%E8%89%B2%E8%BF%98%E5%8E%9F.meta.js
// ==/UserScript==
*/
;
(function () {
    'use strict';
    var observerChildList = function (callback, selector) {
        var observer = new MutationObserver(function (_a) {
            var mutation = _a[0];
            mutation.type === 'childList' && callback(observer, mutation);
        });
        observer.observe(selector, { childList: true, subtree: true });
        return observer;
    };
    var style = document.documentElement.style;
    var filterKey = [
        'filter',
        '-webkit-filter',
        '-moz-filter',
        '-ms-filter',
        '-o-filter'
    ].find(function (prop) { return typeof style[prop] === 'string'; });
    var restore = function () {
        Array.prototype.forEach.call(document.querySelectorAll('*'), function (el) {
            var filterValue = document.defaultView.getComputedStyle(el)[filterKey];
            if (filterValue.match('grayscale')) {
                el.style.setProperty(filterKey, 'initial', 'important');
            }
        });
    };
    observerChildList(restore, document.querySelector('body'));
    restore();
})();
