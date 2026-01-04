// ==UserScript==
// @name         Notion TOC Floating | 悬浮目录 | 悬浮Heading
// @namespace    https://github.com/gefangshuai/tampermokey-scripts
// @version      0.1.8
// @description  默认取第一个table of contents，请知晓。支持悬浮目录和悬浮Heading！
// @author       Timothy.Ge
// @include      *://*.notion.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @note         21-08-11 0.1.8 兼容新站点
// @note         21-08-11 0.1.7 兼容新站点
// @note         21-08-11 0.1.6 兼容新站点
// @note         21-06-02 0.1.5 优化Sticky Heading逻辑，当页面包含多列的时候，禁用悬浮
// @note         21-06-02 0.1.4 优化了悬浮逻辑，增加了table_of_contents激活效果
// @note         21-06-02 0.1.3 新增了对h1、h2、h3的悬浮支持
// @note         21-05-25 0.1.2 更新说明
// @note         21-05-25 0.1.1 解决了更换文章失效的问题
// @note         21-05-25 0.1.0 第一个测试版本
// @downloadURL https://update.greasyfork.org/scripts/427001/Notion%20TOC%20Floating%20%7C%20%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95%20%7C%20%E6%82%AC%E6%B5%AEHeading.user.js
// @updateURL https://update.greasyfork.org/scripts/427001/Notion%20TOC%20Floating%20%7C%20%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95%20%7C%20%E6%82%AC%E6%B5%AEHeading.meta.js
// ==/UserScript==
GM_addStyle(`
    div.notion-frame:not(.prevent-heading-sticky) div.notion-page-content .notion-header-block, 
    div.notion-frame:not(.prevent-heading-sticky) div.notion-page-content .notion-sub_header-block {
        position: sticky !important;
        top: 0;
        background: #fff;
        z-index: 9999;
    }
`);
(function() {
    (function(history) {
        'use strict';
        // Your code here...
        var preventHeadingSticky = function() {
            document.querySelector('div.notion-frame').classList.add('prevent-heading-sticky');
        };
        var doSomething = function() {
            // float TOC
            var scroller = document.querySelector('div.notion-frame .notion-scroller');
            if (scroller) {
                if (window.$$_scrollWatchFun) {
                    scroller.removeEventListener('scroll', window.$$_scrollWatchFun);
                } else {
                    window.$$_scrollWatchFun = function(e) {
                        // float table_of_contents
                        var tableContents = document.querySelector('.notion-table_of_contents-block');
                        if (tableContents) {
                            preventHeadingSticky();
                            var rect = tableContents.getBoundingClientRect();
                            var dom = tableContents.firstChild;
                            if (dom) {
                                if (rect.top <= 60) {
                                    dom.style.position = 'fixed';
                                    dom.style.top = '60px';
                                    dom.style.width = rect.width + 'px';
                                } else {
                                    dom.style.position = null;
                                    dom.style.top = null;
                                }
                            }
                        } else if (document.querySelectorAll('.notion-column-block').length > 0) {
                            preventHeadingSticky();
                        } else {
                            document.querySelector('div.notion-frame').classList.remove('prevent-heading-sticky');
                        }
                        if (tableContents) {
                            // add hover style to table_of_contents
                            var headers = document.querySelectorAll('.notion-header-block, .notion-sub_header-block, .notion-sub_sub_header-block');
                            var current;
                            var currentIndex = -1;
                            if (headers && headers.length > 0) {
                                for (var i = 0; i < headers.length; i++) {
                                    if (headers[i].getBoundingClientRect().top < 45) {
                                        current = headers[i].textContent;
                                        currentIndex = i;
                                    }
                                }
                            }
                            var allA = tableContents.querySelectorAll('a');
                            if (allA && allA.length > 0) {
                                if (current) {
                                    if (allA.length > 0) {
                                        for (let i = 0; i < allA.length; i++) {
                                            if (i === currentIndex) {
                                                allA[i].style.background = 'rgba(55, 53, 47, 0.08)';
                                            } else {
                                                allA[i].style.background = 'unset';
                                            }
                                        }
                                    }
                                } else {
                                    for (let i = 0; i < allA.length; i++) {
                                        allA[i].style.background = 'unset';
                                    }
                                }
                            }
                        }
                    };
                }
                scroller.addEventListener('scroll', window.$$_scrollWatchFun);
            }

        };
        doSomething();
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == 'function') {
                history.onpushstate({ state: state });
            }
            setTimeout(function() {
                doSomething();
            }, 3000);
            return pushState.apply(history, arguments);
        };
    })(window.history);
})();
