// ==UserScript==
// @name         사클 다크 모드
// @namespace    https://guns.lol/P4L0N
// @version      1.0
// @description  검은색으로 만들어준다
// @author       P4L0N
// @match        *://soundcloud.com/*
// @grant        none
// @license      This code is proprietary and cannot be used, modified, or distributed without explicit permission from the author.
// @downloadURL https://update.greasyfork.org/scripts/512056/%EC%82%AC%ED%81%B4%20%EB%8B%A4%ED%81%AC%20%EB%AA%A8%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/512056/%EC%82%AC%ED%81%B4%20%EB%8B%A4%ED%81%AC%20%EB%AA%A8%EB%93%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for dark mode
    const style = document.createElement('style');
    style.innerHTML = `
        /* 기본 배경과 텍스트 색상 */
        body, html, .page, .content {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 헤더와 기타 상단 요소들 */
        .header,
        .header__wrapper,
        .header__navMenu,
        .header__top,
        .sc-artwork, 
        .sc-artwork-list, 
        .sc-artwork-placeholder,
        .sidebar, 
        .relatedTracks, 
        .relatedTracks__title {
            background-color: #000000 !important;
        }

        /* 헤더 메뉴의 배경 수정 */
        .headerMenu,
        .headerMenu__moreMenu,
        .headerMenu__profileMenu,
        .headerMenu__dropdown,
        .m-light,
        .headerMenu.m-light,
        .headerMenu__moreMenu.m-light,
        .headerMenu__profileMenu.m-light {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* SoundCloud 로고에서 배경을 제거하고 아이콘만 표시 */
        .header__logo {
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/SoundCloud_logo_%282014%29.svg/512px-SoundCloud_logo_%282014%29.svg.png') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-color: transparent !important; /* 배경 제거 */
        }

        /* 로고 크기 설정 */
        .header__logo {
            width: 150px; /* 원하는 크기로 조정 */
            height: 50px;
        }

        /* sc-button-group 및 sc-button-group-small 버튼 그룹 배경 색상 변경 */
        .sc-button-group, 
        .sc-button-group-small, 
        .sc-button {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 링크와 버튼 색상 */
        a {
            color: #ffffff !important;
        }
        button, .sc-button {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 흰색 경계선 제거 및 박스 그림자 제거 */
        * {
            border-color: #000000 !important;
            box-shadow: none !important;
        }

        /* 댓글 텍스트 흰색으로 수정 */
        .commentsList__item, .commentItem__body {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 댓글 입력란 및 프로필 이미지 테두리 제거 */
        .commentForm__inputWrapper, 
        .commentForm__input,
        .commentItem__avatarImage {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #000000 !important; /* 프로필 이미지 테두리 검은색으로 */
        }

        /* 댓글 창이 포커스될 때도 유지 */
        .commentForm__inputWrapper.focused .commentForm__input {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* commentForm__wrapper 및 commentForm__transition 수정 */
        .commentForm__wrapper, 
        .commentForm__transition {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* soundBadge__additional 배경색 검정으로 변경 */
        .soundBadge__additional {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* soundBadge compact sc-media m-interactive m-playable 배경색 검정으로 변경 */
        .soundBadge.compact,
        .sc-media.m-interactive.m-playable {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* soundBadge compact sc-media m-interactive m-playable hover 상태에서 배경 흰색 제거 */
        .soundBadge.compact:hover,
        .sc-media.m-interactive.m-playable:hover {
            background-color: #000000 !important; /* 검정 배경 강제 유지 */
            color: #ffffff !important;
        }

        /* commentItem__timestampLink 검정으로 변경 */
        .commentItem__timestampLink {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 하단 플레이 컨트롤러의 배경과 색상 */
        .playControls__inner, 
        .playbackTimeline__progressBackground,
        .volume__sliderWrapper, 
        .playControls__elements {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 플레이어에서 재생 버튼 등의 아이콘 색상 */
        .playControls__control, 
        .playControls__soundBadge, 
        .playControls__elements button {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 기타 요소들 */
        .compactTrackListItem,
        .trackItem,
        .dropdownContent__container,
        .dropdownContent__main,
        .popup__main,
        .modal__content {
            background-color: #000000 !important;
            color: #ffffff !important;
        }

        /* 검색 및 입력 필드 */
        input[type="text"], input[type="search"], textarea {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #ffffff !important;
        }

        /* 테두리와 아래선 제거 */
        .sc-border-light, .sc-border {
            border-color: #000000 !important;
            border-bottom: none !important;
        }

        /* modal 및 overlay 배경 반투명 검은색 */
        .modal__modal,
        .sc-border-box,
        .g-z-index-modal-content,
        .modal,
        .g-z-index-modal-background,
        .g-opacity-transition,
        .g-z-index-overlay,
        .modalWhiteout,
        .showBackground,
        .g-backdrop-filter-grayscale {
            background-color: rgba(0, 0, 0, 0.8) !important; /* 반투명 검은색 */
            color: #ffffff !important;
        }

        /* 마우스 hover 시 headerMenu__link와 profileMenu__profile의 색상을 진한 회색으로 */
        .headerMenu__link:hover,
        .profileMenu__profile:hover {
            background-color: #333333 !important;
            color: #ffffff !important;
        }
    `;

    // 페이지에 스타일 추가
    document.head.appendChild(style);
})();
