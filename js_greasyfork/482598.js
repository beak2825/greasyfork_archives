// ==UserScript==
// @name         ニコニコ動画 実際のニコる数を表記
// @namespace    https://yyya-nico.co/
// @version      1.1.1
// @description  実際のニコる数を表記させます。
// @author       yyya_nico
// @license      MIT License
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482598/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%AE%9F%E9%9A%9B%E3%81%AE%E3%83%8B%E3%82%B3%E3%82%8B%E6%95%B0%E3%82%92%E8%A1%A8%E8%A8%98.user.js
// @updateURL https://update.greasyfork.org/scripts/482598/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%AE%9F%E9%9A%9B%E3%81%AE%E3%83%8B%E3%82%B3%E3%82%8B%E6%95%B0%E3%82%92%E8%A1%A8%E8%A8%98.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const observerWrap = (findTargetToken, sendTargetSelector, callback) => {
        return new MutationObserver(records => {
            records.forEach(record => {
                record[sendTargetSelector ? 'addedNodes' : 'removedNodes'].forEach(node => {
                    if (node.nodeType == 1/*ELEMENT*/ && node.classList.contains(findTargetToken)) {
                        callback(
                            sendTargetSelector ? node.querySelector(sendTargetSelector)
                                               : record.target
                        );
                    }
                });
            });
        });
    }

    const waitCreatePlayerPanelContainerObserver = observerWrap('PlayerPanelContainer', '.PlayerPanelContainer-content', target => {
        waitCreatePlayerPanelContainerObserver.disconnect();
        const commentTable = target.querySelector('.CommentPanelDataGrid-Table');
        if (commentTable) {
            reWriteNicoruCountObserver.observe(commentTable, {childList: true, subtree: true});
            removeCommentPanelObserver.observe(target, {childList: true, subtree: true});
        } else {
            createCommentPanelObserver.observe(target, {childList: true, subtree: true});
        }
    });

    const reWriteNicoruCountObserver = observerWrap('CommentPanelDataGrid-TableRow', '.NicoruCell-count', target => {
        target.textContent = target.dataset.nicoruCount;
    });

    const createCommentPanelObserver = observerWrap('CommentPanelContainer', '.CommentPanelDataGrid-Table', target => {
        // console.log('added');
        createCommentPanelObserver.disconnect();
        reWriteNicoruCountObserver.observe(target, {childList: true, subtree: true});
        removeCommentPanelObserver.observe(target.closest('.PlayerPanelContainer-content'), {childList: true, subtree: true});
    });

    const removeCommentPanelObserver = observerWrap('CommentPanelContainer', null, container => {
        // console.log('removed');
        removeCommentPanelObserver.disconnect();
        reWriteNicoruCountObserver.disconnect();
        createCommentPanelObserver.observe(container, {childList: true, subtree: true});
    });

    waitCreatePlayerPanelContainerObserver.observe(document.body, {childList: true, subtree: true});
})();