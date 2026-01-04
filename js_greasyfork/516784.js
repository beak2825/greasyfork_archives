// ==UserScript==
// @name        网易有道网页绿化
// @namespace   http://tampermonkey.net/
// @match       https://www.youdao.com/*
// @grant       unsafeWindow
// @run-at      document-start
// @version     1.0
// @license     MIT
// @author      Berger
// @description 去广告、网页绿化
// @downloadURL https://update.greasyfork.org/scripts/516784/%E7%BD%91%E6%98%93%E6%9C%89%E9%81%93%E7%BD%91%E9%A1%B5%E7%BB%BF%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/516784/%E7%BD%91%E6%98%93%E6%9C%89%E9%81%93%E7%BD%91%E9%A1%B5%E7%BB%BF%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    "use strict";

    class PageUtils {
        static removeElement(element) {
            if (element) {
                element.remove()
            }
        }

        static removeElementWithCheck(className) {
            this.checkElement(className, function (element) {
                PageUtils.removeElement(element)
            })
        }

        static checkElement(className, callback) {
            const observer = new MutationObserver(function (mutationsList, observer) {
                const element = document.querySelector(className);
                if (element) {
                    observer.disconnect();
                    callback(element)
                }
            });

            observer.observe(document.body, {childList: true, subtree: true});
        }
    }

    class PageConcise {
        // 顶部广告
        static topBanner() {
            PageUtils.removeElementWithCheck('div.top-banner-wrap')
        }

        // 产品宣传区域
        static productContainer() {
            PageUtils.removeElementWithCheck('div.product-container')
        }

        // 单词详情页页脚
        static vocabularyInfoPageFooter() {
            const footerDiv = document.querySelector('div.footer_container')
            PageUtils.removeElement(footerDiv)
        }

        // 单词详情页广告
        static translateInfoAD() {
            PageUtils.removeElementWithCheck('div.dict-module > div[disable-zoom]')
        }

        // 单词搜索页页脚
        static vocabularySearchPageFooter() {
            PageUtils.removeElementWithCheck('div.dict-website-footer-container')
        }

        // 用户反馈
        static feedbackDiv(){
            PageUtils.removeElementWithCheck('div.user-feed_back')
        }
    }

    const main = {
        initPage() {
            // 顶部广告
            PageConcise.topBanner()
            // 产品宣传区域
            PageConcise.productContainer()
            // 单词详情页页脚
            PageConcise.vocabularyInfoPageFooter()
            // 单词详情页广告
            PageConcise.translateInfoAD()
            // 单词搜索页页脚
            PageConcise.vocabularySearchPageFooter()
            // 用户反馈
            PageConcise.feedbackDiv()
        }
    }

    // 监听 DOMContentLoaded 事件
    window.addEventListener('DOMContentLoaded', main.initPage);

    // 监听 popstate 事件
    window.addEventListener('popstate', main.initPage);

    window.addEventListener('load', main.initPage);
})()
