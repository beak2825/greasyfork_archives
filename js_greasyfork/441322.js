// ==UserScript==
// @name                B站创作中心弹幕管理优化排版 better-bilibili-inter-active-danmu-typographic
// @name:zh-HK          B站創作中心彈幕管理優化排版 better-bilibili-inter-active-danmu-typographic
// @name:zh-TW          B站創作中心彈幕管理最佳化排版 better-bilibili-inter-active-danmu-typographic
// @name:en             better-bilibili-inter-active-danmu-typographic
// @name:ja             better-bilibili-inter-active-danmu-typographic
// @namespace           https://github.com/catscarlet/better-bilibili-inter-active-danmu-typographic
// @description         优化 B站-创作中心-弹幕管理 的排版
// @description:zh-HK   優化 B站-創作中心-彈幕管理 的排版
// @description:zh-TW   最佳化 B站-創作中心-彈幕管理 的排版
// @description:en      better bilibili inter active danmu typographic
// @description:ja      bilibiliオーサリングセンターdanmu管理のレイアウトを最適化する（Translated from Google Translate）
// @version             0.1.2
// @author              catscarlet
// @match               *://member.bilibili.com/platform*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at              document-end
// @grant               none
// @license             GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/441322/B%E7%AB%99%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86%E4%BC%98%E5%8C%96%E6%8E%92%E7%89%88%20better-bilibili-inter-active-danmu-typographic.user.js
// @updateURL https://update.greasyfork.org/scripts/441322/B%E7%AB%99%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86%E4%BC%98%E5%8C%96%E6%8E%92%E7%89%88%20better-bilibili-inter-active-danmu-typographic.meta.js
// ==/UserScript==

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/

(function() {
    'use strict';



        console.log('inter-active-danmu-patch');

        let oldHref = document.location.href;

        checkUrl(document.location);
        urlObserver();

        function urlObserver() {
            let bodyList = document.querySelector('body');

            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (oldHref != document.location.href) {
                        oldHref = document.location.href;
                        checkUrl(document.location);
                    }
                });
            });

            let config = {
                childList: true,
                subtree: true,
            };

            observer.observe(bodyList, config);
        }

        /*
        window.onpopstate = function(event) {
            //checkUrl(document.location);
        };
        */

        function checkUrl(url) {
            let urlRe = new RegExp('https://member\.bilibili\.com/platform/inter\-active/danmu');
            let result = urlRe.test(url);

            if (result) {
                findContentBody();
            }
        }

        function findContentBody() {
            function checkBody(changes, observer) {
                if (document.querySelector('.cc-content-body')) {
                    observer.disconnect();
                    action();
                }
            }

            (new MutationObserver(checkBody)).observe(document, {childList: true, subtree: true});
        }

        function action() {
            changeStyles();
            findTableObserver();
        }

        function changeStyles() {
            let content = document.querySelector('.cc-content-body');

            //content.style.width = '100%';

            let danmuSlot = document.querySelectorAll('.bcc-table__align-left tr th')[3];
            let upvoteSlot = document.querySelectorAll('.bcc-table__align-left tr th')[4];
            let attrSlot = document.querySelectorAll('.bcc-table__align-left tr th')[5];
            let timeSlot = document.querySelectorAll('.bcc-table__align-left tr th')[6];

            danmuSlot.style.minWidth = danmuSlot.style.width;

            danmuSlot.style.width = 'fit-content';
            upvoteSlot.style.width = '5em';
            attrSlot.style.width = '5em';
            //timeSlot.style.width = '12em';
        }

        function findTableObserver() {
            const targetNode = document.querySelector('.cc-content-body');

            const config = {attributes: false, childList: true, subtree: true};

            const findTable = function(changes, observer) {
                if (document.querySelector('.bcc-table__align-left')) {
                    observer.disconnect();
                    addTitleToTitle();
                }
            };

            const observer = new MutationObserver(findTable);

            observer.observe(targetNode, config);
        }

        function titleObserver() {
            const targetNode = document.querySelector('.bcc-table__align-left tbody');

            const config = {attributes: false, childList: true, subtree: true, characterData: true};

            const callback = function(changes, observer) {
                observer.disconnect();
                addTitleToTitle();
            };

            const observer = new MutationObserver(callback);

            observer.observe(targetNode, config);
        }

        function addTitleToTitle() {
            let list = document.querySelectorAll('.video-title');
            list.forEach((item, i) => {
                let text = item.querySelector('.no-hover').textContent;
                item.title = text;
            });

            findTableObserver();
        }
    })();

/*
This project is licensed under **GNU AFFERO GENERAL PUBLIC LICENSE Version 3**
*/
