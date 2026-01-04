// ==UserScript==
// @name         zod.kr 댓글 새로고침 버튼
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  zod.kr에서 댓글 새로고침 버튼 추가
// @author       znjxl
// @match        *://zod.kr/*/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517752/zodkr%20%EB%8C%93%EA%B8%80%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/517752/zodkr%20%EB%8C%93%EA%B8%80%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        const refreshButton = $('<button>댓글 새로고침</button>');
        refreshButton.css({
            position: 'absolute',
            top: '9px',
            right: '156px',
            padding: '10px',
            backgroundColor: '#3E9DFF',
            color: 'white',
            border: 'none',
            borderRadius: '250px',
            cursor: 'pointer',
            zIndex: '10'
        });

        refreshButton.on('click', () => {
            refreshComments({ cpage: 100 }).then(() => {
                appToast('댓글이 새로 고침되었습니다.');
            });
        });

        function refreshComments(params) {
            let refresh_url = window.location.href;

            if (typeof params === 'object' && params.hasOwnProperty('cpage')) {
                refresh_url = new URL(refresh_url);
                refresh_url.searchParams.set('cpage', params.cpage);
                refresh_url = refresh_url.toString();
            }

            return fetch(refresh_url, { credentials: "include" })
                .then(response => response.text())
                .then(response => {
                    const selector = 'ul#app-board-comment-list';
                    const commentList = $(response).find(selector);
                    $(selector).html(commentList.html());
                    const totalCommentCount = $(response).find('.tw-text-sm > .tw-font-bold.tw-text-primary').text();
                    const commentCountElement = $('.tw-text-sm > .tw-font-bold.tw-text-primary');

                    if (commentCountElement.length) {
                        commentCountElement.text(totalCommentCount);
                    }

                    if (params.hasOwnProperty('cpage')) {
                        const currentURL = new URL(window.location.href);
                        currentURL.searchParams.set('cpage', params.cpage);
                        window.history.pushState({}, null, currentURL);
                    }
                });
        }

        function appToast(message) {
            const toast = $('<div></div>').text(message).css({
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 123, 255, 0.9)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: '1000'
            });
            $('body').append(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // 모든 클릭 이벤트에서 0.5초 지연 추가
        $('.tw-pl-2.tw-flex-1 > .tw-items-start.tw-flex > .primary.app-button-xs.app-button-rounded.app-button').on('click', () => {
            setTimeout(() => {
                refreshComments({ cpage: 100 }).then(() => {
                    appToast('댓글이 새로 고침되었습니다.');
                });
            }, 500); // 0.5초
        });

        $('.app-confirm__footer > button:nth-of-type(2)').on('click', () => {
            setTimeout(() => {
                refreshComments({ cpage: 100 }).then(() => {
                    appToast('댓글이 새로 고침되었습니다.');
                });
            }, 500); // 0.5초
        });

        const commentHeaderContainer = $('.tw-items-center.tw-flex.app-board-container.app-comment-header');
        if (commentHeaderContainer.length) {
            commentHeaderContainer.css('position', 'relative');
            commentHeaderContainer.append(refreshButton);
        } else {
            console.error('댓글 헤더가 존재하지 않습니다.');
        }
    });
})();