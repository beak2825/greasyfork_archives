// ==UserScript==
// @name         bilibili 评论折跃小助手
// @version      0.1.1
// @description  复制评论区的折跃链接
// @author       as042971
// @author       Sparanoid
// @license      AGPL
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/865651
// @downloadURL https://update.greasyfork.org/scripts/441441/bilibili%20%E8%AF%84%E8%AE%BA%E6%8A%98%E8%B7%83%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441441/bilibili%20%E8%AF%84%E8%AE%BA%E6%8A%98%E8%B7%83%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
    const DEBUG = false;
    const NAMESPACE = 'bilibili-comment-wrap';

    console.log(`${NAMESPACE} loaded`);
    function debug(description = '', msg = '', force = false) {
        if (DEBUG || force) {
            console.log(`${NAMESPACE}: ${description}`, msg)
        }
    }

    function attachEl(item) {
        let injectWrap = item.querySelector('.con .info');

        // .text - comment content
        // .text-con - reply content
        let content = item.querySelector('.con .text') || item.querySelector('.reply-con .text-con');
        let id = item.dataset.id;
        let avID = window.aid;

        // Simple way to attach element on replies initially loaded with comment
        // which wouldn't trigger mutation inside observeComments
        let replies = item.querySelectorAll('.con .reply-box .reply-item');
        if (replies.length > 0) {
            [...replies].map(reply => {
                attachEl(reply);
            });
        }

        if (injectWrap.querySelector('.comment-wrap')) {
            debug('already loaded for this comment');
        } else {
            // Insert wrap check button
            let wrapEl = document.createElement('span');

            wrapEl.classList.add('comment-wrap', 'btn-hover', 'btn-highlight');
            wrapEl.innerHTML = '复制折跃地址';
            wrapEl.addEventListener('click', e => {
                let link = 'https://www.bilibili.com/video/av'+avID+'/#reply'+id;
                let aux = document.createElement("input");
                aux.setAttribute("value", link);
                document.body.appendChild(aux);
                aux.select();
                document.execCommand("copy");
                document.body.removeChild(aux);
            }, false);

            injectWrap.append(wrapEl);
        }
    }

    function observeComments(wrapper) {
        // .comment-list - general list for video, zhuanlan, and dongtai
        // .reply-box - replies attached to specific comment
        let commentLists = wrapper ? wrapper.querySelectorAll('.comment-list, .reply-box') : document.querySelectorAll('.comment-list, .reply-box');

        if (commentLists) {

            [...commentLists].map(commentList => {

                // Directly attach elements for pure static server side rendered comments
                // and replies list. Used by zhuanlan posts with reply hash in URL.
                // TODO: need a better solution
                [...commentList.querySelectorAll('.list-item, .reply-item')].map(item => {
                    attachEl(item);
                });

                const observer = new MutationObserver((mutationsList, observer) => {

                    for (const mutation of mutationsList) {

                        if (mutation.type === 'childList') {

                            debug('observed mutations', [...mutation.addedNodes].length);

                            [...mutation.addedNodes].map(item => {
                                attachEl(item);

                                // Check if the comment has replies
                                // I check replies here to make sure I can disable subtree option for
                                // MutationObserver to get better performance.
                                let replies = item.querySelectorAll('.con .reply-box .reply-item');

                                if (replies.length > 0) {
                                    observeComments(item)
                                    debug(item.dataset.id + ' has rendered reply(ies)', replies.length);
                                }
                            })
                        }
                    }
                });
                observer.observe(commentList, { attributes: false, childList: true, subtree: false });
            });
        }
    }

    // .bb-comment loads directly for zhuanlan post. So load it directly
    observeComments();

    // .bb-comment loads dynamcially for dontai and videos. So observe it first
    const wrapperObserver = new MutationObserver((mutationsList, observer) => {

        for (const mutation of mutationsList) {

            if (mutation.type === 'childList') {

                [...mutation.addedNodes].map(item => {
                    debug('mutation wrapper added', item);

                    if (item.classList?.contains('bb-comment')) {
                        debug('mutation wrapper added (found target)', item);

                        observeComments(item);

                        // Stop observing
                        // TODO: when observer stops it won't work for dynamic homepage ie. https://space.bilibili.com/703007996/dynamic
                        // so disable it here. This may have some performance impact on low-end machines.
                        // wrapperObserver.disconnect();
                    }
                })
            }
        }
    });
    wrapperObserver.observe(document.body, { attributes: false, childList: true, subtree: true });

}, false);
