// ==UserScript==
// @name         아카라이브 채널 글 목록 열람 애드온
// @namespace    uaaig
// @version      0.1
// @description  아카라이브 닉네임 기반 글 검색 경로 단축 스크립트
// @author       uaaig
// @match        https://arca.live/b/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455384/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%B1%84%EB%84%90%20%EA%B8%80%20%EB%AA%A9%EB%A1%9D%20%EC%97%B4%EB%9E%8C%20%EC%95%A0%EB%93%9C%EC%98%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455384/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EC%B1%84%EB%84%90%20%EA%B8%80%20%EB%AA%A9%EB%A1%9D%20%EC%97%B4%EB%9E%8C%20%EC%95%A0%EB%93%9C%EC%98%A8.meta.js
// ==/UserScript==

/* *********** 설정 *********** */
var onlyFixedNickname = false; // 고닉에 대해서만 기능 활성화하려면 true, 반고닉에 대해서도 활성화하려면 false (기본 false)
var openInNewTab = true; // 검색 결과 페이지를 새 탭에서 열려면 true, 현재 탭에서 열려면 false (기본 true)
/* **************************** */

// 현재 채널명 추출
var channel = location.href.slice(location.href.indexOf('https://arca.live/b/') + 'https://arca.live/b/'.length).split('/')[0].split('?')[0];

// DOM 변화 감지 스니펫 (https://stackoverflow.com/questions/3219758)
var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
        if (!obj || obj.nodeType !== 1) return;

        if (MutationObserver) {
            var mutationObserver = new MutationObserver(callback);

            // 대상의 자손 변경 감시
            mutationObserver.observe(obj, { childList:true, subtree:true });
            return mutationObserver;
        }

        // 폴리필
        else if (window.addEventListener) {
            obj.addEventListener('DOMNodeInserted', callback, false)
            obj.addEventListener('DOMNodeRemoved', callback, false)
        }
    }
})()

// 유동이 아닌 계정에 대해 글 목록 열람 링크 생성
var uaaig_createButton = function() {
    // 중복 호출 방지를 위해 잠시 옵저버 비활성화
    if (MutationObserver) {
        observer.disconnect();
    }
    else if (window.addEventListener) {
        target.removeEventListener('DOMNodeInserted', callback, false)
        target.removeEventListener('DOMNodeRemoved', callback, false)
    }
    // 글 작성자, 댓글 작성자에 대해 동작
    let elmList = document.querySelectorAll('.article-head .user-info a[href^="/u/@"], .article-comment .user-info a[href^="/u/@"]')
    for (let i = 0; i < elmList.length; ++i) {
        let elm = elmList[i],
            href = elm.href,
            userId = href.slice(href.indexOf('/u/') + '/u/'.length),
            userInfo = elm.closest('.user-info');

        // 이미 링크가 있다면 무시
        if (userInfo.querySelector('a[name="uaaig_searchArticles"]')) continue

        // 설정에 따라 반고닉에 대한 기능 활성화 여부 결정됨
        if (onlyFixedNickname && userId.split('/').length > 1) continue

        // 닉네임 부분만 추출
        userId = userId.split('/')[0];

        // 정상적인 닉네임이 추출되었는지 확인하고 글쓴이 닉네임 기반 검색 결과 페이지 링크 생성
        if (userId.split('@').length === 2 && userId.indexOf('@') === 0) {
            let nickname = userId.slice(1),
                url = `https://arca.live/b/${channel}?target=nickname&keyword=${nickname}`;

            // 검색 결과 페이지를 새로 여는 링크를 추가
            userInfo.innerHTML += ` <a href="${url}" name="uaaig_searchArticles" ${openInNewTab?'target="_blank" rel="noopener noreferrer"':''} style="padding-left: 4px; padding-right: 4px;">작성글 검색</a> `
        }
    }

    // 옵저버 새로 생성
    observer = observeDOM(target, callback);
}

// 댓글란 변화 감지되면 링크 재생성
var target = document.querySelector('.article-comment'),
    callback = uaaig_createButton,
    observer = observeDOM(target, callback);

if (target && callback && observer) {
    uaaig_createButton();
}