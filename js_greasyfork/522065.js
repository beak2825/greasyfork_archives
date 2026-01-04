// ==UserScript==
// @name         이터널 리턴 갤러리 통합 스크립트 (Beta)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  이터널 리턴 마이너 갤러리와 인방 미니 갤러리를 통합해서 보여줍니다
// @author       ㅇㅇ
// @match        https://gall.dcinside.com/mgallery/board/lists*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/522065/%EC%9D%B4%ED%84%B0%EB%84%90%20%EB%A6%AC%ED%84%B4%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%86%B5%ED%95%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522065/%EC%9D%B4%ED%84%B0%EB%84%90%20%EB%A6%AC%ED%84%B4%20%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%ED%86%B5%ED%95%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%20%28Beta%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // URL 파라미터 파싱 함수
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            list_num: parseInt(params.get('list_num') || '50'),
            page: parseInt(params.get('page') || '1'),
            exception_mode: params.get('exception_mode'),
            search_head: params.get('search_head'),
            s_type: params.get('s_type') 
        };
    }

    // 게시글 파싱 함수 수정
    function parsePostsList(html, isMini) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const posts = [];
        const notices = [];

        doc.querySelectorAll('.ub-content').forEach(row => {
            const isNotice = row.classList.contains('notice');
            const writerInfo = row.querySelector('.gall_writer');
            const isAdmin = writerInfo.querySelector('b')?.textContent === '운영자';
            const subject = row.querySelector('.gall_subject')?.textContent;
            const isNoticeSubject = subject === '공지';

            // 제목 색상 처리
            const title = row.querySelector('.gall_tit').innerHTML;
            const modifiedTitle = title.replace(
                'gall_subject',
                `gall_subject" style="color: ${isMini ? '#6f6dd8' : '#000'}`
            );

            const post = {
                number: parseInt(row.querySelector('.gall_num').textContent.trim()),
                title: modifiedTitle,
                author: writerInfo.innerHTML,
                date: parseDate(row.querySelector('.gall_date').textContent.trim()),
                views: parseInt(row.querySelector('.gall_count').textContent.trim()),
                recommend: parseInt(row.querySelector('.gall_recommend').textContent.trim()),
                html: row.outerHTML.replace(
                    'gall_subject',
                    `gall_subject" style="color: ${isMini ? '#6f6dd8' : '#000'}`
                ),
                isMini: isMini,
                isNotice: isNotice,
                isAdmin: isAdmin,
                isNoticeSubject: isNoticeSubject
            };

            // 공지글이나 운영자 글이나 공지 말머리를 가진 글은 notices 배열에 추가
            if (isNotice || isAdmin || isNoticeSubject) {
                notices.push(post);
            } else {
                posts.push(post);
            }
        });

        return { posts, notices };
    }

    // 날짜 파싱 함수 수정 
    function parseDate(dateStr) {
        const now = new Date();
        const seoulDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

        // "HH:MM" 형식 (오늘)
        if (dateStr.includes(':')) {
            const [hours, minutes] = dateStr.split(':').map(Number);
            const date = new Date(seoulDate.getFullYear(), seoulDate.getMonth(), seoulDate.getDate(), hours, minutes);
            // 밤 12시 이후면 내일 날짜로 변경
            if (hours < seoulDate.getHours() || (hours === seoulDate.getHours() && minutes <= seoulDate.getMinutes())) {
                date.setDate(date.getDate() - 1);
            }
            return date;
        }

        // "MM.DD" 형식 (올해)  
        if (dateStr.match(/^\d{2}\.\d{2}$/)) {
            const [month, day] = dateStr.split('.').map(Number);
            return new Date(seoulDate.getFullYear(), month - 1, day);
        }

        // "YY.MM.DD" 형식
        if (dateStr.match(/^\d{2}\.\d{2}\.\d{2}$/)) {
            const [year, month, day] = dateStr.split('.').map(Number);
            return new Date(2000 + year, month - 1, day);
        }

        return new Date(0); // 파싱 실패시 가장 오래된 날짜로
    }

    // 갤러리 크롤링 함수
    async function crawlGallery(gallId, isMini, listNum, exceptionMode) {
        const baseUrl = isMini ?
            'https://gall.dcinside.com/mini/board/lists' :
            'https://gall.dcinside.com/mgallery/board/lists/';
        const posts = [];
        const notices = [];

        for (let page = 1; page <= 5; page++) {
            const url = `${baseUrl}?id=${gallId}&page=${page}&list_num=${listNum}${exceptionMode ? '&exception_mode=' + exceptionMode : ''}`;

            try {
                const response = await fetch(url);
                const html = await response.text();
                const parsed = parsePostsList(html, isMini);  // isMini 파라미터 추가
                posts.push(...parsed.posts);
                if (page === 1) notices.push(...parsed.notices);
            } catch (error) {
                console.error(`Error crawling page ${page}:`, error);
            }
        }

        return { posts, notices };
    }

    // 메인 함수 수정
    async function init() {
        const params = getUrlParams();

        // search_head나 s_type이 있으면 실행하지 않음
        if (params.search_head || params.s_type) return;

        // 현재 갤러리가 본갤이나 인갤이 아니면 실행하지 않음
        if (params.id !== 'bser' && params.id !== 'ertv') return;

        // 개념글 모드에서는 1페이지만 작동
        if (params.exception_mode && params.page > 1) return;

        // 일반 모드에서는 6페이지 이상이면 원본 페이지 그대로 표시
        if (!params.exception_mode && params.page > 5) return;

        const currentIsMinor = params.id === 'ertv';

        // 본갤과 인갤 크롤링
        const [mainGall, streamGall] = await Promise.all([
            crawlGallery('bser', false, params.list_num, params.exception_mode),
            crawlGallery('ertv', true, params.list_num, params.exception_mode)
        ]);

        // 게시글 통합 및 정렬
        const allPosts = [...mainGall.posts, ...streamGall.posts].sort((a, b) => {
            // 날짜가 같은 경우 게시글 번호로 정렬
            const dateCompare = b.date - a.date;
            if (dateCompare === 0) {
                // 같은 갤러리면 번호로, 다른 갤러리면 시간순
                if (a.isMini === b.isMini) {
                    return b.number - a.number;
                }
                return b.number / (b.isMini ? 100 : 1) - a.number / (a.isMini ? 100 : 1);
            }
            return dateCompare;
        });

        // 현재 갤러리에 해당하는 공지글만 필터링
        const currentGalleryNotices = currentIsMinor ?
            streamGall.notices : mainGall.notices;

        // 현재 페이지에 해당하는 게시글만 필터링
        const startIdx = (params.page - 1) * params.list_num;
        const endIdx = startIdx + params.list_num;
        const currentPagePosts = allPosts.slice(startIdx, endIdx);

        // 게시글 목록 갱신
        const tbody = document.querySelector('.gall_list tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        // 1페이지일 때만 공지글 표시
        if (params.page === 1) {
            // 공지글 먼저 추가 (운영자 공지 포함)
            let noticeHtml = '';
            document.querySelectorAll('.notice').forEach(notice => {
                noticeHtml += notice.outerHTML;
            });
            tbody.insertAdjacentHTML('beforeend', noticeHtml);

            // 현재 갤러리 공지글 추가
            currentGalleryNotices.forEach(notice => {
                tbody.insertAdjacentHTML('beforeend', notice.html);
            });
        }

        // 일반 게시글 추가
        currentPagePosts.forEach(post => {
            tbody.insertAdjacentHTML('beforeend', post.html);
        });

        // 페이지네이션 업데이트 (개념글일 경우 1페이지만, 일반글일 경우 5페이지까지)
        const maxPosts = params.exception_mode ?
            Math.min(allPosts.length, params.list_num) :
            Math.min(allPosts.length, params.list_num * 5);

        updatePagination(maxPosts, params.list_num);
    }

    // 페이지네이션 업데이트 함수
    function updatePagination(totalPosts, listNum) {
        const maxPages = Math.min(Math.ceil(totalPosts / listNum), 10);
        const pagination = document.querySelector('.bottom_paging_box');
        if (!pagination) return;

        // 페이지네이션 HTML 생성
        let html = '';
        for (let i = 1; i <= maxPages; i++) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('page', i);
            html += `<a href="${currentUrl.toString()}">${i}</a>`;
        }

        pagination.innerHTML = html;
    }

    // 스크립트 실행
    init();
})();
