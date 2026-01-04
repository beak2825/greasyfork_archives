// ==UserScript==
// @name         SOOP(숲) 하이라이트 댓글 버튼 추가 스크립트 (by 도연)
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  SOOP(숲) 게시물 댓글에서 '하이라이트 댓글'로 공유할 수 있는 버튼을 추가합니다. (Made by 도연)
// @author       https://github.com/dokdo2013
// @license      MIT
// @match        https://ch.sooplive.co.kr/*/post/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/501990/SOOP%28%EC%88%B2%29%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%28by%20%EB%8F%84%EC%97%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501990/SOOP%28%EC%88%B2%29%20%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EB%8C%93%EA%B8%80%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%28by%20%EB%8F%84%EC%97%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toastr CSS 추가
    const toastrCSS = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css');
    `;
    const style = document.createElement('style');
    style.textContent = toastrCSS;
    document.head.appendChild(style);

    console.log('Script started');

    // URL에서 ch_id와 post_id를 추출
    const urlPattern = /^https:\/\/ch\.sooplive\.co\.kr\/([^\/]+)\/post\/([^\/#?]+)(?:[#?].*)?$/;
    const match = window.location.href.match(urlPattern);

    if (!match) {
        console.error('URL does not match the expected pattern');
        return;
    }

    const ch_id = match[1];
    const post_id = match[2];

    console.log(`Extracted ch_id: ${bj_id}, post_id: ${post_id}`);

    // API 호출 함수
    async function fetchComments(bj_id, post_id) {
        let allComments = [];
        let page = 1;
        let lastPage = 1;

        try {
            while (page <= lastPage) {
                console.log(`Fetching comments for page ${page}`);
                const response = await fetch(`https://chapi.sooplive.co.kr/api/${bj_id}/title/${post_id}/comment?page=${page}&orderby=reg_date`);
                const data = await response.json();

                if (data.data) {
                    allComments = allComments.concat(data.data);
                    lastPage = data.meta.last_page;
                    console.log(`Fetched page ${page}, last_page: ${lastPage}`);
                    page++;
                } else {
                    console.error('Failed to fetch comments:', data);
                    break;
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }

        console.log(`Total comments fetched: ${allComments.length}`);
        return allComments;
    }

    // 댓글에 버튼 추가하는 함수
    function addButtonToComments(comments) {
        const commentElements = document.querySelectorAll('ul.cmmt-list > li');

        if (!commentElements.length) {
            console.error('No comment elements found on the page');
            return;
        }

        console.log(`Found ${commentElements.length} comment elements on the page`);

        commentElements.forEach((element, index) => {
            const autorWrap = element.querySelector('.cmmt-header .autor_wrap');
            const util = element.querySelector('.cmmt-header .util');
            const cmmtBtn = element.querySelector('.cmmt-btn');

            if (autorWrap && util) {
                const nicknameElement = autorWrap.querySelector('div > button > p');
                const timeElement = autorWrap.querySelector('div > span');

                const nickname = nicknameElement ? nicknameElement.innerText : '';
                const time = timeElement ? timeElement.innerText : '';

                const matchedComment = comments.find(comment => comment.user_nick === nickname.split('(')[0] && comment.reg_date === time);

                if (matchedComment) {
                    const button = document.createElement('button');
                    button.innerHTML = `
                        <svg width="76" height="28" viewBox="0 0 76 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="74" height="26" rx="3" stroke="#7A97FF" stroke-width="2"/>
                            <path d="M36.7051 10.0215V15.4219H35.4551V10.0215H36.7051ZM33.8438 10.5391V13.2344H30.9531V14.0352C32.4375 14.0254 33.4824 13.9766 34.6836 13.791L34.8398 14.7871C33.4727 15.0117 32.2812 15.0508 30.5137 15.0508H29.7324V12.3066H32.6035V11.5449H29.7227V10.5391H33.8438ZM33.6875 15.5684C35.5918 15.5684 36.7539 16.1641 36.7637 17.2285C36.7539 18.2832 35.5918 18.8984 33.6875 18.8984C31.793 18.8984 30.6309 18.2832 30.6309 17.2285C30.6309 16.1641 31.793 15.5684 33.6875 15.5684ZM33.6875 16.5352C32.4961 16.5352 31.8711 16.7598 31.8711 17.2285C31.8711 17.6973 32.4961 17.9316 33.6875 17.9316C34.8789 17.9316 35.5039 17.6973 35.5137 17.2285C35.5039 16.7598 34.8789 16.5352 33.6875 16.5352ZM45.1816 10.793V11.8281C45.1816 13.1172 45.1816 14.3574 44.7715 16.2812L43.5312 16.1641C43.707 15.4219 43.8047 14.7725 43.873 14.1719L38.7168 14.4258L38.5605 13.4297L43.9316 13.2344C43.9561 12.751 43.9561 12.2871 43.9609 11.8281V11.7891H38.834V10.793H45.1816ZM46.0117 16.8184V17.834H37.9062V16.8184H46.0117ZM52.8574 15.5488C54.8008 15.5488 56.0215 16.1641 56.0312 17.2285C56.0215 18.2734 54.8008 18.8984 52.8574 18.8984C50.9336 18.8984 49.6934 18.2734 49.6934 17.2285C49.6934 16.1641 50.9336 15.5488 52.8574 15.5488ZM52.8574 16.4766C51.6367 16.4766 50.9336 16.7305 50.9336 17.2285C50.9336 17.707 51.6367 17.9512 52.8574 17.9512C54.0781 17.9512 54.791 17.707 54.791 17.2285C54.791 16.7305 54.0781 16.4766 52.8574 16.4766ZM55.9824 10.4121V11.1348C55.9824 11.8379 55.9824 12.5996 55.7285 13.5176L54.5078 13.4004C54.7031 12.5947 54.7275 11.9941 54.7422 11.3887H49.7812V10.4121H55.9824ZM56.9395 13.9766V14.9824H48.873V13.9766H51.9004V12.4238H53.1309V13.9766H56.9395ZM65.6211 14.9531V15.959H63.7168V18.8984H62.4473V15.959H60.6309V18.8984H59.3516V15.959H57.4863V14.9531H65.6211ZM61.5293 10.3047C63.4336 10.3047 64.7715 11.0957 64.7715 12.3164C64.7715 13.5176 63.4336 14.2695 61.5293 14.2695C59.625 14.2695 58.2969 13.5176 58.3066 12.3164C58.2969 11.0957 59.625 10.3047 61.5293 10.3047ZM61.5293 11.3008C60.3379 11.3008 59.5762 11.6621 59.5859 12.3164C59.5762 12.9414 60.3379 13.293 61.5293 13.293C62.7305 13.293 63.4824 12.9414 63.4824 12.3164C63.4824 11.6621 62.7305 11.3008 61.5293 11.3008Z" fill="#7A97FF"/>
                            <path d="M12 14V18C12 18.2652 12.1054 18.5196 12.2929 18.7071C12.4804 18.8946 12.7348 19 13 19H19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18V14" stroke="#7A97FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18 11L16 9L14 11" stroke="#7A97FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 9V15.5" stroke="#7A97FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`;
                    button.style.padding = '2px 4px';
                    button.style.border = 'none';
                    button.style.borderRadius = '4px';
                    button.style.backgroundColor = 'transparent';
                    button.style.cursor = 'pointer';
                    button.dataset.comment = matchedComment.p_comment_no;

                    button.addEventListener('click', function() {
                        const commentId = this.dataset.comment;
                        let url = window.location.href;

                        // #으로 시작하는 selector가 있는지 확인
                        if (url.includes('#')) {
                            // # 이후의 부분을 제거
                            url = url.split('#')[0];
                        }

                        // 새로운 URL 생성
                        const newUrl = `${url}#comment_noti${commentId}`;

                        // 사용자 지정 메시지 생성
                        const message = `링크가 클립보드에 복사되었습니다.\n${newUrl}`;

                        // 클립보드에 복사
                        navigator.clipboard.writeText(newUrl).then(() => {
                            console.log('URL이 클립보드에 복사되었습니다.');
                            // toast 메시지 표시
                            toastr.success('URL이 클립보드에 복사되었습니다.', '복사 완료', {
                                timeOut: 3000,
                                positionClass: "toast-bottom-center",
                            });
                        }).catch(err => {
                            console.error('클립보드 복사 중 에러 발생:', err);
                            // toast 에러 메시지 표시
                            toastr.error('클립보드 복사 중 에러 발생', '오류', {
                                timeOut: 3000,
                                positionClass: "toast-bottom-center",
                            });
                        });
                    });

                    cmmtBtn.appendChild(button);
                    console.log(`Button added to comment with ID: ${matchedComment.p_comment_no}`);
                } else {
                    console.warn(`No matching comment found for nickname: ${nickname}, time: ${time}`);
                }
            } else {
                console.warn('Missing autor_wrap or util element in comment element', element);
            }
        });
    }

    // 페이지 로드 후 실행
    window.addEventListener('load', async () => {
        console.log('Page loaded');
        setTimeout(async () => {
            try {
                const comments = await fetchComments(bj_id, post_id);
                addButtonToComments(comments);
                toastr.success('링크 공유 버튼 로딩을 완료했어요!', '성공', {
                    timeOut: 2000,
                    positionClass: "toast-bottom-center",
                });
            } catch (e) {
                toastr.error('링크 공유 버튼 로딩 중 에러가 발생했습니다', '오류', {
                    timeOut: 3000,
                    positionClass: "toast-bottom-center",
                });
            }
        }, 1000); // 1초 지연
    });

})();
