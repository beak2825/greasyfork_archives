// ==UserScript==
// @name            移除百度广告
// @name:en         Remove Baidu Ads
// @namespace       https://github.com/roshanca
// @version         0.1.0
// @description     移除百度搜索结果中的广告
// @description:en  Remove Baidu Ads in search results
// @author          wwj1983 <wwj1983@gmail.com>
// @homepageURL     https://github.com/roshanca/remove-baidu-ads
// @supportURL      https://github.com/roshanca/remove-baidu-ads/issues
// @license         MIT
// @match           http://www.baidu.com/s*
// @match           https://www.baidu.com/s*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/19365/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/19365/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearBaiduAds() {

        // 移除搜索结果头部与尾部的推广
        var contentLeft = document.querySelector('#content_left');
        var ads = contentLeft.querySelectorAll('[style="display:block !important;visibility:visible !important"]');

        for (let dom of ads) {
            if (dom) {
                dom.parentNode.removeChild(dom);
            }
        }

        // 移除网页右边的推广
        var sideContainer = document.querySelector('#ec_im_container');
        if (sideContainer) {
            var adWrap = sideContainer.parentNode;
            adWrap.parentNode.removeChild(adWrap);
        }
    }

    clearBaiduAds();

    // 表单提交事件监听
    var searchForm = document.forms.f;
    searchForm.addEventListener('submit', () => {
        console.log('search');
        setTimeout(clearBaiduAds, 1000);
    });

    var timeId;
    var kw = document.querySelector('#kw');
    kw.addEventListener('keyup', () => {
        if (timeId) clearTimeout(timeId);
        timeId = setTimeout(clearBaiduAds, 1000);
    });

    // 仿 jQuery 可链式操作的包装集
    var $$ = function (selector) {
        return new W(selector);
    };

    function W(selector) {
        if (typeof selector === 'string') {
            this.elem = document.querySelectorAll(selector);
        } else if (selector.nodeType) { // Node/element
            this.elem = [selector];
        } else { // Nodes/elements
            var arr = [], i;
            for (i = 0; i < selector.length; i++) {
                arr.push(selector[i]);
            }
            this.elem = arr;
        }

        return this;
    }

    // 事件委托实现
    W.prototype.delegate = function (eventName, targetSelector, listener, capture) {
        for (let elem of this.elem) {
            elem.addEventListener(eventName, function (e) {
                var target = e.target;
                if ($$(target).is(targetSelector)) {
                    listener.call(target, e);
                } else {
                    var parent = target.parentNode;
                    while (parent) {
                        if ($$(parent).is(targetSelector)) {
                            listener.call(parent, e);
                        }
                        parent = parent.parentNode;
                    }
                }
            }, capture);
        }
    };

    // 比对元素结点，返回比对结果：true 为一样，false 为不一样
    W.prototype.is = function(selector) {
        var ret;
        for (let target of this.elem) {
            for (let source of $$(selector).elem) {
                if (target.compareDocumentPosition(source) === 0) {
                    ret = true;
                    break;
                } else {
                    ret = false;
                }
            }
        }
        return ret;
    };

    $$(searchForm).delegate('click', '.bdsug li', () => {
        console.log('list search');
        setTimeout(clearBaiduAds, 1000);
    }, true);

})();
