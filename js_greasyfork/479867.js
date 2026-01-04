// ==UserScript==
// @name         TOKIS Comments Manager
// @namespace    https://github.com/Eta7H/TOKIS-Comments-Manager
// @version      0.1
// @description  Toggle the visibility of comments on TOKIS websites.
// @author       You
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @include      https://manatoki*.net/*
// @include      https://newtoki*.com/*
// @include      https://booktoki*.com/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479867/TOKIS%20Comments%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/479867/TOKIS%20Comments%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 메뉴를 등록하는 함수
    function registerMenu() {
        GM_registerMenuCommand("댓글 섹션 초기 상태 토글", () => {
            var isExpanded = GM_getValue("isCommentsExpanded", false);
            GM_setValue("isCommentsExpanded", !isExpanded);
            alert("댓글 섹션 초기 상태가 " + (isExpanded ? "접혀있는 상태" : "펼쳐있는 상태") + "로 설정되었습니다. 변경사항을 적용하려면 페이지를 새로고침하세요.");
        });
    }

    // 메뉴 등록
    registerMenu();

    // 'viewcomment' 요소의 초기 상태
    var isExpanded = GM_getValue("isCommentsExpanded", false);

    var viewCommentElem = document.getElementById('viewcomment');
    if (viewCommentElem) {
        // 버튼 생성
        var toggleButton = document.createElement('button');
        toggleButton.innerHTML = isExpanded ? '닫' : '열기';
        viewCommentElem.parentNode.insertBefore(toggleButton, viewCommentElem);

        // 초기 상태 설정
        viewCommentElem.style.display = isExpanded ? 'block' : 'none';

        // 버튼 클릭 이벤트
        toggleButton.addEventListener('click', function() {
            isExpanded = !isExpanded;
            viewCommentElem.style.display = isExpanded ? 'block' : 'none';
            toggleButton.innerHTML = isExpanded ? '닫기' : '열기';
        });
    }
})();
